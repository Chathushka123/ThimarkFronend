
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formMrn",
        name: "formMrn",
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
            name: "labelMrn",
            type: "text",
            visible: true,
            value: "MRN - Material Request Note"
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

// MRN ID (auto-generated, readonly)
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
}

// MRN Status (readonly)
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
}

// MRN Remark (readonly)
componentListConfig["inputRemark"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRemark",
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
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRemark",
            type: "text",
            visible: true,
            value: "Issue To"
        }
    },
    data: {
        sqlcolumn: "remark",
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

// Batch Multi-Select
componentListConfig["inputBatch"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputBatch",
        id: "inputBatch",
        placeholder: "Select Batch",
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
            name: "labelBatch",
            type: "text",
            visible: true,
            value: "Batch"
        }
    },
    options: [],
    data: {
        sqlcolumn: "batch",
        oldValue: "",
        value: []
    },
    event: {}
}

// Material Multi-Select
componentListConfig["inputMaterial"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputMaterial",
        id: "inputMaterial",
        placeholder: "Select Material",
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
            name: "labelMaterial",
            type: "text",
            visible: true,
            value: "Material"
        }
    },
    options: [],
    data: {
        sqlcolumn: "material",
        oldValue: "",
        value: []
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

// Material Grid Configuration
let materialGridCols = [];
materialGridCols["mrn_detail_id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "mrn_detail_id", placeholder: "MRN Detail ID", visible: false, editable: false, sqlColumn: "mrn_detail_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
materialGridCols["material_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "material_id", placeholder: "Material ID", visible: false, editable: false, sqlColumn: "material_id", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
materialGridCols["material_name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "material_name", placeholder: "Material", visible: true, editable: false, sqlColumn: "material_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
materialGridCols["quantity"] = { objectType: "IntegerField", colIndex: 3, datatype: "number", name: "quantity", placeholder: "Quantity", editable: false, sqlColumn: "quantity", style: { textAlign: "right", minWidth: "120px", width: "120px" } };

componentListConfig["gridMaterials"] = {
    objectType: "Grid",
    schema: {
        name: "gridMaterials",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridMaterials",
        name: "gridMaterials",
        description: "Materials Grid",
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
        }
    },
    defaultRowCount: 3,
    columns: materialGridCols,
    data: [],
    event: {}
}

// Buttons
componentListConfig["buttonNew"] = {
    objectType: "Button",
    schema: {
        id: "buttonNew",
        name: "buttonNew",
        type: "button",
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
        type: "button",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
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

componentListConfig["buttonFinalize"] = {
    objectType: "Button",
    schema: {
        id: "buttonFinalize",
        name: "buttonFinalize",
        type: "button",
        visible: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFinalize",
            type: "text",
            visible: true,
            value: "Finalize MRN"
        }
    },
    event: {}
}

componentListConfig["buttonReopen"] = {
    objectType: "Button",
    schema: {
        id: "buttonReopen",
        name: "buttonReopen",
        type: "button",
        visible: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelReopen",
            type: "text",
            visible: true,
            value: "Re-open MRN"
        }
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
        labelValue: "MRN ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelMrnIDSearch",
            type: "text",
            visible: true,
            value: "MRN ID"
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

// Confirmation Popups
componentListConfig["finalizePopUp"] = {
    objectType: "PopUpPage",
    schema:{
        name: "finalizePopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event:{}
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

componentListConfig["reopenPopUp"] = {
    objectType: "PopUpPage",
    schema:{
        name: "reopenPopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event:{}
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
            value: "Yes, Re-open"
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

/////////////////// ADVANCE SEARCH CONFIGURATION ///////////////////////
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
        mandetory: true,
        searchable: true,
        advanceSearch: true,
        labelValue: "ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelMrnID",
            type: "text",
            visible: true,
            value: "ID"
        },
        class: ""
    },
    data: {
        sqlcolumn: "mrn_id_search",
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

componentListConfig["printPdfPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "printPdfPopUp",
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

componentListConfig["buttonPrint"] = {
    objectType: "Button",
    schema: {
        id: "buttonPrint",
        name: "buttonPrint",
        type: "submit",
        label: "Print Invoice",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

export default componentListConfig
