import React from 'react';
import { ControlCenter } from '../../../BASE/Components';
import { QrScannerOverlay, decodeQrFromFile } from '../../../BASE/QrScanner';

const EDIT_WINDOW_MS = 5 * 60 * 1000;

function formatTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function canStillFix(scannedAt) {
    if (!scannedAt) return false;
    const d = new Date(scannedAt);
    if (isNaN(d.getTime())) return false;
    return (Date.now() - d.getTime()) < EDIT_WINDOW_MS;
}

function DirectionBadge({ direction }) {
    const isIn = direction === 'IN';
    return (
        <span
            className={`badge ${isIn ? 'badge-success' : 'badge-primary'}`}
            style={{ fontSize: '13px', padding: '6px 10px', minWidth: '48px', display: 'inline-block' }}
        >
            {direction}
        </span>
    );
}

export function generateProductionWIPScanningDisplay(componentList, state, handlers) {
    const {
        loadingOperations,
        operations,
        selectedOperation,
        showOperationPicker,
        ticketCode,
        scanning,
        lastResult,
        recentScans,
        showQrScanner,
        scansToday
    } = state;

    const {
        scanInputRef,
        onTicketCodeChange,
        onTicketCodeKeyDown,
        onOpenCamera,
        onQrScanSuccess,
        onQrScanClose,
        onSelectOperation,
        onChangeOperationClick,
        onFixDirection
    } = handlers;

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            {showQrScanner && (
                <QrScannerOverlay onScan={onQrScanSuccess} onClose={onQrScanClose} />
            )}

            <input
                type="file"
                id="__qr_file_input__"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        onQrScanClose();
                        decodeQrFromFile(file, onQrScanSuccess);
                    }
                    e.target.value = "";
                }}
            />

            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1>{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                </div>

                <div className="container-fluid custom-container-padding">

                    {/* Station card */}
                    <div className="form-wrp background-white mb-3 p-3">
                        {loadingOperations && (
                            <div className="text-center py-3">
                                <i className="fas fa-spinner fa-spin mr-2"></i>Loading your assigned operations&#8230;
                            </div>
                        )}

                        {!loadingOperations && operations.length === 0 && (
                            <div className="text-center py-4">
                                <i className="fas fa-user-slash" style={{ fontSize: '40px', color: '#adb5bd' }}></i>
                                <h5 className="mt-3 mb-2">No operations assigned</h5>
                                <p className="text-muted mb-0">
                                    Your account isn't assigned to any scanning operation yet.<br />
                                    Contact your supervisor to get set up.
                                </p>
                            </div>
                        )}

                        {!loadingOperations && operations.length > 0 && !showOperationPicker && selectedOperation && (
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div>
                                    <small className="text-muted d-block">SCANNING STATION</small>
                                    <span style={{ fontSize: '20px', fontWeight: 700 }}>{selectedOperation.operation_code}</span>
                                    <span className="text-muted ml-2">{selectedOperation.description}</span>
                                </div>
                                {operations.length > 1 && (
                                    <button type="button" className="btn common-btn common-btn-lg btn-sm" onClick={onChangeOperationClick}>
                                        <i className="fas fa-exchange-alt mr-1"></i>Change
                                    </button>
                                )}
                            </div>
                        )}

                        {!loadingOperations && operations.length > 0 && (showOperationPicker || !selectedOperation) && (
                            <div>
                                <small className="text-muted d-block mb-2">SELECT YOUR OPERATION</small>
                                <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                                    {operations.map(op => (
                                        <button
                                            key={op.id}
                                            type="button"
                                            className="btn common-btn common-btn-lg"
                                            style={{ minHeight: '48px', minWidth: '160px' }}
                                            onClick={() => onSelectOperation(op)}
                                        >
                                            <strong>{op.operation_code}</strong>
                                            <div style={{ fontSize: '12px' }}>{op.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scan + recent scans */}
                    {!loadingOperations && selectedOperation && !showOperationPicker && (
                        <div className="row">
                            <div className="col-12 col-md-7 mb-3">
                                <div className="form-wrp background-white p-3">
                                    <label className="mb-2" style={{ fontWeight: 600 }}>
                                        <i className="fas fa-barcode mr-2"></i>Scan Bundle
                                    </label>
                                    <input
                                        ref={scanInputRef}
                                        type="text"
                                        className="form-control"
                                        style={{ fontSize: '18px', padding: '14px', minHeight: '54px', fontWeight: 600 }}
                                        placeholder="Scan or type bundle code, then press Enter"
                                        value={ticketCode}
                                        onChange={(e) => onTicketCodeChange(e.target.value)}
                                        onKeyDown={onTicketCodeKeyDown}
                                        disabled={scanning}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        className="btn common-btn common-btn-lg btn-block mt-2"
                                        style={{ minHeight: '48px' }}
                                        onClick={onOpenCamera}
                                        disabled={scanning}
                                    >
                                        <i className="fas fa-camera mr-2"></i>Scan with Camera
                                    </button>

                                    {scansToday > 0 && (
                                        <div className="text-muted text-center mt-2" style={{ fontSize: '13px' }}>
                                            {scansToday} scan{scansToday === 1 ? '' : 's'} this session
                                        </div>
                                    )}

                                    {lastResult && (
                                        <div
                                            className={`mt-3 p-3 ${lastResult.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}`}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <strong>{lastResult.message}</strong>
                                                {lastResult.direction && <DirectionBadge direction={lastResult.direction} />}
                                            </div>
                                            {lastResult.type === 'success' && (
                                                <div className="mt-1" style={{ fontSize: '13px' }}>
                                                    Bundle #{lastResult.bundleId} &middot; {lastResult.operationLabel}
                                                    {lastResult.progress && (
                                                        <> &middot; {lastResult.progress.completed}/{lastResult.progress.total} operations complete</>
                                                    )}
                                                    {lastResult.bundleComplete && (
                                                        <span className="badge badge-success ml-2">
                                                            <i className="fas fa-flag-checkered mr-1"></i>Route complete
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12 col-md-5 mb-3">
                                <div className="form-wrp background-white p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="mb-0" style={{ fontWeight: 600 }}>
                                            <i className="fas fa-history mr-2"></i>Recent Scans
                                        </label>
                                        <span className="badge badge-secondary">{recentScans.length}</span>
                                    </div>

                                    {recentScans.length === 0 && (
                                        <p className="text-muted mb-0" style={{ fontSize: '13px' }}>No scans yet.</p>
                                    )}

                                    <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                                        {recentScans.map(scan => (
                                            <div
                                                key={scan.bundle_ticket_id}
                                                className="d-flex justify-content-between align-items-center py-2"
                                                style={{ borderBottom: '1px solid #eee' }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>Bundle #{scan.bundle_id}</div>
                                                    <div className="text-muted" style={{ fontSize: '12px' }}>
                                                        {scan.operation_description || scan.operation_code} &middot; {formatTime(scan.scanned_at)}
                                                    </div>
                                                    {canStillFix(scan.scanned_at) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0"
                                                            style={{ fontSize: '12px' }}
                                                            onClick={() => onFixDirection(scan.bundle_ticket_id, scan.direction === 'IN' ? 'OUT' : 'IN')}
                                                        >
                                                            Wrong? Switch to {scan.direction === 'IN' ? 'OUT' : 'IN'}
                                                        </button>
                                                    )}
                                                </div>
                                                <DirectionBadge direction={scan.direction} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ControlCenter>
        </>
    );
}
