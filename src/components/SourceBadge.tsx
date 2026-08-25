/**
 * 토픽 출처 배지 — 심화반(교재 서브노트) · 기필반(업로드 엑셀) · 기출(회차 신규) · 요청.
 * 여러 메뉴가 같은 색으로 보여주도록 여기서 한 번만 정의한다.
 */
export const SRC_CHIP: Record<string, string> = {
  심화반: "bg-emerald-100 text-emerald-700",
  기필반: "bg-slate-100 text-slate-500",
  기출: "bg-amber-100 text-amber-700",
  요청: "bg-sky-100 text-sky-700",
};

/** select 의 <option> 처럼 글자만 넣을 수 있는 곳에서 쓰는 짧은 표기 */
export const SRC_SHORT: Record<string, string> = {
  심화반: "심화",
  기필반: "기필",
  기출: "기출",
  요청: "요청",
};

export default function SourceBadge({
  source,
  className = "",
}: {
  source?: string;
  className?: string;
}) {
  if (!source) return null;
  return (
    <span
      className={`rounded px-1 py-0.5 text-[9px] font-bold ${SRC_CHIP[source] || "bg-slate-100 text-slate-500"} ${className}`}
    >
      {source}
    </span>
  );
}
