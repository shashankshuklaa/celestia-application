import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Orbit, Heart, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { to: "/home",          label: "Today",  Icon: Home },
  { to: "/chart",         label: "Chart",  Icon: Orbit },
  { to: "/compatibility", label: "Match",  Icon: Heart },
  { to: "/chat",          label: "Nova",   Icon: Sparkles },
  { to: "/profile",       label: "Me",     Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="mx-auto max-w-md px-4">
        <div className="glass-strong relative flex items-center justify-around rounded-full px-2 py-2 shadow-2xl">
          {TABS.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 transition press"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 inset-y-0.5 -z-10 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, oklch(0.72 0.20 305 / 0.35), transparent 70%)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-to-br from-[oklch(0.72_0.20_305)] to-[oklch(0.65_0.20_240)] text-white shadow-[0_0_24px_oklch(0.72_0.20_305/0.7)]"
                      : "text-foreground/60 group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <span className={`text-[10px] tracking-[0.15em] uppercase ${active ? "text-foreground" : "text-foreground/45"}`}>
                  {label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 h-[2px] w-6 rounded-full"
                    style={{ background: "var(--gradient-aurora)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}