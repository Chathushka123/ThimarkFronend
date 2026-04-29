let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formPurchaseOrderStatusReport",
        name: "formPurchaseOrderStatusReport",
        controllerObject: componentListConfig,
        create: false,
        createAPI: "",
        read: true,
        readAPI: "",
        update: false,
        updateAPI: "",
        delete: false,
        deleteAPI: ""
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPurchaseOrderStatusReport",
            type: "text",
            visible: true,
            value: "Purchase Order Status Report"
        },
    },
    state: {
        populated: false,
        modified: false,
        deleted: false,
        new: true
    },
    actions: {
        save: "",
        delete: "",
        populate: "",
        refresh: ""
    },
    event: {}
}

componentListConfig["inputQueryType"] = {
    objectType: "DropDown",
    schema: {
        name: "inputQueryType",
        placeholder: "",
        type: "text",
        length: 50,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelQueryType", type: "text", visible: true, value: "Query Type" },
        class: ""
    },
    options: [
        { value: "1", text: " 01: PO header summary" },
        { value: "2", text: " 02: PO line-item drill-down" },
        { value: "6", text: " 06: PO vs GRN reconciliation" }
    ],
    data: { sqlcolumn: "query_type", oldValue: "", value: "" },
    class: "",
    event: {}
}

componentListConfig["buttonRunReport"] = {
    objectType: "Button",
    schema: {
        id: "buttonRunReport",
        name: "buttonRunReport",
        type: "button",
        label: "Run Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonDownloadCsv"] = {
    objectType: "Button",
    schema: {
        id: "buttonDownloadCsv",
        name: "buttonDownloadCsv",
        type: "button",
        label: "Download CSV",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

export default componentListConfig
