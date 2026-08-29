import { useMemo } from 'react';
import { BarChart3, Eye, Users, AlertTriangle, Banknote } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import { calculatePriorityScore, CATEGORY_LABELS, CATEGORY_ICONS } from '../utils/priorityEngine';

const RANK_STYLES = {
  CRITICAL: { bg: 'bg-tampered/5', border: 'border-tampered!', badge: 'bg-tampered text-white' },
  HIGH:     { bg: 'bg-amber/5',    border: 'border-amber!',    badge: 'bg-amber text-ink' },
  MEDIUM:   { bg: 'bg-sealed/5',   border: 'border-sealed!',   badge: 'bg-sealed text-white' },
  LOW:      { bg: 'bg-verified/5', border: 'border-verified!', badge: 'bg-verified text-white' },
};

export default function TriageQueue({ documents, checkpoints, onInspect }) {
  // Sort by priority score (highest first)
  const sortedDocs = useMemo(() => {
    return documents
      .map(doc => {
        const priority = calculatePriorityScore(doc.metrics || {
          citizenImpact: 5, hazardRisk: 5, estimatedCost: 100000,
        });
        const docCheckpoints = checkpoints
          .filter(c => c.documentId === doc.id)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const lastCheckpoint = docCheckpoints[docCheckpoints.length - 1];
        return { doc, priority, checkpointCount: docCheckpoints.length, lastCheckpoint };
      })
      .sort((a, b) => b.priority.score - a.priority.score);
  }, [documents, checkpoints]);

  if (documents.length === 0) return null;

  // Summary counts
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  sortedDocs.forEach(({ priority }) => counts[priority.rank]++);

  return (
    <section className="mb-10">
      <SectionHeader number={4} label="CIVIC TRIAGE QUEUE — SORTED BY PRIORITY" />

      {/* Summary band */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'CRITICAL', count: counts.CRITICAL, bg: 'bg-tampered', text: 'text-white' },
          { label: 'HIGH',     count: counts.HIGH,     bg: 'bg-amber',    text: 'text-ink' },
          { label: 'MEDIUM',   count: counts.MEDIUM,   bg: 'bg-sealed',   text: 'text-white' },
          { label: 'LOW',      count: counts.LOW,      bg: 'bg-verified', text: 'text-white' },
        ].map(b => (
          <div key={b.label} className={`brutal-card-static ${b.bg} ${b.text} p-2 text-center`}>
            <div className="text-xl font-black">{b.count}</div>
            <div className="font-mono text-[9px] font-bold tracking-wider opacity-80">{b.label}</div>
          </div>
        ))}
      </div>

      {/* Sorted Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDocs.map(({ doc, priority, checkpointCount }, index) => {
          const style = RANK_STYLES[priority.rank];
          const icon = CATEGORY_ICONS[doc.category] || '📋';
          const isTampered = doc.currentStatus === 'tampered';

          return (
            <div
              key={doc.id}
              className={`
                brutal-card-static ${style.bg} p-4 ${style.border}
                ${isTampered ? 'animate-pulse-subtle' : ''}
                hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer
              `}
              onClick={() => onInspect(doc.id)}
            >
              {/* Top row: rank badge + score */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`${style.badge} brutal-border w-8 h-8 flex items-center justify-center font-black text-sm`}>
                    {index + 1}
                  </span>
                  <span className="text-lg">{icon}</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl text-navy leading-none">{priority.score}</div>
                  <div className="font-mono text-[9px] text-navy/40">/100</div>
                </div>
              </div>

              {/* Title + Ward */}
              <h3 className="font-bold text-sm text-navy mb-1 leading-snug">{doc.title}</h3>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[10px] text-navy/50">{doc.id}</span>
                <span className="font-mono text-[10px] bg-navy/10 px-1.5 py-0.5">Ward {doc.wardNumber}</span>
                <StatusBadge status={doc.currentStatus} />
              </div>

              {/* Justification Badge */}
              <div className={`${style.badge} brutal-border px-2 py-1 text-[10px] font-mono font-bold inline-block mb-3`}>
                {priority.justification}
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/60 brutal-border p-1.5">
                  <Users className="w-3 h-3 mx-auto text-teal mb-0.5" />
                  <div className="font-mono text-xs font-bold text-navy">{doc.metrics?.citizenImpact || '—'}</div>
                  <div className="text-[8px] text-navy/40">IMPACT</div>
                </div>
                <div className="bg-white/60 brutal-border p-1.5">
                  <AlertTriangle className="w-3 h-3 mx-auto text-tampered mb-0.5" />
                  <div className="font-mono text-xs font-bold text-navy">{doc.metrics?.hazardRisk || '—'}</div>
                  <div className="text-[8px] text-navy/40">RISK</div>
                </div>
                <div className="bg-white/60 brutal-border p-1.5">
                  <Banknote className="w-3 h-3 mx-auto text-amber mb-0.5" />
                  <div className="font-mono text-xs font-bold text-navy">
                    {doc.metrics?.estimatedCost ? `₹${(doc.metrics.estimatedCost / 100000).toFixed(1)}L` : '—'}
                  </div>
                  <div className="text-[8px] text-navy/40">COST</div>
                </div>
              </div>

              {/* Footer: checkpoints + inspect */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-black/10">
                <span className="font-mono text-[10px] text-navy/40">{checkpointCount} checkpoint{checkpointCount !== 1 ? 's' : ''}</span>
                <BrutalButton variant="ghost" className="text-[10px] px-2 py-1" onClick={e => { e.stopPropagation(); onInspect(doc.id); }}>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Audit Chain</span>
                </BrutalButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
