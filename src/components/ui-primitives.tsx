import { useEffect, useRef, useState, type ReactNode } from "react";

/** Uppercase tracked gold eyebrow label. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[10px] uppercase tracking-[0.32em] text-[oklch(0.85_0.10_85/0.8)] ${className}`}>
      {children}
    </p>
  );
}

/** Aurora hairline divider with optional center star. */
export function SectionDivider({ withStar = true }: { withStar?: boolean }) {
  return (
    <div className="relative flex items-center py-1">
      <span className="divider-aurora flex-1" />
      {withStar && (
        <span className="mx-3 text-[10px] text-[oklch(0.85_0.16_85)] animate-twinkle">✦</span>
      )}
      <span className="divider-aurora flex-1" />
    </div>
  );
}

/** Shimmer skeleton block. */
export function Shimmer({ className = "h-4 w-full rounded-md" }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

/** Animated count-up integer. */
export function CountUp({ to, duration = 900, format = (n: number) => String(n) }: {
  to: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [n, setN] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = fromRef.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(Math.round(from + (to - from) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{format(n)}</>;
}

/** Glass stat pill with eyebrow + value + optional icon/swatch. */
export function StatPill({
  label, value, icon, swatch, accent,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  swatch?: string;
  accent?: string;
}) {
  return (
    <div className="glass press relative overflow-hidden rounded-2xl p-4">
      {accent && (
        <div
          className="absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-60"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground/55">
          {icon}
          {label}
        </div>
        <div className="mt-2 flex items-center gap-2">
          {swatch && <span className="h-5 w-5 rounded-full ring-1 ring-white/25 shadow-[0_0_12px_currentColor]" style={{ background: swatch, color: swatch }} />}
          <p className="text-xl font-display tracking-wide">{value}</p>
        </div>
      </div>
    </div>
  );
}