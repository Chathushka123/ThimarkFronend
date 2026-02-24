
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formStyle",
        name: "formStyle",
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
            name: "labelStyle",
            type: "text",
            visible: true,
            value: "Style"
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

componentListConfig["buttonRefresh"] = {
    objectType: "Button",
    schema: {
        id: "buttonRefresh",
        name: "buttonRefresh",
        type: "submit",
        label: "Clear",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

componentListConfig["buttonReset"] = {
    objectType: "Button",
    schema: {
        id: "buttonReset",
        name: "buttonReset",
        type: "submit",
        label: "Reset",
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

componentListConfig["inputStyleCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleCode",
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
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Style Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleDescription"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleDescription",
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
            name: "labelStyleDescription",
            type: "text",
            visible: true,
            value: "Style Description"
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

componentListConfig["inputStyleSizeFit"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleSizeFit",
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
            name: "labelStyleSizeFit",
            type: "text",
            visible: true,
            value: "Style Size/Fit"
        },
        class: ""
    },
    data: {
        sqlcolumn: "size_fit",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["lovComboBoxRoute"] = {
    objectType: "LovComboBox",
    schema: {
        name: "lovComboBoxRoute",
        placeholder: "",
        type: "text",
        length: 100,
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
            name: "labellovComboBoxRoute",
            type: "text",
            visible: true,
            value: "Style Route"
        },
        class: ""
    },
    options:[],
    data: {
        sqlcolumn: "routing_id",
        oldValue: "",
        value: "",
        id: ""
    },
    class: "",
    event: {}
}

/* componentListConfig["inputStyleRouteCode"] = {
    objectType: "DropDown",
    schema: {
        name: "inputStyleRouteCode",
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
            name: "labelStyleRouteCode",
            type: "text",
            visible: true,
            value: "Style Route"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "routing_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
} */

componentListConfig["inputStyleCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleCodeSearch",
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
        labelValue: "Style Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleCodeSearch",
            type: "text",
            visible: true,
            value: "Style Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleDescriptionSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleDescriptionSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Style Description",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleDescriptionSearch",
            type: "text",
            visible: true,
            value: "Style Description"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_description_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleRouteCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleRouteCodeSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Route Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleRouteCodeSearch",
            type: "text",
            visible: true,
            value: "Route Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_route_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let grid1Cols = [];

grid1Cols["size"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "size", placeholder: "Size", editable: true, sqlColumn: "size", style: { textAlign: "left", minWidth: "225px", width: "225px" } };
grid1Cols["fit"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "fit", placeholder: "Qty", editable: true, sqlColumn: "fit", style: { textAlign: "left", minWidth: "225px", width: "225px" } };

componentListConfig["gridSizeFitJson"] = {
    objectType: "Grid",
    schema:{
        name: "gridSizeFitJson",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridSizeFitJson",
        name: "gridSizeFitJson",
        descriptoin: "SizeFitJson",
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
        },
        Actions: {
            Save: "buttonSave",
            Delete: "",
            Read: "buttonSearch"
        }
    },
    defaultRowCount: 3,
    columns: grid1Cols,
    data: [],
    event: {}
}

let gridCols = [];

gridCols["updated_at"] = { objectType: "TextBox", datatype: "text", name: "updated_at", placeholder: "Updated At", visible: false, editable: false, sqlColumn: "updated_at", style: { textAlign: "left" } }
gridCols["id"] = { objectType: "TextBox", datatype: "text", name: "id", placeholder: "ID", visible:false, editable: false, sqlColumn: "id", style: { textAlign: "left" } };
gridCols["fabric"] = { objectType: "TextBox", datatype: "text", name: "fabric", placeholder: "Fabric", editable: true, sqlColumn: "fabric", style: { textAlign: "left", minWidth: "450px", width: "450px" } };

componentListConfig["gridFabricInformation"] = {
    objectType: "Grid",
    schema:{
        name: "gridFabricInformation",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridFabricInformation",
        name: "gridFabricInformation",
        descriptoin: "FabricInformation",
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

componentListConfig["inputUpdatedAt"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUpdatedAt",
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
            name: "labelUpdatedAt",
            type: "text",
            visible: false,
            value: "Updated At"
        },
    },
    data: {
        sqlcolumn: "updated_at",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStatus"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStatus",
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
            name: "labelStatus",
            type: "text",
            visible: false,
            value: "Status"
        },
    },
    data: {
        sqlcolumn: "status",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonDeleteMaster"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteMaster",
        name: "buttonDeleteMaster",
        type: "submit",
        label: "Delete",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["deleteMasterPopUp"] = {
    objectType: "PopUpPage",
    schema:{
        name: "deleteMasterPopUp",
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

componentListConfig["inputDeleteMasterId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDeleteMasterId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: false,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDeleteMasterId",
            type: "text",
            visible: false,
            value: "Delete Master Id"
        },
        class: ""
    },
    data: {
        sqlcolumn: "delete_master_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonDeleteMasterYes"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteMasterYes",
        name: "buttonDeleteMasterYes",
        type: "submit",
        label: "Yes",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonDeleteMasterNo"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteMasterNo",
        name: "buttonDeleteMasterNo",
        type: "submit",
        label: "No",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["inputUploadSizeQty"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUploadSizeQty",
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
            name: "labelUploadSizeQty",
            type: "text",
            visible: true,
            value: "Upload Size Qty"
        },
        class: ""
    },
    data: {
        sqlcolumn: "size_qty",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonUploadSizeQty"] = {
    objectType: "Button",
    schema: {
        id: "buttonUploadSizeQty",
        name: "buttonUploadSizeQty",
        type: "submit",
        label: "Save",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

export default componentListConfig