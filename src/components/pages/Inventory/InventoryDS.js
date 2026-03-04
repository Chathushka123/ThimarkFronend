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

export function generateInventoryDisplay(componentList, inventoryData) {
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

                {/* Warehouse selector */}
                <div className="form-wrp background-white" style={{ marginBottom: '16px' }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <DropDown item={componentList["inputWH"]} className="form-control form-control-sm" />
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
                            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#adb5bd', fontWeight: '400', fontStyle: 'italic' }}>
                                Hover over a material card to see supplier &amp; pricing details
                            </span>
                        </div>

                        {/* Racks */}
                        <div style={{ paddingBottom: '24px' }}>
                            {inventoryData.map((rackData, index) => (
                                <WarehouseRack
                                    key={rackData.rack}
                                    rack={rackData.rack}
                                    bins={rackData.bins}
                                    rackIndex={index}
                                />
                            ))}
                        </div>
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
