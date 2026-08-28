import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { QrCode, Fingerprint, FileText, Gavel, ShieldCheck, ArrowLeft, ArrowRight, Lock, MapPin, Scale } from 'lucide-react';

const SLIDES = [
  {
    id: 'exam',
    number: '01',
    tag: 'ORIGIN SCENARIO · EXAM INTEGRITY',
    title: 'THE QUESTION PAPER VAULT',
    description:
      'PaperTrail was born out of one exam leak. State TET & NEET-UG breached through unrecorded trunk handoffs and compromised press floors. PaperTrail seals the question paper with SHA-256 the microsecond it leaves the Chief Superintendent\'s vault — generating an instant, unforgeable QR chain.',
    badge: 'MPSC / NEET PROTOTYPE',
    badgeColor: 'bg-highlighter text-ink',
    cards: [
      {
        icon: Fingerprint,
        bg: 'bg-highlighter',
        border: 'border-ink',
        textColor: 'text-ink',
        title: 'SHA-256 VAULT',
        subtitle: 'Genesis Seed Hash',
        stamp: '#01 GENESIS',
        stampBg: 'bg-ink text-white',
        rotate: '-rotate-6',
      },
      {
        icon: QrCode,
        bg: 'bg-magenta',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'LEVEL-H QR',
        subtitle: '30% Damage Tolerance',
        stamp: 'IMMUTABLE',
        stampBg: 'bg-highlighter text-ink',
        rotate: 'rotate-3',
      },
      {
        icon: Lock,
        bg: 'bg-indigo',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'PRESS FLOOR',
        subtitle: 'Zero Blind Handoffs',
        stamp: 'VERIFIED',
        stampBg: 'bg-verified text-white',
        rotate: '-rotate-2',
      },
      {
        icon: ShieldCheck,
        bg: 'bg-verified',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'DISTRIBUTION',
        subtitle: 'Center Custody Lock',
        stamp: 'SEALED',
        stampBg: 'bg-cream text-ink',
        rotate: 'rotate-6',
      },
    ],
  },
  {
    id: 'land',
    number: '02',
    tag: 'EXTENDED DOMAIN · REVENUE RECORDS',
    title: 'TALATHI 7/12 LAND MUTATIONS',
    description:
      'Revenue land records and 7/12 extract mutations contested across district civil courts due to quiet boundary alterations. PaperTrail locks every mutation order into an unbroken cryptographic parent hash — pinpointing any unauthorized change instantly.',
    badge: 'REVENUE & LAND RECORDS',
    badgeColor: 'bg-amber text-ink',
    cards: [
      {
        icon: MapPin,
        bg: 'bg-amber',
        border: 'border-ink',
        textColor: 'text-ink',
        title: '7/12 EXTRACT',
        subtitle: 'District Revenue Order',
        stamp: '#MUTATION',
        stampBg: 'bg-ink text-white',
        rotate: '-rotate-4',
      },
      {
        icon: FileText,
        bg: 'bg-verified',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'PARCEL FINGERPRINT',
        subtitle: 'Survey Boundary Lock',
        stamp: 'PARCEL-MH',
        stampBg: 'bg-cream text-ink',
        rotate: 'rotate-4',
      },
      {
        icon: Fingerprint,
        bg: 'bg-magenta',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'TALATHI SIGN',
        subtitle: 'Custody Handshake',
        stamp: 'RECORDED',
        stampBg: 'bg-highlighter text-ink',
        rotate: '-rotate-3',
      },
      {
        icon: Scale,
        bg: 'bg-indigo',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'RTI PROOF',
        subtitle: 'Civil Court Evidentiary',
        stamp: 'EVIDENCE',
        stampBg: 'bg-amber text-ink',
        rotate: 'rotate-5',
      },
    ],
  },
  {
    id: 'tender',
    number: '03',
    tag: 'EXTENDED DOMAIN · PROCUREMENT INTEGRITY',
    title: 'PUBLIC TENDER BID SEALS',
    description:
      'Government infrastructure tenders and procurement bids exposed to pre-opening inspection or post-deadline price modifications. PaperTrail cryptographically seals every bid submission envelope — verifiable by all bidders at public opening.',
    badge: 'PUBLIC PROCUREMENT',
    badgeColor: 'bg-teal text-white',
    cards: [
      {
        icon: Gavel,
        bg: 'bg-teal',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'TENDER PROPOSAL',
        subtitle: 'Encrypted Bid Envelope',
        stamp: '#BID-LOCKED',
        stampBg: 'bg-ink text-white',
        rotate: '-rotate-5',
      },
      {
        icon: Lock,
        bg: 'bg-indigo',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'DEADLINE LOCK',
        subtitle: 'Time-locked Hash',
        stamp: 'UNOPENED',
        stampBg: 'bg-highlighter text-ink',
        rotate: 'rotate-2',
      },
      {
        icon: QrCode,
        bg: 'bg-amber',
        border: 'border-ink',
        textColor: 'text-ink',
        title: 'VENDOR PROOF',
        subtitle: 'Public Key QR Verification',
        stamp: 'RECEIPT',
        stampBg: 'bg-cream text-ink',
        rotate: '-rotate-2',
      },
      {
        icon: ShieldCheck,
        bg: 'bg-highlighter',
        border: 'border-ink',
        textColor: 'text-ink',
        title: 'PUBLIC OPENING',
        subtitle: 'Integrity Check Validated',
        stamp: 'OPEN BID',
        stampBg: 'bg-ink text-white',
        rotate: 'rotate-6',
      },
    ],
  },
  {
    id: 'court',
    number: '04',
    tag: 'EXTENDED DOMAIN · FORENSIC CUSTODY',
    title: 'COURT EXHIBITS & SEIZURES',
    description:
      'Chain-of-custody for physical police exhibits, forensic seizure memos, and evidence packages moving from crime scenes to forensic labs and trial benches — leaving no gap for evidence tampering or unaccounted transit delays.',
    badge: 'LEGAL & FORENSICS',
    badgeColor: 'bg-magenta text-white',
    cards: [
      {
        icon: Scale,
        bg: 'bg-magenta',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'SEIZURE MEMO',
        subtitle: 'Police Case Diary Record',
        stamp: '#EXHIBIT-A',
        stampBg: 'bg-highlighter text-ink',
        rotate: '-rotate-6',
      },
      {
        icon: Fingerprint,
        bg: 'bg-verified',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'FORENSIC LAB',
        subtitle: 'Sample Integrity Verified',
        stamp: 'LAB CUSTODY',
        stampBg: 'bg-ink text-white',
        rotate: 'rotate-4',
      },
      {
        icon: FileText,
        bg: 'bg-highlighter',
        border: 'border-ink',
        textColor: 'text-ink',
        title: 'TRIAL BENCH',
        subtitle: 'Admissible Evidence Hash',
        stamp: 'COURT VALID',
        stampBg: 'bg-ink text-white',
        rotate: '-rotate-3',
      },
      {
        icon: Lock,
        bg: 'bg-indigo',
        border: 'border-ink',
        textColor: 'text-white',
        title: 'CHAIN ARCHIVE',
        subtitle: 'Immutable History Record',
        stamp: 'LOCKED',
        stampBg: 'bg-amber text-ink',
        rotate: 'rotate-5',
      },
    ],
  },
];

export default function OriginSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [pathD, setPathD] = useState('');
  const svgRef = useRef(null);

  // Curved text path
  useEffect(() => {
    const updatePath = () => {
      const w = svgRef.current?.parentElement?.clientWidth || 900;
      const h = 120;
      setPathD(`M 0 ${h * 0.8} Q ${w * 0.25} ${h * 0.1} ${w * 0.5} ${h * 0.4} Q ${w * 0.75} ${h * 0.7} ${w} ${h * 0.2}`);
    };
    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, []);

  // Auto-play slideshow every 4.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      id="about"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #DE69C3 0%, #BC7FB2 50%, #DE69C3 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Intro subtitle */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs md:text-sm font-bold text-ink/70 uppercase tracking-widest"
          >
            PaperTrail was born out of one exam leak...
          </motion.p>
          <span className="pill-badge bg-ink text-highlighter text-[10px]">
            SLIDE {currentSlide + 1} / {SLIDES.length}
          </span>
        </div>

        {/* Pop-art cards showcase & interactive slideshow */}
        <div className="relative mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="brutal-card-static bg-cream/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border-[3px] border-ink shadow-[8px_8px_0px_#000]"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Left: 4 Pop-Art Cards Fanning Out */}
                <div className="lg:col-span-6 flex justify-center items-center py-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-sm w-full">
                    {slide.cards.map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.06, rotate: 0 }}
                          className={`
                            ${card.bg} ${card.rotate}
                            p-4 sm:p-5 rounded-2xl
                            border-[3px] border-ink shadow-[4px_4px_0px_#000]
                            flex flex-col justify-between h-36 sm:h-40
                            relative transition-transform cursor-pointer
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${card.textColor}`} />
                            <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-ink ${card.stampBg}`}>
                              {card.stamp}
                            </span>
                          </div>
                          <div>
                            <div className={`font-display text-xs sm:text-sm font-bold ${card.textColor} leading-tight`}>
                              {card.title}
                            </div>
                            <div className={`font-mono text-[9px] sm:text-[10px] ${card.textColor} opacity-70`}>
                              {card.subtitle}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Slide Story & Narrative */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-ink text-white font-mono text-xs font-black px-2.5 py-1 rounded border-[2px] border-ink">
                      #{slide.number}
                    </span>
                    <span className={`pill-badge text-[10px] ${slide.badgeColor}`}>
                      {slide.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink mb-3 leading-tight">
                    {slide.title}
                  </h3>

                  <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-6 font-medium">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink/60 font-bold uppercase tracking-wider">
                      Explore Domains:
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {SLIDES.map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => setCurrentSlide(idx)}
                          className={`
                            px-2.5 py-1 text-[11px] font-bold font-mono brutal-border rounded transition-all
                            ${currentSlide === idx
                              ? 'bg-ink text-highlighter scale-105 shadow-[2px_2px_0px_#000]'
                              : 'bg-white text-ink/70 hover:bg-highlighter/50'
                            }
                          `}
                        >
                          {s.id.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Curved sweeping text banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full h-[110px] md:h-[140px] mb-8 pointer-events-none"
        >
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox={`0 0 ${svgRef.current?.parentElement?.clientWidth || 900} ${svgRef.current?.parentElement?.clientHeight || 120}`}
            preserveAspectRatio="none"
          >
            <defs>
              <path id="curvePath" d={pathD} />
            </defs>
            <text className="fill-ink" style={{ fontFamily: 'var(--font-impact)', fontWeight: 800, fontSize: 'clamp(20px, 4vw, 44px)', letterSpacing: '0.04em' }}>
              <textPath href="#curvePath" startOffset="0%">
                (OR A TENDER... MAYBE EVEN A 7/12 LAND RECORD)
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Interactive Dots Navigation + Arrows */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="brutal-btn bg-white hover:bg-highlighter p-2 rounded-full text-ink focus-brutal shadow-[3px_3px_0px_#000]"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Clickable sliding dots */}
          <div className="flex items-center gap-2 bg-ink/20 backdrop-blur-sm p-2 rounded-full border-[2px] border-ink/40">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`
                  transition-all duration-300 rounded-full focus-brutal
                  ${currentSlide === i
                    ? 'w-8 h-3.5 bg-highlighter border-[2px] border-ink shadow-[2px_2px_0px_#000]'
                    : 'w-3.5 h-3.5 bg-white/70 hover:bg-white border-[2px] border-ink/50'
                  }
                `}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="brutal-btn bg-white hover:bg-highlighter p-2 rounded-full text-ink focus-brutal shadow-[3px_3px_0px_#000]"
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
