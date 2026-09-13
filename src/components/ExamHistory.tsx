"use client";

import { useState } from "react";
import { examHistory, summarize, ym } from "@/lib/examHistory";
import { AppearanceList } from "./ExamHistoryList";

/**
 * NS 주간 모의고사 출제 이력 배지.
 *
 * 빈도와 최근성을 한눈에: "🛡️ 3회 · 26.05". 최근 1년에 2번 이상이거나
 * 통산 4번 이상이면 붉게 칠해 "꼭 볼 것"으로 띄운다. 누르면 언제·몇 교시에
 * 어떤 문구로 나왔는지 펼친다.
 */
/** 학습계획 줄에 붙는 작은 칩. 이력이 없으면 아무것도 그리지 않는다. */
export function ExamHistoryChip({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const hist = examHistory(title);
  if (hist.length === 0) return null;
  const s = summarize(hist);
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title={`NS 주간 모의고사 출제 ${s.count}회 · 최근 ${s.latest}`}
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
          s.must
            ? "bg-rose-100 text-rose-700"
            : s.recent > 0
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        🛡️{s.count} · {ym(s.latest)}
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-30 mt-1 w-80 max-w-[85vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">
            <span>
              🛡️ NS 모의고사 {s.count}회 출제
              {s.recent > 0 && <span className="ml-1 text-rose-600">· 최근 1년 {s.recent}회</span>}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            <AppearanceList items={hist} />
          </div>
        </div>
      )}
    </span>
  );
}
