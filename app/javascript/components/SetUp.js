import React, { Component } from "react";
import MembersChange from './MembersChange'
import ChoresChange from './ChoresChange'

class SetUp extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.history.push('/arrangement');
    }

    render() {

        return (
            <div>
                <MembersChange handleMemberChange={this.props.handleMemberChange} members={this.props.members} no_save={true} /><br/><br/>
                <ChoresChange handleChoresChange={this.props.handleChoresChange} chores={this.props.chores} no_save={true} />
                <button type="button" onClick={this.handleClick}>Go to chores arrangement</button>
                <button type="button" onClick={this.props.history.goBack}>Go back</button>
            </div>
        )
    }
}

export default SetUp;