import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const OUTLETS = ['CNN', 'Al Jazeera', 'NBC News', 'WION', 'Free Press Journal', 'Careers360'];

export default function ReportedBySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-ink py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center" ref={ref}>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-highlighter uppercase block mb-4">
          AS REPORTED BY
        </span>
        <h2 className="font-display text-3xl md:text-5xl text-white mb-10">
          THIS ISN'T A HYPOTHETICAL.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
          {OUTLETS.map((outlet, i) => (
            <motion.div
              key={outlet}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="border-[2.5px] border-white/30 px-4 py-3 md:py-4"
            >
              <span className="font-display text-sm md:text-base text-white/90">
                {outlet}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-white/40 italic max-w-md mx-auto">
          Coverage of the 2026 exam-leak crisis — not of PaperTrail itself.
        </p>
      </div>
    </section>
  );
}
