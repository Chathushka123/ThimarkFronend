
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formStockTransfer",
        name: "formStockTransfer",
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
            name: "labelStockTransfer",
            type: "text",
            visible: true,
            value: "Stock Transfer"
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
componentListConfig["inputWarehouse"] = {
    objectType: "DropDown",
    schema: {
        name: "inputWarehouse",
        placeholder: "Select Warehouse",
        type: "text",
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
            name: "labelWarehouse",
            type: "text",
            visible: true,
            value: "Warehouse"
        }
    },
    options: [],
    data: {
        sqlcolumn: "warehouse_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputMaterial"] = {
    objectType: "DropDown",
    schema: {
        name: "inputMaterial",
        placeholder: "Select Material",
        type: "text",
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
            name: "labelMaterial",
            type: "text",
            visible: true,
            value: "Material"
        }
    },
    options: [{ value: "", text: "Select Material" }],
    data: {
        sqlcolumn: "material_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputFromLocation"] = {
    objectType: "TextBox",
    schema: {
        name: "inputFromLocation",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: false,
        readOnly: false,
        searchable:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFromLocation",
            type: "text",
            visible: true,
            value: "From Location"
        }
    },
    data: {
        sqlcolumn: "from_location",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputToLocation"] = {
    objectType: "TextBox",
    schema: {
        name: "inputToLocation",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: false,
        readOnly: false,
        searchable:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelToLocation",
            type: "text",
            visible: true,
            value: "To Location"
        }
    },
    data: {
        sqlcolumn: "to_location",
        oldValue: "",
        value: ""
    },
    event: {}
}
componentListConfig["inputQty"] = {
    objectType: "TextBox",
    schema: {
        name: "inputQty",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: false,
        readOnly: false,
        searchable:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelQty",
            type: "text",
            visible: true,
            value: "Qty"
        }
    },
    data: {
        sqlcolumn: "qty",
        oldValue: "",
        value: ""
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


export default componentListConfig