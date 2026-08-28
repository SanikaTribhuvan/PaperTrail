export default function MarqueeTicker() {
  const text = 'SKH020 · DIGITAL GOVERNANCE · SMART KOPARGAON HACKATHON 2026 · 3 NATIONAL EXAMS HIT BY LEAKS IN 2026 · 6 LAKH+ CANDIDATES AT RISK IN ONE BREACH ALONE · ZERO NEW INFRASTRUCTURE NEEDED · SHA-256 NATIVE BROWSER CRYPTO · SUB-1MS HASH COMPUTE · ';

  return (
    <div className="bg-ink border-y-[3px] border-black overflow-hidden py-3">
      <div className="ticker-scroll flex w-max">
        {[0, 1].map(i => (
          <span key={i} className="flex-shrink-0 whitespace-nowrap">
            {text.split(' · ').map((item, j) => (
              <span key={`${i}-${j}`}>
                <span className={`font-mono text-sm md:text-base font-bold ${j % 2 === 0 ? 'text-highlighter' : 'text-white'}`}>
                  {item}
                </span>
                <span className="text-white/30 mx-3">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
