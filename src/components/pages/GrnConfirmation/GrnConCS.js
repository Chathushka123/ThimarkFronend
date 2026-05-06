
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formGrnConfiramation",
        name: "formGrnConfiramation",
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
            name: "labelMaterial",
            type: "text",
            visible: true,
            value: "GRN Confirmation"
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

let gridCols = [];

// Add checkbox column for row selection
gridCols["_select"] = {
    objectType: "CheckBox",
    colIndex: 0,
    datatype: "boolean",
    name: "_select",
    placeholder: "Select",
    editable: true,
    sqlColumn: "_select",
    checkedValue: true,
    uncheckedValue: false,
    style: { textAlign: "center", minWidth: "50px", width: "50px" }
};

gridCols["id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["grn_detail_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "grn_detail_id", placeholder: "grn_detail_id", visible: false, editable: false, sqlColumn: "grn_detail_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["rmpono"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "rmpono", placeholder: "RM PO No", editable: false, sqlColumn: "rmpono", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
;
gridCols["remark"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "remark", placeholder: "Remark", editable: false, sqlColumn: "remark", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["supplier"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "supplier", placeholder: "Supplier", editable: false, sqlColumn: "supplier", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["warehouse"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "warehouse", placeholder: "Warehouse", editable: false, sqlColumn: "warehouse", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["location"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "location", placeholder: "Location", editable: false, sqlColumn: "location", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["material"] = { objectType: "TextBox", colIndex: 5, datatype: "text", material: "supplier", placeholder: "Material", editable: false, sqlColumn: "material", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["quantity"] = { objectType: "TextBox", colIndex: 5, datatype: "text", quantity: "supplier", placeholder: "Quantity", editable: false, sqlColumn: "quantity", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["status"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "status", placeholder: "Status", editable: false, sqlColumn: "status", style: { textAlign: "left", minWidth: "150px", width: "150px" } }
gridCols["created_at"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "created_at", placeholder: "Created At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } }


componentListConfig["gridOpenGrns"] = {
    objectType: "Grid",
    schema: {
        name: "gridOpenGrns",
        visible: true,
        insertable: true,
        sorting: true,
        filterring: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridOpenGrns",
        name: "gridOpenGrns",
        descriptoin: "Materials",
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
