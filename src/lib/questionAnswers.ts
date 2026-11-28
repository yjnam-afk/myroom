import { periodGroup } from "./answerKind";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { titlesMatching, trappedTitle } from "@/lib/examHistory";
import { focusOf, relatedTopics } from "@/lib/relatedTopics";
import { PEER_ANSWERS, peerAnswersFor, peerAnswersForQuestion, type PeerAnswer } from "@/data/peerAnswers";
import { SUB_TOPICS } from "@/data/subTopics";
import { questionCore, sameQuestionText } from "@/lib/questionText";

/**
 * 문항 → 모범답안(남이 쓴 답안지 스캔).
 *
 * 답안지는 토픽 제목에 걸려 있다(peerAnswers.topicTitles). 그래서 문항에서
 * 답안을 찾으려면 먼저 "이 문항이 어느 토픽이냐"를 알아야 하는데, 여태 문제은행은
 * 문제 문구가 답안 제목을 통째로 품고 있을 때만(부분 일치) 이었다. 그 탓에
 * "CBAM의 개념과 평가절차" 문항이 「ATAM과 CBAM」 답안지를 못 찾았고,
 * CI/CD·PMO 문항은 관련 토픽조차 못 찾아 답안이 하나도 안 붙었다.
 *
 * 여기서는 토픽 화면이 쓰는 매칭(examHistory)을 그대로 뒤집어 쓴다 — 토픽 쪽에서
 * "이 문항이 내 것"이라고 보는 문항이면 그 토픽의 답안지도 이 문항의 답안지다.
 */
const TITLES: readonly string[] = SUBNOTES.map((s) => s.title);
const BOOK = new Set(TITLES);

const cache = new Map<string, string[]>();

/** 이 문항이 걸리는 교재 서브노트 제목들. */
export function topicsForQuestion(text: string): string[] {
  const c = cache.get(text);
  if (c) return c;
  // examHistory 매칭(제목 열쇠)이 1차다. 제목을 한 글자도 안 쓰는 문항
  // ("은행가 알고리즘" → 「Banker's 알고리즘」, "회귀시험" → 「리그레이션 테스트」)은
  // 관련 토픽 매칭(괄호 속 원어·동의어까지 본다)으로 한 번 더 건진다.
  // 배경 문장에만 나온 토픽은 뺀다(relatedTopics.focusOf) — 「생성형 AI와 AI Agent 확산으로 AI-DLC …」는 AI-DLC 문제다.
  const out = titlesMatching(focusOf(text), TITLES);
  // examHistory 가 TRAP 으로 뺀 토픽은 관련 토픽 매칭으로도 넣지 않는다(SDR 로봇 ↔ SDR 라디오)
  for (const t of relatedTopics(text, 4)) if (BOOK.has(t) && !out.includes(t) && !trappedTitle(text, t)) out.push(t);
  cache.set(text, out);
  return out;
}

/**
 * 문제 아래 「관련 토픽」 칩 — 교재 토픽(제목·별칭으로 걸리는 것까지) 먼저, 그다음 예전 토픽·교재 밖 토픽.
 * 예전엔 relatedTopics 만 써서 별칭으로만 걸리는 문항(「…원칙(일명 SOLID 원칙)」 → 객체지향 설계 원리)은 답안은 붙는데 칩이 없었다(2026-11-28).
 */
export function topicChips(text: string, limit = 4): string[] {
  // 덫(TRAP)은 교재 토픽에만 본다 — 예전 토픽 제목을 trappedTitle 에 넣으면 엔진의 낱말 사이 틈 규칙(GAP)이 그 제목의 띄어쓰기로 먼저 등록돼
  // 다른 토픽의 별칭까지 틈을 허용하게 된다(「병행 제어」가 먼저 등록되자 DB 동시성제어의 별칭 「병행제어」가 「운영체제의 병행성제어」에 걸렸다)
  const rel = relatedTopics(text).filter((t) => !BOOK.has(t) || !trappedTitle(text, t));
  const book = rel.filter((t) => BOOK.has(t));
  for (const t of topicsForQuestion(text)) if (!book.includes(t)) book.push(t);
  return [...book, ...rel.filter((t) => !BOOK.has(t))].slice(0, limit);
}

// ── 서브 토픽 이름으로 찾기 ─────────────────────────────────────────────
// 2026-11-15 "HRN 알고리즘 … 기아 현상 해소 방안 — 이거 모범답안은 한 개도 안 맞네": 문항이 「기아」 토픽으로만 잡혀 기아 답안 9편만 붙고,
// HRN 을 다룬 답안 7편(「SJF, HRN, MLQ, MLFQ」「MLFQ와 HRN」 …)은 「CPU 스케줄링」 토픽에만 걸려 있어 안 나왔다.
// 문항에 서브 토픽의 이름·별칭(HRN)이 있으면, 문제에 그 말이 든 답안을 토픽 답안보다 먼저 붙인다.
const SUB_NAMES: readonly string[] = SUB_TOPICS.map((s) => s.name);
const SUB_BY_NAME = new Map(SUB_TOPICS.map((s) => [s.name, s]));
const byWord = new Map<string, PeerAnswer[]>();
/** 문제에 이 말(서브 토픽 별칭)이 든 답안 — 처음 물을 때 한 번 훑어 둔다 */
function answersNaming(word: string): PeerAnswer[] {
  let hit = byWord.get(word);
  if (!hit) {
    // 「블록체인」「랜섬웨어」처럼 흔한 이름은 수십 편이 걸린다 — 문제가 짧은(그 말만 묻는) 답안부터 12편까지만
    hit = PEER_ANSWERS.filter((a) => titlesMatching(a.question, [word]).length > 0)
      .sort((a, b) => a.question.length - b.question.length)
      .slice(0, 12);
    byWord.set(word, hit);
  }
  return hit;
}
/** 이 문항에 나온 서브 토픽 별칭들(「HRN」「SJF」 …) */
function subWordsIn(text: string): string[] {
  const out: string[] = [];
  for (const name of titlesMatching(text, SUB_NAMES)) {
    const st = SUB_BY_NAME.get(name)!;
    const words = st.aliases.filter((w) => titlesMatching(text, [w]).length > 0);
    // 별칭으로는 안 잡히고 이름 전체로 잡힌 경우(「이상현상」)는 이름으로
    for (const w of words.length ? words : [name]) if (!out.includes(w)) out.push(w);
  }
  return out;
}


// ── 토픽 답안 차례 — 문제 문구와 가까운 것부터 ─────────────────────────────
// 2026-11-28 "모범답안도 잘못되었고": 토픽으로 붙은 답안이 묶음에 든 차례대로 나와, 「SCRUM을 구성하는 역할과 미팅유형」 맨 위에
// 「스크럼, 칸반 보드 비교」가 오고 같은 것을 물은 「스크럼 개발방법론의 팀구성과 미팅의 유형」 답안은 그 아래에 있었다.
// 문제 문구(요구 문장)와 글자 두 개짜리 조각이 많이 겹치는 답안을 앞에 세운다. 같은 문제 판정(●)과는 상관없다 — 차례만 바꾼다.
const gramCache = new Map<string, Set<string>>();
function grams(s: string): Set<string> {
  let g = gramCache.get(s);
  if (!g) {
    const k = questionCore(s);
    g = new Set<string>();
    for (let i = 0; i + 1 < k.length; i++) g.add(k.slice(i, i + 2));
    if (gramCache.size > 30000) gramCache.clear();
    gramCache.set(s, g);
  }
  return g;
}
function byCloseness(ask: string, list: PeerAnswer[]): PeerAnswer[] {
  const q = grams(ask);
  if (!q.size) return list;
  const score = (a: PeerAnswer) => {
    const g = grams(a.question);
    if (!g.size) return 0;
    let n = 0;
    for (const x of g) if (q.has(x)) n++;
    return n / Math.sqrt(g.size * q.size);
  };
  return list
    .map((a, i) => ({ a, i, s: score(a) }))
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .map((x) => x.a);
}

/**
 * 이 문항에 붙일 답안지 — 문항 id 로 직접 연결된 것, 문구가 같은 것, 문항에 나온 서브 토픽을 다룬 것, 토픽이 같은 것.
 * period 를 주면 같은 교시 묶음(단답/논술)의 답안을 앞에 세운다.
 */
export function answersForQuestion(text: string, id?: string, period?: string): PeerAnswer[] {
  const seen = new Set<string>();
  const out: PeerAnswer[] = [];
  const push = (a: PeerAnswer) => {
    if (seen.has(a.id)) return;
    seen.add(a.id);
    out.push(a);
  };
  // 문구·서브 토픽으로 찾을 때도 요구 문장만 본다 — 배경 문장의 「스마트 팩토리」「생성형 AI」 답안이 붙었다(2026-11-28).
  const ask = focusOf(text);
  for (const a of peerAnswersForQuestion(ask, id)) push(a);
  // 문항이 콕 집어 묻는 서브 토픽(HRN·2PL·MC/DC …)을 다룬 답안이 토픽 답안보다 먼저
  const named: PeerAnswer[] = [];
  for (const w of subWordsIn(ask)) for (const a of answersNaming(w)) named.push(a);
  for (const a of byCloseness(ask, named)) push(a);
  const topical: PeerAnswer[] = [];
  for (const t of topicsForQuestion(text)) for (const a of peerAnswersFor(t)) topical.push(a);
  // 교재 밖 토픽(관련 토픽 칩에 보이는 것)에 걸어 둔 답안 — 「소프트웨어 안전성 분석기법」
  for (const t of relatedTopics(text)) if (!BOOK.has(t)) for (const a of peerAnswersFor(t)) topical.push(a);
  for (const a of byCloseness(ask, topical)) push(a);
  if (!period) return out;
  const want = periodGroup(period);
  return [
    ...out.filter((a) => periodGroup(a.period) === want),
    ...out.filter((a) => periodGroup(a.period) !== want),
  ];
}

/**
 * 질문이 이 문항과 같은 답안인가 — 문항 id 로 직접 걸렸거나, 문구가 같거나(「…에 대하여 설명하시오」 꼬리·번호·기호 무시),
 * 한쪽이 다른 쪽을 85% 이상 품는 것. 2026-11-01 "모범답안 중에서 질문이 완벽히 일치하는 것들을 표시해서 구분해".
 * 같은 토픽이라 붙은 답안(다른 문제)과 섞여 있어, 어느 게 이 문제의 답안인지 열어 봐야 알았다.
 */
export function isSameQuestion(a: PeerAnswer, text: string, id?: string): boolean {
  if (id && a.questionIds?.includes(id)) return true;
  return sameQuestionText(a.question, text);
}
