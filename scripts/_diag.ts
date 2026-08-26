import { TOPIC_GUIDES } from "@/data/topicGuides";
import topics from "@/data/topics.json";
import details from "@/data/topicDetails.json";
const D: any = details;
const ids = Object.keys(TOPIC_GUIDES);
let sameAsDef = 0, jargonScene = 0, noAnalogy = 0, longScene = 0, mapJargonAs = 0;
const ex: string[] = [];
// 비유 문장에 들어가면 안 되는 말(전문용어·한자어 덩어리)
const JARGON = /(동적으로|정적으로|기반으로|수행한다|제공한다|관리한다|최적화|아키텍처|프레임워크|메커니즘|프로토콜|인터페이스|모듈|컴포넌트|알고리즘|파라미터|프로세스를|시스템이|기술이다|방법론|표준화|추상화)/;
const TITLE = new Map((topics as any[]).map((t) => [t.id, t.title]));
for (const id of ids) {
  const g: any = TOPIC_GUIDES[id];
  const scene = String(g.scene || "");
  const det = String(D[id]?.detail || "");
  if (scene.length > 170) longScene++;
  if (JARGON.test(scene)) { jargonScene++; if (ex.length < 8) ex.push(`${TITLE.get(id) || id}\n   ${scene.slice(0, 150)}`); }
  // 정의문을 그대로 옮긴 흔적 — detail 첫 40자가 scene 안에 있음
  const head = det.replace(/^\[[^\]]*\]\s*/, "").slice(0, 30).trim();
  if (head.length > 15 && scene.includes(head)) sameAsDef++;
  if (!/(처럼|같이|같은|비유|생각하면|치면|셈|마치)/.test(scene)) noAnalogy++;
  const asJargon = (g.map || []).filter((m: any) => JARGON.test(m.as) || /[A-Z]{2,}/.test(m.as)).length;
  if (asJargon) mapJargonAs++;
}
console.log(`학습카드 ${ids.length}`);
console.log(`  비유 문장에 전문용어: ${jargonScene} (${((jargonScene / ids.length) * 100).toFixed(0)}%)`);
console.log(`  교재 정의문을 그대로 옮김: ${sameAsDef}`);
console.log(`  비유 표현(처럼/같이…)이 아예 없음: ${noAnalogy} (${((noAnalogy / ids.length) * 100).toFixed(0)}%)`);
console.log(`  장면이 170자 초과(길어서 안 읽힘): ${longScene}`);
console.log(`  '비유' 칸에 영문약어·전문용어가 들어감: ${mapJargonAs}`);
console.log("\n--- 예시 ---");
ex.forEach((e) => console.log(" •", e));
