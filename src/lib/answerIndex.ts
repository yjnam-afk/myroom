import "server-only";
import modelAnswers from "@/data/modelAnswers.json";
import questions from "@/data/questions.json";

/**
 * 모범답안 목록 화면용 색인.
 *
 * modelAnswers.json 은 18MB 라 화면에 통째로 내려보낼 수 없다. 여기서 제목·교시·
 * 출처만 뽑아 가벼운 줄로 만들고, 본문은 누를 때 /answer?id= 로 가서 받는다.
 * 별칭(같은 문제를 공유하는 문항)은 정본 하나만 남긴다 — 목록에 같은 답안이
 * 여러 줄로 늘어서면 찾기만 어려워진다.
 */
export type AnswerRow = {
  id: string;
  period: string;
  title: string;
  /** 기출·NS모의·파이널·모의고사·예상·셀테 */
  kind: string;
  /** 몇 회·몇 기 문항인지 — 목록 오른쪽 작은 글씨 */
  exam: string;
  /** 검색 대상(소문자) — 제목 + 문제 전문 + 출처 */
  hay: string;
};

type Entry = { period?: string; title?: string; answer?: string; source?: string; aliasOf?: string };
type Q = { id: string; kind?: string; period?: string; exam?: string; cohort?: string; round?: string; text: string };

const MA = modelAnswers as Record<string, Entry>;
const Q_BY_ID = new Map((questions as Q[]).map((q) => [q.id, q]));

/** k139-101 → "139회", ns15w11-102 → "NS 15기 11주차" */
function examLabel(id: string, q?: Q): string {
  if (q?.exam) return q.exam;
  const k = /^k(\d+)-/.exec(id);
  if (k) return `${k[1]}회`;
  const ns = /^ns(\d+)w(\d+)-/.exec(id);
  if (ns) return `NS ${Number(ns[1])}기 ${Number(ns[2])}주차`;
  if (q?.cohort || q?.round) return [q?.cohort, q?.round].filter(Boolean).join(" ");
  return "";
}

let cached: AnswerRow[] | null = null;

export function answerRows(): AnswerRow[] {
  if (cached) return cached;
  const rows: AnswerRow[] = [];
  for (const [id, e] of Object.entries(MA)) {
    if (e.aliasOf || !e.answer) continue;
    const q = Q_BY_ID.get(id);
    const title = e.title || q?.text?.slice(0, 40) || id;
    const kind = q?.kind || (/^k\d/.test(id) ? "기출" : "");
    const exam = examLabel(id, q);
    rows.push({
      id,
      period: e.period || q?.period || "",
      title,
      kind,
      exam,
      hay: `${title} ${q?.text ?? ""} ${e.source ?? ""} ${kind} ${exam}`.toLowerCase(),
    });
  }
  rows.sort((a, b) => a.period.localeCompare(b.period) || a.title.localeCompare(b.title, "ko"));
  cached = rows;
  return rows;
}
