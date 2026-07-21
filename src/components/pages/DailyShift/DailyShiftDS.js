import React from 'react'
import { TextBox, Label, CheckBox, DateField, LovComboBox, Grid, GridBody, GridHeader, AddRowButton, ControlCenter, NewButton, SaveButton, Button } from '../../../BASE/Components'
import { DateTimeField } from './DailyShiftHelpers'

export function generateDailyShiftDisplay(componentList) {

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
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["lovComboBoxShift"].label} />
                                        <LovComboBox item={componentList["lovComboBoxShift"]} className="form-control form-control-sm" lovClassName="lov-search" lovHeaderText="Please Select Shift" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputShiftDate"].label} />
                                        <DateField item={componentList["inputShiftDate"]} dateFormat="yyyy-MM-dd" />
                                    </div>
                                    <div className="form-group col-md-2">
                                        <Label item={componentList["inputActive"].label} />
                                        <div className="form-check">
                                            <CheckBox item={componentList["inputActive"]} className="form-check-input" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputStartDateTime"].label} />
                                        <DateTimeField item={componentList["inputStartDateTime"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputEndDateTime"].label} />
                                        <DateTimeField item={componentList["inputEndDateTime"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <div className="row pb-3">
                                    <div className="col-9"><h5>Team Assignments</h5></div>
                                    <div className="col-3 d-flex justify-content-end">
                                        <AddRowButton typeName="AddRowButton" className="btn common-btn btn-sm w-auto" item={componentList["gridTeamAssignments"]} />
                                    </div>
                                </div>
                                <Grid item={componentList["gridTeamAssignments"]}
                                    deleteButton={<i className="fa fa-trash"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridTeamAssignments"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridTeamAssignments"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>All Daily Shifts</h5>
                                <Grid item={componentList["gridDailyShifts"]}
                                    customButton={<i className="fa fa-edit"></i>}
                                    deleteButton={<i className="fa fa-trash"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridDailyShifts"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridDailyShifts"].data} />
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
