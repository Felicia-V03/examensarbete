
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { UpdateProfileForm } from '@bookory-frontend/updateprofileform';
import type { BookHistory } from '@bookory-frontend/bookhistory';

/** Profil-data för en inloggad användare */
export interface Profile {
    userId: string;
    name: string;
    email: string;
    username: string;
    phoneNumber?: string;
    address?: string;
}

interface ApiResponse<T> {
    message?: string;
    data?: T;
}

const BASE_URL = 'https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/auth/user';

/** Axios-instans med bas-URL och JSON-headers */
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/** Lägger till Authorization-header om token finns */
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Hjälpfunktion för att hantera API-fel */
const handleError = (error: unknown, fallbackMessage: string): never => {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
        throw new Error(axiosError.response.data?.message || fallbackMessage);
    }
    throw new Error('Network error');
};

// ─── Profil ───────────────────────────────────────────────

/** Hämtar profildata för en användare */
export const getProfile = async (userId: string): Promise<Profile> => {
    try {
        const response: AxiosResponse<Profile> = await apiClient.get(
            `/profile/${userId}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'Kunde inte hämta profil');
    }
};

/** Uppdaterar profilfält (email, telefon, adress) */
export const updateProfile = async (
    userId: string,
    data: UpdateProfileForm
): Promise<Profile> => {
    try {
        const response: AxiosResponse<Profile> = await apiClient.put(
            `/profile/${userId}`,
            data,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'Kunde inte uppdatera profil');
    }
};

// ─── Bokhistorik ──────────────────────────────────────────

/** Hämtar alla böcker i användarens historik */
export const getBookHistory = async (userId: string): Promise<BookHistory[]> => {
    try {
        const response: AxiosResponse<BookHistory[]> = await apiClient.get(
            `/profile/${userId}/books`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'Kunde inte hämta bokhistorik');
    }
};

/** Lägger till en bok i användarens historik */
export const addBookToHistory = async (
    userId: string,
    book: Omit<BookHistory, 'bookId' | 'addedAt'>
): Promise<BookHistory> => {
    try {
        const response: AxiosResponse<BookHistory> = await apiClient.post(
            `/profile/${userId}/books`,
            book,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'Kunde inte lägga till bok');
    }
};

/** Tar bort en bok från användarens historik */
export const deleteBookFromHistory = async (
    userId: string,
    bookId: string
): Promise<void> => {
    try {
        await apiClient.delete(
            `/profile/${userId}/books/${bookId}`,
            { headers: getAuthHeaders() }
        );
    } catch (error) {
        handleError(error, 'Kunde inte ta bort bok');
    }
};

/** Uppdaterar status på en bok i historiken */
export const updateBookStatus = async (
    userId: string,
    bookId: string,
    status: BookHistory['status']
): Promise<BookHistory> => {
    try {
        const response: AxiosResponse<BookHistory> = await apiClient.put(
            `/profile/${userId}/books/${bookId}`,
            { status },
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        return handleError(error, 'Kunde inte uppdatera bokstatus');
    }
};
