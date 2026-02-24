import React from 'react'
import { TextBox, DropDown, Label, TextArea, Tab, TabPage, Button, Grid, GridBody, GridHeader, AddRowButton, DualStateSelector, ControlCenter, NewButton, SaveButton, RefreshButton, DeleteButton, PopulateButton, CheckBox, PopUpPage, FileSelector, AttachmentList, Attachment, AttachmentName, AttachmentCloseBtn } from '../../../BASE/Components'

export function generateStyleUploadDisplay(componentList, control) {

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>
            <ControlCenter item={componentList["CONTROL_CENTER"]} ></ControlCenter>
            <Grid item={componentList["gridUpload"]} className="table table-responsive table-striped table-sm w-100 d-block d-md-table">
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonUpload"]}><i className="fas fa-file-upload fa-lg"></i></Button>
                            <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonResetData"]}><i className="fas fa-sync-alt fa-lg"></i></Button>
                        </div>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">
                    <div className="row mb-4 file-upload-div">
                        <div className="col-lg-1">
                            <FileSelector type="button" item={componentList["inputFile"]} className="btn btn-info d-flex justify-content-start" accept=".xlsx, .xls, .csv">File Open </FileSelector>
                        </div>
                        <div className="col-lg-3">
                            <AttachmentList typeName="Attachment" item={componentList["attachmentList"]}>
                                <Attachment typeName="Attachment">
                                    <div className="uploaded-file-item">
                                        <i className="fa fa-paperclip"></i><AttachmentName typeName="AttachmentName" />
                                        <AttachmentCloseBtn typeName="AttachmentCloseBtn" className="btn float-right close-icon">
                                            <i className="fa fa-times"></i>
                                        </AttachmentCloseBtn>
                                    </div>
                                </Attachment>
                            </AttachmentList>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className='table-wrp background-white'>
                                <GridHeader typeName="GridHeader" columns={componentList["gridUpload"].columns} />
                                <GridBody typeName="GridBody" rows={componentList["gridUpload"].data} />
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>
        </>)
}
