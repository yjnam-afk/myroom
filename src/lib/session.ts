/**
 * 브라우저 세션(이름·토큰) 읽기/쓰기 — localStorage 만 만진다.
 *
 * auth.ts 와 따로 둔 이유: auth.ts 는 랭킹 통계 때문에 회독 토픽(교재 전체)을
 * import 한다. 세션만 필요한 화면(내 도식 등)이 auth.ts 를 물면 교재 자료가
 * 통째로 번들에 딸려온다. 세션만 쓸 때는 이 파일을 import 한다.
 */
export type Session = { name: string; token: string };

const KEY = "info-pe-session-v1";

/**
 * 표시 이름 일괄 변경 — 세션 이름은 이 브라우저의 localStorage에만 있어서
 * 서버에서 바꿔줄 수 없다. 그래서 앱을 열 때 한 번만 자동으로 갈아끼운다.
 * (이미 한 번 적용했으면 다시 건드리지 않으므로, 이후 직접 바꾼 이름은 유지된다)
 */
const RENAME_KEY = "info-pe-session-rename-v1";
const RENAME_FROM = ["남"];
const RENAME_TO = "Claire";

function applyRename(s: Session): Session {
  // 서버 계정은 토큰이 이름에서 파생되므로 로컬(개인 모드) 세션만 바꾼다.
  if (!isLocalSession(s)) return s;
  try {
    if (window.localStorage.getItem(RENAME_KEY)) return s;
    window.localStorage.setItem(RENAME_KEY, "done");
    if (!RENAME_FROM.includes(s.name.trim())) return s;
    const next = { ...s, name: RENAME_TO };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return s;
  }
}

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
    if (!raw) return null;
    return applyRename(JSON.parse(raw) as Session);
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
