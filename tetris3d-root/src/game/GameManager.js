class GameManager{
    constructor(){
        this.isGamePaused = false;
        this.isGameEnded = false;
    }

    processOnGoingGame(delta){
        if(this.isGamePaused) return;
        
        fallingTetraCube.translate([0, -delta, 0]);
        if(gameManager.isGameEnded){
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
        if(this.isGameEnded){
            this.#restartGame();
        }
    }

    #restartGame(){
        scene.clear();
        this.isGamePaused = false;
        this.isGameEnded = false;
        figureManager.createFallingShape();
    }
}