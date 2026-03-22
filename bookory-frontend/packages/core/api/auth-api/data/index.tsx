// import axios, { AxiosResponse, AxiosError } from 'axios';
// import type { LoginForm } from '@bookory-frontend/login';

// interface AuthResponse {
//     message?: string;
//     token?: string;
// }

// export const apiLogin = async (data: LoginForm): Promise<AxiosResponse<AuthResponse>> => {
//     try {
//         const response = await axios.post<AuthResponse>(
//             //'https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/login',
//             data
//         );

//         if (response.status === 200) {
//             return response;
//         } else {
//             throw new Error(response.data?.message || 'Login failed');
//         }
//     } catch (error) {
//         const axiosError = error as AxiosError<AuthResponse>;
//         if (axiosError.response) {
//             throw new Error(axiosError.response.data?.message || 'Login failed');
//         } else {
//             throw new Error('Network error');
//         }
//     }
// };

// export const apiRegister = async (data: LoginForm): Promise<AxiosResponse<AuthResponse>> => {
//     try {
//         const response = await axios.post<AuthResponse>(
//             //'https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/register',
//             data
//         );

//         if (response.status === 201) {
//             return response;
//         } else {
//             throw new Error(response.data?.message || 'Registration failed');
//         }
//     } catch (error) {
//         const axiosError = error as AxiosError<AuthResponse>;
//         if (axiosError.response) {
//             throw new Error(axiosError.response.data?.message || 'Registration failed');
//         } else {
//             throw new Error('Network error');
//         }
//     }
// };