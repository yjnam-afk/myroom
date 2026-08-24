import type { AnswerIntro } from "./index";

/** 예전 토픽 답안 서론 세트 — 청크 17 */
export const I: Record<string, AnswerIntro> = {
  "ca-171": {
    lead: "패키지 안의 시스템, SIP",
    defShort: "시스템 요구사항의 전부나 상당 부분을 단일 패키지 위에 통합 구현하는 패키지 기술",
    features: ["단일 패키지", "이종 기술", "시스템 통합"],
  },
  "ca-172": {
    lead: "하나의 칩에 담은 시스템, SoC",
    defShort: "CPU·DSP·메모리 등 시스템 기능을 온칩 버스로 연결해 한 칩에 통합한 반도체",
    features: ["온칩 버스", "ASIC 기반", "고집적화"],
  },
};
