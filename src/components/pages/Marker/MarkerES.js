import React, { useEffect, useState } from 'react';
import { generateBuyerDisplay } from './MarkerDS';
import config from './MarkerCS';
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
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["CONTROL_CENTER"].event.onSave = handleSave;

    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/


    function handlePopulate(event, callback) {
        return onPopulate(event, callback);
    }


    function handleSave(event, beforeSaveArr, callback) {
        let afterSaveArr
        if (beforeSaveArr.action === "NEW") {
            afterSaveArr = onSaveNew(event, beforeSaveArr, callback);
        }
        else if (beforeSaveArr.action === "DELETE") {
            afterSaveArr = onSaveDelete(event, beforeSaveArr, callback);
        }
        else if (beforeSaveArr.action === "MODIFY") {
            afterSaveArr = onSaveModify(event, beforeSaveArr, callback);
        }
        return afterSaveArr;
    }

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();
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

    function onPopulate(){

    }

    function onSaveNew(){

    }
    async function onSaveModify(event, dataArr, callback){
        try{     

            let styleCode = dataArr.data.style_code;
            let maxPlies = dataArr.data.max_plies;
            let maxLength = dataArr.data.max_length;
            let consumption = dataArr.data.consumption;
            let fabric = dataArr.data.fabric;
            let type = dataArr.data.type;
            
            let gridSizeFitJsonRows = dataArr.data.gridSizeFitJson.data;
            let sizeQty =[];

            if(type !== ""){
                Object.entries(gridSizeFitJsonRows).forEach(([index, data]) => {
                // sizeQty[data.size] = data.qty;
                sizeQty.push({"size":data.size,"qty":data.qty});
                });
                sizeQty.sort((a, b) => a.qty - b.qty);
            // const sorted =  [...sizeQty].sort((a, b) => a - b);
                const apiRequest = {
                    'style_code':styleCode,
                    'max_plies':maxPlies,
                    'max_length':maxLength,
                    'consumption':consumption,
                    'fabric':fabric,
                    "type":type,
                    sizeQty:sizeQty

                }

                document.getElementById("spinner").style.display = "";

                const updateStyle = await API.post(`MarkerPlan/generateMarkerPlan`, apiRequest);
                let data = updateStyle.data;



                let rows =[];

                data.forEach((row,index) => {
                    
                    rows.push({...row});
                });
                console.log("*****************Result*********************")
                console.log(rows);
                config['gridMarkerRatio'].setData(rows);
            

                document.getElementById("spinner").style.display = "none";
            }else{
                config["CONTROL_CENTER"].promptWarningMessage( "Please Select Type");   
            }

         } catch (error) {
            document.getElementById("spinner").style.display = "none";
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
    function onSaveDelete(){

    }

    async function handleAdvanceSearchPopup() {
        let data = [];
        const getData = await __getAll();

        if (getData && getData !== "Error" && getData[0].Style.length > 0) {
            const listData = getData[0].Style;
            listData.forEach((value, index) => {
                let style_fabrics = value.style_fabrics;
                style_fabrics.forEach((style_fabric,sf_index)=>{
                data.push({
                    "style_code_search": value.style_code,
                    "style_description_search": value.description,
                    "style_route_code_search": style_fabric.fabric
                }) })
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
            const key = "Style";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [
                "style_fabrics"
            ];
            const orderby = "created_at:desc";
            const limit = 25;

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
                    "style_code_search": value.style_code,
                    "style_description_search": value.description,
                    "style_route_code_search": value.fabric
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
                    
                        "style_code": searchCriteria.style_code_search === "" ? "%" : searchCriteria.style_code_search,
                        "description": searchCriteria.style_description_search === "" ? "%" : searchCriteria.style_description_search,
                        "fabric": searchCriteria.style_route_code_search === "" ? "%" : searchCriteria.style_route_code_search
                    
                };
                const getSearchDetails = await API.post(`MarkerPlan/getSearchByStyleFabric`, apiRequest);
                const details = getSearchDetails.data;
    
                return details;
    
            } catch (error) {
                console.log("***********GetDetails Error**********");
                console.log(error.response);
                return "Error";
            }
        }

        async function handleAdvanceSearchDone(event, selectedRow){
            const style_code = selectedRow.style_code_search;
            const description = selectedRow.style_description_search;
            const fabric = selectedRow.style_route_code_search;
            try {
                
                config['inputStyleCode'].setValue(style_code);
                config['inputFabric'].setValue(fabric);
                const styleId = await __getStyleIdByCode(style_code);
                await formPopulate(styleId);

                // const apiRequest = {
                    
                //         "style_code": searchCriteria.style_code_search === "" ? "%" : searchCriteria.style_code_search,
                //         "description": searchCriteria.style_description_search === "" ? "%" : searchCriteria.style_description_search,
                //         "fabric": searchCriteria.style_route_code_search === "" ? "%" : searchCriteria.style_route_code_search
                    
                // };
                // const getSearchDetails = await API.post(`MarkerPlan/getSearchByStyleFabric`, apiRequest);
                // const details = getSearchDetails.data;
    
                // return details;
    
            } catch (error) {
                console.log("***********GetDetails Error**********");
                console.log(error.response);
                return "Error";
            }
        }

            // Get StyleId By Code
    async function __getStyleIdByCode(styleCode) {
        let styleId = "";
        try {
            const key = "Style";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "style_code",
                    "operator": "=",
                    "value": styleCode
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getId = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getId && getId !== "Error" && getId[0].Style.length > 0) {
                styleId = getId[0].Style[0].id;
            }
        } catch (error) {
            console.log("***********GetStyleIdByCode Error**********");
            console.log(error.response);
        }
        return styleId;
    }

    async function formPopulate(styleId){
        try{
          let fabric =  config['inputFabric'].data.value; 
          document.getElementById("spinner").style.display = "";

          // Get Style Details from Style Id
          const details = await __getStyleData(styleId);
          const styleData = details[0].Style[0];
          let gridSizeFitJsonRows = [];
          let gridMartkerRatioColumns=[];

          if (styleData.size_fit_json.length > 0) {
              // Set SizeFitJson Grid Rows
              gridSizeFitJsonRows = __getGridSizeFitJsonRows(styleData.size_fit_json);
          }
          config['gridSizeFitJson'].setData(gridSizeFitJsonRows);
          gridMartkerRatioColumns = __getMarkerRationColumns(styleData.size_fit_json);
          console.log("PPPPPPPPPPPPP");
          console.log(gridMartkerRatioColumns);
          config['gridMarkerRatio'].setColumns(gridMartkerRatioColumns);
          config['gridMarkerRatio'].setData([]);
          document.getElementById("spinner").style.display = "none";

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            console.log("***********GetStyleIdByCode Error**********");
            console.log(error.response);
        }
    }

    async function __getStyleData(styleId) {
        try {
            const key = "Style";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "id",
                    "operator": "=",
                    "value": styleId
                }
            ];
            const relations = [
                "style_fabrics"
            ];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetStyleData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get SizeFitJson Grid Rows
    function __getGridSizeFitJsonRows(results) {
        let gridRows = [];

        results.forEach(data => {
            gridRows.push({
                "size": __isNotNullorEmpty(data.size) ? data.size : "",
                "qty": __isNotNullorEmpty(data.fit) ? data.fit : ""
            });
        });

        return gridRows;
    }

    //  Get Marker Ratio Columns  

    function __getMarkerRationColumns(results){
        let grid1Cols = [];
        
        results.forEach(data => {
            let size =data.size;
            grid1Cols.push({title: size,type: 'numeric',additional_type:'integer',data: size,editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:'auto'})
        });
        grid1Cols.push({title: "Total",type: 'numeric',additional_type:'integer',data: "total",editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:'auto'})
        grid1Cols.push({title: "Plies",type: 'numeric',additional_type:'integer',data: "plies",editor: 'numeric',numericFormat: {allowInvalid: false,correctFormat: false},customDataType: 'numeric',width:'auto'})

        return grid1Cols;

    }

    //Check Srting Null or Empty
    function __isNotNullorEmpty(str) {
        if (str !== null && str !== "") {
            return true;
        } else {
            return false;
        }
    }

    

    return generateBuyerDisplay(config)
}

export default Buyer;