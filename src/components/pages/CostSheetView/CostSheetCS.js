
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formCostSheet",
        name: "formCostSheet",
        controllerObject: componentListConfig,
        create: false,
        createAPI: "",
        read: true,
        readAPI: "",
        update: false,
        updateAPI: "",
        delete: false,
        deleteAPI: ""
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCostSheet",
            type: "text",
            visible: true,
            value: "Cost Sheet Viewer"
        },
    },
    state: {
        populated: false,
        modified: false,
        deleted: false,
        new: false
    },
    actions: {
        save: "",
        delete: "",
        populate: "",
        refresh: ""
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
        label: "Search Cost Sheet",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonExcel"] = {
    objectType: "Button",
    schema: {
        id: "buttonExcel",
        name: "buttonExcel",
        type: "button",
        label: "Export to Excel",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

export default componentListConfig