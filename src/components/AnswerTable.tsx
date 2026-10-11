/**
 * 표 칸 글자 수(1교시 지침 V32) — 공백·하이픈·가운뎃점 빼고, 영문 2자 = 한글 1자,
 * 숫자·기호 묶음(CR≤0.1, 1~9, 24bit)은 1자.
 */
export function cellLen(s: string): number {
  let t = s.replace(/[\s\-·]/g, "");
  let n = 0;
  // 숫자로 시작하는 숫자·기호·단위 묶음은 1자
  t = t.replace(/[0-9][0-9.,~≤≥<>=%:/]*[A-Za-z]{0,4}/g, () => {
    n += 1;
    return "";
  });
  for (const ch of t) n += /[A-Za-z]/.test(ch) ? 0.5 : 1;
  return Math.ceil(n);
}

/** 한 칸의 줄들 — 줄마다 「- 」. 「특징)」처럼 머리말이 있는 줄은 그대로 둔다. */
function Dashed({ text, max }: { text: string; max?: number }) {
  return (
    <>
      {text.split("\n").map((ln, i) => {
        // 영문이 반 넘는 줄은 고유명(구성요소·프로토콜명)으로 보고 글자 수 예외(V32 2열 예외)
        const latin = (ln.match(/[A-Za-z]/g) ?? []).length * 2 > ln.replace(/\s/g, "").length;
        const n = max && ln && !latin ? cellLen(ln) : 0;
        const over = !!max && n > max;
        return (
          <span
            key={i}
            className={`block ${over ? "underline decoration-rose-300 decoration-dotted underline-offset-4" : ""}`}
            title={over ? `${n}자 — 이 열은 ${max}자까지(지침 V32)` : undefined}
          >
            {ln && !/^(특징\)|[-–·•※])/.test(ln) ? `- ${ln}` : ln}
          </span>
        );
      })}
    </>
  );
}

/** 칸 비율 — 3단표 2:2:6, 2단표 2:8, 그 밖은 1열만 좁게 */
function widthOf(n: number, ci: number): string {
  if (n === 3) return ["w-[20%]", "w-[20%]", "w-[60%]"][ci];
  if (n === 2) return ci === 0 ? "w-[20%]" : "w-[80%]";
  return ci === 0 ? "w-[16%]" : "";
}

/**
 * 답안지 3단표 — 해설집·손글씨 모범답안처럼 그린다(2026-10-11 — "진짜 답안지처럼").
 *
 * 교재 표는 1열(구분)이 행마다 되풀이된다(「재전송(Retransmission)」이 네 줄 연속). 실제 답안은
 * 같은 구분을 한 칸으로 합쳐(rowspan) 「구분 – 요소 – 설명」으로 읽히게 쓴다. 데이터는 교재 열
 * 구성을 그대로 두고, 그릴 때만 1열의 연속된 같은 값을 합친다.
 *
 * 답안지 지침(prompts.ts 6-0-b, /answer 「일도일표」)대로 표는 점 대신 「–」로 줄을 가른다 —
 * 2열부터 줄마다 「- 」를 붙인다(해설집 「- 해밍코드」「- 필요한 수 만큼…」). 데이터에는 표시를
 * 넣지 않고(CLAUDE.md 「줄 앞에 표시를 붙이지 않는다」 — ①②로 짝을 매기다 뜻이 끊긴 일) 그릴 때만 붙인다.
 * 칸 비율은 3단표 2:2:6, 2단표 2:8.
 */
export default function AnswerTable({
  headers,
  rows,
  dense = false,
  limits,
}: {
  headers: string[];
  rows: string[][];
  /** 정리표처럼 좁은 칸에 넣을 때 */
  dense?: boolean;
  /** 열별 글자 수 상한 — 넘는 줄에 점선 밑줄(답안지 템플릿의 V32 점검) */
  limits?: (number | undefined)[];
}) {
  // 1열 rowspan — 같은 값이 이어지면 첫 행에만 그리고 아래 행은 건너뛴다.
  const span: number[] = rows.map(() => 1);
  for (let i = rows.length - 1; i > 0; i--) {
    if (rows[i][0] && rows[i][0] === rows[i - 1][0]) {
      span[i - 1] = span[i] + 1;
      span[i] = 0;
    }
  }
  // 답안지에서는 칸 한 줄 = 괘선 한 줄(28px = 27px 줄 + 1px 선) — 줄 수를 그대로 셀 수 있게
  const pad = dense ? "px-1.5 py-[3px]" : "px-2 py-0 leading-[27px]";
  const line = dense ? "border-slate-300" : "border-slate-600";
  return (
    <table className={`w-full border-collapse ${dense ? "text-[11px] leading-relaxed" : "text-[12.5px]"}`}>
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
                  } ${widthOf(r.length, ci)}`}
                >
                  {ci === 0 ? c : <Dashed text={c} max={limits?.[ci]} />}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
