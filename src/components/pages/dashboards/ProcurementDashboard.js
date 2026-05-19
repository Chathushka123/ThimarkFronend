import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProcurementOrders, getProcurementSummary } from './dashboard';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatNumber = (value) => Number(value || 0).toLocaleString('en-LK');

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const toIsoDate = (d) => d.toISOString().slice(0, 10);

const ProcurementDashboard = () => {
  const [dateFrom, setDateFrom] = useState(toIsoDate(firstDay));
  const [dateTo, setDateTo] = useState(toIsoDate(today));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);

  const kpis = useMemo(() => {
    return [
      {
        title: 'Total PO Value',
        value: formatCurrency(summary && summary.total_po_value),
        tone: 'border-primary'
      },
      {
        title: 'Total PO Count',
        value: formatNumber(summary && summary.total_po_count),
        tone: 'border-info'
      },
      {
        title: 'Average Order Value',
        value: formatCurrency(summary && summary.avg_order_value),
        tone: 'border-secondary'
      },
      {
        title: 'Average Cycle Days',
        value: `${formatNumber(summary && summary.avg_cycle_days)} days`,
        tone: 'border-warning'
      }
    ];
  }, [summary]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        date_from: dateFrom,
        date_to: dateTo,
        page: 1,
        per_page: 10
      };

      const [summaryRes, ordersRes] = await Promise.all([
        getProcurementSummary(params),
        getProcurementOrders(params)
      ]);

      setSummary(summaryRes || {});
      setOrders((ordersRes && ordersRes.data) || []);
    } catch (err) {
      setError('Unable to load procurement dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Procurement Dashboard</h1>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Back to Dashboards</Link>
        </div>
      </div>

      <div className="container-fluid pt-4">
        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-body">
            <div className="row align-items-end">
              <div className="col-md-3 mb-2">
                <label className="mb-1">Date From</label>
                <input
                  className="form-control"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-2">
                <label className="mb-1">Date To</label>
                <input
                  className="form-control"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="col-md-3 mb-2">
                <button className="btn btn-primary btn-sm mr-2" onClick={loadData} disabled={loading}>
                  {loading ? 'Loading...' : 'Apply'}
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setDateFrom(toIsoDate(firstDay));
                    setDateTo(toIsoDate(today));
                  }}
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={loadData}>Retry</button>
          </div>
        )}

        <div className="row">
          {kpis.map((item) => (
            <div className="col-sm-6 col-xl-3 mb-3" key={item.title}>
              <div className={`card h-100 shadow-sm border-left ${item.tone}`}>
                <div className="card-body">
                  <div className="small text-muted">{item.title}</div>
                  <h4 className="mb-0">{loading ? '...' : item.value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <strong>Recent Purchase Orders</strong>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No purchase orders found for selected dates.
                    </td>
                  </tr>
                )}
                {orders.map((row, idx) => (
                  <tr key={`${row.po_number || 'row'}-${idx}`}>
                    <td>{row.po_number || '-'}</td>
                    <td>{row.supplier_name || '-'}</td>
                    <td>{row.order_date || '-'}</td>
                    <td>
                      <span className="badge badge-light text-uppercase">{row.status || '-'}</span>
                    </td>
                    <td className="text-right">{formatCurrency(row.total_amount)}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Loading data...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcurementDashboard;
