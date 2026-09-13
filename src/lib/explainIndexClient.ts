/**
 * /api/explain-index 를 한 번만 받아 두는 클라이언트 캐시.
 * 토픽 설명(목록·카테고리 선택)과 자동완성이 같이 쓴다.
 */
import type { ExplainIndex } from "@/lib/explainData";

let promise: Promise<ExplainIndex> | undefined;

export function loadExplainIndex(): Promise<ExplainIndex> {
  if (!promise) {
    promise = fetch("/api/explain-index")
      .then((r) => {
        if (!r.ok) throw new Error(`explain-index ${r.status}`);
        return r.json() as Promise<ExplainIndex>;
      })
      .catch((e) => {
        // 실패한 약속을 붙들고 있으면 다음 시도가 영영 안 된다 — 비우고 다시 던진다.
        promise = undefined;
        throw e;
      });
  }
  return promise;
}
