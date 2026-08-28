import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

// Balloon / Coin definitions matching MoMoney inspo colors, currency & protocol glyphs
const COIN_DEFINITIONS = [
  { symbol: '$', bg: '#00E676', border: '#000000', ring: '#000000', color: '#000000', size: 68 },
  { symbol: '£', bg: '#E056FD', border: '#000000', ring: '#000000', color: '#000000', size: 64 },
  { symbol: '₽', bg: '#FF6B00', border: '#000000', ring: '#000000', color: '#000000', size: 66 },
  { symbol: '€', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 62 },
  { symbol: '¥', bg: '#4834D4', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 66 },
  { symbol: '₿', bg: '#EF4444', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 70 },
  { symbol: '₹', bg: '#E9B44C', border: '#000000', ring: '#000000', color: '#000000', size: 68 },
  { symbol: '🔒', bg: '#AB0992', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 60 },
  { symbol: '✓', bg: '#10B981', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 66 },
  { symbol: '⛓', bg: '#FF5722', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 62 },
  { symbol: 'QR', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 60 },
  { symbol: '#', bg: '#00A896', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 68 },
  { symbol: 'DOC', bg: '#F1FC47', border: '#000000', ring: '#000000', color: '#000000', size: 58 },
  { symbol: 'SHA', bg: '#0900E8', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 64 },
  { symbol: '$', bg: '#10B981', border: '#000000', ring: '#000000', color: '#000000', size: 68 },
  { symbol: '£', bg: '#AB0992', border: '#000000', ring: '#000000', color: '#FFFFFF', size: 66 },
];

export default function PhysicsFooter() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = { x: -1000, y: -1000, active: false };
  }, []);

  // Explicit button click handlers
  const handleNavClick = (target) => {
    if (target === 'exhibits') {
      if (location.pathname === '/') {
        const el = document.getElementById('checkpoints') || document.getElementById('crisis');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/', { state: { scrollTo: 'checkpoints' } });
      }
    } else if (target === 'contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'protocol') {
      navigate('/how-it-works');
      window.scrollTo(0, 0);
    } else if (target === 'demo') {
      navigate('/demo');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let cleanup = () => {};

    const initPhysics = async () => {
      try {
        const Matter = await import('matter-js');
        const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 1200;
        const height = container.clientHeight || 560;

        const engine = Engine.create({
          gravity: { x: 0, y: reducedMotion ? 0 : 0.35 },
        });
        engineRef.current = engine;

        const render = Render.create({
          element: canvasRef.current,
          engine: engine,
          options: {
            width,
            height,
            wireframes: false,
            background: 'transparent',
            pixelRatio: Math.min(window.devicePixelRatio, 2),
          },
        });

        // Walls
        const wallThickness = 80;
        const walls = [
          Bodies.rectangle(width / 2, height + wallThickness / 2 - 10, width + 400, wallThickness, {
            isStatic: true,
            render: { visible: false },
          }),
          Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
            isStatic: true,
            render: { visible: false },
          }),
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
          const y = reducedMotion
            ? height - radius - 50 - Math.random() * 120
            : -100 - i * 40 - Math.random() * 150;

          return Bodies.circle(x, y, radius, {
            restitution: 0.78,
            friction: 0.08,
            frictionAir: 0.015,
            density: 0.001,
            render: {
              fillStyle: coin.bg,
              strokeStyle: coin.border,
              lineWidth: 3.5,
            },
          });
        });

        Composite.add(engine.world, [...walls, ...coinBodies]);

        // Mouse drag constraint
        if (!reducedMotion) {
          const mouse = Mouse.create(render.canvas);
          const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
              stiffness: 0.25,
              render: { visible: false },
            },
          });
          Composite.add(engine.world, mouseConstraint);
          render.mouse = mouse;

          mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
          mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        }

        // Mouse hover repulsion
        Events.on(engine, 'beforeUpdate', () => {
          if (reducedMotion) return;
          const { x: mx, y: my, active } = mousePosRef.current;
          if (!active || mx < 0 || my < 0) return;

          const repulsionRadius = isMobile ? 130 : 180;
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

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.65)';
            ctx.shadowBlur = 10;
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

            // Inner rim circle
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = coin.ring;
            ctx.stroke();

            // Reflection shine
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.72, -Math.PI * 0.75, -Math.PI * 0.25);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.stroke();

            // Symbol
            ctx.fillStyle = coin.color;
            ctx.font = `900 ${isMobile ? 22 : 30}px "Anton", "Space Grotesk", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(coin.symbol, 0, 1);

            ctx.restore();
          });
        });

        Render.run(render);
        const runner = Runner.create({
          isFixed: true,
          delta: 1000 / 60,
        });
        Runner.run(runner, engine);

        cleanup = () => {
          Runner.stop(runner);
          Render.stop(render);
          Events.off(engine);
          Events.off(render);
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
    window.location.href = `mailto:tribhuvansanika@gmail.com?subject=PaperTrail%20Protocol%20Updates&body=Please%20subscribe%20${encodeURIComponent(emailInput)}%20to%20PaperTrail%20updates.`;
    setEmailSubmitted(true);
  };

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="bg-[#0B0B0B] text-white relative overflow-hidden pt-10 md:pt-14 pb-6 border-t-[4px] border-black select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Physics canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Top Main Navigation & Contact Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full mb-6 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Giant Condensed Typography Menu */}
          <div className="lg:col-span-5 flex flex-col justify-between pointer-events-auto">
            <nav className="flex flex-col gap-1 sm:gap-2">
              {[
                { label: 'EXHIBITS', action: () => handleNavClick('exhibits') },
                { label: 'CONTACT', action: () => handleNavClick('contact') },
                { label: 'PROTOCOL', action: () => handleNavClick('protocol') },
                { label: 'DEMO', action: () => handleNavClick('demo') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="group flex items-center text-left font-impact text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none hover:text-highlighter transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0"
                >
                  <span className="opacity-0 -ml-8 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-highlighter mr-2 font-mono text-3xl sm:text-4xl md:text-5xl">
                    ►
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-5 pt-3 border-t border-white/15">
              <span className="font-mono text-xs font-bold text-white/50 tracking-widest uppercase block">
                SITE BY TEAM PAPERTRAIL · SKH020 · SANJIVANI UNIVERSITY
              </span>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-2 pt-2 sm:pt-4 pointer-events-auto">
            <span className="font-mono text-[11px] font-black text-highlighter uppercase tracking-[0.2em] mb-2 block">
              DIRECTORY
            </span>
            {[
              { label: 'Genesis Vault', action: () => handleNavClick('demo') },
              { label: 'Handoff Scanner', action: () => handleNavClick('demo') },
              { label: 'Audit Ledger', action: () => handleNavClick('demo') },
              { label: 'How It Works', action: () => handleNavClick('protocol') },
              { label: 'Crisis Incidents', action: () => handleNavClick('exhibits') },
            ].map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={link.action}
                className="text-left text-sm md:text-base font-semibold text-white/70 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-0 p-0"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Column: Newsletter & Social Badges */}
          <div className="lg:col-span-4 flex flex-col justify-between pt-2 sm:pt-4 pointer-events-auto">
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
                    className="brutal-btn bg-white hover:bg-highlighter text-ink font-impact px-5 py-2.5 text-sm sm:text-base tracking-wider rounded-none uppercase transition-colors cursor-pointer"
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
                CONNECT & VERIFY:
              </span>
              <div className="flex items-center gap-3">
                {[
                  {
                    icon: () => (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                    href: 'https://github.com/SanikaTribhuvan/PaperTrail',
                    label: 'GitHub Repo',
                  },
                  {
                    icon: () => (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                    href: 'https://www.linkedin.com/in/sanika-tribhuvan-b3a392348/',
                    label: 'LinkedIn Profile',
                  },
                  {
                    icon: () => <Mail className="w-4 h-4" />,
                    href: 'mailto:tribhuvansanika@gmail.com',
                    label: 'Email Sanika',
                  },
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-highlighter hover:text-ink text-white flex items-center justify-center transition-all border border-white/20 hover:scale-110 cursor-pointer"
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

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-white/40 relative z-20 w-full pointer-events-none">
        <span className="pointer-events-auto">PaperTrail · Chain-of-Custody Audit Protocol · SKH020</span>
        <span className="pointer-events-auto">tribhuvansanika@gmail.com · Sanika Tribhuvan</span>
      </div>
    </footer>
  );
}
