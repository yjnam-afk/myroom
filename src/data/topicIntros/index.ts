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
  /**
   * 두 개념을 묻는 토픽(「상호배제 / 뮤텍스」)의 개념별 정의·특징 — 있으면 템플릿 1번 단락이 defShort 한 줄 대신
   * 「가. {lead}, A 정의 / 나. {lead}, B 정의」로 개념마다 정의·특징을 보인다(2026-11-15 "상호배제, 뮤텍스 정의를 각각 써야지").
   * 교재 서브노트의 defPair 와 같은 꼴. 정의·특징은 그 토픽의 기필반 자료(topicDetails)·교재 표에 있는 말로 쓴다.
   */
  pairs?: { name: string; lead?: string; def: string; features?: string[] }[];
};

import { I as i01 } from "./i01";
import { I as i02 } from "./i02";
import { I as i03 } from "./i03";
import { I as i04 } from "./i04";
import { I as i05 } from "./i05";
import { I as i13 } from "./i13";
import { I as i14 } from "./i14";
import { I as i15 } from "./i15";
import { I as i16 } from "./i16";
import { I as i17 } from "./i17";
import { I as i18 } from "./i18";
import { I as i19 } from "./i19";
import { I as i21 } from "./i21";
import { I as i22 } from "./i22";
import { I as i29 } from "./i29";
import { I as i20 } from "./i20";
import { I as i25 } from "./i25";
import { I as i26 } from "./i26";
import { I as i23 } from "./i23";
import { I as i24 } from "./i24";
import { I as i27 } from "./i27";
import { I as i28 } from "./i28";
import { I as i30 } from "./i30";
import { I as i31 } from "./i31";
import { I as i06 } from "./i06";
import { I as i07 } from "./i07";
import { I as i08 } from "./i08";
import { I as i09 } from "./i09";
import { I as i10 } from "./i10";
import { I as i11 } from "./i11";
import { I as i12 } from "./i12";
import { I as i32 } from "./i32";
import { I as i33 } from "./i33";
import { I as i34 } from "./i34";
import { I as i35 } from "./i35";

export const TOPIC_INTROS: Record<string, AnswerIntro> = {
  ...i01,
  ...i02,
  ...i03,
  ...i04,
  ...i05,
  ...i06,
  ...i07,
  ...i08,
  ...i09,
  ...i10,
  ...i11,
  ...i12,
  ...i13,
  ...i14,
  ...i15,
  ...i16,
  ...i17,
  ...i18,
  ...i19,
  ...i21,
  ...i22,
  ...i29,
  ...i20,
  ...i25,
  ...i26,
  ...i23,
  ...i24,
  ...i27,
  ...i28,
  ...i30,
  ...i31,
  ...i32,
  ...i33,
  ...i34,
  ...i35,
};
