import React, { memo } from "react";

import { Chart, Interval } from "bizcharts";

import { Card } from "antd";

export default memo(function LQBar() {
  const data = [
    { year: "1951 年", sales: 38 },
    { year: "1952 年", sales: 52 },
    { year: "1956 年", sales: 61 },
    { year: "1957 年", sales: 45 },
    { year: "1958 年", sales: 48 },
    { year: "1959 年", sales: 38 },
    { year: "1960 年", sales: 38 },
    { year: "1962 年", sales: 38 }
  ];

  // 返回的jsx
  return (
    <Card title="基础柱状图(Interval)">
      <Chart height={300} autoFit data={data}>
        <Interval position="year*sales" />
      </Chart>
    </Card>
  );
});
