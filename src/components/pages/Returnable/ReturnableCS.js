
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formReturnable",
        name: "formReturnable",
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
            name: "labelReturnable",
            type: "text",
            visible: true,
            value: "Returnable"
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

componentListConfig["inputRequester"] = {
    objectType: "Password",
    schema:{
        name: "inputRequester",
        placeholder: "",
        type: "password",
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
            name: "labelRequester",
            type: "text",
            visible: true,
            value: "Requester"
        },
    },
    data: {
        sqlcolumn: "requester",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
}
componentListConfig["inputRequesterName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRequesterName",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRequesterName",
            type: "text",
            visible: true,
            value: "Requester Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "requester_name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputRemark"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRemark",
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
            name: "labelRemark",
            type: "text",
            visible: true,
            value: "Remark"
        },
        class: ""
    },
    data: {
        sqlcolumn: "remark",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMaterial"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMaterial",
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
            name: "labelMaterial",
            type: "text",
            visible: true,
            value: "Material"
        },
        class: ""
    },
    data: {
        sqlcolumn: "material",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}
componentListConfig["inputMaterialName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMaterialName",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelMaterialName",
            type: "text",
            visible: true,
            value: "Material Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "material_name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

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

// Material Grid Configuration
let materialGridCols = [];
materialGridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
materialGridCols["material_code"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "material_code", placeholder: "Code", visible: true, editable: false, sqlColumn: "material_code", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
materialGridCols["remarks"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "remarks", placeholder: "Remarks", visible: true, editable: false, sqlColumn: "remarks", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
materialGridCols["material_name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "material_name", placeholder: "Name", visible: true, editable: false, sqlColumn: "material_name", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
materialGridCols["issued_qty"] = { objectType: "IntegerField", colIndex: 3, datatype: "number", name: "issued_qty", placeholder: "Issued ", editable: false, sqlColumn: "issued_qty", style: { textAlign: "right", minWidth: "50px", width: "50px" } };
materialGridCols["return_qty"] = { objectType: "IntegerField", colIndex: 4, datatype: "number", name: "return_qty", placeholder: "Return", editable: false, sqlColumn: "return_qty", style: { textAlign: "right", minWidth: "50px", width: "50px" } };
materialGridCols["qty"] = { objectType: "IntegerField", colIndex: 5, datatype: "number", name: "qty", placeholder: "Qty", editable: true, sqlColumn: "qty", style: { textAlign: "right", minWidth: "50px", width: "50px" } };

componentListConfig["gridReturnableItem"] = {
    objectType: "Grid",
    schema: {
        name: "gridReturnableItem",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridReturnableItem",
        name: "gridReturnableItem",
        description: "Returnable Items Grid",
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

export default componentListConfig