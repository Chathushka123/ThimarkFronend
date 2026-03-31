let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formPurchaseOrder",
        name: "formPurchaseOrder",
        controllerObject: componentListConfig,
        create: true,
        createAPI: "",
        read: true,
        readAPI: "",
        update: true,
        updateAPI: "",
        delete: true,
        deleteAPI: ""
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPurchaseOrder",
            type: "text",
            visible: true,
            value: "Purchase Order"
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
    event: {}
}

// ── Action Buttons ──────────────────────────────────────────────────────────

componentListConfig["buttonAdvanceSearch"] = {
    objectType: "Button",
    schema: {
        id: "buttonAdvanceSearch",
        name: "buttonAdvanceSearch",
        type: "submit",
        label: "Search",
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

// ── Advance Search Fields ────────────────────────────────────────────────────

componentListConfig["inputPoNoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPoNoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: true,
        advanceSearch: true,
        labelValue: "PO Number",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelPoNoSearch", type: "text", visible: true, value: "PO Number" },
        class: ""
    },
    data: { sqlcolumn: "po_no_search", oldValue: "", value: "" },
    class: "",
    event: {}
}

componentListConfig["inputSupplierSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputSupplierSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: true,
        advanceSearch: true,
        labelValue: "Supplier",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelSupplierSearch", type: "text", visible: true, value: "Supplier" },
        class: ""
    },
    data: { sqlcolumn: "supplier_search", oldValue: "", value: "" },
    class: "",
    event: {}
}

componentListConfig["inputStatusSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStatusSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        searchable: true,
        advanceSearch: true,
        labelValue: "Status",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelStatusSearch", type: "text", visible: true, value: "Status" },
        class: ""
    },
    data: { sqlcolumn: "status_search", oldValue: "", value: "" },
    class: "",
    event: {}
}

// ── Master Fields ────────────────────────────────────────────────────────────

componentListConfig["inputId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputId",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: false,
        visible: false,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelId", type: "text", visible: false, value: "ID" },
        class: ""
    },
    data: { sqlcolumn: "id", oldValue: "", value: "" },
    class: "",
    event: {}
}

componentListConfig["inputPoNumber"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPoNumber",
        placeholder: "Auto-generated on save",
        type: "text",
        length: 50,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: false,
        mandetory: true,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelPoNumber", type: "text", visible: true, value: "PO Number" },
        class: ""
    },
    data: { sqlcolumn: "po_number", oldValue: "", value: "" },
    class: "",
    event: {}
}


componentListConfig["inputSupplier"] = {
    objectType: "Multiselect",
    schema: {
        name: "inputSupplier",
        id: "inputSupplier",
        placeholder: "Select Supplier",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandatory: true,
        searchable: true,
        avoidHighlightFirstOption: false,
        showCheckbox: true,
        disable: false,
        onSearch: "",
        loading: false,
        style: "",
        selectionLimit: 1,
        endpoint: "",
        singleSelect: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelSupplier",
            type: "text",
            visible: true,
            value: "Supplier"
        }
    },
    options: [],
    data: {
        sqlcolumn: "supplier_id",
        oldValue: "",
        value: []
    },
    event: {}
}

componentListConfig["inputOrderDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputOrderDate",
        placeholder: "",
        type: "text",
        length: 20,
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
        schema: { name: "labelOrderDate", type: "text", visible: true, value: "Order Date" },
        class: ""
    },
    data: { sqlcolumn: "order_date", oldValue: "", value: "" },
    class: "",
    event: {}
}

componentListConfig["inputExpectedDeliveryDate"] = {
    objectType: "DateField",
    schema: {
        name: "inputExpectedDeliveryDate",
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
        schema: { name: "labelExpectedDeliveryDate", type: "text", visible: true, value: "Expected Delivery" },
        class: ""
    },
    data: { sqlcolumn: "expected_delivery_date", oldValue: "", value: "" },
    class: "",
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
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelStatus", type: "text", visible: true, value: "Status" },
        class: ""
    },
    options: [
        { value: "0", text: "- Select Status -" },
        { value: "DRAFT", text: "DRAFT" },
        { value: "OPEN", text: "OPEN" },
        { value: "PENDING APPROVAL", text: "PENDING APPROVAL" },
        { value: "APPROVED", text: "APPROVED" },
        { value: "SENT", text: "SENT" },
        { value: "RECEIVED", text: "RECEIVED" },
        { value: "CANCELLED", text: "CANCELLED" },
    ],
    data: { sqlcolumn: "status", oldValue: "", value: "Draft" },
    class: "",
    event: {}
}

componentListConfig["inputNotes"] = {
    objectType: "TextArea",
    schema: {
        name: "inputNotes",
        placeholder: "Additional notes, delivery instructions...",
        type: "text",
        length: 1000,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelNotes", type: "text", visible: true, value: "Notes / Remarks" },
        class: ""
    },
    data: { sqlcolumn: "notes", oldValue: "", value: "" },
    class: "",
    event: {}
}

// ── Financial Summary Fields ─────────────────────────────────────────────────

componentListConfig["inputSubtotal"] = {
    objectType: "TextBox",
    schema: {
        name: "inputSubtotal",
        placeholder: "0.00",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelSubtotal", type: "text", visible: true, value: "Subtotal (LKR)" },
        class: ""
    },
    data: { sqlcolumn: "subtotal", oldValue: "0.00", value: "0.00" },
    class: "",
    event: {}
}

componentListConfig["inputDiscount"] = {
    objectType: "TextBox",
    schema: {
        name: "inputDiscount",
        placeholder: "0.00",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelDiscount", type: "text", visible: true, value: "Discount (LKR)" },
        class: ""
    },
    data: { sqlcolumn: "discount", oldValue: "0.00", value: "0.00" },
    class: "",
    event: {}
}

componentListConfig["inputTax"] = {
    objectType: "TextBox",
    schema: {
        name: "inputTax",
        placeholder: "0.00",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelTax", type: "text", visible: true, value: "Tax (LKR)" },
        class: ""
    },
    data: { sqlcolumn: "tax", oldValue: "0.00", value: "0.00" },
    class: "",
    event: {}
}

componentListConfig["inputShippingCost"] = {
    objectType: "TextBox",
    schema: {
        name: "inputShippingCost",
        placeholder: "0.00",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelShippingCost", type: "text", visible: true, value: "Shipping (LKR)" },
        class: ""
    },
    data: { sqlcolumn: "shipping_cost", oldValue: "0.00", value: "0.00" },
    class: "",
    event: {}
}

componentListConfig["inputTotalAmount"] = {
    objectType: "TextBox",
    schema: {
        name: "inputTotalAmount",
        placeholder: "0.00",
        type: "text",
        length: 20,
        showLabel: true,
        visible: true,
        insertable: false,
        updateAllowed: false,
        mandetory: false,
        readOnly: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: { name: "labelTotalAmount", type: "text", visible: true, value: "Grand Total (LKR)" },
        class: ""
    },
    data: { sqlcolumn: "total_amount", oldValue: "0.00", value: "0.00" },
    class: "",
    event: {}
}

// ── Line Items Grid ──────────────────────────────────────────────────────────

let poItemCols = []

poItemCols["id"] = { objectType: "TextBox", colIndex: 0, datatype: "text", name: "po_item_id", placeholder: "", visible: false, editable: false, sqlColumn: "po_item_id", style: { textAlign: "left" } }
poItemCols["material_id"] = { objectType: "DropDown", colIndex: 1, datatype: "dropdown", name: "material_id", placeholder: "Select...", visible: true, editable: true, sqlColumn: "material_id", options: [{ value: "", text: "- Select Material -" }], style: { textAlign: "left", minWidth: "230px", width: "230px" } }
poItemCols["uom"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "uom", placeholder: "UOM", visible: true, editable: false, sqlColumn: "uom", style: { textAlign: "center", minWidth: "75px", width: "75px" } }
poItemCols["quantity"] = { objectType: "NumberField", colIndex: 3, datatype: "number", name: "quantity", placeholder: "Qty", visible: true, editable: true, sqlColumn: "quantity", style: { textAlign: "right", minWidth: "100px", width: "100px" } }
poItemCols["unit_price"] = { objectType: "NumberField", colIndex: 4, datatype: "number", name: "unit_price", placeholder: "Unit price", visible: true, editable: true, sqlColumn: "unit_price", style: { textAlign: "right", minWidth: "120px", width: "120px" } }
poItemCols["item_expected_delivery"] = { objectType: "TextBox", colIndex: 5, datatype: "text", name: "item_expected_delivery", placeholder: "Ex mill", visible: true, editable: true, sqlColumn: "item_expected_delivery", style: { textAlign: "left", minWidth: "130px", width: "130px" } }
poItemCols["total"] = { objectType: "NumberField", colIndex: 6, datatype: "number", name: "total", placeholder: "Total", visible: true, editable: false, sqlColumn: "total", style: { textAlign: "right", minWidth: "130px", width: "130px" } }

componentListConfig["gridPoItems"] = {
    objectType: "Grid",
    schema: {
        name: "gridPoItems",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        sorting: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridPoItems",
        name: "gridPoItems",
        description: "Purchase Order Line Items",
        type: "table",
        keyField: "po_item_id",
        visible: true,
        Create: true,
        CreateAPI: "",
        Read: true,
        ReadAPI: "",
        Update: true,
        UpdateAPI: "",
        delete: true,
        DeleteAPI: "",
        State: { Populated: false, Modified: false },
        Actions: { Save: "buttonSave", Delete: "", Read: "" }
    },
    defaultRowCount: 3,
    columns: poItemCols,
    data: [],
    event: {}
}

export default componentListConfig
