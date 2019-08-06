import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import MapView from "./MapView";
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
      longitude: this.props.longitude,
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
        <td>{this.state.longitude}</td>
        <td>{MapsPopout(this.state.latitude, this.state.longitude)}</td>
      </tr>
    );
  }
}

const MapsPopout = (lat, lng) => (
  <div className="maps-popout">
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={popover(lat, lng)}
    >
      <Button variant="success">Map</Button>
    </OverlayTrigger>
  </div>
);

const popover = (lat, lng) => (
  <Popover id="popover-basic" title="Tracking Location">
    <MapView latitude={lat} longitude={lng} />
  </Popover>
);

export default TrackingLine;
