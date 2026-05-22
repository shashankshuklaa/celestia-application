import { useEffect, useState } from "react";
import { signFromDate, type ZodiacSign } from "./zodiac";

export interface BirthProfile {
  name: string;
  birthDate: string;   // ISO yyyy-mm-dd
  birthTime: string;   // HH:MM
  birthPlace: string;
  sign: ZodiacSign;
  createdAt: number;
}

const KEY = "nova.profile.v1";

export function loadProfile(): BirthProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BirthProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Omit<BirthProfile, "sign" | "createdAt"> & { sign?: ZodiacSign }) {
  const sign = p.sign ?? signFromDate(p.birthDate);
  const full: BirthProfile = { ...p, sign, createdAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(full));
  return full;
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export function useProfile() {
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);
  return { profile, ready, setProfile };
}