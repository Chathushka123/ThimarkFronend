import React from 'react';
import { ControlCenter } from '../../../BASE/Components';
import { QrScannerOverlay, decodeQrFromFile } from '../../../BASE/QrScanner';

const EDIT_WINDOW_MS = 5 * 60 * 1000;

// Single, restrained palette. Color is reserved for things that are genuinely
// a different state (reject, error, success) — everything else (labels,
// choices, counts) is neutral ink/gray so the page reads calm, not busy.
const C = {
    border: '#dfe3e8',
    ink: '#2b2f36',
    muted: '#6c757d',
    faint: '#c2c7cf',
    subtleBg: '#f7f8fa',
    accent: '#5b6b8c',
    danger: '#d9363e',
    dangerBg: '#fdf2f2',
    dangerBorder: '#f3b4b8',
    success: '#2f9e44',
    successBg: '#f1faf3',
    successBorder: '#b7e4c0',
    amber: '#e8a33d',
    amberBg: '#fdf6ec',
    amberBorder: '#f2d4a3'
};

const card = {
    background: '#fff',
    border: `1px solid ${C.border}`,
    borderRadius: '4px'
};

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

// Tells the operator where the qty they're about to scan actually came
// from: a different upstream operation/direction, this same operation's
// own IN step, or the bundle itself if this is the route's first step.
function formatPreviousStep(previousStep) {
    if (!previousStep) {
        return 'Source: bundle start (first step on this route)';
    }
    const label = previousStep.operation_description || previousStep.operation_code;
    const who = previousStep.same_operation ? "this step's own" : label;
    const suffix = previousStep.same_operation ? '' : ` (${previousStep.operation_code})`;
    return `Source: ${who}${suffix} ${previousStep.direction} — ${previousStep.released} released so far`;
}

// Direction is conveyed by the label itself (IN / OUT), not by color —
// keeps the two directions from competing for the operator's attention.
function DirectionBadge({ direction }) {
    if (!direction) return null;
    return (
        <span
            className="ml-2"
            style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                padding: '2px 7px',
                borderRadius: '3px',
                border: `1px solid ${C.border}`,
                color: C.muted,
                background: C.subtleBg
            }}
        >
            {direction}
        </span>
    );
}

// Color carries real meaning here: red = permanently bad, amber = pending
// (still in rework), green = a good outcome (a normal scan or a good return).
function TypeQtyBadge({ type, qty }) {
    const tone = {
        REJECT: { color: C.danger, bg: C.dangerBg, border: C.dangerBorder },
        REWORK: { color: C.amber, bg: C.amberBg, border: C.amberBorder },
        REWORK_RETURN: { color: C.success, bg: C.successBg, border: C.successBorder }
    }[type] || { color: C.success, bg: C.successBg, border: C.successBorder };
    const label = { REJECT: 'REJECT', REWORK: 'REWORK', REWORK_RETURN: 'REWORK RETURN' }[type] || 'SCAN';
    return (
        <span
            style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 9px',
                borderRadius: '3px',
                border: `1px solid ${tone.border}`,
                color: tone.color,
                background: tone.bg,
                minWidth: '92px',
                display: 'inline-block',
                textAlign: 'center'
            }}
        >
            {label} {qty}
        </span>
    );
}

function CountChip({ count }) {
    return (
        <span
            style={{
                fontSize: '12px',
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '1px 9px'
            }}
        >
            {count}
        </span>
    );
}

// Shared "select one of these" pattern used by both the operation and the
// shift-team cards: loading / empty / selected-summary / choice-grid states,
// all sharing one calm visual style instead of four hand-styled blocks.
function PickerCard({
    sectionLabel, loading, loadingLabel, items, selected, showPicker,
    onSelect, onChangeClick, itemLabel, itemSub, selectedLabel, selectedSub,
    emptyIcon, emptyTitle, emptyBody
}) {
    return (
        <div className="p-3 mb-3" style={card}>
            {loading && (
                <div className="text-center py-3" style={{ color: C.muted, fontSize: '13px' }}>
                    <i className="fas fa-spinner fa-spin mr-2"></i>{loadingLabel}
                </div>
            )}

            {!loading && items.length === 0 && (
                <div className="text-center py-4">
                    <i className={emptyIcon} style={{ fontSize: '32px', color: C.faint }}></i>
                    <h6 className="mt-3 mb-1" style={{ color: C.ink }}>{emptyTitle}</h6>
                    <p className="mb-0" style={{ color: C.muted, fontSize: '13px' }}>{emptyBody}</p>
                </div>
            )}

            {!loading && items.length > 0 && !showPicker && selected && (
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <small style={{ color: C.muted, letterSpacing: '0.4px' }}>{sectionLabel}</small>
                        <div>
                            <span style={{ fontSize: '18px', fontWeight: 600, color: C.ink }}>{selectedLabel(selected)}</span>
                            {selectedSub(selected) && (
                                <span className="ml-2" style={{ color: C.muted, fontSize: '13px' }}>{selectedSub(selected)}</span>
                            )}
                        </div>
                    </div>
                    {items.length > 1 && (
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onChangeClick}>
                            Change
                        </button>
                    )}
                </div>
            )}

            {!loading && items.length > 0 && (showPicker || !selected) && (
                <div>
                    <small className="d-block mb-2" style={{ color: C.muted, letterSpacing: '0.4px' }}>{sectionLabel}</small>
                    <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                        {items.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                className="btn btn-outline-secondary text-left"
                                style={{ minHeight: '46px', minWidth: '150px', borderColor: C.border }}
                                onClick={() => onSelect(item)}
                            >
                                <strong style={{ color: C.ink }}>{itemLabel(item)}</strong>
                                {itemSub(item) && <div style={{ fontSize: '12px', color: C.muted }}>{itemSub(item)}</div>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ReworkStationBody(state, handlers) {
    const { outstandingRework, loadingOutstandingRework, returnInputs, submittingReturnId } = state;
    const { onReturnInputChange, onReturnFromRework } = handlers;

    return (
        <div className="p-3" style={card}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="mb-0" style={{ fontWeight: 600, color: C.ink }}>
                    Outstanding Rework
                </label>
                <CountChip count={outstandingRework.length} />
            </div>

            {loadingOutstandingRework && (
                <div className="text-center py-3" style={{ color: C.muted, fontSize: '13px' }}>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Loading&#8230;
                </div>
            )}

            {!loadingOutstandingRework && outstandingRework.length === 0 && (
                <div className="text-center py-4">
                    <i className="fas fa-check-circle" style={{ fontSize: '32px', color: C.success }}></i>
                    <h6 className="mt-3 mb-0" style={{ color: C.ink }}>Nothing waiting on rework</h6>
                </div>
            )}

            {outstandingRework.map(row => {
                const inputs = returnInputs[row.bundle_ticket_id] || {};
                const submitting = submittingReturnId === row.bundle_ticket_id;
                return (
                    <div key={row.bundle_ticket_id} className="p-2 mb-2" style={{ border: `1px solid ${C.border}`, borderRadius: '4px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <strong style={{ color: C.ink }}>Bundle #{row.bundle_id}</strong>
                                <DirectionBadge direction={row.direction} />
                                <div style={{ fontSize: '12px', color: C.muted }}>
                                    {row.operation_description || row.operation_code}
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', color: C.amber, fontWeight: 600 }}>
                                {row.outstanding_qty} outstanding
                            </span>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-6 mb-2">
                                <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.success }}>Return Qty (good)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    style={{ color: C.success, borderColor: inputs.returnQty ? C.successBorder : C.border }}
                                    value={inputs.returnQty || ''}
                                    onChange={(e) => onReturnInputChange(row.bundle_ticket_id, 'returnQty', e.target.value)}
                                    disabled={submitting}
                                />
                            </div>
                            <div className="form-group col-6 mb-2">
                                <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.danger }}>Reject Qty (still bad)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    style={{ color: C.danger, borderColor: inputs.rejectQty ? C.dangerBorder : C.border }}
                                    value={inputs.rejectQty || ''}
                                    onChange={(e) => onReturnInputChange(row.bundle_ticket_id, 'rejectQty', e.target.value)}
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        {Number(inputs.rejectQty) > 0 && (
                            <div className="form-group mb-2">
                                <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.danger }}>Reject Reason</label>
                                <select
                                    className="form-control"
                                    value={inputs.reasonId || ''}
                                    onChange={(e) => onReturnInputChange(row.bundle_ticket_id, 'reasonId', e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">Select a reason&#8230;</option>
                                    {(state.rejectReasons || []).concat(state.reworkReasons || []).map(r => (
                                        <option key={r.id} value={r.id}>{r.description}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="button"
                            className="btn common-btn common-btn-lg btn-block"
                            disabled={submitting}
                            onClick={() => onReturnFromRework(row)}
                        >
                            {submitting ? 'Saving…' : 'Record Return'}
                        </button>
                    </div>
                );
            })}
        </div>
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
        rejectReasonId,
        reworkQtyInput,
        reworkReasonId,
        rejectReasons,
        reworkReasons,
        isReworkStation
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
        onReworkQtyChange,
        onReworkReasonChange,
        onQtyKeyDown,
        onConfirmScan,
        onCancelPendingScan,
        onUndoScan,
        onSwitchDirection,
        onEditLastScan,
        onDeleteLastScan
    } = handlers;

    const enteredQty = (scanQtyInput === '' ? 0 : Number(scanQtyInput) || 0)
        + (rejectQtyInput === '' ? 0 : Number(rejectQtyInput) || 0)
        + (reworkQtyInput === '' ? 0 : Number(reworkQtyInput) || 0);
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

                    <PickerCard
                        sectionLabel="SCANNING STATION"
                        loading={loadingOperations}
                        loadingLabel="Loading your assigned operations&#8230;"
                        items={operations}
                        selected={selectedOperation}
                        showPicker={showOperationPicker}
                        onSelect={onSelectOperation}
                        onChangeClick={onChangeOperationClick}
                        itemLabel={(op) => op.operation_code}
                        itemSub={(op) => op.description}
                        selectedLabel={(op) => op.operation_code}
                        selectedSub={(op) => op.description}
                        emptyIcon="fas fa-user-slash"
                        emptyTitle="No operations assigned"
                        emptyBody="Your account isn't assigned to any scanning operation yet. Contact your supervisor to get set up."
                    />

                    <PickerCard
                        sectionLabel="SHIFT TEAM"
                        loading={loadingTeams}
                        loadingLabel="Loading active shift teams&#8230;"
                        items={teams}
                        selected={selectedTeam}
                        showPicker={showTeamPicker}
                        onSelect={onSelectTeam}
                        onChangeClick={onChangeTeamClick}
                        itemLabel={(t) => t.team_code || t.team_name}
                        itemSub={(t) => t.shift_name}
                        selectedLabel={(t) => t.team_code || t.team_name}
                        selectedSub={(t) => t.shift_name}
                        emptyIcon="fas fa-people-arrows"
                        emptyTitle="No active shift team"
                        emptyBody="There's no shift team active right now. Ask your supervisor to set one up before scanning."
                    />

                    {/* Rework Station mode: queue instead of scan-and-confirm */}
                    {!loadingOperations && selectedOperation && !showOperationPicker &&
                        !loadingTeams && selectedTeam && !showTeamPicker && isReworkStation && (
                            <div className="row">
                                <div className="col-12">
                                    {ReworkStationBody(state, handlers)}
                                </div>
                            </div>
                        )}

                    {/* Scan + recent scans */}
                    {!loadingOperations && selectedOperation && !showOperationPicker &&
                        !loadingTeams && selectedTeam && !showTeamPicker && !isReworkStation && (
                            <div className="row">
                                <div className="col-12 col-md-7 mb-3">
                                    <div className="p-3" style={card}>

                                        {!pendingScan && (
                                            <>
                                                <label className="mb-2" style={{ fontWeight: 600, color: C.ink }}>
                                                    Scan Bundle
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
                                                    className="btn btn-outline-secondary btn-block mt-2"
                                                    style={{ minHeight: '46px' }}
                                                    onClick={onOpenCamera}
                                                    disabled={lookingUp}
                                                >
                                                    Scan with Camera
                                                </button>

                                                {lookingUp && (
                                                    <div className="text-center mt-2" style={{ color: C.muted, fontSize: '13px' }}>
                                                        <i className="fas fa-spinner fa-spin mr-1"></i>Looking up bundle&#8230;
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {pendingScan && (
                                            <div>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <small style={{ color: C.muted }}>BUNDLE FOUND</small>
                                                        <div>
                                                            <span style={{ fontSize: '18px', fontWeight: 700, color: C.ink }}>#{pendingScan.bundleId}</span>
                                                            <DirectionBadge direction={pendingScan.direction} />
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div style={{ fontSize: '13px', color: C.muted }}>{pendingScan.operationLabel}</div>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: C.ink }}>{pendingScan.remaining} due</div>
                                                    </div>
                                                </div>

                                                <div className="mb-2" style={{ fontSize: '12px', color: C.muted }}>
                                                    {formatPreviousStep(pendingScan.previousStep)}
                                                </div>

                                                {pendingScan.availableDirections && pendingScan.availableDirections.in && pendingScan.availableDirections.out && (
                                                    <div className="mb-2">
                                                        <small className="d-block mb-1" style={{ color: C.muted }}>DIRECTION</small>
                                                        <div className="d-flex" style={{ width: '100%' }}>
                                                            {['IN', 'OUT'].map((dir) => {
                                                                const active = pendingScan.direction === dir;
                                                                return (
                                                                    <button
                                                                        key={dir}
                                                                        type="button"
                                                                        style={{
                                                                            width: '50%',
                                                                            padding: '8px',
                                                                            fontWeight: 600,
                                                                            background: active ? C.accent : '#fff',
                                                                            color: active ? '#fff' : C.ink,
                                                                            border: `1px solid ${active ? C.accent : C.border}`
                                                                        }}
                                                                        onClick={() => onSwitchDirection(dir)}
                                                                        disabled={scanning || lookingUp}
                                                                    >
                                                                        {dir}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="form-row">
                                                    <div className="form-group col-4 mb-2">
                                                        <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.success }}>Scan Qty</label>
                                                        <input
                                                            ref={qtyInputRef}
                                                            type="number"
                                                            min="0"
                                                            className="form-control"
                                                            style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', color: C.success, borderColor: scanQtyInput ? C.successBorder : C.border }}
                                                            value={scanQtyInput}
                                                            onChange={(e) => onScanQtyChange(e.target.value)}
                                                            onKeyDown={onQtyKeyDown}
                                                            disabled={scanning}
                                                        />
                                                    </div>
                                                    <div className="form-group col-4 mb-2">
                                                        <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.danger }}>Reject Qty</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-control"
                                                            style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', color: C.danger, borderColor: rejectQtyInput ? C.dangerBorder : C.border }}
                                                            placeholder="0"
                                                            value={rejectQtyInput}
                                                            onChange={(e) => onRejectQtyChange(e.target.value)}
                                                            onKeyDown={onQtyKeyDown}
                                                            disabled={scanning}
                                                        />
                                                    </div>
                                                    <div className="form-group col-4 mb-2">
                                                        <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.amber }}>Rework Qty</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-control"
                                                            style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', color: C.amber, borderColor: reworkQtyInput ? C.amberBorder : C.border }}
                                                            placeholder="0"
                                                            value={reworkQtyInput}
                                                            onChange={(e) => onReworkQtyChange(e.target.value)}
                                                            onKeyDown={onQtyKeyDown}
                                                            disabled={scanning}
                                                        />
                                                    </div>
                                                </div>

                                                {rejectQtyInput && Number(rejectQtyInput) > 0 && (
                                                    <div className="form-group mb-2">
                                                        <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.danger }}>Reject Reason</label>
                                                        <select
                                                            className="form-control"
                                                            style={{ height: '46px' }}
                                                            value={rejectReasonId}
                                                            onChange={(e) => onRejectReasonChange(e.target.value)}
                                                            disabled={scanning}
                                                        >
                                                            <option value="">Select a reason&#8230;</option>
                                                            {rejectReasons.map(r => (
                                                                <option key={r.id} value={r.id}>{r.description}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {reworkQtyInput && Number(reworkQtyInput) > 0 && (
                                                    <div className="form-group mb-2">
                                                        <label className="mb-1" style={{ fontSize: '12px', fontWeight: 600, color: C.amber }}>Rework Reason</label>
                                                        <select
                                                            className="form-control"
                                                            style={{ height: '46px' }}
                                                            value={reworkReasonId}
                                                            onChange={(e) => onReworkReasonChange(e.target.value)}
                                                            disabled={scanning}
                                                        >
                                                            <option value="">Select a reason&#8230;</option>
                                                            {reworkReasons.map(r => (
                                                                <option key={r.id} value={r.id}>{r.description}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {overRemaining && (
                                                    <div className="mt-2 mb-2" style={{ fontSize: '12px', color: C.danger }}>
                                                        Only {pendingScan.remaining} left on this ticket.
                                                    </div>
                                                )}

                                                <div className="d-flex mt-3" style={{ gap: '8px' }}>
                                                    <button
                                                        type="button"
                                                        className="btn common-btn common-btn-lg flex-grow-1"
                                                        style={{ minHeight: '48px' }}
                                                        onClick={onConfirmScan}
                                                        disabled={scanning || overRemaining}
                                                    >
                                                        {scanning ? 'Saving…' : 'Confirm Scan'}
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
                                            <div className="text-center mt-2" style={{ color: C.muted, fontSize: '13px' }}>
                                                {scansToday} scan{scansToday === 1 ? '' : 's'} this session
                                            </div>
                                        )}

                                        {lastResult && (
                                            <div
                                                style={{
                                                    marginTop: '12px',
                                                    padding: '12px 14px',
                                                    borderRadius: '4px',
                                                    border: `1px solid ${lastResult.type === 'success' ? C.successBorder : C.dangerBorder}`,
                                                    borderLeft: `3px solid ${lastResult.type === 'success' ? C.success : C.danger}`,
                                                    background: lastResult.type === 'success' ? C.successBg : C.dangerBg
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <strong style={{ color: C.ink }}>{lastResult.message}</strong>
                                                    {lastResult.direction && <DirectionBadge direction={lastResult.direction} />}
                                                </div>
                                                {lastResult.type === 'success' && (
                                                    <div className="mt-1" style={{ fontSize: '13px', color: C.muted }}>
                                                        Bundle #{lastResult.bundleId} &middot; {lastResult.operationLabel}
                                                        {lastResult.scanQty > 0 && <> &middot; {lastResult.scanQty} scanned</>}
                                                        {lastResult.rejectQty > 0 && <> &middot; {lastResult.rejectQty} rejected</>}
                                                        {lastResult.reworkQty > 0 && <> &middot; {lastResult.reworkQty} sent to rework</>}
                                                        {!lastResult.ticketComplete && lastResult.remainingAfter > 0 && (
                                                            <> &middot; {lastResult.remainingAfter} remaining on this step</>
                                                        )}
                                                        {lastResult.progress && (
                                                            <> &middot; {lastResult.progress.completed}/{lastResult.progress.total} operations complete</>
                                                        )}
                                                        {lastResult.bundleComplete && (
                                                            <span className="ml-2" style={{ color: C.success, fontWeight: 600 }}>
                                                                Route complete
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {lastResult.type === 'error' && lastResult.previousStep !== undefined && (
                                                    <div className="mt-1" style={{ fontSize: '12px', color: C.muted }}>
                                                        {formatPreviousStep(lastResult.previousStep)}
                                                    </div>
                                                )}
                                                {lastResult.type === 'success' && canStillFix(lastResult.createdAt) && (
                                                    <div className="mt-2" style={{ fontSize: '12px' }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 mr-3"
                                                            style={{ color: C.ink, fontWeight: 500 }}
                                                            onClick={onEditLastScan}
                                                        >
                                                            Edit this scan
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0"
                                                            style={{ color: C.danger, fontWeight: 500 }}
                                                            onClick={onDeleteLastScan}
                                                        >
                                                            Delete this scan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-md-5 mb-3">
                                    <div className="p-3" style={card}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="mb-0" style={{ fontWeight: 600, color: C.ink }}>
                                                Recent Scans
                                            </label>
                                            <CountChip count={recentScans.length} />
                                        </div>

                                        {recentScans.length === 0 && (
                                            <p className="mb-0" style={{ color: C.muted, fontSize: '13px' }}>No scans yet.</p>
                                        )}

                                        <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                                            {recentScans.map(scan => (
                                                <div
                                                    key={`${scan.type}-${scan.id}`}
                                                    className="d-flex justify-content-between align-items-center py-2"
                                                    style={{ borderBottom: `1px solid ${C.border}` }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: C.ink }}>
                                                            Bundle #{scan.bundle_id} <DirectionBadge direction={scan.direction} />
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: C.muted }}>
                                                            {scan.operation_description || scan.operation_code} &middot; {scan.team_name} &middot; {formatTime(scan.scanned_at)}
                                                        </div>
                                                        {scan.type === 'REJECT' && scan.reject_reason && (
                                                            <div style={{ fontSize: '12px', fontStyle: 'italic', color: C.muted }}>
                                                                "{scan.reject_reason}"
                                                            </div>
                                                        )}
                                                        {canStillFix(scan.scanned_at) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-link p-0"
                                                                style={{ fontSize: '12px', color: C.muted, textDecoration: 'underline' }}
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
            </ControlCenter >
        </>
    );
}
