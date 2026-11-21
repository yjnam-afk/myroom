/**
 * 도메인별 토픽 정리표(/sheet)의 자료 — explainData.ts 에서 떼어 냈다. 서버에서만 읽는다.
 */
import "server-only";
import { answerSheetFor } from "@/data/answerSheets";
import { examHistory, pastExams } from "@/lib/examHistory";
import { memoCardFor, type MemoCard } from "@/lib/memoCard";
import { coTopics, clusterTitles, sharedQuestions, clusterPairs, clusterQuestions, type TiedQuestion } from "@/lib/topicCo";
import { DOMAINS } from "@/lib/domains";
import { courseOf, courseSubnotesInOrder } from "@/lib/courseOrder";
import { importanceMaps, impOf } from "@/lib/explainShared";

// ── 도메인별 토픽 정리표(/sheet) — 엑셀로 정리하던 것을 앱 한 페이지에서 본다 ──
export type SheetRow = {
  title: string;
  /** 상·중·하 — 예전 토픽(topics.json)과 맞으면 그 값, 교재 전용 토픽은 '상' */
  imp: string;
  lead?: string;
  /** 29~30자 정의. 비교 토픽은 pairs 로 대신 채운다 */
  def?: string;
  pairs: { name: string; def: string }[];
  features: string[];
  keywords: string[];
  /** 본론 3단표 전체 — 서브노트 표를 그대로(캡션·헤더·행) */
  tables: { caption: string; headers: string[]; rows: string[][] }[];
  /** 플러스 알파 메모 */
  notes: string[];
  /** NS 모의고사 출제 횟수 / 기술사 기출 횟수 */
  ns: number;
  past: number;
  /** 가장 최근 출제 표기(예: 19기 2주차 1교시 5번) */
  last?: string;
  /** 암기 카드 — 두음·손글씨 개념도·자주 나오는 문제(정리표 압축 보기, 2026-11-09) */
  memo: MemoCard;
  /** 같은 문항에 함께 나온 토픽(많은 순, 위 6개). same = 같은 과목 */
  co: { title: string; n: number; same: boolean }[];
  /** 함께 출제 묶음 번호(과목 안) — 묶음 멤버는 정리표에서 붙어 나온다 */
  cluster?: number;
};
/** 함께 출제 묶음 — 과목 안에서 2문항 이상 같이 나온 토픽끼리(최대 6개) */
export type SheetCluster = {
  id: number;
  members: string[];
  shared: number;
  /** 엮이는 짝(같이 나온 문항 수 많은 순) */
  pairs: { a: string; b: string; n: number }[];
  /** 어떻게 엮여 나왔나 — 멤버 둘 이상을 함께 물은 실제 문제(많이 나온 순, 위 4개) */
  tied: TiedQuestion[];
  /** tied 에 다 못 실은 나머지 문제 수 */
  more: number;
};
export type SheetGroup = { code: string; label: string; week: number; rows: SheetRow[]; clusters: SheetCluster[] };

export function buildSheet(): SheetGroup[] {
  const { impById, impByBare } = importanceMaps();
  const byCourse = new Map<string, SheetRow[]>();
  // 학습계획 순서 — 정리표·토픽 설명·계획이 같은 줄 순서여야 번호로 찾기 쉽다.
  const ordered = DOMAINS.flatMap((d) => courseSubnotesInOrder(d.code));
  for (const s of ordered) {
    const hist = examHistory(s.title);
    const past = pastExams(s.title);
    const latest = hist.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    const row: SheetRow = {
      title: s.title,
      imp: impOf(s, impById, impByBare),
      lead: s.lead,
      def: s.defPair?.length ? undefined : s.defShort,
      pairs: [...(s.defPair || []), ...(s.subDefs || [])].map((p) => ({ name: p.name, def: p.def })),
      features: s.features || [],
      keywords: s.keywords,
      // 답안용 표가 있으면 그것(1교시 분량 3단표), 없으면 교재 표 전체 — 2026-10-11 "정리 3단표는 저게 아닌데"
      tables: (answerSheetFor(s.title)?.tables ?? s.tables).map((t) => ({ caption: t.caption, headers: t.headers, rows: t.rows })),
      notes: s.notes || [],
      ns: hist.length,
      past: past.length,
      last: latest
        ? `${latest.cohort} ${latest.round.replace(/^0/, "")} ${latest.period}`
        : past.length
          ? `${Math.max(...past.map((p) => p.round))}회`
          : undefined,
      memo: memoCardFor(s.title),
      co: [],
    };
    const c = courseOf(s);
    if (!byCourse.has(c)) byCourse.set(c, []);
    byCourse.get(c)!.push(row);
  }
  const courseByTitle = new Map<string, string>();
  for (const [c, rows] of byCourse) for (const r of rows) courseByTitle.set(r.title, c);
  return DOMAINS.filter((d) => byCourse.has(d.code)).map((d) => {
    const rows = byCourse.get(d.code)!;
    for (const r of rows) {
      r.co = coTopics(r.title)
        .slice(0, 6)
        .map((x) => ({ title: x.title, n: x.n, same: courseByTitle.get(x.title) === d.code }));
    }
    // 함께 출제 묶음 — 2문항 이상 같이 나온 짝으로 잇고, 묶음 멤버는 첫 멤버 자리에 붙여 둔다(2026-11-10 "자주 엮어서 나오는 애들끼리 그루핑")
    const clusters: SheetCluster[] = clusterTitles(
      rows.map((r) => r.title),
      2,
      6,
    ).map((members, i) => {
      const tied = clusterQuestions(members);
      return { id: i, members, shared: sharedQuestions(members), pairs: clusterPairs(members).slice(0, 6), tied: tied.slice(0, 4), more: Math.max(0, tied.length - 4) };
    });
    const byTitle = new Map(rows.map((r) => [r.title, r]));
    const clusterOf = new Map<string, SheetCluster>();
    for (const cl of clusters) for (const m of cl.members) clusterOf.set(m, cl);
    const ordered: SheetRow[] = [];
    const done = new Set<string>();
    for (const r of rows) {
      if (done.has(r.title)) continue;
      const cl = clusterOf.get(r.title);
      if (!cl) {
        ordered.push(r);
        done.add(r.title);
        continue;
      }
      for (const m of cl.members) {
        const row = byTitle.get(m)!;
        row.cluster = cl.id;
        ordered.push(row);
        done.add(m);
      }
    }
    return { code: d.code, label: d.label, week: d.week, rows: ordered, clusters };
  });
}
