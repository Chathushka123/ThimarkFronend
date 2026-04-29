let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formGrnPendingCompletedReport",
        name: "formGrnPendingCompletedReport",
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
            name: "labelGrnPendingCompletedReport",
            type: "text",
            visible: true,
            value: "GRN Pending vs Completed"
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
        { value: "1", text: " 01: Open GRNs (detailed + value)" },
        { value: "2", text: " 02: Completed GRNs (summary + value)" },
        { value: "4", text: " 04: Open GRN line-item drill-down" },
        { value: "5", text: " 05: Supplier receipt history" }
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
