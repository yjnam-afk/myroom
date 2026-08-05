"use client";

import Link from "next/link";
import { subnoteExtraFor } from "@/data/subnoteExtras";

/**
 * 학습 카드 — 처음 보는 개념을 ★이해 → 기억 → 인출★ 순서로 태운다.
 *
 * 용어를 용어로 설명하면 외워지지 않는다. 그래서 화면 순서를 고정한다.
 *  한 문장 → 한 장면(비유) → 왜 필요한가 → 비유↔용어 매핑 → 옆 토픽 → 답안 한 줄
 * guide 가 없는 토픽은 예전 줄글(easy)을 그대로 보여준다.
 */
export default function EasyCard({
  topicId,
  title,
}: {
  topicId?: string;
  title?: string;
}) {
  const extra = subnoteExtraFor(topicId, title);
  const g = extra?.guide;

  if (!g) {
    if (!extra?.easy) return null;
    return (
      <section className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-5">
        <h3 className="mb-2 text-sm font-bold text-amber-800">
          🍯 쉬운 설명 — 이게 무슨 소리냐면
        </h3>
        <p className="whitespace-pre-line text-[15px] leading-[1.9] text-slate-800">
          {extra.easy}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm">
      <div className="bg-amber-100/80 px-5 py-3">
        <h3 className="text-sm font-bold text-amber-900">
          🍯 쉽게 이해하기
        </h3>
        <p className="mt-1 text-[17px] font-bold leading-snug text-slate-900">
          {g.hook}
        </p>
      </div>

      <div className="space-y-5 p-5">
        {/* 1. 한 장면 — 그림이 그려지는 비유 */}
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-1.5 text-xs font-bold text-slate-500">
            🎬 이런 장면을 떠올려 보세요
          </div>
          <p className="text-[15px] leading-[1.95] text-slate-800">{g.scene}</p>
        </div>

        {/* 1.5 실제 동작 — 비유를 걷어내면 진짜로는 이렇게 돌아간다 */}
        {g.mechanism && (
          <div className="rounded-xl border-l-4 border-sky-300 bg-sky-50/60 p-4">
            <div className="mb-1.5 text-xs font-bold text-sky-700">
              ⚙️ 실제로는 이렇게 돌아갑니다
            </div>
            <p className="text-[15px] leading-[1.95] text-slate-800">
              {g.mechanism}
            </p>
          </div>
        )}

        {/* 2. 왜 필요한가 — 이유를 알면 안 잊는다 */}
        <div className="rounded-xl border-l-4 border-rose-300 bg-rose-50/60 p-4">
          <div className="mb-1.5 text-xs font-bold text-rose-700">
            🤔 이게 없으면 무슨 일이 나냐면
          </div>
          <p className="text-[15px] leading-[1.95] text-slate-800">{g.why}</p>
        </div>

        {/* 3. 비유 ↔ 진짜 용어 — 여기가 핵심. 비유에 용어를 붙여 준다 */}
        <div>
          <div className="mb-2 text-xs font-bold text-slate-500">
            🧩 비유를 시험 용어로 바꿔 보면
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
                  <b className="text-[15px] font-bold text-brand-700">
                    {m.real}
                  </b>
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

        {/* 3.5 실전 쓰임 — 어디에 있고, 시험엔 어떻게 나오나 */}
        {g.usage && (
          <div className="rounded-xl border-l-4 border-violet-300 bg-violet-50/60 p-4">
            <div className="mb-1.5 text-xs font-bold text-violet-700">
              💼 어디에 쓰이고, 시험엔 어떻게 나오냐면
            </div>
            <p className="text-[15px] leading-[1.95] text-slate-800">{g.usage}</p>
          </div>
        )}

        {/* 4. 옆 토픽 — 지식은 낱개가 아니라 그물로 저장된다 */}
        {g.links.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-bold text-slate-500">
              🔗 이 토픽만 따로 외우지 마세요
            </div>
            <div className="space-y-2">
              {g.links.map((l, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3"
                >
                  <Link
                    href={`/explain?topic=${encodeURIComponent(l.topic)}`}
                    className="text-sm font-bold text-emerald-800 hover:underline"
                  >
                    {l.topic} →
                  </Link>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-slate-700">
                    {l.how}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 답안 한 줄 — 인출 목표 */}
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50/70 p-4">
          <div className="mb-1.5 text-xs font-bold text-brand-700">
            ✍️ 시험지엔 이렇게 씁니다
          </div>
          <p className="text-[15px] font-medium leading-[1.95] text-slate-900">
            {g.exam}
          </p>
        </div>
      </div>
    </section>
  );
}
