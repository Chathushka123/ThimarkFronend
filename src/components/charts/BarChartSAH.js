import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartSAH = (props) => {

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <ResponsiveContainer>
      <BarChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis type="number" domain={[0, 50]} />
        <Tooltip />
        <Legend formatter={renderColorfulLegendText} />
        <Bar dataKey="Planned SAH" fill="#00adff" />
        <Bar dataKey="Actual SAH" fill="#55dc00" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartSAH;
