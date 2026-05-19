import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInventorySummary } from './dashboard';

const formatNumber = (value) => Number(value || 0).toLocaleString('en-LK');
const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const InventoryDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  const kpis = useMemo(() => [
    { title: 'Total Items', value: formatNumber(summary && summary.total_items), tone: 'border-primary' },
    { title: 'Low Stock Items', value: formatNumber(summary && summary.low_stock_count), tone: 'border-warning' },
    { title: 'Out of Stock', value: formatNumber(summary && summary.out_of_stock_count), tone: 'border-danger' },
    { title: 'Total Stock Value', value: formatCurrency(summary && summary.total_stock_value), tone: 'border-success' },
  ], [summary]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getInventorySummary();
      setSummary(res || {});
      setLowStockItems((res && res.low_stock_items) || []);
    } catch (err) {
      setError('Unable to load inventory data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <>
      <div className="page-header-wrp mb-0">
        <div className="title-breadcrumb-wrp d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Inventory Dashboard</h1>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Back to Dashboards</Link>
        </div>
      </div>

      <div className="container-fluid pt-4">
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
            <strong>Low Stock Items</strong>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead className="thead-light">
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th className="text-right">Current Stock</th>
                  <th className="text-right">Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {!loading && lowStockItems.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No low stock items found.</td>
                  </tr>
                )}
                {lowStockItems.map((row, idx) => (
                  <tr key={`${row.item_code || 'row'}-${idx}`}>
                    <td>{row.item_code || '-'}</td>
                    <td>{row.item_name || '-'}</td>
                    <td>{row.category || '-'}</td>
                    <td className="text-right">{formatNumber(row.current_stock)}</td>
                    <td className="text-right">{formatNumber(row.reorder_level)}</td>
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

export default InventoryDashboard;
