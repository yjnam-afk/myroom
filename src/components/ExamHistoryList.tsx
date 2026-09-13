"use client";

import { useState } from "react";
import { isRecent, weekLabel, type ExamAppearance } from "@/lib/examHistoryUtil";

/**
 * 출제 문항 목록.
 * full: 토픽 설명 카드 — 문제 전문을 줄바꿈 그대로, 생략 없이 보여준다.
 *       (가./나./다. 소문항이 있는 2교시 문제는 줄이 잘리면 무엇을 묻는지 알 수 없다.)
 * 아니면(학습계획 칩의 팝업) 세 줄까지만 보이고, 누르면 펼쳐진다.
 */
export function AppearanceList({ items, full = false }: { items: ExamAppearance[]; full?: boolean }) {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((h) => {
        const recent = isRecent(h.date);
        const open = full || opened.has(h.id);
        return (
          <li key={h.id} className={`px-3 py-2 ${full ? "px-5 py-3 text-[13px]" : "text-xs"}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded px-1.5 py-0.5 font-bold ${
                  recent ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {h.cohort} {weekLabel(h.round)}
              </span>
              <span className="text-slate-500">{h.date}</span>
              <span className="text-slate-400">· {h.period}</span>
              {h.exam && <span className="text-amber-700">· {h.exam}</span>}
            </div>
            <p
              onClick={() => {
                if (full) return;
                setOpened((prev) => {
                  const n = new Set(prev);
                  if (n.has(h.id)) n.delete(h.id);
                  else n.add(h.id);
                  return n;
                });
              }}
              className={`mt-1 whitespace-pre-line break-words leading-relaxed text-slate-800 ${
                open ? "" : "line-clamp-3 cursor-pointer"
              }`}
              title={open ? undefined : "누르면 전문이 보입니다"}
            >
              {h.text}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

