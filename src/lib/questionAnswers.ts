import { SUBNOTES } from "@/data/textbookSubnotes";
import { titlesMatching } from "@/lib/examHistory";
import { relatedTopics } from "@/lib/relatedTopics";
import { peerAnswersFor, peerAnswersForQuestion, type PeerAnswer } from "@/data/peerAnswers";

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
  const out = titlesMatching(text, TITLES);
  for (const t of relatedTopics(text, 4)) if (BOOK.has(t) && !out.includes(t)) out.push(t);
  cache.set(text, out);
  return out;
}

/**
 * 교시 묶음 — 1교시는 10점 단답(한두 쪽), 2~4교시는 25점 논술(서너 쪽)이다.
 * 같은 주제라도 쓰는 분량과 구성이 아예 달라서, 2교시 문제에 1교시 답안을
 * 먼저 보여 주면 눈금이 어긋난다.
 */
export const periodGroup = (period: string): "단답" | "논술" =>
  period === "1교시" ? "단답" : "논술";

/**
 * 이 문항에 붙일 답안지 — 문항 id 로 직접 연결된 것, 문구가 같은 것, 토픽이 같은 것.
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
  for (const a of peerAnswersForQuestion(text, id)) push(a);
  for (const t of topicsForQuestion(text)) for (const a of peerAnswersFor(t)) push(a);
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
function sq(t: string): string {
  return (t || "")
    .toLowerCase()
    .replace(/^\s*\d+\s*[.)]\s*/, "")
    .replace(/[^0-9a-z가-힣]/g, "")
    .replace(/(에\s*)?(대(해|하여)|관(해|하여))?(다음(을|에)?(대해|대하여)?)?(설명|기술|논|서술|답)(하)?시오$/, "")
    .replace(/(을|를|에대해|에대하여)$/, "");
}
export function isSameQuestion(a: PeerAnswer, text: string, id?: string): boolean {
  if (id && a.questionIds?.includes(id)) return true;
  const x = sq(a.question);
  const y = sq(text);
  if (!x || !y) return false;
  if (x === y) return true;
  const [s, l] = x.length <= y.length ? [x, y] : [y, x];
  if (s.length >= 4 && s.length / l.length >= 0.85 && l.includes(s)) return true;
  return sameByParts(a.question, text);
}

/**
 * 한글은 같고 영문·숫자 낱말만 한쪽이 더 많은 경우 — 괄호 원어 병기 차이.
 * 「국가 망 보안체계(N2SF, National Network Security Framework)」 = 「국가망 보안체계 N2SF」
 * (2026-11-01 "같은 문제잖아"). 영문·숫자는 한쪽이 다른 쪽을 모두 담아야 같다 —
 * 「TCP와 UDP 비교」≠「TCP와 IP 비교」, 「OWASP Top 10:2021」≠「…:2025」.
 */
function parts(t: string): { ko: string; en: Set<string> } {
  const s = (t || "")
    .toLowerCase()
    .replace(/^\s*\d+\s*[.)]\s*/, "")
    .replace(/(에\s*)?(대\s*(해|하여)|관\s*(해|하여))?\s*(다음(을|에)?\s*(대해|대하여)?)?\s*(설명|기술|논|서술|답)\s*(하)?\s*시오\.?\s*$/, "");
  const ko = s.replace(/[^가-힣]/g, "").replace(/(을|를|에대해|에대하여|의)$/, "");
  const en = new Set(s.match(/[a-z0-9]+/g) ?? []);
  return { ko, en };
}
/** 「asm」이 「attack surface management」의 머리글자인가 — 원어 순서대로 이어진 낱말의 첫 글자 */
function isAcronymOf(w: string, words: string[]): boolean {
  if (w.length < 2 || w.length > 8) return false;
  for (let i = 0; i + w.length <= words.length; i++) {
    if (words.slice(i, i + w.length).every((x, k) => x[0] === w[k])) return true;
  }
  return false;
}
/** 한글 자모 분해 — 「관라」와 「관리」는 모음 하나 차이 */
function jamo(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0) - 0xac00;
    if (c < 0 || c > 11171) { out += ch; continue; }
    out += String.fromCharCode(0x1100 + Math.floor(c / 588), 0x1161 + Math.floor((c % 588) / 28)) + (c % 28 ? String.fromCharCode(0x11a7 + (c % 28)) : "");
  }
  return out;
}
/** 자모 하나만 다른가(바꾸기·넣기·빼기 한 번) — 오타 「공격표면관라」 */
function oneJamoOff(a: string, b: string): boolean {
  const x = jamo(a), y = jamo(b);
  if (Math.abs(x.length - y.length) > 1) return false;
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  const ra = x.slice(i), rb = y.slice(i);
  return ra.slice(1) === rb.slice(1) || ra.slice(1) === rb || ra === rb.slice(1);
}
function sameByParts(a: string, b: string): boolean {
  const x = parts(a);
  const y = parts(b);
  const [small, big] = x.en.size <= y.en.size ? [x, y] : [y, x];
  const bigWords = (big === x ? a : b).toLowerCase().match(/[a-z0-9]+/g) ?? [];
  // 영문·숫자: 한쪽이 다른 쪽에 다 있거나, 원어의 머리글자(ASM ↔ Attack Surface Management)
  for (const w of small.en) if (!big.en.has(w) && !isAcronymOf(w, bigWords)) return false;
  // 「ASM」만 적힌 제목 — 한글 없이 약어 하나가 상대 원어의 머리글자면 같은 문제
  if (!small.ko && small.en.size === 1 && big.ko.length >= 2) {
    const [w] = [...small.en];
    return w.length >= 3 && isAcronymOf(w, bigWords);
  }
  if (x.ko.length < 4) return false;
  const koSame = x.ko === y.ko || (Math.min(x.ko.length, y.ko.length) >= 5 && oneJamoOff(x.ko, y.ko));
  if (!koSame) return false;
  // 한글이 같아도 영문 낱말이 하나도 겹치지 않으면(둘 다 있는데) 다른 문제일 수 있다
  return small.en.size > 0 || big.en.size <= 6;
}
