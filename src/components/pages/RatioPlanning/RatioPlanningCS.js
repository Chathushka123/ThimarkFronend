
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formRatioPlanning",
        name: "formRatioPlanning",
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
            name: "labelRatioPlanning",
            type: "text",
            visible: true,
            value: "Ratio Planning"
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

componentListConfig["buttonRefresh"] = {
    objectType: "Button",
    schema: {
        id: "buttonRefresh",
        name: "buttonRefresh",
        type: "submit",
        label: "Clear",
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

componentListConfig["inputSOCNoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputSOCNoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "SOC No",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelSOCNoSearch",
            type: "text",
            visible: true,
            value: "SOC No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "soc_no_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputFPONoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputFPONoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "FPO No",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelFPONoSearch",
            type: "text",
            visible: true,
            value: "FPO No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "fpo_no_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBuyerId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBuyerId",
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
            name: "labelBuyerId",
            type: "text",
            visible: false,
            value: "Buyer Id"
        },
        class: ""
    },
    data: {
        sqlcolumn: "buyer_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBuyerCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBuyerCode",
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
            name: "labelBuyerCode",
            type: "text",
            visible: true,
            value: "Buyer Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "buyer_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputBuyerCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBuyerCodeSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Buyer Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelBuyerCodeSearch",
            type: "text",
            visible: true,
            value: "Buyer Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "buyer_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCustomerStyleReference"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCustomerStyleReference",
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
            name: "labelCustomerStyleReference",
            type: "text",
            visible: true,
            value: "Customer Style Reference"
        },
        class: ""
    },
    data: {
        sqlcolumn: "customer_style_reference",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCutRemarks"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCutRemarks",
        placeholder: "",
        type: "text",
        length: 2000,
        showLabel: true,
        visible: true,
        insertable: true,
        searchable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCutRemarks",
            type: "text",
            visible: true,
            value: "Special Remarks"
        },
        class: ""
    },
    data: {
        sqlcolumn: "special_remarks",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCustomerStyleReferenceSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCustomerStyleReferenceSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Customer Style Reference",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCustomerStyleReferenceSearch",
            type: "text",
            visible: true,
            value: "Customer Style Reference"
        },
        class: ""
    },
    data: {
        sqlcolumn: "customer_style_reference_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleId",
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
            name: "labelStyleId",
            type: "text",
            visible: false,
            value: "Style Id"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleCode"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleCode",
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
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Style Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_code",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleCodeSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Style Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleCodeSearch",
            type: "text",
            visible: true,
            value: "Style Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCombineOrderNoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCombineOrderNoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Combine Order No",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelCombineOrderNoSearch",
            type: "text",
            visible: true,
            value: "Combine Order No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "combine_order_no_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCombineOrderId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputCombineOrderId",
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
            name: "labelCombineOrderId",
            type: "text",
            visible: false,
            value: "Combine Order Id"
        },
        class: ""
    },
    data: {
        sqlcolumn: "combine_order_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputCombineOrderNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputCombineOrderNo",
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
            name: "labelCombineOrderNo",
            type: "text",
            visible: true,
            value: "Combine Order No"
        },
        class: ""
    },
    options: [{ value: "", text: "- Select Combine Order No -" }],
    data: {
        sqlcolumn: "combine_order_no",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let grid1Cols = [];

grid1Cols["fpo_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
grid1Cols["soc_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
grid1Cols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
grid1Cols["L"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid1Cols["M"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid1Cols["S"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid1Cols["XL"] = { objectType: "IntegerField", colIndex: 7, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid1Cols["priority_seq"] = { objectType: "IntegerField", colIndex: 8, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: false, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["tolerance"] = { objectType: "IntegerField", colIndex: 8, datatype: "text", name: "tolerance", placeholder: "Tolerance %", editable: true, sqlColumn: "tolerance", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridViewCombineOrder"] = {
    objectType: "Grid",
    schema: {
        name: "gridViewCombineOrder",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridViewCombineOrder",
        name: "gridViewCombineOrder",
        descriptoin: "ViewCombineOrder",
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
    columns: grid1Cols,
    data: [],
    event: {}
}

componentListConfig["tabCutPlan"] = {
    objectType: "Tab",
    schema: {
        name: "tabCutPlan",
        id: "tabCutPlan",
        placeholder: "Tab for Cut Plan",
        type: "nonText",
        role: "tablist",
        visible: true
    },
    items: {
        create: {
            objectType: "TabPage",
            schema: { id: "create-cut-plan", text: "Create Cut Plan", disabled: false },
        },
        view: {
            objectType: "TabPage",
            schema: { id: "view-cut-plan", text: "View Cut Plan", disabled: false },
        }
    },
    event: {}
}

componentListConfig["inputFabricNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputFabricNo",
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
            name: "labelFabricNo",
            type: "text",
            visible: true,
            value: "Fabric No"
        },
        class: ""
    },
    options: [{ value: "", text: "- Select Fabric No -" }],
    data: {
        sqlcolumn: "fabric_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMainFabric"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputMainFabric",
        placeholder: "",
        type: "checkbox",
        label: "Main Fabric",
        checkedValue: "1",
        uncheckedValue: "0",
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
            name: "labelMainFabric",
            type: "text",
            visible: true,
            value: "Main Fabric"
        },
    },
    data: {
        sqlcolumn: "main_fabric",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputShadeWiseBundle"] = {
    objectType: "CheckBox",
    schema: {
        name: "inputShadeWiseBundle",
        placeholder: "",
        type: "checkbox",
        label: "Shade Wise Bundle",
        checkedValue: "1",
        uncheckedValue: "0",
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
            name: "labelShadeWiseBundle",
            type: "text",
            visible: true,
            value: "Shade Wise Bundle"
        },
    },
    data: {
        sqlcolumn: "shade_wise_bundle",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMaxPlies"] = {
    objectType: "IntegerField",
    schema: {
        name: "inputMaxPlies",
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
            name: "labelMaxPlies",
            type: "text",
            visible: true,
            value: "Max Plies"
        },
        class: ""
    },
    data: {
        sqlcolumn: "max_Plies",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let grid2Cols = [];

grid2Cols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
grid2Cols["yrds"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "yrds", placeholder: "Yrds", editable: true, sqlColumn: "yrds", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["inch"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "inch", placeholder: "Inch", editable: true, sqlColumn: "inch", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["accwidth"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "accwidth", placeholder: "Acc Width", editable: true, sqlColumn: "accwidth", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: true, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: true, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: true, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: true, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid2Cols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridLayMarker"] = {
    objectType: "Grid",
    schema: {
        name: "gridLayMarker",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridLayMarker",
        name: "gridLayMarker",
        descriptoin: "LayMarker",
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
    columns: grid2Cols,
    data: [],
    event: {}
}

componentListConfig["buttonCreateCutPlan"] = {
    objectType: "Button",
    schema: {
        id: "buttonCutPlan",
        name: "buttonCutPlan",
        type: "submit",
        label: "Create Cut Plan",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["inputViewFabricNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputViewFabricNo",
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
            name: "labelViewFabricNo",
            type: "text",
            visible: true,
            value: "Fabric No"
        },
        class: ""
    },
    options: [{ value: "", text: "- Select Fabric No -" }],
    data: {
        sqlcolumn: "view_fabric_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonDeleteCutPlan"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteCutPlan",
        name: "buttonDeleteCutPlan",
        type: "submit",
        label: "Delete Cut Plan",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonDeleteCut"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteCut",
        name: "buttonDeleteCut",
        type: "submit",
        label: "Delete Cut ",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["deleteMasterPopUp"] = {
    objectType: "PopUpPage",
    schema: {
        name: "deleteMasterPopUp",
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

componentListConfig["buttonDeleteMasterYes"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteMasterYes",
        name: "buttonDeleteMasterYes",
        type: "submit",
        label: "Yes",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonDeleteMasterNo"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteMasterNo",
        name: "buttonDeleteMasterNo",
        type: "submit",
        label: "No",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["BundleTagPopUp"] = {
    objectType: "BundleTagPopUp",
    schema: {
        name: "BundleTagPopUp",
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
componentListConfig["buttonPrintTag"] = {
    objectType: "Button",
    schema: {
        id: "buttonPrintTag",
        name: "buttonPrintTag",
        type: "submit",
        label: "Print",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonPrintTagCancel"] = {
    objectType: "Button",
    schema: {
        id: "buttonPrintTagCancel",
        name: "buttonPrintTagCancel",
        type: "submit",
        label: "Cancel",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonConsumptionReport"] = {
    objectType: "Button",
    schema: {
        id: "buttonConsumptionReport",
        name: "buttonConsumptionReport",
        type: "submit",
        label: "Consumption Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
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

let grid3Cols = [];

grid3Cols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["cut_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_id", placeholder: "Cut ID", editable: false, sqlColumn: "cut_id", visible:false,  style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid3Cols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid3Cols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid3Cols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
grid3Cols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["Actual_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "actual_plies", placeholder: "Actual Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridCutPlan"] = {
    objectType: "Grid",
    schema: {
        name: "gridCutPlan",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridCutPlan",
        name: "gridCutPlan",
        descriptoin: "CutPlan",
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
    columns: grid3Cols,
    data: [],
    event: {}
}


////////////////////////////////  Report    /////////////////////////////

componentListConfig["inputReportCutNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputReportCutNo",
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
            name: "labelReportCutNo",
            type: "text",
            visible: true,
            value: "Cut No"
        },
        class: ""
    },
    options: [{ value: "", text: "- Select Fabric No -" }],
    data: {
        sqlcolumn: "report_cut_no",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonCutReport"] = {
    objectType: "Button",
    schema: {
        id: "buttonCutReport",
        name: "buttonCutReport",
        type: "submit",
        label: " Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonBundleTag"] = {
    objectType: "Button",
    schema: {
        id: "buttonBundleTag",
        name: "buttonBundleTag",
        type: "submit",
        label: " Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonSaveRemarks"] = {
    objectType: "Button",
    schema: {
        id: "buttonSaveRemarks",
        name: "buttonSaveRemarks",
        type: "submit",
        label: " Save",
        style: { fontSize: "50px" },
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonSaveTolerance"] = {
    objectType: "Button",
    schema: {
        id: "buttonSaveTolerance",
        name: "buttonSaveTolerance",
        type: "submit",
        label: " Save",
        style: { fontSize: "50px" },
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}


let gr4dCols = [];

gr4dCols["heading"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "heading", placeholder: "", editable: false, sqlColumn: "heading", style: { textAlign: "left", minWidth: "600px", width: "600px" } };
gr4dCols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
gr4dCols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
gr4dCols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
gr4dCols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };


componentListConfig["gridTotalQuantity"] = {
    objectType: "Grid",
    schema: {
        name: "gridTotalQuantity",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridTotalQuantity",
        name: "gridTotalQuantity",
        descriptoin: "TotalQuantity",
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
    defaultRowCount: 2,
    columns: gr4dCols,
    data: [
        { "heading": "Total Quantity" },
        { "heading": "Total Quantity With Tolerance " }
    ],
    event: {}
}

componentListConfig["radioCombineBundles"] = {
    objectType: "RadioGroup",
    schema: {
        disabled: false,
        readOnly: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    radioYes: {
        objectType: "Radio",
        schema: {
            id: "radioYes",
            name: "radioCombineBundles",
            type: "radio",
            value: "bundleID",
            visible: true,
            disabled: false,
            readOnly: false,

            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class: "",
        event: {}
    },
    radioNo: {
        objectType: "Radio",
        schema: {
            id: "radioNo",
            name: "radioCombineBundles",
            type: "radio",
            value: "size",
            visible: true,
            disabled: false,
            readOnly: false,
            dataSourceController: componentListConfig["CONTROL_CENTER"]
        },
        class: "",
        event: {}
    },
    data: {
        sqlcolumn: "report_type",
        value: ""
    },
    event: {}
}

componentListConfig["buttonBundleTagNew"] = {
    objectType: "Button",
    schema: {
        id: "buttonBundleTagNew",
        name: "buttonBundleTagNew",
        type: "submit",
        label: " Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonBundleDetails"] = {
    objectType: "Button",
    schema: {
        id: "buttonBundleDetails",
        name: "buttonBundleDetails",
        type: "submit",
        label: " Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["buttonNumbering"] = {
    objectType: "Button",
    schema: {
        id: "buttonNumbering",
        name: "buttonNumbering",
        type: "submit",
        label: " Report",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["inputUploadRatioPlan"] = {
    objectType: "TextBox",
    schema: {
        name: "inputUploadRatioPlan",
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
            name: "labelUploadRatioPlan",
            type: "text",
            visible: true,
            value: "Upload Ratio Plan"
        },
        class: ""
    },
    data: {
        sqlcolumn: "ratio_plan",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["buttonUploadRatioPlan"] = {
    objectType: "Button",
    schema: {
        id: "buttonUploadRatioPlan",
        name: "buttonUploadRatioPlan",
        type: "submit",
        label: "Save",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

export default componentListConfig