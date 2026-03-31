import React from 'react'
import { TextBox, Label, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, PopulateButton, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateSupplierDisplay(componentList) {

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
                                <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton>
                                <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
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
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputName"].label} />
                                        <TextBox item={componentList["inputName"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputContactNo"].label} />
                                        <TextBox item={componentList["inputContactNo"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputEmail"].label} />
                                        <TextBox item={componentList["inputEmail"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <Label item={componentList["inputAddress"].label} />
                                        <TextBox item={componentList["inputAddress"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <h5>All Suppliers</h5>
                                <Grid item={componentList["gridSuppliers"]}
                                    customButton={<i className="fa fa-edit"></i>}
                                    deleteButton={<i className="fa fa-trash"></i>}
                                    className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridSuppliers"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridSuppliers"].data} />
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
