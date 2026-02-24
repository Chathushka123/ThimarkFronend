import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartEfficiency = (props) => {

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <ResponsiveContainer>
      <LineChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis type="number" domain={[0, 100]} />
        <Tooltip />
        <Legend formatter={renderColorfulLegendText} />
        <Line type="monotone" dataKey="Planned Efficiency" stroke="#00adff" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Actual Efficiency" stroke="#55dc00" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartEfficiency;
