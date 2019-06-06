import React, { Component } from "react";
import axios from "axios";

class TrackingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
  }

  render() {
    return (
      <div>
        <h1>Welcome to the NB-IoT ShipTracker!</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            SIM ID:
            <br />
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <br />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default TrackingForm;
