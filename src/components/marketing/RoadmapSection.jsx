import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const PHASES = [
  {
    tag: '01',
    tagLabel: 'NOW',
    headingColor: 'text-verified',
    phase: 'PHASE 1',
    description: 'One document type, one department — this demo.',
    callout: 'LIVE',
    button: { label: 'TRY IT NOW →', to: '/demo', variant: 'bg-verified text-white' },
  },
  {
    tag: '02',
    tagLabel: 'NEXT',
    headingColor: 'text-magenta',
    phase: 'PHASE 2',
    description: 'Expand across departments; add OCR ingestion so old paper archives join the same searchable system.',
    callout: 'COMING',
    button: {
      label: 'REQUEST A PILOT →',
      href: 'mailto:papertrail.skh020@gmail.com?subject=PaperTrail%20Pilot%20Request',
      variant: 'bg-magenta text-white',
    },
  },
  {
    tag: '03',
    tagLabel: 'LATER',
    headingColor: 'text-indigo',
    phase: 'PHASE 3',
    description: 'Full rollout, with a manual photo-and-timestamp fallback wherever digitization is low.',
    callout: 'PLANNED',
    button: { label: 'READ THE ROADMAP', to: '/how-it-works', variant: 'bg-cream text-ink border-ink!' },
  },
];

export default function RoadmapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-ink/50 uppercase block mb-4">
          ▼ 05 · THE ROADMAP
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-ink mb-10">
          THREE PHASES.
        </h2>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {PHASES.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="brutal-card-static bg-white p-6 flex flex-col"
            >
              {/* Tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-ink text-white font-mono text-[10px] font-bold px-2 py-1">
                  {phase.tag}
                </span>
                <span className={`font-display text-xs ${phase.headingColor}`}>
                  {phase.tagLabel}
                </span>
              </div>

              {/* Phase title */}
              <h3 className={`font-display text-lg ${phase.headingColor} mb-2`}>
                {phase.phase}
              </h3>

              {/* Description */}
              <p className="text-sm text-ink/60 leading-relaxed mb-4 flex-1">
                {phase.description}
              </p>

              {/* Big callout */}
              <div className="font-display text-4xl md:text-5xl text-ink/10 mb-4">
                {phase.callout}
              </div>

              {/* CTA Button */}
              {phase.button.to ? (
                <Link
                  to={phase.button.to}
                  className={`brutal-btn ${phase.button.variant} px-4 py-3 text-xs font-bold uppercase text-center rounded-lg focus-brutal block`}
                >
                  {phase.button.label}
                </Link>
              ) : (
                <a
                  href={phase.button.href}
                  className={`brutal-btn ${phase.button.variant} px-4 py-3 text-xs font-bold uppercase text-center rounded-lg focus-brutal block`}
                >
                  {phase.button.label}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-ink/40 italic">
          Every checkpoint is mandatory and RTI-visible by design — there's no insider bypass built in.
        </p>
      </div>
    </section>
  );
}
