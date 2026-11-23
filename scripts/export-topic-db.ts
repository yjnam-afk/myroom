/**
 * 토픽 DB 내보내기 — 교재 토픽(서브노트) + 교재 밖 토픽(지도의 examTopics)을 마크다운 한 파일로.
 * 2026-11-23 "정리된 토픽 데이터 전체(전 도메인)를 하나의 마크다운 파일로 내보내 줘".
 *
 *   npx tsx scripts/export-topic-db.ts [out.md]
 *   npx tsx scripts/export-topic-db.ts <폴더> --by-domain   — 도메인마다 토픽DB_{코드}.md, 교재 토픽만(2026-11-23 요청)
 *
 * 토픽마다: 토픽명 · 도메인 · 교재 정의(원문, **굵게** = 교재 강조어) · 정의 핵심 키워드 3개 · 구성요소/프로세스 키워드 ·
 * 출제 이력(기출·NS·모의) · 같이 비교되는 토픽. 데이터에 없는 칸은 「없음」 — 지어 넣지 않는다.
 * - 정의 핵심 키워드: 정의 속 굵은 말(교재 색 강조) → 교재 키워드 중 정의 문장에 그대로 든 말, 차례대로 3개.
 * - 구성요소/프로세스: 교재 표 중 캡션에 구성·요소·절차·단계·프로세스·구조·유형이 든 표(없으면 비교표가 아닌 첫 표)의 이름 칸.
 * - 출제 이력: 토픽 화면과 같은 제목 열쇠(examHistory) — 기출(정보관리·컴시응), NS 주간 모의고사, ITPE·KPC 모의·파이널·셀테.
 * - 같이 비교되는 토픽: 문제 문장에 「비교·차이·vs」가 든 문항에 함께 걸린 토픽(문항 수) + 교재 정의가 개념별로 나뉜 짝(defPair) + 사실상 같은 토픽.
 * 교재 밖 토픽은 교재 정의가 없다. 해설집에서 옮긴 정리(examNotes)나 예전(기필반) 자료가 있으면 「참고」 줄로 출처를 달아 붙인다.
 */
import fs from "fs";
import { SUBNOTES, type TextbookSubnote, type SubnoteTable } from "../src/data/textbookSubnotes";
import examTopics from "../src/data/examTopics.json";
import { examNoteFor } from "../src/data/examNotes";
import topics from "../src/data/topics.json";
import topicDetails from "../src/data/topicDetails.json";
import { TWIN_TOPICS } from "../src/data/twinTopics";
import { DOMAINS } from "../src/lib/domains";
import defKeyFile from "./export-topic-db.defkeys.json";
import { pastExams, examHistory, mockExams, questionIdsForTitle, QUESTION_BY_ID } from "../src/lib/examHistory";

const OUT = process.argv[2] || "기술사_전도메인_토픽DB.md";
const one = (s: string) => s.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
const plain = (s: string) => s.replace(/\*\*/g, "");
const squash = (s: string) => plain(s).replace(/[\s·・,()（）\-/]/g, "").toLowerCase();

type Ex = { name: string; code: string; area: string; group: string; n: number; past: number; under?: string; legacy?: boolean };
type Topic = {
  name: string;
  code: string;
  kind: "교재" | "교재 밖";
  sub?: TextbookSubnote;
  ex?: Ex;
};

const all: Topic[] = [
  ...SUBNOTES.map((s) => ({ name: s.title, code: s.course, kind: "교재" as const, sub: s })),
  ...(examTopics as Ex[]).map((e) => ({ name: e.name, code: e.code, kind: "교재 밖" as const, ex: e })),
];

// ── 정의 핵심 키워드 ──
function defKeywords(s: TextbookSubnote): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const t = one(plain(k));
    if (t && !out.some((o) => squash(o) === squash(t))) out.push(t);
  };
  for (const m of s.definition.matchAll(/\*\*([^*]+)\*\*/g)) add(m[1]);
  const d = squash(s.definition);
  for (const k of s.keywords ?? []) {
    if (out.length >= 3) break;
    const t = one(k);
    if (t.length >= 2 && d.includes(squash(t))) add(t);
  }
  // 모자라면 정의 문장에서 고른 말(export-topic-db.defkeys.json — 정의 속 글자 그대로인 것만 쓴다)
  for (const k of DEFKEYS[s.title] ?? []) {
    if (out.length >= 3) break;
    if (squash(k).length >= 2 && d.includes(squash(k))) add(k);
  }
  return out.slice(0, 3);
}
const DEFKEYS = defKeyFile as Record<string, string[]>;

// ── 구성요소·프로세스 ──
const isGroupHead = (h: string) => /^(구분|분류|유형|관점|측면|단계|계층|영역|범주)$/.test(h.trim());
const NUM = /^[①-⑳\d.\s)*\-–·•※→]*$/;
function names(t: SubnoteTable): string[] {
  const rows = t.rows.filter((r) => r.length && one(r[0] ?? ""));
  if (t.headers.length >= 3 && isGroupHead(t.headers[0])) {
    const by = new Map<string, string[]>();
    for (const r of rows) {
      const k = one(r[0]);
      const v = one(r[1] ?? "");
      if (!v || v === k || NUM.test(v)) continue;
      by.set(k, [...(by.get(k) ?? []), v]);
    }
    if (by.size && [...by.values()].some((v) => v.length > 1)) return [...by].map(([k, v]) => `${k}(${v.join(", ")})`);
  }
  return [...new Set(rows.map((r) => one(r[0])).filter((x) => x && !NUM.test(x)))];
}
const PART = /구성|요소|절차|프로세스|단계|구조|아키텍처|유형|종류|기법|메커니즘|동작/;
const NOT_PART = /비교|차이|장단점|장점|단점|기대\s*효과|고려사항/;
function partsOfTables(tables: SubnoteTable[]): { caption: string; items: string[] }[] {
  const ok = tables.filter((t) => !NOT_PART.test(t.caption));
  const picked = ok.filter((t) => PART.test(t.caption)).slice(0, 2);
  const use = picked.length ? picked : ok.slice(0, 1);
  return use.map((t) => ({ caption: one(t.caption), items: names(t) })).filter((x) => x.items.length);
}

// ── 예전(기필반) 자료 ──
const LEGACY_ID = new Map<string, string>();
for (const t of topics as { id: string; title: string }[]) if (!LEGACY_ID.has(t.title)) LEGACY_ID.set(t.title, t.id);
const DETAIL = topicDetails as Record<string, { detail?: string }>;
function legacySection(name: string, sec: RegExp): string[] {
  const id = LEGACY_ID.get(name);
  const d = id ? DETAIL[id]?.detail : undefined;
  if (!d) return [];
  const parts = d.split(/\n(?=\[)/);
  const p = parts.find((x) => sec.test(x.slice(0, 20)));
  if (!p) return [];
  return p.replace(/^\[[^\]]+\]\s*/, "").split("\n").map((l) => l.trim()).filter(Boolean);
}

// ── 출제 이력 ──
type Hist = { past: string[]; ns: string[]; mock: string[]; ids: Set<string> };
const histCache = new Map<string, Hist>();
function hist(name: string): Hist {
  const c = histCache.get(name);
  if (c) return c;
  const past = pastExams(name).map((p) => `${p.track === "컴시응" ? "컴시응 " : ""}${p.round}회 ${p.period} ${p.no}번`);
  const ns = examHistory(name).map((e) => {
    const m = /-(\d)(\d{2})$/.exec(e.id);
    return `NS ${e.cohort} ${e.round.replace(/^0/, "")} ${e.period}${m ? ` ${Number(m[2])}번` : ""}`.replace(/\s+/g, " ");
  });
  const mock = mockExams(name).map((m) => m.source);
  const h = { past, ns, mock, ids: new Set(questionIdsForTitle(name)) };
  histCache.set(name, h);
  return h;
}

/** 같은 글자가 이어지면 「×2」로 묶는다(같은 시험 같은 교시에 두 문항) */
const joinX = (xs: string[]) => {
  const out: [string, number][] = [];
  for (const x of xs) {
    const last = out[out.length - 1];
    if (last && last[0] === x) last[1]++;
    else out.push([x, 1]);
  }
  return out.map(([x, n]) => (n > 1 ? `${x} ×${n}` : x)).join(", ");
};

// ── 같이 비교되는 토픽 ──
const COMPARE_Q = /비교|차이|\bvs\b|VS|대비하여/;
const BY_Q = new Map<string, string[]>();
for (const t of all) {
  for (const id of hist(t.name).ids) {
    const q = QUESTION_BY_ID.get(id);
    if (!q || !COMPARE_Q.test(q.text)) continue;
    if (!BY_Q.has(id)) BY_Q.set(id, []);
    BY_Q.get(id)!.push(t.name);
  }
}
const CMP = new Map<string, Map<string, number>>();
for (const ts of BY_Q.values()) {
  const u = [...new Set(ts)];
  if (u.length < 2 || u.length > 6) continue; // 넓은 열쇠로 많이 걸린 문항은 짝으로 세지 않는다
  for (const a of u)
    for (const b of u) {
      if (a === b) continue;
      if (!CMP.has(a)) CMP.set(a, new Map());
      CMP.get(a)!.set(b, (CMP.get(a)!.get(b) ?? 0) + 1);
    }
}
function compares(t: Topic): string[] {
  const out: string[] = [];
  for (const p of t.sub?.defPair ?? []) out.push(`${p.name}(교재 정의 짝)`);
  for (const w of TWIN_TOPICS) {
    if (w.a === t.name) out.push(`${w.b}(사실상 같은 토픽)`);
    if (w.b === t.name) out.push(`${w.a}(사실상 같은 토픽)`);
  }
  const m = CMP.get(t.name);
  if (m) for (const [b, n] of [...m].sort((x, y) => y[1] - x[1]).slice(0, 6)) out.push(`${b}(비교 문항 ${n})`);
  return out;
}

// ── 쓰기 ──
const NONE = "없음";
const LABEL: Record<string, string> = Object.fromEntries(DOMAINS.map((d) => [d.code, d.label]));
const HEAD_NOTES = [
  "- 교재 정의는 서브노트 원문 그대로다. **굵은 글씨**는 교재에서 색으로 강조된 채점 키워드다.",
  "- 정의 핵심 키워드: 정의 속 굵은 말 → 교재 키워드 중 정의 문장에 그대로 든 말, 차례대로 3개(모자라면 있는 만큼).",
  "- 구성요소·프로세스: 교재 표(캡션에 구성·요소·절차·단계·유형 등이 든 표)의 이름 칸. 「캡션: 항목, 항목」 꼴.",
  "- 출제 이력: 사이트 토픽 화면과 같은 제목 매칭. 기출 = 정보관리(회·교시·번호), 「컴시응」 = 컴퓨터시스템응용. NS = 주간 모의고사. 모의 = ITPE·KPC 모의고사·파이널·셀테.",
  "  제목 열쇠로 찾은 것이라 지문에 토픽 이름이 지나가듯 나온 문항도 들어 있다.",
  "- 같이 비교되는 토픽: 문제 문장에 「비교·차이·vs」가 든 문항에 함께 걸린 토픽(괄호 = 그런 문항 수), 교재 정의가 개념별로 나뉜 짝, 사실상 같은 토픽.",
  "- 도메인 안 차례: 기출 횟수 많은 순 → 같으면 전체 출제 횟수 많은 순.",
];
let lines: string[] = [];
const BY_DOMAIN = process.argv.includes("--by-domain");
const total = (h: Hist) => h.past.length + h.ns.length + h.mock.length;
const counts = { 교재: 0, "교재 밖": 0 };

lines.push("# 정보관리기술사 전 도메인 토픽 DB");
lines.push("");
lines.push(`- 만든 날: ${new Date().toISOString().slice(0, 10)} · 출처: myroom 학습 사이트 데이터(교재 서브노트 · 문제은행 · 해설집 정리 · 토픽 지도)`);
lines.push("- 교재 토픽 = 심화반 교재 서브노트가 있는 토픽. 교재 밖 토픽 = 기출·모의고사에 나왔지만 교재에 없는 주제(토픽 지도의 노란 칩).");
for (const l of HEAD_NOTES) lines.push(l);
lines.push("- 데이터에 없는 칸은 「없음」. 교재 밖 토픽의 「참고」 줄은 해설집에서 옮긴 정리나 예전(기필반) 자료이고 출처를 적었다(교재 정의가 아니다).");
lines.push("");

const byDomain = DOMAINS.map((d) => ({ d, items: all.filter((t) => t.code === d.code) }));
lines.push("## 목차");
lines.push("");
for (const { d, items } of byDomain) {
  const tb = items.filter((t) => t.kind === "교재").length;
  lines.push(`- ${d.label}(${d.code}) — 교재 토픽 ${tb} · 교재 밖 토픽 ${items.length - tb}`);
}
lines.push("");

const written: string[] = [];
for (const { d, items: allItems } of byDomain) {
  const items = BY_DOMAIN ? allItems.filter((t) => t.kind === "교재") : allItems;
  if (BY_DOMAIN) {
    lines = [
      `# 정보관리기술사 ${d.label}(${d.code}) 토픽 DB — 교재 토픽 ${items.length}개`,
      "",
      `- 만든 날: ${new Date().toISOString().slice(0, 10)} · 출처: myroom 학습 사이트 데이터(교재 서브노트 · 문제은행)`,
      "- 교재 토픽만 담았다(심화반 교재 서브노트가 있는 토픽). 교재 밖 토픽은 기술사_전도메인_토픽DB.md 에 있다.",
      ...HEAD_NOTES,
      "",
    ];
  }
  items.sort((a, b) => {
    const ha = hist(a.name), hb = hist(b.name);
    return hb.past.length - ha.past.length || total(hb) - total(ha) || (a.kind === "교재" ? -1 : 1) - (b.kind === "교재" ? -1 : 1);
  });
  lines.push(`# ${d.label} (${d.code})`);
  lines.push("");
  for (const t of items) {
    counts[t.kind]++;
    const h = hist(t.name);
    lines.push(`## ${t.name}`);
    lines.push("");
    lines.push(`- **구분**: ${t.kind} 토픽${t.ex ? ` · 지도 자리 ${t.ex.area} › ${t.ex.group}${t.ex.under ? ` › ${t.ex.under} 아래` : ""}` : ""}`);
    lines.push(`- **도메인**: ${d.label}(${d.code})`);
    if (t.sub) {
      const s = t.sub;
      lines.push(`- **교재 정의**: ${one(s.definition) || NONE}`);
      for (const p of s.defPair ?? []) lines.push(`  - ${p.name}: ${p.def}`);
      for (const p of s.subDefs ?? []) lines.push(`  - (하위 개념) ${p.name}: ${p.def}`);
      const k = defKeywords(s);
      lines.push(`- **정의 핵심 키워드**: ${k.length ? k.join(" · ") : NONE}`);
      const parts = partsOfTables(s.tables ?? []);
      lines.push(`- **구성요소·프로세스 키워드**:${parts.length ? "" : " " + NONE}`);
      for (const p of parts) lines.push(`  - ${p.caption}: ${p.items.join(", ")}`);
    } else {
      lines.push(`- **교재 정의**: ${NONE}(교재 밖 토픽)`);
      const note = examNoteFor(t.name);
      const legDef = legacySection(t.name, /^\[정의/);
      if (note?.definition) lines.push(`  - 참고 정의(해설집 — ${note.source.exam.replace(/\s*\(.*$/, "")}): ${one(note.definition)}`);
      else if (legDef.length) lines.push(`  - 참고 정의(예전 기필반 자료): ${one(legDef.join(" "))}`);
      lines.push(`- **정의 핵심 키워드**: ${NONE}`);
      if (note?.keywords?.length) lines.push(`  - 참고 키워드(해설집): ${note.keywords.slice(0, 7).join(" · ")}`);
      const nt = (note?.tables ?? []) as SubnoteTable[];
      const parts = partsOfTables(nt);
      const legParts = legacySection(t.name, /^\[(구성요소|절차|프로세스|기술요소|유형)/)
        .map((l) => l.replace(/^-\s*/, "").split(/[:：]/)[0].trim())
        .filter((x) => x && x.length <= 40);
      if (parts.length) {
        lines.push(`- **구성요소·프로세스 키워드**:`);
        for (const p of parts) lines.push(`  - (해설집) ${p.caption}: ${p.items.join(", ")}`);
      } else if (legParts.length) lines.push(`- **구성요소·프로세스 키워드**: (예전 기필반 자료) ${legParts.join(", ")}`);
      else lines.push(`- **구성요소·프로세스 키워드**: ${NONE}`);
    }
    lines.push(`- **출제 횟수**: 기출 ${h.past.length} · NS ${h.ns.length} · 모의 ${h.mock.length} (합계 ${total(h)})`);
    if (total(h)) {
      lines.push(`- **출제 이력**:`);
      if (h.past.length) lines.push(`  - 기출: ${joinX(h.past)}`);
      if (h.ns.length) lines.push(`  - NS: ${joinX(h.ns)}`);
      if (h.mock.length) lines.push(`  - 모의: ${joinX(h.mock)}`);
    } else lines.push(`- **출제 이력**: ${NONE}`);
    const c = compares(t);
    lines.push(`- **같이 비교되는 토픽**: ${c.length ? c.join(" · ") : NONE}`);
    lines.push("");
  }
  if (BY_DOMAIN) {
    fs.mkdirSync(OUT, { recursive: true });
    const f = `${OUT}/토픽DB_${d.code}.md`;
    fs.writeFileSync(f, lines.join("\n"));
    written.push(`${f} ${items.length}`);
  }
}

if (BY_DOMAIN) {
  console.log(written.join("\n"));
  process.exit(0);
}
fs.writeFileSync(OUT, lines.join("\n"));
console.log(`${OUT} — 교재 토픽 ${counts["교재"]} · 교재 밖 토픽 ${counts["교재 밖"]} · ${(fs.statSync(OUT).size / 1e6).toFixed(1)}MB`);
