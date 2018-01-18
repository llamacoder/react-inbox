import React, { Component } from 'react';
import Message from './Message'
import AddMessage from './AddMessage'

class MessageList extends Component {
  render() {
    let addMsg = '';
    if (this.props.addMsg) {
      addMsg=<AddMessage handleAddMessage={this.props.handleAddMessage} />
    }
    let msgs = {};
    if (this.props.messages) {
      msgs = this.props.messages.map(msg => {
        return <Message key={msg.id} message={msg} toggleClass={this.props.toggleClass} />
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
