"use client";

import Link from "next/link";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";
import { compareSets } from "@/data/compareSets";
import { memoryTables } from "@/data/memoryTables";
import ClearButton from "@/components/ClearButton";
import { ALL, CATS, LEGACY_TOPICS, type TopicStat, groupsOf } from "./mapData";
import { MapView } from "./MapView";
import { CompareView } from "./CompareView";
import { TablesView } from "./TablesView";
import { GroupsView } from "./GroupsView";

export type { TopicStat } from "./mapData";

export default function MapClient({ stats, chipHits }: { stats: Record<string, TopicStat>; chipHits: Record<string, number> }) {
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
        desc="과목 → 영역 → 분류 → 토픽 → 하위 토픽 가지로 한눈에 봅니다. 가지는 눌러서 접고 펴고, 색은 중요도나 출제 빈도, 토픽을 누르면 옆 칸에 출제·답안 수와 이어진 토픽이 나옵니다."
      />

      {/* 토픽 조사 — 문제은행 전체에서 아직 정리 안 된 주제 */}
      <Link href="/survey" className="mb-3 inline-block rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
        📋 토픽 조사 — 문제에 나오지만 아직 정리 안 된 주제 →
      </Link>
      <br />

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
      <div className="relative mb-4">
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
          className="w-full rounded-lg border border-slate-300 p-3 pr-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <ClearButton value={q} onClear={() => setQ("")} className="top-3" />
      </div>

      {view === "map" ? (
        <MapView query={query} stats={stats} chipHits={chipHits} />
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
