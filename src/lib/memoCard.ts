/**
 * 암기 카드 — 정리표가 토픽 하나를 보여 주는 틀(2026-11-09 "답안지를 암기할만한 모든 수단을 다 활용해야 한다").
 *   1. 정의(두음)  2. 개념도 — 손글씨가 있으면 붙이고, 없으면 빈칸(사용자가 그때그때 더한다. 2026-11-10 "개념도 어차피 못 그릴 거 같으니 빈칸으로")
 *   3. 자주 나오는 문제 — 이 토픽으로 실제 출제된 문제 그 자체(기출·NS·모의)를 「같은 문제」끼리 묶어 많이 나온 순으로
 *      (2026-11-10 "목차는 저게 뭐야. 자주 나오는 문제 유형을 차라리 보여줘라" → "문제 자체를 말한건데")
 * 돌려막기(답안 틀)는 정리표·지하철에서 뺐다 — 토픽 설명의 FrameCard 에만 둔다.
 */
import flashcards from "@/data/flashcards.json";
import { handDiagramsFor } from "@/data/handDiagrams";
import { examHistory, pastExams, mockExams } from "@/lib/examHistory";
import { sameQuestionText, yearMonth } from "@/lib/questionText";

type Card = {
  title: string;
  source?: string;
  memo?: string;
  mnemonic?: string;
};

/** 같은 문제로 묶인 출제 — 대표 지문과 나온 곳들 */
export type MemoQuestion = {
  /** 대표 지문(기출이 있으면 기출, 아니면 가장 최근) */
  text: string;
  /** 나온 횟수 */
  n: number;
  /** 나온 곳 — 「기출 140회 1교시」「NS 19기 8주차 2교시」「ITPE 모의고사 2026.10 1교시」(최근 순) */
  where: string[];
  /** 서술형(2~4교시)으로 나온 적이 있는가 */
  long: boolean;
  /** 기술사 기출이 섞여 있는가 */
  past: boolean;
};

export type MemoCard = {
  title: string;
  /** 교재 키워드 두음(교재에 적힌 것만) */
  mnemonic: string;
  memo: string;
  /** 손글씨 개념도(없으면 빈칸) */
  hand: string[];
  /** 출제 수 — 1교시 / 서술형 */
  short: number;
  long: number;
  /** 자주 나온 문제(많이 나온 순, 같으면 기출 먼저·최근 먼저) */
  questions: MemoQuestion[];
};

const CARD = new Map<string, Card>();
for (const c of flashcards as Card[]) if (c.source === "심화반" && !CARD.has(c.title)) CARD.set(c.title, c);

const cache = new Map<string, MemoCard>();

type App = { text: string; where: string; long: boolean; past: boolean; when: number };

const isLong = (p: string) => /[234]\s*교시/.test(p);

export function memoCardFor(title: string): MemoCard {
  const hit = cache.get(title);
  if (hit) return hit;
  const c = CARD.get(title);
  const apps: App[] = [];
  for (const p of pastExams(title)) {
    // 회차 → 대략 연·월(140회 = 2026.07, 한 해 3회) — 모의·NS 날짜와 같은 자로 최근 순을 매긴다
    const months = Math.round((p.round - 140) * 4);
    const y = 2026 + Math.floor((6 + months) / 12);
    const mo = ((6 + months) % 12 + 12) % 12 + 1;
    apps.push({ text: p.text, where: `${p.track === "컴시응" ? "컴시응 " : "기출 "}${p.round}회 ${p.period}`, long: isLong(p.period), past: true, when: y * 100 + mo });
  }
  for (const h of examHistory(title)) {
    const when = Number((h.date || "").replace(/-/g, "").slice(0, 6)) || 0;
    apps.push({ text: h.text, where: `NS ${h.cohort} ${h.round.replace(/^0/, "")} ${h.period}`.replace(/\s+/g, " "), long: isLong(h.period), past: false, when });
  }
  for (const m of mockExams(title)) {
    const long = isLong(m.source) || (!/1\s*교시/.test(m.source) && m.text.length > 80);
    apps.push({ text: m.text, where: m.source, long, past: false, when: yearMonth(m.source) || 0 });
  }
  // 같은 문제끼리 묶는다(문구 정규화·소문항·약어 규칙은 questionText 한 곳)
  const groups: { apps: App[] }[] = [];
  for (const a of apps) {
    const g = groups.find((x) => x.apps.some((b) => b.text === a.text || sameQuestionText(a.text, b.text)));
    if (g) g.apps.push(a);
    else groups.push({ apps: [a] });
  }
  const questions: MemoQuestion[] = groups
    .map((g) => {
      // 대표 지문: 기출 → 띄어쓰기가 멀쩡한 것(OCR 로 공백이 다 빠진 지문은 뒤로) → 최근
      const spaced = (t: string) => (t.length / ((t.match(/\s/g)?.length ?? 0) + 1) < 12 ? 1 : 0);
      const sorted = g.apps.slice().sort((a, b) => Number(b.past) - Number(a.past) || spaced(b.text) - spaced(a.text) || b.when - a.when);
      return {
        text: sorted[0].text,
        n: g.apps.length,
        where: sorted.map((a) => a.where),
        long: g.apps.some((a) => a.long),
        past: g.apps.some((a) => a.past),
        when: Math.max(...g.apps.map((a) => a.when)),
      };
    })
    .sort((a, b) => b.n - a.n || Number(b.past) - Number(a.past) || b.when - a.when)
    .map(({ when: _w, ...q }) => q);
  const out: MemoCard = {
    title,
    mnemonic: c?.mnemonic || "",
    memo: c?.memo || "",
    hand: handDiagramsFor(title),
    short: apps.filter((a) => !a.long).length,
    long: apps.filter((a) => a.long).length,
    questions,
  };
  cache.set(title, out);
  return out;
}
