import { scene } from "./Scene.js";
import { figureManager } from "./FigureManager.js";
import { updateScore } from "../ui/GameScreen.js";
import { serverManager } from "../network/ServerManager.js";

class GameManager{
    #isGameRunning = true;
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
        this.#score += 10;
        updateScore(this.#score);
    }

    increaseScoreVertical(){
        this.#score += 25;
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

    end(){
        serverManager.updateMaxScore(this.#score);
        this.#isGameEnded = true;
        this.#score = 0;
        updateScore(this.#score);
    }

    toggleGame(){
        this.#isGamePaused = !this.#isGamePaused;
    }

    pause(){
        this.#isGamePaused = true;
    }

    resume(){
        this.#isGamePaused = false;
    }

    processEndedGame(){
        if(this.#isGameEnded){
            this.restart();
        }
    }

    isPaused(){
        return this.#isGamePaused;
    }

    restart(){
        scene.clear();
        this.#isGamePaused = false;
        this.#isGameEnded = false;
        figureManager.createFallingShape();
    }

    abortGame(){
        this.#isGameRunning = false;
        //this.end();
    }

    beginGame(){
        this.#isGameRunning = true;
    }

    isGameRunning(){
        return this.#isGameRunning;
    }
}

export const gameManager = new GameManager();