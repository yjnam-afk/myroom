import type { ReactNode } from "react";

/**
 * 답안지 종이 — ITPE 답안지처럼 왼쪽 번호 칸, 줄 친 칸, 쪽 번호와 ITPE 꼬리말.
 * 해설집·손글씨 모범답안과 나란히 봐도 같은 모양이 되게 한다(2026-10-11).
 */
export default function AnswerPaper({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-4 w-full max-w-[46rem] px-3 sm:px-5">
      <div className="rounded-sm border border-slate-400 bg-[#fffef9] shadow-sm">
        <div className="flex justify-end px-3 pt-1 text-[11px] font-semibold text-slate-500">1쪽</div>
        <div className="grid grid-cols-[2.2rem_1fr] border-t border-slate-500">
          <div className="border-r border-slate-500 pt-1 text-center text-[10px] text-slate-500">번호</div>
          <div
            className="min-w-0 px-3 py-1 text-[13px] leading-[28px] text-slate-900 [&_p]:break-words"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #e2e8f0 27px, #e2e8f0 28px)",
            }}
          >
            {children}
          </div>
        </div>
        <div className="border-t border-slate-500 py-1 text-center text-sm font-bold tracking-widest text-slate-400">
          ITPE
        </div>
      </div>
    </div>
  );
}
