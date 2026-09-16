/**
 * 서브노트 표(답안지 표) 규격 검사 — 빌드 전에 돌린다.
 *   npx tsx scripts/check-subnote-tables.ts
 *
 * 규칙(CLAUDE.md "교재 자료를 옮길 때"):
 *  - 열 구성은 교재 표를 그대로 따른다(2~9열). 머리글도 교재 그대로.
 *    비교표라면 [구분 | A | B | C], 설명표라면 [구분 | 구성요소 | 설명] 식이다.
 *  - 모든 행은 헤더와 같은 수의 셀을 가진다.
 *  - 1열(구분)을 뺀 나머지 열은 1~4줄(\n).
 *  - 한 줄은 공백 제외 5~7칸. 영문·숫자는 한글 반 칸으로 센다
 *    (답안지에서도 좁게 들어가므로 'Factory Method' 는 7칸이다).
 *  - 예외: 공백이 없어 접을 수 없는 한 낱말은 12칸까지 둔다
 *    (Thrashing·IR(addr)·PCB·스케줄링 같은 교재 용어. 교재 용어를 줄이지
 *     않기로 했으므로, 접을 데가 있으면 두 줄로 접고 없으면 그대로 둔다.)
 *  - 여러 줄인 열이 둘 이상이면 줄 수가 같아야 한다 — 화면이 ①②③ 으로
 *    짝을 지어 그리기 때문이다. 한 줄짜리 열은 행 전체에 걸리므로 상관없다.
 */
import { SUBNOTES } from "../src/data/textbookSubnotes";

/** 한글 1칸, 영문·숫자·기호 반 칸, 공백은 세지 않는다. */
const width = (s: string) =>
  [...s].reduce((w, c) => (/\s/.test(c) ? w : w + (c.charCodeAt(0) < 0x1100 ? 0.5 : 1)), 0);

const errs: string[] = [];
let tables = 0;
let rows = 0;
for (const s of SUBNOTES) {
  s.tables.forEach((tb, ti) => {
    tables++;
    const where = `${s.title}@${s.course} 표${ti + 1}`;
    const n = tb.headers.length;
    if (n < 2 || n > 9) errs.push(`${where}: 헤더 ${n}개`);
    tb.rows.forEach((r, ri) => {
      rows++;
      if (r.length !== n) {
        errs.push(`${where} 행${ri + 1}: 셀 ${r.length}개 (헤더 ${n}개)`);
        return;
      }
      const cols = r.slice(1).map((c) => c.split("\n"));
      const multi = cols.map((c) => c.length).filter((l) => l > 1);
      if (cols.some((c) => c.length > 4) || new Set(multi).size > 1)
        errs.push(`${where} 행${ri + 1}: 줄 수 ${cols.map((c) => c.length).join("/")}`);
      cols.forEach((lines, ci) => {
        for (const ln of lines) {
          const w = width(ln);
          const body = ln.replace(/\s/g, "");
          const ascii = [...body].filter((c) => c.charCodeAt(0) < 0x1100).length;
          // 공백이 없으면 접을 데가 없다는 뜻이다 — 교재 용어를 줄이지 않는다.
          // 영문 이름이 반 넘는 줄(패턴 이름 나열 등)도 좁게 들어가므로 12칸까지 둔다.
          const max = !/\s/.test(ln.trim()) || ascii * 2 >= body.length ? 12 : 7;
          // 빈 칸은 교재에 값이 없다는 뜻이므로 그대로 둔다(여러 줄 안의 빈 줄만 오류).
          if (w > max || (lines.length > 1 && !w)) errs.push(`${where} 행${ri + 1} ${ci + 2}열: '${ln}' ${w}칸`);
        }
      });
    });
  });
}
for (const e of errs) console.log(e);
console.log(`표 ${tables}개 · 행 ${rows}개 검사, 오류 ${errs.length}건 ${errs.length ? "FAIL" : "PASS"}`);
process.exit(errs.length ? 1 : 0);
