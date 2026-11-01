"use client";

import { useState } from "react";
import Markdown from "@/components/Markdown";

type Loaded = { kind: "hand" | "gen"; source: string; answer: string } | { kind: "none" } | { kind: "error" };

/**
 * 「📘 클로드 모범답안 보기 / 🧩 교재 조립 답안 보기」 — 펼칠 때 /api/exam-answer 에서 본문을 받는다.
 * (2026-11-01 정리: 17MB 짜리 두 JSON 을 브라우저에 싣지 않으려고)
 */
export default function ClaudeAnswer({ id, hand }: { id: string; hand: boolean }) {
  const [data, setData] = useState<Loaded | null>(null);
  const load = () => {
    if (data) return;
    fetch(`/api/exam-answer?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d: Loaded) => setData(d))
      .catch(() => setData({ kind: "error" }));
  };
  return (
    <details className="mt-3 pl-9" onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && load()}>
      <summary className={`cursor-pointer text-xs font-semibold hover:underline ${hand ? "text-amber-700" : "text-slate-500"}`}>
        {hand ? "📘 클로드 모범답안 보기" : "🧩 교재 조립 답안 보기 (자동 생성 · 참고용)"}
      </summary>
      <div className={`mt-2 rounded-xl border p-4 ${hand ? "border-amber-200 bg-amber-50/40" : "border-slate-200 bg-slate-50/60"}`}>
        {!data && <p className="text-xs text-slate-400">불러오는 중…</p>}
        {data?.kind === "error" && <p className="text-xs text-rose-500">답안을 불러오지 못했어요. 다시 펼쳐 보세요.</p>}
        {data?.kind === "none" && <p className="text-xs text-slate-400">답안이 없어요.</p>}
        {data && (data.kind === "hand" || data.kind === "gen") && (
          <>
            <div className={`mb-2 rounded-md bg-white px-2.5 py-1 text-[10px] ring-1 ${hand ? "text-amber-700 ring-amber-200" : "text-slate-500 ring-slate-200"}`}>
              🧾 근거: {data.source}
            </div>
            <article className="rounded-lg bg-white p-4">
              <Markdown>{data.answer}</Markdown>
            </article>
          </>
        )}
      </div>
    </details>
  );
}
