import React from 'react'
import {HandsOnTable,MultiSelectDropDown, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateBatchDisplay(componentList, control) {

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
                            <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                            </AdvanceSearch>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}><i className="fas fa-search fa-lg"></i></Button>
                            {/* <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton> */}
                            <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                            <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonDelete"]}><i className="fas fa-trash fa-lg"></i></Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputBatchID"].label} />
                                    <TextBox item={componentList["inputBatchID"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputBatchNo"].label} />
                                    <TextBox item={componentList["inputBatchNo"]} className="form-control form-control-sm" />
                                </div>
                                <div className="col-md-6 col-sm-4">
                                    <Label item={componentList["inputMainModel"].label} />

                                    <MultiSelectDropDown
                                        item={componentList["inputMainModel"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                <div className="col-md-6 col-sm-4">
                                    <Label item={componentList["inputModel"].label} />

                                    <MultiSelectDropDown
                                        item={componentList["inputModel"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                <div className="col-md-2 col-12">
                                    <div className="form-group">
                                        <Label item={componentList["inputQuantity"].label} />
                                        <IntegerField 
                                            item={componentList["inputQuantity"]} 
                                            className="form-control form-control-sm"
                                            
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 col-12 d-flex align-items-end">
                                    <div className="form-group w-100">
                                        <Button 
                                            className="btn common-btn common-btn-lg btn-sm w-100" 
                                            item={componentList["buttonAddToGrid"]}
                                            style={{backgroundColor: '#007bff', borderColor: '#007bff',padding:'8px'}}
                                        >
                                            <i className="fas fa-plus mr-1"></i> Add
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div className="row pb-12"> */}
                            <div className="col-12">
                                <div className='table-wrp background-white'>
                                    <h5>Qty Data</h5>
                                    <Grid item={componentList["gridSize"]} deleteButton={<i className="fa fa-trash"></i>}   className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="master-table-wrp">
                                                    <GridHeader typeName="GridHeader" columns={componentList["gridSize"].columns} />
                                                    <GridBody typeName="GridBody" rows={componentList["gridSize"].data} />
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                </div>

                
              
            </div>
            </ControlCenter>
        </>
    )
}
