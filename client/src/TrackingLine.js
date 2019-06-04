import React, { Component } from "react";
import Table from "react-bootstrap/Table";

class TrackingLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventID: this.props.eventID,
      eventTime: this.props.eventTime,
      temperature: this.props.temperature,
      humidity: this.props.humidity,
      latitude: this.props.latitude,
      northSouth: this.props.isNorth ? "N" : "S",
      longitude: this.props.longitude,
      eastWest: this.props.isWest ? "W" : "E"
    };
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.state.eventID}</th>
        <td>{this.state.eventTime}</td>
        <td>{this.state.temperature}</td>
        <td>{this.state.humidity}</td>
        <td>{this.state.latitude}</td>
        <td>{this.state.northSouth}</td>
        <td>{this.state.longitude}</td>
        <td>{this.state.eastWest}</td>
      </tr>
    );
  }
}
/*
  render() {
    return (
      <div className="HelloWorld">
        {this.state.greeting} {this.props.name}!
        <br />
        <button onClick={this.frenchify}>Frenchify!</button>
      </div>
    );
  }
}
*/

export default TrackingLine;
