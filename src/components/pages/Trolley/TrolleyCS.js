
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formTrolley",
        name: "formTrolley",
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
            name: "labelTrolley",
            type: "text",
            visible: true,
            value: "Trolley Management",
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
        label: "New Trolley",
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

componentListConfig["inputCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCode",
        placeholder: "e.g. TRL-001",
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
            value: "Trolley Code"
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

componentListConfig["inputName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputName",
        placeholder: "e.g. Cutting Trolley 1",
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
            name: "labelName",
            type: "text",
            visible: true,
            value: "Trolley Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "name",
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

// Row-select checkbox, used to choose which trolleys to print stickers for
gridCols["_select"] = {
    objectType: "CheckBox",
    colIndex: 0,
    datatype: "boolean",
    name: "_select",
    placeholder: "Select",
    editable: true,
    sqlColumn: "_select",
    checkedValue: true,
    uncheckedValue: false,
    style: { textAlign: "center", minWidth: "50px", width: "50px" }
};

gridCols["id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridCols["code"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "code", placeholder: "Trolley Code", editable: false, filterring: true, sqlColumn: "code", style: { textAlign: "left", minWidth: "160px", width: "160px" } };
gridCols["name"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "name", placeholder: "Trolley Name", editable: false, filterring: true, sqlColumn: "name", style: { textAlign: "left", minWidth: "260px", width: "260px" } };
gridCols["active"] = { objectType: "CheckBox", colIndex: 4, datatype: "checkbox", name: "active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "90px", width: "90px" } };

componentListConfig["gridTrolley"] = {
    objectType: "Grid",
    schema: {
        name: "gridTrolley",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridTrolley",
        name: "gridTrolley",
        descriptoin: "Trolleys",
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
