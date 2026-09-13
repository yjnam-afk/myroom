"use client";

import Link from "next/link";
import type { SubnoteExtra } from "@/data/subnoteExtras";

/**
 * 학습 카드 — 쉬운 말↔용어 매핑 → 옆 토픽 → 답안 한 줄.
 *
 * "쉽게 이해하기" 머리말과 줄글 설명(실제 동작·왜 필요한가·실전 쓰임·비유)은
 * 전부 뺐다 — 풀어 쓴 설명은 이해에 도움이 안 된다는 피드백. 남긴 건 시험 용어
 * 매핑표, 옆 토픽 링크, 답안 한 줄처럼 구조화된 것뿐이다.
 * 자료(extra)는 서버(explainData)가 골라 props 로 준다.
 */
export default function StudyCard({ extra }: { extra?: SubnoteExtra }) {
  const g = extra?.guide;

  if (!g) return null;

  return (
    <section className="mb-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* 1. 쉬운 말 ↔ 진짜 용어 — 풀어 쓴 말에 시험 용어를 붙여 준다 */}
      {g.map.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-bold text-slate-500">
            🧩 쉬운 말을 시험 용어로 바꿔 보면
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {g.map.map((m, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 gap-1 p-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.6fr)] sm:items-baseline sm:gap-3 ${
                  i % 2 ? "bg-slate-50/70" : "bg-white"
                }`}
              >
                <span className="text-sm text-slate-500">{m.as}</span>
                <span className="hidden text-slate-300 sm:inline">→</span>
                <span>
                  <b className="text-[15px] font-bold text-brand-700">{m.real}</b>
                  {m.note && (
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-600">
                      {m.note}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 옆 토픽 — 지식은 낱개가 아니라 그물로 저장된다 */}
      {g.links.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-bold text-slate-500">
            🔗 이 토픽만 따로 외우지 마세요
          </div>
          <div className="space-y-2">
            {g.links.map((l, i) => (
              <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                <Link
                  href={`/explain?topic=${encodeURIComponent(l.topic)}`}
                  className="text-sm font-bold text-emerald-800 hover:underline"
                >
                  {l.topic} →
                </Link>
                <p className="mt-1 text-[13.5px] leading-relaxed text-slate-700">{l.how}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 답안 한 줄 — 인출 목표 */}
      <div className="rounded-xl border-2 border-brand-300 bg-brand-50/70 p-4">
        <div className="mb-1.5 text-xs font-bold text-brand-700">✍️ 시험지엔 이렇게 씁니다</div>
        <p className="text-[15px] font-medium leading-[1.95] text-slate-900">{g.exam}</p>
      </div>
    </section>
  );
}

