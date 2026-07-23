import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

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
export async function decodeQrFromFile(file, onSuccess) {
    const helperId = "__qr_file_helper__";
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
export function QrScannerOverlay({ onScan, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);
    const timerRef = useRef(null);
    const isMountedRef = useRef(true);
    const scanningRef = useRef(false); // prevent overlapping decode calls
    const [scanError, setScanError] = React.useState(null);
    const [hint, setHint] = React.useState("Starting camera…");
    const helperId = "__qr_canvas_helper__";

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
                            onClick={() => document.getElementById('__qr_file_input__').click()}
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
