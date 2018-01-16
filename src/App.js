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
    console.log(`unreadCount in App: ${this.state.unreadCount}`);
    return (
      <div className="App">
        <Toolbar selectTool={ this.state.selectTool }
          unreadCount={ this.state.unreadCount }
           clickSelectTool={this.clickSelectTool.bind(this)}
          />
        <MessageList messages={ this.state.messages } toggleClass={this.toggleClass.bind(this)}/>
      </div>
    );
  }

  //  This method gets called when the user clicks on the selectTool button.
  //  It should toggle between none (empty square) and all (checked square)
  clickSelectTool() {
    console.log("Inside");
    if (this.state.selectTool === SELECT_ALL) {
      this.setState({ selectTool: SELECT_NONE });
      this.setSelectionForAll(false);
    } else {
      this.setState({ selectTool: SELECT_ALL });
      this.setSelectionForAll(true);
    }
  }

  setSelectionForAll(sel) {
    console.log("setselection: " + sel);
    let newMessages = this.state.messages.map(msg => {
      msg.selected = sel;
      return msg;
    });
    this.setState({ messages: newMessages });
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
    let unread = this.getUnreadCount(messageArray);
    console.log("unread: " + unread + " unreadcount: " + this.state.unreadCount);
    this.setState({ messages: messageArray, unreadCount: unread });
    console.log(this.state);
  }

  getUnreadCount(messages) {
    let count =  messages.reduce(function(total, msg) {
      console.log("msg.read: " + msg.read);
      return msg["read"] === false ? ++total : total
    }, 0);
    console.log("Count " + count);
    return count;  
  }

  initializeData() {
    return [
      {
        "id": 1,
        "subject": "You can't input the protocol without calculating the mobile RSS protocol!",
        "read": false,
        "starred": true,
        "labels": ["dev", "personal"]
      },
      {
        "id": 2,
        "subject": "connecting the system won't do anything, we need to input the mobile AI panel!",
        "read": false,
        "starred": false,
        "selected": true,
        "labels": []
      },
      {
        "id": 3,
        "subject": "Use the 1080p HTTP feed, then you can parse the cross-platform hard drive!",
        "read": false,
        "starred": true,
        "labels": ["dev"]
      },
      {
        "id": 4,
        "subject": "We need to program the primary TCP hard drive!",
        "read": true,
        "starred": false,
        "selected": true,
        "labels": []
      },
      {
        "id": 5,
        "subject": "If we override the interface, we can get to the HTTP feed through the virtual EXE interface!",
        "read": false,
        "starred": false,
        "labels": ["personal"]
      },
      {
        "id": 6,
        "subject": "We need to back up the wireless GB driver!",
        "read": true,
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
        "read": true,
        "starred": true,
        "labels": []
      }
    ];
  }
}

export default App;
