import React, { useEffect, useState } from 'react';
import { generateMaterialDisplay } from './MaterialDS';
import config from './MaterialCS';
import API from '../../../api/API';

const Material = () => {
    let [rendered, setRendered] = useState(true);
    const [uoms, setUoms] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(0);
    const [categories, setCategories] = useState([
        { value: 'Not selected', text: '- Select Category -' },
        { value: 'material', text: 'Material' },
        { value: 'consumble', text: 'Consumable' },
        { value: 'returnable', text: 'Returnable' }
    ]);
    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["gridMaterials"].event.onRowCustomButton = handleRowEditClick;
    config["gridMaterials"].event.onRowDelete = handleStkMatDelete;


    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        getAllUOMs();
        config['inputCategory'].setOptions(categories);
        // getAllMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "Material" }
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

    function handleRowEditClick(e, r) {
        const id = config["gridMaterials"].getValueWiltColName(r, 'id');
        const name = config["gridMaterials"].getValueWiltColName(r, 'name');
        const code = config["gridMaterials"].getValueWiltColName(r, 'code');
        const supplier = config["gridMaterials"].getValueWiltColName(r, 'supplier');
        const lead_time = config["gridMaterials"].getValueWiltColName(r, 'lead_time');
        const min_qty = config["gridMaterials"].getValueWiltColName(r, 'min_qty');
        const size = config["gridMaterials"].getValueWiltColName(r, 'size');
        const unit_price = config["gridMaterials"].getValueWiltColName(r, 'unit_price');
        const category = config["gridMaterials"].getValueWiltColName(r, 'category');
        const uom_id = config["gridMaterials"].getValueWiltColName(r, 'uom_id');

        setSelectedMaterial(id);
        // Set values to form fields
        config['inputId'].setValue(id);
        config['inputMatName'].setValue(name);
        config['inputMatCode'].setValue(code);
        config['inputSupplier'].setValue(supplier);
        config['inputLeadTime'].setValue(lead_time);
        config['inputMinQty'].setValue(min_qty);
        config['inputMatSize'].setValue(size);
        config['inputUnitPrice'].setValue(unit_price);
        config['inputCategory'].setValue(category);
        config['inputUOM'].setValue(uom_id);

        config["CONTROL_CENTER"].state.modified = true;
        config["CONTROL_CENTER"].state.new = true;
    }

    async function handleStkMatDelete(event, rowId) {
        const row = config["gridMaterials"].data[rowId];
        if (!row) return;

        const materialId = row.id;
        if (!materialId || materialId === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete material "${row.name}"?`
        );

        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.delete(`/stock-materials/${materialId}`);

            if (response.status === 200 || response.status === 204) {
                config["CONTROL_CENTER"].promptBaseMessage("Material deleted successfully", "");

                resetInputForm();
                await getAllMaterials(uoms);
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting material", "");
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

    function resetInputForm() {
        config['inputId'].setValue('');
        config['inputMatName'].setValue('');
        config['inputMatCode'].setValue('');
        config['inputSupplier'].setValue('');
        config['inputLeadTime'].setValue('');
        config['inputMinQty'].setValue(0);
        config['inputMatSize'].setValue('');
        config['inputUnitPrice'].setValue(0);
        config['inputCategory'].setValue('Not Selected');
        config['inputUOM'].setValue(0);

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;

        reRender();

    }

    const getAllUOMs = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/Uom/getUoms');
            const uoms = response.data.map(item => { return { value: item.id, text: item.uom } })
            setUoms(uoms);
            config['inputUOM'].setOptions([{ value: 0, text: '- Select UOM -' }, ...uoms]);
            getAllMaterials(uoms);
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

    const getAllMaterials = async (uomsX) => {
        document.getElementById("spinner").style.display = "";
        try {
            config['gridMaterials'].setData([]);
            const response = await API.get('/stock-materials');

            if (response.data && response.data.length > 0) {
                const rows = response.data.map(item => {
                    const real_category = categories.find(cat => cat.value === item.category)?.text || "";
                    const uom = uomsX.find(uom => uom.value == item.uom_id)?.text || "";
                    return {
                        ...item,
                        real_category,
                        uom,
                        size: item.size.join(","),
                        // _select: false // Ensure checkbox is unchecked by default
                    }
                })

                config['gridMaterials'].setData(rows);
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

    function handlePopulate() {
        if (selectedMaterial > 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Please click on the edit icon of relavant row!", "");
        }
        else {
            getAllMaterials(uoms);
        }

    }

    async function handleDownloadStickers(e, r) {

        try {
            document.getElementById("spinner").style.display = "";

            const rows = config["gridMaterials"].data;
            const selectedRows = rows.filter(row => row._select);
            const selectedIds = selectedRows.map(item => item.id);
            let response = null;

            if (selectedRows.length > 0) {
                response = await API.get(`/stock-materials/stickers/${selectedIds.join(',')}`, { responseType: 'blob' });

            }
            else {
                response = await API.get(`/stock-materials/stickers`, { responseType: 'blob' });

            }


            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `stickers-materials.pdf`);
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
                await getAllMaterials(uoms);
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

    return generateMaterialDisplay(config, { onPrint: handleDownloadStickers })
}

export default Material;
