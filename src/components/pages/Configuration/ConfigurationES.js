import React, { useEffect, useState } from 'react';
import { generateBuyerDisplay } from './ConfigurationDS';
import config from './ConfigurationCS';
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
    config["CONTROL_CENTER"].event.onSave = handleSave;


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


    async function handleSave(event, beforeSaveArr, callback) {
        
        try{
            document.getElementById("spinner").style.display = "block";
            if(config["inputInvoiceID"].data.value == ""){
                config["CONTROL_CENTER"].promptWarningMessage("Invoice ID is Mandatory", "");
                document.getElementById("spinner").style.display = "none";
                return;
            }
            const apiRequest = { "invoice_id": config["inputInvoiceID"].data.value }
            const invoice = await API.post(`Invoice/setupInvoiceID`, apiRequest);
            if(invoice.status == "200"){
                config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                config["inputInvoiceID"].setValue("");
            }else{
                config["CONTROL_CENTER"].promptWarningMessage("Error in Saving Invoice ID", "");
            }
            document.getElementById("spinner").style.display = "none";
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            config["CONTROL_CENTER"].promptWarningMessage(error.response.data.message);
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
        }
    }











  





    

    return generateBuyerDisplay(config)
}

export default Buyer;