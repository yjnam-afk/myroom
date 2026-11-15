/** 앱 안 주소를 만드는 곳 — 화면마다 템플릿 문자열을 따로 쓰지 않는다. */

/** 토픽 설명 화면 주소 */
export const explainHref = (title: string) => `/explain?topic=${encodeURIComponent(title)}`;
