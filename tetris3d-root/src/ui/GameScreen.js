export function setupGameScreen() {
    const backBtn = document.getElementById("backButton");
    backBtn.addEventListener("click", () => {
        // Скрываем игру и HUD
        document.getElementById("canvas").style.display = "none";
        document.getElementById("gameHUD").style.display = "none";

        // Показываем главный экран
        document.getElementById("welcome").style.display = "flex";
    });
}

export function updateScore(points) {
    const scoreDiv = document.getElementById("score");
    scoreDiv.innerText = `Score: ${points}`;
}