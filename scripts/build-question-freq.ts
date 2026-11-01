/**
 * questionFreq.json 생성기 — 문항마다 「그 토픽이 시험에 몇 번 나왔나」(빈출 수)와 상·중·하.
 * (2026-11-01 "문제은행은 빈도수 높은거 상중하 선택가능하도록")
 *
 * - 토픽 = 교재 서브노트 제목 + 서브 토픽 이름. 열쇠(examHistory keysOf)로 문제 문구에 걸리는 토픽을 찾는다.
 * - 빈출 수 = 그 토픽에 걸리는 출처 있는 문항(기출·NS·모의고사·파이널·셀테) 수. 한 문항에 토픽이 여럿이면 가장 큰 값.
 * - 등급은 토픽이 걸린 문항을 빈출 수로 줄 세워 위 1/3 상, 가운데 1/3 중, 나머지와 토픽이 안 걸리는 문항(교재 밖 신기술 등)은 하.
 * 결과: { cut: { 상, 중 }, f: { [qid]: 빈출 수 } } — 문제은행 화면이 등급을 계산한다.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { SUB_TOPICS } from "../src/data/subTopics";
import { questionIdsForTitle } from "../src/lib/examHistory";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const questions: { id: string; source?: string; kind?: string }[] = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/questions.json"), "utf8"),
);
const exam = new Set(questions.filter((q) => q.source || q.kind).map((q) => q.id));

const titles = [...new Set([...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)])];
const f: Record<string, number> = {};
for (const t of titles) {
  const ids = questionIdsForTitle(t).filter((id) => exam.has(id));
  const n = ids.length;
  for (const id of ids) if ((f[id] ?? 0) < n) f[id] = n;
}
const all = [...exam].map((id) => f[id] ?? 0).filter((n) => n > 0).sort((a, b) => b - a);
const cut = { 상: all[Math.floor(all.length / 3)], 중: all[Math.floor((all.length * 2) / 3)] };
fs.writeFileSync(path.join(root, "src/data/questionFreq.json"), JSON.stringify({ cut, f }));
const tier = (n: number) => (n >= cut.상 ? "상" : n >= cut.중 ? "중" : "하");
const cnt: Record<string, number> = { 상: 0, 중: 0, 하: 0 };
for (const id of exam) cnt[tier(f[id] ?? 0)]++;
console.log(`questionFreq.json: 문항 ${exam.size} · 상 ≥${cut.상}회 ${cnt.상} · 중 ≥${cut.중}회 ${cnt.중} · 하 ${cnt.하}`);
