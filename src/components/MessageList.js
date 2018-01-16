import React, { Component } from 'react';
import Message from './Message'

class MessageList extends Component {
  render() {
    let msgs = {};
    if (this.props.messages) {
      msgs = this.props.messages.map(msg => {
        return <Message key={msg.id} message={msg} toggleClass={this.props.toggleClass} />
      });
    }
    return (
      <div className="MessageList">
        {msgs}
      </div>
    );
  }

}

export default MessageList;
