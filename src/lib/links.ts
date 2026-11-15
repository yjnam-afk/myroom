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
