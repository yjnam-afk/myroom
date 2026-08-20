/**
 * 예전 토픽(topics.json)용 답안 서론 세트 — 교재 서브노트와 같은 규격.
 *
 *  - lead: 답안 서론 첫 문장(리드문) — 배경·필요성 구절 + 토픽명 (10~48자)
 *  - defShort: 답안 서론용 2줄 정의 — 한 줄 17자 × 2줄, 공백 제외 34~35자
 *  - features: 답안 서론 특징 — 간결한 단어 정확히 3개
 *
 * 키는 topics.json 의 id (예: "se-108"). 청크 파일(i01…i31)을 여기서 합친다.
 */
export type AnswerIntro = {
  lead: string;
  defShort: string;
  features: [string, string, string];
};

import { I as i01 } from "./i01";
import { I as i02 } from "./i02";
import { I as i04 } from "./i04";
import { I as i05 } from "./i05";
import { I as i16 } from "./i16";
import { I as i12 } from "./i12";

export const TOPIC_INTROS: Record<string, AnswerIntro> = {
  ...i01,
  ...i02,
  ...i04,
  ...i05,
  ...i12,
  ...i16,
};
