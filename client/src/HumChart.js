import React from "react";
import "/Users/dylangnatz/Coding_Projects/TmobileIoT/shiptracker/client/node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries
} from "react-vis";

const HumChart = props => {
  const dataArr = props.data.map(d => {
    return { x: new Date(d.EventTime), y: d.Humidity };
  });

  return (
    <XYPlot xType="time" width={1200} height={1200}>
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis title="Time" />
      <YAxis title="Humidity" />
      <LineSeries data={dataArr} style={{ stroke: "violet", strokeWidth: 3 }} />
    </XYPlot>
  );
};

export default HumChart;
