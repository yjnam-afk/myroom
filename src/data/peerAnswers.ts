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
  /** 시험지의 빨간 첨삭을 그대로 옮긴 것. 해석은 붙이지 않는다. */
  feedback?: string[];
  pages: PeerAnswerPage[];
};

export const PEER_ANSWERS: PeerAnswer[] = [
  {
    id: "peer-os-vm-1",
    period: "1교시",
    no: "2",
    question: "가상메모리 관리기법",
    exam: "NS반 모의고사",
    topicTitles: ["가상메모리 관리기법", "가상메모리의 페이징과 세그멘테이션"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "할당관리 기법 표의 Swap in·Swap out에 동그라미.",
      "배치관리 기법 표의 First·Next·Worst·Best fit에 동그라미.",
      "호출관리 기법 표의 요구페이징·예상페이징에 동그라미.",
      "교체 관리기법 표의 Round-Robin·LRU·LFU·OPT·FIFO 묶음에 동그라미, 옆에 '(알고리즘)'.",
    ],
    pages: [
      { src: "/answers/os-vm-a-1.jpg", label: "3쪽 — 개념·특징(윗부분만 스캔)" },
      { src: "/answers/os-vm-a-2.jpg", label: "4쪽 — 할당·배치·호출 관리기법" },
      { src: "/answers/os-vm-a-3.jpg", label: "5쪽 — 교체 관리기법" },
    ],
  },
  {
    id: "peer-os-vm-2",
    period: "1교시",
    no: "2",
    question: "가상메모리 관리기법",
    exam: "NS반 모의고사",
    topicTitles: ["가상메모리 관리기법", "가상메모리의 페이징과 세그멘테이션"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "개념도의 ①할당 ②배치 ③인출 ④교체와 Swap out·Swap in에 동그라미.",
      "세부 기술 표의 고정·가변할당, First·Best·Worst, Demand·Pre fetch에 동그라미.",
      "교체 알고리즘 표(FIFO·OPT·LFT·LRT)를 크게 묶고 'O.K.'와 함께 '교체 알고리즘 — 다른 토픽으로 읽음!!'.",
    ],
    pages: [
      { src: "/answers/os-vm-b-1.jpg", label: "4쪽 — 개념·개념도·세부 기술" },
      { src: "/answers/os-vm-b-2.jpg", label: "5쪽 — 교체 알고리즘(아래는 다음 문제 NoCode/RPA)" },
    ],
  },
  {
    id: "peer-os-vm-3",
    period: "2교시",
    no: "3",
    question: "① 가상메모리 개념·필요성\n② 가상메모리 관리기법\n③ 사용 시 문제점·해결방안",
    exam: "NS반 모의고사",
    topicTitles: ["가상메모리 관리기법", "스레싱(Thrashing)", "단편화(Fragmentation)", "Belady's Anomaly(FIFO 이상현상)", "지역성(Locality)"],
    score: 16,
    maxScore: 25,
    feedback: [
      "개념도의 할당·배치·인출 기법과 Swap-In·Swap-out, 보조기억장치에 동그라미.",
      "개념 정의 문장과 필요성 표의 항목(규모의 규모화·메모리 한계 극복·자원사용 효율화·최적자원 활용)에 동그라미.",
      "관리기법 표의 할당·배치·인출·교체 기법과 세부 기법(First·Best·Worst·Next Fit, Demand·Pre-Fetch, FIFO·SCR·LFU·LRU·OPT·NUR)에 동그라미.",
      "문제점(Thrashing·단편화·Belady의 변이·메모리 누수)과 원인, 해결방안(Working Set·PFF, 통합·압축·재배치·Slab Allocator, Locality 고려·LRU/OPT, GC·스마트 포인터)에 동그라미.",
      "마지막 지역성 활용 방안 도식에 동그라미. 답안 끝 '이 하 여 백'.",
    ],
    pages: [
      { src: "/answers/os-vm-c-1.jpg", label: "11쪽 — 개념·필요성" },
      { src: "/answers/os-vm-c-2.jpg", label: "12쪽 — 관리기법" },
      { src: "/answers/os-vm-c-3.jpg", label: "13쪽 — 문제점·해결방안" },
      { src: "/answers/os-vm-c-4.jpg", label: "14쪽 — 지역성 활용 방안" },
    ],
  },
  {
    id: "peer-os-paging-seg-1",
    period: "2교시",
    no: "6",
    question:
      "가상 메모리 동작에 대한 다음의 질문에 대하여 설명하시오.\n가. 가상 메모리 관리 기법의 기본 동작 원리\n나. 페이징 기법과 세그먼트 기법\n다. 구역성(Locality)의 페이징 기법에서 가지는 중요한 의미",
    exam: "NS반 모의고사 15기 2주차",
    topicTitles: ["가상메모리의 페이징과 세그멘테이션", "가상메모리 관리기법", "지역성(Locality)"],
    score: 14.8,
    maxScore: 25,
    feedback: [
      "문 6) 위에 '14.8'. I. 중요성 개념도의 복잡도 증가·대량 I/O·탄력적 대응 상자 옆에 빨간 꺾쇠 표시.",
      "II.가 개념도의 '가상메모리 관리'에 동그라미, 할당 상자로 화살표를 그리고 '할당만 관리영역 같아보이네'.",
      "II.나 표의 기술 열(페이징·세그멘테이션, First·Best·Worst Fit, 예상·즉시, FIFO·LRU·LFU·NUR·OPT)에 세로로 큰 동그라미, 옆에 '표작성은 good'.",
      "III.가 페이징 개념도의 '고정분할 관리'에 동그라미, 개념·특징(고정분할 통합·직접할당·연관할당·직-연할당·내부단편화 발생→Buddy 해결)에 동그라미, 아래 '구체적'.",
      "III.나 세그먼트 개념도의 '가변분할 관리'에 동그라미, 개념·특징(가변분할해 할당 탄력성 높인 관리기법·외부단편화 발생→Slab Allocator 해결)에 동그라미, 옆에 'OK'.",
      "IV.가 Locality 개념도와 중요의미(최근 Access한 것을 다시 참조·근접 공간을 연쇄 참조)에 큰 동그라미, 위에 '여기보완!'.",
      "IV.나 시간 지역성·공간 지역성 성질 표 전체에 큰 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-ps-a-1.jpg", label: "4쪽 — 문제·중요성" },
      { src: "/answers/os-ps-a-2.jpg", label: "5쪽 — 기본 동작 원리" },
      { src: "/answers/os-ps-a-3.jpg", label: "6쪽 — 페이징·세그먼트 기법" },
      { src: "/answers/os-ps-a-4.jpg", label: "7쪽 — Locality의 중요 의미" },
    ],
  },
  {
    id: "peer-os-paging-seg-2",
    period: "1교시",
    no: "13",
    question: "가상메모리의 페이징과 세그멘테이션 비교",
    exam: "NS반 모의고사 11기 10주차",
    topicTitles: ["가상메모리의 페이징과 세그멘테이션"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문 13) 위에 '6.3'. I. 정의 비교 표의 '(고정)'과 '동적인 크기로'에 동그라미.",
      "II.가 페이징·세그멘테이션 메커니즘 비교 도식 옆에 'good'.",
      "II.나 상세 비교 표 왼쪽에 세로 빨간 줄, 'Segment Table'·'내부단편화'·'외부단편화'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [{ src: "/answers/os-ps-b-1.jpg", label: "6쪽" }],
  },
  {
    id: "peer-ca-cache-map-1",
    period: "3교시",
    no: "4",
    question: "① 캐시 메모리 3가지 사상기법 ② 동작 방식",
    exam: "Simulation 2차 3교시",
    topicTitles: ["캐시(Cache) 메모리의 사상 방식(Mapping Scheme)"],
    // 점수·빨간 첨삭이 없는 모범답안 스캔. 형광펜은 답안 작성자가 키워드에 친 것.
    maxScore: 25,
    pages: [
      { src: "/answers/ca-cache-map-1.jpg", label: "1쪽 — 개요·3가지 사상기법 개념도" },
      { src: "/answers/ca-cache-map-2.jpg", label: "2쪽 — 사상기법 개념 표·직접사상 동작방식" },
      { src: "/answers/ca-cache-map-3.jpg", label: "3쪽 — 연관사상·집합연관사상 동작방식" },
    ],
  },
  {
    id: "peer-os-page-repl-1",
    period: "2교시",
    no: "3",
    question:
      "① 페이지 교체 알고리즘 사용 이유\n② 교체 알고리즘의 종류, 각 종류별 동작과정\n③ FIFO Anomaly와 해결방안",
    exam: "ITPE 모의고사",
    topicTitles: [
      "페이지 교체 알고리즘(Paging Replacement Algorithm)",
      "Belady's Anomaly(FIFO 이상현상)",
      "가상메모리 관리기법",
    ],
    score: 15,
    maxScore: 25,
    feedback: [
      "문 3) 옆에 '15'.",
      "II.가 페이지 교체 알고리즘 종류 트리의 FIFO·LRU·LFU·OPT·NUR 상자 다섯 개에 각각 빨간 동그라미.",
      "II.나 동작과정 표에서 LFU '가장 적게 사용된 페이지', LRU '가장 최근에 사용안한 페이지'에 빨간 밑줄.",
      "III.가 FIFO Anomaly 개념도 오른쪽에 'Frame 증가 3개', 'Frame 4개 비교' 화살표 표시.",
      "III.나 해결방안 표에서 'Second Chance'·'OPT' 동그라미, 'Thrashing' 옆에 '→?'와 'Working set', 'LRU/LFU' 행 옆에 'PFF'. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-pr-a-1.jpg", label: "1쪽 — 사용 이유·알고리즘 종류" },
      { src: "/answers/os-pr-a-2.jpg", label: "2쪽 — FIFO·LFU·LRU·NUR 동작과정" },
      { src: "/answers/os-pr-a-3.jpg", label: "3쪽 — FIFO Anomaly와 해결방안" },
    ],
  },
  {
    id: "peer-os-page-repl-2",
    period: "2교시",
    no: "6",
    question: "페이지교체알고리즘 ① 이유 ② 종류, 동작 ③ Anomaly, 방안",
    exam: "ITPE 모의고사",
    topicTitles: [
      "페이지 교체 알고리즘(Paging Replacement Algorithm)",
      "Belady's Anomaly(FIFO 이상현상)",
      "가상메모리 관리기법",
    ],
    score: 16,
    maxScore: 25,
    feedback: [
      "문 6) 옆에 '16'.",
      "1.1) 개념 제목 옆 'ok 공간확보 위해'. 개념 표의 '용량한계 해결'에 동그라미. 왼쪽 여백에 '페이지 프레임'.",
      "1.2) 제목 '사용하는 이유'에 동그라미, 표 '이유' 옆 'ok'. 보조기억장치 측면의 '공간낭비'·'관리'에 동그라미와 화살표.",
      "1.2) 표 왼쪽에 세로 빨간 줄을 긋고 아래에 '페이지 부재 발생 언급 필요' 동그라미.",
      "2. 제목의 '종류'·'동작과정' 동그라미. LFU·LRU·FIFO·SCR 이름에 각각 동그라미와 왼쪽 세로 줄. LRU 특징 '최근 미사용 교체' 동그라미.",
      "2. 맨 아래 'FIFO 교체 성능향상 위해 Frame 늘려도 Hit 저하 발생'에서 '성능향상'·'Frame'·'Hit 저하 발생' 동그라미, 'ok'.",
      "3.1) 개념의 '성능향상 위해'·'Page 증가' 동그라미. Hit율 '40%'·'30%' 동그라미. 왼쪽 세로 줄.",
      "3.2) 제목 '해결방안' 동그라미. 'LFU'·'SCR' 동그라미, 왼쪽 세로 줄. 표 아래 빨간 글씨 '+Working Set, PFF'. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-pr-b-1.jpg", label: "1쪽 — 개념·사용하는 이유" },
      { src: "/answers/os-pr-b-2.jpg", label: "2쪽 — LFU·LRU·FIFO·SCR 동작과정" },
      { src: "/answers/os-pr-b-3.jpg", label: "3쪽 — FIFO Anomaly와 해결방안" },
    ],
  },
  {
    id: "peer-dx-darkfactory-1",
    period: "1교시",
    no: "1",
    question: "다크 팩토리(Dark Factory)에 대하여 설명하시오.",
    exam: "NS반 19기 1주차 모의고사(2026-09-06)",
    topicTitles: ["다크 팩토리(Dark Factory)", "스마트 팩토리"],
    // 점수는 시험지에 안 적혀 있다. 첨삭은 목차 옆의 '기술 목차' 세 곳뿐.
    maxScore: 10,
    feedback: [
      "답안 머리 위에 빨간 글씨로 '기술 목차'.",
      "II. 개념도 및 구성요소 제목 옆에 '기술목차'.",
      "가. 개념도 · 나. 구성 요소 제목 옆에도 '기술목차'.",
    ],
    pages: [
      { src: "/answers/dx-darkfactory-1.jpg", label: "1쪽 — 개요·개념도·구성요소" },
      { src: "/answers/dx-darkfactory-2.jpg", label: "2쪽 — 구성요소 표 계속·운영 사례" },
    ],
  },
  {
    id: "peer-os-ctx-01",
    period: "2교시",
    no: "",
    question: "① 문맥 유형 및 내용\n② 문맥교환 개념과 발생 시점\n③ 문맥교환 메커니즘\n④ 문맥교환 시 발생하는 문제점 및 해결 방안",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "프로세스 상태 전이도"],
    // 점수는 스캔에 안 잡혔다(문제지 상단이 잘림).
    maxScore: 25,
    feedback: [
      "문맥 유형(시스템·메모리·H/W) 표에 OK.",
      "상태 전이도 옆에 '기록성!'.",
      "메커니즘 도식(PCB 저장·복구 4단계)에 OK.",
    ],
    pages: [
      { src: "/answers/os-ctx-a-1.jpg", label: "10쪽" },
      { src: "/answers/os-ctx-a-2.jpg", label: "11쪽" },
      { src: "/answers/os-ctx-a-3.jpg", label: "12쪽" },
      { src: "/answers/os-ctx-a-4.jpg", label: "13쪽" },
    ],
  },
  {
    id: "peer-os-ctx-02",
    period: "2교시",
    no: "5",
    question: "① 문맥의 개념과 문맥의 유형 및 내용\n② 문맥교환 개념, 문맥교환 발생 시점\n③ 문맥교환 메커니즘",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "프로세스 상태 전이도"],
    score: 16.5,
    maxScore: 25,
    feedback: [
      "문맥 유형 표(시스템·메모리·HW 문맥)에 OK.",
      "문맥교환 개념도에 '다른 그림 대체' — 프로세스↔CPU 반환·복구 그림이 문맥교환을 못 보여 준다는 뜻.",
      "상태 전이도(Admit·Dispatch·Timeout·Sleep·Wake-up·Swap)에 OK, 메커니즘 도식에 큰 동그라미.",
    ],
    pages: [
      { src: "/answers/os-ctx-a-5.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-a-6.jpg", label: "2쪽" },
      { src: "/answers/os-ctx-a-7.jpg", label: "3쪽" },
      { src: "/answers/os-ctx-a-8.jpg", label: "4쪽" },
    ],
  },
  {
    id: "peer-os-ctx-03",
    period: "2교시",
    no: "1",
    question: "① 문맥 개념과 문맥 유형 및 내용\n② 문맥교환 개념과 발생 시점\n③ 문맥교환 메커니즘(Mechanism)\n④ 문맥교환 시 발생하는 문제점 및 해결 방안",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "프로세스 상태 전이도"],
    score: 15.5,
    maxScore: 25,
    feedback: [
      "정의에서 '일련의 정보', '저장 정보'에 동그라미 — 채점 키워드.",
      "메커니즘 도식의 가운데 열에 빨간 글씨로 '커널'.",
      "IV 문제점(성능 저하 곡선)과 해결 방안 Working Set·PFF 표에 good.",
    ],
    pages: [
      { src: "/answers/os-ctx-b-1.jpg", label: "7쪽" },
      { src: "/answers/os-ctx-b-2.jpg", label: "8쪽" },
      { src: "/answers/os-ctx-b-3.jpg", label: "9쪽" },
      { src: "/answers/os-ctx-b-4.jpg", label: "10쪽" },
    ],
  },
  {
    id: "peer-os-ctx-04",
    period: "1교시",
    no: "5",
    question: "문맥교환 절차와 PCB",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "PCB(Process Control Block)"],
    score: 5.7,
    maxScore: 10,
    feedback: [
      "절차 도식(PCB1 저장 → PCB2 복구 → PCB2 저장 → PCB1 복구)에 큰 동그라미.",
      "PCB 설명에 '7줄은 많아요.",
    ],
    pages: [
      { src: "/answers/os-ctx-c-1.jpg", label: "6쪽" },
      { src: "/answers/os-ctx-c-2.jpg", label: "7쪽" },
    ],
  },
  {
    id: "peer-os-ctx-05",
    period: "2교시",
    no: "2",
    question: "① 문맥교환 발생 시점\n② 문맥교환 과정",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "프로세스 상태 전이도"],
    score: 15.0,
    maxScore: 25,
    feedback: [
      "개요 정의의 '메커니즘'에 동그라미.",
      "상태 전이도(생성·준비·실행·대기·완료, Dispatch·Time Slicing·I/O·System call)에 큰 동그라미.",
      "발생 시점 4가지를 개념도 + 설명 표로, 과정을 9단계 주체별 표로 정리.",
    ],
    pages: [
      { src: "/answers/os-ctx-d-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-d-2.jpg", label: "2쪽" },
      { src: "/answers/os-ctx-d-3.jpg", label: "3쪽" },
    ],
  },
  {
    id: "peer-os-ctx-06",
    period: "1교시",
    no: "8",
    question: "문맥교환(Context Switching)",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "개념 → 절차도 → 절차 설명 표 → 상태 전이도 표시 순.",
      "절차도의 프로세스 대기 구간에 빨간 '점선' 표기.",
    ],
    pages: [
      { src: "/answers/os-ctx-e-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-e-2.jpg", label: "2쪽" },
    ],
  },
  {
    id: "peer-os-ctx-07",
    period: "1교시",
    no: "8",
    question: "문맥교환(Context Switching)",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "개념 한 줄 → 메커니즘 도식(Process A·운영체제 커널·Process B) → 프로세스 표 → 발생 시점 순.",
      "발생 시점을 Dispatch·Busy Waiting·Interrupt 셋으로 정리.",
    ],
    pages: [
      { src: "/answers/os-ctx-e-3.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-e-4.jpg", label: "2쪽" },
    ],
  },
  {
    id: "peer-os-ctx-08",
    period: "1교시",
    no: "8",
    question: "문맥교환(Context Switching)",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "개념 → 절차 도식(문맥교환 발생 지점 표시) → 절차 상세 6단계 표 → 문맥의 유형(HW·시스템·메모리) 순.",
      "절차 6단계를 '절차·주체·설명' 3열로.",
    ],
    pages: [
      { src: "/answers/os-ctx-e-5.jpg", label: "9쪽" },
      { src: "/answers/os-ctx-e-6.jpg", label: "10쪽" },
    ],
  },
  {
    id: "peer-os-ctx-09",
    period: "1교시",
    no: "8",
    question: "문맥교환(Context Switching)",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "개념 → 발생 상황(상태 전이도 + 표) → 처리 과정 도식 순.",
      "PCB1·PCB2 를 자료구조로 그리고 CPU 를 거쳐 저장·복구되는 흐름.",
    ],
    pages: [
      { src: "/answers/os-ctx-e-7.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-e-8.jpg", label: "2쪽" },
    ],
  },
  {
    id: "peer-os-ctx-10",
    period: "2교시",
    no: "5",
    question: "가. 문맥교환 절차 도식화, 설명\n나. 문맥교환 시 발생 오버헤드 해결 방법",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 16,
    maxScore: 25,
    feedback: [
      "정의의 '기존 프로세스 상태 보관·새 프로세스 상태 적재 절차'에 동그라미.",
      "절차 도식에 OK, '이 과정에서 CPU는 다른 프로세스 수행 못하므로 오버헤드가 필연적으로 발생' 문장에 good.",
      "SW적(다중프로그래밍 지양·경량 프로세스 활용)·HW적(스택포인터 레지스터·멀티코어 CPU) 해결에 OK. 끝에 '+α 더 고민하면 좋겠어'.",
    ],
    pages: [
      { src: "/answers/os-ctx-f-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-f-2.jpg", label: "2쪽" },
      { src: "/answers/os-ctx-f-3.jpg", label: "3쪽" },
    ],
  },
  {
    id: "peer-os-ctx-11",
    period: "2교시",
    no: "5",
    question: "① 문맥교환 절차 도식화\n② 문맥교환 시 발생 오버헤드 해결",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 16.0,
    maxScore: 25,
    feedback: [
      "필요성 표(dispatch·System Call·I/O·CPU 할당 만료)에 OK.",
      "절차 도식(P1·운영체제·P2, System Call → PCB 저장·복구 8단계)에 good.",
      "절차 상세 표에 OK, '잦은 문맥교환은 시스템 오버헤드 발생 시킴' 문장에 OK.",
      "구조 변경 측면 해결 방안(스택포인터 레지스터·스레드 구현)에 '다양한 구성 이해해 좋아요', 스레드 개념도에 물음표.",
    ],
    pages: [
      { src: "/answers/os-ctx-g-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-g-2.jpg", label: "2쪽" },
      { src: "/answers/os-ctx-g-3.jpg", label: "3쪽" },
    ],
  },
  {
    id: "peer-os-ctx-12",
    period: "1교시",
    no: "9",
    question: "문맥교환 절차와 PCB",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "PCB(Process Control Block)"],
    score: 6,
    maxScore: 10,
    feedback: [
      "정의 '하나의 프로세스가 실행, 인터럽트 등 발생 → PCB 저장 및 다른 프로세스 복원 실행 과정'에 밑줄·동그라미.",
      "절차 3단계 표와 PCB 구성요소(PID·레지스터·계정 정보)에 동그라미.",
      "2쪽 PCB 개념도(Stack·Data·Code, PID·Registers·Account·Memory Info)에 동그라미.",
    ],
    pages: [
      { src: "/answers/os-ctx-h-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-h-2.jpg", label: "2쪽" },
    ],
  },
  {
    id: "peer-os-ctx-13",
    period: "2교시",
    no: "4",
    question: "① 문맥교환 개념\n② 프로세스 상태 전이도 문맥교환 발생 시점\n③ 문맥교환 과정",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "프로세스 상태 전이도"],
    score: 16,
    maxScore: 25,
    feedback: [
      "개념도 옆에 '맞춤말 주의'.",
      "상태 전이도(중단된 준비·중단된 대기 포함) 와 발생 시점 4가지(Dispatch·Timeout·I/O·System Call)에 동그라미.",
      "과정 도식 8단계와 주체별 표에 동그라미, IV 시스템 저하 해결 방법(멀티 프로세싱·스케줄 관리)에 동그라미.",
    ],
    pages: [
      { src: "/answers/os-ctx-i-1.jpg", label: "1쪽" },
      { src: "/answers/os-ctx-i-2.jpg", label: "2쪽" },
      { src: "/answers/os-ctx-i-3.jpg", label: "3쪽" },
      { src: "/answers/os-ctx-i-4.jpg", label: "4쪽" },
    ],
  },
  {
    id: "peer-os-ctx-14",
    period: "1교시",
    no: "5",
    question: "문맥교환과 PCB",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)", "PCB(Process Control Block)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "절차 도식의 대기 구간 세 곳에 빨간 '점선'.",
      "PCB 설명은 개념·구성(코드·Data·Heap·Stack)·주요 기능·문맥교환과의 관계 순.",
    ],
    pages: [
      { src: "/answers/os-ctx-j-1.jpg", label: "9쪽" },
      { src: "/answers/os-ctx-j-2.jpg", label: "10쪽" },
    ],
  },
  {
    id: "peer-os-ctx-15",
    period: "2교시",
    no: "5",
    question: "① 문맥의 개념, 유형 및 내용\n② 문맥교환 절차\n③ 문맥교환 시 발생하는 오버헤드 해결 방법",
    exam: "NS반 모의고사",
    topicTitles: ["문맥교환(Context Switching)"],
    score: 15.5,
    maxScore: 25,
    feedback: [
      "문맥의 유형(시스템·HW·프로세스 문맥) 표에 OK.",
      "절차 개념도(OS 영역, Interrupt or sys.call)에 good, 절차 상세 9단계 표에 OK.",
      "오버헤드 해결을 '문맥교환 처리 측면'(최소화·유저모드·코루틴)과 '커널·스레드 활용 측면'으로 나눈 표에 OK.",
    ],
    pages: [
      { src: "/answers/os-ctx-k-1.jpg", label: "8쪽" },
      { src: "/answers/os-ctx-k-2.jpg", label: "9쪽" },
      { src: "/answers/os-ctx-k-3.jpg", label: "10쪽" },
    ],
  },
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
