import { Grid } from "./Grid.js";
import { BufferCube } from "./BufferCube.js";
import { gameManager } from "./GameManager.js";

const Plane = Object.freeze({
    YZ: 0,
    XZ: 1,
    XY: 2
});


class Scene{
    
    constructor() {
       /** @type {BufferCube} */
        this.mainBufferCube = null;
        
        this.tetraCubes = [];

        this.filled = {
            'xy': new Array(Grid.dimensions.width).fill(0),
            'yz': new Array(Grid.dimensions.width).fill(0),
            'xz': new Array(Grid.dimensions.height).fill(0),
        }
    }
    add(tetraCube){
        this.tetraCubes.push(tetraCube)
        tetraCube.cubeOrigins.forEach(tetraCubeOrigin => {
            this.filled.xy[(tetraCubeOrigin[2] - 1)/2]++;
            this.filled.yz[(tetraCubeOrigin[0] - 1)/2]++;
            this.filled.xz[(tetraCubeOrigin[1] - 1)/2]++;
        });
        const [numbers, plane] = this.#filledPlane();
        if(numbers.length !== 0){
            this.#removeFilledPlane(numbers, plane);
        }
    }

    clear(){
        this.#clearFilledInfo();
        this.#clearTetraCubes();
    }

    isEmpty(){
        if(this.tetraCubes.length === 0){
            true;
        }
        else{
            false;
        }
    }
    
    draw(){
        if(!this.isEmpty()){
            this.tetraCubes.forEach(tetraCube => {
                tetraCube.draw();
            });
        }
    }

    async parseCube(){
        const cubeRaw = await this.#loadData('objects/cube.obj');
        const [vertices, normals, boundingVertices] = this.#parseOBJ(cubeRaw);
        this.mainBufferCube = new BufferCube(vertices, normals, boundingVertices);
    }

    #clearFilledInfo(){
        for(let i = 0; i < this.filled.xy.length; i++){
            this.filled.xy[i] = 0;
        }
        for(let i = 0; i < this.filled.xz.length; i++){
            this.filled.xz[i] = 0;
        }
        for(let i = 0; i < this.filled.yz.length; i++){
            this.filled.yz[i] = 0;
        }
    }

    #clearTetraCubes(){
        while (this.tetraCubes.length > 0) {
            this.tetraCubes.pop();
        }
    }

    #removeFilledPlane(numbers, plane){
        let removedCubeOrigins = [];
        for(const number of numbers){
            let vector = new Array(3).fill(0);
            vector[plane] = number;
            for(let i = this.tetraCubes.length - 1; i>=0; i--){
                removedCubeOrigins.push(this.tetraCubes[i].removeCubes(vector));
                if(this.tetraCubes[i].isEmpty()){
                    this.tetraCubes.splice(i, 1);
                    if(plane == Plane.XZ){
                        gameManager.increaseScoreHorizontal();
                    }
                    else{
                        gameManager.increaseScoreVertical();
                    }
                }
            }
        }
        if(removedCubeOrigins.length !== 0){
            for (let i = 0; i < removedCubeOrigins.length; i++) {
                for (let j = 0; j < removedCubeOrigins[i].length; j++) {
                    this.filled.xy[(removedCubeOrigins[i][j][2] - 1)/2]--;
                    this.filled.yz[(removedCubeOrigins[i][j][0] - 1)/2]--;
                    this.filled.xz[(removedCubeOrigins[i][j][1] - 1)/2]--;
                }
            }
        }
        
        if(plane == Plane.XZ){
            let removedCubeOriginsY = [];
            let addedCubeOriginsY = [];
            const max = Math.max(...numbers);
            this.tetraCubes.forEach(tetraCube => {
                const [remY, addY] = tetraCube.fall([0, -2*numbers.length, 0], max);
                removedCubeOriginsY.push(remY.flat());
                addedCubeOriginsY.push(addY.flat());
            });
            for (let i = 0; i < removedCubeOriginsY.length; i++) {
                for (let j = 0; j < removedCubeOriginsY[i].length; j++) {
                    let a = removedCubeOriginsY[i][j];
                    let b = (a - 1)/2;
                    this.filled.xz[b]--;
                }
            }
            for (let i = 0; i < addedCubeOriginsY.length; i++) {
                for (let j = 0; j < addedCubeOriginsY[i].length; j++) {
                    let a = addedCubeOriginsY[i][j];
                    let b = (a - 1)/2;
                    this.filled.xz[b]++;
                }
            }

        }
        
    }

    #filledPlane(){
        let xyPos = [];
        let xzPos = [];
        let yzPos = [];
        for(let i = 0; i<this.filled.xy.length; i++){
            if(this.filled.xy[i] === Grid.dimensions.width * Grid.dimensions.height){
                xyPos.push(i*2 + 1);
            }
        }
        if(xyPos.length !== 0){
            return [xyPos, Plane.XY];
        }
        for(let i = 0; i<this.filled.xz.length; i++){
            if(this.filled.xz[i] === Grid.dimensions.width * Grid.dimensions.width){
                xzPos.push(i*2 + 1);
            }
        }
        if(xzPos.length !== 0){
            return [xzPos, Plane.XZ];
        }
        for(let i = 0; i<this.filled.yz.length; i++){
            if(this.filled.yz[i] === Grid.dimensions.width * Grid.dimensions.height){
                yzPos.push(i*2 + 1);
            }
        }
        if(yzPos.length !== 0){
            return [yzPos, Plane.YZ];
        }
        return [[], Plane.YZ];
    }


    async #loadData(fileName) {
        const Object = await fetch(fileName).then(result => result.text());
        return Object;
    }

    #parseOBJ(objectData) {
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
}

export const scene = new Scene();