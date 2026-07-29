import { useEffect, useState, useRef } from 'react';
import { generateDailyShiftDisplay } from './DailyShiftDS';
import config from './DailyShiftCS';
import API from '../../../api/API';
import { fromDateTimeLocal, toDateTimeLocal } from './DailyShiftHelpers';

const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?$/;

function __todayStr() {
    return new Date().toISOString().split('T')[0];
}

const DailyShift = () => {
    let [rendered, setRendered] = useState(true);
    // Filters the "All Daily Shifts" grid to a single shift_date, defaulting
    // to today — re-fetched whenever it changes (see the [filterDate] effect below).
    const [filterDate, setFilterDate] = useState(__todayStr());

    function reRender() {
        setRendered(!rendered);
    }

    function handleFilterDateChange(date) {
        setFilterDate(date);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onSave = handleSave;

    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonReloadList"].event.onClick = handleReloadList;

    config["lovComboBoxShift"].event.onComboSearch = handleComboSearchShift;
    config["lovComboBoxShift"].event.onLovDone = handleLovDoneShift;
    config["lovComboBoxShift"].event.onLovSearch = handleLovSearchShift;
    config["lovComboBoxShift"].event.onBlurWithChange = handleBlurLovShift;

    config["inputShiftDate"].event.onChange = handleShiftDateChange;

    config["gridTeamAssignments"].event.onAddRow = handleAddTeamRow;
    config["gridTeamAssignments"].event.onChangeWithColName = handleTeamAssignmentChange;

    config["gridDailyShifts"].event.onRowCustomButton = handleRowEditClick;
    config["gridDailyShifts"].event.onRowDelete = handleRowDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __checkIsAuthorized();
        __loadTeamOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fires on mount (with today's default) and again on every date change.
    useEffect(() => {
        getAllDailyShifts(filterDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterDate]);

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "dailyShift" };
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

    // useRef (not a plain variable) so the fetched list survives this
    // component's re-renders — a plain `let` here gets reset to [] on every
    // render, and since handleNew/formPopulate always run from whichever
    // render's closure the framework's event handlers currently point to
    // (almost never the original mount render), they'd see an empty cache.
    const teamOptionsCacheRef = useRef([]);
    // Maps team_id -> that team's default no_of_operators, so a newly
    // assigned row can be pre-filled without a further API round-trip.
    const teamNoOfOperatorsCacheRef = useRef({});

    async function __loadTeamOptions() {
        const data = await __getDetails("Team", false, ["*"], [{ "field-name": "active", "operator": "=", "value": true }], [], "team_name:asc", 1000);
        if (data && data !== "Error" && data[0].Team.length > 0) {
            teamOptionsCacheRef.current = data[0].Team.map(t => ({ value: t.id, text: `${t.team_code} - ${t.team_name}` }));
            teamNoOfOperatorsCacheRef.current = data[0].Team.reduce((acc, t) => {
                acc[t.id] = t.no_of_operators;
                return acc;
            }, {});
        }
        config["gridTeamAssignments"].setColumns(__getGridTeamAssignmentColumns());
    }

    // When the user picks/changes a team for an assignment row, default that
    // row's no_of_operators to the team's own value. The cell stays editable
    // afterwards so the user can still override it for this specific shift.
    function handleTeamAssignmentChange(event, rowId, colName) {
        if (colName !== "team_id") return;
        const selectedTeamId = event.target.value;
        const row = config["gridTeamAssignments"].data[rowId];
        if (!row) return;
        row["no_of_operators"] = selectedTeamId && teamNoOfOperatorsCacheRef.current[selectedTeamId] !== undefined
            ? teamNoOfOperatorsCacheRef.current[selectedTeamId]
            : "";
        reRender();
    }

    function __getGridTeamAssignmentColumns() {
        let gridCols = [];
        gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
        gridCols["team_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "team_id", placeholder: "Select Team", editable: true, exclusiveOptions: true, sqlColumn: "team_id", options: [{ value: "", text: "- Select Team -" }, ...teamOptionsCacheRef.current], style: { textAlign: "left", minWidth: "220px", width: "220px" } };
        gridCols["no_of_operators"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "no_of_operators", placeholder: "No. of Operators", editable: true, sqlColumn: "no_of_operators", style: { textAlign: "center", minWidth: "150px", width: "150px" } };
        gridCols["start_date_time"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "start_date_time", placeholder: "YYYY-MM-DD HH:mm", editable: true, sqlColumn: "start_date_time", style: { textAlign: "left", minWidth: "170px", width: "170px" } };
        gridCols["end_date_time"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "end_date_time", placeholder: "YYYY-MM-DD HH:mm", editable: true, sqlColumn: "end_date_time", style: { textAlign: "left", minWidth: "170px", width: "170px" } };
        gridCols["active"] = { objectType: "CheckBox", colIndex: 5, datatype: "checkbox", name: "active", placeholder: "Active", editable: true, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "80px", width: "80px" } };
        return gridCols;
    }

    function __resetTeamAssignmentsGrid() {
        config["gridTeamAssignments"].setColumns(__getGridTeamAssignmentColumns());
        config["gridTeamAssignments"].setData([]);
    }

    function handleAddTeamRow() {
        // Default a new assignment row to the daily shift's own start/end
        // window (both are "YYYY-MM-DDTHH:mm" from the datetime-local inputs);
        // the grid cell is still a free-text field, so the user can edit it.
        const masterStart = config["inputStartDateTime"].data.value;
        const masterEnd = config["inputEndDateTime"].data.value;
        config["gridTeamAssignments"].addRow({
            "id": "",
            "team_id": "",
            "no_of_operators": "",
            "start_date_time": masterStart ? masterStart.replace('T', ' ') : "",
            "end_date_time": masterEnd ? masterEnd.replace('T', ' ') : "",
            "active": "1"
        });
        // addRow() only re-renders the Grid's own local state; the "No teams
        // assigned yet" empty-state message lives in the outer DS render and
        // needs its own reRender() to pick up the new row count.
        reRender();
    }

    async function getAllDailyShifts(date) {
        try {
            document.getElementById("spinner").style.display = "";
            const where = date ? [{ "field-name": "shift_date", "operator": "=", "value": date }] : [];
            const data = await __getDetails("DailyShift", false, ["*"], where, ["shift", "daily_shift_teams.team"], "shift_date:desc", 1000);
            if (data && data !== "Error" && data[0].DailyShift.length > 0) {
                config['gridDailyShifts'].setData(data[0].DailyShift.flatMap(__mapDailyShiftRows));
            } else {
                config['gridDailyShifts'].setData([]);
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    // The grid's Active checkbox column compares against the string
    // checkedValue "1" (BASE/Components.js's TbCheckBox does a strict
    // ===), but the API returns a real boolean/number here — coerce
    // it or the checkbox always renders unchecked regardless of status.
    function __toCheckboxValue(value) {
        return value === true || value === 1 || value === "1" ? "1" : "0";
    }

    // One DailyShift can have several team assignments — flattened into one
    // grid row per (DailyShift, DailyShiftTeam) pair so every assignment is
    // visible at once, rather than collapsing them behind a bare count. A
    // shift with no team assignments yet still gets a single row with the
    // team columns left blank.
    function __mapDailyShiftRows(d) {
        const base = {
            id: d.id,
            shift_id: d.shift_id,
            shift_name: d.shift ? `${d.shift.shift_code} - ${d.shift.shift_name}` : '(unknown shift)',
            shift_date: d.shift_date,
            start_date_time: d.start_date_time,
            end_date_time: d.end_date_time,
            active: __toCheckboxValue(d.active),
            updated_at: d.updated_at
        };

        const teamAssignments = d.daily_shift_teams || [];
        if (teamAssignments.length === 0) {
            return [{ ...base, team_name: '', team_start_date_time: '', team_end_date_time: '', team_active: '0' }];
        }

        return teamAssignments.map(t => ({
            ...base,
            team_name: t.team ? `${t.team.team_code} - ${t.team.team_name}` : '(unknown team)',
            team_start_date_time: t.start_date_time,
            team_end_date_time: t.end_date_time,
            team_active: __toCheckboxValue(t.active)
        }));
    }

    function handleReloadList() {
        getAllDailyShifts(filterDate);
    }

    /************ Shift LOV ************/

    async function __getShiftList() {
        return await __getDetails("Shift", false, ["*"], [{ "field-name": "active", "operator": "=", "value": true }], [], "shift_name:asc", 1000);
    }

    async function __getShiftSearchDetails(searchCriteria) {
        const where = [];
        if (searchCriteria.shift_code) where.push({ "field-name": "shift_code", "operator": "like", "value": `%${searchCriteria.shift_code}%` });
        if (searchCriteria.shift_name) where.push({ "field-name": "shift_name", "operator": "like", "value": `%${searchCriteria.shift_name}%` });
        return await __getDetails("Shift", false, ["*"], where, [], "shift_name:asc", 25);
    }

    async function handleComboSearchShift() {
        let rows = [];
        const getData = await __getShiftList();

        let titles = {
            shift_id: { displayName: "ID", visible: false },
            shift_code: { displayName: "Code", visible: true },
            shift_name: { displayName: "Name", visible: true }
        };

        if (getData && getData !== "Error" && getData[0].Shift.length > 0) {
            rows = getData[0].Shift.map(s => ({ shift_id: s.id, shift_code: s.shift_code, shift_name: s.shift_name }));
        }

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        config["lovComboBoxShift"].showLovWindow(titles, rows, msg);
    }

    function handleLovDoneShift(event, lovRow) {
        config["lovComboBoxShift"].setValueWithId(`${lovRow.shift_code} - ${lovRow.shift_name}`, lovRow.shift_id);
    }

    async function handleLovSearchShift(event, searchCriteria, callback) {
        let rows = [];
        const searchDetails = await __getShiftSearchDetails(searchCriteria);

        if (searchDetails && searchDetails !== "Error" && searchDetails[0].Shift.length > 0) {
            rows = searchDetails[0].Shift.map(s => ({ shift_id: s.id, shift_code: s.shift_code, shift_name: s.shift_name }));
        }

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        callback(rows, msg);
    }

    async function handleBlurLovShift() {
        const typed = config["lovComboBoxShift"].data.value;
        if (typed && typed !== "") {
            const code = typed.split(' - ')[0].trim();
            const data = await __getDetails("Shift", false, ["*"], [{ "field-name": "shift_code", "operator": "=", "value": code }], [], "created_at:desc", 1);
            if (data && data !== "Error" && data[0].Shift.length > 0) {
                const s = data[0].Shift[0];
                config["lovComboBoxShift"].setValueWithId(`${s.shift_code} - ${s.shift_name}`, s.id);
            } else {
                config["lovComboBoxShift"].setValueWithId("", "");
            }
        }
    }

    /************ Master list row actions ************/

    async function formPopulate(dailyShiftId) {
        __resetTeamAssignmentsGrid();

        let dataArray = {
            "id": "", "shift_date": "", "start_date_time": "", "end_date_time": "", "active": "1",
            "gridTeamAssignments": { "data": [], "columns": __getGridTeamAssignmentColumns() }
        };

        if (dailyShiftId && dailyShiftId !== "") {
            try {
                document.getElementById("spinner").style.display = "";
                const details = await __getDetails("DailyShift", false, ["*"], [{ "field-name": "id", "operator": "=", "value": dailyShiftId }], ["shift", "daily_shift_teams"], "created_at:desc", 1);
                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].DailyShift.length > 0) {
                    const d = details[0].DailyShift[0];
                    const teamRows = (d.daily_shift_teams || []).map(r => ({
                        id: r.id, team_id: r.team_id, no_of_operators: r.no_of_operators, start_date_time: r.start_date_time, end_date_time: r.end_date_time,
                        active: r.active ? "1" : "0", updated_at: r.updated_at, _rowstate: "POPULATED"
                    }));

                    dataArray = {
                        "id": d.id, "shift_date": "", "start_date_time": "", "end_date_time": "",
                        "active": d.active ? "1" : "0",
                        "gridTeamAssignments": { "data": teamRows, "columns": __getGridTeamAssignmentColumns() },
                        "updated_at": d.updated_at
                    };

                    config["CONTROL_CENTER"].populate(dataArray);
                    config["lovComboBoxShift"].setValueWithId(d.shift ? `${d.shift.shift_code} - ${d.shift.shift_name}` : "", d.shift_id);
                    config["inputShiftDate"].setDate(d.shift_date);
                    config["inputStartDateTime"].setValue(toDateTimeLocal(d.start_date_time));
                    config["inputEndDateTime"].setValue(toDateTimeLocal(d.end_date_time));
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "Daily Shift not found");
                    config["CONTROL_CENTER"].populate(dataArray);
                }
            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                __handleApiError(error);
                config["CONTROL_CENTER"].populate(dataArray);
            }
        } else {
            config["CONTROL_CENTER"].populate(dataArray);
            config["lovComboBoxShift"].setValueWithId("", "");
            config["inputShiftDate"].setDate(null);
            config["inputStartDateTime"].setValue("");
            config["inputEndDateTime"].setValue("");
        }
    }

    function handleRowEditClick(e, r) {
        const row = config["gridDailyShifts"].data[r];
        if (!row) return;
        formPopulate(row.id);
    }

    function handleUndo() {
        const id = config["inputId"].data.value;
        if (id && id !== "") {
            // Revert to the last saved state of an existing record.
            formPopulate(id);
        } else if (typeof config["CONTROL_CENTER"].event.__onNew !== 'undefined') {
            // Undo on an unsaved new record: replay the "New" reset (keeps
            // state.new === true so Save still dispatches "NEW", not "MODIFY").
            config["CONTROL_CENTER"].event.__onNew();
        }
    }

    async function handleRowDelete(event, rowId) {
        const row = config["gridDailyShifts"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Delete this daily shift (${row.shift_name} on ${row.shift_date})? Team assignments will be removed too.`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const apiRequest = { "DailyShift": { "DEL": [row.id] } };
            const response = await API.post(`masterDetails`, apiRequest);

            if (response.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Daily shift deleted successfully", "");
                if (String(config["inputId"].data.value) === String(row.id) && typeof config["CONTROL_CENTER"].event.__onNew !== 'undefined') {
                    config["CONTROL_CENTER"].event.__onNew();
                }
                await getAllDailyShifts(filterDate);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting daily shift", "");
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

    // "YYYY-MM-DD" from a DateField's Date object, using local date parts
    // (not toISOString, which is UTC and can roll the date over near
    // midnight) since react-datepicker hands back a Date representing local
    // midnight of the picked day.
    function __formatLocalDate(date) {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    // Default working window for a freshly (re)picked Shift Date: 08:00-18:00
    // on that same day. dateStr is "YYYY-MM-DD".
    function __defaultShiftTimes(dateStr) {
        return { start: `${dateStr}T08:00`, end: `${dateStr}T18:00` };
    }

    // Fired via DateField's onChange whenever the user picks a Shift Date —
    // (re)stamps Start/End Date-Time to 08:00/18:00 of that day.
    function handleShiftDateChange(date) {
        if (!date) return;
        const { start, end } = __defaultShiftTimes(__formatLocalDate(date));
        config["inputStartDateTime"].setValue(start);
        config["inputEndDateTime"].setValue(end);
    }

    // Deliberately returns nothing: the framework only runs its own
    // resetData()/readAndApplyData() pass when onNew's return value is
    // defined. Returning undefined here hands full control to the explicit
    // resets below — required for lovComboBoxShift (whose real FK lives in
    // a separate .data.id the framework never touches) and inputShiftDate
    // (a DateField, which ignores .data.value entirely and only responds to
    // .setDate()). See formPopulate() for the same reasoning applied there.
    function handleNew() {
        __resetTeamAssignmentsGrid();
        config["inputId"].setValue("");
        config["inputUpdatedAt"].setValue("");
        config["lovComboBoxShift"].setValueWithId("", "");
        const todayStr = new Date().toISOString().split('T')[0];
        config["inputShiftDate"].setDate(todayStr);
        const { start, end } = __defaultShiftTimes(todayStr);
        config["inputStartDateTime"].setValue(start);
        config["inputEndDateTime"].setValue(end);
        config["inputActive"].setValue("1");
    }

    /************ Save ************/

    function handleSave(event, beforeSaveArr, callback) {
        let afterSaveArr;
        if (beforeSaveArr.action === "NEW") {
            afterSaveArr = onSaveNew(event, beforeSaveArr, callback);
        } else if (beforeSaveArr.action === "MODIFY") {
            afterSaveArr = onSaveModify(event, beforeSaveArr, callback);
        }
        return afterSaveArr;
    }

    function __buildTeamRelations(gridRows, forNew) {
        const cre = [];
        const upd = [];
        const del = [];

        gridRows.forEach(row => {
            if (!row.team_id || row.team_id === "") return;
            if (row.start_date_time && !DATETIME_PATTERN.test(row.start_date_time)) return;
            if (row.end_date_time && !DATETIME_PATTERN.test(row.end_date_time)) return;

            const active = row.active === "1" || row.active === true;
            // Fall back to the team's own default if the row's no_of_operators
            // was never set (e.g. team picked before this handler existed, or
            // row assembled programmatically) — the server also defaults this,
            // but resolving it here keeps the payload explicit.
            const noOfOperators = (row.no_of_operators === "" || row.no_of_operators === undefined || row.no_of_operators === null)
                ? (teamNoOfOperatorsCacheRef.current[row.team_id] ?? null)
                : Number(row.no_of_operators);
            const payload = { "team_id": row.team_id, "no_of_operators": noOfOperators, "start_date_time": row.start_date_time || null, "end_date_time": row.end_date_time || null, "active": active };

            if (forNew || row._rowstate === "NEW") {
                cre.push({ "daily_shift_id": "!PARENT_KEY!", ...payload });
            } else if (row._rowstate === "MODIFIED") {
                upd.push({ [row.id]: { ...payload, "updated_at": row.updated_at } });
            } else if (row._rowstate === "DELETED") {
                del.push(row.id.toString());
            }
        });

        return { cre, upd, del };
    }

    function __validateTeamRows(gridRows) {
        for (const row of gridRows) {
            if (row._rowstate === "DELETED") continue;
            if (!row.team_id || row.team_id === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a team for every assignment row (or remove the empty row)", "");
                return false;
            }
            if (row.start_date_time && !DATETIME_PATTERN.test(row.start_date_time)) {
                config["CONTROL_CENTER"].promptWarningMessage("Team assignment times must be in YYYY-MM-DD HH:mm format", "");
                return false;
            }
            if (row.end_date_time && !DATETIME_PATTERN.test(row.end_date_time)) {
                config["CONTROL_CENTER"].promptWarningMessage("Team assignment times must be in YYYY-MM-DD HH:mm format", "");
                return false;
            }
        }
        return true;
    }

    function __validateMaster(shiftId, shiftDate, startDateTime, endDateTime) {
        if (!shiftId || shiftId === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please select a Shift", "");
            return false;
        }
        if (!shiftDate) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select a Shift Date", "");
            return false;
        }
        if (!startDateTime || !endDateTime) {
            config["CONTROL_CENTER"].promptWarningMessage("Please enter both Start and End Date/Time", "");
            return false;
        }
        if (new Date(startDateTime) >= new Date(endDateTime)) {
            config["CONTROL_CENTER"].promptWarningMessage("End Date/Time must be after Start Date/Time", "");
            return false;
        }
        return true;
    }

    async function onSaveNew(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const shiftId = config["lovComboBoxShift"].data.id;
            const shiftDate = dataArr.data.shift_date;
            const startDateTime = dataArr.data.start_date_time;
            const endDateTime = dataArr.data.end_date_time;
            const active = dataArr.data.active === "1";
            const teamRows = (dataArr.data.gridTeamAssignments && dataArr.data.gridTeamAssignments.data) || [];

            if (__validateMaster(shiftId, shiftDate, startDateTime, endDateTime) && __validateTeamRows(teamRows)) {
                const { cre } = __buildTeamRelations(teamRows, true);

                const apiRequest = {
                    "DailyShift": {
                        "CRE": [
                            {
                                "shift_id": shiftId,
                                "shift_date": __formatLocalDate(shiftDate),
                                "start_date_time": fromDateTimeLocal(startDateTime),
                                "end_date_time": fromDateTimeLocal(endDateTime),
                                "active": active,
                                "relations": { "DailyShiftTeam": { "CRE": cre } }
                            }
                        ]
                    }
                };

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`masterDetails`, apiRequest);
                document.getElementById("spinner").style.display = "none";

                resultArr = response.data;
                if (resultArr.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Daily shift created successfully", "");
                    // Re-select the just-created record so Save afterwards dispatches
                    // "MODIFY" (with a real id) instead of "NEW" again. There's no
                    // unique business key to look it up by, so match on shift + date
                    // (both sides normalized to "YYYY-MM-DD").
                    const shiftDateStr = __formatLocalDate(shiftDate);
                    // The list is filtered by date — jump the filter to the date just
                    // saved so the new record is actually visible (and findable below)
                    // instead of silently vanishing behind whatever date was selected.
                    setFilterDate(shiftDateStr);
                    await getAllDailyShifts(shiftDateStr);
                    const created = config["gridDailyShifts"].data.find(r => String(r.shift_id) === String(shiftId) && String(r.shift_date || '').split('T')[0] === shiftDateStr);
                    if (created) await formPopulate(created.id);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error creating daily shift", "");
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
            const dailyShiftId = dataArr.data.id;
            const shiftId = config["lovComboBoxShift"].data.id;
            const shiftDate = dataArr.data.shift_date;
            const startDateTime = dataArr.data.start_date_time;
            const endDateTime = dataArr.data.end_date_time;
            const active = dataArr.data.active === "1";
            const updatedAt = dataArr.data.updated_at;
            const teamRows = (dataArr.data.gridTeamAssignments && dataArr.data.gridTeamAssignments.data) || [];

            if (__validateMaster(shiftId, shiftDate, startDateTime, endDateTime) && __validateTeamRows(teamRows)) {
                const { cre, upd, del } = __buildTeamRelations(teamRows, false);

                const apiRequest = {
                    "DailyShift": {
                        "UPD": [
                            {
                                [dailyShiftId]: {
                                    "shift_id": shiftId,
                                    "shift_date": __formatLocalDate(shiftDate),
                                    "start_date_time": fromDateTimeLocal(startDateTime),
                                    "end_date_time": fromDateTimeLocal(endDateTime),
                                    "active": active,
                                    "relations": { "DailyShiftTeam": { "CRE": cre, "UPD": upd, "DEL": del } },
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
                    config["CONTROL_CENTER"].promptBaseMessage("Daily shift updated successfully", "");
                    // Same reasoning as onSaveNew — keep the just-saved date visible
                    // even if its shift_date was edited to a different day.
                    const shiftDateStr = __formatLocalDate(shiftDate);
                    setFilterDate(shiftDateStr);
                    await getAllDailyShifts(shiftDateStr);
                    await formPopulate(dailyShiftId);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error updating daily shift", "");
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

    return generateDailyShiftDisplay(config, {
        filterDate,
        onFilterDateChange: handleFilterDateChange,
    });
}

export default DailyShift;
