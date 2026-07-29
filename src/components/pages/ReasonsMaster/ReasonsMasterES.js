import { useEffect, useState } from 'react';
import { generateReasonsMasterDisplay } from './ReasonsMasterDS';
import config from './ReasonsMasterCS';
import API from '../../../api/API';

const ReasonsMaster = () => {
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

    config["gridReasons"].event.onRowCustomButton = handleRowEditClick;
    config["gridReasons"].event.onRowDelete = handleRowDeactivate;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __checkIsAuthorized();
        getAllReasons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "reasonsMaster" };
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

    // The grid's Active checkbox column compares its value against the string
    // checkedValue "1" (BASE/Components.js's TbCheckBox does a strict ===),
    // but the API returns a real boolean for the `active` cast column — so the
    // raw row must be coerced to "1"/"0" here or the checkbox always renders
    // unchecked regardless of the real status.
    function __normalizeActive(row) {
        return { ...row, active: row.active === true || row.active === 1 || row.active === "1" ? "1" : "0" };
    }

    async function getAllReasons() {
        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get("reason/list");
            const data = (response.data && response.data.data) || [];
            config["gridReasons"].setData(data.map(__normalizeActive));
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getAllReasons();
    }

    function handleNew() {
        return {
            "code": "",
            "description": "",
            "type": "REJECT",
            "active": "1"
        };
    }

    function handleRowEditClick(e, r) {
        const row = config["gridReasons"].data[r];
        if (!row) return;

        config["CONTROL_CENTER"].populate({
            "id": row.id,
            "code": row.code,
            "description": row.description,
            "type": row.type,
            "active": row.active === true || row.active === 1 || row.active === "1" ? "1" : "0",
            "updated_at": row.updated_at
        });
    }

    function handleUndo() {
        const id = config["inputId"].data.value;
        if (id !== "") {
            const row = config["gridReasons"].data.find(r => String(r.id) === String(id));
            if (row) handleRowEditClick(null, config["gridReasons"].data.indexOf(row));
        } else {
            config["inputCode"].setValue("");
            config["inputDescription"].setValue("");
            config["inputType"].setValue("REJECT");
            config["inputActive"].setValue("1");
        }
    }

    // The backend's reason/delete endpoint soft-deletes (sets active=false)
    // rather than removing the row, so the grid's delete action deactivates
    // the reason instead of destroying it — it stays in the list, just inactive.
    async function handleRowDeactivate(event, rowId) {
        const row = config["gridReasons"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Deactivate reason "${row.code}"? It will no longer appear in reason pickers.`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            await API.delete(`reason/delete/${row.id}`);

            config["CONTROL_CENTER"].promptBaseMessage("Reason deactivated successfully", "");
            if (String(config["inputId"].data.value) === String(row.id)) {
                clearForm();
            }
            await getAllReasons();
        } catch (error) {
            __handleApiError(error);
            row._rowstate = undefined;
            reRender();
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    // Clears the form back to an empty, ready-to-fill state (replays the
    // "New Reason" button's own reset so state.new stays true and Save still
    // dispatches "NEW" rather than an empty-id "MODIFY"). Only used outside
    // the Save callback chain (e.g. after deactivating the row currently loaded
    // in the form) — onSaveNew/onSaveModify re-populate the saved record
    // instead, since the framework's own post-save reset already sets
    // state.new = false there.
    function clearForm() {
        if (typeof config["CONTROL_CENTER"].event.__onNew !== 'undefined') {
            config["CONTROL_CENTER"].event.__onNew();
        }
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

    function __validate(code, description, type) {
        if (!code || code.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Code", "");
            return false;
        }
        if (code.length > 100) {
            config["CONTROL_CENTER"].promptWarningMessage("Code cannot exceed 100 characters", "");
            return false;
        }
        if (!description || description.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Description", "");
            return false;
        }
        if (description.length > 255) {
            config["CONTROL_CENTER"].promptWarningMessage("Description cannot exceed 255 characters", "");
            return false;
        }
        if (!type || (type !== "REJECT" && type !== "REWORK")) {
            config["CONTROL_CENTER"].promptWarningMessage("Please Select a Type", "");
            return false;
        }
        return true;
    }

    async function onSaveNew(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const code = dataArr.data.code.trim();
            const description = dataArr.data.description.trim();
            const type = dataArr.data.type;
            const active = dataArr.data.active === "1";

            if (__validate(code, description, type)) {
                const apiRequest = { "code": code, "description": description, "type": type, "active": active };

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`reason/create`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                const newReason = response.data.data;
                config["CONTROL_CENTER"].promptBaseMessage("Reason created successfully", "");
                await getAllReasons();
                config["CONTROL_CENTER"].populate({
                    "id": newReason.id, "code": newReason.code, "description": newReason.description,
                    "type": newReason.type, "active": newReason.active ? "1" : "0", "updated_at": newReason.updated_at
                });
                resultArr = { status: "success" };
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
            const reasonId = dataArr.data.id;
            const code = dataArr.data.code.trim();
            const description = dataArr.data.description.trim();
            const type = dataArr.data.type;
            const active = dataArr.data.active === "1";

            if (__validate(code, description, type)) {
                const apiRequest = { "code": code, "description": description, "type": type, "active": active };

                document.getElementById("spinner").style.display = "";
                const response = await API.put(`reason/update/${reasonId}`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                resultArr = { status: "success", data: response.data.data };
                config["CONTROL_CENTER"].promptBaseMessage("Reason updated successfully", "");
                await getAllReasons();
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

    return generateReasonsMasterDisplay(config);
}

export default ReasonsMaster;
