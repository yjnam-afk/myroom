"use client";

import { useState } from "react";
import Link from "next/link";
import { compareSets } from "@/data/compareSets";
import { CMP_CATS, explainHref, hasAnyData } from "./mapData";

/* ─────────────── 비교 뷰 ─────────────── */
export function CompareView({
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
