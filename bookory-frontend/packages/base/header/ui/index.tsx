import './index.css';
import { Link } from 'react-router-dom';
import LogoText from '../../../../src/assets/Logo-text.png';

export const Header = () => {

    return (
        <header className="header">
        <Link to="/">
        <img src={LogoText} alt="Bookory Logo" className="header__logo" />
        </Link>
      
    </header>
    );
}