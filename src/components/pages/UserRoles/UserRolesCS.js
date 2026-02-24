
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formUserRoles",
        name: "formUserRoles",
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
            name: "labelUserRoles",
            type: "text",
            visible: true,
            value: "User Roles"
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

componentListConfig["inputRoleCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRoleCode",
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
            name: "labelRoleCode",
            type: "text",
            visible: true,
            value: "Role Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "role_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputDescription"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDescription",
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
            name: "labelDescription",
            type: "text",
            visible: true,
            value: "Description"
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

componentListConfig["inputRoleCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRoleCodeSearch",
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
        labelValue: "Role Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelRoleCodeSearch",
            type: "text",
            visible: true,
            value: "Role Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "role_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputDescriptionSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDescriptionSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Description",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDescriptionSearch",
            type: "text",
            visible: true,
            value: "Description"
        },
        class: ""
    },
    data: {
        sqlcolumn: "description_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["lovComboBoxUser"] = {
    objectType: "LovComboBox",
    schema: {
        name: "lovComboBoxUser",
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
            name: "labellovComboBoxUser",
            type: "text",
            visible: true,
            value: "User"
        },
        class: ""
    },
    options:[],
    data: {
        sqlcolumn: "user_id",
        oldValue: "",
        value: "",
        id: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonAddUser"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddUser",
        name: "buttonAddUser",
        type: "submit",
        label: "Add",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

let gridCols = [];

gridCols["tbl_updated_at"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "tbl_updated_at", placeholder: "Updated At", visible: false, editable: false, sqlColumn: "tbl_updated_at", style: { textAlign: "left" } };
gridCols["tbl_user_id"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "tbl_user_id", placeholder: "User ID", visible: false, editable: false, sqlColumn: "tbl_user_id", style: { textAlign: "left" } };
gridCols["tbl_user_name"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "tbl_user_name", placeholder: "Name", editable: false, sqlColumn: "tbl_user_name", style: { textAlign: "left", minWidth: "300px", width: "300px" } };
gridCols["tbl_user_email"] = { objectType: "TextBox", colIndex: 4, datatype: "text", name: "tbl_user_email", placeholder: "Email", editable: false, sqlColumn: "tbl_user_email", style: { textAlign: "left", minWidth: "300px", width: "300px" } };

componentListConfig["gridUserRoleDetails"] = {
    objectType: "Grid",
    schema:{
        name: "gridUserRoleDetails",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridUserRoleDetails",
        name: "gridUserRoleDetails",
        descriptoin: "User Role Details",
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

export default componentListConfig