import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSHA256, generateDocId, generateCheckpointId } from '../utils/crypto';
import { loadDocuments, saveDocuments, loadCheckpoints, saveCheckpoints, clearAllData } from '../utils/storage';
import { generateSampleData } from '../utils/sampleData';
import { sendTamperAlert, sendCreationAlert } from '../utils/emailAlert';
import { buildHashPayload, calculatePriorityScore } from '../utils/priorityEngine';

export function usePaperTrail() {
  const [documents, setDocuments] = useState(() => loadDocuments());
  const [checkpoints, setCheckpoints] = useState(() => loadCheckpoints());
  const checkpointsRef = useRef(checkpoints);
  checkpointsRef.current = checkpoints;
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
  const [activeDocId, setActiveDocId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [lastResult, setLastResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => { saveDocuments(documents); }, [documents]);
  useEffect(() => { saveCheckpoints(checkpoints); }, [checkpoints]);

  /**
   * Create a new CivicTicket with its genesis checkpoint.
   * Hash payload = stringified metrics + priority score.
   */
  const createTicket = useCallback(async (ticketData) => {
    const { title, wardNumber, category, description, metrics, authorityEmail } = ticketData;
    const priority = calculatePriorityScore(metrics);
    const hashPayload = buildHashPayload(ticketData);
    const hash = await generateSHA256(hashPayload);
    const docId = generateDocId();
    const now = new Date().toISOString();

    const doc = {
      id: docId,
      title,
      wardNumber: wardNumber || 1,
      category: category || 'SANITATION',
      description: description || '',
      metrics: { ...metrics },
      priorityScore: priority.score,
      createdAt: now,
      initialHash: hash,
      currentStatus: 'sealed',
      totalCheckpoints: 1,
      authorityEmail: authorityEmail || '',
    };

    const checkpoint = {
      id: generateCheckpointId(),
      documentId: docId,
      stageName: 'Issue Intake & Genesis Sealing',
      custodianName: 'Municipal Intake Officer',
      custodianRole: 'Civic Issue Registration',
      timestamp: now,
      contentSnapshot: hashPayload,
      computedHash: hash,
      previousHash: null,
      status: 'sealed',
    };

    setDocuments(prev => [...prev, doc]);
    setCheckpoints(prev => [...prev, checkpoint]);
    setLastResult({ type: 'created', document: doc, checkpoint, priority });

    if (doc.authorityEmail) {
      sendCreationAlert({
        authorityEmail: doc.authorityEmail,
        documentTitle: doc.title,
        documentId: doc.id,
        timestamp: now,
      });
    }

    return { document: doc, checkpoint, priority };
  }, []);

  /**
   * Log a new checkpoint for an existing ticket.
   * Used by municipal committees to allocate budgets / update statuses.
   * Re-hashes the ticket's current metrics+score — if altered, chain breaks.
   */
  const logCheckpoint = useCallback(async (documentId, stageName, custodianName, custodianRole, content) => {
    const hash = await generateSHA256(content);

    const currentCheckpoints = checkpointsRef.current;
    const docCheckpoints = currentCheckpoints
      .filter(c => c.documentId === documentId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const lastCheckpoint = docCheckpoints[docCheckpoints.length - 1];
    const previousHash = lastCheckpoint ? lastCheckpoint.computedHash : null;

    let status;
    if (!lastCheckpoint) {
      status = 'sealed';
    } else if (hash === previousHash) {
      status = 'verified';
    } else {
      status = 'tampered';
    }

    const checkpoint = {
      id: generateCheckpointId(),
      documentId,
      stageName,
      custodianName: custodianName || 'Unspecified',
      custodianRole: custodianRole || '',
      timestamp: new Date().toISOString(),
      contentSnapshot: content,
      computedHash: hash,
      previousHash,
      status,
    };

    if (status === 'tampered') {
      checkpoint.tamperDetails = {
        expectedHash: previousHash,
        receivedHash: hash,
      };

      const doc = documentsRef.current.find(d => d.id === documentId);
      if (doc?.authorityEmail) {
        sendTamperAlert({
          authorityEmail: doc.authorityEmail,
          documentTitle: doc.title,
          documentId: doc.id,
          custodianName: custodianName || 'Unspecified',
          stageName,
          expectedHash: previousHash,
          receivedHash: hash,
          timestamp: checkpoint.timestamp,
        }).then(result => {
          checkpoint.emailAlert = result;
        });
      }
    }

    setCheckpoints(prev => [...prev, checkpoint]);

    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          currentStatus: status === 'tampered' ? 'tampered' : (doc.currentStatus === 'tampered' ? 'tampered' : status),
          totalCheckpoints: doc.totalCheckpoints + 1,
        };
      }
      return doc;
    }));

    setLastResult({ type: 'checkpoint', checkpoint, status });
    return checkpoint;
  }, []);

  const getDocumentCheckpoints = useCallback((docId) => {
    return checkpoints
      .filter(c => c.documentId === docId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [checkpoints]);

  const getDocument = useCallback((docId) => {
    return documents.find(d => d.id === docId) || null;
  }, [documents]);

  const resetAll = useCallback(() => {
    clearAllData();
    setDocuments([]);
    setCheckpoints([]);
    setActiveDocId(null);
    setLastResult(null);
    setSearchQuery('');
    setCurrentView('dashboard');
  }, []);

  const loadSample = useCallback(async () => {
    const sample = await generateSampleData();
    setDocuments(sample.documents);
    setCheckpoints(sample.checkpoints);
    setLastResult(null);
  }, []);

  // Search
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const docCPs = checkpoints.filter(c => c.documentId === doc.id);
    return (
      doc.id.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.currentStatus.toLowerCase().includes(q) ||
      (doc.category || '').toLowerCase().includes(q) ||
      String(doc.wardNumber).includes(q) ||
      docCPs.some(c => c.custodianName.toLowerCase().includes(q) || c.stageName.toLowerCase().includes(q))
    );
  });

  // Stats
  const stats = {
    totalDocuments: documents.length,
    activeChains: documents.filter(d => d.currentStatus !== 'tampered').length,
    tamperAlerts: documents.filter(d => d.currentStatus === 'tampered').length,
    totalCheckpoints: checkpoints.length,
  };

  return {
    documents,
    checkpoints,
    filteredDocuments,
    activeDocId,
    setActiveDocId,
    currentView,
    setCurrentView,
    lastResult,
    setLastResult,
    searchQuery,
    setSearchQuery,
    stats,
    createTicket,
    logCheckpoint,
    getDocumentCheckpoints,
    getDocument,
    resetAll,
    loadSample,
  };
}
