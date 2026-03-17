import './index.css';

interface AuthTabsProps {
  active: 'login' | 'register';
  onSelect: (tab: 'login' | 'register') => void;
}

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