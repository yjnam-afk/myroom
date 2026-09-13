"use client";

import { useState } from "react";
import Link from "next/link";
import {
  summarize,
  type ExamAppearance,
  type PastAppearance,
} from "@/lib/examHistoryUtil";
import { AppearanceList } from "./ExamHistoryList";

/**
 * 기술사 기출 목록 — "140회 1교시 6번" 꼴로 몇 회에 어떤 문제로 나왔는지.
 * NS 출제 이력 아래에 붙는다. 문제 전문을 줄바꿈 그대로 보여준다.
 */
function PastExamList({ items }: { items: PastAppearance[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((p) => (
        <li key={p.id} className="px-5 py-3 text-[13px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-bold text-indigo-700">
              {p.round}회
            </span>
            <span className="text-slate-500">
              {p.period} {p.no}번
            </span>
          </div>
          <p className="mt-1 whitespace-pre-line break-words leading-relaxed text-slate-800">
            {p.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * 토픽 설명 화면의 카드. NS 이력도 기출도 없으면 아무것도 그리지 않는다.
 * 이력은 서버(explainData)에서 찾아 props 로 받는다 — 문제은행을 번들에 싣지 않기 위해.
 */
export function ExamHistoryCard({
  hist,
  past,
}: {
  hist: ExamAppearance[];
  past: PastAppearance[];
}) {
  const [all, setAll] = useState(false);
  const [allPast, setAllPast] = useState(false);
  if (hist.length === 0 && past.length === 0) return null;
  const s = summarize(hist);
  const shown = all ? hist : hist.slice(0, 5);
  const shownPast = allPast ? past : past.slice(0, 5);
  return (
    <section
      className={`mb-6 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
        s.must ? "border-rose-300" : "border-slate-200"
      }`}
    >
      {hist.length > 0 && (
        <>
          <div className={`px-5 py-3 ${s.must ? "bg-rose-50" : "bg-slate-50"}`}>
            <h3 className="text-sm font-bold text-slate-800">
              🛡️ NS 주간 모의고사 출제 {s.count}회
              {s.recent > 0 && (
                <span className="ml-2 rounded bg-rose-600 px-1.5 py-0.5 text-[11px] text-white">
                  최근 1년 {s.recent}회
                </span>
              )}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {s.must
                ? "자주 나오거나 최근에 나온 토픽입니다. 이번 주에 꼭 한 번 더 보세요."
                : `마지막 출제 ${s.latest}. 어떤 문구로 나왔는지 확인해 두세요.`}
            </p>
          </div>
          <AppearanceList items={shown} full />
          {hist.length > 5 && (
            <div className="border-t border-slate-100 px-4 py-2 text-xs">
              <button
                type="button"
                onClick={() => setAll((v) => !v)}
                className="font-medium text-brand-700 hover:underline"
              >
                {all ? "접기" : `${hist.length - 5}건 더 보기`}
              </button>
            </div>
          )}
        </>
      )}

      {/* 기술사 기출 — 몇 회 몇 교시 몇 번으로 나왔나 */}
      {past.length > 0 && (
        <>
          <div className={`px-5 py-3 ${hist.length > 0 ? "border-t border-slate-100" : ""} bg-indigo-50/60`}>
            <h3 className="text-sm font-bold text-slate-800">📜 기술사 기출 {past.length}회</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {past[0].round}회가 가장 최근. 회차·교시·번호와 문제 문구입니다.
            </p>
          </div>
          <PastExamList items={shownPast} />
          {past.length > 5 && (
            <div className="border-t border-slate-100 px-4 py-2 text-xs">
              <button
                type="button"
                onClick={() => setAllPast((v) => !v)}
                className="font-medium text-brand-700 hover:underline"
              >
                {allPast ? "접기" : `${past.length - 5}건 더 보기`}
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-end border-t border-slate-100 px-4 py-2 text-xs">
        <Link href="/exam" className="text-slate-400 hover:text-slate-600">
          📝 문제 풀이에서 보기 →
        </Link>
      </div>
    </section>
  );
}
