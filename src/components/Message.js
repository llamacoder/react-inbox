import React, { Component } from 'react';

class Message extends Component {
  render() {
    let labels = {};
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
                  (this.props.message.starred === true ? '-o' : ' ')}></i>
            </div>
          </div>
        </div>
        <div className="col-xs-11">
          {labels}
          <a href="">
            { this.props.message.subject }
          </a>
        </div>
      </div>    )
  }

  toggleClass(prop) {
    this.props.toggleClass(this.props.message.id, prop);
  }
}

export default Message;
