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
    this.state = { messages: [], unreadCount:UNREAD_COUNT, selectTool:SELECT_NONE, addMsg:false  };
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
        <MessageList addMsg={this.state.addMsg} messages={ this.state.messages }
            handleAddMessage={this.handleAddMessage.bind(this)}
            toggleClass={this.toggleClass.bind(this)}/>
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

  clickAddMessageButton() {
    this.setState({ addMsg:!this.state.addMsg })
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
      this.clickAddMessageButton();
    }

  handleAddLabelChange(event) {
    let addLabel = event.target.value;
    let newMessages = this.state.messages.map(msg => {
        if (msg.selected === true && (msg.labels.find(label => label === addLabel) === undefined)) {
          msg.labels.push(addLabel)
        }
        return msg;
      });
      let unread = this.getPropCount(newMessages, "read", false);
      this.setState({ messages: newMessages, unreadCount:unread });
  }

  handleRemoveLabelChange(event) {
    let remLabel = event.target.value;
    let newMessages = this.state.messages.map(msg => {
        msg.labels = msg.labels.filter(label => label === remLabel ? false : true)
        return msg;
      });
      let unread = this.getPropCount(newMessages, "read", false);
      this.setState({ messages: newMessages, unreadCount:unread });
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

  clickDeleteButton() {
    let newMessages = this.state.messages.filter(msg => {
      return !msg.selected === true;
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
    this.updateSelectTool(messages);
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

  async createMessage(item) {
    const response = await fetch('http://localhost:8082/api/people', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const person = await response.json()
    this.setState({people: [...this.state.people, person]})
  }


  //  returns a count of how many messages have the input prop with a value of val
  getPropCount(messages, prop, val) {
    let count =  messages.reduce(function(total, msg) {
      return !!msg[prop] === val ? ++total : total
    }, 0);
    return count;
  }

}

export default App;
