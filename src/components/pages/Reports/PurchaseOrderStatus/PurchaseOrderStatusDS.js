import React from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

const DATE_COLS = ['order_date', 'expected_delivery_date', 'po_delivery_date', 'line_delivery_date', 'created_at', 'last_updated']
const MONEY_COLS = ['subtotal', 'discount', 'tax', 'shipping_cost', 'total_amount', 'line_total']
const QTY_COLS = ['qty_ordered', 'qty_received_via_grn', 'qty_outstanding']
const STATUS_COLS = ['status', 'po_status', 'delivery_flag', 'grn_status', 'receipt_status']

const BADGE = {
    success: { background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    warning: { background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    danger: { background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    info: { background: '#e0f2fe', color: '#075985', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
    neutral: { background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: '700', fontSize: '11px' },
}

function badgeStyle(value) {
    if (!value) return BADGE.neutral
    const v = String(value).toLowerCase()
    if (v.includes('complete') || v.includes('received') || v.includes('closed') || v.includes('reconciled')) return BADGE.success
    if (v.includes('pending') || v.includes('partial') || v.includes('in progress')) return BADGE.warning
    if (v.includes('overdue') || v.includes('cancel') || v.includes('failed') || v.includes('late')) return BADGE.danger
    if (v.includes('open') || v.includes('issued') || v.includes('created')) return BADGE.info
    return BADGE.neutral
}

function formatCellValue(col, value) {
    if (value === null || value === undefined || value === '') return ''
    const colLower = col.toLowerCase()

    if (DATE_COLS.includes(colLower)) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('en-CA')
    }

    if (MONEY_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    if (QTY_COLS.includes(colLower)) {
        const n = parseFloat(value)
        if (!isNaN(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 3 })
    }

    if (colLower === 'days_to_delivery') {
        const n = parseFloat(value)
        if (!isNaN(n)) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    }

    return String(value)
}

function humanHeader(col) {
    return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function generatePurchaseOrderStatusDisplay(componentList, state) {
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
                                                        const colLower = col.toLowerCase()
                                                        const rawVal = row[col]
                                                        const isStatus = STATUS_COLS.includes(colLower)
                                                        const isOverdueDays = colLower === 'days_to_delivery' && !isNaN(parseFloat(rawVal)) && parseFloat(rawVal) < 0
                                                        return (
                                                            <td key={`${idx}-${col}`} style={{ ...S.td, ...(isOverdueDays ? S.overdueTd : {}) }}>
                                                                {isStatus && rawVal !== null && rawVal !== undefined && rawVal !== ''
                                                                    ? <span style={badgeStyle(rawVal)}>{String(rawVal)}</span>
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
