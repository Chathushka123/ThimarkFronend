import { useEffect, useState } from 'react';
import { generateWarehouseDisplay } from './WarehouseDS';
import config from './WarehouseCS';
import API from '../../../api/API';

const Warehouse = () => {
    let [rendered, setRendered] = useState(true);
    const [stockMaterials, setStockMaterials] = useState([]);
    const [warehouseLocations, setWarehouseLocations] = useState([]);
    const [locationBasis, setLocationBasis] = useState(0);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["gridWarehouses"].event.onRowCustomButton = handleRowEditClick;
    config["gridWarehouses"].event.onRowCustomButton2 = handleDownloadStickers;
    config["gridWarehouses"].event.onRowDelete = handleWarehouseDelete;
    config["buttonSaveInventory"].event.onClick = handleSaveInventory;
    config["inputLocationBasis"].event.onClick = handleChangeLocationBasis;
    config["gridLocations"].event.onRowCustomButton = handleAddNewLocaionRow;


    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load
    useEffect(() => {
        getAllWarehouses();
        getAllStockMaterials();
        config["gridLocations"].setData([{ id: 0, bin: "", rack: "" }])
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

    async function handleDownloadStickers(e, r) {
        const warehouseId = config["gridWarehouses"].getValueWiltColName(r, 'id');
        const warehouseName = config["gridWarehouses"].getValueWiltColName(r, 'name');
        if (!warehouseId) return;

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get(`/warehouses/${warehouseId}/stickers`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `stickers-${warehouseName || warehouseId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to download stickers. Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleWarehouseDelete(event, rowId) {
        const row = config["gridWarehouses"].data[rowId];
        if (!row) return;

        const warehouseId = row.id;
        if (!warehouseId || warehouseId === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete warehouse "${row.name}"? All associated locations will also be deleted.`
        );

        if (!confirmed) {
            // Revert the _rowstate set by the framework since user cancelled
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.delete(`/warehouses/${warehouseId}`);

            if (response.status === 200 || response.status === 204) {
                config["CONTROL_CENTER"].promptBaseMessage("Warehouse deleted successfully", "");

                // If this warehouse was loaded in the form, clear the form
                const currentId = config['inputId'].data.value;
                if (currentId && String(currentId) === String(warehouseId)) {
                    resetInputForm();
                }

                await getAllWarehouses();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting warehouse", "");
                row._rowstate = undefined;
                reRender();
            }
        } catch (error) {
            console.log(error);
            row._rowstate = undefined;
            reRender();

            try {
                if (error.response && error.response.data && error.response.data.message) {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", error.response.data.message || "Please Contact System Administrator");
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
                }
            } catch (err) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
            }
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleRowEditClick(e, r) {
        const id = config["gridWarehouses"].getValueWiltColName(r, 'id');
        const name = config["gridWarehouses"].getValueWiltColName(r, 'name');
        const code = config["gridWarehouses"].getValueWiltColName(r, 'code');
        const location_basis = config["gridWarehouses"].getValueWiltColName(r, 'location_basis');

        // Set values to form fields
        config['inputId'].setValue(id);
        config['inputName'].setValue(name);
        config['inputCode'].setValue(code);

        const isLocationBased = location_basis === 'Yes' || location_basis == 1 || location_basis === true;
        config['inputLocationBasis'].setValue(isLocationBased ? "1" : "0");
        setLocationBasis(isLocationBased ? 1 : 0);

        // Load locations and WHL items for this warehouse
        loadWarehouseData(id);

        config["CONTROL_CENTER"].state.modified = true;
        config["CONTROL_CENTER"].state.new = true;
    }

    function handleChangeLocationBasis(event) {
        const val = event.target.checked;
        if (val) {
            setLocationBasis(1);
        }
        else {
            setLocationBasis(0);
        }
    }

    function handleAddNewLocaionRow() {
        const currentData = config['gridLocations'].data || [];
        const newRow = { id: 0, bin: "", rack: "" };
        config['gridLocations'].setData([...currentData, newRow]);
    }

    function resetInputForm() {
        config['inputId'].setValue('');
        config['inputName'].setValue('');
        config['inputCode'].setValue('');
        config['inputLocationBasis'].setValue("0");
        setLocationBasis(0);
        config["gridLocations"].setData([{ id: 0, bin: "", rack: "" }])
        // config['gridWHLItems'].setData([]);

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
    }

    function handlePopulate() {
        const selected = config['inputId'].data.value;

        if(!selected || selected == 0 || selected == ""){
            config["CONTROL_CENTER"].promptWarningMessage("Please select a material first!", "");
        }

        loadWarehouseData(selected);
    }


    async function loadWarehouseData(warehouseId) {
        try {
            const response = await API.get(`/warehouses/${warehouseId}`);
            if (response.data && response.data.locations) {
                config['gridLocations'].setData(response.data.locations.length > 0 ? response.data.locations : [{ id: 0, bin: "", rack: "" }]);

                // Set location basis checkbox
                const isLocationBased = response.data.location_basis == 1;
                config['inputLocationBasis'].setValue(isLocationBased ? "1" : "0");
                setLocationBasis(isLocationBased ? 1 : 0);

                // Store locations for WHL items dropdown
                const locationOptions = response.data.locations.map(loc => ({
                    value: loc.id,
                    text: `Rack: ${loc.rack || 'N/A'}, Bin: ${loc.bin || 'N/A'}`
                }));
                setWarehouseLocations(locationOptions);

                // Set location dropdown options for WHL items grid
                // config['gridWHLItems'].columns.whl_id.options = [
                //     { value: 0, text: '- Select Location -' },
                //     ...locationOptions
                // ];
            }

            // Load WHL items for this warehouse
            // loadWHLItems(warehouseId);
        } catch (error) {
            console.log(error);
        }
    }

    const loadWHLItems = async (warehouseId) => {
        try {
            const response = await API.get(`/warehouses/${warehouseId}/whl-items`);
            if (response.data) {
                // config['gridWHLItems'].setData(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSaveInventory() {
        try {
            document.getElementById("spinner").style.display = "";

            const warehouseId = config['inputId'].data.value;

            if (!warehouseId || warehouseId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a warehouse first", "");
                return;
            }

            // Get WHL items from grid
            const whlItems = []

            // Validate WHL items
            for (let i = 0; i < whlItems.length; i++) {
                const item = whlItems[i];

                if (!item.whl_id || item.whl_id === 0) {
                    config["CONTROL_CENTER"].promptWarningMessage(`Row ${i + 1}: Please select a Warehouse Location`, "");
                    return;
                }

                if (!item.stock_item_id || item.stock_item_id === 0) {
                    config["CONTROL_CENTER"].promptWarningMessage(`Row ${i + 1}: Please select a Stock Material`, "");
                    return;
                }

                if (item.qty < 0) {
                    config["CONTROL_CENTER"].promptWarningMessage(`Row ${i + 1}: Quantity cannot be negative`, "");
                    return;
                }
            }

            // Save WHL items via API
            const response = await API.post(`/warehouses/${warehouseId}/whl-items`, {
                items: whlItems
            });

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Warehouse inventory saved successfully", "");
                await loadWHLItems(warehouseId);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving warehouse inventory", "");
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

    const getAllStockMaterials = async () => {
        try {
            const response = await API.get('/stock-materials');
            const materials = response.data.map(item => ({ value: item.id, text: item.name }));
            setStockMaterials(materials);

            // Set stock material dropdown options for WHL items grid
            // config['gridWHLItems'].columns.stock_item_id.options = [
            //     { value: 0, text: '- Select Material -' },
            //     ...materials
            // ];
        } catch (error) {
            console.log(error);
        }
    }

    const getAllWarehouses = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/warehouses');

            if (response.data && response.data.length > 0) {
                const rows = response.data.map(item => {
                    return {
                        ...item,
                        location_basis: item.location_basis ? 'Yes' : 'No'
                    }
                })

                config['gridWarehouses'].setData(rows);
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
            const name = config['inputName'].data.value;
            const code = config['inputCode'].data.value;
            const location_basis = locationBasis;
            const id = config['inputId'].data.value;

            // Validations
            if (!name || name.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Warehouse Name is required", "");
                return;
            }

            if (name.length > 100) {
                config["CONTROL_CENTER"].promptWarningMessage("Warehouse Name cannot exceed 100 characters", "");
                return;
            }

            if (!code || code.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Warehouse Code is required", "");
                return;
            }

            if (code.length > 50) {
                config["CONTROL_CENTER"].promptWarningMessage("Warehouse Code cannot exceed 50 characters", "");
                return;
            }

            // Get locations from grid
            const locations = config['gridLocations'].data
                .map(row => {
                    const loc = {
                        rack: row.rack || null,
                        bin: row.bin || null
                    };
                    if (row.id && row.id !== 0) {
                        loc.id = row.id;
                    }


                    if (row._rowstate && row._rowstate === "DELETED") {
                        return {
                            ...loc,
                            active: 0
                        };
                    }
                    else {
                        return loc;
                    }
                });

            // Prepare API request
            const apiRequest = {
                name: name.trim(),
                code: code.trim(),
                location_basis: location_basis ? 1 : 0,
                locations: locations
            };

            // Call API based on whether it's create or update
            let response;
            if (id && id !== "") {
                // Update existing warehouse
                response = await API.put(`/warehouses/${id}`, apiRequest);
            } else {
                // Create new warehouse
                response = await API.post(`/warehouses`, apiRequest);
            }

            if (response.status === 200 || response.status === 201) {
                if (!id || id === "") {
                    config['inputId'].setValue(response.data.id);
                }
                config["CONTROL_CENTER"].promptBaseMessage("Warehouse saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                await getAllWarehouses();
                resetInputForm();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving Warehouse", "");
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

    return generateWarehouseDisplay(config)
}

export default Warehouse;
