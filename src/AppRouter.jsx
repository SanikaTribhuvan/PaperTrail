import { Routes, Route } from 'react-router-dom';
import MarketingLayout from './components/marketing/MarketingLayout';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import NotFoundPage from './pages/NotFoundPage';
import App from './App';

export default function AppRouter() {
  return (
    <Routes>
      {/* Marketing pages get the shared nav + footer */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Route>

      {/* Demo renders the existing app completely unmodified */}
      <Route path="/demo" element={<App />} />

      {/* 404 — standalone page, no marketing nav */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
