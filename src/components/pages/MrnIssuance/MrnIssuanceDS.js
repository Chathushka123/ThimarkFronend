import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { 
    TextBox, Button, ControlCenter, PopUpPage ,NumberField,AdvanceSearchGrid,AdvanceSearchButton,AdvanceSearch
} from '../../../BASE/Components';

// Formats for FILE decode fallback
const FILE_FORMATS = [
    Html5QrcodeSupportedFormats.QR_CODE,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.CODE_93,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.CODABAR,
    Html5QrcodeSupportedFormats.DATA_MATRIX,
    Html5QrcodeSupportedFormats.PDF_417,
];

// BarcodeDetector format list (native Chrome on Android)
const NATIVE_FORMATS = [
    'qr_code', 'code_128', 'code_39', 'code_93',
    'ean_13', 'ean_8', 'upc_a', 'upc_e',
    'pdf417', 'data_matrix', 'codabar', 'itf',
];

// Decode a QR/barcode from a static image File — fallback when live unavailable
async function decodeQrFromFile(file, onSuccess) {
    const helperId = "__mrn_qr_file_helper__";
    if (!document.getElementById(helperId)) {
        const div = document.createElement("div");
        div.id = helperId;
        div.style.display = "none";
        document.body.appendChild(div);
    }
    try {
        const reader = new Html5Qrcode(helperId, { formatsToSupport: FILE_FORMATS, verbose: false });
        const result = await reader.scanFile(file, false);
        onSuccess(result);
    } catch (err) {
        console.error("QR/barcode file decode error:", err);
        alert("No QR code or barcode found in the photo. Please hold the camera closer and ensure the code is fully visible.");
    }
}

// Live-stream QR + Barcode scanner overlay
// Strategy:
//   1. getUserMedia → show live video stream
//   2a. BarcodeDetector (Chrome on Android) — hardware-accelerated detection on each rAF frame
//   2b. Canvas-frame fallback — every 500ms capture a still from the video and feed it to
//       Html5Qrcode.scanFile() (same decoder the user confirmed works with photos)
//   3. If getUserMedia is denied → show photo-capture fallback button
function QrScannerOverlay({ onScan, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);
    const timerRef = useRef(null);
    const isMountedRef = useRef(true);
    const scanningRef = useRef(false); // prevent overlapping decode calls
    const [scanError, setScanError] = React.useState(null);
    const [hint, setHint] = React.useState("Starting camera…");
    const helperId = "__mrn_qr_canvas_helper__";

    useEffect(() => {
        isMountedRef.current = true;
        startScanner();
        return () => {
            isMountedRef.current = false;
            stopAll();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function stopAll() {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    }

    async function startScanner() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } }
            });
            if (!isMountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }

            streamRef.current = stream;
            const video = videoRef.current;
            video.srcObject = stream;
            await video.play();
            setHint(null);

            // ── Path A: BarcodeDetector (Chrome Android 83+, hardware-accelerated) ──
            if ('BarcodeDetector' in window) {
                let formats = NATIVE_FORMATS;
                try {
                    const avail = await window.BarcodeDetector.getSupportedFormats();
                    const filtered = NATIVE_FORMATS.filter(f => avail.includes(f));
                    if (filtered.length) formats = filtered;
                } catch(e) {}
                const detector = new window.BarcodeDetector({ formats });

                const loop = async () => {
                    if (!isMountedRef.current) return;
                    try {
                        if (video.readyState >= 2) {
                            const results = await detector.detect(video);
                            if (results && results.length > 0) {
                                stopAll();
                                if (isMountedRef.current) onScan(results[0].rawValue);
                                return;
                            }
                        }
                    } catch(e) { /* frame miss — ignore */ }
                    rafRef.current = requestAnimationFrame(loop);
                };
                rafRef.current = requestAnimationFrame(loop);

            } else {
                // ── Path B: canvas-frame capture → Html5Qrcode.scanFile() every 500ms ──
                // Ensure helper div exists (used as hidden container for Html5Qrcode)
                if (!document.getElementById(helperId)) {
                    const div = document.createElement("div");
                    div.id = helperId;
                    div.style.display = "none";
                    document.body.appendChild(div);
                }
                const canvas = canvasRef.current;

                const decodeFrame = async () => {
                    if (!isMountedRef.current || scanningRef.current) return;
                    if (!video || video.readyState < 2 || video.videoWidth === 0) return;

                    scanningRef.current = true;
                    try {
                        // Draw current video frame to canvas
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        canvas.getContext('2d').drawImage(video, 0, 0);

                        // Convert canvas to Blob → File
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
                        if (!isMountedRef.current) return;
                        const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });

                        // Decode using the same scanFile path that works for photos
                        const reader = new Html5Qrcode(helperId, { formatsToSupport: FILE_FORMATS, verbose: false });
                        const result = await reader.scanFile(file, false);

                        // Found!
                        stopAll();
                        if (isMountedRef.current) onScan(result);
                    } catch(e) {
                        // No code in this frame — try again next interval
                        scanningRef.current = false;
                    }
                };

                // Run every 500ms — fast enough for live feel, not so fast as to overload CPU
                timerRef.current = setInterval(decodeFrame, 500);
            }

        } catch (err) {
            if (!isMountedRef.current) return;
            if (err && err.name === "NotAllowedError") {
                setScanError("Camera access was denied. Tap \"Open Camera\" below to scan using a photo.");
            } else {
                setScanError("Could not start camera. Tap \"Open Camera\" below to scan using a photo.");
            }
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{ width: '100%', maxWidth: '460px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 style={{ color: 'white', margin: 0, fontWeight: '700', fontSize: '18px' }}>
                        <i className="fas fa-barcode" style={{ marginRight: '8px', color: '#a78bfa' }}></i>
                        Scan QR Code or Barcode
                    </h5>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                        borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer',
                        fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>&#x2715;</button>
                </div>

                {/* Starting hint */}
                {hint && !scanError && (
                    <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>
                        {hint}
                    </p>
                )}

                {/* Live video viewport — always rendered so videoRef is available to useEffect */}
                <div style={{
                    display: scanError ? 'none' : 'block',
                    position: 'relative', width: '100%', borderRadius: '14px', overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.7)', border: '3px solid rgba(167,139,250,0.8)'
                }}>
                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        style={{ width: '100%', display: 'block', background: '#000' }}
                    />
                    {/* Guide box overlay */}
                    {!hint && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '72%', height: '44%',
                            border: '3px solid rgba(167,139,250,0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                            pointerEvents: 'none'
                        }} />
                    )}
                </div>

                {/* Hidden canvas for frame capture (Path B) */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Hints */}
                {!scanError && !hint && (
                    <>
                        <div style={{ marginTop: '14px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <span style={{
                                backgroundColor: 'rgba(167,139,250,0.2)', borderRadius: '20px',
                                padding: '6px 14px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600'
                            }}>
                                <i className="fas fa-qrcode" style={{ marginRight: '5px' }}></i>QR Code
                            </span>
                            <span style={{
                                backgroundColor: 'rgba(167,139,250,0.2)', borderRadius: '20px',
                                padding: '6px 14px', color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600'
                            }}>
                                <i className="fas fa-barcode" style={{ marginRight: '5px' }}></i>Barcode
                            </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '10px', fontSize: '13px' }}>
                            Hold steady — scanning automatically
                        </p>
                    </>
                )}

                {/* Error state with photo fallback */}
                {scanError && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <i className="fas fa-exclamation-triangle" style={{ fontSize: '40px', color: '#fbbf24', marginBottom: '14px', display: 'block' }}></i>
                        <p style={{ color: 'white', fontSize: '15px', fontWeight: '600', marginBottom: '24px' }}>{scanError}</p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('__mrn_qr_file_input__').click()}
                            style={{
                                padding: '14px 28px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white', fontSize: '16px', fontWeight: '700',
                                cursor: 'pointer', width: '100%',
                                boxShadow: '0 4px 16px rgba(102,126,234,0.5)'
                            }}
                        >
                            <i className="fas fa-camera" style={{ marginRight: '8px' }}></i>
                            Open Camera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function generateMrnIssuanceDisplay(componentList, mrnDetails, issuanceStatus, showQrScanner, onQrScanSuccess, onQrScanClose) {

    function handleQrFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            // close overlay first so QR file decode result can flow back cleanly
            if (onQrScanClose) onQrScanClose();
            decodeQrFromFile(file, onQrScanSuccess);
        }
        e.target.value = "";
    }

    return (
        <>
            <div className="loading" id="spinner" style={{ display: "none" }}>Loading&#8230;</div>

            {/* Live QR scanner overlay */}
            {showQrScanner && (
                <QrScannerOverlay onScan={onQrScanSuccess} onClose={onQrScanClose} />
            )}

            {/* Hidden file input — fallback when live stream is not available.
                capture="environment" opens the rear camera without browser permission. */}
            <input
                type="file"
                id="__mrn_qr_file_input__"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleQrFileChange}
            />

            {/* Complete Issuance Confirmation Popup */}
            <PopUpPage item={componentList["completePopUp"]} headerText="Confirm Complete Issuance" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-check-circle" style={{fontSize: '48px', color: '#28a745'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Complete MRN Issuance</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to complete this MRN issuance? <br/>
                        You won't be able to delete transactions after completion.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-success mr-2" item={componentList["buttonCompleteYes"]}>
                            <i className="fas fa-check mr-1"></i> Yes, Complete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonCompleteNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            {/* Delete Transaction Confirmation Popup */}
            <PopUpPage item={componentList["deleteTransactionPopUp"]} headerText="Confirm Delete" className="">
                <div className="p-4">
                    <div className="text-center mb-3">
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '48px', color: '#dc3545'}}></i>
                    </div>
                    <h5 className="text-center mb-3" style={{color: '#3a4a6b'}}>Delete Transaction</h5>
                    <p className="text-center mb-4" style={{color: '#7b8eb5'}}>
                        Are you sure you want to delete this transaction?
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                        <Button className="btn btn-danger mr-2" item={componentList["buttonDeleteYes"]}>
                            <i className="fas fa-trash mr-1"></i> Yes, Delete
                        </Button>
                        <Button className="btn btn-secondary" item={componentList["buttonDeleteNo"]}>
                            <i className="fas fa-times mr-1"></i> Cancel
                        </Button>
                    </div>
                </div>
            </PopUpPage>

            <ControlCenter item={componentList["CONTROL_CENTER"]}>
                {/* Header Section */}
                <div className="page-header-wrp">
                    <div className="title-breadcrumb-wrp">
                        <h1 className="">{componentList["CONTROL_CENTER"].label.schema.value}</h1>
                    </div>
                </div>


                <div className="container-fluid custom-container-padding">
                    {/* MRN Scan Section */}
                    <div className="form-wrp mb-4 p-4" style={{
                        borderRadius: '16px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                    }}>
                        <div className="row align-items-center mb-3">
                            <div className="col-auto">
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-barcode" style={{fontSize: '24px', color: 'white'}}></i>
                                </div>
                            </div>
                            <div className="col">
                                <h5 className="mb-1" style={{
                                    color: 'white', 
                                    fontWeight: '800',
                                    fontSize: '20px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Scan MRN
                                </h5>
                                <p className="mb-0" style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '13px',
                                    fontWeight: '500'
                                }}>
                                    Enter or scan MRN ID to begin
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group mb-2">
                                    <div className="row align-items-center">
                                        <div className="col-10">
                                            <div className="input-group">
                                                <NumberField 
                                                    item={componentList["inputMrnScan"]} 
                                                    className="form-control form-control-lg" 
                                                    placeholder="Scan or type MRN ID and press Enter"
                                                    style={{
                                                        fontSize: '18px',
                                                        padding: '16px 20px',
                                                        borderRadius: '12px',
                                                        border: '3px solid rgba(255, 255, 255, 0.3)',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        fontWeight: '700',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                        transition: 'all 0.3s ease',
                                                        color: '#1e293b',
                                                        flex: 1
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            {/* Advance Search Section */}
                                            <div className="input-group d-flex justify-content-end">
                                                <ControlCenter item={componentList["CONTROL_CENTER"]} >
                                                    <AdvanceSearch item={componentList["CONTROL_CENTER"]} className="advance-search" >
                                                        <AdvanceSearchGrid typeName="AdvanceSearchGrid" />
                                                        <AdvanceSearchButton typeName="AdvanceSearchButton" text="OK" />
                                                    </AdvanceSearch>
                                                    <Button className="btn common-btn common-btn-erp btn-sm mr-2" item={componentList["buttonAdvanceSearch"]}>
                                                        <i className="fas fa-search fa-lg"></i>
                                                    </Button>
                                                </ControlCenter>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <small style={{
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-keyboard mr-2"></i>
                                        Press <kbd style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: '700'
                                        }}>Enter</kbd> to load MRN details
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MRN Details Section - Only show when MRN is loaded */}
                    {componentList["inputMrnID"].data.value !== "" && (
                        <div className="form-wrp background-white mb-4 p-4" style={{
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '2px solid #e2e8f0'
                        }}>
                            <div
                                className="d-flex justify-content-between align-items-center mb-0"
                                data-toggle="collapse"
                                data-target="#mrnDetailsCollapse"
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '16px'
                                    }}>
                                        <i className="fas fa-file-alt" style={{color: 'white', fontSize: '20px'}}></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-0" style={{
                                            color: '#1e293b', 
                                            fontWeight: '800',
                                            fontSize: '18px',
                                            letterSpacing: '-0.3px'
                                        }}>
                                            MRN Details
                                        </h5>
                                        <small style={{color: '#64748b', fontSize: '12px', fontWeight: '600'}}>Material Receipt Note Information</small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center" style={{gap: '10px'}}>
                                    {componentList["buttonCompleteIssuance"].schema.visible && issuanceStatus !== "completed" && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <Button 
                                                item={componentList["buttonCompleteIssuance"]}
                                                style={{
                                                    padding: '12px 24px',
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                                    transition: 'all 0.3s ease',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                <i className="fas fa-check-double mr-2"></i> Complete Issuance
                                            </Button>
                                        </div>
                                    )}
                                    <i className="fas fa-chevron-down" style={{color: '#3b82f6', fontSize: '14px'}}></i>
                                </div>
                            </div>

                            <div className="collapse" id="mrnDetailsCollapse">
                            <div className="row mt-4">
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#f8fafc',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #e2e8f0'
                                    }}>
                                        <small style={{
                                            color: '#64748b',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-hashtag mr-1"></i>{componentList["inputMrnID"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#1e293b',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputMrnID"].data.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#f0fdf4',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #bbf7d0'
                                    }}>
                                        <small style={{
                                            color: '#15803d',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-toggle-on mr-1"></i>{componentList["inputStatus"].label.schema.value}
                                        </small>
                                        <span style={{
                                            backgroundColor: '#22c55e',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {componentList["inputStatus"].data.value}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#fef3c7',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #fde68a'
                                    }}>
                                        <small style={{
                                            color: '#92400e',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-layer-group mr-1"></i>{componentList["inputBatchNo"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#78350f',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputBatchNo"].data.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#e0e7ff',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #c7d2fe'
                                    }}>
                                        <small style={{
                                            color: '#3730a3',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-warehouse mr-1"></i>{componentList["inputWarehouse"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#312e81',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputWarehouse"].data.value}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6 mb-3">
                                    <div style={{
                                        backgroundColor: '#fdf2f8',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: '2px solid #f9a8d4'
                                    }}>
                                        <small style={{
                                            color: '#9d174d',
                                            fontWeight: '700',
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            marginBottom: '8px'
                                        }}>
                                            <i className="fas fa-user mr-1"></i>{componentList["inputIssuedTo"].label.schema.value}
                                        </small>
                                        <div style={{
                                            color: '#831843',
                                            fontWeight: '800',
                                            fontSize: '16px'
                                        }}>
                                            {componentList["inputIssuedTo"].data.value || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>{/* end mrnDetailsCollapse */}
                        </div>
                    )}

                    {/* MRN Details Cards - Material Items */}
                    {componentList["inputMrnID"].data.value !== "" && mrnDetails.length > 0 && (
                        <div className="form-wrp background-white p-3" style={{borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)'}}>
                            <div 
                                className="d-flex justify-content-between align-items-center mb-3"
                                data-toggle="collapse"
                                data-target="#materialItemsCollapse"
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                <h5 className="mb-0" style={{
                                    color: '#2c3e50', 
                                    fontWeight: '700',
                                    fontSize: '20px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    <i className="fas fa-boxes mr-2" style={{color: '#638ad6'}}></i>Material Items
                                </h5>
                                <div className="d-flex align-items-center" style={{gap: '10px'}}>
                                    <span style={{
                                        backgroundColor: '#638ad6',
                                        color: 'white',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        {mrnDetails.length} Items
                                    </span>
                                    <i className="fas fa-chevron-down" style={{color: '#638ad6', fontSize: '14px'}}></i>
                                </div>
                            </div>
                            <div className="collapse show" id="materialItemsCollapse">
                            <div className="row">
                                {mrnDetails.map((detail, index) => (
                                    <div key={detail.mrn_detail_id || index} className="col-md-6 col-lg-4 col-12 mb-4">
                                        <div className="card" style={{
                                            border: 'none',
                                            borderRadius: '16px',
                                            boxShadow: detail.is_issued 
                                                ? '0 4px 20px rgba(40, 167, 69, 0.15)' 
                                                : '0 4px 20px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            overflow: 'hidden',
                                            background: detail.is_issued 
                                                ? 'linear-gradient(135deg, #ffffff 0%, #f0f9f4 100%)'
                                                : 'white',
                                            transform: 'translateY(0)',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = detail.is_issued
                                                ? '0 8px 30px rgba(40, 167, 69, 0.2)'
                                                : '0 8px 30px rgba(0,0,0,0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = detail.is_issued
                                                ? '0 4px 20px rgba(40, 167, 69, 0.15)'
                                                : '0 4px 20px rgba(0,0,0,0.08)';
                                        }}>
                                            {/* Card Top Accent */}
                                            <div style={{
                                                height: '4px',
                                                background: detail.is_issued 
                                                    ? 'linear-gradient(90deg, #28a745 0%, #20c997 100%)'
                                                    : 'linear-gradient(90deg, #638ad6 0%, #4a90e2 100%)'
                                            }}></div>

                                            {/* Collapsible Card Header */}
                                            <div
                                                className="d-flex justify-content-between align-items-center px-4 py-3"
                                                data-toggle="collapse"
                                                data-target={`#cardBody-${detail.mrn_detail_id || index}`}
                                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '700',
                                                        fontSize: '14px',
                                                        marginRight: '12px',
                                                        flexShrink: 0
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#95a5a6',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>Item</div>
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#2d3748',
                                                            fontWeight: '700',
                                                            marginTop: '2px',
                                                            maxWidth: '140px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>{detail.material_name || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center" style={{gap: '8px'}}>
                                                    {detail.is_issued ? (
                                                        <span style={{
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            padding: '3px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: '700'
                                                        }}>
                                                            <i className="fas fa-check-circle mr-1"></i>Issued
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            backgroundColor: '#ffc107',
                                                            color: '#664d03',
                                                            padding: '3px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: '700'
                                                        }}>
                                                            <i className="fas fa-clock mr-1"></i>Pending
                                                        </span>
                                                    )}
                                                    {issuanceStatus !== "completed" && detail.is_issued && (
                                                        <button 
                                                            className="btn btn-sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.handleDeleteIssuance) {
                                                                    window.handleDeleteIssuance(detail.mrn_detail_id);
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '4px 10px',
                                                                fontSize: '12px',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#fff5f5',
                                                                color: '#e53e3e',
                                                                border: '1px solid #feb2b2',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#e53e3e';
                                                                e.currentTarget.style.color = 'white';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#fff5f5';
                                                                e.currentTarget.style.color = '#e53e3e';
                                                            }}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    )}
                                                    <i className="fas fa-chevron-down" style={{color: '#94a3b8', fontSize: '12px'}}></i>
                                                </div>
                                            </div>

                                            {/* Collapsible Card Body */}
                                            <div className="collapse" id={`cardBody-${detail.mrn_detail_id || index}`}>
                                            <div className="card-body p-4">
                                                
                                                {/* Material Info */}
                                                <div className="mb-3" style={{
                                                    backgroundColor: '#f8fafc',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <small style={{
                                                        color: '#718096', 
                                                        fontWeight: '600',
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        <i className="fas fa-cube mr-1"></i>Material
                                                    </small>
                                                    <div style={{
                                                        color: '#2d3748', 
                                                        fontWeight: '700', 
                                                        fontSize: '12px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {detail.material_name || 'N/A'}
                                                    </div>
                                                </div>

                                                {/* Issued To */}
                                                <div className="mb-3">
                                                    <small style={{
                                                        color: '#718096',
                                                        fontWeight: '600',
                                                        fontSize: '11px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        <i className="fas fa-user mr-1"></i>Issued To
                                                    </small>
                                                    <div style={{
                                                        color: '#2d3748',
                                                        fontWeight: '700',
                                                        fontSize: '12px',
                                                        marginTop: '4px'
                                                    }}>
                                                        {detail.issued_to || 'N/A'}
                                                    </div>
                                                </div>
                                                
                                                {/* Status Row */}
                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: '#e6f7ff',
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center'
                                                        }}>
                                                            <small style={{
                                                                color: '#1890ff', 
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                MRN Qty
                                                            </small>
                                                            <div style={{
                                                                color: '#0050b3', 
                                                                fontWeight: '800',
                                                                fontSize: '20px',
                                                                marginTop: '2px'
                                                            }}>
                                                                {detail.mrn_qty || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div style={{
                                                            backgroundColor: detail.is_issued ? '#f0f9f4' : '#fff5f5',
                                                            padding: '10px',
                                                            borderRadius: '10px',
                                                            textAlign: 'center'
                                                        }}>
                                                            <small style={{
                                                                color: detail.is_issued ? '#28a745' : '#e53e3e', 
                                                                fontWeight: '600',
                                                                fontSize: '10px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px',
                                                                display: 'block'
                                                            }}>
                                                                Status
                                                            </small>
                                                            <div style={{
                                                                marginTop: '4px'
                                                            }}>
                                                                {detail.is_issued ? (
                                                                    <span style={{
                                                                        backgroundColor: '#28a745',
                                                                        color: 'white',
                                                                        padding: '4px 12px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '11px',
                                                                        fontWeight: '700'
                                                                    }}>
                                                                        <i className="fas fa-check-circle mr-1"></i>Issued
                                                                    </span>
                                                                ) : (
                                                                    <span style={{
                                                                        backgroundColor: '#ffc107',
                                                                        color: '#664d03',
                                                                        padding: '4px 12px',
                                                                        borderRadius: '12px',
                                                                        fontSize: '11px',
                                                                        fontWeight: '700'
                                                                    }}>
                                                                        <i className="fas fa-clock mr-1"></i>Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    height: '1px',
                                                    background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
                                                    margin: '16px 0'
                                                }}></div>

                                                {/* Location Scan Section - hide when already issued */}
                                                {!detail.is_issued && <div className="mb-3">
                                                    <label style={{
                                                        color: '#4a5568', 
                                                        fontWeight: '700',
                                                        fontSize: '12px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        marginBottom: '8px',
                                                        display: 'block'
                                                    }}>
                                                        <i className="fas fa-barcode mr-2" style={{color: '#638ad6'}}></i>
                                                        Location ID
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Scan or enter location"
                                                        value={detail.location_id || ''}
                                                        onChange={(e) => {
                                                            if (window.handleLocationScan) {
                                                                window.handleLocationScan(detail.mrn_detail_id, e.target.value);
                                                            }
                                                        }}
                                                        disabled={issuanceStatus === "completed"}
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: '12px 16px',
                                                            borderRadius: '10px',
                                                            border: '2px solid #e2e8f0',
                                                            backgroundColor: '#ffffff',
                                                            transition: 'all 0.2s ease',
                                                            fontWeight: '600',
                                                            color: '#1e293b'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.borderColor = '#638ad6';
                                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 138, 214, 0.1)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                </div>}

                                                {/* Available Balance - Show only when location is scanned */}
                                                {detail.location_id && detail.available_balance !== undefined && (
                                                    <div className="mb-3" style={{
                                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                                        padding: '14px',
                                                        borderRadius: '12px',
                                                        border: '2px solid #f59e0b',
                                                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                                                    }}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <small style={{
                                                                    color: '#92400e', 
                                                                    fontWeight: '700',
                                                                    fontSize: '11px',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px',
                                                                    display: 'block'
                                                                }}>
                                                                    <i className="fas fa-layer-group mr-1"></i>Available Balance
                                                                </small>
                                                                <div style={{
                                                                    color: '#78350f', 
                                                                    fontWeight: '800',
                                                                    fontSize: '24px',
                                                                    marginTop: '2px'
                                                                }}>
                                                                    {detail.available_balance || 0}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '12px',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <i className="fas fa-box-open" style={{fontSize: '20px', color: '#d97706'}}></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Issue Quantity */}
                                                {detail.location_id && (
                                                    <div className="mb-3">
                                                        <label style={{
                                                            color: '#4a5568', 
                                                            fontWeight: '700',
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            marginBottom: '8px',
                                                            display: 'block'
                                                        }}>
                                                            <i className="fas fa-hashtag mr-2" style={{color: '#638ad6'}}></i>
                                                            Issue Quantity
                                                        </label>
                                                        <input 
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter quantity to issue"
                                                            value={detail.issue_qty || ''}
                                                            onChange={(e) => {
                                                                if (window.handleIssueQtyChange) {
                                                                    window.handleIssueQtyChange(detail.mrn_detail_id, e.target.value);
                                                                }
                                                            }}
                                                            disabled={issuanceStatus === "completed" || detail.is_issued}
                                                            style={{
                                                                fontSize: '16px',
                                                                padding: '12px 16px',
                                                                borderRadius: '10px',
                                                                border: '2px solid #e2e8f0',
                                                                backgroundColor: '#ffffff',
                                                                transition: 'all 0.2s ease',
                                                                fontWeight: '700',
                                                                color: '#1e293b'
                                                            }}
                                                            onFocus={(e) => {
                                                                e.currentTarget.style.borderColor = '#638ad6';
                                                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 138, 214, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Issue Button */}
                                                {detail.location_id && detail.issue_qty && !detail.is_issued && issuanceStatus !== "completed" && (
                                                    <div className="mt-3">
                                                        <button 
                                                            className="btn btn-block"
                                                            onClick={() => {
                                                                if (window.handleIssueTransaction) {
                                                                    window.handleIssueTransaction(detail.mrn_detail_id);
                                                                }
                                                            }}
                                                            style={{
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                padding: '14px',
                                                                borderRadius: '12px',
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                                transition: 'all 0.3s ease',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                                            }}
                                                        >
                                                            <i className="fas fa-paper-plane mr-2"></i> Issue Material
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Issued Info */}
                                                {detail.is_issued && (
                                                    <div className="mt-3" style={{
                                                        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                                                        borderRadius: '12px',
                                                        padding: '14px',
                                                        border: '2px solid #28a745',
                                                        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
                                                    }}>
                                                        <div className="d-flex align-items-start">
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#28a745',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginRight: '12px',
                                                                flexShrink: 0
                                                            }}>
                                                                <i className="fas fa-check" style={{color: 'white', fontSize: '14px'}}></i>
                                                            </div>
                                                            <div style={{flex: 1}}>
                                                                <div style={{
                                                                    color: '#155724',
                                                                    fontWeight: '700',
                                                                    fontSize: '13px',
                                                                    marginBottom: '4px'
                                                                }}>
                                                                    Successfully Issued
                                                                </div>
                                                                <div style={{
                                                                    color: '#1e7e34',
                                                                    fontSize: '12px',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    <i className="fas fa-cube mr-1"></i>
                                                                    {detail.issued_qty} units issued
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            </div>{/* end collapse card body */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>{/* end materialItemsCollapse */}
                        </div>
                    )}

                    {/* Empty State */}
                    {componentList["inputMrnID"].data.value !== "" && mrnDetails.length === 0 && (
                        <div className="form-wrp background-white p-5 text-center" style={{
                            borderRadius: '16px', 
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 24px',
                                background: 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="fas fa-inbox" style={{fontSize: '48px', color: '#6366f1'}}></i>
                            </div>
                            <h5 style={{
                                color: '#1e293b',
                                fontWeight: '700',
                                marginBottom: '12px',
                                fontSize: '20px'
                            }}>
                                No Materials Found
                            </h5>
                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                maxWidth: '400px',
                                margin: '0 auto'
                            }}>
                                This MRN doesn't contain any material items. Please check the MRN ID and try again.
                            </p>
                        </div>
                    )}
                </div>
            </ControlCenter>
        </>
    );
}
