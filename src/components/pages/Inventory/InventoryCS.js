
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formInventory",
        name: "formInventory",
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
            name: "labelInventory",
            type: "text",
            visible: true,
            value: "Inventory Management"
        },
    },
    state: {
        populated: true,
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

componentListConfig["inputWH"] = {
    objectType: "DropDown",
    schema: {
        name: "inputWH",
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
            name: "labelWHSelect",
            type: "text",
            visible: true,
            value: "Select a Warehouse : "
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "warehouse",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMatDescription"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMatDescription",
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
            name: "labelMatDescription",
            type: "text",
            visible: true,
            value: "Material Description"
        },
        class: ""
    },
    data: {
        sqlcolumn: "mat_description",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMatSize"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMatSize",
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
            name: "labelMatSize",
            type: "text",
            visible: true,
            value: "Material Size (Comma seperated, No Sapces)"
        },
        class: ""
    },
    data: {
        sqlcolumn: "mat_size",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "is", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "name", placeholder: "Name", editable: false, sqlColumn: "name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["code"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "code", placeholder: "Code", editable: false, sqlColumn: "code", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["supplier"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "suppllier", placeholder: "Supplier", editable: false, sqlColumn: "supplier", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["lead_time"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "lead_time", placeholder: "Lead Time", editable: false, sqlColumn: "lead_time", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["min_qty"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "min_qty", placeholder: "Min Qty", editable: false, sqlColumn: "min_qty", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["size"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "size", placeholder: "Sizes", editable: false, sqlColumn: "size", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["unit_price"] = { objectType: "TextBox", colIndex: 7, datatype: "text", name: "unit_price", placeholder: "Unit Price", editable: false, sqlColumn: "unit_price", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["uom"] = { objectType: "TextBox", colIndex: 8, datatype: "text", name: "uom", placeholder: "UOM", editable: false, sqlColumn: "uom", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["real_category"] = { objectType: "TextBox", colIndex: 9, datatype: "text", name: "real_category", placeholder: "Category", editable: false, sqlColumn: "real_category", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["active"] = { objectType: "TextBox", colIndex: 10, datatype: "text", name: "active", placeholder: "Active Status", editable: false, sqlColumn: "active", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["created_at"] = { objectType: "TextBox", colIndex: 11, datatype: "text", name: "created_at", placeholder: "Careated At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 12, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["uom_id"] = { objectType: "TextBox", colIndex: 13, datatype: "text", name: "uom_id", placeholder: "UOM", editable: false, visible: false, sqlColumn: "uom_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["category"] = { objectType: "TextBox", colIndex: 14, datatype: "text", name: "category", placeholder: "UOM", editable: false, visible: false, sqlColumn: "category", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridMaterials"] = {
    objectType: "Grid",
    schema: {
        name: "gridMaterials",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridMaterials",
        name: "gridMaterials",
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
        delete: false,
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

let gridReturnCols = [];

gridReturnCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "is", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["item_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "item_name", placeholder: "Material Name", editable: false, sqlColumn: "item_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridReturnCols["item_code"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "item_code", placeholder: "Material Code", editable: false, sqlColumn: "item_code", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridReturnCols["issued_to"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "issued_to", placeholder: "Issued To", editable: false, sqlColumn: "issued_to", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["issued_qty"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "issued_qty", placeholder: "Issued Qty", editable: false, sqlColumn: "issued_qty", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["return_qty"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "return_qty", placeholder: "Return Qty", editable: false, sqlColumn: "return_qty", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["issued_by"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "issued_by", placeholder: "Issued By", editable: false, sqlColumn: "issued_by", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["issued_at"] = { objectType: "TextBox", colIndex: 7, datatype: "text", name: "issued_at", placeholder: "Issued At", editable: false, sqlColumn: "issued_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["updated_by"] = { objectType: "TextBox", colIndex: 8, datatype: "text", name: "updated_by", placeholder: "Last Updated By", editable: false, sqlColumn: "updated_by", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridReturnCols["updated_at"] = { objectType: "TextBox", colIndex: 9, datatype: "text", name: "updated_at", placeholder: "Last Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridReturnables"] = {
    objectType: "Grid",
    schema: {
        name: "gridReturnables",
        visible: true,
        insertable: false,
        sorting: true,
        filterring: true,
        updateAllowed: false,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridReturnables",
        name: "gridReturnables",
        descriptoin: "Pending Returnables",
        type: "table",
        keyField: "id",
        visible: true,
        Create: false,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: false,
        UpdateAPI: "",
        delete: false,
        DeleteAPI: "",
        State: { Populated: false, Modified: false },
        Actions: { Save: "", Delete: "", Read: "" }
    },
    defaultRowCount: 0,
    columns: gridReturnCols,
    data: [],
    event: {}
}


export default componentListConfig
