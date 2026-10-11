import type { AnswerConclusion } from "@/data/answerConclusions";

/**
 * 리스트형 결론(지침 V35 — 로드맵 스타일 그림 리스트) — 번호 원을 세로줄로 잇고, 번호 오른쪽에
 * 키워드 박스, 그 오른쪽에 짧은 설명. 강조는 핵심 항목 하나(번호 원·박스)에만.
 */
export default function ConclusionList({ items }: { items: NonNullable<AnswerConclusion["items"]> }) {
  const W = 600;
  const step = 28;
  const H = items.length * step + 6;
  const NUM = ["①", "②", "③", "④"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="my-1 w-full max-w-[600px]" role="img" aria-label="결론 리스트">
      {items.length > 1 && <line x1={30} y1={step / 2 + 3} x2={30} y2={(items.length - 1) * step + step / 2 + 3} stroke="#111" strokeWidth={1.3} />}
      {items.map((it, i) => {
        const y = i * step + step / 2 + 3;
        return (
          <g key={i}>
            <circle cx={30} cy={y} r={10} fill={it.hi ? "#fde68a" : "#fff"} stroke="#111" strokeWidth={it.hi ? 2 : 1.2} />
            <text x={30} y={y + 4} fontSize={11} textAnchor="middle" fill="#111">
              {NUM[i] ? NUM[i].replace(/[①②③④]/, String(i + 1)) : i + 1}
            </text>
            <line x1={40} y1={y} x2={58} y2={y} stroke="#111" strokeWidth={1.2} />
            <rect x={58} y={y - 11} width={170} height={22} rx={4} fill={it.hi ? "#fde68a" : "#fff"} stroke="#111" strokeWidth={it.hi ? 2 : 1.2} />
            <text x={143} y={y + 4} fontSize={11.5} textAnchor="middle" fill="#111" fontWeight={it.hi ? 700 : 400}>
              {it.kw}
            </text>
            <text x={242} y={y + 4} fontSize={11.5} fill="#1e293b">
              {it.desc}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
