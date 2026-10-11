import type { ConceptSpec } from "@/data/conceptDiagrams";
import ConclusionGraph from "./ConclusionGraph";

/**
 * 답안지 개념도(1교시 지침 4장) — 교재 그림을 참고해 손글씨 답안처럼 다시 그린 것.
 * 흑백 선 + 박스, 주제 박스(hi) 하나만 강조색, 점선 그룹. 라벨은 2단락 표 1·2열과 같은 글자(매칭 규칙).
 *
 * 2026-10-11 "교재를 참고로 개념도 그려 줬는데 너는 못 해 주냐" — 그동안은 교재 슬라이드 그림을 잘라
 * 붙였다(색·잔글씨가 많아 답안지 그림이 아니었다). 패턴은 지침 4장 표 그대로: 계층(tree)·중심-위성(hub)·
 * 그룹(group)·순환(cycle)·레이어드(layer)·흐름+분기(flow)·시퀀스(sequence)·그래프(graph).
 * 답안지 3~4줄(28px)에 들도록 박스를 낮게 잡는다. 라벨은 자르지 않고 글자를 줄여 맞춘다(표와 같은 글자여야 한다).
 */
const W = 600;
const BH = 22;
const INK = "#111";
const SUB = "#334155";
const HI = "#fde68a";

/** 박스 폭에 라벨이 들어가는 글자 크기 — 한글 1, 영문·숫자·기호 0.6 */
function fontFor(label: string, w: number, max = 11) {
  let u = 0;
  for (const ch of label) u += /[가-힣ㄱ-ㅎ]/.test(ch) ? 1 : ch === " " ? 0.35 : 0.6;
  return Math.max(7.5, Math.min(max, (w - 8) / Math.max(u, 1)));
}

/** 화살표 라벨이 들어갈 간격 — 글자 수만큼 벌린다 */
const gapFor = (labels: (string | undefined)[], min: number) =>
  Math.max(min, ...labels.map((l) => (l ? [...l].reduce((a, ch) => a + (/[가-힣]/.test(ch) ? 10 : 6), 0) + 14 : 0)));

function Box({ x, y, w, h = BH, label, hi }: { x: number; y: number; w: number; h?: number; label: string; hi?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={hi ? HI : "#fff"} stroke={INK} strokeWidth={hi ? 2 : 1.2} />
      <text x={x + w / 2} y={y + h / 2 + 4} fontSize={fontFor(label, w)} textAnchor="middle" fill={INK} fontWeight={hi ? 700 : 400}>
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, dashed, both }: { x1: number; y1: number; x2: number; y2: number; label?: string; dashed?: boolean; both?: boolean }) {
  const horiz = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={INK}
        strokeWidth={1.2}
        markerEnd="url(#cd-arrow)"
        markerStart={both ? "url(#cd-arrow-s)" : undefined}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      {label && (
        <text
          x={(x1 + x2) / 2 + (horiz ? 0 : 4)}
          y={(y1 + y2) / 2 + (horiz ? -4 : 3)}
          fontSize={9.5}
          textAnchor={horiz ? "middle" : "start"}
          fill={SUB}
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Group({ x, y, w, h, name, hi }: { x: number; y: number; w: number; h: number; name?: string; hi?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={INK} strokeDasharray="4 3" />
      {name && (
        <text x={x + w / 2} y={y + 12} fontSize={fontFor(name, w, 10.5)} textAnchor="middle" fill={hi ? INK : SUB} fontWeight={700}>
          {name}
        </text>
      )}
    </g>
  );
}

export default function ConceptDiagram({ spec }: { spec: ConceptSpec }) {
  if (spec.pattern === "graph") return <ConclusionGraph g={spec.graph} />;
  const isHi = (s: string) => !!spec.hi && s === spec.hi;
  let H = 90;
  const els: JSX.Element[] = [];
  let n = 0;
  const k = () => `e${n++}`;

  switch (spec.pattern) {
    case "group": {
      // 그룹(점선)을 옆으로, 그룹 안 요소는 3행까지 쌓고 넘치면 옆 칸으로 — 그룹 이름 = 표 1열, 요소 = 표 2열
      const G = spec.groups;
      const gap = spec.arrows?.length ? gapFor(spec.arrows.map((a) => a[2]), 30) : 12;
      const maxRows = spec.rows ?? 3;
      const cols = G.map((g) => Math.max(1, Math.ceil(g.items.length / maxRows)));
      const rows = Math.max(1, ...G.map((g, i) => Math.ceil(g.items.length / cols[i])));
      const unit = (W - 4 - gap * (G.length - 1)) / cols.reduce((a, b) => a + b, 0);
      H = 18 + rows * (BH + 5) + 4;
      const gx: number[] = [];
      let x = 2;
      G.forEach((g, i) => {
        const gw = unit * cols[i];
        gx.push(x);
        els.push(<Group key={k()} x={x} y={1} w={gw} h={H - 2} name={g.name} hi={isHi(g.name)} />);
        const r = Math.ceil(g.items.length / cols[i]);
        const y0 = 17 + ((rows - r) * (BH + 5)) / 2;
        g.items.forEach((it, j) => {
          const c = Math.floor(j / r);
          const rr = j % r;
          els.push(<Box key={k()} x={x + 6 + c * unit} y={y0 + rr * (BH + 5)} w={unit - 12} label={it} hi={isHi(it)} />);
        });
        x += gw + gap;
      });
      for (const [a, b, label] of spec.arrows ?? []) {
        const wa = unit * cols[a];
        const fwd = a < b;
        const x1 = fwd ? gx[a] + wa : gx[a];
        const x2 = fwd ? gx[b] : gx[b] + unit * cols[b];
        els.push(<Arrow key={k()} x1={x1} y1={H / 2 + 6} x2={x2} y2={H / 2 + 6} label={label} both={spec.both} />);
      }
      break;
    }
    case "flow": {
      // 흐름(+분기) — 위 줄 단계, branch 가 있으면 그 단계에서 아래 줄로 갈라진다
      const S = spec.steps;
      const m = S.length;
      const gap = gapFor(spec.labels ?? [], 24);
      const bw = Math.min(118, (W - 4 - gap * (m - 1)) / m);
      const total = m * bw + (m - 1) * gap;
      const x0 = (W - total) / 2;
      const y = 4;
      H = 30;
      S.forEach((s, i) => {
        const x = x0 + i * (bw + gap);
        els.push(<Box key={k()} x={x} y={y} w={bw} label={s} hi={isHi(s)} />);
        if (i < m - 1) els.push(<Arrow key={k()} x1={x + bw} y1={y + BH / 2} x2={x + bw + gap} y2={y + BH / 2} label={spec.labels?.[i]} />);
      });
      if (spec.branch) {
        const b = spec.branch;
        const bx = x0 + b.from * (bw + gap) + bw / 2;
        const bm = b.steps.length;
        const bw2 = Math.min(118, (W - 4 - gap * (bm - 1)) / bm);
        const t2 = bm * bw2 + (bm - 1) * gap;
        const bx0 = Math.max(2, Math.min(W - 2 - t2, bx - t2 / 2));
        const y2 = y + BH + 26;
        if (b.label)
          els.push(
            <text key={k()} x={bx + 6} y={y + BH + 14} fontSize={9.5} fill={SUB}>
              {b.label}
            </text>,
          );
        b.steps.forEach((s, i) => {
          const x = bx0 + i * (bw2 + gap);
          if (b.parallel || i === 0) els.push(<Arrow key={k()} x1={bx} y1={y + BH} x2={x + bw2 / 2} y2={y2} dashed={b.dashed} />);
          else els.push(<Arrow key={k()} x1={x - gap} y1={y2 + BH / 2} x2={x} y2={y2 + BH / 2} />);
          els.push(<Box key={k()} x={x} y={y2} w={bw2} label={s} hi={isHi(s)} />);
        });
        H = y2 + BH + 4;
      }
      if (spec.loop) {
        const xe = x0 + total - bw / 2;
        const xs = x0 + bw / 2;
        const yb = H + 10;
        els.push(<path key={k()} d={`M${xe},${y + BH} L${xe},${yb} L${xs},${yb} L${xs},${y + BH + 2}`} fill="none" stroke={INK} strokeWidth={1.2} markerEnd="url(#cd-arrow)" strokeDasharray="4 3" />);
        if (spec.loopLabel)
          els.push(
            <text key={k()} x={(xs + xe) / 2} y={yb - 3} fontSize={9.5} textAnchor="middle" fill={SUB}>
              {spec.loopLabel}
            </text>,
          );
        H = yb + 4;
      }
      break;
    }
    case "cycle": {
      // 순환 — 타원 둘레에 단계, 시계 방향 화살표
      const m = spec.steps.length;
      H = m <= 4 ? 92 : 104;
      const cx = W / 2;
      const cy = H / 2;
      const rx = 210;
      const ry = H / 2 - BH / 2 - 3;
      const bw = 112;
      const pts = spec.steps.map((_, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / m;
        return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
      });
      // 박스 테두리에서 끊는 화살표
      const edge = (p: { x: number; y: number }, dx: number, dy: number) => {
        const t = Math.min(dx ? (bw / 2 + 3) / Math.abs(dx) : Infinity, dy ? (BH / 2 + 3) / Math.abs(dy) : Infinity);
        return { x: p.x + dx * t, y: p.y + dy * t };
      };
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % m];
        const s = edge(p, q.x - p.x, q.y - p.y);
        const e = edge(q, p.x - q.x, p.y - q.y);
        els.push(<Arrow key={k()} x1={s.x} y1={s.y} x2={e.x} y2={e.y} />);
      });
      if (spec.center) els.push(<Group key={k()} x={cx - 60} y={cy - 11} w={120} h={22} />, <text key={k()} x={cx} y={cy + 4} fontSize={10.5} textAnchor="middle" fill={SUB} fontWeight={700}>{spec.center}</text>);
      spec.steps.forEach((s, i) => els.push(<Box key={k()} x={pts[i].x - bw / 2} y={pts[i].y - BH / 2} w={bw} label={s} hi={isHi(s)} />));
      break;
    }
    case "layer": {
      // 레이어드 — 위→아래 계층. 왼쪽 계층 이름, 오른쪽 점선 안에 요소
      const L = spec.layers;
      const lh = BH + 8;
      H = L.length * lh + 2;
      const nameW = 112;
      L.forEach((ly, i) => {
        const y = 1 + i * lh;
        if (!ly.items.length) {
          els.push(<Box key={k()} x={2} y={y + 3} w={W - 4} label={ly.name} hi={isHi(ly.name)} />);
          return;
        }
        els.push(<Box key={k()} x={2} y={y + 3} w={nameW} label={ly.name} hi={isHi(ly.name)} />);
        els.push(<Group key={k()} x={nameW + 8} y={y} w={W - nameW - 10} h={lh - 2} />);
        const m = ly.items.length;
        const bw = Math.min(140, (W - nameW - 24 - 6 * (m - 1)) / m);
        ly.items.forEach((it, j) => els.push(<Box key={k()} x={nameW + 14 + j * (bw + 6)} y={y + 3} w={bw} label={it} hi={isHi(it)} />));
      });
      break;
    }
    case "sequence": {
      // 시퀀스 — 위쪽 행위자 + 생명선, 메시지는 위에서 아래로(프로토콜·송수신)
      const A = spec.actors;
      const colW = (W - 20) / A.length;
      const mh = 17;
      H = BH + 14 + spec.msgs.length * mh;
      const cxOf = (i: number) => 10 + colW * i + colW / 2;
      A.forEach((a, i) => {
        const cx = cxOf(i);
        els.push(<Box key={k()} x={cx - 60} y={1} w={120} label={a} hi={isHi(a)} />);
        els.push(<line key={k()} x1={cx} y1={1 + BH} x2={cx} y2={H - 1} stroke={INK} strokeWidth={1} strokeDasharray="3 3" />);
      });
      spec.msgs.forEach((m, i) => {
        const y = BH + 16 + i * mh;
        const x1 = cxOf(m.from);
        const x2 = cxOf(m.to);
        els.push(<Arrow key={k()} x1={x1} y1={y} x2={x2 + (x2 > x1 ? -1 : 1)} y2={y} label={m.label} dashed={m.dashed} />);
      });
      break;
    }
    case "hub": {
      // 중심-위성 — 가운데 주제, 둘레에 요소
      const m = spec.items.length;
      H = m <= 4 ? 84 : 100;
      const cx = W / 2;
      const cy = H / 2;
      const cw = 132;
      const iw = 116;
      const rx = 215;
      const ry = H / 2 - BH / 2 - 2;
      spec.items.forEach((it, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / m + (m === 4 ? Math.PI / 4 : 0);
        const x = cx + rx * Math.cos(a);
        const y = cy + ry * Math.sin(a);
        els.push(<line key={k()} x1={cx} y1={cy} x2={x} y2={y} stroke={INK} strokeWidth={1.1} />);
        els.push(<Box key={k()} x={x - iw / 2} y={y - BH / 2} w={iw} label={it} hi={isHi(it)} />);
      });
      els.push(<Box key={k()} x={cx - cw / 2} y={cy - BH / 2} w={cw} label={spec.center} hi={!spec.hi || isHi(spec.center)} />);
      break;
    }
    case "tree": {
      // 계층 — 뿌리 → 자식 → 손자(의사결정·분류)
      const C = spec.children;
      const hasG = C.some((c) => c.children?.length);
      const y1 = BH + 18;
      const y2 = y1 + BH + 18;
      H = (hasG ? y2 : y1) + BH + 2;
      const rootW = 150;
      els.push(<Box key={k()} x={W / 2 - rootW / 2} y={1} w={rootW} label={spec.root} hi={isHi(spec.root)} />);
      // 손자 수만큼 폭을 나눠 준다
      const span = C.map((c) => Math.max(1, c.children?.length ?? 0));
      const unit = (W - 4) / span.reduce((a, b) => a + b, 0);
      let x = 2;
      C.forEach((c, i) => {
        const cw = unit * span[i];
        const cx = x + cw / 2;
        const bw = Math.min(140, cw - 10);
        els.push(<path key={k()} d={`M${W / 2},${1 + BH} L${W / 2},${y1 - 8} L${cx},${y1 - 8} L${cx},${y1}`} fill="none" stroke={INK} strokeWidth={1.1} />);
        els.push(<Box key={k()} x={cx - bw / 2} y={y1} w={bw} label={c.label} hi={isHi(c.label)} />);
        (c.children ?? []).forEach((gc, j) => {
          const gx = x + j * unit + unit / 2;
          const gw = Math.min(118, unit - 6);
          els.push(<path key={k()} d={`M${cx},${y1 + BH} L${cx},${y2 - 8} L${gx},${y2 - 8} L${gx},${y2}`} fill="none" stroke={INK} strokeWidth={1} />);
          els.push(<Box key={k()} x={gx - gw / 2} y={y2} w={gw} label={gc} hi={isHi(gc)} />);
        });
        x += cw;
      });
      break;
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="my-1 w-full max-w-[600px]" role="img" aria-label="개념도">
      <defs>
        <marker id="cd-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={INK} />
        </marker>
        <marker id="cd-arrow-s" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M8,0 L0,4 L8,8 z" fill={INK} />
        </marker>
      </defs>
      {els}
    </svg>
  );
}
