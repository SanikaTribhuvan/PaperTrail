import { useState, useCallback } from 'react';
import { usePaperTrail } from './hooks/usePaperTrail';
import Header from './components/Header';
import CrisisStrip from './components/CrisisStrip';
import DocumentRegistration from './components/DocumentRegistration';
import CheckpointStation from './components/CheckpointStation';
import DocumentLedger from './components/DocumentLedger';
import CivicIntake from './components/CivicIntake';
import AllocationAudit from './components/AllocationAudit';
import Timeline from './components/Timeline';
import TriageQueue from './components/TriageQueue';
import { FileText, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const {
    documents,
    checkpoints,
    filteredDocuments,
    activeDocId,
    setActiveDocId,
    currentView,
    setCurrentView,
    activeMode,
    setActiveMode,
    searchQuery,
    setSearchQuery,
    stats,
    createDocument,
    createTicket,
    logCheckpoint,
    getDocumentCheckpoints,
    getDocument,
    resetAll,
    loadSample,
  } = usePaperTrail();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetAll = useCallback(() => {
    if (showResetConfirm) {
      resetAll();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  }, [showResetConfirm, resetAll]);

  const handleInspect = useCallback((docId) => {
    setActiveDocId(docId);
    setCurrentView('timeline');
  }, [setActiveDocId, setCurrentView]);

  const handleBackFromTimeline = useCallback(() => {
    setActiveDocId(null);
    setCurrentView('dashboard');
  }, [setActiveDocId, setCurrentView]);

  const handleSwitchMode = (newMode) => {
    setActiveMode(newMode);
    loadSample(newMode);
  };

  // Timeline view
  if (currentView === 'timeline' && activeDocId) {
    const doc = getDocument(activeDocId);
    const docCheckpoints = getDocumentCheckpoints(activeDocId);

    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header
            stats={stats}
            onLoadSample={() => loadSample(activeMode)}
            onResetAll={handleResetAll}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTriageView={() => setCurrentView('triage')}
          />
          <Timeline
            document={doc}
            checkpoints={docCheckpoints}
            onBack={handleBackFromTimeline}
          />
        </div>
      </div>
    );
  }

  // Triage view
  if (currentView === 'triage') {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header
            stats={stats}
            onLoadSample={() => loadSample(activeMode)}
            onResetAll={handleResetAll}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTriageView={() => setCurrentView('triage')}
          />
          <TriageQueue
            documents={documents}
            checkpoints={checkpoints}
            onInspect={handleInspect}
          />
        </div>
      </div>
    );
  }

  // Dashboard view (default)
  const displayedDocuments = searchQuery ? filteredDocuments : documents;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header
          stats={stats}
          onLoadSample={() => loadSample(activeMode)}
          onResetAll={handleResetAll}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTriageView={() => setCurrentView('triage')}
        />

        {/* Mode Switcher Banner */}
        <div className="mb-6 bg-white brutal-border p-3 flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0_#0B2545]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow brutal-border flex items-center justify-center font-bold text-navy text-xs">
              SKH
            </div>
            <div>
              <div className="text-xs font-bold text-navy uppercase tracking-wider">
                Hackathon Presentation Mode
              </div>
              <div className="text-[11px] text-navy/60">
                Switch between Part A (Original Project) and Part B (Challenge Mode)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSwitchMode('document')}
              className={`brutal-btn px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'document'
                  ? 'bg-navy text-yellow border-navy!'
                  : 'bg-cream text-navy hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Part A: Exam & Land Custody</span>
              {activeMode === 'document' && <CheckCircle2 className="w-3.5 h-3.5 text-yellow" />}
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('civic')}
              className={`brutal-btn px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'civic'
                  ? 'bg-navy text-yellow border-navy!'
                  : 'bg-cream text-navy hover:bg-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Part B: Civic Triage Challenge</span>
              {activeMode === 'civic' && <CheckCircle2 className="w-3.5 h-3.5 text-yellow" />}
            </button>
          </div>
        </div>

        {/* Reset confirmation toast */}
        {showResetConfirm && (
          <div className="fixed top-4 right-4 z-50 brutal-card-static bg-tampered text-white p-4 max-w-xs">
            <p className="font-bold text-sm mb-2">Are you sure?</p>
            <p className="text-xs mb-3 opacity-90">Click &quot;Reset All&quot; again to confirm. All data will be permanently erased.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="brutal-btn bg-white text-tampered px-3 py-1.5 text-xs font-bold border-white!"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-bold text-white/70 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <CrisisStrip />

        {/* Dynamic Mode Rendering */}
        {activeMode === 'document' ? (
          <>
            {/* Part A: Genesis Vault with Exam Paper / Land Mutation / Tenders */}
            <DocumentRegistration onCreateDocument={createDocument} />

            {/* Part A: Checkpoint Station */}
            <CheckpointStation
              documents={documents}
              onLogCheckpoint={logCheckpoint}
              getDocumentCheckpoints={getDocumentCheckpoints}
            />

            {/* Part A: Document Ledger */}
            <DocumentLedger
              documents={displayedDocuments}
              checkpoints={checkpoints}
              onInspect={handleInspect}
            />
          </>
        ) : (
          <>
            {/* Part B: Civic Issue Intake with Ward numbers & Priority Engine */}
            <CivicIntake onCreateTicket={createTicket} />

            {/* Part B: Allocation Audit & Priority Verifier */}
            <AllocationAudit
              documents={documents}
              onLogCheckpoint={logCheckpoint}
              getDocumentCheckpoints={getDocumentCheckpoints}
            />

            {/* Part B: Triage Queue */}
            <TriageQueue
              documents={displayedDocuments}
              checkpoints={checkpoints}
              onInspect={handleInspect}
            />
          </>
        )}
      </div>
    </div>
  );
}
