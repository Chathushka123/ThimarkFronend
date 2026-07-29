
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formGrn",
        name: "formGrn",
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
            name: "labelGrn",
            type: "text",
            visible: true,
            value: "Supermarket GRN"
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

// GRN ID (hidden/auto-generated)
componentListConfig["inputGrnID"] = {
    objectType: "TextBox",
    schema: {
        name: "inputGrnID",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: true,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelGrnID",
            type: "text",
            visible: true,
            value: "GRN ID"
        }
    },
    data: {
        sqlcolumn: "grn_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Remarks
componentListConfig["inputRemarks"] = {
    objectType: "TextArea",
    schema: {
        name: "inputRemarks",
        placeholder: "Enter remarks",
        type: "text",
        length: 500,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        rows: 3,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRemarks",
            type: "text",
            visible: true,
            value: "Remarks"
        }
    },
    data: {
        sqlcolumn: "remarks",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Warehouse Dropdown
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

// GRN Status (shown, not editable)
componentListConfig["inputStatus"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStatus",
        placeholder: "",
        type: "text",
        length: 50,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: true,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStatus",
            type: "text",
            visible: true,
            value: "Status"
        }
    },
    data: {
        sqlcolumn: "status",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Location ID (for scanning/entering)
componentListConfig["inputLocationId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputLocationId",
        placeholder: "Scan or Enter Location ID",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        disabled: false,
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelLocationId",
            type: "text",
            visible: true,
            value: "Location ID"
        }
    },
    data: {
        sqlcolumn: "location_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Stock Item ID (for scanning/entering)
componentListConfig["inputStockItemId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStockItemId",
        placeholder: "Scan or Enter Stock Item ID",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        disabled: false,
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStockItemId",
            type: "text",
            visible: true,
            value: "Stock Item ID"
        }
    },
    data: {
        sqlcolumn: "stock_item_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Quantity
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
        disabled: false,
        searchable: true,
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

// Material
componentListConfig["inputMaterial"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMaterial",
        placeholder: "Enter Material",
        type: "text",
        length: 100,
        showLabel: false,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        disabled: false,
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
    data: {
        sqlcolumn: "material_code",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Buttons
componentListConfig["buttonCreateGrn"] = {
    objectType: "Button",
    schema: {
        id: "buttonCreateGrn",
        name: "buttonCreateGrn",
        type: "button",
        label: "Create GRN",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonAddTransaction"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddTransaction",
        name: "buttonAddTransaction",
        type: "button",
        label: "Add Transaction",
        disabled: false,
        visible: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonCompleteGrn"] = {
    objectType: "Button",
    schema: {
        id: "buttonCompleteGrn",
        name: "buttonCompleteGrn",
        type: "button",
        label: "Complete GRN",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonNewGrn"] = {
    objectType: "Button",
    schema: {
        id: "buttonNewGrn",
        name: "buttonNewGrn",
        type: "button",
        label: "New GRN",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

// Advance Search Fields
componentListConfig["inputGrnIDSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputGrnIDSearch",
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
        labelValue: "GRN ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelGrnIDSearch",
            type: "text",
            visible: true,
            value: "GRN ID"
        }
    },
    data: {
        sqlcolumn: "grn_id_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputWarehouseSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputWarehouseSearch",
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
        labelValue: "Warehouse",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelWarehouseSearch",
            type: "text",
            visible: true,
            value: "Warehouse"
        }
    },
    data: {
        sqlcolumn: "warehouse_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputRemarkSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRemarkSearch",
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
        labelValue: "Remark",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRemarkSearch",
            type: "text",
            visible: true,
            value: "Remark"
        }
    },
    data: {
        sqlcolumn: "remark_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputStatusSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStatusSearch",
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
        labelValue: "Status",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStatusSearch",
            type: "text",
            visible: true,
            value: "Status"
        }
    },
    data: {
        sqlcolumn: "status_search",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Delete Transaction Confirmation Popup
componentListConfig["deleteTransactionPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "deleteTransactionPopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event: {}
}

componentListConfig["inputDeleteTransactionId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDeleteTransactionId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: false,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeleteTransactionId",
            type: "text",
            visible: false,
            value: "Transaction ID"
        }
    },
    data: {
        sqlcolumn: "transaction_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["buttonDeleteTransactionYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeleteTransactionYes",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeleteTransactionYes",
            type: "text",
            visible: true,
            value: "Yes, Delete"
        }
    },
    event: {}
}

componentListConfig["buttonDeleteTransactionNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeleteTransactionNo",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeleteTransactionNo",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

// Complete GRN Confirmation Popup
componentListConfig["completeGrnPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "completeGrnPopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event: {}
}

componentListConfig["buttonCompleteGrnYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonCompleteGrnYes",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCompleteGrnYes",
            type: "text",
            visible: true,
            value: "Yes, Complete"
        }
    },
    event: {}
}

componentListConfig["buttonCompleteGrnNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonCompleteGrnNo",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCompleteGrnNo",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

export default componentListConfig
