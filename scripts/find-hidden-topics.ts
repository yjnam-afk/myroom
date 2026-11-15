/**
 * 숨은 토픽 찾기 — 어느 토픽·서브 토픽에도 안 걸리는 문항의 주제(「한글(English)」·약어)를 묶어 세고,
 * 그 이름이 교재 서브노트(표·키워드·정의)에 있는지 본다.
 *
 *   npx tsx scripts/find-hidden-topics.ts [최소 출제 수=4] [out.json]
 *
 * 교재에 있으면 서브 토픽 후보(src/data/subTopics.ts), 없으면 교재 밖 토픽 후보(메모리 월·PIM 처럼 해설집에서 만든다).
 * 후보일 뿐이다 — 넓은 말·딴 뜻은 눈으로 걸러 넣고, 넣은 뒤 check-sub-topics.ts 를 돌린다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";

type Q = { id: string; text: string; period?: string; kind?: string; round?: string };
const MIN = Number(process.argv[2] || 4);
const bank = JSON.parse(readFileSync("src/data/questions.json", "utf8")) as Q[];
/** 예전(기필반) 토픽 — 교재 밖이어도 자기 화면이 있는 것 */
const legacy = (JSON.parse(readFileSync("src/data/topics.json", "utf8")) as { title: string }[]).map((t) => t.title);
const titles = [...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)];

const sq = (s: string) => s.toLowerCase().replace(/[\s\-_·./,'’"“”()[\]]/g, "");
/** 문항에서 주제 후보를 뽑는다: 「한글 이름(English Name)」, 영문 약어, 영문 구 */
function terms(text: string): { key: string; label: string }[] {
  const out = new Map<string, string>();
  const add = (label: string) => {
    const l = label.trim().replace(/\s+/g, " ");
    const k = sq(l);
    if (k.length < 2 || l.length > 60) return;
    if (!out.has(k)) out.set(k, l);
  };
  // 한글 이름(English) — 괄호 앞 한글 낱말 1~3개 + 괄호 속 영문
  for (const m of text.matchAll(/([가-힣A-Za-z0-9][가-힣A-Za-z0-9\- ]{0,24}?)\s*\(([A-Za-z][A-Za-z0-9 \-–,.&/'’]{1,60})\)/g)) {
    const en = m[2].trim();
    add(en);
    const ko = m[1].trim().split(/\s+/).slice(-3).join(" ");
    if (/[가-힣]/.test(ko)) add(`${ko}(${en})`);
  }
  // 약어·영문 구(2낱말 이상 또는 대문자 약어)
  for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9\-+.]*(?: [A-Za-z0-9][A-Za-z0-9\-+.]*){0,4}/g)) {
    const w = m[0].replace(/[.\-]+$/, "");
    if (/^[A-Z][A-Z0-9\-+/]{1,9}$/.test(w) || /\s/.test(w)) add(w);
    else if (w.length >= 4) add(w);
  }
  return [...out].map(([key, label]) => ({ key, label }));
}

/** 주제가 못 되는 흔한 말 */
const STOP = new Set(
  ("ai it sw hw ict cpu iso ip tcp db dbms api os pc tv id ui ux pm eu ieee iec itu ietf network server layer test framework function module application agent mapping governance tuning architect " +
    "system service data model software computer computing internet web mobile cloud platform protocol standard process project management security information technology digital smart open " +
    "client user device memory storage code program design analysis control access level type class object method pattern architecture algorithm structure language tool engine interface " +
    "인공지능ai 소프트웨어sw").split(" ").map(sq),
);
/** 한 줄짜리 문항의 주제부 — 「○○에 대하여」「○○을 설명」 앞 */
function subject(text: string): string | null {
  if (text.includes("\n")) return null;
  let t = text.replace(/\([^)]*\)/g, "").replace(/^[\s\d.\-)]+/, "").trim();
  const m = t.match(/^(.{2,24}?)(?:에 대하여|에 대해|에 관하여|에 관해|을 설명|를 설명|이란|란 무엇|의 개념|의 정의|의 종류|의 유형|의 특징|의 구성|의 원리|의 동작|의 장단점|의 필요성|을 비교|를 비교|$)/);
  if (!m) return null;
  t = m[1].trim();
  if (/[,·]| 및 |와 |과 |\/| 비교/.test(t) || !/[가-힣]/.test(t) || t.length < 3) return null;
  return t;
}

const un: Q[] = [];
for (const q of bank) if (!titlesMatching(q.text, titles).length) un.push(q);
console.log(`문항 ${bank.length} · 어느 토픽에도 안 걸림 ${un.length}`);

const cnt = new Map<string, { label: Map<string, number>; qs: Q[] }>();
for (const q of un)
  for (const t of [...terms(q.text), ...(subject(q.text) ? [{ key: sq(subject(q.text)!), label: subject(q.text)! }] : [])].filter((t, i, a) => !STOP.has(t.key) && a.findIndex((x) => x.key === t.key) === i)) {
    let e = cnt.get(t.key);
    if (!e) cnt.set(t.key, (e = { label: new Map(), qs: [] }));
    e.label.set(t.label, (e.label.get(t.label) || 0) + 1);
    e.qs.push(q);
  }
// 한글(English) 꼴 열쇠는 English 열쇠와 겹친다 — English 쪽으로 합친다
const book = SUBNOTES.map((s) => ({ title: s.title, raw: JSON.stringify([s.definition, s.keywords, s.tables, s.notes]).replace(/\\n/g, " ") }));
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 교재 글에 그 이름이 낱말로 서 있는가(영문은 앞뒤가 영문·숫자가 아닐 때, 한글은 그대로) */
function inBook(label: string): string[] {
  const en = label.match(/\(([^)]+)\)$/)?.[1];
  const ko = label.replace(/\([^)]*\)$/, "").trim();
  const pats: RegExp[] = [];
  for (const w of [en, /[가-힣]/.test(ko) ? null : ko].filter(Boolean) as string[]) pats.push(new RegExp(`(?<![A-Za-z0-9])${esc(w).replace(/[ \-]/g, "[ \\-]?")}(?![A-Za-z0-9])`, "i"));
  if (/[가-힣]/.test(ko) && ko.replace(/\s/g, "").length >= 3) pats.push(new RegExp(esc(ko).replace(/ /g, " ?")));
  return book.filter((b) => pats.some((p) => p.test(b.raw))).map((b) => b.title);
}
/** 제목에 그 이름이 든 토픽(있는데 안 걸렸다 = 별칭·TRAP 문제) */
function inTitle(label: string): string[] {
  const en = label.match(/\(([^)]+)\)$/)?.[1];
  const ko = label.replace(/\([^)]*\)$/, "").trim();
  const ks = [en, ko].filter((x): x is string => !!x && sq(x).length >= 3).map(sq);
  return titles.filter((t) => ks.some((k) => sq(t).includes(k)));
}
const rows = [...cnt]
  .map(([key, e]) => {
    const label = [...e.label].sort((a, b) => b[1] - a[1])[0][0];
    const past = e.qs.filter((q) => /^[kc]\d/.test(q.id)).length;
    const ns = e.qs.filter((q) => q.id.startsWith("ns")).length;
    const where = inBook(label);
    const title = inTitle(label);
    const en = label.match(/\(([^)]+)\)$/)?.[1];
    const lk = [en, label.replace(/\([^)]*\)$/, "").trim()].filter((x): x is string => !!x && sq(x).length >= 3).map(sq);
    const old = legacy.filter((t) => lk.some((k) => sq(t).includes(k))).slice(0, 2);
    return { key, label, n: e.qs.length, past, ns, title, old, where: where.slice(0, 4), whereN: where.length, sample: e.qs.slice(0, 3).map((q) => `${q.id} ${q.text.split("\n")[0].slice(0, 70)}`) };
  })
  .filter((r) => r.n >= MIN)
  .sort((a, b) => b.past * 3 + b.ns * 2 + b.n - (a.past * 3 + a.ns * 2 + a.n));
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(rows, null, 1));
for (const r of rows.slice(0, 900))
  console.log(`${String(r.n).padStart(3)} 기출${String(r.past).padStart(2)} NS${String(r.ns).padStart(2)} | ${r.label} | ${r.title.length ? "★제목에 있음: " + r.title.slice(0, 2).join(" / ") + " · " : ""}${r.whereN ? "교재: " + r.where.join(" / ") + (r.whereN > 4 ? ` 외 ${r.whereN - 4}` : "") : "교재 밖"}${r.old.length ? " · 예전 토픽: " + r.old.join(" / ") : ""}`);
