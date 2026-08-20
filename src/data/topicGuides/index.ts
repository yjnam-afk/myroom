import type { EasyGuide } from "../subnoteExtras";

/**
 * 예전 토픽(topics.json)용 커널 학습카드.
 *
 * 교재 서브노트와 겹치지 않는 예전 토픽 2,400여 개의 guide 를
 * 청크 파일(g01…g31)로 나눠 담고 여기서 하나로 합친다.
 * 키는 topics.json 의 id (예: "gj-1").
 */
import { G as g01 } from "./g01";
import { G as g05 } from "./g05";
import { G as g06 } from "./g06";

export const TOPIC_GUIDES: Record<string, EasyGuide> = {
  ...g01,
  ...g05,
  ...g06,
};
