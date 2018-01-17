import React, { Component } from 'react';

class Toolbar extends Component {
  render() {
    //  The following array of states correspond to SELECT_NONE, SELECT_SOME, and SELECT_ALL
    const selectBtnClasses = ['fa-square-o','fa-minus-square-o','fa-check-square-o'];
    let selectBtnClass = selectBtnClasses[this.props.selectTool];
    return (
      <div className="row toolbar">
        <div className="col-md-12">
          <p className="pull-right">
            <span className="badge badge">{ this.props.unreadCount }</span>
            unread messages
          </p>

          <button className="btn btn-default">
            <i className={"fa " + selectBtnClass} onClick={this.props.clickSelectTool}></i>
          </button>

          <button className="btn btn-default" onClick={this.props.clickReadButton}>
            Mark As Read
          </button>

          <button className="btn btn-default" onClick={this.props.clickUnreadButton}>
            Mark As Unread
          </button>

          <select className="form-control label-select">
            <option>Apply label</option>
            <option value="dev">dev</option>
            <option value="personal">personal</option>
            <option value="gschool">gschool</option>
          </select>

          <select className="form-control label-select">
            <option>Remove label</option>
            <option value="dev">dev</option>
            <option value="personal">personal</option>
            <option value="gschool">gschool</option>
          </select>

          <button className="btn btn-default"
                onClick={this.props.clickDeleteButton}>
            <i className="fa fa-trash-o"></i>
          </button>
        </div>
      </div>
    );
  }

}

export default Toolbar;
