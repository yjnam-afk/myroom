import "server-only";
import { PEER_ANSWERS, type PeerAnswer } from "@/data/peerAnswers";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { DOMAIN_LABEL } from "@/lib/domains";
import modelData from "@/data/modelAnswers.json";
import questions from "@/data/questions.json";
import { topicsForQuestion } from "@/lib/questionAnswers";

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

/**
 * 클로드 모범답안 목록 행 — 문제별로 미리 써 둔 답안(modelAnswers.json).
 *
 * 이 화면은 원래 시험지 스캔(PEER_ANSWERS)만 보여 줘서, 스캔이 없는 토픽(프롬프트
 * 인젝션·하네스 엔지니어링·LoRA …)은 여기서 찾아도 「모범답안 없음」이었다.
 * 본문은 4,700편에 770만 자라 목록에는 싣지 않고, 펼칠 때 /api/model-answer 로 받는다.
 * 같은 문제가 여러 번 출제돼 답안을 공유하는 별칭(aliasOf) 문항은 정본 한 줄로 친다.
 */
export type ModelRow = {
  id: string;
  period: string;
  title: string;
  question: string;
  /** 출처 회차만(「140회 1교시 기출」) — 전체 근거 표기는 펼칠 때 받는다 */
  source: string;
  /** 묶음 기준 — 문제가 걸리는 첫 교재 토픽, 없으면 답안 제목 */
  topic: string;
  domain: string;
};

type MA = { period: string; title: string; answer: string; source: string } | { aliasOf: string };

export function modelRows(): ModelRow[] {
  const qText = new Map((questions as { id: string; text: string }[]).map((q) => [q.id, q.text]));
  const out: ModelRow[] = [];
  for (const [id, e] of Object.entries(modelData as Record<string, MA>)) {
    if ("aliasOf" in e) continue;
    const question = (qText.get(id) ?? "").trim() || e.title;
    const topics = topicsForQuestion(question);
    let domain = UNSORTED_DOMAIN;
    for (const t of topics) {
      const d = COURSE_BY_TITLE.get(t);
      if (d) { domain = d; break; }
    }
    if (domain === UNSORTED_DOMAIN) {
      const hint = `${e.title} ${question}`;
      for (const [re, d] of HINTS) if (re.test(hint)) { domain = d; break; }
    }
    out.push({
      id,
      period: e.period,
      title: e.title,
      question,
      source: e.source.replace(/^Claude\(클로드\) 작성 · /, "").split(" · ")[0],
      topic: topics[0] ?? e.title,
      domain,
    });
  }
  return out.sort((a, b) => a.period.localeCompare(b.period) || a.question.localeCompare(b.question, "ko"));
}
