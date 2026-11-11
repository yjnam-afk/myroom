/**
 * 내 답안지 — 사용자가 따로 만든 답안지(아티팩트)를 토픽 설명의 답안지 템플릿 자리에 그대로 붙인다
 * (2026-11-11 "교착상태 답안지 템플릿 1교시를 이렇게 변경"). 키 = 교재 서브노트 제목 → 교시(1·2).
 * 있으면 그 교시 탭은 자동으로 만든 템플릿 대신 이 답안지를 보인다.
 * 자료는 scripts/import-artifact-sheet.py 가 customSheets.json 에 넣는다(허용한 태그·속성만 옮긴다) — 손으로 고치지 않는다.
 */
import sheets from "./customSheets.json";

export type CustomSheet = {
  /** 답안지 머리 — 「문 4) 교착 상태(Deadlock)」 */
  title: string;
  /** 부제 — 「2교시형 · 병렬식 4단락 · 본문 67줄 · 답안지 4쪽」 */
  sub: string;
  /** 검증 출처 줄 */
  verify: string;
  pages: number;
  /** 원본 아티팩트 주소 */
  source: string;
  /** 답안지 쪽 마크업(.page …) */
  html: string;
};

const ALL = sheets as Record<string, Partial<Record<"1" | "2", CustomSheet>>>;

export function customSheetsFor(title?: string | null): Partial<Record<"1" | "2", CustomSheet>> | undefined {
  return title ? ALL[title] : undefined;
}
