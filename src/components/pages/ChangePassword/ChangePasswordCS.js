
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formChangePassword",
        name: "formChangePassword",
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
            name: "labelChangePassword",
            type: "text",
            visible: true,
            value: "Change Password"
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

/* componentListConfig["inputOldPassword"] = {
    objectType: "Password",
    schema:{
        name: "inputOldPassword",
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
            name: "labelOldPassword",
            type: "text",
            visible: true,
            value: "Old Password"
        },
    },
    data: {
        sqlcolumn: "old_password",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
} */

componentListConfig["inputNewPassword"] = {
    objectType: "Password",
    schema:{
        name: "inputNewPassword",
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
            name: "labelNewPassword",
            type: "text",
            visible: true,
            value: "New Password"
        },
    },
    data: {
        sqlcolumn: "new_password",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
}

componentListConfig["inputConfirmNewPassword"] = {
    objectType: "Password",
    schema:{
        name: "inputConfirmNewPassword",
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
            name: "labelConfirmNewPassword",
            type: "text",
            visible: true,
            value: "Confirm New Password"
        },
    },
    data: {
        sqlcolumn: "confirm_new_password",
        oldValue: "",
        value: ""
    },
    class:"",
    event:{}
}

componentListConfig["buttonChangePassword"] = {
    objectType: "Button",
    schema: {
        id: "buttonChangePassword",
        name: "buttonChangePassword",
        type: "submit",
        label: "Change Password",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

export default componentListConfig