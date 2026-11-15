/**
 * NS 주간 모의고사 출제 예상 — 지난 기수 전부에 돌려 본 적중률과 함께 낸다.
 *
 * 2026-11-15 "너의 9주차 출제 예상이 틀렸어" — 19기 9주차(CA·OS 2회차)를 「2회차는 1회차 문제를 거의 안 낸다」는
 * 전제로 뽑았다가 주 목록 19개 중 3개만 맞았다. 그때 「지난 주차에 되짚어 보면 9~17개 맞는다」고 했지만 재 본 적이 없었다.
 * 그래서 예상 방식을 코드로 적고, **그 시험 이전 자료만으로** 지난 시험마다 예상을 뽑아 실제 문제와 견준다(백테스트).
 * 예상을 말할 때는 이 스크립트가 찍는 숫자를 함께 말한다 — 재지 않은 적중률을 말하지 않는다.
 *
 *   npx tsx scripts/predict-week.ts                      # 백테스트(방식별 적중률)
 *   npx tsx scripts/predict-week.ts 19기 10 SE           # 19기 10주차를 SE 묶음(SE·PM)으로 예상
 *   npx tsx scripts/predict-week.ts 19기 10 SE out.json  # 결과를 파일로도
 *
 * 묶음: CA(CA·OS) SE(SE·PM) AI(AI·ST) NW(NW·AL·DS) DB(DB·MG) SC DX — NS 강의 한 주의 과목 단위.
 */
import { writeFileSync } from "node:fs";
import questions from "@/data/questions.json";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";
import { questionCore, yearMonth } from "@/lib/questionText";
import { COURSE_TOPICS } from "@/data/curriculum";

type Q = { id: string; text: string; period?: string; category?: string; kind?: string; round?: string; cohort?: string; date?: string };
const GROUP: Record<string, string> = {
  컴퓨터구조: "CA", 운영체제: "CA", 소프트웨어공학: "SE", 프로젝트관리: "SE", 인공지능: "AI", "확률·통계": "AI",
  네트워크: "NW", 알고리즘: "NW", 자료구조: "NW", 데이터베이스: "DB", 경영전략: "DB", 보안: "SC", 디지털서비스: "DX",
};
const COURSE_GROUP: Record<string, string> = { CA: "CA", OS: "CA", SE: "SE", PM: "SE", AI: "AI", ST: "AI", NW: "NW", AL: "NW", DS: "NW", DB: "DB", MG: "DB", SC: "SC", DX: "DX" };

const NS = (questions as Q[]).filter((q) => q.kind === "NS모의" && q.cohort && q.round && q.date);
const cohortNo = (c: string) => parseInt(c, 10);

// ── 시험(기수·주차) 단위로 묶고, 과목 묶음과 몇 회차인지 붙인다
type Exam = { key: string; cohort: number; round: string; date: string; qs: Q[]; group?: string; pass?: number };
const exams = new Map<string, Exam>();
for (const q of NS) {
  const key = `${q.cohort} ${q.round}`;
  let e = exams.get(key);
  if (!e) exams.set(key, (e = { key, cohort: cohortNo(q.cohort!), round: q.round!, date: q.date!, qs: [] }));
  e.qs.push(q);
}
const EXAMS = [...exams.values()].sort((a, b) => a.date.localeCompare(b.date));
for (const e of EXAMS) {
  const cnt = new Map<string, number>();
  for (const q of e.qs) { const g = GROUP[q.category ?? ""]; if (g) cnt.set(g, (cnt.get(g) ?? 0) + 1); }
  const top = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] / e.qs.length >= 0.6) e.group = top[0];
}
for (const e of EXAMS) if (e.group) e.pass = EXAMS.filter((x) => x.cohort === e.cohort && x.group === e.group && x.date <= e.date).length;

// ── 문항 → 토픽(교재 토픽 + 서브 토픽)
const TITLES = [...new Set([...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)])];
const TITLE_GROUP = new Map<string, string>();
for (const s of SUBNOTES) TITLE_GROUP.set(s.title, COURSE_GROUP[s.course]);
for (const s of SUB_TOPICS) { const p = SUBNOTES.find((x) => x.title === s.parent); if (p) TITLE_GROUP.set(s.name, COURSE_GROUP[p.course]); }
const topicCache = new Map<string, string[]>();
const topicsOf = (q: Q) => {
  let t = topicCache.get(q.id);
  if (!t) topicCache.set(q.id, (t = titlesMatching(q.text, TITLES)));
  return t;
};
const coreCache = new Map<string, string>();
const coreOf = (q: Q) => {
  let c = coreCache.get(q.id);
  if (c === undefined) coreCache.set(q.id, (c = questionCore(q.text)));
  return c;
};

// ── 한 단위(토픽 또는 문장)의 지난 출제 기록
type App = { cohort: number; pass?: number; period?: string; exam: string };
type Hist = Map<string, App[]>;
function history(group: string, before: string, unit: (q: Q) => string[]): Hist {
  const h: Hist = new Map();
  for (const e of EXAMS) {
    if (e.date >= before) break;
    for (const q of e.qs) {
      // 그 묶음 주차의 문항이거나, 섞인 주차라도 과목이 그 묶음인 문항
      if (e.group !== group && GROUP[q.category ?? ""] !== group) continue;
      for (const u of unit(q)) {
        if (!u) continue;
        const a = h.get(u) ?? [];
        if (!a.some((x) => x.exam === e.key && x.period === q.period)) a.push({ cohort: e.cohort, pass: e.group === group ? e.pass : undefined, period: q.period, exam: e.key });
        h.set(u, a);
      }
    }
  }
  return h;
}

// ── 점수 방식 — 이름 → (기록, 대상 시험) → 점수
type Target = { cohort: number; pass: number };
const exDistinct = (a: App[]) => new Set(a.map((x) => x.exam)).size;
const decay = (a: App[], t: Target, r: number) => {
  const seen = new Set<string>();
  let s = 0;
  for (const x of a) { if (seen.has(x.exam)) continue; seen.add(x.exam); s += Math.pow(r, t.cohort - x.cohort); }
  return s;
};
const sameCohort = (a: App[], t: Target) => a.some((x) => x.cohort === t.cohort);
const METHODS: Record<string, (a: App[], t: Target) => number> = {
  "빈도(전 기수)": (a) => exDistinct(a),
  "최근 가중 0.8": (a, t) => decay(a, t, 0.8),
  "최근 가중 0.6": (a, t) => decay(a, t, 0.6),
  // 9주차 때 쓴 전제 — 같은 기수 1회차에 나온 것을 뺀다
  "최근 0.8 − 같은 기수 1회차 제외(지난 예상)": (a, t) => (sameCohort(a, t) ? 0 : decay(a, t, 0.8)),
  "최근 0.8 + 같은 기수 1회차 가산": (a, t) => decay(a, t, 0.8) + (sameCohort(a, t) ? 1.5 : 0),
  // 같은 회차(1회차끼리·2회차끼리) 기록을 더 쳐 준다
  "최근 0.8 + 같은 회차 가중": (a, t) => {
    const seen = new Set<string>();
    let s = 0;
    for (const x of a) { if (seen.has(x.exam)) continue; seen.add(x.exam); s += Math.pow(0.8, t.cohort - x.cohort) * (x.pass === t.pass ? 1.5 : 1); }
    return s;
  },
};

function rank(h: Hist, t: Target, method: string): string[] {
  const f = METHODS[method];
  return [...h.entries()]
    .map(([u, a]) => [u, f(a, t), exDistinct(a)] as const)
    .filter((x) => x[1] > 0)
    .sort((x, y) => y[1] - x[1] || y[2] - x[2] || x[0].localeCompare(y[0]))
    .map((x) => x[0]);
}

// ── 학습 가중 방식 — 토픽마다 특징을 뽑아 「이번 시험에 나오는가」를 로지스틱 회귀로 맞춘다(그 시험보다 앞선 기수의 시험으로만 학습)
const PRIO = new Map<string, number>();
for (const list of Object.values(COURSE_TOPICS)) for (const t of list) PRIO.set(t.title, t.priority === "상" ? 2 : t.priority === "중" ? 1 : 0);
const SUB_PARENT = new Map(SUB_TOPICS.map((s) => [s.name, s.parent]));
/** 기출·모의·파이널 문항의 연월(YYYYMM) — 기출은 회차로(한 해 세 번: 138회 = 2026.02, 139회 = 2026.05, 140회 = 2026.08) */
const ymOfExt = (q: Q & { source?: string }): number => {
  const m = /^[kc](\d+)-/.exec(q.id);
  if (m) { const r = parseInt(m[1]); return (2026 - Math.floor((140 - r) / 3)) * 100 + [2, 5, 8][r % 3]; }
  return yearMonth(`${q.round ?? ""} ${q.source ?? ""}`);
};
const months = (ym: number) => Math.floor(ym / 100) * 12 + (ym % 100);
type Ext = { ym: number; past: boolean; final: boolean; topics: string[] };
let EXT: Ext[] | null = null;
const ext = () => (EXT ??= (questions as (Q & { source?: string })[])
  .filter((q) => q.kind !== "NS모의")
  .map((q) => ({ ym: ymOfExt(q), past: !q.kind, final: q.kind === "파이널", topics: titlesMatching(q.text, TITLES) }))
  .filter((x) => x.ym > 0 && x.topics.length));
const FEATS = [
  "NS 출제 시험 수", "최근 가중", "직전 기수 출제", "이번 기수 출제", "같은 회차 출제", "기출 전체", "기출 최근 3년", "모의·파이널 최근 2년", "교재 중요도", "서브 토픽", "NS 미출제",
  // 2026-11-15 "다음 시험에 나올만한 것들은 계속 모의고사 내는거 같은데" — 다음 본시험 예상 신호
  "모의 최근 1년", "파이널 최근 1년", "모의·파이널 최근 6개월", "기출 안 나온 햇수", "직전 기출 2회 출제", "기출 미출제",
];
function features(group: string, date: string, t: Target, hT: Hist): Map<string, number[]> {
  const ym = parseInt(date.slice(0, 4)) * 100 + parseInt(date.slice(5, 7));
  const now = months(ym);
  const past = new Map<string, number>(), past3 = new Map<string, number>(), mock2 = new Map<string, number>();
  const mock1 = new Map<string, number>(), fin1 = new Map<string, number>(), ext6 = new Map<string, number>(), lastPast = new Map<string, number>(), past2r = new Map<string, number>();
  const inc = (m: Map<string, number>, u: string) => m.set(u, (m.get(u) ?? 0) + 1);
  for (const x of ext()) {
    if (x.ym >= ym) continue;
    const ago = now - months(x.ym);
    for (const u of x.topics) {
      if (x.past) {
        inc(past, u);
        if (ago <= 36) inc(past3, u);
        if (ago <= 8) inc(past2r, u);
        lastPast.set(u, Math.min(lastPast.get(u) ?? 999, ago));
      } else {
        if (ago <= 24) inc(mock2, u);
        if (ago <= 12) inc(x.final ? fin1 : mock1, u);
        if (ago <= 6) inc(ext6, u);
      }
    }
  }
  const out = new Map<string, number[]>();
  for (const u of TITLES) {
    if (TITLE_GROUP.get(u) !== group) continue;
    const a = hT.get(u) ?? [];
    const sub = SUB_PARENT.has(u);
    out.set(u, [
      Math.log1p(exDistinct(a)),
      decay(a, t, 0.8),
      a.some((x) => x.cohort === t.cohort - 1) ? 1 : 0,
      sameCohort(a, t) ? 1 : 0,
      Math.log1p(new Set(a.filter((x) => x.pass === t.pass).map((x) => x.exam)).size),
      Math.log1p(past.get(u) ?? 0),
      Math.log1p(past3.get(u) ?? 0),
      Math.log1p(mock2.get(u) ?? 0),
      PRIO.get(sub ? SUB_PARENT.get(u)! : u) ?? 0,
      sub ? 1 : 0,
      a.length ? 0 : 1,
      Math.log1p(mock1.get(u) ?? 0),
      Math.log1p(fin1.get(u) ?? 0),
      Math.log1p(ext6.get(u) ?? 0),
      Math.min(10, (lastPast.get(u) ?? 120) / 12) / 10,
      past2r.has(u) ? 1 : 0,
      past.has(u) ? 0 : 1,
    ]);
  }
  return out;
}
type Sample = { x: number[]; y: number };
function fit(samples: Sample[]): number[] {
  const n = FEATS.length;
  const w = new Array(n + 1).fill(0);
  const lr = 0.05, l2 = 0.001;
  for (let ep = 0; ep < 800; ep++) {
    const g = new Array(n + 1).fill(0);
    for (const s of samples) {
      let z = w[n];
      for (let i = 0; i < n; i++) z += w[i] * s.x[i];
      const p = 1 / (1 + Math.exp(-z));
      const d = p - s.y;
      for (let i = 0; i < n; i++) g[i] += d * s.x[i];
      g[n] += d;
    }
    for (let i = 0; i <= n; i++) w[i] -= lr * (g[i] / samples.length + (i < n ? l2 * w[i] : 0)) * 10;
  }
  return w;
}
const scoreOf = (w: number[], x: number[]) => x.reduce((s, v, i) => s + w[i] * v, w[FEATS.length]);
/** 그 시험의 토픽별 특징과 정답(실제로 나왔는가) */
function samplesOf(e: Exam): { feats: Map<string, number[]>; samples: Sample[] } {
  const hT = history(e.group!, e.date, topicsOf);
  const feats = features(e.group!, e.date, { cohort: e.cohort, pass: e.pass! }, hT);
  const actual = new Set(e.qs.flatMap(topicsOf));
  return { feats, samples: [...feats.entries()].map(([u, x]) => ({ x, y: actual.has(u) ? 1 : 0 })) };
}

const args = process.argv.slice(2);

// ══ 백테스트
if (!args.length) {
  const targets = EXAMS.filter((e) => e.group && e.cohort >= 13 && e.qs.length >= 13);
  console.log(`대상 시험 ${targets.length}개 (13기~19기, 한 과목 묶음이 60% 이상인 주차). 그 시험 이전 NS 문항만으로 예상을 뽑아 실제 문제와 견준다.\n`);
  type Row = { m: string; pass: number; n: number; q: number; t19: number; t30: number; t40: number; ceilT: number; s19: number; s30: number; ceilS: number };
  const rows: Row[] = [];
  const per: string[] = [];
  for (const m of Object.keys(METHODS)) {
    for (const pass of [1, 2]) {
      const r: Row = { m, pass, n: 0, q: 0, t19: 0, t30: 0, t40: 0, ceilT: 0, s19: 0, s30: 0, ceilS: 0 };
      for (const e of targets.filter((x) => (x.pass === 1 ? 1 : 2) === pass)) {
        const t = { cohort: e.cohort, pass: e.pass! };
        const hT = history(e.group!, e.date, topicsOf);
        const hS = history(e.group!, e.date, (q) => [coreOf(q)]);
        const rT = rank(hT, t, m);
        const rS = rank(hS, t, m);
        const hit = (set: Set<string>, unit: (q: Q) => string[]) => e.qs.filter((q) => unit(q).some((u) => set.has(u))).length;
        const a19 = hit(new Set(rT.slice(0, 19)), topicsOf), a30 = hit(new Set(rT.slice(0, 30)), topicsOf), a40 = hit(new Set(rT.slice(0, 40)), topicsOf);
        const b19 = hit(new Set(rS.slice(0, 19)), (q) => [coreOf(q)]), b30 = hit(new Set(rS.slice(0, 30)), (q) => [coreOf(q)]);
        r.n++; r.q += e.qs.length; r.t19 += a19; r.t30 += a30; r.t40 += a40; r.s19 += b19; r.s30 += b30;
        r.ceilT += hit(new Set(hT.keys()), topicsOf);
        r.ceilS += hit(new Set(hS.keys()), (q) => [coreOf(q)]);
        if (e.cohort >= 18) per.push(`${m}\t${e.key}(${e.group} ${e.pass}회차)\t토픽 19개 ${a19}/${e.qs.length} · 30개 ${a30} · 40개 ${a40}\t문장 30개 ${b30}`);
      }
      rows.push(r);
    }
  }
  // 학습 가중 — 기수마다 그보다 앞선 기수(12기~)의 시험으로만 학습해 그 기수 시험을 예상한다
  const pool = EXAMS.filter((e) => e.group && e.cohort >= 12 && e.qs.length >= 13).map((e) => ({ e, ...samplesOf(e) }));
  const learned = new Map<number, Row>([[1, { m: "학습 가중(앞선 기수로 학습)", pass: 1, n: 0, q: 0, t19: 0, t30: 0, t40: 0, ceilT: 0, s19: 0, s30: 0, ceilS: 0 }], [2, { m: "학습 가중(앞선 기수로 학습)", pass: 2, n: 0, q: 0, t19: 0, t30: 0, t40: 0, ceilT: 0, s19: 0, s30: 0, ceilS: 0 }]]);
  for (const c of [...new Set(targets.map((e) => e.cohort))].filter((c) => c >= 14)) {
    const w = fit(pool.filter((p) => p.e.cohort < c).flatMap((p) => p.samples));
    for (const p of pool.filter((p) => p.e.cohort === c)) {
      const order = [...p.feats.entries()].map(([u, x]) => [u, scoreOf(w, x)] as const).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
      const hit = (k: number) => { const set = new Set(order.slice(0, k)); return p.e.qs.filter((q) => topicsOf(q).some((u) => set.has(u))).length; };
      const r = learned.get(p.e.pass === 1 ? 1 : 2)!;
      r.n++; r.q += p.e.qs.length; r.t19 += hit(19); r.t30 += hit(30); r.t40 += hit(40); r.ceilT += hit(9999);
      if (c >= 18) per.push(`학습 가중\t${p.e.key}(${p.e.group} ${p.e.pass}회차)\t토픽 19개 ${hit(19)}/${p.e.qs.length} · 30개 ${hit(30)} · 40개 ${hit(40)}`);
    }
  }
  rows.push(...learned.values());
  // 「다음 본시험에 나올 만한 것을 모의고사가 낸다」 — 직전 ITPE 모의·파이널에 나온 토픽이 NS 에 나올 확률
  const rate = (f: (x: number[]) => boolean) => {
    const xs = pool.filter((p) => p.e.cohort >= 13).flatMap((p) => p.samples).filter((s) => f(s.x));
    return `${xs.length ? ((xs.filter((s) => s.y).length / xs.length) * 100).toFixed(1) : "-"}% (${xs.length})`;
  };
  console.log("토픽이 그 주 NS 에 나올 확률 — 전체 " + rate(() => true)
    + " · 최근 6개월 모의·파이널 출제 " + rate((x) => x[13] > 0) + " · 최근 1년 파이널 출제 " + rate((x) => x[12] > 0) + " · 최근 1년 모의 출제 " + rate((x) => x[11] > 0)
    + " · 최근 2년 모의·파이널 없음 " + rate((x) => x[7] === 0) + " · 직전 기출 2회 출제 " + rate((x) => x[15] > 0) + " · 기출 5년 넘게 없음 " + rate((x) => x[14] >= 0.5));
  const wAll = fit(pool.flatMap((p) => p.samples));
  console.log("학습 가중치(전체 시험으로 학습): " + FEATS.map((f, i) => `${f} ${wAll[i].toFixed(2)}`).join(" · ") + "\n");
  const pc = (x: number, q: number) => `${((x / q) * 19).toFixed(1)}`;
  console.log("19문항 시험 한 번에 평균 몇 문항이 예상 안에 드는가 (토픽 = 예상 토픽 N개 가운데 하나가 그 문항에 걸림, 문장 = 지난 문항과 같은 문장)\n");
  console.log(["방식", "회차", "시험 수", "토픽 19개", "토픽 30개", "토픽 40개", "토픽 상한", "문장 19개", "문장 30개", "문장 상한"].join("\t"));
  for (const r of rows) console.log([r.m, r.pass === 1 ? "1회차" : "2회차 이후", r.n, pc(r.t19, r.q), pc(r.t30, r.q), pc(r.t40, r.q), pc(r.ceilT, r.q), pc(r.s19, r.q), pc(r.s30, r.q), pc(r.ceilS, r.q)].join("\t"));
  console.log("\n— 18·19기 시험별\n" + per.join("\n"));
  process.exit(0);
}

// ══ 예상
const [cohortArg, roundArg, group, out] = args;
const cohort = cohortNo(cohortArg);
const METHOD = "최근 가중 0.8"; // 문장 순위용 — 백테스트에서 30개 가운데 2.6~2.9문항
const before = "9999";
const today = new Date().toISOString().slice(0, 10);
const pass = EXAMS.filter((e) => e.cohort === cohort && e.group === group).length + 1;
const t = { cohort, pass };
const hT = history(group, before, topicsOf);
const hS = history(group, before, (q) => [coreOf(q)]);
const sample = new Map<string, Q>();
for (const e of EXAMS) for (const q of e.qs) sample.set(coreOf(q), q); // 가장 최근 문장
const describe = (a: App[]) => {
  const by = new Map<number, string[]>();
  for (const x of a) by.set(x.cohort, [...(by.get(x.cohort) ?? []), `${x.pass ?? "?"}회차 ${x.period ?? ""}`.trim()]);
  return [...by.entries()].sort((x, y) => y[0] - x[0]).map(([c, v]) => `${c}기(${[...new Set(v)].join(", ")})`).join(" ");
};
// 토픽 순위 = 학습 가중(지난 시험 전부로 학습)
const W = fit(EXAMS.filter((e) => e.group && e.cohort >= 12 && e.qs.length >= 13).flatMap((e) => samplesOf(e).samples));
const feats = features(group, today, t, hT);
const topics = [...feats.entries()]
  .map(([u, x]) => ({ u, x, s: scoreOf(W, x) }))
  .sort((a, b) => b.s - a.s)
  .slice(0, 40)
  .map((r, i) => ({ rank: i + 1, topic: r.u, p: +(1 / (1 + Math.exp(-r.s))).toFixed(2), exams: exDistinct(hT.get(r.u) ?? []), sameCohort: sameCohort(hT.get(r.u) ?? [], t), mock2y: Math.round(Math.expm1(r.x[7])), past: Math.round(Math.expm1(r.x[5])), history: describe(hT.get(r.u) ?? []) }));
const sentences = rank(hS, t, METHOD).slice(0, 40).map((u, i) => ({ rank: i + 1, period: sample.get(u)?.period, text: sample.get(u)?.text ?? u, exams: exDistinct(hS.get(u)!), sameCohort: sameCohort(hS.get(u)!, t), history: describe(hS.get(u)!) }));
console.log(`${cohortArg} ${roundArg}주차 · ${group} 묶음 ${pass}회차 · 토픽 = 학습 가중, 문장 = ${METHOD}\n`);
console.log("── 토픽 40");
for (const x of topics) console.log(`${x.rank}\t${x.topic}\tp=${x.p}\tNS ${x.exams}번${x.sameCohort ? " · 이번 기수 출제" : ""} · 모의 ${x.mock2y} · 기출 ${x.past}\t${x.history}`);
console.log("\n── 같은 문장으로 다시 나올 문항 40");
for (const x of sentences) console.log(`${x.rank}\t[${x.period}] ${x.text.replace(/\n/g, " / ").slice(0, 110)}\t${x.exams}번${x.sameCohort ? " · 이번 기수 출제" : ""}\t${x.history}`);
if (out) writeFileSync(out, JSON.stringify({ cohort: cohortArg, round: roundArg, group, pass, topics, sentences }, null, 2));
