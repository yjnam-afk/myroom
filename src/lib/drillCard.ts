/**
 * 암기 연습 카드 — 토픽 하나를 「키워드 한 장 → 도식화 → 목차·도식 빨리 쓰기」 순서로 공부하는 자료.
 *
 * 2026-11-23 사용자가 준 문서 「정보관리기술사 토픽 암기 공부법」("사이트에 저 순서대로 공부할 수 있도록 자료를 만들어주거나 수집해줘"):
 *   1. 토픽별 키워드 한 장 — 모든 토픽을 같은 틀로(정의·구성요소·특징·장단점·적용 사례), 키워드 5~7개만
 *   2. 도식화 연습 — 키워드를 보며 백지에 구조도·표를 그려 보기
 *   3. 목차와 도식만 빠르게 쓰기 — 하루 3~4개 토픽, 5~10분
 *   4. 마음가짐 — 외우는 양은 줄이고 같은 틀을 반복
 *
 * 자료는 **모은 것**이다 — 지어 넣지 않는다. 정의·특징·키워드·표는 교재 서브노트, 개념도는 손글씨·답안지 개념도·교재 슬라이드,
 * 적용 사례는 교재 표(활용·적용·사례)와 답안 틀(topicFrames — 3단락 유형·대상), 문제는 실제 출제 지문(memoCard).
 * 교재에 그 칸이 없으면 비워 둔다(화면이 「교재에 없음」이라고 알린다).
 */
import { subnoteByTitle, type TextbookSubnote } from "@/data/textbookSubnotes";
import { subnoteExtraFor } from "@/data/subnoteExtras";
import { conceptFor, type ConceptSpec } from "@/data/conceptDiagrams";
import { FRAME_BY_CODE, frameOf } from "@/data/answerFrames";
import { conclusionFor } from "@/data/answerConclusions";
import { readFlow } from "@/lib/readFlow";
import { memoCardFor } from "@/lib/memoCard";
import EXTRAS from "@/data/drillExtras.json";

/** 교재에 장단점·적용 사례가 없는 토픽에 해설집에서 옮긴 것(data/drillExtras.json — 해설에 인쇄된 항목만) */
type DrillExtra = { pros?: Record<string, string[]>; uses?: string[]; source: { answerId: string; exam: string } };
const EXTRA = EXTRAS as Record<string, DrillExtra>;

export type DrillSlot = { label?: string; items: string[] };
export type DrillCard = {
  id: string;
  title: string;
  area: string;
  group: string;
  newArea: boolean;
  priority?: string;
  /** 교재 서브노트가 있는가(없으면 제목만 있는 토픽) */
  ready: boolean;
  // ── 1. 키워드 한 장 ──
  lead?: string;
  def?: string;
  /** 두 개념·하위 개념 토픽이면 개념마다 */
  concepts: { name: string; def: string }[];
  /** 구성요소 — 교재 표의 이름 칸(구분으로 묶이면 구분별) */
  parts: DrillSlot[];
  partsFrom?: string;
  features: string[];
  /** 장단점 — 교재 표에 장점·단점·한계·문제점이 있을 때만 */
  pros: DrillSlot[];
  /** 적용 사례 — 교재 표(활용·적용·사례)와 답안 틀의 3단락 대상 */
  uses: DrillSlot[];
  /** 장단점·적용 사례를 교재가 아니라 해설집에서 옮겼으면 그 해설집 이름 */
  extraFrom?: string;
  /** 핵심 키워드 5~7개 — 교재 키워드 차례대로 */
  keywords: string[];
  mnemonic: string;
  // ── 2. 도식화 ──
  /** 개념도 그룹(답안 틀) — 무슨 꼴로 그리는 토픽인지 */
  frame?: { code: string; name: string; fixed: string; slot: string };
  hand: string[];
  specs: ConceptSpec[];
  /** 교재 슬라이드 그림 */
  book: string[];
  // ── 3. 목차와 도식만 쓰기 ──
  /** 써 볼 문제 — 실제 출제 지문(많이 나온 순, 서술형 먼저 하나 + 1교시형 하나) */
  questions: { text: string; n: number; where: string; long: boolean }[];
  /** 목차 — 교재 표 캡션 → 이름 칸 */
  outline: { caption: string; items: string[] }[];
};

const one = (s: string) => s.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
const isGroupHead = (h: string) => /^(구분|분류|유형|관점|측면|단계|계층|영역|범주)$/.test(h.trim());
const NUM = /^[①-⑳\d.\s]*$/;

/** 표의 이름 칸 — [구분 | 항목 | 설명] 꼴이면 구분별 항목, 아니면 1열 */
function names(t: TextbookSubnote["tables"][number]): DrillSlot[] {
  const rows = t.rows.filter((r) => r.length && one(r[0]));
  if (t.headers.length >= 3 && isGroupHead(t.headers[0])) {
    const by = new Map<string, string[]>();
    for (const r of rows) {
      const k = one(r[0]);
      const v = one(r[1] ?? "");
      if (!v || v === k) continue;
      by.set(k, [...(by.get(k) ?? []), v]);
    }
    // 구분이 행마다 다르면(묶음이 아니면) 구분 이름 자체가 항목이다
    if (by.size && [...by.values()].some((v) => v.length > 1)) return [...by].map(([label, items]) => ({ label, items }));
  }
  const items = rows.map((r) => one(r[0])).filter((x) => !NUM.test(x));
  return items.length ? [{ items: [...new Set(items)] }] : [];
}

const PRO = /장점|단점|장단점|한계|문제점|이점|기대\s*효과|효과|강점|약점/;
const USE = /적용|활용|사례|응용|서비스\s*분야|도입/;
const PART = /구성|요소|구조|아키텍처|기술|계층|메커니즘|원리/;

function slotsOf(sub: TextbookSubnote) {
  const tables = sub.tables ?? [];
  const pros: DrillSlot[] = [];
  const uses: DrillSlot[] = [];
  for (const t of tables) {
    // 머리글에 장점·단점 열이 있는 표 — 그 열을 행 이름과 함께
    const cols = t.headers.map((h, i) => (PRO.test(h) ? i : -1)).filter((i) => i > 0);
    for (const i of cols) {
      const items = t.rows.map((r) => (one(r[i] ?? "") ? `${one(r[0])}: ${one(r[i])}` : "")).filter(Boolean);
      if (items.length) pros.push({ label: `${one(t.headers[i])} — ${one(t.caption)}`, items });
    }
    // 1열이 장점·단점인 행(비교표의 「장점」 줄)
    for (const r of t.rows) {
      const k = one(r[0] ?? "");
      if (PRO.test(k) && k.length <= 12 && !cols.length) {
        const items = r.slice(1).map((c, j) => (one(c) ? `${t.headers.length > 2 ? one(t.headers[j + 1]) + ": " : ""}${one(c)}` : "")).filter(Boolean);
        if (items.length) pros.push({ label: `${k} — ${one(t.caption)}`, items });
      }
    }
    if (PRO.test(t.caption) && !cols.length) for (const s of names(t)) pros.push({ label: s.label ? `${one(t.caption)} · ${s.label}` : one(t.caption), items: s.items });
    if (USE.test(t.caption)) for (const s of names(t)) uses.push({ label: s.label ? `${one(t.caption)} · ${s.label}` : one(t.caption), items: s.items });
  }
  const partT = tables.find((t) => PART.test(t.caption) && !PRO.test(t.caption) && !USE.test(t.caption)) ?? tables.find((t) => !PRO.test(t.caption) && !USE.test(t.caption) && t.rows.length >= 2);
  return { pros, uses, parts: partT ? names(partT) : [], partsFrom: partT ? one(partT.caption) : undefined };
}

const cache = new Map<string, DrillCard[]>();

/** 한 과목의 연습 카드 — 토픽 지도 차례 */
export function drillCards(code: string): DrillCard[] {
  const hit = cache.get(code);
  if (hit) return hit;
  const out: DrillCard[] = readFlow(code).map((b) => {
    const sub = subnoteByTitle(b.title);
    const s = sub ? slotsOf(sub) : { pros: [], uses: [], parts: [], partsFrom: undefined };
    const fr = frameOf(b.title);
    const g = fr ? FRAME_BY_CODE[fr.group] : undefined;
    const uses = [...s.uses];
    const pros = [...s.pros];
    // 교재에 없는 칸만 해설집에서 옮긴 것으로 채운다(교재에 있으면 교재가 먼저다)
    const ex = EXTRA[b.title];
    let extraFrom: string | undefined;
    if (ex?.pros && !pros.length) {
      for (const [label, items] of Object.entries(ex.pros)) if (items.length) pros.push({ label: `${label}(해설집)`, items });
      if (pros.length) extraFrom = ex.source.exam;
    }
    if (ex?.uses?.length && !uses.length) {
      uses.push({ label: "해설집", items: ex.uses });
      extraFrom = ex.source.exam;
    }
    // 답안 틀의 3단락(차별화) — 유형과 대상. 교재 밖 수치·사례가 아니라 「무엇과 이어 쓸지」의 후보다
    if (fr?.target) uses.push({ label: `3단락 ${fr.type}`, items: fr.target.split(/\s*[·,/]\s*/).filter(Boolean) });
    const conc = conclusionFor(b.title);
    if (conc?.diff?.length) uses.push({ label: conc.concTitle, items: conc.diff });
    const memo = memoCardFor(b.title);
    const qs = memo.questions;
    const pick = [qs.find((q) => q.long), qs.find((q) => !q.long)].filter((q): q is (typeof qs)[number] => !!q);
    const extra = subnoteExtraFor(sub?.topicId, b.title);
    return {
      id: b.id,
      title: b.title,
      area: b.area,
      group: b.group,
      newArea: b.newArea,
      priority: b.priority,
      ready: !!sub,
      lead: sub?.lead,
      def: sub?.defShort || b.def,
      concepts: b.concepts.map((c) => ({ name: c.name, def: c.def })),
      parts: s.parts,
      partsFrom: s.partsFrom,
      features: b.features,
      pros,
      uses,
      extraFrom,
      keywords: (sub?.keywords ?? []).map(one).filter(Boolean).slice(0, 7),
      mnemonic: memo.mnemonic,
      frame: fr && g ? { code: g.code, name: g.name, fixed: g.fixed, slot: fr.slot } : undefined,
      hand: b.diagrams,
      specs: conceptFor(b.title),
      book: [...(extra?.image ? [extra.image] : []), ...(extra?.images ?? [])].slice(0, 2),
      questions: pick.map((q) => ({ text: q.text, n: q.n, where: q.where[0] ?? "", long: q.long })),
      outline: (sub?.tables ?? []).map((t) => ({ caption: one(t.caption), items: names(t).flatMap((x) => (x.label ? [`${x.label}: ${x.items.join(" · ")}`] : x.items)) })).filter((o) => o.items.length),
    };
  });
  cache.set(code, out);
  return out;
}
