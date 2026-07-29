
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formWorkOrder",
        name: "formWorkOrder",
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
            name: "labelWorkOrder",
            type: "text",
            visible: true,
            value: "Work Order"
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

// Load an existing work order
componentListConfig["inputSelectWorkOrder"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputSelectWorkOrder",
        id: "inputSelectWorkOrder",
        placeholder: "Select Work Order",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: false,
        searchable: true,
        avoidHighlightFirstOption: true,
        showCheckbox: true,
        disable: false,
        onSearch: "",
        loading: false,
        style: "",
        selectionLimit: 1,
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelSelectWorkOrder",
            type: "text",
            visible: true,
            value: "Open Work Order"
        }
    },
    options: [],
    data: {
        sqlcolumn: "work_order_id",
        oldValue: "",
        value: []
    },
    event: {}
}

// Batch Detail (source for creating a new work order)
componentListConfig["inputBatchDetail"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputBatchDetail",
        id: "inputBatchDetail",
        placeholder: "Select Batch Detail",
        type: "text",
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
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBatchDetail",
            type: "text",
            visible: true,
            value: "Batch Detail"
        }
    },
    options: [],
    data: {
        sqlcolumn: "batch_detail_id",
        oldValue: "",
        value: []
    },
    event: {}
}

// Work Order ID (read-only)
componentListConfig["inputWorkOrderId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputWorkOrderId",
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
            name: "labelWorkOrderId",
            type: "text",
            visible: true,
            value: "Work Order ID"
        }
    },
    data: {
        sqlcolumn: "id",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Status (read-only)
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

// Bundle Size - hard-coded to "BasSize" for every bundle; field is kept
// mounted (so the framework can bind setValue) but hidden from the user.
componentListConfig["inputBundleSize"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBundleSize",
        placeholder: "e.g. M, L, XL",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        disabled: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBundleSize",
            type: "text",
            visible: true,
            value: "Size"
        }
    },
    data: {
        sqlcolumn: "size",
        oldValue: "BasSize",
        value: "BasSize"
    },
    event: {}
}

// Bundle Qty
componentListConfig["inputBundleQty"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputBundleQty",
        placeholder: "Enter Qty",
        type: "number",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        disabled: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBundleQty",
            type: "text",
            visible: true,
            value: "Bundle Qty"
        }
    },
    data: {
        sqlcolumn: "qty",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Bundle Trolley (unused trolleys only)
componentListConfig["inputBundleTrolly"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputBundleTrolly",
        id: "inputBundleTrolly",
        placeholder: "Select Trolley",
        type: "text",
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
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBundleTrolly",
            type: "text",
            visible: true,
            value: "Trolley"
        }
    },
    options: [],
    data: {
        sqlcolumn: "trolly_master_id",
        oldValue: "",
        value: []
    },
    event: {}
}

// Scan a trolley's QR sticker to auto-select it in inputBundleTrolly
componentListConfig["buttonScanTrolley"] = {
    objectType: "Button",
    schema: {
        id: "buttonScanTrolley",
        name: "buttonScanTrolley",
        type: "button",
        label: "Scan Trolley QR",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonAddBundle"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddBundle",
        name: "buttonAddBundle",
        type: "button",
        label: "Add Bundle",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

// Pick Material - which bundle to pick for
componentListConfig["inputPickBundle"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputPickBundle",
        id: "inputPickBundle",
        placeholder: "Select Bundle",
        type: "text",
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
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPickBundle",
            type: "text",
            visible: true,
            value: "Bundle"
        }
    },
    options: [],
    data: {
        sqlcolumn: "bundle_id",
        oldValue: "",
        value: []
    },
    event: {}
}

// Pick Material - scan a warehouse location's QR to auto-fill inputPickLocationId
componentListConfig["buttonScanLocation"] = {
    objectType: "Button",
    schema: {
        id: "buttonScanLocation",
        name: "buttonScanLocation",
        type: "button",
        label: "Scan Location QR",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

// Pick Material - scan location id
componentListConfig["inputPickLocationId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPickLocationId",
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
            name: "labelPickLocationId",
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

// Pick Material - resolved stock material (read-only)
componentListConfig["inputPickStockMaterial"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPickStockMaterial",
        placeholder: "",
        type: "text",
        length: 200,
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
            name: "labelPickStockMaterial",
            type: "text",
            visible: true,
            value: "Stock Material"
        }
    },
    data: {
        sqlcolumn: "stock_material",
        oldValue: "",
        value: ""
    },
    event: {}
}

// Pick Material - which stock row (whl_item) to pick from
componentListConfig["inputPickWhlItem"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputPickWhlItem",
        id: "inputPickWhlItem",
        placeholder: "Select Stock Row",
        type: "text",
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
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPickWhlItem",
            type: "text",
            visible: true,
            value: "Available Stock Row"
        }
    },
    options: [],
    data: {
        sqlcolumn: "whl_item_id",
        oldValue: "",
        value: []
    },
    event: {}
}

// Pick Material - qty to pick
componentListConfig["inputPickQty"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputPickQty",
        placeholder: "Enter Qty",
        type: "number",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        disabled: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPickQty",
            type: "text",
            visible: true,
            value: "Qty to Pick"
        }
    },
    data: {
        sqlcolumn: "qty",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["buttonAddPick"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddPick",
        name: "buttonAddPick",
        type: "button",
        label: "Add Pick",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

// Main Buttons
componentListConfig["buttonCreateWorkOrder"] = {
    objectType: "Button",
    schema: {
        id: "buttonCreateWorkOrder",
        name: "buttonCreateWorkOrder",
        type: "button",
        label: "Create Work Order",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonNewWorkOrder"] = {
    objectType: "Button",
    schema: {
        id: "buttonNewWorkOrder",
        name: "buttonNewWorkOrder",
        type: "button",
        label: "New Work Order",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonFinalize"] = {
    objectType: "Button",
    schema: {
        id: "buttonFinalize",
        name: "buttonFinalize",
        type: "button",
        label: "Finalize Work Order",
        disabled: false,
        visible: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonReopen"] = {
    objectType: "Button",
    schema: {
        id: "buttonReopen",
        name: "buttonReopen",
        type: "button",
        label: "Reopen Work Order",
        disabled: false,
        visible: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

// Finalize Confirmation Popup
componentListConfig["finalizeWorkOrderPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "finalizeWorkOrderPopUp",
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

componentListConfig["buttonFinalizeYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonFinalizeYes",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFinalizeYes",
            type: "text",
            visible: true,
            value: "Yes, Finalize"
        }
    },
    event: {}
}

componentListConfig["buttonFinalizeNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonFinalizeNo",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFinalizeNo",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

// Reopen Confirmation Popup
componentListConfig["reopenWorkOrderPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "reopenWorkOrderPopUp",
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

componentListConfig["buttonReopenYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonReopenYes",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelReopenYes",
            type: "text",
            visible: true,
            value: "Yes, Reopen"
        }
    },
    event: {}
}

componentListConfig["buttonReopenNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonReopenNo",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelReopenNo",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

// Delete Pick Confirmation Popup
componentListConfig["deletePickPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "deletePickPopUp",
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

componentListConfig["inputDeletePickId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDeletePickId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: false,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeletePickId",
            type: "text",
            visible: false,
            value: "Bundle Detail ID"
        }
    },
    data: {
        sqlcolumn: "bundle_detail_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["buttonDeletePickYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeletePickYes",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeletePickYes",
            type: "text",
            visible: true,
            value: "Yes, Remove"
        }
    },
    event: {}
}

componentListConfig["buttonDeletePickNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeletePickNo",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeletePickNo",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

// Edit Bundle Popup
componentListConfig["editBundlePopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "editBundlePopUp",
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

componentListConfig["inputEditBundleId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputEditBundleId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: false,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEditBundleId",
            type: "text",
            visible: false,
            value: "Bundle ID"
        }
    },
    data: {
        sqlcolumn: "bundle_id",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputEditBundleSize"] = {
    objectType: "TextBox",
    schema: {
        name: "inputEditBundleSize",
        placeholder: "e.g. M, L, XL",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        disabled: false,
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEditBundleSize",
            type: "text",
            visible: true,
            value: "Size"
        }
    },
    data: {
        sqlcolumn: "size",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputEditBundleQty"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputEditBundleQty",
        placeholder: "Enter Qty",
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
            name: "labelEditBundleQty",
            type: "text",
            visible: true,
            value: "Bundle Qty"
        }
    },
    data: {
        sqlcolumn: "qty",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputEditBundleTrolly"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputEditBundleTrolly",
        id: "inputEditBundleTrolly",
        placeholder: "Select Trolley",
        type: "text",
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
        endpoint: "",
        singleSelect: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEditBundleTrolly",
            type: "text",
            visible: true,
            value: "Trolley"
        }
    },
    options: [],
    data: {
        sqlcolumn: "trolly_master_id",
        oldValue: "",
        value: []
    },
    event: {}
}

componentListConfig["buttonEditBundleSave"] = {
    objectType: "Button",
    schema: {
        name: "buttonEditBundleSave",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEditBundleSave",
            type: "text",
            visible: true,
            value: "Save"
        }
    },
    event: {}
}

componentListConfig["buttonEditBundleCancel"] = {
    objectType: "Button",
    schema: {
        name: "buttonEditBundleCancel",
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEditBundleCancel",
            type: "text",
            visible: true,
            value: "Cancel"
        }
    },
    event: {}
}

export default componentListConfig
