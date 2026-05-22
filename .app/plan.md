# Premium Polish Pass — Nova Astrology

Goal: elevate the existing app from "great prototype" to App Store-quality without touching architecture, routes, or backend logic. Pure presentation, motion, and atmosphere.

## 1. Motion + Atmosphere foundation

- Add `framer-motion` for orchestrated page/element transitions.
- Extend `src/styles.css` with new tokens & keyframes:
  - aurora drift, particle float, orbital rotate (multi-speed), glow pulse variants, shimmer-loading, sheen sweep, soft-press tap.
  - new utilities: `.glow-soft`, `.glow-aurora`, `.sheen`, `.press`, `.divider-aurora`, `.text-glow`.
- Upgrade `CosmicBackground`:
  - 3 parallax star layers (different sizes / opacity / drift speeds).
  - SVG floating particles (12–18 sparkles) with randomized delay.
  - Animated aurora blobs (slow blur drift, mix-blend-screen).
  - Subtle vignette for screenshot depth.
- Add `PageTransition` wrapper in `_app.tsx` keyed by route — fade + 8px rise, 350ms ease-out.

## 2. Premium mobile design system

- Tighten spacing scale: standardize section padding (px-5, py-6), card radius (rounded-3xl), 16px gutters.
- Typography pass:
  - Display: Cormorant Garamond italic for hero numerals + sign names.
  - Add weight contrast: 300 body, 500 labels, 600 metrics, italic display.
  - Letter-spacing: tracking-[0.2em] uppercase eyebrow labels in gold.
- Layered glassmorphism: two-tier — `.glass` (cards) and `.glass-strong` (hero panels) with inner highlight border (`inset 0 1px 0 rgba(255,255,255,0.08)`).
- Refined shadows: replace flat shadows with colored glows tied to primary/accent.
- New reusable components:
  - `<EyebrowLabel>` — uppercase gold tracking label.
  - `<StatPill>` — glass pill with icon + animated count-up.
  - `<SectionDivider>` — thin aurora gradient hairline w/ center star.
  - `<ShimmerBlock>` — loading skeleton.

## 3. Birth Chart hero rebuild (visual only)

Transform `_app.chart.tsx` + `ZodiacWheel` into the showcase screen:

- Multi-ring SVG:
  - Outer ring: 12 zodiac glyphs, rotating very slowly (120s).
  - Middle ring: house numbers, counter-rotating (180s).
  - Inner ring: planetary markers with glowing dots + orbit trails.
  - Center: pulsing core with user's sun sign glyph + soft radial glow.
- Each planet marker: small glow disc, hover/tap scales 1.15, opens a glass detail card below the wheel with smooth height transition.
- Orbital dotted SVG paths with animated dash offset (energy flow).
- Tap on a zodiac segment highlights its house wedge (SVG `<path>` opacity + glow filter).
- Background: extra aurora bloom behind wheel, conic-gradient halo.
- Below wheel: horizontal scroll of planet cards (snap, momentum, glass).

## 4. AI Chat magical upgrade

In `_app.chat.tsx`:

- Empty state: large constellation illustration + animated greeting "The stars are listening…" with typewriter effect; 3 floating suggestion chips with gentle bob animation.
- Message bubbles:
  - User: gradient gold-tinted glass, right aligned, soft drop shadow.
  - Nova: aurora-bordered glass with small twinkling star avatar + name.
  - Entrance: scale 0.96 + fade + 6px rise, stagger.
- Typing indicator: 3 glowing dots with orbital pulse.
- Add a subtle aurora ribbon under the header.
- Add ReactMarkdown rendering for Nova replies (prose styling).
- Persistent context strip at top showing user's sun sign + moon (already in profile store) so replies feel personalized.

## 5. Microinteractions everywhere

- Buttons: add `.press` (scale 0.97 active), hover glow ring, sheen sweep on primary CTA.
- Bottom nav: active tab gets aurora underline that slides via framer-motion layoutId; inactive icons soft-fade; tap = haptic-style scale.
- Cards: on mount, stagger fade-up; on tap, subtle tilt (translateY -2px + glow).
- Loading states: shimmer skeletons replacing spinners on home + compatibility.
- Count-up animation for compatibility score and stat pills.
- Smooth route transitions via `AnimatePresence mode="wait"` in `_app`.

## 6. Screenshot optimization per screen

- Home: add hero "Today's Sky" panel with date, moon phase icon, animated aurora; reorder so visually dense card sits top.
- Compatibility: bigger animated score ring (SVG stroke-dasharray sweep) with gradient stroke + glow.
- Profile: cosmic ID card style with user's sign, birth date, element badge, glowing avatar ring.
- Onboarding: each step gets unique aurora hue + floating glyph for personality.
- Chart: as above — designed as the marquee screenshot.

## 7. Performance guardrails

- All animations transform/opacity only; no layout thrash.
- `will-change` only on actively animating wheel rings.
- Reduce particle count on `prefers-reduced-motion`; respect via media query disabling infinite animations.
- Use CSS animations for ambient loops; framer-motion only for orchestration & transitions.

## Files to touch (all presentation only)

- `src/styles.css` — tokens, keyframes, utilities.
- `src/components/cosmic-bg.tsx` — parallax + particles + aurora.
- `src/components/zodiac-wheel.tsx` — multi-ring, glow, interactivity.
- `src/components/bottom-nav.tsx` — aurora indicator, press feedback.
- New: `src/components/page-transition.tsx`, `eyebrow-label.tsx`, `stat-pill.tsx`, `section-divider.tsx`, `shimmer.tsx`, `count-up.tsx`, `particles.tsx`.
- `src/routes/_app.tsx` — wrap Outlet with PageTransition.
- `src/routes/_app.home.tsx`, `_app.chart.tsx`, `_app.chat.tsx`, `_app.compatibility.tsx`, `_app.profile.tsx`, `onboarding.tsx` — visual polish using new primitives.

## Out of scope

- No backend, schema, auth, or routing changes.
- No new features or data sources.
- No simplification of existing UI — only additive polish.

## Technical notes

- Add dependency: `framer-motion`, `react-markdown` (chat already references markdown best practice).
- All colors via existing semantic tokens; new tokens added to `:root`.
- Mobile-first; verify at 390×844 viewport after each screen.
