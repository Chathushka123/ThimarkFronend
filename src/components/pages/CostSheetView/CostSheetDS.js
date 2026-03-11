import React from 'react'
import { ControlCenter, Button, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(val, decimals = 2) {
    if (val === null || val === undefined || val === '') return '–'
    const num = parseFloat(val)
    if (isNaN(num)) return '–'
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function groupSubtotal(items = []) {
    return items.reduce(
        (acc, item) => ({
            required: acc.required + (parseFloat(item.total_required_cost) || 0),
            issued:   acc.issued   + (parseFloat(item.total_issued_cost)   || 0),
        }),
        { required: 0, issued: 0 }
    )
}

// ─── Category Colour Palette ──────────────────────────────────────────────────

const CATEGORY_PALETTE = {
    'Raw Materials':          '#2980b9',
    'Machined Parts':         '#8e44ad',
    'Purchased Components':   '#27ae60',
    'Packaging':              '#e67e22',
    'Others':                 '#7f8c8d',
}

function getPaletteColor(category) {
    return CATEGORY_PALETTE[category] || '#495057'
}

// ─── Inline Style Map ─────────────────────────────────────────────────────────

const S = {
    card: {
        background: '#f5fdfa',
        borderRadius: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        marginBottom: '20px',
        overflow: 'hidden',
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #0C2C55 0%, #296374 100%)',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoBody: { padding: '16px 8px' },
    fieldWrap: { padding: '6px 10px', marginBottom: '4px' },
    fieldInner: (hi) => ({
        padding: '10px 14px',
        background:'linear-gradient(135deg, #BDE8F5 0%, #4988C4 100%)',
        borderRadius: '8px',
        borderLeft: '4px solid #1D4ED8',
        borderRight: '1px solid #1D4ED8',
        borderTop: '1px solid #1D4ED8',
        borderBottom: '1px solid #1D4ED8',
        height: '100%',
    }),
    fieldLabel: (hi) => ({
        fontSize: '10px',
        fontWeight: '800',
        color: hi ? '#0f014b' : '#0f014b',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '4px',
    }),
    fieldValue: (hi) => ({
        fontSize: '13px',
        fontWeight: '700',
        color: hi ? '#0f014b' : '#0f014b',
        wordBreak: 'break-word',
        lineHeight: '1.3',
    }),
    tableWrapper: {
        marginTop: '10px',
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 250px)',
        minHeight: '200px',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    thead: { position: 'sticky', top: 0, zIndex: 2 },
    th: {
        background: '#1A3263    ',
        color: '#fff',
        padding: '10px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
        borderRight: '1px solid rgba(255,255,255,0.1)',
    },
    thNum: { textAlign: 'right' },
    groupRow: (c) => ({
        background: `${c}18`,
        cursor: 'pointer',
        userSelect: 'none',
        // borderLeft: `4px solid ${c}`,
        borderTop: '2px solid #e9ecef',
        borderBottom: '1px solid #444444',
    }),
    groupCell: {
        padding: '9px 12px',
        fontWeight: '600',
        fontSize: '12px',
        color: '#2c3e50',
        verticalAlign: 'middle',
    },
    groupBadge: (c) => ({
        background: c,
        color: '#fff',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        marginRight: '8px',
        letterSpacing: '0.3px',
        display: 'inline-block',
    }),
    groupCount: { color: '#6c757d', fontSize: '11px', marginRight: '8px' },
    groupSubCell: (c) => ({
        padding: '9px 10px',
        fontWeight: '700',
        fontSize: '12px',
        textAlign: 'right',
        color: '#2c3e50',
        background: `${c}22`,
        fontFamily: "'Courier New', monospace",
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
    }),
    evenRow: { background: '#ffffff' },
    oddRow:  { background: '#f8f9fb' },
    td: {
        padding: '7px 10px',
        borderBottom: '1px solid #edf2f7',
        color: '#090033',
        verticalAlign: 'middle',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    tdNum: { textAlign: 'right', color: '#090033', fontWeight: 'bold', fontFamily: "'Courier New', monospace", fontVariantNumeric: 'tabular-nums' },
    matName: { fontWeight: 'bold', color: '#090033' },
    unitBadge: {
        background: '#e2e8f0',
        color: '#4a5568',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.3px',
    },
    overIssued:  { background: '#fff5f5', color: '#c53030', fontWeight: '600' },
    underIssued: { background: '#fffbeb', color: '#b45309' },
    warnIcon:    { color: '#e53e3e', marginLeft: '5px', fontSize: '10px' },
    grandRow: {
        background: '#1A3263',
        borderTop: '3px solid #4fc3f7',
    },
    grandLabel: {
        padding: '12px 16px',
        color: '#fff',
        fontWeight: '700',
        fontSize: '13px',
        letterSpacing: '1px',
    },
    grandCell: {
        padding: '12px 10px',
        color: '#fff',
        fontWeight: '700',
        fontSize: '15px',
        textAlign: 'right',
        fontFamily: "'Courier New', monospace",
        whiteSpace: 'nowrap',
    },
    varNote: { fontSize: '12px', fontWeight: '400', marginTop: '2px', opacity: 0.85 },
    emptyWrap: { textAlign: 'center', padding: '80px 20px' },
    emptyIcon: { fontSize: '64px', color: '#dee2e6', marginBottom: '20px', display: 'block' },
    emptyText: { fontSize: '16px', color: '#adb5bd', margin: 0 },
}

// ─── Info Field ───────────────────────────────────────────────────────────────

function InfoField({ label, value, icon, highlight }) {
    return (
        <div className="col-xl-2 col-md-4 col-sm-6 col-12" style={S.fieldWrap}>
            <div style={S.fieldInner(highlight)}>
                <div style={S.fieldLabel(highlight)}>
                    {icon && <i className={icon} style={{ marginRight: '4px' }}></i>}
                    {label}
                </div>
                <div style={S.fieldValue(highlight)}>{value || '–'}</div>
            </div>
        </div>
    )
}

// ─── Table Column Config ──────────────────────────────────────────────────────

const TABLE_COLS = [
    { label: 'Material Code',     width: '12%', numeric: false },
    { label: 'Material Name',     width: '19%', numeric: false },
    { label: 'Req. Qty',          width: '10%', numeric: true  },
    { label: 'Consumption',       width: '10%', numeric: true  },
    { label: 'Issued Qty',        width: '10%', numeric: true  },
    { label: 'Actual Consumption',  width: '10%', numeric: true  },
    { label: 'Unit Cost (LKR)',         width: '13%', numeric: true  },
    { label: 'Total Req. Cost (LKR)',   width: '13%', numeric: true  },
    { label: 'Total Issued Cost (LKR)', width: '13%', numeric: true  },
]

// ─── Main Display Function ────────────────────────────────────────────────────

export function generateCostSheetDisplay(componentList, costSheetData, expandedGroups, toggleGroup) {

    let grandRequired = 0
    let grandIssued   = 0

    if (costSheetData && costSheetData.material_groups) {
        costSheetData.material_groups.forEach(g => {
            const sub = groupSubtotal(g.items)
            grandRequired += sub.required
            grandIssued   += sub.issued
        })
    }

    const variance       = grandIssued - grandRequired
    const totalGroups    = costSheetData ? (costSheetData.material_groups || []).length : 0
    const totalMaterials = costSheetData
        ? (costSheetData.material_groups || []).reduce((acc, g) => acc + (g.items || []).length, 0)
        : 0

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

                {/* ── Page Header ────────────────────────────────────────────── */}
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1>{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                                <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search">
                                    <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                    <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                                </AdvanceSearch>
                                <Button
                                    className="btn common-btn common-btn-erp btn-sm mr-2"
                                    item={componentList["buttonAdvanceSearch"]}
                                >
                                    <i className="fas fa-search fa-lg"></i>
                                </Button>
                                <Button
                                    className="btn btn-success btn-sm mr-2"
                                    style={{background: "#1d6f42", color: "#fff"}}
                                    item={componentList["buttonExcel"]}
                                    disabled={!costSheetData}
                                >
                                    <i className="fas fa-file-excel fa-lg"></i> Download Excel
                                </Button>
                                <button
                                    className="btn btn-info btn-sm mr-2"
                                    style={{background: "#1D4ED8", borderColor: "#1D4ED8", color: "#fff"}}
                                    disabled={!costSheetData?.model_id}
                                    onClick={() => window.open(`/csCharts/${costSheetData.model_id}`, '_blank')}
                                >
                                    <i className="fas fa-chart-line fa-lg"></i> View Charts
                                </button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    {/* ── Empty State ─────────────────────────────────────────── */}
                    {!costSheetData ? (
                        <div style={S.emptyWrap}>
                            <i className="fas fa-file-invoice-dollar" style={S.emptyIcon}></i>
                            <p style={S.emptyText}>
                                Use the <strong>Search</strong> button to find and view a Cost Sheet
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* ── Part Information Card ──────────────────────── */}
                            <div style={S.card}>
                                <div style={S.cardHeader}>
                                    <span>
                                        <i className="fas fa-file-invoice" style={{ marginRight: '8px' }}></i>
                                        Meta Information
                                    </span>
                                </div>
                                <div style={S.infoBody}>
                                    <div className="row" style={{ margin: 0 }}>
                                        <InfoField label="Batch No"           value={costSheetData.batch_no}      icon="fas fa-cog"         />
                                        <InfoField label="Main Model"          value={costSheetData.main_model_name} icon="fas fa-motorcycle"  />
                                        <InfoField label="Model"               value={costSheetData.model_name}      icon="fas fa-motorcycle"  />
                                        <InfoField label="Total Qty"           value={costSheetData.total_qty}       icon="fas fa-hashtag"     />
                                        <InfoField label="Color"            value={costSheetData.color}       icon="fas fa-code-branch" />
                                        <InfoField
                                            label="Total Material Cost"
                                            value={`LKR ${fmt(costSheetData.total_material_cost)}`}
                                            icon="fas fa-coins"
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Material Breakdown Table ───────────────────── */}
                            <div style={S.card}>
                                <div style={S.cardHeader}>
                                    <span>
                                        <i className="fas fa-layer-group" style={{ marginRight: '8px' }}></i>
                                        Material Breakdown
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }}>
                                        {totalMaterials} materials &bull; {totalGroups} categories
                                    </span>
                                </div>

                                <div         className="scroll-thin" style={S.tableWrapper}>
                                    <table style={S.table}>
                                        <colgroup>
                                            {TABLE_COLS.map((col, i) => (
                                                <col key={i} style={{ width: col.width }} />
                                            ))}
                                        </colgroup>

                                        <thead style={S.thead}>
                                            <tr>
                                                {TABLE_COLS.map((col, i) => (
                                                    <th key={i} style={col.numeric ? { ...S.th, ...S.thNum } : S.th}>
                                                        {col.label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {(costSheetData.material_groups || []).map((group, gi) => {
                                                const color      = getPaletteColor(group.category)
                                                const sub        = groupSubtotal(group.items)
                                                const isExpanded = expandedGroups[group.category] !== false

                                                return (
                                                    <React.Fragment key={gi}>

                                                        {/* ── Group Header Row ── */}
                                                        <tr
                                                            style={S.groupRow(color)}
                                                            onClick={() => toggleGroup(group.category)}
                                                            title={`Click to ${isExpanded ? 'collapse' : 'expand'} ${group.category}`}
                                                        >
                                                            <td colSpan={7} style={S.groupCell}>
                                                                <span style={S.groupBadge(color)}>{group.category}</span>
                                                                <span style={S.groupCount}>{(group.items || []).length} items</span>
                                                                <i
                                                                    className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}
                                                                    style={{ color: '#6c757d', fontSize: '10px' }}
                                                                />
                                                            </td>
                                                            <td style={S.groupSubCell(color)}>{fmt(sub.required)}</td>
                                                            <td style={S.groupSubCell(color)}>{fmt(sub.issued)}</td>
                                                        </tr>

                                                        {/* ── Material Rows ── */}
                                                        {isExpanded && (group.items || []).map((item, ri) => {
                                                            const reqQty  = parseFloat(item.required_qty) || 0
                                                            const issQty  = parseFloat(item.issued_qty)   || 0
                                                            const isOver  = issQty > reqQty && reqQty > 0
                                                            const isUnder = issQty > 0 && issQty < reqQty

                                                            return (
                                                                <tr
                                                                    key={ri}
                                                                    style={ri % 2 === 0 ? S.evenRow : S.oddRow}
                                                                    title={item.description || item.material_name || ''}
                                                                >
                                                                    <td style={S.td}>
                                                                        {/* <code style={{ color: '#4a5568', fontSize: '11px', background: 'transparent' }}>
                                                                            {item.material_code}
                                                                        </code> */}
                                                                        <span style={S.matName}>{item.material_code}</span>
                                                                    </td>
                                                                    <td style={S.td}>
                                                                        <span style={S.matName}>{item.material_name}</span>
                                                                    </td>
                                                                    <td style={{ ...S.td, ...S.tdNum }}>
                                                                        {fmt(item.required_qty)}
                                                                    </td>
                                                                    <td style={{ ...S.td, ...S.tdNum }}>
                                                                        {fmt(item.consumption)}
                                                                    </td>
                                                                    <td style={{
                                                                        ...S.td, ...S.tdNum,
                                                                        ...(isOver  ? S.overIssued  : {}),
                                                                        ...(isUnder ? S.underIssued : {}),
                                                                    }}>
                                                                        {fmt(item.issued_qty)}
                                                                        {isOver && (
                                                                            <i
                                                                                className="fas fa-exclamation-triangle"
                                                                                style={S.warnIcon}
                                                                                title="Over-issued: quantity exceeds requirement"
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td style={{ ...S.td, ...S.tdNum }}>
                                                                        {fmt(item.actual_consumption)}
                                                                    </td>
                                                                    <td style={{ ...S.td, ...S.tdNum }}>
                                                                        {fmt(item.unit_cost)}
                                                                    </td>
                                                                    <td style={{ ...S.td, ...S.tdNum }}>
                                                                        {fmt(item.total_required_cost)}
                                                                    </td>
                                                                    <td style={{
                                                                        ...S.td, ...S.tdNum,
                                                                        ...(isOver ? S.overIssued : {}),
                                                                    }}>
                                                                        {fmt(item.total_issued_cost)}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </React.Fragment>
                                                )
                                            })}

                                            {/* ── Grand Total Row ── */}
                                            <tr style={S.grandRow}>
                                                <td colSpan={7} style={S.grandLabel}>
                                                    <i className="fas fa-calculator" style={{ marginRight: '8px' }}></i>
                                                    GRAND TOTAL
                                                </td>
                                                <td style={S.grandCell}>{fmt(grandRequired)}</td>
                                                <td style={{
                                                    ...S.grandCell,
                                                    color: variance > 0 ? '#fca5a5' : variance < 0 ? '#fde68a' : '#6ee7b7',
                                                }}>
                                                    {fmt(grandIssued)}
                                                    {variance !== 0 && (
                                                        <div style={S.varNote}>
                                                            Variance: {variance > 0 ? '+' : ''}{fmt(variance)}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </ControlCenter>
        </>
    )
}
