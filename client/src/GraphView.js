import React, { Component } from "react";
import { XYPlot, LineSeries } from "react-vis";
import Chart from "./Chart";
import HumChart from "./HumChart.js";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

class GraphView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SIMID: this.props.SIMID,
      events: [],
      renderGraph: false
    };
  }

  componentDidMount() {
    axios.get(`/getEvents/${this.state.SIMID}`).then(res => {
      const events = res.data.events;
      this.setState({ events: res.data.events });
      this.setState({ renderGraph: true });
    });
  }

  render() {
    return (
      <div className="App">
        <Container-Fluid>
          <Row>
            <Col>
              <Card bg="primary" text="white" style={{}}>
                <Card.Body>
                  <Card.Title>Temperature vs. Time</Card.Title>
                  {this.state.renderGraph ? (
                    <Chart data={this.state.events} />
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card bg="danger" text="white" style={{}}>
                <Card.Body>
                  <Card.Title>Humidity vs. Time</Card.Title>
                  {this.state.renderGraph ? (
                    <HumChart data={this.state.events} />
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container-Fluid>
      </div>
    );
  }
}

export default GraphView;
