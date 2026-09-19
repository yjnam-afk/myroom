"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { PeerAnswer } from "@/data/peerAnswers";
import { periodGroup } from "@/lib/questionAnswers";

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
/**
 * want = 이 답안을 보는 문항의 교시. 주면 같은 묶음(1교시 단답 / 2~4교시 논술)의
 * 답안만 먼저 세우고, 다른 묶음은 줄을 긋고 뒤로 보낸다. 2교시 25점짜리를 푸는데
 * 1교시 10점 답안이 맨 위에 서면 분량 눈금이 어긋나기 때문이다.
 */
export default function PeerAnswers({
  items,
  want,
  collapsed = false,
}: {
  items: PeerAnswer[];
  want?: string;
  /** 문제은행·기출처럼 문항이 죽 나열되는 화면에서는 통째로 접어 둔다 — 문제가 안 보인다. */
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLDivElement | null>());

  /**
   * 한 번에 하나만 펼치므로, 위쪽에 펼쳐져 있던 답안이 같이 접힌다. 접힌
   * 만큼 문서가 짧아지는데 브라우저는 스크롤 위치를 그대로 두기 때문에
   * 방금 누른 답안이 화면 위로 사라진다(스캔이 수천 px 라 화면 끝까지
   * 밀린다). 누른 줄의 화면상 위치를 재어 두었다가 접힌 만큼 스크롤을
   * 되돌려 제자리에 붙잡는다.
   */
  const toggle = (id: string) => {
    const el = rows.current.get(id);
    const before = el?.getBoundingClientRect().top;
    flushSync(() => setOpen(open === id ? null : id));
    if (el && before != null) {
      const delta = el.getBoundingClientRect().top - before;
      if (delta) window.scrollBy(0, delta);
    }
  };

  if (items.length === 0) return null;

  const wantGroup = want ? periodGroup(want) : null;
  const fit = wantGroup ? items.filter((a) => periodGroup(a.period) === wantGroup).length : items.length;

  const title = (
    <>
      ✍️ 모범답안 {items.length}건 — 실제 시험지와 첨삭
      {wantGroup && fit > 0 && fit < items.length && (
        <span className="ml-1 font-medium text-slate-500">
          (이 문제와 같은 {wantGroup} {fit}건)
        </span>
      )}
    </>
  );

  const body = (
    <>
      <div className="divide-y divide-slate-100">
        {items.map((a, idx) => {
          const isOpen = open === a.id;
          // 같은 묶음이 끝나는 자리에 줄을 긋는다 — 아래는 교시가 다른 답안이다.
          const edge =
            wantGroup != null && fit > 0 && idx === fit && items.length > fit;
          return (
            <div
              key={a.id}
              ref={(el) => {
                rows.current.set(a.id, el);
              }}
            >
              {edge && (
                <div className="bg-slate-50 px-5 py-1.5 text-[11px] font-semibold text-slate-400">
                  ↓ 교시가 다른 답안 — 분량과 구성이 다르니 참고만
                </div>
              )}
              <button
                type="button"
                onClick={() => toggle(a.id)}
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
                  {/* 큰 제목은 시험지에 적힌 문제 그대로다 — 무엇에 답한
                      답안인지는 문제 문구가 말해 준다. 토픽은 작게 덧붙인다. */}
                  <p className="mt-1 whitespace-pre-line text-[15px] font-bold leading-snug text-slate-900">
                    {a.question}
                  </p>
                  {a.topicTitles[0] && (
                    <p className="mt-0.5 text-[11px] text-slate-400">{a.topicTitles[0]}</p>
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                  {a.feedback && a.feedback.length > 0 && (
                    <div className="mb-4">
                      <div className="mb-1.5 text-xs font-bold text-rose-700">
                        🖍️ 첨삭(빨간 글씨 그대로)
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
    </>
  );

  if (collapsed)
    return (
      <details className="mb-3 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-sm">
        <summary className="cursor-pointer bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200">
          {title}
        </summary>
        {body}
      </details>
    );

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-sm">
      <div className="bg-slate-100 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          <b>실제로 제출되어 점수를 받은</b> 답안지 스캔입니다. 배점 대비 점수와
          빨간 첨삭이 채점 기준을 그대로 보여 줍니다.
        </p>
      </div>
      {body}
    </section>
  );
}
