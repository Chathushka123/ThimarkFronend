
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formSupplier",
        name: "formSupplier",
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
            name: "labelSupplier",
            type: "text",
            visible: true,
            value: "Suppliers"
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
            value: "Supplier Name"
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

componentListConfig["inputAddress"] = {
    objectType: "TextBox",
    schema: {
        name: "inputAddress",
        placeholder: "",
        type: "text",
        length: 500,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelAddress",
            type: "text",
            visible: true,
            value: "Address"
        },
        class: ""
    },
    data: {
        sqlcolumn: "address",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputContactNo"] = {
    objectType: "TextBox",
    schema: {
        name: "inputContactNo",
        placeholder: "",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelContactNo",
            type: "text",
            visible: true,
            value: "Contact No."
        },
        class: ""
    },
    data: {
        sqlcolumn: "contact_no",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputEmail"] = {
    objectType: "TextBox",
    schema: {
        name: "inputEmail",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEmail",
            type: "text",
            visible: true,
            value: "Email"
        },
        class: ""
    },
    data: {
        sqlcolumn: "email",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let gridCols = [];

gridCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "80px", width: "80px" } };
gridCols["name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "name", placeholder: "Name", editable: false, sqlColumn: "name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["address"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "address", placeholder: "Address", editable: false, sqlColumn: "address", style: { textAlign: "left", minWidth: "250px", width: "250px" } };
gridCols["contact_no"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "contact_no", placeholder: "Contact No.", editable: false, sqlColumn: "contact_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["email"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "email", placeholder: "Email", editable: false, sqlColumn: "email", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["created_at"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "created_at", placeholder: "Created At", editable: false, sqlColumn: "created_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["updated_at"] = { objectType: "TextBox", colIndex: 6, datatype: "text", name: "updated_at", placeholder: "Updated At", editable: false, sqlColumn: "updated_at", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridSuppliers"] = {
    objectType: "Grid",
    schema: {
        name: "gridSuppliers",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridSuppliers",
        name: "gridSuppliers",
        descriptoin: "Suppliers",
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

export default componentListConfig
