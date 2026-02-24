import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartQty = (props) => {
  
  const renderColorfulLegendText = (value, entry) => {
    
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <ResponsiveContainer>
      <LineChart data={props.data} title="Chart of PU x UV">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis type="number" domain={[0, 100]} />
        <Tooltip />
        <Legend formatter={renderColorfulLegendText} />
        <Line type="monotone" dataKey="Planned Quantity" stroke="#00adff" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Actual Quantity" stroke="#55dc00" />
        <Line type="monotone" dataKey="Revised Quantity" stroke="#ffc107" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartQty;
