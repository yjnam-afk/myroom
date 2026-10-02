/**
 * 공백·기호를 지운(squeeze) 본문에서 열쇠를 찾으면 영문 낱말 경계가 사라진다.
 * "에이전틱 AI(Agentic AI)" 가 "에이전틱aiagenticai" 가 되어 「AI Agent」 열쇠
 * "aiagent" 가 맞았다 — 에이전틱 AI 문항·답안이 AI Agent 토픽에 붙은 까닭이다.
 *
 * 열쇠가 영문 글자로 시작하거나 끝나면, 원문에서 그 자리 앞뒤로 영문 글자가
 * 이어지지 않는지 본다. 어미 s·es·ing 는 허용한다(Red Teaming, Multithreading).
 * 숫자는 보지 않는다 — "'25년 개정판" 은 "2025년 개정판" 에 맞아야 한다.
 * 열쇠 글자 사이에는 squeeze 가 지우는 기호가 끼어도 되므로 squeeze 후 includes 와
 * 같은 범위를 본다.
 */
const SEP = "[\\s·ㆍ‧,./\\-–—_:;'\"’“”()（）\\[\\]【】<>《》!?~+&]*";
const LAT = /[a-z]/;
const RE = new Map<string, RegExp | null>();

function edgeRe(key: string): RegExp | null {
  if (RE.has(key)) return RE.get(key)!;
  const head = LAT.test(key[0] ?? "");
  const tail = LAT.test(key[key.length - 1] ?? "");
  let re: RegExp | null = null;
  if (head || tail) {
    const body = Array.from(key)
      .map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(SEP);
    re = new RegExp((head ? "(?<![a-z])" : "") + body + (tail ? "(?:s|es|ing)?(?![a-z])" : ""));
  }
  RE.set(key, re);
  return re;
}

/** low = 소문자 원문. 열쇠가 squeeze 본문에 들어 있다는 것을 이미 확인한 뒤에 부른다. */
export function latinEdgeOk(low: string, key: string): boolean {
  const re = edgeRe(key);
  return re ? re.test(low) : true;
}
