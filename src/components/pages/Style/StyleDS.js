import React from 'react'
import { TextBox, DropDown, Label, LovComboBox, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateStyleDisplay(componentList, control) {

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
                                    <Label item={componentList["inputStyleCode"].label} />
                                    <TextBox item={componentList["inputStyleCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputStyleDescription"].label} />
                                    <TextBox item={componentList["inputStyleDescription"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-3" >
                                    <Label item={componentList["inputUploadSizeQty"].label} />
                                        <input type="file" id="inputExcel"  className="form-control form-control-sm"   style={{backgroundColor:"#21407f",color:"#fff",height:"50px"}}/>
                                </div>
                                <div className="form-group col-md-1 float-right" style={{paddingTop:"25px"}}>
                                        
                                        <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonUploadSizeQty"]} style={{height:"50px"}}> Upload</Button>
                                    </div>
                                {/* <div className="form-group col-md-6">
                                    <Label item={componentList["inputStyleSizeFit"].label} />
                                    <TextBox item={componentList["inputStyleSizeFit"]} className="form-control form-control-sm" />
                                </div> */}
                                <div className="form-group col-md-3 style-route" style={{visibility:"hidden"}}>
                                    <Label item={componentList["lovComboBoxRoute"].label} />
                                    <LovComboBox item={componentList["lovComboBoxRoute"]} className="form-control form-control-sm" lovClassName="lov-search" lovHeaderText="Please Select Route" />
                                </div>
                            </div>
                            {/* <div className="form-row">
                                <div className="form-group col-md-3 style-route">
                                    <Label item={componentList["lovComboBoxRoute"].label} />
                                    <LovComboBox item={componentList["lovComboBoxRoute"]} className="form-control form-control-sm" lovClassName="lov-search" lovHeaderText="Please Select Route" />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="row pb-4">
                    <div className="col-12">
                        <div className='table-wrp background-white'>
                            <Grid item={componentList["gridSizeFitJson"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                <div className="row pb-3">
                                    <div className="col-3"><h5>Size Grid</h5></div>
                                    <div className="col-3 d-flex justify-content-end">
                                        <AddRowButton typeName="AddRowButton" className="btn common-btn btn-sm w-auto" item={componentList["gridSizeFitJson"]} />
                                    </div>
                                </div>
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
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className='table-wrp background-white'>
                            <Grid item={componentList["gridFabricInformation"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                <div className="row pb-3">
                                    <div className="col-3"><h5>BOM Information</h5></div>
                                    <div className="col-3 d-flex justify-content-end">
                                        <AddRowButton typeName="AddRowButton" className="btn common-btn btn-sm w-auto" item={componentList["gridFabricInformation"]} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="master-table-wrp">
                                            <GridHeader typeName="GridHeader" columns={componentList["gridFabricInformation"].columns} />
                                            <GridBody typeName="GridBody" rows={componentList["gridFabricInformation"].data} />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>

        </>)
}
