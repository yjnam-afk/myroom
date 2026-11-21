"use client";

import { LEVEL_STYLE, LEVEL_HINT } from "@/lib/badges";

/** 토픽 설명 화면의 작은 조각 — 목록(TopicBrowser)과 본문(ExplainClient)이 함께 쓴다. */

/** 가나다… 소항목 번호 — 정의가 여럿이면 기법 수만큼 붙는다(블랙박스 9개 등) */
export const HANGUL_NO = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"];

export const SRC_CHIP: Record<string, string> = {
  심화반: "bg-emerald-100 text-emerald-700",
  기필반: "bg-slate-100 text-slate-500",
  기출: "bg-amber-100 text-amber-700",
  서브: "bg-teal-100 text-teal-700",
};

export function LevelBadge({ level, note }: { level?: string; note?: string }) {
  if (!level) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${LEVEL_STYLE[level] || LEVEL_STYLE.참고}`}
      title={note || LEVEL_HINT[level] || level}
    >
      {level}
    </span>
  );
}
