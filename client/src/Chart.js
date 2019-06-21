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

const Chart = props => {
  const dataArr = props.data.map(d => {
    return { x: new Date(d.EventTime), y: d.Temperature };
  });

  return (
    <XYPlot xType="time" width={1800} height={1200}>
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis
        title="Time"
        style={{
          line: { stroke: "#ADDDE1" },
          ticks: { stroke: "#ADDDE1" },
          text: { stroke: "#ffffff", fill: "#ffffff", fontWeight: 1200 }
        }}
      />
      <YAxis
        title="Temperature"
        style={{
          line: { stroke: "#ADDDE1" },
          ticks: { stroke: "#ADDDE1" },
          text: { stroke: "#ffffff", fill: "#ffffff", fontWeight: 1200 }
        }}
      />
      <LineSeries data={dataArr} style={{ stroke: "black", strokeWidth: 5 }} />
    </XYPlot>
  );
};

export default Chart;
