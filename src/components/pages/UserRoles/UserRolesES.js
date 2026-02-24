import React, { useEffect, useState } from 'react';
import { generateBuyerDisplay } from './UserRolesDS';
import config from './UserRolesCS';
import API from '../../../api/API';

const Buyer = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    config["inputRoleCode"].event.onEnterKey = handleEnterRoleCode;
    config["inputRoleCode"].event.onBlur = handleBlurRoleCode;
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["buttonReset"].event.onClick = handleReset;
    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonAddUser"].event.onClick = handleAddRowUser;
    config["buttonDeleteMaster"].event.onClick = handleDeleteMaster;
    config["buttonDeleteMasterYes"].event.onClick = handleDeleteMasterYes;
    config["buttonDeleteMasterNo"].event.onClick = handleDeleteMasterNo;

    config["lovComboBoxUser"].event.onComboSearch = handleComboSearchUser;
    config["lovComboBoxUser"].event.onLovDone = handleLovDoneUser;
    config["lovComboBoxUser"].event.onLovSearch = handleLovSearchUser;
    config["lovComboBoxUser"].event.onBlurWithChange = handleBlurLovUser;

    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onDelete = handleDelete;
    config["CONTROL_CENTER"].event.onRefresh = handleRefresh;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;

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

    function handleSave(event, beforeSaveArr, callback) {
        let afterSaveArr
        if (beforeSaveArr.action === "NEW") {
            afterSaveArr = onSaveNew(event, beforeSaveArr, callback);
        }
        else if (beforeSaveArr.action === "DELETE") {
            afterSaveArr = onSaveDelete(event, beforeSaveArr, callback);
        }
        else if (beforeSaveArr.action === "MODIFY") {
            afterSaveArr = onSaveModify(event, beforeSaveArr, callback);
        }
        return afterSaveArr;
    }

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "userRoles" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonNew"].setVisible(false);
            config["buttonSave"].setVisible(false);
            config["buttonDeleteMaster"].setVisible(false);
            config["buttonAddUser"].setVisible(false);
            config["lovComboBoxUser"].setLovDisable(true);
            config["lovComboBoxUser"].setEditable(false);
            config["gridUserRoleDetails"].setModeEditable(false);
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

    // Get UserRoleDetails Grid Columns
    function __getGridUserRoleDetailsColumns() {
        let gridCols = [];

        gridCols["tbl_updated_at"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "tbl_updated_at", placeholder: "Updated At", visible: false, editable: false, sqlColumn: "tbl_updated_at", style: { textAlign: "left" } };
        gridCols["tbl_user_id"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "tbl_user_id", placeholder: "User ID", visible: false, editable: false, sqlColumn: "tbl_user_id", style: { textAlign: "left" } };
        gridCols["tbl_user_name"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "tbl_user_name", placeholder: "Name", editable: false, sqlColumn: "tbl_user_name", style: { textAlign: "left", minWidth: "300px", width: "300px" } };
        gridCols["tbl_user_email"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "tbl_user_email", placeholder: "Email", editable: false, sqlColumn: "tbl_user_email", style: { textAlign: "left", minWidth: "300px", width: "300px" } };

        return gridCols;
    }

    // Get UserRoleDetails Grid Rows
    function __getGridUserRoleDetailsRows(results) {
        let gridRows = [];

        Object.entries(results).forEach(([index, data]) => {
            console.log(data)
            gridRows.push({
                "tbl_updated_at": data.updated_at,
                "tbl_user_id": data.id,
                "tbl_user_name": data.name,
                "tbl_user_email": data.email
            });
        });

        return gridRows;
    }

    // Get User Role Details By User Role Id
    async function __getUserRoleData(userRoleId) {
        try {
            const key = "Role";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "id",
                    "operator": "=",
                    "value": userRoleId
                }
            ];
            const relations = [
                "users"
            ];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetBuyerData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get UserRoleId By RoleCode
    async function __getUserRoleIdByRoleCode(roleCode) {
        let userRoleId = "";
        try {
            const key = "Role";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "role_code",
                    "operator": "=",
                    "value": roleCode
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getId = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getId && getId !== "Error" && getId[0].Role.length > 0) {
                userRoleId = getId[0].Role[0].id;
            }
        } catch (error) {
            console.log("***********GetUserRoleIdByRoleCode Error**********");
            console.log(error.response);
        }
        return userRoleId;
    }

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

    // Reset Grid UserRoleDetails
    function __resetGridUserRoleDetails() {
        let gridUserRoleDetailsDefaultColumns = __getGridUserRoleDetailsColumns();
        let gridUserRoleDetailsDefaultRows = [];

        config["gridUserRoleDetails"].setColumns(gridUserRoleDetailsDefaultColumns);
        config["gridUserRoleDetails"].setData(gridUserRoleDetailsDefaultRows);
    }

    // Get All
    async function __getAll() {
        try {
            const key = "Role";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 25;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetAll Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Advance Search Details
    async function __getAdvanceSearchDetails(searchCriteria) {
        try {
            const apiRequest = {
                "Role": {
                    "role_code": searchCriteria.role_code_search === "" ? "%" : searchCriteria.role_code_search,
                    "description": searchCriteria.description_search === "" ? "%" : searchCriteria.description_search,
                    "orderby": "created_at:desc",
                    "limit": 25
                }
            };
            console.log("***********GetDetails Error**********");
            console.log(JSON.stringify(apiRequest));
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get User ID By Name
    async function __getUserIdByName(name) {
        let Id = "";
        try {
            const key = "User";
            const distinct = false;
            const select = ["id"];
            const where = [
                {
                    "field-name": "name",
                    "operator": "=",
                    "value": name
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getId = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getId && getId !== "Error" && getId[0].User.length > 0) {
                Id = getId[0].User[0].id;
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter valid Name", "");
            }
        } catch (error) {
            console.log("***********GetUserIdByName Error**********");
            console.log(error.response);
        }
        return Id;
    }

    // Get User List
    async function __getUserList() {
        try {
            const key = "User";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "role_id",
                    "operator": "=",
                    "value": null
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 25;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetUserList Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get User Lov Search Details
    async function __getUserLovSearchDetails(searchCriteria) {
        try {
            const apiRequest = {
                "User": {
                    "name": searchCriteria.name === "" ? "%" : searchCriteria.name,
                    "email": searchCriteria.email === "" ? "%" : searchCriteria.email,
                    "orderby": "created_at:desc",
                    "limit": 25
                }
            };

            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            console.log("*******details********");
            console.log(details);

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get User Details By User Id
    async function __getUserData(userId) {
        try {
            const key = "User";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "id",
                    "operator": "=",
                    "value": userId
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetUserData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    async function handleAdvanceSearchPopup() {
        let data = [];
        const getData = await __getAll();

        if (getData && getData !== "Error" && getData[0].Role.length > 0) {
            const listData = getData[0].Role;
            listData.forEach((value, index) => (
                data.push({
                    "role_code_search": value.role_code,
                    "description_search": value.description
                })
            ));
        }

        console.log("*******All Data********");
        console.log(data);

        let msg = "";
        if (data.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            data = data.slice(0, 20);
        }

        config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
    }

    async function handleAdvanceSearchDone(event, selectedRow) {
        console.log("*******Search Return Row********");
        console.log(selectedRow);
        if (typeof selectedRow !== "undefined" && selectedRow.role_code_search !== "") {
            // Get User Role Id from Role Code
            const userRoleId = await __getUserRoleIdByRoleCode(selectedRow.role_code_search);
            await formPopulate(userRoleId);
        }
    }

    async function handleAdvanceSearch(event, searchCriteria, callback) {
        console.log("*******Search Criteria********");
        console.log(searchCriteria);

        let data = [];
        let searchDetails = await __getAdvanceSearchDetails(searchCriteria);

        if (searchDetails.length > 0) {
            searchDetails.forEach((value, index) => (
                data.push({
                    "role_code_search": value.role_code,
                    "description_search": value.description
                })
            ));
        }

        console.log("*******Search Results********");
        console.log(data);

        let msg = "";
        if (data.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            data = data.slice(0, 20);
        }

        callback(data, msg);
    }

    /************ Start - When User LOV Clicked ************/

    async function handleBlurLovUser() {
        const name = config["lovComboBoxUser"].data.value;
        if (name !== "") {
            const userId = await __getUserIdByName(name);
            if (userId !== "") {
                config["lovComboBoxUser"].setValueWithId(name, userId);
            } else {
                config["lovComboBoxUser"].setValueWithId("", "");
            }
        }
    }

    async function handleComboSearchUser(event) {
        let rows = [];
        const getData = await __getUserList();

        let titles = {
            user_id: { displayName: "ID", visible: false },
            name: { displayName: "Name", visible: true },
            email: { displayName: "Email", visible: true }
        }

        if (getData && getData !== "Error" && getData[0].User.length > 0) {
            const listData = getData[0].User;
            listData.forEach((value, index) => (
                rows.push({
                    "user_id": value.id,
                    "name": value.name,
                    "email": value.email
                })
            ));
        }

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        config["lovComboBoxUser"].showLovWindow(titles, rows, msg)
    }

    async function handleLovDoneUser(event, lovRow) {
        config["lovComboBoxUser"].setValueWithId(lovRow.name, lovRow.user_id)
        const userId = config["lovComboBoxUser"].data.id;
        const userName = config["lovComboBoxUser"].data.value;
        console.log(`User ID - ${userId}`);
        console.log(`Name - ${userName}`);
    }

    async function handleLovSearchUser(event, searchCriteria, callback) {
        console.log("**************Selected row from search***************")
        console.log(searchCriteria)

        let rows = [];
        let searchDetails = await __getUserLovSearchDetails(searchCriteria);

        if (searchDetails.length > 0) {
            searchDetails.forEach((value, index) => (
                rows.push({
                    "user_id": value.id,
                    "name": value.name,
                    "email": value.email
                })
            ));
        }

        console.log("*******Search Results********");
        console.log(rows);

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        callback(rows, msg);
    }

    /************ End - When User LOV Clicked ************/

    async function handleAddRowUser(event) {
        try {
            let dataRow = {};
            const userId = config["lovComboBoxUser"].data.id;
            const userName = config["lovComboBoxUser"].data.value;
            let existingUserList = config["gridUserRoleDetails"].data;

            config["lovComboBoxUser"].setValueWithId("", "");

            if (userId !== "" && userName !== "") {
                let list = [];
                if (existingUserList.length > 0) {
                    existingUserList.forEach(data => {
                        list.push(data.tbl_user_id)
                    })
                }
                if (!list.includes(parseInt(userId))) {

                    const userDetails = await __getUserData(userId);
                    console.log("***********userDetails*********");
                    console.log(userDetails);
                    if (userDetails && userDetails !== "Error" && userDetails[0].User.length > 0) {
                        const userData = userDetails[0].User[0];

                        console.log("***********userData*********");
                        console.log(userData);

                        dataRow = {
                            "tbl_updated_at": userData.updated_at,
                            "tbl_user_id": userData.id,
                            "tbl_user_name": userData.name,
                            "tbl_user_email": userData.email
                        }
                    }

                    if (Object.keys(dataRow).length !== 0) {
                        config["gridUserRoleDetails"].addRow(dataRow);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                    }
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("User Already Exists", "");
                }
            } else {
                if (userId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select User", "");
                } else if (userName === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select User", "");
                }
            }
        } catch (error) {
            config["CONTROL_CENTER"].promptErrorMessage("Error", "");
        }
    }

    function handleUndo() {
        let id = config["inputId"].data.value;
        if (id !== "") {
            formPopulate(id);
        }
    }

    function handleReset() {
        window.location.reload();
    }

    function onChange(event) {
        event.preventDefault();
        //alert("This is the place where you write CHANGE");
    }

    // Execute when Role Code Enter Key Press
    async function handleEnterRoleCode(event) {
        event.preventDefault();
        try {
            const roleCode = config["inputRoleCode"].data.value;
            // Get UserRoleId By RoleCode
            const userRoleId = await __getUserRoleIdByRoleCode(roleCode);
            await formPopulate(userRoleId);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Execute when Role Code On Blur
    async function handleBlurRoleCode(event) {
        event.preventDefault();
        try {
            const formState = config["CONTROL_CENTER"].state.new;
            const roleCode = config["inputRoleCode"].data.value;
            // Get UserRoleId By RoleCode
            const userRoleId = await __getUserRoleIdByRoleCode(roleCode);
            if (!formState) {
                //await formPopulate(userRoleId);
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    async function formPopulate(userRoleId) {

        __resetGridUserRoleDetails();

        let dataArray = {
            "id": "",
            "role_code": "",
            "description": "",
            "gridUserRoleDetails": { "data": [], "columns": [] },
            "updated_at": "",
            "status": ""
        };

        if (userRoleId && userRoleId !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get User Role Details from User Role Id
                const details = await __getUserRoleData(userRoleId);

                console.log("********details*********");
                console.log(details);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].Role.length > 0) {
                    const userRoleData = details[0].Role[0];

                    let gridUserRoleDetailsColumns = __getGridUserRoleDetailsColumns();
                    let gridUserRoleDetailsRows = [];

                    if (userRoleData.users.length > 0) {
                        // Set UserRoleDetails Grid Rows
                        gridUserRoleDetailsRows = __getGridUserRoleDetailsRows(userRoleData.users);
                    }

                    dataArray = {
                        "id": userRoleData.id,
                        "role_code": userRoleData.role_code,
                        "description": userRoleData.description,
                        "gridUserRoleDetails": { "data": gridUserRoleDetailsRows, "columns": gridUserRoleDetailsColumns },
                        "updated_at": userRoleData.updated_at,
                        "status": userRoleData.status
                    };

                    config["CONTROL_CENTER"].populate(dataArray);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Role Code", "");
                    config["CONTROL_CENTER"].populate(dataArray);
                    __resetGridUserRoleDetails();
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                config["CONTROL_CENTER"].populate(dataArray);
                __resetGridUserRoleDetails();
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Role Code", "");
            config["CONTROL_CENTER"].populate(dataArray);
            __resetGridUserRoleDetails();
        }
    }

    async function onPopulate(event, callback) {
        event.preventDefault();

        __resetGridUserRoleDetails();

        const roleCode = config["inputRoleCode"].data.value;

        let dataArray = {
            "id": "",
            "role_code": "",
            "description": "",
            "gridUserRoleDetails": { "data": [], "columns": [] },
            "updated_at": "",
            "status": ""
        };

        if (roleCode && roleCode !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get UserRoleId By RoleCode
                const userRoleId = await __getUserRoleIdByRoleCode(roleCode);
                // Get User Role Details from User Role Id
                const details = await __getUserRoleData(userRoleId);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].Role.length > 0) {
                    const userRoleData = details[0].Role[0];

                    let gridUserRoleDetailsColumns = __getGridUserRoleDetailsColumns();
                    let gridUserRoleDetailsRows = [];

                    if (userRoleData.users.length > 0) {
                        // Set UserRoleDetails Grid Rows
                        gridUserRoleDetailsRows = __getGridUserRoleDetailsRows(userRoleData.users);
                    }

                    dataArray = {
                        "id": userRoleData.id,
                        "role_code": userRoleData.role_code,
                        "description": userRoleData.description,
                        "gridUserRoleDetails": { "data": gridUserRoleDetailsRows, "columns": gridUserRoleDetailsColumns },
                        "updated_at": userRoleData.updated_at,
                        "status": userRoleData.status
                    };

                    callback(dataArray);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Role Code", "");
                    callback(dataArray);
                    __resetGridUserRoleDetails();
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                callback(dataArray);
                __resetGridUserRoleDetails();
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Role Code", "");
            callback(dataArray);
            __resetGridUserRoleDetails();
        }
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...

        __resetGridUserRoleDetails();

        return dataArray;
    }

    function handleRowDelete(event, rowId) {
        //alert("This is delete of row " + rowId)
    }

    function onDelete() {
        //Action handling when DELETE buttion clicked...
        //alert("This is the place where you write DELETE");
    }

    function onRefresh() {
        //Action handling when REFRESH buttion clicked...
        //alert("This is the place where you write REFRESH");
    }

    async function onSaveNew(event, dataArr, callback) {
        console.log("********Save New dataArr*********");
        console.log(dataArr);
        let resultArr = {};
        let isValid = true;
        try {
            if (dataArr.action === "NEW") {
                let roleCode = dataArr.data.role_code;
                let description = dataArr.data.description;

                let gridRows = dataArr.data.gridUserRoleDetails.data;
                let userRoleDetailsUpdateList = [];

                Object.entries(gridRows).forEach(([index, data]) => {
                    let userId = data.tbl_user_id
                    let updatedAt = data.tbl_updated_at;

                    let updateList = {};
                    updateList[userId] = {
                        "role_id": "!PARENT_KEY!",
                        "updated_at": updatedAt
                    };
                    userRoleDetailsUpdateList.push(updateList);
                });

                const apiRequest = {
                    "Role": {
                        "CRE": [
                            {
                                "role_code": roleCode,
                                "description": description,
                                "relations": {
                                    "User": {
                                        "UPD": userRoleDetailsUpdateList
                                    }
                                }
                            }
                        ]
                    }
                };

                console.log("********Create apiRequest*********");
                console.log(JSON.stringify(apiRequest));

                if (roleCode !== "" && description !== "") {

                    document.getElementById("spinner").style.display = "";

                    const createRole = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********createRole*********");
                    console.log(createRole);

                    resultArr = createRole.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                        // Get UserRoleId By RoleCode
                        const userRoleId = await __getUserRoleIdByRoleCode(roleCode);
                        await formPopulate(userRoleId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (roleCode === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Role Code", "");
                        isValid = false;
                    } else if (description === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Description", "");
                        isValid = false;
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    async function onSaveModify(event, dataArr, callback) {
        console.log("********Save Modify dataArr*********");
        console.log(dataArr);
        let resultArr = {}
        let isValid = true;
        try {
            if (dataArr.action === "MODIFY") {
                let userRoleId = dataArr.data.id;
                let roleCode = dataArr.data.role_code;
                let description = dataArr.data.description;
                let roleUpdatedAt = dataArr.data.updated_at;

                let gridRows = dataArr.data.gridUserRoleDetails.data;

                let userRoleDetailsUpdateList = [];

                Object.entries(gridRows).forEach(([index, data]) => {
                    if (typeof data._rowstate !== 'undefined') {
                        let userId = data.tbl_user_id
                        let updatedAt = data.tbl_updated_at;
                        let rowState = data._rowstate;

                        let updateList = {};
                        if (rowState === "NEW") {
                            updateList[userId] = {
                                "role_id": userRoleId,
                                "updated_at": updatedAt
                            };
                            userRoleDetailsUpdateList.push(updateList);
                        } else if (rowState === "DELETED") {
                            updateList[userId] = {
                                "role_id": null,
                                "updated_at": updatedAt
                            };
                            userRoleDetailsUpdateList.push(updateList);
                        }
                    }
                });

                const apiRequest = {
                    "Role": {
                        "UPD": [
                            {
                                [userRoleId]: {
                                    "role_code": roleCode,
                                    "description": description,
                                    "relations": {
                                        "User": {
                                            "UPD": userRoleDetailsUpdateList
                                        }
                                    },
                                    "updated_at": roleUpdatedAt
                                }
                            }
                        ]
                    }
                };

                console.log("********Modify apiRequest*********");
                console.log(JSON.stringify(apiRequest));

                if (roleCode !== "") {

                    document.getElementById("spinner").style.display = "";

                    const updateBuyer = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********updateBuyer*********");
                    console.log(updateBuyer);

                    resultArr = updateBuyer.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                        await formPopulate(userRoleId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (roleCode === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Buyer Code", "");
                        isValid = false;
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    function handleDeleteMaster(event) {
        let deleteMasterId = config["inputId"].data.value;

        if (deleteMasterId !== "") {
            config["deleteMasterPopUp"].showPopUp();
            config["inputDeleteMasterId"].data.value = deleteMasterId;
        } else {
            if (deleteMasterId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select a Record to Delete", "");
            }
        }
    }

    async function handleDeleteMasterYes() {
        let deleteMasterId = config["inputDeleteMasterId"].data.value;
        try {
            if (deleteMasterId !== "") {

                config["deleteMasterPopUp"].closePopUp();

                const apiRequest = {
                    "Role": {
                        "DEL": [deleteMasterId]
                    }
                };

                console.log("********apiRequest*********");
                console.log(apiRequest);

                document.getElementById("spinner").style.display = "";

                const deleteMaster = await API.post(`masterDetails`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                if (deleteMaster.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Record Deleted Successfully", "");
                    formPopulate();
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                if (deleteMasterId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select a Record to Delete", "");
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

    function handleDeleteMasterNo() {
        config["deleteMasterPopUp"].closePopUp();
    }

    async function onSaveDelete(event, dataArr, callback) {
        let resultArr = {}
        let isValid = true;
        let userRoleId = dataArr.data.id;
        try {
            if (dataArr.action === "DELETE") {

                const apiRequest = {
                    "Role": {
                        "DEL": [userRoleId]
                    }
                };
                console.log("********Delete apiRequest*********");
                console.log(apiRequest);

                if (userRoleId !== "") {

                    document.getElementById("spinner").style.display = "";

                    const deleteRole = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********deleteRole*********");
                    console.log(deleteRole);

                    resultArr = deleteRole.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Deleted Successfully", "");
                        handleReset();
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (userRoleId === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Select Buyer", "");
                        isValid = false;
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    return generateBuyerDisplay(config)
}

export default Buyer;