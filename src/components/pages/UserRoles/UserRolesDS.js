import React from 'react'
import { TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateBuyerDisplay(componentList, control) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            <PopUpPage item={componentList["deleteMasterPopUp"]} headerText="Confirm Delete" className="">
                <div className="row p-4 float-right">
                    <TextBox item={componentList["inputDeleteMasterId"]} />
                    <Button className="btn btn-danger mr-2" item={componentList["buttonDeleteMasterYes"]}> Yes</Button>
                    <Button className="btn btn-info" item={componentList["buttonDeleteMasterNo"]}> No</Button>
                </div>
            </PopUpPage>
            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <ControlCenter item={componentList["CONTROL_CENTER"]} >
                            <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                            </AdvanceSearch>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}><i className="fas fa-search fa-lg"></i></Button>
                            <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton>
                            <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                            <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                            {/* <DeleteButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonDelete"]}><i className="far fa-trash-alt fa-lg"></i></DeleteButton> */}
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonDeleteMaster"]}><i className="far fa-trash-alt fa-lg"></i></Button>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonUndo"]}><i className="fas fa-undo fa-lg"></i></Button>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonReset"]}><i className="fas fa-sync-alt fa-lg"></i></Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <TextBox item={componentList["inputId"]} />
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputRoleCode"].label} />
                                    <TextBox item={componentList["inputRoleCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputDescription"].label} />
                                    <TextBox item={componentList["inputDescription"]} className="form-control form-control-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="row pb-3">
                                <div className="col-12"><h5>Users</h5></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <Label item={componentList["lovComboBoxUser"].label} />
                                    <LovComboBox item={componentList["lovComboBoxUser"]} className="form-control form-control-sm" lovClassName="lov-search" lovHeaderText="Please Select User" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Button className="btn common-btn btn-sm w-auto mt-4" item={componentList["buttonAddUser"]}>Add</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row py-3">
                        <div className="col-12">
                            <Grid item={componentList["gridUserRoleDetails"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                <div className="master-table-wrp">
                                    <GridHeader typeName="GridHeader" columns={componentList["gridUserRoleDetails"].columns} />
                                    <GridBody typeName="GridBody" rows={componentList["gridUserRoleDetails"].data} />
                                </div>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
