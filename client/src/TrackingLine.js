import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import MapView from "./MapView";
import Container from "react-bootstrap/Container";
import "./App.css";

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
        <td>{MapsPopout(this.state.latitude, this.state.longitude)}</td>
      </tr>
    );
  }
}

const MapsPopout = (lat, lng) => (
  <OverlayTrigger trigger="click" placement="left" overlay={popover(lat, lng)}>
    <Button variant="success">Map</Button>
  </OverlayTrigger>
);

const popover = (lat, lng) => (
  <Popover id="popover-basic" title="Tracking Location">
    <MapView latitude={lat} longitude={lng} />
  </Popover>
);

export default TrackingLine;
