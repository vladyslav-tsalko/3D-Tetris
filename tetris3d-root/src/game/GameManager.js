import { scene } from "./Scene.js";
import { figureManager } from "./FigureManager.js";
import { updateScore } from "../ui/GameScreen.js";

class GameManager{
    #isGamePaused = false;
    #isGameEnded = false;
    #score = 0;
    #fallingTetraCube = null;

    constructor(){
        this.#isGamePaused = false;
        this.#isGameEnded = false;
        this.#score = 0;
    }
    increaseScoreHorizontal(){
        this.#score += 1;
        updateScore(this.#score);
    }

    increaseScoreVertical(){
        this.#score += 3;
        updateScore(this.#score);
    }

    getCurrentTetraCube(){
        return this.#fallingTetraCube;
    }

    setCurrentTetraCube(newTetraCube){
        this.#fallingTetraCube = newTetraCube;
    }

    getScore(){
        return this.#score;
    }

    processOnGoingGame(delta){
        if(this.#isGamePaused) return;
        
        this.#fallingTetraCube.translate([0, -delta, 0]);
        if(this.#isGameEnded){
            this.#fallingTetraCube = null;
        }
        else{
            if(this.#fallingTetraCube.isPositioned){
                scene.add(this.#fallingTetraCube);
                figureManager.createFallingShape();
            }
        }
    }

    endGame(){
        this.#isGameEnded = true;
    }

    pauseGame(){
        this.#isGamePaused = !this.#isGamePaused;
    }

    processEndedGame(){
        if(this.#isGameEnded){
            this.#restartGame();
        }
    }

    #restartGame(){
        scene.clear();
        this.#isGamePaused = false;
        this.#isGameEnded = false;
        figureManager.createFallingShape();
    }
}

export const gameManager = new GameManager();