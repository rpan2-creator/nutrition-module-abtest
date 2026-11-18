"use client";

import { FOODS } from "@/content/foods";
import type { Condition } from "@/lib/session";
import { AutoDone, Illus, Note, RoleChip, Sequence, Slide, Term } from "./kit";
import { PredictPairs, RoleTagger, SortBins } from "./cards";
import { CardWheel } from "./wheel";
import { ExplainStep } from "./explain";
import { BmiScale, Estimator, HandCards, OilPlates, PlateBuilder, PlateModelVisual, PortionCounter, SnackMatch, TdeeBar } from "./activities";
import { Explain, Practice } from "./Practice";
import { motion } from "framer-motion";
import { DayTimeline, FourBuckets, FourQuestions, GapAdvice, JamieSnack, MultiRoleList, NeedsCheck, PackBuckets, SameBucketPairs, Sources, SRC, ThreeParts, WhenYouEat } from "./v2";

export interface Lesson {
  id: string;
  chapter: number;
  title: string;
  /** Label in the lesson index. */
  short: string;
  minutes: number;
  slides: Slide[];
  /** The "Try it" activity. Call onDone when the learner has completed it. */
  Try: (p: { condition: Condition; onDone: () => void }) => React.ReactNode;
  tryTitle: string;
}

export const CHAPTERS = ["Part 1 · What's in your food?", "Part 2 · What your body uses", "Part 3 · How much matters", "Part 4 · Put it together", "Take it with you"];

function Cluster({ ids, size = "h-24 w-24" }: { ids: string[]; size?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-1">
      {ids.map((id, i) => (
        <Illus key={id} src={`/food/${id}.webp`} className={size} bob delay={i * 0.6} />
      ))}
    </div>
  );
}

function KcalBars() {
  const rows = [
    { l: "Carbohydrate", v: 4, c: "var(--carb)" },
    { l: "Protein", v: 4, c: "var(--protein)" },
    { l: "Fat", v: 9, c: "var(--fat)" },
  ];
  return (
    <div className="w-full max-w-sm">
      {rows.map((r, i) => (
        <div key={r.l} className="mb-3 grid grid-cols-[110px_1fr_60px] items-center gap-3">
          <span className="text-[14px] font-semibold">{r.l}</span>
          <motion.span className="h-9 rounded-r-xl" style={{ background: r.c }} initial={{ width: 0 }} animate={{ width: `${(r.v / 9) * 100}%` }} transition={{ delay: 0.2 + i * 0.25, duration: 0.6 }} />
          <span className="font-display text-[24px] font-extrabold">{r.v}</span>
        </div>
      ))}
      <p className="text-[13px] text-muted">kcal per gram</p>
    </div>
  );
}

function Compare({ a, b, label }: { a: { img: string; t: string; v: string }; b: { img: string; t: string; v: string }; label: string }) {
  return (
    <div className="w-full">
      <p className="mb-3 text-center text-[13px] font-semibold text-muted">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        {[a, b].map((x) => (
          <div key={x.t} className="rounded-[22px] bg-cream-2 p-4 text-center">
            <img src={x.img} alt="" className="illus mx-auto h-24 w-24" />
            <p className="mt-2 text-[14px] font-semibold leading-tight">{x.t}</p>
            <p className="font-display mt-1 text-[26px] font-extrabold">{x.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const LESSONS: Lesson[] = [
  /* ───────── Part 1 · What's in your food? ───────── */
  {
    id: "1.1-buckets",
    short: "The four food buckets",
    chapter: 0,
    title: "The four food buckets",
    minutes: 4,
    slides: [
      {
        title: "Four buckets of food. What does each bucket have in common?",
        wide: true,
        gate: "Open all four buckets to continue",
        body: (
          <>
            <Note>
              Part 1 asks: <em>what does this food provide?</em>
            </Note>
            <p className="mt-4">
              Carbohydrate, protein, and fat are the <strong>macronutrients</strong>: nutrients you eat in large amounts, and all three give you energy. Fiber comes with plant
              foods and plays its own role. Look inside each bucket and guess what the foods share, then hover over or tap the bucket to see its name.
            </p>
          </>
        ),
        visual: (done) => <FourBuckets onDone={done} />,
      },
      {
        title: "Many foods play more than one role",
        body: (
          <>
            <p>
              Some foods sit in several buckets at once. Black beans are a carbohydrate, a protein, <em>and</em> a fiber source. Milk brings carbohydrate and protein. Salmon
              brings protein and fat. Peanut butter is shelved with protein foods, but most of its energy comes from fat.
            </p>
            <Note>The question isn&rsquo;t &ldquo;is this food a protein?&rdquo; but &ldquo;which roles does it play, and how much?&rdquo;</Note>
          </>
        ),
        visual: <MultiRoleList />,
      },
      {
        title: "Same bucket, very different foods",
        body: (
          <>
            <p>Foods in the same bucket can still be very different. The name and the shelf don&rsquo;t tell you everything; the label does.</p>
            <Note>Check &ldquo;Protein&rdquo; and &ldquo;Added sugars&rdquo; on a label when the difference matters to you.</Note>
            <Sources items={[SRC.carbs, SRC.protein, SRC.fats, SRC.fiber]} />
          </>
        ),
        visual: <SameBucketPairs />,
      },
    ],
    tryTitle: "Pack the buckets",
    Try: ({ condition, onDone }) => (
      <Sequence
        onDone={onDone}
        first={(done) => <PackBuckets onDone={done} />}
        second={(done) => (
          <ExplainStep
            id="part1-explain"
            kc="multi_roles"
            condition={condition}
            prompt="Pick a food with more than one role. Why does that matter when building a meal?"
            chain="a food → the roles it plays → what that means for a meal"
            placeholder="Black beans give … so …"
            model="Black beans give carbohydrate, protein and fiber, so one scoop can add a protein source to a plate that's mostly starch."
            onDone={done}
          />
        )}
      />
    ),
  },
  {
    id: "1.2-energy",
    short: "Energy in food",
    chapter: 0,
    title: "Energy in food",
    minutes: 3,
    slides: [
      {
        title: "Fat carries more than twice the energy per gram",
        body: (
          <>
            <p>
              A <strong>calorie (kcal)</strong> is a unit of food energy. Carbohydrate and protein give about 4 kcal per gram; fat gives about 9.
            </p>
            <Note>
              <strong>Worked example:</strong> a granola bar with 29 g carbohydrate, 4 g protein, and 7 g fat → 29 × 4 + 4 × 4 + 7 × 9 = 116 + 16 + 63 ≈ 195 kcal.
            </Note>
            <Sources items={[SRC.fats]} />
          </>
        ),
        visual: <KcalBars />,
      },
      {
        title: "Energy density: a lot in a little",
        body: (
          <>
            <Term word="Energy density">How much energy a food packs into its size. Oil and nuts are high; vegetables and fruit are low.</Term>
            <p className="mt-3">
              One tablespoon of olive oil (120 kcal) has more energy than two whole cups of spinach (14 kcal). Healthy fats are worth eating; just know the amount.
            </p>
          </>
        ),
        visual: (
          <Compare label="Energy per portion" a={{ img: "/food/olive-oil.webp", t: "Olive oil, 1 tbsp", v: "120 kcal" }} b={{ img: "/food/spinach.webp", t: "Spinach, 2 cups", v: "14 kcal" }} />
        ),
      },
    ],
    tryTitle: "Work out the energy",
    Try: ({ onDone }) => (
      <Practice
        onDone={onDone}
        item={{
          id: "1.2-check",
          kc: "energy_calc",
          prompt: "A snack has 12 g carbohydrate, 3 g protein, and 8 g fat. About how much energy is that?",
          options: [
            { id: "a", text: "About 92 kcal" },
            { id: "b", text: "About 132 kcal" },
            { id: "c", text: "About 207 kcal" },
            { id: "d", text: "About 23 kcal" },
          ],
          correct: "b",
          explain: "12 × 4 + 3 × 4 + 8 × 9 = 48 + 12 + 72 = 132 kcal. More than half of it comes from the 8 g of fat.",
        }}
      />
    ),
  },

  /* ───────── Part 2 · What your body uses ───────── */
  {
    id: "2.1-energy-use",
    short: "Your body uses energy all day",
    chapter: 1,
    title: "Your body uses energy all day",
    minutes: 5,
    slides: [
      {
        title: "Your day's energy has three parts",
        gate: "Turn over all three cards to continue",
        body: (
          <>
            <Note>
              Part 1 asked <em>what does this food provide?</em> Part 2 asks <em>why can the amount you need change?</em>
            </Note>
            <p className="mt-4">Your body uses energy all day, not only during exercise. Dietitians often describe it in three parts. Tap each card.</p>
          </>
        ),
        visual: (done) => <ThreeParts onDone={done} />,
      },
      {
        title: "Needs are not fixed",
        gate: "Check your answer to continue",
        body: (
          <p>
            Tuesday: classes most of the day and a short walk home. Saturday: a long hike with friends. Your energy needs on these two days aren&rsquo;t the same. Which parts of
            energy use change?
          </p>
        ),
        visual: (done) => <NeedsCheck onDone={done} />,
      },
      {
        title: "Steady beats strict",
        body: (
          <>
            <p>Eating more energy than you use over weeks tends to raise body weight; less tends to lower it. One meal or one day matters much less than the pattern.</p>
            <Note tone="warn">
              Cutting calories hard usually backfires: low energy, trouble focusing in class, and strong hunger later. Slow, steady changes are more likely to last. Personal
              targets are a conversation for a Registered Dietitian.
            </Note>
            <Sources items={[SRC.weight, SRC.portions]} />
          </>
        ),
        visual: <Cluster ids={["apple", "granola-bar", "crackers"]} size="h-28 w-28" />,
      },
    ],
    tryTitle: "Why might Maya need more on Tuesday?",
    Try: ({ condition, onDone }) => (
      <Sequence
        onDone={onDone}
        first={(done) => (
          <Practice
            onDone={done}
            item={{
              id: "2.1-maya",
              kc: "energy_use",
              prompt:
                "Maya has the same classes on Monday and Tuesday. On Tuesday she also has a two-hour soccer practice. Which part of her energy use is most different on Tuesday?",
              options: [
                { id: "a", text: "Basal metabolism — it doubles on practice days" },
                { id: "b", text: "Purposeful exercise — the practice adds energy use" },
                { id: "c", text: "None — energy use is the same every day" },
                { id: "d", text: "Digesting food — it is the biggest part" },
              ],
              correct: "b",
              explain: "Her basal metabolism and daily walking are about the same both days. The two-hour practice is purposeful exercise, so Tuesday uses more energy.",
            }}
          />
        )}
        second={(done) => (
          <ExplainStep
            id="part2-explain"
            kc="energy_use"
            condition={condition}
            prompt="In one sentence: why might Maya need more food on Tuesday, and when would it help most?"
            chain="what changes → which part of energy use → what it means for her food"
            placeholder="Tuesday adds … so …"
            model="Tuesday adds two hours of purposeful exercise, so Maya uses more energy that day; a bigger lunch or a snack a few hours before practice would help her keep up."
            onDone={done}
          />
        )}
      />
    ),
  },

  /* ───────── Part 3 · How much matters ───────── */
  {
    id: "3.1-hands",
    short: "Your hand is a measuring tool",
    chapter: 2,
    title: "Your hand is a measuring tool",
    minutes: 3,
    slides: [
      {
        title: "Four hand measures",
        gate: "Open all four hand cards to continue",
        body: (
          <>
            <Note>
              So far: <em>what does a food provide?</em> and <em>why do needs change?</em> Part 3 asks <em>about how much is there?</em>
            </Note>
            <p className="mt-4">
              Counting calories is easy on a package and hard in a dining hall. Your hand is always with you. These are rough references, not how much you should eat. Tap
              each card.
            </p>
            <p className="mt-3 text-[15px] text-muted">Hand sizes differ. Compare your fist with a measuring cup once, so you know what yours means.</p>
          </>
        ),
        visual: (done) => <HandCards onDone={done} />,
      },
    ],
    tryTitle: "Size these portions with your hand",
    Try: ({ onDone }) => <PortionCounter onDone={onDone} />,
  },
  {
    id: "3.2-hidden",
    short: "The energy you can't see",
    chapter: 2,
    title: "The energy you can't see",
    minutes: 2,
    slides: [
      {
        title: "Small additions, big energy",
        body: (
          <>
            <p>Oil, butter, dressing, and sauces barely change how a plate looks, but they can add hundreds of calories. One thumb of oil (2 tbsp) ≈ 240 kcal.</p>
            <Note>When you estimate a plate, ask: was it cooked in or topped with fat?</Note>
          </>
        ),
        visual: <Cluster ids={["olive-oil", "peanut-butter", "avocado"]} size="h-28 w-28" />,
      },
    ],
    tryTitle: "Two plates that look alike",
    Try: ({ condition, onDone }) => (
      <Sequence
        onDone={onDone}
        first={(done) => <OilPlates condition="predict" onDone={done} />}
        second={(done) => (
          <ExplainStep
            id="part3-explain"
            kc="energy_density"
            condition={condition}
            prompt="Why does plate B have more energy when it looks the same?"
            chain="what's different → which nutrient → how much energy it adds"
            placeholder="Plate B was cooked in … and fat …"
            model="Plate B was cooked in about two thumbs of oil. Fat has 9 kcal per gram, so that's about 240 extra kcal you can't see."
            onDone={done}
          />
        )}
      />
    ),
  },

  /* ───────── Part 4 · Put it together ───────── */
  {
    id: "4.1-day",
    short: "A day of eating",
    chapter: 3,
    title: "A day of eating",
    minutes: 4,
    slides: [
      {
        title: "Eat regularly through the day",
        wide: true,
        body: (
          <>
            <Note>
              You can now ask what a food provides, why needs change, and how much is there. Part 4 puts it together, starting with <em>when</em> you eat.
            </Note>
            <p className="mt-4">
              Many people do well eating about 3–4 times a day, roughly every 4 hours. Long gaps tend to leave you low on energy in class and very hungry later, which makes
              overeating at night more likely.
            </p>
            <p className="mt-3">Skipping breakfast doesn&rsquo;t help a muscle-gain goal either. Your classes, activity, and hunger can shift the schedule.</p>
            <Sources items={[SRC.portions, SRC.breakfast]} />
          </>
        ),
        visual: <DayTimeline />,
      },
      {
        title: "Haven't eaten in a while?",
        body: (
          <>
            <p>
              Sometimes the gap happens anyway: you slept through breakfast, a lab ran long, and now it&rsquo;s 3 pm and your stomach is empty. Eat something now instead of
              holding out for dinner. Start with a moderate portion of a carbohydrate with some protein, eat it slowly, then have your next meal at its usual time.
            </p>
            <Note tone="warn">
              Two things tend to backfire: a huge, heavy meal eaten fast, and only a sugary drink or candy. Very hungry is also when overeating is most likely.
            </Note>
            <Sources items={[SRC.portions]} />
          </>
        ),
        visual: <GapAdvice />,
      },
      {
        title: "When you eat changes what helps",
        body: (
          <>
            <p>The same food can be a good or a weak choice depending on what comes next.</p>
            <Sources items={[SRC.timing]} />
          </>
        ),
        visual: <WhenYouEat />,
      },
    ],
    tryTitle: "Plan around a busy day",
    Try: ({ onDone }) => <JamieSnack onDone={onDone} />,
  },
  {
    id: "4.2-plate",
    short: "Fix a plate for the situation",
    chapter: 3,
    title: "Fix a plate for the situation",
    minutes: 5,
    slides: [
      {
        title: "A plate as a reference, not a rule",
        body: (
          <>
            <p>
              The Harvard Healthy Eating Plate suggests about half vegetables and fruit, a quarter whole grains, a quarter protein, plus some healthy fat. Athletes, people with
              health conditions, and different goals may need different proportions.
            </p>
            <Sources items={[SRC.plate]} />
          </>
        ),
        visual: <PlateModelVisual />,
      },
      {
        title: "Four questions, worked on a quick breakfast",
        body: (
          <>
            <p>Toast and a banana at 8:00, then classes until 12:30.</p>
            <Note>Three ways to change a plate: add what&rsquo;s missing, swap within a role, adjust an amount before removing a food.</Note>
          </>
        ),
        visual: (
          <FourQuestions
            items={[
              { q: "What's there?", a: "Mostly carbohydrate, some fiber." },
              { q: "How much?", a: "A fairly small meal." },
              { q: "What's the situation?", a: "4½ hours of class, no break to eat." },
              { q: "What could I change?", a: "Add Greek yogurt or an egg for protein, so breakfast lasts longer." },
            ]}
          />
        ),
      },
    ],
    tryTitle: "Fix a pasta lunch before practice",
    Try: ({ condition, onDone }) => (
      <Sequence
        onDone={onDone}
        first={(done) => <PlateBuilder onDone={done} />}
        second={(done) => (
          <ExplainStep
            id="part4-explain"
            kc="causal_justification"
            condition={condition}
            prompt="Explain one change you made to the pasta lunch."
            chain="the change → its nutritional role → why it helps before practice"
            placeholder="Adding … gives the meal … which …"
            model="Adding a palm of chicken gives the meal the protein it lacked; keeping the pasta gives carbohydrate for practice later."
            onDone={done}
          />
        )}
      />
    ),
  },
  {
    id: "4.3-snack",
    short: "Build a balanced snack",
    chapter: 3,
    title: "Build a balanced snack",
    minutes: 3,
    slides: [
      {
        title: "Pair a carbohydrate with a protein",
        body: (
          <>
            <p>
              One simple way to build a more filling snack: <strong>pair a carbohydrate with a protein.</strong> Carbohydrate gives quick energy; protein, fat, and fiber slow
              digestion, so the snack lasts longer.
            </p>
          </>
        ),
        visual: (
          <div className="flex items-center gap-2">
            <Illus src="/food/apple.webp" className="h-28 w-28" bob />
            <span className="font-display text-[40px] font-bold">+</span>
            <Illus src="/food/peanut-butter.webp" className="h-28 w-28" bob delay={1} />
          </div>
        ),
      },
    ],
    tryTitle: "Complete three snacks",
    Try: ({ onDone }) => (
      <div>
        <p className="mb-4 text-[16px] leading-relaxed text-muted">
          It&rsquo;s 2 pm. You have class until 4 and practice at 5. Look at what each snack already has, then add the missing role.
        </p>
        <SnackMatch onDone={onDone} />
      </div>
    ),
  },

  /* ───────── Take it with you ───────── */
  {
    id: "5.1-checklist",
    short: "A checklist for any meal",
    chapter: 4,
    title: "A checklist for any meal",
    minutes: 2,
    slides: [
      {
        title: "Four questions you can ask anywhere",
        body: (
          <Note>
            This is general nutrition education, not individual medical or dietary advice. Personal needs differ. A Registered Dietitian can give you individual guidance.
          </Note>
        ),
        visual: (
          <FourQuestions
            items={[
              { q: "What does it provide?", a: "Carbohydrate, protein, fat, fiber — often more than one." },
              { q: "About how much is there?", a: "Use labels, visual comparisons, or hand references when helpful." },
              { q: "What does the situation call for?", a: "Timing, activity, what you've already eaten, and what's available." },
              { q: "What is one reasonable adjustment?", a: "Add, swap, or adjust an amount, rather than cutting a food out completely." },
            ]}
          />
        ),
      },
    ],
    tryTitle: "One new situation",
    Try: ({ onDone }) => (
      <Practice
        onDone={onDone}
        item={{
          id: "5.1-transfer",
          kc: "transfer",
          prompt:
            "Lee eats a bowl of oatmeal with milk at 7:00, then has a 4-hour lab before lunch at 12:00, with no break to buy food. What is one reasonable adjustment?",
          options: [
            { id: "a", text: "Skip breakfast so lunch feels bigger" },
            { id: "b", text: "Pack a snack, like an apple and a cheese stick, for mid-morning" },
            { id: "c", text: "Drink extra coffee instead of eating" },
            { id: "d", text: "Nothing — a 5-hour gap is always fine" },
          ],
          correct: "b",
          explain:
            "Breakfast is fine, but five hours with a lab in between is a long gap. A packed snack with carbohydrate and protein keeps energy steady until lunch. Skipping or replacing food with coffee makes the gap worse.",
        }}
      />
    ),
  },
];
