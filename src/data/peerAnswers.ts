/**
 * 남이 쓴 답안 — 손으로 쓴 실제 시험지 스캔과 강사 첨삭.
 *
 * 모범답안(modelAnswers.json)이 "이렇게 쓰면 된다"라면, 여기는 "실제로 이렇게
 * 쓰고 이런 점수를 받았다"다. 두 가지가 다른 자료라 섞지 않는다.
 *  - 배점 대비 실제 점수를 보면 내 답안의 눈높이가 잡힌다.
 *  - 빨간 첨삭이 곧 채점 기준이다. 뭘 빠뜨리면 감점인지가 그대로 드러난다.
 *  - 손글씨 분량·표 크기를 보면 한 페이지에 얼마를 담아야 하는지 감이 온다.
 *
 * ★ 데이터는 src/data/peerAnswers/*.json (2026-11-01 — TS 배열 11만 줄을 문자열 치환으로 고치다
 *   빌드가 깨진 뒤 JSON 으로 옮겼다). 한 줄에 답안 하나. 손으로 고치지 말고 scripts/answers.ts 로
 *   고친다 — 고친 뒤 검사(id 중복·필수 칸·이미지 파일·questionIds·topicTitles)를 거쳐야 저장된다.
 *     npx tsx scripts/answers.ts check                     # 검사만(prebuild 에서도 돈다)
 *     npx tsx scripts/answers.ts set <id> question "…"     # 칸 하나 고치기
 *     npx tsx scripts/answers.ts add-qid <id> <qid> / rm-qid <id> <qid>
 *     npx tsx scripts/answers.ts add <file.json> [묶음번호]  # 새 답안 여럿
 *   새 스캔은 public/answers/ 에 webp(가로 1100, q60~70)로.
 *   topicTitles 에는 교재 서브노트 제목 그대로 — 그 토픽 설명 페이지에 자동으로 붙는다.
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
  /**
   * 문제은행에서 이 답안이 붙을 문항 id — 같은 문제가 그대로 다시 나왔을 때(NS 19기 02주차
   * 2교시 4번 = peer-ca-coh-1 의 ①②③). 문구 부분 일치로는 못 잡는 긴 2교시 문제용.
   */
  questionIds?: string[];
  /** 받은 점수와 배점 — 눈높이를 잡는 데 이게 제일 중요하다 */
  score?: number;
  maxScore?: number;
  /** 시험지의 빨간 첨삭을 그대로 옮긴 것. 해석은 붙이지 않는다. */
  feedback?: string[];
  /** 스캔에 대한 메모(점수가 안 보인다, 같은 쪽이 두 번 찍혔다 …) — 화면엔 안 그린다 */
  memo?: string;
  pages: PeerAnswerPage[];
};

import { titleKey } from "@/lib/questionText";
import g01 from "./peerAnswers/01.json";
import g02 from "./peerAnswers/02.json";
import g03 from "./peerAnswers/03.json";
import g04 from "./peerAnswers/04.json";
import g05 from "./peerAnswers/05.json";
import g06 from "./peerAnswers/06.json";
import g07 from "./peerAnswers/07.json";
import g08 from "./peerAnswers/08.json";
import g09 from "./peerAnswers/09.json";
import g10 from "./peerAnswers/10.json";
import g11 from "./peerAnswers/11.json";

// 묶음은 들어온 차례대로(01~05 정리 답안·KPC·주간, 06~08 기출 해설집, 09~10 NS 19기·132회, 11 KPC 합숙 해설집).
// 자세한 구성은 src/data/peerAnswers/README.md.
export const PEER_ANSWERS: PeerAnswer[] = [
  g01, g02, g03, g04, g05, g06, g07, g08, g09, g10, g11
].flatMap((g) => g as PeerAnswer[]);

const norm = titleKey; // 제목 비교 열쇠 — src/lib/questionText.ts

const BY_TOPIC = new Map<string, PeerAnswer[]>();
for (const a of PEER_ANSWERS) {
  // norm 이 괄호를 떼므로 "다형성 (Polymorphism)" 과 "다형성" 이 같은 열쇠가 된다.
  // 둘 다 적어 둔 답안이 화면에 두 번 나오지 않도록 열쇠를 먼저 추린다.
  for (const k of new Set(a.topicTitles.map(norm))) {
    if (!BY_TOPIC.has(k)) BY_TOPIC.set(k, []);
    BY_TOPIC.get(k)!.push(a);
  }
}

/** 이 토픽에 걸린 남의 답안들. 없으면 빈 배열. */
export function peerAnswersFor(title?: string): PeerAnswer[] {
  if (!title) return [];
  return BY_TOPIC.get(norm(title)) ?? [];
}

const BY_QID = new Map<string, PeerAnswer[]>();
for (const a of PEER_ANSWERS) {
  for (const id of a.questionIds ?? []) {
    if (!BY_QID.has(id)) BY_QID.set(id, []);
    BY_QID.get(id)!.push(a);
  }
}

/**
 * 영문 약어가 문구 열쇠 안에 「낱말로」 있는 자리(없으면 -1).
 * 앞이 영문·숫자가 아니고, 뒤는 세대 숫자만 더 붙거나(HBM ↔ HBM4) 영문이 아니어야 한다 —
 * 「CI」는 「CISC」가 아니고, 「PIM」은 「APIM」「PIMS」가 아니며, 「SQL」은 「NoSQL」「Text2SQL」이 아니다
 * (2026-11-15 "CISC와 RISC 비교에 왜 CI 해설집이 붙었지? PIM에 왜 PNM이 붙었지?").
 */
function wordAt(short: string, key: string): number {
  let i = -1;
  while ((i = key.indexOf(short, i + 1)) >= 0) {
    const before = i === 0 ? "" : key[i - 1];
    const rest = key.slice(i + short.length).replace(/^\d+/, "");
    if (!/[a-z0-9]/.test(before) && !/^[a-z]/.test(rest)) return i;
  }
  return -1;
}
const isLatin = (s: string) => /^[a-z0-9]+$/.test(s);
/** 영문·숫자 낱말 — 괄호 속 원어 풀이는 뺀다 */
const latinWords = (s: string) => (s || "").toLowerCase().replace(/[(（][^)）]*[)）]/g, " ").match(/[a-z0-9]+/g) ?? [];
/** 약어가 문구에 낱말로 있는가 — 열쇠에서 경계가 살아 있거나(「Wi-Fi 7의 특징」), 원문에 따로 선 낱말이다(「RAG, RIG, MCP」「FTS, HA 비교」) */
function hasWord(short: string, key: string, raw: string): boolean {
  return wordAt(short, key) >= 0 || latinWords(raw).some((w) => w === short || (w.startsWith(short) && /^\d+$/.test(w.slice(short.length))));
}

/** 답안 제목이 짧을 때(6자 미만) — 긴 지문 가운데 낱말로 들어 있기만 한 것은 그 문제가 아니다. 문항이 짧거나(단답형) 머리에 있을 때만 */
function shortTitleHit(mine: string, q: string, raw: string): boolean {
  if (isLatin(mine) && !hasWord(mine, q, raw)) return false;
  return q.startsWith(mine) || (q.length <= 40 && q.includes(mine));
}

/**
 * 문제로 찾는다 — 문제은행·기출에서 같은 문제를 만났을 때.
 * 문항 id 로 직접 연결된 답안(questionIds)을 먼저, 그 다음 문구 부분 일치.
 */
export function peerAnswersForQuestion(question?: string, questionId?: string): PeerAnswer[] {
  const out: PeerAnswer[] = questionId ? [...(BY_QID.get(questionId) ?? [])] : [];
  if (!question) return out;
  const q = norm(question);
  for (const a of PEER_ANSWERS) {
    if (out.includes(a)) continue;
    const mine = norm(a.question);
    // 짧은 제목(「SDR」「로봇」)은 긴 지문 가운데 낱말로 들어도 그 문제가 아니다 — 문항 문구가 짧거나(단답형) 머리에 있을 때만
    // (2026-11-07 소프트웨어 정의 로봇 2교시 문항에 SDR 라디오·로봇 답안이 붙었다)
    // 짧은 제목(「SDR」「로봇」)은 긴 지문 가운데 낱말로 들어도 그 문제가 아니다(2026-11-07 소프트웨어 정의 로봇 2교시 문항에 SDR 라디오·로봇 답안이 붙었다).
    // 짧은 쪽이 영문 약어면 어느 방향이든 낱말 단위로만 맞춘다(wordAt)
    const ok = mine.length < 6 ? shortTitleHit(mine, q, question) : q.includes(mine);
    const rev = mine.includes(q) && (q.length >= 6 || !isLatin(q) || hasWord(q, mine, a.question));
    if (ok || rev) out.push(a);
  }
  return out;
}

export const PEER_ANSWER_COUNT = PEER_ANSWERS.length;
