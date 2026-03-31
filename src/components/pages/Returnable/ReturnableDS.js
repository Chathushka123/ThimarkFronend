import React from 'react'
import {HandsOnTable,PasswordField, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateReturnableDisplay(componentList, control) {

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
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPrint"]}><i className="fas fa-save fa-md"></i></Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-4 col-sm-12">
                                    <Label item={componentList["inputRequester"].label} />
                                        <PasswordField item={componentList["inputRequester"]} className="form-control form-control-sm" />        
                                </div>
                                <div className="form-group col-md-3 col-sm-12">
                                    <Label item={componentList["inputMaterial"].label} />
                                    <TextBox item={componentList["inputMaterial"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3 col-sm-12">
                                    <Label item={componentList["inputMaterialName"].label} />
                                    <TextBox item={componentList["inputMaterialName"]} className="form-control form-control-sm" />
                                </div>

                                 <div className="form-group col-md-2 col-sm-12">
                                    <Label item={componentList["inputQuantity"].label} />
                                    <IntegerField 
                                        item={componentList["inputQuantity"]} 
                                        className="form-control form-control-sm"
                                    />
                                </div>

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

                <div className="col-12 mt-3">
                    <div className='table-wrp background-white'>
                        <h5 style={{color: '#3a4a6b', fontWeight: '600'}}>Materials</h5>
                        <Grid item={componentList["gridReturnableItem"]} customButton={<i className="fa fa-check"></i>}  className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                            <div className="row">
                                <div className="col-12">
                                    <div className="master-table-wrp">
                                        <GridHeader typeName="GridHeader" columns={componentList["gridReturnableItem"].columns} />
                                        <GridBody typeName="GridBody" rows={componentList["gridReturnableItem"].data} />
                                    </div>
                                </div>
                            </div>
                        </Grid>
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
