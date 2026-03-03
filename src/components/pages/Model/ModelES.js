import React, { useEffect, useState } from 'react';
import { generateModelDisplay } from './ModelDS';
import config from './ModelCS';
import API from '../../../api/API';

const Model = () => {
    let [rendered, setRendered] = useState(true);
    const [mainModels, setMainModels] = useState([]);
    const [stockMaterials, setStockMaterials] = useState([]);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["gridModels"].event.onRowCustomButton = handleRowEditClick;
    config["gridMainModels"].event.onRowCustomButton = handleMainModelRowEdit;
    config["gridModelStockItems"].event.onRowCustomButton = handleAddNewItemRow;



    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load
    useEffect(() => {
        getAllMainModels();
        getAllStockMaterials();
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


    function handleAddNewItemRow() {
        const currentData = config['gridModelStockItems'].data || [];
        const newRow = { id: 0, stock_item_id: "", consumption: 0 };
        config['gridModelStockItems'].setData([...currentData, newRow]);
    }

    function handleRowEditClick(e, r) {
        const id = config["gridModels"].getValueWiltColName(r, 'id');
        const name = config["gridModels"].getValueWiltColName(r, 'name');
        const main_model_id = config["gridModels"].getValueWiltColName(r, 'main_model_id');
        const color = config["gridModels"].getValueWiltColName(r, 'color');
        const sizes = config["gridModels"].getValueWiltColName(r, 'sizes');

        // Clear Main Model form when editing Model
        resetMainModelForm();


        // Set values to form fields
        config['inputId'].setValue(id);
        config['inputName'].setValue(name);
        config['inputMainModel'].setValue(main_model_id);
        config['inputColor'].setValue(color);
        config['inputSizes'].setValue(sizes);

        // Load model stock items for this model
        loadModelStockItems(id);

        config["CONTROL_CENTER"].state.modified = true;
        config["CONTROL_CENTER"].state.new = true;
    }

    function resetInputForm() {
        config['inputId'].setValue('');
        config['inputName'].setValue('');
        config['inputMainModel'].setValue(0);
        config['inputColor'].setValue('');
        config['inputSizes'].setValue('');
        // config['gridModelStockItems'].setData([]);

        config["gridModelStockItems"].setData([{ id: 0, stock_item_id: 0, consumption: 0 }]);

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
    }

    function resetMainModelForm() {
        config['inputMainModelId'].setValue('');
        config['inputMainModelName'].setValue('');

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
    }

    function handleNew() {
        // Check if we're editing a Main Model or Model
        const mainModelName = config['inputMainModelName'].data.value;

        if (mainModelName && mainModelName.trim() !== "") {
            // Reset Main Model form
            resetMainModelForm();
        } else {
            // Reset Model form
            resetInputForm();
        }
    }

    function handleMainModelRowEdit(e, r) {
        const id = config["gridMainModels"].getValueWiltColName(r, 'main_model_id');
        const name = config["gridMainModels"].getValueWiltColName(r, 'main_model_name');

        // Clear Model form when editing Main Model
        resetInputForm();

        config['inputMainModelId'].setValue(id);
        config['inputMainModelName'].setValue(name);

        config["CONTROL_CENTER"].state.modified = true;
        config["CONTROL_CENTER"].state.new = true;
    }

    async function handleSaveMainModel() {
        try {
            document.getElementById("spinner").style.display = "";

            const name = config['inputMainModelName'].data.value;
            const id = config['inputMainModelId'].data.value;

            // Validations
            if (!name || name.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Main Model Name is required", "");
                return;
            }

            if (name.length > 191) {
                config["CONTROL_CENTER"].promptWarningMessage("Main Model Name cannot exceed 191 characters", "");
                return;
            }

            // Prepare API request (backend only accepts 'name' field)
            const apiRequest = {
                name: name.trim()
            };

            // Call API based on whether it's create or update
            let response;
            if (id && id !== "") {
                // Update existing main model
                response = await API.put(`/main-models/${id}`, apiRequest);
            } else {
                // Create new main model
                response = await API.post(`/main-models`, apiRequest);
            }

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Main Model saved successfully", "");
                resetMainModelForm();
                await getAllMainModels(); // This will refresh both the grid and dropdown
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving Main Model", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    const loadModelStockItems = async (modelId) => {
        try {
            const response = await API.get(`/models/${modelId}`);
            if (response.data && response.data.model_stock_items) {

                if (response.data.model_stock_items.length > 0) {
                    config['gridModelStockItems'].setData(response.data.model_stock_items);

                }
                else {
                    config["gridModelStockItems"].setData([{ id: 0, stock_item_id: 0, consumption: 0 }]);

                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAllMainModels = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/main-models');

            // Set data for grid
            if (response.data && response.data.length > 0) {
                const gridRows = response.data.map(item => {
                    return {
                        main_model_id: item.id,
                        main_model_name: item.name,
                        created_at: item.created_at,
                        updated_at: item.updated_at
                    }
                })
                config['gridMainModels'].setData(gridRows);
            }

            // Set data for dropdown
            const models = response.data.map(item => { return { value: item.id, text: item.name } })
            setMainModels(models);
            config['inputMainModel'].setOptions([{ value: 0, text: '- Select Main Model -' }, ...models]);

            getAllModels();
        }
        catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    const getAllStockMaterials = async () => {
        try {
            const response = await API.get('/stock-materials');
            const materials = response.data.map(item => { return { value: item.id, text: item.name } })
            setStockMaterials(materials);

            // Set stock material dropdown options for Model Stock Items grid
            config['gridModelStockItems'].columns.stock_item_id.options = [
                { value: 0, text: '- Select Material -' },
                ...materials
            ];
        }
        catch (error) {
            console.log(error);
            handleError(error);
        }
    }

    const getAllModels = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/models');

            if (response.data && response.data.length > 0) {
                const rows = response.data.map(item => {
                    return {
                        ...item,
                        main_model_name: item.main_model?.name || '',
                        main_model_id: item.main_model_id,
                        sizes: Array.isArray(item.sizes) ? item.sizes.join(",") : item.sizes
                    }
                })

                config['gridModels'].setData(rows);
            }

        }
        catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleError(error) {
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

    async function handleSave() {
        // Determine what to save based on which form has data
        const mainModelName = config['inputMainModelName'].data.value;
        const modelName = config['inputName'].data.value;

        // If Main Model name is filled, save Main Model
        if (mainModelName && mainModelName.trim() !== "") {
            await handleSaveMainModel();
        }
        // Otherwise, save Model
        else if (modelName && modelName.trim() !== "") {
            await handleSaveModel();
        }
        else {
            config["CONTROL_CENTER"].promptWarningMessage("Please fill in either Main Model or Model information", "");
        }
    }

    async function handleSaveModel() {
        try {
            document.getElementById("spinner").style.display = "";

            // Get form values
            const name = config['inputName'].data.value;
            const main_model_id = config['inputMainModel'].data.value;
            const color = config['inputColor'].data.value;
            const sizes = config['inputSizes'].data.value;
            const id = config['inputId'].data.value;

            // Validations
            if (!name || name.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Model Name is required", "");
                return;
            }

            if (name.length > 191) {
                config["CONTROL_CENTER"].promptWarningMessage("Model Name cannot exceed 191 characters", "");
                return;
            }

            if (!main_model_id || main_model_id === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select a Main Model", "");
                return;
            }

            if (!color || color.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Color is required", "");
                return;
            }

            if (color.length > 191) {
                config["CONTROL_CENTER"].promptWarningMessage("Color cannot exceed 191 characters", "");
                return;
            }

            // Validate and process sizes field
            let sizesArray = [];
            if (sizes && sizes.trim() !== "") {
                // Check if sizes contains spaces (invalid format)
                if (sizes.includes(' ')) {
                    config["CONTROL_CENTER"].promptWarningMessage("Sizes should not contain spaces. Use comma-separated values without spaces (e.g., S,M,L)", "");
                    return;
                }

                // Check if sizes contains commas
                if (sizes.includes(',')) {
                    // Split by comma and validate each part
                    sizesArray = sizes.split(',').filter(s => s.trim() !== '');

                    if (sizesArray.length === 0) {
                        config["CONTROL_CENTER"].promptWarningMessage("Invalid sizes format. Provide values like S or S,M,L (without spaces)", "");
                        return;
                    }
                } else {
                    // Single size value
                    sizesArray = [sizes.trim()];
                }
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Sizes are required", "");
                return;
            }

            // Get model stock items from grid
            const model_stock_items = config['gridModelStockItems'].data.map(row => {
                const item = {
                    stock_item_id: row.stock_item_id,
                    consumption: parseFloat(row.consumption) || 0
                };
                if (row.id) {
                    item.id = row.id;
                }
                if (row._rowstate && row._rowstate === "DELETED") {
                    return {
                        ...item,
                        active: 0
                    }
                }
                else {
                    return item
                }

            });

            // Prepare API request
            const apiRequest = {
                name: name.trim(),
                main_model_id: main_model_id,
                color: color.trim(),
                sizes: sizesArray,
                model_stock_items: model_stock_items
            };

            // Call API based on whether it's create or update
            let response;
            if (id && id !== "") {
                // Update existing model
                response = await API.put(`/models/${id}`, apiRequest);
            } else {
                // Create new model
                response = await API.post(`/models`, apiRequest);
            }

            if (response.status === 200 || response.status === 201) {
                if (!id || id === "") {
                    config['inputId'].setValue(response.data.id);
                }
                config["CONTROL_CENTER"].promptBaseMessage("Model saved successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                await getAllModels();
                resetInputForm();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error in saving Model", "");
            }

        } catch (error) {
            console.log(error);
            handleError(error);
        }
        finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    return generateModelDisplay(config)
}

export default Model;
