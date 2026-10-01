import { NextResponse } from "next/server";
import { getModelAnswer } from "@/lib/modelAnswers";

export const runtime = "nodejs";

/**
 * 모범답안 한 편(문제 id) — 「✍️ 모범답안」 목록에서 펼칠 때 받는다.
 * 4,700편 본문을 목록에 통째로 싣지 않으려고 따로 둔다. 별칭 문항은 정본 답안을 돌려준다.
 */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const a = getModelAnswer(id);
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(a, { headers: { "Cache-Control": "public, max-age=3600" } });
}
