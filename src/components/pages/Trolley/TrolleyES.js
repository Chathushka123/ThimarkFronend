import { useEffect, useState } from 'react';
import { generateTrolleyDisplay } from './TrolleyDS';
import config from './TrolleyCS';
import API from '../../../api/API';

const Trolley = () => {
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

    config["buttonUndo"].event.onClick = handleUndo;
    config["buttonReloadList"].event.onClick = handleReloadList;

    config["gridTrolley"].event.onRowCustomButton = handleRowEditClick;
    config["gridTrolley"].event.onRowDelete = handleTrolleyDelete;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        getAllTrolleys();
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

    // trolly-master's error envelope is { status: 'error', message: <string | validator-errors-object> }
    function __handleApiError(error) {
        console.log(error);
        try {
            const data = error.response && error.response.data;
            if (data && data.message) {
                if (typeof data.message === 'string') {
                    config["CONTROL_CENTER"].promptWarningMessage(data.message, "");
                    return;
                }
                const errors = [];
                Object.values(data.message).forEach((msgs) => {
                    if (Array.isArray(msgs)) {
                        msgs.forEach((m) => errors.push(m));
                    } else if (msgs) {
                        errors.push(msgs);
                    }
                });
                if (errors.length > 0) {
                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    return;
                }
            }
        } catch (err) {
            console.log(err);
        }
        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    }

    async function getAllTrolleys() {
        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get(`trolly-master/getAll`);
            const list = response.data || [];
            config['gridTrolley'].setData(list.map(item => ({
                ...item,
                active: item.active ? "1" : "0"
            })));
        } catch (error) {
            __handleApiError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function handleReloadList() {
        getAllTrolleys();
    }

    async function handleDownloadStickers() {
        try {
            const rows = config["gridTrolley"].data || [];
            const selectedIds = rows.filter(row => row._select).map(row => row.id);

            if (selectedIds.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Please select at least one trolley to print stickers for", "");
                return;
            }

            document.getElementById("spinner").style.display = "";

            const response = await API.get(`/trolly-master/stickers/${selectedIds.join(',')}`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `trolley-stickers.pdf`);
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

    function handleNew() {
        return {
            "id": "",
            "code": "",
            "name": "",
            "active": "1"
        };
    }

    function handleUndo() {
        config["CONTROL_CENTER"].event.__onNew();
    }

    async function handleRowEditClick(e, r) {
        const row = config["gridTrolley"].data[r];
        if (!row) return;

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.get(`trolly-master/getOne/${row.id}`);
            const trolley = response.data && response.data.data;

            if (!trolley) {
                config["CONTROL_CENTER"].promptWarningMessage("Trolley not found", "");
                return;
            }

            config["CONTROL_CENTER"].populate({
                "id": trolley.id,
                "code": trolley.code,
                "name": trolley.name,
                "active": trolley.active ? "1" : "0"
            });
        } catch (error) {
            __handleApiError(error);
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    function __validate(code, name) {
        if (!code || code.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Trolley Code", "");
            return false;
        }
        if (code.length > 100) {
            config["CONTROL_CENTER"].promptWarningMessage("Trolley Code cannot exceed 100 characters", "");
            return false;
        }
        if (!name || name.trim() === "") {
            config["CONTROL_CENTER"].promptWarningMessage("Please Enter Trolley Name", "");
            return false;
        }
        if (name.length > 255) {
            config["CONTROL_CENTER"].promptWarningMessage("Trolley Name cannot exceed 255 characters", "");
            return false;
        }
        return true;
    }

    async function handleSave(event, dataArr, callback) {
        let resultArr = {};
        let isValid = true;
        try {
            const id = dataArr.data.id;
            const code = (dataArr.data.code || "").trim();
            const name = (dataArr.data.name || "").trim();
            const active = dataArr.data.active === "1";

            if (__validate(code, name)) {
                const apiRequest = {
                    code: code,
                    name: name,
                    active: active
                };
                if (dataArr.action === "MODIFY" && id && id !== "") {
                    apiRequest.id = id;
                }

                document.getElementById("spinner").style.display = "";
                const response = await API.post(`trolly-master/createAndUpdate`, apiRequest);

                const body = response.data;
                if (body && body.status === "success") {
                    config["CONTROL_CENTER"].promptBaseMessage("Trolley saved successfully", "");
                    await getAllTrolleys();
                    if (body.data && body.data.id) {
                        config['inputId'].data.value = body.data.id;
                        config['inputId'].data.oldValue = body.data.id;
                    }
                    resultArr = { success: true };
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error saving Trolley", "");
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

    async function handleTrolleyDelete(event, rowId) {
        const row = config["gridTrolley"].data[rowId];
        if (!row) return;

        const confirmed = window.confirm(`Are you sure you want to delete trolley "${row.code}"?`);
        if (!confirmed) {
            row._rowstate = undefined;
            reRender();
            return;
        }

        try {
            document.getElementById("spinner").style.display = "";
            const response = await API.post(`trolly-master/delete`, { id: row.id });

            if (response.data && response.data.status === "success") {
                config["CONTROL_CENTER"].promptBaseMessage(response.data.message || "Trolley deleted successfully", "");

                const currentId = config['inputId'].data.value;
                if (currentId && String(currentId) === String(row.id)) {
                    config["CONTROL_CENTER"].event.__onNew();
                }

                await getAllTrolleys();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage((response.data && response.data.message) || "Error deleting Trolley", "");
                row._rowstate = undefined;
                reRender();
            }
        } catch (error) {
            __handleApiError(error);
            row._rowstate = undefined;
            reRender();
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    return generateTrolleyDisplay(config, { onPrint: handleDownloadStickers })
}

export default Trolley;
