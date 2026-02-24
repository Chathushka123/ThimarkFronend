import React, { useEffect, useState } from 'react';
import { generateDayBookDisplay } from './DayBookDS';
import config from './DayBookCS';
import API from '../../../api/API';

const DayBook = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config['buttonAddPaymentType'].event.onClick = showPopUp;
    config['buttonSavePaymentType'].event.onClick = handleSaveAddPaymnentType;


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
       
       await __getPaymentType();
       __setFormReadWrite(true);
       config['inputDate'].setDate(new Date().toISOString().split('T')[0]);
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



    async function __getPaymentType(){
        try{

            const statusData = await API.post(`Invoice/getPaymentMethod`)
            
            let status = [];
            statusData.data.forEach((value, index) => {
                status.push({
                    "id":value.payment_type,
                    "name":value.payment_type
                })
            });

            config['inputPaymentType'].setOptions(status);
  
            


        }catch(err){
            console.log(err);
           // toast.error(`Something went wrong`+err)
        }
    }

    async function handleSave(event, beforeSaveArr, callback) {
        
        try{
            document.getElementById("spinner").style.display = "";
            let date = config['inputDate'].data.value;
            let payment_type = config['inputPaymentType'].getValue();
            let amount = config['inputAmount'].data.value;
            let dr_cr = config['radioDrCr'].data.value;
            
            if(!(payment_type.length > 0)){
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptWarningMessage("Please select Payment Type", "");
                return;
            }
            if(amount === null || amount === ""){
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptWarningMessage("Please enter Amount", "");
                return;
            }
            if(dr_cr === "DR."){
                amount = parseFloat(amount) * -1;
            }

            const apiRequest = {
                "payment_date": date,
                "payment_method": config['radioPaymentMethod'].data.value,
                "transaction_type": payment_type[0],
                "amount": amount,
                "payee":config['inputPayee'].data.value,
                "description":config['inputRemarks'].data.value
            }

                const invoice = await API.post(`Invoice/createDayBookTransaction`, apiRequest);
                if(invoice.status == "200"){
                    // config['inputId'].setValue(invoice.data.data);

                    config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                }else{
                    config["CONTROL_CENTER"].promptWarningMessage("Error in Saving Transaction", "");
                }


            document.getElementById("spinner").style.display = "none";



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



    function showPopUp(){
        config["AddPaymentTypePopUp"].showPopUp();
    }

    async function handleSaveAddPaymnentType(){
        try{
            document.getElementById("spinner").style.display = "";

            let payment_type = config['inputAddPaymentType'].data.value;
            if(payment_type === null || payment_type === ""){
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptWarningMessage("Please enter Payment Type", "");
                return;
            }
            const apiRequest = {
                "payment_type": payment_type
            }
            const invoice = await API.post(`Invoice/createPaymentType`, apiRequest);
            if(invoice.status == "200"){
                config['inputAddPaymentType'].setValue("");
                config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                config["AddPaymentTypePopUp"].closePopUp();
                await __getPaymentType();
            }else{
                config["CONTROL_CENTER"].promptWarningMessage("Error in Saving Payment Type", "");
            }
            document.getElementById("spinner").style.display = "none";
            
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




  





    

    return generateDayBookDisplay(config)
}

export default DayBook;