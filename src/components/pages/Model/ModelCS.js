
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formModel",
        name: "formModel",
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
            name: "labelModel",
            type: "text",
            visible: true,
            value: "Model"
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
        type: "submit",
        label: "Advance Search",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonPopulate"] = {
    objectType: "Button",
    schema: {
        id: "buttonPopulate",
        name: "buttonPopulate",
        type: "submit",
        label: "Populate",
        disabled: false,
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
        label: "New",
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

componentListConfig["buttonSaveMainModel"] = {
    objectType: "Button",
    schema: {
        id: "buttonSaveMainModel",
        name: "buttonSaveMainModel",
        type: "submit",
        label: "Save Main Model",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonNewMainModel"] = {
    objectType: "Button",
    schema: {
        id: "buttonNewMainModel",
        name: "buttonNewMainModel",
        type: "submit",
        label: "New Main Model",
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

// Main Model Fields
componentListConfig["inputMainModelId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMainModelId",
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
            name: "labelMainModelId",
            type: "text",
            visible: false,
            value: "Main Model ID"
        },
    },
    data: {
        sqlcolumn: "main_model_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMainModelName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMainModelName",
        placeholder: "",
        type: "text",
        length: 191,
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
        schema: {
            name: "labelMainModelName",
            type: "text",
            visible: true,
            value: "Main Model Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "main_model_name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

// Model Fields
componentListConfig["inputName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputName",
        placeholder: "",
        type: "text",
        length: 191,
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
            value: "Model Name"
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

componentListConfig["inputMainModel"] = {
    objectType: "DropDown",
    schema: {
        name: "inputMainModel",
        placeholder: "",
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
            name: "labelMainModel",
            type: "text",
            visible: true,
            value: "Main Model"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "main_model_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputColor"] = {
    objectType: "TextBox",
    schema: {
        name: "inputColor",
        placeholder: "",
        type: "text",
        length: 191,
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
            name: "labelColor",
            type: "text",
            visible: true,
            value: "Color"
        },
        class: ""
    },
    data: {
        sqlcolumn: "color",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputSizes"] = {
    objectType: "TextBox",
    schema: {
        name: "inputSizes",
        placeholder: "",
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
            name: "labelSizes",
            type: "text",
            visible: true,
            value: "Sizes (Comma separated,No spaces)"
        },
        class: ""
    },
    data: {
        sqlcolumn: "sizes",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

// Main Models Grid
let mainModelGridCols = [];

mainModelGridCols["main_model_id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "main_model_id", placeholder: "ID", visible: false, editable: false, sqlColumn: "main_model_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
mainModelGridCols["main_model_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "main_model_name", placeholder: "Main Model Name", editable: false, sqlColumn: "main_model_name", style: { textAlign: "left", minWidth: "300px", width: "300px" } };
mainModelGridCols["created_at"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "created_at", placeholder: "Created At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
mainModelGridCols["updated_at"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridMainModels"] = {
    objectType: "Grid",
    schema: {
        name: "gridMainModels",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: true,
        filterring : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridMainModels",
        name: "gridMainModels",
        descriptoin: "Main Models",
        type: "table",
        keyField: "main_model_id",
        visible: true,
        Create: false,
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
    columns: mainModelGridCols,
    data: [],
    event: {}
}


// Models Grid
let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "name", placeholder: "Model Name", editable: false, sqlColumn: "name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["main_model_name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "main_model_name", placeholder: "Main Model", editable: false, sqlColumn: "main_model_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "color", placeholder: "Color", editable: false, sqlColumn: "color", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["sizes"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "sizes", placeholder: "Sizes", editable: false, sqlColumn: "sizes", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["active"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "active", placeholder: "Active Status", editable: false, sqlColumn: "active", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["created_at"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "created_at", placeholder: "Created At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 7, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["main_model_id"] = { objectType: "TextBox", colIndex: 8, datatype: "text", name: "main_model_id", placeholder: "Main Model ID", editable: false, visible: false, sqlColumn: "main_model_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridModels"] = {
    objectType: "Grid",
    schema: {
        name: "gridModels",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: true,
        filterring : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridModels",
        name: "gridModels",
        descriptoin: "Models",
        type: "table",
        keyField: "id",
        visible: true,
        Create: false,
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
    defaultRowCount: 3,
    columns: gridCols,
    data: [],
    event: {}
}

let stockItemCols = [];

stockItemCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
stockItemCols["stock_item_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "stock_item_id", placeholder: "Material", editable: true, exclusiveOptions: true, sqlColumn: "stock_item_id", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
stockItemCols["consumption"] = { objectType: "NumberField", colIndex: 2, datatype: "number", name: "consumption", placeholder: "Consumption", editable: true, sqlColumn: "consumption", style: { textAlign: "right", minWidth: "150px", width: "150px" } };

componentListConfig["gridModelStockItems"] = {
    objectType: "Grid",
    schema: {
        name: "gridModelStockItems",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        sorting: true,
        // filterring : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridModelStockItems",
        name: "gridModelStockItems",
        descriptoin: "Model Stock Items",
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
    defaultRowCount: 1,
    columns: stockItemCols,
    data: [],
    event: {}
}

export default componentListConfig
