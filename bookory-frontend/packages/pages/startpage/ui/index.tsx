import './index.css';
//import { useNavigate } from 'react-router-dom';
import Logo from '../../../../src/assets/logo.png';
//import { AuthButton } from '../../components/Button/button';

export const StartPage = () => {
    //const navigate = useNavigate();

    return (
        <section className="page-body landing-page">
        <figure className="logo">
            <img src={Logo} alt="Bookory Image" className="logo-image" />
        </figure>
        <aside className="btn_container">
        {/* <AuthButton type="login" user={null} onClick={() => navigate('/login')} label="Log in" />
        <AuthButton type="register" user={null} onClick={() => navigate('/register')} label="Register" />  */}
        </aside>      
        </section>
    )
}

