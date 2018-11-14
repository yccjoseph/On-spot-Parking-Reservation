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
      time: moment().format('HH:mm')
    }
    this.handleClick = this.handleClick.bind(this)
  }

  getStatus = async e => {
    const res = await fetch('http://localhost:5000/api/check', {
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
  componentDidMount = async e => {
    await this.getStatus();
  }
  
  handleClick = async e => {
    await this.getStatus();
    if (this.state.occupied === 'Yes' && this.state.reserved === 'No') {
      alert('Sorry, this time slot is unavailable for reservation. Please choose another time.');
    }
    else if (this.state.occupied === 'No' && this.state.reserved === 'No') {
      alert('Hurray! This spot is reserved for you.')
    }
  }

  onChange = time => {
    this.setState({ time: time })
    this.getStatus();
  }
  start = {
    time: moment().format('HH:mm')
  }

  end = {
    time: moment().add(2, 'hours').format('HH:mm')
  }

  render() {
    return (
      <div className="App">
        <p>Parking Space</p>
        <select>
          <option selected value="space0">Space #0</option>
          <option value="space1">Space #1</option>
          <option value="space2">Space #2</option>
          <option value="space3">Space #3</option>
          <option value="space4">Space #4</option>
        </select>
        <br/><br/>
        Occupied: <span onChange={this.onClick}>{this.state.occupied}</span>
        <br/><br/>
        Reserved: <span onChange={this.onClick}>{this.state.reserved}</span>
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

        <button onClick={this.handleClick}>
          Check Availability
        </button>
      </div>
      

    );
  }
}

export default App;
