import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import API from "../../../api/API";

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const BATCH_REQ_COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#38BDF8"];
const BATCH_ACT_COLORS = ["#1D4ED8", "#065F46", "#B45309", "#991B1B", "#5B21B6", "#0C4A6E"];
const SERIES_COLORS    = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

const CATEGORY_BADGE = {
  material:   { bg: "#DBEAFE", color: "#1D4ED8", label: "Material"   },
  consumable: { bg: "#D1FAE5", color: "#065F46", label: "Consumable" },
  returnable: { bg: "#FEF3C7", color: "#92400E", label: "Returnable" },
};

/* ─── Custom Tooltip ──────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#1E293B",
      border: "none",
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      minWidth: 170,
    }}>
      <p style={{ margin: "0 0 8px", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
          <span style={{ color: entry.color, fontSize: 12 }}>{entry.name}</span>
          <span style={{ color: "#F1F5F9", fontSize: 12, fontWeight: 700 }}>
            {formatter ? formatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── Chart Card Wrapper ──────────────────────────────────────────────────── */
const ChartCard = ({ title, subtitle, children, accent = "#1D4ED8", onFullscreen }) => (
  <div style={{
    background: "#FFFFFF",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(30,58,114,0.10)",
    marginBottom: 28,
    overflow: "hidden",
  }}>
    <div style={{
      background: `linear-gradient(135deg, ${accent} 0%, #1E3C72 100%)`,
      padding: "16px 24px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
    }}>
      <div>
        <h6 style={{ margin: 0, color: "#FFFFFF", fontWeight: 700, fontSize: 15 }}>{title}</h6>
        {subtitle && <p style={{ margin: "3px 0 0", color: "#BAE6FD", fontSize: 12 }}>{subtitle}</p>}
      </div>
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          title="Fullscreen (F)"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 7,
            color: "#fff",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 17,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ⛶
        </button>
      )}
    </div>
    <div style={{ padding: "20px 16px 16px" }}>
      {children}
    </div>
  </div>
);

/* ─── Fullscreen Modal ────────────────────────────────────────────────────── */
const FullscreenModal = ({ title, subtitle, accent = "#1D4ED8", onClose, children }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.84)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#FFFFFF", borderRadius: 16, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 28px 80px rgba(0,0,0,0.55)" }}>
        <div style={{ background: `linear-gradient(135deg, ${accent} 0%, #1E3C72 100%)`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h5 style={{ margin: 0, color: "#FFFFFF", fontWeight: 700, fontSize: 17 }}>{title}</h5>
            {subtitle && <p style={{ margin: "3px 0 0", color: "#BAE6FD", fontSize: 12 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, color: "#fff", fontSize: 18, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, padding: "24px", minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, color = "#1D4ED8", icon }) => (
  <div style={{
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "14px 18px",
    boxShadow: "0 2px 12px rgba(30,58,114,0.09)",
    borderLeft: `4px solid ${color}`,
    flex: 1,
    minWidth: 140,
  }}>
    <p style={{ margin: 0, fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{label}</p>
    <p style={{ margin: "4px 0 0", fontSize: 20, color: "#1E293B", fontWeight: 700 }}>{value}</p>
  </div>
);

/* ─── Batch Toggle Selector ───────────────────────────────────────────────── */
const MAX_BAR_BATCHES = 3; // max batches shown together in the grouped bar chart

const BatchSelector = ({ batches, selected, onToggle }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
    <span style={{ fontSize: 12, color: "#64748B", alignSelf: "center", marginRight: 4 }}>
      Compare (max {MAX_BAR_BATCHES}):
    </span>
    {batches.map((b, i) => {
      const isOn = selected.includes(b.id);
      const canSelect = isOn || selected.length < MAX_BAR_BATCHES;
      return (
        <button
          key={b.id}
          onClick={() => canSelect && onToggle(b.id)}
          style={{
            padding: "5px 14px",
            borderRadius: 20,
            border: `2px solid ${BATCH_REQ_COLORS[i % BATCH_REQ_COLORS.length]}`,
            background: isOn ? BATCH_REQ_COLORS[i % BATCH_REQ_COLORS.length] : "transparent",
            color: isOn ? "#1E293B" : BATCH_REQ_COLORS[i % BATCH_REQ_COLORS.length],
            fontSize: 12,
            fontWeight: 700,
            cursor: canSelect ? "pointer" : "not-allowed",
            opacity: canSelect ? 1 : 0.4,
            transition: "all 0.15s",
          }}
        >
          {b.batch_no}
        </button>
      );
    })}
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const CSCharts = () => {
  const { model_id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [fullscreen, setFullscreen] = useState(null); // "bar" | "consumption" | "cost"
  const [focusedCons, setFocusedCons] = useState(null); // code of isolated series, or null = show all
  const [focusedCost, setFocusedCost] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.post("Batch/getBatchComparisonByModel", { model_id })
      .then((res) => {
        setApiData(res.data);
        // Pre-select first MAX_BAR_BATCHES batches
        const ids = (res.data?.batches || [])
          .slice(0, MAX_BAR_BATCHES)
          .map((b) => b.id);
        setSelectedBatchIds(ids);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load chart data. Please try again.");
        setLoading(false);
      });
  }, [model_id]);

  function toggleBatch(id) {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  /* ── Transform: grouped bar — only selected batches ── */
  const buildBarData = (chartDef, activeBatchIds) => {
    if (!chartDef) return [];
    const activeBatches = chartDef.batches.filter((b) => activeBatchIds.includes(b.batch_id));
    return chartDef.labels.map((label, i) => {
      const point = { name: label };
      activeBatches.forEach((batch) => {
        point[`${batch.batch_no} · Req`] = batch.required[i] ?? null;
        point[`${batch.batch_no} · Act`] = batch.actual[i] ?? null;
      });
      return point;
    });
  };

  /* ── Transform: multi-line (series per batch label) ── */
  const buildLineData = (chartDef) => {
    if (!chartDef) return [];
    return chartDef.labels.map((label, i) => {
      const point = { name: label };
      chartDef.series.forEach((s) => {
        point[s.code] = s.data[i] ?? null;
      });
      return point;
    });
  };

  const fmtCurrency = (v) =>
    v == null ? "–" : `Rs ${Number(v).toLocaleString("en-LK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtNum = (v) =>
    v == null ? "–" : Number(v).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ── Loading / Error states ── */
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, fontFamily: "'Poppins', sans-serif", color: "#64748B" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #E2E8F0", borderTopColor: "#1D4ED8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ margin: 0, fontSize: 14 }}>Loading chart data…</p>
      </div>
    </div>
  );
  if (error) return (
    <div style={{ padding: 32, textAlign: "center", color: "#DC2626", fontFamily: "'Poppins', sans-serif" }}>
      <p style={{ fontSize: 14 }}>{error}</p>
    </div>
  );

  const model    = apiData?.model || {};
  const batches  = apiData?.batches || [];
  const stockItems = apiData?.stock_items || [];
  const chartData  = apiData?.chart_data || {};

  const barData         = buildBarData(chartData.req_vs_actual, selectedBatchIds);
  const consumptionData = buildLineData(chartData.consumption_trend);
  const costData        = buildLineData(chartData.cost_trend);

  const allBatchDefs   = chartData.req_vs_actual?.batches || [];
  const batchDefs      = allBatchDefs.filter((b) => selectedBatchIds.includes(b.batch_id));
  const seriesCons = chartData.consumption_trend?.series || [];
  const seriesCost = chartData.cost_trend?.series || [];

  /* ── Chart content renderers — reused in both card and fullscreen ── */
  const renderBarChartContent = () => (
    <>
      <BatchSelector
        batches={allBatchDefs.map((b) => ({ id: b.batch_id, batch_no: b.batch_no }))}
        selected={selectedBatchIds}
        onToggle={toggleBatch}
      />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fill: "#475569", fontSize: 11 }} />
          <Tooltip content={<CustomTooltip formatter={fmtNum} />} />
          <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} formatter={(v) => <span style={{ color: "#334155" }}>{v}</span>} />
          <ReferenceLine y={0} stroke="#CBD5E1" />
          {batchDefs.map((batch, bi) => [
            <Bar key={`${batch.batch_no}-req`} dataKey={`${batch.batch_no} · Req`} fill={BATCH_REQ_COLORS[bi % BATCH_REQ_COLORS.length]} radius={[4, 4, 0, 0]} />,
            <Bar key={`${batch.batch_no}-act`} dataKey={`${batch.batch_no} · Act`} fill={BATCH_ACT_COLORS[bi % BATCH_ACT_COLORS.length]} radius={[4, 4, 0, 0]} />,
          ])}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        {batchDefs.map((batch, bi) => (
          <React.Fragment key={bi}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#475569" }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: BATCH_REQ_COLORS[bi % BATCH_REQ_COLORS.length], display: "inline-block" }} />
              {batch.batch_no} Required
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#475569" }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: BATCH_ACT_COLORS[bi % BATCH_ACT_COLORS.length], display: "inline-block" }} />
              {batch.batch_no} Actual
            </span>
          </React.Fragment>
        ))}
      </div>
    </>
  );

  const renderConsumptionChartContent = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={consumptionData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis tick={{ fill: "#475569", fontSize: 11 }} />
        <Tooltip content={<CustomTooltip formatter={fmtNum} />} />
        <Legend
          wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
          onClick={(entry) => setFocusedCons((prev) => prev === entry.value ? null : entry.value)}
          formatter={(v, entry) => (
            <span style={{
              color: focusedCons === null || focusedCons === v ? entry.color : "#CBD5E1",
              fontWeight: focusedCons === v ? 700 : 400,
              cursor: "pointer",
              userSelect: "none",
            }}>
              {v}{focusedCons === v ? " ✦" : ""}
            </span>
          )}
        />
        {seriesCons.map((s, i) => (
          <Line
            key={s.stock_item_id}
            type="monotone"
            dataKey={s.code}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={focusedCons === s.code ? 4 : 2.5}
            strokeOpacity={focusedCons === null || focusedCons === s.code ? 1 : 0.1}
            dot={focusedCons === null || focusedCons === s.code
              ? { r: 5, fill: SERIES_COLORS[i % SERIES_COLORS.length], strokeWidth: 2, stroke: "#fff" }
              : false
            }
            activeDot={focusedCons === null || focusedCons === s.code ? { r: 7 } : false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderCostChartContent = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={costData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis tick={{ fill: "#475569", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip formatter={fmtCurrency} />} />
        <Legend
          wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
          onClick={(entry) => setFocusedCost((prev) => prev === entry.value ? null : entry.value)}
          formatter={(v, entry) => (
            <span style={{
              color: focusedCost === null || focusedCost === v ? entry.color : "#CBD5E1",
              fontWeight: focusedCost === v ? 700 : 400,
              cursor: "pointer",
              userSelect: "none",
            }}>
              {v}{focusedCost === v ? " ✦" : ""}
            </span>
          )}
        />
        {seriesCost.map((s, i) => (
          <Line
            key={s.stock_item_id}
            type="monotone"
            dataKey={s.code}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={focusedCost === s.code ? 4 : 2.5}
            strokeOpacity={focusedCost === null || focusedCost === s.code ? 1 : 0.1}
            dot={focusedCost === null || focusedCost === s.code
              ? { r: 5, fill: SERIES_COLORS[i % SERIES_COLORS.length], strokeWidth: 2, stroke: "#fff" }
              : false
            }
            activeDot={focusedCost === null || focusedCost === s.code ? { r: 7 } : false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  /* group stock items by category */
  const categoryGroups = stockItems.reduce((acc, si) => {
    const cat = si.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(si);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px 24px", fontFamily: "'Poppins', sans-serif", background: "#F0F4FF", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1E3C72 0%, #2A5298 60%, #3B82F6 100%)",
        borderRadius: 16,
        padding: "22px 28px",
        marginBottom: 24,
        boxShadow: "0 6px 30px rgba(30,58,114,0.25)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div>
          <p style={{ margin: 0, color: "#BAE6FD", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
            Batch Comparison
          </p>
          <h4 style={{ margin: "4px 0 2px", color: "#FFFFFF", fontWeight: 700, fontSize: 22 }}>
            {model.main_model?.name || "–"} &nbsp;/&nbsp; {model.name || "–"}
          </h4>
          <span style={{ color: "#93C5FD", fontSize: 13 }}>
            Color: {model.color || "–"} &nbsp;·&nbsp; Sizes: {(model.sizes || []).join(", ") || "–"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, maxWidth: "55vw" }}>
          {batches.map((b) => (
            <div key={b.id} style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "8px 16px",
              color: "#F0F9FF",
              backdropFilter: "blur(4px)",
              flexShrink: 0,
            }}>
              <p style={{ margin: 0, fontSize: 11, color: "#BAE6FD", fontWeight: 600 }}>BATCH</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{b.batch_no}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#93C5FD" }}>
                Qty: {Object.values(b.qty_json || {}).reduce((s, v) => s + (parseFloat(v) || 0), 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category badges ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        {Object.entries(categoryGroups).map(([cat, items]) => {
          const badge = CATEGORY_BADGE[cat] || { bg: "#F1F5F9", color: "#475569", label: cat };
          return (
            <div key={cat} style={{
              background: badge.bg,
              borderRadius: 24,
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ background: badge.color, width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: badge.color, fontSize: 12, fontWeight: 700 }}>{badge.label}</span>
              <span style={{ color: badge.color, fontSize: 12, opacity: 0.8 }}>
                {items.map((i) => i.code).join(", ")}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Chart 1: Required vs Actual Consumption ── */}
      <ChartCard
        title="Required vs Actual Consumption"
        subtitle="Per material · grouped by batch — lower actual than required is better"
        accent="#1D4ED8"
        onFullscreen={() => setFullscreen("bar")}
      >
        <div style={{ height: 380 }}>{renderBarChartContent()}</div>
      </ChartCard>

      {/* ── Charts 2 & 3 side by side on wider screens ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 28 }}>

        {/* ── Chart 2: Consumption Trend ── */}
        <ChartCard
          title="Actual Consumption Trend"
          subtitle="Units consumed per item across batches"
          accent="#065F46"
          onFullscreen={() => setFullscreen("consumption")}
        >
          <div style={{ height: 320 }}>{renderConsumptionChartContent()}</div>
        </ChartCard>


      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 28 }}>

        {/* ── Chart 3: Cost Trend ── */}
        <ChartCard
          title="Total Cost Trend"
          subtitle="Total issued cost per material across batches (Rs)"
          accent="#B45309"
          onFullscreen={() => setFullscreen("cost")}
        >
          <div style={{ height: 320 }}>{renderCostChartContent()}</div>
        </ChartCard>

      </div>

      {/* ── Fullscreen Modal ── */}
      {fullscreen === "bar" && (
        <FullscreenModal
          title="Required vs Actual Consumption"
          subtitle="Per material · grouped by batch — lower actual than required is better"
          accent="#1D4ED8"
          onClose={() => setFullscreen(null)}
        >
          <div style={{ height: "calc(100vh - 220px)" }}>{renderBarChartContent()}</div>
        </FullscreenModal>
      )}
      {fullscreen === "consumption" && (
        <FullscreenModal
          title="Actual Consumption Trend"
          subtitle="Units consumed per item across batches"
          accent="#065F46"
          onClose={() => setFullscreen(null)}
        >
          <div style={{ height: "calc(100vh - 180px)" }}>{renderConsumptionChartContent()}</div>
        </FullscreenModal>
      )}
      {fullscreen === "cost" && (
        <FullscreenModal
          title="Total Cost Trend"
          subtitle="Total issued cost per material across batches (Rs)"
          accent="#B45309"
          onClose={() => setFullscreen(null)}
        >
          <div style={{ height: "calc(100vh - 180px)" }}>{renderCostChartContent()}</div>
        </FullscreenModal>
      )}

      {/* ── Comparison Table ── */}
      {/* <ChartCard title="Batch Comparison Detail" subtitle="Raw comparison data per material per batch" accent="#5B21B6">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1E3C72" }}>
                <th style={thStyle}>Material</th>
                <th style={thStyle}>Category</th>
                {batches.map((b) => (
                  <React.Fragment key={b.id}>
                    <th style={{ ...thStyle, borderLeft: "2px solid #4FC3F7" }}>{b.batch_no} · Req Qty</th>
                    <th style={thStyle}>{b.batch_no} · Issued Qty</th>
                    <th style={thStyle}>{b.batch_no} · Avg Price</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {stockItems.map((si, rowIdx) => {
                const badge = CATEGORY_BADGE[si.category] || { bg: "#F1F5F9", color: "#475569", label: si.category };
                const comparison = apiData?.comparison || {};
                const siComp = comparison[String(si.stock_item_id)] || {};
                return (
                  <tr key={si.stock_item_id} style={{ background: rowIdx % 2 === 0 ? "#F8FAFF" : "#FFFFFF" }}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: "#1E293B" }}>{si.code}</span>
                      <br />
                      <span style={{ color: "#64748B", fontSize: 11 }}>{si.name}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        background: badge.bg,
                        color: badge.color,
                        borderRadius: 12,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}>{badge.label}</span>
                    </td>
                    {batches.map((b) => {
                      const entry = siComp[String(b.id)] || {};
                      return (
                        <React.Fragment key={b.id}>
                          <td style={{ ...tdStyle, borderLeft: "2px solid #E2E8F0" }}>
                            {entry.total_qty != null ? Number(entry.total_qty).toLocaleString() : "–"}
                          </td>
                          <td style={tdStyle}>
                            {entry.total_issued_qty != null ? Number(entry.total_issued_qty).toLocaleString() : "–"}
                          </td>
                          <td style={tdStyle}>
                            {entry.avg_grn_price != null ? fmtCurrency(entry.avg_grn_price) : "–"}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard> */}

    </div>
  );
};

const thStyle = {
  padding: "10px 14px",
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: 12,
  textAlign: "left",
  letterSpacing: 0.5,
};

const tdStyle = {
  padding: "10px 14px",
  color: "#334155",
  borderBottom: "1px solid #E2E8F0",
  fontSize: 13,
};

export default CSCharts;
