import { NextRequest, NextResponse } from "next/server";
import { getModelAnswer, getModelAnswerByQuestion } from "@/lib/modelAnswers";
import genAnswers from "@/data/genAnswers.json";

/**
 * 문항 하나의 클로드 모범답안(없으면 조립 답안) 본문 — 문제풀이·답안 작성 화면이 펼칠 때만 받는다.
 * 두 JSON(각 17MB)은 서버에만 둔다(2026-11-01 정리).
 *   GET /api/exam-answer?id=k139-101   또는   ?q=<문제 문구>
 */
export const runtime = "nodejs";

const GEN = genAnswers as Record<string, { source: string; answer: string }>;

export function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const hand = id ? getModelAnswer(id) : getModelAnswerByQuestion(q);
  if (hand) return NextResponse.json({ kind: "hand", ...hand });
  const gen = id ? GEN[id] : undefined;
  if (gen) return NextResponse.json({ kind: "gen", ...gen });
  return NextResponse.json({ kind: "none" }, { status: 404 });
}
