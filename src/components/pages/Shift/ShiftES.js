import { useEffect, useState } from 'react';
import { generateShiftDisplay } from './ShiftDS';
import config from './ShiftCS';
import API from '../../../api/API';

const Shift = () => {
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

    config["gridShifts"].event.onRowCustomButton = handleRowEditClick;
    config["gridShifts"].event.onRowDelete = handleRowDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __checkIsAuthorized();
        getAllShifts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "shift" };
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            __setFormReadWrite(response.data);
        }).catch(() => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonNew"].setVisible(false);
            config["buttonSave"].setVisible(false);
        }
    }

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function __getDetails(key, distinct, select, where, relations, orderby, limit) {
        try {
            const apiRequest = {
                [key]: { "distinct": distinct, "select": select, "where": where, "relations": relations, "orderby": orderby, "limit": limit }
            };
            const response = await API.post(`searchByParameters`, apiRequest);
            return response.data;
        } catch (error) {
            console.log(error.response);
            return "Error";
        }
    }

    // The grid's Active checkbox column compares its value against the string
    // checkedValue "1" (BASE/Components.js's TbCheckBox does a strict ===),
    // but the API returns a real boolean/number for a tinyint column — so the
    // raw row must be coerced to "1"/"0" here or the checkbox always renders
    // unchecked regardless of the real status.
    function __normalizeActive(row) {
        return { ...row, active: row.active === true || row.active === 1 || row.active === "1" ? "1" : "0" };
    }

    async function getAllShifts() {
        try {
            document.getElementById("spinner").style.display = "";
            const data = await __getDetails("Shift", false, ["*"], [], [], "shift_name:asc", 1000);
            if (data && data !== "Error" && data[0].Shift.length > 0) {
                config['gridShifts'].setData(data[0].Shift.map(__normalizeActive));
            } else {
                config['gridShifts'].setData([]);
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getAllShifts();
    }

    function handleNew() {
        return {
            "shift_code": "",
            "shift_name": "",
            "active": "1"
        };
    }

    function handleRowEditClick(e, r) {
        const row = config["gridShifts"].data[r];
        if (!row) return;

        config["CONTROL_CENTER"].populate({
            "id": row.id,
            "shift_code": row.shift_code,
            "shift_name": row.shift_name,
            "active": row.active === true || row.active === 1 || row.active === "1" ? "1" : "0",
            "updated_at": row.updated_at
        });
    }

    function handleUndo() {
        const id = config["inputId"].data.value;
        if (id !== "") {
            const row = config["gridShifts"].data.find(r => String(r.id) === String(id));
            if (row) handleRowEditClick(null, config["gridShifts"].data.indexOf(row));
        } else {
            config["inputShiftCode"].setValue("");
            config["inputShiftName"].setValue("");
            config["inputActive"].setValue("1");
        }
    }

    async function handleRowDelete(event, rowId) {
        const row = config["gridShifts"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Delete shift "${row.shift_name}"? This cannot be undone.`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const apiRequest = { "Shift": { "DEL": [row.id] } };
            const response = await API.post(`masterDetails`, apiRequest);

            if (response.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Shift deleted successfully", "");
                if (String(config["inputId"].data.value) === String(row.id)) {
                    clearForm();
                }
                await getAllShifts();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting shift", "");
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

    // Clears the form back to an empty, ready-to-fill state (replays the
    // "New Shift" button's own reset so state.new stays true and Save still
    // dispatches "NEW" rather than an empty-id "MODIFY"). Only used outside
    // the Save callback chain (e.g. after deleting the row currently loaded
    // in the form) — onSaveNew/onSaveModify re-populate the saved record
    // instead, since the framework's own post-save reset already sets
    // state.new = false there.
    function clearForm() {
        if (typeof config["CONTROL_CENTER"].event.__onNew !== 'undefined') {
            config["CONTROL_CENTER"].event.__onNew();
        }
    }

    async function __getShiftByCode(shiftCode) {
        const data = await __getDetails("Shift", false, ["*"], [{ "field-name": "shift_code", "operator": "=", "value": shiftCode }], [], "created_at:desc", 1);
        if (data && data !== "Error" && data[0].Shift.length > 0) {
            return data[0].Shift[0];
        }
        return null;
    }

    function handleSave(event, beforeSaveArr, callback) {
        let afterSaveArr;
        if (beforeSaveArr.action === "NEW") {
            afterSaveArr = onSaveNew(event, beforeSaveArr, callback);
        } else if (beforeSaveArr.action === "MODIFY") {
            afterSaveArr = onSaveModify(event, beforeSaveArr, callback);
        }
        return afterSaveArr;
    }

    function __validate(shiftCode, shiftName) {
        if (!shiftCode || shiftCode.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Shift Code", "");
            return false;
        }
        if (shiftCode.length > 100) {
            config["CONTROL_CENTER"].promptWarningMessage("Shift Code cannot exceed 100 characters", "");
            return false;
        }
        if (!shiftName || shiftName.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Shift Name", "");
            return false;
        }
        if (shiftName.length > 150) {
            config["CONTROL_CENTER"].promptWarningMessage("Shift Name cannot exceed 150 characters", "");
            return false;
        }
        return true;
    }

    async function onSaveNew(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const shiftCode = dataArr.data.shift_code.trim();
            const shiftName = dataArr.data.shift_name.trim();
            const active = dataArr.data.active === "1";

            if (__validate(shiftCode, shiftName)) {
                const apiRequest = {
                    "Shift": {
                        "CRE": [
                            { "shift_code": shiftCode, "shift_name": shiftName, "active": active }
                        ]
                    }
                };

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`masterDetails`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                resultArr = response.data;
                if (resultArr.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Shift created successfully", "");
                    await getAllShifts();
                    const newShift = await __getShiftByCode(shiftCode);
                    if (newShift) {
                        config["CONTROL_CENTER"].populate({
                            "id": newShift.id, "shift_code": newShift.shift_code, "shift_name": newShift.shift_name,
                            "active": newShift.active ? "1" : "0", "updated_at": newShift.updated_at
                        });
                    }
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error creating shift", "");
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            __handleApiError(error);
            isValid = false;
        }
        resultArr.success = isValid;
        callback(resultArr);
    }

    async function onSaveModify(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const shiftId = dataArr.data.id;
            const shiftCode = dataArr.data.shift_code.trim();
            const shiftName = dataArr.data.shift_name.trim();
            const active = dataArr.data.active === "1";
            const updatedAt = dataArr.data.updated_at;

            if (__validate(shiftCode, shiftName)) {
                const apiRequest = {
                    "Shift": {
                        "UPD": [
                            {
                                [shiftId]: {
                                    "shift_code": shiftCode,
                                    "shift_name": shiftName,
                                    "active": active,
                                    "updated_at": updatedAt
                                }
                            }
                        ]
                    }
                };

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`masterDetails`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                resultArr = response.data;
                if (resultArr.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Shift updated successfully", "");
                    await getAllShifts();
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error updating shift", "");
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            __handleApiError(error);
            isValid = false;
        }
        resultArr.success = isValid;
        callback(resultArr);
    }

    function __handleApiError(error) {
        console.log(error);
        try {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = [];
                Object.entries(error.response.data.errors).forEach(([, messages]) => {
                    messages.forEach(msg => errors.push(msg));
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

    return generateShiftDisplay(config);
}

export default Shift;
