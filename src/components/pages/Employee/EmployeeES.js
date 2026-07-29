import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { generateEmployeeDisplay } from './EmployeeDS';
import config from './EmployeeCS';
import API from '../../../api/API';

const Employee = () => {
    let [rendered, setRendered] = useState(true);

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    config["buttonReloadList"].event.onClick = handleReloadList;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        getActiveEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    async function getActiveEmployees() {
        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get(`user/active-list`);
            const list = (response.data && response.data.data) || [];
            config['gridEmployees'].setData(list);
        } catch (error) {
            __handleApiError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getActiveEmployees();
    }

    async function handleDownloadStickers() {
        try {
            const rows = config["gridEmployees"].data || [];
            const selectedIds = rows.filter(row => row._select).map(row => row.id);

            if (selectedIds.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select at least one employee to print stickers for", "");
                return;
            }

            document.getElementById("spinner").style.display = "";

            const response = await API.get(`/user/employee-stickers/${selectedIds.join(',')}`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `employee-stickers.pdf`);
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

    function handleDownloadExcel() {
        const rows = config["gridEmployees"].data || [];

        if (rows.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("No employees to export", "");
            return;
        }

        const exportRows = rows.map((row) => ({
            ID: row.id,
            Name: row.name,
            Email: row.email
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        XLSX.writeFile(workbook, `employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    return generateEmployeeDisplay(config, { onPrint: handleDownloadStickers, onDownloadExcel: handleDownloadExcel })
}

export default Employee;
