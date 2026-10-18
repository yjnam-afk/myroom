/**
 * 서브 토픽 검사 — 상위 토픽이 교재 서브노트로 있고, 그 서브노트 안에 별칭이 하나라도 나오는지.
 * 출제 수(기출·NS·모의)와 걸리는 답안 수도 함께 찍는다. npx tsx scripts/check-sub-topics.ts
 */
import { SUBNOTES, subnoteByTitle } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { examHistory, pastExams, mockExams, titlesMatching } from "@/lib/examHistory";
import { PEER_ANSWERS } from "@/data/peerAnswers";

let bad = 0;
const titles = SUBNOTES.map((s) => s.title);
for (const st of SUB_TOPICS) {
  const p = subnoteByTitle(st.parent);
  const txt = p ? JSON.stringify(p) : "";
  const found = st.aliases.filter((a) => txt.includes(a));
  const clash = titlesMatching(st.name, titles).filter((t) => t !== st.parent);
  const ans = PEER_ANSWERS.filter((a) => titlesMatching(a.question, [st.name]).length).length;
  const ok = !!p && found.length > 0;
  if (!ok) bad++;
  console.log(
    `${ok ? "✓" : "✗"} ${st.name} ← ${st.parent}${p ? "" : " (상위 서브노트 없음)"} | 교재: ${found.join(", ") || "없음"} | 기출 ${pastExams(st.name).length} · NS ${examHistory(st.name).length} · 모의 ${mockExams(st.name).length} · 답안 ${ans}${clash.length ? ` | 겹치는 토픽: ${clash.join(", ")}` : ""}`,
  );
}
console.log(bad ? `오류 ${bad}건 FAIL` : "PASS");
process.exit(bad ? 1 : 0);
