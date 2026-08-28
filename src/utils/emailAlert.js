import emailjs from '@emailjs/browser';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EmailJS Configuration — Replace with YOUR credentials
// Sign up at https://www.emailjs.com (free: 200 emails/month)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const EMAILJS_CONFIG = {
  serviceId:  'YOUR_SERVICE_ID',   // e.g. 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID',  // e.g. 'template_xyz789'
  publicKey:  'YOUR_PUBLIC_KEY',    // e.g. 'user_ABCdef123'
};

let initialized = false;

/**
 * Initialize EmailJS with your public key.
 * Safe to call multiple times — only runs once.
 */
export function initEmailService() {
  if (initialized || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') return;
  emailjs.init(EMAILJS_CONFIG.publicKey);
  initialized = true;
}

/**
 * Returns true if EmailJS has been configured with real credentials.
 */
export function isEmailConfigured() {
  return (
    EMAILJS_CONFIG.serviceId  !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' &&
    EMAILJS_CONFIG.publicKey  !== 'YOUR_PUBLIC_KEY'
  );
}

/**
 * Send a tamper alert email to the document's registered authority.
 *
 * @param {Object} params
 * @param {string} params.authorityEmail  – Recipient email
 * @param {string} params.documentTitle   – Document name
 * @param {string} params.documentId      – Document ID
 * @param {string} params.custodianName   – Who held the doc when breach occurred
 * @param {string} params.stageName       – Checkpoint stage where breach was found
 * @param {string} params.expectedHash    – Hash from the previous checkpoint
 * @param {string} params.receivedHash    – Hash that was actually computed
 * @param {string} params.timestamp       – ISO timestamp of detection
 *
 * @returns {{ success: boolean, message: string }}
 */
export async function sendTamperAlert({
  authorityEmail,
  documentTitle,
  documentId,
  custodianName,
  stageName,
  expectedHash,
  receivedHash,
  timestamp,
}) {
  // Guard: skip if no email or not configured
  if (!authorityEmail) {
    return { success: false, message: 'No authority email registered for this document.' };
  }

  if (!isEmailConfigured()) {
    console.warn(
      '[PaperTrail] EmailJS not configured. Tamper alert NOT sent. ' +
      'Update EMAILJS_CONFIG in src/utils/emailAlert.js with your credentials.'
    );
    return {
      success: false,
      message: 'Email service not configured. Update credentials in emailAlert.js.',
    };
  }

  initEmailService();

  const templateParams = {
    authority_email: authorityEmail,
    document_title:  documentTitle,
    document_id:     documentId,
    custodian_name:  custodianName  || 'Unknown',
    stage_name:      stageName      || 'Unknown',
    expected_hash:   expectedHash   || 'N/A',
    received_hash:   receivedHash   || 'N/A',
    timestamp:       new Date(timestamp).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }),
    to_email:        authorityEmail,
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
    );
    console.log(`[PaperTrail] Tamper alert sent to ${authorityEmail}`);
    return { success: true, message: `Alert dispatched to ${authorityEmail}` };
  } catch (err) {
    console.error('[PaperTrail] Failed to send tamper alert:', err);
    return { success: false, message: `Email send failed: ${err?.text || err?.message || 'Unknown error'}` };
  }
}
