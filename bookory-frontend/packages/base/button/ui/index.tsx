import './index.css';
import type { AuthButtonProps } from '@bookory-frontend/button';

export const AuthButton = ({ type, onClick, label }: AuthButtonProps) => {
    return (
        <button className={`${type}_btn`} onClick={onClick}>
            {label ?? type}
        </button>
    );
};

interface AuthActionButtonProps {
    label: string;
    disabled?: boolean;
}

export const AuthActionButton = ({ label, disabled }: AuthActionButtonProps) => {
    return (
        <button className="auth-action-btn" type="submit" disabled={disabled}>
            {label}
        </button>
    );
};