import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'THE CRISIS', href: '/#crisis' },
  { label: 'HOW IT WORKS', href: '/how-it-works' },
  { label: 'USE CASES', href: '/#use-cases' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'CONTACT', href: '/#contact' },
];

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = ['crisis', 'use-cases', 'about', 'contact'];
    const observers = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [location.pathname]);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setDrawerOpen(false);

    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/', { state: { scrollTo: id } });
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigate]);

  const isActive = (href) => {
    if (href === '/how-it-works') return location.pathname === '/how-it-works';
    if (href.startsWith('/#')) return activeSection === href.slice(2);
    return false;
  };

  return (
    <>
      {/* 
        CapCut / Premiere Invert Overlay Header:
        Header sits transparently on top of page content.
        Text and controls use mix-blend-mode: difference with pure white text (#FFFFFF),
        causing every pixel to dynamically invert based on whatever background is underneath:
        White on Black (Hero Video) -> White
        White on White/Cream (Sections) -> Black / Inverted Dark
        White on Yellow/Highlighter -> Inverted Deep Indigo
      */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Mark with Dynamic Difference Invert */}
            <Link
              to="/"
              className="flex items-center gap-3 pointer-events-auto focus-brutal"
              style={{ mixBlendMode: 'difference' }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="border-2 border-white px-3 py-1.5 md:px-4 md:py-2 bg-transparent shadow-[3px_3px_0px_#FFFFFF]">
                <div className="flex items-center gap-2">
                  <img
                    src="/LOGO.png"
                    alt="PaperTrail"
                    className="w-7 h-7 md:w-8 md:h-8 object-contain brightness-200 contrast-200"
                  />
                  <div>
                    <div className="text-sm md:text-base font-black tracking-tight text-white leading-none uppercase">
                      PaperTrail
                    </div>
                    <div className="text-[7px] md:text-[8px] font-mono font-bold tracking-[0.12em] text-white/90 uppercase">
                      Chain-of-Custody Protocol
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links with Dynamic Difference Invert */}
            <div
              className="hidden lg:flex items-center gap-1 pointer-events-auto"
              style={{ mixBlendMode: 'difference' }}
            >
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    px-3 py-2 text-xs font-black uppercase tracking-wider transition-all
                    ${isActive(link.href)
                      ? 'text-white border-b-2 border-white font-extrabold'
                      : 'text-white/80 hover:text-white hover:underline'
                    }
                  `}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA + Mobile Hamburger with Dynamic Difference Invert */}
            <div
              className="flex items-center gap-3 pointer-events-auto"
              style={{ mixBlendMode: 'difference' }}
            >
              <Link
                to="/demo"
                className="hidden md:inline-flex border-2 border-white bg-transparent text-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#FFFFFF] hover:shadow-[1px_1px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                TRY IT YOURSELF →
              </Link>
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden border-2 border-white bg-transparent text-white p-2 shadow-[2px_2px_0px_#FFFFFF]"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-cream border-l-[3px] border-black flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-[3px] border-black">
              <span className="font-display text-sm font-black tracking-tight text-navy">MENU</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="brutal-btn bg-white p-1.5 focus-brutal"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    focus-brutal px-4 py-3 text-sm font-bold uppercase tracking-wider brutal-border transition-all
                    ${isActive(link.href)
                      ? 'bg-highlighter text-ink'
                      : 'bg-white text-ink/70 hover:bg-highlighter/20'
                    }
                  `}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA pinned at bottom */}
            <div className="p-4 border-t-[3px] border-black">
              <Link
                to="/demo"
                onClick={() => setDrawerOpen(false)}
                className="brutal-btn bg-magenta text-white w-full block text-center px-4 py-3 text-sm font-bold uppercase rounded-lg focus-brutal"
              >
                TRY IT YOURSELF →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
