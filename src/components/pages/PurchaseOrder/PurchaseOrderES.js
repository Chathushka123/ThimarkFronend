import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { generatePurchaseOrderDisplay } from './PurchaseOrderDS';
import config from './PurchaseOrderCS';
import API from '../../../api/API';

const PurchaseOrder = () => {
    let [rendered, setRendered] = useState(true);
    let [currentStatus, setCurrentStatus] = useState('');
    let [lineItems, setLineItems] = useState([]);
    let [materialsData, setMaterialsData] = useState([]);
    let [suppliers, setSuppliers] = useState([]);

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

    config["inputDiscount"].event.onChange = () => __recalculate(lineItems);
    config["inputTax"].event.onChange = () => __recalculate(lineItems);
    config["inputShippingCost"].event.onChange = () => __recalculate(lineItems);

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
        config['inputStatus'].setValue('DRAFT');
        config['inputNotes'].setValue('');

        config['inputSubtotal'].setValue('0.00');
        config['inputDiscount'].setValue('0.00');
        config['inputTax'].setValue('0.00');
        config['inputShippingCost'].setValue('0.00');
        config['inputTotalAmount'].setValue('0.00');

        setLineItems([]);

        setCurrentStatus('DRAFT');
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
        config['inputStatus'].setValue('DRAFT');
        config['inputSubtotal'].setValue('0.00');
        config['inputDiscount'].setValue('0.00');
        config['inputTax'].setValue('0.00');
        config['inputShippingCost'].setValue('0.00');
        config['inputTotalAmount'].setValue('0.00');
        setCurrentStatus('DRAFT');
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
                    config["CONTROL_CENTER"].promptErrorMessage('Error', error.response.data.message || error.message || 'Please Contact System Administrator');
                    return;
                }
            }
            if (error.response?.data?.errors) {
                const errors = [];
                Object.entries(error.response.data.errors).forEach(([, msgs]) => msgs.forEach(m => errors.push(m)));
                config["CONTROL_CENTER"].promptWarningMessage(errors[0], '');
                return;
            }

            config["CONTROL_CENTER"].promptErrorMessage('Error', error.message || 'Please Contact System Administrator');
            return;
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

            setSuppliers(list);

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
        } catch (error) {
            console.error('Failed to load materials', error);
        }
    }

    // ── Financial recalculation ──────────────────────────────────────────────

    function __recalculate(items) {
        const visibleItems = (items || []).filter(r => r._rowstate !== 'DELETED');
        const subtotal = visibleItems.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);
        const discountPct = parseFloat(config['inputDiscount'].data.value) || 0;
        const discountAmt = subtotal * (discountPct / 100);
        const tax = parseFloat(config['inputTax'].data.value) || 0;
        const shipping = parseFloat(config['inputShippingCost'].data.value) || 0;
        const total = subtotal - discountAmt + tax + shipping;

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
            const where = [];
            if (searchCriteria.po_no_search !== '')
                where.push({ 'field-name': 'po_number', operator: 'like', value: `%${searchCriteria.po_no_search}%` });
            if (searchCriteria.status_search !== '')
                where.push({ 'field-name': 'status', operator: '=', value: searchCriteria.status_search });

            const apiRequest = {
                PurchaseOrder: {
                    distinct: false,
                    select: ['*'],
                    where,
                    relations: ['supplier'],
                    orderby: 'created_at:desc',
                    limit: 25,
                }
            };
            const response = await API.post('searchByParameters', apiRequest);
            let list = response.data[0]?.PurchaseOrder || [];

            // filter by supplier name client-side (relation field)
            if (searchCriteria.supplier_search !== '') {
                const term = searchCriteria.supplier_search.toLowerCase();
                list = list.filter(po => (po.supplier?.name || '').toLowerCase().includes(term));
            }

            list.forEach(po => {
                data.push({
                    po_no_search: po.po_number,
                    supplier_search: po.supplier?.name || '',
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
            config['inputDiscount'].setValue(parseFloat(po.discount_percentage || po.discount || 0).toFixed(2));
            config['inputTax'].setValue(parseFloat(po.tax || 0).toFixed(2));
            config['inputShippingCost'].setValue(parseFloat(po.shipping_cost || 0).toFixed(2));
            config['inputTotalAmount'].setValue(parseFloat(po.total_amount || 0).toFixed(2));

            const rows = (po.items || []).map(item => ({
                _rowstate: 'POPULATED',
                po_item_id: item.id,
                material_id: item.material_id,
                uom: item.material?.uom?.name || (typeof item.material?.uom === 'string' ? item.material?.uom : '') || '',
                quantity: item.quantity,
                unit_price: item.unit_price,
                item_expected_delivery: item.expected_delivery_date || '',
                total: item.total,
            }));
            setLineItems(rows);
            __recalculate(rows);

            setCurrentStatus(po.status);

            config["CONTROL_CENTER"].state.new = true;
            config["CONTROL_CENTER"].state.modified = false;
            reRender();
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
            const discountPct = parseFloat(config['inputDiscount'].data.value) || 0;
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
            const discountAmt = subtotal * (discountPct / 100);
            const totalAmount = subtotal - discountAmt + tax + shipping;

            // ── API call ──────────────────────────────────────────────────
            const apiRequest = {
                id: poId || null,
                po_number: poNumber || null,
                supplier_id: supplierId,
                order_date: orderDate ? moment(orderDate).format('YYYY-MM-DD') : null,
                expected_delivery_date: expDate ? moment(expDate).format('YYYY-MM-DD') : null,
                status: status,
                notes: notes,
                subtotal: subtotal.toFixed(2),
                discount: discountPct.toFixed(2),
                tax: tax.toFixed(2),
                shipping_cost: shipping.toFixed(2),
                total_amount: totalAmount.toFixed(2),
                items: itemRows,
            };

            let response = null;

            if (apiRequest.id) {
                response = await API.put(`purchase-orders/${apiRequest.id}`, apiRequest);
            }
            else {
                response = await API.post('purchase-orders', apiRequest);
            }

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
            if (typeof callback === 'function') callback();
        }
    }

    // ── Print / PDF ───────────────────────────────────────────────────────────

    function handlePrintPo() {
        const poNumber = config['inputPoNumber'].data.value || ''
        const _od = config['inputOrderDate'].data.value
        const orderDate = _od ? moment(_od).format('YYYY-MM-DD') : ''
        const _ed = config['inputExpectedDeliveryDate'].data.value
        const expDate = _ed ? moment(_ed).format('YYYY-MM-DD') : ''
        const status = config['inputStatus'].data.value || ''
        const notes = config['inputNotes'].data.value || ''
        const subtotal = parseFloat(config['inputSubtotal'].data.value) || 0
        const discPct = parseFloat(config['inputDiscount'].data.value) || 0
        const tax = parseFloat(config['inputTax'].data.value) || 0
        const shipping = parseFloat(config['inputShippingCost'].data.value) || 0
        const total = parseFloat(config['inputTotalAmount'].data.value) || 0

        const supplierId = config['inputSupplier'].data.value
        const supplierName = suppliers.find(supplier => supplier.id == supplierId)

        const fmt = (n) => parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        const discAmt = subtotal * (discPct / 100)
        const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

        const visibleItems = (lineItems || []).filter(r => r._rowstate !== 'DELETED')
        const itemRows = visibleItems.map((row, i) => {
            const mat = (materialsData || []).find(m => String(m.id) === String(row.material_id))
            const matName = mat ? `${mat.code} &ndash; ${mat.name}` : (row.material_id || '&mdash;')
            const uom = typeof row.uom === 'object' ? (row.uom?.name || '') : (row.uom || '')
            const rowBg = i % 2 === 0 ? '#ffffff' : '#f7f8fc'
            return `
            <tr style="background:${rowBg}">
                <td style="text-align:center;color:#888;font-size:11px;padding:9px 10px;border-bottom:1px solid #eaecf0">${i + 1}</td>
                <td style="padding:9px 10px;border-bottom:1px solid #eaecf0;font-weight:500">${matName}</td>
                <td style="text-align:center;padding:9px 10px;border-bottom:1px solid #eaecf0">
                    <span style="background:#e8eaf6;color:#3c4a9e;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600">${uom}</span>
                </td>
                <td style="text-align:right;padding:9px 10px;border-bottom:1px solid #eaecf0">${fmt(row.quantity)}</td>
                <td style="text-align:right;padding:9px 10px;border-bottom:1px solid #eaecf0;font-family:monospace">${fmt(row.unit_price)}</td>
                <td style="text-align:center;padding:9px 10px;border-bottom:1px solid #eaecf0;color:#555">${row.item_expected_delivery || '&mdash;'}</td>
                <td style="text-align:right;padding:9px 10px;border-bottom:1px solid #eaecf0;font-weight:700;font-family:monospace;color:#000841">${fmt(row.total)}</td>
            </tr>`
        }).join('')

        const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Purchase Order &ndash; ${poNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #2c2c2c; background: #fff; }
  .page { max-width: 900px; margin: 0 auto; padding: 40px 50px; }

  /* ── Header ── */
  .doc-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 4px solid #000841; margin-bottom: 28px; }
  .company-block .company-name { font-size: 24px; font-weight: 800; color: #000841; letter-spacing: 0.5px; }
  .company-block .company-sub  { font-size: 11px; color: #666; margin-top: 3px; line-height: 1.6; }
  .po-block { text-align: right; }
  .po-block .doc-type { font-size: 26px; font-weight: 800; color: #000841; letter-spacing: 1px; text-transform: uppercase; }
  .po-block .po-ref   { font-size: 14px; color: #444; margin-top: 4px; }
  .po-block .po-date  { font-size: 12px; color: #777; margin-top: 2px; }
  .status-pill { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #000841; color: #fff; margin-top: 6px; letter-spacing: 0.5px; }

  /* ── Parties ── */
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .party-box { background: #f7f8fc; border: 1px solid #e2e6f0; border-radius: 6px; padding: 14px 16px; }
  .party-box .party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }
  .party-box .party-name  { font-size: 14px; font-weight: 700; color: #000841; }
  .party-box .party-sub   { font-size: 12px; color: #555; margin-top: 3px; line-height: 1.6; }

  /* ── Delivery / Terms bar ── */
  .info-bar { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; margin-bottom: 24px; border: 1px solid #dde1ed; border-radius: 6px; overflow: hidden; }
  .info-cell { padding: 10px 14px; border-right: 1px solid #dde1ed; }
  .info-cell:last-child { border-right: none; }
  .info-cell .ic-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #888; margin-bottom: 3px; }
  .info-cell .ic-value { font-size: 13px; font-weight: 600; color: #222; }

  /* ── Items table ── */
  .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12.5px; }
  .items-table thead tr { background: #000841; color: #fff; }
  .items-table thead th { padding: 10px 10px; text-align: left; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .items-table tfoot tr { background: #f0f2fa; }
  .items-table tfoot td { padding: 9px 10px; font-size: 12px; color: #333; }
  .items-table .no-items td { text-align: center; color: #aaa; padding: 30px; font-style: italic; }

  /* ── Financial summary ── */
  .fin-wrap { display: flex; justify-content: flex-end; margin-bottom: 28px; }
  .fin-table { width: 300px; border-collapse: collapse; font-size: 13px; }
  .fin-table td { padding: 7px 10px; border-bottom: 1px solid #eaecf0; }
  .fin-table td:last-child { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; }
  .fin-table .fin-sep td { border-bottom: 2px solid #000841; padding: 0; height: 0; }
  .fin-table .fin-total td { background: #000841; color: #fff; font-size: 15px; font-weight: 800; padding: 10px; border-bottom: none; }
  .fin-table .fin-total td:last-child { font-family: 'Courier New', monospace; }
  .fin-table .fin-neg td:last-child { color: #c0392b; }

  /* ── Notes ── */
  .notes-box { background: #fffdf0; border-left: 4px solid #f0c040; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; font-size: 12px; color: #444; line-height: 1.6; }
  .notes-box strong { display: block; margin-bottom: 4px; color: #333; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Terms ── */
  .terms-section { margin-bottom: 28px; }
  .terms-section h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #555; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  .terms-section ol { padding-left: 18px; font-size: 11.5px; color: #555; line-height: 1.8; }

  /* ── Signature ── */
  .sig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 28px; }
  .sig-block .sig-line { border-top: 1px solid #aaa; margin-top: 48px; padding-top: 6px; font-size: 11px; color: #666; }
  .sig-block .sig-label { font-size: 11px; color: #888; margin-top: 2px; }

  /* ── Footer ── */
  .doc-footer { border-top: 1px solid #dde1ed; padding-top: 10px; font-size: 10.5px; color: #aaa; text-align: center; line-height: 1.6; }

  @media print {
    body { font-size: 12px; }
    .page { padding: 20px 30px; }
    @page { margin: 15mm; size: A4; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="doc-header">
    <div class="company-block">
      <div class="company-name">Thimark</div>
      <div class="company-sub">
        Procurement Department<br>
        purchase@thimark.com
      </div>
    </div>
    <div class="po-block">
      <div class="doc-type">Purchase Order</div>
      <div class="po-ref">PO No: <strong>${poNumber}</strong></div>
      <div class="po-date">Issued: ${today}</div>
      <div><span class="status-pill">${status || 'DRAFT'}</span></div>
    </div>
  </div>

  <!-- Parties -->
  <div class="parties">
    <div class="party-box">
      <div class="party-label">From (Buyer)</div>
      <div class="party-name">Thimark</div>
      <div class="party-sub">Procurement Department<br>purchase@thimark.com</div>
    </div>
    <div class="party-box">
      <div class="party-label">To (Supplier)</div>
      <div class="party-name">${supplierName.name || '&mdash;'}</div>
      <div class="party-sub">${supplierName.address}</div>
    </div>
  </div>

  <!-- Info bar -->
  <div class="info-bar">
    <div class="info-cell">
      <div class="ic-label">Order Date</div>
      <div class="ic-value">${orderDate || '&mdash;'}</div>
    </div>
    <div class="info-cell">
      <div class="ic-label">Expected Delivery</div>
      <div class="ic-value">${expDate || '&mdash;'}</div>
    </div>
    <div class="info-cell">
      <div class="ic-label">Currency</div>
      <div class="ic-value">LKR &mdash; Sri Lankan Rupee</div>
    </div>
  </div>

  <!-- Items -->
  <table class="items-table">
    <thead>
      <tr>
        <th width="30">#</th>
        <th>Description / Material</th>
        <th width="70" style="text-align:center">UOM</th>
        <th width="90" style="text-align:right">Qty</th>
        <th width="130" style="text-align:right">Unit Price (LKR)</th>
        <th width="110" style="text-align:center">Exp. Delivery</th>
        <th width="130" style="text-align:right">Line Total (LKR)</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows || '<tr class="no-items"><td colspan="7">No line items found.</td></tr>'}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="6" style="text-align:right;font-weight:700;padding-right:14px">Sub-Total</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#000841;padding:9px 10px">${fmt(subtotal)}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Financial summary -->
  <div class="fin-wrap">
    <table class="fin-table">
      <tr><td>Sub-Total</td><td>LKR ${fmt(subtotal)}</td></tr>
      <tr class="fin-neg"><td>Discount (${discPct.toFixed(2)}%)</td><td>- LKR ${fmt(discAmt)}</td></tr>
      <tr><td>Tax</td><td>LKR ${fmt(tax)}</td></tr>
      <tr><td>Shipping &amp; Handling</td><td>LKR ${fmt(shipping)}</td></tr>
      <tr class="fin-sep"><td colspan="2"></td></tr>
      <tr class="fin-total"><td>GRAND TOTAL</td><td>LKR ${fmt(total)}</td></tr>
    </table>
  </div>

  ${notes ? `
  <!-- Notes -->
  <div class="notes-box">
    <strong>Notes / Special Instructions</strong>
    ${notes}
  </div>` : ''}


  <!-- Footer -->
  <div class="doc-footer">
    This is a computer-generated Purchase Order. &nbsp;|&nbsp; PO Ref: ${poNumber} &nbsp;|&nbsp; Issued by Thimark Procurement &nbsp;|&nbsp; ${today}
  </div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body></html>`

        const w = window.open('', '_blank', 'width=960,height=780')
        if (w) { w.document.write(html); w.document.close() }
    }

    return generatePurchaseOrderDisplay(config, currentStatus, lineItems, {
        onLineItemChange: handleLineItemChange,
        onAddRow: handleAddRow,
        onDeleteRow: handleDeleteRow,
        onPrint: handlePrintPo,
    }, materialsData);
};

export default PurchaseOrder;
