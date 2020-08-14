import React, { Component } from "react";
import axios from "axios";
import Register from "./Register";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const { username, password } = this.state;
        
        axios.post("http://localhost:3000/signin",{ 
            user: {
                username: username,
                password: password,
                }
            },
            { withCredentials: true })
            .then(response => {
                if (response.data.status === "created") {
                    this.handleSuccessfulAuth(response.data);
                }
            })
            .catch(error => {
                console.log("Login error", error);
            });
        
        event.preventDefault();
    }

    handleSuccessfulAuth(data) {
        this.props.handleLogin(data);
        this.props.history.push("/home")
    }

    componentDidUpdate(prevStates, prevProps) {
        if (this.props.loggedInStatus === "LOGGED_IN") {
            this.props.history.push('/home'); 
        }
    } 

    render() {
        return (
            <div id="formContent">
                <form onSubmit={this.handleSubmit}>
                    <input type="text"
                        className="fadeIn second"
                        placeholder="Username"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        required
                    />

                    <input className="fadeIn third"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />

                    <button type="submit" className="fadeIn fourth">Sign in</button>
                </form>
                <Register handleSuccessfulAuth={this.handleSuccessfulAuth} />
            </div>
        );
    }
}

export default Login;