import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MarketingNav from './MarketingNav';
import PhysicsFooter from './PhysicsFooter';

export default function MarketingLayout() {
  const location = useLocation();

  // Handle scroll-to from navigation between pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-cream">
      <MarketingNav />
      {/* Spacer for fixed nav */}
      <div className="pt-16 md:pt-20">
        <Outlet />
      </div>
      <PhysicsFooter />
    </div>
  );
}
