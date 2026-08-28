import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Gavel, Scale, GraduationCap } from 'lucide-react';

const USE_CASES = [
  {
    icon: MapPin,
    title: 'Land Mutation',
    description: 'Talathi 7/12 record mutation tracking, catching quiet boundary or beneficiary changes.',
    isLive: true,
    rotation: '-rotate-[2deg]',
    bg: 'bg-verified/10',
    borderColor: 'border-verified',
  },
  {
    icon: Gavel,
    title: 'Public Tenders',
    description: 'Anti-tamper bid tracking before opening deadlines.',
    isLive: true,
    rotation: 'rotate-[1.5deg]',
    bg: 'bg-amber/10',
    borderColor: 'border-amber',
  },
  {
    icon: Scale,
    title: 'Court Evidence',
    description: 'Chain-of-custody for physical police exhibits.',
    isLive: false,
    rotation: '-rotate-[1deg]',
    bg: 'bg-indigo/10',
    borderColor: 'border-indigo',
  },
  {
    icon: GraduationCap,
    title: 'University Marksheets',
    description: 'Instant verification with no centralized server to go down.',
    isLive: false,
    rotation: 'rotate-[2deg]',
    bg: 'bg-magenta/10',
    borderColor: 'border-magenta',
  },
];

export default function UseCasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="use-cases" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-ink/50 uppercase block mb-4">
          ▼ 04 · WHERE ELSE IT FITS
        </span>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {USE_CASES.map((useCase, i) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`
                  ${useCase.rotation} rounded-2xl p-5 
                  border-[3px] ${useCase.borderColor}! ${useCase.bg}
                  shadow-[4px_4px_0px_#000]
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {useCase.isLive ? (
                    <Link
                      to="/demo"
                      className="pill-badge bg-verified text-white text-[9px] hover:bg-verified/90 transition-colors focus-brutal"
                    >
                      → Try it
                    </Link>
                  ) : (
                    <span className="pill-badge bg-ink/10 text-ink/50 text-[9px]">
                      Coming in Phase 2
                    </span>
                  )}
                </div>
                <h3 className="font-display text-sm text-ink mb-1">
                  {useCase.title}
                </h3>
                <p className="text-xs text-ink/60 leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="text-center brutal-card-static bg-highlighter p-8 md:p-10">
          <h3 className="font-display text-2xl md:text-3xl text-ink mb-4">
            COME BREAK IT YOURSELF →
          </h3>
          <Link
            to="/demo"
            className="brutal-btn bg-ink text-white px-8 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
          >
            LAUNCH DEMO
          </Link>
        </div>
      </div>
    </section>
  );
}
