import React from 'react';

const DashboardCard = (props) => {

  return (
      <div className={`card dashboard-card ${props.card_type}`}>
          <div className="card-body">
              <div className="title mb-2">{props.card_title}</div>
              <div className="main-content">{props.card_data}</div>
          </div>
      </div>
  );
}

export default DashboardCard;
