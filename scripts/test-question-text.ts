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
  ["STO", "증권형 토큰(STO, Security Token Offering)"],
  // 2026-11-07 "이것도 일치하는 모범답안이 있는데" — 지문 없이 소문항만 이어 적은 정리 답안 제목
  ["기존 SW 개발, 로우코드 노코드 개발 방식 비교, 로우코드 노코드 도입시 고려 사항",
   "디지털전환을 촉진하기 위한 새로운 접근법으로 로우코드·노코드 기술에 관심이 높아지고 있다. 다음을 설명하시오.\n가. 기존 SW 개발과 로우코드·노코드 개발 방식 비교\n나. 로우코드·노코드 도입 시 고려사항"],
  // 2026-11-07 "해설지도 있네" — 소문항 머리 표기만 다른 같은 문제
  ["양자 컴퓨터(Quantum Computer)와 관련하여 다음을 설명하시오.\n(1) 양자비트(Qubit, 큐비트), 양자 우월성(Quantum Supermacy), 양자 결잃음(Quantum Decoherence)\n(2) 양자 컴퓨터 구현 방법",
   "양자 컴퓨터(Quantum Computer)와 관련하여 다음을 설명하시오.\n가. 양자비트(Qubit, 큐비트), 양자 우월성(Quantum Supermacy), 양자 결잃음(Quantum Decoherence)\n나. 양자 컴퓨터 구현 방법"],
  ["제로 트러스트(Zero Trust) 구현 핵심 원칙과 접근제어 원리", "제로 트러스트 구현 핵심원칙, 접근제어원리"],
  ["HNDL(Harvest Now Decrypt Later) 공격", "HNDL 공격"],
  ["관계대수(Relational Algebra)와 관계해석(Relational Calculus)", "관계대수와 관계해석"],
  ["DevOps와 플랫폼 엔지니어링", "DevOps 와 플랫폼 엔지니어링(Platform Engineering)"],
  ["벡터 데이터베이스", "Vector DB(벡터 데이터베이스)"],
  ["그로스해킹", "IT 그로스해킹(Growth Hacking)에 대해 설명하시오."],
  ["기술수용모델(Technology Acceptance Model: TAM)의개념과주요구성요소에대하여설명하시오.", "기술수용모델(TAM, Technology Acceptance Model)의 개념과 주요 구성요소에 대하여 설명하시오."],
  // 2026-11-14 NS 19기 9주차 — 소문항이 딸린 지문의 「에 대해 / 에 대하여 다음을 설명하시오」 꼬리말 차이
  [
    "가상 메모리 관리 기법에 대해 다음을 설명하시오.\n가. 가상 메모리 관리기법\n나. 페이징(Paging) 기법과 세그멘테이션(Segmentation) 기법\n다. 메모리 단편화",
    "가상 메모리 관리 기법에 대하여 다음을 설명하시오.\n가. 가상 메모리 관리기법\n나. 페이징(Paging) 기법과 세그멘테이션(Segmentation) 기법\n다. 메모리 단편화",
  ],
  ["6G 이동통신 기술에 대하여 설명하시오.\n가. 서비스 특징\n나. 성능 요구사항\n다. 주파수 동향", "6G 이동통신 기술에 대하여 다음을 설명하시오.\n가. 서비스 특징\n나. 성능 요구사항\n다. 주파수 동향"],
];
const DIFF: [string, string][] = [
  ["TCP와 UDP 비교", "TCP와 IP 비교"],
  ["DMA", "캐시메모리 사상기법 3가지에 대해서 설명하시오.\n1) 직접 사상기법(Direct mapping)\n2) 연관 사상기법(Associative mapping)\n3) 집합 연관 사상기법(Set Associative mapping)"],
  // 소문항 하나만 적은 제목은 전체 문제가 아니다
  ["로우코드·노코드 도입 시 고려사항", "디지털전환을 촉진하기 위한 새로운 접근법으로 로우코드·노코드 기술에 관심이 높아지고 있다. 다음을 설명하시오.\n가. 기존 SW 개발과 로우코드·노코드 개발 방식 비교\n나. 로우코드·노코드 도입 시 고려사항"],
  // 2026-11-07 "똑같은 문제 없는데" — 「STO」만 적힌 답안이 비교 문제에 같은 문제로 붙었다
  ["STO", "RWA(Real World Assets)와 STO(Security Token Offering) 비교"],
  ["증권형 토큰 (STO)", "RWA(Real World Assets)와 STO(Security Token Offering) 비교"],
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
