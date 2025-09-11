import { initialize } from '../game/Main.js';
import { gameManager } from '../game/GameManager.js';
import { authManager } from '../network/AuthManager.js';
import { RegisterInputHandler } from './DataInputHandlers/RegisterInputHandler.js';
import { LoginInputHandler } from './DataInputHandlers/LoginInputHandler.js';
import { jwtParser } from '../network/JwtParser.js';

//TODO: show server exceptions in text fields


class WelcomeScreenHandler{
    #welcomeGuestDiv = null;
    #welcomeLoggedDiv = null;
    #currentWelcomeDiv = null;
    #userInfo = null;

    #registerInputHandler = null;
    #loginInputHandler = null;

    #registerModal = null;
    #loginModal = null;

    #username = "Guest";

    constructor(){
        this.#welcomeGuestDiv = document.getElementById("welcomeGuest");
        this.#welcomeLoggedDiv = document.getElementById("welcomeLogged");
        this.#userInfo = document.getElementById("userInfo");

        this.#registerInputHandler = new RegisterInputHandler();
        this.#loginInputHandler = new LoginInputHandler();

        this.#registerModal = document.getElementById("registerModal");
        this.#loginModal = document.getElementById("loginModal");

        this.#setupButtons();
    }

    setupWelcomeScreen(){
        const token = localStorage.getItem("jwt");
        const username = jwtParser.parseNicknameFromJwt(token);

        if(username){
            this.#username = username;
            this.#currentWelcomeDiv = this.#welcomeLoggedDiv;
            this.#showWelcomeLoggedScreen();
        }else{
            this.#username = "Guest";
            this.#currentWelcomeDiv = this.#welcomeGuestDiv;
            this.#showWelcomeGuestScreen();
        }
    }

    showCurrentWelcomeScreen(){
        this.#currentWelcomeDiv.style.display = "flex";
    }

    #setupButtons(){
        this.#setupPlayButtons();
        this.#setupRegisterButtons();
        this.#setupLoginButtons();
        this.#setupControlsButtons();

        document.getElementById("registerButton").onclick = () => this.#showRegisterModal();
        document.getElementById("loginButton").onclick = () => this.#showLoginModal();

        document.getElementById("logoutButton").onclick = () => {
            localStorage.removeItem("jwt");
            this.setupWelcomeScreen();
        };
    }

    #setupControlsButtons(){
        document.getElementById("controlsButtonLogged").onclick = () => this.#showControlsScreen();
        document.getElementById("controlsButton").onclick = () => this.#showControlsScreen();

        document.getElementById("closeControlsBtn").onclick = () => {
            document.getElementById("controlsScreen").style.display = "none";
            this.#currentWelcomeDiv.style.display = "flex";
        };
    }

    

    #setupPlayButtons(){
        const play = () => {
            this.#currentWelcomeDiv.style.display = "none";
            document.getElementById("canvas").style.display = "block";   // показываем WebGL canvas
            document.getElementById("gameHUD").style.display = "flex";  // показываем HUD
            initialize();
            gameManager.beginGame();
        }

        document.getElementById("playButton").onclick = () => {
            play();
        };

        document.getElementById("demoPlayButton").onclick = () => {
            play();
        };
    }

    #setupRegisterButtons(){
        document.getElementById("submitRegister").onclick = async () => {
            this.#registerInputHandler.removeInputErrors();
            if(!this.#registerInputHandler.isValid()) return;

            authManager.register(this.#registerInputHandler.getUsername(), this.#registerInputHandler.getPassword())
            .then(res => {
                if(res.success){
                    console.log("✅ Successfully registered:", res);
                    localStorage.setItem("jwt", res.data?.token);
                    this.#registerInputHandler.removeInputErrors();
                    this.#registerModal.style.display = "none";
                    this.setupWelcomeScreen();
                }else{
                    console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
                }
            })
            .catch(err => {
                console.error("❌ Error:", err);
            });
        };

        document.getElementById("closeRegister").onclick = () => {
            this.#registerInputHandler.removeInputErrors();
            this.#registerModal.style.display = "none";
            this.#toggleWelcomeGuest(true);
        };
    }

    #setupLoginButtons(){
        document.getElementById("submitLogin").onclick = async () => {
            this.#loginInputHandler.removeInputErrors();
            if(!this.#loginInputHandler.isValid()) return;

            authManager.login(this.#loginInputHandler.getUsername(), this.#loginInputHandler.getPassword())
            .then(res => {
                if(res.success){
                    console.log("✅ Successfully logged in:", res);
                    localStorage.setItem("jwt", res.data?.token);
                    this.#loginInputHandler.removeInputErrors();
                    this.#loginModal.style.display = "none";
                    setupWelcomeScreen();
                }else{
                    console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
                }
            })
            .catch(err => {
                console.error("❌ Error:", err);
            });
        };

        document.getElementById("closeLogin").onclick = () => {
            this.#loginInputHandler.removeInputErrors();
            this.#loginModal.style.display = "none";
            this.#toggleWelcomeGuest(true);
        };
    }

    #showWelcomeLoggedScreen(){
        this.#toggleWelcomeGuest(false);
        this.#toggleWelcomeLogged(true);

        this.#userInfo.textContent = this.#username;
    }

    #showWelcomeGuestScreen(){
        this.#toggleWelcomeGuest(true);
        this.#toggleWelcomeLogged(false);
    }

    #showControlsScreen(){
        this.#currentWelcomeDiv.style.display = "none";

        document.getElementById("controlsScreen").style.display = "flex";
    }

    #showRegisterModal(){
        this.#toggleWelcomeGuest(false);
        this.#registerModal.style.display = "flex";
    }

    #showLoginModal(){
        this.#toggleWelcomeGuest(false);
        this.#loginModal.style.display = "flex";
    }

    #toggleWelcomeGuest(toggle){
        this.#welcomeGuestDiv.style.display = toggle ? "flex" : "none";
    }

    #toggleWelcomeLogged(toggle){
        this.#welcomeLoggedDiv.style.display = toggle ? "flex" : "none";
    }
}

export const welcomeScreenHandler = new WelcomeScreenHandler();