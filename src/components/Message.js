import React, { Component } from 'react';

class Message extends Component {
  render() {
    let msgBody = ""
    let hidden = true;
    if (this.props.expand && this.props.message.body) {
      msgBody = this.props.message.body;
      hidden = false;
    }

    let labels = '';
    if (this.props.message.labels) {
      labels = this.props.message.labels.map((label, idx) => {
        return <span key={idx} className="label label-warning">{label}</span>
      });
    }
    return (
      <div className={"row message " +
        (this.props.message.read === true ? 'read ' : 'unread ') +
        (this.props.message.selected === true ? 'selected ' : ' ')}>
        <div className="col-xs-1">
          <div className="row">
            <div className="col-xs-2">
              <input type="checkbox" checked={!!this.props.message.selected}
                      onChange={this.toggleClass.bind(this, 'selected')}/>
            </div>
            <div className="col-xs-2">
              <i className={"star fa fa-star" +
                  (this.props.message.starred === true ? ' ' : '-o')}
                  onClick={this.toggleClass.bind(this, 'starred')}></i>
            </div>
          </div>
        </div>
        <div className="col-xs-11">
          {labels}
          <p style={{display: 'inline-block'}}
            onClick={this.handleSubjectClick.bind(this)}>
            { this.props.message.subject } </p>
          <p className="message-body" hidden={hidden}>
            {msgBody}
          </p>
        </div>
      </div>    )
  }

  handleSubjectClick() {
    //  mark the message as read (this should probably be moved to app.js as
    //  part of the handleSubjectClick, but it already works and I'm tired)
    this.props.setPropValue(this.props.message.id, "read", true);
    //  Now call the app.js method that will update the route, fetch the subject,
    //  and ask for the subject to be displayed
    this.props.onSubjectClick(this.props.message.id);

  }

  toggleClass(prop) {
    this.props.setPropValue(this.props.message.id, prop, !this.props.message[prop]);
  }
}

export default Message;
