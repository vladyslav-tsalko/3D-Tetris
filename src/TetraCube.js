class TetraCube{
    constructor() {
        this.colors = [];
        this.colorBuffer = gl.createBuffer();

        // initialize model and modelView matrices
        this.modelViewMatrix = mat4.create();
        this.normalMatrix = mat3.create();

        this.cubeMatrices = [];
        this.cubeOrigins = [];

        this.origin = [];
        this.isPositioned = false;
        this.isSpeededUp = false;
    }

    initData(colors, origin = null) {
        this.origin = origin;
        this.colors = new Float32Array(colors.flat());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    }

    isEmpty(){
        return (this.cubeMatrices.length === 0);
    }

    addCube(cubeMatrix){
        this.cubeMatrices.push(cubeMatrix);
        this.cubeOrigins.push(scene.mainBufferCube.getVertexCoordinatesFromVectorByMatrix(cubeMatrix, [1,1,1]));
    }

    removeCubes(plane){
        let removedCubeOrigins = [];
        let index = 0;
        for(let i = 0; i<plane.length; i++){
            if(plane[i] !== 0){
                index = i;
                break;
            }
        }
        if(plane[index] !== 0){
            for(let i = this.cubeOrigins.length-1; i>=0; i--){
                if(this.cubeOrigins[i][index] === plane[index]){
                    removedCubeOrigins.push(this.cubeOrigins[i]);
                    this.cubeOrigins.splice(i, 1);
                    this.cubeMatrices.splice(i, 1);
                }
            }
        }
        return removedCubeOrigins;
    }

    draw(){
        this.cubeMatrices.forEach(matrix => {
            this.#drawing(matrix);
        });
    }

    translate(vector) {
        if(this.isCollided(vector)){
            if(this.isPositioned){
                for(const matrix of this.cubeMatrices) {
                    TetraCube.roundArray(matrix);
                }
                for(const origin of this.cubeOrigins) {
                    TetraCube.roundArray(origin);
                    if(origin[1] > Grid.dimensions.height * Grid.dimensions.fieldSize){
                        gameRules.isGameEnded = true;
                        break;
                    }
                }
            }
            return;
        }
        this.cubeMatrices.forEach(matrix => {
            TetraCube.#translation(matrix, vector);
        });
        this.#translateOrigins(vector);
    }

    fall(vector, maxPlaneNum) {
        let removedCubeOriginsY = []
        let addedCubeOriginsY = []
        for(let i = 0; i < this.cubeOrigins.length; i++){
            if(this.cubeOrigins[i][1] > maxPlaneNum){
                removedCubeOriginsY.push(this.cubeOrigins[i][1]);
                TetraCube.#translation(this.cubeMatrices[i], vector);
                this.cubeOrigins[i][1] += vector[1];
                addedCubeOriginsY.push(this.cubeOrigins[i][1]);
            }
        }
        this.origin[1] -= vector[1]
        return [removedCubeOriginsY, addedCubeOriginsY];
    }

    rotate(angle, axis) {
        if(this.isCollided(null, angle, axis)){
            return;
        }
        for(let i = 0; i < this.cubeMatrices.length; i++){
            this.cubeOrigins[i] = TetraCube.#rotation(this.cubeMatrices[i], this.origin, angle, axis, this.cubeOrigins[i])     
        }
    }

    isCollided(vector, angle = null, axis = null){
        if(vector !== null && angle === null && axis === null){
            for(const matrix of this.cubeMatrices) {
                const type = TetraCube.#checkCollisionTranslation(matrix, vector);
                if(type === 'wall'){
                    return true;
                }else if(type === 'floor'){
                    this.isPositioned = true;
                    return true;
                }
            }
        }
        else if(vector === null && angle !== null && axis !== null){
            for(const matrix of this.cubeMatrices) {
                const type = this.#checkCollisionRotation(matrix, angle, axis);
                if(type === 'wall'){
                    return true;
                }
            }
        }
        return false;
        
    }

    #translateOrigins(vector){
        for(let i = 0; i<3; i++){
            this.origin[i] += vector[i]
        }
        for(let i = 0; i < this.cubeOrigins.length; i++){
            for(let j = 0; j<3; j++){
                this.cubeOrigins[i][j] += vector[j]
            }
        }
    }

    #drawing(matrix){
        TetraCube.#setupAttribute(scene.mainBufferCube.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        TetraCube.#setupAttribute(this.colorBuffer, currentShaderProgram.attributes.colorLocation);
        TetraCube.#setupAttribute(scene.mainBufferCube.buffers.normalBuffer, currentShaderProgram.attributes.normalLocation);

        // combine view and model matrix into modelView matrix
        mat4.mul(this.modelViewMatrix, matrices.viewMatrix, matrix);

        // construct normal matrix as inverse transpose of modelView matrix
        mat3.normalFromMat4(this.normalMatrix, this.modelViewMatrix);

        // send modelView matrix to GPU
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, this.modelViewMatrix);
        gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);
        // draw the object
        gl.drawArrays(gl.TRIANGLES, 0, scene.mainBufferCube.vertices.length / 3);
    }

    static #rotation(matrix, point, angle, axis, origin){
        // Create the translation matrices
        //translation to origin
        const translationToPoint = mat4.create();
        mat4.translate(translationToPoint, translationToPoint, vec3.negate(vec3.create(), point));
        //translation back
        const translationBack = mat4.create();
        mat4.translate(translationBack, translationBack, point);
    
        const rotationMatrix = mat4.create();
        mat4.fromRotation(rotationMatrix, angle, axis);
    
        // Combine the transformations: translation to origin -> rotation -> translation back
        const combinedMatrix = mat4.create();
        mat4.mul(combinedMatrix, translationBack, rotationMatrix);
        mat4.mul(combinedMatrix, combinedMatrix, translationToPoint);
    
        mat4.mul(matrix, combinedMatrix, matrix);
        
        matrix = TetraCube.roundArray(matrix);
        if(origin === null){
            return;
        }
        let origin4 = vec4.fromValues(origin[0], origin[1], origin[2], 1);
        mat4.mul(origin4, combinedMatrix, origin4);
        origin = vec3.fromValues(origin4[0], origin4[1], origin4[2]);
        origin = TetraCube.roundArray(origin);
        return origin;
    }
    
    static #translation(modelMatrix, vector){
        let identityMatrix = mat4.create();
        mat4.translate(identityMatrix, identityMatrix, vector); //transalte matrix
        mat4.mul(modelMatrix, identityMatrix, modelMatrix)
    }


    static #checkCollisionTranslation(modelMatrix, vector){
        const tempModelMatrix = mat4.create();
        mat4.set(tempModelMatrix, ...modelMatrix);

        TetraCube.#translation(tempModelMatrix, vector);

        for(let i = 0; i < scene.mainBufferCube.boundVertices.length; i = i + 3){
            const transformedVertex = scene.mainBufferCube.getVertexCoordinatesFromIndicesByMatrix(tempModelMatrix, i, (i+1), (i+2));

            if(transformedVertex[0] < 0 || transformedVertex[0] > Grid.dimensions.fieldSize * Grid.dimensions.width){
                return 'wall';
            } 
            else if(transformedVertex[1] < 0) {
                return 'floor';
            } 
            else if(transformedVertex[2] < 0 || transformedVertex[2] > Grid.dimensions.fieldSize * Grid.dimensions.width) {
                return 'wall';
            }   
        }
        return TetraCube.#checkCollisionWithTetraCubes(tempModelMatrix, vector[1]);

    }

    #checkCollisionRotation(modelMatrix, angle, axis){
        let tempModelMatrix = mat4.create();
        mat4.set(tempModelMatrix, ...modelMatrix);

        TetraCube.#rotation(tempModelMatrix, this.origin, angle, axis, null);

        for(let i = 0; i < scene.mainBufferCube.boundVertices.length; i = i + 3){
            const transformedVertex = scene.mainBufferCube.getVertexCoordinatesFromIndicesByMatrix(tempModelMatrix, i, (i+1), (i+2))

            if(transformedVertex[0] < 0 || transformedVertex[0] > Grid.dimensions.fieldSize * Grid.dimensions.width){
                return 'wall';
            } 
            else if(transformedVertex[1] < 0) {
                return 'wall';
            } 
            else if(transformedVertex[2] < 0 || transformedVertex[2] > Grid.dimensions.fieldSize * Grid.dimensions.width) {
                return 'wall';
            }
        }
        return TetraCube.#checkCollisionWithTetraCubes(tempModelMatrix, 0);
    }

    static #checkCollisionWithTetraCubes(tempModelMatrix, isYDirection){
        if(!scene.isEmpty()){
            for(let i = 0; i<scene.tetraCubes.length; i++){
                for(let j = 0; j<scene.tetraCubes[i].cubeMatrices.length; j++){
                    const resp = TetraCube.#checkCollisionWithTetraCube(tempModelMatrix, scene.tetraCubes[i].cubeMatrices[j], isYDirection);
                    if(resp !== ''){
                        return resp;
                    }
                }
            }
        }
        return '';
    }

    static #checkCollisionWithTetraCube(modelMatrixThis, modelMatrixCube, topDirection){
        let countSameXZ = 0; // === 8*2
        let countSameY = 0; //>3

        for(let i = 0; i < scene.mainBufferCube.boundVertices.length; i = i + 3){
            const transformedVertexThis = scene.mainBufferCube.getVertexCoordinatesFromIndicesByMatrix(modelMatrixThis, i, (i+1), (i+2));

            for(let j = 0; j < scene.mainBufferCube.boundVertices.length; j = j + 3){
                const transformedVertexCube = scene.mainBufferCube.getVertexCoordinatesFromIndicesByMatrix(modelMatrixCube, j, (j+1), (j+2));

                if(transformedVertexThis[0] === transformedVertexCube[0] && transformedVertexThis[2] === transformedVertexCube[2]) {
                    countSameXZ++;
                    if(transformedVertexThis[1] < transformedVertexCube[1]){
                        countSameY++;
                    }
                    if(countSameXZ === 16 && countSameY > 3){
                        if(topDirection !== 0){
                            return 'floor';
                        }
                        else{
                            return 'wall';
                        }
                    }
                }
            }
        }
        return '';
    }

    static #setupAttribute(buffer, location) {
        if (location === -1) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            3, // number of elements for each vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // should data be normalised?
            0, // stride
            0 // offset
        );

        // enable the attribute
        gl.enableVertexAttribArray(location);
    }

    static roundArray(array){
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.round(array[i]);
        }
        return array;
    }
}


