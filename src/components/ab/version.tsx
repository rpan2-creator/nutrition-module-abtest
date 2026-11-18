"use client";

import { useEffect, useState } from "react";
import { Condition, getSession } from "@/lib/session";

/** How each study version is named and described everywhere on the site. */
export const VERSIONS: Record<Condition, { name: string; tag: string; short: string; long: string; bg: string; fg: string }> = {
  A: {
    name: "Version A",
    tag: "Read the key point",
    short: "After each chapter's main task, you read a key-point card.",
    long: "Same lessons and practice. After the main task in each of the four chapters, you read a short key-point card that explains the idea, then continue.",
    bg: "#110000",
    fg: "#fdfbee",
  },
  B: {
    name: "Version B",
    tag: "Explain, then compare",
    short: "After each chapter's main task, you write one sentence, then compare it with a model answer.",
    long: "Same lessons and practice. After the main task in each of the four chapters, you write a one-sentence explanation, compare it with a model answer, and check your own sentence against three questions.",
    bg: "#d50000",
    fg: "#fdfbee",
  },
};

export function useVersion(): Condition | null {
  const [v, setV] = useState<Condition | null>(null);
  useEffect(() => {
    const read = () => {
      const s = getSession();
      setV(s?.condition === "A" || s?.condition === "B" ? s.condition : null);
    };
    read();
    window.addEventListener("nm-session", read);
    return () => window.removeEventListener("nm-session", read);
  }, []);
  return v;
}

/** A small pill naming the version. */
export function VersionPill({ v, className = "" }: { v: Condition; className?: string }) {
  const info = VERSIONS[v];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${className}`}
      style={{ background: info.bg, color: info.fg }}
    >
      {info.name}
      <span className="font-normal opacity-80">· {info.tag}</span>
    </span>
  );
}

/** The strip under the site header that tells the learner which version they are in. */
export function VersionBar() {
  const v = useVersion();
  if (!v) return null;
  const info = VERSIONS[v];
  return (
    <div style={{ background: info.bg, color: info.fg }}>
      <div className="mx-auto flex h-7 max-w-6xl items-center gap-3 overflow-hidden whitespace-nowrap px-5 text-[12.5px]">
        <strong className="shrink-0 font-semibold">
          {info.name} · {info.tag}
        </strong>
        <span className="truncate opacity-80">{info.short}</span>
      </div>
    </div>
  );
}
