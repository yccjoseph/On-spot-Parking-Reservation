import React, { Component } from 'react';
// import axios from 'axios';
import './App.css';
// import socketIOClient from 'socket.io-client'

import TimePicker from 'react-time-picker';
import moment from 'moment';



class App extends Component {
  constructor () {
    super()
    this.state = {
      tag: 'init',
      time: moment().format('hh:mm')
    }
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick = async e => {
    const res = await fetch('http://localhost:5000/api/hello', {
      method: 'GET'
    });
    const body = await res.text();
    this.setState({ tag: body});
  }

  onChange = time => {
    this.setState({ time: time })
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>receive{this.state.tag}</button>

        <TimePicker
            onChange={this.onChange}
            value={this.state.time}
        />

        </div>
      

    );
  }
}

export default App;
