import React from 'react'
import { TextBox, DropDown, Label, TextArea, PasswordField, Tab, TabPage, Button, Grid, GridBody, GridHeader, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, FileSelector } from '../../../BASE/Components'

export function generateUserProfileDisplay(componentList, control) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <ControlCenter item={componentList["CONTROL_CENTER"]}></ControlCenter>
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
                                    <Label item={componentList["inputEmail"].label} />
                                    <TextBox item={componentList["inputEmail"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4">
                                    <Label item={componentList["inputName"].label} />
                                    <TextBox item={componentList["inputName"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4">
                                    <Label item={componentList["inputRole"].label} />
                                    <TextBox item={componentList["inputRole"]} className="form-control form-control-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row py-2">
                        <div className="col-12">
                            <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonUpdateProfile"]}> Update Profile</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
