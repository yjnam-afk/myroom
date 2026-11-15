"use client";

import type { ExplainNav } from "@/lib/explainData";

/**
 * 이전/다음 토픽 — 같은 과목 안에서 교재 순서대로 넘겨 본다.
 * 검색으로 하나 열고 나면 다음 토픽으로 가려고 목록을 다시 펼쳐야 했다. 위·아래 두 곳에 둔다.
 */
export function TopicNav({
  nav,
  onGo,
  where,
}: {
  nav: ExplainNav;
  onGo: (title: string, opts?: { scrollTop?: boolean }) => void;
  where: "top" | "bottom";
}) {
  const go = (t: string) => onGo(t, { scrollTop: where === "bottom" });
  return (
    <nav
      aria-label="이전·다음 토픽"
      className={`flex items-stretch gap-2 ${where === "top" ? "mt-4" : "mt-2 mb-6"}`}
    >
      <button
        type="button"
        disabled={!nav.prev}
        onClick={() => nav.prev && go(nav.prev)}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-brand-400 hover:bg-brand-50 disabled:cursor-default disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
      >
        <span className="shrink-0 text-slate-400">←</span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold text-slate-400">이전</span>
          <span className="block truncate font-medium text-slate-800">{nav.prev ?? "처음 토픽"}</span>
        </span>
      </button>
      <span className="hidden shrink-0 items-center px-1 text-[11px] tabular-nums text-slate-400 sm:flex">
        {nav.courseLabel} {nav.index}/{nav.total}
      </span>
      <button
        type="button"
        disabled={!nav.next}
        onClick={() => nav.next && go(nav.next)}
        className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-3 py-2 text-right text-sm hover:border-brand-400 hover:bg-brand-50 disabled:cursor-default disabled:opacity-40"
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-bold text-brand-600">다음</span>
          <span className="block truncate font-semibold text-slate-900">{nav.next ?? "마지막 토픽"}</span>
        </span>
        <span className="shrink-0 text-brand-500">→</span>
      </button>
    </nav>
  );
}
