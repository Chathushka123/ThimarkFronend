import React from 'react'
import { TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, RadioGroup, Radio, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, IntegerField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton, LovComboBox, PopUpPage } from '../../../BASE/Components'

const divStyle = {
    overflowX: 'scroll',
    float: 'left',
    paddingTop: "30px",
    position: 'relative'
};

export function generateRatioPlanningDisplay(componentList, control) {

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
                <PopUpPage item={componentList["deleteMasterPopUp"]} headerText="Confirm Delete" className="">
                    <div className="row p-4 float-right">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonDeleteMasterYes"]}> Yes</Button>
                        <Button className="btn btn-info" item={componentList["buttonDeleteMasterNo"]}> No</Button>
                    </div>
                </PopUpPage>,

                <PopUpPage item={componentList["BundleTagPopUp"]} headerText="Select Report Type" className="">

                    <div className="col-12">
                        <div className="form-group ">
                            <RadioGroup item={componentList["radioCombineBundles"]}>
                                <div className="form-check">
                                    <Radio item={componentList["radioCombineBundles"]} itemName="radioYes" className="form-check-input" />
                                    <label className="form-check-label" htmlFor="radioYes">According to Bundle ID</label>
                                </div>
                                <div className="form-check">
                                    <Radio item={componentList["radioCombineBundles"]} itemName="radioNo" className="form-check-input" />
                                    <label className="form-check-label" htmlFor="radioNo">According to Size</label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="row p-4 float-right">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonPrintTag"]}> Print</Button>
                        <Button className="btn btn-info" item={componentList["buttonPrintTagCancel"]}> Cancel</Button>
                    </div>

                </PopUpPage>

                <PopUpPage item={componentList["printPopUp"]} headerText="Print Preview" className="print-popup">
                    <div className="row p-3">
                        <div className="col-12">
                            <iframe id="pdfviewer" src="" type="application/pdf" width="100%" height="500px"></iframe>
                        </div>
                    </div>
                </PopUpPage>
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                            </AdvanceSearch>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div className="form-wrp background-white">
                        <div className="row pt-2">
                            <div className="col-12">
                                <TextBox item={componentList["inputBuyerId"]} />
                                <TextBox item={componentList["inputStyleId"]} />
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <Button className="btn common-btn w-auto btn-sm" item={componentList["buttonAdvanceSearch"]}>Buyer / Customer Style Ref / Style&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i className="fas fa-search"></i></Button>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputBuyerCode"].label} />
                                        <TextBox item={componentList["inputBuyerCode"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputCustomerStyleReference"].label} />
                                        <TextBox item={componentList["inputCustomerStyleReference"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputStyleCode"].label} />
                                        <TextBox item={componentList["inputStyleCode"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputCombineOrderNo"].label} />
                                        <DropDown item={componentList["inputCombineOrderNo"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row pb-3">
                            <div className="col-12">
                                <div className="col-12" style={divStyle}>
                                    <div className="col-12">
                                        <Grid item={componentList["gridViewCombineOrder"]} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                            <div className="master-table-wrp" style={{ overflow: "inherit", maxHeight: "50000px" }}>
                                                <GridHeader typeName="GridHeader" columns={componentList["gridViewCombineOrder"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridViewCombineOrder"].data} />
                                            </div>
                                        </Grid>
                                    </div>

                                    <div className="col-12" style={{ marginTop: "20px", marginBottom: "10px" }}>
                                        <Grid item={componentList["gridTotalQuantity"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table" >
                                            <div className="master-table-wrp quantity-table no-header-table" style={{ overflow: "inherit" }}>
                                                <GridHeader typeName="GridHeader" columns={componentList["gridTotalQuantity"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridTotalQuantity"].data} />
                                            </div>
                                        </Grid>
                                    </div>
                                </div>

                                <div className="form-group col-md-12 col-auto pt-4" >
                                    <Button className="btn common-btn btn-sm common-btn-lg float-right " item={componentList["buttonSaveTolerance"]} style={{ marginTop: "20px" }}> Save</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <Tab className="nav nav-tabs" id="myTab" role="tablist">
                                <TabPage className="nav-link active" item={componentList["tabCutPlan"].items.create} dataToggle="tab" href="#create" role="tab" ariaControls="create" ariaSelected="true" />
                                <TabPage className="nav-link" item={componentList["tabCutPlan"].items.view} dataToggle="tab" href="#view" role="tab" ariaControls="view" ariaSelected="true" />
                            </Tab>
                            <div className="tab-content background-white" id="myTabContent">
                                <div className="tab-pane fade show active" id="create" role="tabpanel" aria-labelledby="create-cut-plan">
                                    <div className="row pt-2">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-row">
                                                        <div className="form-group col-md-3">
                                                            <Label item={componentList["inputFabricNo"].label} />
                                                            <DropDown item={componentList["inputFabricNo"]} className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="form-group col-md-2" id="main-fabric-div">
                                                            <div className="form-check pt-4">
                                                                <CheckBox item={componentList["inputMainFabric"]} className="form-check-input" />
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-md-3" ></div>
                                                        <div className="form-group col-md-3" style={{paddingTop:"20px"}}>
                                                            <Label item={componentList["inputUploadRatioPlan"].label} />
                                                            <input type="file" id="inputExcel"  className="form-control form-control-sm" style={{backgroundColor:"#21407f",color:"#fff",height:"50px"}}/>
                                                        </div>
                                                        <div className="form-group col-md-1 float-right" style={{paddingTop:"40px"}}>
                                        
                                                            <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonUploadRatioPlan"]} style={{height:"50px"}}> Upload</Button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-row">
                                                        <div className="form-group col-md-3">
                                                            <Label item={componentList["inputMaxPlies"].label} />
                                                            <IntegerField item={componentList["inputMaxPlies"]} className="form-control form-control-sm" />
                                                        </div>
                                                        <div className="form-check pt-4">
                                                                <CheckBox item={componentList["inputShadeWiseBundle"]} className="form-check-input" />
                                                        </div>

                                             
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <Grid item={componentList["gridLayMarker"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                                    <div className="col-11">
                                                        <div className="master-table-wrp quantity-table">
                                                            <GridHeader typeName="GridHeader" columns={componentList["gridLayMarker"].columns} />
                                                            <GridBody typeName="GridBody" rows={componentList["gridLayMarker"].data} />
                                                        </div>
                                                    </div>
                                                    <div className="col-1">
                                                        <AddRowButton typeName="AddRowButton" className="btn common-btn btn-sm w-auto" item={componentList["gridLayMarker"]} />
                                                    </div>
                                                </Grid>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row pt-4">
                                        <div className="col-12">
                                            <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonCreateCutPlan"]}> Create Cut Plan</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="view" role="tabpanel" aria-labelledby="view-cut-plan">
                                    <div className="row pt-2">
                                        <div className="col-12">
                                            <div className="form-row">
                                                <div className="form-group col-md-3">
                                                    <Label item={componentList["inputViewFabricNo"].label} />
                                                    <DropDown item={componentList["inputViewFabricNo"]} className="form-control form-control-sm" />
                                                </div>
                                                <div className="form-group col-md-2 col-auto pt-4">
                                                    <Button className="btn btn-danger btn-sm common-btn-lg" item={componentList["buttonDeleteCutPlan"]}> Delete Cut Plan</Button>
                                                </div>
                                                {/* <div className="form-group col-auto pt-4">
                                                    <Button className="btn common-btn btn-sm common-btn-lg" item={componentList["buttonConsumptionReport"]}> Consumption Report</Button>
                                                </div> */}

                                                <div className="form-group col-md-3">
                                                    <Label item={componentList["inputReportCutNo"].label} />
                                                    <DropDown item={componentList["inputReportCutNo"]} className="form-control form-control-sm" />
                                                    {/* <TextBox item={componentList["inputReportCutNo"]} className="form-control form-control-sm" /> */}
                                                </div>
                                                <div className="form-group col-md-1 col-auto pt-4 ">
                                                    <Button className="btn common-btn common-btn-lg btn-sm mr-2 " item={componentList["buttonCutReport"]}> Report</Button>
                                                </div>

                                                {/* <div className="form-group col-md-1 col-auto pt-4">
                                                    <Button className="btn common-btn btn-sm " item={componentList["buttonBundleTag"]}>Bundle Tag</Button>
                                                </div> */}

                                                <div  className="form-group col-md-2 col-auto pt-4">
                                                    <Button className="btn common-btn common-btn-lg btn-sm mr-2" item={componentList["buttonBundleTag"]}>Bundle Tag</Button>
                                                </div>
                                                <div className="form-group col-md-1 col-auto pt-4">
                                                    {/* <Button className="btn common-btn common-btn-lg btn-sm mr-2" item={componentList["buttonBundleTagNew"]}>Bundle Tag</Button> */}
                                                </div>
                                                <div className="form-group col-md-1 col-auto pt-4" style={{paddingLeft:"5px"}}>
                                                    {/* <Button className="btn common-btn btn-sm mr-2" item={componentList["buttonBundleDetails"]}>Bundle Details</Button> */}
                                                </div>

                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-9">
                                                    <Label item={componentList["inputCutRemarks"].label} />
                                                    <TextBox item={componentList["inputCutRemarks"]} className="form-control form-control-sm" />
                                                </div>
                                                <div className="form-group col-md-1 col-auto pt-4">
                                                    <Button className="btn common-btn btn-sm mr-2" item={componentList["buttonSaveRemarks"]} > Save</Button>
                                                </div>
                                                <div className="form-group col-md-1 col-auto pt-4" style={{paddingLeft:"5px"}}>
                                                    {/* <Button className="btn common-btn btn-sm mr-2" item={componentList["buttonNumbering"]} style={{backgroundColor:"green"}}>Numbering</Button> */}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row pt-4">
                                        <div className="col-12">
                                            <Grid item={componentList["gridCutPlan"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                                <div className="master-table-wrp quantity-table">
                                                    <GridHeader typeName="GridHeader" columns={componentList["gridCutPlan"].columns} />
                                                    <GridBody typeName="GridBody" rows={componentList["gridCutPlan"].data} />
                                                </div>
                                            </Grid>
                                        </div>

                                        <div className="form-group col-md-12 col-auto pt-4" style={{paddingLeft:"5px",textAlign:"right"}}>
                                        <Button className="btn btn-danger btn-sm common-btn-lg" item={componentList["buttonDeleteCut"]}> Delete</Button>
                                        </div>
                                    </div>

                                    {/* Report */}

                                    {/* <div className="row pt-4">
                                        <div className="col-12">
                                            <div className="form-row">
                                                <div className="form-group col-md-3">
                                                    <Label item={componentList["inputReportCutNo"].label} />
                                                    <TextBox item={componentList["inputReportCutNo"]} className="form-control form-control-sm" />
                                                </div>
                                                <div className="form-group col-auto pt-4">
                                                    <Button className="btn common-btn btn-sm common-btn-lg" item={componentList["buttonCutReport"]}> Report</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
