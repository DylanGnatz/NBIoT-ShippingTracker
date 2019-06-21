import React, { Component } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TrackingTable from "./TrackingTable";
import GraphView from "./GraphView";
import Helmet from "react-helmet";

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
        <Helmet bodyAttributes={{ style: "background-color : #42f4e2" }} />
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
                <Button variant="primary" type="submit" size="lg">
                  Track
                </Button>
              </Form>
            </Col>
            <Col />
          </Row>
          <br />
          {this.state.submitted ? (
            <div>
              <Tabs
                id="controlled-tab-example"
                activeKey={this.state.key}
                onSelect={key => this.setState({ key })}
              >
                <Tab eventKey="eventtable" title="Event Table">
                  <h1> Tracking Data for SIM: {this.state.SIMID} </h1>
                  <TrackingTable SIMID={this.state.SIMID} />
                </Tab>
                <Tab eventKey="graph" title="Graph View">
                  <h1>
                    {" "}
                    Temperature and Humidity Over Time for SIM:{" "}
                    {this.state.SIMID}{" "}
                  </h1>
                  <GraphView SIMID={this.state.SIMID} />
                </Tab>
              </Tabs>
            </div>
          ) : null}
        </Container-Fluid>
      </div>
    );
  }
}

export default App;
/*
<h1> Tracking Data for SIM {this.state.SIMID} </h1>
              <TrackingTable SIMID={this.state.SIMID} />
              <GraphView SIMID={this.state.SIMID} />
*/
