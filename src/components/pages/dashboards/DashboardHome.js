import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Active Purchase orders',
    description: 'Track purchase spend, order volume, and pending items.',
    to: '/dashboard/pos'
  },
  {
    title: 'Procurement',
    description: 'Track purchase spend, order volume, and pending items.',
    to: '/dashboard/procurement'
  },
  {
    title: 'Inventory',
    description: 'View stock value, low stock alerts, and warehouse status.',
    to: '/inventory'
  },
  // {
  //   title: 'Consumption',
  //   description: 'Understand material usage and batch-level efficiency.',
  //   to: '/dashboard/consumption'
  // },
  // {
  //   title: 'GRN',
  //   description: 'Monitor GRN completion and supplier performance quickly.',
  //   to: '/dashboard/grn'
  // },
  // {
  //   title: 'Payments',
  //   description: 'See paid vs outstanding values and payable pressure points.',
  //   to: '/dashboard/payments'
  // }
];

const DashboardHome = () => {
  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp">
          <h1>Management Dashboards</h1>
        </div>
      </div>

      <div className="container-fluid pt-4">
        <div className="row">
          <div className="col-12 mb-3">
            <p className="text-muted mb-0">
              A quick view designed for top-level decision making.
            </p>
          </div>
        </div>

        <div className="row">
          {cards.map((card) => (
            <div className="col-md-6 col-xl-4 mb-3" key={card.to}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{card.title}</h5>
                  <p className="card-text text-muted mb-4">{card.description}</p>
                  <div className="mt-auto">
                    <Link className="btn btn-primary btn-sm" to={card.to}>
                      Open Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
