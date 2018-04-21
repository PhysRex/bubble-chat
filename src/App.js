import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as api from './api';

// import logo from './logo.svg';
import logo from './Imletired-clr.png';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeStamp: 'No timestamp yet...',
      loggedOn: false,
      userName: 'dev',
      users: [],
    }

    // api.subscribeToTimer( (err, timestamp) => this.setState({ timestamp }) );

    this.changeLoggedStatus = this.changeLoggedStatus.bind(this);
    this.setUserName = this.setUserName.bind(this);
  }

  setUserName(userName) {
    this.setState({ userName });
  }

  changeLoggedStatus(loggedOn) {
    console.log('logged state: ', loggedOn);
    this.setState({ loggedOn });
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
          setUserName={userName => this.setUserName(userName)}
          changeLoggedStatus={status => this.changeLoggedStatus(status)}
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
    this.state = {
      userName: '',
      error: false,
      quoteAuthor: 'Dr. Seuss',
      quoteText: 'Why fit in when you were born to stand out?',
    }

    this.inputChange = this.inputChange.bind(this);
    this.joinChat = this.joinChat.bind(this);
    this.validation = this.validation.bind(this);
  }

  inputChange(event) {
    const userNameLength = event.target.value.length;
    this.setState({userName: event.target.value});
    if (userNameLength > 0) {
      // console.log('this.state.userName', this.state.userName);
      // console.log('this.state.userName.length', this.state.userName.length);
      this.setState({ error: false });
    }
  }

  joinChat(event) {
    event.preventDefault();
    const validation = this.validation();

    // user name validation
    if (!validation) {
      // change 'logged on' status
      const bool = this.props.loggedOn ? false : true;
      this.props.changeLoggedStatus(bool);
  
      // send username to parent state
      this.props.setUserName(this.state.userName);
      
      // emit join event to server
      api.emitJoin(this.state.userName);
    } else {
      console.log('Oops... something\'s not working!');
    }
  }

  validation() {
    console.log('this.state.userName.length ', this.state.userName.length);
    let error = this.state.error;
    if (this.state.userName.length === 0) {
      error = true;
    }
    this.setState({ error });
    return error;
  }

  // will fire after state update
  componentDidUpdate() {
    // code here...
  }

  // Called after the component has been rendered into the page
	componentWillMount() {
    api.getQuote( (err, quote) => this.setState({ ...quote }) );
  }

  render() {
    return (
      <div className={"login-row row " + (this.props.loggedOn ? 'hide' : '')}>
        <div className="col">

          <form className="row" onSubmit={this.joinChat}>
            <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Name</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className={'form-control ' + (this.state.error ? 'inputError' : '')}
                    id="form-login"
                    placeholder="Enter name"
                    value={this.state.userName}
                    onChange={this.inputChange}
                    autoFocus
                    autoComplete="off"
                  />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-outline-secondary">Enter</button>
                  </div>
                </div>
              </div>
              <div className="form-group hide">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
              </div>
            </div>
          </form>


          <div className="row">
            <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4 login-quote-col">
              <small className="form-text text-muted">
                &quot;{this.state.quoteText}&quot;
              </small>
              <cite className="small form-text text-muted text-right">
                {this.state.quoteAuthor}
              </cite>
            </div>
          </div>

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

  componentDidMount(){
    // console.log(this);
    // this.querySelector('.form-control').focus();
  }

  render() {
    return (
      <div className={"chat-row row " + (this.props.loggedOn ? 'show' : '')}>
        <div className="col">
          <div className="row">

            <div className="col-md-2"></div>

            <div className="col-md-6">

              {/* <div className="row">
                <div className="col" id="usersLogged">
                  users logged on: {this.props.users.length}
                </div>
              </div> */}

              {/* DISPLAY MESSAGES FROM BACK-END */}
              <div className="row">
                <div className="row chat-shadow chat-shadow-top">
                  <div className="col"></div>
                </div>
                <div className="col chat-display-container-col">
                  <ChatMessages userName={this.props.userName}/>
                </div>
                <div className="row chat-shadow chat-shadow-bottom">
                  <div className="col"></div>              
                </div>
              </div>

              {/* SUBMIT MESSAGES TO BACK-END */}
              <div className="row input-row">
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
                      autoComplete="off"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">Send!</button>
                    </div>
                  </form>
                </div>
              </div>

            </div>

            <div className="col-md-3 users-display" id="usersDisplay">
              {/* <p>users list here...</p> */}
              <div className="row">
                <div className="col">
                  <UserList userName={this.props.userName}/>
                </div>
              </div>

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
  }
  
  scrollToBottom = () => { // TODO: make more 'react'-like
    const chatDisplay = document.getElementById('chatDisplay');
    // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    console.log('SCROLL TEST:');
    console.log(chatDisplay.scrollTop)
    console.log(chatDisplay.scrollHeight)
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    let displayAllMsgs = '';
    if (this.state.messages.length > 0) {
      displayAllMsgs = this.state.messages.map((message, index) => {
        console.log('msg obj: ', message);
  
        // set date format for each msg displayed
        const options = {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }
        console.log('message: ', message)
        const date = new Date(message.date).toLocaleDateString('en-US', options);
        const userTest = message.userName === this.props.userName;
  
        // set jsx for each msg displayed
        return (
          <div className="row" key={"msg-" + index}>
            <div className={"col-xs-10 col-sm-10 col-md-10 " + (userTest ? "offset-xs-2 offset-sm-2 offset-md-2" : "" )}>
              <div className={"card " + (userTest ? "user" : "yellow" )}>
                <div className="card-body">
                <div className="">
                  <h5 className="card-title">{message.userName}<small className="card-subtitle mb-2 text-muted">{date}</small></h5>
                  
                </div>
                  <p className="card-text">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div className="row">
        <div className="col chat-display" id="chatDisplay">
          {displayAllMsgs}
          {/* // TODO: remove next line when 'scroll' function is more polished? */}
          <div ref={(el) => { this.messagesEnd = el }}></div>
        </div>
      </div>
    );
  }
}


class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    }

    api.subscribeToUsers((err, users) => {
      console.log('RECEIVED: users list: ', users);
      this.setState({ users });
    });
  }

  render() {
    let displayAllUsers = '';
    console.log('users:', this.state.users);
    console.log('users length: ', this.state.users.length);
    if (this.state.users.length > 0) {
      displayAllUsers = this.state.users.map((user, index) => {
        console.log('  >> user: ', user);
  
        // set date format for each msg displayed
        const options = {
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }
        const userTest = user === this.props.userName;
  
        // set jsx for each msg displayed
        return (
          <div className="row" key={"user-" + index}>
            <div className="col-md-10 offset-md-2">
              <div className={"card " + (userTest ? "user" : "yellow" )}>
                <div className="card-body">
                  <p className="card-text">{user}</p>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <div className="row">
        <div className="col chat-display" id="userDisplay">
        <div className="chat-shadow-top"></div>        
          {displayAllUsers}
          <div className="chat-shadow-bottom"></div>
        </div>
      </div>
    );
  }
}



export default App;
