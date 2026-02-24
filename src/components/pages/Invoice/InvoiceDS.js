import React from 'react'
import {HandsOnTable,RadioGroup,Radio,MultiSelectDropDown, TextBox,DateField, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateBuyerDisplay(componentList, control) {

    return (
        <>
        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

                <PopUpPage item={componentList["printPopUp"]} headerText="Print Preview" className="print-popup">
                    <div className="row p-3">
                        <div className="col-12">
                            {/* <iframe id="pdfviewer" src="" type="application/pdf" width="100%" height="500px"></iframe> */}
                            <div className="col-md-12 col-sm-12 col-xs-12" id="imagePreviewContainer" style={{ display: 'flex', flexWrap: 'wrap', textAlign:"center" }}></div>
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
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}><i className="fas fa-search"></i></Button>
                            <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}><i className="far fa-file fa-lg"></i></NewButton>
                            <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}><i className="far fa-save fa-lg"></i></SaveButton>
                            {/* <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonDeleteMaster"]}><i className="far fa-trash-alt fa-lg"></i></Button> */}
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPrint"]}><i className="fas fa-print fa-lg"></i></Button>
                            <Button className="btn common-btn  btn-sm " item={componentList["buttonPrintImage"]}>Images</Button>
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
                                    <Label item={componentList["inputBillNo"].label} />
                                    <TextBox item={componentList["inputBillNo"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputId"].label} />
                                    <TextBox item={componentList["inputId"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4">
                                    <Label item={componentList["inputName"].label} />
                                    <TextBox item={componentList["inputName"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputMobile"].label} />
                                    <TextBox item={componentList["inputMobile"]} className="form-control form-control-sm" />
                                </div>
                                {/* <div className="form-group col-md-2">
                                    <Label item={componentList["inputLand"].label} />
                                    <TextBox item={componentList["inputLand"]} className="form-control form-control-sm" />
                                </div> */}
                                {/* <div className="form-group col-md-4">
                                    <Label item={componentList["inputStatus"].label} />
                                    <TextBox item={componentList["inputStatus"]} className="form-control form-control-sm" />
                                </div> */}

                               
                                <div className="form-group col-md-6" style={{visibility:"hidden",display:"none"}}>
                                    <Label item={componentList["inputAddress"].label} />
                                    <TextBox item={componentList["inputAddress"]} className="form-control form-control-sm" />
                                </div>


                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputDate"].label} />
                                    <TextBox item={componentList["inputDate"]} className="form-control form-control-sm" />
                                </div>

                                 <div className="col-md-6 col-sm-6">
                                    <Label item={componentList["inputInvoiceStatus"].label} />

                                    <MultiSelectDropDown
                                        item={componentList["inputInvoiceStatus"]}
                                        className="form-control form-control-sm"
                                    />
                                        
                                    
                                </div>

                                <div className="form-group col-md-2">
                                    <Label item={componentList["inputDueDate"].label} />
                                    <DateField item={componentList["inputDueDate"]} dateFormat="yyyy-MM-dd" />
                                </div>

                                <div className='form-group col-md-4 col-6'>
                                    <Label item={componentList["inputUploadImage"].label} />
                                        <input type="file" id="inputImage"  className="btn  btn-sm   mr-2 form-control form-control-sm" style={{backgroundColor:"#0194ff",color:"#fff",height:"40px"}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                <div className='table-wrp background-white' style={{marginBottom:"20px"}}>
                    <div className="col-12">
                        <Grid item={componentList["gridInvoiceDetails"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                            <div className="row pb-3">
                                <div className="col-9"><h5>Invoice Details</h5></div>
                                <div className="col-3 d-flex justify-content-end">
                                    <AddRowButton typeName="AddRowButton" className="btn common-btn btn-sm w-auto" item={componentList["gridBuyerCartonDetails"]} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="master-table-wrp">
                                        <GridHeader typeName="GridHeader" columns={componentList["gridInvoiceDetails"].columns} />
                                        <GridBody typeName="GridBody" rows={componentList["gridInvoiceDetails"].data} />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </div>
                </div>


                    


                    <div className="table-wrp form-wrp background-white">
                    <div className="row">
                        <div className="col-9"><h5>Payment</h5></div>
                        <div className="col-12">
                            <div className="d-flex align-items-center justify-content-end mb-">
                                <p className="mb-0 mr-4"><b>Payment Method</b></p>
                                <div className="form-group col-md-2" style={{paddingTop:"20px"}}>
                                    <DateField item={componentList["inputPaymentDate"]} dateFormat="yyyy-MM-dd" />
                                </div>
                                <div className="form-group mb-0">
                                    <RadioGroup item={componentList["radioPaymentMethod"]}>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioPaymentMethod"]} itemName="radioCash" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioCash">Cash</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <Radio item={componentList["radioPaymentMethod"]} itemName="radioBank" className="form-check-input" />
                                            <label className="form-check-label" htmlFor="radioBank">Bank Transfer</label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputTotalAmount"].label} />
                                    <TextBox item={componentList["inputTotalAmount"]} className="form-control form-control-sm"  style={{height:"50px",fontSize:"24px",color:"blue"}}/>
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputPaid"].label} />
                                    <TextBox item={componentList["inputPaid"]} className="form-control form-control-sm" style={{height:"50px",fontSize:"24px",color:"blue"}}/>
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputBalance"].label} />
                                    <TextBox item={componentList["inputBalance"]} className="form-control form-control-sm" style={{height:"50px",fontSize:"24px",color:"blue"}}/>
                                </div>
                                <div className="form-group col-md-3">
                                    <Label item={componentList["inputAmount"].label} />
                                    <TextBox item={componentList["inputAmount"]} className="form-control form-control-sm" style={{height:"50px",fontSize:"24px"}}/>
                                </div>
                           


                            </div>
                        </div>
                    </div>
                </div>


                <div className='table-wrp background-white'>
                    <div className="col-9"><h5>Payment Details</h5></div>
                    <div className="col-12">
                        
                        <Grid item={componentList["gridPaymentDetails"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                            <div className="row">
                                <div className="col-12">
                                    <div className="master-table-wrp">
                                        <GridHeader typeName="GridHeader" columns={componentList["gridPaymentDetails"].columns} />
                                        <GridBody typeName="GridBody" rows={componentList["gridPaymentDetails"].data} />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </div>
                </div>
             
            </div>
            </ControlCenter>
        </>
    )
}
