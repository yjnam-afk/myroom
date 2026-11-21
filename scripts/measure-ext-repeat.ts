import { titlesMatching } from "@/lib/examHistory";
import { questionCore } from "@/lib/questionText";
import { ALL_QUESTIONS as all, NS, EXAMS, GROUP, TITLE_GROUP, ymOfExt as ymOf, months, type Q } from "./lib/ns-exams";

const TITLES = [...TITLE_GROUP.keys()];
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
