/**
 * 문항 메타 — 빈출·토픽 중요도·내 정리(scripts/build-question-freq.ts 가 만든 questionFreq.json).
 * 빈출(출제 횟수)과 중요도(교재 Priority)는 다른 축이다 — 2026-11-01 "빈출과 토픽 중요도가 분리되어야지".
 */
import meta from "@/data/questionFreq.json";
import { MY_NOTES, type MyNote } from "@/data/myNotes";

const M = meta as {
  cut: { 상: number; 중: number };
  f: Record<string, number>;
  p: Record<string, "상" | "중" | "하">;
  n: Record<string, string[]>;
};

export const TIERS = ["상", "중", "하"] as const;
export type Tier = (typeof TIERS)[number];
/** 중요도 칸 — 교재에 없는 토픽(신기술 등)은 「교재 밖」 */
export const PRIOS = ["상", "중", "하", "교재 밖"] as const;
export type Prio = (typeof PRIOS)[number];

export const freqOf = (id: string) => M.f[id] ?? 0;
export function freqTier(id: string): Tier {
  const n = freqOf(id);
  return n >= M.cut.상 ? "상" : n >= M.cut.중 ? "중" : "하";
}
export const FREQ_DESC: Record<Tier, string> = {
  상: `${M.cut.상}회 이상`,
  중: `${M.cut.중}~${M.cut.상 - 1}회`,
  하: `${M.cut.중 - 1}회 이하`,
};
export const prioOf = (id: string): Prio => M.p[id] ?? "교재 밖";
export const PRIO_STARS: Record<Prio, string> = { 상: "★★★", 중: "★★", 하: "★", "교재 밖": "" };

const NOTE = new Map(MY_NOTES.map((n) => [n.id, n]));
/** 이 문항 토픽에 걸린 내 정리·내 답안지 */
export const myNotesForQuestion = (id: string): MyNote[] =>
  (M.n[id] ?? []).map((x) => NOTE.get(x)).filter((x): x is MyNote => !!x);
