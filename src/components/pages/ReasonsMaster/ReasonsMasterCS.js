
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formReasonsMaster",
        name: "formReasonsMaster",
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
            name: "labelReasonsMaster",
            type: "text",
            visible: true,
            value: "Reject / Rework Reasons"
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
        label: "New Reason",
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

componentListConfig["inputCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCode",
        placeholder: "e.g. STITCH_DEFECT",
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
            name: "labelCode",
            type: "text",
            visible: true,
            value: "Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputDescription"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDescription",
        placeholder: "e.g. Stitch defect",
        type: "text",
        length: 255,
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
            name: "labelDescription",
            type: "text",
            visible: true,
            value: "Description"
        },
        class: ""
    },
    data: {
        sqlcolumn: "description",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputType"] = {
    objectType: "DropDown",
    schema: {
        name: "inputType",
        placeholder: "",
        type: "text",
        length: 20,
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
            name: "labelType",
            type: "text",
            visible: true,
            value: "Type"
        },
        class: ""
    },
    options: [
        { value: "REJECT", text: "Reject" },
        { value: "REWORK", text: "Rework" }
    ],
    data: {
        sqlcolumn: "type",
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
gridCols["code"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "code", placeholder: "Code", editable: false, filterring: true, sqlColumn: "code", style: { textAlign: "left", minWidth: "180px", width: "180px" } };
gridCols["description"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "description", placeholder: "Description", editable: false, filterring: true, sqlColumn: "description", style: { textAlign: "left", minWidth: "260px", width: "260px" } };
gridCols["type"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "type", placeholder: "Type", editable: false, filterring: true, sqlColumn: "type", style: { textAlign: "center", minWidth: "110px", width: "110px" } };
gridCols["active"] = { objectType: "CheckBox", colIndex: 4, datatype: "checkbox", name: "active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "90px", width: "90px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "160px", width: "160px" } };

componentListConfig["gridReasons"] = {
    objectType: "Grid",
    schema: {
        name: "gridReasons",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridReasons",
        name: "gridReasons",
        descriptoin: "Reject / Rework Reasons",
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
