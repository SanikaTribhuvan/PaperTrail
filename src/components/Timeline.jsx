import { useState } from 'react';
import { Fingerprint, ShieldCheck, ShieldAlert, ArrowDown, ChevronDown, ChevronUp, Link2Off } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import StatusBadge from './ui/StatusBadge';
import { shortHash } from '../utils/crypto';

export default function Timeline({ document: doc, checkpoints, onBack }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!doc) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNodeIcon = (status) => {
    switch (status) {
      case 'sealed':
        return <Fingerprint className="w-5 h-5 text-white" />;
      case 'verified':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      case 'tampered':
        return <ShieldAlert className="w-5 h-5 text-white" />;
      default:
        return <Fingerprint className="w-5 h-5 text-white" />;
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'sealed': return 'bg-sealed';
      case 'verified': return 'bg-verified';
      case 'tampered': return 'bg-tampered';
      default: return 'bg-sealed';
    }
  };

  const getNodeBorderColor = (status) => {
    switch (status) {
      case 'sealed': return 'border-sealed';
      case 'verified': return 'border-verified';
      case 'tampered': return 'border-tampered';
      default: return 'border-sealed';
    }
  };

  return (
    <section className="mb-10">
      <SectionHeader number={4} label="IMMUTABLE AUDIT TRAIL" />

      {/* Ticket header */}
      <div className="brutal-card-static bg-white p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-1">
              Audit Trail for Civic Ticket
            </div>
            <h3 className="font-black text-xl text-navy">{doc.title}</h3>
            <div className="font-mono text-sm text-navy/60 mt-1">{doc.id}</div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={doc.currentStatus} size="lg" />
            <button
              onClick={onBack}
              className="brutal-btn bg-cream text-navy px-3 py-2 text-xs font-bold"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-4 md:pl-8">
        {checkpoints.map((cp, index) => {
          const isExpanded = expandedId === cp.id;
          const isLast = index === checkpoints.length - 1;

          return (
            <div key={cp.id} className="relative mb-0">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-6 top-[52px] bottom-0 w-[3px]">
                  {cp.status === 'tampered' || (checkpoints[index + 1] && checkpoints[index + 1].status === 'tampered') ? (
                    // Broken line for tamper
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="w-[3px] h-[40%] bg-black" />
                      <Link2Off className="w-4 h-4 text-tampered my-1" />
                      <div className="w-[3px] flex-1 bg-tampered" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #EF4444 0px, #EF4444 4px, transparent 4px, transparent 8px)' }} />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-black" />
                  )}
                </div>
              )}

              {/* Node */}
              <div className="flex items-start gap-4 pb-8">
                {/* Circle node */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full brutal-border-thick
                  ${getNodeColor(cp.status)} 
                  flex items-center justify-center z-10 relative
                `}>
                  {getNodeIcon(cp.status)}
                </div>

                {/* Card */}
                <div className={`
                  flex-1 brutal-card-static p-4 cursor-pointer
                  ${cp.status === 'tampered' ? 'bg-tampered/5 border-tampered!' : 'bg-white'}
                  hover:shadow-[6px_6px_0px_0px_#000] transition-shadow
                `}
                  onClick={() => setExpandedId(isExpanded ? null : cp.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-navy">{cp.stageName}</span>
                        <StatusBadge status={cp.status} />
                      </div>
                      <div className="text-sm text-navy/60 mb-1">
                        {cp.custodianName}
                        {cp.custodianRole && <span className="text-navy/40"> · {cp.custodianRole}</span>}
                      </div>
                      <div className="font-mono text-[11px] text-navy/40">
                        {formatDate(cp.timestamp)}
                      </div>
                      <div className="font-mono text-[11px] text-navy/50 mt-2">
                        hash: {shortHash(cp.computedHash)}
                      </div>
                    </div>
                    <button className="text-navy/30 hover:text-navy transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-navy/10">
                      {/* Full hash */}
                      <div className="mb-3">
                        <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                          Full SHA-256 Hash
                        </div>
                        <div className="font-mono text-xs text-navy break-all bg-navy/5 brutal-border p-2">
                          {cp.computedHash}
                        </div>
                      </div>

                      {/* Previous hash */}
                      {cp.previousHash && (
                        <div className="mb-3">
                          <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                            Previous Checkpoint Hash
                          </div>
                          <div className="font-mono text-xs text-navy/60 break-all bg-navy/5 brutal-border p-2">
                            {cp.previousHash}
                          </div>
                        </div>
                      )}

                      {/* Tamper details */}
                      {cp.status === 'tampered' && cp.tamperDetails && (
                        <div className="bg-tampered/10 brutal-border p-3 mt-3 border-tampered!">
                          <div className="font-mono text-[10px] text-tampered uppercase tracking-wider font-bold mb-2">
                            ⚠ Tamper Evidence
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-navy/50 mb-0.5">Expected:</div>
                              <div className="font-mono text-verified break-all text-[11px]">
                                {shortHash(cp.tamperDetails.expectedHash)}
                              </div>
                            </div>
                            <div>
                              <div className="text-navy/50 mb-0.5">Received:</div>
                              <div className="font-mono text-tampered break-all text-[11px]">
                                {shortHash(cp.tamperDetails.receivedHash)}
                              </div>
                            </div>
                          </div>
                          {cp.tamperDetails.diffSnippet && (
                            <div className="mt-2 text-xs text-navy/60 italic">
                              "{cp.tamperDetails.diffSnippet}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content snapshot */}
                      <div className="mt-3">
                        <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
                          Content Snapshot
                        </div>
                        <div className="font-mono text-xs text-navy/60 bg-cream brutal-border p-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
                          {cp.contentSnapshot}
                        </div>
                      </div>

                      <div className="font-mono text-[10px] text-navy/30 mt-3">
                        Checkpoint ID: {cp.id}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
