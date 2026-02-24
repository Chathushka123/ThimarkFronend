import React, { useEffect, useState } from 'react';
import { generatePermissionsDisplay } from './PermissionsDS';
import config from './PermissionsCS';
import API from '../../../api/API';

const Permissions = () => {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender

    config["buttonReset"].event.onClick = handleReset;

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

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();

        populateGrid();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "permissions" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonSave"].setVisible(false);
        }
    }

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    // Get Details
    async function __getDetails(key, distinct, select, where, relations, orderby, limit) {
        try {
            const apiRequest = {
                [key]: {
                    "distinct": distinct,
                    "select": select,
                    "where": where,
                    "relations": relations,
                    "orderby": orderby,
                    "limit": limit
                }
            };

            const getDetails = await API.post(`searchByParameters`, apiRequest);
            const details = getDetails.data;

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Details
    async function __getData() {
        try {
            const key = "Permissions";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Grid Columns
    function __getGridColumns(dataArray) {
        let gridCols = [];
        let remoteCols = [];

        remoteCols = Object.keys(dataArray);
        let i = 1;
        remoteCols.forEach((value, index) => {
            if (value === "key") {
                gridCols[value] = { objectType: "TextBox", colIndex: i, datatype: "text", name: value, placeholder: value, visible: false, editable: false, sqlColumn: value, style: { textAlign: "left" } }
            } else if (value === "function") {
                gridCols[value] = { objectType: "TextBox", colIndex: i, datatype: "text", name: value, placeholder: "Function", editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "200px", width: "200px" } }
            } else {
                gridCols[value] = { objectType: "DropDown", colIndex: i, datatype: "text", name: value, placeholder: value, editable: true, sqlColumn: value, options: [{ value: "", text: "" }, { value: "r", text: "r" }, { value: "w", text: "w" }], style: { textAlign: "left", minWidth: "150px", width: "150px" } }
            }
            i++;
        });

        return gridCols;
    }

    // Get Grid Rows
    function __getGridRows(dataArray) {
        let gridRows = [];

        dataArray.forEach(data => {
            gridRows.push({
                ...data
            })
        });

        return gridRows;
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    function handleReset() {
        window.location.reload();
    }

    function onChange(event) {
        event.preventDefault();
    }

    async function populateGrid() {
        let gridDataArray = {
            "gridPermissions": { "data": [], "columns": [] }
        };
        try {
            let gridColumns = [];
            let gridRows = [];

            document.getElementById("spinner").style.display = "";

            // Get Details
            const getDetails = await API.post(`permissions/getPermissions`);

            console.log("**********getDetails***********");
            console.log(getDetails);

            document.getElementById("spinner").style.display = "none";

            if (getDetails && getDetails.data.length > 0) {

                const dataArray = getDetails.data;

                console.log("**********dataArray***********");
                console.log(dataArray);

                // Set Columns
                gridColumns = __getGridColumns(dataArray[0]);
                // Get Rows
                gridRows = __getGridRows(dataArray);
            }

            gridDataArray = {
                "gridPermissions": { "data": gridRows, "columns": gridColumns }
            };
            config["CONTROL_CENTER"].populate(gridDataArray);

        } catch (error) {
            config["CONTROL_CENTER"].populate(gridDataArray);
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function onPopulate(event, callback) {
        event.preventDefault();
        let gridDataArray = {
            "gridPermissions": { "data": [], "columns": [] }
        };
        try {
            let gridColumns = [];
            let gridRows = [];

            document.getElementById("spinner").style.display = "";

            // Get Details
            const getDetails = await API.post(`permissions/getPermissions`);

            console.log("**********getDetails***********");
            console.log(getDetails);

            document.getElementById("spinner").style.display = "none";

            if (getDetails && getDetails.data.length > 0) {

                const dataArray = getDetails.data;

                console.log("**********dataArray***********");
                console.log(dataArray);

                // Set Columns
                gridColumns = __getGridColumns(dataArray[0]);
                // Get Rows
                gridRows = __getGridRows(dataArray);
            }

            gridDataArray = {
                "gridPermissions": { "data": gridRows, "columns": gridColumns }
            };

            callback(gridDataArray);

        } catch (error) {
            callback(gridDataArray);
            document.getElementById("spinner").style.display = "none";
        }
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

    function onSaveNew(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    async function onSaveModify(dataArr) {
        console.log("********Save Modify dataArr*********");
        console.log(dataArr);
        let resultArr = {}
        try {
            const permissionDetails = config["gridPermissions"].data;

            console.log("*************permissionDetails******************");
            console.log(permissionDetails);

            let permissionList = [];

            Object.entries(permissionDetails).forEach(([index, data]) => {
                const permissionRow = Object.keys(data).reduce((object, key) => {
                    if (key !== "_rowstate") {
                        object[key] = data[key];
                    }
                    return object;
                }, {});

                permissionList.push(permissionRow)
            });

            const apiRequest = {
                "permissions": permissionList
            };

            console.log("********apiRequest*********");
            console.log(JSON.stringify(apiRequest));

            document.getElementById("spinner").style.display = "";

            const modifyPermissions = await API.post(`permissions/updatePermissions`, apiRequest);

            document.getElementById("spinner").style.display = "none";

            console.log("********modifyPermissions*********");
            console.log(modifyPermissions);

            if (modifyPermissions.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                await populateGrid();
            } else {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
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

    return generatePermissionsDisplay(config)
}

export default Permissions;