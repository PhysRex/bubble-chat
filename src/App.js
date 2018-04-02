import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as api from './api';

import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeStamp: 'No timestamp yet...',
      loggedOn: true,
      userName: 'Mauricio',
      users: [],
    }

    // api.subscribeToTimer( (err, timestamp) => this.setState({ timestamp }) );
  }

  render() {
    return (
      <div className="container-fluid">
        
        <div className="row">
          <div className="col text-center">
            <p className="">
              This is the current time: {this.state.timestamp}
            </p>
          </div>
        </div>

        <div className="row">
          <header className="col text-center">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Hacker Chat</h1>
          </header>        
        </div>

        <Login
          loggedOn={this.state.loggedOn}
        />

        <Chat
          loggedOn={this.state.loggedOn}
          userName={this.state.userName}
          users={this.state.users}
        />

      </div>
    );
  }
}


class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"login-row row " + (this.props.loggedOn ? 'hide' : '')}>
        <div className="col">

          <form className="row">
            <div className="col-md-4 offset-md-4">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
              </div>
              <div className="col text-right">
                <button type="button" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  }
}


class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userMessage: '',
    }

    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  inputChange(event) {
    this.setState({userMessage: event.target.value});
  }

  sendMessage(event) {
    event.preventDefault();
    console.log('msg sent: ', this.state.userMessage);

    // send message to back-end
    api.emitMessage(this.props.userName, this.state.userMessage, new Date());

    // clear message from input element
    this.setState({userMessage: ''});    
  }

  render() {
    return (
      <div className={"chat-row row " + (this.props.loggedOn ? 'show' : '')}>
        <div className="col">
          <div className="row">

            <div className="col-md-2"></div>

            <div className="col-md-6">

              <div className="row">
                <div className="col" id="usersLogged">
                  users logged on: {this.props.users.length}
                </div>
              </div>

              {/* DISPLAY MESSAGES FROM BACK-END */}
              <div className="row">
                <div className="col chat-display-container-col">
                  <ChatMessages/>
                </div>
              </div>

              {/* SUBMIT MESSAGES TO BACK-END */}
              <div className="row">
                <div className="col">
                  <form className="input-group mb-3" onSubmit={this.sendMessage}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter message here"
                      aria-label="Enter message here" 
                      aria-describedby="basic-addon2"
                      value={this.state.userMessage}
                      onChange={this.inputChange}
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">Send!</button>
                    </div>
                  </form>
                </div>
              </div>

            </div>

            <div className="col-md-3 users-display" id="usersDisplay">
              <p>users list here...</p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}


class ChatMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    }

    api.getChatHistory((err, messages) => {
      console.log('RECEIVED: chat history: ', messages);
      this.setState({ messages });
    });

    api.subscribeToChat((err, message) => {
      console.log('RECEIVED: chat message: ', message);
      this.setState({ messages: [ ...this.state.messages, message] });
    });

    this.displayMsgs = this.displayMsgs.bind(this);
  }
  
  displayMsgs(message) {
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const displayAllMsgs = this.state.messages.map((message, index) => {
      console.log('msg obj: ', message);

      const options = {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
      const date = new Date(message.date).toLocaleDateString('en-US', options);
    return (
      <div className="row" key={"msg-" + index}>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{message.userName}</h5>
              <small className="card-subtitle mb-2 text-muted">{date}</small>
              <p className="card-text">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
    });
    console.log('displayAllMsgs: ', displayAllMsgs);
    return (
      <div className="row">
        <div className="col chat-display" id="chatDisplay">
          {displayAllMsgs}          
          <div ref={(el) => { this.messagesEnd = el }}></div>
        </div>
      </div>
    );
  }
}



export default App;
