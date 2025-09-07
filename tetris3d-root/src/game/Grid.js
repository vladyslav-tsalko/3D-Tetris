import { currentShaderProgram } from "./ShaderProgram.js";
import {mat4, matrices} from './Main.js';


export class Grid {
    #isSimple = true;
    static dimensions = {
        'fieldSize': 2,
        'height': 10,
        'width': 5
    }
    constructor(){
        Object.freeze(Grid.dimensions);
        this.vertices = [];
        this.colors = []
    }

    init(gl){
        this.gl = gl;

        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();

        this.buffers = {
            vertexBuffer: this.gl.createBuffer(),
            colorBuffer: this.gl.createBuffer()
        };
        this.initSimple();
    }

    initSimple() {
        this.#isSimple = true;
        const vertices = [];
        for(let i = 0; i <= Grid.dimensions.width * Grid.dimensions.fieldSize; i += Grid.dimensions.fieldSize){
            vertices.push([0, 0, i, Grid.dimensions.width * Grid.dimensions.fieldSize, 0, i]);//xz: || to x
            vertices.push([i, 0, 0, i, 0, Grid.dimensions.width * Grid.dimensions.fieldSize]);//xz: || to z
            vertices.push([i, 0, 0, i, Grid.dimensions.height * Grid.dimensions.fieldSize, 0]);//xy: || to y
            vertices.push([0, 0, i, 0, Grid.dimensions.height * Grid.dimensions.fieldSize, i]);//zy: || to y 
        }
        
        for(let i = 0; i <= Grid.dimensions.height * Grid.dimensions.fieldSize; i += Grid.dimensions.fieldSize){
            vertices.push([0, i, 0, Grid.dimensions.width * Grid.dimensions.fieldSize, i, 0]);//xy: || to x in 
            vertices.push([0, i, 0, 0, i, Grid.dimensions.width * Grid.dimensions.fieldSize]);//zy: || to z in 
        }
        
        
        const colors = [];
        for(let i = 0; i < vertices.length; i++){
            colors.push([1, 1, 1, 1, 1, 1]);
        }

        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        // Bind and fill vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        // Bind and fill color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        
    }

    initDifficult() {
        this.#isSimple = false;
        const vertices = [];
        for(let i = 0; i <= Grid.dimensions.width * Grid.dimensions.fieldSize; i += Grid.dimensions.fieldSize){
            for(let j = 0; j <= Grid.dimensions.height * Grid.dimensions.fieldSize; j += Grid.dimensions.fieldSize){
                vertices.push([0, j, i, Grid.dimensions.width * Grid.dimensions.fieldSize, j, i]);
                vertices.push([i, j, 0, i, j, Grid.dimensions.width * Grid.dimensions.fieldSize]);
            }
            for(let j = 0; j <= Grid.dimensions.width * Grid.dimensions.fieldSize; j += Grid.dimensions.fieldSize){
                vertices.push([i, 0, j, i, Grid.dimensions.height * Grid.dimensions.fieldSize, j]);
            }
        }
        
        const colors = [];
        for(let i = 0; i < vertices.length; i++){
            colors.push([1, 1, 1, 1, 1, 1]);
        }

        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        // Bind and fill vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        // Bind and fill color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        
    }

    draw() {
        this.#setupAttribute(this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        this.#setupAttribute(this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);
        
        mat4.mul(this.modelViewMatrix, matrices.viewMatrix, this.modelMatrix);
        this.gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, this.gl.FALSE, this.modelViewMatrix);

        this.gl.drawArrays(this.gl.LINES, 0, this.vertices.length / 3);
        
    }

    getIsSimple(){
        return this.#isSimple;
    }

    #setupAttribute(buffer, location) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        this.gl.vertexAttribPointer(
            location, // the attribute location
            3, // number of elements for each vertex
            this.gl.FLOAT, // type of the attributes
            this.gl.FALSE, // should data be normalised?
            0, // stride
            0 // offset
        );

        // enable the attribute
        this.gl.enableVertexAttribArray(location);
    }
    
}

export const grid = new Grid();