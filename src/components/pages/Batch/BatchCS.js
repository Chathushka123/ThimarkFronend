
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formBatch",
        name: "formBatch",
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
            name: "labelBatch",
            type: "text",
            visible: true,
            value: "Batch Creation"
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

componentListConfig["inputBatchNo"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBatchNo",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBatchNo",
            type: "text",
            visible: true,
            value: "Batch Number"
        },
        class: ""
    },
    data: {
        sqlcolumn: "batch_no",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBatchID"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBatchID",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: true,
        disabled: true,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBatchID",
            type: "text",
            visible: true,
            value: "Batch ID"
        },
        class: ""
    },
    data: {
        sqlcolumn: "batch_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
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

componentListConfig["inputModel"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputModel",
        id: "inputModel",
        placeholder: "",
        type: "text",
        placeholder: "Model",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: true, 
        searchable: true,
        avoidHighlightFirstOption: true,
        showCheckbox: true,
        disable: false,
        onSearch: "", 
        loading: false,
        style: "",
        selectionLimit: 1,
        endpoint : "",
        singleSelect : false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelModel",
            type: "text",
            visible: true,
            value: "Model"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "model",
        oldValue: "",
        value: []
    },
    class: "",
    event: {}
};

componentListConfig["inputMainModel"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputMainModel",
        id: "inputMainModel",
        placeholder: "",
        type: "text",
        placeholder: "Model",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: true, 
        searchable: true,
        avoidHighlightFirstOption: true,
        showCheckbox: true,
        disable: false,
        onSearch: "", 
        loading: false,
        style: "",
        selectionLimit: 1,
        endpoint : "",
        singleSelect : false,
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
        sqlcolumn: "main_model",
        oldValue: "",
        value: []
    },
    class: "",
    event: {}
};

let mainModelGridCols = [];
mainModelGridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: " ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
mainModelGridCols["model_id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "model_id", placeholder: "Model ID", visible: false, editable: false, sqlColumn: "model_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
mainModelGridCols["model_name"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "model_name", placeholder: "Model", visible: true, editable: false, sqlColumn: "model_name", style: { textAlign: "left", minWidth: "300px", width: "300px" } };
mainModelGridCols["quantity"] = { objectType: "IntegerField", colIndex: 1, datatype: "text", name: "quantity", placeholder: "Quantity", editable: false, sqlColumn: "quantity", style: { textAlign: "left", minWidth: "100px", width: "100px" } };

componentListConfig["gridSize"] = {
    objectType: "Grid",
    schema: {
        name: "gridSize",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridSize",
        name: "gridSize",
        descriptoin: "Size Grid",
        type: "table",
        keyField: "size",
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


/////////////////// ADVANCE SEARCH CONFIGURATION ///////////////////////
componentListConfig["inputBatchIDSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBatchIDSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        advanceSearch: true,
        labelValue: "ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBatchID",
            type: "text",
            visible: true,
            value: "ID"
        },
        class: ""
    },
    data: {
        sqlcolumn: "batch_id_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBatchNoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBatchNoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        advanceSearch: true,
        labelValue: "Batch No",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBatchNo",
            type: "text",
            visible: true,
            value: "Batch No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "batch_no_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputModelSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputModelSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        advanceSearch: true,
        labelValue: "Model",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelModel",
            type: "text",
            visible: true,
            value: "Part"
        },
        class: ""
    },
    data: {
        sqlcolumn: "model_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonDelete"] = {
    objectType: "Button",
    schema: {
        id: "buttonDelete",
        name: "buttonDelete",
        type: "submit",
        label: "Delete",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

// Quantity Input
componentListConfig["inputQuantity"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputQuantity",
        placeholder: "Enter Quantity",
        type: "number",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelQuantity",
            type: "text",
            visible: true,
            value: "Quantity"
        }
    },
    data: {
        sqlcolumn: "quantity",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["buttonAddToGrid"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddToGrid",
        name: "buttonAddToGrid",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelAddToGrid",
            type: "text",
            visible: true,
            value: "Add to Grid"
        }
    },
    event: {}
}

export default componentListConfig