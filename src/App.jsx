import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';
import uuidv1 from 'uuid/v1';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:3001/");
    this.state = {
      currentUser: {name: "Bob"},
      messages:  [
        {
          username: "Bob",
          content: "Has anyone seen my marbles?",
          id: "msg1"
        }
      ]
    }
    this.updateUser = this.updateUser.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    console.log("componentDidMount <App />");
    // setTimeout(() => {
    //   console.log("Simulating incoming message");
    //   //Add a new message to the list of messages in the data store
    //   const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
    //   const messages = this.state.messages.concat(newMessage)
    //   this.setState({messages: messages});
    // }, 3000)
    const ws = this.socket;
    ws.onopen = function (event) {
      ws.send("Here's some text that the server is urgently awaiting!"); 
      console.log("Connected to server!")
    }
    const messageArray = [];
    const oldMessages = this.state.messages;
      ws.onmessage = function (event) {
        console.log("event data:", event.data)
        let newMessage = JSON.parse(event.data);
        console.log("new message:", newMessage)
        messageArray.push(newMessage)
        console.log(messageArray);
        console.log("message array", messageArray);
        this.setState({messages: oldMessages.concat(messageArray)})
      }.bind(this)
  };
    

  updateUser(event){
    this.setState({currentUser: {name: event.target.value}})
    console.log("current user updated to:", event.target.value)
  }

  handleKeyPress(event){
    if (event.keyCode === 13) {
      console.log('Enter was pressed');
      // const newMessage = {
      //   username: this.state.currentUser.name,
      //   content: event.target.value,
      //   id: new Date().toString()
      // }
      // const newMessages = this.state.messages.concat(newMessage)
      // this.setState({messages: newMessages});
      // event.target.value = "";
      const ws = this.socket;
      var msg = {
        username: this.state.currentUser.name,
        content: event.target.value,
        id: uuidv1()
      }
      this.socket.send(JSON.stringify(msg))
      event.target.value = "";
    }
  }

  render() {
    return (
      <div> 
        <MessageList messages={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser.name} updateUser={this.updateUser} handleKeyPress={this.handleKeyPress} />
      </div>
    );
  }
}
export default App;
