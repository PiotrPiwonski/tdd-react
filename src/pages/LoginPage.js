import Input from "../components/Input";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";
import React, {useState, useEffect, useContext} from "react";
import { login } from "../api/apiCalls";
import { useTranslation } from "react-i18next";
import {AuthContext} from "../state/AuthContextWrapper";

const LoginPage = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [apiProgress, setApiProgress] = useState(false);
    const [failMessage, setFailMessage] = useState();

    const auth = useContext(AuthContext);

    const { t } = useTranslation();

    useEffect(() => {
        setFailMessage();
    }, [email, password]);

    const submit = async (event) => {
        event.preventDefault();
        setApiProgress(true);
        try {
            const response = await login({email, password});
            props.history.push("/");
            auth.onLoginSuccess({
                isLoggedIn: true,
                id: response.data.id
            });
        } catch (error) {
            setFailMessage(error.response.data.message);
        }
        setApiProgress(false);
    }

    let disabled = !(email && password);

    return (
    <div
        className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
        data-testid="login-page"
    >
            <form className="card" >
                <div className="card-header">
                    <h1 className="text-center">{t("login")}</h1>
                </div>
                <div className="card-body">
                    <Input
                        id="email"
                        label={t('email')}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setFailMessage();
                        }}
                    />
                    <Input
                        id="password"
                        label={t('password')}
                        type="password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setFailMessage();
                        }}
                    />
                    {failMessage &&
                        <Alert type="danger">
                            {failMessage}
                        </Alert>
                    }
                    <div className="text-center">
                        <ButtonWithProgress
                            disabled={disabled}
                            apiProgress={apiProgress}
                            onClick={submit}
                        >
                            {t("login")}
                        </ButtonWithProgress>
                    </div>
                </div>
            </form>
    </div>
    )
}

export default LoginPage;