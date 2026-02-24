import React, { useState } from 'react';
import { generateLayPlanningDisplay } from './LayPlanningDS';
import config from './LayPlanningCS';
import API from '../../../api/API';

const LayPlanning = () => {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender

    //config["inputOcNo"].event.onChange = handleChangeOcNo;
    config["selectorFPO"].event.onChange = handleChangeSelectorFPO;
    config["inputLaySheetNo"].event.onChange = handleChangeLaySheetNo;
    config["buttonCreateLaySheet"].event.onClick = handleCreateLaySheet;
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["buttonDeleteLaySheet"].event.onClick = handleDeleteLaySheet;

    config["lovComboBoxOc"].event.onComboSearch = handleComboSearchOc;
    config["lovComboBoxOc"].event.onLovDone = handleLovDoneOc;
    config["lovComboBoxOc"].event.onLovSearch = handleLovSearchOc;
    config["lovComboBoxOc"].event.onBlurWithChange = handleBlurLovOc;

    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onDelete = handleDelete;
    config["CONTROL_CENTER"].event.onRefresh = handleRefresh;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;

    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/

    function handleChange(event) {
        return onChange(event);
    }

    function handlePopulate(event, callback) {
        return onPopulate(event, callback);
    }

    function handleNew(event) {
        return onNew();
    }

    function handleDelete(event) {
        return onDelete();
    }

    function handleRefresh(event) {
        return onRefresh();
    }

    function handleSave(event, beforeSaveArr) {
        if (beforeSaveArr.action === "NEW") {
            onSaveNew(beforeSaveArr)
        }
        else if (beforeSaveArr.action === "DELETE") {
            onSaveDelete(beforeSaveArr)
        }
        else if (beforeSaveArr.action === "MODIFY") {
            onSaveModify(beforeSaveArr)
        }
        let afterSaveArr = { ...beforeSaveArr.data }
        return afterSaveArr
    }

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initila values of Component Schema etc.

    // Set OC Dropdown Options
    //__getOcDropdownOptions();

    // Enable navigation prompt
    window.onbeforeunload = function() {
        if(config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted){
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    // Get OC Dropdown Options
    /* async function __getOcDropdownOptions() {
        try {
            let dropdownOptions = [{ value: "", text: "- Select Oc No -" }];

            const key = "Oc";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const dataList = await __getDetails(key, distinct, select, where, relations, orderby, limit);
            
            if (dataList && dataList !== "Error" && dataList[0].Oc.length > 0) {
                dataList[0].Oc.forEach(data => {
                    dropdownOptions.push({ "value": data.id, "text": data.wfx_oc_no });
                });
            }

            config["inputOcNo"].setOptions(dropdownOptions);
            
        } catch (error) {
            console.log("***********GetOcDropdownOptions Error**********");
            console.log(error.response);
        }
    } */

    // Get Details
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

    // Get Lay Sheets By OC Id
    async function __getLaySheets(ocId) {
        let laySheetList = [{ value: "", text: "- Select Lay Sheet No -" }];
        try {
            const key = "LaySheet";
            const distinct = false;
            const select = ["id","sheet_no"];
            const where = [
                {
                    "field-name": "oc_id",
                    "operator": "=",
                    "value": ocId
                }
            ];
            const relations = [];
            const orderby = "sheet_no:asc";
            const limit = 1000;

            const getLaySheetsByOcId = await __getDetails(key, distinct, select, where, relations, orderby, limit);
            
            let list = [];
            if (getLaySheetsByOcId && getLaySheetsByOcId !== "Error" && getLaySheetsByOcId[0].LaySheet.length > 0) {
                getLaySheetsByOcId[0].LaySheet.forEach(data => {
                    list.push({ "value": data.id, "text": data.sheet_no });
                });
            } else {
                console.log("No Lay Sheets Available");
            }

            laySheetList = [{ value: "", text: "- Select Lay Sheet No -" }, ...list];

        } catch (error) {
            console.log("***********GetLaySheets Error**********");
            console.log(error.response);
        }

        return laySheetList;
    }

    // Get LaySheet Details By OC Id and laySheetId
    async function __getLaySheetDetails(laySheetId) {
        try {
            const key = "CutPlan";
            const distinct = false;
            const select = ["id","cut_no","ratio_json","max_plies"];
            const where = [
                {
                    "field-name": "lay_sheet_id",
                    "operator": "=",
                    "value": laySheetId
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetSocData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get QtyJson By OC Id
    async function __getQtyJsonByOc(ocId) {
        let qtyJson = [];
        try {
            const key = "Oc";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "id",
                    "operator": "=",
                    "value": ocId
                }
            ];
            const relations = ["style"];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getDetails = await __getDetails(key, distinct, select, where, relations, orderby, limit);
            
            if (getDetails && getDetails !== "Error" && getDetails[0].Oc.length > 0) {
                qtyJson = getDetails[0].Oc[0].style.size_fit
            } else {
                console.log("No Data Available");
            }

        } catch (error) {
            console.log("***********GetQtyJsonByOc Error**********");
            console.log(error.response);
        }

        return qtyJson;
    }

    // Get LayPlanning Grid Columns
    /* function __getGridLayPlanningColumns(results) {
        let gridCols = [];
        let remoteCols = [];
        
        gridCols["fpo_id"] = { objectType: "TextBox", datatype: "text", name: "fpo_id", placeholder: "FPO ID", visible:false, editable: false, sqlColumn: "fpo_id", style: { textAlign: "left" } };
        gridCols["fpo_no"] = { objectType: "TextBox", datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left" } };
        gridCols["garment_color"] = { objectType: "TextBox", datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left" } };
        
        Object.entries(results).map(([key, data]) => (remoteCols = Object.keys(data.qty_json)));
        remoteCols.map(col => (
            gridCols[col] = { objectType: "IntegerField", datatype: "text", name: col, placeholder: col, editable: false, sqlColumn: col, style: { textAlign: "left" } }
        ));

        gridCols["priority_seq"] = { objectType: "IntegerField", datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: true, sqlColumn: "priority_seq", style: { textAlign: "left" } };

        return gridCols;
    } */

    // Get LayPlanning Grid Rows
    function __getGridLayPlanningRows(colorQuantities, sum) {
        let gridRows = [];

        let seq = 1;
        Object.entries(colorQuantities).forEach(([index, data]) => {
            /* gridRows.push({ "fpo_id": data.fpo_id, "fpo_no": data.fpo_no, "garment_color": data.garment_color, ...data.qty_json }); */
            gridRows.push({ "fpo_id": data.fpo_id, "fpo_no": data.fpo_no, "garment_color": data.garment_color, ...data.qty_json, "priority_seq": seq });
            seq++;
        });

        /* let rowTotal = { "fpo_id": "", "fpo_no": "Total", "garment_color": "", ...sum } */
        let rowTotal = { "fpo_id": "", "fpo_no": "Total", "garment_color": "", ...sum, "priority_seq": "" }

        gridRows.push(rowTotal);

        return gridRows;
    }

    // Get LayMarker Grid Columns
    /* function __getGridLayMarkerColumns(results) {
        let gridCols = [];
        let remoteCols = [];
        
        gridCols["marker_name"] = { objectType: "TextBox", datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left" } };
        
        remoteCols = Object.keys(results);
        remoteCols.map(col => (
            gridCols[col] = { objectType: "IntegerField", datatype: "text", name: col, placeholder: col, editable: true, sqlColumn: col, style: { textAlign: "left" } }
        ));

        gridCols["total_plies"] = { objectType: "IntegerField", datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left" } };

        return gridCols;
    } */

    // Get Fpo Grid Columns
    /* function __getGridFpoColumns() {
        let gridCols = [];
        
        gridCols["fpo_no"] = { objectType: "TextBox", datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left" } };
        gridCols["soc_no"] = { objectType: "TextBox", datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left" } };

        return gridCols;
    } */

    // Get Fpo Grid Rows
    function __getGridFpoRows(fpoArray) {
        let gridRows = [];

        Object.entries(fpoArray).forEach(([index, data]) => {
            gridRows.push({ "fpo_no": data.wfx_fpo_no, "soc_no": data.wfx_soc_no });
        });

        return gridRows;
    }

    // Get Cutting Grid Columns
    /* function __getGridCuttingColumns(cutPlansArray) {
        let gridCols = [];
        let remoteCols = [];
        
        gridCols["cut_no"] = { objectType: "TextBox", datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left" } };
        
        remoteCols = Object.keys(cutPlansArray.ratio_json);
        remoteCols.map(col => (
            gridCols[col] = { objectType: "IntegerField", datatype: "text", name: col, placeholder: col, editable: false, sqlColumn: col, style: { textAlign: "left" } }
        ));

        gridCols["total_plies"] = { objectType: "IntegerField", datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left" } };

        return gridCols;
    } */

    // Get Cutting Grid Rows
    function __getGridCuttingRows(cutPlansArray) {
        let gridRows = [];

        Object.entries(cutPlansArray).forEach(([index, data]) => {
            gridRows.push({ "cut_no": data.cut_no, ...data.ratio_json, "total_plies": data.max_plies });
        });
        
        return gridRows;
    }

    // Get LayPlanning Grid Columns by OC
    function __getGridLayPlanningColumnsByOc(results) {
        let gridCols = [];
        
        gridCols["fpo_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_id", placeholder: "FPO ID", visible:false, editable: false, sqlColumn: "fpo_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        
        let i = 4;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "150px", width: "150px" } }
            i++;
        });

        gridCols["priority_seq"] = { objectType: "IntegerField", colIndex: i+1, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: true, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get LayMarker Grid Columns by OC
    function __getGridLayMarkerColumnsByOc(results) {
        let gridCols = [];
        
        gridCols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        
        let i = 2;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: true, sqlColumn: value, style: { textAlign: "left", minWidth: "150px", width: "150px" } }
            i++;
        });

        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: i+1, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get Cutting Grid Columns by OC
    function __getGridCuttingColumnsByOc(results) {
        let gridCols = [];
        
        gridCols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        
        let i = 2;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "150px", width: "150px" } }
            i++;
        });
        
        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: i+1, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get LayPlanning Grid Default Columns
    function __getGridLayPlanningDefaultColumns() {
        let gridCols = [];

        gridCols["fpo_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_id", placeholder: "FPO ID", visible:false, editable: false, sqlColumn: "fpo_id", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 7, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["priority_seq"] = { objectType: "IntegerField", colIndex: 8, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: true, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get LayMarker Grid Default Columns
    function __getGridLayMarkerDefaultColumns() {
        let gridCols = [];

        gridCols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: true, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: true, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: true, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: true, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get FPO Grid Default Columns
    function __getGridFpoDefaultColumns() {
        let gridCols = [];

        gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["soc_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        
        return gridCols;
    }

    // Get Cutting Grid Default Columns
    function __getGridCuttingDefaultColumns() {
        let gridCols = [];

        gridCols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Reset Grid LayPlanning
    function __resetGridLayPlanning(){
        let gridLayPlanningDefaultColumns = __getGridLayPlanningDefaultColumns();
        let gridLayPlanningDefaultRows = [];
        
        config["gridLayPlanning"].setColumns(gridLayPlanningDefaultColumns);
        config["gridLayPlanning"].setData(gridLayPlanningDefaultRows);
    }

    // Reset Grid LayMarker
    function __resetGridLayMarker(){
        let gridLayMarkerDefaultColumns = __getGridLayMarkerDefaultColumns();
        let gridLayMarkerDefaultRows = [];

        config["gridLayMarker"].setColumns(gridLayMarkerDefaultColumns);
        config["gridLayMarker"].setData(gridLayMarkerDefaultRows);
    }

    // Reset Grid Fpo
    function __resetGridFpo(){
        let gridFpoDefaultColumns = __getGridFpoDefaultColumns();
        let gridFpoDefaultRows = [];

        config["gridFpo"].setColumns(gridFpoDefaultColumns);
        config["gridFpo"].setData(gridFpoDefaultRows);
    }

    // Reset Grid Cutting
    function __resetGridCutting(){
        let gridCuttingDefaultColumns = __getGridCuttingDefaultColumns();
        let gridCuttingDefaultRows = [];

        config["gridCutting"].setColumns(gridCuttingDefaultColumns);
        config["gridCutting"].setData(gridCuttingDefaultRows);
    }

    // Get All
    async function __getAll() {
        try {
            const key = "Oc";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [
                "style:id,style_code,routing_id", 
                "style.routing:id,route_code", 
                "buyer:id,name,buyer_code"
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

    // Get Advance Search Details
    async function __getAdvanceSearchDetails(searchCriteria) {
        try {
            const apiRequest = {
                "Oc": {
                    "wfx_oc_no": searchCriteria.oc_no,
                    "pack_color": searchCriteria.pack_color,
                    "relations": [
                        {
                            "Style": {
                                "style_code": searchCriteria.style_code
                            }
                        },
                        {
                            "Buyer": {
                                "buyer_code": searchCriteria.buyer_code
                            }
                        }
                    ],
                    "orderby": "created_at:desc",
		            "limit": 25
                }
            };
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;
            console.log("***********details**********");
            console.log(details);
            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    function checkAllEmpty(array){
        return array.every(e => e === "");
    }

    // Get Oc List
    async function __getOcList() {
        try {
            const key = "Oc";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [
                "buyer:id,buyer_code"
            ];
            const orderby = "created_at:desc";
            const limit = 25;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetOcList Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Oc Lov Search Details
    async function __getOcLovSearchDetails(searchCriteria) {
        try {
            const apiRequest = {
                "Oc": {
                    "wfx_oc_no": searchCriteria.wfx_oc_no,
                    "relations": [
                        {
                            "Buyer": {
                                "buyer_code": searchCriteria.buyer_code
                            }
                        }
                    ],
                    "orderby": "created_at:desc",
		            "limit": 25
                }
            };
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            console.log("*******details********");
            console.log(details);
            
            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get OCId By No
    async function __getOCIdByNo(ocNo) {
        let Id = "";
        try {
            const key = "Oc";
            const distinct = false;
            const select = ["id"];
            const where = [
                {
                    "field-name": "wfx_oc_no",
                    "operator": "=",
                    "value": ocNo
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getId = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getId && getId !== "Error" && getId[0].Oc.length > 0) {
                Id = getId[0].Oc[0].id;
            }else{
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter valid OC No", "");
            }
        } catch (error) {
            console.log("***********GetOCIdByNo Error**********");
            console.log(error.response);
        }
        return Id;
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    async function handleBlurLovOc(){
        const ocNo = config["lovComboBoxOc"].data.value;
        if(ocNo !== ""){
            const ocId = await __getOCIdByNo(ocNo);
            if(ocId !== ""){
                config["lovComboBoxOc"].setValueWithId(ocNo, ocId);
                await handleChangeOcNo(ocId);
            }else{
                config["lovComboBoxOc"].setValueWithId("", "");
            }
        }
    }

    async function handleComboSearchOc(event){
        let rows = [];
        const getData = await __getOcList();

        let titles = { 
            id: { displayName:"ID", visible:false },
            wfx_oc_no: { displayName:"OC No", visible: true },
            buyer_code: { displayName: "Buyer Code", visible: true }
        }

        if (getData && getData !== "Error" && getData[0].Oc.length > 0) {
            const listData = getData[0].Oc;
            listData.forEach((value, index) => (
                rows.push({ 
                    "id": value.id,
                    "wfx_oc_no": value.wfx_oc_no, 
                    "buyer_code": value.buyer.buyer_code
                })
            ));
        }

        config["lovComboBoxOc"].showLovWindow(titles, rows)
    }

    async function handleLovDoneOc(event, lovRow){
        config["lovComboBoxOc"].setValueWithId(lovRow.wfx_oc_no, lovRow.id)
        const ocId = config["lovComboBoxOc"].data.id;
        await handleChangeOcNo(ocId);
    }

    async function handleLovSearchOc(event, searchCriteria, callback){
        console.log("**************Selected row from search***************")
        console.log(searchCriteria)

        let rows = [];
        let searchDetails = await __getOcLovSearchDetails(searchCriteria);

        if(searchDetails.length > 0){
            searchDetails.forEach((value, index) => (
                rows.push({ 
                    "id": value.id,
                    "wfx_oc_no": value.wfx_oc_no, 
                    "buyer_code": value.buyer.buyer_code
                })
            ));
        }

        console.log("*******Search Results********");
        console.log(rows);

        callback(rows);
    }

    async function handleAdvanceSearchPopup(){
        let data = [];
        const getData = await __getAll();

        if (getData && getData !== "Error" && getData[0].Oc.length > 0) {
            const listData = getData[0].Oc;
            listData.forEach((value, index) => (
                data.push({ 
                    "oc_no": value.wfx_oc_no, 
                    "buyer_code": value.buyer.buyer_code, 
                    "style_code": value.style.style_code, 
                    "pack_color": value.pack_color 
                })
            ));
        }

        console.log("*******All Data********");
        console.log(data);

        config["CONTROL_CENTER"].showAdvanceSearch(data);
    }

    async function handleAdvanceSearchDone(event, selectedRow){
        console.log("*******Search Return Row********");
        console.log(selectedRow);
        if(typeof selectedRow !== "undefined" && selectedRow.oc_no !== ""){
            document.getElementById("spinner").style.display = "";
            const ocId = await __getOCIdByNo(selectedRow.oc_no);
            if(ocId !== ""){
                config["lovComboBoxOc"].setValueWithId(selectedRow.oc_no, ocId);
                await formPopulate(ocId);
            }else{
                config["lovComboBoxOc"].setValueWithId("", "");
            }
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleAdvanceSearch(event, searchCriteria, callback){
        console.log("*******Search Criteria********");
        console.log(searchCriteria);

        let data = [];
        let searchDetails = await __getAdvanceSearchDetails(searchCriteria);

        if(searchDetails.length > 0){
            searchDetails.forEach((value, index) => (
                data.push({ 
                    "oc_no": value.wfx_oc_no, 
                    "buyer_code": value.buyer.buyer_code, 
                    "style_code": value.style.style_code, 
                    "pack_color": value.pack_color 
                })
            ));
        }

        console.log("*******Search Results********");
        console.log(data);
        
        callback(data);
    }

    function onChange(event) {
        event.preventDefault();
    }

    async function handleChangeOcNo(ocId) {
        //event.preventDefault();
        // Execute when OC No Dropdown Value Change
        try {
            config["selectorFPO"].resetCheckedList();
            __resetGridLayPlanning();
            __resetGridLayMarker();
            __resetGridFpo();
            __resetGridCutting();

            let fpoArray = [];
            
            let buyerCode = "";
            let buyerDepartment = "";
            let styleCode = "";
            let packColor = "";
            let noOfLaySheetsCreated = "";

            let laySheets = [{ value: "", text: "- Select Lay Sheet No -" }];

            document.getElementById("spinner").style.display = "";

            if(ocId !== ""){

                const getQtyJson = await __getQtyJsonByOc(ocId);
                
                let gridLayPlanningColumns = [];
                let gridLayMarkerColumns = [];
                let gridCuttingColumns = [];

                gridLayPlanningColumns = __getGridLayPlanningColumnsByOc(getQtyJson);
                gridLayMarkerColumns = __getGridLayMarkerColumnsByOc(getQtyJson);
                gridCuttingColumns = __getGridCuttingColumnsByOc(getQtyJson);
            
                config["gridLayPlanning"].setColumns(gridLayPlanningColumns);
                config["gridLayPlanning"].setData([]);

                config["gridLayMarker"].setColumns(gridLayMarkerColumns);
                config["gridLayMarker"].setData([]);

                config["gridCutting"].setColumns(gridCuttingColumns);
                config["gridCutting"].setData([]);

                const fpoList = await API.get(`ocs/${ocId}/getFpoList`);
                
                if(fpoList && fpoList.data.length > 0){
                    fpoList.data.forEach(data => {
                        const Display = ({ fpo_no, soc_no }) => <><div className="text-light-black">FPO No : {fpo_no}</div><div className="text-light-black">SOC No : {soc_no}</div></>
                        fpoArray.push({ "id": data.fpo_id, "display": <Display fpo_no={data.fpo_no} soc_no={data.soc_no} />, "selected": data.utilized ? true : false });
                    });
                }

                const ocDetails = await API.get(`ocs/${ocId}/layPlanningHeader`);
                if(ocDetails && ocDetails.data !== ""){
                    const ocData = ocDetails.data;
                    buyerCode = ocData.buyer_code;
                    buyerDepartment = ocData.buyer_department;
                    styleCode = ocData.style_code;
                    packColor = ocData.pack_color;
                    noOfLaySheetsCreated = ocData.no_of_laysheets;
                } else {
                    console.log("Please select valid OC No");
                }

                laySheets = await __getLaySheets(ocId);
            }

            document.getElementById("spinner").style.display = "none";

            config["selectorFPO"].items = fpoArray;
            
            config["inputBuyerCode"].setValue(buyerCode);
            config["inputBuyerDepartment"].setValue(buyerDepartment);
            config["inputStyleCode"].setValue(styleCode);
            config["inputPackColor"].setValue(packColor);
            config["inputNoOfLaySheetsCreated"].setValue(noOfLaySheetsCreated);
            
            config["inputLaySheetNo"].setOptions(laySheets, true);

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            console.log(error.response);
        }
        reRender();
    }

    async function handleChangeSelectorFPO(event, checkedList) {
        try {
            //__resetGridLayPlanning();
            //__resetGridLayMarker();
            config["gridLayPlanning"].setData([]);

            const colorQuantities = await API.post(`fpos/getColorQuantities`, checkedList);

            if (colorQuantities && colorQuantities.data[0].color_quantities.length > 0) {
                //let gridLayPlanningColumns = [];
                let gridLayPlanningRows = [];
                //let gridLayMarkerColumns = [];

                // Get LayPlanning Grid Columns
                //gridLayPlanningColumns = __getGridLayPlanningColumns(colorQuantities.data[0].color_quantities);
                // Get LayPlanning Grid Rows
                gridLayPlanningRows = __getGridLayPlanningRows(colorQuantities.data[0].color_quantities, colorQuantities.data[0].sum);

                // Get LayMarker Grid Columns
                //gridLayMarkerColumns = __getGridLayMarkerColumns(colorQuantities.data[0].color_quantities[0].qty_json);
                // Get LayMarker Grid Rows
                //gridLayMarkerRows = [{},{},{}];
                
                //config["gridLayPlanning"].setColumns(gridLayPlanningColumns);
                config["gridLayPlanning"].setData(gridLayPlanningRows);

                config["gridLayPlanning"].setRowReadOnly(gridLayPlanningRows.length - 1);

                //config["gridLayMarker"].setColumns(gridLayMarkerColumns);
                //config["gridLayMarker"].setData(gridLayMarkerRows);
            } else {
                console.log("No Data");
            }

        } catch (error) {
            console.log(error.response);
        }
    }

    async function handleChangeLaySheetNo(event) {
        try {
            //__resetGridFpo();
            //__resetGridCutting();
            config["gridFpo"].setData([]);
            config["gridCutting"].setData([]);

            const ocId = config["lovComboBoxOc"].data.id;
            const laySheetId = config["inputLaySheetNo"].data.value;

            if(ocId !== "" && laySheetId !== ""){
                let gridFpoColumns = [];
                let gridFpoRows = [];
                let gridCuttingColumns = [];
                let gridCuttingRows = [];

                const laySheetFpoDetails = await API.get(`laySheets/${laySheetId}/getDistinctFpos`);

                if (laySheetFpoDetails && laySheetFpoDetails !== "Error" && laySheetFpoDetails.data.length > 0) {
                    const fpoArray = laySheetFpoDetails.data;
                    // Get Fpo Columns
                    //gridFpoColumns = __getGridFpoColumns();
                    // Get Fpo Rows
                    gridFpoRows = __getGridFpoRows(fpoArray);
                    console.log("*********laySheetFpoDetails*************");
                    console.log(gridFpoRows);
                }

                const laySheetDetails = await __getLaySheetDetails(laySheetId);
                console.log("*********laySheetDetails*************");
                    console.log(laySheetDetails);

                if (laySheetDetails && laySheetDetails !== "Error" && laySheetDetails[0].CutPlan.length > 0) {
                    const cutPlansArray = laySheetDetails[0].CutPlan;
                    // Get Cutting Columns
                    //gridCuttingColumns = __getGridCuttingColumns(cutPlansArray[0]);
                    // Get Cutting Rows
                    gridCuttingRows = __getGridCuttingRows(cutPlansArray);
                }

                //config["gridFpo"].setColumns(gridFpoColumns);
                config["gridFpo"].setData(gridFpoRows);
    
                //config["gridCutting"].setColumns(gridCuttingColumns);
                config["gridCutting"].setData(gridCuttingRows);
            }

        } catch (error) {
            console.log(error.response);
        }
    }

    async function formPopulate(ocId) {
        try {
            config["selectorFPO"].resetCheckedList();
            __resetGridLayPlanning();
            __resetGridLayMarker();
            __resetGridFpo();
            __resetGridCutting();
            config["inputMaxPlies"].setValue("");

            let fpoArray = [];
            
            let buyerCode = "";
            let buyerDepartment = "";
            let styleCode = "";
            let packColor = "";
            let noOfLaySheetsCreated = "";

            let laySheets = [{ value: "", text: "- Select Lay Sheet No -" }];

            if(ocId !== ""){

                const getQtyJson = await __getQtyJsonByOc(ocId);
                
                let gridLayPlanningColumns = [];
                let gridLayMarkerColumns = [];
                let gridCuttingColumns = [];

                gridLayPlanningColumns = __getGridLayPlanningColumnsByOc(getQtyJson);
                gridLayMarkerColumns = __getGridLayMarkerColumnsByOc(getQtyJson);
                gridCuttingColumns = __getGridCuttingColumnsByOc(getQtyJson);
            
                config["gridLayPlanning"].setColumns(gridLayPlanningColumns);
                config["gridLayPlanning"].setData([]);

                config["gridLayMarker"].setColumns(gridLayMarkerColumns);
                config["gridLayMarker"].setData([]);

                config["gridCutting"].setColumns(gridCuttingColumns);
                config["gridCutting"].setData([]);

                const fpoList = await API.get(`ocs/${ocId}/getFpoList`);
                if(fpoList && fpoList.data.length > 0){
                    fpoList.data.forEach(data => {
                        const Display = ({ fpo_no, soc_no }) => <><div className="text-light-black">FPO No : {fpo_no}</div><div className="text-light-black">SOC No : {soc_no}</div></>
                        fpoArray.push({ "id": data.fpo_id, "display": <Display fpo_no={data.fpo_no} soc_no={data.soc_no} />, "selected": data.utilized ? true : false });
                    });
                }

                const ocDetails = await API.get(`ocs/${ocId}/layPlanningHeader`);
                if(ocDetails && ocDetails.data !== ""){
                    const ocData = ocDetails.data;
                    buyerCode = ocData.buyer_code;
                    buyerDepartment = ocData.buyer_department;
                    styleCode = ocData.style_code;
                    packColor = ocData.pack_color;
                    noOfLaySheetsCreated = ocData.no_of_laysheets;
                } else {
                    console.log("Please select valid OC No");
                }

                laySheets = await __getLaySheets(ocId);
            }

            config["selectorFPO"].items = fpoArray;
            
            config["inputBuyerCode"].setValue(buyerCode);
            config["inputBuyerDepartment"].setValue(buyerDepartment);
            config["inputStyleCode"].setValue(styleCode);
            config["inputPackColor"].setValue(packColor);
            config["inputNoOfLaySheetsCreated"].setValue(noOfLaySheetsCreated);
            
            config["inputLaySheetNo"].setOptions(laySheets);

        } catch (error) {
            console.log(error.response);
        }
        reRender();
    }

    function onPopulate(event) {
        event.preventDefault();
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...
        return dataArray;
    }

    function onDelete() {
        //Action handling when DELETE buttion clicked...
    }

    function onRefresh() {
        //Action handling when REFRESH buttion clicked...
    }

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    async function handleCreateLaySheet(event) {
        try {
            const ocId = config["lovComboBoxOc"].data.id;
            const maxPlies = config["inputMaxPlies"].data.value;
            let fpoList = [];
            let layMarkerList = [];

            const layPlanningDetails = config["gridLayPlanning"].data;
            console.log("**********layPlanningDetails************")
            console.log(layPlanningDetails)
            Object.entries(layPlanningDetails).forEach(([index, data]) => {
                if(data.fpo_no !== "Total"){
                    let fpoId = data.fpo_id;
                    fpoList.push(fpoId.toString());
                }
            });

            const layMarkerDetails = config["gridLayMarker"].data;
            let totalPliesStatus = [];
            let markerNameStatus = [];
            let markerNames = [];
            let qtyListStatus = [];

            Object.entries(layMarkerDetails).forEach(([index, data]) => {
                let markerName = data.marker_name;
                let totalPlies = data.total_plies;

                if(totalPlies === ""){
                    totalPliesStatus.push(false);
                }else{
                    totalPliesStatus.push(true);
                }

                if(markerName === ""){
                    markerNameStatus.push(false);
                }else{
                    markerNameStatus.push(true);
                }

                markerNames.push(markerName);

                const list = data;
                const newList = Object.keys(list).reduce((object, key) => {
                    if (key !== "marker_name" && key !== "total_plies" && key !== "_rowstate") {
                        object[key] = list[key];
                    }
                    return object;
                }, {});

                const qtyList = Object.values(newList);
                if(checkAllEmpty(qtyList)){
                    qtyListStatus.push(false);
                }else{
                    qtyListStatus.push(true);
                }

                layMarkerList.push({
                    "marker_name": markerName,
                    "qty_json": newList,
                    "total_plies": totalPlies
                });
            });

            const apiRequest = {
                "max_plies": maxPlies,
                "fpos": fpoList,
                "lay_marker_details": layMarkerList
            };

            console.log("**********apiRequest************")
            console.log(apiRequest)

            if(ocId !== "" && fpoList.length > 0 && layMarkerList.length > 0 && markerNameStatus.every(Boolean) && !hasDuplicates(markerNames) && qtyListStatus.every(Boolean) && totalPliesStatus.every(Boolean) && maxPlies !== ""){

                document.getElementById("spinner").style.display = "";

                const createLaySheet = await API.post(`ocs/${ocId}/createLaySheet`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("**********createLaySheet************")
                console.log(createLaySheet)
                if(createLaySheet.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                    await formPopulate(ocId);
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                }
            }else{
                if(ocId === ""){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select OC No", "");
                }else if(fpoList.length === 0){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select FPO", "");
                }else if(layMarkerList.length === 0){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Lay Marker Details", "");
                }else if(!markerNameStatus.every(Boolean)){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Marker Name", "");
                }else if(hasDuplicates(markerNames)){
                    config["CONTROL_CENTER"].promptWarningMessage("Identical Marker Names exists in multiple records", "");
                }else if(!qtyListStatus.every(Boolean)){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Ratio Quantity", "");
                }else if(!totalPliesStatus.every(Boolean)){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Total Plies", "");
                }else if(maxPlies === ""){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Max Plies", "");
                }
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

    async function handleDeleteLaySheet(){
        try {
            const ocId = config["lovComboBoxOc"].data.id;
            const laySheetId = config["inputLaySheetNo"].data.value;
            if(ocId !== "" && laySheetId !== ""){
                const apiRequest = {
                    "LaySheet": {
                        "DEL": [laySheetId]
                    }
                };

                console.log("**********apiRequest************")
                console.log(apiRequest)

                document.getElementById("spinner").style.display = "";
                    
                const deleteLaySheet = await API.post(`masterDetails`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("********deleteLaySheet*********");
                console.log(deleteLaySheet);

                if (deleteLaySheet.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Deleted Successfully", "");
                    await formPopulate(ocId);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            }else{
                if(ocId === ""){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select OC No", "");
                }else if(laySheetId === ""){
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select LaySheet No", "");
                }
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

    function onSaveNew(dataArr) {
        console.log("********dataArr*********");
        console.log(dataArr);
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    function onSaveModify(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    function onSaveDelete(dataArr) {
        let resultArr = {}
        //Your code goes here...
        return resultArr
    }

    return generateLayPlanningDisplay(config)
}

export default LayPlanning;