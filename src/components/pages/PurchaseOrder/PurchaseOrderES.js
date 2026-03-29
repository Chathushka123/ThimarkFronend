import React, { useEffect, useState } from 'react';
import { generatePurchaseOrderDisplay } from './PurchaseOrderDS';
import config from './PurchaseOrderCS';
import API from '../../../api/API';

const PurchaseOrder = () => {
    let [rendered, setRendered] = useState(true);
    let [currentStatus, setCurrentStatus] = useState('');
    let [lineItems, setLineItems] = useState([]);
    let [materialsData, setMaterialsData] = useState([]);

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
    config["CONTROL_CENTER"].event.onSave = handleSave;
    config["CONTROL_CENTER"].event.onNew = handleNew;

    /*********************************************************/
    /********       Framework Action Handlers       **********/
    /*********************************************************/

    function handleNew() {
        config["CONTROL_CENTER"].state.modified = false;
        config["CONTROL_CENTER"].state.new = true;

        config['inputId'].setValue('');
        config['inputPoNumber'].setValue(__generatePoNumber());
        config['inputSupplier'].setValue('');
        config['inputOrderDate'].setDate(new Date().toISOString().split('T')[0]);
        config['inputExpectedDeliveryDate'].setDate('');
        config['inputStatus'].setValue('Draft');
        config['inputNotes'].setValue('');

        config['inputSubtotal'].setValue('0.00');
        config['inputDiscount'].setValue('0.00');
        config['inputTax'].setValue('0.00');
        config['inputShippingCost'].setValue('0.00');
        config['inputTotalAmount'].setValue('0.00');

        setLineItems([]);

        setCurrentStatus('Draft');
    }

    /*********************************************************/
    /********       User Defined Declarations       **********/
    /*********************************************************/

    useEffect(() => {
        __setFormReadWrite(true);
        config["CONTROL_CENTER"].state.new = true;
        config["CONTROL_CENTER"].state.modified = false;
        __loadSuppliers();
        __loadMaterials();
        config['inputPoNumber'].setValue(__generatePoNumber());
        config['inputOrderDate'].setDate(new Date().toISOString().split('T')[0]);
        config['inputStatus'].setValue('Draft');
        config['inputSubtotal'].setValue('0.00');
        config['inputDiscount'].setValue('0.00');
        config['inputTax'].setValue('0.00');
        config['inputShippingCost'].setValue('0.00');
        config['inputTotalAmount'].setValue('0.00');
        setCurrentStatus('Draft');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function __checkIsAuthorized() {
        const apiRequest = { screen: 'PurchaseOrder' };
        API.post('permissions/isAuthorized', apiRequest)
            .then(response => { __setFormReadWrite(response.data); })
            .catch(() => { __setFormReadWrite('r'); });
    }

    function __setFormReadWrite(status) {
        if (status === 'r') {
            // disable write controls if needed
        }
    }

    window.onbeforeunload = function () {
        if (
            config["CONTROL_CENTER"].state.modified ||
            config["CONTROL_CENTER"].state.new ||
            config["CONTROL_CENTER"].state.deleted
        ) {
            return true;
        }
    };

    /*********************************************************/
    /********        User Defined Functions         **********/
    /*********************************************************/

    // ── Auto-generate PO Number ──────────────────────────────────────────────

    function __generatePoNumber() {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const rand = String(Math.floor(Math.random() * 9000) + 1000);
        return `PO-${yy}${mm}${dd}-${rand}`;
    }

    // ── Error handler ────────────────────────────────────────────────────────

    function handleError(error) {
        try {
            if (error.response?.data?.message) {
                try {
                    const errorData =
                        typeof error.response.data.message === 'string'
                            ? JSON.parse(error.response.data.message)
                            : error.response.data.message;
                    const errors = [];
                    Object.entries(errorData).forEach(([, data]) => {
                        if (Array.isArray(data)) data.forEach(e => errors.push(e));
                        else errors.push(data);
                    });
                    config["CONTROL_CENTER"].promptWarningMessage(errors[0], '');
                    return;
                } catch {
                    config["CONTROL_CENTER"].promptErrorMessage('Error', error.response.data.message || 'Please Contact System Administrator');
                    return;
                }
            }
            if (error.response?.data?.errors) {
                const errors = [];
                Object.entries(error.response.data.errors).forEach(([, msgs]) => msgs.forEach(m => errors.push(m)));
                config["CONTROL_CENTER"].promptWarningMessage(errors[0], '');
                return;
            }
        } catch (err) {
            console.log(err);
        }
        config["CONTROL_CENTER"].promptErrorMessage('Error', 'Please Contact System Administrator');
    }

    // ── Load Suppliers for DropDown ──────────────────────────────────────────

    async function __loadSuppliers() {
        try {
            const apiRequest = {
                Supplier: {
                    distinct: false,
                    select: ['*'],
                    where: [],
                    relations: [],
                    orderby: 'name:asc',
                    limit: 500,
                }
            };
            const response = await API.post('searchByParameters', apiRequest);
            const list = response.data[0]?.Supplier || [];

            const options = [
                { value: '', text: '- Select Supplier -' },
                ...list.map(s => ({ value: s.id, text: s.name })),
            ];
            config['inputSupplier'].setOptions(options);
        } catch (error) {
            console.error('Failed to load suppliers', error);
        }
    }

    // ── Load Materials for Grid DropDown ─────────────────────────────────────

    async function __loadMaterials() {
        try {
            const apiRequest = {
                StockMaterial: {
                    distinct: false,
                    select: ['*'],
                    where: [{ active: true }],
                    relations: ['uom'],
                    orderby: 'name:asc',
                    limit: 1000,
                }
            };
            const response = await API.post('searchByParameters', apiRequest);
            const list = response.data[0]?.StockMaterial || [];

            setMaterialsData(list);

            const colOptions = [
                { value: '', text: '- Select Material -' },
                ...list.map(m => ({ value: m.id, text: `${m.code} – ${m.name}` })),
            ];
            config['gridPoItems'].columns['material_id'].options = colOptions;
        } catch (error) {
            console.error('Failed to load materials', error);
        }
    }

    // ── Financial recalculation ──────────────────────────────────────────────

    function __recalculate(items) {
        const visibleItems = (items || []).filter(r => r._rowstate !== 'DELETED');
        const subtotal = visibleItems.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);
        const discount = parseFloat(config['inputDiscount'].data.value) || 0;
        const tax = parseFloat(config['inputTax'].data.value) || 0;
        const shipping = parseFloat(config['inputShippingCost'].data.value) || 0;
        const total = subtotal - discount + tax + shipping;

        config['inputSubtotal'].setValue(subtotal.toFixed(2));
        config['inputTotalAmount'].setValue(total.toFixed(2));
    }

    // ── Line item handlers (custom table) ────────────────────────────────────

    function handleAddRow() {
        const newRow = {
            _rowstate: 'NEW',
            po_item_id: null,
            material_id: '',
            uom: '',
            quantity: '',
            unit_price: '',
            item_expected_delivery: '',
            total: '0.00',
        };
        const updated = [...lineItems, newRow];
        setLineItems(updated);
        __recalculate(updated);
    }

    function handleDeleteRow(realIndex) {
        const updated = [...lineItems];
        if (updated[realIndex].po_item_id) {
            updated[realIndex] = { ...updated[realIndex], _rowstate: 'DELETED' };
        } else {
            updated.splice(realIndex, 1);
        }
        setLineItems(updated);
        __recalculate(updated);
    }

    function handleLineItemChange(realIndex, field, value) {
        const updated = [...lineItems];
        const row = { ...updated[realIndex], [field]: value };

        if (field === 'material_id') {
            const material = materialsData.find(m => String(m.id) === String(value));
            if (material) {
                row.uom = material.uom?.name || (typeof material.uom === 'string' ? material.uom : '') || '';
                row.unit_price = material.unit_price || '';
            } else {
                row.uom = '';
                row.unit_price = '';
            }
            if (!row.quantity) row.quantity = 1;
        }

        if (field === 'quantity' || field === 'unit_price' || field === 'material_id') {
            const qty = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.unit_price) || 0;
            row.total = (qty * price).toFixed(2);
        }

        row._rowstate = row._rowstate === 'NEW' ? 'NEW' : 'MODIFIED';
        updated[realIndex] = row;
        setLineItems(updated);
        __recalculate(updated);
    }

    // ── Advance Search ────────────────────────────────────────────────────────

    async function handleAdvanceSearchPopup() {
        let data = [];
        const res = await __getAll();
        const list = res[0]?.PurchaseOrder || [];

        list.forEach(po => {
            data.push({
                po_no_search: po.po_number,
                supplier_search: po.supplier?.name || '',
                status_search: po.status,
                po_id_search: po.id,
            });
        });

        let msg = '';
        if (data.length > 20) {
            msg = 'Only 20 records are loaded. Please narrow your search.';
            data = data.slice(0, 20);
        }

        config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
    }

    async function __getAll() {
        try {
            const apiRequest = {
                PurchaseOrder: {
                    distinct: false,
                    select: ['*'],
                    where: [],
                    relations: ['supplier'],
                    orderby: 'created_at:desc',
                    limit: 25,
                }
            };
            const response = await API.post('searchByParameters', apiRequest);
            return response.data;
        } catch (error) {
            console.error('GetAll Error', error);
            return [{ PurchaseOrder: [] }];
        }
    }

    async function handleAdvanceSearch(event, searchCriteria, callback) {
        let data = [];
        try {
            const apiRequest = {
                po_number: searchCriteria.po_no_search === '' ? '%' : searchCriteria.po_no_search,
                supplier_name: searchCriteria.supplier_search === '' ? '%' : searchCriteria.supplier_search,
                status: searchCriteria.status_search === '' ? '%' : searchCriteria.status_search,
            };
            const response = await API.post('PurchaseOrder/getSearchByPO', apiRequest);
            const list = response.data?.data || [];

            list.forEach(po => {
                data.push({
                    po_no_search: po.po_number,
                    supplier_search: po.supplier_name || '',
                    status_search: po.status,
                    po_id_search: po.id,
                });
            });
        } catch (error) {
            console.error('AdvanceSearch Error', error);
        }

        let msg = '';
        if (data.length > 20) {
            msg = 'Only 20 records are loaded. Please narrow your search.';
            data = data.slice(0, 20);
        }
        callback(data, msg);
    }

    async function handleAdvanceSearchDone(event, selectedRow) {
        const id = selectedRow.po_id_search;
        await formPopulate(id);
    }

    // ── Form Populate ─────────────────────────────────────────────────────────

    async function formPopulate(id) {
        try {
            document.getElementById('spinner').style.display = '';

            const apiRequest = {
                PurchaseOrder: {
                    distinct: false,
                    select: ['*'],
                    where: [{ 'field-name': 'id', operator: '=', value: id }],
                    relations: ['supplier', 'items', 'items.material', 'items.material.uom'],
                    orderby: 'created_at:desc',
                    limit: 1,
                }
            };
            const response = await API.post('searchByParameters', apiRequest);
            const list = response.data[0]?.PurchaseOrder || [];

            if (list.length === 0) {
                config["CONTROL_CENTER"].promptWarningMessage('Purchase Order not found', '');
                return;
            }

            const po = list[0];

            config['inputId'].setValue(po.id);
            config['inputPoNumber'].setValue(po.po_number);
            config['inputSupplier'].setValue(po.supplier_id);
            config['inputOrderDate'].setDate(po.order_date);
            config['inputExpectedDeliveryDate'].setDate(po.expected_delivery_date || '');
            config['inputStatus'].setValue(po.status);
            config['inputNotes'].setValue(po.notes || '');

            config['inputSubtotal'].setValue(parseFloat(po.subtotal || 0).toFixed(2));
            config['inputDiscount'].setValue(parseFloat(po.discount || 0).toFixed(2));
            config['inputTax'].setValue(parseFloat(po.tax || 0).toFixed(2));
            config['inputShippingCost'].setValue(parseFloat(po.shipping_cost || 0).toFixed(2));
            config['inputTotalAmount'].setValue(parseFloat(po.total_amount || 0).toFixed(2));

            const rows = (po.items || []).map(item => ({
                _rowstate: 'POPULATED',
                po_item_id: item.id,
                material_id: item.material_id,
                uom: item.material?.uom?.name || item.material?.uom || '',
                quantity: item.quantity,
                unit_price: item.unit_price,
                item_expected_delivery: item.expected_delivery_date || '',
                total: item.total,
            }));
            setLineItems(rows);
            __recalculate(rows);

            config["CONTROL_CENTER"].state.modified = true;
            config["CONTROL_CENTER"].state.new = false;

            setCurrentStatus(po.status);
        } catch (error) {
            console.error('FormPopulate Error', error);
            handleError(error);
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    }

    // ── Save ─────────────────────────────────────────────────────────────────

    async function handleSave(event, beforeSaveArr, callback) {
        try {
            document.getElementById('spinner').style.display = '';

            const poId = config['inputId'].data.value;
            const poNumber = config['inputPoNumber'].data.value;
            const supplierId = config['inputSupplier'].data.value;
            const orderDate = config['inputOrderDate'].data.value;
            const expDate = config['inputExpectedDeliveryDate'].data.value;
            const status = config['inputStatus'].data.value;
            const notes = config['inputNotes'].data.value;
            const discount = parseFloat(config['inputDiscount'].data.value) || 0;
            const tax = parseFloat(config['inputTax'].data.value) || 0;
            const shipping = parseFloat(config['inputShippingCost'].data.value) || 0;

            // ── Validation ────────────────────────────────────────────────
            if (!poNumber || poNumber.trim() === '') {
                config["CONTROL_CENTER"].promptWarningMessage('Please enter a PO Number', '');
                return;
            }
            if (!supplierId || supplierId === '') {
                config["CONTROL_CENTER"].promptWarningMessage('Please select a Supplier', '');
                return;
            }
            if (!orderDate || orderDate === '') {
                config["CONTROL_CENTER"].promptWarningMessage('Please select an Order Date', '');
                return;
            }
            if (!status || status === '') {
                config["CONTROL_CENTER"].promptWarningMessage('Please select a Status', '');
                return;
            }

            // ── Line items ────────────────────────────────────────────────
            let valid = true;
            const itemRows = [];

            lineItems.forEach((row) => {
                if (row._rowstate === 'DELETED') {
                    if (row.po_item_id) itemRows.push({ id: row.po_item_id, _rowstate: 'DELETED' });
                } else {
                    if (!row.material_id || row.material_id === '') {
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage('Please select a material for all line items', '');
                    } else if (!(parseFloat(row.quantity) > 0)) {
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage('Quantity must be greater than 0 for all line items', '');
                    } else if (!(parseFloat(row.unit_price) > 0)) {
                        valid = false;
                        config["CONTROL_CENTER"].promptWarningMessage('Unit price must be greater than 0 for all line items', '');
                    }
                    itemRows.push({
                        id: row.po_item_id || null,
                        material_id: row.material_id,
                        quantity: parseFloat(row.quantity) || 0,
                        unit_price: parseFloat(row.unit_price) || 0,
                        total: parseFloat(row.total) || 0,
                        expected_delivery_date: row.item_expected_delivery || null,
                        _rowstate: row._rowstate,
                    });
                }
            });

            if (!valid) return;

            // ── Calculate totals ──────────────────────────────────────────
            const subtotal = lineItems.reduce((sum, r) => {
                if (r._rowstate !== 'DELETED') return sum + (parseFloat(r.total) || 0);
                return sum;
            }, 0);
            const totalAmount = subtotal - discount + tax + shipping;

            // ── API call ──────────────────────────────────────────────────
            const apiRequest = {
                id: poId || null,
                po_umber: poNumber || null,
                supplier_id: supplierId,
                order_date: orderDate,
                expected_delivery_date: expDate || null,
                status: status,
                notes: notes,
                subtotal: subtotal.toFixed(2),
                discount: discount.toFixed(2),
                tax: tax.toFixed(2),
                shipping_cost: shipping.toFixed(2),
                total_amount: totalAmount.toFixed(2),
                items: itemRows,
            };

            const response = await API.post('purchase-orders', apiRequest);

            if (response.status === 200 || response.status === 201) {
                const savedId = response.data?.data || response.data?.id;
                if (savedId) {
                    config['inputId'].setValue(savedId);
                    await formPopulate(savedId);
                }
                config["CONTROL_CENTER"].promptBaseMessage('Purchase Order saved successfully', '');
            } else {
                config["CONTROL_CENTER"].promptWarningMessage('Error saving Purchase Order', '');
            }

        } catch (error) {
            handleError(error);
        } finally {
            document.getElementById('spinner').style.display = 'none';
        }
    }

    return generatePurchaseOrderDisplay(config, currentStatus, lineItems, {
        onLineItemChange: handleLineItemChange,
        onAddRow: handleAddRow,
        onDeleteRow: handleDeleteRow,
    }, materialsData);
};

export default PurchaseOrder;
