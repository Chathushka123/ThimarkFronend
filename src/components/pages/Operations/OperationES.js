import { useEffect, useState } from 'react';
import { generateOperationDisplay } from './OperationDS';
import config from './OperationCS';
import API from '../../../api/API';

const Operation = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onSave = handleSave;

    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonReloadList"].event.onClick = handleReloadList;

    config["gridOperations"].event.onRowCustomButton = handleRowEditClick;
    config["gridOperations"].event.onRowDelete = handleOperationDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        getAllOperations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    function __handleApiError(error) {
        console.log(error);
        try {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = [];
                Object.entries(error.response.data.errors).forEach(([, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(msg => errors.push(msg));
                    } else {
                        errors.push(messages);
                    }
                });
                config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                return;
            } else if (error.response && error.response.data && error.response.data.message) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message);
                return;
            }
        } catch (err) {
            console.log(err);
        }
        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    }

    async function getAllOperations() {
        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get(`operation/list`);
            const list = (response.data && response.data.data) || [];
            config['gridOperations'].setData(list.map(item => ({
                ...item,
                active: item.active ? "1" : "0"
            })));
        } catch (error) {
            __handleApiError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getAllOperations();
    }

    function handleNew() {
        return {
            "id": "",
            "operation_code": "",
            "description": "",
            "active": "1"
        };
    }

    function handleUndo() {
        config["CONTROL_CENTER"].event.__onNew();
    }

    function handleRowEditClick(e, r) {
        const row = config["gridOperations"].data[r];
        if (!row) return;

        config["CONTROL_CENTER"].populate({
            "id": row.id,
            "operation_code": row.operation_code,
            "description": row.description,
            "active": row.active === "1" || row.active === true || row.active === 1 ? "1" : "0"
        });
    }

    function __validate(operationCode, description) {
        if (!operationCode || operationCode.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Operation Code", "");
            return false;
        }
        if (operationCode.length > 100) {
            config["CONTROL_CENTER"].promptWarningMessage("Operation Code cannot exceed 100 characters", "");
            return false;
        }
        if (!description || description.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Description", "");
            return false;
        }
        if (description.length > 250) {
            config["CONTROL_CENTER"].promptWarningMessage("Description cannot exceed 250 characters", "");
            return false;
        }
        return true;
    }

    async function handleSave(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const id = dataArr.data.id;
            const operationCode = (dataArr.data.operation_code || "").trim();
            const description = (dataArr.data.description || "").trim();
            const active = dataArr.data.active === "1";

            if (__validate(operationCode, description)) {
                const apiRequest = {
                    operation_code: operationCode,
                    description: description,
                    active: active
                };

                document.getElementById("spinner").style.display = "";
                let response;
                if (dataArr.action === "MODIFY" && id && id !== "") {
                    response = await API.put(`operation/update/${id}`, apiRequest);
                } else {
                    response = await API.post(`operation/create`, apiRequest);
                }

                resultArr = response.data;
                if (resultArr && resultArr.success) {
                    config["CONTROL_CENTER"].promptBaseMessage(resultArr.message || "Operation saved successfully", "");
                    await getAllOperations();
                    if (resultArr.data && resultArr.data.id) {
                        config['inputId'].data.value = resultArr.data.id;
                        config['inputId'].data.oldValue = resultArr.data.id;
                    }
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage((resultArr && resultArr.message) || "Error saving Operation", "");
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        } catch (error) {
            __handleApiError(error);
            isValid = false;
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
        resultArr.success = isValid;
        callback(resultArr);
    }

    async function handleOperationDelete(event, rowId) {
        const row = config["gridOperations"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Are you sure you want to delete operation "${row.operation_code}"?`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.delete(`operation/delete/${row.id}`);

            if (response.data && response.data.success) {
                config["CONTROL_CENTER"].promptBaseMessage(response.data.message || "Operation deleted successfully", "");

                const currentId = config['inputId'].data.value;
                if (currentId && String(currentId) === String(row.id)) {
                    config["CONTROL_CENTER"].event.__onNew();
                }

                await getAllOperations();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage(response.data.message || "Error deleting Operation", "");
                row._rowstate = undefined;
                reRender();
            }
        } catch (error) {
            __handleApiError(error);
            row._rowstate = undefined;
            reRender();
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    return generateOperationDisplay(config)
}

export default Operation;
