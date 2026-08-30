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
  'Examination Hall Vault',
];

export default function CheckpointStation({ documents, onLogCheckpoint, getDocumentCheckpoints }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [inputMode, setInputMode] = useState('manual'); // 'manual' | 'qr'
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
  const docCheckpoints = selectedDocId ? getDocumentCheckpoints(selectedDocId) : [];
  const lastCheckpoint = docCheckpoints[docCheckpoints.length - 1];

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
      <SectionHeader number={3} label="HANDOFF VERIFIER & CHECKPOINT LOGGING" />

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
              <h3 className="text-lg font-black text-navy mb-1">Handoff Cryptographically Verified</h3>
              <p className="text-sm text-navy/60 mb-4">
                SHA-256 hash matches previous checkpoint. Document integrity confirmed.
              </p>
              <div className="bg-white brutal-border p-4 max-w-lg mx-auto text-left mb-4">
                <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                  Matching Hash
                </div>
                <div className="font-mono text-xs text-navy break-all">
                  {result.computedHash}
                </div>
              </div>
              <BrutalButton variant="secondary" onClick={handleReset}>
                Log Next Checkpoint
              </BrutalButton>
            </div>
          )}

          {result.status === 'tampered' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-tampered/10 brutal-border flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-tampered" />
                </div>
                <div>
                  <StatusBadge status="tampered" size="lg" />
                  <h3 className="text-lg font-black text-tampered mt-1">
                    TAMPER DETECTED — CHAIN BROKEN
                  </h3>
                </div>
              </div>

              <div className="bg-tampered/10 brutal-border p-4 mb-4">
                <p className="text-sm font-bold text-navy mb-1">
                  Cryptographic Integrity Breach at: {result.stageName}
                </p>
                <p className="text-xs text-navy/70">
                  Custodian Responsible: <strong>{result.custodianName}</strong> ({result.custodianRole || 'Unspecified Role'})
                </p>
                <p className="text-xs text-tampered font-bold mt-1">
                  ⚡ Automated breach notification dispatched to registered authority.
                </p>
              </div>

              {/* Side-by-side hash comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white brutal-border p-4">
                  <div className="font-mono text-[10px] text-verified uppercase tracking-wider font-bold mb-1">
                    Expected Hash (Previous Checkpoint)
                  </div>
                  <div className="font-mono text-xs text-navy break-all">
                    {result.previousHash}
                  </div>
                </div>
                <div className="bg-white brutal-border p-4 border-tampered!">
                  <div className="font-mono text-[10px] text-tampered uppercase tracking-wider font-bold mb-1">
                    Received Hash (This Checkpoint)
                  </div>
                  <div className="font-mono text-xs text-tampered font-bold break-all">
                    {result.computedHash}
                  </div>
                </div>
              </div>

              <BrutalButton variant="danger" onClick={handleReset}>
                Acknowledge & Continue
              </BrutalButton>
            </div>
          )}

          {result.status === 'sealed' && (
            <div className="text-center">
              <StatusBadge status="sealed" size="lg" />
              <h3 className="text-lg font-black text-navy mt-2 mb-1">Genesis Checkpoint Recorded</h3>
              <BrutalButton variant="primary" onClick={handleReset} className="mt-4">
                Continue
              </BrutalButton>
            </div>
          )}
        </div>
      )}

      {/* Main Input Form */}
      <div className="brutal-card-static bg-white p-6">
        <h3 className="font-bold text-navy text-lg mb-4">
          Record Custody Handoff
        </h3>

        {/* Document Selection */}
        <div className="mb-4">
          <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
            Select Document to Verify
          </label>
          <div className="flex gap-2">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="brutal-input flex-1 px-3 py-2.5 text-sm"
            >
              <option value="">-- Select a registered document --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.id} — {doc.title} ({doc.currentStatus.toUpperCase()})
                </option>
              ))}
            </select>
            <BrutalButton
              variant="secondary"
              onClick={() => setShowScanner(!showScanner)}
              className="shrink-0"
            >
              <span className="flex items-center gap-1.5">
                <ScanLine className="w-4 h-4" />
                Scan QR
              </span>
            </BrutalButton>
          </div>
        </div>

        {/* QR Scanner modal */}
        {showScanner && (
          <div className="mb-4 p-4 bg-navy/5 brutal-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-navy">
                Camera QR Scanner
              </span>
              <button
                type="button"
                onClick={() => setShowScanner(false)}
                className="text-xs font-mono text-navy/50 hover:text-navy"
              >
                Close
              </button>
            </div>
            <QRScanner onScanSuccess={handleQRScan} />
          </div>
        )}

        {/* Selected Document Info Banner */}
        {selectedDoc && (
          <div className="mb-4 p-3 bg-cream brutal-border text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-navy">{selectedDoc.id}</span>
                <span className="text-navy/60 ml-2">{selectedDoc.title}</span>
              </div>
              <StatusBadge status={selectedDoc.currentStatus} size="sm" />
            </div>
            {lastCheckpoint && (
              <div className="mt-1 font-mono text-[10px] text-navy/50">
                Previous Hash: {shortHash(lastCheckpoint.computedHash)} (at {lastCheckpoint.stageName})
              </div>
            )}
          </div>
        )}

        {/* Stage & Custodian Inputs */}
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Handoff Stage
            </label>
            {!showCustomStage ? (
              <div className="flex gap-1">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="brutal-input flex-1 px-3 py-2 text-sm"
                >
                  {DEFAULT_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomStage(true)}
                  className="brutal-btn bg-white px-2 py-1 text-xs"
                  title="Custom stage"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value)}
                  placeholder="Enter custom stage"
                  className="brutal-input flex-1 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCustomStage(false)}
                  className="brutal-btn bg-white px-2 py-1 text-xs"
                >
                  Preset
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Receiving Custodian Name
            </label>
            <input
              type="text"
              value={custodianName}
              onChange={(e) => setCustodianName(e.target.value)}
              placeholder="e.g., Shri. V. N. More"
              className="brutal-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Designation / Station
            </label>
            <input
              type="text"
              value={custodianRole}
              onChange={(e) => setCustodianRole(e.target.value)}
              placeholder="e.g., Treasury Officer"
              className="brutal-input w-full px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Content input for verification */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider">
              Document Content at Handoff Point
            </label>
            {selectedDoc && lastCheckpoint && (
              <button
                type="button"
                onClick={() => setContent(lastCheckpoint.contentSnapshot || '')}
                className="text-[10px] font-mono text-teal hover:underline"
              >
                Copy Previous Content (Clean)
              </button>
            )}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or inspect document text to re-verify cryptographic hash..."
            rows={4}
            className="brutal-input w-full px-3 py-2.5 text-sm resize-none font-mono"
          />
        </div>

        <BrutalButton
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedDocId || !content.trim() || isProcessing}
        >
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {isProcessing ? 'Verifying Cryptographic Hash…' : 'Verify & Log Checkpoint'}
          </span>
        </BrutalButton>
      </div>
    </section>
  );
}
