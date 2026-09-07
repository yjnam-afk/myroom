// 시험 단골 "비교 세트" — 서로 견주며 외우면 좋은 개념들을 나란히 묶었다.
// 각 item.name 은 /explain 의 AI 설명으로 바로 연결된다(데이터 토픽 유무와 무관).
export type CompareItem = { name: string; hint: string };
export type CompareSet = {
  category: string;
  title: string; // 비교 주제
  axis: string; // 무엇을 기준으로 갈리는지 한 줄
  items: CompareItem[];
  /**
   * 출처. "교재"는 심화반 교재 서브노트의 표를 그대로 옮긴 것이고, ref 에 그
   * 서브노트 제목이 있다. 항목 이름·순서·설명이 교재와 같아야 한다 —
   * 시험은 교재 표기로 채점한다. 표시가 없는 세트는 교재 이전에 만든 것이다.
   */
  source?: "교재" | "보조";
  ref?: string;
};

/**
 * 전부 교재다. scripts/build-textbook-map.ts 가 심화반 교재 서브노트의 표에서
 * 매 빌드마다 뽑는다(textbookMap.json). 손으로 쓴 세트는 두지 않는다 —
 * 한때 손으로 쓴 것을 교재 옆에 두었는데, 항목·표기가 교재와 달라 무엇을
 * 외워야 할지 헷갈리게 했다. 시험은 교재 표기로 채점한다.
 */
import textbookMap from "@/data/textbookMap.json";

export const compareSets: CompareSet[] = (textbookMap as { compareSets: CompareSet[] }).compareSets;
