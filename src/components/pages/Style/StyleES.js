import React, { useEffect, useState } from 'react';
import { generateStyleDisplay } from './StyleDS';
import config from './StyleCS';
import API from '../../../api/API';
import readXlsxFile from 'read-excel-file';

const Style = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    config["inputStyleCode"].event.onEnterKey = handleEnterStyleCode;
    config["inputStyleCode"].event.onBlur = handleBlurStyleCode;
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["buttonReset"].event.onClick = handleReset;
    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonDeleteMaster"].event.onClick = handleDeleteMaster;
    config["buttonDeleteMasterYes"].event.onClick = handleDeleteMasterYes;
    config["buttonDeleteMasterNo"].event.onClick = handleDeleteMasterNo;

    config["lovComboBoxRoute"].event.onComboSearch = handleComboSearchRoute;
    config["lovComboBoxRoute"].event.onLovDone = handleLovDoneRoute;
    config["lovComboBoxRoute"].event.onLovSearch = handleLovSearchRoute;
    config["lovComboBoxRoute"].event.onBlurWithChange = handleBlurLovRoute;
    config['buttonUploadSizeQty'].event.onClick = handleUploadSizeQty;

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
        const apiRequest = { "screen": "style" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonNew"].setVisible(false);
            config["buttonSave"].setVisible(false);
            config["buttonDeleteMaster"].setVisible(false);
            config["gridFabricInformation"].setModeEditable(false);
            config["lovComboBoxRoute"].setLovDisable(true);
            config["lovComboBoxRoute"].setEditable(false);
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

    // Get FabricInformation Grid Columns
    function __getGridFabricInformationColumns() {
        let gridCols = [];

        gridCols["updated_at"] = { objectType: "TextBox", datatype: "text", name: "updated_at", placeholder: "Updated At", visible: false, editable: false, sqlColumn: "updated_at", style: { textAlign: "left" } }
        gridCols["id"] = { objectType: "TextBox", datatype: "text", name: "id", placeholder: "ID", visible: false, editable: false, sqlColumn: "id", style: { textAlign: "left" } };
        gridCols["fabric"] = { objectType: "TextBox", datatype: "text", name: "fabric", placeholder: "Fabric", editable: true, sqlColumn: "fabric", style: { textAlign: "left", minWidth: "450px", width: "450px" } };

        return gridCols;
    }

    // Get FabricInformation Grid Rows
    function __getGridFabricInformationRows(results) {
        let gridRows = [];

        Object.entries(results).forEach(([index, data]) => {
            gridRows.push({
                "id": data.id,
                "fabric": data.fabric,
                "updated_at": data.updated_at
            });
        });

        return gridRows;
    }

    // Get SizeFitJson Grid Columns
    function __getGridSizeFitJsonColumns() {
        let gridCols = [];

        gridCols["size"] = { objectType: "TextBox", colIndex: 1, datatype: "text", name: "size", placeholder: "Size", editable: true, sqlColumn: "size", style: { textAlign: "left", minWidth: "225px", width: "225px" } };
        gridCols["fit"] = { objectType: "TextBox", colIndex: 2, datatype: "text", name: "fit", placeholder: "Fit", editable: true, sqlColumn: "fit", style: { textAlign: "left", minWidth: "225px", width: "225px" } };

        return gridCols;
    }

    // Get SizeFitJson Grid Rows
    function __getGridSizeFitJsonRows(results) {
        let gridRows = [];

        results.forEach(data => {
            gridRows.push({
                "size": __isNotNullorEmpty(data.size) ? data.size : "",
                "fit": __isNotNullorEmpty(data.fit) ? data.fit : ""
            });
        });

        return gridRows;
    }

    // Get Style Details By Style Id
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
                "routing",
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

    // Reset Grid FabricInformation
    function __resetGridFabricInformation() {
        let gridFabricInformationDefaultColumns = __getGridFabricInformationColumns();
        let gridFabricInformationDefaultRows = [];

        config["gridFabricInformation"].setColumns(gridFabricInformationDefaultColumns);
        config["gridFabricInformation"].setData(gridFabricInformationDefaultRows);
    }

    // Reset Grid SizeFitJson
    function __resetGridSizeFitJson() {
        let gridSizeFitJsonDefaultColumns = __getGridSizeFitJsonColumns();
        let gridSizeFitJsonDefaultRows = [];

        config["gridSizeFitJson"].setColumns(gridSizeFitJsonDefaultColumns);
        config["gridSizeFitJson"].setData(gridSizeFitJsonDefaultRows);
    }

    // Get All
    async function __getAll() {
        try {
            const key = "Style";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [
                "routing"
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
                "Style": {
                    "style_code": searchCriteria.style_code_search === "" ? "%" : searchCriteria.style_code_search,
                    "description": searchCriteria.style_description_search === "" ? "%" : searchCriteria.style_description_search,
                    "relations": [
                        // {
                        //     "Routing": {
                        //         "route_code": searchCriteria.style_route_code_search === "" ? "%" : searchCriteria.style_route_code_search
                        //     }
                        // }
                    ],
                    "orderby": "created_at:desc",
                    "limit": 25
                }
            };
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    async function __getAllRouteLOVDetails() {
        try {
            const key = "Routing";
            const distinct = false;
            const select = ["*"];
            const where = [];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 25;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetAllRouteLOVDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    async function __getRouteLOVDetails(searchCriteria) {
        try {
            const apiRequest = {
                "Routing": {
                    "route_code": searchCriteria.route_code === "" ? "%" : searchCriteria.route_code,
                    "description": searchCriteria.route_description === "" ? "%" : searchCriteria.route_description,
                    "orderby": "created_at:desc",
                    "limit": 25
                }
            };
            const getSearchDetails = await API.post(`novelSearch`, apiRequest);
            const details = getSearchDetails.data.data;

            return details;

        } catch (error) {
            console.log("***********GetDetails Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    // Get Route By Code
    async function __getRouteByCode(code) {
        let route = { "route_id": "", "route_code": "" };
        try {
            const key = "Routing";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "route_code",
                    "operator": "=",
                    "value": code
                }
            ];
            const relations = [];
            const orderby = "created_at:desc";
            const limit = 1000;

            const getDetails = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            if (getDetails && getDetails !== "Error" && getDetails[0].Routing.length > 0) {
                route = { "route_id": getDetails[0].Routing[0].id, "route_code": getDetails[0].Routing[0].route_code };
            }
        } catch (error) {
            console.log("***********GetRouteIdByCode Error**********");
            console.log(error.response);
        }
        return route;
    }

    function __hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    //Check Srting Null or Empty
    function __isNotNullorEmpty(str) {
        if (str !== null && str !== "") {
            return true;
        } else {
            return false;
        }
    }

    /*********************************************************/
    /********      Framework Public Functions       **********/
    /*********************************************************/

    async function handleAdvanceSearchPopup() {
        let data = [];
        const getData = await __getAll();
       
        if (getData && getData !== "Error" && getData[0].Style.length > 0) {
            const listData = getData[0].Style;
            listData.forEach((value, index) => (
                data.push({
                    "style_code_search": value.style_code,
                    "style_description_search": value.description,
                    // "style_route_code_search": value.routing.route_code
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
        if (typeof selectedRow !== "undefined" && selectedRow.style_code_search !== "") {
            // Get Style Id from Style Code
            const styleId = await __getStyleIdByCode(selectedRow.style_code_search);
            await formPopulate(styleId);
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
                    "style_code_search": value.style_code,
                    "style_description_search": value.description,
                   // "style_route_code_search": value.routing.route_code
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

    /************ Start - When Route LOV Clicked ************/

    async function handleBlurLovRoute() {
        const routeCode = config["lovComboBoxRoute"].data.value;
        if (routeCode !== "") {
            const route = await __getRouteByCode(routeCode);
            if (route.route_id !== "") {
               // config["lovComboBoxRoute"].setValueWithId(route.route_code, route.route_id);
            } else {
               // config["lovComboBoxRoute"].setValueWithId("", "");
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter valid Route Code", "");
            }
        }
    }

    async function handleComboSearchRoute(event) {
        let rows = [];
        const getData = await __getAllRouteLOVDetails();

        let titles = {
            route_id: { displayName: "Route ID", visible: false },
            route_code: { displayName: "Route Code", visible: true },
            route_description: { displayName: "Description", visible: true }
        }

        console.log("********getData*********")
        console.log(getData)

        if (getData && getData !== "Error" && getData[0].Routing.length > 0) {
            const listData = getData[0].Routing;
            listData.forEach((value, index) => (
                rows.push({
                    "route_id": value.id,
                    "route_code": value.route_code,
                    "route_description": value.description
                })
            ));
        }

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        config["lovComboBoxRoute"].showLovWindow(titles, rows, msg)
    }

    async function handleLovDoneRoute(event, lovRow) {
        config["lovComboBoxRoute"].setValueWithId(lovRow.route_code, lovRow.route_id);
    }

    async function handleLovSearchRoute(event, searchCriteria, callback) {
        console.log("**************Selected row from search***************")
        console.log(searchCriteria)

        let rows = [];
        let searchDetails = await __getRouteLOVDetails(searchCriteria);

        if (searchDetails && searchDetails.length > 0) {
            searchDetails.forEach((value, index) => (
                rows.push({
                    "route_id": value.id,
                    "route_code": value.route_code,
                    "route_description": value.description
                })
            ));
        }

        console.log("*******Search Results********");
        console.log(rows);

        let msg = "";
        if (rows.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            rows = rows.slice(0, 20);
        }

        callback(rows, msg);
    }

    /************ End - When Route LOV Clicked ************/

    function handleUndo() {
        let id = config["inputId"].data.value;
        if (id !== "") {
            formPopulate(id);
        }
    }

    function handleReset() {
        window.location.reload();
    }

    function onChange(event) {
        event.preventDefault();
        //alert("This is the place where you write CHANGE");
    }

    // Execute when Style Code Enter Key Press
    async function handleEnterStyleCode(event) {
        event.preventDefault();
        try {
            const styleCode = config["inputStyleCode"].data.value;
            // Get Style Id from Style Code
            const styleId = await __getStyleIdByCode(styleCode);
            await formPopulate(styleId);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Execute when Style Code On Blur
    async function handleBlurStyleCode(event) {
        event.preventDefault();
        try {
            const formState = config["CONTROL_CENTER"].state.new;
            const styleCode = config["inputStyleCode"].data.value;
            // Get Style Id from Style Code
            const styleId = await __getStyleIdByCode(styleCode);
            if (!formState) {
                //await formPopulate(styleId);
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    async function formPopulate(styleId) {
        __resetGridSizeFitJson();
        let dataArray = {
            "id": "",
            "style_code": "",
            "description": "",
            //"size_fit": "",
            "gridSizeFitJson": { "data": [], "columns": [] },
            "gridFabricInformation": { "data": [], "columns": [] },
            "updated_at": "",
            "status": ""
        };

        if (styleId && styleId !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get Style Details from Style Id
                const details = await __getStyleData(styleId);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].Style.length > 0) {
                    const styleData = details[0].Style[0];

                    let gridSizeFitJsonColumns = [];
                    let gridSizeFitJsonRows = [];

                    // Set SizeFitJson Grid Columns
                    gridSizeFitJsonColumns = __getGridSizeFitJsonColumns();
                    if (styleData.size_fit_json.length > 0) {
                        // Set SizeFitJson Grid Rows
                        gridSizeFitJsonRows = __getGridSizeFitJsonRows(styleData.size_fit_json);
                    }

                    let gridFabricInformationColumns = [];
                    let gridFabricInformationRows = [];

                    // Set FabricInformation Grid Columns
                    gridFabricInformationColumns = __getGridFabricInformationColumns();
                    if (styleData.style_fabrics.length > 0) {
                        // Set FabricInformation Grid Rows
                        gridFabricInformationRows = __getGridFabricInformationRows(styleData.style_fabrics);
                    }

                    //let sizeFitList = styleData.size_fit.map(k => k).join(",");

                    dataArray = {
                        "id": styleData.id,
                        "style_code": styleData.style_code,
                        "description": styleData.description,
                        //"size_fit": sizeFitList,
                        "gridSizeFitJson": { "data": gridSizeFitJsonRows, "columns": gridSizeFitJsonColumns },
                        "gridFabricInformation": { "data": gridFabricInformationRows, "columns": gridFabricInformationColumns },
                        "updated_at": styleData.updated_at,
                        "status": styleData.status
                    };

                    config["CONTROL_CENTER"].populate(dataArray);

                    //Set Route
                   // config["lovComboBoxRoute"].setValueWithId(styleData.routing.route_code, styleData.routing.id);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Style Code", "");
                    config["CONTROL_CENTER"].populate(dataArray);
                    __resetGridSizeFitJson();
                    __resetGridFabricInformation();
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                config["CONTROL_CENTER"].populate(dataArray);
                __resetGridSizeFitJson();
                __resetGridFabricInformation();
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Code", "");
            config["CONTROL_CENTER"].populate(dataArray);
            __resetGridSizeFitJson();
            __resetGridFabricInformation();
        }
    }

    async function onPopulate(event, callback) {
        event.preventDefault();

        __resetGridSizeFitJson();

        const styleCode = config["inputStyleCode"].data.value;

        let dataArray = {
            "id": "",
            "style_code": "",
            "description": "",
            //"size_fit": "",
            "gridSizeFitJson": { "data": [], "columns": [] },
            "gridFabricInformation": { "data": [], "columns": [] },
            "updated_at": "",
            "status": ""
        };

        if (styleCode && styleCode !== "") {
            try {
                document.getElementById("spinner").style.display = "";

                // Get Style Id from Style Code
                const styleId = await __getStyleIdByCode(styleCode);
                // Get Style Details from Style Id
                const details = await __getStyleData(styleId);

                document.getElementById("spinner").style.display = "none";

                if (details && details !== "Error" && details[0].Style.length > 0) {
                    const styleData = details[0].Style[0];

                    let gridSizeFitJsonColumns = [];
                    let gridSizeFitJsonRows = [];

                    // Set SizeFitJson Grid Columns
                    gridSizeFitJsonColumns = __getGridSizeFitJsonColumns();
                    if (styleData.size_fit_json.length > 0) {
                        // Set SizeFitJson Grid Rows
                        gridSizeFitJsonRows = __getGridSizeFitJsonRows(styleData.size_fit_json);
                    }

                    let gridFabricInformationColumns = [];
                    let gridFabricInformationRows = [];

                    // Set FabricInformation Grid Columns
                    gridFabricInformationColumns = __getGridFabricInformationColumns();
                    if (styleData.style_fabrics.length > 0) {
                        // Set FabricInformation Grid Rows
                        gridFabricInformationRows = __getGridFabricInformationRows(styleData.style_fabrics);
                    }

                    //let sizeFitList = styleData.size_fit.map(k => k).join(",");

                    dataArray = {
                        "id": styleData.id,
                        "style_code": styleData.style_code,
                        "description": styleData.description,
                        //"size_fit": sizeFitList,
                        "gridSizeFitJson": { "data": gridSizeFitJsonRows, "columns": gridSizeFitJsonColumns },
                        "gridFabricInformation": { "data": gridFabricInformationRows, "columns": gridFabricInformationColumns },
                        "updated_at": styleData.updated_at,
                        "status": styleData.status
                    };

                    callback(dataArray);

                    //Set Route
                    //config["lovComboBoxRoute"].setValueWithId(styleData.routing.route_code, styleData.routing.id);

                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Please Enter valid Style Code", "");
                    callback(dataArray);
                    __resetGridSizeFitJson();
                    __resetGridFabricInformation();
                }

            } catch (error) {
                document.getElementById("spinner").style.display = "none";
                config["CONTROL_CENTER"].promptErrorMessage("Error", "");
                callback(dataArray);
                __resetGridSizeFitJson();
                __resetGridFabricInformation();
            }

        } else {
            //config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Code", "");
            callback(dataArray);
            __resetGridSizeFitJson();
            __resetGridFabricInformation();
        }
    }

    function onNew() {
        let dataArray = {};
        //Action handling when NEW buttion clicked...

       // config["lovComboBoxRoute"].setValueWithId("", "");

        __resetGridSizeFitJson();

        __resetGridFabricInformation();

        return dataArray;
    }

    function handleRowDelete(event, rowId) {
        //alert("This is delete of row " + rowId)
    }

    function onDelete() {
        //Action handling when DELETE buttion clicked...
        //alert("This is the place where you write DELETE");
    }

    function onRefresh() {
        //Action handling when REFRESH buttion clicked...
        //alert("This is the place where you write REFRESH");
    }

    async function onSaveNew(event, dataArr, callback) {
        console.log("********Save New dataArr*********");
        console.log(dataArr);
        let resultArr = {};
        let isValid = true;
        try {
            if (dataArr.action === "NEW") {
                let styleCode = dataArr.data.style_code;
                let styleDescription = dataArr.data.description;
                let styleRoutingId = config["lovComboBoxRoute"].data.id;


                let gridSizeFitJsonRows = dataArr.data.gridSizeFitJson.data;
                let sizeFitJson = [];
                let sizeFitStatus = [];
                let sizeStatus = [];
                
                Object.entries(gridSizeFitJsonRows).forEach(([index, data]) => {
                    
                    let size = data.size;
                    let fit = data.fit;
                    
                    sizeFitJson.push({
                        "size": size,
                        "fit": fit
                    })
                    
                    sizeFitJson.forEach(data => {
                        if (!__isNotNullorEmpty(size) && !__isNotNullorEmpty(fit)) {
                            sizeFitStatus.push(false);
                        }else{
                            sizeFitStatus.push(true);
                        }
                    });

                    sizeFitJson.forEach(data => {
                        if (!__isNotNullorEmpty(size) && __isNotNullorEmpty(fit)) {
                            sizeStatus.push(false);
                        }else{
                            sizeStatus.push(true);
                        }
                    });
                });
                
                let gridFabricInformationRows = dataArr.data.gridFabricInformation.data;
                let fabricInformationCreateList = [];

                Object.entries(gridFabricInformationRows).forEach(([index, data]) => {
                    let fabric = data.fabric;

                    fabricInformationCreateList.push({
                        "style_id": "!PARENT_KEY!",
                        "fabric": fabric
                    });
                });

                const apiRequest = {
                    "Style": {
                        "CRE": [
                            {
                                "style_code": styleCode,
                                "description": styleDescription,
                                //"size_fit": trimmedSizeFitArr,
                                "size_fit_json": sizeFitJson,
                                "routing_id": styleRoutingId,
                                "relations": {
                                    "StyleFabric": {
                                        "CRE": fabricInformationCreateList
                                    }
                                }
                            }
                        ]
                    }
                };

                console.log("********Create apiRequest*********");
                console.log(JSON.stringify(apiRequest));

                if (styleCode !== "" && styleDescription !== ""  && sizeFitJson.length > 0 && sizeFitStatus.every(Boolean) && sizeStatus.every(Boolean)) {
                //if (styleCode !== "" && styleDescription !== "" && trimmedSizeFitArr.length > 0 && sizeFitStatus.every(Boolean) && !__hasDuplicates(trimmedSizeFitArr) && styleRoutingId !== "") {

                    document.getElementById("spinner").style.display = "";

                    const createStyle = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********createStyle*********");
                    console.log(createStyle);

                    resultArr = createStyle.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Created Successfully", "");
                        // Get Style Id from Style Code
                        const styleId = await __getStyleIdByCode(styleCode);
                        await formPopulate(styleId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error1", "");
                        isValid = false;
                    }

                } else {
                    if (styleCode === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Code", "");
                        isValid = false;
                    } else if (styleDescription === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Description", "");
                        isValid = false;
                    }
                    //  else if (styleRoutingId === "") {
                    //     config["CONTROL_CENTER"].promptWarningMessage("Please Select Routing", "");
                    //     isValid = false;
                    // }
                     else if (sizeFitJson.length === 0) {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Size/Fit", "");
                        isValid = false;
                    } else if (!sizeFitStatus.every(Boolean)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Invalid Format in Style Size/Fit", "");
                        isValid = false;
                    } else if (!sizeStatus.every(Boolean)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Sizes field is mandatory when Fit Value Exist. Please check the records", "");
                        isValid = false;
                        /* } else if (trimmedSizeFitArr.length === 0) {
                            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Size/Fit", "");
                            isValid = false;
                        } else if (!sizeFitStatus.every(Boolean)) {
                            config["CONTROL_CENTER"].promptWarningMessage("Invalid Format in Style Size/Fit Field", "");
                            isValid = false;
                        } else if (__hasDuplicates(trimmedSizeFitArr)) {
                            config["CONTROL_CENTER"].promptWarningMessage("Identical Size/Fit exists", "");
                            isValid = false; */
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    async function onSaveModify(event, dataArr, callback) {
        console.log("********Save Modify dataArr*********");
        console.log(dataArr);
        let resultArr = {}
        let isValid = true;
        try {
            if (dataArr.action === "MODIFY") {
                let styleId = dataArr.data.id;
                let styleCode = dataArr.data.style_code;
                let styleDescription = dataArr.data.description;
                let styleRoutingId = config["lovComboBoxRoute"].data.id;
                let styleUpdatedAt = dataArr.data.updated_at;

                /* let styleSizeFit = dataArr.data.size_fit;

                let sizeFitArr = styleSizeFit.split(',');
                let trimmedSizeFitArr = sizeFitArr.map(str => str.trim());
                trimmedSizeFitArr = trimmedSizeFitArr.filter(el => el);

                let sizeFitStatus = [];

                trimmedSizeFitArr.forEach(data => {
                    if (/\s/.test(data)) {
                        sizeFitStatus.push(false);
                    } else {
                        sizeFitStatus.push(true);
                    }
                }) */

                let gridSizeFitJsonRows = dataArr.data.gridSizeFitJson.data;
                let sizeFitJson = [];
                let sizeFitStatus = [];
                let sizeStatus = [];

                Object.entries(gridSizeFitJsonRows).forEach(([index, data]) => {
                    if (typeof data._rowstate !== 'undefined') {
                        let size = data.size;
                        let fit = data.fit;
                        let rowState = data._rowstate;

                        if (rowState !== "DELETED") {
                            sizeFitJson.push({
                                "size": size,
                                "fit": fit
                            })
                        }

                        sizeFitJson.forEach(data => {
                            if (!__isNotNullorEmpty(size) && !__isNotNullorEmpty(fit)) {
                                sizeFitStatus.push(false);
                            }else{
                                sizeFitStatus.push(true);
                            }
                        });

                        sizeFitJson.forEach(data => {
                            if (!__isNotNullorEmpty(size) && __isNotNullorEmpty(fit)) {
                                sizeStatus.push(false);
                            }else{
                                sizeStatus.push(true);
                            }
                        });
                    }
                });

                let gridFabricInformationRows = dataArr.data.gridFabricInformation.data;

                let fabricInformationCreateList = [];
                let fabricInformationUpdateList = [];
                let fabricInformationDeleteList = [];

                Object.entries(gridFabricInformationRows).forEach(([index, data]) => {
                    if (typeof data._rowstate !== 'undefined') {
                        let id = data.id;
                        let fabric = data.fabric;
                        let updatedAt = data.updated_at;
                        let rowState = data._rowstate;

                        if (rowState === "NEW") {
                            fabricInformationCreateList.push({
                                "style_id": "!PARENT_KEY!",
                                "fabric": fabric
                            });
                        } else if (rowState === "MODIFIED") {
                            let updateList = {};
                            updateList[id] = {
                                "style_id": "!PARENT_KEY!",
                                "fabric": fabric,
                                "updated_at": updatedAt
                            };
                            fabricInformationUpdateList.push(updateList);

                        } else if (rowState === "DELETED") {
                            fabricInformationDeleteList.push(id.toString());
                        }
                    }

                });

                const apiRequest = {
                    "Style": {
                        "UPD": [
                            {
                                [styleId]: {
                                    "style_code": styleCode,
                                    "description": styleDescription,
                                    //"size_fit": trimmedSizeFitArr,
                                    "size_fit_json": sizeFitJson,
                                    "routing_id": styleRoutingId,
                                    "relations": {
                                        "StyleFabric": {
                                            "CRE": fabricInformationCreateList,
                                            "UPD": fabricInformationUpdateList,
                                            "DEL": fabricInformationDeleteList
                                        }
                                    },
                                    "updated_at": styleUpdatedAt
                                }
                            }
                        ]
                    }
                };
                console.log("********Modify apiRequest*********");
                console.log(apiRequest);

                if (styleCode !== "" && styleDescription !== "" && sizeFitJson.length > 0 && sizeFitStatus.every(Boolean) && sizeStatus.every(Boolean)) {
                //if (styleCode !== "" && styleDescription !== "" && trimmedSizeFitArr.length > 0 && sizeFitStatus.every(Boolean) && !__hasDuplicates(trimmedSizeFitArr) && styleRoutingId !== "") {

                    document.getElementById("spinner").style.display = "";

                    const updateStyle = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********updateStyle*********");
                    console.log(updateStyle);

                    resultArr = updateStyle.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                        await formPopulate(styleId);
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (styleCode === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Code", "");
                        isValid = false;
                    } else if (styleDescription === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Description", "");
                        isValid = false;
                    } 
                    // else if (styleRoutingId === "") {
                    //     config["CONTROL_CENTER"].promptWarningMessage("Please Select Routing", "");
                    //     isValid = false;
                    // } 
                    else if (sizeFitJson.length === 0) {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Size/Fit", "");
                        isValid = false;
                    } else if (!sizeFitStatus.every(Boolean)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Invalid Format in Style Size/Fit", "");
                        isValid = false;
                    } else if (!sizeStatus.every(Boolean)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Sizes field is mandatory when Fit Value Exist. Please check the records", "");
                        isValid = false;
                    /* } else if (trimmedSizeFitArr.length === 0) {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter Style Size/Fit", "");
                        isValid = false;
                    } else if (!sizeFitStatus.every(Boolean)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Invalid Format in Style Size/Fit Field", "");
                        isValid = false;
                    } else if (__hasDuplicates(trimmedSizeFitArr)) {
                        config["CONTROL_CENTER"].promptWarningMessage("Identical Size/Fit exists", "");
                        isValid = false; */
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    function handleDeleteMaster(event) {
        let deleteMasterId = config["inputId"].data.value;

        if (deleteMasterId !== "") {
            config["deleteMasterPopUp"].showPopUp();
            config["inputDeleteMasterId"].data.value = deleteMasterId;
        } else {
            if (deleteMasterId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please Select a Record to Delete", "");
            }
        }
    }

    async function handleDeleteMasterYes() {
        let deleteMasterId = config["inputDeleteMasterId"].data.value;
        try {
            if (deleteMasterId !== "") {

                config["deleteMasterPopUp"].closePopUp();

                const apiRequest = {
                    "Style": {
                        "DEL": [deleteMasterId]
                    }
                };

                console.log("********apiRequest*********");
                console.log(apiRequest);

                document.getElementById("spinner").style.display = "";

                const deleteMaster = await API.post(`masterDetails`, apiRequest);

                document.getElementById("spinner").style.display = "none";

                if (deleteMaster.data.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Record Deleted Successfully", "");
                    formPopulate();
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                }

            } else {
                if (deleteMasterId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select a Record to Delete", "");
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

    async function onSaveDelete(event, dataArr, callback) {
        let resultArr = {}
        let isValid = true;
        let styleId = dataArr.data.id;
        try {
            if (dataArr.action === "DELETE") {

                const apiRequest = {
                    "Style": {
                        "DEL": [styleId]
                    }
                };
                console.log("********Delete apiRequest*********");
                console.log(apiRequest);

                if (styleId !== "") {

                    document.getElementById("spinner").style.display = "";

                    const deleteStyle = await API.post(`masterDetails`, apiRequest);

                    document.getElementById("spinner").style.display = "none";

                    console.log("********deleteStyle*********");
                    console.log(deleteStyle);

                    resultArr = deleteStyle.data;
                    if (resultArr.status === "success") {
                        config["CONTROL_CENTER"].promptBaseMessage("Deleted Successfully", "");
                        handleReset();
                    } else {
                        config["CONTROL_CENTER"].promptWarningMessage("Error", "");
                        isValid = false;
                    }

                } else {
                    if (styleId === "") {
                        config["CONTROL_CENTER"].promptWarningMessage("Please Select Style", "");
                        isValid = false;
                    }
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
            isValid = false;
        }
        resultArr.success = isValid
        callback(resultArr);
    }

    function handleUploadSizeQty(){
        const input=document.getElementById('inputExcel');
        readXlsxFile(input.files[0]).then((rows) => {
            if(config["CONTROL_CENTER"].state.new){
                config['inputStyleCode'].setValue(rows[0][0]);
                config['inputStyleDescription'].setValue(rows[1][0]);
            }

            for(let i=0; i < rows[2].length; i++){
                if(rows[2][i] != ""){
                    let size =rows[2][i];
                    let qty = rows[3][i];
                    config['gridSizeFitJson'].addRow({"size":size,"fit":qty});
                }
                
            }

            for(let i=4; i<rows.length; i++){
                config['gridFabricInformation'].addRow({"fabric":rows[i][0]})
            }
            
        });
    }

    return generateStyleDisplay(config)
}

export default Style;