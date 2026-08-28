import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ShieldOff, Lock, Ban } from 'lucide-react';

const STAGES = [
  {
    name: 'CREATED',
    subtitle: 'Genesis Vault',
    detail: 'Hash generated, QR rendered',
    status: 'verified',
    statusLabel: '✅ VERIFIED',
    statusColor: 'bg-verified text-white',
    icon: Lock,
  },
  {
    name: 'PRINTING & PACKAGING',
    subtitle: 'Press Floor',
    detail: 'Scan logged, hash match',
    status: 'verified',
    statusLabel: '✅ VERIFIED',
    statusColor: 'bg-verified text-white',
    icon: ShieldCheck,
  },
  {
    name: 'ARMORED TRANSIT INBOUND',
    subtitle: 'Logistics',
    detail: 'Content altered / Seal broken',
    status: 'tampered',
    statusLabel: '🚨 TAMPERED: FLAGGED HERE',
    statusColor: 'bg-tampered text-white tamper-pulse',
    icon: ShieldAlert,
  },
  {
    name: 'DISTRICT TREASURY STRONGROOM',
    subtitle: 'Vault Storage',
    detail: 'Chain integrity compromised',
    status: 'blocked',
    statusLabel: '⚠️ BLOCKED',
    statusColor: 'bg-amber text-ink',
    icon: ShieldOff,
  },
  {
    name: 'CENTER CUSTODY HANDOVER',
    subtitle: 'Distribution',
    detail: 'Distribution halted',
    status: 'halted',
    statusLabel: '⛔ HALTED',
    statusColor: 'bg-ink text-white',
    icon: Ban,
  },
];

export default function CheckpointsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="checkpoints" className="bg-indigo py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-highlighter uppercase block mb-4">
          ▼ 02 · HOW IT WORKS
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
          FIVE STOPS. ONE UNBROKEN CHAIN.
        </h2>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-3xl mb-12">
          Every custody transfer runs the same SHA-256 comparison a human eye can't. Change one
          character anywhere in the document, and the very next checkpoint catches it — and names
          exactly who was holding it when it happened.
        </p>

        {/* Custody path */}
        <div className="relative">
          {/* Horizontal connector line - desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-[3px] bg-white/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3 relative z-10">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Node circle */}
                  <div className={`
                    w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center mb-3
                    ${stage.status === 'tampered' ? 'bg-tampered tamper-pulse' :
                      stage.status === 'verified' ? 'bg-verified' :
                      stage.status === 'blocked' ? 'bg-amber' : 'bg-ink'}
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Card */}
                  <div className={`
                    brutal-card-static p-3 w-full
                    ${stage.status === 'tampered' ? 'bg-tampered/10 border-tampered!' : 'bg-white'}
                  `}>
                    <div className="font-mono text-[10px] font-bold text-ink/40 uppercase tracking-wider mb-1">
                      {stage.name}
                    </div>
                    <div className="text-xs font-semibold text-ink mb-1">{stage.subtitle}</div>
                    <div className="text-[10px] text-ink/50 mb-2">{stage.detail}</div>
                    <span className={`pill-badge text-[9px] ${stage.statusColor}`}>
                      {stage.statusLabel}
                    </span>
                  </div>

                  {/* Connector arrow - mobile */}
                  {i < STAGES.length - 1 && (
                    <div className="md:hidden text-white/40 text-xl my-2">↓</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Link to demo */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm mb-4 italic">
            This exact flow is live — not a mockup.
          </p>
          <Link
            to="/demo"
            className="brutal-btn bg-highlighter text-ink px-6 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
          >
            TRY THE LIVE DEMO →
          </Link>
        </div>
      </div>
    </section>
  );
}
