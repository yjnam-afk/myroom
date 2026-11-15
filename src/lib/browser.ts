/** 브라우저에서 도는 중인지 — localStorage·window 를 만지기 전에 본다(서버 렌더에서는 false). */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}
