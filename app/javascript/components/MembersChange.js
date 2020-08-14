import React, { Component } from "react";
import axios from "axios";

class MembersChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            new_member: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            new_member: event.target.value
        })
    }

    handleDeleteSubmit(event) {
        var id = event.target.value;
        axios.post("http://localhost:3000/delete_member",
                    { member_id : id },
                    { withCredentials : true }
                )
                .then(response => {
                    this.props.handleMemberChange(id, 'delete');
                })
                .catch(error => {
                    console.log("Delete member error", error);
                })
    }

    handleAddSubmit() {
        axios.post("http://localhost:3000/add_new_member",
                    { member: this.state.new_member },
                    { withCredentials: true }
            )
            .then(response => {
                this.props.handleMemberChange(response.data.new_member, 'add');
                this.setState({
                    new_member: ""
                })
            })
            .catch(error => {
                console.log("Add member error", error);
            })
            
    }

    render() {
        return (
            <div className="background" >
                <h3 className="page-title">Add or delete members</h3><br/>
                {this.props.members.map(member => (
                    <React.Fragment key={member.id}>
                        <h1 className="members-change-name">{member.name}</h1>
                        <button type="button" value={member.id} onClick={this.handleDeleteSubmit}>Delete</button> <br/>
                    </React.Fragment>
                ))}
                <br />
                <input type="text" value={this.state.new_member} placeholder="Please type the name of the new member" 
                    onChange={this.handleChange}></input>
                <button type="button" onClick={this.handleAddSubmit}>Add</button>
            </div> 
        );
    }
}

export default MembersChange;