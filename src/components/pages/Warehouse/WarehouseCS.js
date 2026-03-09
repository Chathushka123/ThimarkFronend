
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formWarehouse",
        name: "formWarehouse",
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
            name: "labelWarehouse",
            type: "text",
            visible: true,
            value: "Warehouse"
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

componentListConfig["buttonSaveInventory"] = {
    objectType: "Button",
    schema: {
        id: "buttonSaveInventory",
        name: "buttonSaveInventory",
        type: "submit",
        label: "Save Inventory",
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

componentListConfig["inputName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputName",
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
            name: "labelName",
            type: "text",
            visible: true,
            value: "Warehouse Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "name",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCode",
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
            name: "labelCode",
            type: "text",
            visible: true,
            value: "Warehouse Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputLocationBasis"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputLocationBasis",
        placeholder: "",
        type: "checkbox",
        label: "Location Basis",
        checkedValue: "1",
        uncheckedValue: "0",
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
            name: "labelIsActive",
            type: "text",
            visible: true,
            value: "Location Basis"
        },
    },
    data: {
        sqlcolumn: "is_active",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

// componentListConfig["inputLocationBasis"] = {
//     objectType: "CheckBox",
//     schema: {
//         name: "inputLocationBasis",
//         placeholder: "",
//         type: "checkbox",
//         showLabel: true,
//         visible: true,
//         insertable: true,
//         updateAllowed: true,
//         mandetory: false,
//         dataSourceController: componentListConfig["CONTROL_CENTER"]
//     },
//     label: {
//         objectType: "Label",
//         schema: {
//             name: "labelLocationBasis",
//             type: "text",
//             visible: true,
//             value: "Location Basis"
//         },
//         class: ""
//     },
//     data: {
//         sqlcolumn: "location_basis",
//         oldValue: false,
//         value: false
//     },
//     class: "",
//     event: {}
// }

let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "name", placeholder: "Name", editable: false, sqlColumn: "name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["code"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "code", placeholder: "Code", editable: false, sqlColumn: "code", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["location_basis"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "location_basis", placeholder: "Location Basis", editable: false, sqlColumn: "location_basis", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["active"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "active", placeholder: "Active Status", editable: false, sqlColumn: "active", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["created_at"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "created_at", placeholder: "Created At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridWarehouses"] = {
    objectType: "Grid",
    schema: {
        name: "gridWarehouses",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        filterring : true,
        sorting : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridWarehouses",
        name: "gridWarehouses",
        descriptoin: "Warehouses",
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

let locationCols = [];

locationCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
locationCols["rack"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "rack", placeholder: "Rack", editable: true, sqlColumn: "rack", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
locationCols["bin"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "bin", placeholder: "Bin", editable: true, sqlColumn: "bin", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridLocations"] = {
    objectType: "Grid",
    schema: {
        name: "gridLocations",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        filterring : true,
        sorting : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridLocations",
        name: "gridLocations",
        descriptoin: "Warehouse Locations",
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
        }
    },
    defaultRowCount: 1,
    columns: locationCols,
    data: [],
    event: {}
}

let whlItemCols = [];

whlItemCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
whlItemCols["whl_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "whl_id", placeholder: "Warehouse Location", editable: true, sqlColumn: "whl_id", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
whlItemCols["stock_item_id"] = { objectType: "DropDown", colIndex: 2, datatype: "dropdown", name: "stock_item_id", placeholder: "Stock Material", editable: true, sqlColumn: "stock_item_id", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
whlItemCols["qty"] = { objectType: "IntegerField", colIndex: 3, datatype: "number", name: "qty", placeholder: "Quantity", editable: true, sqlColumn: "qty", style: { textAlign: "right", minWidth: "150px", width: "150px" } };

componentListConfig["gridWHLItems"] = {
    objectType: "Grid",
    schema: {
        name: "gridWHLItems",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        filterring : true,
        sorting : true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridWHLItems",
        name: "gridWHLItems",
        descriptoin: "Warehouse Location Items",
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
        }
    },
    defaultRowCount: 3,
    columns: whlItemCols,
    data: [],
    event: {}
}

export default componentListConfig
