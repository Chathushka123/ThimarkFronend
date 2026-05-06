import React, { useEffect, useState } from 'react';
import { generateOpenGrnDisplay } from './GrnConDS';
import config from './GrnConCS';
import API from '../../../api/API';

const OpenGrn = () => {
    let [rendered, setRendered] = useState(true);


    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["gridOpenGrns"].event.onRowCustomButton = handleRowSaveClick;
    config["buttonSave"].event.onClick = handleSaveAll;
    // config["gridOpenGrns"].event.onRowDelete = handleStkMatDelete;



    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);
        getOpenGrns();
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "OpenGrn" }
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

    async function commitSelectedGrnDetails(grnDetailIds) {
        const validIds = [...new Set((grnDetailIds || []).filter(id => !!id))];

        if (validIds.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("No valid GRN detail selected", "");
            return;
        }

        document.getElementById("spinner").style.display = "";
        try {
            await API.post('/grns/commitTransaction', {
                grn_detail_ids: validIds
            });

            config["CONTROL_CENTER"].promptBaseMessage("GRN transaction committed successfully", "");
            await getOpenGrns();
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to commit GRN transaction");
        } finally {
            document.getElementById("spinner").style.display = "none";
        }
    }

    async function handleRowSaveClick(e, r) {
        const selectedRow = config["gridOpenGrns"].data[r];
        await commitSelectedGrnDetails([selectedRow?.grn_detail_id]);
    }

    async function handleSaveAll() {
        const selectedRows = (config["gridOpenGrns"].data || []).filter(row => row?._select);
        const selectedDetailIds = selectedRows.map(row => row?.grn_detail_id);
        console.log(selectedDetailIds)
        if (selectedDetailIds.length === 0) {
            config["CONTROL_CENTER"].promptWarningMessage("Please select at least one record", "");
            return;
        }

        await commitSelectedGrnDetails(selectedDetailIds);
    }

    async function handleStkMatDelete(event, rowId) {

    }


    const getOpenGrns = async () => {
        document.getElementById("spinner").style.display = "";
        try {
            const response = await API.get('/grns/open/full-details');
            const dataArray = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
            const rows = dataArray.flatMap(grn => {
                if (grn.details && grn.details.length > 0) {
                    return grn.details.map(detail => ({
                        _select: false,
                        id: grn.id,
                        grn_detail_id: detail.id,
                        rmpono: grn.rmpono,
                        warehouse: grn.warehouse ? grn.warehouse.name : '',
                        location: detail.warehouse_location ? `${detail.warehouse_location.rack} - ${detail.warehouse_location.bin}` : "",
                        status: grn.status,
                        remark: grn.remark,
                        supplier: detail.whl_item?.stock_item?.supplier || '',
                        material: detail.whl_item ? detail.whl_item?.stock_item?.name : `${detail.stock_material?.code} - ${detail.stock_material?.name}` || '',
                        quantity: detail.qty,
                        created_at: grn.created_at?.split(' ')[0]
                    }));
                } else {
                    return [{
                        _select: false,
                        id: grn.id,
                        grn_detail_id: null,
                        rmpono: grn.rmpono,
                        warehouse: grn.warehouse ? grn.warehouse.name : '',
                        status: grn.status,
                        remark: grn.remark,
                        supplier: '',
                        material: '',
                        quantity: ''
                    }];
                }
            });
            config["gridOpenGrns"].data = rows;
            reRender();
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


    return generateOpenGrnDisplay(config)
}

export default OpenGrn;
