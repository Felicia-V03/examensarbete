import './index.css';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCard } from '@bookory-frontend/auth-card';
import { AuthTabs } from '@bookory-frontend/auth-taps';
import { AuthTextField } from '@bookory-frontend/login-form';
import { AuthActionButton } from '@bookory-frontend/base-button';
import { apiRegister } from '../../../core/api/auth-api/data';

/**
 * RegisterPage – registreringssida.
 * Användaren fyller i namn, e-post, lösenord och bekräftar lösenordet.
 * Registrera-knappen aktiveras när alla fält är korrekt ifyllda och lösenorden matchar.
 */
export const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const canSubmit = useMemo(() => {
    return (
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword
    );
  }, [username, email, password, confirmPassword]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    try {
      const response = apiRegister({ username, email, password });

      console.log('Registration successful:', response);    
      
      navigate('/login');

    }
    catch (error) {
      console.error('Registration failed:', error);
    }

  };

  return (
    <main className="auth-page auth-page--register">
      <AuthCard>
        <h1 className="auth-brand">BOOKORY</h1>

        <AuthTabs active="register" onSelect={(t) => navigate(t === 'login' ? '/login' : '/register')} />

        <form className="auth-form" onSubmit={onSubmit}>
          <AuthTextField label="Name" value={username} onChange={setUsername} autoComplete="username" />
          <AuthTextField label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <AuthTextField 
            label="Password" 
            type="password" 
            value={password} 
            onChange={setPassword} 
            showToggle
            autoComplete="new-password" />
          <AuthTextField
            label="Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showToggle  
            autoComplete="current-password"
          />

          <AuthActionButton label="Sign up" disabled={!canSubmit} />

          <p className="auth-fineprint">
            By creating an account you are accepting our <strong>Terms of Services</strong>
          </p>
        </form>
      </AuthCard>
    </main>
  );
};