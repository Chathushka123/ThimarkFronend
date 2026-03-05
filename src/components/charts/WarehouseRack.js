import React from 'react';
import WarehouseBinCard from './WarehouseBinCard';

// Distinct accent colours per rack (cycles if > 8 racks)
const RACK_COLORS = ['#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#007bff', '#6c757d'];

/**
 * WarehouseRack
 * Props:
 *   - rack      {string}   : Rack identifier label (e.g. "A", "B")
 *   - bins      {Array}    : Array of bin objects
 *                            Each bin: { id, bin, items: [...] }
 *   - rackIndex {number}   : Index used to pick accent colour (optional, defaults to 0)
 */
const WarehouseRack = ({ rack, bins, rackIndex = 0, highlightedIds = [] }) => {
    const accentColor = RACK_COLORS[rackIndex % RACK_COLORS.length];

    // Summarise this rack for the sub-header
    const totalItems = bins.reduce((acc, b) => acc + (b.items ? b.items.length : 0), 0);
    const criticalCount = bins.reduce((acc, b) => {
        if (!b.items) return acc;
        return acc + b.items.filter(item => item.qty <= item.stock_item.min_qty).length;
    }, 0);
    const lowCount = bins.reduce((acc, b) => {
        if (!b.items) return acc;
        return acc + b.items.filter(item => {
            const { qty } = item;
            const min = item.stock_item.min_qty;
            return qty > min && qty <= min * 1.5;
        }).length;
    }, 0);

    // Count how many bins in this rack contain at least one highlighted item
    const matchedBinCount = highlightedIds.length > 0
        ? bins.filter(b => b.items && b.items.some(item => highlightedIds.includes(item.stock_item.id))).length
        : 0;

    return (
        <div style={{
            marginBottom: '20px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #dee2e6',
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.07)'
        }}>
            {/* Rack Header */}
            <div style={{
                background: 'linear-gradient(135deg, #2d3436, #343a40)',
                color: '#fff',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderLeft: `5px solid ${accentColor}`
            }}>
                {/* Rack Badge */}
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: accentColor,
                    color: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '20px',
                    flexShrink: 0,
                    boxShadow: `0 2px 6px ${accentColor}88`
                }}>{rack}</div>

                {/* Rack Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', letterSpacing: '1px' }}>RACK {rack}</div>
                    <div style={{ fontSize: '11px', color: '#adb5bd', marginTop: '2px' }}>
                        {bins.length} bin{bins.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {totalItems} material{totalItems !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Inline status pills on rack header */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {criticalCount > 0 && (
                        <span style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            ⚠ {criticalCount} Critical
                        </span>
                    )}
                    {lowCount > 0 && (
                        <span style={{
                            backgroundColor: '#fd7e14',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            ↓ {lowCount} Low
                        </span>
                    )}
                    {matchedBinCount > 0 && (
                        <span style={{
                            backgroundColor: '#6f42c1',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            animation: 'pulse-search 1.4s ease-in-out infinite'
                        }}>
                            🔍 {matchedBinCount} bin{matchedBinCount !== 1 ? 's' : ''} matched
                        </span>
                    )}
                </div>
            </div>

            {/* Bins Row */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                padding: '16px 20px',
                backgroundColor: '#fdfdfd'
            }}>
                {bins && bins.length > 0 ? (
                    bins.map((bin) => (
                        <WarehouseBinCard
                            key={bin.id}
                            binLabel={bin.bin}
                            items={bin.items}
                            highlightedIds={highlightedIds}
                        />
                    ))
                ) : (
                    <div style={{ color: '#adb5bd', fontSize: '13px', padding: '12px 0' }}>No bins in this rack.</div>
                )}
            </div>
        </div>
    );
};

export default WarehouseRack;
