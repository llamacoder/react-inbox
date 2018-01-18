import React, { Component } from 'react';

class AddMessage extends Component {
  render() {
    return (
      <div>
      <h3>Compose Message</h3>
      <form className="form-horizontal well"
         onSubmit={this.handleSubmit.bind(this)} >
        <div className="form-group">
          <div className="col-sm-8 col-sm-offset-2">
            <h4>Compose Message</h4>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="subject" className="col-sm-2 control-label">Subject</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" id="subject"
              placeholder="Enter a subject" ref='subject' name="subject" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="body" className="col-sm-2 control-label">Body</label>
          <div className="col-sm-8">
            <textarea name="body" id="body" ref='body' className="form-control"></textarea>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-8 col-sm-offset-2">
            <button className="btn btn-default"
               onClick={this.handleSubmit.bind(this)} >Send
            </button>
          </div>
        </div>
      </form>
    </div>
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleAddMessage(this.refs.subject.value, this.refs.body.value);
  }

}

export default AddMessage;
