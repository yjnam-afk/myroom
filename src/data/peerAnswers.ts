/**
 * 남이 쓴 답안 — 손으로 쓴 실제 시험지 스캔과 강사 첨삭.
 *
 * 모범답안(modelAnswers.json)이 "이렇게 쓰면 된다"라면, 여기는 "실제로 이렇게
 * 쓰고 이런 점수를 받았다"다. 두 가지가 다른 자료라 섞지 않는다.
 *  - 배점 대비 실제 점수를 보면 내 답안의 눈높이가 잡힌다.
 *  - 빨간 첨삭이 곧 채점 기준이다. 뭘 빠뜨리면 감점인지가 그대로 드러난다.
 *  - 손글씨 분량·표 크기를 보면 한 페이지에 얼마를 담아야 하는지 감이 온다.
 *
 * ★ 새 답안을 추가할 때 ★
 *  1) 스캔을 public/answers/ 에 JPEG 로 넣는다(가로 1200px, quality 72 안팎).
 *     PNG 로 넣으면 장당 2~3MB라 저장소가 감당 못 한다.
 *  2) 아래 PEER_ANSWERS 에 항목을 하나 추가한다.
 *  3) topicTitles 에는 이 답안이 걸릴 토픽 제목을 적는다. 교재 서브노트 제목과
 *     같게 적으면 그 토픽 설명 페이지에 자동으로 붙는다.
 */

export type PeerAnswerPage = {
  /** public 기준 경로 — 예: /answers/os-kernel-p1-1.jpg */
  src: string;
  /** 시험지에 찍힌 쪽 번호(있으면) */
  label?: string;
};

export type PeerAnswer = {
  id: string;
  /** 1교시 · 2교시 · 3교시 · 4교시 */
  period: "1교시" | "2교시" | "3교시" | "4교시";
  /** 문제 번호(시험지 표기 그대로) */
  no?: string;
  /** 문제 전문 */
  question: string;
  /** 어느 시험인지 — 회차·모의고사명 */
  exam?: string;
  /** 이 답안이 걸릴 토픽 제목들(교재 서브노트 제목과 같게) */
  topicTitles: string[];
  /** 받은 점수와 배점 — 눈높이를 잡는 데 이게 제일 중요하다 */
  score?: number;
  maxScore?: number;
  /** 강사 첨삭에서 읽어낸 지적·칭찬. 한 줄씩. */
  feedback?: string[];
  /** 이 답안에서 배울 점 — 내가 읽고 정리한 한 줄. */
  takeaway?: string;
  pages: PeerAnswerPage[];
};

export const PEER_ANSWERS: PeerAnswer[] = [
  {
    id: "peer-os-kernel-1",
    period: "1교시",
    no: "9",
    question: "운영체제 커널 역할과 구조, 종류에 대하여 설명하시오.",
    exam: "NS반 모의고사",
    topicTitles: ["커널(Kernel)", "CPU Ring Level"],
    score: 6.2,
    maxScore: 10,
    feedback: [
      "구조 항목에 '단일·계층·마이크로'라는 축 이름을 먼저 쓰라는 지적. 그림만 그리고 분류명을 안 적었다.",
      "종류 표에 '유니커널'이 빠졌다는 추가 지적.",
      "역할 표(HW 자원 보호 · 파일시스템/NW 관리 · Kernel 데이터 보호)는 Good.",
    ],
    takeaway:
      "10점 만점에 6.2점. 표와 그림은 갖췄는데 분류 축 이름을 안 써서 깎였다. 표를 그리기 전에 '무엇으로 나눈 표인가'를 한 줄로 먼저 밝히는 것이 점수다.",
    pages: [
      { src: "/answers/os-kernel-p1-1.jpg", label: "2쪽" },
      { src: "/answers/os-kernel-p1-2.jpg", label: "3쪽" },
    ],
  },
  {
    id: "peer-os-kernel-2",
    period: "2교시",
    no: "1",
    question:
      "가. 운영체제의 종류, 기능, 목적에 대하여 설명하시오.\n나. 커널의 정의, 종류에 대하여 설명하시오.",
    exam: "NS반 모의고사",
    topicTitles: ["커널(Kernel)", "CPU Ring Level"],
    score: 15.0,
    maxScore: 25,
    feedback: [
      "전체 Good. 커널 종류를 개념도까지 그려 다섯 가지(모놀리식·마이크로·하이브리드·엑소·유니)로 편 것이 강점.",
      "서론 정의문 '응용 SW 및 HW, I/O 장치의 제어 및 추상화, 응용 SW를 관리하는 시스템 SW' 에 표시 — 정의를 한 문장으로 맺은 점.",
      "마지막에 CPU Level Ring(Ring 0~3)으로 커널 보호를 붙여 답안을 닫았다.",
    ],
    takeaway:
      "25점 만점에 15.0점. 종류마다 개념도를 그린 표가 핵심이다. 1교시에서 깎였던 '분류 축'을 여기서는 개념도로 대신 보여 줬다.",
    pages: [
      { src: "/answers/os-kernel-p2-1.jpg", label: "1쪽" },
      { src: "/answers/os-kernel-p2-2.jpg", label: "2쪽" },
      { src: "/answers/os-kernel-p2-3.jpg", label: "3쪽" },
      { src: "/answers/os-kernel-p2-4.jpg", label: "4쪽" },
    ],
  },
];

/** 제목 비교용 정규화 — 괄호 병기·공백·기호를 털어낸다. */
function norm(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}

const BY_TOPIC = new Map<string, PeerAnswer[]>();
for (const a of PEER_ANSWERS) {
  for (const t of a.topicTitles) {
    const k = norm(t);
    if (!BY_TOPIC.has(k)) BY_TOPIC.set(k, []);
    BY_TOPIC.get(k)!.push(a);
  }
}

/** 이 토픽에 걸린 남의 답안들. 없으면 빈 배열. */
export function peerAnswersFor(title?: string): PeerAnswer[] {
  if (!title) return [];
  return BY_TOPIC.get(norm(title)) ?? [];
}

/** 문제 문장으로 찾는다 — 문제은행·기출에서 같은 문제를 만났을 때. */
export function peerAnswersForQuestion(question?: string): PeerAnswer[] {
  if (!question) return [];
  const q = norm(question);
  return PEER_ANSWERS.filter((a) => {
    const mine = norm(a.question);
    return q.includes(mine) || mine.includes(q);
  });
}

export const PEER_ANSWER_COUNT = PEER_ANSWERS.length;
