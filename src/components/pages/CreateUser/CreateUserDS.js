import React from 'react'
import { TextBox, DropDown, Label, TextArea, PasswordField, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateCreateUserDisplay(componentList, handlers) {

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
            <PopUpPage item={componentList["changePasswordPopUp"]} headerText="Reset Password" className="">
                <div className="row p-3">
                    <div className="col-12">
                        <div className="form-group row">
                            <label htmlFor="inputPassword" className="col-sm-4 col-form-label">Password</label>
                            <div className="col-sm-8">
                                <PasswordField item={componentList["inputPassword"]} className="form-control form-control-sm" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputConfirmPassword" className="col-sm-4 col-form-label">Confirm Password</label>
                            <div className="col-sm-8">
                                <PasswordField item={componentList["inputConfirmPassword"]} className="form-control form-control-sm" />
                            </div>
                        </div>
                        <div className="form-group row pt-2">
                            <div className="offset-sm-4 col-sm-8" id="reallocate-popup-btn">
                                <Button className="bbtn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonChangePasswordYes"]}> Submit</Button>
                            </div>
                        </div>
                    </div>
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
                            <button
                                className="btn btn-secondary btn-sm mr-2"
                                type="button"
                                title="Print / Save PDF"
                                onClick={handlers.onPrint}
                            >
                                <i className="fas fa-print fa-lg"></i>
                            </button>
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
                                    <Label item={componentList["inputEmail"].label} />
                                    <TextBox item={componentList["inputEmail"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputName"].label} />
                                    <TextBox item={componentList["inputName"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputUserRole"].label} />
                                    <DropDown item={componentList["inputUserRole"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-1">
                                    <div className="form-check" style={{ marginTop: "30px" }}>
                                        <CheckBox item={componentList["inputIsActive"]} className="form-check-input" />
                                    </div>
                                </div>
                                <div className="form-group col-md-2">
                                    <div className="form-check" style={{ marginTop: "30px" }}>
                                        <CheckBox item={componentList["inputIsCommonUser"]} className="form-check-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row py-3">
                        <div className="col-12">
                            <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonChangePassword"]}> Reset Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
