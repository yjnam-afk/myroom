/**
 * 문항 문구·회차를 다루는 함수를 한 곳에 — 2026-11-01 정리.
 * 그 전엔 같은 일을 하는 정규화가 questionAnswers(sq)·peerAnswers(norm)·화면마다 따로 있어,
 * 「같은 문제」 기준이 화면마다 조금씩 달랐다. 데이터를 import 하지 않는다(클라이언트·스크립트 어디서나 쓴다).
 *
 * ※ 토픽 제목 열쇠(examHistory keysOf)는 「이 문항이 어느 토픽이냐」를 보는 다른 일이라 여기 넣지 않는다.
 */

// ── 문구 ────────────────────────────────────────────────────────────────

const TAIL = /(에\s*)?(대(해|하여)|관(해|하여))?(다음(을|에)?(대해|대하여)?)?(설명|기술|논|서술|답)(하)?시오$/;

/** 제목 비교 열쇠 — 괄호 병기·공백·기호를 털어낸다. 「다형성 (Polymorphism)」 = 「다형성」 (토픽 제목 맞추기용) */
export function titleKey(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}

/** 문제 문구의 알맹이 — 번호·기호·「…에 대하여 설명하시오」 꼬리를 뗀다 */
export function questionCore(t: string): string {
  return (t || "")
    .toLowerCase()
    .replace(/^\s*\d+\s*[.)]\s*/, "")
    .replace(/[^0-9a-z가-힣]/g, "")
    .replace(TAIL, "")
    .replace(/(을|를|에대해|에대하여)$/, "");
}

/** 느슨한 포함 — 한쪽 알맹이(괄호 뗀)가 다른 쪽에 들어 있다. 답안 후보를 모을 때만 쓴다(같은 문제 판정 아님) */
export function looselyContains(a: string, b: string): boolean {
  const x = titleKey(a);
  const y = titleKey(b);
  return !!x && !!y && (x.includes(y) || y.includes(x));
}

type Parts = { ko: string; en: Set<string>; words: string[] };
const partsCache = new Map<string, Parts>();
function parts(t: string): Parts {
  const hit = partsCache.get(t);
  if (hit) return hit;
  const s = (t || "")
    .toLowerCase()
    .replace(/^\s*\d+\s*[.)]\s*/, "")
    .replace(/(에\s*)?(대\s*(해|하여)|관\s*(해|하여))?\s*(다음(을|에)?\s*(대해|대하여)?)?\s*(설명|기술|논|서술|답)\s*(하)?\s*시오\.?\s*$/, "");
  const words = s.match(/[a-z0-9]+/g) ?? [];
  const p = { ko: s.replace(/[^가-힣]/g, "").replace(/(을|를|에대해|에대하여|의)$/, ""), en: new Set(words), words };
  if (partsCache.size > 20000) partsCache.clear();
  partsCache.set(t, p);
  return p;
}

/** 「asm」이 「attack surface management」의 머리글자인가 — 원어 순서대로 이어진 낱말의 첫 글자 */
function isAcronymOf(w: string, words: string[]): boolean {
  if (w.length < 2 || w.length > 8) return false;
  for (let i = 0; i + w.length <= words.length; i++) if (words.slice(i, i + w.length).every((x, k) => x[0] === w[k])) return true;
  return false;
}

/** 한글 자모 분해 — 「관라」와 「관리」는 모음 하나 차이 */
function jamo(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0) - 0xac00;
    if (c < 0 || c > 11171) {
      out += ch;
      continue;
    }
    out +=
      String.fromCharCode(0x1100 + Math.floor(c / 588), 0x1161 + Math.floor((c % 588) / 28)) +
      (c % 28 ? String.fromCharCode(0x11a7 + (c % 28)) : "");
  }
  return out;
}
/** 자모 하나만 다른가(바꾸기·넣기·빼기 한 번) */
function oneJamoOff(a: string, b: string): boolean {
  const x = jamo(a);
  const y = jamo(b);
  if (Math.abs(x.length - y.length) > 1) return false;
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  const ra = x.slice(i);
  const rb = y.slice(i);
  return ra.slice(1) === rb.slice(1) || ra.slice(1) === rb || ra === rb.slice(1);
}

/**
 * 두 문구가 같은 문제인가 — 「🎯 같은 문제」 표시의 기준(2026-11-01).
 *  1) 알맹이가 같거나, 한쪽이 다른 쪽을 85% 이상 품는다.
 *  2) 한글이 같고 영문·숫자만 한쪽이 더 많다(괄호 원어 병기) — 「국가 망 보안체계(N2SF, …)」 = 「국가망 보안체계 N2SF」.
 *     영문·숫자는 한쪽이 다른 쪽을 다 담거나 원어의 머리글자여야 한다 — TCP/UDP ≠ TCP/IP, 2021 ≠ 2025, ASM = Attack Surface Management.
 *  3) 「ASM」만 적힌 제목은 상대 원어의 머리글자면 같다.
 *  4) 한글 5자 이상에서 자모 하나 차이는 오타로 본다(공격표면관라). 감리≠관리는 자모 둘 차이라 다르다.
 */
export function sameQuestionText(a: string, b: string): boolean {
  const x = questionCore(a);
  const y = questionCore(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [s, l] = x.length <= y.length ? [x, y] : [y, x];
  if (s.length >= 4 && s.length / l.length >= 0.85 && l.includes(s)) return true;

  const pa = parts(a);
  const pb = parts(b);
  const [small, big] = pa.en.size <= pb.en.size ? [pa, pb] : [pb, pa];
  for (const w of small.en) if (!big.en.has(w) && !isAcronymOf(w, big.words)) return false;
  if (!small.ko && small.en.size === 1 && big.ko.length >= 2) {
    const [w] = [...small.en];
    return w.length >= 3 && isAcronymOf(w, big.words);
  }
  // 한글 없이 약어 하나 ↔ 「약어 (원어)」·「원어」만 있는 문제 — 「EVM」↔「EVM (Earned Value Management) 에 대해 설명하시오」(2026-11-01)
  // 원어 말고 다른 낱말이 붙으면(「Agile EVM」「EVM 지표 계산」) 같다고 하지 않는다
  if (!small.ko && !big.ko && small.en.size === 1) {
    const [w] = [...small.en];
    const rest = big.words.filter((x) => x !== w);
    // 원어 자리 낱말이 그 자체로 약어(대문자)면 원어가 아니다 — 「DNS」↔「DAS/NAS/SAN」
    const caps = new Set(((a.length > b.length ? a : b).match(/\b[A-Z]{2,}\b/g) ?? []).map((x) => x.toLowerCase()));
    return w.length >= 3 && rest.length === w.length && !rest.some((x) => caps.has(x)) && isAcronymOf(w, rest);
  }
  if (pa.ko.length < 4) return false;
  const koSame = pa.ko === pb.ko || (Math.min(pa.ko.length, pb.ko.length) >= 5 && oneJamoOff(pa.ko, pb.ko));
  if (!koSame) return false;
  // 한글이 같아도 영문이 한쪽에만 잔뜩 있으면(다른 영문 문제) 같다고 하지 않는다
  return small.en.size > 0 || big.en.size <= 6;
}

// ── 구분·회차 ──────────────────────────────────────────────────────────

export type ExamKind = "기출" | "셀테" | "모의고사" | "NS모의" | "파이널";
type HasRound = { kind?: ExamKind; round?: string; source?: string; cohort?: string };

export const kindOf = (q: HasRound): ExamKind => q.kind || "기출";

/** 「139회 1교시」 → 「139회」. round 가 있으면 그대로, NS 처럼 기수가 다르면 「19기 07주차」 */
export function roundOf(q: HasRound): string {
  const r = (q.round || (q.source || "").split(" ")[0] || "기타").replace(/^0+(\d)/, "$1");
  return q.cohort ? `${q.cohort} ${r}` : r;
}

/**
 * 회차 정렬 열쇠(클수록 최신).
 * 날짜 회차(「ITPE 모의고사 2026.10」「KPC 70회 (2016.06)」)는 연·월로 — 2026-11-01 "10월 모의고사 어디갔어".
 * 명품 모의고사 「41회」~「44회」(2026)는 날짜가 없어 2026년 초 자리. NS 는 기수 → 주차.
 */
export function roundNum(r: string): number {
  const d = r.match(/(20\d\d)\.(\d\d)/);
  if (d) return parseInt(d[1]) * 100 + parseInt(d[2]);
  const mp = r.match(/^(\d{2})회$/);
  if (mp && parseInt(mp[1]) < 60) return 202600 + parseInt(mp[1]) / 100;
  const c = r.match(/(\d+)\s*기/);
  const w = r.match(/(\d+)\s*(?:주차|회)/);
  if (c && w) return parseInt(c[1]) * 100 + parseInt(w[1]);
  if (w) return parseInt(w[1]);
  const m = r.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

/** 출처 문자열의 연·월(없으면 0) — 「ITPE 모의고사 2026.10 1교시」 → 202610 */
export function yearMonth(s: string): number {
  const m = s.match(/(20\d\d)\.(\d\d)/);
  return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0;
}
