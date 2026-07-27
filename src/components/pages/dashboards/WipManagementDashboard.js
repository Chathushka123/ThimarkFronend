import React, { useEffect, useState, useCallback } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import API from '../../../api/API';

const C = {
  border: '#dfe3e8',
  ink: '#2b2f36',
  muted: '#6c757d',
  success: '#2f9e44',
  danger: '#d9363e',
  dangerBg: '#fdf2f2',
  dangerBorder: '#f3b4b8',
  amber: '#e8a33d',
};

const card = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: '4px' };

const RANGE_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function SummaryStat({ label, value, color }) {
  return (
    <div className="p-3 text-center" style={{ ...card, flex: 1, minWidth: '160px' }}>
      <div style={{ fontSize: '12px', color: C.muted, letterSpacing: '0.4px' }}>{label}</div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: color || C.ink }}>{value}</div>
    </div>
  );
}

const WipManagementDashboard = () => {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const load = useCallback((rangeDays) => {
    setLoading(true);
    setError('');
    API.get(`wipDashboard/management?days=${rangeDays}`)
      .then((response) => {
        setData((response.data && response.data.data) || null);
      })
      .catch(() => {
        setError("Couldn't load the management dashboard — check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const summary = (data && data.summary) || null;
  const batchBreakdown = (data && data.batch_breakdown) || [];
  const chartData = ((data && data.daily) || []).map((d) => ({
    date: formatDateLabel(d.date),
    Scanned: d.scanned_qty,
    'Reject %': d.reject_rate_pct,
    'Rework %': d.rework_rate_pct,
  }));

  return (
    <div className="container-fluid custom-container-padding">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h1 style={{ fontSize: '22px', margin: 0, color: C.ink }}>Production Management Dashboard</h1>
        <div className="d-flex" style={{ gap: '6px' }}>
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              type="button"
              className="btn btn-sm"
              style={{
                border: `1px solid ${C.border}`,
                background: days === opt.days ? C.ink : '#fff',
                color: days === opt.days ? '#fff' : C.ink,
              }}
              onClick={() => setDays(opt.days)}
              disabled={loading}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 mb-3" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '4px', color: C.ink }}>
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-center py-5" style={{ color: C.muted }}>Loading trend data&#8230;</div>
      )}

      {summary && (
        <>
          <div className="d-flex mb-3" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <SummaryStat label="TOTAL SCANNED" value={summary.total_scanned} color={C.success} />
            <SummaryStat label="TOTAL REJECTED" value={summary.total_rejected} color={C.danger} />
            <SummaryStat label="TOTAL SENT TO REWORK" value={summary.total_rework_sent} color={C.amber} />
            <SummaryStat label="OVERALL REJECT RATE" value={`${summary.overall_reject_rate_pct}%`} color={C.danger} />
            <SummaryStat label="OVERALL REWORK RATE" value={`${summary.overall_rework_rate_pct}%`} color={C.amber} />
          </div>

          <div className="p-3" style={card}>
            <div style={{ fontWeight: 600, color: C.ink, marginBottom: '8px' }}>
              Daily Throughput &amp; Quality Trend ({days} days)
            </div>
            <div style={{ width: '100%', height: '360px' }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="qty" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="qty" dataKey="Scanned" fill={C.success} barSize={16} />
                  <Line yAxisId="pct" type="monotone" dataKey="Reject %" stroke={C.danger} strokeWidth={2} dot={false} />
                  <Line yAxisId="pct" type="monotone" dataKey="Rework %" stroke={C.amber} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 mt-3" style={card}>
            <div style={{ fontWeight: 600, color: C.ink, marginBottom: '8px' }}>
              Production by Main Model / Model / Batch ({days} days)
            </div>
            {batchBreakdown.length === 0 ? (
              <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>No production recorded in this window.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="w-100" style={{ fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, textAlign: 'left' }}>
                      <th className="py-1">Main Model</th>
                      <th className="py-1">Model</th>
                      <th className="py-1">Batch</th>
                      <th className="py-1 text-right">Scanned</th>
                      <th className="py-1 text-right">Rejected</th>
                      <th className="py-1 text-right">Rework</th>
                      <th className="py-1 text-right">Reject %</th>
                      <th className="py-1 text-right">Rework %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchBreakdown.map((b) => (
                      <tr key={`${b.batch_id}-${b.model_id}`} style={{ borderBottom: '1px solid #f7f8fa' }}>
                        <td className="py-1" style={{ color: C.ink }}>{b.main_model_name || '—'}</td>
                        <td className="py-1" style={{ color: C.ink, fontWeight: 600 }}>{b.model_name || '—'}</td>
                        <td className="py-1" style={{ color: C.muted }}>{b.batch_no || '—'}</td>
                        <td className="py-1 text-right" style={{ color: C.success }}>{b.scanned_qty}</td>
                        <td className="py-1 text-right" style={{ color: C.danger }}>{b.rejected_qty}</td>
                        <td className="py-1 text-right" style={{ color: C.amber }}>{b.rework_qty}</td>
                        <td className="py-1 text-right" style={{ color: C.muted }}>{b.reject_rate_pct}%</td>
                        <td className="py-1 text-right" style={{ color: C.muted }}>{b.rework_rate_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WipManagementDashboard;
