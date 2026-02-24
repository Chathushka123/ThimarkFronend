import React from 'react';

const ChartInformationTitle = (props) => {

  return (
      <h5 className="dashboard-box-title float-right">{props.title_caption} {props.title_data}</h5>
  );
}

export default ChartInformationTitle;
