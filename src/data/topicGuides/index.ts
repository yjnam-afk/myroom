import type { EasyGuide } from "../subnoteExtras";

/**
 * 예전 토픽(topics.json)용 커널 학습카드.
 *
 * 교재 서브노트와 겹치지 않는 예전 토픽 2,400여 개의 guide 를
 * 청크 파일(g01…g31)로 나눠 담고 여기서 하나로 합친다.
 * 키는 topics.json 의 id (예: "gj-1").
 */
import { G as g01 } from "./g01";
import { G as g02 } from "./g02";
import { G as g03 } from "./g03";
import { G as g04 } from "./g04";
import { G as g05 } from "./g05";
import { G as g06 } from "./g06";
import { G as g07 } from "./g07";
import { G as g08 } from "./g08";
import { G as g09 } from "./g09";
import { G as g10 } from "./g10";
import { G as g11 } from "./g11";
import { G as g12 } from "./g12";
import { G as g13 } from "./g13";
import { G as g14 } from "./g14";
import { G as g15 } from "./g15";
import { G as g16 } from "./g16";
import { G as g17 } from "./g17";
import { G as g18 } from "./g18";
import { G as g19 } from "./g19";
import { G as g20 } from "./g20";
import { G as g21 } from "./g21";
import { G as g22 } from "./g22";
import { G as g23 } from "./g23";
import { G as g24 } from "./g24";
import { G as g25 } from "./g25";
import { G as g26 } from "./g26";
import { G as g28 } from "./g28";
import { G as g29 } from "./g29";
import { G as g31 } from "./g31";

export const TOPIC_GUIDES: Record<string, EasyGuide> = {
  ...g01,
  ...g02,
  ...g03,
  ...g04,
  ...g05,
  ...g06,
  ...g07,
  ...g08,
  ...g09,
  ...g10,
  ...g11,
  ...g12,
  ...g13,
  ...g14,
  ...g15,
  ...g16,
  ...g17,
  ...g18,
  ...g19,
  ...g20,
  ...g21,
  ...g22,
  ...g23,
  ...g24,
  ...g25,
  ...g26,
  ...g28,
  ...g29,
  ...g31,
};
