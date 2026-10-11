import type { AnswerConclusion } from "@/data/answerConclusions";

/**
 * 그래프형 결론(지침 V34·V36) — 가로·세로축 이름, 주제 계열만 강조색, 값 라벨 2~3개.
 * 점 좌표는 데이터 그대로 비율로 펼친다(축 눈금은 그리지 않는다 — 손으로 그리는 답안 그래프).
 */
export default function ConclusionGraph({ g }: { g: NonNullable<AnswerConclusion["graph"]> }) {
  const W = 600;
  const H = 122;
  const L = 24;
  const R = 150;
  const T = 18;
  const B = 92;
  const all = g.series.flatMap((s) => s.pts);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(0, ...ys), Math.max(...ys)];
  const X = (v: number) => L + ((v - x0) / (x1 - x0 || 1)) * (W - L - R);
  const Y = (v: number) => B - ((v - y0) / (y1 - y0 || 1)) * (B - T);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="my-1 w-full max-w-[600px]" role="img" aria-label={`결론 그래프 — ${g.y} / ${g.x}`}>
      <defs>
        <marker id="cg-ax" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#111" />
        </marker>
      </defs>
      <line x1={L} y1={B} x2={W - R + 20} y2={B} stroke="#111" strokeWidth={1.3} markerEnd="url(#cg-ax)" />
      <line x1={L} y1={B} x2={L} y2={T - 4} stroke="#111" strokeWidth={1.3} markerEnd="url(#cg-ax)" />
      <text x={W - R + 22} y={B + 14} fontSize={10} textAnchor="end" fill="#334155">
        {g.x}
      </text>
      <text x={L + 6} y={T - 6} fontSize={10} fill="#334155">
        {g.y}
      </text>
      {g.series.map((s) => {
        const d = s.pts.map((p, i) => `${i ? "L" : "M"}${X(p[0])},${Y(p[1])}`).join(" ");
        const last = s.pts[s.pts.length - 1];
        return (
          <g key={s.name}>
            <path
              d={d}
              fill="none"
              stroke={s.hi ? "#d97706" : "#64748b"}
              strokeWidth={s.hi ? 2.6 : 1.4}
              strokeDasharray={s.hi ? undefined : "4 3"}
            />
            {last && (
              <text x={X(last[0]) + 4} y={Y(last[1]) + 4} fontSize={10.5} fill={s.hi ? "#b45309" : "#475569"} fontWeight={s.hi ? 700 : 400}>
                {s.name}
                {s.hi ? "★" : ""}
              </text>
            )}
          </g>
        );
      })}
      {/* 값 라벨 — 가로축 아래 한 줄(계열 이름과 겹치지 않게) */}
      <text x={L} y={H - 4} fontSize={10} fill="#334155">
        {g.labels.join("   ·   ")}
      </text>
    </svg>
  );
}
