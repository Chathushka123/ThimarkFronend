import React from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'

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
                                Result
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
                                                    <th key={col} style={S.th}>{humanHeader(col)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    style={{ background: idx % 2 === 0 ? '#fff' : '#f8f9fb' }}
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
