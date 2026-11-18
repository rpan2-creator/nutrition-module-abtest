"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FOODS, Food } from "@/content/foods";
import { MACRO, Macro } from "@/content/kcs";
import { track } from "@/lib/track";
import { RoleChip } from "./kit";

/* Pieces for the restructured module (four parts + "take it with you"). */

/* ───────── Sources line ───────── */

export function Sources({ items }: { items: { t: string; who: string; href: string }[] }) {
  return (
    <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
      {items.length > 1 ? "Sources: " : "Source: "}
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 && "; "}
          <a href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
            {s.t}
          </a>{" "}
          ({s.who})
        </span>
      ))}
    </p>
  );
}

export const SRC = {
  carbs: { t: "Carbohydrates", who: "MedlinePlus", href: "https://medlineplus.gov/carbohydrates.html" },
  protein: { t: "Protein in diet", who: "MedlinePlus", href: "https://medlineplus.gov/ency/article/002467.htm" },
  fats: { t: "Dietary Fats", who: "MedlinePlus", href: "https://medlineplus.gov/dietaryfats.html" },
  fiber: { t: "Fiber", who: "MedlinePlus", href: "https://medlineplus.gov/ency/article/002470.htm" },
  portions: { t: "Food Portions: Choosing Just Enough for You", who: "National Institute of Diabetes and Digestive and Kidney Diseases", href: "https://www.niddk.nih.gov/health-information/weight-management/just-enough-food-portions" },
  weight: { t: "Steps for Losing Weight", who: "Centers for Disease Control and Prevention", href: "https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html" },
  breakfast: { t: "Power Up with Breakfast", who: "Academy of Nutrition and Dietetics", href: "https://www.eatright.org/food/planning/meals-and-snacks/power-up-with-breakfast" },
  timing: { t: "Timing Your Pre- and Post-Workout Nutrition", who: "Academy of Nutrition and Dietetics", href: "https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/timing-your-pre-and-post-workout-nutrition" },
  plate: { t: "Healthy Eating Plate", who: "The Nutrition Source, Harvard T.H. Chan School of Public Health", href: "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/" },
};

/* ───────── Part 1: four buckets ───────── */

const BUCKETS: { role: Macro; foods: Food[] }[] = [
  { role: "carb", foods: [FOODS.rice, FOODS.pasta, FOODS.bread, FOODS.banana, FOODS.potato, FOODS.oatmeal, FOODS.crackers, FOODS.brownrice, FOODS.granola, FOODS.milk, FOODS.beans] },
  { role: "protein", foods: [FOODS.chicken, FOODS.egg, FOODS.salmon, FOODS.tofu, FOODS.greek, FOODS.jerky, FOODS.pb, FOODS.milk, FOODS.beans] },
  { role: "fat", foods: [FOODS.oil, FOODS.avocado, FOODS.pb, FOODS.salmon, FOODS.egg, FOODS.tofu] },
  { role: "fiber", foods: [FOODS.broccoli, FOODS.spinach, FOODS.carrot, FOODS.tomato, FOODS.raspberries, FOODS.apple, FOODS.oatmeal, FOODS.brownrice, FOODS.beans, FOODS.avocado, FOODS.bread] },
];

const BUCKET_LINE: Record<Macro, string> = {
  carb: "Your body's main quick fuel.",
  protein: "Builds and repairs tissue; helps meals keep you full.",
  fat: "Concentrated energy; helps absorb some vitamins.",
  fiber: "The part of plants you don't fully digest; helps digestion and fullness.",
};

/**
 * A pail drawn in three layers: the back of the rim, the heap of foods, then the
 * front of the pail on top, so the lower foods look sunk inside it. Only the
 * painted front blocks the pointer, so every visible food can be hovered.
 */
function PailBack() {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {/* handle */}
      <path d="M22 96 C 30 4, 170 4, 178 96" fill="none" stroke="#110000" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <circle cx="22" cy="98" r="4" fill="#110000" opacity=".55" />
      <circle cx="178" cy="98" r="4" fill="#110000" opacity=".55" />
      {/* inside of the rim */}
      <ellipse cx="100" cy="96" rx="86" ry="15" fill="#e9e3c4" stroke="#110000" strokeWidth="3" />
    </svg>
  );
}

function PailFront({ tint }: { tint: string | null }) {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden>
      <path
        d="M14 96 A86 15 0 0 0 186 96 L166 188 Q100 200 34 188 Z"
        fill="#fffdf4"
        stroke="#110000"
        strokeWidth="3"
        strokeLinejoin="round"
        style={{ pointerEvents: "visiblePainted" }}
      />
      {tint && (
        <motion.path
          d="M14 96 A86 15 0 0 0 186 96 L166 188 Q100 200 34 188 Z"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          style={{ fill: tint }}
        />
      )}
      {/* two hoops */}
      <path d="M19 120 Q100 140 181 120" fill="none" stroke="#110000" strokeOpacity=".22" strokeWidth="2.5" />
      <path d="M29 172 Q100 190 171 172" fill="none" stroke="#110000" strokeOpacity=".22" strokeWidth="2.5" />
      {/* front lip of the rim */}
      <path d="M14 96 A86 15 0 0 0 186 96" fill="none" stroke="#110000" strokeWidth="4" />
    </svg>
  );
}

function Bucket({ role, foods, open, onOpen, onSee }: { role: Macro; foods: Food[]; open: boolean; onOpen: () => void; onSee: (f: Food) => void }) {
  const [hover, setHover] = useState<Food | null>(null);
  const big = foods.length > 8;
  const see = (f: Food) => {
    setHover(f);
    onSee(f);
  };
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-full max-w-[230px]" style={{ aspectRatio: "1 / 1" }} onMouseLeave={() => setHover(null)}>
        <PailBack />
        {/* the heap: first foods at the bottom, sunk below the rim */}
        <div className="absolute inset-x-[8%] bottom-[48%] z-10 flex flex-wrap-reverse content-start justify-center">
          {foods.map((f, i) => (
            <button
              type="button"
              key={f.id + i}
              aria-label={f.name}
              onMouseEnter={() => see(f)}
              onFocus={() => see(f)}
              onClick={() => see(f)}
              className={`group relative -mx-[2%] -mb-[6%] ${big ? "w-[27%]" : "w-[31%]"} cursor-help rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink`}
              style={{ zIndex: foods.length - i }}
            >
              <img
                src={f.img}
                alt=""
                className={`illus aspect-square w-full object-contain transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-110 ${hover?.id === f.id ? "-translate-y-1 scale-110" : ""}`}
                style={{ rotate: `${((i * 37) % 24) - 12}deg` }}
              />
            </button>
          ))}
        </div>
        <PailFront tint={open ? MACRO[role].color : null} />
        {/* label on the front of the pail */}
        <div className="pointer-events-none absolute inset-x-0 top-[66%] z-30 flex justify-center">
          {open ? (
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <RoleChip role={role} />
            </motion.span>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-porcelain font-display text-[18px] font-bold">?</span>
          )}
        </div>
        {/* name of the food under the pointer */}
        {hover && (
          <span className="pointer-events-none absolute left-1/2 top-[2%] z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[12.5px] font-semibold text-porcelain shadow-md">
            {hover.name}
          </span>
        )}
      </div>
      {open ? (
        <div className="mt-2 min-h-10" />
      ) : (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Show this bucket's name"
          className="mt-2 min-h-10 rounded-full border-2 border-ink bg-porcelain px-4 py-1.5 text-[13px] font-semibold hover:bg-ink hover:text-porcelain"
        >
          <span className="whitespace-nowrap">Show name</span>
        </button>
      )}
      <p className="mt-1.5 max-w-[24ch] text-[12.5px] leading-snug text-muted">{open ? BUCKET_LINE[role] : "What do these foods have in common?"}</p>
    </div>
  );
}

/** Slide visual: four buckets full of foods. Hover or tap a food to see its name; tap the button to see the bucket's name. Calls done once all four are named. */
export function FourBuckets({ onDone }: { onDone?: () => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const seen = useRef(new Set<string>());
  const n = Object.values(open).filter(Boolean).length;
  useEffect(() => {
    if (n >= 4) onDone?.();
  }, [n, onDone]);
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {BUCKETS.map((b) => (
          <Bucket
            key={b.role}
            role={b.role}
            foods={b.foods}
            open={!!open[b.role]}
            onSee={(f) => {
              const k = `${b.role}-${f.id}`;
              if (seen.current.has(k)) return;
              seen.current.add(k);
              track({ phase: "learn", screen: "p1-buckets", event_type: "hover", item_id: `food-${k}` });
            }}
            onOpen={() => {
              if (open[b.role]) return;
              setOpen((o) => ({ ...o, [b.role]: true }));
              track({ phase: "learn", screen: "p1-buckets", event_type: "reveal", item_id: `bucket-${b.role}` });
            }}
          />
        ))}
      </div>
      <p className="mt-5 text-[13px] text-muted">Hover over or tap a food to see what it is. When you have a guess, show the bucket&apos;s name ({n} of 4 named).</p>
    </div>
  );
}

/** Slide visual: foods that sit in several buckets. */
export function MultiRoleList() {
  const rows: { f: Food; roles: Macro[] }[] = [
    { f: FOODS.beans, roles: ["carb", "protein", "fiber"] },
    { f: FOODS.milk, roles: ["carb", "protein"] },
    { f: FOODS.salmon, roles: ["protein", "fat"] },
    { f: FOODS.pb, roles: ["protein", "fat"] },
  ];
  return (
    <div className="grid w-full gap-2.5">
      {rows.map((r) => (
        <div key={r.f.id} className="flex items-center gap-3 rounded-2xl bg-cream-2 p-2.5">
          <img src={r.f.img} alt="" className="illus h-12 w-12" />
          <span className="min-w-28 text-[14px] font-semibold">{r.f.name}</span>
          <span className="flex flex-wrap gap-1.5">
            {r.roles.map((x) => (
              <RoleChip key={x} role={x} size="sm" />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Slide visual: pairs from the same bucket that differ a lot. */
export function SameBucketPairs() {
  const pairs = [
    { a: FOODS.oatmeal, b: FOODS.soda, bucket: "Carbohydrate bucket", line: "Both are carbohydrate. Oatmeal also brings fiber and some protein; all of the soda's is added sugar." },
    { a: FOODS.greek, b: FOODS.regular, bucket: "Protein bucket", line: "Greek yogurt is strained, so it has about twice the protein of regular yogurt." },
    { a: FOODS.milk, b: FOODS.almondmilk, bucket: "Protein bucket", line: "Dairy milk is a real protein source; unsweetened almond milk is mostly water." },
  ];
  return (
    <div className="grid w-full gap-3">
      {pairs.map((p) => (
        <div key={p.a.id} className="rounded-2xl bg-cream-2 p-3">
          <p className="text-[11.5px] font-semibold text-muted">{p.bucket}</p>
          <div className="mt-1 flex items-center gap-2">
            <img src={p.a.img} alt={p.a.name} className="illus h-12 w-12" />
            <span className="text-[12px] font-semibold text-muted">vs</span>
            <img src={p.b.img} alt={p.b.name} className="illus h-12 w-12" />
            <p className="ml-1 text-[13px] leading-snug">{p.line}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniPail({ color, filled }: { color: string; filled: boolean }) {
  return (
    <svg viewBox="0 0 40 34" className="h-8 w-9" aria-hidden>
      <path d="M5 10 C 7 -2, 33 -2, 35 10" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".5" />
      <ellipse cx="20" cy="10" rx="16" ry="3.5" fill="#e9e3c4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10 A16 3.5 0 0 0 36 10 L32 31 Q20 34 8 31 Z" fill={filled ? color : "#fffdf4"} stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* Try: pack the buckets */
const PACK: { f: Food; roles: Macro[]; why: string }[] = [
  { f: FOODS.quinoa, roles: ["carb", "protein", "fiber"], why: "Quinoa is a grain that also brings protein and fiber." },
  { f: FOODS.cheese, roles: ["protein", "fat"], why: "Cheese brings protein and fat, almost no carbohydrate." },
  { f: FOODS.sweetpotato, roles: ["carb", "fiber"], why: "A starchy vegetable: carbohydrate with fiber." },
  { f: FOODS.almonds, roles: ["fat", "protein", "fiber"], why: "Nuts are mostly fat, with some protein and fiber." },
  { f: FOODS.edamame, roles: ["protein", "fiber", "carb"], why: "Soybeans: protein and fiber, plus some carbohydrate." },
  { f: FOODS.tortilla, roles: ["carb", "fiber"], why: "Corn tortillas are mostly carbohydrate, with a little fiber." },
];
const ALL: Macro[] = ["carb", "protein", "fat", "fiber"];

export function PackBuckets({ onDone }: { onDone: () => void }) {
  const [cur, setCur] = useState(0);
  const [picks, setPicks] = useState<Record<string, Macro[]>>({});
  const [checked, setChecked] = useState(false);
  const shownAt = useRef(performance.now());
  const item = PACK[cur];
  const mine = picks[item.f.id] ?? [];
  const allPicked = PACK.every((p) => (picks[p.f.id] ?? []).length > 0);

  function toggle(r: Macro) {
    if (checked) return;
    setPicks((p) => {
      const have = p[item.f.id] ?? [];
      return { ...p, [item.f.id]: have.includes(r) ? have.filter((x) => x !== r) : [...have, r] };
    });
  }

  function check() {
    setChecked(true);
    let right = 0;
    for (const p of PACK) {
      const m = picks[p.f.id] ?? [];
      const ok = p.roles.length === m.length && p.roles.every((r) => m.includes(r));
      if (ok) right++;
      track({ phase: "learn", screen: "p1-pack", event_type: "answer", item_id: `pack-${p.f.id}`, kc: "multi_roles", response: m, correct: ok, duration_ms: performance.now() - shownAt.current });
    }
    track({ phase: "learn", screen: "p1-pack", event_type: "section_complete", kc: "multi_roles", meta: { right, of: PACK.length } });
    onDone();
  }

  return (
    <div className="rounded-[28px] bg-tray p-6 sm:p-8">
      <p className="text-[15px] text-muted">Pick a food, then tap every bucket it belongs in. A food can go in more than one bucket.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {PACK.map((p, i) => {
          const n = (picks[p.f.id] ?? []).length;
          const ok = checked && p.roles.length === n && p.roles.every((r) => (picks[p.f.id] ?? []).includes(r));
          return (
            <button
              key={p.f.id}
              onClick={() => setCur(i)}
              aria-pressed={i === cur}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-[14px] font-semibold ${i === cur ? "border-ink bg-cream-2" : "border-line"}`}
            >
              <img src={p.f.img} alt="" className="illus h-9 w-9" />
              {p.f.name.replace(/, cooked$/, "")}
              {n > 0 && !checked && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-porcelain">{n}</span>}
              {checked && <span className={ok ? "text-ink" : "text-red"}>{ok ? "✓" : "✗"}</span>}
            </button>
          );
        })}
      </div>
      <p className="font-display mt-6 text-[20px] font-bold">Where does {item.f.name.replace(/, cooked$/, "").toLowerCase()} go?</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ALL.map((r) => {
          const on = mine.includes(r);
          const should = item.roles.includes(r);
          return (
            <button
              key={r}
              onClick={() => toggle(r)}
              aria-pressed={on}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-[15px] font-semibold transition-colors ${
                checked
                  ? should
                    ? "border-ink bg-cream-2"
                    : on
                      ? "border-red bg-[#fde9e1] line-through"
                      : "border-line opacity-50"
                  : on
                    ? "border-ink bg-cream-2"
                    : "border-line hover:border-ink"
              }`}
            >
              <MiniPail color={MACRO[r].color} filled={on || (checked && should)} />
              <span className="flex items-center gap-1">
                {MACRO[r].label}
                {checked && should && <span aria-label={on ? "you had this" : "you missed this"}>{on ? "✓" : "＋"}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {checked && (
        <div role="status" className="mt-4 rounded-2xl bg-cream-2 p-4">
          <p className="text-[15px] leading-relaxed">
            <strong>{item.f.name.replace(/, cooked$/, "")}:</strong> {item.why}
          </p>
          <p className="mt-3 text-[13px] font-semibold text-muted">
            All six foods ({PACK.filter((p) => { const m = picks[p.f.id] ?? []; return p.roles.length === m.length && p.roles.every((r) => m.includes(r)); }).length} of 6 exactly right). Tap any food above to see its answer.
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {PACK.map((p) => {
              const m = picks[p.f.id] ?? [];
              const ok = p.roles.length === m.length && p.roles.every((r) => m.includes(r));
              return (
                <li key={p.f.id} className="flex items-center gap-2 text-[13.5px]">
                  <img src={p.f.img} alt="" className="illus h-7 w-7" />
                  <span className="min-w-0 flex-1 truncate">{p.f.name.replace(/, cooked$/, "")}</span>
                  <span className="flex gap-1">
                    {p.roles.map((r) => (
                      <RoleChip key={r} role={r} size="sm" />
                    ))}
                  </span>
                  <span className={ok ? "text-ink" : "text-red"}>{ok ? "✓" : "✗"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!checked && (
        <button
          onClick={check}
          disabled={!allPicked}
          className="mt-6 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-porcelain hover:bg-red disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Check my buckets
        </button>
      )}
      {!checked && !allPicked && <p className="mt-2 text-[13px] text-muted">Give every food at least one bucket first.</p>}
    </div>
  );
}

/* ───────── Part 2: energy use ───────── */

const PARTS = [
  { t: "Basal metabolism", b: "Energy to keep you alive at rest: breathing, heartbeat, brain, staying warm. The biggest part for most people.", e: "Even while you sleep." },
  { t: "Activities of daily living", b: "Everyday movement that isn't a workout.", e: "Walking to class, stairs, carrying a backpack." },
  { t: "Purposeful exercise", b: "Activity you plan to do. Often a smaller part than students expect.", e: "Soccer practice, the gym, a run." },
];

export function ThreeParts({ onDone }: { onDone?: () => void }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const n = Object.values(open).filter(Boolean).length;
  useEffect(() => {
    if (n >= 3) onDone?.();
  }, [n, onDone]);
  return (
    <div className="grid w-full gap-3">
      {PARTS.map((p, i) => (
        <button
          key={p.t}
          onClick={() => {
            setOpen((o) => ({ ...o, [i]: !o[i] }));
            track({ phase: "learn", screen: "p2-parts", event_type: "reveal", item_id: `part-${i + 1}` });
          }}
          aria-expanded={!!open[i]}
          className={`flex items-start gap-4 rounded-2xl p-4 text-left transition-colors ${open[i] ? "bg-night text-porcelain" : "bg-cream-2 hover:bg-[#ece7c8]"}`}
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[17px] font-bold ${open[i] ? "bg-porcelain text-ink" : "bg-ink text-porcelain"}`}>{i + 1}</span>
          <span>
            <span className="block text-[16px] font-semibold">{p.t}</span>
            {open[i] ? (
              <>
                <span className="mt-1 block text-[14px] leading-relaxed opacity-90">{p.b}</span>
                <span className="mt-1 block text-[13px] italic opacity-70">e.g. {p.e}</span>
              </>
            ) : (
              <span className="mt-0.5 block text-[13px] text-muted">Tap to turn over</span>
            )}
          </span>
        </button>
      ))}
      <p className="text-[13px] text-muted">Digesting food uses a little energy too.</p>
    </div>
  );
}

export function NeedsCheck({ onDone }: { onDone?: () => void }) {
  const [pick, setPick] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const right = pick.length === 2 && pick.includes(1) && pick.includes(2);
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {[
          { d: "Tuesday", l: ["Classes most of the day", "Lots of sitting", "Short walk home"] },
          { d: "Saturday", l: ["Long hike with friends", "On your feet for hours", "Much more movement"] },
        ].map((x) => (
          <div key={x.d} className="rounded-2xl bg-cream-2 p-4">
            <p className="font-display text-[19px] font-bold">{x.d}</p>
            <ul className="mt-1 text-[13.5px] leading-relaxed text-muted">
              {x.l.map((y) => (
                <li key={y}>· {y}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] font-semibold">Which parts change between these two days? Pick any.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PARTS.map((p, i) => (
          <button
            key={p.t}
            disabled={done}
            onClick={() => setPick((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
            aria-pressed={pick.includes(i)}
            className={`rounded-full border px-3.5 py-1.5 text-[13.5px] ${pick.includes(i) ? "border-ink bg-ink text-porcelain" : "border-line"}`}
          >
            {done && (i === 1 || i === 2) ? "✓ " : ""}
            {p.t}
          </button>
        ))}
      </div>
      {!done ? (
        <button
          disabled={!pick.length}
          onClick={() => {
            setDone(true);
            track({ phase: "learn", screen: "p2-needs", event_type: "answer", item_id: "p2-needs", kc: "energy_use", response: pick, correct: right });
            onDone?.();
          }}
          className="mt-3 rounded-full bg-ink px-5 py-2 text-[14px] font-semibold text-porcelain disabled:bg-line disabled:text-muted"
        >
          Check
        </button>
      ) : (
        <p className="mt-3 text-[14.5px] leading-relaxed">
          <strong>{right ? "Right." : "Not quite."}</strong> Your basal metabolism stays about the same. Daily movement and exercise change, so needs differ from day to day and from
          person to person.
        </p>
      )}
    </div>
  );
}

/* ───────── Part 4: timing ───────── */

const HOURS = [8, 12, 16, 20];
const pos = (h: number) => ((h - 7) / (22.5 - 7)) * 100;

/** A day on a timeline: meals, classes, practice, and the long gap. */
export function DayTimeline({
  meals = [
    { t: "Breakfast", h: 8 },
    { t: "Lunch", h: 12.5 },
    { t: "Dinner", h: 19.5 },
  ],
  gap = { from: 12.5, to: 19.5, label: "7-hour gap with no food" },
  slots,
  onSlot,
  picked,
  answer,
}: {
  meals?: { t: string; h: number }[];
  gap?: { from: number; to: number; label: string } | null;
  slots?: { t: string; h: number }[];
  onSlot?: (t: string) => void;
  picked?: string | null;
  answer?: string;
}) {
  return (
    <div className="w-full select-none">
      <div className="relative h-44">
        {/* bands */}
        <div className="absolute top-[58%] h-6 rounded-md bg-cream-2 text-[11px] leading-6 text-muted" style={{ left: `${pos(9)}%`, width: `${pos(16) - pos(9)}%` }}>
          <span className="pl-2">Classes</span>
        </div>
        <div className="absolute top-[58%] h-6 rounded-md text-[11px] leading-6 text-white" style={{ left: `${pos(17)}%`, width: `${pos(19) - pos(17)}%`, background: "var(--protein)" }}>
          <span className="pl-2">Practice</span>
        </div>
        {gap && (
          <div className="absolute top-[78%] h-[3px] rounded-full bg-red" style={{ left: `${pos(gap.from)}%`, width: `${pos(gap.to) - pos(gap.from)}%` }}>
            <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap text-[11.5px] font-semibold text-red">{gap.label}</span>
          </div>
        )}
        {/* axis */}
        <div className="absolute inset-x-0 top-[45%] h-[2px] bg-ink" />
        {HOURS.map((h) => (
          <span key={h} className="absolute top-[47%] -translate-x-1/2 pt-1 text-[11px] text-muted" style={{ left: `${pos(h)}%` }}>
            {h === 12 ? "noon" : h < 12 ? `${h} am` : `${h - 12} pm`}
          </span>
        ))}
        {meals.map((m) => (
          <div key={m.t} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${pos(m.h)}%` }}>
            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-porcelain">{m.t}</span>
            <span className="h-[52px] w-[2px] bg-ink" />
          </div>
        ))}
        {slots?.map((s) => {
          const on = picked === s.t;
          const isAns = picked && s.t === answer;
          return (
            <button
              key={s.t}
              onClick={() => onSlot?.(s.t)}
              disabled={!!picked}
              className={`absolute top-[22%] -translate-x-1/2 whitespace-nowrap rounded-full border-2 px-2 py-0.5 text-[11.5px] font-semibold ${
                isAns ? "border-ink bg-ink text-porcelain" : on ? "border-red bg-[#fde9e1]" : "border-red bg-porcelain text-red hover:bg-red hover:text-porcelain"
              }`}
              style={{ left: `${pos(s.h)}%` }}
            >
              {s.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function JamieSnack({ onDone }: { onDone: () => void }) {
  const [pick, setPick] = useState<string | null>(null);
  const shownAt = useRef(performance.now());
  const answer = "3:30 pm";
  const why: Record<string, string> = {
    "10:00 am": "Breakfast at 8 and lunch at 12:30 are only 4½ hours apart, so a morning snack is optional.",
    "3:30 pm": "Lunch at 12:30 and dinner at 7:30 leave seven hours, with practice in the middle. A snack at 3:30 fuels practice.",
    "6:00 pm": "That's in the middle of practice. Eating before practice helps more than during it.",
    "9:30 pm": "Dinner at 7:30 already covers the evening. The long gap is in the afternoon.",
  };
  return (
    <div className="rounded-[28px] bg-tray p-6 sm:p-8">
      <p className="text-[16px] leading-relaxed">
        Jamie&rsquo;s day: breakfast 8:00, lunch 12:30, practice 5:00–7:00, dinner 7:30. Where would a snack help Jamie most? Tap a time.
      </p>
      <div className="mt-4">
        <DayTimeline
          gap={pick ? undefined : null}
          slots={[
            { t: "10:00 am", h: 10 },
            { t: "3:30 pm", h: 15.5 },
            { t: "6:00 pm", h: 18 },
            { t: "9:30 pm", h: 21 },
          ]}
          picked={pick}
          answer={answer}
          onSlot={(t) => {
            setPick(t);
            track({ phase: "learn", screen: "p4-jamie", event_type: "answer", item_id: "p4-jamie", kc: "snack_pairing", response: t, correct: t === answer, duration_ms: performance.now() - shownAt.current });
            onDone();
          }}
        />
      </div>
      {pick && (
        <div className={`mt-3 rounded-2xl p-4 text-[15px] leading-relaxed ${pick === answer ? "bg-cream-2" : "bg-[#fde9e1]"}`}>
          <p className="font-semibold">{pick === answer ? "That's right." : "Not quite. The best time is 3:30 pm."}</p>
          <p className="mt-1">{why[pick]}</p>
          {pick !== answer && <p className="mt-1">{why[answer]}</p>}
          <p className="mt-1 text-muted">Carbohydrate with a little protein, like a banana and a spoon of peanut butter, is easy to digest before practice.</p>
        </div>
      )}
    </div>
  );
}

export function GapAdvice() {
  return (
    <div className="grid w-full gap-3">
      <div className="rounded-2xl bg-cream-2 p-4">
        <p className="text-[13px] font-semibold">Start with</p>
        <ul className="mt-2 grid gap-1.5 text-[14px]">
          {[
            ["Yogurt + a banana", "/food/yogurt.webp"],
            ["A turkey sandwich", "/food/bread.webp"],
            ["Crackers + a cheese stick", "/food/crackers.webp"],
            ["A granola bar + milk", "/food/granola-bar.webp"],
          ].map(([t, img]) => (
            <li key={t} className="flex items-center gap-2">
              <img src={img} alt="" className="illus h-8 w-8" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-[#fde9e1] p-4">
        <p className="text-[13px] font-semibold text-red">Not as a first fix</p>
        <ul className="mt-1 text-[14px] leading-relaxed">
          <li>A huge meal, eaten fast</li>
          <li>Only a soda, candy, or an energy drink</li>
        </ul>
      </div>
    </div>
  );
}

export function WhenYouEat() {
  const rows = [
    { t: "Long gap ahead", b: "Something with staying power: carbohydrate plus protein or fiber.", e: "Apple + Greek yogurt before a 3-hour lab", img: ["/food/apple.webp", "/food/yogurt.webp"] },
    { t: "Practice in 1–3 hours", b: "A snack that's easy to digest: mostly carbohydrate, a little protein. Skip a big, heavy meal right before.", e: "Banana + a spoon of peanut butter", img: ["/food/banana.webp", "/food/peanut-butter.webp"] },
    { t: "After practice", b: "A meal with carbohydrate and protein. Don't skip the next meal to “make up” for anything.", e: "Rice bowl with chicken and vegetables", img: ["/food/rice.webp", "/food/chicken.webp"] },
  ];
  return (
    <div className="grid w-full gap-3">
      {rows.map((r) => (
        <div key={r.t} className="flex gap-3 rounded-2xl bg-cream-2 p-4">
          <div className="flex shrink-0 -space-x-3">
            {r.img.map((s) => (
              <img key={s} src={s} alt="" className="illus h-11 w-11" />
            ))}
          </div>
          <div>
            <p className="text-[15px] font-semibold">{r.t}</p>
            <p className="text-[13.5px] leading-relaxed">{r.b}</p>
            <p className="mt-0.5 text-[12.5px] italic text-muted">e.g. {r.e}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FourQuestions({ items }: { items: { q: string; a: string }[] }) {
  return (
    <ol className="grid w-full gap-2.5">
      {items.map((x, i) => (
        <li key={x.q} className="flex gap-3 rounded-2xl bg-cream-2 p-3.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-display text-[15px] font-bold text-porcelain">{i + 1}</span>
          <p className="text-[14.5px] leading-relaxed">
            <strong>{x.q}</strong> {x.a}
          </p>
        </li>
      ))}
    </ol>
  );
}
