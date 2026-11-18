/**
 * 서브 토픽 ↔ 예전(기필반) 토픽 카드 — 서브 토픽에는 교재 쪽이 따로 없어 설명이 비어 보였다.
 *
 * 2026-11-15 "서브토픽들은 왜 설명이 없어" — 서브 토픽 화면은 교재 표에서 그 이름이 든 행만 보여 줬고(정의를 지어 넣지 않으려고),
 * 같은 이름의 기필반 토픽은 목록에서 감춰지기까지 해서(explainData 의 SUB_KEYS) 있던 설명도 안 보이게 됐다.
 * 기필반 카드(정의·구성요소·두음)는 사용자의 자료라 지어낸 글이 아니다 — 이름·별칭이 맞는 카드를 찾아 서브 토픽 화면과 지하철 읽기에 붙인다.
 * 약어가 딴 뜻인 카드(MDM = 모바일 단말 관리, BaaS = 블록체인 서비스 …)는 NOT 으로 뺀다.
 */
import flashcards from "@/data/flashcards.json";
import { SUB_TOPICS, type SubTopic } from "@/data/subTopics";

type Card = { id: string; title: string; category: string; source?: string; definition?: string; defShort?: string };
const CARDS = (flashcards as Card[]).filter((c) => c.source !== "심화반" && (c.definition || "").trim());

const normT = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
const bareT = (s: string) => normT(s.replace(/[(（][^)）]*[)）]/g, ""));
/** 이름 뒤에 붙어도 같은 토픽인 흔한 꼬리말 — 「DDoS 공격」「체크포인트 회복기법」 */
const SUF = /^(?:공격|기법|알고리즘|모델|이론|분석|문제|구조|원칙|개념|기술|시스템|프로토콜|테스트|테스팅|학습|방식|제도|인증|검정|분포|현상|관리|아키텍처|패턴|매트릭스|곡선|표준|서비스|정책|보안|개요|방법론|방법|유형|종류|회복기법|취약점)$/;
const segs = (t: string) => t.split(/[/,()（）:;]|\s-\s/).map((x) => x.trim()).filter(Boolean);

/** 같은 약어의 딴 뜻 — 카드 제목·정의에 이 말이 있으면 그 서브 토픽에는 붙이지 않는다 */
const NOT: Record<string, RegExp> = {
  "MDM(Master Data Management)": /모바일 단말|Mobile Device/,
  "IoC(Indicators of Compromise)": /의존객체|Inversion of Control/,
  "BaaS·FaaS": /블록체인/,
  "SIL(안전무결성 수준)": /Software-in-the-Loop/i,
  "IDS·IPS": /Indoor Positioning/,
  // 「캡슐화」 카드는 둘이다(객체지향 se-19 · 네트워크 net-6) — 네트워크 쪽만
  "캡슐화/역캡슐화": /객체지향|Method/,
};

/** 이름이 달라 열쇠로는 못 찾는 카드 — 눈으로 정의를 읽어 맞는 것만 적었다(카드 제목 그대로) */
const EXTRA: Record<string, string[]> = {
  "망 분리": ["논리적 망분리", "물리적 망분리"],
  "CRUD 매트릭스": ["CRUD 메트릭스(Matrix)"],
  "카이제곱 분포·검정": ["카이제곱분포", "카이제곱검정"],
  "I-PIN(아이핀)": ["i-PIN 1.0, 2.0"],
  "CISO(정보보호 최고책임자)": ["CISO 지정신고 의무화"],
  "Self-Attention(셀프 어텐션)": ["Self-Attention메커니즘"],
  "뉴로모픽 반도체": ["뉴로모픽칩(Neuromorphic chip)"],
  "소켓(Socket)": ["TCP Socket", "UDP Socket", "Web Socket"],
  "디지털 교과서": ["AI 디지털 교과서"],
  "FIDO(Fast IDentity Online)": ["FIDO 1.0", "FIDO 2.0"],
  COBIT: ["COBIT 2019", "COBIT5"],
  "상관분석·상관계수": ["상관 관계 분석(Correlation Analysis)"],
  "조인 기법(Nested Loop·Sort Merge·Hash Join)": ["Join 유형", "Join"],
  "선점형·비선점형 스케줄링": ["선점 방식(선비)", "비선점방식 유형"],
  "Scale-Up·Scale-Out": ["Auto Scale Up/Auto Scale Out"],
  "엣지 컴퓨팅(Edge Computing)": ["지능형 엣지 컴퓨팅", "Mobile Edge Computing"],
  "ROI(투자수익률)": ["IT-ROI 투자 성과평가"],
  "Clark-Wilson 모델": ["접근제어 Model(Bell-Lapadula, Biba, Clark & Wilson , Access Matrix)"],
  "캡슐화/역캡슐화": ["캡슐화"],
};
const BY_TITLE = new Map(CARDS.map((c) => [c.title, c]));

const BY_KEY = new Map<string, Card[]>();
const put = (k: string, c: Card) => {
  if (k.length < 2) return;
  const a = BY_KEY.get(k);
  if (!a) BY_KEY.set(k, [c]);
  else if (!a.includes(c)) a.push(c);
};
for (const c of CARDS) {
  put(normT(c.title), c);
  put(bareT(c.title), c);
  for (const s of segs(c.title)) {
    put(normT(s), c);
    const w = s.split(/\s+/);
    if (w.length >= 2 && SUF.test(w[w.length - 1])) put(normT(w.slice(0, -1).join(" ")), c);
  }
}

export type SubCard = { id: string; title: string; category: string; definition: string; defShort?: string };

const cache = new Map<string, SubCard[]>();
/** 서브 토픽에 맞는 기필반 카드 — 이름 → 괄호 속 영문 → 별칭 차례 */
export function subCardsFor(st: SubTopic): SubCard[] {
  const hit = cache.get(st.name);
  if (hit) return hit;
  const paren = st.name.match(/[(（]([^)）]+)[)）]/)?.[1];
  const keys = [st.name, st.name.replace(/[(（][^)）]*[)）]/g, ""), ...(paren ? [paren] : []), ...st.aliases];
  const not = NOT[st.name];
  const out: SubCard[] = [];
  const seen = new Set<string>();
  const found = [
    ...keys.flatMap((k) => BY_KEY.get(normT(k)) ?? []),
    ...(EXTRA[st.name] ?? []).map((t) => BY_TITLE.get(t)).filter((c): c is Card => !!c),
  ];
  for (const c of found) {
    if (seen.has(c.id) || seen.has(c.title)) continue;
    if (not && not.test(`${c.title} ${c.definition}`)) continue;
    seen.add(c.id);
    seen.add(c.title);
    out.push({ id: c.id, title: c.title, category: c.category, definition: (c.definition || "").trim(), defShort: c.defShort });
  }
  cache.set(st.name, out);
  return out;
}

const BY_NAME = new Map(SUB_TOPICS.map((s) => [s.name, s]));
/** 서브 토픽 이름 → 한 줄 정의(지하철 읽기용). 카드가 없으면 undefined */
export function subDefFor(name: string): string | undefined {
  const st = BY_NAME.get(name);
  return st ? subCardsFor(st)[0]?.definition : undefined;
}
