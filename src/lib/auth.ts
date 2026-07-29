/**
 * 클라이언트 측 로그인 세션 + 랭킹 점수 계산/전송 유틸.
 * 세션(이름·토큰)은 localStorage 에 저장합니다.
 */
import topics from "@/data/topics.json";
import { loadReview, getItem } from "@/lib/storage";
import { loadStats, loadNotes } from "@/lib/notes";

export type Session = { name: string; token: string };

export type MyStats = {
  progress: number;
  doneCount: number;
  totalRounds: number;
  quizTotal: number;
  quizCorrect: number;
  accuracy: number;
};

const KEY = "info-pe-session-v1";

/**
 * 개인 모드 토큰 — 랭킹 DB(Upstash)가 설정되지 않은 배포에서는
 * 서버 계정 없이 이 토큰으로 로컬 세션만 만들어 입장한다.
 * (기록은 이 브라우저의 localStorage에만 저장되고, 랭킹·기기 간 동기화는 꺼진다)
 */
export const LOCAL_TOKEN = "local-only";

export function isLocalSession(s: Session | null): boolean {
  return !!s && s.token === LOCAL_TOKEN;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("auth-change"));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-change"));
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok)
    throw new ApiError(data.error || "요청에 실패했습니다.", res.status);
  return data as T;
}

/** 랭킹 DB 미설정(503) 여부 — 이때는 개인 모드로 폴백한다. */
function isDbUnconfigured(e: unknown): boolean {
  return e instanceof ApiError && e.status === 503;
}

function makeLocalSession(name: string): Session {
  const s = { name: name.trim(), token: LOCAL_TOKEN };
  saveSession(s);
  return s;
}

export async function register(name: string, password: string): Promise<Session> {
  try {
    const s = await postJson<Session>("/api/auth/register", { name, password });
    saveSession(s);
    return s;
  } catch (e) {
    if (isDbUnconfigured(e)) return makeLocalSession(name);
    throw e;
  }
}

export async function login(name: string, password: string): Promise<Session> {
  try {
    const s = await postJson<Session>("/api/auth/login", { name, password });
    saveSession(s);
    return s;
  } catch (e) {
    if (isDbUnconfigured(e)) return makeLocalSession(name);
    throw e;
  }
}

/** 이름·비밀번호 수정. 현재 비밀번호 확인 후, 변경된 새 세션을 저장한다. */
export async function updateProfile(
  session: Session,
  opts: { currentPassword: string; newName?: string; newPassword?: string },
): Promise<Session> {
  // 개인 모드: 서버 계정이 없으므로 이름만 로컬에서 변경
  if (isLocalSession(session)) {
    return makeLocalSession(opts.newName || session.name);
  }
  const s = await postJson<Session>("/api/auth/update", {
    name: session.name,
    token: session.token,
    ...opts,
  });
  saveSession(s);
  return s;
}

/** 내 학습 기록(localStorage)에서 랭킹 통계를 계산합니다. */
export function buildMyStats(): MyStats {
  const review = loadReview();
  const quiz = loadStats();
  const doneCount = topics.filter(
    (t) => getItem(review, t.id).status === "done",
  ).length;
  const totalRounds = topics.reduce(
    (sum, t) => sum + getItem(review, t.id).rounds,
    0,
  );
  const total = topics.length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;
  const accuracy =
    quiz.total > 0 ? Math.round((quiz.correct / quiz.total) * 100) : 0;
  return {
    progress,
    doneCount,
    totalRounds,
    quizTotal: quiz.total,
    quizCorrect: quiz.correct,
    accuracy,
  };
}

/**
 * 랭킹 점수 = 회독완료 토픽 ×100 + 총 회독수 ×10 + 퀴즈 정답수 ×5.
 * 꾸준히 회독하고 퀴즈를 많이 맞힐수록 높아집니다.
 */
export function computeScore(s: MyStats): number {
  return s.doneCount * 100 + s.totalRounds * 10 + s.quizCorrect * 5;
}

/** 내 기록을 서버 랭킹에 전송합니다. (개인 모드에서는 전송하지 않음) */
export async function submitScore(session: Session): Promise<number> {
  const stats = buildMyStats();
  const score = computeScore(stats);
  if (isLocalSession(session)) return score;
  await postJson("/api/score", {
    name: session.name,
    token: session.token,
    score,
    stats,
  });
  return score;
}
