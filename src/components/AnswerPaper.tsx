"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const LINE = 28;

/**
 * 답안지 종이 — 가로 괘선, 왼쪽 줄번호 거터, 여백선 1개(답안 작성 지침 V30 0-1).
 *
 * 줄번호는 실제로 그려진 높이를 괘선 높이(28px)로 나눠 매긴다 — 템플릿이 26줄(1교시)·
 * 66~77줄(2교시) 안에 드는지 눈으로 바로 본다. 2교시는 22줄마다 쪽을 나눈다(답안지 한 쪽 22줄).
 */
export default function AnswerPaper({
  children,
  pageLines,
  target,
}: {
  children: ReactNode;
  /** 쪽당 줄 수 — 주면 그 줄마다 쪽 구분선을 긋는다(2교시 22줄) */
  pageLines?: number;
  /** 목표 줄 수 [최소, 최대] — 머리에 「n줄 / 목표」를 띄운다 */
  target?: [number, number];
}) {
  const body = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(0);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    // 내용 칸만 잰다 — 쪽 구분선(absolute)까지 재면 줄이 늘수록 구분선이 늘어 끝없이 커진다
    const ro = new ResizeObserver(() => setLines(Math.ceil(el.offsetHeight / LINE)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const over = target && lines > target[1];
  const under = target && lines < target[0];
  const pages = pageLines ? Math.max(1, Math.ceil(lines / pageLines)) : 1;

  return (
    <div className="mx-auto my-4 w-full max-w-[46rem] px-3 sm:px-5">
      <div className="rounded-sm border border-slate-400 bg-[#fffef9] shadow-sm">
        <div className="flex items-center justify-between px-3 pt-1 text-[11px] font-semibold text-slate-500">
          <span className={over ? "text-rose-600" : under ? "text-amber-600" : "text-emerald-700"}>
            {lines ? `${lines}줄` : ""}
            {target && lines ? ` / 목표 ${target[0] === target[1] ? target[0] : `${target[0]}~${target[1]}`}줄` : ""}
            {over ? " — 넘침: 그림부터 줄인다" : under ? " — 모자람" : ""}
          </span>
          <span>{pageLines ? `${pages}쪽 (쪽당 ${pageLines}줄)` : "1쪽"}</span>
        </div>
        <div className="grid grid-cols-[2.2rem_1fr] border-t border-slate-500">
          {/* 줄번호 거터 */}
          <div className="relative border-r border-slate-500 text-center text-[10px] text-slate-400">
            {Array.from({ length: lines }, (_, i) => (
              <div
                key={i}
                className={`leading-[28px] ${pageLines && (i + 1) % pageLines === 0 ? "font-bold text-slate-600" : ""}`}
                style={{ height: LINE }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div
            className="relative min-w-0 border-l-2 border-rose-200 px-3 py-0 text-[13px] leading-[28px] text-slate-900 [&_p]:break-words"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${LINE - 1}px, #e2e8f0 ${LINE - 1}px, #e2e8f0 ${LINE}px)`,
            }}
          >
            {/* 쪽 구분 — 22줄마다 */}
            {pageLines &&
              Array.from({ length: pages - 1 }, (_, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-slate-400"
                  style={{ top: (i + 1) * pageLines * LINE }}
                >
                  <span className="absolute right-1 -top-4 text-[10px] text-slate-400">{i + 2}쪽</span>
                </div>
              ))}
            <div ref={body}>{children}</div>
          </div>
        </div>
        <div className="border-t border-slate-500 py-1 text-center text-sm font-bold tracking-widest text-slate-400">
          ITPE
        </div>
      </div>
    </div>
  );
}
