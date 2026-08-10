"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { SUBNOTES } from "@/data/textbookSubnotes";

/**
 * 용어 사전 — 두 켜로 구성한다.
 *
 * ① 교재 정의(기본): 교재 서브노트의 정의문 '원문 그대로'. 1교시 답안 서론에
 *    그대로 쓰는 그 문장이다. 검색 → 정의 확인 → 설명/두음신공으로 이동.
 * ② 왕초보 용어: 정의문에 나오는 전문용어를 비유로 풀어 주는 보조 사전.
 */

type Term = {
  ko: string;
  en?: string;
  cat:
    | "컴퓨터 기본"
    | "프로세스·동기화"
    | "메모리·캐시"
    | "하드웨어"
    | "저장·안정성"
    | "개발·PM·테스트"
    | "프로젝트 관리"
    | "SW공학·테스트"
    | "인공지능"
    | "확률·통계"
    | "자료구조·알고리즘"
    | "네트워크"
    | "데이터베이스"
    | "경영전략";
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

  // ── 프로젝트 관리 (2주차 PM) ─────────────────────────────────
  { ko: "범위", en: "Scope", cat: "프로젝트 관리", def: "이번 프로젝트에서 '어디까지 만들 것인가'의 경계선. 경계가 흐리면 일이 끝없이 늘어난다.", see: "범위관리" },
  { ko: "스코프 크리프", en: "Scope Creep", cat: "프로젝트 관리", def: "고객 요청이 슬금슬금 늘어 범위가 몰래 커지는 것. 반대로 시키지도 않은 걸 개발자가 더 해 주는 건 골드 플레이팅.", see: "Scope Creep vs Gold-Plating" },
  { ko: "3점 산정", en: "Three-Point Estimate", cat: "프로젝트 관리", def: "낙관·최빈·비관 세 값을 섞어 기간을 추정하는 법. 한 사람의 감보다 훨씬 안 틀린다.", see: "3점 산정" },
  { ko: "주공정법", en: "CPM, Critical Path", cat: "프로젝트 관리", def: "가장 오래 걸리는 작업 사슬. 여기가 하루 밀리면 프로젝트 전체가 하루 밀린다.", see: "CPM (Critical Path Management)" },
  { ko: "여유시간", en: "Float/Slack", cat: "프로젝트 관리", def: "전체 일정에 영향 없이 이 작업이 늦어도 되는 여유. 주공정 위의 작업은 여유가 0이다.", see: "CPM (Critical Path Management)" },
  { ko: "공정압축법", en: "Crashing", cat: "프로젝트 관리", def: "돈(인력)을 더 넣어 기간을 줄이는 것. 반대로 순서를 겹쳐 당기는 건 패스트트래킹 — 대신 재작업 위험이 커진다.", see: "일정단축 기법" },
  { ko: "획득가치", en: "EVM, Earned Value", cat: "프로젝트 관리", def: "'계획 대비 실제로 얼마나 벌어 놨나'를 돈으로 환산해 일정·원가를 동시에 보는 지표.", see: "EVM(Earned Value Management, 획득 가치 관리)" },
  { ko: "SPI / CPI", en: "Schedule/Cost Perf. Index", cat: "프로젝트 관리", def: "1보다 크면 좋은 상태. SPI는 일정, CPI는 원가 효율 — 1 미만이면 늦거나 돈이 새고 있다.", see: "EVM(Earned Value Management, 획득 가치 관리)" },
  { ko: "예비비", en: "Reserve", cat: "프로젝트 관리", def: "알려진 위험에 대비한 우발사태 예비비와, 모르는 위험을 위한 관리 예비비. 후자는 경영진 승인 대상.", see: "위험 대응" },
  { ko: "정성적/정량적 위험분석", en: "Qualitative/Quantitative", cat: "프로젝트 관리", def: "정성은 확률×영향으로 등급 매겨 줄 세우기, 정량은 숫자로 계산(EMV·몬테카를로)하기.", see: "몬테카를로 시뮬레이션" },
  { ko: "P-I 매트릭스", en: "Probability-Impact", cat: "프로젝트 관리", def: "위험을 '일어날 확률'과 '터졌을 때 충격' 두 축으로 놓고 빨강·노랑·초록으로 등급 매기는 표.", see: "정성적 위험 분석" },
  { ko: "EMV", en: "Expected Monetary Value", cat: "프로젝트 관리", def: "확률 × 금액으로 계산한 기대값. 두 대안 중 어느 쪽이 이득인지 숫자로 비교할 때 쓴다.", see: "위험 대응" },
  { ko: "몬테카를로", en: "Monte Carlo", cat: "프로젝트 관리", def: "작업 기간을 확률로 보고 주사위 굴리듯 수천 번 돌려 '80% 확률로 며칠'을 얻는 모의실험.", see: "몬테카를로 시뮬레이션" },
  { ko: "RACI", en: "RACI Chart", cat: "프로젝트 관리", def: "누가 실행(R)·최종책임(A)·자문(C)·정보공유(I)인지 적은 역할 표. A는 항상 한 명이어야 한다.", see: "자원 최적화" },
  { ko: "갈등관리 5기법", en: "Conflict Resolution", cat: "프로젝트 관리", def: "철회·완화·타협·강요·협력. 가장 좋은 건 협력(win-win), 최악은 철회(회피).", see: "갈등관리" },
  { ko: "터크만 모델", en: "Tuckman Ladder", cat: "프로젝트 관리", def: "팀이 거치는 단계 — 형성기·혼돈기·규범기·성취기·해산기. 싸우는 시기(혼돈기)는 정상이다.", see: "터크만 팀 개발 5단계" },
  { ko: "PMO", en: "Project Mgmt Office", cat: "프로젝트 관리", def: "발주자 편에서 프로젝트 전 과정을 관리해 주는 조직. 제3자로 품질을 '평가'하는 감리와 역할이 다르다.", see: "감리/PMO 비교표" },
  { ko: "애자일", en: "Agile", cat: "프로젝트 관리", def: "계획대로 밀기보다 짧게 만들고 자주 고치는 방식. 선언문의 핵심은 '왼쪽도 가치 있지만 오른쪽을 더'.", see: "Agile 선언문과 12개 원칙" },
  { ko: "스프린트", en: "Sprint", cat: "프로젝트 관리", def: "스크럼의 2~4주짜리 개발 주기. 이 안에 '작동하는 결과물'을 반드시 낸다.", see: "스크럼(Scrum)" },
  { ko: "백로그", en: "Backlog", cat: "프로젝트 관리", def: "만들 것들의 우선순위 목록. 전체가 제품 백로그, 이번 주기에 할 것만 뽑은 게 스프린트 백로그.", see: "스크럼(Scrum)" },
  { ko: "번다운 차트", en: "Burndown Chart", cat: "프로젝트 관리", def: "남은 일이 0으로 줄어드는 그래프. 계획선 위에 있으면 늦은 것이고, 기울기가 팀의 속도(Velocity)다.", see: "번다운 차트" },
  { ko: "벨로시티", en: "Velocity", cat: "프로젝트 관리", def: "한 스프린트에 팀이 처리하는 작업량. 다음 주기에 얼마나 담을지 정하는 근거.", see: "번다운 차트" },
  { ko: "XP", en: "eXtreme Programming", cat: "프로젝트 관리", def: "짝 프로그래밍·테스트 주도 개발·지속적 통합처럼 개발 실천법을 극단까지 밀어붙인 애자일 방법론.", see: "XP(eXtreme Programming)" },
  { ko: "린", en: "Lean", cat: "프로젝트 관리", def: "도요타 생산방식에서 온 '낭비 제거' 사고. 미완성 작업·안 쓰는 기능·대기 같은 낭비를 걷어낸다.", see: "린 (Lean) 방법론" },

  // ── SW공학·테스트 (2주차 SE) ────────────────────────────────
  { ko: "요구공학", en: "Requirements Engineering", cat: "SW공학·테스트", def: "'뭘 만들지'를 캐내고(도출) 정리하고(분석·명세) 맞는지 확인하는(확인) 활동. 여기서 틀리면 뒤가 다 틀어진다.", see: "요구공학 (Requirements Engineering)" },
  { ko: "기능/비기능 요구사항", en: "Functional/Non-func.", cat: "SW공학·테스트", def: "'무엇을 한다'가 기능, '얼마나 빠르고 안전한가'가 비기능(성능·보안·가용성).", see: "요구사항 명세서 SRS" },
  { ko: "추적성", en: "Traceability", cat: "SW공학·테스트", def: "요구사항 하나가 설계·코드·테스트 어디까지 연결됐는지 따라갈 수 있는 성질. 변경 영향 분석의 기본.", see: "요구공학 (Requirements Engineering)" },
  { ko: "응집도/결합도", en: "Cohesion/Coupling", cat: "SW공학·테스트", def: "한 모듈이 한 가지 일에 집중하면 응집도가 높고(좋음), 모듈끼리 덜 얽히면 결합도가 낮다(좋음).", see: "소프트웨어 설계의 원리" },
  { ko: "디자인 패턴", en: "Design Pattern", cat: "SW공학·테스트", def: "자주 나오는 설계 문제의 검증된 해법 모음. 생성·구조·행위 세 갈래로 나뉜다.", see: "디자인 패턴 (Design Pattern)" },
  { ko: "싱글턴", en: "Singleton", cat: "SW공학·테스트", def: "그 객체를 딱 하나만 만들어 모두가 공유하게 하는 패턴. 설정·로그처럼 하나여야 하는 것에 쓴다.", see: "싱글턴 패턴 (Singleton pattern)" },
  { ko: "MVC / MVVM", en: "Model-View-Controller", cat: "SW공학·테스트", def: "데이터(모델)·화면(뷰)·중개자를 분리하는 구조. 중개자가 Controller면 MVC, ViewModel이면 MVVM.", see: "MVVM (Model, View, View Model)" },
  { ko: "UML", en: "Unified Modeling Lang.", cat: "SW공학·테스트", def: "설계를 그림으로 그리는 표준 표기법. 유스케이스·클래스·시퀀스 다이어그램이 대표.", see: "UML의 4+1 View Model" },
  { ko: "화이트박스/블랙박스", en: "White/Black Box", cat: "SW공학·테스트", def: "속(코드)을 보고 짜는 테스트가 화이트박스, 겉(입출력)만 보고 짜는 테스트가 블랙박스.", see: "블랙박스 테스트" },
  { ko: "테스트 오라클", en: "Test Oracle", cat: "SW공학·테스트", def: "'이 결과가 맞다'고 판정해 주는 기준. AI는 정답 기준이 모호해서 이게 테스트의 난제가 된다.", see: "AI 시스템 테스트" },
  { ko: "동등분할/경계값", en: "Equivalence/Boundary", cat: "SW공학·테스트", def: "같은 결과가 나오는 입력을 묶어 대표 하나만 테스트(동등분할)하고, 사고가 잦은 경계(0, 최대값)를 따로 본다.", see: "블랙박스 테스트" },
  { ko: "회귀 테스트", en: "Regression Test", cat: "SW공학·테스트", def: "고친 뒤 '멀쩡하던 게 망가지지 않았나' 확인하는 재검사.", see: "리그레이션(회귀, Regression) 테스트" },
  { ko: "코드 커버리지", en: "Code Coverage", cat: "SW공학·테스트", def: "테스트가 코드를 얼마나 훑었는지 비율. 구문 → 결정 → 조건 → MC/DC 순으로 엄격해진다.", see: "코드 커버리지(Code Coverage)" },
  { ko: "뮤테이션 테스트", en: "Mutation Test", cat: "SW공학·테스트", def: "일부러 코드에 결함을 심어 놓고 '내 테스트가 이걸 잡아내나'를 확인하는 테스트의 테스트.", see: "뮤테이션 테스트 (Mutation Test)" },
  { ko: "퍼징", en: "Fuzzing", cat: "SW공학·테스트", def: "무작위·비정상 입력을 마구 넣어 뻗는 지점을 찾는 기법. 보안 취약점 발굴의 단골.", see: "퍼징 테스트 (Fuzzing Test)" },
  { ko: "카오스 테스트", en: "Chaos Test", cat: "SW공학·테스트", def: "운영 중인 시스템에 일부러 장애를 일으켜 '진짜 버티나'를 확인하는 방식. 넷플릭스가 대표 사례.", see: "카오스 테스트 (Chaos Test)" },
  { ko: "V모델", en: "V-Model", cat: "SW공학·테스트", def: "개발 단계마다 짝이 되는 테스트 단계를 붙인 그림. 요구↔인수, 설계↔통합, 코딩↔단위.", see: "AI 시스템 테스트" },
  { ko: "정적/동적 테스트", en: "Static/Dynamic", cat: "SW공학·테스트", def: "실행하지 않고 문서·코드를 보는 게 정적(리뷰·인스펙션), 실제로 돌려 보는 게 동적.", see: "리뷰(Review)" },
  { ko: "순환 복잡도", en: "Cyclomatic Complexity", cat: "SW공학·테스트", def: "코드에 갈림길이 몇 개인지 센 수치. 높을수록 테스트할 경로가 많고 버그가 숨기 좋다.", see: "McCabe 회전 복잡도" },
  { ko: "기술 부채", en: "Technical Debt", cat: "SW공학·테스트", def: "급하게 대충 짜서 나중에 갚아야 할 빚. 이자는 유지보수 시간으로 나간다.", see: "소프트웨어 리팩토링" },
  { ko: "CMMI", en: "Capability Maturity", cat: "SW공학·테스트", def: "조직의 개발 성숙도를 5단계로 평가하는 모델. '사람이 바뀌어도 같은 품질이 나오나'를 본다.", see: "CMMI 3.0" },
  { ko: "기능점수", en: "Function Point", cat: "SW공학·테스트", def: "코드 줄 수가 아니라 '사용자에게 보이는 기능의 양'으로 규모를 재는 법. 공공 SW 대가 산정의 기준.", see: "Function Point" },
  { ko: "SBOM", en: "SW Bill of Materials", cat: "SW공학·테스트", def: "이 소프트웨어에 들어간 부품(오픈소스·라이브러리) 목록표. 취약점이 터지면 영향 범위를 즉시 찾는 근거.", see: "SBOM" },
  { ko: "감리", en: "Audit", cat: "SW공학·테스트", def: "제3자가 독립적으로 정보시스템의 품질을 평가하는 제도. 공공은 일정 규모 이상이면 의무.", see: "공통감리 절차" },

  // ── 인공지능 (3주차 AI) ─────────────────────────────────────
  { ko: "지도/비지도 학습", en: "Supervised/Unsupervised", cat: "인공지능", def: "정답표를 주고 배우면 지도, 정답 없이 비슷한 것끼리 묶게 하면 비지도. 보상으로 배우면 강화학습.", see: "머신러닝 학습방법" },
  { ko: "레이블", en: "Label", cat: "인공지능", def: "데이터에 붙인 정답표. 사진마다 '고양이'라고 적어 주는 그 표시.", see: "데이터라벨링과 어노테이션" },
  { ko: "가중치", en: "Weight", cat: "인공지능", def: "신경망이 학습으로 조절하는 손잡이 값. '학습한다'는 건 결국 이 숫자들을 고친다는 뜻.", see: "오류 역전파(Backpropagation)" },
  { ko: "손실함수", en: "Loss Function", cat: "인공지능", def: "예측이 정답과 얼마나 틀렸는지를 숫자 하나로 만드는 함수. 이 점수가 있어야 고칠 방향을 안다.", see: "손실함수" },
  { ko: "경사하강법", en: "Gradient Descent", cat: "인공지능", def: "안개 낀 산에서 발밑 기울기만 보고 낮은 곳으로 한 걸음씩 내려가는 방식. 학습의 기본 동작.", see: "머신러닝 옵티마이저" },
  { ko: "학습률", en: "Learning Rate", cat: "인공지능", def: "한 걸음의 보폭. 너무 크면 골짜기를 건너뛰고, 너무 작으면 영원히 못 내려간다.", see: "머신러닝 옵티마이저" },
  { ko: "에포크/배치", en: "Epoch/Batch", cat: "인공지능", def: "전체 데이터를 한 바퀴 다 본 게 1에포크, 한 번에 묶어 넣는 데이터 뭉치가 배치.", see: "배치 정규화(Batch Normalization)" },
  { ko: "역전파", en: "Backpropagation", cat: "인공지능", def: "틀린 만큼을 출력에서 입력 쪽으로 거꾸로 흘려보내며 '누가 얼마나 잘못했나'를 따져 고치는 것.", see: "오류 역전파(Backpropagation)" },
  { ko: "활성화 함수", en: "Activation Function", cat: "인공지능", def: "뉴런이 받은 신호를 얼마나 세게 내보낼지 정하는 함수. 이게 없으면 층을 쌓아도 직선 계산뿐이다.", see: "활성화함수(Activation Function)" },
  { ko: "과적합", en: "Overfitting", cat: "인공지능", def: "연습문제만 통째로 외워 시험을 망치는 상태. 학습 데이터엔 완벽한데 새 데이터엔 엉망.", see: "Dropout" },
  { ko: "드롭아웃", en: "Dropout", cat: "인공지능", def: "학습할 때마다 뉴런 일부를 랜덤으로 꺼서 특정 뉴런에 의존하지 못하게 하는 과적합 방지법.", see: "Dropout" },
  { ko: "정규화 vs 규제화", en: "Normalization/Regularization", cat: "인공지능", def: "정규화·표준화는 '입력 데이터'의 크기를 맞추는 것, 규제화는 '모델 가중치'에 벌점을 줘 복잡도를 누르는 것.", see: "정규화, 규제화, 표준화" },
  { ko: "기울기 소실", en: "Vanishing Gradient", cat: "인공지능", def: "층이 깊어질수록 고칠 신호가 점점 약해져 앞쪽 층이 안 배워지는 현상. ReLU로 많이 해결됐다.", see: "기울기 소실과 기울기 폭주" },
  { ko: "하이퍼파라미터", en: "Hyperparameter", cat: "인공지능", def: "학습으로 정해지지 않고 사람이 미리 정해 줘야 하는 값(학습률·층 수·K값 등).", see: "AutoML" },
  { ko: "차원의 저주", en: "Curse of Dimensionality", cat: "인공지능", def: "변수(차원)가 늘수록 데이터가 텅 빈 공간에 흩어져 학습이 급격히 어려워지는 현상.", see: "차원 축소(Dimensionality Reduction)" },
  { ko: "임베딩", en: "Embedding", cat: "인공지능", def: "단어·이미지를 의미가 담긴 숫자 벡터로 바꾼 것. 뜻이 비슷하면 벡터도 가까이 놓인다.", see: "자연어처리(NLP)" },
  { ko: "벡터 DB", en: "Vector Database", cat: "인공지능", def: "임베딩(숫자 벡터)을 저장해 두고 '의미가 비슷한 것'을 빠르게 찾아 주는 데이터베이스. RAG의 필수 부품.", see: "RAG(Retrieval Augmented Generation)" },
  { ko: "트랜스포머", en: "Transformer", cat: "인공지능", def: "문장을 한 번에 병렬로 읽으면서 중요한 단어에 집중(어텐션)하는 구조. 오늘날 생성형 AI 전부의 뿌리.", see: "트랜스포머(Transformer)" },
  { ko: "어텐션", en: "Attention", cat: "인공지능", def: "번역할 때 원문에서 관련 단어에 형광펜을 치듯, 지금 필요한 부분에 집중해 참고하는 방법.", see: "어텐션 메커니즘(Attention Mechanism)" },
  { ko: "토큰", en: "Token", cat: "인공지능", def: "AI가 글을 자르는 최소 조각(단어 또는 단어 일부). 요금과 입력 한도가 전부 이 단위로 계산된다.", see: "초거대 언어 모델(Large Language Model)" },
  { ko: "파인튜닝", en: "Fine-tuning", cat: "인공지능", def: "이미 배운 모델에 내 데이터를 추가로 학습시켜 내 일에 맞게 다듬는 것. 모델 자체가 바뀐다.", see: "파인 튜닝(Fine-tuning)" },
  { ko: "프롬프트 튜닝", en: "Prompt Tuning", cat: "인공지능", def: "모델은 그대로 얼려 두고 입력 문구만 조절해 원하는 답을 얻는 것. 자원이 훨씬 적게 든다.", see: "프롬프트 튜닝(Prompt Tuning)" },
  { ko: "RAG", en: "Retrieval Augmented Gen.", cat: "인공지능", def: "답하기 전에 외부 자료를 검색해 근거로 붙여 주는 방식. AI에게 오픈북 시험을 보게 하는 것.", see: "RAG(Retrieval Augmented Generation)" },
  { ko: "할루시네이션", en: "Hallucination", cat: "인공지능", def: "AI가 사실이 아닌 것을 그럴듯하게 지어내는 현상. RAG·고품질 데이터·RLHF로 줄인다.", see: "할루시네이션(Hallucination)" },
  { ko: "RLHF", en: "Reinforcement Learning HF", cat: "인공지능", def: "사람이 답변에 점수를 매기고 그 피드백으로 모델을 다듬는 학습법. AI를 '사람 취향'에 맞추는 과정.", see: "할루시네이션(Hallucination)" },
  { ko: "제로샷/퓨샷", en: "Zero-shot/Few-shot", cat: "인공지능", def: "예시를 하나도 안 주고 시키면 제로샷, 몇 개 보여 주고 시키면 퓨샷.", see: "프롬프트 엔지니어링(Prompt Engineering)" },
  { ko: "CoT", en: "Chain of Thought", cat: "인공지능", def: "답만 내놓지 말고 풀이 과정을 단계별로 쓰게 시키는 것. 그것만으로 정답률이 오른다.", see: "COT(Chain of Thought)" },
  { ko: "AI 에이전트", en: "AI Agent", cat: "인공지능", def: "묻는 말에 답만 하지 않고, 목표를 위해 스스로 도구를 쓰고 행동까지 하는 AI.", see: "AI Agent" },
  { ko: "MCP", en: "Model Context Protocol", cat: "인공지능", def: "AI 앱과 외부 데이터·도구를 잇는 표준 규격. 'AI계의 USB-C 포트'.", see: "MCP(Model Context Protocol)" },
  { ko: "지식 증류", en: "Knowledge Distillation", cat: "인공지능", def: "크고 똑똑한 교사 모델의 판단을 작은 학생 모델에 옮겨, 가볍지만 비슷한 성능을 내게 하는 것.", see: "지식 증류(Knowledge Distillation)" },
  { ko: "양자화", en: "Quantization", cat: "인공지능", def: "숫자 정밀도를 낮춰(32비트→8비트) 모델 크기와 계산량을 줄이는 경량화. 스마트폰 탑재의 필수.", see: "온디바이스 AI" },
  { ko: "XAI", en: "Explainable AI", cat: "인공지능", def: "'왜 그렇게 판단했는지'를 설명해 주는 AI. 결과만 주는 블랙박스의 반대.", see: "편향" },
  { ko: "모델 드리프트", en: "Model Drift", cat: "인공지능", def: "모델은 그대로인데 세상이 변해 성능이 떨어지는 현상. 그래서 재학습·모니터링이 필요하다.", see: "컨셉 드리프트 & 데이터 드리프트" },

  // ── 확률·통계 (3주차 ST) ────────────────────────────────────
  { ko: "모집단/표본", en: "Population/Sample", cat: "확률·통계", def: "알고 싶은 전체 집단이 모집단, 실제로 조사한 일부가 표본. 통계는 표본으로 모집단을 짐작하는 일이다.", see: "표본 추출" },
  { ko: "모수/통계량", en: "Parameter/Statistic", cat: "확률·통계", def: "모집단의 진짜 값이 모수(모평균 μ), 표본에서 계산한 값이 통계량(표본평균 x̄).", see: "추정 이론(Estimation Theory)" },
  { ko: "확률변수", en: "Random Variable", cat: "확률·통계", def: "결과가 정해지지 않은 시행의 값을 숫자로 놓은 것. 주사위 눈, 내일 기온 같은 것.", see: "확률분포" },
  { ko: "정규분포", en: "Normal Distribution", cat: "확률·통계", def: "평균을 중심으로 좌우 대칭인 종모양. 키·시험점수·측정오차 등 자연 현상 대부분이 이 모양이다.", see: "정규분포(Normal Distribution)" },
  { ko: "표준편차/분산", en: "Std. Deviation/Variance", cat: "확률·통계", def: "값들이 평균에서 얼마나 흩어져 있는지의 척도. 분산의 제곱근이 표준편차(단위가 원래대로 돌아온다).", see: "기술 통계(Descriptive statistics)" },
  { ko: "중심극한정리", en: "Central Limit Theorem", cat: "확률·통계", def: "모집단이 어떤 모양이든 표본을 30개 넘게 뽑아 평균을 내면 그 평균들의 분포는 정규분포가 된다.", see: "중심극한정리" },
  { ko: "표준오차", en: "Standard Error", cat: "확률·통계", def: "표본평균이 얼마나 흔들리는지의 척도(σ/√n). 표본이 커질수록 작아진다 = 추정이 정확해진다.", see: "중심극한정리" },
  { ko: "신뢰구간", en: "Confidence Interval", cat: "확률·통계", def: "'모수가 이 구간 안에 있을 것'이라고 제시하는 범위. 값 하나만 찍는 점추정과 달리 불확실성을 보여 준다.", see: "추정 이론(Estimation Theory)" },
  { ko: "자유도", en: "Degree of Freedom", cat: "확률·통계", def: "자유롭게 정할 수 있는 값의 개수. x+y+z=10에서 x·y를 정하면 z는 자동 → 자유도 2.", see: "추정 이론(Estimation Theory)" },
  { ko: "귀무/대립가설", en: "Null/Alternative", cat: "확률·통계", def: "'차이가 없다'가 귀무가설(H₀), 내가 입증하고 싶은 '차이가 있다'가 대립가설(H₁).", see: "통계적 가설검정 (Hypothesis Testing)" },
  { ko: "p값", en: "p-value", cat: "확률·통계", def: "귀무가설이 맞다고 쳤을 때 이런 결과가 나올 확률. 유의수준(보통 0.05)보다 작으면 귀무가설을 기각한다.", see: "통계적 가설검정 (Hypothesis Testing)" },
  { ko: "1종/2종 오류", en: "Type I/II Error", cat: "확률·통계", def: "멀쩡한 걸 문제라고 하면 1종(α), 문제인 걸 못 잡으면 2종(β). 둘은 서로 반대로 움직인다.", see: "통계적 가설검정 (Hypothesis Testing)" },
  { ko: "유의수준", en: "Significance Level", cat: "확률·통계", def: "1종 오류를 얼마나 감수할지 정한 기준선(보통 0.05). 판정의 잣대.", see: "통계적 가설검정 (Hypothesis Testing)" },
  { ko: "상관계수", en: "Correlation Coefficient", cat: "확률·통계", def: "두 변수가 함께 움직이는 정도(−1~+1). 0이면 선형 관계 없음. 상관이 인과는 아니다.", see: "연관성 분석(association analysis) - 기초통계" },
  { ko: "회귀분석", en: "Regression", cat: "확률·통계", def: "한 변수가 다른 변수에 얼마나 영향을 주는지 수식으로 설명·예측하는 것. y = ax + b의 a를 찾는 일.", see: "회귀분석(Regression Analysis)" },
  { ko: "결정계수", en: "R-squared", cat: "확률·통계", def: "이 모델이 데이터를 몇 % 설명하는지(0~1). 높을수록 설명력이 좋지만 과적합은 별개 문제.", see: "회귀분석(Regression Analysis)" },
  { ko: "잔차", en: "Residual", cat: "확률·통계", def: "실제값과 예측값의 차이. 이게 골고루 흩어져 있어야 좋은 모델이다.", see: "회귀분석(Regression Analysis)" },
  { ko: "다중공선성", en: "Multicollinearity", cat: "확률·통계", def: "독립변수끼리 너무 닮아 누구 덕인지 구분이 안 되는 상태. 키와 몸무게를 함께 넣는 경우.", see: "회귀분석(Regression Analysis)" },
  { ko: "왜도/첨도", en: "Skewness/Kurtosis", cat: "확률·통계", def: "분포가 한쪽으로 기울었는지(왜도), 뾰족한지 평평한지(첨도). 정규분포와 얼마나 다른지 보는 값.", see: "왜도(skewness) & 첨도(kurtosis)" },
  { ko: "사분위수/IQR", en: "Quartile/IQR", cat: "확률·통계", def: "데이터를 4등분한 지점(Q1·중앙값·Q3)과 Q3−Q1 폭. 상자수염그림과 이상치 판정의 기준.", see: "이상치" },
  { ko: "이상치", en: "Outlier", cat: "확률·통계", def: "다른 값들과 동떨어진 아주 크거나 작은 값. 평균을 통째로 왜곡하니 반드시 확인해야 한다.", see: "이상치" },
  { ko: "ANOVA", en: "Analysis of Variance", cat: "확률·통계", def: "집단이 셋 이상일 때 평균 차이가 진짜인지 F검정으로 판정하는 기법. 두 집단이면 t-검정.", see: "ANOVA(Analysis of variance)" },
  { ko: "베이즈 정리", en: "Bayes' Theorem", cat: "확률·통계", def: "새 증거를 보고 원래 알던 확률을 갱신하는 공식. 스팸 필터·의료 진단의 원리.", see: "베이즈 정리 (Bayes's theorem)" },
  { ko: "시계열", en: "Time Series", cat: "확률·통계", def: "시간 순서로 쌓인 데이터. 추세·순환·계절·불규칙 네 성분으로 나눠 보고 AR·MA·ARIMA로 예측한다.", see: "시계열분석" },

  // ── 자료구조·알고리즘 ─────────────────────────────────────────
  { ko: "자료구조", en: "Data Structure", cat: "자료구조·알고리즘", def: "데이터를 담는 그릇의 모양. 배열은 줄지은 사물함, 리스트는 사슬, 트리는 족보, 그래프는 노선도." },
  { ko: "시간 복잡도", en: "Big-O", cat: "자료구조·알고리즘", def: "입력이 커질 때 일이 늘어나는 속도 등급. O(n²)이면 인원이 2배 될 때 일이 4배가 된다." },
  { ko: "재귀", en: "Recursion", cat: "자료구조·알고리즘", def: "함수가 자기 자신을 다시 부르는 방식. 러시아 인형처럼 같은 문제의 더 작은 판을 반복해 푼다." },
  { ko: "해시", en: "Hash", cat: "자료구조·알고리즘", def: "이름을 함수에 넣어 바로 서랍 번호를 얻는 초고속 찾기. 같은 번호가 나오는 충돌 처리가 숙제다." },
  { ko: "트리", en: "Tree", cat: "자료구조·알고리즘", def: "뿌리에서 가지를 치며 내려가는 계층 구조. 폴더 구조나 조직도가 그대로 트리다." },
  { ko: "그래프", en: "Graph", cat: "자료구조·알고리즘", def: "점(정점)과 선(간선)으로 관계를 그린 구조. 지하철 노선도·SNS 친구 관계가 그래프다." },
  { ko: "정렬", en: "Sort", cat: "자료구조·알고리즘", def: "뒤죽박죽 데이터를 순서대로 세우는 것. 어떻게 세우느냐(버블·퀵·병합…)로 속도가 갈린다." },
  { ko: "이진 탐색", en: "Binary Search", cat: "자료구조·알고리즘", def: "정렬된 목록을 반씩 접어 가며 찾기. 업다운 게임처럼 몇 번 만에 범위가 확 줄어든다." },

  // ── 네트워크 ─────────────────────────────────────────────────
  { ko: "패킷", en: "Packet", cat: "네트워크", def: "데이터를 소포처럼 잘게 나눈 전송 단위. 각자 주소를 달고 따로 여행한 뒤 도착지에서 재조립된다." },
  { ko: "IP 주소", en: "IP Address", cat: "네트워크", def: "인터넷 세상의 집 주소. 패킷이 찾아갈 목적지 번호로, 부족해진 v4를 v6가 이어받는 중이다.", see: "IPv6" },
  { ko: "포트", en: "Port", cat: "네트워크", def: "한 건물(컴퓨터) 안의 호실 번호. 웹은 80호, 메일은 25호처럼 서비스마다 드나드는 문이 다르다." },
  { ko: "프로토콜", en: "Protocol", cat: "네트워크", def: "서로 다른 장비가 대화하기 위해 미리 정한 약속(말투·순서·형식). 계층별로 역할을 나눠 둔다.", see: "OSI 7 Layer (ISO 7498)" },
  { ko: "라우팅", en: "Routing", cat: "네트워크", def: "패킷이 갈 길을 고르는 교차로 안내. 거리로 고르거나(거리벡터) 지도를 보고 고른다(링크상태).", see: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)" },
  { ko: "DNS", en: "Domain Name System", cat: "네트워크", def: "naver.com 같은 이름을 IP 번호로 바꿔 주는 인터넷 전화번호부.", see: "DNS(Domain Name System)" },
  { ko: "TCP/UDP", en: "TCP/UDP", cat: "네트워크", def: "등기우편(도착 확인·재전송 보장) vs 일반우편(빠르지만 확인 없음). 신뢰냐 속도냐의 선택.", see: "TCP 와 UDP 비교" },
  { ko: "대역폭", en: "Bandwidth", cat: "네트워크", def: "도로의 차선 수. 넓을수록 한 번에 많은 데이터가 지나간다. 속도가 아니라 '폭'이다.", see: "QoS(Quality of Service)" },
  { ko: "지연", en: "Latency", cat: "네트워크", def: "데이터가 출발해 도착할 때까지 걸리는 시간. 차선(대역폭)이 아무리 넓어도 거리가 멀면 늦는다." },
  { ko: "핸드셰이크", en: "Handshake", cat: "네트워크", def: "통신을 시작하기 전 서로 준비됐는지 확인하는 악수 절차. TCP는 세 번 악수하고 시작한다.", see: "TCP 연결의 설정 및 해제(Handshaking)" },
  { ko: "혼잡 제어", en: "Congestion Control", cat: "네트워크", def: "도로가 막히면 차를 천천히 내보내는 속도 조절. 조금씩 늘리다 사고가 나면 확 줄인다.", see: "TCP 혼잡제어" },
  { ko: "CDN", en: "Contents Delivery Network", cat: "네트워크", def: "인기 콘텐츠를 각 동네 창고에 미리 복사해 두고 가까운 곳에서 내주는 배급망.", see: "CDN(Contents Delivery Network)" },

  // ── 데이터베이스 ─────────────────────────────────────────────
  { ko: "트랜잭션", en: "Transaction", cat: "데이터베이스", def: "쪼갤 수 없는 작업 한 묶음. 계좌이체는 출금+입금이 전부 성공하거나 전부 취소돼야 한다.", see: "트랜잭션" },
  { ko: "커밋/롤백", en: "Commit/Rollback", cat: "데이터베이스", def: "확정 도장(커밋)과 없던 일로 되돌리기(롤백). 트랜잭션의 두 결말.", see: "트랜잭션" },
  { ko: "스키마", en: "Schema", cat: "데이터베이스", def: "데이터베이스의 설계도. 어떤 표에 어떤 칸이 있고 서로 어떻게 이어지는지를 정의한다.", see: "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성" },
  { ko: "릴레이션(테이블)", en: "Relation", cat: "데이터베이스", def: "행과 열로 된 표. 관계형 DB는 모든 데이터를 이 표에 담는다.", see: "릴레이션 키(key)" },
  { ko: "기본키", en: "Primary Key", cat: "데이터베이스", def: "행 하나를 유일하게 구별하는 대표 번호표. 사람으로 치면 주민등록번호.", see: "릴레이션 키(key)" },
  { ko: "외래키", en: "Foreign Key", cat: "데이터베이스", def: "다른 표의 기본키를 가리키는 연결 고리. 주문 표가 고객 표의 번호를 들고 있는 식.", see: "릴레이션 키(key)" },
  { ko: "인덱스", en: "Index", cat: "데이터베이스", def: "책 뒤의 찾아보기. 표 전체를 안 뒤져도 원하는 행으로 바로 가게 해 준다.", see: "RDBMS 인덱스(index)" },
  { ko: "조인", en: "Join", cat: "데이터베이스", def: "두 표를 공통 칸으로 이어 붙여 한 번에 보는 것. 고객 표+주문 표 → '누가 뭘 샀나'.", see: "조인(Join)" },
  { ko: "정규화(DB)", en: "Normalization", cat: "데이터베이스", def: "중복을 없애 표를 잘게 나누는 정리 정돈. 같은 정보가 두 곳에 있으면 언젠가 어긋난다.", see: "데이터베이스 정규화(Normalization)" },
  { ko: "락", en: "Lock", cat: "데이터베이스", def: "동시에 같은 데이터를 고치지 못하게 거는 잠금. 화장실 문 잠금과 같은 원리다.", see: "DB 동시성제어" },
  { ko: "백업/복구", en: "Backup/Recovery", cat: "데이터베이스", def: "사고에 대비해 사본을 떠 두고(백업), 사고가 나면 로그로 되살리는(복구) 안전장치.", see: "DB 회복기법" },
  { ko: "쿼리", en: "Query", cat: "데이터베이스", def: "데이터베이스에 던지는 질문. '3월 주문 전부 보여줘'를 SQL 문장으로 쓴 것.", see: "SQL(Structured Query Language)" },
  { ko: "메타데이터", en: "Metadata", cat: "데이터베이스", def: "데이터에 대한 데이터. 사진의 촬영일·위치처럼, 데이터의 이름·형식·출처 같은 신상 정보.", see: "데이터 거버넌스(Data Governance)" },
  { ko: "CDC", en: "Change Data Capture", cat: "데이터베이스", def: "원본 DB의 변경분만 실시간으로 베껴 다른 DB에 전달하는 복제 기술.", see: "쿼리오프로딩(Query offloading)" },

  // ── 경영전략 ─────────────────────────────────────────────────
  { ko: "거버넌스", en: "Governance", cat: "경영전략", def: "'누가 무엇을 결정하고 책임지는가'의 체계. 일 자체(운영)가 아니라 통제·감독의 틀이다.", see: "IT 거버넌스(IT-Governance)" },
  { ko: "프레임워크", en: "Framework", cat: "경영전략", def: "일하는 틀. 바닥부터 고민하지 않도록 앞사람들이 정리해 둔 뼈대와 절차.", see: "ITIL(IT Infrastructure Library) 4.0" },
  { ko: "SLA", en: "Service Level Agreement", cat: "경영전략", def: "서비스 수준을 숫자로 약속한 계약서. '가동률 99.9% 보장' 같은 조항이 들어간다.", see: "ITSM(Information Technology Service Management)" },
  { ko: "아웃소싱", en: "Outsourcing", cat: "경영전략", def: "내 일을 외부 전문 업체에 맡기는 것. 맡기는 만큼 수준을 재는 계약(SLA)이 중요해진다.", see: "ITSM(Information Technology Service Management)" },
  { ko: "BCP/DR", en: "Business Continuity/Disaster Recovery", cat: "경영전략", def: "재해가 나도 사업을 멈추지 않는 계획(BCP)과 시스템을 되살리는 복구(DR).", see: "BCP (Business Continuity Planning)" },
  { ko: "RTO/RPO", en: "Recovery Time/Point Objective", cat: "경영전략", def: "언제까지 복구할지(RTO)와 데이터를 어느 시점까지 포기할 수 있는지(RPO)의 목표치.", see: "BIA (Business Impact Analysis)" },
  { ko: "컴플라이언스", en: "Compliance", cat: "경영전략", def: "법과 규제를 지키는 것. 안 지키면 벌금·제재가 따라오니 시스템 차원에서 대비한다.", see: "IT-Compliance" },
  { ko: "포트폴리오", en: "Portfolio", cat: "경영전략", def: "사업·제품을 바구니에 담아 한눈에 보는 것. 어디에 더 투자하고 어디서 뺄지를 정한다.", see: "BCG Matrix" },
  { ko: "RFP", en: "Request For Proposal", cat: "경영전략", def: "'이런 시스템을 만들어 주세요'라고 조건을 적어 업체들에게 보내는 공식 제안요청서.", see: "ISMP (Information System Master Plan)" },
  { ko: "ROI", en: "Return On Investment", cat: "경영전략", def: "투자 대비 수익 비율. 1억을 넣어 1.2억을 벌면 ROI 20%.", see: "IT 투자성과 평가" },
  { ko: "NPV", en: "Net Present Value", cat: "경영전략", def: "미래에 벌 돈을 현재 가치로 환산해 더한 것. '내년의 1억'은 오늘의 1억보다 싸다.", see: "IT 투자성과 평가" },
  { ko: "KPI", en: "Key Performance Indicator", cat: "경영전략", def: "목표 달성을 재는 핵심 숫자. 매출·가동률·불량률처럼 계기판에 올려 두는 지표.", see: "OKR" },
  { ko: "캐즘", en: "Chasm", cat: "경영전략", def: "신제품이 얼리어답터를 넘어 대중 시장으로 가기 직전 수요가 뚝 끊기는 골짜기.", see: "기술수용 주기(Technology Adoption Life Cycle)" },
  { ko: "페르소나", en: "Persona", cat: "경영전략", def: "대표 사용자를 가상 인물로 구체화한 것. '38세 워킹맘 김OO'처럼 얼굴을 붙여 설계한다.", see: "디자인 씽킹(Design Thinking)" },
];

const CATS = [
  "전체",
  "컴퓨터 기본",
  "프로세스·동기화",
  "메모리·캐시",
  "하드웨어",
  "저장·안정성",
  "개발·PM·테스트",
  "프로젝트 관리",
  "SW공학·테스트",
  "인공지능",
  "확률·통계",
  "자료구조·알고리즘",
  "네트워크",
  "데이터베이스",
  "경영전략",
] as const;

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

const COURSE_LABEL: Record<string, string> = {
  OS: "운영체제",
  CA: "컴퓨터구조",
  PM: "프로젝트관리",
  SE: "SW공학",
  AI: "인공지능",
  ST: "확률·통계",
  DS: "자료구조",
  AL: "알고리즘",
  NW: "네트워크",
  DB: "데이터베이스",
  MG: "경영전략",
};
const COURSE_KEYS = [
  "전체",
  "OS",
  "CA",
  "PM",
  "SE",
  "AI",
  "ST",
  "DS",
  "AL",
  "NW",
  "DB",
  "MG",
] as const;

export default function BasicsPage() {
  const [tab, setTab] = useState<"book" | "easy">("book");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("전체");
  const [course, setCourse] = useState<(typeof COURSE_KEYS)[number]>("전체");

  // ① 교재 정의 — 서브노트 정의문 원문. 검색은 제목·정의·키워드 전부에 건다.
  const bookList = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SUBNOTES.filter(
      (s) =>
        (course === "전체" || s.course === course) &&
        (!needle ||
          s.title.toLowerCase().includes(needle) ||
          s.definition.toLowerCase().includes(needle) ||
          s.keywords.some((k) => k.toLowerCase().includes(needle))),
    );
  }, [q, course]);

  // ② 왕초보 용어 — 손으로 쓴 보조 사전.
  const easyList = useMemo(() => {
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
        desc="기본은 교재 정의문 그대로 — 답안 서론에 쓰는 그 문장입니다. 낱말이 어려우면 왕초보 탭에서 찾으세요."
      />

      <div className="sticky top-14 z-[5] -mx-1 mb-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        {/* 탭 — 교재 정의가 기본 */}
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(
            [
              ["book", "📒 교재 정의", SUBNOTES.length],
              ["easy", "🐣 왕초보 용어", TERMS.length],
            ] as const
          ).map(([k, t, n]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                tab === k ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
              }`}
            >
              {t} <span className="text-xs font-normal text-slate-400">{n}</span>
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            tab === "book"
              ? "🔍 토픽·정의·키워드 검색 — 예: RAG, 교착상태, 몬테카를로"
              : "🔍 모르는 낱말 검색 — 예: 오버헤드, 임베딩, p값"
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-[15px] outline-none focus:border-brand-400"
          autoFocus
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tab === "book"
            ? COURSE_KEYS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCourse(c)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    course === c
                      ? "bg-brand-600 text-white"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {c === "전체" ? "전체" : COURSE_LABEL[c]}
                </button>
              ))
            : CATS.map((c) => (
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
            {tab === "book" ? bookList.length : easyList.length}개
          </span>
        </div>
      </div>

      {tab === "book" ? (
        bookList.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            &lsquo;{q}&rsquo; 에 해당하는 교재 토픽이 없어요. 왕초보 탭도 확인해 보세요.
          </p>
        ) : (
          <div className="space-y-2.5">
            {bookList.map((s) => (
              <div
                key={`${s.course}-${s.title}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 ring-1 ring-brand-200">
                    {COURSE_LABEL[s.course]}
                  </span>
                  <b className="text-[15px] text-slate-900">{s.title}</b>
                  <span className="ml-auto flex gap-1.5">
                    <Link
                      href={`/explain?topic=${encodeURIComponent(s.title)}`}
                      className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      💡 설명
                    </Link>
                    <Link
                      href={`/mnemonic?topic=${encodeURIComponent(s.title)}`}
                      className="rounded-md bg-brand-600 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-brand-700"
                    >
                      🥷 암기
                    </Link>
                  </span>
                </div>
                {/* 답안 2줄 정의(17자×2=34자) — 시험지에 쓰는 그 문장 */}
                {s.defShort && (
                  <p className="mt-1.5 rounded-lg bg-brand-50/70 px-2.5 py-1.5 text-[14px] font-semibold leading-relaxed text-slate-900 ring-1 ring-brand-100">
                    ✍️ {s.defShort}
                    <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                      {s.defShort.replace(/\s/g, "").length}자
                    </span>
                  </p>
                )}
                {/* 교재 정의문 원문 */}
                <p className={`mt-1.5 leading-relaxed ${s.defShort ? "text-[12.5px] text-slate-500" : "text-[13.5px] text-slate-800"}`}>
                  {s.definition}
                </p>
                {s.keywords.length > 0 && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    {s.keywords.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : easyList.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          &lsquo;{q}&rsquo; 는 아직 사전에 없어요. 어떤 문장에서 만났는지 알려주시면 추가합니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {easyList.map((t) => (
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
