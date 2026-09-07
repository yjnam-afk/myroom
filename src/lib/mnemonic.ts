/**
 * 교재에 적힌 두음을 읽는다 — 만들지 않는다.
 *
 * 교재는 두음을 두 가지로 적는다.
 *  ① 캡션·키워드의 대괄호 — "유형 [구데제]", "[할배호교]"
 *  ② 키워드 끝의 소괄호 — "환형 대기(상점비환)", "복구(예피발복)"
 * ②는 "순환큐(원형큐)"처럼 동의어 병기와 생김새가 같아서, 괄호 안 글자
 * 대부분이 같은 키워드 목록의 다른 항목 첫째·둘째 음절로 나올 때만 두음으로 본다.
 * (예피발복의 '피'는 '회피'의 둘째 음절이라 첫 음절만 보면 놓친다.)
 */

/** 대괄호 두음 — 여러 텍스트 중 처음 나오는 것 */
export function bracketMnem(texts: string[]): string {
  for (const t of texts) {
    const m = String(t || "").match(/\[([가-힣A-Za-z0-9·\s]{2,12})\]/);
    if (m) return m[1].replace(/\s/g, "");
  }
  return "";
}

/** 키워드 목록 끝의 소괄호 두음 — 목록의 다른 항목으로 검증된 것만 */
export function parenMnem(keywords: string[]): string {
  const re = /\(([가-힣]{4,10})\)\s*$/;
  for (const k of keywords) {
    const m = String(k || "").match(re);
    if (!m) continue;
    const cand = m[1];
    const others = keywords
      .filter((x) => x !== k)
      .map((x) => String(x || "").replace(re, "").replace(/\[[^\]]*\]/g, "").trim());
    const heads = new Set<string>();
    for (const o of others)
      for (const w of o.split(/[\s·,/()（）]+/)) {
        if (w[0]) heads.add(w[0]);
        if (w[1]) heads.add(w[1]);
      }
    const hit = [...cand].filter((ch) => heads.has(ch)).length;
    if (hit * 4 >= cand.length * 3) return cand;
  }
  return "";
}

/** 교재 키워드 목록의 두음 — 대괄호 먼저, 없으면 소괄호 */
export function keywordMnem(keywords: string[]): string {
  return bracketMnem(keywords) || parenMnem(keywords);
}

/** 화면용 — 키워드에서 두음 표기를 떼어낸다: "환형 대기(상점비환)" → "환형 대기" */
export function stripMnemTag(k: string): string {
  return String(k || "")
    .replace(/\[[^\]]*\]\s*/g, "")
    .replace(/\(([가-힣]{4,10})\)\s*$/, "")
    .trim();
}
