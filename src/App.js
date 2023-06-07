import SingUpPage from "./pages/SingUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import LanguageSelector from "./components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import logo from "./assets/hoaxify.png";

function App() {
    const { t } = useTranslation();

    const [path, setPath] = useState(window.location.pathname);

    const onClickLink = (event) => {
        event.preventDefault();
        const path = event.currentTarget.attributes.href.value;
        window.history.pushState({}, "", path);
        setPath(path);
    }

  return (
      <>
          <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
              <div className="container">
                  <a
                      href="/" title="Home"
                      onClick={onClickLink}
                      className="navbar-brand"
                  >
                      <img src={logo} alt="logo" width="60"/>
                      Home
                  </a>
                  <ul className="navbar-nav">
                      <a
                          href="/signup"
                          onClick={onClickLink}
                          className="nav-link"
                      >
                          {t('signUp')}
                      </a>
                      <a
                          href="/login"
                          onClick={onClickLink}
                          className="nav-link"
                      >
                          Login
                      </a>
                  </ul>
              </div>
          </nav>
          <div className="container">
              {path === '/' && <HomePage/>}
              {path === '/signup' && <SingUpPage/>}
              {path === '/login' && <LoginPage/>}
              {path.startsWith('/user/') && <UserPage/>}
              <LanguageSelector/>
          </div>
      </>


  );
}

export default App;
