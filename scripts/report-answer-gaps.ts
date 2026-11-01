/**
 * 답안이 비어 있는 곳 보고 (2026-11-01 "모범답안이 없는 토픽 혹은 기출문제 모범답안 찾아줘").
 *   npx tsx scripts/report-answer-gaps.ts [--json out.json]
 *  - 답안 0편인 교재 토픽
 *  - 「🎯 같은 문제」 답안이 없는 기출(k·c) — 회차별 개수
 *  - 같은 문제 답안이 있는 문항 비율(구분별)
 */
import { writeFileSync } from "node:fs";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { PEER_ANSWERS, peerAnswersFor } from "../src/data/peerAnswers";
import { sameQuestionText } from "../src/lib/questionText";
import questions from "../src/data/questions.json";

type Q = { id: string; text: string; kind?: string; source?: string };
const noAns = SUBNOTES.filter((s) => peerAnswersFor(s.title).length === 0).map((s) => s.title);
const byQid = new Set(PEER_ANSWERS.flatMap((a) => a.questionIds ?? []));
// 같은 문제 판정은 비싸서 알맹이 첫 4글자로 후보를 줄인다
const head = (t: string) => t.replace(/[^0-9A-Za-z가-힣]/g, "").toLowerCase().slice(0, 4);
const byHead = new Map<string, string[]>();
for (const a of PEER_ANSWERS) {
  const k = head(a.question);
  byHead.set(k, [...(byHead.get(k) ?? []), a.question]);
}
const has = (q: Q) => byQid.has(q.id) || (byHead.get(head(q.text)) ?? []).some((t) => sameQuestionText(t, q.text));

const missPast: Record<string, number> = {};
const cover: Record<string, [number, number]> = {};
for (const q of questions as Q[]) {
  if (!q.source && !q.kind) continue;
  const kind = q.kind ?? "기출";
  const ok = has(q);
  cover[kind] ??= [0, 0];
  cover[kind][0]++;
  if (ok) cover[kind][1]++;
  if (!ok && /^[kc]\d/.test(q.id)) {
    const r = q.id.split("-")[0];
    missPast[r] = (missPast[r] ?? 0) + 1;
  }
}
console.log(`답안 0편 교재 토픽 ${noAns.length}개`);
for (const t of noAns) console.log("  -", t);
console.log("\n같은 문제 답안이 있는 문항(구분별):");
for (const [k, [n, ok]] of Object.entries(cover)) console.log(`  ${k}: ${ok}/${n} (${Math.round((ok / n) * 100)}%)`);
const miss = Object.entries(missPast).sort((a, b) => b[1] - a[1]);
console.log(`\n같은 문제 답안이 없는 기출 ${miss.reduce((s, [, n]) => s + n, 0)}문항:`, miss.map(([r, n]) => `${r}:${n}`).join(" "));
const i = process.argv.indexOf("--json");
if (i > 0) writeFileSync(process.argv[i + 1], JSON.stringify({ noAns, missPast, cover }, null, 1));
