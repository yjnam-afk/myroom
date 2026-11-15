/**
 * 토픽 지도 자료 — 지도·비교·암기표·묶음 보기가 함께 쓰는 토픽 목록과 찾기 함수.
 * (2026-11-15 MapClient.tsx 1,553줄을 보기별 파일로 나누며 떼어 냈다. 내용은 그대로다.)
 */
import topics from "@/data/topics.json";
import { compareSets } from "@/data/compareSets";
import { memoryTables } from "@/data/memoryTables";
import {
  SUBNOTES,
  subnoteByTitle,
  subnoteByAlias,
} from "@/data/textbookSubnotes";
import { DOMAIN_LABEL, domainLabel, sortDomains } from "@/lib/domains";
import { treePlaces } from "@/data/topicTree";
import { courseEntries } from "@/lib/courseOrder";
import type { TextbookSubnote } from "@/data/textbookSubnotes";
import { planInfo, levelOrder } from "@/lib/studyPlan";
import { matchSubnoteTitle, findSubnoteByContent } from "@/lib/matchSubnote";
import { topicForConcept } from "@/lib/relatedTopics";
import { explainHref as topicHref } from "@/lib/links";
import { IMP_ORDER } from "@/lib/badges";

export type Topic = {
  id: string;
  title: string;
  category: string;
  group: string;
  importance: string;
  summary: string;
  source?: string;
  /** 커리큘럼에 적어 둔 학습 레벨(암기·숙지·점검·참고) — 없을 수 있다. */
  level?: string;
  /** 왜 그 레벨인지 한 줄 메모 */
  levelNote?: string;
};

// ── 심화반 서브노트를 토픽지도에 통합 ─────────────────────────────────
// topics.json(기존 8도메인)에 없는 심화반 토픽 389+개를 과목별 도메인으로 합친다.
// 컴퓨터구조·운영체제·확률통계·자료구조·알고리즘은 새 도메인으로 생긴다.
// 과목 이름·순서는 lib/domains 한 곳에서만 정한다.
const COURSE_CAT = DOMAIN_LABEL;
// 교재에 같은 토픽이 있는 예전 항목은 빼고(아래 ALL), 교재 것만 남긴다.
// ★중복 판정 기준은 "남은 예전 토픽"이어야 한다★ — 전체 topics 로 비교하면
// 이미 제외된 예전 토픽과 제목이 같다는 이유로 교재 서브노트까지 빠져
// 지도에서 그 토픽이 통째로 사라진다(파이프라인·교착상태 등 94개).
const LEGACY_KEPT: Topic[] = (topics as Topic[]).filter(
  (t) => !subnoteByAlias(t.id, t.title),
);
const KNOWN = new Set(LEGACY_KEPT.map((t) => t.title));
const SUBNOTE_TOPICS: Topic[] = SUBNOTES.filter((s) => !KNOWN.has(s.title)).map(
  (s, i) => {
    const cat = COURSE_CAT[s.course] || s.course;
    const p = planInfo(s.title, s.topicId);
    return {
      id: `sn-${i}`,
      title: s.title,
      category: cat,
      group: `심화반 ${cat} 서브노트`,
      importance: p?.priority || "중",
      summary: s.defShort || "",
      source: "심화반",
      level: p?.level,
      levelNote: p?.note,
    };
  },
);

// 예전 토픽도 과목 이름을 정식 이름으로 맞추고, 커리큘럼에 있으면 레벨을 붙인다.
// (이름을 안 맞추면 "SW공학"처럼 같은 과목이 칩 두 개로 갈라진다.)
const withPlan = (t: Topic): Topic => {
  const p = planInfo(t.title);
  return {
    ...t,
    category: domainLabel(t.category),
    level: t.level ?? p?.level,
    levelNote: t.levelNote ?? p?.note,
  };
};
// 예전(기필반) 토픽은 회독 진도가 걸려 있어 지우지 않고 「예전 토픽 묶음」 탭에 둔다 —
// 교재와 표기가 달라 헷갈리게 했다. 교재 토픽은 토픽 탭(TOPICS_BY_CAT)이 교재 순서로 보여 준다.
export const LEGACY_TOPICS: Topic[] = LEGACY_KEPT.map(withPlan);
export const ALL: Topic[] = [...LEGACY_KEPT, ...SUBNOTE_TOPICS].map(withPlan);
// 분류 칩 순서는 데이터 분포가 아니라 심화반 커리큘럼 진행 순서를 따른다.
// 예전엔 topics.json 등장 순서라, topics.json 에 아예 없는 운영체제·컴퓨터구조·
// 알고리즘·자료구조가 맨 뒤로 밀려 화면 밖으로 나갔다(1주차 과목인데도).
export const CATS = sortDomains(Array.from(new Set(ALL.map((t) => t.category))));

// ── 토픽 탭 — 과목마다 교재 CONTENTS 순서 그대로 ─────────────────────
// 2026-10-11 "토픽 지도가 왜 토픽 위주가 아니지?" — 지도가 비교 세트(서브노트 표를 자른 것)로
// 열리고, 토픽은 맨 끝 탭에서 가나다순 한 묶음이었다. 이제 토픽이 첫 탭이고 교재 목차 순서로
// 늘어놓으며, 토픽을 펼치면 그 토픽의 표와 이어진 토픽(표 안에 서로 나오는 것)이 보인다.
export type MapTopic = {
  title: string;
  priority?: string;
  level?: string;
  note?: string;
  summary: string;
  /** 교재 서브노트 — 없으면 CONTENTS 에만 있고 아직 정리 전 */
  sub?: TextbookSubnote;
  /** 지도 영역 · 분류(topicTree) */
  area: string;
  group: string;
  /** 전체 지도의 잎(과목의 영역) — 누르면 그 과목 지도로 간다 */
  go?: string;
  /** 전체 지도 잎에 쓰는 이름·숫자·빈도 */
  label?: string;
  count?: number;
  heatN?: number;
};
export const TOPICS_BY_CAT: Record<string, MapTopic[]> = (() => {
  // 과목 안 자리는 토픽 계층(topicTree) — 영역 → 분류 → 토픽 → 하위 토픽. 계층에 없는 토픽은 맨 뒤.
  const out: Record<string, MapTopic[]> = {};
  for (const [code, label] of Object.entries(DOMAIN_LABEL)) {
    const place = treePlaces(code);
    const list = courseEntries(code).map((e, i) => {
      const at = place.get(e.title);
      const p = e.plan ?? (e.sub ? planInfo(e.sub.title, e.sub.topicId) : null);
      const t: MapTopic = {
        title: e.title,
        priority: p?.priority,
        level: p?.level,
        note: p?.note,
        summary: e.sub?.defShort ?? "",
        sub: e.sub,
        area: at?.area ?? "미분류",
        group: at?.group ?? "",
      };
      return { t, k: at ? at.i : 100000 + i };
    });
    out[label] = list.sort((x, y) => x.k - y.k).map((x) => x.t);
  }
  return out;
})();
export const ALL_MAP_TOPICS: { cat: string; t: MapTopic }[] = Object.entries(TOPICS_BY_CAT).flatMap(
  ([cat, list]) => list.map((t) => ({ cat, t })),
);

const nk = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
/**
 * 토픽끼리 잇는 선 — 표 안에 서로 나오는 토픽.
 * ① 이 토픽의 표 항목이 다른 서브노트 제목이면(OSI 7 Layer 표의 「TCP」류) 아래로 잇고,
 * ② 다른 토픽의 표 항목에 이 토픽이 나오면 위로 잇는다.
 */
export function linksOf(title: string): string[] {
  const bareK = (x: string) => nk(x.replace(/\s*[(（][^)）]*[)）]/g, ""));
  const k = nk(title);
  const kb = bareK(title);
  const out: string[] = [];
  const add = (x?: string) => {
    if (x && nk(x) !== k && !out.includes(x)) out.push(x);
  };
  for (const set of compareSets) {
    if (set.ref && nk(set.ref) === k) {
      for (const it of set.items) {
        const hit = subnoteByTitle(it.name);
        if (hit && (nk(hit.title) === nk(it.name) || bareK(hit.title) === bareK(it.name))) add(hit.title);
      }
    } else if (set.items.some((it) => nk(it.name) === k || (kb.length >= 2 && bareK(it.name) === kb))) {
      add(set.ref);
    }
  }
  return out.slice(0, 8);
}

export const IMP_BADGE: Record<string, string> = {
  상: "border-amber-300 bg-amber-50 text-amber-700",
  중: "border-slate-200 bg-slate-50 text-slate-600",
  하: "border-slate-200 bg-white text-slate-400",
  출제예상: "border-brand-200 bg-brand-50 text-brand-600",
};

/** 한 묶음(group)에 속한 토픽들을 중요도 순으로 정렬해 반환 */
export function groupsOf(items: Topic[]): { name: string; items: Topic[] }[] {
  const byGroup = new Map<string, Topic[]>();
  for (const t of items) {
    const key = t.group || "(기타)";
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(t);
  }
  return Array.from(byGroup.entries())
    .map(([name, list]) => ({
      name,
      items: list
        .slice()
        // 학습계획에 레벨을 매긴 토픽이 먼저 온다(암기 → 숙지 → 점검 → 참고).
        // 레벨은 "지금 급한 것"이라 교재 중요도보다 앞선다.
        .sort(
          (a, b) =>
            levelOrder(a.level as never) - levelOrder(b.level as never) ||
            (IMP_ORDER[a.importance] ?? 9) - (IMP_ORDER[b.importance] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    }))
    // 토픽 많은 묶음(핵심 클러스터)을 먼저, 같으면 이름순
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, "ko"));
}

// 비교·암기표 탭의 분류도 토픽 탭과 같은 커리큘럼 순서로 둔다.
// 세 탭이 서로 다른 순서로 깔리면 같은 화면에서 과목을 찾는 눈이 매번 다시 헤맨다.
export const CMP_CATS = sortDomains(Array.from(new Set(compareSets.map((s) => s.category))));
export const TBL_CATS = sortDomains(Array.from(new Set(memoryTables.map((t) => t.category))));
// 묶음 이름의 개행·중복공백 정규화(표시용) — 데이터엔 "병행 제어\n(...)" 같은 값이 섞여 있다.
export const cleanGroup = (name: string) => name.replace(/\s+/g, " ").trim();
// 토픽지도 → 설명 링크는 AI 자동 생성(auto=1) 없이 연다.
// 답안지 템플릿·교재 서브노트는 AI 없이 즉시 뜨고, AI 설명은 필요할 때만 버튼으로.
// 비교 세트 항목명("혼돈(Confusion)" 등)은 서브노트 제목과 다를 수 있어,
// 느슨 매칭으로 답안 템플릿이 있는 제목으로 바꿔 연다(없으면 이름 그대로).
export const explainHref = (name: string, parent?: string) => {
  const resolved =
    subnoteByTitle(name)?.title ||
    matchSubnoteTitle(name) ||
    findSubnoteByContent(name) ||
    // 항목명이 토픽 제목의 일부이거나 표기가 다른 경우(하이퍼바이저 → 가상화…)
    topicForConcept(name) ||
    // 하위 개념(SISD·1NF·빅뱅 통합 등)은 자기 토픽이 없다 — 묶음(부모) 토픽으로 보낸다.
    (parent
      ? subnoteByTitle(parent)?.title ||
        matchSubnoteTitle(parent) ||
        findSubnoteByContent(parent) ||
        topicForConcept(parent)
      : undefined) ||
    name;
  return topicHref(resolved);
};
// 표 1열처럼 "이름 칸"에 링크를 걸 수 있는지 — 구분선(│)·정도 표기(약/강)는 제외.
export const isLinkableName = (s: string) =>
  (s || "").replace(/[^0-9A-Za-z가-힣]/g, "").length >= 2;

// 비교 항목이 어디로든(교재 템플릿·예전 토픽 자료) 연결되는지 — 아니면 링크를 안 건다.
const TOPIC_TITLE_SET = (() => {
  const s = new Set<string>();
  for (const t of topics as Topic[]) {
    s.add(t.title.trim().toLowerCase().replace(/[\s()·,\-_/]/g, ""));
  }
  return s;
})();
export const hasAnyData = (name: string, parent?: string): boolean =>
  !!(
    subnoteByTitle(name)?.title ||
    matchSubnoteTitle(name) ||
    findSubnoteByContent(name) ||
    TOPIC_TITLE_SET.has(name.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "")) ||
    topicForConcept(name) ||
    (parent ? hasAnyData(parent) : false)
  );

/** 토픽별 출제·답안 수 — 서버(page.tsx)가 센다 */
export type TopicStat = { past: number; ns: number; mock: number; ans: number; com: number; /** 내 정리 노트 수(myNotes) */ mine?: number };
