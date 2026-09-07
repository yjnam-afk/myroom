/**
 * 회독 관리·랭킹 통계가 쓰는 "전체 토픽" 목록.
 *
 * topics.json(예전 토픽)만으로는 심화반 교재에만 있는 토픽(보안 98개 등)이
 * 회독 관리에서 통째로 빠진다. 그래서 교재 서브노트를 같은 모양으로 변환해
 * 뒤에 이어 붙인 목록을 여기서 한 번만 만들어 공유한다.
 *
 * ★ id 는 회독 진도의 저장 키다. 한 번 정한 규칙을 바꾸면 기존 진도가 끊기므로
 *   교재 토픽 id 는 `tb-{과목}-{제목 정규화}` 규칙을 고정해서 쓴다. ★
 */
import rawTopics from "@/data/topics.json";
import { SUBNOTES, subnoteByAlias } from "@/data/textbookSubnotes";
import { DOMAIN_LABEL, domainLabel } from "@/lib/domains";
import { planInfo } from "@/lib/studyPlan";

export type ReviewTopic = {
  id: string;
  title: string;
  category: string;
  group?: string;
  importance: string;
  summary: string;
  /** 교재 서브노트에서 만들어진 항목인지 */
  fromTextbook?: boolean;
  /** 토픽 출처 — 심화반(교재) · 기필반(엑셀) · 기출 · 요청 */
  source?: string;
  /** 학습계획에 매긴 레벨(암기·숙지·점검·참고) — 없을 수 있다. */
  level?: string;
  /** 왜 그 레벨인지 한 줄 메모 */
  levelNote?: string;
};

/**
 * 과목 이름은 lib/domains 한 곳에서만 정한다.
 * 예전엔 여기서 SE 를 "SW공학"이라 적어, topics.json 의 "소프트웨어공학"과
 * 갈라져 같은 과목이 목록에 두 번 나왔다.
 */
export const COURSE_LABEL = DOMAIN_LABEL;

/** 제목 비교용 정규화 — 괄호 병기·공백·기호를 털어낸다. */
function normTitle(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/]/g, "");
}

/**
 * 교재와 topicId 로 연결된 예전 토픽은 제목이 달라도 같은 토픽이다.
 * 두 번 세지 않도록 예전 항목을 교재 제목·중요도로 갈아끼운다.
 * (id 는 회독 진도의 저장 키라 그대로 둬야 기존 진도가 유지된다.)
 */
const BASE: ReviewTopic[] = (rawTopics as ReviewTopic[]).map((t) => {
  const s = subnoteByAlias(t.id, t.title);
  const p = planInfo(s?.title ?? t.title, s?.topicId ?? t.id);
  if (!s) {
    // 교재에 없는 예전 토픽 — 과목 이름만 정식 이름으로 맞추고 레벨을 붙인다.
    return {
      ...t,
      category: domainLabel(t.category),
      group: t.group ? domainLabel(t.group) : t.group,
      level: p?.level,
      levelNote: p?.note,
    };
  }
  const cat = COURSE_LABEL[s.course] || s.course;
  return {
    ...t,
    title: s.title,
    category: cat,
    group: cat,
    // 심화반 교재에 실린 토픽은 출제 비중이 높아 '상'으로 본다.
    importance: "상",
    summary: s.defShort || s.definition,
    fromTextbook: true,
    source: "심화반",
    level: p?.level,
    levelNote: p?.note,
  };
});
const SEEN = new Set(BASE.map((t) => normTitle(t.title)));

/** 교재에만 있는 토픽 — 예전 토픽 목록 뒤에 이어 붙인다. */
const TEXTBOOK_ONLY: ReviewTopic[] = [];
for (const s of SUBNOTES) {
  const key = normTitle(s.title);
  if (SEEN.has(key)) continue;
  SEEN.add(key);
  const p = planInfo(s.title, s.topicId);
  TEXTBOOK_ONLY.push({
    id: `tb-${s.course}-${key}`,
    title: s.title,
    category: COURSE_LABEL[s.course] || s.course,
    group: COURSE_LABEL[s.course] || s.course,
    // 심화반 교재에 실린 토픽은 출제 비중이 높아 기본 중요도를 '상'으로 둔다.
    importance: "상",
    summary: s.defShort || s.definition,
    fromTextbook: true,
    source: "심화반",
    level: p?.level,
    levelNote: p?.note,
  });
}

export const REVIEW_TOPICS: ReviewTopic[] = [...BASE, ...TEXTBOOK_ONLY];
export const TEXTBOOK_ONLY_COUNT = TEXTBOOK_ONLY.length;
