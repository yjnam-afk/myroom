/**
 * 토픽 DB 내보내기 — 교재 토픽 전부 + 기출 2회 이상 나온 교재 밖 토픽을 마크다운으로.
 *
 *   npx tsx scripts/export-topic-db.ts <폴더>
 *     → <폴더>/토픽DB_{코드}_{NN}.md   (파일 하나에 토픽 15개 이하 · 40KB 이하, 도메인 안은 중요도 → 기출+NS+모의 합계 순)
 *       <폴더>/토픽DB_{코드}_목차.md    (토픽명 · 중요도 · 기출·NS·모의 횟수 · 들어 있는 파일)
 *       <폴더>/요약.json                 (도메인별 파일 수 · 항목별 「교재에 없음」 수)
 *
 * 2026-11-23 두 번째 요청("지난번 토픽DB 는 항목이 모자라고 파일이 커서 끝까지 읽히지 않았다"):
 * 토픽마다 14개 항목. **교재 서브노트의 칸은 하나도 빼지 않는다** — 정의·축약 정의·리드문·특징·개념별 정의·교재 키워드·표 전부·메모.
 * 표는 캡션으로 항목(필요성·특징·구성요소·절차·유형·장단점·표준·비교)에 나누고, 어디에도 안 맞는 표는 「15. 기타 교재 표」에 그대로 둔다.
 * 표 칸은 줄이지 않는다(칸 안 줄바꿈은 「 / 」로 이음). 교재에 없는 항목은 「교재에 없음」 — 지어 넣지 않는다.
 *
 * 사람·도우미가 만든 보조 자료(모두 원문 대조로 걸렀다):
 * - export-topic-db.defkeys.json  정의 핵심 키워드 3개 — 정의 문장 속 글자 그대로인 1~4어절만 쓴다(스크립트가 다시 확인)
 * - export-topic-db.figures.json  교재 슬라이드 그림(개념도)에 인쇄된 박스·화살표·구역 이름을 글로 옮긴 것
 * 교재 밖 토픽은 교재 칸이 모두 「교재에 없음」이고, 해설집에서 옮긴 정리(examNotes)·예전 기필반 자료(topicDetails)를 「참고」로 출처와 함께 붙인다.
 */
import fs from "fs";
import { SUBNOTES, type TextbookSubnote, type SubnoteTable } from "../src/data/textbookSubnotes";
import examTopics from "../src/data/examTopics.json";
import { examNoteFor, type ExamNote } from "../src/data/examNotes";
import topics from "../src/data/topics.json";
import topicDetails from "../src/data/topicDetails.json";
import flashcards from "../src/data/flashcards.json";
import { TWIN_TOPICS } from "../src/data/twinTopics";
import { DOMAINS } from "../src/lib/domains";
import { pastExams, examHistory, mockExams, questionIdsForTitle, QUESTION_BY_ID } from "../src/lib/examHistory";
import { planInfo } from "../src/lib/studyPlan";
import { bareKey } from "../src/lib/titleNorm";
import defKeyFile from "./export-topic-db.defkeys.json";
import figureFile from "./export-topic-db.figures.json";

const OUT = process.argv[2] || "topicdb";
const MAX_TOPICS = 15;
const MAX_BYTES = 40_000;
const NONE = "교재에 없음";

const one = (s: string) => (s ?? "").replace(/\s*\n\s*/g, " / ").replace(/[ \t]+/g, " ").trim();
const plain = (s: string) => s.replace(/\*\*/g, "");
const squash = (s: string) => plain(s).replace(/[\s·・,()（）\-/]/g, "").toLowerCase();
const bytes = (s: string) => Buffer.byteLength(s, "utf8");

// ── 보조 자료 ──
const DEFKEYS = defKeyFile as Record<string, string[]>;
const FIGS = figureFile as Record<string, { none?: boolean; lines?: string[] }>;
type Card = { title: string; source?: string; mnemonic?: string; sections?: { label: string; mnemonic: string }[] };
const CARD = new Map((flashcards as Card[]).filter((c) => c.source === "심화반").map((c) => [c.title, c]));
const LEGACY_ID = new Map<string, string>();
for (const t of topics as { id: string; title: string }[]) if (!LEGACY_ID.has(t.title)) LEGACY_ID.set(t.title, t.id);
const DETAIL = topicDetails as Record<string, { detail?: string }>;
function legacySections(name: string): { head: string; lines: string[] }[] {
  const id = LEGACY_ID.get(name);
  const d = id ? DETAIL[id]?.detail : undefined;
  if (!d) return [];
  return d.split(/\n(?=\[)/).map((p) => {
    const m = /^\[([^\]]+)\]\s*/.exec(p);
    const lines = p.replace(/^\[[^\]]+\]\s*/, "").split("\n").map((l) => l.trim()).filter(Boolean);
    return { head: m ? m[1] : "", lines };
  }).filter((x) => x.head && x.lines.length);
}

// ── 표 나누기 ──
type Kind = "def" | "fig" | "need" | "feat" | "part" | "proc" | "type" | "pros" | "std" | "cmp" | "etc";
const RULES: [Kind, RegExp][] = [
  ["cmp", /비교|차이|\bvs\b|VS|대비/],
  ["fig", /개념도|구성도|흐름도|구조도|예시도|그림/],
  ["def", /^개념|개념$|정의|상세\s*설명|^설명$/],
  ["pros", /장점|단점|장단점|한계|고려|활용|적용|사례|효과|기대|대응|방안|전략|문제점|이슈|시사점|해결|보완|개선/],
  ["std", /표준|ISO|IEC|IEEE|RFC|ITU|NIST|법|규정|고시|지침|가이드|지표|수치|공식|산식|계산|측정|척도|메트릭|평가\s*기준|등급/],
  ["need", /필요|등장|배경|목적|동향|원인|요인|조건/],
  ["feat", /특징|특성|원칙|속성/],
  ["proc", /절차|프로세스|단계|과정|동작|흐름|순서|수행|라이프|생명주기|사이클|원리|메커니즘|방법론|알고리즘\s*동작/],
  ["part", /구성|요소|구조|아키텍처|계층|프레임워크|모델|기능|역할|기술\s*요소/],
  ["type", /유형|종류|분류|기법|방식|알고리즘|모드|레벨|타입|형태|기술/],
];
const kindOf = (caption: string): Kind => RULES.find(([, re]) => re.test(caption))?.[0] ?? "etc";

const cell = (s: string) => one(s ?? "").replace(/\|/g, "\\|") || " ";
function renderTable(t: SubnoteTable | { caption: string; headers: string[]; rows: string[][] }, mnem?: string): string[] {
  const out: string[] = [];
  const cap = one(t.caption) || "(캡션 없는 표)";
  out.push(`- 표 「${cap}」${mnem ? ` · 두음 ${mnem}` : ""}`);
  const h = t.headers ?? [];
  if (h.length <= 1) {
    for (const r of t.rows) if (one(r[0] ?? "")) out.push(`  - ${one(r[0])}`);
    return out;
  }
  out.push("", `| ${h.map(cell).join(" | ")} |`, `|${h.map(() => "---").join("|")}|`);
  for (const r of t.rows) out.push(`| ${h.map((_, i) => cell(r[i] ?? "")).join(" | ")} |`);
  out.push("");
  return out;
}

// ── 표준·법령 이름(교재 글에 나온 것 그대로) ──
const STD_RE = /\b(?:ISO(?:\/IEC)?(?:\/IEEE)?\s?\d[\d\-:.]*\d|IEC\s?\d[\d\-:.]*\d|IEEE\s?\d[\d.]*[a-z]{0,3}|RFC\s?\d+|ITU-T\s?[A-Z]\.?\d+|NIST\s?(?:SP\s?)?\d[\d\-]*|KS\s?X\s?\d+)/g;
const LAW_RE = /[가-힣A-Za-z·]{2,}(?:법|시행령|시행규칙|고시)(?=[\s,.)」』\]]|$)/g;
const NOT_LAW = /(기법|방법|문법|해법|용법|어법|수법|요법|화법|필법|가법|감법|논법|정법|공법|우법|상법)$/;
function stdMentions(text: string): string[] {
  const s = new Set<string>();
  for (const m of text.matchAll(STD_RE)) s.add(m[0].trim());
  for (const m of text.matchAll(LAW_RE)) if (!NOT_LAW.test(m[0]) && m[0].length >= 4) s.add(m[0]);
  return [...s];
}

// ── 출제 이력 ──
type Hist = { past: { label: string; text: string }[]; ns: string[]; mock: string[]; ids: Set<string> };
const histCache = new Map<string, Hist>();
function hist(name: string): Hist {
  const c = histCache.get(name);
  if (c) return c;
  const past = pastExams(name).map((p) => ({ label: `${p.track === "컴시응" ? "컴시응 " : ""}${p.round}회 ${p.period} ${p.no}번`, text: one(p.text) }));
  const ns = examHistory(name).map((e) => {
    const m = /-(\d)(\d{2})$/.exec(e.id);
    return `NS ${e.cohort} ${e.round.replace(/^0/, "")} ${e.period}${m ? ` ${Number(m[2])}번` : ""}`.replace(/\s+/g, " ");
  });
  const mock = mockExams(name).map((m) => m.source);
  const h = { past, ns, mock, ids: new Set(questionIdsForTitle(name)) };
  histCache.set(name, h);
  return h;
}
const joinX = (xs: string[]) => {
  const out: [string, number][] = [];
  for (const x of xs) {
    const last = out[out.length - 1];
    if (last && last[0] === x) last[1]++;
    else out.push([x, 1]);
  }
  return out.map(([x, n]) => (n > 1 ? `${x} ×${n}` : x)).join(", ");
};

// ── 대상 ──
type Ex = { name: string; code: string; area: string; group: string; n: number; past: number; under?: string; legacy?: boolean };
type Topic = { name: string; code: string; kind: "교재" | "교재 밖"; sub?: TextbookSubnote; ex?: Ex };
const all: Topic[] = [
  ...SUBNOTES.map((s) => ({ name: s.title, code: s.course, kind: "교재" as const, sub: s })),
  ...(examTopics as Ex[]).filter((e) => pastExams(e.name).length >= 2).map((e) => ({ name: e.name, code: e.code, kind: "교재 밖" as const, ex: e })),
];

// ── 중요도(상/중/하) ──
// 2026-11-24 "모든 토픽에 중요도 항목 추가 — 서브노트 엑셀·사이트에 있는 등급을 그대로, 없으면 등급 없음".
// 사이트 토픽 화면과 같은 차례로 찾는다: 교재 CONTENTS Priority(★★★=상 · ★★=중 · ★=하, studyPlan) → 예전 토픽 엑셀(topics.json)의 id → 같은 제목.
// 사이트는 못 찾으면 「상」으로 치지만(impOf) 여기서는 지어 넣지 않고 「등급 없음」으로 둔다.
const NO_GRADE = "등급 없음";
const IMP_BY_ID = new Map<string, string>();
const IMP_BY_BARE = new Map<string, string>();
for (const t of topics as { id: string; title: string; importance?: string }[]) {
  if (!t.importance) continue;
  IMP_BY_ID.set(t.id, t.importance);
  const k = bareKey(t.title);
  if (!IMP_BY_BARE.has(k)) IMP_BY_BARE.set(k, t.importance);
}
type Grade = { g: string; src: string };
const gradeCache = new Map<string, Grade>();
function grade(t: Topic): Grade {
  let v = gradeCache.get(t.name);
  if (v) return v;
  const pr = t.sub ? planInfo(t.sub.title, t.sub.topicId)?.priority : undefined;
  if (pr) v = { g: pr, src: "교재 CONTENTS Priority" };
  else {
    const x = (t.sub?.topicId && IMP_BY_ID.get(t.sub.topicId)) || IMP_BY_BARE.get(bareKey(t.name));
    v = x ? { g: x, src: "서브노트 엑셀(예전 토픽 목록)" } : { g: NO_GRADE, src: "" };
  }
  gradeCache.set(t.name, v);
  return v;
}
const GRADE_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2 };
const gradeRank = (t: Topic) => GRADE_ORDER[grade(t).g] ?? (grade(t).g === NO_GRADE ? 9 : 3);
const total = (t: Topic) => { const h = hist(t.name); return h.past.length + h.ns.length + h.mock.length; };

// ── 같이 비교되는 토픽(비교·차이·vs 문항에 함께 걸린 토픽) ──
const COMPARE_Q = /비교|차이|\bvs\b|VS|대비하여/;
const BY_Q = new Map<string, string[]>();
for (const t of all) for (const id of hist(t.name).ids) {
  const q = QUESTION_BY_ID.get(id);
  if (!q || !COMPARE_Q.test(q.text)) continue;
  if (!BY_Q.has(id)) BY_Q.set(id, []);
  BY_Q.get(id)!.push(t.name);
}
const CMP = new Map<string, Map<string, number>>();
for (const ts of BY_Q.values()) {
  const u = [...new Set(ts)];
  if (u.length < 2 || u.length > 6) continue;
  for (const a of u) for (const b of u) if (a !== b) {
    if (!CMP.has(a)) CMP.set(a, new Map());
    CMP.get(a)!.set(b, (CMP.get(a)!.get(b) ?? 0) + 1);
  }
}

// ── 토픽 한 개 → 마크다운 ──
const ITEMS = [
  "1. 토픽명", "2. 도메인", "3. 교재 정의", "4. 정의 핵심 키워드", "5. 특징", "6. 필요성·등장배경", "7. 개념도 설명", "8. 구성요소",
  "9. 절차·프로세스", "10. 유형·종류", "11. 장단점·고려사항·활용", "12. 관련 표준·법령·수치", "13. 출제 이력", "14. 비교 토픽과 비교 기준",
] as const;
const noneCount: Record<string, Record<string, number>> = { 교재: {}, "교재 밖": {} };
const LABEL: Record<string, string> = Object.fromEntries(DOMAINS.map((d) => [d.code, d.label]));

function block(t: Topic): string {
  const L: string[] = [];
  const sec = (i: number, body: string[], none: boolean) => {
    L.push(`### ${ITEMS[i]}`);
    if (none) noneCount[t.kind][ITEMS[i]] = (noneCount[t.kind][ITEMS[i]] ?? 0) + 1;
    L.push(...(body.length ? body : [NONE]), "");
  };
  const h = hist(t.name);
  L.push(`## ${t.name}`, "");
  sec(0, [`${t.name} (${t.kind} 토픽)`], false);
  {
    const gr = grade(t);
    L.push(`### 중요도`, gr.src ? `${gr.g} (${gr.src})` : gr.g, "");
  }
  sec(1, [`${LABEL[t.code] ?? t.code}(${t.code})${t.ex ? ` · 지도 자리 ${t.ex.area} › ${t.ex.group}${t.ex.under ? ` › ${t.ex.under} 아래` : ""}` : ""}`], false);

  const byKind: Record<Kind, string[]> = { def: [], fig: [], need: [], feat: [], part: [], proc: [], type: [], pros: [], std: [], cmp: [], etc: [] };
  const tableKinds = new Set<Kind>();

  if (t.sub) {
    const s = t.sub;
    const card = CARD.get(s.title);
    const secMnem = new Map((card?.sections ?? []).filter((x) => x.mnemonic).map((x) => [one(x.label), x.mnemonic]));
    // 3. 정의 — 서브노트의 정의 칸 전부
    const d: string[] = [`- 교재 정의(원문, **굵게** = 교재 강조어): ${one(s.definition) || NONE}`];
    if (s.lead) d.push(`- 리드문(서브노트): ${one(s.lead)}`);
    if (s.defShort) d.push(`- 답안용 축약 정의(서브노트): ${one(s.defShort)}`);
    for (const p of s.defPair ?? []) d.push(`- 개념별 정의 — ${p.name}: ${one(p.def)}${p.lead ? ` (리드: ${one(p.lead)})` : ""}${p.features?.length ? ` / 특징: ${p.features.join(", ")}` : ""}`);
    for (const p of s.subDefs ?? []) d.push(`- 하위 개념 — ${p.name}: ${one(p.def)}${p.lead ? ` (리드: ${one(p.lead)})` : ""}${p.features?.length ? ` / 특징: ${p.features.join(", ")}` : ""}`);
    // 표 나누기(정의·개념도 칸에도 표가 들어가므로 먼저)
    for (const tb of s.tables ?? []) {
      const k = kindOf(tb.caption);
      tableKinds.add(k);
      byKind[k].push(...renderTable(tb, secMnem.get(one(tb.caption))));
    }
    d.push(...byKind.def);
    sec(2, d, !s.definition);
    // 4. 핵심 키워드 — 정의 속 글자 그대로인 짧은 말만
    const dq = squash(s.definition);
    const ks = (DEFKEYS[s.title] ?? []).filter((k) => squash(k).length >= 2 && dq.includes(squash(k))).slice(0, 3);
    const k4: string[] = [`- 핵심 키워드: ${ks.length ? ks.join(" · ") : NONE}`];
    const bold = [...s.definition.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => one(m[1]));
    if (bold.length) k4.push(`- 교재 강조어(정의 속 색 글씨): ${bold.join(" · ")}`);
    if (s.keywords?.length) k4.push(`- 교재 키워드(■ 키워드 원문): ${s.keywords.map(one).join(" · ")}`);
    sec(3, k4, !ks.length);
    // 5. 특징
    const f: string[] = [];
    if (card?.mnemonic) f.push(`- 두음(교재 키워드): ${card.mnemonic}`);
    if (s.features?.length) f.push(`- 답안용 특징 3개(서브노트 — 교재 말로 쓴 요약, 원문 표 아님): ${s.features.join(" · ")}`);
    f.push(...(byKind.feat.length ? byKind.feat : [`- 교재 특징 표: ${NONE}`]));
    sec(4, f, !tableKinds.has("feat"));
    sec(5, byKind.need, !byKind.need.length);
    // 7. 개념도
    const fig = FIGS[s.title];
    const figLines = fig?.lines?.length ? fig.lines.map((l) => `- ${l}`) : [];
    sec(6, [...figLines, ...byKind.fig].length ? [...figLines, ...byKind.fig] : [fig?.none ? `${NONE}(교재 슬라이드에 그림이 없다 — 표·글만 있음)` : NONE], !figLines.length && !byKind.fig.length);
    sec(7, byKind.part, !byKind.part.length);
    sec(8, byKind.proc, !byKind.proc.length);
    sec(9, byKind.type, !byKind.type.length);
    sec(10, byKind.pros, !byKind.pros.length);
    // 12. 표준·법령·수치
    const text = [s.definition, ...(s.keywords ?? []), ...(s.notes ?? []), ...(s.tables ?? []).flatMap((tb) => [tb.caption, ...tb.headers, ...tb.rows.flat()])].join("\n");
    const ms = stdMentions(text);
    const st = [...byKind.std];
    if (ms.length) st.push(`- 교재 글에 나온 표준·법령 이름: ${ms.join(", ")}`);
    sec(11, st, !st.length);
  } else {
    // 교재 밖 토픽 — 교재 칸은 「교재에 없음」, 참고 자료를 출처와 함께
    const note = examNoteFor(t.name) as ExamNote | undefined;
    const noteSrc = note ? `해설집 — ${note.source.exam.replace(/\s*\(.*$/, "")}` : "";
    const leg = legacySections(t.name);
    const legSrc = "예전 기필반 자료";
    const ref = (src: string, lines: string[]) => lines.map((l) => `- (참고 · ${src}) ${l}`);
    const legOf = (re: RegExp) => leg.filter((x) => re.test(x.head)).flatMap((x) => ref(legSrc, x.lines.map((l) => `${x.head}: ${l.replace(/^-\s*/, "")}`)));
    // 해설집 표
    for (const tb of (note?.tables ?? []) as SubnoteTable[]) {
      const k = kindOf(tb.caption);
      byKind[k].push(...renderTable(tb).map((l, i) => (i === 0 ? l.replace(/^- 표/, `- (참고 · ${noteSrc}) 표`) : l)));
    }
    const d: string[] = [NONE + "(교재 밖 토픽)"];
    if (note?.lead) d.push(...ref(noteSrc, [`리드문: ${one(note.lead)}`]));
    if (note?.definition) d.push(...ref(noteSrc, [`정의: ${one(note.definition)}`]));
    d.push(...legOf(/^정의|개념/), ...byKind.def);
    sec(2, d, true);
    const k4: string[] = [NONE];
    if (note?.keywords?.length) k4.push(...ref(noteSrc, [`키워드: ${note.keywords.join(" · ")}`]));
    sec(3, k4, true);
    const f: string[] = [NONE];
    if (note?.features?.length) f.push(...ref(noteSrc, [`특징: ${note.features.join(" · ")}`]));
    f.push(...legOf(/특징|특성/), ...byKind.feat);
    sec(4, f, true);
    sec(5, [NONE, ...legOf(/등장|배경|목적|필요/), ...byKind.need], true);
    sec(6, [NONE, ...(note?.figures ?? []).map((x) => `- (참고 · ${noteSrc}) 그림: ${one(x)}`), ...byKind.fig], true);
    sec(7, [NONE, ...legOf(/구성|요소|기술요소|구조/), ...byKind.part], true);
    sec(8, [NONE, ...legOf(/절차|프로세스|동작|원리/), ...byKind.proc], true);
    sec(9, [NONE, ...legOf(/유형|종류|분류|기법/), ...byKind.type], true);
    const pr: string[] = [NONE];
    for (const [k, v] of Object.entries(note?.pros ?? {})) pr.push(...ref(noteSrc, [`${k}: ${v.join(" · ")}`]));
    if (note?.uses?.length) pr.push(...ref(noteSrc, [`활용·적용: ${note.uses.join(" · ")}`]));
    pr.push(...legOf(/장점|단점|고려|활용|대응|시사점|사례/), ...byKind.pros);
    sec(10, pr, true);
    sec(11, [NONE, ...legOf(/표준|프레임워크|법|산식/), ...byKind.std], true);
  }

  // 13. 출제 이력 — 기출은 문제 원문까지
  const H: string[] = [`- 출제 횟수: 기출 ${h.past.length} · NS ${h.ns.length} · 모의 ${h.mock.length} (합계 ${h.past.length + h.ns.length + h.mock.length})`];
  for (const p of h.past) H.push(`- 기출 ${p.label}: ${p.text}`);
  if (h.ns.length) H.push(`- NS 주간 모의고사: ${joinX(h.ns)}`);
  if (h.mock.length) H.push(`- 모의고사·파이널·셀테: ${joinX(h.mock)}`);
  L.push(`### ${ITEMS[12]}`, ...H, "");

  // 14. 비교
  const C: string[] = [...byKind.cmp];
  for (const p of t.sub?.defPair ?? []) C.push(`- 한 토픽 안의 비교 개념(교재 정의 짝): ${p.name}`);
  for (const w of TWIN_TOPICS) {
    if (w.a === t.name) C.push(`- 사실상 같은 토픽: ${w.b} — ${w.note}`);
    if (w.b === t.name) C.push(`- 사실상 같은 토픽: ${w.a} — ${w.note}`);
  }
  const m = CMP.get(t.name);
  if (m?.size) C.push(`- 비교 문항(문제에 「비교·차이·vs」)에 함께 나온 토픽: ${[...m].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([b, n]) => `${b}(${n}문항)`).join(" · ")}`);
  if (!byKind.cmp.length) noneCount[t.kind][ITEMS[13]] = (noneCount[t.kind][ITEMS[13]] ?? 0) + 1;
  L.push(`### ${ITEMS[13]}`, ...(C.length ? (byKind.cmp.length ? C : [`- 교재 비교표: ${NONE}`, ...C]) : [NONE]), "");

  // 15. 기타 — 어디에도 안 맞는 교재 표와 메모(서브노트 칸을 빼지 않으려고)
  const E = [...byKind.etc];
  for (const n of t.sub?.notes ?? []) E.push(`- 교재 메모: ${one(n)}`);
  if (E.length) L.push(`### 15. 기타 교재 표·메모`, ...E, "");
  return L.join("\n");
}

// ── 파일 나누기 ──
fs.mkdirSync(OUT, { recursive: true });
const summary: Record<string, unknown> = { domains: {} as Record<string, { files: number; topics: number; textbook: number; outside: number }> };
const allFiles: string[] = [];
const LEGEND = [
  "> 항목: 1 토픽명 · 중요도(상/중/하 — 없으면 등급 없음) · 2 도메인 · 3 교재 정의 · 4 정의 핵심 키워드 · 5 특징 · 6 필요성·등장배경 · 7 개념도 설명 · 8 구성요소 · 9 절차·프로세스 · 10 유형·종류 · 11 장단점·고려사항·활용 · 12 표준·법령·수치 · 13 출제 이력 · 14 비교 · 15 기타 교재 표·메모",
  "> 교재 표는 칸을 줄이지 않고 옮겼다(칸 안 줄바꿈은 「 / 」). 「교재에 없음」 = 교재 서브노트에 그 내용이 없다. 「(참고 · 출처)」 줄은 교재가 아닌 자료다. 출제 이력은 사이트 토픽 화면과 같은 제목 매칭이라 지문에 이름이 지나가듯 나온 문항도 섞여 있다.",
];
for (const d of DOMAINS) {
  const items = all.filter((t) => t.code === d.code).sort((a, b) => {
    // 중요도(상→중→하→그 밖→등급 없음) 다음 기출+NS+모의 합계 순(2026-11-24 — 그 전엔 기출 횟수 순)
    const ha = hist(a.name), hb = hist(b.name);
    return gradeRank(a) - gradeRank(b) || total(b) - total(a) || hb.past.length - ha.past.length || (a.kind === "교재" ? -1 : 1) - (b.kind === "교재" ? -1 : 1);
  });
  const files: { name: string; blocks: { t: Topic; md: string }[] }[] = [];
  let cur: { t: Topic; md: string }[] = [];
  const head = (n: number) => `# ${d.label}(${d.code}) 토픽DB ${String(n).padStart(2, "0")}\n\n${LEGEND.join("\n")}\n\n`;
  const size = (bs: { md: string }[], n: number) => bytes(head(n) + bs.map((b) => b.md).join("\n"));
  for (const t of items) {
    const md = block(t);
    const n = files.length + 1;
    if (cur.length && (cur.length >= MAX_TOPICS || size([...cur, { md }], n) > MAX_BYTES)) {
      files.push({ name: "", blocks: cur });
      cur = [];
    }
    cur.push({ t, md });
  }
  if (cur.length) files.push({ name: "", blocks: cur });
  const toc: string[] = [`# ${d.label}(${d.code}) 토픽DB 목차`, "", `교재 토픽 ${items.filter((t) => t.kind === "교재").length}개 · 기출 2회 이상 교재 밖 토픽 ${items.filter((t) => t.kind === "교재 밖").length}개 · 파일 ${files.length}개. 중요도(상→중→하) 다음 기출+NS+모의 합계가 많은 순.`, "", "| 순번 | 토픽명 | 중요도 | 구분 | 기출 | NS | 모의 | 합계 | 파일 |", "|---|---|---|---|---|---|---|---|---|"];
  let no = 0;
  files.forEach((f, i) => {
    f.name = `토픽DB_${d.code}_${String(i + 1).padStart(2, "0")}.md`;
    const body = head(i + 1) + f.blocks.map((b) => b.md).join("\n");
    fs.writeFileSync(`${OUT}/${f.name}`, body);
    allFiles.push(f.name);
    if (bytes(body) > MAX_BYTES) console.warn(`! ${f.name} ${bytes(body)}B — 토픽 하나가 40KB 를 넘는다`);
    for (const b of f.blocks) {
      const h = hist(b.t.name);
      toc.push(`| ${++no} | ${b.t.name.replace(/\|/g, "\\|")} | ${grade(b.t).g} | ${b.t.kind} | ${h.past.length} | ${h.ns.length} | ${h.mock.length} | ${h.past.length + h.ns.length + h.mock.length} | ${f.name} |`);
    }
  });
  fs.writeFileSync(`${OUT}/토픽DB_${d.code}_목차.md`, toc.join("\n") + "\n");
  (summary.domains as Record<string, unknown>)[d.code] = { label: d.label, files: files.length, topics: items.length, textbook: items.filter((t) => t.kind === "교재").length, outside: items.filter((t) => t.kind === "교재 밖").length, maxBytes: Math.max(...files.map((f) => bytes(fs.readFileSync(`${OUT}/${f.name}`, "utf8")))) };
}
summary.noneCount = noneCount;
summary.grades = { 교재: Object.fromEntries(["상", "중", "하", NO_GRADE].map((g) => [g, all.filter((t) => t.kind === "교재" && grade(t).g === g).length])), "교재 밖": Object.fromEntries([...new Set(all.filter((t) => t.kind === "교재 밖").map((t) => grade(t).g))].map((g) => [g, all.filter((t) => t.kind === "교재 밖" && grade(t).g === g).length])) };
console.log("중요도", JSON.stringify(summary.grades));
summary.totals = { textbook: all.filter((t) => t.kind === "교재").length, outside: all.filter((t) => t.kind === "교재 밖").length, files: allFiles.length };
fs.writeFileSync(`${OUT}/요약.json`, JSON.stringify(summary, null, 1));
console.log(JSON.stringify(summary.totals), Object.entries(summary.domains as Record<string, { files: number; maxBytes: number }>).map(([k, v]) => `${k}:${v.files}(${Math.round(v.maxBytes / 1000)}KB)`).join(" "));
