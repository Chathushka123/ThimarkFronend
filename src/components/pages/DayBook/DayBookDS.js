import React from 'react'
import {HandsOnTable,DateField,MultiSelectDropDown,RadioGroup,Radio, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateDayBookDisplay(componentList, control) {

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

                            <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <PopUpPage item={componentList["AddPaymentTypePopUp"]} headerText="Add Payment Type" className="AddPaymentType">
                <div className="loading" id="spinnerPopUp" style={{ display: "none" }}>Loading&#8230;</div>
                <div className="col-12 form-row" style={{marginTop:"10px"}}>
                    <div className='="form-group row col-md-12 col-12'>

                        <div className='col-md-12'>
                            <Label item={componentList["inputAddPaymentType"].label} />
                            <TextBox item={componentList["inputAddPaymentType"]} className="form-control form-control-sm" />
                        </div>
                        <div className='col-md-12' style={{textAlign:"right", marginTop:"10px"}}>
                            <Button className="btn common-btn btn-sm" item={componentList["buttonSavePaymentType"]} style={{ marginLeft: "5px" }}><i className="fas fa-save" style={{paddingRight:"10px"}}></i>Save</Button>
                        </div>
                       
                        
                    </div>
                    

                </div>
                
            </PopUpPage>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-2 col-sm-12">
                                    <Label item={componentList["inputDate"].label} />
                                    <DateField item={componentList["inputDate"]} dateFormat="yyyy-MM-dd" />
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <Label item={componentList["inputPaymentType"].label} />
                                    <div className="d-flex align-items-center w-100">
                                        <div className="flex-grow-1 mr-1" style={{ minWidth: 0 }}>
                                            <MultiSelectDropDown
                                                item={componentList["inputPaymentType"]}
                                                className="form-control form-control-sm w-100"
                                            />
                                        </div>
                                        <Button className="btn common-btn common-btn-erp btn-sm" item={componentList["buttonAddPaymentType"]} style={{ marginLeft: "5px" }}><i className="fas fa-plus"></i></Button>
                                    </div>
                                </div>
                                <div className="form-group col-md-4" >
                                    <Label item={componentList["inputPayee"].label} />
                                    <TextBox item={componentList["inputPayee"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2 mb-0" style={{textAlign:"left", paddingTop:"25px"}}>
                                    <RadioGroup item={componentList["radioPaymentMethod"]}>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioPaymentMethod"]} itemName="radioCash" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioCash">Cash</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioPaymentMethod"]} itemName="radioBank" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioBank">Bank</label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="form-group col-md-6" >
                                    <Label item={componentList["inputRemarks"].label} />
                                    <TextBox item={componentList["inputRemarks"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4" >
                                    <Label item={componentList["inputAmount"].label} />
                                    <NumberField item={componentList["inputAmount"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2 mb-0" style={{textAlign:"left", paddingTop:"25px"}}>
                                    <RadioGroup item={componentList["radioDrCr"]}>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioDrCr"]} itemName="radioDr" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioDr">Dr.</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioDrCr"]} itemName="radioCr" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioCr">Cr.</label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                
                                {/* <div className="form-group col-md-4" >
                                    <Label item={componentList["inputAddress"].label} />
                                    <NumberField item={componentList["inputAddress"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4" >
                                    <Label item={componentList["inputAddress"].label} />
                                    <NumberField item={componentList["inputAddress"]} className="form-control form-control-sm" />
                                </div> */}
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
