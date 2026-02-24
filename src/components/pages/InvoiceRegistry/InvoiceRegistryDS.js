import React from 'react'
import {HandsOnTable, TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, LovComboBox, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, IntegerField, NumberField, AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton } from '../../../BASE/Components'

  const divStyle1={
  overflowX: 'auto',    // Scroll horizontally
  overflowY: 'auto',    // Scroll vertically
  paddingTop: 0,
  position: 'relative',
  maxHeight: '600px',   // Adjust for vertical scroll area
  width: '100%', 
  };

export function generateBuyerDisplay(componentList, control) {

    return (
        <>
        <ControlCenter item={componentList["CONTROL_CENTER"]} >
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">
                <div className="form-wrp background-white">
                   <div className="col-12 scroll-thin" >
                        <HandsOnTable item={componentList["gridInvoiceRegistry"]}  />
                   </div>
                </div>

                {/* <div className="row pb-4">
                    <div className="col-12">
                        <div className='table-wrp background-white'>
                            <Grid item={componentList["gridSizeFitJson"]} deleteButton={<i className="fa fa-trash"></i>} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
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
                </div> */}


                {/* <div className="row pb-12">
                    <div className="col-12">
                    <HandsOnTable item={componentList["gridMarkerRatio"]}  />

                    </div>
                </div> */}
              
            </div>
            </ControlCenter>
        </>
    )
}
