import React from 'react'
import { HandsOnTable, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateMaterialDisplay(componentList, control) {

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
                    <div className="form-wrp background-white">
                        <div className="row">
                            <div className="col-12">
                                <TextBox item={componentList["inputId"]} />
                                <TextBox item={componentList["inputUpdatedAt"]} />
                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputMatName"].label} />
                                        <TextBox item={componentList["inputMatName"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputMatCode"].label} />
                                        <TextBox item={componentList["inputMatCode"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputMatSize"].label} />
                                        <TextBox item={componentList["inputMatSize"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputSupplier"].label} />
                                        <TextBox item={componentList["inputSupplier"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputLeadTime"].label} />
                                        <IntegerField item={componentList["inputLeadTime"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputMinQty"].label} />
                                        <IntegerField item={componentList["inputMinQty"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputUnitPrice"].label} />
                                        <IntegerField item={componentList["inputUnitPrice"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputCategory"].label} />
                                        <DropDown item={componentList["inputCategory"]} className="form-control form-control-sm" />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <Label item={componentList["inputUOM"].label} />
                                        <DropDown item={componentList["inputUOM"]} className="form-control form-control-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <Grid item={componentList["gridMaterials"]} 
                                deleteButton={<i className="fa fa-trash"></i>}
                                customButton={<i className="fa fa-edit"></i>} 
                                className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="master-table-wrp">
                                                <GridHeader typeName="GridHeader" columns={componentList["gridMaterials"].columns} />
                                                <GridBody typeName="GridBody" rows={componentList["gridMaterials"].data} />
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
