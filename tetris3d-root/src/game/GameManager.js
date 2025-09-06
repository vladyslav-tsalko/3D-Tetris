class GameManager{
    #isGamePaused = false;
    #isGameEnded = false;
    #score = 0;

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

    getScore(){
        return this.#score;
    }

    processOnGoingGame(delta){
        if(this.#isGamePaused) return;
        
        fallingTetraCube.translate([0, -delta, 0]);
        if(gameManager.#isGameEnded){
            fallingTetraCube = null;
        }
        else{
            if(fallingTetraCube.isPositioned){
                scene.add(fallingTetraCube);
                figureManager.createFallingShape();
            }
        }
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