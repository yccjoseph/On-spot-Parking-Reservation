import React, { Component } from 'react';
import './App.css';
// import socketIOClient from 'socket.io-client'

import TimePicker from 'react-time-picker';
import moment from 'moment';

class App extends Component {
  state = {
    time: moment().format('hh:mm')
  }
 
  onChange = time => this.setState({ time })

  render() {
    return (
      <div className="App">
      
        Received<input type="text" name="FirstName"></input>

        <TimePicker
            onChange={this.onChange}
            value={this.state.time}
        />

        </div>
      

    );
  }
}

export default App;
