import "server-only";
import { PEER_ANSWERS, type PeerAnswer } from "@/data/peerAnswers";

/**
 * 모범답안 목록 화면용 색인.
 *
 * 모범답안 = 실제로 제출해 점수를 받은 답안지 스캔(PEER_ANSWERS)이다.
 * 토픽 설명 안에서만 볼 수 있어서 "지금 어떤 답안지가 있나"를 훑을 자리가
 * 없었다. 여기서 검색용 문자열만 얹어 그대로 넘긴다 — 스캔은 이미지라
 * 목록이 가벼워 통째로 내려보내도 된다.
 */
export type AnswerRow = PeerAnswer & {
  /** 검색 대상(소문자) — 문제·시험·토픽·첨삭 */
  hay: string;
};

export function answerRows(): AnswerRow[] {
  return PEER_ANSWERS.map((a) => ({
    ...a,
    hay: [a.question, a.exam ?? "", a.topicTitles.join(" "), (a.feedback ?? []).join(" ")]
      .join(" ")
      .toLowerCase(),
  })).sort((a, b) => a.period.localeCompare(b.period) || a.question.localeCompare(b.question, "ko"));
}
