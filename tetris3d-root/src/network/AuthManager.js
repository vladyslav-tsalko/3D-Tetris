class AuthManager {
    constructor() {
        this.apiUrl = "http://localhost:8080/api"; // твой Spring backend
        this.token = localStorage.getItem("token") || null;
    }

    async register(username, password) {
        const res = await fetch(`${this.apiUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error("Registration failed");
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
