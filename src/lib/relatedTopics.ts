import { SUBNOTES } from "@/data/textbookSubnotes";
import topics from "@/data/topics.json";

/**
 * 문제 지문에서 관련 토픽을 찾아 준다 — 문제은행·기출에서 "관련 토픽" 링크를
 * 만들어 바로 설명 페이지로 넘어가게 하는 용도.
 *
 * 매칭 규칙(오탐을 막는 게 핵심이다)
 *  - 한글·긴 영문 제목: 공백을 지운 지문에 그대로 들어 있으면 매칭.
 *  - 짧은 영문 약어(ATAM·BPR 등): 지문을 낱말로 쪼개 ★정확히 같을 때만★ 매칭.
 *    ("FAN"이 trade-off analysis 안에 걸리는 식의 오탐을 막는다)
 *  - 괄호 안 원어(Process 등)는 보조 키라 본제목 매칭보다 뒤로 밀고,
 *    흔한 일반 단어는 아예 제외한다.
 */
type Cand = { key: string; title: string; book: boolean; alias: boolean };

/** 그 자체로는 토픽을 특정하지 못하는 흔한 말 */
const STOP = new Set([
  "정의", "개념", "구성", "특징", "기능", "설계", "관리", "기술", "방법",
  "유형", "절차", "표준", "품질", "평가", "보안", "전략", "데이터", "시스템",
  "서비스", "네트워크", "소프트웨어", "프로세스", "아키텍처",
]);
const STOP_EN = new Set([
  "process", "service", "system", "data", "management", "security", "network",
  "model", "analysis", "design", "information", "technology", "control",
  "computing", "engineering", "software", "hardware", "quality", "method",
  "architecture", "platform", "framework", "protocol", "application",
  "artificialintelligence", "informationtechnology", "informationsecurity",
  "businessprocess", "computer", "digital", "intelligence", "learning",
]);

const lower = (s: string) => s.toLowerCase();
/** 공백·기호를 지운 형태 — 한글/긴 영문 제목 비교용 */
const squeeze = (s: string) =>
  lower(s).replace(/[\s·,/\-_()（）.:;'"!?~+&]+/g, "");
/** 낱말 집합 — 짧은 영문 약어 비교용 */
const tokensOf = (s: string) =>
  new Set(lower(s).split(/[^a-z0-9가-힣]+/).filter(Boolean));

const isLatin = (s: string) => /^[a-z0-9]+$/.test(s);

/** 표기가 완전히 다른 동의어 — 정확히 아는 것만 등록한다(오탐 방지). */
const SYNONYM: Record<string, string[]> = {
  WFQ: ["웨이티드페어큐잉", "가중공정큐잉", "weightedfairqueuing"],
  "맨체스터 코딩": ["차등적맨체스터", "differentialmanchester"],
};

const CANDS: Cand[] = (() => {
  const seen = new Set<string>();
  const list: Cand[] = [];
  const add = (title: string, book: boolean) => {
    const bare = title.replace(/[(（][^)）]*[)）]/g, "").trim();
    const push = (key: string, alias: boolean) => {
      if (key.length < 3 || seen.has(key)) return;
      if (STOP.has(bare) || (alias && STOP_EN.has(key))) return;
      seen.add(key);
      list.push({ key, title, book, alias });
    };
    push(squeeze(bare), false);
    for (const syn of SYNONYM[title] || []) push(squeeze(syn), false);
    // 연도·판번호가 붙은 제목("ISO/IEC 25010:2023")은 연도를 뗀 형태로도 찾는다.
    const noYear = bare.replace(/[\s:]*(20\d{2}|19\d{2})(년|판)?$/, "").trim();
    if (noYear && noYear !== bare) push(squeeze(noYear), false);
    const m = title.match(/[(（]([^)）]+)[)）]/);
    if (m) for (const part of m[1].split(/[,，]/)) push(squeeze(part), true);
  };
  for (const s of SUBNOTES) add(s.title, true);
  for (const t of topics) add(t.title, false);
  // 긴 제목 먼저 — 짧은 제목이 긴 토픽을 가로채지 않게 한다.
  return list.sort((a, b) => b.key.length - a.key.length);
})();

/** 지문과 관련된 토픽 제목을 최대 limit 개 돌려준다(교재 토픽·본제목 우선). */
export function relatedTopics(text: string, limit = 3): string[] {
  const sq = squeeze(text);
  // 괄호 병기를 걷어낸 지문 — "인공지능(AI, Artificial Intelligence) 학습용 데이터"
  // 처럼 괄호가 제목을 끊어 놓는 경우를 위해 따로 만든다.
  const sqBare = squeeze(text.replace(/[(（][^)）]*[)）]/g, " "));
  const tokens = tokensOf(text);
  if (!sq) return [];
  const hits: Cand[] = [];
  const used: string[] = [];
  for (const c of CANDS) {
    // 짧은 영문 약어는 낱말이 정확히 일치할 때만 — 부분 문자열 오탐 차단
    const ok =
      isLatin(c.key) && c.key.length <= 5
        ? tokens.has(c.key)
        : sq.includes(c.key) || sqBare.includes(c.key);
    if (!ok) continue;
    if (used.some((u) => u.includes(c.key))) continue; // 더 긴 토픽에 포함되면 생략
    used.push(c.key);
    hits.push(c);
    if (hits.length >= limit * 4) break;
  }
  const out: string[] = [];
  for (const c of hits.sort(
    (a, b) =>
      Number(b.book) - Number(a.book) ||
      Number(a.alias) - Number(b.alias) ||
      b.key.length - a.key.length,
  )) {
    if (!out.includes(c.title)) out.push(c.title);
    if (out.length >= limit) break;
  }
  return out;
}

/** 지문과 맞는 ★교재 서브노트★ 제목 하나(답안지 템플릿 연결용). 없으면 undefined. */
export function relatedSubnote(text: string): string | undefined {
  const sq = squeeze(text);
  const sqBare = squeeze(text.replace(/[(（][^)）]*[)）]/g, " "));
  const tokens = tokensOf(text);
  if (!sq) return undefined;
  let best: Cand | undefined;
  for (const c of CANDS) {
    if (!c.book) continue;
    const ok =
      isLatin(c.key) && c.key.length <= 5
        ? tokens.has(c.key)
        : sq.includes(c.key) || sqBare.includes(c.key);
    if (!ok) continue;
    // 본제목 매칭을 우선하고, 같은 급이면 더 긴(구체적인) 제목을 고른다.
    if (
      !best ||
      (Number(best.alias) - Number(c.alias) > 0) ||
      (best.alias === c.alias && c.key.length > best.key.length)
    )
      best = c;
  }
  return best?.title;
}

/**
 * ★역방향 매칭★ — 짧은 개념 이름(예: "하이퍼바이저", "L4 스위치")으로
 * 그 개념을 담고 있는 토픽 제목을 찾는다.
 *
 * relatedTopics 는 "긴 지문 안에 토픽 제목이 들어 있나"를 보지만,
 * 토픽지도의 비교 항목은 그 반대다 — 이름이 짧고 토픽 제목이 더 길다.
 * 그래서 여기서는 ①제목 완전일치 ②토픽 제목이 이름을 품고 있는 경우
 * ③반대로 이름이 토픽 제목을 품고 있는 경우(relatedTopics) 순으로 찾는다.
 */
/** 이름은 다르지만 같은 개념을 가리키는 묶음 — 토픽지도 비교 항목 연결용 */
const CONCEPT_ALIAS: Record<string, string> = {
  침입탐지: "IDS",
  침입탐지방식: "IDS",
  오용시그니처탐지: "IDS",
  이상행위탐지: "IDS",
  클라우드배포모델: "클라우드 컴퓨팅",
  프라이빗클라우드: "클라우드 컴퓨팅",
  퍼블릭클라우드: "클라우드 컴퓨팅",
  하이브리드클라우드: "클라우드 컴퓨팅",
  통합테스트: "테스트 단계 분류",
  통합테스트방식: "테스트 단계 분류",
  빅뱅통합: "테스트 단계 분류",
  하향식통합: "테스트 단계 분류",
  상향식통합: "테스트 단계 분류",
  샌드위치통합: "테스트 단계 분류",
  단방향해시: "해시함수",
  제1정규형1nf: "1차 정규화",
  제2정규형2nf: "2차 정규화",
  제3정규형3nf: "3차 정규화",
  스타스키마: "Star & Snowflake Schema",
  스노우플레이크스키마: "Star & Snowflake Schema",
  dw스키마starvssnowflake: "Star & Snowflake Schema",
  stopandwait: "오류제어",
  selectiverepeat: "오류제어",
  gobackn: "오류제어",
  arq재전송기법: "오류제어",
  지식기반: "생체인식기술",
  소유기반: "생체인식기술",
  존재생체기반: "생체인식기술",
  사용자인증유형: "생체인식기술",
  프로토타입모델: "SW 개발방법론",
  반복적증분형모델: "SW 개발방법론",
  sdlc프로세스모델: "SW 개발방법론",
  모놀리식커널: "Monolithic 커널",
  커널구조: "커널",
  web10: "Web 2.0",
  시스템테스트: "테스트 단계 분류",
  인수테스트: "테스트 단계 분류",
  단위테스트: "테스트 단계 분류",
  pos지분증명: "합의 알고리즘",
  pow작업증명: "합의 알고리즘",
  dpos위임지분증명: "합의 알고리즘",
  pbft: "합의 알고리즘",
  키스트레칭keystretching: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)",
  보이스코드정규형bcnf: "4차 정규화",
};

/** 묶음 이름 뒤에 붙는 군더더기 — 떼고 다시 찾아본다. */
const TAIL = /(유형|방식|모델|구조|기법|분류|계층|단계|발전)$/;

export function topicForConcept(name: string): string | undefined {
  const key = squeeze(name);
  const alias = CONCEPT_ALIAS[key];
  if (alias) return alias;
  // 너무 짧거나 그 자체로 특정이 안 되는 말은 링크를 걸지 않는다(오탐 방지).
  if (key.length < 4 || STOP.has(name.trim()) || STOP_EN.has(key)) return undefined;
  let exact: Cand | undefined;
  let contains: Cand | undefined;
  for (const c of CANDS) {
    if (c.key === key) {
      // 본제목 일치를 별칭 일치보다 우선
      if (!exact || (exact.alias && !c.alias)) exact = c;
      continue;
    }
    // 토픽 제목이 이 개념을 품고 있는 경우 — 가장 짧은(=군더더기 적은) 제목을 고른다.
    if (!c.alias && c.key.includes(key)) {
      if (!contains || c.key.length < contains.key.length) contains = c;
    }
  }
  if (exact) return exact.title;
  if (contains) return contains.title;
  const rel = relatedTopics(name, 1)[0];
  if (rel) return rel;
  // "하이퍼바이저 유형" → "하이퍼바이저" 처럼 꼬리말을 떼고 한 번 더
  const bare = name.trim().replace(/[(（][^)）]*[)）]/g, " ").trim();
  const cut = bare.replace(/\s*(유형|방식|모델|구조|기법|분류|계층|단계|발전)\s*$/, "").trim();
  if (cut && cut !== bare && squeeze(cut).length >= 2 && !TAIL.test(squeeze(cut)))
    return topicForConcept(cut);
  return undefined;
}
