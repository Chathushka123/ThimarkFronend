import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import API from '../../../api/API';

// Same restrained palette as the scanning screen itself (ProductionWIPScanningDS.js):
// neutral ink/gray for structure, green/red/amber reserved for what they actually mean.
const C = {
  border: '#dfe3e8',
  ink: '#2b2f36',
  muted: '#6c757d',
  subtleBg: '#f7f8fa',
  success: '#2f9e44',
  successBg: '#f1faf3',
  danger: '#d9363e',
  dangerBg: '#fdf2f2',
  dangerBorder: '#f3b4b8',
  amber: '#e8a33d',
  amberBg: '#fdf6ec',
  amberBorder: '#f2d4a3',
};

const card = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: '4px' };

function formatAge(minutes) {
  if (minutes == null) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function SummaryStat({ label, value, color }) {
  return (
    <div className="p-3 text-center" style={{ ...card, flex: 1, minWidth: '140px' }}>
      <div style={{ fontSize: '12px', color: C.muted, letterSpacing: '0.4px' }}>{label}</div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: color || C.ink }}>{value}</div>
    </div>
  );
}

function AlertRow({ alert }) {
  const isWaiting = alert.type === 'WAITING_ON_UPSTREAM';
  const accent = isWaiting ? C.danger : C.amber;
  const bg = isWaiting ? C.dangerBg : C.amberBg;

  return (
    <div className="p-2 mb-2" style={{ background: bg, borderLeft: `3px solid ${accent}`, borderRadius: '4px' }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong style={{ color: C.ink }}>Bundle #{alert.bundle_id}</strong>
          <span className="ml-2" style={{ fontSize: '12px', color: C.muted }}>
            {alert.operation_description || alert.operation_code} &middot; {alert.direction}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>{formatAge(alert.age_minutes)} ago</span>
      </div>
      <div className="mt-1" style={{ fontSize: '12px', color: C.ink }}>
        {isWaiting ? (
          <>
            {alert.stuck_qty} stuck &mdash; waiting on{' '}
            {alert.source
              ? `${alert.source.operation_description || alert.source.operation_code} (${alert.source.operation_code}) ${alert.source.direction}, released ${alert.source.released} so far`
              : 'the previous step'}
          </>
        ) : (
          <>{alert.outstanding_qty} outstanding in rework since {formatTime(alert.since)}</>
        )}
      </div>
    </div>
  );
}

const WipFloorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    API.get('wipDashboard/floor')
      .then((response) => {
        setData((response.data && response.data.data) || null);
      })
      .catch(() => {
        setError("Couldn't load the floor dashboard — check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stations = (data && data.stations) || [];
  const alerts = (data && data.alerts) || [];
  const teamScoreboard = (data && data.team_scoreboard) || [];

  const totalQueued = stations.reduce((sum, s) => sum + s.queued_qty, 0);
  const totalBlocked = stations.reduce((sum, s) => sum + s.blocked_qty, 0);
  const totalOutstandingRework = stations.reduce((sum, s) => sum + s.outstanding_rework, 0);

  const chartData = stations.map((s) => ({
    name: s.operation_code,
    Queued: s.queued_qty,
    Blocked: s.blocked_qty,
    Rework: s.outstanding_rework,
  }));

  return (
    <div className="container-fluid custom-container-padding">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 style={{ fontSize: '22px', margin: 0, color: C.ink }}>Production Floor Dashboard</h1>
        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
          {data && (
            <span style={{ fontSize: '12px', color: C.muted }}>Updated {formatTime(data.generated_at)}</span>
          )}
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-3" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '4px', color: C.ink }}>
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-center py-5" style={{ color: C.muted }}>Loading floor status&#8230;</div>
      )}

      {data && (
        <>
          <div className="d-flex mb-3" style={{ gap: '12px', flexWrap: 'wrap' }}>
            <SummaryStat label="QUEUED, READY NOW" value={totalQueued} color={C.success} />
            <SummaryStat label="BLOCKED, WAITING UPSTREAM" value={totalBlocked} color={C.danger} />
            <SummaryStat label="OUTSTANDING IN REWORK" value={totalOutstandingRework} color={C.amber} />
            <SummaryStat label="OPEN ALERTS" value={alerts.length} color={alerts.length > 0 ? C.amber : C.ink} />
          </div>

          <div className="row">
            <div className="col-12 col-lg-7 mb-3">
              <div className="p-3 mb-3" style={card}>
                <div style={{ fontWeight: 600, color: C.ink, marginBottom: '8px' }}>Station Snapshot</div>
                {stations.length === 0 ? (
                  <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Nothing currently open on any route.</p>
                ) : (
                  <div style={{ width: '100%', height: '260px' }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Queued" fill={C.success} />
                        <Bar dataKey="Blocked" fill={C.danger} />
                        <Bar dataKey="Rework" fill={C.amber} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="p-3" style={card}>
                <div style={{ fontWeight: 600, color: C.ink, marginBottom: '8px' }}>Today's Team Scoreboard</div>
                {teamScoreboard.length === 0 ? (
                  <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>No scans recorded yet today.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="w-100" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, textAlign: 'left' }}>
                          <th className="py-1">Team</th>
                          <th className="py-1 text-right">Scanned</th>
                          <th className="py-1 text-right">Rejected</th>
                          <th className="py-1 text-right">Rework</th>
                          <th className="py-1 text-right">Reject %</th>
                          <th className="py-1 text-right">Rework %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamScoreboard.map((t) => (
                          <tr key={t.daily_shift_team_id} style={{ borderBottom: `1px solid ${C.subtleBg}` }}>
                            <td className="py-1" style={{ color: C.ink, fontWeight: 600 }}>{t.team_name}</td>
                            <td className="py-1 text-right" style={{ color: C.success }}>{t.scanned_qty}</td>
                            <td className="py-1 text-right" style={{ color: C.danger }}>{t.rejected_qty}</td>
                            <td className="py-1 text-right" style={{ color: C.amber }}>{t.rework_qty}</td>
                            <td className="py-1 text-right" style={{ color: C.muted }}>{t.reject_rate_pct}%</td>
                            <td className="py-1 text-right" style={{ color: C.muted }}>{t.rework_rate_pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-5 mb-3">
              <div className="p-3" style={card}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div style={{ fontWeight: 600, color: C.ink }}>Problem Alerts</div>
                  <span style={{ fontSize: '12px', color: C.muted, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1px 9px' }}>
                    {alerts.length}
                  </span>
                </div>
                {alerts.length === 0 ? (
                  <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Nothing stuck right now.</p>
                ) : (
                  <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
                    {alerts.map((alert, idx) => (
                      <AlertRow key={`${alert.type}-${alert.bundle_ticket_id}-${idx}`} alert={alert} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WipFloorDashboard;
