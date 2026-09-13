/**
 * 출제 이력 표기 도우미 — 자료(questions.json)를 읽지 않는 순수 함수만.
 * 화면 컴포넌트는 이 파일만 import 해야 문제은행 전체가 번들에 딸려오지 않는다.
 */
export type ExamAppearance = {
  id: string;
  cohort: string;      // "18기"
  round: string;       // "09주차"
  date: string;        // "2026-05-03"
  period: string;      // "1교시"
  exam?: string;       // "139회 실전 Simulation"
  text: string;
};

export type PastAppearance = {
  id: string;
  round: number;   // 140
  period: string;  // "1교시"
  no: number;      // 6
  text: string;
};

/** "2026-05-03" → "26.05" */
export const ym = (d: string) => (d ? `${d.slice(2, 4)}.${d.slice(5, 7)}` : "");

/** "09주차" → "9주차" */
export const weekLabel = (r: string) => r.replace(/^0/, "");

/** 최근 12개월 안에 나왔는가 — 강조 기준. */
export function isRecent(date: string, now = new Date()): boolean {
  if (!date) return false;
  const d = new Date(date);
  const ms = now.getTime() - d.getTime();
  return ms >= 0 && ms < 365 * 24 * 3600 * 1000;
}

/** 이력 한 줄 요약 — 배지에 쓴다. */
export function summarize(hist: ExamAppearance[], now = new Date()) {
  const recent = hist.filter((h) => isRecent(h.date, now)).length;
  return {
    count: hist.length,
    recent,
    latest: hist[0]?.date || "",
    /** 최근 1년에 2번 이상 또는 통산 4번 이상이면 "꼭 볼 것" */
    must: recent >= 2 || hist.length >= 4,
  };
}
