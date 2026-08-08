/**
 * 심화반 커리큘럼 — 내가 직접 정하는 학습 계획.
 *
 * 자동 배정이 아니라 이 파일에 적은 대로만 배정된다.
 * 새 주차가 정해지면 WEEKS 배열에 주차를 추가하면 끝(코드 수정 불필요).
 *
 * days: 월~일 7칸. 각 칸은 학습일(topics) 또는 회독일(review) 또는 휴식(rest).
 * topicId: topics.json 의 id (연결되면 두음신공·설명 링크가 붙는다). 없으면 제목만 표시.
 */

/** 교재 Priority — ★★★=상, ★★=중, ★=하 */
export type Priority = "상" | "중" | "하";

export type CurriculumTopic = {
  title: string;
  topicId?: string;
  priority: Priority;
};

export type CurriculumDay =
  | { kind: "study"; label: string; topics: CurriculumTopic[] }
  | { kind: "review"; label: string; note: string }
  | { kind: "rest"; label: string; note: string }
  /** 학원 수업일 — 심화반 강의를 듣는 날. */
  | { kind: "class"; label: string; note: string }
  /** 아직 토픽을 안 정한 날 — 서브노트를 올리면 study 로 채운다. */
  | { kind: "open"; label: string; note: string };

export type CurriculumWeek = {
  /** 주차 시작일(월요일) — YYYY-MM-DD */
  start: string;
  title: string;
  /** 월·화·수·목·금·토·일 순서로 7개 */
  days: CurriculumDay[];
};

/**
 * 토픽 목록을 n일로 ★고르게★ 나눈다(교재 순서 유지). 남는 개수는 앞 날부터.
 */
function splitEvenly<T>(items: T[], n: number): T[][] {
  const out: T[][] = [];
  const base = Math.floor(items.length / n);
  const extra = items.length % n;
  let i = 0;
  for (let d = 0; d < n; d++) {
    const size = base + (d < extra ? 1 : 0);
    out.push(items.slice(i, i + size));
    i += size;
  }
  return out;
}

type Subject = { name: string; topics: CurriculumTopic[] };

/**
 * 학습일 배분 — ★과목은 절대 섞지 않는다.★
 * 한 주에 과목이 둘이면(OS+CA, PM+SE) 날짜를 과목별로 먼저 쪼개고,
 * 그 안에서만 고르게 나눈다. 과목을 섞어 버리면 하루에 OS와 CA가 뒤엉켜
 * 이미 공부한 범위와 새 범위가 구분되지 않는다.
 *
 * 날짜 배분은 토픽 수에 비례하되 과목마다 최소 1일은 보장한다.
 *   1주차 OS 32 / CA 21, 4일 → OS 2일(16·16), CA 2일(11·10)
 *   2주차 PM 33 / SE 96, 4일 → PM 1일(33), SE 3일(32·32·32)
 */
function studyDays(subjects: Subject[], totalDays = 4): CurriculumDay[] {
  const total = subjects.reduce((a, s) => a + s.topics.length, 0);
  // 비례 배분 후 최소 1일 보장, 남는 날은 토픽이 많은 과목부터.
  const alloc = subjects.map((s) => ({
    s,
    n: Math.max(1, Math.floor((s.topics.length / total) * totalDays)),
  }));
  let left = totalDays - alloc.reduce((a, x) => a + x.n, 0);
  while (left > 0) {
    // 하루당 토픽 수가 가장 많은(=제일 빡센) 과목에 하루씩 더 준다.
    alloc.sort((a, b) => b.s.topics.length / b.n - a.s.topics.length / a.n);
    alloc[0].n += 1;
    left--;
  }
  while (left < 0) {
    alloc.sort((a, b) => a.s.topics.length / a.n - b.s.topics.length / b.n);
    if (alloc[0].n > 1) alloc[0].n -= 1;
    left++;
  }
  // 원래 과목 순서대로 되돌려 날짜를 만든다.
  const byName = new Map(alloc.map((x) => [x.s.name, x.n]));
  const days: CurriculumDay[] = [];
  for (const sub of subjects) {
    const n = byName.get(sub.name) ?? 1;
    splitEvenly(sub.topics, n).forEach((topics, i) => {
      days.push({
        kind: "study",
        label:
          n === 1
            ? `${sub.name} 전체 · ${topics.length}개`
            : `${sub.name} ${i + 1}/${n} · ${topics[0].title.split(/[(（[]/)[0].trim()} 외 ${topics.length - 1}개`,
        topics,
      });
    });
  }
  return days;
}

// ── 1주차: 운영체제(OS) + 컴퓨터구조(CA) ──────────────────────────────
const OS_MEM: CurriculumTopic[] = [
  { title: "커널(Kernel)", topicId: "os-2", priority: "하" },
  { title: "CPU Ring Level", priority: "하" },
  { title: "기억장치 계층 구조(Memory Hierarchy)", topicId: "ca-51", priority: "중" },
  { title: "가상메모리 관리기법", topicId: "ca-55", priority: "상" },
  { title: "가상메모리의 페이징과 세그멘테이션", priority: "중" },
  { title: "직접 사상과 연관 사상 페이징 기법", topicId: "ca-87", priority: "중" },
  { title: "페이지 교체 알고리즘(Paging Replacement Algorithm)", topicId: "ca-84", priority: "중" },
  { title: "Belady's Anomaly(FIFO 이상현상)", topicId: "ca-90", priority: "중" },
  { title: "스레싱(Thrashing)", topicId: "os-75", priority: "상" },
  { title: "지역성(Locality)", topicId: "os-74", priority: "중" },
  { title: "단편화(Fragmentation)", topicId: "ca-58", priority: "중" },
];

const OS_PROC: CurriculumTopic[] = [
  { title: "스케줄러(Scheduler)", topicId: "os-23", priority: "하" },
  { title: "프로세스 상태 전이도", priority: "상" },
  { title: "CPU 스케줄링(CPU Scheduling)", priority: "중" },
  { title: "기한부(Deadline) 스케줄링", priority: "하" },
  { title: "문맥교환(Context Switching)", topicId: "os-47", priority: "상" },
  { title: "기아(Starvation)", topicId: "os-37", priority: "하" },
  { title: "인터럽트(Interrupt)", topicId: "os-63", priority: "상" },
  { title: "PCB(Process Control Block)", topicId: "os-48", priority: "중" },
  { title: "프로세스(Process)와 스레드(Thread) 비교", topicId: "os-53", priority: "중" },
  { title: "멀티 쓰레드(Multi-Thread)", topicId: "os-54", priority: "하" },
];

const OS_SYNC: CurriculumTopic[] = [
  { title: "경쟁조건(Race Condition) 해결 방안", topicId: "os-45", priority: "중" },
  { title: "세마포어(Semaphore)", topicId: "os-32", priority: "상" },
  { title: "우선순위 역전(Priority Inversion) 현상", topicId: "os-34", priority: "중" },
  { title: "프로세스간 통신(IPC)", topicId: "os-59", priority: "중" },
  { title: "교착상태(Deadlock)", topicId: "os-36", priority: "상" },
  { title: "자원할당 그래프(Resource Allocation Graph)", topicId: "os-39", priority: "중" },
  { title: "Banker's 알고리즘(은행가 알고리즘)", topicId: "os-41", priority: "중" },
  { title: "Wait-Die와 Wound-Wait", topicId: "os-38", priority: "하" },
  { title: "디스크 스케줄링(Disk Scheduling)", topicId: "os-24", priority: "하" },
  { title: "파일 시스템(유닉스 파일시스템)", topicId: "os-58", priority: "하" },
  { title: "유닉스의 inode", topicId: "os-57", priority: "하" },
];

const CA_ALL: CurriculumTopic[] = [
  { title: "CPU 처리과정", topicId: "ca-17", priority: "하" },
  { title: "CISC vs RISC", topicId: "ca-120", priority: "하" },
  { title: "Pipeline(파이프라인)", topicId: "ca-102", priority: "중" },
  { title: "Pipeline Hazard", topicId: "ca-106", priority: "중" },
  { title: "MMU(Memory Management Unit)", priority: "하" },
  { title: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)", topicId: "ca-78", priority: "하" },
  { title: "캐시 일관성(Cache Coherence)", topicId: "ca-77", priority: "중" },
  { title: "캐시 플러시(Cache Flush)", topicId: "ca-83", priority: "하" },
  { title: "캐시메모리의 쓰기정책(Write Policy)", topicId: "ca-76", priority: "하" },
  { title: "MESI", topicId: "ca-81", priority: "중" },
  { title: "메모리 인터리빙(Interleaving)", topicId: "ca-56", priority: "중" },
  { title: "메모리 단편화(Fragmentation)", priority: "상" },
  { title: "DMA(Direct Memory Access)", topicId: "ca-25", priority: "상" },
  { title: "I2C와 SPI", topicId: "ca-47", priority: "하" },
  { title: "HA(High Availability)", topicId: "ca-135", priority: "상" },
  { title: "결함허용 컴퓨터(FTS)", topicId: "ca-136", priority: "상" },
  { title: "워치독 타이머(WDT)", topicId: "os-81", priority: "중" },
  { title: "RAID", topicId: "ca-140", priority: "상" },
  { title: "이레이저 코딩(erasure coding)", priority: "하" },
  { title: "지능형 반도체", priority: "중" },
  { title: "TPU(Tensor Processing Unit)", topicId: "ca-22", priority: "상" },
];

// ── 2주차: 프로젝트 관리(PM) 33토픽 ───────────────────────────────────
const PM_PLAN: CurriculumTopic[] = [
  { title: "경제성 분석 기법", topicId: "gj-144", priority: "중" },
  { title: "프로젝트 관리 계획서", priority: "하" },
  { title: "범위관리", topicId: "pm-24", priority: "중" },
  { title: "요구사항 수집기법", topicId: "pm-25", priority: "상" },
  { title: "요구사항 명세서 SRS", priority: "중" },
  { title: "WBS (Work Breakdown Structure)", topicId: "pm-27", priority: "상" },
  { title: "Scope Creep vs Gold-Plating", topicId: "pm-30", priority: "중" },
  { title: "활동기간 산정기법", priority: "하" },
];

const PM_SCHEDULE: CurriculumTopic[] = [
  { title: "3점 산정", topicId: "pm-35", priority: "하" },
  { title: "CPM (Critical Path Management)", topicId: "pm-36", priority: "중" },
  { title: "CCM (Critical Chain Management)", topicId: "pm-37", priority: "중" },
  { title: "일정단축 기법", priority: "상" },
  { title: "EVM(Earned Value Management, 획득 가치 관리)", topicId: "pm-46", priority: "중" },
  { title: "품질통제도구, QC 7", topicId: "pm-50", priority: "중" },
  { title: "형상 관리", topicId: "pm-51", priority: "상" },
  { title: "SW 품질비용", priority: "하" },
];

const PM_TEAM: CurriculumTopic[] = [
  { title: "RACI 매트릭스", topicId: "pm-53", priority: "하" },
  { title: "자원 최적화", topicId: "pm-40", priority: "중" },
  { title: "동기부여 이론", topicId: "pm-55", priority: "중" },
  { title: "터크만 팀 개발 5단계", topicId: "pm-56", priority: "중" },
  { title: "갈등관리", priority: "중" },
  { title: "프로젝트 위험관리", topicId: "pm-59", priority: "중" },
  { title: "정성적 위험 분석", topicId: "pm-60", priority: "상" },
  { title: "정량적 위험 분석", topicId: "pm-62", priority: "상" },
];

const PM_AGILE: CurriculumTopic[] = [
  { title: "몬테카를로 시뮬레이션", priority: "중" },
  { title: "위험 대응", topicId: "pm-64", priority: "중" },
  { title: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)", topicId: "pm-14", priority: "하" },
  { title: "감리/PMO 비교표", topicId: "pm-90", priority: "상" },
  { title: "Agile 선언문과 12개 원칙", priority: "하" },
  { title: "스크럼 (SCRUM)", topicId: "pm-73", priority: "상" },
  { title: "번다운차트 (Burn Down Chart)", topicId: "pm-86", priority: "상" },
  { title: "XP (eXtreme Programming)", topicId: "pm-74", priority: "하" },
  { title: "린 (Lean) 방법론", topicId: "pm-77", priority: "하" },
];


// ── 2주차: 소프트웨어공학(SE) 96토픽 ─────────────────────────────────
// 교재 CONTENTS(96개판) 순서·Priority 그대로. 슬라이드는 받는 대로 채운다.
const SE_1: CurriculumTopic[] = [
  { title: "소프트웨어 개발 방법론", priority: "하" },
  { title: "소프트웨어 설계의 원리", priority: "하" },
  { title: "객체지향 프로그래밍 특징", topicId: "se-18", priority: "중" },
  { title: "다형성 (Polymorphism)", priority: "중" },
  { title: "객체지향 설계 원리", priority: "중" },
  { title: "데메테르의 법칙 (Law of Demeter)", topicId: "se-207", priority: "중" },
  { title: "Product Line", topicId: "se-28", priority: "중" },
  { title: "AOP (Aspect Oriented Programming)", priority: "하" },
  { title: "테일러링 (Tailoring)", priority: "상" },
  { title: "요구공학 (Requirements Engineering)", priority: "상" },
  { title: "페르소나 (Persona)", topicId: "se-34", priority: "하" },
  { title: "ISO/IEC/IEEE 42010:2022", priority: "하" },
  { title: "SW Architecture 구축 절차", priority: "상" },
  { title: "Clean Architecture", topicId: "se-67", priority: "하" },
  { title: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)", priority: "중" },
  { title: "유틸리티 트리 (Utility Tree)", priority: "하" },
  { title: "소프트웨어 품질 속성 시나리오", priority: "중" },
  { title: "소프트웨어 아키텍처 스타일", priority: "중" },
  { title: "SW Architecture 평가", topicId: "se-59", priority: "상" },
  { title: "CBAM(Cost Benefit Analysis Method)", priority: "상" },
  { title: "MVVM (Model, View, View Model)", priority: "상" },
  { title: "UML의 4+1 View Model", priority: "하" },
  { title: "UML (정적, 동적 다이어그램)", priority: "중" },
  { title: "클래스 다이어그램 (Class Diagram)", priority: "하" },
  { title: "유즈케이스 다이어그램", priority: "중" },
  { title: "상태 다이어그램 (State Diagram)", priority: "하" },
  { title: "시퀀스 다이어그램 (Sequence Diagram)", priority: "하" },
  { title: "Interaction overview diagram", topicId: "se-94", priority: "하" },
  { title: "MSA (Micro Service Architecture)", priority: "상" },
  { title: "API Gateway", topicId: "se-70", priority: "하" },
  { title: "디자인 패턴 (Design Pattern)", priority: "상" },
  { title: "싱글턴 패턴 (Singleton pattern)", priority: "하" },
];

const SE_2: CurriculumTopic[] = [
  { title: "SAGA패턴", priority: "상" },
  { title: "DDD (Domain Driven Design)", priority: "중" },
  { title: "Event Driven Architecture", priority: "중" },
  { title: "TDD (Test Driven Development)", priority: "중" },
  { title: "데브옵스 (DevOps)", priority: "상" },
  { title: "SRE (Site Reliability Engineering)", topicId: "se-141", priority: "중" },
  { title: "무중단 배포", priority: "중" },
  { title: "릴리즈 엔지니어링", priority: "하" },
  { title: "카오스 엔지니어링 (Chaos Engineering)", topicId: "se-144", priority: "하" },
  { title: "DevSecOps", topicId: "sec-341", priority: "상" },
  { title: "테스트 원리", topicId: "se-149", priority: "중" },
  { title: "리뷰(Review)", priority: "하" },
  { title: "블랙박스 테스트", topicId: "se-156", priority: "상" },
  { title: "화이트박스 테스트", topicId: "se-158", priority: "상" },
  { title: "코드 커버리지(Code Coverage)", priority: "중" },
  { title: "탐색적 테스트", priority: "중" },
  { title: "테스트 오라클", topicId: "se-163", priority: "하" },
  { title: "경험 기반 테스트", priority: "중" },
  { title: "위험 기반 테스트", topicId: "se-168", priority: "상" },
  { title: "뮤테이션 테스트 (Mutation Test)", priority: "하" },
  { title: "성능 테스트", topicId: "se-174", priority: "중" },
  { title: "퍼징 테스트 (Fuzzing Test)", priority: "하" },
  { title: "리그레이션(회귀, Regression) 테스트", priority: "하" },
  { title: "튜링 테스트", topicId: "se-181", priority: "하" },
  { title: "Keyword Driven Testing", priority: "중" },
  { title: "카오스 테스트 (Chaos Test)", topicId: "se-190", priority: "하" },
  { title: "Back to Back 테스트", priority: "하" },
  { title: "Test Process", topicId: "se-195", priority: "하" },
  { title: "ISO 29119", topicId: "se-196", priority: "상" },
  { title: "ISO 29119-11", priority: "상" },
  { title: "Test Exit Criteria", priority: "하" },
  { title: "Lehman의 Software 변화의 원리", priority: "중" },
];

const SE_3: CurriculumTopic[] = [
  { title: "3R", topicId: "se-208", priority: "중" },
  { title: "소프트웨어 리팩토링", topicId: "se-212", priority: "상" },
  { title: "유지보수", priority: "중" },
  { title: "ISO/IEC/IEEE 14764", priority: "중" },
  { title: "오픈소스 SW 보안위협", priority: "상" },
  { title: "오픈소스 거버넌스", priority: "상" },
  { title: "CMMI 3.0", priority: "하" },
  { title: "GS 인증", topicId: "se-229", priority: "하" },
  { title: "SP 인증", priority: "하" },
  { title: "ISO/IEC 25010:2023", priority: "중" },
  { title: "상용소프트웨어 품질성능 평가 시험", topicId: "se-230", priority: "중" },
  { title: "McCabe 회전 복잡도", priority: "중" },
  { title: "FTA (Fault Tree Analysis)", priority: "상" },
  { title: "FMEA (Failure Mode and Effects Analysis)", priority: "상" },
  { title: "HAZOP (Hazard and Operability Study)", priority: "상" },
  { title: "ETA (Event Tree Analysis)", priority: "상" },
  { title: "STPA (System-Theoretic Process Analysis)", priority: "상" },
  { title: "SW 규모산정", priority: "상" },
  { title: "Function Point", priority: "중" },
  { title: "SW 사업대가 ('25년 개정판)", priority: "중" },
  { title: "난독화", topicId: "se-296", priority: "중" },
  { title: "정보시스템 운영/유지보수 감리", priority: "상" },
  { title: "정보시스템 감리 의무 대상과 관점별 점검 기준", priority: "상" },
  { title: "공통감리 절차", priority: "상" },
  { title: "정보시스템 감리결과보고서 (구성, 보고사항)", priority: "상" },
  { title: "정보시스템 운영 성과관리", topicId: "se-203", priority: "상" },
  { title: "소프트웨어 안전 확보를 위한 지침", topicId: "se-52", priority: "상" },
  { title: "공공기관 정보화사업 예비타당성", priority: "하" },
  { title: "소프트웨어사업 영향평가", priority: "중" },
  { title: "상용 소프트웨어 직접구매 제도", priority: "하" },
  { title: "SBOM", priority: "상" },
  { title: "사용성 평가", priority: "중" },
];

const WEEK2_DAYS: CurriculumDay[] = studyDays([
  { name: "프로젝트 관리(PM)", topics: [...PM_PLAN, ...PM_SCHEDULE, ...PM_TEAM, ...PM_AGILE] },
  { name: "소프트웨어공학(SE)", topics: [...SE_1, ...SE_2, ...SE_3] },
]);

const STUDY_DAYS: CurriculumDay[] = studyDays([
  { name: "운영체제(OS)", topics: [...OS_MEM, ...OS_PROC, ...OS_SYNC] },
  { name: "컴퓨터구조(CA)", topics: CA_ALL },
]);


// ── 3주차: 인공지능(AI) 95토픽 ───────────────────────────────────────
// 교재 CONTENTS 순서·Priority 그대로. 슬라이드는 받는 대로 채운다.
const AI_ALL: CurriculumTopic[] = [
  { title: "머신러닝 학습방법", priority: "하" },
  { title: "전이학습(Transfer Learning)", topicId: "ai-119", priority: "상" },
  { title: "자기지도학습(Self-supervised Learning)", priority: "중" },
  { title: "연합학습(Federated Learning)", priority: "중" },
  { title: "머신 언러닝(Machine Unlearning)", topicId: "ai-198", priority: "중" },
  { title: "버티컬 AI(Vertical AI)", priority: "하" },
  { title: "Physical AI", priority: "중" },
  { title: "온디바이스 AI", priority: "하" },
  { title: "AEI(Artificial Emotional Intelligence)", priority: "하" },
  { title: "활성화함수(Activation Function)", priority: "중" },
  { title: "손실함수", priority: "중" },
  { title: "머신러닝 옵티마이저", priority: "중" },
  { title: "기울기 소실과 기울기 폭주", priority: "하" },
  { title: "오류 역전파(Backpropagation)", priority: "중" },
  { title: "Dropout", priority: "중" },
  { title: "정규화, 규제화, 표준화", priority: "중" },
  { title: "배치 정규화(Batch Normalization)", priority: "중" },
  { title: "지식 증류(Knowledge Distillation)", topicId: "ai-120", priority: "중" },
  { title: "데이터라벨링과 어노테이션", priority: "하" },
  { title: "서포트 벡터 머신 SVM(Support Vector Machine)", priority: "중" },
  { title: "K-평균 알고리즘", topicId: "db-194", priority: "중" },
  { title: "K-NN(Nearest Neighbor) Classification", priority: "중" },
  { title: "밀도기반 클러스터링(DBSCAN)", priority: "상" },
  { title: "거리 공식(Distance Formula)", priority: "하" },
  { title: "유사도(Similarity)", priority: "하" },
  { title: "앙상블 학습(Ensemble Learning)", priority: "상" },
  { title: "유전 알고리즘(Genetic Algorithm)", priority: "하" },
  { title: "차원 축소(Dimensionality Reduction)", priority: "상" },
  { title: "PCA(Principal Component Analysis)", priority: "중" },
  { title: "LDA(Linear Discriminant Analysis)", priority: "중" },
  { title: "SVD(Singular Value Decomposition)", priority: "중" },
  { title: "GAN(Generative Adversarial Network)", priority: "상" },
  { title: "VAE(Variational Autoencoder)", priority: "상" },
  { title: "자연어처리(NLP)", priority: "중" },
  { title: "트랜스포머(Transformer)", topicId: "ai-82", priority: "상" },
  { title: "어텐션 메커니즘(Attention Mechanism)", priority: "상" },
  { title: "초거대 언어 모델(Large Language Model)", priority: "하" },
  { title: "할루시네이션(Hallucination)", priority: "상" },
  { title: "RAG(Retrieval Augmented Generation)", priority: "상" },
  { title: "RIG(Retrieval Interleaved Generation)", topicId: "ai-102", priority: "중" },
  { title: "프롬프트 엔지니어링(Prompt Engineering)", priority: "중" },
  { title: "컨텍스트 엔지니어링(Context Engineering)", topicId: "ai-197", priority: "하" },
  { title: "파인 튜닝(Fine-tuning)", topicId: "ai-62", priority: "상" },
  { title: "프롬프트 튜닝(Prompt Tuning)", topicId: "ai-63", priority: "중" },
  { title: "랭체인(LangChain)", priority: "중" },
  { title: "LangGraph", topicId: "ai-151", priority: "중" },
  { title: "LAM(Large Action Model)", priority: "중" },
  { title: "대형개념모델(LCM, Large Concept Models)", priority: "중" },
  { title: "대규모 언어 모델(LLM) 성능 향상 기술", priority: "상" },
  { title: "PEFT(Parameter-Efficient Fine-Tuning)", priority: "중" },
  { title: "LoRA(Low-rank adaptation)", topicId: "ai-169", priority: "중" },
  { title: "MOE(Mixture of Experts)", priority: "중" },
  { title: "COT(Chain of Thought)", priority: "중" },
  { title: "테스트 타임 스케일링(Test-Time Scaling, TTS)", priority: "중" },
  { title: "MLPerf", priority: "중" },
  { title: "MLOps", priority: "중" },
  { title: "LLMOps", topicId: "ai-140", priority: "상" },
  { title: "AutoML", priority: "중" },
  { title: "Diffusion 모델", priority: "하" },
  { title: "클래스 불균형(Class Imbalance)", topicId: "ai-74", priority: "중" },
  { title: "혼동행렬(Confusion Matrix)", priority: "상" },
  { title: "편향", priority: "상" },
  { title: "컨셉 드리프트 & 데이터 드리프트", priority: "중" },
  { title: "인공지능 적대적 공격", priority: "상" },
  { title: "프롬프트 인젝션(Prompt Injection)", topicId: "sec-373", priority: "중" },
  { title: "딥페이크(Deepfake)", priority: "상" },
  { title: "AI TRiSM(AI Trust, Risk and Security Management)", priority: "상" },
  { title: "범용 인공지능 위험관리 프레임워크", topicId: "ai-174", priority: "중" },
  { title: "멀티모달(Multimodal) AI", topicId: "ai-5", priority: "중" },
  { title: "파운데이션 모델(Foundation Model)", priority: "중" },
  { title: "AI 시스템 테스트", priority: "상" },
  { title: "AI 레드팀(Red team) 테스트", priority: "상" },
  { title: "MCP(Model Context Protocol)", topicId: "sec-384", priority: "중" },
  { title: "MCP 보안취약점 및 대응방안", priority: "중" },
  { title: "바이브코딩(Vibe Coding)", priority: "중" },
  { title: "MAS(Multi Agent System)", topicId: "ai-177", priority: "중" },
  { title: "A2A(Agent2Agent) 프로토콜", priority: "중" },
  { title: "AI Agent", topicId: "ai-163", priority: "상" },
  { title: "에이전틱 AI(Agentic AI)", topicId: "ds-141", priority: "중" },
  { title: "AX(AI Transformation)", priority: "하" },
  { title: "인공지능 경영시스템(ISO 42001:2023)", priority: "중" },
  { title: "소버린 AI(Sovereign AI)", priority: "중" },
  { title: "합성 데이터(Synthetic Data)", topicId: "db-162", priority: "상" },
  { title: "AI Ready Data", priority: "상" },
  { title: "AI 신뢰성 인증", priority: "상" },
  { title: "공공부문 초거대AI 도입·활용 가이드라인 2.0(2025.04)", priority: "상" },
  { title: "생성형 인공지능 서비스 이용자 보호 가이드라인", topicId: "ai-175", priority: "상" },
  { title: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1", priority: "상" },
  { title: "인공지능(AI) 도입 사업비 산정 절차", priority: "중" },
  { title: "AI 기본법", topicId: "ai-157", priority: "상" },
  { title: "인공지능 생성물 워터마크 적용 기술", priority: "하" },
  { title: "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)", priority: "중" },
  { title: "생성형AI 데이터 품질관리 가이드 v2.0", priority: "중" },
  { title: "ISO/IEC TS 42119-2", priority: "중" },
  { title: "BrainBody LLM", priority: "하" },
];

/** 3주차 확률·통계(ST) — 교재 CONTENTS 19토픽 */
const ST_ALL: CurriculumTopic[] = [
  { title: "확률분포", priority: "중" },
  { title: "확률분포와 확률 밀도 함수", priority: "하" },
  { title: "정규분포(Normal Distribution)", priority: "중" },
  { title: "중심극한정리", priority: "하" },
  { title: "데이터 유형", priority: "하" },
  { title: "표본 추출", priority: "중" },
  { title: "왜도(skewness) & 첨도(kurtosis)", priority: "중" },
  { title: "이상치", priority: "중" },
  { title: "결측치", priority: "중" },
  { title: "시계열분석", priority: "중" },
  { title: "베이즈 정리 (Bayes's theorem)", priority: "중" },
  { title: "기술 통계(Descriptive statistics)", priority: "중" },
  { title: "추론 통계(Inferential Statistics)", priority: "중" },
  { title: "추정 이론(Estimation Theory)", priority: "상" },
  { title: "연관성 분석(association analysis) - 기초통계", priority: "하" },
  { title: "회귀분석(Regression Analysis)", priority: "상" },
  { title: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)", priority: "하" },
  { title: "통계적 가설검정 (Hypothesis Testing)", priority: "상" },
  { title: "ANOVA(Analysis of variance)", priority: "중" },
];

// 3주차는 인공지능 + 확률·통계 — 과목 경계를 지켜 각 과목 안에서만 균등 분배한다.
const WEEK3_DAYS: CurriculumDay[] = studyDays([
  { name: "인공지능(AI)", topics: AI_ALL },
  { name: "확률·통계(ST)", topics: ST_ALL },
]);


// ── 4주차: 자료구조(DS) 9토픽 + 알고리즘(AL) 18토픽 ──────────────────
const DS_ALL: CurriculumTopic[] = [
  { title: "선형 자료구조와 비선형 자료구조", priority: "상" },
  { title: "링크드 리스트(Linked List)", priority: "중" },
  { title: "Stack", priority: "상" },
  { title: "Queue", priority: "상" },
  { title: "이진 탐색 트리(Binary Search Tree)", priority: "상" },
  { title: "AVL 트리", priority: "중" },
  { title: "힙(Heap)", priority: "중" },
  { title: "B-Tree(Balanced Tree)", priority: "하" },
  { title: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)", priority: "하" },
];

const AL_ALL: CurriculumTopic[] = [
  { title: "알고리즘 성능평가", priority: "하" },
  { title: "빅오 표기법(O-Notation)", priority: "상" },
  { title: "퀵 정렬(Quick Sort)", priority: "중" },
  { title: "삽입 정렬(Insertion Sort)", priority: "하" },
  { title: "버블 정렬(Bubble Sort)", priority: "하" },
  { title: "병합 정렬(Merge Sort)", priority: "중" },
  { title: "해시 테이블", priority: "하" },
  { title: "해싱과 충돌해결방법", priority: "상" },
  { title: "동적 계획법(Dynamic Programming)", priority: "중" },
  { title: "그리디(탐욕) 알고리즘", priority: "하" },
  { title: "빔 탐색(Beam Search)", priority: "하" },
  { title: "허프만(Huffman) 코딩", priority: "중" },
  { title: "런랭스(Run Length) 코딩", priority: "중" },
  { title: "다익스트라(Dijkstra) 알고리즘", priority: "중" },
  { title: "TF-IDF(Term Frequency - Inverse Document Frequency)", priority: "중" },
  { title: "최소 신장 트리(MST, Minimum Spanning Tree)", priority: "상" },
  { title: "트리 순회(Tree Traversal)", priority: "중" },
  { title: "그래프 순회(Graph Traversal)", priority: "중" },
];

const NW_ALL: CurriculumTopic[] = [
  { title: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)", priority: "하" },
  { title: "PCM(Pulse-Code Modulation)", priority: "하" },
  { title: "QAM(Quadrature Amplitude Modulation)", priority: "하" },
  { title: "CSMA/CD", priority: "중" },
  { title: "CSMA/CA", priority: "중" },
  { title: "다중화(Multiplexing)", priority: "중" },
  { title: "서비스 프리미티브(Service Primitive)", priority: "중" },
  { title: "OSI 7 Layer (ISO 7498)", priority: "상" },
  { title: "HTTP/3", priority: "중" },
  { title: "TCP 연결의 설정 및 해제(Handshaking)", priority: "상" },
  { title: "TCP 혼잡제어", priority: "상" },
  { title: "TCP 와 UDP 비교", priority: "상" },
  { title: "Sliding Window & 네이글(Nagle's) 알고리즘", priority: "중" },
  { title: "IPv6", priority: "중" },
  { title: "IPv4와 IPv6 터널링", priority: "상" },
  { title: "DNS(Domain Name System)", priority: "중" },
  { title: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", priority: "상" },
  { title: "BGP(Border Gateway Protocol)", priority: "하" },
  { title: "FEC(Forward Error Correction) / BEC(Backward Error Correction)", priority: "상" },
  { title: "해밍코드(Hamming code)", priority: "중" },
  { title: "CRC(Cyclic Redundancy Check)", priority: "중" },
  { title: "QoS(Quality of Service)", priority: "상" },
  { title: "ARP(Address Resolution Protocol)", priority: "중" },
  { title: "RARP(Reverse Address Resolution Protocol)", priority: "중" },
  { title: "DHCP(Dynamic Host Configuration Protocol)", priority: "상" },
  { title: "SCTP(Stream Control Transmission Protocol)", priority: "중" },
  { title: "O-RAN", priority: "상" },
  { title: "C-RAN(Centralized / Cloud RAN)", priority: "하" },
  { title: "RAN(Radio Access Network) Sharing", priority: "하" },
  { title: "네트워크 슬라이싱", priority: "상" },
  { title: "5G 특화망", priority: "중" },
  { title: "NWDAF(Network Data Analytics Function)", priority: "중" },
  { title: "네트워크 지능", priority: "하" },
  { title: "6G", priority: "상" },
  { title: "디지털 트윈 네트워크(Digital Twin Network)", priority: "중" },
  { title: "비지상네트워크(NTN, Non-Terrestrial Networks)", priority: "상" },
  { title: "Wi-Fi 7 (IEEE 802.11be)", priority: "중" },
  { title: "Wi-Fi 8 (IEEE 802.11bn)", priority: "중" },
  { title: "Passive WiFi", priority: "하" },
  { title: "IoT Matter", priority: "하" },
  { title: "SDN(Software Defined Network)", priority: "상" },
  { title: "오픈플로우(OpenFlow)", priority: "상" },
  { title: "SD-WAN(Software Defined-Wide Area Network)", priority: "중" },
  { title: "SDR(Software Defined Radio)", priority: "중" },
  { title: "CDN(Contents Delivery Network)", priority: "상" },
  { title: "망 중립성(Network Neutrality)", priority: "중" },
  { title: "인텐트 기반 네트워킹(Intent-Based Networking)", priority: "중" },
  { title: "무선 충전 기술", priority: "중" },
];

// 4주차도 과목 경계 유지 — 자료구조/알고리즘을 섞지 않는다.
const WEEK4_DAYS: CurriculumDay[] = studyDays([
  { name: "자료구조(DS)", topics: DS_ALL },
  { name: "알고리즘(AL)", topics: AL_ALL },
  { name: "네트워크(NW)", topics: NW_ALL },
]);


// ── 5주차: 데이터베이스(DB) 56토픽 ────────────────────────────────────
const DB_ALL: CurriculumTopic[] = [
  { title: "트랜잭션", priority: "상" },
  { title: "Isolation Level(격리 레벨)", priority: "중" },
  { title: "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성", priority: "중" },
  { title: "데이터베이스 모델링", priority: "상" },
  { title: "데이터베이스 무결성", priority: "상" },
  { title: "릴레이션 키(key)", priority: "중" },
  { title: "엔티티(Entity)", priority: "하" },
  { title: "함수적 종속성(Functional Dependency)", priority: "중" },
  { title: "암스트롱 공리(Armstrong's Axioms)", priority: "중" },
  { title: "데이터베이스 정규화(Normalization)", priority: "상" },
  { title: "데이터베이스 반정규화(De-Normalization)", priority: "상" },
  { title: "연결함정(Connection Trap)", priority: "중" },
  { title: "관계대수(Relational Algebra)", priority: "하" },
  { title: "관계해석(Relational Calculus)", priority: "하" },
  { title: "DB 회복기법", priority: "상" },
  { title: "DB 동시성제어", priority: "상" },
  { title: "낙관적 검증(Validation) 기법", priority: "하" },
  { title: "MVCC(다중 버전 동시성 제어) 2가지 유형", priority: "하" },
  { title: "분산 DB", priority: "중" },
  { title: "2PC", priority: "하" },
  { title: "NoSQL", priority: "중" },
  { title: "NoSQL 데이터모델링 패턴", priority: "하" },
  { title: "CAP 이론과 BASE 이론", priority: "중" },
  { title: "PACELC", priority: "중" },
  { title: "NewSQL", priority: "하" },
  { title: "벡터 데이터베이스(Vector Database)", priority: "상" },
  { title: "ANN(Approximate Nearest Neighbor) 알고리즘", priority: "하" },
  { title: "SQL(Structured Query Language)", priority: "하" },
  { title: "조인(Join)", priority: "하" },
  { title: "RDBMS 인덱스(index)", priority: "하" },
  { title: "쿼리오프로딩(Query offloading)", priority: "하" },
  { title: "데이터베이스 파티셔닝(Partitioning)", priority: "중" },
  { title: "데이터베이스 샤딩(Sharding)", priority: "중" },
  { title: "데이터 표준화", priority: "중" },
  { title: "데이터 거버넌스, 데이터 품질", priority: "중" },
  { title: "데이터 품질관리(ISO 8000)", priority: "하" },
  { title: "데이터 전처리", priority: "중" },
  { title: "데이터 클렌징(Cleansing)", priority: "중" },
  { title: "데이터 프로파일링(Data Profiling)", priority: "중" },
  { title: "데이터 분석 거버넌스(Data Analytics Governance)", priority: "하" },
  { title: "데이터 분석 준비도와 데이터 분석 성숙도", priority: "중" },
  { title: "데이터 마이닝 방법론", priority: "중" },
  { title: "탐색적 데이터 분석과 확증적 데이터 분석", priority: "하" },
  { title: "데이터 시각화", priority: "중" },
  { title: "데이터 레이크하우스(Data Lakehouse)", priority: "중" },
  { title: "아파치 카프카", priority: "하" },
  { title: "공공데이터 예방적 품질관리 진단 가이드", priority: "하" },
  { title: "공공데이터 품질인증 매뉴얼(2025.07.)", priority: "중" },
  { title: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)", priority: "하" },
  { title: "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)", priority: "상" },
  { title: "데이터 가치 평가", priority: "중" },
  { title: "연관성 분석(association analysis) - 데이터마이닝", priority: "상" },
  { title: "Apriori 알고리즘", priority: "하" },
  { title: "DHP(Direct Hashing & Pruning) 알고리즘", priority: "하" },
  { title: "FP(Frequent Pattern)-Growth 알고리즘", priority: "하" },
  { title: "DaaP(Data as a product)", priority: "중" },
];

// 5주차 — 데이터베이스 단일 과목.
const WEEK5_DAYS: CurriculumDay[] = studyDays([
  { name: "데이터베이스(DB)", topics: DB_ALL },
]);

export const WEEKS: CurriculumWeek[] = [
  {
    // 심화반(9월) 전에 미리 도는 선행 학습 — 오늘부터 시작.
    // 새 서브노트를 올리면 해당 요일 topics 배열에 추가하면 된다.
    start: "2026-08-03",
    title: "선행 학습 · 심화반 1주차 미리 돌기",
    days: [
      ...STUDY_DAYS,
      { kind: "review", label: "회독", note: "이번 주 선행한 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 선행 2주차 — 프로젝트 관리
    start: "2026-08-10",
    title: "선행 학습 · 심화반 2주차 미리 돌기 (PM + 소프트웨어공학)",
    days: [
      ...WEEK2_DAYS,
      { kind: "review", label: "회독", note: "이번 주 선행한 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 선행 3주차 — 인공지능
    start: "2026-08-17",
    title: "선행 학습 · 심화반 3주차 미리 돌기 (인공지능 + 확률·통계)",
    days: [
      ...WEEK3_DAYS,
      { kind: "review", label: "회독", note: "이번 주 선행한 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // ★ 심화반 입과 — 9월 첫주(9/1이 포함된 주) 월요일. 확정.
    start: "2026-08-31",
    title: "심화반 1주차 · 운영체제(OS) + 컴퓨터구조(CA)",
    days: [
      ...STUDY_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 심화반 2주차 — 프로젝트 관리
    start: "2026-09-07",
    title: "심화반 2주차 · 프로젝트 관리(PM) + 소프트웨어공학(SE)",
    days: [
      ...WEEK2_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 심화반 3주차 — 인공지능 + 확률·통계
    start: "2026-09-14",
    title: "심화반 3주차 · 인공지능(AI) + 확률·통계(ST)",
    days: [
      ...WEEK3_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 선행 4주차 — 자료구조 + 알고리즘
    start: "2026-08-24",
    title: "선행 학습 · 심화반 4주차 미리 돌기 (자료구조 + 알고리즘 + 네트워크)",
    days: [
      ...WEEK4_DAYS,
      { kind: "review", label: "회독", note: "이번 주 선행한 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 심화반 4주차 — 자료구조 + 알고리즘
    start: "2026-09-21",
    title: "심화반 4주차 · 자료구조(DS) + 알고리즘(AL) + 네트워크(NW)",
    days: [
      ...WEEK4_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
  {
    // 심화반 5주차 — 데이터베이스
    start: "2026-09-28",
    title: "심화반 5주차 · 데이터베이스(DB)",
    days: [
      ...WEEK5_DAYS,
      { kind: "review", label: "회독", note: "이번 주 배운 토픽을 다시 돌립니다." },
      { kind: "review", label: "회독", note: "약한 토픽 위주로 한 번 더." },
      { kind: "class", label: "학원", note: "심화반 수업일 — 이번 주 선행한 내용을 강의로 확인합니다." },
    ],
  },
];

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

/**
 * 기준 시간대 — ★한국 시간 고정★.
 * 기기(폰·PC·해외)의 시간대에 따라 "오늘"이 달라지면 같은 계획인데도
 * 화면마다 오늘의 토픽이 달라진다. 그래서 항상 KST로 오늘을 계산한다.
 */
const TZ = "Asia/Seoul";

/** YYYY-MM-DD → 로컬 자정 Date (날짜 차이 계산용. 비교 대상끼리 같은 방식이면 안전) */
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 한국 시간 기준 오늘 날짜 문자열(YYYY-MM-DD) */
function todayStrKST(now: number): string {
  // en-CA 로케일은 YYYY-MM-DD 형식을 준다.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}

function startOfToday(now: number): Date {
  return parseDate(todayStrKST(now));
}

export type TodayPlan = {
  week: CurriculumWeek;
  /** 0=월 … 6=일 */
  dayIndex: number;
  dayName: string;
  day: CurriculumDay;
  /** 진짜 오늘인지. false 면 커리큘럼 밖이라 가장 가까운 학습일로 대신 채운 것. */
  isToday: boolean;
  /** 이 계획 칸의 날짜(YYYY-MM-DD) */
  date: string;
};

/** YYYY-MM-DD + n일 → YYYY-MM-DD */
function addDays(startISO: string, n: number): string {
  const d = parseDate(startISO);
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const p = (v: number) => String(v).padStart(2, "0");
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

/** 커리큘럼의 모든 칸을 날짜순으로 편다. */
function flatDays() {
  const out: { week: CurriculumWeek; dayIndex: number; date: string }[] = [];
  for (const week of WEEKS) {
    for (let i = 0; i < week.days.length; i++) {
      out.push({ week, dayIndex: i, date: addDays(week.start, i) });
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 오늘의 계획을 찾는다 — ★어디에서 보든 같은 결과★.
 *  - 기준은 항상 한국 시간(기기 시간대와 무관).
 *  - 오늘이 커리큘럼 밖이면 null 을 주지 않고, 가장 가까운 학습일로 고정해 준다
 *    (앞으로 올 학습일 우선, 없으면 마지막 학습일). isToday=false 로 표시된다.
 */
export function planForToday(now: number = Date.now()): TodayPlan | null {
  const todayStr = todayStrKST(now);
  const days = flatDays();

  const exact = days.find((d) => d.date === todayStr);
  if (exact) {
    return {
      week: exact.week,
      dayIndex: exact.dayIndex,
      dayName: DAY_NAMES[exact.dayIndex] ?? "",
      day: exact.week.days[exact.dayIndex],
      isToday: true,
      date: exact.date,
    };
  }

  // 커리큘럼 밖 — 가장 가까운 "학습일"로 고정한다(빈 화면 방지).
  const study = days.filter((d) => d.week.days[d.dayIndex].kind === "study");
  if (!study.length) return null;
  const pick = study.find((d) => d.date >= todayStr) ?? study[study.length - 1];
  return {
    week: pick.week,
    dayIndex: pick.dayIndex,
    dayName: DAY_NAMES[pick.dayIndex] ?? "",
    day: pick.week.days[pick.dayIndex],
    isToday: false,
    date: pick.date,
  };
}

// ── 달력 ────────────────────────────────────────────────────────────
export type CalendarCell = {
  /** YYYY-MM-DD. null 이면 달 시작 전/끝 이후의 빈 칸. */
  date: string | null;
  day: number;
  /** 이 날에 배정된 계획(없으면 undefined) */
  plan?: { week: CurriculumWeek; dayIndex: number; day: CurriculumDay };
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** YYYY-MM-DD 에 배정된 계획을 찾는다. */
export function planForDate(dateISO: string) {
  const target = parseDate(dateISO);
  for (const week of WEEKS) {
    const start = parseDate(week.start);
    const diff = Math.round((target.getTime() - start.getTime()) / 86400000);
    if (diff >= 0 && diff < week.days.length)
      return { week, dayIndex: diff, day: week.days[diff] };
  }
  return undefined;
}

/** 커리큘럼이 걸쳐 있는 달 목록(YYYY-MM) — 달력 탭에 쓴다. */
export function curriculumMonths(): string[] {
  const set = new Set<string>();
  for (const w of WEEKS) {
    const s = parseDate(w.start);
    for (let i = 0; i < w.days.length; i++) {
      const d = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i);
      set.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    }
  }
  return [...set].sort();
}

/** 월요일 시작 달력 그리드(6주 x 7일). */
export function monthGrid(ym: string): CalendarCell[] {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0).getDate();
  // JS: 0=일 → 월요일 시작으로 보정
  const lead = (first.getDay() + 6) % 7;
  const cells: CalendarCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ date: null, day: 0 });
  for (let d = 1; d <= lastDay; d++) {
    const date = iso(new Date(y, m - 1, d));
    cells.push({ date, day: d, plan: planForDate(date) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: 0 });
  return cells;
}

/** 오늘 날짜(YYYY-MM-DD) — 기기 시간대와 무관하게 한국 시간 기준. */
export function todayISO(now: number = Date.now()): string {
  return todayStrKST(now);
}

/** 커리큘럼에 들어 있는 모든 학습 토픽(회독 대상). */
export function allCurriculumTopics(): CurriculumTopic[] {
  const out: CurriculumTopic[] = [];
  for (const w of WEEKS)
    for (const d of w.days) if (d.kind === "study") out.push(...d.topics);
  return out;
}

// ── 학습 완료 체크(브라우저 저장) ──────────────────────────────
const DONE_KEY = "myroom:curriculum-done";

/**
 * 완료 체크의 저장 키. 주차별로 따로 센다 —
 * 선행 학습에서 체크한 토픽이 9월 심화반에서 이미 끝난 것으로 보이면 안 되므로.
 */
export function doneKey(weekStart: string, title: string): string {
  return `${weekStart}#${title}`;
}

export function loadDone(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DONE_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    // 예전(제목만) 키는 첫 주차 것으로 이관.
    const first = WEEKS[0]?.start ?? "";
    return new Set(arr.map((k) => (k.includes("#") ? k : doneKey(first, k))));
  } catch {
    return new Set();
  }
}

export function saveDone(done: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
  } catch {
    /* 저장 실패는 무시 */
  }
}
