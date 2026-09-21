/**
 * 학습계획의 완료 체크 → 회독 기록 연결.
 *
 * 예전에는 둘이 따로 놀았다. 메인·학습계획에서 오늘 토픽을 체크해도 회독 관리는
 * 늘 비어 있었고, 회독 관리에서 따로 「회독함」을 눌러야만 망각곡선 간격이
 * 돌아갔다. 계획대로 공부한 사람이 회독 관리에서는 아무것도 안 한 사람으로
 * 보였다. 그래서 체크를 회독 1회로 그대로 기록한다.
 *
 * 규칙
 *  - 체크를 켤 때만 기록한다. 체크를 풀어도 회독은 되돌리지 않는다 —
 *    이미 읽은 것을 안 읽은 것으로 만들 이유가 없다(잘못 눌렀으면 회독 관리에서
 *    그 토픽을 초기화한다).
 *  - 같은 체크 키는 한 번만 센다. 체크를 껐다 켜기를 반복해도 회독이 불어나지 않도록
 *    기록한 키를 따로 저장해 둔다.
 */
import { REVIEW_TOPICS } from "@/data/reviewTopics";
import { loadReview, saveReview, markReviewed } from "@/lib/storage";

/** 이미 회독으로 센 체크 키 모음 */
const RECORDED_KEY = "info-pe-plan-rounds-v1";

/** 제목 비교용 정규화 — 괄호 병기·공백·기호를 털어낸다(reviewTopics 와 같은 규칙). */
function normTitle(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/]/g, "");
}

const ID_BY_TOPIC_ID = new Map<string, string>();
const ID_BY_TITLE = new Map<string, string>();
for (const t of REVIEW_TOPICS) {
  if (!ID_BY_TOPIC_ID.has(t.id)) ID_BY_TOPIC_ID.set(t.id, t.id);
  const k = normTitle(t.title);
  if (k && !ID_BY_TITLE.has(k)) ID_BY_TITLE.set(k, t.id);
}

/**
 * 계획의 토픽 → 회독 진도 저장 키.
 * 계획은 교재 제목을, 회독은 예전 토픽 id 를 쓰는 자리가 있어 둘 다 찾아본다.
 */
export function reviewTopicIdFor(
  title: string,
  topicId?: string,
): string | undefined {
  if (topicId && ID_BY_TOPIC_ID.has(topicId)) return topicId;
  return ID_BY_TITLE.get(normTitle(title));
}

function loadRecorded(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(RECORDED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveRecorded(s: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECORDED_KEY, JSON.stringify([...s]));
  } catch {
    /* 저장 실패는 무시 — 회독 기록 자체는 이미 저장됐다 */
  }
}

export type PlanCheck = {
  /** 완료 체크 키(doneKey) */
  key: string;
  title: string;
  topicId?: string;
};

/**
 * 체크한 토픽들을 회독 1회로 기록한다.
 * 이미 센 체크 키와 회독 목록에 없는 토픽은 건너뛴다. 실제로 기록한 개수를 준다.
 */
export function recordPlanRounds(items: PlanCheck[]): number {
  if (typeof window === "undefined" || items.length === 0) return 0;
  const recorded = loadRecorded();
  let state = loadReview();
  let n = 0;
  for (const it of items) {
    if (recorded.has(it.key)) continue;
    const id = reviewTopicIdFor(it.title, it.topicId);
    if (!id) continue;
    state = markReviewed(state, id);
    recorded.add(it.key);
    n++;
  }
  if (n > 0) {
    saveReview(state);
    saveRecorded(recorded);
  }
  return n;
}
