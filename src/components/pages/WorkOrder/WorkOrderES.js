import React, { useEffect, useState } from 'react';
import { generateWorkOrderDisplay } from './WorkOrderDS';
import config from './WorkOrderCS';
import API from '../../../api/API';

const WorkOrder = () => {
    let [rendered, setRendered] = useState(true);
    let [workOrder, setWorkOrder] = useState(null);
    let [showQrScanner, setShowQrScanner] = useState(false);
    let [qrScanTarget, setQrScanTarget] = useState(null); // "trolley" | "location"

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

    config["buttonCreateWorkOrder"].event.onClick = handleCreateWorkOrder;
    config["buttonNewWorkOrder"].event.onClick = handleNewWorkOrder;
    config["buttonAddBundle"].event.onClick = handleAddBundle;
    config["buttonScanTrolley"].event.onClick = handleScanTrolleyClick;
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
    config["buttonEditBundleSave"].event.onClick = handleEditBundleSave;
    config["buttonEditBundleCancel"].event.onClick = handleEditBundleCancel;

    // Expose delete/edit functions globally for card buttons (bundle/bundle detail rows are map()-rendered outside the schema tree)
    window.handleDeletePick = handleDeletePick;
    window.handleEditBundle = handleEditBundle;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        __loadBatchDetails();
        __loadWorkOrders();
        __loadUnusedTrolleys();

        // TextBox/DropDown/Multiselect fields are only enabled by the framework
        // when CONTROL_CENTER.state.new or .populated is true (or the field is
        // marked searchable) - this screen is "ready to create" from the moment
        // it loads, so mark it as a new record straight away.
        config["CONTROL_CENTER"].state.new = true;
        config["CONTROL_CENTER"].state.populated = false;
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.deleted = false;

        // Only auto-collapse sidebar on small screens (< 992px)
        if (window.innerWidth < 992) {
            const toggleBtn = document.getElementById('sidebarToggle');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "workOrder" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["buttonCreateWorkOrder"].schema.visible = false;
            config["buttonAddBundle"].schema.visible = false;
            config["buttonAddPick"].schema.visible = false;
            config["buttonFinalize"].schema.visible = false;
            config["buttonReopen"].schema.visible = false;
        }
    }

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified ||
            config["CONTROL_CENTER"].state.new ||
            config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    async function __loadBatchDetails() {
        try {
            const response = await API.get(`work-order/batch-details/list`);
            const batchDetails = response.data.data || [];
            const options = batchDetails.map((bd) => {
                const batchNo = bd.batch && bd.batch.batch_no ? bd.batch.batch_no : `Batch #${bd.batch_id}`;
                const modelName = bd.model && bd.model.name ? bd.model.name : `Model #${bd.model_id}`;
                return {
                    "id": bd.id,
                    "name": `${batchNo} - ${modelName} (Qty: ${bd.available_qty})`
                };
            });
            config['inputBatchDetail'].setOptions(options);
        } catch (err) {
            console.log(err);
            config["CONTROL_CENTER"].promptWarningMessage("Error loading batch details", "");
        }
    }

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

    function __trollyOption(trolly) {
        return { "id": trolly.id, "name": `${trolly.code} - ${trolly.name}` };
    }

    async function __loadUnusedTrolleys() {
        try {
            const response = await API.get(`trolly-master/getAll`);
            const list = response.data || [];
            config['inputBundleTrolly'].setOptions(list.map(__trollyOption));
        } catch (err) {
            console.log(err);
        }
    }

    function resetPickForm() {
        config['inputPickBundle'].setValue([]);
        config['inputPickLocationId'].setValue("");
        config['inputPickStockMaterial'].setValue("");
        config['inputPickWhlItem'].setOptions([]);
        config['inputPickWhlItem'].setValue([]);
        config['inputPickQty'].setValue("");
        config['inputBundleSize'].setValue("BasSize");
        config['inputBundleQty'].setValue("");
        config['inputBundleTrolly'].setValue([]);
    }

    function __resetWorkOrderState() {
        setWorkOrder(null);
        config['inputWorkOrderId'].setValue("");
        config['inputStatus'].setValue("");
        resetPickForm();
        config["buttonFinalize"].schema.visible = false;
        config["buttonReopen"].schema.visible = false;

        config["CONTROL_CENTER"].state.populated = false;
        config["CONTROL_CENTER"].state.new = true;
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.deleted = false;
    }

    function handleNewWorkOrder() {
        config['inputSelectWorkOrder'].setValue([]);
        config['inputBatchDetail'].setValue([]);
        __resetWorkOrderState();
        reRender();
    }

    function handleSelectWorkOrderChange() {
        const selected = config['inputSelectWorkOrder'].getValue() || [];
        if (selected.length === 0) {
            __resetWorkOrderState();
            reRender();
            return;
        }
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

    async function handleCreateWorkOrder() {
        try {
            const selectedBatchDetail = config['inputBatchDetail'].getValue() || [];

            if (selectedBatchDetail.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Batch Detail", "");
                return;
            }

            document.getElementById("spinner").style.display = "";

            const apiRequest = { batch_detail_id: parseInt(selectedBatchDetail[0]) };
            const response = await API.post(`work-order/create`, apiRequest);
            const data = response.data.data;

            config["CONTROL_CENTER"].promptBaseMessage("Work order created successfully", "");

            await __loadWorkOrders();
            await formPopulate(data.id);
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleAddBundle() {
        if (!workOrder) return;

        try {
            const qty = config['inputBundleQty'].data.value;
            const selectedTrolly = config['inputBundleTrolly'].getValue() || [];

            if (!qty || parseInt(qty) <= 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Bundle qty must be greater than 0", "");
                return;
            }
            const availableQty = workOrder.batch_detail ? Number(workOrder.batch_detail.available_qty) : null;
            if (availableQty !== null && parseInt(qty) > availableQty) {
                config["CONTROL_CENTER"].promptWarningMessage(`Bundle qty cannot exceed the available qty (${availableQty})`, "");
                return;
            }
            if (selectedTrolly.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Trolley", "");
                return;
            }

            document.getElementById("spinner").style.display = "";

            const apiRequest = {
                work_order_id: workOrder.id,
                // Size selection was removed from the UI - every bundle is created as "BasSize".
                size: "BasSize",
                qty: parseInt(qty),
                trolly_master_id: selectedTrolly.length > 0 ? parseInt(selectedTrolly[0]) : null
            };
            await API.post(`work-order/bundle/create`, apiRequest);

            config["CONTROL_CENTER"].promptBaseMessage("Bundle added successfully", "");

            config['inputBundleSize'].setValue("BasSize");
            config['inputBundleQty'].setValue("");
            config['inputBundleTrolly'].setValue([]);

            await formPopulate(workOrder.id);
            await __loadUnusedTrolleys();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleScanTrolleyClick() {
        setQrScanTarget("trolley");
        setShowQrScanner(true);
    }

    function handleScanLocationClick() {
        setQrScanTarget("location");
        setShowQrScanner(true);
    }

    function handleQrScanClose() {
        setShowQrScanner(false);
        setQrScanTarget(null);
    }

    function handleQrScanSuccess(decodedText) {
        setShowQrScanner(false);

        if (qrScanTarget === "location") {
            setQrScanTarget(null);
            handleLocationQrScanned(decodedText);
            return;
        }

        setQrScanTarget(null);
        handleTrolleyQrScanned(decodedText);
    }

    function handleTrolleyQrScanned(decodedText) {
        const trollyId = parseInt(String(decodedText).trim(), 10);
        if (!trollyId || isNaN(trollyId)) {
            config["CONTROL_CENTER"].promptWarningMessage("Invalid trolley QR code", "");
            return;
        }

        const options = config['inputBundleTrolly'].options || [];
        const match = options.find((o) => Number(o.id) === trollyId);
        if (!match) {
            config["CONTROL_CENTER"].promptWarningMessage("Scanned trolley is not available (already assigned or invalid)", "");
            return;
        }

        config['inputBundleTrolly'].setValueByID(match.id);
        config["CONTROL_CENTER"].promptBaseMessage(`Trolley ${match.name} selected`, "");
        reRender();
    }

    function handleLocationQrScanned(decodedText) {
        const locationId = parseInt(String(decodedText).trim(), 10);
        if (!locationId || isNaN(locationId)) {
            config["CONTROL_CENTER"].promptWarningMessage("Invalid location QR code", "");
            return;
        }

        config['inputPickLocationId'].setValue(String(locationId));
        handleBlurPickLocationId();
    }

    async function handleEditBundle(bundle) {
        try {
            document.getElementById("spinner").style.display = "";

            // Fetch a fresh unused-trolley list so it reflects anything
            // assigned/released elsewhere since the page loaded.
            const response = await API.get(`trolly-master/getAll`);
            const unused = response.data || [];
            const options = unused.map(__trollyOption);

            const current = bundle.trolly_master ? __trollyOption(bundle.trolly_master) : null;
            const mergedOptions = current && !options.some((o) => o.id === current.id)
                ? [current, ...options]
                : options;

            // PopUpPage only mounts its children while open - it unmounts them
            // again on close, so setValue()/setOptions() (bound by the
            // component on mount) aren't available yet. Set data.value/options
            // directly instead; the fields read them fresh the moment they mount.
            config["inputEditBundleId"].data.value = bundle.id;
            config["inputEditBundleSize"].data.value = bundle.size || "";
            config["inputEditBundleSize"].data.oldValue = bundle.size || "";
            config["inputEditBundleQty"].data.value = String(bundle.qty);
            config["inputEditBundleQty"].data.oldValue = String(bundle.qty);
            config["inputEditBundleTrolly"].options = mergedOptions;
            config["inputEditBundleTrolly"].data.value = current ? [current] : [];

            config["editBundlePopUp"].showPopUp();
            reRender();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleEditBundleSave() {
        try {
            const id = config["inputEditBundleId"].data.value;
            const size = config['inputEditBundleSize'].data.value;
            const qty = config['inputEditBundleQty'].data.value;
            const originalQty = parseInt(config['inputEditBundleQty'].data.oldValue, 10) || 0;
            const selectedTrolly = config['inputEditBundleTrolly'].getValue() || [];

            if (!id) return;

            if (!qty || parseInt(qty) <= 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Bundle qty must be greater than 0", "");
                return;
            }
            // This bundle's own current qty already counts toward
            // batch_detail.available_qty as "committed", so it's added back
            // here - editing (including increasing) up to what's truly
            // available shouldn't be blocked by the bundle's own allocation.
            if (workOrder && workOrder.batch_detail) {
                const maxQty = Number(workOrder.batch_detail.available_qty) + originalQty;
                if (parseInt(qty) > maxQty) {
                    config["CONTROL_CENTER"].promptWarningMessage(`Bundle qty cannot exceed the available qty (${maxQty})`, "");
                    return;
                }
            }
            if (selectedTrolly.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Trolley", "");
                return;
            }

            document.getElementById("spinner").style.display = "";
            config["editBundlePopUp"].closePopUp();

            const apiRequest = {
                size: size && String(size).trim() !== "" ? String(size).trim() : null,
                qty: parseInt(qty),
                trolly_master_id: selectedTrolly.length > 0 ? parseInt(selectedTrolly[0]) : null
            };
            await API.put(`work-order/bundle/update/${id}`, apiRequest);

            config["CONTROL_CENTER"].promptBaseMessage("Bundle updated successfully", "");
            config["inputEditBundleId"].data.value = "";

            if (workOrder) {
                await formPopulate(workOrder.id);
            }
            await __loadUnusedTrolleys();
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleEditBundleCancel() {
        config["editBundlePopUp"].closePopUp();
        config["inputEditBundleId"].data.value = "";
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

    return generateWorkOrderDisplay(config, workOrder, {
        showQrScanner,
        onQrScanSuccess: handleQrScanSuccess,
        onQrScanClose: handleQrScanClose
    });
}

export default WorkOrder;
