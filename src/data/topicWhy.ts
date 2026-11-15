/**
 * 토픽이 「왜 있는가」 — 지하철 술술 읽기에서 정의 앞에 놓는 두세 문장.
 *
 * 2026-11-15 "단순 암기용으로 정리한거지 이해를 시키기 위해 정리한건 아닌거 같아. 왜 있는 애인지 잘 모르겠어.
 * 그렇다고 이상한 비유 넣어서 설명하지 말고" — 읽기 화면이 정의·특징·표만 이어 놓아, 그 토픽이 무슨 문제 때문에 생겼는지가 없었다.
 *
 * 쓰는 법(자료는 `topicWhy/{과목코드}.json` — 키 = 교재 서브노트 제목):
 *  - 첫 문장은 **이것이 없을 때의 문제**(앞선 방식의 한계·그냥 두면 벌어지는 일), 다음 문장은 **그래서 이것이 하는 일**.
 *  - 비유를 쓰지 않는다(사장·이삿짐 기사·식당 같은 장면 금지). 그 분야에서 실제로 일어나는 일을 그 분야 용어로 적는다.
 *  - 시험 요령(「출제 핵심은 …」)을 쓰지 않는다 — 예전 학습 카드(guide.why)가 그렇게 흘러 이해에 도움이 안 됐다.
 *  - 수치·연도·제품·기관 이름은 교재(서브노트)에 있는 것만. 확실하지 않은 사실은 적지 않는다.
 *  - 교재 문장이 아니다. 답안·서브노트에 옮겨 쓰지 않는 학습 길잡이다(topicTree 의 영역·관계와 같은 성격).
 *  - 검사: `npx tsx scripts/check-topic-why.ts`(빠진 토픽·없는 제목·길이·금지어), 자료 보기: `… --dump {과목코드}`.
 */
import CA from "./topicWhy/CA.json";
import OS from "./topicWhy/OS.json";
import PM from "./topicWhy/PM.json";
import SE from "./topicWhy/SE.json";
import AI from "./topicWhy/AI.json";
import ST from "./topicWhy/ST.json";
import DS from "./topicWhy/DS.json";
import AL from "./topicWhy/AL.json";
import NW from "./topicWhy/NW.json";
import DB from "./topicWhy/DB.json";
import MG from "./topicWhy/MG.json";
import SC from "./topicWhy/SC.json";
import DX from "./topicWhy/DX.json";

export const TOPIC_WHY: Record<string, Record<string, string>> = { CA, OS, PM, SE, AI, ST, DS, AL, NW, DB, MG, SC, DX };

/** 토픽 제목(+과목 코드) → 「왜 있는가」. 없으면 undefined */
export function topicWhy(title: string, course?: string): string | undefined {
  if (course) return TOPIC_WHY[course]?.[title];
  for (const c of Object.keys(TOPIC_WHY)) if (TOPIC_WHY[c][title]) return TOPIC_WHY[c][title];
  return undefined;
}
