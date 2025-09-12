class ServerManager {
    constructor() {
        this.apiUrl = "http://localhost:8080/api"; // твой Spring backend
    }

    async register(username, password) {
        try{
            const res = await fetch(`${this.apiUrl}/auth/register`, {
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
            const res = await fetch(`${this.apiUrl}/auth/login`, {
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

    async updateMaxScore(newScore){
        try{
            const token = localStorage.getItem('jwt'); // JWT токен
            if (!token) {
                return;
            }

            const res = await fetch(`${this.apiUrl}/stats/update`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    newMaxScore: newScore,
                })
            });

            if (res.ok) {
                console.info('Success!');
                return { success: true };
            } 
            else {
                const data = await res.json().catch(() => null); // безопасно парсим JSON, если есть
                console.info(data?.error || res.statusText);
                return { success: false, status: res.status, message: data?.error || res.statusText };
            }

        } catch(err){
            return { success: false, status: 0, message: "Network error" };
        }
    }
    
    logout() {
        localStorage.removeItem("jwt");
    }
}

export const serverManager = new ServerManager();
