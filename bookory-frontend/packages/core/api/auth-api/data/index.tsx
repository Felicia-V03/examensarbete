import axios, { AxiosError } from 'axios';
import type { AxiosResponse} from 'axios';
import type { UpdateProfileForm } from '@bookory-frontend/updateprofileform';
import type { BookHistory } from '@bookory-frontend/bookhistory';
import type { Profile } from '@bookory-frontend/user';
import type { LoginForm, RegisterForm } from '@bookory-frontend/login';


interface AuthResponse {
    message?: string;
    token?: string;
    user?: Profile;
}

interface UserApiResponse {
    message?: string;
    user?: Profile;
}


/** Lägger till Authorization-header om token finns */
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Hjälpfunktion för att hantera API-fel */
const handleError = (error: unknown, fallbackMessage: string): never => {
    const axiosError = error as AxiosError<AuthResponse>;
    if (axiosError.response) {
        throw new Error(axiosError.response.data?.message || fallbackMessage);
    }
    throw new Error('Network error');
};

// ─── Login ───────────────────────────────────────────────

export const apiLogin = async (data: LoginForm): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(
            'https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/auth/login',
            data
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Login failed');
        }
    } catch (error) {
        const axiosError = error as AxiosError<AuthResponse>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data?.message || 'Login failed');
        } else {
            throw new Error('Network error');
        }
    }
};

// ─── Register ───────────────────────────────────────────────

export const apiRegister = async (data: RegisterForm): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(
            'https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/auth/register',
            data
        );

        if (response.status === 201) {
            return response.data;
        } else {
            throw new Error(response.data?.message || 'Registration failed');
        }
    } catch (error) {
        const axiosError = error as AxiosError<AuthResponse>;
        if (axiosError.response) {
            throw new Error(axiosError.response.data?.message || 'Registration failed');
        } else {
            throw new Error('Network error');
        }
    }
};

const BASE_URL = 'https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api/auth/user';

/** Axios-instans med bas-URL och JSON-headers */
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Profil ───────────────────────────────────────────────

/** Hämtar profildata för inloggad användare via token */
export const getProfile = async (): Promise<Profile> => {
    try {
        const response: AxiosResponse<UserApiResponse> = await apiClient.get(
            '',
            { headers: getAuthHeaders() }
        );
        const user = response.data.user;
        if (!user) throw new Error('Ingen profildata i svaret');
        return user;
    } catch (error) {
        return handleError(error, 'Kunde inte hämta profil');
    }
};

/** Uppdaterar profilfält (email, telefon, address) för inloggad användare via token */
export const updateProfile = async (
    data: UpdateProfileForm
): Promise<Profile> => {
    try {
        const response: AxiosResponse<UserApiResponse> = await apiClient.put(
            '',
            data,
            { headers: getAuthHeaders() }
        );
        const user = response.data.user;
        if (!user) throw new Error('Ingen profildata i svaret');
        return user;
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
