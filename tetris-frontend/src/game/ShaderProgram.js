import {matrices} from './Main.js'
import {gl} from './Main.js'

export const shaders = {
    noLight: "v-shader-nolight",
    withLight: "v-shader",
    fragment: "f-shader"
}

export const shaderPrograms = {
    noLightProgram: null,
    withLightProgram: null
}

export const shaderInfo = {
    attributes: {
        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal"
    }, 
    uniforms: {
        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        lightViewPosition: "lightViewPosition",
        normalMatrix: "normalMatrix"
    }
}

export let currentShaderProgram = null; //TODO: remove global variable

export class ShaderProgram{
    constructor(vertexId, fragmentId, shaderInfo, gl){
        this.program = this.#createShaderProgram(vertexId, fragmentId, gl);
        gl.useProgram(this.program);

        this.attributes = {}
        this.uniforms = {}

        // Extract attribute and uniform information from the shaderInfo object
        // and look up their locations
        Object.entries(shaderInfo.attributes).forEach(([key, value]) => {
            this.attributes[key] = gl.getAttribLocation(this.program, value);
        })

        Object.entries(shaderInfo.uniforms).forEach(([key, value]) => {
            this.uniforms[key] = gl.getUniformLocation(this.program, value);
        })

        // Send projection matrix
        // If this changes, you have to send the new matrix to all shader programs again!
        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);
    }


    enable(){
        gl.useProgram(this.program);
        currentShaderProgram = this;
    }

    #createShaderProgram(vShaderId, fShaderId, gl) {
        const vShader = this.#loadShader(vShaderId, gl.VERTEX_SHADER, gl);
        const fShader = this.#loadShader(fShaderId, gl.FRAGMENT_SHADER, gl);
    
        const program = gl.createProgram();
    
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
    
        gl.linkProgram(program);
    
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error while linking program", gl.getProgramInfoLog(program));
            return false;
        }
    
        return program;
    }

    #loadShader(shaderId, shaderType, gl) {
        const shader = gl.createShader(shaderType);
    
        gl.shaderSource(shader, document.getElementById(shaderId).text);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error while compiling shader", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
    
        return shader;
    }
}
