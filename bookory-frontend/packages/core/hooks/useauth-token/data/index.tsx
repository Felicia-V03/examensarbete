import { useState, useEffect } from "react";

interface UseAuthTokenReturn {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>; // Funktionen accepterar antingen ett direkt värde eller en callback-funktion
}

export const useAuthToken = (key: string = "authToken"): UseAuthTokenReturn => {
    const [token, setToken] = useState<string>(() => {
        return localStorage.getItem(key) || "";
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem(key, token);
        } else {
            localStorage.removeItem(key);
        }
    }, [token, key]);

    return { token, setToken };
};