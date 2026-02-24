
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formTransactionSummary",
        name: "formTransactionSummary",
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
            name: "labelTransactionSummary",
            type: "text",
            visible: true,
            value: "Transaction Summary"
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

componentListConfig["inputFromDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputFromDate",
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
            value: "From Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "from_date",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}
componentListConfig["inputToDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputToDate",
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
            name: "labelToDate",
            type: "text",
            visible: true,
            value: "To Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "to_date",
        oldValue: "",
        value: ""
    },
    class: "",
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

let columns =[
    {title: 'Payment Date',type: 'text',data: 'payment_date',customDataType: 'text', width:75 },
    {title: 'Type',type: 'text',data: 'type',customDataType: 'text', width:100 },
    {title: 'Bill No',type: 'text',data: 'bill_no',customDataType: 'text', width:75 },
    {title: 'Amount',type: 'text',data: 'amount',customDataType: 'text', width:75 },
    {title: 'Payment Type',type: 'text',data: 'payment_type',customDataType: 'text', width:100 },
    {title: 'Payee',type: 'text',data: 'payee',customDataType: 'text', width:150 },  
    {title: 'Payer',type: 'text',data: 'payer',customDataType: 'text', width:150 },  
    {title: 'description',type: 'text',data: 'description',customDataType: 'text', width:150 } 
];

let data =[{},{},{}];
componentListConfig["gridTransactionSummary"] = {
    objectType: "gridTransactionSummary",
    schema:{
        name: "gridTransactionSummary",
        filters:true,
        sorting: true,
        delete:false,
        edit:false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    defaultRowCount: 3,
    columns: columns,
    data: data,
    delete:false,
    name:"gridTransactionSummary",
    event: {}
}


export default componentListConfig