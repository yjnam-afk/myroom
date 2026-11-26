/**
 * 답안 ↔ 문항 직접 연결(questionIds) 검수 — 「같은 요구」가 아닌 문항에 직접 걸린 답안을 찾는다.
 *
 *   npx tsx scripts/audit-links.ts            보고만(끊을 쌍·남길 쌍 수와 표본)
 *   npx tsx scripts/audit-links.ts --ops <f>  끊을 연결을 answers.ts apply 용 ops 로 쓴다
 *
 * 2026-11-15 "모범답안이 달라" — NS 9주차 「PCB 및 TCB가 스케줄링에 활용되는 방식」 문항 맨 위에 KPC 84회 「PCB와 TCB의 비교」 답안이
 * 같은 제목을 달고 붙어 있었다. 문구 비슷도(0.85)로 직접 걸어 둔 연결 가운데 영문 병기가 길어 비슷해 보였을 뿐 요구가 다른 것이 많았다.
 * 직접 연결은 「이 문제의 답안」이라는 뜻이다 — 요구가 다르면 끊는다(토픽·문구로는 계속 아래쪽에 붙는다).
 *
 * 같은 요구(sameAsk)로 보는 것:
 *   1) 같은 문제(sameQuestionText)
 *   2) 단답형끼리 — 숫자·버전이 같고, 묻는 낱말(비교·절차·유형 …)이 같고, 영문 낱말이 같으며(한 글자 오타는 넘김) 한글은 번역 표기나
 *      문맥 말만 다르다(능동 학습 = 액티브 러닝(Active Learning), 소프트웨어 회귀테스트 = 회귀시험(Regression Test)).
 *      글자 겹침(비슷도)으로 보지 않는다 — 「정규화↔반정규화」「802.11bn↔802.11bf」「SSPL↔SPL」이 같다고 나왔다.
 *   3) 소문항이 있는 지문 — 소문항 수가 같고 줄마다 같은 요구(머리말 유무는 넘긴다)
 */
import { writeFileSync } from "node:fs";
import questions from "../src/data/questions.json";
import { PEER_ANSWERS } from "../src/data/peerAnswers";
import { sameQuestionText } from "../src/lib/questionText";

type Q = { id: string; text: string; round?: string };
const BANK = new Map((questions as Q[]).map((q) => [q.id, q]));

const sq = (s: string) => s.toLowerCase().replace(/[^0-9a-z가-힣]/g, "");
const grams = (s: string) => {
  const g = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2));
  return g;
};
/** 글자 2-그램 겹침(0~1) */
export function dice(a: string, b: string): number {
  const x = grams(a), y = grams(b);
  if (!x.size || !y.size) return a === b ? 1 : 0;
  let n = 0;
  for (const g of x) if (y.has(g)) n++;
  return (2 * n) / (x.size + y.size);
}

const TAIL = /\s*(?:에\s*(?:대해서?|대하여|관하여|관해)|을|를)?\s*(?:다음(?:을|에\s*대해|에\s*대하여)?|아래(?:를|의\s*사항을|\s*사항을)?)?\s*(?:상세히|자세히|간략히)?\s*(?:설명|기술|서술|논|답|작성|제시)\s*(?:하시오|하라|하십시오)?\s*[.。]?\s*$/;
const MARK = /^\s*(?:[가-하]\s*[.)]|\(\s*\d{1,2}\s*\)|\d{1,2}\s*[.)]|[①-⑳]|[-•·])\s*/;
/** 묻는 낱말 — 한쪽에만 있으면 요구가 다르다. 개념·정의·설명은 누구나 쓰는 말이라 넣지 않는다 */
const ASK = ["비교", "차이", "절차", "과정", "유형", "종류", "분류", "구성", "구조", "활용", "방식", "방법", "원리", "문제점", "해결", "방안", "고려", "단계", "동향", "전략", "사례", "장단점", "장점", "단점", "특징", "필요성", "기법", "지표", "요소", "역할", "적용", "대응", "위협", "취약", "효과", "원인", "발전", "설계", "구현", "측정", "계산", "구하", "자료구조", "동작", "원칙", "기준", "한계", "영향", "대책", "배경", "주요기술", "핵심기술", "핵심기능", "기술요소", "중요성", "현황", "이슈", "시사점", "개선", "도입", "구축", "방향", "의미", "목적", "예시", "스케줄링", "대상", "생태계", "활성화"];
/** 같은 뜻으로 쓰는 묻는 낱말 — 「성능평가 기법」=「성능평가방법」 */
const ASK_CLASS: Record<string, string> = { 방법: "기법", 방식: "기법", 과정: "절차", 단계: "절차", 종류: "유형", 분류: "유형", 구조: "구성", 요소: "구성", 대응: "해결", 대책: "해결", 방안: "해결", 현황: "동향", 장점: "장단점", 단점: "장단점" };
/** 문맥만 주는 말 — 한쪽에만 있어도 같은 요구로 본다(「소프트웨어 회귀테스트」=「회귀테스트」) */
const CONTEXT = new Set(["소프트웨어", "sw", "인공지능", "ai", "시스템", "최근", "컴퓨터", "정보", "it", "기술", "데이터베이스", "db", "운영체제", "os", "네트워크", "분야", "관점", "환경", "개념", "정의", "개요", "주요", "대표적", "대표적인", "기본", "일반적인", "프로젝트", "알고리즘", "프로세스", "방법론", "기술적", "딥러닝", "머신러닝", "기술인"]);
// 이·가·은·는·에·로 는 떼지 않는다 — 「성능평가」「원리」의 끝 글자를 깎아 먹는다
const JOSA = /(?:에서의|으로서|으로써|에서|에게|으로|이란|이라는|라는|와|과|의|을|를)$/;
const STOP = new Set(["설명", "대하여", "대해", "대해서", "관하여", "관련하여", "다음", "아래", "하시오", "기술", "서술", "논하시오", "각각", "간략히", "상세히", "자세히", "있다", "한다", "위한", "위해", "대한", "통한", "및", "그리고", "또는"]);
const LSTOP = new Set(["of", "the", "and", "for", "a", "an", "in", "on", "to", "as", "by", "with", "or", "vs"]);

/** 한 글자 넘김(오타·표기 차이) — 「메커니즘/매커니즘」「Kubernetes/Kubernates」 */
function near(a: string, b: string): boolean {
  if (a === b) return true;
  const m = Math.min(a.length, b.length);
  if (m < 4 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const ra = a.slice(i), rb = b.slice(i);
  if (ra.slice(1) === rb || ra === rb.slice(1)) return true; // 한 글자 넣고 빼기(기술부채/기술적부채)
  if (m < 5) return false;
  if (ra.slice(1) === rb.slice(1)) return true; // 한 글자 다름(메커니즘/매커니즘)
  return ra.length >= 2 && rb.length >= 2 && ra[0] === rb[1] && ra[1] === rb[0] && ra.slice(2) === rb.slice(2); // 자리바꿈(Vritual/Virtual)
}
const setNear = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.some((y) => near(x, y))) && b.every((y) => a.some((x) => near(x, y)));

type Line = { latin: string[]; latinCat: string; ko: string[]; koCat: string; asks: Set<string>; nums: string; len: number };
function line(text: string): Line {
  const t = text.replace(TAIL, "");
  const raw = t.toLowerCase().match(/[a-z]+/g) ?? [];
  // 약어가 바로 그 풀이와 같이 적혀 있으면(WBS(Work Breakdown Structure)) 약어는 뺀다
  const initials = new Set<string>();
  for (const list of [raw, raw.filter((w) => !LSTOP.has(w))]) for (let i = 0; i < list.length; i++) { let ini = ""; for (let j = i; j < Math.min(list.length, i + 7); j++) { ini += list[j][0]; if (ini.length >= 2) initials.add(ini); } }
  const latin = raw.filter((w) => w.length > 1 && !LSTOP.has(w) && !(w.length <= 6 && initials.has(w) && raw.length > w.length)).map((w) => (w.length > 5 ? w.replace(/(?:ing|s)$/, "") : w));
  const outside = t.replace(/\([^)]*\)/g, " ");
  // 한 글자 낱말은 토씨·단위(의·및·대·개)라 버린다 — 「IoT 의 공통 보안 7 대 원칙」=「IoT 공통보안 7원칙」
  const ko = (outside.match(/[가-힣]+/g) ?? []).map((w) => (w.length > 2 ? w.replace(JOSA, "") : w)).filter((w) => w.length > 1 && !STOP.has(w) && !/^(?:설명|기술|서술|비교설명)하?(?:시오|고|며)?$/.test(w));
  const squeezed = t.replace(/(?:[가-힣A-Za-z0-9·\-]+\s){0,1}[가-힣A-Za-z0-9·\-]+\s?\([^)]*\)/g, " ").replace(/[^가-힣]/g, "");
  return {
    latin: [...new Set(latin)].sort(),
    latinCat: latin.join(""),
    ko,
    koCat: ko.join(""),
    asks: new Set(ASK.filter((w) => squeezed.includes(w)).map((w) => ASK_CLASS[w] ?? w)),
    // 숫자 뒤 글자도 버전이다 — Wi-Fi 6E ≠ Wi-Fi 6, 802.11bn ≠ 802.11bf
    nums: (t.toLowerCase().match(/\d+(?:\.\d+)?[a-z]{0,2}(?![a-z])/g) ?? []).sort().join(","),
    len: squeezed.length,
  };
}
const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));

/** 한 줄(단답형·소문항 한 줄)끼리 같은 요구인가 */
function sameLine(a: string, b: string): boolean {
  const x = line(a), y = line(b);
  if (x.nums !== y.nums || !sameSet(x.asks, y.asks)) return false;
  const lx = x.latin.length > 0, ly = y.latin.length > 0;
  if (lx && ly) {
    // 낱말 묶음이 같거나(한 글자 오타 넘김), 띄어쓰기만 다르다(My Payment = MyPayment)
    if (!setNear(x.latin, y.latin) && x.latinCat !== y.latinCat) return false;
    // 영문 이름이 같다 — 한글은 번역 표기만 다르거나(능동 학습 = 액티브 러닝) 문맥 말만 더 붙은 것이어야 한다
    const dx = x.ko.filter((w) => !y.ko.some((v) => near(w, v)) && !CONTEXT.has(w));
    const dy = y.ko.filter((w) => !x.ko.some((v) => near(w, v)) && !CONTEXT.has(w));
    if (!dx.length && !dy.length) return true;
    // 한쪽이 영문만 적은 제목(「Small Cell」=「소형셀(Small Cell)」) — 묻는 낱말은 위에서 이미 같다
    if (!x.ko.length || !y.ko.length) return true;
    if (near(x.koCat, y.koCat) || (Math.min(x.koCat.length, y.koCat.length) >= 12 && dice(x.koCat, y.koCat) >= 0.82)) return true;
    // 양쪽 다 남으면 번역 표기 차이로 본다(낱말 수가 비슷할 때만). 한쪽만 남으면 뭔가를 더 묻는 것
    return dx.length > 0 && dy.length > 0 && dx.length <= 3 && dy.length <= 3;
  }
  // 영문이 한쪽에만(괄호 병기) 또는 둘 다 없음 — 한글 알맹이가 같아야 한다
  const kx = x.ko.filter((w) => !CONTEXT.has(w)).join(""), ky = y.ko.filter((w) => !CONTEXT.has(w)).join("");
  if (!kx || !ky) return false;
  if (near(x.koCat, y.koCat) || near(kx, ky)) return true;
  return Math.min(kx.length, ky.length) >= 10 && dice(kx, ky) >= 0.85;
}

/**
 * 소문항 한 줄 — 한쪽에만 영문 풀이 괄호가 있으면 풀이를 떼고 다시 본다.
 * 같은 시험 문제가 문제지와 해설집·엑셀에 「가. OT(Operational Technology) 환경 특성」「가. OT 환경 특성」으로 따로 적혀 다른 요구로 나왔다
 * (명품 41회 2교시 2번, 파이널 2026.08 3일차 2교시 3번). 머리말이 같은 지문의 소문항에만 쓴다 — 단답형에서는 약어의 딴 뜻(CI·SCM)을 못 가린다.
 */
const GLOSS = /\(\s*[A-Za-z][A-Za-z0-9 ,.\-\/&]*\)/g;
function sameSubNoGloss(a: string, b: string): boolean {
  const ga = a.replace(GLOSS, ""), gb = b.replace(GLOSS, "");
  if ((ga !== a) === (gb !== b)) return false;
  return sq(ga) === sq(gb) || sameLine(ga, gb);
}

type Shape = { stem: string; subs: string[] };
const cache = new Map<string, Shape>();
function shape(text: string): Shape {
  const hit = cache.get(text);
  if (hit) return hit;
  const lines = text.replace(/^\s*\d+\s*[.)]\s*/, "").split("\n").map((l) => l.trim()).filter(Boolean);
  const subs: string[] = [], stems: string[] = [];
  for (const l of lines) (MARK.test(l) ? subs : stems).push(l.replace(MARK, ""));
  const s = { stem: stems.join(" "), subs };
  cache.set(text, s);
  return s;
}

/** 두 문제가 같은 요구인가 */
export function debugLine(t: string) { return line(t); }
export function sameAsk(a: string, b: string): boolean {
  if (sameQuestionText(a, b)) return true;
  const x = shape(a), y = shape(b);
  if (!x.subs.length && !y.subs.length) return sameLine(x.stem, y.stem);
  // 소문항 지문 — 소문항 수가 같고 줄마다 같은 요구여야 한다(머리말은 한쪽에 없어도 된다)
  if (x.subs.length !== y.subs.length) return false;
  if (!x.subs.every((s, i) => sameLine(s, y.subs[i]) || (sq(s).length >= 8 && dice(sq(s), sq(y.subs[i])) >= 0.8) || sameSubNoGloss(s, y.subs[i]))) return false;
  if (!x.stem || !y.stem) return true;
  const sx = line(x.stem), sy = line(y.stem);
  return sx.nums === sy.nums && (dice(sx.koCat, sy.koCat) >= 0.5 || (sx.latin.length > 0 && setNear(sx.latin, sy.latin)));
}

function main() {
  const opsAt = process.argv.indexOf("--ops");
  const drop: { id: string; qid: string; title: string; q: string }[] = [];
  let pairs = 0, same = 0, near = 0;
  const nearSample: string[] = [];
  for (const a of PEER_ANSWERS) {
    for (const qid of a.questionIds ?? []) {
      const q = BANK.get(qid);
      if (!q) continue;
      pairs++;
      if (sameQuestionText(a.question, q.text)) same++;
      else if (sameAsk(a.question, q.text)) {
        near++;
        if (near % 9 === 0) nearSample.push(`  = ${a.question.replace(/\n/g, " / ").slice(0, 70)}  ≒  ${qid} ${q.text.replace(/\n/g, " / ").slice(0, 70)}`);
      } else drop.push({ id: a.id, qid, title: a.question, q: q.text });
    }
  }
  console.log(`직접 연결 ${pairs}쌍 — 같은 문제 ${same} · 같은 요구(표기 차이) ${near} · 다른 요구 ${drop.length}`);
  if (opsAt > 0) {
    writeFileSync(process.argv[opsAt + 1], JSON.stringify(drop.map((d) => ({ op: "rm-qid", id: d.id, qid: d.qid })), null, 1));
    writeFileSync(process.argv[opsAt + 1].replace(/\.json$/, "") + ".list.json", JSON.stringify(drop, null, 1));
    console.log(`→ ${process.argv[opsAt + 1]} (answers.ts apply 로 적용)`);
    return;
  }
  console.log("── 같은 요구로 남기는 것(표본)");
  for (const l of nearSample.slice(0, 60)) console.log(l);
  console.log("── 다른 요구로 끊을 것(표본)");
  for (let i = 0; i < drop.length; i += Math.max(1, Math.floor(drop.length / 60))) {
    const d = drop[i];
    console.log(`  ✂ ${d.title.replace(/\n/g, " / ").slice(0, 70)}  ≠  ${d.qid} ${d.q.replace(/\n/g, " / ").slice(0, 70)}`);
  }
}
if (require.main === module) main();
