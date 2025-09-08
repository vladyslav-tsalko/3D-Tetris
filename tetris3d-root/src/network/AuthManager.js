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
                //console.log("✅ Registered:", data);
                return { success: true, data };
            } 
            // else if (res.status === 409) {
            //     //console.log("⚠️ Username already exists:", data?.error || "Conflict");
            //     return { success: false, status: 409, message: data?.error };
            // } 
            else {
                //console.log("❌ Registration failed:", data?.error || res.statusText);
                return { success: false, status: res.status, message: data?.error || res.statusText };
            }

        } catch(err){
            return { success: false, status: 0, message: "Network error" };
        }
        

        // if (res.status === 409) {
        //     throw new Error("This username is already taken");
        // }

        // if (!res.ok) {
        //     throw new Error(`Registration failed: ${res.status}`);
        // }
        return res.json();
    }

    async login(username, password) {
        const res = await fetch(`${this.apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        this.token = data.token;
        localStorage.setItem("token", this.token);
        return data;
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
