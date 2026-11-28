import { latinEdgeOk } from "@/lib/latinEdge";
import { SUBNOTES } from "@/data/textbookSubnotes";
import topics from "@/data/topics.json";
import examTopics from "@/data/examTopics.json";
import { askParts } from "@/lib/questionText";

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
type Cand = { key: string; title: string; book: boolean; alias: boolean; sub?: boolean; exam?: boolean };

/** 그 자체로는 토픽을 특정하지 못하는 흔한 말 */
const STOP = new Set([
  "정의", "개념", "구성", "특징", "기능", "설계", "관리", "기술", "방법",
  "유형", "절차", "표준", "품질", "평가", "보안", "전략", "데이터", "시스템",
  "서비스", "네트워크", "소프트웨어", "프로세스", "아키텍처",
  // 예전(기필반) 토픽 가운데 제목이 낱말 하나뿐인 것 — 「구성요소」「statement」가 아무 지문에나 붙었다(2026-11-28)
  "구성요소", "조정", "조건", "용어", "기타 용어", "종류", "자료", "해결방안", "문제점", "수행시점", "statement",
]);
const STOP_EN = new Set([
  "process", "service", "system", "data", "management", "security", "network",
  "model", "analysis", "design", "information", "technology", "control",
  "computing", "engineering", "software", "hardware", "quality", "method",
  "architecture", "platform", "framework", "protocol", "application",
  "artificialintelligence", "informationtechnology", "informationsecurity",
  "businessprocess", "computer", "digital", "intelligence", "learning",
  // 괄호 속 보조 키로 쓰면 아무 지문에나 걸린다 — "AI-DLC(AI-Driven Development
  // Life Cycle)" 문항이 「Kanban (development)」 토픽으로 갔다.
  "development", "deployment", "lifecycle",
  // 흔한 영어 한 낱말 — 다른 이름 안에 그대로 들어 있어 엉뚱한 토픽을 끌어온다.
  // FIDO(Fast IDentity Online) → 「엔티티(Entity)」, MVC → 「MVVM」(alias "view"),
  // "키(Key of Relation)" → 「릴레이션 키」가 아무 key 문항에나 붙던 식이다.
  "entity", "identity", "view", "key", "online", "unit", "level", "layer",
  "object", "class", "message", "event", "state", "index", "table", "group",
  "node", "link", "path", "cost", "size", "rate", "block", "flow", "task",
  "type", "value", "point", "range", "scale", "stage", "phase", "report",
  "record", "request", "response", "server", "client", "device", "session",
  "channel", "signal", "source", "target", "search", "query", "monitoring",
  "test", "testing", "function", "structure", "interface", "resource",
  // 「리그레이션(회귀, Regression) 테스트」의 별칭 — 선형 회귀(Linear Regression) 문항을 끌어왔다.
  "regression",
]);

/**
 * 괄호 속 한글 별칭이 흔한 말이면 열쇠로 못 쓴다 — 「Pipeline(파이프라인)」의
 * '파이프라인' 이 CI/CD 파이프라인 문항을 끌어와 CPU 파이프라인 답안이 붙었다.
 */
const STOP_KO_ALIAS = new Set([
  "파이프라인", "컨테이너", "캐시", "프로세스", "스레드", "모듈", "패턴", "버퍼",
  "아키텍처", "플랫폼", "프레임워크", "인터페이스", "알고리즘", "네트워크",
  "데이터베이스", "클라우드", "가상화", "스케줄링", "커널", "클러스터", "스택",
]);

const lower = (s: string) => s.toLowerCase();
/** 공백·기호를 지운 형태 — 한글/긴 영문 제목 비교용 */
const squeeze = (s: string) =>
  lower(s).replace(/[\s·,/\-_()（）.:;'"!?~+&]+/g, "");
/** 낱말 집합 — 짧은 영문 약어 비교용 */
const tokensOf = (s: string) => {
  const low = lower(s);
  const out = new Set(low.split(/[^a-z0-9가-힣]+/).filter(Boolean));
  // 붙임표로 이은 짧은 이름(「AI-DLC」「Q-러닝」)은 붙여 쓴 꼴로도 — "ai"·"dlc" 로 쪼개져 「AI-DLC」 토픽을 못 찾았다
  for (const m of low.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? []) out.add(m.replace(/-/g, ""));
  return out;
};
/**
 * 한글이 바로 붙은 약어(「SCRUM을」「SSD의」「CPU스케줄링」)에서 영문만 뗀 것 — 「SCRUM을 구성하는 역할」이 스크럼 토픽을 못 찾았다.
 * 낱말로 따로 선 것(tokensOf)보다 약한 일치라 차례에서 뒤로 민다. 숫자뿐인 것은 뺀다(「2025년」의 2025 가 「…(2025)」 열쇠에 걸렸다).
 */
const looseTokensOf = (s: string, exact: Set<string>) => {
  const out = new Set<string>();
  for (const m of lower(s).match(/[a-z0-9]+/g) ?? []) if (/[a-z]/.test(m) && !exact.has(m)) out.add(m);
  return out;
};

const isLatin = (s: string) => /^[a-z0-9]+$/.test(s);

/** 표기가 완전히 다른 동의어 — 정확히 아는 것만 등록한다(오탐 방지). */
const SYNONYM: Record<string, string[]> = {
  WFQ: ["웨이티드페어큐잉", "가중공정큐잉", "weightedfairqueuing"],
  "맨체스터 코딩": ["차등적맨체스터", "differentialmanchester"],
  // 문항은 풀어 쓴 이름만 적는다("AI-DLC(AI-Driven Development Life Cycle)").
  "AI-DLC(AI-Driven SDLC)": ["AI-Driven Development Life Cycle"],
  // 교재에 CI/CD 서브노트가 따로 없다 — CI/CD 문항은 데브옵스에서 본다.
  "데브옵스 (DevOps)": ["Continuous Integration", "CI/CD"],
  // 제목이 "감리/PMO 비교표" 라 PMO 를 다룬 문항이 이 비교표로 오지 않았다.
  "감리/PMO 비교표": ["PMO"],
  // 문항은 "…설계 시 고려해야 할 원칙(일명 SOLID 원칙)" 으로 적는다. "SOLID" 만으로는 걸지 않는다(Solid State Drive).
  "객체지향 설계 원리": ["SOLID 원칙"],
  // 교재 제목은 "회전", 기출은 "순환"으로 적는다.
  "McCabe 회전 복잡도": ["순환 복잡도", "Cyclomatic Complexity"],
  // 별칭 "regression" 을 막았으니 테스트 쪽 표기를 따로 건다.
  "리그레이션(회귀, Regression) 테스트": ["Regression Test", "회귀 테스트", "회귀 시험"],
  // 문항은 "Self-Attention 메커니즘" 으로 적는다. 교재 밖 토픽 「Self-Attention메커니즘」이
  // 더 긴 열쇠로 먼저 맞아 서브노트를 가리므로 같은 열쇠를 교재 쪽에 먼저 건다.
  "어텐션 메커니즘(Attention Mechanism)": ["Self-Attention 메커니즘", "Self-Attention", "셀프 어텐션"],
  // 문항은 제목 대신 "귀무가설·대립가설", "가설검증" 으로 적는다.
  "통계적 가설검정(Hypothesis Testing)": ["귀무가설", "가설검증", "가설 검정"],
  // 기출은 "점추정과 구간추정", "불편추정량(Unbiased Estimator)" 으로 묻는다.
  "추정 이론(Estimation Theory)": ["점추정", "구간추정", "불편추정량", "불편 추정량", "Unbiased Estimator", "점추정량"],
};

/**
 * 교재 제목의 약어 ↔ 풀어 쓴 말. 「분산 DB」 서브노트가 "분산 데이터베이스의
 * 투명성" 기출을 못 찾던 식의 누락을 막는다. 양쪽 표기를 모두 열쇠로 만든다.
 */
const ABBR: [string, string][] = [
  ["DB", "데이터베이스"],
  ["SW", "소프트웨어"],
  ["HW", "하드웨어"],
  ["OS", "운영체제"],
  ["NW", "네트워크"],
  ["PJT", "프로젝트"],
];

const CANDS: Cand[] = (() => {
  const seen = new Set<string>();
  const list: Cand[] = [];
  const add = (title: string, book: boolean) => {
    const bare = title.replace(/[(（][^)）]*[)）]/g, "").trim();
    const push = (key: string, alias: boolean, sub = false) => {
      if (key.length < 3 || seen.has(key)) return;
      if (STOP.has(bare) || (alias && (STOP_EN.has(key) || STOP_KO_ALIAS.has(key)))) return;
      seen.add(key);
      list.push({ key, title, book, alias, sub });
    };
    push(squeeze(bare), false);
    for (const [abbr, full] of ABBR) {
      const re = new RegExp("\\b" + abbr + "\\b", "i");
      if (re.test(bare)) push(squeeze(bare.replace(re, full)), false);
      if (bare.includes(full)) push(squeeze(bare.replace(full, abbr)), false);
    }
    // 손으로 등록한 동의어는 짧은 영문이라도 통째로 찾는다("CI/CD" → cicd).
    for (const syn of SYNONYM[title] || []) push(squeeze(syn), false, true);
    // 연도·판번호가 붙은 제목("ISO/IEC 25010:2023")은 연도를 뗀 형태로도 찾는다.
    const noYear = bare.replace(/[\s:]*(20\d{2}|19\d{2})(년|판)?$/, "").trim();
    if (noYear && noYear !== bare) push(squeeze(noYear), false);
    const m = title.match(/[(（]([^)）]+)[)）]/);
    if (m) for (const part of m[1].split(/[,，]/)) push(squeeze(part), true);
  };
  for (const s of SUBNOTES) add(s.title, true);
  for (const t of topics) add(t.title, false);
  // 교재 밖 토픽(문제에 나온 주제 — examTopics)은 이름 전체로만 찾는다. 괄호 속 풀이는 열쇠로 쓰지 않는다(넓은 말이 많다).
  for (const t of examTopics as { name: string }[]) {
    const bare = t.name.replace(/[(（][^)）]*[)）]/g, "").trim();
    const key = squeeze(bare);
    if (key.length < 4 || seen.has(key) || STOP.has(bare)) continue;
    seen.add(key);
    list.push({ key, title: t.name, book: false, alias: false, exam: true });
  }
  // 긴 제목 먼저 — 짧은 제목이 긴 토픽을 가로채지 않게 한다.
  return list.sort((a, b) => b.key.length - a.key.length);
})();

/**
 * 지문과 관련된 토픽 제목을 최대 limit 개 돌려준다(교재 토픽·본제목 우선).
 * 배경 문장에만 나온 토픽은 뺀다(questionText.focusHits) — 「자율주행, 의료 기기, 스마트 팩토리 등 … 강조되고 있다.
 * 소프트웨어 안전성 분석 기법에 대하여 설명하시오」에 스마트팩토리·자율주행이 붙었다.
 */
export function relatedTopics(text: string, limit = 3): string[] {
  return topicsIn(focusOf(text), limit);
}

const focusCache = new Map<string, string>();

/**
 * 배경 문장에 풀이가 적힌 이름을 요구 문장이 다시 부르면 그 풀이를 요구 문장에 붙여 준다.
 * 「…모바일 엣지 컴퓨팅(Mobile Edge Computing) 기술이 확대되고 있다. … 가. 모바일 엣지 컴퓨팅의 개념」은 요구 문장에 한글 이름만 있어
 * 영문 제목으로 걸리는 토픽(엣지컴퓨팅)을 놓친다. 「SSPL(System & Software Product Line)이 재조명 … SSPL에 대해」「'○○ 가이드라인'이 발표 … ○○에 대한」도 같다.
 */
function withGlosses(part: string, bg: string): string {
  const sq = squeeze(part);
  const tokens = tokensOf(part);
  const add: string[] = [];
  // 이름(풀이) — 괄호 앞 낱말 셋까지
  for (const m of bg.matchAll(/((?:[^\s(),.·'"‘’“”「」]+\s?){1,3})\s?[(（]([^)）]{2,90})[)）]/g)) {
    const words = m[1].trim().split(/\s+/);
    const named = (h: string) => {
      const k = squeeze(h);
      return isLatin(k) ? k.length >= 2 && tokens.has(k) : k.length >= 4 && sq.includes(k);
    };
    // 요구 문장이 다시 부른 만큼만 붙인다(긴 쪽부터) — 앞 낱말까지 붙이면 「Agent 확산으로 AI-DLC(…)」의 Agent 가 딸려 온다
    const head = [words.join(" "), words.slice(-2).join(" "), words.slice(-1).join(" ")].find(named);
    if (head) add.push(`${head}(${m[2]})`);
    else if (m[2].split(/[,，]/).some((g) => named(g.trim()))) add.push(`${words[words.length - 1]}(${m[2]})`);
  }
  // 따옴표로 묶은 이름(「…가이드라인 v2.0」) — 요구 문장이 그 이름의 앞머리 8자 이상을 다시 적었을 때
  for (const m of bg.matchAll(/[「『'‘“"]([^」』'’”"]{6,60})[」』'’”"]/g)) {
    const k = squeeze(m[1].replace(/[(（][^)）]*[)）]/g, ""));
    if (k.length >= 8 && sq.includes(k.slice(0, 8))) add.push(m[1]);
  }
  return add.length ? `${part}\n${add.join("\n")}` : part;
}

/**
 * 지문에서 토픽·답안을 찾을 때 볼 부분 — 배경 문장(「… 강조되고 있다.」)을 뗀 요구 문장.
 *  - 요구 문장이 대상을 스스로 적었고(「소프트웨어 안전성 분석 기법에 대하여 …」) 거기서 배경에 없던 토픽이 잡히면 요구 문장만.
 *    안 잡히면 지문 전체 — 「…버블정렬 프로그램의 일부이다. 프로그램을 완성하시오」처럼 요구 문장이 배경을 받는 문제.
 *  - 「다음을 설명하시오 / 가. … 나. …」 꼴이면, 첫 소문항이 배경에 나온 토픽을 다시 적었을 때만 소문항 쪽만 본다
 *    (「생성형 AI와 AI Agent 확산으로 AI-DLC … 가. AI-DLC의 개념」 → AI-DLC). 「가. 개념 및 특징」처럼 주제가 배경 문장에만 적힌 문제는 지문 전체.
 *  - 배경 문장에 풀이가 적힌 이름을 요구 문장이 다시 부르면 풀이를 붙여서 본다(withGlosses).
 * 배경 문장이 없으면 지문 그대로.
 */
export function focusOf(text: string): string {
  const hit = focusCache.get(text);
  if (hit !== undefined) return hit;
  const p = askParts(text);
  let out = text;
  if (p) {
    const ask = withGlosses(p.ask, p.bg);
    if (p.explicit) {
      // 요구 문장이 배경에 없던 토픽을 새로 적었을 때만 요구 문장만 본다. 배경에 나온 토픽만 다시 적었으면(「…워치독 타이머를 구현하고자 한다.
      // 하드웨어를 설계하고 마이크로프로세서 내부에서 …」) 주제가 배경 문장에 있는 문제다.
      const inBg = new Set(topicsIn(p.bg, 8));
      if (topicsIn(ask, 8).some((t) => !inBg.has(t))) out = ask;
    } else {
      const first = p.ask.split("\n")[1];
      if (first) {
        const inBg = new Set(topicsIn(p.bg, 8));
        if (topicsIn(withGlosses(first, p.bg), 8).some((t) => inBg.has(t))) out = ask;
      }
    }
  }
  if (focusCache.size > 40000) focusCache.clear();
  focusCache.set(text, out);
  return out;
}

function topicsIn(text: string, limit: number): string[] {
  const sq = squeeze(text);
  // 괄호 병기를 걷어낸 지문 — "인공지능(AI, Artificial Intelligence) 학습용 데이터"
  // 처럼 괄호가 제목을 끊어 놓는 경우를 위해 따로 만든다.
  const sqBare = squeeze(text.replace(/[(（][^)）]*[)）]/g, " "));
  const tokens = tokensOf(text);
  // 영문 낱말 경계 — "aiagent" 가 "AI(Agentic AI)" 에 맞지 않게(latinEdge.ts).
  const low = text.toLowerCase();
  const lowBare = text.replace(/[(（][^)）]*[)）]/g, " ").toLowerCase();
  const edgeOk = (k: string) => latinEdgeOk(low, k) || latinEdgeOk(lowBare, k);
  if (!sq) return [];
  const loose = looseTokensOf(text, tokens);
  const hits: Cand[] = [];
  const weak = new Set<Cand>();
  const used: string[] = [];
  const usedCore: string[] = [];
  for (const c of CANDS) {
    // 짧은 영문 약어는 낱말이 정확히 일치할 때만 — 부분 문자열 오탐 차단
    const short = isLatin(c.key) && c.key.length <= 5 && !c.sub;
    const ok = short
      ? tokens.has(c.key) || loose.has(c.key)
      : (sq.includes(c.key) || sqBare.includes(c.key)) && edgeOk(c.key);
    if (!ok) continue;
    if (short && !tokens.has(c.key)) weak.add(c);
    // 더 긴 토픽에 포함되면 생략. 다만 교재 밖 토픽(examTopics)의 긴 이름이 교재·예전 토픽을 가리지는 않는다 —
    // 「가트너 2025년 전략 기술」「보정계수」 같은 이름이 먼저 잡혀 교재 토픽과 그 답안이 빠졌다.
    if ((c.exam ? used : usedCore).some((u) => u.includes(c.key))) continue;
    used.push(c.key);
    if (!c.exam) usedCore.push(c.key);
    hits.push(c);
    if (hits.length >= limit * 4) break;
  }
  const out: string[] = [];
  for (const c of hits.sort(
    (a, b) =>
      Number(b.book) - Number(a.book) ||
      Number(weak.has(a)) - Number(weak.has(b)) ||
      Number(a.alias) - Number(b.alias) ||
      b.key.length - a.key.length,
  )) {
    if (!out.includes(c.title)) out.push(c.title);
    if (out.length >= limit) break;
  }
  return out;
}

/** 지문과 맞는 ★교재 서브노트★ 제목 하나(답안지 템플릿 연결용). 없으면 undefined. 배경 문장에만 나온 토픽은 고르지 않는다. */
export function relatedSubnote(text: string): string | undefined {
  return subnoteIn(focusOf(text));
}

function subnoteIn(text: string): string | undefined {
  const sq = squeeze(text);
  const sqBare = squeeze(text.replace(/[(（][^)）]*[)）]/g, " "));
  const tokens = tokensOf(text);
  const low = text.toLowerCase();
  const lowBare = text.replace(/[(（][^)）]*[)）]/g, " ").toLowerCase();
  const edgeOk = (k: string) => latinEdgeOk(low, k) || latinEdgeOk(lowBare, k);
  if (!sq) return undefined;
  const loose = looseTokensOf(text, tokens);
  let best: Cand | undefined;
  let bestWeak: Cand | undefined;
  for (const c of CANDS) {
    if (!c.book) continue;
    const short = isLatin(c.key) && c.key.length <= 5;
    const ok = short ? tokens.has(c.key) : (sq.includes(c.key) || sqBare.includes(c.key)) && edgeOk(c.key);
    if (!ok) {
      // 한글이 붙은 약어로만 걸린 것은 다른 것이 하나도 없을 때만 고른다
      if (short && loose.has(c.key) && (!bestWeak || c.key.length > bestWeak.key.length)) bestWeak = c;
      continue;
    }
    // 본제목 매칭을 우선하고, 같은 급이면 더 긴(구체적인) 제목을 고른다.
    if (
      !best ||
      (Number(best.alias) - Number(c.alias) > 0) ||
      (best.alias === c.alias && c.key.length > best.key.length)
    )
      best = c;
  }
  return (best ?? bestWeak)?.title;
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
  존재생체기반: "생체인식기술",
  프로토타입모델: "SW 개발방법론",
  반복적증분형모델: "SW 개발방법론",
  sdlc프로세스모델: "SW 개발방법론",
  모놀리식커널: "Monolithic 커널",
  커널구조: "커널",
  web10: "Web 2.0",
  web20: "Web 2.0",
  web30: "Web 3.0 / Web 4.0",
  시스템테스트: "테스트 단계 분류",
  인수테스트: "테스트 단계 분류",
  단위테스트: "테스트 단계 분류",
  pos지분증명: "합의 알고리즘",
  pow작업증명: "합의 알고리즘",
  dpos위임지분증명: "합의 알고리즘",
  pbft: "합의 알고리즘",
  키스트레칭keystretching: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)",
  나선형: "Spiral 모델",
  반복점증: "SW 개발방법론",
  유스케이스포인트: "SW 개발방법론",
  체크섬: "오류제어",
  순환중복검사crc: "오류제어",
  패리티비트: "오류제어",
  해밍코드: "오류제어",
  bb트리: "Balanced Tree\nB-Tree(비트리)",
  마이크로커널: "Micro 커널",
  파이프필터: "아키텍처 모델 / 패턴",
  블랙보드: "아키텍처 모델 / 패턴",
  embb: "5G(IMT-2020) 주요 기술",
  urllc: "5G(IMT-2020) 주요 기술",
  mmtc: "5G(IMT-2020) 주요 기술",
  itil서비스라이프사이클: "ITIL / ITIL 3.0",
  서비스전략: "ITIL / ITIL 3.0",
  서비스설계: "ITIL / ITIL 3.0",
  서비스전환: "ITIL / ITIL 3.0",
  서비스운영: "ITIL / ITIL 3.0",
  지속적서비스개선: "ITIL / ITIL 3.0",
  wifi세대: "WIFI 6",
  wifi4: "WIFI 6",
  wifi5: "WIFI 6",
  wifi66e: "Wi-Fi 6E",
  이동통신세대1g5g: "5G(IMT-2020) 주요 기술",
  광전송계위: "SDH(Synchronous Digital Hierarchy)",
  ddos공격유형: "DoS, Ddos, Model DoS",
  대역폭소진: "DoS, Ddos, Model DoS",
  자원소진: "DoS, Ddos, Model DoS",
  럼바우객체지향분석omt: "객체지향 개발방법론",
  객체모델: "객체지향 개발방법론",
  동적모델: "객체지향 개발방법론",
  기능모델: "객체지향 개발방법론",
  디피헬만키교환5단계: "Diffie-Hellman 키 교환",
  조직구조와pm권한: "프로젝트 조직유형",
  기능조직: "프로젝트 조직유형",
  매트릭스조직: "프로젝트 조직유형",
  프로젝트조직: "프로젝트 조직유형",
  pos: "합의 알고리즘",
  pow: "합의 알고리즘",
  dpos: "합의 알고리즘",
  파밍pharming: "Phishing",
  스미싱smishing: "Phishing",
  비싱vishing: "Phishing",
  qr싱qrshing: "Phishing",
  연속할당: "연속할당 기법(Contiguous Allocation)",
  eprom: "UV EPROM",
  마스크romMaskROM: "EEPROM",
  보이스코드정규형bcnf: "4차 정규화",
};

/** 표·비교 항목에 흔히 나오지만 그 자체로는 토픽이 아닌 말 */
const CONCEPT_STOP = new Set([
  "신뢰성", "인터넷", "물리적", "논리적", "가용성", "무결성", "기밀성",
  "효율성", "사용성", "이식성", "확장성", "정확성", "완전성", "일관성",
  "패킷필터링", "오버헤드", "연속할당", "기능성", "유지보수성",
]);

/** 묶음 이름 뒤에 붙는 군더더기 — 떼고 다시 찾아본다. */
const TAIL = /(유형|방식|모델|구조|기법|분류|계층|단계|발전)$/;

export function topicForConcept(name: string): string | undefined {
  const key = squeeze(name);
  const alias = CONCEPT_ALIAS[key];
  if (alias) return alias;
  // 너무 짧거나 그 자체로 특정이 안 되는 말은 링크를 걸지 않는다(오탐 방지).
  const minLen = 3;
  if (
    key.length < minLen ||
    STOP.has(name.trim()) ||
    STOP_EN.has(key) ||
    CONCEPT_STOP.has(key)
  )
    return undefined;
  let exact: Cand | undefined;
  let contains: Cand | undefined;
  for (const c of CANDS) {
    if (c.key === key) {
      // 본제목 일치를 별칭 일치보다 우선
      if (!exact || (exact.alias && !c.alias)) exact = c;
      continue;
    }
    // 짧은 영문 약어(LRU·DFS 등)는 부분 포함으로 찾으면 엉뚱한 토픽에 붙는다
    // (LRU→GPGPU…, DFS→HDFS). 이런 키는 제목 완전일치일 때만 연결한다.
    if (isLatin(key) && key.length <= 5) continue;
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
