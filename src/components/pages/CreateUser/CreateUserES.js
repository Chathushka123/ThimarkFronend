import React, { useEffect, useState } from 'react';
import { generateCreateUserDisplay } from './CreateUserDS';
import config from './CreateUserCS';
import API from '../../../api/API';
import { getUser } from '../../../utils/Common';

const CreateUser = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    config["inputEmail"].event.onEnterKey = handleEnterEmail;
    config["inputEmail"].event.onBlur = handleBlurEmail;
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["buttonReset"].event.onClick = handleReset;
    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonChangePassword"].event.onClick = handleChangePassword;
    config["buttonChangePasswordYes"].event.onClick = handleChangePasswordYes;
    config["buttonChangePasswordNo"].event.onClick = handleChangePasswordNo;
    config["buttonDeleteMaster"].event.onClick = handleDeleteMaster;
    config["buttonDeleteMasterYes"].event.onClick = handleDeleteMasterYes;
    config["buttonDeleteMasterNo"].event.onClick = handleDeleteMasterNo;

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

    const user = getUser();
    const loggedInUserEmail = user && user.email;

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();

        // Set Role Dropdown Options
        __getRoleDropdownOptions();

        config["buttonChangePassword"].setDisabled(true);
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "createUser" }
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
            config["buttonChangePassword"].setVisible(false);
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

    // Get Role Dropdown Options
    async function __getRoleDropdownOptions() {
        try {
            let dropdownOptions = [{ value: "", text: "- Select Role -" }];

            const key = "Role";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getDetails = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getDetails && getDetails !== "Error" && getDetails[0].Role.length > 0) {
                getDetails[0].Role.forEach(data => {
                    dropdownOptions.push({ "value": data.id, "text": data.role_code })
                });
            }

            config["inputUserRole"].setOptions(dropdownOptions);

        } catch (error) {
            console.log("***********GetRoleDropdownOptions Error**********");
            console.log(error.response);
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

    // Get UserId By Email
    async function __getUserIdByEmail(email) {
        let userId = "";
        try {
            const key = "User";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "email",
                    "operator": "=",
                    "value": email
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getId = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getId && getId !== "Error" && getId[0].User.length > 0) {
                userId = getId[0].User[0].id;
            }
        } catch (error) {
            console.log("***********GetUserIdByEmail Error**********");
            console.log(error.response);
        }
        return userId;
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

    // Get All
    async function __getAll() {
        try {
            const key = "User";
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
                "User": {
                    "email": searchCriteria.email_search === "" ? "%" : searchCriteria.email_search,
                    "name": searchCriteria.name_search === "" ? "%" : searchCriteria.name_search,
                    "orderby": "created_at:desc",
                    "limit": 25
                }
            };
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
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

        if (getData && getData !== "Error" && getData[0].User.length > 0) {
            const listData = getData[0].User;
            listData.forEach((value, index) => (
                data.push({
                    "email_search": value.email,
                    "name_search": value.name
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
        if (typeof selectedRow !== "undefined" && selectedRow.email_search !== "") {
            // Get User Id from Email
            const userId = await __getUserIdByEmail(selectedRow.email_search);
            await formPopulate(userId);
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
                    "email_search": value.email,
                    "name_search": value.name
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

    // Execute when Email Enter Key Press
    async function handleEnterEmail(event) {
        event.preventDefault();
        try {
            const email = config["inputEmail"].data.value;
            // Get User Id from Email
            const userId = await __getUserIdByEmail(email);
            await formPopulate(userId);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Execute when Email On Blur
    async function handleBlurEmail(event) {
        event.preventDefault();
        try {
            const formState = config["CONTROL_CENTER"].state.new;
            const email = config["inputEmail"].data.value;
            // Get User Id from Email
            const userId = await __getUserIdByEmail(email);
            if (!formState) {
                //await formPopulate(userId);
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    async function formPopulate(userId) {

        let dataArray = {
            "id": "",
            "email": "",
            "name": "",
            "password": "",
            "confirm_password": "",
            "is_active": "",
            "role_id": "",
            "updated_at": "",
            "status": "",
            "common_user":"",
        };

        if (userId && userId !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get User Details from User Id
                const details = await __getUserData(userId);

                console.log("********details*********");
                console.log(details);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].User.length > 0) {
                    const userData = details[0].User[0];

                    dataArray = {
                        "id": userData.id,
                        "email": userData.email,
                        "name": userData.name,
                        "password": "",
                        "confirm_password": "",
                        "is_active": userData.is_active ? "1" : "0",
                        "role_id": userData.role_id,
                        "updated_at": userData.updated_at,
                        "status": userData.status,
                        "common_user":userData.common_user_state? "1" : "0",
                    };

                    if (userData.email === "sysadmin@gmail.com") {
                        config["inputName"].setDisabled(true);
                        config["inputUserRole"].setDisabled(true);
                        config["inputIsActive"].setDisabled(true);
                        config["buttonDeleteMaster"].setDisabled(true);
                    } else {
                        config["inputName"].setDisabled(false);
                        config["inputUserRole"].setDisabled(false);
                        config["inputIsActive"].setDisabled(false);
                        config["buttonDeleteMaster"].setDisabled(false);
                    }

                    if (loggedInUserEmail !== "sysadmin@gmail.com" && userData.email === "sysadmin@gmail.com") {
                        config["buttonChangePassword"].setDisabled(true);
                    } else {
                        config["buttonChangePassword"].setDisabled(false);
                    }

                    config["CONTROL_CENTER"].populate(dataArray);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Email", "");
                    config["CONTROL_CENTER"].populate(dataArray);
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                config["CONTROL_CENTER"].populate(dataArray);
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Email", "");
            config["CONTROL_CENTER"].populate(dataArray);
        }
    }

    async function onPopulate(event, callback) {
        event.preventDefault();

        const email = config["inputEmail"].data.value;

        let dataArray = {
            "id": "",
            "email": "",
            "name": "",
            "password": "",
            "confirm_password": "",
            "is_active": "",
            "role_id": "",
            "updated_at": "",
            "status": ""
        };

        if (email && email !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get User Id from Email
                const userId = await __getUserIdByEmail(email);
                // Get User Details from User Id
                const details = await __getUserData(userId);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].User.length > 0) {
                    const userData = details[0].User[0];

                    dataArray = {
                        "id": userData.id,
                        "email": userData.email,
                        "name": userData.name,
                        "password": "",
                        "confirm_password": "",
                        "is_active": userData.is_active ? "1" : "0",
                        "role_id": userData.role_id,
                        "updated_at": userData.updated_at,
                        "status": userData.status
                    };

                    if (userData.email === "sysadmin@gmail.com") {
                        config["inputName"].setDisabled(true);
                        config["inputUserRole"].setDisabled(true);
                        config["inputIsActive"].setDisabled(true);
                        config["buttonDeleteMaster"].setDisabled(true);
                    } else {
                        config["inputName"].setDisabled(false);
                        config["inputUserRole"].setDisabled(false);
                        config["inputIsActive"].setDisabled(false);
                        config["buttonDeleteMaster"].setDisabled(false);
                    }

                    if (loggedInUserEmail !== "sysadmin@gmail.com" && userData.email === "sysadmin@gmail.com") {
                        config["buttonChangePassword"].setDisabled(true);
                    } else {
                        config["buttonChangePassword"].setDisabled(false);
                    }

                    callback(dataArray);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Email", "");
                    callback(dataArray);
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                callback(dataArray);
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Email", "");
            callback(dataArray);
        }
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...

        config["inputName"].setDisabled(false);
        config["inputUserRole"].setDisabled(false);
        config["inputIsActive"].setDisabled(false);
        config["buttonDeleteMaster"].setDisabled(false);

        config["buttonChangePassword"].setDisabled(true);

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
                let email = dataArr.data.email;
                let name = dataArr.data.name;
                let isActive = dataArr.data.is_active;
                let roleId = dataArr.data.role_id;
                let common_user_state = dataArr.data.common_user;

                const apiRequest = {
                    "User": {
                        "CRE": [
                            {
                                "email": email,
                                "name": name,
                                "is_active": isActive === "1" ? true : false,
                                "role_id": roleId,
                                "common_user_state":common_user_state,
                            }
                        ]
                    }
                };

                console.log("********Create apiRequest*********");
                console.log(JSON.stringify(apiRequest));

                if (email !== "" && name !== "") {

                    document.getElementById("spinner").style.display = "";

                    const createUser = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********createUser*********");
                    console.log(createUser);

                    resultArr = createUser.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                        // Get User Id from Email
                        const userId = await __getUserIdByEmail(email);
                        await formPopulate(userId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (email === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Email", "");
                        isValid = false;
                    } else if (name === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Name", "");
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
                let userId = dataArr.data.id;
                let email = dataArr.data.email;
                let name = dataArr.data.name;
                let isActive = dataArr.data.is_active;
                let roleId = dataArr.data.role_id;
                let userUpdatedAt = dataArr.data.updated_at;
                let common_user_state = dataArr.data.common_user;

                const apiRequest = {
                    "User": {
                        "UPD": [
                            {
                                [userId]: {
                                    "email": email,
                                    "name": name,
                                    "is_active": isActive === "1" ? true : false,
                                    "role_id": roleId,
                                    "updated_at": userUpdatedAt,
                                    "common_user_state":common_user_state,
                                }
                            }
                        ]
                    }
                };
                console.log("********Modify apiRequest*********");
                console.log(apiRequest);

                if (email !== "" && name !== "") {

                    document.getElementById("spinner").style.display = "";

                    const updateUser = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********updateUser*********");
                    console.log(updateUser);

                    resultArr = updateUser.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                        await formPopulate(userId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (email === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Email", "");
                        isValid = false;
                    } else if (name === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Name", "");
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

    function handleChangePassword(event) {
        let userId = config["inputId"].data.value;

        if (userId !== "") {
            config["changePasswordPopUp"].showPopUp();
        } else {
            if (userId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select a User to Reset Password", "");
            }
        }
    }

    async function handleChangePasswordYes() {
        let userId = config["inputId"].data.value;
        let password = config["inputPassword"].data.value;
        let confirmPassword = config["inputConfirmPassword"].data.value;
        let updatedAt = config["inputUpdatedAt"].data.value;
        try {
            if (userId !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {

                config["changePasswordPopUp"].closePopUp();

                const apiRequest = {
                    "user_id": userId,
                    "password": password,
                    "updated_at": updatedAt
                };

                console.log("********apiRequest*********");
                console.log(JSON.stringify(apiRequest));

                document.getElementById("spinner").style.display = "";

                const changePassword = await API.post(`permissions/changePassword`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                if (changePassword.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Password Reset Successfully", "");
                    formPopulate(userId);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                if (userId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select a User to Reset Password", "");
                } else if (password === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Password", "");
                } else if (confirmPassword === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Confirm Password", "");
                } else if (password !== confirmPassword) {
                    config["CONTROL_CENTER"].promptWarningMessage("Passwords do not match", "");
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

    function handleChangePasswordNo() {
        config["changePasswordPopUp"].closePopUp();
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
                    "User": {
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
        let userId = dataArr.data.id;
        try {
            if (dataArr.action === "DELETE") {

                const apiRequest = {
                    "User": {
                        "DEL": [userId]
                    }
                };
                console.log("********Delete apiRequest*********");
                console.log(apiRequest);

                if (userId !== "") {

                    document.getElementById("spinner").style.display = "";

                    const deleteUser = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********deleteUser*********");
                    console.log(deleteUser);

                    resultArr = deleteUser.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Deleted Successfully", "");
                        handleReset();
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (userId === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Select User", "");
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

    return generateCreateUserDisplay(config)
}

export default CreateUser;