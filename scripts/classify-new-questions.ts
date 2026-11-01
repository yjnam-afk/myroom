/**
 * 미리보기 JSON(새 문항)의 과목을 교재 토픽 제목으로 다시 정한다 — 교재 토픽이 걸리면 그 과목, 아니면 그대로.
 * npx tsx scripts/classify-new-questions.ts <preview.json>
 * (import-itpe-search-tool.py 의 글자 비슷한 문항 추정은 TLB·DMA를 「신기술」, 망중립성을 「인공지능」으로 붙였다.)
 */
import { readFileSync, writeFileSync } from "fs";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { titlesMatching } from "@/lib/examHistory";
import { DOMAIN_LABEL } from "@/lib/domains";
import { SUB_TOPICS } from "@/data/subTopics";

const file = process.argv[2];
const rows: { text: string; category: string }[] = JSON.parse(readFileSync(file, "utf8"));
const course = new Map(SUBNOTES.map((s) => [s.title, s.course as string]));
// 서브 토픽(TLB·Mutex·DMA 방식 …)은 상위 토픽의 과목
for (const st of SUB_TOPICS) if (course.has(st.parent)) course.set(st.name, course.get(st.parent)!);
const titles = [...course.keys()];
let changed = 0, filled = 0;
for (const r of rows) {
  // 지문 앞부분(문제 머리)으로 본다 — 가·나·다 속 낱말로 딴 과목에 끌려가지 않게
  const head = r.text.split("\n")[0];
  const hit = titlesMatching(head, titles).sort((a, b) => b.length - a.length)[0];
  if (!hit) continue;
  const cat = DOMAIN_LABEL[course.get(hit)!];
  if (cat && cat !== r.category) {
    if (!r.category) filled++; else changed++;
    r.category = cat;
  }
}
writeFileSync(file, JSON.stringify(rows, null, 1));
console.log("바뀜", changed, "채움", filled, "빈칸", rows.filter((r) => !r.category).length, "/", rows.length);
