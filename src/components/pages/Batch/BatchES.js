import React, { useEffect, useState } from 'react';
import { generateBatchDisplay } from './BatchDS';
import config from './BatchCS';
import API from '../../../api/API';

const Batch = () => {
    let [rendered, setRendered] = useState(true);
    let [models, setModels] = useState([]);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config['inputMainModel'].event.onSelect = handleSelectModel;
    config['inputQty'].event.onEnterKey = handleBulkQtyEnter;

    config["CONTROL_CENTER"].event.onNew = handleNew;
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
    useEffect(async () => {
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

    function resetInputForm() {
        config['inputBatchID'].setValue("");
        config['inputBatchNo'].setValue("");
        config['inputMainModel'].setValue([]);
        config['inputQty'].setValue("");
        config['gridSize'].setData([]);
        updateMainModelDisabledState();
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
        config["CONTROL_CENTER"].state.deleted = true;
        reRender();
    }

    // The main model can only be chosen once per batch - once its models
    // have been added to the grid, changing it would leave rows from the
    // old main model sitting alongside a new selection, so it's locked
    // until the grid is cleared (Delete or New).
    function updateMainModelDisabledState() {
        const gridLength = (config['gridSize'].data || []).length;
        if (typeof config['inputMainModel'].setDesabled === 'function') {
            config['inputMainModel'].setDesabled(gridLength > 0);
        }
    }

    function handleNew() {
        config['gridSize'].setData([]);
        config['inputQty'].setValue("");
        updateMainModelDisabledState();
        return {};
    }

    // Bulk-fills every row's quantity in gridSize with whatever's in
    // inputQty - fires on Enter so the user doesn't need a separate button.
    function handleBulkQtyEnter(event) {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }

        const qtyValue = config['inputQty'].data.value;
        if (qtyValue === "" || qtyValue === null || typeof qtyValue === 'undefined') {
            config["CONTROL_CENTER"].promptWarningMessage("Please enter a quantity", "");
            return;
        }

        const rows = config['gridSize'].data || [];
        if (rows.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Select a Main Model first to add rows to the grid", "");
            return;
        }

        rows.forEach((row) => {
            if (row._rowstate === 'DELETED') {
                return;
            }
            row.quantity = qtyValue;
            if (row._rowstate !== 'NEW') {
                row._rowstate = 'MODIFIED';
            }
        });

        config["CONTROL_CENTER"].state.modified = true;
        if (typeof config["CONTROL_CENTER"].renderControlButtons !== 'undefined') {
            config["CONTROL_CENTER"].renderControlButtons();
        }

        config['gridSize'].reRender();
        config['inputQty'].setValue("");
    }

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            let id = config['inputBatchID'].data.value;
            const batch_no = config['inputBatchNo'].data.value;
            const main_model = config['inputMainModel'].getValue(); // Assuming this returns an array of selected models

            const qtyData = config['gridSize'].data; // Assuming this returns an array of size and quantity objects
            let qty_data = [];
            qtyData.forEach(item => {
                console.log("Item in Grid:", item);
                if (item._rowstate == 'NEW' || item._rowstate == 'DELETED' || item._rowstate == 'MODIFIED') {
                    qty_data.push({
                        id: item.id,
                        model_id: item.model_id,
                        quantity: item.quantity,
                        _rowstate: item._rowstate
                    });
                }

            });

            // Validations
            if (!batch_no || batch_no.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Batch No is required", "");
                return;
            }
            if (main_model.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select the Main Model", "");
                return;
            }


            // Prepare API request
            const apiRequest = {
                id: parseInt(id),
                batch_no: batch_no,
                qty_data: qty_data,
                main_model_id: main_model[0]
            };

            // Call API based on whether it's create or update
            let response = await API.post(`Batch/createAndUpdateBatch`, apiRequest);

            if (response.status === 200 || response.status === 201) {

                if (!id || id == "") {
                    id = response.data.data.id;
                    config['inputBatchID'].setValue(response.data.data.id);
                }

                config["CONTROL_CENTER"].promptBaseMessage("Batch saved successfully", "");
                //resetInputForm()
                await formPopulate(id);



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

                resetInputForm();

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

    async function __getModels() {
        try {

            const modelData = await API.get(`models`)
            setModels(modelData.data);

            let main_models = [];

            const uniqueMainModelIds = new Set();
            modelData.data.forEach((value) => {
                if (
                    value &&
                    value.main_model &&
                    value.main_model.id !== undefined &&
                    value.main_model.name !== undefined &&
                    !uniqueMainModelIds.has(value.main_model.id)
                ) {
                    uniqueMainModelIds.add(value.main_model.id);
                    main_models.push({
                        "id": value.main_model.id,
                        "name": value.main_model.name
                    });
                }
            });

            config['inputMainModel'].setOptions(main_models);




        } catch (err) {
            console.log(err);
            // toast.error(`Something went wrong`+err)
        }
    }

    function handleSelectModel(selectedList, selectedItem) {

        let model_id = selectedItem.id;

        try {

            const currentGridData = config['gridSize'].data || [];

            // Only auto-populate on a fresh batch - once the grid already
            // has rows (existing batch, or already populated for this
            // batch), the main model is locked (see
            // updateMainModelDisabledState()) so this branch shouldn't run.
            if (currentGridData.length === 0) {
                const filteredModels = models.filter(model => model.main_model_id === model_id);
                filteredModels.forEach((value) => {
                    config['gridSize'].addRow({
                        model_id: value.id,
                        model_name: value.name,
                        quantity: 0
                    });
                });
            }

            updateMainModelDisabledState();

        } catch (err) {
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
                    "model_search": value.main_model.name
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
            const where = [{ "active": true }];
            const orderby = "created_at:desc";
            const limit = 25;
            const relations = [
                "mainModel"
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
                    "model_search": value.main_model_name
                })
            })
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
                "main_model_name": searchCriteria.model_search === "" ? "%" : searchCriteria.model_search

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

    async function handleAdvanceSearchDone(event, selectedRow) {
        const id = selectedRow.batch_id_search;
        const name = selectedRow.batch_no_search;
        const mobile = selectedRow.model_search;



        await formPopulate(id);

    }

    async function formPopulate(id) {
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
                config['inputMainModel'].setValueByID(batchData.main_model_id);

                const size_data = batchData.batch_details || [];
                let gridRows = [];

                if (Array.isArray(size_data)) {
                    size_data.forEach((value) => {
                        console.log("Value in size_data:", value);
                        if (value && typeof value === "object") {
                            gridRows.push({
                                "id": value.id,
                                "model_id": value.model_id,
                                "model_name": value.model.name,
                                "quantity": value.quantity || 0
                            });
                        }
                    });
                }

                config['gridSize'].setData(gridRows);
                updateMainModelDisabledState();
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











    return generateBatchDisplay(config)
}

export default Batch;
