import {Grid} from './Grid.js';
import {shaderPrograms} from './ShaderProgram.js';
import {mat4, matrices, gl} from './Main.js';

export class View{
    constructor(aspectRatio){
        //this.isCameraMoving = false;
        this.isPerspective = null;
        this.aspectRatio = aspectRatio;
        this.perspectiveData = {
            lookAt: {
                eye: [30, Grid.dimensions.height * Grid.dimensions.fieldSize, 20],
                at: [-10, 5, -5]
            },
            fov: 45,
            fovMinMax: {
                min: 15,
                max: 75
            }
        }

        this.orthoData = {
            lookAt:{
                eye: [20, Grid.dimensions.height * Grid.dimensions.fieldSize, 15],
                at: [-30, -10, -20]
            },
            projSize: 13,
            projSizeMinMax: {
                min: 8,
                max:18
            }
        }
    }

    enablePerspective(){
        for (const [_, shaderInstance] of Object.entries(shaderPrograms)) {
            shaderInstance.enable();
            mat4.perspective(matrices.projectionMatrix, toRad(this.perspectiveData.fov), this.aspectRatio, 0.1, 100);
            mat4.lookAt(matrices.viewMatrix, this.perspectiveData.lookAt.eye, this.perspectiveData.lookAt.at, [0, 1, 0]); 
            gl.uniformMatrix4fv(shaderInstance.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
        }
        this.isPerspective = true;
    }

    enableOrtho(){
        for (const [_, shaderInstance] of Object.entries(shaderPrograms)) {
            shaderInstance.enable();
            mat4.ortho(matrices.projectionMatrix, -this.orthoData.projSize * this.aspectRatio, this.orthoData.projSize * this.aspectRatio, -this.orthoData.projSize, this.orthoData.projSize, 0.1, 100);
            mat4.lookAt(matrices.viewMatrix, this.orthoData.lookAt.eye, this.orthoData.lookAt.at, [0, 1, 0]); 
            gl.uniformMatrix4fv(shaderInstance.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
        }
        this.isPerspective = false;
    }

    changeView(){
        if(this.isPerspective){
            this.enableOrtho();
        }else{
            this.enablePerspective();
        }
    }

    resetView(){
        if(this.isPerspective){
            this.perspectiveData.lookAt.eye = [30, Grid.dimensions.height * Grid.dimensions.fieldSize, 20];
            this.perspectiveData.lookAt.at = [-10, 5, -5]
            this.perspectiveData.fov = 45;
            this.enablePerspective();
        }else{
            this.orthoData.lookAt.eye = [20, Grid.dimensions.height * Grid.dimensions.fieldSize, 15];
            this.orthoData.lookAt.at = [-30, -10, -20];
            this.orthoData.projSize = 13;
            this.enableOrtho();
        }
    }

    zoomIn(){
        if(this.isPerspective){
            if(this.perspectiveData.fov - 5 >= this.perspectiveData.fovMinMax.min){
                this.perspectiveData.fov -= 5;
                this.#applyPerspectiveProjMatrix();
            }
        }else{
            if(this.orthoData.projSize - 0.5 >= this.orthoData.projSizeMinMax.min){
                this.orthoData.projSize -= 0.5
                this.#applyOrthoProjMatrix();
            }
        }
    }

    zoomOut(){
        if(this.isPerspective){
            if(this.perspectiveData.fov + 5 <= this.perspectiveData.fovMinMax.max){
                this.perspectiveData.fov += 5;
                this.#applyPerspectiveProjMatrix();
            }
        }else{
            if(this.orthoData.projSize + 0.5 <= this.orthoData.projSizeMinMax.max){
                this.orthoData.projSize += 0.5
                this.#applyOrthoProjMatrix()
            }
        }
    }

    rotateCamera(axis, angle = Math.PI / 2){
        const rotMatrix = this.#getRotationMatrix(axis, angle);
        if(this.isPerspective){
            for (let [_, vector] of Object.entries(this.perspectiveData.lookAt)) {
                let vector4 = vec4.fromValues(vector[0], vector[1], vector[2], 1);
                mat4.mul(vector4, rotMatrix, vector4);
                for(let i = 0; i<3; i++){
                    vector[i] = vector4[i];
                }
                vector = TetraCube.roundArray(vector);
            }
            mat4.lookAt(matrices.viewMatrix, this.perspectiveData.lookAt.eye, this.perspectiveData.lookAt.at, [0, 1, 0]); 
        }else{
            for (let [_, vector] of Object.entries(this.orthoData.lookAt)) {
                let vector4 = vec4.fromValues(vector[0], vector[1], vector[2], 1);
                mat4.mul(vector4, rotMatrix, vector4);
                for(let i = 0; i<3; i++){
                    vector[i] = vector4[i];
                }
                vector = TetraCube.roundArray(vector);
            }
            mat4.lookAt(matrices.viewMatrix, this.orthoData.lookAt.eye, this.orthoData.lookAt.at, [0, 1, 0]); 
        }
    }

    #applyOrthoProjMatrix(){
        for (const [_, shaderInstance] of Object.entries(shaderPrograms)) {
            shaderInstance.enable();
            mat4.ortho(matrices.projectionMatrix, -this.orthoData.projSize * this.aspectRatio, this.orthoData.projSize * this.aspectRatio, -this.orthoData.projSize, this.orthoData.projSize, 0.1, 100);
            gl.uniformMatrix4fv(shaderInstance.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
        }
    }

    #applyPerspectiveProjMatrix(){
        for (const [_, shaderInstance] of Object.entries(shaderPrograms)) {
            shaderInstance.enable();
            mat4.perspective(matrices.projectionMatrix, toRad(this.perspectiveData.fov), this.aspectRatio, 0.1, 100);
            gl.uniformMatrix4fv(shaderInstance.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
        }
    }


    #getRotationMatrix(axis, angle){
        const point = [Grid.dimensions.fieldSize*Grid.dimensions.width/2, Grid.dimensions.fieldSize*Grid.dimensions.height/2, Grid.dimensions.fieldSize*Grid.dimensions.width/2]
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
        return combinedMatrix;   
    }
}