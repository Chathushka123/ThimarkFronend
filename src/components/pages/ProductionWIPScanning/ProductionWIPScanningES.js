import { useEffect, useRef, useState } from 'react';
import { generateProductionWIPScanningDisplay } from './ProductionWIPScanningDS';
import config from './ProductionWIPScanningCS';
import API from '../../../api/API';

const SELECTED_OPERATION_STORAGE_KEY = 'wipScan.selectedOperationId';
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
    const [ticketCode, setTicketCode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [recentScans, setRecentScans] = useState([]);
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [scansToday, setScansToday] = useState(0);
    const [readOnly, setReadOnly] = useState(false);

    const scanInputRef = useRef(null);
    const lastScanRef = useRef({ code: null, at: 0 });

    function reRender() {
        setRendered(!rendered);
    }

    config["CONTROL_CENTER"].renderFunction = reRender;

    useEffect(() => {
        __checkIsAuthorized();
        loadMyOperations();

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
        if (selectedOperation && !showOperationPicker && !showQrScanner && scanInputRef.current) {
            scanInputRef.current.focus();
        }
    }, [selectedOperation, showOperationPicker, showQrScanner, scanning]);

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

    function handleTicketCodeChange(value) {
        setTicketCode(value);
    }

    function handleTicketCodeKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitScan(ticketCode);
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
        setTimeout(() => submitScan(decodedText), 100);
    }

    async function submitScan(rawCode) {
        const code = (rawCode || '').trim();
        if (code === '' || !selectedOperation || readOnly) {
            return;
        }

        const now = Date.now();
        if (lastScanRef.current.code === code && (now - lastScanRef.current.at) < DUPLICATE_SCAN_WINDOW_MS) {
            setTicketCode('');
            return;
        }
        lastScanRef.current = { code, at: now };

        setScanning(true);
        try {
            const response = await API.post('wipScan/scan', {
                ticket_code: code,
                operation_id: selectedOperation.id
            });

            const data = response.data.data;
            setLastResult({
                type: 'success',
                message: 'Scan recorded',
                direction: data.direction,
                bundleId: data.bundle_id,
                operationLabel: data.operation_description || data.operation_code,
                progress: data.progress,
                bundleComplete: data.bundle_complete
            });
            playFeedbackTone(true);
            vibrate(true);
            setScansToday(prev => prev + 1);
            setTicketCode('');
            await loadRecentScans();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || 'Scan failed — please try again';
            setLastResult({ type: 'error', message });
            playFeedbackTone(false);
            vibrate(false);
            setTicketCode('');
        } finally {
            setScanning(false);
        }
    }

    async function handleFixDirection(bundleTicketId, newDirection) {
        try {
            await API.put(`wipScan/scan/${bundleTicketId}/direction`, { direction: newDirection });
            config["CONTROL_CENTER"].promptBaseMessage("Scan direction corrected", "");
            await loadRecentScans();
        } catch (error) {
            const payload = error.response && error.response.data;
            const message = (payload && payload.message) || "Failed to correct scan direction";
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
            ticketCode,
            scanning,
            lastResult,
            recentScans,
            showQrScanner,
            scansToday
        },
        {
            scanInputRef,
            onTicketCodeChange: handleTicketCodeChange,
            onTicketCodeKeyDown: handleTicketCodeKeyDown,
            onOpenCamera: handleOpenCamera,
            onQrScanSuccess: handleQrScanSuccess,
            onQrScanClose: handleQrScanClose,
            onSelectOperation: handleSelectOperation,
            onChangeOperationClick: handleChangeOperationClick,
            onFixDirection: handleFixDirection
        }
    );
};

export default ProductionWIPScanning;
