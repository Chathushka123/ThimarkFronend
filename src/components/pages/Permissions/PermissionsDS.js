import React from 'react'
import { TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage } from '../../../BASE/Components'

export function generatePermissionsDisplay(componentList, control) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            <Grid item={componentList["gridPermissions"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                                <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                                <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonReset"]}><i className="fas fa-sync-alt fa-lg"></i></Button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <div className="master-table-wrp">
                                    <GridHeader typeName="GridHeader" columns={componentList["gridPermissions"].columns} />
                                    <GridBody typeName="GridBody" rows={componentList["gridPermissions"].data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
        </>)
}
