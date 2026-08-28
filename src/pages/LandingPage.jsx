import HeroSection from '../components/marketing/HeroSection';
import BuiltForStrip from '../components/marketing/BuiltForStrip';
import MarqueeTicker from '../components/marketing/MarqueeTicker';
import CrisisSection from '../components/marketing/CrisisSection';
import ReportedBySection from '../components/marketing/ReportedBySection';
import CheckpointsSection from '../components/marketing/CheckpointsSection';
import FeatureTourSection from '../components/marketing/FeatureTourSection';
import BenchmarksSection from '../components/marketing/BenchmarksSection';
import OriginSection from '../components/marketing/OriginSection';
import UseCasesSection from '../components/marketing/UseCasesSection';
import RoadmapSection from '../components/marketing/RoadmapSection';
import FAQSection from '../components/marketing/FAQSection';

export default function LandingPage() {
  return (
    <>
      {/* §4A — Hero */}
      <HeroSection />

      {/* §4B — Built For strip */}
      <BuiltForStrip />

      {/* §4C — Marquee ticker */}
      <MarqueeTicker />

      {/* §4D — The Crisis */}
      <CrisisSection />

      {/* §4E — Reported By */}
      <ReportedBySection />

      {/* §4F — Five Checkpoints */}
      <CheckpointsSection />

      {/* §4G — Feature Tour */}
      <FeatureTourSection />

      {/* §4H — Benchmarks */}
      <BenchmarksSection />

      {/* §4I — Origin Story */}
      <OriginSection />

      {/* §4J — Use Cases */}
      <UseCasesSection />

      {/* §5 — Roadmap */}
      <RoadmapSection />

      {/* §6 — FAQ */}
      <FAQSection />
    </>
  );
}
