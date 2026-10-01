"use client";

import { useState } from "react";
import Link from "next/link";
import Markdown from "@/components/Markdown";

export type ModelListItem = {
  id: string;
  period: string;
  title: string;
  question: string;
  source: string;
};

type Loaded = { answer: string; source: string } | { error: string };

/**
 * 클로드 모범답안 줄 목록 — 누르면 /api/model-answer 에서 본문을 받아 펼친다.
 * 「✍️ 모범답안」 화면에서 쓴다(토픽 화면은 본문을 미리 실어 TopicModelAnswers 로 그린다).
 */
export default function ModelAnswerList({ items }: { items: ModelListItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, Loaded>>({});

  const toggle = async (id: string) => {
    if (open === id) return setOpen(null);
    setOpen(id);
    if (cache[id]) return;
    try {
      const r = await fetch(`/api/model-answer?id=${encodeURIComponent(id)}`);
      const j = await r.json();
      setCache((c) => ({ ...c, [id]: r.ok ? j : { error: j.error || "불러오지 못했어요" } }));
    } catch {
      setCache((c) => ({ ...c, [id]: { error: "불러오지 못했어요" } }));
    }
  };

  return (
    <div className="divide-y divide-amber-100 overflow-hidden rounded-2xl border-2 border-amber-300 bg-white">
      {items.map((a) => {
        const isOpen = open === a.id;
        const got = cache[a.id];
        return (
          <div key={a.id}>
            <button
              type="button"
              onClick={() => toggle(a.id)}
              className="flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-amber-50/60"
            >
              <span className="mt-0.5 text-amber-400">{isOpen ? "▾" : "▸"}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                    {a.period}
                  </span>
                  <span className="truncate text-xs text-slate-400">
                    {a.source}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line text-[15px] font-bold leading-snug text-slate-900">
                  {a.question}
                </p>
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-amber-100 bg-amber-50/40 px-5 py-4">
                {!got ? (
                  <p className="text-sm text-slate-400">불러오는 중…</p>
                ) : "error" in got ? (
                  <p className="text-sm text-rose-600">{got.error}</p>
                ) : (
                  <>
                    <div className="mb-3 rounded-md bg-white px-2.5 py-1 text-[11px] text-amber-700 ring-1 ring-amber-200">
                      🧾 근거: {got.source}
                    </div>
                    <article className="rounded-xl bg-white p-5 md:p-6">
                      <Markdown>{got.answer}</Markdown>
                    </article>
                    <Link
                      href={`/answer?id=${encodeURIComponent(a.id)}`}
                      className="mt-2 inline-block text-xs font-semibold text-amber-700 hover:underline"
                    >
                      이 문제로 답안 연습하기 →
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
