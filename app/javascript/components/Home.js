import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
        this.choresArrangementChanges = this.choresArrangementChanges.bind(this);
        this.memberChange = this.memberChange.bind(this);
        this.reset = this.reset.bind(this);
    }

    handleLogout() {
        axios.delete("http://localhost:3000/logout", { withCredentials: true })
        .then(response => {
            this.props.handleLogout();
            this.props.history.push("/");
        })
        .catch(error => {
            console.log("Logout error", error);
        });
    }

    choresArrangementChanges() {
        this.props.history.push("/chores_changes");
    }

    memberChange() {
        this.props.history.push("/members_change");
    }

    switch() {
        axios.get("http://localhost:3000/switch", { withCredentials: true })
        .then(response => {
            this.props.history.push("/home")
        }).catch(error => {
            console.log("Switch error, error");
        })
    }

    reset() {
        this.props.history.push("/reset");
    }

    render() {
        var members_array = slice(this.props.members, 2);
        return (
            <div> 
                <h1>{this.props.loggedInStatus}</h1>
                <button type="button" onClick={this.handleLogout}>Log out</button>
                <div className="container">
                    {members_array.map(members => (
                        <div className="row" key={members[0].id}>
                            <Card member={members[0]} />
                            {members[1] ? 
                            (<Card member={members[1]} />) : (<div className="col col-sm-6"></div>)}
                        </div>
                        ))}
                </div>
                <button type="button" onClick={this.choresArrangementChanges}>Change the chores arrangement</button>
                <button type="button" onClick={this.memberChange}>Change the members</button>
                <button type="button" onClick={this.reset}>Reset</button>
                <button type="button" onClick={this.switch}>Switch</button>
            </div>
        );
    }
}

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chores: []
        }
    }

    componentDidMount() {
        axios.post("http://localhost:3000/get_chores",
            { member_id: this.props.member.id },
            { withCredentials: true })
            .then(response => {
                this.setState({
                    chores: response.data.chores
                });
            })
            .catch(error => {
                console.log("Get members error", error);
            });
    }

    render() {
        
        return (
            <div className="col col-sm-6">
                <h1>{this.props.member.name}</h1>
                {this.state.chores.length != 0 ?
                (this.state.chores.map(chore => (
                    <div key={this.props.member.id + chore.id}>
                    <h2>{chore.title}</h2>
                    <h3>{chore.description}</h3>
                    </div>)
                )) :
                (<h2>No chores</h2>)
                }
            </div >
        );
    }
}

function slice(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr
}

export default Home;