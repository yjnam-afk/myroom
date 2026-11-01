/**
 * camp-match.py 결과(JSON)를 peerAnswers.ts 의 PEER_ANSWERS_11 배열로 쓴다.
 *   npx tsx scripts/camp-to-ts.ts <matched.json>
 * topicTitles 는 교재 서브노트 제목 중 문제 문구에 걸리는 것(examHistory 열쇠). 흔한 말로 걸린 오탐은 DROP 으로 뺀다.
 */
import { readFileSync, writeFileSync } from "fs";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { titlesMatching } from "@/lib/examHistory";

type E = { rd: string; day: string; per: string; track: string; no: number; question: string; who: string; pages: string[]; date: string; qid: string | null };
const rows: E[] = JSON.parse(readFileSync(process.argv[2], "utf8"));
const titles = SUBNOTES.map((s) => s.title);
// 넓은 말로만 걸리는 토픽 — 문구에 이름 그대로 있지 않으면 뺀다(CLAUDE.md: 「암호화」「트랜잭션」「SQL」 …)
const DROP = new Set(["암호화(Encryption)", "SQL(Structured Query Language)", "트랜잭션(Transaction)"]);
const TRACK: Record<string, string> = { 관리: "m", 컴시응: "c", 공통: "g" };
const s = (v: unknown) => JSON.stringify(v);
const out: string[] = ["const PEER_ANSWERS_11: PeerAnswer[] = ["];
let linkedTopic = 0;
for (const e of rows) {
  const tt = titlesMatching(e.question, titles).filter((t) => !DROP.has(t));
  if (tt.length) linkedTopic++;
  const tag = `hs${e.rd}-${e.day}-${e.per}${e.track ? "-" + TRACK[e.track] : ""}-${String(e.no).padStart(2, "0")}`;
  const who = e.who.replace(/\s+/g, " ").trim();
  const exam =
    `KPC ${e.rd === "x" ? "" : e.rd + "회 대비 "}합숙훈련 해설집 (${e.date ?? "?"}, ${e.day}일차 ${e.per}교시` +
    `${e.track ? " " + e.track : ""}${who ? ", 해설 " + who : ""})`;
  out.push(
    "  {",
    `    id: ${s("peer-" + tag)},`,
    `    period: ${s(e.per + "교시")},`,
    `    no: ${s(String(e.no))},`,
    `    question: ${s(e.question)},`,
    `    exam: ${s(exam)},`,
    `    topicTitles: ${s(tt)},`,
    ...(e.qid ? [`    questionIds: ${s([e.qid])},`] : []),
    "    pages: [",
    ...e.pages.map((p, i) => `      { src: ${s(p)}, label: "${i + 1}쪽" },`),
    "    ],",
    "  },",
  );
}
out.push("];", "");
const P = "src/data/peerAnswers.ts";
let src = readFileSync(P, "utf8");
src = src.replace(/\nconst PEER_ANSWERS_11: PeerAnswer\[\] = \[[\s\S]*?\n\];\n/, "\n");
src = src.replace("\nexport const PEER_ANSWERS: PeerAnswer[] = [", "\n" + out.join("\n") + "\nexport const PEER_ANSWERS: PeerAnswer[] = [");
if (!src.includes("...PEER_ANSWERS_11,")) src = src.replace("  ...PEER_ANSWERS_10,\n];", "  ...PEER_ANSWERS_10,\n  ...PEER_ANSWERS_11,\n];");
writeFileSync(P, src);
console.log(rows.length, "편 ·", linkedTopic, "편이 교재 토픽에 걸림");
