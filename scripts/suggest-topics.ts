/**
 * 교재 토픽 추천 — 답안 id 나 문제 문구를 주면 걸리는 교재 서브노트 제목을 보여 준다(examHistory 열쇠 + 관련 토픽).
 *   npx tsx scripts/suggest-topics.ts peer-itpecs132-1-05 "TCP 4-way handshake"
 *   npx tsx scripts/suggest-topics.ts --empty            # topicTitles 가 빈 답안 전부
 * 정하는 건 사람이다 — 「암호화」「트랜잭션」「SQL」 같은 넓은 말로 걸린 것은 빼고 scripts/answers.ts set 으로 단다.
 */
import { PEER_ANSWERS } from "../src/data/peerAnswers";
import { topicsForQuestion } from "../src/lib/questionAnswers";

const args = process.argv.slice(2);
const items = args.includes("--empty")
  ? PEER_ANSWERS.filter((a) => !a.topicTitles.length).map((a) => ({ key: a.id, text: a.question }))
  : args.map((x) => {
      const a = PEER_ANSWERS.find((p) => p.id === x);
      return { key: x, text: a ? a.question : x };
    });
for (const { key, text } of items) {
  const t = topicsForQuestion(text);
  console.log(`${key} | ${text.split("\n")[0].slice(0, 50)} => ${t.length ? JSON.stringify(t) : "(없음)"}`);
}
