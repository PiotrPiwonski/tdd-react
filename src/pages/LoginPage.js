import Input from "../components/Input";
import Alert from "../components/Alert";
import React, {useState, useEffect} from "react";
import { login } from "../api/apiCalls";
import Spinner from "../components/Spinner";
import { useTranslation } from "react-i18next";

const LoginPage = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [apiProgress, setApiProgress] = useState(false);
    const [failMessage, setFailMessage] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        setFailMessage();
    }, [email, password]);

    const submit = async (event) => {
        event.preventDefault();
        setApiProgress(true);
        try {
            await login({email, password});
            props.history.push("/");
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
                        <button
                            className="btn btn-primary"
                            disabled={disabled || apiProgress}
                            onClick={submit}
                        >
                            {apiProgress && <Spinner/>}
                            {t("login")}
                        </button>
                    </div>
                </div>
            </form>
    </div>
    )
}

export default LoginPage;