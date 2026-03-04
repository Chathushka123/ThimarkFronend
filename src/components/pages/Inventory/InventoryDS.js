import React from 'react'
import { DropDown } from '../../../BASE/Components'
import WarehouseRack from '../../charts/WarehouseRack'

/**
 * Compute summary stats across all racks for the top summary bar
 */
function computeSummary(inventoryData) {
    let totalBins = 0, totalItems = 0, criticalItems = 0, lowItems = 0;
    (inventoryData || []).forEach(rack => {
        totalBins += rack.bins ? rack.bins.length : 0;
        (rack.bins || []).forEach(bin => {
            (bin.items || []).forEach(item => {
                totalItems++;
                const qty = item.qty;
                const min = item.stock_item.min_qty;
                if (qty <= min) criticalItems++;
                else if (qty <= min * 1.5) lowItems++;
            });
        });
    });
    return { totalBins, totalItems, criticalItems, lowItems };
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

export function generateInventoryDisplay(componentList, inventoryData, searchOptions = {}) {
    const {
        searchTerm = '', setSearchTerm = () => { },
        highlightedIds = [], isSearching = false,
        isFullscreen = false, toggleFullscreen = () => { }
    } = searchOptions;
    const summary = computeSummary(inventoryData);
    const hasData = inventoryData && inventoryData.length > 0;

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
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#495057', marginBottom: '4px', display: 'block' }}>
                                        Search Material (name / code)
                                    </label>
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
                            <div style={summaryCardStyle('#fff8f0', '#fd7e14')}>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fd7e14', lineHeight: 1 }}>{summary.lowItems}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>LOW STOCK</span>
                            </div>
                            <div style={summaryCardStyle('#fff5f5', '#dc3545')}>
                                <span style={{ fontSize: '28px', fontWeight: '900', color: '#dc3545', lineHeight: 1 }}>{summary.criticalItems}</span>
                                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>CRITICAL</span>
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
                            <div style={{
                                paddingBottom: '24px',
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 340px)',
                                paddingRight: '4px'
                            }}>
                                {inventoryData.map((rackData, index) => (
                                    <WarehouseRack
                                        key={rackData.rack}
                                        rack={rackData.rack}
                                        bins={rackData.bins}
                                        rackIndex={index}
                                        highlightedIds={highlightedIds}
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
                                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                                    {inventoryData.map((rackData, index) => (
                                        <WarehouseRack
                                            key={rackData.rack}
                                            rack={rackData.rack}
                                            bins={rackData.bins}
                                            rackIndex={index}
                                            highlightedIds={highlightedIds}
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
