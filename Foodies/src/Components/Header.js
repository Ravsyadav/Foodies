import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import '../Styles/header.css';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid tomato',
        width: '350px'
    }
};

class Header extends Component {

    constructor() {
        super();
        this.state = {
            background: 'transparent',
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            signUpError: undefined,
        };
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);

        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname);
        });

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
        }
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
    }

    setHeaderStyle = (path) => {
        let bg = '';
        if (path === '/' || path === '/home') {
            bg = 'transparent';
        } else {
            bg = 'coloured';
        }
        this.setState({
            background: bg
        });
    }

    handleChange = (event, field) => {
        this.setState({
            [field]: event.target.value,
            loginError: undefined
        });
    }

    handleLoginButtonClick = () => {
        this.setState({
            isLoginModalOpen: true
        });
    }
    
    handleSignUpButtonClick = () => {
        this.setState({
            isSignUpModalOpen: true
        });
    }

    handleLogin = () => {
        // call the API to login the user
        const  { username, password } = this.state;
        const obj = {
            email: username,
            password: password
        }
        axios({
            method: 'POST',
            url: 'http://localhost:5402/api/userLogin',
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user[0]));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user[0],
                isLoggedIn: true,
                loginError: undefined
            });
            this.resetLoginForm();
        }).catch(error => {
            this.setState({
                loginError: 'Username or password is wrong !!'
            });
            console.log(error);
        });
    }

    handleSignUp = () => {
        const  { username, password, firstName, lastName } = this.state;
        const obj = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        axios({
            method: 'POST',
            url: 'http://localhost:5402/api/userSignUp',
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            debugger
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                signUpError: undefined
            });
            this.resetSignUpForm();
        }).catch(error => {
            this.setState({
                signUpError: 'Error in SignUp'
            });
            console.log(error);
        });
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    resetLoginForm = () => {
        this.setState({
            isLoginModalOpen: false,
            username: '',
            password: '',
            loginError: undefined
        });
    }

    resetSignUpForm = () => {
        this.setState({
            isSignUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            signUpError: undefined
        });
    }

    logoClickHandler = () => {
        this.props.history.push('/');
    }

    faceBookLoginHandler = () => {

    }

    responseSuccessGoogle = () => {

    }

    responseFailureGoogle = () => {

    }

    render() {
        const { background, isLoginModalOpen, username, password, isLoggedIn, user, loginError, isSignUpModalOpen, firstName, lastName, signUpError } = this.state;
        return (
            <div className="header" style={ {'background': background === 'transparent' ? 'transparent' : '#eb2929'} }>
                {
                    background === 'coloured'
                    ?
                        <img src={require('../Assets/logo1.png').default}className="logo" alt="image not found" onClick={this.logoClickHandler} />
                    :
                    null
                }
                <div className="float-end">
                    {
                        isLoggedIn 
                        ?
                        <div>
                            <span className="text-white m-4">{ user.firstName }</span>
                            <button className="btn btn-outline-light" onClick={this.logout}>Logout</button>
                        </div> 
                        :
                        <div>
                            <button className="btn text-white" onClick={this.handleLoginButtonClick}>Login</button>
                            <button className="btn btn-outline-light" onClick={this.handleSignUpButtonClick}>Create an account</button>
                        </div>
                    }
                </div>
                <Modal isOpen={isLoginModalOpen} style={customStyles}>
                    <h3>User Login</h3>
                    <form>
                        {
                            loginError ? <div className="alert alert-danger">{loginError}</div> : null
                        }
                        <label className="form-label">Username:</label>
                        <input type="text" value={username} className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                        <br />
                        <label className="form-label">Password:</label>
                        <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                        <br/>
                        <br/>
                        <FacebookLogin 
                            appId="154268059997095"
                            textButton="Continue with Facebook"
                            fields="name,email,picture"
                            size="metro"
                            callback={this.faceBookLoginHandler}
                            cssClass="fb"
                            icon="bi bi-facebook p-2"
                        />
                        <br/>
                        <br/>
                        <GoogleLogin 
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseSuccessGoogle}
                            onFailure={this.responseFailureGoogle}
                            cookiePolicy={'single_host_origin'}
                            icon="true"
                            className="google"
                        />
                        <br/>
                        <br/>
                        <input type="button" className="btn btn-primary" onClick={this.handleLogin} value="Login"/>
                        <input type="button" className="btn" onClick={this.resetLoginForm} value="Cancel"/>
                    </form>
                </Modal>

                <Modal isOpen={isSignUpModalOpen} style={customStyles}>
                    <h3>User Signup</h3>
                    <form>
                        {
                            signUpError ? <div className="alert alert-danger">{signUpError}</div> : null
                        }
                        <label className="form-label">First Name:</label>
                        <input type="text" value={firstName} className="form-control" onChange={(event) => this.handleChange(event, 'firstName')} />
                        <br />
                        <label className="form-label">Last Name:</label>
                        <input type="text" value={lastName} className="form-control" onChange={(event) => this.handleChange(event, 'lastName')} />
                        <br />
                        <label className="form-label">Email:</label>
                        <input type="text" value={username} placeholder="username" className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                        <br />
                        <label className="form-label">Password:</label>
                        <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                        <br/>
                        <br/>
                        <FacebookLogin 
                            appId="154268059997095"
                            textButton="Continue with Facebook"
                            fields="name,email,picture"
                            size="metro"
                            callback={this.faceBookLoginHandler}
                            cssClass="fb"
                            icon="bi bi-facebook p-2"
                        />
                        <br/>
                        <br/>
                        <GoogleLogin 
                            clientId=""
                            buttonText="Continue with Google"
                            onSuccess={this.responseSuccessGoogle}
                            onFailure={this.responseFailureGoogle}
                            cookiePolicy={'single_host_origin'}
                            icon="true"
                            className="google"
                        />
                        <br/>
                        <br/>
                        <input type="button" className="btn btn-primary" onClick={this.handleSignUp} value="Sign Up"/>
                        <input type="button" className="btn" onClick={this.resetSignUpForm} value="Cancel"/>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Header);