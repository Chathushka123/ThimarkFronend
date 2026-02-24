import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const FrwkPieChart = (props) => {

  /* const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EE24F8', '#1ADA08', '#2F2200', '#0F20F2']; */
  const COLORS = ['#7B68EE', '#6495ED', '#00BFFF', '#1E90FF', '#9370DB', '#87CEEB', '#4169E1', '#87CEFA', '#ADD8E6'];
  const RADIAN = Math.PI / 180;

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>

        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#ffbf00"} style={{fontSize:36,fontWeight:700}}>
        {payload.name}
      </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          dataKey="value"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  const handlePieClick = (e, index) => {
    props.onClick(e, index);
  }

  // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, id }) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

  //   return (
  //     <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
  //       {id}
  //     </text>
  //   );
  // };

  return (
    <div className="chart-container">
      <ResponsiveContainer>
        <PieChart>
          {/* <Pie 
            data={props.supervisor_data} 
            dataKey="value" 
            outerRadius={70} 
            fill="#ffc658" 
            stroke="#192231" 
            //label={(entry) => entry.name}
            labelLine={false} 
            label={renderCustomizedLabel}
          /> */}
          <Pie
            data={props.line_data}
            activeIndex={props.currentPieIndex}
            activeShape={renderActiveShape}
            isAnimationActive={false}
            /* cx={200}
            cy={150} */
            labelLine={false}
            label={(entry) => entry.name }
            /* label={(entry) => entry.name.concat(" - ".concat(entry.value))} */
            innerRadius={80} outerRadius={100}
            fill="#0088FE"
            
            onClick={handlePieClick} >
            {
              props.line_data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#192231" />)
            }
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FrwkPieChart;


