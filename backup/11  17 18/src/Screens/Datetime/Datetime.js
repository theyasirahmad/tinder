import React, { Component } from "react";
import TimePicker from "react-time-picker";
import Calendar from "react-calendar";
import './Datetime.css';


class Datetime extends Component {
  state = {
    date: new Date(),
    updatedDate: "10:00",
    time: "10:00"
  };

  onChange = date => {
    let onlyDate = date.toDateString();
    this.setState({ updatedDate: onlyDate, date });

  };

  onChangeTime = time => this.setState({ time });

  render() {
    const { time, updatedDate } = this.state;

    return (
      <div className="datetimepicker" >
        <h1 style={{ textAlign: "center" }}>Select Meeting Time</h1>
        <br />
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          minDate={new Date()}
        />
        <br />
        <TimePicker className="timepicker" onChange={this.onChangeTime} value={this.state.time} />
        <br />
        <br />
        <button className="btn btn-primary timepicker" style={{ display: "block" }} onClick={() => { this.props.datetime(updatedDate, time) }} >Send Request</button>
      </div>
    );
  }
}

export default Datetime;
