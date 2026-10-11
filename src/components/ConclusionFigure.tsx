import type { Conclusion } from "@/lib/answerGuide";

const BH = 28;

type Pos = { x: number; y: number };

/**
 * 결론 도식(1교시 지침 V36 — 개념도의 축약판, 답안지 3~4줄) — 흑백 선 + 박스, 강조 박스 1개만 색.
 * 박스 3~5개를 패턴별로 늘어놓고, 박스 아래에 역할 키워드(4~5자)를 쓴다.
 * 내용이 없는 토픽은 빈칸 라벨(회색 〈 〉)과 「역할 4~5자」 자리로 그린다.
 */
export default function ConclusionFigure({ c }: { c: Conclusion }) {
  const W = 600;
  const n = Math.max(1, c.boxes.length);
  let BW = 112;
  let H = 74;
  let pos: Pos[] = [];
  const edges: { a: number; b: number; line?: boolean; label?: string }[] = [];
  let group: { x: number; y: number; w: number; h: number; label?: string } | null = null;
  let plus: Pos | null = null;
  const row = (k: number, x0: number, x1: number, y: number) =>
    Array.from({ length: k }, (_, i) => ({ x: k === 1 ? (x0 + x1 - BW) / 2 : x0 + (i * (x1 - x0 - BW)) / (k - 1), y }));
  const col = (k: number, x: number, y0: number) => Array.from({ length: k }, (_, i) => ({ x, y: y0 + i * 40 }));

  switch (c.pattern) {
    case "flow": {
      BW = Math.min(112, (W - 16) / n - 26);
      pos = row(n, 8, W - 8, 8);
      for (let i = 0; i < n - 1; i++) edges.push({ a: i, b: i + 1, label: c.arrows?.[i] });
      break;
    }
    case "hybrid": {
      // [A] + [B](점선 그룹) → 나머지 흐름
      BW = Math.min(112, (W - 40) / n - 22);
      const gw = 2 * BW + 40;
      pos = [
        { x: 14, y: 8 },
        { x: 14 + BW + 28, y: 8 },
        ...row(n - 2, gw + 40, W - 8, 8),
      ];
      group = { x: 6, y: 2, w: gw, h: 40 };
      plus = { x: 14 + BW + 14, y: 22 };
      for (let i = 1; i < n - 1; i++) edges.push({ a: i, b: i + 1, label: c.arrows?.[i - 1] });
      break;
    }
    case "link": {
      const k = n - 2;
      H = Math.max(74, k * 40 + 8);
      const mid = (H - BH) / 2;
      pos = [{ x: 14, y: mid }, { x: 150, y: mid }, ...col(k, 400, (H - (k * 40 - 12)) / 2)];
      group = { x: 6, y: mid - 6, w: 264, h: 40 };
      plus = { x: 138, y: mid + 14 };
      for (let i = 2; i < n; i++) edges.push({ a: 1, b: i });
      break;
    }
    case "beforeAfter": {
      const k = n - 2;
      H = Math.max(74, k * 40 + 8);
      const mid = (H - BH) / 2;
      pos = [{ x: 14, y: mid }, { x: 200, y: mid }, ...col(k, 410, (H - (k * 40 - 12)) / 2)];
      edges.push({ a: 0, b: 1 });
      for (let i = 2; i < n; i++) edges.push({ a: 1, b: i });
      break;
    }
    case "branch": {
      const k = n - 1;
      H = Math.max(74, k * 40 + 8);
      pos = [{ x: 60, y: (H - BH) / 2 }, ...col(k, 380, (H - (k * 40 - 12)) / 2)];
      for (let i = 1; i < n; i++) edges.push({ a: 0, b: i });
      break;
    }
    case "pairs": {
      const rows = Math.ceil(n / 2);
      H = rows * 54 + 8;
      pos = Array.from({ length: n }, (_, i) => ({ x: i % 2 ? 330 : 60, y: 8 + Math.floor(i / 2) * 54 }));
      for (let i = 0; i + 1 < n; i += 2) edges.push({ a: i, b: i + 1 });
      break;
    }
    case "radialIn":
    case "radial": {
      H = 122;
      const around = [
        { x: 30, y: 30 },
        { x: 458, y: 30 },
        { x: 244, y: 92 },
        { x: 30, y: 92 },
      ];
      pos = [{ x: 244, y: 30 }, ...around.slice(0, n - 1)];
      for (let i = 1; i < n; i++) edges.push({ a: i, b: 0, line: c.pattern === "radial" });
      break;
    }
    case "contain": {
      BW = Math.min(112, (W - 40) / n - 14);
      H = 86;
      pos = row(n, 26, W - 26, 30);
      group = { x: 12, y: 6, w: 576, h: 60, label: c.group ?? "상위 체계" };
      break;
    }
  }

  const mid = (p: Pos) => ({ x: p.x + BW / 2, y: p.y + BH / 2 });
  // 두 박스 사이 선 — 박스 테두리에서 끊는다
  const seg = (a: Pos, b: Pos) => {
    const A = mid(a);
    const B = mid(b);
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const cut = (P: { x: number; y: number }, sgn: number) => {
      const tx = dx === 0 ? Infinity : BW / 2 / Math.abs(dx);
      const ty = dy === 0 ? Infinity : BH / 2 / Math.abs(dy);
      const t = Math.min(tx, ty);
      return { x: P.x + sgn * dx * t, y: P.y + sgn * dy * t };
    };
    return [cut(A, 1), cut(B, -1)];
  };
  const fit = (s: string) => {
    const max = Math.max(5, Math.floor(BW / 7.2));
    return s.length > max ? `${s.slice(0, max - 1)}…` : s;
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
            <text x={group.x + 8} y={group.y + 13} fontSize={10} fill="#334155">
              {group.label}
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
        if (!pos[e.a] || !pos[e.b]) return null;
        const [p, q] = seg(pos[e.a], pos[e.b]);
        return (
          <g key={i}>
            <line
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="#111"
              strokeWidth={1.3}
              markerEnd={e.line ? undefined : "url(#cf-arrow)"}
            />
            {e.label && (
              <text x={(p.x + q.x) / 2} y={(p.y + q.y) / 2 - 4} fontSize={9.5} textAnchor="middle" fill="#334155">
                {e.label}
              </text>
            )}
          </g>
        );
      })}
      {c.boxes.map((b, i) => {
        const p = pos[i];
        if (!p) return null;
        const hi = i === c.hi;
        return (
          <g key={i}>
            <rect x={p.x} y={p.y} width={BW} height={BH} rx={4} fill={hi ? "#fde68a" : "#fff"} stroke="#111" strokeWidth={hi ? 2 : 1.2} />
            <text
              x={p.x + BW / 2}
              y={p.y + BH / 2 + 4}
              fontSize={11.5}
              textAnchor="middle"
              fill={b.fill ? "#111" : "#94a3b8"}
              fontStyle={b.fill ? "normal" : "italic"}
              fontWeight={hi ? 700 : 400}
            >
              {b.fill ? fit(b.text) : `〈${b.text}〉`}
            </text>
            {/* 박스 아래 역할 키워드(4~5자) */}
            <text
              x={p.x + BW / 2}
              // 방사형 가운데 박스는 아래로 화살표가 들어오므로 역할 키워드를 위에 쓴다
              y={(c.pattern === "radialIn" || c.pattern === "radial") && i === 0 ? p.y - 4 : p.y + BH + 12}
              fontSize={9.5}
              textAnchor="middle"
              fill={b.role ? "#475569" : "#cbd5e1"}
            >
              {b.role ?? "역할 4~5자"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
