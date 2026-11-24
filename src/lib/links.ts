/** 앱 안 주소를 만드는 곳 — 화면마다 템플릿 문자열을 따로 쓰지 않는다. */

/** 토픽 설명 화면 주소 */
export const explainHref = (title: string) => `/explain?topic=${encodeURIComponent(title)}`;

/** 지하철 술술 읽기에서 토픽 자리(#) — 제목으로만 만든다(자료를 읽지 않아 지도·읽기 화면이 같이 쓴다) */
export function flowAnchor(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
  return `t${(h >>> 0).toString(36)}`;
}
/** 지하철 술술 읽기 — 과목 코드와 토픽 제목으로 그 토픽부터 읽는 주소 */
export const commuteHref = (code: string, title: string) => `/commute/${code}#${flowAnchor(title)}`;

/**
 * 미리 받지 않을 쪽 — `<Link prefetch={prefetchFor(href)}>`.
 * Next 는 화면에 보이는 링크의 쪽을 미리 받아 두는데, 정리표(쪽 자료 4.5MB)·토픽지도(스크립트 2.6MB + 교재 자료)·문제은행 같은
 * 무거운 쪽이 메뉴·머리말에 걸려 있어 **어느 화면을 열든 10MB 넘게** 뒤에서 내려받았다(2026-11-24 "토픽 설명 메뉴 누를 때 꽤 오래 걸려").
 * 폰에서는 이 내려받기가 정작 필요한 요청(목록·토픽 자료)과 회선을 나눠 쓴다. 무거운 쪽은 눌렀을 때 받는다.
 */
const HEAVY = ["/sheet", "/map", "/exam", "/bank", "/answers", "/basics", "/plan", "/review", "/answer", "/grade"];
export const prefetchFor = (href: string): false | undefined =>
  // 메인(「/」)도 교재 서브노트·예전 토픽 목록을 브라우저에서 쓰는 쪽이라(스크립트 2.4MB) 미리 받지 않는다.
  href === "/" || HEAVY.some((h) => href === h || href.startsWith(h + "#") || href.startsWith(h + "?") || href.startsWith(h + "/")) ? false : undefined;
