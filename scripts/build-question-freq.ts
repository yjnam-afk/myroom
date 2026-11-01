/**
 * questionFreq.json 생성기 — 문항마다 세 가지를 미리 센다(문제은행·기출문제 화면이 읽는다).
 *  f: 빈출 수 — 그 문항의 토픽이 기출·NS·모의고사·파이널·셀테에 몇 번 나왔나(2026-11-01 "문제은행은 빈도수 높은거 상중하")
 *  p: 토픽 중요도 — 교재 CONTENTS Priority(★★★ 상·★★ 중·★ 하). 빈출과 다른 축이다
 *     (2026-11-01 "문제은행은 빈출과 토픽 중요도가 분리되어야지", "기출문제도 토픽 상중하 표시해줘")
 *  n: 내 정리·내 답안지(myNotes.ts) 중 이 문항 토픽에 걸린 것의 id (2026-11-01 "내가 정리한 토픽이나 답안지가 있으면 매핑해줘")
 *
 * - 토픽 = 교재 서브노트 제목 + 서브 토픽 이름(서브 토픽은 상위 토픽의 Priority). 열쇠(examHistory keysOf)로 찾는다.
 * - f 는 지문 전체로(가·나·다 안의 토픽도 출제로 센다), p·n 은 지문 첫 줄(문제 머리)로 — 가·나·다 속 낱말로 딴 토픽이 붙지 않게.
 * - 빈출 등급은 토픽이 걸린 문항을 빈출 수로 줄 세워 위 1/3 상, 가운데 1/3 중, 나머지와 토픽 없는 문항은 하.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { SUB_TOPICS } from "../src/data/subTopics";
import { COURSE_TOPICS } from "../src/data/curriculum";
import { MY_NOTES } from "../src/data/myNotes";
import { questionIdsForTitle, titlesMatching } from "../src/lib/examHistory";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const questions: { id: string; text: string; source?: string; kind?: string }[] = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/questions.json"), "utf8"),
);
const examQs = questions.filter((q) => q.source || q.kind);
const exam = new Set(examQs.map((q) => q.id));

// ── 빈출 ──
const titles = [...new Set([...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)])];
const f: Record<string, number> = {};
for (const t of titles) {
  const ids = questionIdsForTitle(t).filter((id) => exam.has(id));
  for (const id of ids) if ((f[id] ?? 0) < ids.length) f[id] = ids.length;
}
const all = [...exam].map((id) => f[id] ?? 0).filter((n) => n > 0).sort((a, b) => b - a);
const cut = { 상: all[Math.floor(all.length / 3)], 중: all[Math.floor((all.length * 2) / 3)] };

// ── 중요도 ──
const RANK = { 상: 3, 중: 2, 하: 1 } as const;
type P = keyof typeof RANK;
const prio = new Map<string, P>();
for (const list of Object.values(COURSE_TOPICS)) for (const t of list) prio.set(t.title, t.priority as P);
for (const st of SUB_TOPICS) if (prio.has(st.parent) && !prio.has(st.name)) prio.set(st.name, prio.get(st.parent)!);
const prioTitles = [...prio.keys()];

// ── 내 정리 ──
const noteTitles = [...new Set(MY_NOTES.flatMap((n) => n.topicTitles))];
const notesBy = new Map<string, string[]>();
for (const n of MY_NOTES) for (const t of n.topicTitles) notesBy.set(t, [...(notesBy.get(t) ?? []), n.id]);

const p: Record<string, P> = {};
const n: Record<string, string[]> = {};
for (const q of examQs) {
  const head = q.text.split("\n")[0];
  let best: P | undefined;
  for (const t of titlesMatching(head, prioTitles)) {
    const v = prio.get(t)!;
    if (!best || RANK[v] > RANK[best]) best = v;
  }
  if (best) p[q.id] = best;
  const ids = [...new Set(titlesMatching(head, noteTitles).flatMap((t) => notesBy.get(t) ?? []))];
  if (ids.length) n[q.id] = ids;
}

fs.writeFileSync(path.join(root, "src/data/questionFreq.json"), JSON.stringify({ cut, f, p, n }));
const tier = (v: number) => (v >= cut.상 ? "상" : v >= cut.중 ? "중" : "하");
const cnt: Record<string, number> = { 상: 0, 중: 0, 하: 0 };
for (const id of exam) cnt[tier(f[id] ?? 0)]++;
const pc: Record<string, number> = { 상: 0, 중: 0, 하: 0 };
for (const v of Object.values(p)) pc[v]++;
console.log(
  `questionFreq.json: 문항 ${exam.size} · 빈출 상 ≥${cut.상}회 ${cnt.상} · 중 ≥${cut.중}회 ${cnt.중} · 하 ${cnt.하}` +
    ` · 중요도 상 ${pc.상} 중 ${pc.중} 하 ${pc.하} 교재 밖 ${exam.size - Object.keys(p).length} · 내 정리 걸린 문항 ${Object.keys(n).length}`,
);
