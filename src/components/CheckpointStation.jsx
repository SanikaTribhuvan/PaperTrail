import { useState, useCallback } from 'react';
import { ScanLine, Keyboard, ShieldCheck, ShieldAlert, ChevronDown, Plus } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import QRScanner from './QRScanner';
import { shortHash } from '../utils/crypto';

const DEFAULT_STAGES = [
  'Printing & Packaging',
  'Armored Transit Inbound',
  'District Treasury Strongroom',
  'Center Custody Handover',
];

export default function CheckpointStation({ documents, onLogCheckpoint, getDocumentCheckpoints }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [stage, setStage] = useState(DEFAULT_STAGES[0]);
  const [customStage, setCustomStage] = useState('');
  const [showCustomStage, setShowCustomStage] = useState(false);
  const [custodianName, setCustodianName] = useState('');
  const [custodianRole, setCustodianRole] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleQRScan = useCallback((decodedText) => {
    const docId = decodedText.trim();
    if (documents.find(d => d.id === docId)) {
      setSelectedDocId(docId);
    }
    setShowScanner(false);
  }, [documents]);

  const handleSubmit = useCallback(async () => {
    if (!selectedDocId || !content.trim()) return;
    setIsProcessing(true);

    const stageName = showCustomStage ? customStage : stage;
    const checkpoint = await onLogCheckpoint(
      selectedDocId,
      stageName,
      custodianName,
      custodianRole,
      content
    );

    setResult(checkpoint);
    setIsProcessing(false);
  }, [selectedDocId, content, stage, customStage, showCustomStage, custodianName, custodianRole, onLogCheckpoint]);

  const handleReset = () => {
    setResult(null);
    setContent('');
    setCustodianName('');
    setCustodianRole('');
    setStage(DEFAULT_STAGES[0]);
    setCustomStage('');
    setShowCustomStage(false);
  };

  return (
    <section className="mb-10">
      <SectionHeader number={3} label="HANDOFF VERIFIER & CHAIN SCANNER" />

      {/* Result Display */}
      {result && (
        <div className={`mb-6 brutal-card-static p-6 ${
          result.status === 'verified' ? 'bg-verified/5 border-verified!' : 
          result.status === 'tampered' ? 'bg-tampered/5 border-tampered!' : 'bg-sealed/5'
        }`}>
          {result.status === 'verified' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-3">
                <ShieldCheck className="w-10 h-10 text-verified" />
                <div>
                  <StatusBadge status="verified" size="lg" />
                </div>
              </div>
              <p className="text-lg font-bold text-navy mb-1">
                No Tampering Detected
              </p>
              <p className="text-sm text-navy/60 mb-4">
                Cryptographic fingerprint matches the previous checkpoint. Document integrity intact.
              </p>
              <div className="inline-block bg-white brutal-border p-4 text-left">
                <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                  Matching SHA-256 Fingerprint
                </div>
                <div className="font-mono text-xs text-verified break-all">
                  {result.computedHash}
                </div>
              </div>
            </div>
          )}

          {result.status === 'tampered' && (
            <div className="tamper-strobe">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-3 mb-3">
                  <ShieldAlert className="w-10 h-10 text-tampered" />
                  <div>
                    <StatusBadge status="tampered" size="lg" />
                  </div>
                </div>
                <p className="text-lg font-bold text-tampered mb-1">
                  ⚠ TAMPERING DETECTED AT THIS CHECKPOINT
                </p>
                <p className="text-sm text-navy/60">
                  Breach occurred under custody of <strong className="text-navy">{result.custodianName}</strong> during <strong className="text-navy">{result.stageName}</strong>.
                </p>
              </div>

              {/* Cryptographic diff viewer */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white brutal-border p-4">
                  <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-verified rounded-full" />
                    Expected Hash (Previous Checkpoint)
                  </div>
                  <div className="font-mono text-xs text-verified break-all bg-verified/5 p-2">
                    {result.tamperDetails?.expectedHash || result.previousHash}
                  </div>
                </div>
                <div className="bg-white brutal-border p-4">
                  <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-tampered rounded-full" />
                    Actual Computed Hash (This Checkpoint)
                  </div>
                  <div className="font-mono text-xs text-tampered break-all bg-tampered/5 p-2">
                    {result.tamperDetails?.receivedHash || result.computedHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <BrutalButton variant="ghost" onClick={handleReset}>
              Log Another Checkpoint
            </BrutalButton>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Document Selection */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy mb-4">Document Selection</h3>

          {/* Dual path: Scanner + Manual */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <BrutalButton
              variant={showScanner ? 'teal' : 'ghost'}
              onClick={() => setShowScanner(!showScanner)}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <ScanLine className="w-4 h-4" />
                Scan QR
              </span>
            </BrutalButton>
            <BrutalButton
              variant={!showScanner ? 'teal' : 'ghost'}
              onClick={() => setShowScanner(false)}
              className="w-full"
            >
              <span className="flex items-center justify-center gap-2">
                <Keyboard className="w-4 h-4" />
                Enter ID
              </span>
            </BrutalButton>
          </div>

          {showScanner ? (
            <QRScanner
              onScan={handleQRScan}
              onClose={() => setShowScanner(false)}
            />
          ) : (
            <div className="mb-4">
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Document ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  placeholder="DOC-MH-2026-XXXX"
                  className="brutal-input flex-1 px-3 py-2.5 text-sm font-mono"
                />
              </div>

              {/* Auto-suggest dropdown */}
              {selectedDocId && !selectedDoc && documents.length > 0 && (
                <div className="brutal-border bg-white mt-1 max-h-32 overflow-y-auto">
                  {documents
                    .filter(d => d.id.toLowerCase().includes(selectedDocId.toLowerCase()) ||
                                  d.title.toLowerCase().includes(selectedDocId.toLowerCase()))
                    .map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className="w-full text-left px-3 py-2 hover:bg-cream transition-colors text-sm border-b border-black/10 last:border-0"
                      >
                        <span className="font-mono text-xs font-bold text-navy">{doc.id}</span>
                        <span className="text-navy/60 ml-2">{doc.title}</span>
                      </button>
                    ))
                  }
                </div>
              )}

              {/* Or pick from dropdown */}
              {documents.length > 0 && (
                <div className="mt-3">
                  <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                    Or Select Document
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="brutal-input w-full px-3 py-2.5 text-sm appearance-none bg-white pr-10"
                    >
                      <option value="">— Select a document —</option>
                      {documents.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.id} — {doc.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected document info */}
          {selectedDoc && (
            <div className="bg-navy/5 brutal-border p-3 mt-3">
              <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                Selected Document
              </div>
              <div className="font-bold text-sm text-navy">{selectedDoc.title}</div>
              <div className="font-mono text-xs text-navy/50 mt-1">{selectedDoc.id}</div>
              <div className="mt-2">
                <StatusBadge status={selectedDoc.currentStatus} />
              </div>
            </div>
          )}
        </div>

        {/* Handoff Form */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy mb-4">Handoff Details</h3>

          {/* Stage dropdown */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Checkpoint Stage
            </label>
            {!showCustomStage ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="brutal-input w-full px-3 py-2.5 text-sm appearance-none bg-white pr-10"
                  >
                    {DEFAULT_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 pointer-events-none" />
                </div>
                <button
                  onClick={() => setShowCustomStage(true)}
                  className="brutal-btn bg-cream px-3 py-2 text-navy"
                  title="Add custom stage"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value)}
                  placeholder="Enter custom stage name…"
                  className="brutal-input flex-1 px-3 py-2.5 text-sm"
                />
                <button
                  onClick={() => { setShowCustomStage(false); setCustomStage(''); }}
                  className="brutal-btn bg-cream px-3 py-2 text-navy text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Custodian */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Custodian Name
              </label>
              <input
                type="text"
                value={custodianName}
                onChange={(e) => setCustodianName(e.target.value)}
                placeholder="Shri. A. D. Kulkarni"
                className="brutal-input w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Designation ID
              </label>
              <input
                type="text"
                value={custodianRole}
                onChange={(e) => setCustodianRole(e.target.value)}
                placeholder="District Treasury Officer"
                className="brutal-input w-full px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Inspected Payload Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the document content as inspected at this checkpoint…"
              rows={6}
              className="brutal-input w-full px-3 py-2.5 text-sm resize-none font-mono"
            />
          </div>

          <BrutalButton
            variant="teal"
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedDocId || !content.trim() || isProcessing || !selectedDoc}
          >
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {isProcessing ? 'Verifying Hash Chain…' : 'Verify & Log Checkpoint'}
            </span>
          </BrutalButton>
        </div>
      </div>
    </section>
  );
}
