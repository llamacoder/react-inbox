import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { Switch, Route } from 'react-router-dom';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';

const SELECT_NONE = 0;
const SELECT_SOME = 1;
const SELECT_ALL = 2;
const UNREAD_COUNT = 1;

class App extends Component {
  constructor () {
    super();
    this.state = { messages: [], unreadCount:UNREAD_COUNT, selectTool:SELECT_NONE  };
  }
  render() {
    return (
      <div className="App">
        <div className="header">
          <h4>React Inbox</h4>
        </div>
        <Toolbar selectTool={ this.state.selectTool }
          clickAddMessageButton={ this.clickAddMessageButton.bind(this) }
          unreadCount={ this.state.unreadCount }
           clickSelectTool={this.clickSelectTool.bind(this)}
           clickReadButton={ this.clickReadButton.bind(this)}
           clickUnreadButton={ this.clickUnreadButton.bind(this) }
           clickDeleteButton={ this.clickDeleteButton.bind(this) }
           handleAddLabelChange={ this.handleAddLabelChange.bind(this) }
           handleRemoveLabelChange={ this.handleRemoveLabelChange.bind(this) }
          />
        <Switch>
          <Route exact path='/' render={routeProps => <MessageList {...routeProps}
            addMsg={false} messages={ this.state.messages }
              handleAddMessage={this.handleAddMessage.bind(this)}
              toggleClass={this.toggleClass.bind(this)} />} />
          <Route exact path='/compose' render={routeProps => <MessageList {...routeProps}
            addMsg={true} messages={ this.state.messages }
              handleAddMessage={this.handleAddMessage.bind(this)}
              toggleClass={this.toggleClass.bind(this)} />} />
        </Switch>
      </div>
    );
  }

  //  This method gets called when the user clicks on the Mark as Read button.
  clickReadButton() {
    this.setPropForSelected("read", true);
  }

  //  This method gets called when the user clicks on the Mark as Read button.
  clickUnreadButton() {
    this.setPropForSelected("read", false);
  }

  //  display the form for adding a message
  clickAddMessageButton() {
    if (this.props.location.pathname === '/compose') {
      console.log("pushing main");
      this.props.history.push('/');
    } else {
      console.log(this.props.location.pathname);
      console.log("pushing compose");
      this.props.history.push('/compose');
    }
  }

  //  This method gets called when the user clicks on the selectTool button.
  //  It should toggle between none (empty square) and all (checked square)
  clickSelectTool(event) {
    event.preventDefault();
    if (this.state.selectTool === SELECT_ALL) {
      this.setState({ selectTool: SELECT_NONE });
      this.setSelectionForAll(false);
    } else {
      this.setState({ selectTool: SELECT_ALL });
      this.setSelectionForAll(true);
    }
  }

  //  This message handes the submission of a new message.
  async handleAddMessage(subject, body) {
      const response = await fetch('http://localhost:8082/api/messages', {
        method: 'POST',
        body: JSON.stringify({'subject':subject, 'body':body}),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      const message = await response.json()
      this.setState({messages: [...this.state.messages, message]})
      this.clickAddMessageButton();  // to hide the add message form
    }

  //  returns an array of the ids of the currently selected messages
  getSelectedMessageIDs() {
    return this.state.messages.reduce((results, msg) => {
        if (msg.selected === true) {
          results.push(msg.id)
        }
        return results;
      }, []);
  }

  //  returns an array of the ids of all the messages
  getAllMessageIDs() {
    return this.state.messages.reduce((results, msg) => {
          results.push(msg.id)
          return results;
      }, []);
  }

  //  handles the event when the user selects a label to add to all the
  //  currently selected messages
  handleAddLabelChange(event) {
    let addLabel = event.target.value;
    let newMessages = this.state.messages.map(msg => {
        if (msg.selected === true && (msg.labels.find(label => label === addLabel) === undefined)) {
          msg.labels.push(addLabel)
        }
        return msg;
      });
      this.setState({ messages: newMessages });
      let ids = this.getSelectedMessageIDs();
      this.setPropsRemotely(ids, "addLabel", 'label', addLabel)
  }

  //  handles the event when the user selects a label to remove from all the
  //  currently selected messages
  handleRemoveLabelChange(event) {
    let remLabel = event.target.value;
    let newMessages = this.state.messages.map(msg => {
      if (msg.selected === true) {
        msg.labels = msg.labels.filter(label => label === remLabel ? false : true)
      }
        return msg;
    });
    this.setState({ messages: newMessages });
    let ids = this.getSelectedMessageIDs();
    this.setPropsRemotely(ids, "removeLabel", 'label', remLabel)
  }

  //  sets the input property to the input value for every message in the id array,
  //  then it resets the unread message counter and sets state
  setPropsLocally(ids, prop, val) {
    //  update locally first
    let newMessages = this.state.messages;
    for (let i = 0; i < ids.length; i++) {
      let msg = newMessages.find(message => message.id === ids[i]);
      msg[prop] = val;
    }
    this.setState({messages: newMessages})
    if (prop === 'read') {
      let unread = this.getPropCount(newMessages, "read", false);
      this.setState({ messages: newMessages, unreadCount:unread });
    }
  }

  //  sets the input property to the input value for every message in the id array,
  //  then it resets the unread message counter and sets state
  async setPropsRemotely(ids, cmd, prop, val) {
    //  now persist changes to server
    let info = {'messageIds':ids, 'command':cmd };
    if (prop != null && val != null) {
      info[prop] = val;
    }

    console.log(info);
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    console.log(response);
  }

  setPropForSelected(prop, val) {
    let selMessages = this.getSelectedMessageIDs();
    this.setPropsLocally(selMessages, prop, val);
    this.setPropsRemotely(selMessages, prop, prop, val);
  }

  clickDeleteButton() {
    let selMessages = this.getSelectedMessageIDs();
    let newMessages = this.state.messages.filter(msg => {
      return !msg.selected === true;
    });
    let unread = this.getPropCount(newMessages, "read", false);
    this.setState({ messages: newMessages, unreadCount:unread });
    this.setPropsRemotely(selMessages, 'delete', null, null);  // persist the values
  }

  setSelectionForAll(sel) {
    let allMessages = this.getAllMessageIDs();
    this.setPropsLocally(allMessages, "selected", sel);
  }

  toggleClass(id, prop) {
    let messages = this.state.messages;
    let index = messages.findIndex(x => x.id === id);

    //  find the message with the input ID, then toggle the input prop
    messages[index][prop] = !messages[index][prop];
    this.setState({ messages: messages });
    this.updateSelectTool(messages);
    if (prop === 'starred') {
      this.setPropsRemotely([id], 'star', 'star', messages[index][prop]);
    }
  }

  updateSelectTool(messages) {
    let sel = this.getPropCount(messages, "selected", true);
    let selCount = -1;
    if (sel === 0) {
      selCount = SELECT_NONE;
    } else if (sel === messages.length) {
      selCount = SELECT_ALL;
    } else {
      selCount = SELECT_SOME;
    }
    this.setState({ selectTool: selCount });
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:8082/api/messages')
    const json = await response.json()
    const newMessages = json._embedded.messages;
    this.setState({messages: newMessages})
    let unread = this.getPropCount(newMessages, "read", false);
    this.setState({unreadCount: unread})
    this.updateSelectTool(newMessages);
  }


  //  returns a count of how many messages have the input prop with a value of val
  getPropCount(messages, prop, val) {
    let count =  messages.reduce(function(total, msg) {
      return !!msg[prop] === val ? ++total : total
    }, 0);
    return count;
  }

}

export default withRouter(App);
