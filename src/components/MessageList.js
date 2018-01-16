import React, { Component } from 'react';
import Message from './Message'

class MessageList extends Component {
  render() {
    let msgs = {};
    if (this.props.messages) {
      msgs = this.props.messages.map(msg => {
        return <Message key={msg.id} message={msg} toggleClass={this.toggleClass.bind(this)} />
      });
    }
    return (
      <div className="MessageList">
        {msgs}
      </div>
    );
  }

  toggleClass(id, prop) {
    this.props.toggleClass(id, prop);
  }
}

export default MessageList;
