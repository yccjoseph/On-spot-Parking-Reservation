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
      occupied: 'N/A',
      reserved: 'N/A',
      time: moment().format('hh:mm')
    }
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick = async e => {
    const res = await fetch('http://localhost:5000/api/hello', {
      method: 'GET'
    });
    const body = await res.text();
    switch (body) {
      case 'a':
        this.setState({ occupied: 'Yes', reserved: 'Yes'});
        break;
      case 'b':
        this.setState({ occupied: 'Yes', reserved: 'No'});
      break;
      case 'c':
        this.setState({ occupied: 'No', reserved: 'Yes'});
        break;
      case 'd':
        this.setState({ occupied: 'No', reserved: 'No'});
      break;
      default:
        this.setState({ occupied: 'N/A', reserved: 'N/A'})
    }
  }

  onChange = time => {
    this.setState({ time: time })
  }
  start = {
    time: moment().format('hh:mm')
  }

  end = {
    time: moment().add(2, 'hours').format('hh:mm')
  }

  render() {
    return (
      <div className="App">
        <p>Parking Space #0</p>
        <button onClick={this.handleClick}>Check Availability</button>
        <br/><br/>
        Occupied: <span>{this.state.occupied}</span>
        <br/><br/>
        Reserved: <span>{this.state.reserved}</span>
        <br/><br/><br/><br/>

        <p>Reserve Now!</p>

        <TimePicker name={"startTime"}
            onChange={this.onChange}
            value={this.start.time}
            clearIcon={null}
            disableClock={true}
            locale={"en-US"}
        />
        <br/><br/>
        <TimePicker name={"endTime"}
            onChange={this.onChange}
            value={this.end.time}
            clearIcon={null}
            disableClock={true}
            locale={"en-US"}
        />

        <br/><br/>

        <button onClick={this.onClick}>
          Send
        </button>
      </div>
      

    );
  }
}

export default App;
