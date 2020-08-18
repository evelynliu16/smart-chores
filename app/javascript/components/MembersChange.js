import React, { Component } from "react";
import axios from "axios";

class MembersChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            new_member: "",
            email: "",
            show_edits: [],
            new_name: "",
            new_email: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.cancelEdits = this.cancelEdits.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleDeleteSubmit(event) {
        var id = event.target.value;
        axios.post("http://localhost:3000/delete_member",
                    { member_id : id },
                    { withCredentials : true })
                .then(response => {
                    this.props.handleMemberChange(id, 'delete');
                })
                .catch(error => {
                    console.log("Delete member error", error);
                })
    }

    handleEdit(event) {
        if (this.state.new_name != "" || this.state.new_email != "") {
            alert("Please save or cancel your previous edits");
        } else {
            var id = event.target.id;
            var new_edits = this.state.show_edits.slice();
            new_edits[id] = true;
            this.setState({
                show_edits: new_edits,
                new_name: event.target.name,
                new_email: event.target.value ? event.target.value : ""
            })
        }
    }

    saveEdits(event) {
        const member_id = event.target.name;
        const new_name = this.state.new_name;
        const new_email = this.state.new_email;
        axios.post("http://localhost:3000/edit_members",
            { member: {
                member_id: member_id,
                new_name: new_name,
                new_email: new_email
                }
            },
                { withCredentials: true })
        .then(response => {
           this.props.handleMemberChange(response.data.member, "edit");
           this.setState({
               new_name: "",
               new_email: ""
           })
        })
        .catch(error => {
            console.log("Save member edits error", error);
        })
        event.preventDefault();
    }

    cancelEdits(event) {
        var index = event.target.value;
        var new_edits = this.state.show_edits.slice();
        new_edits[index] = false;
        this.setState({
            show_edits: new_edits,
            new_name: "",
            new_email: "",
        });
    }

    handleAddSubmit(event) {
        if (this.state.new_member === "") {
            alert("Please provide a name for your new member")
        } else {
            axios.post("http://localhost:3000/add_new_member",
                    { member: this.state.new_member,
                      email: this.state.email },
                    { withCredentials: true })
            .then(response => {
                this.props.handleMemberChange(response.data.new_member, 'add');
                this.setState({
                    new_member: "",
                    email: ""
                })
            })
            .catch(error => {
                console.log("Add member error", error);
            })
        }
        event.preventDefault();   
    }
    
    componentDidUpdate(prevProps, prevStates) {
        if (prevProps.members != this.props.members) {
            var new_edits = []
            for (let i = 0; i < this.props.members.length; i++) {
                new_edits.push(false);
            }
            this.setState({
                show_edits: new_edits
            })
        }
    }

    render() {
        var tracker = -1;

        return (
            <div style={{textAlign:"center"}}>
                <h3 className="page-title">Edit members</h3><br/>
                {this.props.members.length != 0 ? (
                    this.props.members.map(member => {
                        tracker++;
                        return (
                            this.state.show_edits.length != 0 && this.state.show_edits[tracker] ? 
                                (<React.Fragment key={member.id}>
                                    <form onSubmit={this.saveEdits} id={member.id} name={member.id} value={tracker}>
                                        <input className="name-input" value={this.state.new_name} name="new_name" onChange={this.handleChange} required></input>
                                        <input className="name-input" value={this.state.new_email} name="new_email" onChange={this.handleChange}></input><br/>
                                        <button type="submit">Save</button>
                                        <button value={tracker} onClick={this.cancelEdits} type="button">Cancel</button><br/>
                                    </form>
                                </React.Fragment>
                                ) : (
                                <React.Fragment key={member.id}>
                                    <h1 className="members-change-name">{member.name}</h1>
                                    <h6>{member.email}</h6>
                                    <button type="button" id={tracker} value={member.email} name={member.name} onClick={this.handleEdit}>Edit</button>
                                    <button type="button" value={member.id} onClick={this.handleDeleteSubmit}>Delete</button><br/>
                                </React.Fragment>)
                        )}
                    )) : (<React.Fragment><br /><h3>You do not have any members added yet</h3></React.Fragment>)
                }
                <br />
                <form onSubmit={this.handleAddSubmit}>
                <input type="text" className="name-input" name="new_member" value={this.state.new_member} placeholder="Name of the new member(required)" 
                    onChange={this.handleChange} required></input><br/>
                <input type="text" className="name-input" name="email" value={this.state.email} placeholder="Email of the new member"
                    onChange={this.handleChange}></input><br/>
                <button type="submit">Add</button><br/>
                </form>
                {this.props.no_save ?
                    (<React.Fragment></React.Fragment>)
                    : (<button type="button" onClick={this.props.history.goBack}>Go back to home</button>)
                }
            </div> 
        );
    }
}

export default MembersChange;