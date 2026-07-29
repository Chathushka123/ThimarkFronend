
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formEmployee",
        name: "formEmployee",
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
            name: "labelEmployee",
            type: "text",
            visible: true,
            value: "Employee Stickers"
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

let gridCols = [];

// Row-select checkbox, used to choose which employees to print stickers for
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
gridCols["name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "name", placeholder: "Name", editable: false, filterring: true, sqlColumn: "name", style: { textAlign: "left", minWidth: "220px", width: "220px" } };
gridCols["email"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "email", placeholder: "Email", editable: false, filterring: true, sqlColumn: "email", style: { textAlign: "left", minWidth: "260px", width: "260px" } };

componentListConfig["gridEmployees"] = {
    objectType: "Grid",
    schema: {
        name: "gridEmployees",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridEmployees",
        name: "gridEmployees",
        descriptoin: "Employees",
        type: "table",
        keyField: "id",
        visible: true,
        Create: false,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: false,
        UpdateAPI: "",
        delete: false,
        DeleteAPI: "",
        State: {
            Populated: false,
            Modified: false
        }
    },
    defaultRowCount: 0,
    columns: gridCols,
    data: [],
    event: {}
}

export default componentListConfig
