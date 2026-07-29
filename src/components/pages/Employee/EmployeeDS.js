import React from 'react'
import {HandsOnTable, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateEmployeeDisplay(componentList, control) {

    return (
        <>
        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                {/* <div className="form-group col-md-3">
                                    <Label item={componentList["inputStyleCode"].label} />
                                    <TextBox item={componentList["inputStyleCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputFabric"].label} />
                                    <TextBox item={componentList["inputFabric"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputMaxPlies"].label} />
                                    <TextBox item={componentList["inputMaxPlies"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputMaxLength"].label} />
                                    <TextBox item={componentList["inputMaxLength"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputConsumption"].label} />
                                    <TextBox item={componentList["inputConsumption"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputType"].label} />
                                    <DropDown item={componentList["inputType"]} className="form-control form-control-sm" />
                                </div> */}


                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="row pb-4">
                    <div className="col-12">
                        <div className='table-wrp background-white'>
                            <Grid item={componentList["gridSizeFitJson"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="master-table-wrp">
                                            <GridHeader typeName="GridHeader" columns={componentList["gridSizeFitJson"].columns} />
                                            <GridBody typeName="GridBody" rows={componentList["gridSizeFitJson"].data} />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </div>
                    </div>
                </div> */}


                {/* <div className="row pb-12">
                    <div className="col-12">
                    <HandsOnTable item={componentList["gridMarkerRatio"]}  />

                    </div>
                </div> */}
              
            </div>
            </ControlCenter>
        </>
    )
}
