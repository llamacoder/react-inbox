import React, { Component } from 'react';
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
        <Toolbar selectTool={ this.state.selectTool }
          unreadCount={ this.state.unreadCount }
           clickSelectTool={this.clickSelectTool.bind(this)}
           clickReadButton={ this.clickReadButton.bind(this)}
           clickUnreadButton={ this.clickUnreadButton.bind(this) }
          />
        <MessageList messages={ this.state.messages } toggleClass={this.toggleClass.bind(this)}/>
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

  //  This method gets called when the user clicks on the selectTool button.
  //  It should toggle between none (empty square) and all (checked square)
  clickSelectTool(e) {
    e.preventDefault();
    if (this.state.selectTool === SELECT_ALL) {
      this.setState({ selectTool: SELECT_NONE });
      this.setSelectionForAll(false);
    } else {
      this.setState({ selectTool: SELECT_ALL });
      this.setSelectionForAll(true);
    }
  }

  //  sets the input property to the input value for every message that is selected,
  //  then it resets the unread message counter and sets state
  setPropForSelected(prop, val) {
    let newMessages = this.state.messages.map(msg => {
      if (msg.selected === true) {
        msg[prop] = val
      }
      return msg;
    });
    let unread = this.getPropCount(newMessages, "read", false);
    this.setState({ messages: newMessages, unreadCount:unread });
  }

  setSelectionForAll(sel) {
    let newMessages = this.state.messages.map(msg => {
      msg.selected = sel;
      return msg;
    });
    let unread = this.getPropCount(newMessages, "read", false);
    this.setState({ messages: newMessages, unreadCount:unread });
  }

  toggleClass(id, prop) {
    let messages = this.state.messages;
    let index = messages.findIndex(x => x.id === id);

    //  find the message with the input ID, then toggle the input prop
    messages[index][prop] = !messages[index][prop];
    this.setState({ messages: messages });
  }

  componentWillMount() {
    let messageArray = this.initializeData();
    let unread = this.getPropCount(messageArray, "read", false);
    let sel = this.getPropCount(messageArray, "selected", true);
    let selCount = -1;
    if (sel === 0) {
      selCount = SELECT_NONE;
    } else if (sel === messageArray.length) {
      selCount = SELECT_ALL;
    } else {
      selCount = SELECT_SOME;
    }
    this.setState({ messages: messageArray, unreadCount: unread,
        selectTool: selCount });
  }

  //  returns a count of how many messages have the input prop with a value of val
  getPropCount(messages, prop, val) {
    let count =  messages.reduce(function(total, msg) {
      return !!msg[prop] === val ? ++total : total
    }, 0);
    return count;
  }

  initializeData() {
    return [
      {
        "id": 1,
        "subject": "You can't input the protocol without calculating the mobile RSS protocol!",
        "read": false,
        "starred": true,
        "selected": true,
        "labels": ["dev", "personal"]
      },
      {
        "id": 2,
        "subject": "connecting the system won't do anything, we need to input the mobile AI panel!",
        "read": false,
        "selected": true,
        "starred": false,
        "labels": []
      },
      {
        "id": 3,
        "subject": "Use the 1080p HTTP feed, then you can parse the cross-platform hard drive!",
        "read": false,
        "selected": true,
        "starred": true,
        "labels": ["dev"]
      },
      {
        "id": 4,
        "subject": "We need to program the primary TCP hard drive!",
        "selected": true,
        "read": true,
        "starred": false,
        "labels": []
      },
      {
        "id": 5,
        "subject": "If we override the interface, we can get to the HTTP feed through the virtual EXE interface!",
        "selected": true,
        "read": false,
        "starred": false,
        "labels": ["personal"]
      },
      {
        "id": 6,
        "subject": "We need to back up the wireless GB driver!",
        "selected": true,
        "starred": true,
        "labels": []
      },
      {
        "id": 7,
        "subject": "We need to index the mobile PCI bus!",
        "read": true,
        "starred": false,
        "labels": ["dev", "personal"]
      },
      {
        "id": 8,
        "subject": "If we connect the sensor, we can get to the HDD port through the redundant IB firewall!",
        "read": false,
        "selected": false,
        "starred": true,
        "labels": []
      }
    ];
  }
}

export default App;
