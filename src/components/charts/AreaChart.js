import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FrwkAreaChart = (props) => {

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <AreaChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 200]} />
          <Tooltip />
          <Legend formatter={renderColorfulLegendText} />
          <Area type='monotone' dataKey='planned_qty' stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Area type='monotone' dataKey='actual_qty' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Area type='monotone' dataKey='revised_qty' stackId="1" stroke='#ffc658' fill='#ffc658' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FrwkAreaChart;
