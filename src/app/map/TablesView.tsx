"use client";

import { useState } from "react";
import Link from "next/link";
import { memoryTables } from "@/data/memoryTables";
import { TBL_CATS, explainHref, hasAnyData, isLinkableName } from "./mapData";

/* ─────────────── 암기표 뷰 ─────────────── */
export function TablesView({
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
export function TableCard({ t }: { t: (typeof memoryTables)[number] }) {
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
