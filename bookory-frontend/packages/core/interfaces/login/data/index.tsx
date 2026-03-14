import type { User } from '@bookory-frontend/user';

export interface LoginForm {
	Email: string;
	password: string;
}

export interface LoginPageProps {
	setCurrentUser: (user: User) => void; // passing from approuter to loginpage and registerpage
}