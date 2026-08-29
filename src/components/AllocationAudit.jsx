import { useState, useCallback, useEffect, useMemo } from 'react';
import { ScanLine, Keyboard, ShieldCheck, ShieldAlert, ChevronDown, Plus, Mail, Gauge } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import QRScanner from './QRScanner';
import { buildHashPayload, calculatePriorityScore } from '../utils/priorityEngine';

const DEFAULT_STAGES = [
  'Initial Assessment',
  'Budget Committee Review',
  'Tender Publication',
  'Contractor Assignment',
  'Execution Phase'
];

export default function AllocationAudit({ documents, onLogCheckpoint, getDocumentCheckpoints }) {
  const [selectedDocId, setSelectedDocId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [stage, setStage] = useState(DEFAULT_STAGES[1]);
  const [customStage, setCustomStage] = useState('');
  const [showCustomStage, setShowCustomStage] = useState(false);
  const [custodianName, setCustodianName] = useState('');
  const [custodianRole, setCustodianRole] = useState('');
  
  // Audited metrics
  const [citizenImpact, setCitizenImpact] = useState(5);
  const [hazardRisk, setHazardRisk] = useState(5);
  const [estimatedCost, setEstimatedCost] = useState(100000);
  const [password, setPassword] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const selectedDoc = useMemo(() => documents.find(d => d.id === selectedDocId), [documents, selectedDocId]);

  // Pre-fill metrics when document is selected (so user can confirm or alter them)
  useEffect(() => {
    if (selectedDoc && selectedDoc.metrics) {
      setCitizenImpact(selectedDoc.metrics.citizenImpact);
      setHazardRisk(selectedDoc.metrics.hazardRisk);
      setEstimatedCost(selectedDoc.metrics.estimatedCost);
    }
  }, [selectedDoc]);

  const handleQRScan = useCallback((decodedText) => {
    const docId = decodedText.trim();
    if (documents.find(d => d.id === docId)) {
      setSelectedDocId(docId);
    }
    setShowScanner(false);
  }, [documents]);

  const handleSubmit = useCallback(async () => {
    if (!selectedDocId || !selectedDoc || !password.trim()) return;
    setIsProcessing(true);

    const stageName = showCustomStage ? customStage : stage;
    
    // Construct the payload as if these are the true metrics
    const auditedTicket = {
      title: selectedDoc.title,
      wardNumber: selectedDoc.wardNumber,
      category: selectedDoc.category,
      description: selectedDoc.description,
      password,
      metrics: {
        citizenImpact,
        hazardRisk,
        estimatedCost
      }
    };
    
    const content = buildHashPayload(auditedTicket);

    const checkpoint = await onLogCheckpoint(
      selectedDocId,
      stageName,
      custodianName,
      custodianRole,
      content
    );

    setResult(checkpoint);
    setIsProcessing(false);
  }, [selectedDocId, selectedDoc, citizenImpact, hazardRisk, estimatedCost, password, stage, customStage, showCustomStage, custodianName, custodianRole, onLogCheckpoint]);

  const handleReset = () => {
    setResult(null);
    setCustodianName('');
    setCustodianRole('');
    setPassword('');
    setStage(DEFAULT_STAGES[1]);
    setCustomStage('');
    setShowCustomStage(false);
    if (selectedDoc && selectedDoc.metrics) {
      setCitizenImpact(selectedDoc.metrics.citizenImpact);
      setHazardRisk(selectedDoc.metrics.hazardRisk);
      setEstimatedCost(selectedDoc.metrics.estimatedCost);
    }
  };

  return (
    <section className="mb-10">
      <SectionHeader number={3} label="RESOURCE ALLOCATION AUDIT & HASH VERIFIER" />

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
                Metrics Verified - Allocation Authorized
              </p>
              <p className="text-sm text-navy/60 mb-4">
                Priority score remains cryptographically verified against original intake metrics. No manipulation detected.
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
                  ⚠ METRIC MANIPULATION DETECTED
                </p>
                <p className="text-sm text-navy/60">
                  Priority metrics were altered under custody of <strong className="text-navy">{result.custodianName}</strong> during <strong className="text-navy">{result.stageName}</strong> to falsely justify budget allocation.
                </p>
              </div>

              {/* Cryptographic diff viewer */}
              <div className="grid md:grid-cols-2 gap-4 mt-4 text-left">
                <div className="bg-white brutal-border p-4">
                  <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-verified rounded-full" />
                    Expected Hash (Original Priority)
                  </div>
                  <div className="font-mono text-xs text-verified break-all bg-verified/5 p-2">
                    {result.tamperDetails?.expectedHash || result.previousHash}
                  </div>
                </div>
                <div className="bg-white brutal-border p-4">
                  <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-tampered rounded-full" />
                    Actual Computed Hash (Altered Priority)
                  </div>
                  <div className="font-mono text-xs text-tampered break-all bg-tampered/5 p-2">
                    {result.tamperDetails?.receivedHash || result.computedHash}
                  </div>
                </div>
              </div>

              {/* Email dispatch badge */}
              {(() => {
                const doc = documents.find(d => d.id === result.documentId);
                return doc?.authorityEmail ? (
                  <div className="mt-4 bg-amber/10 brutal-border border-amber! p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber/20 brutal-border flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-amber" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider">
                        📧 Tamper Alert Dispatched
                      </div>
                      <div className="text-sm font-bold text-navy">
                        Notification sent to <span className="text-amber">{doc.authorityEmail}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-navy/5 brutal-border p-3 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-navy/30" />
                    <div className="text-xs text-navy/40">
                      No authority email registered — alert not dispatched.
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="text-center mt-4">
            <BrutalButton variant="ghost" onClick={handleReset}>
              Log Another Audit
            </BrutalButton>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ticket Selection */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy mb-4">Ticket Selection</h3>

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
                Ticket ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  placeholder="TKT-KPG-2026-XXXX"
                  className="brutal-input flex-1 px-3 py-2.5 text-sm font-mono"
                />
              </div>

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

              {documents.length > 0 && (
                <div className="mt-3">
                  <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                    Or Select Ticket
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="brutal-input w-full px-3 py-2.5 text-sm appearance-none bg-white pr-10"
                    >
                      <option value="">— Select a ticket —</option>
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

          {selectedDoc && (
            <div className="bg-navy/5 brutal-border p-3 mt-3">
              <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                Selected Civic Ticket
              </div>
              <div className="font-bold text-sm text-navy">{selectedDoc.title}</div>
              <div className="font-mono text-xs text-navy/50 mt-1">{selectedDoc.id}</div>
              <div className="mt-2">
                <StatusBadge status={selectedDoc.currentStatus} />
              </div>
            </div>
          )}
        </div>

        {/* Audit Form */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy mb-4">Allocation & Metrics Review</h3>

          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Review Stage
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

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Official Name
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
                Designation
              </label>
              <input
                type="text"
                value={custodianRole}
                onChange={(e) => setCustodianRole(e.target.value)}
                placeholder="Budget Committee Member"
                className="brutal-input w-full px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Secret Password (For Hash Verification)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter original secret password"
              className="brutal-input w-full px-3 py-2.5 text-sm font-mono"
            />
          </div>

          {/* Metrics Audit */}
          <div className={`mb-4 bg-navy/[0.03] brutal-border p-4 transition-opacity ${!selectedDoc ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5" /> Re-evaluate Metrics for Allocation
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1">
                  Citizen Impact
                </label>
                <input type="range" min="1" max="10" value={citizenImpact}
                  onChange={e => setCitizenImpact(+e.target.value)}
                  className="w-full accent-teal" />
                <div className="text-center font-mono text-lg font-black text-navy">{citizenImpact}<span className="text-navy/30">/10</span></div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1">
                  Hazard Risk
                </label>
                <input type="range" min="1" max="10" value={hazardRisk}
                  onChange={e => setHazardRisk(+e.target.value)}
                  className="w-full accent-tampered" />
                <div className="text-center font-mono text-lg font-black text-navy">{hazardRisk}<span className="text-navy/30">/10</span></div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1">
                  Est. Cost (₹)
                </label>
                <input type="number" value={estimatedCost}
                  onChange={e => setEstimatedCost(+e.target.value || 0)}
                  className="brutal-input w-full px-2 py-2 text-sm font-mono" min="0" step="10000" />
              </div>
            </div>
            <p className="text-[9px] text-navy/40 mt-3 text-center uppercase tracking-wider font-mono">
              Note: Changing these values from the genesis state will break the cryptographic chain and trigger a tamper alert.
            </p>
          </div>

          <BrutalButton
            variant="teal"
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedDocId || isProcessing || !selectedDoc || !password.trim()}
          >
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {isProcessing ? 'Verifying Hash Chain…' : 'Authorize Budget & Verify Chain'}
            </span>
          </BrutalButton>
        </div>
      </div>
    </section>
  );
}
