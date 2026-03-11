import type { User }  from '@bookory-frontend/user';

export interface AuthButtonProps {
    user: User | null;
    type: 'login' | 'register';
    onClick: () => void;
    label?: string;
}