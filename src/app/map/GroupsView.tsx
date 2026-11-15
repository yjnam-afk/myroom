"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { LEVEL_STYLE, LEVEL_HINT } from "@/lib/studyPlan";
import SourceBadge from "@/components/SourceBadge";
import { explainHref as topicHref } from "@/lib/links";
import { CATS, IMP_BADGE, type Topic, cleanGroup } from "./mapData";

/* ─────────────── 묶음 뷰 (예전 토픽) ─────────────── */
export function GroupsView({
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
                          href={topicHref(t.title)}
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
