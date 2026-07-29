import { useEffect, useState } from 'react';
import { generateRouteDisplay } from './RoutingDS';
import config from './RoutingCS';
import API from '../../../api/API';

const Routing = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonAddOperation"].event.onClick = handleAddOperationRow;
    config["gridOperations"].event.onRowCustomButton = handleAddOperationRow;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        getOperationOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    function __handleApiError(error) {
        console.log(error);
        try {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = [];
                Object.entries(error.response.data.errors).forEach(([, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(msg => errors.push(msg));
                    } else {
                        errors.push(messages);
                    }
                });
                config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                return;
            } else if (error.response && error.response.data && error.response.data.message) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message);
                return;
            }
        } catch (err) {
            console.log(err);
        }
        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    }

    async function getOperationOptions() {
        try {
            const response = await API.get(`operation/list`);
            const list = (response.data && response.data.data) || [];
            config['gridOperations'].columns.operation_id.options = [
                { value: 0, text: "- Select Operation -" },
                ...list.map(op => ({ value: op.id, text: `${op.operation_code} - ${op.description}` }))
            ];
            reRender();
        } catch (error) {
            console.log(error);
        }
    }

    function handleNew() {
        config['gridOperations'].setData([]);
        return {
            "id": "",
            "route_code": "",
            "description": "",
            "active": "1"
        };
    }

    function handleUndo() {
        config["CONTROL_CENTER"].event.__onNew();
    }

    function handleAddOperationRow() {
        const currentData = config['gridOperations'].data || [];
        const activeRows = currentData.filter(r => r._rowstate !== "DELETED");
        const existingSeqs = activeRows.map(r => Number(r.seq) || 0);
        const nextSeq = existingSeqs.length > 0 ? Math.max(...existingSeqs) + 10 : 10;

        config['gridOperations'].addRow({
            operation_id: 0,
            seq: nextSeq,
            smv: 0,
            in: "1",
            out: "1"
        });
    }

    /*********************************************************/
    /********           Advance Search               **********/
    /*********************************************************/

    async function __getRoutesForSearch() {
        try {
            const response = await API.get(`routing/list`);
            const list = (response.data && response.data.data) || [];
            return list.map(route => ({
                "id_search": route.id,
                "route_code_search": route.route_code,
                "description_search": route.description || ""
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async function handleAdvanceSearchPopup() {
        document.getElementById("spinner").style.display = "";
        let data = await __getRoutesForSearch();
        document.getElementById("spinner").style.display = "none";

        let msg = "";
        if (data.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            data = data.slice(0, 20);
        }

        config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
    }

    async function handleAdvanceSearch(event, searchCriteria, callback) {
        const allRoutes = await __getRoutesForSearch();

        const routeCodeFilter = (searchCriteria.route_code_search || "").toLowerCase();
        const descriptionFilter = (searchCriteria.description_search || "").toLowerCase();

        let data = allRoutes.filter(row => {
            const matchesCode = routeCodeFilter === "" || (row.route_code_search || "").toLowerCase().includes(routeCodeFilter);
            const matchesDescription = descriptionFilter === "" || (row.description_search || "").toLowerCase().includes(descriptionFilter);
            return matchesCode && matchesDescription;
        });

        let msg = "";
        if (data.length > 20) {
            msg = "Only 20 records are loaded. Please narrow your search";
            data = data.slice(0, 20);
        }

        callback(data, msg);
    }

    async function handleAdvanceSearchDone(event, selectedRow) {
        await formPopulate(selectedRow.id_search);
    }

    async function formPopulate(routeId) {
        try {
            document.getElementById("spinner").style.display = "";

            const headerResponse = await API.get(`routing/get/${routeId}`);
            const routeData = headerResponse.data && headerResponse.data.data;

            if (!routeData) {
                config["CONTROL_CENTER"].promptWarningMessage("Route not found", "");
                return;
            }

            config['inputId'].data.value = routeData.id;
            config['inputId'].data.oldValue = routeData.id;
            config['inputRouteCode'].setValue(routeData.route_code);
            config['inputDescription'].setValue(routeData.description || "");
            config['inputActive'].setValue(routeData.active ? "1" : "0");

            const opsResponse = await API.get(`routing-operation-master/list?routing_id=${routeId}`);
            const opsList = (opsResponse.data && opsResponse.data.data) || [];

            const rows = opsList
                .sort((a, b) => (Number(a.seq) || 0) - (Number(b.seq) || 0))
                .map(op => ({
                    id: op.id,
                    operation_id: op.operation_id,
                    seq: op.seq,
                    smv: op.smv,
                    in: op.in ? "1" : "0",
                    out: op.out ? "1" : "0"
                }));

            config['gridOperations'].setData(rows);

            config["CONTROL_CENTER"].state.populated = true;
            config["CONTROL_CENTER"].state.modified = false;
            config["CONTROL_CENTER"].state.new = false;
            config["CONTROL_CENTER"].state.deleted = false;
            reRender();
        } catch (error) {
            __handleApiError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    /*********************************************************/
    /********                 Save                    **********/
    /*********************************************************/

    function __validate(routeCode) {
        if (!routeCode || routeCode.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Route Code", "");
            return false;
        }
        if (routeCode.length > 255) {
            config["CONTROL_CENTER"].promptWarningMessage("Route Code cannot exceed 255 characters", "");
            return false;
        }
        return true;
    }

    function __validateOperationRows(rows) {
        const activeRows = rows.filter(row => row._rowstate !== "DELETED");
        const seenOperationIds = new Set();

        for (let i = 0; i < activeRows.length; i++) {
            const row = activeRows[i];
            const rowNo = i + 1;
            const operationId = Number(row.operation_id) || 0;
            const seq = Number(row.seq) || 0;
            const smv = Number(row.smv) || 0;

            if (!operationId) {
                config["CONTROL_CENTER"].promptWarningMessage(`Row ${rowNo}: Please select an Operation`, "");
                return false;
            }
            if (!(seq > 0)) {
                config["CONTROL_CENTER"].promptWarningMessage(`Row ${rowNo}: Seq must be greater than 0`, "");
                return false;
            }
            if (!(smv > 0)) {
                config["CONTROL_CENTER"].promptWarningMessage(`Row ${rowNo}: SMV must be greater than 0`, "");
                return false;
            }
            if (seenOperationIds.has(operationId)) {
                config["CONTROL_CENTER"].promptWarningMessage(`Row ${rowNo}: This Operation is already added to this route`, "");
                return false;
            }
            seenOperationIds.add(operationId);
        }
        return true;
    }

    async function __saveOperationRows(routingId, rows) {
        for (const row of rows) {
            if (row._rowstate === "DELETED") {
                if (row.id && row.id !== "") {
                    await API.delete(`routing-operation-master/delete/${row.id}`);
                }
                continue;
            }

            const operationId = Number(row.operation_id) || 0;

            const payload = {
                routing_id: routingId,
                operation_id: operationId,
                smv: Number(row.smv) || 0,
                seq: Number(row.seq) || 0,
                in: row.in === "1" || row.in === true,
                out: row.out === "1" || row.out === true,
                active: true
            };

            if (row.id && row.id !== "") {
                await API.put(`routing-operation-master/update/${row.id}`, payload);
            } else {
                await API.post(`routing-operation-master/create`, payload);
            }
        }
    }

    async function handleSave(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const id = dataArr.data.id;
            const routeCode = (dataArr.data.route_code || "").trim();
            const description = (dataArr.data.description || "").trim();
            const active = dataArr.data.active === "1";
            const operationRows = (dataArr.data.gridOperations && dataArr.data.gridOperations.data) || [];

            if (__validate(routeCode) && __validateOperationRows(operationRows)) {
                const apiRequest = {
                    route_code: routeCode,
                    description: description,
                    active: active
                };

                document.getElementById("spinner").style.display = "";

                let response;
                if (dataArr.action === "MODIFY" && id && id !== "") {
                    response = await API.put(`routing/update/${id}`, apiRequest);
                } else {
                    response = await API.post(`routing/create`, apiRequest);
                }

                resultArr = response.data;
                if (resultArr && resultArr.success) {
                    const routeId = resultArr.data.id;
                    await __saveOperationRows(routeId, operationRows);

                    config["CONTROL_CENTER"].promptBaseMessage(resultArr.message || "Route saved successfully", "");
                    await formPopulate(routeId);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage((resultArr && resultArr.message) || "Error saving Route", "");
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        } catch (error) {
            __handleApiError(error);
            isValid = false;
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
        resultArr.success = isValid;
        callback(resultArr);
    }

    return generateRouteDisplay(config)
}

export default Routing;
