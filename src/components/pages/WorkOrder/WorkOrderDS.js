import React from 'react'
import { TextBox, MultiSelectDropDown, Button, ControlCenter, IntegerField, PopUpPage } from '../../../BASE/Components'

function InfoTile({ icon, label, value, color = '#4c5fd5' }) {
    return (
        <div className="col-md-3 col-6 mb-3">
            <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px 14px',
                height: '100%'
            }}>
                <small style={{ color, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {icon ? <i className={`fas ${icon} mr-1`}></i> : null}{label}
                </small>
                <div style={{ color: '#1e293b', fontWeight: 700, fontSize: '15px', marginTop: '2px', wordBreak: 'break-word' }}>
                    {value === "" || value === null || typeof value === 'undefined' ? '-' : value}
                </div>
            </div>
        </div>
    )
}

function WorkOrderSummaryPanel({ workOrder }) {
    if (!workOrder) return null;
    const batchDetail = workOrder.batch_detail || {};
    const batch = batchDetail.batch || {};
    const model = batchDetail.model || {};
    const mainModel = model.main_model || {};
    const routeMaster = model.route_master || {};

    return (
        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0'
        }}>
            <h5 className="mb-3" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                <i className="fas fa-info-circle mr-2" style={{ color: '#3b82f6' }}></i>Batch &amp; Model Details
            </h5>
            <div className="row">
                <InfoTile icon="fa-layer-group" label="Batch No" value={batch.batch_no} />
                <InfoTile icon="fa-tshirt" label="Model" value={model.name} />
                <InfoTile icon="fa-tag" label="Main Model" value={mainModel.name} />
                <InfoTile icon="fa-route" label="Route Code" value={routeMaster.route_code} />
                <InfoTile icon="fa-sort-numeric-up" label="Batch Detail Qty" value={batchDetail.quantity} />
                <InfoTile icon="fa-palette" label="Color" value={model.color} />
            </div>
        </div>
    )
}

function RoutingOperationsPanel({ workOrder }) {
    if (!workOrder || !Array.isArray(workOrder.work_order_operations) || workOrder.work_order_operations.length === 0) return null;

    return (
        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '2px solid #e2e8f0'
        }}>
            <h5 className="mb-3" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                <i className="fas fa-project-diagram mr-2" style={{ color: '#3b82f6' }}></i>Routing Operations
            </h5>
            <div style={{ overflowX: 'auto' }}>
                <table className="table table-sm table-striped mb-0">
                    <thead>
                        <tr>
                            <th>Seq</th>
                            <th>Operation Code</th>
                            <th>Description</th>
                            <th>SMV</th>
                            <th>In</th>
                            <th>Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrder.work_order_operations.map((woo) => {
                            const rom = woo.routing_operation_master || {};
                            const operation = rom.operation || {};
                            return (
                                <tr key={woo.id}>
                                    <td>{rom.seq}</td>
                                    <td>{operation.operation_code}</td>
                                    <td>{operation.description}</td>
                                    <td>{woo.smv}</td>
                                    <td>{rom.in ? <i className="fas fa-check text-success"></i> : <i className="fas fa-minus text-muted"></i>}</td>
                                    <td>{rom.out ? <i className="fas fa-check text-success"></i> : <i className="fas fa-minus text-muted"></i>}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function BundleCard({ bundle, isOpen }) {
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
                        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
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
                            {isOpen && (
                                <button
                                    className="btn btn-sm"
                                    onClick={() => { if (window.handleEditBundle) window.handleEditBundle(bundle); }}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: '#eff6ff',
                                        color: '#2563eb',
                                        border: '1px solid #bfdbfe',
                                        flexShrink: 0
                                    }}
                                >
                                    <i className="fas fa-pen"></i>
                                </button>
                            )}
                        </div>
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

export function generateWorkOrderDisplay(componentList, workOrder) {
    const isOpen = !!workOrder && workOrder.status === 'OPEN';
    const isFinalized = !!workOrder && workOrder.status === 'FINALIZED';
    const bundles = (workOrder && Array.isArray(workOrder.bundles)) ? workOrder.bundles : [];

    // NOTE: every BASE component (TextBox/DropDown/IntegerField/...) binds its
    // setValue/setOptions/reRender functions onto `item` the first time it
    // mounts. If a section is hidden with `{condition && (<Comp/>)}` React
    // unmounts it and those bindings are lost, so any later code that calls
    // `.setValue()`/`.setOptions()` on that item throws "is not a function".
    // Every field below is therefore always rendered; visibility is toggled
    // with CSS (style={{ display: ... }}) on a wrapping element instead.

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

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

            {/* Edit Bundle Popup */}
            <PopUpPage item={componentList["editBundlePopUp"]} headerText="Edit Bundle" className="">
                <div className="p-4">
                    <TextBox item={componentList["inputEditBundleId"]} />
                    <div className="form-group">
                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                            {componentList["inputEditBundleSize"].label.schema.value}
                        </label>
                        <TextBox item={componentList["inputEditBundleSize"]} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                            {componentList["inputEditBundleQty"].label.schema.value}
                        </label>
                        <IntegerField item={componentList["inputEditBundleQty"]} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                            {componentList["inputEditBundleTrolly"].label.schema.value} <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <MultiSelectDropDown item={componentList["inputEditBundleTrolly"]} className="form-control" />
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <Button className="btn btn-primary mr-2" item={componentList["buttonEditBundleSave"]}>
                            <i className="fas fa-save mr-1"></i> Save
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonEditBundleCancel"]}>
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
                    <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        border: '2px solid #e2e8f0'
                    }}>
                        <div className="row align-items-end">
                            <div className="col-md-8 col-12">
                                <div className="form-group mb-2">
                                    <label className="d-block" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', textTransform: 'uppercase' }}>
                                        {componentList["inputSelectWorkOrder"].label.schema.value}
                                    </label>
                                    <MultiSelectDropDown item={componentList["inputSelectWorkOrder"]} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4 col-12 mb-2">
                                <Button item={componentList["buttonNewWorkOrder"]} className="btn btn-outline-secondary w-100">
                                    <i className="fas fa-plus mr-2"></i>{componentList["buttonNewWorkOrder"].schema.label}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Create New Work Order - always mounted, CSS-hidden once a work order is loaded */}
                    <div style={{ display: !workOrder ? 'block' : 'none' }}>
                        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <h5 className="mb-3" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                                <i className="fas fa-plus-circle mr-2" style={{ color: '#3b82f6' }}></i>Create Work Order
                            </h5>
                            <div className="row align-items-end">
                                <div className="col-md-8 col-12">
                                    <div className="form-group mb-2">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '13px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputBatchDetail"].label.schema.value}
                                        </label>
                                        <MultiSelectDropDown item={componentList["inputBatchDetail"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4 col-12 mb-2">
                                    <Button item={componentList["buttonCreateWorkOrder"]} className="btn btn-primary w-100">
                                        <i className="fas fa-save mr-2"></i>{componentList["buttonCreateWorkOrder"].schema.label}
                                    </Button>
                                </div>
                            </div>
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
                        <RoutingOperationsPanel workOrder={workOrder} />

                        {/* Bundles */}
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

                            <div className="row align-items-end mb-4" style={{ display: isOpen ? 'flex' : 'none' }}>
                                <div className="col-md-3 col-12">
                                    <div className="form-group mb-2">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputBundleSize"].label.schema.value}
                                        </label>
                                        <TextBox item={componentList["inputBundleSize"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-3 col-12">
                                    <div className="form-group mb-2">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputBundleQty"].label.schema.value}
                                        </label>
                                        <IntegerField item={componentList["inputBundleQty"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-3 col-12">
                                    <div className="form-group mb-2">
                                        <label className="d-block" style={{ fontWeight: 700, fontSize: '12px', color: '#4a5568', textTransform: 'uppercase' }}>
                                            {componentList["inputBundleTrolly"].label.schema.value} <span style={{ color: '#e53e3e' }}>*</span>
                                        </label>
                                        <MultiSelectDropDown item={componentList["inputBundleTrolly"]} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-3 col-12 mb-2">
                                    <Button item={componentList["buttonAddBundle"]} className="btn btn-primary w-100">
                                        <i className="fas fa-plus mr-2"></i>{componentList["buttonAddBundle"].schema.label}
                                    </Button>
                                </div>
                            </div>

                            {bundles.length === 0 && (
                                <div className="text-center text-muted p-4">
                                    <i className="fas fa-inbox mb-2" style={{ fontSize: '32px' }}></i>
                                    <div>No bundles added yet.</div>
                                </div>
                            )}

                            <div className="row">
                                {bundles.map((bundle) => (
                                    <BundleCard key={bundle.id} bundle={bundle} isOpen={isOpen} />
                                ))}
                            </div>
                        </div>

                        {/* Pick Material - always mounted, CSS-hidden unless open with at least one bundle */}
                        <div className="form-wrp background-white mb-4 p-3 p-md-4" style={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0',
                            display: (isOpen && bundles.length > 0) ? 'block' : 'none'
                        }}>
                            <h5 className="mb-3" style={{ color: '#1e293b', fontWeight: 800, fontSize: '17px' }}>
                                <i className="fas fa-barcode mr-2" style={{ color: '#3b82f6' }}></i>Pick Material
                            </h5>
                            <div className="row">
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
                                        <TextBox item={componentList["inputPickLocationId"]} className="form-control" />
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
