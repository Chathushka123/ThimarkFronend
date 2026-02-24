import React from 'react'
import {HandsOnTable,DateField, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

export function generateTransactionSummaryDisplay(componentList, control) {

    return (
        <>
        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            <div className="loading" id="spinner" style={{ display: "none",position:"relative",zIndex:"99999" }}>Loading&#8230;</div>

            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <ControlCenter item={componentList["CONTROL_CENTER"]} >

                            <PopulateButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonPopulate"]}><i className="fas fa-database fa-lg"></i></PopulateButton>

                        </ControlCenter>
                    </div>
                </div>
                
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white" style={{position:"relative",zIndex:"9999"}}>
                    <div className="row" style={{position:"relative",zIndex:"9999"}}>
                        <div className="col-12">
                            <div className="form-row">
                                
                                <div className="form-group col-md-3" style={{position:"relative",zIndex:"9999"}}>
                                    <Label item={componentList["inputFromDate"].label} />
                                    <DateField item={componentList["inputFromDate"]} dateFormat="yyyy-MM-dd" />
                                </div>
                                {/* <div className='col-md-2 form-group'>   </div> */}
                                <div className="form-group col-md-3" style={{position:"relative",zIndex:"9999"}}>
                                    <Label item={componentList["inputToDate"].label} />
                                    <DateField item={componentList["inputToDate"]} dateFormat="yyyy-MM-dd" />
                                </div>

                                

                            </div>
                        </div>
                    </div>
                </div>

                
              
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                    <div className="scroll-thin" >
                        <HandsOnTable item={componentList["gridTransactionSummary"]}  />
                    </div>
                </div>
            </div>
            </ControlCenter>
        </>
    )
}
