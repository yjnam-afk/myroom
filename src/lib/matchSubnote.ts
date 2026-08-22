import { SUBNOTES } from "@/data/textbookSubnotes";
import { relatedSubnote } from "@/lib/relatedTopics";

/**
 * 기출 문제 지문 → 서브노트(답안지 템플릿) 자동 매칭.
 * 서브노트 제목(괄호 제거)이 지문에 통째로 들어 있으면 매칭 — 가장 긴 제목 우선.
 * 예) "디피-헬만 알고리즘(...)의 키 교환 절차에 대하여..." → 디피-헬만 알고리즘 서브노트
 */
const bare = (s: string) =>
  s
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const INDEX: { title: string; b: string }[] = (() => {
  const list: { title: string; b: string }[] = [];
  for (const s of SUBNOTES) {
    const b = bare(s.title);
    // 2글자 이하(예: 커널)는 오탐이 많아 제외
    if (b.length >= 3) list.push({ title: s.title, b });
    for (const p of s.defPair || []) {
      const pb = bare(p.name);
      if (pb.length >= 3) list.push({ title: s.title, b: pb });
    }
  }
  return list;
})();

/**
 * 지문과 매칭되는 서브노트 제목(없으면 undefined).
 *
 * ★주의★ 예전에는 defPair 이름("프로세스")까지 키로 써서 "업무 프로세스 재설계"
 * 같은 지문에 엉뚱한 템플릿(프로세스와 스레드 비교)이 붙었다. 지금은 흔한 낱말을
 * 걸러내고 짧은 영문 약어는 낱말 단위로만 맞추는 엄격 매처에 위임한다.
 */
export function matchSubnoteTitle(text: string): string | undefined {
  return relatedSubnote(text);
}

// ── 내용 기반 조회 — 표·키워드 안에만 나오는 하위 개념을 상위 서브노트로 연결 ──
// 예) "단위 테스트" → 테스트 레벨 서브노트, "폭포수 모델" → 개발 모델 서브노트.
const CONTENT_INDEX: { title: string; hay: string }[] = SUBNOTES.map((s) => ({
  title: s.title,
  hay: [
    s.title,
    s.defShort,
    s.lead || "",
    ...(s.features || []),
    ...(s.keywords || []),
    ...(s.defPair || []).flatMap((p) => [p.name, p.def]),
    ...(s.notes || []),
    ...s.tables.flatMap((tb) => [tb.caption || "", ...tb.rows.flat()]),
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " "),
}));

/**
 * 개념 이름이 '내용에' 들어 있는 서브노트 제목을 찾는다(제목 매칭 실패 시의 폴백).
 * 괄호를 뗀 형태까지 두 번 찔러 보고, 여러 개면 짧은 제목(더 전용인 쪽)을 고른다.
 */
export function findSubnoteByContent(name: string): string | undefined {
  const probes = [
    name.toLowerCase().replace(/\s+/g, " ").trim(),
    bare(name) ? name.replace(/\s*\([^)]*\)/g, "").toLowerCase().replace(/\s+/g, " ").trim() : "",
  ].filter((p) => p.length >= 2);
  for (const p of probes) {
    const hits = CONTENT_INDEX.filter((x) => x.hay.includes(p));
    if (hits.length) {
      hits.sort((a, b) => a.title.length - b.title.length);
      return hits[0].title;
    }
  }
  return undefined;
}
