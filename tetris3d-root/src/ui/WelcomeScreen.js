import { initialize } from '../game/Main.js';
import { gameManager } from '../game/GameManager.js';

export function setupWelcomeScreen() {
    const demoPlayeBtn = document.getElementById("demoPlayButton");
    demoPlayeBtn.addEventListener("click", () => {
        document.getElementById("welcome").style.display = "none";
        document.getElementById("canvas").style.display = "block";   // показываем WebGL canvas
        document.getElementById("gameHUD").style.display = "flex";  // показываем HUD
        initialize();
        gameManager.beginGame();
    });

    const controlsBtn = document.getElementById("controlsButton");
    controlsBtn.addEventListener("click", () => {
        showControlsScreen();
    });

    const registerBtn = document.getElementById("registerButton");
    const loginBtn = document.getElementById("loginButton");

    registerBtn.addEventListener("click", () => showRegisterModal());
    loginBtn.addEventListener("click", () => showLoginModal());
}

function showControlsScreen() {
    // Если экран уже существует — просто показываем
    let existing = document.getElementById("controlsScreen");
    if (existing) {
        existing.style.display = "flex";
        return;
    }

    // Основной контейнер
    const controlsDiv = document.createElement("div");
    controlsDiv.id = "controlsScreen"; // CSS из styles.css автоматически применится

    // Заголовок
    const title = document.createElement("h2");
    title.innerText = "3D Tetris Controls";
    controlsDiv.appendChild(title);

    // Контейнер для таблицы (центрирование)
    const tableWrapper = document.createElement("div");
    tableWrapper.style.display = "flex";
    tableWrapper.style.justifyContent = "center";
    tableWrapper.style.width = "100%";

    // Таблица
    const table = document.createElement("table");

    // Заголовки столбцов
    const headerRow = document.createElement("tr");
    const thKey = document.createElement("th");
    thKey.innerText = "Key";

    const thAction = document.createElement("th");
    thAction.innerText = "Action";

    headerRow.appendChild(thKey);
    headerRow.appendChild(thAction);
    table.appendChild(headerRow);

    // Данные управления
    const controls = [
        ["W / S", "Move TetraCube forward/back"],
        ["A / D", "Move TetraCube left/right"],
        ["Arrow Keys", "Same as W/A/S/D"],
        ["Space", "Speed up falling"],
        //["P", "Pause / Unpause game"],
        ["G", "Toggle grid complexity"],
        ["X / x", "Rotate TetraCube around X axis (different directions)"],
        ["Y / y", "Rotate TetraCube around Y axis (different directions)"],
        ["Z / z", "Rotate TetraCube around Z axis (different directions)"],
        ["+ / -", "Zoom in / Zoom out"],
        ["V", "Change view (perspective/ortho)"],
        ["Shift+V", "Reset camera view"],
        ["Mouse Scroll", "Zoom camera in/out"]
    ];

    controls.forEach(([key, action]) => {
        const row = document.createElement("tr");

        const tdKey = document.createElement("td");
        tdKey.innerText = key;

        const tdAction = document.createElement("td");
        tdAction.innerText = action;

        row.appendChild(tdKey);
        row.appendChild(tdAction);
        table.appendChild(row);
    });

    tableWrapper.appendChild(table);
    controlsDiv.appendChild(tableWrapper);

    // Кнопка закрытия
    const closeBtn = document.createElement("button");
    closeBtn.id = "closeControlsBtn";
    closeBtn.innerText = "Close";

    closeBtn.addEventListener("click", () => {
        controlsDiv.style.display = "none";
    });

    controlsDiv.appendChild(closeBtn);

    document.body.appendChild(controlsDiv);
}

// ------------------- Register Screen -------------------
function showRegisterModal() {
    let existing = document.getElementById("registerScreen");
    if (existing) {
        existing.style.display = "flex";
        return;
    }

    const modal = document.createElement("div");
    modal.id = "registerScreen";
    modal.classList.add("modalScreen");

    const title = document.createElement("h2");
    title.innerText = "Register";
    modal.appendChild(title);

    const usernameInput = document.createElement("input");
    usernameInput.placeholder = "Username";
    modal.appendChild(usernameInput);

    const passwordInput = document.createElement("input");
    passwordInput.placeholder = "Password";
    passwordInput.type = "password";
    modal.appendChild(passwordInput);

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Register";
    submitBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            console.log("Registering", username, password);
            modal.style.display = "none";
        } else {
            alert("Enter username and password");
        }
    });
    modal.appendChild(submitBtn);

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
}

// ------------------- Login Screen -------------------
function showLoginModal() {
    let existing = document.getElementById("loginScreen");
    if (existing) {
        existing.style.display = "flex";
        return;
    }

    const modal = document.createElement("div");
    modal.id = "loginScreen";
    modal.classList.add("modalScreen");

    const title = document.createElement("h2");
    title.innerText = "Login";
    modal.appendChild(title);

    const usernameInput = document.createElement("input");
    usernameInput.placeholder = "Username";
    modal.appendChild(usernameInput);

    const passwordInput = document.createElement("input");
    passwordInput.placeholder = "Password";
    passwordInput.type = "password";
    modal.appendChild(passwordInput);

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Login";
    submitBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            console.log("Logging in", username, password);
            modal.style.display = "none";
        } else {
            alert("Enter username and password");
        }
    });
    modal.appendChild(submitBtn);

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
}