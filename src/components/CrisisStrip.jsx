import { AlertTriangle, Newspaper } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

const NEWS_ITEMS = [
  {
    source: 'Municipal Audit Report 2025',
    headline: 'Flood funds diverted without record: Critical embankment repairs delayed while low-priority road works received emergency funding.',
    tag: 'FUNDS DIVERTED',
  },
  {
    source: 'Local Citizen Observatory',
    headline: 'Ward 4 sanitation delayed by tampered priority queue. Health hazard escalates as records show altered impact metrics.',
    tag: 'TAMPERED METRICS',
  },
  {
    source: 'State Anti-Corruption Bureau',
    headline: 'Civic tender allocation discrepancies: Investigation ordered after contractor selection failed to align with original risk assessment.',
    tag: 'TENDER MISMATCH',
  },
  {
    source: 'Kopargaon Civic Forum',
    headline: 'Over ₹4.5 Cr in municipal budget misallocated due to subjective and untraceable project prioritization decisions.',
    tag: 'RESOURCE WASTE',
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
