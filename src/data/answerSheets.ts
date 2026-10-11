/**
 * 답안용 표·개념도 — 토픽 답안지 템플릿(1교시 1~1.5쪽)에 그대로 옮겨 적는 분량.
 *
 * 2026-10-11 — "해설집, 모범답안 참고해서 진짜 답안지처럼". 교재 표를 통째로 싣던 템플릿이
 * 2~3쪽이 되어, 해설집·손글씨 답안처럼 「II. 개념도 + 3단표(4~8행)」「III. 짧은 표(3~5행)」로 줄였다.
 * 칸 글은 교재 표·정의·키워드의 말에서 조사·수식어만 덜어 냈다(지어 넣지 않는다 —
 * 검사: scratchpad ans/check.py 와 같은 규칙, CLAUDE.md 「교재 자료를 옮길 때」).
 * 머리글은 교재 머리글 그대로, 줄 앞 「- 」는 화면(AnswerTable)이 붙인다.
 * 개념도는 교재 슬라이드에서 그림 영역만 잘라 public/concept/answer/ 에 둔다.
 *
 * 키 = 교재 서브노트 제목. 없는 토픽은 교재 표 전체로 그린다.
 */
export type AnswerSheetTable = {
  caption: string;
  headers: string[];
  rows: string[][];
  /** 표 아래 간글 한 줄 */
  gloss?: string;
};
export type AnswerSheet = {
  /** 개념도 그림(public 경로) — 교재 슬라이드에서 잘라 낸 것 */
  diagram?: string[];
  /** [0] = II. 나. 구성요소 표, [1] = III. 비교·활용 표 */
  tables: AnswerSheetTable[];
};

export const ANSWER_SHEETS: Record<string, AnswerSheet> = {};

export const answerSheetFor = (title?: string | null): AnswerSheet | undefined =>
  title ? ANSWER_SHEETS[title] : undefined;
