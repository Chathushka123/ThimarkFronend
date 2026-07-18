
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formShift",
        name: "formShift",
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
            name: "labelShift",
            type: "text",
            visible: true,
            value: "Shifts"
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
        label: "New Shift",
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
        name: "inputId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelId",
            type: "text",
            visible: false,
            value: "ID"
        },
    },
    data: {
        sqlcolumn: "id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputUpdatedAt"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUpdatedAt",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelUpdatedAt",
            type: "text",
            visible: false,
            value: "Updated At"
        },
    },
    data: {
        sqlcolumn: "updated_at",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputShiftCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputShiftCode",
        placeholder: "e.g. SHIFT-A",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelShiftCode",
            type: "text",
            visible: true,
            value: "Shift Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "shift_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputShiftName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputShiftName",
        placeholder: "e.g. Morning Shift",
        type: "text",
        length: 150,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelShiftName",
            type: "text",
            visible: true,
            value: "Shift Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "shift_name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputActive"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputActive",
        placeholder: "",
        type: "checkbox",
        label: "Active",
        checkedValue: "1",
        uncheckedValue: "0",
        showLabel: false,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelActive",
            type: "text",
            visible: true,
            value: "Active"
        },
    },
    data: {
        sqlcolumn: "active",
        oldValue: "1",
        value: "1"
    },
    class: "",
    event: {}
}

let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridCols["shift_code"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "shift_code", placeholder: "Shift Code", editable: false, filterring: true, sqlColumn: "shift_code", style: { textAlign: "left", minWidth: "160px", width: "160px" } };
gridCols["shift_name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "shift_name", placeholder: "Shift Name", editable: false, filterring: true, sqlColumn: "shift_name", style: { textAlign: "left", minWidth: "220px", width: "220px" } };
gridCols["active"] = { objectType: "CheckBox", colIndex: 3, datatype: "checkbox", name: "active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "90px", width: "90px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "160px", width: "160px" } };

componentListConfig["gridShifts"] = {
    objectType: "Grid",
    schema: {
        name: "gridShifts",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridShifts",
        name: "gridShifts",
        descriptoin: "Shifts",
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
    columns: gridCols,
    data: [],
    event: {}
}

export default componentListConfig
