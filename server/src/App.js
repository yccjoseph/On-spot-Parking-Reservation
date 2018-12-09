import React, { Component } from 'react';
// import axios from 'axios';
import './App.css';
// import socketIOClient from 'socket.io-client'
// import TimePicker from 'react-time-picker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

const ip = '172.29.95.130'; // Joseph
// const ip = '10.230.12.127'; // Sissi
const format = 'h:mm a';

var popupS = require('popups');

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
    const res = await fetch('http://' + ip +':5000/api/check', {
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
      popupS.alert({
        content: 'Sorry! Spot not available'
      });
    }
    else if (this.state.occupied === 'No' && this.state.reserved === 'No') {
      popupS.confirm({
        content: 'Hurray, there is a spot for you!',
        labelOk: 'Reserve',
        onSubmit: () => {
                popupS.alert({
                        content: 'Great! Your spot is reserved.\nPlease be on time!'
                });
                this.setState({ occupied: 'No', reserved: 'Yes'});
                var park = document.getElementById("park");
                park.className = "btn-hover color-2";
                park.disabled = false;
        }
    });
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
    var park = document.getElementById("park");
    var leave = document.getElementById("leave");
    if (this.state.occupied === 'No' && this.state.reserved === 'No') {
        park.disabled = true;
    }
    else {
      this.setState({ occupied: 'Yes', reserved: this.state.reserved});
      park.className = "btn-hover btn-hidden";
      leave.className = "btn-hover color-7";
    }

  }

  leave_handleClick = () => {
    this.setState({ occupied: 'No', reserved: 'No'});
    var park = document.getElementById("park");
    var leave = document.getElementById("leave");
    park.className = "btn-hover";
    park.disabled = true;
    leave.className = "btn-hover btn-hidden";
  }

  onChange = time => {
    this.setState({ time: time })
    this.getStatus();
  }
  start = {
    time: moment()
  }

  end = {
    time: moment().add(2, 'hours')
  }

  render() {
    return (
      <div className="App">
        <div class="wrapper">
	        <h1 class="mega montserrat bold">
		      On<span class="color-emphasis-1">Spot</span><br/>
		      </h1>
	      </div>
        <span class="custom-dropdown">
          <select>
            <option selected value="#">Pick a spot</option>
            <option value="space0">Space #0</option>
            <option value="space1">Space #1</option>
            <option value="space2">Space #2</option>
            <option value="space3">Space #3</option>
            <option value="space4">Space #4</option>
          </select>
        </span>
        <br/><br/>

        <TimePicker
          showSecond={false}
          defaultValue={this.start.time}
          className="startTime"
          onChange={this.onChange}
          format={format}
          use12Hours
          inputReadOnly
        />

        <span class="prompt">to </span>
        <TimePicker
          showSecond={false}
          defaultValue={this.end.time}
          className="endTime"
          onChange={this.onChange}
          format={format}
          use12Hours
          inputReadOnly
        />

        <br/><br/>

        <button class='btn-hover color-9' onClick={this.check_handleClick}>
          Check Availability
        </button>
        <br/>

        <button id='park' class='btn-hover' onClick={this.park_handleClick}>
          Park
        </button>

        <button id='leave' class='btn-hover btn-hidden' onClick={this.leave_handleClick}>
          Leave
        </button>

        <br/><br/><br/><br/>
        <span class="footer">Copyright &copy; 2018 OnSpot Parking Reservation</span>
        
      </div>
      

    );
  }
}

// Reserved for state check
/* 
<br/><br/>
Occupied: <span onChange={this.onClick}>{this.state.occupied}</span>
<br/><br/>
Reserved: <span onChange={this.onClick}>{this.state.reserved}</span> 
*/

export default App;
