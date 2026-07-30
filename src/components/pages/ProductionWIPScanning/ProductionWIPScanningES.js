import { useEffect, useRef, useState } from 'react';
import { generateProductionWIPScanningDisplay } from './ProductionWIPScanningDS';
import config from './ProductionWIPScanningCS';
import API from '../../../api/API';

const SELECTED_OPERATION_STORAGE_KEY = 'wipScan.selectedOperationId';
const SELECTED_TEAM_STORAGE_KEY = 'wipScan.selectedTeamId';
const DUPLICATE_SCAN_WINDOW_MS = 2000;
const REWORK_OPERATION_CODE = 'REWORK';

function playFeedbackTone(success) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const beep = (freq, startAt, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.value = 0.15;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startAt);
            osc.stop(startAt + duration);
        };
        const now = ctx.currentTime;
        if (success) {
            beep(880, now, 0.12);
        } else {
            beep(220, now, 0.12);
            beep(220, now + 0.16, 0.12);
        }
    } catch (e) {
        // Web Audio unavailable — silently skip the tone, banner + vibration still work.
    }
}

function vibrate(success) {
    if (navigator.vibrate) {
        navigator.vibrate(success ? 80 : [80, 60, 80]);
    }
}

// Some backend error `code`s carry a message that's accurate but terse or
// technical ("Bundle not found.") — this rewrites just those into plain,
// actionable shop-floor language. Codes whose backend message is already
// specific (it names a quantity, a direction, or an operation dynamically —
// e.g. WAITING_ON_UPSTREAM, QTY_EXCEEDS_TICKET) are deliberately left alone
// so we don't throw away detail the backend already computed.
const ERROR_GUIDANCE = {
    NOT_YOUR_OPERATION: 'This station isn’t assigned to you — tap "Change" above to pick your assigned station.',
    UNKNOWN_TICKET: 'No bundle found with that code — check the barcode and try again.',
    UNKNOWN_BUNDLE: 'No bundle found with that code — check the barcode and try again.',
    NO_MATCHING_OPERATION: 'This bundle’s route doesn’t pass through your station — check you’re scanning the right bundle.',
    TICKET_NOT_GENERATED: 'This bundle hasn’t reached your station yet on its route.',
    EDIT_WINDOW_EXPIRED: 'It’s been more than 5 minutes since this entry — it can no longer be changed here. Ask a supervisor to correct it.',
    UNKNOWN_SCAN: 'That entry wasn’t found — it may have already been undone. Refresh and check Recent Scans.',
    UNKNOWN_REJECT: 'That entry wasn’t found — it may have already been undone. Refresh and check Recent Scans.',
    UNKNOWN_REWORK: 'That entry wasn’t found — it may have already been undone. Refresh and check Recent Scans.',
    UNKNOWN_REWORK_RETURN: 'That entry wasn’t found — it may have already been undone. Refresh and check Recent Scans.',
    UNKNOWN_TROLLY: 'No trolly found with that ID — check the number and try again.',
    NO_BUNDLE_FOR_TROLLY: 'This trolly has no bundle loaded on it yet.',
    BUNDLE_NOT_ACTIVE: 'The bundle loaded on this trolly is no longer active.'
};

// Turns any API failure — our own error codes, a FormRequest validation
// failure, or a plain network/timeout error with no response at all — into
// one meaningful, operator-facing line instead of a raw/generic string.
function describeError(error, fallback) {
    if (!error.response) {
        return 'Can’t reach the server — check your connection and try again.';
    }
    const payload = error.response.data || {};
    const errors = payload.errors;

    if (errors && typeof errors === 'object' && !Array.isArray(errors) && errors.code) {
        return ERROR_GUIDANCE[errors.code] || payload.message || fallback;
    }

    // FormRequest validation failures: { message: 'Validation failed.', errors: { field: [msg] } }
    // — surface the actual field message instead of the generic wrapper text.
    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
        const firstField = Object.keys(errors)[0];
        const firstMessage = firstField && Array.isArray(errors[firstField]) ? errors[firstField][0] : null;
        if (firstMessage) return firstMessage;
    }

    return payload.message || fallback;
}

const ProductionWIPScanning = () => {
    const [rendered, setRendered] = useState(true);
    const [loadingOperations, setLoadingOperations] = useState(true);
    const [operations, setOperations] = useState([]);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [showOperationPicker, setShowOperationPicker] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showTeamPicker, setShowTeamPicker] = useState(false);
    const [ticketCode, setTicketCode] = useState('');
    const [trollyCode, setTrollyCode] = useState('');
    const [resolvingTrolly, setResolvingTrolly] = useState(false);
    const [lookingUp, setLookingUp] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [pendingScan, setPendingScan] = useState(null);
    const [lastResult, setLastResult] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [scansToday, setScansToday] = useState(0);
    const [readOnly, setReadOnly] = useState(false);
    const [scanQtyInput, setScanQtyInput] = useState('');
    const [rejectQtyInput, setRejectQtyInput] = useState('');
    const [rejectReasonId, setRejectReasonId] = useState('');
    const [reworkQtyInput, setReworkQtyInput] = useState('');
    const [reworkReasonId, setReworkReasonId] = useState('');
    const [rejectReasons, setRejectReasons] = useState([]);
    const [reworkReasons, setReworkReasons] = useState([]);

    // Rework Station mode (selectedOperation.operation_code === 'REWORK'):
    // a queue of outstanding rework instead of the normal scan-and-confirm box.
    const [outstandingRework, setOutstandingRework] = useState([]);
    const [loadingOutstandingRework, setLoadingOutstandingRework] = useState(false);
    const [returnInputs, setReturnInputs] = useState({});
    const [submittingReturnId, setSubmittingReturnId] = useState(null);

    const scanInputRef = useRef(null);
    const bundleInputRef = useRef(null);
    const qtyInputRef = useRef(null);
    const lastScanRef = useRef({ code: null, at: 0 });
    const lastTrollyScanRef = useRef({ code: null, at: 0 });

    function reRender() {
        setRendered(!rendered);
    }

    config["CONTROL_CENTER"].renderFunction = reRender;

    const isReworkStation = !!(selectedOperation && selectedOperation.operation_code === REWORK_OPERATION_CODE);

    useEffect(() => {
        __checkIsAuthorized();
        loadMyOperations();
        loadMyTeams();
        loadReasons();

        // Auto-collapse the sidebar on phones/small tablets so the scan
        // panel gets the full screen width — this is the primary use case
        // for this page, more so than any other screen in the app.
        if (window.innerWidth < 992) {
            const toggleBtn = document.getElementById('sidebarToggle');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isReworkStation) {
            loadOutstandingRework();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReworkStation]);

    // Recent Scans is scoped per shift team — reload whenever the operator
    // switches teams so it never shows another team's entries.
    useEffect(() => {
        if (selectedTeam) {
            loadRecentScans(selectedTeam.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTeam]);

    // Teams can now carry a default Operation (Team.operation_id, joined in
    // via wipScan/myTeams' `operation_id`) — picking a team resolves and
    // auto-selects its mapped station so the operator doesn't have to pick
    // both. Guarded so it only fires once, and skips teams with no mapping.
    useEffect(() => {
        if (!selectedTeam || !selectedTeam.operation_id || operations.length === 0) {
            return;
        }
        if (selectedOperation && selectedOperation.id === selectedTeam.operation_id) {
            return;
        }
        const matchingOperation = operations.find(op => op.id === selectedTeam.operation_id);
        if (matchingOperation) {
            selectOperation(matchingOperation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTeam, operations]);

    // Reverse direction: the mapping above is stored one-way on Team, so it's
    // resolved here client-side — picking a station auto-selects the first
    // team mapped to it, if any.
    useEffect(() => {
        if (!selectedOperation || teams.length === 0) {
            return;
        }
        if (selectedTeam && selectedTeam.operation_id === selectedOperation.id) {
            return;
        }
        const matchingTeam = teams.find(t => t.operation_id === selectedOperation.id);
        if (matchingTeam) {
            selectTeam(matchingTeam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOperation, teams]);

    // While a lookup is awaiting confirmation, focus jumps to the qty field
    // (fast path: adjust or just hit Enter to accept the pre-filled full
    // remaining qty). Otherwise the scan input keeps re-focus for the next tap.
    useEffect(() => {
        if (showQrScanner || isReworkStation) return;
        if (pendingScan) {
            if (qtyInputRef.current) {
                qtyInputRef.current.focus();
                qtyInputRef.current.select();
            }
        } else if (selectedOperation && !showOperationPicker && selectedTeam && !showTeamPicker && scanInputRef.current) {
            scanInputRef.current.focus();
        }
    }, [selectedOperation, showOperationPicker, selectedTeam, showTeamPicker, showQrScanner, scanning, pendingScan, isReworkStation]);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "productionWIPScanning" };
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            setReadOnly(response.data === "r");
        }).catch(() => {
            setReadOnly(true);
        });
    }

    async function loadReasons() {
        try {
            const [rejectRes, reworkRes] = await Promise.all([
                API.get('wipScan/reasons/REJECT'),
                API.get('wipScan/reasons/REWORK')
            ]);
            setRejectReasons((rejectRes.data && rejectRes.data.data) || []);
            setReworkReasons((reworkRes.data && reworkRes.data.data) || []);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadMyOperations() {
        try {
            setLoadingOperations(true);
            const response = await API.get('wipScan/myOperations');
            const list = (response.data && response.data.data) || [];
            setOperations(list);

            if (list.length === 1) {
                selectOperation(list[0]);
            } else if (list.length > 1) {
                const storedId = sessionStorage.getItem(SELECTED_OPERATION_STORAGE_KEY);
                const stored = storedId ? list.find(op => String(op.id) === storedId) : null;
                if (stored) {
                    selectOperation(stored);
                } else {
                    setShowOperationPicker(true);
                }
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", describeError(error, 'Failed to load your assigned operations'));
        } finally {
            setLoadingOperations(false);
        }
    }

    // Recent Scans is only ever shown once a shift team is selected (see
    // ProductionWIPScanningDS), so it's always scoped to that team — a
    // different team's entries would otherwise be confusing on a shared station.
    async function loadRecentScans(teamId) {
        try {
            const query = teamId ? `?daily_shift_team_id=${teamId}` : '';
            const response = await API.get(`wipScan/recentScans${query}`);
            setRecentScans((response.data && response.data.data) || []);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadOutstandingRework() {
        try {
            setLoadingOutstandingRework(true);
            const response = await API.get('wipScan/outstandingRework');
            setOutstandingRework((response.data && response.data.data) || []);
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", describeError(error, 'Failed to load outstanding rework'));
        } finally {
            setLoadingOutstandingRework(false);
        }
    }

    async function loadMyTeams() {
        try {
            setLoadingTeams(true);
            const response = await API.get('wipScan/myTeams');
            const list = (response.data && response.data.data) || [];
            setTeams(list);

            if (list.length === 1) {
                selectTeam(list[0]);
            } else if (list.length > 1) {
                const storedId = sessionStorage.getItem(SELECTED_TEAM_STORAGE_KEY);
                const stored = storedId ? list.find(t => String(t.id) === storedId) : null;
                if (stored) {
                    selectTeam(stored);
                } else {
                    setShowTeamPicker(true);
                }
            }
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", describeError(error, 'Failed to load active shift teams'));
        } finally {
            setLoadingTeams(false);
        }
    }

    function selectOperation(op) {
        setSelectedOperation(op);
        setShowOperationPicker(false);
        sessionStorage.setItem(SELECTED_OPERATION_STORAGE_KEY, String(op.id));
    }

    function handleSelectOperation(op) {
        selectOperation(op);
    }

    function handleChangeOperationClick() {
        setShowOperationPicker(true);
    }

    function selectTeam(team) {
        setSelectedTeam(team);
        setShowTeamPicker(false);
        sessionStorage.setItem(SELECTED_TEAM_STORAGE_KEY, String(team.id));
    }

    function handleSelectTeam(team) {
        selectTeam(team);
    }

    function handleChangeTeamClick() {
        setShowTeamPicker(true);
    }

    function handleTicketCodeChange(value) {
        setTicketCode(value);
    }

    function handleTicketCodeKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Entering the Bundle ID directly (instead of via Trolly ID) is a
            // supported fallback — still fill in the matching trolly for
            // display, but don't let that lookup block or fail the scan.
            resolveTrollyForBundle(ticketCode);
            lookupScan(ticketCode);
        }
    }

    function handleTrollyCodeChange(value) {
        setTrollyCode(value);
    }

    function handleTrollyCodeKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            lookupFromTrolly(trollyCode);
        }
    }

    // Best-effort only: shows the operator which trolly the bundle they
    // typed/scanned is on, if any. A miss here (no trolly assigned) isn't an
    // error worth interrupting the scan for.
    async function resolveTrollyForBundle(code) {
        const trimmed = (code || '').trim();
        if (trimmed === '') {
            return;
        }
        try {
            const response = await API.get(`wipScan/resolveTrolley?bundle_code=${encodeURIComponent(trimmed)}`);
            setTrollyCode(String(response.data.data.trolly_id));
        } catch (error) {
            setTrollyCode('');
        }
    }

    // Default entry point on this screen: resolve the trolly's currently
    // loaded bundle, then feed that bundle id straight into the same
    // lookup pipeline a directly-typed/scanned bundle code goes through.
    async function lookupFromTrolly(rawCode) {
        const code = (rawCode || '').trim();
        if (code === '' || !selectedOperation || !selectedTeam || readOnly || pendingScan) {
            return;
        }

        const now = Date.now();
        if (lastTrollyScanRef.current.code === code && (now - lastTrollyScanRef.current.at) < DUPLICATE_SCAN_WINDOW_MS) {
            setTrollyCode('');
            return;
        }
        lastTrollyScanRef.current = { code, at: now };

        setResolvingTrolly(true);
        try {
            const response = await API.get(`wipScan/resolveTrolley?trolly_code=${encodeURIComponent(code)}`);
            const data = response.data.data;
            setTrollyCode('');
            await lookupScan(String(data.bundle_id));
        } catch (error) {
            const message = describeError(error, 'Could not find an active bundle for that trolly');
            setLastResult({ type: 'error', message });
            playFeedbackTone(false);
            vibrate(false);
            setTrollyCode('');
        } finally {
            setResolvingTrolly(false);
        }
    }

    function handleOpenCamera() {
        setShowQrScanner(true);
    }

    function handleQrScanClose() {
        setShowQrScanner(false);
    }

    function handleQrScanSuccess(decodedText) {
        setShowQrScanner(false);
        setTicketCode(decodedText);
        resolveTrollyForBundle(decodedText);
        setTimeout(() => lookupScan(decodedText), 100);
    }

    // Shared by the physical-scan entry point and the direction-switch
    // control: resolves a bundle code (optionally forcing IN or OUT rather
    // than letting the backend auto-detect) and populates pendingScan.
    // Records nothing yet — just shows the ticket so the operator can
    // confirm, amend, switch direction, or split part of it into a
    // reject/rework before anything is saved.
    async function performLookup(code, direction) {
        setLookingUp(true);
        try {
            const response = await API.post('wipScan/lookup', {
                ticket_code: code,
                operation_id: selectedOperation.id,
                ...(direction ? { direction } : {})
            });

            const data = response.data.data;
            setPendingScan({
                ticketCode: code,
                bundleId: data.bundle_id,
                bundleTicketId: data.bundle_ticket_id,
                direction: data.direction,
                remaining: data.remaining,
                operationLabel: data.operation_description || data.operation_code,
                availableDirections: data.available_directions || { in: false, out: false },
                previousStep: data.previous_step || null
            });
            setScanQtyInput(String(data.remaining));
            setRejectQtyInput('');
            setRejectReasonId('');
            setReworkQtyInput('');
            setReworkReasonId('');
            setLastResult(null);
            setTicketCode('');
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = describeError(error, 'Lookup failed — please try again');
            // WAITING_ON_UPSTREAM carries a `previous_step` alongside the
            // message — surface it as the same "Source: ..." line the
            // success view uses, so a blocked scan is just as explainable.
            const previousStep = payload && payload.errors && payload.errors.previous_step;
            setLastResult({ type: 'error', message, previousStep });
            playFeedbackTone(false);
            vibrate(false);
            setTicketCode('');
            // A failed lookup can still mean the ticket's state moved under
            // the operator (e.g. someone else just scanned it) — refresh so
            // Recent Scans reflects reality instead of going stale.
            await loadRecentScans(selectedTeam.id);
        } finally {
            setLookingUp(false);
        }
    }

    // Step 1: resolve a freshly scanned/typed code — subject to the
    // duplicate-scan debounce and the usual station/team/readOnly guards.
    async function lookupScan(rawCode) {
        const code = (rawCode || '').trim();
        if (code === '' || !selectedOperation || !selectedTeam || readOnly || pendingScan) {
            return;
        }

        const now = Date.now();
        if (lastScanRef.current.code === code && (now - lastScanRef.current.at) < DUPLICATE_SCAN_WINDOW_MS) {
            setTicketCode('');
            return;
        }
        lastScanRef.current = { code, at: now };

        await performLookup(code, null);
    }

    // Operator explicitly switching between IN/OUT on an already-found
    // bundle — re-resolves the same ticket code under the chosen direction
    // instead of the backend's auto-detected one.
    async function handleSwitchDirection(direction) {
        if (!pendingScan || lookingUp || scanning || direction === pendingScan.direction) {
            return;
        }
        await performLookup(pendingScan.ticketCode, direction);
    }

    function clearPendingScan() {
        setPendingScan(null);
        setTicketCode('');
        setTrollyCode('');
        setScanQtyInput('');
        setRejectQtyInput('');
        setRejectReasonId('');
        setReworkQtyInput('');
        setReworkReasonId('');

        // The existing auto-focus effect re-runs on this same state change, but
        // in React 16 each of the setState calls above fires its own separate,
        // unbatched render when called after an `await` (e.g. from
        // handleConfirmScan) — an intermediate render can commit before
        // scanInputRef's input has fully settled. Force focus explicitly once
        // the DOM has caught up, so the scanner is always ready for the next
        // bundle immediately after this reset.
        setTimeout(() => {
            if (scanInputRef.current) {
                scanInputRef.current.focus();
            }
        }, 0);
    }

    function handleCancelPendingScan() {
        clearPendingScan();
    }

    function handleQtyKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleConfirmScan();
        }
    }

    // Step 2: actually record the (possibly amended) quantities once the
    // operator confirms — a single atomic call carrying the 3-way split
    // (good / reject / rework), all validated against one "remaining" cap.
    async function handleConfirmScan() {
        if (!pendingScan || !selectedOperation || !selectedTeam || readOnly || scanning) {
            return;
        }

        const scanQty = scanQtyInput === '' ? 0 : Number(scanQtyInput);
        const rejectQty = rejectQtyInput === '' ? 0 : Number(rejectQtyInput);
        const reworkQty = reworkQtyInput === '' ? 0 : Number(reworkQtyInput);

        if (isNaN(scanQty) || isNaN(rejectQty) || isNaN(reworkQty) || scanQty < 0 || rejectQty < 0 || reworkQty < 0) {
            setLastResult({ type: 'error', message: 'Quantities cannot be negative.' });
            return;
        }
        if (scanQty + rejectQty + reworkQty <= 0) {
            setLastResult({ type: 'error', message: 'Enter a scanned, rejected, or rework quantity.' });
            return;
        }
        if (scanQty + rejectQty + reworkQty > pendingScan.remaining) {
            setLastResult({ type: 'error', message: `Only ${pendingScan.remaining} left on this ticket.` });
            return;
        }
        if (rejectQty > 0 && !rejectReasonId) {
            setLastResult({ type: 'error', message: 'Select a reason for the rejected quantity.' });
            return;
        }
        if (reworkQty > 0 && !reworkReasonId) {
            setLastResult({ type: 'error', message: 'Select a reason for the rework quantity.' });
            return;
        }

        setScanning(true);
        try {
            const response = await API.post('wipScan/scan', {
                ticket_code: pendingScan.ticketCode,
                operation_id: selectedOperation.id,
                daily_shift_team_id: selectedTeam.id,
                direction: pendingScan.direction,
                scan_qty: scanQty,
                reject_qty: rejectQty,
                reject_reason_id: rejectQty > 0 ? rejectReasonId : null,
                rework_qty: reworkQty,
                rework_reason_id: reworkQty > 0 ? reworkReasonId : null
            });

            const data = response.data.data;
            setLastResult({
                type: 'success',
                message: 'Scan recorded',
                direction: data.direction,
                bundleId: data.bundle_id,
                scanQty: data.scan_qty,
                rejectQty: data.reject_qty,
                reworkQty: data.rework_qty,
                remainingAfter: data.remaining_after,
                ticketComplete: data.ticket_complete,
                operationLabel: data.operation_description || data.operation_code,
                progress: data.progress,
                bundleComplete: data.bundle_complete,
                // Kept so this exact entry can be edited/deleted right from
                // the result banner, without digging through Recent Scans.
                createdAt: data.created_at,
                secondaryId: data.secondary_id,
                rejectId: data.reject_id,
                reworkId: data.rework_id,
                rejectReasonId: data.reject_reason_id,
                reworkReasonId: data.rework_reason_id,
                ticketCode: pendingScan.ticketCode,
                operationId: selectedOperation.id
            });
            playFeedbackTone(true);
            vibrate(true);
            setScansToday(prev => prev + 1);
            clearPendingScan();
            await loadRecentScans(selectedTeam.id);
        } catch (error) {
            const message = describeError(error, 'Scan failed — please try again');
            setLastResult({ type: 'error', message });
            playFeedbackTone(false);
            vibrate(false);
            clearPendingScan();
        } finally {
            setScanning(false);
        }
    }

    // Reverses every row the last confirmed scan created (it may have
    // written a good/reject/rework entry all at once, from the 3-way
    // split), as a single logical undo of that one user action.
    async function undoLastResultEntries(result) {
        const deletes = [];
        if (result.secondaryId) deletes.push(API.delete(`wipScan/secondaryScans/${result.secondaryId}`));
        if (result.rejectId) deletes.push(API.delete(`wipScan/rejectScans/${result.rejectId}`));
        if (result.reworkId) deletes.push(API.delete(`wipScan/reworkScans/${result.reworkId}`));
        await Promise.all(deletes);
    }

    // "Delete" the last scan: undo it and leave the operator back at the
    // scan-bundle prompt.
    async function handleDeleteLastScan() {
        if (!lastResult || lastResult.type !== 'success') {
            return;
        }
        try {
            await undoLastResultEntries(lastResult);
            playFeedbackTone(true);
            config["CONTROL_CENTER"].promptBaseMessage("Last scan deleted", "");
            setLastResult(null);
            await loadRecentScans(selectedTeam.id);
        } catch (error) {
            const message = describeError(error, 'Failed to delete the last scan');
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        }
    }

    // "Edit" the last scan: undo it, then reopen the same ticket/direction
    // with the previously entered quantities and reasons pre-filled, so the
    // operator only has to correct the one number that was wrong.
    async function handleEditLastScan() {
        if (!lastResult || lastResult.type !== 'success') {
            return;
        }
        try {
            await undoLastResultEntries(lastResult);
            await performLookup(lastResult.ticketCode, lastResult.direction);
            setScanQtyInput(String(lastResult.scanQty || 0));
            setRejectQtyInput(lastResult.rejectQty ? String(lastResult.rejectQty) : '');
            setRejectReasonId(lastResult.rejectReasonId || '');
            setReworkQtyInput(lastResult.reworkQty ? String(lastResult.reworkQty) : '');
            setReworkReasonId(lastResult.reworkReasonId || '');
            setLastResult(null);
            await loadRecentScans(selectedTeam.id);
        } catch (error) {
            const message = describeError(error, 'Failed to reopen the last scan for editing');
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        }
    }

    async function handleUndoScan(entry) {
        try {
            const pathByType = {
                REJECT: `wipScan/rejectScans/${entry.id}`,
                REWORK: `wipScan/reworkScans/${entry.id}`,
                REWORK_RETURN: `wipScan/reworkReturns/${entry.id}`
            };
            const path = pathByType[entry.type] || `wipScan/secondaryScans/${entry.id}`;
            await API.delete(path);
            config["CONTROL_CENTER"].promptBaseMessage("Scan undone", "");
            await loadRecentScans(selectedTeam.id);
        } catch (error) {
            const message = describeError(error, 'Failed to undo scan');
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        }
    }

    // Rework Station: per-row inputs for return qty / reject qty / reason,
    // keyed by bundle_ticket_id since the queue lists multiple tickets at once.
    function handleReturnInputChange(bundleTicketId, field, value) {
        setReturnInputs(prev => ({
            ...prev,
            [bundleTicketId]: { ...prev[bundleTicketId], [field]: value }
        }));
    }

    async function handleReturnFromRework(row) {
        if (!selectedTeam || readOnly || submittingReturnId) {
            return;
        }

        const inputs = returnInputs[row.bundle_ticket_id] || {};
        const returnQty = inputs.returnQty ? Number(inputs.returnQty) : 0;
        const rejectQty = inputs.rejectQty ? Number(inputs.rejectQty) : 0;
        const reasonId = inputs.reasonId || '';

        if (isNaN(returnQty) || isNaN(rejectQty) || returnQty < 0 || rejectQty < 0) {
            config["CONTROL_CENTER"].promptWarningMessage('Quantities cannot be negative.', "");
            return;
        }
        if (returnQty + rejectQty <= 0) {
            config["CONTROL_CENTER"].promptWarningMessage('Enter a returned or rejected quantity.', "");
            return;
        }
        if (returnQty + rejectQty > row.outstanding_qty) {
            config["CONTROL_CENTER"].promptWarningMessage(`Only ${row.outstanding_qty} outstanding on this batch.`, "");
            return;
        }
        if (rejectQty > 0 && !reasonId) {
            config["CONTROL_CENTER"].promptWarningMessage('Select a reason for the rejected quantity.', "");
            return;
        }

        setSubmittingReturnId(row.bundle_ticket_id);
        try {
            await API.post('wipScan/returnFromRework', {
                bundle_ticket_id: row.bundle_ticket_id,
                daily_shift_team_id: selectedTeam.id,
                return_qty: returnQty,
                reject_qty: rejectQty,
                reason_id: rejectQty > 0 ? reasonId : null
            });

            playFeedbackTone(true);
            vibrate(true);
            config["CONTROL_CENTER"].promptBaseMessage("Rework return recorded", "");
            setReturnInputs(prev => ({ ...prev, [row.bundle_ticket_id]: {} }));
            await loadOutstandingRework();
        } catch (error) {
            const message = describeError(error, 'Failed to record rework return');
            playFeedbackTone(false);
            vibrate(false);
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
        } finally {
            setSubmittingReturnId(null);
        }
    }

    return generateProductionWIPScanningDisplay(
        config,
        {
            loadingOperations,
            operations,
            selectedOperation,
            showOperationPicker,
            loadingTeams,
            teams,
            selectedTeam,
            showTeamPicker,
            ticketCode,
            trollyCode,
            resolvingTrolly,
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
            isReworkStation,
            outstandingRework,
            loadingOutstandingRework,
            returnInputs,
            submittingReturnId
        },
        {
            scanInputRef,
            bundleInputRef,
            qtyInputRef,
            onTicketCodeChange: handleTicketCodeChange,
            onTicketCodeKeyDown: handleTicketCodeKeyDown,
            onTrollyCodeChange: handleTrollyCodeChange,
            onTrollyCodeKeyDown: handleTrollyCodeKeyDown,
            onOpenCamera: handleOpenCamera,
            onQrScanSuccess: handleQrScanSuccess,
            onQrScanClose: handleQrScanClose,
            onSelectOperation: handleSelectOperation,
            onChangeOperationClick: handleChangeOperationClick,
            onSelectTeam: handleSelectTeam,
            onChangeTeamClick: handleChangeTeamClick,
            onScanQtyChange: setScanQtyInput,
            onRejectQtyChange: setRejectQtyInput,
            onRejectReasonChange: setRejectReasonId,
            onReworkQtyChange: setReworkQtyInput,
            onReworkReasonChange: setReworkReasonId,
            onQtyKeyDown: handleQtyKeyDown,
            onConfirmScan: handleConfirmScan,
            onCancelPendingScan: handleCancelPendingScan,
            onSwitchDirection: handleSwitchDirection,
            onEditLastScan: handleEditLastScan,
            onDeleteLastScan: handleDeleteLastScan,
            onUndoScan: handleUndoScan,
            onReturnInputChange: handleReturnInputChange,
            onReturnFromRework: handleReturnFromRework
        }
    );
};

export default ProductionWIPScanning;
