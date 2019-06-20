import React, { Component } from "react";
import { XYPlot, LineSeries } from "react-vis";
import Chart from "./Chart";
import HumChart from "./HumChart.js";
import axios from "axios";

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
        {this.state.renderGraph ? <Chart data={this.state.events} /> : null}
        {this.state.renderGraph ? <HumChart data={this.state.events} /> : null}
      </div>
    );
  }
}

export default GraphView;
