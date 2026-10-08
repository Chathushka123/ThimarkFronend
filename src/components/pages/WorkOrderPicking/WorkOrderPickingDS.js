import React from 'react'
import { TextBox, MultiSelectDropDown, Button, ControlCenter, IntegerField, PopUpPage } from '../../../BASE/Components'
import { QrScannerOverlay, decodeQrFromFile } from '../../../BASE/QrScanner'
import { WorkOrderSummaryPanel } from '../WorkOrder/WorkOrderDS'

function PickBundleCard({ bundle, isOpen }) {
    const details = Array.isArray(bundle.bundle_details) ? bundle.bundle_details : [];
    const pickedQty = details.reduce((sum, d) => sum + Number(d.qty || 0), 0);
    const trolly = bundle.trolly_master || null;

    return (
        <div className="col-md-6 col-lg-4 col-12 mb-4">
            <div className="card" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                background: 'white'
            }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}></div>
                <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <div style={{ fontSize: '11px', color: '#95a5a6', fontWeight: 600, textTransform: 'uppercase' }}>Bundle #{bundle.id}</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>
                                {bundle.size ? `Size ${bundle.size}` : 'No Size'} &mdash; Qty {bundle.qty}
                            </div>
                            <div style={{ fontSize: '12px', color: trolly ? '#2563eb' : '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                                <i className="fas fa-dolly mr-1"></i>
                                {trolly ? `${trolly.code} - ${trolly.name}` : 'No Trolley Assigned'}
                            </div>
                        </div>
                        <span style={{
                            backgroundColor: pickedQty >= bundle.qty ? '#d1fae5' : '#fef3c7',
                            color: pickedQty >= bundle.qty ? '#065f46' : '#92400e',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700
                        }}>
                            Picked {pickedQty}
                        </span>
                    </div>

                    {details.length === 0 && (
                        <div className="text-muted" style={{ fontSize: '13px' }}>No material picked yet.</div>
                    )}

                    {details.map((detail) => {
                        const stockMaterial = detail.stock_material || {};
                        const whlItem = detail.whl_item || {};
                        const location = whlItem.warehouse_location || {};
                        return (
                            <div key={detail.id} className="d-flex justify-content-between align-items-center mb-2" style={{
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                padding: '8px 12px'
                            }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                                        {stockMaterial.code ? `${stockMaterial.code} - ${stockMaterial.name}` : (stockMaterial.name || 'Material')}
                                    </div>
                                    <small style={{ color: '#64748b' }}>
                                        Qty {detail.qty}{location.rack || location.bin ? ` @ ${location.rack || ''} ${location.bin || ''}`.trim() : ''}
                                    </small>
                                </div>
                                {isOpen && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => { if (window.handleDeletePick) window.handleDeletePick(detail.id); }}
                                        style={{
                                            padding: '4px 10px',
                                            fontSize: '12px',
                                            borderRadius: '8px',
                                            backgroundColor: '#fff5f5',
                                            color: '#e53e3e',
                                            border: '1px solid #feb2b2',
                                            flexShrink: 0
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export function generateWorkOrderPickingDisplay(componentList, workOrder, qrState) {
    const isOpen = !!workOrder && workOrder.status === 'OPEN';
    const bundles = (workOrder && Array.isArray(workOrder.bundles)) ? workOrder.bundles : [];
    const canPick = isOpen && bundles.length > 0;
    const isFinalized = !!workOrder && workOrder.status === 'FINALIZED';
    const { showQrScanner, onQrScanSuccess, onQrScanClose } = qrState || {};

    // NOTE: every BASE component binds its setValue/setOptions functions onto
    // `item` on first mount, so fields are always rendered and hidden with CSS
    // instead of `{condition && (<Comp/>)}` (see WorkOrderDS for details).

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            {/* Live QR scanner overlay - scans a warehouse location's QR (its id) to auto-fill inputPickLocationId */}
            {showQrScanner && (
                <QrScannerOverlay onScan={onQrScanSuccess} onClose={onQrScanClose} />
            )}

            {/* Hidden file input - fallback when a live camera stream isn't available.
                capture="environment" opens the rear camera without extra browser permission. */}
            <input
                type="file"
                id="__qr_file_input__"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (onQrScanClose) onQrScanClose();
                        decodeQrFromFile(file, onQrScanSuccess);
                    }
                    e.target.value = "";
                }}
            />

            {/* Finalize Confirmation Popup */}
            <PopUpPage item={componentList["finalizeWorkOrderPopUp"]} headerText="Confirm Finalize" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#28a745' }}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{ color: '#3a4a6b' }}>Finalize Work Order</h5>
                    <p className="text-center mb-4" style={{ color: '#7b8eb5' }}>
                        This will generate production bundle tickets for every bundle and routing operation.<br />
                        You won't be able to add or remove bundles/picks after this.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-success mr-2" item={componentList["buttonFinalizeYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Finalize
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonFinalizeNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            {/* Reopen Confirmation Popup */}
            <PopUpPage item={componentList["reopenWorkOrderPopUp"]} headerText="Confirm Reopen" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-undo" style={{ fontSize: '48px', color: '#f59e0b' }}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{ color: '#3a4a6b' }}>Reopen Work Order</h5>
                    <p className="text-center mb-4" style={{ color: '#7b8eb5' }}>
                        This will remove the production bundle tickets so bundles/picks can be edited again.<br />
                        This isn't allowed once production scanning has started.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-warning mr-2" item={componentList["buttonReopenYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Reopen
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonReopenNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            {/* Delete Pick Confirmation Popup */}
            <PopUpPage item={componentList["deletePickPopUp"]} headerText="Confirm Remove" className="">
                <div className="p-4">
                    <TextBox item={componentList["inputDeletePickId"]} />
                    <div className="text-center mb-3">
                        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc3545' }}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{ color: '#3a4a6b' }}>Remove Picked Material</h5>
                    <p className="text-center mb-4" style={{ color: '#7b8eb5' }}>
                        This will return the picked quantity back to warehouse stock.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonDeletePickYes"]}>
                            <i className="fas fa-trash mr-1"></i> Yes, Remove
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonDeletePickNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            <ControlCenter item={componentList["CONTROL_CENTER"]} >
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    {/* Work Order Selector - always visible */}
                    <div className="form-wrp background-white mb-4 p-3 p-md-4 dropdown-host-card" style={{
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        border: '2px solid #e2e8f0'
                    }}>
                        <div className="form-group mb-2">
                            <label className="d-block" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', textTransform: 'uppercase' }}>
                                {componentList["inputSelectWorkOrder"].label.schema.value}
                            </label>
                            <MultiSelectDropDown item={componentList["inputSelectWorkOrder"]} className="form-control" />
                        </div>
                    </div>

                    {/* Work Order Details - always mounted, CSS-hidden until a work order is loaded */}
                    <div style={{ display: workOrder ? 'block' : 'none' }}>

                        {/* Header info */}
                        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <div className="row">
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                        height: '100%'
                                    }}>
                                        <small style={{ color: '#4c5fd5', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>
                                            <i className="fas fa-hashtag mr-1"></i>{componentList["inputWorkOrderId"].label.schema.value}
                                        </small>
                                        <TextBox
                                            item={componentList["inputWorkOrderId"]}
                                            className="form-control-plaintext"
                                            style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b', padding: 0, border: 'none', background: 'transparent' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                        height: '100%'
                                    }}>
                                        <small style={{ color: '#4c5fd5', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>
                                            <i className="fas fa-toggle-on mr-1"></i>{componentList["inputStatus"].label.schema.value}
                                        </small>
                                        <div>
                                            <span style={{
                                                display: 'inline-block',
                                                marginTop: '4px',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '13px',
                                                fontWeight: 700,
                                                backgroundColor: isOpen ? '#dbeafe' : '#d1fae5',
                                                color: isOpen ? '#1d4ed8' : '#065f46'
                                            }}>
                                                {componentList["inputStatus"].data.value}
                                            </span>
                                        </div>
                                        {/* Kept mounted (invisible) so the framework can bind setValue even though the styled span above is what's shown */}
                                        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                                            <TextBox item={componentList["inputStatus"]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <WorkOrderSummaryPanel workOrder={workOrder} />

                        {/* Pick Material - card always shown once a work order is loaded; the fields stay
                            mounted but are CSS-hidden (with the reason shown) unless open with at least one bundle */}
                        <div className="form-wrp background-white mb-4 p-3 p-md-4 dropdown-host-card" style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <h5 className="mb-3" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                                <i className="fas fa-barcode mr-2" style={{ color: '#3b82f6' }}></i>Pick Material
                            </h5>
                            {workOrder && !canPick && (
                                <div className="alert alert-warning mb-0" style={{ fontSize: '13px' }}>
                                    <i className="fas fa-info-circle mr-1"></i>
                                    {!isOpen
                                        ? `This work order is ${workOrder.status} - picking is only allowed while it is OPEN.`
                                        : 'This work order has no bundles yet - add bundles in Work Order Creation before picking.'}
                                </div>
                            )}
                            <div className="row" style={{ display: canPick ? 'flex' : 'none' }}>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputPickBundle"].label.schema.value}
                                        </label>
                                        <MultiSelectDropDown item={componentList["inputPickBundle"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputPickLocationId"].label.schema.value}
                                        </label>
                                        <div className="d-flex" style={{ gap: '8px' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <TextBox item={componentList["inputPickLocationId"]} className="form-control" />
                                            </div>
                                            <Button
                                                item={componentList["buttonScanLocation"]}
                                                className="btn btn-outline-primary"
                                                style={{ flexShrink: 0, padding: '0 14px' }}
                                            >
                                                <i className="fas fa-camera"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputPickStockMaterial"].label.schema.value}
                                        </label>
                                        <TextBox item={componentList["inputPickStockMaterial"]} className="form-control" disabled={true} readOnly={true} />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputPickWhlItem"].label.schema.value}
                                        </label>
                                        <MultiSelectDropDown item={componentList["inputPickWhlItem"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputPickQty"].label.schema.value}
                                        </label>
                                        <IntegerField item={componentList["inputPickQty"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12 d-flex align-items-end">
                                    <Button item={componentList["buttonAddPick"]} className="btn btn-primary w-100 mb-3">
                                        <i className="fas fa-plus mr-2"></i>{componentList["buttonAddPick"].schema.label}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bundles & picked material */}
                        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                <h5 className="mb-2" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                                    <i className="fas fa-boxes mr-2" style={{ color: '#3b82f6' }}></i>Bundles
                                </h5>
                                <span style={{
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 700
                                }}>
                                    {bundles.length} Bundle(s)
                                </span>
                            </div>

                            {bundles.length === 0 && (
                                <div className="text-center text-muted p-4">
                                    <i className="fas fa-inbox mb-2" style={{ fontSize: '32px' }}></i>
                                    <div>No bundles on this work order yet. Add bundles in Work Order Creation first.</div>
                                </div>
                            )}

                            <div className="row">
                                {bundles.map((bundle) => (
                                    <PickBundleCard key={bundle.id} bundle={bundle} isOpen={isOpen} />
                                ))}
                            </div>
                        </div>

                        {/* Finalize / Reopen */}
                        <div className="d-flex justify-content-end flex-wrap mb-4">
                            {componentList["buttonFinalize"].schema.visible && isOpen && bundles.length > 0 && (
                                <Button item={componentList["buttonFinalize"]} className="btn btn-success mr-2 mb-2">
                                    <i className="fas fa-check-double mr-2"></i>{componentList["buttonFinalize"].schema.label}
                                </Button>
                            )}
                            {componentList["buttonReopen"].schema.visible && isFinalized && (
                                <Button item={componentList["buttonReopen"]} className="btn btn-warning mb-2">
                                    <i className="fas fa-undo mr-2"></i>{componentList["buttonReopen"].schema.label}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </ControlCenter>
        </>
    )
}
