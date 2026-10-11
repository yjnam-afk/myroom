"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
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
import { courseEntries } from "@/lib/courseOrder";
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
  /** 전체 지도의 잎(과목의 영역) — 누르면 그 과목 지도로 간다 */
  go?: string;
  /** 전체 지도 잎에 쓰는 이름·숫자·빈도 */
  label?: string;
  count?: number;
  heatN?: number;
};
const TOPICS_BY_CAT: Record<string, MapTopic[]> = (() => {
  // 과목 차례는 교재 CONTENTS 기준(lib/courseOrder) — CONTENTS 밖 서브노트는 원래 과목 맨 뒤
  const out: Record<string, MapTopic[]> = {};
  const sq = (x: string) => x.replace(/\s+/g, "").toLowerCase();
  for (const [code, label] of Object.entries(DOMAIN_LABEL)) {
    const clusters = TOPIC_CLUSTERS[code] ?? [];
    let ci = -1;
    out[label] = courseEntries(code).map((e) => {
      let area = label;
      if (e.plan) {
        while (ci + 1 < clusters.length && sq(e.plan.title).startsWith(sq(clusters[ci + 1][1]))) ci++;
        area = clusters[Math.max(ci, 0)]?.[0] ?? label;
      } else if (COURSE_TOPICS[code]) area = "다른 교재·CONTENTS 밖";
      const p = e.plan ?? (e.sub ? planInfo(e.sub.title, e.sub.topicId) : null);
      return {
        title: e.title,
        priority: p?.priority,
        level: p?.level,
        note: p?.note,
        summary: e.sub?.defShort ?? "",
        sub: e.sub,
        area,
      };
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
        desc="과목 → 영역 → 토픽 가지로 한눈에 봅니다. 가지는 눌러서 접고 펴고, 색은 중요도나 출제 빈도, 토픽을 누르면 옆 칸에 출제·답안 수와 이어진 토픽이 나옵니다."
      />

      {/* 뷰 전환 */}
      <div className="mb-4 flex max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 sm:inline-flex">
        {[
          { k: "map" as const, label: "🗺️ 지도" },
          { k: "compare" as const, label: "⚖️ 비교하며 외우기" },
          { k: "tables" as const, label: "📋 암기표" },
          { k: "groups" as const, label: "🗂️ 예전 토픽 묶음" },
        ].map((v) => (
          <button
            key={v.k}
            onClick={() => setView(v.k)}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
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


// ── 지도: 접고 펴는 가지 구조도 ─────────────────────────────────────
// 2026-10-11 "마인드맵으로 하니까 UX 별로다" — 가운데에서 좌우로 뻗는 SVG 마인드맵은 화면이 세로로
// 길어지고(인공지능 119토픽) 잎 글자가 작아 읽기 어려웠고, 고른 토픽 상세가 지도를 가렸다.
// 이제 왼쪽에서 오른쪽으로 뻗는 구조도(과목 → 영역 → 토픽 묶음)로 그리고 가지를 접고 편다.
// 토픽은 영역 옆에 칩으로 모아 한 줄에 여럿 보이게 하고, 고른 토픽 상세는 오른쪽(모바일은 아래) 칸에 둔다.
const BRANCH = ["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d", "#ea580c", "#4f46e5", "#0d9488", "#b45309", "#9333ea", "#475569", "#be123c"];

type Area = { name: string; items: MapTopic[] };
const areasOf = (items: MapTopic[]): Area[] => {
  const out: Area[] = [];
  for (const t of items) {
    const last = out[out.length - 1];
    if (last && last.name === t.area) last.items.push(t);
    else out.push({ name: t.area, items: [t] });
  }
  return out;
};

/** 가지 묶음 — 왼쪽 세로줄에서 자식마다 가로줄을 뻗는다 */
function Twigs({ color, children }: { color: string; children: ReactNode[] }) {
  // 검색으로 걸러진 가지(null)는 줄도 긋지 않는다
  const kids = children.filter(Boolean);
  const n = kids.length;
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {kids.map((c, i) => (
        <div key={i} className="relative min-w-0 py-1 pl-5">
          <span className="absolute left-0 top-1/2 h-0.5 w-5" style={{ background: color }} />
          {n > 1 && (
            <span
              className="absolute left-0 w-0.5"
              style={{ background: color, top: i === 0 ? "50%" : 0, bottom: i === n - 1 ? "50%" : 0 }}
            />
          )}
          {c}
        </div>
      ))}
    </div>
  );
}

function MapView({ query, stats }: { query: string; stats: Record<string, TopicStat> }) {
  const doms = sortDomains(Object.keys(TOPICS_BY_CAT).filter((c) => TOPICS_BY_CAT[c].length > 0));
  const cats = ["전체", ...doms];
  const [cat, setCat] = useState("전체");
  const [mode, setMode] = useState<"priority" | "heat">("priority");
  const [sel, setSel] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);
  // 펼친 가지 — 과목 지도는 영역을 다 편 채로, 전체 지도는 과목만 보이게 시작한다
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const overview = cat === "전체";
  const list = overview ? doms.flatMap((c) => TOPICS_BY_CAT[c]) : TOPICS_BY_CAT[cat] ?? [];
  const selected = sel ? ALL_MAP_TOPICS.find((x) => x.t.title === sel)?.t : undefined;
  const linked = new Set(selected ? linksOf(selected.title) : []);
  const match = (t: MapTopic) =>
    !!query && (t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query));
  // 전체 지도 — 과목 가지는 접힌 채 시작(누르면 영역), 영역은 누르면 토픽. 과목 지도 — 영역이 다 펴져 있다.
  const isOpen = (key: string, byDefault: boolean) =>
    (query && key.includes("::") ? true : false) || (byDefault ? !closed.has(key) : open.has(key));
  const toggle = (key: string, byDefault: boolean) => {
    const set = byDefault ? closed : open;
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    (byDefault ? setClosed : setOpen)(next);
  };
  const go = (c: string) => {
    setCat(c);
    setSel(null);
    setShowTables(false);
    setOpen(new Set());
    setClosed(new Set());
  };
  const pick = (t: MapTopic) => {
    setSel(sel === t.title ? null : t.title);
    setShowTables(false);
  };

  const pri = { 상: 0, 중: 0, 하: 0 } as Record<string, number>;
  for (const t of list) if (t.priority) pri[t.priority]++;
  const noAns = list.filter((t) => t.sub && !stats[t.title]?.ans && !stats[t.title]?.com).length;
  const asked = list.filter((t) => (stats[t.title]?.past ?? 0) > 0).length;
  const st = selected ? stats[selected.title] : undefined;
  const matchCount = query ? list.filter(match).length : 0;

  const Chip = ({ t }: { t: MapTopic }) => {
    const s = stats[t.title];
    const n = mode === "heat" ? s?.past ?? 0 : hits(s);
    const color = mode === "heat" ? heatCls(n) : PRI_CHIP[t.priority ?? "하"] ?? PRI_CHIP.하;
    const isSel = sel === t.title;
    return (
      <button
        onClick={() => pick(t)}
        title={`${t.title}${t.summary ? `\n${t.summary}` : ""}`}
        className={`rounded-full border px-2.5 py-1 text-left text-[12.5px] leading-tight transition hover:shadow ${color} ${
          t.sub ? "" : "border-dashed"
        } ${t.priority === "상" ? "font-semibold" : ""} ${
          isSel
            ? "ring-2 ring-brand-600 ring-offset-1"
            : linked.has(t.title)
              ? "ring-2 ring-indigo-400"
              : match(t)
                ? "ring-2 ring-yellow-400"
                : ""
        }`}
      >
        {short(t.title)}
        {n > 0 && <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup>}
        {t.sub && !s?.ans && !s?.com && <span className="ml-0.5 text-[9px] opacity-60">○</span>}
      </button>
    );
  };

  // 영역 가지 하나 — [영역] ── 토픽 칩 묶음
  const AreaRow = ({ a, color, dom }: { a: Area; color: string; dom: string }) => {
    const key = `${dom}::${a.name}`;
    const o = isOpen(key, !overview);
    const hit = query ? a.items.filter(match).length : 0;
    if (query && !hit) return null;
    const top = a.items.filter((t) => t.priority === "상").length;
    return (
      <div className="flex min-w-0 flex-col sm:flex-row sm:items-center">
        <button
          onClick={() => toggle(key, !overview)}
          className="flex w-full shrink-0 items-center justify-between gap-1 rounded-lg border-2 bg-white px-2.5 py-1 text-left text-[12.5px] font-bold sm:w-44"
          style={{ borderColor: color, color }}
        >
          <span className="truncate">{a.name}</span>
          <span className="shrink-0 text-[10px] font-normal text-slate-400">
            {a.items.length}
            {top ? <span className="text-rose-500"> ·상{top}</span> : null} {o ? "▾" : "▸"}
          </span>
        </button>
        {o && (
          <>
            <span className="ml-4 h-2 w-0.5 sm:ml-0 sm:h-0.5 sm:w-4" style={{ background: color }} />
            <div
              className="ml-4 flex min-w-0 flex-1 flex-wrap gap-1.5 rounded-xl border border-dashed px-2 py-1.5 sm:ml-0"
              style={{ borderColor: color }}
            >
              {a.items.map((t) => (
                <Chip key={t.title} t={t} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {cats.map((c) => {
          const active = c === cat;
          return (
            <button
              key={c}
              onClick={() => go(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              }`}
            >
              {c}{" "}
              <span className={active ? "text-brand-100" : "text-slate-400"}>
                {c === "전체" ? doms.reduce((n, d) => n + TOPICS_BY_CAT[d].length, 0) : TOPICS_BY_CAT[c].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 요약 + 색 기준 + 펼치기 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <p className="text-xs text-slate-600">
          <b className="text-slate-900">{overview ? "전체 도메인" : cat}</b> · 토픽 {list.length}
          <span className="mx-1.5 text-slate-300">|</span>
          <span className="text-rose-700">상 {pri.상}</span> · <span className="text-sky-700">중 {pri.중}</span> · 하 {pri.하}
          <span className="mx-1.5 text-slate-300">|</span>
          기술사 기출 토픽 {asked} · 답안 없는 토픽 {noAns}
          {query && <b className="ml-1.5 text-amber-700">· 찾은 토픽 {matchCount}</b>}
        </p>
        <div className="flex items-center gap-1.5">
          {!overview && (
            <button
              onClick={() => setClosed(closed.size ? new Set() : new Set(areasOf(list).map((a) => `${cat}::${a.name}`)))}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500"
            >
              {closed.size ? "모두 펼치기" : "모두 접기"}
            </button>
          )}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {[
              { k: "priority" as const, label: "중요도" },
              { k: "heat" as const, label: "출제 빈도" },
            ].map((m) => (
              <button
                key={m.k}
                onClick={() => setMode(m.k)}
                className={`rounded-md px-2.5 py-1 font-semibold ${mode === m.k ? "bg-white text-brand-600 shadow-sm" : "text-slate-500"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        {mode === "priority" ? (
          <>
            <span className={`rounded-full border px-2 py-0.5 ${PRI_CHIP.상}`}>상 ★★★</span>
            <span className={`rounded-full border px-2 py-0.5 ${PRI_CHIP.중}`}>중 ★★</span>
            <span className={`rounded-full border px-2 py-0.5 ${PRI_CHIP.하}`}>하 ★</span>
          </>
        ) : (
          HEAT_STEPS.map((h) => (
            <span key={h.label} className={`rounded-full border px-2 py-0.5 ${h.cls}`}>
              {h.label}
            </span>
          ))
        )}
        <span className="ml-1">
          {overview
            ? `· 영역 칩 숫자 = 토픽 수 · 색 = ${mode === "heat" ? "토픽당 평균 기출" : "상 토픽 3개 이상 상 / 1개 이상 중"} · 영역을 누르면 그 과목 지도`
            : `· 숫자 = ${mode === "heat" ? "기술사 기출 횟수" : "출제 횟수(기출·NS·모의)"} · ○ = 모범답안·해설 없음 · 점선 = 교재 정리 전`}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* 구조도 */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          {overview ? (
            <Twigs color="#0f172a">
              {doms.map((c, di) => {
                const color = BRANCH[di % BRANCH.length];
                const areas = areasOf(TOPICS_BY_CAT[c]);
                const hit = query ? TOPICS_BY_CAT[c].filter(match).length : 0;
                if (query && !hit) return null;
                const top = TOPICS_BY_CAT[c].filter((t) => t.priority === "상").length;
                return (
                  <div key={c} className="flex min-w-0 flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => go(c)}
                      title={`${c} 지도로`}
                      className="flex w-full shrink-0 items-center justify-between gap-1 whitespace-nowrap rounded-xl px-3 py-2 text-left text-[13px] font-bold text-white shadow-sm sm:w-40"
                      style={{ background: color }}
                    >
                      <span>{c}</span>
                      <span className="text-[10px] font-normal opacity-90">
                        {TOPICS_BY_CAT[c].length} · 상{top} ›
                      </span>
                    </button>
                    <span className="ml-4 h-2 w-0.5 sm:ml-0 sm:h-0.5 sm:w-4" style={{ background: color }} />
                    {/* 영역 묶음 — 누르면 그 과목 지도에서 그 영역만 펼친다 */}
                    <div
                      className="ml-4 flex min-w-0 flex-1 flex-wrap gap-1.5 rounded-xl border border-dashed px-2 py-1.5 sm:ml-0"
                      style={{ borderColor: color }}
                    >
                      {areas.map((a) => {
                        const n = query ? a.items.filter(match).length : a.items.length;
                        if (query && !n) return null;
                        const past = a.items.reduce((k, t) => k + (stats[t.title]?.past ?? 0), 0);
                        const atop = a.items.filter((t) => t.priority === "상").length;
                        const cls =
                          mode === "heat"
                            ? heatCls(Math.ceil(past / a.items.length))
                            : PRI_CHIP[atop >= 3 ? "상" : atop >= 1 ? "중" : "하"];
                        return (
                          <button
                            key={a.name}
                            onClick={() => {
                              go(c);
                              // 그 영역만 펴 두고 나머지는 접는다
                              setClosed(new Set(areas.filter((x) => x.name !== a.name).map((x) => `${c}::${x.name}`)));
                            }}
                            className={`rounded-full border px-2.5 py-1 text-[12px] leading-tight hover:shadow ${cls}`}
                          >
                            {a.name}
                            <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </Twigs>
          ) : (
            <div className="flex min-w-0 flex-col sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow sm:py-3">
                {cat}
              </div>
              <span className="ml-4 h-2 w-0.5 bg-slate-900 sm:ml-0 sm:h-0.5 sm:w-4" />
              <div className="ml-4 min-w-0 flex-1 sm:ml-0">
                <Twigs color="#0f172a">
                  {areasOf(list).map((a, i) => (
                    <AreaRow key={a.name} a={a} color={BRANCH[i % BRANCH.length]} dom={cat} />
                  ))}
                </Twigs>
              </div>
            </div>
          )}
          {query && matchCount === 0 && <p className="p-4 text-center text-sm text-slate-400">찾은 토픽이 없습니다.</p>}
        </div>

        {/* 고른 토픽 — 넓은 화면은 오른쪽에 붙어 있고, 좁은 화면은 아래에서 올라온다 */}
        <aside
          className={`${
            selected ? "fixed inset-x-0 bottom-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-2xl shadow-2xl" : "hidden"
          } border border-slate-200 bg-white p-4 lg:sticky lg:top-20 lg:z-auto lg:block lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:rounded-2xl lg:shadow-sm`}
        >
          {!selected ? (
            <p className="text-xs leading-relaxed text-slate-400">
              토픽을 누르면 여기에 정의·출제·답안 수와 이어진 토픽이 나옵니다. 영역 이름을 누르면 가지를 접고 폅니다.
            </p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-slate-400">
                  {selected.area}
                  {selected.priority && <> · 중요도 {selected.priority}</>}
                  {selected.level && <> · {selected.level}</>}
                </p>
                <button onClick={() => setSel(null)} className="rounded-md border border-slate-200 px-1.5 text-xs text-slate-500">
                  ✕
                </button>
              </div>
              <h3 className="mt-0.5 font-bold text-slate-900">{selected.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {selected.summary || "교재 정리 전 — CONTENTS 에만 있는 토픽"}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
                {[
                  ["📜 기출", st?.past ?? 0],
                  ["📕 NS", st?.ns ?? 0],
                  ["🏁 모의", st?.mock ?? 0],
                  ["✍️ 답안", st?.ans ?? 0],
                  ["📘 해설", st?.com ?? 0],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg bg-slate-50 px-1 py-1">
                    <div className="text-slate-400">{k}</div>
                    <div className="font-bold text-slate-800">{v}</div>
                  </div>
                ))}
              </div>
              {selected.sub && (
                <Link
                  href={`/explain?topic=${encodeURIComponent(selected.title)}`}
                  className="mt-3 block rounded-lg bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700"
                >
                  토픽 설명 · 답안지 템플릿 →
                </Link>
              )}
              {linked.size > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-500">🔗 이어진 토픽 (표 안에 서로 나옴)</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {Array.from(linked).map((l) => {
                      const other = ALL_MAP_TOPICS.find((x) => x.t.title === l);
                      const here = overview || other?.cat === cat;
                      return (
                        <button
                          key={l}
                          onClick={() => {
                            if (!here && other) setCat(other.cat);
                            setSel(l);
                          }}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] text-indigo-700"
                        >
                          {short(l)}
                          {!here && <span className="ml-1 text-indigo-400">↗ {other?.cat}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {selected.sub && (
                <button
                  onClick={() => setShowTables(!showTables)}
                  className="mt-3 text-[11px] font-medium text-slate-500 underline underline-offset-2"
                >
                  {showTables ? "교재 표 접기" : "교재 표 펼치기"}
                </button>
              )}
              {showTables && (
                <div className="mt-2 space-y-3">
                  {memoryTables
                    .filter((m) => m.ref === selected.title)
                    .map((m) => (
                      <TableCard key={m.title} t={m} />
                    ))}
                </div>
              )}
            </>
          )}
        </aside>
      </div>
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
