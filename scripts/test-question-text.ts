/**
 * 「같은 문제」 판정·회차 정렬 시험 — prebuild 에서 돈다. 사용자가 짚은 사례를 여기 더한다.
 *   npx tsx scripts/test-question-text.ts
 */
import { sameQuestionText, roundNum } from "../src/lib/questionText";

const SAME: [string, string][] = [
  // 2026-11-01 "같은 문제잖아"
  ["국가 망 보안체계(N2SF, National Network Security Framework)", "국가망 보안체계 N2SF"],
  ["국가망 보안체계 N2SF에 대하여 설명하시오.", "국가 망 보안체계(N2SF, National Network Security Framework)"],
  ["공격 표면 관리", "공격 표면 관리(Attack Surface Management)"],
  ["공격표면관리", "공격 표면 관리(Attack Surface Management)"],
  ["공격표면관라", "공격 표면 관리(Attack Surface Management)"],
  ["ASM", "공격 표면 관리(Attack Surface Management)"],
  ["공격표면관리(ASM)", "공격 표면 관리(Attack Surface Management)"],
  ["블록 암호 운영모드", "블록 암호 운영모드(ECB, CBC, CFB, OFB, CTR)"],
  ["데이터 3법", "데이터 3법에 대해 설명하시오"],
];
const DIFF: [string, string][] = [
  ["TCP와 UDP 비교", "TCP와 IP 비교"],
  ["OWASP Top 10:2021", "OWASP Top 10:2025"],
  ["가상 메모리", "가상 메모리 관리 기법"],
  ["정보시스템 감리", "정보시스템 관리"],
  ["ISM", "공격 표면 관리(Attack Surface Management)"],
  ["데이터 마이닝", "텍스트 마이닝"],
  ["SPN", "블록 암호화(Block Cipher)"],
];
// 앞이 더 최신이어야 한다
const NEWER: [string, string][] = [
  ["ITPE 모의고사 2026.10", "ITPE 모의고사 2026.07"],
  ["ITPE 모의고사 2026.01", "44회"],
  ["44회", "ITPE 모의고사 2025.12"],
  ["KPC 70회 (2016.06)", "KPC 2016.05"],
  ["19기 07주차", "19기 06주차"],
  ["140회", "139회"],
];

let bad = 0;
for (const [a, b] of SAME) if (!sameQuestionText(a, b)) (bad++, console.error("✗ 같아야 함:", a, "↔", b));
for (const [a, b] of DIFF) if (sameQuestionText(a, b)) (bad++, console.error("✗ 달라야 함:", a, "↔", b));
for (const [a, b] of NEWER) if (!(roundNum(a) > roundNum(b))) (bad++, console.error("✗ 앞이 최신이어야 함:", a, ">", b));
console.log(`questionText: ${SAME.length + DIFF.length + NEWER.length}건 중 실패 ${bad}`);
if (bad) process.exit(1);
