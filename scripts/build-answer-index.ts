/**
 * examAnswerIndex.json 생성기 — 클로드 모범답안(modelAnswers.json, 17MB)·조립 답안(genAnswers.json, 17MB)이
 * 「있는지」만 담은 작은 표. 문제풀이 화면은 이것만 들고 있다가, 펼칠 때 /api/exam-answer 로 본문을 받는다.
 * (2026-11-01 정리 — 그 전엔 두 파일을 통째로 브라우저에 실어 첫 로딩이 12.9MB 였다.)
 *   hand: 클로드 모범답안이 있는 문항 id · gen: 조립 답안만 있는 문항 id · alias: 답안을 공유하는 문항 → 정본 id
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getModelAnswer, canonicalAnswerId } from "../src/lib/modelAnswers";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const questions: { id: string }[] = JSON.parse(fs.readFileSync(path.join(root, "src/data/questions.json"), "utf8"));
const gen: Record<string, unknown> = JSON.parse(fs.readFileSync(path.join(root, "src/data/genAnswers.json"), "utf8"));
const hand: string[] = [];
const genOnly: string[] = [];
const alias: Record<string, string> = {};
for (const q of questions) {
  if (getModelAnswer(q.id)) hand.push(q.id);
  else if (gen[q.id]) genOnly.push(q.id);
  const c = canonicalAnswerId(q.id);
  if (c) alias[q.id] = c;
}
fs.writeFileSync(path.join(root, "src/data/examAnswerIndex.json"), JSON.stringify({ hand, gen: genOnly, alias }));
console.log(`examAnswerIndex.json: 클로드 모범답안 ${hand.length} · 조립 답안 ${genOnly.length} · 공유 ${Object.keys(alias).length}`);
