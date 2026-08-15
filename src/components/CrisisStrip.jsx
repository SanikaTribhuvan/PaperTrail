import { AlertTriangle, Newspaper } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

const NEWS_ITEMS = [
  {
    source: 'Free Press Journal',
    headline: 'State TET Printing-Press Leak: Missing chain-of-custody during transit causes statewide cancellation.',
    tag: 'EXAM INTEGRITY',
  },
  {
    source: 'The Hindu / PTI',
    headline: 'UGC-NET Breach: Ministry orders CBI investigation after unauthorized digital distribution prior to exam shift.',
    tag: 'NATIONAL SECURITY',
  },
  {
    source: 'Maharashtra Revenue Dept',
    headline: 'Talathi 7/12 Record Alteration: Revenue land mutations contested across district civil courts due to missing audit logs.',
    tag: 'LAND RECORDS',
  },
  {
    source: 'All-India Assessment',
    headline: 'Over ₹1,200 Cr in direct re-examination costs and years of litigation attributed to untraceable physical handoffs.',
    tag: 'FINANCIAL IMPACT',
  },
];

export default function CrisisStrip() {
  return (
    <section className="mb-10">
      <SectionHeader number={1} label="THE PROBLEM IN NUMBERS & INK" />

      {/* Scrolling ticker container */}
      <div className="brutal-border-thick bg-navy overflow-hidden">
        {/* Static header strip */}
        <div className="bg-amber px-4 py-2 flex items-center gap-2 border-b-[3px] border-black">
          <AlertTriangle className="w-4 h-4 text-navy" />
          <span className="font-mono text-xs font-black tracking-[0.15em] text-navy uppercase">
            WHY THIS MATTERS — VERIFIED INCIDENTS
          </span>
        </div>

        {/* Scrolling news cards */}
        <div className="overflow-hidden">
          <div className="ticker-scroll flex gap-0 py-4 px-4 w-max">
            {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] mx-2 bg-white brutal-border p-4 hover:bg-cream transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper className="w-3.5 h-3.5 text-navy/50" />
                  <span className="font-mono text-[10px] font-bold text-navy/50 uppercase tracking-wider">
                    {item.source}
                  </span>
                </div>
                <p className="text-sm font-semibold text-navy leading-snug mb-3">
                  {item.headline}
                </p>
                <span className="inline-block bg-amber/20 brutal-border text-[10px] font-mono font-bold text-navy px-2 py-0.5">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
