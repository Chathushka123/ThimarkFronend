let componentListConfig = [];

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formReasonsMaster",
        name: "formReasonsMaster",
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
            name: "labelReasonsMaster",
            type: "text",
            visible: true,
            value: "Reject / Rework Reasons"
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
