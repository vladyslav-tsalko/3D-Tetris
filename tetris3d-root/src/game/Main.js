import { figureManager } from "./FigureManager.js";
import { scene } from "./Scene.js";
import { grid, Grid } from "./Grid.js";
import { gameManager } from "./GameManager.js";
import { View } from "./View.js";
import { ShaderProgram, shaderPrograms, shaders, shaderInfo, currentShaderProgram } from "./ShaderProgram.js";
import { keyListener } from "./Listeners.js";

/** @type {WebGLRenderingContext} */
export let gl = null;
/** @type {View} */
export let view = null;

export const { mat4, vec4, mat3, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;


export const matrices = {
    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),
}

//let aspectRatio = 0;
//let projSize = 15;

/** @type {TetraCube} */
//export let fallingTetraCube = null;
let then = 0;
let isInit = false;

export const initialize = async () => {    
    // basic setup 
    /** @type {HTMLCanvasElement} */
    if(!isInit){
        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //aspectRatio = canvas.clientWidth / canvas.clientHeight;
        
        gl = canvas.getContext("webgl", { alpha: true }) || canvas.getContext("experimental-webgl", { alpha: true });

        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
        gl.clearColor(0, 0, 0, 0);

        grid.init(gl);

        view = new View(canvas.clientWidth / canvas.clientHeight)

        shaderPrograms.noLightProgram = new ShaderProgram(shaders.noLight, shaders.fragment, shaderInfo, gl);
        shaderPrograms.withLightProgram = new ShaderProgram(shaders.withLight, shaders.fragment, shaderInfo, gl);

        view.enableOrtho();

        await scene.parseCube()
        
        figureManager.createFallingShape();

        keyListener(); //listener for keyboard events to the window
        isInit = true;
    }
    
    then = performance.now(); // сразу перед первым вызовом render
    requestAnimationFrame(render); // start render loop
}

// Previous frame time

function render(now) {
    if(!gameManager.isGameRunning()){
        gameManager.end();
        return;
    }
    // calculate elapsed time in seconds
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    let delta = now - then;
    if(gameManager.getCurrentTetraCube().isSpeededUp){
        delta *= 0.04;
    }else{
        delta *= 0.002;
    }
    
    shaderPrograms.noLightProgram.enable(gl);
    grid.draw();

    shaderPrograms.withLightProgram.enable(gl);
    
    const lightPosition = vec4.fromValues(Grid.dimensions.fieldSize * (Grid.dimensions.width + 1), Grid.dimensions.height * Grid.dimensions.fieldSize, Grid.dimensions.fieldSize * (Grid.dimensions.width + 1), 1);
    vec4.transformMat4(lightPosition, lightPosition, matrices.viewMatrix);
    gl.uniform4fv(currentShaderProgram.uniforms.lightViewPosition, lightPosition);

    scene.draw();
    
    gameManager.getCurrentTetraCube().draw();

    gameManager.processOnGoingGame(delta);
    gameManager.processEndedGame();
    
    then = now;
    requestAnimationFrame(render)
}

