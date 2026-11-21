/**
 * 토픽 조사 — 문제은행 전체(기출·NS·모의·파이널·셀테·합숙)를 문항마다 「어느 토픽에 정리돼 있나」로 나눈다.
 *
 *   npx tsx scripts/survey-topics.ts [out.json]
 *
 * 2026-11-22 "기존 기출문제에 나오는 토픽 하나하나가 다 정리되어야 하는거야 — 기출, 모의고사 등등등 다 포함해서 토픽 조사".
 * 갈래: A 교재 토픽(서브노트 — 정의·표·답안지 템플릿)에 걸림 · B 서브 토픽(교재 표 행 + 기필반 카드)에만 걸림 · 나머지 = 교재 밖.
 * 교재 밖 문항은 **첫 줄의 주제 하나**(「한글(English)」의 영문 → 「○○에 대하여」의 ○○ → 이름만 적힌 단답형 → 첫 약어)로 묶어 토픽 후보로 세고,
 * 후보마다 같은 이름의 예전(기필반) 토픽 화면이 있는지 붙인다. 예전 토픽을 문구로 맞추지 않는 까닭: 제목이 「특징」「절차」「종류」「Network(3)」 같은 것이
 * 섞여 있어 아무 문항이나 끌어온다. 후보일 뿐이다 — 넓은 말·상황형 지문은 눈으로 거른다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";
import { PEER_ANSWERS } from "@/data/peerAnswers";
import { isCommentary } from "@/lib/answerKind";

type Q = { id: string; text: string; kind?: string; source?: string; category?: string; period?: string };
const bank = JSON.parse(readFileSync("src/data/questions.json", "utf8")) as Q[];
const legacyAll = JSON.parse(readFileSync("src/data/topics.json", "utf8")) as { title: string; source?: string }[];
const book = SUBNOTES.map((s) => s.title);
const subs = SUB_TOPICS.map((s) => s.name);
const bookSet = new Set(book);
const legacy = [...new Set(legacyAll.map((t) => t.title).filter((t) => !bookSet.has(t)))];

/** 출처 갈래 — 기출(정보관리 k · 컴시응 c) / NS / ITPE 모의·파이널·셀테 / KPC 모의 / 합숙 */
const srcOf = (q: Q) =>
  /^k\d/.test(q.id) ? "기출(정보관리)" : /^c\d/.test(q.id) ? "기출(컴시응)" : q.id.startsWith("ns") ? "NS 주간모의" : /합숙/.test(q.source ?? "") ? "합숙" : /^KPC/.test(q.source ?? "") ? "KPC 모의" : q.kind === "파이널" ? "ITPE 파이널" : q.kind === "셀테" ? "셀테" : "ITPE·명품 모의";

const sq = (s: string) => s.toLowerCase().replace(/[\s\-_·./,'’"“”()[\]]/g, "");
const STOP = new Set(
  ("ai it sw hw ict cpu iso ip tcp db dbms api os pc tv id ui ux pm eu ieee iec itu ietf network server layer test framework function module application agent mapping governance tuning architect " +
    "system service data model software computer computing internet web mobile cloud platform protocol standard process project management security information technology digital smart open " +
    "client user device memory storage code program design analysis control access level type class object method pattern architecture algorithm structure language tool engine interface " +
    "인공지능ai 소프트웨어sw").split(" ").map(sq),
);
/** 문항의 주제 후보 — 「한글(English)」, 약어, 한 줄 문항의 주제부 */
function terms(text: string): { key: string; label: string }[] {
  const out = new Map<string, string>();
  const add = (label: string) => {
    const l = label.trim().replace(/\s+/g, " ");
    const k = sq(l);
    if (k.length < 2 || l.length > 60 || STOP.has(k)) return;
    if (!out.has(k)) out.set(k, l);
  };
  for (const m of text.matchAll(/([가-힣A-Za-z0-9][가-힣A-Za-z0-9\- ]{0,24}?)\s*\(([A-Za-z][A-Za-z0-9 \-–,.&/'’]{1,60})\)/g)) add(m[2]);
  for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9\-+.]*(?: [A-Za-z0-9][A-Za-z0-9\-+.]*){0,4}/g)) {
    const w = m[0].replace(/[.\-]+$/, "");
    if (/^[A-Z][A-Z0-9\-+/]{1,9}$/.test(w) || /\s/.test(w) || w.length >= 4) add(w);
  }
  const first = text.split("\n")[0].replace(/\([^)]*\)/g, "").replace(/^[\s\d.\-)]+/, "").trim();
  const m = first.match(/^(.{2,24}?)(?:에 대하여|에 대해|에 관하여|에 관해|을 설명|를 설명|이란|란 무엇|의 개념|의 정의|의 종류|의 유형|의 특징|의 구성|의 원리|의 동작|의 장단점|과 관련하여|와 관련하여)/);
  if (m && /[가-힣]/.test(m[1]) && !/[,·]| 및 |와 |과 |\/| 비교/.test(m[1]) && m[1].trim().length >= 3) add(m[1]);
  else if (!text.includes("\n") && first.length <= 24 && /[가-힣]/.test(first) && !/설명|하시오|비교/.test(first)) add(first); // 「익명 네트워크 TOR」처럼 이름만 적힌 단답형
  return [...out].map(([key, label]) => ({ key, label }));
}

// ── 한글 이름 ↔ 영문 이름 — 문제은행 전체의 「한글(English)」에서 모은다(같은 주제를 한 묶음으로) ──
const ko2en = new Map<string, Map<string, number>>();
const enLabel = new Map<string, Map<string, number>>();
const PAIR = /([가-힣A-Za-z0-9][가-힣A-Za-z0-9\- ]{0,24}?)\s*\(([A-Za-z][A-Za-z0-9 \-–,.&/'’:]{1,60})\)/g;
const koHead = (x: string) => x.trim().split(/\s+/).slice(-3).join(" ");
/** 괄호 앞 한글 이름 후보 — 끝 1·2·3낱말. 「많이 사용하는 TCP」에서 「TCP」를 고르려고 낱말 수별로 센다 */
const koTails = (x: string) => {
  const w = x.trim().split(/\s+/).slice(-3);
  return w.map((_, i) => w.slice(i).join(" "));
};
/** 「RPC」처럼 괄호 속에 약어가 붙은 것(Remote Procedure Call : RPC)은 긴 쪽만 */
const enOf = (x: string) => x.split(/\s*[:,]\s*/).sort((a, b) => b.length - a.length)[0].trim();
for (const q of bank)
  for (const m of q.text.matchAll(PAIR)) {
    const ko = koHead(m[1]);
    const en = enOf(m[2]);
    if (!/[가-힣]/.test(ko) || sq(en).length < 2) continue;
    const a = ko2en.get(sq(ko)) ?? new Map();
    a.set(sq(en), (a.get(sq(en)) ?? 0) + 1);
    ko2en.set(sq(ko), a);
    const l = enLabel.get(sq(en)) ?? new Map();
    for (const t of koTails(m[1])) if (/[가-힣A-Z]/.test(t)) l.set(`${t}(${en})`, (l.get(`${t}(${en})`) ?? 0) + 1);
    enLabel.set(sq(en), l);
  }
const top = (m?: Map<string, number>) => (m && m.size ? [...m].sort((a, b) => b[1] - a[1])[0][0] : undefined);
/** 이름표 — 가장 흔한 것. 같으면 영문 낱말 수와 한글 낱말 수가 가까운 것(「네트워크 스캐닝(Network Scanning)」), 한글이 약어 하나면 그것 */
const bestLabel = (m?: Map<string, number>) => {
  if (!m || !m.size) return undefined;
  const words = (x: string) => x.trim().split(/\s+/).length;
  return [...m].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    const [ka, ea] = [a[0].replace(/\(.*$/, ""), a[0].replace(/^.*\(/, "")];
    const [kb, eb] = [b[0].replace(/\(.*$/, ""), b[0].replace(/^.*\(/, "")];
    return Math.abs(words(ka) - Math.min(3, words(ea))) - Math.abs(words(kb) - Math.min(3, words(eb)));
  })[0][0];
};
const canon = (key: string) => top(ko2en.get(key)) ?? key;

const TAIL = /(?:에 대하여|에 대해|에 관하여|에 관해|을 설명|를 설명|이란|란 무엇|의 개념|의 정의|의 종류|의 유형|의 특징|의 구성|의 원리|의 동작|의 장단점|과 관련하여|와 관련하여)/;
/** 문항의 주제 하나 — 첫 줄에서 뽑는다. 못 뽑으면 null(상황형·계산형 지문) */
function primary(text: string): { key: string; label: string } | null {
  const first = text.split("\n")[0].replace(/^[\s\d.\-)]+/, "").trim();
  const cut = first.search(TAIL);
  const headPart = cut > 0 ? first.slice(0, cut + 12) : first;
  const m = [...headPart.matchAll(PAIR)].find((x) => !STOP.has(sq(enOf(x[2]))));
  if (m) {
    const en = enOf(m[2]);
    return { key: sq(en), label: `${koHead(m[1])}(${en})` };
  }
  const bare = first.replace(/\([^)]*\)/g, "").trim();
  const s = bare.match(new RegExp(`^(.{2,24}?)${TAIL.source}`));
  if (s && !/[,·]| 및 |와 |과 | 비교/.test(s[1]) && s[1].trim().length >= 2 && !STOP.has(sq(s[1]))) return { key: canon(sq(s[1])), label: s[1].trim() };
  // 「A와 B를 비교하여 설명」 — 앞 개념 A 로 묶는다
  const two = bare.match(/^([가-힣A-Za-z0-9/\- ]{2,20}?)(?:와|과)\s+[가-힣A-Za-z0-9/\- ]{2,24}?(?:을|를|의)\s*(?:비교|차이)/);
  if (two && !STOP.has(sq(two[1]))) return { key: canon(sq(two[1])), label: two[1].trim() };
  if (!text.includes("\n") && bare.length <= 28 && !/설명|하시오|비교|[,·]| 및 |와 |과 /.test(bare) && sq(bare).length >= 2 && !STOP.has(sq(bare))) return { key: canon(sq(bare)), label: bare };
  const ac = [...headPart.matchAll(/[A-Za-z][A-Za-z0-9\-+.]*(?: [A-Za-z0-9][A-Za-z0-9\-+.]*){0,4}/g)].map((x) => x[0].replace(/[.\-]+$/, "")).find((w) => !STOP.has(sq(w)) && (/^[A-Z][A-Z0-9\-+/]{1,9}$/.test(w) || /\s/.test(w)));
  if (ac) return { key: sq(ac), label: ac };
  return null;
}

type Row = { q: Q; src: string; cls: "A" | "B" | "X"; topics: string[] };
const rows: Row[] = bank.map((q) => {
  const a = titlesMatching(q.text, book);
  if (a.length) return { q, src: srcOf(q), cls: "A", topics: a };
  const b = titlesMatching(q.text, subs);
  if (b.length) return { q, src: srcOf(q), cls: "B", topics: b };
  return { q, src: srcOf(q), cls: "X", topics: [] };
});

// ── 예전(기필반) 토픽 이름 열쇠 — 제목 전체 · 괄호 앞 · 괄호 속이 주제와 같을 때만 「화면 있음」 ──
const legacyBy = new Map<string, string>();
for (const t of legacy) {
  const main = t.replace(/\s*[(（][^)）]*[)）]\s*/g, " ").trim();
  const paren = t.match(/[(（]([^)）]+)[)）]/)?.[1];
  for (const k of [t, main, ...(paren && /[A-Za-z가-힣]{3}/.test(paren) ? [paren] : [])]) {
    const key = sq(k);
    if (key.length >= 2 && !legacyBy.has(key)) legacyBy.set(key, t);
    if (key.length >= 2 && !legacyBy.has(canon(key))) legacyBy.set(canon(key), t);
  }
}

// ── 교재 밖 문항을 주제로 묶기 ──
const by = new Map<string, { label: Map<string, number>; rs: Row[] }>();
const noName: Row[] = [];
for (const r of rows.filter((r) => r.cls === "X")) {
  const p = primary(r.q.text);
  if (!p) {
    noName.push(r);
    continue;
  }
  let e = by.get(p.key);
  if (!e) by.set(p.key, (e = { label: new Map(), rs: [] }));
  e.label.set(p.label, (e.label.get(p.label) ?? 0) + 1);
  e.rs.push(r);
}
const isPast = (r: Row) => r.src.startsWith("기출");
// 문항에 직접 걸린 답안 — 해설집(정리할 원문)과 손글씨 모범답안
const comBy = new Map<string, number>();
const ansBy = new Map<string, number>();
for (const a of PEER_ANSWERS) for (const id of a.questionIds ?? []) (isCommentary(a) ? comBy : ansBy).set(id, ((isCommentary(a) ? comBy : ansBy).get(id) ?? 0) + 1);
const list = [...by].map(([key, e]) => {
  const rs = e.rs;
  const cats = new Map<string, number>();
  for (const r of rs) if (r.q.category) cats.set(r.q.category, (cats.get(r.q.category) ?? 0) + 1);
  return {
    key,
    name: bestLabel(enLabel.get(key)) ?? top(e.label)!,
    n: rs.length,
    past: rs.filter(isPast).length,
    ns: rs.filter((r) => r.src === "NS 주간모의").length,
    cat: top(cats) ?? "",
    legacy: legacyBy.get(key) ?? "",
    com: rs.reduce((k, r) => k + (comBy.get(r.q.id) ?? 0), 0),
    ans: rs.reduce((k, r) => k + (ansBy.get(r.q.id) ?? 0), 0),
    qs: rs.map((r) => ({ id: r.q.id, src: r.q.source || r.src, text: r.q.text.split("\n")[0].slice(0, 110) + (r.q.text.includes("\n") ? " …" : "") })),
    ids: rs.map((r) => r.q.id),
    sample: rs.slice(0, 3).map((r) => `${r.q.id} ${r.q.text.split("\n")[0].slice(0, 90)}`),
  };
});
const score = (x: { n: number; past: number; ns: number }) => x.past * 3 + x.ns * 2 + x.n;
list.sort((a, b) => score(b) - score(a));

// ── 출처별 문항 수 ──
const qKey = new Map<string, string>();
for (const x of list) for (const id of x.ids) qKey.set(id, x.legacy ? "L" : "N");
const srcs = ["기출(정보관리)", "기출(컴시응)", "NS 주간모의", "ITPE·명품 모의", "ITPE 파이널", "셀테", "KPC 모의", "합숙"];
console.log("출처 | 문항 | A 교재 토픽 | B 서브 토픽 | 교재 밖: 예전 토픽 있음 | 교재 밖: 화면 없음 | 주제 이름 없음(상황형)");
const bySrc: { src: string; n: number; book: number; sub: number; legacy: number; none: number; noName: number }[] = [];
for (const s of [...srcs, "전체"]) {
  const rs = s === "전체" ? rows : rows.filter((r) => r.src === s);
  const n = (f: (r: Row) => boolean) => rs.filter(f).length;
  const row = { src: s, n: rs.length, book: n((r) => r.cls === "A"), sub: n((r) => r.cls === "B"), legacy: n((r) => qKey.get(r.q.id) === "L"), none: n((r) => qKey.get(r.q.id) === "N"), noName: n((r) => r.cls === "X" && !qKey.has(r.q.id)) };
  bySrc.push(row);
  console.log(`${s} | ${row.n} | ${row.book} | ${row.sub} | ${row.legacy} | ${row.none} | ${row.noName}`);
}

// ── 토픽 수 ──
const usedA = new Set(rows.filter((r) => r.cls === "A").flatMap((r) => r.topics));
console.log(`\n교재 토픽 ${book.length}개 중 문항이 걸린 것 ${usedA.size} · 한 번도 안 나온 것 ${book.length - usedA.size} (${book.filter((t) => !usedA.has(t)).slice(0, 20).join(" / ")})`);
const bucket = (xs: { n: number }[]) => [[10, 1e9], [5, 9], [3, 4], [2, 2], [1, 1]].map(([lo, hi]) => `${lo}${hi > 1e8 ? "+" : hi === lo ? "" : `~${hi}`}문항 ${xs.filter((x) => x.n >= lo && x.n <= hi).length}`).join(" · ");
const L = list.filter((x) => x.legacy);
const N = list.filter((x) => !x.legacy);
console.log(`교재 밖 주제 ${list.length}개`);
console.log(`  예전 토픽 화면 있음 ${L.length}개 (${bucket(L)}) · 기출에 나온 것 ${L.filter((x) => x.past).length}`);
console.log(`  화면 없음 ${N.length}개 (${bucket(N)}) · 기출에 나온 것 ${N.filter((x) => x.past).length} · 기출 2번 이상 ${N.filter((x) => x.past >= 2).length}`);
const show = (xs: typeof list, k: number) => {
  for (const x of xs.slice(0, k)) console.log(`${String(x.n).padStart(3)} 기출${String(x.past).padStart(2)} NS${String(x.ns).padStart(2)} | ${x.name} | ${x.cat}${x.legacy ? ` | 예전: ${x.legacy}` : ""} | ${x.sample[0]}`);
};
console.log("\n── 화면 없음 위 80 ──");
show(N, 80);
console.log("\n── 예전 토픽 화면만 있음 위 40 ──");
show(L, 40);
console.log("\n── 주제 이름 없음 본보기 15 ──");
for (const r of noName.filter(isPast).slice(0, 15)) console.log(`  ${r.q.id} ${r.q.text.split("\n")[0].slice(0, 100)}`);
console.log(`화면 없음 ${N.length}개 중 문항에 해설집이 걸린 것 ${N.filter((x) => x.com).length} · 손글씨 답안만 ${N.filter((x) => !x.com && x.ans).length} · 아무 답안도 없음 ${N.filter((x) => !x.com && !x.ans).length}`);
console.log(`  2문항 이상 또는 기출에 나온 것 ${N.filter((x) => x.n >= 2 || x.past).length}개 — 그중 해설집 있음 ${N.filter((x) => (x.n >= 2 || x.past) && x.com).length}`);
if (process.argv[2]) {
  // 화면(/survey)에 싣는 것 — 두 번 이상 나왔거나 기출에 나온 주제만(한 번 나온 모의 문항 주제 1,500여 개는 수만 싣는다)
  const keep = (x: (typeof list)[number]) => x.n >= 2 || x.past > 0;
  const slim = (x: (typeof list)[number]) => ({ name: x.name, n: x.n, past: x.past, ns: x.ns, cat: x.cat, legacy: x.legacy, com: x.com, ans: x.ans, qs: x.qs.slice(0, 12) });
  writeFileSync(
    process.argv[2],
    JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      total: bank.length,
      bySrc,
      book: { all: book.length, used: usedA.size, unused: book.filter((t) => !usedA.has(t)) },
      counts: { topics: list.length, legacy: L.length, none: N.length, noneOnce: N.filter((x) => !keep(x)).length, legacyOnce: L.filter((x) => !keep(x)).length },
      none: N.filter(keep).map(slim),
      legacy: L.filter(keep).map(slim),
      noName: noName.filter(isPast).map((r) => ({ id: r.q.id, src: r.q.source || r.src, text: r.q.text.split("\n")[0].slice(0, 110) })),
    }),
  );
}
