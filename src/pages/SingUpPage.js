import { Component} from "react";
import axios from "axios";


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
        this.setState({
            [id]: value,
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
            await axios.post('/api/1.0/users', body);
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
        let disabled = true;
        const {password, passwordRepeat, apiProgress, singUpSuccess, errors} = this.state;
        if (password && passwordRepeat) {
            disabled = password !== passwordRepeat;
        }
        return (
           <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
               {!singUpSuccess && (<form className="card mt-5" data-testid="form-sing-up">
                   <div className="card-header">
                       <h1 className="text-center">Sing Up</h1>
                   </div>
                   <div className="card-body">
                       <div className="mb-3">
                           <label htmlFor="username" className="form-label">Username</label>
                           <input
                               id="username"
                               onChange={this.onChange}
                               className="form-control"
                           />
                           <span>{errors.username}</span>
                       </div>
                       <div className="mb-3">
                           <label htmlFor="email" className="form-label">E-mail</label>
                           <input
                               id="email"
                               onChange={this.onChange}
                               className="form-control"/>
                       </div>
                       <div className="mb-3">
                           <label htmlFor="password" className="form-label">Password</label>
                           <input
                               id="password"
                               type="password"
                               onChange={this.onChange}
                               className="form-control"/>
                       </div>
                       <div className="mb-3">
                           <label htmlFor="passwordRepeat" className="form-label">Password Repeat</label>
                           <input
                               id="passwordRepeat"
                               type="password"
                               onChange={this.onChange}
                               className="form-control"/>
                       </div>
                       <div className="text-center">
                           <button
                               className="btn btn-primary"
                               disabled={disabled || apiProgress}
                               onClick={this.submit}
                           >
                               {apiProgress && (
                               <span
                                   className="spinner-border spinner-border-sm"
                                   role="status"
                               ></span>)}
                               Sing Up
                           </button>
                       </div>
                   </div>
               </form>)}
               {singUpSuccess && (
                   <div className="alert alert-success mt-3">
                   Please check your e-mail to activate your account
               </div>
               )}
           </div>
        )
    }
}

export default SingUpPage;