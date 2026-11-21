/** 토픽 이름 비교용 열쇠 — 괄호 병기·공백·기호를 털어낸다(토픽 지도 세트·암기표·학습계획 찾기가 같은 규칙을 쓴다). */
export function normTitle(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}

/** 공백·기호만 턴 열쇠 — 괄호 속 글자는 남는다(「RIP(Routing Information Protocol)」 ≠ 「RIP」) */
export const looseKey = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
/** 괄호 병기를 떼고 공백·기호를 턴 열쇠 — 예전(기필반) 토픽 ↔ 교재 제목 맞추기, 회독 목록 찾기가 같이 쓴다 */
export const bareKey = (s: string) => looseKey(s.replace(/[(（][^)）]*[)）]/g, ""));
