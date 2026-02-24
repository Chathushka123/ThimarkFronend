
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formBuyer",
        name: "formBuyer",
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
            name: "labelBuyer",
            type: "text",
            visible: true,
            value: "INVOICE"
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

componentListConfig["buttonPrint"] = {
    objectType: "Button",
    schema: {
        id: "buttonPrint",
        name: "buttonPrint",
        type: "submit",
        label: "Print Invoice",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonPrintImage"] = {
    objectType: "Button",
    schema: {
        id: "buttonPrintImage",
        name: "buttonPrintImage",
        type: "submit",
        label: "Images",
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

let gridCols = [];

gridCols["tbl_updated_at"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "tbl_updated_at", placeholder: "Updated At", visible: false, editable: false, sqlColumn: "tbl_updated_at", style: { textAlign: "left" } };
gridCols["invoice_detail_id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "invoice_detail_id", placeholder: "", visible: false, editable: false, sqlColumn: "invoice_detail_id", style: { textAlign: "left" } };
gridCols["qty"] = { objectType: "IntegerField", colIndex: 1, datatype: "text", name: "qty", placeholder: "Qty", visible: true, editable: true, sqlColumn: "qty", style: {width:"200px", textAlign: "left" } };
gridCols["description"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "description", placeholder: "Description", visible: true, editable: true, sqlColumn: "description", style: { minWidth:"400px",width:"400px",textAlign: "left" } };
gridCols["amount"] = { objectType: "NumberField", colIndex: 8, datatype: "text", name: "amount", placeholder: "RS.", editable: true, sqlColumn: "amount", style: { textAlign: "left", minWidth: "100px", width: "150px" } };

componentListConfig["gridInvoiceDetails"] = {
    objectType: "Grid",
    schema:{
        name: "gridInvoiceDetails",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridInvoiceDetails",
        name: "gridInvoiceDetails",
        descriptoin: "Invoice Details",
        type: "table",
        keyField: "id",
        visible: true,
        Create: true,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: true,
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
    defaultRowCount: 3,
    columns: gridCols,
    data: [],
    event: {}
}


////Payment Details

let gridColsPayment = [];


gridColsPayment["invoice_payment_id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "invoice_payment_id", placeholder: "", visible: false, editable: false, sqlColumn: "invoice_payment_id", style: { textAlign: "left" } };
gridColsPayment["description"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "description", placeholder: "Payment Date", visible: true, editable: false, sqlColumn: "description", style: { minWidth:"400px",width:"400px",textAlign: "left" } };
gridColsPayment["payment_method"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "payment_method", placeholder: "Payment Method", editable: false, sqlColumn: "payment_method", style: { textAlign: "left", minWidth: "100px", width: "150px" } };
gridColsPayment["amount"] = { objectType: "NumberField", colIndex: 3, datatype: "text", name: "amount", placeholder: "RS.", editable: false, sqlColumn: "amount", style: { textAlign: "left", minWidth: "100px", width: "150px" } };

componentListConfig["gridPaymentDetails"] = {
    objectType: "Grid",
    schema:{
        name: "gridPaymentDetails",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridPaymentDetails",
        name: "gridPaymentDetails",
        descriptoin: "Payment Details",
        type: "table",
        keyField: "id",
        visible: true,
        Create: true,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: true,
        UpdateAPI: "",
        delete: false,
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
    defaultRowCount: 3,
    columns: gridColsPayment,
    data: [],
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
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        readOnly:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelId",
            type: "text",
            visible: true,
            value: "ID"
        },
        class: ""
    },
    data: {
        sqlcolumn: "id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBillNo"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBillNo",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBillNo",
            type: "text",
            visible: true,
            value: "Bill No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "bill_no",
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
        searchable: true,
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

componentListConfig["inputMobile"] = {
    objectType: "NumberField",
    schema: {
        name: "inputMobile",
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
            name: "labelMobile",
            type: "text",
            visible: true,
            value: "Mobile"
        },
        class: ""
    },
    data: {
        sqlcolumn: "mobile",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputLand"] = {
    objectType: "TextBox",
    schema: {
        name: "inputLand",
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
            name: "labelLand",
            type: "text",
            visible: true,
            value: "Land Line"
        },
        class: ""
    },
    data: {
        sqlcolumn: "land",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputAddress"] = {
    objectType: "TextBox",
    schema: {
        name: "inputAddress",
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
            name: "labelAddress",
            type: "text",
            visible: true,
            value: "Remark"
        },
        class: ""
    },
    data: {
        sqlcolumn: "address",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputUploadImage"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUploadImage",
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
            name: "labelUploadImage",
            type: "text",
            visible: true,
            value: "Upload Image"
        },
        class: ""
    },
    data: {
        sqlcolumn: "upload_image",
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
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        readOnly:true,
        selectionLimit:1,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStatus",
            type: "text",
            visible: true,
            value: "Status"
        },
        class: ""
    },
    data: {
        sqlcolumn: "status",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputDate"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDate",
        placeholder: new Date().toISOString().split('T')[0],
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        readOnly:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelDate",
            type: "text",
            visible: true,
            value: "Invoice Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "status",
        oldValue: "",
        value: new Date().toISOString().split('T')[0]
    },
    class: "",
    event: {}
}

componentListConfig["inputTotalAmount"] = {
    objectType: "TextBox",
    schema: {
        name: "inputTotalAmount",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        readOnly:true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelTotalAmount",
            type: "text",
            visible: true,
            value: "Total Amount"
        },
        class: ""
    },
    data: {
        sqlcolumn: "total_amount",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputPaid"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPaid",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: true,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPaid",
            type: "text",
            visible: true,
            value: "Paid"
        },
        class: ""
    },
    data: {
        sqlcolumn: "paid",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBalance"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBalance",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: false,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBalance",
            type: "text",
            visible: true,
            value: "Balance"
        },
        class: ""
    },
    data: {
        sqlcolumn: "balance",
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

componentListConfig["inputDueDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputDueDate",
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
            value: "Due Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "due_date",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputPaymentDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputPaymentDate",
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
            value: "Payment Date"
        },
        class: ""
    },
    data: {
        sqlcolumn: "payment_date",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}


componentListConfig["inputInvoiceIDSearcj"] = {
    objectType: "TextBox",
    schema: {
        name: "inputInvoiceIDSearcj",
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
        labelValue: "ID",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelInvoiceID",
            type: "text",
            visible: true,
            value: "ID"
        },
        class: ""
    },
    data: {
        sqlcolumn: "invoice_id_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputInvoiceNameSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputInvoiceNameSearch",
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
            name: "labelInvoiceID",
            type: "text",
            visible: true,
            value: "Name"
        },
        class: ""
    },
    data: {
        sqlcolumn: "invoice_name_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputInvoiceContactSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputInvoiceContactSearch",
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
        labelValue: "Contact",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelInvoiceContact",
            type: "text",
            visible: true,
            value: "Contact"
        },
        class: ""
    },
    data: {
        sqlcolumn: "invoice_contact_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["printPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "printPopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event: {}
}

componentListConfig["printPdfPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "printPdfPopUp",
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    data: {
        sqlcolumn: "",
        oldValue: "",
        value: "",
    },
    event: {}
}

componentListConfig["inputInvoiceStatus"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputInvoiceStatus",
        id: "inputInvoiceStatus",
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
        endpoint : "",
        singleSelect : false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelInvoiceStatus",
            type: "text",
            visible: true,
            value: "Status"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "invoice_status",
        oldValue: "",
        value: []
    },
    class: "",
    event: {}
};

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



export default componentListConfig