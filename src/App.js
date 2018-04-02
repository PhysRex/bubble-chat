import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { subscribeToTimer } from './api';

import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeStamp: 'No timestamp yet...',
      loggedOn: true,
      users: [],
    }

    subscribeToTimer( (err, timestamp) => this.setState({ timestamp }) );
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
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
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

              <div className="row">
                <div className="col chat-display" id="chatDisplay">

                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Enter message here" aria-label="Enter message here" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="button">Send!</button>
                    </div>
                  </div>
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

export default App;
