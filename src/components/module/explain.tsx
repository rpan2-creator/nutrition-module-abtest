"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { KC } from "@/content/kcs";
import type { Condition } from "@/lib/session";
import { track } from "@/lib/track";

/**
 * The one step that differs between the two study versions, used once per chapter
 * right after the chapter's main practice task.
 *
 * Version A reads a "Key point" card with the model explanation.
 * Version B writes one sentence first, then sees the same model explanation and
 * checks their own sentence against three questions.
 *
 * Both versions see exactly the same model text. Every step is timed and logged.
 */

const CHECKS = [
  { id: "food", text: "Did mine name the food or the amount?" },
  { id: "role", text: "Did mine name its nutritional role?" },
  { id: "why", text: "Did mine say why it matters in this situation?" },
];

export function ExplainStep({
  id,
  kc,
  condition,
  prompt,
  placeholder,
  model,
  onDone,
}: {
  id: string;
  kc: KC;
  condition: Condition;
  /** Version B's question. */
  prompt: string;
  placeholder: string;
  /** The model explanation, identical for both versions. */
  model: string;
  onDone: () => void;
}) {
  const shownAt = useRef(performance.now());
  const comparedAt = useRef(0);
  const [text, setText] = useState("");
  const [compared, setCompared] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  function finishA() {
    setFinished(true);
    track({
      phase: "learn",
      screen: id,
      event_type: "section_complete",
      item_id: id,
      kc,
      duration_ms: performance.now() - shownAt.current,
      meta: { step: "explain", version: "A", action: "read_key_point" },
    });
    onDone();
  }

  function compare() {
    comparedAt.current = performance.now();
    setCompared(true);
    track({
      phase: "learn",
      screen: id,
      event_type: "answer",
      item_id: id,
      kc,
      response: text,
      correct: null,
      duration_ms: comparedAt.current - shownAt.current,
      meta: { step: "explain", version: "B", action: "write", chars: text.trim().length },
    });
  }

  function finishB() {
    setFinished(true);
    track({
      phase: "learn",
      screen: id,
      event_type: "section_complete",
      item_id: id,
      kc,
      response: checks,
      duration_ms: performance.now() - comparedAt.current,
      meta: { step: "explain", version: "B", action: "self_check", ticked: Object.values(checks).filter(Boolean).length },
    });
    onDone();
  }

  if (condition === "A") {
    return (
      <div className="rounded-[24px] bg-cream-2 p-6">
        <p className="text-[13px] font-semibold text-red">Key point</p>
        <p className="mt-2 max-w-[62ch] text-[17px] leading-relaxed">{model}</p>
        {!finished && (
          <button onClick={finishA} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-porcelain hover:bg-red">
            Continue
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-tray p-6 ring-1 ring-line">
      <p className="text-[13px] font-semibold text-red">Explain it in one sentence</p>
      <p className="mt-1 text-[19px] font-semibold leading-snug">{prompt}</p>
      <p className="mt-1 text-[14px] text-muted">Use the chain: food or amount → its nutritional role → why that helps here.</p>
      <textarea
        value={text}
        disabled={compared}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="mt-4 w-full rounded-2xl border border-line bg-porcelain p-4 text-[16px] leading-relaxed focus:border-ink focus:outline-none disabled:opacity-80"
      />
      {!compared ? (
        <button
          disabled={text.trim().length < 8}
          onClick={compare}
          className="mt-3 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-porcelain hover:bg-red disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Compare with a model answer
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className="rounded-2xl bg-cream-2 p-5">
            <p className="text-[13px] font-semibold text-red">Model answer</p>
            <p className="mt-1 text-[16px] leading-relaxed">{model}</p>
          </div>
          <fieldset className="mt-5">
            <legend className="text-[15px] font-semibold">Check your own sentence against it</legend>
            <div className="mt-2 grid gap-2">
              {CHECKS.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 text-[15px]">
                  <input
                    type="checkbox"
                    disabled={finished}
                    checked={!!checks[c.id]}
                    onChange={(e) => setChecks((s) => ({ ...s, [c.id]: e.target.checked }))}
                    className="h-4 w-4 accent-[var(--ink)]"
                  />
                  {c.text}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-3 text-[14px] text-muted">If you missed one, think about how you would add it.</p>
          {!finished && (
            <button onClick={finishB} className="mt-4 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-porcelain hover:bg-red">
              Continue
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
