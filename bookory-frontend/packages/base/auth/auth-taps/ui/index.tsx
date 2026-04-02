import './index.css';

/** Props för AuthTabs-komponenten */
interface AuthTabsProps {
  /** Den aktiva fliken – antingen 'login' eller 'register' */
  active: 'login' | 'register';
  /** Callback som anropas när användaren klickar på en flik */
  onSelect: (tab: 'login' | 'register') => void;
}

/**
 * AuthTabs – navigationsflikar för att växla mellan inloggning och registrering.
 * Markerar den aktiva fliken med CSS-klassen `auth-tab--active`.
 */
export const AuthTabs = ({ active, onSelect }: AuthTabsProps) => {
  return (
    <nav className="auth-tabs" aria-label="Authentication tabs">
      <button
        type="button"
        className={active === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'}
        onClick={() => onSelect('login')}
      >
        Log in
      </button>
      <button
        type="button"
        className={active === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'}
        onClick={() => onSelect('register')}
      >
        Sign up
      </button>
    </nav>
  );
};