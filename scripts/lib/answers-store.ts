/**
 * 답안 데이터(src/data/peerAnswers/*.json) 읽기·검사·쓰기 — 답안을 고치는 스크립트는 모두 이걸 거친다.
 * 2026-11-01: peerAnswers.ts 의 TS 배열(11만 줄)을 파이썬 문자열 치환으로 고치다 빌드가 깨져 JSON 으로 옮겼다.
 * 저장 전에 validate() 가 오류를 내면 쓰지 않는다.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PeerAnswer } from "../../src/data/peerAnswers";

export const ROOT = join(__dirname, "..", "..");
export const DIR = join(ROOT, "src/data/peerAnswers");
const KEYS = ["id", "period", "no", "question", "exam", "topicTitles", "questionIds", "score", "maxScore", "feedback", "memo", "pages"] as const;
const PERIODS = new Set(["1교시", "2교시", "3교시", "4교시"]);

export type Group = { file: string; items: PeerAnswer[] };

export function loadGroups(): Group[] {
  return readdirSync(DIR)
    .filter((f) => /^\d+\.json$/.test(f))
    .sort()
    .map((f) => ({ file: f, items: JSON.parse(readFileSync(join(DIR, f), "utf8")) as PeerAnswer[] }));
}

/** 한 줄에 답안 하나 — 칸 순서를 고정해 diff 가 한 줄로 나오게 */
function line(a: PeerAnswer): string {
  const o: Record<string, unknown> = {};
  for (const k of KEYS) if ((a as Record<string, unknown>)[k] !== undefined) o[k] = (a as Record<string, unknown>)[k];
  const extra = Object.keys(a).filter((k) => !(KEYS as readonly string[]).includes(k));
  if (extra.length) throw new Error(`${a.id}: 모르는 칸 ${extra.join(", ")}`);
  return JSON.stringify(o);
}

export function saveGroups(groups: Group[]) {
  const errors = validate(groups).filter((p) => p.level === "error");
  if (errors.length) {
    for (const e of errors.slice(0, 30)) console.error("✗", e.id, e.msg);
    throw new Error(`검사 오류 ${errors.length}건 — 저장하지 않았다`);
  }
  for (const g of groups) writeFileSync(join(DIR, g.file), "[\n" + g.items.map(line).join(",\n") + "\n]\n");
}

export type Problem = { level: "error" | "warn"; id: string; msg: string };

let knownTitles: Set<string> | undefined;
function titles(): Set<string> {
  if (knownTitles) return knownTitles;
  // 교재 서브노트·서브 토픽·예전 토픽(topics.json) 제목 — 답안 topicTitles 는 이 중 하나여야 화면에 붙는다
  const { SUBNOTES } = require("../../src/data/textbookSubnotes");
  const { SUB_TOPICS } = require("../../src/data/subTopics");
  const topics = JSON.parse(readFileSync(join(ROOT, "src/data/topics.json"), "utf8"));
  const list: string[] = [
    ...SUBNOTES.map((s: { title: string }) => s.title),
    ...SUB_TOPICS.map((s: { name: string }) => s.name),
    ...(Array.isArray(topics) ? topics : Object.values(topics).flat()).map((t: { title?: string }) => t?.title).filter(Boolean),
  ];
  return (knownTitles = new Set(list));
}

export function validate(groups: Group[], opts: { files?: boolean } = { files: true }): Problem[] {
  const out: Problem[] = [];
  const qids = new Set((JSON.parse(readFileSync(join(ROOT, "src/data/questions.json"), "utf8")) as { id: string }[]).map((q) => q.id));
  const seen = new Set<string>();
  const known = titles();
  for (const g of groups)
    for (const a of g.items) {
      const err = (msg: string) => out.push({ level: "error", id: a.id, msg });
      const warn = (msg: string) => out.push({ level: "warn", id: a.id, msg });
      if (!a.id || !a.id.startsWith("peer-")) err("id 는 peer- 로 시작");
      if (seen.has(a.id)) err("id 중복");
      seen.add(a.id);
      if (!PERIODS.has(a.period)) err(`교시 「${a.period}」`);
      if (!a.question?.trim()) err("문제가 비었다");
      if (!Array.isArray(a.topicTitles)) err("topicTitles 가 배열이 아니다");
      else for (const t of a.topicTitles) if (!known.has(t)) warn(`모르는 토픽 「${t}」`);
      for (const q of a.questionIds ?? []) if (!qids.has(q)) err(`문제은행에 없는 문항 ${q}`);
      if (a.questionIds && new Set(a.questionIds).size !== a.questionIds.length) err("questionIds 중복");
      if (a.score !== undefined && a.maxScore !== undefined && a.score > a.maxScore) err(`점수 ${a.score} > 배점 ${a.maxScore}`);
      if (!a.pages?.length) err("쪽이 없다");
      if (opts.files)
        for (const p of a.pages ?? []) {
          // /answers/… 는 public 에, /ans2/… 는 별도 저장소(myroom-answers)에 있다 — 이 저장소에 없으면 건너뛴다
          if (p.src.startsWith("/ans2/")) continue;
          if (!existsSync(join(ROOT, "public", decodeURI(p.src)))) err(`이미지 없음 ${p.src}`);
        }
    }
  return out;
}

export function findAnswer(groups: Group[], id: string): PeerAnswer {
  for (const g of groups) {
    const a = g.items.find((x) => x.id === id);
    if (a) return a;
  }
  throw new Error(`없는 답안 ${id}`);
}
