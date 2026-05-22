import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CosmicBackground } from "@/components/cosmic-bg";
import { signFromDate, SIGN_MAP } from "@/lib/zodiac";
import { saveProfile } from "@/lib/profile-store";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const STEPS = [
  { key: "name",  label: "What may the stars call you?",   sub: "Your name shapes the conversation." },
  { key: "date",  label: "When did you arrive on Earth?",  sub: "Your birth date reveals your sun sign." },
  { key: "time",  label: "At what hour did you breathe in?", sub: "Birth time refines your rising and houses." },
  { key: "place", label: "Where did the sky first see you?", sub: "Your birth place anchors the chart in space." },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", birthDate: "", birthTime: "12:00", birthPlace: "" });

  const sign = useMemo(() => (form.birthDate ? signFromDate(form.birthDate) : null), [form.birthDate]);
  const signInfo = sign ? SIGN_MAP[sign] : null;

  const canNext =
    (step === 0 && form.name.trim().length > 0) ||
    (step === 1 && !!form.birthDate) ||
    (step === 2 && !!form.birthTime) ||
    step === 3;

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else {
      saveProfile({ name: form.name.trim(), birthDate: form.birthDate, birthTime: form.birthTime, birthPlace: form.birthPlace.trim() || "Somewhere on Earth" });
      navigate({ to: "/home" });
    }
  };

  const current = STEPS[step];

  return (
    <main className="relative flex min-h-[100dvh] flex-col px-6 pt-12 pb-10">
      <CosmicBackground intensity={0.7} />

      <header className="flex items-center justify-between">
        <button
          onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep((s) => s - 1))}
          className="grid h-10 w-10 place-items-center rounded-full glass"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === step ? "w-8 bg-[oklch(0.85_0.16_85)]" : i < step ? "w-4 bg-foreground/60" : "w-4 bg-foreground/15"}`}
            />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <section key={current.key} className="flex flex-1 flex-col justify-center gap-8 animate-fade-up">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Step {step + 1} of {STEPS.length}</p>
          <h2 className="mt-3 text-4xl font-light leading-tight text-balance">{current.label}</h2>
          <p className="mt-3 text-foreground/60">{current.sub}</p>
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full rounded-2xl glass px-5 py-4 text-lg outline-none placeholder:text-foreground/30 focus:ring-2 focus:ring-[oklch(0.72_0.20_305/0.5)]"
            />
          )}
          {step === 1 && (
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="w-full rounded-2xl glass px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-[oklch(0.72_0.20_305/0.5)]"
              style={{ colorScheme: "dark" }}
            />
          )}
          {step === 2 && (
            <input
              type="time"
              value={form.birthTime}
              onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
              className="w-full rounded-2xl glass px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-[oklch(0.72_0.20_305/0.5)]"
              style={{ colorScheme: "dark" }}
            />
          )}
          {step === 3 && (
            <input
              value={form.birthPlace}
              onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
              placeholder="City, Country"
              className="w-full rounded-2xl glass px-5 py-4 text-lg outline-none placeholder:text-foreground/30 focus:ring-2 focus:ring-[oklch(0.72_0.20_305/0.5)]"
            />
          )}

          {signInfo && step >= 1 && (
            <div className="glass rounded-2xl p-5 animate-fade-up">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl text-3xl"
                  style={{ background: `linear-gradient(135deg, ${signInfo.color}55, transparent)`, color: signInfo.color }}>
                  {signInfo.symbol}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Your sun sign</p>
                  <p className="text-2xl font-display">{signInfo.name}</p>
                  <p className="text-sm text-foreground/60 italic">{signInfo.tagline}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <button
        onClick={next}
        disabled={!canNext}
        className="press sheen mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-medium text-[oklch(0.14_0.05_285)] disabled:opacity-40 transition glow-aurora"
        style={{ background: "var(--gradient-aurora)" }}
      >
        {step === STEPS.length - 1 ? <>Enter Nova <Check className="h-4 w-4" /></> : <>Continue <ArrowRight className="h-4 w-4" /></>}
      </button>
    </main>
  );
}