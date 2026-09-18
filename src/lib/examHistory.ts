import questions from "@/data/questions.json";

/**
 * NS 주간 모의고사 출제 이력 — "이 토픽이 언제, 몇 번 나왔나".
 *
 * 기출 빈도가 높거나 최근에 나온 토픽은 반드시 봐야 하는데, 문제은행에
 * 들어 있어도 토픽 화면·학습계획에서는 보이지 않았다. 여기서 토픽 제목으로
 * NS 문항을 찾아 학습계획 줄과 토픽 설명 머리에 붙인다.
 *
 * 매칭은 제목 기준 부분 일치다.
 *  - 한글 개념 이름(괄호·끝 일반어 제거, 공백 제거)이 전부 문항에 들어 있거나
 *  - 괄호 속 영문 이름(흔한 한 낱말 제외)이 들어 있으면 출제된 것으로 본다.
 * 짧은 영문 약어(6자 이하)는 낱말 단위로만 맞춘다 — "OS"가 "OSPF"에 걸리지 않게.
 */
import type { ExamAppearance, PastAppearance } from "@/lib/examHistoryUtil";
export type { ExamAppearance, PastAppearance } from "@/lib/examHistoryUtil";
export { ym, weekLabel, isRecent, summarize } from "@/lib/examHistoryUtil";

type Q = {
  id: string;
  kind?: string;
  cohort?: string;
  round?: string;
  date?: string;
  period: string;
  exam?: string;
  text: string;
};

const squeeze = (s: string) =>
  s.toLowerCase().replace(/[\s·ㆍ‧,./\-–—_:;'"’“”()（）[\]【】<>《》]/g, "");

const isLatin = (s: string) => /^[a-z0-9 +&/.-]+$/i.test(s);

const NS: { q: Q; sq: string; tokens: Set<string> }[] = (questions as Q[])
  .filter((q) => q.kind === "NS모의" && q.date)
  .map((q) => ({
    q,
    sq: squeeze(q.text),
    tokens: new Set(
      q.text
        .toLowerCase()
        .split(/[^a-z0-9+#]+/)
        .filter(Boolean),
    ),
  }));

/** 괄호 속 영문이 한 낱말일 때 너무 흔해서 열쇠로 못 쓰는 것들. */
const GENERIC = new Set([
  "process", "thread", "model", "view", "test", "testing", "data", "system", "security",
  "network", "service", "management", "cloud", "design", "pattern", "analysis", "method",
  "control", "protocol", "memory", "code", "key", "time", "quality", "standard", "engine",
  "architecture", "framework", "platform", "computing", "storage", "software", "hardware",
  "digital", "virtual", "strategy", "planning", "project", "program", "policy", "risk",
]);
/** 한글 제목 끝에 붙는 일반어 — 떼고 개념 이름만 남긴다. */
const TAIL = /\s*(비교|차이|차이점|개념|설명|종류|유형|절차|기법|방법|방식|방법론|기술|관리|전략|의|와|과|및)$/;

/** 일반어를 떼고 남은 것이 이런 낱말이면 열쇠로 못 쓴다 — 원래 제목을 그대로 쓴다. */
const KO_GENERIC = new Set([
  "데이터", "소프트웨어", "시스템", "보안", "네트워크", "정보", "서비스", "기술", "관리",
  "프로젝트", "품질", "테스트", "설계", "개발", "운영", "모델", "구조", "알고리즘", "클라우드",
  "인공지능", "디지털", "통계", "분석", "메모리", "프로세스", "위험", "성능", "표준",
]);
/** 끝의 일반어를 뗀다. 남은 것이 짧거나 흔한 낱말이면 떼지 않는다. */
function trimTail(p: string): string {
  let cur = p.trim();
  for (let i = 0; i < 2; i++) {
    const next = cur.replace(TAIL, "").trim();
    if (next === cur) break;
    if (next.length < 3 || KO_GENERIC.has(next)) break;
    // 남은 말이 전부 일반어면 열쇠가 헐거워진다 — 떼지 않는다.
    // "소프트웨어 개발 방법론"에서 방법론을 떼면 "소프트웨어 개발"이 되어
    // 그 말이 든 문항을 모조리 끌어왔다(요구공학·형상관리·기능점수까지).
    if (next.split(/\s+/).every((w) => KO_GENERIC.has(w))) break;
    cur = next;
  }
  return cur;
}

type Keys = { all: string[]; any: string[] };

/**
 * 제목에서 찾을 열쇠들.
 *  all: 한글 개념 이름들 — "프로세스와 스레드 비교" → [프로세스, 스레드], 전부 들어 있어야 한다.
 *  any: 괄호 속 영문 이름 — 하나라도 들어 있으면 된다(한글 없이 영문만 쓴 문항용).
 */
function keysOf(title: string): Keys {
  const all: string[] = [];
  const any: string[] = [];
  const bare = title.replace(/\s*[(（][^)）]*[)）]/g, " ").replace(/\s+/g, " ").trim();
  const parts = bare
    .split(/(?:(?<=[가-힣])(?:와|과|및|vs\.?)\s+|\s+vs\.?\s+|[,/·ㆍ]\s*)/i)
    .map(trimTail)
    .filter(Boolean);
  for (const p of parts) {
    const k = squeeze(p);
    if (!k) continue;
    if (isLatin(p)) {
      if (k.length >= 2) all.push(k);
      continue;
    }
    // 한글 뒤에 영문 약어가 붙은 제목("요구사항 명세서 SRS")은 통째로 열쇠를 만들면
    // 아무 문항도 못 찾는다 — 문항에는 "요구사항명세서" 로만 나오기 때문이다.
    // 한글 부분이 그 자체로 충분히 구체적일 때만(5자 이상·일반어 아님) 그것을 열쇠로 쓴다.
    // 반대로 "ANN 알고리즘"처럼 한글이 일반어면 통째로 둔다 — 안 그러면 '알고리즘'이
    // 든 문항을 전부 끌어온다.
    const tail = /^(.*[가-힣])\s+([A-Za-z0-9][A-Za-z0-9 .-]*)$/.exec(p.trim());
    if (tail) {
      const ko = squeeze(tail[1]);
      const lat = squeeze(tail[2]);
      if (ko.length >= 5 && !KO_GENERIC.has(ko)) {
        all.push(ko);
        gapRe(tail[1], ko);
        if (lat.length >= 3 && !GENERIC.has(lat)) any.push(lat);
        continue;
      }
    }
    if (k.length >= 2) {
      all.push(k);
      gapRe(p, k);
    }
  }
  for (const m of title.matchAll(/[(（]([^)）]+)[)）]/g)) {
    const inner = m[1].trim();
    if (inner.includes(",") || !isLatin(inner)) continue;
    const k = squeeze(inner);
    const words = inner.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      if (k.length >= 4 && !GENERIC.has(k)) any.push(k);
    } else if (k.length >= 8) {
      any.push(k);
    }
  }
  for (const k of EXTRA_ANY[title.trim()] ?? []) any.push(k);
  return { all: Array.from(new Set(all)), any: Array.from(new Set(any)) };
}

/**
 * 열쇠가 더 긴 낱말에 먹히는 경우 — 그 낱말만 나오는 문항은 이 토픽이 아니다.
 * 예) "암호화"는 "암호화폐" 문항을 끌어왔고, "개인정보 보호기술"은 끝말 '기술'을 떼어
 *     "개인정보보호"가 되면서 개인정보보호위원회·영향평가 문항까지 자기 이력으로 삼았다.
 */
const TRAP: Record<string, RegExp> = {
  암호화: /암호화폐|암호화페/,
  개인정보보호: /개인정보보호위원회|개인정보보호법|개인정보영향평가/,
};

function trapped(entry: { sq: string }, key: string): boolean {
  const re = TRAP[key];
  if (!re) return false;
  // 덫이 되는 낱말을 지우고도 열쇠가 남아 있으면 진짜로 다룬 문항이다.
  return !entry.sq.replace(new RegExp(re.source, "g"), "").includes(key);
}

/**
 * 같은 말을 다르게 적는 경우 — 교재는 "설계 원리", 문항은 "설계 원칙" 으로 쓴다.
 * 이 둘을 못 잇는 바람에 객체지향 설계 원리 토픽이 관련 문항을 하나도 못 찾았다.
 */
function variants(key: string): string[] {
  const out = [key];
  if (key.endsWith("원리")) out.push(key.slice(0, -2) + "원칙");
  else if (key.endsWith("원칙")) out.push(key.slice(0, -2) + "원리");
  return out;
}

/**
 * 여러 낱말로 된 열쇠는 문항에서 낱말 사이에 다른 말이 끼어 있어도 같은 뜻이다.
 * 교재 "객체지향 설계 원리" 는 문항에서 "객체 지향 프로그래밍의 설계 원칙" 으로
 * 나오는데, 공백을 지운 열쇠를 통째로 찾으면 '프로그래밍의' 때문에 못 잇는다.
 * 낱말 사이에 6자까지 끼는 것만 허용한다 — 낱말을 통째로 빼면(예전에 '방법론'을
 * 떼서 '소프트웨어 개발'이 된 사고) 엉뚱한 문항이 쏟아지므로 낱말은 다 있어야 한다.
 */
const GAP = new Map<string, RegExp | null>();
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function gapRe(part: string, key: string): void {
  if (GAP.has(key)) return;
  const words = part.trim().split(/\s+/).map(squeeze).filter(Boolean);
  if (words.length < 2) {
    GAP.set(key, null);
    return;
  }
  const pat = words.map((w, i) => {
    if (i < words.length - 1) return esc(w);
    // 끝 낱말은 표기 차이를 함께 본다(원리 ↔ 원칙).
    const vs = variants(w).map(esc);
    return vs.length > 1 ? `(?:${vs.join("|")})` : vs[0];
  });
  GAP.set(key, new RegExp(pat.join(".{0,6}")));
}

/**
 * 제목 열쇠로는 도저히 안 잡히는 표기 — 토픽마다 손으로 붙인다.
 * 문항이 교재 제목을 한 글자도 안 쓰는 경우다(SOLID 원칙 → "객체지향 설계 원리").
 */
const EXTRA_ANY: Record<string, string[]> = {
  "객체지향 설계 원리": ["solid원칙", "solid원리"],
  // 교재에 CI/CD 서브노트가 따로 없다 — CI/CD 문항은 데브옵스에서 본다.
  "데브옵스 (DevOps)": ["continuousintegration"],
  // 문항은 풀어 쓴 이름만 적는다("AI-DLC(AI-Driven Development Life Cycle)").
  "AI-DLC(AI-Driven SDLC)": ["aidrivendevelopmentlifecycle"],
  // 교재는 "테스트", 문항은 "테스팅".
  "탐색적 테스트": ["탐색적테스팅", "exploratorytesting"],
  // 제목이 "감리/PMO 비교표" 라 PMO 를 다룬 문항을 못 찾았다.
  "감리/PMO 비교표": ["pmo"],
};

function has(entry: { sq: string; tokens: Set<string> }, key: string): boolean {
  if (isLatin(key) && !/\s/.test(key) && key.length <= 6) return entry.tokens.has(key);
  if (variants(key).some((k) => entry.sq.includes(k))) return true;
  const re = GAP.get(key);
  return re ? re.test(entry.sq) : false;
}

function hit(entry: { sq: string; tokens: Set<string> }, keys: Keys): boolean {
  if (keys.all.length && keys.all.every((k) => has(entry, k) && !trapped(entry, k))) return true;
  return keys.any.some((k) => has(entry, k));
}

const cache = new Map<string, ExamAppearance[]>();

/** 토픽 제목으로 NS 출제 이력을 찾는다. 최신 순. */
export function examHistory(title: string): ExamAppearance[] {
  const t = (title || "").trim();
  if (!t) return [];
  const hitCache = cache.get(t);
  if (hitCache) return hitCache;
  const keys = keysOf(t);
  const out: ExamAppearance[] = [];
  if (keys.all.length || keys.any.length) {
    for (const e of NS) {
      if (hit(e, keys)) {
        const q = e.q;
        out.push({
          id: q.id,
          cohort: q.cohort || "",
          round: q.round || "",
          date: q.date || "",
          period: q.period,
          exam: q.exam,
          text: q.text,
        });
      }
    }
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  cache.set(t, out);
  return out;
}

// ── 기술사 기출 — "몇 회 몇 교시 몇 번으로 나왔나" ────────────────────────────
// 문제은행의 기출 문항은 id 가 k{회차}-{교시}{번호} 꼴이다(예: k140-106 = 140회 1교시 6번).

const PAST: { q: Q; sq: string; tokens: Set<string>; round: number; no: number }[] = (
  questions as Q[]
)
  .map((q) => ({ q, m: /^k(\d+)-(\d)(\d{2})$/.exec(q.id) }))
  .filter((x): x is { q: Q; m: RegExpExecArray } => !!x.m)
  .map(({ q, m }) => ({
    q,
    sq: squeeze(q.text),
    tokens: new Set(
      q.text
        .toLowerCase()
        .split(/[^a-z0-9+#]+/)
        .filter(Boolean),
    ),
    round: Number(m[1]),
    no: Number(m[3]),
  }));

const pastCache = new Map<string, PastAppearance[]>();

/** 토픽 제목으로 기술사 기출 이력을 찾는다. 최신 회차 순. */
export function pastExams(title: string): PastAppearance[] {
  const t = (title || "").trim();
  if (!t) return [];
  const c = pastCache.get(t);
  if (c) return c;
  const keys = keysOf(t);
  const out: PastAppearance[] = [];
  if (keys.all.length || keys.any.length) {
    for (const e of PAST) {
      if (hit(e, keys)) {
        out.push({ id: e.q.id, round: e.round, period: e.q.period, no: e.no, text: e.q.text });
      }
    }
  }
  out.sort((a, b) => b.round - a.round || a.period.localeCompare(b.period) || a.no - b.no);
  pastCache.set(t, out);
  return out;
}


// ── 문제은행 전체 매칭 — "이 토픽에 모범답안이 있나" 를 따질 때 쓴다 ──────────
// examHistory·pastExams 는 NS 모의고사와 기술사 기출만 본다. 모범답안은 모의고사·
// 파이널·예상·셀테 문항에도 달려 있어서, 그 둘만으로 세면 있는 답안을 없다고 센다.

const ALL: { id: string; sq: string; tokens: Set<string> }[] = (questions as Q[]).map((q) => ({
  id: q.id,
  sq: squeeze(q.text),
  tokens: new Set(
    q.text
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .filter(Boolean),
  ),
}));

const allCache = new Map<string, string[]>();

/** 토픽 제목과 맞는 문제은행 문항 id 전부(출처 무관). */
export function questionIdsForTitle(title: string): string[] {
  const t = (title || "").trim();
  if (!t) return [];
  const c = allCache.get(t);
  if (c) return c;
  const keys = keysOf(t);
  const out =
    keys.all.length || keys.any.length ? ALL.filter((e) => hit(e, keys)).map((e) => e.id) : [];
  allCache.set(t, out);
  return out;
}
