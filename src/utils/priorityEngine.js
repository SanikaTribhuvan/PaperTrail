/**
 * PaperTrail: Immutable Civic Triage — Priority Scoring Engine
 *
 * Calculates a weighted priority score for CivicTickets.
 * Formula: (citizenImpact × 4) + (hazardRisk × 4) + ((10 - costNormalized) × 2)
 * Max score = 100, higher = more urgent.
 *
 * The hash payload includes the priority score so that if anyone
 * retroactively inflates metrics to justify a budget allocation,
 * the hash chain breaks.
 */

const CATEGORY_LABELS = {
  SANITATION:     'Sanitation & Waste',
  INFRASTRUCTURE: 'Infrastructure & Roads',
  DISASTER:       'Disaster & Hazard',
  WATER_SUPPLY:   'Water Supply',
  PUBLIC_HEALTH:  'Public Health',
  GOVERNANCE:     'Governance & Records',
};

const CATEGORY_ICONS = {
  SANITATION:     '🗑️',
  INFRASTRUCTURE: '🏗️',
  DISASTER:       '🌊',
  WATER_SUPPLY:   '💧',
  PUBLIC_HEALTH:  '🏥',
  GOVERNANCE:     '📋',
};

const COST_BRACKETS = [
  { max: 100000,   label: '< ₹1L',    normalized: 1 },
  { max: 500000,   label: '₹1–5L',    normalized: 3 },
  { max: 1000000,  label: '₹5–10L',   normalized: 5 },
  { max: 5000000,  label: '₹10–50L',  normalized: 7 },
  { max: Infinity, label: '> ₹50L',   normalized: 9 },
];

/**
 * Normalize estimated cost to a 1–10 scale.
 */
function normalizeCost(estimatedCost) {
  for (const bracket of COST_BRACKETS) {
    if (estimatedCost <= bracket.max) return bracket.normalized;
  }
  return 9;
}

/**
 * Calculate the priority score for a civic ticket.
 *
 * @param {Object} metrics
 * @param {number} metrics.citizenImpact  — 1 to 10
 * @param {number} metrics.hazardRisk     — 1 to 10
 * @param {number} metrics.estimatedCost  — in rupees
 * @returns {{ score: number, rank: string, rankColor: string, justification: string, factors: Array }}
 */
export function calculatePriorityScore(metrics) {
  const impact = Math.min(10, Math.max(1, metrics.citizenImpact || 1));
  const risk   = Math.min(10, Math.max(1, metrics.hazardRisk || 1));
  const costNorm = normalizeCost(metrics.estimatedCost || 0);

  // Weighted formula: Impact×4 + Risk×4 + CostEfficiency×2 = max 100
  const impactPts  = impact * 4;       // max 40
  const riskPts    = risk * 4;         // max 40
  const costPts    = (10 - costNorm) * 2; // max 20 (lower cost = higher score)

  const score = Math.round(impactPts + riskPts + costPts);

  const factors = [
    {
      name: 'Citizen Impact',
      value: impact,
      points: impactPts,
      max: 40,
      reason: `Impact rated ${impact}/10 → ${impactPts} points (×4 weight).`,
    },
    {
      name: 'Hazard Risk',
      value: risk,
      points: riskPts,
      max: 40,
      reason: `Risk rated ${risk}/10 → ${riskPts} points (×4 weight).`,
    },
    {
      name: 'Cost Efficiency',
      value: 10 - costNorm,
      points: costPts,
      max: 20,
      reason: `Est. cost ₹${(metrics.estimatedCost || 0).toLocaleString('en-IN')} (bracket ${costNorm}/10) → ${costPts} efficiency points.`,
    },
  ];

  // Generate justification string
  let justification;
  if (risk >= 8 && impact >= 7) {
    justification = 'Critical Risk / High Impact';
  } else if (risk >= 8) {
    justification = 'Critical Hazard Risk';
  } else if (impact >= 8) {
    justification = 'High Citizen Impact';
  } else if (costPts >= 14 && (impact >= 5 || risk >= 5)) {
    justification = 'High Impact / Low Budget';
  } else if (score >= 60) {
    justification = 'Above-Average Priority';
  } else if (score >= 40) {
    justification = 'Moderate Priority';
  } else {
    justification = 'Standard Queue';
  }

  let rank, rankColor;
  if (score >= 75) {
    rank = 'CRITICAL';
    rankColor = 'tampered';
  } else if (score >= 55) {
    rank = 'HIGH';
    rankColor = 'amber';
  } else if (score >= 35) {
    rank = 'MEDIUM';
    rankColor = 'sealed';
  } else {
    rank = 'LOW';
    rankColor = 'verified';
  }

  return { score, rank, rankColor, justification, factors };
}

/**
 * Build the hashable payload string from ticket data + priority score.
 * This is what gets SHA-256'd — if metrics or score change post-facto, hash breaks.
 */
export function buildHashPayload(ticket) {
  const priority = calculatePriorityScore(ticket.metrics);
  const payload = {
    password: ticket.password,
    ward: ticket.wardNumber,
    category: ticket.category,
    citizenImpact: ticket.metrics.citizenImpact,
    hazardRisk: ticket.metrics.hazardRisk,
    estimatedCost: ticket.metrics.estimatedCost,
    priorityScore: priority.score,
  };
  return JSON.stringify(payload, null, 0);
}

export { CATEGORY_LABELS, CATEGORY_ICONS };
