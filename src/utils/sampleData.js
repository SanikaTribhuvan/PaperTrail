import { generateSHA256 } from './crypto';
import { buildHashPayload, calculatePriorityScore } from './priorityEngine';

/**
 * Kopargaon Municipal Council — Sample Walkthrough Scenarios
 *
 * Scenario 1: CLEAN ALLOCATION (SKH021 - Garbage Collection)
 *   Ward 2 critical sanitation → correctly scored high → budget allocated → verified
 *
 * Scenario 2: CORRUPT PRIORITIZATION (SKH012 - Development Project)
 *   Low-priority road repair → someone inflates Citizen Impact from 3→9
 *   at Budget Committee stage → hash mismatch → TAMPER DETECTED
 */
export async function generateSampleData() {

  // ═══ SCENARIO 1: Clean Allocation — Critical Sanitation in Ward 2 ═══
  const sanitationTicket = {
    title: 'Open Drain Overflow — Shivaji Nagar Colony',
    wardNumber: 2,
    category: 'SANITATION',
    description: 'Sewage overflow from main drain causing health hazard near primary school. 200+ families affected. Monsoon worsening the situation daily.',
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

  // ═══ SCENARIO 2: Corrupt Prioritization — Road Repair Metric Manipulation ═══
  const roadTicketOriginal = {
    title: 'Pothole Repair — Savedi Link Road',
    wardNumber: 5,
    category: 'INFRASTRUCTURE',
    description: 'Minor pothole cluster on Savedi-Kopargaon link road near petrol pump. Low traffic area.',
    password: 'admin123',
    metrics: { citizenImpact: 3, hazardRisk: 2, estimatedCost: 2500000 },
  };
  const roadPayloadOriginal = buildHashPayload(roadTicketOriginal);
  const roadHashOriginal = await generateSHA256(roadPayloadOriginal);

  // At checkpoint 2, someone inflates citizenImpact from 3→9 to justify immediate funding
  const roadTicketTampered = {
    ...roadTicketOriginal,
    metrics: { citizenImpact: 9, hazardRisk: 2, estimatedCost: 2500000 },
  };
  const roadPayloadTampered = buildHashPayload(roadTicketTampered);
  const roadHashTampered = await generateSHA256(roadPayloadTampered);

  const roadDoc = {
    id: 'TKT-KPG-2026-0002',
    title: roadTicketOriginal.title,
    wardNumber: roadTicketOriginal.wardNumber,
    category: roadTicketOriginal.category,
    description: roadTicketOriginal.description,
    metrics: { ...roadTicketOriginal.metrics },
    priorityScore: calculatePriorityScore(roadTicketOriginal.metrics).score,
    createdAt: new Date('2026-08-24T11:00:00').toISOString(),
    initialHash: roadHashOriginal,
    currentStatus: 'tampered',
    totalCheckpoints: 2,
    authorityEmail: 'commissioner@kopargaon.gov.in',
  };

  const roadCheckpoints = [
    {
      id: 'CHK-20001',
      documentId: 'TKT-KPG-2026-0002',
      stageName: 'Issue Intake & Genesis Sealing',
      custodianName: 'Shri. R. B. Gaikwad',
      custodianRole: 'Ward 5 Clerk',
      timestamp: new Date('2026-08-24T11:00:00').toISOString(),
      contentSnapshot: roadPayloadOriginal,
      computedHash: roadHashOriginal,
      previousHash: null,
      status: 'sealed',
    },
    {
      id: 'CHK-20002',
      documentId: 'TKT-KPG-2026-0002',
      stageName: 'Budget Committee Review',
      custodianName: 'Shri. V. N. More',
      custodianRole: 'Budget Committee Member',
      timestamp: new Date('2026-08-26T16:00:00').toISOString(),
      contentSnapshot: roadPayloadTampered,
      computedHash: roadHashTampered,
      previousHash: roadHashOriginal,
      status: 'tampered',
      tamperDetails: {
        expectedHash: roadHashOriginal,
        receivedHash: roadHashTampered,
        diffSnippet: 'Citizen Impact altered from 3 to 9 to justify immediate budget allocation',
      },
    },
  ];

  // ═══ SCENARIO 3: Water Supply Issue — In Queue ═══
  const waterTicket = {
    title: 'Ward 7 Water Tanker Schedule Disruption',
    wardNumber: 7,
    category: 'WATER_SUPPLY',
    description: 'Regular tanker supply disrupted for 3 days. Colony of 400 families without water.',
    password: 'admin123',
    metrics: { citizenImpact: 8, hazardRisk: 6, estimatedCost: 75000 },
  };
  const waterPayload = buildHashPayload(waterTicket);
  const waterHash = await generateSHA256(waterPayload);

  const waterDoc = {
    id: 'TKT-KPG-2026-0003',
    title: waterTicket.title,
    wardNumber: waterTicket.wardNumber,
    category: waterTicket.category,
    description: waterTicket.description,
    metrics: { ...waterTicket.metrics },
    priorityScore: calculatePriorityScore(waterTicket.metrics).score,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    initialHash: waterHash,
    currentStatus: 'sealed',
    totalCheckpoints: 1,
    authorityEmail: 'water-dept@kopargaon.gov.in',
  };

  const waterCheckpoints = [
    {
      id: 'CHK-30001',
      documentId: 'TKT-KPG-2026-0003',
      stageName: 'Issue Intake & Genesis Sealing',
      custodianName: 'Shri. P. K. Sonawane',
      custodianRole: 'Water Supply Officer',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      contentSnapshot: waterPayload,
      computedHash: waterHash,
      previousHash: null,
      status: 'sealed',
    },
  ];

  // ═══ SCENARIO 4: Disaster Alert — Flood Risk ═══
  const floodTicket = {
    title: 'Godavari Embankment Erosion — Ward 1',
    wardNumber: 1,
    category: 'DISASTER',
    description: 'Embankment erosion near Godavari bridge detected. 2000+ residents in flood zone.',
    password: 'admin123',
    metrics: { citizenImpact: 10, hazardRisk: 10, estimatedCost: 4500000 },
  };
  const floodPayload = buildHashPayload(floodTicket);
  const floodHash = await generateSHA256(floodPayload);

  const floodDoc = {
    id: 'TKT-KPG-2026-0004',
    title: floodTicket.title,
    wardNumber: floodTicket.wardNumber,
    category: floodTicket.category,
    description: floodTicket.description,
    metrics: { ...floodTicket.metrics },
    priorityScore: calculatePriorityScore(floodTicket.metrics).score,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    initialHash: floodHash,
    currentStatus: 'sealed',
    totalCheckpoints: 1,
    authorityEmail: 'disaster-mgmt@kopargaon.gov.in',
  };

  const floodCheckpoints = [
    {
      id: 'CHK-40001',
      documentId: 'TKT-KPG-2026-0004',
      stageName: 'Emergency Intake',
      custodianName: 'Shri. S. D. Pawar',
      custodianRole: 'Disaster Management Cell',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      contentSnapshot: floodPayload,
      computedHash: floodHash,
      previousHash: null,
      status: 'sealed',
    },
  ];

  return {
    documents: [sanitationDoc, roadDoc, waterDoc, floodDoc],
    checkpoints: [
      ...sanitationCheckpoints,
      ...roadCheckpoints,
      ...waterCheckpoints,
      ...floodCheckpoints,
    ],
  };
}
