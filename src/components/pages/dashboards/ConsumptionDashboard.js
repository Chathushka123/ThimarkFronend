import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsumptionByBatch, getConsumptionSummary } from './dashboard';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const formatNumber = (value) => Number(value || 0).toLocaleString('en-LK');

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const toIsoDate = (d) => d.toISOString().slice(0, 10);

const ConsumptionDashboard = () => {
  const [dateFrom, setDateFrom] = useState(toIsoDate(firstDay));
  const [dateTo, setDateTo] = useState(toIsoDate(today));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [batches, setBatches] = useState([]);

  const kpis = useMemo(() => [
    { title: 'Total MRNs', value: formatNumber(summary && summary.total_mrn_count), tone: 'border-primary' },
    { title: 'Total Qty Consumed', value: formatNumber(summary && summary.total_qty_consumed), tone: 'border-info' },
    { title: 'Total Consumption Value', value: formatCurrency(summary && summary.total_consumption_value), tone: 'border-success' },
    { title: 'Avg Value per MRN', value: formatCurrency(summary && summary.avg_value_per_mrn), tone: 'border-secondary' },
  ], [summary]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { date_from: dateFrom, date_to: dateTo };
      const [summaryRes, batchRes] = await Promise.all([
        getConsumptionSummary(params),
        getConsumptionByBatch({ ...params, per_page: 20 }),
      ]);
      setSummary(summaryRes || {});
      setBatches(Array.isArray(batchRes) ? batchRes : []);
    } catch (err) {
      setError('Unable to load consumption data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Consumption Dashboard</h1>
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
          <div className="card-header bg-white"><strong>Consumption by Batch</strong></div>
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>Batch No</th>
                  <th>Model</th>
                  <th className="text-right">MRN Count</th>
                  <th className="text-right">Total Qty</th>
                  <th className="text-right">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {!loading && batches.length === 0 && (
                  <tr><td colSpan="5" className="text-center text-muted py-4">No consumption data found for selected dates.</td></tr>
                )}
                {batches.map((row, idx) => (
                  <tr key={`${row.batch_no || idx}`}>
                    <td>{row.batch_no || '-'}</td>
                    <td>{row.model_name || row.model || '-'}</td>
                    <td className="text-right">{formatNumber(row.mrn_count)}</td>
                    <td className="text-right">{formatNumber(row.total_qty)}</td>
                    <td className="text-right">{formatCurrency(row.total_value)}</td>
                  </tr>
                ))}
                {loading && <tr><td colSpan="5" className="text-center py-4">Loading data...</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsumptionDashboard;
