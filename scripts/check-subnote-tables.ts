/**
 * 서브노트 표(답안지 3단표) 규격 검사 — 빌드 전에 돌린다.
 *   npx tsx scripts/check-subnote-tables.ts
 *
 * 규칙(CLAUDE.md "교재 자료를 옮길 때"):
 *  - 3열(구분 | 키워드 | 설명), 각 행 셀 3개
 *  - 2열·3열은 1~4줄(\n), 두 열의 줄 수가 같다
 *    (구분 하나에 항목이 여럿이면 같은 구분으로 행을 반복하지 말고 줄로 쌓는다)
 *  - 한 줄은 공백 제외 1~7자(목표 5~7)
 *  - 예외: 공백이 없어 접을 수 없는 한 낱말은 12자까지 둔다
 *    (Thrashing·IR(addr)·PCB·스케줄링 같은 교재 용어. 교재 용어를 줄이지
 *     않기로 했으므로, 접을 데가 있으면 두 줄로 접고 없으면 그대로 둔다.)
 */
import { SUBNOTES } from "../src/data/textbookSubnotes";

const plain = (s: string) => s.replace(/\s/g, "");
const errs: string[] = [];
let tables = 0;
let rows = 0;
for (const s of SUBNOTES) {
  s.tables.forEach((tb, ti) => {
    tables++;
    const where = `${s.title}@${s.course} 표${ti + 1}`;
    if (tb.headers.length !== 3) errs.push(`${where}: 헤더 ${tb.headers.length}개`);
    tb.rows.forEach((r, ri) => {
      rows++;
      if (r.length !== 3) {
        errs.push(`${where} 행${ri + 1}: 셀 ${r.length}개`);
        return;
      }
      const l2 = r[1].split("\n");
      const l3 = r[2].split("\n");
      if (l2.length !== l3.length || l2.length < 1 || l2.length > 4)
        errs.push(`${where} 행${ri + 1}: 2열 ${l2.length}줄 / 3열 ${l3.length}줄`);
      for (const [ci, lines] of [[2, l2], [3, l3]] as const)
        for (const ln of lines) {
          const n = plain(ln).length;
          // 공백이 없으면 접을 데가 없다는 뜻이다 — 교재 용어를 줄이지 않는다.
          const max = /\s/.test(ln.trim()) ? 7 : 12;
          if (n < 1 || n > max) errs.push(`${where} 행${ri + 1} ${ci}열: '${ln}' ${n}자`);
        }
    });
  });
}
for (const e of errs) console.log(e);
console.log(`표 ${tables}개 · 행 ${rows}개 검사, 오류 ${errs.length}건 ${errs.length ? "FAIL" : "PASS"}`);
process.exit(errs.length ? 1 : 0);
