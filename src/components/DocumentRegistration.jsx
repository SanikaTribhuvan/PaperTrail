import { useState, useEffect, useCallback } from 'react';
import { FilePlus, FileCheck, Fingerprint } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import SectionHeader from './ui/SectionHeader';
import BrutalButton from './ui/BrutalButton';
import StatusBadge from './ui/StatusBadge';
import DocumentPreview from './DocumentPreview';
import { generateSHA256 } from '../utils/crypto';

const CATEGORIES = [
  { value: 'EXAM_PAPER', label: 'Exam Question Paper' },
  { value: 'LAND_MUTATION', label: 'Land Mutation Record (7/12)' },
  { value: 'GOV_TENDER', label: 'Government Tender Bid' },
];

export default function DocumentRegistration({ onCreateDocument }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('EXAM_PAPER');
  const [custodianName, setCustodianName] = useState('');
  const [custodianRole, setCustodianRole] = useState('');
  const [authorityEmail, setAuthorityEmail] = useState('');
  const [content, setContent] = useState('');
  const [liveHash, setLiveHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [createdDoc, setCreatedDoc] = useState(null);

  // Live hash computation as user types
  useEffect(() => {
    if (!content.trim()) {
      setLiveHash('');
      return;
    }
    const timer = setTimeout(async () => {
      const hash = await generateSHA256(content);
      setLiveHash(hash);
    }, 150);
    return () => clearTimeout(timer);
  }, [content]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    setIsHashing(true);
    const result = await onCreateDocument(
      title,
      category,
      content,
      custodianName,
      custodianRole,
      authorityEmail
    );
    setCreatedDoc(result);
    setIsHashing(false);
  }, [title, category, content, custodianName, custodianRole, authorityEmail, onCreateDocument]);

  const handleReset = () => {
    setTitle('');
    setCategory('EXAM_PAPER');
    setCustodianName('');
    setCustodianRole('');
    setAuthorityEmail('');
    setContent('');
    setLiveHash('');
    setCreatedDoc(null);
  };

  if (createdDoc) {
    return (
      <section className="mb-10">
        <SectionHeader number={2} label="GENESIS VAULT & INITIAL HASHING" />
        <div className="brutal-card-static bg-white p-8 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-verified/10 brutal-border flex items-center justify-center mx-auto">
              <FileCheck className="w-8 h-8 text-verified" />
            </div>
          </div>
          <h3 className="text-xl font-black text-navy mb-2">Document Sealed Successfully</h3>
          <p className="text-sm text-navy/60 mb-6">
            Genesis checkpoint created with cryptographic baseline hash.
          </p>

          {/* Document ID & QR */}
          <div className="inline-block brutal-card-static p-6 bg-cream mb-6">
            <div className="font-mono text-xs text-navy/50 uppercase tracking-wider mb-2">
              Document ID
            </div>
            <div className="font-mono text-lg font-black text-navy mb-4">
              {createdDoc.document.id}
            </div>
            <div className="bg-white brutal-border p-3 inline-block">
              <QRCodeSVG
                value={createdDoc.document.id}
                size={160}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#0B2545"
              />
            </div>
            <div className="font-mono text-[10px] text-navy/40 mt-3">
              Scan to identify document at checkpoints
            </div>
          </div>

          <div className="mb-6">
            <StatusBadge status="sealed" size="lg" />
          </div>

          <div className="bg-navy/5 brutal-border p-4 mb-6 text-left max-w-lg mx-auto">
            <div className="font-mono text-[10px] text-navy/50 uppercase tracking-wider mb-1">
              SHA-256 Fingerprint
            </div>
            <div className="font-mono text-xs text-navy break-all">
              {createdDoc.checkpoint.computedHash}
            </div>
          </div>

          <BrutalButton variant="primary" onClick={handleReset}>
            <span className="flex items-center gap-2">
              <FilePlus className="w-4 h-4" />
              Register Another Document
            </span>
          </BrutalButton>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <SectionHeader number={2} label="GENESIS VAULT & INITIAL HASHING" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="brutal-card-static bg-white p-6">
          <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
            <FilePlus className="w-5 h-5" />
            Register New Document
          </h3>

          {/* Category Selector */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Document Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`
                    brutal-btn px-3 py-1.5 text-xs font-bold transition-all
                    ${category === cat.value
                      ? 'bg-navy text-white'
                      : 'bg-white text-navy hover:bg-cream'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Title / Reference Code
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MPSC Combined Preliminary Examination - Set A"
              className="brutal-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          {/* Custodian */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Genesis Officer Name
              </label>
              <input
                type="text"
                value={custodianName}
                onChange={(e) => setCustodianName(e.target.value)}
                placeholder="Dr. R. K. Sharma"
                className="brutal-input w-full px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
                Designation
              </label>
              <input
                type="text"
                value={custodianRole}
                onChange={(e) => setCustodianRole(e.target.value)}
                placeholder="Chief Superintendent"
                className="brutal-input w-full px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Authority Email (for breach alerts) */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Authority Email (for Tamper / Creation Alerts)
            </label>
            <input
              type="email"
              value={authorityEmail}
              onChange={(e) => setAuthorityEmail(e.target.value)}
              placeholder="controller-of-exams@mpsc.gov.in"
              className="brutal-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="font-mono text-[10px] text-navy/50 uppercase tracking-wider block mb-1.5">
              Document Content Payload
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type the full document content here…"
              rows={6}
              className="brutal-input w-full px-3 py-2.5 text-sm resize-none font-mono"
            />
          </div>

          {/* Live hash indicator */}
          {liveHash && (
            <div className="hash-reveal mb-4 bg-navy/5 brutal-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint className="w-3.5 h-3.5 text-teal" />
                <span className="font-mono text-[10px] text-navy/50 uppercase tracking-wider">
                  Live SHA-256 Preview
                </span>
              </div>
              <div className="font-mono text-xs text-navy/70 break-all">
                {liveHash}
              </div>
            </div>
          )}

          <BrutalButton
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isHashing}
          >
            <span className="flex items-center justify-center gap-2">
              <Fingerprint className="w-4 h-4" />
              {isHashing ? 'Computing SHA-256…' : 'Seal Document & Generate QR'}
            </span>
          </BrutalButton>
        </div>

        {/* Document Preview */}
        <div>
          <DocumentPreview
            title={title}
            category={category}
            hash={liveHash}
            content={content}
          />
        </div>
      </div>
    </section>
  );
}
