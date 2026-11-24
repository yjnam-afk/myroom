/**
 * 토픽 설명 화면의 검색·목록 인덱스 — /api/explain-index 로 한 번만 내려받는다.
 * (explainData.ts 에서 떼어 냈다. 서버에서만 읽는다 — 클라이언트는 타입만 import.)
 */
import "server-only";
import { SUBNOTES, subnoteByAlias } from "@/data/textbookSubnotes";
import { SUB_TOPICS, subTopicsOf } from "@/data/subTopics";
import { hasMyNote } from "@/data/myNotes";
import { DOMAINS, DOMAIN_LABEL, domainOrder } from "@/lib/domains";
import { planInfo } from "@/lib/studyPlan";
import { courseOf, courseSubnotesInOrder } from "@/lib/courseOrder";
import { IMP_ORDER } from "@/lib/badges";
import { bareKey, looseKey } from "@/lib/titleNorm";
import { TOPICS, SUB_KEYS, inTextbook, histStat, importanceMaps, impOf, type TopicRow } from "@/lib/explainShared";

// ── 검색·목록 인덱스 — 화면이 처음 열릴 때 한 번만 내려받는다 ──
export type TopicOption = { id: string; title: string; category: string; importance: string };
export type BrowseItem = {
  title: string;
  imp?: string;
  /** 학습계획의 대비 강도(암기·숙지·점검·참고) — 있을 때만 */
  lv?: string;
  src?: string;
  /** NS 주간 모의고사 출제 이력 — 통산·최근 1년·최근 날짜(학습계획 칩과 같은 눈금) */
  ns?: number;
  nsRecent?: number;
  nsLast?: string;
  /** 기술사 기출 이력 — 통산·최근 10회·최근 회차 */
  past?: number;
  pastRecent?: number;
  pastLast?: number;
  /** 내가 정리한 토픽(myNotes) — 목록에 「📝 정리」 */
  mine?: boolean;
  /** 교재 속 서브 토픽(subTopics)이면 상위 토픽 제목 — 목록에서 상위 바로 아래 들여 쓴다 */
  subOf?: string;
};
export type BrowseGroup = { key: string; label: string; badge: string; items: BrowseItem[] };
/** 검색 한 줄 — 서브노트(답안 템플릿)와 예전 토픽 목록을 합친 통합 후보 */
export type SearchEntry = {
  title: string;
  /** 배지: 서브노트면 "답안", 아니면 중요도 */
  badge: string;
  /** 오른쪽 보조 표기: 과목 또는 카테고리 */
  sub: string;
  /** 검색 대상 문자열(소문자): 제목 + 키워드 + 34자 정의 + 표 내용 */
  hay: string;
  /** topics.json 항목이 있으면 연결(토픽 id → 설명 근거) */
  t?: TopicOption;
  isSubnote: boolean;
};
/**
 * 목록 인덱스 — 토픽 설명 첫 화면(과목별 목록·토픽 고르기)이 받는다.
 * 검색용 자료(`SearchEntry` — 제목·키워드·정의·표 글자 1.9MB)는 따로다(`explainSearchEntries`, /api/explain-search):
 * 한데 묶여 있을 때는 목록(0.3MB)을 그리려고 2.4MB 를 다 받아야 했다(2026-11-24 "토픽 설명 메뉴 누를 때 꽤 오래 걸려").
 */
export type ExplainIndex = {
  browseGroups: BrowseGroup[];
  /** 접힌 버튼에 보여줄 개수 — 교재(심화반) 토픽만 센다. */
  bookTotal: number;
};

/** 교재 서브노트를 과목별로, 교재에 없는 예전 토픽은 카테고리별로 묶는다. */
function buildBrowseGroups(): BrowseGroup[] {
  // 교재 토픽 중요도 — 예전 토픽(topics.json)과 매칭되면 그 상·중·하를 쓰고,
  // 심화반 교재에만 있는 토픽은 회독 관리와 같은 기준으로 '상'을 기본값으로 둔다.
  const { impById, impByBare } = importanceMaps();
  const covered = new Set<string>();
  const groups: BrowseGroup[] = [];
  for (const c of DOMAINS.map((d) => d.code)) {
    // 학습계획 순서 그대로 — 계획·정리표와 같은 줄 순서라야 번호로 찾아진다.
    const list = courseSubnotesInOrder(c);
    if (!list.length) continue;
    const items: BrowseItem[] = [];
    for (const s of list) {
      // 출제 이력은 여기서 세어 보낸다 — 클라이언트가 문제은행(questions.json)을 받지 않게.
      items.push({
        title: s.title,
        imp: impOf(s, impById, impByBare),
        lv: planInfo(s.title, s.topicId)?.level,
        src: "심화반",
        ...histStat(s.title),
        ...(hasMyNote(s.title) ? { mine: true } : {}),
      });
      // 교재 속 서브 토픽 — 상위 토픽 줄 바로 아래(2026-10-20 "토픽 설명에서도 보여야 하지 않나?")
      for (const st of subTopicsOf(s.title))
        items.push({
          title: st.name,
          src: "서브",
          subOf: s.title,
          ...histStat(st.name),
          ...(hasMyNote(st.name) || hasMyNote(s.title) ? { mine: true } : {}),
        });
      covered.add(bareKey(s.title));
    }
    groups.push({ key: `course:${c}`, label: DOMAIN_LABEL[c] || c, badge: "심화반", items });
  }
  // DOMAINS 에 없는 과목 코드가 교재에 있어도 빠뜨리지 않는다.
  for (const s of SUBNOTES) covered.add(bareKey(s.title));
  // 교재에 아직 없는 예전 토픽 — 카드 자료로 볼 수 있으므로 같이 노출한다.
  // 원래 붙어 있던 중요도(상·중·하·출제예상)를 유지하고 상부터 정렬한다.
  const byCat = new Map<string, BrowseItem[]>();
  const seenLegacy = new Set<string>();
  for (const t of TOPICS) {
    // 교재에 같은 토픽이 있으면(제목 표기가 달라도) 예전 항목은 감춘다.
    if (covered.has(bareKey(t.title)) || subnoteByAlias(t.id, t.title) || inTextbook(t.title)) continue;
    // 교재 속 서브 토픽과 같은 이름(별칭 포함)이면 감춘다 — 2026-11-02 "교재 없는 메타버스 토픽이 왤케 많냐":
    // 서브 토픽 「메타버스(Metaverse)」 옆에 기필반 「Metaverse」「메타버스」가 따로 떠 있었다.
    if (SUB_KEYS.has(bareKey(t.title))) continue;
    // 원본 엑셀이 같은 토픽을 여러 과목·묶음에 실어 둔 것(핀테크: 경영전략·디지털서비스) — 한 번만.
    // 괄호까지 비교하므로 PLM(제품수명주기)·PLM(Pre trained Language Model) 같은 동음이의어는 남는다.
    const nt = looseKey(t.title);
    if (seenLegacy.has(nt)) continue;
    seenLegacy.add(nt);
    if (!byCat.has(t.category)) byCat.set(t.category, []);
    byCat.get(t.category)!.push({
      title: t.title,
      imp: t.importance,
      // 140회 기출 보고 새로 만든 토픽은 기필반이 아니라 '기출'로 구분한다
      src: t.source === "요청" ? "기출" : "기필반",
      ...(hasMyNote(t.title) ? { mine: true } : {}),
    });
  }
  // 예전 토픽 묶음도 커리큘럼 순서로 — 교재 묶음과 순서가 어긋나면 눈이 헤맨다.
  for (const [cat, list] of Array.from(byCat).sort(
    (a, b) => domainOrder(a[0]) - domainOrder(b[0]) || b[1].length - a[1].length,
  )) {
    groups.push({
      key: `cat:${cat}`,
      label: cat,
      badge: "기필반",
      items: list
        .slice()
        .sort(
          (a, b) =>
            (IMP_ORDER[a.imp || ""] ?? 9) - (IMP_ORDER[b.imp || ""] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    });
  }
  return groups;
}

/** 자동완성 인덱스 — 서브노트 우선, topics.json 은 서브노트에 없는 제목만 추가 */
function buildSearchEntries(): SearchEntry[] {
  const byTitle = new Map<string, TopicOption>();
  for (const t of TOPICS) byTitle.set(t.title, slim(t));
  const list: SearchEntry[] = [];
  const seen = new Set<string>();
  for (const s of SUBNOTES) {
    // 제목·정의·리드문·특징·키워드에 표 내용·비고까지 — 답안 어디에 나온 단어로든 찾을 수 있게
    const hay = [
      s.title,
      s.defShort,
      s.lead || "",
      ...(s.features || []),
      ...(s.keywords || []),
      ...(s.defPair || []).flatMap((p) => [p.name, p.def, ...(p.features || [])]),
      ...(s.subDefs || []).flatMap((p) => [p.name, p.def]),
      ...(s.notes || []),
      ...s.tables.flatMap((tb) => [tb.caption || "", ...tb.rows.flat()]),
    ]
      .join(" ")
      .toLowerCase();
    list.push({
      title: s.title,
      badge: "답안",
      sub: DOMAIN_LABEL[courseOf(s)] || courseOf(s),
      hay,
      t: byTitle.get(s.title),
      isSubnote: true,
    });
    seen.add(s.title);
  }
  // 교재 속 서브 토픽 — 이름·별칭으로 찾고, 상위 토픽을 옆에 적는다
  for (const st of SUB_TOPICS) {
    list.push({
      title: st.name,
      badge: "서브",
      sub: `${st.parent.replace(/\s*\([^)]*\)/g, "")} 안`,
      hay: [st.name, ...st.aliases].join(" ").toLowerCase(),
      isSubnote: false,
    });
  }
  for (const t of TOPICS) {
    // 제목이 완전히 같지 않아도 교재에 있는 토픽이면 제안하지 않는다
    // ("Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)").
    if (seen.has(t.title) || subnoteByAlias(t.id, t.title)) continue;
    // 서브 토픽과 같은 이름이면 서브 토픽 하나만 제안한다(검색에 「메타버스」가 세 번 뜨던 것)
    if (SUB_KEYS.has(bareKey(t.title))) continue;
    list.push({
      title: t.title,
      badge: t.importance,
      sub: t.category,
      hay: t.title.toLowerCase(),
      t: slim(t),
      isSubnote: false,
    });
  }
  return list;
}

const slim = (t: TopicRow): TopicOption => ({
  id: t.id,
  title: t.title,
  category: t.category,
  importance: t.importance,
});

let INDEX: ExplainIndex | undefined;
export function explainIndex(): ExplainIndex {
  if (INDEX) return INDEX;
  const browseGroups = buildBrowseGroups();
  INDEX = {
    browseGroups,
    bookTotal: browseGroups
      .filter((g) => g.badge === "심화반")
      .reduce((n, g) => n + g.items.filter((it) => !it.subOf).length, 0),
  };
  return INDEX;
}

/** 검색 인덱스 — 검색창을 처음 건드릴 때만 받는다. */
let ENTRIES: SearchEntry[] | undefined;
export function explainSearchEntries(): SearchEntry[] {
  return (ENTRIES ??= buildSearchEntries());
}
