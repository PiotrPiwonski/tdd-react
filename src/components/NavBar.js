import { Link } from "react-router-dom";
import logo from "../assets/hoaxify.png";
import { useTranslation } from "react-i18next";
import {AuthContext} from "../App";
import {useContext} from "react";

const NavBar = (props) => {
    const { t } = useTranslation();
    const auth = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
            <div className="container">
                <Link
                    to="/"
                    title="Home"
                    className="navbar-brand"
                >
                    <img src={logo} alt="logo" width="60"/>
                    Home
                </Link>
                <ul className="navbar-nav">
                    {!auth.isLoggedIn &&
                        <>
                            <Link
                                to="/signup"
                                className="nav-link"
                            >
                                {t('signUp')}
                            </Link>
                            <Link
                                to="/login"
                                className="nav-link"
                            >
                                {t('login')}
                            </Link>
                        </>
                    }
                    {auth.isLoggedIn &&
                        <Link
                            to={`/user/${auth.id}`}
                            className="nav-link"
                        >
                            My Profile
                        </Link>
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;