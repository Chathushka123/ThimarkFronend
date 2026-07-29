import React, { useEffect, useState } from 'react';
import { generateSupermarketGRNDisplay } from './SupermarketGRNDS';
import config from './SupermarketGRNCS';
import API from '../../../api/API';

const SupermarketGRN = () => {
    let [rendered, setRendered] = useState(true);
    let [grnTransactions, setGrnTransactions] = useState([]);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    // Button Events
    config["buttonCreateGrn"].event.onClick = handleCreateGrn;
    config["buttonAddTransaction"].event.onClick = handleAddTransaction;
    config["buttonCompleteGrn"].event.onClick = handleCompleteGrn;
    config["buttonNewGrn"].event.onClick = handleNewGrn;
    config["buttonDeleteTransactionYes"].event.onClick = handleDeleteTransactionYes;
    config["buttonDeleteTransactionNo"].event.onClick = handleDeleteTransactionNo;
    config["buttonCompleteGrnYes"].event.onClick = handleCompleteGrnYes;
    config["buttonCompleteGrnNo"].event.onClick = handleCompleteGrnNo;
    config['inputLocationId'].event.onBlur = handleBlurLocationId;

    // Advance Search
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    // Expose delete function globally for card buttons
    window.handleDeleteTransaction = handleDeleteTransaction;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        __getWarehouses();
    }, []);

    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);

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
        const apiRequest = { "screen": "grn" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonCreateGrn"].schema.visible = false;
            config["buttonAddTransaction"].schema.visible = false;
            config["buttonCompleteGrn"].schema.visible = false;
        }
    }

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified ||
            config["CONTROL_CENTER"].state.new ||
            config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function __getWarehouses() {
        try {
            const response = await API.get(`warehouses`);
            let warehouses = [];
            warehouses.push({
                "value": "",
                "text": "Select Warehouse"
            });
            response.data.forEach((value) => {
                warehouses.push({
                    "value": String(value.id),  // Convert to string for consistency
                    "text": value.name
                });
            });
            config['inputWarehouse'].setOptions(warehouses);
            console.log("Loaded warehouse options:", warehouses); // Debug options
        } catch (err) {
            console.log(err);
            config["CONTROL_CENTER"].promptWarningMessage("Error loading warehouses", "");
        }
    }

    async function handleBlurLocationId() {
        const locationId = config['inputLocationId'].data.value;
        config['inputMaterial'].setValue("");
        if (!locationId || locationId.trim() === "") return;

        try {
            const id = String(locationId).trim();
            const response = await API.get(`warehouse-locations/${id}`);
            console.log(response.data);
            if(response.status === 200) {
                if(response.data.stock_material){
                    const material = response.data.stock_material.code + " - " + response.data.stock_material.name;
                    config['inputMaterial'].setValue(material);
                }
            }
            reRender();
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    }

    async function handleCreateGrn() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const remarks = config['inputRemarks'].data.value;
            const warehouse_id = config['inputWarehouse'].data.value;

            // Validations
            if (!warehouse_id) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Warehouse", "");
                return;
            }

            // Prepare API request
            const apiRequest = {
                rmpono: null,
                remark: remarks,
                warehouse_id: parseInt(warehouse_id),
                status: "open"
            };

            // Call API to create GRN
            let response = await API.post(`grns`, apiRequest);

            if (response.status === 200 || response.status === 201) {
                const grnData = response.data;
                config['inputGrnID'].setValue(grnData.id);
                config['inputStatus'].setValue(grnData.status);

                config["CONTROL_CENTER"].promptBaseMessage("GRN created successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;

                // Show transaction entry section
                config["buttonAddTransaction"].schema.visible = true;
                config["buttonCompleteGrn"].schema.visible = String(warehouse_id) != "1";
                config["buttonCreateGrn"].schema.visible = false;

                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in creating GRN", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function __submitAddTransaction() {
        try {
            document.getElementById("spinner").style.display = "";

            const grn_id = config['inputGrnID'].data.value;
            const location_id = config['inputLocationId'].data.value;
            const stock_item_id = config['inputStockItemId'].data.value;
            const quantity = config['inputQuantity'].data.value;

            const apiRequest = {
                grn_id: parseInt(grn_id),
                location_id: location_id,
                stock_item_id: stock_item_id,
                quantity: parseInt(quantity),
                grn_price: 0
            };

            let response = await API.post(`grns/addTransaction`, apiRequest);

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Transaction added successfully", "");

                config['inputLocationId'].setValue("");
                config['inputStockItemId'].setValue("");
                config['inputQuantity'].setValue("");

                await loadGrnTransactions(grn_id);

                const locationInput = document.querySelector('input[name="inputLocationId"]');
                if (locationInput) locationInput.focus();

                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in adding transaction", "");
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleAddTransaction() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const grn_id = config['inputGrnID'].data.value;
            const location_id = config['inputLocationId'].data.value;
            const quantity = config['inputQuantity'].data.value;

            // Validations
            if (!grn_id) {
                config["CONTROL_CENTER"].promptWarningMessage("Please create GRN first", "");
                return;
            }
            if (!location_id || location_id.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Location ID is required", "");
                return;
            }
            if (!quantity || quantity.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Quantity is required", "");
                return;
            }

            await __submitAddTransaction();

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleDeleteTransaction(transactionId) {
        // Show confirmation popup
        config["inputDeleteTransactionId"].data.value = transactionId;
        config["deleteTransactionPopUp"].showPopUp();
    }

    async function handleDeleteTransactionYes() {
        try {
            const transactionId = config["inputDeleteTransactionId"].data.value;

            if (!transactionId) return;

            document.getElementById("spinner").style.display = "";
            config["deleteTransactionPopUp"].closePopUp();

            // Call API to delete transaction
            let response = await API.post(`grns/deleteTransaction`, { id: parseInt(transactionId) });

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Transaction deleted successfully", "");

                // Reload transactions
                const grn_id = config['inputGrnID'].data.value;
                await loadGrnTransactions(grn_id);

                // Clear the delete transaction ID
                config["inputDeleteTransactionId"].data.value = "";

                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in deleting transaction", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleDeleteTransactionNo() {
        config["deleteTransactionPopUp"].closePopUp();
        config["inputDeleteTransactionId"].data.value = "";
    }

    async function handleCompleteGrn() {
        // Get form values
        const grn_id = config['inputGrnID'].data.value;

        if (!grn_id) {
            config["CONTROL_CENTER"].promptWarningMessage("No GRN to complete", "");
            return;
        }

        // Check if there are transactions
        if (grnTransactions.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Cannot complete GRN without any transactions", "");
            return;
        }

        // Show confirmation popup
        config["completeGrnPopUp"].showPopUp();
    }

    async function handleCompleteGrnYes() {
        try {
            document.getElementById("spinner").style.display = "";
            config["completeGrnPopUp"].closePopUp();

            // Get form values
            const grn_id = config['inputGrnID'].data.value;

            // Prepare API request
            const apiRequest = {
                id: parseInt(grn_id),
                status: "completed"
            };

            // Call API to complete GRN
            let response = await API.post(`grns/complete`, apiRequest);

            if (response.status === 200 || response.status === 201) {
                config['inputStatus'].setValue("completed");
                config["CONTROL_CENTER"].promptBaseMessage("GRN completed successfully", "");

                // Hide transaction entry and complete button
                config["buttonAddTransaction"].schema.visible = false;
                config["buttonCompleteGrn"].schema.visible = false;

                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in completing GRN", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleCompleteGrnNo() {
        config["completeGrnPopUp"].closePopUp();
    }

    function handleNewGrn() {
        // Clear all fields
        config['inputGrnID'].setValue("");
        config['inputRemarks'].setValue("");
        config['inputWarehouse'].setValue("");
        config['inputStatus'].setValue("");

        // Reset transactions
        setGrnTransactions([]);

        // Reset buttons visibility through schema
        config["buttonCreateGrn"].schema.visible = true;
        config["buttonAddTransaction"].schema.visible = false;
        config["buttonCompleteGrn"].schema.visible = false;

        config["CONTROL_CENTER"].state.new = true;
        reRender();
    }

    async function loadGrnTransactions(grn_id) {
        try {
            const response = await API.get(`grns/${grn_id}/transactions`);
            if (response.status === 200) {
                setGrnTransactions(response.data.data || []);
            }
        } catch (err) {
            console.log(err);
            setGrnTransactions([]);
        }
    }

    async function handleAdvanceSearchPopup() {
        try {
            let data = [];
            const getData = await __getAll();

            if (getData && getData !== "Error" && getData.length > 0) {
                const listData = getData[0].Grn;
                listData.forEach((value, index) => {

                    data.push({
                        "grn_id_search": value.id,
                        "warehouse_search": value.warehouse?.name,
                        "remark_search": value.remark,
                        "status_search": value.status,
                    });
                });
            }

            let msg = "";
            if (data.length > 20) {
                msg = "Only 20 records are loaded. Please narrow your search";
                data = data.slice(0, 20);
            }

            config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptWarningMessage("Error loading GRNs", "");
        }
    }

    async function __getAll() {
        try {
            const key = "Grn";
            const distinct = false;
            const select = ["*"];
                        const where = [
                { "active": true },
                {
                    "field-name": "rmpono",
                    "operator": "=",
                    "value": null
                }
            ];
            const orderby = "created_at:desc";
            const limit = 25;
            const relations = [
                "warehouse"
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
        try {
            const response = await API.post(`grns/search`, searchCriteria);

            let data = [];
            if (response.data.data && response.data.data.length > 0) {
                response.data.data
                    .filter((value) => value.rmpono == null)
                    .forEach((value) => {
                        data.push({
                            "grn_id_search": value.id,
                            "warehouse_search": value.warehouse?.name,
                            "remark_search": value.remark,
                            "status_search": value.status
                        });
                    });
            }

            let msg = data.length === 0 ? "No records found" : "";
            callback(data, msg);
        } catch (error) {
            console.log(error);
            callback([], "Error searching GRNs");
        }
    }

    async function handleAdvanceSearchDone(event, selectedRow) {
        const grn_id = selectedRow.grn_id_search;
        await formPopulate(grn_id);
    }

    async function formPopulate(grn_id) {
        try {
            document.getElementById("spinner").style.display = "";

            const response = await API.get(`grns/${grn_id}`);

            if (response.status === 200) {
                let data = response.data;
                console.log("GRN Data from API:", data); // Debug log
                console.log("Setting warehouse_id to:", data.warehouse_id); // Debug warehouse

                config['inputGrnID'].setValue(data.id);
                config['inputRemarks'].setValue(data.remark || data.remarks || "");
                config['inputStatus'].setValue(data.status);

                // Set warehouse with proper type matching
                const warehouseValue = data.warehouse_id ? String(data.warehouse_id) : "";
                config['inputWarehouse'].setValue(warehouseValue);

                console.log("Warehouse value after set:", config['inputWarehouse'].data.value); // Debug value after set
                console.log("Warehouse options:", config['inputWarehouse'].data.options); // Debug options

                // Load transactions
                await loadGrnTransactions(grn_id);

                // Set button visibility based on status
                if (data.status === "open") {

                    config["buttonAddTransaction"].schema.visible = true;
                    config["buttonCompleteGrn"].schema.visible = warehouseValue != "1";
                    config["buttonCreateGrn"].schema.visible = false;
                } else {
                    config["buttonAddTransaction"].schema.visible = false;
                    config["buttonCompleteGrn"].schema.visible = false;
                    config["buttonCreateGrn"].schema.visible = false;
                }

                config["CONTROL_CENTER"].state.populated = true;

                // Force double render to ensure button visibility changes are applied
                reRender();
                setTimeout(() => reRender(), 0);
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
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

                    const errorMessage = errors.join('\n');
                    config["CONTROL_CENTER"].promptWarningMessage(errorMessage, "");
                } catch (parseError) {
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.data.message, "");
                }
            } else if (error.message) {
                config["CONTROL_CENTER"].promptWarningMessage(error.message, "");
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("An unexpected error occurred", "");
            }
        } catch (err) {
            console.error("Error in handleError:", err);
            config["CONTROL_CENTER"].promptWarningMessage("An unexpected error occurred", "");
        }
    }

    return generateSupermarketGRNDisplay(config, grnTransactions);
}

export default SupermarketGRN;
