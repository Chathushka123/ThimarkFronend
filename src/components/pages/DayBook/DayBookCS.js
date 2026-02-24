
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formDayBook",
        name: "formDayBook",
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
            name: "labelDayBook",
            type: "text",
            visible: true,
            value: "Day Book"
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

componentListConfig["inputDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputDate",
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
            name: "labelDueDate",
            type: "text",
            visible: true,
            value: "Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "date",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputPayee"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPayee",
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
            name: "labelPayee",
            type: "text",
            visible: true,
            value: "Payee"
        },
        class: ""
    },
    data: {
        sqlcolumn: "payee",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputPaymentType"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputPaymentType",
        id: "inputPaymentType",
        placeholder: "",
        type: "text",
        placeholder: "Status",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: true, 
        searchable: true,
        avoidHighlightFirstOption: true,
        showCheckbox: true,
        disable: false,
        onSearch: "", 
        loading: false,
        style: "",
        selectionLimit: 1,
        endpoint : "Invoice/getPaymentMethods",
        singleSelect : false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPaymentType",
            type: "text",
            visible: true,
            value: "Payment Type"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "payment_type",
        oldValue: "",
        value: []
    },
    class: "",
    event: {}
};
componentListConfig["buttonAddPaymentType"] = {
    objectType: "Button",
    schema: {
        id: "buttonAddPaymentType",
        name: "buttonAddPaymentType",
        type: "submit",
        label: "Advance Search",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["radioPaymentMethod"] = {
    objectType: "RadioGroup",
    schema:{
        disabled: false,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    radioCash:{
        objectType: "Radio",
        schema:{
            id:"radioCash",
            name: "radioPaymentMethod",
            type: "radio",
            value: "CASH",
            visible: true,
            disabled: false,
            readOnly: false,
            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class:"",
        event:{}
    },
    radioBank:{
        objectType: "Radio",
        schema:{
            id:"radioBank",
            name: "radioPaymentMethod",
            type: "radio",
            value: "BANK",
            visible: true,
            disabled: false,
            readOnly: false,
            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class:"",
        event:{}
    },
    data: {
        sqlcolumn: "payment_method",
        value: "CASH"
    },
    event:{}
}

componentListConfig["inputRemarks"] = {
    objectType: "TextBox",
    schema: {
        name: "inputRemarks",
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
            name: "labelRemarks",
            type: "text",
            visible: true,
            value: "Remarks"
        },
        class: ""
    },
    data: {
        sqlcolumn: "remarks",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputAmount"] = {
    objectType: "TextBox",
    schema: {
        name: "inputAmount",
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
            name: "labelAmount",
            type: "text",
            visible: true,
            value: "Amount"
        },
        class: ""
    },
    data: {
        sqlcolumn: "amount",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["radioDrCr"] = {
    objectType: "RadioGroup",
    schema:{
        disabled: false,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    radioDr:{
        objectType: "Radio",
        schema:{
            id:"radioDr",
            name: "radioDrCr",
            type: "radio",
            value: "DR.",
            visible: true,
            disabled: false,
            readOnly: false,
            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class:"",
        event:{}
    },
    radioCr:{
        objectType: "Radio",
        schema:{
            id:"radioCr",
            name: "radioDrCr",
            type: "radio",
            value: "CR.",
            visible: true,
            disabled: false,
            readOnly: false,
            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class:"",
        event:{}
    },
    data: {
        sqlcolumn: "dr_cr",
        value: "DR."
    },
    event:{}
}

componentListConfig["AddPaymentTypePopUp"] = {
    objectType: "AddPaymentTypePopUp",
    schema:{
        name: "AddPaymentTypePopUp",
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

componentListConfig["inputAddPaymentType"] = {
    objectType: "TextBox",
    schema: {
        name: "inputAddPaymentType",
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
            name: "labelAddPaymentType",
            type: "text",
            visible: true,
            value: "Add Payment Type"
        },
        class: ""
    },
    data: {
        sqlcolumn: "add_payment_type",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonSavePaymentType"] = {
    objectType: "Button",
    schema: {
        id: "buttonSavePaymentType",
        name: "buttonSavePaymentType",
        type: "submit",
        label: "",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

export default componentListConfig