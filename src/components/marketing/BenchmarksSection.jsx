import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const METRICS = [
  { number: '3', label: 'Major national exams breached in 2026' },
  { number: '< 1 ms', label: 'Native browser Web Crypto execution time' },
  { number: '64-char', label: 'Immutable SHA-256 fingerprint length' },
  { number: '6 Lakh+', label: 'Candidates at risk in the TET breach alone' },
  { number: '0', label: 'New servers or hardware needed' },
];

export default function BenchmarksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-ink/50 uppercase block mb-4">
          ▼ 03 · PROTOCOL BENCHMARKS
        </span>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {METRICS.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="brutal-card-static bg-cream p-5 text-center aspect-square flex flex-col items-center justify-center"
            >
              <span className="font-display text-2xl md:text-3xl text-ink mb-2">
                {metric.number}
              </span>
              <span className="text-xs text-ink/50 leading-snug">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mid-page CTA */}
        <div className="text-center brutal-card-static bg-navy p-8 md:p-10">
          <p className="font-display text-xl md:text-2xl text-white mb-4">
            ONE SCAN. NO GUESSWORK. PROMISE.
          </p>
          <Link
            to="/demo"
            className="brutal-btn bg-highlighter text-ink px-6 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
          >
            TRY THE PROTOTYPE →
          </Link>
        </div>
      </div>
    </section>
  );
}
