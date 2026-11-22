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
 *
 * 검색·목록 인덱스는 lib/explainIndex.ts, 정리표(/sheet) 자료는 lib/sheetData.ts, 셋이 같이 쓰는 조각은 lib/explainShared.ts.
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
import { handDiagramsFor, handTablesFor } from "@/data/handDiagrams";
import { answerSheetFor, type AnswerSheet } from "@/data/answerSheets";
import { customSheetsFor, type CustomSheet } from "@/data/customSheets";
import { extraComparesFor, type ExtraCompare } from "@/data/extraCompares";
import { glossFor, type Gloss } from "@/lib/gloss";
import { peerAnswersFor, type PeerAnswer } from "@/data/peerAnswers";
import {
  examHistory,
  pastExams,
  mockExams,
  questionIdsForTitle,
  QUESTION_BY_ID as Q_BY_ID,
  titlesMatching,
  type ExamAppearance,
  type PastAppearance,
  type MockAppearance,
} from "@/lib/examHistory";
import { getModelAnswer } from "@/lib/modelAnswers";
import { compareSetsFor, memoryTablesFor, type MapLink } from "@/lib/topicMapLinks";
import type { MemoryTable } from "@/data/memoryTables";
import flashcards from "@/data/flashcards.json";
import answerExtras from "@/data/answerExtras.json";
import { TOPIC_INTROS, type AnswerIntro } from "@/data/topicIntros";
import { DOMAIN_LABEL } from "@/lib/domains";
import { planInfo } from "@/lib/studyPlan";
import { courseOf, courseSubnotesInOrder } from "@/lib/courseOrder";
import { twinOf } from "@/data/twinTopics";
import { examNoteFor, type ExamNote } from "@/data/examNotes";
import { subTopicByName, subTopicsOf, type SubTopic } from "@/data/subTopics";
import { subCardsFor, subDefFor } from "@/lib/subCards";
import { looseKey as normT, bareKey as bareT } from "@/lib/titleNorm";
import { TOPICS, histStat, type HistStat, type TopicRow } from "@/lib/explainShared";
import { PEER_ANSWERS } from "@/data/peerAnswers";
import { myNotesFor, type MyNote } from "@/data/myNotes";


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


const CARD_BY_NORM = new Map<string, LegacyCard>();
const CARD_BY_BARE = new Map<string, LegacyCard>();
for (const c of flashcards as LegacyCard[]) {
  CARD_BY_NORM.set(normT(c.title), c);
  const b = bareT(c.title);
  if (!CARD_BY_BARE.has(b)) CARD_BY_BARE.set(b, c);
}
const EXTRA_BY_ID = answerExtras as unknown as Record<string, Partial<LegacyCard>>;
/** 카드 id 로 — 제목이 같은 카드가 둘일 때(MDM = 마스터 데이터 관리 / 모바일 단말 관리) 제목으로는 딴 카드가 나온다 */
function legacyCardById(id: string): LegacyCard | undefined {
  const card = (flashcards as LegacyCard[]).find((c) => c.id === id);
  if (!card) return undefined;
  const extra = EXTRA_BY_ID[card.id];
  return extra ? { ...card, ...extra } : card;
}
function legacyCardFor(title: string): LegacyCard | undefined {
  const t = title.trim();
  if (!t) return undefined;
  const card = CARD_BY_NORM.get(normT(t)) || CARD_BY_BARE.get(bareT(t));
  if (!card) return undefined;
  // 답안지 템플릿 자료는 별도 파일(answerExtras)에 있다 — 여기서 합쳐 넘긴다.
  const extra = EXTRA_BY_ID[card.id];
  return extra ? { ...card, ...extra } : card;
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
  /** 교재 밖 토픽 — 해설집에서 옮긴 정리(교재·기필반 자료가 없을 때만) */
  examNote?: ExamNote;
  peers: PeerAnswer[];
  /** 내가 손으로 정리한 노트(myNotes) — 답안지 템플릿 아래 「📝 내 정리」 */
  myNotes: MyNote[];
  /** 교재 속 서브 토픽 화면 — 상위 토픽과 이 이름이 나오는 교재 표 행 */
  sub?: {
    parent: string;
    aliases: string[];
    tables: { from: string; caption: string; headers: string[]; rows: string[][] }[];
    /** 이름·별칭이 맞는 기필반 카드의 정의(답안지 템플릿으로 그린 첫 카드는 뺀다) — 「RIP·OSPF」처럼 두 개념이면 개념마다 */
    cards: { title: string; category: string; definition: string }[];
  };
  /** 이 토픽 안의 서브 토픽 — 출제 수와 함께 */
  /** 이 토픽 안의 서브 토픽 — peers 는 서브 토픽 답안 중 이 토픽 답안(peers)에 없는 것 */
  subs?: { name: string; past: number; ns: number; mock: number; peers: PeerAnswer[]; def?: string }[];
  /** 사실상 같은 토픽(twinTopics) — 그 토픽의 답안·출제 수를 함께 보여 준다 */
  twin?: { title: string; note: string; peers: PeerAnswer[]; past: number; ns: number; mock: number };
  hist: ExamAppearance[];
  past: PastAppearance[];
  /** 손글씨 정리 노트에서 잘라 낸 개념도 */
  hand: string[];
  /** 손글씨 정리 노트에서 잘라 낸 표 */
  handTables: string[];
  /** 답안용 표·개념도(1교시 분량) — 없으면 교재 표 전체로 그린다 */
  sheet?: AnswerSheet;
  /** 내 답안지(아티팩트에서 가져온 것) — 있으면 그 교시 탭은 자동 템플릿 대신 이것을 보인다 */
  custom?: Partial<Record<"1" | "2", CustomSheet>>;
  /** NS·기출 밖 문제은행(ITPE 모의고사·파이널·셀테) 출제 */
  mock: MockAppearance[];
  mapSets: MapLink[];
  mapTables: MemoryTable[];
  /** 교재 밖 비교표(교재 외 표시) */
  extraCompares: ExtraCompare[];
  /** 이 토픽으로 나온 문항 중 모범답안이 있는 것 — 토픽에서 바로 답안으로 간다 */
  answers: TopicAnswer[];
  /** 같은 과목 안에서 앞뒤 토픽 — 학습계획 순서대로 넘겨 본다 */
  nav?: ExplainNav;
  /** 학습계획(커리큘럼)에 적힌 중요도·대비 강도·메모 — 토픽 머리에 배지로 */
  plan?: { priority: string; level?: string; note?: string };
  /** 출제 이력 요약 — 토픽 머리의 📕·🛡️ 칩(학습계획 줄과 같은 눈금) */
  stat: HistStat;
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

/** 교재 토픽은 같은 과목의 학습계획 순서, 예전 토픽은 같은 카테고리의 topics.json 순서로 이웃을 찾는다. */
function navFor(textbook: TextbookSubnote | undefined, t: TopicRow | undefined): ExplainNav | undefined {
  if (textbook) {
    const list = courseSubnotesInOrder(courseOf(textbook));
    const i = list.indexOf(textbook);
    if (i < 0) return undefined;
    return {
      courseLabel: DOMAIN_LABEL[courseOf(textbook)] || courseOf(textbook),
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

/**
 * 이 화면에 걸 답안지 — 제목에 걸린 것 + 화면이 보여 주는 교재 서브노트에 걸린 것.
 * 예전 토픽 이름(「ISO 42001」「요구사항명세서」「Self-Attention메커니즘」)으로 열면 교재 내용은
 * 서브노트에서 가져오는데 답안지는 그 이름에 걸린 것만 찾아서, 서브노트에 붙인 답안지가
 * 안 보였다(2026-10-04 — 122개 중 115개 토픽).
 */
function peersFor(title: string, subnote?: string): PeerAnswer[] {
  const own = peerAnswersFor(title);
  if (!subnote || subnote === title) return own;
  const seen = new Set(own.map((a) => a.id));
  return [...own, ...peerAnswersFor(subnote).filter((a) => !seen.has(a.id))];
}

/** 서브 토픽 답안 — 답안 문제 문구에 서브 토픽 이름·별칭이 들어 있는 것 */
function subPeers(st: SubTopic): PeerAnswer[] {
  return PEER_ANSWERS.filter((a) => titlesMatching(a.question, [st.name]).length > 0);
}

/** 서브 토픽이 나오는 교재 표 행 — 상위 토픽 표 먼저, 다른 서브노트는 행만 골라 최대 3개 표 */
function subRows(st: SubTopic): Omit<NonNullable<ExplainTopicData["sub"]>, "cards"> {
  const has = (x: string) => st.aliases.some((a) => x.includes(a));
  const out: { from: string; caption: string; headers: string[]; rows: string[][] }[] = [];
  const parent = subnoteByTitle(st.parent);
  const others = SUBNOTES.filter((s) => s.title !== st.parent);
  for (const s of [parent, ...others]) {
    if (!s) continue;
    for (const tb of s.tables ?? []) {
      const rows = tb.rows.filter((r) => r.some(has));
      if (!rows.length) continue;
      out.push({ from: s.title, caption: tb.caption || "", headers: tb.headers, rows });
      if (out.length >= (s === parent ? 6 : 4)) break;
    }
    if (out.length >= 4 && s !== parent) break;
  }
  return { parent: st.parent, aliases: st.aliases, tables: out };
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
  // 서브 토픽이면 이름·별칭이 맞는 기필반 카드를 찾아 설명으로 쓴다(2026-11-15 "서브토픽들은 왜 설명이 없어")
  const subCards = subTopicByName(title) ? subCardsFor(subTopicByName(title)!) : [];
  // 서브 토픽이면 subCards 가 고른 카드가 먼저다 — 제목만 같은 딴 뜻 카드(NOT 으로 뺀 것)를 피한다
  const legacy = !textbook
    ? subTopicByName(title)
      ? subCards[0] && legacyCardById(subCards[0].id)
      : legacyCardFor(title)
    : undefined;
  const intro = legacy ? TOPIC_INTROS[t?.id || legacy.id] : undefined;
  const pi = planInfo(title, textbook?.topicId || t?.id);
  return {
    plan: pi ? { priority: pi.priority, level: pi.level, note: pi.note } : undefined,
    stat: histStat(title),
    title,
    topicId: t?.id,
    category: t?.category,
    // 과목은 CONTENTS 기준으로 바꿔 넘긴다(정리표 링크·목록 묶음이 같은 과목을 가리키게)
    textbook: textbook && { ...textbook, course: courseOf(textbook) as TextbookSubnote["course"] },
    extra,
    gloss: glossFor(textbook),
    legacy,
    intro,
    examNote: !textbook && !subTopicByName(title) ? examNoteFor(title) : undefined,
    peers: subTopicByName(title) ? subPeers(subTopicByName(title)!) : peersFor(title, textbook?.title),
    myNotes: (() => {
      // 예전 토픽 이름으로 열어도 화면이 보여 주는 교재 서브노트에 붙은 정리를 함께 건다(peersFor 와 같은 이유)
      const own = myNotesFor(title);
      const ids = new Set(own.map((n) => n.id));
      // 서브 토픽 화면이면 상위 토픽 정리도 붙인다 — 「선점형·비선점형 스케줄링」은 CPU 스케줄링 노트 안에 정리돼 있다
      // (2026-10-20 "선점형 비선점형 스케줄링 정리 다 되어 있는데")
      const st = subTopicByName(title);
      return [...own, ...[...myNotesFor(textbook?.title), ...myNotesFor(st?.parent)].filter((n) => !ids.has(n.id) && (ids.add(n.id), true))];
    })(),
    sub: subTopicByName(title)
      ? {
          ...subRows(subTopicByName(title)!),
          cards: subCards
            .filter((c) => c.id !== legacy?.id)
            .slice(0, 5)
            .map((c) => ({ title: c.title, category: c.category, definition: c.definition })),
        }
      : undefined,
    // 서브 토픽 답안도 상위 토픽 화면에 붙인다(2026-10-22 — "다형성 모범답안에는 왜 오버로딩 오버라이딩이 없지?",
    // "교재의 키워드에 있는 것들은 서브 토픽, 모범답안 연계"). 「오버로딩_오버라이딩」 답안은 서브 토픽 화면에만 있었다.
    subs: (() => {
      if (subTopicByName(title)) return [];
      const own = new Set(peersFor(title, textbook?.title).map((a) => a.id));
      return subTopicsOf(textbook?.title).map((st) => ({
        name: st.name,
        past: pastExams(st.name).length,
        ns: examHistory(st.name).length,
        mock: mockExams(st.name).length,
        peers: subPeers(st).filter((a) => !own.has(a.id) && (own.add(a.id), true)),
        def: subDefFor(st.name),
      }));
    })(),
    twin: (() => {
      const tw = twinOf(textbook?.title ?? title);
      if (!tw) return undefined;
      const mine = new Set(peersFor(title, textbook?.title).map((a) => a.id));
      return {
        ...tw,
        peers: peersFor(tw.title).filter((a) => !mine.has(a.id)),
        past: pastExams(tw.title).length,
        ns: examHistory(tw.title).length,
        mock: mockExams(tw.title).length,
      };
    })(),
    hand: handDiagramsFor(textbook?.title ?? title),
    handTables: handTablesFor(textbook?.title ?? title),
    sheet: answerSheetFor(textbook?.title),
    custom: customSheetsFor(textbook?.title),
    hist: examHistory(title),
    past: pastExams(title),
    mock: mockExams(title),
    mapSets: compareSetsFor(title),
    mapTables: memoryTablesFor(title),
    extraCompares: extraComparesFor(textbook?.title ?? title),
    answers: topicAnswers(title),
    nav: navFor(textbook, t),
  };
}
