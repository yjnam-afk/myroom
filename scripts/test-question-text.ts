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
  ["evm", "EVM (Earned Value Management) 에 대해 설명하시오."],
  ["EVM", "EVM(Earned Valued Management)"],
  ["EVM", "Earned Value Management"],
  ["제로 트러스트(Zero Trust) 구현 핵심 원칙과 접근제어 원리", "제로 트러스트 구현 핵심원칙, 접근제어원리"],
  ["HNDL(Harvest Now Decrypt Later) 공격", "HNDL 공격"],
  ["관계대수(Relational Algebra)와 관계해석(Relational Calculus)", "관계대수와 관계해석"],
  ["DevOps와 플랫폼 엔지니어링", "DevOps 와 플랫폼 엔지니어링(Platform Engineering)"],
  ["벡터 데이터베이스", "Vector DB(벡터 데이터베이스)"],
  ["그로스해킹", "IT 그로스해킹(Growth Hacking)에 대해 설명하시오."],
  ["기술수용모델(Technology Acceptance Model: TAM)의개념과주요구성요소에대하여설명하시오.", "기술수용모델(TAM, Technology Acceptance Model)의 개념과 주요 구성요소에 대하여 설명하시오."],
];
const DIFF: [string, string][] = [
  ["TCP와 UDP 비교", "TCP와 IP 비교"],
  ["OWASP Top 10:2021", "OWASP Top 10:2025"],
  ["가상 메모리", "가상 메모리 관리 기법"],
  ["정보시스템 감리", "정보시스템 관리"],
  ["ISM", "공격 표면 관리(Attack Surface Management)"],
  ["데이터 마이닝", "텍스트 마이닝"],
  ["SPN", "블록 암호화(Block Cipher)"],
  ["EVM", "Agile EVM"],
  ["HNDL 공격", "HNDL 공격 대응 방안"],
  ["모바일 신분증", "모바일신분증과 KYC(Know Your Customer)"],
  ["회복기법", "Deadlock 회복기법에 대해 설명하시오."],
  ["쿠버네티스", "쿠버네티스의 Helm"],
  ["범위관리 프로세스", "범위관리 프로세스와 WBS 를 설명하시오."],
  ["지능형 로봇에 대해 설명하시오", "지능형로봇과 URC"],
  ["EVM", "CPM EVM"],
  ["DNS", "DAS/NAS/SAN 에 대하여 설명하시오."],
  ["EVM", "EVM의 주요지표인 PV, EV, AC를 설명하시오"],
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
