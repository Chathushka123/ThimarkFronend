import { useEffect, useState } from 'react';
import { generateTeamDisplay } from './TeamDS';
import config from './TeamCS';
import API from '../../../api/API';

const Team = () => {
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

    config["gridTeams"].event.onRowCustomButton = handleRowEditClick;
    config["gridTeams"].event.onRowDelete = handleRowDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __checkIsAuthorized();
        getAllTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "team" };
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

    async function getAllTeams() {
        try {
            document.getElementById("spinner").style.display = "";
            const data = await __getDetails("Team", false, ["*"], [], [], "team_name:asc", 1000);
            if (data && data !== "Error" && data[0].Team.length > 0) {
                config['gridTeams'].setData(data[0].Team);
            } else {
                config['gridTeams'].setData([]);
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getAllTeams();
    }

    function handleNew() {
        return {
            "team_code": "",
            "team_name": "",
            "active": "1"
        };
    }

    function handleRowEditClick(e, r) {
        const row = config["gridTeams"].data[r];
        if (!row) return;

        config["CONTROL_CENTER"].populate({
            "id": row.id,
            "team_code": row.team_code,
            "team_name": row.team_name,
            "active": row.active === true || row.active === 1 || row.active === "1" ? "1" : "0",
            "updated_at": row.updated_at
        });
    }

    function handleUndo() {
        const id = config["inputId"].data.value;
        if (id !== "") {
            const row = config["gridTeams"].data.find(r => String(r.id) === String(id));
            if (row) handleRowEditClick(null, config["gridTeams"].data.indexOf(row));
        } else {
            config["inputTeamCode"].setValue("");
            config["inputTeamName"].setValue("");
            config["inputActive"].setValue("1");
        }
    }

    async function handleRowDelete(event, rowId) {
        const row = config["gridTeams"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Delete team "${row.team_name}"? This cannot be undone.`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const apiRequest = { "Team": { "DEL": [row.id] } };
            const response = await API.post(`masterDetails`, apiRequest);

            if (response.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Team deleted successfully", "");
                if (String(config["inputId"].data.value) === String(row.id)) {
                    clearForm();
                }
                await getAllTeams();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting team", "");
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
    // "New Team" button's own reset so state.new stays true and Save still
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

    async function __getTeamByCode(teamCode) {
        const data = await __getDetails("Team", false, ["*"], [{ "field-name": "team_code", "operator": "=", "value": teamCode }], [], "created_at:desc", 1);
        if (data && data !== "Error" && data[0].Team.length > 0) {
            return data[0].Team[0];
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

    function __validate(teamCode, teamName) {
        if (!teamCode || teamCode.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Team Code", "");
            return false;
        }
        if (teamCode.length > 100) {
            config["CONTROL_CENTER"].promptWarningMessage("Team Code cannot exceed 100 characters", "");
            return false;
        }
        if (!teamName || teamName.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Team Name", "");
            return false;
        }
        if (teamName.length > 150) {
            config["CONTROL_CENTER"].promptWarningMessage("Team Name cannot exceed 150 characters", "");
            return false;
        }
        return true;
    }

    async function onSaveNew(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const teamCode = dataArr.data.team_code.trim();
            const teamName = dataArr.data.team_name.trim();
            const active = dataArr.data.active === "1";

            if (__validate(teamCode, teamName)) {
                const apiRequest = {
                    "Team": {
                        "CRE": [
                            { "team_code": teamCode, "team_name": teamName, "active": active }
                        ]
                    }
                };

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`masterDetails`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                resultArr = response.data;
                if (resultArr.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Team created successfully", "");
                    await getAllTeams();
                    const newTeam = await __getTeamByCode(teamCode);
                    if (newTeam) {
                        config["CONTROL_CENTER"].populate({
                            "id": newTeam.id, "team_code": newTeam.team_code, "team_name": newTeam.team_name,
                            "active": newTeam.active ? "1" : "0", "updated_at": newTeam.updated_at
                        });
                    }
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error creating team", "");
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
            const teamId = dataArr.data.id;
            const teamCode = dataArr.data.team_code.trim();
            const teamName = dataArr.data.team_name.trim();
            const active = dataArr.data.active === "1";
            const updatedAt = dataArr.data.updated_at;

            if (__validate(teamCode, teamName)) {
                const apiRequest = {
                    "Team": {
                        "UPD": [
                            {
                                [teamId]: {
                                    "team_code": teamCode,
                                    "team_name": teamName,
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
                    config["CONTROL_CENTER"].promptBaseMessage("Team updated successfully", "");
                    await getAllTeams();
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error updating team", "");
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

    return generateTeamDisplay(config);
}

export default Team;
