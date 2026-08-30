import { generateSHA256 } from './crypto';
import { buildHashPayload, calculatePriorityScore } from './priorityEngine';

/**
 * Generates sample walkthrough data for Part A (Exam Papers & Land Records)
 */
export async function generateDocumentSampleData() {
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
    authorityEmail: 'controller-of-exams@mpsc.gov.in',
  };

  const examCheckpoints = [
    {
      id: 'CHK-10001',
      documentId: 'DOC-MH-2026-0001',
      stageName: 'Printing & Packaging',
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
      stageName: 'District Treasury Strongroom',
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
      stageName: 'Center Custody Handover',
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
    authorityEmail: 'revenue-officer@ahmednagar.gov.in',
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

/**
 * Generates sample walkthrough data for Part B (Civic Tickets)
 */
export async function generateCivicSampleData() {
  const sanitationTicket = {
    title: 'Open Drain Overflow — Shivaji Nagar Colony',
    wardNumber: 2,
    category: 'SANITATION',
    description: 'Sewage overflow from main drain causing health hazard near primary school. 200+ families affected.',
    password: 'admin123',
    metrics: { citizenImpact: 9, hazardRisk: 8, estimatedCost: 350000 },
  };
  const sanitationPayload = buildHashPayload(sanitationTicket);
  const sanitationHash = await generateSHA256(sanitationPayload);
  const sanitationPriority = calculatePriorityScore(sanitationTicket.metrics);

  const sanitationDoc = {
    id: 'TKT-KPG-2026-0001',
    title: sanitationTicket.title,
    wardNumber: sanitationTicket.wardNumber,
    category: sanitationTicket.category,
    description: sanitationTicket.description,
    metrics: { ...sanitationTicket.metrics },
    priorityScore: sanitationPriority.score,
    createdAt: new Date('2026-08-25T09:00:00').toISOString(),
    initialHash: sanitationHash,
    currentStatus: 'verified',
    totalCheckpoints: 3,
    authorityEmail: 'ward2-officer@kopargaon.gov.in',
  };

  const sanitationCheckpoints = [
    {
      id: 'CHK-10001',
      documentId: 'TKT-KPG-2026-0001',
      stageName: 'Issue Intake & Genesis Sealing',
      custodianName: 'Smt. Rekha Patil',
      custodianRole: 'Ward 2 Civic Officer',
      timestamp: new Date('2026-08-25T09:00:00').toISOString(),
      contentSnapshot: sanitationPayload,
      computedHash: sanitationHash,
      previousHash: null,
      status: 'sealed',
    },
    {
      id: 'CHK-10002',
      documentId: 'TKT-KPG-2026-0001',
      stageName: 'Budget Committee Review',
      custodianName: 'Shri. A. D. Kulkarni',
      custodianRole: 'Municipal Budget Officer',
      timestamp: new Date('2026-08-26T14:30:00').toISOString(),
      contentSnapshot: sanitationPayload,
      computedHash: sanitationHash,
      previousHash: sanitationHash,
      status: 'verified',
    },
    {
      id: 'CHK-10003',
      documentId: 'TKT-KPG-2026-0001',
      stageName: 'Contractor Assignment',
      custodianName: 'Shri. M. S. Jadhav',
      custodianRole: 'Municipal Commissioner',
      timestamp: new Date('2026-08-27T10:15:00').toISOString(),
      contentSnapshot: sanitationPayload,
      computedHash: sanitationHash,
      previousHash: sanitationHash,
      status: 'verified',
    },
  ];

  // Scenario 2: Corrupt Prioritization
  const roadTicketOriginal = {
    title: 'Pothole Repair — Savedi Link Road',
    wardNumber: 5,
    category: 'INFRASTRUCTURE',
    description: 'Minor pothole cluster on link road.',
    password: 'admin123',
    metrics: { citizenImpact: 3, hazardRisk: 2, estimatedCost: 2500000 },
  };
  const roadPayloadOriginal = buildHashPayload(roadTicketOriginal);
  const roadHashOriginal = await generateSHA256(roadPayloadOriginal);

  const roadTicketTampered = {
    ...roadTicketOriginal,
    metrics: { citizenImpact: 9, hazardRisk: 2, estimatedCost: 2500000 },
  };
  const roadPayloadTampered = buildHashPayload(roadTicketTampered);
  const roadHashTampered = await generateSHA256(roadPayloadTampered);
  const roadPriority = calculatePriorityScore(roadTicketOriginal.metrics);

  const roadDoc = {
    id: 'TKT-KPG-2026-0002',
    title: roadTicketOriginal.title,
    wardNumber: roadTicketOriginal.wardNumber,
    category: roadTicketOriginal.category,
    description: roadTicketOriginal.description,
    metrics: { ...roadTicketOriginal.metrics },
    priorityScore: roadPriority.score,
    createdAt: new Date('2026-08-25T11:00:00').toISOString(),
    initialHash: roadHashOriginal,
    currentStatus: 'tampered',
    totalCheckpoints: 3,
    authorityEmail: 'commissioner@kopargaon.gov.in',
  };

  const roadCheckpoints = [
    {
      id: 'CHK-20001',
      documentId: 'TKT-KPG-2026-0002',
      stageName: 'Issue Intake & Genesis Sealing',
      custodianName: 'Shri. S. K. Shinde',
      custodianRole: 'Ward 5 Civic Officer',
      timestamp: new Date('2026-08-25T11:00:00').toISOString(),
      contentSnapshot: roadPayloadOriginal,
      computedHash: roadHashOriginal,
      previousHash: null,
      status: 'sealed',
    },
    {
      id: 'CHK-20002',
      documentId: 'TKT-KPG-2026-0002',
      stageName: 'Budget Committee Review',
      custodianName: 'Shri. P. R. Thorat',
      custodianRole: 'Standing Committee Member',
      timestamp: new Date('2026-08-26T16:00:00').toISOString(),
      contentSnapshot: roadPayloadTampered,
      computedHash: roadHashTampered,
      previousHash: roadHashOriginal,
      status: 'tampered',
      tamperDetails: {
        expectedHash: roadHashOriginal,
        receivedHash: roadHashTampered,
        diffSnippet: 'Citizen Impact inflated from 3/10 to 9/10 (unauthorized score inflation)',
      },
    },
    {
      id: 'CHK-20003',
      documentId: 'TKT-KPG-2026-0002',
      stageName: 'Tender Publication',
      custodianName: 'Shri. V. K. Borde',
      custodianRole: 'Tender Officer',
      timestamp: new Date('2026-08-27T11:30:00').toISOString(),
      contentSnapshot: roadPayloadTampered,
      computedHash: roadHashTampered,
      previousHash: roadHashTampered,
      status: 'tampered',
    },
  ];

  return {
    documents: [sanitationDoc, roadDoc],
    checkpoints: [...sanitationCheckpoints, ...roadCheckpoints],
  };
}

/**
 * Universal loader: defaults to document mode or accepts mode
 */
export async function generateSampleData(mode = 'document') {
  if (mode === 'civic') {
    return generateCivicSampleData();
  }
  return generateDocumentSampleData();
}
