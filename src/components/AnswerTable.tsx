import { CellLines } from "@/components/TableCell";

/**
 * 답안지 3단표 — 해설집·손글씨 모범답안처럼 그린다(2026-10-11 — "진짜 답안지처럼").
 *
 * 교재 표는 1열(구분)이 행마다 되풀이된다(「재전송(Retransmission)」이 네 줄 연속). 실제 답안은
 * 같은 구분을 한 칸으로 합쳐(rowspan) 「구분 – 요소 – 설명」으로 읽히게 쓴다. 데이터는 교재 열
 * 구성을 그대로 두고, 그릴 때만 1열의 연속된 같은 값을 합친다. 줄 앞에 표시(①·-)는 붙이지
 * 않는다 — CLAUDE.md 「줄 앞에 표시를 붙이지 않는다」.
 */
export default function AnswerTable({
  headers,
  rows,
  dense = false,
}: {
  headers: string[];
  rows: string[][];
  /** 정리표처럼 좁은 칸에 넣을 때 */
  dense?: boolean;
}) {
  // 1열 rowspan — 같은 값이 이어지면 첫 행에만 그리고 아래 행은 건너뛴다.
  const span: number[] = rows.map(() => 1);
  for (let i = rows.length - 1; i > 0; i--) {
    if (rows[i][0] && rows[i][0] === rows[i - 1][0]) {
      span[i - 1] = span[i] + 1;
      span[i] = 0;
    }
  }
  const pad = dense ? "px-1.5 py-[3px]" : "px-2 py-1.5";
  const line = dense ? "border-slate-300" : "border-slate-600";
  return (
    <table className={`w-full border-collapse ${dense ? "text-[11px]" : "text-[12.5px]"} leading-relaxed`}>
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((h, hi) => (
              <th key={hi} className={`border ${line} bg-slate-100 ${pad} text-center font-bold text-slate-800`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            {r.map((c, ci) => {
              if (ci === 0 && span[ri] === 0) return null;
              return (
                <td
                  key={ci}
                  rowSpan={ci === 0 && span[ri] > 1 ? span[ri] : undefined}
                  className={`border ${line} ${pad} align-middle ${
                    ci === 0 ? "text-center font-semibold text-slate-800" : "align-top text-slate-800"
                  } ${ci === 0 && r.length > 2 ? "w-[22%]" : ""}`}
                >
                  {ci === 0 ? c : <CellLines text={c} />}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
