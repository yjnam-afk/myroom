/**
 * 사실상 같은 토픽 — 과목이 달라 따로 있지만 답안·출제를 함께 봐야 하는 짝.
 *
 * 2026-10-18 "사이버 레질리언스는 BCP 와 사실상 같다" — 보안 교재의 사이버 레질리언스(구성요소에 비즈니스 영향 분석·
 * 사이버 복구 계획)와 경영전략의 BCP 는 같은 답을 요구하는데, 레질리언스 쪽엔 모범답안이 1편뿐이고 BCP 쪽엔 35편이 있었다.
 * 토픽 설명 화면이 짝 토픽의 답안·출제 수를 함께 보여 준다(답안 topicTitles 를 바꾸지 않는다 — 출처 토픽은 그대로).
 * note 는 사용자가 정리해 준 말이다. 교재 정의를 바꾸지 않는다.
 */
export type TwinTopic = { a: string; b: string; note: string };

export const TWIN_TOPICS: TwinTopic[] = [
  {
    a: "사이버 레질리언스(Cyber Resilience)",
    b: "BCP (Business Continuity Planning)",
    note: "기술사 답안에선 사실상 같은 개념 — 위협·재해에도 업무(성과)를 이어 가게 하는 계획·능력. 비즈니스 영향 분석(BIA)·복구 계획이 겹친다",
  },
];

/** 짝 토픽 — 없으면 undefined */
export function twinOf(title?: string): { title: string; note: string } | undefined {
  if (!title) return undefined;
  for (const t of TWIN_TOPICS) {
    if (t.a === title) return { title: t.b, note: t.note };
    if (t.b === title) return { title: t.a, note: t.note };
  }
  return undefined;
}
