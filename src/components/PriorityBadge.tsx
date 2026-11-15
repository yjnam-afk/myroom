import { PRIORITY_STYLE } from "@/lib/badges";

/** 교재 중요도 배지 — 상★★★ 중★★ 하★ (값이 없으면 하). 메인·학습계획·토픽 설명이 같은 배지를 쓴다. */
export default function PriorityBadge({ p }: { p?: string }) {
  const st = (p && PRIORITY_STYLE[p]) || PRIORITY_STYLE.하;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ${st.cls}`}
      title={`중요도 ${p ?? "하"}`}
    >
      {p ?? "하"}
      <span className="text-[8px] leading-none">{st.star}</span>
    </span>
  );
}
