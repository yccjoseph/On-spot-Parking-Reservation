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
  start = {
    time: moment().format('hh:mm')
  }

  end = {
    time: moment().add(2, 'hours').format('hh:mm')
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>receive{this.state.tag}</button>
        <br/><br/><br/><br/>
        Occupied<input type="text" name="occupiedFlag"></input>
        <br/><br/>
        Reserved<input type="text" name="reservedFlag"></input>
        <br/><br/><br/><br/>
     

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

        <br/><br/><br/><br/>

        <button onClick={this.onClick}>
          Send
        </button>
      </div>
      

    );
  }
}

export default App;
