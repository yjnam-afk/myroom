/**
 * 암기 카드 — 정리표가 토픽 하나를 보여 주는 틀(2026-11-09 "답안지를 암기할만한 모든 수단을 다 활용해야 한다").
 *   1. 정의(두음)  2. 개념도 — 손글씨가 있으면 붙이고, 없으면 빈칸(사용자가 그때그때 더한다. 2026-11-10 "개념도 어차피 못 그릴 거 같으니 빈칸으로")
 *   3. 자주 나오는 문제 유형 — 이 토픽이 시험(기출·NS·모의)에서 실제로 무엇을 물었는지(2026-11-10 "목차는 저게 뭐야. 자주 나오는 문제 유형을 차라리 보여줘라")
 *      교시별 출제 수 + 서술형 지문의 요구 항목(「발생 조건」 7회 · 「해결 방안」 4회 …) + 요구 유형(비교·구성요소·절차 …)
 * 돌려막기(답안 틀)는 정리표·지하철에서 뺐다 — 토픽 설명의 FrameCard 에만 둔다.
 */
import flashcards from "@/data/flashcards.json";
import { handDiagramsFor } from "@/data/handDiagrams";
import { examHistory, pastExams, mockExams } from "@/lib/examHistory";
import { askFreq, longFormTexts, INTRO_KINDS } from "@/lib/askFreq";

/** 대표 표현 — 가장 짧은 것이 띄어쓰기 없는 OCR 문장(「최소디스크수량」)이면 띄어쓴 비슷한 길이의 표현을 고른다 */
function pickLabel(label: string, variants: string[]): string {
  if (/\s/.test(label)) return label;
  const spaced = variants.filter((v) => /\s/.test(v) && v.length <= label.length * 1.5).sort((a, b) => a.length - b.length);
  return spaced[0] ?? label;
}

type Card = {
  title: string;
  source?: string;
  memo?: string;
  mnemonic?: string;
};

export type MemoAsk = {
  /** 요구 항목(가장 짧은 표현) */
  label: string;
  /** 이 항목이 나온 문항 수 */
  n: number;
  /** 같은 요구의 다른 표현 */
  variants: string[];
};

export type MemoAsks = {
  /** 1교시(단답형) 출제 수 */
  short: number;
  /** 2~4교시(서술형) 출제 수 */
  long: number;
  /** 서술형 지문의 요구 항목(많은 순) */
  items: MemoAsk[];
  /** 요구 유형(비교·구성요소·절차 …, 많은 순) */
  kinds: { label: string; n: number }[];
};

export type MemoCard = {
  title: string;
  /** 교재 키워드 두음(교재에 적힌 것만) */
  mnemonic: string;
  memo: string;
  /** 손글씨 개념도(없으면 빈칸) */
  hand: string[];
  asks: MemoAsks;
};

const CARD = new Map<string, Card>();
for (const c of flashcards as Card[]) if (c.source === "심화반" && !CARD.has(c.title)) CARD.set(c.title, c);

const cache = new Map<string, MemoCard>();

export function memoCardFor(title: string): MemoCard {
  const hit = cache.get(title);
  if (hit) return hit;
  const c = CARD.get(title);
  const hist = examHistory(title);
  const past = pastExams(title);
  const mock = mockExams(title);
  const texts = longFormTexts({ hist, past, mock });
  const freq = texts.length ? askFreq(texts, title) : null;
  const total = hist.length + past.length + mock.length;
  const asks: MemoAsks = {
    long: texts.length,
    short: Math.max(0, total - texts.length),
    items: (freq?.items ?? []).slice(0, 6).map((it) => {
      const label = pickLabel(it.label, it.variants);
      return { label, n: it.n, variants: it.variants.filter((v) => v !== label).slice(0, 3) };
    }),
    // 요구 유형 — 서론 몫(개념·특징)은 어느 토픽이나 많아 뺀다
    kinds: (freq?.stats ?? [])
      .filter((s) => !INTRO_KINDS.has(s.kind.key))
      .slice(0, 4)
      .map((s) => ({ label: s.kind.label, n: s.n })),
  };
  const out: MemoCard = {
    title,
    mnemonic: c?.mnemonic || "",
    memo: c?.memo || "",
    hand: handDiagramsFor(title),
    asks,
  };
  cache.set(title, out);
  return out;
}
