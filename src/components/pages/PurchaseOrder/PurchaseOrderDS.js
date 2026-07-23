import React from 'react'
import Select from 'react-select'
import {
    TextBox, DateField, DropDown, Label, TextArea,
    Button, ControlCenter, NewButton, SaveButton,
    AdvanceSearch, AdvanceSearchGrid, AdvanceSearchButton,
    MultiSelectDropDown,
    MultiSelectDropDownOriginal
} from '../../../BASE/Components'

// ── Status colour map ─────────────────────────────────────────────────────────

const STATUS_COLORS = {
    'DRAFT': { bg: '#6c757d', text: '#fff' },
    'OPEN': { bg: '#17a2b8', text: '#fff' },
    'PENDING APPROVAL': { bg: '#fd7e14', text: '#fff' },
    'APPROVED': { bg: '#007bff', text: '#fff' },
    'SENT': { bg: '#6f42c1', text: '#fff' },
    'RECEIVED': { bg: '#28a745', text: '#fff' },
    'CLOSED': { bg: '#343a40', text: '#fff' },
    'CANCELLED': { bg: '#dc3545', text: '#fff' },
}

function StatusBadge({ status }) {
    const c = STATUS_COLORS[status] || { bg: '#adb5bd', text: '#fff' }
    const label = !status ? 'New' : status
    const color = !status ? { bg: '#adb5bd', text: '#fff' } : c
    return (
        <span style={{
            background: color.bg,
            color: color.text,
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            display: 'inline-block',
            marginLeft: '12px',
            verticalAlign: 'middle',
        }}>
            {label}
        </span>
    )
}

// ── Inline styles ─────────────────────────────────────────────────────────────

const S = {
    card: {
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 14px rgba(0,0,0,0.08)',
        marginBottom: '22px',
        overflow: 'visible',
    },
    cardHeader: {
        background: '#f8f9fc',
        color: '#0f014b',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #638ad6',
    },
    cardHeaderGreen: {
        background: '#f8f9fc',
        color: '#0f014b',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #28a745',
    },
    cardHeaderDark: {
        background: '#f8f9fc',
        color: '#0f014b',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #4a5568',
    },
    cardBody: { padding: '20px 20px 10px 20px' },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#0f014b',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '4px',
        display: 'block',
    },
    // Financial row item
    finRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    finLabel: {
        fontSize: '13px',
        color: '#555',
        fontWeight: '500',
    },
    finValue: {
        fontSize: '13px',
        color: '#0f014b',
        fontWeight: '700',
        fontFamily: "'Courier New', monospace",
        minWidth: '120px',
        textAlign: 'right',
    },
    finTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0 4px 0',
        borderTop: '2px solid #0f014b',
        marginTop: '4px',
    },
    finTotalLabel: {
        fontSize: '16px',
        color: '#0f014b',
        fontWeight: '800',
        letterSpacing: '0.5px',
    },
    finTotalValue: {
        fontSize: '18px',
        color: '#0f014b',
        fontWeight: '800',
        fontFamily: "'Courier New', monospace",
        minWidth: '120px',
        textAlign: 'right',
    },
    tableWrapper: {
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
    },
    gridContainer: { padding: '16px' },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#0f014b',
        marginBottom: '0',
    },
    // ── Item table ────────────────────────────────────────────────────────────
    itemTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', minWidth: '720px' },
    itemTh: {
        background: '#eef2f9',
        color: '#0f014b',
        padding: '10px 12px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
        borderRight: '1px solid #dde3f0',
        borderBottom: '2px solid #c5cee0',
    },
    itemRowEven: { background: '#fff' },
    itemRowOdd: { background: '#f8f9fb' },
    itemTd: { padding: '7px 10px', borderBottom: '1px solid #edf2f7', verticalAlign: 'middle' },
    itemSelect: {
        width: '100%',
        padding: '5px 8px',
        border: '1px solid #e2e8f0',
        borderRadius: '5px',
        fontSize: '12px',
        background: '#fff',
        color: '#2d3748',
        outline: 'none',
        minWidth: '180px',
    },
    itemInput: {
        width: '100%',
        padding: '5px 8px',
        border: '1px solid #e2e8f0',
        borderRadius: '5px',
        fontSize: '12px',
        background: '#fff',
        color: '#2d3748',
        outline: 'none',
    },
    itemInputNum: {
        width: '90px',
        padding: '5px 8px',
        border: '1px solid #e2e8f0',
        borderRadius: '5px',
        fontSize: '12px',
        background: '#fff',
        color: '#2d3748',
        outline: 'none',
        textAlign: 'right',
    },
    uomBadge: {
        background: '#e2e8f0',
        color: '#4a5568',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: '600',
    },
    lineTotalVal: {
        fontFamily: "'Courier New', monospace",
        fontWeight: '700',
        color: '#0f014b',
        fontSize: '13px',
    },
    deleteRowBtn: {
        background: 'transparent',
        border: '1px solid #fed7d7',
        color: '#e53e3e',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        lineHeight: '1',
    },
    addRowBtn: {
        background: '#7b8eb5',
        color: '#fff',
        border: '1px solid #638ad6',
        padding: '8px 18px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.3px',
    },
    itemEmptyCell: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#adb5bd',
        fontSize: '13px',
    },
}

// ── Line Items Custom Table ─────────────────────────────────────────────────

function LineItemsTable({ lineItems, handlers, materialsData }) {
    const visibleItems = (lineItems || [])
        .map((row, idx) => ({ ...row, _realIndex: idx }))
        .filter(row => row._rowstate !== 'DELETED')

    // IDs already chosen in other rows — used to exclude from each row's options
    const selectedIds = new Set(
        visibleItems.filter(r => r.material_id).map(r => String(r.material_id))
    )

    const allOptions = (materialsData || []).map(m => ({ value: m.id, label: `${m.code} | ${m.name}` }))

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={S.itemTable}>
                    <thead>
                        <tr>
                            <th style={S.itemTh} width="35">#</th>
                            <th style={S.itemTh} width="40%"> Material</th>
                            <th style={S.itemTh} width="80">UOM</th>
                            <th style={{ ...S.itemTh, textAlign: 'right' }} width="100">Qty</th>
                            <th style={{ ...S.itemTh, textAlign: 'right' }} width="140">Unit Price (LKR)</th>
                            <th hidden style={S.itemTh} width="145">Exp. Delivery</th>
                            <th style={{ ...S.itemTh, textAlign: 'right' }} width="140">Line Total (LKR)</th>
                            <th style={{ ...S.itemTh, textAlign: 'center' }} width="45"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleItems.length === 0 && (
                            <tr>
                                <td colSpan={8} style={S.itemEmptyCell}>
                                    <i className="fas fa-inbox" style={{ fontSize: '28px', display: 'block', marginBottom: '8px', opacity: 0.3 }}></i>
                                    No items yet — click <strong>Add Row</strong> to begin
                                </td>
                            </tr>
                        )}
                        {visibleItems.map((row, dispIdx) => {
                            const ri = row._realIndex
                            return (
                                <tr key={ri} style={dispIdx % 2 === 0 ? S.itemRowEven : S.itemRowOdd}>
                                    <td style={{ ...S.itemTd, textAlign: 'center', color: '#aaa', fontWeight: '700', fontSize: '11px' }}>{dispIdx + 1}</td>
                                    <td style={S.itemTd}>
                                        <Select
                                            value={allOptions.find(o => String(o.value) === String(row.material_id)) || null}
                                            onChange={opt => handlers.onLineItemChange(ri, 'material_id', opt ? opt.value : '')}
                                            options={allOptions.filter(o => !selectedIds.has(String(o.value)) || String(o.value) === String(row.material_id))}
                                            placeholder="— Select Material —"
                                            isClearable
                                            isSearchable
                                            menuPortalTarget={document.body}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: '30px',
                                                    height: '30px',
                                                    fontSize: '12px',
                                                    // minWidth: '180px',
                                                    borderColor: state.isFocused ? '#90cdf4' : '#e2e8f0',
                                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(66,153,225,0.25)' : 'none',
                                                }),
                                                valueContainer: base => ({ ...base, padding: '0 8px', height: '30px' }),
                                                input: base => ({ ...base, margin: 0, padding: 0, fontSize: '12px' }),
                                                indicatorsContainer: base => ({ ...base, height: '30px' }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    fontSize: '12px',
                                                    backgroundColor: state.isSelected ? '#0f014b' : state.isFocused ? '#e8eaf6' : '#fff',
                                                    color: state.isSelected ? '#fff' : '#2d3748',
                                                }),
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                    </td>
                                    <td style={{ ...S.itemTd, textAlign: 'center' }}>
                                        {row.uom
                                            ? <span style={S.uomBadge}>{typeof row.uom === 'object' ? (row.uom?.name || '') : row.uom}</span>
                                            : <span style={{ color: '#ccc' }}>–</span>}
                                    </td>
                                    <td style={{ ...S.itemTd, textAlign: 'right' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.quantity || ''}
                                            onChange={e => handlers.onLineItemChange(ri, 'quantity', e.target.value)}
                                            style={S.itemInputNum}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td style={{ ...S.itemTd, textAlign: 'right' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={row.unit_price || ''}
                                            onChange={e => handlers.onLineItemChange(ri, 'unit_price', e.target.value)}
                                            style={S.itemInputNum}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    {/* <td style={S.itemTd}>
                                        <input
                                            type="date"
                                            value={row.item_expected_delivery || ''}
                                            onChange={e => handlers.onLineItemChange(ri, 'item_expected_delivery', e.target.value)}
                                            style={S.itemInput}
                                        />
                                    </td> */}
                                    <td style={{ ...S.itemTd, textAlign: 'right' }}>
                                        <span style={S.lineTotalVal}>
                                            {row.total
                                                ? parseFloat(row.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                : '0.00'}
                                        </span>
                                    </td>
                                    <td style={{ ...S.itemTd, textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => handlers.onDeleteRow(ri)}
                                            style={S.deleteRowBtn}
                                            title="Remove row"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                <button type="button" onClick={handlers.onAddRow} style={S.addRowBtn}>
                    <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
                    Add Row
                </button>
            </div>
        </div>
    )
}

// ── Display function ──────────────────────────────────────────────────────────

export function generatePurchaseOrderDisplay(componentList, currentStatus, lineItems, handlers, materialsData, paymentTransactions = []) {

    return (
        <>
            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

                {/* ── Page Header ───────────────────────────────────────────── */}
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1>
                            {componentList["CONTROL_CENTER"].label.schema.value}
                            <StatusBadge status={currentStatus} />
                        </h1>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                                <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search">
                                    <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                    <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                                </AdvanceSearch>
                                <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}>
                                    <i className="fas fa-search fa-lg"></i>
                                </Button>
                                <button
                                    className="btn btn-secondary btn-sm mr-2"
                                    type="button"
                                    title="Print / Save PDF"
                                    onClick={handlers.onPrint}
                                >
                                    <i className="fas fa-print fa-lg"></i>
                                </button>
                                <NewButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonNew"]}>
                                    <i className="far fa-file fa-lg"></i>
                                </NewButton>
                                <SaveButton className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonSave"]}>
                                    <i className="far fa-save fa-lg"></i>
                                </SaveButton>
                                <Button className="btn btn-danger btn-sm mr-2" item={componentList["buttonDelete"]}>
                                    <i className="far fa-trash-alt fa-lg"></i>
                                </Button>
                            </ControlCenter>
                        </div>
                    </div>
                </div>

                {/* Hidden ID */}
                <TextBox item={componentList["inputId"]} />

                <div className="container-fluid custom-container-padding">

                    {/* ── Card 1: PO Header Information ──────────────────────── */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <span>
                                <i className="fas fa-file-purchase-order" style={{ marginRight: '8px' }}></i>
                                <i className="fas fa-clipboard-list" style={{ marginRight: '8px' }}></i>
                                Purchase Order Information
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.75 }}>
                                Fields marked <span style={{ color: '#e53e3e' }}>*</span> are required
                            </span>
                        </div>
                        <div style={S.cardBody}>
                            <div className="form-row">

                                {/* PO Number */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-hashtag" style={{ marginRight: '4px' }}></i>
                                        PO Number
                                    </span>
                                    <TextBox

                                        item={componentList["inputPoNumber"]}
                                        className="form-control form-control-sm"
                                        style={{ fontWeight: '600', letterSpacing: '0.5px' }}
                                    />
                                </div>

                                {/* Supplier */}
                                <div className="form-group col-xl-4 col-md-8 col-sm-12 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-truck" style={{ marginRight: '4px' }}></i>
                                        Supplier <span style={{ color: '#e53e3e' }}>*</span>
                                    </span>
                                    <MultiSelectDropDownOriginal
                                        item={componentList["inputSupplier"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>

                                {/* Order Date */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-calendar-alt" style={{ marginRight: '4px' }}></i>
                                        Order Date <span style={{ color: '#e53e3e' }}>*</span>
                                    </span>
                                    <DateField
                                        item={componentList["inputOrderDate"]}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>

                                {/* Expected Delivery */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12" >
                                    <span style={S.label}>
                                        <i className="fas fa-shipping-fast" style={{ marginRight: '4px' }}></i>
                                        Ex Mill
                                    </span>
                                    <DateField
                                        item={componentList["inputExpectedDeliveryDate"]}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                {/* Payment Date */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-credit-card" style={{ marginRight: '4px' }}></i>
                                        Payment Date
                                    </span>
                                    <DateField
                                        item={componentList["inputPaymentDate"]}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>

                                {/* In House Date */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-warehouse" style={{ marginRight: '4px' }}></i>
                                        In House Date
                                    </span>
                                    <DateField
                                        item={componentList["inputInHouseDate"]}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                {/* Status */}
                                <div className="form-group col-xl-2 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-tag" style={{ marginRight: '4px' }}></i>
                                        Status <span style={{ color: '#e53e3e' }}>*</span>
                                    </span>
                                    <DropDown
                                        item={componentList["inputStatus"]}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                {/* Notes */}
                                <div className="form-group col-xl-8 col-md-4 col-sm-6 col-12">
                                    <span style={S.label}>
                                        <i className="fas fa-sticky-note" style={{ marginRight: '4px' }}></i>
                                        Notes / Remarks
                                    </span>
                                    <TextArea
                                        item={componentList["inputNotes"]}
                                        className="form-control form-control-sm"
                                        rows={4}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ── Card 2: Line Items Grid ─────────────────────────────── */}
                    <div style={S.card}>
                        <div style={S.cardHeaderDark}>
                            <span>
                                <i className="fas fa-list-ul" style={{ marginRight: '8px' }}></i>
                                Line Items
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.75 }}>
                                Select material → enter quantity &amp; unit price
                            </span>
                        </div>
                        <LineItemsTable lineItems={lineItems} handlers={handlers} materialsData={materialsData || []} />
                    </div>

                    {/* ── Card 3 & Card 4: Financial + Payments ───────────────── */}
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-12">
                            <div style={S.card}>
                                <div style={S.cardHeaderGreen}>
                                    <span>
                                        <i className="fas fa-calculator" style={{ marginRight: '8px' }}></i>
                                        Financial Summary
                                    </span>
                                </div>
                                <div style={{ padding: '16px 20px' }}>

                                    {/* Subtotal */}
                                    <div style={S.finRow}>
                                        <span style={S.finLabel}>
                                            <i className="fas fa-stream" style={{ marginRight: '6px', color: '#aaa' }}></i>
                                            Subtotal
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>LKR</span>
                                            <TextBox
                                                item={componentList["inputSubtotal"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ width: '130px', fontFamily: "'Courier New', monospace", fontWeight: '700', background: '#f0f4ff', border: '1px solid #c5cae9' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div style={S.finRow}>
                                        <span style={S.finLabel}>
                                            <i className="fas fa-percent" style={{ marginRight: '6px', color: '#aaa' }}></i>
                                            Discount
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>%</span>
                                            <TextBox
                                                item={componentList["inputDiscount"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ width: '130px', fontFamily: "'Courier New', monospace", fontWeight: '600' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Tax */}
                                    <div style={S.finRow}>
                                        <span style={S.finLabel}>
                                            <i className="fas fa-file-invoice-dollar" style={{ marginRight: '6px', color: '#aaa' }}></i>
                                            Tax
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>LKR</span>
                                            <TextBox
                                                item={componentList["inputTax"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ width: '130px', fontFamily: "'Courier New', monospace", fontWeight: '600' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div style={S.finRow}>
                                        <span style={S.finLabel}>
                                            <i className="fas fa-shipping-fast" style={{ marginRight: '6px', color: '#aaa' }}></i>
                                            Shipping
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>LKR</span>
                                            <TextBox
                                                item={componentList["inputShippingCost"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ width: '130px', fontFamily: "'Courier New', monospace", fontWeight: '600' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Grand Total */}
                                    <div style={S.finTotalRow}>
                                        <span style={S.finTotalLabel}>
                                            <i className="fas fa-coins" style={{ marginRight: '8px', color: '#0f014b' }}></i>
                                            GRAND TOTAL
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f014b' }}>LKR</span>
                                            <TextBox
                                                item={componentList["inputTotalAmount"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ width: '140px', fontFamily: "'Courier New', monospace", fontWeight: '800', fontSize: '16px', background: '#e8eaf6', border: '2px solid #0f014b', color: '#0f014b' }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-xl-6 col-lg-6 col-12">
                            <div style={S.card}>
                                <div style={S.cardHeaderDark}>
                                    <span>
                                        <i className="fas fa-money-check-alt" style={{ marginRight: '8px' }}></i>
                                        Payment Transactions
                                    </span>
                                    <span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.75 }}>
                                        Add amount and note, then save transaction
                                    </span>
                                </div>
                                <div style={S.cardBody}>
                                    <div className="row">
                                        <div className="form-group col-md-4 col-sm-6 col-12">
                                            <span style={S.label}>Amount (LKR)</span>
                                            <TextBox
                                                item={componentList["inputPaymentAmount"]}
                                                className="form-control form-control-sm text-right"
                                                style={{ fontFamily: "'Courier New', monospace", fontWeight: '700' }}
                                            />
                                        </div>
                                        <div className="form-group col-md-8 col-sm-6 col-12">
                                            <span style={S.label}>Note</span>
                                            <TextArea
                                                item={componentList["inputPaymentNote"]}
                                                className="form-control form-control-sm"
                                                rows={2}
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>
                                        <div className="form-group col-12 d-flex justify-content-end">
                                            <Button
                                                className="btn btn-primary btn-sm"
                                                item={componentList["buttonAddPaymentTransaction"]}
                                            >
                                                <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                                                Add Transaction
                                            </Button>
                                        </div>
                                    </div>

                                    <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                                        <table style={{ ...S.itemTable, minWidth: '460px' }}>
                                            <thead>
                                                <tr>
                                                    <th style={S.itemTh} width="40">#</th>
                                                    <th style={{ ...S.itemTh, textAlign: 'right' }} width="150">Amount (LKR)</th>
                                                    <th style={S.itemTh}>Note</th>
                                                    <th style={S.itemTh} width="170">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(!paymentTransactions || paymentTransactions.length === 0) && (
                                                    <tr>
                                                        <td colSpan={4} style={S.itemEmptyCell}>
                                                            No payment transactions yet
                                                        </td>
                                                    </tr>
                                                )}
                                                {(paymentTransactions || []).map((tx, idx) => (
                                                    <tr key={tx.id || idx} style={idx % 2 === 0 ? S.itemRowEven : S.itemRowOdd}>
                                                        <td style={{ ...S.itemTd, textAlign: 'center' }}>{idx + 1}</td>
                                                        <td style={{ ...S.itemTd, textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: '700' }}>
                                                            {(parseFloat(tx.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                        <td style={S.itemTd}>{tx.note || '-'}</td>
                                                        <td style={S.itemTd}>{tx.created_at || tx.payment_date || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </ControlCenter>
        </>
    )
}
