/**
 * 답안지 3단표의 2·3열 셀 — 한 셀에 여러 줄이면 서로 다른 항목이라는 뜻이다.
 *
 * 줄바꿈만으로 그리면 한 문장이 접힌 것인지 항목이 여럿인지 구별되지 않는다.
 * 게다가 2열과 3열은 같은 줄 수로 짝을 이루는데(2열 n줄째 ↔ 3열 n줄째),
 * 앞에 붙는 표시가 모두 같으면 어느 설명이 어느 구성요소의 것인지 알 수 없다.
 * 실제 답안지에서도 항목이 여럿이면 번호를 매기므로 그대로 따른다 —
 * 2열 ②와 3열 ②가 한 짝이다. 줄이 접혀도 번호로 짝을 찾을 수 있다.
 *
 * 한 줄짜리 셀은 구분할 것이 없으므로 표시를 붙이지 않는다.
 */
const MARKS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

export function CellLines({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.length < 2) return <>{text}</>;
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i} className="block">
          <span className="mr-1 text-slate-400">{MARKS[i] ?? "-"}</span>
          {ln}
        </span>
      ))}
    </>
  );
}
