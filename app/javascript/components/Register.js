import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            password_confirmation: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const { username, password, password_confirmation } = this.state;
        axios.post("http://localhost:3000/register", {
                    user: {
                        username: username,
                        password: password,
                        password_confirmation: password_confirmation
                    }
                },
                { withCredentials: true }
            )
            .then(response => {
                if (response.data.status === "created") {
                    this.props.handleSuccessfulAuth(response.data);
                }
            })
            .catch(error => {
                console.log("Registration error", error);
            });
        event.preventDefault();
    }
    

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text"
                        placeholder="Username"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password confirmation"
                        name="password_confirmation"
                        value={this.state.password_confirmation}
                        onChange={this.handleChange}
                        required
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }
}

export default Register;