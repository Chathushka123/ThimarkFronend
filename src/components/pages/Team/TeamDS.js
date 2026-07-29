import React from 'react'
import { TextBox, DropDown, Label, CheckBox, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, Button } from '../../../BASE/Components'

export function generateTeamDisplay(componentList) {

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
                                <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonReloadList"]}><i className="fas fa-sync-alt fa-lg"></i></Button>
                                <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                                <Button className="btn common-btn common-btn-erp btn-sm" item={componentList["buttonUndo"]}><i className="fas fa-undo fa-lg"></i></Button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div className="form-wrp background-white">
                        <div className="row">
                            <div className="col-12">
                                <TextBox item={componentList["inputId"]} />
                                <TextBox item={componentList["inputUpdatedAt"]} />
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputTeamCode"].label} />
                                        <TextBox item={componentList["inputTeamCode"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-5">
                                        <Label item={componentList["inputTeamName"].label} />
                                        <TextBox item={componentList["inputTeamName"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <Label item={componentList["inputNoOfOperators"].label} />
                                        <TextBox item={componentList["inputNoOfOperators"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <Label item={componentList["inputActive"].label} />
                                        <div className="form-check">
                                            <CheckBox item={componentList["inputActive"]} className="form-check-input" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputOperation"].label} />
                                        <DropDown item={componentList["inputOperation"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>All Teams</h5>
                                <Grid item={componentList["gridTeams"]}
                                    customButton={<i className="fa fa-edit"></i>}
                                    deleteButton={<i className="fa fa-trash"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridTeams"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridTeams"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                </div>
            </ControlCenter>
        </>
    )
}
