
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
            value: "Marker Plan"
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
        searchable: false,
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

componentListConfig["inputMaxPlies"] = {
    objectType: "TextBox",
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
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Max Plies"
        },
        class: ""
    },
    data: {
        sqlcolumn: "max_plies",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputMaxLength"] = {
    objectType: "TextBox",
    schema: {
        name: "inputMaxLength",
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
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Max Length"
        },
        class: ""
    },
    data: {
        sqlcolumn: "max_length",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}
componentListConfig["inputConsumption"] = {
    objectType: "TextBox",
    schema: {
        name: "inputConsumption",
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
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Consumption"
        },
        class: ""
    },
    data: {
        sqlcolumn: "consumption",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputFabric"] = {
    objectType: "TextBox",
    schema: {
        name: "inputFabric",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        searchable: false,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleCode",
            type: "text",
            visible: true,
            value: "Fabric"
        },
        class: ""
    },
    data: {
        sqlcolumn: "fabric",
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
        searchable: true,
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

componentListConfig["inputStyleDescriptionSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleDescriptionSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Style Description",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleDescriptionSearch",
            type: "text",
            visible: true,
            value: "Style Description"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_description_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

componentListConfig["inputStyleRouteCodeSearch"] = {
    objectType: "TextBox",
    schema: {
        name: "inputStyleRouteCodeSearch",
        placeholder: "",
        type: "text",
        length: 100,
        showLabel: true,
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        advanceSearch: true,
        labelValue: "Route Code",
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelStyleRouteCodeSearch",
            type: "text",
            visible: true,
            value: "Route Code"
        },
        class: ""
    },
    data: {
        sqlcolumn: "style_route_code_search",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}

let grid1Cols = [];

grid1Cols["size"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "size", placeholder: "Size", editable: false, sqlColumn: "size", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
grid1Cols["qty"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "qty", placeholder: "QTY", editable: false, sqlColumn: "qty", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

componentListConfig["gridSizeFitJson"] = {
    objectType: "Grid",
    schema:{
        name: "gridSizeFitJson",
        visible: true,
        insertable: true,
        updateAllowed: true,
        mandetory: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    controller: {
        id: "gridSizeFitJson",
        name: "gridSizeFitJson",
        descriptoin: "SizeFitJson",
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


let columns =[

    {title: 'L',type: 'numeric',additional_type:'integer',data: 'L',editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:100},
    {title: 'M',type: 'numeric',additional_type:'integer',data: 'M',editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:100},
    {title: 'S',type: 'numeric',additional_type:'integer',data: 'S',editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:100},
    {title: 'XL',type: 'numeric',additional_type:'integer',data: 'XL',editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:100},

];

let data =[];
componentListConfig["gridMarkerRatio"] = {
    objectType: "gridMarkerRatio",
    schema:{
        name: "gridMarkerRatio",
        filters:true,
        sorting: true,
        dataSourceController: componentListConfig["CONTROL_CENTER"]
    },
    defaultRowCount: 3,
    columns: columns,
    data: data,
    name:"gridMarkerRatio",
    event: {}
}

componentListConfig["inputType"] = {
    objectType: "DropDown",
    schema: {
        name: "inputType",
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
            name: "labelType",
            type: "text",
            visible: true,
            value: "Type"
        },
        class: ""
    },
    options: [{ value: "", text: "Select Type" },{ value: 1, text: "Max Qty Marker" },{ value: 2, text: "Max Length Marker" }],
    data: {
        sqlcolumn: "type",
        oldValue: "",
        value: ""
    },
    class: "",
    event: {}
}







export default componentListConfig