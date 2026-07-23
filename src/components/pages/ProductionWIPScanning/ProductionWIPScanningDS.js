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
    if (!direction) return null;
    const isIn = direction === 'IN';
    return (
        <span
            className={`badge ${isIn ? 'badge-success' : 'badge-primary'} ml-2`}
            style={{ fontSize: '11px', padding: '4px 8px' }}
        >
            {direction}
        </span>
    );
}

function TypeQtyBadge({ type, qty }) {
    const isReject = type === 'REJECT';
    return (
        <span
            className={`badge ${isReject ? 'badge-danger' : 'badge-success'}`}
            style={{ fontSize: '13px', padding: '6px 10px', minWidth: '70px', display: 'inline-block' }}
        >
            {isReject ? 'REJECT' : 'SCAN'} {qty}
        </span>
    );
}

export function generateProductionWIPScanningDisplay(componentList, state, handlers) {
    const {
        loadingOperations,
        operations,
        selectedOperation,
        showOperationPicker,
        loadingTeams,
        teams,
        selectedTeam,
        showTeamPicker,
        ticketCode,
        lookingUp,
        scanning,
        pendingScan,
        lastResult,
        recentScans,
        showQrScanner,
        scansToday,
        scanQtyInput,
        rejectQtyInput,
        rejectReasonInput
    } = state;

    const {
        scanInputRef,
        qtyInputRef,
        onTicketCodeChange,
        onTicketCodeKeyDown,
        onOpenCamera,
        onQrScanSuccess,
        onQrScanClose,
        onSelectOperation,
        onChangeOperationClick,
        onSelectTeam,
        onChangeTeamClick,
        onScanQtyChange,
        onRejectQtyChange,
        onRejectReasonChange,
        onQtyKeyDown,
        onConfirmScan,
        onCancelPendingScan,
        onUndoScan
    } = handlers;

    const enteredQty = (scanQtyInput === '' ? 0 : Number(scanQtyInput) || 0) + (rejectQtyInput === '' ? 0 : Number(rejectQtyInput) || 0);
    const overRemaining = pendingScan ? enteredQty > pendingScan.remaining : false;

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

                    {/* Team card */}
                    <div className="form-wrp background-white mb-3 p-3">
                        {loadingTeams && (
                            <div className="text-center py-3">
                                <i className="fas fa-spinner fa-spin mr-2"></i>Loading active shift teams&#8230;
                            </div>
                        )}

                        {!loadingTeams && teams.length === 0 && (
                            <div className="text-center py-4">
                                <i className="fas fa-people-arrows" style={{ fontSize: '40px', color: '#adb5bd' }}></i>
                                <h5 className="mt-3 mb-2">No active shift team</h5>
                                <p className="text-muted mb-0">
                                    There's no shift team active right now.<br />
                                    Ask your supervisor to set one up before scanning.
                                </p>
                            </div>
                        )}

                        {!loadingTeams && teams.length > 0 && !showTeamPicker && selectedTeam && (
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div>
                                    <small className="text-muted d-block">SHIFT TEAM</small>
                                    <span style={{ fontSize: '20px', fontWeight: 700 }}>{selectedTeam.team_code || selectedTeam.team_name}</span>
                                    {selectedTeam.shift_name && <span className="text-muted ml-2">{selectedTeam.shift_name}</span>}
                                </div>
                                {teams.length > 1 && (
                                    <button type="button" className="btn common-btn common-btn-lg btn-sm" onClick={onChangeTeamClick}>
                                        <i className="fas fa-exchange-alt mr-1"></i>Change
                                    </button>
                                )}
                            </div>
                        )}

                        {!loadingTeams && teams.length > 0 && (showTeamPicker || !selectedTeam) && (
                            <div>
                                <small className="text-muted d-block mb-2">SELECT YOUR SHIFT TEAM</small>
                                <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                                    {teams.map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            className="btn common-btn common-btn-lg"
                                            style={{ minHeight: '48px', minWidth: '160px' }}
                                            onClick={() => onSelectTeam(t)}
                                        >
                                            <strong>{t.team_code || t.team_name}</strong>
                                            {t.shift_name && <div style={{ fontSize: '12px' }}>{t.shift_name}</div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scan + recent scans */}
                    {!loadingOperations && selectedOperation && !showOperationPicker &&
                     !loadingTeams && selectedTeam && !showTeamPicker && (
                        <div className="row">
                            <div className="col-12 col-md-7 mb-3">
                                <div className="form-wrp background-white p-3">

                                    {!pendingScan && (
                                        <>
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
                                                disabled={lookingUp}
                                                autoComplete="off"
                                            />
                                            <button
                                                type="button"
                                                className="btn common-btn common-btn-lg btn-block mt-2"
                                                style={{ minHeight: '48px' }}
                                                onClick={onOpenCamera}
                                                disabled={lookingUp}
                                            >
                                                <i className="fas fa-camera mr-2"></i>Scan with Camera
                                            </button>

                                            {lookingUp && (
                                                <div className="text-muted text-center mt-2" style={{ fontSize: '13px' }}>
                                                    <i className="fas fa-spinner fa-spin mr-1"></i>Looking up bundle&#8230;
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {pendingScan && (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <small className="text-muted d-block">BUNDLE FOUND</small>
                                                    <span style={{ fontSize: '18px', fontWeight: 700 }}>#{pendingScan.bundleId}</span>
                                                    <DirectionBadge direction={pendingScan.direction} />
                                                </div>
                                                <span className="badge badge-light" style={{ fontSize: '12px' }}>
                                                    {pendingScan.remaining} due &middot; {pendingScan.operationLabel}
                                                </span>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-6 mb-2">
                                                    <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Scan Qty</label>
                                                    <input
                                                        ref={qtyInputRef}
                                                        type="number"
                                                        min="0"
                                                        className="form-control"
                                                        style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center' }}
                                                        value={scanQtyInput}
                                                        onChange={(e) => onScanQtyChange(e.target.value)}
                                                        onKeyDown={onQtyKeyDown}
                                                        disabled={scanning}
                                                    />
                                                </div>
                                                <div className="form-group col-6 mb-2">
                                                    <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Reject Qty</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="form-control"
                                                        style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center' }}
                                                        placeholder="0"
                                                        value={rejectQtyInput}
                                                        onChange={(e) => onRejectQtyChange(e.target.value)}
                                                        onKeyDown={onQtyKeyDown}
                                                        disabled={scanning}
                                                    />
                                                </div>
                                            </div>

                                            {rejectQtyInput && Number(rejectQtyInput) > 0 && (
                                                <div className="form-group mb-2">
                                                    <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>Reject Reason</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="e.g. Stitch defect"
                                                        value={rejectReasonInput}
                                                        onChange={(e) => onRejectReasonChange(e.target.value)}
                                                        onKeyDown={onQtyKeyDown}
                                                        disabled={scanning}
                                                    />
                                                </div>
                                            )}

                                            {overRemaining && (
                                                <div className="text-danger mb-2" style={{ fontSize: '12px' }}>
                                                    <i className="fas fa-exclamation-triangle mr-1"></i>
                                                    Only {pendingScan.remaining} left on this ticket.
                                                </div>
                                            )}

                                            <div className="d-flex" style={{ gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    className="btn common-btn common-btn-lg flex-grow-1"
                                                    style={{ minHeight: '48px' }}
                                                    onClick={onConfirmScan}
                                                    disabled={scanning || overRemaining}
                                                >
                                                    {scanning
                                                        ? <><i className="fas fa-spinner fa-spin mr-2"></i>Saving&#8230;</>
                                                        : <><i className="fas fa-check mr-2"></i>Confirm Scan</>}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    style={{ minHeight: '48px' }}
                                                    onClick={onCancelPendingScan}
                                                    disabled={scanning}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

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
                                                    {lastResult.scanQty > 0 && <> &middot; {lastResult.scanQty} scanned</>}
                                                    {lastResult.rejectQty > 0 && <> &middot; {lastResult.rejectQty} rejected</>}
                                                    {!lastResult.ticketComplete && lastResult.remainingAfter > 0 && (
                                                        <> &middot; {lastResult.remainingAfter} remaining on this step</>
                                                    )}
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
                                                key={`${scan.type}-${scan.id}`}
                                                className="d-flex justify-content-between align-items-center py-2"
                                                style={{ borderBottom: '1px solid #eee' }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>Bundle #{scan.bundle_id} <DirectionBadge direction={scan.direction} /></div>
                                                    <div className="text-muted" style={{ fontSize: '12px' }}>
                                                        {scan.operation_description || scan.operation_code} &middot; {scan.team_name} &middot; {formatTime(scan.scanned_at)}
                                                    </div>
                                                    {scan.type === 'REJECT' && scan.reject_reason && (
                                                        <div className="text-muted" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                                                            "{scan.reject_reason}"
                                                        </div>
                                                    )}
                                                    {canStillFix(scan.scanned_at) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0"
                                                            style={{ fontSize: '12px' }}
                                                            onClick={() => onUndoScan(scan)}
                                                        >
                                                            Wrong? Undo this entry
                                                        </button>
                                                    )}
                                                </div>
                                                <TypeQtyBadge type={scan.type} qty={scan.qty} />
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
