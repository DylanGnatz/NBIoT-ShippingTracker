import React, { Component } from "react";
import TrackingLine from "./TrackingLine";
import Table from "react-bootstrap/Table";
import axios from "axios";

class TrackingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SIMID: props.SIMID,
      events: []
    };
  }
  componentDidMount() {
    axios.get(`/getEvents/${this.state.SIMID}`).then(res => {
      const events = res.data.events;
      this.setState({ events: res.data.events });
      console.log("state: ");
      console.log(this.state.events);
    });
  }

  render() {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th scope="col">Tracking ID</th>
            <th scope="col">Tracking Time</th>
            <th scope="col">Temperature</th>
            <th scope="col">Humidity</th>
            <th scope="col">Latitude</th>
            <th scope="col">North/South</th>
            <th scope="col">Longitude</th>
            <th scope="col">East/West</th>
            <th scope="col">View Map</th>
          </tr>
        </thead>
        <tbody>
          {this.state.events.map(line => (
            <TrackingLine
              key={line.id}
              eventID={line.EventID}
              eventTime={line.EventTime}
              temperature={line.Temperature}
              humidity={line.Humidity}
              latitude={line.Latitude}
              northSouth={line.NorthSouth}
              longitude={line.Longitude}
              eastWest={line.EastWest}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default TrackingTable;
