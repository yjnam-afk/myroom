/**
 * 암기 카드 — 정리표·지하철이 토픽 하나를 같은 틀로 보여 준다(2026-11-09 "답안지를 암기할만한 모든 수단을 다 활용해야 한다").
 *   1. 정의(두음)  2. 개념도(손글씨가 있으면)  2'. 목차 — 답안지에서 가장 잘 쓰이는 차례(교재 표 캡션 → 1열 항목, 빈출 순)
 *   3. 돌려막기 — 같은 틀로 3단락까지 같이 쓸 수 있는 묶음 토픽·3단락 유형·대상
 * 예) 교착상태: 정의 → 필요조건(상호배제·점유 대기·비선점·환형 대기) → 해결 방안(예방·회피·발견·회복) → 기아현상과 비교
 */
import flashcards from "@/data/flashcards.json";
import { handDiagramsFor } from "@/data/handDiagrams";
import { FRAME_BY_CODE, PARA_BY_NAME, frameOf, familyOf } from "@/data/answerFrames";
import { examHistory, pastExams, mockExams } from "@/lib/examHistory";
import { askFreq, longFormTexts } from "@/lib/askFreq";

type Card = {
  title: string;
  source?: string;
  defShort?: string;
  definition?: string;
  memo?: string;
  mnemonic?: string;
  sections?: { label: string; mnemonic: string; keywords: string[] }[];
};

export type MemoToc = {
  label: string;
  items: string[];
  mnemonic: string;
  /** 서술형 지문에서 이 차례를 요구한 횟수(0이면 교재 표 순서대로 뒤에) */
  asked: number;
};

export type MemoFrame = {
  group: string;
  groupName: string;
  type: string;
  typeTitle: string;
  target: string;
  pair: string;
  family: string;
  members: string[];
  slot: string;
};

export type MemoCard = {
  title: string;
  /** 교재 키워드 두음(교재에 적힌 것만) */
  mnemonic: string;
  memo: string;
  hand: string[];
  toc: MemoToc[];
  frame?: MemoFrame;
};

const CARD = new Map<string, Card>();
for (const c of flashcards as Card[]) if (c.source === "심화반" && !CARD.has(c.title)) CARD.set(c.title, c);

const squeeze = (x: string) => x.replace(/\([^)]*\)/g, "").replace(/[\s.,·:'"“”‘’\-/]/g, "").toLowerCase();

const cache = new Map<string, MemoCard>();

export function memoCardFor(title: string): MemoCard {
  const hit = cache.get(title);
  if (hit) return hit;
  const c = CARD.get(title);
  // 빈출 차례 — 서술형 지문(기출·NS·모의)의 「가. 나. 다.」 요구를 세어 교재 표 캡션과 맞춘다
  const texts = longFormTexts({ hist: examHistory(title), past: pastExams(title), mock: mockExams(title) });
  const freq = texts.length ? askFreq(texts, title) : null;
  const asked = (label: string) => {
    if (!freq) return 0;
    const k = squeeze(label);
    if (k.length < 2) return 0;
    let n = 0;
    for (const it of freq.items) {
      const ks = [it.label, ...it.variants].map(squeeze);
      if (ks.some((x) => x.includes(k) || (k.length >= 4 && k.includes(x) && x.length >= 3))) n += it.n;
    }
    return n;
  };
  const toc: MemoToc[] = (c?.sections ?? [])
    .filter((s) => s.label && s.label !== "교재 키워드" && s.keywords.length)
    .map((s) => ({ label: s.label, items: s.keywords, mnemonic: s.mnemonic || "", asked: asked(s.label) }));
  // 빈출 순(요구 횟수 많은 차례 먼저), 같으면 교재 순서
  const order = toc.map((t, i) => i);
  order.sort((a, b) => toc[b].asked - toc[a].asked || a - b);
  const f = frameOf(title);
  const frame: MemoFrame | undefined = f
    ? {
        group: f.group,
        groupName: FRAME_BY_CODE[f.group].name,
        type: f.type,
        typeTitle: PARA_BY_NAME[f.type]?.title ?? f.type,
        target: f.target,
        pair: f.pair,
        family: f.family,
        members: familyOf(title),
        slot: f.slot,
      }
    : undefined;
  const out: MemoCard = {
    title,
    mnemonic: c?.mnemonic || "",
    memo: c?.memo || "",
    hand: handDiagramsFor(title),
    toc: order.map((i) => toc[i]),
    frame,
  };
  cache.set(title, out);
  return out;
}
