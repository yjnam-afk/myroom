/**
 * 서브노트 표(답안지 표) 규격 검사 — 빌드 전에 돌린다.
 *   npx tsx scripts/check-subnote-tables.ts
 *
 * 규칙(CLAUDE.md "교재 자료를 옮길 때"):
 *  - 열 구성은 교재 표를 그대로 따른다(1~9열). 머리글도 교재 그대로.
 *    교재가 한 줄짜리 목록이면 1열 표로 둔다 — 없는 열을 지어내지 않는다.
 *    비교표라면 [구분 | A | B | C], 설명표라면 [구분 | 구성요소 | 설명] 식이다.
 *  - 모든 행은 헤더와 같은 수의 셀을 가진다.
 *  - 1열(구분)을 뺀 나머지 열은 1~4줄(\n).
 *  - 한 줄은 공백 제외 5~7칸. 영문·숫자는 한글 반 칸으로 센다
 *    (답안지에서도 좁게 들어가므로 'Factory Method' 는 7칸이다).
 *    맨 뒤 「설명」 열(2열 표는 마지막 열)만 14칸까지 — 교재 문장 한 줄이 그대로 들어가는 자리다.
 *  - 예외: 공백이 없어 접을 수 없는 한 낱말은 12칸까지 둔다
 *    (Thrashing·IR(addr)·PCB·스케줄링 같은 교재 용어. 교재 용어를 줄이지
 *     않기로 했으므로, 접을 데가 있으면 두 줄로 접고 없으면 그대로 둔다.)
 *  - 항목↔설명처럼 짝을 이루는 열은 줄 수를 맞춘다(화면이 ①②③ 으로 짝지어
 *    그린다). 한 열만 목록인 교재 표도 있으므로 어긋나면 경고만 낸다.
 */
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { subnoteExtraFor } from "../src/data/subnoteExtras";

/** 한글 1칸, 영문·숫자·기호 반 칸, 공백은 세지 않는다. */
const width = (s: string) =>
  [...s].reduce((w, c) => (/\s/.test(c) ? w : w + (c.charCodeAt(0) < 0x1100 ? 0.5 : 1)), 0);

const errs: string[] = [];
const warns: string[] = [];
let tables = 0;
let rows = 0;
for (const s of SUBNOTES) {
  s.tables.forEach((tb, ti) => {
    tables++;
    const where = `${s.title}@${s.course} 표${ti + 1}`;
    const n = tb.headers.length;
    if (n < 1 || n > 9) errs.push(`${where}: 헤더 ${n}개`);
    tb.rows.forEach((r, ri) => {
      rows++;
      if (r.length !== n) {
        errs.push(`${where} 행${ri + 1}: 셀 ${r.length}개 (헤더 ${n}개)`);
        return;
      }
      const cols = r.slice(1).map((c) => c.split("\n"));
      const multi = cols.map((c) => c.length).filter((l) => l > 1);
      if (cols.some((c) => c.length > 4))
        errs.push(`${where} 행${ri + 1}: 줄 ${cols.map((c) => c.length).join("/")}개`);
      // 짝을 이루는 표(항목↔설명)는 줄 수가 같아야 ①②③ 이 짝으로 읽힌다.
      // 한 열만 목록인 교재 표도 있으므로 오류가 아니라 경고로 센다.
      else if (new Set(multi).size > 1) warns.push(`${where} 행${ri + 1}: 줄 수 ${cols.map((c) => c.length).join("/")}`);
      // 「구분 | 항목 | 설명」 3열 표의 2열은 교재 1열(용어 이름 그대로)이라 1열처럼 너비를 재지 않는다.
      // tb.nameCol 로 적은 교재 이름 열도 재지 않는다(머리글을 교재대로 두면서 긴 이름을 넣으려고).
      const nameCols = new Set<number>(
        tb.nameCol === undefined ? [] : Array.isArray(tb.nameCol) ? tb.nameCol : [tb.nameCol],
      );
      if (n === 3 && tb.headers[0] === "구분" && tb.headers[2] === "설명") nameCols.add(1);
      cols.forEach((lines, ci) => {
        if (nameCols.has(ci + 1)) return;
        for (const ln of lines) {
          const w = width(ln);
          const body = ln.replace(/\s/g, "");
          const ascii = [...body].filter((c) => c.charCodeAt(0) < 0x1100).length;
          // 공백이 없으면 접을 데가 없다는 뜻이다 — 교재 용어를 줄이지 않는다.
          // 영문 이름이 반 넘는 줄(패턴 이름 나열 등)도 좁게 들어가므로 12칸까지 둔다.
          // 맨 뒤 「설명」 열은 교재 문장을 통째로 담으므로(구분 | 항목 | 설명) 14칸까지 둔다.
          const isDesc = ci === cols.length - 1 && (tb.headers[n - 1] === "설명" || n === 2);
          const max = isDesc ? 14 : !/\s/.test(ln.trim()) || ascii * 2 >= body.length ? 12 : 7;
          // 빈 칸은 교재에 값이 없다는 뜻이므로 그대로 둔다(여러 줄 안의 빈 줄만 오류).
          if (w > max || (lines.length > 1 && !w)) errs.push(`${where} 행${ri + 1} ${ci + 2}열: '${ln}' ${w}칸`);
        }
      });
    });
  });
}
for (const e of errs) console.log(e);
if (warns.length) console.log(`줄 수가 짝이 안 맞는 행 ${warns.length}개(경고)`);
// 교재 슬라이드 원본이 안 붙은 서브노트 — 슬라이드와 대조한 적이 없다는 뜻이다(2026-10-05: CSMA/CA 가
// 슬라이드 없이 지어 낸 정의·표로 남아 있었다). 슬라이드를 받아 붙이고 서브노트를 맞춘다.
const noSlide = SUBNOTES.filter((s) => !subnoteExtraFor(s.topicId, s.title)?.image).map((s) => s.title);
if (noSlide.length) console.log(`교재 슬라이드 없는 서브노트 ${noSlide.length}개(경고): ${noSlide.join(" / ")}`);
// 두 개념을 함께 묻는 토픽(「A / B」「A & B」「A와 B」「A, B」)은 답안 서론에서 개념마다 정의·특징을 따로 쓴다
// (2026-10-07 — "각자 정의, 특징 … 예전에 부탁했는데"). defPair(대등한 두 개념) 나 subDefs(큰 개념 + 하위 개념)가
// 없으면 오류로 센다. 제목에 「와」「,」가 있어도 한 개념인 토픽은 아래 ONE_CONCEPT 에 적는다.
const ONE_CONCEPT = new Set([
  "정보시스템 운영/유지보수 감리",
  "HTTP/3",
  "C-RAN(Centralized / Cloud RAN)",
  "DHP(Direct Hashing & Pruning) 알고리즘",
  "접근 제어/접근 통제(Access Control)",
  "품질통제도구, QC 7",
  // 슬라이드 정의가 「4가지 선언문과 12개 원칙」 한 문장뿐이라 나눌 정의가 없다
  "Agile 선언문과 12개 원칙",
  // 슬라이드에 정의는 해싱 하나뿐이고 충돌 해결방법은 표(방법·개념도)만 있다
  "해싱과 충돌해결방법",
  "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
  "MCP 보안취약점 및 대응방안",
  "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)",
  "정보시스템 감리 의무 대상과 관점별 점검 기준",
  "TCP 연결의 설정 및 해제(Handshaking)",
  "IPv4와 IPv6 터널링",
  "ISP 및 ISMP 수립 공통가이드 9판(2025.05)",
  "IT 투자성과 평가",
  "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)",
  "자율주행 자동차 보안취약점 및 대응방안",
  "스마트시티 보안취약점 및 대응방안",
  "스마트팩토리 보안취약점 및 대응방안",
  "클라우드 컴퓨팅 취약점, 대응기술",
  "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안",
  "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)",
]);
const noPair = SUBNOTES.filter((s) => {
  if (s.defPair?.length || s.subDefs?.length || ONE_CONCEPT.has(s.title)) return false;
  const t = s.title.replace(/\([^)]*\)/g, "");
  return / \/ | & |&|와 |과 | 및 |, /.test(t);
}).map((s) => s.title);
for (const t of noPair) errs.push(`[개념별 정의 없음] ${t} — defPair/subDefs 로 개념마다 정의·특징을 쓰거나 ONE_CONCEPT 에 적는다`);
for (const t of noPair) console.log(`[개념별 정의 없음] ${t}`);
console.log(`표 ${tables}개 · 행 ${rows}개 검사, 오류 ${errs.length}건 ${errs.length ? "FAIL" : "PASS"}`);
process.exit(errs.length ? 1 : 0);
