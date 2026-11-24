/**
 * 토픽 설명이 쓰는 인덱스를 한 번만 받아 두는 클라이언트 캐시.
 * - 목록(`loadExplainIndex`, /api/explain-index): 과목별 토픽 목록 — 화면이 뜨면 바로 받는다.
 * - 검색(`loadExplainSearch`, /api/explain-search): 제목·키워드·정의·표 글자 — 검색창을 처음 건드릴 때 받는다.
 * 둘이 한 응답(2.4MB)이었을 때는 목록이 검색 자료를 다 받을 때까지 안 떴다.
 */
import type { ExplainIndex, SearchEntry } from "@/lib/explainIndex";

function once<T>(url: string): () => Promise<T> {
  let promise: Promise<T> | undefined;
  return () => {
    if (!promise) {
      promise = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`${url} ${r.status}`);
          return r.json() as Promise<T>;
        })
        .catch((e) => {
          // 실패한 약속을 붙들고 있으면 다음 시도가 영영 안 된다 — 비우고 다시 던진다.
          promise = undefined;
          throw e;
        });
    }
    return promise;
  };
}

export const loadExplainIndex = once<ExplainIndex>("/api/explain-index");
export const loadExplainSearch = once<SearchEntry[]>("/api/explain-search");
