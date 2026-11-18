# What's in your bowl? · A/B study version

This is the SD5 A/B study build of the nutrition module. Content, interactions and lesson structure are the same as the main site; only the study design differs.

## Study design

- **Question:** does writing a self-explanation and comparing it with a model explanation, added to the same interactive practice, improve learning and transfer?
- **Version A (control):** after each chapter's main task, the learner reads a "Key point" card with the model explanation.
- **Version B (innovative principle):** after the same task, the learner writes one sentence (food or amount → role → why it helps here), then sees the same model explanation and ticks a three-item self-check.
- **One explanation step per chapter:** 1.1 role tagging · 2.1 Sam's energy use · 3.2 two plates that look alike · 4.1 fix the pasta lunch. The snack lesson has no explanation step in either version.
- **Held constant:** slides, images, practice tasks and feedback, model explanation text, predict-first activities for everyone, identical pre-check (form A) and post-check (form B) in both versions, gating.
- **Measures:** pre/post score and gain, transfer item A13/B13 (a situation not practiced in the module), written item A12/B12 (reported separately), time on each step, written explanations and self-check ticks.
- **Assignment:** after consent on /start, each learner goes to the version with fewer participants so far (coin flip on a tie). Testers can force a version with `?v=A` or `?v=B` on the link, e.g. `/start?v=B`. Team preview: `?preview=1`.
- **Data:** tables `ab_participants` and `ab_events` (see `supabase/schema.sql`), separate from the earlier study. Dashboard at `/admin`.

---

# What's in your bowl? — a practical nutrition learning module

Team 10's e-learning unit: a 10-minute pre-check, a 30-minute learning module, and a 10-minute post-check, with every answer, click, and time-on-screen recorded for analysis.

## Flow

| Page | What happens |
| --- | --- |
| `/` | Scroll-driven hero: a bowl opens into its ingredients, each labelled by nutritional role |
| `/start` | Consent + one background question. Assigns an anonymous ID, and a version (`A` / `B`). Pre-check is always form A, post-check always form B |
| `/pre` | Form A or B, one question per screen, no feedback |
| `/learn` | 4 parts, 14 screens: nutrients & energy · daily energy use (BMR/TDEE/BMI) · portions by hand · adjusting plates & snacks |
| `/post` | The other form |
| `/done` | Pre vs post score and explanations |
| `/admin` | Password-protected dashboard + CSV export |

**Conditions.** In `predict`, learners guess before seeing the answer (bowl roles, yogurt/milk protein, two oil plates). In `told`, they see the answer first. This is the innovative-principle comparison for Milestone 4 B5.

Content lives in `src/content/tests.ts` (test items, tagged by knowledge component) and `src/components/module/Part1–4.tsx` (module screens).

## Setup

1. **Supabase**: Vercel → Project → Storage → Connect → Supabase (or create a project at supabase.com and add the env vars yourself). Then Supabase → SQL Editor → run `supabase/schema.sql`.
2. **Vercel env vars**: `ADMIN_PASSWORD`, and optionally `NEXT_PUBLIC_POSTHOG_KEY`. See `.env.example`.
3. Redeploy.

Without Supabase the site still works; nothing is saved.

## Data

- `participants`: condition, test order, background, pre/post scores, completion times.
- `events`: one row per interaction — `phase`, `screen`, `event_type` (`page_view`, `page_leave`, `click`, `answer`, `slider`, …), `item_id`, `kc`, `response`, `correct`, `attempt`, `duration_ms`.
- PostHog (if configured): full session replays, identified by participant ID.

## Images

Food photos are AI-generated. The repo ships small placeholders; `bash scripts/fetch-images.sh` swaps in full-resolution versions (links valid until about 2026-11-17).

## Develop

```bash
npm install
npm run dev
```
