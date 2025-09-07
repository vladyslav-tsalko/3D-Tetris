//listens all keys
import { gameManager } from "./GameManager.js";
import { grid } from "./Grid.js";
import { view } from "./Main.js";

export function keyListener(){
    window.addEventListener("keydown", (event) => {
        event.preventDefault(); // теперь работает
        //moving tetracibes
        if(event.key === 'd' || event.key === 'ArrowRight'){
            translate([2, 0, 0]);
        }else if(event.key === 'a' || event.key === 'ArrowLeft'){
            translate([-2, 0, 0]);
        }else if(event.key === 'w' || event.key === 'ArrowUp'){
            translate([0, 0, -2]);
        }else if(event.key === 's' || event.key === 'ArrowDown'){
            translate([0, 0, 2]);
        }

        //pousing/unpausing game
        if(event.key === 'p'){
            gameManager.pauseGame();
        }

        //changing grid
        if(event.key === 'g'){
            if(grid.getIsSimple()){
                grid.initDifficult();
            }else{
                grid.initSimple();
            }
        }

        //speeding up tetracube
        if(event.key === ' '){
             if(!gameManager.isGamePaused){
                gameManager.getCurrentTetraCube().isSpeededUp = true;
            }
        }

        // rotating tetracube
        switch (event.key) {
            case 'X':
                rotate([-1, 0, 0]);
                break;
            case 'x':
                rotate([1, 0, 0]);
                break;
            case 'Y':
                rotate([0, -1, 0]);
                break;
            case 'y':
                rotate([0, 1, 0]);
                break;
            case 'Z':
                rotate([0, 0, -1]);
                break;
            case 'z':
                rotate([0, 0, 1]);
                break;
            default:
                break;
        }


        switch (event.key) {
            case '+':
                view.zoomIn();
                break;
            case '-':
                view.zoomOut();
                break;
            case 'v':
                view.changeView();
                break;
            case 'V':
                view.resetView();
                break;
            default:
                break;
        }

        // let cameraRotate = true;
        // let rotAxis = [0,0,0]
        // switch (event.key) {
        //     case 'j':
        //         rotAxis[1] = 1;
        //         break;
        //     case 'l':
        //         rotAxis[1] = -1;
        //         break;
        //     case 'i':
        //         rotAxis[0] = 1;
        //         break;
        //     case 'k':
        //         rotAxis[0] = -1;
        //         break;
        //     case 'u':
        //         rotAxis[2] = 1;
        //         break;
        //     case 'o':
        //         rotAxis[2] = -1;
        //         break;
        //     default:
        //         cameraRotate = false;
        //         break;
        // }
        // if(cameraRotate){
        //     view.rotateCamera(rotAxis, Math.PI / 32);
        // }
    });

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            view.zoomIn();
        } else {
            view.zoomOut();
        }
    });

    // canvas.addEventListener("mousedown", (event) => {
    //     view.isCameraMoving = true;
    //     startMousePosition = { x: event.clientX, y: event.clientY };
    // });

    // canvas.addEventListener("mousemove", (event) => {
    //     if(!view.isCameraMoving) return;
    //     const x_ = (event.clientX - startMousePosition.x) * 0.5 * Math.PI/180; // Scale down the movement
    //     view.rotateCamera([0,1,0], x_);
    //     startMousePosition = { x: event.clientX, y: event.clientY };
    // });

    // canvas.addEventListener("mouseup", () => {
    //     view.isCameraMoving = false;
    // });
}

function translate(vector){
    if(!gameManager.isGamePaused)
        gameManager.getCurrentTetraCube().translate(vector);
}

function rotate(vector){
    if(!gameManager.isGamePaused)
        gameManager.getCurrentTetraCube().rotate(Math.PI / 2, vector);
}