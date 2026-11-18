import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { T_PARTICIPANTS } from "@/lib/tables";

export const dynamic = "force-dynamic";

/**
 * Random assignment, balanced: a new learner goes to whichever version has fewer
 * real participants so far (team previews don't count); a tie is a coin flip.
 * With a small sample this keeps the two groups the same size. If the database is
 * unreachable it falls back to a plain coin flip.
 */
export async function GET() {
  const coin = Math.random() < 0.5 ? "A" : "B";
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ condition: coin, method: "coin" });
  const count = async (c: "A" | "B") => {
    const { count, error } = await db
      .from(T_PARTICIPANTS)
      .select("id", { count: "exact", head: true })
      .eq("condition", c)
      .not("background", "in", '("preview","claude_smoke_test")');
    if (error) throw error;
    return count ?? 0;
  };
  try {
    const [a, b] = await Promise.all([count("A"), count("B")]);
    const condition = a === b ? coin : a < b ? "A" : "B";
    return NextResponse.json({ condition, method: "balanced", counts: { A: a, B: b } });
  } catch {
    return NextResponse.json({ condition: coin, method: "coin" });
  }
}
