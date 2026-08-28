import { generateSHA256 } from './crypto';

/**
 * Generates sample walkthrough data with pre-computed hashes.
 * Two scenarios:
 *   1. Clean chain (MPSC Exam) — sealed → verified → verified
 *   2. Breached chain (Land Mutation) — sealed → verified → tampered
 */
export async function generateSampleData() {
  // === Scenario 1: Clean MPSC Exam Chain ===
  const examContent = 'MPSC 2026 GENERAL STUDIES 100 QUESTIONS OFFICIAL';
  const examHash = await generateSHA256(examContent);

  const examDoc = {
    id: 'DOC-MH-2026-0001',
    title: 'MPSC Combined Preliminary Examination - Set A',
    category: 'EXAM_PAPER',
    createdAt: new Date('2026-03-15T09:00:00').toISOString(),
    initialHash: examHash,
    currentStatus: 'verified',
    totalCheckpoints: 3,
    authorityEmail: 'mpsc-exam-cell@gov.in',
  };

  const examCheckpoints = [
    {
      id: 'CHK-10001',
      documentId: 'DOC-MH-2026-0001',
      stageName: 'Printing & Sealing',
      custodianName: 'Dr. R. K. Sharma',
      custodianRole: 'Chief Printing Superintendent',
      timestamp: new Date('2026-03-15T09:00:00').toISOString(),
      contentSnapshot: examContent,
      computedHash: examHash,
      previousHash: null,
      status: 'sealed',
    },
    {
      id: 'CHK-10002',
      documentId: 'DOC-MH-2026-0001',
      stageName: 'Strongroom Vault',
      custodianName: 'Shri. A. D. Kulkarni',
      custodianRole: 'District Treasury Officer',
      timestamp: new Date('2026-03-16T14:30:00').toISOString(),
      contentSnapshot: examContent,
      computedHash: examHash,
      previousHash: examHash,
      status: 'verified',
    },
    {
      id: 'CHK-10003',
      documentId: 'DOC-MH-2026-0001',
      stageName: 'Center Distribution',
      custodianName: 'Prof. M. S. Jadhav',
      custodianRole: 'Examination Center Coordinator',
      timestamp: new Date('2026-03-17T06:45:00').toISOString(),
      contentSnapshot: examContent,
      computedHash: examHash,
      previousHash: examHash,
      status: 'verified',
    },
  ];

  // === Scenario 2: Tampered Land Mutation Chain ===
  const landContentOriginal = 'Land Parcel 142/A transferred to Suresh Patil with 0 encumbrances.';
  const landContentTampered = 'Land Parcel 142/A transferred to Rajesh Deshmukh with 0 encumbrances.';
  const landHashOriginal = await generateSHA256(landContentOriginal);
  const landHashTampered = await generateSHA256(landContentTampered);

  const landDoc = {
    id: 'DOC-MH-2026-0002',
    title: 'Survey No. 142/A — Land Mutation Order',
    category: 'LAND_MUTATION',
    createdAt: new Date('2026-04-01T10:00:00').toISOString(),
    initialHash: landHashOriginal,
    currentStatus: 'tampered',
    totalCheckpoints: 3,
    authorityEmail: 'collector-pune@revenue.gov.in',
  };

  const landCheckpoints = [
    {
      id: 'CHK-20001',
      documentId: 'DOC-MH-2026-0002',
      stageName: 'Collectorate Order',
      custodianName: 'Smt. P. V. Desai',
      custodianRole: 'Additional Collector',
      timestamp: new Date('2026-04-01T10:00:00').toISOString(),
      contentSnapshot: landContentOriginal,
      computedHash: landHashOriginal,
      previousHash: null,
      status: 'sealed',
    },
    {
      id: 'CHK-20002',
      documentId: 'DOC-MH-2026-0002',
      stageName: 'Sub-Registrar Inspection',
      custodianName: 'Shri. V. N. More',
      custodianRole: 'Sub-Registrar Grade I',
      timestamp: new Date('2026-04-03T11:30:00').toISOString(),
      contentSnapshot: landContentOriginal,
      computedHash: landHashOriginal,
      previousHash: landHashOriginal,
      status: 'verified',
    },
    {
      id: 'CHK-20003',
      documentId: 'DOC-MH-2026-0002',
      stageName: 'Talathi Office Mutation',
      custodianName: 'Shri. K. B. Jagtap',
      custodianRole: 'Village Talathi',
      timestamp: new Date('2026-04-05T15:00:00').toISOString(),
      contentSnapshot: landContentTampered,
      computedHash: landHashTampered,
      previousHash: landHashOriginal,
      status: 'tampered',
      tamperDetails: {
        expectedHash: landHashOriginal,
        receivedHash: landHashTampered,
        diffSnippet: 'Name changed from "Suresh Patil" to "Rajesh Deshmukh"',
      },
    },
  ];

  return {
    documents: [examDoc, landDoc],
    checkpoints: [...examCheckpoints, ...landCheckpoints],
  };
}
