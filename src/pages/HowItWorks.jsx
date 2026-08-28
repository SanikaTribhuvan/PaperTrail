import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fingerprint, ScanLine, GitCompare, AlertTriangle, Eye } from 'lucide-react';

const CHAPTERS = [
  {
    number: '01',
    title: 'GENESIS SEALING',
    subtitle: 'How Web Crypto API generates the initial 256-bit hash and error-correction Level-H QR code.',
    icon: Fingerprint,
    detail: [
      'The instant a document is created, PaperTrail feeds its text content to the browser\'s native crypto.subtle.digest("SHA-256", ...) — no server, no third-party library.',
      'The result is a 64-character hex string: the document\'s cryptographic fingerprint.',
      'A QR code is generated at error-correction level H (30% damage-tolerant), encoding the document ID for quick scanning at every future checkpoint.',
    ],
    color: 'bg-sealed',
  },
  {
    number: '02',
    title: 'THE HANDOFF HANDSHAKE',
    subtitle: 'Dual-path QR camera scanning + manual DOC-ID fallback.',
    icon: ScanLine,
    detail: [
      'At each custody transfer, the receiving custodian has two paths: scan the QR code with any phone camera, or manually type the document ID.',
      'Both routes arrive at the same checkpoint form: paste the document content, identify yourself, and hit verify.',
      'Low-connectivity sites, damaged printouts, or no-camera setups never block the chain — the manual fallback always works.',
    ],
    color: 'bg-teal',
  },
  {
    number: '03',
    title: 'THE AVALANCHE COMPARISON',
    subtitle: 'Strict equality check — one changed character flips ~50% of the hash.',
    icon: GitCompare,
    detail: [
      'The check is a literal hash === previousHash. If the hashes match, the document is intact. If they don\'t, it was changed.',
    ],
    hashDemo: {
      before: {
        label: 'Original: "This is the official test content for verification"',
        hash: 'a25cb81b41714aaaa2007c248ecc2e6b4649c962926a4839b1e3c2e2cce27ae8',
      },
      after: {
        label: 'One word changed to "MODIFIED"',
        hash: '628b33cafc646888b4dce328dabdcf921447ca9a6a1db6ffd2af27bef9dd94a0',
      },
    },
    color: 'bg-tampered',
  },
  {
    number: '04',
    title: 'THE RED FLAG ISOLATION',
    subtitle: 'Pinpointing who, when, and where — without searching through file cabinets.',
    icon: AlertTriangle,
    detail: [
      'When a mismatch is detected, the system immediately surfaces three things: the custodian holding the document, the exact timestamp, and the checkpoint location.',
      'No manual investigation needed. No he-said-she-said. The chain names the exact link where integrity broke.',
      'Every subsequent checkpoint after a tamper event is automatically blocked — the chain doesn\'t just flag, it halts.',
    ],
    color: 'bg-amber',
  },
  {
    number: '05',
    title: 'PUBLIC VERIFIABILITY',
    subtitle: 'Zero-login verification for candidates, journalists, and RTI compliance.',
    icon: Eye,
    detail: [
      'No login. No account. No permission needed. Anyone with a document ID can look up its full chain history.',
      'This is designed for RTI (Right to Information) compliance: the audit trail is transparent by default, not by request.',
      'Candidates can verify their own exam papers, journalists can fact-check official documents, and civil society can audit government processes — all from a browser.',
    ],
    color: 'bg-verified',
  },
];

function HashDiffViewer({ demo }) {
  // Highlight characters that differ
  const renderDiff = (hash1, hash2) => {
    return hash1.split('').map((char, i) => (
      <span
        key={i}
        className={char !== hash2[i] ? 'text-tampered bg-tampered/10 font-bold' : 'text-ink/40'}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="grid md:grid-cols-2 gap-3 mt-6">
      <div className="brutal-card-static bg-white p-4">
        <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-verified rounded-full" />
          {demo.before.label}
        </div>
        <div className="font-mono text-xs break-all bg-verified/5 p-2 brutal-border">
          {demo.before.hash}
        </div>
      </div>
      <div className="brutal-card-static bg-white p-4">
        <div className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-tampered rounded-full" />
          {demo.after.label}
        </div>
        <div className="font-mono text-xs break-all bg-tampered/5 p-2 brutal-border">
          {renderDiff(demo.after.hash, demo.before.hash)}
        </div>
      </div>
      <div className="md:col-span-2 text-center">
        <p className="text-xs text-ink/40 italic">
          Roughly half the 64-character hex string flips from changing a single word — real output from the project's own testing.
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-indigo py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-highlighter uppercase block mb-4">
            THE EXHIBITION
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4">
            HOW THE CHAIN WORKS.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl">
            Five sequential chapters, from the moment a document is born to the moment
            anyone can verify it never changed.
          </p>
        </div>
      </div>

      {/* Chapters */}
      <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {CHAPTERS.map((chapter, i) => {
            const Icon = chapter.icon;
            return <ChapterCard key={i} chapter={chapter} Icon={Icon} index={i} />;
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-ink py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl md:text-4xl text-white mb-4">
          SEEN ENOUGH? TRY IT YOURSELF.
        </h2>
        <p className="text-white/50 text-sm mb-6">
          The live prototype runs every step described above — in your browser, right now.
        </p>
        <Link
          to="/demo"
          className="brutal-btn bg-highlighter text-ink px-8 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
        >
          LAUNCH DEMO →
        </Link>
      </div>
    </div>
  );
}

function ChapterCard({ chapter, Icon, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Chapter number + icon */}
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-ink text-white font-mono text-xs font-bold px-3 py-1.5 border-[2.5px] border-ink">
          {chapter.number}
        </span>
        <div className={`w-10 h-10 ${chapter.color} rounded-lg brutal-border flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-lg md:text-xl text-ink">
            {chapter.title}
          </h2>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-ink/60 italic mb-6 pl-4 border-l-[3px] border-ink/10">
        {chapter.subtitle}
      </p>

      {/* Detail paragraphs */}
      <div className="space-y-3 mb-4">
        {chapter.detail.map((para, j) => (
          <p key={j} className="text-sm text-ink/70 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Hash comparison demo for chapter 3 */}
      {chapter.hashDemo && <HashDiffViewer demo={chapter.hashDemo} />}

      {/* Separator */}
      {index < CHAPTERS.length - 1 && (
        <div className="mt-12 border-t-[3px] border-dashed border-ink/10" />
      )}
    </motion.div>
  );
}
