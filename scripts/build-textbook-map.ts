/**
 * textbookMap.json 생성기 — 교재 서브노트의 표를 토픽 지도 데이터로 바꾼다.
 * (npx tsx 로 실행 · prebuild 에서 자동)
 *
 * 왜 자동으로 뽑나: 비교 세트·암기표를 손으로 쓰면 교재가 아니라 내 지식이
 * 섞인다. 실제로 그렇게 했다가 "커널의 종류"에 교재에 없는 하이브리드·엑소·
 * 유니를 넣었다. 시험은 교재 표기로 채점한다. 그래서 교재 표를 기계적으로
 * 옮기고, 사람 손은 어느 표를 고를지(규칙)에만 댄다.
 *
 * 두 가지를 만든다.
 *  - 암기표: 교재 표 전부(2행 이상). 표는 그 자체가 암기 자료다.
 *  - 비교 세트: ① [구분|A|B] 꼴 비교표 → A·B 를 항목으로,
 *              ② 유형·종류·방식… 나열표 → 1열을 항목, 2열을 설명으로.
 *    절차·예시·수식 표는 비교 세트로 안 만든다 — 나란히 외울 것이 아니다.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { DOMAIN_LABEL } from "../src/lib/domains";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const clean = (s: unknown) =>
  String(s ?? "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const stripNo = (s: string) =>
  s.replace(/^[①-⑳]\s*/, "").replace(/^\(?\d+\)?[.)]?\s+/, "").replace(/^\d+단계\s*/, "").trim();

/** 번호만 있는 1열 — "①", "(3)", "1단계", "t0" 처럼 항목 이름이 아닌 것 */
const isNumHead = (h: string) => /^(\(?\d+\)?|[①-⑳]|\d+단계|step\s*\d+|t\d+|[가-힣][.)])$/i.test(h.replace(/\s/g, ""));

/** 비교 축 낱말 — 1열이 이런 말이면 항목이 아니라 비교표의 세로축이다 */
const AXIS = new Set([
  "정의", "특징", "구성", "구성요소", "장점", "단점", "목적", "활용", "사례", "성능",
  "안정성", "개념", "원리", "방식", "종류", "설명", "비고", "예시", "용도", "기법",
  "구분", "지원", "조건", "주체", "특성", "범위", "시기", "대상", "방법", "도구",
  "산출물", "역할", "기능", "한계", "효과", "비용", "속도", "구조", "형태", "처리",
  "관리", "공통점", "차이점", "상호작용", "개요", "목표", "적용", "유형", "구성도",
  "동작원리", "일관성", "정책", "환경", "알고리즘", "표기", "수식", "코드", "연산",
]);
const axisWord = (h: string) => AXIS.has(h.replace(/\s*[(（].*$/, "").trim());

/** 절차·예시·계산 표 — 암기표로는 두되 비교 세트로는 안 만든다 */
const PROC = /절차|과정|순서|단계|예시|사례|예제|동작|수행|흐름|메커니즘|산출|계산|풀이|시나리오|수식|추가 순서|삽입|삭제|탐색 매커니즘/;
/** 나열표 중 "종류를 나란히 외울" 표 — 캡션이나 1열 머리글이 이런 말이면 */
const KINDS = /유형|종류|방식|기법|분류|형태|모델|프로토콜|모드|레벨|등급|정책|전략|원칙|조건|요소|요건|특징|기능|영역|계층|관점|구성|알고리즘|방안|대책|대응|비교|차이|장단점/;

type Item = { name: string; hint: string };
type CmpSet = { category: string; title: string; axis: string; items: Item[]; source: "교재"; ref: string };
type Tbl = {
  category: string; title: string; intro: string; columns: string[]; rows: string[][];
  examTip?: string; source: "교재"; ref: string;
};

const GENERIC_CAP = /^(유형|종류|특징|구성 ?요소|구성|기능|비교|장단점|해결 ?방법|해결 ?방안|절차|과정|동작|수식|예시|사례|개념도|정의|목적|방식|기법|분류|단계|구조|원리|활용|종류 및 특징)$/;
/** 캡션이 "유형"처럼 어느 토픽에나 있는 말이면 토픽 이름을 앞에 붙인다 */
function titleOf(topic: string, cap: string): string {
  if (!cap) return `${topic} 표`;
  if (cap.length <= 4 || GENERIC_CAP.test(cap)) return `${topic} · ${cap}`;
  return cap;
}

const sets: CmpSet[] = [];
const tables: Tbl[] = [];
const seenTitle = new Set<string>();
const stat = { tables: 0, sets: 0, cmp: 0, list: 0 };

for (const s of SUBNOTES) {
  const category = DOMAIN_LABEL[s.course] || s.course;
  const intro = cut(clean((s as any).defShort || (s as any).definition), 140);
  const kw: string[] = ((s as any).keywords || []).map(clean).filter(Boolean);
  const tbs: any[] = (s as any).tables || [];
  const capCount = new Map<string, number>();

  for (const tb of tbs) {
    const headers: string[] = (tb.headers || []).map(clean);
    const rows: string[][] = (tb.rows || []).map((r: unknown[]) => r.map((c) => cut(clean(c), 160)));
    if (rows.length < 2 || headers.length < 2) continue;
    let cap = clean(tb.caption);
    // 같은 토픽에 같은 캡션이 둘이면 뒤엣것에 번호를 붙인다
    const n = (capCount.get(cap) || 0) + 1;
    capCount.set(cap, n);
    if (n > 1) cap = `${cap} (${n})`;

    let title = titleOf(s.title, cap);
    // 토픽이 달라도 제목이 겹치면(예: "종류") 토픽 이름을 붙여 구분한다
    if (seenTitle.has(`${category}::${title}`)) title = `${s.title} · ${cap || "표"}`;
    seenTitle.add(`${category}::${title}`);

    // ── 암기표: 표 전부 ──
    tables.push({
      category, title, intro, columns: headers, rows,
      examTip: kw.length ? `교재 키워드 — ${kw.slice(0, 8).join(" · ")}` : undefined,
      source: "교재", ref: s.title,
    });
    stat.tables++;

    // ── 비교 세트 ──
    const heads = rows.map((r) => stripNo(r[0] || ""));
    if (heads.every(isNumHead)) continue;
    const axisHits = heads.filter(axisWord).length;
    const firstIsAxis = /구분|비교|항목|기준|관점|특성|성질/.test(headers[0]);

    // ① 비교표 [구분|A|B(|C)] — 열 머리글이 항목, 행은 그 항목의 설명
    if (headers.length >= 3 && headers.length <= 5 && (firstIsAxis || axisHits * 2 >= heads.length)) {
      const items: Item[] = headers.slice(1).map((h, ci) => {
        const bits = rows
          .slice(0, 4)
          .map((r) => {
            const label = stripNo(r[0] || "");
            const val = clean(r[ci + 1] || "");
            return val ? (label && !/^\d+$/.test(label) ? `${label}: ${cut(val, 40)}` : cut(val, 40)) : "";
          })
          .filter(Boolean);
        return { name: h, hint: cut(bits.join(" · "), 120) };
      });
      if (items.length >= 2 && items.every((it) => it.name)) {
        sets.push({ category, title, axis: cap || `${headers.slice(1).join(" vs ")} 비교`, items, source: "교재", ref: s.title });
        stat.sets++; stat.cmp++;
      }
      continue;
    }

    // ② 나열표 — 종류를 나란히 외울 표만
    if (rows.length > 8) continue;
    if (axisHits * 2 >= heads.length) continue;
    if (PROC.test(cap) && !KINDS.test(cap)) continue;
    if (!KINDS.test(cap) && !KINDS.test(headers[0])) continue;
    const items: Item[] = rows
      .map((r) => ({ name: stripNo(r[0] || ""), hint: cut(clean(r[1] || ""), 90) }))
      .filter((it) => it.name && !isNumHead(it.name));
    if (items.length < 2) continue;
    sets.push({ category, title, axis: cap || headers.join(" · "), items, source: "교재", ref: s.title });
    stat.sets++; stat.list++;
  }
}

const out = path.join(root, "src/data/textbookMap.json");
fs.writeFileSync(out, JSON.stringify({ compareSets: sets, memoryTables: tables }, null, 0), "utf8");
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(
  `textbookMap.json: 암기표 ${stat.tables}개 · 비교 세트 ${stat.sets}개(비교표 ${stat.cmp} + 나열표 ${stat.list}) · ${kb}KB`,
);
