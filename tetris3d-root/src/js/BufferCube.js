class BufferCube {
    constructor(vertices, normals, boundVertices) {
        this.vertices = [];
        this.normals = [];
        this.boundVertices = [];
        this.buffers = {
            vertexBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer()
        }

        this.vertices = new Float32Array(vertices.flat());
        this.normals = new Float32Array(normals.flat());
        this.boundVertices = new Float32Array(boundVertices.flat());

        /// send data to buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    }

    getVertexCoordinatesFromIndicesByMatrix(modelMatrix, i_x, i_y, i_z){
        let transformedVertex = vec3.create();
        const vertexThis = vec3.fromValues(this.boundVertices[i_x], this.boundVertices[i_y], this.boundVertices[i_z]);
        vec3.transformMat4(transformedVertex, vertexThis, modelMatrix);
        return transformedVertex;
    }

    getVertexCoordinatesFromVectorByMatrix(modelMatrix, vector){
        let transformedVertex = vec3.create();
        const vertex = vec3.fromValues(vector[0], vector[1], vector[2]);
        vec3.transformMat4(transformedVertex, vertex, modelMatrix);
        return transformedVertex;
    }
}
