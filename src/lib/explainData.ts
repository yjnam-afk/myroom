/**
 * 토픽 설명 화면의 자료를 서버에서 골라 주는 모듈.
 *
 * 예전에는 /explain 클라이언트 번들이 교재 서브노트·플래시카드·문제은행·학습카드
 * 전부(압축 전 22 MB)를 들고 있었다. 화면은 한 토픽만 보여 주는데 자료는 전부
 * 내려받고 파싱해야 해서, 폰이나 저사양 기기에서는 스크립트가 죽어 빈 화면이
 * 됐다. 그래서 무거운 자료는 여기(서버)에서만 읽고, 화면에는 그 토픽 몫만 넘긴다.
 *
 *  - explainTopicData(title): 한 토픽의 서브노트·부가자료·간글·예전 카드·서론·
 *    남의 답안·출제 이력·토픽 지도 짝 — 서버 컴포넌트 page.tsx 가 props 로 넘긴다.
 *  - explainIndex(): 검색·목록용 인덱스 — /api/explain-index 로 한 번만 받는다.
 *
 * 이 파일은 클라이언트 컴포넌트에서 절대 import 하지 않는다(타입만 import).
 */
import "server-only";
import {
  SUBNOTES,
  subnoteByTitle,
  subnoteByTopicId,
  subnoteByAlias,
  type TextbookSubnote,
} from "@/data/textbookSubnotes";
import { subnoteExtraFor, type SubnoteExtra } from "@/data/subnoteExtras";
import glossData from "@/data/gloss.json";
import { peerAnswersFor, type PeerAnswer } from "@/data/peerAnswers";
import {
  examHistory,
  pastExams,
  questionIdsForTitle,
  type ExamAppearance,
  type PastAppearance,
} from "@/lib/examHistory";
import { getModelAnswer } from "@/lib/modelAnswers";
import allQuestions from "@/data/questions.json";
import { compareSetsFor, memoryTablesFor, type MapLink } from "@/lib/topicMapLinks";
import type { MemoryTable } from "@/data/memoryTables";
import topics from "@/data/topics.json";
import flashcards from "@/data/flashcards.json";
import answerExtras from "@/data/answerExtras.json";
import { TOPIC_INTROS, type AnswerIntro } from "@/data/topicIntros";
import { DOMAINS, DOMAIN_LABEL, domainOrder } from "@/lib/domains";

type TopicRow = { id: string; title: string; category: string; importance: string; source?: string };
const TOPICS = topics as TopicRow[];

const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

// ── 예전 토픽 자료 폴백 — 서브노트가 없을 때 AI 없이 보여줄 지하철 카드 데이터 ──
export type LegacyCard = {
  id: string;
  title: string;
  category: string;
  definition: string;
  memo?: string;
  sections: { label: string; mnemonic: string; keywords: string[] }[];
  /** 답안지 템플릿용(예전 토픽) — 특징 3개·검증된 개념도·활용/플러스 키워드 */
  features?: string[];
  conceptMap?: string;
  /** 답안지 본론 3단표 — 구분·키워드·설명 */
  comp?: {
    group: string;
    mnemonic: string;
    rows: string[][];
    notes: string[];
  }[];
  /** 도식 이름 — 클래스다이어그램·절차 등. 없으면 "개념도" */
  conceptMapLabel?: string;
  defKeywords?: string[];
  apply?: string[];
  plus?: string[];
};

const normT = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
const bareT = (s: string) => normT(s.replace(/[(（][^)）]*[)）]/g, ""));
const CARD_BY_NORM = new Map<string, LegacyCard>();
const CARD_BY_BARE = new Map<string, LegacyCard>();
for (const c of flashcards as LegacyCard[]) {
  CARD_BY_NORM.set(normT(c.title), c);
  const b = bareT(c.title);
  if (!CARD_BY_BARE.has(b)) CARD_BY_BARE.set(b, c);
}
const EXTRA_BY_ID = answerExtras as unknown as Record<string, Partial<LegacyCard>>;
function legacyCardFor(title: string): LegacyCard | undefined {
  const t = title.trim();
  if (!t) return undefined;
  const card = CARD_BY_NORM.get(normT(t)) || CARD_BY_BARE.get(bareT(t));
  if (!card) return undefined;
  // 답안지 템플릿 자료는 별도 파일(answerExtras)에 있다 — 여기서 합쳐 넘긴다.
  const extra = EXTRA_BY_ID[card.id];
  return extra ? { ...card, ...extra } : card;
}

// ── 간글 — 개념도(d)·표(t, 표 순서대로)마다 한 줄 ──
type Gloss = { d?: string; t: string[] };
const GLOSS = glossData as Record<string, Gloss>;
/** 같은 제목의 서브노트가 과목별로 둘일 때(DevSecOps) "제목@과목" 키를 먼저 본다 */
function glossFor(sn: { title: string; course?: string } | undefined): Gloss | undefined {
  if (!sn) return undefined;
  return GLOSS[`${sn.title}@${sn.course ?? ""}`] ?? GLOSS[sn.title];
}

/** 한 토픽 몫의 자료 — 전부 JSON 으로 직렬화 가능해야 한다(서버→클라이언트 props). */
export type ExplainTopicData = {
  title: string;
  /** topics.json 항목이 있으면 그 id·카테고리 */
  topicId?: string;
  category?: string;
  textbook?: TextbookSubnote;
  extra?: SubnoteExtra;
  gloss?: Gloss;
  legacy?: LegacyCard;
  intro?: AnswerIntro;
  peers: PeerAnswer[];
  hist: ExamAppearance[];
  past: PastAppearance[];
  mapSets: MapLink[];
  mapTables: MemoryTable[];
  /** 이 토픽으로 나온 문항 중 모범답안이 있는 것 — 토픽에서 바로 답안으로 간다 */
  answers: TopicAnswer[];
  /** 같은 과목 안에서 앞뒤 토픽 — 교재 순서(SUBNOTES 배열 순서)대로 넘겨 본다 */
  nav?: ExplainNav;
};

/** 토픽 화면에 거는 모범답안 한 줄. */
export type TopicAnswer = {
  id: string;
  period: string;
  /** 문제 전문 — /answer 는 문제 본문으로 답안을 찾는다 */
  question: string;
  /** 답안 제목(모범답안 쪽 표기) */
  title: string;
  /** 출처 표기 — 기출·NS모의·파이널 등 */
  kind: string;
};

export type ExplainNav = {
  courseLabel: string;
  /** 1부터 */
  index: number;
  total: number;
  prev?: string;
  next?: string;
};

/** 교재 토픽은 같은 과목의 서브노트 순서, 예전 토픽은 같은 카테고리의 topics.json 순서로 이웃을 찾는다. */
function navFor(textbook: TextbookSubnote | undefined, t: TopicRow | undefined): ExplainNav | undefined {
  if (textbook) {
    const list = SUBNOTES.filter((x) => x.course === textbook.course);
    const i = list.indexOf(textbook);
    if (i < 0) return undefined;
    return {
      courseLabel: DOMAIN_LABEL[textbook.course] || textbook.course,
      index: i + 1,
      total: list.length,
      prev: list[i - 1]?.title,
      next: list[i + 1]?.title,
    };
  }
  if (t) {
    const list = TOPICS.filter((x) => x.category === t.category);
    const i = list.findIndex((x) => x.id === t.id);
    if (i < 0) return undefined;
    return { courseLabel: t.category, index: i + 1, total: list.length, prev: list[i - 1]?.title, next: list[i + 1]?.title };
  }
  return undefined;
}

/**
 * 이 토픽으로 나온 문항 중 모범답안이 달린 것들.
 *
 * 답안은 문항 id 로만 매달려 있어서 기출·문제은행에서 문항을 찾아야만 볼 수 있었다.
 * 토픽 설명에서 "이 토픽 모범답안이 어디 있냐"가 안 보이던 이유다. 여기서 토픽
 * 제목으로 문항을 찾아 답안이 있는 것만 추려 화면에 건다. 교시 순 → 최신 순.
 */
const Q_BY_ID = new Map(
  (allQuestions as { id: string; period?: string; kind?: string; text: string; date?: string }[]).map(
    (q) => [q.id, q],
  ),
);

function topicAnswers(title: string): TopicAnswer[] {
  const out: TopicAnswer[] = [];
  const seen = new Set<string>();
  for (const id of questionIdsForTitle(title)) {
    const a = getModelAnswer(id);
    const q = Q_BY_ID.get(id);
    if (!a || !q) continue;
    // 별칭으로 한 답안을 공유하는 문항이 여럿이면 한 줄만 건다.
    const key = a.title + "|" + a.period;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id,
      period: a.period || q.period || "",
      question: q.text,
      title: a.title,
      kind: q.kind || (id.startsWith("k") ? "기출" : ""),
    });
  }
  out.sort((x, y) => x.period.localeCompare(y.period) || x.title.localeCompare(y.title));
  return out;
}

export function explainTopicData(rawTitle: string): ExplainTopicData {
  const title = rawTitle.trim();
  const t = TOPICS.find((x) => x.title === title);
  const extra = subnoteExtraFor(t?.id, title);
  const textbook =
    subnoteByTitle(title) ||
    subnoteByTopicId(t?.id) ||
    // 제목 표기만 다른 같은 토픽("Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)")
    subnoteByAlias(t?.id, title);
  const legacy = !textbook ? legacyCardFor(title) : undefined;
  const intro = legacy ? TOPIC_INTROS[t?.id || ""] : undefined;
  return {
    title,
    topicId: t?.id,
    category: t?.category,
    textbook,
    extra,
    gloss: glossFor(textbook),
    legacy,
    intro,
    peers: peerAnswersFor(title),
    hist: examHistory(title),
    past: pastExams(title),
    mapSets: compareSetsFor(title),
    mapTables: memoryTablesFor(title),
    answers: topicAnswers(title),
    nav: navFor(textbook, t),
  };
}

// ── 검색·목록 인덱스 — 화면이 처음 열릴 때 한 번만 내려받는다 ──
export type TopicOption = { id: string; title: string; category: string; importance: string };
export type BrowseItem = { title: string; imp?: string; src?: string };
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
export type ExplainIndex = {
  cats: string[];
  topicOptions: TopicOption[];
  browseGroups: BrowseGroup[];
  /** 접힌 버튼에 보여줄 개수 — 교재(심화반) 토픽만 센다. */
  bookTotal: number;
  entries: SearchEntry[];
};

/** 교재 서브노트를 과목별로, 교재에 없는 예전 토픽은 카테고리별로 묶는다. */
function buildBrowseGroups(): BrowseGroup[] {
  // 교재 토픽 중요도 — 예전 토픽(topics.json)과 매칭되면 그 상·중·하를 쓰고,
  // 심화반 교재에만 있는 토픽은 회독 관리와 같은 기준으로 '상'을 기본값으로 둔다.
  const impById = new Map<string, string>();
  const impByBare = new Map<string, string>();
  for (const t of TOPICS) {
    impById.set(t.id, t.importance);
    const b = bareT(t.title);
    if (!impByBare.has(b)) impByBare.set(b, t.importance);
  }
  const byCourse = new Map<string, BrowseItem[]>();
  const covered = new Set<string>();
  for (const s of SUBNOTES) {
    if (!byCourse.has(s.course)) byCourse.set(s.course, []);
    const imp = (s.topicId && impById.get(s.topicId)) || impByBare.get(bareT(s.title)) || "상";
    byCourse.get(s.course)!.push({ title: s.title, imp, src: "심화반" });
    covered.add(bareT(s.title));
  }
  const groups: BrowseGroup[] = [];
  for (const c of DOMAINS.map((d) => d.code)) {
    const list = byCourse.get(c);
    if (!list?.length) continue;
    groups.push({
      key: `course:${c}`,
      label: DOMAIN_LABEL[c] || c,
      badge: "심화반",
      items: list
        .slice()
        .sort(
          (a, b) =>
            (IMP_ORDER[a.imp || ""] ?? 9) - (IMP_ORDER[b.imp || ""] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    });
  }
  // 교재에 아직 없는 예전 토픽 — 카드 자료로 볼 수 있으므로 같이 노출한다.
  // 원래 붙어 있던 중요도(상·중·하·출제예상)를 유지하고 상부터 정렬한다.
  const byCat = new Map<string, BrowseItem[]>();
  for (const t of TOPICS) {
    // 교재에 같은 토픽이 있으면(제목 표기가 달라도) 예전 항목은 감춘다.
    if (covered.has(bareT(t.title)) || subnoteByAlias(t.id, t.title)) continue;
    if (!byCat.has(t.category)) byCat.set(t.category, []);
    byCat.get(t.category)!.push({
      title: t.title,
      imp: t.importance,
      // 140회 기출 보고 새로 만든 토픽은 기필반이 아니라 '기출'로 구분한다
      src: t.source === "요청" ? "기출" : "기필반",
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
      sub: DOMAIN_LABEL[s.course] || s.course,
      hay,
      t: byTitle.get(s.title),
      isSubnote: true,
    });
    seen.add(s.title);
  }
  for (const t of TOPICS) {
    // 제목이 완전히 같지 않아도 교재에 있는 토픽이면 제안하지 않는다
    // ("Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)").
    if (seen.has(t.title) || subnoteByAlias(t.id, t.title)) continue;
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
    cats: Array.from(new Set(TOPICS.map((t) => t.category))),
    topicOptions: TOPICS.map(slim),
    browseGroups,
    bookTotal: browseGroups
      .filter((g) => g.badge === "심화반")
      .reduce((n, g) => n + g.items.length, 0),
    entries: buildSearchEntries(),
  };
  return INDEX;
}

// ── 도메인별 토픽 정리표(/sheet) — 엑셀로 정리하던 것을 앱 한 페이지에서 본다 ──
export type SheetRow = {
  title: string;
  /** 상·중·하 — 예전 토픽(topics.json)과 맞으면 그 값, 교재 전용 토픽은 '상' */
  imp: string;
  lead?: string;
  /** 29~30자 정의. 비교 토픽은 pairs 로 대신 채운다 */
  def?: string;
  pairs: { name: string; def: string }[];
  features: string[];
  keywords: string[];
  /** 본론 3단표 전체 — 서브노트 표를 그대로(캡션·헤더·행) */
  tables: { caption: string; headers: string[]; rows: string[][] }[];
  /** 플러스 알파 메모 */
  notes: string[];
  /** NS 모의고사 출제 횟수 / 기술사 기출 횟수 */
  ns: number;
  past: number;
  /** 가장 최근 출제 표기(예: 19기 2주차 1교시 5번) */
  last?: string;
};
export type SheetGroup = { code: string; label: string; week: number; rows: SheetRow[] };

export function buildSheet(): SheetGroup[] {
  const impById = new Map<string, string>();
  const impByBare = new Map<string, string>();
  for (const t of TOPICS) {
    impById.set(t.id, t.importance);
    const b = bareT(t.title);
    if (!impByBare.has(b)) impByBare.set(b, t.importance);
  }
  const byCourse = new Map<string, SheetRow[]>();
  for (const s of SUBNOTES) {
    const hist = examHistory(s.title);
    const past = pastExams(s.title);
    const latest = hist.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    const row: SheetRow = {
      title: s.title,
      imp: (s.topicId && impById.get(s.topicId)) || impByBare.get(bareT(s.title)) || "상",
      lead: s.lead,
      def: s.defPair?.length ? undefined : s.defShort,
      pairs: [...(s.defPair || []), ...(s.subDefs || [])].map((p) => ({ name: p.name, def: p.def })),
      features: s.features || [],
      keywords: s.keywords,
      tables: s.tables.map((t) => ({ caption: t.caption, headers: t.headers, rows: t.rows })),
      notes: s.notes || [],
      ns: hist.length,
      past: past.length,
      last: latest
        ? `${latest.cohort} ${latest.round.replace(/^0/, "")} ${latest.period}`
        : past.length
          ? `${Math.max(...past.map((p) => p.round))}회`
          : undefined,
    };
    if (!byCourse.has(s.course)) byCourse.set(s.course, []);
    byCourse.get(s.course)!.push(row);
  }
  // 교재 순서(SUBNOTES 등장 순서) 그대로 — 정리표는 교재 목차와 같은 줄 순서여야 찾기 쉽다.
  return DOMAINS.filter((d) => byCourse.has(d.code)).map((d) => ({
    code: d.code,
    label: d.label,
    week: d.week,
    rows: byCourse.get(d.code)!,
  }));
}
