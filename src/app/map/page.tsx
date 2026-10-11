import MapClient, { type TopicStat } from "./MapClient";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { COURSE_TOPICS } from "@/data/curriculum";
import { examHistory, pastExams, mockExams } from "@/lib/examHistory";
import { peerAnswersFor } from "@/data/peerAnswers";
import { isCommentary } from "@/lib/answerKind";

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
    };
  }
  return <MapClient stats={stats} />;
}
