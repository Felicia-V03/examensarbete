import { create } from 'zustand';
import type { User } from '@bookory-frontend/user';

/** Tillstånd och metoder för autentiseringsstore */
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    /** Loggar in användaren och sparar user-data i store */
    login: (userData: User) => void;
    /** Loggar ut användaren och nollställer store */
    logout: () => void;
}

/**
 * useAuthStore – global Zustand-store för autentisering.
 * Håller användardata och inloggningsstatus.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: (userData) =>
        set({
            user: userData,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));
