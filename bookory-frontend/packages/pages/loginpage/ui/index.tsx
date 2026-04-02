import './index.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GirlImage from '../../../../src/assets/bookory-girl.png';
import { AuthCard } from '@bookory-frontend/auth-card';
import { AuthTabs } from '@bookory-frontend/auth-taps';
import { AuthTextField } from '@bookory-frontend/login-form';
import { AuthActionButton } from '@bookory-frontend/base-button';
import { apiLogin } from '../../../core/api/auth-api/data';
import { useAuthStore } from '@bookory-frontend/auth-store';

/**
 * LoginPage – inloggningssida.
 * Användaren fyller i e-post och lösenord.
 * Skickar-knappen aktiveras först när båda fälten är ifyllda.
 */
export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length > 0;
    }, [email, password]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmit) return;

        setErrorMessage(null);

        try {
            const response = await apiLogin({ email, password });

            console.log('FULL RESPONSE:', response);

            const token = response.token;
            const user = response.user;

            if (token) {
                localStorage.setItem('authToken', token);
            } else {
                console.error('No token found in response');
            }

            if (user) {
                login(user);
            }

            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <main className="auth-page auth-page--login">
            <AuthCard>
                <figure className="auth-illustration">
                    <img src={GirlImage} alt="Bookory" className="auth-illustration__img" />
                </figure>

                <AuthTabs active="login" onSelect={(t) => navigate(t === 'login' ? '/login' : '/register')} />

                <form className="auth-form" onSubmit={onSubmit}>
                    <AuthTextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
                    <AuthTextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        autoComplete="current-password"
                        showToggle
                    />

                    {errorMessage && (
                        <p className="auth-error">{errorMessage}</p>
                    )}
                    <AuthActionButton 
                        label="Log in" 
                        disabled={!canSubmit} 
                    />
                </form>
            </AuthCard>
        </main>
    );
};