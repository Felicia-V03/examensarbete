import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

/** Representation av ett navigeringsobjekt i bott-menyn */
interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

/**
 * Navbar – bott-navigationsmeny för inloggade användare.
 * Markerar den aktiva routen med CSS-klassen `active`.
 */
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'explore', label: 'Explore', icon: '🧭', path: '/explore' },
    { id: 'library', label: 'Library', icon: '📚', path: '/search' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
            aria-label={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}