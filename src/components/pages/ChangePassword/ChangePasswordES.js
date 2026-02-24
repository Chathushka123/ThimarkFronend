import React, { useEffect, useState } from 'react';
import { generateChangePasswordDisplay } from './ChangePasswordDS';
import config from './ChangePasswordCS';
import API from '../../../api/API';
import { getUser } from '../../../utils/Common';

const ChangePassword = () => {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender

    config["buttonChangePassword"].event.onClick = handleChangePassword;

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

    const user = getUser();
    const loggedInUser = user && user.id;

    // Executes when Page Load 
    useEffect(() => {
        // Set User Profile Details
        __setUser(loggedInUser);
    }, []);

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function __setUser(loggedInUser) {
        __resetForm();
        try {
            if (loggedInUser !== "") {
                
                const getUser = await __getUserData(loggedInUser);
                
                if (getUser && getUser !== "Error" && getUser[0].User.length > 0) {
                    const userData = getUser[0].User[0];

                    console.log("********userData*********");
                    console.log(userData);

                    config["inputId"].setValue(userData.id);
                    config["inputUpdatedAt"].setValue(userData.updated_at);

                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Please login", "");
                }
            } else {
                if (loggedInUser === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please login", "");
                }
            }

        } catch (error) {
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
            const relations = [
                "role"
            ];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetStyleData Error**********");
            console.log(error.response);
            return "Error";
        }
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

    function __resetForm(){
        config["inputId"].setValue("");
        config["inputUpdatedAt"].setValue("");
        //config["inputOldPassword"].setValue("");
        config["inputNewPassword"].setValue("");
        config["inputConfirmNewPassword"].setValue("");
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    function onChange(event) {
        event.preventDefault();
        //alert("This is the place where you write CHANGE")
    }

    function onPopulate(event) {
        event.preventDefault();
        //alert("This is the place where you write POPULATE")
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...
        //alert("This is the place where you write NEW")
        return dataArray
    }

    function onDelete() {
        //Action handling when DELETE buttion clicked...
        //alert("This is the place where you write DELETE")
    }

    function onRefresh() {
        //Action handling when REFRESH buttion clicked...
        //alert("This is the place where you write REFRESH")
    }

    async function handleChangePassword(event) {
        try {
            const userId = config["inputId"].data.value;
            const newPassword = config["inputNewPassword"].data.value;
            const confirmNewPassword = config["inputConfirmNewPassword"].data.value;
            const updatedAt = config["inputUpdatedAt"].data.value;
            
            if (userId !== "" && newPassword !== "" && confirmNewPassword !== "" && newPassword === confirmNewPassword) {
                
                const apiRequest = {
                    "user_id": userId,
                    "password": newPassword,
                    "updated_at": updatedAt
                };
    
                console.log("********apiRequest*********");
                console.log(apiRequest);

                document.getElementById("spinner").style.display = "";
    
                const changePassword = await API.post(`permissions/changePassword`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("**********changePassword************")
                console.log(changePassword);

                if (changePassword.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Password Changed Successfully", "");
                    //__setUser(loggedInUser)
                    window.location.reload();
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                }
            } else {
                if (userId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Login", "");
                } else if (newPassword === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter New Password", "");
                } else if (confirmNewPassword === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Confirm Password", "");
                } else if (newPassword !== confirmNewPassword) {
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

    function onSaveNew(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    function onSaveModify(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    function onSaveDelete(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    return generateChangePasswordDisplay(config)
}

export default ChangePassword;