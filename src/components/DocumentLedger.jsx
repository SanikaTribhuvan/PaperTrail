import { Eye, Download, FileText, Clock } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import StatusBadge from './ui/StatusBadge';
import BrutalButton from './ui/BrutalButton';

export default function DocumentLedger({ documents, checkpoints, onInspect }) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getLatestStage = (docId) => {
    const docCheckpoints = checkpoints
      .filter((c) => c.documentId === docId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    if (docCheckpoints.length === 0) return 'Genesis';
    return docCheckpoints[docCheckpoints.length - 1].stageName;
  };

  const exportJSON = (doc) => {
    const docCheckpoints = checkpoints
      .filter((c) => c.documentId === doc.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const exportData = {
      document: doc,
      auditTrail: docCheckpoints,
      exportedAt: new Date().toISOString(),
      protocol: 'PaperTrail SHA-256 Chain-of-Custody',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.id}_audit_trail.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CATEGORY_LABELS = {
    EXAM_PAPER: 'Exam Paper',
    LAND_MUTATION: 'Land Mutation (7/12)',
    GOV_TENDER: 'Gov Tender',
    SANITATION: 'Sanitation',
    INFRASTRUCTURE: 'Infrastructure',
  };

  return (
    <section className="mb-10">
      <SectionHeader number={4} label="DOCUMENT REPOSITORY & AUDIT LEDGER" />

      {documents.length === 0 ? (
        <div className="brutal-card-static bg-white p-8 text-center">
          <FileText className="w-12 h-12 text-navy/20 mx-auto mb-3" />
          <h3 className="font-bold text-navy text-base mb-1">No Documents in Ledger</h3>
          <p className="text-xs text-navy/50 mb-4">
            Register a new document above or click &quot;Load Sample Audit Trail&quot; in the header to view live scenarios.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isTampered = doc.currentStatus === 'tampered';
            return (
              <div
                key={doc.id}
                className={`brutal-card bg-white p-5 flex flex-col justify-between ${
                  isTampered ? 'border-tampered! bg-tampered/5' : ''
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-navy/5 font-bold text-navy">
                      {CATEGORY_LABELS[doc.category] || doc.category}
                    </span>
                    <StatusBadge status={doc.currentStatus} size="sm" />
                  </div>

                  <h4 className="font-bold text-navy text-sm mb-1 line-clamp-2">
                    {doc.title}
                  </h4>

                  <div className="font-mono text-[11px] text-navy/50 mb-3">
                    {doc.id}
                  </div>

                  <div className="space-y-1 text-xs text-navy/70 border-t border-navy/10 pt-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-navy/40">Created:</span>
                      <span className="font-mono">{formatDate(doc.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy/40">Checkpoints:</span>
                      <span className="font-mono font-bold">{doc.totalCheckpoints || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy/40">Current Stage:</span>
                      <span className="font-medium text-navy truncate max-w-[140px]">
                        {getLatestStage(doc.id)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex gap-2 pt-2 border-t border-navy/10">
                  <BrutalButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => onInspect(doc.id)}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Audit Trail
                    </span>
                  </BrutalButton>
                  <button
                    type="button"
                    onClick={() => exportJSON(doc)}
                    className="brutal-btn bg-white px-2.5 py-1 text-xs text-navy hover:bg-cream"
                    title="Export JSON Audit Log"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
