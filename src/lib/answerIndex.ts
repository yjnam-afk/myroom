import "server-only";
import { PEER_ANSWERS, type PeerAnswer } from "@/data/peerAnswers";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { DOMAIN_LABEL } from "@/lib/domains";

/** 서브노트 제목 → 과목 이름. 답안이 걸린 첫 토픽의 과목이 그 답안의 과목이다. */
const COURSE_BY_TITLE = new Map(SUBNOTES.map((s) => [s.title, DOMAIN_LABEL[s.course] ?? s.course]));

/**
 * 토픽이 안 걸린 답안(주간모의고사 묶음 등)은 시험명·문제에 적힌 과목 표시로 잡는다.
 * 「5주차 주간모의고사 2교시(NW)」「[서비스] 금융산업 인메모리 컴퓨팅」 같은 꼴.
 */
const HINTS: [RegExp, string][] = [
  [/CAOS|\(CA\)|컴퓨터구조/i, "컴퓨터구조"],
  [/\(OS\)|운영체제/i, "운영체제"],
  [/\(DB\)|데이터베이스|\bDB_/i, "데이터베이스"],
  [/\(NW\)|네트워크|\bNW_/i, "네트워크"],
  [/\(AI\)|인공지능|\bAI_|통계/i, "인공지능"],
  [/\(보안\)|\(SC\)|보안_|\[보안\]/i, "보안"],
  [/\(소공\)|\(SW\)|\(SE\)|SW공학|\bSW_|\[SW\]/i, "소프트웨어공학"],
  [/\(PM\)|프로젝트관리|\bPM_/i, "프로젝트관리"],
  [/\(DS\)|자료구조/i, "자료구조"],
  [/\(AL\)|알고리즘/i, "알고리즘"],
  [/IT경영|\(MG\)|경영전략|\bMG_/i, "경영전략"],
  [/\(DX\)|\[서비스\]|디지털서비스|\bDS_/i, "디지털서비스"],
];

export const UNSORTED_DOMAIN = "미분류";

function domainOf(a: PeerAnswer): string {
  for (const t of a.topicTitles) {
    const d = COURSE_BY_TITLE.get(t);
    if (d) return d;
  }
  const hint = `${a.exam ?? ""} ${a.question}`;
  for (const [re, d] of HINTS) if (re.test(hint)) return d;
  return UNSORTED_DOMAIN;
}

/**
 * 모범답안 목록 화면용 색인.
 *
 * 모범답안 = 실제로 제출해 점수를 받은 답안지 스캔(PEER_ANSWERS)이다.
 * 토픽 설명 안에서만 볼 수 있어서 "지금 어떤 답안지가 있나"를 훑을 자리가
 * 없었다. 여기서 검색용 문자열만 얹어 그대로 넘긴다 — 스캔은 이미지라
 * 목록이 가벼워 통째로 내려보내도 된다.
 */
export type AnswerRow = PeerAnswer & {
  /** 검색 대상(소문자) — 문제·시험·토픽·첨삭 */
  hay: string;
  /** 과목 이름(컴퓨터구조·운영체제 …) — 목록 화면의 도메인 필터에 쓴다. 못 잡으면 '미분류'. */
  domain: string;
};

export function answerRows(): AnswerRow[] {
  return PEER_ANSWERS.map((a) => ({
    ...a,
    hay: [a.question, a.exam ?? "", a.topicTitles.join(" "), (a.feedback ?? []).join(" ")]
      .join(" ")
      .toLowerCase(),
    domain: domainOf(a),
  })).sort((a, b) => a.period.localeCompare(b.period) || a.question.localeCompare(b.question, "ko"));
}
