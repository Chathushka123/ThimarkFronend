
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formMaterial",
        name: "formMaterial",
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
            value: "Material"
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

componentListConfig["inputMatCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMatCode",
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
            name: "labelMatCode",
            type: "text",
            visible: true,
            value: "Material Code"
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

componentListConfig["inputMatName"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMatName",
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
            name: "labelMatName",
            type: "text",
            visible: true,
            value: "Material Name"
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

componentListConfig["inputSupplier"] = {
    objectType: "TextBox",
    schema: {
        name: "inputSupplier",
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
            name: "labelSupplier",
            type: "text",
            visible: true,
            value: "Supplier"
        },
        class: ""
    },
    data: {
        sqlcolumn: "supplier",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputLeadTime"] = {
    objectType: "TextBox",
    schema: {
        name: "inputLeadTime",
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
            name: "labelLeadTime",
            type: "text",
            visible: true,
            value: "Lead Time"
        },
        class: ""
    },
    data: {
        sqlcolumn: "lead_time",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMinQty"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputMinQty",
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
            name: "labelMinQty",
            type: "text",
            visible: true,
            value: "Min Qty"
        },
        class: ""
    },
    data: {
        sqlcolumn: "min_qty",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputUnitPrice"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputUnitPrice",
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
            name: "labelUnitPrice",
            type: "text",
            visible: true,
            value: "Unit Price"
        },
        class: ""
    },
    data: {
        sqlcolumn: "unit_price",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCategory"] = {
    objectType: "DropDown",
    schema: {
        name: "inputCategory",
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
            name: "labelCategory",
            type: "text",
            visible: true,
            value: "Category"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "uom",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputUOM"] = {
    objectType: "DropDown",
    schema: {
        name: "inputUOM",
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
            name: "labelUOM",
            type: "text",
            visible: true,
            value: "UOM"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "uom",
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


export default componentListConfig
