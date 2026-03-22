import { useState, useEffect } from "react";

/** Returtyp för useAuthToken-hooken */
interface UseAuthTokenReturn {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>; // Funktionen accepterar antingen ett direkt värde eller en callback-funktion
}

/**
 * useAuthToken – custom hook för att hantera ett JWT-token i localStorage.
 * Laddar token automatiskt vid montering och sparar/tar bort det när det ändras.
 * @param key - localStorage-nyckeln att använda (standard: 'authToken')
 */
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