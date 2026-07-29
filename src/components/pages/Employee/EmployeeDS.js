import React from 'react'
import { Button, Grid, GridBody, GridHeader, ControlCenter } from '../../../BASE/Components'

export function generateEmployeeDisplay(componentList, handlers) {

    const rows = componentList["gridEmployees"].data || []
    const totalCount = rows.length
    const selectedCount = rows.filter(row => row._select).length

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                                <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonReloadList"]}>
                                    <i className="fas fa-sync-alt fa-lg"></i>
                                </Button>
                                <button
                                    className="btn btn-success btn-sm mr-2"
                                    type="button"
                                    title="Download as Excel"
                                    onClick={handlers.onDownloadExcel}
                                >
                                    <i className="fas fa-file-excel fa-lg"></i>
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    type="button"
                                    title="Print Employee Stickers"
                                    onClick={handlers.onPrint}
                                >
                                    <i className="fas fa-print fa-lg"></i>
                                </button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ color: '#4a5568', fontSize: '13px', fontWeight: 600 }}>
                            {selectedCount} of {totalCount} selected
                        </span>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <Grid item={componentList["gridEmployees"]}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridEmployees"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridEmployees"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                {totalCount === 0 &&
                                    <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                                        No active employees found.
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </ControlCenter>
        </>
    )
}
