import ExplainClient from "./ExplainClient";
import { explainTopicData } from "@/lib/explainData";

/**
 * 토픽 설명 — 서버 컴포넌트.
 *
 * ?topic= 을 읽어 그 토픽 몫의 자료만 골라 클라이언트에 넘긴다. 교재·플래시카드·
 * 문제은행·학습카드 같은 큰 자료는 서버에만 남고, 브라우저는 한 토픽 분량만 받는다.
 * 토픽을 고르면 router.push 로 주소가 바뀌고, 이 컴포넌트가 다시 실행돼 새 자료를 준다.
 */
export const dynamic = "force-dynamic";

export default function ExplainPage({
  searchParams,
}: {
  searchParams: { topic?: string | string[] };
}) {
  const raw = searchParams.topic;
  const title = (Array.isArray(raw) ? raw[0] : raw || "").trim();
  return <ExplainClient data={title ? explainTopicData(title) : null} />;
}
