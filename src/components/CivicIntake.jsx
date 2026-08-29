import { useState, useEffect, useCallback, useMemo } from 'react';
import { FilePlus, FileCheck, Fingerprint, Gauge } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import { generateSHA256 } from '../utils/crypto';
import { calculatePriorityScore, buildHashPayload, CATEGORY_LABELS } from '../utils/priorityEngine';

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

const WARD_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function CivicIntake({ onCreateTicket }) {
  const [title, setTitle] = useState('');
  const [wardNumber, setWardNumber] = useState(1);
  const [category, setCategory] = useState('SANITATION');
  const [description, setDescription] = useState('');
  const [citizenImpact, setCitizenImpact] = useState(5);
  const [hazardRisk, setHazardRisk] = useState(5);
  const [estimatedCost, setEstimatedCost] = useState(100000);
  const [password, setPassword] = useState('');
  const [authorityEmail, setAuthorityEmail] = useState('');
  const [liveHash, setLiveHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const metrics = useMemo(() => ({
    citizenImpact,
    hazardRisk,
    estimatedCost,
  }), [citizenImpact, hazardRisk, estimatedCost]);

  const livePriority = useMemo(() => calculatePriorityScore(metrics), [metrics]);

  // Live hash as inputs change
  useEffect(() => {
    if (!title.trim() || !password.trim()) { setLiveHash(''); return; }
    const timer = setTimeout(async () => {
      const payload = buildHashPayload({
        title, wardNumber, category, description, metrics, password, authorityEmail
      });
      const hash = await generateSHA256(payload);
      setLiveHash(hash);
    }, 200);
    return () => clearTimeout(timer);
  }, [title, wardNumber, category, description, metrics, password, authorityEmail]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !password.trim()) return;
    setIsHashing(true);
    const result = await onCreateTicket({
      title, wardNumber, category, description, metrics, password, authorityEmail
    });
    setCreatedTicket(result);
    setIsHashing(false);
  }, [title, wardNumber, category, description, metrics, password, authorityEmail, onCreateTicket]);

  const handleReset = () => {
    setTitle(''); setWardNumber(1); setCategory('SANITATION');
    setDescription(''); setCitizenImpact(5); setHazardRisk(5);
    setEstimatedCost(100000); setPassword(''); setAuthorityEmail(''); setLiveHash(''); setCreatedTicket(null);
  };

  // ── Success view ──
  if (createdTicket) {
    return (
      <section className="mb-10">
        <SectionHeader number={2} label="CIVIC ISSUE INTAKE & GENESIS HASH" />
        <div className="brutal-card-static bg-white p-8 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-verified/10 brutal-border flex items-center justify-center mx-auto">
              <FileCheck className="w-8 h-8 text-verified" />
            </div>
          </div>
          <h3 className="text-xl font-black text-navy mb-2">Civic Ticket Sealed</h3>
          <p className="text-sm text-navy/60 mb-4">
            Priority score <strong className="text-navy">{createdTicket.priority.score}/100 ({createdTicket.priority.rank})</strong> is now cryptographically locked.
          </p>
          <div className="inline-block brutal-card-static p-6 bg-cream mb-6">
            <div className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-2">Ticket ID</div>
            <div className="font-mono text-lg font-black text-navy mb-4">{createdTicket.document.id}</div>
            <div className="bg-white brutal-border p-3 inline-block">
              <QRCodeSVG value={createdTicket.document.id} size={140} level="H" bgColor="#FFFFFF" fgColor="#0B2545" />
            </div>
          </div>
          <div className="mb-4"><StatusBadge status="sealed" size="lg" /></div>
          <div className={`inline-block brutal-card-static px-4 py-2 bg-${createdTicket.priority.rankColor}/10 border-${createdTicket.priority.rankColor}! mb-4`}>
            <span className="font-mono text-xs font-bold">{createdTicket.priority.justification}</span>
          </div>
          <div className="bg-navy/5 brutal-border p-4 mb-6 text-left max-w-lg mx-auto">
            <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">SHA-256 (Metrics + Priority Score)</div>
            <div className="font-mono text-xs text-navy break-all">{createdTicket.checkpoint.computedHash}</div>
          </div>
          <BrutalButton variant="primary" onClick={handleReset}>
            <span className="flex items-center gap-2"><FilePlus className="w-4 h-4" /> Log Another Issue</span>
          </BrutalButton>
        </div>
      </section>
    );
  }

  // ── Intake form ──
  const RANK_COLORS = { CRITICAL: 'bg-tampered', HIGH: 'bg-amber', MEDIUM: 'bg-sealed', LOW: 'bg-verified' };

  return (
    <section className="mb-10">
      <SectionHeader number={2} label="CIVIC ISSUE INTAKE & GENESIS HASH" />
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
            <FilePlus className="w-5 h-5" /> Log New Civic Issue
          </h3>

          {/* Category */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={`brutal-btn px-3 py-1.5 text-xs font-bold transition-all ${category === cat.value ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-cream'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title + Ward */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="col-span-2">
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Issue Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Open drain overflow near Shivaji Chowk"
                className="brutal-input w-full px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Ward No.</label>
              <select value={wardNumber} onChange={e => setWardNumber(+e.target.value)}
                className="brutal-input w-full px-3 py-2.5 text-sm appearance-none bg-white">
                {WARD_NUMBERS.map(w => <option key={w} value={w}>Ward {w}</option>)}
              </select>
            </div>
          </div>

          {/* Metrics: Impact, Risk, Cost */}
          <div className="mb-4 bg-navy/[0.03] brutal-border p-4">
            <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5" /> Base Metrics (Drive Priority Score)
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
          </div>

          {/* Password & Email */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Secret Password (For Hash)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter secret password"
                className="brutal-input w-full px-3 py-2.5 text-sm font-mono" />
            </div>
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Authority Email</label>
              <input type="email" value={authorityEmail} onChange={e => setAuthorityEmail(e.target.value)}
                placeholder="admin@kopargaon.gov.in"
                className="brutal-input w-full px-3 py-2.5 text-sm" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">Issue Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the civic issue in detail…"
              rows={3} className="brutal-input w-full px-3 py-2.5 text-sm resize-none font-mono" />
          </div>

          {/* Hash preview */}
          {liveHash && (
            <div className="hash-reveal mb-4 bg-navy/5 brutal-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint className="w-3.5 h-3.5 text-teal" />
                <span className="font-mono text-[10px] text-navy/50 uppercase tracking-wider">Live SHA-256 (Metrics + Score Locked)</span>
              </div>
              <div className="font-mono text-xs text-navy/70 break-all">{liveHash}</div>
            </div>
          )}

          <BrutalButton variant="primary" className="w-full" onClick={handleSubmit}
            disabled={!title.trim() || !password.trim() || isHashing}>
            <span className="flex items-center justify-center gap-2">
              <Fingerprint className="w-4 h-4" />
              {isHashing ? 'Computing SHA-256…' : 'Seal Issue & Lock Priority Score'}
            </span>
          </BrutalButton>
        </div>

        {/* Right: Live Priority Preview */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5" /> Live Priority Preview
          </h3>

          {/* Big Score */}
          <div className="text-center mb-6">
            <div className={`inline-block ${RANK_COLORS[livePriority.rank]} brutal-border px-8 py-4`}>
              <div className="font-black text-5xl text-white leading-none">{livePriority.score}</div>
              <div className="font-mono text-xs text-white/70 mt-1">/ 100</div>
            </div>
            <div className="mt-3">
              <span className={`inline-block ${RANK_COLORS[livePriority.rank]} text-white brutal-border px-3 py-1 font-mono text-xs font-bold`}>
                {livePriority.rank}
              </span>
            </div>
            <div className="mt-2 font-mono text-xs text-navy/60">{livePriority.justification}</div>
          </div>

          {/* Factor Bars */}
          <div className="space-y-3">
            {livePriority.factors.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-navy">{f.name}</span>
                  <span className="font-mono text-xs font-bold text-navy">+{f.points} <span className="text-navy/30">/ {f.max}</span></span>
                </div>
                <div className="h-3 bg-navy/5 brutal-border overflow-hidden">
                  <div className={`h-full ${i === 0 ? 'bg-teal' : i === 1 ? 'bg-tampered' : 'bg-amber'} transition-all duration-300`}
                    style={{ width: `${(f.points / f.max) * 100}%` }} />
                </div>
                <p className="text-[10px] text-navy/50 mt-0.5">{f.reason}</p>
              </div>
            ))}
          </div>

          {/* Hashed payload preview */}
          {title.trim() && password.trim() && (
            <div className="mt-6 bg-navy/5 brutal-border p-3">
              <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">Hash Payload Preview</div>
              <pre className="font-mono text-[10px] text-navy/60 break-all whitespace-pre-wrap leading-relaxed">
                {buildHashPayload({ title, wardNumber, category, description, metrics, password })}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
