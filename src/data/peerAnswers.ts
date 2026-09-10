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
    topicTitles: ["페이지 교체 알고리즘(Paging Replacement Algorithm)", "Belady's Anomaly(FIFO 이상현상)"],
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
    topicTitles: ["페이지 교체 알고리즘(Paging Replacement Algorithm)", "Belady's Anomaly(FIFO 이상현상)"],
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
    id: "peer-os-belady-1",
    period: "2교시",
    no: "6",
    question:
      "가상메모리 교체 알고리즘에서 다음을 참조 페이지 번호와 할당 프레임 수 기반으로 설명하시오.\n가. FIFO 알고리즘에서 Belady's Anomaly 설명 (참조 페이지 번호: 0 1 2 3 0 1 4 0 1 2 3 4, 할당 페이지 프레임 수: 3개→4개, 초기 페이지 프레임은 모두 비었음)\n나. Belady's Anomaly를 해결하기 위한 SCR(Second Chance Replacement) (참조 페이지 번호: 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2, 할당 페이지 프레임 수: 3개, FIFO Queue)",
    exam: "제92회 KPC 기술사 IMPACT 실전모의고사 (2019년 12월, 정보처리기술사)",
    topicTitles: ["Belady's Anomaly(FIFO 이상현상)", "페이지 교체 알고리즘(Paging Replacement Algorithm)"],
    score: 15,
    maxScore: 25,
    feedback: [
      "답안 제목 옆에 '15'.",
      "I.가 FIFO 이상현상 개념도에서 'Belady's Anomaly' 표시에 큰 동그라미, 그 아래 'OR'.",
      "I.나 FIFO 문제 풀이의 'PF: 9'·'PF: 10'에 동그라미, 오른쪽에 'ok'.",
      "II.가 SCR 정의의 '모든 참조 페이지에 0이란 초기값 설정 후 참조될 경우 1로 bit를 변경' 두 줄에 빨간 밑줄.",
      "II.나 SCR 문제 풀이 아래 'FIFO 이상현상 문제 해결'에 빨간 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-bel-a-1.jpg", label: "1쪽 — FIFO 이상현상 정의·개념도" },
      { src: "/answers/os-bel-a-2.jpg", label: "2쪽 — FIFO 문제 풀이·SCR 정의" },
      { src: "/answers/os-bel-a-3.jpg", label: "3쪽 — SCR 문제 풀이·해결방안" },
    ],
  },
  {
    id: "peer-os-belady-2",
    period: "1교시",
    no: "4",
    question: "FIFO Anomaly",
    exam: "ITPE 모의고사",
    topicTitles: ["Belady's Anomaly(FIFO 이상현상)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 4) 옆에 '6.5'.",
      "I. 개념 문장 왼쪽에 'OK'.",
      "II.가 3Frame 계산 표 왼쪽에 빨간 괄호와 'Good'. 표의 '(페이지부재율) PFF' 행에 동그라미 치고 '여기 맞나요?'.",
      "II.나 4Frame 계산 표 위에 '주의', 왼쪽에 빨간 괄호와 'Good'.",
      "2쪽 해결방안 개념도 왼쪽에 세로 빨간 줄, 'LRU, OPT'와 'Working-set'에 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-bel-b-1.jpg", label: "1쪽 — 개념·3Frame/4Frame 계산" },
      { src: "/answers/os-bel-b-2.jpg", label: "2쪽 — 해결방안" },
    ],
  },
  {
    id: "peer-os-belady-3",
    period: "2교시",
    no: "3",
    question: "페이지 교체 기법 중 FIFO 페이지 교체 기법에 대해 설명하고 이때 발생하는 FIFO 이상현상(FIFO Anomaly)에 대해 설명하시오.",
    exam: "제84회 KPC 기술사 IMPACT 실전모의고사 (2018년 10월, 컴퓨터시스템응용기술사)",
    topicTitles: ["Belady's Anomaly(FIFO 이상현상)", "페이지 교체 알고리즘(Paging Replacement Algorithm)"],
    // 답안 제목 옆 빨간 글씨는 '15'로 읽힌다.
    score: 15,
    maxScore: 25,
    feedback: [
      "답안 제목 옆에 빨간 글씨 '15'.",
      "2.가 FIFO 페이지 교체 기법 정의 아래 빨간 밑줄, 특징 표 ①②와 ③④ 사이에 빨간 사선. 2.나 동작 사례 왼쪽에 세로 빨간 줄.",
      "2쪽 동작 사례 표 옆 'ok'. 3.가 FIFO 이상현상 개념 제목 옆 'ok'.",
      "3.나 발생 사례 표의 '총 9회 fault'·'총 10회 fault'에 동그라미.",
      "3쪽 4. FIFO Anomaly 극복 위한 SCR 사례 제목 옆에 빨간 표시, 왼쪽에 세로 빨간 줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-bel-c-1.jpg", label: "1쪽 — 개념·FIFO 교체 기법" },
      { src: "/answers/os-bel-c-2.jpg", label: "2쪽 — 동작 사례·FIFO 이상현상 개념·발생 사례" },
      { src: "/answers/os-bel-c-3.jpg", label: "3쪽 — SCR 사례" },
    ],
  },
  {
    id: "peer-os-belady-4",
    period: "1교시",
    no: "4",
    question: "Belady's Anomaly",
    exam: "ITPE 모의고사",
    topicTitles: ["Belady's Anomaly(FIFO 이상현상)"],
    score: 6,
    maxScore: 10,
    feedback: [
      "문 4) 옆에 '6'.",
      "I. 개념 문장 왼쪽에 'ok'와 빨간 괄호.",
      "6쪽 III. 해결방안 개념도의 'LFU, OPT 등'·'WS, PFF' 아래 빨간 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-bel-d-1.jpg", label: "5쪽 — 개념·3개 Frame FIFO" },
      { src: "/answers/os-bel-d-2.jpg", label: "6쪽 — 4개 Frame FIFO·해결방안" },
    ],
  },
  {
    id: "peer-os-thrash-1",
    period: "1교시",
    question: "스레싱(Thrashing)",
    exam: "ITPE 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    score: 6,
    maxScore: 10,
    feedback: ["답) 옆에 '6.0'. 그 밖의 빨간 표시는 없다."],
    pages: [{ src: "/answers/os-thr-a-1.jpg", label: "10쪽" }],
  },
  {
    id: "peer-os-thrash-2",
    period: "1교시",
    question: "스레싱",
    exam: "ITPE 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문) 옆에 '6.3'. I. 개요의 정의 칸 전체에 큰 동그라미.",
      "3쪽 II.가 발생원인 표의 '부적절한 Page 교체기법'·'CPU 등 리소스 부족'·'과도한 멀티프로그래밍'에 각각 동그라미.",
      "II.나 해결방안 표의 Working Set 개념도와 PFF 개념도에 각각 큰 동그라미.",
      "III. 예방기법 표의 'Page 사이즈 조정'·'지역성 고려'·'페이지 Locking'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-thr-b-1.jpg", label: "2쪽 — 개요" },
      { src: "/answers/os-thr-b-2.jpg", label: "3쪽 — 발생원인·해결방안·예방기법" },
    ],
  },
  {
    id: "peer-os-thrash-3",
    period: "2교시",
    no: "5",
    question: "프로세스 스레싱(Thrashing)의 발생원인, 예방책",
    exam: "KPC 기술사 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    // 점수·빨간 첨삭이 없다. 마지막 쪽 아래 연필로 '20170413'.
    maxScore: 25,
    pages: [
      { src: "/answers/os-thr-c-1.jpg", label: "1쪽 — 개요·개념" },
      { src: "/answers/os-thr-c-2.jpg", label: "2쪽 — 발생원인·Working Set" },
      { src: "/answers/os-thr-c-3.jpg", label: "3쪽 — Working Set·PFF" },
    ],
  },
  {
    id: "peer-os-thrash-4",
    period: "1교시",
    no: "13",
    question: "스레싱(Thrashing)",
    exam: "ITPE TOP반 (멘토 유술사, 김민PE)",
    topicTitles: ["스레싱(Thrashing)"],
    score: 7,
    maxScore: 10,
    feedback: [
      "문 13) 옆에 '7'.",
      "I. 개념도의 'CPU 이용률'·'다중프로그래밍 정도'에 동그라미, 'ok'. 정의의 '멀티 프로세스 환경 하'·'CPU가 페이지 부재'·'다수 소모' 밑줄, '이상 현상' 동그라미.",
      "II.가 발생원인 표의 '리소스 부족'·'페이지 교체 부적절'·'과도한 멀티프로그래밍'에 동그라미, 특징 칸 밑줄. 표 왼쪽에 세로 빨간 줄.",
      "II.나 해결방안 표의 Working Set·PFF 이름과 개념도에 각각 큰 동그라미, '지역성 기반'·'프레임 조정'·'상한선 증가'·'하한선 감소' 밑줄.",
      "2쪽 예방방안 제목 '예방방안' 동그라미. '페이지'·'환경' 구분 동그라미, '2^n 페이지'·'역 페이지' 동그라미, '멀티 조정'·'SCR 사용' 밑줄, 특징 칸 밑줄.",
      "맨 아래 '다양한 기법 적용 통해 페이지 이상현상 해결' 밑줄, '끝'에 동그라미.",
    ],
    pages: [
      { src: "/answers/os-thr-d-1.jpg", label: "1쪽 — 정의·발생원인·해결방안" },
      { src: "/answers/os-thr-d-2.jpg", label: "2쪽 — 예방방안" },
    ],
  },
  {
    id: "peer-os-thrash-5",
    period: "1교시",
    no: "18",
    question: "스레싱 원인과 해결방안",
    exam: "ITPE 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 18) 옆에 '6.5'.",
      "I. 제목 'CPU 처리 성능 저하'에 빨간 밑줄.",
      "2쪽 제목 '해결 방안'에 밑줄. 구분 칸 '자원'·'구현'에 동그라미, '코드의 지역성 고려한'·'스케줄링' 밑줄.",
      "III. 마지막 줄 'CPU 종속'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-thr-f-1.jpg", label: "1쪽 — 개요·발생 원인" },
      { src: "/answers/os-thr-f-2.jpg", label: "2쪽 — 해결 방안·현업 대응" },
    ],
  },
  {
    id: "peer-os-thrash-6",
    period: "1교시",
    no: "13",
    question: "프로세스 스레싱",
    exam: "ITPE 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    score: 6.2,
    maxScore: 10,
    feedback: [
      "4쪽 상단에 '6.2'.",
      "I. 정의의 '멀티 프로세스 환경에서'·'잦은 페이지 교체로'에 밑줄과 동그라미. 개념도 세로축 '성능'에 동그라미, 'ok', 가로축 '다중화'에 동그라미.",
      "II.가 원인 표의 'H/W 부족'·'다중화 상승'·'처리규모 상승'·'지역성 미고려'에 동그라미, 왼쪽에 'ok'.",
      "II.나 해결방안 표의 'H/W 증설'에 동그라미. 5쪽 '규모 조정'·'예방' 왼쪽에 빨간 괄호.",
      "III. 제목 밑줄. Working Set의 '지역성 고려'에 동그라미, PFF 개념도의 '부재율'·'프레임'에 동그라미와 화살표. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-thr-g-1.jpg", label: "4쪽 — 개요·발생 원인·해결 방안" },
      { src: "/answers/os-thr-g-2.jpg", label: "5쪽 — 예방·Working Set·PFF" },
    ],
  },
  {
    id: "peer-os-thrash-7",
    period: "1교시",
    no: "8",
    question: "스레싱의 원인과 해결 방안",
    exam: "ITPE 모의고사",
    topicTitles: ["스레싱(Thrashing)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문 8) 옆에 '6.3'.",
      "I. 개념도 그래프 꼭대기에 동그라미. 정의의 '자원 사용이 원활치 않은 현상' 밑줄, 아래 줄 '메모리'·'디스크' 밑줄.",
      "II.가 원인 개념도 왼쪽에 빨간 괄호.",
      "2쪽 II.나 'Working Set 모델'·'PFF'·'TLS'에 동그라미.",
      "III. 인프라 관점 왼쪽에 세로 빨간 줄. '커널튜닝'·'파라미터 튜닝'·'스왑 크기'·'4k 이상의 큰 사이즈 페이징'·'HUGE Default' 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-thr-h-1.jpg", label: "1쪽 — 개요·원인" },
      { src: "/answers/os-thr-h-2.jpg", label: "2쪽 — 해결 방안·인프라 관점" },
    ],
  },
  {
    id: "peer-os-thrash-8",
    period: "2교시",
    no: "4",
    question: "프로세스 스레싱(Thrashing)에 대해 설명하시오.\n가. 스레싱의 발생과정\n나. 스레싱 예방책, Working Set과 PFF(Page Fault Frequency)",
    exam: "제88회 KPC 기술사 IMPACT 실전모의고사 (2019년 6월)",
    topicTitles: ["스레싱(Thrashing)"],
    score: 16,
    maxScore: 25,
    feedback: ["답안 제목 옆에 '16'. 그 밖의 빨간 표시는 없다."],
    pages: [
      { src: "/answers/os-thr-i-1.jpg", label: "1쪽 — 개념·발생과정" },
      { src: "/answers/os-thr-i-2.jpg", label: "2쪽 — 발생과정 상세·Working Set과 PFF 개념" },
      { src: "/answers/os-thr-i-3.jpg", label: "3쪽 — Working Set과 PFF 동작구조·고려사항" },
    ],
  },
  {
    id: "peer-os-frag-1",
    period: "1교시",
    no: "17",
    question: "메모리 단편화",
    exam: "NS반 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6,
    maxScore: 10,
    feedback: ["문 17) 옆에 '6'. 그 밖의 빨간 표시는 없다."],
    pages: [
      { src: "/answers/os-frag-a1-1.jpg", label: "2쪽 — 개념·유형" },
      { src: "/answers/os-frag-a1-2.jpg", label: "3쪽 — 해결 방안" },
    ],
  },
  {
    id: "peer-os-frag-2",
    period: "1교시",
    no: "1",
    question: "메모리 단편화",
    exam: "NS반 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6.5,
    maxScore: 10,
    feedback: ["문 1) 옆에 '6.5'. 그 밖의 빨간 표시는 없다."],
    pages: [
      { src: "/answers/os-frag-a2-1.jpg", label: "1쪽 — 개념·내부/외부 단편화" },
      { src: "/answers/os-frag-a2-2.jpg", label: "2쪽 — 해결방안" },
    ],
  },
  {
    id: "peer-os-frag-3",
    period: "1교시",
    no: "6",
    question: "가상메모리 단편화 발생원인, 해결방안",
    exam: "ITPE 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6,
    maxScore: 10,
    feedback: [
      "문 6) 옆에 '6'.",
      "I.가 내부 단편화 개념의 '고정크기'에 동그라미, '사용후 낭비되는' 밑줄. 개념도 옆 '페이징 분할'에 동그라미.",
      "6쪽 I.나 외부 단편화 개념도의 '가변크기 분할'·'세그멘테이션 분할'에 동그라미.",
      "왼쪽 여백에 체크 두 개, 'III'에 동그라미와 'II 단락 없어요'.",
      "III. 해결방안 표의 '공통'·'외부 단편화'·'내부 단편화' 구분 동그라미, '통합'·'압축'에 큰 동그라미, 'Buddy System'·'Slab Allocator' 동그라미.",
      "맨 아래 'Buddy System은 Chunked list 자료구조'·'Slab Allocator는 자주 사용하는 size로 우선 분할 후 외부 프로그램에 대한 특별할당' 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-frag-b-1.jpg", label: "5쪽 — 내부·외부 단편화" },
      { src: "/answers/os-frag-b-2.jpg", label: "6쪽 — 해결방안" },
    ],
  },
  {
    id: "peer-os-frag-4",
    period: "1교시",
    no: "13",
    question: "메모리 단편화 원인, 해결방안",
    exam: "ITPE 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6,
    maxScore: 10,
    feedback: [
      "문 13) 옆에 '6'. I. 개념 두 줄에 밑줄.",
      "II.가 원인 표 왼쪽에 빨간 괄호. 내부 단편화 개념도와 '고정크기', 외부 단편화의 '가변 분할' 설명에 동그라미.",
      "II.나 해결방안 표 왼쪽에 빨간 괄호, '집약'·'통합/압축'·'Memory Pool'에 동그라미.",
      "14쪽 '페이징'·'버디 메모리'·'세그멘테이션'·'Slab Allocator'에 동그라미, 왼쪽에 괄호. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-frag-c-1.jpg", label: "13쪽 — 개요·원인·해결방안" },
      { src: "/answers/os-frag-c-2.jpg", label: "14쪽 — 해결방안 계속" },
    ],
  },
  {
    id: "peer-os-frag-5",
    period: "1교시",
    question: "메모리 단편화",
    exam: "ITPE 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문) 옆에 '6.5'. I. 개요 정의 '현상' 옆에 빨간 글씨 '공백 축소'와 동그라미.",
      "3쪽 유형 표 위에 빨간 글씨로 '유형'·'개념도'·'원인' 열 이름. 원인 열의 'Page 기법·고정할당 인해 내부 Space 비효율 발생'과 'Segment·가변할당시·외부 Memory 공간이 더 큼'에 큰 동그라미.",
      "III. 해결방안 전체 왼쪽에 큰 빨간 괄호와 'ok'. 4쪽 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-frag-d-1.jpg", label: "2쪽 — 개요" },
      { src: "/answers/os-frag-d-2.jpg", label: "3쪽 — 유형·해결방안" },
      { src: "/answers/os-frag-d-3.jpg", label: "4쪽 — 해결방안 계속" },
    ],
  },
  {
    id: "peer-os-frag-6",
    period: "1교시",
    no: "3",
    question: "메모리 단편화 원인 및 해결방안",
    exam: "ITPE 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)"],
    score: 6.5,
    maxScore: 10,
    feedback: ["문 3) 옆에 '6.5'. 그 밖의 빨간 표시는 없다."],
    pages: [
      { src: "/answers/os-frag-e-1.jpg", label: "2쪽 — 정의·원인" },
      { src: "/answers/os-frag-e-2.jpg", label: "3쪽 — 원인 계속·해결 방안" },
    ],
  },
  {
    id: "peer-os-frag-7",
    period: "2교시",
    no: "6",
    question: "가상메모리\n① 관리기법\n② 단편화/해결방안",
    exam: "NS반 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)", "가상메모리 관리기법"],
    score: 15,
    maxScore: 25,
    feedback: [
      "문 6) 옆에 '15'.",
      "2.가 관리 기법 유형 개념도의 '할당'·'배치'·'인출'·'교체' 상자에 각각 동그라미.",
      "2.나 상세설명 표 왼쪽에 세로 빨간 줄. 'Paging 기법'·'Segmentation 기법'·'최초/최적/최악/순차 적합'·'요구 인출/On-Demand'·'Pre-Fetch 방식'·'FIFO/LFU/LRU'·'OPT/Random'·'SCR/NUR'에 동그라미, 옆에 '시간 빈도'·'예측'·'참조 비트'.",
      "3.가 개념 왼쪽에 'ok'. 개념도의 '가변분할(Segmentation)' 쪽에 동그라미, 개념 문장의 '적재불가'에 동그라미.",
      "3.나 Buddy Allocator 옆 '외부 단편화 해결', Slab Allocator 옆 '내부 단편화 해결', '통합·압축'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-frag-f-1.jpg", label: "1쪽 — 개요·관리 기법 유형" },
      { src: "/answers/os-frag-f-2.jpg", label: "2쪽 — 관리 기법 상세" },
      { src: "/answers/os-frag-f-3.jpg", label: "3쪽 — 단편화 개념·Buddy" },
      { src: "/answers/os-frag-f-4.jpg", label: "4쪽 — Slab·공통 해결" },
    ],
  },
  {
    id: "peer-os-frag-8",
    period: "2교시",
    no: "3",
    question: "① 가상 메모리 관리 기법\n② 가상 메모리 단편화 유형\n③ Buddy, Slab Allocator",
    exam: "ITPE 모의고사",
    topicTitles: ["단편화(Fragmentation)", "메모리 단편화(Fragmentation)", "가상메모리 관리기법"],
    // 점수가 스캔에 안 보인다(첫 쪽 위가 잘려 있다).
    maxScore: 25,
    feedback: [
      "I.가 개요 개념도의 '[관리 기법] 반입·배치·교환·할당' 부분에 큰 동그라미.",
      "5쪽 I.나 관리 기법 상세 표 왼쪽에 빨간 괄호와 'Good'. II.가 개념도의 '적재 X'에 동그라미, '외부 단편화' 밑줄.",
      "6쪽 II.나 '내부 단편화'·'외부 단편화' 구분에 동그라미. '① 통합 ② 압축 ③ 프리징 접근 ④ 버디 알고리즘' 밑줄.",
      "III. 왼쪽에 'Good'. '1/2 사이즈'·'1/2 씩'·개념도 '할당'·특징 '명령수 최적 재조합'에 동그라미, '1/2씩 분할 관리' 밑줄.",
      "7쪽 'Slab Allocator'·'Slab 할당 재구성'에 동그라미, 왼쪽 여백에 'Full / Free / Partial'.",
      "IV. '실무 적용 방안'·'Context Switch'에 동그라미, 절차 상자마다 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-frag-g-1.jpg", label: "4쪽 — 문제·관리 기법 개요" },
      { src: "/answers/os-frag-g-2.jpg", label: "5쪽 — 관리 기법 상세·단편화 개요" },
      { src: "/answers/os-frag-g-3.jpg", label: "6쪽 — 단편화 유형·Buddy 알고리즘" },
      { src: "/answers/os-frag-g-4.jpg", label: "7쪽 — Slab Allocator·실무 적용" },
    ],
  },
  {
    id: "peer-os-pstate-1",
    period: "1교시",
    no: "11",
    question: "CPU 스케줄링의 프로세스 상태 전이도",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스 상태 전이도", "CPU 스케줄링(CPU Scheduling)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문 11) 위에 '6.3'.",
      "I. 정의의 '프로세스가'·'과정을' 밑줄, '다이어그램'에 동그라미. II. 제목 '설명' 옆 'ok'.",
      "II.가 전이도의 '중기 스케줄링'·'장기 스케줄링'·'단기 스케줄링' 상자에 각각 동그라미.",
      "II.나 상세설명 표의 '생성→준비'·'중단된 준비/대기→준비/대기'·'중단된 대기→중단된 준비'에 동그라미. 2쪽 '준비→실행(Dispatch)'·'실행→준비(Time out)' 동그라미, 설명 열 왼쪽에 세로 빨간 줄.",
      "III. 문맥교환 발생시점 표 '설명' 옆 'ok', 왼쪽에 세로 빨간 줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-pst-a-1.jpg", label: "1쪽 — 정의·상태 전이도·상세설명" },
      { src: "/answers/os-pst-a-2.jpg", label: "2쪽 — 단기 스케줄링·문맥교환 발생시점 (아래는 다음 문제 워치독 타이머)" },
    ],
  },
  {
    id: "peer-os-pstate-2",
    period: "1교시",
    no: "5",
    question: "프로세스 상태 전이도",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스 상태 전이도"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 5) 위에 '6.5'.",
      "I. 정의의 '프로세스가 생성되어' 밑줄.",
      "II.가 전이도 위에 'Good', 전이도 전체(중단된 준비·중단된 대기~실행)에 큰 동그라미.",
      "II.나 표 '설명' 옆 'OK'. 프로세스 상태 '생성~종료' 다섯 개에 큰 동그라미, 'Dispatch·Time-Out'에 동그라미.",
      "8쪽 III. 문맥교환 발생시점 표의 '발생시점'·'상태 전이' 두 열에 큰 동그라미, 왼쪽 여백에 '2'와 화살표, 'X'. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-pst-b-1.jpg", label: "7쪽 — 정의·상태 전이도·상태 설명" },
      { src: "/answers/os-pst-b-2.jpg", label: "8쪽 — 전이 계속·문맥교환 발생시점" },
    ],
  },
  {
    id: "peer-os-pstate-3",
    period: "1교시",
    no: "5",
    question: "프로세스 상태 전이도",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스 상태 전이도"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 5) 옆에 '6.5'.",
      "II.나 상태 표 왼쪽에 'Good'. 5쪽 전이 표 왼쪽에 큰 빨간 괄호와 'Good'.",
      "답안 끝 '끝' 아래 빨간 표시.",
    ],
    pages: [
      { src: "/answers/os-pst-c-1.jpg", label: "4쪽 — 정의·전이 과정·상태 설명" },
      { src: "/answers/os-pst-c-2.jpg", label: "5쪽 — 전이 설명·문맥교환 해결방안" },
    ],
  },
  {
    id: "peer-os-pstate-4",
    period: "1교시",
    no: "5",
    question: "프로세스 상태 전이도",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스 상태 전이도"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 5) 옆에 '6.5'.",
      "9쪽 II.가 상태 표의 'Active'·'In-Active' 구분과 'Create/ready/running'에 동그라미, 'Suspend ready/Suspend Block' 설명 'Swap-out·작업 중지'에 동그라미.",
      "II.나 전이 표 전체(Dispatch~Swap-out)에 큰 동그라미. 답안 끝 '끝' 아래 빨간 글씨 '공백'.",
    ],
    pages: [
      { src: "/answers/os-pst-d-1.jpg", label: "8쪽 — 개요·Active/Inactive 전이도" },
      { src: "/answers/os-pst-d-2.jpg", label: "9쪽 — 상태 설명·전이 설명" },
    ],
  },
  {
    id: "peer-os-cpusched-1",
    period: "2교시",
    no: "4",
    question: "① CPU 스케줄링 기법 유형\n② 기아현상, 호위현상\n③ 에이징 기법",
    exam: "ITPE 모의고사",
    topicTitles: ["CPU 스케줄링(CPU Scheduling)"],
    score: 15.3,
    maxScore: 25,
    feedback: [
      "문 4) 옆에 '15.3'. I. 유형 표의 '선점형 스케줄링'·'비선점형 스케줄링'에 동그라미.",
      "8쪽 II.가 선점형 'Round Robin'·'SRT'·'MLQ'·'MLFQ', II.나 비선점형 'Priority'·'FCFS'·'SJF'·'HRN' 이름에 각각 동그라미.",
      "9쪽 III.가 기아현상 개념 문장과 P1~P3 개념도에 걸쳐 큰 동그라미, 발생원인 'Priority'·해결방안 'Aging 기법·HRN, MLFQ'에 동그라미.",
      "III.나 호위효과 개념 'FCFS 스케줄링 시 선행'과 작업A·작업B 평균 대기시간 계산에 큰 동그라미, 해결방안 'Priority·SJF·라운드로빈'과 설명 열에 동그라미.",
      "10쪽 IV.가 에이징 개념 문장과 개념도의 '선점형'·'프로세스 대기시간'에 동그라미. IV.나 적용 사례 왼쪽에 빨간 글씨 'HRN MLFQ 필요', 사례 Process A·B에 큰 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-cpu-a-1.jpg", label: "7쪽 — 개요·유형" },
      { src: "/answers/os-cpu-a-2.jpg", label: "8쪽 — 선점형·비선점형 기법" },
      { src: "/answers/os-cpu-a-3.jpg", label: "9쪽 — 기아현상·호위효과" },
      { src: "/answers/os-cpu-a-4.jpg", label: "10쪽 — 에이징 기법" },
    ],
  },
  {
    id: "peer-os-cpusched-2",
    period: "3교시",
    no: "6",
    question: "① SJF, HRN ② MLQ, MLFQ",
    exam: "119회 정보관리기술사",
    topicTitles: ["CPU 스케줄링(CPU Scheduling)"],
    // 점수·빨간 첨삭이 없는 모범답안. 형광펜은 작성자가 키워드에 친 것. 여백에 연필로 '119회 정보관리 3.6'.
    maxScore: 25,
    pages: [
      { src: "/answers/os-cpu-b-1.jpg", label: "1쪽 — 개요·SJF" },
      { src: "/answers/os-cpu-b-2.jpg", label: "2쪽 — HRN·MLQ 개념" },
      { src: "/answers/os-cpu-b-3.jpg", label: "3쪽 — MLQ·MLFQ" },
    ],
  },
  {
    id: "peer-os-cpusched-3",
    period: "1교시",
    no: "6",
    question: "CPU 스케줄링",
    exam: "ITPE 모의고사",
    topicTitles: ["CPU 스케줄링(CPU Scheduling)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "4쪽 위에 '6.5'.",
      "I. 정의의 '관리하기'에 동그라미, '선점 방식'·'비선점' 밑줄과 동그라미.",
      "II.가 선점 스케줄링 '개념도'·'정의' 왼쪽에 밑줄, 개념도 옆 'P2>P1 우선순위' 표시, 정의 'CPU에서 프로세스 수행 시' 밑줄. 종류 'RR(라운드 로빈)'·'SRT'·'MLQ'·'MLFQ'에 동그라미, MLQ 개념도의 'CPU' 동그라미, MLFQ 개념도 옆 '시간할당 8·16·32'.",
      "5쪽 II.나 '비선점 스케줄링' 제목과 '개념도'에 동그라미, 정의 '먼저 수행' 밑줄. 'FIFO'·'SJF(Shortest Job First)'·'HRN'·'종류'에 동그라미, HRN 계산방법 '(대기시간+서비스시간)/서비스시간'에 동그라미.",
      "맨 아래 '적절한 스케줄링 선정으로 CPU 활용성' 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-cpu-c-1.jpg", label: "4쪽 — 개념·선점 스케줄링" },
      { src: "/answers/os-cpu-c-2.jpg", label: "5쪽 — 비선점 스케줄링" },
    ],
  },
  {
    id: "peer-os-cpusched-4",
    period: "1교시",
    no: "10",
    question: "CPU 스케줄링",
    exam: "ITPE 모의고사",
    topicTitles: ["CPU 스케줄링(CPU Scheduling)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 10) 위에 '6.5'.",
      "I. 제목 '효율적 CPU 이용' 밑줄, 정의의 '장기, 중기, 단기'에 동그라미.",
      "II.가 개념도 왼쪽에 빨간 글씨 '가독성'. 개념도의 장기·중기·단기 화살표와 '생성'·'종료'에 동그라미.",
      "II.나 알고리즘 분류 표 왼쪽에 'ok'와 큰 괄호, '분류'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-cpu-d-1.jpg", label: "문제·점수" },
      { src: "/answers/os-cpu-d-2.jpg", label: "정의·개념도·알고리즘 분류" },
    ],
  },
  {
    id: "peer-os-cpusched-5",
    period: "1교시",
    no: "10",
    question: "CPU 스케줄링",
    exam: "ITPE 모의고사",
    topicTitles: ["CPU 스케줄링(CPU Scheduling)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문 10) 위에 '6.3'. I. 'CPU 처리 위한, 단기, 중기, 장기 스케줄링' 밑줄.",
      "8쪽 정의의 'Process의' 밑줄. II.가 상태 전이도 왼쪽에 빨간 글씨 '선점/비선점', '생성'에 동그라미. '스왑 인'·'스왑 아웃'·'중기 스케줄링'·'단기 스케줄링'에 동그라미, 전이도 아래 'ok'.",
      "II.나 상세 설명 표 왼쪽에 'ok'와 큰 괄호.",
    ],
    pages: [
      { src: "/answers/os-cpu-e-1.jpg", label: "7쪽 — 문제·개요" },
      { src: "/answers/os-cpu-e-2.jpg", label: "8쪽 — 상태 전이도·상세 설명" },
    ],
  },
  {
    id: "peer-os-starv-1",
    period: "1교시",
    no: "12",
    question: "호위효과, 기아상태",
    exam: "ITPE 모의고사",
    topicTitles: ["기아(Starvation)"],
    score: 6.1,
    maxScore: 10,
    feedback: [
      "문 12) 위에 '6.1'.",
      "4쪽 I. 호위효과 개념 오른쪽 'ok', '프로세스들의'·'대기가'에 동그라미. 발생 문제 개념도의 'P2 30초 대기 → 호위효과 발생'에 큰 동그라미.",
      "II. 기아상태 개념의 '낮은 우선순위'에 동그라미, 발생 문제 개념도의 '높은 우선순위 할당'에 동그라미, 발생 원인 'SJF·SRT' 옆 'ok'.",
      "5쪽 III. 해결방안 표 위에 '+2', 발생원인↔해결방안 교차 화살표에 큰 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-starv-a-1.jpg", label: "3쪽 — 문제·호위효과 설명" },
      { src: "/answers/os-starv-a-2.jpg", label: "4쪽 — 호위효과·기아상태" },
      { src: "/answers/os-starv-a-3.jpg", label: "5쪽 — 해결 방안" },
    ],
  },
  {
    id: "peer-os-starv-2",
    period: "1교시",
    no: "7",
    question: "호위효과와 기아상태",
    exam: "NS반 모의고사",
    topicTitles: ["기아(Starvation)"],
    score: 6,
    maxScore: 10,
    feedback: [
      "문 7) 옆에 '6'.",
      "I. 호위효과 개념 문장에 큰 동그라미. 특징 왼쪽에 빨간 괄호, 'HRN'에 취소선, 아래 빨간 글씨 '해결방법?'.",
      "10쪽 II. 기아상태 설명 왼쪽에 큰 괄호. III. 해결방안 왼쪽에 괄호, 맨 아래 빨간 글씨 '대안 스케줄링 기법 제시'. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-starv-b-1.jpg", label: "9쪽 — 호위효과 설명" },
      { src: "/answers/os-starv-b-2.jpg", label: "10쪽 — 기아상태·해결방안" },
    ],
  },
  {
    id: "peer-os-race-1",
    period: "2교시",
    no: "6",
    question: "① 경쟁조건\n② SW 측면 임계영역 제어 기법\n③ HW 측면 임계영역 제어 기법",
    exam: "ITPE 모의고사",
    topicTitles: ["경쟁조건(Race Condition) 해결 방안"],
    score: 15.3,
    maxScore: 25,
    feedback: [
      "문 6) 옆에 '15.3'. ① '경쟁조건'에 동그라미, ② '임계영역 제어 기법' 밑줄.",
      "I. 개념도의 '수행 순서 따라'에 동그라미, 'Result① ≠ Result②' 밑줄. 개념·발생원인 표 왼쪽에 큰 'OK', 개념 문장 '수행 순서에 따라'·'달라지는' 밑줄, 발생원인 '상호배제·점유/대기·비선점·환형대기'에 큰 동그라미. 'Deadlock 등의 치명적 오류' 밑줄.",
      "2쪽 위에 'Good!'. II.가 '데커드'·'피터슨'·'램포트'에 동그라미, 개념도의 '선행'·'후행'과 설명 '먼저'에 동그라미, 'Hybrid' 밑줄. II.나 '세마포어'·'뮤텍스' 이름과 개념도에 동그라미, 맨 아래 'RTOS 같은 Real-Time'에 큰 동그라미.",
      "3쪽 위에 'Good!'. III. 제목 옆 '개념도 및 상세설명' 동그라미. 개념도 'Test and Set'·'인터럽트 금지'·'Register Swap'에 동그라미. III.나 'Test & Set'·'인터럽트 금지' 이름과 제어 개념도에 큰 동그라미, 설명 'Register'·'접근'·'진입'·'인터럽트 금지 후'·'자원 활용' 밑줄.",
      "4쪽 IV. 실무 사례 제목 옆 'OK', 왼쪽에 큰 괄호, 마지막 줄 '세마포어 할당' 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-race-a-1.jpg", label: "1쪽 — 경쟁조건 개요·발생원인" },
      { src: "/answers/os-race-a-2.jpg", label: "2쪽 — SW 측면 제어 기법 (데커·피터슨·램포트·세마포어·뮤텍스)" },
      { src: "/answers/os-race-a-3.jpg", label: "3쪽 — HW 측면 제어 기법 (Test&Set·인터럽트 금지·Register Swap)" },
      { src: "/answers/os-race-a-4.jpg", label: "4쪽 — 실시간 OS 실무 사례" },
    ],
  },
  {
    id: "peer-os-race-2",
    period: "2교시",
    no: "6",
    question: "① 경쟁조건\n② SW 측면 임계영역 제어 기법\n③ HW 측면 임계영역 제어 기법",
    exam: "ITPE 모의고사",
    topicTitles: ["경쟁조건(Race Condition) 해결 방안"],
    // 점수는 스캔에 안 보인다(첫 쪽 위가 잘려 있다).
    maxScore: 25,
    feedback: [
      "I. 제목 '임계영역 제어'와 개념 문장 '특정 프로세스가 공유자원 사용 시'에 동그라미.",
      "5쪽 II.가 경쟁조건 개념 옆 'ok', 개념 문장 '임계영역 공유자원 동시에 접근 … 순서에 따라 결과값 상이'에 큰 동그라미. 개념도 오른쪽에 빨간 글씨 '다른 결과 발생'과 동그라미.",
      "6쪽 III.가 분류 트리의 '세마포어(S=A, P연산·V연산)'·'turn·Flag 변수'·'Lock·Unlock'에 동그라미. III.나 상세 표 왼쪽에 큰 괄호와 'ok', 'Flag, turn 변수 진입 여부'·'Lock 획득 시까지 순환'에 동그라미.",
      "7쪽 IV.나 'Compare & Swap'·'Test & Set'·'인터럽트 금지'에 동그라미, 상세 표 오른쪽에 세로 빨간 줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-race-b-1.jpg", label: "4쪽 — 문제·임계영역 제어 개념" },
      { src: "/answers/os-race-b-2.jpg", label: "5쪽 — 경쟁조건 개념·발생조건" },
      { src: "/answers/os-race-b-3.jpg", label: "6쪽 — SW 측면 제어 기법" },
      { src: "/answers/os-race-b-4.jpg", label: "7쪽 — HW 측면 제어 기법" },
    ],
  },
  {
    id: "peer-os-sem-1",
    period: "1교시",
    no: "8",
    question: "세마포어의 개념과 주요연산(P, V)",
    exam: "ITPE 모의고사",
    topicTitles: ["세마포어(Semaphore)"],
    score: 6.3,
    maxScore: 10,
    feedback: [
      "문 8) 옆에 '6.3'.",
      "I. 개념 문장 '멀티 프로세싱 환경에서 P,V 연산 기반 공유자원 임계영역 접근 제어하는 기법'부터 개념도의 P연산·V연산 상자, 필요성 '일관성 유지·자원사용 효율성'까지 이어지는 큰 동그라미.",
      "6쪽 II. P연산 설명 '임계영역 진입 여부 확인 후 진입 또는 대기'부터 매커니즘 표 '초기화·P연산·V연산'까지 큰 동그라미.",
      "III. S변수 값 표의 'S>0 / S≤0 / S≥0 / S<0'에 큰 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-sem-a-1.jpg", label: "5쪽 — 개념·개념도·필요성" },
      { src: "/answers/os-sem-a-2.jpg", label: "6쪽 — P·V 연산 설명·S변수 값에 따른 동작" },
    ],
  },
  {
    id: "peer-os-sem-2",
    period: "1교시",
    no: "4",
    question: "운영체제 동기화 기법 스핀락, 뮤텍스, 세마포어",
    exam: "ITPE 모의고사",
    topicTitles: ["세마포어(Semaphore)"],
    score: 6.2,
    maxScore: 10,
    feedback: [
      "문 4) 위에 '6.2'.",
      "I. 정의의 '둘 이상의 프로세스가'·'경쟁조건의' 밑줄, '동시 접근하는'·'수행하는 기법'에 동그라미.",
      "II.가 스핀락 정의 'busy-waiting'에 동그라미와 'Good', 개념도 왼쪽에 큰 괄호. 메커니즘 '① Spinlock 요청 ② 획득, 임계영역 진입'에 동그라미.",
      "II.나 뮤텍스 정의 'Locking 기반 상호배제'에 동그라미, '동시 공유 불가한' 밑줄. 메커니즘 '진입 시 Lock·진출 시 Unlock'에 동그라미.",
      "II.다 세마포어 정의 'S변수 제어로 임계영역 진입 제어하는'에 동그라미와 밑줄, 개념도 'S=S-1·임계영역·S=S+1'에 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-sem-b-1.jpg", label: "정의·스핀락 설명 (위는 앞 문제 문맥교환 끝)" },
      { src: "/answers/os-sem-b-2.jpg", label: "스핀락 개념도·뮤텍스·세마포어" },
      { src: "/answers/os-sem-b-3.jpg", label: "세마포어 메커니즘·끝 (아래는 다음 문제 캐시 일관성)" },
    ],
  },
  {
    id: "peer-os-sem-3",
    period: "1교시",
    no: "1",
    question: "세마포어, 모니터",
    exam: "122회 정보관리기술사 1교시 1번 (모범답안)",
    topicTitles: ["세마포어(Semaphore)"],
    // 점수·빨간 첨삭이 없는 형광펜 모범답안. 여백에 연필로 '122회 정보관리 1교시 1번, 98회 컴시응 1.11'.
    maxScore: 10,
    pages: [
      { src: "/answers/os-sem-c-1.jpg", label: "1쪽 — 세마포어·모니터 관계·세마포어 개념" },
      { src: "/answers/os-sem-c-2.jpg", label: "2쪽 — 모니터 개념·세마포어와 모니터 비교" },
    ],
  },
  {
    id: "peer-os-sem-4",
    period: "1교시",
    no: "1",
    question: "세마포어",
    exam: "KPC 모의고사 2012.5 (모범답안)",
    topicTitles: ["세마포어(Semaphore)"],
    // 점수·빨간 첨삭이 없는 형광펜 모범답안. 여백에 연필로 '모의(KPC 2012.5), 합숙 2020.1 D-3 14번, 병행 프로세스'.
    maxScore: 10,
    pages: [
      { src: "/answers/os-sem-d-1.jpg", label: "1쪽 — 개요·동작 원리·동작 설명" },
      { src: "/answers/os-sem-d-2.jpg", label: "2쪽 — P·V 연산·세마포어 유형" },
      { src: "/answers/os-sem-d-3.jpg", label: "3쪽 — 세마포어를 이용한 태스크 간 동기화" },
    ],
  },
  {
    id: "peer-os-sem-5",
    period: "1교시",
    no: "2",
    question: "뮤텍스, 세마포어, 스핀락",
    exam: "ITPE 모의고사",
    topicTitles: ["세마포어(Semaphore)"],
    score: 6.2,
    maxScore: 10,
    feedback: [
      "문 2) 옆에 '6.2'.",
      "I. 뮤텍스 개념 'Lock/Unlock 이용'에 동그라미, 메커니즘 개념도 왼쪽에 큰 괄호.",
      "II. 세마포어 개념 'P,V 함수'·'동시성 제어기법'에 동그라미, 메커니즘 개념도 'S≥2 이상시' 부분에 큰 동그라미, 구성 'P,V,S'에 동그라미.",
      "III. 스핀락 개념 'Spinning으로 락 대기' 밑줄. 11쪽 메커니즘 개념도 왼쪽에 큰 괄호, 구성 'Lock/Unlock·Spinning'에 동그라미.",
      "마지막 줄 '짧은 대기 시에 블로킹 없이 효율적 활용 가능' 밑줄, 아래 빨간 글씨 '+모니터'. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-sem-f1-1.jpg", label: "10쪽 — 뮤텍스·세마포어·스핀락 개념" },
      { src: "/answers/os-sem-f1-2.jpg", label: "11쪽 — 스핀락 메커니즘·구성" },
    ],
  },
  {
    id: "peer-os-sem-6",
    period: "1교시",
    no: "2",
    question: "뮤텍스, 세마포어, 스핀락",
    exam: "ITPE 모의고사",
    topicTitles: ["세마포어(Semaphore)"],
    score: 6.1,
    maxScore: 10,
    feedback: [
      "문 2) 옆에 '6.1'.",
      "I. 관계성 개념도의 '스핀락'·'세마포어'·'뮤텍스' 상자에 각각 동그라미, 'busy waiting 문제 개선'·'P,V 연산 속도 개선'에 동그라미.",
      "II.가 뮤텍스 제목 옆 빨간 글씨 'Lock, unlock'. 개념 '세마포어의 P,V 연산 속도 개선한' 밑줄, 특징 'Mutant·texture'에 동그라미.",
      "II.나 세마포어 개념 '스핀락의 busy waiting 문제 개선'·'P,V 연산'에 동그라미, 특징 'P연산·V연산'에 동그라미.",
      "6쪽 II.다 스핀락 개념 왼쪽에 큰 괄호, 유형 'busy waiting·Looping'에 동그라미, 마지막 줄 '모니터 존재' 밑줄. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-sem-f2-1.jpg", label: "5쪽 — 관계성·뮤텍스·세마포어" },
      { src: "/answers/os-sem-f2-2.jpg", label: "6쪽 — 스핀락" },
    ],
  },
  {
    id: "peer-os-sem-7",
    period: "1교시",
    no: "5",
    question: "세마포어의 개념, 주요연산(P연산, V연산)",
    exam: "ITPE 모의고사",
    topicTitles: ["세마포어(Semaphore)"],
    score: 6.3,
    maxScore: 10,
    feedback: ["문 5) 옆에 '6.3'. 그 밖의 빨간 표시는 없다. 1쪽만 있다."],
    pages: [{ src: "/answers/os-sem-g-1.jpg", label: "1쪽 — 개념·필요성·개념도·주요연산" }],
  },
  {
    id: "peer-os-pinv-1",
    period: "1교시",
    no: "9",
    question: "우선순위역전(Priority Inversion) 현상에 대하여 설명하시오.",
    exam: "제86회 KPC 기술사 IMPACT 실전모의고사 (2018년 12월, 정보관리기술사)",
    topicTitles: ["우선순위 역전(Priority Inversion) 현상"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 9) 옆에 '6.5'.",
      "I. 배경 '자원 상호배제와 프로세스 우선순위간 충돌'에 동그라미와 밑줄. 그 밖의 빨간 표시는 없다.",
    ],
    pages: [
      { src: "/answers/os-pinv-a-1.jpg", label: "1쪽 — 개념·배경·역전 현상 설명" },
      { src: "/answers/os-pinv-a-2.jpg", label: "2쪽 — 역전 과정·해결 방안" },
    ],
  },
  {
    id: "peer-os-pinv-2",
    period: "4교시",
    no: "2",
    question: "① 우선순위 역전 현상 설명",
    exam: "108회 컴퓨터시스템응용기술사 4교시 (모범답안)",
    topicTitles: ["우선순위 역전(Priority Inversion) 현상"],
    // 점수·빨간 첨삭이 없는 형광펜 모범답안. 여백에 연필로 '108회 컴시응 4교시, ITPE 1회 3교시'.
    maxScore: 25,
    pages: [
      { src: "/answers/os-pinv-b-1.jpg", label: "1쪽 — 원인·역전 현상 개념도" },
      { src: "/answers/os-pinv-b-2.jpg", label: "2쪽 — 동작 설명·우선순위 상속" },
      { src: "/answers/os-pinv-b-3.jpg", label: "3쪽 — 우선순위 올림·재귀적 상속" },
    ],
  },
  {
    id: "peer-os-pinv-3",
    period: "2교시",
    no: "1",
    question: "① 우선순위 역전 사례기반 설명\n② 우선순위 역전 해결 위한 2가지 기법 설명",
    exam: "ITPE 모의고사",
    topicTitles: ["우선순위 역전(Priority Inversion) 현상"],
    score: 15.5,
    maxScore: 25,
    feedback: [
      "문 1) 옆에 '15.5'.",
      "I. 관계도(우선순위 관리 실패→세마포어 미사용 프로세스 역전 발생→올림·상속)와 특징에 걸쳐 큰 동그라미.",
      "II.가 사례 개념도 표 왼쪽에 큰 동그라미. 2쪽 그래프의 '세마포어 사용'·'역전 구간'에 동그라미, 오른쪽에 빨간 글씨 '그림 어려워'.",
      "II.나 진행 설명 표 ①~⑥ 전체에 큰 동그라미.",
      "3쪽 III.가 우선순위 올림 개념도, III.나 우선순위 상속 개념도에 각각 큰 동그라미. 4쪽 IV. OS 병행제어 표 전체에 큰 동그라미. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-pinv-c-1.jpg", label: "1쪽 — 개요·관계도·사례 개념도" },
      { src: "/answers/os-pinv-c-2.jpg", label: "2쪽 — 사례 그래프·진행 설명" },
      { src: "/answers/os-pinv-c-3.jpg", label: "3쪽 — 우선순위 올림·상속" },
      { src: "/answers/os-pinv-c-4.jpg", label: "4쪽 — OS 병행제어 해결방법" },
    ],
  },
  {
    id: "peer-os-ipc-1",
    period: "1교시",
    no: "12",
    question: "IPC(Inter Process Communication)",
    exam: "제84회 KPC 기술사 IMPACT 실전모의고사 (2018년 10월, 정보관리기술사)",
    topicTitles: ["프로세스간 통신(IPC)"],
    score: 6.5,
    maxScore: 10,
    feedback: [
      "문 12) 옆에 '6.5'.",
      "II. 유형 표의 'Message Queue'·'Shared Memory'·'Pipe(Socket)' 이름에 각각 동그라미. 그 밖의 빨간 표시는 없다.",
    ],
    pages: [
      { src: "/answers/os-ipc-a-1.jpg", label: "1쪽 — 개념·유형 설명" },
      { src: "/answers/os-ipc-a-2.jpg", label: "2쪽 — IPC 기반 빅데이터 스트리밍 사례" },
    ],
  },
  {
    id: "peer-os-ipc-2",
    period: "2교시",
    no: "2",
    question: "IPC 설명",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스간 통신(IPC)"],
    score: 15,
    maxScore: 25,
    // 첨삭이 빨간 펜이 아니라 파란 펜이다.
    feedback: [
      "4쪽 문 2) 옆에 파란 글씨 '15.0'.",
      "I.가 개념도의 '공유 메모리·메시지 큐·세마포어' 위로 큰 파란 곡선.",
      "I.나 목적 표의 '동기화·자원공유·데이터 교환·모듈화/구조화 시스템 구축·클라이언트 서버 구조'에 이어지는 파란 동그라미.",
      "5쪽 II.가 메시지 전달 기법 왼쪽에 큰 파란 괄호. 7쪽 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-ipc-b-1.jpg", label: "4쪽 — 개념·목적" },
      { src: "/answers/os-ipc-b-2.jpg", label: "5쪽 — 메시지 전달·공유 메모리 기법" },
      { src: "/answers/os-ipc-b-3.jpg", label: "6쪽 — 세마포어 기법·충돌 해결(H/W)" },
      { src: "/answers/os-ipc-b-4.jpg", label: "7쪽 — 충돌 해결(S/W)" },
    ],
  },
  {
    id: "peer-os-ipc-3",
    period: "2교시",
    no: "2",
    question: "IPC",
    exam: "ITPE 모의고사",
    topicTitles: ["프로세스간 통신(IPC)"],
    score: 15,
    maxScore: 25,
    feedback: [
      "문 2) 옆에 '15.0'.",
      "I. 개념·역할 전체 왼쪽에 큰 곡선 괄호. 역할 표의 '자원 공유'·'자원 최적화'·'Application 모듈화 지원'에 체크.",
      "2쪽 II.가·나 왼쪽에 큰 괄호. 마지막 줄 '안정적인 IPC 구현 위해서는 동기화 기법 적용 필요'에 밑줄과 체크.",
      "3쪽 III. 제목의 '동기화 기법'에 동그라미, III.가·나 왼쪽에 큰 괄호. 답안 끝 '끝'.",
    ],
    pages: [
      { src: "/answers/os-ipc-c-1.jpg", label: "1쪽 — 개념·역할" },
      { src: "/answers/os-ipc-c-2.jpg", label: "2쪽 — 공유 메모리·메시지 전달 기반 구현 기법" },
      { src: "/answers/os-ipc-c-3.jpg", label: "3쪽 — OS·SW·HW 수준 동기화 기법" },
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
    id: "peer-os-ctx-16",
    period: "4교시",
    no: "6",
    question: "문맥교환(Context Switching)",
    exam: "110회 컴퓨터시스템응용기술사 4교시 2번 (모범답안)",
    topicTitles: ["문맥교환(Context Switching)"],
    // 점수·빨간 첨삭이 없는 형광펜 모범답안. 여백에 연필로 '110회(컴시응) 4.2 / KPC 모의 2016.10 컴시응 3.7 / KPC 2016.1 컴시응 7 / 2012.10 컴시응 1.7'.
    maxScore: 25,
    pages: [
      { src: "/answers/os-ctx-l-1.jpg", label: "1쪽 — 정의·문맥교환 메커니즘" },
      { src: "/answers/os-ctx-l-2.jpg", label: "2쪽 — 메커니즘 설명·오버헤드 해결방안" },
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
