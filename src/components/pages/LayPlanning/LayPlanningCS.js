
let componentListConfig = []

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formLayPlanning",
        name: "formLayPlanning",
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
            name: "labelLayPlanning",
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

componentListConfig["inputId"] = {
    objectType: "TextBox",
    schema: {
        name: "inputId",
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
            name: "labelId",
            type: "text",
            visible: false,
            value: "ID"
        },
    },
    data: {
        sqlcolumn: "id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

/* componentListConfig["inputOcNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputOcNo",
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
            name: "labelOcNo",
            type: "text",
            visible: true,
            value: "OC No"
        },
        class: ""
    },
    options: [],
    data: {
        sqlcolumn: "oc_id",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
} */

componentListConfig["lovComboBoxOc"] = {
    objectType: "LovComboBox",
    schema: {
        name: "lovComboBoxOc",
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
            name: "labellovComboBoxOc",
            type: "text",
            visible: true,
            value: "OC No"
        },
        class: ""
    },
    options:[],
    data: {
        sqlcolumn: "oc_id",
        oldValue: "",
        value: "",
        id: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputOcNoSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputOcNoSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "OC No",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelOcNoSearch",
            type: "text",
            visible: true,
            value: "OC No"
        },
        class: ""
    },
    data: {
        sqlcolumn: "oc_no",
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
        advanceSearch: true,
        labelValue: "Buyer Code",
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

componentListConfig["inputBuyerDepartment"] = {
    objectType: "TextBox",
    schema: {
        name: "inputBuyerDepartment",
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
            name: "labelBuyerDepartment",
            type: "text",
            visible: true,
            value: "Buyer Department"
        },
        class: ""
    },
    data: {
        sqlcolumn: "buyer_department",
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
        advanceSearch: true,
        labelValue: "Style Code",
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

componentListConfig["inputPackColor"] = {
    objectType: "TextBox",
    schema: {
        name: "inputPackColor",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Pack Color",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelPackColor",
            type: "text",
            visible: true,
            value: "Pack Color"
        },
        class: ""
    },
    data: {
        sqlcolumn: "pack_color",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputNoOfLaySheetsCreated"] = {
    objectType: "TextBox",
    schema: {
        name: "inputNoOfLaySheetsCreated",
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
            name: "labelNoOfLaySheetsCreated",
            type: "text",
            visible: true,
            value: "No Of Lay Sheets Created"
        },
        class: ""
    },
    data: {
        sqlcolumn: "lay_sheets_count",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["tabLaySheet"] = {
    objectType: "Tab",
    schema: {
        name: "tabLaySheet",
        id: "tabLaySheet",
        placeholder: "Tab for Lay Sheet",
        type: "nonText",
        role: "tablist",
        visible: true
    },
    items: {
        tab1: {
            objectType: "TabPage",
            schema: { id: "create-lay-sheet", text: "Create Lay Sheet", disabled: false },
        },
        tab2: {
            objectType: "TabPage",
            schema: { id: "view-lay-sheets", text: "View Created Lay Sheet", disabled: false },
        }
    },
    event: {}
}

componentListConfig["selectorFPO"] = {
    objectType: "DualStateSelector",
    schema: {
        name: "selectorFPO",
        placeholder: "FPO",
        type: "nonText",
        visible: true
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelSelectorFPO",
            type: "text",
            visible: true,
            value: "FPO"
        },
    },
    items: [],
    event: {}
}

let gridCols = [];

gridCols["fpo_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_id", placeholder: "FPO ID", visible:false, editable: false, sqlColumn: "fpo_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
gridCols["L"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["M"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["S"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["XL"] = { objectType: "IntegerField", colIndex: 7, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
gridCols["priority_seq"] = { objectType: "IntegerField", colIndex: 8, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: true, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridLayPlanning"] = {
    objectType: "Grid",
    schema:{
        name: "gridLayPlanning",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridLayPlanning",
        name: "gridLayPlanning",
        descriptoin: "LayPlanning",
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
    columns: gridCols,
    data: [],
    event: {}
}

let grid1Cols = [];
        
grid1Cols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
grid1Cols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: true, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: true, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: true, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: true, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridLayMarker"] = {
    objectType: "Grid",
    schema:{
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
    columns: grid1Cols,
    data: [],
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

componentListConfig["buttonCreateLaySheet"] = {
    objectType: "Button",
    schema: {
        id: "buttonCreateLaySheet",
        name: "buttonCreateLaySheet",
        type: "submit",
        label: "Create Lay Sheet",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

componentListConfig["inputLaySheetNo"] = {
    objectType: "DropDown",
    schema: {
        name: "inputLaySheetNo",
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
            name: "labelLaySheetNo",
            type: "text",
            visible: true,
            value: "Lay Sheet No"
        },
        class: ""
    },
    options: [{ value: "", text: "- Select Lay Sheet No -" }],
    data: {
        sqlcolumn: "lay_sheet_no",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let grid2Cols = [];
        
grid2Cols["fpo_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid2Cols["soc_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridFpo"] = {
    objectType: "Grid",
    schema:{
        name: "gridFpo",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridFpo",
        name: "gridFpo",
        descriptoin: "FPO",
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
    columns: grid2Cols,
    data: [],
    event: {}
}

componentListConfig["buttonDeleteLaySheet"] = {
    objectType: "Button",
    schema: {
        id: "buttonDeleteLaySheet",
        name: "buttonDeleteLaySheet",
        type: "submit",
        label: "Delete Lay Sheet",
        disabled: false,
        visible: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    event: {}
}

let grid3Cols = [];
        
grid3Cols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid3Cols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridCutting"] = {
    objectType: "Grid",
    schema:{
        name: "gridCutting",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridCutting",
        name: "gridCutting",
        descriptoin: "Cutting",
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
    columns: grid3Cols,
    data: [],
    event: {}
}

export default componentListConfig