/** Representerar en registrerad användare i systemet */
export interface User {
    userId: string;
    email: string;
    name: string;
    username: string;
    role: string;
    phone?: string;
}

export interface Profile {
    userId: string;
    name: string;
    email: string;
    username: string;
    phone?: string;
    address?: string;
}