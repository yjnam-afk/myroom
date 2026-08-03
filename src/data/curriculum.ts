/**
 * 심화반 커리큘럼 — 내가 직접 정하는 학습 계획.
 *
 * 자동 배정이 아니라 이 파일에 적은 대로만 배정된다.
 * 새 주차가 정해지면 WEEKS 배열에 주차를 추가하면 끝(코드 수정 불필요).
 *
 * days: 월~일 7칸. 각 칸은 학습일(topics) 또는 회독일(review) 또는 휴식(rest).
 * topicId: topics.json 의 id (연결되면 두음신공·설명 링크가 붙는다). 없으면 제목만 표시.
 */

/** 교재 Priority — ★★★=상, ★★=중, ★=하 */
export type Priority = "상" | "중" | "하";

export type CurriculumTopic = {
  title: string;
  topicId?: string;
  priority: Priority;
};

export type CurriculumDay =
  | { kind: "study"; label: string; topics: CurriculumTopic[] }
  | { kind: "review"; label: string; note: string }
  | { kind: "rest"; label: string; note: string }
  /** 아직 토픽을 안 정한 날 — 서브노트를 올리면 study 로 채운다. */
  | { kind: "open"; label: string; note: string };

export type CurriculumWeek = {
  /** 주차 시작일(월요일) — YYYY-MM-DD */
  start: string;
  title: string;
  /** 월·화·수·목·금·토·일 순서로 7개 */
  days: CurriculumDay[];
};

// ── 1주차: 운영체제(OS) + 컴퓨터구조(CA) ──────────────────────────────
const OS_MEM: CurriculumTopic[] = [
  { title: "커널(Kernel)", topicId: "os-2", priority: "하" },
  { title: "CPU Ring Level", priority: "하" },
  { title: "기억장치 계층 구조(Memory Hierarchy)", topicId: "ca-51", priority: "중" },
  { title: "가상메모리 관리기법", topicId: "ca-55", priority: "상" },
  { title: "가상메모리의 페이징과 세그멘테이션", priority: "중" },
  { title: "직접 사상과 연관 사상 페이징 기법", topicId: "ca-87", priority: "중" },
  { title: "페이지 교체 알고리즘(Paging Replacement Algorithm)", topicId: "ca-84", priority: "중" },
  { title: "Belady's Anomaly(FIFO 이상현상)", topicId: "ca-90", priority: "중" },
  { title: "스레싱(Thrashing)", topicId: "os-75", priority: "상" },
  { title: "지역성(Locality)", topicId: "os-74", priority: "중" },
  { title: "단편화(Fragmentation)", topicId: "ca-58", priority: "중" },
];

const OS_PROC: CurriculumTopic[] = [
  { title: "스케줄러(Scheduler)", topicId: "os-23", priority: "하" },
  { title: "프로세스 상태 전이도", priority: "상" },
  { title: "CPU 스케줄링(CPU Scheduling)", priority: "중" },
  { title: "기한부(Deadline) 스케줄링", priority: "하" },
  { title: "문맥교환(Context Switching)", topicId: "os-47", priority: "상" },
  { title: "기아(Starvation)", topicId: "os-37", priority: "하" },
  { title: "인터럽트(Interrupt)", topicId: "os-63", priority: "상" },
  { title: "PCB(Process Control Block)", topicId: "os-48", priority: "중" },
  { title: "프로세스(Process)와 스레드(Thread) 비교", topicId: "os-53", priority: "중" },
  { title: "멀티 쓰레드(Multi-Thread)", topicId: "os-54", priority: "하" },
];

const OS_SYNC: CurriculumTopic[] = [
  { title: "경쟁조건(Race Condition) 해결 방안", topicId: "os-45", priority: "중" },
  { title: "세마포어(Semaphore)", topicId: "os-32", priority: "상" },
  { title: "우선순위 역전(Priority Inversion) 현상", topicId: "os-34", priority: "중" },
  { title: "프로세스간 통신(IPC)", topicId: "os-59", priority: "중" },
  { title: "교착상태(Deadlock)", topicId: "os-36", priority: "상" },
  { title: "자원할당 그래프(Resource Allocation Graph)", topicId: "os-39", priority: "중" },
  { title: "Banker's 알고리즘(은행가 알고리즘)", topicId: "os-41", priority: "중" },
  { title: "Wait-Die와 Wound-Wait", topicId: "os-38", priority: "하" },
  { title: "디스크 스케줄링(Disk Scheduling)", topicId: "os-24", priority: "하" },
  { title: "파일 시스템(유닉스 파일시스템)", topicId: "os-58", priority: "하" },
  { title: "유닉스의 inode", topicId: "os-57", priority: "하" },
];

const CA_ALL: CurriculumTopic[] = [
  { title: "CPU 처리과정", topicId: "ca-17", priority: "하" },
  { title: "CISC vs RISC", topicId: "ca-120", priority: "하" },
  { title: "Pipeline(파이프라인)", topicId: "ca-102", priority: "중" },
  { title: "Pipeline Hazard", topicId: "ca-106", priority: "중" },
  { title: "MMU(Memory Management Unit)", priority: "하" },
  { title: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)", topicId: "ca-78", priority: "하" },
  { title: "캐시 일관성(Cache Coherence)", topicId: "ca-77", priority: "중" },
  { title: "캐시 플러시(Cache Flush)", topicId: "ca-83", priority: "하" },
  { title: "캐시메모리의 쓰기정책(Write Policy)", topicId: "ca-76", priority: "하" },
  { title: "MESI", topicId: "ca-81", priority: "중" },
  { title: "메모리 인터리빙(Interleaving)", topicId: "ca-56", priority: "중" },
  { title: "메모리 단편화(Fragmentation)", priority: "상" },
  { title: "DMA(Direct Memory Access)", topicId: "ca-25", priority: "상" },
  { title: "I2C와 SPI", topicId: "ca-47", priority: "하" },
  { title: "HA(High Availability)", topicId: "ca-135", priority: "상" },
  { title: "결함허용 컴퓨터(FTS)", topicId: "ca-136", priority: "상" },
  { title: "워치독 타이머(WDT)", topicId: "os-81", priority: "중" },
  { title: "RAID", topicId: "ca-140", priority: "상" },
  { title: "이레이저 코딩(erasure coding)", priority: "하" },
  { title: "지능형 반도체", priority: "중" },
  { title: "TPU(Tensor Processing Unit)", topicId: "ca-22", priority: "상" },
];

const STUDY_DAYS: CurriculumDay[] = [
  { kind: "study", label: "OS ① 메모리·가상메모리", topics: OS_MEM },
  { kind: "study", label: "OS ② 프로세스·스케줄링", topics: OS_PROC },
  { kind: "study", label: "OS ③ 동기화·교착·파일", topics: OS_SYNC },
  { kind: "study", label: "CA 전체", topics: CA_ALL },
];

export const WEEKS: CurriculumWeek[] = [
  {
    // 심화반(9월) 전에 미리 도는 선행 학습 — 오늘부터 시작.
    // 새 서브노트를 올리면 해당 요일 topics 배열에 추가하면 된다.
    start: "2026-08-03",
    title: "선행 학습 · 심화반 1주차 미리 돌기",
    days: [
      ...STUDY_DAYS,
      { kind: "review", label: "회독", note: "이번 주 선행한 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "rest", label: "휴식", note: "쉬는 것도 공부의 일부예요." },
    ],
  },
  {
    // ★ 심화반 입과 — 9월 첫주(9/1이 포함된 주) 월요일. 확정.
    start: "2026-08-31",
    title: "심화반 1주차 · 운영체제(OS) + 컴퓨터구조(CA)",
    days: [
      ...STUDY_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "rest", label: "휴식", note: "쉬는 것도 공부의 일부예요." },
    ],
  },
];

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

/** YYYY-MM-DD → 로컬 자정 Date */
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(now: number): Date {
  const n = new Date(now);
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export type TodayPlan = {
  week: CurriculumWeek;
  /** 0=월 … 6=일 */
  dayIndex: number;
  dayName: string;
  day: CurriculumDay;
};

/** 오늘이 속한 주차/요일의 계획을 찾는다. 커리큘럼에 없는 날이면 null. */
export function planForToday(now: number = Date.now()): TodayPlan | null {
  const today = startOfToday(now);
  for (const week of WEEKS) {
    const start = parseDate(week.start);
    const diff = Math.round((today.getTime() - start.getTime()) / 86400000);
    if (diff >= 0 && diff < week.days.length) {
      return {
        week,
        dayIndex: diff,
        dayName: DAY_NAMES[diff] ?? "",
        day: week.days[diff],
      };
    }
  }
  return null;
}

// ── 달력 ────────────────────────────────────────────────────────────
export type CalendarCell = {
  /** YYYY-MM-DD. null 이면 달 시작 전/끝 이후의 빈 칸. */
  date: string | null;
  day: number;
  /** 이 날에 배정된 계획(없으면 undefined) */
  plan?: { week: CurriculumWeek; dayIndex: number; day: CurriculumDay };
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** YYYY-MM-DD 에 배정된 계획을 찾는다. */
export function planForDate(dateISO: string) {
  const target = parseDate(dateISO);
  for (const week of WEEKS) {
    const start = parseDate(week.start);
    const diff = Math.round((target.getTime() - start.getTime()) / 86400000);
    if (diff >= 0 && diff < week.days.length)
      return { week, dayIndex: diff, day: week.days[diff] };
  }
  return undefined;
}

/** 커리큘럼이 걸쳐 있는 달 목록(YYYY-MM) — 달력 탭에 쓴다. */
export function curriculumMonths(): string[] {
  const set = new Set<string>();
  for (const w of WEEKS) {
    const s = parseDate(w.start);
    for (let i = 0; i < w.days.length; i++) {
      const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i);
      set.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
  }
  return [...set].sort();
}

/** 월요일 시작 달력 그리드(6주 x 7일). */
export function monthGrid(ym: string): CalendarCell[] {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0).getDate();
  // JS: 0=일 → 월요일 시작으로 보정
  const lead = (first.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ date: null, day: 0 });
  for (let d = 1; d <= lastDay; d++) {
    const date = iso(new Date(y, m - 1, d));
    cells.push({ date, day: d, plan: planForDate(date) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: 0 });
  return cells;
}

/** 오늘 날짜(YYYY-MM-DD, 로컬). */
export function todayISO(now: number = Date.now()): string {
  return iso(startOfToday(now));
}

/** 커리큘럼에 들어 있는 모든 학습 토픽(회독 대상). */
export function allCurriculumTopics(): CurriculumTopic[] {
  const out: CurriculumTopic[] = [];
  for (const w of WEEKS)
    for (const d of w.days) if (d.kind === "study") out.push(...d.topics);
  return out;
}

// ── 학습 완료 체크(브라우저 저장) ──────────────────────────────
const DONE_KEY = "myroom:curriculum-done";

/**
 * 완료 체크의 저장 키. 주차별로 따로 센다 —
 * 선행 학습에서 체크한 토픽이 9월 심화반에서 이미 끝난 것으로 보이면 안 되므로.
 */
export function doneKey(weekStart: string, title: string): string {
  return `${weekStart}#${title}`;
}

export function loadDone(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DONE_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    // 예전(제목만) 키는 첫 주차 것으로 이관.
    const first = WEEKS[0]?.start ?? "";
    return new Set(arr.map((k) => (k.includes("#") ? k : doneKey(first, k))));
  } catch {
    return new Set();
  }
}

export function saveDone(done: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
  } catch {
    /* 저장 실패는 무시 */
  }
}
