import React, { useState, useRef } from 'react';
import API from '../../api/API';

const STATUS_STYLES = {
    critical: { color: '#dc3545', bg: '#fff5f5', borderColor: '#dc3545', label: 'Critical', barColor: '#dc3545' },
    low: { color: '#fd7e14', bg: '#fff8f0', borderColor: '#fd7e14', label: 'Low', barColor: '#fd7e14' },
    healthy: { color: '#28a745', bg: '#f0fff4', borderColor: '#28a745', label: 'Healthy', barColor: '#28a745' },
};

/**
 * Returns stock status styling based on qty vs min_qty
 */
const getStockStatus = (qty, minQty) => {
    if (qty <= minQty) {
        return { color: '#dc3545', bg: '#fff5f5', borderColor: '#dc3545', label: 'Critical', barColor: '#dc3545' };
    }
    if (qty <= minQty * 1.5) {
        return { color: '#fd7e14', bg: '#fff8f0', borderColor: '#fd7e14', label: 'Low', barColor: '#fd7e14' };
    }
    return { color: '#28a745', bg: '#f0fff4', borderColor: '#28a745', label: 'Healthy', barColor: '#28a745' };
};

/**
 * WarehouseBinCard
 * Props:
 *   - binLabel {string|number}  : The bin identifier (e.g. "1", "2")
 *   - items    {Array}          : Array of inventory items in this bin
 *                                 Each item: { id, qty, stock_item: { name, code, min_qty, size, supplier, lead_time, unit_price, ... } }
 */
const TAB_BTN_BASE = {
    flex: 1,
    padding: '9px 0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    borderBottom: '3px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
};

const WarehouseBinCard = ({ binId, binLabel, items, highlightedIds = [], materialStatusMap = null, formReadWrite = false, handleBinMaterialChange, handleBinQtyChange, handleAddMaterial, selectedWarehouse }) => {
    const [modalItem, setModalItem] = useState(null); // null | item object | '__add__'
    const [activeTab, setActiveTab] = useState('qty');
    const [newQty, setNewQty] = useState('');
    const [transferQty, setTransferQty] = useState('');
    const [targetBinId, setTargetBinId] = useState('');
    const [newMatQty, setNewMatQty] = useState('');
    const [matSearchTerm, setMatSearchTerm] = useState('');
    const [matResults, setMatResults] = useState([]);
    const [isSearchingMat, setIsSearchingMat] = useState(false);
    const [showMatDropdown, setShowMatDropdown] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const matDebounceRef = useRef(null);

    const canEdit = formReadWrite && formReadWrite !== 'r';

    const openItemModal = (item) => {
        setModalItem(item);
        setActiveTab('qty');
        setNewQty(String(item.qty));
        setTargetBinId('');
        setTransferQty(String(item.qty));
    };

    const openAddModal = () => {
        setModalItem('__add__');
        setActiveTab('add');
        setMatSearchTerm('');
        setMatResults([]);
        setShowMatDropdown(false);
        setSelectedMaterial(null);
        setNewMatQty('');
    };

    const closeModal = () => {
        setModalItem(null);
        setNewQty('');
        setTransferQty('');
        setTargetBinId('');
        setMatSearchTerm('');
        setMatResults([]);
        setShowMatDropdown(false);
        setSelectedMaterial(null);
        setNewMatQty('');
        if (matDebounceRef.current) clearTimeout(matDebounceRef.current);
    };

    const handleQtySave = () => {
        const qty = parseFloat(newQty);
        if (isNaN(qty) || qty < 0) return;
        handleBinQtyChange && handleBinQtyChange(modalItem.id, qty);
        closeModal();
    };

    const handleTransfer = () => {
        const toBinId = parseInt(targetBinId, 10);
        if (!toBinId || toBinId === binId) return;
        const qty = parseFloat(transferQty);
        if (isNaN(qty) || qty <= 0 || qty > modalItem.qty) return;
        handleBinMaterialChange && handleBinMaterialChange(binId, toBinId, modalItem.stock_item.id, qty);
        closeModal();
    };
    const handleAdd = () => {
        if (!selectedMaterial || !newMatQty) return;
        handleAddMaterial && handleAddMaterial(binId, selectedMaterial, parseFloat(newMatQty));
        closeModal();
    };

    const searchMaterials = async (term) => {
        setIsSearchingMat(true);
        try {
            const whParam = selectedWarehouse ? `&wh=${selectedWarehouse}` : '';
            const response = await API.get(`/stock-materials/search?q=${encodeURIComponent(term)}${whParam}`);
            if (Array.isArray(response.data)) {
                setMatResults(response.data);
                setShowMatDropdown(response.data.length > 0);
            } else {
                setMatResults([]);
                setShowMatDropdown(false);
            }
        } catch (error) {
            console.log(error);
            setMatResults([]);
            setShowMatDropdown(false);
        } finally {
            setIsSearchingMat(false);
        }
    };

    const handleMatInputChange = (value) => {
        setMatSearchTerm(value);
        setSelectedMaterial(null);
        setShowMatDropdown(false);
        if (matDebounceRef.current) clearTimeout(matDebounceRef.current);
        if (value.trim().length >= 3) {
            matDebounceRef.current = setTimeout(() => searchMaterials(value.trim()), 350);
        } else {
            setMatResults([]);
        }
    };

    const handleMatKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (matDebounceRef.current) clearTimeout(matDebounceRef.current);
            if (matSearchTerm.trim().length >= 3) searchMaterials(matSearchTerm.trim());
        }
    };

    const selectMaterial = (mat) => {
        setSelectedMaterial(mat);
        setMatSearchTerm(`${mat.name} (${mat.code})`);
        setShowMatDropdown(false);
    };

    const hasBinMatch = highlightedIds.length > 0 && items && items.some(item => highlightedIds.includes(item.stock_item.id));
    const isEditingItem = modalItem && modalItem !== '__add__';

    return (
        <>
            {modalItem && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 10002, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={closeModal}
                >
                    <div
                        style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', background: 'linear-gradient(135deg, #2d3436, #343a40)', flexShrink: 0 }}>
                            <div>
                                <div style={{ color: '#adb5bd', fontSize: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>BIN {binLabel}</div>
                                <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px', marginTop: '2px' }}>
                                    {isEditingItem ? modalItem.stock_item.name : '+ Add Material'}
                                </div>
                                {isEditingItem && (
                                    <div style={{ color: '#adb5bd', fontSize: '10px', fontFamily: 'monospace', marginTop: '1px' }}>{modalItem.stock_item.code}</div>
                                )}
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd', fontSize: '20px', lineHeight: 1, padding: '0 2px' }} title="Close">✕</button>
                        </div>

                        {/* Tabs — only for existing item actions */}
                        {isEditingItem && (
                            <div style={{ display: 'flex', borderBottom: '1.5px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
                                {[['qty', '⚖ Adjust Qty'], ['transfer', '↕ Transfer'], ['add', '＋ Add Material']].map(([tab, label]) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            ...TAB_BTN_BASE,
                                            color: activeTab === tab ? '#4361ee' : '#6c757d',
                                            borderBottomColor: activeTab === tab ? '#4361ee' : 'transparent',
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tab Content */}
                        <div style={{ padding: '20px 18px 18px' }}>

                            {/* Adjust Quantity */}
                            {(activeTab === 'qty' && isEditingItem) && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', padding: '10px 12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                        <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Current Qty</span>
                                        <span style={{ fontSize: '16px', fontWeight: '900', color: '#495057' }}>{modalItem.qty} <span style={{ fontSize: '10px', color: '#adb5bd' }}>units</span></span>
                                    </div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', display: 'block', marginBottom: '5px' }}>New Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newQty}
                                        onChange={e => setNewQty(e.target.value)}
                                        className="form-control form-control-sm"
                                        style={{ marginBottom: '14px' }}
                                        autoFocus
                                    />
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={closeModal} style={{ padding: '6px 16px', borderRadius: '7px', border: '1px solid #dee2e6', background: '#fff', color: '#6c757d', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                        <button onClick={handleQtySave} style={{ padding: '6px 18px', borderRadius: '7px', border: 'none', background: '#4361ee', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Save</button>
                                    </div>
                                </div>
                            )}

                            {/* Transfer to Another Bin */}
                            {(activeTab === 'transfer' && isEditingItem) && (
                                <div>
                                    <div style={{ marginBottom: '14px', padding: '10px 12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '12px', color: '#495057' }}>
                                        Moving <strong>{modalItem.stock_item.name}</strong> from <strong>BIN {binLabel}</strong>
                                    </div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', display: 'block', marginBottom: '5px' }}>Target Bin ID</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={targetBinId}
                                        onChange={e => setTargetBinId(e.target.value)}
                                        placeholder="Scan or enter bin ID"
                                        className="form-control form-control-sm"
                                        style={{ marginBottom: '12px' }}
                                        autoFocus
                                    />
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', display: 'block', marginBottom: '5px' }}>Quantity to Transfer</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={modalItem.qty}
                                        value={transferQty}
                                        onChange={e => {
                                            const v = e.target.value;
                                            if (v === '' || parseFloat(v) <= modalItem.qty) setTransferQty(v);
                                        }}
                                        className="form-control form-control-sm"
                                        style={{
                                            marginBottom: '4px',
                                            borderColor: transferQty && (parseFloat(transferQty) <= 0 || parseFloat(transferQty) > modalItem.qty) ? '#dc3545' : undefined,
                                        }}
                                    />
                                    <div style={{ fontSize: '10px', color: '#6c757d', marginBottom: '14px' }}>
                                        Available: <strong style={{ color: '#495057' }}>{modalItem.qty}</strong> units — cannot exceed this amount
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={closeModal} style={{ padding: '6px 16px', borderRadius: '7px', border: '1px solid #dee2e6', background: '#fff', color: '#6c757d', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                        <button
                                            onClick={handleTransfer}
                                            disabled={!targetBinId || !transferQty || parseFloat(transferQty) <= 0 || parseFloat(transferQty) > modalItem.qty}
                                            style={{
                                                padding: '6px 18px', borderRadius: '7px', border: 'none', fontSize: '12px', fontWeight: '700',
                                                background: (targetBinId && transferQty && parseFloat(transferQty) > 0 && parseFloat(transferQty) <= modalItem.qty) ? '#fd7e14' : '#ced4da',
                                                color: '#fff',
                                                cursor: (targetBinId && transferQty && parseFloat(transferQty) > 0 && parseFloat(transferQty) <= modalItem.qty) ? 'pointer' : 'not-allowed'
                                            }}
                                        >Transfer</button>
                                    </div>
                                </div>
                            )}

                            {/* Add New Material */}
                            {(activeTab === 'add' || modalItem === '__add__') && (
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', display: 'block', marginBottom: '5px' }}>Material</label>
                                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            value={matSearchTerm}
                                            onChange={e => handleMatInputChange(e.target.value)}
                                            onKeyDown={handleMatKeyDown}
                                            placeholder="Type 3+ letters or press Enter to search"
                                            className="form-control form-control-sm"
                                            style={{
                                                paddingRight: isSearchingMat ? '30px' : selectedMaterial ? '30px' : '10px',
                                                borderColor: selectedMaterial ? '#28a745' : undefined,
                                                boxShadow: selectedMaterial ? '0 0 0 2px #28a74533' : undefined,
                                            }}
                                            autoFocus
                                        />
                                        {isSearchingMat && (
                                            <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#6c757d' }}>⏳</span>
                                        )}
                                        {selectedMaterial && !isSearchingMat && (
                                            <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#28a745' }}>✓</span>
                                        )}
                                        {!isSearchingMat && matSearchTerm && !selectedMaterial && matResults.length === 0 && matSearchTerm.trim().length >= 3 && (
                                            <div style={{ marginTop: '4px', fontSize: '10px', color: '#adb5bd', fontWeight: '600' }}>No materials found</div>
                                        )}
                                        {showMatDropdown && matResults.length > 0 && (
                                            <div style={{
                                                position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, zIndex: 10010,
                                                backgroundColor: '#fff', border: '1.5px solid #dee2e6', borderRadius: '8px',
                                                maxHeight: '180px', overflowY: 'auto', boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                                            }}>
                                                {matResults.map((mat, idx) => (
                                                    <div
                                                        key={mat.id ?? idx}
                                                        onMouseDown={e => { e.preventDefault(); selectMaterial(mat); }}
                                                        style={{
                                                            padding: '8px 12px', cursor: 'pointer',
                                                            borderBottom: idx < matResults.length - 1 ? '1px solid #f1f3f5' : 'none',
                                                            transition: 'background 0.1s'
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f0ff'}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                                                    >
                                                        <div style={{ fontWeight: '700', fontSize: '12px', color: '#212529' }}>{mat.name}</div>
                                                        <div style={{ fontSize: '10px', color: '#6c757d', fontFamily: 'monospace', marginTop: '1px' }}>{mat.code}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', display: 'block', marginBottom: '5px' }}>Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newMatQty}
                                        onChange={e => setNewMatQty(e.target.value)}
                                        placeholder="Enter quantity"
                                        className="form-control form-control-sm"
                                        style={{ marginBottom: '14px' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button onClick={closeModal} style={{ padding: '6px 16px', borderRadius: '7px', border: '1px solid #dee2e6', background: '#fff', color: '#6c757d', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                        <button onClick={handleAdd} disabled={!selectedMaterial || !newMatQty} style={{ padding: '6px 18px', borderRadius: '7px', border: 'none', background: (selectedMaterial && newMatQty) ? '#28a745' : '#ced4da', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: (selectedMaterial && newMatQty) ? 'pointer' : 'not-allowed' }}>Add</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
            <div
                data-material-match={hasBinMatch ? 'true' : undefined}
                style={{
                    border: hasBinMatch ? '2.5px solid #6f42c1' : '2px solid #ced4da',
                    borderRadius: '10px',
                    width: '210px',
                    minWidth: '210px',
                    backgroundColor: hasBinMatch ? '#faf7ff' : '#f8f9fa',
                    overflow: 'hidden',
                    boxShadow: hasBinMatch
                        ? '0 0 0 3px #6f42c133, 0 2px 6px rgba(0,0,0,0.10)'
                        : '0 2px 6px rgba(0,0,0,0.10)',
                    flex: '0 0 auto',
                    transition: 'border-color 0.3s, box-shadow 0.3s'
                }}>
                {/* Bin Header */}
                <div style={{
                    background: hasBinMatch
                        ? 'linear-gradient(135deg, #4a2c7a, #6f42c1)'
                        : 'linear-gradient(135deg, #495057, #343a40)',
                    color: '#fff',
                    padding: '7px 12px',
                    fontWeight: '700',
                    fontSize: '12px',
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px'
                }}>
                    <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: '#adb5bd',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#212529',
                        flexShrink: 0
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#212529" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3h20l-2 5H4L2 3z" />
                            <path d="M4 8h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" />
                            <path d="M9 12h6" stroke="#adb5bd" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </span>
                    BIN {binLabel}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '500', color: '#adb5bd' }}>
                        {items ? items.length : 0} item{items && items.length !== 1 ? 's' : ''}
                    </span>
                    {canEdit && (
                        <button
                            onClick={openAddModal}
                            title="Add material to this bin"
                            style={{ marginLeft: '6px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', cursor: 'pointer', lineHeight: 1.4 }}
                        >＋</button>
                    )}
                </div>

                {/* Items */}
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items && items.length > 0 ? (
                        items.map((item) => {
                            const s = item.stock_item;
                            const mappedStatus = materialStatusMap ? materialStatusMap.get(s.id) : null;
                            const status = mappedStatus ? STATUS_STYLES[mappedStatus] : getStockStatus(item.qty, s.min_qty);
                            const isMatch = highlightedIds.length > 0 && highlightedIds.includes(s.id);
                            // Progress bar: caps at 100%, reference point is 2× min_qty = full bar
                            const pct = Math.min(100, Math.round((item.qty / Math.max(s.min_qty * 2, 1)) * 100));

                            return (
                                <div
                                    key={item.id}
                                    title={canEdit ? `Click to edit — Supplier: ${s.supplier || 'N/A'} | Lead Time: ${s.lead_time ?? 'N/A'} days | Unit Price: ${s.unit_price ?? 'N/A'}` : `Supplier: ${s.supplier || 'N/A'} | Lead Time: ${s.lead_time ?? 'N/A'} days | Unit Price: ${s.unit_price ?? 'N/A'}`}
                                    onClick={canEdit ? () => openItemModal(item) : undefined}
                                    style={{
                                        backgroundColor: isMatch ? '#f3eeff' : status.bg,
                                        border: isMatch ? '2px solid #6f42c1' : `1.5px solid ${status.borderColor}`,
                                        borderRadius: '7px',
                                        padding: '8px 10px',
                                        cursor: canEdit ? 'pointer' : 'default',
                                        transition: 'box-shadow 0.2s',
                                        boxShadow: isMatch ? '0 0 8px #6f42c155' : 'none'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = isMatch ? `0 0 14px #6f42c177` : `0 2px 10px ${status.color}44`}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = isMatch ? '0 0 8px #6f42c155' : 'none'}
                                >
                                    {/* Name row + Status badge */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                        <div style={{ flex: 1, minWidth: 0, paddingRight: '6px' }}>
                                            <div style={{
                                                fontWeight: '700',
                                                fontSize: '13px',
                                                color: isMatch ? '#4a0e8f' : '#212529',
                                                lineHeight: '1.2',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>{s.name}</div>
                                            <div style={{ fontSize: '10px', color: '#6c757d', fontFamily: 'monospace' }}>{s.code}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                                            {isMatch && (
                                                <span style={{
                                                    backgroundColor: '#6f42c1',
                                                    color: '#fff',
                                                    fontSize: '8px',
                                                    fontWeight: '800',
                                                    padding: '2px 6px',
                                                    borderRadius: '10px',
                                                    letterSpacing: '0.5px'
                                                }}>🔍 MATCH</span>
                                            )}
                                            <span style={{
                                                backgroundColor: status.color,
                                                color: '#fff',
                                                fontSize: '9px',
                                                fontWeight: '700',
                                                padding: '2px 7px',
                                                borderRadius: '10px',
                                                whiteSpace: 'nowrap',
                                                letterSpacing: '0.5px'
                                            }}>{status.label}</span>
                                        </div>
                                    </div>

                                    {/* Qty + Min label */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                                        <div>
                                            <span style={{ fontSize: '26px', fontWeight: '900', color: status.color, lineHeight: '1' }}>{item.qty}</span>
                                            <span style={{ fontSize: '10px', color: '#6c757d', marginLeft: '3px' }}>units</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: '#6c757d' }}>Min: <strong style={{ color: '#495057' }}>{s.min_qty}</strong></div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={{ height: '5px', backgroundColor: '#dee2e6', borderRadius: '3px', overflow: 'hidden', marginBottom: '7px' }}>
                                        <div style={{
                                            width: `${pct}%`,
                                            height: '100%',
                                            backgroundColor: status.barColor,
                                            borderRadius: '3px',
                                            transition: 'width 0.4s ease'
                                        }}></div>
                                    </div>

                                    {/* Size Badges */}
                                    {s.size && s.size.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                            {s.size.map((sz, i) => (
                                                <span key={i} style={{
                                                    fontSize: '9px',
                                                    padding: '1px 6px',
                                                    borderRadius: '3px',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#495057',
                                                    fontWeight: '600',
                                                    border: '1px solid #ced4da'
                                                }}>{sz}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: 'center', color: '#adb5bd', fontSize: '12px', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontSize: '24px', opacity: 0.5 }}>📦</div>
                            <span>Empty</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default WarehouseBinCard;
