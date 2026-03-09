import React, { useEffect, useState } from 'react';
import { generateBuyerDisplay } from './BatchDS';
import config from './BatchCS';
import API from '../../../api/API';

const Buyer = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config['inputModel'].event.onSelect = handleSelectModel;

    config["CONTROL_CENTER"].event.onSave = handleSave;

    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    config["buttonDelete"].event.onClick = handleDelete;

    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/







    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load 
    useEffect(async() => {
       // __checkIsAuthorized();
       __setFormReadWrite(true);
         await __getModels();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "Batch" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {

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

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const id = config['inputBatchID'].data.value;
            const batch_no = config['inputBatchNo'].data.value;
            const model = config['inputModel'].getValue(); // Assuming this returns an array of selected models

            const qtyData = config['gridSize'].data; // Assuming this returns an array of size and quantity objects
            let qty_json = {};
            qtyData.forEach(item => {
                qty_json[item.size] = item.quantity > 0 ? item.quantity : 0; // Ensure quantity is not negative
            });

            // Validations 
            if (!batch_no || batch_no.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Batch No is required", "");
                return;
            }
            if(model.length === 0){
                config["CONTROL_CENTER"].promptWarningMessage("Please Select the Model", "");
                return;
            }

           
            // Prepare API request
            const apiRequest = {
                id: parseInt(id),
                batch_no: batch_no,
                qty_json: qty_json,
                model_id: model[0]
            };

            // Call API based on whether it's create or update
            let response = await API.post(`Batch/createAndUpdateBatch`, apiRequest);

            if (response.status === 200 || response.status === 201) {
               
                if (!id || id == "") {
                    config['inputBatchID'].setValue(response.data.data.id);
                }
                config["CONTROL_CENTER"].promptBaseMessage("Batch saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
               
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving Batch", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleDelete() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const id = config['inputBatchID'].data.value;
            
            // Validations 
            if (!id || id === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Batch ID is required", "");
                return;
            }


           
            // Prepare API request
            const apiRequest = {
                id: parseInt(id),
            };

            // Call API based on whether it's create or update
            let response = await API.post(`Batch/deleteBatch`, apiRequest);

            if (response.status === 200 || response.status === 201) {

                config["CONTROL_CENTER"].promptBaseMessage("Batch Deleted successfully", "");
                config['inputBatchID'].setValue("");
                config['inputBatchNo'].setValue("");
                config['inputModel'].setValue([{}]);
                config['gridSize'].setData([]);
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                config["CONTROL_CENTER"].state.deleted = true;
               
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in deleting Batch", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function __getModels(){
        try{

            const statusData = await API.get(`models`)
            
            let models = [];
            statusData.data.forEach((value, index) => {
                models.push({
                    "id":value.id,
                    "name":value.name
                })
            });

            config['inputModel'].setOptions(models);
    
            


        }catch(err){
            console.log(err);
            // toast.error(`Something went wrong`+err)
        }
    }

    async function handleSelectModel(selectedList, selectedItem){
        
        let model_id = selectedItem.id;

        try{

            const Data = await API.get(`models/${model_id}`)
            const sizeJson = Data.data.sizes || [];

            let sizeRows = [];
            sizeJson.forEach((value, index) => {

                sizeRows.push({
                    "size": value,
                    "quantity": ""
                })
            });
            console.log(sizeRows);
            config['gridSize'].setData(sizeRows);
            

        }catch(err){
            console.log(err);
            // toast.error(`Something went wrong`+err)
        }

    }


    function handleError(error) {
        try {
            if (error.response && error.response.data && error.response.data.message) {
                try {
                    let errors = [];
                    const errorData = typeof error.response.data.message === 'string'
                        ? JSON.parse(error.response.data.message)
                        : error.response.data.message;

                    Object.entries(errorData).forEach(([index, data]) => {
                        if (Array.isArray(data)) {
                            data.forEach(error => errors.push(error));
                        } else {
                            errors.push(data);
                        }
                    });

                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    return;
                } catch (parseError) {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message || "Please Contact System Administrator");
                    return;
                }
            } else if (error.response && error.response.data && error.response.data.errors) {
                // Laravel validation errors format
                let errors = [];
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    messages.forEach(msg => errors.push(msg));
                });
                config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                return;
            }
        } catch (err) {
            console.log(err);
        }

        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    }




//////////////////////////////////////////////////////////////////////
//                      ADVANCE SEARCH APIs                         //
//////////////////////////////////////////////////////////////////////

    async function handleAdvanceSearchPopup() {
            let data = [];
            const getData = await __getAll();
    
            if (getData && getData !== "Error" && getData[0].Batch.length > 0) {
                const listData = getData[0].Batch;
                listData.forEach((value, index) => {
                    
                    data.push({
                        "batch_id_search": value.id,
                        "batch_no_search": value.batch_no,
                        "model_search": value.model.name
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
                const key = "Batch";
                const distinct = false;
                const select = ["*"];
                const where = [{"active":true}];
                const orderby = "created_at:desc";
                const limit = 25;
                const relations = [
                    "model"
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
                        "batch_id_search": value.id,
                        "batch_no_search": value.batch_no,
                        "model_search": value.model_name
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
                        
                            "id": searchCriteria.batch_id_search === "" ? "%" : searchCriteria.batch_id_search,
                            "batch_no": searchCriteria.batch_no_search === "" ? "%" : searchCriteria.batch_no_search,
                            "model_name": searchCriteria.model_search === "" ? "%" : searchCriteria.model_search
                        
                    };
                    const getSearchDetails = await API.post(`Batch/getSearchByBatch`, apiRequest);
                    const details = getSearchDetails.data.data;
        
                    return details;
        
                } catch (error) {
                    console.log("***********GetDetails Error**********");
                    console.log(error.response);
                    return "Error";
                }
            }
    
    async function handleAdvanceSearchDone(event, selectedRow){
        const id = selectedRow.batch_id_search;
        const name = selectedRow.batch_no_search;
        const mobile = selectedRow.model_search;
        
            
        
        await formPopulate(id);

    }

    async function formPopulate(id){
        try {
            document.getElementById("spinner").style.display = "";
            // Prepare API request
            const apiRequest = {
                id: parseInt(id),
            };

            // Call API based on whether it's create or update
            let response = await API.post(`Batch/getBatchById`, apiRequest);

            if (response.status === 200 || response.status === 201) {
                
                let batchData = response.data.data;
                config['inputBatchID'].setValue(batchData.id);
                config['inputBatchNo'].setValue(batchData.batch_no);
                config['inputModel'].setValueByID(batchData.model_id);

                 const sizeJson = batchData.qty_json || {};
                 let gridRows = [];

                 if (Array.isArray(sizeJson)) {
                    sizeJson.forEach((value) => {
                        if (value && typeof value === "object") {
                            gridRows.push({
                                "size": value.size || "",
                                "quantity": value.quantity || 0
                            });
                        }
                    });
                 } else {
                    Object.entries(sizeJson).forEach(([size, quantity]) => {
                        gridRows.push({
                            "size": size,
                            "quantity": quantity || 0
                        });
                    });
                 }

                 config['gridSize'].setData(gridRows);
                config["CONTROL_CENTER"].state.populate = true;
               
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in fetching Batch details", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }



  





    

    return generateBuyerDisplay(config)
}

export default Buyer;