import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Arrangement from './Arrangement'
import MembersChange from './MembersChange'
import axios from 'axios';
import SetUp from './SetUp';
import ChoresChange from './ChoresChange';
export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: {},
            members: [],
            chores: []
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
        this.getMembers = this.getMembers.bind(this);
        this.allChores = this.allChores.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
        this.handleChoresChange = this.handleChoresChange.bind(this);
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

    allChores() {
        axios.get("http://localhost:3000/all_chores",
            { withCredentials: true }
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

    handleChoresChange(action_chores, action) {
        if (action === "add") {
            this.setState({
                chores: this.state.chores.concat(action_chores)
            })
        } else {
            const new_chores = this.state.chores.filter(chore => chore.id != action_chores)
            this.setState({
                chores: new_chores
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
        if (Object.entries(this.state.user).length != 0) {
            this.getMembers();
            this.allChores();
        }
    }

    render() {
        return (
            <div className="background">
                <BrowserRouter>
                    <Switch>
                        <Route exact path={"/"} render={props => (<Login {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/home"} render={props => (<Home {...props} handleLogout={this.handleLogout} loggedInStatus={this.state.loggedInStatus} />
                        )} />
                        <Route exact path={"/arrangement"} render={props => (<Arrangement {...props} />
                        )} />
                        <Route exact path={"/members_changes"} render={props => (<MembersChange {...props} members={this.state.members} handleMemberChange={this.handleMemberChange} />
                        )} />
                        <Route exact path={"/chores_changes"} render={props => (<ChoresChange {...props} chores={this.state.chores} handleChoresChange={this.handleChoresChange} />
                        )} />
                        <Route exact path={"/set_up"} render={props => (<SetUp {...props} members={this.state.members} chores={this.state.chores} handleMemberChange={this.handleMemberChange} handleChoresChange={this.handleChoresChange} />
                        )} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}