import React, { useEffect, useState } from 'react';
import { generateMrnDisplay } from './MrnDS';
import config from './MrnCS';
import API from '../../../api/API';

const Mrn = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    
    // Button Events
    config["buttonNew"].event.onClick = handleNew;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["buttonAddToGrid"].event.onClick = handleAddToGrid;
    config["buttonFinalize"].event.onClick = handleFinalize;
    config["buttonFinalizeYes"].event.onClick = handleFinalizeYes;
    config["buttonFinalizeNo"].event.onClick = handleFinalizeNo;
    config["buttonReopen"].event.onClick = handleReopen;
    config["buttonReopenYes"].event.onClick = handleReopenYes;
    config["buttonReopenNo"].event.onClick = handleReopenNo;

    config["buttonPrint"].event.onClick = handleInvoicePrint;
    
    // Advance Search
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        __getWarehouses();
        __getBatches();
        __getMaterials();
    }, []);

    useEffect(() => {
        

        // Only auto-collapse sidebar on small screens (< 992px)
        if (window.innerWidth < 992) {
            // Click the sidebar toggle button so Sidebar's internal state stays in sync
            const toggleBtn = document.getElementById('sidebarToggle');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
        
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "mrn" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            // Set read-only mode if needed
        }
    }

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    function handleNew() {
        // Clear all fields
        config["inputMrnID"].setValue("");
        config["inputStatus"].setValue("");
        config["inputWarehouse"].setValue("");
        config["inputBatch"].setValue([]);
        config["inputMaterial"].setValue([]);
        config["inputQuantity"].setValue("");
        
        // Clear grid
        config["gridMaterials"].setData([]);
        
        // Hide finalize and reopen buttons
        config["buttonFinalize"].schema.visible = false;
        config["buttonReopen"].schema.visible = false;
        
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = true;
        
        reRender();
    }

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            if(!(config["inputStatus"].data.value == "" || config["inputStatus"].data.value == "open")){
                config["CONTROL_CENTER"].promptWarningMessage("Updates are allowed only for open MRNs.", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            // Validate warehouse selection
            const warehouseId = config["inputWarehouse"].data.value;
            const batch = config["inputBatch"].getValue() || [];
            if (!warehouseId) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a warehouse", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            if (batch.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a batch", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            
            // Get grid data
            const materials = config["gridMaterials"].data;
            if (!materials || materials.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please add at least one material to the grid", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            
            //get Remarks
            const remarks = config["inputRemark"].data.value;
            if(remarks && remarks !== ""){
                if(remarks.length > 250){
                    config["CONTROL_CENTER"].promptWarningMessage("Remarks cannot exceed 250 characters", "");
                    document.getElementById("spinner").style.display = "none";
                    return;
                }
            }else{
                config["CONTROL_CENTER"].promptWarningMessage("Please enter remarks", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            // Prepare payload
            const mrnId = config["inputMrnID"].data.value;
            const status = config["inputStatus"].data.value || "open";
            const apiRequest = {
                mrn_id: mrnId,
                warehouse_id: warehouseId,
                status: status,
                batch_id: batch[0],
                issued_to: String(remarks),
                mrn_details: materials.map(material => ({
                    stock_item_id: material.material_id,
                    qty: material.quantity,
                    id: material.mrn_detail_id || "",
                    status:material._rowstate
                }))
            };
            
            // Call API to save MRN
            let response = await API.post(`mrns/createAndUpdate`, apiRequest);

            document.getElementById("spinner").style.display = "none";

            if (response.status === 200 || response.status === 201) {
                const mrnData = response.data.data;
                
                await formPopulate(mrnData.id);
                
                config["CONTROL_CENTER"].promptBaseMessage("MRN saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                
                // Show finalize button for open status
                config["buttonFinalize"].schema.visible = true;
                config["buttonReopen"].schema.visible = false;
                
                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to save MRN", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error saving MRN");
        }
    }

    function handleAddToGrid() {
        // Get values from multiselects
        
        const selectedMaterials = config["inputMaterial"].getSelectedArray() || [];
        const quantity = config["inputQuantity"].data.value;
      
        
        if (selectedMaterials.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select  material", "");
            return;
        }
        
        if (!quantity || quantity === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please enter quantity", "");
            return;
        }
        
        if (quantity === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Quantity cannot be zero", "");
            return;
        }
        
        let newRows ={
            
            material_id: selectedMaterials[0].id,
            material_name: selectedMaterials[0].name,
            quantity: quantity,
            mrn_detail_id: "" 
        }
        
         config["gridMaterials"].addRow(newRows);
            
            // Clear selection fields
            
            config["inputMaterial"].setValue([]);
            config["inputQuantity"].setValue("");
    }

    function handleFinalize() {
        // Validate MRN exists
        const mrnId = config["inputMrnID"].data.value;
        if (!mrnId) {
            config["CONTROL_CENTER"].promptWarningMessage("Please save the MRN first", "");
            return;
        }
        
        // Check status
        const status = config["inputStatus"].data.value;
        if (status !== "open") {
            config["CONTROL_CENTER"].promptWarningMessage("Only open MRNs can be finalized", "");
            return;
        }
        
        // Show confirmation popup
        config["finalizePopUp"].showPopUp();
    }

    async function handleFinalizeYes() {
        const mrnId = config["inputMrnID"].data.value;
      
        
        try {
            config["finalizePopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";
            if(config['CONTROL_CENTER'].state.populated == true){
                let response = await API.post(`mrns/finalize`, { mrn_id: mrnId });
                
                document.getElementById("spinner").style.display = "none";
                
                if (response.status === 200) {
                    config["CONTROL_CENTER"].promptBaseMessage("MRN finalized successfully", "");
                    
                    // Update status
                    config["inputStatus"].setValue("finalized");
                    
                    // Update button visibility
                    config["buttonFinalize"].schema.visible = false;
                    config["buttonReopen"].schema.visible = true;
                    
                    config["CONTROL_CENTER"].state.modified = false;
                    

                    
                    reRender();
                }

            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Please Save Changes First", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error finalizing MRN");
        }
    }

    function handleFinalizeNo() {
        config["finalizePopUp"].closePopUp();
    }

    function handleReopen() {
        // Validate MRN exists
        const mrnId = config["inputMrnID"].data.value;
        if (!mrnId) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select an MRN first", "");
            return;
        }
        
        // Check status
        const status = config["inputStatus"].data.value;
        if (status !== "finalized") {
            config["CONTROL_CENTER"].promptWarningMessage("Only finalized MRNs can be re-opened", "");
            return;
        }
        
        // Show confirmation popup
        config["reopenPopUp"].showPopUp();
    }

    async function handleReopenYes() {
        const mrnId = config["inputMrnID"].data.value;
        
        try {
            config["reopenPopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";
            
            let response = await API.post(`mrns/reopen`, { mrn_id: mrnId });
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                config["CONTROL_CENTER"].promptBaseMessage("MRN re-opened successfully", "");
                
                // Update status
                config["inputStatus"].setValue("open");
                
                // Update button visibility
                config["buttonFinalize"].schema.visible = true;
                config["buttonReopen"].schema.visible = false;
                
                config["CONTROL_CENTER"].state.modified = false;
                
                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to re-open MRN", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error re-opening MRN");
        }
    }

    function handleReopenNo() {
        config["reopenPopUp"].closePopUp();
    }

    // async function handleAdvanceSearchPopup() {
    //     try {
    //         document.getElementById("spinner").style.display = "";
    //         let response = await API.get(`mrns`);
    //         document.getElementById("spinner").style.display = "none";
            
    //         if (response.status === 200) {
    //             // Map response data to grid columns
    //             const gridData = response.data.map(mrn => ({
    //                 mrn_id: mrn.mrn_id || mrn.id,
    //                 warehouse_name: mrn.warehouse_name,
    //                 status: mrn.status,
    //                 created_date: mrn.created_date || ""
    //             }));
                
    //             config["CONTROL_CENTER"].setOptions(JSON.stringify(gridData));
    //         } else {
    //             config["CONTROL_CENTER"].promptWarningMessage("Failed to load MRNs", "");
    //         }
    //     } catch (error) {
    //         document.getElementById("spinner").style.display = "none";
    //         handleError(error, "Error loading MRNs");
    //     }
    // }

    async function handleAdvanceSearchPopup() {
            let data = [];
            const getData = await __getAll();
    
            if (getData && getData !== "Error" && getData[0].Mrn.length > 0) {
                const listData = getData[0].Mrn;
                listData.forEach((value, index) => {
                    
                    data.push({
                        "mrn_id_search": value.id,
                        "batch_no_search": value.batch.batch_no,
                        "model_search": value.batch.model.name,
                        "warehouse_search": value.warehouse.name,
                        "status_search": value.status,
                        "issued_to_search": value.issued_to
                    })
                });
            }
    
            console.log("*******All Data********");
            console.log(data);
    
            let msg = "";
            if (data.length > 20) {
                msg = "Only 20 records are loaded. Please narrow your search";
                data = data.slice(0, 20);
            }
    
            config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
        }
    
        async function __getAll() {
            try {
                const key = "Mrn";
                const distinct = false;
                const select = ["*"];
                const where = [{"active":true}];
                const orderby = "created_at:desc";
                const limit = 25;
                const relations = [
                    "batch",
                    "batch.model",
                    "warehouse",
                ];

    
                const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);
    
                return data;
    
            } catch (error) {
                console.log("***********GetAll Error**********");
                console.log(error.response);
                return "Error";
            }
        }
    
        async function __getDetails(key, distinct, select, where, relations, orderby, limit) {
            try {
                const apiRequest = {
                    [key]: {
                        "distinct": distinct,
                        "select": select,
                        "where": where,
                        "relations": relations,
                        "orderby": orderby,
                        "limit": limit
                    }
                };
    
                const getDetails = await API.post(`searchByParameters`, apiRequest);
                const details = getDetails.data;
    
                return details;
    
            } catch (error) {
                console.log("***********GetDetails Error**********");
                console.log(error.response);
                return "Error";
            }
        }

        async function handleAdvanceSearch(event, searchCriteria, callback) {
            console.log("*******Search Criteria********");
            console.log(searchCriteria);
    
            let data = [];
            let searchDetails = await __getAdvanceSearchDetails(searchCriteria);
    
            if (searchDetails.length > 0) {
                searchDetails.forEach((value, index) => {
                    data.push({
                        "mrn_id_search": value.id,
                        "batch_no_search": value.batch_no,
                        "model_search": value.model_name,
                        "warehouse_search": value.warehouse_name,
                        "status_search": value.status,
                        "issued_to_search": value.issued_to
                    }) })
                ;
            }
    
            console.log("*******Search Results********");
            console.log(data);
    
            let msg = "";
            if (data.length > 20) {
                msg = "Only 20 records are loaded. Please narrow your search";
                data = data.slice(0, 20);
            }
    
            callback(data, msg);
        }
    
            // Get Advance Search Details
        async function __getAdvanceSearchDetails(searchCriteria) {
                try {
                    const apiRequest = {
                        
                            "id": searchCriteria.mrn_id_search === "" ? "%" : searchCriteria.mrn_id_search,
                            "batch_no": searchCriteria.batch_no_search === "" ? "%" : searchCriteria.batch_no_search,
                            "model_name": searchCriteria.model_search === "" ? "%" : searchCriteria.model_search,
                            "warehouse_name": searchCriteria.warehouse_search === "" ? "%" : searchCriteria.warehouse_search,
                            "status": searchCriteria.status_search === "" ? "%" : searchCriteria.status_search,
                            "issued_to": searchCriteria.issued_to_search === "" ? "%" : searchCriteria.issued_to_search
                        
                    };
                    const getSearchDetails = await API.post(`mrns/getSearchByMrn`, apiRequest);
                    const details = getSearchDetails.data.data;
        
                    return details;
        
                } catch (error) {
                    console.log("***********GetDetails Error**********");
                    console.log(error.response);
                    return "Error";
                }
            }

    async function handleAdvanceSearchDone(event, selectedRow){
        const id = selectedRow.mrn_id_search;
        await formPopulate(id);

    }

    async function formPopulate(mrnId) {
        try {
            document.getElementById("spinner").style.display = "";
            let response = await API.get(`mrns/${mrnId}`);
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                const mrnData = response.data.data;
                 
                // Populate header fields
                config["inputMrnID"].data.value =mrnData.id;
                config["inputStatus"].setValue(mrnData.status);
                config["inputRemark"].setValue(mrnData.issued_to);
                config["inputWarehouse"].setValue(mrnData.warehouse_id);
                let selectBAtch = {id:mrnData.batch_id,name:mrnData.batch.batch_no}
                config["inputBatch"].setValue([selectBAtch]);
                
                // Populate grid with materials
                let rows = [];
                mrnData.details.forEach(element => {
                    rows.push({
                        mrn_detail_id: element.id,
                        material_id: element.stock_item_id,
                        material_name: element.stock_item.name,
                        quantity: element.qty
                    });
                });
                config["gridMaterials"].setData(rows);
                
                // Set button visibility based on status
                if (mrnData.status === "open") {
                    config["buttonFinalize"].schema.visible = true;
                    config["buttonReopen"].schema.visible = false;
                } else if (mrnData.status === "finalized") {
                    config["buttonFinalize"].schema.visible = false;
                    config["buttonReopen"].schema.visible = true;
                } else {
                    config["buttonFinalize"].schema.visible = false;
                    config["buttonReopen"].schema.visible = false;
                }
                
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                config['CONTROL_CENTER'].state.populated = true;
                
                reRender();
                config["CONTROL_CENTER"].promptBaseMessage("MRN loaded successfully", "");
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to load MRN", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error loading MRN");
        }
    }

    // Load dropdown options
    async function __getWarehouses() {
        try {
            let response = await API.get(`warehouses`);
            
            if (response.status === 200) {
                const warehouses = response.data.map(warehouse => ({
                    value: warehouse.warehouse_id || warehouse.id,
                    text: warehouse.warehouse_name || warehouse.name
                }));
                
                warehouses.unshift({ value: "", text: "Select Warehouse" });
                config["inputWarehouse"].setOptions(warehouses);
                

            }
        } catch (error) {
            handleError(error, "Error loading warehouses");
        }
    }

    async function __getBatches() {
        try {
            let response = await API.get(`Batch/getBatches`);
            
            if (response.status === 200) {
                const batches = response.data.map(batch => ({
                    id: batch.batch_id || batch.id,
                    name: batch.batch_no || batch.batch_name
                }));
                
                config["inputBatch"].setOptions(batches);
            }
        } catch (error) {
            handleError(error, "Error loading batches");
        }
    }

    async function __getMaterials() {
        try {
            let response = await API.get(`stock-materials`);
            
            if (response.status === 200) {
                const materials = response.data.map(material => ({
                    id: material.material_id || material.id,
                    name: material.code +" ( "+ material.name+ " )"
                }));
                
                config["inputMaterial"].setOptions(materials);
            }
        } catch (error) {
            handleError(error, "Error loading materials");
        }
    }

    function handleError(error, defaultMessage) {
        
        try {
            if (error.response) {
                if (error.response.data && error.response.data.message) {
  
                    if(Object.keys(error.response.data.message).length > 0){
                        
                    config["CONTROL_CENTER"].promptWarningMessage("Please contact supporting team", "");
                    
                }else{
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.data.message, "");
                }

                    
                } else if (error.response.statusText) {
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.statusText, "");
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An error occurred", "");
                }
            } else if (error.message) {
                if(Array.isArray(error.message) && error.message.length > 0){
                    config["CONTROL_CENTER"].promptWarningMessage("Please contact supporting team", "");
                    return;
                }else{
                    config["CONTROL_CENTER"].promptWarningMessage(error.message, "");
                }
                
            } else {
                config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An unexpected error occurred", "");
            }
        } catch (err) {
            console.error("Error in handleError:", err);
            config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An unexpected error occurred", "");
        }
    }

    async function handleInvoicePrint(){
        try {
            const mrn_id = config["inputMrnID"].data.value;
            const status = config["inputStatus"].data.value;
    
            if (mrn_id !== "" && status !== "open") {
                const apiRequest = {
                    "id" : mrn_id
                }
                document.getElementById("spinner").style.display = "";
                const printBundleTagReport = await API.post(`mrns/getMrnPrint`, apiRequest,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/pdf'
                        }
                    });
                document.getElementById("spinner").style.display = "none";
    
                console.log("********printTrimsReport*********");
                console.log(printBundleTagReport);
                
                if (printBundleTagReport && printBundleTagReport.data !== null) {
                    config["printPdfPopUp"].showPopUp();
                    let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
                    let blobUrl = window.URL.createObjectURL(blob);
                    document.getElementById("pdfviewer").setAttribute('src', blobUrl);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                }
    
            } else {
                if (mrn_id === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select MRN", "");
                } else if (status === "open") {
                    config["CONTROL_CENTER"].promptWarningMessage("MRN is still open", "");
                }
            }
    
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            // console.log(error);
            try {
                if (error.response.data.message) {
                    try {
                        let errors = [];
    
                        Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
                            data.forEach(error => errors.push(error));
                        });
    
                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    } catch (error) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
                    }
                }
            } catch (error) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
            }
    
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } 
    }

    return generateMrnDisplay(config);
}

export default Mrn;
