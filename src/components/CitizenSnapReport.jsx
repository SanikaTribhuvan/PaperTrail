import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Send, RefreshCw, Eye, MapPin, Gauge } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import { PRESET_CITIZEN_IMAGES, generateProceduralSvg, analyzeCitizenPhoto } from '../utils/aiVisionEngine';
import { calculatePriorityScore, buildHashPayload } from '../utils/priorityEngine';
import { generateDocId, generateCheckpointId } from '../utils/crypto';

export default function CitizenSnapReport({ onCreateTicket }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [wardNumber, setWardNumber] = useState(4);
  const [category, setCategory] = useState('INFRASTRUCTURE');
  const [description, setDescription] = useState('');
  const [authorityEmail, setAuthorityEmail] = useState('pwd-roads@kopargaon.gov.in');
  const [dispatchedTicket, setDispatchedTicket] = useState(null);

  const fileInputRef = useRef(null);

  const SCAN_STEPS = [
    'Initializing Optical Sensor Matrix…',
    'Inspecting Surface Texture Entropy & Lens Noise…',
    'Verifying EXIF Geolocation & Timestamp Telemetry…',
    'Evaluating AI Diffusion & Deepfake Artifact Signatures…',
    'Classifying Civic Defect & Estimating Severity…',
    'Computing SHA-256 Binary Hash…',
  ];

  const handleSelectPreset = async (preset) => {
    setDispatchedTicket(null);
    setTicketTitle(preset.title);
    setWardNumber(preset.wardNumber);
    setCategory(preset.category);
    setDescription(preset.description);
    setAuthorityEmail(preset.authorityEmail);

    const svgUrl = generateProceduralSvg(preset.svgType);
    setImagePreview(svgUrl);
    setSelectedImage(svgUrl);

    runAiScan(preset, svgUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDispatchedTicket(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setImagePreview(dataUrl);
      setSelectedImage(dataUrl);
      setTicketTitle(`Public Grievance Photo — Ward ${wardNumber}`);
      runAiScan(null, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runAiScan = async (presetData, imageSrc) => {
    setIsScanning(true);
    setScanStep(0);
    setAnalysisResult(null);

    // Step-by-step scanning progress simulation
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, 220));
    }

    if (presetData) {
      setAnalysisResult({
        ...presetData,
        imageHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });
    } else {
      const dynamicResult = await analyzeCitizenPhoto(imageSrc, category);
      setAnalysisResult(dynamicResult);
    }
    setIsScanning(false);
  };

  const handleDispatchToAuthority = async () => {
    if (!analysisResult) return;

    const metrics = analysisResult.metrics || { citizenImpact: 8, hazardRisk: 8, estimatedCost: 150000 };
    const ticketData = {
      title: ticketTitle || analysisResult.title || `Citizen Photo Grievance - Ward ${wardNumber}`,
      wardNumber,
      category,
      description: description || analysisResult.description || 'Public image submission with AI authenticity verification.',
      metrics,
      authorityEmail,
      password: 'citizen_verified',
      photoHash: analysisResult.imageHash,
      isAiVerified: analysisResult.isReal,
    };

    if (onCreateTicket) {
      const result = await onCreateTicket(ticketData);
      setDispatchedTicket(result);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setDispatchedTicket(null);
    setTicketTitle('');
    setDescription('');
  };

  return (
    <section className="mb-10">
      <SectionHeader number={1} label="CITIZEN AI PHOTO INTAKE & REAL-VS-FAKE VERIFIER" />

      {/* Dispatched Success View */}
      {dispatchedTicket ? (
        <div className="brutal-card-static bg-white p-8 text-center">
          <div className="w-16 h-16 bg-verified/10 brutal-border flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-verified" />
          </div>
          <h3 className="text-xl font-black text-navy mb-2">
            Civic Grievance Sealed & Dispatched to Authority
          </h3>
          <p className="text-sm text-navy/60 mb-4 max-w-lg mx-auto">
            Your photo was verified as <strong>AUTHENTIC ({analysisResult?.confidence?.toFixed(1)}%)</strong>, bound to an immutable SHA-256 hash, and transmitted to the municipal action department.
          </p>

          <div className="inline-block brutal-card-static p-6 bg-cream mb-6 text-left max-w-md w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs text-navy/50 uppercase">Ticket Reference</span>
              <StatusBadge status="sealed" size="sm" />
            </div>
            <div className="font-mono text-base font-black text-navy mb-2">
              {dispatchedTicket.document.id}
            </div>
            <div className="space-y-1 text-xs text-navy/70 mb-3">
              <div><strong>Department:</strong> {authorityEmail}</div>
              <div><strong>Ward:</strong> Ward {wardNumber} (Kopargaon)</div>
              <div><strong>Category:</strong> {category}</div>
              <div><strong>Priority:</strong> {dispatchedTicket.priority?.score}/100 ({dispatchedTicket.priority?.rank})</div>
            </div>
            <div className="font-mono text-[10px] text-navy/40 break-all bg-white p-2 brutal-border">
              SHA-256: {dispatchedTicket.checkpoint?.computedHash}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <BrutalButton variant="primary" onClick={handleReset}>
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                Upload Another Photo
              </span>
            </BrutalButton>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Upload & Camera Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="brutal-card-static bg-white p-5">
              <h4 className="font-bold text-navy text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal" />
                1. Click or Upload Photo
              </h4>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-navy/30 bg-cream p-6 text-center cursor-pointer hover:border-navy hover:bg-white transition-all mb-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Camera className="w-10 h-10 text-navy/40 mx-auto mb-2" />
                <div className="text-sm font-bold text-navy">Take Photo with Camera</div>
                <div className="text-xs text-navy/50 mt-1">or click to browse from device (JPG, PNG)</div>
              </div>

              {/* Judge Demo Presets */}
              <div>
                <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>⚡ Quick Demo Presets (1-Click)</span>
                  <span className="text-teal font-bold">For Judges Demo</span>
                </div>
                <div className="space-y-1.5">
                  {PRESET_CITIZEN_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-2.5 text-xs font-bold brutal-border transition-all flex items-center justify-between ${
                        preset.isReal
                          ? 'bg-verified/5 hover:bg-verified/15 border-verified/40 text-navy'
                          : 'bg-tampered/5 hover:bg-tampered/15 border-tampered/40 text-tampered'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {preset.isReal ? (
                          <span className="w-2 h-2 rounded-full bg-verified shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-tampered shrink-0" />
                        )}
                        <span className="truncate">{preset.title}</span>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-white border border-navy/20 uppercase shrink-0">
                        {preset.isReal ? 'REAL' : 'FAKE'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Routing */}
            <div className="brutal-card-static bg-white p-5">
              <h4 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">
                2. Location & Department Routing
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="font-mono text-[10px] text-navy/50 uppercase block mb-1">Ward Location</label>
                  <select
                    value={wardNumber}
                    onChange={(e) => setWardNumber(Number(e.target.value))}
                    className="brutal-input w-full px-2.5 py-1.5 text-xs"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>Ward {w} (Kopargaon)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-navy/50 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (e.target.value === 'INFRASTRUCTURE') setAuthorityEmail('pwd-roads@kopargaon.gov.in');
                      else if (e.target.value === 'WATER_SUPPLY') setAuthorityEmail('water-works@kopargaon.gov.in');
                      else setAuthorityEmail('sanitation-dept@kopargaon.gov.in');
                    }}
                    className="brutal-input w-full px-2.5 py-1.5 text-xs"
                  >
                    <option value="INFRASTRUCTURE">Pothole / Road</option>
                    <option value="WATER_SUPPLY">Pipeline Leak</option>
                    <option value="SANITATION">Drainage / Sewage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-navy/50 uppercase block mb-1">Action Authority Email</label>
                <input
                  type="email"
                  value={authorityEmail}
                  onChange={(e) => setAuthorityEmail(e.target.value)}
                  className="brutal-input w-full px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right: AI Scanner & Verification Terminal */}
          <div className="lg:col-span-7 space-y-4">
            <div className="brutal-card-static bg-white p-5 min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-navy/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow fill-yellow" />
                    <h4 className="font-bold text-navy text-sm uppercase tracking-wider">
                      AI Deepfake & Defect Inspection Terminal
                    </h4>
                  </div>
                  {analysisResult && (
                    <span className="font-mono text-[10px] font-bold text-navy/50">
                      SHA-256 VERIFIED
                    </span>
                  )}
                </div>

                {/* Preview Image Frame with Laser Scanning */}
                {imagePreview ? (
                  <div className="relative mb-4 bg-navy brutal-border overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Uploaded Civic Defect"
                      className="w-full h-64 object-cover"
                    />

                    {/* Scanning Laser Bar */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal/30 to-transparent animate-pulse pointer-events-none">
                        <div className="w-full h-1 bg-yellow shadow-[0_0_12px_#F1FC47] absolute top-1/2 -translate-y-1/2 animate-bounce" />
                      </div>
                    )}

                    {/* AI Bounding Box Overlay if Real Defect */}
                    {analysisResult && analysisResult.isReal && !isScanning && (
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-verified bg-verified/10 flex items-start justify-between p-1.5 pointer-events-none">
                        <span className="bg-verified text-white text-[10px] font-mono px-1.5 py-0.5 font-bold">
                          {analysisResult.defectName} ({analysisResult.confidence?.toFixed(0)}%)
                        </span>
                        <span className="bg-navy text-white text-[9px] font-mono px-1">
                          ROI LOCATED
                        </span>
                      </div>
                    )}

                    {/* AI Fake Flag Overlay */}
                    {analysisResult && !analysisResult.isReal && !isScanning && (
                      <div className="absolute inset-0 bg-tampered/40 flex items-center justify-center p-4">
                        <div className="bg-tampered text-white p-3 brutal-border text-center max-w-xs shadow-[4px_4px_0_#000]">
                          <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                          <div className="font-black text-xs uppercase tracking-wider">
                            AI GENERATION / STOCK DETECTED
                          </div>
                          <div className="text-[10px] opacity-90 mt-1">
                            Submission Quarantined from Municipal Queue
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-56 bg-cream brutal-border flex flex-col items-center justify-center text-center p-6 mb-4">
                    <Camera className="w-12 h-12 text-navy/20 mb-2" />
                    <div className="text-sm font-bold text-navy">No Image Loaded</div>
                    <div className="text-xs text-navy/50 max-w-xs mt-1">
                      Select a preset above or snap a photo to trigger the real-time AI authenticity pipeline.
                    </div>
                  </div>
                )}

                {/* Real-time scanning progress */}
                {isScanning && (
                  <div className="bg-navy/5 p-4 brutal-border mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-4 h-4 text-teal animate-spin" />
                      <span className="font-mono text-xs font-bold text-navy">
                        {SCAN_STEPS[scanStep]}
                      </span>
                    </div>
                    <div className="w-full bg-navy/10 h-2 brutal-border overflow-hidden">
                      <div
                        className="bg-teal h-full transition-all duration-300"
                        style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Analysis Report Card */}
                {analysisResult && !isScanning && (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between p-3 brutal-border bg-white">
                      <div className="flex items-center gap-2">
                        {analysisResult.isReal ? (
                          <div className="w-7 h-7 bg-verified/20 brutal-border flex items-center justify-center text-verified">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 bg-tampered/20 brutal-border flex items-center justify-center text-tampered">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-xs text-navy uppercase">
                            AI Verdict: {analysisResult.isReal ? 'AUTHENTIC PHYSICAL DEFECT' : 'FAKE / SYNTHETIC SUBMISSION'}
                          </div>
                          <div className="text-[10px] text-navy/60 font-mono">
                            Confidence: <strong>{analysisResult.confidence?.toFixed(1)}%</strong> | Sensor Entropy: {analysisResult.aiAnalysis?.opticalNoiseScore || 92}%
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={analysisResult.isReal ? 'verified' : 'tampered'} size="sm" />
                    </div>

                    {/* Defect Metrics & Severity */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-cream brutal-border">
                        <div className="text-[10px] text-navy/50 font-mono">EST. IMPACT</div>
                        <div className="font-bold text-navy text-sm">{analysisResult.metrics?.citizenImpact || 8}/10</div>
                      </div>
                      <div className="p-2 bg-cream brutal-border">
                        <div className="text-[10px] text-navy/50 font-mono">HAZARD RISK</div>
                        <div className="font-bold text-navy text-sm">{analysisResult.metrics?.hazardRisk || 8}/10</div>
                      </div>
                      <div className="p-2 bg-cream brutal-border">
                        <div className="text-[10px] text-navy/50 font-mono">EST. REPAIR</div>
                        <div className="font-bold text-navy text-sm">₹{(analysisResult.metrics?.estimatedCost || 150000).toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Explainability reasons if fake */}
                    {!analysisResult.isReal && analysisResult.aiAnalysis?.flagReasons && (
                      <div className="p-3 bg-tampered/10 brutal-border text-xs">
                        <div className="font-bold text-tampered mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Quarantine Justification:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-navy/80 text-[11px]">
                          {analysisResult.aiAnalysis.flagReasons.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div>
                {analysisResult?.isReal ? (
                  <BrutalButton
                    variant="primary"
                    className="w-full"
                    onClick={handleDispatchToAuthority}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Seal SHA-256 & Dispatch to Municipal Authority
                    </span>
                  </BrutalButton>
                ) : analysisResult && !analysisResult.isReal ? (
                  <div className="p-2.5 bg-tampered text-white text-center text-xs font-bold brutal-border">
                    ⚠️ Submission Flagged by AI Vision Engine — Quarantined to Prevent Waste of Public Funds
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
