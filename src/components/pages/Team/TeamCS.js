
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formTeam",
        name: "formTeam",
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
            name: "labelTeam",
            type: "text",
            visible: true,
            value: "Teams"
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
        label: "New Team",
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

componentListConfig["inputTeamCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputTeamCode",
        placeholder: "e.g. TEAM-A",
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
            name: "labelTeamCode",
            type: "text",
            visible: true,
            value: "Team Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "team_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputTeamName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputTeamName",
        placeholder: "e.g. Cutting Team A",
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
            name: "labelTeamName",
            type: "text",
            visible: true,
            value: "Team Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "team_name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputNoOfOperators"] = {
    objectType: "TextBox",
    schema: {
        name: "inputNoOfOperators",
        placeholder: "e.g. 5",
        type: "number",
        length: 10,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelNoOfOperators",
            type: "text",
            visible: true,
            value: "No. of Operators"
        },
        class: ""
    },
    data: {
        sqlcolumn: "no_of_operators",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputOperation"] = {
    objectType: "DropDown",
    schema: {
        name: "inputOperation",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelOperation",
            type: "text",
            visible: true,
            value: "Operation"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "operation_id",
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
gridCols["team_code"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "team_code", placeholder: "Team Code", editable: false, filterring: true, sqlColumn: "team_code", style: { textAlign: "left", minWidth: "160px", width: "160px" } };
gridCols["team_name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "team_name", placeholder: "Team Name", editable: false, filterring: true, sqlColumn: "team_name", style: { textAlign: "left", minWidth: "220px", width: "220px" } };
gridCols["no_of_operators"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "no_of_operators", placeholder: "No. of Operators", editable: false, filterring: true, sqlColumn: "no_of_operators", style: { textAlign: "center", minWidth: "140px", width: "140px" } };
gridCols["operation_name"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "operation_name", placeholder: "Operation", editable: false, filterring: true, sqlColumn: "operation_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["active"] = { objectType: "CheckBox", colIndex: 5, datatype: "checkbox", name: "active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "active", style: { textAlign: "center", minWidth: "90px", width: "90px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "160px", width: "160px" } };

componentListConfig["gridTeams"] = {
    objectType: "Grid",
    schema: {
        name: "gridTeams",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridTeams",
        name: "gridTeams",
        descriptoin: "Teams",
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
