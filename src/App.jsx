import { useState, useCallback } from 'react';
import { usePaperTrail } from './hooks/usePaperTrail';
import Header from './components/Header';
import CrisisStrip from './components/CrisisStrip';
import CivicIntake from './components/CivicIntake';
import AllocationAudit from './components/AllocationAudit';
import Timeline from './components/Timeline';
import TriageQueue from './components/TriageQueue';

export default function App() {
  const {
    documents,
    checkpoints,
    filteredDocuments,
    activeDocId,
    setActiveDocId,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    stats,
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

  // Timeline view
  if (currentView === 'timeline' && activeDocId) {
    const doc = getDocument(activeDocId);
    const docCheckpoints = getDocumentCheckpoints(activeDocId);

    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Header
            stats={stats}
            onLoadSample={loadSample}
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
            onLoadSample={loadSample}
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
          onLoadSample={loadSample}
          onResetAll={handleResetAll}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTriageView={() => setCurrentView('triage')}
        />

        {/* Reset confirmation toast */}
        {showResetConfirm && (
          <div className="fixed top-4 right-4 z-50 brutal-card-static bg-tampered text-white p-4 max-w-xs">
            <p className="font-bold text-sm mb-2">Are you sure?</p>
            <p className="text-xs mb-3 opacity-90">Click "Reset All" again to confirm. All data will be permanently erased.</p>
            <div className="flex gap-2">
              <button
                onClick={handleResetAll}
                className="brutal-btn bg-white text-tampered px-3 py-1.5 text-xs font-bold border-white!"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-bold text-white/70 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <CrisisStrip />

        <CivicIntake onCreateTicket={createTicket} />

        <AllocationAudit
          documents={documents}
          onLogCheckpoint={logCheckpoint}
          getDocumentCheckpoints={getDocumentCheckpoints}
        />

        <TriageQueue
          documents={displayedDocuments}
          checkpoints={checkpoints}
          onInspect={handleInspect}
        />
      </div>
    </div>
  );
}
