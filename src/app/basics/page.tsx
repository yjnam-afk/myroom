"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";

/**
 * 용어 사전 — 서브노트·학습 카드를 읽다가 모르는 말이 나오면 여기서 찾는다.
 *
 * 에세이가 아니라 도구다. 검색 한 번 → 한 줄 정의 → 다시 공부로 복귀.
 * 정의는 전문용어를 전문용어로 설명하지 않는 것을 원칙으로 한다.
 */

type Term = {
  ko: string;
  en?: string;
  cat: "컴퓨터 기본" | "프로세스·동기화" | "메모리·캐시" | "하드웨어" | "저장·안정성" | "개발·PM·테스트";
  def: string;
  /** 이 용어가 등장하는 대표 토픽(설명 페이지로 링크) */
  see?: string;
};

const TERMS: Term[] = [
  // ── 컴퓨터 기본 ──────────────────────────────────────────────
  { ko: "CPU", en: "Central Processing Unit", cat: "컴퓨터 기본", def: "계산을 실제로 하는 유일한 부품. 1초에 수십억 번 일하는 일꾼. '코어'는 CPU 안의 일꾼 한 명.", see: "CPU 처리과정" },
  { ko: "메모리(RAM)", en: "Memory", cat: "컴퓨터 기본", def: "지금 실행 중인 것들을 올려 두는 작업대. 빠르지만 좁고, 전원을 끄면 내용이 사라진다.", see: "기억장치 계층 구조(Memory Hierarchy)" },
  { ko: "디스크", en: "SSD/HDD", cat: "컴퓨터 기본", def: "파일을 보관하는 창고. 크고 전원을 꺼도 남지만 메모리보다 수천 배 느리다." },
  { ko: "비트/바이트", en: "bit/byte", cat: "컴퓨터 기본", def: "비트는 0 아니면 1 한 칸. 8비트를 묶은 게 1바이트로, 글자 하나를 담는 최소 단위쯤 된다." },
  { ko: "주소", en: "Address", cat: "컴퓨터 기본", def: "메모리 서랍마다 붙은 번호. CPU는 항상 '몇 번지 내용 줘'라고 번호로 요구한다.", see: "직접 사상과 연관 사상 페이징 기법" },
  { ko: "명령어", en: "Instruction", cat: "컴퓨터 기본", def: "CPU가 알아듣는 한 줄짜리 지시. 프로그램은 결국 명령어 수백만 줄의 목록이다.", see: "CPU 처리과정" },
  { ko: "운영체제(OS)", en: "Operating System", cat: "컴퓨터 기본", def: "부족한 자원(CPU·메모리)을 여러 프로그램에 나눠 주는 관리인 소프트웨어. 윈도우·리눅스·안드로이드.", see: "커널(Kernel)" },
  { ko: "커널", en: "Kernel", cat: "컴퓨터 기본", def: "OS의 알맹이. 하드웨어를 직접 만질 수 있는 유일한 코드이며, 앱들은 커널에게 부탁만 할 수 있다.", see: "커널(Kernel)" },
  { ko: "시스템 호출", en: "System Call", cat: "컴퓨터 기본", def: "앱이 커널에게 일을 부탁하는 공식 창구. '파일 저장해줘', '메모리 더 줘' 전부 이 창구로 간다.", see: "커널(Kernel)" },
  { ko: "사용자/커널 모드", en: "User/Kernel Mode", cat: "컴퓨터 기본", def: "앱이 사는 바깥 구역과 커널만 들어가는 안쪽 구역. CPU가 하드웨어 등급(Ring)으로 강제한다.", see: "CPU Ring Level" },
  { ko: "오버헤드", en: "Overhead", cat: "컴퓨터 기본", def: "본 작업이 아닌 관리 작업에 드는 비용. 문맥교환처럼 '일을 위한 일'에 쓰는 시간." },
  { ko: "처리량/응답시간", en: "Throughput/Response", cat: "컴퓨터 기본", def: "처리량은 단위 시간에 끝낸 일의 양, 응답시간은 요청 하나가 끝날 때까지 걸린 시간. 보통 서로 당긴다." },
  { ko: "동기/비동기", en: "Sync/Async", cat: "컴퓨터 기본", def: "동기는 끝날 때까지 기다렸다 다음으로, 비동기는 시켜 놓고 내 일 하다가 완료 통보를 받는 방식." },
  { ko: "폴링", en: "Polling", cat: "컴퓨터 기본", def: "'무슨 일 없나?' 하고 계속 물어보며 확인하는 방식. 인터럽트(초인종)의 반대말.", see: "인터럽트(Interrupt)" },
  { ko: "버퍼", en: "Buffer", cat: "컴퓨터 기본", def: "속도가 다른 둘 사이에 두는 임시 저장 공간. 유튜브 '버퍼링'이 바로 이 버퍼 채우기다." },
  { ko: "큐", en: "Queue", cat: "컴퓨터 기본", def: "먼저 온 것이 먼저 나가는 줄. 준비 큐, 대기 큐, 메시지 큐 — OS는 온통 줄 세우기다." },
  { ko: "스택/힙", en: "Stack/Heap", cat: "컴퓨터 기본", def: "프로세스 메모리의 두 구역. 스택은 함수 호출 때 자동으로 쌓였다 사라지는 곳, 힙은 필요할 때 빌려 쓰는 자유 공간." },

  // ── 프로세스·동기화 ──────────────────────────────────────────
  { ko: "프로세스", en: "Process", cat: "프로세스·동기화", def: "실행 중인 프로그램. 파일(레시피)이 실행되어 살아 움직이는 상태(요리 중). 자기만의 메모리 공간을 가진다.", see: "프로세스(Process)와 스레드(Thread) 비교" },
  { ko: "스레드", en: "Thread", cat: "프로세스·동기화", def: "프로세스 안의 실행 흐름 하나. 같은 프로세스의 스레드끼리는 메모리를 공유하는 직원들이다.", see: "멀티 쓰레드(Multi-Thread)" },
  { ko: "스케줄링", en: "Scheduling", cat: "프로세스·동기화", def: "CPU를 다음에 누구에게 줄지 정하는 일. 그 규칙이 FCFS·RR 같은 스케줄링 알고리즘.", see: "CPU 스케줄링(CPU Scheduling)" },
  { ko: "문맥교환", en: "Context Switching", cat: "프로세스·동기화", def: "CPU가 하던 프로세스를 내려놓고 다른 프로세스로 갈아타는 것. 진행 상황을 PCB에 적고 읽는 순수 비용.", see: "문맥교환(Context Switching)" },
  { ko: "PCB", en: "Process Control Block", cat: "프로세스·동기화", def: "프로세스 한 개당 하나씩 있는 신상 카드. 상태·진행 위치·레지스터 값을 담는다.", see: "PCB(Process Control Block)" },
  { ko: "인터럽트", en: "Interrupt", cat: "프로세스·동기화", def: "장치가 CPU를 부르는 초인종. 하던 일을 잠깐 멈추고 급한 일부터 처리하게 만든다.", see: "인터럽트(Interrupt)" },
  { ko: "임계영역", en: "Critical Section", cat: "프로세스·동기화", def: "공유 데이터를 만지는 코드 구간. 한 번에 하나만 들어가야 사고가 안 난다.", see: "경쟁조건(Race Condition) 해결 방안" },
  { ko: "상호배제", en: "Mutual Exclusion", cat: "프로세스·동기화", def: "'한 번에 한 명만' 규칙. 임계영역 문제 해결의 제1 조건.", see: "경쟁조건(Race Condition) 해결 방안" },
  { ko: "세마포어", en: "Semaphore", cat: "프로세스·동기화", def: "공용 자원의 열쇠 개수를 숫자로 관리하는 장치. 들어갈 때 P(−1), 나올 때 V(+1).", see: "세마포어(Semaphore)" },
  { ko: "뮤텍스", en: "Mutex", cat: "프로세스·동기화", def: "열쇠가 1개뿐인 잠금장치. 이진 세마포어와 같은 역할 — 한 번에 한 명만.", see: "세마포어(Semaphore)" },
  { ko: "원자적 연산", en: "Atomic Operation", cat: "프로세스·동기화", def: "중간에 끼어들 수 없게 통째로 실행되는 연산. 잠금장치를 만드는 재료(Test&Set 등).", see: "경쟁조건(Race Condition) 해결 방안" },
  { ko: "교착상태", en: "Deadlock", cat: "프로세스·동기화", def: "서로 상대가 쥔 자원을 기다리며 전원이 영원히 멈춘 상태.", see: "교착상태(Deadlock)" },
  { ko: "기아", en: "Starvation", cat: "프로세스·동기화", def: "우선순위에 계속 밀려 내 차례가 영영 안 오는 것. 교착(모두 멈춤)과 달리 나만 못 간다.", see: "기아(Starvation)" },
  { ko: "IPC", en: "Inter-Process Communication", cat: "프로세스·동기화", def: "떨어져 있는 프로세스끼리 데이터를 주고받는 통로. 공유 메모리 또는 메시지 전달(파이프·소켓 등).", see: "프로세스간 통신(IPC)" },
  { ko: "타임스탬프", en: "Timestamp", cat: "프로세스·동기화", def: "사건이 일어난 시각 도장. '누가 먼저였나'를 판정하는 근거로 쓴다.", see: "Wait-Die와 Wound-Wait" },

  // ── 메모리·캐시 ─────────────────────────────────────────────
  { ko: "가상 주소/물리 주소", en: "Virtual/Physical Address", cat: "메모리·캐시", def: "프로세스가 쓰는 가짜 번호표와 실제 메모리 서랍 번호. OS+MMU가 몰래 바꿔치기해 준다.", see: "가상메모리 관리기법" },
  { ko: "페이지/프레임", en: "Page/Frame", cat: "메모리·캐시", def: "가상 메모리를 자른 조각(페이지)과 그것이 들어가는 물리 메모리 칸(프레임). 보통 4KB.", see: "가상메모리의 페이징과 세그멘테이션" },
  { ko: "페이지 폴트", en: "Page Fault", cat: "메모리·캐시", def: "찾는 페이지가 메모리에 없는 사건. OS가 디스크에서 가져와 채우고 아무 일 없던 듯 계속한다.", see: "가상메모리 관리기법" },
  { ko: "페이지 테이블", en: "Page Table", cat: "메모리·캐시", def: "'가상 페이지 몇 번 → 실제 프레임 몇 번' 대응표. 프로세스마다 하나씩.", see: "직접 사상과 연관 사상 페이징 기법" },
  { ko: "MMU", en: "Memory Management Unit", cat: "메모리·캐시", def: "가상→물리 주소 변환을 실제로 수행하는 하드웨어 통역사.", see: "MMU(Memory Management Unit)" },
  { ko: "TLB", en: "Translation Lookaside Buffer", cat: "메모리·캐시", def: "자주 쓰는 주소 변환을 외워 둔 암기장. 여기서 걸리면 페이지 테이블에 안 가도 된다.", see: "직접 사상과 연관 사상 페이징 기법" },
  { ko: "스와핑", en: "Swapping", cat: "메모리·캐시", def: "메모리가 부족할 때 프로세스(또는 페이지)를 통째로 디스크에 내보냈다가 다시 들여오는 것.", see: "스레싱(Thrashing)" },
  { ko: "단편화", en: "Fragmentation", cat: "메모리·캐시", def: "빈 공간은 있는데 쪼개져 있거나 칸 안에 갇혀서 못 쓰는 낭비. 내부(칸 안)·외부(칸 사이).", see: "단편화(Fragmentation)" },
  { ko: "캐시", en: "Cache", cat: "메모리·캐시", def: "자주 쓰는 것만 올려 두는 작고 빠른 임시 저장소. CPU 캐시, 브라우저 캐시, CDN 전부 같은 발상.", see: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)" },
  { ko: "적중/미스", en: "Hit/Miss", cat: "메모리·캐시", def: "찾는 것이 캐시에 있으면 적중(빠름), 없으면 미스(아래 계층까지 내려가야 해서 느림)." },
  { ko: "지역성", en: "Locality", cat: "메모리·캐시", def: "방금 쓴 것을 또 쓰고(시간), 그 옆을 이어 쓰는(공간) 성질. 캐시가 통하는 유일한 이유.", see: "지역성(Locality)" },
  { ko: "더티 비트", en: "Dirty Bit", cat: "메모리·캐시", def: "'캐시에서 고쳤는데 아직 메모리에 안 옮김' 표시. 내리기 전에 반영해야 한다는 신호.", see: "캐시메모리의 쓰기정책(Write Policy)" },
  { ko: "레지스터", en: "Register", cat: "메모리·캐시", def: "CPU 안의 손바닥만 한 초고속 저장 칸. PC(다음 줄 번호), IR(지금 할 일) 등 역할별로 있다.", see: "CPU 처리과정" },

  // ── 하드웨어 ────────────────────────────────────────────────
  { ko: "클럭", en: "Clock", cat: "하드웨어", def: "CPU의 박자. 3GHz = 1초에 30억 박자. 모든 부품이 이 박자에 맞춰 움직인다." },
  { ko: "버스", en: "Bus", cat: "하드웨어", def: "부품들 사이에 데이터가 오가는 공용 통로. 하나뿐이라 누가 쓸지 다투는 게 문제의 시작.", see: "DMA(Direct Memory Access)" },
  { ko: "파이프라인", en: "Pipeline", cat: "하드웨어", def: "일을 단계로 쪼개 겹쳐 돌리는 것. 세탁기 돌리는 동안 건조기도 돌리기.", see: "Pipeline(파이프라인)" },
  { ko: "DMA", en: "Direct Memory Access", cat: "하드웨어", def: "CPU 대신 데이터를 옮겨 주는 전담 기사. 다 옮기면 인터럽트로 알린다.", see: "DMA(Direct Memory Access)" },
  { ko: "펌웨어", en: "Firmware", cat: "하드웨어", def: "장치 안에 새겨진 전용 소프트웨어. 공유기·키보드·SSD 안에도 작은 프로그램이 산다." },
  { ko: "MCU", en: "Micro Controller Unit", cat: "하드웨어", def: "CPU+메모리+입출력을 칩 하나에 담은 작은 컴퓨터. 가전·자동차 부품 속의 두뇌.", see: "워치독 타이머(WDT)" },
  { ko: "RTOS", en: "Real-Time OS", cat: "하드웨어", def: "'제시간 보장'이 최우선인 OS. 자동차·의료기기처럼 늦으면 사고 나는 곳에 쓴다.", see: "기한부(Deadline) 스케줄링" },
  { ko: "ASIC", en: "주문형 반도체", cat: "하드웨어", def: "한 가지 일만 하도록 주문 제작한 칩. 범용(CPU·GPU)보다 그 일에선 싸고 빠르다.", see: "TPU(Tensor Processing Unit)" },

  // ── 저장·안정성 ─────────────────────────────────────────────
  { ko: "패리티", en: "Parity", cat: "저장·안정성", def: "원본이 깨졌을 때 계산으로 복원할 수 있게 만들어 둔 여분 정보(XOR 요약).", see: "RAID" },
  { ko: "미러링/스트라이핑", en: "Mirroring/Striping", cat: "저장·안정성", def: "미러링은 똑같이 두 벌 쓰기(안전), 스트라이핑은 나눠 쓰기(빠름). RAID의 두 재료.", see: "RAID" },
  { ko: "이중화", en: "Redundancy", cat: "저장·안정성", def: "하나가 죽어도 되도록 같은 것을 둘 이상 두는 것. 서버·전원·회선 어디든 적용.", see: "HA(High Availability)" },
  { ko: "Failover", en: "장애 절체", cat: "저장·안정성", def: "주 장비가 죽었을 때 대기 장비가 자동으로 넘겨받는 것.", see: "HA(High Availability)" },
  { ko: "Heartbeat", en: "심박 신호", cat: "저장·안정성", def: "서로 살아 있는지 확인하는 주기적 신호. 끊기면 죽은 것으로 보고 절체한다.", see: "HA(High Availability)" },
  { ko: "inode", en: "index node", cat: "저장·안정성", def: "유닉스에서 파일 한 개마다 붙는 정보 카드. 속성과 저장 위치를 담고, 이름은 안 담는다.", see: "유닉스의 inode" },
  { ko: "트랜잭션", en: "Transaction", cat: "저장·안정성", def: "전부 되거나 전부 안 되거나 해야 하는 작업 묶음. 이체 = 출금+입금이 한 몸." },
  { ko: "롤백", en: "Rollback", cat: "저장·안정성", def: "하다 만 작업을 시작 전 상태로 되돌리는 것." },

  // ── 개발·PM·테스트 ──────────────────────────────────────────
  { ko: "요구사항", en: "Requirement", cat: "개발·PM·테스트", def: "시스템이 해야 할 일의 목록. 기능(무엇을 한다)과 비기능(얼마나 잘한다)으로 나뉜다.", see: "요구사항 수집기법" },
  { ko: "명세(서)", en: "Specification", cat: "개발·PM·테스트", def: "말로 하던 요구를 검증 가능한 문서로 못 박은 것. SRS가 대표.", see: "요구사항 명세서 SRS" },
  { ko: "아키텍처", en: "Architecture", cat: "개발·PM·테스트", def: "시스템의 뼈대 설계 — 큰 덩어리들을 무엇으로 나누고 어떻게 잇는지의 결정.", see: "SW Architecture 구축 절차" },
  { ko: "모듈/컴포넌트", en: "Module/Component", cat: "개발·PM·테스트", def: "갈아 끼울 수 있게 만든 부품 단위의 코드 덩어리." },
  { ko: "인터페이스", en: "Interface", cat: "개발·PM·테스트", def: "부품끼리 맞닿는 약속된 접점. 속은 몰라도 접점만 맞으면 붙는다." },
  { ko: "추상화", en: "Abstraction", cat: "개발·PM·테스트", def: "지금 목적에 필요한 것만 남기고 세부를 감추는 것. 지하철 노선도가 좋은 예.", see: "소프트웨어 설계의 원리" },
  { ko: "인스턴스", en: "Instance", cat: "개발·PM·테스트", def: "틀(클래스·이미지)로 찍어낸 실물 하나. 붕어빵 틀과 붕어빵의 관계." },
  { ko: "리팩토링", en: "Refactoring", cat: "개발·PM·테스트", def: "기능은 그대로 두고 코드 구조만 깨끗하게 고치는 것.", see: "소프트웨어 리팩토링" },
  { ko: "빌드/배포/릴리즈", en: "Build/Deploy/Release", cat: "개발·PM·테스트", def: "코드를 실행물로 만들기(빌드) → 서버에 올리기(배포) → 사용자에게 공개(릴리즈).", see: "릴리즈 엔지니어링" },
  { ko: "형상관리", en: "Configuration Mgmt", cat: "개발·PM·테스트", def: "'지금 공식 버전이 무엇인가'를 잃지 않게 변경을 통제·기록하는 활동. Git이 도구.", see: "형상 관리" },
  { ko: "기준선", en: "Baseline", cat: "개발·PM·테스트", def: "공식 합의로 못 박은 버전. 이후의 모든 변경은 기준선 대비로 관리한다.", see: "형상 관리" },
  { ko: "이해관계자", en: "Stakeholder", cat: "개발·PM·테스트", def: "프로젝트에 이해가 걸린 모든 사람 — 고객, 사용자, 경영진, 팀." },
  { ko: "산출물", en: "Deliverable", cat: "개발·PM·테스트", def: "단계가 끝나며 내놓는 공식 결과물(문서·코드). 감리가 검사하는 대상." },
  { ko: "WBS", en: "Work Breakdown Structure", cat: "개발·PM·테스트", def: "전체 일을 관리 가능한 작은 작업으로 계층 분해한 표.", see: "WBS (Work Breakdown Structure)" },
  { ko: "테스트 케이스", en: "Test Case", cat: "개발·PM·테스트", def: "'이 입력을 넣으면 이 결과가 나와야 한다'를 적어 둔 검사 항목 하나." },
  { ko: "결함/오류/장애", en: "Defect/Error/Failure", cat: "개발·PM·테스트", def: "사람의 실수(오류)가 코드에 결함을 심고, 결함이 실행되면 장애로 나타난다.", see: "테스트 원리" },
  { ko: "커버리지", en: "Coverage", cat: "개발·PM·테스트", def: "테스트가 코드(또는 요구사항)를 몇 %나 훑었는지의 지표.", see: "코드 커버리지(Code Coverage)" },
  { ko: "프로토타입", en: "Prototype", cat: "개발·PM·테스트", def: "요구를 빨리 확인하려고 핵심만 만든 시제품." },
];

const CATS = ["전체", "컴퓨터 기본", "프로세스·동기화", "메모리·캐시", "하드웨어", "저장·안정성", "개발·PM·테스트"] as const;

/** 바닥판 10줄 — 에세이 대신 한 줄씩만. */
const FLOOR = [
  "모든 토픽은 '계산' 아니면 '기억' 이야기다.",
  "실행 = 창고(디스크) → 작업대(메모리) → 일꾼(CPU). 이 속도 격차가 모든 설계의 이유.",
  "프로그램은 파일(죽음), 프로세스는 실행 중(살아 있음, 상태·살림 보유).",
  "OS = 부족한 자원을 나눠 주는 관리인: 순서 정하기·자리 배정·싸움 말리기.",
  "주소 = 메모리 서랍 번호. 프로세스는 가짜 주소를 쓰고 OS+MMU가 진짜로 바꿔 준다.",
  "빠름·큼·쌈은 동시에 안 된다 → 계단(계층)을 쌓는다 → 지역성 덕에 통한다.",
  "'동시에'는 착시(빠른 번갈아). 진짜 동시(멀티코어)가 되는 순간 경쟁조건·교착 청구서가 온다.",
  "앱은 사용자 모드, 커널은 커널 모드(Ring 0). 위험한 일은 전부 시스템 호출로 부탁.",
  "인터럽트 = 장치가 CPU를 부르는 초인종. 컴퓨터의 모든 '반응'의 원리.",
  "CA는 몸(하드웨어), OS는 관리인(소프트웨어). 하드웨어가 제공, OS가 활용.",
];

export default function BasicsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("전체");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TERMS.filter(
      (t) =>
        (cat === "전체" || t.cat === cat) &&
        (!needle ||
          t.ko.toLowerCase().includes(needle) ||
          (t.en || "").toLowerCase().includes(needle) ||
          t.def.toLowerCase().includes(needle)),
    );
  }, [q, cat]);

  return (
    <div>
      <PageHeader
        title="🧱 용어 사전"
        desc="서브노트를 읽다 모르는 말이 나오면 여기서 찾고 바로 복귀하세요. 정의는 전문용어 없이 씁니다."
      />

      {/* 검색 — 이 페이지의 존재 이유 */}
      <div className="sticky top-14 z-[5] -mx-1 mb-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 모르는 용어를 검색 — 예: 페이지 폴트, 세마포어, 오버헤드"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[15px] outline-none focus:border-brand-400"
          autoFocus
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                cat === c
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-slate-400">
            {list.length}개
          </span>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          &lsquo;{q}&rsquo; 는 아직 사전에 없어요. 어떤 문장에서 만났는지 알려주시면 추가합니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {list.map((t) => (
            <div
              key={t.ko}
              className="rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <b className="text-[15px] text-slate-900">{t.ko}</b>
                {t.en && <span className="text-xs text-slate-400">{t.en}</span>}
                <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {t.cat}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-slate-700">
                {t.def}
              </p>
              {t.see && (
                <Link
                  href={`/explain?topic=${encodeURIComponent(t.see)}`}
                  className="mt-1.5 inline-block text-xs font-medium text-brand-600 hover:underline"
                >
                  📖 관련 토픽: {t.see} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 바닥판 10줄 — 에세이 대신 압축본 */}
      <details className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer text-sm font-bold text-slate-800">
          🧭 바닥판 10줄 — 전체 그림이 궁금할 때만 펼치세요
        </summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-slate-700">
          {FLOOR.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
