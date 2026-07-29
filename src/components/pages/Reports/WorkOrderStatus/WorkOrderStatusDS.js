import React, { useState } from 'react'
import { ControlCenter, DropDown, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

// A two-row grouped header (operation code spanning IN/OUT/WIP) doesn't play
// well with S.th's sticky positioning (both rows would stick at the same
// offset and overlap), so this report's header cells opt out of sticky.
const TH = { ...S.th, position: 'static', top: 'auto' }
const TH_CENTER = { ...TH, textAlign: 'center' }
const TH_SUB = { ...TH_CENTER, fontSize: '10px', borderLeft: '1px solid rgba(255,255,255,0.25)' }

const NA_STYLE = {
    color: '#94a3b8',
    fontStyle: 'italic',
    background: '#f8fafc',
}

function wipStyle(wip) {
    if (wip > 0) return { color: '#92400e', fontWeight: 700 }
    if (wip < 0) return { color: '#b91c1c', fontWeight: 700 }
    return { color: '#065f46', fontWeight: 700 }
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function rowMatches(row, operations, term) {
    const fixedValues = [row.main_model, row.model, row.batch, row.job_id, row.bundle_id, row.trolley]
    if (fixedValues.some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(term))) {
        return true
    }

    return operations.some(op => {
        const inVal = row[`${op.key}_IN`]
        const outVal = row[`${op.key}_OUT`]
        const wipVal = row[`${op.key}_WIP`]
        return [inVal, outVal, wipVal].some(v => {
            const text = v === null ? 'na' : String(v).toLowerCase()
            return text.includes(term)
        })
    })
}

function FilterableWorkOrderStatusTable({ rows, operations }) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(25)
    const [page, setPage] = useState(1)

    const filtered = rows.filter(row => {
        if (globalFilter.trim() === '') return true
        return rowMatches(row, operations, globalFilter.trim().toLowerCase())
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
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
                <span style={{ ...NA_STYLE, padding: '1px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>NA</span>
                {' '}= this operation isn't part of that bundle's route. One row per bundle.
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px', gap: '8px' }}>
                <i className="fas fa-search" style={{ color: '#64748b', fontSize: '13px' }}></i>
                <input
                    type="text"
                    placeholder="Filter loaded rows..."
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

            <div style={S.tableWrapper}>
                <table style={{ ...S.table, minWidth: `${760 + operations.length * 210}px` }}>
                    <thead>
                        <tr>
                            <th style={TH} rowSpan={2}>Main Model</th>
                            <th style={TH} rowSpan={2}>Model</th>
                            <th style={TH} rowSpan={2}>Batch</th>
                            <th style={TH_CENTER} rowSpan={2}>Job ID</th>
                            <th style={TH_CENTER} rowSpan={2}>Bundle ID</th>
                            <th style={TH} rowSpan={2}>Trolley</th>
                            {operations.map(op => (
                                <th
                                    key={op.key}
                                    style={{ ...TH_CENTER, borderLeft: '2px solid rgba(255,255,255,0.4)' }}
                                    colSpan={3}
                                    title={op.description}
                                >
                                    {op.code}
                                </th>
                            ))}
                            <th style={TH_CENTER} rowSpan={2}>Total Reject</th>
                            <th style={TH_CENTER} rowSpan={2}>Total Rework</th>
                            <th style={TH_CENTER} rowSpan={2}>Total Return</th>
                        </tr>
                        <tr>
                            {operations.map(op => (
                                <React.Fragment key={op.key}>
                                    <th style={{ ...TH_SUB, borderLeft: '2px solid rgba(255,255,255,0.4)' }}>IN</th>
                                    <th style={TH_SUB}>OUT</th>
                                    <th style={TH_SUB}>WIP</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td colSpan={9 + operations.length * 3} style={{ ...S.td, textAlign: 'center', color: '#64748b' }}>
                                    No matching records found.
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((row, idx) => (
                                <tr key={row.bundle_id ?? idx} style={reportRowStyle(idx)}>
                                    <td style={S.td}>{row.main_model || ''}</td>
                                    <td style={S.td}>{row.model || ''}</td>
                                    <td style={S.td}>{row.batch || ''}</td>
                                    <td style={{ ...S.td, textAlign: 'center' }}>{row.job_id ?? ''}</td>
                                    <td style={{ ...S.td, textAlign: 'center' }}>{row.bundle_id ?? ''}</td>
                                    <td style={S.td}>{row.trolley || '-'}</td>
                                    {operations.map(op => {
                                        const inVal = row[`${op.key}_IN`]
                                        const outVal = row[`${op.key}_OUT`]
                                        const wipVal = row[`${op.key}_WIP`]
                                        return (
                                            <React.Fragment key={op.key}>
                                                <td style={{ ...S.td, textAlign: 'center', borderLeft: '2px solid #e2e8f0', ...(inVal === null ? NA_STYLE : {}) }}>
                                                    {inVal === null ? 'NA' : inVal}
                                                </td>
                                                <td style={{ ...S.td, textAlign: 'center', ...(outVal === null ? NA_STYLE : {}) }}>
                                                    {outVal === null ? 'NA' : outVal}
                                                </td>
                                                <td style={{ ...S.td, textAlign: 'center', ...(wipVal === null ? NA_STYLE : wipStyle(wipVal)) }}>
                                                    {wipVal === null ? 'NA' : wipVal}
                                                </td>
                                            </React.Fragment>
                                        )
                                    })}
                                    <td style={{ ...S.td, textAlign: 'center' }}>{row.total_reject_qty ?? 0}</td>
                                    <td style={{ ...S.td, textAlign: 'center' }}>{row.total_rework_qty ?? 0}</td>
                                    <td style={{ ...S.td, textAlign: 'center' }}>{row.total_return_qty ?? 0}</td>
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

export function generateWorkOrderStatusDisplay(componentList, state) {
    const { rows, operations, count, loading, error, fromDate, toDate, setFromDate, setToDate } = state

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
                                <div className="form-group col-lg-3 col-md-4 col-12">
                                    <span style={S.label}>{componentList["inputStatus"].label.schema.value}</span>
                                    <DropDown item={componentList["inputStatus"]} className="form-control form-control-sm" />
                                </div>

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
                                <div style={S.stateMessage}>No data found. Select a status/date range and click Run Report.</div>
                            )}

                            {!error && !loading && rows.length > 0 && (
                                <FilterableWorkOrderStatusTable rows={rows} operations={operations} />
                            )}
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
