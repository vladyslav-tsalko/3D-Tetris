import { InputHandler } from "./InputHandler.js";

export class RegisterInputHandler extends InputHandler {
    constructor() {
        super();
        const usernameInput = document.getElementById("registerUsername");
        const passwordInput = document.getElementById("registerPassword");
        const usernameError = document.getElementById("registerUsernameError");
        const passwordError = document.getElementById("registerPasswordError");
        this._initializeFields(usernameInput, passwordInput, usernameError, passwordError);
    }
}