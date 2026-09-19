/**
 * 답안지 표의 2열 이후 셀 — 한 셀에 여러 줄이 들어간다.
 *
 * 줄 앞에 번호(①②③)를 붙였던 적이 있다. 2열 n줄째 ↔ 3열 n줄째가 짝이라는
 * 표시였는데, 칸 너비(5~7칸) 때문에 한 문장이 접힌 줄에도 번호가 붙어
 * 「범위 관리 절차 / 방법 정의」가 두 항목처럼 읽혔다. 번호가 뜻을 끊었다.
 * 그래서 번호를 떼고 줄만 그대로 그린다.
 */
export function CellLines({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.length < 2) return <>{text}</>;
  return (
    <>
      {lines.map((ln, i) => (
        <span key={i} className="block">
          {ln}
        </span>
      ))}
    </>
  );
}
