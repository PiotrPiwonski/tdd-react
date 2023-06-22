import SingUpPage from "./pages/SingUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AccountActivationPage from "./pages/AccountActivationPage";
import LanguageSelector from "./components/LanguageSelector";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {useState} from "react";
import NavBar from "./components/NavBar";

function App() {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        id:''
    });

  return (
      <Router>
          <NavBar auth={auth} />
          <div className="container pt-3">
              <Route exact path="/" component={HomePage}/>
              <Route path="/signup" component={SingUpPage}/>
              <Route path="/login" render={(reactRouterProps) => {
                return <LoginPage
                    {...reactRouterProps}
                    onLoginSuccess={setAuth}/>;
              }}/>
              <Route
                  path="/user/:id"
                  component={(reactRouterProps) => <UserPage {...reactRouterProps} auth={auth}/>}
              />
              <Route path="/activate/:token" component={AccountActivationPage}/>
              <LanguageSelector/>
          </div>
      </Router>


  );
}

export default App;
