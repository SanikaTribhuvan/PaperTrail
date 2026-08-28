import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Does this need an internet connection?',
    a: 'No — hashing, QR generation, and scanning all run locally in the browser.',
  },
  {
    q: 'What if the QR code gets damaged?',
    a: "It's generated at error-correction level H, meaning it still scans correctly with up to 30% of the code obscured or damaged.",
  },
  {
    q: 'Where is the data stored?',
    a: "In the browser's local storage on the device it was entered on — nothing is sent to a server, because there isn't one yet (see the Roadmap, Phase 2).",
  },
  {
    q: "What happens if a hash doesn't match?",
    a: 'The checkpoint is flagged immediately, with the custodian, timestamp, and location on record — no manual investigation needed to find where it broke.',
  },
  {
    q: 'Is this specific to exam papers?',
    a: 'No — exam papers, land records, and tenders all use the same underlying mechanism. See Use Cases above.',
  },
  {
    q: 'Do custodians need a smartphone or an account?',
    a: "No login, ever. Any phone with a camera can scan a QR code, and there's always a manual ID-entry fallback for low-connectivity sites.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-3xl mx-auto">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-ink/50 uppercase block mb-4">
          ▼ 06 · THE COMMON ONES
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">
          QUESTIONS? ANSWERED.
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="brutal-card-static bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus-brutal"
                aria-expanded={openIndex === i}
              >
                <span className="font-bold text-sm text-ink">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-ink/40 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 border-t-2 border-dashed border-ink/10 pt-3">
                  <p className="text-sm text-ink/60 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
