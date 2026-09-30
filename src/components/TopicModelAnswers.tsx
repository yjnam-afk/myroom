"use client";

import { useState } from "react";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import type { TopicAnswer } from "@/lib/explainData";

/**
 * 토픽 화면의 「클로드 모범답안」 — 이 토픽으로 출제된 문제마다 미리 써 둔 답안.
 *
 * 답안은 문제 id 에 매달려 있어 토픽 화면에서는 보이지 않았다. 아래 「✍️ 모범답안」은
 * 사람이 쓴 시험지 스캔만 보여 주므로, 스캔이 없는 토픽(하네스·컨텍스트 엔지니어링,
 * LoRA, 프롬프트 인젝션 …)은 답안이 아예 없는 것처럼 보였다.
 */
export default function TopicModelAnswers({ items }: { items: TopicAnswer[] }) {
  const [open, setOpen] = useState<string | null>(items.length === 1 ? items[0].id : null);
  if (items.length === 0) return null;
  return (
    <section className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50 shadow-sm">
      <div className="px-5 py-3 text-sm font-bold text-amber-800">
        📘 클로드 모범답안 {items.length}건 — 이 토픽으로 나온 문제별 답안
      </div>
      <div className="divide-y divide-amber-100 bg-white">
        {items.map((a) => {
          const isOpen = open === a.id;
          return (
            <div key={a.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : a.id)}
                className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-amber-50/60"
              >
                <span className="mt-0.5 text-amber-400">{isOpen ? "▾" : "▸"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                      {a.period}
                    </span>
                    {a.kind && <span className="text-xs text-slate-400">· {a.kind}</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-[15px] font-bold leading-snug text-slate-900">
                    {a.question}
                  </p>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-amber-100 bg-amber-50/40 px-5 py-4">
                  {a.source && (
                    <div className="mb-3 rounded-md bg-white px-2.5 py-1 text-[11px] text-amber-700 ring-1 ring-amber-200">
                      🧾 근거: {a.source}
                    </div>
                  )}
                  <article className="rounded-xl bg-white p-5 md:p-6">
                    <Markdown>{a.answer}</Markdown>
                  </article>
                  <Link
                    href={`/answer?id=${encodeURIComponent(a.id)}`}
                    className="mt-2 inline-block text-xs font-semibold text-amber-700 hover:underline"
                  >
                    이 문제로 답안 연습하기 →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
