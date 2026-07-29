let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formWorkOrderStatusReport",
        name: "formWorkOrderStatusReport",
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
            name: "labelWorkOrderStatusReport",
            type: "text",
            visible: true,
            value: "Work Order Status"
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

componentListConfig["inputStatus"] = {
    objectType: "DropDown",
    schema: {
        name: "inputStatus",
        placeholder: "",
        type: "text",
        length: 50,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelStatus", type: "text", visible: true, value: "Work Order Status" },
        class: ""
    },
    options: [
        { value: "", text: "All" },
        { value: "OPEN", text: "Open" },
        { value: "FINALIZED", text: "Finalized" },
        { value: "COMPLETED", text: "Complete" }
    ],
    data: { sqlcolumn: "status", oldValue: "", value: "" },
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
