import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ChoresChange from './ChoresChange'
import axios from 'axios';
export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: {},
            members: [],
            chores: [],
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.getMembers = this.getMembers.bind(this)
        this.allChores = this.allChores.bind(this)
    }

    handleLogin(data) {
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    handleLogout() {
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
        });
    }

    checkLoginStatus() {
        axios.get("http://localhost:3000/logged_in", { withCredentials: true})
        .then(response => {
            if (response.data.logged_in) {
                this.setState({
                    loggedInStatus: "LOGGED_IN",
                    user: response.data.user});
            } else if (!response.data.logged_in & this.state.loggedInStatus === "LOGGED_IN") {
                this.setState({
                    loggedInStatus: "NOT_LOGGED_IN",
                    user: {}
                });
            }
        })
        .catch(error => {
            console.log("Check login error", error);
        });
    }

    getMembers() {
        axios.get("http://localhost:3000/get_members",
            { withCredentials: true }
        )
        .then(response => {
            this.setState({
                members: response.data.members
            })
        })
        .catch(error => {
            console.log("Get members error", error);
        });
    }

    componentDidMount() {
        this.checkLoginStatus();
        this.getMembers();
        this.allChores();
    }

    allChores() {
        axios.get("http://localhost:3000/all_chores",
         { withCredentials: true}
        )
        .then(response => {
            this.setState({
                chores: response.data.chores
            })
        })
        .catch(error => {
            console.log("Get chores error", error);
        });
    }

    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        <Route exact path={"/"} render={props => (<Login {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/home"} render={props => (<Home {...props} handleLogout={this.handleLogout} members={this.state.members} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/chores_changes"} render={props => (<ChoresChange {...props} members={this.state.members}/>)} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}