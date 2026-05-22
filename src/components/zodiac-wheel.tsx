import { ZODIAC, PLANETS, type ZodiacSign } from "@/lib/zodiac";
import { useMemo } from "react";

interface Props {
  highlight?: ZodiacSign;
  size?: number;
  /** Deterministic-ish planetary placement seed (e.g. birth date string) */
  seed?: string;
  /** Currently selected planet (renders extra glow on it) */
  selectedPlanet?: string | null;
  /** Click on a planet marker */
  onPlanetSelect?: (name: string) => void;
  /** Currently highlighted house index (0..11) */
  selectedHouse?: number | null;
  /** Click on a zodiac wedge */
  onHouseSelect?: (index: number) => void;
}

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export function ZodiacWheel({
  highlight, size = 320, seed = "nova",
  selectedPlanet = null, onPlanetSelect,
  selectedHouse = null, onHouseSelect,
}: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const ringOuter = r;
  const ringInner = r - 32;
  const houseRing = r - 62;
  const planetRing = r - 88;
  const seedN = hash(seed);

  const planetPositions = useMemo(
    () =>
      PLANETS.map((p, i) => {
        const offset = ((seedN >> (i * 3)) & 0xff) / 255;
        const angle = ((i + offset) / PLANETS.length) * 2 * Math.PI - Math.PI / 2;
        return { ...p, angle };
      }),
    [seedN],
  );

  // Helper: wedge path for one zodiac segment
  const wedge = (i: number) => {
    const a0 = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / 12) * 2 * Math.PI - Math.PI / 2;
    const r0 = houseRing;
    const r1 = ringOuter;
    const x0a = cx + Math.cos(a0) * r0;
    const y0a = cy + Math.sin(a0) * r0;
    const x1a = cx + Math.cos(a0) * r1;
    const y1a = cy + Math.sin(a0) * r1;
    const x0b = cx + Math.cos(a1) * r0;
    const y0b = cy + Math.sin(a1) * r0;
    const x1b = cx + Math.cos(a1) * r1;
    const y1b = cy + Math.sin(a1) * r1;
    return `M ${x0a} ${y0a} L ${x1a} ${y1a} A ${r1} ${r1} 0 0 1 ${x1b} ${y1b} L ${x0b} ${y0b} A ${r0} ${r0} 0 0 0 ${x0a} ${y0a} Z`;
  };

  return (
    <div className="relative grid place-items-center">
      {/* Outer aurora bloom behind the wheel */}
      <div
        className="pointer-events-none absolute rounded-full blur-3xl opacity-70 animate-pulse-soft"
        style={{
          width: size * 1.2,
          height: size * 1.2,
          background:
            "conic-gradient(from 0deg, oklch(0.72 0.20 305 / 0.45), oklch(0.65 0.20 250 / 0.4), oklch(0.85 0.16 85 / 0.35), oklch(0.65 0.18 350 / 0.4), oklch(0.72 0.20 305 / 0.45))",
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative drop-shadow-[0_0_30px_oklch(0.72_0.20_305/0.6)]"
      >
        <defs>
          <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.16 85 / 0.7)" />
            <stop offset="35%" stopColor="oklch(0.72 0.20 305 / 0.45)" />
            <stop offset="75%" stopColor="oklch(0.30 0.10 285 / 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.16 85)" />
            <stop offset="50%" stopColor="oklch(0.72 0.20 305)" />
            <stop offset="100%" stopColor="oklch(0.78 0.15 220)" />
          </linearGradient>
          <radialGradient id="planetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.14 85 / 0.9)" />
            <stop offset="60%" stopColor="oklch(0.72 0.20 305 / 0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Center nebula */}
        <circle cx={cx} cy={cy} r={houseRing} fill="url(#wheelCenter)" />

        {/* House wedges — interactive, highlighted on selection */}
        <g>
          {ZODIAC.map((sign, i) => {
            const isSel = selectedHouse === i;
            const isSignHi = highlight === sign.name;
            return (
              <path
                key={`w-${sign.name}`}
                d={wedge(i)}
                fill={isSel ? "oklch(0.72 0.20 305 / 0.28)" : isSignHi ? "oklch(0.85 0.16 85 / 0.10)" : "transparent"}
                stroke={isSel ? "oklch(0.85 0.16 85 / 0.7)" : "transparent"}
                strokeWidth={1}
                onClick={() => onHouseSelect?.(i)}
                style={{ cursor: onHouseSelect ? "pointer" : "default", transition: "fill 0.3s ease" }}
              />
            );
          })}
        </g>

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={ringOuter} fill="none" stroke="url(#ringStroke)" strokeWidth={1.5} opacity={0.85} />
        <circle cx={cx} cy={cy} r={ringInner} fill="none" stroke="white" strokeWidth={0.5} opacity={0.28} />
        <circle cx={cx} cy={cy} r={houseRing} fill="none" stroke="white" strokeWidth={0.5} opacity={0.22} />
        <circle cx={cx} cy={cy} r={planetRing} fill="none" stroke="oklch(0.85 0.16 85 / 0.4)" strokeWidth={0.6} />

        {/* Dashed energy-flow orbits */}
        <circle
          cx={cx} cy={cy} r={planetRing + 14}
          fill="none" stroke="oklch(0.85 0.16 85 / 0.55)" strokeWidth={0.8}
          className="animate-orbit-dash"
        />
        <circle
          cx={cx} cy={cy} r={planetRing - 18}
          fill="none" stroke="oklch(0.72 0.20 305 / 0.5)" strokeWidth={0.8}
          className="animate-orbit-dash"
          style={{ animationDirection: "reverse", animationDuration: "11s" }}
        />

        {/* Slow rotating zodiac band */}
        <g
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin-slow 180s linear infinite" }}
        >
          {ZODIAC.map((sign, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const tickAngle = ((i + 0.5) / 12) * 2 * Math.PI - Math.PI / 2;
            const tx = cx + Math.cos(angle) * ringOuter;
            const ty = cy + Math.sin(angle) * ringOuter;
            const lx = cx + Math.cos(tickAngle) * (ringOuter - 16);
            const ly = cy + Math.sin(tickAngle) * (ringOuter - 16);
            const isHi = highlight === sign.name;
            return (
              <g key={sign.name}>
                <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="white" strokeWidth={0.4} opacity={0.12} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isHi ? 22 : 17}
                  fill={isHi ? "oklch(0.95 0.14 88)" : "white"}
                  opacity={isHi ? 1 : 0.88}
                  style={{ filter: isHi ? "drop-shadow(0 0 10px oklch(0.85 0.16 85))" : "drop-shadow(0 0 3px oklch(0.72 0.20 305 / 0.4))" }}
                >
                  {sign.symbol}
                </text>
              </g>
            );
          })}
        </g>

        {/* Inner house-numbers ring (counter-rotates) */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "spin-slow 240s linear infinite reverse" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = ((i + 0.5) / 12) * 2 * Math.PI - Math.PI / 2;
            const tx = cx + Math.cos(a) * (planetRing + 30);
            const ty = cy + Math.sin(a) * (planetRing + 30);
            return (
              <text key={`hn-${i}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                fontSize={9} fill="oklch(0.92 0.14 90 / 0.7)" letterSpacing="0.2em">
                {String(i + 1).padStart(2, "0")}
              </text>
            );
          })}
        </g>

        {/* Planet markers — glowing dots on planetRing, tappable */}
        <g>
          {planetPositions.map((p) => {
            const px = cx + Math.cos(p.angle) * planetRing;
            const py = cy + Math.sin(p.angle) * planetRing;
            const isSel = selectedPlanet === p.name;
            return (
              <g
                key={p.name}
                onClick={() => onPlanetSelect?.(p.name)}
                style={{ cursor: onPlanetSelect ? "pointer" : "default" }}
              >
                {/* glow halo */}
                <circle cx={px} cy={py} r={isSel ? 18 : 14} fill="url(#planetGlow)" opacity={isSel ? 1 : 0.7} />
                <circle
                  cx={px} cy={py}
                  r={isSel ? 11 : 9}
                  fill="oklch(0.16 0.06 285)"
                  stroke="oklch(0.85 0.16 85)"
                  strokeWidth={isSel ? 1.5 : 1}
                  className="animate-pulse-soft"
                  style={{ animationDelay: `${p.angle.toFixed(2)}s` }}
                />
                <text x={px} y={py} textAnchor="middle" dominantBaseline="central"
                  fontSize={isSel ? 12 : 10} fill="oklch(0.95 0.14 88)" style={{ pointerEvents: "none" }}>
                  {p.symbol}
                </text>
              </g>
            );
          })}
        </g>

        {/* Center glyph */}
        {highlight && (
          <g>
            <circle cx={cx} cy={cy} r={size * 0.13} fill="url(#wheelCenter)" filter="url(#softGlow)" />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.round(size * 0.18)}
              fill="white"
              className="animate-pulse-soft"
              style={{ filter: "drop-shadow(0 0 16px oklch(0.72 0.20 305)) drop-shadow(0 0 30px oklch(0.85 0.16 85 / 0.6))" }}
            >
              {ZODIAC.find((z) => z.name === highlight)?.symbol}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}