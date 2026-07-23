
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formRouting",
        name: "formRouting",
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
            name: "labelRouting",
            type: "text",
            visible: true,
            value: "Route Master"
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

componentListConfig["buttonAdvanceSearch"] = {
    objectType: "Button",
    schema: {
        id: "buttonAdvanceSearch",
        name: "buttonAdvanceSearch",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonNew"] = {
    objectType: "Button",
    schema: {
        id: "buttonNew",
        name: "buttonNew",
        type: "submit",
        label: "New Route",
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

componentListConfig["buttonAddOperation"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddOperation",
        name: "buttonAddOperation",
        type: "button",
        label: "Add Operation",
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

componentListConfig["inputRouteCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRouteCode",
        placeholder: "",
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
            name: "labelRouteCode",
            type: "text",
            visible: true,
            value: "Route Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "route_code",
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
        placeholder: "",
        type: "text",
        length: 255,
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

/////////////////// ROUTE OPERATIONS DETAIL GRID ///////////////////////

let gridOperationCols = [];

gridOperationCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridOperationCols["operation_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "operation_id", placeholder: "Operation", editable: true, sqlColumn: "operation_id", options: [{ value: 0, text: "- Select Operation -" }], style: { textAlign: "left", minWidth: "260px", width: "260px" } };
gridOperationCols["seq"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "seq", placeholder: "Seq", editable: true, sqlColumn: "seq", style: { textAlign: "center", minWidth: "90px", width: "90px" } };
gridOperationCols["smv"] = { objectType: "NumberField", colIndex: 3, datatype: "text", name: "smv", placeholder: "SMV", editable: true, sqlColumn: "smv", style: { textAlign: "center", minWidth: "100px", width: "100px" } };
gridOperationCols["in"] = { objectType: "CheckBox", colIndex: 4, datatype: "checkbox", name: "in", placeholder: "IN", editable: true, checkedValue: "1", uncheckedValue: "0", sqlColumn: "in", style: { textAlign: "center", minWidth: "70px", width: "70px" } };
gridOperationCols["out"] = { objectType: "CheckBox", colIndex: 5, datatype: "checkbox", name: "out", placeholder: "OUT", editable: true, checkedValue: "1", uncheckedValue: "0", sqlColumn: "out", style: { textAlign: "center", minWidth: "70px", width: "70px" } };

componentListConfig["gridOperations"] = {
    objectType: "Grid",
    schema: {
        name: "gridOperations",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridOperations",
        name: "gridOperations",
        descriptoin: "Route Operations",
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
        }
    },
    defaultRowCount: 3,
    columns: gridOperationCols,
    data: [],
    event: {}
}

/////////////////// ADVANCE SEARCH CONFIGURATION ///////////////////////

componentListConfig["inputRouteCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRouteCodeSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: true,
        advanceSearch: true,
        labelValue: "Route Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRouteCodeSearch",
            type: "text",
            visible: true,
            value: "Route Code"
        }
    },
    data: {
        sqlcolumn: "route_code_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputDescriptionSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDescriptionSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: true,
        advanceSearch: true,
        labelValue: "Description",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDescriptionSearch",
            type: "text",
            visible: true,
            value: "Description"
        }
    },
    data: {
        sqlcolumn: "description_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

export default componentListConfig
