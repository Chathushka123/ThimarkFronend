import React from 'react'
import { Button, Grid, GridBody, GridHeader, ControlCenter } from '../../../BASE/Components'

export function generateOpenGrnDisplay(componentList, handlers) {

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
                                <button
                                    className="btn btn-success btn-sm"
                                    type="button"
                                    title="Download as Excel"
                                    onClick={handlers.onDownloadExcel}
                                >
                                    <i className="fas fa-file-excel fa-lg"></i>
                                </button>
                            </ControlCenter>
                        </div>
                    </div>

                </div>

                <div className="container-fluid custom-container-padding">

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <Grid item={componentList["gridOpenGrns"]}
                                    customButton={<i className="fa fa-save"></i>}
                                    // customButton={<i className="fa fa-edit"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridOpenGrns"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridOpenGrns"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                    <div className="row py-2">
                        <div className="col-12">
                            <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonSave"]}> <i className="fas fa-save fa-lg"></i> Confirm Selected GRNs</Button>
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
