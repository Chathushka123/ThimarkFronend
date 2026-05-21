import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import * as XLSX from 'xlsx';
import { getFilteredPOSummary } from './dashboard';

// ─── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => `LKR ${fmt(n)}`;
const fmtN = (n) => Number(n || 0).toLocaleString('en-LK');
const fmtM = (v) => {
  const abs = Math.abs(Number(v || 0));
  if (abs >= 1_000_000) return `${(Number(v) / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(Number(v) / 1_000).toFixed(0)}K`;
  return String(Number(v || 0).toFixed(0));
};

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  DRAFT: { color: '#718096', light: '#f7fafc', label: 'Draft', icon: 'fa-edit' },
  OPEN: { color: '#00838f', light: '#e0f7fa', label: 'Open', icon: 'fa-folder-open' },
  'PENDING APPROVAL': { color: '#f9a825', light: '#fffde7', label: 'Pending Approval', icon: 'fa-hourglass-half' },
  APPROVED: { color: '#1565c0', light: '#e3f2fd', label: 'Approved', icon: 'fa-clipboard-check' },
  SENT: { color: '#6a1fb5', light: '#f3e8ff', label: 'Sent', icon: 'fa-paper-plane' },
  RECEIVED: { color: '#2e7d32', light: '#e8f5e9', label: 'Received', icon: 'fa-truck-loading' },
  CLOSED: { color: '#37474f', light: '#eceff1', label: 'Closed', icon: 'fa-lock' },
  CANCELLED: { color: '#b71c1c', light: '#fff5f5', label: 'Cancelled', icon: 'fa-times-circle' },
};
const getCfg = (s) => STATUS_CFG[s] || { color: '#718096', light: '#f7fafc', label: s, icon: 'fa-circle' };
const CHART_PALETTE = ['#1565c0', '#6a1fb5', '#2e7d32', '#e65100', '#b71c1c', '#00838f', '#f9a825', '#37474f'];
const DATE_FIELDS = [
  { value: 'created_at', label: 'PO Created Date' },
  { value: 'order_date', label: 'Order Date' },
  { value: 'expected_delivery_date', label: 'Ex-Mill Date' },
];
const today = new Date().toISOString().slice(0, 10);
const yearStart = `${new Date().getFullYear()}-01-01`;

// ─── Shared cell styles ────────────────────────────────────────────────────────
const TH = {
  padding: '10px 13px', textAlign: 'left', fontSize: '11px', fontWeight: '700',
  color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px',
  borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap', background: '#f8f9fb',
};
const TD = {
  padding: '10px 13px', borderBottom: '1px solid #edf2f7', verticalAlign: 'middle',
  fontSize: '12.5px',
};

// ─── Custom tooltip for recharts ───────────────────────────────────────────────
const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontWeight: '700', marginBottom: '6px', color: '#1a202c' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: '3px' }}>
          {p.name}: <strong>LKR {fmtN(p.value)}</strong>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const AllPODashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  // ── Filter state ──
  const [dateFrom, setDateFrom] = useState(yearStart);
  const [dateTo, setDateTo] = useState(today);
  const [dateField, setDateField] = useState('expected_delivery_date');
  const [filterStatuses, setFilterStatuses] = useState(['APPROVED', 'SENT', 'RECEIVED']);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    const allPOs = dataKeys.flatMap((s) => data[s]?.po_details || []);
    const stamp = new Date().toLocaleString('en-LK');
    const setColWidths = (ws, widths) => { ws['!cols'] = widths.map((w) => ({ wch: w })); };

    // ── Sheet 1: Summary ──────────────────────────────────────────────────────
    const summaryTotals = dataKeys.reduce(
      (acc, s) => {
        const sd = data[s] || {};
        acc.pos += sd.no_of_pos || 0;
        acc.qty += sd.total_qty_all_pos || 0;
        acc.amount += sd.total_amount_all_pos || 0;
        acc.balance += sd.total_balance_all_pos || 0;
        return acc;
      },
      { pos: 0, qty: 0, amount: 0, balance: 0 }
    );
    const dateFieldLabel = DATE_FIELDS.find((d) => d.value === dateField)?.label || dateField;
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['PROCUREMENT DASHBOARD — FILTERED PO SUMMARY'],
      [`Generated: ${stamp}`],
      [`Date Field: ${dateFieldLabel}   From: ${dateFrom}   To: ${dateTo}`],
      [`Statuses: ${dataKeys.map((s) => getCfg(s).label).join(', ')}`],
      [],
      ['Status', 'No. of POs', 'Total Qty', 'Total Amount (LKR)', 'Total Balance (LKR)'],
      ...dataKeys.map((s) => {
        const sd = data[s] || {};
        return [
          getCfg(s).label,
          sd.no_of_pos || 0,
          sd.total_qty_all_pos || 0,
          sd.total_amount_all_pos || 0,
          sd.total_balance_all_pos || 0,
        ];
      }),
      [],
      ['TOTAL', summaryTotals.pos, summaryTotals.qty, summaryTotals.amount, summaryTotals.balance],
    ]);
    setColWidths(ws1, [30, 14, 14, 22, 22]);
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // ── Sheet 2: Purchase Orders ──────────────────────────────────────────────
    const ws2 = XLSX.utils.aoa_to_sheet([
      ['PO Number', 'Supplier', 'Status', 'Order Date', 'Exp. Delivery',
        'Payment Date', 'In House Date', 'Total Qty',
        'Subtotal (LKR)', 'Discount (LKR)', 'Tax (LKR)', 'Shipping (LKR)',
        'Total Amount (LKR)', 'Paid Amount (LKR)', 'Balance (LKR)',
        'Notes', 'Created By', 'Created At'],
      ...allPOs.map((po) => [
        po.po_number || '',
        po.supplier_name || '',
        po.status || '',
        po.order_date || '',
        po.expected_delivery_date || '',
        po.payment_date || '',
        po.in_house_date || '',
        po.po_qty?.qty || 0,
        po.subtotal || 0,
        po.discount || 0,
        po.tax || 0,
        po.shipping_cost || 0,
        po.total_amount?.amount || 0,
        po.paid_amount?.amount || 0,
        po.balance?.amount || 0,
        po.notes || '',
        po.created_by || '',
        po.created_at || '',
      ]),
    ]);
    setColWidths(ws2, [22, 28, 12, 14, 14, 14, 14, 12, 18, 16, 14, 16, 20, 20, 18, 30, 16, 20]);
    XLSX.utils.book_append_sheet(wb, ws2, 'Purchase Orders');

    // ── Sheet 3: Items Breakdown ──────────────────────────────────────────────
    const itemRows = [
      ['PO Number', 'Supplier', 'Status', 'Material', 'Qty', 'Unit Price (LKR)', 'Line Total (LKR)'],
    ];
    allPOs.forEach((po) => {
      const amtBreak = po.total_amount?.breakdown || [];
      const qtyBreak = po.po_qty?.breakdown || [];
      if (amtBreak.length === 0) {
        itemRows.push([po.po_number, po.supplier_name, po.status, '—', 0, 0, 0]);
      } else {
        amtBreak.forEach((item, i) => {
          itemRows.push([
            po.po_number || '',
            po.supplier_name || '',
            po.status || '',
            item.material_name || '',
            qtyBreak[i]?.qty || 0,
            item.unit_price || 0,
            item.total || 0,
          ]);
        });
      }
    });
    const ws3 = XLSX.utils.aoa_to_sheet(itemRows);
    setColWidths(ws3, [22, 28, 12, 30, 12, 18, 18]);
    XLSX.utils.book_append_sheet(wb, ws3, 'Items Breakdown');

    // ── Sheet 4: Payment History ──────────────────────────────────────────────
    const payRows = [
      ['PO Number', 'Supplier', 'PO Status', 'PO Total Amount (LKR)', 'PO Balance (LKR)', 'Payment Date', 'Payment Amount (LKR)', 'Note'],
    ];
    allPOs.forEach((po) => {
      const payments = po.paid_amount?.breakdown || [];
      if (payments.length === 0) {
        payRows.push([
          po.po_number || '', po.supplier_name || '', po.status || '',
          po.total_amount?.amount || 0, po.balance?.amount || 0,
          '', '', 'No payments recorded',
        ]);
      } else {
        payments.forEach((p) => {
          payRows.push([
            po.po_number || '',
            po.supplier_name || '',
            po.status || '',
            po.total_amount?.amount || 0,
            po.balance?.amount || 0,
            p.payment_date?.slice(0, 10) || '',
            p.amount || 0,
            p.note || '',
          ]);
        });
      }
    });
    const ws4 = XLSX.utils.aoa_to_sheet(payRows);
    setColWidths(ws4, [22, 28, 12, 22, 18, 14, 22, 30]);
    XLSX.utils.book_append_sheet(wb, ws4, 'Payment History');

    XLSX.writeFile(wb, `PO-Dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadData = async () => {
    if (filterStatuses.length === 0) { setError('Select at least one status.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await getFilteredPOSummary({
        statuses: filterStatuses,
        dateField,
        from: dateFrom,
        to: dateTo,
      });
      const payload = res?.data ?? res ?? {};
      setData(payload);
      setSelected(Object.keys(payload)); // show all returned statuses by default
    } catch {
      setError('Unable to load procurement dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  // ── Interactions ──────────────────────────────────────────────────────────
  const toggleStatus = (s) =>
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleRow = (id) =>
    setExpandedRows((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // ── Derived data ──────────────────────────────────────────────────────────
  const dataKeys = useMemo(() => Object.keys(data || {}), [data]);

  const filteredPOs = useMemo(() =>
    selected.flatMap((s) => data?.[s]?.po_details || []),
    [data, selected]);

  const statusChartData = useMemo(() =>
    dataKeys.map((s) => ({
      name: getCfg(s).label,
      status: s,
      count: data[s]?.no_of_pos || 0,
    })),
    [data, dataKeys]);

  const financialData = useMemo(() =>
    dataKeys.map((s) => {
      const pos = data[s]?.po_details || [];
      return {
        name: getCfg(s).label,
        Amount: pos.reduce((acc, po) => acc + (po.total_amount?.amount || 0), 0),
        Paid: pos.reduce((acc, po) => acc + (po.paid_amount?.amount || 0), 0),
        Balance: pos.reduce((acc, po) => acc + Math.max(0, po.balance?.amount || 0), 0),
      };
    }),
    [data, dataKeys]);

  const supplierData = useMemo(() => {
    if (!data) return [];
    const map = {};
    Object.values(data).forEach((sd) =>
      (sd?.po_details || []).forEach((po) => {
        const n = po.supplier_name || 'Unknown';
        map[n] = (map[n] || 0) + (po.total_amount?.amount || 0);
      })
    );
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [data]);

  const totals = useMemo(() => {
    const all = data ? Object.values(data).flatMap((d) => d?.po_details || []) : [];
    return {
      count: all.length,
      amount: all.reduce((s, p) => s + (p.total_amount?.amount || 0), 0),
      paid: all.reduce((s, p) => s + (p.paid_amount?.amount || 0), 0),
      balance: all.reduce((s, p) => s + (p.balance?.amount || 0), 0),
    };
  }, [data]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", background: '#f0f2f8', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #000841 0%, #0d1b8e 100%)', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '19px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-shopping-cart"></i> Purchase Order Dashboard
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginTop: '2px' }}>
            Active Purchase Orders &mdash; Approved · Sent · Received
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={loadData} disabled={loading} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '7px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            <i className="fas fa-sync-alt" style={{ marginRight: '6px' }}></i>{loading ? 'Loading…' : 'Refresh'}
          </button>
          <button onClick={exportToExcel} disabled={!data || loading} style={{ background: '#1b5e20', color: '#fff', border: '1px solid #2e7d32', borderRadius: '6px', padding: '7px 16px', fontSize: '12px', fontWeight: '600', cursor: !data || loading ? 'not-allowed' : 'pointer', opacity: !data || loading ? 0.5 : 1 }}>
            <i className="fas fa-file-excel" style={{ marginRight: '6px' }}></i>Export Excel
          </button>
          <Link to="/dashboard" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '7px 16px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
            ← Back
          </Link>
        </div>
      </div>

      <div style={{ padding: '22px 28px' }}>

        {/* ── Error ── */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#c53030', fontSize: '13px' }}><i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>{error}</span>
            <button onClick={loadData} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '5px', padding: '5px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Retry</button>
          </div>
        )}

        {/* ── Filter Panel ── */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '18px 22px', marginBottom: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
            <i className="fas fa-sliders-h" style={{ marginRight: '6px' }}></i>Filters
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 150px 150px 1fr auto', gap: '12px', alignItems: 'end' }}>

            {/* Date field */}
            <div>
              <div style={{ fontSize: '10px', color: '#4a5568', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '5px' }}>DATE FIELD</div>
              <select
                value={dateField}
                onChange={(e) => setDateField(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '12px', color: '#1a202c', background: '#fff', outline: 'none' }}
              >
                {DATE_FIELDS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            {/* From */}
            <div>
              <div style={{ fontSize: '10px', color: '#4a5568', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '5px' }}>FROM</div>
              <input
                type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '12px', color: '#1a202c', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* To */}
            <div>
              <div style={{ fontSize: '10px', color: '#4a5568', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '5px' }}>TO</div>
              <input
                type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '12px', color: '#1a202c', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Status pills */}
            <div>
              <div style={{ fontSize: '10px', color: '#4a5568', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '7px' }}>STATUSES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {Object.keys(STATUS_CFG).map((s) => {
                  const cfg = STATUS_CFG[s];
                  const active = filterStatuses.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilterStatuses((prev) =>
                        active ? prev.filter((x) => x !== s) : [...prev, s]
                      )}
                      style={{
                        padding: '4px 11px', borderRadius: '20px', fontSize: '10.5px', fontWeight: '700',
                        cursor: 'pointer', transition: 'all 0.12s',
                        background: active ? cfg.color : '#fff',
                        color: active ? '#fff' : cfg.color,
                        border: `1.5px solid ${cfg.color}`,
                      }}
                    >
                      {active && <i className="fas fa-check" style={{ fontSize: '9px', marginRight: '4px' }}></i>}
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply */}
            <div>
              <button
                onClick={loadData}
                disabled={loading || filterStatuses.length === 0}
                style={{
                  padding: '9px 22px', background: '#000841', color: '#fff', border: 'none',
                  borderRadius: '6px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
                  cursor: loading || filterStatuses.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: loading || filterStatuses.length === 0 ? 0.55 : 1,
                }}
              >
                <i className="fas fa-search" style={{ marginRight: '6px' }}></i>
                {loading ? 'Loading…' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Status Cards (multi-select) ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
            <i className="fas fa-filter" style={{ marginRight: '6px' }}></i>Filter by Status &mdash; click to toggle
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {(dataKeys.length > 0 ? dataKeys : Object.keys(STATUS_CFG)).map((s) => {
              const cfg = getCfg(s);
              const sd = data?.[s] || {};
              const isOn = selected.includes(s);
              return (
                <div
                  key={s}
                  onClick={() => toggleStatus(s)}
                  style={{
                    background: isOn ? cfg.light : '#fff',
                    border: `2.5px solid ${isOn ? cfg.color : '#e2e8f0'}`,
                    borderRadius: '14px',
                    padding: '20px 22px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'box-shadow 0.15s, border-color 0.15s',
                    boxShadow: isOn ? `0 6px 20px ${cfg.color}30` : '0 1px 5px rgba(0,0,0,0.06)',
                    position: 'relative',
                  }}
                >
                  {/* Checkbox corner */}
                  <div style={{ position: 'absolute', top: '14px', right: '14px', width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${isOn ? cfg.color : '#cbd5e0'}`, background: isOn ? cfg.color : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
                    {isOn && <i className="fas fa-check" style={{ fontSize: '10px', color: '#fff' }}></i>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fas ${cfg.icon}`} style={{ color: cfg.color, fontSize: '14px' }}></i>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: cfg.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{cfg.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '42px', fontWeight: '900', color: cfg.color, lineHeight: 1 }}>{loading ? '–' : fmtN(sd.no_of_pos)}</span>
                    <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600' }}>POs</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: 'TOTAL VALUE', value: sd.total_amount_all_pos },
                      { label: 'BALANCE', value: sd.total_balance_all_pos },
                    ].map((k) => (
                      <div key={k.label} style={{ background: 'rgba(255,255,255,0.75)', borderRadius: '7px', padding: '7px 10px' }}>
                        <div style={{ fontSize: '9px', color: '#888', fontWeight: '700', letterSpacing: '0.5px' }}>{k.label}</div>
                        <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#1a202c', fontFamily: 'monospace', marginTop: '2px' }}>
                          {loading ? '…' : `LKR ${Number(k.value || 0).toLocaleString('en-LK', { maximumFractionDigits: 0 })}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '22px' }}>
          {[
            { label: 'Total Active POs', value: fmtN(totals.count), icon: 'fa-file-alt', accent: '#4a5568' },
            { label: 'Total PO Value', value: fmtK(totals.amount), icon: 'fa-coins', accent: '#1565c0' },
            { label: 'Total Paid', value: fmtK(totals.paid), icon: 'fa-check-circle', accent: '#2e7d32' },
            { label: 'Outstanding Balance', value: fmtK(totals.balance), icon: 'fa-balance-scale', accent: '#e65100' },
          ].map((k) => (
            <div key={k.label} style={{ background: '#fff', borderRadius: '10px', padding: '14px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderLeft: `4px solid ${k.accent}` }}>
              <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>
                <i className={`fas ${k.icon}`} style={{ marginRight: '5px', color: k.accent }}></i>{k.label}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', fontFamily: 'monospace' }}>
                {loading ? '…' : k.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        {!loading && data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '18px', marginBottom: '18px' }}>

              {/* Bar: Amount vs Paid vs Balance */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a202c', marginBottom: '16px' }}>
                  <i className="fas fa-chart-bar" style={{ marginRight: '8px', color: '#1565c0' }}></i>
                  Financial Overview by Status
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={financialData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={fmtM} />
                    <Tooltip content={<CurrencyTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Amount" fill="#1565c0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Paid" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Balance" fill="#e65100" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut: PO Count */}
              <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a202c', marginBottom: '16px' }}>
                  <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#6a1fb5' }}></i>
                  PO Count Distribution
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: '0 0 140px' }}>
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={statusChartData.filter((d) => d.count > 0)} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={4}>
                          {statusChartData.map((entry) => (
                            <Cell key={entry.status} fill={getCfg(entry.status).color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, `${n} POs`]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1 }}>
                    {statusChartData.map((d) => (
                      <div key={d.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '11px', height: '11px', borderRadius: '3px', background: getCfg(d.status).color, flexShrink: 0 }}></div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600' }}>{d.name}</div>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: getCfg(d.status).color, lineHeight: 1.1 }}>{d.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal bar: Top Suppliers */}
            {supplierData.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '22px' }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#1a202c', marginBottom: '16px' }}>
                  <i className="fas fa-truck" style={{ marginRight: '8px', color: '#e65100' }}></i>
                  Top Suppliers by Total PO Value
                </div>
                <ResponsiveContainer width="100%" height={Math.max(160, supplierData.length * 34)}>
                  <BarChart data={supplierData} layout="vertical" margin={{ left: 0, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={fmtM} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={170} />
                    <Tooltip formatter={(v) => [`LKR ${fmt(v)}`, 'Total Value']} />
                    <Bar dataKey="amount" radius={[0, 5, 5, 0]}>
                      {supplierData.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* ── PO Table with collapsible rows ── */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Table header bar */}
          <div style={{ background: 'linear-gradient(135deg, #000841 0%, #1a237e 100%)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>
              <i className="fas fa-list-ul" style={{ marginRight: '8px' }}></i>
              Purchase Order Details
              <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', marginLeft: '10px', fontWeight: '600' }}>
                {filteredPOs.length} records
              </span>
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
              <i className="fas fa-hand-pointer" style={{ marginRight: '4px' }}></i>Click a row to expand details
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...TH, width: '36px' }}></th>
                  <th style={TH}>PO Number</th>
                  <th style={TH}>Supplier</th>
                  <th style={TH}>Order Date</th>
                  <th style={TH}>Exp. Delivery</th>
                  <th style={TH}>Status</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Total Qty</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Amount (LKR)</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Paid (LKR)</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Balance (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '13px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Loading data…
                  </td></tr>
                )}
                {!loading && filteredPOs.length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#aaa', fontSize: '13px' }}>
                    <i className="fas fa-inbox" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                    No records for the selected statuses.
                  </td></tr>
                )}

                {filteredPOs.map((po, idx) => {
                  const exp = expandedRows.has(po.id);
                  const balance = po.balance?.amount || 0;
                  const balColor = balance > 0 ? '#e65100' : balance < 0 ? '#2e7d32' : '#718096';
                  const rowBg = idx % 2 === 0 ? '#fff' : '#fafbfc';
                  const sCfg = getCfg(po.status);
                  const qtyBreak = po.po_qty?.breakdown || [];
                  const amtBreak = po.total_amount?.breakdown || [];
                  const payBreak = po.paid_amount?.breakdown || [];

                  return (
                    <React.Fragment key={po.id}>
                      <tr
                        onClick={() => toggleRow(po.id)}
                        style={{ background: rowBg, cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#eff3ff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = rowBg}
                      >
                        <td style={{ ...TD, textAlign: 'center' }}>
                          <i className={`fas fa-chevron-${exp ? 'up' : 'down'}`} style={{ fontSize: '10px', color: '#a0aec0' }}></i>
                        </td>
                        <td style={{ ...TD, fontWeight: '700', color: '#000841' }}>{po.po_number}</td>
                        <td style={TD}>{po.supplier_name || '—'}</td>
                        <td style={TD}>{po.order_date || '—'}</td>
                        <td style={TD}>{po.expected_delivery_date || '—'}</td>
                        <td style={TD}>
                          <span style={{ background: `${sCfg.color}18`, color: sCfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            {po.status}
                          </span>
                        </td>
                        <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace' }}>{fmtN(po.po_qty?.qty)}</td>
                        <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: '700' }}>{fmt(po.total_amount?.amount)}</td>
                        <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', color: '#2e7d32' }}>{fmt(po.paid_amount?.amount)}</td>
                        <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: balColor }}>{fmt(balance)}</td>
                      </tr>

                      {exp && (
                        <tr>
                          <td colSpan={10} style={{ padding: 0, background: '#f0f4ff', borderBottom: '2px solid #c5cae9' }}>
                            <div style={{ padding: '16px 20px 16px 48px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                                {/* Items breakdown */}
                                <div>
                                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    <i className="fas fa-boxes" style={{ marginRight: '5px', color: '#1565c0' }}></i>Items Breakdown
                                  </div>
                                  <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                                    <thead>
                                      <tr style={{ background: '#e8eaf6' }}>
                                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Material</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Qty</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Unit Price</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {amtBreak.length === 0
                                        ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '12px', color: '#aaa', fontSize: '11px' }}>No items</td></tr>
                                        : amtBreak.map((item, i) => (
                                          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f7f8fc' }}>
                                            <td style={{ padding: '6px 10px', color: '#2d3748' }}>{item.material_name || '—'}</td>
                                            <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmtN(qtyBreak[i]?.qty)}</td>
                                            <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{fmt(item.unit_price)}</td>
                                            <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700' }}>{fmt(item.total)}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Payment details */}
                                <div>
                                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                                    <i className="fas fa-money-bill-wave" style={{ marginRight: '5px', color: '#2e7d32' }}></i>Payment Details
                                  </div>

                                  {/* Meta row */}
                                  <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div>
                                      <div style={{ fontSize: '9px', color: '#888', fontWeight: '700', letterSpacing: '0.5px' }}>PAYMENT DATE</div>
                                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>{po.payment_date || '—'}</div>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '9px', color: '#888', fontWeight: '700', letterSpacing: '0.5px' }}>IN HOUSE DATE</div>
                                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>{po.in_house_date || '—'}</div>
                                    </div>
                                    {po.notes && (
                                      <div style={{ gridColumn: '1/-1', background: '#fffde7', border: '1px solid #ffe082', borderRadius: '5px', padding: '5px 10px', fontSize: '11px', color: '#555' }}>
                                        <strong>Notes:</strong> {po.notes}
                                      </div>
                                    )}
                                  </div>

                                  {/* Payments table */}
                                  <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                                    <thead>
                                      <tr style={{ background: '#e8f5e9' }}>
                                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Date</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Amount</th>
                                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: '700', color: '#4a5568', fontSize: '11px' }}>Note</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {payBreak.length === 0
                                        ? <tr><td colSpan={3} style={{ textAlign: 'center', padding: '12px', color: '#aaa', fontSize: '11px' }}>No payments recorded</td></tr>
                                        : payBreak.map((p, i) => (
                                          <tr key={p.id || i} style={{ background: i % 2 === 0 ? '#fff' : '#f7fdf8' }}>
                                            <td style={{ padding: '6px 10px', color: '#2d3748' }}>{p.payment_date?.slice(0, 10) || '—'}</td>
                                            <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: '#2e7d32' }}>{fmt(p.amount)}</td>
                                            <td style={{ padding: '6px 10px', color: '#718096' }}>{p.note || '—'}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                    {payBreak.length > 0 && (
                                      <tfoot>
                                        <tr style={{ background: '#f0f9f0', borderTop: '2px solid #c8e6c9' }}>
                                          <td style={{ padding: '7px 10px', fontWeight: '700', fontSize: '11.5px', color: '#1a202c' }}>Total Paid</td>
                                          <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '800', color: '#2e7d32', fontSize: '12px' }}>
                                            {fmt(po.paid_amount?.amount)}
                                          </td>
                                          <td></td>
                                        </tr>
                                        <tr style={{ background: '#fff3e0', borderTop: '1px solid #ffcc80' }}>
                                          <td style={{ padding: '7px 10px', fontWeight: '700', fontSize: '11.5px', color: '#1a202c' }}>Balance</td>
                                          <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '800', color: balColor, fontSize: '12px' }}>
                                            {fmt(balance)}
                                          </td>
                                          <td></td>
                                        </tr>
                                      </tfoot>
                                    )}
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllPODashboard;
