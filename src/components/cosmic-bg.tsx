import { useEffect, useMemo, useState } from "react";

/**
 * Cinematic cosmic background — parallax star layers, drifting aurora
 * blobs, floating dust particles, soft vignette. Fixed-position; never
 * blocks taps. Pure CSS animations for performance.
 */
export function CosmicBackground({ intensity = 1 }: { intensity?: number }) {
  // Only generate random star/particle data on the client to avoid SSR
  // hydration mismatches (Math.random() produces different values per render).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Three parallax layers — small/dim/many, medium, large/bright/few
  const layerFar = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.1 + 0.4,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 5,
        opacity: 0.5 + Math.random() * 0.4,
      })),
    [],
  );
  const layerMid = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 1,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 3.5,
      })),
    [],
  );
  const layerNear = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1.8,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        hue: Math.random() < 0.5 ? "oklch(0.95 0.12 90)" : "oklch(0.92 0.10 305)",
      })),
    [],
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 2,
        delay: Math.random() * 14,
        duration: 14 + Math.random() * 18,
        hue: i % 3 === 0 ? "oklch(0.92 0.14 90)" : "white",
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Aurora blobs — drifting, blurred, screen-blended */}
      <div
        className="absolute -top-1/3 -left-1/4 h-[75vh] w-[75vh] rounded-full blur-3xl animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.25 305 / 0.6), transparent 70%)",
          opacity: 0.75 * intensity,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute top-1/4 -right-1/4 h-[65vh] w-[65vh] rounded-full blur-3xl animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 240 / 0.55), transparent 70%)",
          animationDelay: "3s",
          opacity: 0.75 * intensity,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[55vh] w-[55vh] rounded-full blur-3xl animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.18 350 / 0.4), transparent 70%)",
          animationDelay: "6s",
          opacity: 0.55 * intensity,
          mixBlendMode: "screen",
        }}
      />

      {mounted && (
        <>
          {/* Far star layer — slow drift (client-only) */}
          <div className="absolute inset-0" style={{ animation: "drift-1 120s linear infinite alternate" }}>
            {layerFar.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>

          {/* Mid layer — faster drift, brighter */}
          <div className="absolute inset-0" style={{ animation: "drift-2 80s linear infinite alternate" }}>
            {layerMid.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  boxShadow: "0 0 4px white",
                }}
              />
            ))}
          </div>

          {/* Near layer — large bright stars with color, soft halos */}
          <div className="absolute inset-0">
            {layerNear.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full animate-twinkle"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  background: s.hue,
                  boxShadow: `0 0 12px ${s.hue}, 0 0 24px ${s.hue}`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>

          {/* Floating dust particles — rise slowly from below */}
          <div className="absolute inset-0">
            {particles.map((p) => (
              <span
                key={p.id}
                className="absolute rounded-full"
                style={{
                  bottom: 0,
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size,
                  background: p.hue,
                  boxShadow: `0 0 8px ${p.hue}`,
                  animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

      {/* Cinematic vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, oklch(0.05 0.02 285 / 0.55) 100%)" }} />
    </div>
  );
}