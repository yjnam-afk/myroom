"use client";

import { useState } from "react";
import type { PeerAnswer } from "@/data/peerAnswers";

/**
 * 남이 쓴 답안 — 손글씨 시험지 스캔과 강사 첨삭.
 *
 * 기본은 접어 둔다. 토픽을 처음 볼 때 남의 답안부터 보면 그 구성에 갇히기
 * 때문이다. 교재 정의·설명을 먼저 읽고, "그래서 실제로는 어떻게 쓰지?"가
 * 생겼을 때 펼치는 순서가 맞다.
 *
 * 점수를 제목 줄에 크게 박는다. 이 자료의 가치는 답안 자체가 아니라
 * "이 정도 쓰면 25점 중 15점"이라는 눈금이다.
 */
export default function PeerAnswers({ items }: { items: PeerAnswer[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-sm">
      <div className="bg-slate-100 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-800">
          ✍️ 남이 쓴 답안 {items.length}건 — 실제 시험지와 첨삭
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          모범답안이 아니라 <b>실제로 제출되어 점수를 받은</b> 답안입니다. 배점
          대비 점수와 빨간 첨삭이 채점 기준을 그대로 보여 줍니다.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((a) => {
          const isOpen = open === a.id;
          return (
            <div key={a.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : a.id)}
                className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50"
              >
                <span className="mt-0.5 text-slate-400">{isOpen ? "▾" : "▸"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[11px] font-bold text-brand-700">
                      {a.period}
                    </span>
                    {a.no && (
                      <span className="text-xs text-slate-400">{a.no}번</span>
                    )}
                    {a.exam && (
                      <span className="text-xs text-slate-400">· {a.exam}</span>
                    )}
                    {a.score != null && (
                      <span className="ml-auto shrink-0 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-white">
                        {a.score}
                        {a.maxScore ? ` / ${a.maxScore}` : ""}점
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-800">
                    {a.question}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                  {a.takeaway && (
                    <p className="mb-3 rounded-xl border-l-4 border-brand-300 bg-white p-3 text-[14px] font-medium leading-relaxed text-slate-800">
                      {a.takeaway}
                    </p>
                  )}

                  {a.feedback && a.feedback.length > 0 && (
                    <div className="mb-4">
                      <div className="mb-1.5 text-xs font-bold text-rose-700">
                        🖍️ 첨삭에서 읽어낸 것
                      </div>
                      <ul className="space-y-1.5">
                        {a.feedback.map((f, i) => (
                          <li key={i} className="flex gap-2 text-[13.5px] leading-relaxed text-slate-700">
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-1.5 text-xs font-bold text-slate-500">
                    📄 시험지 {a.pages.length}쪽 — 눌러서 크게 보기
                  </div>
                  <div className="space-y-3">
                    {a.pages.map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => setZoom(p.src)}
                        className="block w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand-300"
                      >
                        {p.label && (
                          <div className="border-b border-slate-100 px-3 py-1 text-left text-[11px] font-medium text-slate-400">
                            {p.label}
                          </div>
                        )}
                        {/* 스캔 이미지는 next/image 로 최적화할 이득이 없다(이미 압축된
                            JPEG 한 장이고 크기도 고정이다). 평범한 img 로 둔다. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.src}
                          alt={`${a.question.slice(0, 20)} 답안 ${p.label ?? ""}`}
                          loading="lazy"
                          className="block w-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 크게 보기 — 배경을 누르면 닫힌다. 손글씨는 확대해야 읽힌다. */}
      {zoom && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setZoom(null)}
          onKeyDown={(e) => e.key === "Escape" && setZoom(null)}
          className="fixed inset-0 z-50 cursor-zoom-out overflow-auto bg-black/80 p-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="답안 크게 보기" className="mx-auto w-full max-w-3xl rounded-lg" />
          <p className="py-4 text-center text-xs text-white/70">
            아무 데나 누르면 닫힙니다
          </p>
        </div>
      )}
    </section>
  );
}
