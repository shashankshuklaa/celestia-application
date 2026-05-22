import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useProfile } from "@/lib/profile-store";
import { clearProfile } from "@/lib/profile-store";
import { SIGN_MAP } from "@/lib/zodiac";
import { ZodiacWheel } from "@/components/zodiac-wheel";
import { Eyebrow, SectionDivider } from "@/components/ui-primitives";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const sign = profile?.sign ?? "Pisces";
  const info = SIGN_MAP[sign];

  return (
    <div className="space-y-6">
      <header>
        <Eyebrow>Your cosmic identity</Eyebrow>
        <h1 className="mt-2 text-[32px] font-display leading-tight">Profile</h1>
      </header>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl glass-strong p-6 text-center vignette"
      >
        <div className="absolute inset-0 opacity-70"
          style={{ background: `radial-gradient(circle at 50% 0%, ${info.color}66, transparent 60%)` }} />
        <div className="relative grid place-items-center">
          <ZodiacWheel highlight={sign} size={220} />
        </div>
        <p className="relative mt-4 text-[30px] font-display text-glow">{profile?.name ?? "Seeker"}</p>
        <p className="relative text-sm text-foreground/65 italic font-display">"{info.tagline}"</p>
        <div className="relative mt-4 flex flex-wrap justify-center gap-2">
          <Pill>{info.name}</Pill>
          <Pill>{info.element}</Pill>
          <Pill>{info.modality}</Pill>
          <Pill>Ruler · {info.ruler}</Pill>
        </div>
      </motion.section>

      {profile && (
        <section className="glass rounded-3xl p-5 space-y-3">
          <Row label="Born" value={new Date(profile.birthDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} />
          <Row label="Hour" value={profile.birthTime} />
          <Row label="Place" value={profile.birthPlace} />
          <Row label="Dates" value={info.dates} />
        </section>
      )}

      <SectionDivider />

      <section className="grid grid-cols-2 gap-3">
        <Card title="Strengths" items={info.strengths} tone="oklch(0.85 0.16 85)" />
        <Card title="Shadows" items={info.weaknesses} tone="oklch(0.72 0.20 305)" />
      </section>

      <section className="glass rounded-3xl p-5">
        <Eyebrow>Saved readings</Eyebrow>
        <p className="mt-2 text-sm text-foreground/60 italic font-display">
          Your saved readings will gather here as you explore — a personal archive of skies.
        </p>
      </section>

      <button
        onClick={() => { clearProfile(); navigate({ to: "/" }); }}
        className="press w-full rounded-full glass py-3 text-sm text-foreground/70 hover:text-foreground"
      >
        Reset cosmic profile
      </button>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full glass px-3 py-1 text-xs tracking-wide">{children}</span>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm items-center">
      <span className="text-[10px] uppercase tracking-[0.22em] text-foreground/55">{label}</span>
      <span className="text-foreground/90">{value}</span>
    </div>
  );
}
function Card({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="glass rounded-2xl p-4 press">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.85_0.10_85/0.8)]">{title}</p>
      <ul className="mt-2 space-y-1.5">
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