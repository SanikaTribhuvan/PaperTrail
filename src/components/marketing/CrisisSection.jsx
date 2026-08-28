import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';

const INCIDENTS = [
  {
    borderColor: 'border-magenta',
    rotation: '-rotate-[2deg]',
    tag: 'EXAM INTEGRITY · CBI INVESTIGATION',
    tagBg: 'bg-magenta/10 text-magenta',
    title: 'MAY 2026 · THE NEET-UG LEAK',
    body: 'A pre-circulated guess paper overlapped heavily with the real one, sat by 22 lakh+ candidates nationwide. The exam was scrapped, over a dozen people have been arrested, and the fallout culminated in the Union Education Minister\'s resignation on 25 July 2026.',
  },
  {
    borderColor: 'border-amber',
    rotation: 'rotate-[1.5deg]',
    tag: 'PRINTING & TRANSIT ATTACK',
    tagBg: 'bg-amber/10 text-amber',
    title: 'JUNE 2026 · THE MAHARASHTRA TET LEAK',
    body: 'Papers for an exam sat by 6 lakh+ candidates across 1,028 centres were allegedly walked out of the Agra printing press hidden inside a worker\'s shoe. The press\'s CCTV reportedly wasn\'t recording at the time — there was no way to prove, after the fact, exactly when the papers left the building.',
  },
  {
    borderColor: 'border-indigo',
    rotation: '-rotate-[1deg]',
    tag: 'DIGITAL DISTRIBUTION',
    tagBg: 'bg-indigo/10 text-indigo',
    title: 'JULY 2026 · THE UGC-NET PDF',
    body: 'A 100-page PDF lining up with roughly 90 of the exam\'s real questions was allegedly sold for ₹2.25 lakh across five states before test day. The Education Ministry ordered an investigation — it\'s still open.',
  },
];

export default function CrisisSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="crisis" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <SectionHeader number={1} label="THE REAL-WORLD CRISIS" />

        <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">
          TAMPERING, DECODED.
        </h2>

        <p className="text-base md:text-lg text-ink/70 leading-relaxed max-w-3xl mb-12">
          Government documents in India — exam papers, land-mutation records, tender bids —
          pass through several human hands between creation and use. Right now, nothing about the
          physical document itself can prove it stayed unchanged along the way. Three separate
          breaches in 2026 show exactly how that gap gets exploited.
        </p>

        {/* Three tilted incident cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-4 mb-10">
          {INCIDENTS.map((incident, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`brutal-card-static bg-white p-5 md:p-6 ${incident.rotation} ${incident.borderColor}!`}
              style={{ borderWidth: '3px' }}
            >
              <span className={`pill-badge ${incident.tagBg} text-[10px] mb-4`}>
                {incident.tag}
              </span>
              <h3 className="font-display text-sm md:text-base text-ink mt-3 mb-3">
                {incident.title}
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                {incident.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#checkpoints"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('checkpoints')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="brutal-btn bg-highlighter text-ink px-6 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
          >
            SEE HOW THE CHAIN CATCHES THIS →
          </a>
        </div>
      </div>
    </section>
  );
}
