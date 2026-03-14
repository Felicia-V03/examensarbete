
import './index.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GirlImage from '../../../../src/assets/bookory-girl.png';
import { AuthCard } from '@bookory-frontend/auth-card';
import { AuthTabs } from '@bookory-frontend/auth-taps';
import { AuthTextField } from '@bookory-frontend/login-form';
import { AuthActionButton } from '@bookory-frontend/base-button';

export const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length > 0;
    }, [email, password]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmit) return;

        navigate('/');
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
                    />

                    <AuthActionButton label="Log in" disabled={!canSubmit} />

                    <button
                        className="auth-link"
                        type="button"
                        onClick={() => {
                            navigate('/register');
                        }}
                    >
                        Forget password?
                    </button>
                </form>
            </AuthCard>
        </main>
    );
};