let componentListConfig = [];

componentListConfig["CONTROL_CENTER"] = {
    objectType: "Controller",
    schema: {
        id: "formBundleTicketAudit",
        name: "formBundleTicketAudit",
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
            name: "labelBundleTicketAudit",
            type: "text",
            visible: true,
            value: "Delete Scanned Bundles"
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
