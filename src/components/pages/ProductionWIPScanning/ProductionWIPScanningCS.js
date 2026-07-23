let componentListConfig = [];

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formProductionWIPScanning",
        name: "formProductionWIPScanning",
        controllerObject: componentListConfig,
        create: false,
        createAPI: "",
        read: false,
        readAPI: "",
        update: false,
        updateAPI: "",
        delete: false,
        deleteAPI: ""
    },
    label: {
        objectType: "Label",
        schema: {
            name: "labelProductionWIPScanning",
            type: "text",
            visible: true,
            value: "Production WIP Scanning"
        }
    },
    state: {
        populated: false,
        modified: false,
        deleted: false,
        new: false
    },
    actions: {
        save: "",
        delete: "",
        populate: "",
        refresh: ""
    },
    event: {}
};

export default componentListConfig;
