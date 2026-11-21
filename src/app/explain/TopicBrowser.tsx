"use client";

import { useEffect, useState } from "react";
import type { BrowseGroup, BrowseItem } from "@/lib/explainIndex";
import ClearButton from "@/components/ClearButton";
import PriorityBadge from "@/components/PriorityBadge";
import { LevelBadge, SRC_CHIP } from "./explainBits";

/**
 * 출제 이력 칩 — 학습계획의 📜기출·🛡️NS 칩과 같은 눈금이지만 정적이다.
 * 이 화면은 문제은행을 받지 않으므로(번들 22 MB 사고) 개수·최근만 서버가 세어 보낸다.
 * 자세한 문항 목록은 토픽을 열면 「출제 이력」 카드에 있다.
 */
export function HistChips({ it }: { it: BrowseItem }) {
  const tone = (must: boolean, recent: number) =>
    must ? "bg-rose-100 text-rose-700" : recent > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500";
  const past = it.past ?? 0;
  const pr = it.pastRecent ?? 0;
  const ns = it.ns ?? 0;
  const nr = it.nsRecent ?? 0;
  return (
    <>
      {past > 0 && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tone(pr >= 2 || past >= 3, pr)}`}
          title={`기술사 기출 ${past}회 · 최근 ${it.pastLast}회`}
        >
          📜기출 {past} · {it.pastLast}회
        </span>
      )}
      {ns > 0 && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tone(nr >= 2 || ns >= 4, nr)}`}
          title={`NS 주간 모의고사 출제 ${ns}회 · 최근 ${it.nsLast}`}
        >
          🛡️NS {ns} · {it.nsLast ? `${it.nsLast.slice(2, 4)}.${it.nsLast.slice(5, 7)}` : ""}
        </span>
      )}
    </>
  );
}

/** 학습계획 줄 모양의 토픽 한 줄 — 번호·중요도·제목·📖·출제 이력. 누르면 그 토픽을 연다. */
/** 목록 번호 — 서브 토픽 줄(subOf)은 번호를 먹지 않는다(학습계획 번호와 맞게) */
export function numbered(items: BrowseItem[]): [BrowseItem, number][] {
  let n = 0;
  return items.map((it) => [it, it.subOf ? 0 : ++n]);
}

/** 토픽 목록의 「📝 내가 정리한 토픽」 묶음 키 */
const MINE = "__mine";

/** 내가 정리한 토픽 표시(myNotes) — 토픽 목록·토픽 머리 */
export function MineChip() {
  return (
    <span
      className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-300"
      title="내가 정리한 토픽 — 토픽 화면 답안지 템플릿 아래에 정리 노트가 붙어 있어요"
    >
      📝 정리
    </span>
  );
}

function TopicRow({
  it,
  no,
  group,
  onPick,
}: {
  it: BrowseItem;
  no: number;
  group?: string;
  onPick: (t: string) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onPick(it.title)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-brand-50/60"
      >
        <span className="w-6 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-400">
          {it.subOf ? "" : no}
        </span>
        {it.subOf ? (
          <span className="shrink-0 pl-3 text-[12px] text-teal-600" title={`${it.subOf} 교재 표 안의 서브 토픽`}>
            └ 🔎
          </span>
        ) : (
          <>
            <PriorityBadge p={it.imp} />
            <LevelBadge level={it.lv} />
          </>
        )}
        <span className={`min-w-0 flex-1 truncate text-sm ${it.subOf ? "text-teal-800" : "text-slate-800"}`}>
          {it.title}
          {group && <span className="ml-1.5 text-[10px] text-slate-400">{group}</span>}
        </span>
        {it.src === "심화반" ? (
          <span
            className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
            title="교재 서브노트 원본 있음"
          >
            📖
          </span>
        ) : (
          it.src && (
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${SRC_CHIP[it.src] || ""}`}>
              {it.src}
            </span>
          )
        )}
        <HistChips it={it} />
        {it.mine && <MineChip />}
        <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
          💡
        </span>
      </button>
    </li>
  );
}

const BROWSE_KEY = "myroom:explainBrowse";
function readBrowse(): { sel?: string | null; legacy?: boolean } {
  try {
    return JSON.parse(sessionStorage.getItem(BROWSE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeBrowse(v: { sel: string | null; legacy: boolean }) {
  try {
    sessionStorage.setItem(BROWSE_KEY, JSON.stringify(v));
  } catch {
    // sessionStorage 가 막히면 기억하지 않는다(접힌 채 열림).
  }
}

export function TopicBrowser({
  allGroups,
  onPick,
}: {
  allGroups: BrowseGroup[];
  onPick: (title: string, opts?: { scrollTop?: boolean }) => void;
}) {
  // 처음엔 아무 도메인도 안 펼친다 — 칩 한 줄만 보이는 상태가 시작점.
  // 펼친 도메인·예전 토픽 토글은 이 탭에 적어 둔다(2026-10-22 — "목차로 돌아가기 할 때 목차가 열린 상태로").
  // 토픽을 골랐다 뒤로 오면 목록이 새로 그려져 도메인이 접혀 있었다.
  const [sel, setSel] = useState<string | null>(() => readBrowse().sel ?? null);
  const [filter, setFilter] = useState("");
  // 기본은 교재(심화반) 묶음만. 예전(기필반) 묶음은 토글로 편다.
  const [legacy, setLegacy] = useState(() => !!readBrowse().legacy);
  useEffect(() => writeBrowse({ sel, legacy }), [sel, legacy]);
  const groups = legacy ? allGroups : allGroups.filter((g) => g.badge === "심화반");

  const q = filter.trim().toLowerCase();
  // 걸러보기 입력 중에는 도메인 무관하게 맞는 토픽만 모아 한 판에 보여준다.
  const matched = q
    ? groups.flatMap((g) =>
        g.items
          .filter((it) => it.title.toLowerCase().includes(q))
          .map((it) => ({ ...it, group: g.label })),
      )
    : [];
  // 📝 내가 정리한 토픽 — 과목을 가로질러 한 판에 모은다
  const mineItems = groups.flatMap((g) => g.items.filter((it) => it.mine).map((it) => ({ ...it, group: g.label })));
  const selGroup = sel === MINE ? undefined : groups.find((g) => g.key === sel);

  // 새 토픽 머리로 올리는 건 주소가 바뀐 뒤(router.push scroll)에 한다. 누르자마자 부드럽게 올리면
  // 아직 목록 주소인 채로 스크롤이 0까지 내려가, 뒤로 왔을 때 보던 자리 대신 맨 위로 돌아왔다(2026-10-22).
  const pick = (t: string) => onPick(t, { scrollTop: true });

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-700">
          📂 도메인별 토픽 목록{" "}
          <span className="font-normal text-slate-400">
            ({groups.reduce((n, g) => n + g.items.filter((it) => !it.subOf).length, 0)}개)
          </span>
        </h3>
        <div className="relative">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="목록 안에서 걸러보기"
            className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 pr-8 text-xs focus:border-brand-500 focus:outline-none"
          />
          <ClearButton value={filter} onClear={() => setFilter("")} className="right-1.5 top-1 h-5 w-5 text-[10px]" />
        </div>
      </div>

      {q ? (
        // 걸러보기 결과 — 도메인 구분 없이 한 판. 카드 안 스크롤 없이 전부 펼친다.
        <div className="p-4">
          {matched.length ? (
            <ol className="divide-y divide-slate-100">
              {matched.map((m, i) => (
                <TopicRow key={m.group + m.title} it={m} no={i + 1} group={m.group} onPick={pick} />
              ))}
            </ol>
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">
              “{filter}”와 맞는 토픽이 목록에 없어요.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* 도메인 칩 — 여기서 하나를 고르면 그 도메인만 아래에 펼쳐진다. */}
          <div className="flex flex-wrap gap-1.5 p-4">
            {groups.map((g) => {
              const active = sel === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setSel(active ? null : g.key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : g.badge === "심화반"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {g.label}
                  <span
                    className={`font-normal ${active ? "text-brand-100" : "text-slate-400"}`}
                  >
                    {g.items.filter((it) => !it.subOf).length}
                  </span>
                </button>
              );
            })}
            {mineItems.length > 0 && (
              <button
                onClick={() => setSel(sel === MINE ? null : MINE)}
                title="내가 손으로 정리한 토픽만 모아 봅니다"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  sel === MINE
                    ? "border-amber-600 bg-amber-500 text-white"
                    : "border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-500"
                }`}
              >
                📝 내가 정리한 토픽
                <span className={`font-normal ${sel === MINE ? "text-amber-100" : "text-amber-500"}`}>{mineItems.length}</span>
              </button>
            )}
            {/* 기본은 교재 묶음만. 예전(기필반) 묶음은 회독 진도가 걸려 있어 토글 뒤에 둔다. */}
            <button
              onClick={() => { setLegacy(!legacy); setSel(null); }}
              title="심화반 교재에 없는 예전(기필반) 토픽 묶음까지 보여줍니다"
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                legacy
                  ? "border-slate-500 bg-slate-600 text-white"
                  : "border-dashed border-slate-300 bg-white text-slate-400 hover:border-slate-400"
              }`}
            >
              {legacy ? "예전 토픽 포함 중" : "+ 예전 토픽 포함"}
            </button>
          </div>

          {sel === MINE && (
            <div className="border-t border-amber-100">
              <ol className="divide-y divide-slate-100">
                {mineItems.map((it, i) => (
                  <TopicRow key={it.group + it.title} it={it} no={i + 1} group={it.group} onPick={pick} />
                ))}
              </ol>
            </div>
          )}
          {selGroup && (
            <div className="border-t border-slate-100">
              {/* 학습계획 줄과 같은 모양 — 계획 순서·번호·중요도·📖·📜 기출·🛡️ NS 이력.
                  카드 안에서 따로 스크롤하지 않는다 — 짧은 창에 목록이 갇혀 한 화면에
                  대여섯 줄만 보였다. 페이지가 길어지는 쪽이 낫다. */}
              <ol className="divide-y divide-slate-100">
                {numbered(selGroup.items).map(([it, no]) => (
                  <TopicRow key={it.title} it={it} no={no} onPick={pick} />
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </section>
  );
}
