import React, { Component} from "react";
import Input from "../components/Input";
import { withTranslation } from "react-i18next";
import {signUp} from "../api/apiCalls";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";

class SingUpPage extends Component {

    state = {
        username: "",
        email: "",
        password: "",
        passwordRepeat: "",
        apiProgress: false,
        singUpSuccess: false,
        errors: {},
    };

    onChange = (event) => {
        const {id, value} = event.target;
        const errorsCopy = {...this.state.errors};
        delete errorsCopy[id];
        this.setState({
            [id]: value,
            errors: errorsCopy
        });
    };

    submit = async (event) => {
        event.preventDefault();
        const {username, email, password} = this.state;
        const body = {
            username,
            email,
            password
        };
        this.setState({apiProgress: true});
        try {
            await signUp(body);
            this.setState({singUpSuccess: true});
        } catch (err) {
            if (err.response.status === 400) {
                this.setState({errors: err.response.data.validationErrors});
            }
            this.setState({apiProgress: false});
        }


        // fetch("http://localhost:8080/api/1.0/users", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(body),
        // });
    };


    render() {
        const { t } = this.props
        let disabled = true;
        const {password, passwordRepeat, apiProgress, singUpSuccess, errors} = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }

        let passwordMismatch = password !== passwordRepeat ? t('passwordMismatchValidation') : "";
        return (
           <div
               className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
               data-testid="signup-page"
           >
               {!singUpSuccess && (
                   <form className="card" data-testid="form-sing-up">
                   <div className="card-header">
                       <h1 className="text-center">{t('signUp')}</h1>
                   </div>
                   <div className="card-body">
                       <Input
                           id="username"
                           label={t('username')}
                           onChange={this.onChange}
                           help={errors.username}
                       />
                       <Input
                           id="email"
                           label={t('email')}
                           onChange={this.onChange}
                           help={errors.email}
                       />
                       <Input
                           id="password"
                           label={t('password')}
                           onChange={this.onChange}
                           help={errors.password}
                           type="password"
                       />
                       <Input
                           id="passwordRepeat"
                           label={t('passwordRepeat')}
                           onChange={this.onChange}
                           help={passwordMismatch}
                           type="password"
                       />
                       <div className="text-center">
                           <ButtonWithProgress
                            disabled={disabled}
                            apiProgress={apiProgress}
                            onClick={this.submit}
                           >
                               {t('signUp')}
                           </ButtonWithProgress>
                       </div>
                   </div>
               </form>)}
               {singUpSuccess && (
                   <Alert>
                       Please check your e-mail to activate your account
                   </Alert>
               )}
           </div>
        )
    }
}

const SingUpPageWithTranslation = withTranslation()(SingUpPage);

export default SingUpPageWithTranslation;