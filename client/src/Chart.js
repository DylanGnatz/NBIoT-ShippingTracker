import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries
} from "react-vis";

const Chart = props => {
  const dataArr = props.data.map(d => {
    return { x: d.Humidity, y: d.Temperature };
  });

  return (
    <XYPlot xType="time" width={300} height={300}>
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis title="Time" />
      <YAxis title="Temperature" />
      <LineSeries data={dataArr} style={{ stroke: "violet", strokeWidth: 3 }} />
    </XYPlot>
  );
};

export default Chart;
