import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Globe, Share2, Send } from 'lucide-react';

// Balloon / Coin definitions matching MoMoney inspo colors, currency & protocol glyphs
const COIN_DEFINITIONS = [
  { symbol: '$', bg: '#00E676', border: '#000000', ring: '#000000', color: '#000000', size: 68 },
  { symbol: '£', bg: '#E056FD', border: '#000000', ring: '#000000', color: '#000000', size: 62 },
  { symbol: '₽', bg: '#FF6B00', border: '#000000', ring: '#000000', color: '#000000', size: 65 },
  { symbol: '€', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 60 },
  { symbol: '¥', bg: '#4834D4', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 64 },
  { symbol: '₿', bg: '#EF4444', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 70 },
  { symbol: '₹', bg: '#E9B44C', border: '#000000', ring: '#000000', color: '#000000', size: 66 },
  { symbol: '🔒', bg: '#AB0992', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 58 },
  { symbol: '✓', bg: '#10B981', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 64 },
  { symbol: '⛓', bg: '#FF5722', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 60 },
  { symbol: 'QR', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 58 },
  { symbol: '#', bg: '#00A896', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 65 },
  { symbol: 'DOC', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 56 },
  { symbol: 'SHA', bg: '#0900E8', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 62 },
  { symbol: '$', bg: '#10B981', border: '#000000', ring: '#000000', color: '#000000', size: 66 },
  { symbol: '£', bg: '#AB0992', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 64 },
  { symbol: '€', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 60 },
  { symbol: '₹', bg: '#FF6B00', border: '#000000', ring: '#000000', color: '#000000', size: 65 },
];

export default function PhysicsFooter() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Track mouse position over container for balloon repulsion
  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = { x: -1000, y: -1000, active: false };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cleanup = () => {};

    const initPhysics = async () => {
      try {
        const Matter = await import('matter-js');
        const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

        const container = canvasRef.current;
        if (!container) return;

        const width = container.clientWidth || 1200;
        const height = isMobile ? 550 : 620;

        const engine = Engine.create({
          gravity: { x: 0, y: reducedMotion ? 0 : 0.45 },
        });
        engineRef.current = engine;

        const render = Render.create({
          element: container,
          engine: engine,
          options: {
            width,
            height,
            wireframes: false,
            background: 'transparent',
            pixelRatio: Math.min(window.devicePixelRatio, 2),
          },
        });
        renderRef.current = render;

        // Boundaries / Walls
        const wallThickness = 80;
        const walls = [
          // Bottom floor
          Bodies.rectangle(width / 2, height + wallThickness / 2 - 10, width + 400, wallThickness, {
            isStatic: true,
            render: { visible: false },
          }),
          // Left wall
          Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
            isStatic: true,
            render: { visible: false },
          }),
          // Right wall
          Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
            isStatic: true,
            render: { visible: false },
          }),
        ];

        // Balloon / Coin bodies
        const count = isMobile ? 10 : COIN_DEFINITIONS.length;
        const coins = COIN_DEFINITIONS.slice(0, count);
        const scaleFactor = isMobile ? 0.72 : 1;

        const coinBodies = coins.map((coin, i) => {
          const radius = coin.size * scaleFactor;
          const x = (width / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 60;
          // Spawn above screen so they fall down like balloons
          const y = reducedMotion
            ? height - radius - 80 - Math.random() * 120
            : -100 - i * 45 - Math.random() * 150;

          return Bodies.circle(x, y, radius, {
            restitution: 0.75, // Bouncy like real helium balloons
            friction: 0.1,
            frictionAir: 0.018, // Float gently through air
            density: 0.001,
            render: {
              fillStyle: coin.bg,
              strokeStyle: coin.border,
              lineWidth: 3.5,
            },
          });
        });

        Composite.add(engine.world, [...walls, ...coinBodies]);

        // Mouse drag and throw constraint
        if (!reducedMotion) {
          const mouse = Mouse.create(render.canvas);
          const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.2,
              render: { visible: false },
            },
          });
          Composite.add(engine.world, mouseConstraint);
          render.mouse = mouse;

          // Prevent mouse scroll hijacking
          mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
          mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        }

        // Mouse hover repulsion ("move away as if theyre real balloons")
        Events.on(engine, 'beforeUpdate', () => {
          if (reducedMotion) return;
          const { x: mx, y: my, active } = mousePosRef.current;
          if (!active || mx < 0 || my < 0) return;

          const repulsionRadius = isMobile ? 120 : 180;
          const maxForce = isMobile ? 0.05 : 0.09;

          coinBodies.forEach((body) => {
            const dx = body.position.x - mx;
            const dy = body.position.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < repulsionRadius && dist > 0) {
              const force = ((repulsionRadius - dist) / repulsionRadius) * maxForce;
              Body.applyForce(body, body.position, {
                x: (dx / dist) * force,
                y: (dy / dist) * force,
              });
            }
          });
        });

        // Custom High-Res Double-Rimmed Coin / Balloon Rendering
        Events.on(render, 'afterRender', () => {
          const ctx = render.context;
          coinBodies.forEach((body, i) => {
            const coin = coins[i];
            const radius = coin.size * scaleFactor;

            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);

            // Outer drop shadow on balloon coin
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 4;

            // Outer Circle
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = coin.bg;
            ctx.fill();

            // Outer thick stroke
            ctx.shadowColor = 'transparent';
            ctx.lineWidth = 4;
            ctx.strokeStyle = coin.border;
            ctx.stroke();

            // Inner concentric rim circle
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = coin.ring;
            ctx.stroke();

            // Highlight shine reflection arc on top edge
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.72, -Math.PI * 0.75, -Math.PI * 0.25);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.stroke();

            // Center Symbol (Currency / Protocol Glyph)
            ctx.fillStyle = coin.color;
            ctx.font = `900 ${isMobile ? 22 : 30}px "Anton", "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(coin.symbol, 0, 1);

            ctx.restore();
          });
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        cleanup = () => {
          Render.stop(render);
          Runner.stop(runner);
          Engine.clear(engine);
          if (render.canvas) {
            render.canvas.remove();
          }
        };
      } catch (err) {
        console.error('Physics footer init error:', err);
      }
    };

    initPhysics();
    return () => cleanup();
  }, [isMobile, reducedMotion]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    window.location.href = `mailto:papertrail.skh020@gmail.com?subject=PaperTrail%20Protocol%20Updates&body=Please%20subscribe%20${encodeURIComponent(emailInput)}%20to%20PaperTrail%20updates.`;
    setEmailSubmitted(true);
  };

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="bg-[#0B0B0B] text-white relative overflow-hidden pt-12 md:pt-16 pb-8 border-t-[4px] border-black select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Main Navigation & Contact Grid matching MoMoney UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-8 md:mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Giant Condensed Typography Menu */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <nav className="flex flex-col gap-1 sm:gap-2">
              {[
                { label: 'EXHIBITS', to: '/#checkpoints' },
                { label: 'CONTACT', to: '/#contact' },
                { label: 'PROTOCOL', to: '/how-it-works' },
                { label: 'DEMO', to: '/demo' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="group flex items-center font-impact text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none hover:text-highlighter transition-colors duration-150"
                >
                  <span className="opacity-0 -ml-8 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-highlighter mr-2 font-mono text-3xl sm:text-4xl md:text-5xl">
                    ►
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-4 border-t border-white/15">
              <span className="font-mono text-xs font-bold text-white/50 tracking-widest uppercase block">
                SITE BY TEAM PAPERTRAIL · SKH020 · SANJIVANI UNIVERSITY
              </span>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-2.5 pt-2 sm:pt-4">
            <span className="font-mono text-[11px] font-black text-highlighter uppercase tracking-[0.2em] mb-2 block">
              DIRECTORY
            </span>
            {[
              { label: 'Genesis Vault', href: '/demo' },
              { label: 'Handoff Scanner', href: '/demo' },
              { label: 'Audit Ledger', href: '/demo' },
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Crisis Incidents', href: '/#crisis' },
              { label: 'FAQ & Security', href: '/#faq' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm md:text-base font-semibold text-white/70 hover:text-white hover:translate-x-1 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Column: Newsletter & Social Badges */}
          <div className="lg:col-span-4 flex flex-col justify-between pt-2 sm:pt-4">
            <div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                Get the inside scoop on new verification protocols, special releases, and tamper-evident audit updates, delivered right to your inbox.
              </p>

              {/* Input + Subscribe Button */}
              <form onSubmit={handleSubscribe} className="mb-5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="flex-1 bg-[#1A1A1A] border-2 border-white/30 text-white placeholder-white/40 px-3.5 py-2.5 text-xs sm:text-sm font-mono outline-none focus:border-highlighter transition-colors rounded-none"
                  />
                  <button
                    type="submit"
                    className="brutal-btn bg-white hover:bg-highlighter text-ink font-impact px-5 py-2.5 text-sm sm:text-base tracking-wider rounded-none uppercase transition-colors"
                  >
                    SUBSCRIBE
                  </button>
                </div>
                {emailSubmitted && (
                  <p className="font-mono text-[11px] text-highlighter mt-2">
                    Opening your mail client to confirm subscription...
                  </p>
                )}
              </form>
            </div>

            {/* Social Icons */}
            <div>
              <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] block mb-2">
                FOLLOW US:
              </span>
              <div className="flex items-center gap-3">
                {[
                  {
                    icon: () => (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                    href: 'https://github.com',
                    label: 'GitHub',
                  },
                  {
                    icon: () => (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                    href: 'https://x.com',
                    label: 'X (Twitter)',
                  },
                  {
                    icon: () => (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                    href: 'https://linkedin.com',
                    label: 'LinkedIn',
                  },
                  {
                    icon: () => <Mail className="w-4 h-4" />,
                    href: 'mailto:papertrail.skh020@gmail.com',
                    label: 'Email',
                  },
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-highlighter hover:text-ink text-white flex items-center justify-center transition-colors border border-white/20"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Canvas for Bouncing Helium Balloons / Coins */}
      <div className="relative w-full overflow-hidden border-t-2 border-white/15 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
            <span>▼ CRYPTOGRAPHIC BALLOON VAULT · HOVER TO PUSH · DRAG TO THROW</span>
            <span className="hidden sm:inline">NATIVE WEB CRYPTO · ZERO LATENCY</span>
          </div>
        </div>
        <div
          ref={canvasRef}
          className="w-full relative cursor-grab active:cursor-grabbing"
          style={{ height: isMobile ? '380px' : '440px' }}
        />
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/40">
        <span>PaperTrail · Chain-of-Custody Audit Protocol · SKH020</span>
        <span>SHA-256 NATIVE CLIENT ENGINE · ALL RIGHTS RESERVED</span>
      </div>
    </footer>
  );
}
