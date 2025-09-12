class JwtParser{
    parseNicknameFromJwt(token){
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            if(!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const payload = JSON.parse(jsonPayload);
            return payload.sub; // JWTService.setSubject(username)
        } catch (err) {
            console.error("Invalid token", err);
            return null;
        }
    }
}

export const jwtParser = new JwtParser();