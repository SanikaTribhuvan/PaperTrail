import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const tapeText = '⚠️ 404: CHAIN BROKEN ⚠️ HASH MISMATCH DETECTED ⚠️ TAMPER AT ROUTE ⚠️ ';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-highlighter)' }}
    >
      {/* Diagonal hazard tape — top-left to bottom-right */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          width: '200%',
          height: '60px',
          top: '30%',
          left: '-50%',
          transform: 'rotate(15deg)',
          background: '#000',
          borderTop: '4px solid #EF4444',
          borderBottom: '4px solid #EF4444',
        }}
      >
        <div className="tape-scroll flex w-max items-center h-full">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="whitespace-nowrap font-mono text-sm font-bold text-highlighter px-4">
              {tapeText}
            </span>
          ))}
        </div>
      </div>

      {/* Diagonal hazard tape — bottom-right to top-left */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          width: '200%',
          height: '60px',
          top: '55%',
          left: '-50%',
          transform: 'rotate(-12deg)',
          background: '#000',
          borderTop: '4px solid #EF4444',
          borderBottom: '4px solid #EF4444',
        }}
      >
        <div className="tape-scroll flex w-max items-center h-full" style={{ animationDirection: 'reverse' }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} className="whitespace-nowrap font-mono text-sm font-bold text-highlighter px-4">
              {tapeText}
            </span>
          ))}
        </div>
      </div>

      {/* Center mascot badge */}
      <div className="relative z-10 mb-8">
        <div className="w-20 h-20 rounded-full border-[4px] border-ink bg-white shadow-[6px_6px_0px_#000] flex items-center justify-center">
          <span className="font-mono text-3xl font-bold text-ink">#</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-lg">
        <h1 className="font-display text-3xl md:text-5xl text-ink mb-4">
          THIS PAGE BROKE THE CHAIN.
        </h1>
        <p className="text-sm md:text-base text-ink/60 mb-8 leading-relaxed">
          You followed a link that doesn't lead anywhere sealed.
          Whatever proof this URL pointed to isn't in the chain.
        </p>
        <Link
          to="/"
          className="brutal-btn bg-ink text-white px-6 py-3 text-sm font-bold uppercase rounded-lg inline-flex items-center gap-2 focus-brutal"
        >
          ← RETURN TO GENESIS VAULT
        </Link>
      </div>
    </div>
  );
}
