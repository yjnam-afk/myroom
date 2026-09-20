/**
 * 커리큘럼에 적어 둔 학습 정보를 다른 페이지에서도 쓰기 위한 조회표.
 *
 * 학습 레벨(암기·숙지·점검·참고)과 코멘트는 학습계획 페이지에만 있었다.
 * 정작 그 정보가 필요한 곳은 회독 관리·토픽 지도·지하철 카드다 —
 * "오늘 뭘 먼저 볼까"를 거기서 고르기 때문이다. 그래서 제목으로 찾을 수 있게
 * 한 번만 색인해 공유한다.
 *
 * 제목 매칭은 느슨하게 한다. 커리큘럼 제목("교착상태(Deadlock)")과
 * 교재 서브노트 제목("교착상태")이 괄호 병기 여부만 다른 경우가 많다.
 */
import { WEEKS, type Priority, type StudyLevel } from "@/data/curriculum";

export type PlanInfo = {
  title: string;
  priority: Priority;
  level?: StudyLevel;
  note?: string;
  topicId?: string;
  /** 이 토픽을 다루는 주차 시작일(가장 이른 것) */
  weekStart: string;
  /** 그 주차 제목 */
  weekTitle: string;
};

/** 괄호 병기·공백·기호를 털어낸 비교용 키. 인공지능↔AI 표기 차이도 같은 키로. */
function norm(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "")
    .replace(/인공지능/g, "ai");
}

/**
 * 제목 하나가 낼 수 있는 키 전부 — 본문 키에 더해 괄호 속 병기(RAG, Retrieval …)와
 * 줄표(—) 뒤 부제도 키로 삼는다. 커리큘럼은 "RAG(Retrieval Augmented Generation)",
 * 교재는 "검색 증강 생성(RAG, …)" 이라 본문 키만으로는 서로 못 찾았다.
 * 짧은 영문 약어(3자 이하)는 키로 안 쓴다 — "AI" 하나로 엉뚱한 토픽에 붙는다.
 */
function keysOf(title: string): string[] {
  const t = (title || "").trim();
  const out = [norm(t)];
  for (const seg of t.split(/\s+[—–]\s+/)) {
    const k = norm(seg);
    if (k.length >= 4) out.push(k);
  }
  for (const m of t.matchAll(/[(（]([^)）]+)[)）]/g)) {
    for (const part of m[1].split(/[,，/]/)) {
      const k = norm(part);
      if (k.length >= 4) out.push(k);
    }
  }
  return Array.from(new Set(out.filter(Boolean)));
}

const BY_TITLE = new Map<string, PlanInfo>();
const BY_TOPIC_ID = new Map<string, PlanInfo>();
/** 학습계획에 처음 나오는 차례 — 토픽 설명·정리표를 계획과 같은 줄 순서로 놓을 때 쓴다. */
const ORDER_BY_TITLE = new Map<string, number>();
const ORDER_BY_TOPIC_ID = new Map<string, number>();
let seq = 0;

for (const w of WEEKS) {
  for (const d of w.days) {
    // 정독일(review)도 그 주 범위를 토픽으로 들고 있다 — 진도일만 보면 빠진다.
    const topics =
      d.kind === "study" || d.kind === "review" ? d.topics ?? [] : [];
    for (const t of topics) {
      const ok = norm(t.title);
      if (!ORDER_BY_TITLE.has(ok)) {
        const n = seq++;
        for (const k of keysOf(t.title)) if (!ORDER_BY_TITLE.has(k)) ORDER_BY_TITLE.set(k, n);
      }
      if (t.topicId && !ORDER_BY_TOPIC_ID.has(t.topicId)) ORDER_BY_TOPIC_ID.set(t.topicId, ORDER_BY_TITLE.get(ok)!);
      const info: PlanInfo = {
        title: t.title,
        priority: t.priority,
        level: t.level,
        note: t.note,
        topicId: t.topicId,
        weekStart: w.start,
        weekTitle: w.title,
      };
      const key = norm(t.title);
      const prev = BY_TITLE.get(key);
      // 같은 토픽이 여러 주차에 나오면(선행 → 심화 → 로드맵) 레벨·코멘트가
      // 적힌 쪽을 남긴다. 둘 다 있으면 이른 주차가 원본이다.
      if (!prev || (!prev.note && info.note) || (!prev.level && info.level)) {
        BY_TITLE.set(key, info);
        for (const k of keysOf(t.title)) if (!BY_TITLE.has(k)) BY_TITLE.set(k, info);
        if (t.topicId) BY_TOPIC_ID.set(t.topicId, info);
      }
    }
  }
}

/** 제목(또는 topicId)으로 커리큘럼 정보를 찾는다. 없으면 null. */
export function planInfo(title?: string, topicId?: string): PlanInfo | null {
  if (topicId) {
    const byId = BY_TOPIC_ID.get(topicId);
    if (byId) return byId;
  }
  if (!title) return null;
  for (const k of keysOf(title)) {
    const v = BY_TITLE.get(k);
    if (v) return v;
  }
  return null;
}

/**
 * 학습계획에서의 차례(0부터). 계획에 없는 토픽은 null.
 * 토픽 설명의 과목별 목록·이전/다음이 교재 배열 순서(SUBNOTES)를 따르는 바람에
 * 인공지능 과목은 학습계획과 줄 순서가 어긋났다 — 계획 번호로 찾으면 다른 토픽이 나왔다.
 */
export function planOrder(title?: string, topicId?: string): number | null {
  if (topicId) {
    const byId = ORDER_BY_TOPIC_ID.get(topicId);
    if (byId !== undefined) return byId;
  }
  if (!title) return null;
  for (const k of keysOf(title)) {
    const v = ORDER_BY_TITLE.get(k);
    if (v !== undefined) return v;
  }
  return null;
}

/** 커리큘럼 우선순위만 필요할 때. */
export function planPriority(title?: string, topicId?: string): Priority | null {
  return planInfo(title, topicId)?.priority ?? null;
}

/** 학습 레벨만 필요할 때. */
export function planLevel(title?: string, topicId?: string): StudyLevel | null {
  return planInfo(title, topicId)?.level ?? null;
}

/** 레벨 정렬 순서 — 급한 것부터. 레벨이 없으면 맨 뒤. */
export const LEVEL_ORDER: Record<string, number> = {
  암기: 0,
  숙지: 1,
  점검: 2,
  참고: 3,
};

export function levelOrder(level?: StudyLevel | null): number {
  return level ? LEVEL_ORDER[level] ?? 9 : 9;
}

/** 레벨 배지 색 — 페이지마다 다르게 칠하지 않도록 여기서 정한다. */
export const LEVEL_STYLE: Record<string, string> = {
  암기: "border-rose-300 bg-rose-50 text-rose-700",
  숙지: "border-amber-300 bg-amber-50 text-amber-700",
  점검: "border-sky-300 bg-sky-50 text-sky-700",
  참고: "border-slate-200 bg-slate-50 text-slate-400",
};

/** 레벨이 무슨 뜻인지 — 배지 title 속성에 넣어 마우스로 확인할 수 있게. */
export const LEVEL_HINT: Record<string, string> = {
  암기: "통째로 외운다 — 정의·유형·조건까지 그대로",
  숙지: "개념과 구조를 이해해 둔다 — 설명할 수 있으면 된다",
  점검: "출제 공백이 길거나 기억이 흔들려 한 번 훑어야 한다",
  참고: "당분간 출제 가능성이 낮다 — 시간 남을 때",
};

/** 레벨이 매겨진 토픽 수(과목 무관) — 화면에 "N개에 레벨 있음"을 쓸 때. */
export const LEVELED_COUNT = Array.from(BY_TITLE.values()).filter(
  (p) => p.level,
).length;
