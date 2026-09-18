/**
 * 답안지 표의 2열 이후 셀 — 한 셀에 여러 줄이 들어간다.
 *
 * 번호(①②③)는 ★짝을 찾으라고★ 붙이는 것이다. 2열과 3열이 같은 줄 수로 짝을
 * 이룰 때(2열 n줄째 ↔ 3열 n줄째) 어느 설명이 어느 구성요소의 것인지 번호로
 * 보이기 때문이다. 실제 답안지에서도 그렇게 쓴다.
 *
 * 그래서 짝지을 열이 없으면 번호를 붙이지 않는다. 「리팩토링 대상」처럼
 * [대상 | 설명] 두 열뿐인 표는 설명 한 문장이 칸 너비 때문에 접힌 것인데,
 * 거기에 ①②③ 이 붙으니 세 가지 항목인 것처럼 보였다.
 */
const MARKS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

/** 이 행에 번호를 붙일까 — 2열 이후에 여러 줄짜리 칸이 둘 이상이면 짝이 있다. */
export function rowPaired(row: readonly string[]): boolean {
  return row.slice(1).filter((c) => c.includes("\n")).length >= 2;
}

export function CellLines({ text, paired = true }: { text: string; paired?: boolean }) {
  const lines = text.split("\n");
  if (lines.length < 2) return <>{text}</>;
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i} className="block">
          {paired && <span className="mr-1 text-slate-400">{MARKS[i] ?? "-"}</span>}
          {ln}
        </span>
      ))}
    </>
  );
}
