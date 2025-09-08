import { gameManager } from "../game/GameManager.js";
import { removeKeyListener } from "../game/Listeners.js";

export function setupGameScreen() {
    const backBtn = document.getElementById("backButton");
    const restartBtn = document.getElementById("restartButton");
    const playPauseBtn = document.getElementById("playPauseButton");

    // Вернуться в меню
    backBtn.addEventListener("click", () => {
        document.getElementById("playPauseButton").innerText = "⏸";
        document.getElementById("canvas").style.display = "none";
        document.getElementById("gameHUD").style.display = "none";
        document.getElementById("welcome").style.display = "flex";

        gameManager.abortGame();
        removeKeyListener();
    });

    // Рестарт
    restartBtn.addEventListener("click", () => {
        gameManager.restart();
    });

    // Play/Pause
    playPauseBtn.addEventListener("click", () => {
        if (gameManager.isPaused()) {
            gameManager.resume();
            playPauseBtn.innerText = "⏸"; // показываем паузу
        } else {
            gameManager.pause();
            playPauseBtn.innerText = "▶"; // показываем play
        }
    });
}

export function updateScore(points) {
    const scoreDiv = document.getElementById("score");
    scoreDiv.innerText = `Score: ${points}`;
}