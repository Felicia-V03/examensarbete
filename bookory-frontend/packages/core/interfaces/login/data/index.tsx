import type { User } from '@bookory-frontend/user';

/** Data som skickas vid inloggning */
export interface LoginForm {
	email: string;
	password: string;
}

/** Props för LoginPage – används för att sätta inloggad användare i överliggande komponent */
export interface LoginPageProps {
	setCurrentUser: (user: User) => void; // passing from approuter to loginpage and registerpage
}

export interface RegisterForm {
	username: string;
	email: string;
	password: string;
}