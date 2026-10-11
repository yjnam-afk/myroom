"use client";

import { chipKey, chipTopic, type LevelMap, type LmChip, type LmTone } from "@/data/levelMaps";

/**
 * 레벨 맵 한 장 — 왼쪽 축(행) × 관점(열) 칸에 키워드 칩. 사용자가 보여 준 「계층별 보안 맵」 꼴.
 * 진한 칩 = 이 맵에서 출제(기출·NS·모의)가 많은 상위 칩. 토픽에 걸린 칩은 누르면 토픽 정보를 연다.
 */
const TONE: Record<LmTone, { head: string; box: string; hot: string; cold: string }> = {
  red: { head: "bg-red-600", box: "border-red-200 bg-red-50/40", hot: "bg-red-600 text-white border-red-600", cold: "border-red-200" },
  rose: { head: "bg-rose-600", box: "border-rose-200 bg-rose-50/40", hot: "bg-rose-600 text-white border-rose-600", cold: "border-rose-200" },
  orange: { head: "bg-orange-500", box: "border-orange-200 bg-orange-50/40", hot: "bg-orange-500 text-white border-orange-500", cold: "border-orange-200" },
  amber: { head: "bg-amber-600", box: "border-amber-200 bg-amber-50/40", hot: "bg-amber-600 text-white border-amber-600", cold: "border-amber-200" },
  green: { head: "bg-emerald-600", box: "border-emerald-200 bg-emerald-50/40", hot: "bg-emerald-600 text-white border-emerald-600", cold: "border-emerald-200" },
  teal: { head: "bg-teal-600", box: "border-teal-200 bg-teal-50/40", hot: "bg-teal-600 text-white border-teal-600", cold: "border-teal-200" },
  sky: { head: "bg-sky-600", box: "border-sky-200 bg-sky-50/40", hot: "bg-sky-600 text-white border-sky-600", cold: "border-sky-200" },
  blue: { head: "bg-blue-700", box: "border-blue-200 bg-blue-50/40", hot: "bg-blue-700 text-white border-blue-700", cold: "border-blue-200" },
  violet: { head: "bg-violet-600", box: "border-violet-200 bg-violet-50/40", hot: "bg-violet-600 text-white border-violet-600", cold: "border-violet-200" },
  slate: { head: "bg-slate-700", box: "border-slate-300 bg-slate-50", hot: "bg-slate-700 text-white border-slate-700", cold: "border-slate-300" },
};
const ROW_BG = ["#b45309", "#ea580c", "#16a34a", "#0f766e", "#1d4ed8", "#6d28d9", "#be123c", "#0e7490"];

/** 맵 안 칩 출제 횟수에서 「진한 칩」 기준 — 출제 있는 칩 중 위 30%(최소 2회) */
export function hotLine(m: LevelMap, n: (c: LmChip) => number) {
  const all = [...m.rows.flatMap((r) => r.cells.flat()), ...(m.all?.chips ?? [])].map(n).filter((x) => x > 0).sort((a, b) => b - a);
  if (!all.length) return Infinity;
  return Math.max(2, all[Math.max(0, Math.ceil(all.length * 0.3) - 1)]);
}

export default function LevelMatrix({
  m,
  course,
  total,
  hits,
  sel,
  onPick,
}: {
  m: LevelMap;
  course: string;
  total: number;
  hits: (c: LmChip) => number;
  sel: string | null;
  onPick: (title: string) => void;
}) {
  const line = hotLine(m, hits);
  const cols = `minmax(84px,0.8fr) ${m.cols.map(() => "minmax(0,2fr)").join(" ")}`;

  const Chip = ({ c, tone }: { c: LmChip; tone: LmTone }) => {
    const n = hits(c);
    const t = chipTopic(c);
    const hot = n >= line;
    const cls = `grow rounded-md border px-2 py-1 text-center text-[12px] font-semibold leading-tight ${
      hot ? TONE[tone].hot : `bg-white text-slate-800 ${TONE[tone].cold}`
    } ${t ? "cursor-pointer underline decoration-dotted underline-offset-2 hover:shadow" : ""} ${t && sel === t ? "ring-2 ring-brand-600 ring-offset-1" : ""}`;
    const title = `${chipKey(c)}${t && t !== chipKey(c) ? ` → ${t}` : ""}${n ? ` · 출제 ${n}` : ""}`;
    return t ? (
      <button type="button" className={cls} title={title} onClick={() => onPick(t)}>
        {chipKey(c)}
      </button>
    ) : (
      <span className={cls} title={title}>
        {chipKey(c)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
      <div className="min-w-[760px]">
        {/* 머리 */}
        <div className="flex items-center gap-3 bg-[#7a1f3d] px-3 py-2 text-white">
          <span className="rounded-md bg-white px-2 py-0.5 text-lg font-black text-[#7a1f3d]">{String(m.no).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-bold leading-tight">{m.title}</p>
            <p className="truncate text-[11.5px] opacity-85">{m.sub}</p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-[#7a1f3d]">
            {course} · {m.no} / {total}
          </span>
        </div>

        <div className="grid gap-1.5 p-2" style={{ gridTemplateColumns: cols }}>
          {/* 열 머리 */}
          <div className="rounded bg-slate-700 py-1 text-center text-[12px] font-bold text-white">{m.rowHead}</div>
          {m.cols.map((c) => (
            <div key={c.name} className={`rounded py-1 text-center text-[12px] font-bold text-white ${TONE[c.tone].head}`}>
              {c.name}
            </div>
          ))}

          {/* 행 */}
          {m.rows.map((r, ri) => (
            <div key={r.name} className="contents">
              <div
                className="flex flex-col items-center justify-center rounded px-1 py-2 text-center text-white"
                style={{ background: ROW_BG[ri % ROW_BG.length] }}
              >
                <span className="text-[13.5px] font-bold leading-tight">{r.name}</span>
                {r.en && <span className="mt-0.5 text-[10px] opacity-85">{r.en}</span>}
              </div>
              {r.cells.map((cell, ci) => {
                const tone = m.cols[ci]?.tone ?? "slate";
                return (
                  <div key={ci} className={`flex flex-wrap content-center gap-1 rounded-md border p-1.5 ${TONE[tone].box}`}>
                    {cell.map((c, i) => (
                      <Chip key={i} c={c} tone={tone} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}

          {/* 전 행 공통 */}
          {m.all && (
            <>
              <div className="flex items-center justify-center rounded bg-slate-700 px-1 py-2 text-center text-[12.5px] font-bold text-white">
                {m.all.name}
              </div>
              <div className="flex flex-wrap gap-1 rounded-md border border-slate-300 bg-slate-50 p-1.5" style={{ gridColumn: `span ${m.cols.length}` }}>
                {m.all.chips.map((c, i) => (
                  <Chip key={i} c={c} tone="slate" />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-3 py-1.5 text-[10.5px] text-slate-500">
          <span>
            <span className="mr-1 inline-block h-2.5 w-4 rounded-sm bg-slate-700 align-middle" />
            진한 칩 = 이 맵에서 출제(기출·NS·모의) 상위 {Number.isFinite(line) ? `· ${line}회 이상` : "— 출제 기록 없음"} · 점선 밑줄 칩은 누르면 토픽 정보
          </span>
          <span>근거: {m.basis}</span>
        </div>
      </div>
    </div>
  );
}
