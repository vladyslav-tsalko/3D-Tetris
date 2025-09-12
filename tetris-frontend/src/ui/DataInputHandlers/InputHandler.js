const UsernameException = Object.freeze({
    None: 0,
    Empty: 1
});

const PasswordException = Object.freeze({
    None: 0,
    Empty: 1,
    Short: 2
});

export class InputHandler{
    #usernameInput = null;
    #passwordInput = null;
    #usernameError = null;
    #passwordError = null;
    #init = false;

    constructor() {
        if (new.target === InputHandler) {
            throw new Error("InputHandler variable can't be directly created");
        }
    }

    _initializeFields(usernameInput, passwordInput, usernameError, passwordError) {
        this.#usernameInput = usernameInput;
        this.#passwordInput = passwordInput;
        this.#usernameError = usernameError;
        this.#passwordError = passwordError;
        this.#init = true;
    }

    isValid(){
        if(!this.#init) return false;

        const usernameException = this.#getUsernameException();
        const passwordException = this.#getPasswordException();
        if(usernameException == 0 && passwordException == 0) return true;

        this.#handleUsernameException(usernameException);
        this.#handlePasswordException(passwordException);
        return false;
    }

    removeInputErrors(){
        if(!this.#init) return;
        
        [this.#usernameInput, this.#passwordInput].forEach(input => input.classList.remove("input-error"));
        [this.#usernameError, this.#passwordError].forEach(err => {
            err.innerText = "";
            err.classList.remove("active");
        });
    }

    getUsername(){
        return this.#usernameInput.value.trim();
    }

    getPassword(){
        return this.#passwordInput.value.trim();
    }

    #getUsernameException(){
        return !this.#usernameInput.value.trim() ? UsernameException.Empty: UsernameException.None;
    }

    #getPasswordException(){
        const password = this.#passwordInput.value.trim();
        if (!password) {
            return PasswordException.Empty;
        } else if (password.length < 6) {
            return PasswordException.Short;
        }
        return PasswordException.None;
    }

    #handleUsernameException(exception){
        switch (exception) {
            case UsernameException.None: return;
            case UsernameException.Empty: {
                this.#usernameInput.classList.add("input-error");
                this.#usernameError.innerText = "Username is required";
                this.#usernameError.classList.add("active");
                return;
            }
        }
    }

    #handlePasswordException(exception){
        switch(exception){
            case PasswordException.None: return;
            case PasswordException.Empty: {
                this.#passwordError.innerText = "Password is required";
            }
            case PasswordException.Short:{
                this.#passwordError.innerText = "Password must be at least 6 characters";
            }
            default:{
                this.#passwordInput.classList.add("input-error");
                this.#passwordError.classList.add("active");
            }
        }
    }
}