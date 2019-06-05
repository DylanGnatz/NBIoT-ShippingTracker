import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";

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
      eastWest: this.props.isWest ? "W" : "E",
      showMap: false
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
        <td>
          <MapsPopout />
        </td>
      </tr>
    );
  }
}

const MapsPopout = () => (
  <OverlayTrigger trigger="click" placement="top" overlay={popover}>
    <Button variant="success">Map</Button>
  </OverlayTrigger>
);

const popover = (
  <Popover id="popover-basic" title="Popover right">
    And here's some <strong>amazing</strong> content. It's very engaging. right?
  </Popover>
);

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
