import React from 'react'
import { TextBox, DropDown, Label, Button, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, PopulateButton, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateModelDisplay(componentList, control) {

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
                                <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton>
                                <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                            </ControlCenter>
                        </div>
                    </div>

                </div>

                <div className="container-fluid custom-container-padding">
                    {/* Main Model Management Section */}
                    <div className="form-wrp background-white mb-4">
                        <h5 className="mb-3">Main Model Management</h5>
                        <div className="row">
                            <div className="col-12">
                                <TextBox item={componentList["inputMainModelId"]} />
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <Label item={componentList["inputMainModelName"].label} />
                                        <TextBox item={componentList["inputMainModelName"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>All Main Models</h5>
                                <Grid item={componentList["gridMainModels"]} customButton={<i className="fa fa-edit"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridMainModels"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridMainModels"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                    {/* Model Management Section */}
                    <div className="form-wrp background-white">
                        <h5 className="mb-3">Model Management</h5>
                        <div className="row">
                            <div className="col-12">
                                <TextBox item={componentList["inputId"]} />
                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputName"].label} />
                                        <TextBox item={componentList["inputName"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputMainModel"].label} />
                                        <DropDown item={componentList["inputMainModel"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputColor"].label} />
                                        <TextBox item={componentList["inputColor"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-3">
                                        <Label item={componentList["inputSizes"].label} />
                                        <TextBox item={componentList["inputSizes"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>Model Stock Items (Material Consumption)</h5>
                                <Grid item={componentList["gridModelStockItems"]} deleteButton={<i className="fa fa-trash"></i>}
                                    customButton={<i className="fa fa-plus"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridModelStockItems"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridModelStockItems"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>All Models</h5>
                                <Grid item={componentList["gridModels"]} customButton={<i className="fa fa-edit"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridModels"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridModels"].data} />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </div>
                        </div>
                    </div>

                </div>
            </ControlCenter>
        </>
    )
}
