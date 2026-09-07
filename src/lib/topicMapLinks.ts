/**
 * 이 토픽이 토픽 지도의 어느 비교 세트·암기표에 등장하는지 찾는다.
 *
 * 토픽 설명은 한 토픽을 깊게 파고, 토픽 지도는 여러 토픽을 나란히 놓는다.
 * 그런데 시험은 대개 "나란히"로 나온다 — 페이징과 세그멘테이션을 비교하라,
 * 뮤텍스와 세마포어의 차이를 쓰라. 그래서 토픽 하나를 다 읽은 자리에서
 * "이건 무엇과 짝인가"로 바로 넘어갈 수 있어야 한다.
 *
 * 매칭 규칙은 compareSetsFor 에 적어 두었다 — 자기 서브노트 표 → 이름이 정확히
 * 같은 항목 → 같은 과목 안의 부분 일치 순이다.
 */
import { compareSets, type CompareSet } from "@/data/compareSets";
import { memoryTables } from "@/data/memoryTables";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { DOMAIN_LABEL, domainLabel } from "@/lib/domains";
import legacyTopics from "@/data/topics.json";

function norm(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}

export type MapLink = {
  set: CompareSet;
  /** 이 토픽이 세트의 항목으로 들어 있나(=짝 비교), 아니면 세트 제목인가(=쪼갠 표) */
  kind: "item" | "title";
};

/** 최대 몇 개까지 붙일지 — 토픽 설명이 비교 세트로 뒤덮이면 안 된다. */
const MAX_SETS = 6;

/** 토픽 제목 → 과목 이름. 같은 낱말이 다른 과목에 있을 때(정규화: DB vs AI) 가르는 데 쓴다. */
const COURSE_OF = new Map<string, string>();
for (const t of legacyTopics as { title: string; category: string }[])
  COURSE_OF.set(norm(t.title), domainLabel(t.category));
// 교재 서브노트가 예전 토픽보다 우선한다(같은 제목이면 교재 과목으로).
for (const s of SUBNOTES) COURSE_OF.set(norm(s.title), DOMAIN_LABEL[s.course] || s.course);

/**
 * 이 토픽이 등장하는 비교 세트들.
 *
 * 순서가 곧 정확도다.
 *  ① 이 토픽의 교재 서브노트에서 뽑은 표(ref 가 이 토픽) — 틀릴 수 없다.
 *  ② 항목 이름이 이 토픽과 정확히 같은 세트 — 짝 비교(세마포어 ↔ 뮤텍스).
 *  ③ 같은 과목 안에서, 항목 이름이 이 토픽으로 시작하거나 세트 제목이 품는 것.
 * 다른 과목의 부분 일치는 안 본다. "커널"로 SVM 의 커널 함수가, "정규화"로
 * AI 의 정규화·표준화가 끌려오던 것이 그것이다.
 */
export function compareSetsFor(title?: string): MapLink[] {
  if (!title) return [];
  const k = norm(title);
  if (!k) return [];
  const course = COURSE_OF.get(k);

  const out: MapLink[] = [];
  const has = (s: CompareSet) => out.some((x) => x.set === s);
  const push = (set: CompareSet, kind: MapLink["kind"]) => {
    if (!has(set)) out.push({ set, kind });
  };

  // ① 자기 서브노트의 표
  for (const set of compareSets) if (set.ref && norm(set.ref) === k) push(set, "title");
  // ② 항목 이름이 정확히 같음 — 같은 과목 것을 먼저(정규화: DB 페이지에선 DB 세트부터)
  const exact = compareSets.filter((set) => set.items.some((it) => norm(it.name) === k));
  for (const set of exact) if (!course || set.category === course) push(set, "item");
  for (const set of exact) push(set, "item");
  // ③ 같은 과목 안의 부분 일치
  if (k.length >= 2) {
    for (const set of compareSets) {
      if (course && set.category !== course) continue;
      if (has(set)) continue;
      if (set.items.some((it) => norm(it.name).startsWith(k))) push(set, "item");
      else if (norm(set.title).includes(k)) push(set, "title");
    }
  }
  return out.slice(0, MAX_SETS);
}

export type MemoryTableHit = (typeof memoryTables)[number];

/**
 * 이 토픽을 다루는 암기표.
 * 표 내용 전체를 훑으면 흔한 낱말("관리")에 아무 표나 걸리므로, 제목과
 * 도입문만 본다. 표 안까지 뒤지는 건 지도의 검색이 할 일이다.
 */
export function memoryTablesFor(title?: string): MemoryTableHit[] {
  if (!title) return [];
  const k = norm(title);
  if (k.length < 2) return [];
  const course = COURSE_OF.get(k);
  // 자기 서브노트에서 뽑은 표가 먼저. 그 다음은 같은 과목 안에서 제목이 품는 것.
  const own = memoryTables.filter((t) => t.ref && norm(t.ref) === k);
  const rest = memoryTables.filter(
    (t) =>
      !own.includes(t) &&
      (!course || t.category === course) &&
      (norm(t.title).includes(k) || norm(t.intro).includes(k)),
  );
  return [...own, ...rest].slice(0, 8);
}
