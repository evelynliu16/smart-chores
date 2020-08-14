import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ChoresChange from './ChoresChange'
import MembersChange from './MembersChange'
import axios from 'axios';
export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: {},
            members: []
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.getMembers = this.getMembers.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
    }

    handleLogin(data) {
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    getMembers() {
        axios.get("http://localhost:3000/get_members",
            { withCredentials: true }
        )
        .then(response => {
            this.setState({
                members: response.data.members
            })}
        )
        .catch(error => {
            console.log("Get members error", error)
        });
    }

    handleLogout() {
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
        });
    }

    handleMemberChange(action_member, action) {
        if (action === 'add') {
            this.setState({
                members: this.state.members.concat(action_member)
            })
        } else {
            const new_members = this.state.members.filter(member => member.id != action_member)
            this.setState({
                members: new_members
            })
        }
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

    componentDidMount() {
        this.checkLoginStatus();
        this.getMembers();
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path={"/"} render={props => (<Login {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/home"} render={props => (<Home {...props} handleLogout={this.handleLogout} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/chores_changes"} render={props => (<ChoresChange {...props} />
                        )} />
                        <Route exact path={"/members_changes"} render={props => (<MembersChange {...props} members={this.state.members} handleMemberChange={this.handleMemberChange} />
                        )} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}