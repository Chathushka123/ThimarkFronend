import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import API from '../../../api/API';
import {
  C, ACCENT, card, sectionCard, styleSheet,
  IconLayers, IconAlertTriangle, IconRotateCcw, IconBell, IconRefreshCw, IconDownload, IconMaximize, IconMinimize, IconChevronRight, IconBarChart, IconActivity, IconGrid,
  formatTime, efficiencyColor, darken, SectionHeader, EmptyState, Modal, TeamMetricHeatmap, exportButtonStyle, useAutoScrollX,
} from './wipDashboardUI';
import {
  ExcelJS, XLS_ACCENT, addTableSheet, addOverviewSheet, downloadWorkbook,
} from './wipDashboardExport';

function formatAge(minutes) {
  if (minutes == null) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function AlertRow({ alert }) {
  const isWaiting = alert.type === 'WAITING_ON_UPSTREAM';
  const accent = isWaiting ? C.danger : C.amber;
  const chipBg = isWaiting ? C.dangerBg : C.amberBg;

  return (
    <div className="p-2 mb-2 d-flex" style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${accent}`, borderRadius: '8px', gap: '10px' }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px', background: chipBg, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
      }}>
        {isWaiting ? <IconAlertTriangle size={15} /> : <IconRotateCcw size={15} />}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <strong style={{ color: C.ink }}>Bundle #{alert.bundle_id}</strong>
            <span className="ml-2" style={{ fontSize: '12px', color: C.muted }}>
              {alert.operation_description || alert.operation_code} &middot; {alert.direction}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: accent, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatAge(alert.age_minutes)} ago</span>
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
    </div>
  );
}

// The TV grid's "teams" row is a fixed, short strip (see tvGridCss), so
// this card is deliberately dense rather than the roomier tile a normal
// (non-kiosk) dashboard page would use.
function TeamCard({ team, onOpen }) {
  const eff = efficiencyColor(team.efficiency_pct);
  return (
    <div
      className="wfd-hover"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(team)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(team); }}
      style={{
        ...card, cursor: 'pointer', height: '100%', minWidth: '190px', borderTop: `3px solid ${eff.color}`,
        padding: '9px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box',
      }}
      title="Click for this team's main model / model / batch WIP breakdown"
    >
      <div className="d-flex justify-content-between align-items-start">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: '13.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {team.team_name || 'Unassigned Team'}
          </div>
          <div style={{ fontSize: '10.5px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {team.operation_description || team.operation_code || 'No operation'}
          </div>
        </div>
        <IconChevronRight size={13} color={C.faint} />
      </div>
      <div className="d-flex align-items-baseline" style={{ gap: '14px' }}>
        <div>
          <span style={{ fontSize: '21px', fontWeight: 800, color: ACCENT.teams, lineHeight: 1 }}>{team.wip_qty}</span>
          <span style={{ fontSize: '9.5px', color: C.muted, marginLeft: '4px', letterSpacing: '0.3px' }}>WIP</span>
        </div>
        <div>
          <span style={{ fontSize: '21px', fontWeight: 800, color: eff.color, lineHeight: 1 }}>{team.efficiency_pct}%</span>
          <span style={{ fontSize: '9.5px', color: C.muted, marginLeft: '4px', letterSpacing: '0.3px' }}>EFF</span>
        </div>
      </div>
      <div className="d-flex" style={{ gap: '8px', fontSize: '10px', color: C.muted }}>
        <span>Scanned <strong style={{ color: C.ink }}>{team.scanned_qty}</strong></span>
        <span style={{ color: C.danger }}>Rej {team.reject_rate_pct}%</span>
        <span style={{ color: C.amber }}>Rwk {team.rework_rate_pct}%</span>
      </div>
    </div>
  );
}

function TeamBatchModal({ team, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    API.get(`wipDashboard/teamBatchSummary?daily_shift_team_id=${team.daily_shift_team_id}`)
      .then((response) => {
        setBatches((response.data && response.data.data && response.data.data.batches) || []);
      })
      .catch(() => setError("Couldn't load this team's batch breakdown."))
      .finally(() => setLoading(false));
  }, [team.daily_shift_team_id]);

  return (
    <Modal
      title={`${team.team_name || 'Unassigned Team'} — WIP by Batch`}
      subtitle={team.operation_description || team.operation_code || 'No operation assigned'}
      onClose={onClose}
    >
      {loading && <p style={{ color: C.muted, fontSize: '13px' }}>Loading&#8230;</p>}
      {error && <p style={{ color: C.danger, fontSize: '13px' }}>{error}</p>}
      {!loading && !error && (
        batches.length === 0 ? (
          <EmptyState>Nothing scanned by this team today.</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-100" style={{ fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint, textAlign: 'left' }}>
                  <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Main Model</th>
                  <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Model</th>
                  <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Batch</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Scanned</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rejected</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rework</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>WIP</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={`${b.batch_id}-${b.model_id}`} style={{ borderBottom: `1px solid ${C.subtleBg}` }}>
                    <td className="py-2" style={{ color: C.ink }}>{b.main_model_name || '—'}</td>
                    <td className="py-2" style={{ color: C.ink, fontWeight: 600 }}>{b.model_name || '—'}</td>
                    <td className="py-2" style={{ color: C.muted }}>{b.batch_no || '—'}</td>
                    <td className="py-2 text-right">{b.scanned_qty}</td>
                    <td className="py-2 text-right" style={{ color: C.danger }}>{b.rejected_qty}</td>
                    <td className="py-2 text-right" style={{ color: C.amber }}>{b.rework_qty}</td>
                    <td className="py-2 text-right" style={{ color: C.ink, fontWeight: 700 }}>{b.wip_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </Modal>
  );
}

function BundleDetailModal({ batch, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bundles, setBundles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    API.get(`wipDashboard/batchBundles?batch_id=${batch.batch_id}&model_id=${batch.model_id}`)
      .then((response) => {
        setBundles((response.data && response.data.data && response.data.data.bundles) || []);
      })
      .catch(() => setError("Couldn't load bundle details for this batch."))
      .finally(() => setLoading(false));
  }, [batch.batch_id, batch.model_id]);

  return (
    <Modal
      title={`Batch ${batch.batch_no || '—'} — Bundle Details`}
      subtitle={`${batch.main_model_name || '—'} / ${batch.model_name || '—'}`}
      onClose={onClose}
      maxWidth="760px"
    >
      {loading && <p style={{ color: C.muted, fontSize: '13px' }}>Loading&#8230;</p>}
      {error && <p style={{ color: C.danger, fontSize: '13px' }}>{error}</p>}
      {!loading && !error && (
        bundles.length === 0 ? (
          <EmptyState>Nothing currently outstanding in this batch.</EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="w-100" style={{ fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint, textAlign: 'left' }}>
                  <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Bundle</th>
                  <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Size</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Qty</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Queued</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Blocked</th>
                  <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rework</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {bundles.map((b) => (
                  <React.Fragment key={b.bundle_id}>
                    <tr
                      className="wfd-row"
                      style={{ borderBottom: `1px solid ${C.subtleBg}`, cursor: 'pointer' }}
                      onClick={() => setExpandedId(expandedId === b.bundle_id ? null : b.bundle_id)}
                    >
                      <td className="py-2" style={{ color: C.ink, fontWeight: 600 }}>#{b.bundle_id}</td>
                      <td className="py-2" style={{ color: C.muted }}>{b.size || '—'}</td>
                      <td className="py-2 text-right">{b.qty}</td>
                      <td className="py-2 text-right" style={{ color: C.success }}>{b.queued_qty}</td>
                      <td className="py-2 text-right" style={{ color: C.danger }}>{b.blocked_qty}</td>
                      <td className="py-2 text-right" style={{ color: C.amber }}>{b.outstanding_rework}</td>
                      <td className="py-2 text-right" style={{ color: C.faint, fontSize: '11px' }}>
                        {expandedId === b.bundle_id ? '▲ hide' : '▼ tickets'}
                      </td>
                    </tr>
                    {expandedId === b.bundle_id && (
                      <tr>
                        <td colSpan={7} style={{ background: C.subtleBg, padding: '10px 14px' }}>
                          <table className="w-100" style={{ fontSize: '12px' }}>
                            <thead>
                              <tr style={{ color: C.faint, textAlign: 'left' }}>
                                <th className="py-1">Operation</th>
                                <th className="py-1">Direction</th>
                                <th className="py-1 text-right">Queued</th>
                                <th className="py-1 text-right">Blocked</th>
                                <th className="py-1 text-right">Rework</th>
                              </tr>
                            </thead>
                            <tbody>
                              {b.tickets.map((t) => (
                                <tr key={t.bundle_ticket_id}>
                                  <td className="py-1" style={{ color: C.ink }}>{t.operation_description || t.operation_code}</td>
                                  <td className="py-1" style={{ color: C.muted }}>{t.direction}</td>
                                  <td className="py-1 text-right" style={{ color: C.success }}>{t.queued_qty}</td>
                                  <td className="py-1 text-right" style={{ color: C.danger }}>{t.blocked_qty}</td>
                                  <td className="py-1 text-right" style={{ color: C.amber }}>{t.outstanding_rework}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </Modal>
  );
}

// A dense-grid panel: accent-bordered card, compact pinned header, and a
// body that scrolls internally — the building block the TV/kiosk layout
// below is made of, so no single panel's content can force the whole page
// to scroll (only the panel itself scrolls, same idea as the heatmap grid).
function Panel({
  area, accent, title, icon, right, children, autoScrollX = false, autoScrollY = false,
}) {
  const scrollRef = useAutoScrollX(autoScrollX || autoScrollY, { axis: autoScrollY ? 'y' : 'x' });
  return (
    <div style={{
      ...sectionCard(accent), gridArea: area, padding: '10px 14px',
      display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
    }}
    >
      <SectionHeader title={title} icon={icon} accent={accent} right={right} compact />
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// Grid for the "everything visible on one TV/laptop screen, no page
// scroll" floor layout: a thin team-cards strip on top, then output chart +
// both heatmaps side by side, then the batch table and alerts sharing the
// last row. Each cell clamps to its track via minmax(0, Nfr) so overflowing
// content scrolls inside the Panel instead of growing the grid. Below
// ~1100px there isn't room for three columns, so it falls back to a single
// stacked, page-scrolling column — the same trade-off the rest of the app
// already makes for small screens.
const tvGridCss = `
  /* Default height leaves room for the app's own footer below the page;
     kiosk mode hides that footer (see styleSheet), so the shell reclaims
     the full viewport there. Both live in the stylesheet (not an inline
     style) so this override actually wins — an inline height on the
     element would beat any class-based override regardless of selector
     specificity. */
  .wfd-tv-shell { height: calc(100vh - 60px); }
  body.wfd-kiosk-mode .wfd-tv-shell { height: 100vh; }

  .wfd-tv-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    grid-template-rows: minmax(0, 148px) minmax(0, 1.2fr) minmax(0, 1fr);
    grid-template-areas:
      "teams teams teams"
      "output heatIn heatOut"
      "batch batch alerts";
    gap: 12px;
    flex: 1;
    min-height: 0;
  }
  @media (max-width: 1100px) {
    .wfd-tv-grid {
      grid-template-columns: 1fr;
      grid-template-rows: none;
      grid-template-areas:
        "teams"
        "output"
        "heatIn"
        "heatOut"
        "batch"
        "alerts";
      flex: none;
    }
    .wfd-tv-grid > * { min-height: 300px; }
    .wfd-tv-shell { height: auto !important; overflow: visible !important; }
  }
`;

const WipFloorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [modalTeam, setModalTeam] = useState(null);
  const [modalBatch, setModalBatch] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    setData([]);
    API.get('wipDashboard/floor')
      .then((response) => {
        setData((response.data && response.data.data) || null);
      })
      .catch(() => {
        setError("Couldn't load the floor dashboard — check your connection and try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Runs unattended on a shop-floor TV, so it refreshes itself rather than
  // waiting on someone to click Refresh — every 5 minutes, on top of the
  // initial load. setLoading(true) inside load() doesn't blank the screen
  // on these background refreshes (the loading placeholder only renders
  // while there's no data yet), so this doesn't flicker the display.
  useEffect(() => {
    load();
    const intervalId = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [load]);

  // Fullscreen = TV/kiosk mode: also hides the app sidebar/footer (via the
  // wfd-kiosk-mode body class, see wipDashboardUI's styleSheet) so a shop-
  // floor TV shows nothing but the dashboard. Listens for fullscreenchange
  // rather than only reacting to the button, since the browser's own Esc
  // key exits fullscreen without going through toggleFullscreen().
  useEffect(() => {
    const handleFsChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      document.body.classList.toggle('wfd-kiosk-mode', active);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.body.classList.remove('wfd-kiosk-mode');
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => { });
    }
  };

  const alerts = (data && data.alerts) || [];
  const teamScoreboard = (data && data.team_scoreboard) || [];
  const batchBreakdown = (data && data.batch_breakdown) || [];
  const stationTeamBreakdown = (data && data.station_team_breakdown) || [];
  const teamHourlyTrend = (data && data.team_hourly_trend) || { hours: [], teams: [] };
  const heatmapTeams = teamHourlyTrend.teams.map((t) => ({ ...t, id: t.daily_shift_team_id }));
  const floorTotals = (data && data.floor_totals) || { wip_qty: 0, efficiency_pct: 0 };
  const floorEff = efficiencyColor(floorTotals.efficiency_pct);

  const barData = stationTeamBreakdown.map((r) => ({
    name: `${r.operation_code || '—'} · ${r.team_name || 'Unassigned'}`,
    Good: r.good_qty,
    Reject: r.reject_qty,
    Rework: r.rework_qty,
  }));

  // ── Excel export ──────────────────────────────────────────────────────
  // Every sheet is built straight from the data already backing this page,
  // so the workbook always matches what's on screen — no separate export
  // query path to drift out of sync.
  const exportToExcel = async () => {
    if (!data) return;
    const wb = new ExcelJS.Workbook();
    const stamp = new Date().toLocaleString('en-LK');

    const totalScanned = teamScoreboard.reduce((s, t) => s + (t.scanned_qty || 0), 0);
    const totalRejected = teamScoreboard.reduce((s, t) => s + (t.rejected_qty || 0), 0);
    const totalRework = teamScoreboard.reduce((s, t) => s + (t.rework_qty || 0), 0);
    const totalWip = teamScoreboard.reduce((s, t) => s + (t.wip_qty || 0), 0);
    const avgEfficiency = teamScoreboard.length
      ? Math.round((teamScoreboard.reduce((s, t) => s + (t.efficiency_pct || 0), 0) / teamScoreboard.length) * 10) / 10
      : 0;
    const waitingAlerts = alerts.filter((a) => a.type === 'WAITING_ON_UPSTREAM').length;
    const reworkAlerts = alerts.filter((a) => a.type === 'REWORK_BACKLOG').length;

    // Sheet 1 — Overview
    addOverviewSheet(wb, {
      title: 'PRODUCTION FLOOR DASHBOARD — SHIFT REPORT',
      subtitleLines: [
        `Generated: ${stamp}`,
        `Snapshot as of: ${formatTime(data.generated_at)} (today, current shift)`,
      ],
      metrics: [
        { label: 'Active Teams', value: teamScoreboard.length, color: XLS_ACCENT.teams },
        { label: 'Total Scanned', value: totalScanned, color: XLS_ACCENT.success },
        { label: 'Total Rejected', value: totalRejected, color: XLS_ACCENT.danger },
        { label: 'Total Sent to Rework', value: totalRework, color: XLS_ACCENT.amber, tone: 'amber' },
        { label: 'Total Net WIP', value: totalWip, color: XLS_ACCENT.throughput },
        { label: 'Average Team Efficiency %', value: avgEfficiency, color: XLS_ACCENT.output },
        { label: 'Batches in Progress', value: batchBreakdown.length, color: XLS_ACCENT.floor },
        { label: 'Open Alerts — Waiting on Upstream', value: waitingAlerts, color: XLS_ACCENT.danger },
        { label: 'Open Alerts — Rework Backlog', value: reworkAlerts, color: XLS_ACCENT.amber, tone: 'amber' },
        { label: 'Total Open Alerts', value: alerts.length, color: XLS_ACCENT.danger },
      ],
    });

    // Sheet 2 — Team Scoreboard
    addTableSheet(wb, {
      name: 'Team Scoreboard',
      headers: ['Team', 'Operation Code', 'Operation Description', 'Scanned', 'Rejected', 'Rework Sent', 'Net WIP', 'Reject %', 'Rework %', 'Efficiency %'],
      rows: teamScoreboard.map((t) => [
        t.team_name || 'Unassigned', t.operation_code || '', t.operation_description || '',
        t.scanned_qty, t.rejected_qty, t.rework_qty, t.wip_qty, t.reject_rate_pct, t.rework_rate_pct, t.efficiency_pct,
      ]),
      widths: [22, 14, 30, 10, 10, 12, 10, 10, 10, 12],
    });

    // Sheet 3 — Output by Operation & Team
    addTableSheet(wb, {
      name: 'Output by Op & Team',
      headers: ['Operation Code', 'Operation Description', 'Team', 'Good Qty', 'Reject Qty', 'Rework Qty'],
      rows: stationTeamBreakdown.map((r) => [r.operation_code || '', r.operation_description || '', r.team_name || 'Unassigned', r.good_qty, r.reject_qty, r.rework_qty]),
      widths: [14, 30, 22, 12, 12, 12],
    });

    // Sheet 4 — Station Queue (live queued/blocked/rework per operation)
    const stations = (data && data.stations) || [];
    addTableSheet(wb, {
      name: 'Station Queue (Live)',
      headers: ['Operation Code', 'Operation Description', 'Queued Qty', 'Blocked Qty', 'Outstanding Rework', 'Bundles In Progress'],
      rows: stations.map((s) => [s.operation_code || '', s.operation_description || '', s.queued_qty, s.blocked_qty, s.outstanding_rework, s.bundles_in_progress]),
      widths: [14, 30, 12, 12, 16, 18],
    });

    // Sheets 5 & 6 — Hourly IN / OUT by team (mirrors the two heatmaps)
    const hours = teamHourlyTrend.hours || [];
    if (hours.length > 0) {
      const buildHourRows = (field) => heatmapTeams.map((t) => {
        const values = t[field] || [];
        const total = values.reduce((s, v) => s + v, 0);
        return [t.team_name || 'Unassigned', ...values, total];
      });
      const hourWidths = [22, ...hours.map(() => 8), 10];
      addTableSheet(wb, { name: 'Hourly IN by Team', headers: ['Team', ...hours, 'Total'], rows: buildHourRows('in'), widths: hourWidths });
      addTableSheet(wb, { name: 'Hourly OUT by Team', headers: ['Team', ...hours, 'Total'], rows: buildHourRows('out'), widths: hourWidths });
    }

    // Sheet 7 — Batch Breakdown (whole floor)
    addTableSheet(wb, {
      name: 'Batch Breakdown',
      headers: ['Main Model', 'Model', 'Batch No', 'Queued Qty', 'Blocked Qty', 'Outstanding Rework'],
      rows: batchBreakdown.map((b) => [b.main_model_name || '—', b.model_name || '—', b.batch_no || '—', b.queued_qty, b.blocked_qty, b.outstanding_rework]),
      widths: [24, 24, 16, 12, 12, 16],
    });

    // Sheet 8 — Problem Alerts
    addTableSheet(wb, {
      name: 'Problem Alerts',
      headers: ['Type', 'Bundle', 'Operation Code', 'Operation Description', 'Direction', 'Qty', 'Since', 'Age (minutes)', 'Waiting On'],
      rows: alerts.map((a) => [
        a.type === 'WAITING_ON_UPSTREAM' ? 'Waiting on Upstream' : 'Rework Backlog',
        a.bundle_id, a.operation_code || '', a.operation_description || '', a.direction || '',
        a.type === 'WAITING_ON_UPSTREAM' ? a.stuck_qty : a.outstanding_qty,
        a.since ? new Date(a.since).toLocaleString('en-LK') : '',
        a.age_minutes,
        a.type === 'WAITING_ON_UPSTREAM' && a.source
          ? `${a.source.operation_description || a.source.operation_code} (${a.source.direction}), released ${a.source.released} so far`
          : '',
      ]),
      widths: [18, 10, 14, 30, 10, 8, 20, 14, 44],
    });

    const dateStamp = new Date().toISOString().slice(0, 10);
    const timeStamp = new Date().toTimeString().slice(0, 5).replace(':', '');
    await downloadWorkbook(wb, `Floor-Dashboard-${dateStamp}-${timeStamp}.xlsx`);
  };

  return (
    <div
      className="wfd-tv-shell container-fluid custom-container-padding"
      style={{
        background: C.page, display: 'flex', flexDirection: 'column',
        paddingTop: '14px', paddingBottom: '10px', boxSizing: 'border-box',
      }}
    >
      <style>{styleSheet}{tvGridCss}</style>

      <div
        className="mb-2"
        style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px', flexShrink: 0,
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, color: '#fff',
            background: `linear-gradient(135deg, ${ACCENT.teams}, ${ACCENT.throughput})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 16px ${ACCENT.teams}44`,
          }}>
            <IconLayers size={19} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: C.ink, letterSpacing: '-0.01em' }}>Production Floor</h1>
            <div style={{ fontSize: '11.5px', color: C.muted, marginTop: '1px' }}>Live view of today&rsquo;s shop-floor throughput, WIP, and quality</div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center" style={{ gap: '12px' }}>
          {data && (
            <>
              <div
                className="d-flex align-items-center wfd-glow-chip"
                style={{
                  gap: '9px', padding: '8px 18px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${darken(ACCENT.teams, 0.15)}, ${darken(ACCENT.teams, 0.5)})`,
                  boxShadow: `0 0 0 1px ${ACCENT.teams}66, 0 0 24px ${ACCENT.teams}cc, 0 0 48px ${ACCENT.teams}77`,
                }}
                title="Sum of every team's net WIP right now"
              >
                <span style={{ fontSize: '11.5px', color: '#fff', opacity: 0.9, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Floor WIP</span>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: `0 0 12px #fff, 0 0 22px ${ACCENT.teams}` }}>{floorTotals.wip_qty}</span>
              </div>
              <div
                className="d-flex align-items-center wfd-glow-chip"
                style={{
                  gap: '9px', padding: '8px 18px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${darken(floorEff.color, 0.15)}, ${darken(floorEff.color, 0.5)})`,
                  boxShadow: `0 0 0 1px ${floorEff.color}66, 0 0 24px ${floorEff.color}cc, 0 0 48px ${floorEff.color}77`,
                }}
                title="Earned minutes (good OUT scans x SMV) over available operator-minutes since shift start"
              >
                <span style={{ fontSize: '11.5px', color: '#fff', opacity: 0.9, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Floor Efficiency</span>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: `0 0 12px #fff, 0 0 22px ${floorEff.color}` }}>{floorTotals.efficiency_pct}%</span>
              </div>
            </>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-end" style={{ gap: '10px' }}>
          {data && (
            <span style={{ fontSize: '12px', color: C.muted, whiteSpace: 'nowrap' }}>Updated {formatTime(data.generated_at)}</span>
          )}
          <button
            type="button"
            className="d-flex align-items-center"
            onClick={toggleFullscreen}
            style={{
              gap: '7px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${C.border}`,
              background: C.surface, color: C.ink, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen — for TV / kiosk display'}
          >
            {isFullscreen ? <IconMinimize size={14} /> : <IconMaximize size={14} />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button
            type="button"
            className="d-flex align-items-center"
            onClick={exportToExcel}
            disabled={!data || loading}
            style={exportButtonStyle(!data || loading)}
            title="Download this shift's data as a detailed Excel report"
          >
            <IconDownload size={14} />
            Download Excel
          </button>
          <button
            type="button"
            className="wfd-refresh d-flex align-items-center"
            onClick={load}
            disabled={loading}
            style={{
              gap: '7px', padding: '8px 14px', borderRadius: '999px', border: `1px solid ${C.border}`,
              background: C.surface, color: C.ink, fontSize: '13px', fontWeight: 600,
              cursor: loading ? 'default' : 'pointer', boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
            }}
          >
            <IconRefreshCw size={14} className={loading ? 'wfd-spin' : ''} />
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-3 d-flex align-items-center" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '12px', color: C.ink, gap: '10px', flexShrink: 0 }}>
          <IconAlertTriangle size={17} color={C.danger} />
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="d-flex flex-column align-items-center text-center py-5" style={{ color: C.muted, gap: '10px' }}>
          <IconRefreshCw size={24} color={C.faint} className="wfd-spin" />
          Loading floor status&#8230;
        </div>
      )}

      {data && (
        <div className="wfd-tv-grid">
          <Panel area="teams" accent={ACCENT.teams} title="Team WIP — click a team for its batch breakdown" icon={<IconLayers size={16} />}>
            {teamScoreboard.length === 0 ? (
              <EmptyState>No scans recorded yet today.</EmptyState>
            ) : (
              <div className="d-flex" style={{ gap: '10px', height: '100%' }}>
                {teamScoreboard.map((t) => (
                  <div key={t.daily_shift_team_id} style={{ flex: '0 0 190px' }}>
                    <TeamCard team={t} onOpen={setModalTeam} />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel area="output" accent={ACCENT.output} title="Output by Operation & Team" icon={<IconBarChart size={16} />} autoScrollX>
            {barData.length === 0 ? (
              <EmptyState>No scans recorded yet today.</EmptyState>
            ) : (
              <div style={{ width: Math.max(barData.length * 90, 100), height: '100%', minHeight: '200px' }}>
                <ResponsiveContainer>
                  <BarChart data={barData} margin={{ bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.muted }} angle={-35} textAnchor="end" interval={0} height={65} axisLine={{ stroke: C.border }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: C.muted }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: `1px solid ${C.border}`, fontSize: '12px' }} cursor={{ fill: C.subtleBg }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Good" fill={C.success} radius={[4, 4, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="Reject" fill={C.danger} radius={[4, 4, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="Rework" fill={C.amber} radius={[4, 4, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>

          <Panel area="heatIn" accent={ACCENT.throughput} title="Scanned IN — by team" icon={<IconActivity size={16} />}>
            {heatmapTeams.length === 0 ? (
              <EmptyState>No shift activity recorded yet today.</EmptyState>
            ) : (
              <TeamMetricHeatmap columns={teamHourlyTrend.hours} teams={heatmapTeams} field="in" color={C.blue} autoScrollX />
            )}
          </Panel>

          <Panel area="heatOut" accent={ACCENT.throughput} title="Scanned OUT — by team" icon={<IconActivity size={16} />}>
            {heatmapTeams.length === 0 ? (
              <EmptyState>No shift activity recorded yet today.</EmptyState>
            ) : (
              <TeamMetricHeatmap columns={teamHourlyTrend.hours} teams={heatmapTeams} field="out" color={C.orange} autoScrollX />
            )}
          </Panel>

          <Panel area="batch" accent={ACCENT.floor} title="WIP by Main Model / Model / Batch" icon={<IconGrid size={16} />} autoScrollY>
            {batchBreakdown.length === 0 ? (
              <EmptyState>Nothing currently on the floor.</EmptyState>
            ) : (
              <table className="w-100" style={{ fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint, textAlign: 'left' }}>
                    <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Main Model</th>
                    <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Model</th>
                    <th className="py-2" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Batch</th>
                    <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Queued</th>
                    <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Blocked</th>
                    <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rework</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {batchBreakdown.map((b) => (
                    <tr
                      key={`${b.batch_id}-${b.model_id}`}
                      className="wfd-row"
                      style={{ borderBottom: `1px solid ${C.subtleBg}`, cursor: 'pointer' }}
                      onClick={() => setModalBatch(b)}
                      title="Click for bundle-level details"
                    >
                      <td className="py-2" style={{ color: C.ink }}>{b.main_model_name || '—'}</td>
                      <td className="py-2" style={{ color: C.ink, fontWeight: 600 }}>{b.model_name || '—'}</td>
                      <td className="py-2" style={{ color: C.muted }}>{b.batch_no || '—'}</td>
                      <td className="py-2 text-right" style={{ color: C.success }}>{b.queued_qty}</td>
                      <td className="py-2 text-right" style={{ color: C.danger }}>{b.blocked_qty}</td>
                      <td className="py-2 text-right" style={{ color: C.amber }}>{b.outstanding_rework}</td>
                      <td className="py-2 text-right"><IconChevronRight size={14} color={C.faint} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel
            area="alerts"
            accent={ACCENT.alerts}
            title="Problem Alerts"
            icon={<IconBell size={16} />}
            autoScrollY
            right={
              <span style={{
                fontSize: '12px', fontWeight: 700, color: alerts.length > 0 ? C.amber : C.faint,
                background: alerts.length > 0 ? C.amberBg : C.subtleBg, borderRadius: '999px', padding: '3px 11px',
              }}>
                {alerts.length}
              </span>
            }
          >
            {alerts.length === 0 ? (
              <EmptyState>Nothing stuck right now.</EmptyState>
            ) : (
              <div className="d-flex flex-column" style={{ gap: '2px' }}>
                {alerts.map((alert, idx) => (
                  <AlertRow key={`${alert.type}-${alert.bundle_ticket_id}-${idx}`} alert={alert} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {modalTeam && <TeamBatchModal team={modalTeam} onClose={() => setModalTeam(null)} />}
      {modalBatch && <BundleDetailModal batch={modalBatch} onClose={() => setModalBatch(null)} />}
    </div>
  );
};

export default WipFloorDashboard;
