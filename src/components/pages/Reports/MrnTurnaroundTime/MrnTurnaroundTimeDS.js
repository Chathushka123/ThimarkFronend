import React from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

const DATE_COLS = ['created_at', 'completed_at', 'checked_at', 'updated_at',
    'date', 'last_updated', 'activity_date']

const DURATION_COLS = ['turnaround_mins', 'avg_turnaround_mins']
const HOURS_COLS = ['turnaround_hrs', 'avg_turnaround_hrs', 'hrs_elapsed']

const FLAG_STYLES = {
    fast: { background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    slow: { background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    normal: { background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    critical: { background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    default: { background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
}

function flagStyle(value) {
    if (!value) return FLAG_STYLES.default
    const v = String(value).toLowerCase()
    if (v === 'fast') return FLAG_STYLES.fast
    if (v === 'slow' || v === 'overdue') return FLAG_STYLES.slow
    if (v === 'critical' || v === 'old') return FLAG_STYLES.critical
    if (v === 'normal' || v === 'ok') return FLAG_STYLES.normal
    return FLAG_STYLES.default
}

function formatCellValue(col, value) {
    if (value === null || value === undefined || value === '') return ''
    const colLower = col.toLowerCase()

    if (DATE_COLS.includes(colLower)) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('en-CA')
    }
    if (DURATION_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) {
            const h = Math.floor(n / 60)
            const m = Math.round(n % 60)
            return h > 0 ? `${h}h ${m}m` : `${m}m`
        }
    }
    if (HOURS_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) {
            const h = Math.floor(n)
            const m = Math.round((n - h) * 60)
            return m > 0 ? `${h}h ${m}m` : `${h}h`
        }
    }
    return String(value)
}

function humanHeader(col) {
    return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const FLAG_COL_NAMES = ['speed_flag', 'age_flag']

export function generateMrnTurnaroundTimeDisplay(componentList, state) {
    const { rows, columns, loading, error, count } = state

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

                                <div className="form-group ml-auto mb-0 d-flex justify-content-end align-items-end flex-wrap">
                                    <Button item={componentList["buttonRunReport"]} style={S.runBtn} className="mr-2 mb-2">
                                        <i className="fas fa-play mr-1"></i> Run Report
                                    </Button>
                                    <Button item={componentList["buttonDownloadCsv"]} style={S.downloadBtn} className="mb-2">
                                        <i className="fas fa-file-csv mr-1"></i> Download CSV
                                    </Button>
                                </div>
                            </div>

                            <div style={S.resultBar}>
                                <span style={S.resultTitle}>Result</span>
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
                                                    <th key={col} style={S.th}>{humanHeader(col)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={reportRowStyle(idx)}
                                                >
                                                    {columns.map(col => {
                                                        const isFlag = FLAG_COL_NAMES.includes(col.toLowerCase())
                                                        const rawVal = row[col]
                                                        return (
                                                            <td key={`${idx}-${col}`} style={S.td}>
                                                                {isFlag && rawVal !== null && rawVal !== undefined && rawVal !== ''
                                                                    ? <span style={flagStyle(rawVal)}>{String(rawVal)}</span>
                                                                    : formatCellValue(col, rawVal)
                                                                }
                                                            </td>
                                                        )
                                                    })}
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
