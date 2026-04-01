import React, { useEffect, useState } from 'react';
import { generateStockTransferDisplay } from './StockTransferDS';
import config from './StockTransferCS';
import API from '../../../api/API';

const StockTransfer = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["buttonSave"].event.onClick = handleSaveStockTransfer;
    config["inputFromLocation"].event.onEnterKey = handleGetMaterialDeleDetails;
    config["inputFromLocation"].event.onBlur = handleGetMaterialDeleDetails;

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
      // __getWarehouses();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "marker" }
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

    function handleError(error, defaultMessage) {
        try {
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.data.message, "");
                } else if (error.response.statusText) {
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.statusText, "");
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An error occurred", "");
                }
            } else if (error.message) {
                config["CONTROL_CENTER"].promptWarningMessage(error.message, "");
            } else {
                config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An unexpected error occurred", "");
            }
        } catch (err) {
            console.error("Error in handleError:", err);
            config["CONTROL_CENTER"].promptWarningMessage(defaultMessage || "An unexpected error occurred", "");
        }
    }


    async function handleGetMaterialDeleDetails(){
        document.getElementById("spinner").style.display = "";
        config["inputMaterial"].setOptions([{ value: "", text: "Select Material" }]);
        try {
            
            if(config["inputFromLocation"].data.value == "" ){
                return;
            }

            const id =config["inputFromLocation"].data.value;
            const apiRequest = {
                whl_id:id
            }
            
            let response = await API.post(`inventory/getLocationAvaileMaterial`,apiRequest);
            if (response.status == 200 ) {

                const materials = response.data.data.map(material => ({
                    value: material.stock_item_id || material.stock_item_id,
                    text: material.material_code +" | "+ material.material_name
                }));
                config["inputMaterial"].setOptions(materials);
                config["inputMaterial"].setValue(response.data.data[0].stock_item_id);
            }

        }
        catch (error) {
            console.log(error);
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
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleSaveStockTransfer(){
        document.getElementById("spinner").style.display = "";
        //config["inputMaterial"].setOptions([]);
        try {
            
            if(config["inputFromLocation"].data.value == "" ){
                    config["CONTROL_CENTER"].promptWarningMessage("Please enter From Location", "");
                return;
            }
            if(config["inputToLocation"].data.value == "" ){
                    config["CONTROL_CENTER"].promptWarningMessage("Please enter To Location", "");
                return;
            }
            if(config["inputMaterial"].data.value == "" ){
                    config["CONTROL_CENTER"].promptWarningMessage("Material Not Found", "");
                return;
            }
            if(config["inputQty"].data.value == "" ){
                    config["CONTROL_CENTER"].promptWarningMessage("Please enter Quantity", "");
                return;
            }

            
            const apiRequest = {
                from_id: config["inputFromLocation"].data.value,
                to_id:config["inputToLocation"].data.value,
                material_id:config["inputMaterial"].data.value,
                qty:config["inputQty"].data.value
            }
            
            let response = await API.post(`inventory/transferStockItem`,apiRequest);
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            if (response.status == 200 ) {

                config["CONTROL_CENTER"].promptBaseMessage("Transfer Successful", "");
                config["inputMaterial"].setOptions([{ value: "", text: "Select Material" }]);
                config["inputFromLocation"].setValue("");
                config["inputToLocation"].setValue("");
                config["inputQty"].setValue("");
            }

        }
        catch (error) {
            console.log(error);
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
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }









  





    

    return generateStockTransferDisplay(config)
}

export default StockTransfer;