/** 토픽 이름 비교용 열쇠 — 괄호 병기·공백·기호를 털어낸다(토픽 지도 세트·암기표·학습계획 찾기가 같은 규칙을 쓴다). */
export function normTitle(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}
