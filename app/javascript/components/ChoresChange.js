import React, { Component } from "react";
import axios from "axios"; 

class ChoresChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            new_chore_title: "",
            new_chore_description: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleAdd() {
        const title = this.state.new_chore_title;
        const description = this.state.new_chore_description;
        if (this.state.new_chore_title === "") {
            alert("Please provide a title for your new chores")
        } else {
            axios.post("http://localhost:3000/add_chores",
                        { chores : {
                            title: title,
                            description: description
                        }},
                        { withCredentials: true })
            .then(response => {
                this.props.handleChoresChange(response.data.new_chores, "add");
                this.setState({
                    new_chore_title: "",
                    new_chore_description: ""
                })
            })
            .catch(error => {
                console.log("Add chores error", error);
            })
        }
    }

    handleDelete(event) {
        var id = event.target.value;
        axios.post("http://localhost:3000/delete_chores",
                    {chores_id: id},
                    {withCredentials: true})
        .then(response => {
            this.props.handleChoresChange(id, "delete");
        })
        .catch(error => {
            console.log("Delete chores error", error);
        })
    }

    render() {

        return(
            <div style={{ textAlign: "center" }}>
                <h3 className="page-title">Add or delete chores</h3><br/>
                {this.props.chores.length != 0 ? (
                    this.props.chores.map(chore => 
                        <div key={chore.id}> 
                        <h2 className="title">{chore.title}</h2><br/>
                        <h3 className="descript">{chore.description}</h3>
                        <button value={chore.id} type="button" onClick={this.handleDelete}>Delete</button>
                        </div>))
                    : (<h1>You do not have any chores added yet</h1>)
                }
                <br/>
                <input type="text" className="title-input" name="new_chore_title" value={this.state.new_chore_title} 
                    placeholder="Please type the title of the new chores" onChange={this.handleChange} /><br/>
                <input type="text" className="descrip-input" name="new_chore_description" value={this.state.new_chore_description} 
                    placeholder="Please type the description of the new chores" onChange={this.handleChange} /><br/>
                <button type="button" onClick={this.handleAdd}>Add</button><br/>
                {this.props.no_save ?
                    (<React.Fragment></React.Fragment>)
                    : (<button type="button" onClick={this.props.history.goBack}>Save Changes</button>)
                }
            </div>
        );
    }
}

export default ChoresChange;