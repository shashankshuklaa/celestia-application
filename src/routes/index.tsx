import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CosmicBackground } from "@/components/cosmic-bg";
import { loadProfile } from "@/lib/profile-store";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const t = setTimeout(() => {
      const p = loadProfile();
      if (p) navigate({ to: "/home" });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden px-6 pt-24 pb-12 text-center">
      <CosmicBackground />

      <div className={`flex flex-col items-center gap-6 transition-all duration-1000 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-full bg-[oklch(0.72_0.20_305/0.25)] blur-2xl animate-pulse-glow" />
          <div className="relative grid h-24 w-24 place-items-center rounded-full glass-strong">
            <Sparkles className="h-10 w-10 text-[oklch(0.92_0.14_90)]" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Your cosmic companion</p>
          <h1 className="mt-3 text-7xl font-light text-gradient-aurora">Nova</h1>
          <p className="mt-4 max-w-xs text-balance text-foreground/70">
            Daily horoscopes, your birth chart, and an AI astrologer who actually listens.
          </p>
        </div>
      </div>

      <div className={`flex w-full max-w-sm flex-col gap-3 transition-all delay-500 duration-1000 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <Link
          to="/onboarding"
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full text-base font-medium text-[oklch(0.14_0.05_285)] glow-primary"
          style={{ background: "var(--gradient-aurora)" }}
        >
          <span className="relative z-10">Begin your reading</span>
        </Link>
        <Link
          to="/home"
          className="inline-flex h-12 items-center justify-center rounded-full text-sm text-foreground/70 hover:text-foreground"
        >
          Skip — explore first
        </Link>
        <p className="mt-2 text-[11px] tracking-widest text-foreground/40 uppercase">
          ✦  Written in the stars  ✦
        </p>
      </div>
    </main>
  );
}
