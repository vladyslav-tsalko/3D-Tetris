import { initialize } from '../game/Main.js';
import { gameManager } from '../game/GameManager.js';
import { authManager } from '../network/AuthManager.js';
import { InputValidator } from './InputValidator.js';

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
    controlsBtn.addEventListener("click", () => showControlsScreen());

    const registerBtn = document.getElementById("registerButton");
    const loginBtn = document.getElementById("loginButton");

    registerBtn.addEventListener("click", () => showRegisterModal());
    loginBtn.addEventListener("click", () => showLoginModal());
}

function showControlsScreen() {
    const welcomeDiv = document.getElementById("welcome");
    welcomeDiv.style.display = "none";

    const controlsDiv = document.getElementById("controlsScreen");
    controlsDiv.style.display = "flex";

    document.getElementById("closeControlsBtn").addEventListener("click", () => {
        controlsDiv.style.display = "none";
        welcomeDiv.style.display = "flex";
    });
}

// ------------------- Register Screen -------------------
function showRegisterModal() {
    const welcomeDiv = document.getElementById("welcome");
    welcomeDiv.style.display = "none";

    const modal = document.getElementById("registerModal");
    modal.style.display = "flex";

    const usernameInput = document.getElementById("registerUsername");
    const passwordInput = document.getElementById("registerPassword");
    const usernameError = document.getElementById("registerUsernameError");
    const passwordError = document.getElementById("registerPasswordError");
    const submitBtn = document.getElementById("submitRegister");
    const closeBtn = document.getElementById("closeRegister");
    
    const inputValidator = new InputValidator(usernameInput, passwordInput, usernameError, passwordError);

    submitBtn.addEventListener("click", async () => {
        inputValidator.removeInputErrors();
        if(!inputValidator.isValid()) return;

        authManager.register(username, password)
        .then(res => {
            if(res.success){
                console.log("✅ Successfully registered:", res);
            }else{
                console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
            }
        })
        .catch(err => {
            console.error("❌ Error:", err);
        });
    });

    closeBtn.addEventListener("click", () => {
        inputValidator.removeInputErrors();
        modal.style.display = "none";
        welcomeDiv.style.display = "flex";
    });
}

// ------------------- Login Screen -------------------
function showLoginModal() {
    const welcomeDiv = document.getElementById("welcome");
    welcomeDiv.style.display = "none";
    
    const modal = document.getElementById("loginModal");
    modal.style.display = "flex";

    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const usernameError = document.getElementById("loginUsernameError");
    const passwordError = document.getElementById("loginPasswordError");
    const submitBtn = document.getElementById("submitLogin");
    const closeBtn = document.getElementById("closeLogin");

    const inputValidator = new InputValidator(usernameInput, passwordInput, usernameError, passwordError);

    submitBtn.addEventListener("click", async () => {
        inputValidator.removeInputErrors();
        if(!inputValidator.isValid()) return;

        authManager.login(username, password)
        .then(res => {
            if(res.success){
                console.log("✅ Successfully registered:", res);
            }else{
                console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
            }
        })
        .catch(err => {
            console.error("❌ Error:", err);
        });
    });

    closeBtn.addEventListener("click", () => {
        inputValidator.removeInputErrors();
        modal.style.display = "none";
        welcomeDiv.style.display = "flex";
    });
}