import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, X } from 'lucide-react';
import BrutalButton from './ui/BrutalButton';

export default function QRScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanner = useCallback(async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      
      const scanner = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = scanner;
      setScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // QR code not found in frame — ignore
        }
      );
    } catch (err) {
      console.error('QR Scanner error:', err);
      setError('Camera access denied or unavailable. Please use manual document ID entry.');
      setScanning(false);
    }
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // Scanner may already be stopped
      }
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="brutal-card-static bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-teal" />
          <span className="font-mono text-xs font-bold text-navy uppercase tracking-wider">
            QR Scanner Active
          </span>
        </div>
        <button
          onClick={() => { stopScanner(); onClose(); }}
          className="w-7 h-7 bg-navy/10 brutal-border flex items-center justify-center hover:bg-navy/20 transition-colors"
        >
          <X className="w-4 h-4 text-navy" />
        </button>
      </div>

      {error ? (
        <div className="bg-amber/10 brutal-border p-4 text-center">
          <CameraOff className="w-8 h-8 text-amber mx-auto mb-2" />
          <p className="text-sm text-navy font-semibold">{error}</p>
        </div>
      ) : (
        <div className="relative">
          <div
            id="qr-reader"
            ref={scannerRef}
            className="w-full overflow-hidden brutal-border"
            style={{ minHeight: '280px' }}
          />
          {scanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[200px] h-[200px] border-4 border-teal scan-pulse rounded-sm" />
            </div>
          )}
        </div>
      )}

      <p className="font-mono text-[10px] text-navy/40 mt-3 text-center">
        Point camera at a PaperTrail QR code to auto-load document
      </p>
    </div>
  );
}
