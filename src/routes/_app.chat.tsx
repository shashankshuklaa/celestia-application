import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { astrologerChat } from "@/lib/chat.functions";
import { useProfile } from "@/lib/profile-store";
import { SIGN_MAP } from "@/lib/zodiac";
import { Sparkles, Send, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Eyebrow } from "@/components/ui-primitives";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

interface Msg { role: "user" | "assistant"; content: string }

const STARTERS = [
  "What does the moon want me to know today?",
  "Why does everything feel heavy this week?",
  "Read me on love right now.",
  "What should I let go of?",
];

function ChatPage() {
  const { profile, ready } = useProfile();
  const sign = profile?.sign ?? "Pisces";
  const info = SIGN_MAP[sign];
  const call = useServerFn(astrologerChat);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Welcome, **${profile?.name ?? "Seeker"}**.\n\nThe sky is unusually awake for a *${sign}* tonight. Ask me anything — I'll listen first, then read.`,
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setPending(true);
    try {
      const res = await call({ data: { sign, name: profile?.name, messages: next } });
      if (res.ok) setMessages([...next, { role: "assistant", content: res.content }]);
      else setMessages([...next, { role: "assistant", content: res.error }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "The stars stuttered. Try again." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col -mt-4">
      {/* Header */}
      <header className="flex items-center gap-3 pb-2">
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-full blur-md animate-pulse-glow" style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative grid h-12 w-12 place-items-center rounded-full glass-strong">
            <Sparkles className="h-5 w-5 text-[oklch(0.92_0.14_90)] animate-pulse-soft" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-display text-xl leading-none text-glow">Nova</p>
          <p className="text-[11px] text-foreground/60 tracking-wide mt-0.5">
            Reading for <span style={{ color: info.color }}>{sign}</span> · {info.element} · <Moon className="inline h-3 w-3 -mt-0.5" /> waxing
          </p>
        </div>
        <span className="text-2xl" style={{ color: info.color, filter: `drop-shadow(0 0 8px ${info.color})` }}>{info.symbol}</span>
      </header>

      {/* Aurora ribbon */}
      <div className="divider-aurora mb-3" />

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto pb-2 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2 items-end`}
            >
              {m.role === "assistant" && (
                <div className="shrink-0 grid h-7 w-7 place-items-center rounded-full glass-strong text-[oklch(0.92_0.14_90)] text-[11px] animate-twinkle">
                  ✦
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-gradient-to-br from-[oklch(0.85_0.16_85)] to-[oklch(0.72_0.20_305)] text-[oklch(0.14_0.05_285)] shadow-[0_8px_24px_-6px_oklch(0.72_0.20_305/0.55)]"
                    : "rounded-bl-md glass-strong text-foreground/95 ring-aurora prose-cosmic font-display text-[16px]"
                }`}
              >
                {m.role === "assistant" ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {pending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-2 items-end">
            <div className="shrink-0 grid h-7 w-7 place-items-center rounded-full glass-strong text-[oklch(0.92_0.14_90)] text-[11px]">✦</div>
            <div className="glass-strong rounded-3xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <Dot d={0} /><Dot d={180} /><Dot d={360} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="my-2 space-y-1.5">
          <Eyebrow className="px-1">Suggestions from the sky</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s, i) => (
              <motion.button
                key={s}
                onClick={() => send(s)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="press animate-bob rounded-full glass px-3 py-1.5 text-xs text-foreground/85 hover:text-foreground hover:glow-aurora transition"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(draft); }}
        className="mt-2 flex items-center gap-2 rounded-full glass-strong p-1.5 ring-aurora"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask the cosmos…"
          className="flex-1 bg-transparent px-4 py-2.5 text-[15px] outline-none placeholder:text-foreground/40"
        />
        <button
          type="submit"
          disabled={!draft.trim() || pending}
          className="grid h-10 w-10 place-items-center rounded-full text-[oklch(0.14_0.05_285)] disabled:opacity-40 press sheen glow-aurora"
          style={{ background: "var(--gradient-aurora)" }}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function Dot({ d }: { d: number }) {
  return (
    <span
      className="h-2 w-2 rounded-full"
      style={{
        background: "oklch(0.92 0.14 90)",
        boxShadow: "0 0 8px oklch(0.92 0.14 90)",
        animation: `pulse-soft 1.2s ease-in-out ${d}ms infinite`,
      }}
    />
  );
}