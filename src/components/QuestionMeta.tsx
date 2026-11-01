"use client";

import { useState } from "react";
import MyNotes from "@/components/MyNotes";
import { freqOf, freqTier, prioOf, PRIO_STARS, myNotesForQuestion } from "@/lib/questionMeta";

const FREQ_BADGE = {
  상: "bg-red-100 text-red-700",
  중: "bg-orange-100 text-orange-700",
  하: "bg-slate-100 text-slate-500",
} as const;
const PRIO_BADGE = {
  상: "bg-violet-100 text-violet-700",
  중: "bg-indigo-50 text-indigo-600",
  하: "bg-slate-100 text-slate-500",
  "교재 밖": "bg-slate-50 text-slate-400",
} as const;

/** 문항 배지 — 토픽 중요도(교재 ★)와 빈출(출제 횟수)을 따로 */
export function QuestionBadges({ id }: { id: string }) {
  const p = prioOf(id);
  const t = freqTier(id);
  const n = freqOf(id);
  return (
    <>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${PRIO_BADGE[p]}`}
        title="토픽 중요도 — 교재 CONTENTS Priority(★★★ 상·★★ 중·★ 하)"
      >
        {p === "교재 밖" ? "교재 밖 토픽" : `중요도 ${p} ${PRIO_STARS[p]}`}
      </span>
      <span
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${FREQ_BADGE[t]}`}
        title="빈출 — 같은 토픽이 기출·NS·모의고사·파이널·셀테에 나온 횟수"
      >
        빈출 {t}
        {n > 0 ? ` · ${n}회` : ""}
      </span>
    </>
  );
}

/** 📝 내 정리·내 답안지 — 이 문항 토픽에 걸린 것. 접어 두고 누르면 펼친다 */
export function QuestionMyNotes({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const items = myNotesForQuestion(id);
  if (!items.length) return null;
  const mine = items.filter((n) => n.book.startsWith("내 답안지")).length;
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
      >
        📝 내 정리 {items.length - mine > 0 ? `${items.length - mine}편` : ""}
        {mine > 0 ? `${items.length - mine > 0 ? " · " : ""}내 답안지 ${mine}편` : ""} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2">
          <MyNotes items={items} />
        </div>
      )}
    </div>
  );
}
