# BUILD NOTES — PaperTrail Marketing Site

## Assumptions & Decisions

### §4K — Pilot Request Form
The spec references §4K twice but never defines its content as a standalone section. I treated "REQUEST A PILOT →" (Phase 2 card in §5) as a `mailto:` link to `papertrail.skh020@gmail.com` and pointed the CONTACT nav link to the footer email section (`/#contact`). No separate pilot-request form section was built.

### Hero Video
Created `public/hero-videos/` directory. The HeroSection component looks for `/hero-videos/hero.mp4`. If no video exists, it falls back to an animated dark gradient with a grid pattern and "SHA-256" watermark. Drop any `.mp4` file as `hero.mp4` in that directory and it'll play automatically.

### Team Email
Used `papertrail.skh020@gmail.com` as the `mailto:` target for the footer contact and pilot-request buttons. This is a placeholder — replace with the real address.

### LOGO.png
Copied to `public/LOGO.png` so it's accessible via `/LOGO.png` in the browser. The original stays in the project root.

### Favicon
Replaced the generic purple placeholder SVG with a PaperTrail-branded fingerprint + chain icon on a highlighter yellow background.

### IEEE/Patent Credential
Not included anywhere in generated copy — not found in `PaperTrail_Documentation.docx`.

### Blockchain/Server Claims
No generated copy implies a blockchain, a server, or a production deployment. Phase 2 and Phase 3 features are clearly labeled as upcoming.

### §12 — Group Capacity Section
Genuinely dropped as specified. No forced replacement section added.

### Inspo Videos
Referenced from `inspo videos/` (with space) as found in the project. These are development references only, not served to the browser.

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` via the CSS media query. The marquee freezes (not slows), scroll reveals are skipped, the physics engine disables gravity and drops tokens into a resting arrangement, and the 404 hazard tapes freeze.

### Router Strategy
Used `BrowserRouter` (HTML5 history mode). The Vite dev server handles this automatically. For production deployment, the hosting provider needs to be configured to serve `index.html` for all routes (standard SPA fallback).

### Framer Motion Usage
Used `useInView` with `{ once: true }` for all scroll-triggered animations — elements animate in once and stay visible. Stagger delays are 60–80ms per element within groups.

### Matter.js Footer
- Desktop: 20 tokens, 400px canvas height
- Mobile (<768px): 12 tokens, 300px canvas height
- Reduced motion: gravity disabled, tokens placed in resting positions
- Mouse drag constraint enabled on desktop
- Token labels drawn via canvas `afterRender` event

### Files NOT Modified (Verified)
- `src/utils/crypto.js` ✓
- `src/utils/storage.js` ✓
- `src/utils/sampleData.js` ✓
- `src/hooks/usePaperTrail.js` ✓
- `src/components/DocumentRegistration.jsx` ✓
- `src/components/CheckpointStation.jsx` ✓
- `src/components/Timeline.jsx` ✓
- `src/components/DocumentLedger.jsx` ✓
- `src/components/DocumentPreview.jsx` ✓
- `src/components/QRScanner.jsx` ✓
- `src/components/CrisisStrip.jsx` ✓
- `src/components/ui/StatusBadge.jsx` ✓
- `src/components/ui/SectionHeader.jsx` ✓

### §4J — Utility Distribution Records (2026-08-29)
Utility distribution records added as a Phase 2 use-case card, intentionally
scoped to log-tampering only, not the full utility-fraud domain, since that's
a physically different problem (sensors/IoT) this hash-chain system doesn't
address.
