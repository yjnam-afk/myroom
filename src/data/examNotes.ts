/**
 * 교재 밖 토픽 정리 — 해설집 스캔에서 옮긴 내용(2026-11-23 "다음에 할 일이 끊겨있네" — 해설집이 걸린 주제부터 내용 정리).
 *
 * 교재에 쪽이 없는 토픽(examTopics.json)은 화면에 출제 문항·답안만 모였다. 그 토픽을 다룬 해설집(문항에 직접 걸린 것)의
 * 정의·표를 **해설에 적힌 대로** 옮겨 둔다 — 지어 넣지 않는다. 메모리 월·PIM 처럼 서브노트로 만들지는 않았다(지도 계층·답안 틀·
 * 「왜 있나」까지 다 채워야 해서). 토픽 설명 화면이 「📘 해설집에서 옮긴 정리」 칸으로 보여 주고, 출처 해설을 적는다.
 * 자료는 examNotes.json(키 = examTopics 의 name). 옮김은 스캔을 읽은 것이라 오탈자가 있을 수 있다 — 아래 해설집 원본이 기준이다.
 */
import notes from "./examNotes.json";

export type ExamNote = {
  lead?: string;
  definition?: string;
  features?: string[];
  keywords?: string[];
  tables?: { caption: string; headers: string[]; rows: string[][] }[];
  figures?: string[];
  pros?: Record<string, string[]>;
  uses?: string[];
  /** 옮겨 온 해설 — 답안 id · 출처 · 그 해설의 문제 */
  source: { answerId: string; exam: string; question: string };
};

const NOTES = notes as Record<string, ExamNote>;
export const examNoteFor = (title?: string | null): ExamNote | undefined => (title ? NOTES[title.trim()] : undefined);
export const EXAM_NOTE_TITLES = Object.keys(NOTES);
