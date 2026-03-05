import React from 'react'
import { DropDown } from '../../../BASE/Components'
import WarehouseRack from '../../charts/WarehouseRack'
import * as XLSX from 'xlsx'

/**
 * Compute summary stats across all racks for the top summary bar.
 * Status (Critical/Low/Healthy) is based on TOTAL qty across all bins for each unique material.
 */
function computeSummary(inventoryData) {
    let totalBins = 0;
    // Aggregate total qty per unique material
    const materialMap = new Map(); // stock_item.id -> { total_qty, min_qty }
    (inventoryData || []).forEach(rack => {
        totalBins += rack.bins ? rack.bins.length : 0;
        (rack.bins || []).forEach(bin => {
            (bin.items || []).forEach(item => {
                const id = item.stock_item.id;
                const existing = materialMap.get(id);
                if (existing) {
                    existing.total_qty += item.qty;
                } else {
                    materialMap.set(id, { total_qty: item.qty, min_qty: item.stock_item.min_qty });
                }
            });
        });
    });
    let criticalItems = 0, lowItems = 0;
    materialMap.forEach(({ total_qty, min_qty }) => {
        if (total_qty <= min_qty) criticalItems++;
        else if (total_qty <= min_qty * 1.5) lowItems++;
    });
    return { totalBins, totalItems: materialMap.size, criticalItems, lowItems };
}

const summaryCardStyle = (bg, color) => ({
    flex: '1 1 150px',
    backgroundColor: bg,
    border: `1.5px solid ${color}`,
    borderRadius: '10px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
});

/**
 * Deep-filter inventoryData so only items whose TOTAL qty (across all bins)
 * matches the active status filter are shown.
 * Removes empty bins and empty racks from the result.
 */
function filterInventoryData(inventoryData, activeFilter) {
    if (!activeFilter) return inventoryData;
    // Build aggregate qty map across all bins
    const materialMap = new Map(); // stock_item.id -> { total_qty, min_qty }
    (inventoryData || []).forEach(rack => {
        (rack.bins || []).forEach(bin => {
            (bin.items || []).forEach(item => {
                const id = item.stock_item.id;
                const existing = materialMap.get(id);
                if (existing) {
                    existing.total_qty += item.qty;
                } else {
                    materialMap.set(id, { total_qty: item.qty, min_qty: item.stock_item.min_qty });
                }
            });
        });
    });
    // Determine which material IDs match the filter based on aggregate qty
    const matchingIds = new Set();
    materialMap.forEach(({ total_qty, min_qty }, id) => {
        if (activeFilter === 'critical' && total_qty <= min_qty) matchingIds.add(id);
        if (activeFilter === 'low' && total_qty > min_qty && total_qty <= min_qty * 1.5) matchingIds.add(id);
    });
    return (inventoryData || []).map(rack => {
        const filteredBins = (rack.bins || []).map(bin => {
            const filteredItems = (bin.items || []).filter(item => matchingIds.has(item.stock_item.id));
            return { ...bin, items: filteredItems };
        }).filter(bin => bin.items.length > 0);
        return { ...rack, bins: filteredBins };
    }).filter(rack => rack.bins.length > 0);
}

/**
 * Builds a Map<stock_item.id, 'critical'|'low'|'healthy'> based on aggregated qty.
 */
function buildMaterialStatusMap(inventoryData) {
    const totals = new Map(); // id -> { total_qty, min_qty }
    (inventoryData || []).forEach(rack => {
        (rack.bins || []).forEach(bin => {
            (bin.items || []).forEach(item => {
                const id = item.stock_item.id;
                const existing = totals.get(id);
                if (existing) {
                    existing.total_qty += item.qty;
                } else {
                    totals.set(id, { total_qty: item.qty, min_qty: item.stock_item.min_qty });
                }
            });
        });
    });
    const statusMap = new Map();
    totals.forEach(({ total_qty, min_qty }, id) => {
        if (total_qty <= min_qty) statusMap.set(id, 'critical');
        else if (total_qty <= min_qty * 1.5) statusMap.set(id, 'low');
        else statusMap.set(id, 'healthy');
    });
    return statusMap;
}

function downloadExcel(inventoryData) {
    const rows = [];
    (inventoryData || []).forEach(rack => {
        (rack.bins || []).forEach(bin => {
            (bin.items || []).forEach(item => {
                const s = item.stock_item;
                const qty = item.qty;
                const min = s.min_qty;
                let status = 'Healthy';
                if (qty <= min) status = 'Critical';
                else if (qty <= min * 1.5) status = 'Low';
                rows.push({
                    Rack: rack.rack,
                    Bin: bin.bin,
                    'Material Name': s.name || '',
                    'Material Code': s.code || '',
                    Size: s.size || '',
                    Qty: qty,
                    'Min Qty': min,
                    Status: status,
                    Supplier: s.supplier || '',
                    'Unit Price': s.unit_price != null ? s.unit_price : '',
                    'Lead Time': s.lead_time || ''
                });
            });
        });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, 'inventory.xlsx');
}

export function generateInventoryDisplay(componentList, inventoryData, searchOptions = {}) {
    const {
        searchTerm = '', setSearchTerm = () => { },
        highlightedIds = [], isSearching = false,
        isFullscreen = false, toggleFullscreen = () => { },
        activeFilter = null, setActiveFilter = () => { }
    } = searchOptions;
    const summary = computeSummary(inventoryData);
    const hasData = inventoryData && inventoryData.length > 0;
    const displayData = filterInventoryData(inventoryData, activeFilter);
    const materialStatusMap = buildMaterialStatusMap(inventoryData);

    function toggleFilter(filter) {
        setActiveFilter(prev => prev === filter ? null : filter);
    }

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            <div className="page-header-wrp">
                <div className="title-breadcrumb-wrp">
                    <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                </div>
            </div>

            <div className="container-fluid custom-container-padding">

                {/* Warehouse selector + Material Search */}
                <div className="form-wrp background-white" style={{ marginBottom: '16px' }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row" style={{ alignItems: 'flex-end', gap: '0' }}>
                                <div className="form-group col-md-4">
                                    <DropDown item={componentList["inputWH"]} className="form-control form-control-sm" />
                                </div>
                                <div className="form-group col-md-4" style={{ marginLeft: '12px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', marginBottom: '4px', display: 'block' }}>Search Material (name / code)</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <span style={{
                                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                            color: isSearching ? '#6f42c1' : '#6c757d', fontSize: '14px', pointerEvents: 'none'
                                        }}>🔍</span>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Enter at least 3 letters"
                                            className="form-control form-control-sm"
                                            style={{
                                                paddingLeft: '32px',
                                                paddingRight: searchTerm ? '30px' : '10px',
                                                borderColor: highlightedIds.length > 0 ? '#6f42c1' : undefined,
                                                boxShadow: highlightedIds.length > 0 ? '0 0 0 2px #6f42c133' : undefined,
                                                transition: 'border-color 0.2s, box-shadow 0.2s'
                                            }}
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                style={{
                                                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: '#6c757d', fontSize: '14px', padding: '0', lineHeight: 1
                                                }}
                                                title="Clear search"
                                            >✕</button>
                                        )}
                                    </div>
                                    {searchTerm && !isSearching && (
                                        <div style={{ fontSize: '10px', marginTop: '3px', color: highlightedIds.length > 0 ? '#6f42c1' : '#adb5bd', fontWeight: '600' }}>
                                            {highlightedIds.length > 0
                                                ? `${highlightedIds.length} material${highlightedIds.length !== 1 ? 's' : ''} matched — bins highlighted below`
                                                : 'No materials found'}
                                        </div>
                                    )}
                                    {isSearching && (
                                        <div style={{ fontSize: '10px', marginTop: '3px', color: '#6f42c1', fontWeight: '600' }}>Searching…</div>
                                    )}
                                </div>
                                {hasData && (
                                    <div className="form-group" style={{ marginLeft: '12px', display: 'flex', alignItems: 'flex-end' }}>
                                        <button
                                            onClick={() => downloadExcel(inventoryData)}
                                            title="Download inventory as Excel"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                background: '#1d6f42', color: '#fff',
                                                border: 'none', borderRadius: '7px',
                                                padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                                                cursor: 'pointer', letterSpacing: '0.3px',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ⬇ Download Excel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {hasData && (
                    <>
                        {/* Summary Bar */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            <div style={summaryCardStyle('#eef2ff', '#4361ee')}>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#4361ee', lineHeight: 1 }}>{inventoryData.length}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>RACKS</span>
                            </div>
                            <div style={summaryCardStyle('#f0fff4', '#28a745')}>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#28a745', lineHeight: 1 }}>{summary.totalBins}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>BINS</span>
                            </div>
                            <div style={summaryCardStyle('#f8f9fa', '#495057')}>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#495057', lineHeight: 1 }}>{summary.totalItems}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>MATERIALS</span>
                            </div>
                            <div
                                onClick={() => toggleFilter('low')}
                                title="Click to filter Low Stock items"
                                style={{
                                    ...summaryCardStyle('#fff8f0', '#fd7e14'),
                                    cursor: 'pointer',
                                    outline: activeFilter === 'low' ? '3px solid #fd7e14' : 'none',
                                    boxShadow: activeFilter === 'low' ? '0 0 0 4px #fd7e1433' : undefined,
                                    transform: activeFilter === 'low' ? 'scale(1.04)' : undefined,
                                    transition: 'transform 0.15s, box-shadow 0.15s'
                                }}
                            >
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fd7e14', lineHeight: 1 }}>{summary.lowItems}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>LOW STOCK{activeFilter === 'low' ? ' ✓' : ''}</span>
                            </div>
                            <div
                                onClick={() => toggleFilter('critical')}
                                title="Click to filter Critical items"
                                style={{
                                    ...summaryCardStyle('#fff5f5', '#dc3545'),
                                    cursor: 'pointer',
                                    outline: activeFilter === 'critical' ? '3px solid #dc3545' : 'none',
                                    boxShadow: activeFilter === 'critical' ? '0 0 0 4px #dc354533' : undefined,
                                    transform: activeFilter === 'critical' ? 'scale(1.04)' : undefined,
                                    transition: 'transform 0.15s, box-shadow 0.15s'
                                }}
                            >
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#dc3545', lineHeight: 1 }}>{summary.criticalItems}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>CRITICAL{activeFilter === 'critical' ? ' ✓' : ''}</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginBottom: '16px',
                            padding: '10px 16px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#495057'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#28a745', display: 'inline-block' }}></span>
                                Healthy (qty &gt; 1.5× min)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#fd7e14', display: 'inline-block' }}></span>
                                Low (between min and 1.5× min)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#dc3545', display: 'inline-block' }}></span>
                                Critical (qty ≤ min)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#6f42c1', display: 'inline-block' }}></span>
                                Search match
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#adb5bd', fontWeight: '400', fontStyle: 'italic' }}>
                                Hover over a material card to see supplier &amp; pricing details
                            </span>
                        </div>

                        {/* Active filter indicator */}
                        {activeFilter && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                marginBottom: '8px', padding: '8px 14px',
                                backgroundColor: activeFilter === 'critical' ? '#fff5f5' : '#fff8f0',
                                border: `1.5px solid ${activeFilter === 'critical' ? '#dc3545' : '#fd7e14'}`,
                                borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                                color: activeFilter === 'critical' ? '#dc3545' : '#fd7e14'
                            }}>
                                <span>{activeFilter === 'critical' ? '🔴 Showing CRITICAL items only' : '🟠 Showing LOW STOCK items only'}</span>
                                <button
                                    onClick={() => setActiveFilter(null)}
                                    style={{
                                        marginLeft: 'auto', background: 'none', border: 'none',
                                        cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                                        color: activeFilter === 'critical' ? '#dc3545' : '#fd7e14',
                                        padding: '0 4px'
                                    }}
                                    title="Clear filter"
                                >✕ Clear filter</button>
                            </div>
                        )}

                        {/* Racks toolbar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <button
                                onClick={toggleFullscreen}
                                title="Full screen rack view"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    background: '#343a40', color: '#fff',
                                    border: 'none', borderRadius: '7px',
                                    padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                                    cursor: 'pointer', letterSpacing: '0.3px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                                }}
                            >
                                ⛶ Full Screen
                            </button>
                        </div>

                        {/* Racks — normal view */}
                        {!isFullscreen && (
                            <div className="scroll-thin" style={{
                                paddingBottom: '24px',
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 340px)',
                                paddingRight: '4px'
                            }}>
                                {displayData.map((rackData, index) => (
                                    <WarehouseRack
                                        key={rackData.rack}
                                        rack={rackData.rack}
                                        bins={rackData.bins}
                                        rackIndex={index}
                                        highlightedIds={highlightedIds}
                                        materialStatusMap={materialStatusMap}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Racks — fullscreen overlay */}
                        {isFullscreen && (
                            <div style={{
                                position: 'fixed', inset: 0, zIndex: 9999,
                                backgroundColor: '#f0f2f5',
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden'
                            }}>
                                {/* Fullscreen toolbar */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#212529',
                                    borderBottom: '2px solid #343a40',
                                    flexShrink: 0
                                }}>
                                    {/* Title */}
                                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px', marginRight: '8px', letterSpacing: '0.5px' }}>
                                        🏭 Rack View
                                    </span>

                                    {/* Legend pills */}
                                    {[['#28a745', 'Healthy'], ['#fd7e14', 'Low'], ['#dc3545', 'Critical'], ['#6f42c1', 'Match']].map(([c, l]) => (
                                        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#dee2e6', fontWeight: '600' }}>
                                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c, display: 'inline-block', flexShrink: 0 }}></span>
                                            {l}
                                        </span>
                                    ))}

                                    {/* Search bar */}
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                        <span style={{
                                            position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)',
                                            color: isSearching ? '#b58ef7' : '#adb5bd', fontSize: '13px', pointerEvents: 'none'
                                        }}>🔍</span>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Search material…"
                                            style={{
                                                paddingLeft: '30px', paddingRight: searchTerm ? '28px' : '10px',
                                                height: '32px', fontSize: '12px', borderRadius: '6px',
                                                border: highlightedIds.length > 0 ? '1.5px solid #6f42c1' : '1.5px solid #495057',
                                                backgroundColor: '#343a40', color: '#fff',
                                                outline: 'none', width: '220px',
                                                boxShadow: highlightedIds.length > 0 ? '0 0 0 2px #6f42c155' : 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s'
                                            }}
                                        />
                                        {searchTerm && (
                                            <button onClick={() => setSearchTerm('')} style={{
                                                position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#adb5bd', fontSize: '13px', padding: 0, lineHeight: 1
                                            }}>✕</button>
                                        )}
                                    </div>
                                    {searchTerm && !isSearching && (
                                        <span style={{ fontSize: '10px', color: highlightedIds.length > 0 ? '#b58ef7' : '#6c757d', fontWeight: '600' }}>
                                            {highlightedIds.length > 0 ? `${highlightedIds.length} matched` : 'No match'}
                                        </span>
                                    )}

                                    {/* Download Excel button */}
                                    <button
                                        onClick={() => downloadExcel(inventoryData)}
                                        title="Download inventory as Excel"
                                        style={{
                                            marginLeft: '8px', background: '#1d6f42', color: '#fff',
                                            border: 'none', borderRadius: '7px',
                                            padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                                        }}
                                    >
                                        ⬇ Excel
                                    </button>

                                    {/* Close button */}
                                    <button
                                        onClick={toggleFullscreen}
                                        title="Exit full screen"
                                        style={{
                                            marginLeft: '8px', background: '#dc3545', color: '#fff',
                                            border: 'none', borderRadius: '7px',
                                            padding: '6px 14px', fontSize: '12px', fontWeight: '700',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                                        }}
                                    >
                                        ✕ Exit
                                    </button>
                                </div>

                                {/* Scrollable racks area */}
                                <div className="scroll-thin" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                                    {displayData.map((rackData, index) => (
                                        <WarehouseRack
                                            key={rackData.rack}
                                            rack={rackData.rack}
                                            bins={rackData.bins}
                                            rackIndex={index}
                                            highlightedIds={highlightedIds}
                                            materialStatusMap={materialStatusMap}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!hasData && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1.5px dashed #dee2e6',
                        color: '#adb5bd'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏭</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: '#6c757d' }}>No inventory data</div>
                        <div style={{ fontSize: '13px' }}>Select a warehouse from the dropdown above to view inventory.</div>
                    </div>
                )}

            </div>
        </>
    )
}
