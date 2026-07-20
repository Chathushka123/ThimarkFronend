
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formDailyShift",
        name: "formDailyShift",
        controllerObject: componentListConfig,
        create: true,
        createAPI: "",
        read: true,
        readAPI: "",
        update: true,
        updateAPI: "",
        delete: false,
        deleteAPI: ""
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDailyShift",
            type: "text",
            visible: true,
            value: "Daily Shift Scheduling"
        },
    },
    state: {
        populated: false,
        modified: false,
        deleted: false,
        new: false
    },
    actions: {
        save: "buttonSave",
        delete: "buttonDelete",
        populate: "buttonPopulate",
        refresh: "buttonRefresh"
    },
    event: {
    }
}

componentListConfig["buttonNew"] = {
    objectType: "Button",
    schema: {
        id: "buttonNew",
        name: "buttonNew",
        type: "submit",
        label: "New Daily Shift",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonSave"] = {
    objectType: "Button",
    schema: {
        id: "buttonSave",
        name: "buttonSave",
        type: "submit",
        label: "Save",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonUndo"] = {
    objectType: "Button",
    schema: {
        id: "buttonUndo",
        name: "buttonUndo",
        type: "submit",
        label: "Undo",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonReloadList"] = {
    objectType: "Button",
    schema: {
        id: "buttonReloadList",
        name: "buttonReloadList",
        type: "submit",
        label: "Reload",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["inputId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputId", placeholder: "", type: "text", length: 100, showLabel: true, visible: false,
        insertable: true, updateAllowed: true, mandetory: true, dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelId", type: "text", visible: false, value: "ID" } },
    data: { sqlcolumn: "id", oldValue: "", value: "" },
    class: "", event: {}
}

componentListConfig["inputUpdatedAt"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUpdatedAt", placeholder: "", type: "text", length: 100, showLabel: true, visible: false,
        insertable: true, updateAllowed: true, mandetory: false, dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelUpdatedAt", type: "text", visible: false, value: "Updated At" } },
    data: { sqlcolumn: "updated_at", oldValue: "", value: "" },
    class: "", event: {}
}

componentListConfig["lovComboBoxShift"] = {
    objectType: "LovComboBox",
    schema: {
        name: "lovComboBoxShift",
        placeholder: "Search shift by code or name...",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labellovComboBoxShift", type: "text", visible: true, value: "Shift" },
        class: ""
    },
    options: [],
    data: { sqlcolumn: "shift_id", oldValue: "", value: "", id: "" },
    class: "",
    event: {}
}

componentListConfig["inputShiftDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputShiftDate", placeholder: "", type: "text", length: 20, showLabel: true, visible: true,
        insertable: true, updateAllowed: true, mandetory: true, readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelShiftDate", type: "text", visible: true, value: "Shift Date" }, class: "" },
    data: { sqlcolumn: "shift_date", oldValue: "", value: "" },
    class: "", event: {}
}

// Native datetime-local inputs (rendered via HrUiKit's DateTimeField) — BASE's
// DateField only supports date-only pickers and start/end_date_time are full
// datetime columns on the backend.
componentListConfig["inputStartDateTime"] = {
    objectType: "DateTimeField",
    schema: {
        name: "inputStartDateTime", showLabel: true, visible: true, mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelStartDateTime", type: "text", visible: true, value: "Start Date/Time" } },
    data: { sqlcolumn: "start_date_time", oldValue: "", value: "" },
    class: "", event: {}
}

componentListConfig["inputEndDateTime"] = {
    objectType: "DateTimeField",
    schema: {
        name: "inputEndDateTime", showLabel: true, visible: true, mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelEndDateTime", type: "text", visible: true, value: "End Date/Time" } },
    data: { sqlcolumn: "end_date_time", oldValue: "", value: "" },
    class: "", event: {}
}

componentListConfig["inputActive"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputActive", placeholder: "", type: "checkbox", label: "Active", checkedValue: "1", uncheckedValue: "0",
        showLabel: false, visible: true, insertable: true, updateAllowed: true, mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: { objectType: "Label", schema: { name: "labelActive", type: "text", visible: true, value: "Active" } },
    data: { sqlcolumn: "active", oldValue: "1", value: "1" },
    class: "", event: {}
}

let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridCols["team_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "team_id", placeholder: "Select Team", editable: true, exclusiveOptions: true, sqlColumn: "team_id", options: [{ value: "", text: "- Select Team -" }], style: { textAlign: "left", minWidth: "220px", width: "220px" } };
gridCols["start_date_time"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "start_date_time", placeholder: "YYYY-MM-DD HH:mm", editable: true, sqlColumn: "start_date_time", style: { textAlign: "left", minWidth: "170px", width: "170px" } };
gridCols["end_date_time"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "end_date_time", placeholder: "YYYY-MM-DD HH:mm", editable: true, sqlColumn: "end_date_time", style: { textAlign: "left", minWidth: "170px", width: "170px" } };
gridCols["active"] = { objectType: "CheckBox", colIndex: 4, datatype: "checkbox", name: "active", placeholder: "Active", editable: true, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "80px", width: "80px" } };

componentListConfig["gridTeamAssignments"] = {
    objectType: "Grid",
    schema: {
        name: "gridTeamAssignments",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridTeamAssignments",
        name: "gridTeamAssignments",
        descriptoin: "Team Assignments",
        type: "table",
        keyField: "id",
        visible: true,
        Create: true,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: true,
        UpdateAPI: "",
        delete: true,
        DeleteAPI: "",
        State: {
            Populated: false,
            Modified: false
        },
        Actions: {
            Save: "buttonSave",
            Delete: "",
            Read: "buttonSearch"
        }
    },
    defaultRowCount: 0,
    columns: gridCols,
    data: [],
    event: {}
}

let gridDailyShiftsCols = [];

gridDailyShiftsCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridDailyShiftsCols["shift_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "shift_name", placeholder: "Shift", editable: false, filterring: true, sqlColumn: "shift_name", style: { textAlign: "left", minWidth: "160px", width: "160px" } };
gridDailyShiftsCols["shift_date"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "shift_date", placeholder: "Shift Date", editable: false, filterring: true, sqlColumn: "shift_date", style: { textAlign: "left", minWidth: "130px", width: "130px" } };
gridDailyShiftsCols["start_date_time"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "start_date_time", placeholder: "Start", editable: false, sqlColumn: "start_date_time", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridDailyShiftsCols["end_date_time"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "end_date_time", placeholder: "End", editable: false, sqlColumn: "end_date_time", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridDailyShiftsCols["team_count"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "team_count", placeholder: "Teams", editable: false, sqlColumn: "team_count", style: { textAlign: "center", minWidth: "90px", width: "90px" } };
gridDailyShiftsCols["active"] = { objectType: "CheckBox", colIndex: 6, datatype: "checkbox", name: "active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "80px", width: "80px" } };

componentListConfig["gridDailyShifts"] = {
    objectType: "Grid",
    schema: {
        name: "gridDailyShifts",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridDailyShifts",
        name: "gridDailyShifts",
        descriptoin: "Daily Shifts",
        type: "table",
        keyField: "id",
        visible: true,
        Create: false,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: false,
        UpdateAPI: "",
        delete: true,
        DeleteAPI: "",
        State: {
            Populated: false,
            Modified: false
        },
        Actions: {
            Save: "buttonSave",
            Delete: "",
            Read: "buttonSearch"
        }
    },
    defaultRowCount: 0,
    columns: gridDailyShiftsCols,
    data: [],
    event: {}
}

export default componentListConfig
