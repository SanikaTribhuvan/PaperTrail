import { useRef, useEffect, useState } from 'react';

const HERO_VIDEOS = [
  '/hero-videos/hero-1.mp4',
  '/hero-videos/hero-2.mp4',
];

export default function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  // Auto-play and handle transition when a video ends
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex]);

  return (
    <section className="relative w-full overflow-hidden mb-0">
      {/* Full-Bleed Edge-to-Edge Video Container */}
      <div className="relative w-full h-[65vh] md:h-[80vh] border-b-[4px] border-black bg-black overflow-hidden shadow-[0_8px_0px_#000]">
        <video
          ref={videoRef}
          key={HERO_VIDEOS[currentVideoIndex]}
          muted
          playsInline
          autoPlay
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        >
          <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
        </video>

        {/* Video Slideshow Indicator Dots — Top Right */}
        <div className="absolute top-5 right-6 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-white/30 shadow-[2px_2px_0px_#000]">
          <span className="font-mono text-[10px] text-white/70 font-bold uppercase mr-1">
            CLIP {currentVideoIndex + 1}/2
          </span>
          {HERO_VIDEOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentVideoIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentVideoIndex === idx
                  ? 'w-6 h-2.5 bg-highlighter border border-ink'
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white border border-black/50'
              }`}
              aria-label={`Switch to video ${idx + 1}`}
            />
          ))}
        </div>

        {/* Floating Headline Card — Bottom Right & 20% Smaller */}
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 max-w-sm sm:max-w-md md:max-w-lg z-20">
          <div
            className="tilted-badge bg-highlighter p-4 sm:p-5 md:p-6 rounded-xl border-[3px] border-ink shadow-[6px_6px_0px_#000]"
            style={{ transform: 'rotate(1deg)' }}
          >
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.95] text-ink mb-1.5">
              NO TRAIL. NO PROOF.
              <br />
              NO ACCOUNTABILITY.
            </h1>
            <p className="font-display text-base sm:text-lg md:text-2xl italic text-ink/85 mb-2.5">
              UNTIL NOW.
            </p>
            <p className="text-xs sm:text-sm text-ink/75 leading-snug font-medium">
              Every handoff, cryptographically sealed. A digital fingerprint that proves if a document
              was touched — when, and by whom.
            </p>
          </div>
        </div>

        {/* Rotating badge — Bottom Left */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 hidden sm:block z-20">
          <div className="spin-slow w-13 h-13 md:w-15 md:h-15 rounded-full border-[3px] border-black bg-ink flex items-center justify-center shadow-[4px_4px_0px_#000]">
            <span className="text-highlighter font-mono text-xl md:text-2xl font-black">#</span>
          </div>
        </div>
      </div>
    </section>
  );
}
