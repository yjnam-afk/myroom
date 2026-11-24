import { Suspense } from "react";
import ExplainShell from "./ExplainShell";

/**
 * 토픽 설명 — 정적 쪽.
 *
 * 화면 껍데기는 빌드 때 한 번 만들어 두고, 토픽 자료는 브라우저가 ?topic= 을 읽어 /api/explain-topic 에서
 * 그 토픽 몫만 받는다(`ExplainShell`). 교재·플래시카드·문제은행 같은 큰 자료는 서버에만 남는다.
 * 2026-11-24 까지는 이 쪽이 force-dynamic 이라 토픽을 안 골랐어도(메뉴만 눌러도) 서버 함수를 기다렸다.
 */
export default function ExplainPage() {
  return (
    <Suspense fallback={null}>
      <ExplainShell />
    </Suspense>
  );
}
