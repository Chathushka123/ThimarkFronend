import React from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

const DATE_COLS = ['first_consumed', 'last_consumed', 'created_at', 'updated_at', 'date']

const PCT_COLS = ['pct_of_model_consumption', 'pct_of_all_consumption']
const QTY_COLS = ['total_qty_consumed', 'avg_qty_per_mrn', 'total_consumption_value']

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
                    <div className="d-flex justify-content-end align-items-center flex-wrap">
                        <Button item={componentList["buttonRunReport"]} style={S.runBtn} className="mr-2">
                            <i className="fas fa-play mr-1"></i> Run Report
                        </Button>
                        <Button item={componentList["buttonDownloadCsv"]} style={S.downloadBtn}>
                            <i className="fas fa-file-csv mr-1"></i> Download CSV
                        </Button>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div className={REPORT_CARD_CLASS} style={S.card}>
                        <div style={S.cardBody}>
                            <div className="form-row align-items-end">
                                <div className="form-group col-lg-5 col-md-7 col-12">
                                    <span style={S.label}>Query Selector</span>
                                    <DropDown
                                        item={componentList["inputQueryType"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                            </div>

                            <div style={S.resultBar}>
                                <span style={S.resultTitle}>{isMatrix ? 'Model × Material Matrix' : 'Result'}</span>
                                <span style={S.resultCount}>Row Count: {count}</span>
                            </div>

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
                                                    style={reportRowStyle(idx)}
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
