class AuthManager {
    constructor() {
        this.apiUrl = "http://localhost:8080/api"; // твой Spring backend
        this.token = localStorage.getItem("token") || null;
    }

    async register(username, password) {
        try{
            const res = await fetch(`${this.apiUrl}/players/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await res.json().catch(() => null); // безопасно парсим JSON, если есть

            if (res.ok) {
                return { success: true, data };
            } 
            else {
                return { success: false, status: res.status, message: data?.error || res.statusText };
            }

        } catch(err){
            return { success: false, status: 0, message: "Network error" };
        }
    }

    async login(username, password) {
         try{
            const res = await fetch(`${this.apiUrl}/players/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await res.json().catch(() => null); // безопасно парсим JSON, если есть

            if (res.ok) {
                return { success: true, data };
            } 
            else {
                return { success: false, status: res.status, message: data?.error || res.statusText };
            }

        } catch(err){
            return { success: false, status: 0, message: "Network error" };
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem("token");
    }

    isAuthenticated() {
        return this.token !== null;
    }

    async getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        const res = await fetch(`${this.apiUrl}/auth/me`, {
            headers: { "Authorization": `Bearer ${this.token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
    }
}

export const authManager = new AuthManager();
