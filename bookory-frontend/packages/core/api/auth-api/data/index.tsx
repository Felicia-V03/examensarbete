import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { LoginForm } from '@bookory-frontend/login';

interface AuthResponse {
    message?: string;
    token?: string;
}

const BASE_URL = 'https://hehkmce6d2.execute-api.eu-north-1.amazonaws.com/api';

// Skapar en axios-instans med bas-URL
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hjälpfunktion för att hantera fel
const handleError = (error: unknown, fallbackMessage: string): never => {
    const axiosError = error as AxiosError<AuthResponse>;
    if (axiosError.response) {
        throw new Error(axiosError.response.data?.message || fallbackMessage);
    }
    throw new Error('Network error');
};

// Hjälpfunktion för att spara token
const saveToken = (token?: string): void => {
    if (token) {
        localStorage.setItem('token', token);
    }
};

// Login
export const apiLogin = async (data: LoginForm): Promise<AuthResponse> => {
    try {
        const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', data);
        saveToken(response.data.token);
        return response.data;
    } catch (error) {
        return handleError(error, 'Login failed');
    }
};

// Register
export const apiRegister = async (data: LoginForm): Promise<AuthResponse> => {
    try {
        const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/register', data);
        saveToken(response.data.token);
        return response.data;
    } catch (error) {
        return handleError(error, 'Registration failed');
    }
};

// Logout
export const apiLogout = (): void => {
    localStorage.removeItem('token');
};

// Hämta token
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};