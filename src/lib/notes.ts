/**
 * 오답노트와 퀴즈 학습 통계를 브라우저 localStorage 에 저장/관리합니다.
 * 서버 DB 없이 가볍게 동작하도록 클라이언트 측에서만 사용합니다.
 */
import { isBrowser } from "@/lib/browser";

export type WrongNote = {
  /** 문제 텍스트 기반 고유 키 (중복 저장 방지) */
  id: string;
  topic: string;
  question: string;
  options: string[];
  /** 정답 인덱스(0~3) */
  answer: number;
  /** 사용자가 고른 오답 인덱스 */
  picked: number;
  explanation: string;
  createdAt: string;
  /** 누적 틀린 횟수 (자주 틀릴수록 자주 다시 출제) */
  wrongCount: number;
  /** 복습에서 맞힌 횟수 */
  correctCount: number;
  /** 라이트너 박스 단계(1~5). 맞히면 ↑, 틀리면 1로 초기화 */
  box: number;
  /** 다음 복습 예정일(ISO) */
  nextDueAt: string | null;
  /** 박스 5단계 도달 = 암기 완료 */
  mastered: boolean;
};

export type QuizStats = {
  /** 푼 문제 수 */
  total: number;
  /** 맞힌 문제 수 */
  correct: number;
  lastAt: string | null;
};

const NOTES_KEY = "info-pe-wrong-notes-v1";
const STATS_KEY = "info-pe-quiz-stats-v1";

/** 문제 텍스트로 안정적인 ID 생성(같은 문제는 같은 ID). */
function makeId(question: string): string {
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = (hash * 31 + question.charCodeAt(i)) | 0;
  }
  return `n${Math.abs(hash)}`;
}

// ── 오답노트 ─────────────────────────────────────────────

/** 예전 데이터 호환: 누락된 반복 학습 필드를 채워준다. */
function normalize(n: Partial<WrongNote>): WrongNote {
  return {
    id: n.id || makeId(n.question || ""),
    topic: n.topic || "기타",
    question: n.question || "",
    options: n.options || [],
    answer: n.answer ?? 0,
    picked: n.picked ?? 0,
    explanation: n.explanation || "",
    createdAt: n.createdAt || new Date().toISOString(),
    wrongCount: n.wrongCount ?? 1,
    correctCount: n.correctCount ?? 0,
    box: n.box ?? 1,
    nextDueAt: n.nextDueAt ?? null,
    mastered: n.mastered ?? false,
  };
}

export function loadNotes(): WrongNote[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    const arr = raw ? (JSON.parse(raw) as Partial<WrongNote>[]) : [];
    return arr.map(normalize);
  } catch {
    return [];
  }
}

function emitChange() {
  if (isBrowser()) window.dispatchEvent(new Event("progress-change"));
}

function saveNotes(notes: WrongNote[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  emitChange();
}

/** 동기화용: 오답노트 전체를 교체 저장한다. */
export function replaceNotes(notes: WrongNote[]) {
  saveNotes(notes.map(normalize));
}

/** 동기화용: 퀴즈 통계를 통째로 저장한다. */
export function setStats(stats: QuizStats) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/** 오늘 복습할 오답인지(암기 완료 제외, 복습일 지남). */
function isNoteDue(n: WrongNote, now: number = Date.now()): boolean {
  if (n.mastered) return false;
  if (!n.nextDueAt) return true;
  return new Date(n.nextDueAt).getTime() <= now;
}

/** 복습할 오답 목록(자주 틀린 순 → 오래된 순). */
export function dueNotes(notes: WrongNote[]): WrongNote[] {
  return notes
    .filter((n) => isNoteDue(n))
    .sort(
      (a, b) =>
        b.wrongCount - a.wrongCount ||
        new Date(a.nextDueAt || a.createdAt).getTime() -
          new Date(b.nextDueAt || b.createdAt).getTime(),
    );
}

// ── 퀴즈 통계 ─────────────────────────────────────────────

export function loadStats(): QuizStats {
  if (!isBrowser()) return { total: 0, correct: 0, lastAt: null };
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    return raw
      ? (JSON.parse(raw) as QuizStats)
      : { total: 0, correct: 0, lastAt: null };
  } catch {
    return { total: 0, correct: 0, lastAt: null };
  }
}
