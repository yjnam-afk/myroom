/**
 * 처음 보는 사람용 풀이 — 지하철 술술 읽기에서 「왜 있나」 다음, 교재 정의 앞에 놓는다.
 *
 * 2026-11-15 "아예 토픽에 대한 이해도가 없다는 말이야" — 「왜 있나」 두세 문장은 폴링·프레임·페이지 부재 같은 말을
 * 이미 아는 사람에게만 읽혔다. 토픽을 처음 보는 사람이 읽고 이해할 수 있게 세 가지를 적는다:
 *  - terms: **먼저 알아둘 말** 2~4개 — 아래 글과 교재 정의에 나오는데 처음 보면 모를 말을 한 줄씩 풀이한다.
 *  - how:   **어떻게 돌아가나** 3~6문장 — 실제로 일어나는 일을 순서대로. 한 문장에 한 걸음. 표의 항목 이름(교재 용어)을
 *           그 걸음에 붙여 주어, 뒤에 나오는 교재 표가 무엇을 나눈 것인지 알게 한다.
 *  - ex:    **예**(있을 때만) — 실제 값으로 따라가 본 한 가지 경우. 계산이 맞는지 직접 확인한 것만 넣는다.
 *
 * 쓰는 법은 topicWhy.ts 와 같다: 비유를 쓰지 않는다, 시험 요령을 쓰지 않는다, 확실하지 않은 사실은 적지 않는다,
 * 교재 용어를 다른 말로 바꾸지 않는다(풀이는 하되 이름은 그대로). 교재 문장이 아닌 학습 길잡이다 — 답안·서브노트에 옮기지 않는다.
 * 자료는 `topicBasics/{과목코드}.json`(키 = 교재 서브노트 제목). 검사: `npx tsx scripts/check-topic-why.ts`.
 */
import CA from "./topicBasics/CA.json";
import OS from "./topicBasics/OS.json";
import PM from "./topicBasics/PM.json";
import SE from "./topicBasics/SE.json";
import AI from "./topicBasics/AI.json";
import ST from "./topicBasics/ST.json";
import DS from "./topicBasics/DS.json";
import AL from "./topicBasics/AL.json";
import NW from "./topicBasics/NW.json";
import DB from "./topicBasics/DB.json";
import MG from "./topicBasics/MG.json";
import SC from "./topicBasics/SC.json";
import DX from "./topicBasics/DX.json";

export type TopicBasics = { terms: string[][]; how: string[]; ex?: string };

export const TOPIC_BASICS: Record<string, Record<string, TopicBasics>> = { CA, OS, PM, SE, AI, ST, DS, AL, NW, DB, MG, SC, DX };

export function topicBasics(title: string, course?: string): TopicBasics | undefined {
  if (course) return TOPIC_BASICS[course]?.[title];
  for (const c of Object.keys(TOPIC_BASICS)) if (TOPIC_BASICS[c][title]) return TOPIC_BASICS[c][title];
  return undefined;
}
