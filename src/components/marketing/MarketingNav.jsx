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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-cream border-b-[3px] border-black'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Mark */}
            <Link to="/" className="flex items-center gap-3 focus-brutal" onClick={() => window.scrollTo(0, 0)}>
              <div className="tilted-badge bg-highlighter px-3 py-1.5 md:px-4 md:py-2">
                <div className="flex items-center gap-2">
                  <img src="/LOGO.png" alt="PaperTrail" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
                  <div>
                    <div className="text-sm md:text-base font-black tracking-tight text-ink leading-none">
                      PaperTrail
                    </div>
                    <div className="text-[7px] md:text-[8px] font-mono font-bold tracking-[0.1em] text-ink/60 uppercase">
                      Chain-of-Custody Audit Protocol
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    focus-brutal px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all
                    ${isActive(link.href)
                      ? 'text-ink border-b-[3px] border-highlighter'
                      : 'text-ink/60 hover:text-ink hover:bg-highlighter/30'
                    }
                  `}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA + Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                to="/demo"
                className="hidden md:inline-flex brutal-btn bg-magenta text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg focus-brutal"
              >
                TRY IT YOURSELF →
              </Link>
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden brutal-btn bg-white p-2 focus-brutal"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-cream border-l-[3px] border-black flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-[3px] border-black">
              <span className="font-display text-sm tracking-tight">MENU</span>
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
