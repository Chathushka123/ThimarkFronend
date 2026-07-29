import React from 'react'
import { ControlCenter, DropDown, DateField, Button } from '../../../../BASE/Components'
import { REPORT_STYLES as S, REPORT_CARD_CLASS, reportRowStyle } from '../ReportsCommon'

export function generateDailyOutputDisplay(componentList, state, handlers) {
    const { rows, columns, loading, error, isDateRange, count } = state

    const clickOn = () => {
        console.log("Clicked")
    }

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
                                <div className="form-group col-lg-4 col-md-6 col-12">
                                    <span style={S.label}>Query Selector</span>
                                    <DropDown
                                        item={componentList["inputQueryType"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                {isDateRange && (
                                    <>
                                        <div className="form-group col-lg-3 col-md-6 col-12">
                                            <span style={S.label}>From Date</span>
                                            <DateField item={componentList["inputFromDate"]} dateFormat="yyyy-MM-dd" />
                                        </div>
                                        <div className="form-group col-lg-3 col-md-6 col-12">
                                            <span style={S.label}>To Date</span>
                                            <DateField item={componentList["inputToDate"]} dateFormat="yyyy-MM-dd" />
                                        </div>
                                    </>
                                )}

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

                            {error && <div style={{ ...S.stateMessage, color: '#b91c1c' }}>{error}</div>}

                            {!error && loading && (
                                <div style={S.stateMessage}>Loading report data...</div>
                            )}

                            {!error && !loading && rows.length === 0 && (
                                <div style={S.stateMessage}>No data found</div>
                            )}

                            {!error && !loading && rows.length > 0 && (
                                <div style={S.tableWrapper}>
                                    <table style={S.table}>
                                        <thead>
                                            <tr>
                                                {columns.map(col => (
                                                    <th key={col} style={S.th}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, idx) => (
                                                <tr key={idx} style={reportRowStyle(idx)}>
                                                    {columns.map(col => (
                                                        <td key={`${idx}-${col}`} style={S.td}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}</td>
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
