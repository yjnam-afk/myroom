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
export type ExamAppearance = {
  id: string;
  cohort: string;      // "18기"
  round: string;       // "09주차"
  date: string;        // "2026-05-03"
  period: string;      // "1교시"
  exam?: string;       // "139회 실전 Simulation"
  text: string;
};

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
    } else if (k.length >= 2) all.push(k);
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
  return { all: Array.from(new Set(all)), any: Array.from(new Set(any)) };
}

function has(entry: { sq: string; tokens: Set<string> }, key: string): boolean {
  if (isLatin(key) && !/\s/.test(key) && key.length <= 6) return entry.tokens.has(key);
  return entry.sq.includes(key);
}

function hit(entry: { sq: string; tokens: Set<string> }, keys: Keys): boolean {
  if (keys.all.length && keys.all.every((k) => has(entry, k))) return true;
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

/** "2026-05-03" → "26.05" */
export const ym = (d: string) => (d ? `${d.slice(2, 4)}.${d.slice(5, 7)}` : "");

/** "09주차" → "9주차" */
export const weekLabel = (r: string) => r.replace(/^0/, "");

/** 최근 12개월 안에 나왔는가 — 강조 기준. */
export function isRecent(date: string, now = new Date()): boolean {
  if (!date) return false;
  const d = new Date(date);
  const ms = now.getTime() - d.getTime();
  return ms >= 0 && ms < 365 * 24 * 3600 * 1000;
}

/** 이력 한 줄 요약 — 배지에 쓴다. */
export function summarize(hist: ExamAppearance[], now = new Date()) {
  const recent = hist.filter((h) => isRecent(h.date, now)).length;
  return {
    count: hist.length,
    recent,
    latest: hist[0]?.date || "",
    /** 최근 1년에 2번 이상 또는 통산 4번 이상이면 "꼭 볼 것" */
    must: recent >= 2 || hist.length >= 4,
  };
}
