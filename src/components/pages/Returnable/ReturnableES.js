import React, { useEffect, useState } from 'react';
import { generateReturnableDisplay } from './ReturnableDS';
import config from './ReturnableCS';
import API from '../../../api/API';

const Returnable = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["buttonPrint"].event.onClick = handleSaveReturnable;
    config["inputRequester"].event.onEnterKey = handleGetReturnableDetails;
    config["inputRequester"].event.onBlur = handleGetReturnableDetails;
    config["gridReturnableItem"].event.onRowCustomButton = handleRowEditClick;

    config["inputMaterial"].event.onEnterKey = handleGetMaterialDeleDetails;
    config["inputMaterial"].event.onBlur = handleGetMaterialDeleDetails;


    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/







    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load 
    useEffect(() => {
       // __checkIsAuthorized();
       __setFormReadWrite(true);
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

    async function handleSaveReturnable() {
        try {
            document.getElementById("spinner").style.display = "";

            if((config["inputRequester"].data.value == "" || config["inputRequester"].data.value == "open")){
                config["CONTROL_CENTER"].promptWarningMessage("Please Scan The Requester", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            if((config["inputMaterial"].data.value == "" || config["inputMaterial"].data.value == "open")){
                config["CONTROL_CENTER"].promptWarningMessage("Please Scan The Material", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            
            // if((config["inputMaterialName"].data.value == "" || config["inputMaterialName"].data.value == "open")){
            //     config["CONTROL_CENTER"].promptWarningMessage("Please Scan The Valid Material", "");
            //     document.getElementById("spinner").style.display = "none";
            //     return;
            // }
            if((config["inputQuantity"].data.value == "" || config["inputQuantity"].data.value == 0)){
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter The Quantity", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            
            const apiRequest = {
                issued_to: config["inputRequester"].data.value,
                total_qty: config["inputQuantity"].data.value,
                issued_qty: config["inputQuantity"].data.value,
                return_qty: 0,
                stock_item_id : config["inputMaterial"].data.value,  
                remarks : config["inputRemark"].data.value, 
            };
            
            // Call API to save MRN
            let response = await API.post(`inventory/saveReturnable`, apiRequest);

            document.getElementById("spinner").style.display = "none";

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Data saved successfully", "");
                config["inputQuantity"].setValue(0);
                config["inputRemark"].setValue(""); 
                config["inputMaterial"].setValue(""); 
                config["inputMaterialName"].setValue("");
                await handleGetReturnableDetails();
               // await formPopulate(mrnData.id);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to save Data", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error saving Data");
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
        config["inputMaterialName"].setValue("");
        try {
            config["inputMaterialName"].data.value = "";
            if(config["inputMaterial"].data.value == "" ){
                return;
            }

            const id =config["inputMaterial"].data.value;
            // Call API to get returnable 
           
            let response = await API.get(`stock-materials/${id}`,);
            if (response.status == 200 ) {
                if(response.data.category == 'returnable'){
                    config["inputMaterialName"].setValue(response.data.code+ " | "+response.data.name);
                }else{
                    config["CONTROL_CENTER"].promptWarningMessage("Scanned material is not returnable", "");
                    config["inputMaterial"].setValue("");
                    config["inputMaterialName"].setValue("");
                }
            }

        }
        catch (error) {
            console.log(error);
            config["inputMaterial"].setValue("");
            config["inputMaterialName"].setValue("");
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

    async function handleGetReturnableDetails(){
        document.getElementById("spinner").style.display = "";
        try {
            if(config["inputRequester"].data.value == "" ){
                return;
            }
            const apiRequest = {
                issued_to: config["inputRequester"].data.value, 
            };
            
            // Call API to get returnable details
            let response = await API.post(`inventory/getReturnable`, apiRequest);
            console.log('====================================');
            console.log(response.data.data);
            console.log('====================================');
            if (response.data.data && response.data.data.length > 0) {
                const rows = response.data.data.map(item => {

                    return {
                        "id": item.id,
                        "material_code": item.material_code ? item.material_code : "",
                        "material_name": item.material_name ? item.material_name : "",
                        "issued_qty": item.issued_qty,
                        "return_qty": item.return_qty,
                        "qty": item.issued_qty - item.return_qty,
                        "remarks": item.remarks ? item.remarks : "",
                    }
                })

                config['gridReturnableItem'].setData(rows);
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

    async function handleRowEditClick(e,r){
        const id = config["gridReturnableItem"].getValueWiltColName(r, 'id');
        const issuedQty = config["gridReturnableItem"].getValueWiltColName(r, 'issued_qty');
        const returnQty = config["gridReturnableItem"].getValueWiltColName(r, 'return_qty');
        const qty = config["gridReturnableItem"].getValueWiltColName(r, 'qty');

        if(parseFloat(qty) + parseFloat(returnQty) > parseFloat(issuedQty)){
            config["CONTROL_CENTER"].promptWarningMessage("Return quantity cannot be greater than issued quantity", "");
            return;
        }

         try {
            document.getElementById("spinner").style.display = "";
            
            const apiRequest = {
                id: id,
                return_qty: parseFloat(qty) + parseFloat(returnQty)
            };
            
            // Call API to save MRN
            let response = await API.post(`inventory/updateReturnable`, apiRequest);

            document.getElementById("spinner").style.display = "none";

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Data Updated successfully", "");
                await handleGetReturnableDetails();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to save Data", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error saving Data");
        }
    
    }


    return generateReturnableDisplay(config)
}

export default Returnable;