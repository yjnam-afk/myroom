/**
 * 토픽 지도 계층(topicTree) 검사 — 과목 토픽이 모두 정확히 한 번씩, 모르는 제목 없이 들어 있는지.
 * 제목을 바꾸거나 토픽을 더했으면 돌린다: npx tsx scripts/check-topic-tree.ts
 */
import { DOMAIN_LABEL } from "@/lib/domains";
import { courseEntries } from "@/lib/courseOrder";
import { TOPIC_TREE, type TreeKid } from "@/data/topicTree";

let bad = 0;
for (const [code, label] of Object.entries(DOMAIN_LABEL)) {
  const want = courseEntries(code).map((e) => e.title);
  const got: string[] = [];
  const walk = (k: TreeKid) => {
    got.push(k.t);
    (k.kids ?? []).forEach(walk);
  };
  for (const a of TOPIC_TREE[code] ?? [])
    for (const g of a.groups)
      for (const it of g.items) {
        if (typeof it === "string") got.push(it);
        else {
          got.push(it.t);
          it.kids.forEach(walk);
        }
      }
  const ws = new Set(want);
  const missing = want.filter((t) => !got.includes(t));
  const unknown = got.filter((t) => !ws.has(t));
  const dup = got.filter((t, i) => got.indexOf(t) !== i);
  const areas = (TOPIC_TREE[code] ?? []).length;
  const ok = !missing.length && !unknown.length && !dup.length && areas > 0;
  if (!ok) bad++;
  console.log(`${ok ? "✓" : "✗"} ${code} ${label} 토픽 ${want.length} · 계층 ${got.length} · 영역 ${areas}`);
  for (const t of missing) console.log("   빠짐:", t);
  for (const t of unknown) console.log("   모르는 제목:", t);
  for (const t of dup) console.log("   중복:", t);
}
console.log(bad ? `오류 과목 ${bad}개 FAIL` : "PASS");
process.exit(bad ? 1 : 0);
