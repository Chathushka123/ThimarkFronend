let componentListConfig = [];

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formMrnIssuance",
        name: "formMrnIssuance",
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
            name: "labelMrnIssuance",
            type: "text",
            visible: true,
            value: "MRN Issuance"
        }
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
    event: {}
};

// MRN Scan Section
componentListConfig["inputMrnScan"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMrnScan",
        placeholder: "Scan or Enter MRN ID",
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
            name: "labelMrnScan",
            type: "text",
            visible: true,
            value: "Scan MRN ID"
        }
    },
    data: {
        sqlcolumn: "mrn_scan",
        oldValue: "",
        value: ""
    },
    event: {}
};



// MRN Details (Read-only Display)
componentListConfig["inputMrnID"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMrnID",
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
            name: "labelMrnID",
            type: "text",
            visible: true,
            value: "MRN ID"
        }
    },
    data: {
        sqlcolumn: "mrn_id",
        oldValue: "",
        value: ""
    },
    event: {}
};

componentListConfig["inputStatus"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStatus",
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
};

componentListConfig["inputBatchNo"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBatchNo",
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
            name: "labelBatchNo",
            type: "text",
            visible: true,
            value: "Batch No"
        }
    },
    data: {
        sqlcolumn: "batch_no",
        oldValue: "",
        value: ""
    },
    event: {}
};

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

// Advance Search Fields
componentListConfig["inputMrnIDSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMrnIDSearch",
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
        labelValue: "ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelMrnIDSearch",
            type: "text",
            visible: true,
            value: "ID"
        }
    },
    data: {
        sqlcolumn: "mrn_id_search",
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
        labelValue: "Issued To",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRemarkSearch",
            type: "text",
            visible: true,
            value: "Issued To"
        }
    },
    data: {
        sqlcolumn: "issued_to_search",
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

componentListConfig["inputWarehouse"] = {
    objectType: "TextBox",
    schema: {
        name: "inputWarehouse",
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
            name: "labelWarehouse",
            type: "text",
            visible: true,
            value: "Warehouse"
        }
    },
    data: {
        sqlcolumn: "warehouse",
        oldValue: "",
        value: ""
    },
    event: {}
};

componentListConfig["inputIssuedTo"] = {
    objectType: "TextBox",
    schema: {
        name: "inputIssuedTo",
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
            name: "labelIssuedTo",
            type: "text",
            visible: true,
            value: "Issued To"
        }
    },
    data: {
        sqlcolumn: "issued_to",
        oldValue: "",
        value: ""
    },
    event: {}
};

// Buttons
componentListConfig["buttonCompleteIssuance"] = {
    objectType: "Button",
    schema: {
        name: "buttonCompleteIssuance",
        type: "button",
        visible: false,
        disabled: false,
        value: "Complete Issuance"
    },
    event: {
        onClick: () => { }
    }
};



// Popups
componentListConfig["completePopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "completePopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: ""
    },
    event: {}
};

componentListConfig["buttonCompleteYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonCompleteYes",
        type: "button",
        visible: true,
        disabled: false,
        value: "Yes"
    },
    event: {
        onClick: () => { }
    }
};

componentListConfig["buttonCompleteNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonCompleteNo",
        type: "button",
        visible: true,
        disabled: false,
        value: "No"
    },
    event: {
        onClick: () => { }
    }
};

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
        value: ""
    },
    event: {}
};

componentListConfig["buttonDeleteYes"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeleteYes",
        type: "button",
        visible: true,
        disabled: false,
        value: "Yes"
    },
    event: {
        onClick: () => { }
    }
};

componentListConfig["buttonDeleteNo"] = {
    objectType: "Button",
    schema: {
        name: "buttonDeleteNo",
        type: "button",
        visible: true,
        disabled: false,
        value: "No"
    },
    event: {
        onClick: () => { }
    }
};

export default componentListConfig;
