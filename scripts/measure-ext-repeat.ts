import questions from "@/data/questions.json";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";
import { questionCore, yearMonth } from "@/lib/questionText";
type Q = { id: string; text: string; period?: string; category?: string; kind?: string; round?: string; cohort?: string; date?: string; source?: string };
const GROUP: Record<string, string> = { 컴퓨터구조: "CA", 운영체제: "CA", 소프트웨어공학: "SE", 프로젝트관리: "SE", 인공지능: "AI", "확률·통계": "AI", 네트워크: "NW", 알고리즘: "NW", 자료구조: "NW", 데이터베이스: "DB", 경영전략: "DB", 보안: "SC", 디지털서비스: "DX" };
const COURSE_GROUP: Record<string, string> = { CA: "CA", OS: "CA", SE: "SE", PM: "SE", AI: "AI", ST: "AI", NW: "NW", AL: "NW", DS: "NW", DB: "DB", MG: "DB", SC: "SC", DX: "DX" };
const all = questions as Q[];
const NS = all.filter((q) => q.kind === "NS모의" && q.cohort && q.round && q.date);
type Exam = { key: string; cohort: number; date: string; qs: Q[]; group?: string; pass?: number };
const exams = new Map<string, Exam>();
for (const q of NS) { const key = `${q.cohort} ${q.round}`; let e = exams.get(key); if (!e) exams.set(key, (e = { key, cohort: parseInt(q.cohort!), date: q.date!, qs: [] })); e.qs.push(q); }
const EXAMS = [...exams.values()].sort((a, b) => a.date.localeCompare(b.date));
for (const e of EXAMS) { const c = new Map<string, number>(); for (const q of e.qs) { const g = GROUP[q.category ?? ""]; if (g) c.set(g, (c.get(g) ?? 0) + 1); } const top = [...c.entries()].sort((a, b) => b[1] - a[1])[0]; if (top && top[1] / e.qs.length >= 0.6) e.group = top[0]; }
for (const e of EXAMS) if (e.group) e.pass = EXAMS.filter((x) => x.cohort === e.cohort && x.group === e.group && x.date <= e.date).length;
const TITLE_GROUP = new Map<string, string>();
for (const s of SUBNOTES) TITLE_GROUP.set(s.title, COURSE_GROUP[s.course]);
for (const s of SUB_TOPICS) { const p = SUBNOTES.find((x) => x.title === s.parent); if (p) TITLE_GROUP.set(s.name, COURSE_GROUP[p.course]); }
const TITLES = [...TITLE_GROUP.keys()];
const ymOf = (q: Q): number => { const m = /^[kc](\d+)-/.exec(q.id); if (m) { const r = parseInt(m[1]); return (2026 - Math.floor((140 - r) / 3)) * 100 + [2, 5, 8][r % 3]; } return yearMonth(`${q.round ?? ""} ${q.source ?? ""}`); };
const months = (ym: number) => Math.floor(ym / 100) * 12 + (ym % 100);
// 바깥 문항(기출·모의·파이널·합숙 …) — 2020년 이후만
const EXTQ = all.filter((q) => q.kind !== "NS모의").map((q) => ({ q, ym: ymOf(q), core: questionCore(q.text) })).filter((x) => x.ym >= 202001 && x.core);
const groupsOf = (q: Q): Set<string> => { const g = GROUP[q.category ?? ""]; if (g) return new Set([g]); return new Set(titlesMatching(q.text, TITLES).map((t) => TITLE_GROUP.get(t)!).filter(Boolean)); };
const gcache = new Map<string, Set<string>>();
const G = (q: Q) => gcache.get(q.id) ?? (gcache.set(q.id, groupsOf(q)), gcache.get(q.id)!);
const rows: any[] = [];
for (const e of EXAMS) {
  if (!e.group || e.cohort < 13 || e.qs.length < 8) continue;
  const ym = parseInt(e.date.slice(0, 4)) * 100 + parseInt(e.date.slice(5, 7)), now = months(ym);
  const nsBefore = new Set(NS.filter((q) => q.date! < e.date).map((q) => questionCore(q.text)));
  for (const win of [12, 24]) {
    const pool = EXTQ.filter((x) => x.ym < ym && now - months(x.ym) <= win && G(x.q).has(e.group!));
    const poolCores = new Set(pool.map((x) => x.core));
    const anyCores = new Set(EXTQ.filter((x) => x.ym < ym && now - months(x.ym) <= win).map((x) => x.core));
    let a = 0, b = 0, c = 0, d = 0;
    for (const q of e.qs) { const k = questionCore(q.text); const inNS = nsBefore.has(k), inP = poolCores.has(k); if (inNS) a++; if (inP) b++; if (anyCores.has(k)) c++; if (inP && !inNS) d++; }
    rows.push({ key: e.key, cohort: e.cohort, group: e.group, pass: e.pass, n: e.qs.length, win, ns: a, pool: b, any: c, fresh: d, size: poolCores.size });
  }
}
const avg = (r: any[], f: (x: any) => number) => (r.reduce((s, x) => s + f(x), 0) / r.length).toFixed(2);
for (const win of [12, 24]) for (const p of [1, 2]) {
  const r = rows.filter((x) => x.win === win && (p === 1 ? x.pass === 1 : x.pass >= 2));
  console.log(`최근 ${win}개월 · ${p === 1 ? "1회차" : "2회차 이후"} · 시험 ${r.length}개 · 문항 ${avg(r, (x) => x.n)} | NS 같은 문장 ${avg(r, (x) => x.ns)} | 모의·파이널·기출 같은 문장(같은 묶음) ${avg(r, (x) => x.pool)} (어느 묶음이든 ${avg(r, (x) => x.any)}) | 그중 NS 에 없던 것 ${avg(r, (x) => x.fresh)} | 후보 수 ${avg(r, (x) => x.size)} | 후보 1개당 적중 ${(r.reduce((s, x) => s + x.pool, 0) / r.reduce((s, x) => s + x.size, 0) * 100).toFixed(1)}%`);
}
console.log("\n— 18·19기");
for (const x of rows.filter((x) => x.cohort >= 18 && x.win === 24)) console.log(`${x.key}\t${x.group} ${x.pass}회차\t${x.n}문항\tNS ${x.ns}\t모의·파이널·기출 24개월 ${x.pool}\t새로 ${x.fresh}\t후보 ${x.size}`);
