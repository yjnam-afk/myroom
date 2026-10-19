import MapClient, { type TopicStat } from "./MapClient";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { COURSE_TOPICS } from "@/data/curriculum";
import { examHistory, pastExams, mockExams } from "@/lib/examHistory";
import { peerAnswersFor } from "@/data/peerAnswers";
import { isCommentary } from "@/lib/answerKind";
import { LEVEL_MAPS, chipKey, chipTopic } from "@/data/levelMaps";
import { SUB_TOPICS } from "@/data/subTopics";
import { myNotesFor } from "@/data/myNotes";

/**
 * 토픽 지도 — 서버 컴포넌트.
 *
 * 지도의 칩 색(출제 빈도)·답안 표시에 쓰는 토픽별 숫자를 여기서 한 번 세어 넘긴다.
 * 문항·답안 자료는 커서 브라우저로 보내지 않는다(토픽 설명 화면과 같은 방식).
 */
export default function MapPage() {
  const titles = new Set<string>();
  for (const s of SUBNOTES) titles.add(s.title);
  for (const list of Object.values(COURSE_TOPICS)) for (const t of list) titles.add(t.title);
  // 교재 속 서브 토픽 — 상위 칩 아래 작은 칩의 출제 수
  for (const st of SUB_TOPICS) titles.add(st.name);
  const stats: Record<string, TopicStat> = {};
  for (const t of Array.from(titles)) {
    const peers = peerAnswersFor(t);
    const commentary = peers.filter(isCommentary).length;
    stats[t] = {
      past: pastExams(t).length,
      ns: examHistory(t).length,
      mock: mockExams(t).length,
      ans: peers.length - commentary,
      com: commentary,
      mine: myNotesFor(t).length,
    };
  }
  // 레벨 맵 칩 출제 횟수 — 토픽에 걸린 칩은 그 토픽 숫자, 아니면 칩 글자로 문항을 찾는다
  const chipHits: Record<string, number> = {};
  for (const maps of Object.values(LEVEL_MAPS))
    for (const m of maps)
      for (const c of [...m.rows.flatMap((r) => r.cells.flat()), ...(m.all?.chips ?? [])]) {
        const k = chipKey(c);
        const t = chipTopic(c);
        const key = `${k}|${t ?? ""}`;
        if (key in chipHits) continue;
        const s = t ? stats[t] : undefined;
        chipHits[key] = s ? s.past + s.ns + s.mock : pastExams(k).length + examHistory(k).length + mockExams(k).length;
      }
  return <MapClient stats={stats} chipHits={chipHits} />;
}
