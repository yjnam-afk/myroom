/**
 * 교재 밖 토픽 검사 — src/data/examTopics.json 이 토픽 지도에 제대로 놓이는지.
 *   npx tsx scripts/check-exam-topics.ts
 * 과목 코드, 영역(없는 이름이면 새 영역으로 맨 뒤에 간다 — 경고), 상위 토픽(under)이 그 과목 교재 토픽인지,
 * 이름이 교재 토픽·서브 토픽·다른 줄과 겹치지 않는지를 보고, 이름으로 걸리는 문항 수(화면에 보이는 수)가 0인 것을 찍는다.
 */
import { readFileSync } from "node:fs";
import { TOPIC_TREE, treePlaces } from "@/data/topicTree";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";

type E = { name: string; code: string; area: string; group: string; under?: string; rel?: string; legacy?: boolean; n: number; past: number };
const list = JSON.parse(readFileSync("src/data/examTopics.json", "utf8")) as E[];
const bank = JSON.parse(readFileSync("src/data/questions.json", "utf8")) as { id: string; text: string }[];
const taken = new Set([...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)]);
let bad = 0;
let newArea = 0;
let newGroup = 0;
const seen = new Set<string>();
for (const e of list) {
  const err = (m: string) => {
    bad++;
    console.log(`✗ ${e.name} — ${m}`);
  };
  const areas = TOPIC_TREE[e.code];
  if (!areas) {
    err(`과목 코드 ${e.code}`);
    continue;
  }
  if (taken.has(e.name)) err("교재 토픽·서브 토픽과 같은 이름");
  if (seen.has(e.name)) err("같은 이름이 두 번");
  seen.add(e.name);
  const a = areas.find((x) => x.name === e.area);
  if (!a) newArea++;
  else if (!a.groups.some((g) => g.name === e.group)) newGroup++;
  if (e.under) {
    const at = treePlaces(e.code).get(e.under);
    if (!at) err(`상위 토픽 「${e.under}」이 ${e.code} 에 없음`);
    else if (at.area !== e.area || at.group !== e.group) err(`상위 토픽 자리(${at.area} › ${at.group})와 다름`);
  }
}
console.log(`교재 밖 토픽 ${list.length}개 · 기출에 나온 것 ${list.filter((e) => e.past).length} · 예전 화면 ${list.filter((e) => e.legacy).length} · 상위 토픽 아래 ${list.filter((e) => e.under).length} · 새 분류에 놓인 것 ${newGroup} · 새 영역 ${newArea}`);
if (process.argv.includes("--hits")) {
  // 이름으로 걸리는 문항(토픽 화면·지도 칩 숫자) — 0이면 이름이 문항 표기와 달라 화면이 비어 보인다
  const names = list.map((e) => e.name);
  const cnt = new Map<string, number>();
  for (const q of bank) for (const t of titlesMatching(q.text, names)) cnt.set(t, (cnt.get(t) ?? 0) + 1);
  const zero = list.filter((e) => !cnt.get(e.name));
  const wide = list.filter((e) => (cnt.get(e.name) ?? 0) >= Math.max(40, e.n * 6));
  console.log(`이름으로 걸리는 문항 0건 ${zero.length}개 · 조사 때보다 훨씬 많이 걸리는(넓은 이름) ${wide.length}개`);
  for (const e of zero.slice(0, 60)) console.log(`  0건: ${e.name} (조사 ${e.n})`);
  for (const e of wide.slice(0, 60)) console.log(`  넓음: ${e.name} — ${cnt.get(e.name)}문항 (조사 ${e.n})`);
}
console.log(bad ? `오류 ${bad}건 FAIL` : "PASS");
process.exit(bad ? 1 : 0);
