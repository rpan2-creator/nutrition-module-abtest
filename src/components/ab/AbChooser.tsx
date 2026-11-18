"use client";

import Link from "next/link";
import { VERSIONS } from "./version";
import { FIXED_VERSION } from "@/lib/session";

/**
 * Home-page section that shows the A/B study at a glance: the one step that differs,
 * drawn as it appears in the module, with a start link for each version and one
 * for random assignment.
 */
export function AbChooser() {
  if (FIXED_VERSION) return <FixedVersion v={FIXED_VERSION} />;
  return (
    <section id="versions" className="bg-porcelain">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <p className="text-[15px] font-semibold text-red">A/B study</p>
        <h2 className="font-display mt-2 max-w-[16ch] text-[clamp(36px,5vw,64px)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          Two versions, one difference
        </h2>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-muted">
          Both versions have the same lessons, pictures, practice and feedback, and the same pre-check and post-check. They differ only in the step that
          follows the main task in each of the four chapters.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Version A */}
          <article className="flex flex-col rounded-[30px] p-6 sm:p-8" style={{ background: VERSIONS.A.bg, color: VERSIONS.A.fg }}>
            <p className="font-display text-[44px] font-extrabold leading-none">Version A</p>
            <p className="mt-1 text-[18px] font-semibold">{VERSIONS.A.tag}</p>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed opacity-80">{VERSIONS.A.long}</p>
            <div className="mt-6 rounded-2xl bg-[#fdfbee] p-5 text-ink" aria-label="What version A looks like">
              <p className="text-[12px] font-semibold text-red">Key point</p>
              <p className="mt-1 text-[15px] leading-relaxed">
                Plate B was cooked in about 2 tbsp of oil (one thumb). Fat has 9 kcal per gram, so that&rsquo;s about 240 extra kcal you can&rsquo;t see.
              </p>
              <span className="mt-3 inline-block rounded-full bg-ink px-4 py-1.5 text-[13px] font-semibold text-[#fdfbee]">Continue</span>
            </div>
            <div className="mt-auto pt-7">
              <Link href="/start?v=A" className="inline-flex rounded-full bg-[#fdfbee] px-6 py-3 text-[15px] font-semibold text-ink transition-transform hover:scale-[1.03]">
                Start Version A
              </Link>
            </div>
          </article>

          {/* Version B */}
          <article className="flex flex-col rounded-[30px] p-6 sm:p-8" style={{ background: VERSIONS.B.bg, color: VERSIONS.B.fg }}>
            <p className="font-display text-[44px] font-extrabold leading-none">Version B</p>
            <p className="mt-1 text-[18px] font-semibold">{VERSIONS.B.tag}</p>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed opacity-85">{VERSIONS.B.long}</p>
            <div className="mt-6 grid gap-2.5 rounded-2xl bg-[#fdfbee] p-5 text-ink" aria-label="What version B looks like">
              <p className="text-[12px] font-semibold text-red">1 · Write one sentence</p>
              <p className="rounded-xl border border-line bg-white px-3 py-2 text-[14px] text-muted">
                Plate B has oil, and oil is fat, so it adds a lot of energy…
              </p>
              <p className="text-[12px] font-semibold text-red">2 · Compare with the model answer</p>
              <p className="rounded-xl bg-cream-2 px-3 py-2 text-[14px] leading-relaxed">
                Plate B was cooked in about 2 tbsp of oil (one thumb). Fat has 9 kcal per gram, so that&rsquo;s about 240 extra kcal you can&rsquo;t see.
              </p>
              <p className="text-[12px] font-semibold text-red">3 · Check your own sentence</p>
              <ul className="grid gap-1 text-[13.5px]">
                <li>☑ Did mine name the food or the amount?</li>
                <li>☑ Did mine name its nutritional role?</li>
                <li>☐ Did mine say why it matters here?</li>
              </ul>
            </div>
            <div className="mt-auto pt-7">
              <Link href="/start?v=B" className="inline-flex rounded-full bg-[#fdfbee] px-6 py-3 text-[15px] font-semibold text-red transition-transform hover:scale-[1.03]">
                Start Version B
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-[26px] bg-cream-2 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[60ch] text-[15px] leading-relaxed">
            <strong>Taking part in the study?</strong> Let the site assign your version. It places each new learner in whichever version has fewer people so far.
          </p>
          <Link href="/start" className="inline-flex shrink-0 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-[#fdfbee] hover:bg-red">
            Start with a random version
          </Link>
        </div>
      </div>
    </section>
  );
}

/** On the single-version sites: say which version this is and what the other one does. */
function FixedVersion({ v }: { v: "A" | "B" }) {
  const info = VERSIONS[v];
  const other = VERSIONS[v === "A" ? "B" : "A"];
  return (
    <section id="versions" className="bg-porcelain">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <p className="text-[15px] font-semibold text-red">A/B study</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-stretch">
          <div className="rounded-[30px] p-7 sm:p-9" style={{ background: info.bg, color: info.fg }}>
            <p className="text-[15px] opacity-80">This site is</p>
            <p className="font-display mt-1 text-[clamp(52px,8vw,88px)] font-extrabold leading-[0.9]">{info.name}</p>
            <p className="mt-2 text-[20px] font-semibold">{info.tag}</p>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed opacity-85">{info.long}</p>
            <Link href="/start" className="mt-7 inline-flex rounded-full bg-[#fdfbee] px-6 py-3 text-[15px] font-semibold transition-transform hover:scale-[1.03]" style={{ color: info.bg }}>
              Start {info.name}
            </Link>
          </div>
          <div className="flex flex-col justify-between rounded-[30px] bg-cream-2 p-7">
            <div>
              <p className="font-semibold">The same in both versions</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">Lessons, pictures, practice tasks and feedback, and the pre-check and post-check.</p>
            </div>
            <div className="mt-6">
              <p className="font-semibold">The other version</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">
                {other.name}: {other.short}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
