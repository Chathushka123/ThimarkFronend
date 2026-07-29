import React, { useEffect, useState } from 'react';
import { generateEmployeeDisplay } from './EmployeeDS';
import config from './EmployeeCS';
import API from '../../../api/API';

const Employee = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;


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














  





    

    return generateEmployeeDisplay(config)
}

export default Employee;