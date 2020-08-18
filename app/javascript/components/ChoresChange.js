import React, { Component } from "react";
import axios from "axios"; 

class ChoresChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            new_chore_title: "",
            new_chore_description: "",
            show_edits: [],
            chore_title_edit: "",
            chore_descript_edit: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.cancelEdits = this.cancelEdits.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleAdd(event) {
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
        event.preventDefault();
    }

    handleEdit(event) {
        if (this.state.chore_title_edit != "" || this.state.chore_descript_edit != "") {
            alert("Please save or cancel your previous edits");
        } else {
            var id = event.target.id;
            var new_edits = this.state.show_edits.slice();
            new_edits[id] = true;
            this.setState({
                show_edits: new_edits,
                chore_title_edit: event.target.name,
                chore_descript_edit: event.target.value ? event.target.value : ""
            })
        }
    }

    saveEdits(event) {
        const chore_id = event.target.name;
        const chore_title_edit = this.state.chore_title_edit;
        const chore_descript_edit = this.state.chore_descript_edit;
        axios.post("http://localhost:3000/edit_chores",
            { chore: {
                chore_id: chore_id,
                new_title: chore_title_edit,
                new_descript: chore_descript_edit
                }
            },
            { withCredentials: true })
        .then(response => {
            this.props.handleChoresChange(response.data.chore, "edit");
            this.setState({
                chore_title_edit: "",
                chore_descript_edit: ""
            })
        })
        .catch(error => {
            console.log("Save chore edits error", error);
        })
        event.preventDefault();
    }

    cancelEdits(event) {
        var index = event.target.value;
        var new_edits = this.state.show_edits.slice();
        new_edits[index] = false;
        this.setState({
            show_edits: new_edits,
            chore_title_edit: "",
            chore_descript_edit: "",
        });
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

    componentDidUpdate(prevProps, prevStates) {
        if (prevProps.chores != this.props.chores) {
            var new_edits = []
            for (let i = 0; i < this.props.chores.length; i++) {
                new_edits.push(false);
            }
            this.setState({
                show_edits: new_edits
            })
        }
    }

    render() {
        var tracker = -1;
        return(
            <div style={{ textAlign: "center" }}>
                <h3 className="page-title">Edit tasks</h3><br/>
                {this.props.chores.length != 0 ? (
                    this.props.chores.map(chore => {
                        tracker++;
                        return (
                            this.state.show_edits.length != 0 && this.state.show_edits[tracker] ?
                                (<React.Fragment key={chore.id}>
                                    <form onSubmit={this.saveEdits} id={chore.id} name={chore.id} value={tracker}>
                                        <input className="title-input" value={this.state.chore_title_edit} name="chore_title_edit" onChange={this.handleChange} required></input><br/>
                                        <textarea className="descrip-input" value={this.state.chore_descript_edit} name="chore_descript_edit" onChange={this.handleChange}></textarea><br/>
                                        <button type="submit">Save</button>
                                        <button value={tracker} onClick={this.cancelEdits} type="button">Cancel</button><br />
                                    </form>
                                </React.Fragment>
                                ) : (
                                <div key={chore.id}> 
                                <h2 className="title">{chore.title}</h2><br/>
                                <h3 className="descript">{chore.description}</h3>
                                <button type="button" id={tracker} value={chore.description} name={chore.title} onClick={this.handleEdit}>Edit</button>
                                <button value={chore.id} type="button" onClick={this.handleDelete}>Delete</button>
                                </div>)
                        )}
                    )) : (<React.Fragment><br /><h3>You do not have any tasks added yet</h3></React.Fragment>)
                }
                <br/>
                <form onSubmit={this.handleAdd}>
                <input type="text" className="title-input" name="new_chore_title" value={this.state.new_chore_title} 
                    placeholder="Please type the title of the new task" onChange={this.handleChange} required/><br/>
                <textarea className="descrip-input" name="new_chore_description" value={this.state.new_chore_description} 
                    placeholder="Please type the description of the new task" onChange={this.handleChange} /><br/>
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

export default ChoresChange;