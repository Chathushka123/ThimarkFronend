import React from 'react';
import { Link } from 'react-router-dom';

const SimpleDashboardPlaceholder = ({ title, summary }) => {
  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">{title}</h1>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Back to Dashboards</Link>
        </div>
      </div>

      <div className="container-fluid pt-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="mb-2">Dashboard setup in progress</h5>
            <p className="text-muted mb-0">{summary}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleDashboardPlaceholder;
