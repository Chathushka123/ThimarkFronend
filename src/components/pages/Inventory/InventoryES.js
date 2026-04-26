import React, { useEffect, useState } from 'react';
import { generateInventoryDisplay, downloadExcel } from './InventoryDS';
import config from './InventoryCS';
import API from '../../../api/API';

const Inventory = () => {
    let [rendered, setRendered] = useState(true);
    const [warehouses, SetWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(0);
    const [selectedFullWarehouse, setSelectedFullWarehouse] = useState(0);
    const [inventoryData, setInventoryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIds, setHighlightedIds] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null); // 'low' | 'critical' | null
    const [pendingReturnables, setPendingReturnables] = useState([]);
    const [showReturnablesModal, setShowReturnablesModal] = useState(false);
    const [showSnapshotModal, setShowSnapshotModal] = useState(false);
    const [snapshotDate, setSnapshotDate] = useState('');
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

    const [formReadWrite, __setFormReadWrite] = useState(false);
    function toggleFullscreen() {
        setIsFullscreen(prev => !prev);
    }

    // Lock body scroll when fullscreen overlay is open
    useEffect(() => {
        document.body.style.overflow = isFullscreen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isFullscreen]);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["inputWH"].event.onChange = handleWarehouseChange;


    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "Inventory" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    async function handleBinQtyChange(itemId, newQty) {
        document.getElementById('spinner').style.display = '';
        try {
            await API.put(`/whl-items/${itemId}`, { qty: newQty });
            await getWarehouseRelatedData(selectedWarehouse);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to update quantity. Please Contact System Administrator");
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    }

    async function handleBinMaterialChange(sourceBinId, targetBinId, materialId, qty) {
        document.getElementById('spinner').style.display = '';
        try {
            await API.post('/whl-items/move-bin', {
                from_bin_id: sourceBinId,
                to_bin_id: targetBinId,
                material_id: materialId,
                qty,
            });
            await getWarehouseRelatedData(selectedWarehouse);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", error.response?.data?.message || error.message || "Failed to transfer material. Please Contact System Administrator");
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    }

    async function handleAddMaterial(binId, material, qty) {
        document.getElementById('spinner').style.display = '';
        try {
            await API.post('/whl-items', { whl_id: binId, stock_item_id: material.id, qty });
            await getWarehouseRelatedData(selectedWarehouse);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", error.response?.data?.message || error.message || "Failed to add material. Please Contact System Administrator");

        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    }

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        getAllWarehouses();
        // config["CONTROL_CENTER"].state.modified = true;
        // config["CONTROL_CENTER"].state.new = true;
    }, []);

    // Debounced material search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setHighlightedIds([]);
            return;
        }

        if (searchTerm.trim().length >= 3) {
            const timer = setTimeout(() => {
                searchMaterials(searchTerm.trim(), selectedWarehouse);
            }, 400);
            return () => clearTimeout(timer);
        }

    }, [searchTerm]);

    // Scroll to first matched bin after results render
    useEffect(() => {
        if (highlightedIds.length === 0) return;
        const timer = setTimeout(() => {
            const first = document.querySelector('[data-material-match="true"]');
            if (first) {
                first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 80); // short delay lets React finish painting
        return () => clearTimeout(timer);
    }, [highlightedIds]);

    const searchMaterials = async (term, selectedWarehouse) => {
        setIsSearching(true);
        try {
            const response = await API.get(`/stock-materials/search?q=${encodeURIComponent(term)}&wh=${selectedWarehouse}`);

            console.log(response.data)
            if (Array.isArray(response.data)) {
                setHighlightedIds(response.data.map(item => item.id));
            } else {
                setHighlightedIds([]);
            }
        } catch (error) {
            console.log(error);
            setHighlightedIds([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Enable navigation prompt
    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    function handleWarehouseChange() {
        const selectedWH = config["inputWH"].data.value;
        if (selectedWH > 0) {
            getWarehouseRelatedData(selectedWH);
            setSelectedWarehouse(selectedWH);

            const fullWh = warehouses.find(item => item.value == selectedWH);
            setSelectedFullWarehouse(fullWh);
            // if (fullWh.location_basis == 1) {
            //     __setFormReadWrite(false)
            // }
            // else {
            //     __setFormReadWrite(true);
            // }

        }
        else {
            setInventoryData([]);
        }
    }

    function resetInputForm() {
        config['inputUOM'].setValue(0);

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
    }

    const getWarehouseRelatedData = async (wh) => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get(`/inventory/warehouse/${wh}`);

            if (response.data && response.data.length > 0) {
                setInventoryData(response.data);
            } else {
                setInventoryData([]);
            }

        }
        catch (error) {
            console.log(error);
            try {
                if (error.response && error.response.data && error.response.data.message) {
                    try {
                        let errors = [];
                        const errorData = typeof error.response.data.message === 'string'
                            ? JSON.parse(error.response.data.message)
                            : error.response.data.message;

                        Object.entries(errorData).forEach(([index, data]) => {
                            if (Array.isArray(data)) {
                                data.forEach(error => errors.push(error));
                            } else {
                                errors.push(data);
                            }
                        });

                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                        return;
                    } catch (parseError) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message || "Please Contact System Administrator");
                        return;
                    }
                } else if (error.response && error.response.data && error.response.data.errors) {
                    // Laravel validation errors format
                    let errors = [];
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        messages.forEach(msg => errors.push(msg));
                    });
                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    return;
                }
            } catch (err) {
                console.log(err);
            }

            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }


    const getAllWarehouses = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/warehouses');

            if (response.data && response.data.length > 0) {
                const whs = response.data.map(item => { return { value: item.id, text: `${item.code} - ${item.name}`, location_basis: item.location_basis } })
                SetWarehouses(whs);
                config['inputWH'].setOptions([{ value: 0, text: '- Select Warehouse -' }, ...whs]);
            }

        }
        catch (error) {
            console.log(error);
            try {
                if (error.response && error.response.data && error.response.data.message) {
                    try {
                        let errors = [];
                        const errorData = typeof error.response.data.message === 'string'
                            ? JSON.parse(error.response.data.message)
                            : error.response.data.message;

                        Object.entries(errorData).forEach(([index, data]) => {
                            if (Array.isArray(data)) {
                                data.forEach(error => errors.push(error));
                            } else {
                                errors.push(data);
                            }
                        });

                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                        return;
                    } catch (parseError) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message || "Please Contact System Administrator");
                        return;
                    }
                } else if (error.response && error.response.data && error.response.data.errors) {
                    // Laravel validation errors format
                    let errors = [];
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        messages.forEach(msg => errors.push(msg));
                    });
                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    return;
                }
            } catch (err) {
                console.log(err);
            }

            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const name = config['inputMatName'].data.value;
            const code = config['inputMatCode'].data.value;
            const supplier = config['inputSupplier'].data.value;
            const lead_time = config['inputLeadTime'].data.value;
            const min_qty = config['inputMinQty'].data.value;
            const unit_price = config['inputUnitPrice'].data.value;
            const size = config['inputMatSize'].data.value;
            const uom_id = config['inputUOM'].data.value;
            const category = config['inputCategory'].data.value;
            const id = config['inputId'].data.value;


            // Validations
            if (!name || name.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Material Name is required", "");
                return;
            }

            if (name.length > 100) {
                config["CONTROL_CENTER"].promptWarningMessage("Material Name cannot exceed 100 characters", "");
                return;
            }

            if (!code || code.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Material Code is required", "");
                return;
            }

            if (code.length > 50) {
                config["CONTROL_CENTER"].promptWarningMessage("Material Code cannot exceed 50 characters", "");
                return;
            }

            if (!uom_id && uom_id === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please add a valid UOM", "");
                return;
            }

            if (supplier && supplier.length > 100) {
                config["CONTROL_CENTER"].promptWarningMessage("Supplier cannot exceed 100 characters", "");
                return;
            }

            if (lead_time && !Number.isInteger(Number(lead_time))) {
                config["CONTROL_CENTER"].promptWarningMessage("Lead Time must be an integer", "");
                return;
            }

            if (min_qty && !Number.isInteger(Number(min_qty))) {
                config["CONTROL_CENTER"].promptWarningMessage("Min Qty must be an integer", "");
                return;
            }

            if (!['material', 'consumble', 'returnable'].includes(category)) {
                config["CONTROL_CENTER"].promptWarningMessage("A valid category should be selected!", "");
                return;
            }

            if (unit_price && !Number.isInteger(Number(unit_price))) {
                config["CONTROL_CENTER"].promptWarningMessage("Invalid Unit price", "");
                return;
            }

            // Validate and process size field
            let sizeArray = ['base_size'];
            if (size && size.trim() !== "") {
                // Check if size contains spaces (invalid format)
                if (size.includes(' ')) {
                    config["CONTROL_CENTER"].promptWarningMessage("Size should not contain spaces. Use comma-separated values without spaces (e.g., S,M,L)", "");
                    return;
                }

                // Check if size contains commas
                if (size.includes(',')) {
                    // Split by comma and validate each part
                    sizeArray = size.split(',').filter(s => s.trim() !== '');

                    if (sizeArray.length === 0) {
                        config["CONTROL_CENTER"].promptWarningMessage("Invalid size format. Provide values like S or S,M,L (without spaces)", "");
                        return;
                    }
                } else {
                    // Single size value
                    sizeArray = [size.trim()];
                }
            }

            // Prepare API request
            const apiRequest = {
                name: name.trim(),
                code: code.trim(),
                supplier: supplier ? supplier.trim() : null,
                lead_time: lead_time ? parseInt(lead_time) : null,
                min_qty: min_qty ? parseInt(min_qty) : null,
                size: sizeArray,
                uom_id: uom_id,
                unit_price: unit_price,
                category: (category && category !== 'Not selected') ? category : null
            };

            // Call API based on whether it's create or update
            let response;
            if (id && id !== "") {
                // Update existing material
                response = await API.put(`/stock-materials/${id}`, apiRequest);
            } else {
                // Create new material
                response = await API.post(`/stock-materials`, apiRequest);
            }

            if (response.status === 200 || response.status === 201) {
                if (!id || id === "") {
                    config['inputId'].setValue(response.data.id);
                }
                config["CONTROL_CENTER"].promptBaseMessage("Material saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                resetInputForm();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving Material", "");
            }


        } catch (error) {
            console.log(error);

            try {
                if (error.response && error.response.data && error.response.data.message) {
                    try {
                        let errors = [];
                        const errorData = typeof error.response.data.message === 'string'
                            ? JSON.parse(error.response.data.message)
                            : error.response.data.message;

                        Object.entries(errorData).forEach(([index, data]) => {
                            if (Array.isArray(data)) {
                                data.forEach(error => errors.push(error));
                            } else {
                                errors.push(data);
                            }
                        });

                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                        return;
                    } catch (parseError) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message || "Please Contact System Administrator");
                        return;
                    }
                } else if (error.response && error.response.data && error.response.data.errors) {
                    // Laravel validation errors format
                    let errors = [];
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        messages.forEach(msg => errors.push(msg));
                    });
                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    return;
                }
            } catch (err) {
                console.log(err);
            }

            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    const viewPendingReturnables = async () => {
        document.getElementById('spinner').style.display = '';
        try {
            const response = await API.get('/returnable/getPendingReturnables');
            const data = Array.isArray(response.data) ? response.data : [];
            // Dynamically build column config from the first row's keys

            const tblData = data.map(item => {
                return {
                    id: item.id,
                    item_name: item.stock_item?.name || "",
                    item_code: item.stock_item?.code || "",
                    issued_to: item.issued_to?.email || "",
                    issued_qty: item.issued_qty || "0",
                    return_qty: item.return_qty || "0",
                    issued_by: item.created_by?.email || "",
                    issued_at: item.created_at || "",
                    updated_by: item.updated_by?.email || "",
                    updated_at: item.updated_at || ""
                }
            })

            config['gridReturnables'].data = tblData;
            setPendingReturnables(tblData);
            setShowReturnablesModal(true);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage('Error', 'Failed to load pending returnables. Please Contact System Administrator');
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    };

    const downloadSnapshot = async () => {
        if (!selectedWarehouse || selectedWarehouse <= 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select a warehouse first", "");
            return;
        }
        if (!snapshotDate) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select a date", "");
            return;
        }
        document.getElementById('spinner').style.display = '';
        try {
            const response = await API.get(`/warehouses/${selectedWarehouse}/snapshot?date=${encodeURIComponent(snapshotDate)}`);
            const data = response.data?.structure || [];
            if (data && data && data.length > 0) {
                downloadExcel(data, `inventory_snapshot_${snapshotDate}.xlsx`);
                setShowSnapshotModal(false);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("No snapshot data found for the selected date", "");
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to fetch snapshot. Please Contact System Administrator");
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    };

    return generateInventoryDisplay(config, inventoryData, {
        searchTerm,
        setSearchTerm,
        highlightedIds,
        isSearching,
        isFullscreen,
        toggleFullscreen,
        activeFilter,
        setActiveFilter,
        viewPendingReturnables,
        pendingReturnables,
        showReturnablesModal,
        setShowReturnablesModal,
        formReadWrite,
        handleBinQtyChange,
        handleBinMaterialChange,
        handleAddMaterial,
        selectedWarehouse,
        showSnapshotModal,
        setShowSnapshotModal,
        snapshotDate,
        setSnapshotDate,
        onDownloadSnapshot: downloadSnapshot,
        isControlsCollapsed,
        setIsControlsCollapsed,
    })
}

export default Inventory;
