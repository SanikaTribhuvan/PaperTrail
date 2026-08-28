import { useRef, useEffect, useState } from 'react';

const HERO_VIDEOS = [
  '/hero-videos/hero-1.mp4',
  '/hero-videos/hero-2.mp4',
  '/hero-videos/hero-3.mp4',
  '/hero-videos/hero-4.mp4',
  '/hero-videos/hero.mp4',
];

export default function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [availableVideos, setAvailableVideos] = useState([]);
  const [hasVideo, setHasVideo] = useState(false);
  const videoRef = useRef(null);

  // Check which video files actually exist and are playable
  useEffect(() => {
    let isMounted = true;
    const checkVideos = async () => {
      const valid = [];
      for (const src of HERO_VIDEOS) {
        try {
          const res = await fetch(src, { method: 'HEAD' });
          if (res.ok && res.headers.get('content-type')?.includes('video')) {
            valid.push(src);
          }
        } catch {
          // ignore network errors
        }
      }
      if (isMounted) {
        if (valid.length > 0) {
          setAvailableVideos(valid);
          setHasVideo(true);
        } else {
          setHasVideo(false);
        }
      }
    };
    checkVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // When a video ends, cycle to the next one automatically
  const handleVideoEnded = () => {
    if (availableVideos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % availableVideos.length);
    }
  };

  useEffect(() => {
    if (videoRef.current && availableVideos.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex, availableVideos]);

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 mb-0">
      {/* Video / Graphic Container */}
      <div className="relative max-w-7xl mx-auto rounded-lg overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_#000]">
        {hasVideo && availableVideos.length > 0 ? (
          <div className="relative w-full h-[50vh] md:h-[70vh] bg-black overflow-hidden">
            <video
              ref={videoRef}
              key={availableVideos[currentVideoIndex]}
              muted
              playsInline
              autoPlay
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              onError={() => setHasVideo(false)}
            >
              <source src={availableVideos[currentVideoIndex]} type="video/mp4" />
            </video>

            {/* Video Slideshow Indicator Dots */}
            {availableVideos.length > 1 && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/20">
                {availableVideos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentVideoIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentVideoIndex === idx
                        ? 'w-5 h-2 bg-highlighter'
                        : 'w-2 h-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Switch to video ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Animated Pop-Art Neo-Brutalist Backdrop Fallback */
          <div className="w-full h-[50vh] md:h-[70vh] bg-gradient-to-br from-ink via-navy to-indigo relative overflow-hidden flex items-center justify-center">
            {/* Animated grid lines */}
            <div className="absolute inset-0 opacity-15">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute h-px bg-highlighter/60 w-full" style={{ top: `${i * 5}%` }} />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={`v${i}`} className="absolute w-px bg-highlighter/60 h-full" style={{ left: `${i * 5}%` }} />
              ))}
            </div>

            {/* Background Graphic Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
              <span className="font-display text-[14vw] text-highlighter font-black tracking-tighter">
                PAPERTRAIL
              </span>
            </div>
          </div>
        )}

        {/* Floating Headline Card */}
        <div className="absolute bottom-6 left-4 right-4 md:bottom-12 md:left-8 md:right-auto md:max-w-xl z-20">
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
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 hidden md:block z-20">
          <div className="spin-slow w-16 h-16 rounded-full border-[3px] border-black bg-ink flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <span className="text-highlighter font-mono text-2xl font-bold">#</span>
          </div>
        </div>
      </div>
    </section>
  );
}
