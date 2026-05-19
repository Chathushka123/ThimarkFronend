import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGrnSummary } from './dashboard';

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const toIsoDate = (d) => d.toISOString().slice(0, 10);
const formatNumber = (value) => Number(value || 0).toLocaleString('en-LK');
const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const GrnDashboard = () => {
  const [dateFrom, setDateFrom] = useState(toIsoDate(firstDay));
  const [dateTo, setDateTo] = useState(toIsoDate(today));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [grnItems, setGrnItems] = useState([]);

  const kpis = useMemo(() => [
    { title: 'Total GRNs', value: formatNumber(summary && summary.total_grn_count), tone: 'border-primary' },
    { title: 'Completed GRNs', value: formatNumber(summary && summary.completed_grn_count), tone: 'border-success' },
    { title: 'Pending GRNs', value: formatNumber(summary && summary.pending_grn_count), tone: 'border-warning' },
    { title: 'Total Received Value', value: formatCurrency(summary && summary.total_received_value), tone: 'border-info' },
  ], [summary]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { date_from: dateFrom, date_to: dateTo };
      const res = await getGrnSummary(params);
      setSummary(res || {});
      setGrnItems((res && res.grn_items) || []);
    } catch (err) {
      setError('Unable to load GRN data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">GRN Dashboard</h1>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Back to Dashboards</Link>
        </div>
      </div>

      <div className="container-fluid pt-4">
        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-body">
            <div className="row align-items-end">
              <div className="col-md-3 mb-2">
                <label className="mb-1">Date From</label>
                <input className="form-control" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="col-md-3 mb-2">
                <label className="mb-1">Date To</label>
                <input className="form-control" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="col-md-3 mb-2">
                <button className="btn btn-primary btn-sm mr-2" onClick={loadData} disabled={loading}>
                  {loading ? 'Loading...' : 'Apply'}
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => { setDateFrom(toIsoDate(firstDay)); setDateTo(toIsoDate(today)); }} disabled={loading}>Reset</button>
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
            <strong>GRN Records</strong>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>GRN Number</th>
                  <th>Supplier</th>
                  <th>Received Date</th>
                  <th>Status</th>
                  <th className="text-right">Received Value</th>
                </tr>
              </thead>
              <tbody>
                {!loading && grnItems.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No GRN records found for selected dates.</td>
                  </tr>
                )}
                {grnItems.map((row, idx) => (
                  <tr key={`${row.grn_number || 'row'}-${idx}`}>
                    <td>{row.grn_number || '-'}</td>
                    <td>{row.supplier_name || '-'}</td>
                    <td>{row.received_date || '-'}</td>
                    <td><span className="badge badge-light text-uppercase">{row.status || '-'}</span></td>
                    <td className="text-right">{formatCurrency(row.received_value)}</td>
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

export default GrnDashboard;
