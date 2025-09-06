export function setupWelcomeScreen() {
    const playBtn = document.getElementById("playButton");
    playBtn.addEventListener("click", () => {
        document.getElementById("welcome").style.display = "none";
        document.getElementById("canvas").style.display = "block";   // показываем WebGL canvas
        initialize();
    });

    const controlsBtn = document.getElementById("controlsButton");
    controlsBtn.addEventListener("click", () => {
        alert("Управление: стрелки для движения, пробел для ускорения");
    });
}
