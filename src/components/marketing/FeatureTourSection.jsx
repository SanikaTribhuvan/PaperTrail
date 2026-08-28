import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fingerprint, ScanLine, GitCompare, Clock } from 'lucide-react';

const FEATURES = [
  {
    tag: '#01',
    pill: 'TRY',
    pillColor: 'bg-highlighter text-ink',
    title: 'GENESIS SEALING.',
    description: 'Hash it. QR it. Done in under a second.',
    icon: Fingerprint,
    iconBg: 'bg-navy',
  },
  {
    tag: '#02',
    pill: 'TRY',
    pillColor: 'bg-highlighter text-ink',
    title: 'HANDOFF SCANNING.',
    description: 'Camera scan, or type the ID. Either works.',
    icon: ScanLine,
    iconBg: 'bg-teal',
  },
  {
    tag: '#03',
    pill: 'WATCH',
    pillColor: 'bg-magenta text-white',
    title: 'TAMPER DIFF VIEWER.',
    description: "Two hashes, side by side. One of them's lying.",
    icon: GitCompare,
    iconBg: 'bg-tampered',
  },
  {
    tag: '#04',
    pill: 'READ',
    pillColor: 'bg-white text-ink',
    title: 'AUDIT TIMELINE.',
    description: 'Every checkpoint, timestamped, exportable as JSON.',
    icon: Clock,
    iconBg: 'bg-amber',
  },
];

export default function FeatureTourSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-indigo py-4 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* 4-card grid matching the reference's numbered-tag + action-pill card anatomy */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="brutal-card-static bg-white overflow-hidden group"
              >
                {/* Icon area */}
                <div className={`${feature.iconBg} p-6 flex items-center justify-center relative`}>
                  <Icon className="w-10 h-10 text-white/80" />

                  {/* Number tag — top left */}
                  <span className="absolute top-2 left-2 bg-ink text-white font-mono text-[10px] font-bold px-2 py-1 border-[2px] border-ink">
                    {feature.tag}
                  </span>

                  {/* Action pill — top right */}
                  <span className={`absolute top-2 right-2 pill-badge ${feature.pillColor} text-[9px]`}>
                    {feature.pill}
                  </span>
                </div>

                {/* Text block */}
                <div className="p-4">
                  <h3 className="font-display text-sm text-ink mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-ink/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-white/50 text-xs font-mono uppercase tracking-wider">
            All four are real, working features in the existing app today.
          </p>
        </div>
      </div>
    </section>
  );
}
