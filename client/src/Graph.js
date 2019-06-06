import React, { Component } from "react";
import "../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from "react-vis";

class Graph extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const dataArr = this.props.data.map(data => {
      console.log({ x: data.EventTime, y: data.Temperature });
      return { x: data.EventTime, y: data.Temperature };
    });
    console.log(dataArr);
    this.setState({ plot: dataArr });
    console.log(this.state.plot);
  }

  render() {
    return (
      <div className="App">
        <XYPlot xType="time" width={300} height={300}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis title="Time" />
          <YAxis title="Temperature" />
          <LineSeries data={this.state.data} />
        </XYPlot>
      </div>
    );
  }
}

export default Graph;
