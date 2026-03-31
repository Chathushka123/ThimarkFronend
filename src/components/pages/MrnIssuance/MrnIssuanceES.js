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
            
            if (!mrnId || mrnId.trim() === "") {
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
                
                // Transform MRN details into card data
                let detailsData = [];
                if (mrnData.details && mrnData.details.length > 0) {
                    detailsData = mrnData.details.map(detail => {
                        const alreadyIssued = detail.issued_qty !== null && detail.issued_qty !== undefined;
                        return {
                            mrn_detail_id: detail.id,
                            material_id: detail.stock_item_id,
                            material_name: detail.stock_item?.name || 'Unknown',
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
