/**
 * 2교시형 빈출 요구 — 이 토픽이 2~4교시(서술형)로 나왔을 때 지문이 무엇을 물었는지 세어 위 3개를 고른다.
 *
 * 2026-10-18 "2교시형 답안 템플릿은 빈출 3개 기준으로 정리" — 템플릿 Ⅱ·Ⅲ 이 교재 표 순서대로 깔려,
 * 실제 시험이 자주 묻는 것(구성요소·절차·대응방안 …)과 어긋났다. 지문을 「가. 나. 다.」(또는 1) 2) ①②)
 * 항목으로 끊고, 항목마다 요구 유형을 붙여 문항 단위로 센다(한 문항 안 같은 유형은 1번).
 * 화면 컴포넌트가 쓰므로 자료를 import 하지 않는 순수 함수만 둔다.
 */
export type AskKind = {
  key: string;
  /** 답안 소제목에 쓰는 말 */
  label: string;
  re: RegExp;
  /** 약한 말 — 다른 유형이 하나도 안 걸렸을 때만 센다(「아키텍처」「기법」은 토픽 이름에도 흔하다) */
  weak?: RegExp;
  /** 이 유형과 맞는 교재 표 캡션·머리글 */
  table: RegExp;
  /** 개념도를 같이 그리는 유형 */
  figure?: boolean;
};

export const ASK_KINDS: AskKind[] = [
  { key: "calc", label: "풀이·작성", re: /계산|구하시오|풀이|산출하|작성하시오|그리시오|도출하시오|수행 ?과정을|적용하여|예시를 들어/, table: /예시|사례|풀이/ },
  { key: "compare", label: "비교", re: /비교|차이|차이점|vs\.?|대비/i, table: /비교|차이|vs/i },
  { key: "proscons", label: "장단점", re: /장단점|장점|단점|장·단점/, table: /장점|단점|장단점/ },
  { key: "trend", label: "동향·발전 방향", re: /동향|발전 ?방향|발전 ?전망|전망|추세|표준화 동향|향후/, table: /동향|발전|전망|표준/ },
  { key: "use", label: "활용 방안·사례", re: /활용|사례|적용 ?분야|적용 ?방안|응용 ?분야|서비스 ?모델/, table: /활용|사례|적용|분야/ },
  { key: "adopt", label: "도입 시 고려사항", re: /고려 ?사항|도입|구축 ?방안|구축 ?시|구축 ?절차|전환|이행 ?방안|추진 ?(전략|방안)|수립 ?방안/, table: /고려|도입|구축|추진|전략/ },
  { key: "issue", label: "문제점·위협", re: /문제점|취약점|위협|이슈|한계|리스크|위험 ?요소|공격 ?유형|공격 ?기법/, weak: /문제/, table: /문제|위협|취약|이슈|한계|공격|위험/ },
  { key: "solve", label: "대응 방안", re: /대응|해결|대책|극복|보완|개선 ?방안|방지|보호 ?방안|보안 ?방안|관리 ?방안|방어/, table: /대응|해결|대책|방안|보완|방지|방어/ },
  { key: "process", label: "절차·프로세스", re: /절차|프로세스|단계|과정|수행 ?방법|동작 ?(원리|방식|과정|메커니즘)|흐름|생명 ?주기|라이프 ?사이클|메커니즘|처리 ?방식/, table: /절차|프로세스|단계|과정|동작|흐름|메커니즘|순서/, figure: true },
  { key: "tech", label: "기술요소", re: /기술 ?요소|핵심 ?기술|요소 ?기술|주요 ?기술|구현 ?기술|관련 ?기술|기반 ?기술/, table: /기술/ },
  { key: "struct", label: "구성요소·구조", re: /구성 ?요소|구성도|개념도|참조 ?모델|프레임워크|구조도|계층 ?구조|구조와|구조 ?및/, weak: /아키텍처|구조|구성|계층/, table: /구성|요소|아키텍처|구조|계층|모델|프레임워크/, figure: true },
  { key: "type", label: "유형·종류", re: /유형|종류|분류|\d ?가지/, weak: /기법|방식|알고리즘/, table: /유형|종류|분류|기법|방식|알고리즘/ },
  { key: "role", label: "기능·역할", re: /기능|역할/, weak: /원리/, table: /기능|역할|원리/ },
  { key: "metric", label: "지표·평가", re: /지표|평가 ?(항목|기준|방법)|척도|측정|메트릭|기준/, table: /지표|평가|척도|측정|기준/ },
  { key: "feature", label: "특징", re: /특징|특성|원칙|속성/, table: /특징|특성|원칙|속성/ },
  { key: "concept", label: "개념·필요성", re: /개념|정의|필요성|등장 ?배경|목적|배경|의의|중요성/, table: /개념|정의|필요|배경|목적/ },
];

/** 서론(Ⅰ)이 맡는 유형 — 빈출 3개를 고를 때 본론 후보에서 뺀다 */
export const INTRO_KINDS = new Set(["concept", "feature"]);

/** 지문을 요구 항목으로 끊는다 — 「가. 나. 다.」「1) 2)」「①②」「(1) (2)」. 없으면 지문 전체가 한 항목 */
export function subAsks(text: string): string[] {
  // 한 항목이 「A에 대하여 설명하고 B …」처럼 둘을 물으면 둘로 나눈다
  const two = (x: string) => x.split(/(?:에 ?대하여|에 ?대해|을|를)?\s*(?:설명|기술|제시|서술|비교)하고\s+/).map((y) => y.trim()).filter(Boolean);
  return subAsksRaw(text).flatMap(two);
}

function subAsksRaw(text: string): string[] {
  const t = (text || "").replace(/\s+/g, " ").trim();
  const parts = t.split(/\s(?=(?:[가나다라마바]\s?[.)]\s)|(?:\(?[1-6]\)\s?)|[①②③④⑤⑥])/);
  // 맨 앞 조각은 지문 머리(배경 설명) — 항목이 따로 있으면 버린다
  if (parts.length > 1) return parts.slice(1).map((p) => p.replace(/^(?:[가나다라마바]\s?[.)]|\(?[1-6]\)|[①②③④⑤⑥])\s*/, "").trim()).filter(Boolean);
  // 항목 없이 한 문장으로 여럿을 묻는 지문 — 「A, B, C 에 대하여」를 쉼표로 끊어 본다
  const ask = t.replace(/(?:에 ?대하여|에 ?대해|을|를)?\s*(?:설명|기술|논|제시|서술)하시오\.?$/, "");
  const tail = ask.split(/[.?]\s/).pop() ?? ask;
  return tail.split(/,|및|와 |과 /).map((x) => x.trim()).filter((x) => x.length >= 2);
}

export function kindsOf(item: string): AskKind[] {
  const strong = ASK_KINDS.filter((k) => k.re.test(item));
  return strong.length ? strong : ASK_KINDS.filter((k) => k.weak?.test(item));
}

export type AskStat = {
  kind: AskKind;
  /** 이 유형을 물은 문항 수 */
  n: number;
  /** 실제 지문 표현(짧은 것부터 최대 3개) */
  samples: string[];
};

/** 빈출 항목 — 지문 요구 항목을 같은 말끼리 묶은 것(「데이터베이스 장애 유형」 4회) */
export type AskItem = {
  /** 대표 표현(가장 짧은 것) */
  label: string;
  /** 이 항목이 나온 문항 수 */
  n: number;
  kinds: AskKind[];
  /** 같은 묶음의 다른 표현 */
  variants: string[];
};

export type AskFreq = {
  /** 센 서술형 문항 수 */
  total: number;
  /** 요구 유형별 문항 수 */
  stats: AskStat[];
  /** 빈출 항목(많은 순) — 서론 몫(토픽 자체·개념·특징)은 뺀다 */
  items: AskItem[];
  /** 위 3개 */
  top: AskItem[];
};

const TAIL =
  /(?:을|를|에 ?대하여|에 ?대해|에 ?대한|에 ?관하여|에 ?관해)?\s*(?:상세히 |자세히 |간략히 )?(?:설명|기술|제시|서술|논|작성|도출|표현|정리|분석|제안)?(?:하고|하며|하여|하시오|하라|하시고|하시기 바랍니다)?\s*[.?]?$/;
const INTRO_ONLY = /^(?:개념|정의|특징|특성|필요성|등장배경|배경|목적|개요|의의|중요성|개념및특징|정의및특징|개념과특징|개념및필요성|등장배경및개념)$/;

const squeeze = (x: string) =>
  x
    .replace(/\([^)]*\)/g, "")
    .replace(/[\s.,·:'"“”‘’\-/]/g, "")
    .toLowerCase();

/** 묶음 열쇠 — 괄호·조사·서술어·토픽 이름을 걷어 낸 핵심 말 */
function keyOf(label: string, topicWords: string[]): string {
  let k = squeeze(label);
  for (const w of topicWords) if (w.length >= 2) k = k.split(w).join("");
  return k.replace(/^(?:의|에서|에|및|와|과)+/, "").replace(/(?:의|을|를|와|과|및|에)+$/, "");
}

/**
 * 서술형 지문들 → 빈출 항목과 요구 유형 수. title 은 토픽 제목(지문 속 토픽 이름을 걷어 낼 때 쓴다).
 * 같은 지문이 기수마다 다시 나오면(NS 10기·13기·14기 …) 그만큼 센다 — 그게 빈출이다.
 */
export function askFreq(texts: string[], title = ""): AskFreq {
  const bare = title.replace(/\s*[(（][^)）]*[)）]/g, " ").trim();
  const inParen = (title.match(/[(（]([^)）]+)[)）]/g) ?? []).map((x) => x.slice(1, -1));
  const topicWords = Array.from(
    new Set([squeeze(bare), ...bare.split(/\s+/).map(squeeze), ...inParen.map(squeeze), "데이터베이스", "db"].filter((w) => w.length >= 2)),
  ).sort((a, b) => b.length - a.length);

  const by = new Map<string, AskStat>();
  const groups = new Map<string, { item: AskItem; first: number; qs: Set<number> }>();
  let total = 0;
  let order = 0;
  for (const text of texts) {
    const items = subAsks(text);
    if (!items.length) continue;
    total++;
    const seenK = new Set<string>();
    const seenG = new Set<string>();
    for (const raw of items) {
      const label = raw.replace(TAIL, "").trim().slice(0, 48);
      if (!label) continue;
      for (const k of kindsOf(label)) {
        if (!by.has(k.key)) by.set(k.key, { kind: k, n: 0, samples: [] });
        const s = by.get(k.key)!;
        if (!seenK.has(k.key)) {
          s.n++;
          seenK.add(k.key);
        }
        if (!s.samples.includes(label)) s.samples.push(label);
      }
      const key = keyOf(label, topicWords);
      if (!key || INTRO_ONLY.test(key) || seenG.has(key)) continue;
      seenG.add(key);
      const g = groups.get(key) ?? { item: { label, n: 0, kinds: kindsOf(label), variants: [] }, first: order++, qs: new Set<number>() };
      g.qs.add(total);
      g.item.n = g.qs.size;
      if (!g.item.variants.includes(label)) g.item.variants.push(label);
      if (label.length < g.item.label.length) g.item.label = label;
      groups.set(key, g);
    }
  }
  // 한 열쇠가 다른 열쇠를 품으면(「장애유형」⊂「데이터베이스장애유형」) 한 묶음으로
  const keys = Array.from(groups.keys()).sort((a, b) => a.length - b.length);
  for (const short of keys) {
    const gs = groups.get(short);
    if (!gs || short.length < 3) continue;
    for (const long of keys) {
      // 비율이 낮아도 앞머리가 같으면(「수립절차」⊂「수립절차중중요활동인BIA」) 같은 요구다
      if (long === short || !long.includes(short) || (short.length / long.length < 0.5 && !long.startsWith(short))) continue;
      const gl = groups.get(long);
      if (!gl) continue;
      gl.qs.forEach((q) => gs.qs.add(q));
      gs.item.n = gs.qs.size;
      for (const v of gl.item.variants) if (!gs.item.variants.includes(v)) gs.item.variants.push(v);
      groups.delete(long);
    }
  }
  const kindOrder = (k: AskKind) => ASK_KINDS.indexOf(k);
  const stats = Array.from(by.values())
    .map((s) => ({ ...s, samples: s.samples.sort((a, b) => a.length - b.length).slice(0, 3) }))
    .sort((a, b) => b.n - a.n || kindOrder(a.kind) - kindOrder(b.kind));
  const itemsSorted = Array.from(groups.values())
    .sort((a, b) => b.item.n - a.item.n || a.first - b.first)
    .map((g) => g.item);
  return { total, stats, items: itemsSorted, top: itemsSorted.slice(0, 3) };
}

/** 서술형(2~4교시) 지문만 — 출제 이력 세 갈래에서 모은다 */
export function longFormTexts(o: {
  hist: { period: string; text: string }[];
  past: { period: string; text: string }[];
  mock: { source: string; text: string }[];
}): string[] {
  const long = (p: string) => /[234]\s*교시/.test(p);
  return [
    ...o.past.filter((x) => long(x.period)).map((x) => x.text),
    ...o.hist.filter((x) => long(x.period)).map((x) => x.text),
    ...o.mock.filter((x) => long(x.source) || (!/1\s*교시/.test(x.source) && x.text.length > 80)).map((x) => x.text),
  ];
}
