"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { memoryTables } from "@/data/memoryTables";
import { DOMAINS, sortDomains } from "@/lib/domains";
import { childLinks, parentLink } from "@/data/topicParents";
import { LEVEL_MAPS, chipKey, chipTopic } from "@/data/levelMaps";
import LevelMatrix from "./LevelMatrix";
import { FRAME_GROUPS, FRAME_BY_CODE, frameOf, familiesOf } from "@/data/answerFrames";
import FrameCard from "@/components/FrameCard";
import { explainHref as topicHref, commuteHref } from "@/lib/links";
import { ALL_MAP_TOPICS, type InnerNode, type MapTopic, TOPICS_BY_CAT, type TopicStat, innerOf, linksOf } from "./mapData";
import { TableCard } from "./TablesView";

/* ─────────────── 지도 뷰 ─────────────── */
// 칩 색 — 중요도는 교재 CONTENTS 별 색(★★★ 빨강 · ★★ 파랑 · ★ 검정)을 따른다.
/** 교재 밖 토픽 칩 — 기출·모의고사에 나오지만 교재에 쪽이 없는 주제. 교재 토픽보다 작고 점선이다 */
const EXAM_CHIP = "border-amber-400 bg-amber-50/60 text-amber-950";
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
const short = (t: string) => {
  const b = t.replace(/\s*[(（][^)）]*[)）]/g, "").trim();
  // 괄호 밖이 「데이터」처럼 짧으면 괄호가 본뜻이다 — 「데이터(웨어하우스, 레이크, 패브릭, 메시)」
  return b.length < 4 && /[(（][^)）]*,/.test(t) ? t : b || t;
};


// ── 지도: 접고 펴는 가지 구조도 ─────────────────────────────────────
// 2026-10-11 "마인드맵으로 하니까 UX 별로다" — 가운데에서 좌우로 뻗는 SVG 마인드맵은 화면이 세로로
// 길어지고(인공지능 119토픽) 잎 글자가 작아 읽기 어려웠고, 고른 토픽 상세가 지도를 가렸다.
// 이제 왼쪽에서 오른쪽으로 뻗는 구조도(과목 → 영역 → 토픽 묶음)로 그리고 가지를 접고 편다.
// 토픽은 영역 옆에 칩으로 모아 한 줄에 여럿 보이게 하고, 고른 토픽 상세는 오른쪽(모바일은 아래) 칸에 둔다.
const BRANCH = ["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d", "#ea580c", "#4f46e5", "#0d9488", "#b45309", "#9333ea", "#475569", "#be123c"];

/** 갈래를 접었을 때 — 갈래 속 서브 토픽만 한 줄로 */
const flatSubs = (nodes: InnerNode[]): InnerNode[] =>
  nodes.flatMap((n) => [...(n.sub ? [{ ...n, kids: [] }] : []), ...flatSubs(n.kids)]);

type Area = { name: string; items: MapTopic[] };
/** 종속 관계 표시 — 하위 토픽 칩 앞에 붙는다 */
const REL_MARK: Record<string, string> = { 종류: "⊂", "구성·기법": "◇", "문제·해결": "⚠", "확장·발전": "↗" };
const areasOf = (items: MapTopic[]): Area[] => {
  const out: Area[] = [];
  for (const t of items) {
    const last = out[out.length - 1];
    if (last && last.name === t.area) last.items.push(t);
    else out.push({ name: t.area, items: [t] });
  }
  return out;
};

/** 영역 안 분류 — 같은 분류가 이어진 토픽끼리 한 줄로 */
const groupsIn = (items: MapTopic[]): { name: string; items: MapTopic[] }[] => {
  const out: { name: string; items: MapTopic[] }[] = [];
  for (const t of items) {
    const last = out[out.length - 1];
    if (last && last.name === t.group) last.items.push(t);
    else out.push({ name: t.group, items: [t] });
  }
  return out;
};

/** 가지 묶음 — 왼쪽 세로줄에서 자식마다 가로줄을 뻗는다 */
function Twigs({ color, children, atTop }: { color: string; children: ReactNode[]; atTop?: boolean }) {
  // 검색으로 걸러진 가지(null)는 줄도 긋지 않는다
  const kids = children.filter(Boolean);
  const n = kids.length;
  // atTop — 가지가 위에 이름, 아래에 긴 칸인 경우(과목 지도의 영역) 가로줄을 이름 높이(위 0.95rem)에 잇는다
  const y = atTop ? "0.95rem" : "50%";
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {kids.map((c, i) => (
        <div key={i} className="relative min-w-0 py-1 pl-5">
          <span className="absolute left-0 h-0.5 w-5" style={{ background: color, top: atTop ? `calc(${y} + 0.25rem)` : y }} />
          {n > 1 && (
            <span
              className="absolute left-0 w-0.5"
              style={{
                background: color,
                top: i === 0 ? (atTop ? `calc(${y} + 0.25rem)` : y) : 0,
                bottom: i === n - 1 ? (atTop ? undefined : "50%") : 0,
                height: i === n - 1 && atTop ? `calc(${y} + 0.25rem)` : undefined,
              }}
            />
          )}
          {c}
        </div>
      ))}
    </div>
  );
}

export function MapView({
  query,
  stats,
  chipHits,
}: {
  query: string;
  stats: Record<string, TopicStat>;
  chipHits: Record<string, number>;
}) {
  const doms = sortDomains(Object.keys(TOPICS_BY_CAT).filter((c) => TOPICS_BY_CAT[c].length > 0));
  const cats = ["전체", ...doms];
  const [cat, setCat] = useState("전체");
  // 「답안 틀」 보기 — 칩 색 = 개념도 그룹(돌려막기 시트, 2026-11-09)
  const [mode, setMode] = useState<"priority" | "heat" | "frame">("priority");
  const [sel, setSel] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);
  // 토픽 안 갈래(교재 표의 종류·구성)를 지도에 펼쳐 둘지 — 접으면 서브 토픽 칩만 남는다
  const [showInner, setShowInner] = useState(true);
  // 교재 밖 토픽(기출·모의고사에 나오지만 교재에 없는 주제)을 지도에 함께 보일지
  const [showExam, setShowExam] = useState(true);
  // 펼친 가지 — 과목 지도는 영역을 다 편 채로, 전체 지도는 과목만 보이게 시작한다
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [closed, setClosed] = useState<Set<string>>(new Set());
  // 과목 지도 아래 단계 — 레벨 맵(행 × 관점 매트릭스) 몇 번째 장을 보는지. null = 토픽 가지
  const [lv, setLv] = useState<number | null>(null);

  const overview = cat === "전체";
  const code = DOMAINS.find((d) => d.label === cat)?.code ?? "";
  const lmaps = LEVEL_MAPS[code] ?? [];
  const lmap = lv != null ? lmaps[lv] : undefined;
  const byCat = (c: string) => (showExam ? TOPICS_BY_CAT[c] ?? [] : (TOPICS_BY_CAT[c] ?? []).filter((t) => !t.exam));
  const list = overview ? doms.flatMap(byCat) : byCat(cat);
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
    setLv(null);
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
  const nExam = list.filter((t) => t.exam).length;
  const st = selected ? stats[selected.title] : undefined;
  const matchCount = query ? list.filter(match).length : 0;
  // 종속 관계 — 같은 지도에 상위 토픽이 있으면 하위 토픽은 상위 아래로 묶는다(영역이 달라도)
  const inList = new Set(list.map((t) => t.title));
  const upHere = (t: MapTopic) => {
    // 교재 밖 토픽은 자료에 적힌 상위 토픽 아래로
    if (t.under) return inList.has(t.under.parent) ? { child: t.title, parent: t.under.parent, rel: t.under.rel as "종류", why: "교재 밖 · 기출·모의 출제" } : undefined;
    const p = parentLink(t.title);
    return p && p.parent !== t.title && inList.has(p.parent) ? p : undefined;
  };
  const kidsOf = (title: string) => list.filter((t) => upHere(t)?.parent === title);

  const Chip = ({ t }: { t: MapTopic }) => {
    const s = stats[t.title];
    const up = upHere(t);
    // 교재 밖 토픽의 숫자는 조사 때 묶인 문항 수 — 이름 열쇠로 다시 세면 넓은 이름이 딴 문항까지 센다
    const n = t.exam ? (mode === "heat" ? t.exam.past : t.exam.n) : mode === "heat" ? s?.past ?? 0 : hits(s);
    const fr = mode === "frame" ? frameOf(t.title) : undefined;
    const color =
      mode === "frame"
        ? fr
          ? FRAME_BY_CODE[fr.group].cls
          : "border-slate-200 bg-white text-slate-400"
        : mode === "heat"
          ? heatCls(n)
          : t.exam
            ? EXAM_CHIP
            : PRI_CHIP[t.priority ?? "하"] ?? PRI_CHIP.하;
    const isSel = sel === t.title;
    return (
      <button
        onClick={() => pick(t)}
        title={`${t.title}${t.exam ? `\n교재 밖 토픽 — 기출 ${t.exam.past} · 전체 ${t.exam.n}문항${t.exam.legacy ? " · 예전 토픽 화면 있음" : ""}` : ""}${up ? `\n${up.rel} ← ${short(up.parent)}: ${up.why}` : ""}${t.summary ? `\n${t.summary}` : ""}`}
        className={`rounded-full border text-left leading-tight transition hover:shadow ${t.exam ? "px-2 py-0.5 text-[11.5px]" : "px-2.5 py-1 text-[12.5px]"} ${color} ${
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
        {up && <span className="mr-0.5 text-[10px] opacity-60">{REL_MARK[up.rel]}</span>}
        {short(t.title)}
        {n > 0 && <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup>}
        {(t.sub || t.exam) && !s?.ans && !s?.com && <span className="ml-0.5 text-[9px] opacity-60">○</span>}
        {!!s?.mine && <span className="ml-0.5 text-[10px]" title="내가 정리한 토픽">📝</span>}
      </button>
    );
  };

  // 상위 토픽 + 그 아래 하위 토픽(오른쪽 세로줄 안) — 하위가 또 하위를 가질 수 있다(최대 4단)
  const Family = ({ t, color, depth = 0 }: { t: MapTopic; color: string; depth?: number }) => {
    const kids = depth < 4 ? kidsOf(t.title) : [];
    // 토픽 안 갈래 — 교재 표의 종류·구성(topicInner)과 서브 토픽(subTopics). 갈래를 접으면 서브 토픽만 남는다
    const inner = innerOf(t.title);
    const nodes = showInner ? inner : flatSubs(inner);
    if (!kids.length && !nodes.length) return <Chip t={t} />;
    // 하위 토픽은 상위 칩 아래 들여쓴 줄에 — 옆으로 붙이면 깊어질수록 칸이 좁아져 글자가 세로로 섰다
    return (
      <div className="w-full min-w-0">
        <Chip t={t} />
        <div className="ml-3 mt-1 flex min-w-0 flex-wrap items-center gap-1.5 border-l-2 pb-0.5 pl-3" style={{ borderColor: color }}>
          {nodes.map((n, i) => (
            <Branch key={`${n.name}-${i}`} node={n} parent={t.title} />
          ))}
          {kids.map((k) => (
            <Family key={k.title} t={k} color={color} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  };

  // 갈래 한 마디 — 서브 토픽이면 그 화면으로 가는 칩, 아니면 교재 표 속 이름(글자만)
  const Leaf = ({ node, parent, head }: { node: InnerNode; parent: string; head?: boolean }) => {
    if (node.sub) {
      const s = stats[node.sub.name];
      const n = mode === "heat" ? s?.past ?? 0 : hits(s);
      return (
        <Link
          href={topicHref(node.sub.name)}
          title={`교재 속 서브 토픽 — ${short(parent)} 표 안의 개념${s ? `\n기출 ${s.past} · NS ${s.ns} · 모의 ${s.mock}` : ""}`}
          className="rounded-full border border-dashed border-teal-400 bg-teal-50 px-2 py-0.5 text-[11.5px] leading-tight text-teal-900 hover:bg-teal-100"
        >
          🔎 {short(node.sub.name)}
          {n > 0 && <sup className="ml-0.5 text-[9px] opacity-70">{n}</sup>}
        </Link>
      );
    }
    return (
      <span
        title={`교재 표 속 갈래 — ${short(parent)}`}
        className={`rounded-md border px-1.5 py-0.5 text-[11px] leading-tight ${
          head ? "border-slate-300 bg-white font-semibold text-slate-700" : "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        {node.name}
      </span>
    );
  };
  // 갈래 가지 — 잎만 달린 가지는 한 줄(가지 › 잎 잎 잎), 가지가 또 달리면 세로줄 안에 내려 쓴다
  const Branch = ({ node, parent }: { node: InnerNode; parent: string }) => {
    if (!node.kids.length) return <Leaf node={node} parent={parent} />;
    if (node.kids.some((k) => k.kids.length))
      return (
        <div className="w-full min-w-0">
          <Leaf node={node} parent={parent} head />
          <div className="ml-2 mt-1 flex min-w-0 flex-wrap items-center gap-1 border-l border-slate-200 pl-2">
            {node.kids.map((k, i) => (
              <Branch key={`${k.name}-${i}`} node={k} parent={parent} />
            ))}
          </div>
        </div>
      );
    return (
      <div className="flex w-full min-w-0 flex-wrap items-start gap-1 sm:flex-nowrap">
        <span className="flex shrink-0 items-center gap-1">
          <Leaf node={node} parent={parent} head />
          <span className="text-[10px] text-slate-400">›</span>
        </span>
        {/* 넓은 화면은 잎이 가지 이름 오른쪽 칸 안에서 줄을 바꾼다. 좁은 화면은 칸을 풀어 가지 이름과 한 흐름으로 */}
        <div className="contents min-w-0 flex-1 flex-wrap items-center gap-1 sm:flex">
          {node.kids.map((k, i) => (
            <Leaf key={`${k.name}-${i}`} node={k} parent={parent} />
          ))}
        </div>
      </div>
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
      <div className="flex min-w-0 flex-col">
        <button
          onClick={() => toggle(key, !overview)}
          className="flex w-full shrink-0 items-center justify-between gap-1 rounded-lg border-2 bg-white px-2.5 py-1 text-left text-[12.5px] font-bold sm:w-56"
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
            <span className="ml-4 h-2 w-0.5" style={{ background: color }} />
            <div
              className="ml-4 flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl border border-dashed px-2 py-1.5"
              style={{ borderColor: color }}
            >
              {groupsIn(a.items).map((g) => (
                <div
                  key={g.name || "-"}
                  className="flex w-full min-w-0 flex-col gap-1 border-b border-dashed border-slate-100 pb-1.5 last:border-0 last:pb-0 sm:flex-row sm:items-start"
                >
                  {/* 분류 — 영역 아래 2단계. 왼쪽 칸에 이름, 오른쪽에 그 분류의 토픽 */}
                  {g.name && (
                    <span
                      className="mt-0.5 w-fit shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold sm:w-28"
                      style={{ color, background: `${color}14` }}
                    >
                      {g.name}
                    </span>
                  )}
                  <div className="flex min-w-0 flex-1 flex-wrap items-start gap-1.5">
                    {g.items.map((t) => {
                      const up = upHere(t);
                      if (!up) return <Family key={t.title} t={t} color={color} />;
                      // 상위가 같은 영역이면 그 아래에만 그린다. 다른 영역이면(두 과목에 실린 토픽) 자리표만 남긴다
                      if (a.items.some((x) => x.title === up.parent)) return null;
                      return (
                        <button
                          key={t.title}
                          onClick={() => pick(t)}
                          title={`${up.rel} · ${up.why}`}
                          className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11.5px] leading-tight text-slate-500 hover:bg-slate-50"
                        >
                          {short(t.title)} <span className="text-slate-400">↑ {short(up.parent)} 아래</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
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
                {c === "전체" ? doms.reduce((n, d) => n + byCat(d).length, 0) : byCat(c).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 요약 + 색 기준 + 펼치기 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <p className="text-xs text-slate-600">
          <b className="text-slate-900">{overview ? "전체 도메인" : cat}</b> · 토픽 {list.length}
          {nExam > 0 && <span className="text-amber-700"> (교재 {list.length - nExam} + 교재 밖 {nExam})</span>}
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
          {lv == null && (
            <button
              onClick={() => setShowExam(!showExam)}
              title="기출·모의고사에 나오지만 교재에 쪽이 없는 주제를 지도에 함께 보인다"
              className={`rounded-md border px-2 py-1 text-[11px] ${showExam ? "border-amber-500 bg-amber-500 text-white" : "border-slate-200 text-slate-500"}`}
            >
              📜 교재 밖 토픽 {showExam ? "감추기" : "보이기"}
            </button>
          )}
          {!overview && lv == null && (
            <button
              onClick={() => setShowInner(!showInner)}
              title="토픽 아래에 교재 표의 종류·구성을 펼쳐 보인다"
              className={`rounded-md border px-2 py-1 text-[11px] ${showInner ? "border-slate-700 bg-slate-700 text-white" : "border-slate-200 text-slate-500"}`}
            >
              🌿 갈래 {showInner ? "접기" : "펴기"}
            </button>
          )}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
            {[
              { k: "priority" as const, label: "중요도" },
              { k: "heat" as const, label: "출제 빈도" },
              { k: "frame" as const, label: "🧩 답안 틀" },
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
        ) : mode === "frame" ? (
          FRAME_GROUPS.map((g) => (
            <span key={g.code} className={`rounded-full border px-2 py-0.5 ${g.cls}`}>
              {g.code} {g.name}
            </span>
          ))
        ) : (
          HEAT_STEPS.map((h) => (
            <span key={h.label} className={`rounded-full border px-2 py-0.5 ${h.cls}`}>
              {h.label}
            </span>
          ))
        )}
        <span className="ml-1">
          {overview
            ? `· 영역 칩 숫자 = 토픽 수 · 색 = ${mode === "heat" ? "토픽당 평균 기출" : mode === "frame" ? "개념도 그룹" : "상 토픽 3개 이상 상 / 1개 이상 중"} · 영역을 누르면 그 과목 지도`
            : mode === "frame"
              ? "· 색 = 개념도 그룹(같은 색 = 같은 2단락 틀) · 토픽을 누르면 돌려막기 묶음·3단락 유형이 오른쪽에 · 흰 칩 = 아직 틀 안 정함"
              : `· 숫자 = ${mode === "heat" ? "기술사 기출 횟수" : "출제 횟수(기출·NS·모의)"} · ○ = 모범답안·해설 없음 · 점선 = 교재 정리 전 · 세로줄 안 = 하위 토픽(⊂ 종류 ◇ 구성·기법 ⚠ 문제·해결 ↗ 확장·발전) · 🔎 = 교재 표 속 서브 토픽 · 회색 글자 = 교재 표 속 갈래(가지 › 잎) · 노란 작은 칩 = 교재 밖 토픽(기출·모의고사에만 나옴)`}
        </span>
      </div>

      {/* 🧩 돌려막기 묶음 — 같은 틀로 이름·항목만 갈아끼우는 토픽끼리(과목 지도에서만) */}
      {mode === "frame" && !overview && (() => {
        const code = DOMAINS.find((d) => d.label === cat)?.code;
        const fams = code ? familiesOf(code) : [];
        if (!fams.length) return null;
        return (
          <div className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-bold text-slate-800">
              🔁 돌려막기 묶음 {fams.length}개 <span className="font-normal text-slate-400">· 묶음 안에서는 1단락 정의 틀·2단락 표 틀·3단락 꼴을 그대로 두고 이름·항목만 바꾼다</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {fams.map((f) => (
                <div key={f.name} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2">
                  <p className="text-[11px] font-semibold text-slate-700">
                    <span className={`mr-1 rounded-full border px-1.5 py-0.5 text-[10px] ${FRAME_BY_CODE[f.group].cls}`}>{f.group}</span>
                    {f.name} <span className="font-normal text-slate-400">{f.topics.length}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {f.topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSel(t)}
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${sel === t ? "ring-2 ring-brand-600" : ""} ${FRAME_BY_CODE[f.group].cls}`}
                      >
                        {short(t)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 과목 지도 → 레벨 맵(토픽 아래 키워드 단계) */}
      {!overview && lmaps.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setLv(null)}
            className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${lv == null ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`}
          >
            🌳 토픽 가지
          </button>
          <span className="text-[11px] text-slate-400">🧩 레벨 맵</span>
          {lmaps.map((m, i) => (
            <button
              key={m.no}
              onClick={() => setLv(i)}
              title={m.sub}
              className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${lv === i ? "border-[#7a1f3d] bg-[#7a1f3d] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#7a1f3d]"}`}
            >
              <span className="mr-1 opacity-60">{String(m.no).padStart(2, "0")}</span>
              {m.title.replace(/\s*\(.*\)\s*$/, "")}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${lmap ? "" : "lg:grid-cols-[minmax(0,1fr)_300px]"}`}>
        {/* 구조도 — 레벨 맵은 넓어서 한 칸을 다 쓰고, 토픽 정보는 아래에서 올라온다 */}
        <div className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 ${lmap ? "!p-0 border-0 bg-transparent" : ""}`}>
          {lmap ? (
            <LevelMatrix
              m={lmap}
              course={cat}
              total={lmaps.length}
              hits={(c) => chipHits[`${chipKey(c)}|${chipTopic(c) ?? ""}`] ?? 0}
              sel={sel}
              onPick={(t) => {
                setSel(sel === t ? null : t);
                setShowTables(false);
              }}
            />
          ) : overview ? (
            <Twigs color="#0f172a">
              {doms.map((c, di) => {
                const color = BRANCH[di % BRANCH.length];
                const areas = areasOf(byCat(c));
                const hit = query ? byCat(c).filter(match).length : 0;
                if (query && !hit) return null;
                const top = byCat(c).filter((t) => t.priority === "상").length;
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
                        {byCat(c).length} · 상{top}
                        {(() => {
                          const n = LEVEL_MAPS[DOMAINS.find((d) => d.label === c)?.code ?? ""]?.length;
                          return n ? ` · 🧩${n}` : "";
                        })()}{" "}
                        ›
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
            <div className="flex min-w-0 flex-col">
              {/* 과목 → 영역(가지) → 영역 칸 안에 분류 | 토픽. 영역 이름을 칸 위에 두어 토픽 칩이 가로 폭을 다 쓴다 */}
              <div className="flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow">
                {cat}
              </div>
              <span className="ml-4 h-2 w-0.5 bg-slate-900" />
              <div className="ml-4 min-w-0 flex-1">
                <Twigs color="#0f172a" atTop>
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
          className={
            lmap
              ? `${selected ? "fixed bottom-0 right-0 z-30 max-h-[60vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:right-4 sm:w-[360px]" : "hidden"} border border-slate-200 bg-white p-4`
              : `${
                  selected ? "fixed inset-x-0 bottom-0 z-30 max-h-[60vh] overflow-y-auto rounded-t-2xl shadow-2xl" : "hidden"
                } border border-slate-200 bg-white p-4 lg:sticky lg:top-20 lg:z-auto lg:block lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:rounded-2xl lg:shadow-sm`
          }
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
                  {selected.group && <> › {selected.group}</>}
                  {selected.priority && <> · 중요도 {selected.priority}</>}
                  {selected.level && <> · {selected.level}</>}
                </p>
                <button onClick={() => setSel(null)} className="rounded-md border border-slate-200 px-1.5 text-xs text-slate-500">
                  ✕
                </button>
              </div>
              <h3 className="mt-0.5 font-bold text-slate-900">{selected.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {selected.exam
                  ? `교재 밖 토픽 — 교재에 쪽이 없고 기출·모의고사에만 나온 주제입니다(조사 때 기출 ${selected.exam.past} · 전체 ${selected.exam.n}문항).${selected.exam.legacy ? " 예전(기필반) 토픽 화면이 있습니다." : " 아직 정리한 내용이 없어 화면에는 출제 문항과 답안·해설만 모입니다."}`
                  : selected.summary || "교재 정리 전 — CONTENTS 에만 있는 토픽"}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
                {[
                  ["📜 기출", st?.past ?? 0],
                  ["🛡️ NS", st?.ns ?? 0],
                  ["🏁 모의", st?.mock ?? 0],
                  ["✍️ 답안", st?.ans ?? 0],
                  ["📘 해설", st?.com ?? 0],
                  ["📝 내 정리", st?.mine ?? 0],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg bg-slate-50 px-1 py-1">
                    <div className="text-slate-400">{k}</div>
                    <div className="font-bold text-slate-800">{v}</div>
                  </div>
                ))}
              </div>
              {selected.exam && (
                <Link
                  href={topicHref(selected.title)}
                  className="mt-3 block rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-amber-600"
                >
                  {selected.exam.legacy ? "예전 토픽 화면 · 출제 문항 →" : "출제 문항 · 답안·해설 보기 →"}
                </Link>
              )}
              {selected.sub && (
                <Link
                  href={topicHref(selected.title)}
                  className="mt-3 block rounded-lg bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700"
                >
                  토픽 설명 · 답안지 템플릿 →
                </Link>
              )}
              {selected.sub && code && (
                <Link
                  href={commuteHref(code, selected.title)}
                  className="mt-2 block rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
                >
                  🚇 여기서부터 술술 읽기 →
                </Link>
              )}
              <FrameCard title={selected.title} compact />
              {(() => {
                const up = parentLink(selected.title);
                const downs = childLinks(selected.title);
                if (!up && !downs.length) return null;
                const jump = (title: string) => {
                  const other = ALL_MAP_TOPICS.find((x) => x.t.title === title);
                  if (other && !overview && other.cat !== cat) setCat(other.cat);
                  setSel(title);
                };
                return (
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    {up && (
                      <p>
                        <span className="font-semibold text-slate-500">⬆ 상위 토픽 </span>
                        <button onClick={() => jump(up.parent)} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-700">
                          {short(up.parent)}
                        </button>{" "}
                        <span className="text-slate-400">
                          {REL_MARK[up.rel]} {up.rel} · {up.why}
                        </span>
                      </p>
                    )}
                    {downs.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-500">⬇ 하위 토픽</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {downs.map((d) => (
                            <button
                              key={d.child}
                              onClick={() => jump(d.child)}
                              title={`${d.rel} · ${d.why}`}
                              className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-700"
                            >
                              <span className="mr-0.5 opacity-60">{REL_MARK[d.rel]}</span>
                              {short(d.child)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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
