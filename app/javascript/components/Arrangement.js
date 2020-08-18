import React, { Component } from "react";
import axios from "axios";

class Arrangement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            members: [],
            chores: []
        }

        this.submitArrangementChange = this.submitArrangementChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getMembers = this.getMembers.bind(this)
        this.allChores = this.allChores.bind(this)
    }

    submitArrangementChange(event) {
        var data = {};
        for (let i = 0; i < this.state.members.length; i++) {
            var id = this.state.members[i].id
            data[id] = this.state[id];
        }
        axios.post("http://localhost:3000/chores_arrangement_changes", 
                    { data: data },
                    { withCredentials : true }
        )
        .then(response => {
           this.props.history.push("/home");
        })
        .catch(error => {
            console.log("Change arrangement error", error);
        }); 
        event.preventDefault();
    }

    handleChange(event) {
        let arrangements = this.state[event.target.id];
        arrangements[event.target.value] = event.target.checked;
        this.setState({
            [event.target.id]: arrangements
        })
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

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.members != this.state.members || prevStates.chores != this.state.chores) {
            for (let j = 0; j < this.state.members.length; j++) {
                var object = {};
                for (let i = 0; i < this.state.chores.length; i++) {
                    object[this.state.chores[i].id] = false;
                }
                this.setState({
                    [this.state.members[j].id]: object
                })
            }
        }
    }

    componentDidMount() {
        this.getMembers();
        this.allChores();
    }

    render() {
        var should_return = false;
        if (Object.entries(this.state).length > 2 
            && Object.entries(this.state[Object.keys(this.state)[0]]).length != 0
            && this.state.members.length != 0 && this.state.chores.length != 0) {
                should_return = true;
        }
        
        return (
            <div>
                <h3 className="page-title">Change tasks arrangement</h3><br/>
                {should_return  ? (
                    this.state.members.map(member => (
                        <div key={member.id}>
                            <h3>{member.name}</h3>
                            <form id={member.id}>
                                {this.state.chores.map(chore => (
                                    <React.Fragment key={chore.id}>
                                        <input type="checkbox" className="regular-checkbox" id={member.id} value={chore.id} 
                                        checked={this.state[member.id][chore.id]} onChange={this.handleChange} />
                                        <label className="checkbox-label" htmlFor={chore.id}>{chore.title}</label>
                                    </React.Fragment>
                                ))}
                            </form>
                        </div>
                    ))
                    ) : (<div></div>)}
                <button type="submit" onClick={this.submitArrangementChange}>Save tasks arrangement changes</button>
                <button type="button" onClick={this.props.history.goBack}>Cancel</button>
            </div>
        )
    }
}

export default Arrangement;
