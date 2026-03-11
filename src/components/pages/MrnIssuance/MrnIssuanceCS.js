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
