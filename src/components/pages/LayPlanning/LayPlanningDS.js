import React from 'react'
import { TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, IntegerField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton, LovComboBox } from '../../../BASE/Components'

export function generateLayPlanningDisplay(componentList, control) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    {/* <ol className="breadcrumb">
                        <li className="breadcrumb-item active">{componentList["CONTROL_CENTER"].label.schema.value}</li>
                    </ol> */}
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <ControlCenter item={componentList["CONTROL_CENTER"]} >
                            <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                            </AdvanceSearch>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}><i className="fas fa-search"></i></Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <TextBox item={componentList["inputId"]} className="form-control form-control-sm" />
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <Label item={componentList["lovComboBoxOc"].label} />
                                    <LovComboBox item={componentList["lovComboBoxOc"]} className="form-control form-control-sm" lovClassName="lov-search" lovHeaderText="Please Select OC No" />
                                    {/* <DropDown item={componentList["inputOcNo"]} className="form-control form-control-sm" /> */}
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputBuyerCode"].label} />
                                    <TextBox item={componentList["inputBuyerCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputBuyerDepartment"].label} />
                                    <TextBox item={componentList["inputBuyerDepartment"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputStyleCode"].label} />
                                    <TextBox item={componentList["inputStyleCode"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputPackColor"].label} />
                                    <TextBox item={componentList["inputPackColor"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputNoOfLaySheetsCreated"].label} />
                                    <TextBox item={componentList["inputNoOfLaySheetsCreated"]} className="form-control form-control-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <Tab className="nav nav-tabs" id="myTab" role="tablist">
                            <TabPage className="nav-link active" item={componentList["tabLaySheet"].items.tab1} dataToggle="tab" href="#tab1" role="tab" ariaControls="tab1" ariaSelected="true" />
                            <TabPage className="nav-link" item={componentList["tabLaySheet"].items.tab2} dataToggle="tab" href="#tab2" role="tab" ariaControls="tab2" ariaSelected="true" />
                        </Tab>
                        <div className="tab-content background-white" id="myTabContent">
                            <div className="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="create-lay-sheet">
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <div className="fpo-wrp">
                                            <h5>FPO</h5>
                                            <DualStateSelector
                                                item={componentList.selectorFPO}
                                                style={{ height: "168px" }}
                                                selectableColor={"bg-success"}
                                                nonSelectableColor={"bg-warning"}
                                                cardClassName={"col-xl-3 col-md-4 col-sm-6"}
                                                cardStyle={{ height: "" }}
                                                onChange={componentList.selectorFPO.event.onChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <Grid item={componentList["gridLayPlanning"]} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridLayPlanning"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridLayPlanning"].data} />
                                            </div>
                                        </Grid>
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <div className="fpo-wrp">
                                            <h5>Lay Marker Details</h5>
                                            <div className="row pt-2">
                                                <div className="col-2">
                                                    <div className="form-group">
                                                        <Label item={componentList["inputMaxPlies"].label} />
                                                        <IntegerField item={componentList["inputMaxPlies"]} className="form-control form-control-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <Grid item={componentList["gridLayMarker"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                                    <div className="col-11">
                                                        <div className="master-table-wrp">
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
                                </div>
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <Button className="btn common-btn btn-sm common-btn-lg float-right" item={componentList["buttonCreateLaySheet"]}> Create Lay Sheet</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="view-lay-sheets">
                                <div className="row">
                                    <div className="col-4 pt-4">
                                        <div className="form-group">
                                            <Label item={componentList["inputLaySheetNo"].label} />
                                            <DropDown item={componentList["inputLaySheetNo"]} className="form-control form-control-sm" />
                                        </div>
                                    </div>
                                    <div className="col-2 pt-5">
                                        <Button className="btn btn-danger btn-sm common-btn-lg" item={componentList["buttonDeleteLaySheet"]}> Delete Lay Sheet</Button>
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-4">
                                        <h5>FPO</h5>
                                        <Grid item={componentList["gridFpo"]} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridFpo"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridFpo"].data} />
                                            </div>
                                        </Grid>
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div className="col-12">
                                        <Grid item={componentList["gridCutting"]} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridCutting"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridCutting"].data} />
                                            </div>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
