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
