import React, { useEffect, useState } from 'react';
import { generateWorkOrderPickingDisplay } from './WorkOrderPickingDS';
import config from './WorkOrderPickingCS';
import API from '../../../api/API';

const WorkOrderPicking = () => {
    let [rendered, setRendered] = useState(true);
    let [workOrder, setWorkOrder] = useState(null);
    let [showQrScanner, setShowQrScanner] = useState(false);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    config['inputSelectWorkOrder'].event.onSelect = handleSelectWorkOrderChange;
    config['inputSelectWorkOrder'].event.onRemove = handleSelectWorkOrderChange;
    config['inputPickLocationId'].event.onBlur = handleBlurPickLocationId;

    config["buttonScanLocation"].event.onClick = handleScanLocationClick;
    config["buttonAddPick"].event.onClick = handleAddPick;

    config["buttonFinalize"].event.onClick = handleFinalize;
    config["buttonReopen"].event.onClick = handleReopen;

    config["buttonFinalizeYes"].event.onClick = handleFinalizeYes;
    config["buttonFinalizeNo"].event.onClick = handleFinalizeNo;
    config["buttonReopenYes"].event.onClick = handleReopenYes;
    config["buttonReopenNo"].event.onClick = handleReopenNo;
    config["buttonDeletePickYes"].event.onClick = handleDeletePickYes;
    config["buttonDeletePickNo"].event.onClick = handleDeletePickNo;

    // Expose delete function globally for card buttons (bundle detail rows are map()-rendered outside the schema tree)
    window.handleDeletePick = handleDeletePick;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        __loadWorkOrders();

        // Only auto-collapse sidebar on small screens (< 992px)
        if (window.innerWidth < 992) {
            const toggleBtn = document.getElementById('sidebarToggle');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "workOrderPicking" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonAddPick"].schema.visible = false;
            config["buttonFinalize"].schema.visible = false;
            config["buttonReopen"].schema.visible = false;
        }
    }

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function __loadWorkOrders() {
        try {
            const response = await API.get(`work-order/list`);
            const workOrders = response.data.data || [];
            const options = workOrders.map((wo) => {
                const batchDetail = wo.batch_detail || {};
                const batchNo = batchDetail.batch && batchDetail.batch.batch_no ? batchDetail.batch.batch_no : '';
                const modelName = batchDetail.model && batchDetail.model.name ? batchDetail.model.name : '';
                return {
                    "id": wo.id,
                    "name": `WO#${wo.id} - ${batchNo} - ${modelName} [${wo.status}]`
                };
            });
            config['inputSelectWorkOrder'].setOptions(options);
        } catch (err) {
            console.log(err);
            config["CONTROL_CENTER"].promptWarningMessage("Error loading work orders", "");
        }
    }

    function __populateBundleDropdown(bundles) {
        const options = (bundles || []).map((bundle) => ({
            "id": bundle.id,
            "name": `#${bundle.id} - ${bundle.size ? 'Size ' + bundle.size : 'No Size'} (Qty ${bundle.qty})`
        }));
        config['inputPickBundle'].setOptions(options);
    }

    function resetPickForm() {
        config['inputPickBundle'].setValue([]);
        config['inputPickLocationId'].setValue("");
        config['inputPickStockMaterial'].setValue("");
        config['inputPickWhlItem'].setOptions([]);
        config['inputPickWhlItem'].setValue([]);
        config['inputPickQty'].setValue("");
    }

    function __resetWorkOrderState() {
        setWorkOrder(null);
        config['inputWorkOrderId'].setValue("");
        config['inputStatus'].setValue("");
        config['inputPickBundle'].setOptions([]);
        resetPickForm();
        config["buttonFinalize"].schema.visible = false;
        config["buttonReopen"].schema.visible = false;

        config["CONTROL_CENTER"].state.populated = false;
        config["CONTROL_CENTER"].state.new = false;
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.deleted = false;
    }

    function handleSelectWorkOrderChange() {
        const selected = config['inputSelectWorkOrder'].getValue() || [];
        if (selected.length === 0) {
            __resetWorkOrderState();
            reRender();
            return;
        }
        resetPickForm();
        formPopulate(selected[0]);
    }

    async function formPopulate(id) {
        try {
            document.getElementById("spinner").style.display = "";

            const response = await API.get(`work-order/get/${id}`);
            const data = response.data.data;

            setWorkOrder(data);
            config['inputWorkOrderId'].setValue(data.id);
            config['inputStatus'].setValue(data.status);
            config['inputSelectWorkOrder'].setValueByID(data.id);
            __populateBundleDropdown(data.bundles || []);

            config["buttonFinalize"].schema.visible = data.status === 'OPEN';
            config["buttonReopen"].schema.visible = data.status === 'FINALIZED';

            config["CONTROL_CENTER"].state.populated = true;
            config["CONTROL_CENTER"].state.new = false;
            config["CONTROL_CENTER"].state.modified = false;
            config["CONTROL_CENTER"].state.deleted = false;

            reRender();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleScanLocationClick() {
        setShowQrScanner(true);
    }

    function handleQrScanClose() {
        setShowQrScanner(false);
    }

    function handleQrScanSuccess(decodedText) {
        setShowQrScanner(false);

        const locationId = parseInt(String(decodedText).trim(), 10);
        if (!locationId || isNaN(locationId)) {
            config["CONTROL_CENTER"].promptWarningMessage("Invalid location QR code", "");
            return;
        }

        config['inputPickLocationId'].setValue(String(locationId));
        handleBlurPickLocationId();
    }

    async function handleBlurPickLocationId() {
        const locationId = config['inputPickLocationId'].data.value;
        config['inputPickStockMaterial'].setValue("");
        config['inputPickWhlItem'].setOptions([]);
        config['inputPickWhlItem'].setValue([]);

        if (!locationId || String(locationId).trim() === "") return;

        try {
            const id = String(locationId).trim();
            const response = await API.get(`warehouse-locations/${id}`);
            const location = response.data;

            if (location.stock_material) {
                config['inputPickStockMaterial'].setValue(`${location.stock_material.code || ''} - ${location.stock_material.name || ''}`);
            } else {
                config['inputPickStockMaterial'].setValue("No stock material assigned to this location");
            }

            const whlItems = Array.isArray(location.whl_items) ? location.whl_items.filter((w) => Number(w.qty) > 0) : [];
            if (whlItems.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("No available stock at this location", "");
            }

            config['inputPickWhlItem'].setOptions(whlItems.map((w) => ({
                "id": w.id,
                "name": `Row #${w.id} - Available: ${w.qty}`
            })));

            reRender();
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    }

    async function handleAddPick() {
        if (!workOrder) return;

        try {
            const selectedBundle = config['inputPickBundle'].getValue() || [];
            const selectedWhlItem = config['inputPickWhlItem'].getValue() || [];
            const qty = config['inputPickQty'].data.value;

            if (selectedBundle.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Bundle", "");
                return;
            }
            if (selectedWhlItem.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a stock row to pick from", "");
                return;
            }
            if (!qty || parseInt(qty) <= 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Qty to pick must be greater than 0", "");
                return;
            }

            document.getElementById("spinner").style.display = "";

            const apiRequest = {
                bundle_id: parseInt(selectedBundle[0]),
                whl_item_id: parseInt(selectedWhlItem[0]),
                qty: parseInt(qty)
            };
            await API.post(`work-order/bundle-detail/create`, apiRequest);

            config["CONTROL_CENTER"].promptBaseMessage("Material picked successfully", "");

            config['inputPickQty'].setValue("");

            await formPopulate(workOrder.id);
            await handleBlurPickLocationId();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleDeletePick(bundleDetailId) {
        config["inputDeletePickId"].data.value = bundleDetailId;
        config["deletePickPopUp"].showPopUp();
    }

    async function handleDeletePickYes() {
        try {
            const id = config["inputDeletePickId"].data.value;
            if (!id) return;

            document.getElementById("spinner").style.display = "";
            config["deletePickPopUp"].closePopUp();

            await API.post(`work-order/bundle-detail/delete`, { id: parseInt(id) });

            config["CONTROL_CENTER"].promptBaseMessage("Pick removed successfully", "");
            config["inputDeletePickId"].data.value = "";

            if (workOrder) {
                await formPopulate(workOrder.id);
            }
            if (config['inputPickLocationId'].data.value) {
                await handleBlurPickLocationId();
            }
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleDeletePickNo() {
        config["deletePickPopUp"].closePopUp();
        config["inputDeletePickId"].data.value = "";
    }

    function handleFinalize() {
        if (!workOrder) return;
        if (!workOrder.bundles || workOrder.bundles.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Add at least one bundle before finalizing", "");
            return;
        }
        config["finalizeWorkOrderPopUp"].showPopUp();
    }

    async function handleFinalizeYes() {
        try {
            config["finalizeWorkOrderPopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";

            await API.post(`work-order/finalize/${workOrder.id}`);

            config["CONTROL_CENTER"].promptBaseMessage("Work order finalized successfully", "");

            await formPopulate(workOrder.id);
            await __loadWorkOrders();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleFinalizeNo() {
        config["finalizeWorkOrderPopUp"].closePopUp();
    }

    function handleReopen() {
        if (!workOrder) return;
        config["reopenWorkOrderPopUp"].showPopUp();
    }

    async function handleReopenYes() {
        try {
            config["reopenWorkOrderPopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";

            await API.post(`work-order/reopen/${workOrder.id}`);

            config["CONTROL_CENTER"].promptBaseMessage("Work order reopened successfully", "");

            await formPopulate(workOrder.id);
            await __loadWorkOrders();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReopenNo() {
        config["reopenWorkOrderPopUp"].closePopUp();
    }

    function handleError(error) {
        try {
            const respData = error.response && error.response.data;

            if (respData && respData.errors && typeof respData.errors === 'object' && !Array.isArray(respData.errors)) {
                const messages = [];
                Object.values(respData.errors).forEach((msgs) => {
                    if (Array.isArray(msgs)) {
                        msgs.forEach((m) => messages.push(m));
                    } else if (msgs) {
                        messages.push(msgs);
                    }
                });
                if (messages.length > 0) {
                    config["CONTROL_CENTER"].promptWarningMessage(messages.join('\n'), "");
                    return;
                }
            }

            if (respData && respData.message) {
                config["CONTROL_CENTER"].promptWarningMessage(respData.message, "");
                return;
            }

            if (error.message) {
                config["CONTROL_CENTER"].promptWarningMessage(error.message, "");
                return;
            }

            config["CONTROL_CENTER"].promptWarningMessage("An unexpected error occurred", "");
        } catch (err) {
            console.error("Error in handleError:", err);
            config["CONTROL_CENTER"].promptWarningMessage("An unexpected error occurred", "");
        }
    }

    return generateWorkOrderPickingDisplay(config, workOrder, {
        showQrScanner,
        onQrScanSuccess: handleQrScanSuccess,
        onQrScanClose: handleQrScanClose
    });
}

export default WorkOrderPicking;
