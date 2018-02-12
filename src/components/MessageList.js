import React, { Component } from 'react';
import Message from './Message'
import AddMessage from './AddMessage'

class MessageList extends Component {
  render() {
    //  Should one of the messages expand its subject?
    let expandID = this.props.match.params.id;

    let addMsg = '';
    if (this.props.addMsg && expandID === undefined) {
      addMsg=<AddMessage handleAddMessage={this.props.handleAddMessage} />
    }
    let msgs = {};
    if (this.props.messages) {
      msgs = this.props.messages.map(msg => {
        if (expandID == msg.id) {
          return <Message key={msg.id} expand={'true'} message={msg} setPropValue={this.props.setPropValue}
            onSubjectClick={this.props.onSubjectClick} />
        } else {
          return <Message key={msg.id} message={msg} setPropValue={this.props.setPropValue}
            onSubjectClick={this.props.onSubjectClick} />
        }
      });
    }
    return (
      <div className="MessageList">
        {addMsg}
        {msgs}
      </div>
    );
  }

}

export default MessageList;
