import React, { useEffect, useState } from 'react';
import { useHistory,useLocation } from "react-router-dom";
import { generateBuyerDisplay } from './InvoiceRegistryDS';
import config from './InvoiceRegistryCS';
import API from '../../../api/API';





const Buyer = () => {
    let [rendered, setRendered] = useState(true);
    const history = useHistory();



    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["gridInvoiceRegistry"].event.onCustomeEdit1 = handleEditRegistry;

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
       await __getStatus();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "InvoiceRegistry" }
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

        async function __getStatus(){
            try{
                document.getElementById("spinner").style.display = "block";
                const statusData = await API.post(`Invoice/getInvoice`)
                
                let data = [];
                statusData.data.forEach((value, index) => {
                    data.push(value)
                });
    
                config['gridInvoiceRegistry'].setData(data);
      
                
                document.getElementById("spinner").style.display = "none";
    
            }catch(err){
                document.getElementById("spinner").style.display = "none";
                console.log(err);
               // toast.error(`Something went wrong`+err)
            }
        }

        async function handleEditRegistry(event, rowId){
             
            let invoice_id = config['gridInvoiceRegistry'].getValueWiltColName(rowId,"bill_no");
            // let invoice_id = 1;
            // history.push(`/invoice?invoice_id=${invoice_id}`);
            // //const win = window.open("/EK/shopfloor/automateBundleCreation?fppo="+fppo+"", "_blank");
            // //win.focus();

           
            const win = window.open(`/invoice?invoice_id=${invoice_id}`, "_blank");
            if (win) {
                win.focus(); // Brings new tab into focus (if allowed by browser)
            }
        }














  





    

    return generateBuyerDisplay(config)
}

export default Buyer;