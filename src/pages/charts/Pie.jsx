import React, { memo } from "react";

import { Chart, Interval, Tooltip, Axis, Coordinate } from "bizcharts";
import { Card } from "antd";

export default memo(function LQBar() {
  const data = [
    { item: "事例一", percent: 0.4 },
    { item: "事例二", percent: 0.21 },
    { item: "事例三", percent: 0.17 },
    { item: "事例四", percent: 0.13 },
    { item: "事例五", percent: 0.09 }
  ];

  const cols = {
    percent: {
      formatter: val => {
        val = val * 100 + "%";
        return val;
      }
    }
  };

  return (
    <Card title="基础饼图">
      <Chart height={400} data={data} scale={cols} autoFit>
        <Coordinate type="theta" radius={0.75} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Interval
          position="percent"
          adjust="stack"
          color="item"
          style={{
            lineWidth: 1,
            stroke: "#fff"
          }}
          label={[
            "*",
            {
              content: data => {
                return `${data.item}: ${data.percent * 100}%`;
              }
            }
          ]}
        />
      </Chart>
    </Card>
  );
});
