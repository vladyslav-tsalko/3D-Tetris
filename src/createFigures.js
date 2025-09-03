   async function loadData(fileName) {
    const Object = await fetch(fileName).then(result => result.text());
    return Object;
}

function parseOBJ(objectData) {
    const lines = objectData.split('\n');
    let isTexture = false;
    if(objectData.includes('vt')){
        isTexture = true;
    }
    const vertices = [];
    const normals = [];
    const faces = [];
    
    for (const line of lines) {
        if (line.startsWith('v ')) {
            const [, x, y, z] = line.split(' ').map(parseFloat);
            vertices.push([x, y, z]);
            continue;
        } else if (line.startsWith('vn ')) {
            const [, x, y, z] = line.split(' ').map(parseFloat);
            normals.push([x, y, z]);
            continue;
        }else if (line.startsWith('f ')) {
            const vertInd = []
            const normInd = []
            if(isTexture){
                line.split(' ').slice(1).map(threeStr => threeStr.split('/').map(Number)).forEach(([vIndex, _, vnIndex]) => {
                    vertInd.push(vIndex-1);
                    normInd.push(vnIndex-1);
                });
            }else{
                line.split(' ').slice(1).map(pairStr => pairStr.split('//').map(Number)).forEach(([vIndex, vnIndex]) => {
                    vertInd.push(vIndex-1);
                    normInd.push(vnIndex-1);
                });
            }
            
            faces.push([vertInd, normInd])
            continue;
        }
    }
    
    const faceVertices = [];
    const faceNormals = [];
    faces.forEach(face => {
            const [vIndices, nIndices] = face; 
            vIndices.forEach(index => faceVertices.push(vertices[index]));
            nIndices.forEach(index => faceNormals.push(normals[index]));
        }
    )
    return [faceVertices, faceNormals, vertices];
}


function createTetraCubeI(){
    const tetraCubeI = getRandomColoredTetraCube([4, 0, 2]);

    for(let i = 0; i < 4; i++){
        tetraCubeI.addCube(translateMatrix([i*2, 0, 0]));
    }
    return tetraCubeI;
}

function createTetraCubeO(){
    const tetraCubeO = getRandomColoredTetraCube([2, 2, 2]);
    
    for(let i = 0; i < 2; i++){
        tetraCubeO.addCube(translateMatrix([i*2, 0, 0]));
        tetraCubeO.addCube(translateMatrix([i*2, 0, 2]));
    }
    return tetraCubeO;
}

function createTetraCubeL(){
    const tetraCubeL = getRandomColoredTetraCube([3, 1, 1]);
    
    for(let i = 0; i < 3; i++){
        tetraCubeL.addCube(translateMatrix([i*2, 0, 0]));
    }
    tetraCubeL.addCube(translateMatrix([2*2, 0, 2]));
    return tetraCubeL;
}

function createTetraCubeT(){
    const tetraCubeT = getRandomColoredTetraCube([3, 1, 1]);
    
    for(let i = 0; i < 3; i++){
        tetraCubeT.addCube(translateMatrix([i*2, 0, 0]));
    }
    tetraCubeT.addCube(translateMatrix([2, 0, 2]));
    return tetraCubeT;
}

function createTetraCubeN(){
    const tetraCubeN = getRandomColoredTetraCube([3, 1, 1]);
    
    for(let i = 0; i < 2; i++){
        tetraCubeN.addCube(translateMatrix([(i+1)*2, 0, 0]));
        tetraCubeN.addCube(translateMatrix([i*2, 0, 2]));
    }
    return tetraCubeN;
}

function createTetraCubeTowerRight(){
    const tetraCubeTowerRight = getRandomColoredTetraCube([2, 2, 2]);
    
    for(let i = 0; i < 2; i++){
        tetraCubeTowerRight.addCube(translateMatrix([i*2, 0, 2]));
        tetraCubeTowerRight.addCube(translateMatrix([2, i*2, 0]));
    }
    return tetraCubeTowerRight;
}

function createTetraCubeTowerLeft(){
    const tetraCubeTowerLeft = getRandomColoredTetraCube([2, 2, 2]);
    
    for(let i = 0; i < 2; i++){
        tetraCubeTowerLeft.addCube(translateMatrix([i*2, 0, 2]));
        tetraCubeTowerLeft.addCube(translateMatrix([0, i*2, 0]));
    }
    return tetraCubeTowerLeft;
}

function createTetraCubeTripod(){
    const tetraCubeTripod = getRandomColoredTetraCube([2, 2, 2]);
    
    for(let i = 0; i < 2; i++){
        tetraCubeTripod.addCube(translateMatrix([i*2, 0, i*2]));
        tetraCubeTripod.addCube(translateMatrix([2, i*2, 0]));
    }
    return tetraCubeTripod;
}

function createCube(){
    const tetraCube = getRandomColoredTetraCube([2, 2, 2]);
    tetraCube.addCube(translateMatrix([0, 0, 0]));
    return tetraCube;
}

function getRandomColoredTetraCube(vector){
    const tetraCube = new TetraCube()
    const colors = [];
    const randomColor = Scene.shapesColors[Math.round(Math.random()*(Scene.shapesColors.length - 1))];
    for (let i = 0; i < scene.mainBufferCube.vertices.length; i++) {
        colors.push(randomColor);
    }
    tetraCube.initData(colors, vector);
    return tetraCube;
}

function translateMatrix(vector){
    const matrix = mat4.create();
    let identityMatrix = mat4.create();
    mat4.translate(identityMatrix, identityMatrix, vector); //transalte matrix
    mat4.mul(matrix, identityMatrix, matrix)
    return matrix;
}


function createFallingShape(){
    if(fallingTetraCube){
        fallingTetraCube.isSpeededUp = false;
        fallingTetraCube = null;
    }

    const randomTetraCube = Math.round(Math.random()*(Scene.shapesNames.length - 1)); //choose 1 of them
    
    switch(Scene.shapesNames[randomTetraCube]){
        case 'tetraCubeI':
            fallingTetraCube = createTetraCubeI();
            break;
        case 'tetraCubeO':
            fallingTetraCube = createTetraCubeO();
            break;
        case 'tetraCubeL':
            fallingTetraCube = createTetraCubeL();
            break;
        case 'tetraCubeT':
            fallingTetraCube = createTetraCubeT();
            break;
        case 'tetraCubeN':
            fallingTetraCube = createTetraCubeN();
            break;
        case 'tetraCubeTowerLeft':
            fallingTetraCube = createTetraCubeTowerLeft();
            break;
        case 'tetraCubeTowerRight':
            fallingTetraCube = createTetraCubeTowerRight();
            break;
        case 'tetraCubeTripod':
            fallingTetraCube = createTetraCubeTripod();
            break;
        default:
            break;
    }
    fallingTetraCube.translate([0,Grid.dimensions.height*Grid.dimensions.fieldSize,0])
}

function restartGame(){
    scene.clear();
    gameRules.isGamePaused = false;
    gameRules.isGameEnded = false;
    createFallingShape();
}

//TODO: CreateFigureManager with 1 public method