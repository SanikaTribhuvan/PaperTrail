import { useState, useEffect, useCallback, useRef } from 'react';
import { generateSHA256, generateDocId, generateCheckpointId } from '../utils/crypto';
import { loadDocuments, saveDocuments, loadCheckpoints, saveCheckpoints, clearAllData } from '../utils/storage';
import { generateSampleData } from '../utils/sampleData';
import { sendTamperAlert } from '../utils/emailAlert';

export function usePaperTrail() {
  const [documents, setDocuments] = useState(() => loadDocuments());
  const [checkpoints, setCheckpoints] = useState(() => loadCheckpoints());
  const checkpointsRef = useRef(checkpoints);
  checkpointsRef.current = checkpoints;
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
  const [activeDocId, setActiveDocId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard | register | checkpoint | timeline
  const [lastResult, setLastResult] = useState(null); // stores last checkpoint result for UI feedback
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage on every change
  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  useEffect(() => {
    saveCheckpoints(checkpoints);
  }, [checkpoints]);

  // Create a new document with its genesis checkpoint
  const createDocument = useCallback(async (title, category, content, custodianName, custodianRole, authorityEmail) => {
    const hash = await generateSHA256(content);
    const docId = generateDocId();
    const now = new Date().toISOString();

    const doc = {
      id: docId,
      title,
      category: category || 'EXAM_PAPER',
      createdAt: now,
      initialHash: hash,
      currentStatus: 'sealed',
      totalCheckpoints: 1,
      authorityEmail: authorityEmail || '',
    };

    const checkpoint = {
      id: generateCheckpointId(),
      documentId: docId,
      stageName: 'Genesis Sealing',
      custodianName: custodianName || 'Registrar',
      custodianRole: custodianRole || 'Document Genesis Officer',
      timestamp: now,
      contentSnapshot: content,
      computedHash: hash,
      previousHash: null,
      status: 'sealed',
    };

    setDocuments(prev => [...prev, doc]);
    setCheckpoints(prev => [...prev, checkpoint]);
    setLastResult({ type: 'created', document: doc, checkpoint });
    return { document: doc, checkpoint };
  }, []);

  // Log a new checkpoint for an existing document
  const logCheckpoint = useCallback(async (documentId, stageName, custodianName, custodianRole, content) => {
    const hash = await generateSHA256(content);

    // Get the most recent checkpoint for this document (use ref to avoid stale closures)
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

      // Fire tamper alert email asynchronously
      const doc = documentsRef.current.find(d => d.id === documentId);
      if (doc?.authorityEmail) {
        sendTamperAlert({
          authorityEmail: doc.authorityEmail,
          documentTitle:  doc.title,
          documentId:     doc.id,
          custodianName:  custodianName || 'Unspecified',
          stageName,
          expectedHash:   previousHash,
          receivedHash:   hash,
          timestamp:      checkpoint.timestamp,
        }).then(result => {
          checkpoint.emailAlert = result;
        });
      }
    }

    setCheckpoints(prev => [...prev, checkpoint]);

    // Update document status and checkpoint count
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

  // Get checkpoints for a specific document
  const getDocumentCheckpoints = useCallback((docId) => {
    return checkpoints
      .filter(c => c.documentId === docId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [checkpoints]);

  // Get a document by ID
  const getDocument = useCallback((docId) => {
    return documents.find(d => d.id === docId) || null;
  }, [documents]);

  // Reset all data
  const resetAll = useCallback(() => {
    clearAllData();
    setDocuments([]);
    setCheckpoints([]);
    setActiveDocId(null);
    setLastResult(null);
    setSearchQuery('');
    setCurrentView('dashboard');
  }, []);

  // Load sample data
  const loadSample = useCallback(async () => {
    const sample = await generateSampleData();
    setDocuments(sample.documents);
    setCheckpoints(sample.checkpoints);
    setLastResult(null);
  }, []);

  // Filtered documents for search
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const docCheckpoints = checkpoints.filter(c => c.documentId === doc.id);
    return (
      doc.id.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.currentStatus.toLowerCase().includes(q) ||
      docCheckpoints.some(c =>
        c.custodianName.toLowerCase().includes(q) ||
        c.stageName.toLowerCase().includes(q)
      )
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
    createDocument,
    logCheckpoint,
    getDocumentCheckpoints,
    getDocument,
    resetAll,
    loadSample,
  };
}
