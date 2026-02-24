import React, { useEffect, useState } from 'react';
import { generateRatioPlanningDisplay } from './RatioPlanningDS';
import config from './RatioPlanningCS';
import API from '../../../api/API';
import readXlsxFile from 'read-excel-file';

const RatioPlanning = () => {
    let [rendered, setRendered] = useState(true)

    function reRender() {
        setRendered(!rendered)
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender

    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["inputCombineOrderNo"].event.onChange = handleChangeCombineOrderNo;
    config["inputViewFabricNo"].event.onChange = handleChangeViewFabricNo;
    config["buttonCreateCutPlan"].event.onClick = handleCreateCutPlan;
    config["buttonDeleteCutPlan"].event.onClick = handleDeleteMaster;
    config["buttonDeleteCut"].event.onClick = handleDeleteCut;
    config["buttonDeleteMasterYes"].event.onClick = handleDeleteMasterYes;
    config["buttonDeleteMasterNo"].event.onClick = handleDeleteMasterNo;
    config["buttonConsumptionReport"].event.onClick = handlePrintConsumptionReport;
    config["buttonCutReport"].event.onClick = handleCutReport;
    config["buttonBundleTag"].event.onClick = handleBundleTag;
    config["buttonPrintTag"].event.onClick = handleBundleTagYes;
    config["buttonPrintTagCancel"].event.onClick = handleBundleTagcancel;

    config["buttonBundleTagNew"].event.onClick = handleBundleTagReportNew;
    config["buttonBundleDetails"].event.onClick = handleBundleDetailReport;
    config["buttonNumbering"].event.onClick = handleBundleNumbering;

    config["buttonSaveRemarks"].event.onClick = handleSaveRemarks;
    config["inputReportCutNo"].event.onChange = handleChangeReportCutNo;
    config["buttonSaveTolerance"].event.onClick = handleSaveTolerance;
    config['buttonUploadRatioPlan'].event.onClick = handleUploadRatioPlan;

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

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "ratioPlanning" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonCreateCutPlan"].setVisible(false);
            config["buttonDeleteCutPlan"].setVisible(false);
            config["gridLayMarker"].setModeEditable(false);
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

    // Get QtyJson By Style Id
    async function __getQtyJsonByStyle(styleId) {
        let qtyJson = [];
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
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1;

            const getDetails = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getDetails && getDetails !== "Error" && getDetails[0].Style.length > 0) {
                qtyJson = getDetails[0].Style[0].size_fit
            } else {
                console.log("No Data Available");
            }

        } catch (error) {
            console.log("***********GetQtyJsonByStyle Error**********");
            console.log(error.response);
        }

        return qtyJson;
    }

    // Get ViewCombineOrder Grid Columns
    function __getGridViewCombineOrderColumns(results) {
        let gridCols = [];

        gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["soc_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };

        let i = 4;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "100px", width: "100px" } }
            i++;
        });

        gridCols["priority_seq"] = { objectType: "IntegerField", colIndex: i + 1, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: false, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["tolerance"] = { objectType: "TextBox", colIndex: 8, datatype: "text", name: "tolerance", placeholder: "Tolerance %", editable: true, sqlColumn: "tolerance", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    /////////////////  Get Total Quantity columns  //////
    function __getGridSOCQuantityColumns(results){
        let gridCols = [];
        gridCols["heading"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "heading", placeholder: "", editable: false, sqlColumn: "heading", style: { textAlign: "left", minWidth: "600px", width: "600px" } }

        let i = 2;
        results.forEach((value, index) => {
          
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "100px", width: "100px" } }
            i++;
        });

        return gridCols;
    }

    // Get LayMarker Grid Columns
    function __getGridLayMarkerColumns(results) {
        let gridCols = [];

        gridCols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["yrds"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "yrds", placeholder: "Yrds", editable: true, sqlColumn: "yrds", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["inch"] = { objectType: "NumberField", colIndex: 3, datatype: "text", name: "inch", placeholder: "Inch", editable: true, sqlColumn: "inch", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["accwidth"] = { objectType: "NumberField", colIndex: 4, datatype: "text", name: "accwidth", placeholder: "Acc Width", editable: true, sqlColumn: "accwidth", style: { textAlign: "left", minWidth: "100px", width: "100px" } };

        let i = 5;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: true, sqlColumn: value, style: { textAlign: "left", minWidth: "100px", width: "100px" } }
            i++;
        });

        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: i + 1, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get CutPlan Grid Columns
    function __getGridCutPlanColumns(results) {
        let gridCols = [];

        gridCols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["cut_id"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_id", placeholder: "Cut ID", editable: false, sqlColumn: "cut_id", visible:false, style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        let i = 2;
        results.forEach((value, index) => {
            gridCols[value] = { objectType: "IntegerField", colIndex: i, datatype: "text", name: value, placeholder: value, editable: false, sqlColumn: value, style: { textAlign: "left", minWidth: "100px", width: "100px" } }
            i++;
        });

        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: i + 1, datatype: "text", name: "total_plies", placeholder: "Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["actual_plies"] = { objectType: "IntegerField", colIndex: i + 1, datatype: "text", name: "actual_plies", placeholder: " Actual Plies", editable: false, sqlColumn: "actual_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get ViewCombineOrder Grid Default Columns
    function __getGridViewCombineOrderDefaultColumns() {
        let gridCols = [];

        gridCols["fpo_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "fpo_no", placeholder: "FPO No", editable: false, sqlColumn: "fpo_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["soc_no"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "soc_no", placeholder: "SOC No", editable: false, sqlColumn: "soc_no", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["garment_color"] = { objectType: "TextBox", colIndex: 3, datatype: "text", name: "garment_color", placeholder: "Garment Color", editable: false, sqlColumn: "garment_color", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 7, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["priority_seq"] = { objectType: "IntegerField", colIndex: 8, datatype: "text", name: "priority_seq", placeholder: "Priority Sequence", editable: false, sqlColumn: "priority_seq", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get LayMarker Grid Default Columns
    function __getGridLayMarkerDefaultColumns() {
        let gridCols = [];

        gridCols["marker_name"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "marker_name", placeholder: "Marker Name", editable: true, sqlColumn: "marker_name", style: { textAlign: "left", minWidth: "200px", width: "200px" } };
        gridCols["yrds"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "yrds", placeholder: "Yrds", editable: true, sqlColumn: "yrds", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["inch"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "inch", placeholder: "Inch", editable: true, sqlColumn: "inch", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["accwidth"] = { objectType: "NumberField", colIndex: 2, datatype: "text", name: "accwidth", placeholder: "Acc Width", editable: true, sqlColumn: "accwidth", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: true, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: true, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: true, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: true, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Total Plies", editable: true, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Get CutPlan Grid Default Columns
    function __getGridCutPlanDefaultColumns() {
        let gridCols = [];

        gridCols["cut_no"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "cut_no", placeholder: "Cut No", editable: false, sqlColumn: "cut_no", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["L"] = { objectType: "IntegerField", colIndex: 2, datatype: "text", name: "L", placeholder: "L", editable: false, sqlColumn: "L", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["M"] = { objectType: "IntegerField", colIndex: 3, datatype: "text", name: "M", placeholder: "M", editable: false, sqlColumn: "M", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["S"] = { objectType: "IntegerField", colIndex: 4, datatype: "text", name: "S", placeholder: "S", editable: false, sqlColumn: "S", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["XL"] = { objectType: "IntegerField", colIndex: 5, datatype: "text", name: "XL", placeholder: "XL", editable: false, sqlColumn: "XL", style: { textAlign: "left", minWidth: "100px", width: "100px" } };
        gridCols["total_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "total_plies", placeholder: "Plies", editable: false, sqlColumn: "total_plies", style: { textAlign: "left", minWidth: "150px", width: "150px" } };
        gridCols["Actual_plies"] = { objectType: "IntegerField", colIndex: 6, datatype: "text", name: "actual_layers", placeholder: "actual_layers", editable: false, sqlColumn: "actual_layers", style: { textAlign: "left", minWidth: "150px", width: "150px" } };

        return gridCols;
    }

    // Reset Grid LayMarker
    function __resetGridLayMarker() {
        let gridLayMarkerDefaultColumns = __getGridLayMarkerDefaultColumns();
        let gridLayMarkerDefaultRows = [];

        config["gridLayMarker"].setColumns(gridLayMarkerDefaultColumns);
        config["gridLayMarker"].setData(gridLayMarkerDefaultRows);
    }

    // Reset Grid CutPlan
    function __resetGridCutPlan() {
        let gridCutPlanDefaultColumns = __getGridCutPlanDefaultColumns();
        let gridCutPlanDefaultRows = [];

        config["gridCutPlan"].setColumns(gridCutPlanDefaultColumns);
        config["gridCutPlan"].setData(gridCutPlanDefaultRows);
    }

    // Reset Grid ViewCombineOrder
    function __resetGridViewCombineOrder() {
        let gridViewCombineOrderDefaultColumns = __getGridViewCombineOrderDefaultColumns();
        let gridViewCombineOrderDefaultRows = [];

        config["gridViewCombineOrder"].setColumns(gridViewCombineOrderDefaultColumns);
        config["gridViewCombineOrder"].setData(gridViewCombineOrderDefaultRows);
    }

    async function __getAllAdvanceSearchDetails() {
        try {
            const getSearchDetails = await API.post(`combineOrders/getSearchByStyleRefCode`);
            const details = getSearchDetails.data;

            console.log("***********GetAllAdvanceSearchDetails**********");
            console.log(details);

            return details;

        } catch (error) {
            console.log("***********GetAllAdvanceSearchDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Advance Search Details
    async function __getAdvanceSearchDetails(searchCriteria) {
        try {
            let apiRequest = {
                "combine_order_no": searchCriteria.combine_order_no_search,
                "buyer_code": searchCriteria.buyer_code_search,
                "customer_style_ref": searchCriteria.customer_style_reference_search,
                "style_code": searchCriteria.style_code_search,
                "soc_no": searchCriteria.soc_no_search,
                "fpo": searchCriteria.fpo_no_search
            };

            console.log("***********apiRequest**********");
            console.log(apiRequest);

            //const getSearchDetails = await API.post(`socs/getSearchByCustomerStyleRefCode`, apiRequest);
            const getSearchDetails = await API.post(`combineOrders/getSearchResultByStyleRefCode`, apiRequest);
            const details = getSearchDetails.data;

            console.log("***********AdvanceSearchDetails**********");
            console.log(details);

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    function __checkAllEmpty(array) {
        return array.every(e => e === "");
    }

    function __hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    async function handleAdvanceSearchPopup() {
        let data = [];
        const getData = await __getAllAdvanceSearchDetails();

        if (getData && getData !== "Error" && getData.length > 0) {
            getData.forEach((value, index) => (
                data.push({
                    "soc_no_search": value.soc_no,
                    "fpo_no_search": value.fpo_no,
                    "buyer_id": value.buyer_id,
                    "buyer_code_search": value.buyer_code,
                    "style_id": value.style_id,
                    "style_code_search": value.style_code,
                    "customer_style_reference_search": value.customer_style_ref,
                    "combine_order_no_search": value.combine_order_no,
                    "combine_order_id": value.combine_order_id,
                })
            ));
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

    async function handleAdvanceSearchDone(event, selectedRow) {
        console.log("*******Search Return Row********");
        console.log(selectedRow);
        let buyerId = selectedRow.buyer_id;
        let buyerCode = selectedRow.buyer_code_search;
        let styleId = selectedRow.style_id;
        let styleCode = selectedRow.style_code_search;
        let customerStyleRef = selectedRow.customer_style_reference_search;
        let combineOrderId = selectedRow.combine_order_id;
        

        if (typeof selectedRow !== "undefined" && buyerId !== "" && styleId !== "" && customerStyleRef != "") {
            document.getElementById("spinner").style.display = "";

            config["inputBuyerId"].setValue(buyerId);
            config["inputBuyerCode"].setValue(buyerCode);
            config["inputStyleId"].setValue(styleId);
            config["inputStyleCode"].setValue(styleCode);
            config["inputCustomerStyleReference"].setValue(customerStyleRef);

            await getFPODetails(styleId, buyerId, customerStyleRef, combineOrderId);

            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleAdvanceSearch(event, searchCriteria, callback) {
        console.log("*******Search Criteria********");
        console.log(searchCriteria);

        let data = [];
        let searchDetails = await __getAdvanceSearchDetails(searchCriteria);

        if (searchDetails.length > 0) {
            searchDetails.forEach((value, index) => (
                data.push({
                    "soc_no_search": value.soc_no,
                    "fpo_no_search": value.fpo_no,
                    "buyer_id": value.buyer_id,
                    "buyer_code_search": value.buyer_code,
                    "style_id": value.style_id,
                    "style_code_search": value.style_code,
                    "customer_style_reference_search": value.customer_style_ref,
                    "combine_order_id": value.combine_order_id,
                    "combine_order_no_search": value.combine_order_no
                })
            ));
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

    function onChange(event) {
        event.preventDefault();
    }

    async function getFPODetails(styleId, buyerId, customerStyleRef, combineOrderId) {

        try {
            __resetGridViewCombineOrder();
            __resetGridLayMarker();
            __resetGridCutPlan();

            config["inputFabricNo"].setValue("");
            config["inputMainFabric"].setValue("0");
            config["inputMaxPlies"].setValue("");
            config["inputViewFabricNo"].setValue("");

            //let combineOrderNos = [{ value: "", text: "- Select Combine Order No -" }];
            let combineOrderNos = [];
            let fabricNos = [{ value: "", text: "- Select Fabric No -" }];
            let viewFabricNos = [{ value: "", text: "- Select Fabric No -" }];

            let gridLayMarkerColumns = [];
            let gridLayMarkerRows = [];

            let gridCutPlanColumns = [];
            let gridCutPlanRows = [];

            let gridViewCombineOrderColumns = [];
            let gridViewTotalQuantityColumns = [];
            let gridViewCombineOrderRows = [];
            let gridViewTotalQuantityRows = [];

            let mainFabricStatus = [];

            document.getElementById("spinner").style.display = "";
            let cmb_id = "";
            if (styleId !== "" && buyerId !== "" && customerStyleRef !== "") {

                const apiRequest = {
                    "buyer_id": buyerId,
                    "customer_style_ref": customerStyleRef,
                    "style_id": styleId
                };

                const getCombineOrderNos = await API.post(`combineOrders/getCombineOrdersByStyleRef`, apiRequest);
                
                if (getCombineOrderNos && getCombineOrderNos.data.length > 0) {
                    getCombineOrderNos.data.forEach(data => {
                        //combineOrderNos.push({ "value": data.id, "text": data.combine_order_no });
                        combineOrderNos.push({ "value": data.id, "text": data.combine_order_no });
                        if(cmb_id === ""){
                            cmb_id = data.id;
                        }
                    });
                    combineOrderNos.sort((a, b) => parseFloat(a.text) - parseFloat(b.text));
                }

                console.log("*******combineOrderNos********");
                console.log(combineOrderNos);
                
                const getQtyJson = await __getQtyJsonByStyle(styleId);
                gridLayMarkerColumns = __getGridLayMarkerColumns(getQtyJson);
                gridCutPlanColumns = __getGridCutPlanColumns(getQtyJson);
                gridViewCombineOrderColumns = __getGridViewCombineOrderColumns(getQtyJson);
                gridViewTotalQuantityColumns = __getGridSOCQuantityColumns(getQtyJson);
                

            }

            if (combineOrderId !== "") {
                gridViewTotalQuantityRows = await getTotalQuantity();
                let apiRequest = {
                    "id": combineOrderId
                }

                const combineOrderDetails = await API.post(`combineOrders/getConnectedFpos`, apiRequest);

                console.log("**********combineOrderDetails************");
                console.log(combineOrderDetails);

                if (combineOrderDetails && combineOrderDetails.data.length > 0) {
                    combineOrderDetails.data.forEach(data => {
                        gridViewCombineOrderRows.push({
                            "fpo_no": data.wfx_fpo_no,
                            "soc_no": data.wfx_soc_no,
                            "garment_color": data.garment_color,
                            ...data.qty_json,
                            "priority_seq": data.priority_seq,
                            "tolerance": data.tolerance
                        });
                    });
                }

                console.log("**********gridViewCombineOrderRows************");
                console.log(gridViewCombineOrderRows);

                const getFabricNos = await API.post(`combineOrders/getFabricInfo`, apiRequest);

                console.log("**********getFabricNos************");
                console.log(getFabricNos);

                if (getFabricNos.data.length === 1) {
                    config["inputMainFabric"].setValue("1");
                }

                if (getFabricNos && getFabricNos.data.length > 0) {
                    getFabricNos.data.forEach(data => {
                        // if (data.utilized === 0 || data.utilized === 1) {
                        //     fabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                        // } else if (data.utilized === 1) {
                        //     viewFabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                        // }

                        ///////////////////// Update ///////////////////
                        fabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                         if (data.utilized === 1) {
                                viewFabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                            }

                        //////////////////////////////////////////////////////////////////////


                        if (data.main_fabric === 1) {
                            mainFabricStatus.push(true);
                        } else {
                            mainFabricStatus.push(false);
                        }
                    });
                }

                if (fabricNos.length === 2 && !mainFabricStatus.includes(true)) {
                    config["inputMainFabric"].setValue("1");
                }

                console.log("*******fabricNos********");
                console.log(fabricNos);
                console.log("*******viewFabricNos********");
                console.log(viewFabricNos);
                console.log("*******mainFabricStatus********");
                console.log(mainFabricStatus);

                if (mainFabricStatus.includes(true)) {
                    document.getElementById("main-fabric-div").style.display = "none";
                    config["inputMainFabric"].setValue("0");
                } else {
                    document.getElementById("main-fabric-div").style.display = "";
                }
            }

            config["gridViewCombineOrder"].setColumns(gridViewCombineOrderColumns);
            config["gridViewCombineOrder"].setData(gridViewCombineOrderRows);

            
            config["gridTotalQuantity"].setColumns(gridViewTotalQuantityColumns);
            
            /////////  Append Total Columns Data  /////////////////
            let gridTotalQuantityRows = [];    
            let totalQuantity = { ...{ "heading": "Total Quantity" }, ...gridViewTotalQuantityRows.sum };
            let totalQuantityWithTolerance = { ...{ "heading": "Total Quantity With Tolerance" }, ...gridViewTotalQuantityRows.sum_with_tolerancer };    
            gridTotalQuantityRows = [totalQuantity, totalQuantityWithTolerance];  
    
            config["gridTotalQuantity"].setData(gridTotalQuantityRows);

            config["gridLayMarker"].setColumns(gridLayMarkerColumns);
            config["gridLayMarker"].setData(gridLayMarkerRows);

            config["gridCutPlan"].setColumns(gridCutPlanColumns);
            config["gridCutPlan"].setData(gridCutPlanRows);

            config["inputCombineOrderNo"].setOptions(combineOrderNos);
            config["inputFabricNo"].setOptions(fabricNos, true);
            config["inputViewFabricNo"].setOptions(viewFabricNos, true);
            reRender();
            config["inputCombineOrderNo"].setValue(combineOrderId);
            await handleChangeCombineOrderNo();

            document.getElementById("spinner").style.display = "none";

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            console.log(error.response);
        }
    }

    async function getTotalQuantity(){
        // try{
            const combineOrderId = config["inputCombineOrderNo"].data.value;
            
            let TotalJson = {};
            
            if(combineOrderId !== ""){
                const apiRequest = {
                    "combine_order_id": combineOrderId,
                    
                }
    
                console.log("********apiRequest*********");
                console.log(JSON.stringify(apiRequest));
    
                let getTotal = await API.post(`combineOrders/getCombineOrderTotalQty`, apiRequest);
    
                TotalJson = getTotal.data;
            }

             return TotalJson;
         // } catch (error) {
         //     getBalanceQuantityJson();
         // }
     }

    async function handleChangeCombineOrderNo(event) {
        try {
            config["gridViewCombineOrder"].setData([]);
            config["gridCutPlan"].setData([]);
            config["inputMainFabric"].setValue("0");
            let fabricNos = [{ value: "", text: "- Select Fabric No -" }];
            let viewFabricNos = [{ value: "", text: "- Select Fabric No -" }];
            let mainFabricStatus = [];
            let gridViewCombineOrderRows = [];

            const combineOrderId = config["inputCombineOrderNo"].data.value;
            
            if (combineOrderId !== "") {

                let apiRequest = {
                    "id": combineOrderId
                }

                const combineOrderDetails = await API.post(`combineOrders/getConnectedFpos`, apiRequest);

                console.log("**********combineOrderDetails************");
                console.log(combineOrderDetails);

                if (combineOrderDetails && combineOrderDetails.data.length > 0) {
                    combineOrderDetails.data.forEach(data => {
                        gridViewCombineOrderRows.push({
                            "fpo_no": data.wfx_fpo_no,
                            "soc_no": data.wfx_soc_no,
                            "garment_color": data.garment_color,
                            ...data.qty_json,
                            "priority_seq": data.priority_seq,
                            "tolerance": data.tolerance
                        });
                    });
                }

                console.log("**********gridViewCombineOrderRows************");
                console.log(gridViewCombineOrderRows);

                const getFabricNos = await API.post(`combineOrders/getFabricInfo`, apiRequest);

                console.log("**********getFabricNos************");
                console.log(getFabricNos);

                if (getFabricNos.data.length === 1) {
                    config["inputMainFabric"].setValue("1");
                }

                if (getFabricNos && getFabricNos.data.length > 0) {
                    getFabricNos.data.forEach(data => {
                        // if (data.utilized === 0) {
                        //     fabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                        // } else if (data.utilized === 1) {
                        //     viewFabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                        // }

                        ///////////////////// Update ///////////////////
                        fabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                        if (data.utilized === 1) {
                                viewFabricNos.push({ "value": data.fabric_id, "text": data.fabric });
                            }

                        //////////////////////////////////////////////////////////////////////

                        if (data.main_fabric === 1) {
                            mainFabricStatus.push(true);
                        } else {
                            mainFabricStatus.push(false);
                        }
                    });
                }

                if (fabricNos.length === 2 && !mainFabricStatus.includes(true)) {
                    config["inputMainFabric"].setValue("1");
                }

                console.log("*******fabricNos********");
                console.log(fabricNos);
                console.log("*******viewFabricNos********");
                console.log(viewFabricNos);
                console.log("*******mainFabricStatus********");
                console.log(mainFabricStatus);

                if (mainFabricStatus.includes(true)) {
                    document.getElementById("main-fabric-div").style.display = "none";
                    config["inputMainFabric"].setValue("0");
                } else {
                    document.getElementById("main-fabric-div").style.display = "";
                }
            }

            config["gridViewCombineOrder"].setData(gridViewCombineOrderRows);

            let gridViewTotalQuantityRows = await getTotalQuantity();
            let gridTotalQuantityRows = [];

            let totalQuantity = { ...{ "heading": "Total Quantity" }, ...gridViewTotalQuantityRows.sum };
            let totalQuantityWithTolerance = { ...{ "heading": "Total Quantity With Tolerance" }, ...gridViewTotalQuantityRows.sum_with_tolerancer };    
            gridTotalQuantityRows = [totalQuantity, totalQuantityWithTolerance];  

            config["gridTotalQuantity"].setData(gridTotalQuantityRows);

            config["inputFabricNo"].setOptions(fabricNos, true);
            config["inputViewFabricNo"].setOptions(viewFabricNos, true);

        } catch (error) {
            console.log(error.response);
        }
    }

    async function handleChangeViewFabricNo(event) {
        try {
            const combineOrderId = config["inputCombineOrderNo"].data.value;
            const fabricId = config["inputViewFabricNo"].data.value;
            config["gridCutPlan"].setData([]);
            let gridCutPlanRows = [];
            let rptCutNo =[{ "value": "", "text": "- Select Fabric No -" }];

            if (fabricId !== "") {

                let apiRequest = {
                    "combine_order_id": combineOrderId,
                    "fabric_id": fabricId
                }

                const cutPlanDetails = await API.post(`cutPlans/getCutPlan`, apiRequest);

                console.log("**********cutPlanDetails************");
                console.log(cutPlanDetails);

                if (cutPlanDetails && cutPlanDetails.data.length > 0) {
                    cutPlanDetails.data.forEach(data => {
                        gridCutPlanRows.push({
                            "cut_no": data.cut_no,
                            "cut_id":data.id,
                            ...data.ratio_json,
                            "total_plies": data.max_plies,
                            "actual_plies": data.actual_layers
                        });

                        ///////////////  Set option for inputReportCutNo //////////////////
                        rptCutNo.push({ "value": data.id, "text": data.cut_no });
                    });
                }

                console.log("**********gridCutPlanRows************");
                console.log(gridCutPlanRows);
            }

            config["gridCutPlan"].setData(gridCutPlanRows);
            config["inputReportCutNo"].setOptions(rptCutNo, true);

        } catch (error) {
            console.log(error.response);
        }
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

    async function handleCreateCutPlan(event) {
        try {
            const buyerId = config["inputBuyerId"].data.value;
            const styleId = config["inputStyleId"].data.value;
            const customerStyleRef = config["inputCustomerStyleReference"].data.value;
            const combineOrderId = config["inputCombineOrderNo"].data.value;
            const fabricId = config["inputFabricNo"].data.value;
            const mainFabric = config["inputMainFabric"].data.value;
            const maxPlies = config["inputMaxPlies"].data.value;
            const shadeWiseBundle = config["inputShadeWiseBundle"].data.value;

            const layMarkerDetails = config["gridLayMarker"].data;
            let layMarkerList = [];
            let totalPliesStatus = [];
            let totalPliesZeroStatus = [];
            let markerNameStatus = [];
            let markerNames = [];
            let yrdsStatus =[];
            let inchStatus =[];
            let accWidthStatus =[];
            let qtyListStatus = [];
            let yards_inch_status = true;

            Object.entries(layMarkerDetails).forEach(([index, data]) => {
                let markerName = data.marker_name;
                let totalPlies = data.total_plies;
                let yrd = data.yrds;
                let inch = data.inch;
                let accWidth = data.accwidth;

                

                if (totalPlies === "") {
                    totalPliesStatus.push(false);
                } else {
                    totalPliesStatus.push(true);
                }
                if (yrd === "") {
                    yrdsStatus.push(false);
                } else {
                    yrdsStatus.push(true);
                }
                if (inch === "") {
                    inchStatus.push(false);
                } else {
                    inchStatus.push(true);
                }
                if(!(parseFloat(yrd) > 0 || parseFloat(inch) > 0)){
                    yards_inch_status = false;
                }
                if (accWidth === "") {
                    accWidthStatus.push(false);
                } else {
                    accWidthStatus.push(true);
                }

                if (parseInt(totalPlies) === 0) {
                    totalPliesZeroStatus.push(false);
                } else {
                    totalPliesZeroStatus.push(true);
                }

                if (markerName === "") {
                    markerNameStatus.push(false);
                } else {
                    markerNameStatus.push(true);
                }

                markerNames.push(markerName);

                const list = data;
                const newList = Object.keys(list).reduce((object, key) => {
                    if (key !== "marker_name" && key !== "total_plies" && key !== "_rowstate" && key !== "yrds" && key !== "inch" && key !== "accwidth") {
                        object[key] = list[key];
                        
                    }
                    return object;
                }, {});
                console.log("**************************");
                console.log(newList);
                const qtyList = Object.values(newList);
                if (__checkAllEmpty(qtyList)) {
                    qtyListStatus.push(false);
                } else {
                    qtyListStatus.push(true);
                }

                layMarkerList.push({
                    "marker_name": markerName,
                    "qty_json": newList,
                    "total_plies": totalPlies,
                    "yrds":yrd,
                    "inch":inch,
                    "acc_width":accWidth
                });
            });

            const apiRequest = {
                "combine_order_id": combineOrderId,
                "fabric_id": fabricId,
                "main_fabric": mainFabric === "1" ? 1 : 0,
                "max_plies": maxPlies,
                "lay_marker_details": layMarkerList,
                "shadeWiseBundle":shadeWiseBundle === "1" ? 1 : 0
            };

            console.log("**********apiRequest************")
            console.log(apiRequest)

            if (combineOrderId !== "" && fabricId !== "" && maxPlies !== "" && parseInt(maxPlies) !== 0 && layMarkerList.length > 0 && markerNameStatus.every(Boolean) && !__hasDuplicates(markerNames) && qtyListStatus.every(Boolean) && totalPliesStatus.every(Boolean) && yards_inch_status && totalPliesZeroStatus.every(Boolean)  && accWidthStatus.every(Boolean)) {

                document.getElementById("spinner").style.display = "";

                const generateCutPlan = await API.post(`combineOrders/generateCutPlan`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("**********generateCutPlan************")
                console.log(generateCutPlan)

                if (generateCutPlan.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                    await getFPODetails(styleId, buyerId, customerStyleRef, combineOrderId);
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                }
            } else {
                if (combineOrderId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Combine Order No", "");
                } else if (fabricId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Fabric No", "");
                } else if (maxPlies === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Max Plies", "");
                } else if (parseInt(maxPlies) === 0) {
                    config["CONTROL_CENTER"].promptWarningMessage("Max Plies should be Greater than 0", "");
                } else if (layMarkerList.length === 0) {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Lay Marker Details", "");
                } else if (!markerNameStatus.every(Boolean)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Marker Name", "");
                } else if (__hasDuplicates(markerNames)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Identical Marker Names exists in multiple records", "");
                } else if (!qtyListStatus.every(Boolean)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Ratio Quantity", "");
                } else if (!totalPliesStatus.every(Boolean)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Total Plies", "");
                } else if (!totalPliesZeroStatus.every(Boolean)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Total Plies should be Greater than 0", "");
                }

                // else if (!yrdsStatus.every(Boolean)) {
                //     config["CONTROL_CENTER"].promptWarningMessage("Yrds should be Greater than 0", "");
                // }
                // else if (!inchStatus.every(Boolean)) {
                //     config["CONTROL_CENTER"].promptWarningMessage("Inch should be Greater than 0", "");
                // }
                else if (!yards_inch_status){
                    config["CONTROL_CENTER"].promptWarningMessage("Length should be Greater than 0", "");
                }
                else if (!accWidthStatus.every(Boolean)) {
                    config["CONTROL_CENTER"].promptWarningMessage("Acc Width should be Greater than 0", "");
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

    function handleDeleteMaster(event) {
        const combineOrderId = config["inputCombineOrderNo"].data.value;
        const fabricId = config["inputViewFabricNo"].data.value;

        if (combineOrderId !== "" && fabricId !== "") {
            config["deleteMasterPopUp"].showPopUp();
        } else {
            if (combineOrderId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select Combine Order No", "");
            } else if (fabricId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select Fabric No", "");
            }
        }
    }

    async function handleDeleteCut(){
        try{
            const cutPlan = config["gridCutPlan"].data;
            let cut = [];
            Object.entries(cutPlan).forEach(([index, data]) => {
                

                if(data._rowstate== "DELETED"){
                    cut.push(data.cut_id);
                }
            });
            console.log(cut);
            const apiRequest = {
                "cut_no": cut
            };
            document.getElementById("spinner").style.display = "";
            const deleteCut = await API.post(`fpoCutPlans/deleteCut`, apiRequest);
            document.getElementById("spinner").style.display = "none";

            if (deleteCut.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Delete Successfully", "");
                handleChangeViewFabricNo();
                
            } else {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
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

    async function handleDeleteMasterYes() {
        try {
            const buyerId = config["inputBuyerId"].data.value;
            const styleId = config["inputStyleId"].data.value;
            const customerStyleRef = config["inputCustomerStyleReference"].data.value;

            const combineOrderId = config["inputCombineOrderNo"].data.value;
            const fabricId = config["inputViewFabricNo"].data.value;

            if (combineOrderId !== "" && fabricId !== "") {

                config["deleteMasterPopUp"].closePopUp();

                const apiRequest = {
                    "combine_order_id": combineOrderId,
                    "style_fabric_id": fabricId
                };

                console.log("**********apiRequest************")
                console.log(apiRequest)

                document.getElementById("spinner").style.display = "";

                const deleteCutPlan = await API.post(`cutPlans/deleteCutPlansByCombineOrder`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("********deleteCutPlan*********");
                console.log(deleteCutPlan);

                if (deleteCutPlan.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Deleted Successfully", "");
                    await getFPODetails(styleId, buyerId, customerStyleRef, combineOrderId);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                if (combineOrderId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Combine Order No", "");
                } else if (fabricId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Fabric No", "");
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

    function handleDeleteMasterNo() {
        config["deleteMasterPopUp"].closePopUp();
    }

    async function handlePrintConsumptionReport() {
        try {
            const combineOrderId = config["inputCombineOrderNo"].data.value;

            if (combineOrderId !== "") {
                const apiRequest = {
                    "combine_order_id": combineOrderId
                }
                document.getElementById("spinner").style.display = "";
                const printConsumptionReport = await API.post(`fpoCutPlans/printConsumptionReport`, apiRequest,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/pdf'
                        }
                    });
                document.getElementById("spinner").style.display = "none";

                if (printConsumptionReport && printConsumptionReport.data !== null) {
                    config["printPopUp"].showPopUp();
                    let blob = new Blob([printConsumptionReport.data], { type: 'application/pdf' });
                    let blobUrl = window.URL.createObjectURL(blob);
                    document.getElementById("pdfviewer").setAttribute('src', blobUrl);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                }

            } else {
                if (combineOrderId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Combine Order No", "");
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

    async function handleCutReport(){
        

        try {
            const cutNo = config["inputReportCutNo"].data.value;

            if (cutNo !== "" ) {
                const apiRequest = {
                    "cut_no" : cutNo
                }
                document.getElementById("spinner").style.display = "";
                const printTrimsReport = await API.post(`cutPlans/getCutLaySheet`, apiRequest,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/pdf'
                        }
                    });
                document.getElementById("spinner").style.display = "none";

                console.log("********printTrimsReport*********");
                console.log(printTrimsReport);
                
                if (printTrimsReport && printTrimsReport.data !== null) {
                    config["printPopUp"].showPopUp();
                    let blob = new Blob([printTrimsReport.data], { type: 'application/pdf' });
                    let blobUrl = window.URL.createObjectURL(blob);
                    document.getElementById("pdfviewer").setAttribute('src', blobUrl);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                }

            } else {
                if (cutNo === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Cut No", "");
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
    function handleBundleTag(){
        config["BundleTagPopUp"].showPopUp();   
       // config["radioCombineBundles"].setValue("size");     
    }
    function handleBundleTagcancel(){
        config["BundleTagPopUp"].closePopUp();
    }
    function handleBundleTagYes(){

        if(config["radioCombineBundles"].data.value == ""){
            config["CONTROL_CENTER"].promptWarningMessage("Please Select Order Type");
        }
        else{
            handleBundleTagReport(config["radioCombineBundles"].data.value);
        }
    }
    async function handleBundleTagReport(type){
        
        config["BundleTagPopUp"].closePopUp();
        try {
            const cutNo = config["inputReportCutNo"].data.value;

            if (cutNo !== "" ) {
                const apiRequest = {
                    "cut_no" : cutNo,
                    "order_type":type
                }
                document.getElementById("spinner").style.display = "";
                const printBundleTagReport = await API.post(`cutPlans/getBundleTagReport`, apiRequest,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/pdf'
                        }
                    });
                document.getElementById("spinner").style.display = "none";

                console.log("********printTrimsReport*********");
                console.log(printBundleTagReport);
                
                if (printBundleTagReport && printBundleTagReport.data !== null) {
                    config["printPopUp"].showPopUp();
                    let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
                    let blobUrl = window.URL.createObjectURL(blob);
                    document.getElementById("pdfviewer").setAttribute('src', blobUrl);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                }

            } else {
                if (cutNo === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Cut No", "");
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

    async function handleSaveRemarks(event){
        try {

            const cutNo = config["inputReportCutNo"].data.value;
            const specialRemark = config["inputCutRemarks"].data.value;

            if (cutNo !== "" && specialRemark !== "") {

               
                const apiRequest = {
                    "cut_no": cutNo,
                    "special_remark": specialRemark
                };

                console.log("**********apiRequest************")
                console.log(apiRequest)

                document.getElementById("spinner").style.display = "";

                const remark = await API.post(`cutPlans/saveSpecialRemarks`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("********remark*********");
                console.log(remark);

                if (remark.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Save Successfully", "");
                    
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                if (cutNo === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Cut No", "");
                } else if (specialRemark === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Enter Special Remark", "");
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

    async function handleChangeReportCutNo(){
        config["inputCutRemarks"].setValue("");
        try {

            const cutNo = config["inputReportCutNo"].data.value;
            

            if (cutNo !== "") {              
                const apiRequest = {
                    "cut_no": cutNo,                    
                };

                console.log("**********apiRequest************")
                console.log(apiRequest)

            //    document.getElementById("spinner").style.display = "";

                const remark = await API.post(`cutPlans/getSpecialRemarks`, apiRequest);

             //   document.getElementById("spinner").style.display = "none";

                if (remark.data.status === "success") {
                    config["inputCutRemarks"].setValue(remark.data.data.special_remark);
                    
                } else {
                  //  config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } 
        } catch (error) {
           // document.getElementById("spinner").style.display = "none";

        }
    }

    async function handleSaveTolerance(){
        let fpo =  config["gridViewCombineOrder"].data;
        let fpo_data = [];

        //////////////////// Get pack ratio sum  ///////////////////
        Object.entries(fpo).forEach(([index, data]) => {
            
            let tolerance = 0;
            
            if(data.tolerance > 0){
                tolerance = data.tolerance;
            }
            fpo_data.push({
                "fpo": data.fpo_no,
                "tolerance": tolerance,
                
            });
        });

        try {

            if (fpo_data.length > 0) {
               
                const apiRequest = {
                    "fpo": fpo_data

                };

                console.log("**********apiRequest************")
                console.log(apiRequest)

                document.getElementById("spinner").style.display = "";

                const tolerance = await API.post(`cutPlans/saveFpoTolerance`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                console.log("********remark*********");
                console.log(tolerance);

                if (tolerance.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Save Successfully", "");
                    
                    
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter Valid Tolerance", "");
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

        let gridViewTotalQuantityRows = await getTotalQuantity();
        let gridTotalQuantityRows = [];

        let totalQuantity = { ...{ "heading": "Total Quantity" }, ...gridViewTotalQuantityRows.sum };
        let totalQuantityWithTolerance = { ...{ "heading": "Total Quantity With Tolerance" }, ...gridViewTotalQuantityRows.sum_with_tolerancer };    
        gridTotalQuantityRows = [totalQuantity, totalQuantityWithTolerance];  

        config["gridTotalQuantity"].setData(gridTotalQuantityRows);
    }

    return generateRatioPlanningDisplay(config)
}


async function handleBundleTagReportNew(type){ 
        
    try {
        const cutNo = config["inputReportCutNo"].data.value;

        if (cutNo !== "" ) {
            const apiRequest = {
                "cut_no" : cutNo
            }
            document.getElementById("spinner").style.display = "";
            const printBundleTagReport = await API.post(`cutPlans/getBundleReportInRationPlanning`, apiRequest,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    }
                });
            document.getElementById("spinner").style.display = "none";

            console.log("********printTrimsReport*********");
            console.log(printBundleTagReport);
            
            if (printBundleTagReport && printBundleTagReport.data !== null) {
                config["printPopUp"].showPopUp();
                let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
                let blobUrl = window.URL.createObjectURL(blob);
                document.getElementById("pdfviewer").setAttribute('src', blobUrl);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
            }

        } else {
            if (cutNo === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select Cut No", "");
            } 
        }

    } catch (error) {
        document.getElementById("spinner").style.display = "none";
        // try {
        //     if (error.response.data.message) {
        //         try {
        //             let errors = [];

        //             Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
        //                 data.forEach(error => errors.push(error));
        //             });

        //             config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
        //         } catch (error) {
        //             config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        //         }
        //     }
        // } catch (error) {
        //     config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        // }
        console.log(error);
        config["CONTROL_CENTER"].promptErrorMessage( "Bundles Are Not Numbered");
    }        
}

async function handleBundleDetailReport(){
    try {
        const cutNo = config["inputReportCutNo"].data.value;

        if (cutNo !== "" ) {
            const apiRequest = {
                "cut_no" : cutNo
            }
            document.getElementById("spinner").style.display = "";
            const printBundleTagReport = await API.post(`cutPlans/getBundleDetailsReport`, apiRequest,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    }
                });
            document.getElementById("spinner").style.display = "none";

            console.log("********printTrimsReport*********");
            console.log(printBundleTagReport);
            
            if (printBundleTagReport && printBundleTagReport.data !== null) {
                config["printPopUp"].showPopUp();
                let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
                let blobUrl = window.URL.createObjectURL(blob);
                document.getElementById("pdfviewer").setAttribute('src', blobUrl);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
            }

        } else {
            if (cutNo === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select Cut No", "");
            } 
        }

    } catch (error) {
        document.getElementById("spinner").style.display = "none";
        // try {
        //     if (error.response.data.message) {
        //         try {
        //             let errors = [];

        //             Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
        //                 data.forEach(error => errors.push(error));
        //             });

        //             config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
        //         } catch (error) {
        //             config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        //         }
        //     }
        // } catch (error) {
        //     config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        // }

        config["CONTROL_CENTER"].promptErrorMessage("Error", "Bundles Are Not Numbered");
    } 
}

async function handleBundleNumbering(){
    try {

        const cutNo = config["inputReportCutNo"].data.value;
        const combine_order_id = config["inputCombineOrderNo"].data.value;
        

        if (cutNo !== "") {              
            const apiRequest = {
                "cut_no": cutNo,  
                'combine_order_id':combine_order_id,                  
            };

            console.log("**********apiRequest************")
            console.log(apiRequest)

            document.getElementById("spinner").style.display = "";

            const remark = await API.post(`cutPlans/saveBundleNumbering`, apiRequest);

            document.getElementById("spinner").style.display = "none";

            if (remark.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage("Save Successfully", "");
                
            } else {
                
            }

        } 
    } catch (error) {
        console.log("Error");
        console.log(error);
        document.getElementById("spinner").style.display = "none";
        config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message);

    }
}

function handleUploadRatioPlan(){

    try{

        const input=document.getElementById('inputExcel');
        readXlsxFile(input.files[0]).then((rows) => {
            let found = true;
            let index = 1;
            let lastColumn = 0;
            let fpo = rows[4][1];
            let style = rows[0][16];
            
            let end_index = fpo.indexOf("/");
            if(end_index > 0){
                fpo = fpo.substring(0,end_index);
            }
            
            const validate =validateData(style,fpo);
            
            if(validate){
                config["gridLayMarker"].setData([]);
                while(found){
                    if(rows[0][index] == "END"){
                        found = false;
                        lastColumn = index;
                    }
                    index++;
                }
                let max_plies = rows[4][16];
                config['inputMaxPlies'].setValue(max_plies);

                for(let i = 16; i<rows.length; i=i+6){
                    
                    if(rows[i][2] != "" && rows[i][2] != null){
                        let dataRow = {};
                        dataRow['marker_name'] = rows[i][2];
                        dataRow['accwidth'] = rows[i][3];
                        dataRow['yrds'] = rows[i][5];
                        dataRow['inch'] = rows[i][6];

                        for(let j =10; j < lastColumn-3; j++){
                            if(rows[i][j] > 0){
                                dataRow[rows[i-2][j]] = rows[i][j];
                            }
                        }
                        dataRow['total_plies'] = rows[i][lastColumn-1];
                        config["gridLayMarker"].addRow(dataRow);

                        console.log(dataRow);
                    
                    }
                }
                document.getElementById('inputExcel').value= "";
            }
                
        });

        
        

    } catch (error) {
  
        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");

    }
}

function validateData(style,fpo){
    let input_style = config['inputStyleCode'].data.value;
    const combine_order_id = config["inputCombineOrderNo"].data.value;
    
    if(combine_order_id === ""){
        config["CONTROL_CENTER"].promptWarningMessage("Please Select Combine Order", "");
        return false;
    }else if(input_style !== style){
        config["CONTROL_CENTER"].promptWarningMessage("Different Style Code", "");
        return false;
    }else{
        let found =false;
        let data = config['gridViewCombineOrder'].data;
        Object.entries(data).forEach(([index, data]) => {
            
            if(data.fpo_no === fpo){
                found = true;
            }
        });

        if(!found){
            config["CONTROL_CENTER"].promptWarningMessage("Different FPO", "");
        }
        return found;
    }
}


export default RatioPlanning;