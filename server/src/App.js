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
      occupied: 'No',
      reserved: 'No',
      time: moment().format('HH:mm')
    }
    this.check_handleClick = this.check_handleClick.bind(this)
    this.reserve_handleClick = this.reserve_handleClick.bind(this)
    this.park_handleClick = this.park_handleClick.bind(this)
    this.leave_handleClick = this.leave_handleClick.bind(this)
  }

  getStatus = async e => {
    const res = await fetch('http://localhost:5000/api/check', {
      method: 'GET'
    });
    const body = await res.text();
    switch (body) {
      case 'a':
        this.setState({ occupied: 'Yes'});
        break;
      case 'b':
        this.setState({ occupied: 'No'});
      break;
      default:
        this.setState({ occupied: 'No', reserved: 'No'})
    }
  }
  componentDidMount = async e => {
    await this.getStatus();
  }
  
  // Check Availability: checks status from device
  check_handleClick = async e => {
    await this.getStatus();
    if (this.state.occupied === 'Yes' || this.state.reserved === 'Yes') {
      alert('Sorry! Not Available!');
    }
    else if (this.state.occupied === 'No' && this.state.reserved === 'No') {
      alert('Hurray! Please proceed to reserve...')
    }
  }

  // Reserve: checks status on the server (database)
  // This should be added in the dialog box of "Check Availability" button action
  reserve_handleClick = () => {
    if (this.state.occupied === 'Yes' || this.state.reserved === 'Yes') {
      alert('Sorry, this time slot is unavailable for reservation. Please choose another time.');
    }
    else if (this.state.occupied === 'No' && this.state.reserved === 'No') {
      alert('Hurray! This spot is reserved for you.')
      this.setState({ occupied: 'No', reserved: 'Yes'});
    }
  }

  park_handleClick = () => {
    this.setState({ occupied: 'Yes', reserved: this.state.reserved});
  }

  leave_handleClick = () => {
    this.setState({ occupied: 'No', reserved: 'No'});
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

        <button onClick={this.check_handleClick}>
          Check Availability
        </button>

        <button onClick={this.reserve_handleClick}>
          Reserve
        </button>

        <br/><br/>
        <button onClick={this.park_handleClick}>
          Park
        </button>

        <button onClick={this.leave_handleClick}>
          Leave
        </button>
      </div>
      

    );
  }
}

export default App;
