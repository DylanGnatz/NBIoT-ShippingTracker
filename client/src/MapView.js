import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "100%",
  height: "100%"
};

const API_KEY = "xxxxxxxxxxxxxxxx";

export class MapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude
    };
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: this.state.latitude,
          lng: this.state.longitude
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapView);
