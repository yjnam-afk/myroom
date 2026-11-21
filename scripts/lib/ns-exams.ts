/**
 * NS 주간 모의고사를 시험(기수·주차) 단위로 묶은 것 — 출제 예상(predict-week)과 재출제 측정(measure-ext-repeat)이 같이 쓴다.
 *
 *  - EXAMS      : 시험 목록(날짜순). 과목 묶음(group — 한 묶음이 60% 이상일 때만)과 그 기수에서 몇 회차인지(pass)가 붙는다.
 *  - GROUP      : 과목 이름 → 묶음(CA SE AI NW DB SC DX — NS 강의 한 주의 과목 단위)
 *  - TITLE_GROUP: 교재 토픽·서브 토픽 → 묶음
 *  - ymOfExt    : 기출·모의·파이널 문항의 연월(YYYYMM). 기출은 회차로 센다(한 해 세 번: 138회 = 2026.02, 139회 = 05, 140회 = 08)
 */
import questions from "@/data/questions.json";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { yearMonth } from "@/lib/questionText";

export type Q = { id: string; text: string; period?: string; category?: string; kind?: string; round?: string; cohort?: string; date?: string; source?: string };
export const ALL_QUESTIONS = questions as Q[];

export const GROUP: Record<string, string> = {
  컴퓨터구조: "CA", 운영체제: "CA", 소프트웨어공학: "SE", 프로젝트관리: "SE", 인공지능: "AI", "확률·통계": "AI",
  네트워크: "NW", 알고리즘: "NW", 자료구조: "NW", 데이터베이스: "DB", 경영전략: "DB", 보안: "SC", 디지털서비스: "DX",
};
export const COURSE_GROUP: Record<string, string> = { CA: "CA", OS: "CA", SE: "SE", PM: "SE", AI: "AI", ST: "AI", NW: "NW", AL: "NW", DS: "NW", DB: "DB", MG: "DB", SC: "SC", DX: "DX" };

export const NS = ALL_QUESTIONS.filter((q) => q.kind === "NS모의" && q.cohort && q.round && q.date);
export const cohortNo = (c: string) => parseInt(c, 10);

// ── 시험(기수·주차) 단위로 묶고, 과목 묶음과 몇 회차인지 붙인다
export type Exam = { key: string; cohort: number; round: string; date: string; qs: Q[]; group?: string; pass?: number };
const exams = new Map<string, Exam>();
for (const q of NS) {
  const key = `${q.cohort} ${q.round}`;
  let e = exams.get(key);
  if (!e) exams.set(key, (e = { key, cohort: cohortNo(q.cohort!), round: q.round!, date: q.date!, qs: [] }));
  e.qs.push(q);
}
export const EXAMS = [...exams.values()].sort((a, b) => a.date.localeCompare(b.date));
for (const e of EXAMS) {
  const cnt = new Map<string, number>();
  for (const q of e.qs) { const g = GROUP[q.category ?? ""]; if (g) cnt.set(g, (cnt.get(g) ?? 0) + 1); }
  const top = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] / e.qs.length >= 0.6) e.group = top[0];
}
for (const e of EXAMS) if (e.group) e.pass = EXAMS.filter((x) => x.cohort === e.cohort && x.group === e.group && x.date <= e.date).length;

// ── 교재 토픽·서브 토픽 → 묶음
export const TITLE_GROUP = new Map<string, string>();
for (const s of SUBNOTES) TITLE_GROUP.set(s.title, COURSE_GROUP[s.course]);
for (const s of SUB_TOPICS) { const p = SUBNOTES.find((x) => x.title === s.parent); if (p) TITLE_GROUP.set(s.name, COURSE_GROUP[p.course]); }

/** 기출·모의·파이널 문항의 연월(YYYYMM) — 연월을 알 수 없으면 0 */
export const ymOfExt = (q: Q): number => {
  const m = /^[kc](\d+)-/.exec(q.id);
  if (m) { const r = parseInt(m[1]); return (2026 - Math.floor((140 - r) / 3)) * 100 + [2, 5, 8][r % 3]; }
  return yearMonth(`${q.round ?? ""} ${q.source ?? ""}`);
};
/** YYYYMM → 달 수(두 연월의 차를 달로 셀 때) */
export const months = (ym: number) => Math.floor(ym / 100) * 12 + (ym % 100);
