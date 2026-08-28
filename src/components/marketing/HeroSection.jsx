import { useRef, useEffect, useState } from 'react';

export default function HeroSection() {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Try to find any video in hero-videos directory
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 mb-0">
      {/* Video Container */}
      <div className="relative max-w-7xl mx-auto rounded-lg overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_#000]">
        {!videoError ? (
          <video
            ref={videoRef}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-[50vh] md:h-[70vh] object-cover"
            onError={() => setVideoError(true)}
          >
            <source src="/hero-videos/hero.mp4" type="video/mp4" />
          </video>
        ) : null}

        {/* Fallback gradient when no video */}
        {videoError && (
          <div className="w-full h-[50vh] md:h-[70vh] bg-gradient-to-br from-ink via-navy to-indigo relative overflow-hidden">
            {/* Animated grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute h-px bg-highlighter/50 w-full" style={{ top: `${i * 5}%` }} />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={`v${i}`} className="absolute w-px bg-highlighter/50 h-full" style={{ left: `${i * 5}%` }} />
              ))}
            </div>
            {/* Floating hash text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="font-mono text-[10vw] font-bold text-highlighter select-none">SHA-256</span>
            </div>
          </div>
        )}

        {/* Floating Headline Card */}
        <div className="absolute bottom-6 left-4 right-4 md:bottom-12 md:left-8 md:right-auto md:max-w-xl">
          <div
            className="tilted-badge bg-highlighter p-6 md:p-10"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl leading-[0.95] text-ink mb-2">
              NO TRAIL. NO PROOF.
              <br />
              NO ACCOUNTABILITY.
            </h1>
            <p className="font-display text-xl sm:text-2xl md:text-4xl italic text-ink/80 mb-4">
              UNTIL NOW.
            </p>
            <p className="text-sm md:text-base text-ink/70 leading-relaxed max-w-md">
              Every handoff, cryptographically sealed. A digital fingerprint that proves if a document
              was touched — when, and by whom.
            </p>
          </div>
        </div>

        {/* Rotating badge — bottom-right */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 hidden md:block">
          <div className="spin-slow w-16 h-16 rounded-full border-[3px] border-black bg-ink flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <span className="text-highlighter font-mono text-2xl font-bold">#</span>
          </div>
        </div>
      </div>
    </section>
  );
}
