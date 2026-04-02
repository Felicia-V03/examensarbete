import './index.css';
import type { AuthButtonProps } from '@bookory-frontend/button';

/**
 * AuthButton – knapp för inloggning eller registrering på startsidan.
 * Stilen styrs av `type` ('login' | 'register').
 */
export const AuthButton = ({ type, onClick, label }: AuthButtonProps) => {
    return (
        <button className={`${type}_btn`} onClick={onClick}>
            {label ?? type}
        </button>
    );
};

/** Props för AuthActionButton */
interface AuthActionButtonProps {
    label: string;
    /** Om true inaktiveras knappen */
    disabled?: boolean;
}

/**
 * AuthActionButton – primär skicka-knapp för autentiseringsformulär (submit).
 */
export const AuthActionButton = ({ label, disabled }: AuthActionButtonProps) => {
    return (
        <button className="auth-action-btn" type="submit" disabled={disabled}>
            {label}
        </button>
    );
};

