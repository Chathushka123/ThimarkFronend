import { useEffect, useState } from 'react';
import { generateSupplierDisplay } from './SupplierDS';
import config from './SupplierCS';
import API from '../../../api/API';

const Supplier = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onPopulate = handlePopulate;
    config["gridSuppliers"].event.onRowCustomButton = handleRowEditClick;
    config["gridSuppliers"].event.onRowDelete = handleSupplierDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        getAllSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    window.onbeforeunload = function () {
        if (config["CONTROL_CENTER"].state.modified || config["CONTROL_CENTER"].state.new || config["CONTROL_CENTER"].state.deleted) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    function handleRowEditClick(e, r) {
        const id = config["gridSuppliers"].getValueWiltColName(r, 'id');
        const name = config["gridSuppliers"].getValueWiltColName(r, 'name');
        const address = config["gridSuppliers"].getValueWiltColName(r, 'address');
        const contact_no = config["gridSuppliers"].getValueWiltColName(r, 'contact_no');
        const email = config["gridSuppliers"].getValueWiltColName(r, 'email');

        config['inputId'].setValue(id);
        config['inputName'].setValue(name);
        config['inputAddress'].setValue(address || '');
        config['inputContactNo'].setValue(contact_no || '');
        config['inputEmail'].setValue(email || '');

        config["CONTROL_CENTER"].state.modified = true;
        config["CONTROL_CENTER"].state.new = true;
    }

    function resetInputForm() {
        config['inputId'].setValue('');
        config['inputName'].setValue('');
        config['inputAddress'].setValue('');
        config['inputContactNo'].setValue('');
        config['inputEmail'].setValue('');

        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = false;
        reRender();
    }

    function handlePopulate() {
        getAllSuppliers();
    }

    const getAllSuppliers = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            config['gridSuppliers'].setData([]);
            const response = await API.get('/suppliers');
            if (response.data && response.data.length > 0) {
                config['gridSuppliers'].setData(response.data);
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleSave() {
        try {
            document.getElementById("spinner").style.display = "";

            const id = config['inputId'].data.value;
            const name = config['inputName'].data.value;
            const address = config['inputAddress'].data.value;
            const contact_no = config['inputContactNo'].data.value;
            const email = config['inputEmail'].data.value;

            if (!name || name.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Supplier Name is required", "");
                return;
            }
            if (name.length > 255) {
                config["CONTROL_CENTER"].promptWarningMessage("Supplier Name cannot exceed 255 characters", "");
                return;
            }
            if (contact_no && contact_no.length > 20) {
                config["CONTROL_CENTER"].promptWarningMessage("Contact No. cannot exceed 20 characters", "");
                return;
            }
            if (email && email.length > 100) {
                config["CONTROL_CENTER"].promptWarningMessage("Email cannot exceed 100 characters", "");
                return;
            }

            const apiRequest = {
                name: name.trim(),
                address: address || null,
                contact_no: contact_no || null,
                email: email || null,
            };

            let response;
            if (id && id !== "") {
                response = await API.put(`/suppliers/${id}`, apiRequest);
            } else {
                response = await API.post(`/suppliers`, apiRequest);
            }

            if (response.status === 200 || response.status === 201) {
                config["CONTROL_CENTER"].promptBaseMessage("Supplier saved successfully", "");
                resetInputForm();
                await getAllSuppliers();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error saving supplier", "");
            }
        } catch (error) {
            console.log(error);
            try {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = [];
                    Object.entries(error.response.data.errors).forEach(([, messages]) => {
                        messages.forEach(msg => errors.push(msg));
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
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleSupplierDelete(event, rowId) {
        const row = config["gridSuppliers"].data[rowId];
        if (!row) return;

        const supplierId = row.id;
        if (!supplierId || supplierId === 0) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete supplier "${row.name}"?`
        );

        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.delete(`/suppliers/${supplierId}`);

            if (response.status === 200 || response.status === 204) {
                config["CONTROL_CENTER"].promptBaseMessage("Supplier deleted successfully", "");
                resetInputForm();
                await getAllSuppliers();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Error deleting supplier", "");
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


    return generateSupplierDisplay(config);
}

export default Supplier;
