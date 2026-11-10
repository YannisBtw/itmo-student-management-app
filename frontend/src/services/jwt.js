export function decodeJwt(token) {
    try {
        const part = token.split(".")[1];
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

        const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));

        return JSON.parse(new TextDecoder().decode(bytes));
    } catch (error) {
        return null;
    }
}


export function getUserFromToken(token) {
    const payload = decodeJwt(token);

    if (!payload || !payload.sub) {
        return null;
    }

    return {
        username: payload.sub,
        role: payload.role ?? null
    };
}


export function getTokenExpiresAtMs(token) {
    const payload = decodeJwt(token);

    return payload && payload.exp ? payload.exp * 1000 : null;
}
