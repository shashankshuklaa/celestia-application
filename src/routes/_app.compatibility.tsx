import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "@/lib/profile-store";
import { SIGN_MAP, ZODIAC, compatibility, type ZodiacSign } from "@/lib/zodiac";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Eyebrow, SectionDivider } from "@/components/ui-primitives";

export const Route = createFileRoute("/_app/compatibility")({
  component: CompatPage,
});

function CompatPage() {
  const { profile } = useProfile();
  const you = profile?.sign ?? "Pisces";
  const [partner, setPartner] = useState<ZodiacSign>("Scorpio");
  const yInfo = SIGN_MAP[you];
  const pInfo = SIGN_MAP[partner];
  const c = compatibility(you, partner);

  // Animated score
  const [animScore, setAnimScore] = useState(0);
  useEffect(() => {
    setAnimScore(0);
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 900);
      setAnimScore(Math.round(c.score * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [c.score, partner, you]);

  return (
    <div className="space-y-6">
      <header className="text-center">
        <Eyebrow>Synastry</Eyebrow>
        <h1 className="mt-2 text-[32px] font-display leading-tight">Cosmic <em className="not-italic text-gradient-aurora text-glow">chemistry</em></h1>
      </header>

      {/* Orbit visual */}
      <motion.section
        initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
        className="relative grid place-items-center py-8"
      >
        {/* Aurora bloom behind */}
        <div className="absolute h-72 w-72 rounded-full blur-3xl opacity-70 animate-pulse-soft"
          style={{ background: "conic-gradient(from 90deg, oklch(0.72 0.20 305 / 0.55), oklch(0.85 0.16 85 / 0.4), oklch(0.65 0.18 350 / 0.5), oklch(0.72 0.20 305 / 0.55))" }} />
        <div className="absolute h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute h-52 w-52 rounded-full border border-white/15 animate-spin-slow" />
        {/* Orbiting signs */}
        <div className="absolute h-52 w-52 rounded-full" style={{ animation: "spin-slow 16s linear infinite" }}>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 grid h-11 w-11 place-items-center rounded-full text-xl glass-strong glow-aurora"
            style={{ color: yInfo.color, filter: `drop-shadow(0 0 8px ${yInfo.color})` }}>{yInfo.symbol}</span>
        </div>
        <div className="absolute h-52 w-52 rounded-full" style={{ animation: "spin-slow 20s linear infinite reverse" }}>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 grid h-11 w-11 place-items-center rounded-full text-xl glass-strong glow-aurora"
            style={{ color: pInfo.color, filter: `drop-shadow(0 0 8px ${pInfo.color})` }}>{pInfo.symbol}</span>
        </div>
        {/* Score ring SVG */}
        <svg viewBox="0 0 100 100" className="absolute h-56 w-56 -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="2" />
          <motion.circle
            cx="50" cy="50" r="46" fill="none" stroke="url(#harmony)" strokeWidth="3" strokeLinecap="round"
            initial={{ strokeDasharray: "0 290" }}
            animate={{ strokeDasharray: `${(c.score / 100) * 289} 290` }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 10px oklch(0.72 0.20 305 / 0.8))" }}
          />
          <defs>
            <linearGradient id="harmony" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.85 0.16 85)" />
              <stop offset="50%" stopColor="oklch(0.72 0.20 305)" />
              <stop offset="100%" stopColor="oklch(0.65 0.18 350)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="relative grid h-44 w-44 place-items-center rounded-full glass-strong glow-primary">
          <Heart className="absolute h-5 w-5 text-[oklch(0.85_0.16_85)] top-6 animate-pulse-soft" style={{ filter: "drop-shadow(0 0 10px oklch(0.85 0.16 85))" }} />
          <div className="text-center">
            <p className="text-[56px] font-display leading-none text-gradient-aurora text-glow">{animScore}<span className="text-3xl">%</span></p>
            <p className="text-[10px] uppercase tracking-[0.32em] text-foreground/70 mt-2">harmony</p>
          </div>
        </div>
      </motion.section>

      {/* Names */}
      <section className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 text-center press">
          <Eyebrow>You</Eyebrow>
          <p className="mt-1 text-lg font-display" style={{ color: yInfo.color, filter: `drop-shadow(0 0 6px ${yInfo.color}88)` }}>{you}</p>
          <p className="text-xs text-foreground/60">{yInfo.element}</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center press">
          <Eyebrow>Them</Eyebrow>
          <p className="mt-1 text-lg font-display" style={{ color: pInfo.color, filter: `drop-shadow(0 0 6px ${pInfo.color}88)` }}>{partner}</p>
          <p className="text-xs text-foreground/60">{pInfo.element}</p>
        </div>
      </section>

      {/* Pick partner */}
      <section className="glass rounded-3xl p-4">
        <Eyebrow>Choose their sign</Eyebrow>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {ZODIAC.map((z) => (
            <motion.button
              key={z.name}
              onClick={() => setPartner(z.name)}
              whileTap={{ scale: 0.92 }}
              className={`aspect-square rounded-xl text-xl grid place-items-center transition press ${
                partner === z.name
                  ? "bg-gradient-to-br from-[oklch(0.72_0.20_305/0.55)] to-[oklch(0.65_0.20_240/0.45)] ring-1 ring-[oklch(0.85_0.16_85/0.5)] glow-aurora"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              style={{ color: z.color, filter: partner === z.name ? `drop-shadow(0 0 8px ${z.color})` : undefined }}
              aria-label={z.name}
            >
              {z.symbol}
            </motion.button>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Breakdown */}
      <section className="space-y-3">
        <Bar label="Love"       value={c.love}   tone="oklch(0.85 0.16 350)" delay={0.0} />
        <Bar label="Friendship" value={c.friend} tone="oklch(0.85 0.16 85)"  delay={0.1} />
        <Bar label="Career"     value={c.career} tone="oklch(0.78 0.18 220)" delay={0.2} />
      </section>

      <section className="glass-strong rounded-3xl p-5">
        <Eyebrow>Reading</Eyebrow>
        <p className="mt-2 font-display text-lg italic leading-[1.55] text-foreground/95">
          {readingFor(c.score, yInfo.element, pInfo.element, you, partner)}
        </p>
      </section>
    </div>
  );
}

function Bar({ label, value, tone, delay = 0 }: { label: string; value: number; tone: string; delay?: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex justify-between text-sm">
        <span className="text-foreground/70 tracking-wide">{label}</span>
        <span className="font-display text-lg">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${tone}, oklch(0.72 0.20 305))`, boxShadow: `0 0 10px ${tone}` }}
        />
      </div>
    </div>
  );
}

function readingFor(score: number, ea: string, eb: string, a: string, b: string) {
  if (score >= 88)
    return `${a} and ${b} share a rare resonance — ${ea} and ${eb} energies twine like two halves of one constellation. Trust the easy gravity.`;
  if (score >= 75)
    return `A warm, generative pairing. ${ea} meets ${eb} with mutual curiosity; small rituals of attention will keep this orbit luminous.`;
  if (score >= 60)
    return `Honest sparks with friction worth tending. The contrast between ${ea} and ${eb} is the gift — translate, don't tame.`;
  return `Different skies, different weather. ${a} and ${b} can grow through deliberate kindness, but neither should shrink to fit.`;
}