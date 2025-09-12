import { initialize } from '../game/Main.js';
import { gameManager } from '../game/GameManager.js';
import { serverManager } from '../network/ServerManager.js';
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
            serverManager.logout();
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

            serverManager.register(this.#registerInputHandler.getUsername(), this.#registerInputHandler.getPassword())
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

            serverManager.login(this.#loginInputHandler.getUsername(), this.#loginInputHandler.getPassword())
            .then(res => {
                if(res.success){
                    console.log("✅ Successfully logged in:", res);
                    localStorage.setItem("jwt", res.data?.token);
                    this.#loginInputHandler.removeInputErrors();
                    this.#loginModal.style.display = "none";
                    this.setupWelcomeScreen();
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

        serverManager.loadTopPlayers()
        .then(res => {
            if(res.success){
                console.log("✅ Successfully received record table");
                this.#showRecordTable(res.data);
            }else{
                console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
            }
        })
        .catch(err => {
            console.error("❌ Error:", err);
        });

        let score = 0;
        serverManager.getMyScore()
        .then(res => {
            if(res.success){
                score = res.data?.score;
                console.log("✅ Successfully received score: ", score);
                this.#userInfo.textContent += `\nMax Score: ${score}`;
            }else{
                console.log(`⚠️ Warning, status ${res.status}, message: ${res.message}`);
            }
        })
        .catch(err => {
            console.error("❌ Error:", err);
        });


    }

    #showRecordTable(players) {
        const tbody = document.querySelector('#topPlayersTable tbody');
        tbody.innerHTML = ''; // очищаем старые строки

        // Если таблицу скрывали через display:none, лучше показывать сам tbody или весь контейнер
        document.getElementById("topPlayersTable").style.display = "table";

        // проходим по игрокам и создаем строки
        players.forEach((player, index) => {
            const tr = document.createElement('tr');

            // rank, nickname, maxScore
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.nickname}</td>
                <td>${player.maxScore}</td>
            `;

            tbody.appendChild(tr);
        });
    }

    #showWelcomeGuestScreen(){
        this.#toggleWelcomeGuest(true);
        this.#toggleWelcomeLogged(false);

        this.#userInfo.textContent = this.#username;

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