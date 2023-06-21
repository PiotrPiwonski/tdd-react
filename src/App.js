import SingUpPage from "./pages/SingUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AccountActivationPage from "./pages/AccountActivationPage";
import LanguageSelector from "./components/LanguageSelector";
import { useTranslation } from "react-i18next";
import logo from "./assets/hoaxify.png";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {useState} from "react";

function App() {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        id:''
    });
    const { t } = useTranslation();

  return (
      <Router>
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
                          Login
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
          <div className="container pt-3">
              <Route exact path="/" component={HomePage}/>
              <Route path="/signup" component={SingUpPage}/>
              <Route path="/login" render={(reactRouterProps) => {
                return <LoginPage
                    {...reactRouterProps}
                    onLoginSuccess={setAuth}/>;
              }}/>
              <Route path="/user/:id" component={UserPage}/>
              <Route path="/activate/:token" component={AccountActivationPage}/>
              <LanguageSelector/>
          </div>
      </Router>


  );
}

export default App;
