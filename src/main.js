const { mat4, vec4, mat3, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

/** @type {Scene} */
let scene = null;

let grid = null;
let view = null;
let figureManager = null;
let gameManager = null;

/** @type {WebGLRenderingContext} */
let gl = null;

const matrices = {
    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),
}
let aspectRatio = 0;
let projSize = 15;

/** @type {TetraCube} */
let fallingTetraCube = null;



var initialize = async () => {    
    // basic setup 
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById("canvas");
    aspectRatio = canvas.clientWidth / canvas.clientHeight;
    
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0, 0, 0, 1);

    view = new View(canvas.clientWidth / canvas.clientHeight)

    shaderPrograms.noLightProgram = new ShaderProgram(shaders.noLight, shaders.fragment, shaderInfo);
    shaderPrograms.withLightProgram = new ShaderProgram(shaders.withLight, shaders.fragment, shaderInfo);

    view.enableOrtho();

    scene = new Scene();

    await scene.parseCube()

    grid = new Grid();

    figureManager = new FigureManager();
    
    figureManager.createFallingShape();

    gameManager = new GameManager();

    keyListener(); //listener for keyboard events to the window
    
    requestAnimationFrame(render); // start render loop
}

// Previous frame time
let then = 0;
function render(now) {
    // calculate elapsed time in seconds
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    let delta = now - then;
    if(fallingTetraCube.isSpeededUp){
        delta *= 0.04;
    }else{
        delta *= 0.002;
    }
    
    shaderPrograms.noLightProgram.enable();
    grid.draw();

    shaderPrograms.withLightProgram.enable();
    
    const lightPosition = vec4.fromValues(Grid.dimensions.fieldSize * (Grid.dimensions.width + 1), Grid.dimensions.height * Grid.dimensions.fieldSize, Grid.dimensions.fieldSize * (Grid.dimensions.width + 1), 1);
    vec4.transformMat4(lightPosition, lightPosition, matrices.viewMatrix);
    gl.uniform4fv(currentShaderProgram.uniforms.lightViewPosition, lightPosition);

    scene.draw();
    
    fallingTetraCube.draw();

    gameManager.processOnGoingGame(delta);
    gameManager.processEndedGame();
    
    then = now;
    requestAnimationFrame(render)
}

