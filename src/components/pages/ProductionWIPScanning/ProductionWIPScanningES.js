import { useEffect, useRef, useState } from 'react';
import { generateProductionWIPScanningDisplay } from './ProductionWIPScanningDS';
import config from './ProductionWIPScanningCS';
import API from '../../../api/API';

const SELECTED_OPERATION_STORAGE_KEY = 'wipScan.selectedOperationId';
const SELECTED_TEAM_STORAGE_KEY = 'wipScan.selectedTeamId';
const DUPLICATE_SCAN_WINDOW_MS = 2000;

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
    const [rejectReasonInput, setRejectReasonInput] = useState('');

    const scanInputRef = useRef(null);
    const qtyInputRef = useRef(null);
    const lastScanRef = useRef({ code: null, at: 0 });

    function reRender() {
        setRendered(!rendered);
    }

    config["CONTROL_CENTER"].renderFunction = reRender;

    useEffect(() => {
        __checkIsAuthorized();
        loadMyOperations();
        loadMyTeams();

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

    // While a lookup is awaiting confirmation, focus jumps to the qty field
    // (fast path: adjust or just hit Enter to accept the pre-filled full
    // remaining qty). Otherwise the scan input keeps re-focus for the next tap.
    useEffect(() => {
        if (showQrScanner) return;
        if (pendingScan) {
            if (qtyInputRef.current) {
                qtyInputRef.current.focus();
                qtyInputRef.current.select();
            }
        } else if (selectedOperation && !showOperationPicker && selectedTeam && !showTeamPicker && scanInputRef.current) {
            scanInputRef.current.focus();
        }
    }, [selectedOperation, showOperationPicker, selectedTeam, showTeamPicker, showQrScanner, scanning, pendingScan]);

    function __checkIsAuthorized() {
        const apiRequest = { "screen": "productionWIPScanning" };
        API.post(`permissions/isAuthorized`, apiRequest).then(response => {
            setReadOnly(response.data === "r");
        }).catch(() => {
            setReadOnly(true);
        });
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

            await loadRecentScans();
        } catch (error) {
            console.log(error);
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to load your assigned operations");
        } finally {
            setLoadingOperations(false);
        }
    }

    async function loadRecentScans() {
        try {
            const response = await API.get('wipScan/recentScans');
            setRecentScans((response.data && response.data.data) || []);
        } catch (error) {
            console.log(error);
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
            config["CONTROL_CENTER"].promptErrorMessage("Error", "Failed to load active shift teams");
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
            lookupScan(ticketCode);
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
        setTimeout(() => lookupScan(decodedText), 100);
    }

    // Step 1: resolve the scanned code to a ticket + its remaining qty —
    // records nothing yet, just shows it so the operator can confirm, amend,
    // or split part of it into a reject before anything is saved.
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

        setLookingUp(true);
        try {
            const response = await API.post('wipScan/lookup', {
                ticket_code: code,
                operation_id: selectedOperation.id
            });

            const data = response.data.data;
            setPendingScan({
                ticketCode: code,
                bundleId: data.bundle_id,
                bundleTicketId: data.bundle_ticket_id,
                direction: data.direction,
                remaining: data.remaining,
                operationLabel: data.operation_description || data.operation_code
            });
            setScanQtyInput(String(data.remaining));
            setRejectQtyInput('');
            setRejectReasonInput('');
            setLastResult(null);
            setTicketCode('');
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || 'Lookup failed — please try again';
            setLastResult({ type: 'error', message });
            playFeedbackTone(false);
            vibrate(false);
            setTicketCode('');
        } finally {
            setLookingUp(false);
        }
    }

    function clearPendingScan() {
        setPendingScan(null);
        setTicketCode('');
        setScanQtyInput('');
        setRejectQtyInput('');
        setRejectReasonInput('');
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

    // Step 2: actually record the (possibly amended) quantity once the
    // operator confirms.
    async function handleConfirmScan() {
        if (!pendingScan || !selectedOperation || !selectedTeam || readOnly || scanning) {
            return;
        }

        const scanQty = scanQtyInput === '' ? 0 : Number(scanQtyInput);
        const rejectQty = rejectQtyInput === '' ? 0 : Number(rejectQtyInput);

        if (isNaN(scanQty) || isNaN(rejectQty) || scanQty < 0 || rejectQty < 0) {
            setLastResult({ type: 'error', message: 'Quantities cannot be negative.' });
            return;
        }
        if (scanQty + rejectQty <= 0) {
            setLastResult({ type: 'error', message: 'Enter a scanned or rejected quantity.' });
            return;
        }
        if (scanQty + rejectQty > pendingScan.remaining) {
            setLastResult({ type: 'error', message: `Only ${pendingScan.remaining} left on this ticket.` });
            return;
        }
        if (rejectQty > 0 && !rejectReasonInput.trim()) {
            setLastResult({ type: 'error', message: 'Enter a reason for the rejected quantity.' });
            return;
        }

        setScanning(true);
        try {
            const response = await API.post('wipScan/scan', {
                ticket_code: pendingScan.ticketCode,
                operation_id: selectedOperation.id,
                daily_shift_team_id: selectedTeam.id,
                scan_qty: scanQty,
                reject_qty: rejectQty,
                reject_reason: rejectReasonInput.trim()
            });

            const data = response.data.data;
            setLastResult({
                type: 'success',
                message: 'Scan recorded',
                direction: data.direction,
                bundleId: data.bundle_id,
                scanQty: data.scan_qty,
                rejectQty: data.reject_qty,
                remainingAfter: data.remaining_after,
                ticketComplete: data.ticket_complete,
                operationLabel: data.operation_description || data.operation_code,
                progress: data.progress,
                bundleComplete: data.bundle_complete
            });
            playFeedbackTone(true);
            vibrate(true);
            setScansToday(prev => prev + 1);
            clearPendingScan();
            await loadRecentScans();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || 'Scan failed — please try again';
            setLastResult({ type: 'error', message });
            playFeedbackTone(false);
            vibrate(false);
            clearPendingScan();
        } finally {
            setScanning(false);
        }
    }

    async function handleUndoScan(entry) {
        try {
            const path = entry.type === 'REJECT' ? `wipScan/rejectScans/${entry.id}` : `wipScan/secondaryScans/${entry.id}`;
            await API.delete(path);
            config["CONTROL_CENTER"].promptBaseMessage("Scan undone", "");
            await loadRecentScans();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || "Failed to undo scan";
            config["CONTROL_CENTER"].promptWarningMessage(message, "");
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
        },
        {
            scanInputRef,
            qtyInputRef,
            onTicketCodeChange: handleTicketCodeChange,
            onTicketCodeKeyDown: handleTicketCodeKeyDown,
            onOpenCamera: handleOpenCamera,
            onQrScanSuccess: handleQrScanSuccess,
            onQrScanClose: handleQrScanClose,
            onSelectOperation: handleSelectOperation,
            onChangeOperationClick: handleChangeOperationClick,
            onSelectTeam: handleSelectTeam,
            onChangeTeamClick: handleChangeTeamClick,
            onScanQtyChange: setScanQtyInput,
            onRejectQtyChange: setRejectQtyInput,
            onRejectReasonChange: setRejectReasonInput,
            onQtyKeyDown: handleQtyKeyDown,
            onConfirmScan: handleConfirmScan,
            onCancelPendingScan: handleCancelPendingScan,
            onUndoScan: handleUndoScan
        }
    );
};

export default ProductionWIPScanning;
