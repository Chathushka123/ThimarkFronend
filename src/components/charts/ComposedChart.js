import React, { PureComponent } from 'react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FrwkComposedChart = (props) => {

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <ComposedChart data={props.data}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 100]} />
          <Tooltip />
          <Legend formatter={renderColorfulLegendText} />
          <Area type="monotone" dataKey="planned_qty" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="actual_qty" barSize={20} fill="#82ca9d" />
          <Line type="monotone" dataKey="revised_qty" stroke="#ffc658" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FrwkComposedChart;
