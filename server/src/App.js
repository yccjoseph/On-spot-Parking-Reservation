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
  
  handleClick = async e => {
    const res = await fetch('http://localhost:5000/api/check', {
      method: 'GET'
    });
    const body = await res.text();
    switch (body) {
      case 'a':
        this.setState({ occupied: 'Yes', reserved: 'Yes'});
        alert('Sorry, this parking spot is not available in selected time slot. Choose another one!');
        break;
      case 'b':
        this.setState({ occupied: 'Yes', reserved: 'No'});
        alert('Sorry, this parking spot is not available in selected time slot. Choose another one!');
      break;
      case 'c':
        this.setState({ occupied: 'No', reserved: 'Yes'});
        alert('Sorry, this parking spot is not available in selected time slot. Choose another one!');
        break;
      case 'd':
        this.setState({ occupied: 'No', reserved: 'No'});
        alert('You have reserved the spot. Please be on time to park');
      break;
      default:
        this.setState({ occupied: 'N/A', reserved: 'N/A'})
    }
  }

  onChange = time => {
    this.setState({ time: time })
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

        <button onClick={this.handleClick}>
          Check Availability
        </button>
      </div>
      

    );
  }
}

export default App;
