import { SUBNOTES } from "@/data/textbookSubnotes";

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

/** 지문과 매칭되는 서브노트 제목(없으면 undefined). 렌더 시 카드 단위로 호출해도 가볍다. */
export function matchSubnoteTitle(text: string): string | undefined {
  const t = text.toLowerCase().replace(/\s+/g, " ");
  let best: { title: string; b: string } | undefined;
  for (const x of INDEX) {
    if (t.includes(x.b) && (!best || x.b.length > best.b.length)) best = x;
  }
  return best?.title;
}
