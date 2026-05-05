import React from 'react'
import { MultiSelectDropDown, TextBox, DropDown, Label, Button, Grid, GridBody, GridHeader, ControlCenter, NewButton, SaveButton, IntegerField, PopUpPage, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateMrnDisplay(componentList) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            {/* Finalize Confirmation Popup */}
            <PopUpPage item={componentList["finalizePopUp"]} headerText="Confirm Finalize" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-check-circle" style={{fontSize: '48px', color: '#28a745'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Finalize MRN</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to finalize this MRN? <br/>
                        You won't be able to edit it after finalization.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-success mr-2" item={componentList["buttonFinalizeYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Finalize
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonFinalizeNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            <PopUpPage item={componentList["printPdfPopUp"]} headerText="Print Preview" className="print-popup">
                <div className="row p-3">
                    <div className="col-12">
                        <iframe id="pdfviewer" src="" type="application/pdf" width="100%" height="500px"></iframe>
                        
                    </div>
                </div>
            </PopUpPage>

            {/* Reopen Confirmation Popup */}
            <PopUpPage item={componentList["reopenPopUp"]} headerText="Confirm Re-open" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-folder-open" style={{fontSize: '48px', color: '#ffc107'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Re-open MRN</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to re-open this MRN? <br/>
                        You will be able to edit it again after re-opening.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-warning mr-2" item={componentList["buttonReopenYes"]}>
                            <i className="fas fa-folder-open mr-1"></i> Yes, Re-open
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonReopenNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            {/* Header Section */}
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
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}>
                                <i className="fas fa-search fa-lg"></i>
                            </Button>
                            <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}>
                                <i className="far fa-file fa-lg"></i>
                            </NewButton>
                            <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}>
                                <i className="far fa-save fa-lg"></i>
                            </SaveButton>
                            {componentList["buttonFinalize"].schema.visible && (
                                <Button className="btn btn-success common-btn-erp btn-sm mr-2" item={componentList["buttonFinalize"]}>
                                    <i className="fas fa-check fa-lg"></i>
                                </Button>
                            )}
                            {componentList["buttonReopen"].schema.visible && (
                                <Button className="btn btn-warning common-btn-erp btn-sm mr-2" item={componentList["buttonReopen"]}>
                                    <i className="fas fa-folder-open fa-lg"></i>
                                </Button>
                            )}
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPrint"]}><i className="fas fa-print fa-lg"></i></Button>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonDownload"]}><i className="fas fa-download fa-lg"></i></Button>
                        </ControlCenter>
                    </div>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputMrnID"].label} />
                                    <TextBox item={componentList["inputMrnID"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputStatus"].label} />
                                    <TextBox item={componentList["inputStatus"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputFinalizeAt"].label} />
                                    <TextBox item={componentList["inputFinalizeAt"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputCompleteAt"].label} />
                                    <TextBox item={componentList["inputCompleteAt"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputWarehouse"].label} />
                                    <DropDown 
                                        item={componentList["inputWarehouse"]} 
                                        className="form-control form-control-sm"
                                        disabled={componentList["inputStatus"].data.value === "finalized"}
                                    />
                                </div>
                                <div className="col-md-2 col-12">
                                    <div className="form-group">
                                        <Label item={componentList["inputBatch"].label} />
                                        <MultiSelectDropDown
                                            item={componentList["inputBatch"]}
                                            className="form-control form-control-sm"
                                            disabled={componentList["inputStatus"].data.value === "finalized"}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group col-md-2 col-12">
                                    <Label item={componentList["inputRemark"].label} />
                                    <TextBox item={componentList["inputRemark"]} className="form-control form-control-sm" />
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="form-group">
                                        <Label item={componentList["inputMaterial"].label} />
                                        <MultiSelectDropDown
                                            item={componentList["inputMaterial"]}
                                            className="form-control form-control-sm"
                                            disabled={componentList["inputStatus"].data.value === "finalized"}
                                        />
                                    </div>
                                    
                                </div>

                                <div className="col-md-2 col-12">
                                    <div className="form-group">
                                        <Label item={componentList["inputAvailableQuantity"].label} />
                                        <IntegerField 
                                            item={componentList["inputAvailableQuantity"]} 
                                            className="form-control form-control-sm"
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-md-2 col-12">
                                    <div className="form-group">
                                        <Label item={componentList["inputQuantity"].label} />
                                        <IntegerField 
                                            item={componentList["inputQuantity"]} 
                                            className="form-control form-control-sm"
                                            disabled={componentList["inputStatus"].data.value === "finalized"}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 col-12 d-flex align-items-end">
                                    <div className="form-group w-100">
                                        <Button 
                                            className="btn common-btn common-btn-lg btn-sm w-100" 
                                            item={componentList["buttonAddToGrid"]}
                                            disabled={componentList["inputStatus"].data.value === "finalized"}
                                            style={{backgroundColor: '#007bff', borderColor: '#007bff',padding:'8px'}}
                                        >
                                            <i className="fas fa-plus mr-1"></i> Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Material Grid */}
                        <div className="col-12 mt-3">
                            <div className='table-wrp background-white'>
                                <h5 style={{color: '#3a4a6b', fontWeight: '600'}}>Materials</h5>
                                <Grid item={componentList["gridMaterials"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
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
            </div>
        </ControlCenter>
        </>
    )
}
