import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Msg = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const Input = z.object({
  sign: z.string().min(2).max(20),
  name: z.string().min(1).max(60).optional(),
  messages: z.array(Msg).min(1).max(40),
});

export const astrologerChat = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error:
          "Cosmic gateway is offline. Add LOVABLE_API_KEY to enable Nova's voice.",
      };
    }

    const system = `You are Nova — a modern, mystical AI astrologer.
You speak with poetic warmth, like a friend who happens to read the sky.
Reference astrology naturally (planets, houses, transits, moon phases) without lecturing.
Be emotionally intelligent: validate first, then illuminate.
Keep replies short — 2 to 4 short paragraphs, with rhythm and a little wonder.
Avoid disclaimers, avoid bullet points unless asked, avoid generic horoscopes.
The user's name is ${data.name ?? "Seeker"}. Their sun sign is ${data.sign}.
When relevant, weave their sign's element and ruling planet into your response.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });

      if (res.status === 429) {
        return { ok: false as const, error: "The stars are crowded right now — please try again in a moment." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "Cosmic credits depleted. Top up Lovable AI to keep channeling." };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "Nova lost the signal. Try again." };
      }
      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "…";
      return { ok: true as const, content };
    } catch (e) {
      console.error("astrologerChat error", e);
      return { ok: false as const, error: "The cosmos is silent. Try again." };
    }
  });