import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { generateBuyerDisplay } from './InvoiceDS';
import config from './InvoiceCS';
import API from '../../../api/API';

const Buyer = () => {
    let [rendered, setRendered] = useState(true);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    let invoice_id = query.get('invoice_id');

    function reRender() {
        setRendered(!rendered);
    }

    /*********************************************************/
    /********      Framework Action Definitions     **********/
    /*********************************************************/

    config["CONTROL_CENTER"].renderFunction = reRender;

    config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
    config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
    config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;
    config["gridInvoiceDetails"].event.onChangeWithColName = handleChangeInvoiceDetails;
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onNew = handleNew;
    config["buttonPrint"].event.onClick = handleInvoicePrint;
    config["buttonPrintImage"].event.onClick = getImages;
    config['inputBillNo'].event.onEnterKey = getFormData;



    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/

    function handleNew(event) {
            config["CONTROL_CENTER"].state.modified = false;
            config["CONTROL_CENTER"].state.new = true;
            

         config['gridPaymentDetails'].setData([]);
         config['gridInvoiceDetails'].setData([]);

        config['inputDate'].setValue(new Date().toISOString().split('T')[0]);
        config['inputDueDate'].setDate(new Date().toISOString().split('T')[0]);

        config['inputId'].setValue("");
        config['inputName'].setValue("");
        config['inputMobile'].setValue("");
        
        config['inputAddress'].setValue("");
        config['inputTotalAmount'].setValue("");
        
        config['inputPaid'].setValue("");
        config['inputBalance'].setValue("");
        config['inputAmount'].setValue("");
        config['inputInvoiceStatus'].setValue([]);

        // config['inputTotalAmount'].data.value = "";
        // config['inputPaid'].data.value = "";
        // config['inputBalance'].data.value = "";
        // config['inputAmount'].data.value = null;

         //reRender();
    }





    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    // Set initial values of Component Schema etc.

    // Executes when Page Load 
    useEffect(async() => {
       // __checkIsAuthorized();
       __setFormReadWrite(true);
    //    config['inputTotalAmount'].setValue(8000)
    //    config['inputPaid'].setValue(2000)
    //    config['inputBalance'].setValue(6000)
        config['inputDate'].setValue(new Date().toISOString().split('T')[0]);
        config['inputDueDate'].setDate(new Date().toISOString().split('T')[0]);
        config['inputPaymentDate'].setDate(new Date().toISOString().split('T')[0]);
        await __getStatus();
        if(invoice_id != null){
            formPopulate(invoice_id);
        }
        

    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "marker" }
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

    async function getFormData(){
        let invoiceId = config['inputBillNo'].data.value;
        await formPopulate(invoiceId);
    }
    async function handleAdvanceSearchPopup() {
            let data = [];
            const getData = await __getAll();
    
            if (getData && getData !== "Error" && getData[0].Invoice.length > 0) {
                const listData = getData[0].Invoice;
                listData.forEach((value, index) => {
                    
                    data.push({
                        "invoice_id_search": value.id,
                        "invoice_name_search": value.name,
                        "invoice_contact_search": value.mobile
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
                const key = "Invoice";
                const distinct = false;
                const select = ["*"];
                const where = [];
                const orderby = "created_at:desc";
                const limit = 25;
                const relations = [
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
                        "invoice_id_search": value.id,
                        "invoice_name_search": value.name,
                        "invoice_contact_search": value.mobile
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
                        
                            "id": searchCriteria.invoice_id_search === "" ? "%" : searchCriteria.invoice_id_search,
                            "name": searchCriteria.invoice_name_search === "" ? "%" : searchCriteria.invoice_name_search,
                            "contact": searchCriteria.invoice_contact_search === "" ? "%" : searchCriteria.invoice_contact_search
                        
                    };
                    const getSearchDetails = await API.post(`Invoice/getSearchByInvoice`, apiRequest);
                    const details = getSearchDetails.data;
        
                    return details;
        
                } catch (error) {
                    console.log("***********GetDetails Error**********");
                    console.log(error.response);
                    return "Error";
                }
            }
    
            async function handleAdvanceSearchDone(event, selectedRow){
                const id = selectedRow.invoice_id_search;
                const name = selectedRow.invoice_name_search;
                const mobile = selectedRow.invoice_contact_search;
               
                    
                
                await formPopulate(id);
  
            }

    async function formPopulate(id){
        try{
            
            document.getElementById("spinner").style.display = "";
            config['inputAmount'].setValue("");
            // Get Style Details from Style Id
            const details = await __getInvoiceData(id);

            if((details[0].Invoice).length > 0){
                const Invoice = details[0].Invoice[0];
                const InvoiceDetails = Invoice.invoice_details;
                const Transactions = Invoice.transactions;
                const invoiceStatus =Invoice.invoice_status;

                if(invoiceStatus != null){
                    config['inputInvoiceStatus'].setValue([{
                        "id":invoiceStatus.id,
                        "name":invoiceStatus.status
                    }])
                }else{
                    config['inputInvoiceStatus'].setValue([]);
                }

                
                config['inputAddress'].setValue(Invoice.address);
                config['inputDate'].setValue(Invoice.invoice_date);
                config['inputDueDate'].setDate(Invoice.due_date);
                config['inputId'].setValue(Invoice.id);
                config['inputName'].setValue(Invoice.name);
                config['inputMobile'].setValue(Invoice.mobile);

                

                let rows = [];
                let totalAmount = 0;
                let balance = 0;
                config['gridInvoiceDetails'].setData(rows);
                if(InvoiceDetails.length > 0){
                    InvoiceDetails.forEach((value, index) => {
                        if(value.active == 1){
                            rows.push({
                                "invoice_detail_id": value.id,
                                "qty": value.quantity,
                                "description": value.description,
                                "amount": value.total_price
                            });
                            totalAmount += parseFloat(value.total_price);
                        }
                    });
                    config['gridInvoiceDetails'].setData(rows);
                    
                }
            
                config["CONTROL_CENTER"].state.modified = true;
                config["CONTROL_CENTER"].state.new = false;
                reRender();
                
                config['inputTotalAmount'].setValue(totalAmount.toFixed(2));

                let paymentRows = [];
                let paidAmount = 0;
                config['gridPaymentDetails'].setData(paymentRows);
                if(Transactions.length > 0){
                    Transactions.forEach((value, index) => {
                        if(value.active == 1){
                            paymentRows.push({
                                "invoice_payment_id": value.id,
                                // "description": new Date(value.created_at).toISOString().split("T")[0],
                                "description": value.payment_date,
                                "payment_method": value.payment_method,
                                "amount": value.amount
                            });
                    
                            paidAmount += parseFloat(value.amount);
                        }
                    });
                    config['gridPaymentDetails'].setData(paymentRows);
                    
                }
                config['inputPaid'].setValue(paidAmount.toFixed(2));
                balance = parseFloat(parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2);
                config['inputBalance'].setValue(balance);
            }else{
                config["CONTROL_CENTER"].promptWarningMessage("Invoice Not Found", "");
            }

            document.getElementById("spinner").style.display = "none";

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            console.log("***********GetStyleIdByCode Error**********");
            console.log(error.response);
        }
        }

        async function __getInvoiceData(id) {
        try {
            const key = "Invoice";
            const distinct = false;
            const select = ["*"];
            const where = [
                {
                    "field-name": "id",
                    "operator": "=",
                    "value": id
                }
            ];
            const relations = [
                "invoice_details",
                "transactions",
                "invoice_status"
            ];
            const orderby = "created_at:desc";
            const limit = 1000;

            const data = await __getDetails(key, distinct, select, where, relations, orderby, limit);

            return data;

        } catch (error) {
            console.log("***********GetStyleData Error**********");
            console.log(error.response);
            return "Error";
        }
    }

    async function handleChangeInvoiceDetails(event, rowId, colName) {
        if(colName == 'amount'){
            let data = config['gridInvoiceDetails'].data;
            let totalAmount = 0;
            data.forEach((value, index) => {   
                if(value.amount > 0){
                    totalAmount += parseFloat(value.amount);
                }            
                
            });

            config['inputTotalAmount'].setValue(totalAmount.toFixed(2));

            let paidAmount = 0;
            let paymentData = config['gridPaymentDetails'].data;

            paymentData.forEach((value, index) => {
                if(value.amount > 0){
                    paidAmount += parseFloat(value.amount);
                }                
            });

            config['inputPaid'].setValue(paidAmount.toFixed(2));
            let balance = parseFloat(parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2);
            config['inputBalance'].setValue(balance);

        }
    }


    async function handleSave(event, beforeSaveArr, callback) {
        
        try{
            document.getElementById("spinner").style.display = "";
            let invoiceId = config['inputId'].data.value;
            let invoiceName = config['inputName'].data.value;
            let address = config['inputAddress'].data.value;
            let invoiceDate = config['inputDate'].data.value;
            let dueDate = config['inputDueDate'].data.value;
            let mobile = config['inputMobile'].data.value;
            let paymentAmount = config['inputAmount'].data.value;
            let paymentType = config['radioPaymentMethod'].data.value;
            let status = config['inputInvoiceStatus'].getValue();
            let paymentDate = config['inputPaymentDate'].data.value;

            paymentAmount = paymentAmount === "" ? 0 : paymentAmount;
            let valid = true;


            let invoiceDetails = config['gridInvoiceDetails'].data;
            let detailRow =[]
            invoiceDetails.forEach((value, index) => {
                if(value._rowstate == "MODIFIED" || value._rowstate == "NEW" || value._rowstate == "DELETED"){
                    if(!(value.qty > 0) ){
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage("Qty no valid", "");
                    }else if(value.description == "" ){
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage("Please Enter valid Description", "");
                    }else if(!(value.amount > 0)) {
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage("Amount is Not Valid", "");

                    }
                    detailRow.push({
                        "id": value.invoice_detail_id,
                        "description": value.description,
                        "amount": value.amount,
                        "qty": value.qty,
                        "_rowstate": value._rowstate
                    });
                }
            });

            if(mobile == ""){
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter Contact Number", "");
            }else if(invoiceName == ""){
                config["CONTROL_CENTER"].promptWarningMessage("Please Enter  Name", "");
            }else if(valid){
                let apiRequest = {
                    "invoiceId": invoiceId,
                    "invoiceName":invoiceName,
                    "address": address, 
                    "invoiceDate": invoiceDate,
                    "dueDate": dueDate,
                    "mobile": mobile,
                    "invoiceDetails": detailRow,
                    "paymentAmount": paymentAmount,
                    "paymentType": paymentType,
                    "PaymentDate":paymentDate,
                    "status_id":status.length > 0 ? status[0] : null
                }

                const invoice = await API.post(`Invoice/createAndUpdateInvoice`, apiRequest);
                if(invoice.status == "200"){
                    config['inputId'].setValue(invoice.data.data);
                    await handleSaveImage(invoice.data.data);
                    await formPopulate(invoice.data.data);
                    config["CONTROL_CENTER"].promptBaseMessage("Updated Successfully", "");
                }else{
                    config["CONTROL_CENTER"].promptWarningMessage("Error in Saving Invoice", "");
                }
            }

            document.getElementById("spinner").style.display = "none";



        } catch (error) {
            document.getElementById("spinner").style.display = "none";
           // console.log(error);
            try {
                if (error.response.data.message) {
                    try {
                        let errors = [];
    
                        Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
                            data.forEach(error => errors.push(error));
                        });
    
                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    } catch (error) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
                    }
                }
            } catch (error) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
            }
    
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        }
    }

    async function handleInvoicePrint(){
        try {
            const invoiceId = config["inputId"].data.value;
    
            if (invoiceId !== "" ) {
                const apiRequest = {
                    "id" : invoiceId
                }
                document.getElementById("spinner").style.display = "";
                const printBundleTagReport = await API.post(`Invoice/getInvoicePrint`, apiRequest,
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/pdf'
                        }
                    });
                document.getElementById("spinner").style.display = "none";
    
                console.log("********printTrimsReport*********");
                console.log(printBundleTagReport);
                
                if (printBundleTagReport && printBundleTagReport.data !== null) {
                    config["printPdfPopUp"].showPopUp();
                    let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
                    let blobUrl = window.URL.createObjectURL(blob);
                    document.getElementById("pdfviewer").setAttribute('src', blobUrl);
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
                }
    
            } else {
                if (invoiceId === "") {
                    config["CONTROL_CENTER"].promptWarningMessage("Please Select Invoice", "");
                } 
            }
    
        } catch (error) {
            document.getElementById("spinner").style.display = "none";
           // console.log(error);
            try {
                if (error.response.data.message) {
                    try {
                        let errors = [];
    
                        Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
                            data.forEach(error => errors.push(error));
                        });
    
                        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
                    } catch (error) {
                        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
                    }
                }
            } catch (error) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
            }
    
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        } 
    }

    async function __getStatus(){
        try{

            const statusData = await API.post(`Invoice/getStatus`)
            
            let status = [];
            statusData.data.forEach((value, index) => {
                status.push({
                    "id":value.id,
                    "name":value.status
                })
            });

            config['inputInvoiceStatus'].setOptions(status);
  
            


        }catch(err){
            console.log(err);
           // toast.error(`Something went wrong`+err)
        }
    }

    async function handleSaveImage(invoiceId){
        try{
            const input=document.getElementById('inputImage');
            if(input.files.length > 0){
                const formData = new FormData();
                formData.append('image', input.files[0]);
                formData.append('invoice_id', invoiceId);

                const response = await API.post('Invoice/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                document.getElementById('inputImage').value = '';
            }

        }catch(err){
            console.log(err);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Emage Upload Error");
           // toast.error(`Something went wrong`+err)
        }
    }


    // async function getImages(){
    //     try {
    //         const invoiceId = config["inputId"].data.value;
    
    //         if (invoiceId !== "" ) {
    //             const apiRequest = {
    //                 "id" : invoiceId
    //             }
    //             document.getElementById("spinner").style.display = "";
    //             const printBundleTagReport = await API.get(`images/${invoiceId}`, apiRequest,
    //                 {
    //                     responseType: 'arraybuffer',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Accept': 'application/pdf'
    //                     }
    //                 });
    //             document.getElementById("spinner").style.display = "none";
    
    //             console.log("********printTrimsReport*********");
    //             console.log(printBundleTagReport);
                
    //             if (printBundleTagReport && printBundleTagReport.data !== null) {
    //                 config["printPopUp"].showPopUp();
    //                 let blob = new Blob([printBundleTagReport.data], { type: 'application/pdf' });
    //                 let blobUrl = window.URL.createObjectURL(blob);
    //                 document.getElementById("pdfviewer").setAttribute('src', blobUrl);
    //             } else {
    //                 config["CONTROL_CENTER"].promptWarningMessage("No Data Available", "");
    //             }
    
    //         } else {
    //             if (invoiceId === "") {
    //                 config["CONTROL_CENTER"].promptWarningMessage("Please Select Invoice", "");
    //             } 
    //         }
    
    //     } catch (error) {
    //         document.getElementById("spinner").style.display = "none";
    //        // console.log(error);
    //         try {
    //             if (error.response.data.message) {
    //                 try {
    //                     let errors = [];
    
    //                     Object.entries(JSON.parse(error.response.data.message)).forEach(([index, data]) => {
    //                         data.forEach(error => errors.push(error));
    //                     });
    
    //                     config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
    //                 } catch (error) {
    //                     config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    //                 }
    //             }
    //         } catch (error) {
    //             config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
    //         }
    
    //         config["CONTROL_CENTER"].promptErrorMessage("Error", "Bundles Are Not Numbered");
    //     }
    // }

    async function getImages() {
    try {
        const invoiceId = config["inputId"].data.value;

        if (invoiceId !== "") {
            document.getElementById("spinner").style.display = "";

            const response = await API.get(`images/${invoiceId}`);
            
            document.getElementById("spinner").style.display = "none";

            if (response && response.data && response.data.images.length > 0) {
                config["printPopUp"].showPopUp();
                // Dynamically load images into a container
                const container = document.getElementById("imagePreviewContainer");
                container.innerHTML = ""; // Clear previous previews

                response.data.images.forEach(img => {
                    // Create a wrapper div for each image
                    const imageWrapper = document.createElement("div");
                    imageWrapper.style.display = "inline-block";
                    imageWrapper.style.margin = "10px";
                    imageWrapper.style.position = "relative";
                    imageWrapper.style.border = "1px solid #ccc";
                    imageWrapper.style.padding = "5px";

                    // Create image element
                    const imgElement = document.createElement("img");
                    imgElement.src = img.base64;
                    imgElement.alt = img.filename;
                    imgElement.style.maxWidth = "800px";
                    imgElement.style.display = "block";

                    // Create delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "🗑️ Delete";
                    deleteButton.className = "btn btn-danger btn-sm mt-2";
                    deleteButton.style.width = "100%";
                    deleteButton.onclick = () => handleDeleteImage(img.id, img.filename, invoiceId);

                    // Create filename label
                    const filenameLabel = document.createElement("div");
                    filenameLabel.textContent = img.filename;
                    filenameLabel.style.textAlign = "center";
                    filenameLabel.style.marginTop = "5px";
                    filenameLabel.style.fontSize = "12px";
                    filenameLabel.style.color = "#666";

                    // Append elements to wrapper
                    imageWrapper.appendChild(imgElement);
                    imageWrapper.appendChild(filenameLabel);
                    imageWrapper.appendChild(deleteButton);
                    container.appendChild(imageWrapper);
                });

            } else {
                config["CONTROL_CENTER"].promptWarningMessage("No Images Available", "");
            }

        } else {
            config["CONTROL_CENTER"].promptWarningMessage("Please Select Invoice", "");
        }

    } catch (error) {
        document.getElementById("spinner").style.display = "none";
        config["CONTROL_CENTER"].promptErrorMessage("Error", "Please Contact System Administrator");
        console.error(error);
    }
}

    async function handleDeleteImage(imageId, filename, invoiceId) {
        try {
            // Show confirmation dialog
            const confirmDelete = window.confirm(`Are you sure you want to delete the image "${filename}"?`);
            
            if (confirmDelete) {
                document.getElementById("spinner").style.display = "";

                const apiRequest = {
                    "imageId": imageId,
                    "invoiceId": invoiceId
                };

                const deleteResponse = await API.post(`images/deleteImage`, apiRequest);

                if (deleteResponse.status === 200) {
                    config["CONTROL_CENTER"].promptBaseMessage("Image deleted successfully", "");
                    // Refresh the images display
                    config["printPopUp"].closePopUp()
                    await getImages();
                } else {
                    config["CONTROL_CENTER"].promptWarningMessage("Error deleting image", "");
                }

                document.getElementById("spinner").style.display = "none";
            }

        } catch (error) {
            document.getElementById("spinner").style.display = "none";
            console.error("Delete image error:", error);
            
            try {
                if (error.response && error.response.data && error.response.data.message) {
                    config["CONTROL_CENTER"].promptWarningMessage(error.response.data.message, "");
                } else {
                    config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to delete image. Please contact system administrator.");
                }
            } catch (innerError) {
                config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to delete image. Please contact system administrator.");
            }
        }
    }






  





    

    return generateBuyerDisplay(config)
}

export default Buyer;