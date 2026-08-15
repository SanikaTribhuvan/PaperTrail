import { shortHash } from '../utils/crypto';

export default function DocumentPreview({ title, category, hash, content }) {
  const isExam = category === 'EXAM_PAPER' || category === 'GOV_TENDER';

  return (
    <div className="brutal-card-static bg-white p-0 overflow-hidden">
      {/* Document header bar */}
      <div className="bg-navy px-4 py-3 border-b-[3px] border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber rounded-full" />
            <span className="font-mono text-[10px] text-amber/80 tracking-widest uppercase">
              {isExam ? 'CLASSIFIED DOCUMENT PREVIEW' : 'OFFICIAL RECORD PREVIEW'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/40">
            CONFIDENTIAL
          </span>
        </div>
      </div>

      {/* Document body */}
      <div className="p-5 bg-[#FFFEF9] relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span className="text-8xl font-black text-navy rotate-[-30deg] select-none">
            DRAFT
          </span>
        </div>

        {/* Ministry header */}
        <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-navy/20">
          <div className="font-mono text-[9px] tracking-[0.3em] text-navy/40 uppercase mb-1">
            {isExam ? 'PUBLIC SERVICE COMMISSION' : 'REVENUE DEPARTMENT'}
          </div>
          <div className="font-bold text-sm text-navy">
            {title || 'Untitled Document'}
          </div>
          <div className="font-mono text-[9px] text-navy/30 mt-1">
            {isExam ? 'QUESTION PAPER — RESTRICTED' : 'MUTATION ORDER — OFFICIAL'}
          </div>
        </div>

        {/* Barcode ribbon */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="bg-navy/80"
              style={{
                width: Math.random() > 0.5 ? '3px' : '1.5px',
                height: '18px',
              }}
            />
          ))}
          <span className="font-mono text-[8px] text-navy/30 ml-2">
            SER-{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
          </span>
        </div>

        {/* Content preview */}
        <div className="font-mono text-xs text-navy/60 leading-relaxed mb-4 min-h-[60px] whitespace-pre-wrap">
          {content
            ? content.length > 200
              ? content.slice(0, 200) + '…'
              : content
            : 'Awaiting document content…'}
        </div>

        {/* Hash badge */}
        {hash && (
          <div className="hash-reveal mt-3 pt-3 border-t-2 border-dashed border-navy/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-verified rounded-full animate-pulse" />
              <span className="font-mono text-[10px] text-navy/40 uppercase tracking-wider">
                Live SHA-256 Fingerprint
              </span>
            </div>
            <div className="font-mono text-xs text-navy/70 mt-1 break-all bg-navy/5 px-2 py-1.5 brutal-border">
              {hash}
            </div>
          </div>
        )}

        {/* Serial matrix */}
        <div className="mt-4 flex items-center justify-between">
          <div className="grid grid-cols-8 gap-[2px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2"
                style={{ backgroundColor: i % 3 === 0 ? '#0B2545' : i % 2 === 0 ? '#E9B44C' : '#ddd' }}
              />
            ))}
          </div>
          <span className="font-mono text-[8px] text-navy/20">
            SECURITY MATRIX v2.1
          </span>
        </div>
      </div>
    </div>
  );
}
