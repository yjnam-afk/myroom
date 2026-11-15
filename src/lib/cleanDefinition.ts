/**
 * 예전(기필반) 토픽의 원문에서 정의 한 문장을 뽑는다 — 자료를 import 하지 않는 순수 함수.
 * 화면(lib/grounding)과 플래시카드 생성(scripts/build-flashcards)이 같은 규칙을 쓰도록 한 곳에 둔다
 * (2026-11-15 까지는 두 파일에 같은 코드가 복사돼 있었다).
 */

/**
 * 교재 원문(detail)·요약(summary)에서 "정의다운 정의" 한 문장을 뽑아 정제한다.
 * (defKeywords를 ·로 잇던 방식은 '관리·SDI'처럼 키워드 나열이라 정의로 안 읽혔음.)
 * - [정의]/[XXX 정의] 마커가 있으면 그 뒤부터
 * - "용어(Eng):" 접두는 제거(제목이 따로 보이므로)
 * - 다음 섹션 마커·구분선에서 자르고, 미완성 꼬리 괄호/접속 제거
 * - 너무 길면(≤150자) 마지막 문장부호에서 마무리
 */
function cleanOne(src?: string): string {
  let s = String(src || "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";
  const marker = s.match(/\[[^\]]*정의\s*\]\s*(.+)/);
  if (marker) s = marker[1].trim();
  // 다음 섹션(대괄호 라벨)·구분선·유형/종류 목록 시작점에서 절단.
  s = s
    .split(
      /\s*(?:\[[^\]]{1,24}\]|\(목적\)|\(특징\)|-{3,}|▶|- ?유형|- ?종류|- ?구성|·\s?유형)/,
    )[0]
    .trim();
  // 선두 "용어:" / "용어(Eng):" 접두 제거(콜론이 앞 45자 이내일 때만).
  s = s.replace(/^[^:：]{1,45}[:：]\s+/, "").trim();
  // 미완성 꼬리(닫히지 않은 괄호, cf./참고 주석) 제거.
  s = s.replace(/\s*\((?:cf|참고)[^)]*\)?\s*$/i, "").trim();
  s = s.replace(/\s*\([^)]*$/, "").trim();
  s = s.replace(/[\s\-–;,·]+$/, "").trim();
  if (s.length > 150) {
    const cut = s.slice(0, 150);
    const dot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("다. "));
    s = (dot > 60 ? cut.slice(0, dot + 1) : cut).replace(/[\s\-–;,·]+$/, "").trim();
  }
  return s;
}
// 조사로 끝나면(문장이 잘렸을 가능성) 불완전으로 본다.
const looksIncomplete = (s: string) =>
  !s || s.length < 16 || /[을를이가은는와과의로도만]$/.test(s);
/**
 * 교재 원문(detail)·요약(summary)에서 "정의다운 정의" 한 문장을 뽑는다.
 * detail 우선, 그 결과가 불완전(짧거나 조사로 끝남)하고 summary가 더 나으면 summary.
 */
export function cleanDefinition(detail?: string, summary?: string): string {
  const fromDetail = cleanOne(detail);
  if (!looksIncomplete(fromDetail)) return fromDetail;
  const fromSummary = cleanOne(summary);
  if (!looksIncomplete(fromSummary)) return fromSummary;
  return fromDetail || fromSummary;
}
