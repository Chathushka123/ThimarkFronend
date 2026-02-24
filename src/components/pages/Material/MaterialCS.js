
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
        sqlcolumn: "mat_code",
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
        sqlcolumn: "mat_name",
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
    objectType: "TextBox",
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
            value: "Material Size"
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


export default componentListConfig