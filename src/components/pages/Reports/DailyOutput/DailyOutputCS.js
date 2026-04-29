let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formDailyOutputReport",
        name: "formDailyOutputReport",
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
            name: "labelDailyOutputReport",
            type: "text",
            visible: true,
            value: "Daily Production Summary"
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

// componentListConfig["inputQueryType"] = {
//     objectType: "DropDown",
//     schema: {
//         name: "inputQueryType",
//         placeholder: "Select query",
//         type: "text",
//         length: 50,
//         showLabel: true,
//         visible: true,
//         insertable: true,
//         updateAllowed: true,
//         mandetory: true,
//         dataSourceController: componentListConfig["CONTROL_CENTER"]
//     },
//     label: {
//         objectType: "Label",
//         schema: {
//             name: "labelQueryType",
//             type: "text",
//             visible: true,
//             value: "Query Type"
//         }
//     },
//     options: [
//         { value: "1", text: " 01: Core daily summary" },
//         { value: "2", text: " 02: Daily summary with created-by" },
//         { value: "3", text: " 03: Daily total KPI" },
//         { value: "4", text: " 04: Date-range summary" },
//         { value: "5", text: " 05: Warehouse breakdown" }
//     ],
//     data: {
//         sqlcolumn: "query_type",
//         oldValue: "",
//         value: ""
//     },
//     event: {}
// }

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
        { value: "1", text: " 01: Core daily summary" },
        { value: "2", text: " 02: Daily summary with created-by" },
        { value: "3", text: " 03: Daily total KPI" },
        { value: "4", text: " 04: Date-range summary" },
        { value: "5", text: " 05: Warehouse breakdown" }
    ],
    data: { sqlcolumn: "query_type", oldValue: "", value: "" },
    class: "",
    event: {}
}


componentListConfig["inputFromDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputFromDate",
        placeholder: "",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFromDate",
            type: "text",
            visible: true,
            value: "From Date"
        }
    },
    data: {
        sqlcolumn: "from_date",
        oldValue: "",
        value: ""
    },
    event: {}
}

componentListConfig["inputToDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputToDate",
        placeholder: "",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelToDate",
            type: "text",
            visible: true,
            value: "To Date"
        }
    },
    data: {
        sqlcolumn: "to_date",
        oldValue: "",
        value: ""
    },
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
