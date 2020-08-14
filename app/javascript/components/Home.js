import React, { Component } from "react";
import axios from "axios"; 

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: []
        }

        this.handleLogout = this.handleLogout.bind(this);
        this.choresArrangementChanges = this.choresArrangementChanges.bind(this);
        this.memberChange = this.memberChange.bind(this);
        this.reset = this.reset.bind(this);
        this.getMemberAndChores = this.getMembersAndChores.bind(this);
        this.switch = this.switch.bind(this);
    }

    /** Log out the user. */
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

    /** Change the chores arrangement. */
    choresArrangementChanges() {
        this.props.history.push("/chores_changes");
    }

    /** Change the members. */
    memberChange() {
        this.props.history.push("/members_changes");
    }

    /** Switch the chores either clockwise or counterclockwise. */
    switch(event) {
        var resp = event.target.value;
        axios.post("http://localhost:3000/switch_chores",
            { id: event.target.id },
            { withCredentials: true }
        )
        .then(response => {
            if (response.data.switched) {
                console.log(resp);
                this.getMemberAndChores();
            }
        })
        .catch(error => {
            console.log("Switch error", error);
        });
    }

    /** Reset all members and chores. */
    reset() {
        this.props.history.push("/reset");
    }
    
    componentDidMount() {
        this.getMemberAndChores();
    }

    /** Set state for all the members and each member's chores */
    getMembersAndChores() {
        axios.get("http://localhost:3000/get_members",
            { withCredentials: true }
        )
        .then(response => {
            this.setState({
                members: response.data.members
            })
            response.data.members.map(member => {
                axios.post("http://localhost:3000/get_chores",
                    { member_id: member.id },
                    { withCredentials: true })
                    .then(response => {
                        this.setState({
                            [member.id] : response.data.chores
                        });
                    })
                    .catch(error => {
                        console.log("Set each member's chores error", error);
                    });
                });
            })
        .catch(error => {
            console.log("Get members error", error);
        });
    }

    render() {
        var members_array = slice(this.state.members, 2);
        return (
            <div className="background"> 
                <div className="container">
                    {members_array.map(members => (
                        <div className="row" key={members[0].id}>
                            <Card member={members[0]} chores={this.state[members[0].id]} />
                            {members[1] ? 
                            (<Card member={members[1]} chores={this.state[members[1].id]}/>) 
                            : (<div className="col col-sm-6"></div>)}
                        </div>
                        ))}
                </div>
                <button type="button" onClick={this.choresArrangementChanges}>Change the chores arrangement</button><br/>
                <button type="button" onClick={this.memberChange}>Change the members</button><br/>
                <button type="button" onClick={this.reset}>Reset</button><br/>
                <button type="button" value="Chores switched clockwise" id="1" onClick={this.switch}>Switch clockwise</button>
                <button type="button" value="Chores switched counterclockwise" id="0" onClick={this.switch}>Switch counterclockwise</button><br/>
                <button type="button" onClick={this.handleLogout}>Log out</button>
            </div>
        );
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="col col-sm-6 cards">
                <h1 className="name">{this.props.member.name}</h1>
                {this.props.chores ?
                (this.props.chores.map(chore => (
                    <div key={this.props.member.id + chore.id}>
                    <h2 className="title">{chore.title}</h2>
                    <h3 className="descript">{chore.description}</h3>
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