import React, { useEffect, useState } from 'react';
import { generateTransactionSummaryDisplay } from './TransactionSummaryDS';
import config from './TransactionSummaryCS';
import API from '../../../api/API';

const TransactionSummary = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onPopulate = __getTransactionSummary;


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
        config['inputFromDate'].setDate(new Date().toISOString().split('T')[0]);
        config['inputToDate'].setDate(new Date().toISOString().split('T')[0]);
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

    async function __getTransactionSummary(){
        try{
            document.getElementById("spinner").style.display = "block";
            
            const apiRequest ={
                "date_from": config['inputFromDate'].data.value,
                "date_to": config['inputToDate'].data.value
            }
            const res = await API.post(`Invoice/getTransactionSummary`, apiRequest)
            
            let data = [];
            res.data.forEach((value, index) => {
                data.push(value)
            });
            if(data.length === 0){
                data = [{},{},{}];
            }
            config['gridTransactionSummary'].setData(data);
    
            
            document.getElementById("spinner").style.display = "none";

        }catch(err){
            document.getElementById("spinner").style.display = "none";
            console.log(err);
            // toast.error(`Something went wrong`+err)
        }
    }














  





    

    return generateTransactionSummaryDisplay(config)
}

export default TransactionSummary;