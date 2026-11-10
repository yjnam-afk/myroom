/**
 * 함께 출제되는 토픽 — 같은 문항에 같이 걸리는 교재 토픽끼리 센다(2026-11-10 "자주 엮어서 나오는 애들끼리 그루핑").
 *   예) 교착상태 ↔ 은행가 알고리즘 16문항, CAP·BASE ↔ NoSQL 18, FMEA ↔ FTA 14, IPSec ↔ VPN 11
 * 문항에 걸리는 토픽은 examHistory 의 제목 열쇠(questionIdsForTitle)로 찾는다 — 토픽 화면 출제 이력과 같은 기준.
 * 정리표는 과목 안에서 2문항 이상 같이 나온 토픽을 한 묶음(최대 6개)으로 붙여 보이고, 토픽마다 함께 나온 토픽 칩을 단다.
 * 빌드 때 한 번 센다(서버 전용).
 */
import "server-only";
import flashcards from "@/data/flashcards.json";
import questions from "@/data/questions.json";
import { questionIdsForTitle } from "@/lib/examHistory";
import { sameQuestionText, yearMonth } from "@/lib/questionText";

type Q = { id: string; kind?: string; source?: string; cohort?: string; round?: string; date?: string; period?: string; text: string };
const Q_BY_ID = new Map((questions as Q[]).map((q) => [q.id, q]));

/** 문항이 나온 곳 — 「기출 124회 3교시」「NS 15기 2주차 2교시」「ITPE 모의고사 2021.10 4교시」 */
function whereOf(q: Q): { where: string; when: number; past: boolean } {
  const m = /^([kc])(\d+)-/.exec(q.id);
  if (m) {
    const round = Number(m[2]);
    const months = Math.round((round - 140) * 4);
    const y = 2026 + Math.floor((6 + months) / 12);
    const mo = (((6 + months) % 12) + 12) % 12 + 1;
    return { where: `${m[1] === "c" ? "컴시응" : "기출"} ${round}회 ${q.period ?? ""}`.trim(), when: y * 100 + mo, past: true };
  }
  if (q.kind === "NS모의") {
    const when = Number((q.date || "").replace(/-/g, "").slice(0, 6)) || 0;
    return { where: `NS ${q.cohort ?? ""} ${(q.round ?? "").replace(/^0/, "")} ${q.period ?? ""}`.replace(/\s+/g, " ").trim(), when, past: false };
  }
  const src = q.source || q.round || "";
  return { where: src, when: yearMonth(src) || 0, past: false };
}

const TITLES: string[] = Array.from(new Set((flashcards as { title: string; source?: string }[]).filter((c) => c.source === "심화반").map((c) => c.title)));

let built = false;
/** 문항 id → 걸린 토픽들 */
const BY_Q = new Map<string, string[]>();
/** 토픽 → (토픽 → 같이 나온 문항 수) */
const CO = new Map<string, Map<string, number>>();

function build() {
  if (built) return;
  built = true;
  for (const t of TITLES) {
    for (const id of questionIdsForTitle(t)) {
      if (!BY_Q.has(id)) BY_Q.set(id, []);
      BY_Q.get(id)!.push(t);
    }
  }
  for (const ts of BY_Q.values()) {
    // 한 문항에 토픽이 너무 많이 걸리면(넓은 열쇠) 짝으로 세지 않는다
    if (ts.length < 2 || ts.length > 8) continue;
    for (const a of ts)
      for (const b of ts) {
        if (a === b) continue;
        if (!CO.has(a)) CO.set(a, new Map());
        const m = CO.get(a)!;
        m.set(b, (m.get(b) ?? 0) + 1);
      }
  }
}

export type CoTopic = { title: string; n: number };

/** 이 토픽과 같은 문항에 나온 토픽(많은 순) */
export function coTopics(title: string): CoTopic[] {
  build();
  const m = CO.get(title);
  if (!m) return [];
  return [...m.entries()]
    .map(([t, n]) => ({ title: t, n }))
    .sort((a, b) => b.n - a.n || a.title.localeCompare(b.title, "ko"));
}

/** 두 토픽이 같이 나온 문항 수 */
export function coCount(a: string, b: string): number {
  build();
  return CO.get(a)?.get(b) ?? 0;
}

/**
 * 토픽 목록을 「같이 나온 문항 minN 개 이상」인 짝으로 이어 묶는다(센 짝부터, 묶음 크기 cap 까지).
 * 결과는 입력 순서(첫 멤버 위치)로 정렬, 멤버도 입력 순서.
 */
export function clusterTitles(titles: string[], minN = 2, cap = 6): string[][] {
  build();
  const idx = new Map(titles.map((t, i) => [t, i]));
  const parent = new Map(titles.map((t) => [t, t]));
  const size = new Map(titles.map((t) => [t, 1]));
  const find = (x: string): string => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r)!;
    let c = x;
    while (parent.get(c) !== r) {
      const nx = parent.get(c)!;
      parent.set(c, r);
      c = nx;
    }
    return r;
  };
  const edges: { a: string; b: string; n: number }[] = [];
  for (const a of titles) {
    const m = CO.get(a);
    if (!m) continue;
    for (const [b, n] of m) if (n >= minN && idx.has(b) && a < b) edges.push({ a, b, n });
  }
  edges.sort((x, y) => y.n - x.n);
  for (const e of edges) {
    const ra = find(e.a);
    const rb = find(e.b);
    if (ra === rb) continue;
    if (size.get(ra)! + size.get(rb)! > cap) continue;
    parent.set(rb, ra);
    size.set(ra, size.get(ra)! + size.get(rb)!);
  }
  const groups = new Map<string, string[]>();
  for (const t of titles) {
    const r = find(t);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(t);
  }
  return [...groups.values()]
    .filter((g) => g.length >= 2)
    .map((g) => g.sort((a, b) => idx.get(a)! - idx.get(b)!))
    .sort((a, b) => idx.get(a[0])! - idx.get(b[0])!);
}

/** 묶음 멤버가 2개 이상 같이 걸린 문항 수 */
export function sharedQuestions(members: string[]): number {
  build();
  const set = new Set(members);
  let n = 0;
  for (const ts of BY_Q.values()) {
    if (ts.length > 8) continue;
    let k = 0;
    for (const t of ts) if (set.has(t) && ++k >= 2) break;
    if (k >= 2) n++;
  }
  return n;
}

/** 묶음 안에서 엮이는 짝 — 같이 나온 문항 수 많은 순 */
export function clusterPairs(members: string[], minN = 2): { a: string; b: string; n: number }[] {
  build();
  const out: { a: string; b: string; n: number }[] = [];
  for (let i = 0; i < members.length; i++)
    for (let j = i + 1; j < members.length; j++) {
      const n = CO.get(members[i])?.get(members[j]) ?? 0;
      if (n >= minN) out.push({ a: members[i], b: members[j], n });
    }
  return out.sort((x, y) => y.n - x.n);
}

/** 엮여 나온 문제 — 묶음 멤버 둘 이상을 함께 물은 실제 지문(같은 문제끼리 묶어 많이 나온 순) */
export type TiedQuestion = {
  text: string;
  n: number;
  /** 이 문제에 걸린 묶음 멤버(묶음 순서) */
  topics: string[];
  /** 나온 곳(기출 먼저·최근 순) */
  where: string[];
};

export function clusterQuestions(members: string[]): TiedQuestion[] {
  build();
  const set = new Set(members);
  type App = { text: string; topics: string[]; where: string; when: number; past: boolean };
  const apps: App[] = [];
  for (const [id, ts] of BY_Q) {
    if (ts.length > 8) continue;
    const mine = ts.filter((t) => set.has(t));
    if (mine.length < 2) continue;
    const q = Q_BY_ID.get(id);
    if (!q) continue;
    apps.push({ text: q.text, topics: mine, ...whereOf(q) });
  }
  const groups: App[][] = [];
  for (const a of apps) {
    const g = groups.find((x) => x.some((b) => b.text === a.text || sameQuestionText(a.text, b.text)));
    if (g) g.push(a);
    else groups.push([a]);
  }
  const spaced = (t: string) => (t.length / ((t.match(/\s/g)?.length ?? 0) + 1) < 12 ? 1 : 0);
  return groups
    .map((g) => {
      const sorted = g.slice().sort((a, b) => Number(b.past) - Number(a.past) || spaced(b.text) - spaced(a.text) || b.when - a.when);
      const topics = members.filter((m) => g.some((a) => a.topics.includes(m)));
      return { text: sorted[0].text, n: g.length, topics, where: sorted.map((a) => a.where), past: g.some((a) => a.past), when: Math.max(...g.map((a) => a.when)) };
    })
    .sort((a, b) => b.n - a.n || b.topics.length - a.topics.length || Number(b.past) - Number(a.past) || b.when - a.when)
    .map(({ past: _p, when: _w, ...q }) => q);
}
