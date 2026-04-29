import React from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'

const DATE_COLS = ['first_consumed', 'last_consumed', 'created_at', 'updated_at', 'date']

const PCT_COLS  = ['pct_of_model_consumption', 'pct_of_all_consumption']
const QTY_COLS  = ['total_qty_consumed', 'avg_qty_per_mrn', 'total_consumption_value']

// Columns that are part of a query-4 matrix (dynamic model columns) are numeric —
// we detect them by exclusion when the query type is 4.
const KNOWN_TEXT_COLS = ['material_id', 'material_code', 'material_name', 'category',
    'unit', 'description', 'model_id', 'model_name', 'model_code', 'batch', 'batch_no']

function formatCellValue(col, value, queryType) {
    if (value === null || value === undefined || value === '') return ''
    const colLower = col.toLowerCase()

    if (DATE_COLS.includes(colLower)) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('en-CA')
    }
    if (PCT_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) return `${n.toFixed(2)}%`
    }
    if (QTY_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }
    // Matrix (query 4): non-text columns are model quantities — format as numbers
    if (queryType === '4' && !KNOWN_TEXT_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }
    return String(value)
}

function humanHeader(col) {
    return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// For matrix view (query 4): highlight non-zero cells lightly
function matrixTdStyle(col, value, queryType) {
    if (queryType !== '4') return {}
    const colLower = col.toLowerCase()
    if (KNOWN_TEXT_COLS.includes(colLower)) return {}
    const n = parseFloat(value)
    if (!isNaN(n) && n > 0) return { background: '#eff6ff', fontWeight: '600', color: '#1e40af' }
    return {}
}

const S = {
    card: {
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
        marginBottom: '22px',
        overflow: 'visible',
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #000841 0%, #020f75 100%)',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBody: { padding: '20px' },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#0f014b',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '4px',
        display: 'block',
    },
    tableWrapper: {
        overflowX: 'auto',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '900px',
    },
    th: {
        background: '#1a1a2e',
        color: '#fff',
        padding: '10px',
        textAlign: 'left',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
    },
    thMatrix: {
        background: '#1a1a2e',
        color: '#fff',
        padding: '10px',
        textAlign: 'center',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        maxWidth: '90px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    td: {
        padding: '8px 10px',
        borderBottom: '1px solid #edf2f7',
        fontSize: '12px',
        color: '#2d3748',
        whiteSpace: 'nowrap',
    },
    stateMessage: {
        padding: '28px 14px',
        textAlign: 'center',
        color: '#64748b',
        fontWeight: '600',
    }
}

export function generateMaterialConsumptionPerModelDisplay(componentList, state) {
    const { rows, columns, loading, error, count, queryType } = state
    const isMatrix = queryType === '4'

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                <div className="loading" id="spinner" style={{ display: loading ? '' : 'none' }}>Loading&#8230;</div>

                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1>{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <span>
                                <i className="fas fa-filter" style={{ marginRight: '8px' }}></i>
                                Report Filters
                            </span>
                            <span style={{ fontSize: '11px', opacity: 0.85 }}>
                                Select query type and run
                            </span>
                        </div>
                        <div style={S.cardBody}>
                            <div className="form-row align-items-end">
                                <div className="form-group col-lg-5 col-md-7 col-12">
                                    <span style={S.label}>Query Selector</span>
                                    <DropDown
                                        item={componentList["inputQueryType"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                <div className="form-group col-12 d-flex justify-content-end flex-wrap">
                                    <Button
                                        className="btn common-btn btn-sm mr-2 mb-2"
                                        item={componentList["buttonRunReport"]}
                                    >
                                        <i className="fas fa-play mr-1"></i> Run Report
                                    </Button>
                                    <Button
                                        className="btn btn-success btn-sm mb-2"
                                        item={componentList["buttonDownloadCsv"]}
                                    >
                                        <i className="fas fa-file-csv mr-1"></i> Download CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <span>
                                <i className="fas fa-table" style={{ marginRight: '8px' }}></i>
                                {isMatrix ? 'Model × Material Matrix' : 'Result'}
                            </span>
                            <span style={{ fontSize: '11px', opacity: 0.85 }}>
                                Row Count: {count}
                            </span>
                        </div>
                        <div style={S.cardBody}>
                            {error && (
                                <div style={{ ...S.stateMessage, color: '#b91c1c' }}>{error}</div>
                            )}

                            {!error && loading && (
                                <div style={S.stateMessage}>Loading report data...</div>
                            )}

                            {!error && !loading && rows.length === 0 && (
                                <div style={S.stateMessage}>No data found. Select a query type and click Run Report.</div>
                            )}

                            {!error && !loading && rows.length > 0 && (
                                <div style={S.tableWrapper}>
                                    <table style={S.table}>
                                        <thead>
                                            <tr>
                                                {columns.map(col => (
                                                    <th
                                                        key={col}
                                                        style={isMatrix ? S.thMatrix : S.th}
                                                        title={isMatrix ? humanHeader(col) : undefined}
                                                    >
                                                        {humanHeader(col)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={{ background: idx % 2 === 0 ? '#fff' : '#f8f9fb' }}
                                                >
                                                    {columns.map(col => (
                                                        <td
                                                            key={`${idx}-${col}`}
                                                            style={{ ...S.td, ...matrixTdStyle(col, row[col], queryType) }}
                                                        >
                                                            {formatCellValue(col, row[col], queryType)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
