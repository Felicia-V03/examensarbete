/** Representerar en registrerad användare i systemet */
export interface User {
    userId: string;
    email: string;
    name: string;
    usernae: string;
    role: string;
    phoneNumber?: string;
}

export interface Profile {
    userId: string;
    name: string;
    email: string;
    username: string;
    phoneNumber?: string;
    address?: string;
}