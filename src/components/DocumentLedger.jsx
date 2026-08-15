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
      .filter(c => c.documentId === docId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return docCheckpoints[0]?.stageName || 'Genesis';
  };

  const exportDocumentJSON = (doc) => {
    const docCheckpoints = checkpoints
      .filter(c => c.documentId === doc.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const exportData = {
      document: doc,
      auditTrail: docCheckpoints,
      exportedAt: new Date().toISOString(),
      exportedBy: 'PaperTrail Chain-of-Custody System',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.id}-audit-trail.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'EXAM_PAPER': return 'Exam Paper';
      case 'LAND_MUTATION': return 'Land Mutation';
      case 'GOV_TENDER': return 'Gov. Tender';
      default: return category;
    }
  };

  return (
    <section className="mb-10">
      <SectionHeader number={5} label="REPOSITORY LEDGER" />

      {documents.length === 0 ? (
        <div className="brutal-card-static bg-white p-12 text-center">
          <FileText className="w-12 h-12 text-navy/20 mx-auto mb-4" />
          <p className="text-navy/40 font-semibold">No documents registered yet.</p>
          <p className="text-navy/30 text-sm mt-1">
            Create a document above or load the sample audit trail.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="brutal-card bg-white p-5">
              {/* Category tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-bold text-navy/40 uppercase tracking-wider bg-cream brutal-border px-2 py-0.5">
                  {getCategoryLabel(doc.category)}
                </span>
                <StatusBadge status={doc.currentStatus} />
              </div>

              {/* Title & ID */}
              <h4 className="font-bold text-navy text-sm leading-snug mb-1">
                {doc.title}
              </h4>
              <div className="font-mono text-xs text-navy/50 mb-3">
                {doc.id}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-navy/40 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(doc.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {doc.totalCheckpoints} checkpoint{doc.totalCheckpoints !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Current stage */}
              <div className="bg-navy/5 brutal-border px-3 py-2 mb-4">
                <div className="font-mono text-[10px] text-navy/40 uppercase tracking-wider">
                  Current Stage
                </div>
                <div className="font-semibold text-sm text-navy">
                  {getLatestStage(doc.id)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <BrutalButton
                  variant="primary"
                  className="flex-1 text-xs"
                  onClick={() => onInspect(doc.id)}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Chain
                  </span>
                </BrutalButton>
                <button
                  onClick={() => exportDocumentJSON(doc)}
                  className="brutal-btn bg-cream text-navy px-3 py-2"
                  title="Export Audit JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
