import { NextResponse } from "next/server";
import { explainSearchEntries } from "@/lib/explainIndex";

/**
 * 토픽 검색 인덱스(제목·키워드·정의·표 글자) — 검색창을 처음 건드릴 때만 받는다.
 * 목록 인덱스(/api/explain-index)와 한데 있었는데, 이쪽이 여섯 배 커서(1.9MB) 목록이 늦게 떴다.
 * 빌드 때 한 번 만들어지는 정적 응답이다.
 */
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(explainSearchEntries(), {
    headers: { "Cache-Control": "public, max-age=600, s-maxage=86400" },
  });
}
