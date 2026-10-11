"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import topics from "@/data/topics.json";
import { compareSets } from "@/data/compareSets";
import { memoryTables } from "@/data/memoryTables";
import {
  SUBNOTES,
  subnoteByTitle,
  subnoteByAlias,
  subnoteByTopicId,
} from "@/data/textbookSubnotes";
import { DOMAIN_LABEL, domainLabel, sortDomains } from "@/lib/domains";
import { COURSE_TOPICS } from "@/data/curriculum";
import { TOPIC_CLUSTERS } from "@/data/topicClusters";
import type { TextbookSubnote } from "@/data/textbookSubnotes";
import { planInfo, LEVEL_STYLE, LEVEL_HINT, levelOrder } from "@/lib/studyPlan";
import SourceBadge from "@/components/SourceBadge";
import { matchSubnoteTitle, findSubnoteByContent } from "@/lib/matchSubnote";
import { topicForConcept } from "@/lib/relatedTopics";

type Topic = {
  id: string;
  title: string;
  category: string;
  group: string;
  importance: string;
  summary: string;
  source?: string;
  /** 커리큘럼에 적어 둔 학습 레벨(암기·숙지·점검·참고) — 없을 수 있다. */
  level?: string;
  /** 왜 그 레벨인지 한 줄 메모 */
  levelNote?: string;
};

// ── 심화반 서브노트를 토픽지도에 통합 ─────────────────────────────────
// topics.json(기존 8도메인)에 없는 심화반 토픽 389+개를 과목별 도메인으로 합친다.
// 컴퓨터구조·운영체제·확률통계·자료구조·알고리즘은 새 도메인으로 생긴다.
// 과목 이름·순서는 lib/domains 한 곳에서만 정한다.
const COURSE_CAT = DOMAIN_LABEL;
// 교재에 같은 토픽이 있는 예전 항목은 빼고(아래 ALL), 교재 것만 남긴다.
// ★중복 판정 기준은 "남은 예전 토픽"이어야 한다★ — 전체 topics 로 비교하면
// 이미 제외된 예전 토픽과 제목이 같다는 이유로 교재 서브노트까지 빠져
// 지도에서 그 토픽이 통째로 사라진다(파이프라인·교착상태 등 94개).
const LEGACY_KEPT: Topic[] = (topics as Topic[]).filter(
  (t) => !subnoteByAlias(t.id, t.title),
);
const KNOWN = new Set(LEGACY_KEPT.map((t) => t.title));
const SUBNOTE_TOPICS: Topic[] = SUBNOTES.filter((s) => !KNOWN.has(s.title)).map(
  (s, i) => {
    const cat = COURSE_CAT[s.course] || s.course;
    const p = planInfo(s.title, s.topicId);
    return {
      id: `sn-${i}`,
      title: s.title,
      category: cat,
      group: `심화반 ${cat} 서브노트`,
      importance: p?.priority || "중",
      summary: s.defShort || "",
      source: "심화반",
      level: p?.level,
      levelNote: p?.note,
    };
  },
);

// 예전 토픽도 과목 이름을 정식 이름으로 맞추고, 커리큘럼에 있으면 레벨을 붙인다.
// (이름을 안 맞추면 "SW공학"처럼 같은 과목이 칩 두 개로 갈라진다.)
const withPlan = (t: Topic): Topic => {
  const p = planInfo(t.title);
  return {
    ...t,
    category: domainLabel(t.category),
    level: t.level ?? p?.level,
    levelNote: t.levelNote ?? p?.note,
  };
};
// 예전(기필반) 토픽은 회독 진도가 걸려 있어 지우지 않고 「예전 토픽 묶음」 탭에 둔다 —
// 교재와 표기가 달라 헷갈리게 했다. 교재 토픽은 토픽 탭(TOPICS_BY_CAT)이 교재 순서로 보여 준다.
const LEGACY_TOPICS: Topic[] = LEGACY_KEPT.map(withPlan);
const ALL: Topic[] = [...LEGACY_KEPT, ...SUBNOTE_TOPICS].map(withPlan);
// 분류 칩 순서는 데이터 분포가 아니라 심화반 커리큘럼 진행 순서를 따른다.
// 예전엔 topics.json 등장 순서라, topics.json 에 아예 없는 운영체제·컴퓨터구조·
// 알고리즘·자료구조가 맨 뒤로 밀려 화면 밖으로 나갔다(1주차 과목인데도).
const CATS = sortDomains(Array.from(new Set(ALL.map((t) => t.category))));

// ── 토픽 탭 — 과목마다 교재 CONTENTS 순서 그대로 ─────────────────────
// 2026-10-11 "토픽 지도가 왜 토픽 위주가 아니지?" — 지도가 비교 세트(서브노트 표를 자른 것)로
// 열리고, 토픽은 맨 끝 탭에서 가나다순 한 묶음이었다. 이제 토픽이 첫 탭이고 교재 목차 순서로
// 늘어놓으며, 토픽을 펼치면 그 토픽의 표와 이어진 토픽(표 안에 서로 나오는 것)이 보인다.
type MapTopic = {
  title: string;
  priority?: string;
  level?: string;
  note?: string;
  summary: string;
  /** 교재 서브노트 — 없으면 CONTENTS 에만 있고 아직 정리 전 */
  sub?: TextbookSubnote;
  /** 지도 영역(TOPIC_CLUSTERS) */
  area: string;
};
const TOPICS_BY_CAT: Record<string, MapTopic[]> = (() => {
  const out: Record<string, MapTopic[]> = {};
  const used = new Set<string>();
  for (const [code, label] of Object.entries(DOMAIN_LABEL)) {
    const list: MapTopic[] = [];
    const clusters = TOPIC_CLUSTERS[code] ?? [];
    let ci = -1;
    const sq = (x: string) => x.replace(/\s+/g, "").toLowerCase();
    for (const t of COURSE_TOPICS[code] ?? []) {
      while (ci + 1 < clusters.length && sq(t.title).startsWith(sq(clusters[ci + 1][1]))) ci++;
      const area = clusters[Math.max(ci, 0)]?.[0] ?? label;
      const sub = subnoteByTopicId(t.topicId) || subnoteByTitle(t.title);
      // CONTENTS 가 같은 토픽을 두 번 적은 곳(인공지능 튜링 테스트 등)은 한 번만
      if (sub && list.some((x) => x.sub === sub)) continue;
      if (sub) used.add(sub.title);
      list.push({
        title: sub?.title ?? t.title,
        priority: t.priority,
        level: t.level,
        note: t.note,
        summary: sub?.defShort ?? "",
        sub,
        area,
      });
    }
    out[label] = list;
  }
  // CONTENTS 에 없는 서브노트(다른 과목 교재에서 옮긴 것·디지털서비스)는 과목 맨 뒤
  for (const sub of SUBNOTES) {
    if (used.has(sub.title)) continue;
    const label = DOMAIN_LABEL[sub.course] || sub.course;
    const p = planInfo(sub.title, sub.topicId);
    (out[label] ??= []).push({
      title: sub.title,
      priority: p?.priority,
      level: p?.level,
      note: p?.note,
      summary: sub.defShort || "",
      sub,
      area: COURSE_TOPICS[sub.course] ? "다른 교재·CONTENTS 밖" : label,
    });
  }
  return out;
})();
const ALL_MAP_TOPICS: { cat: string; t: MapTopic }[] = Object.entries(TOPICS_BY_CAT).flatMap(
  ([cat, list]) => list.map((t) => ({ cat, t })),
);

const nk = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
/**
 * 토픽끼리 잇는 선 — 표 안에 서로 나오는 토픽.
 * ① 이 토픽의 표 항목이 다른 서브노트 제목이면(OSI 7 Layer 표의 「TCP」류) 아래로 잇고,
 * ② 다른 토픽의 표 항목에 이 토픽이 나오면 위로 잇는다.
 */
function linksOf(title: string): string[] {
  const bareK = (x: string) => nk(x.replace(/\s*[(（][^)）]*[)）]/g, ""));
  const k = nk(title);
  const kb = bareK(title);
  const out: string[] = [];
  const add = (x?: string) => {
    if (x && nk(x) !== k && !out.includes(x)) out.push(x);
  };
  for (const set of compareSets) {
    if (set.ref && nk(set.ref) === k) {
      for (const it of set.items) {
        const hit = subnoteByTitle(it.name);
        if (hit && (nk(hit.title) === nk(it.name) || bareK(hit.title) === bareK(it.name))) add(hit.title);
      }
    } else if (set.items.some((it) => nk(it.name) === k || (kb.length >= 2 && bareK(it.name) === kb))) {
      add(set.ref);
    }
  }
  return out.slice(0, 8);
}

const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

const IMP_BADGE: Record<string, string> = {
  상: "border-amber-300 bg-amber-50 text-amber-700",
  중: "border-slate-200 bg-slate-50 text-slate-600",
  하: "border-slate-200 bg-white text-slate-400",
  출제예상: "border-brand-200 bg-brand-50 text-brand-600",
};

/** 한 묶음(group)에 속한 토픽들을 중요도 순으로 정렬해 반환 */
function groupsOf(items: Topic[]): { name: string; items: Topic[] }[] {
  const byGroup = new Map<string, Topic[]>();
  for (const t of items) {
    const key = t.group || "(기타)";
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(t);
  }
  return Array.from(byGroup.entries())
    .map(([name, list]) => ({
      name,
      items: list
        .slice()
        // 학습계획에 레벨을 매긴 토픽이 먼저 온다(암기 → 숙지 → 점검 → 참고).
        // 레벨은 "지금 급한 것"이라 교재 중요도보다 앞선다.
        .sort(
          (a, b) =>
            levelOrder(a.level as never) - levelOrder(b.level as never) ||
            (IMP_ORDER[a.importance] ?? 9) - (IMP_ORDER[b.importance] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    }))
    // 토픽 많은 묶음(핵심 클러스터)을 먼저, 같으면 이름순
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, "ko"));
}

// 비교·암기표 탭의 분류도 토픽 탭과 같은 커리큘럼 순서로 둔다.
// 세 탭이 서로 다른 순서로 깔리면 같은 화면에서 과목을 찾는 눈이 매번 다시 헤맨다.
const CMP_CATS = sortDomains(Array.from(new Set(compareSets.map((s) => s.category))));
const TBL_CATS = sortDomains(Array.from(new Set(memoryTables.map((t) => t.category))));
// 묶음 이름의 개행·중복공백 정규화(표시용) — 데이터엔 "병행 제어\n(...)" 같은 값이 섞여 있다.
const cleanGroup = (name: string) => name.replace(/\s+/g, " ").trim();
// 토픽지도 → 설명 링크는 AI 자동 생성(auto=1) 없이 연다.
// 답안지 템플릿·교재 서브노트는 AI 없이 즉시 뜨고, AI 설명은 필요할 때만 버튼으로.
// 비교 세트 항목명("혼돈(Confusion)" 등)은 서브노트 제목과 다를 수 있어,
// 느슨 매칭으로 답안 템플릿이 있는 제목으로 바꿔 연다(없으면 이름 그대로).
const explainHref = (name: string, parent?: string) => {
  const resolved =
    subnoteByTitle(name)?.title ||
    matchSubnoteTitle(name) ||
    findSubnoteByContent(name) ||
    // 항목명이 토픽 제목의 일부이거나 표기가 다른 경우(하이퍼바이저 → 가상화…)
    topicForConcept(name) ||
    // 하위 개념(SISD·1NF·빅뱅 통합 등)은 자기 토픽이 없다 — 묶음(부모) 토픽으로 보낸다.
    (parent
      ? subnoteByTitle(parent)?.title ||
        matchSubnoteTitle(parent) ||
        findSubnoteByContent(parent) ||
        topicForConcept(parent)
      : undefined) ||
    name;
  return `/explain?topic=${encodeURIComponent(resolved)}`;
};
// 표 1열처럼 "이름 칸"에 링크를 걸 수 있는지 — 구분선(│)·정도 표기(약/강)는 제외.
const isLinkableName = (s: string) =>
  (s || "").replace(/[^0-9A-Za-z가-힣]/g, "").length >= 2;

// 비교 항목이 어디로든(교재 템플릿·예전 토픽 자료) 연결되는지 — 아니면 링크를 안 건다.
const TOPIC_TITLE_SET = (() => {
  const s = new Set<string>();
  for (const t of topics as Topic[]) {
    s.add(t.title.trim().toLowerCase().replace(/[\s()·,\-_/]/g, ""));
  }
  return s;
})();
const hasAnyData = (name: string, parent?: string): boolean =>
  !!(
    subnoteByTitle(name)?.title ||
    matchSubnoteTitle(name) ||
    findSubnoteByContent(name) ||
    TOPIC_TITLE_SET.has(name.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "")) ||
    topicForConcept(name) ||
    (parent ? hasAnyData(parent) : false)
  );

/** 토픽별 출제·답안 수 — 서버(page.tsx)가 센다 */
export type TopicStat = { past: number; ns: number; mock: number; ans: number; com: number };

export default function MapClient({ stats }: { stats: Record<string, TopicStat> }) {
  const [view, setView] = useState<"map" | "compare" | "tables" | "groups">("map");
  const [cat, setCat] = useState(CATS[0]);
  const [legacy, setLegacy] = useState(false);
  // 묶음 탭은 이제 예전(기필반) 토픽만 — 교재 토픽은 토픽 탭이 교재 순서로 보여 준다.
  const pool = legacy ? ALL : LEGACY_TOPICS;
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const query = q.trim().toLowerCase();
  const searching = query.length > 0;

  // 비교 세트: 검색 중이면 전 분류에서 매칭, 아니면 전체(카드에 분류 배지 표시)
  const cmpResults = useMemo(() => {
    if (!searching) return compareSets;
    return compareSets.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.axis.toLowerCase().includes(query) ||
        s.items.some((it) => it.name.toLowerCase().includes(query)),
    );
  }, [query, searching]);

  // 암기표: 제목·설명·표 내용에서 매칭
  const tblResults = useMemo(() => {
    if (!searching) return memoryTables;
    return memoryTables.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.intro.toLowerCase().includes(query) ||
        t.rows.some((r) => r.join(" ").toLowerCase().includes(query)),
    );
  }, [query, searching]);

  // 검색 중이면 전 분류에서 제목/요약 매칭, 아니면 선택 분류 전체
  const scope = useMemo(() => {
    if (!searching) return pool.filter((t) => t.category === cat);
    return pool.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.summary || "").toLowerCase().includes(query) ||
        (t.group || "").toLowerCase().includes(query),
    );
  }, [cat, query, searching, pool]);

  const groups = useMemo(() => groupsOf(scope), [scope]);

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        title="🗺️ 토픽 지도"
        desc="과목 하나를 영역별로 한 장에 펼칩니다 — 색은 중요도나 출제 빈도, 토픽을 누르면 이어진 토픽이 함께 켜집니다. 토픽 하나를 자세히 보려면 토픽 설명으로 갑니다."
      />

      {/* 뷰 전환 */}
      <div className="mb-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        {[
          { k: "map" as const, label: "🗺️ 지도" },
          { k: "compare" as const, label: "⚖️ 비교하며 외우기" },
          { k: "tables" as const, label: "📋 암기표" },
          { k: "groups" as const, label: "🗂️ 예전 토픽 묶음" },
        ].map((v) => (
          <button
            key={v.k}
            onClick={() => setView(v.k)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              view === v.k
                ? "bg-white text-brand-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            view === "map"
              ? "지도에서 토픽 찾기… (예: TCP, 정규화, 해시)"
              : view === "compare"
              ? "비교 세트 검색… (예: 정규화, 대칭키, OSI, 학습)"
              : view === "tables"
                ? "암기표 검색… (예: 정렬, OSI, 정규형, RAID)"
                : "토픽·요약·묶음 검색… (예: 정규화, 감리, TCP)"
          }
          className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {view === "map" ? (
        <MapView query={query} stats={stats} />
      ) : view === "compare" ? (
        <CompareView cmpResults={cmpResults} q={q} searching={searching} />
      ) : view === "tables" ? (
        <TablesView tblResults={tblResults} q={q} searching={searching} />
      ) : (
        <GroupsView
          pool={pool}
          legacy={legacy}
          setLegacy={setLegacy}
          cat={cat}
          setCat={setCat}
          q={q}
          searching={searching}
          scope={scope}
          groups={groups}
          expanded={expanded}
          setExpanded={setExpanded}
          toggle={toggle}
        />
      )}
    </div>
  );
}


/* ─────────────── 지도 뷰 ─────────────── */
// 칩 색 — 중요도는 교재 CONTENTS 별 색(★★★ 빨강 · ★★ 파랑 · ★ 검정)을 따른다.
const PRI_CHIP: Record<string, string> = {
  상: "border-rose-300 bg-rose-50 text-rose-900",
  중: "border-sky-300 bg-sky-50 text-sky-900",
  하: "border-slate-200 bg-white text-slate-700",
};
// 출제 빈도는 기술사 기출 횟수로 칠한다 — NS·모의고사까지 더하면 네트워크 토픽이 거의 다 「뜨거움」이라
// 색이 변별력을 잃었다.
const HEAT_STEPS: { min: number; cls: string; label: string }[] = [
  { min: 7, cls: "border-red-500 bg-red-500 text-white", label: "기출 7회 이상" },
  { min: 4, cls: "border-orange-400 bg-orange-300 text-orange-950", label: "4~6회" },
  { min: 2, cls: "border-amber-300 bg-amber-200 text-amber-950", label: "2~3회" },
  { min: 1, cls: "border-amber-200 bg-amber-50 text-amber-900", label: "1회" },
  { min: 0, cls: "border-slate-200 bg-white text-slate-500", label: "기출 없음" },
];
/** 출제 횟수 — 기술사 기출 + NS 주간 모의고사 + ITPE 모의·파이널 */
const hits = (s?: TopicStat) => (s ? s.past + s.ns + s.mock : 0);
const heatCls = (n: number) => HEAT_STEPS.find((h) => n >= h.min)!.cls;
/** 칩에 쓰는 짧은 이름 — 괄호 속 원어를 뗀다 */
const short = (t: string) => t.replace(/\s*[(（][^)）]*[)）]/g, "").trim() || t;


// ── 마인드맵 배치 ─────────────────────────────────────────────
// 2026-10-11 "토픽지도는 마인드맵 느낌으로 만들고 싶었던 건데" — 영역 카드 격자를 가운데 과목에서
// 가지가 뻗는 마인드맵으로 바꿨다. 영역을 잎 수로 좌우 균형 맞춰 나누고, 영역 가지마다 색을 달리한다.
const BRANCH = ["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d", "#ea580c", "#4f46e5", "#0d9488", "#b45309", "#9333ea", "#475569", "#be123c"];
// 너비는 화면 칸에 맞춘다(좁으면 MM_MIN_W 로 두고 안에서 가로 스크롤). 잎은 양끝 LEAF_MAX 칸을 쓴다.
const MM_MIN_W = 960;
const LEAF_MAX = 200;
const AREA_W = 150;
const LEAF_H = 30;
const GROUP_GAP = 18;

function MindMap({
  cat,
  areas,
  stats,
  mode,
  sel,
  linked,
  dimOthers,
  isMatch,
  onPick,
}: {
  cat: string;
  areas: { name: string; items: MapTopic[] }[];
  stats: Record<string, TopicStat>;
  mode: "priority" | "heat";
  sel: string | null;
  linked: Set<string>;
  dimOthers: boolean;
  isMatch: (t: MapTopic) => boolean;
  onPick: (title: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
    ro.observe(el);
    setBoxW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const MM_W = Math.max(MM_MIN_W, boxW);
  const MM_CX = MM_W / 2;
  const LEAF_DX = MM_CX - LEAF_MAX - 8; // 가운데 → 잎 안쪽 끝
  const AREA_DX = LEAF_DX - AREA_W / 2 - 45; // 가운데 → 영역 마디 중심

  // 좌우 나누기 — 앞 영역부터 오른쪽에 채우다 잎 수가 절반을 넘으면 왼쪽으로(교재 순서: 오른쪽 위 → 아래, 왼쪽 위 → 아래)
  const total = areas.reduce((n, a) => n + a.items.length, 0);
  const right: number[] = [];
  const left: number[] = [];
  let acc = 0;
  areas.forEach((a, i) => {
    if (acc < total / 2 || right.length === 0) {
      right.push(i);
      acc += a.items.length;
    } else left.push(i);
  });
  const sideH = (idx: number[]) =>
    idx.reduce((h, i) => h + areas[i].items.length * LEAF_H, 0) + Math.max(0, idx.length - 1) * GROUP_GAP;
  const H = Math.max(sideH(right), sideH(left), 200) + 40;

  type Leaf = { t: MapTopic; x: number; y: number; side: 1 | -1; color: string };
  type Node = { name: string; n: number; x: number; y: number; side: 1 | -1; color: string };
  const leaves: Leaf[] = [];
  const nodes: Node[] = [];
  const place = (idx: number[], side: 1 | -1) => {
    let y = (H - sideH(idx)) / 2;
    for (const i of idx) {
      const a = areas[i];
      const color = BRANCH[i % BRANCH.length];
      const y0 = y;
      for (const t of a.items) {
        leaves.push({ t, x: MM_CX + side * LEAF_DX, y: y + LEAF_H / 2, side, color });
        y += LEAF_H;
      }
      nodes.push({ name: a.name, n: a.items.length, x: MM_CX + side * AREA_DX, y: (y0 + y) / 2, side, color });
      y += GROUP_GAP;
    }
  };
  place(right, 1);
  place(left, -1);
  const cy = H / 2;
  const leafAt = new Map(leaves.map((l) => [l.t.title, l]));
  const selLeaf = sel ? leafAt.get(sel) : undefined;

  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  };

  return (
    <div ref={box} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <div className="relative" style={{ width: MM_W, height: H }}>
        <svg className="absolute inset-0" width={MM_W} height={H}>
          {nodes.map((nd) => (
            <path
              key={`c-${nd.name}`}
              d={curve(MM_CX + nd.side * 70, cy, nd.x - nd.side * (AREA_W / 2), nd.y)}
              fill="none"
              stroke={nd.color}
              strokeWidth={3}
              strokeOpacity={dimOthers ? 0.25 : 0.7}
            />
          ))}
          {leaves.map((l) => {
            const nd = nodes.find((n) => n.name === l.t.area && n.side === l.side)!;
            const lit = sel === l.t.title || linked.has(l.t.title) || isMatch(l.t);
            return (
              <path
                key={`l-${l.t.title}`}
                d={curve(nd.x + l.side * (AREA_W / 2), nd.y, l.x, l.y)}
                fill="none"
                stroke={nd.color}
                strokeWidth={1.5}
                strokeOpacity={dimOthers && !lit ? 0.12 : 0.55}
              />
            );
          })}
          {/* 고른 토픽 ↔ 이어진 토픽 — 점선 */}
          {selLeaf &&
            Array.from(linked).map((t) => {
              const o = leafAt.get(t);
              if (!o) return null;
              // 잎의 안쪽 끝(가지가 닿는 쪽)끼리, 가운데 쪽으로 휘게 잇는다
              const x1 = selLeaf.x - selLeaf.side * 4;
              const x2 = o.x - o.side * 4;
              return (
                <path
                  key={`x-${t}`}
                  d={`M${x1},${selLeaf.y} C${x1 - selLeaf.side * 90},${selLeaf.y} ${x2 - o.side * 90},${o.y} ${x2},${o.y}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              );
            })}
        </svg>

        {/* 가운데 — 과목 */}
        <div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white shadow-lg"
          style={{ left: MM_CX, top: cy, minWidth: 140 }}
        >
          {cat}
        </div>

        {/* 영역 마디 */}
        {nodes.map((nd) => (
          <div
            key={`n-${nd.name}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 truncate rounded-xl border-2 bg-white px-2.5 py-1 text-center text-[12px] font-bold shadow-sm"
            style={{ left: nd.x, top: nd.y, width: AREA_W, borderColor: nd.color, color: nd.color, opacity: dimOthers ? 0.6 : 1 }}
            title={`${nd.name} · ${nd.n}토픽`}
          >
            {nd.name} <span className="font-normal opacity-60">{nd.n}</span>
          </div>
        ))}

        {/* 잎 — 토픽 */}
        {leaves.map((l) => {
          const t = l.t;
          const s = stats[t.title];
          const n = mode === "heat" ? s?.past ?? 0 : hits(s);
          const color = mode === "heat" ? heatCls(n) : PRI_CHIP[t.priority ?? "하"] ?? PRI_CHIP.하;
          const isSel = sel === t.title;
          const lit = isSel || linked.has(t.title) || isMatch(t);
          return (
            <button
              key={`t-${t.title}`}
              onClick={() => onPick(t.title)}
              title={`${t.title}${t.summary ? `\n${t.summary}` : ""}`}
              className={`absolute max-w-[200px] -translate-y-1/2 truncate whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[12px] leading-tight transition ${color} ${
                t.sub ? "" : "border-dashed"
              } ${t.priority === "상" ? "font-semibold" : ""} ${
                isSel ? "ring-2 ring-brand-500 ring-offset-1" : linked.has(t.title) ? "ring-2 ring-indigo-300" : ""
              } ${dimOthers && !lit ? "opacity-25" : ""}`}
              style={l.side === 1 ? { left: l.x, top: l.y } : { right: MM_W - l.x, top: l.y }}
            >
              {short(t.title)}
              {n > 0 && <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup>}
              {t.sub && !s?.ans && !s?.com && <span className="ml-0.5 text-[9px] opacity-60">○</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapView({ query, stats }: { query: string; stats: Record<string, TopicStat> }) {
  const cats = sortDomains(Object.keys(TOPICS_BY_CAT).filter((c) => TOPICS_BY_CAT[c].length > 0));
  const [cat, setCat] = useState(cats[0]);
  const [mode, setMode] = useState<"priority" | "heat">("priority");
  const [sel, setSel] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);

  const list = TOPICS_BY_CAT[cat] ?? [];
  const areas: { name: string; items: MapTopic[] }[] = [];
  for (const t of list) {
    const last = areas[areas.length - 1];
    if (last && last.name === t.area) last.items.push(t);
    else areas.push({ name: t.area, items: [t] });
  }
  const selected = sel ? list.find((t) => t.title === sel) : undefined;
  const linked = new Set(selected ? linksOf(selected.title) : []);
  const match = (t: MapTopic) =>
    !!query && (t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query));
  // 검색어가 다른 과목에 걸리면 그 과목으로 건너갈 수 있게
  const elsewhere = query
    ? cats
        .filter((c) => c !== cat)
        .map((c) => ({ c, n: TOPICS_BY_CAT[c].filter(match).length }))
        .filter((x) => x.n > 0)
    : [];

  const pri = { 상: 0, 중: 0, 하: 0 } as Record<string, number>;
  for (const t of list) if (t.priority) pri[t.priority]++;
  const noAns = list.filter((t) => t.sub && !stats[t.title]?.ans && !stats[t.title]?.com).length;
  const asked = list.filter((t) => (stats[t.title]?.past ?? 0) > 0).length;
  const st = selected ? stats[selected.title] : undefined;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {cats.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setSel(null);
                setShowTables(false);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              }`}
            >
              {c}{" "}
              <span className={active ? "text-brand-100" : "text-slate-400"}>{TOPICS_BY_CAT[c].length}</span>
            </button>
          );
        })}
      </div>

      {elsewhere.length > 0 && (
        <p className="mb-3 text-xs text-slate-500">
          다른 과목에도 있어요:{" "}
          {elsewhere.map((x) => (
            <button
              key={x.c}
              onClick={() => {
                setCat(x.c);
                setSel(null);
              }}
              className="mr-1.5 rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-brand-700"
            >
              {x.c} {x.n}
            </button>
          ))}
        </p>
      )}

      {/* 과목 한눈 요약 + 색 기준 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <p className="text-xs text-slate-600">
          <b className="text-slate-900">{cat}</b> · 영역 {areas.length} · 토픽 {list.length}
          <span className="mx-1.5 text-slate-300">|</span>
          <span className="text-rose-700">상 {pri.상}</span> · <span className="text-sky-700">중 {pri.중}</span> · 하 {pri.하}
          <span className="mx-1.5 text-slate-300">|</span>
          기술사 기출 토픽 {asked} · 답안 없는 토픽 {noAns}
        </p>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
          {[
            { k: "priority" as const, label: "중요도" },
            { k: "heat" as const, label: "출제 빈도" },
          ].map((m) => (
            <button
              key={m.k}
              onClick={() => setMode(m.k)}
              className={`rounded-md px-2.5 py-1 font-semibold ${
                mode === m.k ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        {mode === "priority" ? (
          <>
            <span className={`rounded border px-1.5 py-0.5 ${PRI_CHIP.상}`}>상 ★★★</span>
            <span className={`rounded border px-1.5 py-0.5 ${PRI_CHIP.중}`}>중 ★★</span>
            <span className={`rounded border px-1.5 py-0.5 ${PRI_CHIP.하}`}>하 ★</span>
          </>
        ) : (
          HEAT_STEPS.map((h) => (
            <span key={h.label} className={`rounded border px-1.5 py-0.5 ${h.cls}`}>
              {h.label}
            </span>
          ))
        )}
        <span className="ml-1">
          · 숫자 = {mode === "heat" ? "기술사 기출 횟수" : "출제 횟수(기출·NS·모의)"} · ○ = 모범답안·해설 없음 · 점선 = 교재 정리 전
        </span>
      </div>

      {/* 마인드맵 — 가운데 과목, 양옆으로 영역 가지, 끝에 토픽 잎 */}
      <MindMap
        cat={cat}
        areas={areas}
        stats={stats}
        mode={mode}
        sel={sel}
        linked={linked}
        dimOthers={!!selected || !!query}
        isMatch={match}
        onPick={(title) => {
          setSel(sel === title ? null : title);
          setShowTables(false);
        }}
      />

      {/* 고른 토픽 — 지도 아래 상세 */}
      {selected && (
        <div className="sticky bottom-3 mt-4 rounded-2xl border border-brand-200 bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">
                {cat} › {selected.area}
                {selected.priority && <> · 중요도 {selected.priority}</>}
                {selected.level && <> · {selected.level}</>}
              </p>
              <h3 className="font-bold text-slate-900">{selected.title}</h3>
              <p className="mt-0.5 text-xs text-slate-600">{selected.summary || "교재 정리 전 — CONTENTS 에만 있는 토픽"}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {selected.sub && (
                <Link
                  href={`/explain?topic=${encodeURIComponent(selected.title)}`}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  토픽 설명 →
                </Link>
              )}
              <button
                onClick={() => setSel(null)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-500"
              >
                ✕
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            📜 기술사 기출 {st?.past ?? 0} · 📕 NS {st?.ns ?? 0} · 🏁 모의·파이널 {st?.mock ?? 0} · ✍️ 모범답안 {st?.ans ?? 0} · 📘 해설집 {st?.com ?? 0}
          </p>
          {linked.size > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">🔗 이어진 토픽</span>
              {Array.from(linked).map((l) => {
                const here = list.some((t) => t.title === l);
                return (
                  <button
                    key={l}
                    onClick={() => {
                      if (here) setSel(l);
                      else {
                        const other = ALL_MAP_TOPICS.find((x) => x.t.title === l);
                        if (other) {
                          setCat(other.cat);
                          setSel(l);
                        }
                      }
                    }}
                    className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] text-brand-700"
                  >
                    {short(l)}
                    {!here && <span className="ml-1 text-brand-400">↗</span>}
                  </button>
                );
              })}
            </div>
          )}
          {selected.sub && (
            <button
              onClick={() => setShowTables(!showTables)}
              className="mt-2 text-[11px] font-medium text-slate-500 underline underline-offset-2"
            >
              {showTables ? "교재 표 접기" : "교재 표 펼치기"}
            </button>
          )}
          {showTables && (
            <div className="mt-2 max-h-[50vh] space-y-3 overflow-y-auto">
              {memoryTables
                .filter((m) => m.ref === selected.title)
                .map((m) => (
                  <TableCard key={m.title} t={m} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────── 비교 뷰 ─────────────── */
function CompareView({
  cmpResults,
  q,
  searching,
}: {
  cmpResults: typeof compareSets;
  q: string;
  searching: boolean;
}) {
  // 기본은 첫 과목(커리큘럼 1주차) — "전체"로 두면 교재 세트 850개가 한 번에 그려진다.
  const [pick, setPick] = useState<string>(CMP_CATS[0] ?? "전체");
  // 검색 중엔 분류 필터 무시, 아니면 선택 분류로 좁힘
  const shown =
    searching || pick === "전체"
      ? cmpResults
      : cmpResults.filter((s) => s.category === pick);
  const cats = CMP_CATS.filter((c) => shown.some((s) => s.category === c));

  return (
    <div>
      {/* 분류 바로가기 (검색 중엔 숨김) */}
      {!searching && (
        <div className="mb-4 flex flex-wrap gap-2">
          {["전체", ...CMP_CATS].map((c) => {
            const n =
              c === "전체"
                ? compareSets.length
                : compareSets.filter((s) => s.category === c).length;
            const active = c === pick;
            return (
              <button
                key={c}
                onClick={() => setPick(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                }`}
              >
                {c}{" "}
                <span className={active ? "text-brand-100" : "text-slate-400"}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mb-3 text-xs text-slate-400">
        {searching
          ? `"${q}" 검색 결과 · 비교 세트 ${cmpResults.length}개`
          : `견주며 외우는 핵심 비교 ${compareSets.length}세트 · 항목을 누르면 답안지 템플릿으로 이동`}
      </p>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {cats.map((c) => (
            <div key={c}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {c}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {shown
                  .filter((s) => s.category === c)
                  .map((s) => (
                    <section
                      key={`${s.category}::${s.title}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-slate-900">
                        {s.title}
                        {/* 교재 서브노트 표를 그대로 옮긴 세트 — ref 가 원본 토픽 */}
                        {s.source === "교재" ? (
                          <span
                            title={s.ref ? `교재 서브노트 「${s.ref}」의 표` : "교재 표"}
                            className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                          >
                            교재
                          </span>
                        ) : (
                          <span
                            title="교재 이전에 만든 세트 — 교재 표기와 다를 수 있다"
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400"
                          >
                            교재 외
                          </span>
                        )}
                      </h3>
                      <p className="mt-0.5 text-xs text-brand-600">⚖️ {s.axis}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.items.map((it) =>
                          hasAnyData(it.name, s.title) ? (
                            <Link
                              key={it.name}
                              href={explainHref(it.name, s.title)}
                              className="group min-w-[130px] flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 transition hover:border-brand-300 hover:bg-brand-50"
                            >
                              <div className="text-[13px] font-semibold leading-snug text-slate-800 group-hover:text-brand-600">
                                {it.name}
                              </div>
                              <div className="mt-0.5 text-[11px] leading-snug text-slate-500">
                                {it.hint}
                              </div>
                            </Link>
                          ) : (
                            // 교재·예전 자료 어디에도 없는 하위 개념 — 링크 없이 힌트만(AI 페이지로 안 보냄)
                            <div
                              key={it.name}
                              className="min-w-[130px] flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                            >
                              <div className="text-[13px] font-semibold leading-snug text-slate-800">
                                {it.name}
                              </div>
                              <div className="mt-0.5 text-[11px] leading-snug text-slate-500">
                                {it.hint}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </section>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── 암기표 뷰 ─────────────── */
function TablesView({
  tblResults,
  q,
  searching,
}: {
  tblResults: typeof memoryTables;
  q: string;
  searching: boolean;
}) {
  // 기본은 첫 과목 — "전체"는 교재 표 1,200개를 한 번에 그린다.
  const [pick, setPick] = useState<string>(TBL_CATS[0] ?? "전체");
  const shown =
    searching || pick === "전체"
      ? tblResults
      : tblResults.filter((t) => t.category === pick);

  return (
    <div>
      {!searching && (
        <div className="mb-4 flex flex-wrap gap-2">
          {["전체", ...TBL_CATS].map((c) => {
            const n =
              c === "전체"
                ? memoryTables.length
                : memoryTables.filter((t) => t.category === c).length;
            const active = c === pick;
            return (
              <button
                key={c}
                onClick={() => setPick(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                }`}
              >
                {c}{" "}
                <span className={active ? "text-brand-100" : "text-slate-400"}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mb-3 text-xs text-slate-400">
        {searching
          ? `"${q}" 검색 결과 · 암기표 ${tblResults.length}개`
          : `묶음을 한 장에 통째로 외우는 암기표 ${memoryTables.length}개 · 답안에 그대로 옮겨 적기 좋아요`}
      </p>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((t) => (
            <TableCard key={`${t.category}::${t.title}`} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}


/** 암기표 한 장 — 암기표 탭과 토픽 탭(펼친 토픽)이 같이 쓴다. */
function TableCard({ t }: { t: (typeof memoryTables)[number] }) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
          {t.source === "교재" ? (
            <span
              title={t.ref ? `교재 서브노트 「${t.ref}」의 표` : "교재 표"}
              className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
            >
              교재
            </span>
          ) : (
            <span
              title="교재 이전에 만든 표 — 교재 표기와 다를 수 있다"
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400"
            >
              교재 외
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
            {t.category}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {t.intro}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              {t.columns.map((col, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row, ri) => (
              <tr key={ri} className="even:bg-slate-50/40">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border-b border-slate-100 px-3 py-2 align-top ${
                      ci === 0
                        ? "whitespace-nowrap font-semibold text-slate-800"
                        : "text-slate-600"
                    }`}
                  >
                    {ci === 0 &&
                    isLinkableName(cell) &&
                    hasAnyData(cell, t.title) ? (
                      <Link
                        href={explainHref(cell, t.title)}
                        className="text-slate-800 underline decoration-slate-300 underline-offset-2 transition hover:text-brand-600 hover:decoration-brand-400"
                      >
                        {cell}
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {t.examTip && (
        <p className="border-t border-amber-100 bg-amber-50/50 px-4 py-2.5 text-xs leading-relaxed text-amber-800">
          ✍️ <b className="font-semibold">답안 활용</b> · {t.examTip}
        </p>
      )}
    </section>
  );
}

/* ─────────────── 묶음 뷰 (예전 토픽) ─────────────── */
function GroupsView({
  pool,
  legacy,
  setLegacy,
  cat,
  setCat,
  q,
  searching,
  scope,
  groups,
  expanded,
  setExpanded,
  toggle,
}: {
  pool: Topic[];
  legacy: boolean;
  setLegacy: (v: boolean) => void;
  cat: string;
  setCat: (c: string) => void;
  q: string;
  searching: boolean;
  scope: Topic[];
  groups: { name: string; items: Topic[] }[];
  expanded: Set<string>;
  setExpanded: Dispatch<SetStateAction<Set<string>>>;
  toggle: (key: string) => void;
}) {
  return (
    <div>
      {/* 분류 탭 (검색 중엔 숨김) */}
      {!searching && (
        <div className="mb-5 flex flex-wrap gap-2">
          {CATS.map((c) => {
            const n = pool.filter((t) => t.category === c).length;
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                }`}
              >
                {c} <span className={active ? "text-brand-100" : "text-slate-400"}>{n}</span>
              </button>
            );
          })}
          {/* 기본은 교재 토픽만. 예전(기필반) 토픽은 회독 진도가 걸려 있어 토글 뒤에 둔다. */}
          <button
            onClick={() => setLegacy(!legacy)}
            title="예전(기필반) 토픽에 교재 서브노트까지 함께 묶어 봅니다"
            className={`ml-auto rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              legacy
                ? "border-slate-500 bg-slate-600 text-white"
                : "border-dashed border-slate-300 bg-white text-slate-400 hover:border-slate-400"
            }`}
          >
            {legacy ? "교재 토픽 포함 중" : "+ 교재 토픽도 포함"}
          </button>
        </div>
      )}

      {/* 요약 줄 + 전체 펼치기/접기 */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          {searching
            ? `"${q}" 검색 결과 · 토픽 ${scope.length}개 · 묶음 ${groups.length}개`
            : `${cat} · 토픽 ${scope.length}개 · 연관 묶음 ${groups.length}개`}
        </span>
        {!searching && groups.length > 0 && (
          <button
            onClick={() =>
              setExpanded((prev) =>
                prev.size >= groups.length
                  ? new Set()
                  : new Set(groups.map((g) => `${cat}::${g.name}`)),
              )
            }
            className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-brand-300 hover:text-brand-600"
          >
            {expanded.size >= groups.length ? "모두 접기" : "모두 펼치기"}
          </button>
        )}
      </div>

      {/* 묶음 목록 */}
      {groups.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => {
            const key = `${cat}::${g.name}`;
            // 검색 중엔 항상 펼침, 평소엔 기본 접힘 → 클릭 시 펼침
            const open = searching || expanded.has(key);
            return (
              <section
                key={key}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => toggle(key)}
                  disabled={searching}
                  className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 disabled:cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{open ? "▾" : "▸"}</span>
                    <h3 className="font-semibold text-slate-900">{cleanGroup(g.name)}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {g.items.length}
                    </span>
                  </div>
                  {searching && (
                    <span className="text-xs text-slate-400">{g.items[0]?.category}</span>
                  )}
                </button>

                {open && (
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {g.items.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/explain?topic=${encodeURIComponent(t.title)}`}
                          className="group flex items-start gap-3 px-5 py-3 transition hover:bg-brand-50/50"
                        >
                          <span
                            className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-medium ${
                              IMP_BADGE[t.importance] || IMP_BADGE["중"]
                            }`}
                          >
                            {t.importance}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-800 group-hover:text-brand-600">
                              {t.title}
                              <SourceBadge source={t.source} className="ml-1.5 align-middle" />
                              {/* 학습계획에 매긴 레벨 — 교재 중요도(왼쪽 배지)와 다른 축이다.
                                  중요도는 "교재가 얼마나 크게 다루나",
                                  레벨은 "시험을 앞두고 내가 어떻게 다룰까". */}
                              {t.level && (
                                <span
                                  title={LEVEL_HINT[t.level]}
                                  className={`ml-1.5 inline-block rounded border px-1.5 py-0.5 align-middle text-[11px] font-bold ${
                                    LEVEL_STYLE[t.level] || ""
                                  }`}
                                >
                                  {t.level}
                                </span>
                              )}
                            </div>
                            {t.levelNote ? (
                              <div className="mt-0.5 text-xs font-medium text-brand-700">
                                {t.levelNote}
                              </div>
                            ) : null}
                            {t.summary && (
                              <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                {t.summary}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
