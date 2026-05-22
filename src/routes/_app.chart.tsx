import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "@/lib/profile-store";
import { HOUSES, PLANETS, SIGN_MAP, ZODIAC } from "@/lib/zodiac";
import { ZodiacWheel } from "@/components/zodiac-wheel";
import { Eyebrow, SectionDivider } from "@/components/ui-primitives";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/_app/chart")({
  component: ChartPage,
});

function ChartPage() {
  const { profile, ready } = useProfile();
  const sign = profile?.sign ?? "Pisces";
  const info = SIGN_MAP[sign];
  const seed = profile ? `${profile.birthDate}-${profile.birthTime}` : "nova";

  const houseSigns = useMemo(() => {
    const start = ZODIAC.findIndex((z) => z.name === sign);
    return HOUSES.map((_, i) => ZODIAC[(start + i) % 12]);
  }, [sign]);

  const [tab, setTab] = useState<"chart" | "planets" | "houses">("chart");
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const planetDetails = useMemo(() => {
    return PLANETS.map((p, i) => {
      const sIdx = (i * 3 + (sign.length % 12)) % 12;
      const s = ZODIAC[sIdx];
      return { ...p, inSign: s };
    });
  }, [sign]);

  const selPlanet = planetDetails.find((p) => p.name === selectedPlanet);
  const selHouse = selectedHouse != null ? { name: HOUSES[selectedHouse], sign: houseSigns[selectedHouse], index: selectedHouse } : null;

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <Eyebrow>Your Natal Sky</Eyebrow>
        <h1 className="mt-2 text-[34px] font-display leading-[1.05] tracking-tight">
          The chart of <em className="not-italic text-gradient-aurora text-glow">{profile?.name ?? "you"}</em>
        </h1>
        {profile && (
          <p className="mt-2 text-sm text-foreground/55 tracking-wide">
            {new Date(profile.birthDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} · {profile.birthTime} · {profile.birthPlace}
          </p>
        )}
      </header>

      {/* Hero wheel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative grid place-items-center py-2">
          <ZodiacWheel
            highlight={sign}
            seed={seed}
            size={340}
            selectedPlanet={selectedPlanet}
            onPlanetSelect={(p) => { setSelectedPlanet(p === selectedPlanet ? null : p); setSelectedHouse(null); }}
            selectedHouse={selectedHouse}
            onHouseSelect={(i) => { setSelectedHouse(i === selectedHouse ? null : i); setSelectedPlanet(null); }}
          />
        </div>

        {/* Interactive detail card */}
        <AnimatePresence mode="wait">
          {selPlanet && (
            <motion.div
              key={`p-${selPlanet.name}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-2xl px-5 py-4 mt-2 flex items-center gap-4"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full glow-gold text-xl text-[oklch(0.92_0.14_90)]"
                style={{ background: "radial-gradient(circle, oklch(0.30 0.10 285), oklch(0.18 0.06 285))" }}>
                {selPlanet.symbol}
              </div>
              <div className="flex-1">
                <Eyebrow>Planet</Eyebrow>
                <p className="font-display text-xl leading-tight">{selPlanet.name}</p>
                <p className="text-xs text-foreground/60">in {selPlanet.inSign.name} · {selPlanet.inSign.element}</p>
              </div>
              <span className="text-3xl" style={{ color: selPlanet.inSign.color, filter: `drop-shadow(0 0 10px ${selPlanet.inSign.color})` }}>
                {selPlanet.inSign.symbol}
              </span>
            </motion.div>
          )}
          {selHouse && (
            <motion.div
              key={`h-${selHouse.index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-2xl px-5 py-4 mt-2 flex items-center gap-4"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full glow-aurora text-lg font-display"
                style={{ background: "var(--gradient-aurora)", color: "oklch(0.14 0.05 285)" }}>
                {selHouse.index + 1}
              </div>
              <div className="flex-1">
                <Eyebrow>House {selHouse.index + 1}</Eyebrow>
                <p className="font-display text-xl leading-tight">{selHouse.name}</p>
                <p className="text-xs text-foreground/60">held by {selHouse.sign.name}</p>
              </div>
              <span className="text-3xl" style={{ color: selHouse.sign.color, filter: `drop-shadow(0 0 10px ${selHouse.sign.color})` }}>
                {selHouse.sign.symbol}
              </span>
            </motion.div>
          )}
          {!selPlanet && !selHouse && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-2 text-center text-xs text-foreground/45 italic"
            >
              Tap a planet or a sign wedge to listen closer.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Horizontal planet scroller */}
      <div className="-mx-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1 snap-x snap-mandatory">
          {planetDetails.map((p) => {
            const active = selectedPlanet === p.name;
            return (
              <button
                key={p.name}
                onClick={() => { setSelectedPlanet(active ? null : p.name); setSelectedHouse(null); }}
                className={`press snap-start shrink-0 w-[120px] rounded-2xl p-3 text-left transition ${
                  active ? "glass-strong glow-aurora" : "glass"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-[oklch(0.92_0.14_90)]">{p.symbol}</span>
                  <span className="text-lg" style={{ color: p.inSign.color }}>{p.inSign.symbol}</span>
                </div>
                <p className="mt-2 text-[13px] font-display">{p.name}</p>
                <p className="text-[10px] text-foreground/55">in {p.inSign.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <SectionDivider />

      <div className="glass rounded-2xl p-1 grid grid-cols-3 text-sm relative">
        {(["chart","planets","houses"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`relative rounded-xl py-2 capitalize transition press ${tab===t ? "text-foreground" : "text-foreground/55"}`}>
            {tab === t && (
              <motion.span
                layoutId="chart-tab"
                className="absolute inset-0 rounded-xl -z-0"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.20 305 / 0.4), oklch(0.65 0.20 240 / 0.3))", boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.1)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t === "chart" ? "Sign" : t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
      {tab === "chart" && (
        <motion.section
          key="chart"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="glass-strong rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl text-4xl glow-gold"
              style={{ background: `linear-gradient(135deg, ${info.color}55, transparent)`, color: info.color }}>
              {info.symbol}
            </div>
            <div>
              <p className="text-[26px] font-display leading-none">{info.name}</p>
              <p className="text-xs text-foreground/60 mt-1 tracking-wide">{info.element} · {info.modality} · Ruled by {info.ruler}</p>
            </div>
          </div>
          <p className="font-display text-lg italic text-foreground/85 text-glow">"{info.tagline}"</p>
          <div className="grid grid-cols-3 gap-2">
            {info.traits.map((t) => (
              <span key={t} className="rounded-full glass px-3 py-1.5 text-center text-xs tracking-wide">{t}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Block title="Strengths" items={info.strengths} tone="oklch(0.85 0.16 85)" />
            <Block title="Shadows"   items={info.weaknesses} tone="oklch(0.72 0.20 305)" />
          </div>
        </motion.section>
      )}

      {tab === "planets" && (
        <motion.section
          key="planets"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-3xl p-5 space-y-3"
        >
          {planetDetails.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center justify-between rounded-2xl glass px-4 py-3 press"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full glow-gold text-lg text-[oklch(0.92_0.14_90)]"
                  style={{ background: "radial-gradient(circle, oklch(0.30 0.10 285), oklch(0.18 0.06 285))" }}>{p.symbol}</span>
                <div>
                  <p className="text-sm font-display">{p.name}</p>
                  <p className="text-[11px] text-foreground/50 tracking-wide">in {p.inSign.name}</p>
                </div>
              </div>
              <span className="text-2xl" style={{ color: p.inSign.color, filter: `drop-shadow(0 0 8px ${p.inSign.color})` }}>{p.inSign.symbol}</span>
            </motion.div>
          ))}
        </motion.section>
      )}

      {tab === "houses" && (
        <motion.section
          key="houses"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          {HOUSES.map((h, i) => {
            const s = houseSigns[i];
            return (
              <motion.div
                key={h}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="glass rounded-2xl p-4 press"
              >
                <Eyebrow>House {i + 1}</Eyebrow>
                <p className="text-base font-display mt-0.5">{h}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg" style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color})` }}>{s.symbol}</span>
                  <span className="text-xs text-foreground/60">{s.name}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.section>
      )}
      </AnimatePresence>
    </div>
  );
}

function Block({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <Eyebrow>{title}</Eyebrow>
      <ul className="mt-2 space-y-1">
        {items.map((s) => (
          <li key={s} className="flex items-center gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: tone, color: tone }} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

