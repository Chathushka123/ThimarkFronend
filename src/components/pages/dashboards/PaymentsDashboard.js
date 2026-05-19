import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaymentsList, getPaymentsSummary } from './dashboard';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const formatNumber = (value) => Number(value || 0).toLocaleString('en-LK');

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const toIsoDate = (d) => d.toISOString().slice(0, 10);

const PaymentsDashboard = () => {
  const [dateFrom, setDateFrom] = useState(toIsoDate(firstDay));
  const [dateTo, setDateTo] = useState(toIsoDate(today));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);

  const kpis = useMemo(() => [
    { title: 'Total POs', value: formatNumber(summary && summary.total_po_count), tone: 'border-primary' },
    { title: 'Total PO Value', value: formatCurrency(summary && summary.total_po_value), tone: 'border-info' },
    { title: 'Amount Paid', value: formatCurrency(summary && summary.amount_paid), tone: 'border-success' },
    { title: 'Outstanding', value: formatCurrency(summary && summary.outstanding_amount), tone: 'border-danger' },
  ], [summary]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { date_from: dateFrom, date_to: dateTo };
      const [summaryRes, listRes] = await Promise.all([
        getPaymentsSummary(params),
        getPaymentsList({ ...params, per_page: 20 }),
      ]);
      setSummary(summaryRes || {});
      setPayments(Array.isArray(listRes) ? listRes : []);
    } catch (err) {
      setError('Unable to load payments data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Payments Dashboard</h1>
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
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => { setDateFrom(toIsoDate(firstDay)); setDateTo(toIsoDate(today)); }}
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
          <div className="card-header bg-white"><strong>Recent Payments</strong></div>
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th className="text-right">PO Amount</th>
                  <th className="text-right">Amount Paid</th>
                  <th className="text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {!loading && payments.length === 0 && (
                  <tr><td colSpan="7" className="text-center text-muted py-4">No payment records found for selected dates.</td></tr>
                )}
                {payments.map((row, idx) => (
                  <tr key={`${row.po_number || idx}`}>
                    <td>{row.po_number || '-'}</td>
                    <td>{row.supplier_name || row.supplier || '-'}</td>
                    <td>{row.order_date || '-'}</td>
                    <td><span className="badge badge-light text-uppercase">{row.status || '-'}</span></td>
                    <td className="text-right">{formatCurrency(row.total_amount)}</td>
                    <td className="text-right">{formatCurrency(row.amount_paid)}</td>
                    <td className="text-right">{formatCurrency(row.outstanding)}</td>
                  </tr>
                ))}
                {loading && <tr><td colSpan="7" className="text-center py-4">Loading data...</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentsDashboard;
