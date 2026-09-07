// 묶음 토픽을 한 장의 표로 통째 암기 — 쉬운 설명 + 기술사 답안 활용 팁.
// 표는 가로 스크롤(overflow-x-auto)로 렌더된다. 셀은 간결하게.
export type MemoryTable = {
  category: string;
  title: string; // 표 제목(묶음)
  intro: string; // 쉬운 설명 2~3문장
  columns: string[];
  rows: string[][]; // 각 행 길이 = columns 길이
  examTip?: string; // 기술사 답안 활용 팁
  /** "교재"면 심화반 교재 서브노트의 표를 그대로 옮긴 것. ref 가 원본 서브노트 제목. */
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

export const memoryTables: MemoryTable[] = (textbookMap as { memoryTables: MemoryTable[] }).memoryTables;
