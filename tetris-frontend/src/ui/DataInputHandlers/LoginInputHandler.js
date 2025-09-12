import { InputHandler } from "./InputHandler.js";

export class LoginInputHandler extends InputHandler {
    constructor() {
        super();
        const usernameInput = document.getElementById("loginUsername");
        const passwordInput = document.getElementById("loginPassword");
        const usernameError = document.getElementById("loginUsernameError");
        const passwordError = document.getElementById("loginPasswordError");
        this._initializeFields(usernameInput, passwordInput, usernameError, passwordError);
    }
}