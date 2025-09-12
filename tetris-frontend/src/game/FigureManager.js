import { TetraCube } from "./TetraCube.js";
import {scene} from './Scene.js';
import { gameManager } from "./GameManager.js";
import {mat4} from './Main.js';
import {Grid} from './Grid.js';

class FigureManager{
    shapesNames = ['tetraCubeI', 'tetraCubeO', 'tetraCubeL', 'tetraCubeT', 'tetraCubeN', 'tetraCubeTowerLeft', 'tetraCubeTowerRight','tetraCubeTripod'];
    #shapesColors = [
        [1, 0, 0],//red
        [1, 0.5, 0],//orange
        [1, 1, 0],//yellow
        [0, 1, 0],//green
        [0, 1, 1],//baby blue
        [0, 0, 1],//blue
        [0.5, 0, 1],//purple
        [1, 0, 1],//pink
    ];
    createFallingShape(){
        let currentTetraCube = gameManager.getCurrentTetraCube();
        if(currentTetraCube){
            currentTetraCube.isSpeededUp = false;
            gameManager.setCurrentTetraCube(null);
        }

        const randomTetraCube = Math.round(Math.random()*(this.shapesNames.length - 1)); //choose 1 of them
        let newTetraCube = null;
        switch(this.shapesNames[randomTetraCube]){
            case 'tetraCubeI':
                newTetraCube = this.#createTetraCubeI();
                break;
            case 'tetraCubeO':
                newTetraCube = this.#createTetraCubeO();
                break;
            case 'tetraCubeL':
                newTetraCube = this.#createTetraCubeL();
                break;
            case 'tetraCubeT':
                newTetraCube = this.#createTetraCubeT();
                break;
            case 'tetraCubeN':
                newTetraCube = this.#createTetraCubeN();
                break;
            case 'tetraCubeTowerLeft':
                newTetraCube = this.#createTetraCubeTowerLeft();
                break;
            case 'tetraCubeTowerRight':
                newTetraCube = this.#createTetraCubeTowerRight();
                break;
            case 'tetraCubeTripod':
                newTetraCube = this.#createTetraCubeTripod();
                break;
            default:
                break;
        }
        newTetraCube.translate([0,Grid.dimensions.height*Grid.dimensions.fieldSize,0])
        gameManager.setCurrentTetraCube(newTetraCube);
    }

    #createTetraCubeI(){
        const tetraCubeI = this.#getRandomColoredTetraCube([4, 0, 2]);

        for(let i = 0; i < 4; i++){
            tetraCubeI.addCube(this.#translateMatrix([i*2, 0, 0]));
        }
        return tetraCubeI;
    }

    #createTetraCubeO(){
        const tetraCubeO = this.#getRandomColoredTetraCube([2, 2, 2]);
        
        for(let i = 0; i < 2; i++){
            tetraCubeO.addCube(this.#translateMatrix([i*2, 0, 0]));
            tetraCubeO.addCube(this.#translateMatrix([i*2, 0, 2]));
        }
        return tetraCubeO;
    }

    #createTetraCubeL(){
        const tetraCubeL = this.#getRandomColoredTetraCube([3, 1, 1]);
        
        for(let i = 0; i < 3; i++){
            tetraCubeL.addCube(this.#translateMatrix([i*2, 0, 0]));
        }
        tetraCubeL.addCube(this.#translateMatrix([2*2, 0, 2]));
        return tetraCubeL;
    }

    #createTetraCubeT(){
        const tetraCubeT = this.#getRandomColoredTetraCube([3, 1, 1]);
        
        for(let i = 0; i < 3; i++){
            tetraCubeT.addCube(this.#translateMatrix([i*2, 0, 0]));
        }
        tetraCubeT.addCube(this.#translateMatrix([2, 0, 2]));
        return tetraCubeT;
    }

    #createTetraCubeN(){
        const tetraCubeN = this.#getRandomColoredTetraCube([3, 1, 1]);
        
        for(let i = 0; i < 2; i++){
            tetraCubeN.addCube(this.#translateMatrix([(i+1)*2, 0, 0]));
            tetraCubeN.addCube(this.#translateMatrix([i*2, 0, 2]));
        }
        return tetraCubeN;
    }

    #createTetraCubeTowerRight(){
        const tetraCubeTowerRight = this.#getRandomColoredTetraCube([2, 2, 2]);
        
        for(let i = 0; i < 2; i++){
            tetraCubeTowerRight.addCube(this.#translateMatrix([i*2, 0, 2]));
            tetraCubeTowerRight.addCube(this.#translateMatrix([2, i*2, 0]));
        }
        return tetraCubeTowerRight;
    }

    #createTetraCubeTowerLeft(){
        const tetraCubeTowerLeft = this.#getRandomColoredTetraCube([2, 2, 2]);
        
        for(let i = 0; i < 2; i++){
            tetraCubeTowerLeft.addCube(this.#translateMatrix([i*2, 0, 2]));
            tetraCubeTowerLeft.addCube(this.#translateMatrix([0, i*2, 0]));
        }
        return tetraCubeTowerLeft;
    }

    #createTetraCubeTripod(){
        const tetraCubeTripod = this.#getRandomColoredTetraCube([2, 2, 2]);
        
        for(let i = 0; i < 2; i++){
            tetraCubeTripod.addCube(this.#translateMatrix([i*2, 0, i*2]));
            tetraCubeTripod.addCube(this.#translateMatrix([2, i*2, 0]));
        }
        return tetraCubeTripod;
    }

    #createCube(){
        const tetraCube = this.#getRandomColoredTetraCube([2, 2, 2]);
        tetraCube.addCube(this.#translateMatrix([0, 0, 0]));
        return tetraCube;
    }

    #getRandomColoredTetraCube(vector){
        const tetraCube = new TetraCube()
        const colors = [];
        const randomColor = this.#shapesColors[Math.round(Math.random()*(this.#shapesColors.length - 1))];
        for (let i = 0; i < scene.mainBufferCube.vertices.length; i++) {
            colors.push(randomColor);
        }
        tetraCube.initData(colors, vector);
        return tetraCube;
    }

    #translateMatrix(vector){
        const matrix = mat4.create();
        let identityMatrix = mat4.create();
        mat4.translate(identityMatrix, identityMatrix, vector); //transalte matrix
        mat4.mul(matrix, identityMatrix, matrix)
        return matrix;
    }
}

export const figureManager = new FigureManager();