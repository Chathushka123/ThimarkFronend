import React, { useState } from 'react';
import { generateStyleUploadDisplay } from './StyleUploadDS';
import config from './StyleUploadCS';
import API from '../../../api/API';

const StyleUpload = () => {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender

    config["inputFile"].event.onChange = handleChangeFile

    config["attachmentList"].event.onCloseClick = handleFileRemove

    config["buttonUpload"].event.onClick = handleFileUpload;

    config["buttonResetData"].event.onClick = handleResetData;

    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onDelete = handleDelete;
    config["CONTROL_CENTER"].event.onRefresh = handleRefresh;
    config["CONTROL_CENTER"].event.onSave = handleSave;


    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/

    function handleChange(event) {
        return onChange(event);
    }

    function handlePopulate(event, callback) {
        return onPopulate(event, callback);
    }

    function handleNew(event) {
        return onNew();
    }

    function handleDelete(event) {
        return onDelete();
    }

    function handleRefresh(event) {
        return onRefresh();
    }

    function handleSave(event, beforeSaveArr) {
        if (beforeSaveArr.action === "NEW") {
            onSaveNew(beforeSaveArr)
        }
        else if (beforeSaveArr.action === "DELETE") {
            onSaveDelete(beforeSaveArr)
        }
        else if (beforeSaveArr.action === "MODIFY") {
            onSaveModify(beforeSaveArr)
        }
        let afterSaveArr = { ...beforeSaveArr.data }
        return afterSaveArr
    }

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initila values of Component Schema etc.

    // Enable navigation prompt
    window.onbeforeunload = function() {
        if(config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted){
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    // Get Grid Columns
    function __getGridColumns(dataArray) {
        let gridCols = [];
        let remoteCols = [];

        remoteCols = Object.keys(dataArray);

        remoteCols.map(col => (
            gridCols[col] = { objectType: "TextBox", datatype: "text", name: col, placeholder: col, editable: false, sqlColumn: col, style: { textAlign: "left" } }
        ));

        return gridCols;
    }

    // Get Grid Rows
    function __getGridRows(dataArray) {
        let gridRows = [];

        Object.entries(dataArray).forEach(([index, data]) => {
            gridRows.push({ ...data });
        });

        return gridRows;
    }

    // Reset Grid
    function __resetGrid(){
        let gridDefaultColumns = [];
        let gridDefaultRows = [];

        config["gridUpload"].setColumns(gridDefaultColumns);
        config["gridUpload"].setData(gridDefaultRows);
    }

    function __resetUploadFile() {
        config["inputFile"].data.fileList = [];
        document.getElementById('file-upload').value = '';
        config["attachmentList"].data.attachmentList = [];
        config["attachmentList"].reRender();
    }

    function fileUploadValidation(upload) {
        if (upload) {
            let uploadFileSize = parseFloat(upload.size / (1024 * 1024)).toFixed(2);
            let uploadFileName = upload.name.split('.')[0];
            let uploadFileExtention = upload.name.split('.').pop();

            let fileName = "SF_Style";
            let extentionsAllowed = ["xls", "xlsx"];

            if (uploadFileSize > 5) {
                return 'Please Select file size less than 5 MB';
            } else if (uploadFileName.toUpperCase() !== fileName.toUpperCase()) {
                return 'Wrong File Selected';
            } else if (!extentionsAllowed.includes(uploadFileExtention)) {
                return 'Only Excel File Format Allowed';
            } else {
                return 'success';
            }
        } else {
            return "Please Select an attachment.";
        }
    }

    function create_UUID() {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function handleChangeFile(event) {
        try {
            let file = event.target.files[0]

            if (file) {
                const validation = fileUploadValidation(file);

                if (validation === "success") {

                    let attachmentList = config["attachmentList"].data.attachmentList;
                    let fileList = config["inputFile"].data.fileList;

                    if (attachmentList.length === 0 && fileList.length === 0) {
                        let fileData = {
                            id: create_UUID(),
                            data: file,
                            attachmentName: file.name,
                            url: ""
                        }
    
                        fileList.push(fileData);
                        attachmentList.push(fileData);
    
                        config["attachmentList"].data.attachmentList = attachmentList
                        config["attachmentList"].reRender()
                    }
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage(validation, "");
                }

            }
        } catch (error) {
            console.log(error.response);
        }
    }

    async function handleFileRemove(event, id) {
        try {
            if (id !== "") {
                let fileList = config["attachmentList"].data.attachmentList;
                const newList = fileList.filter(object => object.id !== id);
                config["inputFile"].data.fileList = [];
                document.getElementById('file-upload').value = '';
                config["attachmentList"].data.attachmentList = newList
                config["attachmentList"].reRender()
                config["CONTROL_CENTER"].promptBaseMessage("Attachment Deleted", "")
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    function onChange(event) {
        event.preventDefault();
    }

    function onPopulate(event) {
        event.preventDefault();
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...
        return dataArray
    }

    function onDelete() {
        //Action handling when DELETE buttion clicked...
    }

    function onRefresh() {
        //Action handling when REFRESH buttion clicked...
    }
    
    function handleResetData() {
        __resetGrid();
        __resetUploadFile();
    }

    function onSaveNew(dataArr) {
        console.log("********Save New dataArr*********");
        console.log(dataArr);
    }

    function onSaveModify(dataArr) {
        console.log("********Save Modify dataArr*********");
        console.log(dataArr);
    }

    async function handleFileUpload(event) {
        try {
            const file = config["inputFile"].data.fileList;

            if (file.length > 0) {
    
                const formData = new FormData();
                formData.append(`model`, "Style");
                file.forEach((value, index) => {
                    formData.append(`payload`, value.data);
                });

                console.log("**********payload************")
                console.log(formData.get('payload'));

                document.getElementById("spinner").style.display = "";
                const uploadData = await API.post(`dataFileImporter`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                document.getElementById("spinner").style.display = "none";

                console.log("**********uploadData************")
                console.log(uploadData);

                if (uploadData.status === 200) {
                    console.log("**********uploadData rows************")
                    console.log(uploadData.data);
                    let gridCols = __getGridColumns(uploadData.data[0])
                    let gridRows = __getGridRows(uploadData.data)

                    config["gridUpload"].setColumns(gridCols);
                    config["gridUpload"].setData(gridRows);

                    __resetUploadFile();
                    //config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                }
            } else {
                if (file.length === 0) {
                    config["CONTROL_CENTER"].promptWarningMessage("No file Selected", "");
                }
            }

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            try {
                if (error.response.data.message) {
                    try {
                        let errors = [];

                        Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
                            data.forEach(error => errors.push(error));
                        });

                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    } catch (error) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
                    }
                }
            } catch (error) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
            }
        }
    }

    function onSaveDelete(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    return generateStyleUploadDisplay(config)
}

export default StyleUpload;