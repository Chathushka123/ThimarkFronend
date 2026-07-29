import React from 'react'
import { TextBox, Label, CheckBox, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, Button } from '../../../BASE/Components'

export function generateOperationDisplay(componentList) {

    const rows = componentList["gridOperations"].data || []
    const totalCount = rows.length

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
                                <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}>
                                    <i className="far fa-file fa-lg"></i>
                                </NewButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}>
                                    <i className="far fa-save fa-lg"></i>
                                </SaveButton>
                                <Button className="btn common-btn common-btn-erp btn-sm" item={componentList["buttonUndo"]}>
                                    <i className="fas fa-undo fa-lg"></i>
                                </Button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    <div className="form-wrp background-white">
                        <div className="row">
                            <div className="col-12">
                                <div className="form-row">
                                    <TextBox item={componentList["inputId"]} />
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputOperationCode"].label} />
                                        <TextBox item={componentList["inputOperationCode"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-5">
                                        <Label item={componentList["inputDescription"].label} />
                                        <TextBox item={componentList["inputDescription"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-2 d-flex align-items-end pb-2">
                                        <div className="custom-control custom-switch">
                                            <CheckBox item={componentList["inputActive"]} className="custom-control-input" />
                                            <label className="custom-control-label" htmlFor="inputActive">Active</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <Grid item={componentList["gridOperations"]}
                                    customButton={<i className="fa fa-edit"></i>}
                                    deleteButton={<i className="fa fa-trash"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridOperations"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridOperations"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                {totalCount === 0 &&
                                    <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                                        No operations yet &mdash; use "New Operation" to create the first one.
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
