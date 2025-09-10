import { initialize } from '../game/Main.js';
import { gameManager } from '../game/GameManager.js';
import { authManager } from '../network/AuthManager.js';
import { RegisterInputHandler } from './DataInputHandlers/RegisterInputHandler.js';
import { LoginInputHandler } from './DataInputHandlers/LoginInputHandler.js';
import { jwtParser } from '../network/JwtParser.js';

export function setupWelcomeScreen() {
    const welcomeGuestDiv = document.getElementById("welcomeGuest");
    const welcomeLoggedDiv = document.getElementById("welcomeLogged");
    const userInfoLogged = document.getElementById("userInfoLogged");

    const token = localStorage.getItem("jwt");
    const username = jwtParser.parseNicknameFromJwt(token);
    if(username){
        welcomeGuestDiv.style.display = "none";
        welcomeLoggedDiv.style.display = "flex";
        userInfoLogged.textContent = username;
        showWelcomeLoggedScreen();
    }else{
        welcomeLoggedDiv.style.display = "none";
        welcomeGuestDiv.style.display = "flex";
        userInfoLogged.textContent = 'Guest';
        showWelcomeGuestScreen();
    }
}

function showWelcomeLoggedScreen(){
    document.getElementById("logoutButton").onclick = () => {
        localStorage.removeItem("jwt");
        setupWelcomeScreen();
    };
    // Кнопки авторизованного
    document.getElementById("playButton").onclick = () => {
        document.getElementById("welcomeLogged").style.display = "none";
        document.getElementById("canvas").style.display = "block";   // показываем WebGL canvas
        document.getElementById("gameHUD").style.display = "flex";  // показываем HUD
        initialize();
        gameManager.beginGame();
    };

    document.getElementById("controlsButtonLogged").onclick = () => showControlsScreen();
}

function showWelcomeGuestScreen(){
    const demoPlayeBtn = document.getElementById("demoPlayButton");
    demoPlayeBtn.addEventListener("click", () => {
        document.getElementById("welcomeGuest").style.display = "none";
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
    const welcomeDiv = document.getElementById("welcomeGuest");
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
    const welcomeDiv = document.getElementById("welcomeGuest");
    welcomeDiv.style.display = "none";

    const modal = document.getElementById("registerModal");
    modal.style.display = "flex";

    const submitBtn = document.getElementById("submitRegister");
    const closeBtn = document.getElementById("closeRegister");
    
    const inputValidator = new RegisterInputHandler();

    submitBtn.addEventListener("click", async () => {
        inputValidator.removeInputErrors();
        if(!inputValidator.isValid()) return;

        authManager.register(inputValidator.getUsername(), inputValidator.getPassword())
        .then(res => {
            if(res.success){
                console.log("✅ Successfully registered:", res);
                localStorage.setItem("jwt", res.data?.token);
                inputValidator.removeInputErrors();
                modal.style.display = "none";
                setupWelcomeScreen();
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
    const welcomeDiv = document.getElementById("welcomeGuest");
    welcomeDiv.style.display = "none";
    
    const modal = document.getElementById("loginModal");
    modal.style.display = "flex";

    const submitBtn = document.getElementById("submitLogin");
    const closeBtn = document.getElementById("closeLogin");

    const inputValidator = new LoginInputHandler();

    submitBtn.addEventListener("click", async () => {
        inputValidator.removeInputErrors();
        if(!inputValidator.isValid()) return;

        authManager.login(inputValidator.getUsername(), inputValidator.getPassword())
        .then(res => {
            if(res.success){
                console.log("✅ Successfully logged in:", res);
                localStorage.setItem("jwt", res.data?.token);
                inputValidator.removeInputErrors();
                modal.style.display = "none";
                setupWelcomeScreen();
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