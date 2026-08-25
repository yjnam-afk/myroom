/**
 * 토픽 출처(source) 무결성 점검.
 *
 * 규칙: 심화반 교재 서브노트에 같은 토픽이 있으면 출처는 반드시 "심화반" 이다.
 * (제목 표기가 달라도 subnoteByAlias 로 같은 토픽인지 판별한다.)
 * 엑셀을 새로 올리거나 토픽을 추가한 뒤 이 스크립트로 배지 표기가 어긋났는지 본다.
 */
import topics from "../src/data/topics.json";
import { SUBNOTES, subnoteByAlias } from "../src/data/textbookSubnotes";

const T = topics as { id: string; title: string; source?: string }[];
const OK = new Set(["심화반", "기필반", "기출", "요청"]);

const wrong = T.filter((t) => subnoteByAlias(t.id, t.title) && t.source !== "심화반");
const missing = T.filter((t) => !t.source);
const unknown = T.filter((t) => t.source && !OK.has(t.source));

const byBook = T.filter((t) => subnoteByAlias(t.id, t.title)).length;
console.log(`토픽 ${T.length} | 교재 서브노트 ${SUBNOTES.length} | 교재와 같은 토픽 ${byBook}`);
console.log(`교재에 있는데 심화반이 아님: ${wrong.length}`);
wrong.slice(0, 20).forEach((t) => console.log(`  - [${t.source}] ${t.id} ${t.title}`));
console.log(`출처 없음: ${missing.length}`);
missing.slice(0, 20).forEach((t) => console.log(`  - ${t.id} ${t.title}`));
console.log(`알 수 없는 출처: ${unknown.length}`);
unknown.slice(0, 20).forEach((t) => console.log(`  - [${t.source}] ${t.id} ${t.title}`));

const bad = wrong.length + missing.length + unknown.length;
console.log(bad === 0 ? "\nPASS — 출처 표기 이상 없음" : `\nFAIL — ${bad}건`);
process.exit(bad === 0 ? 0 : 1);
