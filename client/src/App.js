import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TrackingForm from "./TrackingForm";
import TrackingTable from "./TrackingTable";
import HelloWorld from "./HelloWorld";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      SIMID: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ SIMID: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.submitted);
    this.setState({ submitted: true });
  }

  render() {
    return (
      <div className="App">
        <Container-Fluid>
          <Row>
            <Col />
            <Col>
              <br />
              <h1>Welcome to the NB-IoT ShipTracker!</h1>

              <Form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId="formSIMID"
                  value={this.state.value}
                  onChange={this.handleChange}
                >
                  <Form.Label>
                    Please enter your SIM ID below to track your shipment:
                  </Form.Label>
                  <Form.Control placeholder="SIM ID" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Track
                </Button>
              </Form>
            </Col>
            <Col />
          </Row>
          <br />
          {this.state.submitted ? (
            <div>
              <h1> Tracking Data for SIM {this.state.SIMID} </h1>
              <TrackingTable SIMID={this.state.SIMID} />
            </div>
          ) : null}
        </Container-Fluid>
      </div>
    );
  }
}

export default App;

/*

<input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
this.state = {
  <TrackingTable SIMID={this.state.SIMID} />
      events: [
        {
          id: 1,
          EventID: "isworking",
          EventTime: "testtime",
          SIMID: "test",
          Temperature: 10,
          Humidity: 11,
          Latitude: 34,
          IsNorth: false,
          Longitude: 65,
          IsWest: true,
          createdAt: "2019-05-31T17:07:59.115Z",
          updatedAt: "2019-05-31T17:07:59.115Z"
        },
        {
          id: 1,
          EventID: "isworkingSTILL!",
          EventTime: "testtime",
          SIMID: "test",
          Temperature: 10,
          Humidity: 11,
          Latitude: 34,
          IsNorth: false,
          Longitude: 65,
          IsWest: true,
          createdAt: "2019-05-31T17:07:59.115Z",
          updatedAt: "2019-05-31T17:07:59.115Z"
        }
      ]
    };
    */
