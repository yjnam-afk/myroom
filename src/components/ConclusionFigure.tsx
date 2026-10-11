import type { Conclusion } from "@/lib/answerGuide";

const BW = 112;
const BH = 28;

type Pos = { x: number; y: number };

/**
 * 결론 4박스 그림(1교시 지침 V30 5-1) — 흑백 선 + 박스, 강조 박스 1개만 색.
 * 박스 아래에는 역할 키워드 자리(4~5자)를 비워 둔다. 빈칸 라벨은 회색 〈 〉로 그린다.
 */
export default function ConclusionFigure({ c }: { c: Conclusion }) {
  const W = 600;
  let H = 74;
  let pos: Pos[] = [];
  const edges: { a: number; b: number; line?: boolean }[] = [];
  let group: { x: number; y: number; w: number; h: number; label?: string } | null = null;
  let plus: Pos | null = null;

  switch (c.pattern) {
    case "flow":
      pos = [0, 1, 2, 3].map((i) => ({ x: 8 + i * 152, y: 8 }));
      edges.push({ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 });
      break;
    case "hybrid":
      pos = [
        { x: 14, y: 8 },
        { x: 150, y: 8 },
        { x: 318, y: 8 },
        { x: 472, y: 8 },
      ];
      group = { x: 6, y: 2, w: 264, h: 40 };
      plus = { x: 138, y: 22 };
      edges.push({ a: 1, b: 2 }, { a: 2, b: 3 });
      break;
    case "link":
      H = 118;
      pos = [
        { x: 14, y: 44 },
        { x: 150, y: 44 },
        { x: 380, y: 8 },
        { x: 380, y: 80 },
      ];
      group = { x: 6, y: 38, w: 264, h: 40 };
      plus = { x: 138, y: 58 };
      edges.push({ a: 1, b: 2 }, { a: 1, b: 3 });
      break;
    case "beforeAfter":
      H = 118;
      pos = [
        { x: 14, y: 44 },
        { x: 200, y: 44 },
        { x: 400, y: 8 },
        { x: 400, y: 80 },
      ];
      edges.push({ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 3 });
      break;
    case "branch":
      H = 150;
      pos = [
        { x: 60, y: 60 },
        { x: 360, y: 8 },
        { x: 360, y: 60 },
        { x: 360, y: 112 },
      ];
      edges.push({ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 });
      break;
    case "pairs":
      H = 118;
      pos = [
        { x: 60, y: 8 },
        { x: 330, y: 8 },
        { x: 60, y: 80 },
        { x: 330, y: 80 },
      ];
      edges.push({ a: 0, b: 1 }, { a: 2, b: 3 });
      break;
    case "radialIn":
    case "radial":
      H = 118;
      pos = [
        { x: 244, y: 30 },
        { x: 30, y: 30 },
        { x: 458, y: 30 },
        { x: 244, y: 88 },
      ];
      // 문제-해결은 해결책이 문제를 향한 화살표, 고려사항은 관점 선
      edges.push(
        { a: 1, b: 0, line: c.pattern === "radial" },
        { a: 2, b: 0, line: c.pattern === "radial" },
        { a: 3, b: 0, line: c.pattern === "radial" },
      );
      break;
    case "contain":
      H = 86;
      pos = [0, 1, 2, 3].map((i) => ({ x: 26 + i * 140, y: 26 }));
      group = { x: 12, y: 6, w: 576, h: 58, label: "상위 체계" };
      break;
  }

  const mid = (p: Pos) => ({ x: p.x + BW / 2, y: p.y + BH / 2 });
  // 두 박스 사이 선 — 박스 테두리에서 끊는다
  const seg = (a: Pos, b: Pos) => {
    const A = mid(a);
    const B = mid(b);
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const cut = (P: { x: number; y: number }, sx: number, sy: number) => {
      const tx = dx === 0 ? Infinity : (BW / 2) / Math.abs(dx);
      const ty = dy === 0 ? Infinity : (BH / 2) / Math.abs(dy);
      const t = Math.min(tx, ty);
      return { x: P.x + sx * dx * t, y: P.y + sy * dy * t };
    };
    return [cut(A, 1, 1), cut(B, -1, -1)];
  };

  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} className="my-1 w-full max-w-[600px]" role="img" aria-label={`결론 그림 — ${c.title}`}>
      <defs>
        <marker id="cf-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#111" />
        </marker>
      </defs>
      {group && (
        <g>
          <rect x={group.x} y={group.y} width={group.w} height={group.h} rx={6} fill="none" stroke="#111" strokeDasharray="4 3" />
          {group.label && (
            <text x={group.x + 8} y={group.y + 13} fontSize={10} fill="#64748b">
              〈{group.label}〉
            </text>
          )}
        </g>
      )}
      {plus && (
        <text x={plus.x} y={plus.y + 5} fontSize={14} textAnchor="middle" fill="#111">
          +
        </text>
      )}
      {edges.map((e, i) => {
        const [p, q] = seg(pos[e.a], pos[e.b]);
        return (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="#111"
            strokeWidth={1.3}
            markerEnd={e.line ? undefined : "url(#cf-arrow)"}
          />
        );
      })}
      {c.boxes.map((b, i) => {
        const p = pos[i];
        if (!p) return null;
        const hi = i === c.hi;
        return (
          <g key={i}>
            <rect
              x={p.x}
              y={p.y}
              width={BW}
              height={BH}
              rx={4}
              fill={hi ? "#fde68a" : "#fff"}
              stroke="#111"
              strokeWidth={hi ? 2 : 1.2}
            />
            <text
              x={p.x + BW / 2}
              y={p.y + BH / 2 + 4}
              fontSize={11.5}
              textAnchor="middle"
              fill={b.fill ? "#111" : "#94a3b8"}
              fontStyle={b.fill ? "normal" : "italic"}
              fontWeight={hi ? 700 : 400}
            >
              {b.fill ? (b.text.length > 11 ? `${b.text.slice(0, 10)}…` : b.text) : `〈${b.text}〉`}
            </text>
            {/* 박스 아래 역할 키워드 자리(4~5자) */}
            <text x={p.x + BW / 2} y={p.y + BH + 12} fontSize={9.5} textAnchor="middle" fill="#cbd5e1">
              역할 4~5자
            </text>
          </g>
        );
      })}
    </svg>
  );
}
