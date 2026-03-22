import type { User }  from '@bookory-frontend/user';

/** Props för AuthButton – used on StartPage for login/register navigation */
export interface AuthButtonProps {
    user: User | null;
    type: 'login' | 'register';
    onClick: () => void;
    label?: string;
}