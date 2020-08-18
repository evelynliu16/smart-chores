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
        this.choresChange = this.choresChange.bind(this);
        this.reset = this.reset.bind(this);
        this.getMemberAndchores = this.getMembersAndchores.bind(this);
        this.switch = this.switch.bind(this);
        this.handleSetUp = this.handleSetUp.bind(this);
        this.sendEmails = this.sendEmails.bind(this);
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
        this.props.history.push("/arrangement");
    }

    choresChange() {
        this.props.history.push("/chores_changes");
    }

    /** Change the members. */
    memberChange() {
        this.props.history.push("/members_changes");
    }

    sendEmails() {
        axios.get("http://localhost:3000/send_emails",
            { withCredentials : true })
        .then(response => {
            alert("Emails have been sent successfully");
        })
        .catch(error => {
            console.log("Sending email error", error);
        })
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
                this.getMemberAndchores();
            }
        })
        .catch(error => {
            console.log("Switch error", error);
        });
    }

    /** Reset all members and chores. */
    reset() {
        axios.post("http://localhost:3000/reset",
                {withCredentials: true})
            .then(response => {
                this.setState({
                    members: []
                })
            })
    }

    handleSetUp() {
        this.props.history.push('/set_up');
    }
    
    componentDidMount() {
        if (!this.props.loggedInStatus || this.props.loggedInStatus !== "LOGGED_IN"){
            this.props.history.push('/');
        } else {
            this.getMemberAndchores();
        }
    }

    /** Set state for all the members and each member's chores */
    getMembersAndchores() {
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
            <React.Fragment> 
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
                {this.state.members.length != 0 ? 
                (<React.Fragment>
                    <button type="button" onClick={this.choresArrangementChanges}>Change the tasks arrangement</button><br/>
                    <button type="button" onClick={this.memberChange}>Edit members</button><br/>
                    <button type="button" onClick={this.choresChange}>Edit tasks</button><br/>
                    <button type="button" onClick={this.reset}>Reset</button><br />
                    <button type="button" value="chores switched clockwise" id="1" onClick={this.switch}>Switch clockwise</button>
                    <button type="button" value="chores switched counterclockwise" id="0" onClick={this.switch}>Switch counterclockwise</button><br/>
                    <button type="button" onClick={this.sendEmails}>Send tasks emails</button><br/>
                    <button type="button" onClick={this.handleLogout}>Log out</button>
                </React.Fragment>) 
                : (<React.Fragment>
                    <h1>You do not have any members added yet</h1>
                    <button type="button" onClick={this.handleSetUp}>Add members and tasks</button>
                    <button type="button" onClick={this.handleLogout}>Log out</button>
                   </React.Fragment>)
                }
            </React.Fragment>
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
                {this.props.chores && this.props.chores.length != 0 ?
                (this.props.chores.map(chore => (
                    <div key={this.props.member.id + chore.id}>
                    <h2 className="title">{chore.title}</h2>
                    <h3 className="descript">{chore.description}</h3>
                    </div>)
                )) :
                (<h5>No tasks</h5>)
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