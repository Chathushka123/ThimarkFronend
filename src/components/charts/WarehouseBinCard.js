import React from 'react';

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
const WarehouseBinCard = ({ binLabel, items }) => {
    return (
        <div style={{
            border: '2px solid #ced4da',
            borderRadius: '10px',
            width: '210px',
            minWidth: '210px',
            backgroundColor: '#f8f9fa',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
            flex: '0 0 auto'
        }}>
            {/* Bin Header */}
            <div style={{
                background: 'linear-gradient(135deg, #495057, #343a40)',
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
                    {binLabel}
                </span>
                BIN {binLabel}
                <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '500', color: '#adb5bd' }}>
                    {items ? items.length : 0} item{items && items.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Items */}
            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items && items.length > 0 ? (
                    items.map((item) => {
                        const s = item.stock_item;
                        const status = getStockStatus(item.qty, s.min_qty);
                        // Progress bar: caps at 100%, reference point is 2× min_qty = full bar
                        const pct = Math.min(100, Math.round((item.qty / Math.max(s.min_qty * 2, 1)) * 100));

                        return (
                            <div
                                key={item.id}
                                title={`Supplier: ${s.supplier || 'N/A'} | Lead Time: ${s.lead_time ?? 'N/A'} days | Unit Price: ${s.unit_price ?? 'N/A'}`}
                                style={{
                                    backgroundColor: status.bg,
                                    border: `1.5px solid ${status.borderColor}`,
                                    borderRadius: '7px',
                                    padding: '8px 10px',
                                    cursor: 'default',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 2px 10px ${status.color}44`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                {/* Name row + Status badge */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                    <div style={{ flex: 1, minWidth: 0, paddingRight: '6px' }}>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            color: '#212529',
                                            lineHeight: '1.2',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>{s.name}</div>
                                        <div style={{ fontSize: '10px', color: '#6c757d', fontFamily: 'monospace' }}>{s.code}</div>
                                    </div>
                                    <span style={{
                                        backgroundColor: status.color,
                                        color: '#fff',
                                        fontSize: '9px',
                                        fontWeight: '700',
                                        padding: '2px 7px',
                                        borderRadius: '10px',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '0.5px',
                                        flexShrink: 0
                                    }}>{status.label}</span>
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
    );
};

export default WarehouseBinCard;
