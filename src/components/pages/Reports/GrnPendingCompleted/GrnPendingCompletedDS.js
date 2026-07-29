import React, { useState } from 'react'
import { ControlCenter, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

const DATE_COLS = ['created_at', 'updated_at', 'date', 'grn_date', 'received_date',
    'completed_date', 'po_date', 'order_date', 'last_updated', 'last_movement']

function formatCellValue(col, value) {
    if (value === null || value === undefined || value === '') return ''
    if (DATE_COLS.includes(col.toLowerCase())) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d.toLocaleDateString('en-CA') // YYYY-MM-DD
    }
    return String(value)
}

function humanHeader(col) {
    return col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function FilterableResultTable({ columns, rows }) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(25)
    const [page, setPage] = useState(1)

    const filtered = rows.filter(row => {
        if (globalFilter.trim() === '') return true
        const term = globalFilter.toLowerCase()
        return columns.some(col =>
            formatCellValue(col, row[col]).toLowerCase().includes(term)
        )
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

    function handleFilterChange(val) {
        setGlobalFilter(val)
        setPage(1)
    }

    function handlePageSizeChange(val) {
        setPageSize(Number(val))
        setPage(1)
    }

    const btnBase = {
        border: '1px solid #cbd5e0',
        borderRadius: '5px',
        padding: '4px 10px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        lineHeight: '1.4',
    }

    return (
        <>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px', gap: '8px' }}>
                <i className="fas fa-search" style={{ color: '#64748b', fontSize: '13px' }}></i>
                <input
                    type="text"
                    placeholder="Search all columns..."
                    value={globalFilter}
                    onChange={e => handleFilterChange(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: '1px solid #cbd5e0',
                        borderRadius: '7px',
                        outline: 'none',
                        width: '240px',
                        color: '#2d3748',
                    }}
                />
                {globalFilter && (
                    <button
                        onClick={() => handleFilterChange('')}
                        style={{ ...btnBase, background: '#e53e3e', color: '#fff', border: 'none' }}
                    >
                        <i className="fas fa-times mr-1"></i>Clear
                    </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={e => handlePageSizeChange(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            border: '1px solid #cbd5e0',
                            borderRadius: '6px',
                            color: '#2d3748',
                            cursor: 'pointer',
                        }}
                    >
                        {PAGE_SIZE_OPTIONS.map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    {filtered.length === 0 ? '0 rows' : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} rows`}
                </span>
            </div>

            {/* Table */}
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
                        {pageRows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ ...S.td, textAlign: 'center', color: '#64748b' }}>
                                    No matching records found.
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((row, idx) => (
                                <tr key={idx} style={reportRowStyle(idx)}>
                                    {columns.map(col => (
                                        <td key={`${idx}-${col}`} style={S.td}>
                                            {formatCellValue(col, row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setPage(1)}
                        disabled={safePage === 1}
                        style={{ ...btnBase, background: safePage === 1 ? '#f1f5f9' : '#fff', color: safePage === 1 ? '#a0aec0' : '#2d3748' }}
                    >«</button>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        style={{ ...btnBase, background: safePage === 1 ? '#f1f5f9' : '#fff', color: safePage === 1 ? '#a0aec0' : '#2d3748' }}
                    >‹ Prev</button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                        .reduce((acc, p, i, arr) => {
                            if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                            acc.push(p)
                            return acc
                        }, [])
                        .map((item, i) =>
                            item === '...' ? (
                                <span key={`ellipsis-${i}`} style={{ fontSize: '12px', color: '#64748b', padding: '0 4px' }}>…</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => setPage(item)}
                                    style={{
                                        ...btnBase,
                                        background: item === safePage ? '#1a1a2e' : '#fff',
                                        color: item === safePage ? '#fff' : '#2d3748',
                                        borderColor: item === safePage ? '#1a1a2e' : '#cbd5e0',
                                        minWidth: '32px',
                                    }}
                                >{item}</button>
                            )
                        )
                    }

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        style={{ ...btnBase, background: safePage === totalPages ? '#f1f5f9' : '#fff', color: safePage === totalPages ? '#a0aec0' : '#2d3748' }}
                    >Next ›</button>
                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={safePage === totalPages}
                        style={{ ...btnBase, background: safePage === totalPages ? '#f1f5f9' : '#fff', color: safePage === totalPages ? '#a0aec0' : '#2d3748' }}
                    >»</button>
                </div>
            )}
        </>
    )
}

export function generateGrnPendingCompletedDisplay(componentList, state) {
    const { rows, columns, loading, error, count, fromDate, toDate, setFromDate, setToDate } = state

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
                                <div className="form-group col-lg-3 col-md-4 col-12">
                                    <span style={S.label}>From Date</span>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={fromDate}
                                        onChange={e => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-lg-3 col-md-4 col-12">
                                    <span style={S.label}>To Date</span>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
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
                                <div style={S.stateMessage}>No data found. Select a date range and click Run Report.</div>
                            )}

                            {!error && !loading && rows.length > 0 && (
                                <FilterableResultTable columns={columns} rows={rows} />
                            )}
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
