import React, { useEffect, useState } from 'react';
import { generateMrnIssuanceDisplay } from './MrnIssuanceDS';
import config from './MrnIssuanceCS';
import API from '../../../api/API';

const MrnIssuance = () => {
    let [rendered, setRendered] = useState(true);
    let [mrnDetails, setMrnDetails] = useState([]);
    let [issuanceStatus, setIssuanceStatus] = useState(""); // "open" or "completed"
    let [selectedDetailId, setSelectedDetailId] = useState(null);
    let [showQrScanner, setShowQrScanner] = useState(false);
    

    function reRender() {
        setRendered(prev => !prev);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;
    
    // Button Events
    config["buttonCompleteIssuance"].event.onClick = handleCompleteIssuancePopup;
    config["buttonCompleteYes"].event.onClick = handleCompleteIssuance;
    config["buttonCompleteNo"].event.onClick = handleCompleteIssuanceCancel;
    config["buttonDeleteYes"].event.onClick = handleDeleteIssuanceYes;
    config["buttonDeleteNo"].event.onClick = handleDeleteIssuanceCancel;
    
    // Input Events - Load MRN on Enter key
    config["inputMrnScan"].event.onEnterKey = handleMrnScanKeyPress;

    // Advance Search
    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

    // Open live QR scanner overlay
    window.openQrScanner = () => setShowQrScanner(true);

    // Expose functions for card buttons
    window.handleLocationScan = handleLocationScan;
    window.handleIssueQtyChange = handleIssueQtyChange;
    window.handleIssueTransaction = handleIssueTransaction;
    window.handleDeleteIssuance = handleDeleteIssuance;

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Executes when Page Load 
    useEffect(() => {
        __checkIsAuthorized();
        __setFormReadWrite(true);

        // Only auto-collapse sidebar on small screens (< 992px)
        if (window.innerWidth < 992) {
            // Click the sidebar toggle button so Sidebar's internal state stays in sync
            const toggleBtn = document.getElementById('sidebarToggle');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
        
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "mrn_issuance" }
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            const isAuthorized = response.data;
            __setFormReadWrite(isAuthorized);
        }).catch(error => {
            __setFormReadWrite("r");
        });
    }

    function __setFormReadWrite(status) {
        if (status === "r") {
            config["inputMrnScan"].schema.disabled = true;
            config["buttonCompleteIssuance"].schema.visible = false;
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

        async function handleAdvanceSearchPopup() {
                let data = [];
                const getData = await __getAll();
        
                if (getData && getData !== "Error" && getData[0].Mrn.length > 0) {
                    const listData = getData[0].Mrn;
                    listData.forEach((value, index) => {
                        
                        data.push({
                            "mrn_id_search": value.id,
                            "batch_no_search": value.batch.batch_no,
                            "model_search": value.batch.model.name,
                            "warehouse_search": value.warehouse.name,
                            "status_search": value.status,
                            "issued_to_search": value.issued_to
                        })
                    });
                }
        
                console.log("*******All Data********");
                console.log(data);
        
                let msg = "";
                if (data.length > 20) {
                    msg = "Only 20 records are loaded. Please narrow your search";
                    data = data.slice(0, 20);
                }
        
                config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
            }
        
            async function __getAll() {
                try {
                    const key = "Mrn";
                    const distinct = false;
                    const select = ["*"];
                    const where = [{"active":true}];
                    const orderby = "created_at:desc";
                    const limit = 25;
                    const relations = [
                        "batch",
                        "batch.model",
                        "warehouse",
                    ];
    
        
                    const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);
        
                    return data;
        
                } catch (error) {
                    console.log("***********GetAll Error**********");
                    console.log(error.response);
                    return "Error";
                }
            }
        
            async function __getDetails(key, distinct, select, where, relations, orderby, limit) {
                try {
                    const apiRequest = {
                        [key]: {
                            "distinct": distinct,
                            "select": select,
                            "where": where,
                            "relations": relations,
                            "orderby": orderby,
                            "limit": limit
                        }
                    };
        
                    const getDetails = await API.post(`searchByParameters`, apiRequest);
                    const details = getDetails.data;
        
                    return details;
        
                } catch (error) {
                    console.log("***********GetDetails Error**********");
                    console.log(error.response);
                    return "Error";
                }
            }
    
            async function handleAdvanceSearch(event, searchCriteria, callback) {
                console.log("*******Search Criteria********");
                console.log(searchCriteria);
        
                let data = [];
                let searchDetails = await __getAdvanceSearchDetails(searchCriteria);
        
                if (searchDetails.length > 0) {
                    searchDetails.forEach((value, index) => {
                        data.push({
                            "mrn_id_search": value.id,
                            "batch_no_search": value.batch_no,
                            "model_search": value.model_name,
                            "warehouse_search": value.warehouse_name,
                            "status_search": value.status,
                            "issued_to_search": value.issued_to
                        }) })
                    ;
                }
        
                console.log("*******Search Results********");
                console.log(data);
        
                let msg = "";
                if (data.length > 20) {
                    msg = "Only 20 records are loaded. Please narrow your search";
                    data = data.slice(0, 20);
                }
        
                callback(data, msg);
            }
        
                // Get Advance Search Details
            async function __getAdvanceSearchDetails(searchCriteria) {
                    try {
                        const apiRequest = {
                            
                                "id": searchCriteria.mrn_id_search === "" ? "%" : searchCriteria.mrn_id_search,
                                "batch_no": searchCriteria.batch_no_search === "" ? "%" : searchCriteria.batch_no_search,
                                "model_name": searchCriteria.model_search === "" ? "%" : searchCriteria.model_search,
                                "warehouse_name": searchCriteria.warehouse_search === "" ? "%" : searchCriteria.warehouse_search,
                                "status": searchCriteria.status_search === "" ? "%" : searchCriteria.status_search,
                                "issued_to": searchCriteria.issued_to_search === "" ? "%" : searchCriteria.issued_to_search
                            
                        };
                        const getSearchDetails = await API.post(`mrns/getSearchByMrn`, apiRequest);
                        const details = getSearchDetails.data.data;
            
                        return details;
            
                    } catch (error) {
                        console.log("***********GetDetails Error**********");
                        console.log(error.response);
                        return "Error";
                    }
                }
    
        async function handleAdvanceSearchDone(event, selectedRow){
            const id = selectedRow.mrn_id_search;
            config["inputMrnScan"].setValue(id);
            handleLoadMrn();
           // await formPopulate(id);
    
        }

    function handleMrnScanKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLoadMrn();
        }
    }

    function handleQrScanSuccess(decodedText) {
        setShowQrScanner(false);
        config["inputMrnScan"].data.value = decodedText;
        reRender();
        // Auto-load MRN after successful scan
        setTimeout(() => {
            loadMrnDetails(decodedText);
        }, 100);
    }

    function handleQrScanClose() {
        setShowQrScanner(false);
    }

    async function handleLoadMrn() {
        try {
            const mrnId = config["inputMrnScan"].data.value;
            
            if (!mrnId || mrnId === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Please scan or enter MRN ID", "");
                return;
            }

            await loadMrnDetails(mrnId);
            
        } catch (error) {
            handleError(error, "Error loading MRN");
        }
    }

    async function loadMrnDetails(mrnId) {
        try {
            document.getElementById("spinner").style.display = "";
            
            // Call mrns/{id} API
            let response = await API.get(`mrns/${mrnId}`);
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                const mrnData = response.data.data;
                
                // Check if MRN is open - not allowed
                if (mrnData.status === "open") {
                    config["CONTROL_CENTER"].promptWarningMessage("MRN is not finalized", "Cannot issue from an open MRN");
                    // Clear the scan field
                    config["inputMrnScan"].data.value = "";
                    reRender();
                    return;
                }
                
                // Populate MRN header details
                config["inputMrnID"].data.value = mrnData.id;
                config["inputStatus"].data.value = mrnData.status;
                config["inputBatchNo"].data.value = mrnData.batch?.batch_no || "";
                config["inputWarehouse"].data.value = mrnData.warehouse?.name || "";
                config["inputIssuedTo"].data.value = mrnData.issued_to || "";
                
                // Transform MRN details into card data
                let detailsData = [];
                if (mrnData.details && mrnData.details.length > 0) {
                    detailsData = mrnData.details.map(detail => {
                        const alreadyIssued = detail.issued_qty !== null && detail.issued_qty !== undefined;
                        return {
                            mrn_detail_id: detail.id,
                            material_id: detail.stock_item_id,
                            material_name: detail.stock_item?.code + " (" + detail.stock_item?.name + ")" || 'Unknown',
                            mrn_qty: detail.qty,
                            issued_qty: detail.issued_qty || null,
                            location_id: alreadyIssued ? '' : '',
                            available_balance: alreadyIssued ? undefined : undefined,
                            issue_qty: alreadyIssued ? '' : '',
                            is_issued: alreadyIssued
                        };
                    });
                }
                
                setMrnDetails(detailsData);
                setIssuanceStatus(mrnData.status);
                
                // Show complete button only if MRN is not completed
                if (mrnData.status === "complete") {
                    config["buttonCompleteIssuance"].schema.visible = false;
                    setIssuanceStatus("completed");
                } else {
                    config["buttonCompleteIssuance"].schema.visible = true;
                }
                
                config["CONTROL_CENTER"].state.modified = false;
                config["CONTROL_CENTER"].state.new = false;
                
                reRender();
               // config["CONTROL_CENTER"].promptBaseMessage("MRN loaded successfully", "");
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to load MRN", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error loading MRN details");
        }
    }

    async function handleLocationScan(detailId, locationId) {
        try {
            // Update the location_id in state
            setMrnDetails(prevDetails => {
                const updatedDetails = prevDetails.map(detail => {
                    if (detail.mrn_detail_id === detailId) {
                        return { ...detail, location_id: locationId };
                    }
                    return detail;
                });
                return updatedDetails;
            });
            
            // If location is set and valid, fetch available balance
            if (locationId && locationId.trim() !== "") {
                await fetchAvailableBalance(detailId, locationId);
            }
        } catch (error) {
            console.error("Error handling location scan:", error);
        }
    }

    async function fetchAvailableBalance(detailId, locationId) {
        try {
            // Find the detail to get material_id
            const detail = mrnDetails.find(d => d.mrn_detail_id === detailId);
            if (!detail) return;
            
            document.getElementById("spinner").style.display = "";
            
            // API call to get available balance
            // Adjust the API endpoint based on your backend
            const response = await API.get(`inventory/balance`, {
                params: {
                    location_id: locationId,
                    stock_item_id: detail.material_id
                }
            });
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                const balance = response.data.data.qty || 0;
                
                // Update available balance and auto-set issue qty
                setMrnDetails(prevDetails => {
                    const updatedDetails = prevDetails.map(d => {
                        if (d.mrn_detail_id === detailId) {
                            // Set issue_qty based on comparison: if mrn_qty >= available_balance, use available_balance, otherwise use mrn_qty
                            const issueQty = d.mrn_qty >= balance ? balance : d.mrn_qty;
                            return { ...d, available_balance: balance, issue_qty: issueQty };
                        }
                        return d;
                    });
                    return updatedDetails;
                });
                
                reRender();
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            config["CONTROL_CENTER"].promptWarningMessage("Error fetching available balance", "");
            console.error("Error fetching balance:", error);
        }
    }

    function handleIssueQtyChange(detailId, qty) {
        // Update issue_qty in state
        setMrnDetails(prevDetails => {
            const updatedDetails = prevDetails.map(detail => {
                if (detail.mrn_detail_id === detailId) {
                    return { ...detail, issue_qty: qty };
                }
                return detail;
            });
            return updatedDetails;
        });
        reRender();
    }

    async function handleIssueTransaction(detailId) {
        try {
            const detail = mrnDetails.find(d => d.mrn_detail_id === detailId);
            if (!detail) return;
            
            // Validations
            if (!detail.location_id || detail.location_id.trim() === "") {
                config["CONTROL_CENTER"].promptWarningMessage("Location ID is required", "");
                return;
            }
            
            if (!detail.issue_qty || parseInt(detail.issue_qty) <= 0) {
                config["CONTROL_CENTER"].promptWarningMessage("Issue quantity must be greater than 0", "");
                return;
            }
            
            if (parseInt(detail.issue_qty) > parseInt(detail.available_balance)) {
                config["CONTROL_CENTER"].promptWarningMessage("Issue quantity cannot exceed available balance", "");
                return;
            }
            
            document.getElementById("spinner").style.display = "";
            
            // API call to update/issue transaction
            const apiRequest = {
                mrn_detail_id: detail.mrn_detail_id,
                stock_item_id: detail.material_id,
                location_id: detail.location_id,
                qty: parseInt(detail.issue_qty)
            };
            
            const response = await API.post(`inventory/issue`, apiRequest);
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200 || response.status === 201) {
                // Mark as issued and clear input fields + hide available balance
                setMrnDetails(prevDetails => {
                    const updatedDetails = prevDetails.map(d => {
                        if (d.mrn_detail_id === detailId) {
                            return { 
                                ...d, 
                                is_issued: true,
                                location_id: '',
                                available_balance: undefined,
                                issue_qty: ''
                            };
                        }
                        return d;
                    });
                    return updatedDetails;
                });
                
                config["CONTROL_CENTER"].promptBaseMessage("Transaction issued successfully", "");
                config["CONTROL_CENTER"].state.modified = true;
                
                reRender();
                await loadMrnDetails(config["inputMrnID"].data.value); // Refresh details to get updated issued_qty
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to issue transaction", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error issuing transaction");
        }
    }

    function handleDeleteIssuance(detailId) {
        if (issuanceStatus === "completed") {
            config["CONTROL_CENTER"].promptWarningMessage("Cannot delete transactions after completion", "");
            return;
        }
        
        setSelectedDetailId(detailId);
        config["deleteTransactionPopUp"].showPopUp();
    }

    async function handleDeleteIssuanceYes() {
        try {
            if (!selectedDetailId) return;
            
            config["deleteTransactionPopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";
            
            // API call to delete issued transaction
            const response = await API.delete(`mrn-issuance/delete/${selectedDetailId}`);
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                await loadMrnDetails(config["inputMrnID"].data.value);
                // // Reset the transaction to not issued
                // setMrnDetails(prevDetails => {
                //     const updatedDetails = prevDetails.map(d => {
                //         if (d.mrn_detail_id === selectedDetailId) {
                //             return { 
                //                 ...d, 
                //                 is_issued: false,
                //                 location_id: '',
                //                 available_balance: undefined,
                //                 issue_qty: ''
                //             };
                //         }
                //         return d;
                //     });
                //     return updatedDetails;
                // });
                
                // config["CONTROL_CENTER"].promptBaseMessage("Transaction deleted successfully", "");
                // setSelectedDetailId(null);
                // reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to delete transaction", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error deleting transaction");
            setSelectedDetailId(null);
        }
    }

    function handleDeleteIssuanceCancel() {
        config["deleteTransactionPopUp"].closePopUp();
        setSelectedDetailId(null);
    }

    function handleCompleteIssuancePopup() {
        // Check if at least one transaction is issued
        const hasIssuedTransactions = mrnDetails.some(detail => detail.is_issued);
        
        if (!hasIssuedTransactions) {
            config["CONTROL_CENTER"].promptWarningMessage("Please issue at least one transaction before completing", "");
            return;
        }
        
        config["completePopUp"].showPopUp();
    }

    async function handleCompleteIssuance() {
        try {
            config["completePopUp"].closePopUp();
            document.getElementById("spinner").style.display = "";
            
            const mrnId = config["inputMrnID"].data.value;
            
            // API call to complete issuance
            const response = await API.post(`mrn-issuance/complete`, { mrn_id: mrnId });
            
            document.getElementById("spinner").style.display = "none";
            
            if (response.status === 200) {
                setIssuanceStatus("completed");
                config["buttonCompleteIssuance"].schema.visible = false;
                
                config["CONTROL_CENTER"].promptBaseMessage("MRN Issuance completed successfully", "");
                config["CONTROL_CENTER"].state.modified = false;
                
                reRender();
            } else {
                config["CONTROL_CENTER"].promptWarningMessage("Failed to complete issuance", "");
            }
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            handleError(error, "Error completing issuance");
        }
    }

    function handleCompleteIssuanceCancel() {
        config["completePopUp"].closePopUp();
    }

    function handleError(error, message) {
        console.error(message, error);
        
        if (error.response) {
            const errorMsg = error.response.data?.message || error.response.data?.error || "An error occurred";
            config["CONTROL_CENTER"].promptWarningMessage(message, errorMsg);
        } else if (error.request) {
            config["CONTROL_CENTER"].promptWarningMessage(message, "No response from server");
        } else {
            config["CONTROL_CENTER"].promptWarningMessage(message, error.message);
        }
    }

    /*********************************************************/
    /********              Render Display           **********/
    /*********************************************************/

    return generateMrnIssuanceDisplay(config, mrnDetails, issuanceStatus, showQrScanner, handleQrScanSuccess, handleQrScanClose);
};

export default MrnIssuance;
