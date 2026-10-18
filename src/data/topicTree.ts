/**
 * 토픽 지도 계층 — 과목 → 영역 → 분류 → 토픽 → 하위 토픽.
 *
 * 2026-10-17 "토픽지도 마인드맵 하이라키가 아직 정밀해 보이지 않는다" — 예전 지도는 영역을 교재 CONTENTS
 * 순서 구간(topicClusters)으로 잘라, 관계없는 토픽이 한 영역에 섞이고(OS 「프로세스·인터럽트」에 PCB·
 * 멀티 쓰레드) 하위 토픽이 다른 영역 상위 아래로 끌려가 빈 영역·자리표가 남았다(DB 「회복·동시성 제어」).
 * 이제 토픽을 뜻으로 묶어 과목마다 영역(3~7) → 분류(영역마다 1~5)에 두고, 진짜 종속(종류·구성·기법·
 * 문제·해결·확장·발전)만 하위 토픽으로 단다. 과목 토픽은 모두 정확히 한 번 나온다
 * (`npx tsx scripts/check-topic-tree.ts`).
 *
 * 영역·분류 이름과 관계는 학습 길잡이로 만든 것이라 교재 용어가 아니다 — 답안·서브노트에 쓰지 않는다.
 * 토픽 제목이 바뀌면 여기 제목도 같이 고친다.
 */
export type TopicRel = "종류" | "구성·기법" | "문제·해결" | "확장·발전";
export type TreeKid = { t: string; rel: TopicRel; why: string; kids?: TreeKid[] };
export type TreeItem = string | { t: string; kids: TreeKid[] };
export type TreeGroup = { name: string; items: TreeItem[] };
export type TreeArea = { name: string; groups: TreeGroup[] };

export const TOPIC_TREE: Record<string, TreeArea[]> = {
  CA: [
    { name: "CPU·명령어", groups: [
      { name: "명령어 처리", items: [
        "CPU 처리과정",
        "CISC vs RISC",
      ] },
      { name: "명령어 병렬처리", items: [
        { t: "Pipeline(파이프라인)", kids: [
          { t: "Pipeline Hazard", rel: "문제·해결", why: "명령어 의존성 충돌" },
        ] },
      ] },
    ] },
    { name: "메모리·캐시", groups: [
      { name: "주기억장치", items: [
        "MMU(Memory Management Unit)",
        "메모리 인터리빙(Interleaving)",
        "메모리 단편화(Fragmentation)",
      ] },
      { name: "캐시 메모리", items: [
        "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)",
        "캐시메모리의 쓰기정책(Write Policy)",
        "캐시 플러시(Cache Flush)",
        { t: "캐시 일관성(Cache Coherence)", kids: [
          { t: "MESI", rel: "구성·기법", why: "4상태 일관성 프로토콜" },
        ] },
      ] },
    ] },
    { name: "입출력·인터페이스", groups: [
      { name: "입출력 전송", items: [
        "DMA(Direct Memory Access)",
      ] },
      { name: "주변장치 통신", items: [
        "I2C(Inter Integrated Circuit)와 SPI(Serial Peripheral Interface)",
      ] },
      { name: "메모리 인터커넥트", items: [
        "CXL(Compute Express Link) 3.0",
      ] },
    ] },
    { name: "고가용성·결함허용", groups: [
      { name: "시스템 신뢰성", items: [
        { t: "결함허용 컴퓨터(FTS)", kids: [
          { t: "워치독 타이머(WDT, Watchdog timer)", rel: "구성·기법", why: "오작동 감시·리셋" },
        ] },
        "HA(High Availability)",
      ] },
      { name: "저장장치 다중화", items: [
        { t: "RAID (Redundant Array of Independent Disks)", kids: [
          { t: "이레이저 코딩(erasure coding)", rel: "확장·발전", why: "패리티 일반화·분산" },
        ] },
      ] },
    ] },
    { name: "AI 반도체", groups: [
      { name: "AI 연산 칩", items: [
        { t: "지능형 반도체", kids: [
          { t: "TPU (Tensor Processing Unit)", rel: "종류", why: "AI 행렬연산 전용칩" },
        ] },
      ] },
    ] },
  ],
  OS: [
    { name: "커널·시스템 구조", groups: [
      { name: "커널 구조", items: [
        "커널(Kernel)",
        "CPU Ring Level",
      ] },
      { name: "커널 진입", items: [
        "인터럽트(Interrupt)",
        "시스템 콜(System Call)",
      ] },
    ] },
    { name: "프로세스 관리", groups: [
      { name: "프로세스 구조", items: [
        "프로세스 상태 전이도",
        "PCB(Process Control Block)",
        { t: "문맥교환(Context Switching)", kids: [
          { t: "문맥(Context)", rel: "구성·기법", why: "저장·복원 대상 정보" },
        ] },
      ] },
      { name: "스레드", items: [
        "프로세스(Process)와 스레드(Thread) 비교",
        "멀티 쓰레드(Multi-Thread)",
      ] },
      { name: "CPU 스케줄링", items: [
        "스케줄러(Scheduler)",
        { t: "CPU 스케줄링(CPU Scheduling)", kids: [
          { t: "기한부(Deadline) 스케줄링", rel: "종류", why: "마감 기한 기반 실시간" },
          { t: "기아(Starvation)", rel: "문제·해결", why: "낮은 우선순위 무한대기" },
        ] },
      ] },
    ] },
    { name: "동기화·교착상태", groups: [
      { name: "프로세스 간 통신", items: [
        "프로세스간 통신(IPC)",
      ] },
      { name: "상호배제·동기화", items: [
        { t: "경쟁조건(Race Condition) 해결 방안", kids: [
          { t: "세마포어(Semaphore)", rel: "문제·해결", why: "상호배제 동기화 기법", kids: [
            { t: "우선순위 역전(Priority Inversion) 현상", rel: "문제·해결", why: "자원 점유로 순위 역전" },
          ] },
        ] },
      ] },
      { name: "교착상태", items: [
        { t: "교착상태(Deadlock)", kids: [
          { t: "자원할당 그래프(Resource Allocation Graph)", rel: "문제·해결", why: "사이클로 교착 탐지" },
          { t: "Banker's 알고리즘(은행가 알고리즘)", rel: "문제·해결", why: "안정상태 검사로 회피" },
        ] },
      ] },
    ] },
    { name: "메모리 관리", groups: [
      { name: "기억장치 구조", items: [
        "기억장치 계층 구조 (Memory Hierarchy)",
        "지역성(Locality)",
      ] },
      { name: "가상메모리", items: [
        { t: "가상메모리 관리기법", kids: [
          { t: "가상메모리의 페이징과 세그멘테이션", rel: "구성·기법", why: "고정·가변 블록 분할", kids: [
            { t: "직접 사상과 연관 사상 페이징 기법", rel: "구성·기법", why: "페이징 주소 변환" },
          ] },
          { t: "페이지 교체 알고리즘(Paging Replacement Algorithm)", rel: "구성·기법", why: "부재 시 교체 대상 선정", kids: [
            { t: "Belady's Anomaly(FIFO 이상현상)", rel: "문제·해결", why: "FIFO 프레임 증가 역효과" },
          ] },
          { t: "단편화(Fragmentation)", rel: "문제·해결", why: "할당 후 낭비 공간" },
          { t: "스레싱(Thrashing)", rel: "문제·해결", why: "과도한 페이지 교체" },
        ] },
      ] },
    ] },
    { name: "저장장치·파일", groups: [
      { name: "디스크 관리", items: [
        "디스크 스케줄링(Disk Scheduling)",
      ] },
      { name: "파일 시스템", items: [
        { t: "파일 시스템(유닉스 파일시스템)", kids: [
          { t: "유닉스의 inode", rel: "구성·기법", why: "파일 메타데이터 구조" },
        ] },
      ] },
    ] },
  ],
  SE: [
    { name: "방법론·DevOps", groups: [
      { name: "개발 방법론", items: [
        { t: "소프트웨어 개발 방법론", kids: [
          { t: "테일러링 (Tailoring)", rel: "구성·기법", why: "방법론을 프로젝트에 맞춤" },
          { t: "AI-DLC(AI-Driven SDLC)", rel: "종류", why: "AI 주도형 개발방법론" },
        ] },
        "Product Line",
      ] },
      { name: "테스트·명세 주도", items: [
        "TDD (Test Driven Development)",
        "SDD(Spec-Driven Development)",
      ] },
      { name: "DevOps·SRE", items: [
        { t: "데브옵스 (DevOps)", kids: [
          { t: "SRE (Site Reliability Engineering)", rel: "확장·발전", why: "DevOps의 구글식 구현" },
        ] },
        { t: "카오스 엔지니어링 (Chaos Engineering)", kids: [
          { t: "카오스 테스트 (Chaos Test)", rel: "구성·기법", why: "혼돈 주입 실험 수행" },
        ] },
      ] },
      { name: "릴리즈·배포", items: [
        { t: "릴리즈 엔지니어링", kids: [
          { t: "무중단 배포", rel: "구성·기법", why: "중단 없는 배포 기법" },
        ] },
      ] },
    ] },
    { name: "요구·설계", groups: [
      { name: "요구공학", items: [
        { t: "요구공학 (Requirements Engineering)", kids: [
          { t: "페르소나 (Persona)", rel: "구성·기법", why: "사용자 유형 분석 모형" },
        ] },
      ] },
      { name: "설계 원리·객체지향", items: [
        "소프트웨어 설계의 원리",
        { t: "객체지향 프로그래밍 특징", kids: [
          { t: "다형성 (Polymorphism)", rel: "구성·기법", why: "객체지향 특징의 하나" },
        ] },
        { t: "객체지향 설계 원리", kids: [
          { t: "데메테르의 법칙 (Law of Demeter)", rel: "종류", why: "결합도 낮추는 설계 원칙" },
        ] },
        { t: "디자인 패턴 (Design Pattern)", kids: [
          { t: "싱글턴 패턴 (Singleton pattern)", rel: "종류", why: "GoF 생성 패턴" },
        ] },
        "AOP (Aspect Oriented Programming)",
      ] },
      { name: "UML 모델링", items: [
        { t: "UML (정적, 동적 다이어그램)", kids: [
          { t: "클래스 다이어그램 (Class Diagram)", rel: "종류", why: "정적(구조) 다이어그램" },
          { t: "유즈케이스 다이어그램", rel: "종류", why: "동적 다이어그램" },
          { t: "상태 다이어그램 (State Diagram)", rel: "종류", why: "동적 다이어그램" },
          { t: "시퀀스 다이어그램 (Sequence Diagram)", rel: "종류", why: "동적 다이어그램" },
          { t: "Interaction overview diagram", rel: "종류", why: "활동+시퀀스 행위 다이어그램" },
        ] },
      ] },
    ] },
    { name: "SW 아키텍처", groups: [
      { name: "아키텍처 기술 표준", items: [
        "ISO/IEC/IEEE 42010:2022",
        "UML의 4+1 View Model",
      ] },
      { name: "구축·드라이버", items: [
        "SW Architecture 구축 절차",
        { t: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)", kids: [
          { t: "소프트웨어 품질 속성 시나리오", rel: "구성·기법", why: "품질 요구사항 구체화" },
        ] },
      ] },
      { name: "아키텍처 스타일", items: [
        { t: "소프트웨어 아키텍처 스타일", kids: [
          { t: "Clean Architecture", rel: "종류", why: "4계층 관심사 분리 구조" },
          { t: "MVVM (Model, View, View Model)", rel: "종류", why: "MVC 계열 표현 패턴" },
          { t: "Event Driven Architecture", rel: "종류", why: "이벤트 기반 스타일" },
        ] },
      ] },
      { name: "MSA·DDD", items: [
        { t: "MSA (Micro Service Architecture)", kids: [
          { t: "API Gateway", rel: "구성·기법", why: "MSA 진입점 구성요소" },
          { t: "SAGA패턴", rel: "구성·기법", why: "MSA 분산 트랜잭션 처리" },
        ] },
        { t: "DDD (Domain Driven Design)", kids: [
          { t: "이벤트 스토밍(Event Storming)과 헥사고날(Hexagonal) 아키텍처", rel: "구성·기법", why: "DDD 모델링·구현 기법" },
        ] },
      ] },
      { name: "아키텍처 평가", items: [
        { t: "SW Architecture 평가", kids: [
          { t: "유틸리티 트리 (Utility Tree)", rel: "구성·기법", why: "ATAM 품질 속성 트리" },
          { t: "CBAM(Cost Benefit Analysis Method)", rel: "종류", why: "비용·효용 기반 평가" },
        ] },
      ] },
    ] },
    { name: "테스트", groups: [
      { name: "테스트 기초", items: [
        "테스트 원리",
        "테스트 오라클",
      ] },
      { name: "프로세스·표준", items: [
        { t: "Test Process", kids: [
          { t: "Test Exit Criteria", rel: "구성·기법", why: "테스트 종료 판단 기준" },
        ] },
        { t: "ISO 29119", kids: [
          { t: "Keyword Driven Testing", rel: "구성·기법", why: "29119 Part 5 기법" },
          { t: "ISO 29119-11", rel: "확장·발전", why: "AI 시스템 테스트 지침" },
        ] },
      ] },
      { name: "테스트 설계 기법", items: [
        "리뷰(Review)",
        "블랙박스 테스트",
        { t: "화이트박스 테스트", kids: [
          { t: "코드 커버리지(Code Coverage)", rel: "구성·기법", why: "화이트박스 커버리지 지표" },
          { t: "McCabe 회전 복잡도", rel: "구성·기법", why: "기본 경로 복잡도 측정" },
        ] },
        { t: "경험 기반 테스트", kids: [
          { t: "탐색적 테스트", rel: "종류", why: "차터 기반 경험 테스트" },
        ] },
        "위험 기반 테스트",
        "뮤테이션 테스트 (Mutation Test)",
      ] },
      { name: "목적별 테스트", items: [
        "성능 테스트",
        "퍼징 테스트 (Fuzzing Test)",
        "리그레이션(회귀, Regression) 테스트",
        "Back to Back 테스트",
        "사용성 평가",
        "튜링 테스트",
      ] },
    ] },
    { name: "유지보수·품질", groups: [
      { name: "SW 진화·유지보수", items: [
        "Lehman의 Software 변화의 원리",
        { t: "유지보수", kids: [
          { t: "ISO/IEC/IEEE 14764", rel: "구성·기법", why: "유지보수 프로세스 표준" },
        ] },
      ] },
      { name: "재공학·리팩토링", items: [
        "3R",
        "소프트웨어 리팩토링",
      ] },
      { name: "제품 품질·인증", items: [
        "ISO/IEC 25010:2023",
        "GS 인증",
      ] },
      { name: "프로세스 품질", items: [
        "CMMI 3.0",
        "SP 인증",
      ] },
    ] },
    { name: "SW 안전·보안", groups: [
      { name: "안전 분석 기법", items: [
        "FTA (Fault Tree Analysis)",
        "ETA (Event Tree Analysis)",
        "FMEA (Failure Mode and Effects Analysis)",
        "HAZOP (Hazard and Operability Study)",
        "STPA (System-Theoretic Process Analysis)",
      ] },
      { name: "안전 관리 지침", items: [
        "소프트웨어 안전 확보를 위한 지침",
      ] },
      { name: "OSS·SW 보호", items: [
        { t: "오픈소스 SW 보안위협", kids: [
          { t: "오픈소스 거버넌스", rel: "문제·해결", why: "거버넌스로 위협 관리" },
          { t: "SBOM", rel: "문제·해결", why: "구성요소 명세로 추적" },
        ] },
        "난독화",
      ] },
    ] },
    { name: "SW 사업·감리", groups: [
      { name: "사업 기획·발주", items: [
        "공공기관 정보화사업 예비타당성",
        "소프트웨어사업 영향평가",
        { t: "상용 소프트웨어 직접구매 제도", kids: [
          { t: "상용소프트웨어 품질성능 평가 시험", rel: "구성·기법", why: "직접구매 대상 BMT" },
        ] },
      ] },
      { name: "규모·대가 산정", items: [
        { t: "SW 규모산정", kids: [
          { t: "Function Point", rel: "종류", why: "기능 기반 규모산정" },
        ] },
        "SW 사업대가 ('25년 개정판)",
      ] },
      { name: "감리·운영 성과", items: [
        { t: "정보시스템 감리 의무 대상과 관점별 점검 기준", kids: [
          { t: "공통감리 절차", rel: "구성·기법", why: "감리 수행 절차", kids: [
            { t: "정보시스템 감리결과보고서 (구성, 보고사항)", rel: "구성·기법", why: "감리 최종 산출물" },
          ] },
          { t: "정보시스템 운영/유지보수 감리", rel: "종류", why: "운영 단계 감리" },
          { t: "지능정보기술 감리 실무 가이드 - 클라우드 감리", rel: "종류", why: "클라우드 분야 감리" },
          { t: "지능정보기술 감리 실무 가이드 - 빅데이터 감리", rel: "종류", why: "빅데이터 분야 감리" },
        ] },
        "정보시스템 운영 성과관리",
      ] },
    ] },
  ],
  PM: [
    { name: "관리 체계·통합", groups: [
      { name: "관리 표준·원칙", items: [
        "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
      ] },
      { name: "착수·통합 계획", items: [
        "경제성 분석 기법",
        "프로젝트 관리 계획서",
      ] },
      { name: "관리 조직·감독", items: [
        "감리/PMO 비교표",
      ] },
    ] },
    { name: "범위 관리", groups: [
      { name: "범위 정의·통제", items: [
        { t: "범위관리", kids: [
          { t: "WBS (Work Breakdown Structure)", rel: "구성·기법", why: "범위 정의 산출물" },
          { t: "Scope Creep vs Gold-Plating", rel: "문제·해결", why: "범위 통제 실패 원인" },
        ] },
      ] },
      { name: "요구사항 정의", items: [
        "요구사항 수집기법",
        "요구사항 명세서 SRS",
      ] },
    ] },
    { name: "일정·원가 관리", groups: [
      { name: "활동기간 산정", items: [
        { t: "활동기간 산정기법", kids: [
          { t: "3점 산정", rel: "구성·기법", why: "낙관·비관·평균치 산정" },
        ] },
      ] },
      { name: "일정 개발·단축", items: [
        { t: "CPM (Critical Path Management)", kids: [
          { t: "CCM (Critical Chain Management)", rel: "확장·발전", why: "자원·버퍼 반영한 CPM" },
        ] },
        "일정단축 기법",
      ] },
      { name: "성과 측정", items: [
        "EVM(Earned Value Management, 획득 가치 관리)",
      ] },
    ] },
    { name: "품질·형상 관리", groups: [
      { name: "품질 관리", items: [
        "SW 품질비용",
        "품질통제도구, QC 7",
      ] },
      { name: "형상·변경 통제", items: [
        "형상 관리",
      ] },
    ] },
    { name: "자원·팀 관리", groups: [
      { name: "자원 계획·배분", items: [
        "RACI 매트릭스",
        "자원 최적화",
      ] },
      { name: "팀 개발·리더십", items: [
        "동기부여 이론",
        "터크만 팀 개발 5단계",
        "갈등관리",
      ] },
    ] },
    { name: "위험 관리", groups: [
      { name: "위험관리 프로세스", items: [
        { t: "프로젝트 위험관리", kids: [
          { t: "정성적 위험 분석", rel: "구성·기법", why: "확률·영향 우선순위화" },
          { t: "정량적 위험 분석", rel: "구성·기법", why: "영향 수치 분석", kids: [
            { t: "몬테카를로 시뮬레이션", rel: "구성·기법", why: "무작위 샘플링 도구" },
          ] },
          { t: "위험 대응", rel: "구성·기법", why: "식별 위험 대응 계획" },
        ] },
      ] },
    ] },
    { name: "애자일 방법론", groups: [
      { name: "애자일 가치·원칙", items: [
        "Agile 선언문과 12개 원칙",
      ] },
      { name: "대표 방법론", items: [
        { t: "스크럼 (SCRUM)", kids: [
          { t: "번다운차트 (Burn Down Chart)", rel: "구성·기법", why: "스프린트 진척 도구" },
        ] },
        "XP (eXtreme Programming)",
        "린 (Lean) 방법론",
      ] },
    ] },
  ],
  AI: [
    { name: "머신러닝·딥러닝", groups: [
      { name: "학습 방법", items: [
        { t: "머신러닝 학습방법", kids: [
          { t: "자기지도학습(Self-supervised Learning)", rel: "종류", why: "스스로 레이블 만드는 학습" },
          { t: "유전 알고리즘(Genetic Algorithm)", rel: "구성·기법", why: "진화학습 대표 알고리즘" },
        ] },
        "전이학습(Transfer Learning)",
        "연합학습(Federated Learning)",
        "머신 언러닝(Machine Unlearning)",
      ] },
      { name: "ML 알고리즘", items: [
        "거리 공식(Distance Formula)",
        "유사도(Similarity)",
        "서포트 벡터 머신 SVM(Support Vector Machine)",
        "K-NN(Nearest Neighbor) Classification",
        "앙상블 학습(Ensemble Learning)",
        "K-평균 알고리즘",
        "밀도기반 클러스터링(DBSCAN)",
      ] },
      { name: "차원 축소 기법", items: [
        { t: "차원 축소(Dimensionality Reduction)", kids: [
          { t: "PCA(Principal Component Analysis)", rel: "종류", why: "분산 최대 선형 축소" },
          { t: "LDA(Linear Discriminant Analysis)", rel: "종류", why: "클래스 분리 최대 축소" },
          { t: "SVD(Singular Value Decomposition)", rel: "종류", why: "행렬 분해 기반 축소" },
        ] },
      ] },
      { name: "신경망 학습 원리", items: [
        "활성화함수(Activation Function)",
        "손실함수(Loss Function)",
        "머신러닝 옵티마이저(Optimizer)",
        { t: "오류 역전파(Backpropagation)", kids: [
          { t: "기울기 소실과 기울기 폭주", rel: "문제·해결", why: "역전파 기울기 소실·발산", kids: [
            { t: "배치 정규화(Batch Normalization)", rel: "문제·해결", why: "분포 정규화로 소실 완화" },
          ] },
        ] },
      ] },
      { name: "일반화·경량화", items: [
        { t: "정규화, 규제화, 표준화", kids: [
          { t: "Dropout", rel: "종류", why: "노드 비활성화 규제 기법" },
        ] },
        "지식 증류(Knowledge Distillation)",
      ] },
    ] },
    { name: "생성형 AI 모델", groups: [
      { name: "생성 모델", items: [
        "GAN(Generative Adversarial Network)",
        "VAE(Variational Autoencoder)",
        "Diffusion 모델",
      ] },
      { name: "자연어·트랜스포머", items: [
        "자연어처리(NLP, Natural Language Processing)",
        { t: "트랜스포머(Transformer)", kids: [
          { t: "어텐션 메커니즘(Attention Mechanism)", rel: "구성·기법", why: "트랜스포머 핵심 메커니즘", kids: [
            { t: "페이지드 어텐션(Paged Attention)", rel: "확장·발전", why: "KV 캐시 페이징 관리" },
          ] },
        ] },
      ] },
      { name: "파운데이션·LLM", items: [
        { t: "파운데이션 모델(Foundation Model)", kids: [
          { t: "초거대 언어 모델(Large Language Model)", rel: "종류", why: "언어 분야 대표 기초 모델", kids: [
            { t: "MOE(Mixture of Experts)", rel: "구성·기법", why: "전문가 라우팅 구조" },
            { t: "LAM(Large Action Model)", rel: "확장·발전", why: "LLM에 행동 능력 결합" },
            { t: "대형개념모델(LCM, Large Concept Models)", rel: "확장·발전", why: "토큰 대신 개념 단위" },
          ] },
          { t: "월드 파운데이션 모델(World Foundation Model)", rel: "종류", why: "물리 세계 이해 기초 모델" },
        ] },
        { t: "버티컬 AI(Vertical AI)", kids: [
          { t: "도메인 특화 언어 모델(Domain-Specific Language Model)", rel: "구성·기법", why: "버티컬 AI 구현 언어 모델" },
        ] },
        "오픈웨이트(Open-weight) 모델",
      ] },
      { name: "멀티모달·피지컬", items: [
        { t: "멀티모달(Multimodal) AI", kids: [
          { t: "VLM(Vision Language Model)", rel: "종류", why: "비전+언어 멀티모달" },
          { t: "옴니모달(Omni-modal) AI", rel: "확장·발전", why: "전 모달리티 단일 통합" },
        ] },
        "정서 인공지능(Affective AI)",
        { t: "Physical AI", kids: [
          { t: "VLA(Vision-Language-Action) 모델", rel: "구성·기법", why: "피지컬 AI 핵심 모델" },
        ] },
        "온디바이스 AI",
      ] },
    ] },
    { name: "LLM 활용 기법", groups: [
      { name: "프롬프트·컨텍스트", items: [
        { t: "프롬프트 엔지니어링(Prompt Engineering)", kids: [
          { t: "COT(Chain of Thought)", rel: "구성·기법", why: "단계적 추론 유도 기법" },
          { t: "컨텍스트 엔지니어링(Context Engineering)", rel: "확장·발전", why: "프롬프트→맥락 설계", kids: [
            { t: "하네스 엔지니어링", rel: "확장·발전", why: "맥락→실행 환경 설계" },
          ] },
        ] },
      ] },
      { name: "미세조정", items: [
        { t: "파인 튜닝(Fine-tuning)", kids: [
          { t: "PEFT(Parameter-Efficient Fine-Tuning)", rel: "종류", why: "일부 파라미터만 튜닝", kids: [
            { t: "LoRA(Low-rank adaptation)", rel: "종류", why: "저랭크 행렬 대표 기법" },
            { t: "프롬프트 튜닝(Prompt Tuning)", rel: "종류", why: "모델 고정, 프롬프트 학습" },
          ] },
        ] },
      ] },
      { name: "환각·성능 향상", items: [
        { t: "할루시네이션(Hallucination)", kids: [
          { t: "검색 증강 생성(RAG, Retrieval Augmented Generation)", rel: "문제·해결", why: "외부 검색으로 환각 완화", kids: [
            { t: "검색 삽입 생성(RIG, Retrieval Interleaved Generation)", rel: "확장·발전", why: "생성 중 반복 검색" },
          ] },
        ] },
        "대규모 언어 모델(LLM) 성능 향상 기술",
      ] },
      { name: "추론 시간 확장", items: [
        { t: "테스트 타임 컴퓨팅(Test-Time Compute)", kids: [
          { t: "테스트 타임 스케일링(Test-Time Scaling, TTS)", rel: "구성·기법", why: "추론 연산량 조절 기법" },
        ] },
      ] },
    ] },
    { name: "AI 에이전트", groups: [
      { name: "에이전트 구조", items: [
        { t: "AI Agent", kids: [
          { t: "에이전틱 AI(Agentic AI)", rel: "확장·발전", why: "메모리·계획·도구로 자율" },
          { t: "BrainBody LLM", rel: "종류", why: "계층형 LLM 에이전트" },
        ] },
        "MAS(Multi Agent System)",
      ] },
      { name: "에이전트 프로토콜", items: [
        { t: "MCP(Model Context Protocol)", kids: [
          { t: "MCP 보안취약점 및 대응방안", rel: "문제·해결", why: "MCP 보안위협과 대응" },
        ] },
        "A2A(Agent2Agent) 프로토콜",
        "UCP와 ACP",
      ] },
      { name: "개발 프레임워크", items: [
        { t: "랭체인(LangChain)", kids: [
          { t: "LangGraph", rel: "확장·발전", why: "LangChain 기반 멀티에이전트" },
        ] },
        "바이브코딩(Vibe Coding)",
        "AI 네이티브 개발 플랫폼(AI-Native Development Platform)",
      ] },
    ] },
    { name: "데이터·MLOps", groups: [
      { name: "학습 데이터 구축", items: [
        "데이터라벨링과 어노테이션",
        "AI Ready Data",
        "합성 데이터(Synthetic Data)",
        "클래스 불균형(Class Imbalance)",
      ] },
      { name: "데이터 품질관리", items: [
        { t: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1", kids: [
          { t: "생성형AI 데이터 품질관리 가이드 v2.0", rel: "확장·발전", why: "생성형AI 데이터로 확장" },
        ] },
        "멀티모달 데이터의 품질검증 방법",
      ] },
      { name: "모델 평가·벤치마크", items: [
        "혼동행렬(Confusion Matrix)",
        "MLPerf",
      ] },
      { name: "ML 운영·인프라", items: [
        { t: "MLOps", kids: [
          { t: "LLMOps", rel: "확장·발전", why: "MLOps를 LLM 운영에 확장" },
        ] },
        "AutoML",
        "모델 드리프트(Model Drift) — 컨셉 드리프트 & 데이터 드리프트",
        "AI 슈퍼컴퓨팅 플랫폼(Supercomputing Platform)",
      ] },
    ] },
    { name: "AI 신뢰·보안", groups: [
      { name: "윤리·설명가능성", items: [
        "편향",
        "XAI(eXplainable AI) 방법론",
        "AI 신뢰성 인증",
      ] },
      { name: "AI 보안 위협", items: [
        { t: "인공지능 적대적 공격", kids: [
          { t: "프롬프트 인젝션(Prompt Injection)", rel: "종류", why: "LLM 대상 입력 조작 공격" },
        ] },
        { t: "딥페이크(Deepfake)", kids: [
          { t: "인공지능 생성물 워터마크 적용 기술", rel: "문제·해결", why: "생성물 표시로 식별" },
        ] },
        "AI BOM(Artificial Intelligence Bill of Materials)",
      ] },
      { name: "위험관리 체계", items: [
        "AI TRiSM(AI Trust, Risk and Security Management)",
        "범용 인공지능 위험관리 프레임워크",
        "ISO/IEC 23894",
        "AI RMF(AI Risk Management Framework)",
        "인공지능 경영시스템(ISO 42001:2023)",
      ] },
      { name: "AI 품질·테스트", items: [
        "튜링 테스트",
        { t: "AI 시스템 테스트", kids: [
          { t: "AI 레드팀(Red team) 테스트", rel: "종류", why: "적대적 탐색적 테스트" },
        ] },
        "ISO/IEC 42119-2",
        "ISO 29119-11",
        "ISO/IEC 25059:2023(AI 품질모델)",
      ] },
    ] },
    { name: "AI 정책·전략", groups: [
      { name: "AI 법제·가이드", items: [
        { t: "AI 기본법", kids: [
          { t: "인공지능 투명성 확보 가이드라인", rel: "구성·기법", why: "제31조 고지·표시 지침" },
          { t: "고영향 인공지능(AI) 판단 가이드라인", rel: "구성·기법", why: "고영향 AI 판단 지침" },
          { t: "인공지능 영향평가 가이드라인", rel: "구성·기법", why: "기본권 영향평가 지침" },
        ] },
        "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)",
        "생성형 인공지능 서비스 이용자 보호 가이드라인",
        "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)",
      ] },
      { name: "AX·도입 전략", items: [
        { t: "AX(AI Transformation)", kids: [
          { t: "공공 AX 전략", rel: "구성·기법", why: "공공부문 AX 추진 전략" },
        ] },
        "소버린 AI(Artificial Intelligence)",
        "인공지능(AI) 도입 사업비 산정 절차",
      ] },
    ] },
  ],
  ST: [
    { name: "확률 이론", groups: [
      { name: "확률 법칙", items: [
        "베이즈 정리(Bayes's theorem)",
      ] },
      { name: "확률분포", items: [
        { t: "확률분포", kids: [
          { t: "정규분포(Normal Distribution)", rel: "종류", why: "대표 연속확률분포" },
        ] },
        "확률분포와 확률 밀도 함수",
        "중심극한정리",
      ] },
    ] },
    { name: "데이터 분석 기초", groups: [
      { name: "데이터·표본", items: [
        "데이터 유형",
        "표본 추출(Sampling)",
      ] },
      { name: "요약 통계", items: [
        { t: "기술 통계(Descriptive statistics)", kids: [
          { t: "왜도(Skewness) & 첨도(Kurtosis)", rel: "구성·기법", why: "분포 형태 요약 지표" },
        ] },
      ] },
      { name: "데이터 전처리", items: [
        "이상치(Outlier)",
        "결측치(Missing Value)",
      ] },
    ] },
    { name: "통계적 추론", groups: [
      { name: "추정·가설검정", items: [
        { t: "추론 통계(Inferential Statistics)", kids: [
          { t: "추정 이론(Estimation Theory)", rel: "구성·기법", why: "표본으로 모수 추정" },
          { t: "통계적 가설검정(Hypothesis Testing)", rel: "구성·기법", why: "모집단 가설 검정 방법", kids: [
            { t: "ANOVA(Analysis of variance)", rel: "종류", why: "F검정 기반 평균차 검정" },
          ] },
        ] },
      ] },
    ] },
    { name: "관계·예측 모델", groups: [
      { name: "상관·회귀", items: [
        "연관성 분석(association analysis) - 기초통계",
        { t: "회귀분석(Regression Analysis)", kids: [
          { t: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)", rel: "구성·기법", why: "회귀 모델 선택 기준" },
        ] },
      ] },
      { name: "시계열 예측", items: [
        "시계열분석",
      ] },
    ] },
  ],
  NW: [
    { name: "통신 기초", groups: [
      { name: "계층 모델", items: [
        { t: "OSI 7 Layer (ISO 7498)", kids: [
          { t: "서비스 프리미티브(Service Primitive)", rel: "구성·기법", why: "OSI 계층 간 서비스 기본형식" },
        ] },
      ] },
      { name: "부호화·변조·다중화", items: [
        { t: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)", kids: [
          { t: "PCM(Pulse-Code Modulation)", rel: "구성·기법", why: "소스 코딩 파형 부호화 방식" },
        ] },
        "QAM(Quadrature Amplitude Modulation)",
        "다중화(Multiplexing)",
      ] },
    ] },
    { name: "데이터링크 계층", groups: [
      { name: "오류 제어", items: [
        { t: "FEC(Forward Error Correction) / BEC(Backward Error Correction)", kids: [
          { t: "해밍코드(Hamming code)", rel: "구성·기법", why: "FEC 대표 정정 코드" },
          { t: "CRC(Cyclic Redundancy Check)", rel: "구성·기법", why: "BEC 오류 검출 기법" },
        ] },
      ] },
      { name: "매체 접근 제어", items: [
        "CSMA/CD",
        "CSMA/CA",
      ] },
    ] },
    { name: "IP·라우팅", groups: [
      { name: "IP 주소체계", items: [
        { t: "IPv6", kids: [
          { t: "IPv4와 IPv6 터널링", rel: "문제·해결", why: "IPv4→IPv6 전환 기술" },
        ] },
      ] },
      { name: "주소·이름 해석", items: [
        "ARP(Address Resolution Protocol)",
        "RARP(Reverse Address Resolution Protocol)",
        "DHCP(Dynamic Host Configuration Protocol)",
        "DNS(Domain Name System)",
      ] },
      { name: "라우팅 프로토콜", items: [
        { t: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", kids: [
          { t: "BGP(Border Gateway Protocol)", rel: "종류", why: "AS 간 외부 라우팅 프로토콜" },
        ] },
      ] },
    ] },
    { name: "전송·응용 서비스", groups: [
      { name: "TCP·UDP", items: [
        "TCP 와 UDP 비교",
        "TCP 연결의 설정 및 해제(Handshaking)",
        "Sliding Window & 네이글(Nagle's) 알고리즘",
        "TCP 혼잡제어",
      ] },
      { name: "차세대 전송 프로토콜", items: [
        "SCTP(Stream Control Transmission Protocol)",
        "HTTP/3",
      ] },
      { name: "트래픽 관리", items: [
        "QoS(Quality of Service)",
        "CDN(Contents Delivery Network)",
        "망 중립성(Network Neutrality)",
      ] },
    ] },
    { name: "SDN·지능형 망", groups: [
      { name: "소프트웨어 정의망", items: [
        { t: "SDN(Software Defined Network)", kids: [
          { t: "오픈플로우(OpenFlow)", rel: "구성·기법", why: "SDN 컨트롤러-장치 인터페이스" },
          { t: "SD-WAN(Software Defined-Wide Area Network)", rel: "확장·발전", why: "SDN을 WAN으로 확장 적용" },
        ] },
      ] },
      { name: "지능형 네트워크", items: [
        { t: "네트워크 지능", kids: [
          { t: "NWDAF(Network Data Analytics Function)", rel: "구성·기법", why: "AI 네트워크 분석 표준 기능" },
          { t: "인텐트 기반 네트워킹(Intent-Based Networking)", rel: "구성·기법", why: "의도 기반 자율 운용 기법" },
        ] },
        "디지털 트윈 네트워크(Digital Twin Network)",
      ] },
    ] },
    { name: "5G·6G 이동통신", groups: [
      { name: "무선 접속망(RAN)", items: [
        { t: "C-RAN(Centralized / Cloud RAN)", kids: [
          { t: "O-RAN", rel: "확장·발전", why: "C-RAN에 개방·가상화 더함" },
        ] },
        "RAN(Radio Access Network) Sharing",
      ] },
      { name: "5G 네트워크", items: [
        "네트워크 슬라이싱",
        "5G 특화망",
        "비지상네트워크(NTN, Non-Terrestrial Networks)",
      ] },
      { name: "6G·미래 전략", items: [
        { t: "6G", kids: [
          { t: "ISAC(Integrated Sensing and Communication)", rel: "구성·기법", why: "6G 통신·센싱 융합 기술" },
        ] },
        "Hyper-AI 네트워크",
      ] },
    ] },
    { name: "무선 LAN·IoT", groups: [
      { name: "무선 LAN", items: [
        { t: "Wi-Fi 7(IEEE 802.11be)", kids: [
          { t: "Wi-Fi 8(IEEE 802.11bn)", rel: "확장·발전", why: "Wi-Fi 7 다음 세대 표준" },
        ] },
        "Passive WiFi",
      ] },
      { name: "IoT·무선 기술", items: [
        "SDR(Software Defined Radio)",
        "IoT Matter",
        "무선 충전 기술",
      ] },
    ] },
  ],
  AL: [
    { name: "알고리즘 분석", groups: [
      { name: "복잡도 분석", items: [
        { t: "알고리즘 성능평가", kids: [
          { t: "빅오 표기법(O-Notation)", rel: "구성·기법", why: "상한 점근 표기법" },
        ] },
      ] },
    ] },
    { name: "정렬", groups: [
      { name: "단순 정렬", items: [
        "버블 정렬(Bubble Sort)",
        "삽입 정렬(Insertion Sort)",
      ] },
      { name: "분할 정복 정렬", items: [
        "퀵 정렬(Quick Sort)",
        "병합 정렬(Merge Sort)",
      ] },
    ] },
    { name: "해싱", groups: [
      { name: "해시 탐색", items: [
        { t: "해시 테이블", kids: [
          { t: "해싱과 충돌해결방법", rel: "구성·기법", why: "해시함수·충돌 처리" },
        ] },
      ] },
    ] },
    { name: "설계 기법", groups: [
      { name: "최적화 전략", items: [
        "동적 계획법(Dynamic Programming)",
        { t: "그리디(탐욕) 알고리즘", kids: [
          { t: "빔 탐색(Beam Search)", rel: "확장·발전", why: "K개 후보로 탐욕 보완" },
        ] },
      ] },
    ] },
    { name: "트리·그래프", groups: [
      { name: "순회", items: [
        "트리 순회(Tree Traversal)",
        "그래프 순회(Graph Traversal)",
      ] },
      { name: "최소비용·최단경로", items: [
        "최소 신장 트리(MST, Minimum Spanning Tree)",
        "다익스트라(Dijkstra) 알고리즘",
      ] },
    ] },
    { name: "압축·텍스트", groups: [
      { name: "데이터 압축", items: [
        "런랭스(Run Length) 코딩",
        "허프만(Huffman) 코딩",
      ] },
      { name: "텍스트 가중치", items: [
        "TF-IDF(Term Frequency - Inverse Document Frequency)",
      ] },
    ] },
  ],
  DS: [
    { name: "기초·선형 구조", groups: [
      { name: "자료구조 분류", items: [
        "선형 자료구조와 비선형 자료구조",
      ] },
      { name: "연결 리스트", items: [
        "링크드 리스트(Linked List)",
      ] },
      { name: "제한 접근 구조", items: [
        "Stack",
        "Queue",
      ] },
    ] },
    { name: "트리 구조", groups: [
      { name: "탐색 트리", items: [
        { t: "이진 탐색 트리(Binary Search Tree)", kids: [
          { t: "AVL 트리", rel: "종류", why: "높이 균형 이진탐색트리" },
          { t: "B-Tree(Balanced Tree)", rel: "확장·발전", why: "다진 균형 탐색 트리" },
        ] },
      ] },
      { name: "우선순위 트리", items: [
        "힙(Heap)",
      ] },
    ] },
    { name: "그래프 구조", groups: [
      { name: "방향 그래프", items: [
        "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
      ] },
    ] },
  ],
  DB: [
    { name: "DB 구조·설계", groups: [
      { name: "스키마·독립성", items: [
        "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성",
      ] },
      { name: "데이터 모델링", items: [
        { t: "데이터베이스 모델링", kids: [
          { t: "엔티티(Entity)", rel: "구성·기법", why: "개념 모델링 구성요소" },
          { t: "연결함정(Connection Trap)", rel: "문제·해결", why: "ER 관계 모호 문제" },
        ] },
      ] },
      { name: "키·무결성", items: [
        "릴레이션 키(key)",
        "데이터베이스 무결성",
      ] },
      { name: "정규화·반정규화", items: [
        { t: "데이터베이스 정규화(Normalization)", kids: [
          { t: "함수적 종속성(Functional Dependency)", rel: "구성·기법", why: "정규화 판단 근거", kids: [
            { t: "암스트롱 공리(Armstrong's Axioms)", rel: "구성·기법", why: "함수종속 추론 규칙" },
          ] },
        ] },
        "데이터베이스 반정규화(De-Normalization)",
      ] },
      { name: "관계 연산", items: [
        "관계대수(Relational Algebra)",
        "관계해석(Relational Calculus)",
      ] },
    ] },
    { name: "트랜잭션 관리", groups: [
      { name: "트랜잭션·격리", items: [
        { t: "트랜잭션", kids: [
          { t: "Isolation Level(격리 레벨)", rel: "구성·기법", why: "고립성 보장 수준" },
        ] },
      ] },
      { name: "장애 회복", items: [
        "DB 회복기법",
      ] },
      { name: "동시성 제어", items: [
        { t: "DB 동시성제어", kids: [
          { t: "낙관적 검증(Validation) 기법", rel: "종류", why: "검증 기반 동시성제어" },
          { t: "MVCC(다중 버전 동시성 제어) 2가지 유형", rel: "종류", why: "버전 기반 동시성제어" },
          { t: "Wait-Die와 Wound-Wait", rel: "문제·해결", why: "Locking 교착상태 회피" },
        ] },
      ] },
    ] },
    { name: "SQL·성능", groups: [
      { name: "SQL·인덱스", items: [
        { t: "SQL(Structured Query Language)", kids: [
          { t: "조인(Join)", rel: "구성·기법", why: "테이블 결합 연산" },
        ] },
        "RDBMS 인덱스(index)",
      ] },
      { name: "부하 분산·분할", items: [
        "쿼리오프로딩(Query offloading)",
        "데이터베이스 파티셔닝(Partitioning)",
        "데이터베이스 샤딩(Sharding)",
      ] },
    ] },
    { name: "분산·NoSQL", groups: [
      { name: "분산 DB", items: [
        { t: "분산 DB", kids: [
          { t: "2PC", rel: "구성·기법", why: "분산 트랜잭션 커밋 규약" },
        ] },
      ] },
      { name: "분산 일관성 이론", items: [
        { t: "CAP 이론과 BASE 이론", kids: [
          { t: "PACELC", rel: "확장·발전", why: "CAP 한계 보완 이론" },
        ] },
      ] },
      { name: "NoSQL·NewSQL", items: [
        { t: "NoSQL", kids: [
          { t: "NoSQL 데이터모델링 패턴", rel: "구성·기법", why: "NoSQL 테이블 설계 패턴" },
        ] },
        "NewSQL",
      ] },
      { name: "벡터 DB", items: [
        { t: "벡터 데이터베이스(Vector Database)", kids: [
          { t: "ANN(Approximate Nearest Neighbor) 알고리즘", rel: "구성·기법", why: "벡터 유사성 검색 알고리즘" },
        ] },
      ] },
    ] },
    { name: "데이터 아키텍처", groups: [
      { name: "아키텍처 유형", items: [
        "데이터(웨어하우스, 레이크, 패브릭, 메시)",
        "데이터 레이크하우스(Data Lakehouse)",
        { t: "데이터패브릭(Data Fabric)", kids: [
          { t: "데이터 가상화(Data Virtualization)", rel: "구성·기법", why: "패브릭 핵심 통합 기술" },
        ] },
        { t: "데이터 메시(Data Mesh)", kids: [
          { t: "DaaP(Data as a product)", rel: "구성·기법", why: "데이터 메시 핵심 원칙" },
        ] },
      ] },
      { name: "데이터 파이프라인", items: [
        "아파치 카프카(Apache Kafka)",
        "데이터 파운드리(Data Foundry)",
      ] },
    ] },
    { name: "데이터 거버넌스", groups: [
      { name: "거버넌스·표준", items: [
        { t: "데이터 거버넌스(Data Governance)", kids: [
          { t: "데이터 표준화", rel: "구성·기법", why: "거버넌스 표준화 활동" },
        ] },
      ] },
      { name: "데이터 품질", items: [
        { t: "데이터 품질관리(ISO 8000)", kids: [
          { t: "데이터 프로파일링(Data Profiling)", rel: "구성·기법", why: "품질 진단용 데이터 분석" },
        ] },
      ] },
      { name: "메타데이터 관리", items: [
        { t: "메타 데이터와 데이터 카탈로그", kids: [
          { t: "ISO/IEC 11179", rel: "구성·기법", why: "메타데이터 레지스트리 표준" },
        ] },
        "데이터 리니지",
      ] },
      { name: "공공·인증 제도", items: [
        "공공데이터 예방적 품질관리 진단 가이드",
        "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)",
        "공공데이터 품질인증 매뉴얼(2025.07.)",
        "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)",
        "데이터 가치 평가",
      ] },
      { name: "데이터 공유·이동", items: [
        "데이터 상호운용성과 데이터 이동권",
        "한국형 데이터 스페이스(K-Data Space)",
      ] },
    ] },
    { name: "데이터 분석", groups: [
      { name: "분석 거버넌스", items: [
        { t: "데이터 분석 거버넌스(Data Analytics Governance)", kids: [
          { t: "데이터 분석 준비도와 데이터 분석 성숙도", rel: "구성·기법", why: "분석 거버넌스 수준진단" },
        ] },
      ] },
      { name: "데이터 준비", items: [
        { t: "데이터 전처리", kids: [
          { t: "데이터 클렌징(Cleansing)", rel: "구성·기법", why: "전처리의 데이터 정제" },
        ] },
        "데이터 랭글링(Data Wrangling)",
      ] },
      { name: "마이닝 방법론·기법", items: [
        "데이터 마이닝 방법론",
        "탐색적 데이터 분석과 확증적 데이터 분석",
        "정형/비정형 데이터 마이닝",
      ] },
      { name: "연관 분석", items: [
        { t: "연관성 분석(association analysis) - 데이터마이닝", kids: [
          { t: "Apriori 알고리즘", rel: "종류", why: "빈발 항목집합 탐색", kids: [
            { t: "DHP(Direct Hashing & Pruning) 알고리즘", rel: "확장·발전", why: "해싱으로 후보 축소" },
          ] },
          { t: "FP(Frequent Pattern)-Growth 알고리즘", rel: "종류", why: "FP-Tree 기반 탐색" },
        ] },
      ] },
      { name: "데이터 시각화", items: [
        { t: "데이터 시각화", kids: [
          { t: "빅데이터 시각화(Visualization)", rel: "종류", why: "빅데이터 대상 시각화" },
        ] },
      ] },
    ] },
  ],
  MG: [
    { name: "경영전략 분석", groups: [
      { name: "환경 분석", items: [
        { t: "환경분석", kids: [
          { t: "가치사슬(Value Chain)", rel: "구성·기법", why: "내부 활동 역량 분석" },
        ] },
      ] },
      { name: "사업 전략 기법", items: [
        "BCG Matrix",
        "Ansoff Matrix",
      ] },
      { name: "논리적 사고", items: [
        "MECE와 LISS",
      ] },
    ] },
    { name: "IT 거버넌스", groups: [
      { name: "거버넌스 체계", items: [
        "IT 거버넌스(IT-Governance)",
        "ISO 38500:2024",
      ] },
      { name: "규제 준수", items: [
        "IT-Compliance",
      ] },
    ] },
    { name: "정보화 전략·투자", groups: [
      { name: "정보화 전략 계획", items: [
        "ISP (Information Strategy Planning)",
        "ISMP (Information System Master Plan)",
        "ISP 및 ISMP 수립 공통가이드 9판(2025.05)",
      ] },
      { name: "시스템 규모 산정", items: [
        "정보시스템 하드웨어 규모산정 지침",
      ] },
      { name: "정보화 투자 관리", items: [
        "정보화 투자관리 가이드",
        "IT 투자성과 평가",
      ] },
    ] },
    { name: "IT 서비스 관리", groups: [
      { name: "서비스 관리 체계", items: [
        { t: "ITSM(Information Technology Service Management)", kids: [
          { t: "ITIL(IT Infrastructure Library) 4.0", rel: "구성·기법", why: "ITSM 대표 프레임워크" },
          { t: "서비스 수준 관리 (SLM, Service Level Management)", rel: "구성·기법", why: "SLA 기반 수준 관리" },
        ] },
      ] },
      { name: "IT 품질 위험", items: [
        "기술 부채(Technical Debt)",
      ] },
    ] },
    { name: "업무 연속성", groups: [
      { name: "연속성 계획·분석", items: [
        { t: "BCP (Business Continuity Planning)", kids: [
          { t: "BIA (Business Impact Analysis)", rel: "구성·기법", why: "BCP 수립 영향 분석", kids: [
            { t: "BCP 지표 중 MBCO, MTPD, MAO", rel: "구성·기법", why: "BIA로 정할 복구 지표" },
          ] },
        ] },
      ] },
      { name: "재해 복구", items: [
        { t: "DRS (Disaster Recovery System)", kids: [
          { t: "DRaaS(Disaster Recovery as a Service)", rel: "확장·발전", why: "클라우드형 재해복구" },
        ] },
      ] },
      { name: "표준·공공 제도", items: [
        "ISO 22301",
        "정보시스템 등급제",
        "디지털 안전 3법",
      ] },
    ] },
    { name: "기술·성과 평가", groups: [
      { name: "기술 성숙·수용", items: [
        "TRL(Technology Readiness Level)",
        "기술수용 주기(Technology Adoption Life Cycle)",
      ] },
      { name: "기술 가치·권리", items: [
        "기술 가치 평가",
        "지식재산권",
      ] },
      { name: "성과 관리", items: [
        "PDCA(Plan-Do-Check-Act, Deming Cycle)",
        "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)",
        "OKR",
      ] },
    ] },
    { name: "혁신·신경제 모델", groups: [
      { name: "지속가능 경영", items: [
        "ESG 경영",
      ] },
      { name: "혁신 방법론", items: [
        "디자인 씽킹(Design Thinking)",
        "그로스 해킹(Growth hacking)",
      ] },
      { name: "신경제 모델", items: [
        "서비타이제이션(Servitization)",
        "프로토콜 경제(Protocol Economy)",
        "의도 경제(Intention Economy)",
      ] },
      { name: "시민 참여 혁신", items: [
        "시빅 해킹(Civic Hacking)",
        "리빙랩(Living Lab), S.O.S랩",
      ] },
    ] },
  ],
  SC: [
    { name: "암호 기술", groups: [
      { name: "암호 기초", items: [
        { t: "암호화(Encryption)", kids: [
          { t: "블록 암호화(Block Cipher)", rel: "종류", why: "블록 단위 분할 암호화" },
        ] },
        "Shannon의 암호 설계 원칙",
        "암호학적 보안 강도(Security Strength)",
      ] },
      { name: "해시·키 교환", items: [
        { t: "해시 함수의 안전성", kids: [
          { t: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)", rel: "구성·기법", why: "해시 안전성 강화 기법" },
        ] },
        "디피-헬만 알고리즘(Diffie-Hellman Algorithm)",
      ] },
      { name: "암호 공격", items: [
        "암호 분석 공격(Cryptanalysis Attacks) 기법",
        "부채널 공격(Side Channel Attack)",
      ] },
      { name: "양자 시대 암호", items: [
        "양자 암호(Quantum Cryptography)",
        "포스트 양자 암호(Post-Quantum Cryptography)",
      ] },
    ] },
    { name: "인증·접근 통제", groups: [
      { name: "전자서명 응용", items: [
        "전자봉투(Digital Envelope)",
        "이중 서명(Dual Signature)",
        "다중 서명(Multi Signature)",
        "블록체인 암호기술 가이드라인",
      ] },
      { name: "사용자 인증", items: [
        "생체 인증(텔레바이오 인증)",
        "패스키(Passkey)",
        "간편인증 인터페이스 가이드라인",
        "OAuth(Open Authorize) 2.0",
      ] },
      { name: "접근 통제", items: [
        { t: "접근 제어/접근 통제(Access Control)", kids: [
          { t: "접근 통제 모델", rel: "구성·기법", why: "접근 권한 결정 정책 모델" },
        ] },
      ] },
      { name: "제로 트러스트·망 보안", items: [
        { t: "제로트러스트 가이드라인 2.0", kids: [
          { t: "SDP(Software Defined Perimeter)", rel: "구성·기법", why: "선인증·후연결 접근제어" },
        ] },
        "국가 망 보안체계(N2SF)",
      ] },
    ] },
    { name: "공격 기법", groups: [
      { name: "네트워크 공격", items: [
        "스니핑(Sniffing) & 스푸핑(Spoofing)",
        { t: "DoS(Denial of Service)", kids: [
          { t: "DRDoS(Distributed Reflection DoS)", rel: "종류", why: "반사·증폭형 분산 DoS" },
        ] },
      ] },
      { name: "악성코드", items: [
        "루트킷(Rootkit)",
        "BPF(Berkeley Packet Filter) Door",
        "RaaS(Ransomware as a Service)",
      ] },
      { name: "유포·침투 경로", items: [
        "드라이브 바이 다운로드(Drive By Download)",
        "공급망 공격(Supply Chain Attack)",
      ] },
      { name: "지능형·사회공학 공격", items: [
        "사이버전(Cyber Warfare)",
        "APT(Advanced Persistent Threat) 공격",
        "딥보이스(Deep Voice) 피싱",
      ] },
    ] },
    { name: "애플리케이션 보안", groups: [
      { name: "웹 취약점·방어", items: [
        { t: "OWASP Top 10:2021", kids: [
          { t: "OWASP Top 10:2025", rel: "확장·발전", why: "2021판의 개정판" },
          { t: "SSRF(Server-Side Request Forgery)", rel: "구성·기법", why: "2021판 A10 취약점 항목" },
        ] },
        "WAAP(Web Application and API Protection)",
      ] },
      { name: "보안 설계·개발", items: [
        "위협 모델링(Threat Modeling)",
        "시큐어 코딩(Secure Coding)",
        "DevSecOps",
        "Secure Software Development Framework(SSDF)",
      ] },
      { name: "SW·콘텐츠 보호", items: [
        "SW난독화",
        "DRM(Digital Right Management)",
        "디지털 워터마킹(Digital Watermarking)",
        "핑거프린팅(Fingerprinting)",
      ] },
      { name: "AI 보안", items: [
        "OWASP Top 10 for LLM Application 2025",
        "AI Agent 보안위협",
        "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)",
      ] },
    ] },
    { name: "인프라·융합 보안", groups: [
      { name: "통신 보안 프로토콜", items: [
        "IPSec",
        "TLS/SSL(Secure Socket Layer)",
        "VPN(Virtual Private Network)",
      ] },
      { name: "DNS·메일 보안", items: [
        "DNSSEC(Domain Name System Security Extension)",
        "DNS 싱크홀(Sinkhole)",
        "DMARC(Domain-based Message Authentication, Reporting and Conformance)",
      ] },
      { name: "클라우드 보안", items: [
        "클라우드 컴퓨팅 취약점, 대응기술",
        "ISO 27017",
        "ISO 27018",
        "SECaaS(Security as a Service)",
        "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)",
        "SASE(Secure Access Service Edge)",
      ] },
      { name: "차량·산업제어 보안", items: [
        "자율주행 자동차 보안취약점 및 대응방안",
        "차량 사이버 보안 국제 표준(ISO 21434)",
        "스마트팩토리 보안취약점 및 대응방안",
        "IEC 62443",
      ] },
      { name: "스마트 인프라 보안", items: [
        "스마트시티 보안취약점 및 대응방안",
        "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안",
      ] },
    ] },
    { name: "관제·침해 대응", groups: [
      { name: "위협 탐지·대응", items: [
        "차세대 SIEM(Security Information and Event Management)",
        { t: "EDR(Endpoint Detection and Response)", kids: [
          { t: "XDR(eXtended Detection Response)", rel: "확장·발전", why: "EDR을 통합 탐지로 확장" },
        ] },
      ] },
      { name: "선제적 위협 대응", items: [
        "공격 표면 관리(Attack Surface Management)",
        "위협 헌팅(Threat Hunting)",
        "사이버 디셉션(Cyber Deception)",
        "사이버 게놈(Cyber genome)",
      ] },
      { name: "디지털 포렌식", items: [
        { t: "디지털 포렌식(Digital Forensic)", kids: [
          { t: "클라우드 포렌식(Cloud Forensic)", rel: "종류", why: "클라우드 증거 대상 포렌식" },
          { t: "안티 포렌식(Anti-forensic)", rel: "문제·해결", why: "증거 훼손·은닉 방해" },
        ] },
        "전자증거개시제도(e-Discovery)",
      ] },
      { name: "사이버 회복력", items: [
        "디지털 면역 시스템(DIS, Digital Immune System)",
        "사이버 레질리언스(Cyber Resilience)",
      ] },
    ] },
    { name: "보안 관리·개인정보", groups: [
      { name: "관리체계·인증제도", items: [
        "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)",
        "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)",
        "정보보호제품 평가·인증(CC 평가·인증) 제도",
        "정보보호 공시제도",
        "사이버 보안 성숙도 모델 인증(CMMC, Cybersecurity Maturity Model Certification)",
      ] },
      { name: "개인정보 원칙·설계", items: [
        "개인정보 프라이버시 8원칙",
        { t: "개인정보보호 중심 설계(Privacy by Design)", kids: [
          { t: "PbD(Privacy by Design) 인증제도", rel: "확장·발전", why: "PbD 적용 검증 인증제" },
        ] },
        "개인정보 영향평가(Privacy Impact Assessment)",
        "ISO 27701",
      ] },
      { name: "개인정보 처리 지침", items: [
        { t: "가명정보 처리 가이드라인", kids: [
          { t: "가명처리(Pseudonymization) 기법", rel: "구성·기법", why: "가이드라인의 가명처리 기술" },
        ] },
        "ISO/IEC 20889",
        "생체정보 보호 안내서(24.12)",
        "AI 프라이버시 리스크 관리",
      ] },
      { name: "프라이버시 강화 기술", items: [
        "개인정보 보호기술",
        { t: "PEC(Privacy-Enhancing Computation)", kids: [
          { t: "동형 암호(Homomorphic Encryption)", rel: "종류", why: "암호문 상태 연산 기술" },
          { t: "영지식증명(Zero Knowledge Proof)", rel: "종류", why: "정보 비공개 참 증명" },
          { t: "기밀컴퓨팅(Confidential Computing)", rel: "종류", why: "TEE로 사용중 데이터 보호" },
        ] },
      ] },
    ] },
  ],
  DX: [
    { name: "데이터 공유·주권", groups: [
      { name: "데이터 이동·연계", items: [
        "데이터 상호 운용성 & 데이터 이동권",
        "데이터 스페이스(Data Space)",
      ] },
    ] },
    { name: "AI 에이전트 기반", groups: [
      { name: "AI 운영체제", items: [
        "AI OS(Artificial Intelligence Operating System)",
      ] },
    ] },
    { name: "에이전틱 커머스", groups: [
      { name: "상거래 프로토콜", items: [
        "UCP(Universal Commerce Protocol)",
        "ACP(Agentic Commerce Protocol)",
      ] },
      { name: "결제·디지털 화폐", items: [
        "AP2(Agent Payment Protocol)",
        "스테이블 코인(Stable coin)",
      ] },
    ] },
  ],
};

export type TreePlace = { i: number; area: string; group: string; depth: number };

const PLACES = new Map<string, Map<string, TreePlace>>();
/** 과목 계층을 펼친 차례 — 제목 → (차례, 영역, 분류, 깊이). 하위 토픽은 상위 바로 뒤. */
export function treePlaces(code: string): Map<string, TreePlace> {
  let m = PLACES.get(code);
  if (m) return m;
  m = new Map();
  let i = 0;
  const put = (t: string, area: string, group: string, depth: number) => {
    if (!m!.has(t)) m!.set(t, { i: i++, area, group, depth });
  };
  const walk = (k: TreeKid, area: string, group: string, depth: number) => {
    put(k.t, area, group, depth);
    for (const c of k.kids ?? []) walk(c, area, group, depth + 1);
  };
  for (const a of TOPIC_TREE[code] ?? [])
    for (const g of a.groups)
      for (const it of g.items) {
        if (typeof it === "string") put(it, a.name, g.name, 0);
        else {
          put(it.t, a.name, g.name, 0);
          for (const c of it.kids) walk(c, a.name, g.name, 1);
        }
      }
  PLACES.set(code, m);
  return m;
}

export type TreeLink = { child: string; parent: string; rel: TopicRel; why: string };
/** 계층의 상위–하위 관계 전부(과목 순서대로) */
export const TREE_LINKS: TreeLink[] = (() => {
  const out: TreeLink[] = [];
  const walk = (parent: string, k: TreeKid) => {
    out.push({ child: k.t, parent, rel: k.rel, why: k.why });
    for (const c of k.kids ?? []) walk(k.t, c);
  };
  for (const areas of Object.values(TOPIC_TREE))
    for (const a of areas)
      for (const g of a.groups)
        for (const it of g.items) if (typeof it !== "string") for (const c of it.kids) walk(it.t, c);
  return out;
})();
