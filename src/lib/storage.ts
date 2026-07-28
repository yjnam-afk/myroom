// localStorage 헬퍼 — 모든 데이터는 브라우저에만 저장(서버 전송 없음)

export type Profile = {
  name: string;
  motto: string; // 오늘의 한 줄
  mood: string; // 오늘의 기분 이모지
};

export type Dday = {
  label: string;
  date: string; // YYYY-MM-DD (빈 문자열이면 미설정)
};

export type Sticker = {
  id: string;
  emoji: string;
  x: number; // 방 안 좌표(%)
  y: number;
};

export type RoomState = {
  theme: string; // 벽지 테마 키
  stickers: Sticker[];
};

export type DiaryEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: string;
  text: string;
};

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

export type LinkItem = {
  id: string;
  emoji: string;
  title: string;
  url: string;
};

const KEYS = {
  profile: "myroom:profile",
  dday: "myroom:dday",
  room: "myroom:room",
  diary: "myroom:diary",
  todos: "myroom:todos",
  links: "myroom:links",
} as const;

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 공간 부족 등은 조용히 무시 */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// ── 프로필 ──
export const loadProfile = () =>
  load<Profile>(KEYS.profile, { name: "", motto: "", mood: "" });
export const saveProfile = (p: Profile) => save(KEYS.profile, p);

// ── D-day ──
export const loadDday = () =>
  load<Dday>(KEYS.dday, { label: "정보관리기술사 시험", date: "" });
export const saveDday = (d: Dday) => save(KEYS.dday, d);

/** 남은 날짜 수. 오늘이면 0(D-DAY), 지났으면 음수, 미설정이면 null */
export function ddayCount(d: Dday): number | null {
  if (!d.date) return null;
  const target = new Date(`${d.date}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// ── 마이룸 꾸미기 ──
export const loadRoom = () =>
  load<RoomState>(KEYS.room, { theme: "sky", stickers: [] });
export const saveRoom = (r: RoomState) => save(KEYS.room, r);

// ── 다이어리 ──
export const loadDiary = () => load<DiaryEntry[]>(KEYS.diary, []);
export const saveDiary = (entries: DiaryEntry[]) => save(KEYS.diary, entries);

// ── 할 일 ──
export const loadTodos = () => load<Todo[]>(KEYS.todos, []);
export const saveTodos = (todos: Todo[]) => save(KEYS.todos, todos);

// ── 즐겨찾기 ──
const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "study",
    emoji: "📘",
    title: "다 같이 스파르타 (기술사 학습)",
    url: "https://study-teal-eight.vercel.app",
  },
];
export const loadLinks = () => load<LinkItem[]>(KEYS.links, DEFAULT_LINKS);
export const saveLinks = (links: LinkItem[]) => save(KEYS.links, links);
