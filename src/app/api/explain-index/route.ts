import { NextResponse } from "next/server";
import { explainIndex } from "@/lib/explainData";

/**
 * 토픽 설명의 검색·목록 인덱스.
 * 빌드 때 한 번 만들어지는 정적 응답이다 — 자료가 바뀌면 다음 배포에 반영된다.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(explainIndex(), {
    headers: { "Cache-Control": "public, max-age=600, s-maxage=86400" },
  });
}
