import { NextRequest, NextResponse } from "next/server";
import { explainTopicData } from "@/lib/explainData";

/**
 * 토픽 한 개 몫의 자료 — 토픽 설명 화면(`ExplainShell`)이 ?topic= 이 바뀔 때마다 받는다.
 *
 * 예전엔 `/explain` 쪽이 통째로 서버 렌더(force-dynamic)라, 「토픽 설명」 메뉴만 눌러도(토픽을 안 골랐어도)
 * 서버 함수가 깨어나길 기다렸다(로컬에서도 첫 요청 1.5초 — 문제은행·답안·교재를 다 읽는다).
 * 지금은 화면 껍데기가 정적이고, 토픽을 골랐을 때만 여기를 부른다.
 * 응답은 CDN 에 주소(토픽)별로 남는다 — 같은 토픽을 다시 열면 서버를 깨우지 않는다(배포하면 비워진다).
 * 「최근 1년 출제」처럼 오늘 날짜를 쓰는 값이 있어 한 시간만 신선한 것으로 친다.
 */
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get("topic") || "").trim();
  if (!title) return NextResponse.json(null);
  return NextResponse.json(explainTopicData(title), {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
