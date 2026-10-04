import type { PeerAnswer } from "@/data/peerAnswers";

/**
 * 해설집 답안인가 — 학원·기술사회가 펴낸 해설집(ITPE 기출문제 해설집, NS 주간 해설집)을
 * 답안지 꼴로 잘라 넣은 것. 실제로 제출해 점수를 받은 손글씨 시험지(모범답안)와 섞어
 * 보이면 어느 쪽인지 알 수 없어서(2026-10-04) 화면에서 칸을 나눈다.
 *
 * 출처 문자열(exam)에 「해설집」이 들어 있으면 해설집이다. 손글씨 답안은 출처가
 * 「정리 답안 (드라이브 …)」「제82회 KPC 기술사 IMPACT 실전모의고사」 꼴이라 겹치지 않는다.
 * 데이터 파일을 끌어오지 않도록 여기(타입만 쓰는 작은 모듈)에 둔다 — 클라이언트 화면에서도 쓴다.
 */
export function isCommentary(a: Pick<PeerAnswer, "exam">): boolean {
  return /해설집/.test(a.exam ?? "");
}
