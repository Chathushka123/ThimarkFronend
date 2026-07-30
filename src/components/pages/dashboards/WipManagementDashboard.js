import React, { useEffect, useState, useCallback } from 'react';
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import API from '../../../api/API';
import {
  C, ACCENT, card, sectionCard, styleSheet,
  IconLayers, IconAlertTriangle, IconRotateCcw, IconRefreshCw, IconDownload, IconChevronRight, IconBarChart, IconActivity, IconGrid, IconCalendar,
  efficiencyColor, StatCard, SectionHeader, EmptyState, Modal, TeamMetricHeatmap, exportButtonStyle,
} from './wipDashboardUI';
import {
  ExcelJS, XLS_ACCENT, addTableSheet, addOverviewSheet, downloadWorkbook,
} from './wipDashboardExport';

function toDateInput(d) {
  return d.toISOString().slice(0, 10);
}

function todayDate() {
  return new Date();
}

const QUICK_RANGES = [
  { label: 'Today', days: 0 },
  { label: '7 days', days: 6 },
  { label: '30 days', days: 29 },
  { label: '90 days', days: 89 },
];

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function TeamRangeCard({ team, onOpen }) {
  const eff = efficiencyColor(team.efficiency_pct);
  return (
    <div
      className="p-3 wfd-hover"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(team)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(team); }}
      style={{ ...card, cursor: 'pointer', minWidth: '220px', borderTop: `3px solid ${eff.color}` }}
      title="Click for this team's scanned/rejected/rework by main model / model / batch, for the selected range"
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: '14px' }}>{team.team_name || 'Unassigned Team'}</div>
          <div style={{ fontSize: '11px', color: C.muted }}>
            {team.operation_description || team.operation_code || 'No operation assigned'}
          </div>
        </div>
        <IconChevronRight size={16} color={C.faint} />
      </div>
      <div className="d-flex" style={{ gap: '8px' }}>
        <div className="text-center" style={{ flex: 1, padding: '8px 4px', background: C.subtleBg, borderRadius: '10px' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: ACCENT.teams, lineHeight: 1 }}>{team.wip_qty}</div>
          <div style={{ fontSize: '10px', color: C.muted, letterSpacing: '0.4px', marginTop: '3px' }}>NET WIP</div>
        </div>
        <div className="text-center" style={{ flex: 1, padding: '8px 4px', background: C.subtleBg, borderRadius: '10px' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: eff.color, lineHeight: 1 }}>{team.efficiency_pct}%</div>
          <div style={{ fontSize: '10px', color: C.muted, letterSpacing: '0.4px', marginTop: '3px' }}>EFFICIENCY</div>
        </div>
      </div>
      <div className="d-flex mt-2" style={{ gap: '10px', fontSize: '11px', color: C.muted }}>
        <span>Scanned <strong style={{ color: C.ink }}>{team.scanned_qty}</strong></span>
        <span style={{ color: C.danger }}>Reject {team.reject_rate_pct}%</span>
        <span style={{ color: C.amber }}>Rework {team.rework_rate_pct}%</span>
      </div>
    </div>
  );
}

function TeamBatchRangeModal({ team, from, to, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    API.get(`wipDashboard/teamBatchSummaryRange?team_id=${team.team_id}&from=${from}&to=${to}`)
      .then((response) => {
        setBatches((response.data && response.data.data && response.data.data.batches) || []);
      })
      .catch(() => setError("Couldn't load this team's batch breakdown."))
      .finally(() => setLoading(false));
  }, [team.team_id, from, to]);

  return (
    <Modal
      title={`${team.team_name || 'Unassigned Team'} — Production by Batch`}
      subtitle={`${team.operation_description || team.operation_code || 'No operation assigned'} · ${formatDateLabel(from)} – ${formatDateLabel(to)}`}
      onClose={onClose}
    >
      {loading && <p style={{ color: C.muted, fontSize: '13px' }}>Loading&#8230;</p>}
      {error && <p style={{ color: C.danger, fontSize: '13px' }}>{error}</p>}
      {!loading && !error && (
        batches.length === 0 ? (
          <EmptyState>Nothing scanned by this team in this range.</EmptyState>
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

const WipManagementDashboard = () => {
  const initialTo = todayDate();
  const initialFrom = new Date(initialTo);
  initialFrom.setDate(initialFrom.getDate() - 29);

  const [fromInput, setFromInput] = useState(toDateInput(initialFrom));
  const [toInput, setToInput] = useState(toDateInput(initialTo));
  const [range, setRange] = useState({ from: toDateInput(initialFrom), to: toDateInput(initialTo) });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [modalTeam, setModalTeam] = useState(null);

  const [operations, setOperations] = useState([]);
  const [selectedOperationId, setSelectedOperationId] = useState(null);
  const [throughputDaily, setThroughputDaily] = useState(null);
  const [throughputGranularity, setThroughputGranularity] = useState('day');
  const [throughputLoading, setThroughputLoading] = useState(true);
  const [throughputError, setThroughputError] = useState('');

  useEffect(() => {
    API.get('operation/list')
      .then((response) => {
        const list = (response.data && response.data.data) || [];
        setOperations(list);
        const finalOp = list.find((o) => o.is_final_operation);
        setSelectedOperationId((finalOp || list[0] || {}).id || null);
      })
      .catch(() => {
        setThroughputError("Couldn't load the operation list.");
      });
  }, []);

  const loadThroughput = useCallback((from, to, operationId) => {
    if (!operationId) return;
    setThroughputLoading(true);
    setThroughputError('');
    API.get(`wipDashboard/dailyThroughputByOperation?from=${from}&to=${to}&operation_id=${operationId}`)
      .then((response) => {
        const payload = (response.data && response.data.data) || {};
        setThroughputDaily(payload.daily || []);
        setThroughputGranularity(payload.granularity || 'day');
      })
      .catch((err) => {
        setThroughputError(
          err?.response?.data?.message ||
          "Couldn't load this operation's daily throughput."
        );
      })
      .finally(() => setThroughputLoading(false));
  }, []);

  useEffect(() => {
    if (selectedOperationId) loadThroughput(range.from, range.to, selectedOperationId);
  }, [loadThroughput, range, selectedOperationId]);

  const load = useCallback((from, to) => {
    setLoading(true);
    setError('');
    setData([]);
    API.get(`wipDashboard/management?from=${from}&to=${to}`)
      .then((response) => {
        setData((response.data && response.data.data) || null);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
          "Couldn't load the management dashboard — check your connection and try again."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(range.from, range.to);
  }, [load, range]);

  const applyQuickRange = (days) => {
    const to = todayDate();
    const from = new Date(to);
    from.setDate(from.getDate() - days);
    const fromStr = toDateInput(from);
    const toStr = toDateInput(to);
    setFromInput(fromStr);
    setToInput(toStr);
    setRange({ from: fromStr, to: toStr });
  };

  const applyCustomRange = () => {
    if (!fromInput || !toInput || fromInput > toInput) {
      return;
    }
    setRange({ from: fromInput, to: toInput });
  };

  const summary = (data && data.summary) || null;
  const batchBreakdown = (data && data.batch_breakdown) || [];
  const teamScoreboard = (data && data.team_scoreboard) || [];
  const stationTeamBreakdown = (data && data.station_team_breakdown) || [];
  const teamDailyTrend = (data && data.team_daily_trend) || { days: [], teams: [] };
  const heatmapTeams = teamDailyTrend.teams.map((t) => ({ ...t, id: t.team_id }));

  const teamCount = teamScoreboard.length;
  const teamCols = teamCount > 4 ? Math.ceil(teamCount / 2) : teamCount;

  const selectedOperation = operations.find((o) => o.id === selectedOperationId) || null;

  const dailyChartData = (throughputDaily || []).map((d) => ({
    date: formatDateLabel(d.date),
    Scanned: d.scanned_qty,
    'Reject %': d.reject_rate_pct,
    'Rework %': d.rework_rate_pct,
  }));

  const barData = stationTeamBreakdown.map((r) => ({
    name: `${r.operation_code || '—'} · ${r.team_name || 'Unassigned'}`,
    Good: r.good_qty,
    Reject: r.reject_qty,
    Rework: r.rework_qty,
  }));

  // ── Excel export ──────────────────────────────────────────────────────
  // Same principle as the floor screen's export: every sheet is built from
  // data already loaded for the selected range, so the workbook can never
  // disagree with what's rendered on screen.
  const exportToExcel = async () => {
    if (!data || !summary) return;
    const wb = new ExcelJS.Workbook();
    const stamp = new Date().toLocaleString('en-LK');
    const daily = (data && data.daily) || [];
    const throughputRows = throughputDaily || [];
    const throughputIsHourly = throughputGranularity === 'hour';
    const throughputColLabel = throughputIsHourly ? 'Hour' : 'Date';
    const operationLabel = selectedOperation ? `${selectedOperation.operation_code} — ${selectedOperation.description}` : '—';

    // Sheet 1 — Overview
    addOverviewSheet(wb, {
      title: 'PRODUCTION MANAGEMENT DASHBOARD — RANGE REPORT',
      subtitleLines: [
        `Generated: ${stamp}`,
        `Date Range: ${data.from} to ${data.to} (${daily.length} day${daily.length === 1 ? '' : 's'})`,
        `Throughput & Quality Sheet Scope: ${operationLabel} · OUT scans only · ${throughputIsHourly ? 'hourly' : 'daily'} breakdown`,
      ],
      metrics: [
        { label: 'Total Scanned', value: summary.total_scanned, color: XLS_ACCENT.success },
        { label: 'Total Rejected', value: summary.total_rejected, color: XLS_ACCENT.danger },
        { label: 'Total Sent to Rework', value: summary.total_rework_sent, color: XLS_ACCENT.amber, tone: 'amber' },
        { label: 'Overall Reject %', value: summary.overall_reject_rate_pct, color: XLS_ACCENT.danger },
        { label: 'Overall Rework %', value: summary.overall_rework_rate_pct, color: XLS_ACCENT.amber, tone: 'amber' },
        { label: 'Teams Active in Range', value: teamScoreboard.length, color: XLS_ACCENT.teams },
        { label: 'Distinct Batches Produced', value: batchBreakdown.length, color: XLS_ACCENT.floor },
      ],
    });

    // Sheet 2 — Throughput & Quality (mirrors the on-screen chart: one
    // operation, OUT scans only, hourly instead of daily for a single-day
    // range) — same source (throughputDaily) as dailyChartData above, so
    // the workbook can't disagree with what's rendered on screen.
    addTableSheet(wb, {
      name: throughputIsHourly ? 'Hourly Throughput' : 'Daily Throughput',
      headers: [throughputColLabel, 'Scanned (OUT)', 'Rejected', 'Sent to Rework', 'Reject %', 'Rework %'],
      rows: throughputRows.map((d) => [d.date, d.scanned_qty, d.rejected_qty, d.rework_qty, d.reject_rate_pct, d.rework_rate_pct]),
      widths: [14, 14, 12, 16, 10, 10],
    });

    // Sheet 3 — Team Totals
    addTableSheet(wb, {
      name: 'Team Totals',
      headers: ['Team', 'Operation Code', 'Operation Description', 'Scanned', 'Rejected', 'Rework Sent', 'Net WIP', 'Reject %', 'Rework %', 'Efficiency %'],
      rows: teamScoreboard.map((t) => [
        t.team_name || 'Unassigned', t.operation_code || '', t.operation_description || '',
        t.scanned_qty, t.rejected_qty, t.rework_qty, t.wip_qty, t.reject_rate_pct, t.rework_rate_pct, t.efficiency_pct,
      ]),
      widths: [22, 14, 30, 10, 10, 12, 10, 10, 10, 12],
    });

    // Sheet 4 — Output by Operation & Team
    addTableSheet(wb, {
      name: 'Output by Op & Team',
      headers: ['Operation Code', 'Operation Description', 'Team', 'Good Qty', 'Reject Qty', 'Rework Qty'],
      rows: stationTeamBreakdown.map((r) => [r.operation_code || '', r.operation_description || '', r.team_name || 'Unassigned', r.good_qty, r.reject_qty, r.rework_qty]),
      widths: [14, 30, 22, 12, 12, 12],
    });

    // Sheets 5 & 6 — IN / OUT by team (mirrors the two heatmaps; hourly
    // instead of daily columns for a single-day range)
    const trendIsHourly = teamDailyTrend.granularity === 'hour';
    const trendCols = teamDailyTrend.days || [];
    if (trendCols.length > 0) {
      const buildColRows = (field) => heatmapTeams.map((t) => {
        const values = t[field] || [];
        const total = values.reduce((s, v) => s + v, 0);
        return [t.team_name || 'Unassigned', ...values, total];
      });
      const colWidths = [22, ...trendCols.map(() => 9), 10];
      const namePrefix = trendIsHourly ? 'Hourly' : 'Daily';
      addTableSheet(wb, { name: `${namePrefix} IN by Team`, headers: ['Team', ...trendCols, 'Total'], rows: buildColRows('in'), widths: colWidths });
      addTableSheet(wb, { name: `${namePrefix} OUT by Team`, headers: ['Team', ...trendCols, 'Total'], rows: buildColRows('out'), widths: colWidths });
    }

    // Sheet 7 — Production by Main Model / Model / Batch
    addTableSheet(wb, {
      name: 'Batch Breakdown',
      headers: ['Main Model', 'Model', 'Batch No', 'Scanned', 'Rejected', 'Rework', 'Reject %', 'Rework %'],
      rows: batchBreakdown.map((b) => [
        b.main_model_name || '—', b.model_name || '—', b.batch_no || '—',
        b.scanned_qty, b.rejected_qty, b.rework_qty, b.reject_rate_pct, b.rework_rate_pct,
      ]),
      widths: [24, 24, 16, 10, 10, 10, 10, 10],
    });

    await downloadWorkbook(wb, `Management-Dashboard-${data.from}-to-${data.to}.xlsx`);
  };

  return (
    <div className="container-fluid custom-container-padding" style={{ background: C.page, minHeight: '100%', paddingBottom: '32px' }}>
      <style>{styleSheet}</style>

      <div className="d-flex justify-content-between align-items-start mb-4 pt-2 flex-wrap" style={{ gap: '12px' }}>
        <div className="d-flex align-items-center" style={{ gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0, color: '#fff',
            background: `linear-gradient(135deg, ${ACCENT.floor}, ${ACCENT.output})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 16px ${ACCENT.floor}44`,
          }}>
            <IconCalendar size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: C.ink, letterSpacing: '-0.01em' }}>Production Management</h1>
            <div style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>Team WIP, output, and throughput across a selected date range</div>
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <button
            type="button"
            className="d-flex align-items-center"
            onClick={exportToExcel}
            disabled={!summary || loading}
            style={exportButtonStyle(!summary || loading)}
            title="Download this date range's data as a detailed Excel report"
          >
            <IconDownload size={14} />
            Download Excel
          </button>
          <button
            type="button"
            className="wfd-refresh d-flex align-items-center"
            onClick={() => load(range.from, range.to)}
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

      <div className="mb-4" style={{ ...card, padding: '14px 18px' }}>
        <div className="d-flex align-items-end flex-wrap" style={{ gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>From</label>
            <input
              type="date"
              value={fromInput}
              max={toInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="form-control form-control-sm"
              style={{ borderColor: C.border }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>To</label>
            <input
              type="date"
              value={toInput}
              min={fromInput}
              max={toDateInput(todayDate())}
              onChange={(e) => setToInput(e.target.value)}
              className="form-control form-control-sm"
              style={{ borderColor: C.border }}
            />
          </div>
          <button
            type="button"
            onClick={applyCustomRange}
            disabled={loading || !fromInput || !toInput || fromInput > toInput}
            style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none', background: ACCENT.teams, color: '#fff',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer', height: '31px',
            }}
          >
            Apply
          </button>
          <div className="d-flex" style={{ gap: '6px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {QUICK_RANGES.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="wfd-range-btn"
                onClick={() => applyQuickRange(opt.days)}
                disabled={loading}
                style={{
                  border: `1px solid ${C.border}`, borderRadius: '999px', padding: '6px 14px', fontSize: '12.5px', fontWeight: 600,
                  background: C.surface, color: C.ink, cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-3 d-flex align-items-center" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '12px', color: C.ink, gap: '10px' }}>
          <IconAlertTriangle size={17} color={C.danger} />
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="d-flex flex-column align-items-center text-center py-5" style={{ color: C.muted, gap: '10px' }}>
          <IconRefreshCw size={24} color={C.faint} className="wfd-spin" />
          Loading trend data&#8230;
        </div>
      )}

      {summary && (
        <>
          {/* <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' }}>
            <StatCard label="Total Scanned" value={summary.total_scanned} tone="success" icon={<IconLayers size={19} />} />
            <StatCard label="Total Rejected" value={summary.total_rejected} tone="danger" icon={<IconAlertTriangle size={19} />} />
            <StatCard label="Sent to Rework" value={summary.total_rework_sent} tone="amber" icon={<IconRotateCcw size={19} />} />
            <StatCard label="Reject Rate" value={`${summary.overall_reject_rate_pct}%`} tone="danger" icon={<IconAlertTriangle size={19} />} />
            <StatCard label="Rework Rate" value={`${summary.overall_rework_rate_pct}%`} tone="amber" icon={<IconRotateCcw size={19} />} />
          </div> */}

          <div className="mb-4" style={sectionCard(ACCENT.teams)}>
            <SectionHeader eyebrow="Teams" title="Team Totals" subtitle="Click a team to see its output by main model / model / batch, for this range" icon={<IconLayers size={17} />} accent={ACCENT.teams} />
            {teamScoreboard.length === 0 ? (
              <EmptyState>No scans recorded in this range.</EmptyState>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: `repeat(${teamCols}, minmax(180px, 1fr))` }}>
                  {teamScoreboard.map((t) => (
                    <TeamRangeCard key={t.team_id} team={t} onOpen={setModalTeam} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4" style={sectionCard(ACCENT.output)}>
            <SectionHeader eyebrow="Quality & Output" title="Output by Operation & Team" subtitle="Good vs. reject vs. rework, for this range" icon={<IconBarChart size={17} />} accent={ACCENT.output} />
            {barData.length === 0 ? (
              <EmptyState>No scans recorded in this range.</EmptyState>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ width: Math.max(barData.length * 110, 600), height: '300px' }}>
                  <ResponsiveContainer>
                    <BarChart data={barData} margin={{ bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} angle={-35} textAnchor="end" interval={0} height={70} axisLine={{ stroke: C.border }} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: C.muted }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '10px', border: `1px solid ${C.border}`, fontSize: '12px' }} cursor={{ fill: C.subtleBg }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Good" fill={C.success} radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="Reject" fill={C.danger} radius={[4, 4, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="Rework" fill={C.amber} radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4" style={sectionCard(ACCENT.throughput)}>
            <SectionHeader
              eyebrow="Throughput"
              title="In / Out by Team, Over the Range"
              subtitle={teamDailyTrend.granularity === 'hour' ? 'By hour — single-day range' : 'Scroll to see the full date range'}
              icon={<IconActivity size={17} />}
              accent={ACCENT.throughput}
            />
            {heatmapTeams.length === 0 ? (
              <EmptyState>No activity recorded in this range.</EmptyState>
            ) : (
              <div className="d-flex flex-column" style={{ gap: '20px' }}>
                <TeamMetricHeatmap title="Scanned IN" columns={teamDailyTrend.days} teams={heatmapTeams} field="in" color={C.blue} />
                <TeamMetricHeatmap title="Scanned OUT" columns={teamDailyTrend.days} teams={heatmapTeams} field="out" color={C.orange} />
              </div>
            )}
          </div>

          <div className="mb-4" style={sectionCard(ACCENT.floor)}>
            <SectionHeader
              eyebrow="Trend"
              title={throughputGranularity === 'hour' ? 'Hourly Throughput & Quality' : 'Daily Throughput & Quality'}
              subtitle={`OUT scans at ${selectedOperation ? (selectedOperation.description || selectedOperation.operation_code) : '—'} · ${dailyChartData.length} ${throughputGranularity === 'hour' ? 'hour' : 'day'}${dailyChartData.length === 1 ? '' : 's'} in range`}
              icon={<IconGrid size={17} />}
              accent={ACCENT.floor}
              right={(
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Operation
                  </label>
                  <select
                    value={selectedOperationId || ''}
                    onChange={(e) => setSelectedOperationId(Number(e.target.value))}
                    disabled={operations.length === 0}
                    className="form-select form-select-sm"
                    style={{ borderColor: C.border, fontSize: '12.5px', minWidth: '200px' }}
                  >
                    {operations.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.operation_code} — {op.description}{op.is_final_operation ? ' (Final)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            {throughputError && (
              <div className="p-3 mb-3 d-flex align-items-center" style={{ background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: '12px', color: C.ink, gap: '10px' }}>
                <IconAlertTriangle size={17} color={C.danger} />
                {throughputError}
              </div>
            )}
            {throughputLoading ? (
              <div className="d-flex align-items-center py-4" style={{ color: C.muted, gap: '10px' }}>
                <IconRefreshCw size={18} color={C.faint} className="wfd-spin" />
                Loading throughput&#8230;
              </div>
            ) : dailyChartData.length === 0 ? (
              <EmptyState>No OUT scans recorded for this operation in this window.</EmptyState>
            ) : (
              <div style={{ width: '100%', height: '340px' }}>
                <ResponsiveContainer>
                  <ComposedChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} axisLine={{ stroke: C.border }} tickLine={false} />
                    <YAxis yAxisId="qty" tick={{ fontSize: 12, fill: C.muted }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 12, fill: C.muted }} unit="%" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: `1px solid ${C.border}`, fontSize: '12px' }} cursor={{ fill: C.subtleBg }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar yAxisId="qty" dataKey="Scanned" fill={C.success} barSize={16} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="pct" type="monotone" dataKey="Reject %" stroke={C.danger} strokeWidth={2} dot={false} />
                    <Line yAxisId="pct" type="monotone" dataKey="Rework %" stroke={C.amber} strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={sectionCard(ACCENT.output)}>
            <SectionHeader eyebrow="Whole Floor" title="Production by Main Model / Model / Batch" subtitle="For this range" icon={<IconGrid size={17} />} accent={ACCENT.output} />
            {batchBreakdown.length === 0 ? (
              <EmptyState>No production recorded in this window.</EmptyState>
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
                      <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Reject %</th>
                      <th className="py-2 text-right" style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Rework %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchBreakdown.map((b) => (
                      <tr key={`${b.batch_id}-${b.model_id}`} style={{ borderBottom: `1px solid ${C.subtleBg}` }}>
                        <td className="py-2" style={{ color: C.ink }}>{b.main_model_name || '—'}</td>
                        <td className="py-2" style={{ color: C.ink, fontWeight: 600 }}>{b.model_name || '—'}</td>
                        <td className="py-2" style={{ color: C.muted }}>{b.batch_no || '—'}</td>
                        <td className="py-2 text-right" style={{ color: C.success }}>{b.scanned_qty}</td>
                        <td className="py-2 text-right" style={{ color: C.danger }}>{b.rejected_qty}</td>
                        <td className="py-2 text-right" style={{ color: C.amber }}>{b.rework_qty}</td>
                        <td className="py-2 text-right" style={{ color: C.muted }}>{b.reject_rate_pct}%</td>
                        <td className="py-2 text-right" style={{ color: C.muted }}>{b.rework_rate_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {modalTeam && <TeamBatchRangeModal team={modalTeam} from={range.from} to={range.to} onClose={() => setModalTeam(null)} />}
    </div>
  );
};

export default WipManagementDashboard;
