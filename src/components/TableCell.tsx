/**
 * 답안지 3단표의 2·3열 셀 — 한 셀에 두 줄이면 서로 다른 항목이라는 뜻이다.
 *
 * 줄바꿈만으로 그리면 한 문장이 접힌 것인지 항목이 둘인지 구별되지 않는다.
 * 실제 답안지에서도 항목이 둘이면 각 줄 앞에 '-' 를 붙여 구분하므로 그대로 따른다.
 * 한 줄짜리 셀은 구분할 것이 없으므로 표시를 붙이지 않는다.
 */
export function CellLines({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.length < 2) return <>{text}</>;
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i} className="block">
          <span className="mr-1 text-slate-400">-</span>
          {ln}
        </span>
      ))}
    </>
  );
}
