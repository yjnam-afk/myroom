/**
 * 토픽 설명·검색 인덱스·정리표가 함께 쓰는 조각 — 예전 토픽 목록, 출제 이력 요약, 중요도, 「교재에 있는 토픽인가」.
 * (2026-11-20 explainData.ts 787줄을 토픽 자료 · 검색 인덱스(explainIndex) · 정리표(sheetData)로 나누며 떼어 냈다.)
 * 서버에서만 읽는다.
 */
import "server-only";
import topics from "@/data/topics.json";
import { SUBNOTES, type TextbookSubnote } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { examHistory, pastExams, summarize, titlesMatching, LATEST_PAST_ROUND } from "@/lib/examHistory";
import { planInfo } from "@/lib/studyPlan";
import { bareKey } from "@/lib/titleNorm";

export type TopicRow = { id: string; title: string; category: string; importance: string; source?: string };
export const TOPICS = topics as TopicRow[];

/**
 * 예전(기필반) 토픽이 교재 서브노트와 같은 개념인가 — 표기가 달라 제목 비교로는 못 거른다
 * (「요구사항명세서」↔「요구사항 명세서 SRS」, 「활동 기간 산정 기법들」↔「활동기간 산정기법」).
 * 2026-10-11 — "기필 토픽 중에 중복이 많은데". 한쪽만 걸리면 넓은 말로 끌려온 것이라
 * (「CI, CD」→ 데브옵스, 「Lean UX」→ 린 방법론) 양쪽에서 서로를 가리킬 때만 같다고 본다.
 */
const SUB_TITLES: readonly string[] = SUBNOTES.map((s) => s.title);
/** 서브 토픽 이름·별칭(괄호 뗀 열쇠) — 같은 이름의 기필반 토픽을 감추는 데 쓴다 */
export const SUB_KEYS = new Set(SUB_TOPICS.flatMap((st) => [st.name, ...st.aliases]).map(bareKey).filter((k) => k.length >= 2));
const inTextbookCache = new Map<string, boolean>();
// 양쪽 열쇠가 맞아도 다른 토픽 — 눈으로 훑어 걸러 낸 것(웹 OWASP ≠ LLM OWASP, HTTP/2 ≠ HTTP/3,
// DB 옵티마이저 ≠ 머신러닝 옵티마이저).
const NOT_SAME = new Set(["OWASP LLM Top 10 (2025)", "HTTP/2", "옵티마이저(Optimizer)"]);
export function inTextbook(title: string): boolean {
  const c = inTextbookCache.get(title);
  if (c !== undefined) return c;
  const hit =
    !NOT_SAME.has(title) &&
    titlesMatching(title, SUB_TITLES).some((s) => titlesMatching(s, [title]).length > 0);
  inTextbookCache.set(title, hit);
  return hit;
}

export type HistStat = {
  ns: number;
  nsRecent: number;
  nsLast?: string;
  past: number;
  pastRecent: number;
  pastLast?: number;
};

export function histStat(title: string): HistStat {
  const hs = summarize(examHistory(title));
  const past = pastExams(title);
  return {
    ns: hs.count,
    nsRecent: hs.recent,
    nsLast: hs.latest,
    past: past.length,
    pastRecent: past.filter((p) => p.round >= LATEST_PAST_ROUND - 9).length,
    pastLast: past[0]?.round,
  };
}

/** 예전 토픽(topics.json)의 상·중·하 — id 와 괄호 뗀 제목 열쇠로 찾는다 */
export function importanceMaps(): { impById: Map<string, string>; impByBare: Map<string, string> } {
  const impById = new Map<string, string>();
  const impByBare = new Map<string, string>();
  for (const t of TOPICS) {
    impById.set(t.id, t.importance);
    const b = bareKey(t.title);
    if (!impByBare.has(b)) impByBare.set(b, t.importance);
  }
  return { impById, impByBare };
}

/** 서브노트의 중요도 — 학습계획 → topics.json → '상' 순으로 찾는다(학습계획 줄과 같은 값). */
export function impOf(s: TextbookSubnote, impById: Map<string, string>, impByBare: Map<string, string>): string {
  return (
    planInfo(s.title, s.topicId)?.priority ||
    (s.topicId && impById.get(s.topicId)) ||
    impByBare.get(bareKey(s.title)) ||
    "상"
  );
}
