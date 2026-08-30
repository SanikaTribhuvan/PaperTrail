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
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard | timeline | triage
  const [activeMode, setActiveMode] = useState('document'); // 'document' (Part A: Exam/Land) | 'civic' (Part B: Civic Triage)
  const [lastResult, setLastResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => { saveDocuments(documents); }, [documents]);
  useEffect(() => { saveCheckpoints(checkpoints); }, [checkpoints]);

  /**
   * Part A: Create Document (Exam Paper, Land Mutation, Government Tender)
   */
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
      custodianRole: custodianRole || 'Genesis Custody Officer',
      timestamp: now,
      contentSnapshot: content,
      computedHash: hash,
      previousHash: null,
      status: 'sealed',
    };

    setDocuments(prev => [...prev, doc]);
    setCheckpoints(prev => [...prev, checkpoint]);
    setLastResult({ type: 'created', document: doc, checkpoint });

    if (doc.authorityEmail) {
      sendCreationAlert({
        authorityEmail: doc.authorityEmail,
        documentTitle: doc.title,
        documentId: doc.id,
        timestamp: now,
      });
    }

    return { document: doc, checkpoint };
  }, []);

  /**
   * Part B: Create Civic Ticket (Ward Resource Allocation)
   */
  const createTicket = useCallback(async (ticketData) => {
    const { title, wardNumber, category, description, metrics, authorityEmail, password } = ticketData;
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
   * Universal Checkpoint Logger (works for both Part A and Part B)
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
      custodianName: custodianName || 'Unspecified Custodian',
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

      // Dispatch EmailJS alert if document has authority email
      const doc = documentsRef.current.find(d => d.id === documentId);
      if (doc && doc.authorityEmail) {
        sendTamperAlert({
          authorityEmail: doc.authorityEmail,
          documentTitle: doc.title,
          documentId: doc.id,
          tamperedStage: stageName,
          responsibleOfficer: custodianName || 'Unknown Custodian',
          timestamp: checkpoint.timestamp,
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

  const loadSample = useCallback(async (forcedMode) => {
    const targetMode = forcedMode || activeMode;
    const sample = await generateSampleData(targetMode);
    setDocuments(sample.documents);
    setCheckpoints(sample.checkpoints);
    setLastResult(null);
  }, [activeMode]);

  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const docCheckpoints = checkpoints.filter(c => c.documentId === doc.id);
    return (
      doc.id.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.currentStatus.toLowerCase().includes(q) ||
      (doc.category && doc.category.toLowerCase().includes(q)) ||
      docCheckpoints.some(c =>
        c.custodianName.toLowerCase().includes(q) ||
        c.stageName.toLowerCase().includes(q)
      )
    );
  });

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
    activeMode,
    setActiveMode,
    lastResult,
    setLastResult,
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
  };
}
