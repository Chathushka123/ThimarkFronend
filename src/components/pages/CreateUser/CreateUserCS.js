
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formCreateUser",
        name: "formCreateUser",
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
            name: "labelCreateUser",
            type: "text",
            visible: true,
            value: "Create User"
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
        mandetory: true,
        searchable: true,
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
            value: "Name"
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

componentListConfig["inputIsActive"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputIsActive",
        placeholder: "",
        type: "checkbox",
        label: "Is Active",
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
            value: "Is Active"
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

componentListConfig["inputUserRole"] = {
    objectType: "DropDown",
    schema: {
        name: "inputUserRole",
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
            name: "labelUserRole",
            type: "text",
            visible: true,
            value: "User Role"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "role_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputOperations"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputOperations",
        id: "inputOperations",
        placeholder: "Operations",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: false,
        searchable: true,
        avoidHighlightFirstOption: true,
        showCheckbox: true,
        disable: false,
        onSearch: "",
        loading: false,
        style: "",
        selectionLimit: -1,
        endpoint: "",
        singleSelect: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelOperations",
            type: "text",
            visible: true,
            value: "Operations"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "operations",
        oldValue: "",
        value: []
    },
    class: "",
    event: {}
}

componentListConfig["inputEmailSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputEmailSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Email",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelEmailSearch",
            type: "text",
            visible: true,
            value: "Email"
        },
        class: ""
    },
    data: {
        sqlcolumn: "email_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputNameSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputNameSearch",
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
        labelValue: "Name",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelNameSearch",
            type: "text",
            visible: true,
            value: "Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "name_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

/* componentListConfig["inputUserRoleSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUserRoleSearch",
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
        labelValue: "User Role",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelUserRoleSearch",
            type: "text",
            visible: true,
            value: "User Role"
        },
        class: ""
    },
    data: {
        sqlcolumn: "user_role_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
} */

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

componentListConfig["buttonChangePassword"] = {
    objectType: "Button",
    schema: {
        id: "buttonChangePassword",
        name: "buttonChangePassword",
        type: "submit",
        label: "ChangePassword",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["changePasswordPopUp"] = {
    objectType: "PopUpPage",
    schema:{
        name: "changePasswordPopUp",
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

componentListConfig["inputPassword"] = {
    objectType: "Password",
    schema:{
        name: "inputPassword",
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
            name: "labelPassword",
            type: "text",
            visible: true,
            value: "Password"
        },
    },
    data: {
        sqlcolumn: "password",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
}

componentListConfig["inputConfirmPassword"] = {
    objectType: "Password",
    schema:{
        name: "inputConfirmPassword",
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
            name: "labelConfirmPassword",
            type: "text",
            visible: true,
            value: "Confirm Password"
        },
    },
    data: {
        sqlcolumn: "confirm_password",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
}

componentListConfig["buttonChangePasswordYes"] = {
    objectType: "Button",
    schema: {
        id: "buttonChangePasswordYes",
        name: "buttonChangePasswordYes",
        type: "submit",
        label: "Ok",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonChangePasswordNo"] = {
    objectType: "Button",
    schema: {
        id: "buttonChangePasswordNo",
        name: "buttonChangePasswordNo",
        type: "submit",
        label: "Cancel",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

componentListConfig["inputIsCommonUser"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputIsCommonUser",
        placeholder: "",
        type: "checkbox",
        label: "Common User",
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
            name: "labelIsCommonUser",
            type: "text",
            visible: true,
            value: "Common User"
        },
    },
    data: {
        sqlcolumn: "common_user",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let gridUserCols = [];

gridUserCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left", minWidth: "70px", width: "70px" } };
gridUserCols["email"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "email", placeholder: "Email", editable: false, filterring: true, sqlColumn: "email", style: { textAlign: "left", minWidth: "220px", width: "220px" } };
gridUserCols["name"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "name", placeholder: "Name", editable: false, filterring: true, sqlColumn: "name", style: { textAlign: "left", minWidth: "180px", width: "180px" } };
gridUserCols["role_code"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "role_code", placeholder: "Role", editable: false, filterring: true, sqlColumn: "role_code", style: { textAlign: "left", minWidth: "140px", width: "140px" } };
gridUserCols["is_active"] = { objectType: "CheckBox", colIndex: 4, datatype: "checkbox", name: "is_active", placeholder: "Active", editable: false, checkedValue: "1", uncheckedValue: "0", sqlColumn: "is_active", style: { textAlign: "center", minWidth: "90px", width: "90px" } };

componentListConfig["gridUsers"] = {
    objectType: "Grid",
    schema: {
        name: "gridUsers",
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        filterring: true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridUsers",
        name: "gridUsers",
        descriptoin: "Users",
        type: "table",
        keyField: "id",
        visible: true,
        Create: false,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: false,
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
    defaultRowCount: 0,
    columns: gridUserCols,
    data: [],
    event: {}
}

export default componentListConfig