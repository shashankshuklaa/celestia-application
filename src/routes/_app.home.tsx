import { createFileRoute, Link } from "@tanstack/react-router";
import { useProfile } from "@/lib/profile-store";
import { dailyReading, SIGN_MAP } from "@/lib/zodiac";
import { useMemo } from "react";
import { Moon, Sparkles, Heart, Orbit } from "lucide-react";
import { motion } from "framer-motion";
import { Eyebrow, SectionDivider, StatPill, CountUp } from "@/components/ui-primitives";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

function Home() {
  const { profile, ready } = useProfile();
  const sign = profile?.sign ?? "Pisces";
  const info = SIGN_MAP[sign];
  const r = useMemo(() => dailyReading(sign), [sign]);
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  if (!ready) return null;

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.05 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className="space-y-6">
      <motion.header {...stagger(0)} className="flex items-center justify-between">
        <div>
          <Eyebrow>{today}</Eyebrow>
          <h1 className="mt-1.5 text-[32px] font-display leading-[1.05]">
            Hello, <em className="not-italic text-gradient-aurora text-glow">{profile?.name ?? "Seeker"}</em>
          </h1>
        </div>
        <Link to="/profile" className="press relative grid h-14 w-14 place-items-center rounded-full glass-strong text-2xl"
          style={{ color: info.color, boxShadow: `0 0 20px ${info.color}40, inset 0 1px 0 oklch(1 0 0 / 0.1)` }}>
          <span className="absolute inset-0 rounded-full animate-pulse-soft" style={{ boxShadow: `0 0 18px ${info.color}80` }} />
          <span className="relative" style={{ filter: `drop-shadow(0 0 8px ${info.color})` }}>{info.symbol}</span>
        </Link>
      </motion.header>

      {/* Hero daily card */}
      <motion.section {...stagger(1)} className="relative overflow-hidden rounded-3xl glass-strong p-6">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl animate-aurora"
          style={{ background: `radial-gradient(circle, ${info.color}77, transparent 70%)` }} />
        <div className="absolute -left-10 -bottom-12 h-40 w-40 rounded-full blur-3xl animate-aurora"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.20 250 / 0.5), transparent 70%)", animationDelay: "3s" }} />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Today's Horoscope</Eyebrow>
              <p className="mt-1.5 text-xl font-display">{info.name} <span className="text-foreground/40">· {info.element}</span></p>
            </div>
            <span className="rounded-full bg-[oklch(0.85_0.16_85/0.15)] px-3 py-1 text-[11px] tracking-[0.15em] uppercase text-[oklch(0.92_0.14_90)] ring-1 ring-[oklch(0.85_0.16_85/0.3)]">
              {r.mood}
            </span>
          </div>
          <p className="mt-5 text-balance text-[18px] leading-[1.55] text-foreground/95 font-display italic">
            "{r.horoscope}"
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Link to="/chat" className="press sheen glow-aurora inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-[oklch(0.14_0.05_285)]"
              style={{ background: "var(--gradient-aurora)" }}>
              <Sparkles className="h-4 w-4" /> Ask Nova
            </Link>
            <Link to="/chart" className="press inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm glass">
              <Orbit className="h-4 w-4" /> Birth chart
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Quick stats */}
      <motion.section {...stagger(2)} className="grid grid-cols-2 gap-3">
        <StatPill label="Lucky Number" value={<CountUp to={r.luckyNumber} />} accent="oklch(0.85 0.16 85 / 0.6)" />
        <StatPill label="Lucky Color" value={r.luckyColor.name} swatch={r.luckyColor.hex} accent={r.luckyColor.hex} />
        <StatPill label="Moon Phase" value={r.moonPhase} icon={<Moon className="h-3.5 w-3.5" />} accent="oklch(0.78 0.15 220 / 0.5)" />
        <StatPill label="Element" value={info.element} icon={<ElementGlyph e={info.element} />} accent={info.color} />
      </motion.section>

      <SectionDivider />

      {/* Planetary energy */}
      <motion.section {...stagger(3)} className="glass-strong rounded-3xl p-5">
        <Eyebrow>Planetary Energy</Eyebrow>
        <p className="mt-2 text-lg font-display italic text-foreground/95">{r.planetary}</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {["☉","☽","☿","♀","♂"].map((g, i) => (
            <div key={i} className="grid place-items-center rounded-xl glass py-3 text-xl text-[oklch(0.92_0.14_90)] press animate-pulse-soft"
              style={{ animationDelay: `${i * 0.3}s` }}>{g}</div>
          ))}
        </div>
      </motion.section>

      {/* Compatibility teaser */}
      <motion.div {...stagger(4)}>
        <Link to="/compatibility" className="press block glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Compatibility today</Eyebrow>
              <p className="mt-1.5 text-lg font-display">{info.name} × the world</p>
              <p className="text-xs text-foreground/55 mt-1">Tap to match with the cosmos</p>
            </div>
            <div className="relative grid h-20 w-20 place-items-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="oklch(1 0 0 / 0.1)" strokeWidth="2" />
                <motion.circle cx="18" cy="18" r="16" fill="none" stroke="url(#cg)" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${r.compatibility} 100` }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                  style={{ filter: "drop-shadow(0 0 8px oklch(0.72 0.20 305 / 0.6))" }}
                />
                <defs>
                  <linearGradient id="cg" x1="0" x2="1"><stop offset="0%" stopColor="oklch(0.85 0.16 85)" /><stop offset="100%" stopColor="oklch(0.72 0.20 305)" /></linearGradient>
                </defs>
              </svg>
              <span className="text-base font-display"><CountUp to={r.compatibility} format={(n) => `${n}%`} /></span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Cosmic quote */}
      <motion.section {...stagger(5)} className="relative overflow-hidden rounded-3xl p-7 text-center glass-strong">
        <div className="absolute inset-0 opacity-50"
          style={{ background: "linear-gradient(135deg, oklch(0.30 0.12 305 / 0.4), oklch(0.30 0.12 240 / 0.3))" }} />
        <div className="relative">
          <Heart className="mx-auto h-5 w-5 text-[oklch(0.92_0.14_90)] animate-pulse-soft" />
          <p className="mt-3 font-display text-[19px] leading-[1.55] text-foreground/95 text-balance italic text-glow">
            "{r.quote}"
          </p>
        </div>
      </motion.section>
    </div>
  );
}

function ElementGlyph({ e }: { e: string }) {
  const m: Record<string, string> = { Fire: "🔥", Water: "💧", Earth: "🌿", Air: "🌬" };
  return <span className="text-xs">{m[e] ?? "✦"}</span>;
}