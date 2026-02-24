
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formInvoiceREgistry",
        name: "formInvoiceREgistry",
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
            name: "labelInvoiceRegistry",
            type: "text",
            visible: true,
            value: "INVOICE REGISTRY"
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

let columns =[
    {title: 'Bill No',type: 'text',data: 'bill_no',customDataType: 'text', width:50 },
    {title: 'Name',type: 'text',data: 'name',customDataType: 'text', width:100 },
    {title: 'Contact',type: 'text',data: 'contact',customDataType: 'text', width:100 },
    {title: 'Status',type: 'text',data: 'status',customDataType: 'text', width:60 },
    {title: 'Amount',type: 'text',data: 'total_amount',customDataType: 'text', width:60 },
    {title: 'Paid',type: 'text',data: 'paid',customDataType: 'text', width:60 },
    {title: 'Balance',type: 'text',data: 'balance',customDataType: 'text', width:75 },
    {title: 'Invoice Date',type: 'text',data: 'invoice_date',customDataType: 'text', width:75 },
    {title: 'Due Date',type: 'text',data: 'due_date',customDataType: 'text', width:75 }
    
];

let data =[];
componentListConfig["gridInvoiceRegistry"] = {
    objectType: "gridInvoiceRegistry",
    schema:{
        name: "gridInvoiceRegistry",
        filters:true,
        sorting: true,
        delete:false,
        edit:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    defaultRowCount: 3,
    columns: columns,
    data: data,
    delete:false,
    name:"gridInvoiceRegistry",
    event: {}
}




export default componentListConfig