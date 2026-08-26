/**
 * 교재 서브노트 부가 자료 — ★교재 슬라이드 원본 이미지★ + 쉬운 설명.
 *
 *  - image: public/concept/book/<slug>.<ext> 에 넣어 둔 교재 슬라이드 원본.
 *    AI가 다시 그린 도식이 아니라 교재 그림 그대로다. 도식이 필요하면 이걸 본다.
 *  - easy: "이게 무슨 소리냐"를 한국말로 풀어 쓴 설명. AI 호출 없이 항상 뜬다.
 *
 * key 는 topicId(있으면) 또는 제목 슬러그. subnoteExtrasFor() 가 둘 다 찾아준다.
 */

import { subnoteByTitle } from "./textbookSubnotes";
import { TOPIC_GUIDES } from "./topicGuides";

/**
 * 처음 보는 사람이 ★이해하고 → 기억하고 → 꺼내 쓰게★ 만드는 학습 카드.
 *
 * 용어를 용어로 설명하면 외워지지 않는다. 그래서 순서를 이렇게 고정한다.
 *  1) 한 문장  — 전문용어 0개로 "이게 뭔지"
 *  2) 한 장면  — 머릿속에 그림이 그려지는 일상 비유
 *  3) 왜 필요  — 이게 없으면 무슨 일이 나는지 (이유를 알면 안 잊는다)
 *  4) 뜯어보기 — ★비유의 각 요소 ↔ 진짜 용어★ 를 1:1로 붙인다. 여기가 핵심.
 *  5) 옆 토픽  — 같이 묶어 외울 토픽. 지식은 낱개가 아니라 그물로 저장된다.
 *  6) 답안 한 줄 — 시험지에 실제로 쓸 문장
 */
export type EasyGuide = {
  /** 전문용어 없이 한 문장 */
  hook: string;
  /** 일상 비유 한 장면 */
  scene: string;
  /** 이게 없으면 생기는 문제 */
  why: string;
  /** 비유를 걷어낸 실제 동작 — 컴퓨터 안에서 진짜 일어나는 일을 순서대로 */
  mechanism?: string;
  /** 비유 ↔ 진짜 용어 매핑 */
  map: { as: string; real: string; note: string }[];
  /** 실전 쓰임 — 내 폰·서버·실무 어디에 있고, 시험엔 어떤 형태로 나오나 */
  usage?: string;
  /** 함께 외우는 옆 토픽 */
  links: { topic: string; how: string }[];
  /** 답안에 그대로 쓸 한 줄 */
  exam: string;
};

export type SubnoteExtra = {
  /** 교재 슬라이드 원본 이미지 경로 */
  image?: string;
  /**
   * 추가 도식 — 사용자가 보내준 캡처를 public/concept/extra/ 에 커밋해 두고 여기 나열.
   * 리포에 포함되므로 로그인·DB 없이 모든 기기에서 항상 뜬다.
   */
  images?: string[];
  /**
   * 답안지 템플릿에서 images 를 띄울 때 붙는 소항목 이름. 기본은 "개념도"지만,
   * 그림이 흐름·단계를 보여 주는 경우엔 "절차"처럼 실제 내용에 맞게 바꾼다.
   */
  imagesLabel?: string;
  /** (구) 줄글 설명 — guide 가 없을 때만 쓴다 */
  easy?: string;
  /** (신) 이해→암기→인출 학습 카드 */
  guide?: EasyGuide;
};

/** topicId 가 없는 교재 전용 토픽의 제목 → 슬러그 (조회 시 정규화해서 비교) */
const TITLE_SLUG: Record<string, string> = {
  "이레이저 코딩(erasure coding)": "erasure-coding",
  "지능형 반도체": "intelligent-semiconductor",
  "메모리 단편화(Fragmentation)": "memory-fragmentation",
  "MMU(Memory Management Unit)": "mmu",
  "기한부(Deadline) 스케줄링": "deadline-scheduling",
  "CPU 스케줄링(CPU Scheduling)": "cpu-scheduling",
  "프로세스 상태 전이도": "process-state-transition",
  "가상메모리의 페이징과 세그멘테이션": "paging-segmentation",
  "CPU Ring Level": "cpu-ring-level",
  "요구사항 명세서 SRS": "srs",
  "프로젝트 관리 계획서": "pm-plan-doc",
  "활동기간 산정기법": "duration-estimating",
  "일정단축 기법": "schedule-compression",
  "SW 품질비용": "sw-quality-cost",
  "갈등관리": "conflict-management",
  "몬테카를로 시뮬레이션": "monte-carlo",
  "경험 기반 테스트": "exp-based-test",
  "위험 기반 테스트": "risk-based-test",
  "코드 커버리지(Code Coverage)": "code-coverage",
  "리뷰(Review)": "review",
  "카오스 테스트 (Chaos Test)": "chaos-test",
  "소프트웨어 리팩토링": "refactoring",
  "Keyword Driven Testing": "keyword-driven-testing",
  "3R": "three-r",
  "튜링 테스트": "turing-test",
  "리그레이션(회귀, Regression) 테스트": "regression-test",
  "Test Exit Criteria": "test-exit-criteria",
  "Lehman의 Software 변화의 원리": "lehman",
  "퍼징 테스트 (Fuzzing Test)": "fuzzing-test",
  "성능 테스트": "performance-test",
  "ISO 29119": "iso-29119",
  "ISO 29119-11": "iso-29119-11",
  "뮤테이션 테스트 (Mutation Test)": "mutation-test",
  "Test Process": "test-process",
  "Back to Back 테스트": "back-to-back",
  "ISO/IEC 25010:2023": "iso-25010",
  "SP 인증": "sp-cert",
  "GS 인증": "gs-cert",
  "CMMI 3.0": "cmmi",
  "오픈소스 거버넌스": "oss-governance",
  "SW 규모산정": "sw-sizing",
  "STPA (System-Theoretic Process Analysis)": "stpa",
  "ETA (Event Tree Analysis)": "eta",
  "HAZOP (Hazard and Operability Study)": "hazop",
  "FMEA (Failure Mode and Effects Analysis)": "fmea",
  "정보시스템 운영 성과관리": "ops-performance",
  "정보시스템 감리결과보고서 (구성, 보고사항)": "audit-report",
  "공통감리 절차": "common-audit-process",
  "정보시스템 감리 의무 대상과 관점별 점검 기준": "audit-mandatory",
  "정보시스템 운영/유지보수 감리": "ops-maintenance-audit",
  "오픈소스 SW 보안위협": "oss-security-threat",
  "FTA (Fault Tree Analysis)": "fta",
  "ISO/IEC/IEEE 14764": "iso-14764",
  "McCabe 회전 복잡도": "mccabe",
  "유지보수": "maintenance",
  "상용소프트웨어 품질성능 평가 시험": "commercial-sw-quality-test",
  "Function Point": "function-point",
  "SW 사업대가 ('25년 개정판)": "sw-cost",
  "난독화": "obfuscation",
  "사용성 평가": "usability-eval",
  "SBOM": "sbom",
  "상용 소프트웨어 직접구매 제도": "direct-purchase",
  "소프트웨어사업 영향평가": "sw-impact-assessment",
  "공공기관 정보화사업 예비타당성": "feasibility-study",
  "소프트웨어 안전 확보를 위한 지침": "sw-safety-guideline",
  "Agile 선언문과 12개 원칙": "agile-manifesto",
  "소프트웨어 개발 방법론": "sw-methodology",
  "소프트웨어 설계의 원리": "sw-design-principle",
  "다형성 (Polymorphism)": "polymorphism",
  "객체지향 설계 원리": "ood-principles",
  "데메테르의 법칙 (Law of Demeter)": "law-of-demeter",
  "AOP (Aspect Oriented Programming)": "aop",
  "테일러링 (Tailoring)": "tailoring",
  "요구공학 (Requirements Engineering)": "req-engineering",
  "ISO/IEC/IEEE 42010:2022": "iso-42010",
  "SW Architecture 구축 절차": "sw-arch-process",
  "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)": "sw-arch-driver",
  "유틸리티 트리 (Utility Tree)": "utility-tree",
  "소프트웨어 품질 속성 시나리오": "quality-attribute-scenario",
  "소프트웨어 아키텍처 스타일": "sw-arch-style",
  "CBAM(Cost Benefit Analysis Method)": "cbam",
  "UML (정적, 동적 다이어그램)": "uml",
  "클래스 다이어그램 (Class Diagram)": "class-diagram",
  "유즈케이스 다이어그램": "usecase-diagram",
  "상태 다이어그램 (State Diagram)": "state-diagram",
  "시퀀스 다이어그램 (Sequence Diagram)": "sequence-diagram",
  "MSA (Micro Service Architecture)": "msa",
  "SAGA패턴": "saga-pattern",
  "DDD (Domain Driven Design)": "ddd",
  "Event Driven Architecture": "eda",
  "디자인 패턴 (Design Pattern)": "design-pattern",
  "싱글턴 패턴 (Singleton pattern)": "singleton",
  "UML의 4+1 View Model": "view-4plus1",
  "MVVM (Model, View, View Model)": "mvvm",
  // ── 3주차 인공지능(AI) — 교재 서브노트에 topicId 가 없어 제목 슬러그로 조회 ──
  "머신러닝 학습방법": "ml-learning-methods",
  "전이학습(Transfer Learning)": "transfer-learning",
  "자기지도학습(Self-supervised Learning)": "self-supervised",
  "연합학습(Federated Learning)": "federated-learning",
  "머신 언러닝(Machine Unlearning)": "machine-unlearning",
  "버티컬 AI(Vertical AI)": "vertical-ai",
  "Physical AI": "physical-ai",
  "온디바이스 AI": "on-device-ai",
  "AEI(Artificial Emotional Intelligence)": "aei",
  "활성화함수(Activation Function)": "activation-function",
  "손실함수(Loss Function)": "loss-function",
  "손실함수": "loss-function",
  "머신러닝 옵티마이저(Optimizer)": "ml-optimizer",
  "머신러닝 옵티마이저": "ml-optimizer",
  "서포트 벡터 머신 SVM(Support Vector Machine)": "svm",
  "데이터라벨링과 어노테이션": "data-labeling",
  "지식 증류(Knowledge Distillation)": "knowledge-distillation",
  "배치 정규화(Batch Normalization)": "batch-normalization",
  "정규화, 규제화, 표준화": "norm-reg-std",
  "Dropout": "dropout",
  "밀도기반 클러스터링(DBSCAN)": "dbscan",
  "오류 역전파(Backpropagation)": "backpropagation",
  "K-NN(Nearest Neighbor) Classification": "knn",
  "기울기 소실과 기울기 폭주": "gradient-vanishing",
  "K-평균 알고리즘": "k-means",
  "PCA(Principal Component Analysis)": "pca",
  "차원 축소(Dimensionality Reduction)": "dim-reduction",
  "유전 알고리즘(Genetic Algorithm)": "genetic-algorithm",
  "앙상블 학습(Ensemble Learning)": "ensemble",
  "유사도(Similarity)": "similarity",
  "LDA(Linear Discriminant Analysis)": "lda",
  "거리 공식(Distance Formula)": "distance-formula",
  "트랜스포머(Transformer)": "transformer",
  "자연어처리(NLP, Natural Language Processing)": "nlp",
  "자연어처리(NLP)": "nlp",
  "VAE(Variational Autoencoder)": "vae",
  "GAN(Generative Adversarial Network)": "gan",
  "SVD(Singular Value Decomposition)": "svd",
  "검색 삽입 생성(RIG, Retrieval Interleaved Generation)": "rig",
  "RIG(Retrieval Interleaved Generation)": "rig",
  "검색 증강 생성(RAG, Retrieval Augmented Generation)": "rag",
  "RAG(Retrieval Augmented Generation)": "rag",
  "할루시네이션(Hallucination)": "hallucination",
  "초거대 언어 모델(Large Language Model)": "llm",
  "어텐션 메커니즘(Attention Mechanism)": "attention",
  "랭체인(LangChain)": "langchain",
  "파인 튜닝(Fine-tuning)": "fine-tuning",
  "프롬프트 튜닝(Prompt Tuning)": "prompt-tuning",
  "컨텍스트 엔지니어링(Context Engineering)": "context-engineering",
  "프롬프트 엔지니어링(Prompt Engineering)": "prompt-engineering",
  "LoRA(Low-rank adaptation)": "lora",
  "대규모 언어 모델(LLM) 성능 향상 기술": "llm-enhancement",
  "대형개념모델(LCM, Large Concept Models)": "lcm",
  "LAM(Large Action Model)": "lam",
  "LangGraph": "langgraph",
  "COT(Chain of Thought)": "cot",
  "MOE(Mixture of Experts)": "moe",
  "PEFT(Parameter-Efficient Fine-Tuning)": "peft",
  "MLPerf": "mlperf",
  "테스트 타임 스케일링(Test-Time Scaling, TTS)": "tts",
  "MLOps": "mlops",
  "LLMOps": "llmops",
  "인공지능 생성물 워터마크 적용 기술": "ai-watermark",
  "생성형 인공지능 서비스 이용자 보호 가이드라인": "genai-user-protection",
  "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)": "genai-user-protection-2502",
  "ISO/IEC TS 42119-2": "iso-42119-2",
  "BrainBody LLM": "brainbody-llm",
  "혼동행렬(Confusion Matrix)": "confusion-matrix",
  "클래스 불균형(Class Imbalance)": "class-imbalance",
  "Diffusion 모델": "diffusion",
  "AutoML": "automl",
  "편향": "ai-bias",
  "AI TRiSM(AI Trust, Risk and Security Management)": "ai-trism",
  "딥페이크(Deepfake)": "deepfake",
  "프롬프트 인젝션(Prompt Injection)": "prompt-injection",
  "인공지능 적대적 공격": "adversarial-attack",
  "모델 드리프트(Model Drift) — 컨셉 드리프트 & 데이터 드리프트": "model-drift",
  "컨셉 드리프트 & 데이터 드리프트": "model-drift",
  "AI 레드팀(Red team) 테스트": "ai-redteam",
  "AI 시스템 테스트": "ai-system-test",
  "파운데이션 모델(Foundation Model)": "foundation-model",
  "멀티모달(Multimodal) AI": "multimodal-ai",
  "범용 인공지능 위험관리 프레임워크": "gpai-risk-framework",
  "AI Agent": "ai-agent",
  "A2A(Agent2Agent) 프로토콜": "a2a",
  "바이브코딩(Vibe Coding)": "vibe-coding",
  "MCP(Model Context Protocol)": "mcp",
  "MCP 보안취약점 및 대응방안": "mcp-security",
  "합성 데이터(Synthetic Data)": "synthetic-data",
  "소버린 AI(Artificial Intelligence)": "sovereign-ai",
  "소버린 AI(Sovereign AI)": "sovereign-ai",
  "인공지능 경영시스템(ISO 42001:2023)": "iso-42001",
  "AX(AI Transformation)": "ax",
  "에이전틱 AI(Agentic AI)": "agentic-ai",
  "인공지능 학습용 데이터 품질관리 가이드라인 v3.1": "data-quality-v3",
  "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)": "public-genai-guideline",
  "공공부문 초거대AI 도입·활용 가이드라인 2.0(2025.04)": "public-genai-guideline",
  "AI 신뢰성 인증": "ai-trust-cert",
  "AI Ready Data": "ai-ready-data",
  "AI 기본법": "ai-basic-law",
  "인공지능(AI) 도입 사업비 산정 절차": "ai-cost-estimation",
  "생성형AI 데이터 품질관리 가이드 v2.0": "genai-data-quality-v2",
  "MAS(Multi Agent System)": "mas",
  // ── 4주차 자료구조(DS) ──
  "선형 자료구조와 비선형 자료구조": "ds-linear-nonlinear",
  "링크드 리스트(Linked List)": "ds-linked-list",
  "Stack": "ds-stack",
  "Queue": "ds-queue",
  "이진 탐색 트리(Binary Search Tree)": "ds-bst",
  "AVL 트리": "ds-avl",
  "힙(Heap)": "ds-heap",
  "힙 (Heap)": "ds-heap",
  "B-Tree(Balanced Tree)": "ds-btree",
  "방향성 비순환 그래프(DAG, Directed Acyclic Graph)": "ds-dag",
  // ── 4주차 알고리즘(AL) ──
  "알고리즘 성능평가": "al-perf-eval",
  "빅오 표기법(O-Notation)": "al-big-o",
  "퀵 정렬(Quick Sort)": "al-quick-sort",
  "삽입 정렬(Insertion Sort)": "al-insertion-sort",
  "병합 정렬(Merge Sort)": "al-merge-sort",
  "해시 테이블": "al-hash-table",
  "해싱과 충돌해결방법": "al-hashing-collision",
  "동적 계획법(Dynamic Programming)": "al-dynamic-programming",
  "그리디(탐욕) 알고리즘": "al-greedy",
  "허프만(Huffman) 코딩": "al-huffman",
  "런랭스(Run Length) 코딩": "al-run-length",
  "다익스트라(Dijkstra) 알고리즘": "al-dijkstra",
  "TF-IDF(Term Frequency - Inverse Document Frequency)": "al-tf-idf",
  "최소 신장 트리(MST, Minimum Spanning Tree)": "al-mst",
  "트리 순회(Tree Traversal)": "al-tree-traversal",
  "그래프 순회(Graph Traversal)": "al-graph-traversal",
  "버블 정렬(Bubble Sort)": "al-bubble-sort",
  "빔 탐색(Beam Search)": "al-beam-search",
  // ── 4주차 네트워크(NW) ──
  "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)": "nw-transmission-coding",
  "PCM(Pulse-Code Modulation)": "nw-pcm",
  "QAM(Quadrature Amplitude Modulation)": "nw-qam",
  "CSMA/CD": "nw-csma-cd",
  "CSMA/CA": "nw-csma-ca",
  "다중화(Multiplexing)": "nw-multiplexing",
  "서비스 프리미티브(Service Primitive)": "nw-service-primitive",
  "OSI 7 Layer (ISO 7498)": "nw-osi-7layer",
  "HTTP/3": "nw-http3",
  "TCP 연결의 설정 및 해제(Handshaking)": "nw-tcp-handshake",
  "TCP 혼잡제어": "nw-tcp-congestion",
  "TCP 와 UDP 비교": "nw-tcp-udp",
  "IPv4와 IPv6 터널링": "nw-ipv4-ipv6-tunneling",
  "DNS(Domain Name System)": "nw-dns",
  "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)": "nw-routing",
  "FEC(Forward Error Correction) / BEC(Backward Error Correction)": "nw-fec-bec",
  "해밍코드(Hamming code)": "nw-hamming",
  "CRC(Cyclic Redundancy Check)": "nw-crc",
  "QoS(Quality of Service)": "nw-qos",
  "ARP(Address Resolution Protocol)": "nw-arp",
  "RARP(Reverse Address Resolution Protocol)": "nw-rarp",
  "DHCP(Dynamic Host Configuration Protocol)": "nw-dhcp",
  "SCTP(Stream Control Transmission Protocol)": "nw-sctp",
  "C-RAN(Centralized / Cloud RAN)": "nw-cran",
  "O-RAN": "nw-oran",
  "RAN(Radio Access Network) Sharing": "nw-ran-sharing",
  "5G 특화망": "nw-5g-private",
  "네트워크 슬라이싱": "nw-network-slicing",
  "IPv6": "nw-ipv6",
  "Sliding Window & 네이글(Nagle's) 알고리즘": "nw-sliding-window",
  "BGP(Border Gateway Protocol)": "nw-bgp",
  "무선 충전 기술": "nw-wireless-charging",
  "CDN(Contents Delivery Network)": "nw-cdn",
  "망 중립성(Network Neutrality)": "nw-net-neutrality",
  "인텐트 기반 네트워킹(Intent-Based Networking)": "nw-ibn",
  "SDR(Software Defined Radio)": "nw-sdr",
  "SD-WAN(Software Defined-Wide Area Network)": "nw-sdwan",
  "오픈플로우(OpenFlow)": "nw-openflow",
  "IoT Matter": "nw-iot-matter",
  "NWDAF(Network Data Analytics Function)": "nw-nwdaf",
  "네트워크 지능": "nw-network-intelligence",
  "6G": "nw-6g",
  "디지털 트윈 네트워크(Digital Twin Network)": "nw-digital-twin-network",
  "비지상네트워크(NTN, Non-Terrestrial Networks)": "nw-ntn",
  "Wi-Fi 7(IEEE 802.11be)": "nw-wifi7",
  "Wi-Fi 8(IEEE 802.11bn)": "nw-wifi8",
  "Passive WiFi": "nw-passive-wifi",
  "SDN(Software Defined Network)": "nw-sdn",
  // ── 5주차 데이터베이스(DB) ──
  "트랜잭션": "db-transaction",
  "Isolation Level(격리 레벨)": "db-isolation-level",
  "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성": "db-ansi-sparc",
  "데이터베이스 모델링": "db-modeling",
  "데이터베이스 무결성": "db-integrity",
  "릴레이션 키(key)": "db-relation-key",
  "엔티티(Entity)": "db-entity",
  "함수적 종속성(Functional Dependency)": "db-functional-dependency",
  "암스트롱 공리(Armstrong's Axioms)": "db-armstrong",
  "데이터베이스 정규화(Normalization)": "db-normalization",
  "데이터베이스 반정규화(De-Normalization)": "db-denormalization",
  "연결함정(Connection Trap)": "db-connection-trap",
  "관계대수(Relational Algebra)": "db-relational-algebra",
  "관계해석(Relational Calculus)": "db-relational-calculus",
  "DB 회복기법": "db-recovery",
  "DB 동시성제어": "db-concurrency",
  "낙관적 검증(Validation) 기법": "db-validation",
  "MVCC(다중 버전 동시성 제어) 2가지 유형": "db-mvcc",
  "분산 DB": "db-distributed",
  "2PC": "db-2pc",
  "NoSQL": "db-nosql",
  "NoSQL 데이터모델링 패턴": "db-nosql-modeling",
  "CAP 이론과 BASE 이론": "db-cap-base",
  "PACELC": "db-pacelc",
  "NewSQL": "db-newsql",
  "벡터 데이터베이스(Vector Database)": "db-vector-db",
  "ANN(Approximate Nearest Neighbor) 알고리즘": "db-ann",
  "SQL(Structured Query Language)": "db-sql",
  "조인(Join)": "db-join",
  "RDBMS 인덱스(index)": "db-index",
  "쿼리오프로딩(Query offloading)": "db-query-offloading",
  "데이터베이스 파티셔닝(Partitioning)": "db-partitioning",
  "데이터베이스 샤딩(Sharding)": "db-sharding",
  "데이터 표준화": "db-data-standard",
  "데이터 거버넌스(Data Governance)": "db-governance",
  "데이터 거버넌스, 데이터 품질": "db-governance",
  "데이터 프로파일링(Data Profiling)": "db-profiling",
  "데이터 분석 거버넌스(Data Analytics Governance)": "db-analytics-governance",
  "데이터 분석 준비도와 데이터 분석 성숙도": "db-readiness-maturity",
  "데이터 마이닝 방법론": "db-mining-methodology",
  "탐색적 데이터 분석과 확증적 데이터 분석": "db-eda-cda",
  "데이터 시각화": "db-visualization",
  "데이터 레이크하우스(Data Lakehouse)": "db-lakehouse",
  "아파치 카프카(Apache Kafka)": "db-kafka",
  "아파치 카프카": "db-kafka",
  "공공데이터 예방적 품질관리 진단 가이드": "db-public-quality",
  "공공데이터 품질인증 매뉴얼(2025.07.)": "db-quality-cert",
  "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)": "db-public-std-guideline",
  "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)": "db-dq-cert",
  "데이터 가치 평가": "db-value-assessment",
  "연관성 분석(association analysis) - 데이터마이닝": "db-association",
  "Apriori 알고리즘": "db-apriori",
  "DHP(Direct Hashing & Pruning) 알고리즘": "db-dhp",
  "FP(Frequent Pattern)-Growth 알고리즘": "db-fp-growth",
  "DaaP(Data as a product)": "db-daap",
  "기술 부채(Technical Debt)": "mg-tech-debt",
  "기술 부채": "mg-tech-debt",
  "리빙랩(Living Lab), S.O.S랩": "mg-living-lab",
  "ITIL(IT Infrastructure Library) 4.0": "mg-itil4",
  "ITSM(Information Technology Service Management)": "mg-itsm",
  "서비스 수준 관리 (SLM, Service Level Management)": "mg-slm",
  "BCP (Business Continuity Planning)": "mg-bcp",
  "BIA (Business Impact Analysis)": "mg-bia",
  "BCP 지표 중 MBCO, MTPD, MAO": "mg-mbco-mtpd-mao",
  "DRS (Disaster Recovery System)": "mg-drs",
  "ISO 22301": "mg-iso22301",
  "DRaaS(Disaster Recovery as a Service)": "mg-draas",
  "DRaaS": "mg-draas",
  "디지털 안전 3법": "mg-digital-safety-3",
  "IT 거버넌스(IT-Governance)": "mg-it-governance",
  "IT 거버넌스": "mg-it-governance",
  "ISO 38500:2024": "mg-iso38500",
  "IT-Compliance": "mg-it-compliance",
  "환경분석": "mg-env-analysis",
  "Ansoff Matrix": "mg-ansoff",
  "BCG Matrix": "mg-bcg",
  "정보시스템 하드웨어 규모산정 지침": "mg-hw-sizing",
  "가치사슬(Value Chain)": "mg-value-chain",
  "PDCA(Plan-Do-Check-Act, Deming Cycle)": "mg-pdca",
  "MECE와 LISS": "mg-mece-liss",
  "ISP 및 ISMP 수립 공통가이드 9판(2025.05)": "mg-isp-guide",
  "ISP (Information Strategy Planning)": "mg-isp",
  "ISP (Information Strategy Plan)": "mg-isp",
  "ISMP (Information System Master Plan)": "mg-ismp",
  "TRL(Technology Readiness Level)": "mg-trl",
  "기술수용 주기(Technology Adoption Life Cycle)": "mg-talc",
  "IT 투자성과 평가": "mg-it-invest",
  "기술 가치 평가": "mg-tech-value",
  "지식재산권": "mg-ipr",
  "OKR": "mg-okr",
  "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)": "mg-bsc",
  "ESG 경영": "mg-esg",
  "디자인 씽킹(Design Thinking)": "mg-design-thinking",
  "서비타이제이션(Servitization)": "mg-servitization",
  "프로토콜 경제(Protocol Economy)": "mg-protocol-economy",
  "의도 경제(Intention Economy)": "mg-intention-economy",
  "그로스 해킹(Growth hacking)": "mg-growth-hacking",
  "시빅 해킹(Civic Hacking)": "mg-civic-hacking",
  // ── 6주차 보안(SC) ──
  "암호화(Encryption)": "sc-encryption",
  "Shannon의 암호 설계 원칙": "sc-shannon-principle",
  "해시 함수의 안전성": "sc-hash-security",
  "해시 솔트(Salt)와 키 스트레칭(Key Stretching)": "sc-salt-key-stretching",
  "디피-헬만 알고리즘(Diffie-Hellman Algorithm)": "sc-diffie-hellman",
  "블록 암호화(Block Cipher)": "sc-block-cipher",
  "암호학적 보안 강도(Security Strength)": "sc-security-strength",
  "동형 암호(Homomorphic Encryption)": "sc-homomorphic",
  "암호 분석 공격(Cryptanalysis Attacks) 기법": "sc-cryptanalysis",
  "양자 암호(Quantum Cryptography)": "sc-quantum-crypto",
  "포스트 양자 암호(Post-Quantum Cryptography)": "sc-pqc",
  "딥보이스(Deep Voice) 피싱": "sc-deepvoice",
  "OWASP Top 10 for LLM Application 2025": "sc-owasp-llm",
  "사이버전(Cyber Warfare)": "sc-cyber-warfare",
  "APT(Advanced Persistent Threat) 공격": "sc-apt",
  "스니핑(Sniffing) & 스푸핑(Spoofing)": "sc-sniffing-spoofing",
  "BPF(Berkeley Packet Filter) Door": "sc-bpf-door",
  "부채널 공격(Side Channel Attack)": "sc-side-channel",
  "드라이브 바이 다운로드(Drive By Download)": "sc-drive-by-download",
  "공급망 공격(Supply Chain Attack)": "sc-supply-chain",
  "DoS(Denial of Service)": "sc-dos",
  "DRDoS(Distributed Reflection DoS)": "sc-drdos",
  "RaaS(Ransomware as a Service)": "sc-raas",
  "루트킷(Rootkit)": "sc-rootkit",
  "OWASP Top 10:2021": "sc-owasp-2021",
  "OWASP Top 10:2025": "sc-owasp-2025",
  "시큐어 코딩(Secure Coding)": "sc-secure-coding",
  "SSRF(Server-Side Request Forgery)": "sc-ssrf",
  "SW난독화": "sc-sw-obfuscation",
  "DevSecOps": "sc-devsecops",
  "개인정보보호 중심 설계(Privacy by Design)": "sc-pbd",
  "PbD(Privacy by Design) 인증제도": "sc-pbd-cert",
  "가명처리(Pseudonymization) 기법": "sc-pseudonymization",
  "가명정보 처리 가이드라인": "sc-pseudonym-guideline",
  "Secure Software Development Framework(SSDF)": "sc-ssdf",
  "DNS 싱크홀(Sinkhole)": "sc-dns-sinkhole",
  "DNSSEC(Domain Name System Security Extension)": "sc-dnssec",
  "IPSec": "sc-ipsec",
  "TLS/SSL(Secure Socket Layer)": "sc-tls-ssl",
  "VPN(Virtual Private Network)": "sc-vpn",
  "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)": "sc-cwpp-cspm",
  "SASE(Secure Access Service Edge)": "sc-sase",
  "SECaaS(Security as a Service)": "sc-secaas",
  "이중 서명(Dual Signature)": "sc-dual-signature",
  "다중 서명(Multi Signature)": "sc-multi-signature",
  "간편인증 인터페이스 가이드라인": "sc-simple-auth",
  "전자봉투(Digital Envelope)": "sc-digital-envelope",
  "DRM(Digital Right Management)": "sc-drm",
  "디지털 워터마킹(Digital Watermarking)": "sc-watermarking",
  "핑거프린팅(Fingerprinting)": "sc-fingerprinting",
  "생체 인증(텔레바이오 인증)": "sc-biometric",
  "생체정보 보호 안내서(24.12)": "sc-biometric-guide",
  "OAuth(Open Authorize) 2.0": "sc-oauth",
  "패스키(Passkey)": "sc-passkey",
  "공격 표면 관리(Attack Surface Management)": "sc-asm",
  "차세대 SIEM(Security Information and Event Management)": "sc-siem",
  "위협 헌팅(Threat Hunting)": "sc-threat-hunting",
  "위협 모델링(Threat Modeling)": "sc-threat-modeling",
  "WAAP(Web Application and API Protection)": "sc-waap",
  "EDR(Endpoint Detection and Response)": "sc-edr",
  "XDR(eXtended Detection Response)": "sc-xdr",
  "DMARC(Domain-based Message Authentication, Reporting and Conformance)": "sc-dmarc",
  "사이버 디셉션(Cyber Deception)": "sc-cyber-deception",
  "디지털 면역 시스템(DIS, Digital Immune System)": "sc-dis",
  "사이버 레질리언스(Cyber Resilience)": "sc-cyber-resilience",
  "PEC(Privacy-Enhancing Computation)": "sc-pec",
  "영지식증명(Zero Knowledge Proof)": "sc-zkp",
  "기밀컴퓨팅(Confidential Computing)": "sc-confidential-computing",
  "ISO 27017": "sc-iso-27017",
  "개인정보 프라이버시 8원칙": "sc-privacy-8principles",
  "개인정보 보호기술": "sc-privacy-tech",
  "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)": "sc-risk-analysis",
  "IEC 62443": "sc-iec-62443",
  "ISO 27018": "sc-iso-27018",
  "차량 사이버 보안 국제 표준(ISO 21434)": "sc-iso-21434",
  "ISO 27701": "sc-iso-27701",
  "ISO/IEC 20889": "sc-iso-20889",
  "전자증거개시제도(e-Discovery)": "sc-e-discovery",
  "제로트러스트 가이드라인 2.0": "sc-zerotrust-2",
  "SDP(Software Defined Perimeter)": "sc-sdp",
  "접근 제어/접근 통제(Access Control)": "sc-access-control",
  "접근 통제 모델": "sc-access-control-model",
  "정보보호제품 평가·인증(CC 평가·인증) 제도": "sc-cc-cert",
  "개인정보 영향평가(Privacy Impact Assessment)": "sc-pia",
  "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)": "sc-isms-p",
  "정보보호 공시제도": "sc-security-disclosure",
  "안티 포렌식(Anti-forensic)": "sc-anti-forensic",
  "블록체인 암호기술 가이드라인": "sc-blockchain-crypto",
  "자율주행 자동차 보안취약점 및 대응방안": "sc-autonomous-vehicle",
  "사이버 보안 성숙도 모델 인증(CMMC, Cybersecurity Maturity Model Certification)": "sc-cmmc",
  "사이버 게놈(Cyber genome)": "sc-cyber-genome",
  "디지털 포렌식(Digital Forensic)": "sc-digital-forensic",
  "클라우드 포렌식(Cloud Forensic)": "sc-cloud-forensic",
  "스마트시티 보안취약점 및 대응방안": "sc-smart-city",
  "스마트팩토리 보안취약점 및 대응방안": "sc-smart-factory",
  "클라우드 컴퓨팅 취약점, 대응기술": "sc-cloud-computing",
  "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안": "sc-digital-twin",
  "국가 망 보안체계(N2SF)": "sc-n2sf",
  // ── 3주차 확률·통계(ST) ──
  "확률분포": "st-prob-dist",
  "확률분포와 확률 밀도 함수": "st-pdf",
  "정규분포(Normal Distribution)": "st-normal-dist",
  "중심극한정리": "st-clt",
  "데이터 유형": "st-data-type",
  "표본 추출": "st-sampling",
  "표본 추출(Sampling)": "st-sampling",
  "왜도(skewness) & 첨도(kurtosis)": "st-skew-kurt",
  "왜도(Skewness) & 첨도(Kurtosis)": "st-skew-kurt",
  "이상치": "st-outlier",
  "이상치(Outlier)": "st-outlier",
  "결측치": "st-missing-value",
  "결측치(Missing Value)": "st-missing-value",
  "시계열분석": "st-timeseries",
  "베이즈 정리 (Bayes's theorem)": "st-bayes",
  "베이즈 정리(Bayes's theorem)": "st-bayes",
  "기술 통계(Descriptive statistics)": "st-descriptive",
  "추론 통계(Inferential Statistics)": "st-inferential",
  "추정 이론(Estimation Theory)": "st-estimation",
  "연관성 분석(association analysis) - 기초통계": "st-association",
  // ── 신규 추가 토픽(AI 품질·에이전틱 커머스·데이터·AI 보안) ──
  "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)": "sc-owasp-agentic",
  "ISO/IEC 25059:2023(AI 품질모델)": "ai-iso-25059",
  "AP2(Agent Payment Protocol)": "dx-ap2",
  "UCP(Universal Commerce Protocol)": "dx-ucp",
  "ACP(Agentic Commerce Protocol)": "dx-acp",
  "스테이블 코인(Stable coin)": "dx-stablecoin",
  "데이터 스페이스(Data Space)": "dx-data-space",
  "도메인 특화 언어 모델(Domain-Specific Language Model)": "dx-dslm",
  "AI 프라이버시 리스크 관리": "sc-ai-privacy-risk",
  "데이터 상호 운용성 & 데이터 이동권": "dx-data-interop",
  "AI Agent 보안위협": "sc-ai-agent-threat",
  "AI-DLC(AI-Driven SDLC)와 SDD(Spec Driven Development)": "dx-ai-dlc-sdd",
  "AI OS(Artificial Intelligence Operating System)": "dx-aios",
  "연관성 분석(association analysis) — 기초통계": "st-association",
  "회귀분석(Regression Analysis)": "st-regression",
  "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)": "st-aic-bic",
  "통계적 가설검정 (Hypothesis Testing)": "st-hypothesis-test",
  "통계적 가설검정(Hypothesis Testing)": "st-hypothesis-test",
  "ANOVA(Analysis of variance)": "st-anova",
};

export const EXTRAS: Record<string, SubnoteExtra> = {
  "chaos-test": {
    guide: {
      hook: "멀쩡한 건물에 일부러 불난 상황을 만들어 보는 소방 훈련 같은 테스트입니다.",
      scene: "건물이 정말 안전한지는 도면 검사만으로는 모르고, 실제로 대피 훈련을 해 봐야 압니다. 카오스 테스트는 이 훈련처럼 운영 중인 서비스에 일부러 장애(서버 다운·지연 주입)를 일으켜 보고, 평소 수치(정상 지표)와 비교해 견디는지·숨은 약점이 없는지 확인합니다.",
      why: "실행 절차(정상상태-가설-실험-결과-수정)와 카오스 엔지니어링과의 관계가 출제 핵심입니다.",
      mechanism: "절차(정가실결문): 정상 상태(CPU·네트워크 등 정량 지표) 정의→가설 수립(DB 다운돼도 정상 유지 등)→실험 디자인(작업 범위 최소화·롤백 계획)→결과 확인(장애 감지·전파·복구 시간을 정상 지표와 비교해 가설 검증)→문제점 수정. 도구: Chaos Monkey·Kube Monkey·GameDay. 계층별(개발팀→앱→스위칭→인프라). 카오스 엔지니어링의 실천. SRE·회복력 검증.",
      map: [
        { as: "평소 건물 상태 기록", real: "정상 상태", note: "정가실결문" },
        { as: "불나도 견딘다는 예상", real: "가설 수립", note: "" },
        { as: "비상구 열어 두고 훈련", real: "실험 디자인", note: "되돌릴 준비까지" },
        { as: "훈련 결과로 건물 보수", real: "결과·수정", note: "" },
      ],
      usage: "회복력 검증입니다. 시험은 정가실결문 절차, 도구, 카오스 엔지니어링입니다.",
      links: [
        { topic: "카오스 엔지니어링 (Chaos Engineering)", how: "카오스 테스트의 상위 개념입니다." },
        { topic: "성능 테스트", how: "부하·장애 상황 검증을 공유합니다." },
      ],
      exam: "카오스 테스트는 실 서비스에 인위적 장애를 주입해 정상 지표와 비교하는 테스트로, 정상상태·가설·실험·결과·수정 절차로 아키텍처 약점을 찾는 카오스 엔지니어링 실천이다.",
    }, image: "/concept/book/chaos-test.png", easy: "카오스 테스트는 시스템 신뢰성을 확인하기 위해 실 서비스에 인위적 혼돈(Chaos)을 주입(Failure Injection)해, 출시 전 테스트에서 드러나지 않은 아키텍처 문제를 찾아내는 테스트입니다. 절차는 [정가실결문] — 정상 상태(CPU load·NW I/O 등 정량 지표 측정) → 가설 수립('DB가 다운돼도 정상 유지된다' 같은 시나리오) → 실험 디자인(작업 범위 최소화·롤백 계획 수립) → 결과 확인(장애 감지·전파·복구 시간을 정상 지표와 비교해 가설 검증) → 문제점 수정(지속 개선). 효율적 수행 방안은 Chaos Engineering Team 구축, Chaos Monkey·Kube Monkey·GameDay 같은 도구 활용, 개발팀→애플리케이션→스위칭→인프라 계층별 테스트입니다. '실 서비스에 일부러 장애를 낸다'는 발상과 롤백 계획 같은 안전장치가 짝으로 출제됩니다." },
  "refactoring": {
    guide: {
      hook: "음식 맛은 그대로 두고, 어질러진 주방만 정리해 요리하기 쉽게 만드는 일입니다.",
      scene: "맛집이라도 주방 살림이 뒤엉켜 있으면 다음 요리가 점점 느려집니다. 리팩토링은 주방 정리와 같이 메뉴 맛(겉보기 기능)은 그대로 둔 채 코드 속만 깔끔하게 고치는 일이고, 정리 뒤 맛이 변하지 않았는지 맛보기 검사(회귀 테스트)로 확인합니다.",
      why: "'기능 불변·구조 개선'과 코드 냄새·기법, 테스트와의 짝이 출제 핵심입니다. 기술 부채와 연결됩니다.",
      mechanism: "대상(코드 냄새·중긴큰긴산): 중복 코드, 긴 메소드, 큰 클래스, 긴 파라미터 리스트, 산탄총 수술(한 변경이 여러 곳 수정). 기법: 결합도 측면(클래스 이동), 응집도 측면(메소드 추출), 단순화, 은닉. 원칙: 기능 변경 없음(회귀 테스트로 보장 — 리팩토링과 테스트는 짝). 작은 단위로 자주. 효과: 유지보수성·가독성·기술 부채 상환. TDD의 Refactor 단계. 마틴 파울러.",
      map: [
        { as: "맛은 그대로, 주방만 정리", real: "동작 불변", note: "핵심" },
        { as: "겹치는 살림·너저분한 선반", real: "코드 냄새", note: "중긴큰긴산" },
        { as: "그릇 옮기기·서랍 나누기", real: "리팩토링 기법", note: "" },
        { as: "정리 뒤 맛보기 검사", real: "테스트와 짝", note: "안전망" },
      ],
      usage: "코드 품질·기술 부채 상환입니다. 시험은 기능 불변, 코드 냄새·기법, 테스트와의 관계입니다.",
      links: [
        { topic: "기술 부채(Technical Debt)", how: "리팩토링이 부채를 상환합니다." },
        { topic: "TDD (Test Driven Development)", how: "TDD의 Refactor 단계입니다." },
      ],
      exam: "리팩토링은 겉보기 기능을 유지한 채 내부 구조를 개선하는 기법으로, 중복·긴 메소드 등 코드 냄새를 메소드 추출 등으로 정리하며 회귀 테스트가 안전망이 된다.",
    }, image: "/concept/book/refactoring.png", images: ["/concept/extra/refactoring-process.png"], imagesLabel: "절차", easy: "리팩토링은 모듈의 외부 기능은 그대로 두고 내부 구조·관계만 단순화해 유지보수성을 높이는 기법입니다. 대상(코드 악취) [중긴큰긴산] — 중복된 코드, 긴 메소드, 큰 클래스, 긴 파라미터 리스트, 산탄총 수술(한 변경이 여러 클래스 수정 유발). 기법은 결합도 측면(클래스 이동 등), 응집도 측면(메소드 추출 등), 단순화, 은닉으로 분류됩니다. '기능 변경 없음'이 정의의 생명이고, 테스트(회귀)와 세트로 진행해야 안전하다는 것까지 쓰면 완성입니다." },
  "keyword-driven-testing": {
    guide: {
      hook: "테스트를 '키워드(동작 단어) 조합으로 조립'하는 자동화 기법입니다.",
      scene: "테스트 스크립트를 코드로만 짜면 비개발자는 못 만듭니다. 키워드 주도 테스트는 '로그인', '클릭', '입력' 같은 키워드를 미리 만들어 두고, 이를 조합해 테스트를 짜, 비개발자도 유지보수하게 합니다(ISO 29119-5).",
      why: "'키워드 조합·비개발자 접근성'과 데이터 주도 테스트와의 관계가 출제 포인트입니다.",
      mechanism: "구성(ISO 29119-5): 키워드(동작 단위 — 재사용 가능 함수), 테스트 케이스(키워드+데이터 조합), 프레임워크(키워드 라이브러리·데이터 저장소·해석기·실행엔진·SUT 연동). 절차: 키워드 정의→테스트 작성(조합)→실행→키워드 리팩토링. 장점: 비개발자 작성·유지보수 용이·재사용. 데이터 주도(Data-Driven — 같은 스크립트에 데이터만 교체)와 결합(하이브리드). 자동화 테스트 프레임워크.",
      map: [
        { as: "동작 단위 재사용", real: "키워드", note: "" },
        { as: "키워드 조합", real: "테스트 케이스", note: "" },
        { as: "비개발자도 작성", real: "접근성", note: "핵심" },
        { as: "데이터만 교체", real: "데이터 주도 결합", note: "" },
      ],
      usage: "테스트 자동화입니다. 시험은 키워드 조합, 비개발자 접근성, 데이터 주도와의 관계입니다.",
      links: [
        { topic: "ISO 29119", how: "29119-5가 키워드 주도 테스팅입니다." },
        { topic: "탐색적 테스트", how: "다른 테스트 접근과 대비됩니다." },
      ],
      exam: "키워드 주도 테스트는 재사용 가능한 키워드(동작)를 조합해 테스트를 조립하는 자동화 기법(ISO 29119-5)으로, 비개발자도 작성·유지보수할 수 있고 데이터 주도와 결합한다.",
    }, image: "/concept/book/keyword-driven-testing.png", easy: "키워드 주도 테스트는 테스트를 '키워드(동작 단어)'로 조립하는 자동화 기법으로, ISO/IEC/IEEE 29119 Part 5에 명시된 국제 표준 테스트 기법입니다. 프레임워크 구성요소 — 테스트 라이브러리 저장소, 테스트 데이터 저장소, 편집기, 해석기와 데이터 시퀀서, 툴 브리지, 실행엔진, SUT(테스트 대상). 절차는 키워드 정의 → 키워드 테스트 케이스 작성 → 실행 → 키워드 리팩토링. 비개발자도 키워드 조합으로 테스트를 만들 수 있어 유지보수가 쉽다는 것이 강점이자 시험 포인트입니다." },
  "three-r": {
    guide: {
      hook: "옛집을 뜯어 도면을 되그리고, 고쳐 짓고, 자재를 다시 쓰는 방식입니다.",
      scene: "설계도가 사라진 옛집은 벽을 뜯어 보며 도면을 거꾸로 그려 내고, 그 도면으로 고쳐 짓고, 멀쩡한 자재는 창고에 모아 다시 씁니다. 3R이 딱 이 방식으로, 코드에서 설계를 뽑아내고(역공학) 새 모습으로 다시 만들고(재공학) 검증된 부품을 다시 쓰며(재사용), 그 중심에 자재 창고(레포지토리)가 있습니다.",
      why: "3R(Reverse·Re-Engineering·Re-Use)의 역할 구분과 레포지토리 중심이 출제 핵심입니다.",
      mechanism: "역공학(Reverse Engineering): 코드·바이너리에서 설계 정보 추출(코드→설계서·모델). 재공학(Re-Engineering): 추출 정보로 재설계·재구조화해 새 형태로 변환 — 유지보수성 향상(리팩토링·마이그레이션 포함). 재사용(Re-Use): 검증된 컴포넌트를 다시 사용 — 필요 속성(독립성·일반성), 합성/생성 중심 기법. 중심 레포지토리(형상·자산 저장소). '역공학=이해, 재공학=개선, 재사용=활용'. 레거시 현대화에 활용.",
      map: [
        { as: "벽 뜯어 도면 되그리기", real: "역공학(이해)", note: "" },
        { as: "도면 보고 고쳐 짓기", real: "재공학(개선)", note: "" },
        { as: "멀쩡한 자재 다시 쓰기", real: "재사용(활용)", note: "" },
        { as: "가운데 자재 창고", real: "레포지토리", note: "셋의 중심" },
      ],
      usage: "레거시 현대화·재사용입니다. 시험은 3R 역할, 레포지토리 중심입니다.",
      links: [
        { topic: "유지보수", how: "3R은 유지보수·현대화 기법입니다." },
        { topic: "소프트웨어 리팩토링", how: "재공학의 한 형태입니다." },
      ],
      exam: "3R은 코드에서 설계를 추출하는 역공학(이해), 재설계·변환하는 재공학(개선), 검증 부품을 다시 쓰는 재사용(활용)을 레포지토리 중심으로 수행하는 생산성 향상 접근법이다.",
    }, image: "/concept/book/three-r.png", easy: "3R은 소프트웨어 생산성 극대화를 위해 레포지토리를 기반으로 역공학·재공학·재사용을 쓰는 공학적 접근법입니다. 역공학(Reverse): 코드·바이너리에서 설계 정보를 거꾸로 추출(코드→설계서). 재공학(Re-Engineering): 추출한 정보로 재설계·재구조화해 새 형태로 변환 — 유지보수성 향상. 재사용(Re-Use): 검증된 컴포넌트를 다시 사용 — 필요 속성(독립성·일반성)과 합성·생성 기법. '역공학은 이해, 재공학은 개선, 재사용은 활용'으로 역할을 구분하고, 셋의 중심에 레포지토리가 있다는 구조가 답안 뼈대입니다." },
  "turing-test": {
    guide: {
      hook: "대화만 나눠 보고 누가 사람인지 못 맞히면, 그 기계를 똑똑하다고 인정하는 판정법입니다.",
      scene: "복면 쓴 가수의 노래만 듣고 정체를 맞히는 방송처럼, 심판이 커튼 뒤 상대와 글로만 대화하며 사람인지 기계인지 맞혀 봅니다. 심판이 끝내 구별하지 못하면 그 기계에 지능이 있다고 보는 판정법(튜링 테스트, 1950)으로, 인공지능 판별의 고전 기준입니다.",
      why: "'모방 게임·행동주의적 지능 판정'과 한계·현대적 의미가 출제 포인트입니다. AI 테스트와 연결됩니다.",
      mechanism: "모방 게임(Imitation Game): 심판이 텍스트로 인간·기계와 각각 대화 → 어느 쪽이 기계인지 구별 못 하면 통과. 행동주의(내부 이해가 아닌 겉보기 행동으로 지능 판정). 한계: 지능이 아닌 속임수도 통과 가능(중국어 방 반론 — 이해 없이 규칙만), 대화에 국한. 응용: CAPTCHA(역튜링 — 사람만 통과), 챗봇 평가. 현대 LLM은 사실상 통과 → 새 벤치마크 필요. AI 시스템 테스트 계보.",
      map: [
        { as: "커튼 뒤 정체 맞히기", real: "모방 게임", note: "" },
        { as: "겉으로 보이는 말솜씨로만 판정", real: "행동주의 판정", note: "" },
        { as: "대본만 잘 읽어도 합격", real: "중국어 방 반론", note: "한계" },
        { as: "사람만 푸는 문제로 봇 거르기", real: "CAPTCHA(역튜링)", note: "응용" },
      ],
      usage: "AI 지능 판정·챗봇 평가입니다. 시험은 모방 게임, 한계(중국어 방), CAPTCHA입니다.",
      links: [
        { topic: "ISO 29119-11", how: "AI 시스템 테스트로 확장됩니다." },
        { topic: "테스트 오라클", how: "AI 판정 기준 문제를 공유합니다." },
      ],
      exam: "튜링 테스트는 기계가 대화로 인간과 구별 안 되면 지능이 있다고 보는 모방 게임으로, 겉보기 행동으로 판정하나 중국어 방 반론 같은 한계가 있고 CAPTCHA로 응용된다.",
    }, image: "/concept/book/turing-test.png", easy: "튜링 테스트는 기계가 인간과 구별할 수 없을 정도의 지적 행동을 보이는지 대화로 확인하는 imitation game 방식의 테스트입니다. 판정자가 벽 너머의 사람과 기계에게 같은 질문을 던지고, 답만 보고 어느 쪽이 기계인지 구별하지 못하면 그 기계는 지능이 있다고 판정합니다. 활용은 이미지 인식(CAPTCHA — 사람만 풀 수 있는 문제로 봇을 거르는 역튜링 테스트)과 의료 분야 등. AI 시스템 테스트·ISO 29119-11과 묶어 'AI를 어떻게 검증하나' 계보로 출제됩니다." },
  "regression-test": {
    guide: {
      hook: "한 군데 고친 뒤, 멀쩡하던 다른 곳까지 다시 켜 보고 확인하는 테스트입니다.",
      scene: "집에서 수도를 고치고 나면 멀쩡하던 보일러와 전등까지 다시 켜 봐야 안심이 됩니다. 회귀 테스트도 이와 같이 코드 한 곳을 고친 뒤 기존 기능을 전부 다시 돌려 보며 엉뚱한 곳이 깨지지 않았는지(파급효과·부작용) 확인하고, 매번 반복되는 일이라 자동으로 돌립니다(자동화·CI).",
      why: "'변경 부작용 검출'과 선택 전략(전체·선택·우선순위), 자동화·CI가 출제 핵심입니다.",
      mechanism: "목적: 변경(수정·추가)이 기존 기능에 미친 부작용(Ripple Effect 파급·Side Effect 부작용) 검출. 전략: 전체 재실행(Retest All — 확실·비쌈), 선택적(변경 영향 부분만 — 영향 분석), 우선순위 기반(중요·위험 순), 테스트 최소화. 자동화 필수(반복 실행 — CI/CD에서 매 커밋). 테스트 스위트 관리(노후 케이스 제거). 살충제 역설 주의(갱신 필요).",
      map: [
        { as: "고친 뒤 온 집 다시 점검", real: "회귀 테스트", note: "" },
        { as: "엉뚱한 곳 고장", real: "Ripple·Side Effect", note: "파급·부작용" },
        { as: "수도 쪽 방만 골라 점검", real: "선택적 재실행", note: "" },
        { as: "자동 점검 장치", real: "필수", note: "매번 반복되므로" },
      ],
      usage: "변경 관리·CI입니다. 시험은 부작용 검출, 선택 전략, 자동화입니다.",
      links: [
        { topic: "데브옵스 (DevOps)", how: "CI에서 회귀 테스트를 자동 실행합니다." },
        { topic: "테스트 원리", how: "살충제 역설이 회귀 테스트에 적용됩니다." },
      ],
      exam: "회귀 테스트는 변경 후 기존 기능의 파급효과·부작용을 검출하는 테스트로 전체·선택·우선순위 재실행 전략이 있으며, 반복 실행을 위해 자동화·CI가 필수다.",
    }, image: "/concept/book/regression-test.png", easy: "회귀 테스트는 프로그램을 수정·확장한 뒤 변경 부분뿐 아니라 기존 기능까지 다시 테스트해 오류를 검출하는 기법입니다. 고친 곳 때문에 멀쩡하던 곳이 망가지는 것을 잡는 게 목적입니다. 종류 3가지 — Reset All(전체 재수행: 확실하나 비용 큼), Selective(변경 영향 부분만 선별), Priority(우선순위 높은 것부터). 검출하는 오류도 2가지로 구분 — Ripple Effect(파급효과: 변경이 다른 모듈로 번짐)와 Side Effect(부작용: 의도치 않은 동작). 자동화(CI)와 묶어서 출제되기도 합니다." },
  "test-exit-criteria": {
    guide: {
      hook: "'테스트를 언제 끝낼지' 정하는 정량 완료 조건입니다.",
      scene: "테스트는 결함이 0이 될 때까지가 아니라(완벽 불가), 미리 정한 기준을 채우면 끝냅니다. 커버리지 달성률·잔여 결함·일정 같은 지표로 종료 시점을 객관적으로 정합니다.",
      why: "완료 조건 항목과 '완벽 테스팅 불가 → 종료 조건 필요' 논리가 출제 핵심입니다.",
      mechanism: "완료 조건(완목기커리스): 테스트 완전성(모든 TC 수행·심각 결함 미존재), 테스트 목적(품질 목표 달성), 테스트 기준(수립 완료 조건 도달, 예: TC 90% 통과), 테스트 커버리지(요구·코드 커버리지 달성), 테스트 리스크(잔여 위험 수용 가능), 테스트 스케줄(예정 일정 종료). 근거: 완벽 테스팅 불가·자원 유한. 우선순위 높은 버그 100% 해결 등 원칙. 위험 기반으로 잔여 위험 판단. 종료 보고서.",
      map: [
        { as: "TC 수행·심각 결함 0", real: "테스트 완전성", note: "완목기커리스" },
        { as: "커버리지 달성", real: "테스트 커버리지", note: "" },
        { as: "잔여 위험 수용", real: "테스트 리스크", note: "" },
        { as: "완벽 불가 → 기준으로", real: "근거", note: "" },
      ],
      usage: "테스트 종료 판단입니다. 시험은 완료 조건 항목, 완벽 테스팅 불가와의 연결입니다.",
      links: [
        { topic: "테스트 원리", how: "완벽 테스팅 불가가 종료 조건의 근거입니다." },
        { topic: "위험 기반 테스트", how: "잔여 위험으로 종료를 판단합니다." },
      ],
      exam: "테스트 종료 조건은 커버리지 달성·잔여 결함·리스크·일정 등 정량 기준으로 종료 시점을 정하며, 완벽 테스팅이 불가능하므로 기준 충족 시 테스트를 끝낸다.",
    }, image: "/concept/book/test-exit-criteria.png", easy: "테스트 종료 조건은 추정 결함밀도, 커버리지 달성률, 일정·비용 같은 정량 지표로 하나의 테스트 레벨 또는 특정 목적 테스팅의 종료 시점을 정하는 완료 조건입니다. 완료 조건 [완목기커리스] — 테스트 완전성(모든 TC 수행·심각 결함 미존재), 테스트 목적(품질 목표 달성, 예: 만족도 90% 이상), 테스트 기준(수립한 완료 조건 기준 도달, 예: TC 90% 만족), 테스트 커버리지(요구사항 모두 충족), 테스트 리스크(예상 위험 제거 완료), 테스트 스케쥴(예정 일정 종료). 기본 원칙으로 요구 기능의 정상 동작·산출물 최신화(구현 관점)와 우선순위 높은 버그 100% 해결(단계 관점)이 제시됩니다. 테스트는 결함이 0이 될 때까지가 아니라(완벽 테스팅 불가 원리) 정해둔 기준 충족 시 끝낸다는 발상이 핵심 — 테스트 원리 토픽과 엮어 출제됩니다." },
  "lehman": {
    guide: {
      hook: "소프트웨어는 '계속 변화하며 진화한다'는 것을 3유형·8원리로 설명한 법칙입니다.",
      scene: "SW는 만들면 끝이 아니라 살아 있는 것처럼 계속 바뀝니다. 레만의 법칙은 왜 SW가 계속 변경되고, 복잡해지고, 품질이 떨어지는지를 유형과 원리로 정리했습니다. 유지보수의 이론적 근거입니다.",
      why: "3유형(S/P/E-Type)과 8원리, 'E-Type만 진화 대상'이 출제 핵심입니다.",
      mechanism: "시스템 3유형: S-Type(정적 — 명세로 완전 정의, 변화 없음, 예: 수학 계산), P-Type(실용 — 현실 문제 근사), E-Type(내장 — 현실 세계에 박혀 계속 진화, 대부분의 실무 SW). 8원리(계복진조 친지감피): 계속적 변경, 복잡도 증가(무질서도↑ — 리팩토링 없으면), 프로그램 진화(자기 규제), 조직적 안정화, 친근성 유지, 지속적 성장, 품질 감소(환경 변화에 적응 안 하면), 피드백 시스템. E-Type만 8원리 대상. 유지보수·리팩토링의 근거.",
      map: [
        { as: "명세로 완전 정의", real: "S-Type", note: "변화 없음" },
        { as: "현실 근사", real: "P-Type", note: "" },
        { as: "현실에 박혀 진화", real: "E-Type", note: "8원리 대상" },
        { as: "복잡도 증가·품질 감소", real: "8원리", note: "계복진조친지감피" },
      ],
      usage: "유지보수·진화 이해입니다. 시험은 3유형, 8원리, E-Type입니다.",
      links: [
        { topic: "유지보수", how: "SW 진화의 실무 활동입니다." },
        { topic: "소프트웨어 리팩토링", how: "복잡도 증가를 막는 대응입니다." },
      ],
      exam: "레만의 법칙은 SW를 S·P·E-Type 3유형과 계속적 변경·복잡도 증가·품질 감소 등 8원리로 설명하며, 현실에 내장된 E-Type만 8원리의 진화 대상이 된다.",
    }, image: "/concept/book/lehman.png", easy: "레만의 법칙은 소프트웨어의 지속적 진화를 시스템 3유형과 8가지 원리로 설명한 변화의 법칙입니다. 시스템 유형 — S-Type(정적: 명세로 완전 정의, 변화 없음), P-Type(실용: 현실 문제 근사), E-Type(내장: 현실 세계에 박혀 계속 진화). 8원리 [계복진조 친지감피] — 계속적 변경, 복잡도 증가, 프로그램 진화, 조직적 안정화, 친근성 유지, 지속적 성장, 품질 감소, 피드백 시스템. 'E-Type만이 8원리의 대상'이라는 것과, 유지보수·리팩토링의 이론적 근거라는 점이 포인트입니다." },
  "fuzzing-test": {
    guide: {
      hook: "장난감을 던지고 밟아 보며 어디가 부서지는지 미리 찾아보는 테스트입니다.",
      scene: "장난감 회사는 출시 전에 아이가 던지고 밟고 물어뜯는 험한 상황을 일부러 흉내 내 봅니다. 퍼징도 이와 같이 프로그램에 아무렇게나 만든 엉터리 입력을 대량으로 쏟아부어 멈추거나 이상해지는 지점(크래시)을 찾고, 그 자리가 곧 보안 구멍(취약점) 후보가 됩니다.",
      why: "'랜덤·비정상 입력으로 취약점 발견'과 유형(랜덤·변이·생성 기반)이 출제 핵심입니다. 보안 테스트와 연결됩니다.",
      mechanism: "절차: 대상 분석→입력 값 선정→테스트 케이스 생성→실행→모니터링(크래시·이상)→분류·해결. 유형: 데이터 생성 방식별(랜덤 기반 — 무작위, 변이 기반 Mutation — 유효 입력 변형, 생성 기반 Generation — 명세로 생성). 커버리지 유도(AFL 등 커버리지 가이드 퍼징). 크래시=취약점 후보(버퍼 오버플로·역참조). 보안 테스트·시큐어 코딩 검증. CI 통합(지속 퍼징).",
      map: [
        { as: "마구잡이로 험하게 다루기", real: "퍼징", note: "" },
        { as: "부서진 자리가 약한 곳", real: "취약점 발견", note: "핵심" },
        { as: "정상 장난감 조금 비틀기", real: "변이 기반", note: "" },
        { as: "설명서 보고 시험 만들기", real: "생성 기반", note: "" },
      ],
      usage: "보안 취약점 발견입니다. 시험은 퍼징 유형, 크래시=취약점, 시큐어 코딩과의 관계입니다.",
      links: [
        { topic: "시큐어 코딩(Secure Coding)", how: "퍼징으로 시큐어 코딩을 검증합니다." },
        { topic: "화이트박스 테스트", how: "커버리지 가이드 퍼징과 연계됩니다." },
      ],
      exam: "퍼징 테스트는 랜덤·비정상 데이터를 대량 입력해 크래시·예외를 유발하고 그 지점을 취약점 후보로 찾는 보안 테스트로, 랜덤·변이·생성 기반 유형이 있다.",
    }, image: "/concept/book/fuzzing-test.png", easy: "퍼징은 제품에 랜덤·비정상 데이터를 대량 입력해 예외와 오류를 분석하고 보안 취약점을 찾아내는 테스팅 기법입니다. 절차 6단계 — 대상 분석 → 입력 값 선정 → 테스트 케이스 생성 → 실행 → 시스템 동작 모니터링 → 문제 분류·해결. 유형은 세 축으로 나뉩니다: 데이터 생성 방식(랜덤/변이/생성 기반), 데이터 투입 방식, 변조 대상. 크래시가 나면 그 지점이 곧 취약점 후보라는 것, 그리고 보안 테스트(시큐어 코딩 검증)와 짝으로 나온다는 것이 시험 포인트입니다." },
  "performance-test": {
    guide: {
      hook: "손님이 몰리는 점심시간에도 주문이 밀리지 않는지 재 보는 테스트입니다.",
      scene: "식당은 한가할 때 잘하는 것보다 점심 러시에 얼마나 버티는지가 진짜 실력입니다. 성능 테스트는 이 러시아워처럼 손님(부하)을 잔뜩 몰아넣고 음식 나오는 속도(응답시간)와 시간당 내는 그릇 수(처리량)를 재서, 어느 조리대가 밀리는지(병목)까지 찾아냅니다.",
      why: "성능 지표(응답시간·처리량·자원사용·가용도)와 유형(부하·스트레스·스파이크·내구)이 출제 핵심입니다.",
      mechanism: "지표: 응답시간(요청 하나 소요), 처리량(Throughput — 단위시간 처리량), 자원 사용량(CPU·메모리), 반환시간, 가용도. 유형: 부하 테스트(예상 부하에서 성능), 스트레스 테스트(한계 초과 — 임계점·복구), 스파이크(급증), 내구/소프(Soak — 장시간 안정성·메모리 누수), 용량 테스트. 절차: 목표 정의→시나리오 설계→실행→분석→튜닝. 도구: JMeter·k6·Gatling. 병목 식별(APM).",
      map: [
        { as: "주문 한 건 나오는 속도", real: "응답시간", note: "" },
        { as: "한 시간에 내는 그릇 수", real: "처리량(Throughput)", note: "" },
        { as: "점심 러시 미리 재현", real: "부하 테스트", note: "예상 손님 수" },
        { as: "만석 넘겨 몰아넣기", real: "스트레스 테스트", note: "한계·복구 확인" },
      ],
      usage: "성능 검증·용량 계획입니다. 시험은 성능 지표, 부하/스트레스/내구 유형입니다.",
      links: [
        { topic: "카오스 테스트 (Chaos Test)", how: "장애 상황 회복력을 검증합니다." },
        { topic: "QoS(Quality of Service)", how: "성능 지표를 공유합니다." },
      ],
      exam: "성능 테스트는 응답시간·처리량·자원사용·가용도를 부하·스트레스·스파이크·내구 유형으로 측정해 성능 목표 충족과 병목을 검증하는 테스트다.",
    }, image: "/concept/book/performance-test.png", easy: "성능 테스트는 개발된 시스템이 주어진 환경에서 요구사항의 목표치를 달성하는지 확인하는 테스트입니다. 프로세스는 요구사항 정의 → 계획·설계 → 구현·수행 → 종료. 성능 지표 6종을 정확히 — 응답시간(요청 하나의 소요 시간), 시간당 처리량(Throughput), 자원사용량(Utilization), 효율성, 반환시간(Turnaround), 가용도(Availability). 유형은 테스트 방법 측면(부하·스트레스 등 7종)과 목적 측면 4종으로 표에 정리돼 있습니다. '응답시간=하나의 속도, 처리량=단위시간의 양'의 구분이 답안 기본기입니다." },
  "iso-29119": {
    guide: {
      hook: "지점마다 제각각이던 점검 방식을 하나로 맞춘 세계 공통 점검 교본입니다.",
      scene: "프랜차이즈 본사는 지점마다 제각각이던 위생 점검을 공통 점검 교본 한 벌로 통일합니다. ISO 29119가 이 교본 같은 국제 규격으로, 테스트의 개념·절차(프로세스)·기록(문서화)·요령(기법)·조립식 작성(키워드 주도)을 부(파트)별로 정해 어디서든 같은 방식으로 테스트하게 합니다.",
      why: "구성 파트(1~5)와 각 내용이 출제 핵심입니다. AI 확장(29119-11)과 연결됩니다.",
      mechanism: "구성(개프도테키): Part 1(개념·정의), Part 2(테스트 프로세스 — 조직/관리/동적 3계층), Part 3(테스트 문서화 — 계획·설계·결과 문서), Part 4(테스트 기법 — 명세·구조·경험 기반), Part 5(키워드 주도 테스팅). 확장: Part 11(AI 시스템 테스트 지침). 목적: 테스트 표준화·일관성·품질. 어느 개발 방법론에도 적용. CMMI·ISO 25010 등과 연계.",
      map: [
        { as: "용어 풀이 첫 장", real: "Part 1", note: "개프도테키" },
        { as: "점검 절차 3단계 층", real: "Part 2", note: "조직·관리·동적" },
        { as: "기록지·점검 요령·조립식 작성", real: "Part 3·4·5", note: "" },
        { as: "인공지능 점검 부록", real: "Part 11", note: "확장" },
      ],
      usage: "테스트 표준화입니다. 시험은 파트 1~5 내용, Part 11(AI)입니다.",
      links: [
        { topic: "Test Process", how: "Part 2가 테스트 프로세스입니다." },
        { topic: "ISO 29119-11", how: "AI 테스트 확장 파트입니다." },
      ],
      exam: "ISO 29119는 테스트 개념(1)·프로세스(2)·문서화(3)·기법(4)·키워드 주도(5)를 다루는 테스트 국제 표준 시리즈로, Part 11이 AI 시스템 테스트로 확장됐다.",
    }, image: "/concept/book/iso-29119.png", easy: "ISO 29119는 SW 개발 생명주기 전 과정의 테스팅 프로세스와 산출물을 다루는 소프트웨어 테스트 국제 표준 시리즈입니다. 구성 [개프도테키] — Part 1 개념과 정의, Part 2 테스트 프로세스(조직/관리/동적 3계층), Part 3 테스트 문서화, Part 4 테스트 기법, Part 5 키워드 주도 테스팅. 여기에 Part 11이 AI 시스템 테스트 지침으로 확장됐습니다. '몇 부가 무엇인가'를 두음으로 잡고, 테스트 프로세스 3계층(조직→관리→동적)이 단골입니다." },
  "iso-29119-11": {
    guide: {
      hook: "정답지가 없는 논술을 채점하듯, 인공지능을 검사하는 요령을 담은 지침입니다.",
      scene: "수학 시험은 정답지가 있지만 논술은 정답지가 없어 채점 요령이 따로 필요합니다. 인공지능도 정답 판정 기준(오라클)이 모호하고 같은 질문에 답이 달라져서, ISO 29119-11은 논술 채점 요령처럼 답끼리 맞대 보고(백투백) 문제를 비틀어도 답의 관계가 유지되는지 보는(변성 테스트) 요령을 담았습니다.",
      why: "'AI 오라클 문제와 해법(변성·백투백·A/B)'이 출제 핵심입니다. 29119 시리즈의 AI 확장입니다.",
      mechanism: "AI 시스템 특성: 비결정성(같은 입력 다른 출력), 오라클 문제(기대값 모름), 데이터 의존, 자가 학습·설명 어려움. 블랙박스 기법: 조합 테스트, 백투백(다른 구현 비교), A/B 테스팅, 변성 테스트(Metamorphic — 입력 변형 시 출력 관계 유지 검증), 탐색적. 품질 특성(정확성·강건성·공정성·설명가능성) 평가. AI 품질모델(ISO 25059)·위험관리(23894)와 연계. AI 테스트의 오라클 문제→변성·백투백 해법이 핵심.",
      map: [
        { as: "정답지가 없는 시험", real: "기대값 모름", note: "오라클 문제" },
        { as: "문제 비틀어도 답 관계 확인", real: "변성 테스트", note: "해법" },
        { as: "두 답안지 맞대 보기", real: "백투백", note: "" },
        { as: "볼 때마다 답이 달라짐", real: "AI 특성", note: "비결정성" },
      ],
      usage: "AI 시스템 테스트입니다. 시험은 오라클 문제, 변성·백투백, 25059와의 관계입니다.",
      links: [
        { topic: "테스트 오라클", how: "AI 오라클 문제를 다룹니다." },
        { topic: "ISO/IEC 25059:2023(AI 품질모델)", how: "AI 품질 평가와 연계됩니다." },
      ],
      exam: "ISO 29119-11은 AI 시스템 테스트 지침으로, 비결정성·오라클 문제 같은 AI 특성에 변성 테스트·백투백·A/B 등 기법을 제시하며 AI 품질모델(25059)과 연계된다.",
    }, image: "/concept/book/iso-29119-11.png", easy: "ISO 29119-11은 AI 기반 시스템을 도입·테스트하는 방법의 지침을 제공하는 ISO/IEC 기술보고서 — 테스트 표준 ISO 29119의 11부입니다. AI 시스템은 정답 판정 기준(테스트 오라클)이 모호해 기존 기법이 안 통하는데, 이를 위한 블랙박스 기법으로 조합 테스트, 백투백 테스트, A/B 테스팅, 변성 테스트(Metamorphic — 입력을 변형해도 출력 관계가 유지되는지), 탐색적 테스트를 제시합니다. 'AI 테스트의 오라클 문제 → 해법이 변성·백투백'이라는 논리 흐름이 답안 뼈대입니다." },
  "mutation-test": {
    guide: {
      hook: "가짜 지폐를 몰래 섞어 두고 감별사가 잡아내는지 보는, 검사의 검사입니다.",
      scene: "지폐 감별사의 실력을 알려면 진짜 돈뭉치에 위조지폐를 몰래 섞어 보면 됩니다. 뮤테이션 테스트도 이와 같이 코드에 일부러 작은 결함(변이체)을 심어 두고 기존 테스트가 잡아내는지 보며, 잡아낸 비율(변이 점수)로 테스트 자체의 실력을 평가합니다.",
      why: "'테스트의 결함 검출력 측정'과 변이 점수, 커버리지 한계 보완이 출제 핵심입니다.",
      mechanism: "절차: 원본 코드에 작은 변경(뮤테이션 연산자 — 연산자·조건·값 변경)을 가한 변이체(mutant) 생성 → 기존 테스트 실행 → 변이체가 테스트 실패시키면 '죽임(killed)', 통과하면 '살아남음(survived, 테스트 미검출)'. 변이 점수(Mutation Score = 죽인 변이/전체)로 테스트 품질 평가. 살아남은 변이는 테스트 보강 대상. 커버리지가 못 보는 단언(assertion) 품질까지 검증. 비용 큼(변이 많음). PIT 등.",
      map: [
        { as: "위조지폐 몰래 섞기", real: "변이체 생성", note: "" },
        { as: "감별사가 잡아냄", real: "죽임(killed)", note: "" },
        { as: "감별사가 놓침", real: "살아남음", note: "테스트가 약함" },
        { as: "잡아낸 비율", real: "변이 점수", note: "테스트 실력" },
      ],
      usage: "테스트 품질 검증입니다. 시험은 변이 점수, 커버리지 한계 보완입니다.",
      links: [
        { topic: "코드 커버리지(Code Coverage)", how: "커버리지가 못 보는 단언 품질을 검증합니다." },
        { topic: "테스트 원리", how: "테스트 자체의 신뢰성을 다룹니다." },
      ],
      exam: "뮤테이션 테스트는 코드에 인위적 변이체를 심어 기존 테스트가 이를 잡는지(죽임) 검증해 변이 점수로 테스트 품질을 평가하며, 커버리지가 못 보는 단언 품질을 검증한다.",
    }, image: "/concept/book/mutation-test.png", easy: "뮤테이션 테스트는 소스 코드를 일정 규칙으로 변형(뮤턴트 생성)한 뒤, 원본과 다른 결과를 내는 테스트케이스를 선별하는 결함 기반 테스트입니다 — 코드가 아니라 '내 테스트의 결함 검출 실력'을 검증하는 테스트의 테스트입니다. 원본 결과 R1과 뮤턴트 결과 R2를 비교해 R1=R2면 그 케이스는 변형도 못 잡은 것(검출력 없음), R1≠R2면 뮤턴트를 잡아낸 유효한 케이스입니다. 뮤테이션 연산자는 대치·변형(치환)·삭제 세 갈래. '테스트케이스의 품질을 평가한다'는 목적이 시험 포인트입니다." },
  "test-process": {
    guide: {
      hook: "예약부터 결과 통보까지 순서가 정해진 건강검진 같은 테스트 절차입니다.",
      scene: "건강검진은 예약·문진으로 계획을 잡고, 받을 검사를 정하고, 검사하고, 판정을 통보하는 순서가 정해져 있습니다. 테스트 프로세스도 검진 절차처럼 계획→설계→실행→평가·종료 단계를 미리 정해 두고(ISO 29119-2), 병원 방침·검진 운영·실제 검사라는 3층 구조로 나뉩니다.",
      why: "테스트 프로세스 단계와 3계층(조직·관리·동적)이 출제 핵심입니다. ISO 29119와 연결됩니다.",
      mechanism: "ISO 29119-2의 3계층: 조직적 테스트 프로세스(정책·전략), 테스트 관리 프로세스(계획·모니터링·통제·완료), 동적 테스트 프로세스(설계·구현·실행·결과보고). 기본 활동: 계획(범위·전략·자원)→모니터링·통제→분석(테스트 기준)→설계(테스트 케이스)→구현(테스트 데이터·환경)→실행→완료(종료 조건·산출물 보관). 반복·병행. 테스트 원리·종료 조건과 연계.",
      map: [
        { as: "병원 전체 방침", real: "조직적 프로세스", note: "3계층 맨 위" },
        { as: "검진 일정 잡고 챙기기", real: "관리 프로세스", note: "" },
        { as: "실제 검사와 판정", real: "동적 프로세스", note: "" },
        { as: "결과 통보하고 마감", real: "완료", note: "종료 조건" },
      ],
      usage: "테스트 관리 체계입니다. 시험은 3계층, 프로세스 단계, ISO 29119입니다.",
      links: [
        { topic: "ISO 29119", how: "29119-2가 테스트 프로세스입니다." },
        { topic: "Test Exit Criteria", how: "완료 단계의 종료 조건입니다." },
      ],
      exam: "테스트 프로세스는 ISO 29119-2의 조직·관리·동적 3계층으로, 계획→모니터링·통제→분석·설계·구현·실행→완료의 활동을 통해 테스트를 체계화한다.",
    }, image: "/concept/book/test-process.png", easy: "테스트 프로세스는 테스트 계획부터 오류 추적·수정까지 테스트 활동을 단계화한 5단계 절차입니다(IEEE 829). [계케실결오] — 테스트 계획(범위·전략·종료기준) → 테스트 케이스 설계 → 테스트 실행 및 측정 → 결과 분석 및 보고 → 오류 추적 및 수정. '테스트도 주먹구구가 아니라 프로세스로 돈다'는 것과, 각 단계의 산출물(계획서·케이스·결과 보고서)이 짝으로 출제됩니다. ISO 29119 Part 2(테스트 프로세스)와 연결해 두세요." },
  "back-to-back": {
    guide: {
      hook: "'두 개 이상의 구현 결과를 비교'해 차이로 결함을 찾는 테스트입니다.",
      scene: "기대값을 알기 어려울 때(오라클 문제), 같은 요구를 다르게 구현한 두 버전에 같은 입력을 넣어 결과를 비교합니다. 결과가 다르면 둘 중 하나에 결함이 있는 것입니다. AI·안전 시스템에 씁니다.",
      why: "'다중 구현 비교로 오라클 대체'와 적용(AI·다중 버전·안전 시스템)이 출제 포인트입니다.",
      mechanism: "같은 명세의 두(이상) 독립 구현(다른 팀·알고리즘·언어)에 동일 입력 → 출력 비교 → 불일치 시 결함(어느 쪽인지 추가 분석). 오라클 문제(기대값 모름) 우회 — 명세만 있으면 됨. 적용: 다중 버전 프로그래밍(N-version, 안전 필수 시스템), AI 모델 비교, 리팩토링 전후 비교, 컴파일러. 한계: 두 구현이 같은 결함을 가지면 못 잡음(공통 원인). ISO 29119-11의 AI 테스트 기법.",
      map: [
        { as: "두 구현 결과 비교", real: "Back-to-Back", note: "" },
        { as: "다르면 결함", real: "불일치 검출", note: "" },
        { as: "기대값 몰라도 됨", real: "오라클 대체", note: "핵심" },
        { as: "AI·안전 시스템", real: "적용", note: "N-version" },
      ],
      usage: "오라클 문제·AI 테스트입니다. 시험은 다중 구현 비교, 오라클 대체, 공통 원인 한계입니다.",
      links: [
        { topic: "테스트 오라클", how: "오라클 문제를 우회합니다." },
        { topic: "ISO 29119-11", how: "AI 테스트 기법입니다." },
      ],
      exam: "Back to Back 테스트는 같은 명세의 여러 독립 구현에 동일 입력을 넣어 결과를 비교해 불일치로 결함을 찾는 기법으로, 오라클 문제를 우회하나 공통 원인 결함은 못 잡는다.",
    }, image: "/concept/book/back-to-back.png", easy: "Back to Back 테스트는 둘 이상의 테스트 시스템(버전)에 동일한 입력을 주고 실행해 결과값을 비교하고, 불일치가 나오면 그 원인을 분석하는 기법입니다. 절차는 Test Case 작성 → 테스트 수행 → 결과값 비교 → 원인 분석. 대표 사례가 자동차 분야의 모델-코드 간 검증 — 모델 분석 → 테스트 케이스 작성 → 모델에서 수행 → 소스코드에서 수행 → 결과 비교·리포트로, 설계 모델과 생성 코드가 같은 동작을 하는지 확인합니다. '정답(오라클) 대신 서로를 비교한다'가 핵심 아이디어입니다." },
  "iso-25010": {
    guide: {
      hook: "차를 살 때 연비·승차감·안전을 두루 따지듯, SW 품질을 보는 채점표입니다.",
      scene: "자동차를 고를 때는 잘 달리는지만이 아니라 연비·승차감·안전·정비 편의까지 항목표를 놓고 두루 따집니다. ISO 25010이 딱 이 채점표로, '좋은 소프트웨어'를 기능성·성능·호환성·사용성·신뢰성·보안·유지보수성·이식성의 8가지 항목으로 나눠 공통 평가 기준을 줍니다.",
      why: "8대 품질 특성과 하위 속성이 출제 핵심입니다. SQuaRE 시리즈·25059(AI)와의 관계가 포인트입니다.",
      mechanism: "제품 품질 8특성(SQuaRE — ISO 25000 시리즈): 기능 적합성(완전·정확·적절), 성능 효율성(시간·자원·용량), 호환성(공존·상호운용), 사용성(학습·운영·접근성 등), 신뢰성(성숙·가용·결함허용·회복), 보안(기밀·무결·부인방지·책임·인증), 유지보수성(모듈·재사용·분석·수정·시험), 이식성(적응·설치·대체). 2023 개정: 보안·안전성 강화. 사용 품질(효과성·효율·만족 등)은 별도. 25040(평가)·25023(측정)과 함께. AI는 25059로 확장.",
      map: [
        { as: "잘 달리나·기름값·짐칸 맞나", real: "8특성(전반)", note: "기능·성능·호환성" },
        { as: "몰기 편한가·안 퍼지나·도난 방지", real: "8특성(중반)", note: "사용성·신뢰성·보안" },
        { as: "정비 편의·다른 길에서도 잘 감", real: "8특성(후반)", note: "유지보수성·이식성" },
        { as: "자율주행차용 새 채점표", real: "25059", note: "AI 확장" },
      ],
      usage: "SW 품질 평가 기준입니다. 시험은 8특성·하위 속성, SQuaRE, 25059와의 관계입니다.",
      links: [
        { topic: "ISO/IEC 25059:2023(AI 품질모델)", how: "25010을 AI로 확장했습니다." },
        { topic: "GS 인증", how: "이 품질모델로 시험합니다." },
      ],
      exam: "ISO/IEC 25010:2023은 SW 제품 품질을 기능적합성·성능효율성·호환성·사용성·신뢰성·보안·유지보수성·이식성 8특성으로 정의한 SQuaRE 표준으로, AI는 25059로 확장된다.",
    }, image: "/concept/book/iso-25010.png", easy: "ISO/IEC 25010:2023은 SW 품질 특성과 평가 Metrics를 정의한 국제표준(SQuaRE 시리즈)의 2023 개정판입니다. 품질 특성 9개 — 기능 적합성, 신뢰성, 상호작용 능력(구 사용성), 성능 효율성, 유지 보수성, 유연성(구 이식성), 보안성, 호환성, 안전성(Safety, 신규). 개정 핵심 — 품질 모델 분리, 대상 변경, 주특성 추가(안전성)·변경(사용성→상호작용 능력, 이식성→유연성), 부특성 정비. '2023에 안전성이 주특성으로 승격'이 최신 출제 포인트입니다." },
  "sp-cert": {
    guide: {
      hook: "음식 맛이 아니라 '주방이 규칙대로 도는지'를 심사해 등급을 주는 인증입니다.",
      scene: "믿을 만한 식당인지 볼 때 음식 맛만이 아니라 주방이 규칙대로 돌아가는지를 심사해 등급을 붙이기도 합니다. SP 인증이 딱 이 방식으로, 기업이 SW를 만드는 과정(개발·관리 프로세스)의 수준을 심사해 1~3등급을 매기고, 공공 SW 사업 참여에 쓰게 합니다.",
      why: "'프로세스 역량 인증'과 등급, GS 인증(제품)과의 구분이 출제 핵심입니다. CMMI와 유사합니다.",
      mechanism: "SP(Software Process) 인증: 조직의 SW 개발·운영 프로세스 성숙도를 심사(프로젝트 관리·개발·지원 프로세스) → 등급(1~3등급). CMMI의 국내판 성격. 대상: SW 개발 조직·기업. 혜택: 공공 SW 사업 발주·평가 가점, 프로세스 역량 증명. GS 인증(제품 품질)과 구분 — SP는 '프로세스(과정)', GS는 '제품(결과)'. 프로세스 개선 유도.",
      map: [
        { as: "주방 운영 방식 심사", real: "SP 인증", note: "과정을 본다" },
        { as: "위생 등급표", real: "1~3등급", note: "" },
        { as: "관공서 납품 가점", real: "혜택", note: "" },
        { as: "주방 심사냐 음식 맛 심사냐", real: "GS와 구분", note: "SP=과정, GS=제품" },
      ],
      usage: "프로세스 역량 인증입니다. 시험은 프로세스 인증, 등급, GS와의 구분, CMMI와의 관계입니다.",
      links: [
        { topic: "GS 인증", how: "제품 인증과 구분됩니다." },
        { topic: "CMMI 3.0", how: "프로세스 성숙도 평가를 공유합니다." },
      ],
      exam: "SP 인증은 SW 기업의 개발·운영 프로세스 성숙도를 심사·등급화하는 프로세스 인증으로, 제품 품질을 시험하는 GS 인증과 구분되며 CMMI와 유사하다.",
    }, image: "/concept/book/sp-cert.png", easy: "SP 인증은 소프트웨어 기업·개발 조직의 '프로세스' 품질 역량을 심사해 등급을 부여하는 제도입니다(소프트웨어 진흥법 제21조, 인증기관 NIPA). 심사 기준 5영역 — 프로젝트 관리(계획·통제·협력업체 관리), 개발(요구사항·분석설계구현·테스트), 지원(품질보증·형상관리·측정분석), 조직관리(조직 프로세스·구성원 교육), 프로세스 개선(조직성과·문제해결·개선관리). 등급은 1~3등급으로, 2등급은 '개별 프로젝트 차원의 프로세스 수립·통제', 3등급은 '조직 차원의 프로세스 정의와 지속적 개선'이 가능한 수준입니다(인증은 2·3등급에 부여). 제품 자체를 시험하는 GS 인증과 달리 SP는 '만드는 과정의 역량'을 봅니다 — 'GS=제품, SP=프로세스' 한 줄 대비와 심사 5영역, 등급별 수준 구분이 시험 포인트입니다." },
  "gs-cert": {
    guide: {
      hook: "주방이 아니라 '음식 맛 자체'를 나라가 직접 시식해 주는 품질 인증입니다.",
      scene: "요리 대회 심사위원은 정해진 채점표를 놓고 음식을 직접 시식하며 점수를 매깁니다. GS 인증도 이 심사처럼 완성된 SW 제품을 공인 시험기관이 국제 채점표(ISO 25023 등)로 시험해 품질을 인증하고, 통과하면 관공서 납품(공공 조달)에서 우대해 줍니다.",
      why: "'제품 품질 시험 인증'과 공공 조달 혜택이 출제 포인트입니다. SP 인증(프로세스)과의 구분이 핵심입니다.",
      mechanism: "GS(Good Software) 인증: TTA 등 시험기관이 ISO/IEC 25023·25051 기반으로 SW 품질 특성(기능적합성·성능·사용성·신뢰성·보안 등) 시험 → 등급 인증(1등급 등). 대상: 상용 SW·패키지. 혜택: 공공 조달 우선구매·수의계약, 신뢰성 확보. 제품 품질 인증(SW 결과물). SP 인증(개발 프로세스·조직)과 구분 — GS는 '제품', SP는 '과정'. ISO 25010 품질모델 기반.",
      map: [
        { as: "음식 직접 시식 심사", real: "GS 인증", note: "제품을 본다" },
        { as: "맛·간·모양새 채점 항목", real: "품질 특성", note: "ISO 25023" },
        { as: "관공서 납품 우대", real: "혜택", note: "" },
        { as: "음식 심사냐 주방 심사냐", real: "SP와 구분", note: "GS=제품, SP=과정" },
      ],
      usage: "SW 품질 인증·조달입니다. 시험은 제품 품질 시험, 조달 혜택, SP와의 구분입니다.",
      links: [
        { topic: "SP 인증", how: "프로세스 인증과 구분됩니다." },
        { topic: "ISO/IEC 25010:2023", how: "품질 시험의 기준 모델입니다." },
      ],
      exam: "GS 인증은 ISO 25023 등 기반으로 상용 SW의 기능·성능·사용성 등 품질을 시험·인증하는 제품 인증으로, 공공 조달 우대를 받으며 프로세스 인증인 SP와 구분된다.",
    }, image: "/concept/book/gs-cert.png", easy: "GS 인증은 국산 SW 제품의 품질 향상을 위해 SW 시험 인증 센터가 국제표준 기반으로 운영하는 한국형 SW '제품' 품질 인증제도입니다. 평가 모델 [23측정 51요구 41평가] — ISO/IEC 25023(품질 측정), 25051(요구사항), 25041(평가 절차). 품질 특성은 기능적합성·성능효율성·호환성·사용성·신뢰성·보안성·유지보수성·이식성 + 일반적 요구사항. 절차는 신청·접수 → 상담 → 계약 → 품질 시험·평가 → 인증 심의 → 적합/부적합. '제품을 보는 GS vs 프로세스를 보는 SP'의 대비가 단골입니다." },
  "cmmi": {
    guide: {
      hook: "조직의 일하는 방식이 몇 단인지 매기는 태권도 승급 심사 같은 모델입니다.",
      scene: "태권도는 흰 띠부터 검은 띠까지 단계가 있어 지금 실력과 다음 목표가 한눈에 보입니다. CMMI도 이 띠 승급처럼 조직이 일하는 방식(프로세스)의 성숙도를 그때그때 임기응변(1 초기)부터 매일 갈고닦는 경지(5 최적화)까지 5단계로 평가해, 부족한 곳과 개선 방향을 알려 줍니다.",
      why: "성숙도 5단계와 단계적/연속적 표현이 출제 핵심입니다. 3.0의 디지털·애자일 반영이 포인트입니다.",
      mechanism: "성숙도 5단계(단계적): 1 초기(Initial — 임기응변·영웅 의존), 2 관리(Managed — 프로젝트별 관리), 3 정의(Defined — 조직 표준 프로세스), 4 정량적 관리(Quantitatively Managed — 측정·통계 통제), 5 최적화(Optimizing — 지속 개선). 연속적 표현(프로세스 영역별 능력 수준). CMMI 3.0: 디지털·애자일·안전·보안 반영, 성과 중심. 프로세스 영역·실천. 프로세스 개선·역량 평가·조달 기준. SP 인증과 연계.",
      map: [
        { as: "흰 띠 — 그때그때 임기응변", real: "1 초기", note: "" },
        { as: "도장 공통 교본대로 수련", real: "3 정의", note: "조직 표준" },
        { as: "기록 재 가며 훈련", real: "4 정량적 관리", note: "측정·통계" },
        { as: "검은 띠 — 매일 갈고닦음", real: "5 최적화", note: "지속 개선" },
      ],
      usage: "프로세스 성숙도 평가입니다. 시험은 5단계, 단계적/연속적, 3.0 특징입니다.",
      links: [
        { topic: "SP 인증", how: "국내 SW 프로세스 인증과 연계됩니다." },
        { topic: "PDCA(Plan-Do-Check-Act, Deming Cycle)", how: "지속 개선 철학을 공유합니다." },
      ],
      exam: "CMMI 3.0은 조직 프로세스 성숙도를 초기·관리·정의·정량적 관리·최적화 5단계로 평가·개선하는 모델로, 단계적·연속적 표현이 있고 디지털·애자일을 반영한다.",
    }, image: "/concept/book/cmmi.png", easy: "CMMI는 조직의 프로세스 개선을 통해 개발의 비용·품질·일정을 충족시키기 위해, 성숙도 레벨별 수행 활동을 제시한 모델입니다(V3.0). 구성 요소 — Category Area > Capability Area > Practices의 계층에 Domain(개발·서비스·공급자 관리 등) 개념이 더해졌습니다. 성숙도 5레벨 — 초기(1) → 관리(2) → 정의(3) → 정량적 관리(4) → 최적화(5). '조직 프로세스의 성숙도를 평가·개선한다'는 목적과 레벨별 키워드(2=프로젝트 단위 관리, 3=조직 표준, 4=정량화, 5=지속 개선)가 답안 핵심입니다." },
  "oss-governance": {
    guide: {
      hook: "공짜 레시피를 쓸 때도 출처와 조건을 지키도록 정한 가게 규칙입니다.",
      scene: "남이 공개한 레시피로 장사하려면 '출처를 밝혀라, 개량한 레시피도 공개하라' 같은 조건을 지켜야 뒤탈이 없습니다. 오픈소스 거버넌스는 이런 조건 챙기기와 같이, 회사가 오픈소스를 쓸 때 사용 허락 조건(라이선스)·보안 구멍(취약점)·사용 목록을 정책과 절차로 챙겨 법적·보안 위험을 막습니다.",
      why: "거버넌스 관리 대상(라이선스·보안·현황)과 정책·프로세스가 출제 핵심입니다.",
      mechanism: "관리 대상: 라이선스 준수(GPL 등 카피레프트 전염성·의무 — 소스 공개·고지, 상용 배포 시 주의), 보안(취약점·SCA), 사용 현황(승인 목록·SBOM), 품질·유지보수. 활동: 오픈소스 정책 수립, 사용 승인 프로세스(OSRB — 오픈소스 리뷰 보드), 라이선스 검토, SCA 도구·SBOM 관리, 기여 정책. 조직 차원 통제(거버넌스). 라이선스 유형: 카피레프트(GPL·LGPL)·퍼미시브(MIT·Apache). 컴플라이언스·보안 통합.",
      map: [
        { as: "개량 레시피도 공개하라는 조건", real: "카피레프트/퍼미시브", note: "GPL·MIT" },
        { as: "새 레시피 들일 때 심사", real: "OSRB 프로세스", note: "사용 승인" },
        { as: "재료 원산지 목록표", real: "SCA·SBOM", note: "보안·현황" },
        { as: "가게 전체 규칙", real: "거버넌스", note: "" },
      ],
      usage: "오픈소스 관리·컴플라이언스입니다. 시험은 라이선스 유형, OSRB·SBOM, 정책입니다.",
      links: [
        { topic: "오픈소스 SW 보안위협", how: "거버넌스가 보안 위협을 통제합니다." },
        { topic: "지식재산권", how: "라이선스 준수와 연계됩니다." },
      ],
      exam: "오픈소스 거버넌스는 라이선스 준수(카피레프트·퍼미시브)·보안·사용 현황을 정책과 OSRB·SBOM으로 관리하는 체계로, 오픈소스의 법적·보안 위험을 통제한다.",
    }, image: "/concept/book/oss-governance.png", easy: "오픈소스 거버넌스는 OSS를 안전하게 사용·적용·배포하기 위한 절차와 체계를 소프트웨어 라이프 사이클 단계별로 제시한 관리 프레임워크입니다. 프레임워크 [정획적운관] 5단계 — 정책수립(전략·조직·라이선스 정책) → 획득(요구 정의·검색·검증·선정) → 적용(설계 반영·컴플라이언스 확인) → 운영 및 유지(모니터링·업데이트·취약점 대응) → 관리 및 개선(성과 측정·프로세스 개선). '라이선스 준수'와 '보안 취약점 관리'라는 두 리스크를 전 주기로 다스린다는 게 핵심이며, 오픈소스 보안위협 토픽의 해법 편입니다." },
  "sw-sizing": {
    guide: {
      hook: "개발할 SW의 '규모(크기)를 정량 산정'해 비용·기간의 근거를 만듭니다.",
      scene: "SW가 얼마나 큰지 알아야 비용·기간·인력을 추정합니다. 규모산정은 기능 점수·라인 수 같은 방법으로 SW 크기를 수치화해, 사업 대가·일정 산정의 출발점이 됩니다.",
      why: "규모 산정 방법(LOC·기능점수)과 비용 산정과의 관계가 출제 핵심입니다.",
      mechanism: "방법: LOC(Line of Code — 코드 라인 수, 구현 후에만 정확·언어 의존), 기능 점수(Function Point — 사용자 기능 기반, 언어 독립·초기 산정 가능·국내 대가 산정 표준), 객체 점수·유스케이스 점수. 규모→노력(맨먼스)→비용·기간(COCOMO 등 비용 모델). 기능점수가 SW 사업대가 산정의 근거(공공). 보정(복잡도·규모). 초기 정확도 한계.",
      map: [
        { as: "코드 라인 수", real: "LOC", note: "구현 후" },
        { as: "사용자 기능 기반", real: "기능 점수(FP)", note: "대가 산정 표준" },
        { as: "규모→노력→비용", real: "비용 산정 연계", note: "" },
        { as: "공공 대가 근거", real: "활용", note: "" },
      ],
      usage: "SW 비용·대가 산정입니다. 시험은 LOC vs 기능점수, 비용 산정과의 관계입니다.",
      links: [
        { topic: "Function Point", how: "대표적 규모 산정 방법입니다." },
        { topic: "SW 사업대가 ('25년 개정판)", how: "규모 산정이 대가 산정의 근거입니다." },
      ],
      exam: "SW 규모산정은 LOC(코드 라인)·기능 점수(FP) 등으로 SW 크기를 정량화하는 것으로, 기능점수가 언어 독립·초기 산정 가능해 공공 SW 사업대가 산정의 근거가 된다.",
    }, image: "/concept/book/sw-sizing.png", easy: "SW 규모산정은 소프트웨어의 양적 크기와 질적 수준을 파악해 소요 공수·자원·기간을 산정하고 실행 가능한 계획을 세우는 비용 산정 과정입니다. 방법 3갈래 — 하향식(전문가 감정·델파이: 간편하나 주관적), 상향식(LOC·M/M: 세부 집계로 객관적), 수학적(FP·COCOMO·Putnam: 모델 기반). 고려사항은 프로젝트 요소·자원 요소·생산성 요소 3축. 방법별 특징·장단점·산정방식 비교표가 단골이며, '초기는 하향식, 상세화되면 수학적'이라는 적용 시점 논리까지 쓰면 완성입니다." },
  "stpa": {
    guide: {
      hook: "부품 고장이 아니라 '지시가 잘못돼' 나는 사고까지 찾아내는 안전 분석입니다.",
      scene: "교차로 사고는 신호등이 고장 나서만이 아니라, 멀쩡한 신호등이 엉뚱한 순간에 파란불을 켜도 일어납니다. STPA는 이런 신호 체계 점검과 같이 사고를 '잘못된 지시(부적절한 제어)'의 문제로 보고, 누가 누구에게 지시하고 보고받는지 그림(제어 구조)을 그려 위험한 지시(UCA)를 찾아냅니다.",
      why: "'시스템 이론·제어 관점'과 전통 기법(FTA·FMEA)과의 차이가 출제 핵심입니다.",
      mechanism: "STAMP(시스템 이론 사고 모델) 기반. 절차: ①분석 범위·손실·위험 정의 → ②제어 구조 모델링(컨트롤러-피제어-피드백) → ③안전하지 않은 제어 행동(UCA — 제어 제공 안 함/잘못 제공/타이밍/지속 오류) 식별 → ④손실 시나리오(UCA의 원인) 도출. 특징: 부품 고장뿐 아니라 SW·인간·상호작용·설계 결함까지, 사고를 창발적 제어 문제로. 자율주행·항공·의료 등 복잡계. FTA·FMEA의 한계 극복.",
      map: [
        { as: "사고=잘못된 신호 지시", real: "시스템 이론(STAMP)", note: "" },
        { as: "지시·보고 흐름 그림", real: "컨트롤러-피드백", note: "제어 구조" },
        { as: "엉뚱한 때 켜진 파란불", real: "UCA 식별", note: "핵심" },
        { as: "고장난 전구만 보던 옛 방식", real: "FTA·FMEA와 차이", note: "" },
      ],
      usage: "복잡계·SW 안전 분석입니다. 시험은 제어 관점·UCA, 전통 기법과의 차이입니다.",
      links: [
        { topic: "FTA (Fault Tree Analysis)", how: "부품 고장 중심 전통 기법과 대비됩니다." },
        { topic: "자율주행 자동차 보안취약점 및 대응방안", how: "복잡계 안전 분석에 활용됩니다." },
      ],
      exam: "STPA는 STAMP 시스템 이론 기반으로 사고를 부적절한 제어로 보고 제어 구조에서 안전하지 않은 제어 행동(UCA)을 찾는 기법으로, 부품 고장 중심 FTA·FMEA의 한계를 극복한다.",
    }, image: "/concept/book/stpa.png", easy: "STPA는 STAMP 이론 기반의 최신 위험분석 기법으로, 부품 고장이 아니라 시스템 요소 간 상호작용(제어)이 안전을 위협하는지 분석합니다. 절차 4단계 — 사고·위험 정의 → Control Structure(제어 구조) 도식화 → UCA(Unsafe Control Actions) 도출 → 원인 시나리오 도출. UCA 4유형이 핵심 — ① 필요한 제어가 제공되지 않음 ② 부적절한 제어 제공 ③ 너무 이르거나 늦음(타이밍) ④ 너무 짧거나 김(지속시간). 고장 없이도 사고가 나는 현대 복잡 시스템(자율주행 등)에 맞는 기법이라는 배경이 답안 차별화 포인트입니다." },
  "eta": {
    guide: {
      hook: "불씨 하나에서 시작해 '그다음은?'을 따라가며 결말을 그려 보는 분석입니다.",
      scene: "산불 훈련에서는 '담뱃불이 떨어졌다'부터 시작해 스프링클러가 켜지면/안 켜지면, 소방차가 오면/못 오면 하는 갈림길을 따라 결말을 미리 그려 봅니다. ETA가 딱 이 갈림길 지도로, 최초 사건에서 안전장치의 성공/실패 가지를 앞으로 펼치며 각 결말의 확률을 셈합니다(전향적·귀납적).",
      why: "'전향적·귀납적'과 FTA(후향·연역)와의 대비가 출제 핵심입니다.",
      mechanism: "전향적(Forward)·귀납적: 초기 사건(Initiating Event)에서 시작 → 안전 방벽·완화 시스템의 성공/실패 분기(이진 트리)로 전개 → 각 경로의 최종 결과(사고 시나리오)와 확률 산출. FTA(정상 사건→원인, 후향·연역)와 방향 반대·상호 보완. 정량(경로 확률). 활용: 원전·화학 안전(사고 결과 분석·완화 대책 평가). FTA-ETA 결합(Bow-tie 분석 — 원인(FTA)+결과(ETA)).",
      map: [
        { as: "불씨에서 결말로 따라가기", real: "전향적·귀납", note: "" },
        { as: "켜지면/안 켜지면 갈림길", real: "이진 트리 전개", note: "" },
        { as: "결말별 가능성 셈하기", real: "결과 분석", note: "확률" },
        { as: "결말에서 불씨로 거슬러 오르기", real: "FTA와 반대", note: "후향·연역" },
      ],
      usage: "사고 결과 분석입니다. 시험은 전향적·귀납, FTA와의 대비, Bow-tie입니다.",
      links: [
        { topic: "FTA (Fault Tree Analysis)", how: "후향·연역과 대비·결합(Bow-tie)됩니다." },
        { topic: "FMEA (Failure Mode and Effects Analysis)", how: "위험 분석 기법을 공유합니다." },
      ],
      exam: "ETA는 초기 사건에서 안전장치의 성공/실패 분기를 따라 결과 시나리오를 전개하는 전향적·귀납적 분석으로, 후향·연역적 FTA와 반대이며 Bow-tie로 결합된다.",
    }, image: "/concept/book/eta.png", easy: "ETA는 초기 이벤트에서 출발해 후속 안전장치의 성공/실패 가지를 치며 각 시나리오의 발생 확률을 계산하는 정량적·귀납적 위험 분석기법입니다. 절차 [범위초 트결경] — 분석 대상·범위 정의 → 시스템 위험(사고) 정의 → 초기 이벤트 정의 → Event Tree 전개 → 결과 리스크 파악 → 위험 경감 대책 수립. FTA가 '결과→원인'(연역)이라면 ETA는 '원인(초기 이벤트)→결과 시나리오'(귀납)로 방향이 반대라는 것, 그리고 가지마다 확률을 곱해 시나리오 확률을 낸다는 것이 포인트입니다." },
  "hazop": {
    guide: {
      hook: "'만약 물이 안 나오면? 너무 많이 나오면?'을 조목조목 묻는 위험 점검입니다.",
      scene: "이삿날에는 '가스가 안 잠기면? 물이 넘치면?' 하고 정해진 질문 목록을 하나씩 대 보면 놓치는 위험이 줄어듭니다. HAZOP은 이 질문 놀이와 같이 '없음·과다·부족' 같은 물음 낱말(가이드워드)을 흐름·압력·온도에 대입해, 설계 의도에서 벗어난 상황(이탈)의 원인·결과를 전문가들이 모여 함께 찾습니다.",
      why: "'가이드워드 기반 이탈 분석'과 팀 브레인스토밍 특성이 출제 포인트입니다.",
      mechanism: "가이드워드(No·More·Less·As well as·Part of·Reverse·Other than 등)를 공정 파라미터(흐름·압력·온도)에 조합 → 이탈(Deviation) 식별 → 원인·결과·기존 안전장치·권고사항 분석. 다학제 팀의 구조적 브레인스토밍(정성). 노드(공정 구간)별 진행. 유래: 화학·공정 산업, SW·시스템 안전으로 확장. FTA·FMEA와 함께 위험 분석. 설계 단계 위험 도출.",
      map: [
        { as: "'없다면·많다면' 물음 낱말", real: "가이드워드", note: "" },
        { as: "설계 의도에서 벗어난 상황", real: "이탈(Deviation)", note: "" },
        { as: "전문가들 둘러앉은 회의", real: "구조적 협의", note: "브레인스토밍" },
        { as: "원인·결과·고칠 점 기록", real: "분석 결과", note: "" },
      ],
      usage: "공정·시스템 위험 분석입니다. 시험은 가이드워드·이탈, 팀 특성입니다.",
      links: [
        { topic: "FMEA (Failure Mode and Effects Analysis)", how: "위험 분석 기법을 공유합니다." },
        { topic: "STPA (System-Theoretic Process Analysis)", how: "현대 시스템 안전 분석과 대비됩니다." },
      ],
      exam: "HAZOP은 가이드워드(No·More·Less 등)를 파라미터에 적용해 설계 의도에서의 이탈과 원인·결과를 팀 브레인스토밍으로 찾는 위험·운용성 분석 기법이다.",
    }, image: "/concept/book/hazop.png", easy: "HAZOP은 관련 전문가들이 모여 공정변수 × 가이드워드 조합으로 설계 의도로부터의 이탈(Deviation)을 찾고 원인·영향을 분석하는 정성적 안전성 기법입니다. 절차 — 목적·범위 설정 → 분석 팀 구성 → 예비 조사 → 토론·검토 → 결과 기록. 평가 방식이 독특합니다: 공정변수(유량·온도 같은 특정변수, 일반변수)에 가이드워드(없음 NO/NOT, 증가 MORE, 감소 LESS, 반대 REVERSE, 부가 AS WELL AS, 부분 PART OF)를 붙여 '유량이 없다면?'식으로 체계적 브레인스토밍을 합니다. '전문가 집단 + 가이드워드'가 식별 키워드입니다." },
  "fmea": {
    guide: {
      hook: "부품마다 '고장 나면 얼마나 큰일인지' 점수를 매겨 급한 것부터 고칩니다.",
      scene: "정비사는 차의 부품 하나하나에 '브레이크가 닳으면? 와이퍼가 멈추면?' 하고 고장 시 여파를 따져, 심각하고 잦고 알아채기 어려운 것부터 손봅니다. FMEA가 딱 이 점검 방식으로, 부품별 고장 유형의 영향을 아래에서 위로 따지고(상향식·귀납) 심각도×발생도×검출도 점수(RPN)가 큰 것부터 개선합니다.",
      why: "'상향식·귀납적'과 RPN(심각도×발생×검출), FTA와의 대비가 출제 핵심입니다.",
      mechanism: "상향식(Bottom-up)·귀납적: 각 구성요소의 고장 모드(어떻게 고장) → 원인 → 영향(시스템에 미치는 결과) 분석. RPN(Risk Priority Number) = 심각도(Severity) × 발생도(Occurrence) × 검출도(Detection, 못 잡을수록 높음) → RPN 높은 것 우선 개선. 유형: 설계 FMEA(DFMEA)·공정 FMEA(PFMEA). 정성 위주. FTA(사고→원인 하향식)와 대비. 자동차(AIAG-VDA)·항공·의료. 예방적 위험 분석.",
      map: [
        { as: "부품에서 차 전체로 따짐", real: "상향식·귀납", note: "" },
        { as: "심각·잦음·못 알아챔 점수", real: "RPN", note: "셋을 곱함" },
        { as: "점수 큰 부품부터 정비", real: "개선 우선", note: "" },
        { as: "사고에서 부품으로 내려오는 방식", real: "FTA와 대비", note: "하향식" },
      ],
      usage: "예방적 위험 분석입니다. 시험은 상향식·RPN, FTA와의 대비입니다.",
      links: [
        { topic: "FTA (Fault Tree Analysis)", how: "하향식과 대비됩니다." },
        { topic: "HAZOP (Hazard and Operability Study)", how: "위험 분석 기법을 공유합니다." },
      ],
      exam: "FMEA는 각 부품의 고장 모드와 영향을 상향식·귀납적으로 분석하고 심각도×발생×검출(RPN)로 우선순위를 정하는 안전 기법으로, 하향식 FTA와 대비된다.",
    }, image: "/concept/book/fmea.png", easy: "FMEA는 시스템의 고장 유형을 도출하고 영향도에 따라 우선순위를 매겨 사전 대응하는 귀납적(Bottom-up) 분석기법입니다. 우선순위는 RPN = 심각도(Severity) × 발생도(Occurrence) × 검출도(Detection)로 계산 — 셋을 곱해 큰 것부터 대응합니다. 유형은 대상·목적·시기·대상 요소별로 나뉘고(설계 DFMEA, 공정 PFMEA 등), FTA(연역·Top-down)·HAZOP(가이드워드 브레인스토밍)과의 비교표가 반드시 출제됩니다. 'FMEA=귀납·RPN, FTA=연역·게이트'로 짝지어 두세요." },
  "ops-performance": {
    guide: {
      hook: "월말 성적표를 보고 가게를 키울지 합칠지 접을지 정하는 살림 관리입니다.",
      scene: "가게 주인은 월말마다 매출·손님 대기시간·항의 건수를 성적표로 만들어, 잘되는 매장은 키우고 안 되는 매장은 합치거나 접습니다. 운영 성과관리도 이 결산과 같이 시스템의 가동률·응답 속도·장애·만족도 지표를 재서, 약속한 수준(SLA)을 지키는지 보고 고도화·통폐합·폐기를 결정합니다.",
      why: "운영 성과 지표와 SLA·ITSM·BSC와의 연계가 출제 포인트입니다.",
      mechanism: "성과 지표: 가용성(Uptime), 응답시간·처리량(성능), 장애 건수·복구시간(MTTR)·MTBF, SLA 준수율, 사용자 만족도, 자원 사용률, 보안 사고. 관리: 지표 정의(KPI)→측정·모니터링→SLA 대비 평가→개선(SLM). 프레임워크: ITSM/ITIL(서비스 수준 관리), IT-BSC(균형 성과), 운영 대시보드. 목적: 서비스 품질 보증·비용 효율·지속 개선. 운영 감리와 연계.",
      map: [
        { as: "손님 대기시간·회전율", real: "성능 지표", note: "응답시간 등" },
        { as: "문 닫은 날·다시 여는 데 걸린 시간", real: "신뢰성 지표", note: "장애·복구" },
        { as: "약속한 영업 수준 지켰나", real: "서비스 수준", note: "SLA 준수율" },
        { as: "월말 성적표 결산", real: "성과 관리", note: "균형 지표" },
      ],
      usage: "운영 품질 관리입니다. 시험은 운영 지표, SLA·ITSM·BSC와의 연계입니다.",
      links: [
        { topic: "서비스 수준 관리 (SLM, Service Level Management)", how: "SLA 기반 운영 관리입니다." },
        { topic: "정보시스템 운영/유지보수 감리", how: "운영 품질을 감리로 점검합니다." },
      ],
      exam: "정보시스템 운영 성과관리는 가용성·응답시간·장애복구(MTTR)·SLA 준수율·만족도 등 지표로 운영 수준을 측정·평가·개선하는 활동으로, SLM·IT-BSC와 연계된다.",
    }, image: "/concept/book/ops-performance.webp", easy: "정보시스템 운영 성과관리는 전자정부법에 따라 운영 중인 시스템의 성과를 측정·평가해 정비 대상을 정하고 업무·비용 성과를 높이는 활동입니다. 추진절차 — 업무성과 계획관리 → 통폐합 대상관리 → 성과측정 대상관리 → 성과측정 및 평가 → 폐기 예외관리 → 정비계획 수립 → 이행관리. 성과측정 지표는 비용지표와 업무지표(업무성과 달성도), 정비 방식 4종 — 폐기, 통폐합, 기능고도화, 전면재개발. '측정 결과에 따라 계속/정비/폐기를 정한다'는 목적과 정비 방식 4종이 답안 핵심입니다." },
  "audit-report": {
    guide: {
      hook: "감리 결과를 정리한 공식 문서 — '발견사항과 개선 권고'를 담습니다.",
      scene: "건물 안전 점검이 끝나면 점검원은 '어디가 금 갔고 언제까지 고쳐라'를 적은 보고서를 건물주에게 건넵니다. 감리결과보고서가 딱 이 보고서로, 점검 개요·종합 의견(총평)·문제점(발견사항)·개선 권고를 담아 발주자와 개발사가 고치게 만드는 근거가 됩니다.",
      why: "보고서 구성과 보고사항(발견사항·시정요구)이 출제 포인트입니다.",
      mechanism: "구성: 감리 개요(대상·범위·기준·기간), 총평(종합 의견), 점검 결과(관점별 — 사업관리·품질보증·응용시스템), 발견사항(문제점)·개선 권고사항, 시정조치 계획·결과. 보고사항: 부적합·개선 필요사항을 근거(점검 기준)와 함께 명시, 등급(중요도)·시정 요구. 발주기관·수행사에 보고. 시정조치 확인으로 후속 관리. 객관·구체·실행가능한 권고. 감리 종료 단계 산출물.",
      map: [
        { as: "어느 건물을 언제 어떻게 봤나", real: "감리 개요", note: "" },
        { as: "점검원의 종합 소견", real: "총평", note: "" },
        { as: "금 간 곳과 고칠 방법", real: "발견사항·개선 권고", note: "" },
        { as: "고쳤는지 다시 확인", real: "후속 관리", note: "시정 요구" },
      ],
      usage: "감리 결과 문서화입니다. 시험은 보고서 구성, 발견사항·시정요구입니다.",
      links: [
        { topic: "공통감리 절차", how: "종료 단계의 산출물입니다." },
        { topic: "정보시스템 감리 의무 대상과 관점별 점검 기준", how: "점검 관점별로 결과를 정리합니다." },
      ],
      exam: "정보시스템 감리결과보고서는 감리 개요·총평·관점별 점검 결과·발견사항·개선 권고·시정조치로 구성되며, 부적합 사항을 근거·등급과 함께 명시해 시정을 요구한다.",
    }, image: "/concept/book/audit-report.png", easy: "감리결과보고서는 독립된 감리법인이 제3자적 관점에서 수행한 현장감리 결과를 정리해 제출하는 최종 산출물입니다. 구성 3부 — ① 종합의견(전제조건, 총평, 감리영역별 상세점검결과 요약) ② 감리영역별 점검결과(사업관리·품질보증 / 응용시스템 / DB·시스템아키텍처·보안 등 영역별 점검항목·상세점검결과) ③ 별첨(감리 수행 전 제출한 감리계획서). 개선권고사항에는 유형(필수/협의/권고), 개선시점(장기/단기), 중요도, 발주기관 협조필요 여부를 표기합니다. 제출 프로세스는 보고서(안) 설명 → 이견접수·통보일 제시 → 이견사항 처리결과 공유 → 보고서 확정·통보 4단계. '종합의견에 무엇이 들어가나'와 개선권고 유형 3종(필수·협의·권고)이 시험 포인트입니다." },
  "common-audit-process": {
    guide: {
      hook: "점검 준비→현장 점검→고쳤는지 확인 순서로 도는 표준 점검 절차입니다.",
      scene: "건물 안전 점검도 미리 일정과 볼 곳을 정하고, 현장에 나가 살피고, 결과를 알린 뒤 고쳐졌는지 확인하는 순서가 정해져 있습니다. 공통감리 절차가 이 순서와 같이 예비조사(계획)→현장감리(점검)→시정조치 확인의 3단계로 돌며, 단계마다 내는 문서(계획서·결과보고서·확인보고서)가 정해져 있습니다.",
      why: "감리 3단계와 각 단계 활동·산출물이 출제 핵심입니다.",
      mechanism: "3단계: 예비 감리(감리 계획 수립 — 범위·기준·점검항목·일정, 착수회의), 현장 감리(산출물·활동 점검 — 점검 기준 대비 확인, 인터뷰, 시정 요구 도출), 종료 감리(감리 결과보고서 작성·보고 — 발견사항·개선 권고, 종료회의, 시정조치 확인). 점검 관점(사업관리·품질보증·응용시스템) 적용. 감리 시점(요구정의·설계·종료 단계별). 독립·객관·전문성. 시정조치 확인으로 실효성.",
      map: [
        { as: "일정과 볼 곳 미리 정하기", real: "예비 감리", note: "계획서" },
        { as: "현장에 나가 살피기", real: "현장 감리", note: "결과보고서" },
        { as: "결과 알리고 고칠 점 권고", real: "종료 감리", note: "" },
        { as: "고쳐졌는지 재방문", real: "실효성", note: "시정조치 확인" },
      ],
      usage: "감리 수행 절차입니다. 시험은 예비/현장/종료 단계·산출물입니다.",
      links: [
        { topic: "정보시스템 감리 의무 대상과 관점별 점검 기준", how: "감리 대상·관점입니다." },
        { topic: "정보시스템 감리결과보고서 (구성, 보고사항)", how: "종료 단계 산출물입니다." },
      ],
      exam: "공통감리 절차는 예비 감리(계획 수립)·현장 감리(산출물·활동 점검)·종료 감리(결과보고·개선 권고)의 3단계로, 사업관리·품질보증·응용시스템 관점을 적용해 수행한다.",
    }, image: "/concept/book/common-audit-process.png", easy: "공통감리 절차는 정보시스템 개발, EA, ISP 수립, DB 구축 등 모든 유형의 정보화 사업에 공통 적용되는 감리 절차입니다. 3단계 [예현조] — A00 예비조사(감리계획서 작성) → B00 현장감리(감리수행결과보고서) → C00 시정조치 확인(조치확인보고서). 감리법인·발주기관·피감리인(사업자) 3주체 사이의 문서 흐름(계획서 통보 → 결과보고서 제출 → 조치 → 확인)이 개념도로 출제됩니다. 단계별 산출물 짝짓기 — 예비조사=계획서, 현장감리=결과보고서, 조치확인=확인보고서 — 가 단골입니다." },
  "audit-mandatory": {
    guide: {
      hook: "큰 건물은 안전 점검이 의무이듯, 큰 정보화 사업은 감리가 의무입니다.",
      scene: "사람이 많이 드나드는 큰 건물은 법으로 정기 안전 점검이 의무이고, 점검원은 정해진 관점으로 구조와 관리 상태를 살핍니다. 정보시스템 감리도 이와 같이 대국민 서비스·사업비 5억 이상 등 큰 사업은 의무 대상이며, 사업관리·품질보증·응용시스템의 3가지 관점으로 점검합니다.",
      why: "감리 의무 대상 요건과 3대 점검 관점이 출제 핵심입니다.",
      mechanism: "의무 대상(전자정부법): 대국민 서비스·다수 기관 연계·일정 사업비 이상 등 정보시스템 감리 대상. 3대 점검 관점: ①사업관리(일정·범위·자원·위험·의사소통 등 PM 적정성), ②품질보증활동(방법론·산출물·품질 활동 준수), ③응용시스템(요구 충족·기능·성능·보안 등 구축 품질). 감리 시점: 요구정의·설계·종료 단계 감리. 감리법인·감리원. 독립성·객관성.",
      map: [
        { as: "큰 건물은 점검 의무", real: "감리 의무 대상", note: "5억 이상 등" },
        { as: "공사 일정·인력 관리 상태", real: "사업관리 관점", note: "①" },
        { as: "정해진 시공 절차 지켰나", real: "품질보증 관점", note: "②" },
        { as: "완성된 건물 자체 품질", real: "응용시스템 관점", note: "③" },
      ],
      usage: "감리 대상·점검 기준입니다. 시험은 의무 대상 요건, 3대 관점입니다.",
      links: [
        { topic: "공통감리 절차", how: "감리 수행 절차입니다." },
        { topic: "감리/PMO 비교표", how: "감리와 PMO를 대비합니다." },
      ],
      exam: "정보시스템 감리 의무 대상은 대국민 서비스·다수 기관 연계·일정 사업비 이상 등이며, 감리는 사업관리·품질보증활동·응용시스템 3대 관점으로 점검한다.",
    }, image: "/concept/book/audit-mandatory.png", easy: "정보시스템 감리는 효율성 향상과 안전성 확보를 위해 제3자적 관점에서 구축 사항을 종합 점검·개선하는 활동입니다. 의무 대상(전자정부법) — 대국민 서비스 사업, 여러 기관 공동 구축, 사업비 5억 이상, 기관장이 필요하다고 인정하는 사업. 관점별 점검 기준 [성산절] — 성과(목표 달성도), 산출물(품질·완전성), 절차(프로세스 준수). 3단계 감리 수행 절차와 산출물이 짝으로 나오며, '5억'이라는 숫자와 [성산절] 두음이 답안 필수 요소입니다." },
  "ops-maintenance-audit": {
    guide: {
      hook: "다 지은 건물이 '관리는 잘되고 있는지'를 살피는 입주 후 점검입니다.",
      scene: "건물은 준공 검사로 끝이 아니라 입주 후에도 소방·승강기·배관이 규칙대로 관리되는지 따로 점검받습니다. 운영/유지보수 감리가 딱 이 입주 후 점검으로, 돌아가는 시스템의 운영 약속(SLA)·장애 대응·고칠 때의 절차를 제3자가 살펴 개선을 권고하며, 짓는 중을 보는 구축 감리와 구분됩니다.",
      why: "'운영·유지보수 감리의 점검 관점'과 구축 감리와의 차이가 출제 포인트입니다.",
      mechanism: "대상: 운영·유지보수 중인 정보시스템. 점검 관점: 운영 관리(SLA·장애·변경·구성 관리 준수), 유지보수 프로세스(요청·영향분석·변경·회귀 테스트), 보안·백업·성능, 산출물 최신성. 절차: 공통감리 절차(예비→현장→종료). 목적: 운영 품질·안정성·보안 확보. 구축(개발) 감리와 달리 '지속 운영'의 적정성 점검. 감리 결과보고서로 개선 권고.",
      map: [
        { as: "입주 후 건물 관리 점검", real: "운영·유지보수 감리", note: "" },
        { as: "경비·청소 약속 이행 확인", real: "운영 관리 점검", note: "SLA·장애·변경" },
        { as: "수리할 때 절차대로 했나", real: "변경·회귀", note: "" },
        { as: "공사 점검과는 다른 점검", real: "지속 운영 적정성", note: "구축 감리와 구분" },
      ],
      usage: "운영 품질 점검입니다. 시험은 점검 관점, 구축 감리와의 차이입니다.",
      links: [
        { topic: "정보시스템 운영 성과관리", how: "운영 품질 관리와 연계됩니다." },
        { topic: "공통감리 절차", how: "감리 수행 절차를 공유합니다." },
      ],
      exam: "정보시스템 운영/유지보수 감리는 운영 중 시스템의 운영 관리(SLA·장애·변경)·유지보수 프로세스·보안·성능을 제3자가 점검해 개선을 권고하는 감리로, 구축 감리와 구분된다.",
    }, image: "/concept/book/ops-maintenance-audit.png", easy: "운영/유지보수 감리는 구축 완료 후 인도된 정보시스템의 변경·개선·모니터링을 점검해, 안정적 운영과 성능 보장·효율적 개선을 확인하는 감리입니다. 점검 분야가 감리 유형별로 다른 게 포인트 — 운영 감리는 개발 소프트웨어(DS)·인프라(IF) 2개 분야, 유지보수 감리는 개발 소프트웨어(DS)·상용 소프트웨어(CS)·인프라(IF) 3개 분야를 봅니다. '구축 감리(개발 중)와 달리 운영 단계를 보는 감리'라는 위치, 그리고 운영과 유지보수의 점검 분야 차이가 시험 포인트입니다." },
  "oss-security-threat": {
    guide: {
      hook: "사다 쓴 공용 반찬 하나가 상하면, 그걸 올린 모든 밥상이 같이 위험해집니다.",
      scene: "반찬가게에서 사 온 반찬으로 차린 밥상은 그 가게 재료 하나만 상해도 그 반찬을 산 모든 집 식탁이 함께 위험해집니다. 오픈소스도 마치 이런 공용 반찬 같아서 숨은 결함(취약점)이나 몰래 넣은 독(악성 코드)이 있으면 그걸 조립해 쓴 SW 전부가 노출되며, 재료 목록표(SBOM)와 위생 검사(SCA)로 대응합니다.",
      why: "오픈소스 특유 위협(알려진 취약점·의존성·악성 패키지)과 대응(SCA·SBOM)이 출제 핵심입니다.",
      mechanism: "위협: 알려진 취약점(CVE — Log4Shell), 전이 의존성(직접 안 써도 간접 포함), 악성 패키지(타이포스쿼팅·의존성 혼동·백도어 — xz), 유지보수 중단(방치된 프로젝트), 라이선스 위반. 대응: SCA(구성요소 취약점 스캔), SBOM(구성요소 명세), 의존성 최소화·검증, 서명·무결성, 취약점 모니터링(CVE·패치), 오픈소스 거버넌스. 공급망 공격의 주요 경로.",
      map: [
        { as: "이미 알려진 상한 재료", real: "CVE(Log4Shell)", note: "" },
        { as: "반찬에 딸려 들어온 재료", real: "전이 의존성", note: "간접 포함" },
        { as: "이름 비슷한 가짜 가게·몰래 탄 독", real: "타이포스쿼팅·백도어", note: "xz" },
        { as: "재료 목록표와 위생 검사", real: "방어", note: "SBOM·SCA" },
      ],
      usage: "오픈소스 보안입니다. 시험은 위협 유형, SCA·SBOM, 공급망 공격과의 관계입니다.",
      links: [
        { topic: "공급망 공격(Supply Chain Attack)", how: "오픈소스가 주요 공급망 경로입니다." },
        { topic: "SBOM", how: "구성요소 가시화로 대응합니다." },
      ],
      exam: "오픈소스 SW 보안위협은 알려진 취약점(CVE)·전이 의존성·악성 패키지·유지보수 중단으로, SCA·SBOM·의존성 검증·오픈소스 거버넌스로 대응하는 공급망 위협이다.",
    }, image: "/concept/book/oss-security-threat.png", easy: "오픈소스 SW 보안위협은 소스가 공개되어 자유롭게 사용·변경·배포되는 특성에서 생기는 위협과 그 관리방안입니다. 관리적 측면 — 사용(현황 파악 부재, 커뮤니티 코드 맹신·타이포스쿼팅)과 프로세스(점검 절차 부재). 기술적 측면 — 공격(공개 코드의 취약점 악용, Zero Day)과 조치(패치 지연). 관리방안은 사용·프로세스·개발·장비 측면으로 정리 — 오픈소스 현황 목록화(SBOM), 검증 프로세스, 취약점 스캐닝 등입니다. SBOM·오픈소스 거버넌스와 3종 세트로 묶어 외우세요." },
  "fta": {
    guide: {
      hook: "사고에서 출발해 '왜?'를 거듭 물으며 원인 가지를 그려 내려가는 분석입니다.",
      scene: "'집이 정전됐다'라는 결과에서 출발해 '두꺼비집이 내려갔나, 동네 전체가 나갔나' 하고 원인을 거꾸로 파 내려가면 원인 가계도가 그려집니다. FTA가 딱 이 방식으로, 최종 사고(정상 사건)에서 원인들을 '하나만 있어도(OR)·모두 겹쳐야(AND)' 관계로 이어 내려가, 사고를 부르는 최소 원인 조합(최소 절단 집합)까지 밝힙니다.",
      why: "'하향식·연역적·논리 게이트'와 FMEA(상향식)와의 대비가 출제 핵심입니다.",
      mechanism: "하향식(Top-down)·연역적: 정상 사건(Top Event — 원치 않는 사고)에서 시작 → 원인 사건을 논리 게이트(AND — 모두 발생 시, OR — 하나라도)로 전개 → 기본 사건(리프)까지. 최소 절단 집합(Minimal Cut Set — 사고를 일으키는 최소 원인 조합) 도출. 정성(구조)·정량(확률 계산). 활용: 안전·신뢰성 분석(원전·항공·의료). FMEA(부품→영향 상향식)와 대비. HAZOP·ETA와 함께 위험 분석.",
      map: [
        { as: "정전에서 원인으로 내려가기", real: "하향식·연역", note: "" },
        { as: "하나만으로도/모두 겹쳐야", real: "논리 전개", note: "OR·AND" },
        { as: "사고 부르는 최소 조합", real: "최소 절단 집합", note: "" },
        { as: "부품에서 위로 올라가는 방식", real: "FMEA와 대비", note: "상향식" },
      ],
      usage: "안전·신뢰성 분석입니다. 시험은 하향식·논리 게이트, 최소 절단 집합, FMEA와의 대비입니다.",
      links: [
        { topic: "FMEA (Failure Mode and Effects Analysis)", how: "상향식과 대비됩니다." },
        { topic: "ETA (Event Tree Analysis)", how: "귀납적 사건 전개와 대비됩니다." },
      ],
      exam: "FTA는 정상 사건(사고)에서 원인으로 내려가며 AND/OR 게이트로 전개하는 하향식·연역적 안전 분석으로, 최소 절단 집합을 도출하며 상향식 FMEA와 대비된다.",
    }, image: "/concept/book/fta.png", easy: "FTA는 최상위 사고(Top Event)에서 출발해 그 원인을 트리로 파 내려가는 연역적(Top-down) 안전성 분석 기법으로, 정성·정량 분석을 모두 지원합니다. 프로세스 6단계로 대상 정의부터 개선까지 진행하고, 표기법이 시험 단골 — 사상 기호(기본사상·중간사상·미전개사상 등)와 게이트 기호(AND: 모두 발생해야 상위 발생 / OR: 하나만 발생해도)로 트리를 그립니다. '결과에서 원인으로(연역), 게이트로 확률 계산'이 핵심이고 FMEA(귀납)와의 방향 대비가 반드시 나옵니다." },
  "iso-14764": {
    guide: {
      hook: "집수리를 '고장·계절 대비·업그레이드·예방'으로 나눠 정리한 관리 규칙집입니다.",
      scene: "집 관리도 비 새는 곳 수리, 겨울나기 준비, 더 편하게 고치는 개조, 미리 하는 점검으로 나눠 계획하면 빠짐이 없습니다. ISO 14764는 이런 구분과 같이 유지보수를 수정(결함)·적응(환경)·완전(개선)·예방의 4유형으로 나누고, 요청 접수부터 폐기까지의 절차를 정해 둔 국제 규격입니다.",
      why: "유지보수 4유형과 프로세스 단계가 출제 핵심입니다. 유지보수 개념의 표준 근거입니다.",
      mechanism: "유지보수 4유형: 수정(Corrective — 결함), 적응(Adaptive — 환경), 완전(Perfective — 개선), 예방(Preventive — 사전). 프로세스: 프로세스 구현(계획)→문제·수정 분석→수정 구현→유지보수 리뷰·수용→이관→폐기. ISO/IEC 12207(생명주기)의 유지보수 프로세스를 상세화. 변경 요청 관리·영향 분석·회귀 테스트 포함. 유지보수 비용·계획의 기준.",
      map: [
        { as: "수리·월동·개조·점검 네 갈래", real: "수정·적응·완전·예방", note: "4유형" },
        { as: "접수부터 마무리까지 순서", real: "유지보수 프로세스", note: "" },
        { as: "집 관리 대백과의 한 장", real: "생명주기 연계", note: "12207 상세화" },
        { as: "고치기 전 여파 살피기", real: "영향 분석·회귀", note: "변경 관리" },
      ],
      usage: "유지보수 표준입니다. 시험은 4유형, 프로세스, 12207과의 관계입니다.",
      links: [
        { topic: "유지보수", how: "14764가 유지보수의 표준입니다." },
        { topic: "형상 관리", how: "변경 관리와 연계됩니다." },
      ],
      exam: "ISO/IEC/IEEE 14764는 유지보수를 수정·적응·완전·예방 4유형으로 분류하고 문제 분석·수정 구현·이관·폐기의 프로세스를 정한 표준으로, ISO 12207을 상세화한다.",
    }, image: "/concept/book/iso-14764.png", easy: "ISO/IEC/IEEE 14764는 ISO/IEC 12207의 유지보수 프로세스를 6단계로 상세화한 SW 유지보수 표준 프로세스입니다. 절차 — 공정구현 → 문제 및 수정분석 → 수정 구현 → 유지보수 검토/승인 → 이전(Migration) → SW 폐기. 변경유형은 반응적(Reactive: 수정·적응)과 순향적(Proactive: 완전·예방)으로 나뉘고, 기법으로 프로그램 이해·재공학·역공학·재구조화를 씁니다. '유지보수에도 국제표준 프로세스가 있다'와 6단계 순서가 시험 포인트입니다." },
  "mccabe": {
    guide: {
      hook: "등산로의 갈림길 수를 세어 길이 얼마나 헷갈리는지 재는 지표입니다.",
      scene: "등산로는 갈림길이 많을수록 헷갈리고, 모든 코스를 밟아 보려면 그만큼 여러 번 올라야 합니다. McCabe 복잡도는 이 갈림길 세기와 같이 코드의 분기(if·while)가 만드는 서로 다른 길(독립 경로)의 수를 재며, 그 수가 곧 최소 테스트 횟수가 되고 너무 크면(10 초과) 길 정리(리팩토링) 대상입니다.",
      why: "복잡도 계산 공식과 임계값(10), 기본 경로 테스트와의 관계가 출제 핵심입니다.",
      mechanism: "제어 흐름 그래프(노드·간선)에서 순환 복잡도 V(G) = E − N + 2(E=간선, N=노드) = 분기(결정)점 수 + 1 = 독립 경로 수. 값이 곧 기본 경로 테스트(화이트박스)의 최소 테스트 케이스 수. 임계값: 보통 10 초과면 복잡·위험(테스트·유지보수 어려움) → 리팩토링(함수 분리). 활용: 코드 품질 측정·테스트 계획·리팩토링 대상 선정. 정적 분석 도구로 자동 측정.",
      map: [
        { as: "갈림길 수 + 1", real: "V(G) 계산", note: "E−N+2" },
        { as: "밟아야 할 서로 다른 길 수", real: "테스트 케이스 수", note: "기본 경로" },
        { as: "갈림길 10개 넘으면 위험", real: "임계값", note: "정리 대상" },
        { as: "헷갈림을 숫자로", real: "품질 측정", note: "" },
      ],
      usage: "복잡도 측정·테스트 계획입니다. 시험은 V(G) 공식, 임계값, 기본 경로 테스트입니다.",
      links: [
        { topic: "화이트박스 테스트", how: "기본 경로 테스트의 근거입니다." },
        { topic: "소프트웨어 리팩토링", how: "높은 복잡도가 리팩토링 대상입니다." },
      ],
      exam: "McCabe 순환 복잡도 V(G)는 제어 흐름의 독립 경로 수(=분기점+1=E−N+2)로 코드 복잡도를 재며, 기본 경로 테스트의 케이스 수가 되고 10 초과 시 리팩토링 대상이다.",
    }, image: "/concept/book/mccabe.png", easy: "McCabe 순환 복잡도는 제어 흐름 그래프에서 독립 경로 수를 구해 SW 복잡도를 재는 지표입니다. 공식 세 가지가 모두 같은 값 — V(G) = 간선(e) − 노드(n) + 2 = 폐구간 + 1 = 의사결정 수 + 조건 수 + 1. 판정 기준 — 5 이하 단순, 5~10 안정, 20 이상 복잡(리팩토링 대상). 화이트박스 테스트에서 '기본 경로 수 = 최소 테스트케이스 수'로 직결된다는 활용처와, 간단한 그래프를 주고 복잡도를 계산시키는 문제가 단골입니다." },
  "maintenance": {
    guide: {
      hook: "차는 뽑고 나서부터가 시작 — 고치고 손보는 데 돈이 더 드는 활동입니다.",
      scene: "자동차는 출고가 끝이 아니라 고장 수리, 새 연료 규제 맞추기, 편의장치 업그레이드, 미리 받는 정기 점검처럼 관리에 더 큰돈이 듭니다. SW 유지보수도 이와 같이 수정(결함)·적응(환경 변화)·완전(개선)·예방의 4유형으로 나뉘며, SW 총비용의 60~80%를 차지합니다.",
      why: "유지보수 4유형(수정·적응·완전·예방)과 높은 비용 비중이 출제 핵심입니다. ISO 14764와 연결됩니다.",
      mechanism: "4유형(ISO 14764): 수정 유지보수(Corrective — 결함 수정, 사후), 적응 유지보수(Adaptive — 환경 변화 대응: OS·법규·HW), 완전 유지보수(Perfective — 기능·성능 개선, 비중 최대), 예방 유지보수(Preventive — 잠재 결함 사전 제거·리팩토링). 비용: 총비용의 60~80%(대부분 완전·적응). 절차: 요청→분석→영향 평가→변경→테스트(회귀)→배포. 레만 법칙(E-Type 진화)이 이론적 근거. 형상 관리·회귀 테스트 필수.",
      map: [
        { as: "고장 나서 받는 수리", real: "수정(Corrective)", note: "사후" },
        { as: "새 규제·도로 사정 맞추기", real: "적응(Adaptive)", note: "환경 변화" },
        { as: "편의장치 업그레이드", real: "완전(Perfective)", note: "비중 최대" },
        { as: "미리 받는 정기 점검", real: "예방(Preventive)", note: "" },
      ],
      usage: "SW 생명주기 관리입니다. 시험은 4유형, 비용 비중, ISO 14764·레만 법칙입니다.",
      links: [
        { topic: "ISO/IEC/IEEE 14764", how: "유지보수 4유형의 표준입니다." },
        { topic: "Lehman의 Software 변화의 원리", how: "유지보수의 이론적 근거입니다." },
      ],
      exam: "유지보수는 출시 후 SW를 수정·적응·완전·예방의 4유형으로 관리하는 활동으로 총비용의 60~80%를 차지하며, ISO 14764가 표준이고 레만 법칙이 이론적 근거다.",
    }, image: "/concept/book/maintenance.png", easy: "유지보수는 SW 생명주기의 마지막(폐기 전) 단계로, 인도된 소프트웨어의 오류를 수정하고 요구사항을 반영하며 기능·성능을 개선하는 활동입니다. 유형 분류 3축이 핵심 — 시점 [계예응지](계획·예방·응급·지연), 대상 [데프문시](데이터·프로그램·문서·시스템), 원인 [수완예적](수정: 오류 고침 / 완전: 기능 개선 / 예방: 미래 대비 / 적응: 환경 변화 대응). 원인 축의 '수정=오류, 완전=개선, 적응=환경'구분이 단골이며, 전체 SW 비용의 60~80%가 유지보수라는 배경도 자주 나옵니다." },
  "commercial-sw-quality-test": {
    guide: {
      hook: "카탈로그 말고 직접 몰아 보고 비교해 관용차를 고르는 시승 평가입니다.",
      scene: "관공서가 차를 살 때 카탈로그 성능표만 믿지 않고 후보 차들을 같은 코스에서 직접 몰아 보고 비교하면 과장 광고에 속지 않습니다. 이 평가 시험(BMT)이 딱 이 시승 비교로, 공공이 사는 상용 SW 후보들을 국제 기준(ISO 25051 등)에 따라 실제로 시험해 품질·성능을 확인하고 조달에 반영합니다.",
      why: "'상용 SW 품질·성능 검증'과 ISO 25051(COTS 품질 요구), GS 인증과의 관계가 출제 포인트입니다.",
      mechanism: "대상: 상용(COTS·패키지) SW. 기준: ISO/IEC 25051(상용 제품 품질 요구·시험), 25023(측정), 25010(품질모델). 평가: 제품 설명서·사용자 문서·기능·성능 시험. 목적: 공공 조달 품질 보증·투명성. GS 인증과 연계(GS가 대표적 상용 SW 품질 인증). 성능 시험 항목(응답시간·처리량·부하). 부실·과장 방지.",
      map: [
        { as: "후보 차 직접 시승", real: "COTS 품질·성능", note: "실측 비교" },
        { as: "정해진 시승 코스와 채점표", real: "상용 품질 요구", note: "ISO 25051" },
        { as: "과장 광고에 안 속기", real: "목적", note: "조달 품질 보증" },
        { as: "공인 품질 마크와 연계", real: "관계", note: "GS 인증" },
      ],
      usage: "공공 상용 SW 조달 품질입니다. 시험은 ISO 25051, GS 인증과의 관계입니다.",
      links: [
        { topic: "GS 인증", how: "상용 SW 품질 인증의 대표입니다." },
        { topic: "ISO/IEC 25010:2023", how: "품질 시험의 기준 모델입니다." },
      ],
      exam: "상용소프트웨어 품질성능 평가 시험은 ISO 25051 등 기반으로 상용(COTS) SW의 기능·성능을 시험해 공공 조달 품질을 보증하는 제도로, GS 인증과 연계된다.",
    }, image: "/concept/book/commercial-sw-quality-test.webp", easy: "상용SW 품질성능 평가 시험(BMT)은 동종 경쟁 제품 간 기능·성능을 비교 평가해 요구를 만족하는 우수 제품을 가려내는 시험입니다(소프트웨어 진흥법 제55조). 평가 대상은 경쟁입찰을 통한 직접구매 대상 상용SW 중 구매금액 1억 원 이상(VAT 포함)으로 대상품목(34종)에 해당하는 제품이고, 시험비용 대비 효과가 낮거나 기존 제품 증설이면 제외될 수 있으며, 정보보호제품 성능평가 결과로 대체도 가능합니다. 절차는 평가시험 대상 검토 → 사전 협의 → 평가시험 설계(요구사항 분석·평가항목 개발) → 조달 발주(제안요청서에 평가항목·배점 반영) → 시험 의뢰 → 실시 → 결과 반영(기술성평가 반영·우선협상대상자 선정) 7단계. '스펙 문서가 아니라 실측으로 비교한다'는 취지와 상용SW 직접구매 제도와의 연계가 포인트입니다." },
  "function-point": {
    guide: {
      hook: "코드 줄 수 대신 '사용자에게 보이는 기능 개수'로 크기를 재는 자입니다.",
      scene: "이사 견적은 짐을 다 싸 보지 않아도 방 개수와 가전 수만 세면 미리 낼 수 있습니다. 기능 점수도 이 견적처럼 사용자 눈에 보이는 기능(입력·출력·조회·파일·연계)을 세어 SW 크기를 재므로, 만들기 전에도·어떤 언어로 만들든 같은 잣대로 규모를 셈할 수 있습니다.",
      why: "5대 기능 유형과 산정 절차(미조정 FP→보정)가 출제 핵심입니다. 대가 산정 표준이라는 점이 포인트입니다.",
      mechanism: "5대 기능 유형: 데이터 기능(ILF 내부논리파일·EIF 외부연계파일), 트랜잭션 기능(EI 외부입력·EO 외부출력·EQ 외부조회). 각 기능의 복잡도(단순·보통·복잡) 가중치 부여 → 미조정 기능점수(UFP) 산출 → (필요시) 보정계수 적용 → 조정 FP. 국내 SW 사업대가는 간이법(기능 수×평균 복잡도) 사용. 장점: 언어 독립·초기 산정·표준화. IFPUG·NESMA 표준. 비용 산정(FP당 단가)·생산성 측정.",
      map: [
        { as: "집 안 수납장·바깥 창고", real: "데이터 기능(ILF·EIF)", note: "" },
        { as: "들이고 내가고 찾아보는 일", real: "트랜잭션(EI·EO·EQ)", note: "" },
        { as: "짐마다 크기 가중치로 합산", real: "미조정 FP", note: "복잡도 가중치" },
        { as: "싸 보기 전에도 견적 가능", real: "장점", note: "언어 무관·대가 표준" },
      ],
      usage: "SW 규모·대가 산정입니다. 시험은 5대 기능 유형, 산정 절차, 대가 산정입니다.",
      links: [
        { topic: "SW 규모산정", how: "기능점수가 대표 규모 산정법입니다." },
        { topic: "SW 사업대가 ('25년 개정판)", how: "기능점수로 대가를 산정합니다." },
      ],
      exam: "기능 점수(FP)는 데이터 기능(ILF·EIF)과 트랜잭션 기능(EI·EO·EQ)을 복잡도 가중치로 산정하는 언어 독립적 규모 측정법으로, 국내 SW 사업대가 산정의 표준이다.",
    }, image: "/concept/book/function-point.png", easy: "Function Point는 정보처리 규모와 기능 복잡도에 의거해 SW 규모를 재는 정량적 산정 방식입니다 — 코드 줄 수가 아니라 '사용자에게 보이는 기능 수'로 잽니다. 산정 절차: 측정 유형 결정 → 범위·경계 식별 → 데이터 기능(ILF·EIF) 측정 → 트랜잭션 기능(EI·EO·EQ) 측정 → 미조정 FP 결정 → 조정인자(14개, 0~5점) → 조정 FP = 미조정 × 조정인자. 데이터 기능(내부논리파일·외부연계파일)과 트랜잭션 기능(입력·출력·조회)의 5요소 분류, 그리고 SW 사업대가 산정의 기준이라는 활용처가 시험 포인트입니다." },
  "sw-cost": {
    guide: {
      hook: "나라에서 정한 '공사비 표준 단가표'로 SW값을 셈하는 기준입니다.",
      scene: "관공서 공사는 부르는 게 값이 되지 않도록 나라가 정한 표준 단가표(평당 얼마)로 견적을 냅니다. SW 사업대가가 딱 이 단가표로, 개발비는 기능 개수(기능점수)×단가, 유지관리는 투입 인력(맨먼스)×단가로 셈해 제값 주고받기를 돕고, '25년 개정판은 임대형 SW(SaaS)·인공지능 같은 새 품목까지 담았습니다.",
      why: "산정 방식(기능점수·투입공수)과 대가 유형(개발·유지보수·운영)이 출제 핵심입니다.",
      mechanism: "산정 방식: 기능점수 방식(기능점수×FP당 단가×보정 — 개발비, 주류), 투입공수 방식(맨먼스×단가 — 유지관리·SM), 코드라인 등. 대가 유형: SW 개발비, 유지보수(하자보수 무상·유상), 운영(SM — 서비스 수준), 상용SW 유지관리, 재개발. 직접·간접 경비·이윤 포함. '25년 개정: SaaS·AI·클라우드·PMO 대가 반영. SW진흥법 근거. 저가 수주 방지·SW 가치 보장.",
      map: [
        { as: "기능 개수×표준 단가", real: "개발비 산정", note: "기능점수 방식" },
        { as: "투입 인력×표준 단가", real: "유지관리(SM)", note: "맨먼스" },
        { as: "새로 짓기·수리·관리 견적", real: "대가 유형", note: "개발·유지보수·운영" },
        { as: "새 품목 단가 추가", real: "25년 개정", note: "SaaS·AI·클라우드" },
      ],
      usage: "공공 SW 사업 대가입니다. 시험은 기능점수·투입공수, 대가 유형, 25년 개정입니다.",
      links: [
        { topic: "Function Point", how: "개발비 산정의 기준입니다." },
        { topic: "SW 규모산정", how: "규모가 대가 산정의 근거입니다." },
      ],
      exam: "SW 사업대가는 기능점수 방식(개발비)과 투입공수 방식(유지관리)으로 공공 SW 사업의 적정 대가를 산정하는 기준으로, '25년 개정은 SaaS·AI·클라우드를 반영한다.",
    }, image: "/concept/book/sw-cost.png", easy: "SW 사업대가는 공공 SW사업의 예산 수립·발주·계약 때 적정 대가를 산정하는 기준 가이드입니다('25년 개정판, 1FP=605,784원). 사업 생애를 기획 → 구현 → 운영 단계로 나눠 각각 다른 산정 방식을 씁니다. 기획 단계(ISP·ISP/BPR·EA/ITA·ISMP·정보보안컨설팅)는 컨설팅 업무량 방식(업무 가중치×난이도)이나 투입공수 방식(직접 인건비 + 제경비 144~154% + 기술료 20~40% + 직접경비)으로, 구현 단계(SW 개발)는 기능점수 방식으로 계산합니다. 기능점수 절차는 [사기전후직소] — 사전준비(정통법/간이법 결정) → 기능점수 산정 → 보정 전 개발원가(FP×단가) → 보정 후 개발원가(규모·연계·성능·호환성·보안 보정계수) → 직접경비·이윤(개발원가의 25% 이내) → 개발비 확정. '기획은 공수, 구현은 기능점수' 구분과 이윤 25% 숫자가 시험 포인트입니다." },
  "obfuscation": {
    guide: {
      hook: "비법 노트를 일부러 악필로 써서, 베끼려는 사람을 지치게 만드는 기법입니다.",
      scene: "비법 요리 노트를 일부러 악필과 자기만 아는 약어로 써 두면, 훔쳐본 사람은 해독하다 지쳐 포기합니다. 난독화가 딱 이 방법으로, 프로그램 기능은 그대로 둔 채 이름·순서·글자를 꼬아 분석(역공학) 비용을 확 키우며, 완전 차단이 아니라 시간 끌기(지연)가 목적입니다.",
      why: "난독화 기법 4분류와 '지연·비용 증가' 목적, 악성코드의 양면성이 출제 핵심입니다.",
      mechanism: "기법: 레이아웃(식별자 renaming·주석 제거 — 약함), 데이터(문자열 암호화·상수 분할), 제어 흐름(불투명 서술어·평탄화·가짜 분기 — 강함), 가상화(자체 VM 바이트코드로 변환 — 최강·고비용). 평가 축: 강도(분석 저항)·내성(자동 해제 저항)·은밀성·비용(성능 오버헤드). 목적: 완전 차단 아닌 지연·비용 증가. 응용: 모바일 앱·DRM·안티탬퍼. 양면성: 악성코드도 탐지 회피에 사용.",
      map: [
        { as: "이름을 낙서처럼 바꾸기", real: "레이아웃 난독화", note: "약함" },
        { as: "글자를 암호로 적기", real: "데이터 난독화", note: "" },
        { as: "이야기 순서 뒤죽박죽", real: "제어 흐름 난독화", note: "강함" },
        { as: "나만 아는 말로 옮겨 적기", real: "가상화", note: "최강·고비용" },
      ],
      usage: "앱 보호·DRM입니다. 시험은 4분류·평가 축, 지연 목적, 악성코드 양면성입니다.",
      links: [
        { topic: "SW난독화", how: "동일 주제(보안 관점)입니다." },
        { topic: "DRM(Digital Right Management)", how: "콘텐츠 보호에 난독화를 씁니다." },
      ],
      exam: "난독화는 기능을 유지한 채 코드를 읽기 어렵게 변형해 역공학·변조를 지연시키는 기법으로, 레이아웃·데이터·제어흐름·가상화로 나뉘며 강도·내성·비용으로 평가한다.",
    }, image: "/concept/book/obfuscation.png", easy: "난독화는 코드의 가독성을 의도적으로 낮춰 역공학을 어렵게 만드는 보호 기법입니다. 기술 분류 [구데집제예] — 구획(layout: 주석 제거·식별자 훼손, 성능 저하 없음), 데이터(data: 변수·자료구조 변환), 집합(aggregation: 메소드·클래스 병합/분할), 제어(control: 제어 흐름 왜곡, 성능 저하 있음), 예방(preventive: 역난독화 도구 무력화). 기법별 특징·장단점 비교표가 출제되며, '구획은 성능 영향 없음, 제어는 성능 저하 감수'의 트레이드오프와 모바일 앱·라이선스 보호라는 활용처가 포인트입니다." },
  "usability-eval": {
    guide: {
      hook: "기능 자랑 말고 '처음 쓰는 사람이 헤매지 않는지' 지켜보는 평가입니다.",
      scene: "새 전자레인지를 출시 전에 처음 보는 어르신께 데워 보시라 하고 옆에서 지켜보면 어디서 헤매는지 바로 드러납니다. 사용성 평가가 딱 이 관찰로, 실제 사용자가 과제를 해 보게 하거나(사용성 테스트) 전문가가 점검 목록으로 살펴(휴리스틱 평가), 일을 끝내는지(효과성)·수고가 적은지(효율성)·마음에 드는지(만족도)를 잽니다.",
      why: "사용성 3요소(효과성·효율성·만족도)와 평가 방법(사용성 테스트·휴리스틱 평가)이 출제 핵심입니다.",
      mechanism: "사용성(ISO 9241·25010): 효과성(과업 완수), 효율성(적은 노력·시간), 만족도. 학습성·기억성·오류·직관성. 평가 방법: 사용성 테스트(실제 사용자가 과업 수행·관찰·Think-aloud), 휴리스틱 평가(전문가가 닐슨의 10원칙 등으로 검토), 인지적 워크스루, 설문(SUS 척도), A/B 테스트, 아이트래킹. 정량(과업 성공률·시간·오류)+정성(만족도). UX·디자인 씽킹과 연계. 개선 반복.",
      map: [
        { as: "데우기를 끝내셨나", real: "효과성", note: "" },
        { as: "헤맨 시간·눌러 본 횟수", real: "효율성", note: "" },
        { as: "옆에서 지켜보기", real: "사용성 테스트", note: "실제 사용자" },
        { as: "전문가의 점검 목록 검사", real: "휴리스틱 평가", note: "닐슨 10원칙" },
      ],
      usage: "UX 품질 평가입니다. 시험은 사용성 3요소, 사용성 테스트·휴리스틱 평가입니다.",
      links: [
        { topic: "디자인 씽킹(Design Thinking)", how: "사용자 중심 평가를 공유합니다." },
        { topic: "ISO/IEC 25010:2023", how: "사용성이 품질 특성의 하나입니다." },
      ],
      exam: "사용성 평가는 효과성·효율성·만족도 관점에서 SW 사용 편의를 측정하는 활동으로, 실제 사용자가 과업을 수행하는 사용성 테스트와 전문가 휴리스틱 평가가 대표 방법이다.",
    }, image: "/concept/book/usability-eval.png", easy: "사용성 평가는 사용자가 실제 제품을 쓰는 모습을 관찰·분석해 효율성, 학습 용이성, 문제점과 개선 요구를 찾아내는 공학적 테스트입니다. 절차 — 계획 수립 → 평가 설계 → 평가 실행 → 분석/보고. 유형 4가지 — 탐색적(초기 설계안 탐색), 평가(프로토타입 사용성 측정), 검증(출시 전 기준 충족 확인), 비교(대안 간 비교). 평가 항목·지표는 작업시간, 사용패턴, 정확성, 완성도, 학습 용이성, 일관성 등 정량 지표로 잽니다. 'ISO 9241의 효과성·효율성·만족도'와 연결하면 답안이 풍성해집니다." },
  "sbom": {
    guide: {
      hook: "SW를 구성하는 '모든 부품의 명세서' — 공급망 보안의 성분표입니다.",
      scene: "식품에 성분표가 있듯, SW에도 어떤 오픈소스·라이브러리로 만들어졌는지 목록이 필요합니다. SBOM이 있으면 취약점(Log4j)이 터졌을 때 '우리가 그걸 쓰는지' 즉시 확인하고 대응할 수 있습니다.",
      why: "'SW 구성요소 명세·공급망 가시성'과 표준(SPDX·CycloneDX), 활용이 출제 핵심입니다.",
      mechanism: "SBOM(Software Bill of Materials): SW의 모든 구성요소(오픈소스·라이브러리·의존성)와 버전·라이선스·출처를 목록화. 표준 포맷: SPDX(Linux 재단), CycloneDX(OWASP), SWID. 생성: 빌드 시 자동(SCA 도구). 활용: 취약점(CVE) 대응(영향 범위 즉시 파악), 라이선스 준수, 공급망 투명성. 미국 행정명령(EO 14028)으로 의무화 확산. 공급망 공격·오픈소스 위협 대응의 핵심.",
      map: [
        { as: "SW 성분표", real: "구성요소 명세", note: "" },
        { as: "SPDX·CycloneDX", real: "표준 포맷", note: "" },
        { as: "취약점 영향 즉시 파악", real: "핵심 활용", note: "Log4j" },
        { as: "빌드 시 자동 생성", real: "SCA 도구", note: "" },
      ],
      usage: "공급망 보안·취약점 대응입니다. 시험은 SBOM 개념·표준, 취약점 대응, 공급망 공격과의 관계입니다.",
      links: [
        { topic: "공급망 공격(Supply Chain Attack)", how: "SBOM이 공급망 가시성을 제공합니다." },
        { topic: "오픈소스 SW 보안위협", how: "SBOM으로 오픈소스 위협에 대응합니다." },
      ],
      exam: "SBOM은 SW를 구성하는 모든 오픈소스·라이브러리·의존성을 버전·라이선스와 함께 목록화한 명세로, SPDX·CycloneDX 표준을 쓰며 취약점 영향 파악·공급망 보안에 핵심이다.",
    }, image: "/concept/book/sbom.png", easy: "SBOM은 소프트웨어를 구성하는 컴포넌트·구성 요소를 식별 메타데이터, 저작권·라이선스 정보와 함께 목록화한 공식 SW 자재 명세서입니다 — 식품의 성분표에 해당합니다. 기술 요소 두 축: Baseline Attributes(작성자, 타임스탬프, 공급자명, 컴포넌트명, 버전, 해시, 고유 식별자, 의존 관계 등 최소 필수 항목)와 표준 포맷 3종(SPDX, CycloneDX, SWID). Log4j 사태처럼 취약점이 터졌을 때 '우리 제품에 그 컴포넌트가 있는가'를 즉시 추적하는 공급망 보안의 핵심 수단이라는 맥락이 답안 포인트입니다." },
  "direct-purchase": {
    guide: {
      hook: "공공사업에서 '상용 SW를 분리해 직접 구매'하도록 하는 제도입니다.",
      scene: "SI 사업에 상용 SW를 끼워 넣으면 SW 제값을 못 받고 하도급 문제가 생깁니다. 직접구매(분리발주)는 일정 금액 이상 상용 SW를 발주기관이 SI와 분리해 직접 구매하게 해, SW 기업이 제값을 받게 합니다.",
      why: "'분리발주·상용 SW 제값 받기'가 출제 핵심입니다. 영향평가와 연결됩니다.",
      mechanism: "제도: 일정 금액·요건 이상의 상용 SW를 SI(구축 사업)에서 분리해 발주기관이 직접 구매(분리발주). 대상: 영향평가 등으로 상용 SW 활용이 적정한 경우. 목적: SW 기업의 정당한 대가·하도급 개선, 상용 SW 산업 육성, 유지보수 책임 명확화. SW진흥법 근거. 영향평가→직접구매로 연계. 발주기관이 SW·구축을 각각 관리(인터페이스 조정 필요).",
      map: [
        { as: "상용 SW 분리 발주", real: "분리발주", note: "" },
        { as: "발주기관이 직접 구매", real: "직접구매", note: "" },
        { as: "SW 제값·하도급 개선", real: "목적", note: "" },
        { as: "영향평가 연계", real: "제도 흐름", note: "" },
      ],
      usage: "공공 SW 조달입니다. 시험은 분리발주, 제값 받기, 영향평가와의 관계입니다.",
      links: [
        { topic: "소프트웨어사업 영향평가", how: "영향평가 후 직접구매로 이어집니다." },
        { topic: "SW 사업대가 ('25년 개정판)", how: "상용 SW 대가 산정과 연계됩니다." },
      ],
      exam: "상용 SW 직접구매 제도는 일정 금액 이상 상용 SW를 SI에서 분리해 발주기관이 직접 구매(분리발주)하게 해, SW 기업의 제값·하도급 개선을 도모하며 영향평가와 연계된다.",
    }, image: "/concept/book/direct-purchase.png", easy: "상용SW 직접구매(분리발주)는 공공 정보화사업에서 HW·SW·시스템통합 일괄 발주에 묻히지 않게, 발주기관이 상용SW만 별도로 발주·평가·선정·계약하는 제도입니다(SW진흥법 54조). 직접구매 대상과 제외 기준(사업 특성상 분리가 곤란한 경우 등)이 표로 정리되어 있고, 법적 근거는 SW진흥법과 SW사업 계약·관리감독에 관한 지침입니다. 취지 — SI 대기업 하도급 구조에서 상용SW 기업을 보호하고 제값을 받게 한다 — 와 '분리발주'라는 별칭이 시험 포인트입니다." },
  "sw-impact-assessment": {
    guide: {
      hook: "공공 SW 사업이 '민간 시장을 침해하지 않는지' 평가하는 제도입니다.",
      scene: "공공기관이 이미 상용 SW가 있는 영역을 직접 개발하면 민간 시장을 잠식합니다. SW사업 영향평가는 공공 SW 사업이 민간 시장에 미치는 영향을 사전 평가해, 중복 개발을 막고 상용 SW 구매를 유도합니다.",
      why: "'민간 시장 침해 방지·상용 SW 구매 유도'가 출제 핵심입니다. 직접구매 제도와 연결됩니다.",
      mechanism: "대상: 공공기관의 SW 개발·구축 사업(일정 규모). 평가: 해당 사업이 민간 상용 SW 시장과 중복·경합되는지, 상용 SW로 대체 가능한지 사전 검토 → 상용 SW 활용·직접구매 권고. 목적: 공공의 민간 시장 잠식 방지, 상용 SW 산업 육성, 중복 개발 예산 절감. SW진흥법 근거. 상용SW 직접구매(분리발주)와 연계. NIPA 등 수행.",
      map: [
        { as: "민간 시장 중복 검토", real: "영향 평가", note: "" },
        { as: "상용 SW 대체 가능?", real: "구매 유도", note: "" },
        { as: "중복 개발 방지", real: "목적", note: "" },
        { as: "직접구매 연계", real: "제도", note: "" },
      ],
      usage: "공공 SW 사업 검토입니다. 시험은 민간 시장 침해 방지, 직접구매와의 관계입니다.",
      links: [
        { topic: "상용 소프트웨어 직접구매 제도", how: "영향평가 후 직접구매를 유도합니다." },
        { topic: "정보시스템 감리 의무 대상과 관점별 점검 기준", how: "공공 사업 관리 제도를 공유합니다." },
      ],
      exam: "SW사업 영향평가는 공공 SW 사업이 민간 상용 SW 시장을 침해·중복하는지 사전 평가해 상용 SW 구매를 유도하는 제도로, 직접구매(분리발주)와 연계된다.",
    }, image: "/concept/book/sw-impact-assessment.webp", easy: "SW사업 영향평가는 국가기관 등이 SW 사업의 예산편성·발주나 SW 배포·서비스 제공을 추진할 때, 민간 SW 시장 침해 여부를 사전 검토·조정하는 제도입니다(SW진흥법 43조). 절차는 예산편성 단계의 자체 평가부터 발주 전 재평가, 이의신청·조정까지 5단계 흐름. 대상은 국가기관 등의 SW 사업이고, 제외 사업도 규정돼 있습니다. '공공이 민간 시장을 침범하지 않게 하는 장치'라는 취지와, 예산 단계와 발주 단계에서 두 번 본다는 구조가 답안 포인트입니다." },
  "feasibility-study": {
    guide: {
      hook: "대형 정보화 사업을 '시작 전 타당성을 검증'하는 예비타당성 조사입니다.",
      scene: "수백억 규모 공공 정보화 사업을 무턱대고 시작하면 예산 낭비입니다. 예비타당성 조사는 사업의 필요성·경제성·정책성을 사전에 분석해, 투자할 가치가 있는지 검증하고 예산 낭비를 막습니다.",
      why: "예타의 3대 분석(경제성·정책성·기술성)과 AHP 종합 평가가 출제 핵심입니다.",
      mechanism: "대상: 총사업비 일정 규모 이상 신규 정보화 사업(국가재정법). 분석: 경제성(비용-편익 분석 — B/C, NPV, 편익 계량화), 정책성(정책 부합·위험·특수 평가), 기술성(기술 타당성·구현 가능성). 종합: AHP(계층분석 — 3분석을 가중 종합해 시행/미시행 결정). 수행: 기재부·전문기관(KDI·NIA). 목적: 재정 효율·타당성 확보. ISP·정보화 계획과 연계. 예타 면제 사업도 있음.",
      map: [
        { as: "비용-편익", real: "경제성(B/C·NPV)", note: "" },
        { as: "정책 부합·위험", real: "정책성", note: "" },
        { as: "구현 가능성", real: "기술성", note: "" },
        { as: "AHP 종합", real: "시행 결정", note: "" },
      ],
      usage: "공공 정보화 사업 타당성입니다. 시험은 3대 분석, AHP, ISP와의 연계입니다.",
      links: [
        { topic: "경제성 분석 기법", how: "경제성 분석의 기법입니다." },
        { topic: "ISP (Information Strategy Planning)", how: "정보화 계획과 연계됩니다." },
      ],
      exam: "정보화사업 예비타당성 조사는 대형 신규 사업의 경제성(B/C)·정책성·기술성을 사전 분석하고 AHP로 종합해 시행 여부를 결정하는 재정 검증 제도다.",
    }, image: "/concept/book/feasibility-study.png", easy: "정보화사업 예비타당성 조사는 국가재정법 제38조에 따라 대규모 신규 사업의 예산 편성·기금 운용계획 수립 전에 기획재정부장관 주관으로 실시하는 사전 타당성 검증·평가 제도입니다. 대상 기준 [사5지 3신] — 총사업비 500억 원 이상이면서 국가 재정지원 300억 원 이상인 신규사업(타당성조사비·설계비 등 국고지원이 없었던 사업). 필요성은 세 측면 — 경제적(수요·경제성 없는 사업의 추진 가능성 제거로 예산 낭비 최소화), 기술적(사업비 증액·계획 변경 리스크 완화, 중도 취소 방지), 정책적(후보사업군 비교·검토로 사업 우선순위 결정). '예산이 편성되기 전 단계의 검증'이라는 위치(ISP·ISMP보다 앞)와 '사5지3신' 숫자가 시험 포인트입니다." },
  "sw-safety-guideline": {
    guide: {
      hook: "SW 오작동이 '인명·재산 피해'로 이어지지 않게 안전을 확보하는 지침입니다.",
      scene: "자동차·의료기기·철도의 SW는 오류가 곧 사고입니다. SW 안전 지침은 이런 안전 필수(safety-critical) SW의 생명주기 전반에서 위험을 식별·통제해 안전을 확보하는 방법을 제시합니다.",
      why: "'기능 안전(Functional Safety)'과 위험 분석·안전 무결성 수준(SIL)이 출제 핵심입니다.",
      mechanism: "핵심: 기능 안전(오작동이 위험으로 가지 않게). 활동: 위험원 식별·분석(FTA·FMEA·HAZOP·STPA)→위험 평가→안전 요구 도출→안전 무결성 수준(SIL — 위험도별 요구 엄격도) 부여→설계·검증(다중화·페일세이프·안전 아키텍처)→안전성 평가. 표준: IEC 61508(일반), ISO 26262(자동차), IEC 62304(의료기기), DO-178C(항공). 생명주기 전반 안전 관리. SW 안전과 보안(security)은 구분·상호작용.",
      map: [
        { as: "오작동→위험 차단", real: "기능 안전", note: "" },
        { as: "위험원 식별·분석", real: "FTA·FMEA·STPA", note: "" },
        { as: "위험도별 요구 수준", real: "SIL", note: "" },
        { as: "IEC 61508·26262", real: "안전 표준", note: "" },
      ],
      usage: "안전 필수 SW 개발입니다. 시험은 기능 안전, 위험 분석, SIL·안전 표준입니다.",
      links: [
        { topic: "STPA (System-Theoretic Process Analysis)", how: "복잡계 안전 분석 기법입니다." },
        { topic: "자율주행 자동차 보안취약점 및 대응방안", how: "안전 필수 SW의 대표 사례입니다." },
      ],
      exam: "SW 안전 지침은 오작동이 인명·재산 피해로 이어지지 않게 하는 기능 안전 확보 지침으로, 위험 분석(FTA·STPA)·안전 무결성 수준(SIL)·IEC 61508 등 표준으로 관리한다.",
    }, image: "/concept/book/sw-safety-guideline.png", easy: "SW 안전 확보 지침은 SW 오작동으로 인한 생명·신체·재산 피해를 막기 위해, 안전 책임자와 안전관리 대상 SW의 개발·운영 단계별 관리기준을 정한 고시입니다(SW진흥법 30조 2항). 주요 용어 — 위험원(피해를 유발할 수 있는 잠재 요인), 장애, 소프트웨어 안전. 지침 구성 — 1장 총칙, 2장 SW 개발단계 안전확보(위험원 분석·안전 요구사항), 3장 SW 운영단계 안전확보(모니터링·변경 관리), 4장 그 외 사항. '개발단계와 운영단계로 나눠 관리기준을 둔다'는 구조가 시험 포인트입니다." },
  "se-135": {
    guide: {
      hook: "'테스트를 먼저 짜고 그걸 통과하는 코드를 짜는' 개발 방법입니다.",
      scene: "코드부터 짜고 나중에 테스트하면 빠뜨립니다. TDD는 순서를 뒤집어, 실패하는 테스트를 먼저 쓰고(Red) → 통과할 최소 코드를 짜고(Green) → 리팩토링(Refactor)하는 짧은 사이클을 반복합니다.",
      why: "Red-Green-Refactor 사이클과 효과(설계 개선·회귀 방지)가 출제 핵심입니다. BDD와의 관계가 포인트입니다.",
      mechanism: "사이클: Red(실패하는 테스트 작성 — 요구를 테스트로 명세) → Green(테스트 통과할 최소한의 코드) → Refactor(중복 제거·구조 개선, 테스트가 안전망). 짧게 반복. 효과: 요구 명확화, 테스트 커버리지 자연 확보, 회귀 방지, 과설계 방지(필요한 것만), 리팩토링 자신감. 단위 테스트 중심. BDD(행위 주도, Given-When-Then)로 확장. XP의 핵심 실천. CI와 결합.",
      map: [
        { as: "실패 테스트 먼저", real: "Red", note: "요구 명세" },
        { as: "통과 최소 코드", real: "Green", note: "" },
        { as: "구조 개선", real: "Refactor", note: "테스트가 안전망" },
        { as: "회귀 방지·설계 개선", real: "효과", note: "" },
      ],
      usage: "품질 중심 개발입니다. 시험은 Red-Green-Refactor, 효과, BDD와의 관계입니다.",
      links: [
        { topic: "XP (eXtreme Programming)", how: "TDD는 XP의 핵심 실천입니다." },
        { topic: "코드 커버리지(Code Coverage)", how: "TDD가 커버리지를 자연 확보합니다." },
      ],
      exam: "TDD는 실패하는 테스트를 먼저 쓰고(Red) 통과 코드를 짜고(Green) 리팩토링(Refactor)하는 사이클을 반복하는 개발법으로, 회귀 방지·설계 개선·과설계 방지 효과가 있다.",
    }, image: "/concept/book/se-135.png", easy: "코드를 먼저 짜고 나중에 테스트하는 게 아니라, 순서를 뒤집어 '실패하는 테스트'부터 만드는 개발법입니다. 주문(요구사항)을 받으면 → 채점표(테스트)부터 만들고 → 채점표를 통과할 만큼만 빠르게 코드를 짜고 → 지저분한 부분을 정리(리팩토링)합니다. 이 리듬이 RED(실패 테스트 작성)–GREEN(통과하는 최소 코드)–REFACTOR(개선)입니다. 채점표가 항상 먼저 있으니 고칠 때마다 안심하고 고칠 수 있다는 게 핵심 이득입니다. 교재 두음 [요테구리] — 요구사항·테스트·구현·리팩토링." },
  "se-139": {
    guide: {
      hook: "'개발(Dev)과 운영(Ops)의 벽을 허물어' 빠르고 안정적으로 배포하는 문화·실천입니다.",
      scene: "개발팀은 빨리 내놓고 싶고 운영팀은 안정을 원해 갈등합니다. DevOps는 이 둘을 하나로 묶어, 자동화(CI/CD)와 협업으로 자주·안전하게 배포하고 빠르게 피드백받습니다.",
      why: "CI/CD 파이프라인과 문화(협업·자동화·측정·공유)가 출제 핵심입니다. DevSecOps·SRE와의 관계가 포인트입니다.",
      mechanism: "핵심: CALMS(Culture 협업, Automation 자동화, Lean, Measurement, Sharing). 실천: CI(지속적 통합 — 자주 통합·자동 빌드·테스트), CD(지속적 전달/배포 — 자동 릴리스), IaC(인프라 코드화), 모니터링·피드백, 마이크로서비스·컨테이너(Docker·K8s). 효과: 배포 빈도↑·리드타임↓·장애 복구↓(DORA 지표). 보안 통합(DevSecOps), 신뢰성(SRE), 릴리스 엔지니어링으로 확장. 문화가 도구보다 본질.",
      map: [
        { as: "개발·운영 벽 허물기", real: "협업 문화", note: "" },
        { as: "자주 통합·자동 빌드", real: "CI", note: "" },
        { as: "자동 릴리스", real: "CD", note: "" },
        { as: "인프라 코드화", real: "IaC", note: "" },
      ],
      usage: "현대 SW 배포·운영입니다. 시험은 CI/CD, CALMS 문화, DevSecOps·SRE·DORA와의 관계입니다.",
      links: [
        { topic: "DevSecOps", how: "DevOps에 보안을 통합합니다." },
        { topic: "SRE (Site Reliability Engineering)", how: "신뢰성 공학으로 DevOps를 구현합니다." },
      ],
      exam: "DevOps는 개발과 운영을 통합해 CI/CD 자동화와 협업 문화(CALMS)로 자주·안전하게 배포하는 실천으로, DevSecOps·SRE로 확장되며 DORA 지표로 성과를 측정한다.",
    }, image: "/concept/book/se-139.png", easy: "개발팀(만드는 사람)과 운영팀(돌리는 사람)이 서로 떠넘기던 벽을 허물고, 소통·협업·자동화로 한 팀처럼 일하는 문화이자 방법론입니다. 개념도의 무한 루프(∞)가 전부입니다 — DEV(계획·개발·검증·패키징)와 OPS(릴리즈·설정·모니터링)가 끊임없이 이어집니다. 이를 받치는 도구가 CI(코드 바뀔 때마다 자동 빌드+테스트, Git+Jenkins), CD(운영 반영까지 자동화), 프로비저닝(서버 설치·구성 자동화)입니다. '완료(Done)의 기준이 코드 작성이 아니라 운영서버 정상동작'이라는 문장이 시험 포인트입니다." },
  "se-141": {
    guide: {
      hook: "'소프트웨어 공학으로 운영·신뢰성을 다루는' 구글발 방법론입니다.",
      scene: "'운영은 수작업'이라는 통념을 깨고, SRE는 운영 문제를 코드로 해결합니다. 신뢰성 목표(SLO)를 수치로 정하고, 오류 예산으로 개발 속도와 안정성의 균형을 잡으며, 반복 작업(Toil)을 자동화합니다.",
      why: "SLI/SLO/오류 예산과 Toil 자동화가 출제 핵심입니다. DevOps 구현체라는 위치가 포인트입니다.",
      mechanism: "핵심: SLI(Service Level Indicator — 측정 지표, 예: 가용성·지연), SLO(목표치, 예: 99.9%), SLA(외부 계약). 오류 예산(Error Budget = 1−SLO — 허용 실패량, 남으면 새 기능 배포·소진되면 안정화 집중 → 개발 속도와 안정성 균형). Toil(반복적 수작업 운영 — 자동화로 제거, 시간 상한). 실천: 모니터링·알림·포스트모템(비난 없는 사후 분석)·용량 계획·점진 배포. ‘SRE는 DevOps의 구체적 구현’이다.",
      map: [
        { as: "측정 지표·목표", real: "SLI/SLO", note: "" },
        { as: "허용 실패량", real: "오류 예산(1−SLO)", note: "속도·안정 균형" },
        { as: "반복 수작업 제거", real: "Toil 자동화", note: "" },
        { as: "비난 없는 사후 분석", real: "포스트모템", note: "" },
      ],
      usage: "신뢰성 운영입니다. 시험은 SLI/SLO/오류예산, Toil, DevOps와의 관계입니다.",
      links: [
        { topic: "데브옵스 (DevOps)", how: "SRE는 DevOps의 구체적 구현입니다." },
        { topic: "카오스 엔지니어링 (Chaos Engineering)", how: "신뢰성 검증 기법입니다." },
      ],
      exam: "SRE는 소프트웨어 공학으로 운영을 다루는 방법론으로, SLI/SLO와 오류 예산(1−SLO)으로 개발 속도·안정성을 균형 잡고 반복 수작업(Toil)을 자동화하는 DevOps 구현체다.",
    }, image: "/concept/book/se-141.png", easy: "구글 운영팀에서 나온 방식으로, '운영을 사람 손이 아니라 소프트웨어 엔지니어링으로 한다'입니다. 핵심 발상 두 가지 — ① 측정: 서비스 수준을 숫자로 정의(SLI 지표, SLO 목표)하고 모든 판단을 데이터로 합니다. ② Error Budget: '이만큼은 장애 나도 된다'는 예산을 정해 두고, 예산이 남으면 과감히 배포하고 예산을 다 쓰면 안정화에 집중합니다. 반복 수작업(Toil)은 자동화로 없애고, 장애가 나면 비난 없이 회고(Postmortem)합니다. 배포는 카나리·롤링으로 조금씩 — 장애 원인의 70%가 '변경'이기 때문입니다." },
  "se-143": {
    guide: {
      hook: "서비스를 '멈추지 않고' 새 버전으로 교체하는 배포 전략입니다.",
      scene: "배포 때마다 서비스가 끊기면 사용자가 이탈합니다. 무중단 배포는 구·신 버전을 병행하며 트래픽을 점진 전환해, 사용자가 눈치채지 못하게 교체하고 문제 시 즉시 되돌립니다.",
      why: "주요 전략(블루-그린·카나리·롤링)의 원리·장단이 출제 핵심입니다. 롤백 용이성이 포인트입니다.",
      mechanism: "블루-그린(Blue-Green): 동일한 두 환경(현재 Blue·신규 Green) 준비, 트래픽을 한 번에 전환, 문제 시 즉시 롤백(트래픽 되돌림) — 자원 2배. 카나리(Canary): 신 버전에 소수 트래픽부터 점진 확대·모니터링, 위험 최소·정밀 — 관리 복잡. 롤링(Rolling): 인스턴스를 조금씩 순차 교체 — 자원 효율·롤백 느림, 버전 혼재. A/B 테스트(기능 검증)와 구분. 로드밸런서·오케스트레이터(K8s)로 구현.",
      map: [
        { as: "두 환경 통째 전환", real: "블루-그린", note: "즉시 롤백·자원 2배" },
        { as: "소수부터 점진 확대", real: "카나리", note: "위험 최소" },
        { as: "조금씩 순차 교체", real: "롤링", note: "자원 효율" },
        { as: "문제 시 되돌리기", real: "롤백", note: "" },
      ],
      usage: "무중단 서비스 배포입니다. 시험은 블루-그린/카나리/롤링 원리·장단, 롤백입니다.",
      links: [
        { topic: "릴리즈 엔지니어링", how: "배포 전략을 다루는 상위 영역입니다." },
        { topic: "데브옵스 (DevOps)", how: "CD 파이프라인에서 무중단 배포를 씁니다." },
      ],
      exam: "무중단 배포는 구·신 버전을 병행해 서비스 중단 없이 교체하는 전략으로, 두 환경을 전환하는 블루-그린, 점진 확대하는 카나리, 순차 교체하는 롤링이 있다.",
    }, image: "/concept/book/se-143.png", easy: "서비스를 끄지 않고 새 버전을 내보내는 세 가지 방법입니다. 식당으로 보면 — 롤링: 주방 화구를 하나씩 새것으로 교체(추가 비용 적고 롤백 쉬움, 교체 중엔 처리량 줄어듦). 블루/그린: 옆에 새 주방을 통째로 차려 놓고 손님을 한 번에 새 주방으로 안내(실제 환경으로 미리 테스트 가능, 대신 주방 2개 비용). 카나리: 손님 5%만 먼저 새 주방으로 보내 보고 문제없으면 전부 전환(위험을 빨리 감지, A/B 테스트 겸용). 광산의 카나리아 새에서 온 이름입니다." },
  "se-145": {
    guide: {
      hook: "SW를 '안정적으로 빌드·배포·출시'하는 전 과정을 공학적으로 관리하는 영역입니다.",
      scene: "코드를 실제 사용자에게 내놓기까지 빌드·버전·배포·롤백을 체계적으로 관리해야 사고가 안 납니다. 릴리스 엔지니어링은 이 과정을 재현 가능·자동화·일관되게 만드는 실천입니다.",
      why: "릴리스 원칙(재현성·자동화)과 CI/CD·버전 관리와의 관계가 출제 포인트입니다.",
      mechanism: "핵심 원칙: 재현성(같은 소스→같은 결과, 결정적 빌드), 자동화(수작업 최소), 정책 기반(승인·게이트), 셀프서비스. 활동: 빌드(소스→아티팩트), 버전 관리(시맨틱 버저닝), 아티팩트 저장소, 배포 파이프라인(CD), 릴리스 노트, 롤백. 배포 전략(무중단·카나리)·기능 플래그(Feature Flag — 배포와 릴리스 분리). DevOps의 배포 측면 전문화. 구글 SRE의 한 축.",
      map: [
        { as: "같은 소스=같은 결과", real: "재현성", note: "결정적 빌드" },
        { as: "수작업 최소", real: "자동화", note: "" },
        { as: "배포와 릴리스 분리", real: "기능 플래그", note: "" },
        { as: "버전·아티팩트 관리", real: "빌드·저장소", note: "" },
      ],
      usage: "SW 출시 관리입니다. 시험은 재현성·자동화, 기능 플래그, CI/CD와의 관계입니다.",
      links: [
        { topic: "무중단 배포", how: "릴리스 엔지니어링의 배포 전략입니다." },
        { topic: "데브옵스 (DevOps)", how: "배포 측면을 전문화한 영역입니다." },
      ],
      exam: "릴리스 엔지니어링은 빌드·버전·배포·출시를 재현성·자동화·정책 기반으로 관리하는 공학 영역으로, 기능 플래그로 배포와 릴리스를 분리하고 CI/CD와 결합한다.",
    }, image: "/concept/book/se-145.png", easy: "코드가 개발자 손을 떠나 사용자에게 도달하기까지의 컨베이어 벨트(파이프라인)를 설계·운영하는 공학입니다. 벨트의 6단계 — 통합(브랜치 병합, Git) → 지속적 통합(자동 빌드+테스트, Jenkins) → 빌드 시스템(Maven·CMake로 실행물 생성) → 코드형 인프라(IaC — 서버 환경을 코드로 자동 생성, Ansible·Docker) → 배포(블루그린·카나리 전략) → 릴리즈(사용자 공개). '사람 손 개입 없이, 안정적이고 예측 가능하게'가 목표입니다." },
  "se-144": {
    guide: {
      hook: "'일부러 장애를 주입해' 시스템의 회복력을 검증하는 공학 실천입니다.",
      scene: "실제 장애가 나야 약점을 아는 건 너무 늦습니다. 카오스 엔지니어링은 통제된 환경에서 서버를 죽이거나 지연을 넣는 등 의도적 혼란을 주입해, 시스템이 견디는지 미리 확인하고 약점을 고칩니다(넷플릭스 카오스 몽키).",
      why: "'의도적 장애 주입·회복력 검증'과 실험 절차가 출제 핵심입니다. SRE·디지털 면역 시스템과 연결됩니다.",
      mechanism: "절차: 정상 상태(정량 지표) 정의 → 가설 수립(‘서버 하나 죽어도 정상 유지’) → 실제 장애 주입(인스턴스 종료·네트워크 지연·자원 고갈, 작은 범위·블라스트 반경 제한) → 결과 관측·가설 검증 → 약점 개선. 원칙: 실제 환경·최소 영향·자동화·점진 확대. 도구: Chaos Monkey·Gremlin·LitmusChaos. SRE·복원력(레질리언스)의 검증 수단. 디지털 면역 시스템의 구성요소.",
      map: [
        { as: "정상 상태 정의", real: "정량 지표", note: "" },
        { as: "장애 주입 가설", real: "가설 수립", note: "" },
        { as: "일부러 죽이기", real: "장애 주입", note: "블라스트 반경 제한" },
        { as: "약점 개선", real: "회복력 강화", note: "" },
      ],
      usage: "회복력 검증입니다. 시험은 실험 절차, 블라스트 반경, SRE·DIS와의 관계입니다.",
      links: [
        { topic: "SRE (Site Reliability Engineering)", how: "신뢰성 검증 수단입니다." },
        { topic: "디지털 면역 시스템(DIS, Digital Immune System)", how: "카오스 엔지니어링이 구성요소입니다." },
      ],
      exam: "카오스 엔지니어링은 통제된 환경에 의도적 장애를 주입해 회복력을 검증하는 실천으로, 정상 상태 정의·가설·주입·검증 절차를 블라스트 반경을 제한하며 수행한다.",
    }, image: "/concept/book/se-144.png", easy: "멀쩡히 돌아가는 시스템에 일부러 고장을 내서(Fault Injection) 진짜로 버티는지 확인하는 기법입니다. 넷플릭스가 운영 중인 서버를 무작위로 죽이는 Chaos Monkey로 유명해졌습니다. 절차는 과학 실험과 같습니다 — ① 정상 상태를 숫자로 정의하고 ② '서버 하나가 죽어도 정상일 것'이라는 가설을 세우고 ③ 실제로 고장을 주입하고 ④ 지표를 측정해 ⑤ 가설이 맞았는지 검증, 틀렸으면 시스템을 보강합니다. '사고가 나기 전에 사고를 내 본다'는 발상 전환이 핵심입니다." },
  "sec-341": {
    guide: {
      hook: "DevOps 파이프라인에 '보안을 자동으로 녹여 넣는' 문화입니다(SE 관점).",
      scene: "보안을 출시 직전에만 검사하면 늦고 비쌉니다. DevSecOps는 개발·빌드·테스트·배포 각 단계에 보안 자동화(SAST·DAST·SCA)를 심어, 개발 속도를 늦추지 않으면서 취약점을 조기에 잡습니다.",
      why: "'Shift Left·파이프라인 단계별 보안'과 SAST/DAST/SCA 매핑이 출제 핵심입니다. DevOps에 보안을 더한 확장입니다.",
      mechanism: "파이프라인 매핑: 코딩(IDE 보안 린트·시크릿 스캔)→빌드(SAST 정적분석·SCA 의존성)→테스트(DAST 동적분석·IAST)→배포(IaC·컨테이너 이미지 스캔)→운영(RASP·모니터링). 문화: 보안을 전원의 책임으로·자동화로 마찰 최소화. Shift Left(보안을 왼쪽으로). 시큐어 코딩·공급망 보안(SBOM)을 실행. DevOps의 보안 확장.",
      map: [
        { as: "라인마다 보안 검사기", real: "파이프라인 단계별", note: "Shift Left" },
        { as: "정적 분석", real: "SAST", note: "빌드" },
        { as: "동적 분석", real: "DAST", note: "테스트" },
        { as: "의존성 취약점", real: "SCA", note: "공급망" },
      ],
      usage: "안전한 CI/CD입니다. 시험은 SAST/DAST/SCA 매핑, Shift Left, DevOps와의 관계입니다.",
      links: [
        { topic: "데브옵스 (DevOps)", how: "DevOps에 보안을 통합한 확장입니다." },
        { topic: "시큐어 코딩(Secure Coding)", how: "코드 보안을 파이프라인에서 자동 검증합니다." },
      ],
      exam: "DevSecOps는 CI/CD 각 단계에 SAST·DAST·SCA 등 보안 자동화를 내재화하는 문화로, 보안을 왼쪽으로 당겨(Shift Left) 전원의 책임으로 만들어 취약점을 조기에 잡는다.",
    }, image: "/concept/book/sec-341.png", easy: "DevOps의 무한 루프 한가운데에 Sec(보안)을 박아 넣은 것입니다. 예전엔 다 만든 뒤 마지막에 보안 검사를 했다면, 이제는 코드 작성·빌드·테스트·릴리즈·운영 전 단계에 보안이 스며듭니다 — 테스트 단계엔 IAST(정적+동적 분석)·퍼징·모의해킹, 분석엔 FMEA, 운영 중엔 RASP(실행 중 스스로 공격을 막는 기술). 평가 접근법 CARTA는 '보안은 한 번의 합격/불합격이 아니라 지속적(Continuous)·적응형(Adaptive) 위험(Risk)·신뢰(Trust) 평가(Assessment)'라는 뜻입니다." },
  "se-149": {
    guide: {
      hook: "테스트를 제대로 하기 위한 '7가지 근본 원칙'입니다.",
      scene: "테스트에 대한 오해가 많습니다. 원칙들은 그 오해를 바로잡습니다 — 테스트는 결함의 존재만 보이지 없음은 증명 못 하고, 완벽한 테스트는 불가능하며, 결함은 특정 모듈에 몰린다는 등의 통찰입니다.",
      why: "7원칙 각각의 의미가 출제 핵심입니다. 특히 완벽 테스팅 불가·결함 집중·살충제 역설이 자주 나옵니다.",
      mechanism: "7원칙(ISTQB): ①결함 존재 입증(있음은 보여도 없음은 증명 불가), ②완벽 테스팅 불가능(모든 경우 불가 → 위험 기반 선별), ③초기 테스트(Shift Left, 조기 발견이 저비용 — 1:10:100), ④결함 집중(소수 모듈에 결함 몰림 — 파레토), ⑤살충제 역설(같은 테스트 반복하면 새 결함 못 찾음 → 테스트 갱신), ⑥정황 의존(맥락별 다른 접근), ⑦오류-부재의 궤변(결함 없어도 요구 안 맞으면 무의미). 테스트 전략의 기초.",
      map: [
        { as: "없음은 증명 불가", real: "결함 존재 입증", note: "①" },
        { as: "모든 경우 불가", real: "완벽 테스팅 불가", note: "②" },
        { as: "결함은 몰린다", real: "결함 집중", note: "④ 파레토" },
        { as: "같은 테스트는 무뎌짐", real: "살충제 역설", note: "⑤" },
      ],
      usage: "테스트 전략 수립입니다. 시험은 7원칙, 완벽 테스팅 불가·결함 집중·살충제 역설입니다.",
      links: [
        { topic: "Test Exit Criteria", how: "완벽 테스팅 불가 → 종료 조건 필요입니다." },
        { topic: "위험 기반 테스트", how: "선별 테스트의 근거입니다." },
      ],
      exam: "테스트 원리는 결함 존재 입증·완벽 테스팅 불가·초기 테스트·결함 집중·살충제 역설·정황 의존·오류부재 궤변의 7원칙으로, 테스트 전략의 기초가 된다.",
    }, image: "/concept/book/se-149.png", easy: "테스트가 따르는 7가지 상식 법칙입니다. ① 테스트의 목적은 결함 '발견'(제거가 아님) ② 완벽한 테스트는 불가능(자원 한계) ③ 테스트는 초기부터(늦을수록 수정 비용 폭증) ④ 결함의 80%는 20% 모듈에 몰려 있다(파레토) ⑤ 살충제 패러독스 — 같은 테스트만 반복하면 벌레가 내성이 생기듯 새 결함을 못 찾는다(→ 테스트 케이스를 바꾸고 추가해야) ⑥ 테스트는 도메인 상황에 의존 ⑦ 오류 부재의 궤변 — 결함을 다 잡았어도 사용자가 원하는 물건이 아니면 소용없다(→ V&V로 '맞는 것을 만들었는지'까지 확인). ⑤와 ⑦의 개선방안이 단골 출제입니다." },
  "review": {
    guide: {
      hook: "코드·문서를 '사람이 읽어 결함을 찾는' 정적 테스트 기법입니다.",
      scene: "실행하지 않고도 코드·설계·요구서를 여러 사람이 검토해 결함을 찾습니다. 실행 전 단계에서 결함을 조기 발견하니 수정 비용이 훨씬 쌉니다. 형식 정도에 따라 여러 종류가 있습니다.",
      why: "정적 테스트로서의 위치와 리뷰 종류(인스펙션·워크스루·동료검토)의 형식 차이가 출제 핵심입니다.",
      mechanism: "정적 테스트(실행 없이 산출물 검토). 종류(형식↓ 순): 인스펙션(Inspection — 가장 공식적, 역할·체크리스트·측정, Fagan), 팀 리뷰, 워크스루(Walkthrough — 작성자 주도 설명·검토), 동료 검토(Peer Review), 애드혹. 정적 분석(도구 자동 — 다른 축). 효과: 조기 결함 발견(설계·요구 단계), 지식 공유, 표준 준수. 검토 대상: 요구서·설계·코드. 동적 테스트(실행)와 보완.",
      map: [
        { as: "실행 없이 검토", real: "정적 테스트", note: "" },
        { as: "가장 공식적", real: "인스펙션", note: "역할·측정" },
        { as: "작성자 주도 설명", real: "워크스루", note: "" },
        { as: "조기 결함 발견", real: "효과", note: "저비용" },
      ],
      usage: "정적 품질 검증입니다. 시험은 정적 테스트, 인스펙션/워크스루 형식 차이입니다.",
      links: [
        { topic: "테스트 원리", how: "조기 테스트 원칙을 구현합니다." },
        { topic: "SW 품질비용", how: "조기 발견으로 실패 비용을 줄입니다." },
      ],
      exam: "리뷰는 실행 없이 산출물을 검토해 결함을 찾는 정적 테스트로, 형식에 따라 인스펙션(가장 공식)·워크스루·동료검토로 나뉘며 조기 결함 발견으로 비용을 절감한다.",
    }, image: "/concept/book/review.png", easy: "코드를 '실행하지 않고' 눈으로 검토해 결함을 초기에 잡는 정적 테스트입니다. 실행 전 단계(요구사항 정의서·설계서)에서도 쓸 수 있다는 게 최대 강점 — 결함은 일찍 잡을수록 쌉니다. 공식성 순서로 4형식: 비공식 리뷰 < 기술적 리뷰 < 워크쓰루(사전 준비 생략, 작성자가 이끎) < 인스펙션(가장 공식적, 훈련된 중재자가 이끎). 페이건 인스펙션은 '전체 비용의 15%를 검토에 쓰면 전 단계 결함을 조기 발견한다'는 고전입니다. 프로세스 두음 [계시사미RF](계획–시작–사전검토–미팅–Rework–Follow-up), 참여자 [관중기작검]." },
  "se-156": {
    guide: {
      hook: "'내부 구조는 모른 채 입력-출력만' 보고 검증하는 명세 기반 테스트입니다.",
      scene: "상자 속을 안 열고 버튼을 눌러 결과만 확인하듯, 코드 내부를 모른 채 명세(요구)대로 입력에 맞는 출력이 나오는지 봅니다. 사용자 관점의 기능 테스트입니다.",
      why: "명세 기반 기법(동등분할·경계값·결정표·상태전이)이 출제 핵심입니다. 화이트박스와의 대비가 포인트입니다.",
      mechanism: "명세 기반(내부 무관, 입출력만). 기법: 동등 분할(Equivalence Partitioning — 같은 결과 내는 입력 그룹의 대표만 테스트), 경계값 분석(Boundary Value — 경계에서 결함 多, 경계·인접값), 결정 표(Decision Table — 조건 조합), 상태 전이(상태·이벤트), 원인-결과 그래프, 유스케이스 테스트, 페어와이즈. 장점: 사용자 관점·명세 검증. 한계: 내부 커버리지 모름·미구현 요구 못 잡음. 화이트박스(구조 기반)와 보완.",
      map: [
        { as: "내부 모름·입출력만", real: "명세 기반", note: "" },
        { as: "같은 결과 그룹 대표", real: "동등 분할", note: "" },
        { as: "경계에서 결함 多", real: "경계값 분석", note: "핵심" },
        { as: "조건 조합", real: "결정 표", note: "" },
      ],
      usage: "기능·인수 테스트입니다. 시험은 동등분할·경계값·결정표, 화이트박스와의 대비입니다.",
      links: [
        { topic: "화이트박스 테스트", how: "구조 기반과 대비됩니다." },
        { topic: "코드 커버리지(Code Coverage)", how: "화이트박스의 측정 지표입니다." },
      ],
      exam: "블랙박스 테스트는 내부 구조를 모른 채 명세대로 입출력을 검증하는 테스트로, 동등 분할·경계값 분석·결정 표·상태 전이 기법을 쓰며 화이트박스와 보완한다.",
    }, image: "/concept/book/se-156.png", easy: "속을 안 보고 '넣은 값 대비 나온 값'만 확인하는 사용자 관점 테스트입니다. 기법이 많아 보여도 발상은 셋뿐 — ① 다 못 해보니 대표만 고르기: 동등분할(입력을 구간으로 나눠 구간당 하나), 경계값 분석(버그는 경계에 몰리니 0·최대값 근처를 집중), 페어와이즈(결함 대부분은 두 요소의 조합에서 나니 쌍만 커버). ② 조건과 흐름을 표·그림으로 정리해 빠짐없이: 의사결정 테이블, 상태전이, 유스케이스, 분류트리, 원인-결과 그래프. ③ 감각으로 찌르기: 오류예측(입력 없이 엔터, 문법에 어긋난 입력)." },
  "se-158": {
    guide: {
      hook: "'코드 내부 구조를 보고' 실행 경로를 검증하는 구조 기반 테스트입니다.",
      scene: "상자를 열어 회로를 보며 모든 배선을 점검하듯, 코드의 분기·경로·조건을 보고 '모든 코드가 실행되는지'를 확인합니다. 커버리지로 얼마나 검증했는지 측정합니다.",
      why: "커버리지 종류(구문·분기·조건·경로)와 블랙박스와의 대비가 출제 핵심입니다. McCabe 복잡도와 연결됩니다.",
      mechanism: "구조 기반(코드 내부 논리·경로 분석). 커버리지: 구문(Statement — 모든 문장 실행), 분기/결정(Branch — 모든 분기 참·거짓), 조건(Condition — 각 조건 참·거짓), 조건/결정(MC/DC — 항공 등 고신뢰), 경로(Path — 모든 경로, 완전하나 폭발). 기법: 제어 흐름 그래프, 기본 경로 테스트(McCabe 순환복잡도 = 독립 경로 수). 장점: 내부 커버리지 정량화. 한계: 미구현 요구 못 잡음·명세 검증 약함. 블랙박스와 보완.",
      map: [
        { as: "내부 구조 보고", real: "구조 기반", note: "" },
        { as: "모든 문장 실행", real: "구문 커버리지", note: "" },
        { as: "모든 분기 참·거짓", real: "분기 커버리지", note: "" },
        { as: "독립 경로 수", real: "기본 경로(McCabe)", note: "" },
      ],
      usage: "단위 테스트·커버리지 측정입니다. 시험은 커버리지 종류, McCabe, 블랙박스와의 대비입니다.",
      links: [
        { topic: "코드 커버리지(Code Coverage)", how: "화이트박스의 측정 지표입니다." },
        { topic: "McCabe 회전 복잡도", how: "기본 경로 테스트의 근거입니다." },
      ],
      exam: "화이트박스 테스트는 코드 내부 구조를 분석해 실행 경로를 검증하는 테스트로, 구문·분기·조건·MC/DC·경로 커버리지와 McCabe 기본 경로 테스트를 쓴다.",
    }, image: "/concept/book/se-158.png", easy: "소스 코드를 직접 들여다보며 논리 흐름을 검증하는 개발자 관점 테스트입니다. '코드를 얼마나 훑었나'를 재는 자가 커버리지인데, 강도 순서가 핵심입니다 — 구문(모든 문장 한 번씩) < 결정(모든 if의 참/거짓) < 조건(if 안의 개별 조건까지 참/거짓) < 조건/결정 < 변경조건/결정(MC/DC — 각 조건이 독립적으로 결과를 바꾸는지, 항공·차량 안전 인증 요구) < 다중조건(모든 조합). 그 외 루프 테스트(경계 오류), 제어 구조 테스트(McCabe 복잡도 기반 기본 경로)가 있습니다. 블랙박스와의 비교표(관점·기준 문서·V모델 위치)도 그대로 출제됩니다." },
  "code-coverage": {
    guide: {
      hook: "'테스트가 코드를 얼마나 실행했는지'를 백분율로 재는 척도입니다.",
      scene: "테스트를 짰다고 안심하면 안 됩니다. 커버리지는 실제로 코드의 몇 %가 테스트로 실행됐는지 측정해, 검증 안 된 부분을 드러냅니다. 단, 100%가 결함 없음을 뜻하진 않습니다.",
      why: "커버리지 종류의 강도 순서와 '높은 커버리지 ≠ 품질 보장'이 출제 핵심입니다.",
      mechanism: "종류(강도 약→강): 구문 커버리지(실행된 문장 비율), 분기/결정 커버리지(각 분기의 참·거짓 실행), 조건 커버리지(각 불린 조건 참·거짓), 조건/결정(MC/DC — 각 조건이 독립적으로 결과에 영향, DO-178C 항공 필수), 경로 커버리지(모든 경로, 최강·폭발적). 측정 도구(JaCoCo 등). 주의: 높은 커버리지가 결함 없음을 보장하지 않음(잘못된 단언·미검증 경로)·목표 자체가 되면 왜곡. 화이트박스 테스트의 지표.",
      map: [
        { as: "실행된 문장 비율", real: "구문 커버리지", note: "약" },
        { as: "분기 참·거짓", real: "분기 커버리지", note: "" },
        { as: "조건 독립 영향", real: "MC/DC", note: "항공 필수" },
        { as: "100%도 결함 있음", real: "한계", note: "" },
      ],
      usage: "테스트 충분성 측정입니다. 시험은 커버리지 강도 순서, MC/DC, 한계입니다.",
      links: [
        { topic: "화이트박스 테스트", how: "커버리지는 화이트박스 지표입니다." },
        { topic: "McCabe 회전 복잡도", how: "경로 수 산정과 연계됩니다." },
      ],
      exam: "코드 커버리지는 테스트가 실행한 코드 비율로 구문·분기·조건·MC/DC·경로 순으로 강해지며, 높은 커버리지가 결함 없음을 보장하지는 않는다.",
    }, image: "/concept/book/code-coverage.png", easy: "테스트가 소스 코드를 몇 % 훑었는지의 지표로, 화이트박스 테스트의 '자'입니다. 포함 관계 그림 하나로 정리됩니다 — 구문(SC) ⊂ 결정(DC) ⊂ 조건/결정(C/DC) ⊂ 변경조건/결정(MC/DC) ⊂ 다중조건(MCC) ⊂ 전체 경로. 안쪽일수록 달성하기 쉽고 바깥일수록 강력합니다. 예를 들어 'if(A and B)'에서 — 구문 커버리지는 이 줄이 실행만 되면 만족, 결정은 참/거짓 다 나와야, 조건은 A와 B 각각 참/거짓, MC/DC는 A와 B가 각각 독립적으로 결과를 바꾸는 케이스까지 요구합니다. 항공(DO-178C)·차량 안전 인증이 MC/DC를 요구하는 이유까지 붙이면 서술형이 됩니다." },
  "se-160": {
    guide: {
      hook: "명세·구조에 얽매이지 않고 '경험·직관으로 탐험하듯' 결함을 찾는 테스트입니다.",
      scene: "미리 짠 스크립트 없이, 테스터가 시스템을 써 보며 '이상하다' 싶은 곳을 파고듭니다. 학습·설계·실행이 동시에 일어나 명세로 못 잡는 결함을 발견합니다. 휴리스틱 기반 접근입니다.",
      why: "'설계·실행 동시·휴리스틱 기반'과 세션·차터 관리(SBTM)가 출제 핵심입니다. 경험 기반 테스트의 대표입니다.",
      mechanism: "특징: 사전 상세 설계 없이 테스트 설계·실행·학습을 동시에(휴리스틱 기반). 구성(세차노요): 테스트 세션(시간 박스), 테스트 차터(탐색 목표·범위), 테스트 노트(발견 기록), 요약 보고. SBTM(세션 기반 테스트 관리 — 자유 탐색에 구조 부여). 장점: 명세 밖 결함·빠른 피드백·학습. 한계: 재현·측정·커버리지 추적 어려움. 스크립트 테스트를 보완. 경험 기반 테스트의 대표.",
      map: [
        { as: "설계·실행 동시", real: "탐험적 접근", note: "휴리스틱" },
        { as: "탐색 목표", real: "테스트 차터", note: "세차노요" },
        { as: "시간 박스", real: "테스트 세션", note: "SBTM" },
        { as: "명세 밖 결함", real: "장점", note: "" },
      ],
      usage: "보완적 결함 발견입니다. 시험은 설계·실행 동시, 세션·차터, 경험 기반입니다.",
      links: [
        { topic: "경험 기반 테스트", how: "탐색적 테스트가 대표 기법입니다." },
        { topic: "블랙박스 테스트", how: "스크립트 테스트를 보완합니다." },
      ],
      exam: "탐색적 테스트는 사전 스크립트 없이 설계·실행·학습을 동시에 하는 휴리스틱 기반 테스트로, 세션·차터·노트·요약으로 관리(SBTM)하며 명세 밖 결함을 찾는다.",
    }, image: "/concept/book/se-160.png", easy: "문서 없이 테스터의 경험과 직관으로 '탐험하듯' 결함을 찾는 테스트입니다. 다만 마구잡이가 아니라 규칙이 있습니다 [세차노요] — 세션(방해받지 않는 45분~수시간의 타임박스), 차터(이 세션의 목표를 한두 문장 비전으로, 1세션 1차터), 노트(발견한 아이디어·제안을 최소한으로 기록), 요약보고(Debrief — 팀과 공유). 보고 틀이 PROOF입니다: Past(뭘 했나)·Results(뭘 얻었나)·Outlook(뭐가 남았나)·Obstacles(뭐가 방해였나)·Feelings(감이 어떤가). 명세가 부실하고 시간이 없을 때 위력을 발휘합니다." },
  "exp-based-test": {
    guide: {
      hook: "테스터의 '경험·직관·지식'을 활용하는 비정형 테스트 기법입니다.",
      scene: "명세만으론 다 못 잡습니다. 경험 많은 테스터가 '여기가 자주 깨지더라'는 감으로 결함을 찾습니다. 명세·구조 기반을 보완하는 비체계적이지만 효과적인 접근입니다.",
      why: "기법(에러 추정·탐색적·체크리스트)과 명세/구조 기반과의 보완이 출제 포인트입니다.",
      mechanism: "기법: 에러 추정(Error Guessing — 과거 결함·경험으로 취약점 예측), 탐색적 테스트(설계·실행 동시, 학습하며 진행), 체크리스트 기반(경험 목록). 특징: 비정형·테스터 역량 의존·문서 적음·빠름. 장점: 명세·구조 기반이 놓친 결함 발견·시간 효율. 한계: 재현·측정 어려움·역량 편차. 명세 기반(블랙박스)·구조 기반(화이트박스)과 함께 3대 테스트 접근.",
      map: [
        { as: "과거 결함으로 예측", real: "에러 추정", note: "" },
        { as: "설계·실행 동시", real: "탐색적 테스트", note: "" },
        { as: "경험 목록", real: "체크리스트", note: "" },
        { as: "명세·구조 보완", real: "3대 접근", note: "" },
      ],
      usage: "보완적 결함 발견입니다. 시험은 에러 추정·탐색적, 명세/구조 기반과의 보완입니다.",
      links: [
        { topic: "탐색적 테스트", how: "경험 기반의 대표 기법입니다." },
        { topic: "블랙박스 테스트", how: "명세 기반과 보완합니다." },
      ],
      exam: "경험 기반 테스트는 테스터의 경험·직관을 활용하는 비정형 기법으로 에러 추정·탐색적 테스트·체크리스트가 있으며, 명세·구조 기반이 놓친 결함을 보완적으로 찾는다.",
    }, image: "/concept/book/exp-based-test.png", easy: "경험 기반 테스트는 유사 애플리케이션이나 기술에서의 경험·직관·테스터의 기술 능력으로부터 테스트 케이스를 추출하는 기법 묶음입니다 [경탐오체분]. 탐색적 테스팅은 테스트 차터(세션의 임무) + 타임박싱(시간 제약)으로 설계·수행·기록·학습을 동시에 하는 기법으로 명세가 거의 없고 시간이 부족할 때 쓰고, 오류추정(Ad-hoc)은 '여기가 잘 터지더라'는 직관으로 결함을 예측해 찌르는 기법으로 마지막 단계에 사용하며, 체크리스트는 과거 노하우를 목록화해 다음 테스팅에서 누락 없이 재활용하는 것, 분류트리까지 네 갈래입니다. 공식 기법(동등분할·경계값 같은 명세 기반)을 대체하는 게 아니라 '보완'한다는 위치, 그리고 탐색적 테스팅은 '실행' 집중·테스트케이스 기반 테스팅은 '설계' 집중이라는 비교가 시험 포인트입니다." },
  "risk-based-test": {
    guide: {
      hook: "'위험이 큰 부분에 테스트를 집중'하는 우선순위 기반 전략입니다.",
      scene: "완벽 테스팅은 불가능하니 한정된 자원을 잘 배분해야 합니다. 위험 기반 테스트는 '실패 확률×영향'이 큰 기능에 테스트를 집중해, 같은 노력으로 중요한 결함을 먼저 잡습니다.",
      why: "'위험(확률×영향) 기반 우선순위'와 완벽 테스팅 불가 원칙과의 연결이 출제 핵심입니다.",
      mechanism: "절차: 위험 식별(기능·품질 위험) → 위험 분석(발생 확률×영향 = 위험도) → 우선순위화 → 위험 높은 항목에 테스트 강도·범위 집중, 낮은 것은 간소화 → 모니터링. 근거: 완벽 테스팅 불가·결함 집중(파레토). 위험도에 따라 테스트 레벨·기법·커버리지 차등. 프로젝트 위험관리와 연계. 종료 조건(잔여 위험 수용)에도 활용. 자원 최적 배분.",
      map: [
        { as: "확률×영향 큰 곳", real: "위험도 산정", note: "" },
        { as: "중요한 데 집중", real: "우선순위 테스트", note: "" },
        { as: "낮은 건 간소화", real: "차등", note: "" },
        { as: "완벽 테스팅 불가 대응", real: "근거", note: "" },
      ],
      usage: "테스트 자원 배분입니다. 시험은 위험도 우선순위, 완벽 테스팅 불가와의 연결입니다.",
      links: [
        { topic: "테스트 원리", how: "완벽 테스팅 불가·결함 집중을 구현합니다." },
        { topic: "프로젝트 위험관리", how: "위험 분석 기법을 공유합니다." },
      ],
      exam: "위험 기반 테스트는 발생 확률×영향이 큰 기능에 테스트를 집중하는 우선순위 전략으로, 완벽 테스팅 불가·결함 집중 원칙에 근거해 한정 자원을 최적 배분한다.",
    }, image: "/concept/book/risk-based-test.png", easy: "테스트할 시간과 인력은 늘 모자라니, 위험이 큰 곳부터 집중하자는 전략입니다. 각 항목의 위험을 '장애 발생 가능성 × 영향'의 2축 매트릭스에 놓으면 네 구역이 나옵니다 — STA(가능성↑영향↑: 반드시 테스트), STTA(가능성↓영향↑), ITA(가능성↑영향↓), FTA(둘 다 낮음: 생략 가능). 순회 순서까지 나옵니다 — 사업적 리스크 중심이면 N자형(STA→STTA→ITA→FTA), 기술적 리스크 중심이면 S자형(STA→ITA→STTA→FTA). 절차는 위험 식별→분석→대응계획→테스트 계획→모니터링입니다." },
  "se-163": {
    guide: {
      hook: "테스트 결과가 '맞는지 판정하는 기준'이 테스트 오라클입니다.",
      scene: "테스트를 실행해도 '이 결과가 옳은지' 판단할 기준이 없으면 무의미합니다. 오라클은 기대 결과를 알려 주는 원천입니다 — 명세, 다른 구현, 과거 결과 등. AI처럼 정답이 모호하면 오라클 문제가 생깁니다.",
      why: "오라클 종류와 '오라클 문제'(정답 판정 어려움)가 출제 핵심입니다. AI 테스트·변성 테스트와 연결됩니다.",
      mechanism: "종류: 명세 기반 오라클(요구·명세로 기대값), 파생 오라클(문서·유사 시스템), 일관성 오라클(과거 결과·회귀), 통계적 오라클, 인간 오라클(전문가 판단). 오라클 문제(Oracle Problem): 기대 결과를 알기 어려운 경우(복잡 계산·AI·비결정적) — 해법: 변성 테스트(Metamorphic — 입출력 관계 검증), 백투백(다른 구현 비교), A/B. AI 시스템 테스트(ISO 29119-11)의 핵심 난제.",
      map: [
        { as: "기대 결과 원천", real: "테스트 오라클", note: "" },
        { as: "명세로 기대값", real: "명세 기반 오라클", note: "" },
        { as: "정답 판정 어려움", real: "오라클 문제", note: "AI·복잡" },
        { as: "입출력 관계 검증", real: "변성 테스트", note: "해법" },
      ],
      usage: "테스트 판정·AI 테스트입니다. 시험은 오라클 종류, 오라클 문제, 변성·백투백입니다.",
      links: [
        { topic: "ISO 29119-11", how: "AI 오라클 문제를 다룹니다." },
        { topic: "Back to Back 테스트", how: "다른 구현 비교로 오라클을 대체합니다." },
      ],
      exam: "테스트 오라클은 테스트 결과의 정오를 판정하는 기대값 원천으로, AI·복잡 계산처럼 기대값을 알기 어려운 오라클 문제는 변성 테스트·백투백으로 해결한다.",
    }, image: "/concept/book/se-163.png", easy: "테스트 결과가 '맞았는지 틀렸는지'를 판정해 주는 채점 기준입니다 [참샘휴일]. 참 오라클(모든 입력의 정답을 다 앎 — 이상적이나 비쌈), 샘플링(특정 입력 몇 개만 정답 보유 — sin 함수의 0°·90°·180°처럼), 휴리스틱(샘플은 정확히, 나머지는 추정으로 — 샘플링의 개선), 일관성 검사(이전 실행 결과와 같은지 비교 — 회귀 테스트·자동화 도구가 사용). 요즘 단골 연계 — AI 시스템은 확률적이고 재현이 안 돼 참 오라클이 불가능하므로, 백투백·A/B·변성(Metamorphic) 테스트 같은 대안을 씁니다." },
"memory-fragmentation": {
    image: "/concept/book/memory-fragmentation.webp", images: ["/concept/extra/internal-fragmentation.png", "/concept/extra/external-fragmentation.png"],
    guide: {
      hook: "빈 메모리는 있는데 못 쓰는 낭비 — CA 교재는 '예방 도구'까지 다룹니다.",
      scene: "주차장으로 보세요. 대형차 칸에 경차가 서면 칸 안에 틈이 남고(내부), 빈 칸이 띄엄띄엄이면 버스를 댈 수가 없습니다(외부). 관리인의 대응 — 붙어 있는 빈 칸 합치기(통합), 차들을 한쪽으로 몰아 큰 빈 공간 만들기(압축). 그리고 아예 처음부터 잘 배치하는 도구들이 있습니다.",
      why: "어제 OS 단편화와 겹치지만, CA 교재는 할당자 3종이 추가됩니다 — 크기별 전용 구역(메모리 풀), 2의 배수로 쪼개고 합치기(버디 시스템), 같은 크기 객체 전용 선반(슬랩 할당자). 이 셋의 한 줄 구분이 추가 출제 포인트입니다.",
      mechanism:
        "버디 시스템의 실제 동작: 요청을 2의 거듭제곱으로 올림해 큰 블록을 절반씩 쪼개 할당하고, 해제 때 옆의 '버디' 블록이 비어 있으면 재귀적으로 합칩니다 — 리눅스 페이지 할당자가 이것입니다. 슬랩은 자주 쓰는 같은 크기 객체를 미리 찍어 둔 선반에서 꺼내 쓰고 반납합니다 — 리눅스 커널 객체 할당자.",
      map: [
        { as: "칸 안에 남는 틈", real: "내부 단편화", note: "" },
        { as: "띄엄띄엄 빈 칸", real: "외부 단편화", note: "" },
        { as: "빈 칸 합치기 / 차 몰기", real: "통합(Coalescing) / 압축(Compaction)", note: "사후 해소" },
        { as: "크기별 전용 구역", real: "메모리 풀", note: "예방 도구 ①" },
        { as: "2의 거듭제곱 분할·합병", real: "버디 메모리 시스템", note: "예방 도구 ②" },
        { as: "같은 크기 객체 선반", real: "슬랩 할당자", note: "예방 도구 ③ — 커널 객체용" },
      ],
      usage:
        "리눅스에서 /proc/buddyinfo, slabtop 명령으로 실물을 직접 볼 수 있습니다. 시험은 내부/외부 구분 + 버디 시스템 분할 그림(예: 64KB 요청 시 트리가 어떻게 쪼개지나) 문제입니다.",
      links: [
        { topic: "단편화(Fragmentation)", how: "어제 배운 OS 편 — 개념의 기본형입니다." },
        { topic: "가상메모리 관리기법", how: "배치(First/Best/Worst Fit) 선택이 외부 단편화 양을 좌우합니다." },
      ],
      exam: "메모리 단편화는 내부·외부 단편화로 구분되며 통합·압축으로 해소하고, 메모리 풀·버디 시스템·슬랩 할당자로 예방한다.",
    },
  },
"ca-25": {
    image: "/concept/book/ca-25.webp",
    guide: {
      hook: "CPU 대신 데이터를 옮겨 주는 전담 이삿짐 기사입니다.",
      scene: "사장(CPU)이 서류 상자 1만 개를 직접 나르면 그동안 결재가 전부 멈춥니다. 그래서 기사(DMA 컨트롤러)에게 '여기서 저기로 이만큼'만 시켜 놓고 사장은 결재를 봅니다. 다 옮기면 기사가 벨을 울립니다(인터럽트). 문제는 복도(버스)가 하나 — 기사가 얼마나 차지할지 방식을 정해야 합니다.",
      why: "모드 4개의 한 줄 구분이 출제 포인트입니다. 그리고 기사가 창고(메모리)를 직접 고치므로, CPU 수첩(캐시)과 어긋나지 않게 Clean/Flush가 따라온다는 연결까지 잡으면 두 토픽이 묶입니다.",
      mechanism:
        "CPU가 DMA 컨트롤러 레지스터에 (출발지, 목적지, 크기, 모드)를 설정해 주면, 이후 전송은 DMA가 버스 주인이 되어 수행하고 CPU는 자기 일을 합니다. 끝나면 완료 인터럽트 — 그 사이 캐시와 메모리의 불일치는 Clean/Flush로 관리합니다.",
      map: [
        { as: "복도 통째로 독점", real: "Burst 모드", note: "블록 전송이 끝날 때까지" },
        { as: "사장 발걸음 틈틈이 한 번씩", real: "Cycle Stealing", note: "사이클을 훔쳐 워드 단위로" },
        { as: "요청 신호가 살아 있는 동안", real: "Demand Transfer", note: "" },
        { as: "사장이 복도를 안 쓸 때만", real: "Interleaved", note: "" },
        { as: "다 옮겼다는 벨", real: "완료 인터럽트", note: "CPU에 통지" },
      ],
      usage:
        "디스크·랜카드·GPU·사운드 등 모든 고속 입출력이 DMA입니다. '기가비트 네트워크를 CPU 복사로 처리하면 코어 하나가 잠식된다'가 필요성의 근거 서술로 좋습니다. 시험은 4개 모드 구분입니다.",
      links: [
        { topic: "인터럽트(Interrupt)", how: "완료 통지 수단입니다." },
        { topic: "캐시 플러시(Cache Flush)", how: "DMA 전후로 캐시를 정리해야 하는 이유입니다." },
      ],
      exam: "DMA는 CPU 개입 없이 메모리와 장치 간 데이터를 전송하는 방식으로 Burst·Cycle Stealing·Demand·Interleaved 모드가 있으며 완료를 인터럽트로 통지한다.",
    },
  },
"ca-47": {
    image: "/concept/book/ca-47.webp",
    guide: {
      hook: "보드 위 칩들끼리 대화하는 두 가지 사내 전화선 규격입니다.",
      scene: "I2C는 전화선 2가닥(시계 SCL, 데이터 SDA)에 여러 칩을 주렁주렁 매다는 방식 — 배선이 싸고 단순하지만, 한 번에 한 방향(반이중)이고 느립니다(표준 100kbps). SPI는 4가닥으로 1:1 직통 — 양방향 동시(전이중)에 빠르지만(수십 MHz), 칩마다 선택선(CS)을 따로 깔아야 해서 배선이 늘어납니다.",
      why: "표 비교 문제입니다 — 선 수(2 vs 4), 속도, 반이중/전이중, 버스형/1:1, 배선 비용. '싸고 느린 다인용 I2C, 비싸고 빠른 1:1 SPI' 한 줄이면 표가 복원됩니다.",
      mechanism:
        "I2C는 먼저 7비트 주소를 버스에 뿌려 대상을 지정하고 ACK를 받으며 진행하는 '주소 지정형'입니다. SPI는 CS 선을 물리적으로 내려 대상을 고르고, 클럭에 맞춰 MOSI/MISO 두 선으로 동시에 주고받습니다.",
      map: [
        { as: "2가닥에 여러 칩", real: "I2C — SCL(클럭)·SDA(데이터)", note: "멀티드롭 버스, 반이중, 100kbps급" },
        { as: "4가닥 1:1 직통", real: "SPI — CS·SCLK·MOSI·MISO", note: "전이중, 70MHz급" },
        { as: "칩마다 따로 필요한 선", real: "CS(Chip Select)", note: "슬레이브 수만큼 증가" },
      ],
      usage:
        "아두이노·라즈베리파이 핀맵에 SCL/SDA(I2C), MOSI/MISO(SPI)가 그대로 있습니다. 관례상 온도 센서·RTC는 I2C, 디스플레이·SD카드는 SPI입니다. 시험은 선 수·속도·전이중 여부 비교표입니다.",
      links: [
        { topic: "DMA(Direct Memory Access)", how: "칩에서 받은 데이터를 메모리로 나르는 다음 단계입니다." },
        { topic: "워치독 타이머(WDT)", how: "임베디드 보드에서 함께 등장하는 이웃입니다." },
      ],
      exam: "I2C는 SCL·SDA 2선 버스로 다수 장치를 연결하는 반이중 통신이고, SPI는 4선 기반 1:1 전이중 고속 통신으로 슬레이브마다 CS가 필요하다.",
    },
  },
"ca-135": {
    image: "/concept/book/ca-135.webp",
    guide: {
      hook: "서버 한 대가 죽어도 장사가 안 끊기게, 두 대 이상을 묶는 세 가지 방법입니다.",
      scene: "가게 운영으로 보면 — ① 대타 직원이 놀면서 대기(Hot Standby): 사고 나면 즉시 교대하지만 평소엔 인건비 낭비. ② 두 직원이 각자 다른 일을 하다, 한 명이 쓰러지면 남은 사람이 둘 다 떠맡기(Mutual Takeover): 안 놀지만 혼자 2인분을 감당할 체력이 필요. ③ 처음부터 같은 일을 나눠 하기(Concurrent Access): 하나가 빠져도 교대 자체가 필요 없음.",
      why: "서로 살아 있는지 확인하는 맥박 신호가 Heartbeat, 쓰러졌을 때 넘겨받는 동작이 Failover입니다. 세 구성의 장단점 표가 그대로 출제됩니다.",
      mechanism:
        "Heartbeat가 몇 초 간격으로 오가다 끊기면, Standby가 가상 IP(VIP)를 넘겨받아 서비스를 올립니다(Failover). 이때 '둘 다 자기가 Active라고 믿는' 스플릿 브레인이 최악의 사고라, 제3의 심판(쿼럼)이나 강제 차단(펜싱)을 둡니다 — 심화 서술 소재입니다.",
      map: [
        { as: "대타 대기", real: "Hot Standby", note: "단순 / 대기 서버 낭비" },
        { as: "서로 떠맡기", real: "Mutual Takeover", note: "자원 활용 / 2배 용량 필요" },
        { as: "다 같이 일하기", real: "Concurrent Access", note: "전부 Active, Failover 불필요" },
        { as: "맥박 확인 / 넘겨받기", real: "Heartbeat / Failover", note: "감시와 절체" },
      ],
      usage:
        "은행·통신사 이중화, DB Active-Standby 구성, L4 스위치 이중화가 실물입니다. 시험은 3구성(Hot Standby/Mutual Takeover/Concurrent Access) 비교표가 정석입니다.",
      links: [
        { topic: "결함허용 컴퓨터(FTS)", how: "'죽어도 계속'의 더 큰 그림입니다." },
        { topic: "RAID", how: "디스크 차원에서 같은 발상입니다." },
      ],
      exam: "HA는 Hot Standby·Mutual Takeover·Concurrent Access 구성으로 서비스 연속성을 보장하며, Heartbeat로 상태를 감시하고 장애 시 Failover한다.",
    },
  },
"ca-136": {
    image: "/concept/book/ca-136.webp",
    guide: {
      hook: "고장이 나도 완전히 멈추지 않게 만드는 설계 — 흐름은 감·진·통·복입니다.",
      scene: "비행기 설계를 떠올리세요. 엔진 하나가 꺼져도 날 수 있어야 합니다. 하드웨어는 — 같은 계산을 3곳에 시켜 다수결(TMR), 2개 돌려 비교(Duplication), 여분 부품 대기(Stand-by Sparing). 소프트웨어는 — 저장 지점으로 돌아가 다시 하기(체크포인트), 같은 기능의 다른 구현으로 갈아타기(Recovery Block), 독립 개발한 N개 버전을 비교하기(N-version).",
      why: "핵심 사상은 '전부 죽지 말고 성능을 낮춰서라도 버틴다'(Graceful Degradation)입니다. HW 기법과 SW 기법을 나눠 쓰라는 문제가 그대로 나옵니다.",
      mechanism:
        "TMR의 실제 동작: 같은 입력을 3계통에 넣고 보터(Voter)가 다수결로 출력 — 1개가 고장 나도 결과가 유지됩니다. Recovery Block은 '주 모듈 실행 → 검수 테스트 → 실패 시 체크포인트로 복원 후 대체 모듈 실행' 순서로 돕니다.",
      map: [
        { as: "감지→진단→통제→복구", real: "감진통복", note: "교재 두음 — 대응 절차" },
        { as: "3중 다수결 / 2중 비교 / 여분 대기", real: "TMR / Duplication / Stand-by Sparing", note: "HW 기법" },
        { as: "저장 지점 복귀 / 다른 구현 교체 / N개 비교", real: "Checkpoint / Recovery Block / N-version", note: "SW 기법" },
        { as: "성능 낮춰 버티기", real: "Graceful Degradation", note: "핵심 사상" },
      ],
      usage:
        "항공기 FBW(3중 비행 컴퓨터), 우주선, 원전 제어가 실제 사용처입니다. 시험은 HW 기법(TMR·이중화·예비)과 SW 기법(체크포인트·Recovery Block·N-version) 분류표입니다.",
      links: [
        { topic: "HA(High Availability)", how: "서버 묶음 차원의 생존 전략입니다." },
        { topic: "워치독 타이머(WDT)", how: "'감지' 단계의 도구 중 하나입니다." },
        { topic: "RAID", how: "저장장치의 결함허용입니다." },
      ],
      exam: "결함허용 컴퓨터는 감지·진단·통제·복구 절차로 부분 고장 시에도 서비스를 지속하며, HW(TMR·이중화·예비 부품)와 SW(체크포인트·Recovery Block·N-version programming) 기법을 사용한다.",
    },
  },
"os-81": {
    image: "/concept/book/os-81.webp",
    guide: {
      hook: "프로그램이 얼어붙으면 자동으로 재시작시키는 '데드맨 스위치'입니다.",
      scene: "기차 기관사는 일정 시간마다 페달을 밟아 '나 깨어 있음'을 알려야 합니다. 안 밟으면 기차가 스스로 멈춥니다. 임베디드 장비도 똑같습니다 — 프로그램이 주기적으로 타이머를 초기화(Kick)하고, 무한 루프에 빠져 Kick이 끊기면 타이머가 0이 되는 순간(Timeout) 워치독이 MCU를 강제 리셋합니다.",
      why: "사람이 지켜볼 수 없는 장비(자동차 ECU·통신 중계기·인공위성)의 최후 안전장치입니다. '정상이라면 계속 리셋되는 타이머'라는 역발상 — 신호가 없는 것 자체가 고장의 증거입니다.",
      mechanism:
        "하드웨어 카운터가 클럭마다 줄어들고 0이 되면 리셋 신호를 냅니다. 정상 코드는 메인 루프에서 주기적으로 카운터를 다시 채웁니다(Kick). 실무 함정 하나 — Kick을 인터럽트 핸들러에 넣으면 메인 루프가 죽어도 Kick이 계속되어 워치독이 무력화됩니다.",
      map: [
        { as: "페달 밟기", real: "Kick (타이머 초기화)", note: "정상 동작의 증명 — 애플리케이션 책임" },
        { as: "페달이 끊김", real: "Timeout (카운트 0 도달)", note: "고장으로 간주" },
        { as: "자동 정지·재시동", real: "MCU 리셋", note: "무인 복구" },
      ],
      usage:
        "자동차 ECU, 공유기(먹통이면 스스로 재부팅), 위성·드론이 실제 사용처입니다. 화성 패스파인더에서 우선순위 역전을 '발견해 준' 것도 워치독의 리셋이었습니다.",
      links: [
        { topic: "결함허용 컴퓨터(FTS)", how: "'감지' 단계의 도구로 편입됩니다." },
        { topic: "기한부(Deadline) 스케줄링", how: "실시간 장비라는 같은 무대에서 만납니다." },
      ],
      exam: "워치독 타이머는 주기적 Kick이 끊기면 타임아웃 시 시스템을 자동 리셋하는 무인 복구 장치로 임베디드·차량·통신 장비에 사용된다.",
    },
  },
"ca-140": {
    image: "/concept/book/ca-140.webp",
    guide: {
      hook: "디스크 여러 장을 묶어 '빠르게' 또는 '안 죽게' 만드는 조합 레시피입니다.",
      scene: "장부 쓰는 법으로 보세요 — 반씩 나눠 두 명이 동시에 쓰면 빠르지만 한 권만 잃어도 끝(RAID 0). 두 권에 똑같이 쓰면 안전하지만 종이가 2배(RAID 1). 세 권 이상에 나눠 쓰되 복구용 요약(패리티)을 섞어 두면, 한 권을 잃어도 나머지로 계산해 복원(RAID 5). 복사해 둔 쌍을 다시 나눠 쓰면 빠르고 안전(RAID 10).",
      why: "0/1/5/10의 최소 디스크 수·용량 효율·견디는 장애 수 표와, RAID 01 vs 10 비교(묶는 순서가 반대, 복구는 10이 유리)가 단골입니다.",
      mechanism:
        "RAID 5 쓰기는 '기존 데이터+기존 패리티 읽기 → XOR 재계산 → 둘 다 쓰기'라 쓰기 1번에 IO 4번(쓰기 페널티)이 듭니다. 디스크 교체 시엔 남은 디스크 전체를 XOR로 재구성(리빌드)하는데, 그동안 한 대가 더 죽으면 전멸 — 그래서 패리티 2개짜리 RAID 6이 나왔습니다.",
      map: [
        { as: "나눠 쓰기", real: "RAID 0 (스트라이핑)", note: "빠름 / 보호 없음" },
        { as: "똑같이 두 벌", real: "RAID 1 (미러링)", note: "안전 / 용량 절반" },
        { as: "복구 요약 분산", real: "RAID 5 (분산 패리티)", note: "최소 3장, 1장 장애 허용" },
        { as: "복사 후 나눠 쓰기", real: "RAID 10", note: "최소 4장, 빠르고 안전 / 01보다 복구 유리" },
      ],
      usage:
        "NAS(시놀로지), 서버 스토리지, CCTV 저장장치 설정 메뉴가 그대로 RAID 0/1/5/10입니다. 시험은 용량 계산(4TB×4장 RAID5 = 12TB)과 0/1/5/10 비교표, RAID 01 vs 10 복구 우위입니다.",
      links: [
        { topic: "이레이저 코딩(erasure coding)", how: "패리티 발상을 분산 스토리지로 확장한 것입니다." },
        { topic: "HA(High Availability)", how: "서버 차원의 같은 철학입니다." },
      ],
      exam: "RAID는 다수 디스크를 스트라이핑·미러링·패리티로 결합해 성능과 가용성을 확보하는 기술로, RAID 0·1·5·10이 대표적이며 RAID 10이 01보다 장애 복구에 유리하다.",
    },
  },
"erasure-coding": {
    image: "/concept/book/erasure-coding.webp",
    guide: {
      hook: "데이터를 조각+여분 조각으로 만들어 흩뿌려 두고, 일부를 잃어도 되살리는 기술입니다.",
      scene: "원본을 n조각으로 자르고, 수학적으로 만든 여분 조각 k개를 더해 총 n+k조각을 여러 창고(서버)에 나눠 보관합니다. 창고 몇 개가 불타도, 남은 것 중 아무 n조각만 모으면 원본이 복원됩니다.",
      why: "통째로 복사(미러링)하면 공간이 2배, 3배로 들지만 이 방식은 훨씬 적게 듭니다. 클라우드 스토리지가 복제 대신 쓰는 이유가 이 공간 효율입니다. 'RAID 패리티의 일반화판'으로 계보를 잡으면 한 번에 이해됩니다.",
      mechanism:
        "RS(10,4)라면 데이터 10조각으로 패리티 4조각을 계산해 14개 노드에 분산합니다 — 4개까지 잃어도 복원되고, 저장 오버헤드는 1.4배(3중 복제의 3배 대비 절반 이하)입니다. 복원은 남은 조각들을 모아 행렬 연산으로 되살립니다.",
      map: [
        { as: "원본 조각 + 여분 조각", real: "데이터 n + 패리티 k", note: "n+k를 분산 저장" },
        { as: "아무 n개로 복원", real: "소거 코드의 성질", note: "k개까지 손실 허용" },
        { as: "대표 수학", real: "Reed-Solomon Code", note: "Tahoe-LAFS, Weaver Code 등" },
      ],
      usage:
        "AWS S3, Azure, HDFS EC 모드, Ceph 등 대형 클라우드 스토리지의 표준입니다. 시험·답안 축은 '복제 대비 공간 효율 ↑, 대신 복원 시 연산·네트워크 비용 ↑' 비교입니다.",
      links: [
        { topic: "RAID", how: "한 서버 안 버전이 RAID, 서버들 사이 버전이 이레이저 코딩입니다." },
        { topic: "결함허용 컴퓨터(FTS)", how: "같은 목적의 저장 계층 기법입니다." },
      ],
      exam: "이레이저 코딩은 데이터를 n개 조각과 k개 패리티로 부호화해 분산 저장하고 임의 n개로 원본을 복원하는 기법으로, 미러링 대비 저장 공간 효율이 높다.",
    },
  },
"intelligent-semiconductor": {
    image: "/concept/book/intelligent-semiconductor.webp",
    guide: {
      hook: "저장하는 칩과 계산하는 칩을 한 몸으로 합쳐, 둘 사이의 병목을 없앤 반도체입니다.",
      scene: "주방(연산)과 창고(메모리)가 다른 건물이라, 재료 나르는 복도(버스)가 늘 막힙니다. 지능형 반도체는 창고 안에 주방을 차린 것 — 나를 필요가 없어집니다. 뇌의 뉴런·시냅스를 흉내 낸 뉴로모픽 칩, 컨트롤러를 품은 지능형 메모리(SSD/UFS), IoT 프로세서가 그 갈래입니다.",
      why: "폰 노이만 구조의 근본 병목(연산-저장 분리)을 구조 자체로 푸는 흐름입니다. AI 시대에 뜨는 이유 — 데이터 '이동'이 전력의 대부분을 먹기 때문 — 까지 붙이면 서술형 답이 됩니다.",
      mechanism:
        "PIM(Processing In Memory)의 실체는 메모리 뱅크 옆에 연산기를 붙여, 데이터를 CPU까지 꺼내오지 않고 그 자리에서 계산하는 것입니다. 뉴로모픽 칩은 클럭 동기 없이 스파이크(이벤트)가 있을 때만 동작해 전력이 극히 낮습니다.",
      map: [
        { as: "창고+주방 한 건물", real: "연산·저장·통신 융합", note: "메모리+시스템 반도체 결합" },
        { as: "뇌 흉내", real: "뉴로모픽 칩", note: "뉴런·시냅스 모사" },
        { as: "머리 달린 창고", real: "지능형 메모리", note: "SSD/UFS에 컨트롤러 융합" },
        { as: "통신·인지 갈래", real: "스마트 통신·인지제어 반도체", note: "5G/6G, 얼굴인식·음성비서" },
      ],
      usage:
        "삼성 HBM-PIM, SK하이닉스 PIM 발표가 실물 사례이고, AI 전력 문제·국가 반도체 전략과 묶이는 단골 논술 소재입니다. 답안 축은 '데이터 이동이 전력·시간의 대부분 → 이동 자체를 없앤다'입니다.",
      links: [
        { topic: "TPU(Tensor Processing Unit)", how: "'계산 전용 특화'라는 다른 갈래의 답입니다." },
        { topic: "기억장치 계층 구조(Memory Hierarchy)", how: "이 칩이 무너뜨리려는 벽이 그 계층 구조의 병목입니다." },
      ],
      exam: "지능형 반도체는 메모리·시스템 반도체를 융합해 연산·저장·통신을 단일 칩에서 처리하여 폰 노이만 병목을 해소하는 반도체로, 뉴로모픽 칩·지능형 메모리 등이 있다.",
    },
  },
"ca-22": {
    image: "/concept/book/ca-22.webp",
    guide: {
      hook: "구글이 딥러닝의 행렬 곱셈만을 위해 만든 전용 계산 공장입니다.",
      scene: "곱셈기 수만 개를 격자로 깔아 놓고, 데이터가 옆 칸으로 물결처럼 흘러가며 계산됩니다(시스톨릭 어레이). 한 번 들어온 숫자가 칸을 옮겨 다니며 재사용되므로, 창고(메모리)를 다시 다녀올 일이 확 줄고 — 그래서 전력 효율이 높습니다.",
      why: "GPU와의 비교가 출제 포인트입니다. GPU는 범용 병렬(게임도 과학계산도 다 됨), TPU는 딥러닝 전용 주문제작 칩(ASIC — 그 일만, 대신 더 싸고 효율적). 조연으로 HBM(대용량 고속 메모리 공급)과 ICI(TPU끼리 연결)가 나옵니다.",
      mechanism:
        "행렬곱에서 A의 행과 B의 열이 격자의 왼쪽·위에서 밀려 들어가고, 각 계산 셀(PE)이 곱하고 누적한 값을 옆 칸으로 넘깁니다. 가중치는 셀에 고정해 두고 데이터만 흘리는 방식이라 메모리 왕복이 확 줄어듭니다 — 이게 전력 효율의 비밀입니다.",
      map: [
        { as: "격자 곱셈 공장", real: "시스톨릭 어레이 (MXU)", note: "행렬 곱 전용 구조" },
        { as: "옆 칸으로 흘려보내기", real: "데이터 재사용", note: "메모리 접근 최소화 → 전력 효율" },
        { as: "대용량 재료 투입구", real: "HBM", note: "고대역폭 메모리" },
        { as: "공장끼리 연결", real: "ICI", note: "다수 TPU 연동" },
        { as: "주문 제작 칩", real: "ASIC", note: "범용 GPU와의 대비축" },
      ],
      usage:
        "구글 검색·번역·알파고가 TPU 위에서 돌았고, 지금의 LLM 학습 클러스터가 그 후예입니다. 시험은 GPU(범용 병렬) vs TPU(딥러닝 전용 ASIC) 비교표 + 시스톨릭 어레이 동작 서술입니다.",
      links: [
        { topic: "지능형 반도체", how: "메모리 벽을 푸는 큰 흐름 속의 한 갈래입니다." },
        { topic: "Pipeline(파이프라인)", how: "'흘려보내며 겹쳐 계산'이라는 같은 발상입니다." },
      ],
      exam: "TPU는 딥러닝 행렬 연산에 특화된 ASIC으로 시스톨릭 어레이(MXU) 구조로 메모리 접근을 최소화해 전력 효율이 높으며 HBM과 ICI를 활용한다.",
    },
  },
"ca-17": {
    image: "/concept/book/ca-17.webp",
    guide: {
      hook: "CPU는 '명령 한 줄 가져오기 → 실행하기'를 무한 반복하는 기계입니다.",
      scene: "요리사가 레시피를 처리하는 순서로 보세요. 다음 읽을 줄 번호를 확인하고(PC), 그 줄을 가져와(주소 창구 MAR → 메모리 → 데이터 창구 MBR) 손에 든 메모지(IR)에 옮깁니다. 줄 번호는 +1. 그다음 메모를 해석해 재료를 가져다 조리하고(ALU), 결과를 접시(AC)에 담습니다.",
      why: "레지스터 이름이 안 외워지는 건 역할 없이 글자만 외워서입니다. '다음 줄 번호(PC)·주소 창구(MAR)·데이터 창구(MBR)·지금 할 일(IR)·결과 접시(AC)' — 역할을 붙이면 인출→실행 사이클이 한 장면으로 이어집니다.",
      mechanism:
        "1GHz CPU는 이 사이클을 초당 수억 번 돕니다. 각 단계는 클럭에 맞춰 마이크로 연산으로 쪼개집니다 — T1: MAR←PC / T2: MBR←M[MAR], PC←PC+1 / T3: IR←MBR 식으로. 이 마이크로 연산 표를 채우는 문제가 출제 형태입니다.",
      map: [
        { as: "다음 읽을 줄 번호", real: "PC (Program Counter)", note: "인출 후 자동 +1" },
        { as: "주소를 내보내는 창구", real: "MAR", note: "Memory Address Register" },
        { as: "데이터가 들어오는 창구", real: "MBR(MDR)", note: "Memory Buffer Register" },
        { as: "지금 실행할 명령 메모", real: "IR", note: "Instruction Register" },
        { as: "계산기와 결과 접시", real: "ALU → AC(누산기)", note: "실행 사이클의 끝" },
      ],
      usage:
        "디버거의 '한 스텝 실행'이 이 사이클 단위이고, 인터럽트가 '명령어 사이클과 사이클 사이'에서 검사된다는 것도 여기서 나옵니다. 시험은 인출 사이클 마이크로 연산 순서 채우기입니다.",
      links: [
        { topic: "Pipeline(파이프라인)", how: "이 사이클을 여러 명령어에 겹쳐 돌리는 기술입니다." },
        { topic: "CISC vs RISC", how: "'명령 한 줄'을 어떻게 설계하느냐의 두 철학입니다." },
      ],
      exam: "CPU는 인출 사이클(PC→MAR→메모리→MBR→IR, PC 증가)과 실행 사이클(해독→피연산자 인출→ALU 연산→AC 저장)을 반복하여 명령어를 처리한다.",
    },
  },
"ca-120": {
    image: "/concept/book/ca-120.webp",
    guide: {
      hook: "명령어를 '만능 기계 몇 대'로 할까, '단순한 칼 여러 자루'로 할까의 두 철학입니다.",
      scene: "만능 주방기계(CISC)는 버튼 하나로 다지고 볶고 담기까지 하지만 내부가 복잡하고, 크기가 제각각이라 조립라인에 태우기 어렵습니다. 단순 칼 세트(RISC)는 하나로는 썰기만 되지만 크기가 똑같아(32비트 고정) 라인에 착착 태워집니다. 대신 요리사(컴파일러)가 조합을 잘 짜야 합니다.",
      why: "표 비교가 그대로 출제됩니다 — 명령어 수, 길이(가변/고정), 회로 복잡도, 파이프라인 적합성, 컴파일러 부담, 대표 진영(인텔/ARM). 그리고 RISC는 메모리 접근을 Load/Store 두 명령으로만 제한한다는 것까지.",
      mechanism:
        "반전이 하나 있습니다 — 현대 인텔 CPU는 겉으론 CISC 명령을 받지만 내부에서 마이크로옵으로 쪼개 사실상 RISC처럼 실행합니다. '겉은 CISC, 속은 RISC'가 실상입니다. RISC는 명령이 단순한 대신 같은 일에 명령 수가 늘어 코드가 커집니다.",
      map: [
        { as: "만능 기계", real: "CISC", note: "명령어 많음·가변 길이·회로 복잡·컴파일러 편함 (인텔 x86)" },
        { as: "단순 칼 세트", real: "RISC", note: "명령어 적음·32bit 고정·파이프라인 유리·컴파일러 부담 (ARM)" },
        { as: "재료 꺼내기/넣기는 전담 동작만", real: "Load/Store 구조", note: "RISC의 메모리 접근 제한" },
      ],
      usage:
        "인텔·AMD(x86) vs 애플 M시리즈·모든 스마트폰(ARM) 구도가 그대로 시사 사례입니다. 애플의 ARM 전환(전력 효율)이 서술 소재로 최고입니다. 시험은 비교표 + Load/Store 구조 언급입니다.",
      links: [
        { topic: "Pipeline(파이프라인)", how: "RISC가 유리한 결정적 이유입니다." },
        { topic: "CPU 처리과정", how: "그 '명령 한 줄'이 도는 사이클입니다." },
      ],
      exam: "CISC는 고기능·가변길이 명령어로 컴파일러 부담이 적으나 파이프라인에 불리하고, RISC는 단순·고정길이 명령어와 Load/Store 구조로 파이프라인 처리에 유리하다.",
    },
  },
"ca-102": {
    image: "/concept/book/ca-102.webp",
    guide: {
      hook: "명령어 처리를 단계로 쪼개, 세탁기·건조기처럼 겹쳐 돌리는 기술입니다.",
      scene: "빨래 세 통을 '세탁→건조→개기'로 처리할 때, 첫 통이 건조기로 넘어가는 순간 세탁기는 둘째 통을 받습니다. CPU도 인출→해독→실행→저장 단계를 겹쳐 돌립니다. 한 통에 걸리는 시간은 그대로지만, 시간당 처리량이 몇 배로 뜁니다.",
      why: "발전형 이름이 구조를 그대로 말해 줍니다 — 단계를 더 잘게 쪼개면 슈퍼파이프라인, 세탁기·건조기를 2대씩 두면 슈퍼스칼라, 둘 다 하면 슈퍼파이프라인드 슈퍼스칼라, 컴파일러가 미리 '같이 돌려도 되는 빨래'를 묶어 주면 VLIW입니다.",
      mechanism:
        "5단계 파이프라인이라면 명령 n개 처리 시간이 '비파이프라인 n×5사이클 → 파이프라인 5+(n-1)사이클'로 줄어듭니다. 이 성능 계산식이 그대로 문제로 나옵니다. 실제로는 해저드로 인한 멈춤(스톨) 때문에 이론치에 못 미칩니다.",
      map: [
        { as: "세탁→건조→개기", real: "인출→해독→실행→저장 단계", note: "명령어 사이클의 분할" },
        { as: "단계 더 쪼개기", real: "슈퍼파이프라인", note: "클럭을 더 잘게" },
        { as: "기계 2대씩", real: "슈퍼스칼라", note: "라인 자체를 복수로" },
        { as: "둘 다", real: "슈퍼파이프라인드 슈퍼스칼라", note: "" },
        { as: "미리 묶은 빨래 바구니", real: "VLIW", note: "컴파일러가 동시 실행 명령을 한 워드로" },
      ],
      usage:
        "모든 현대 CPU가 십수~수십 단계 파이프라인입니다. 인텔이 단계를 무리하게 늘리다(펜티엄4) 발열로 후퇴한 역사가 트레이드오프 사례로 쓸 만합니다. 시험은 속도 향상비 계산 + 발전형 4종 구분입니다.",
      links: [
        { topic: "Pipeline Hazard", how: "겹쳐 돌리기 때문에 생기는 사고 3종입니다." },
        { topic: "CISC vs RISC", how: "라인에 태우기 좋은 명령어의 조건이 RISC입니다." },
      ],
      exam: "파이프라인은 명령어 처리를 다단계로 분할해 중첩 실행함으로써 처리량을 높이는 기법으로, 슈퍼파이프라인·슈퍼스칼라·VLIW로 발전한다.",
    },
  },
"ca-106": {
    image: "/concept/book/ca-106.webp",
    guide: {
      hook: "겹쳐 돌리기 때문에 생기는 사고이고, 종류는 딱 셋입니다(구·데·제).",
      scene: "조립라인에서 나는 사고 세 가지 — ① 드라이버가 하나뿐인데 두 공정이 동시에 잡으려 함(구조적). ② 앞 공정이 부품을 아직 다 조이지도 않았는데 뒤 공정이 그걸 가져다 씀(데이터). ③ '검사 결과에 따라 A라인/B라인'인데, 결과가 나오기도 전에 B라인 부품을 미리 채워 놨다가 A로 판정 나면 전부 폐기(제어).",
      why: "사고마다 처방이 다르다는 게 시험 포인트입니다 — 도구를 늘리거나(구조적: 자원 추가·Harvard 구조), 결과를 앞당겨 건네주거나 잠깐 세우거나(데이터: Forwarding·Stall), 어느 라인일지 미리 찍기(제어: 분기 예측).",
      mechanism:
        "데이터 해저드의 실제 해결은 배선입니다 — ALU 출력을 다음 명령의 ALU 입력으로 직접 연결(포워딩)하고, 그래도 안 되는 경우(load 직후 사용)만 1사이클 멈춥니다. 제어 해저드는 분기 예측기가 과거 패턴으로 방향을 찍고, 틀리면 파이프라인을 통째로 비웁니다(플러시).",
      map: [
        { as: "도구 하나를 동시에", real: "구조적 해저드", note: "해결: 자원 이중화, Harvard 구조" },
        { as: "덜 조인 부품 사용", real: "데이터 해저드", note: "해결: Operand Forwarding, Stall" },
        { as: "판정 전에 미리 채움", real: "제어 해저드", note: "해결: 분기 예측, 지연 분기" },
      ],
      usage:
        "분기 예측을 악용한 보안 취약점이 스펙터/멜트다운(2018) — 최고의 시사 연결입니다. 시험은 3유형(구데제)별 원인·해결 짝짓기입니다.",
      links: [
        { topic: "Pipeline(파이프라인)", how: "이 사고의 무대입니다." },
        { topic: "CPU 처리과정", how: "겹쳐 도는 '단계'들의 정체입니다." },
      ],
      exam: "파이프라인 해저드는 구조적(자원 충돌)·데이터(명령어 의존성)·제어(분기) 세 유형이며, 각각 자원 이중화, 포워딩/스톨, 분기 예측으로 완화한다.",
    },
  },
"mmu": {
    image: "/concept/book/mmu.png",
    guide: {
      hook: "프로그램의 가짜 주소를 진짜 주소로 바꿔 주는 하드웨어 통역사입니다.",
      scene: "호텔 손님(CPU)이 '312호요'라고 말하면, 프런트 직원(MMU)이 장부(페이지 테이블)를 뒤져 '실제로는 5층 안쪽 방'으로 안내합니다. 장부의 첫 페이지 위치(TTB)만 알면 어떤 방이든 찾아 줍니다. 손님은 방이 실제 어디 있는지 몰라도 됩니다.",
      why: "어제 배운 '직접 사상·연관 사상'이 변환의 원리라면, MMU는 그 일을 실제로 수행하는 부품입니다. 원리(사상 기법)와 부품(MMU)을 짝지으면 두 토픽이 한 번에 정리됩니다.",
      mechanism:
        "MMU는 CPU 칩 안에 있고, 변환 실패(매핑 없음·권한 위반) 시 페이지 폴트 예외를 던져 OS에 넘깁니다. OS가 보기에 정상(스왑된 페이지)이면 채워 주고, 불법 접근이면 프로세스를 죽입니다 — 널 포인터 접근 시 뜨는 세그폴트(SIGSEGV)의 정체가 이것입니다.",
      map: [
        { as: "프런트 직원", real: "MMU (하드웨어)", note: "CPU 옆에 붙어 주소를 변환" },
        { as: "장부", real: "페이지 테이블", note: "메모리에 있음" },
        { as: "장부 첫 페이지 위치", real: "TTB (Translation Table Base)", note: "테이블의 시작 주소" },
        { as: "손님이 부르는 방 번호 / 실제 방", real: "가상 주소 / 물리 주소", note: "변환의 입력과 출력" },
      ],
      usage:
        "'널 포인터를 읽으면 왜 죽는가'(0번지에 매핑이 없어 MMU가 폴트를 올림)가 개발자용 실물 사례입니다. 시험은 MMU-TLB-페이지테이블 관계도와 변환 절차 서술입니다.",
      links: [
        { topic: "직접 사상과 연관 사상 페이징 기법", how: "이 직원이 쓰는 검색 방법(TLB 포함)입니다." },
        { topic: "가상메모리 관리기법", how: "이 통역이 애초에 필요한 이유입니다." },
      ],
      exam: "MMU는 CPU의 가상 주소를 페이지 테이블 참조로 물리 주소로 변환하는 하드웨어로, 프로그램이 물리 메모리 구조와 독립적으로 동작하게 한다.",
    },
  },
"ca-78": {
    image: "/concept/book/ca-78.webp",
    guide: {
      hook: "메모리 블록을 캐시의 어느 자리에 앉힐지 정하는 좌석 규칙 세 가지입니다.",
      scene: "극장 좌석으로 보세요 — ① 지정석(직접 사상): 회원번호 끝자리로 자리가 정해져 있어 확인은 한 곳만 하면 되지만, 끝자리가 같은 회원끼리 서로 밀어냅니다. ② 자유석(완전 연관): 아무 데나 앉아 적중률은 최고지만, 찾을 때 전 좌석을 뒤져야 합니다. ③ 구역 지정석(집합 연관): 구역까지만 정하고 구역 안은 자유 — 실제 CPU의 절충안입니다.",
      why: "'확인은 빠르게'와 '적중률은 높게'가 서로 당기는 관계라서, 세 방식은 그 사이 어디에 설지의 선택입니다. 주소가 태그·라인(세트)·단어로 쪼개지는 것도 좌석 규칙의 표현이라는 걸 알면 외울 게 줄어듭니다.",
      mechanism:
        "주소를 '태그|세트번호|오프셋'으로 자르고, 세트번호로 곧장 해당 세트에 가서 그 안의 태그 몇 개만 병렬 비교합니다. 4-way 집합 연관이면 비교기 4개 — 직접 사상(1개 비교)과 완전 연관(전부 비교)의 정확한 중간입니다.",
      map: [
        { as: "지정석", real: "직접 사상 (태그·라인·단어)", note: "빠름·단순 / 같은 라인끼리 충돌" },
        { as: "자유석", real: "완전 연관 사상 (태그·단어)", note: "적중률 최고 / 전체 병렬 검색 비용" },
        { as: "구역 지정석", real: "집합 연관 사상 (태그·세트·단어)", note: "실용 절충 — 실제 CPU 방식" },
      ],
      usage:
        "CPU 스펙의 '8-way set associative'가 이것입니다. 시험은 주소 비트 분할 계산이 단골 — 캐시 32KB·라인 64B·4-way를 주고 태그/인덱스/오프셋 비트 수를 구하게 합니다.",
      links: [
        { topic: "기억장치 계층 구조(Memory Hierarchy)", how: "좌석(캐시)이 왜 존재하는지의 큰 그림입니다." },
        { topic: "직접 사상과 연관 사상 페이징 기법", how: "같은 아이디어가 가상메모리 주소 변환에도 쓰입니다." },
        { topic: "캐시 일관성(Cache Coherence)", how: "극장(코어)이 여러 개가 되면 생기는 다음 문제입니다." },
      ],
      exam: "캐시 사상 방식은 직접 사상(고정 위치·충돌 많음), 완전 연관(임의 위치·검색 비용 큼), 집합 연관(세트 내 연관·실용 절충)으로 구분된다.",
    },
  },
"ca-77": {
    image: "/concept/book/ca-77.webp",
    guide: {
      hook: "코어마다 수첩(캐시)에 베껴 적다 보면, 서로 다른 값을 들고 있게 되는 문제입니다.",
      scene: "팀원 넷이 화이트보드(메모리)의 값을 각자 수첩에 베껴 놓고 일합니다. 한 명이 자기 수첩만 고치면 나머지 셋은 낡은 값으로 일하게 됩니다. 해결책은 둘 — '누가 어느 값을 베꼈는지' 명부를 두고 관리하거나(디렉토리), 모두가 서로의 말을 엿듣다가 누가 고치면 자기 수첩을 지우거나 갱신하거나(스누피).",
      why: "코어가 하나면 없던 문제가 멀티코어가 되는 순간 생깁니다. 그리고 이 문제가 생기는 근본 원인은 Write Back(수첩에만 적고 나중에 옮김) 정책 — 토픽들이 사슬로 이어집니다.",
      mechanism:
        "스누피는 모든 캐시가 공유 버스를 감시하다가 자기가 가진 주소의 쓰기가 보이면 자기 사본을 무효화하거나 갱신합니다. 코어가 수십 개로 늘면 버스가 병목이라, 주소별 소유자 명부를 두는 디렉토리 방식으로 갑니다 — '코어 적으면 스누피, 많으면 디렉토리'.",
      map: [
        { as: "명부 관리", real: "디렉토리 프로토콜 (HW)", note: "중앙에서 사본 위치 추적" },
        { as: "서로 엿듣기", real: "스누피 프로토콜 (HW)", note: "버스 감시, 갱신/무효화" },
        { as: "엿듣기의 대표 구현", real: "MESI", note: "다음 토픽" },
        { as: "아예 수첩 금지 구역", real: "SW 방식", note: "공유 캐시만 사용, 공유 변수 캐시 불가 처리" },
      ],
      usage:
        "멀티스레드 성능의 숨은 적 '거짓 공유(false sharing)' — 서로 다른 변수인데 같은 캐시 라인에 있어 서로 무효화를 핑퐁하는 현상 — 이 실무 연결점입니다. 시험은 디렉토리/스누피 비교와 MESI 연계입니다.",
      links: [
        { topic: "MESI", how: "수첩 페이지에 붙이는 상태 딱지 4종입니다." },
        { topic: "캐시메모리의 쓰기정책(Write Policy)", how: "Write Back이라 이 문제가 생깁니다." },
        { topic: "멀티 쓰레드(Multi-Thread)", how: "CMP(멀티코어)가 이 숙제를 만든 장본인입니다." },
      ],
      exam: "캐시 일관성은 멀티프로세서 환경에서 캐시 사본 간 값 불일치를 방지하는 기법으로, HW 방식인 디렉토리·스누피 프로토콜과 SW 방식(공유 캐시 등)이 있다.",
    },
  },
"ca-83": {
    image: "/concept/book/ca-83.webp",
    guide: {
      hook: "Clean은 '옮겨 적고 표시 지우기', Flush는 '그냥 찢어 버리기' — 반대 같은 이름의 한 쌍입니다.",
      scene: "수첩(캐시)에 고쳐 적은 내용이 있습니다. Clean: 화이트보드(메모리)에 옮겨 적고 '고침' 표시(더티 비트)를 지웁니다 — 수첩 내용은 남습니다. Flush: 수첩 페이지를 찢어 무효로 만듭니다 — 화이트보드에 옮기지 않습니다.",
      why: "출제 맥락은 DMA입니다. 택배기사(DMA)가 화이트보드를 직접 고치러 오기 전에는 내 수정본을 옮겨 둬야 하고(Clean), 다녀간 뒤에는 내 수첩이 낡았으니 찢어야(Flush) CPU가 옛날 값을 보지 않습니다.",
      mechanism:
        "임베디드 개발의 실제 순서가 이렇습니다 — DMA로 데이터를 '보내기 전'에는 내 캐시의 수정본을 메모리에 내리고(Clean), DMA가 '받아온 후'에는 내 캐시의 낡은 사본을 버립니다(Flush/Invalidate). 이 순서를 틀리면 '가끔만 깨지는 데이터'라는 최악의 버그가 납니다.",
      map: [
        { as: "옮겨 적고 표시 지움", real: "Cache Clean", note: "메모리 반영 + 더티 비트 0, 내용 유지" },
        { as: "페이지 찢기", real: "Cache Flush", note: "무효화, 메모리에 안 씀" },
        { as: "'고침' 표시", real: "더티 비트", note: "Write Back 때문에 존재" },
        { as: "'쓸 수 있는 페이지' 표시", real: "유효 비트", note: "라인 사용 가능 여부" },
      ],
      usage:
        "ARM 임베디드·디바이스 드라이버 개발의 고전 버그 시나리오입니다. 시험은 Clean(메모리 반영+더티 해제)과 Flush(무효화)의 방향 구분, DMA 전후 어느 쪽을 쓰는지 짝짓기입니다.",
      links: [
        { topic: "DMA(Direct Memory Access)", how: "Clean/Flush가 필요한 대표 상황입니다." },
        { topic: "캐시메모리의 쓰기정책(Write Policy)", how: "더티 비트가 생기는 이유(Write Back)입니다." },
        { topic: "MESI", how: "I(Invalid)로 만드는 것이 Flush에 해당합니다." },
      ],
      exam: "Cache Clean은 수정 데이터를 메모리에 반영하고 더티 비트를 해제하는 동작, Cache Flush는 캐시 내용을 무효화하는 동작으로 DMA 전후 데이터 일관성 확보에 사용된다.",
    },
  },
"ca-76": {
    image: "/concept/book/ca-76.png",
    guide: {
      hook: "캐시에 쓴 값을 메모리에 '언제' 반영할까 — 즉시냐, 몰아서냐입니다.",
      scene: "수첩에 적을 때마다 화이트보드에도 바로 옮겨 적으면(Write Through) 둘이 항상 같아 안심이지만, 매번 왔다 갔다 느립니다. 수첩에만 적고 '고침' 표시를 해 뒀다가 수첩이 꽉 차 페이지를 비울 때 몰아서 옮기면(Write Back) 빠르지만, 그 사이 화이트보드는 낡은 값입니다.",
      why: "Write Back의 '빠름'에는 대가가 붙습니다 — 더티 비트가 필요해지고, 캐시 일관성 문제가 생기고, DMA 전 Clean이 필요해집니다. 토픽 세 개가 이 선택 하나에서 파생된다는 걸 알면 사슬로 외워집니다.",
      mechanism:
        "Write Through에는 보통 쓰기 버퍼를 붙여 CPU가 메모리 쓰기를 안 기다리게 합니다. Write Back은 평소엔 캐시에만 쓰고 더티 비트를 켜 뒀다가, 그 라인이 교체될 때 먼저 메모리에 써 내리고 새 라인을 올립니다.",
      map: [
        { as: "적을 때마다 즉시", real: "Write Through", note: "일관성 좋음 / 버스 트래픽·속도 손해" },
        { as: "몰아서 나중에", real: "Write Back", note: "빠름 / 더티 비트와 일관성 관리 필요" },
        { as: "비우는 시점", real: "Swap Out 시 일괄 반영", note: "Write Back의 반영 타이밍" },
      ],
      usage:
        "CPU 캐시는 거의 다 Write Back이고, RAID 컨트롤러 설정 화면의 write-through/write-back(+배터리 백업) 선택이 실무 등장처입니다. 시험은 두 정책 비교표와 '더티 비트는 왜 필요한가'입니다.",
      links: [
        { topic: "캐시 플러시(Cache Flush)", how: "더티 데이터를 처리하는 동작 Clean/Flush입니다." },
        { topic: "캐시 일관성(Cache Coherence)", how: "Write Back의 대가로 생기는 문제입니다." },
        { topic: "MESI", how: "M 상태가 '아직 안 옮긴 수정본'입니다." },
      ],
      exam: "Write Through는 캐시와 메모리에 동시 기록하여 일관성이 높으나 느리고, Write Back은 교체 시점에 일괄 반영하여 빠르나 더티 비트와 일관성 관리가 필요하다.",
    },
  },
"ca-81": {
    image: "/concept/book/ca-81.webp",
    guide: {
      hook: "캐시 한 줄마다 붙이는 상태 딱지 4종 세트입니다.",
      scene: "수첩의 각 페이지에 딱지를 붙입니다 — M(나만 있고 내가 고침, 화이트보드와 다름), E(나만 있고 화이트보드와 같음), S(다른 팀원도 베껴 감), I(찢어진 페이지). 그리고 사건마다 딱지가 바뀝니다 — E 상태에서 내가 쓰면 M으로, 남이 그 주소를 읽으면 S로, 남이 쓰면 내 것은 I로.",
      why: "스누피 프로토콜이 '엿듣고 어떻게 반응할지'를 네 딱지로 규격화한 것이 MESI입니다. 상태 전이 한두 개를 콕 집어 묻는 문제가 나오니, '내가 쓰면 M, 남이 읽으면 S, 남이 쓰면 I' 세 문장을 잡으세요.",
      mechanism:
        "코어1이 E로 가진 라인을 코어2가 읽으면 스누핑으로 둘 다 S가 되고, 코어2가 쓰면 무효화 신호가 뿌려져 코어1은 I, 코어2는 M이 됩니다. 이 상태 전이도(누가 읽고 쓸 때 딱지가 어떻게 바뀌나)를 채우는 것이 출제 형태입니다.",
      map: [
        { as: "나만 + 고침", real: "Modified", note: "메모리와 다름, 언젠가 반영 필요" },
        { as: "나만 + 동일", real: "Exclusive", note: "메모리와 같음" },
        { as: "여럿이 공유", real: "Shared", note: "다른 캐시에도 사본 존재" },
        { as: "찢어진 페이지", real: "Invalid", note: "무효 — 다시 읽어야 함" },
        { as: "딱지를 바꾸는 신호", real: "버스 스누핑", note: "남의 읽기/쓰기를 엿들음" },
      ],
      usage:
        "인텔은 F를 더한 MESIF, AMD는 O를 더한 MOESI를 씁니다 — 'MESI가 기본형'이라는 위치만 잡으면 됩니다. 시험은 4상태 정의와 전이 시나리오 한두 개입니다.",
      links: [
        { topic: "캐시 일관성(Cache Coherence)", how: "MESI가 속한 큰 틀이 스누피 프로토콜입니다." },
        { topic: "캐시메모리의 쓰기정책(Write Policy)", how: "M 딱지가 존재하는 이유가 Write Back입니다." },
      ],
      exam: "MESI는 캐시 라인을 Modified·Exclusive·Shared·Invalid 4상태로 관리하는 스누피 기반 캐시 일관성 프로토콜이다.",
    },
  },
"ca-56": {
    image: "/concept/book/ca-56.webp",
    guide: {
      hook: "메모리를 여러 창구로 쪼개 번갈아 접근하게 해서, 줄 서는 시간을 없애는 기법입니다.",
      scene: "은행 창구가 하나면 손님이 줄을 섭니다. 창구를 4개로 늘리고 번호표 '끝자리'로 창구를 배정하면(하위 인터리빙) 1·2·3·4번 손님이 각각 다른 창구로 흩어져 동시에 처리됩니다. '앞자리'로 배정하면(상위) 연속 번호 손님이 같은 창구에 몰립니다.",
      why: "CPU는 연속 주소를 순서대로 읽는 일이 많습니다(공간적 지역성). 연속 주소가 서로 다른 모듈에 흩어져 있어야 동시에 읽을 수 있으므로, 순차 접근에는 하위 인터리빙이 유리하다 — 이 한 문장이 결론입니다.",
      mechanism:
        "주소의 하위 비트로 뱅크를 고르면 주소 0,1,2,3이 각각 뱅크 0,1,2,3으로 갑니다. 연속 읽기 때 뱅크들이 겹쳐 동작(파이프라인)해 대역폭이 뱅크 수만큼 늘어납니다. C-Access는 겹쳐 순차 접근, S-Access는 동시에 읽어 순차 전송입니다.",
      map: [
        { as: "창구", real: "메모리 모듈(뱅크)", note: "" },
        { as: "번호표 끝자리 배정", real: "하위 인터리빙", note: "연속 주소 분산 → 순차 접근 유리" },
        { as: "번호표 앞자리 배정", real: "상위 인터리빙", note: "모듈 안에 연속 주소 몰림" },
        { as: "섞기", real: "혼합 인터리빙", note: "뱅크로 묶어 절충" },
        { as: "겹쳐 읽기 / 한꺼번에 읽기", real: "C-Access / S-Access", note: "접근 방식 2종" },
      ],
      usage:
        "DDR 메모리의 뱅크 구조, 듀얼 채널 램 구성(2개 꽂으면 빨라지는 것), GPU 메모리의 고대역폭이 실물입니다. 시험은 상위/하위/혼합 비교와 '순차 접근엔 하위가 유리한 이유'입니다.",
      links: [
        { topic: "지역성(Locality)", how: "하위 인터리빙이 통하는 근거입니다." },
        { topic: "기억장치 계층 구조(Memory Hierarchy)", how: "메모리 병목을 푸는 또 하나의 축입니다." },
      ],
      exam: "메모리 인터리빙은 메모리를 다수 모듈로 분할해 병렬 접근하는 기법으로 상위·하위·혼합 방식이 있으며, 연속 주소 접근에는 하위 인터리빙이 유리하다.",
    },
  },
"os-53": {
    image: "/concept/book/os-53.webp",
    guide: {
      hook: "프로세스는 '가게 하나', 스레드는 '그 가게 안의 직원'입니다.",
      scene: "가게(프로세스)마다 주방·창고·금고(코드·데이터·힙)를 따로 갖고, 남의 가게 것은 못 씁니다. 한 가게 안의 직원들(스레드)은 주방과 창고를 같이 쓰고, 각자 자기 앞치마 주머니(스택)만 따로 챙깁니다.",
      why: "가게를 새로 차리는 것(프로세스 생성)은 비싸고, 직원을 뽑는 것(스레드 생성)은 쌉니다. 직원끼리는 창고를 같이 쓰니 소통이 빠르지만, 한 직원이 창고를 태우면 가게 전체가 망합니다 — 공유의 대가까지가 한 세트입니다.",
      mechanism:
        "fork()로 프로세스를 만들면 주소 공간을 통째로 준비해야 하지만, 스레드 생성은 스택만 새로 잡고 코드·데이터·힙은 그대로 공유합니다. 그래서 생성·전환이 수십 배 싸고, 대신 한 스레드의 메모리 오류가 프로세스 전체를 죽입니다.",
      map: [
        { as: "가게", real: "프로세스 — 자원 할당의 단위", note: "독립된 주소 공간, 서로 침범 불가" },
        { as: "직원", real: "스레드 — 실행(CPU 사용)의 단위", note: "같은 가게 직원끼리는 협업이 빠름" },
        { as: "같이 쓰는 주방·창고", real: "코드·데이터·힙 공유", note: "스택만 개별" },
        { as: "관리 카드 두께", real: "PCB(약 106개 필드) vs TCB(약 24개)", note: "그래서 스레드 전환이 가벼움" },
      ],
      usage:
        "크롬은 탭마다 프로세스(하나 죽어도 브라우저 생존 — 안정성 선택), 웹서버·게임엔진은 스레드 풀(속도 선택)입니다. 시험은 비교표 + '크롬은 왜 멀티프로세스인가' 같은 응용 서술입니다.",
      links: [
        { topic: "멀티 쓰레드(Multi-Thread)", how: "직원을 여럿 굴리는 네 가지 방식이 다음 토픽입니다." },
        { topic: "문맥교환(Context Switching)", how: "직원 교대가 가게 교대보다 빠른 이유가 카드 두께입니다." },
        { topic: "경쟁조건(Race Condition) 해결 방안", how: "창고를 같이 쓰다 나는 사고 — 스레드일수록 위험합니다." },
      ],
      exam: "프로세스는 자원 할당의 단위, 스레드는 CPU 실행의 단위로, 스레드는 코드·데이터·힙을 공유하고 스택만 개별로 가지며 TCB가 가벼워 문맥교환 비용이 작다.",
    },
  },
"os-54": {
    image: "/concept/book/os-54.webp",
    guide: {
      hook: "직원(스레드) 여럿을 어떻게 굴릴지의 네 가지 방식이고, 뒤로 갈수록 CPU가 덜 놉니다.",
      scene: "직원이 하나면 재료 배달을 기다리는 동안 주방이 놉니다. 그래서 — 매 순간 번갈아 일 시키고(IMT), 막힌 직원이 생기면 그때만 교대시키고(BMT), 아예 한 화구에서 두 직원이 동시에 일하게 하고(SMT), 화구 자체를 늘립니다(CMP).",
      why: "CPU가 메모리를 기다리는 시간은 생각보다 깁니다. 그 틈을 다른 스레드로 메우는 것이 멀티스레딩이고, IMT→BMT→SMT→CMP 순서로 활용률이 올라갑니다. 'SMT=인텔 하이퍼스레딩'은 반드시 나옵니다.",
      mechanism:
        "SMT의 실체는 한 코어 안에 레지스터 세트를 2벌 두는 것입니다. 한 스레드가 메모리를 기다리는 동안 놀고 있는 실행 유닛에 다른 스레드의 명령을 채워 넣고, OS에는 논리 코어 2개로 보입니다. CMP는 물리 코어 자체를 여러 개 — 요즘 CPU는 CMP+SMT 조합입니다.",
      map: [
        { as: "매 사이클 교대", real: "IMT (Interleaved)", note: "클럭마다 다른 스레드" },
        { as: "막히면 교대", real: "BMT (Blocked)", note: "메모리 대기 등으로 멈출 때 전환" },
        { as: "같은 사이클에 동시에", real: "SMT (Simultaneous)", note: "인텔 하이퍼스레딩" },
        { as: "화구를 늘림", real: "CMP (멀티코어)", note: "물리 코어 자체가 여러 개" },
      ],
      usage:
        "'8코어 16스레드'가 정확히 CMP 8 × SMT 2입니다. 시험은 IMT/BMT/SMT/CMP 4방식 구분과 '하이퍼스레딩=SMT' 연결 문제입니다.",
      links: [
        { topic: "프로세스(Process)와 스레드(Thread) 비교", how: "'직원' 개념의 출발점입니다." },
        { topic: "Pipeline(파이프라인)", how: "CPU 안의 노는 틈을 줄이는 또 다른 축입니다." },
        { topic: "캐시 일관성(Cache Coherence)", how: "코어가 여럿(CMP)이 되는 순간 생기는 숙제입니다." },
      ],
      exam: "멀티스레딩은 하나의 프로세서에서 다수 스레드를 실행해 CPU 활용률을 높이는 기법으로 IMT·BMT·SMT(하이퍼스레딩)·CMP(멀티코어)로 발전한다.",
    },
  },
"os-45": {
    image: "/concept/book/os-45.webp",
    guide: {
      hook: "둘이 같은 장부에 동시에 쓰면, 실행 순서에 따라 결과가 달라지는 사고입니다.",
      scene: "잔고 1,000원인 통장에 두 명이 동시에 500원씩 입금합니다. 둘 다 '1,000원'을 먼저 읽고 각자 1,500원이라고 적으면 — 최종 잔고는 2,000원이 아니라 1,500원이 됩니다. 500원이 증발했는데, 누가 먼저 적었느냐에 따라 결과가 달라집니다.",
      why: "공유 자원 + 동시 접근 + 보호 없음, 셋이 겹치면 반드시 터집니다. 해결의 뼈대는 하나 — '장부를 만지는 구간(임계 영역)엔 한 번에 한 명만'(상호배제). 그걸 SW로, HW로, 도구로 구현한 목록이 이 토픽입니다.",
      mechanism:
        "본질은 'balance += 500'이 읽기→더하기→쓰기 3단계라 중간에 끼어들 수 있다는 것입니다. Test&Set 같은 원자 명령은 이 3단계를 하드웨어가 쪼개지지 않게 한 번에 처리해 잠금을 만들고, 그 위에 뮤텍스·세마포어가 지어집니다.",
      map: [
        { as: "장부 만지는 구간", real: "임계 영역(Critical Section)", note: "해결 조건: 상호배제·진행·한계대기" },
        { as: "한 번에 한 명만", real: "상호배제(Mutual Exclusion)", note: "모든 해법의 목표" },
        { as: "약속으로 해결", real: "SW — 데커·피터슨·램포트 베이커리(bakery)", note: "빵집 번호표처럼 낮은 번호부터 진입 — 정식 명칭은 베이커리 알고리즘" },
        { as: "기계 명령으로 해결", real: "HW — Test&Set·Compare&Swap", note: "읽고-쓰기를 원자적으로" },
        { as: "만들어진 도구", real: "세마포어·뮤텍스·모니터·스핀락", note: "실무에서 쓰는 것들" },
      ],
      usage:
        "은행 이체 유실, 티켓 중복 예매, 좋아요 수 증발 — 동시성 버그 대부분이 이것이고, DB의 트랜잭션 격리·락도 같은 문제의 DB 버전입니다. 시험은 임계영역 3조건(상호배제·진행·한계대기)과 해결기법 SW/HW/도구 분류입니다.",
      links: [
        { topic: "세마포어(Semaphore)", how: "상호배제의 대표 도구 — 바로 다음 토픽입니다." },
        { topic: "우선순위 역전(Priority Inversion) 현상", how: "임계 영역 때문에 생기는 2차 사고입니다." },
        { topic: "프로세스(Process)와 스레드(Thread) 비교", how: "공유가 많은 스레드일수록 이 사고에 취약합니다." },
      ],
      exam: "경쟁조건은 공유 자원 접근 순서에 따라 결과가 달라지는 현상으로, 임계영역에 대한 상호배제를 SW 알고리즘(데커·피터슨·램포트 베이커리), HW 원자연산(Test&Set·CAS), 동기화 도구(세마포어·모니터)로 보장하여 해결한다.",
    },
  },
"os-32": {
    image: "/concept/book/os-32.webp",
    guide: {
      hook: "공용 자원의 '열쇠 개수'를 숫자 하나로 관리하는 장치입니다.",
      scene: "공용 화장실 앞에 열쇠 3개가 걸려 있습니다. 들어갈 때 하나 가져가고(P연산, 숫자 −1), 나올 때 다시 겁니다(V연산, +1). 열쇠가 0개면 문 앞에서 줄을 섭니다(대기 큐). 열쇠가 1개뿐이면 '한 명씩만' — 이게 이진 세마포어(상호배제)이고, 여러 개면 계수형입니다.",
      why: "'동시에 몇 명까지'를 강제할 방법이 필요해서입니다. 약점도 시험 포인트 — P와 V를 개발자가 직접 짝 맞춰 걸어야 해서 하나만 빼먹어도 사고가 납니다. 그래서 언어가 알아서 잠가 주는 모니터(자바 synchronized)와의 비교가 단골입니다.",
      mechanism:
        "P연산의 실체는 'S를 1 줄이고, 음수면 자신을 대기 큐에 넣고 잠들기', V연산은 'S를 1 늘리고 대기자를 하나 깨우기'이며 이 연산 자체가 원자적입니다. 스핀락과 달리 기다리는 동안 CPU를 태우지 않고 잠드는 것이 특징입니다.",
      map: [
        { as: "걸려 있는 열쇠 개수", real: "세마포어 변수 S", note: "정수 하나" },
        { as: "열쇠 가져가기", real: "P 연산", note: "S−1, 음수면 대기 큐로" },
        { as: "열쇠 반납", real: "V 연산", note: "S+1, 기다리던 사람을 깨움" },
        { as: "열쇠 1개 / m개", real: "이진 세마포어 / 계수형 세마포어", note: "상호배제 / m명 동시 허용" },
        { as: "알아서 잠기는 방", real: "모니터", note: "언어 차원 제공 — 실수 여지가 적어 안전" },
        { as: "빌린 사람만 반납할 수 있는 열쇠", real: "뮤텍스(Mutex)", note: "자원 1개·'소유' 개념 — 해제는 잠근 스레드만 가능. V를 남이 해도 되는 세마포어와의 차이" },
        { as: "잠들지 않고 문 앞을 빙빙 돌며 기다리기", real: "스핀락(Spin Lock)", note: "바쁜 대기(busy-wait) — 문맥교환 비용보다 대기가 짧을 때(멀티코어·짧은 임계구역)만 유리" },
      ],
      usage:
        "DB 커넥션 풀(최대 20개 = 계수형 세마포어 S=20), 티켓팅 서버의 동시 접속 제한, 자바의 Semaphore 클래스가 실물입니다. 시험은 P/V 의사코드와 생산자-소비자 문제 적용입니다.",
      links: [
        { topic: "경쟁조건(Race Condition) 해결 방안", how: "세마포어가 풀려는 문제가 그것입니다." },
        { topic: "우선순위 역전(Priority Inversion) 현상", how: "세마포어를 쥔 채 밀리면 생기는 문제입니다." },
        { topic: "교착상태(Deadlock)", how: "열쇠 두 개를 서로 하나씩 쥐고 기다리면 교착입니다." },
      ],
      exam: "세마포어는 정수 S와 원자적 P·V 연산으로 공유 자원 접근을 제어하는 동기화 기법으로 이진/계수형으로 구분되며, 모니터는 동일 기능을 언어 차원에서 안전하게 제공한다.",
    },
  },
"os-34": {
    image: "/concept/book/os-34.webp",
    guide: {
      hook: "급한 작업이, 한가한 작업 때문에 밀리는 역전 사고입니다.",
      scene: "인턴(낮음)이 회의실 열쇠를 쥔 채 일하고 있는데, 사장(높음)이 그 회의실이 필요해 기다립니다. 그 사이 대리(중간)가 '나는 회의실 필요 없는데?' 하며 인턴을 밀어내고 자기 일을 합니다. 결과 — 제일 급한 사장이 제일 늦게 일을 시작합니다.",
      why: "1997년 화성 탐사선 패스파인더가 실제로 이 문제로 계속 리셋됐습니다. 해결은 상식적입니다 — 열쇠를 쥔 동안만 인턴에게 사장 직급을 빌려주면(상속), 대리가 못 끼어듭니다.",
      mechanism:
        "실화가 있습니다 — 1997년 화성 탐사선 패스파인더에서 낮은 우선순위의 기상 스레드가 버스 뮤텍스를 쥔 채 중간 우선순위 통신 작업에 밀렸고, 높은 우선순위 관리 작업이 계속 타임아웃되어 워치독이 시스템을 리셋하기를 반복했습니다. 지구에서 뮤텍스에 '우선순위 상속' 옵션을 켜 보내 해결했습니다.",
      map: [
        { as: "인턴에게 사장 직급 임시 부여", real: "우선순위 상속(Inheritance)", note: "기다리는 최고 우선순위만큼 올려 줌" },
        { as: "회의실 자체에 직급표 부착", real: "우선순위 올림·천장(Ceiling)", note: "그 자원에 들어가면 무조건 그 직급" },
        { as: "사장이 기다리는 상태", real: "블로킹", note: "임계영역(세마포어) 때문에 발생" },
      ],
      usage:
        "RTOS 뮤텍스 설정(FreeRTOS의 priority inheritance), 리눅스 RT뮤텍스가 실물입니다. 시험은 T1/T2/T3 타임라인 그림과 상속 vs 천장 두 해법 비교 — 패스파인더 사례를 쓰면 서론이 살아납니다.",
      links: [
        { topic: "세마포어(Semaphore)", how: "그 '열쇠'의 정체입니다." },
        { topic: "경쟁조건(Race Condition) 해결 방안", how: "애초에 열쇠가 필요한 이유입니다." },
        { topic: "기한부(Deadline) 스케줄링", how: "실시간 시스템에서 이 사고가 치명적인 이유입니다." },
      ],
      exam: "우선순위 역전은 낮은 우선순위 태스크가 공유 자원을 점유하여 높은 우선순위 태스크가 중간 우선순위보다 늦어지는 현상으로, 우선순위 상속과 우선순위 올림(천장)으로 해결한다.",
    },
  },
"os-59": {
    image: "/concept/book/os-59.webp",
    guide: {
      hook: "떨어져 있는 프로세스끼리 데이터를 주고받는 길은 딱 두 갈래입니다.",
      scene: "옆 가게와 재료를 주고받는 방법 — 하나는 창고를 같이 쓰는 것(공유 메모리). 제일 빠르지만 동시에 꺼내다 부딪히니 규칙(동기화)이 꼭 필요합니다. 다른 하나는 배달(메시지 전달). 파이프·우편함·전화처럼 중간(커널)을 거치면 순서는 지켜 주지만 배달비(복사 비용)가 듭니다.",
      why: "프로세스는 서로의 메모리를 못 보게 되어 있습니다(보호). 그래서 협업하려면 공식 통로가 필요합니다. '속도가 필요하면 공유 메모리 + 동기화, 안전·원격이면 메시지 전달(소켓)' — 이 한 줄이 결론입니다.",
      mechanism:
        "공유 메모리의 실체는 같은 물리 페이지를 두 프로세스의 페이지 테이블에 매핑하는 것 — 그래서 이후엔 커널 개입이 없어 빠릅니다. 메시지 전달은 보낼 때마다 사용자→커널→사용자 복사가 두 번 일어나는 대신, 커널이 줄 세우기와 안전을 보장합니다.",
      map: [
        { as: "창고 같이 쓰기", real: "공유 메모리 · mmap", note: "커널 안 거침, 최고 속도, 동기화 필수" },
        { as: "직통 배달관", real: "파이프 / 네임드 파이프", note: "혈연 관계만 / 남남도 가능(FIFO)" },
        { as: "우편함", real: "메시지 큐", note: "비동기, 메시지 단위" },
        { as: "전화", real: "소켓", note: "원격 호스트와도 통신" },
        { as: "초인종만 누르기", real: "시그널", note: "데이터가 아니라 이벤트 알림" },
      ],
      usage:
        "터미널의 파이프(ls | grep), 크롬 탭-GPU 프로세스 간 공유 메모리, DB 접속(소켓), kill 명령(시그널)이 전부 IPC입니다. 시험은 공유 메모리 vs 메시지 전달 비교표(속도/충돌/크기)입니다.",
      links: [
        { topic: "세마포어(Semaphore)", how: "창고를 같이 쓸 때 반드시 따라오는 규칙입니다." },
        { topic: "프로세스(Process)와 스레드(Thread) 비교", how: "스레드는 애초에 창고를 같이 써서 IPC가 필요 없습니다." },
        { topic: "MSA (Micro Service Architecture)", how: "2주차 — 같은 고민이 '서비스 간 통신'으로 확장됩니다." },
      ],
      exam: "IPC는 프로세스 간 데이터 교환 메커니즘으로, 고속의 공유 메모리 방식(공유 메모리·mmap, 동기화 필요)과 커널이 순서를 보장하는 메시지 전달 방식(파이프·네임드 파이프·메시지 큐·소켓·시그널)으로 구분된다.",
    },
  },
"os-36": {
    image: "/concept/book/os-36.webp",
    guide: {
      hook: "서로 상대가 쥔 것을 기다리며 전원이 영원히 멈춘 상태입니다.",
      scene: "요리사 A는 칼을 쥔 채 도마를 기다리고, B는 도마를 쥔 채 칼을 기다립니다. 아무도 먼저 놓지 않으니 둘 다 영원히 멈춥니다. 이 사고는 네 조건이 '동시에' 성립해야만 일어납니다 — 그래서 하나만 깨도 예방이 됩니다.",
      why: "시험은 두 세트가 전부입니다. 발생 조건 4가지(상점비환)와 대응 전략 4가지(예피발복). 특히 '조건 중 하나만 제거해도 예방된다'는 논리와, 회피=은행가·발견=그래프 연결이 반복 출제됩니다.",
      mechanism:
        "실무 원인의 대부분은 '락 두 개를 서로 반대 순서로 잡는 코드'입니다. 스레드1이 lock(A)→lock(B), 스레드2가 lock(B)→lock(A)를 동시에 절반씩 진행하면 끝. 그래서 실무 예방 1순위는 '락 획득 순서 통일'(환형대기 조건 제거)입니다.",
      map: [
        { as: "도구는 혼자만 씀", real: "상호배제", note: "발생 조건 ①" },
        { as: "쥔 채로 또 기다림", real: "점유대기", note: "②" },
        { as: "뺏을 수 없음", real: "비선점", note: "③" },
        { as: "기다림이 원을 이룸", real: "환형대기", note: "④ — 넷 다 성립해야 발생" },
        { as: "대응 4단계", real: "예방·회피·발견·복구", note: "예: 조건 차단 / 피: 은행가 / 발: 그래프 / 복: 프로세스 종료" },
      ],
      usage:
        "DB 데드락(두 트랜잭션이 행을 교차 잠금 → DBMS가 탐지해 한쪽을 롤백시키는 메시지)이 가장 흔한 실물입니다. 시험은 4조건(상점비환)·대응(예피발복)이 뼈대이고, 사례 서술에 락 순서 통일을 쓰면 좋습니다.",
      links: [
        { topic: "자원할당 그래프(Resource Allocation Graph)", how: "'발견' 단계의 도구입니다." },
        { topic: "Banker's 알고리즘(은행가 알고리즘)", how: "'회피' 단계의 도구입니다." },
        { topic: "기아(Starvation)", how: "'모두 멈춤(교착)'과 '나만 밀림(기아)'의 구분이 단골 문제입니다." },
      ],
      exam: "교착상태는 상호배제·점유대기·비선점·환형대기 4조건이 동시에 성립할 때 발생하며, 예방(조건 제거)·회피(은행가)·발견(자원할당 그래프)·복구(프로세스 종료)로 대응한다.",
    },
  },
"os-39": {
    image: "/concept/book/os-39.webp",
    guide: {
      hook: "교착이 났는지 그림 한 장으로 판별하는 도구입니다.",
      scene: "동그라미(프로세스)와 네모(자원, 안의 점이 개수)를 화살표로 잇습니다. 프로세스→자원 화살표는 '주세요', 자원→프로세스는 '이미 줬음'. 다 그린 뒤 화살표를 따라가 봤을 때 원(사이클)이 생기면 의심 상황입니다.",
      why: "판정 규칙 세 줄이 시험의 전부입니다 — ① 사이클이 없으면 교착 없음(확실). ② 사이클 있음 + 자원이 각 1개뿐 = 교착 확정(필요충분). ③ 사이클 있음 + 자원 여러 개 = 있을 수도, 없을 수도.",
      mechanism:
        "OS/DBMS는 요청·할당 관계를 그래프 자료구조로 유지하고, 주기적으로 사이클 탐지를 돌립니다. 교착을 발견하면 희생자를 골라 강제 종료하고 자원을 회수합니다(복구). 자원이 여러 개짜리면 사이클만으로 확정이 아니라 그래프 축소 검사까지 합니다.",
      map: [
        { as: "동그라미 / 네모와 점", real: "프로세스 / 자원과 인스턴스 수", note: "표기법" },
        { as: "P→R 화살표", real: "요청 간선", note: "기다리는 중" },
        { as: "R→P 화살표", real: "할당 간선", note: "이미 배정됨" },
        { as: "화살표가 만든 원", real: "사이클 = 환형대기의 시각화", note: "판정 규칙 3줄이 핵심" },
      ],
      usage:
        "DBMS의 대기 그래프(wait-for graph) 기반 데드락 탐지가 실제 구현입니다. 시험은 그래프 그림을 주고 교착 여부를 판정하게 한 뒤 판정 규칙 3줄을 서술시키는 형태입니다.",
      links: [
        { topic: "교착상태(Deadlock)", how: "이 그래프는 대응 4단계 중 '발견'에 해당합니다." },
        { topic: "Banker's 알고리즘(은행가 알고리즘)", how: "그리기 전에 아예 위험한 할당을 안 하는 쪽이 '회피'입니다." },
      ],
      exam: "자원할당 그래프는 프로세스·자원 노드와 요청·할당 간선으로 교착을 탐지하며, 사이클이 없으면 교착이 없고 단일 인스턴스 자원에서 사이클은 교착의 필요충분조건이다.",
    },
  },
"os-41": {
    image: "/concept/book/os-41.webp",
    guide: {
      hook: "'빌려줘도 모두가 끝까지 갚을 수 있나'를 먼저 계산해 보고 빌려주는 은행원의 규칙입니다.",
      scene: "은행원의 장부는 네 칸입니다 — 금고에 남은 돈(Available), 고객별 대출 한도(Max), 이미 빌려간 돈(Allocation), 앞으로 더 필요한 돈(Need = Max − Allocation). 대출 요청이 오면 '준 셈 치고' 시뮬레이션해서, 모든 고객을 어떤 순서로든 완제시킬 수 있으면(안전 상태) 실제로 빌려주고, 아니면 기다리게 합니다.",
      why: "교착을 사후에 발견해 프로세스를 죽이는 것보다, 위험한 할당 자체를 거절하는 게 '회피'의 발상입니다. 한계도 같이 나옵니다 — 최대 요구량(Max)을 미리 알아야 해서 현실 적용이 어렵습니다.",
      mechanism:
        "요청이 오면 ① 요청 ≤ Need 확인 ② 요청 ≤ Available 확인 ③ 가상으로 할당한 뒤 안전성 검사 — 'Need가 남은 자원(Work) 이하인 프로세스를 찾아 끝내고 회수'를 반복해 전원이 끝나면 안전 상태로 판정하고 실제 할당합니다. 이때 나온 순서가 안전 순서열입니다.",
      map: [
        { as: "금고 잔액", real: "Available", note: "현재 남은 자원" },
        { as: "대출 한도", real: "Max", note: "프로세스별 최대 요구량" },
        { as: "빌려간 돈", real: "Allocation", note: "현재 할당량" },
        { as: "더 필요한 돈", real: "Need = Max − Allocation", note: "계산 문제로 출제" },
        { as: "모두 완제 가능한 순서 존재", real: "안전 상태 → 할당 / 불안전 → 거절", note: "판단 기준" },
      ],
      usage:
        "최대 요구량을 미리 알아야 해서 실제 OS엔 거의 없지만, 클라우드 자원 쿼터 승인 같은 곳에 같은 사고방식이 있습니다. 시험은 Available/Max/Allocation/Need 표를 주고 안전 순서열을 찾는 계산 문제가 정석입니다.",
      links: [
        { topic: "교착상태(Deadlock)", how: "대응 4단계 중 '회피'가 이 알고리즘의 자리입니다." },
        { topic: "자원할당 그래프(Resource Allocation Graph)", how: "'발견' 도구와 짝으로 비교해 외우세요." },
      ],
      exam: "은행가 알고리즘은 자원 할당 후에도 안전 상태가 유지될 때만 할당하는 교착 회피 기법으로 Available·Max·Allocation·Need 자료구조를 사용하며, 최대 요구량의 사전 인지가 필요하다.",
    },
  },
"os-38": {
    image: "/concept/book/os-38.webp",
    guide: {
      hook: "나이(타임스탬프)로 다툼을 정리해 교착을 막는 두 규칙 — 이름 그대로 읽으면 됩니다.",
      scene: "자원을 쥔 쪽과 원하는 쪽이 부딪히면, 먼저 시작한 쪽(늙음)을 우대합니다. Wait-Die: 늙은 쪽은 기다리고(Wait), 젊은 쪽은 죽었다가 재시작(Die). Wound-Wait: 늙은 쪽은 젊은 쪽을 찔러 뺏고(Wound), 젊은 쪽은 기다립니다(Wait).",
      why: "규칙 이름의 앞부분이 '늙은 쪽의 행동'이라는 것만 알면 절대 안 헷갈립니다. 둘 다 늙은 트랜잭션 우대라서 오래된 작업이 영영 못 끝나는 기아가 없고, 죽은 젊은 작업은 같은 타임스탬프로 재시작해 언젠가 늙은 쪽이 됩니다.",
      mechanism:
        "충돌이 나면 두 트랜잭션의 타임스탬프를 비교해 그 자리에서 즉시 기다릴지/죽을지/뺏을지를 결정합니다 — 그래프 탐지가 필요 없습니다. Die로 죽은 쪽은 '원래 타임스탬프 그대로' 재시작하는 것이 기아 방지의 핵심 장치입니다.",
      map: [
        { as: "이름 앞부분 = 늙은 쪽 행동", real: "Wait-Die의 Wait / Wound-Wait의 Wound", note: "늙으면 기다림 / 늙으면 뺏음(선점)" },
        { as: "이름 뒷부분 = 젊은 쪽 행동", real: "Die(롤백 후 재시작) / Wait", note: "비선점 / 선점 구분" },
        { as: "나이", real: "타임스탬프(트랜잭션 시작 시각)", note: "재시작해도 원래 나이 유지 → 기아 방지" },
      ],
      usage:
        "분산 DB에서 두 노드가 같은 데이터를 잠글 때의 교착 예방 기법으로 출제됩니다. 시험은 '늙은 쪽/젊은 쪽 행동' 표 채우기와 선점/비선점 구분입니다.",
      links: [
        { topic: "교착상태(Deadlock)", how: "타임스탬프 기반 '예방' 계열 기법입니다." },
        { topic: "기아(Starvation)", how: "늙은 쪽 우대 덕분에 기아까지 막힙니다." },
      ],
      exam: "Wait-Die는 비선점 방식(연장자 대기, 연소자 롤백), Wound-Wait는 선점 방식(연장자가 강제 회수, 연소자 대기)의 타임스탬프 기반 교착 방지 기법으로 기아가 발생하지 않는다.",
    },
  },
"os-24": {
    image: "/concept/book/os-24.png",
    guide: {
      hook: "디스크 바늘(헤드)의 이동 순서 문제 — 엘리베이터 운행 규칙과 똑같습니다.",
      scene: "엘리베이터가 층 호출을 처리합니다. 누른 순서대로 가면(FCFS) 위아래로 널뛰어 느리고, 가까운 층부터 가면(SSTF) 꼭대기 호출은 영영 못 받습니다(기아). 그래서 — 한 방향 끝까지 갔다 돌아오기(SCAN), 호출 있는 데까지만 가기(LOOK), 한 방향으로만 돌고 끝나면 처음으로 점프(C-SCAN·C-LOOK).",
      why: "헤드 이동 거리가 곧 시간이라, 같은 요청도 순서만 바꾸면 총 이동이 크게 줄어듭니다. 이름 규칙만 잡으면 8개가 정리됩니다 — SCAN 계열=양방향, C 붙으면=한 방향+점프, LOOK 붙으면=끝까지 안 가고 요청까지만.",
      mechanism:
        "디스크 드라이버가 요청 큐의 트랙 번호들을 알고리즘에 따라 정렬해 헤드를 움직입니다. 계산 문제는 '현재 헤드 위치·이동 방향·요청 목록'을 주고 총 이동 거리를 구하는 것 — SCAN은 디스크 끝까지, LOOK은 마지막 요청까지만 가는 차이에서 갈립니다.",
      map: [
        { as: "누른 순서대로", real: "FCFS", note: "공정하지만 비효율" },
        { as: "가까운 층부터", real: "SSTF", note: "빠르지만 기아 발생" },
        { as: "엘리베이터 왕복", real: "SCAN / LOOK", note: "끝까지 / 요청 있는 곳까지" },
        { as: "한 방향 + 처음으로 점프", real: "C-SCAN / C-LOOK", note: "응답시간 균일" },
        { as: "묶음 처리 / 회전 지연 최소화", real: "N-Step SCAN / SLTF", note: "그룹 단위 / 같은 트랙 내 섹터 선택" },
      ],
      usage:
        "HDD 시대의 핵심이고 리눅스 IO 스케줄러에 사상이 남아 있습니다. 'SSD는 헤드가 없어 의미가 줄었다'는 코멘트가 가점 요소입니다. 시험은 총 이동거리 계산(교재 예: 헤드 이동 208 vs 413 비교)입니다.",
      links: [
        { topic: "기아(Starvation)", how: "SSTF의 부작용 — CPU 스케줄링과 같은 원리입니다." },
        { topic: "파일 시스템(유닉스 파일시스템)", how: "이 바늘이 읽으러 가는 대상이 파일시스템의 블록입니다." },
      ],
      exam: "디스크 스케줄링은 헤드 이동 경로를 최적화하는 기법으로 FCFS·SSTF·SCAN·N-Step SCAN·C-SCAN·LOOK·C-LOOK·SLTF가 있으며, SCAN 계열은 양방향, C 계열은 단방향 순환, LOOK 계열은 요청 범위까지만 이동한다.",
    },
  },
"os-58": {
    image: "/concept/book/os-58.webp",
    guide: {
      hook: "디스크 한 파티션을 도서관처럼 네 구역으로 나눠 쓰는 구조입니다.",
      scene: "입구 안내판(부트 블록 — 부팅 코드), 도서관 전체 현황판(슈퍼 블록 — 총 서가 수·빈 서가 목록), 책마다의 정보 카드 서랍(i-node 리스트), 실제 서가(데이터 블록). 책을 찾으려면 '제목→카드번호' 색인(디렉토리)에서 번호를 얻고, 카드에서 서가 위치를 읽어 찾아갑니다.",
      why: "핵심은 '이름과 정보가 다른 곳에 있다'입니다 — 파일 이름은 디렉토리에, 정보(권한·크기·위치)는 inode에. 그래서 이름을 바꿔도 inode 번호는 그대로이고, 하드링크가 가능해집니다.",
      mechanism:
        "open('/home/a.txt')가 오면 커널은 루트 디렉토리 블록에서 home의 inode 번호를 얻고 → home 디렉토리 블록에서 a.txt의 inode 번호를 얻고 → 그 inode에서 권한을 검사한 뒤 데이터 블록 위치를 얻습니다. 경로 계단마다 '디렉토리→inode' 조회가 한 번씩 일어납니다.",
      map: [
        { as: "입구 안내판", real: "부트 블록", note: "부팅 코드" },
        { as: "전체 현황판", real: "슈퍼 블록", note: "파일시스템 크기·빈 블록 목록 등 메타데이터" },
        { as: "정보 카드 서랍", real: "i-node 리스트", note: "파일별 속성·위치" },
        { as: "실제 서가", real: "데이터 블록", note: "진짜 내용" },
        { as: "제목→카드번호 색인", real: "디렉토리", note: "파일명 ↔ inode 번호 대응만 저장" },
      ],
      usage:
        "리눅스에서 ls -i로 inode 번호를 직접 볼 수 있고, df -i로 'inode 고갈'(용량은 남았는데 파일 생성 실패) 장애를 진단합니다. 시험은 4구역 구조와 '파일 이름은 디렉토리에 있다' 포인트입니다.",
      links: [
        { topic: "유닉스의 inode", how: "카드 한 장의 속을 자세히 파는 토픽입니다." },
        { topic: "디스크 스케줄링(Disk Scheduling)", how: "서가까지 가는 발걸음(헤드 이동)의 최적화입니다." },
      ],
      exam: "유닉스 파일시스템은 부트 블록·슈퍼 블록·i-node 리스트·데이터 블록으로 구성되며, 디렉토리는 파일명과 inode 번호의 대응만 저장하고 파일 속성은 inode가 관리한다.",
    },
  },
"os-57": {
    image: "/concept/book/os-57.webp",
    guide: {
      hook: "파일 한 개마다 붙는 정보 카드 — 위엔 속성, 아래엔 위치가 적혀 있습니다.",
      scene: "카드 위쪽엔 소유자·권한·크기·시각(Attribute)이 적혀 있습니다. 아래쪽(index)엔 책이 꽂힌 서가 번호가 있는데 — 작은 책은 번호를 바로 적고(직접 블록), 큰 책은 '번호 목록이 적힌 종이'의 위치를 적습니다(단일 간접). 그 종이가 또 종이를 가리키면 이중·삼중 간접입니다.",
      why: "작은 파일은 빠르게(직접), 큰 파일은 어쨌든 가능하게(간접) — 두 요구를 한 구조로 잡은 설계입니다. 4KB 블록·4바이트 주소면 종이 한 장이 1024개를 가리키므로, 간접이 한 단계 늘 때마다 용량이 1024배씩 뜁니다. 그리고 카드에 '이름'이 없다는 게 단골 함정입니다.",
      mechanism:
        "표준 구성은 직접 포인터 12개 + 단일/이중/삼중 간접 각 1개입니다. 4KB 블록·4바이트 주소 기준으로 직접 48KB, 단일 간접 +4MB, 이중 +4GB, 삼중 +4TB — 간접이 한 단계 늘 때마다 1024배씩 커집니다. 이 최대 파일 크기 계산이 그대로 출제됩니다.",
      map: [
        { as: "카드 위쪽", real: "Attribute", note: "mode·소유자·크기·타임스탬프·링크 수" },
        { as: "서가 번호 직접 기입", real: "Direct Block", note: "작은 파일용, 빠름" },
        { as: "번호 목록 종이", real: "Single Indirect", note: "4KB/4B = 1024개 지시" },
        { as: "종이의 종이(의 종이)", real: "Double·Triple Indirect", note: "단계마다 ×1024" },
        { as: "카드에 없는 것", real: "파일명", note: "이름은 디렉토리에 있음 — 함정 포인트" },
      ],
      usage:
        "하드링크(ln)는 같은 inode를 가리키는 이름을 하나 더 만드는 것이고, '파일을 지웠는데 용량이 안 줄어드는' 현상은 링크 수·열림 상태 때문입니다. 시험은 구조도와 최대 파일 크기 계산입니다.",
      links: [
        { topic: "파일 시스템(유닉스 파일시스템)", how: "이 카드가 꽂혀 있는 서랍이 i-node 리스트입니다." },
        { topic: "기억장치 계층 구조(Memory Hierarchy)", how: "'자주 쓰는 것은 빠르게, 큰 것은 단계적으로'라는 같은 철학입니다." },
      ],
      exam: "inode는 파일의 속성(Attribute)과 데이터 블록 위치(index)를 관리하는 메타데이터로 direct·single/double/triple indirect 구조로 대용량 파일을 지원하며, 파일명은 디렉토리가 보관한다.",
    },
  },
"os-23": {
    image: "/concept/book/os-23.webp",
    guide: {
      hook: "누가 다음으로 일할지 정하는 순서 결정자이고, 시간 단위에 따라 세 명입니다.",
      scene: "식당 주방을 떠올려 보세요. 요리사는 한 명(CPU)인데 주문이 밀립니다. 사장은 오늘 주방에 들일 주문 수 자체를 조절하고(너무 받으면 주방이 마비되니까), 홀 매니저는 '요리사가 다음에 잡을 주문'을 매 순간 고릅니다. 주방이 터질 것 같으면 부매니저가 일부 주문을 잠시 밖으로 빼 둡니다.",
      why: "순서 결정자가 없으면 목소리 큰 주문만 먼저 나가고, 주문을 무한정 받으면 요리는 못 하고 주문서만 뒤적이게 됩니다(스레싱). 셋의 역할 구분이 이 토픽의 전부입니다.",
      mechanism:
        "준비 큐에 프로세스들이 줄 서 있고, 타이머 인터럽트가 오면 단기 스케줄러가 다음 것을 골라 디스패처가 문맥교환을 실행합니다. 장기 스케줄러는 시스템에 들일 작업 수 자체를 조절하고(다중 프로그래밍 정도), 중기는 메모리가 부족하면 프로세스를 통째로 디스크로 내보냅니다(스왑 아웃).",
      map: [
        { as: "사장 — 주문을 주방에 들일지 결정", real: "장기(Job) 스케줄러", note: "생성→준비. 다중 프로그래밍 정도를 조절합니다" },
        { as: "부매니저 — 잠시 밖으로 빼 두기", real: "중기 스케줄러", note: "메모리 부족 시 디스크로 스와핑" },
        { as: "홀 매니저 — 다음 주문 선택", real: "단기(CPU) 스케줄러", note: "준비→실행. 가장 자주 돌아갑니다" },
        { as: "주문서를 실제로 건네는 동작", real: "디스패처", note: "결정을 실행에 옮김 — 문맥교환·모드 전환" },
      ],
      usage:
        "리눅스의 CFS(완전 공정 스케줄러)가 단기 스케줄러의 실물입니다. 시험은 상태 전이도 위에 장·중·단기의 위치를 얹어 그리고, 빈도·역할 비교표를 채우는 형태입니다.",
      links: [
        { topic: "CPU 스케줄링(CPU Scheduling)", how: "홀 매니저가 '어떤 규칙으로' 고르는지가 바로 다음 토픽입니다." },
        { topic: "프로세스 상태 전이도", how: "주문서가 지금 어느 줄에 서 있는지의 지도입니다." },
        { topic: "스레싱(Thrashing)", how: "사장(장기)이 주문을 너무 많이 들이면 도달하는 상태입니다." },
      ],
      exam: "스케줄러는 자원을 할당할 프로세스를 선택하는 커널 모듈로, 장기(생성→준비, 다중 프로그래밍 정도 조절)·중기(스와핑)·단기(준비→실행)로 구분되며 디스패처가 실제 전환을 수행한다.",
    },
  },
"process-state-transition": {
    image: "/concept/book/process-state-transition.webp",
    guide: {
      hook: "주문서 한 장이 태어나서 나갈 때까지 서는 줄이 다섯 개 있습니다.",
      scene: "주문이 접수되고(생성), 조리 대기줄에 걸리고(준비), 요리사가 잡으면 조리 중(실행). 그런데 재료 배달을 기다려야 하면 옆 선반으로 잠시 빠지고(대기), 재료가 도착하면 다시 대기줄 맨 뒤로 돌아옵니다. 완성되면 나갑니다(종료).",
      why: "재료를 기다리는 주문을 요리사가 손에 쥔 채 서 있으면 주방 전체가 멈춥니다. 그래서 기다릴 일이 생기면 반드시 내려놓게 되어 있고 — 이 규칙 때문에 '대기→실행' 직행 화살표는 존재하지 않습니다. 이게 단골 함정 문제입니다.",
      mechanism:
        "상태의 실체는 PCB 안의 상태 필드 값이고, 전이의 실체는 커널이 PCB를 이 큐에서 저 큐로 옮기는 것입니다. 타이머 인터럽트 → 실행 중 PCB를 준비 큐로, read() 호출 → 대기 큐로, 디스크 완료 인터럽트 → 그 PCB를 대기 큐에서 준비 큐로. 화살표 하나하나가 실제 커널 코드 경로입니다.",
      map: [
        { as: "접수 → 대기줄 → 조리 → 완성", real: "생성(New)→준비(Ready)→실행(Running)→종료", note: "기본 흐름" },
        { as: "요리사가 주문을 잡는 순간", real: "디스패치(준비→실행)", note: "화살표 이름까지 외워야 합니다" },
        { as: "너무 오래 잡고 있어 내려놓게 함", real: "시간 만료·타임아웃(실행→준비)", note: "시분할의 핵심" },
        { as: "재료 기다리러 선반으로", real: "보류(실행→대기)", note: "I/O 요청 등" },
        { as: "재료 도착, 줄 맨 뒤로", real: "조건 만족(대기→준비)", note: "실행으로 직행 불가!" },
      ],
      usage:
        "리눅스 ps 명령의 STAT 열(R=실행/준비, S=대기, Z=좀비)이 바로 이 상태입니다. 시험은 5상태 그림을 직접 그려 전이 이름 4개를 채우고, '대기→실행 직행이 없는 이유'를 서술하는 문제로 나옵니다.",
      links: [
        { topic: "스케줄러(Scheduler)", how: "대기줄에서 다음 주문을 고르는 사람입니다." },
        { topic: "PCB(Process Control Block)", how: "내려놓을 때 진행 상황을 적어 두는 관리 카드입니다." },
        { topic: "문맥교환(Context Switching)", how: "내려놓고 다른 주문을 잡는 동작 그 자체입니다." },
      ],
      exam: "프로세스는 생성·준비·실행·대기·종료 5상태를 가지며 디스패치(준비→실행)·타임아웃(실행→준비)·보류(실행→대기)·조건만족(대기→준비)으로 전이되고, 대기에서 실행으로의 직접 전이는 없다.",
    },
  },
"cpu-scheduling": {
    image: "/concept/book/cpu-scheduling.webp",
    guide: {
      hook: "대기줄에서 다음 주문을 어떤 규칙으로 고를지의 문제 — 하던 걸 뺏을 수 있느냐로 두 갈래입니다.",
      scene: "온 순서대로 하면(FCFS) 공평한데, 3시간짜리 스테이크 뒤에 라면 주문 열 개가 줄줄이 굶습니다(호위효과). 짧은 것부터 하면(SJF) 효율적인데 긴 주문은 계속 밀립니다. 그래서 '하던 요리도 중간에 내려놓게 하는' 규칙이 나옵니다 — 타이머로 조금씩 돌아가며(RR), 더 짧은 게 오면 뺏고(SRT), 오래 도는 주문은 뒷줄로 강등(MLFQ).",
      why: "규칙 없이는 긴 작업 하나가 주방을 독점하고, 우선순위만 따지면 낮은 주문이 영영 안 나갑니다(기아). 선점/비선점 구분과 각 규칙의 부작용이 시험의 축입니다.",
      mechanism:
        "각 알고리즘의 실체는 '준비 큐를 어떤 기준으로 정렬하느냐'입니다. FCFS는 그냥 선입선출 큐, SJF/SRT는 실행시간 기준 우선순위 큐, RR은 큐 + 타임 퀀텀 타이머, MLFQ는 큐 여러 개 + 오래 돌면 아래 큐로 강등. 계산 문제는 간트 차트를 그려 평균 대기시간 = Σ(시작-도착)/n 으로 풉니다.",
      map: [
        { as: "온 순서대로", real: "FCFS (비선점)", note: "부작용: 호위효과" },
        { as: "짧은 것부터", real: "SJF (비선점)", note: "개선판: 기다린 시간까지 반영한 HRN" },
        { as: "타이머로 돌아가며", real: "RR (선점)", note: "시분할 시스템의 기본" },
        { as: "남은 시간 더 짧으면 뺏음", real: "SRT (선점)", note: "SJF의 선점판" },
        { as: "여러 줄 + 오래 돌면 강등", real: "MLQ · MLFQ (선점)", note: "실제 OS가 쓰는 방식에 가까움" },
      ],
      usage:
        "실제 리눅스는 CFS(공정 배분), 윈도우는 다단계 피드백 큐 계열입니다. 시험의 절반은 간트 차트 계산(평균 대기·반환시간), 절반은 선점/비선점 분류표와 호위효과·기아 서술입니다.",
      links: [
        { topic: "스케줄러(Scheduler)", how: "이 규칙을 집행하는 주체가 단기 스케줄러입니다." },
        { topic: "기아(Starvation)", how: "우선순위 규칙의 부작용이고, Aging으로 풉니다." },
        { topic: "기한부(Deadline) 스케줄링", how: "'몇 시까지 반드시'가 붙는 실시간 특수판입니다." },
      ],
      exam: "CPU 스케줄링은 준비 큐에서 CPU를 할당할 프로세스를 선정하는 정책으로 선점형(RR·SRT·MLQ·MLFQ)과 비선점형(FCFS·SJF·HRN·우선순위)으로 구분되며, 호위효과와 기아상태를 고려해야 한다.",
    },
  },
"deadline-scheduling": {
    image: "/concept/book/deadline-scheduling.webp",
    guide: {
      hook: "'맛있게'보다 '제시간에'가 목숨인 주방의 규칙입니다.",
      scene: "기내식 주방입니다. 이륙 전까지 못 실으면 그 요리는 가치가 0입니다. 이런 곳은 두 규칙을 씁니다 — 매일 반복되는 주문은 '자주 나가는 것일수록 우선'으로 미리 서열을 박아 두거나(RM), 그때그때 '마감이 제일 급한 것부터' 처리합니다(EDF).",
      why: "일반 스케줄링은 평균이 빠르면 칭찬받지만, 브레이크 제어나 심박기는 평균이 무의미합니다 — 한 번이라도 늦으면 사고입니다. '늦으면 끝'과 '늦어도 품질만 하락'을 나누는 게 경성/연성입니다.",
      mechanism:
        "RM은 '주기가 짧을수록 높은 우선순위'를 미리 박아 두는 정적 방식이고, EDF는 매 순간 '마감이 가장 급한 것'을 고르는 동적 방식입니다. RM은 CPU 이용률 합이 약 69% 이하일 때 스케줄 가능이 보장되고, EDF는 100%까지 보장되지만 구현·예측이 어렵습니다.",
      map: [
        { as: "자주 나가는 주문 우선, 미리 고정", real: "RM(Rate Monotonic) — 정적", note: "단순·예측 가능, CPU 이용률 한계(최대 약 69%)" },
        { as: "마감 급한 순, 그때그때", real: "EDF(Earliest Deadline First) — 동적", note: "이론상 100% 활용, 구현 복잡·예측 어려움" },
        { as: "한 번도 늦으면 안 됨", real: "경성(Hard) 실시간", note: "자동차·의료" },
        { as: "좀 늦어도 됨", real: "연성(Soft) 실시간", note: "동영상 스트리밍" },
      ],
      usage:
        "자동차 ECU(브레이크), 심박조율기, 드론 비행제어의 RTOS(FreeRTOS·QNX)가 실제 무대입니다. 시험은 RM vs EDF 비교표와 '주어진 태스크 셋이 스케줄 가능한가' 이용률 판정입니다.",
      links: [
        { topic: "CPU 스케줄링(CPU Scheduling)", how: "일반 규칙들의 실시간 특수판이 이 토픽입니다." },
        { topic: "워치독 타이머(WDT)", how: "실시간 시스템이 그래도 멈췄을 때의 최후 안전장치입니다." },
      ],
      exam: "기한부 스케줄링은 마감시한 준수를 보장하는 실시간 스케줄링으로, 주기 기반 정적 우선순위의 RM과 마감 기반 동적 우선순위의 EDF가 있으며 경성/연성 실시간으로 구분된다.",
    },
  },
"os-47": {
    image: "/concept/book/os-47.webp", images: ["/concept/extra/context-switch-pcb.png"],
    guide: {
      hook: "요리사가 주문 A를 내려놓고 B로 갈아타는 동작 — 그 시간엔 요리가 한 개도 안 됩니다.",
      scene: "갈아타려면 A가 어디까지 됐는지(불 세기·남은 시간)를 A의 관리 카드(PCB)에 적고, B의 카드를 읽어 그 상태를 복원해야 합니다. 적고 읽는 동안 손은 완전히 멈춰 있습니다.",
      why: "갈아타기가 공짜라면 마음껏 자주 바꾸면 되지만, 실제로는 순수한 손해 시간입니다. 너무 잦으면 요리(실제 일)보다 카드 쓰기(전환)에 시간을 더 쓰게 됩니다 — 그래서 '오버헤드를 어떻게 줄이나'까지가 한 세트입니다.",
      mechanism:
        "인터럽트가 오면 커널 모드 진입 → 현재 레지스터·PC를 지금 PCB에 저장 → 스케줄러가 다음 프로세스 선택 → 그 PCB에서 복원 → 주소 공간 전환(페이지 테이블 교체, TLB 비움) → 사용자 모드 복귀. 전환 직후엔 TLB·캐시가 식어 있어 미스가 급증하는 것까지가 실제 비용입니다.",
      map: [
        { as: "진행 상황을 카드에 적고 읽기", real: "PCB 저장/복원", note: "문맥교환의 실체" },
        { as: "갈아타라는 신호", real: "인터럽트 · 시스템 호출", note: "발생 원인" },
        { as: "손 멈춘 시간", real: "오버헤드", note: "그동안 유용한 일 0" },
        { as: "줄이는 법", real: "다중 프로그래밍 정도↓ · 스택 포인터만 교체 · 스레드 사용", note: "교재의 대응 3종" },
      ],
      usage:
        "리눅스 vmstat의 cs 수치가 초당 문맥교환 횟수입니다. 스레드를 과도하게 만들어 cs가 치솟아 느려지는 사례, 그래서 스레드 풀을 쓰는 이유가 실무 연결점입니다. 시험은 절차 서술 + 오버헤드 저감 3법입니다.",
      links: [
        { topic: "PCB(Process Control Block)", how: "그 카드의 정체입니다." },
        { topic: "프로세스(Process)와 스레드(Thread) 비교", how: "스레드는 카드가 얇아 갈아타기가 훨씬 빠릅니다." },
        { topic: "인터럽트(Interrupt)", how: "갈아타기를 유발하는 대표 신호입니다." },
      ],
      exam: "문맥교환은 실행 중인 프로세스의 상태를 PCB에 저장하고 다음 프로세스의 상태를 복원하는 과정으로 순수 오버헤드이며, 다중 프로그래밍 정도 조절과 스레드 활용으로 부하를 줄인다.",
    },
  },
"os-37": {
    image: "/concept/book/os-37.webp",
    guide: {
      hook: "줄은 서 있는데 내 차례가 영원히 안 오는 것입니다.",
      scene: "VIP 주문이 끊임없이 들어오는 식당에서 일반 주문 하나가 하루 종일 밀립니다. 사장이 규칙 하나를 더합니다 — '30분 이상 기다린 주문은 VIP로 승격'. 그러자 오래 기다릴수록 등급이 올라 결국 차례가 옵니다. 이 승격이 Aging입니다.",
      why: "우선순위 스케줄링의 필연적 부작용입니다. 교착상태와의 구분이 단골 문제 — 교착은 서로 물려서 '아무도' 못 가는 것, 기아는 순서가 안 와서 '나만' 못 가는 것입니다.",
      mechanism:
        "우선순위 큐에서 높은 것이 계속 유입되면 낮은 것은 영영 헤드에 못 옵니다. Aging의 실체는 '대기 시간에 비례해 유효 우선순위를 조금씩 올리는 것' — 언젠가 반드시 헤드에 도달합니다. HRN은 (대기+버스트)/버스트를 계산해 큰 쪽 먼저 실행합니다.",
      map: [
        { as: "영영 안 오는 차례", real: "기아(Starvation)", note: "낮은 우선순위의 무한 대기" },
        { as: "기다릴수록 승격", real: "Aging", note: "대기 시간에 비례해 우선순위를 올림" },
        { as: "대기시간을 공식에 반영", real: "HRN = (대기시간+버스트)/버스트", note: "SJF의 불공평 보완" },
        { as: "여러 줄에서 승격·강등", real: "MLFQ", note: "구조적으로 기아를 완화" },
      ],
      usage:
        "DB에서 오래 기다린 트랜잭션 우선 처리, SSTF 디스크 스케줄링의 먼 트랙 요청 등 기아는 도처에 있습니다. 시험은 '교착 vs 기아' 비교와 HRN 우선순위 계산 문제입니다.",
      links: [
        { topic: "CPU 스케줄링(CPU Scheduling)", how: "기아를 만드는 원인(우선순위·SJF)이 여기 있습니다." },
        { topic: "교착상태(Deadlock)", how: "'모두 멈춤 vs 나만 밀림' 구분이 시험 포인트입니다." },
        { topic: "디스크 스케줄링(Disk Scheduling)", how: "SSTF에서 먼 트랙 요청이 겪는 것도 똑같은 기아입니다." },
      ],
      exam: "기아는 우선순위가 낮은 프로세스가 자원을 계속 할당받지 못하는 현상으로, 대기시간에 비례해 우선순위를 높이는 Aging과 HRN 등으로 해결한다.",
    },
  },
"os-63": {
    image: "/concept/book/os-63.webp",
    guide: {
      hook: "하던 일을 잠깐 멈추게 하는 끼어들기 신호와, 그것을 처리하는 정해진 절차입니다.",
      scene: "요리 중에 화재경보가 울립니다. 요리사는 ① 지금 불 세기를 메모하고 ② 경보 매뉴얼 목차에서 '화재' 페이지를 찾아 ③ 그대로 처리한 뒤 ④ 메모를 보고 요리로 복귀합니다. 처리 중에 또 경보가 오면 더 급한 것만 끼어들게 하고(선점), 아니면 줄을 세웁니다(대기).",
      why: "끼어들기가 없으면 CPU는 '무슨 일 없나' 계속 두리번거려야(폴링) 합니다. 신호가 올 때만 반응하는 쪽이 압도적으로 효율적이라, 현대 컴퓨터는 전부 인터럽트 구동입니다.",
      mechanism:
        "장치가 인터럽트 라인을 올리면 CPU는 지금 명령만 끝내고 IVT[번호]에 적힌 처리 루틴(ISR) 주소로 점프합니다. ISR은 최소한만 빨리 처리하고 무거운 일은 뒤로 미룹니다(리눅스의 softirq) — 인터럽트 금지 시간을 줄이기 위해서입니다.",
      map: [
        { as: "경보 매뉴얼 목차", real: "인터럽트 벡터 테이블(IVT)", note: "ID로 처리 루틴 주소를 찾음" },
        { as: "메모 → 처리 → 복귀", real: "상태 저장 → 처리 → 상태 복구", note: "표준 처리 절차" },
        { as: "기계가 울린 경보", real: "H/W 인터럽트", note: "입출력·외부·기계착오·재시작" },
        { as: "프로그램이 울린 경보", real: "S/W 인터럽트", note: "SVC(슈퍼바이저 호출)·프로그램 검사" },
        { as: "겹친 경보", real: "중첩 — Preemption / Pending", note: "우선순위 선점 또는 순서 대기" },
      ],
      usage:
        "키보드를 누르는 순간, 네트워크 패킷이 도착하는 순간마다 일어나는 일입니다. 시험은 처리 절차 7단계 서술, 폴링 vs 인터럽트 비교, HW/SW 인터럽트 분류입니다.",
      links: [
        { topic: "문맥교환(Context Switching)", how: "인터럽트가 문맥교환의 대표적인 방아쇠입니다." },
        { topic: "커널(Kernel)", how: "처리 루틴은 커널 모드(Ring 0)에서 돕니다." },
        { topic: "DMA(Direct Memory Access)", how: "전송이 끝났다고 알리는 수단도 인터럽트입니다." },
      ],
      exam: "인터럽트는 CPU의 정상 흐름을 중단시키는 신호로, IVT에서 처리 루틴을 찾아 상태 저장→처리→복구 절차로 수행되며 HW/SW 인터럽트로 구분되고 중첩 시 선점 또는 대기로 처리한다.",
    },
  },
"os-48": {
    image: "/concept/book/os-48.webp",
    guide: {
      hook: "프로세스 한 명당 한 장씩 만들어지는 신상명세서입니다.",
      scene: "주문서마다 붙는 관리 카드를 떠올리세요 — 주문번호, 지금 상태(조리 중/대기), 어디까지 진행됐는지, 쓰던 화구, 결제 정보까지. 요리사가 주문을 내려놓을 때 이 카드에 적고, 다시 잡을 때 이 카드부터 읽습니다.",
      why: "이 카드가 없으면 내려놓은 주문을 다시 잡을 방법이 없습니다. 문맥교환도 스케줄링도 결국 이 카드를 읽고 쓰는 일이라, '프로세스 관리 = PCB 관리'입니다. 구성 8가지는 교재 두음 '식상카레스계입메'로 바로 꽂으세요.",
      mechanism:
        "리눅스에서 PCB의 실물은 task_struct 구조체입니다. fork()가 이걸 하나 만들고, 문맥교환이 여기에 레지스터를 저장하고, ps·top 명령이 여기서 정보를 읽어 보여줍니다. 프로세스가 죽어도 부모가 결과를 수거할 때까지 PCB만 남아 있는 상태가 '좀비 프로세스'입니다.",
      map: [
        { as: "주문번호", real: "식별자(PID)", note: "식" },
        { as: "지금 어느 줄인지", real: "프로세스 상태", note: "상" },
        { as: "레시피 몇 번째 줄인지", real: "프로그램 카운터", note: "카" },
        { as: "손에 든 것들 그대로", real: "레지스터 저장 영역", note: "레" },
        { as: "나머지 넷", real: "스케줄링·계정·입출력·메모리 정보", note: "스·계·입·메" },
      ],
      usage:
        "'좀비 프로세스 = PCB만 남은 상태'라는 연결이 실무·시험 공용 포인트입니다. 시험은 구성 8요소(식상카레스계입메) 나열과, 문맥교환·스케줄링에서 PCB가 하는 역할 서술로 나옵니다.",
      links: [
        { topic: "문맥교환(Context Switching)", how: "PCB를 저장·복원하는 동작이 곧 문맥교환입니다." },
        { topic: "프로세스(Process)와 스레드(Thread) 비교", how: "스레드의 카드(TCB)는 훨씬 얇습니다 — 그래서 가볍습니다." },
        { topic: "프로세스 상태 전이도", how: "카드의 '상태' 칸이 오가는 지도입니다." },
      ],
      exam: "PCB는 OS가 프로세스를 관리하기 위한 자료구조로 PID·상태·프로그램 카운터·레지스터·스케줄링·계정·입출력·메모리 관리 정보를 포함한다(식상카레스계입메).",
    },
  },
"cbam": {
    guide: {
      hook: "아키텍처 결정의 '비용 대비 효익(ROI)'까지 따져 우선순위를 정하는 평가 방법입니다.",
      scene: "ATAM이 품질 트레이드오프를 본다면, CBAM은 여기에 '돈'을 더합니다. 각 아키텍처 전략의 비용과 그것이 주는 효익(품질 개선의 가치)을 비교해, 투자 대비 효과가 큰 결정부터 우선하게 합니다.",
      why: "'ATAM에 비용-효익(경제성) 추가'와 ROI 기반 우선순위가 출제 핵심입니다.",
      mechanism: "ATAM 후속(ATAM의 결과를 입력). 절차: 시나리오 정리·우선순위 → 각 아키텍처 전략(AS)의 품질 속성 응답 변화 산정 → 효익(Benefit — 응답 개선의 유용성 점수) 산정 → 비용 산정 → ROI = 효익/비용 계산 → ROI 높은 전략 우선. 불확실성 고려. 경제적 관점으로 아키텍처 의사결정 지원. IT 투자 평가(NPV 등)와 결합.",
      map: [
        { as: "품질+비용 함께", real: "ATAM에 경제성 추가", note: "" },
        { as: "개선의 가치", real: "효익(Benefit)", note: "" },
        { as: "효익/비용", real: "ROI", note: "우선순위" },
        { as: "투자 대비 효과 큰 것", real: "의사결정", note: "" },
      ],
      usage: "아키텍처 투자 의사결정입니다. 시험은 ATAM과의 관계, ROI 기반 우선순위입니다.",
      links: [
        { topic: "SW Architecture 평가", how: "CBAM은 평가 방법의 하나입니다." },
        { topic: "IT 투자성과 평가", how: "경제성 평가 관점을 공유합니다." },
      ],
      exam: "CBAM은 ATAM에 비용-효익을 더해 각 아키텍처 전략의 ROI(효익/비용)를 산정·비교하는 평가 방법으로, 경제적 관점에서 아키텍처 의사결정을 지원한다.",
    }, image: "/concept/book/cbam.png", easy: "CBAM은 아키텍처 대안들의 효용(만족도)과 구현 비용을 비교해 ROI가 가장 높은 안을 고르는 경제성 평가 기법입니다. ATAM이 '품질끼리 뭘 주고받는지'까지 보여줬다면, CBAM은 거기에 돈 계산을 더한 것입니다. 각 아키텍처 안이 주는 효용(만족도)을 시나리오별로 점수화하고, 그 안을 구현하는 비용과 비교해 ROI가 가장 높은 안을 고릅니다. 절차는 시나리오 결정(수집→정제→우선순위) → 효용-반응값 곡선 작성(최악W·현재C·기대E·희망D·최선B) → 접근법별 이익 계산 → ROI로 순위 결정. 2단계 반복(1차는 우선순위, 2차는 위험·불확실성 반영)이 특징입니다." },
"uml": {
    guide: {
      hook: "객체지향 시스템을 '그림으로 표현'하는 표준 모델링 언어 — 정적·동적 다이어그램입니다.",
      scene: "설계를 말로 하면 오해가 생깁니다. UML은 클래스·객체 같은 구조(정적)와 시퀀스·상태 같은 행위(동적)를 표준 도형으로 그려, 개발자·이해관계자가 같은 그림으로 소통하게 합니다.",
      why: "정적/동적 다이어그램 분류와 각 다이어그램 용도가 출제 핵심입니다.",
      mechanism: "구조(정적) 다이어그램: 클래스(클래스·관계), 객체, 컴포넌트, 배치(Deployment), 패키지, 복합구조. 행위(동적) 다이어그램: 유스케이스(기능·액터), 시퀀스(객체 간 시간순 메시지), 커뮤니케이션, 상태(State — 상태 전이), 활동(Activity — 흐름), 타이밍, 상호작용 개요. 총 14종(UML 2.x). 관계: 연관·집합·합성·일반화(상속)·의존·실체화. 4+1 뷰로 조직.",
      map: [
        { as: "구조 표현", real: "정적(클래스·컴포넌트·배치)", note: "" },
        { as: "행위 표현", real: "동적(시퀀스·상태·활동)", note: "" },
        { as: "기능·액터", real: "유스케이스", note: "" },
        { as: "시간순 메시지", real: "시퀀스", note: "" },
      ],
      usage: "객체지향 설계·소통입니다. 시험은 정적/동적 분류, 다이어그램 용도, 관계입니다.",
      links: [
        { topic: "클래스 다이어그램 (Class Diagram)", how: "대표적 정적 다이어그램입니다." },
        { topic: "시퀀스 다이어그램 (Sequence Diagram)", how: "대표적 동적 다이어그램입니다." },
      ],
      exam: "UML은 객체지향 시스템을 표현하는 표준 모델링 언어로, 클래스·컴포넌트·배치 등 정적 다이어그램과 유스케이스·시퀀스·상태·활동 등 동적 다이어그램으로 나뉜다.",
    }, image: "/concept/book/uml.png", easy: "설계를 그림으로 그리는 표준 언어이고, 다이어그램이 13개입니다. 딱 두 갈래만 기억하면 됩니다 — 정적(구조) 6개: 시스템이 '무엇으로' 되어 있나(Class·Component·Object·Deployment·Composite Structure·Package). 동적(행위) 7개: 시스템이 '어떻게' 움직이나(Activity·Use Case·State·Sequence·Communication·Interaction Overview·Timing). 동적 중 4개(시퀀스·커뮤니케이션·인터랙션 오버뷰·타이밍)를 묶어 인터랙션 다이어그램이라 부릅니다." },
"class-diagram": {
    guide: {
      hook: "클래스와 '그들 사이의 관계'를 그린 UML의 대표 정적 다이어그램입니다.",
      scene: "시스템의 뼈대를 보여 줍니다. 각 클래스(속성·메서드)를 상자로, 클래스 간 관계(상속·연관·집합)를 선으로 그려, 구조를 한눈에 파악하고 코드로 옮길 수 있게 합니다.",
      why: "클래스 표기(속성·메서드·접근제어)와 6대 관계가 출제 핵심입니다. 특히 집합(aggregation) vs 합성(composition)이 자주 나옵니다.",
      mechanism: "클래스: 이름·속성(+public·−private·#protected)·메서드 3칸. 관계: 연관(Association — 사용, 실선), 의존(Dependency — 일시 사용, 점선 화살표), 일반화(Generalization — 상속, 빈 삼각형), 실체화(Realization — 인터페이스 구현, 점선 삼각형), 집합(Aggregation — 전체-부분, 부분 독립 존재, 빈 마름모), 합성(Composition — 강한 전체-부분, 부분이 전체에 종속·생명주기 함께, 채운 마름모). 다중성(1, *, 0..1). 코드 생성·역공학 가능.",
      map: [
        { as: "속성·메서드 3칸", real: "클래스 표기", note: "접근제어" },
        { as: "상속(빈 삼각형)", real: "일반화", note: "" },
        { as: "부분 독립(빈 마름모)", real: "집합", note: "" },
        { as: "부분 종속(채운 마름모)", real: "합성", note: "생명주기 함께" },
      ],
      usage: "구조 설계·코드 생성입니다. 시험은 관계 6종, 집합 vs 합성, 다중성입니다.",
      links: [
        { topic: "UML (정적, 동적 다이어그램)", how: "대표적 정적 다이어그램입니다." },
        { topic: "객체지향 설계 원리", how: "클래스 관계 설계에 SOLID를 적용합니다." },
      ],
      exam: "클래스 다이어그램은 클래스(속성·메서드)와 연관·의존·일반화·실체화·집합·합성 관계를 그린 정적 다이어그램으로, 집합은 부분이 독립, 합성은 생명주기가 종속된다.",
    }, image: "/concept/book/class-diagram.png", easy: "클래스 다이어그램은 시스템의 객체 타입(클래스)을 정의하고 그들 간의 정적인 관계를 표현하는 정적 다이어그램입니다. 클래스 사각형은 이름·속성(Attribute)·오퍼레이션 3칸으로 구성되고, 접근제어자는 +Public −Private #Protected ~Package입니다. 시험 포인트는 관계 화살표 구분 — 연관(실선: 서로 안다), 집합(빈 마름모: 부분-전체인데 따로 살 수 있음, 팀과 선수), 복합(찬 마름모: 전체가 소멸하면 부분도 소멸, 집과 방), 의존(점선: 잠깐 빌려 씀), 일반화(빈 삼각형: is-a 상속), 실체화(점선+빈 삼각형: 인터페이스 구현). 스테레오타입은 길러멧(« ») 안에 «interface»처럼 확장 특성을 적는 요소입니다. 집합·복합의 '소멸 운명 공동체' 여부 구분이 가장 자주 출제됩니다." },
"usecase-diagram": {
    guide: {
      hook: "'누가(액터) 시스템으로 무엇을(유스케이스) 하는지'를 그린 기능 요구 다이어그램입니다.",
      scene: "사용자 관점에서 시스템이 제공하는 기능을 한눈에 봅니다. 액터(사람·외부 시스템)와 유스케이스(기능)를 선으로 잇고, 기능 간 포함·확장 관계를 표현해 요구를 소통합니다.",
      why: "액터·유스케이스와 관계(include·extend·일반화)가 출제 핵심입니다. include vs extend 구분이 포인트입니다.",
      mechanism: "요소: 액터(Actor — 시스템 외부 상호작용 주체, 사람·시스템·시간), 유스케이스(타원 — 시스템 기능), 시스템 경계, 연관(액터-유스케이스). 관계: include(포함 — 공통 기능을 항상 포함, 점선 <<include>>, 예: 결제는 항상 인증 포함), extend(확장 — 선택적·조건부 확장, <<extend>>, 예: 결제 시 선택적 쿠폰), 일반화(액터·유스케이스 상속). 요구 도출·범위 정의에 사용. 시나리오(유스케이스 명세)로 상세화.",
      map: [
        { as: "외부 상호작용 주체", real: "액터", note: "" },
        { as: "시스템 기능", real: "유스케이스(타원)", note: "" },
        { as: "항상 포함", real: "include", note: "공통 기능" },
        { as: "선택적 확장", real: "extend", note: "조건부" },
      ],
      usage: "기능 요구 도출·범위 정의입니다. 시험은 액터·유스케이스, include vs extend입니다.",
      links: [
        { topic: "요구공학 (Requirements Engineering)", how: "기능 요구를 유스케이스로 표현합니다." },
        { topic: "UML (정적, 동적 다이어그램)", how: "동적 다이어그램의 하나입니다." },
      ],
      exam: "유즈케이스 다이어그램은 액터와 유스케이스로 시스템 기능을 표현하며, include는 공통 기능을 항상 포함, extend는 선택적·조건부로 확장하는 관계다.",
    }, image: "/concept/book/usecase-diagram.png", easy: "유즈케이스 다이어그램은 시스템이 제공하는 기능과 외부 요소를 사용자 관점에서 표현하는 다이어그램입니다. 졸라맨(액터: 시스템과 상호작용하는 사람·사물), 타원(유즈케이스: 시스템이 제공해야 하는 서비스), 사각형(시스템 경계)이 기본 구성입니다. 관계는 연관(실선)·확장(extend)·포함(include)·일반화(빈 삼각형: 상속)·그룹화(패키지)로 표현합니다. 시험 포인트는 include와 extend 구분 — include는 '반드시 같이 실행'(주문을 받으면 주문 확인이 필수 수행), extend는 '조건을 만족할 때만 실행'(선택). 작성 절차는 액터 식별 → 유즈케이스 식별 → 관계(Relationship) 정의 → 유즈케이스 구조화(공통 서비스 추출) 순서입니다. '필수는 include, 선택은 extend' 하나만 확실히 잡고, 화살표 방향이 서로 반대라는 것까지 챙기면 됩니다." },
"state-diagram": {
    guide: {
      hook: "객체가 '상태를 어떻게 옮겨 다니는지'를 그린 동적 다이어그램입니다.",
      scene: "주문 객체는 '접수→결제→배송→완료'로 상태가 바뀝니다. 상태 다이어그램은 이런 상태와 전이(무슨 이벤트로 바뀌는지)를 그려, 이벤트 기반 동작·생명주기를 명확히 합니다.",
      why: "상태·전이·이벤트와 진입/탈출 액션이 출제 핵심입니다. 상태 기반 시스템 모델링에 쓰입니다.",
      mechanism: "요소: 상태(State — 객체의 조건, 둥근 사각형), 전이(Transition — 상태 간 이동, 화살표), 이벤트/트리거(전이 유발), 가드 조건([조건]), 액션(전이 시 동작). 시작(●)·종료(◉) 상태. 진입(entry)·탈출(exit)·내부 활동(do). 복합 상태(중첩), 병렬 상태. 활용: 객체 생명주기, 프로토콜, 이벤트 기반 시스템(UI·임베디드). 하나의 객체 관점(vs 활동 다이어그램은 흐름).",
      map: [
        { as: "객체의 조건", real: "상태(State)", note: "" },
        { as: "상태 간 이동", real: "전이(Transition)", note: "" },
        { as: "전이 유발", real: "이벤트·가드", note: "[조건]" },
        { as: "진입·탈출 동작", real: "액션", note: "entry/exit" },
      ],
      usage: "생명주기·이벤트 기반 모델링입니다. 시험은 상태·전이·이벤트, 진입/탈출 액션입니다.",
      links: [
        { topic: "UML (정적, 동적 다이어그램)", how: "동적 다이어그램의 하나입니다." },
        { topic: "시퀀스 다이어그램 (Sequence Diagram)", how: "다른 동적 관점(상호작용)입니다." },
      ],
      exam: "상태 다이어그램은 객체의 상태와 이벤트·가드에 따른 전이를 그린 동적 다이어그램으로, 진입·탈출 액션과 복합·병렬 상태로 객체 생명주기를 모델링한다.",
    }, image: "/concept/book/state-diagram.png", easy: "상태 다이어그램은 하나의 객체가 일생(Lifetime) 동안 가질 수 있는 모든 상태와, 사건(이벤트) 발생에 따른 상태 전이 과정을 그리는 동적 다이어그램입니다. 결재 문서로 보면 — 작성 →(상신) 결재대기 →(반려) 반려 →(재작업) 다시 작성, 또는 →(최종결재) 승인 → 종료. 검은 원(●)이 시작 상태, 겹친 원(◉)이 종료 상태, 화살표가 전이, 화살표 위 글자가 이벤트(전이를 유발하는 자극), 대괄호가 전이조건([금액>100만] 같은 불리언 식)입니다. 상태 사각형은 상단에 상태 이름(필수), 하단에 진입(Entry)·do·탈출(Exit) 활동(선택)을 적습니다. '하나의 객체'의 상태 변화만 그린다는 점이 여러 객체 간 메시지를 그리는 시퀀스 다이어그램과의 차이이고, 이벤트와 전이조건의 구분이 시험 포인트입니다." },
"sequence-diagram": {
    guide: {
      hook: "객체들이 '시간 순서로 주고받는 메시지'를 그린 상호작용 다이어그램입니다.",
      scene: "하나의 시나리오(로그인)에서 객체들이 어떤 순서로 메시지를 주고받는지 위에서 아래로 시간 흐름을 따라 그립니다. 어떤 호출이 무엇을 부르는지 흐름을 명확히 합니다.",
      why: "생명선·메시지(동기/비동기)·활성화와 시나리오 표현이 출제 핵심입니다. 커뮤니케이션 다이어그램과의 차이가 포인트입니다.",
      mechanism: "요소: 객체(상단)·생명선(Lifeline — 세로 점선, 시간 흐름 위→아래), 활성화 바(Activation — 실행 중), 메시지(동기 — 실선 채운 화살표·응답 대기, 비동기 — 실선 열린 화살표, 반환 — 점선). 조건·반복은 결합 프래그먼트(alt·opt·loop). 하나의 유스케이스 시나리오의 시간순 상호작용 표현. 커뮤니케이션 다이어그램(같은 정보를 공간·번호로)과 상호 변환 가능.",
      map: [
        { as: "시간 흐름 위→아래", real: "생명선", note: "" },
        { as: "실행 중 구간", real: "활성화 바", note: "" },
        { as: "동기/비동기 호출", real: "메시지", note: "" },
        { as: "조건·반복", real: "결합 프래그먼트", note: "alt·loop" },
      ],
      usage: "시나리오 상호작용 설계입니다. 시험은 생명선·메시지, 동기/비동기, 커뮤니케이션과의 차이입니다.",
      links: [
        { topic: "UML (정적, 동적 다이어그램)", how: "동적 다이어그램의 하나입니다." },
        { topic: "유즈케이스 다이어그램", how: "유스케이스 시나리오를 시퀀스로 상세화합니다." },
      ],
      exam: "시퀀스 다이어그램은 객체들의 시간순 메시지 교환을 생명선·활성화·동기/비동기 메시지로 그린 상호작용 다이어그램으로, alt·loop 프래그먼트로 조건·반복을 표현한다.",
    }, image: "/concept/book/sequence-diagram.png", easy: "시퀀스 다이어그램은 객체들이 시간 순서대로 메시지를 주고받는 상호작용을 표현하는 동적 다이어그램입니다. 위에 객체들이 나란히 서고, 아래로 시간이 흐르며(생명선), 활동 중인 구간은 막대(제어사각형)로 표시합니다. 구성 요소는 액터·활성 객체·생명선·제어사각형·메시지·프레임·연산자입니다. 메시지 화살표 구분이 포인트 — 채운 화살표는 동기(응답 올 때까지 기다림), 열린 화살표는 비동기(안 기다림), 점선은 응답. UML 2.0부터는 프레임(sd 이름)으로 감싸고 loop(반복)·opt(조건)·par(병렬) 연산자로 제어 구조를 표현합니다. 클래스 다이어그램이 '정적 구조'라면 시퀀스는 '시간 축의 동적 메시지 흐름'이라는 대비, 그리고 동기·비동기 화살표 모양 구분이 시험 포인트입니다." },
"se-94": {
    guide: {
      hook: "여러 상호작용(시퀀스)을 '흐름으로 엮어' 전체 제어 흐름을 보여 주는 다이어그램입니다.",
      scene: "복잡한 시나리오는 여러 시퀀스로 나뉩니다. 상호작용 개요 다이어그램은 활동 다이어그램의 흐름 위에 각 시퀀스(상호작용)를 노드로 배치해, '언제 어떤 상호작용이 일어나는지' 전체를 조망합니다.",
      why: "'활동 다이어그램 + 시퀀스의 결합'이라는 위치가 출제 포인트입니다. UML 상호작용 다이어그램 4종 중 하나입니다.",
      mechanism: "활동 다이어그램의 제어 흐름 표기(시작·종료·분기·병합·분할·조인)를 뼈대로, 각 노드에 상호작용(시퀀스 다이어그램 전체 또는 참조 InteractionUse)을 배치. 여러 상호작용의 실행 순서·조건·반복·병렬을 한눈에. 상호작용 다이어그램 4종(시퀀스·커뮤니케이션·타이밍·상호작용 개요) 중 고수준 조망용. 복잡한 시나리오의 상위 흐름 표현.",
      map: [
        { as: "흐름 뼈대(활동)", real: "제어 흐름 표기", note: "분기·병합" },
        { as: "각 노드=시퀀스", real: "상호작용 배치", note: "" },
        { as: "실행 순서 조망", real: "전체 흐름", note: "" },
        { as: "상호작용 4종 중 하나", real: "고수준 조망", note: "" },
      ],
      usage: "복잡 시나리오 상위 흐름입니다. 시험은 활동+시퀀스 결합, 상호작용 다이어그램 4종입니다.",
      links: [
        { topic: "시퀀스 다이어그램 (Sequence Diagram)", how: "노드에 배치되는 상호작용입니다." },
        { topic: "UML (정적, 동적 다이어그램)", how: "상호작용 다이어그램의 하나입니다." },
      ],
      exam: "상호작용 개요 다이어그램은 활동 다이어그램의 제어 흐름 위에 여러 시퀀스(상호작용)를 노드로 배치해, 복잡한 시나리오의 상호작용 실행 순서·조건을 고수준으로 조망한다.",
    }, image: "/concept/book/se-94.png", easy: "인터랙션 오버뷰 다이어그램은 액티비티 다이어그램의 큰 제어 흐름 안에, 상세가 필요한 부분만 시퀀스 다이어그램을 끼워 넣은 UML 혼합 다이어그램입니다. 출입문 통제로 보면 — 전체 흐름(코드 입력 → OK면 문 열림 / 아니면 종료)은 액티비티의 분기·판단으로 그리고, '코드를 입력하고 검증하는' 세부 객체 간 메시지 교환만 시퀀스 프레임(sd)으로 박아 넣습니다. 큰 그림(흐름)과 세부(상호작용)를 한 장에 담아, 여러 시퀀스 다이어그램이 어떤 순서·조건으로 이어지는지 한눈에 조망할 수 있습니다. UML 2.0의 상호작용 다이어그램 4종(시퀀스·커뮤니케이션·타이밍·인터랙션 오버뷰) 중 하나라는 분류와, '액티비티 + 시퀀스의 결합'이라는 한 줄 정의가 시험 포인트입니다." },
"msa": {
    guide: {
      hook: "하나의 큰 앱을 '독립적으로 배포되는 작은 서비스들'로 쪼갠 아키텍처입니다.",
      scene: "거대한 단일 앱(모놀리식)은 일부만 고쳐도 전체를 재배포해야 하고 확장도 통째로입니다. MSA는 기능별로 독립 서비스로 쪼개, 각각 따로 개발·배포·확장하고 다른 기술도 쓸 수 있게 합니다.",
      why: "'모놀리식 vs MSA'의 트레이드오프와 구성요소(API Gateway·서비스 디스커버리·분산 트랜잭션)가 출제 핵심입니다.",
      mechanism: "특징: 서비스별 독립 개발·배포·확장, 서비스마다 자체 DB(Database per Service), 경량 통신(REST·gRPC·메시지), 기술 다양성. 구성: API Gateway(단일 진입·라우팅), 서비스 디스커버리(위치 탐색), 로드밸런싱, 서킷 브레이커(장애 격리), 분산 트랜잭션(Saga), 관측성(로그·추적). 장점: 확장·배포·장애 격리·팀 자율. 단점: 분산 복잡성·네트워크·데이터 일관성·운영 부담. DDD로 서비스 경계 설정.",
      map: [
        { as: "기능별 독립 서비스", real: "MSA", note: "" },
        { as: "서비스마다 DB", real: "Database per Service", note: "" },
        { as: "단일 진입·라우팅", real: "API Gateway", note: "" },
        { as: "분산 복잡성", real: "단점", note: "일관성·운영" },
      ],
      usage: "대규모·확장 서비스 아키텍처입니다. 시험은 모놀리식과의 비교, 구성요소, Saga·DDD와의 관계입니다.",
      links: [
        { topic: "API Gateway", how: "MSA의 단일 진입점입니다." },
        { topic: "SAGA패턴", how: "MSA의 분산 트랜잭션 처리입니다." },
      ],
      exam: "MSA는 앱을 독립 배포되는 작은 서비스로 쪼개 서비스별 DB·경량 통신으로 구성하는 아키텍처로, 확장·장애 격리가 장점이나 분산 복잡성·데이터 일관성이 단점이다.",
    }, image: "/concept/book/msa.png", easy: "큰 애플리케이션 하나를 작은 서비스 여러 개로 쪼개고, 각자 따로 배포·확장할 수 있게 만든 아키텍처입니다. 계층은 4개 — 클라이언트(웹/모바일) → API Gateway(관문) → 마이크로서비스들(주문·결제·재고, 언어도 제각각 가능=Polyglot) → 서비스마다 자기 DB. 핵심 성질은 '서비스마다 DB가 따로'라는 것인데, 그래서 트랜잭션 문제(SAGA)와 관문 문제(API Gateway)가 따라 나옵니다. 이 셋(MSA·API Gateway·SAGA)은 한 세트로 외우세요." },
"se-70": {
    guide: {
      hook: "MSA에서 '모든 요청의 단일 진입점' 역할을 하는 게이트웨이입니다.",
      scene: "수십 개 서비스에 클라이언트가 직접 접속하면 혼란입니다. API Gateway가 모든 요청을 한 곳에서 받아 인증·라우팅·집계해 각 서비스로 보내고, 공통 관심사(인증·로깅·속도제한)를 한 곳에서 처리합니다.",
      why: "'단일 진입점·공통 관심사 처리'와 기능(라우팅·인증·집계)이 출제 핵심입니다. BFF 패턴이 포인트입니다.",
      mechanism: "기능: 라우팅(요청을 적절한 서비스로), 인증·인가(중앙 처리), 속도 제한(rate limiting)·스로틀링, 로드밸런싱, 요청 집계(여러 서비스 응답 합침), 프로토콜 변환, 캐싱, 로깅·모니터링. 패턴: BFF(Backend for Frontend — 클라이언트 유형별 게이트웨이). 장점: 클라이언트 단순화·공통 기능 중앙화·서비스 은닉. 주의: 단일 실패점(이중화 필요)·병목. Kong·Spring Cloud Gateway·AWS API Gateway.",
      map: [
        { as: "모든 요청 단일 진입", real: "게이트웨이", note: "" },
        { as: "적절한 서비스로", real: "라우팅", note: "" },
        { as: "인증·속도제한 중앙", real: "공통 관심사", note: "" },
        { as: "클라이언트별 게이트웨이", real: "BFF", note: "" },
      ],
      usage: "MSA 진입점·공통 처리입니다. 시험은 기능, BFF, 단일 실패점 주의입니다.",
      links: [
        { topic: "MSA (Micro Service Architecture)", how: "MSA의 핵심 구성요소입니다." },
        { topic: "SASE(Secure Access Service Edge)", how: "게이트웨이·엣지 개념을 공유합니다." },
      ],
      exam: "API Gateway는 MSA에서 모든 요청의 단일 진입점으로 라우팅·인증·속도제한·집계 등 공통 관심사를 중앙 처리하며, BFF 패턴으로 클라이언트별 최적화하되 단일 실패점에 유의한다.",
    }, image: "/concept/book/se-70.png", easy: "마이크로서비스 수십 개의 주소를 클라이언트가 다 알 수는 없으니, 입구를 하나로 모은 관문입니다. 하는 일 세 갈래 — 보안(인증·인가 Token, SSL 암호화, 로깅), 라우팅(어느 서비스로 보낼지 매칭, 로드밸런싱), 변환(클라이언트의 HTTP/JSON 요청을 내부 서비스가 처리 가능한 프로토콜로). 부가로 서비스 디스커버리(동적 IP·포트 관리)와 오케스트레이션(여러 서비스 묶어 신규 서비스)도 합니다. 호텔 프런트를 떠올리면 됩니다 — 손님은 프런트만 알면 되고, 몇 호실에 누가 있는지는 프런트가 압니다." },
"saga-pattern": {
    guide: {
      hook: "MSA에서 '여러 서비스에 걸친 트랜잭션'을 보상으로 관리하는 패턴입니다.",
      scene: "주문이 결제·재고·배송 서비스에 걸쳐 있는데 각각 DB가 달라 2PC를 쓰기 어렵습니다. Saga는 각 서비스의 로컬 트랜잭션을 순차 실행하고, 중간에 실패하면 앞서 완료한 것을 '보상 트랜잭션'으로 되돌립니다.",
      why: "'분산 트랜잭션의 최종 일관성'과 두 방식(코레오그래피·오케스트레이션), 보상 트랜잭션이 출제 핵심입니다. 2PC와의 차이가 포인트입니다.",
      mechanism: "각 서비스의 로컬 트랜잭션을 연쇄 실행, 실패 시 이전 트랜잭션들을 보상(Compensating) 트랜잭션으로 롤백(취소 작업). 방식: 코레오그래피(Choreography — 각 서비스가 이벤트를 발행·구독해 자율 진행, 결합↓·추적 어려움), 오케스트레이션(Orchestration — 중앙 오케스트레이터가 명령·조정, 제어 명확·중앙 의존). 최종 일관성(Eventual Consistency, 강한 일관성 포기). 2PC(블로킹·강일관)와 달리 논블로킹·확장. 멱등성·타임아웃 관리.",
      map: [
        { as: "로컬 트랜잭션 연쇄", real: "Saga", note: "" },
        { as: "실패 시 되돌리기", real: "보상 트랜잭션", note: "핵심" },
        { as: "이벤트로 자율", real: "코레오그래피", note: "" },
        { as: "중앙 조정", real: "오케스트레이션", note: "" },
      ],
      usage: "MSA 분산 트랜잭션입니다. 시험은 보상 트랜잭션, 코레오/오케스트레이션, 2PC와의 차이입니다.",
      links: [
        { topic: "MSA (Micro Service Architecture)", how: "MSA의 데이터 일관성 해법입니다." },
        { topic: "2PC", how: "강일관 분산 트랜잭션과 대비됩니다." },
      ],
      exam: "SAGA 패턴은 MSA에서 각 서비스의 로컬 트랜잭션을 연쇄 실행하고 실패 시 보상 트랜잭션으로 되돌려 최종 일관성을 확보하며, 코레오그래피·오케스트레이션 방식이 있다.",
    }, image: "/concept/book/saga-pattern.png", easy: "SAGA는 MSA에서 서비스별 로컬 트랜잭션을 순차 실행하다가 중간에 실패하면, 앞서 성공한 서비스들에 보상 이벤트를 보내 되돌림으로써 전체 일관성을 지키는 분산 트랜잭션 패턴입니다. 서비스마다 DB가 따로라 '주문-결제-재고'를 한 트랜잭션으로 묶을 수 없기 때문입니다. 방식이 둘 — Choreography(지휘자 없음): 각 서비스가 이벤트를 Kafka 같은 메시지 큐로 전파하며 릴레이. 단순하지만 흐름 추적이 어려움. Orchestration(지휘자 있음): SAGA Manager 인스턴스가 중앙에서 트랜잭션을 요청·완료 수신. 흐름이 명확하지만 매니저가 단일 장애점이 될 수 있음." },
"ddd": {
    guide: {
      hook: "'복잡한 업무 도메인을 중심으로' 소프트웨어를 설계하는 방법론입니다.",
      scene: "기술이 아니라 업무(도메인)가 복잡한 시스템은, 도메인 전문가와 개발자가 같은 언어로 도메인을 모델링해야 합니다. DDD는 업무를 경계(Bounded Context)로 나누고 도메인 모델을 코드에 반영해 복잡성을 다스립니다.",
      why: "전략적 설계(Bounded Context·유비쿼터스 언어)와 전술적 설계(엔티티·값 객체·애그리거트)가 출제 핵심입니다. MSA 경계 설정과 연결됩니다.",
      mechanism: "전략적 설계: 유비쿼터스 언어(전문가-개발자 공통 언어), 바운디드 컨텍스트(모델이 일관된 경계 — MSA 서비스 경계와 대응), 컨텍스트 맵(컨텍스트 간 관계). 전술적 설계: 엔티티(식별자 있음), 값 객체(값으로 동등·불변), 애그리거트(일관성 경계·루트를 통해 접근), 리포지토리(영속성), 도메인 서비스, 도메인 이벤트. 핵심 도메인 집중. 마이크로서비스 경계 설정의 근거.",
      map: [
        { as: "전문가-개발자 공통어", real: "유비쿼터스 언어", note: "" },
        { as: "일관된 모델 경계", real: "바운디드 컨텍스트", note: "MSA 경계" },
        { as: "일관성 경계", real: "애그리거트", note: "루트 접근" },
        { as: "식별자 vs 값", real: "엔티티/값 객체", note: "" },
      ],
      usage: "복잡 도메인 설계·MSA 경계입니다. 시험은 전략/전술 설계, 바운디드 컨텍스트, MSA와의 관계입니다.",
      links: [
        { topic: "MSA (Micro Service Architecture)", how: "바운디드 컨텍스트로 서비스 경계를 정합니다." },
        { topic: "Clean Architecture", how: "도메인 중심 설계를 공유합니다." },
      ],
      exam: "DDD는 도메인을 중심으로 설계하는 방법론으로, 전략적 설계(유비쿼터스 언어·바운디드 컨텍스트)와 전술적 설계(엔티티·값 객체·애그리거트)로 복잡성을 다스리며 MSA 경계의 근거가 된다.",
    }, image: "/concept/book/ddd.png", easy: "개발자와 현업이 같은 말(유비쿼터스 언어)을 쓰면서, 업무(도메인) 중심으로 설계하는 방법입니다. 두 단계 — 전략적 설계(분석): 업무를 바운디드 컨텍스트(제한된 경계)로 자르고 컨텍스트 맵을 그려 마이크로서비스를 도출. 전술적 설계(설계): 그 안을 Entity(ID 있는 객체)·Value Object(값만 있는 객체)·Aggregate(엔티티+값 객체 묶음)·Repository(저장 관리)·Factory(생성 캡슐화)·Domain Event(변경 전파)로 구현. MSA에서 '서비스를 어떻게 자를 것인가'의 답이 DDD의 바운디드 컨텍스트입니다." },
"eda": {
    guide: {
      hook: "구성요소가 '이벤트를 발행·구독'하며 느슨하게 연결되는 아키텍처입니다.",
      scene: "주문이 완료되면 '주문완료' 이벤트를 발행하고, 배송·알림·정산 서비스가 각자 그 이벤트를 구독해 반응합니다. 발행자는 누가 듣는지 몰라도 되니 서비스가 독립적으로 확장·추가됩니다.",
      why: "'이벤트 발행-구독·느슨한 결합'과 패턴(Pub-Sub·이벤트 소싱·CQRS)이 출제 핵심입니다. MSA와의 결합이 포인트입니다.",
      mechanism: "구성: 이벤트 생산자(Producer)·이벤트 채널(브로커 — 카프카·메시지 큐)·소비자(Consumer). 패턴: 발행-구독(Pub-Sub), 이벤트 스트리밍, 이벤트 소싱(Event Sourcing — 상태 변경을 이벤트로 저장·재생), CQRS(명령/조회 책임 분리). 장점: 느슨한 결합·확장·비동기·실시간 반응. 단점: 최종 일관성·이벤트 순서·디버깅 어려움·이벤트 스키마 관리. MSA의 서비스 간 통신 방식으로 자주 결합.",
      map: [
        { as: "이벤트 발행", real: "생산자(Producer)", note: "" },
        { as: "이벤트 구독·반응", real: "소비자(Consumer)", note: "" },
        { as: "누가 듣는지 몰라도 됨", real: "느슨한 결합", note: "핵심" },
        { as: "상태를 이벤트로 저장", real: "이벤트 소싱", note: "" },
      ],
      usage: "실시간·확장 시스템·MSA입니다. 시험은 Pub-Sub, 이벤트 소싱·CQRS, MSA와의 결합입니다.",
      links: [
        { topic: "아파치 카프카(Apache Kafka)", how: "이벤트 채널·스트리밍의 대표 도구입니다." },
        { topic: "MSA (Micro Service Architecture)", how: "서비스 간 통신 방식으로 결합됩니다." },
      ],
      exam: "이벤트 기반 아키텍처(EDA)는 생산자가 이벤트를 발행하고 소비자가 구독·반응하는 느슨한 결합 구조로, Pub-Sub·이벤트 소싱·CQRS 패턴을 쓰며 MSA와 자주 결합한다.",
    }, image: "/concept/book/eda.png", easy: "'무슨 일이 생기면(이벤트) 그에 반응해서 움직이는' 아키텍처입니다. 주문 완료라는 이벤트가 발생하면 재고 서비스도, 배송 서비스도, 알림 서비스도 각자 받아서 자기 일을 합니다. 구성은 4단계 — 이벤트 프로듀서(감지해서 메시지로 발행) → 이벤트 채널(큐에 쌓아 비동기 전달) → 이벤트 처리 엔진(식별하고 비즈니스 로직 실행) → 다운스트림 활동(알림·경고 표시). 보내는 쪽은 누가 받는지 모르고, 받는 쪽은 구독만 하면 되니 확장성과 병렬 처리에 강합니다." },
"design-pattern": {
    guide: {
      hook: "'자주 쓰는 설계 문제의 검증된 해법'을 카탈로그로 정리한 것 — GoF 23패턴입니다.",
      scene: "같은 설계 문제를 매번 새로 풀지 않고, 선배들이 정리한 검증된 해법을 씁니다. 객체 생성·구조 조립·행위 분배의 전형적 문제에 대한 재사용 가능한 설계 템플릿입니다.",
      why: "GoF 3분류(생성·구조·행위)와 대표 패턴이 출제 핵심입니다. 각 패턴의 목적이 포인트입니다.",
      mechanism: "GoF 23패턴 3분류: 생성(Creational — 객체 생성 유연화: 싱글턴, 팩토리 메서드, 추상 팩토리, 빌더, 프로토타입), 구조(Structural — 객체 조립: 어댑터, 데코레이터, 프록시, 퍼사드, 컴포지트, 브리지, 플라이웨이트), 행위(Behavioral — 책임·알고리즘 분배: 옵서버, 전략, 커맨드, 상태, 템플릿 메서드, 반복자, 책임 연쇄, 방문자 등). 목적: 재사용·유연성·소통(공통 어휘). SOLID·다형성 기반. 안티패턴과 대비.",
      map: [
        { as: "객체 생성 유연화", real: "생성 패턴", note: "싱글턴·팩토리" },
        { as: "객체 조립", real: "구조 패턴", note: "어댑터·프록시" },
        { as: "책임·알고리즘 분배", real: "행위 패턴", note: "옵서버·전략" },
        { as: "공통 어휘·재사용", real: "목적", note: "" },
      ],
      usage: "객체지향 설계·소통입니다. 시험은 3분류, 대표 패턴 목적, SOLID와의 관계입니다.",
      links: [
        { topic: "싱글턴 패턴 (Singleton pattern)", how: "대표적 생성 패턴입니다." },
        { topic: "객체지향 설계 원리", how: "패턴이 SOLID를 구현합니다." },
      ],
      exam: "디자인 패턴은 자주 쓰는 설계 문제의 검증된 해법으로 GoF 23패턴이 생성(싱글턴·팩토리)·구조(어댑터·프록시)·행위(옵서버·전략)로 분류되며, 재사용·소통·유연성을 제공한다.",
    }, image: "/concept/book/design-pattern.png", easy: "자주 나오는 설계 문제의 모범답안 23개를 이름 붙여 정리한 것입니다. 분류는 [생구행] — 생성 패턴(객체를 어떻게 만들까): 아·베·프로·시·파(Abstract Factory·Builder·Prototype·Singleton·Factory Method). 구조 패턴(객체를 어떻게 조립할까): A·B·C·D·파·플·로(Adapter·Bridge·Composite·Decorator·Facade·Flyweight·Proxy). 행위 패턴(객체끼리 어떻게 협력할까): CCMMISSOTIV(Chain of Responsibility·Command·Mediator·Memento·Iterator·State·Strategy·Observer·Template Method·Interpreter·Visitor). 패턴 문서 형식은 이름–문제–해법–결과 4요소입니다." },
"singleton": {
    guide: {
      hook: "'인스턴스가 딱 하나만 존재'하도록 보장하는 생성 패턴입니다.",
      scene: "설정 관리자·연결 풀·로거는 앱 전체에 하나만 있어야 합니다. 싱글턴은 생성자를 막고 유일한 인스턴스를 클래스가 관리해, 어디서 호출해도 같은 하나를 반환합니다.",
      why: "'유일 인스턴스·전역 접근'과 멀티스레드 안전(지연 초기화)·안티패턴 논란이 출제 핵심입니다.",
      mechanism: "구현: private 생성자(외부 생성 차단) + static 인스턴스 + getInstance()(유일 인스턴스 반환). 지연 초기화(Lazy)와 이른 초기화(Eager). 멀티스레드 문제: 지연 초기화 시 동시 접근으로 중복 생성 → 동기화(synchronized)·DCL(Double-Checked Locking)·Holder(정적 내부 클래스)·enum. 단점: 전역 상태(결합↑·테스트 어려움·숨은 의존성) → 안티패턴 비판, DI로 대체 권장. 사용: 로거·설정·캐시·연결 풀.",
      map: [
        { as: "인스턴스 하나만", real: "유일 인스턴스", note: "" },
        { as: "생성자 막기", real: "private 생성자", note: "" },
        { as: "동시 접근 중복 생성", real: "멀티스레드 문제", note: "DCL·Holder" },
        { as: "전역 상태 비판", real: "안티패턴 논란", note: "DI 대체" },
      ],
      usage: "설정·로거·연결 풀입니다. 시험은 구현, 멀티스레드 안전, 안티패턴 논란입니다.",
      links: [
        { topic: "디자인 패턴 (Design Pattern)", how: "대표적 생성 패턴입니다." },
        { topic: "객체지향 설계 원리", how: "전역 상태가 DIP와 상충합니다." },
      ],
      exam: "싱글턴 패턴은 인스턴스를 하나만 보장하고 전역 접근점을 제공하는 생성 패턴으로, 멀티스레드에서 DCL·Holder로 안전하게 구현하나 전역 상태로 안티패턴 비판을 받는다.",
    }, image: "/concept/book/singleton.png", easy: "인스턴스를 딱 하나만 만들고 어디서든 그 하나를 쓰게 하는 생성 패턴입니다. 프린터 스풀러나 설정 관리자처럼 '전체에서 하나여야' 하는 것에 씁니다. 구현 3요소 — ① 생성자를 private으로(밖에서 new 금지) ② static 변수에 유일한 인스턴스 보관 ③ public static getInstance()로만 접근. 구현 방식은 Lazy(첫 호출 때 생성), Eager(클래스 로딩 때 즉시), Double-Checked Locking(멀티스레드 안전), Enum(자바에서 가장 안전) 네 가지입니다." },
"view-4plus1": {
    guide: {
      hook: "아키텍처를 '5가지 관점'으로 나눠 이해관계자별로 보여 주는 뷰 모델입니다.",
      scene: "한 그림으로 모든 관심사를 담을 수 없습니다. 4+1 뷰는 논리·프로세스·개발·배치 4뷰로 나누고, 유스케이스(시나리오)로 이들을 엮어 검증합니다. 각 뷰가 다른 이해관계자의 관심사를 답합니다.",
      why: "5뷰(논리·프로세스·개발·물리·시나리오)와 각 뷰의 관심사·다이어그램이 출제 핵심입니다. 42010의 구현입니다.",
      mechanism: "4+1 뷰(크루첸): 논리 뷰(Logical — 기능·객체 구조, 클래스·시퀀스, 최종 사용자 관심), 프로세스 뷰(Process — 동시성·성능·프로세스, 액티비티, 통합자 관심), 개발 뷰(Development/Implementation — 모듈·컴포넌트 구조, 컴포넌트, 개발자 관심), 물리 뷰(Physical/Deployment — 하드웨어 배치, 배치 다이어그램, 시스템 엔지니어 관심), +1 시나리오(Use Case — 나머지 4뷰를 엮고 검증). 각 뷰가 특정 이해관계자·관심사·다이어그램에 대응. 42010의 대표 구현.",
      map: [
        { as: "기능·객체 구조", real: "논리 뷰", note: "사용자" },
        { as: "동시성·성능", real: "프로세스 뷰", note: "통합자" },
        { as: "모듈 구조", real: "개발 뷰", note: "개발자" },
        { as: "4뷰 엮어 검증", real: "+1 시나리오", note: "유스케이스" },
      ],
      usage: "아키텍처 문서화입니다. 시험은 5뷰·관심사·다이어그램, 42010과의 관계입니다.",
      links: [
        { topic: "ISO/IEC/IEEE 42010:2022", how: "4+1 뷰가 42010의 구현입니다." },
        { topic: "UML (정적, 동적 다이어그램)", how: "각 뷰를 UML로 표현합니다." },
      ],
      exam: "4+1 뷰 모델은 논리·프로세스·개발·물리 4뷰를 시나리오(유스케이스)로 엮어 이해관계자별 관심사를 표현하는 아키텍처 뷰 모델로, ISO 42010의 대표 구현이다.",
    }, image: "/concept/book/view-4plus1.png", easy: "4+1 View 모델은 소프트웨어 아키텍처를 이해관계자별 관점 4개와 이를 묶는 유즈케이스 뷰로 나눠 기술하는 모델입니다. 한 장으로 그리면 이해관계자마다 보고 싶은 게 달라 싸움이 나기 때문입니다 — Logical View(설계자: 클래스 구조), Implementation View(개발자: 소스·모듈), Process View(통합자: 스레드·프로세스 동작), Deployment View(엔지니어: 어느 하드웨어에 배치). 그리고 가운데 +1이 Use Case View(사용자: 기능 시나리오)로, 네 뷰를 하나로 묶는 기준이 됩니다." },
"mvvm": {
    guide: {
      hook: "UI(View)와 로직(Model)을 'ViewModel과 데이터 바인딩'으로 분리하는 패턴입니다.",
      scene: "UI 코드에 비즈니스 로직이 섞이면 테스트·유지보수가 어렵습니다. MVVM은 View(화면)와 Model(데이터) 사이에 ViewModel을 두고, View와 ViewModel을 데이터 바인딩으로 자동 연결해 UI 로직을 분리합니다.",
      why: "3요소(Model·View·ViewModel)와 데이터 바인딩, MVC/MVP와의 차이가 출제 핵심입니다.",
      mechanism: "Model(데이터·비즈니스 로직), View(UI, 수동적), ViewModel(View의 상태·명령을 노출, View 로직 담당). 핵심: 데이터 바인딩(View↔ViewModel 자동 동기화 — ViewModel 값 변경 시 View 자동 갱신, 양방향). View는 ViewModel을 참조하지만 ViewModel은 View를 모름(테스트 용이). MVC(Controller가 View·Model 중개)·MVP(Presenter가 View 직접 조작)와 대비 — MVVM은 바인딩으로 결합↓. WPF·Angular·Vue·안드로이드 등.",
      map: [
        { as: "데이터·로직", real: "Model", note: "" },
        { as: "수동적 UI", real: "View", note: "" },
        { as: "View 상태·명령", real: "ViewModel", note: "" },
        { as: "자동 동기화", real: "데이터 바인딩", note: "핵심" },
      ],
      usage: "UI 아키텍처(프론트엔드)입니다. 시험은 3요소·데이터 바인딩, MVC/MVP와의 차이입니다.",
      links: [
        { topic: "디자인 패턴 (Design Pattern)", how: "옵서버 패턴 기반 바인딩입니다." },
        { topic: "Clean Architecture", how: "UI와 로직 분리를 공유합니다." },
      ],
      exam: "MVVM은 Model·View·ViewModel로 UI를 분리하고 View와 ViewModel을 데이터 바인딩으로 자동 동기화하는 패턴으로, ViewModel이 View를 몰라 테스트가 용이하다.",
    }, image: "/concept/book/mvvm.png", easy: "화면(View)과 데이터(Model) 사이에 View Model을 두고, View와 View Model을 Data Binding으로 자동 동기화하는 패턴입니다. 흐름은 — 사용자 Action이 View로 들어오면 → Command로 View Model에 전달 → View Model이 Model에 데이터 요청·응답받아 가공 → Data Binding이 알아서 화면 갱신. 핵심 이득은 View와 View Model이 서로를 직접 모른다는 것(독립) — 그래서 화면 없이도 View Model을 테스트할 수 있습니다. View:ViewModel = n:1 입니다." },
"os-2": {
    image: "/concept/book/os-2.webp",
    guide: {
      hook: "컴퓨터의 자원을 누구에게 얼마나 줄지 정하는, 운영체제의 알맹이입니다.",
      scene:
        "큰 도서관에 사서가 한 명 있습니다. 손님(프로그램)은 책을 직접 서고에서 꺼낼 수 없고, 반드시 사서에게 부탁해야 합니다. 사서는 누가 먼저 왔는지, 자리가 몇 개 남았는지, 복사기를 지금 누가 쓰는지를 전부 관리합니다. 이 사서가 커널입니다.",
      why:
        "손님이 서고에 직접 들어가면 어떻게 될까요. 남의 책을 가져가고, 자리를 다 차지하고, 책을 망가뜨려도 아무도 못 막습니다. 커널이 없으면 프로그램 하나가 컴퓨터 전체를 망가뜨릴 수 있습니다. 그래서 중간에 반드시 사서를 세워 둡니다.",
      mechanism:
        "부팅하면 커널이 가장 먼저 메모리에 올라와 끝까지 상주합니다. 카카오톡을 클릭하면 — 커널이 프로세스를 만들고(메모리 할당·PCB 생성), 실행 순서를 정해 주고(스케줄링), 카톡이 '파일 저장해줘'라고 시스템 호출을 하면 잠깐 커널 모드로 전환해 디스크에 대신 써 주고 돌아옵니다. 앱이 죽어도 커널이 살아 있으면 나머지는 무사합니다.",
      map: [
        { as: "사서", real: "커널(Kernel)", note: "하드웨어와 프로그램 사이에서 자원을 나눠 주는 프로그램" },
        { as: "사서가 하는 일 6가지", real: "프로세스·메모리·I/O장치·IPC·네트워크·파일시스템 관리", note: "커널의 6대 기능. '누가 일하나·어디 놓나·기계 쓰기·서로 대화·밖과 연결·저장'으로 외우면 됩니다" },
        { as: "손님이 사서를 부르는 행위", real: "시스템 호출(system call)", note: "프로그램이 커널 기능을 쓰고 싶을 때 쓰는 유일한 통로" },
        { as: "손님 구역 / 사서 구역", real: "사용자 모드 / 커널 모드", note: "권한이 다른 두 구역. 시스템 호출을 하면 잠깐 사서 구역으로 넘어갑니다" },
        { as: "사서 혼자 다 함 / 조수에게 나눠 줌", real: "모놀리딕 커널 / 마이크로 커널", note: "혼자 하면 빠르지만 사서가 쓰러지면 끝, 나눠 주면 안전하지만 말 전달에 시간이 듭니다" },
      ],
      usage:
        "윈도우의 NT 커널, 안드로이드·리눅스의 리눅스 커널, 아이폰의 XNU가 전부 이것입니다. 앱 하나가 뻗어도 PC 전체가 안 죽는 것, 작업 관리자로 강제 종료가 되는 것이 커널의 자원 격리·회수 덕분입니다. 시험은 6대 기능 나열과 모놀리딕(리눅스) vs 마이크로(QNX) 비교표로 나옵니다.",
      links: [
        { topic: "CPU Ring Level", how: "'손님 구역·사서 구역'을 CPU가 어떻게 실제로 갈라 놓는지가 Ring Level입니다. 커널 모드=Ring 0, 사용자 모드=Ring 3." },
        { topic: "프로세스 상태 전이도", how: "사서가 관리하는 '손님 명단'이 프로세스이고, 그 손님이 대기 중인지 이용 중인지가 상태 전이도입니다." },
        { topic: "인터럽트", how: "손님이 사서를 부르는 게 시스템 호출, 화재경보가 울려 사서가 하던 일을 멈추는 게 인터럽트입니다." },
      ],
      exam:
        "커널은 하드웨어와 응용 프로그램 사이에서 프로세스·메모리·I/O·IPC·네트워크·파일시스템을 관리하는 운영체제의 핵심으로, 응용은 시스템 호출을 통해서만 커널 모드에 진입한다.",
    },
  },
"cpu-ring-level": {
    image: "/concept/book/cpu-ring-level.webp",
    guide: {
      hook: "'이 코드에 어디까지 허락할까'를 CPU가 등급으로 관리하는 구조입니다.",
      scene:
        "회사 건물에 출입증 등급이 있습니다. 사장실·서버실이 있는 맨 안쪽 층은 0등급 카드만 열리고, 방문객은 3등급 카드로 로비만 다닐 수 있습니다. 방문객이 서버실 물건이 필요하면 직접 못 들어가고 안내 데스크에 요청해야 합니다. CPU도 똑같이 동심원 등급을 갖고 있습니다.",
      why:
        "게임이나 브라우저가 하드웨어를 직접 만질 수 있다면, 버그 하나로 컴퓨터가 통째로 멈춥니다. 등급을 나눠 두면 프로그램이 잘못돼도 자기 구역에서만 죽고 시스템은 살아남습니다.",
      mechanism:
        "CPU에는 현재 권한 레벨을 담는 비트가 있고, 명령마다 '이 레벨에서 실행 가능한가'를 하드웨어가 검사합니다. 브라우저(Ring 3)가 디스크에 직접 쓰는 명령을 내리면 CPU가 즉시 예외를 걸어 차단하고, 반드시 시스템 콜 명령을 거쳐야 Ring 0 코드로 진입합니다. 끝나면 자동으로 Ring 3로 복귀합니다.",
      map: [
        { as: "0등급 카드 (사장실·서버실)", real: "Ring 0 = 커널 모드", note: "권한이 가장 셈. 하드웨어를 직접 제어할 수 있습니다" },
        { as: "3등급 카드 (로비)", real: "Ring 3 = 사용자 모드", note: "브라우저·게임·워드 같은 응용 프로그램이 사는 곳" },
        { as: "안 쓰는 중간 등급", real: "Ring 1·2", note: "설계상 있지만 요즘 운영체제는 거의 0과 3만 씁니다" },
        { as: "안내 데스크에 요청", real: "시스템 호출", note: "Ring 3 → Ring 0 으로 잠깐 올라갔다가, 일이 끝나면 다시 내려옵니다" },
      ],
      usage:
        "인텔·AMD CPU가 실제 이 구조입니다. 백신·게임 안티치트가 '커널 드라이버(Ring 0)'로 설치되는 이유, 악성코드가 Ring 0을 노리는 루트킷, 가상화(VMware)의 하이퍼바이저를 Ring -1로 부르는 확장까지 이 개념 위에 있습니다. 시험은 커널/사용자 모드 전환 과정 서술로 나옵니다.",
      links: [
        { topic: "커널(Kernel)", how: "Ring 0 에서 도는 것이 바로 커널입니다. 커널의 '사용자 모드/커널 모드'를 하드웨어로 구현한 것이 Ring Level." },
        { topic: "인터럽트", how: "인터럽트가 걸리면 CPU가 자동으로 Ring 0 으로 올라가 처리 루틴을 실행합니다." },
      ],
      exam:
        "CPU Ring Level은 실행 권한을 동심원 등급으로 나눈 보호 구조로, Ring 0(커널 모드)와 Ring 3(사용자 모드)를 분리하고 시스템 호출로만 넘나들게 하여 응용 프로그램의 오류가 시스템 전체로 번지는 것을 막는다.",
    },
  },
"ca-51": {
    image: "/concept/book/ca-51.webp",
    guide: {
      hook: "빠른 저장장치는 비싸고 작아서, 계단처럼 쌓아 씁니다.",
      scene:
        "책상에서 공부한다고 생각해 보세요. 지금 쓰는 펜은 손에 쥐고 있고(레지스터), 자주 보는 책은 책상 위에 두고(캐시), 이번 학기 교재는 책장에 꽂아 두고(주기억장치), 작년 자료는 창고에 넣어 둡니다(보조기억장치). 손에서 멀어질수록 꺼내는 데 오래 걸리지만, 대신 훨씬 많이 넣을 수 있습니다.",
      why:
        "가장 빠른 메모리로 전부 채우면 되지 않냐고요? 너무 비쌉니다. 반대로 다 싸구려로 채우면 느려서 못 씁니다. 그래서 '자주 쓰는 것만 가까이'라는 절충을 계단으로 만든 것입니다.",
      mechanism:
        "CPU가 데이터를 요청하면 L1 캐시부터 뒤지고, 없으면(미스) L2→L3→메모리로 내려가며, 찾은 데이터는 블록 단위로 상위 계층에 채워 넣으면서 씁니다. 계층 간 속도 차이가 10~100배씩이라, 상위에서 얼마나 잡아내느냐(적중률)가 체감 성능을 결정합니다.",
      map: [
        { as: "손에 쥔 펜", real: "레지스터", note: "CPU 안. 가장 빠르고 가장 작고 가장 비쌈" },
        { as: "책상 위", real: "캐시 메모리", note: "자주 쓰는 것만 올려 둠. L1·L2·L3 로 또 계단이 있습니다" },
        { as: "책장", real: "주기억장치(RAM)", note: "지금 실행 중인 프로그램이 올라가는 곳" },
        { as: "창고", real: "보조기억장치(SSD·HDD)", note: "느리지만 싸고 크고, 전원을 꺼도 남아 있음" },
        { as: "자주 쓰는 것만 책상에 둬도 되는 이유", real: "지역성(Locality)", note: "이 계단 구조가 실제로 통하는 근거. 다음 토픽입니다" },
      ],
      usage:
        "CPU 스펙표의 'L1 64KB / L2 1MB / L3 32MB'가 이 계단이고, 게임용 CPU가 L3를 키운 3D V-Cache로 잘 팔리는 이유입니다. 답안 골격은 '피라미드 그림 + 용량·속도·비용 반비례 + 근거는 지역성' 세 줄입니다.",
      links: [
        { topic: "지역성(Locality)", how: "계층 구조가 '왜 통하는지'에 대한 답이 지역성입니다. 둘은 한 세트로 외우세요." },
        { topic: "캐시(Cache) 메모리의 사상 방식", how: "책상 위 어느 자리에 책을 놓을지 정하는 규칙이 사상 방식입니다." },
        { topic: "가상메모리 관리기법", how: "책장이 모자랄 때 창고를 책장인 척 쓰는 기술이 가상메모리입니다." },
      ],
      exam:
        "기억장치 계층 구조는 비트당 비용·속도·용량의 상충 관계를 해결하기 위해 레지스터→캐시→주기억장치→보조기억장치를 계층화한 것으로, 프로그램의 지역성(Locality)에 근거하여 성립한다.",
    },
  },
"os-74": {
    image: "/concept/book/os-74.webp",
    guide: {
      hook: "프로그램은 메모리를 골고루 쓰지 않고, 쓰던 데만 계속 씁니다.",
      scene:
        "시험공부를 떠올려 보세요. 300쪽짜리 책을 펴놨지만 오늘 실제로 보는 건 40~55쪽 그 근처뿐입니다. 방금 본 55쪽을 또 보고(시간), 다음엔 56쪽으로 넘어갑니다(공간). 300쪽을 통째로 책상에 펼칠 필요가 없는 이유입니다.",
      why:
        "만약 프로그램이 메모리를 정말 무작위로 썼다면, 캐시도 가상메모리도 전부 무용지물입니다. 뭘 미리 가져다 놔도 안 맞을 테니까요. 지역성이 있기 때문에 '작은 캐시'만으로도 대부분을 잡아낼 수 있습니다.",
      mechanism:
        "실행 중인 프로그램의 메모리 접근 주소를 찍어 보면 실제로 특정 구간에 몰려 있습니다. 하드웨어와 OS는 이걸 전제로 만들어졌습니다 — 캐시는 방금 쓴 블록 '주변'을 통째로 올리고(공간적), LRU는 '최근 쓴 것'을 남기고(시간적), 프리페처는 다음 주소를 미리 가져옵니다.",
      map: [
        { as: "방금 본 쪽을 또 본다", real: "시간적 지역성(Temporal)", note: "반복문 변수, 자주 부르는 함수" },
        { as: "55쪽 다음은 56쪽", real: "공간적 지역성(Spatial)", note: "배열을 순서대로 훑을 때" },
        { as: "책을 앞에서 뒤로 넘긴다", real: "순차적 지역성(Sequential)", note: "분기가 없으면 저장된 순서대로 실행됨" },
      ],
      usage:
        "배열을 순서대로 도는 코드가 무작위 접근보다 몇 배 빠른 이유, CDN이 인기 콘텐츠를 가까운 서버에 두는 이유가 전부 지역성입니다. 시험에서는 캐시·가상메모리·Working Set 문제의 '근거 문단'으로 쓰는 만능 키워드입니다.",
      links: [
        { topic: "기억장치 계층 구조", how: "지역성은 계층 구조가 성립하는 '이유'입니다. 시험에서 계층 구조를 물으면 반드시 지역성을 근거로 답니다." },
        { topic: "페이지 교체 알고리즘", how: "LRU(가장 오래 안 쓴 것을 뺌)가 잘 통하는 이유가 시간적 지역성입니다." },
        { topic: "스레싱(Thrashing)", how: "Working Set — '지금 보고 있는 40~55쪽 묶음'을 통째로 유지해 주자는 발상이 여기서 나옵니다." },
      ],
      exam:
        "지역성은 프로세스가 참조하는 주소가 특정 영역에 집중되는 성질로, 시간적·공간적·순차적 지역성으로 구분되며 캐시 메모리와 가상메모리 관리의 이론적 근거가 된다.",
    },
  },
"ca-55": {
    image: "/concept/book/ca-55.webp",
    guide: {
      hook: "메모리가 부족해도 프로그램을 돌릴 수 있게, 디스크를 메모리인 척 빌려 쓰는 기술입니다.",
      scene:
        "책상(메모리)은 좁은데 봐야 할 책이 열 권입니다. 어떻게 할까요. 지금 보는 두세 권만 책상에 올리고 나머지는 발밑 상자에 둡니다. 필요해지면 그때 꺼내고, 책상이 꽉 차면 안 보는 책 하나를 상자로 내립니다. 이 살림이 가상메모리입니다.",
      why:
        "이게 없으면 '메모리 8GB짜리 컴퓨터에서는 8GB 넘는 프로그램을 못 돌린다'가 됩니다. 가상메모리 덕분에 프로그램은 메모리 크기를 신경 쓰지 않고 만들 수 있습니다.",
      mechanism:
        "프로세스마다 '메모리를 통째로 다 가진 것 같은' 가상 주소 공간을 받습니다. 실제로는 쓰는 페이지만 물리 메모리에 있고, 없는 페이지에 접근하면 페이지 폴트 발생 → OS가 디스크에서 읽어 빈 프레임에 넣고(없으면 교체) 아무 일 없던 듯 실행을 이어갑니다. 전부 프로그램 몰래 일어납니다.",
      map: [
        { as: "책상에 몇 권까지 올릴까", real: "할당(Allocation)", note: "단일/다중 분할, 스와핑, 오버레이" },
        { as: "책상 어디에 놓을까", real: "배치(Placement)", note: "First Fit(첫 빈자리)·Best Fit(가장 딱 맞는 자리)·Worst Fit(가장 큰 자리)·Next Fit" },
        { as: "언제 꺼내 올까", real: "호출(Fetch)", note: "필요할 때 꺼내면 Demand Fetch, 미리 꺼내 두면 Pre Fetch" },
        { as: "자리 없을 때 누굴 내릴까", real: "교체(Replacement)", note: "FIFO·LRU·LFU·OPT·NUR. 다음 토픽에서 자세히" },
      ],
      usage:
        "8GB 노트북에서 크롬 탭 30개+게임이 어쨌든 돌아가는 이유이고, 윈도우의 페이지 파일·맥의 스왑이 실물입니다. 시험은 할·배·호·교 4관리 서술과 Fit 계산 문제(빈 공간에 First/Best/Worst로 순서대로 배치)로 나옵니다.",
      links: [
        { topic: "가상메모리의 페이징과 세그멘테이션", how: "책을 '똑같은 크기로 자르느냐(페이징), 챕터 단위로 자르느냐(세그멘테이션)'의 문제입니다." },
        { topic: "페이지 교체 알고리즘", how: "위 4가지 중 '교체'만 따로 깊게 파는 토픽입니다." },
        { topic: "스레싱(Thrashing)", how: "이 살림을 잘못해서 책 넣었다 뺐다만 하다 하루가 끝나는 상태입니다." },
      ],
      exam:
        "가상메모리 관리기법은 보조기억장치를 주기억장치처럼 사용하는 기법으로, 할당·배치·호출·교체 네 가지 관리 항목으로 구성된다.",
    },
  },
"paging-segmentation": {
    image: "/concept/book/paging-segmentation.webp", images: ["/concept/extra/paging-mmu.png", "/concept/extra/segmentation-mmu.png"],
    guide: {
      hook: "프로그램을 메모리에 올리려고 자를 때, 자로 자르느냐 의미로 자르느냐입니다.",
      scene:
        "이삿짐을 싼다고 해봅시다. 방법 하나는 똑같은 크기의 상자만 쓰는 것(페이징). 쌓기 편하고 빈틈이 안 생기지만, 마지막 상자엔 양말 한 짝만 들어가서 공간이 남습니다. 다른 방법은 물건 성격대로 싸는 것(세그멘테이션) — 옷 상자, 책 상자, 그릇 상자. 낭비는 없지만 크기가 제각각이라 트럭에 실을 때 여기저기 애매한 틈이 생깁니다.",
      why:
        "프로그램 전체를 통째로 메모리에 올리려면 그만한 연속된 빈 공간이 있어야 합니다. 잘라서 올리면 흩어진 빈자리에도 넣을 수 있습니다. 자르는 방식에 따라 낭비가 생기는 위치가 달라집니다.",
      mechanism:
        "페이징은 가상 주소를 '페이지 번호+오프셋'으로 잘라 페이지 테이블에서 프레임 번호로 바꿔 붙입니다. 세그멘테이션은 '세그먼트 번호+오프셋'으로 잘라 세그먼트 테이블의 시작 주소에 더하고 길이를 검사합니다. 현실 OS는 페이징이 기본이고, 코드/데이터/스택의 보호 속성은 세그먼트의 발상을 가져온 혼합입니다.",
      map: [
        { as: "똑같은 크기 상자", real: "페이징(Paging)", note: "고정 크기로 자름. 관리가 단순함" },
        { as: "마지막 상자에 남는 공간", real: "내부 단편화", note: "페이징의 낭비. 상자 안쪽이 빔" },
        { as: "성격대로 싼 상자", real: "세그멘테이션(Segmentation)", note: "가변 크기. 코드·데이터·스택처럼 의미 단위" },
        { as: "트럭에 생기는 애매한 틈", real: "외부 단편화", note: "세그멘테이션의 낭비. 상자와 상자 사이가 빔" },
      ],
      usage:
        "리눅스·윈도우 모두 사실상 페이징 기반입니다. '코드 영역은 읽기 전용, 스택은 실행 금지' 같은 보호 설정이 세그먼트적 사고입니다. 시험은 두 방식의 단편화 반대 관계 표와 장단점 비교가 정석입니다.",
      links: [
        { topic: "단편화(Fragmentation)", how: "여기서 나온 내부/외부 단편화를 정면으로 다루는 토픽입니다. 붙여서 외우세요." },
        { topic: "직접 사상과 연관 사상 페이징 기법", how: "페이징으로 자른 뒤, 잘린 조각이 실제로 어디 있는지 찾아가는 방법입니다." },
      ],
      exam:
        "페이징은 고정 크기로 분할하여 외부 단편화가 없으나 내부 단편화가 발생하고, 세그멘테이션은 논리적 단위로 가변 분할하여 내부 단편화가 없으나 외부 단편화가 발생한다.",
    },
  },
"ca-58": {
    image: "/concept/book/ca-58.webp", images: ["/concept/extra/internal-fragmentation.png", "/concept/extra/external-fragmentation.png"],
    guide: {
      hook: "빈 공간은 분명히 있는데, 쓸 수가 없는 상태입니다.",
      scene:
        "영화관에 빈 좌석이 20개나 남았는데, 5명이 함께 온 가족이 앉을 수가 없습니다. 빈자리가 여기 두 개, 저기 한 개씩 흩어져 있기 때문이죠(외부 단편화). 반대로 4인석에 3명만 앉으면 한 자리가 놀게 됩니다(내부 단편화). 둘 다 '자리는 있는데 못 쓴다'입니다.",
      why:
        "메모리를 아무리 많이 꽂아도 단편화가 심하면 프로그램이 안 올라갑니다. 그래서 운영체제는 빈자리를 계속 정리해 줘야 합니다.",
      mechanism:
        "가변 분할에서 프로세스가 들어왔다 나가기를 반복하면 빈 구멍들이 흩어집니다. 할당 때 First/Best/Worst Fit으로 구멍을 고르는데 어떤 걸 골라도 외부 단편화는 쌓입니다. 인접한 구멍은 반납 때 합치고(통합), 심해지면 사용 영역을 밀어붙여 큰 빈 덩어리를 만듭니다(집약 — 주소 재배치 필요).",
      map: [
        { as: "4인석에 3명 → 남는 한 자리", real: "내부 단편화", note: "할당해 준 칸 '안'에서 남는 것" },
        { as: "흩어진 빈 좌석", real: "외부 단편화", note: "칸과 칸 '사이'에 흩어진 것" },
        { as: "붙어 있는 빈자리끼리 합치기", real: "통합(Coalescing)", note: "인접한 빈 공간을 하나로" },
        { as: "관객을 앞쪽으로 몰아 앉히기", real: "집약·압축(Compaction)", note: "쓰는 영역을 한쪽으로 밀어 큰 빈자리를 만듦. 대신 자리가 바뀌니 주소 재배치가 필요" },
      ],
      usage:
        "오래 켠 서버에서 '메모리는 남는데 큰 할당이 실패'하는 현상, HDD 시절 조각 모음, 게임을 오래 켜면 버벅이는 힙 단편화가 같은 원리입니다. '페이징이 외부 단편화의 해결책'이라는 연결이 답안 마무리 문장으로 좋습니다.",
      links: [
        { topic: "가상메모리의 페이징과 세그멘테이션", how: "페이징이 내부 단편화, 세그멘테이션이 외부 단편화를 만듭니다. 원인–현상으로 이어 외우세요." },
        { topic: "가상메모리 관리기법", how: "배치 기법(First/Best/Worst Fit)을 어떻게 고르느냐가 외부 단편화의 양을 좌우합니다." },
      ],
      exam:
        "단편화는 주기억장치 공간이 사용되지 못하고 낭비되는 현상으로, 분할 내부에서 발생하는 내부 단편화와 분할 사이에서 발생하는 외부 단편화가 있으며, 통합(Coalescing)과 집약(Compaction)으로 해소한다.",
    },
  },
"ca-87": {
    image: "/concept/book/ca-87.webp",
    guide: {
      hook: "프로그램이 부르는 가짜 주소를, 진짜 메모리 주소로 바꿔 찾아가는 방법입니다.",
      scene:
        "호텔에 묵는 손님이 '312호'를 찾습니다. 그런데 이 호텔은 리모델링 중이라 방 번호가 실제 위치와 다릅니다. 프런트에는 '312호 → 실제 5층 안쪽 방' 이라고 적힌 장부가 있습니다. 손님은 매번 프런트에 가서 장부를 확인하고 방을 찾아갑니다(직접 사상). 그런데 매번 프런트를 들르니 느립니다. 그래서 자주 찾는 방 몇 개는 프런트 직원이 아예 외워 버립니다(연관 사상).",
      why:
        "프로그램은 자기가 메모리 어디에 올라갈지 모르고, 알 필요도 없어야 합니다. 그래서 가짜 주소를 쓰게 하고 운영체제가 진짜 주소로 바꿔 줍니다. 문제는 이 변환에도 시간이 든다는 것입니다.",
      mechanism:
        "CPU가 가상 주소를 내면 MMU가 먼저 TLB(연관 메모리)를 병렬 검색합니다. 히트면 즉시 변환 완료(메모리 1회), 미스면 메모리의 페이지 테이블을 읽어(추가 1회) 변환하고 그 항목을 TLB에 올립니다. TLB 적중률이 99% 수준이라 평균 접근 시간이 유지됩니다.",
      map: [
        { as: "프런트의 장부", real: "페이지 사상표(PMT)", note: "메모리 안에 있음. 가상 페이지 → 실제 프레임 대응표" },
        { as: "매번 프런트를 들름", real: "직접 사상", note: "정확하지만 메모리를 한 번 더 갔다 와야 해서 느림" },
        { as: "직원이 외워 버린 자주 찾는 방", real: "연관 사상 / TLB", note: "전부 동시에 비교(Parallel Search)해서 한 번에 찾음. 빠르지만 비쌈" },
        { as: "외운 방은 바로, 나머지는 장부 확인", real: "혼합 방식", note: "실제 CPU가 쓰는 방식" },
      ],
      usage:
        "모든 폰·PC에서 매 메모리 접근마다 일어나는 일입니다. 시험은 '직접 사상은 메모리 2회, 연관(TLB)은 1회'와 유효 접근시간 계산(적중률×1회 시간 + 미스율×2회 시간)이 단골입니다.",
      links: [
        { topic: "MMU(Memory Management Unit)", how: "이 변환을 실제로 해주는 하드웨어가 MMU입니다. 원리=사상 기법, 부품=MMU." },
        { topic: "가상메모리의 페이징과 세그멘테이션", how: "페이징으로 자른 결과를 이 방법으로 찾아갑니다." },
        { topic: "지역성(Locality)", how: "'자주 찾는 방만 외운다'가 통하는 이유입니다." },
      ],
      exam:
        "직접 사상은 페이지 사상표(PMT)를 참조하여 주소를 변환하므로 메모리 접근이 2회 발생하고, 연관 사상은 TLB에서 병렬 검색으로 1회에 변환하며, 실제로는 두 방식을 혼합한 형태를 사용한다.",
    },
  },
"ca-84": {
    image: "/concept/book/ca-84.webp",
    guide: {
      hook: "메모리가 꽉 찼을 때, 누구를 내보낼지 정하는 규칙입니다.",
      scene:
        "책상에 책을 5권까지만 올릴 수 있는데 6번째 책이 필요합니다. 하나를 내려야 하는데 누구를 내릴까요. 제일 먼저 올린 책?(FIFO) 제일 오래 안 본 책?(LRU) 제일 적게 본 책?(LFU) 아니면 앞으로 제일 늦게 볼 책?(OPT) — 마지막은 미래를 알아야 하니 실제로는 못 씁니다.",
      why:
        "잘못 고르면 방금 내린 책을 바로 다시 올려야 합니다. 이런 일이 반복되면 공부는 안 하고 책만 나르다 끝납니다(스레싱). 그래서 '앞으로 안 쓸 것 같은 놈'을 잘 골라야 합니다.",
      mechanism:
        "페이지 폴트가 났는데 빈 프레임이 없으면 OS가 희생 페이지를 고릅니다 — LRU는 접근 시각, LFU는 횟수, NUR은 참조/수정 2비트를 근거로. 희생 페이지가 수정된(더티) 상태면 먼저 디스크에 써 내리고 새 페이지를 올립니다.",
      map: [
        { as: "제일 먼저 올린 책", real: "FIFO", note: "단순하지만 자주 쓰는 책도 순서만 되면 내림. Belady 이상현상이 생김" },
        { as: "제일 오래 안 본 책", real: "LRU (Least Recently Used)", note: "성능은 좋지만 매번 '언제 봤는지'를 기록해야 해서 무거움" },
        { as: "제일 적게 본 책", real: "LFU (Least Frequently Used)", note: "초반에 잠깐 많이 본 책이 계속 살아남는 부작용" },
        { as: "대충 최근에 봤나만 표시", real: "NUR", note: "참조비트·수정비트 2비트만 봄. 가벼워서 실제로 많이 씀" },
        { as: "앞으로 제일 늦게 볼 책", real: "OPT (최적)", note: "이론상 최고지만 미래를 알아야 해서 실현 불가. 다른 알고리즘의 성능 비교 기준으로만 씀" },
      ],
      usage:
        "리눅스의 LRU 근사(active/inactive 리스트), 안드로이드가 백그라운드 앱을 정리하는 것도 같은 발상입니다. 시험은 참조열 계산이 단골 — 프레임 칸을 그려 FIFO/LRU/OPT의 폴트 수를 비교하고, OPT가 기준선·LRU가 근접·FIFO가 Belady까지 한 세트로 서술합니다.",
      links: [
        { topic: "Belady's Anomaly(FIFO 이상현상)", how: "FIFO만 갖는 이상한 현상입니다. 왜 FIFO만 그런지가 시험 포인트." },
        { topic: "지역성(Locality)", how: "LRU가 잘 통하는 근거. 최근에 본 건 또 볼 확률이 높습니다." },
        { topic: "스레싱(Thrashing)", how: "교체를 잘못하면 도달하는 최악의 상태입니다." },
      ],
      exam:
        "페이지 교체 알고리즘은 페이지 부재 시 교체 대상을 선정하는 기법으로 FIFO·LRU·LFU·NUR·SCR 등이 있으며, 이론적 최적인 OPT는 미래 참조를 알 수 없어 실현이 불가능하다.",
    },
  },
"ca-90": {
    image: "/concept/book/ca-90.webp",
    guide: {
      hook: "책상을 넓혔는데 오히려 책을 더 자주 나르게 되는, 말도 안 되는 현상입니다.",
      scene:
        "책상에 3권 올릴 수 있을 때보다 4권 올릴 수 있을 때가 당연히 낫겠죠. 그런데 '먼저 올린 책부터 내린다'는 규칙(FIFO)만 지키면, 자리를 늘렸는데 오히려 책을 나른 횟수가 더 많아지는 경우가 실제로 있습니다. 이게 Belady의 이상현상입니다.",
      why:
        "이 현상이 알려주는 교훈이 중요합니다. FIFO는 '얼마나 자주 쓰는 책인지'를 전혀 안 봅니다. 들어온 순서만 봅니다. 즉 지역성을 무시한 알고리즘이라 이런 비상식적인 일이 벌어지는 것입니다.",
      mechanism:
        "참조열 1,2,3,4,1,2,5,1,2,3,4,5를 FIFO로 돌리면 프레임 3개일 때 9번, 4개일 때 10번 폴트 — 늘렸는데 나빠지는 반례가 실제로 존재합니다. LRU는 '프레임 n개의 내용이 n-1개의 내용을 항상 포함'하는 스택 성질이 있어 절대 발생하지 않습니다.",
      map: [
        { as: "책상 자리 수", real: "페이지 프레임 수", note: "메모리에 올릴 수 있는 페이지 개수" },
        { as: "책을 나른 횟수", real: "페이지 부재(Page Fault) 횟수", note: "필요한 페이지가 메모리에 없어 디스크에서 가져온 횟수" },
        { as: "자리를 늘렸는데 더 많이 나름", real: "Belady's Anomaly", note: "FIFO에서만 발생" },
        { as: "자주 보는 책인지 안 봄", real: "지역성 미반영", note: "이것이 원인. LRU·OPT에는 이 현상이 없습니다" },
      ],
      usage:
        "시험엔 위 참조열 계산 자체가 나오거나 'FIFO에서만 발생하는 이유(스택 성질 부재)'를 묻습니다. 실무 교훈은 '캐시를 늘리는 게 항상 답이 아니다, 교체 정책부터 봐라'입니다.",
      links: [
        { topic: "페이지 교체 알고리즘", how: "FIFO의 결정적 약점입니다. 'FIFO는 단순하지만 Belady 이상현상' 으로 한 세트." },
        { topic: "지역성(Locality)", how: "지역성을 반영하지 않은 알고리즘의 대가가 이 현상입니다." },
      ],
      exam:
        "Belady's Anomaly는 페이지 프레임 수를 늘렸음에도 페이지 부재율이 증가하는 현상으로, 참조 이력을 고려하지 않는 FIFO에서 발생하며 LRU·OPT에서는 발생하지 않는다.",
    },
  },
"os-75": {
    image: "/concept/book/os-75.webp",
    guide: {
      hook: "일은 안 하고 메모리에 넣었다 뺐다만 하다가 하루가 끝나는 상태입니다.",
      scene:
        "좁은 책상에서 5과목을 동시에 공부하려고 합니다. 국어책 펴서 한 줄 읽고, 수학책 꺼내려고 국어책 치우고, 다시 국어가 필요해서 수학책 치우고… 결국 책만 계속 옮기다 한 줄도 제대로 못 읽습니다. 컴퓨터도 프로그램을 너무 많이 띄우면 이렇게 됩니다.",
      why:
        "그래프를 보면 프로그램 수를 늘릴수록 CPU 이용률이 오르다가, 어느 지점부터 절벽처럼 뚝 떨어집니다. 이 절벽이 스레싱입니다. 해결의 핵심은 '한 프로그램이 지금 진짜로 필요한 페이지 묶음'을 통째로 보장해 주는 것입니다.",
      mechanism:
        "메모리가 부족한데 프로세스를 더 띄우면 각자의 Working Set이 안 들어가 페이지 폴트가 연쇄로 터집니다. CPU는 디스크 I/O 대기만 하느라 이용률이 떨어지고, OS는 'CPU가 노네? 더 올리자'며 악순환을 가속합니다. 해결은 Working Set만큼 프레임을 보장하거나, PFF로 폴트율 상·하한에 따라 프레임을 주고 뺏는 것입니다.",
      map: [
        { as: "동시에 펼친 과목 수", real: "다중 프로그래밍 정도", note: "많을수록 좋다가 어느 순간 급락" },
        { as: "책 옮기기만 반복", real: "페이지 교체(Swap In/Out)만 반복", note: "CPU는 놀고 디스크만 바쁨" },
        { as: "지금 보는 40~55쪽 묶음을 통째로 유지", real: "Working Set", note: "일정 시간 동안 실제 참조한 페이지 집합을 메모리에 유지" },
        { as: "책 옮기는 횟수가 너무 잦으면 자리를 더 준다", real: "PFF (Page Fault Frequency)", note: "부재율이 상한을 넘으면 프레임 추가, 하한 아래면 회수" },
      ],
      usage:
        "PC에서 디스크 램프만 깜빡이며 마우스까지 버벅이는 상태가 스레싱입니다. 서버에선 스왑 사용률 급증 알람으로 감지합니다. 시험은 '다중 프로그래밍 정도 vs CPU 이용률' 그래프를 그리고 Working Set·PFF 두 해법을 쓰는 문제입니다.",
      links: [
        { topic: "지역성(Locality)", how: "Working Set 은 지역성을 그대로 제도화한 것입니다." },
        { topic: "페이지 교체 알고리즘", how: "교체 알고리즘이 나쁘면 스레싱에 더 빨리 빠집니다." },
        { topic: "문맥교환(Context Switching)", how: "스레싱 대응책 중 하나가 다중 프로그래밍 정도를 낮추는 것인데, 그러면 문맥교환 부하도 같이 줄어듭니다." },
      ],
      exam:
        "스레싱은 페이지 교체가 지나치게 빈번하여 CPU 이용률이 급격히 저하되는 현상으로, Working Set 과 PFF(Page Fault Frequency) 기법으로 해결한다.",
    },
  },
"sw-methodology": {
    guide: {
      hook: "SW를 '어떤 절차·산출물·기법으로 만들지' 정한 방법론들의 계보입니다.",
      scene: "SW 개발이 주먹구구면 실패합니다. 방법론은 개발 과정을 체계화합니다 — 절차대로 짜는 구조적, 데이터 중심의 정보공학, 객체로 묶는 객체지향, 조립하는 컴포넌트, 유연한 애자일까지 시대별로 발전했습니다.",
      why: "방법론 계보(구조적→정보공학→객체지향→CBD→애자일)와 각 특징이 출제 핵심입니다.",
      mechanism: "구조적 방법론(프로세스 중심, 하향식 기능 분할·DFD), 정보공학(데이터 중심·전사 관점·ERD), 객체지향(객체=데이터+기능, 재사용·UML), CBD(컴포넌트 조립·재사용), 애자일(반복·적응·경량). 구성: 절차·산출물·기법·도구. 개발 모델(폭포수·프로토타입·나선형·반복·애자일)과 결합. 프로젝트 특성에 맞게 테일러링.",
      map: [
        { as: "기능 하향 분할", real: "구조적(DFD)", note: "" },
        { as: "데이터 중심", real: "정보공학(ERD)", note: "" },
        { as: "객체로 묶기", real: "객체지향(UML)", note: "" },
        { as: "반복·적응", real: "애자일", note: "" },
      ],
      usage: "개발 방법론 선택의 기준입니다. 시험은 계보·특징, 테일러링입니다.",
      links: [
        { topic: "테일러링 (Tailoring)", how: "방법론을 프로젝트에 맞게 조정합니다." },
        { topic: "Agile 선언문과 12개 원칙", how: "애자일 방법론의 철학입니다." },
      ],
      exam: "SW 개발 방법론은 구조적(프로세스)→정보공학(데이터)→객체지향(객체)→CBD(컴포넌트)→애자일(반복)로 발전했으며, 절차·산출물·기법으로 구성돼 테일러링해 적용한다.",
    }, image: "/concept/book/sw-methodology.webp", easy: "개발을 '그때그때 알아서'가 아니라 표준으로 못 박아 둔 것이 방법론입니다. 구성요소 6개 [절방산관기도] — 절차(단계별 순서), 방법(누가 무엇을 어떻게), 산출물(무엇을 남기나), 관리(계획·일정·품질), 기법(ERD·DFD 같은 기술), 도구(CASE·UML Tool). 유형은 시대순으로 흘러갑니다 [구정객CAP] — 구조적(70s, 프로세스 중심) → 정보공학(80s, 데이터모델 중심) → 객체지향(90s, 객체 중심, White Box 재사용) → CBD(2000s, 컴포넌트 중심, Black Box 재사용) → Agile(2010s, 적시성). Product Line은 공통 기능을 미리 뽑아 두고 제품마다 조립하는 방식입니다." },
"sw-design-principle": {
    guide: {
      hook: "복잡한 SW를 '나누고 숨기고 정리하는' 설계의 기본 원리들입니다.",
      scene: "좋은 설계는 복잡성을 다스립니다. 큰 문제를 작게 나누고(분할정복), 내부를 숨기고(정보 은닉), 관련 있는 것끼리 묶고(응집도↑), 모듈 간 의존은 줄입니다(결합도↓). 이 원리들이 유지보수성을 좌우합니다.",
      why: "핵심 원리(추상화·정보은닉·모듈화·응집도/결합도)와 '높은 응집·낮은 결합'이 출제 핵심입니다.",
      mechanism: "원리: 추상화(본질만·세부 감춤), 정보 은닉(내부 구현 숨김·인터페이스만 노출), 모듈화(기능 단위 분할), 단계적 분해(하향식). 모듈 품질: 응집도(Cohesion — 모듈 내 요소 관련성, 높을수록 좋음: 기능적>순차>교환>절차>시간>논리>우연), 결합도(Coupling — 모듈 간 의존성, 낮을수록 좋음: 자료<스탬프<제어<외부<공통<내용). 목표: 높은 응집·낮은 결합 → 유지보수·재사용성.",
      map: [
        { as: "본질만 남기기", real: "추상화", note: "" },
        { as: "내부 숨기기", real: "정보 은닉", note: "" },
        { as: "관련끼리 묶기", real: "높은 응집도", note: "기능적 최상" },
        { as: "의존 줄이기", real: "낮은 결합도", note: "자료 최상" },
      ],
      usage: "SW 설계 품질의 기준입니다. 시험은 응집도/결합도 단계, 높은 응집·낮은 결합입니다.",
      links: [
        { topic: "객체지향 설계 원리", how: "SOLID로 구체화됩니다." },
        { topic: "소프트웨어 리팩토링", how: "결합도↓·응집도↑로 개선합니다." },
      ],
      exam: "SW 설계 원리는 추상화·정보 은닉·모듈화로 복잡성을 다스리며, 모듈은 높은 응집도(기능적 최상)와 낮은 결합도(자료 최상)를 지향해 유지보수·재사용성을 높인다.",
    }, image: "/concept/book/sw-design-principle.webp", easy: "복잡한 걸 다루는 방법은 결국 둘 — 뭉뚱그리거나(일반화) 잘게 쪼개거나(구체화)입니다. 일반화 쪽에 추상화(필요한 것만 남기고 나머지는 생략)와 정보은닉(모듈 속을 안 보이게)이 있고, 구체화 쪽에 분할과 정복(큰 걸 서브시스템으로 쪼개 아래부터 완성), 단계적 분해(위에서 아래로 점점 잘게, 하향식), 모듈화(실제 개발 가능한 단위로 나눔)가 있습니다. 설계는 상위 설계(아키텍처·데이터·인터페이스·UI)와 하위 설계(모듈·자료구조·알고리즘)로 나뉩니다." },
"se-18": {
  image: "/concept/book/se-18.webp",
  guide: {
    hook: "프로그램을 '작업 순서'가 아니라 '사물(객체)'들의 협업으로 짜는 방식 — 그 객체가 가진 다섯 가지 성질입니다.",
    scene: "커피머신을 떠올려 보세요. 겉에는 버튼 몇 개만 노출되어 있고, 내부의 배관·회로·물탱크는 케이스 안에 감춰져 있습니다. 우리는 '아메리카노' 버튼만 누르면 되고 속에서 어떻게 만드는지는 몰라도 됩니다. 신모델은 구모델의 설계도를 물려받아 '라떼 버튼' 하나만 더 얹었고, 똑같은 '추출' 버튼인데 에스프레소 모델과 드립 모델은 서로 다르게 동작합니다. 그리고 이 기계들 전부를 우리는 그냥 '커피머신'이라는 하나의 이름으로 부릅니다.",
    why: "기능 순서 중심(절차형)으로 짜면 데이터가 사방에서 직접 수정되어, 한 곳을 고치면 열 곳이 깨집니다. 데이터와 기능을 객체 단위로 묶고 속을 감추면 고장의 파급 범위가 객체 안에 갇히고, 설계도를 물려받아 재사용하니 같은 코드를 두 번 쓰지 않습니다. 답안의 기대효과 두 단어 — 유지보수성과 재사용성 — 이 여기서 나옵니다.",
    mechanism: "코드에서는 이렇게 됩니다. 클래스(설계도)에 속성(변수)과 메소드(함수)를 함께 정의해 한 덩어리로 묶고(캡슐화), 변수는 private/protected로 잠가 외부에서는 공개 메소드로만 접근하게 합니다(정보은닉). 여러 클래스의 공통점을 뽑아 상위 클래스를 만들고(추상화), 하위 클래스가 이를 물려받아 재사용하며(상속), 같은 이름의 메소드가 클래스마다 다르게 동작합니다(다형성 — 물려받아 다시 정의하면 Overriding, 같은 이름에 인자만 다르면 Overloading).",
    map: [
      { as: "케이스로 감싸고 버튼만 노출", real: "캡슐화", note: "속성+메소드를 하나로 묶고 구현을 감춤 — 정보은닉을 포함하는 더 넓은 개념" },
      { as: "내부 배관은 손댈 수 없음", real: "정보은닉", note: "private/protected 선언으로 외부 직접 접근 차단 — '숨기는 성질' 그 자체" },
      { as: "전부 '커피머신'이라 부름", real: "추상화", note: "공통 속성·기능을 추출해 슈퍼클래스를 설정" },
      { as: "신모델이 구모델 설계도를 물려받음", real: "상속성", note: "클래스 재사용. 일반화(공통으로 묶기) ↔ 특수화(자기만의 것 추가)" },
      { as: "같은 '추출' 버튼, 모델마다 다른 동작", real: "다형성", note: "Overriding(수직 확장·재정의) / Overloading(수평 확장·중복정의), 동적바인딩" },
    ],
    usage: "SE 과목의 뿌리 토픽입니다 — 디자인 패턴, SOLID 설계 원리, UML이 전부 이 다섯 성질 위에 서 있습니다. 시험엔 '특징 5가지를 설명하라'로 직접 나오거나, 캡슐화 vs 정보은닉 구분, Overriding vs Overloading 구분 같은 함정형으로 나옵니다. 두음 [캡추다정상]으로 다섯 개부터 빠짐없이.",
    links: [
      { topic: "객체지향 설계 원리", how: "다섯 특징을 '잘 쓰기 위한 규칙'이 SOLID 5원칙입니다. 특징(성질) 다음에 원리(규칙) 순서로 묶어 외우세요." },
      { topic: "다형성 (Polymorphism)", how: "다섯 특징 중 다형성만 따로 깊게 다루는 토픽 — Overriding/Overloading 비교표가 단골입니다." },
      { topic: "디자인 패턴 (Design Pattern)", how: "캡슐화·상속·다형성을 조합한 검증된 설계 레시피 23종. 특징의 '활용편'입니다." },
    ],
    exam: "객체지향 특징 [캡추다정상] — 캡슐화(속성·메소드를 묶고 감춤), 추상화(공통 성질 추출), 다형성(같은 이름 다른 동작), 정보은닉(외부 접근 차단), 상속성(클래스 재사용).",
  },
},
"polymorphism": {
    guide: {
      hook: "'같은 메시지에 객체마다 다르게 반응'하는 객체지향의 핵심 특성입니다.",
      scene: "'그려라' 명령에 원은 원을, 사각형은 사각형을 그립니다. 같은 인터페이스(그리기)를 호출해도 실제 객체에 따라 다른 동작이 실행됩니다. 덕분에 새 도형을 추가해도 호출 코드는 안 바꿔도 됩니다.",
      why: "다형성의 종류(오버로딩·오버라이딩)와 동적 바인딩, 개방-폐쇄 원칙과의 연결이 출제 핵심입니다.",
      mechanism: "종류: 오버로딩(Overloading — 같은 이름·다른 매개변수, 컴파일 타임/정적), 오버라이딩(Overriding — 상위 메서드를 하위가 재정의, 런타임/동적 바인딩), 매개변수 다형성(제네릭). 동적 바인딩: 실행 시점에 실제 객체 타입의 메서드 결정. 효과: 확장성(새 타입 추가해도 기존 코드 불변 — OCP), 유연성. 상속·인터페이스와 결합. 다형성이 객체지향의 가장 강력한 특성.",
      map: [
        { as: "같은 이름·다른 인자", real: "오버로딩(정적)", note: "컴파일 타임" },
        { as: "상위 메서드 재정의", real: "오버라이딩(동적)", note: "런타임" },
        { as: "실제 객체가 결정", real: "동적 바인딩", note: "" },
        { as: "새 타입 추가 유연", real: "OCP 지원", note: "" },
      ],
      usage: "객체지향 설계·프레임워크입니다. 시험은 오버로딩/오버라이딩, 동적 바인딩, OCP입니다.",
      links: [
        { topic: "객체지향 설계 원리", how: "다형성이 OCP·DIP를 뒷받침합니다." },
        { topic: "디자인 패턴 (Design Pattern)", how: "다형성이 패턴의 기반입니다." },
      ],
      exam: "다형성은 같은 메시지에 객체마다 다르게 반응하는 객체지향 특성으로, 정적 오버로딩과 동적 오버라이딩(동적 바인딩)이 있으며 개방-폐쇄 원칙(OCP)을 뒷받침한다.",
    }, image: "/concept/book/polymorphism.webp", easy: "같은 이름의 메소드를 여러 개 두는 것인데, 두 방식의 규칙이 정반대라 표로 외웁니다. 오버로딩은 **같은 클래스 안**에서 이름은 같고 파라미터를 다르게 — 파라미터 개수나 자료형이 반드시 달라야 하고, 리턴 타입은 상관없으며, 상위 클래스에 같은 이름이 없어야 합니다. 오버라이딩은 **상속 관계**에서 하위 클래스가 상위 메소드를 덮어쓰는 것 — 이름·파라미터·리턴 타입이 전부 같아야 하고, 상위 클래스에 그 메소드가 반드시 있어야 합니다. 한 줄: 오버로딩=수평(같은 클래스), 오버라이딩=수직(상속)." },
"ood-principles": {
    guide: {
      hook: "유지보수하기 좋은 객체지향 설계의 5원칙 — SOLID입니다.",
      scene: "객체지향으로 짜도 설계가 나쁘면 얽혀서 못 고칩니다. SOLID는 '한 가지 책임만, 확장엔 열고 수정엔 닫고, 자식은 부모를 대체 가능하게, 인터페이스는 잘게, 추상에 의존하라'는 5가지 지침입니다.",
      why: "SOLID 5원칙 각각의 의미와 위반 사례가 출제 핵심입니다. 다형성·의존성 주입과 연결됩니다.",
      mechanism: "SRP(단일 책임 — 클래스는 한 가지 변경 이유만), OCP(개방-폐쇄 — 확장에 열림·수정에 닫힘, 다형성으로), LSP(리스코프 치환 — 하위 타입은 상위 타입 대체 가능), ISP(인터페이스 분리 — 안 쓰는 메서드에 의존 강제 금지, 인터페이스 작게), DIP(의존성 역전 — 구체가 아닌 추상에 의존, DI). 목표: 결합도↓·응집도↑·확장성. 디자인 패턴·클린 아키텍처의 기초.",
      map: [
        { as: "한 가지 책임만", real: "SRP", note: "" },
        { as: "확장 열고 수정 닫고", real: "OCP", note: "다형성" },
        { as: "자식이 부모 대체", real: "LSP", note: "" },
        { as: "추상에 의존", real: "DIP", note: "DI" },
      ],
      usage: "객체지향 설계·리팩토링입니다. 시험은 SOLID 각 원칙, 위반 사례, DI와의 관계입니다.",
      links: [
        { topic: "소프트웨어 설계의 원리", how: "SOLID가 이를 객체지향으로 구체화합니다." },
        { topic: "Clean Architecture", how: "DIP·경계가 클린 아키텍처의 기초입니다." },
      ],
      exam: "객체지향 설계 원리 SOLID는 단일 책임(SRP)·개방폐쇄(OCP)·리스코프 치환(LSP)·인터페이스 분리(ISP)·의존성 역전(DIP)으로, 결합도를 낮추고 확장성을 높인다.",
    }, image: "/concept/book/ood-principles.webp", easy: "객체지향 설계에서 유지보수성과 확장성을 높이기 위해 따르는 5대 원칙, SOLID입니다. SRP — 클래스·메소드는 역할 하나만(Person에 DB 책임과 비즈니스 책임이 섞여 있으면 쪼갠다). OCP — 기능을 더할 때는 열려 있고, 기존 코드 수정에는 닫혀 있어야(도형이 늘어도 client 코드는 안 고침). LSP — 자식이 부모 자리를 대신할 수 있어야(자식이 부모의 약속을 깨면 위반). ISP — 인터페이스도 역할 하나만(뚱뚱한 인터페이스를 client별로 쪼갠다). DIP — 고차원 모듈이 저차원 모듈에 의존하지 말고, 둘 다 추상(인터페이스)에 의존해야." },
"law-of-demeter": {
    guide: {
      hook: "'직접 아는 친구에게만 말하라' — 객체 간 결합을 줄이는 최소 지식 원칙입니다.",
      scene: "친구의 친구에게 직접 심부름 시키면 관계가 얽힙니다(a.getB().getC().do()). 데메테르 법칙은 객체가 '직접 관계된 것'하고만 소통하라고 해, 내부 구조 변경이 파급되지 않게 결합을 낮춥니다.",
      why: "'최소 지식·직접 친구만'과 기차 충돌(method chaining) 안티패턴이 출제 포인트입니다. 결합도·캡슐화와 연결됩니다.",
      mechanism: "원칙: 메서드는 다음에게만 메시지 전송 — 자기 자신, 매개변수로 받은 객체, 자신이 생성한 객체, 직접 포함한 멤버 객체. 위반: a.getB().getC().doSomething()(기차 충돌 — 내부 구조 노출·강결합). 개선: 위임 메서드(a.doViaB()) 제공. 효과: 캡슐화 강화·결합도↓·변경 파급↓. 단, 과하면 위임 메서드 남발(래퍼 증가)이라 균형 필요.",
      map: [
        { as: "직접 친구에게만", real: "최소 지식", note: "핵심" },
        { as: "친구의 친구 호출 금지", real: "기차 충돌 회피", note: "안티패턴" },
        { as: "위임 메서드 제공", real: "개선책", note: "" },
        { as: "결합도↓", real: "효과", note: "캡슐화" },
      ],
      usage: "결합도 낮은 설계입니다. 시험은 최소 지식, 기차 충돌, 결합도와의 관계입니다.",
      links: [
        { topic: "객체지향 설계 원리", how: "결합도 감소라는 목표를 공유합니다." },
        { topic: "소프트웨어 설계의 원리", how: "낮은 결합도 원리의 구체화입니다." },
      ],
      exam: "데메테르의 법칙은 객체가 직접 관계된 대상(자신·매개변수·생성·멤버 객체)에게만 메시지를 보내는 최소 지식 원칙으로, 기차 충돌을 피해 결합도를 낮춘다.",
    }, image: "/concept/book/law-of-demeter.webp", easy: "객체가 직접 아는 대상하고만 대화하고, 남을 거쳐 그 내부까지 파고들지 말라는 설계 원칙입니다('최소 지식의 원칙'). A가 B를 아는 건 괜찮지만, B를 거쳐 C까지 파고드는 건(a.getB().getC().doSomething()) 하지 말라는 것입니다 — 친구의 친구는 남이니까요. 호출해도 되는 대상은 딱 다섯 — ① 객체 자신(this.method()), ② 메소드 파라미터로 받은 객체, ③ 메소드 안에서 직접 만든 객체, ④ 객체가 필드로 직접 갖고 있는 컴포넌트, ⑤ 접근 가능한 전역 변수. 이걸 지키면 결합도가 낮아져(loose coupling) 한쪽을 고쳐도 다른 쪽이 안 깨집니다." },
"se-28": {
    guide: {
      hook: "'공통 자산을 재사용해' 유사 제품군을 효율적으로 대량 생산하는 개발 방식입니다.",
      scene: "비슷한 제품(스마트폰 라인업)을 매번 처음부터 만들면 낭비입니다. 소프트웨어 제품 라인은 공통 부분(코어 자산)을 미리 만들어 두고, 제품마다 다른 부분만 조합해 생산성·품질을 높입니다.",
      why: "'공통성(Commonality)+가변성(Variability)'과 코어 자산·제품 개발의 이원 구조가 출제 핵심입니다.",
      mechanism: "핵심: 공통성(제품군이 공유)과 가변성(제품별 차이) 분석 → 코어 자산(재사용 가능한 아키텍처·컴포넌트·요구·테스트) 개발 → 제품 개발(코어 자산 + 가변점 바인딩으로 조립). 3활동: 코어 자산 개발(도메인 공학), 제품 개발(응용 공학), 관리. 가변성 관리(피처 모델·바인딩 시점). 효과: 재사용·생산성·품질·출시 단축. 대량 맞춤(mass customization).",
      map: [
        { as: "공유하는 부분", real: "공통성", note: "코어 자산" },
        { as: "제품별 차이", real: "가변성", note: "가변점" },
        { as: "재사용 자산 개발", real: "도메인 공학", note: "" },
        { as: "조합해 제품 생산", real: "응용 공학", note: "" },
      ],
      usage: "제품군 대량 생산·재사용입니다. 시험은 공통성/가변성, 코어 자산/제품 개발, 피처 모델입니다.",
      links: [
        { topic: "소프트웨어 개발 방법론", how: "재사용 기반 개발 방식입니다." },
        { topic: "서비타이제이션(Servitization)", how: "제품군 대량 맞춤과 연결됩니다." },
      ],
      exam: "소프트웨어 제품 라인은 공통성과 가변성을 분석해 코어 자산을 개발하고 제품별 가변점을 조합해 유사 제품군을 대량 생산하는 재사용 기반 방식이다.",
    }, image: "/concept/book/se-28.webp", easy: "제품을 하나씩 따로 만들지 않고, 공통 부품(Core Asset)을 먼저 만들어 두고 제품마다 조립해 내는 생산 체계입니다. 두 축으로 굴러갑니다 — Domain Engineering은 '이 도메인 제품들의 공통점과 차이점'을 분석해 핵심자산(아키텍처·컴포넌트)을 만들고 Repository에 쌓습니다. Application Engineering은 그 핵심자산을 개별 제품 요구에 맞게 Instance화해서 실제 제품을 만듭니다. 자동차 플랫폼 하나로 여러 차종을 뽑는 것과 같습니다." },
"aop": {
    guide: {
      hook: "로깅·보안처럼 '여러 곳에 흩어지는 공통 관심사'를 한 곳에 모으는 프로그래밍 패러다임입니다.",
      scene: "로깅·트랜잭션·보안 코드가 모든 메서드에 반복되면 지저분합니다(횡단 관심사). AOP는 이런 공통 기능을 따로 모듈화(Aspect)해 두고, 실행 시점에 필요한 곳에 자동으로 끼워 넣습니다.",
      why: "'횡단 관심사 분리'와 핵심 용어(Aspect·Advice·Pointcut·Join point)가 출제 핵심입니다. OOP와의 보완 관계가 포인트입니다.",
      mechanism: "횡단 관심사(Cross-cutting Concern — 로깅·보안·트랜잭션 등 여러 모듈에 흩어짐)를 Aspect로 분리. 용어: Join point(적용 가능 지점 — 메서드 호출 등), Pointcut(적용할 지점 선택 규칙), Advice(끼워 넣을 코드 — Before/After/Around), Weaving(핵심 로직에 Aspect를 짜 넣기 — 컴파일/로드/런타임). 효과: 핵심 로직과 공통 기능 분리·중복 제거·모듈성. Spring AOP가 대표. OOP를 보완.",
      map: [
        { as: "여러 곳 흩어진 공통 기능", real: "횡단 관심사", note: "" },
        { as: "따로 모듈화", real: "Aspect", note: "" },
        { as: "어디에 끼울지", real: "Pointcut", note: "" },
        { as: "끼워 넣기", real: "Weaving·Advice", note: "" },
      ],
      usage: "로깅·트랜잭션·보안(Spring)입니다. 시험은 횡단 관심사, Aspect·Advice·Pointcut, Weaving입니다.",
      links: [
        { topic: "다형성 (Polymorphism)", how: "OOP를 보완하는 패러다임입니다." },
        { topic: "디자인 패턴 (Design Pattern)", how: "관심사 분리를 공유합니다." },
      ],
      exam: "AOP는 로깅·보안 같은 횡단 관심사를 Aspect로 분리해 Pointcut이 지정한 지점에 Advice를 Weaving하는 패러다임으로, 핵심 로직과 공통 기능을 분리해 OOP를 보완한다.",
    }, image: "/concept/book/aop.webp", easy: "AOP는 여러 모듈에 공통으로 흩어져 들어가는 부가 기능(횡단 관심사 — 로깅·보안·트랜잭션)을 핵심 로직에서 분리해 두고, 필요한 지점에 자동으로 끼워 넣는 프로그래밍 기법입니다. 용어가 헷갈리는데 짝지어 보면 쉽습니다 — Joint Point는 '끼울 수 있는 모든 지점'(Where), Pointcut은 '그중 실제로 끼울 곳을 고르는 조건'(When), Advice는 '끼워 넣을 실제 코드'(What), Weaving은 '실제로 끼우는 행위'(컴파일·클래스로딩·런타임 시점), Aspect는 'Pointcut + Advice를 묶은 클래스', Target은 'Advice를 받는 클래스'입니다." },
"tailoring": {
    guide: {
      hook: "표준 방법론·프로세스를 '프로젝트 상황에 맞게 재단(조정)'하는 활동입니다.",
      scene: "정장을 몸에 맞게 수선하듯, 방법론·PMBOK을 그대로 쓰지 않고 프로젝트 규모·기간·특성에 맞게 절차·산출물을 더하거나 뺍니다. 획일 적용의 비효율을 막습니다.",
      why: "'표준의 프로젝트 맞춤 조정'과 테일러링 기준(규모·기간·복잡도)이 출제 핵심입니다. PMBOK 7판·방법론과 연결됩니다.",
      mechanism: "대상: 개발 방법론, 프로세스, 산출물, 관리 수준. 기준: 프로젝트 규모·기간·복잡도·팀 역량·중요도·기술 성숙도·요구 안정성. 방법: 추가·삭제·수정·통합. 예: 소규모는 산출물 간소화, 대규모·고위험은 관리 강화. PMBOK 7판의 지도 원칙(테일러링 강조), 방법론(구조적·객체지향·애자일) 조정. 과도·과소 테일러링 위험 관리.",
      map: [
        { as: "몸에 맞게 수선", real: "프로젝트 맞춤", note: "" },
        { as: "규모·기간·복잡도", real: "테일러링 기준", note: "" },
        { as: "추가·삭제·수정", real: "조정 방법", note: "" },
        { as: "획일 적용 방지", real: "목적", note: "" },
      ],
      usage: "방법론·프로세스 적용입니다. 시험은 테일러링 기준, 방법, PMBOK 7판과의 관계입니다.",
      links: [
        { topic: "소프트웨어 개발 방법론", how: "방법론을 프로젝트에 맞게 조정합니다." },
        { topic: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)", how: "7판이 테일러링을 강조합니다." },
      ],
      exam: "테일러링은 표준 방법론·프로세스를 프로젝트 규모·기간·복잡도 등에 맞게 추가·삭제·수정해 재단하는 활동으로, 획일 적용의 비효율을 막는다.",
    }, image: "/concept/book/tailoring.webp", easy: "테일러링은 조직 표준 프로세스를 프로젝트의 특성(규모·기간·위험)에 맞게 조정해 적용하는 활동입니다. 표준을 그대로 쓰면 소규모엔 과하고 대규모엔 모자라기 때문입니다. 절차 5단계 [특선상세문] — 프로젝트 특징 정의(프로파일 작성) → 표준 프로세스 선정 및 검증 → 상위 수준 커스터마이징(생명주기·WBS) → 세부 커스터마이징(테일러링 매트릭스·산출물 구성도·스케줄) → 문서화(적용 근거 결과서). 고려사항은 프로젝트 측면(규모·기간·조직원 경험·위험수준)과 기술적 측면(기술혁신·데이터전환·시스템연계·분산시스템)으로 나뉩니다." },
"req-engineering": {
    guide: {
      hook: "요구사항을 '도출→분석→명세→확인'하는 체계적 공학 절차입니다.",
      scene: "요구를 대충 받으면 엉뚱한 걸 만듭니다. 요구공학은 이해관계자에게서 요구를 끌어내고(도출), 충돌·우선순위를 정리하고(분석), 문서화하고(명세·SRS), 맞는지 검증하는(확인) 전 과정을 관리합니다.",
      why: "4단계 절차와 요구 변경 관리·추적성이 출제 핵심입니다. SRS·수집기법과 연결됩니다.",
      mechanism: "4활동: 도출(Elicitation — 인터뷰·워크숍·관찰 등 수집), 분석(Analysis — 충돌 해결·우선순위·모델링·타당성), 명세(Specification — SRS 작성, 기능/비기능), 확인(Validation — 리뷰·프로토타입으로 검증). 지속: 요구 변경 관리(변경 통제)·추적성(RTM — 근원~구현~테스트). 요구 품질: 완전·일관·명확·검증가능. 프로젝트 실패의 최다 원인이 요구 문제 → 공학적 관리 필요.",
      map: [
        { as: "끌어내기", real: "도출(수집기법)", note: "" },
        { as: "충돌·우선순위 정리", real: "분석", note: "" },
        { as: "SRS 문서화", real: "명세", note: "" },
        { as: "맞는지 검증", real: "확인(리뷰)", note: "" },
      ],
      usage: "요구 관리·프로젝트 품질입니다. 시험은 4단계, 변경 관리·추적성, SRS입니다.",
      links: [
        { topic: "요구사항 수집기법", how: "도출 단계의 기법입니다." },
        { topic: "요구사항 명세서 SRS", how: "명세 단계의 산출물입니다." },
      ],
      exam: "요구공학은 요구를 도출·분석·명세(SRS)·확인하는 체계적 절차로, 요구 변경 관리와 추적성(RTM)으로 완전·일관·검증가능한 요구를 확보한다.",
    }, image: "/concept/book/req-engineering.webp", easy: "요구사항을 다루는 전 과정을 체계로 묶은 것입니다. 크게 둘 — 요구사항 개발(CMMi L3) = 추출 → 분석 → 명세 → 검증 [추분명검], 요구사항 변경관리(CMMi L2) = 협상 → 기준선 → 변경관리 → 확인 및 검증 [협기변검]. 여기서 기준선(Baseline)이 핵심인데, 공식 합의된 명세서를 못 박아 두고 이후 모든 변경을 그 기준선 대비로 통제합니다. 좋은 요구사항의 조건 9개는 [정명완검일수추리해] — 정확성·명확성·완전성·검증성·일관성·수정성·추적성·이해성·해석성." },
"se-34": {
    guide: {
      hook: "'가상의 대표 사용자'를 구체적 인물로 만들어 사용자 중심 설계를 돕는 기법입니다.",
      scene: "'사용자'는 막연하지만, '35세 워킹맘 김지영, 출퇴근 중 앱 사용'처럼 구체 인물로 만들면 팀 전체가 같은 사용자를 떠올립니다. 페르소나는 실제 데이터 기반의 가상 사용자로 요구·설계 판단의 기준이 됩니다.",
      why: "'구체적 가상 사용자'와 UX·요구공학·디자인 씽킹에서의 역할이 출제 포인트입니다.",
      mechanism: "구성: 이름·사진·인구통계·목표·행동 패턴·불편(pain point)·시나리오 — 사용자 조사(인터뷰·데이터) 기반으로 작성. 유형: 주 페르소나(핵심 타깃)·부 페르소나. 활용: 요구 우선순위 판단('이 페르소나가 원할까'), 기능 결정, 팀 공감대 형성, 시나리오·여정 지도. 디자인 씽킹·UX 설계의 도구. 실 데이터 없이 만들면 편향 위험.",
      map: [
        { as: "구체적 가상 인물", real: "페르소나", note: "" },
        { as: "실 조사 기반", real: "데이터 근거", note: "" },
        { as: "이 사람이 원할까", real: "요구 판단 기준", note: "" },
        { as: "팀 공감대", real: "활용", note: "" },
      ],
      usage: "UX·요구·디자인 씽킹입니다. 시험은 페르소나 구성, 역할, 디자인 씽킹과의 관계입니다.",
      links: [
        { topic: "디자인 씽킹(Design Thinking)", how: "공감 단계의 도구입니다." },
        { topic: "요구공학 (Requirements Engineering)", how: "요구 도출·우선순위에 활용됩니다." },
      ],
      exam: "페르소나는 실 사용자 조사 기반의 구체적 가상 사용자로 목표·행동·불편을 담아, 요구 우선순위 판단과 팀 공감대 형성에 쓰이는 UX·디자인 씽킹 도구다.",
    }, image: "/concept/book/se-34.webp", easy: "'사용자'라고 뭉뚱그리면 설계 결정을 못 내리니, 실제 있을 법한 가상 인물 한 명을 구체적으로 만들어 놓고 그 사람 기준으로 판단하는 기법입니다. 이름·나이·직업·목표(Goals)·불만(Frustrations)까지 적습니다. 만드는 순서는 사용자 범주 파악 → 단서 분류 → 세부 범주·기간구조 → 평가·우선순위 → 페르소나 작성 → 평가 → 설문으로 프로파일 확정. 사용자 분석 기법에는 페르소나 말고도 인지(어떻게 인지하나), 역할(사용 행태), 사회기술(조직 특성) 모형이 있습니다." },
"iso-42010": {
    guide: {
      hook: "'소프트웨어 아키텍처를 어떻게 기술할지' 정한 국제 표준(2022 개정)입니다.",
      scene: "아키텍처를 사람마다 다르게 그리면 소통이 안 됩니다. 42010은 이해관계자·관심사·관점(viewpoint)·뷰(view)로 아키텍처 기술을 표준화해, 누가 봐도 이해되게 만듭니다.",
      why: "핵심 개념(이해관계자·관심사·관점·뷰)의 관계가 출제 핵심입니다. 4+1 뷰·아키텍처 문서화와 연결됩니다.",
      mechanism: "핵심 개념: 이해관계자(Stakeholder)의 관심사(Concern)를 다루기 위해, 관점(Viewpoint — 뷰를 만드는 규칙·표기)에 따라 뷰(View — 특정 관심사 관점의 아키텍처 표현)를 작성. 아키텍처 기술서(AD)가 이들을 담음. 대응 규칙(뷰 간 일관성), 근거(rationale). 관심사와 뷰의 매핑으로 완전성 확인. 4+1 뷰 모델이 이 표준의 구체적 적용. 2022 개정으로 시스템·기업 아키텍처까지 확장.",
      map: [
        { as: "누가 관심 갖나", real: "이해관계자·관심사", note: "" },
        { as: "뷰 만드는 규칙", real: "관점(Viewpoint)", note: "" },
        { as: "특정 관심사 표현", real: "뷰(View)", note: "" },
        { as: "4+1 뷰가 적용", real: "구체화", note: "" },
      ],
      usage: "아키텍처 문서화 표준입니다. 시험은 이해관계자·관심사·관점·뷰, 4+1 뷰와의 관계입니다.",
      links: [
        { topic: "UML의 4+1 View Model", how: "42010의 뷰 개념을 구현합니다." },
        { topic: "SW Architecture 구축 절차", how: "아키텍처 기술의 절차와 연계됩니다." },
      ],
      exam: "ISO/IEC/IEEE 42010은 이해관계자의 관심사를 관점(Viewpoint)에 따라 뷰(View)로 기술하는 아키텍처 문서화 표준으로, 4+1 뷰 모델이 그 구체적 적용이다.",
    }, image: "/concept/book/iso-42010.webp", easy: "'아키텍처 문서에 무엇을 어떻게 적을 것인가'를 표준화한 메타모델입니다. 핵심 연결고리만 잡으면 됩니다 — 이해관계자(Stakeholder)에게는 관심사(Concern)가 있고, 그 관심사를 다루는 규칙이 관점(Viewpoint), 그 관점으로 실제 그려낸 것이 뷰(View)이며, 뷰들을 모은 것이 아키텍처 기술서(Architecture Description)입니다. 왜 그렇게 설계했는지는 Rationale에 남기고, 뷰들 사이의 일관성은 Correspondence로 표현합니다. 2022년판에서 Entity of Interest, Stakeholder Perspective, Architecture Aspect가 추가됐습니다." },
"sw-arch-process": {
    guide: {
      hook: "아키텍처를 '요구에서 평가까지' 체계적으로 만드는 구축 절차입니다.",
      scene: "아키텍처는 감으로 그리는 게 아닙니다. 품질 요구(드라이버)를 파악하고, 스타일·패턴을 선택해 설계하고, 뷰로 문서화하고, 평가해 검증하는 절차를 밟습니다.",
      why: "구축 단계와 품질 속성 중심 설계(ADD)가 출제 핵심입니다. 드라이버·평가와 연결됩니다.",
      mechanism: "절차: 아키텍처 요구 분석(기능 + 품질 속성·제약 = 아키텍처 드라이버 도출) → 아키텍처 설계(ADD — 속성 주도 설계, 스타일·패턴·전술 선택으로 품질 달성) → 문서화(4+1 뷰·42010) → 평가(ATAM·CBAM 등으로 품질 속성 검증) → 구현·유지. 반복적. 핵심은 품질 속성(성능·보안·가용성 등)을 아키텍처로 실현. 트레이드오프 관리.",
      map: [
        { as: "품질 요구 파악", real: "드라이버 도출", note: "" },
        { as: "스타일·패턴 선택", real: "아키텍처 설계(ADD)", note: "" },
        { as: "뷰로 문서화", real: "4+1 뷰·42010", note: "" },
        { as: "평가로 검증", real: "ATAM·CBAM", note: "" },
      ],
      usage: "아키텍처 설계 프로세스입니다. 시험은 구축 단계, ADD, 드라이버·평가와의 연계입니다.",
      links: [
        { topic: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)", how: "설계를 이끄는 요구입니다." },
        { topic: "SW Architecture 평가", how: "구축 후 검증 단계입니다." },
      ],
      exam: "SW 아키텍처 구축 절차는 드라이버(품질 요구) 도출→속성 주도 설계(ADD)→4+1 뷰 문서화→ATAM/CBAM 평가의 반복 과정으로, 품질 속성을 아키텍처로 실현한다.",
    }, image: "/concept/book/sw-arch-process.webp", easy: "요구사항에서 출발해 아키텍처를 설계하고 검증·승인하는 표준 절차 4단계입니다. ① 요구사항 분석 — 기능/비기능 요구를 식별·명세·검증. ② 아키텍처 분석 — 품질속성을 식별하고 우선순위를 매김(여기가 아키텍처의 진짜 출발점). ③ 아키텍처 설계 — 이해관계자별 관점(view) 정의 → 아키텍처 스타일 선택(pipe-filter, mvc, layer 등 혼용) → 후보 아키텍처 도출(배경도·관점별 다이어그램·SAD 작성). ④ 검증 및 승인 — 아키텍처 평가(요구 만족도·품질속성 간 관계) → 상세화 반복 → 최종 승인. 설계와 평가를 반복하는 게 포인트입니다." },
"se-67": {
    guide: {
      hook: "'비즈니스 규칙을 프레임워크·DB로부터 독립'시키는 계층형 아키텍처입니다.",
      scene: "핵심 업무 로직이 특정 DB나 웹 프레임워크에 얽히면 바꾸기 어렵습니다. 클린 아키텍처는 동심원 계층으로, 안쪽(핵심 규칙)은 바깥(프레임워크·DB·UI)을 모르게 하고 의존은 항상 안쪽으로만 향하게 합니다.",
      why: "'의존성 규칙(안쪽으로만)'과 계층(엔티티·유스케이스·인터페이스·프레임워크), DIP가 출제 핵심입니다.",
      mechanism: "동심원 계층(안→밖): 엔티티(핵심 업무 규칙), 유스케이스(애플리케이션 규칙), 인터페이스 어댑터(컨트롤러·게이트웨이·프리젠터), 프레임워크·드라이버(웹·DB·UI). 의존성 규칙: 소스 코드 의존성은 항상 안쪽(고수준)을 향함(바깥이 안을 참조, 안은 바깥 모름) — DIP·경계에서 의존성 역전. 효과: 프레임워크·DB·UI 교체 용이, 테스트 용이(핵심 규칙 독립). 헥사고날(포트&어댑터)·오니언 아키텍처와 유사.",
      map: [
        { as: "핵심 규칙 중심", real: "엔티티·유스케이스", note: "안쪽" },
        { as: "프레임워크는 바깥", real: "세부사항", note: "교체 가능" },
        { as: "의존은 안쪽으로만", real: "의존성 규칙", note: "핵심" },
        { as: "경계에서 역전", real: "DIP", note: "" },
      ],
      usage: "유지보수·테스트 용이 아키텍처입니다. 시험은 의존성 규칙, 계층, 헥사고날과의 관계입니다.",
      links: [
        { topic: "객체지향 설계 원리", how: "DIP가 클린 아키텍처의 기초입니다." },
        { topic: "DDD (Domain Driven Design)", how: "도메인 중심 설계와 결합됩니다." },
      ],
      exam: "클린 아키텍처는 엔티티·유스케이스·어댑터·프레임워크 동심원 계층에서 의존성이 항상 안쪽(핵심 규칙)을 향하게 해, DB·프레임워크·UI를 교체·테스트하기 쉽게 만든다.",
    }, image: "/concept/book/se-67.webp", easy: "업무 규칙을 중심에 두고 의존성이 바깥에서 안쪽으로만 향하게 하는 동심원 4겹 구조의 아키텍처입니다. 가운데부터 Entity(핵심 업무 규칙) → Use Case(응용 업무 규칙) → Interface Adapter(Presenter·View·Controller, 도메인과 인프라 사이의 번역기) → External Interface(UI·DB·프레임워크·장치). 규칙은 딱 하나 — **의존성은 항상 바깥에서 안쪽으로만 향한다.** 그래서 DB를 바꾸거나 웹 프레임워크를 갈아치워도 안쪽 업무 규칙은 그대로입니다. 가장 자주 바뀌는 것(프레임워크)을 가장 바깥에 두고, 가장 안 바뀌는 것(업무 규칙)을 한가운데 둔 구조입니다." },
"sw-arch-driver": {
    guide: {
      hook: "아키텍처 설계를 '이끄는 핵심 요구' — 품질 속성·제약·비즈니스 목표입니다.",
      scene: "모든 요구가 아키텍처를 좌우하진 않습니다. 아키텍처 드라이버는 '초당 1만 건 처리(성능)', '99.99% 가용성' 같은 핵심 품질 요구로, 설계 결정을 결정적으로 좌우합니다. 이걸 먼저 뽑아야 설계 방향이 섭니다.",
      why: "드라이버 4종(기능·품질속성·제약·아키텍처 관심사)과 품질 속성 중심 설계가 출제 핵심입니다.",
      mechanism: "구성: 주요 기능 요구(핵심 유스케이스), 품질 속성 요구(성능·가용성·보안·확장성·수정용이성 등 — 가장 중요), 제약(기술·조직·법규 — 협상 불가), 아키텍처 관심사(공통 인프라·이슈). 품질 속성 시나리오로 구체화(자극-응답-측정). 드라이버가 스타일·패턴·전술 선택을 이끔(ADD). 우선순위 부여. 설계 초기에 도출.",
      map: [
        { as: "핵심 유스케이스", real: "기능 요구", note: "" },
        { as: "성능·가용성·보안", real: "품질 속성", note: "가장 중요" },
        { as: "협상 불가 제약", real: "제약사항", note: "" },
        { as: "설계 결정 좌우", real: "설계 견인", note: "" },
      ],
      usage: "아키텍처 설계 입력입니다. 시험은 드라이버 4종, 품질 속성 시나리오, ADD와의 관계입니다.",
      links: [
        { topic: "SW Architecture 구축 절차", how: "드라이버가 설계를 이끕니다." },
        { topic: "소프트웨어 품질 속성 시나리오", how: "품질 속성을 구체화합니다." },
      ],
      exam: "아키텍처 드라이버는 핵심 기능·품질 속성·제약·아키텍처 관심사로 구성된 설계 견인 요구로, 특히 품질 속성이 스타일·패턴·전술 선택을 좌우한다.",
    }, image: "/concept/book/sw-arch-driver.webp", easy: "아키텍처 드라이버는 수많은 요구사항 중 아키텍처 결정에 실제로 영향을 주는 핵심 요구만 골라낸 것입니다. 요구가 수백 개라도 아키텍처를 좌우하는 건 이 몇 개뿐입니다. 세 종류 — 기능 요구사항(시스템이 해야 할 기본 기능), 품질 요구사항(1분 간격으로 10만 명에게처럼 도달해야 할 목표 수준), 제약사항(J2EE로 개발하라처럼 시스템과 무관하게 주어진 조건). 비기능 제약은 다시 기술적 제약(레거시·신기술), 비즈니스 제약(거버넌스·전략, 대부분 타협 불가), 품질 제약(확장성·가용성·이식성 등)으로 나뉩니다. 적정 개수는 10개 미만입니다." },
"utility-tree": {
    guide: {
      hook: "품질 속성 요구를 '트리로 구조화하고 우선순위'를 매기는 아키텍처 평가 도구입니다.",
      scene: "'좋은 성능·보안'은 막연합니다. 유틸리티 트리는 품질(루트)→속성(성능·보안)→하위 속성→구체 시나리오로 가지치며, 각 시나리오에 중요도·난이도를 매겨 어디에 집중할지 정합니다. ATAM 평가의 핵심입니다.",
      why: "'품질 속성의 구조화·우선순위'와 ATAM에서의 역할이 출제 핵심입니다.",
      mechanism: "구조: 유틸리티(루트) → 품질 속성(성능·가용성·보안·수정용이성 등) → 속성 정제 → 품질 속성 시나리오(리프, 자극-응답-측정). 각 시나리오에 (중요도, 실현 난이도/위험)을 (H/M/L)로 평가 → 우선순위 도출(둘 다 High가 최우선). ATAM(아키텍처 트레이드오프 분석)에서 이해관계자와 함께 작성해 평가 대상 시나리오를 선정. 품질 요구를 구체·측정 가능하게.",
      map: [
        { as: "품질을 트리로", real: "유틸리티→속성→시나리오", note: "" },
        { as: "구체 시나리오(리프)", real: "품질 속성 시나리오", note: "" },
        { as: "중요도·난이도 평가", real: "우선순위", note: "H/M/L" },
        { as: "ATAM 평가 도구", real: "역할", note: "" },
      ],
      usage: "아키텍처 평가·품질 우선순위입니다. 시험은 트리 구조, 우선순위, ATAM에서의 역할입니다.",
      links: [
        { topic: "소프트웨어 품질 속성 시나리오", how: "트리의 리프가 시나리오입니다." },
        { topic: "SW Architecture 평가", how: "ATAM에서 유틸리티 트리를 씁니다." },
      ],
      exam: "유틸리티 트리는 품질 속성을 유틸리티→속성→시나리오로 구조화하고 중요도·난이도로 우선순위를 매기는 도구로, ATAM 평가에서 대상 시나리오 선정에 쓰인다.",
    }, image: "/concept/book/utility-tree.webp", easy: "품질 요구를 나무 모양으로 잘게 쪼개 시나리오까지 내려가는 도구입니다. 순서는 ①유틸리티 → ②품질속성(성능·확장성·신뢰성) → ③세분화된 품질속성(메시지 전달 속도, 동시 연결) → ④시나리오(Data 지연 5sec 이내, 동시 사용 최대 100명). 즉 추상적인 '빨라야 한다'를 측정 가능한 문장으로 바꾸는 과정입니다. 브레인스토밍과 비교하면 — 유틸리티 트리는 아키텍트 2~3명이 품질속성에서 시나리오를 뽑는 Bottom Up 방식, 브레인스토밍은 이해관계자 5~10명이 시나리오에서 품질속성을 뽑는 Top-Down 방식입니다." },
"quality-attribute-scenario": {
    guide: {
      hook: "품질 요구를 '측정 가능한 시나리오'로 구체화한 6요소 틀입니다.",
      scene: "'빨라야 한다'는 검증 불가입니다. 품질 속성 시나리오는 '정상 부하에서(자극원·환경) 요청이 오면(자극) 시스템이(대상) 2초 내 응답한다(응답·측정)'처럼 6요소로 써서 테스트·평가 가능하게 만듭니다.",
      why: "6요소(자극원·자극·환경·대상·응답·응답측정)와 품질 속성별 시나리오가 출제 핵심입니다.",
      mechanism: "6요소: 자극원(Source — 자극을 발생시키는 주체), 자극(Stimulus — 도착하는 조건/이벤트), 환경(Environment — 자극 발생 시 상태, 예: 정상·과부하), 대상(Artifact — 자극받는 부분), 응답(Response — 시스템의 반응), 응답 측정(Response Measure — 정량 기준). 품질별: 성능(응답시간·처리량), 가용성(장애·복구 시간), 수정용이성(변경·소요), 보안(공격·탐지). 유틸리티 트리의 리프. 테스트·평가의 기준.",
      map: [
        { as: "자극 주체·조건", real: "자극원·자극", note: "" },
        { as: "발생 시 상태", real: "환경", note: "정상/과부하" },
        { as: "시스템 반응", real: "응답", note: "" },
        { as: "정량 기준", real: "응답 측정", note: "검증 가능" },
      ],
      usage: "품질 요구 명세·평가입니다. 시험은 6요소, 품질별 시나리오, 유틸리티 트리와의 관계입니다.",
      links: [
        { topic: "유틸리티 트리 (Utility Tree)", how: "시나리오가 트리의 리프입니다." },
        { topic: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)", how: "품질 속성을 구체화합니다." },
      ],
      exam: "품질 속성 시나리오는 자극원·자극·환경·대상·응답·응답측정 6요소로 품질 요구를 측정 가능하게 구체화한 틀로, 아키텍처 평가·테스트의 기준이 된다.",
    }, image: "/concept/book/quality-attribute-scenario.webp", easy: "품질 요구를 검증 가능하도록 6개 항목으로 구조화해 적는 명세 방법입니다. '가용성이 높아야 한다' 같은 말은 검증할 수 없으니 이렇게 쪼갭니다 — 자극 유발원(누가), 자극(무엇이 일어나서), 환경(어떤 상황에서), 대상(무엇에게), 응답(시스템이 어떻게 반응하고), 응답 측정(그걸 어떻게 숫자로 확인하나). 예를 들어 가용성이라면 '외부에서(유발원) 예기치 못한 메시지가 와서(자극) 정상 운영 중(환경) 프로세스에(대상) 운영자에게 통지 후 계속 수행하며(응답) 정지 시간 0(응답 측정)'. 마지막 응답 측정이 있어야 나중에 검증이 됩니다." },
"sw-arch-style": {
    guide: {
      hook: "검증된 아키텍처 구조의 '전형적 틀' — 계층형·MSA·이벤트 기반 등입니다.",
      scene: "아키텍처를 매번 새로 발명하지 않고, 문제 유형에 맞는 검증된 구조를 씁니다. 계층으로 나눌지, 서비스로 쪼갤지, 이벤트로 연결할지 — 각 스타일은 장단·적합 상황이 다릅니다.",
      why: "주요 스타일의 구조·장단·적합 상황이 출제 핵심입니다. 품질 속성과의 트레이드오프가 포인트입니다.",
      mechanism: "주요 스타일: 계층형(Layered — 관심사 분리, 단순·유지보수 / 성능↓), 클라이언트-서버, 파이프-필터(데이터 흐름·변환), 이벤트 기반(느슨한 결합·확장), MSA(독립 서비스·확장·배포 / 복잡), 마이크로커널(플러그인), P2P, 브로커, MVC(UI 분리), SOA. 선택: 품질 속성 드라이버에 맞춰(확장성→MSA, 단순성→계층형). 스타일마다 품질 트레이드오프. 패턴보다 상위 구조.",
      map: [
        { as: "계층으로 분리", real: "계층형(Layered)", note: "단순·유지보수" },
        { as: "서비스로 쪼갬", real: "MSA", note: "확장·복잡" },
        { as: "이벤트로 연결", real: "이벤트 기반", note: "느슨한 결합" },
        { as: "데이터 변환 흐름", real: "파이프-필터", note: "" },
      ],
      usage: "아키텍처 구조 선택입니다. 시험은 스타일별 장단·적합 상황, 품질 트레이드오프입니다.",
      links: [
        { topic: "MSA (Micro Service Architecture)", how: "대표적 아키텍처 스타일입니다." },
        { topic: "Event Driven Architecture", how: "이벤트 기반 스타일입니다." },
      ],
      exam: "SW 아키텍처 스타일은 계층형·클라이언트서버·파이프필터·이벤트 기반·MSA 등 검증된 구조 틀로, 품질 속성 드라이버에 맞춰 선택하며 스타일마다 트레이드오프가 있다.",
    }, image: "/concept/book/sw-arch-style.webp", easy: "설계할 때 반복해서 나오는 문제의 정답지 모음입니다. 무엇을 중심에 두느냐로 묶으면 외워집니다 — 데이터 중심(칠판형·저장소형: 공유 데이터가 주인공), 데이터 흐름(일괄 순차형·파이프 필터형: 데이터가 흘러가며 변형됨), 가상 머신(번역기형·규칙기반: 이식성과 시뮬레이션), 호출과 리턴(주프로그램-서브루틴·원격 프로시저 호출·Layered·Client-Server: 누가 누구를 부르나), 분산 구조(Master-Slave·MSA), 중계(Event-bus·Broker: 중간에 전달자를 둠). 교재 두음이 [칠저일파 번규주원래클 마슬마서 이브]입니다." },
"se-59": {
    guide: {
      hook: "아키텍처가 '품질 요구를 충족하는지' 이해관계자와 검증하는 활동입니다.",
      scene: "구현 후 문제를 발견하면 늦습니다. 아키텍처 평가는 설계 단계에서 '이 구조로 성능·보안·수정용이성이 될까'를 시나리오로 점검해, 위험·트레이드오프를 조기에 찾습니다. 대표가 ATAM입니다.",
      why: "평가 방법(ATAM·CBAM·SAAM)과 산출물(위험·민감점·트레이드오프점)이 출제 핵심입니다.",
      mechanism: "방법: SAAM(수정용이성 중심·초기), ATAM(Architecture Tradeoff Analysis Method — 품질 속성 간 트레이드오프 분석, 유틸리티 트리·시나리오 기반, 대표), CBAM(비용-효익 추가), ARID. ATAM 산출물: 위험(Risk)·비위험(Non-risk), 민감점(Sensitivity Point — 한 결정이 특정 품질에 크게 영향), 트레이드오프점(Tradeoff Point — 여러 품질에 상충 영향). 이해관계자 참여. 조기 위험 발견으로 재작업 비용↓.",
      map: [
        { as: "설계 단계 검증", real: "조기 평가", note: "" },
        { as: "트레이드오프 분석", real: "ATAM", note: "대표" },
        { as: "비용-효익 추가", real: "CBAM", note: "" },
        { as: "위험·민감점·트레이드오프점", real: "산출물", note: "" },
      ],
      usage: "아키텍처 검증입니다. 시험은 ATAM·CBAM·SAAM, 민감점·트레이드오프점입니다.",
      links: [
        { topic: "CBAM(Cost Benefit Analysis Method)", how: "비용-효익을 더한 평가입니다." },
        { topic: "유틸리티 트리 (Utility Tree)", how: "ATAM의 핵심 도구입니다." },
      ],
      exam: "SW 아키텍처 평가는 ATAM·CBAM·SAAM으로 설계가 품질 요구를 충족하는지 시나리오로 검증하며, 위험·민감점·트레이드오프점을 조기에 발견해 재작업을 줄인다.",
    }, image: "/concept/book/se-59.webp", easy: "아키텍처가 품질 요구를 만족하는지 검사하는 방법들이며, 계보를 따라가면 정리됩니다. SAAM이 최초(수정 가능성·기능성 중심) → 이를 계승해 ATAM이 나왔고(품질 목표 사이의 Trade-off를 찾는 것이 핵심) → ATAM에 경제성 평가를 보탠 것이 CBAM(비용 대비 편익으로 투자 판단) → Product Line까지 확장한 것이 EATAM. 여기까지가 시나리오 기반입니다. 설계/혼합 기반으로 ADR(구성요소 간 응집도 평가)과 ARID(설계가 일부만 끝났어도 평가 가능, ATAM·SAAM에 설계검토 ARD를 섞음)가 있습니다." },
"gj-144": {
    guide: {
      hook: "투자할 가치가 있는지 '돈으로' 따지는 타당성 분석 기법들입니다.",
      scene: "프로젝트에 투자하기 전 '남는 장사인가'를 재무 지표로 검증합니다. 회수 기간, 투자 수익률, 화폐의 시간가치를 반영한 순현재가치·내부수익률 등으로 대안을 비교해 의사결정을 돕습니다.",
      why: "화폐 시간가치 반영 여부(비할인 vs 할인)와 지표별 판단 기준이 출제 핵심입니다. NPV·IRR·B/C가 자주 나옵니다.",
      mechanism: "비할인법(시간가치 무시): 회수기간법(Payback — 투자금 회수 소요 기간, 짧을수록 좋음), ROI(투자수익률), 회계적 이익률. 할인법(시간가치 반영): NPV(순현재가치 — 미래 현금흐름 현재가치 합 − 투자, >0이면 채택), IRR(내부수익률 — NPV=0인 할인율, 자본비용보다 크면 채택), B/C 비율(편익/비용, >1 채택), PI(수익성 지수). 할인법이 정확. 상호배타 대안은 NPV 우선.",
      map: [
        { as: "투자금 회수 기간", real: "회수기간법", note: "비할인" },
        { as: "현재가치 순증가", real: "NPV", note: ">0 채택" },
        { as: "NPV=0 할인율", real: "IRR", note: "자본비용 초과" },
        { as: "편익/비용", real: "B/C 비율", note: ">1 채택" },
      ],
      usage: "투자 타당성·프로젝트 선정입니다. 시험은 비할인/할인 구분, NPV·IRR·B/C 판단 기준입니다.",
      links: [
        { topic: "IT 투자성과 평가", how: "IT 투자 타당성 평가에 활용됩니다." },
        { topic: "기술 가치 평가", how: "수익법(DCF)이 같은 원리입니다." },
      ],
      exam: "경제성 분석은 회수기간·ROI 같은 비할인법과 NPV·IRR·B/C 같은 할인법으로 투자 타당성을 따지며, 화폐 시간가치를 반영한 할인법이 더 정확하고 NPV를 우선한다.",
    }, image: "/concept/book/gj-144.webp", easy: "이 프로젝트를 할지 말지를 돈으로 따지는 네 가지 잣대입니다. BCR은 '1원 넣어 몇 원 버나'(수익/비용, 1보다 크면 남는 장사). PP는 '넣은 돈 언제 다 회수하나'(짧을수록 좋지만 회수 이후 수익은 안 봄). NPV는 '미래에 들어올 돈을 오늘 돈 가치로 환산하면 얼마 남나'(0보다 크면 해도 됨). IRR은 'NPV를 딱 0으로 만드는 할인율'로, 이 값이 우리 요구수익률보다 높으면 합니다. BCR·PP는 계산이 쉬운 대신 화폐의 시간가치를 못 보고, NPV·IRR은 시간가치를 반영합니다." },
"pm-plan-doc": {
    guide: {
      hook: "프로젝트를 '어떻게 실행·감시·통제할지' 정의한 통합 관리 문서입니다.",
      scene: "프로젝트의 헌법 같은 문서입니다. 범위·일정·원가·품질·자원·위험 등 각 영역을 어떻게 관리할지 계획(보조 계획서)과 기준선(범위·일정·원가)을 담아, 실행과 통제의 기준이 됩니다.",
      why: "구성(보조 관리 계획서 + 기준선)과 '착수→기획 산출물'이라는 위치가 출제 포인트입니다. 프로젝트 헌장과의 구분이 핵심입니다.",
      mechanism: "구성: 보조 관리 계획서(범위·요구·일정·원가·품질·자원·의사소통·위험·조달·이해관계자 관리 계획), 기준선(Baseline — 범위·일정·원가, 성과 측정 기준), 부가 요소(변경·형상 관리 계획, 생애주기). 프로젝트 헌장(착수 승인·PM 권한 부여, 상위)과 구분 — 관리 계획서는 기획 프로세스 산출물. 승인 후 변경은 통합 변경 통제로. EVM의 기준선 제공.",
      map: [
        { as: "영역별 관리 방법", real: "보조 관리 계획서", note: "" },
        { as: "성과 측정 기준", real: "기준선(범위·일정·원가)", note: "" },
        { as: "착수 승인은 헌장", real: "헌장과 구분", note: "" },
        { as: "변경은 통합 통제", real: "변경 관리", note: "" },
      ],
      usage: "프로젝트 실행·통제의 기준 문서입니다. 시험은 구성(계획서+기준선), 헌장과의 구분입니다.",
      links: [
        { topic: "범위관리", how: "범위 관리 계획·기준선을 포함합니다." },
        { topic: "EVM(Earned Value Management, 획득 가치 관리)", how: "관리 계획서의 기준선으로 성과를 측정합니다." },
      ],
      exam: "프로젝트 관리 계획서는 영역별 보조 관리 계획서와 범위·일정·원가 기준선을 담은 통합 문서로, 실행·감시·통제의 기준이 되며 착수 문서인 프로젝트 헌장과 구분된다.",
    }, image: "/concept/book/pm-plan-doc.webp", easy: "프로젝트 관리 계획서는 프로젝트를 계획·실행·감시통제·종료하는 방법을 명시한 여러 보조 관리 계획서(범위·일정·품질 등)를 하나로 통합한 최상위 문서입니다. 목차 9개를 두음 [개업일인교통품인측]으로 외웁니다 — 개요(전반 설명)·업무 범위(명확한 정의 수립)·일정계획(납기 달성 목표)·인력관리·교육계획(인력·고객 교육)·프로젝트 통제(이슈 모니터링을 통한 예방·통제)·품질활동 계획(정기·비정기 품질활동)·인수 조건(종료 시 인수 조건 설명)·측정 계획(검수용 성과 측정). 즉 '무엇을·언제·누가·어떻게 확인하고 넘길지'를 한 문서에 다 적어 둔 것입니다. 답안에서는 '보조 계획서의 통합 문서'라는 정의와 목차 두음을 쓰면 되고, 인수 조건·측정 계획처럼 '끝맺음' 항목까지 포함한다는 점이 차별화 포인트입니다." },
"pm-24": {
    guide: {
      hook: "'무엇을 하고 무엇을 안 할지'를 정의·통제하는 범위 관리입니다.",
      scene: "프로젝트가 실패하는 흔한 이유가 범위 혼선입니다. 범위 관리는 요구를 모아 무엇을 만들지 정의하고(범위기술서·WBS), 실제로 그 범위대로 됐는지 확인하며, 무단 변경(스코프 크립)을 통제합니다.",
      why: "범위 관리 프로세스와 제품/프로젝트 범위 구분이 출제 핵심입니다. 범위 확인(검수) vs 통제(변경)가 포인트입니다.",
      mechanism: "프로세스: 범위 관리 계획 → 요구사항 수집 → 범위 정의(범위기술서 — 인수 기준·제외사항) → WBS 생성(작업 패키지로 분해) → 범위 확인(Validate — 고객이 산출물 검수·인수) → 범위 통제(Control — 변경을 기준선 대비 관리, 스코프 크립 방지). 제품 범위(제품 특성)+프로젝트 범위(작업). 범위 확인(고객 수용)과 품질 통제(내부 검사)는 구분.",
      map: [
        { as: "무엇을 만들지 정의", real: "범위 정의·WBS", note: "" },
        { as: "고객 검수·인수", real: "범위 확인(Validate)", note: "" },
        { as: "무단 변경 통제", real: "범위 통제(Control)", note: "스코프 크립" },
        { as: "제품+프로젝트 범위", real: "범위 구분", note: "" },
      ],
      usage: "프로젝트 범위 정의·통제입니다. 시험은 프로세스, 범위 확인 vs 통제, 제품/프로젝트 범위입니다.",
      links: [
        { topic: "WBS (Work Breakdown Structure)", how: "범위를 작업으로 분해합니다." },
        { topic: "Scope Creep vs Gold-Plating", how: "범위 통제로 이탈을 막습니다." },
      ],
      exam: "범위관리는 요구 수집·범위 정의·WBS·범위 확인(고객 검수)·범위 통제(변경 관리)의 프로세스로 무엇을 할지 정의·통제하며, 제품 범위와 프로젝트 범위를 포함한다.",
    }, image: "/concept/book/pm-24.webp", easy: "범위관리는 '어디까지가 이 프로젝트 일인가'를 정하고 지키는 지식영역입니다. 6개 프로세스로 흐릅니다 — 범위관리 계획 수립(어떻게 관리할지) → 요구사항 수집(이해관계자가 뭘 원하나) → 범위 정의(범위기술서 작성) → WBS 작성(인도물을 작업으로 분할) → 범위 확인(고객의 공식 승인) → 범위 통제(변경 관리). 앞 4개는 계획 프로세스 그룹, 뒤 2개는 감시·통제 그룹입니다. 범위 확인(Validation)은 '고객이 인도물을 공식 인수'하는 것이라 품질통제의 검사(Verification, 요구사항 충족 확인)와 구분되고, 승인 없이 슬금슬금 범위가 커지는 스코프 크립(Scope Creep)을 막는 것이 범위 통제의 핵심 — 이 두 구분이 시험 포인트입니다." },
"pm-25": {
    guide: {
      hook: "이해관계자로부터 '진짜 필요한 것'을 끌어내는 여러 수집 기법입니다.",
      scene: "고객이 원하는 것을 정확히 말하지 못하는 경우가 많습니다. 그래서 인터뷰·워크숍·설문·관찰·프로토타입 등 여러 방법을 상황에 맞게 써서 요구사항을 빠짐없이 끌어냅니다.",
      why: "기법별 특성·적합 상황이 출제 핵심입니다. 요구공학(도출→분석→명세→검증)의 도출 단계이며 SRS로 이어집니다.",
      mechanism: "기법: 인터뷰(1:1 심층), 브레인스토밍(다수 발산), 델파이(전문가 익명 합의), 워크숍/JAD(집중 협의), 설문(대규모), 관찰(현장 업무), 프로토타이핑(불명확 요구 구체화), 문서 분석, 벤치마킹. 선택 기준: 이해관계자 수·요구 명확성·시간. 도출된 요구는 분석·명세(SRS)·검증으로 이어짐.",
      map: [
        { as: "1:1 심층 파악", real: "인터뷰", note: "" },
        { as: "전문가 익명 합의", real: "델파이", note: "" },
        { as: "집중 협의", real: "워크숍/JAD", note: "" },
        { as: "불명확 요구 구체화", real: "프로토타이핑", note: "" },
      ],
      usage: "요구공학 도출 단계입니다. 시험은 기법별 특성·적합 상황, SRS와의 연계입니다.",
      links: [
        { topic: "요구사항 명세서 SRS", how: "수집한 요구를 명세로 정리합니다." },
        { topic: "디자인 씽킹(Design Thinking)", how: "사용자 공감·관찰 기법을 공유합니다." },
      ],
      exam: "요구사항 수집기법은 인터뷰·델파이·워크숍·설문·관찰·프로토타이핑 등으로 이해관계자 요구를 도출하는 기법으로, 상황에 맞게 선택해 SRS로 명세화한다.",
    }, image: "/concept/book/pm-25.webp", easy: "요구사항 수집기법은 이해관계자가 원하는 것을 끌어내 문서화하기 위한 기법 모음입니다. 성격별로 묶으면 [수분표의대프컨] — 데이터 수집(인터뷰·포커스그룹·설문·벤치마킹·브레인스토밍), 데이터 분석(문서 분석), 데이터 표현(마인드매핑·친화도), 의사결정(다기준 의사결정 분석·투표), 대인관계와 팀 기술(명목집단법·관찰·촉진), 프로토타입, 컨텍스트 다이어그램, 전문가 판단입니다. 인터뷰는 깊이 있지만 시간이 들고, 설문은 다수를 빠르게 커버하고, 관찰은 말로 표현 못 하는 암묵적 요구를 잡아내고, 프로토타입은 눈에 보이는 모형으로 피드백을 앞당깁니다 — '기법마다 잡아내는 요구가 다르다'는 게 핵심이고, 상황에 맞는 기법 2~3개를 골라 조합 서술하는 것이 답안 포인트입니다." },
"srs": {
    guide: {
      hook: "수집한 요구를 '검증 가능하게' 정리한 요구사항 명세서입니다.",
      scene: "'빨라야 한다' 같은 모호한 요구는 개발·검수에서 분쟁을 부릅니다. SRS는 기능·비기능 요구를 명확·완전·일관·검증 가능하게 문서화해 개발과 인수의 기준이 됩니다.",
      why: "좋은 요구사항의 품질 특성과 기능/비기능 구분이 출제 핵심입니다. IEEE 830·요구공학과 연결됩니다.",
      mechanism: "구성: 기능 요구(시스템이 해야 할 동작), 비기능 요구(성능·보안·가용성·사용성 등 품질), 제약사항, 인터페이스. 품질 특성: 완전성·일관성·명확성·검증가능성·추적성·수정용이성·타당성(모호·중복·모순 배제). 표준 IEEE 830/29148. 요구 추적 매트릭스(RTM)로 근원~구현~테스트 추적. 검토(리뷰)로 검증.",
      map: [
        { as: "해야 할 동작", real: "기능 요구", note: "" },
        { as: "성능·보안·품질", real: "비기능 요구", note: "" },
        { as: "모호·모순 배제", real: "품질 특성", note: "검증가능성 등" },
        { as: "근원~테스트 추적", real: "RTM(추적성)", note: "" },
      ],
      usage: "SW 개발·인수의 기준 문서입니다. 시험은 기능/비기능, 품질 특성, RTM입니다.",
      links: [
        { topic: "요구사항 수집기법", how: "수집된 요구를 SRS로 명세합니다." },
        { topic: "WBS (Work Breakdown Structure)", how: "요구를 작업으로 분해하는 다음 단계입니다." },
      ],
      exam: "SRS는 기능·비기능 요구를 완전·일관·명확·검증가능하게 문서화한 명세서로, IEEE 830/29148을 따르고 요구 추적 매트릭스로 추적성을 확보한다.",
    }, image: "/concept/book/srs.webp", easy: "요구사항을 공식 문서로 못 박은 것이 SRS이고, 이후 분석·설계·구현·유지보수의 판단 기준이 됩니다. 세 덩어리로 외웁니다. ① 명세 원리 [명완검일수추개] — 명확성(뜻이 하나), 완전성(빠짐없이), 검증가능성(확인 가능하게), 일관성(모순 없이), 수정용이성, 추적성, 개발 후 이용성. ② 작성 시 유의사항 [이상기제테품]. ③ 목차 — 개요(범위·목적·시스템개요·제약), 기능적 요구사항, 기타 요구 및 제약(성능·논리DB·SW속성·HW), 인수 조건." },
"pm-27": {
    guide: {
      hook: "프로젝트 범위를 '관리 가능한 작업 단위로 계층 분해'한 구조도입니다.",
      scene: "큰 프로젝트를 통째로 관리하면 놓칩니다. WBS는 최종 산출물을 점점 작은 작업 패키지로 쪼개 트리로 만들어, 일정·비용·자원을 배정하고 진척을 관리할 수 있게 합니다.",
      why: "'범위의 계층 분해'와 100% 규칙·작업 패키지가 출제 핵심입니다. 일정·원가·EVM의 기반입니다.",
      mechanism: "범위기술서를 산출물(Deliverable) 중심으로 계층 분해 → 최하위는 작업 패키지(Work Package — 8~80시간, 관리·산정 가능 단위). 100% 규칙(상위 = 하위의 합, 빠짐·중복 없음, MECE). WBS 사전(각 요소 정의). 산출물/단계 지향으로 구성. 일정(활동 정의)·원가·자원·EVM·책임(RACI) 배정의 근거. 통제 계정(Control Account)에서 관리.",
      map: [
        { as: "산출물 중심 트리", real: "계층 분해", note: "" },
        { as: "최하위 관리 단위", real: "작업 패키지", note: "8~80h" },
        { as: "상위=하위 합", real: "100% 규칙", note: "MECE" },
        { as: "일정·원가 배정 근거", real: "관리 기반", note: "" },
      ],
      usage: "프로젝트 계획의 기초입니다. 시험은 100% 규칙, 작업 패키지, 일정·EVM과의 연계입니다.",
      links: [
        { topic: "Scope Creep vs Gold-Plating", how: "범위 관리의 이탈 유형입니다." },
        { topic: "EVM(Earned Value Management, 획득 가치 관리)", how: "WBS 기반으로 성과를 측정합니다." },
      ],
      exam: "WBS는 프로젝트 범위를 작업 패키지까지 계층 분해한 구조로, 100% 규칙(상위=하위 합)을 지키며 일정·원가·자원·EVM 관리의 기반이 된다.",
    }, image: "/concept/book/pm-27.webp", easy: "할 일을 '인도물 중심'으로 계층적으로 쪼갠 그림입니다. 맨 아래 칸이 작업 패키지(Work Package)로, 관리 가능한 크기(보통 80시간 내외)까지 잘게 나눕니다. 핵심 규칙이 100% rule — 각 레벨의 작업량·예산 합이 상위의 100%가 되어야 합니다(빠뜨려도 안 되고 더해도 안 됨). 작업 패키지들을 묶어 원가를 관리하는 단위가 통제 계정(Control Account)이고, 각 항목의 상세 내용은 WBS 사전에, 고유 번호는 Code of Account(1.x.x)에 적습니다." },
"pm-30": {
    guide: {
      hook: "범위가 새는 두 방식 — '고객이 슬금슬금 늘리는' 스코프 크립과 '개발자가 과잉 제공하는' 골드 플레이팅.",
      scene: "합의한 범위를 넘어 요구가 통제 없이 계속 추가되면 스코프 크립, 요청하지도 않은 기능을 개발자가 '더 좋게' 넣어 주면 골드 플레이팅입니다. 둘 다 일정·비용을 해치는 범위 이탈입니다.",
      why: "'누가 원인인가'(고객 vs 개발자)의 구분과 대응(변경 통제·범위 준수)이 출제 핵심입니다.",
      mechanism: "Scope Creep(범위 크리프): 변경 통제 없이 요구가 점진 추가 — 원인은 고객·이해관계자, 불명확한 범위. 대응: 명확한 범위 정의·변경 통제 프로세스(CCB)·기준선 관리. Gold-Plating(금도금): 요청 없는 추가 기능·과잉 품질 — 원인은 개발팀. 대응: 범위 준수·요구 기반 개발. 둘 다 일정·비용 초과·품질 위험 유발.",
      map: [
        { as: "고객이 슬금슬금 추가", real: "Scope Creep", note: "변경 통제로 대응" },
        { as: "개발자가 과잉 제공", real: "Gold-Plating", note: "범위 준수로 대응" },
        { as: "변경 통제 프로세스", real: "CCB·기준선", note: "" },
        { as: "일정·비용 초과", real: "공통 위험", note: "" },
      ],
      usage: "범위 관리의 위험 통제입니다. 시험은 두 개념의 원인·대응 구분입니다.",
      links: [
        { topic: "WBS (Work Breakdown Structure)", how: "명확한 범위 정의로 이탈을 막습니다." },
        { topic: "프로젝트 위험관리", how: "범위 이탈은 주요 프로젝트 위험입니다." },
      ],
      exam: "Scope Creep은 고객 요구가 통제 없이 추가되는 것, Gold-Plating은 개발자가 요청 없는 기능을 과잉 제공하는 것으로, 각각 변경 통제와 범위 준수로 대응한다.",
    }, image: "/concept/book/pm-30.webp", easy: "둘 다 범위가 부푸는 현상인데 원인이 정반대입니다. Scope Creep은 '고객이 요구했는데 관리 없이 슬금슬금 들어온' 것 — 원인은 범위관리 실패이고, 변경 요청을 리뷰·승인 절차에 태워서 막습니다. Gold Plating은 '고객이 요구하지도 않았는데 우리가 좋으라고 더 넣은' 것 — 원인은 품질관리·요구사항 확인 실패이고, PM 승인 없는 기능 추가 금지로 막습니다. 한 줄 요약: Creep = 고객발 통제 실패, Gold Plating = 개발자발 과잉 서비스." },
"duration-estimating": {
    guide: {
      hook: "각 활동이 '얼마나 걸릴지' 추정하는 여러 산정 기법입니다.",
      scene: "일정을 짜려면 활동별 소요 기간을 추정해야 합니다. 전문가 감(유사·전문가), 과거 실적(유추), 변수 계산(모수), 불확실성 반영(3점) 등 상황에 맞는 기법으로 기간을 산정합니다.",
      why: "기법별 특성(정확도·비용·상황)이 출제 핵심입니다. 3점 산정·CPM으로 이어집니다.",
      mechanism: "기법: 유사 산정(과거 유사 프로젝트 기반 — 빠르나 부정확, 초기), 모수 산정(단위당 생산성×규모 — 정량), 3점 산정(낙관·비관·최빈으로 PERT 기대값·불확실성 반영), 상향식(작업 패키지별 산정 후 합산 — 정확·시간 소요), 예비(버퍼) 산정. 자원·생산성·리스크 고려. 산정 결과로 일정 네트워크·CPM 구성.",
      map: [
        { as: "과거 유사 기반", real: "유사 산정", note: "빠름·부정확" },
        { as: "단위당×규모", real: "모수 산정", note: "정량" },
        { as: "낙관·비관·최빈", real: "3점 산정", note: "불확실성" },
        { as: "작업별 합산", real: "상향식", note: "정확" },
      ],
      usage: "일정 계획의 기간 추정입니다. 시험은 기법별 특성, 3점 산정·CPM과의 연계입니다.",
      links: [
        { topic: "3점 산정", how: "불확실성을 반영하는 대표 기법입니다." },
        { topic: "CPM (Critical Path Management)", how: "산정 기간으로 임계경로를 계산합니다." },
      ],
      exam: "활동기간 산정기법은 유사·모수·3점·상향식 산정 등으로 활동 소요 기간을 추정하며, 정확도·비용·불확실성 반영 정도에 따라 상황에 맞게 선택한다.",
    }, image: "/concept/book/duration-estimating.webp", easy: "활동기간 산정기법은 한정된 자원으로 각 활동을 수행하는 데 걸릴 기간을 추정하는 기법 모음이며, 두음이 [전유모3상데의미]입니다. 전문가 판단(유사 프로젝트 경험자 활용), 유사 산정(과거 유사 프로젝트의 실제 기간 참조 — 상세 정보가 제한적일 때 유용), 모수 산정(과거 실적 데이터로 수학적 함수를 만들어 계산), 3점 산정(낙관치·비관치·평균치 셋으로 계산 — 불확실성 반영), 상향식 산정(WBS 최하위 단위부터 더해 올림 — 가장 정확하지만 오래 걸림), 데이터 분석(대안 분석 + 예비 분석: 불확실성 대비 버퍼를 전체 일정에 포함), 의사결정(Fist to Five 손가락 거수법), 미팅. '유사 산정은 빠르지만 부정확, 상향식은 느리지만 정확, 3점은 위험 반영'이라는 정확도 스펙트럼으로 비교 서술하는 것이 답안 포인트입니다." },
"pm-35": {
    guide: {
      hook: "'낙관·비관·최빈' 세 값으로 불확실성을 반영해 기간·비용을 추정하는 기법입니다.",
      scene: "단일 추정치는 불확실성을 못 담습니다. 3점 산정은 가장 좋을 때(O)·나쁠 때(P)·보통(M) 세 값을 받아 가중 평균으로 기대값을 구하고, 편차로 위험까지 계산합니다(PERT).",
      why: "PERT 공식(기대값·표준편차)과 삼각/베타 분포가 출제 핵심입니다. 몬테카를로·CPM과 연계됩니다.",
      mechanism: "베타분포(PERT): 기대값 E = (O + 4M + P) / 6, 표준편차 σ = (P − O) / 6, 분산 = σ². 삼각분포: E = (O + M + P) / 3. M(최빈)에 가중(PERT는 4배)해 현실 반영. 활동별 σ를 합쳐 경로 전체 불확실성 산정 → 신뢰구간(±1σ 68% 등). 몬테카를로 시뮬레이션의 입력 분포로도 사용.",
      map: [
        { as: "좋을 때·나쁠 때·보통", real: "O·P·M", note: "3점" },
        { as: "(O+4M+P)/6", real: "PERT 기대값", note: "베타분포" },
        { as: "(P−O)/6", real: "표준편차", note: "불확실성" },
        { as: "경로 편차 합산", real: "신뢰구간", note: "" },
      ],
      usage: "불확실성 반영 산정입니다. 시험은 PERT 공식 계산, 베타/삼각 분포, 몬테카를로 입력입니다.",
      links: [
        { topic: "활동기간 산정기법", how: "3점 산정이 그 한 기법입니다." },
        { topic: "몬테카를로 시뮬레이션", how: "3점 분포를 입력으로 위험을 분석합니다." },
      ],
      exam: "3점 산정은 낙관(O)·비관(P)·최빈(M)으로 PERT 기대값 (O+4M+P)/6과 표준편차 (P−O)/6을 구해 불확실성을 반영하는 기법으로, 몬테카를로의 입력이 된다.",
    }, image: "/concept/book/pm-35.webp", easy: "3점 산정은 활동 기간을 하나로 못 박지 않고 낙관치(O)·평균치(M)·비관치(P) 세 값으로 잡아 불확실성을 반영하는 기간 산정 기법입니다. 삼각분포는 셋의 단순 평균 (O+M+P)/3, 베타분포(PERT)는 가장 가능성 높은 값에 4배 가중치를 줘서 (O+4M+P)/6입니다. 표준편차는 (P−O)/6이고, ±1σ·2σ·3σ가 각각 신뢰도 68%·95%·99%에 해당합니다. 예를 들어 낙관 4일·평균 5일·비관 12일이면 PERT 기대치는 (4+20+12)/6=6일, 표준편차는 (12−4)/6≈1.3일 → '6±1.3일 안에 끝날 확률 68%'로 읽습니다. 유사 산정(과거 사례 참조)·모수 산정(수식)과 비교하면 3점 산정만 유일하게 '위험(불확실성)'을 계산에 넣는다는 것, 그리고 두 공식의 분모(3과 6) 구분이 시험 포인트입니다." },
"pm-36": {
    guide: {
      hook: "프로젝트에서 '가장 긴 경로=최소 완료 시간'을 찾아 일정을 관리하는 기법입니다.",
      scene: "여러 활동이 선후관계로 얽힌 네트워크에서, 가장 오래 걸리는 경로(임계경로)가 전체 기간을 결정합니다. 이 경로의 활동이 지연되면 프로젝트 전체가 늦어지므로 집중 관리합니다.",
      why: "임계경로·여유(Float) 계산(전진·후진 계산)이 출제 핵심입니다. 일정단축·CCM과 연계됩니다.",
      mechanism: "활동 네트워크(선후관계). 전진 계산(ES/EF — 최이른 시작·종료), 후진 계산(LS/LF — 최늦은). 여유(Float/Slack) = LS − ES = LF − EF. 임계경로 = 총여유 0인 활동의 연결(가장 긴 경로). 임계경로 활동 지연 시 전체 지연 → 집중 관리. 자유여유(Free Float)는 후속 활동 영향 없이 지연 가능 시간. 일정 단축은 임계경로를 대상으로.",
      map: [
        { as: "가장 긴 경로", real: "임계경로(Critical Path)", note: "최소 기간" },
        { as: "최이른/최늦은 시각", real: "전진·후진 계산", note: "ES/LF" },
        { as: "지연 가능 시간", real: "여유(Float)", note: "임계=0" },
        { as: "여기 지연=전체 지연", real: "집중 관리", note: "" },
      ],
      usage: "일정 계획·통제의 핵심입니다. 시험은 임계경로·여유 계산, 일정단축 대상입니다.",
      links: [
        { topic: "CCM (Critical Chain Management)", how: "자원 제약과 버퍼를 더한 발전형입니다." },
        { topic: "일정단축 기법", how: "임계경로를 대상으로 일정을 줄입니다." },
      ],
      exam: "CPM은 활동 네트워크에서 총여유 0인 가장 긴 경로(임계경로)로 최소 완료 기간을 구하는 기법으로, 전진·후진 계산으로 여유를 산출하고 임계경로를 집중 관리한다.",
    }, image: "/concept/book/pm-36.webp", easy: "네트워크 다이어그램을 그려서 '이 프로젝트 최소 며칠 걸리나'를 구합니다. 앞에서부터 계산(전진)해 ES·EF를 구하고, 뒤에서부터 계산(후진)해 LS·LF를 구합니다. 그 차이가 여유시간 — TF = LF − EF = LS − ES 입니다. **TF가 0인 활동들을 이은 경로가 임계경로(Critical Path)** 이고, 여기가 하루라도 밀리면 프로젝트 전체가 밀립니다. TF는 '프로젝트 종료일을 안 밀리게 하는 총 여유', FF는 '바로 뒤 활동의 시작을 안 밀리게 하는 여유'로 FF ≤ TF 입니다." },
"pm-37": {
    guide: {
      hook: "CPM에 '자원 제약과 버퍼(완충)'를 더해 불확실성에 대응하는 일정 관리 기법입니다.",
      scene: "CPM은 자원이 무한하다고 가정하지만 현실은 사람·장비가 제한적입니다. CCM은 자원 제약을 고려한 임계 사슬을 찾고, 각 활동의 안전 시간을 걷어내 프로젝트 끝에 버퍼로 모아 관리합니다(골드랫 TOC).",
      why: "'자원 제약 + 버퍼 관리'가 CPM과의 차이로 출제 핵심입니다. 버퍼 종류(프로젝트·피딩·자원)와 학생 증후군이 포인트입니다.",
      mechanism: "TOC(제약이론) 기반. 임계 사슬(Critical Chain — 자원 제약까지 고려한 최장 경로). 각 활동의 개별 안전시간(버퍼)을 제거해 활동은 공격적으로 산정 → 걷어낸 시간을 모아 프로젝트 버퍼(끝단), 피딩 버퍼(비임계→임계 합류점), 자원 버퍼(자원 준비 경보) 배치. 버퍼 소모율로 진척 관리. 낭비 요인 제거: 학생 증후군(막판 몰아치기)·파킨슨 법칙(시간 다 씀)·다중작업.",
      map: [
        { as: "자원 제약 고려 경로", real: "임계 사슬", note: "CPM과 차이" },
        { as: "안전시간 모아 끝에", real: "프로젝트 버퍼", note: "" },
        { as: "합류점 완충", real: "피딩 버퍼", note: "" },
        { as: "막판 몰아치기 제거", real: "학생 증후군 대응", note: "" },
      ],
      usage: "자원 제약 프로젝트 일정 관리입니다. 시험은 CPM과의 차이, 버퍼 종류, TOC·학생 증후군입니다.",
      links: [
        { topic: "CPM (Critical Path Management)", how: "CCM이 자원 제약·버퍼를 더한 발전형입니다." },
        { topic: "자원 최적화", how: "자원 제약 반영과 연결됩니다." },
      ],
      exam: "CCM은 TOC 기반으로 자원 제약을 고려한 임계 사슬을 찾고 개별 안전시간을 프로젝트·피딩·자원 버퍼로 모아 관리하는 기법으로, CPM의 자원 무한 가정을 보완한다.",
    }, image: "/concept/book/pm-37.webp", easy: "사람들이 각 작업마다 몰래 넣어 둔 여유시간을 다 빼앗아 한곳에 모아 두고, 그 통합 버퍼가 얼마나 줄었는지로 프로젝트를 관리하는 방법입니다. 버퍼는 셋 — 프로젝트 버퍼(임계연쇄 끝에 두는 총 버퍼, 안전/모니터링/행동 영역으로 나눠 관리), 피딩 버퍼(임계연쇄로 합류하는 곁가지 끝에 둬서 본류 착수 지연을 막음), 자원 버퍼(작업 착수 전에 담당 자원에게 미리 알려주는 경보). CPM과 비교하면 CPM은 ES(빨리 시작)·진척율 관리, CCM은 LS(늦게 시작)·버퍼 소진율 관리이고, 자원 제약을 처음부터 계획에 반영합니다." },
"schedule-compression": {
    guide: {
      hook: "품질·범위는 유지하며 '일정을 앞당기는' 두 기법 — 공정 압축과 공정 중첩입니다.",
      scene: "마감을 당겨야 할 때, 임계경로 활동에 자원을 더 투입해 빨리 끝내거나(Crashing), 순차로 하던 활동을 병렬로 겹쳐 진행합니다(Fast Tracking). 각각 비용 증가·재작업 위험이라는 대가가 있습니다.",
      why: "두 기법의 원리·대가 구분이 출제 핵심입니다. 임계경로 대상·비용/위험 트레이드오프가 포인트입니다.",
      mechanism: "Crashing(공정 압축): 임계경로 활동에 자원(인력·초과근무) 추가 투입해 기간 단축 → 비용 증가(비용-일정 트레이드오프, 최소 비용 증가로 최대 단축하는 활동 선택). Fast Tracking(공정 중첩): 순차 활동을 부분 병렬 수행 → 추가 비용 적으나 재작업·리스크 증가. 둘 다 임계경로가 대상. 자원 최적화(평준화)와 구분.",
      map: [
        { as: "자원 더 투입", real: "Crashing(압축)", note: "비용 증가" },
        { as: "순차를 병렬로", real: "Fast Tracking(중첩)", note: "재작업 위험" },
        { as: "임계경로 대상", real: "단축 대상", note: "" },
        { as: "비용↔위험 대가", real: "트레이드오프", note: "" },
      ],
      usage: "일정 지연·마감 대응입니다. 시험은 Crashing/Fast Tracking 원리·대가 구분입니다.",
      links: [
        { topic: "CPM (Critical Path Management)", how: "임계경로가 단축 대상입니다." },
        { topic: "자원 최적화", how: "자원 조정 기법과 구분됩니다." },
      ],
      exam: "일정단축은 임계경로 활동에 자원을 추가하는 Crashing(비용 증가)과 순차 활동을 병렬화하는 Fast Tracking(재작업 위험)으로 나뉘며, 범위·품질은 유지한다.",
    }, image: "/concept/book/schedule-compression.webp", easy: "범위는 그대로 두고 일정만 당기는 두 가지 방법입니다. Crashing(공정 압축)은 임계경로에 사람·초과근무를 더 넣어 기간을 줄입니다 — 돈이 더 듭니다(10일 500만원 → 8일 800만원). Fast Tracking(공정 중첩)은 원래 순서대로 하던 작업을 겹쳐서 병행합니다 — 돈은 안 들지만 앞 작업이 바뀌면 재작업 위험이 커집니다. 그래서 예산 여유가 있으면 Crashing, 없으면 Fast Tracking입니다. 참고로 Fast Tracking은 임계경로 상의 활동에는 적용할 수 없습니다." },
"pm-46": {
    guide: {
      hook: "'계획 대비 실제 성과'를 일정·비용 관점에서 정량 측정하는 프로젝트 관리 기법입니다.",
      scene: "'70% 했다'는 느낌으론 부족합니다. EVM은 계획가치(PV)·획득가치(EV)·실제원가(AC) 세 값으로 '얼마나 진척됐고 예산·일정을 지키는지'를 숫자로 보여 주고, 완료 시점까지 예측합니다.",
      why: "3대 값(PV·EV·AC)과 편차(SV·CV)·지수(SPI·CPI), 예측(EAC)이 출제 핵심입니다. WBS 기반 성과 측정입니다.",
      mechanism: "기본값: PV(계획가치 — 계획된 예산), EV(획득가치 — 완료분의 예산 가치), AC(실제원가). 편차: SV = EV − PV(일정, 음수=지연), CV = EV − AC(비용, 음수=초과). 지수: SPI = EV/PV(1미만=지연), CPI = EV/AC(1미만=초과). 예측: EAC(완료시점 예상 총원가) = BAC/CPI 등, ETC(잔여 예상). VAC = BAC − EAC. WBS·기준선 기반.",
      map: [
        { as: "계획된 예산", real: "PV(계획가치)", note: "" },
        { as: "완료분의 가치", real: "EV(획득가치)", note: "핵심" },
        { as: "실제 쓴 돈", real: "AC(실제원가)", note: "" },
        { as: "SPI·CPI로 진단", real: "성과 지수", note: "1미만=문제" },
      ],
      usage: "프로젝트 성과 측정·예측입니다. 시험은 PV/EV/AC, SV/CV·SPI/CPI 계산, EAC 예측입니다.",
      links: [
        { topic: "WBS (Work Breakdown Structure)", how: "EVM은 WBS 기반으로 성과를 측정합니다." },
        { topic: "CPM (Critical Path Management)", how: "일정 성과(SV/SPI)와 연계됩니다." },
      ],
      exam: "EVM은 계획가치(PV)·획득가치(EV)·실제원가(AC)로 일정편차(SV)·비용편차(CV)와 SPI·CPI를 산출해 성과를 측정하고 EAC로 완료 원가를 예측하는 기법이다.",
    }, image: "/concept/book/pm-46.webp", easy: "'지금 일정과 비용이 계획대로인가'를 숫자 하나로 보는 기법입니다. 값 세 개만 알면 됩니다 — PV(오늘까지 하기로 계획한 일의 값), EV(오늘까지 실제로 끝낸 일의 값), AC(오늘까지 실제로 쓴 돈). 여기서 SV = EV − PV(음수면 일정 지연), CV = EV − AC(음수면 예산 초과)가 나오고, 나눗셈으로 SPI = EV/PV, CPI = EV/AC(1보다 작으면 나쁨)가 나옵니다. 헷갈릴 때는 '항상 EV가 앞에 온다'로 기억하면 됩니다. 지연이면 Crashing·Fast Tracking, 예산 초과면 원가 통제로 대응합니다." },
"pm-50": {
    guide: {
      hook: "품질 문제를 데이터로 분석하는 '7가지 기본 도구(QC 7)'입니다.",
      scene: "불량을 감으로 잡지 않고 데이터로 분석합니다. 원인을 뼈대로 그리고(특성요인도), 빈도 순으로 정렬하고(파레토), 분포를 보고(히스토그램), 관계를 보고(산점도), 공정 안정을 감시합니다(관리도). 통계적 품질 관리의 기본 세트입니다.",
      why: "7도구 각각의 용도가 출제 핵심입니다. 특히 파레토(20/80)·특성요인도·관리도가 자주 나옵니다.",
      mechanism: "QC 7: 체크시트(데이터 수집), 히스토그램(분포), 파레토도(빈도 내림차순 — 20% 원인이 80% 문제, 우선순위), 특성요인도(어골도/이시카와 — 원인 분류 4M), 산점도(두 변수 상관), 관리도(Control Chart — 공정 변동을 관리한계선으로 감시, 이상원인 탐지), 층별(그룹 분류). 신 QC 7도구(친화도·관계도 등)는 정성·기획용.",
      map: [
        { as: "빈도 순 우선순위", real: "파레토도", note: "20/80" },
        { as: "원인을 뼈대로", real: "특성요인도(어골도)", note: "4M" },
        { as: "공정 변동 감시", real: "관리도", note: "이상원인" },
        { as: "분포·상관", real: "히스토그램·산점도", note: "" },
      ],
      usage: "품질 통제·개선 분석입니다. 시험은 7도구 용도, 파레토·관리도입니다.",
      links: [
        { topic: "SW 품질비용", how: "품질 관리의 비용 관점과 연계됩니다." },
        { topic: "데이터 시각화", how: "품질 데이터 시각화 기법을 공유합니다." },
      ],
      exam: "QC 7 도구는 체크시트·히스토그램·파레토도·특성요인도·산점도·관리도·층별로 품질 데이터를 분석하며, 파레토(우선순위)·특성요인도(원인)·관리도(공정 감시)가 핵심이다.",
    }, image: "/concept/book/pm-50.webp", easy: "품질 문제를 통계로 잡는 고전 도구 7개입니다. 쓰임새로 묶으면 외워집니다 — 현상 파악(체크시트: 빠짐없이 세기 / 파레토차트: 빈도 순으로 세워 중점 문제 찾기 / 히스토그램: 분포 모양 보기), 자료 관리(관리도: 공정이 통계적으로 안정한지 판정), 원인 분석(특성요인도=생선뼈 그림: 결과와 원인의 관계 / 산점도: 두 변수의 상관관계 / 층별: 데이터를 부분집단으로 쪼개 원인 규명). 교재 두음이 현원자 · 체파히 · 특산층 · 관입니다." },
"pm-51": {
    guide: {
      hook: "산출물의 '버전·변경을 통제'해 무결성을 유지하는 형상 관리입니다.",
      scene: "여러 사람이 문서·코드를 고치다 보면 어느 게 최신인지, 무엇이 왜 바뀌었는지 엉킵니다. 형상 관리는 관리 대상을 식별하고, 변경을 통제하고, 상태를 기록하고, 검증해 산출물의 일관성을 지킵니다.",
      why: "4대 활동(식별·통제·상태 기록·감사)과 베이스라인·변경통제위원회(CCB)가 출제 핵심입니다. 버전 관리와의 관계가 포인트입니다.",
      mechanism: "4활동: 형상 식별(관리 대상=형상 항목 지정, 베이스라인 설정), 형상 통제(변경 요청→CCB 심의→승인/기각→반영, 무단 변경 금지), 형상 상태 기록(변경 이력·현재 상태 문서화), 형상 감사(베이스라인과 실제 일치 검증 — 기능·물리). 도구: 버전 관리 시스템(Git 등). 목적: 무결성·추적성·재현성. 변경 관리·릴리스와 연계.",
      map: [
        { as: "관리 대상·기준선 지정", real: "형상 식별", note: "베이스라인" },
        { as: "변경은 승인 후에만", real: "형상 통제(CCB)", note: "" },
        { as: "변경 이력 기록", real: "상태 기록", note: "" },
        { as: "일치 검증", real: "형상 감사", note: "" },
      ],
      usage: "SW·문서 무결성 관리입니다. 시험은 4활동, 베이스라인·CCB, 버전 관리와의 관계입니다.",
      links: [
        { topic: "Scope Creep vs Gold-Plating", how: "변경 통제로 범위 이탈을 막습니다." },
        { topic: "DevSecOps", how: "형상·버전 관리가 파이프라인 기반입니다." },
      ],
      exam: "형상 관리는 형상 식별(베이스라인)·통제(CCB)·상태 기록·감사의 4활동으로 산출물의 버전·변경을 통제해 무결성·추적성을 유지하는 활동이다.",
    }, image: "/concept/book/pm-51.webp", easy: "개발하다 보면 문서·코드가 계속 바뀌는데, '지금 무엇이 공식 버전인가'를 잃지 않게 관리하는 활동입니다. 절차는 식별 → 통제 → 감사 → 기록입니다. 형상 식별로 관리 대상과 기준선(Baseline)을 정하고, 변경 요청이 오면 CCB(형상관리 통제 위원회)가 심사해 승인한 것만 반영하며, 체크리스트로 감사하고, 결과를 저장소(SVN·Git)에 기록합니다. 기준선도 단계마다 이름이 달라 기능적 → 분배적 → 설계 → 시험 → 제품 → 운용 순으로 갑니다." },
"sw-quality-cost": {
    guide: {
      hook: "품질에 드는 돈을 '예방·평가·실패' 비용으로 나눠 관리하는 개념입니다.",
      scene: "품질은 공짜가 아닙니다. 미리 막는 데 드는 돈(예방), 검사하는 데 드는 돈(평가), 문제가 터져 드는 돈(실패)이 있습니다. 예방·평가에 투자하면 실패 비용이 크게 줄어드는 게 핵심입니다.",
      why: "PAF 모델(예방·평가·실패)과 '예방 투자 > 실패 비용 절감'의 경제학이 출제 핵심입니다. 내부/외부 실패 구분이 포인트입니다.",
      mechanism: "PAF 모델: 예방 비용(Prevention — 교육·표준·리뷰·프로세스 개선), 평가 비용(Appraisal — 테스트·검사·감사), 실패 비용(Failure — 내부: 출시 전 발견·재작업, 외부: 출시 후 발견·고객 클레임·리콜, 가장 비쌈). 원칙: 예방·평가 투자↑ → 실패 비용↓(1-10-100 법칙 — 결함은 늦게 발견될수록 10배씩 비용 증가). 적정 품질 수준에서 총비용 최소.",
      map: [
        { as: "미리 막는 비용", real: "예방 비용", note: "교육·리뷰" },
        { as: "검사 비용", real: "평가 비용", note: "테스트" },
        { as: "터진 뒤 비용", real: "실패 비용", note: "내부/외부" },
        { as: "늦을수록 10배", real: "1-10-100 법칙", note: "" },
      ],
      usage: "품질 투자 의사결정입니다. 시험은 PAF 모델, 1-10-100, 예방 투자 효과입니다.",
      links: [
        { topic: "품질통제도구, QC 7", how: "품질 분석·개선 도구입니다." },
        { topic: "시큐어 코딩(Secure Coding)", how: "예방 투자로 실패 비용을 줄입니다." },
      ],
      exam: "SW 품질비용은 예방·평가·실패(PAF) 비용으로 구성되며, 예방·평가 투자가 실패 비용을 줄이고 결함은 늦게 발견될수록 비용이 급증(1-10-100)한다.",
    }, image: "/concept/book/sw-quality-cost.webp", easy: "SW 품질비용은 품질을 확보하기 위해 쓰는 비용과 품질 실패로 치르는 비용을 합쳐 네 갈래로 나눠 관리하는 개념입니다. 적합 품질비용은 잘 만들려고 쓰는 돈 — 예방비용(교육·표준·계획)과 평가비용(테스트·리뷰·인스펙션). 부적합 품질비용은 잘못돼서 나가는 돈 — 내부실패비용(고객에게 가기 전에 고쳐서 드는 재작업 비용)과 외부실패비용(고객에게 간 뒤 터져서 드는 하자보수·법적 책임·신용 실추). 핵심 메시지는 '앞의 둘에 돈을 더 써서 뒤의 둘을 줄여라'이고, 특히 외부실패비용이 압도적으로 비쌉니다." },
"pm-53": {
    guide: {
      hook: "작업별로 '누가 책임·실행·자문·통보 대상인지' 한눈에 정리한 책임 배정 매트릭스입니다.",
      scene: "'이 일 누가 하기로 했지?'로 혼선이 생깁니다. RACI는 작업(행)×역할(열) 표에 R·A·C·I를 채워, 각 작업의 담당·책임·자문·통보 관계를 명확히 합니다.",
      why: "R·A·C·I 4역할의 정의와 규칙(A는 하나)이 출제 핵심입니다. WBS·조직과의 연계가 포인트입니다.",
      mechanism: "R(Responsible — 실제 수행자, 여럿 가능), A(Accountable — 최종 책임·승인자, 작업당 반드시 1명), C(Consulted — 자문 대상, 양방향 소통), I(Informed — 결과 통보 대상, 단방향). 매트릭스: 행=작업(WBS), 열=역할/사람. 규칙: 각 작업에 A는 정확히 1명(책임 분산 방지), R은 최소 1명. 역할·책임 명확화로 커뮤니케이션·조직 관리.",
      map: [
        { as: "실제 수행", real: "R(Responsible)", note: "여럿 가능" },
        { as: "최종 책임·승인", real: "A(Accountable)", note: "작업당 1명" },
        { as: "자문", real: "C(Consulted)", note: "양방향" },
        { as: "통보", real: "I(Informed)", note: "단방향" },
      ],
      usage: "역할·책임 배정·조직 관리입니다. 시험은 RACI 정의, A는 하나 규칙, WBS 연계입니다.",
      links: [
        { topic: "WBS (Work Breakdown Structure)", how: "작업에 책임을 배정합니다." },
        { topic: "동기부여 이론", how: "팀·역할 관리와 연계됩니다." },
      ],
      exam: "RACI는 작업별로 실행(R)·최종책임(A)·자문(C)·통보(I) 역할을 배정하는 매트릭스로, 각 작업에 A는 반드시 1명이어야 책임 소재가 명확하다.",
    }, image: "/concept/book/pm-53.webp", easy: "RACI 차트는 업무(활동)별로 누가 어떤 역할인지 표로 못 박는 책임배정매트릭스(RAM)의 대표 형식입니다. R(Responsible)=실제로 일을 수행하는 사람, A(Accountable)=최종 책임지고 승인하는 사람, C(Consulted)=자문해 주는 사람(양방향 소통), I(Informed)=결과만 통보받는 사람(단방향 통보). 시험에 나오는 규칙 — 한 업무에 A는 반드시 있어야 하고 반드시 한 명이어야 합니다(여럿이면 책임 소재와 의사소통 혼란). 반대로 C와 I는 없어도 되고, R과 A는 한 사람이 겸할 수 있습니다. 자원관리 계획 수립의 도구로, 역할·책임이 흐릿해 서로 미루거나 중복 작업이 생기는 것을 막는 게 목적 — 'A는 단 한 명' 규칙이 최다 출제 포인트입니다." },
"pm-40": {
    guide: {
      hook: "한정된 자원을 '무리 없이 배분·조정'하는 두 기법 — 평준화와 평활화입니다.",
      scene: "특정 시기에 한 사람이 여러 일에 몰리면 과부하입니다. 자원 평준화는 자원 제약에 맞춰 일정을 조정(임계경로도 바뀔 수 있음)하고, 자원 평활화는 여유 범위 안에서만 조정(완료일 유지)합니다.",
      why: "평준화(Leveling) vs 평활화(Smoothing)의 차이가 출제 핵심입니다. 완료일·임계경로 영향이 포인트입니다.",
      mechanism: "자원 평준화(Resource Leveling): 자원 가용성·과다 할당 해소를 우선 → 활동을 이동·연장, 결과적으로 완료일·임계경로가 변할 수 있음(자원 제약 우선). 자원 평활화(Resource Smoothing): 자유·총 여유(Float) 범위 내에서만 조정 → 완료일·임계경로 불변, 자원 사용을 고르게(일정 제약 우선). 히스토그램으로 부하 확인. 일정단축(Crashing 등)과 구분.",
      map: [
        { as: "자원 제약 우선 조정", real: "자원 평준화", note: "완료일 변동 가능" },
        { as: "여유 내에서만 조정", real: "자원 평활화", note: "완료일 유지" },
        { as: "부하 시각화", real: "자원 히스토그램", note: "" },
        { as: "임계경로 영향", real: "평준화만", note: "구분" },
      ],
      usage: "자원 과부하 해소·일정 조정입니다. 시험은 평준화 vs 평활화 차이(완료일·임계경로)입니다.",
      links: [
        { topic: "CPM (Critical Path Management)", how: "평준화가 임계경로를 바꿀 수 있습니다." },
        { topic: "일정단축 기법", how: "자원 조정 기법과 구분됩니다." },
      ],
      exam: "자원 최적화는 자원 제약을 우선해 완료일이 바뀔 수 있는 평준화와 여유 범위 내에서만 조정해 완료일을 유지하는 평활화로 나뉜다.",
    }, image: "/concept/book/pm-40.webp", easy: "한 사람이 같은 기간에 두 개 일에 배정돼 과부하가 걸릴 때 조정하는 기법이며, 둘의 차이는 딱 하나 — 주공정(완료일)을 건드리느냐입니다. Resource Leveling(자원 평준화)은 자원 한계를 지키기 위해 일정을 미뤄서라도 평탄하게 만듭니다 → 주공정이 바뀌고 보통 기간이 늘어납니다. Resource Smoothing(자원 평활화)은 완료일을 지키면서 여유시간(Free/Total Float) 안에서만 조정합니다 → 주공정이 안 바뀝니다. '납기를 포기해도 되면 Leveling, 안 되면 Smoothing'." },
"pm-55": {
    guide: {
      hook: "팀원을 '무엇이 움직이게 하는지' 설명하는 고전 동기부여 이론들입니다.",
      scene: "프로젝트 성패는 사람에 달렸습니다. 무엇이 사람을 열심히 하게 하는지 — 욕구 단계(매슬로), 위생 vs 동기(허즈버그), 기대와 보상(브룸) 등 이론으로 팀 관리 전략을 세웁니다.",
      why: "주요 이론의 핵심 주장 구분이 출제 포인트입니다. 특히 허즈버그(위생-동기)·매슬로 단계가 자주 나옵니다.",
      mechanism: "매슬로 욕구 5단계(생리→안전→소속→존경→자아실현, 하위 충족 후 상위). 허즈버그 2요인(위생요인 — 급여·환경, 불만 방지지만 동기 아님 / 동기요인 — 성취·인정·성장, 만족·동기 유발). 맥그리거 X-Y이론(X: 통제 필요, Y: 자율·책임). 브룸 기대이론(기대×수단×유의성 = 동기). 맥클레랜드(성취·권력·친교 욕구). ERG(앨더퍼).",
      map: [
        { as: "욕구 5단계", real: "매슬로", note: "하위→상위" },
        { as: "위생 vs 동기", real: "허즈버그 2요인", note: "핵심" },
        { as: "통제 vs 자율", real: "맥그리거 X-Y", note: "" },
        { as: "기대×수단×유의성", real: "브룸 기대이론", note: "" },
      ],
      usage: "팀·인적자원 관리입니다. 시험은 이론별 핵심 주장, 허즈버그·매슬로입니다.",
      links: [
        { topic: "터크만 팀 개발 5단계", how: "팀 발달 관점의 관리와 연계됩니다." },
        { topic: "갈등관리", how: "팀 관리의 다른 축입니다." },
      ],
      exam: "동기부여 이론은 매슬로 욕구 5단계, 허즈버그 2요인(위생·동기), 맥그리거 X-Y, 브룸 기대이론 등으로 팀원의 동기 원천을 설명해 인적자원 관리에 활용된다.",
    }, image: "/concept/book/pm-55.webp", easy: "사람을 어떻게 움직이게 하느냐에 대한 이론들이며, 관점 3개로 먼저 나눕니다 [내과강] — 내용 이론(무엇이 동기를 주나, What), 과정 이론(어떻게 동기가 생기나, How), 강화 이론(왜 일어나나, Why). 내용 이론에는 매슬로우 욕구 5단계(생·안·사·존·자), 허즈버그 2요인(위생요인은 불만족만 없애고 동기요인이 만족을 만듦), 맥그리거 X·Y이론, 맥클랜드 3욕구(성취·결연·권력)가 있고, 과정 이론에는 기대·목표설정·공정성 이론, 강화 이론에는 스키너가 있습니다." },
"pm-56": {
    guide: {
      hook: "팀이 '형성→혼란→규범→수행'을 거쳐 성숙하는 5단계 발달 모델입니다.",
      scene: "새로 꾸린 팀은 처음부터 잘 굴러가지 않습니다. 서로 탐색하고(형성), 갈등을 겪고(혼란), 규칙을 만들고(규범), 성과를 내고(수행), 마무리(해산)하는 단계를 거칩니다. 각 단계에 맞는 리더십이 다릅니다.",
      why: "5단계 이름·특징과 단계별 리더 역할이 출제 핵심입니다. 특히 혼란(Storming) 단계 대응이 포인트입니다.",
      mechanism: "5단계: Forming(형성 — 탐색·의존, 리더 지시적), Storming(혼란 — 갈등·주도권 다툼, 리더 코칭·중재), Norming(규범 — 규칙·응집력 형성, 리더 지원), Performing(수행 — 자율·고성과, 리더 위임), Adjourning(해산 — 마무리·회고). 단계는 순차이나 후퇴 가능. 리더십은 지시→코칭→지원→위임으로 이동(상황적 리더십과 연계).",
      map: [
        { as: "탐색·의존", real: "Forming(형성)", note: "지시" },
        { as: "갈등·주도권 다툼", real: "Storming(혼란)", note: "코칭·중재" },
        { as: "규칙·응집", real: "Norming(규범)", note: "지원" },
        { as: "자율·고성과", real: "Performing(수행)", note: "위임" },
      ],
      usage: "팀 빌딩·리더십입니다. 시험은 5단계 특징, 단계별 리더 역할, Storming 대응입니다.",
      links: [
        { topic: "동기부여 이론", how: "팀 관리의 동기 측면과 연계됩니다." },
        { topic: "갈등관리", how: "Storming 단계 갈등 해결과 연결됩니다." },
      ],
      exam: "터크만 팀 개발 5단계는 형성·혼란·규범·수행·해산으로 팀이 성숙하며, 리더십이 지시→코칭→지원→위임으로 이동하고 혼란 단계의 갈등 관리가 관건이다.",
    }, image: "/concept/book/pm-56.webp", easy: "팀은 처음부터 잘 굴러가지 않고 다섯 단계를 거칩니다 [형스표수해] — 형성(서로 눈치 보며 탐색), 스토밍(갈등이 터짐, 효과성이 오히려 바닥), 표준화(규칙과 신뢰가 생김), 수행(성과가 나옴), 해산(마무리·Lessons Learned). 시험 포인트는 단계별 리더십입니다 — 형성기는 지시형(Direct), 격동기는 지도형(Coach), 표준화는 참여형(Participate), 수행기는 위임형(Delegate). 그래프가 U자를 그리는 이유는 스토밍에서 효과성이 떨어졌다가 회복되기 때문입니다." },
"conflict-management": {
    guide: {
      hook: "갈등을 다루는 '5가지 방식'을 상황에 맞게 선택하는 기법입니다(토마스-킬만).",
      scene: "팀엔 갈등이 늘 있습니다. 서로 물러서지 않고 이기려 하거나(경쟁), 양보하거나(수용), 피하거나(회피), 중간에서 타협하거나, 둘 다 만족하는 답을 찾습니다(협력). 협력이 최선이지만 상황에 따라 다릅니다.",
      why: "5방식(자기주장×협력성 2축)과 최적 방식(협력/문제해결)이 출제 핵심입니다.",
      mechanism: "토마스-킬만 2축(자기주장 × 협력성) 5방식: 경쟁(Competing — 강한 주장·낮은 협력, 신속·비상시), 수용(Accommodating — 낮은 주장·높은 협력, 관계 우선), 회피(Avoiding — 둘 다 낮음, 사소·냉각), 타협(Compromising — 중간, 시간 부족·부분 만족), 협력(Collaborating/Problem Solving — 둘 다 높음, Win-Win, 최선). 상황에 맞게 선택. PMBOK은 협력·문제해결을 권장.",
      map: [
        { as: "이기려 함", real: "경쟁(Competing)", note: "비상시" },
        { as: "양보", real: "수용(Accommodating)", note: "관계 우선" },
        { as: "피함", real: "회피(Avoiding)", note: "" },
        { as: "Win-Win", real: "협력(Collaborating)", note: "최선" },
      ],
      usage: "팀 갈등 해결입니다. 시험은 5방식(2축), 협력이 최선, 상황별 선택입니다.",
      links: [
        { topic: "터크만 팀 개발 5단계", how: "Storming 단계 갈등 해결에 씁니다." },
        { topic: "동기부여 이론", how: "팀 관리의 다른 축입니다." },
      ],
      exam: "갈등관리는 자기주장·협력성 2축의 경쟁·수용·회피·타협·협력 5방식으로 나뉘며, 둘 다 만족하는 협력(문제해결)이 최선이나 상황에 맞게 선택한다.",
    }, image: "/concept/book/conflict-management.webp", easy: "갈등 해결 방법 5개를 '내 주장을 얼마나 세우나 × 상대와 얼마나 협력하나' 2축으로 놓으면 한 번에 정리됩니다. Withdrawal(회피)=주장 낮음·협력 낮음(사소하거나 이길 가망 없을 때), Smoothing(수용)=주장 낮음·협력 높음(분위기가 더 중요할 때), Compromising(타협)=중간·중간(둘 다 조금씩 양보), Forcing(강요)=주장 높음·협력 낮음(급하거나 꼭 필요한 정책), Problem Solving(문제해결/대면)=주장 높음·협력 높음. **가장 바람직한 것은 Problem Solving, 가장 나쁜 것은 Withdrawal**입니다." },
"pm-59": {
    guide: {
      hook: "프로젝트의 '불확실성을 식별·분석·대응'해 관리하는 전 과정입니다.",
      scene: "프로젝트엔 예상 못한 일이 늘 생깁니다. 위험 관리는 무엇이 위험인지 찾고(식별), 얼마나 위험한지 재고(정성·정량 분석), 어떻게 대응할지 정하고(대응), 계속 감시하는(통제) 체계적 절차입니다.",
      why: "위험 관리 프로세스 단계와 위험(부정)·기회(긍정)의 양면성이 출제 핵심입니다. 정성/정량 분석·대응 전략과 연계됩니다.",
      mechanism: "프로세스(PMBOK): 위험 관리 계획 → 위험 식별(위험 등록부) → 정성적 분석(발생확률×영향 매트릭스로 우선순위) → 정량적 분석(수치화 — 몬테카를로·EMV) → 대응 계획(위협: 회피·전가·완화·수용 / 기회: 활용·공유·증대·수용) → 감시·통제. 위험은 부정(위협)+긍정(기회) 포함. 위험 등록부·리스크 번다운으로 추적.",
      map: [
        { as: "위험 찾기", real: "위험 식별", note: "위험 등록부" },
        { as: "우선순위(확률×영향)", real: "정성적 분석", note: "" },
        { as: "수치화", real: "정량적 분석", note: "몬테카를로" },
        { as: "대응·감시", real: "대응·통제", note: "" },
      ],
      usage: "프로젝트 불확실성 관리입니다. 시험은 프로세스 단계, 위협/기회, 정성·정량 분석입니다.",
      links: [
        { topic: "정성적 위험 분석", how: "위험 우선순위를 정하는 단계입니다." },
        { topic: "위험 대응", how: "분석 후 대응 전략 수립입니다." },
      ],
      exam: "프로젝트 위험관리는 계획·식별·정성분석·정량분석·대응·감시의 프로세스로 불확실성을 관리하며, 위협뿐 아니라 기회(긍정 위험)도 포함해 대응한다.",
    }, image: "/concept/book/pm-59.webp", easy: "위험을 찾아서 대비하는 7단계 활동입니다. 계획 수립 → 위험 식별(무엇이 위험인가, 산출물은 위험 관리대장) → 정성적 분석(확률·영향으로 우선순위 매기기) → 정량적 분석(숫자로 영향 계산) → 대응 계획 수립(여기까지가 계획) → 대응 실행 → 감시 및 통제. 정성적이 먼저이고 정량적이 나중인 이유는, 다 계산하기엔 비싸니까 우선순위를 먼저 걸러내기 때문입니다. 보헴의 10대 위험 요소(인력 부족, 비현실적 일정·예산, 요구사항 변경 등)도 같이 외웁니다." },
"pm-60": {
    guide: {
      hook: "위험을 '발생확률×영향'으로 평가해 '어디에 집중할지 우선순위'를 정합니다.",
      scene: "모든 위험에 똑같이 대응할 순 없습니다. 정성적 분석은 각 위험의 발생 가능성과 영향을 상·중·하로 평가해 확률-영향 매트릭스에 배치하고, 상위 위험에 집중하도록 우선순위를 매깁니다.",
      why: "확률-영향 매트릭스(P-I Matrix)와 정량 분석과의 차이(주관 vs 수치)가 출제 핵심입니다.",
      mechanism: "각 위험의 발생확률과 영향을 척도(예: 상/중/하 또는 1~5)로 평가 → 확률×영향 = 위험도 점수 → P-I 매트릭스(고확률·고영향 = 최우선, 적색)에 배치 → 우선순위화·긴급 위험 선별. 신속·저비용이나 주관적. 데이터 품질·범주·긴급도 평가 병행. 상위 위험은 정량 분석·대응 계획으로 진행.",
      map: [
        { as: "확률×영향 평가", real: "위험도 점수", note: "" },
        { as: "매트릭스에 배치", real: "P-I 매트릭스", note: "고확률·고영향=최우선" },
        { as: "상위 위험 선별", real: "우선순위화", note: "" },
        { as: "주관적·신속", real: "정량과 차이", note: "" },
      ],
      usage: "위험 우선순위 선정입니다. 시험은 P-I 매트릭스, 정량 분석과의 차이입니다.",
      links: [
        { topic: "프로젝트 위험관리", how: "위험 관리 프로세스의 한 단계입니다." },
        { topic: "정량적 위험 분석", how: "상위 위험을 수치로 심화 분석합니다." },
      ],
      exam: "정성적 위험 분석은 발생확률과 영향을 척도로 평가해 확률-영향 매트릭스로 위험 우선순위를 정하는 신속·주관적 방법으로, 상위 위험은 정량 분석으로 넘긴다.",
    }, image: "/concept/book/pm-60.webp", easy: "식별된 위험을 '확률 × 영향'으로 등급 매겨 우선순위를 정하는 단계입니다. 핵심 도구가 P-I Matrix(확률-영향 매트릭스) — 확률과 영향을 곱해 빨강/노랑/초록으로 등급화합니다. 모수를 3개 보고 싶으면 버블차트(계층적 차트)를 쓰는데, 버블 크기가 영향 값이라 클수록 위험합니다. 비슷한 원인끼리 묶을 때는 RBS(Risk Breakdown Structure)를 씁니다. 정량적 분석과 달리 숫자로 계산하지 않고 등급으로 줄 세우는 것이 이 단계입니다." },
"pm-62": {
    guide: {
      hook: "위험을 '숫자로' 분석해 프로젝트 목표에 미치는 영향을 정량화합니다.",
      scene: "정성 분석으로 추린 상위 위험을, 이번엔 돈·기간 같은 수치로 계산합니다. '이 위험이 실현되면 얼마 손해인가', '전체 일정이 목표를 지킬 확률은 몇 %인가'를 확률·시뮬레이션으로 산출합니다.",
      why: "EMV(기대화폐가치)·의사결정 트리·몬테카를로가 출제 핵심입니다. 정성 분석과의 차이가 포인트입니다.",
      mechanism: "기법: EMV(Expected Monetary Value — 확률×영향금액 합, 의사결정 트리에서 대안 비교), 의사결정 트리(대안별 EMV 계산), 몬테카를로 시뮬레이션(변수 분포로 수천 회 시뮬레이션 → 완료 확률·비용 분포), 민감도 분석(토네이도 다이어그램 — 영향 큰 변수 식별). 결과: 목표 달성 확률·예비비(Contingency Reserve) 산정. 정성(우선순위)보다 자원 소요.",
      map: [
        { as: "확률×금액 기대값", real: "EMV", note: "" },
        { as: "대안별 EMV 비교", real: "의사결정 트리", note: "" },
        { as: "수천 회 시뮬레이션", real: "몬테카를로", note: "완료 확률" },
        { as: "영향 큰 변수", real: "민감도(토네이도)", note: "" },
      ],
      usage: "위험 정량 평가·예비비 산정입니다. 시험은 EMV 계산, 몬테카를로, 정성과의 차이입니다.",
      links: [
        { topic: "정성적 위험 분석", how: "정성 우선순위 후 정량 심화입니다." },
        { topic: "몬테카를로 시뮬레이션", how: "정량 분석의 핵심 기법입니다." },
      ],
      exam: "정량적 위험 분석은 EMV·의사결정 트리·몬테카를로·민감도 분석으로 위험을 수치화해 목표 달성 확률과 예비비를 산정하는 방법으로, 정성 분석보다 자원이 든다.",
    }, image: "/concept/book/pm-62.webp", easy: "정성적으로 걸러낸 위험이 프로젝트 전체에 미치는 영향을 실제 숫자로 계산하는 단계입니다. 도구 4개만 기억하면 됩니다 — 영향도(원인과 결과 관계를 도표로), 민감도 분석(다른 건 고정하고 하나만 흔들어 봄, 결과물이 토네이도 다이어그램), 의사결정 분석(EMV = 확률 × 금액으로 기대값 비교, 의사결정나무), 모의실험(몬테카를로로 수천 번 돌려 분포를 봄). 즉 '뭐가 제일 크게 흔드나(민감도) → 어느 쪽이 이득인가(EMV) → 전체 분포는 어떤가(몬테카를로)' 순입니다." },
"monte-carlo": {
    guide: {
      hook: "'무작위 표본을 수천 번 뽑아' 결과의 확률 분포를 구하는 시뮬레이션 기법입니다.",
      scene: "일정·비용이 불확실할 때 단일 값은 못 믿습니다. 몬테카를로는 각 변수의 확률 분포에서 무작위로 값을 뽑아 계산하기를 수천 번 반복해, '완료일이 목표 안에 들 확률 80%' 같은 확률적 결과를 냅니다.",
      why: "'반복 무작위 표본 → 확률 분포'라는 원리와 활용(일정·비용 위험, S-커브)이 출제 핵심입니다.",
      mechanism: "각 불확실 변수(활동 기간·비용)에 확률 분포(3점 산정의 삼각·베타 등) 부여 → 난수로 각 변수값 표본 추출 → 모델(네트워크·원가) 계산 → 수천~수만 회 반복(시행) → 결과의 확률 분포·누적 곡선(S-커브) 산출 → 목표 달성 확률·신뢰수준별 값(P80 등). 활용: 일정·비용 위험 정량화, 예비비 산정. 대수의 법칙에 기반.",
      map: [
        { as: "변수에 확률 분포", real: "입력 분포(3점)", note: "" },
        { as: "난수로 표본 추출", real: "무작위 시행", note: "" },
        { as: "수천 번 반복", real: "시뮬레이션", note: "대수의 법칙" },
        { as: "완료 확률·S-커브", real: "결과 분포", note: "P80 등" },
      ],
      usage: "일정·비용 위험 정량화입니다. 시험은 반복 표본 원리, 3점 산정 입력, S-커브·달성 확률입니다.",
      links: [
        { topic: "3점 산정", how: "몬테카를로의 입력 분포를 제공합니다." },
        { topic: "정량적 위험 분석", how: "몬테카를로가 핵심 기법입니다." },
      ],
      exam: "몬테카를로 시뮬레이션은 변수의 확률 분포에서 무작위 표본을 수천 번 추출·계산해 결과의 확률 분포(S-커브)와 목표 달성 확률을 구하는 정량 위험 분석 기법이다.",
    }, image: "/concept/book/monte-carlo.webp", easy: "몬테카를로 시뮬레이션은 불확실한 변수를 확률분포로 모델링하고 반복적인 무작위 샘플링으로 다양한 결과의 발생 가능성을 추정하는 수학적 시뮬레이션 기법입니다. 각 작업 기간이 '5일'처럼 딱 정해진 게 아니라 확률분포로 흩어져 있다고 보고, 주사위를 던지듯 무작위로 값을 뽑아 프로젝트 총 기간을 계산합니다. 이걸 수천~수만 번 반복하면 결과가 분포로 쌓이고, '80% 확률로 며칠 안에 끝난다' 같은 확률적 답을 얻습니다. 절차는 변수 정의(불확실 변수에 확률분포 할당) → 무작위 샘플링(난수 생성) → 시뮬레이션 실행(모델 적용 계산) → 결과 집계(평균·표준편차·신뢰구간 도출) 네 단계. 정량적 위험 분석의 대표 기법으로, 3점 산정이 '한 활동'의 불확실성을 다룬다면 몬테카를로는 '프로젝트 전체'의 불확실성을 확률 분포로 보여준다는 대비가 시험 포인트입니다." },
"pm-64": {
    guide: {
      hook: "위험에 대한 '대응 전략'을 위협 4가지·기회 4가지로 나눠 선택합니다.",
      scene: "위험을 분석했으면 어떻게 할지 정해야 합니다. 나쁜 위험(위협)은 피하거나·넘기거나·줄이거나·받아들이고, 좋은 위험(기회)은 살리거나·나누거나·키우거나·받아들입니다. 각 위험에 맞는 전략을 고릅니다.",
      why: "위협 4전략(회피·전가·완화·수용)과 기회 4전략(활용·공유·증대·수용)의 대칭 구조가 출제 핵심입니다.",
      mechanism: "위협(부정): 회피(Avoid — 원인 제거·범위 변경), 전가(Transfer — 보험·계약으로 제3자 이전), 완화(Mitigate — 확률·영향 축소), 수용(Accept — 능동: 예비비 / 수동: 무대응). 기회(긍정): 활용(Exploit — 반드시 실현), 공유(Share — 파트너와), 증대(Enhance — 확률·영향 증가), 수용(Accept). 에스컬레이션(권한 밖은 상위로). 대응 후 잔여·2차 위험 관리, 예비비(Contingency).",
      map: [
        { as: "위협: 피함", real: "회피(Avoid)", note: "" },
        { as: "위협: 남에게 넘김", real: "전가(Transfer)", note: "보험" },
        { as: "위협: 줄임", real: "완화(Mitigate)", note: "" },
        { as: "기회: 반드시 살림", real: "활용(Exploit)", note: "대칭" },
      ],
      usage: "위험 대응 계획 수립입니다. 시험은 위협/기회 각 4전략, 잔여·2차 위험, 예비비입니다.",
      links: [
        { topic: "프로젝트 위험관리", how: "위험 관리 프로세스의 대응 단계입니다." },
        { topic: "정량적 위험 분석", how: "분석 결과로 대응 전략을 정합니다." },
      ],
      exam: "위험 대응은 위협에 회피·전가·완화·수용, 기회에 활용·공유·증대·수용을 대칭으로 적용하며, 대응 후 잔여·2차 위험을 관리하고 예비비를 산정한다.",
    }, image: "/concept/book/pm-64.webp", easy: "위험을 어떻게 처리할지 정하는 단계이며, 나쁜 위험과 좋은 위험(기회)의 대응이 짝을 이룹니다. 부정적 [EATMA] — 에스컬레이션(내 권한 밖이라 위로 올림), 회피(위험 자체를 없앰: 범위 축소·일정 연기), 전가(보험처럼 남에게 넘김), 완화(발생 확률이나 영향을 낮춤), 수용(그냥 감수). 긍정적 [EESEA] — 에스컬레이션, 활용(반드시 실현되게 함), 공유(합작 투자처럼 남과 나눔), 증대(확률·효과를 키움), 수용. 왼쪽일수록 적극적, 오른쪽일수록 소극적 대응입니다. 수용은 문서만 남기는 수동적 수용과 예비비를 잡아 두는 능동적 수용으로 갈립니다." },
"pm-14": {
    guide: {
      hook: "PMBOK 7판이 '프로세스에서 원칙·성과 중심'으로 바뀐 핵심 — 12원칙과 8성과영역입니다.",
      scene: "예전 PMBOK(6판)은 5프로세스군·10지식영역의 '어떻게'였습니다. 7판은 방법론(예측·애자일)에 얽매이지 않고, 지켜야 할 12원칙과 달성할 8성과영역이라는 '무엇/왜' 중심으로 바뀌었습니다.",
      why: "'6판→7판 전환(프로세스→원칙·성과)'과 12원칙·8성과영역이 출제 핵심입니다. 가치 전달·테일러링이 포인트입니다.",
      mechanism: "12원칙(지침): 성실한 관리자·이해관계자 참여·가치 집중·시스템 상호작용·리더십·테일러링·품질·복잡성 대응·위험 대응·적응성/회복력·변화 관리 등. 8성과영역(결과): 이해관계자·팀·개발방식과 생애주기·기획·프로젝트작업·인도·측정·불확실성. 가치 인도 시스템 중심, 테일러링(상황에 맞게 조정) 강조. 예측·애자일·하이브리드 모두 포괄. 프로세스는 별도 표준(PMIstandards+)으로.",
      map: [
        { as: "지켜야 할 지침", real: "12 관리 원칙", note: "" },
        { as: "달성할 결과 영역", real: "8 성과영역", note: "" },
        { as: "상황에 맞게 조정", real: "테일러링", note: "핵심" },
        { as: "프로세스→원칙·성과", real: "6판→7판", note: "전환" },
      ],
      usage: "현대 프로젝트 관리 기준입니다. 시험은 6판→7판 변화, 12원칙·8성과영역, 테일러링입니다.",
      links: [
        { topic: "Agile 선언문과 12개 원칙", how: "7판이 애자일을 포괄하는 배경입니다." },
        { topic: "감리/PMO 비교표", how: "프로젝트 관리 거버넌스와 연계됩니다." },
      ],
      exam: "PMBOK 7판은 프로세스 중심(6판)에서 12개 관리 원칙과 8개 성과영역 중심으로 전환해 예측·애자일·하이브리드를 포괄하며, 가치 인도와 테일러링을 강조한다.",
    }, image: "/concept/book/pm-14.webp", easy: "PMBOK 7판부터는 '이렇게 해라'(프로세스 중심)에서 '이런 원칙과 성과를 지향해라'로 바뀌었습니다. 8개 성과 영역 [이팀개기 성인측불] — 이해관계자, 팀, 개발방식 및 생애주기, 기획, 성과, 인도, 측정, 불확실성. 12원칙 [스팀이가 시리조품 복위적변] — 스튜어드십, 팀, 이해관계자, 가치, 시스템 사고, 리더십, 조정(Tailoring), 품질, 복잡성, 위험, 적응성과 복원력, 변화. 성과 영역은 '무엇을 잘해야 하나', 원칙은 '어떤 태도로 할 것인가'입니다." },
"pm-90": {
    guide: {
      hook: "'외부에서 검증하는 감리'와 '내부에서 관리하는 PMO'의 역할을 비교합니다.",
      scene: "프로젝트가 제대로 가는지 볼 때, 감리는 발주자를 대신해 독립적 제3자가 점검·검증하고, PMO는 조직 내부에서 프로젝트 관리를 표준화·지원합니다. 관점(외부 vs 내부)과 목적이 다릅니다.",
      why: "감리(외부·검증) vs PMO(내부·지원)의 역할·시점 비교가 출제 핵심입니다. 정보시스템 감리 제도가 포인트입니다.",
      mechanism: "감리(Audit): 발주자·제3자 관점의 독립적 점검·검증(요구충족·품질·법규 준수), 시점별(요구정의·설계·종료 등 단계 감리), 정보시스템 감리(공공 의무). PMO(Project Management Office): 조직 내부의 프로젝트 관리 표준·방법론·도구 제공, 지원형/통제형/지시형, 자원·포트폴리오 관리. 감리는 '독립적 평가', PMO는 '지속적 관리 지원'. 상호 보완.",
      map: [
        { as: "외부·독립 검증", real: "감리(Audit)", note: "발주자 관점" },
        { as: "내부 관리 지원", real: "PMO", note: "조직 관점" },
        { as: "단계별 점검", real: "감리 시점", note: "" },
        { as: "표준·방법론 제공", real: "PMO 역할", note: "" },
      ],
      usage: "프로젝트 거버넌스·품질 보증입니다. 시험은 감리 vs PMO 역할·관점, 감리 제도입니다.",
      links: [
        { topic: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)", how: "프로젝트 관리 체계와 연계됩니다." },
        { topic: "IT 거버넌스(IT-Governance)", how: "감리·PMO가 거버넌스 수단입니다." },
      ],
      exam: "감리는 발주자·제3자 관점의 독립적 검증이고 PMO는 조직 내부의 프로젝트 관리 표준·지원으로, 외부 평가와 내부 관리라는 관점 차이로 상호 보완한다.",
    }, image: "/concept/book/pm-90.webp", easy: "둘 다 프로젝트를 들여다보지만 서 있는 자리가 다릅니다. 감리는 제3자·독립적 관점에서 기술적 품질을 평가합니다 — 전자정부법 57조 1항에 따른 의무사항이고, 5억원 이상이면 의무이며, 감리법인이 수행하고 감리계획서·감리수행결과보고서를 냅니다. PMO는 발주자 관점에서 프로젝트 전 과정에 관리적으로 개입합니다 — 전자정부법 64조의2에 따른 권고사항(2013년부터 공공 정보화 사업에 도입 의무화)이고, 컨설팅업체·회계법인·대형 SI가 수행하며 SRS·아키텍처 정의서 등을 냅니다. 한 줄: 감리=평가·독립, PMO=관리·발주자 편." },
"agile-manifesto": {
    guide: {
      hook: "'문서보다 작동하는 SW, 계획보다 변화 대응'을 앞세운 애자일의 4가치·12원칙입니다.",
      scene: "무겁게 계획·문서에 매달리던 개발에 반기를 든 선언입니다. 절차·도구보다 사람과 상호작용을, 방대한 문서보다 작동하는 SW를, 계약 협상보다 고객 협력을, 계획 준수보다 변화 대응을 더 가치 있게 여깁니다.",
      why: "4대 가치와 '왼쪽 > 오른쪽(오른쪽도 가치 있음)' 뉘앙스가 출제 핵심입니다. 12원칙의 방향(반복·고객·변화)이 포인트입니다.",
      mechanism: "4가치: 개인과 상호작용 > 프로세스·도구, 작동하는 SW > 포괄적 문서, 고객과의 협력 > 계약 협상, 변화 대응 > 계획 준수(단, 오른쪽 항목도 가치 있음 — 왼쪽을 더 중시). 12원칙 요지: 고객 만족·초기·지속 인도, 요구 변화 환영, 짧은 반복 인도, 비즈니스-개발 협업, 동기부여된 개인, 대면 소통, 작동 SW가 진척 척도, 지속가능 속도, 기술 우수성, 단순성, 자기조직 팀, 정기 회고. 스크럼·XP·칸반의 정신적 토대.",
      map: [
        { as: "사람 > 도구", real: "가치 1", note: "" },
        { as: "작동 SW > 문서", real: "가치 2", note: "" },
        { as: "고객 협력 > 계약", real: "가치 3", note: "" },
        { as: "변화 대응 > 계획", real: "가치 4", note: "" },
      ],
      usage: "애자일 방법론의 철학적 토대입니다. 시험은 4가치, 왼쪽 중시 뉘앙스, 12원칙 방향입니다.",
      links: [
        { topic: "스크럼 (SCRUM)", how: "애자일 가치를 구현한 대표 프레임워크입니다." },
        { topic: "XP (eXtreme Programming)", how: "애자일 실천 방법입니다." },
      ],
      exam: "Agile 선언문은 개인·상호작용, 작동 SW, 고객 협력, 변화 대응을 더 중시하는 4가치와 반복 인도·변화 환영·자기조직 팀 등 12원칙으로, 스크럼·XP의 토대다.",
    }, image: "/concept/book/agile-manifesto.webp", easy: "애자일 선언문은 '왼쪽도 가치 있지만 오른쪽을 더 중시한다'는 4쌍입니다 — 공정·도구보다 **개인과 상호작용**, 포괄적 문서보다 **작동하는 소프트웨어**, 계약 협상보다 **고객과의 협력**, 계획 준수보다 **변화에 대응**. 주의할 점은 왼쪽을 버리라는 게 아니라 우선순위를 말한 것입니다. 12원칙은 고객만족·요구변경 수용·짧은 배포·일일 의사소통·동기부여·면대면 대화·지속 가능한 개발·작동하는 SW·좋은 기술·단순성·자기조직적 팀·정기적 회고입니다." },
"pm-73": {
    guide: {
      hook: "짧은 반복(스프린트)으로 '점진적으로 완성'해 가는 대표적 애자일 프레임워크입니다.",
      scene: "한 번에 다 만들지 않고 2~4주 스프린트마다 작동하는 결과물을 냅니다. 우선순위 목록(백로그)에서 할 일을 뽑아 스프린트를 돌리고, 매일 짧게 점검하며, 끝에 리뷰·회고로 개선합니다.",
      why: "3역할·3산출물·5이벤트(스크럼의 3-3-5)와 스프린트가 출제 핵심입니다.",
      mechanism: "3역할: PO(Product Owner — 백로그·우선순위), 스크럼 마스터(프로세스 촉진·장애 제거), 개발팀(자기조직). 3산출물: 제품 백로그, 스프린트 백로그, 증분(Increment). 5이벤트: 스프린트(2~4주 타임박스), 스프린트 계획, 데일리 스크럼(15분), 스프린트 리뷰(결과 시연), 회고(Retrospective — 프로세스 개선). DoD(완료 정의). 경험적 프로세스(투명성·점검·적응).",
      map: [
        { as: "PO·SM·개발팀", real: "3역할", note: "" },
        { as: "백로그·증분", real: "3산출물", note: "" },
        { as: "스프린트·데일리·리뷰·회고", real: "5이벤트", note: "" },
        { as: "2~4주 반복", real: "스프린트", note: "타임박스" },
      ],
      usage: "애자일 개발의 대표 프레임워크입니다. 시험은 3-3-5, 스프린트, 역할·이벤트입니다.",
      links: [
        { topic: "Agile 선언문과 12개 원칙", how: "스크럼이 구현하는 철학입니다." },
        { topic: "번다운차트 (Burn Down Chart)", how: "스프린트 진척 추적 도구입니다." },
      ],
      exam: "스크럼은 2~4주 스프린트를 반복하는 애자일 프레임워크로, 3역할(PO·SM·개발팀)·3산출물(백로그·증분)·5이벤트(스프린트·데일리·리뷰·회고 등)로 구성된다.",
    }, image: "/concept/book/pm-73.webp", easy: "2~4주짜리 짧은 주기(Sprint)를 반복해 조금씩 완성해 가는 애자일 방법론입니다. 흐름은 — 제품 기능 목록(Product Backlog)에 우선순위를 매기고 → 스프린트 계획 회의에서 이번 주기에 할 것(Sprint Backlog)을 뽑고 → 매일 15분 데일리 스크럼으로 진척을 확인하고(번다운차트에 표시) → 끝나면 스프린트 리뷰로 결과물을 검토하고 → 회고(Retrospective)로 개선점을 찾습니다. 사람은 셋 — Product Owner(무엇을 만들지 정함, 운영엔 관여 안 함), Scrum Master(장애물 제거하는 조력자, 관리자가 아님), Scrum Team(실제로 만듦)." },
"pm-86": {
    guide: {
      hook: "'남은 작업량이 줄어드는 추이'를 그려 스프린트 진척을 한눈에 보는 차트입니다.",
      scene: "스프린트가 계획대로 가는지 보려면, 남은 일(세로축)이 시간(가로축)에 따라 얼마나 줄었는지 봅니다. 이상적 하강선보다 실제선이 위에 있으면 지연, 아래면 앞섬입니다.",
      why: "번다운(남은 작업) vs 번업(완료 작업)의 차이와 이상선 대비 해석이 출제 포인트입니다.",
      mechanism: "번다운 차트: Y축(남은 작업량 — 스토리 포인트·시간), X축(스프린트 일자). 이상선(계획된 균등 소진)과 실제선 비교 → 실제선이 이상선 위면 지연, 아래면 진척 빠름. 스코프 변경 시 요철. 번업 차트(Burn-up): 완료 작업 누적 + 전체 범위선 → 스코프 변경(범위선 이동)을 명확히 표시. 스프린트/릴리스 단위. 애자일 투명성·점검 도구.",
      map: [
        { as: "남은 일이 줄어드는 선", real: "번다운", note: "" },
        { as: "이상선 위=지연", real: "진척 해석", note: "" },
        { as: "완료 누적+범위선", real: "번업(대비)", note: "스코프 표시" },
        { as: "스프린트 투명성", real: "점검 도구", note: "" },
      ],
      usage: "애자일 스프린트 진척 추적입니다. 시험은 번다운/번업 차이, 이상선 대비 해석입니다.",
      links: [
        { topic: "스크럼 (SCRUM)", how: "스프린트 진척을 번다운으로 추적합니다." },
        { topic: "EVM(Earned Value Management, 획득 가치 관리)", how: "예측형 성과 측정과 대비됩니다." },
      ],
      exam: "번다운차트는 남은 작업량이 시간에 따라 줄어드는 추이를 이상선과 비교해 스프린트 진척을 보는 차트로, 완료 작업과 범위를 함께 보는 번업차트와 구분된다.",
    }, image: "/concept/book/pm-86.webp", easy: "스프린트 안에서 '남은 일'이 얼마나 줄고 있는지를 보는 차트입니다. 가로축은 날짜, 세로축은 남은 작업량(스토리 포인트)이고, 계획선은 오른쪽 아래로 곧게 내려갑니다. 실제선이 계획선 위에 있으면 일정보다 늦은 것, 아래에 있으면 빠른 것입니다. 기울기가 곧 팀의 작업 속도(Velocity)입니다. EVM과 비교하면 — 번다운은 애자일용이고 남은 일을 100에서 0으로 태워 없애는 관점, EVM은 전통 방법론용이고 원가·획득가치 기반의 지표 관점입니다." },
"pm-74": {
    guide: {
      hook: "'기술적 탁월성'을 극단으로 추구하는 애자일 실천 방법 — 페어 프로그래밍·TDD가 대표입니다.",
      scene: "XP는 좋은 개발 습관을 극단(eXtreme)까지 밀어붙입니다. 둘이 짝지어 코딩하고(페어), 테스트를 먼저 짜고(TDD), 매일 통합하고(CI), 짧은 주기로 릴리스합니다. 코드 품질과 변화 대응을 함께 잡습니다.",
      why: "12(또는 5가치+실천) 핵심 실천(페어·TDD·CI·리팩토링·짧은 릴리스)과 5가치가 출제 핵심입니다. 스크럼과의 차이(공학 실천 중심)가 포인트입니다.",
      mechanism: "5가치: 의사소통·단순성·피드백·용기·존중. 핵심 실천: 페어 프로그래밍(둘이 한 화면), TDD(테스트 먼저), 지속적 통합(CI), 리팩토링, 짧은 릴리스, 공동 코드 소유, 계획 게임, 온사이트 고객, 40시간 근무, 코딩 표준, 메타포. 스크럼(관리 프레임워크)과 달리 공학 실천 중심 → 둘을 결합(Scrum+XP)하기도 함.",
      map: [
        { as: "둘이 함께 코딩", real: "페어 프로그래밍", note: "" },
        { as: "테스트 먼저", real: "TDD", note: "" },
        { as: "매일 통합", real: "지속적 통합(CI)", note: "" },
        { as: "공학 실천 중심", real: "스크럼과 차이", note: "" },
      ],
      usage: "애자일 개발 실천입니다. 시험은 5가치·핵심 실천, 스크럼과의 차이(공학 vs 관리)입니다.",
      links: [
        { topic: "스크럼 (SCRUM)", how: "관리 프레임워크와 결합됩니다(Scrum+XP)." },
        { topic: "DevSecOps", how: "CI·TDD가 파이프라인으로 이어집니다." },
      ],
      exam: "XP는 의사소통·단순성·피드백·용기·존중의 5가치 아래 페어 프로그래밍·TDD·CI·리팩토링·짧은 릴리스 등 공학 실천을 극단 추구하는 애자일 방법으로, 관리 중심 스크럼과 결합된다.",
    }, image: "/concept/book/pm-74.webp", easy: "의사소통과 테스트 주도 개발(TDD)을 축으로 아주 짧은 주기를 반복하는 애자일 방법론입니다. 핵심 가치 5개 [용단커피존] — 용기, 단순성, 커뮤니케이션, 피드백, 존중. 실천 항목 12개 중 시험에 자주 나오는 것은 페어 프로그래밍(둘이 한 대에서 개발), 공동 코드 소유(누구나 수정 가능), 지속적 통합(하루에도 몇 번씩 빌드), 리팩토링(기능은 그대로 두고 구조 개선), 테스트 주도 개발, 작은 릴리스(2주 단위), 주당 40시간 작업, 고객 상주(On-Site Customer)입니다." },
"pm-77": {
    guide: {
      hook: "'낭비를 없애고 흐름을 최적화'하는 도요타 생산방식에서 온 개발 철학입니다.",
      scene: "가치를 더하지 않는 모든 것(낭비)을 제거하는 게 핵심입니다. 만들다 만 재고, 불필요한 기능, 기다림, 재작업 같은 낭비를 걷어내고, 필요한 것을 필요할 때(JIT) 흐르게 만듭니다. 린 스타트업으로도 확장됐습니다.",
      why: "7대 낭비와 린 5원칙, 그리고 애자일·칸반과의 관계가 출제 핵심입니다.",
      mechanism: "린 5원칙: 가치 정의(고객 관점) → 가치 흐름 식별(가치사슬 매핑) → 흐름 창출(중단 없이) → 당김(Pull — 수요 기반, JIT) → 완벽 추구(지속 개선 Kaizen). SW 7대 낭비(메리 포펜딕): 미완성 작업·과잉 기능·재학습·불필요 이관·작업 전환·지연·결함. 도구: 가치흐름맵(VSM), 칸반(흐름 시각화·WIP 제한), 풀 시스템. 린 스타트업(MVP·Build-Measure-Learn)으로 확장.",
      map: [
        { as: "낭비 제거", real: "7대 낭비 제거", note: "핵심" },
        { as: "필요할 때 당김", real: "Pull·JIT", note: "" },
        { as: "흐름 시각화·WIP 제한", real: "칸반", note: "" },
        { as: "지속 개선", real: "Kaizen", note: "" },
      ],
      usage: "개발·프로세스 낭비 제거입니다. 시험은 5원칙, 7대 낭비, 칸반·린 스타트업입니다.",
      links: [
        { topic: "Agile 선언문과 12개 원칙", how: "린과 애자일은 낭비 제거·흐름 철학을 공유합니다." },
        { topic: "AI-DLC(AI-Driven SDLC)와 SDD(Spec Driven Development)", how: "린의 흐름·반복 정신과 연결됩니다." },
      ],
      exam: "린 방법론은 가치 정의·흐름·당김(JIT)·완벽 추구의 5원칙으로 7대 낭비를 제거하는 도요타 기반 철학으로, 칸반·린 스타트업으로 확장된다.",
    }, image: "/concept/book/pm-77.webp", easy: "도요타 생산방식에서 온 '낭비 제거' 사고를 소프트웨어에 적용한 방법론입니다. 원칙 7개 [나배결빠 위통씨] — 낭비 제거, 배움 증폭, 늦은 결정(정보가 최대한 모일 때까지), 빠른 인도, 팀에 권한 위임, 통합성 구축, 전체를 볼 것. 그리고 없애야 할 낭비 7개 [미가재작 이지결] — 미완성 작업, 가외기능(안 쓰는 기능), 재학습, 작업전환, 이관(핸드오프), 지연, 결함. 파생으로 린 소프트웨어 개발, 린 UX, 린 스타트업(MVP로 빨리 내고 반응 보기), 린 애자일이 있습니다." },

// ─────────────── 3주차: 인공지능(AI) — 교재 슬라이드 + 쉬운 설명 ───────────────
"ml-learning-methods": {
    guide: {
      hook: "기계가 배우는 세 가지 방식 — 정답을 주는 지도, 안 주는 비지도, 보상으로 배우는 강화입니다.",
      scene: "지도학습은 문제-정답 쌍으로 가르치고(스팸 분류), 비지도는 정답 없이 스스로 패턴을 찾고(고객 군집), 강화학습은 시행착오 보상으로 배웁니다(바둑). 데이터에 정답이 있느냐가 갈림길입니다.",
      why: "3대 학습 방식과 각 대표 과업이 출제 핵심입니다. 준지도·자기지도 확장이 포인트입니다.",
      mechanism: "지도학습(Supervised — 레이블 있음): 분류(범주 예측)·회귀(수치 예측). 비지도학습(Unsupervised — 레이블 없음): 군집(K-means·DBSCAN)·차원축소(PCA)·연관규칙. 강화학습(Reinforcement — 보상): 에이전트가 환경과 상호작용하며 누적 보상 최대화(Q-러닝·정책 경사). 확장: 준지도(일부만 레이블), 자기지도(데이터 자체로 레이블 생성 — LLM 사전학습). 레이블 유무·피드백 형태가 구분 기준.",
      map: [
        { as: "문제-정답으로 배움", real: "지도학습", note: "분류·회귀" },
        { as: "정답 없이 패턴", real: "비지도학습", note: "군집·차원축소" },
        { as: "보상으로 시행착오", real: "강화학습", note: "" },
        { as: "데이터로 레이블 생성", real: "자기지도", note: "LLM" },
      ],
      usage: "ML 문제 유형 판단입니다. 시험은 3방식·대표 과업, 자기지도 확장입니다.",
      links: [
        { topic: "자기지도학습(Self-supervised Learning)", how: "레이블 없이 학습하는 확장입니다." },
        { topic: "머신러닝 옵티마이저(Optimizer)", how: "학습(최적화)의 실행 방법입니다." },
      ],
      exam: "머신러닝 학습방법은 레이블 있는 지도학습(분류·회귀), 레이블 없는 비지도학습(군집·차원축소), 보상 기반 강화학습으로 나뉘며 준지도·자기지도로 확장된다.",
    }, image: "/concept/book/ml-learning-methods.png", easy: "머신러닝이 배우는 방식은 '정답지(Label)가 있느냐'로 갈립니다. 지도학습은 정답이 붙은 데이터로 배웁니다 — 고양이 사진에 '고양이'라고 표시해 학습시키면 새 영상에서 고양이를 찾아냅니다(Decision tree, Regression, Neural Network 등). 비지도학습은 정답 없이 데이터끼리의 유사성만으로 스스로 무리를 짓고(K-Means, PCA 등), 준지도학습은 정답 있는 데이터로 먼저 배운 뒤 정답 없는 데이터로 이어 배웁니다. 강화학습은 정답 대신 보상(Reward)을 최대화하도록 시행착오로 배우는 방식 — 알파고·게임 AI가 대표입니다(Q-Learning, DQN, PPO). 진화학습은 생물 진화를 흉내 낸 탐색(유전 알고리즘)입니다. 구분 축 한 줄: 지도(정답 있음)·비지도(없음)·준지도(일부)·강화(보상)·진화(진화 모방)." },
"transfer-learning": {
    guide: {
      hook: "'이미 배운 모델을 새 문제에 재활용'해 적은 데이터·시간으로 학습하는 기법입니다.",
      scene: "대량 데이터로 학습한 모델(이미지넷)은 이미 일반적 특징을 압니다. 전이학습은 그 지식을 가져와 내 문제(의료 영상)에 맞게 조금만 더 학습해, 데이터가 적어도 좋은 성능을 냅니다.",
      why: "'사전학습→미세조정'과 데이터 부족 해결, 도메인 유사성이 출제 핵심입니다. 파인튜닝과 연결됩니다.",
      mechanism: "사전학습 모델(대규모 데이터로 학습한 특징 추출기)의 가중치를 재사용 → 방식: 특징 추출(하위 층 고정·상위만 새로 학습), 미세조정(Fine-tuning — 일부·전체 재학습). 효과: 적은 데이터·짧은 시간·높은 성능. 조건: 원본-대상 도메인 유사성. 부정 전이(다르면 오히려 악화) 주의. 사례: 이미지(ResNet), NLP(BERT·GPT 사전학습→다운스트림). 파운데이션 모델의 기반 원리.",
      map: [
        { as: "배운 모델 재활용", real: "사전학습 재사용", note: "" },
        { as: "하위 층 고정", real: "특징 추출", note: "" },
        { as: "일부 재학습", real: "미세조정", note: "" },
        { as: "적은 데이터로 고성능", real: "효과", note: "" },
      ],
      usage: "데이터 부족 문제·파운데이션 모델입니다. 시험은 사전학습·미세조정, 부정 전이, 도메인 유사성입니다.",
      links: [
        { topic: "파인 튜닝(Fine-tuning)", how: "전이학습의 핵심 방식입니다." },
        { topic: "파운데이션 모델(Foundation Model)", how: "전이학습의 대규모 기반입니다." },
      ],
      exam: "전이학습은 대규모 데이터로 사전학습한 모델의 지식을 새 문제에 재활용하는 기법으로, 특징 추출·미세조정으로 적은 데이터에도 고성능을 내나 도메인이 다르면 부정 전이가 생긴다.",
    }, image: "/concept/book/transfer-learning.png", images: ["/concept/extra/transfer-learning-flow.svg"], imagesLabel: "개념도", easy: "이미 잘 배운 모델의 지식을 가져와 내 문제에 맞게 조금만 더 학습시키는 기법입니다. 수백만 장으로 학습된 모델의 아래 계층은 가중치를 고정(Freeze)해 그대로 재사용하고, 위 계층만 내 데이터로 다시 학습(Fine Tuning)합니다 — 데이터가 부족하거나 훈련 시간을 줄여야 할 때 실무에서 가장 먼저 꺼내는 카드입니다. 주요 기법 [파프도레] — 파인튜닝, 프리트레인드 모델, 도메인 적응, 레이어 재사용. 유형 [적태도 레귀변자] — 적용 범위로는 과업(Task) 전이(영상인식→음성인식처럼 응용분야가 바뀜)와 도메인 전이(영불번역기→영한번역기처럼 데이터 분포가 다름), 데이터셋 레이블 여부로는 귀납(Inductive)·변형(Transductive)·자율(Unsupervised)입니다." },
"self-supervised": {
    guide: {
      hook: "'데이터 자체에서 정답을 만들어' 레이블 없이 학습하는 방식입니다.",
      scene: "사람이 일일이 레이블을 다는 건 비쌉니다. 자기지도학습은 데이터 일부를 가리고 맞히게 하는 식으로(문장의 다음 단어 예측) 데이터 스스로 정답을 만들어, 방대한 무라벨 데이터로 학습합니다. LLM의 사전학습 방식입니다.",
      why: "'구실 과업(pretext task)으로 자가 레이블 생성'과 LLM 사전학습이 출제 핵심입니다. 비지도와의 구분이 포인트입니다.",
      mechanism: "구실 과업(Pretext Task)으로 데이터에서 지도 신호 생성: 마스킹(일부 가리고 복원 — BERT MLM), 다음 토큰 예측(GPT), 대조학습(Contrastive — 같은 것끼리 가깝게 SimCLR), 순서·회전 예측. 무라벨 대량 데이터로 표현(representation) 학습 → 전이학습으로 다운스트림에 활용. 비지도학습의 일종이나 '지도 신호를 데이터에서 만든다'는 점이 특징. 파운데이션 모델·LLM의 핵심 학습 패러다임.",
      map: [
        { as: "데이터로 정답 생성", real: "구실 과업", note: "핵심" },
        { as: "가리고 복원", real: "마스킹(BERT)", note: "" },
        { as: "다음 토큰 예측", real: "GPT 사전학습", note: "" },
        { as: "무라벨 대량 학습", real: "표현 학습", note: "" },
      ],
      usage: "LLM·파운데이션 모델 사전학습입니다. 시험은 구실 과업, LLM 사전학습, 비지도와의 구분입니다.",
      links: [
        { topic: "초거대 언어 모델(Large Language Model)", how: "자기지도로 사전학습됩니다." },
        { topic: "전이학습(Transfer Learning)", how: "학습한 표현을 다운스트림에 전이합니다." },
      ],
      exam: "자기지도학습은 마스킹·다음 토큰 예측 등 구실 과업으로 데이터 자체에서 지도 신호를 만들어 무라벨 대량 데이터로 표현을 학습하는 방식으로, LLM 사전학습의 핵심이다.",
    }, image: "/concept/book/self-supervised.png", easy: "정답(레이블)이 없는 데이터에 스스로 문제를 만들어 배우는 '지도학습 형태의 비지도학습'입니다. 먼저 프리텍스트 태스크 단계에서 스스로 만든 문제(가린 부분 맞히기 등)를 풀며 데이터의 핵심 표현을 뽑는 법을 배우고, 다운스트림 태스크 단계에서 그 표현으로 소량의 레이블 데이터만 가지고 실제 목표 작업(이미지 분류·물체 인식)을 수행하며, 마지막에 파인튜닝으로 가중치를 미세 조정합니다 — 학습단계 [프다파]. GPT가 '다음 단어 맞히기'로 배우는 것이 대표 사례입니다. 유형은 생성 기반(오토인코더·GAN·MAE), Pre-text Task 기반(공간·시간 관계), 대조학습 기반(SimCLR, MoCo)입니다." },
"federated-learning": {
    guide: {
      hook: "'데이터를 모으지 않고 모델만 학습'해 프라이버시를 지키는 분산 학습입니다.",
      scene: "병원마다 환자 데이터를 한곳에 모으면 프라이버시 위험입니다. 연합학습은 데이터는 각자 기기·기관에 두고, 각자 학습한 모델 업데이트만 중앙에서 합쳐, 원본 노출 없이 공동 모델을 만듭니다.",
      why: "'데이터 이동 없이 모델만 집계'와 프라이버시, 한계(통신·비IID)가 출제 핵심입니다. PEC와 연결됩니다.",
      mechanism: "절차: 중앙 서버가 글로벌 모델 배포 → 각 클라이언트가 로컬 데이터로 학습(데이터는 안 나감) → 모델 업데이트(가중치·경사)만 서버로 전송 → 서버가 집계(FedAvg — 가중 평균)해 글로벌 모델 갱신 → 반복. 장점: 프라이버시(원본 미이동)·엣지 활용. 한계: 통신 비용, 비IID 데이터(클라이언트별 분포 차이), 업데이트에서 정보 유출 가능(→ 차분 프라이버시·보안 집계 결합). 구글 키보드·의료·금융. PEC의 한 축.",
      map: [
        { as: "데이터는 그대로", real: "로컬 학습", note: "프라이버시" },
        { as: "모델 업데이트만 전송", real: "가중치 집계", note: "FedAvg" },
        { as: "서버가 평균", real: "글로벌 모델 갱신", note: "" },
        { as: "분포 차이 문제", real: "비IID 한계", note: "" },
      ],
      usage: "프라이버시 보존 학습입니다. 시험은 데이터 미이동·집계, 비IID·유출 한계, PEC와의 관계입니다.",
      links: [
        { topic: "PEC(Privacy-Enhancing Computation)", how: "프라이버시 보존 계산의 한 축입니다." },
        { topic: "머신 언러닝(Machine Unlearning)", how: "학습 데이터 제어라는 관심을 공유합니다." },
      ],
      exam: "연합학습은 데이터를 이동하지 않고 각 클라이언트의 모델 업데이트만 집계(FedAvg)해 공동 모델을 만드는 분산 학습으로, 프라이버시를 지키나 비IID·통신·유출이 과제다.",
    }, image: "/concept/book/federated-learning.png", easy: "내 데이터는 단말 밖으로 내보내지 않고, 학습 결과(파라미터)만 서버로 보내 다 같이 모델을 키우는 분산 학습입니다. 동작 원리 [전지취갱] — ① 전역 모델 분배(서버가 참여 단말에 모델을 나눠줌) → ② 지역 모델 갱신(각 단말이 자기 데이터로 학습) → ③ 지역 모델 취합(파라미터만 압축·암호화해 서버로) → ④ 전역 모델 갱신(취합해 전체 모델 개선). 스마트폰 키보드 추천이 대표 사례 — 내가 뭘 입력했는지는 서버로 안 가고 학습된 파라미터만 갑니다. 알고리즘은 FedSGD(한 번 학습마다 전달)와 FedAVG(K번 반복 후 전달해 수렴 시간 단축)이고, 핵심 가치는 개인정보 보호입니다." },
"machine-unlearning": {
    guide: {
      hook: "학습된 모델에서 '특정 데이터의 영향을 지우는' 기술 — 잊혀질 권리의 AI판입니다.",
      scene: "사용자가 '내 데이터를 지워달라'고 하면, 저장소에서만 지우는 게 아니라 이미 학습된 모델에서도 그 영향을 없애야 합니다. 머신 언러닝은 모델을 처음부터 다시 학습하지 않고 특정 데이터의 기여를 효율적으로 제거합니다.",
      why: "'모델에서 데이터 영향 제거'와 GDPR 잊혀질 권리, 재학습 대비 효율이 출제 핵심입니다.",
      mechanism: "목표: 특정 데이터가 학습에 안 쓰인 것과 같은 모델 상태로. 방법: 정확한 언러닝(SISA — 데이터를 샤드로 나눠 학습, 해당 샤드만 재학습), 근사 언러닝(경사 역산·영향 함수로 기여 상쇄), 재학습(가장 확실·비쌈). 도전: 검증(정말 지워졌나)·성능 유지·효율. 동기: GDPR 잊혀질 권리, 유해·저작권 데이터 제거, 프라이버시. 반대: 멤버십 추론 공격 방어. AI 프라이버시·거버넌스와 연계.",
      map: [
        { as: "모델에서 영향 제거", real: "언러닝 목표", note: "" },
        { as: "샤드별 재학습", real: "SISA(정확)", note: "" },
        { as: "기여 상쇄", real: "근사 언러닝", note: "영향 함수" },
        { as: "잊혀질 권리", real: "동기", note: "GDPR" },
      ],
      usage: "AI 프라이버시·데이터 삭제입니다. 시험은 데이터 영향 제거, 잊혀질 권리, 방법·검증입니다.",
      links: [
        { topic: "AI 프라이버시 리스크 관리", how: "학습 데이터 프라이버시 관리와 연계됩니다." },
        { topic: "연합학습(Federated Learning)", how: "학습 데이터 제어 관심을 공유합니다." },
      ],
      exam: "머신 언러닝은 학습된 모델에서 특정 데이터의 영향을 재학습 없이 효율적으로 제거하는 기술로, GDPR 잊혀질 권리에 대응하며 SISA·영향 함수 등을 사용한다.",
    }, image: "/concept/book/machine-unlearning.png", easy: "학습이 끝난 모델에서 특정 데이터의 흔적만 골라 지워, 애초에 배운 적 없는 것처럼 만드는 기술입니다. '잊혀질 권리'(GDPR) 때문에 필요해졌습니다 — 내 데이터를 지워달라고 요구하면, 처음부터 재학습하는 대신 언러닝으로 그 데이터가 모델에 미친 영향만 제거합니다. 절차는 언러닝 대상 정의 → 영향도 분석 → Impair(지울 데이터에 노이즈를 주입해 고의로 성능 저하) → Repair(나머지 데이터의 정확도 회복) → 평가·검증(Forget/Retain accuracy). 기술 요소로 Error-maximizing Noise, Impair & Repair 프레임워크, Zero-glance Unlearning(대상 데이터에 직접 접근 없이 언러닝), SISA(Sharded·Isolated·Sliced·Aggregated)가 있습니다. 2025.08 ITPE FR 기출." },
"vertical-ai": {
    guide: {
      hook: "'특정 산업·업무에 특화'된 AI — 범용 AI와 대비되는 수직 전문화입니다.",
      scene: "범용 AI(ChatGPT)는 넓게 알지만 특정 분야는 얕습니다. 버티컬 AI는 의료·법률·금융 같은 한 영역에 특화해, 그 분야의 데이터·규제·워크플로우에 최적화된 깊은 전문성을 제공합니다.",
      why: "'수직(도메인 특화) vs 수평(범용)'의 대비와 DSLM·에이전트와의 관계가 출제 포인트입니다.",
      mechanism: "특징: 특정 도메인(수직 산업)에 특화 — 도메인 데이터로 학습·미세조정(DSLM), 업무 워크플로우 통합, 규제·전문 용어 반영, 도메인 특화 에이전트. 수평 AI(범용 파운데이션 모델)와 대비·보완(범용 모델 위에 수직 특화). 장점: 높은 정확도·실무 적합·차별화. 사례: 의료 진단 AI, 법률 AI, 코딩 AI. 비즈니스 모델로 부상. Physical AI·도메인 특화 언어모델과 연계.",
      map: [
        { as: "한 산업에 특화", real: "수직 전문화", note: "" },
        { as: "도메인 데이터 학습", real: "DSLM", note: "" },
        { as: "범용과 대비·보완", real: "수평 AI", note: "" },
        { as: "높은 정확도·실무", real: "장점", note: "" },
      ],
      usage: "산업 특화 AI입니다. 시험은 수직/수평 대비, DSLM·에이전트와의 관계입니다.",
      links: [
        { topic: "도메인 특화 언어 모델(Domain-Specific Language Model)", how: "버티컬 AI의 핵심 기술입니다." },
        { topic: "파운데이션 모델(Foundation Model)", how: "범용 기반 위에 수직 특화합니다." },
      ],
      exam: "버티컬 AI는 의료·법률·금융 등 특정 산업·업무에 특화된 AI로, 도메인 데이터 학습(DSLM)과 워크플로우 통합으로 범용 수평 AI 대비 깊은 전문성을 제공한다.",
    }, image: "/concept/book/vertical-ai.png", easy: "특정 산업(의료·금융·제조)에 최적화된 데이터로 그 분야 문제만 깊게 파는 AI입니다. 반대말이 수평적 AI — ChatGPT처럼 광범위한 데이터로 뭐든 하는 범용 모델입니다. 만드는 방법은 수평적 AI(Pre-trained Model)를 도메인 특화 데이터로 파인튜닝하는 것 — 그래서 기술 요소가 sLLM(소형 언어 모델)·파인 튜닝·도메인 특화 알고리즘이고, 상대적으로 저비용이라 주로 스타트업·중소기업이 개발합니다(수평적 AI는 대형 테크 기업 주도·고비용·클라우드 인프라 필수). 활용: 의료 영상 분석, 금융 신용평가, 제조 공정 최적화." },
"physical-ai": {
    guide: {
      hook: "로봇·자율주행차처럼 '물리적 몸을 갖고 현실과 상호작용'하는 AI입니다.",
      scene: "챗봇이 화면 속에 있다면, 피지컬 AI는 센서로 현실을 인식하고 로봇 몸으로 세상에 작용합니다. 카메라·라이다로 보고, AI로 판단하고, 액추에이터로 움직입니다. 엔비디아가 주도하는 차세대 AI 패러다임입니다.",
      why: "구성요소(센서·온디바이스·LWM·디지털트윈)와 패러다임 변화(지각→생성→에이전트→피지컬)가 출제 핵심입니다.",
      mechanism: "구성: 기기 쪽(카메라/라이다 센서, 온디바이스 AI, 모델 경량화·sLLM, AI칩셋), 개발 F/W(LWM 대규모 월드 모델 — 가상세계로 합성 학습데이터 생성, Tokenizer, 디지털 트윈, AI 가속기), 벡터DB. 메커니즘 3단계: 인지(센서 데이터 수집·저장)→판단(AI 모델·시뮬레이션)→실행(액추에이터·로봇). 패러다임 변화: 지각 AI→생성 AI→에이전트 AI→피지컬 AI(지각+생성+에이전트 통합 물리작업). 엔비디아 코스모스·옴니버스.",
      map: [
        { as: "센서로 현실 인식", real: "카메라/라이다", note: "인지" },
        { as: "AI로 판단", real: "AI 모델·디지털트윈", note: "판단" },
        { as: "로봇으로 작용", real: "액추에이터", note: "실행" },
        { as: "지각→생성→피지컬", real: "패러다임 변화", note: "" },
      ],
      usage: "로봇·자율주행·휴머노이드입니다. 시험은 구성요소, 3단계 메커니즘, 패러다임 변화입니다.",
      links: [
        { topic: "온디바이스 AI", how: "피지컬 AI의 기기 쪽 핵심입니다." },
        { topic: "에이전틱 AI(Agentic AI)", how: "피지컬 AI의 전 단계 패러다임입니다." },
      ],
      exam: "Physical AI는 로봇·자율주행차 등 물리 기기에 탑재돼 센서로 인지하고 AI로 판단해 액추에이터로 실행하는 AI로, LWM·디지털트윈 등으로 지원되며 지각→생성→에이전트→피지컬 패러다임의 통합이다.",
    }, image: "/concept/book/physical-ai.png", easy: "로봇·자율주행차 같은 물리적 기기에 탑재되어 현실 세계를 인식·이해하고 상호작용하는 AI입니다. 챗봇이 화면 속에 있다면, 피지컬 AI는 몸을 갖고 세상에 나온 AI입니다. 구성 — 기기 쪽: 카메라/Lidar 센서, 온디바이스 AI, 모델 경량화(양자화·파라미터 가지치기·증류학습), sLLM, AI칩셋 / 개발 프레임워크 쪽: LWM(Large World Model — 가상 세계를 만들어 합성데이터로 학습 데이터 생성), Tokenizer(3D 데이터 토큰화), 디지털 트윈, AI 가속기 / 벡터DB. 엔비디아 솔루션이 시험 포인트: 코스모스(현실 객체 인식)·옴니버스(가상 공간 생성)·DGX(가상 공간 학습)·AGX(자율주행용 개발 플랫폼). 2025 KPC·ITPE 모의고사 기출." },
"on-device-ai": {
    guide: {
      hook: "클라우드가 아니라 '기기 자체에서' AI를 실행하는 방식입니다.",
      scene: "AI를 매번 클라우드에 보내면 느리고 프라이버시가 걱정됩니다. 온디바이스 AI는 폰·가전·차량 안에서 직접 추론해, 빠르고(저지연) 오프라인에서도 되고 데이터가 밖으로 안 나갑니다.",
      why: "'엣지 추론'의 이점(저지연·프라이버시·오프라인)과 경량화 기술이 출제 핵심입니다. 피지컬 AI와 연결됩니다.",
      mechanism: "기기 내 AI 추론(엣지). 이점: 저지연(네트워크 왕복 없음), 프라이버시(데이터 미전송), 오프라인 동작, 통신비·서버 부하↓. 과제: 제한된 연산·메모리·전력 → 경량화 필수. 경량화 기술: 양자화(Quantization — 저비트), 가지치기(Pruning), 지식 증류(Distillation), 경량 모델(sLLM·MobileNet), NPU(AI 전용 칩). 하이브리드(엣지+클라우드). 온디바이스 생성 AI(갤럭시 AI 등). 피지컬 AI의 기기 축.",
      map: [
        { as: "기기에서 직접 추론", real: "엣지 추론", note: "" },
        { as: "빠르고 프라이버시", real: "이점", note: "저지연·오프라인" },
        { as: "저비트 변환", real: "양자화", note: "경량화" },
        { as: "AI 전용 칩", real: "NPU", note: "" },
      ],
      usage: "모바일·가전·차량 AI입니다. 시험은 엣지 이점, 경량화 기술(양자화·증류), 피지컬 AI와의 관계입니다.",
      links: [
        { topic: "지식 증류(Knowledge Distillation)", how: "경량화 핵심 기법입니다." },
        { topic: "Physical AI", how: "온디바이스 AI가 기기 축입니다." },
      ],
      exam: "온디바이스 AI는 클라우드 대신 기기에서 직접 추론해 저지연·프라이버시·오프라인 이점을 얻는 방식으로, 양자화·가지치기·지식 증류 등 경량화와 NPU로 제약을 극복한다.",
    }, image: "/concept/book/on-device-ai.png", easy: "클라우드 서버가 아니라 스마트폰 같은 단말 안에서 AI 추론을 돌리는 기술입니다. 왜 쓰나 — 클라우드 AI는 왕복 지연(레이턴시), 운영 비용 폭증, 민감 데이터 유출 위험, 오프라인 작동 불가라는 한계가 있어서입니다. 대신 단말은 연산·메모리·전력이 부족하므로 경량화가 필수 — 연산 최적화(양자화·프루닝·저랭크 분해), 전력 관리(DVFS·배치 크기조정), 발열 관리(점진적 조정·작업 분산)로 버팁니다. 기술 스택은 하드웨어(NPU·GPU·DSP) → 하드웨어 추상화 계층(NNAPI·Qualcomm SNPE·ARM NN) → 런타임(TensorFlow Lite·PyTorch Mobile·ONNX Runtime Mobile) → 경량 모델(MobileNet·EfficientNet·TinyML). 갤럭시 실시간 통역이 대표 사례입니다. 2025.10 ITPE 모의고사 기출." },
"aei": {
    guide: {
      hook: "인간의 '감정을 인식·해석·반응'하는 인공 감성 지능입니다.",
      scene: "AI가 논리만이 아니라 사람의 기쁨·분노·슬픔을 알아채고 공감적으로 반응합니다. 표정·목소리·텍스트에서 감정을 읽고, 상황에 맞게 반응해 인간-AI 상호작용을 자연스럽게 합니다.",
      why: "'감정 인식·해석·표현'의 구성과 활용·윤리 이슈가 출제 포인트입니다.",
      mechanism: "구성: 감정 인식(표정·음성 톤·텍스트 감성·생체신호에서 감정 추출 — 멀티모달), 감정 이해·해석(맥락 반영), 감정 표현·반응(공감적 응답·음성·아바타). 기술: 감성 분석(NLP), 표정 인식(CV), 음성 감정 인식, 멀티모달 융합. 활용: 상담·헬스케어·고객서비스·교육·소셜 로봇. 윤리: 감정 조작·프라이버시·의존·오인식. 감성 컴퓨팅(Affective Computing)의 일종. 휴머노이드·소셜 AI와 연계.",
      map: [
        { as: "표정·음성서 감정 추출", real: "감정 인식", note: "멀티모달" },
        { as: "맥락 반영 해석", real: "감정 이해", note: "" },
        { as: "공감적 반응", real: "감정 표현", note: "" },
        { as: "조작·프라이버시", real: "윤리 이슈", note: "" },
      ],
      usage: "상담·헬스케어·소셜 로봇입니다. 시험은 감정 인식·해석·표현, 활용·윤리입니다.",
      links: [
        { topic: "멀티모달(Multimodal) AI", how: "감정 인식에 멀티모달을 씁니다." },
        { topic: "자연어처리(NLP, Natural Language Processing)", how: "텍스트 감성 분석에 활용됩니다." },
      ],
      exam: "AEI(인공 감성 지능)는 표정·음성·텍스트 등에서 감정을 인식·해석하고 공감적으로 반응하는 AI로, 상담·헬스케어에 활용되나 감정 조작·프라이버시 윤리 이슈가 있다.",
    }, image: "/concept/book/aei.png", easy: "AI에 감성지능을 결합해, 사람의 감정을 알아채고 감정적으로 반응하는 인공지능입니다. 기술 구성 3단계 — 감성 인식(심전도 ECG·피부반응 GSR·뇌파 EEG 같은 생리신호 분석 + 얼굴 PCA/LDA·음성 MFCC/HMM 같은 행태반응 분석) → 감성 생성(감성 엔진으로 반응을 만들고 TTS·멀티모달 UI로 표현) → 감성 증강(OCC 감성 평가 모델로 감성 유형을 정의하고 감성 추론기로 새로운 감성을 추론). 적용: 운전자 감정에 맞춰 음악·온도·조명을 바꾸는 AEI 자동차, 감정을 흉내내는 지능형 감성 로봇, 우울증 진단·치료 헬스케어." },
"activation-function": {
    guide: {
      hook: "신경망에 '비선형성을 부여해' 복잡한 패턴을 학습하게 하는 함수입니다.",
      scene: "활성화 함수가 없으면 신경망은 아무리 깊어도 하나의 선형 변환일 뿐입니다. 각 뉴런의 출력에 비선형 함수를 씌워야, 곡선·복잡한 관계를 학습할 수 있습니다. ReLU가 대표입니다.",
      why: "'비선형성의 필요'와 주요 함수(ReLU·Sigmoid·Softmax)의 용도·특성이 출제 핵심입니다. 기울기 소실과 연결됩니다.",
      mechanism: "역할: 뉴런 출력에 비선형성 부여(없으면 선형 모델). 종류: Sigmoid(0~1, 이진 확률 — 기울기 소실·포화), Tanh(−1~1, 중심 0), ReLU(max(0,x) — 계산 간단·기울기 소실 완화, 죽은 ReLU 문제), Leaky ReLU·ELU·GELU(개선), Softmax(다중 클래스 확률 분포, 출력층). 은닉층은 주로 ReLU 계열, 출력층은 과업별(회귀=선형, 이진=시그모이드, 다중=소프트맥스). 기울기 소실·폭주와 밀접.",
      map: [
        { as: "비선형성 부여", real: "핵심 역할", note: "없으면 선형" },
        { as: "0~1 이진 확률", real: "Sigmoid", note: "포화 문제" },
        { as: "max(0,x)", real: "ReLU", note: "은닉층 표준" },
        { as: "다중 클래스 확률", real: "Softmax", note: "출력층" },
      ],
      usage: "신경망 설계입니다. 시험은 비선형성 필요, 함수별 용도, 기울기 소실과의 관계입니다.",
      links: [
        { topic: "기울기 소실과 기울기 폭주", how: "활성화 함수가 원인·해결과 관련됩니다." },
        { topic: "손실함수(Loss Function)", how: "출력층 활성화와 짝을 이룹니다." },
      ],
      exam: "활성화 함수는 뉴런 출력에 비선형성을 부여해 복잡한 패턴 학습을 가능케 하며, 은닉층은 ReLU 계열, 출력층은 이진 시그모이드·다중 소프트맥스를 쓴다.",
    }, image: "/concept/book/activation-function.png", easy: "신경망의 각 뉴런이 받은 신호를 '내보낼까 말까, 얼마나 세게 내보낼까'를 결정하는 함수입니다. 핵심은 비선형 변환 — 이게 없으면 층을 아무리 쌓아도 직선(선형) 계산만 되어 복잡한 문제를 못 풉니다. 단극성 [단시레] — 시그모이드(0~1 출력, 이진 분류 출력층에 쓰지만 기울기 소실 문제)와 ReLU(음수는 0, 양수는 그대로 — 빠르고 기울기 소실을 막아 깊은 신경망 DNN을 가능하게 함). 양극성 [양탄리프] — Tanh(-1~1 출력, 시그모이드보다 성능 좋음), Leaky ReLU(음수에 작은 기울기 0.01을 남겨 ReLU의 '음수에서 기울기 0' 문제 해결), PReLU(음수 기울기를 학습으로 정함). 시그모이드의 0.5 문제·기울기 소실이 단골 문제점입니다." },
"loss-function": {
    guide: {
      hook: "모델의 예측이 '정답에서 얼마나 틀렸는지'를 재는 함수 — 학습의 나침반입니다.",
      scene: "모델을 학습시키려면 '얼마나 틀렸나'를 숫자로 재야 합니다. 손실함수가 그 오차를 계산하고, 최적화는 이 손실을 줄이는 방향으로 파라미터를 조정합니다. 과업에 따라 손실함수가 다릅니다.",
      why: "과업별 손실함수(MSE·크로스엔트로피)와 최적화와의 관계가 출제 핵심입니다.",
      mechanism: "역할: 예측-정답 오차 정량화 → 최적화(경사하강)가 손실 최소화. 회귀: MSE(평균제곱오차 — 이상치 민감), MAE(절대오차 — 강건), Huber. 분류: 교차 엔트로피(Cross-Entropy — 이진/범주, 확률 분포 차이), Hinge(SVM). 생성·기타: KL 발산, 대조 손실, 적대적 손실(GAN). 정규화 항 추가(L1·L2 — 과적합 방지). 손실 지형(landscape)을 최적화가 탐색. 출력층 활성화와 짝(소프트맥스+교차엔트로피).",
      map: [
        { as: "오차 정량화", real: "손실 계산", note: "나침반" },
        { as: "회귀 오차", real: "MSE·MAE", note: "" },
        { as: "분류 오차", real: "교차 엔트로피", note: "" },
        { as: "과적합 방지 항", real: "정규화(L1·L2)", note: "" },
      ],
      usage: "모델 학습 설계입니다. 시험은 과업별 손실(MSE·크로스엔트로피), 최적화·활성화와의 관계입니다.",
      links: [
        { topic: "머신러닝 옵티마이저(Optimizer)", how: "손실을 최소화하는 방법입니다." },
        { topic: "활성화함수(Activation Function)", how: "출력층 활성화와 짝을 이룹니다." },
      ],
      exam: "손실함수는 예측과 정답의 오차를 정량화해 최적화의 목표가 되며, 회귀는 MSE·MAE, 분류는 교차 엔트로피를 쓰고 L1·L2 정규화 항으로 과적합을 방지한다.",
    }, image: "/concept/book/loss-function.png", easy: "모델의 예측값과 실제값의 차이(오차)를 숫자 하나로 계산하는 함수입니다. 이 오차 점수가 있어야 옵티마이저가 역전파로 가중치를 고칠 방향을 압니다 — 시험 점수가 있어야 어디를 더 공부할지 아는 것과 같습니다. 문제 유형별로 골라 씁니다: 회귀(연속값 예측)는 MSE(차이를 제곱해 평균 — 큰 오차를 부각)·RMSE(제곱근으로 왜곡 감소)·MAE(절대값 평균), 이진분류는 BCE(시그모이드와 짝 — 맞으면 0, 틀리면 무한대로), 다중분류는 CCE(원-핫 인코딩 레이블)·SCCE(정수 레이블) — 소프트맥스와 짝입니다." },
"ml-optimizer": {
    guide: {
      hook: "손실을 줄이는 방향으로 '파라미터를 어떻게 갱신할지' 정하는 알고리즘입니다.",
      scene: "경사하강법은 손실이 낮아지는 방향(기울기 반대)으로 조금씩 내려갑니다. 옵티마이저는 이 하강을 더 빠르고 안정적으로 하도록 학습률·관성·적응을 조절합니다. Adam이 대표입니다.",
      why: "경사하강 변형(SGD·모멘텀·Adam)과 학습률·적응이 출제 핵심입니다. 손실함수와 연결됩니다.",
      mechanism: "기반: 경사하강법(파라미터 = 파라미터 − 학습률×기울기). 배치 방식: 배치 GD(전체), SGD(하나·빠름·noisy), 미니배치(절충·표준). 개선: 모멘텀(Momentum — 이전 방향 관성 → 진동 완화·빠름), Adagrad·RMSProp(파라미터별 적응 학습률), Adam(모멘텀+RMSProp, 사실상 표준). 학습률(너무 크면 발산·작으면 느림, 스케줄링·워밍업). 손실 지형의 지역 최소·안장점 탈출. 역전파로 기울기 계산.",
      map: [
        { as: "기울기 반대로 하강", real: "경사하강법", note: "" },
        { as: "하나씩·빠름", real: "SGD", note: "미니배치 표준" },
        { as: "관성으로 진동 완화", real: "모멘텀", note: "" },
        { as: "적응 학습률", real: "Adam", note: "표준" },
      ],
      usage: "모델 학습 튜닝입니다. 시험은 SGD·모멘텀·Adam, 학습률, 역전파와의 관계입니다.",
      links: [
        { topic: "손실함수(Loss Function)", how: "옵티마이저가 손실을 최소화합니다." },
        { topic: "오류 역전파(Backpropagation)", how: "기울기를 계산해 옵티마이저에 제공합니다." },
      ],
      exam: "머신러닝 옵티마이저는 경사하강법으로 손실을 줄이도록 파라미터를 갱신하는 알고리즘으로, SGD·모멘텀·Adagrad·Adam으로 발전했으며 학습률 조절이 핵심이다.",
    }, image: "/concept/book/ml-optimizer.png", easy: "손실함수가 매긴 오차를 보고 가중치를 '어느 방향으로 얼마나' 고칠지 정하는 알고리즘 — 안개 낀 산에서 가장 낮은 골짜기를 찾아 내려가는 등산가입니다. 계보로 외우면 쉽습니다: SGD(경사를 따라 내려가지만 오버슈팅·지역 최소점 문제) → 관성 계열: Momentum(관성을 더해 지역 최소점 탈출) → NAG(관성으로 이동한 지점의 기울기를 미리 봐 오버슈팅에 제동) / 개별 학습률 계열: AdaGrad(파라미터마다 다른 학습률 적용) → RMSProp(지수이동평균으로 학습률이 0에 수렴하는 것 방지)·AdaDelta(학습률 자체를 안 씀) → 그리고 둘을 합친 Adam(RMSProp+Momentum)이 실무 기본값입니다." },
"svm": {
    guide: {
      hook: "두 클래스를 '가장 넓은 여백으로 나누는 경계'를 찾는 분류 알고리즘입니다.",
      scene: "점들을 두 그룹으로 가르는 선은 여러 개지만, SVM은 두 그룹에서 가장 멀리 떨어진(마진 최대) 경계를 고릅니다. 여백이 넓을수록 새 데이터에 강합니다. 커널로 비선형 경계도 만듭니다.",
      why: "'마진 최대화·서포트 벡터'와 커널 트릭이 출제 핵심입니다.",
      mechanism: "최대 마진 분류기: 결정 경계(초평면)와 가장 가까운 데이터(서포트 벡터) 사이 거리(마진)를 최대화 → 일반화 성능↑. 서포트 벡터만 경계 결정(나머지 무관). 소프트 마진(오분류 허용 C 파라미터 — 과적합 조절). 커널 트릭(Kernel — 저차원 비선형 데이터를 고차원으로 매핑해 선형 분리, RBF·다항식 커널 — 실제 매핑 없이 내적만 계산). 회귀(SVR)도 가능. 고차원·소량 데이터에 강함.",
      map: [
        { as: "가장 넓은 여백 경계", real: "마진 최대화", note: "" },
        { as: "경계 정하는 점", real: "서포트 벡터", note: "" },
        { as: "오분류 허용", real: "소프트 마진(C)", note: "" },
        { as: "고차원 매핑", real: "커널 트릭", note: "비선형" },
      ],
      usage: "분류·회귀(고차원·소량)입니다. 시험은 마진·서포트 벡터, 커널 트릭, C 파라미터입니다.",
      links: [
        { topic: "K-NN(Nearest Neighbor) Classification", how: "다른 분류 알고리즘과 대비됩니다." },
        { topic: "앙상블 학습(Ensemble Learning)", how: "여러 분류기를 결합하는 방식과 대비됩니다." },
      ],
      exam: "SVM은 두 클래스를 마진(여백)이 최대인 초평면으로 나누는 분류기로, 서포트 벡터가 경계를 정하고 커널 트릭으로 비선형 분리를 하며 C로 과적합을 조절한다.",
    }, image: "/concept/book/svm.png", easy: "두 무리를 가르는 경계를 긋되, 양쪽에서 가장 가까운 데이터(Support Vector)와의 거리(Margin)가 최대가 되는 경계를 찾는 분류 알고리즘입니다. 길을 내되 양옆 집에서 최대한 멀게 내는 것 — 여유가 클수록 새 데이터가 와도 잘 버팁니다(과적합 회피). 구성요소: Support Vector(분류 경계에 가장 가까운 데이터), Margin(그 거리 — 이상치를 허용 안 하면 하드마진, 허용하면 소프트마진), 초평면(다차원 공간을 가르는 n-1차원 평면), 커널기법(직선으로 못 가르는 비선형 데이터를 고차원 feature space로 변환해 선형으로 가르는 트릭). 고차원 문제에서 최대 마진 초평면으로 차원의 저주를 회피하는 것도 특징입니다." },
"data-labeling": {
    guide: {
      hook: "AI 학습 데이터에 '정답(레이블)을 다는' 작업 — 지도학습의 연료입니다.",
      scene: "AI에게 '이건 고양이'라고 가르치려면 사람이 이미지에 '고양이' 태그를 달아야 합니다. 데이터 라벨링·어노테이션은 이런 정답을 붙이는 작업으로, 품질이 곧 모델 성능을 좌우합니다.",
      why: "'레이블 품질=모델 성능'과 어노테이션 유형, 효율화(능동학습·자동 라벨링)가 출제 포인트입니다.",
      mechanism: "라벨링(레이블 부여)·어노테이션(상세 주석 — 바운딩 박스·세그멘테이션·키포인트·개체명). 유형: 이미지(분류·박스·세그멘테이션), 텍스트(감성·개체명·의도), 음성·비디오. 품질 관리: 가이드라인·검수·다중 라벨러 일치도(카파). 과제: 비용·시간·주관성·편향. 효율화: 능동학습(Active Learning — 불확실한 것만 라벨), 준지도·자기지도, 자동 라벨링(모델 예비 라벨+검수), 합성 데이터. 데이터 품질 관리·AI Ready Data와 연계.",
      map: [
        { as: "정답 태그 달기", real: "라벨링", note: "" },
        { as: "박스·세그멘테이션", real: "어노테이션", note: "" },
        { as: "라벨러 일치도", real: "품질 관리(카파)", note: "" },
        { as: "불확실한 것만 라벨", real: "능동학습", note: "효율화" },
      ],
      usage: "학습 데이터 구축입니다. 시험은 어노테이션 유형, 품질 관리, 능동학습·자동 라벨링입니다.",
      links: [
        { topic: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1", how: "학습 데이터 품질 기준입니다." },
        { topic: "합성 데이터(Synthetic Data)", how: "라벨링 부담을 줄이는 대안입니다." },
      ],
      exam: "데이터 라벨링·어노테이션은 학습 데이터에 정답을 부여하는 작업으로 품질이 모델 성능을 좌우하며, 능동학습·자동 라벨링·합성 데이터로 비용·편향 문제를 완화한다.",
    }, image: "/concept/book/data-labeling.png", easy: "라벨링은 AI가 기계학습에 쓸 수 있도록 원천데이터에 목적에 맞는 정보(정답)를 부착하는 활동이고, 어노테이션은 인간이 부여한 식별기준을 기계가 인식할 수 있도록 추가 정보를 기입하는 과정입니다. 데이터 유형별 방식이 시험 포인트 — 텍스트: 텍스트분류(클래스 라벨)·개체명인식(단어 라벨)·관계-의존성정의 / 이미지: 이미지분류(클래스 라벨)·객체인식(바운딩박스=사각형, 폴리곤=다각형) / 비디오: 객체인식(바운딩박스·키포인트)·객체추적(폴리곤·폴리라인) / 오디오: 분류(클래스 라벨)·음성인식(텍스트 전사). 국내 'AI 학습용 데이터 구축 사업'의 핵심 공정이기도 합니다." },
"knowledge-distillation": {
    guide: {
      hook: "'큰 교사 모델의 지식을 작은 학생 모델에 옮겨' 경량화하는 기법입니다.",
      scene: "성능 좋은 큰 모델은 무거워서 폰에 못 올립니다. 지식 증류는 큰 교사 모델의 출력(부드러운 확률)을 작은 학생 모델이 흉내 내게 학습시켜, 작으면서도 교사에 가까운 성능을 내게 합니다.",
      why: "'교사-학생·소프트 레이블'과 경량화 목적이 출제 핵심입니다. 온디바이스 AI와 연결됩니다.",
      mechanism: "교사(Teacher — 큰 모델)의 출력을 학생(Student — 작은 모델)이 학습. 핵심: 소프트 레이블(Soft Label — 교사의 확률 분포, 온도 T로 부드럽게 → 정답뿐 아니라 클래스 간 유사성 정보 전달, 하드 레이블보다 풍부). 손실 = 학생-정답(하드) + 학생-교사(소프트, KL 발산) 결합. 유형: 응답 기반(출력), 특징 기반(중간층), 관계 기반. 효과: 모델 크기·추론 비용↓, 성능 유지. 양자화·가지치기와 함께 경량화. 온디바이스·엣지 AI.",
      map: [
        { as: "큰 교사→작은 학생", real: "지식 전달", note: "" },
        { as: "교사의 확률 분포", real: "소프트 레이블", note: "핵심" },
        { as: "온도로 부드럽게", real: "클래스 유사성 전달", note: "" },
        { as: "작으면서 고성능", real: "경량화 효과", note: "" },
      ],
      usage: "모델 경량화·온디바이스입니다. 시험은 교사-학생·소프트 레이블, 경량화 기법 비교입니다.",
      links: [
        { topic: "온디바이스 AI", how: "지식 증류로 경량화합니다." },
        { topic: "PEFT(Parameter-Efficient Fine-Tuning)", how: "효율적 모델 기법을 공유합니다." },
      ],
      exam: "지식 증류는 큰 교사 모델의 소프트 레이블(확률 분포)을 작은 학생 모델이 학습해 성능을 유지하며 경량화하는 기법으로, 온디바이스 AI에 활용된다.",
    }, image: "/concept/book/knowledge-distillation.png", easy: "크고 똑똑한 교사 모델(Teacher)의 지식을 작고 가벼운 학생 모델(Student)에게 옮겨, 성능은 비슷하면서 훨씬 가벼운 모델을 만드는 기법입니다. 비결은 소프트 타겟 — 교사가 '정답은 개'라고만 알려주는 게 아니라 '개 90%·늑대 8%·고양이 2%'라는 확률 분포(판단의 뉘앙스)까지 전달합니다. 손실은 Soft Loss(교사·학생의 확률분포 차이)와 Hard Loss(실제 레이블과의 차이)를 함께 씁니다. 유형 [로피관] — 로짓 기반(출력값이 지식)·피처 기반(중간 계층이 지식)·관계 기반(관계가 지식). 전달 방법 [오온자] — 오프라인(교사 고정)·온라인(교사·학생 실시간 동시 학습)·자기 증류(한 네트워크가 교사 겸 학생). 온디바이스 AI 경량화의 핵심 기술이며 123회 컴시응 기출입니다." },
"batch-normalization": {
    guide: {
      hook: "각 층의 입력을 '정규화해' 학습을 빠르고 안정적으로 만드는 기법입니다.",
      scene: "층이 깊어지면 앞 층의 변화가 뒤 층 입력 분포를 흔들어 학습이 불안정해집니다. 배치 정규화는 각 층의 입력을 미니배치 단위로 평균 0·분산 1로 맞춰, 학습을 안정화하고 가속합니다.",
      why: "'내부 공변량 이동 완화·학습 안정화'와 효과(빠른 학습·정규화 효과)가 출제 핵심입니다.",
      mechanism: "각 층 입력을 미니배치 통계(평균·분산)로 정규화 → 학습 가능한 스케일(γ)·이동(β) 파라미터로 복원(표현력 유지). 효과: 내부 공변량 이동(Internal Covariate Shift) 완화, 큰 학습률 사용 가능(빠른 수렴), 기울기 소실·폭주 완화, 약한 정규화(과적합↓, 드롭아웃 대체 일부). 위치: 활성화 함수 전(주로). 추론 시 이동 평균 사용. 변형: 레이어 정규화(Transformer), 인스턴스·그룹 정규화. 딥러닝 학습의 표준 기법.",
      map: [
        { as: "입력 분포 안정화", real: "배치 정규화", note: "" },
        { as: "평균 0·분산 1", real: "정규화", note: "" },
        { as: "분포 흔들림 완화", real: "내부 공변량 이동", note: "" },
        { as: "빠른 수렴·정규화", real: "효과", note: "" },
      ],
      usage: "딥러닝 학습 안정화입니다. 시험은 내부 공변량 이동, 효과, 레이어 정규화(Transformer)입니다.",
      links: [
        { topic: "기울기 소실과 기울기 폭주", how: "배치 정규화가 완화합니다." },
        { topic: "정규화, 규제화, 표준화", how: "정규화 개념을 공유합니다." },
      ],
      exam: "배치 정규화는 각 층 입력을 미니배치 단위로 평균 0·분산 1로 정규화해 내부 공변량 이동을 완화하는 기법으로, 학습을 가속·안정화하며 Transformer는 레이어 정규화를 쓴다.",
    }, image: "/concept/book/batch-normalization.png", easy: "학습 시 미니배치 단위로, 각 층에 들어가는 값의 분포를 평균 0·분산 1로 맞춰주는 기법입니다. 층을 지날수록 데이터 분포가 제멋대로 흔들리면 학습이 느려지고 기울기가 사라지는데, 매 층 입구에서 저울의 눈금을 다시 맞춰주는 셈입니다. 절차: 미니배치의 평균·분산 계산 → 활성화값 정규화 → Scale/Shift 변환 후 활성함수·은닉층 적용 → 출력 확인·반복. 효과가 시험 포인트: 기울기 소실 문제 해결, Learning Rate를 자유롭게(크게) 설정해 빠른 학습, 자체 Regularization 효과로 Dropout 없이도 과적합 억제, 초기값 선택 의존성 저하." },
"norm-reg-std": {
    guide: {
      hook: "헷갈리는 세 용어 — 스케일 맞추는 정규화·표준화와 과적합 막는 규제화입니다.",
      scene: "이름이 비슷해 헷갈리지만 목적이 다릅니다. 정규화·표준화는 데이터 값의 범위를 맞추는 전처리, 규제화(regularization)는 모델이 과적합하지 않게 복잡도에 벌점을 주는 것입니다.",
      why: "세 용어의 목적 구분이 출제 핵심입니다. 특히 정규화(스케일링) vs 규제화(과적합 방지)의 혼동 주의가 포인트입니다.",
      mechanism: "정규화(Normalization — Min-Max): 값을 0~1 범위로 스케일링(최소-최대). 표준화(Standardization — Z-score): 평균 0·표준편차 1로 변환(정규분포화). 둘 다 전처리(특성 스케일 통일 → 학습 안정·거리 기반 알고리즘). 규제화(Regularization): 모델 복잡도에 벌점 추가로 과적합 방지 — L1(Lasso — 희소·특성 선택), L2(Ridge — 가중치 축소), 드롭아웃·조기 종료. 목적 다름: 정규화/표준화=데이터 스케일, 규제화=모델 일반화. 한글 '정규화'가 둘 다 뜻해 혼동.",
      map: [
        { as: "0~1 스케일링", real: "정규화(Min-Max)", note: "전처리" },
        { as: "평균0·표준편차1", real: "표준화(Z-score)", note: "전처리" },
        { as: "복잡도 벌점", real: "규제화(L1·L2)", note: "과적합 방지" },
        { as: "스케일 vs 일반화", real: "목적 구분", note: "혼동 주의" },
      ],
      usage: "전처리·과적합 방지입니다. 시험은 세 용어 목적 구분, L1/L2 규제화입니다.",
      links: [
        { topic: "배치 정규화(Batch Normalization)", how: "층 내부 정규화 기법입니다." },
        { topic: "Dropout", how: "규제화(과적합 방지) 기법입니다." },
      ],
      exam: "정규화(Min-Max)·표준화(Z-score)는 특성 스케일을 맞추는 전처리이고, 규제화(L1·L2·드롭아웃)는 모델 복잡도에 벌점을 줘 과적합을 막는 것으로 목적이 다르다.",
    }, image: "/concept/book/norm-reg-std.png", easy: "셋 다 머신러닝 학습을 안정시키는 손질 기법인데, 손대는 대상이 다릅니다. 정규화(Normalization)는 입력 데이터를 특정 구간(주로 0~1)으로 압축합니다. Min-Max 스케일링 (x−min)/(max−min) — 거리 기반 알고리즘 성능 향상, 단 이상치에 취약. 표준화(Standardization)는 입력 데이터를 평균 0·표준편차 1의 표준정규분포로 변환합니다. Z-score (x−μ)/σ — 경사하강법 속도 향상, 이상치 영향 축소. 규제화(Regularization)는 데이터가 아니라 모델 가중치에 패널티를 더해(J(w)=MSE+λ‖w‖²) 과적합을 방지합니다 — L1(Lasso)·L2(Ridge)가 대표. 한 줄 정리: 정규화·표준화=입력 데이터 손질, 규제화=모델 복잡도 단속." },
"dropout": {
    guide: {
      hook: "학습 중 '뉴런을 무작위로 꺼서' 과적합을 막는 규제화 기법입니다.",
      scene: "특정 뉴런에만 의존하면 과적합됩니다. 드롭아웃은 학습할 때마다 일부 뉴런을 무작위로 끄서, 모델이 특정 뉴런에 의존하지 않고 견고한 특징을 배우게 합니다. 여러 모델을 앙상블하는 효과도 있습니다.",
      why: "'무작위 뉴런 비활성화·과적합 방지'와 앙상블 효과, 학습/추론 차이가 출제 핵심입니다.",
      mechanism: "학습 시: 각 반복마다 뉴런을 확률 p로 무작위 비활성화(출력 0) → 매번 다른 부분망 학습. 효과: 뉴런 간 공적응(co-adaptation) 방지, 견고한 특징, 암묵적 앙상블(여러 서브넷의 평균). 추론 시: 모든 뉴런 사용하되 출력을 p로 스케일(또는 학습 시 역스케일 inverted dropout). 규제화(과적합 방지)의 대표. 배치 정규화와 병용 주의. CNN·완전연결층. 변형: DropConnect·공간 드롭아웃.",
      map: [
        { as: "뉴런 무작위 끄기", real: "드롭아웃", note: "학습 시" },
        { as: "특정 뉴런 의존 방지", real: "공적응 방지", note: "" },
        { as: "여러 서브넷 평균", real: "앙상블 효과", note: "" },
        { as: "추론 시 다 켬·스케일", real: "학습/추론 차이", note: "" },
      ],
      usage: "과적합 방지입니다. 시험은 무작위 비활성화, 앙상블 효과, 학습/추론 차이입니다.",
      links: [
        { topic: "정규화, 규제화, 표준화", how: "드롭아웃은 규제화 기법입니다." },
        { topic: "앙상블 학습(Ensemble Learning)", how: "암묵적 앙상블 효과를 냅니다." },
      ],
      exam: "드롭아웃은 학습 시 뉴런을 확률 p로 무작위 비활성화해 공적응을 막고 과적합을 방지하는 규제화 기법으로 암묵적 앙상블 효과를 내며, 추론 시에는 전체 뉴런을 스케일해 쓴다.",
    }, image: "/concept/book/dropout.png", easy: "학습할 때마다 은닉층 노드 일부를 무작위로 꺼버려 과적합을 막는 기법입니다. 매번 다른 조합의 '부분 팀'으로 연습시키면 특정 노드끼리 서로 의존하는 동조현상(co-adaptation)이 깨지고, 결과적으로 여러 모델을 합친 앙상블·Voting 효과가 납니다. 동작: Dropout Rate 입력(0.5면 50% 확률로 비활성화) → 임의 노드 비활성화 상태로 학습 → 오류 역전파를 반복 → 테스트 때는 노드를 전부 복원하되 확률 P를 가중치 W에 곱해 보정. 유형: Fast Dropout(가우시안 마스크로 속도 개선), Ad-hoc Dropout(균일 분포 마스크), DropConnect(노드 대신 가중치를 비활성화)." },
"dbscan": {
    guide: {
      hook: "'밀도가 높은 영역'을 군집으로 묶고 나머지는 잡음으로 처리하는 클러스터링입니다.",
      scene: "K-means는 군집 수를 미리 정하고 원형만 잘 잡습니다. DBSCAN은 '점이 촘촘히 모인 곳'을 군집으로 자동으로 찾아, 개수를 몰라도 되고 임의 모양 군집·이상치를 잘 처리합니다.",
      why: "'밀도 기반·군집 수 자동·이상치 탐지'와 K-means와의 차이가 출제 핵심입니다. 두 파라미터(ε·MinPts)가 포인트입니다.",
      mechanism: "파라미터: ε(반경), MinPts(최소 이웃 수). 점 분류: 핵심점(ε 내 MinPts 이상), 경계점(핵심점 이웃이나 자신은 미달), 잡음점(둘 다 아님 — 이상치). 핵심점들을 밀도로 연결해 군집 형성. 장점: 군집 수 자동, 임의 모양(비구형) 군집, 이상치 탐지. 단점: 밀도 다른 군집·고차원에 약함, 파라미터 민감. K-means(개수 지정·구형·이상치 취약)와 대비. 이상 탐지에도 활용.",
      map: [
        { as: "촘촘한 곳=군집", real: "밀도 기반", note: "" },
        { as: "반경·최소 이웃", real: "ε·MinPts", note: "" },
        { as: "군집 수 자동", real: "장점", note: "K-means와 차이" },
        { as: "잡음점=이상치", real: "이상치 탐지", note: "" },
      ],
      usage: "군집·이상 탐지입니다. 시험은 밀도 기반·ε/MinPts, K-means와의 차이, 이상치입니다.",
      links: [
        { topic: "K-평균 알고리즘", how: "군집 수 지정·구형과 대비됩니다." },
        { topic: "이상치(Outlier)", how: "DBSCAN이 이상치를 탐지합니다." },
      ],
      exam: "DBSCAN은 밀도가 높은 영역을 군집으로 묶고 잡음을 이상치로 처리하는 클러스터링으로, ε·MinPts로 군집 수를 자동 결정하고 임의 모양 군집을 찾아 K-means와 대비된다.",
    }, image: "/concept/book/dbscan.png", easy: "점들이 빽빽한 곳(밀도)을 따라 군집을 만들어가는 클러스터링입니다. 반경 Epsilon 안에 이웃이 minPts개 이상이면 Core Point(군집의 핵), 핵은 못 되지만 핵의 반경 안에 있으면 Border Point(경계), 어디에도 못 끼면 Noise Point — 그리고 Core끼리 반경이 겹치면 Connected로 보고 하나의 군집으로 이어붙입니다. 구성요소 [코보노]. K-means와의 차이가 결정적 시험 포인트: K-means는 군집 개수를 미리 정해야 하고 원형 군집만 잘 찾지만, DBSCAN은 개수 지정이 필요 없고 반달 모양 같은 임의 형태 군집도 찾아내며 이상치(Noise)를 자동으로 걸러냅니다." },
"backpropagation": {
    guide: {
      hook: "신경망의 '오차를 뒤로 전파하며 각 가중치의 책임을 계산'하는 학습 알고리즘입니다.",
      scene: "출력의 오차가 어느 가중치 때문인지 알아야 고칩니다. 역전파는 연쇄법칙으로 오차를 출력층에서 입력층으로 거꾸로 전파하며 각 가중치의 기울기(오차 기여도)를 구하고, 옵티마이저가 그만큼 가중치를 조정합니다.",
      why: "'연쇄법칙·기울기 계산'과 순전파-역전파 사이클, 기울기 소실이 출제 핵심입니다.",
      mechanism: "사이클: 순전파(입력→출력, 예측·손실 계산) → 역전파(출력의 손실을 연쇄법칙으로 각 층·가중치의 편미분=기울기로 뒤로 전파) → 가중치 갱신(옵티마이저가 기울기×학습률만큼). 핵심: 미분의 연쇄법칙(합성함수 미분)으로 효율적 기울기 계산. 문제: 층 깊으면 기울기 소실(작아짐)·폭주(커짐) → ReLU·배치정규화·잔차 연결로 완화. 딥러닝 학습의 근간. 자동 미분으로 구현.",
      map: [
        { as: "예측·손실 계산", real: "순전파", note: "" },
        { as: "오차 거꾸로 전파", real: "역전파", note: "연쇄법칙" },
        { as: "가중치 책임=기울기", real: "편미분", note: "" },
        { as: "깊으면 소실·폭주", real: "문제", note: "" },
      ],
      usage: "신경망 학습입니다. 시험은 순전파-역전파, 연쇄법칙, 기울기 소실입니다.",
      links: [
        { topic: "기울기 소실과 기울기 폭주", how: "역전파의 대표 문제입니다." },
        { topic: "머신러닝 옵티마이저(Optimizer)", how: "역전파 기울기로 가중치를 갱신합니다." },
      ],
      exam: "오류 역전파는 순전파로 손실을 구한 뒤 연쇄법칙으로 오차를 출력층에서 입력층으로 전파하며 각 가중치의 기울기를 계산하는 학습 알고리즘으로, 층이 깊으면 기울기 소실·폭주가 생긴다.",
    }, image: "/concept/book/backpropagation.png", easy: "신경망이 틀린 만큼(오차)을 출력층에서 입력층 방향으로 거꾸로 전파하며 각 노드의 가중치를 고치는 학습 알고리즘입니다. '누가 오차에 얼마나 기여했나'를 따져 책임만큼 고치는 것 — 이를 수학적으로 가능하게 하는 것이 Chain Rule(합성함수의 미분은 각 함수 미분의 곱)이고, Delta Rule(오차에 기여한 만큼 가중치 조절: w ← w + α·e·x)로 업데이트합니다. 절차: 출력값과 실제값 간 오차 계산 → 역전파로 각 가중치에 대한 기울기 계산 → 경사하강법으로 가중치 조정(W ← W − α·∂E/∂W) → 성능이 오를 때까지 반복. 오늘날 모든 딥러닝 학습의 기본 엔진입니다." },
"knn": {
    guide: {
      hook: "'가장 가까운 이웃 K개의 다수결'로 분류하는 가장 단순한 알고리즘입니다.",
      scene: "새 데이터가 어느 부류인지 궁금하면, 주변에서 가장 가까운 K개를 보고 그들이 많이 속한 부류로 정합니다. 학습 없이 데이터를 그대로 기억했다가 예측 때 비교하는 게으른 학습입니다.",
      why: "'게으른 학습·K와 거리'와 장단(단순 vs 예측 느림·차원의 저주)이 출제 핵심입니다.",
      mechanism: "게으른 학습(Lazy — 학습 시 저장만, 예측 시 계산): 새 점과 모든 훈련 데이터의 거리(유클리드·맨해튼) 계산 → 가장 가까운 K개 선택 → 다수결(분류)·평균(회귀). K 선택: 작으면 노이즈 민감(과적합), 크면 경계 흐림(과소적합), 홀수(동점 방지). 특성 스케일 정규화 필수. 단점: 예측 느림(전수 비교 — ANN으로 가속), 차원의 저주(고차원서 거리 무의미), 메모리. 단순·직관적. 추천·이상탐지.",
      map: [
        { as: "가까운 K개 다수결", real: "KNN 분류", note: "" },
        { as: "학습 없이 저장만", real: "게으른 학습", note: "" },
        { as: "거리 계산", real: "유클리드·맨해튼", note: "" },
        { as: "고차원서 무력", real: "차원의 저주", note: "단점" },
      ],
      usage: "분류·추천·이상탐지입니다. 시험은 게으른 학습·K·거리, 차원의 저주, ANN 가속입니다.",
      links: [
        { topic: "거리 공식(Distance Formula)", how: "이웃 판정의 기준입니다." },
        { topic: "ANN(Approximate Nearest Neighbor) 알고리즘", how: "KNN 예측을 가속합니다." },
      ],
      exam: "KNN은 새 데이터와 가장 가까운 K개 이웃의 다수결로 분류하는 게으른 학습으로, 거리 기반·K 선택이 핵심이며 예측이 느리고 차원의 저주에 취약하다.",
    }, image: "/concept/book/knn.png", easy: "새 데이터가 오면 가장 가까운 이웃 K개를 찾아 다수결로 분류하는 '유유상종' 알고리즘입니다. 동작: K값 설정(작으면 노이즈에 민감·과적합, 크면 과소적합) → 거리 측정방법 설정 → K개 최근접 이웃 탐색 → 가장 많은 클래스로 확정. 거리 [유맨민체코] — 유클리디안(직선)·맨하탄(격자 경로, 고차원에서 안정적)·민코프스키(둘의 일반화)·체비쇼프(최대 거리 기준)·코사인 유사도(벡터 간 각도). 성능평가 [정정재F RA] — 정확도·정밀도·재현율·F-1 Score(혼동행렬 환산)와 ROC·AUC(임계값 변화). 영화 추천('나와 취향이 가까운 사람들이 본 것')이 대표 활용입니다." },
"gradient-vanishing": {
    guide: {
      hook: "깊은 신경망에서 기울기가 '너무 작아지거나(소실) 커지는(폭주)' 학습 방해 현상입니다.",
      scene: "역전파로 기울기를 뒤로 전파할 때, 층이 깊으면 기울기가 계속 곱해지며 0에 수렴하거나(소실 — 앞 층이 학습 안 됨) 발산합니다(폭주 — 발산·NaN). 딥러닝 학습의 고질적 문제입니다.",
      why: "'원인(연쇄 곱·포화 활성화)'과 해결책(ReLU·배치정규화·잔차·클리핑)이 출제 핵심입니다.",
      mechanism: "원인: 역전파의 연쇄법칙에서 층마다 기울기가 곱해짐 → 값이 1보다 작으면 지수적 감소(소실 — Sigmoid/Tanh 포화 영역), 크면 지수적 증가(폭주). 소실 해결: ReLU 계열 활성화(포화 없음), 배치/레이어 정규화, 잔차 연결(ResNet — 지름길로 기울기 전달), 적절한 가중치 초기화(Xavier·He). 폭주 해결: 기울기 클리핑(임계 초과 시 잘라냄), 정규화. RNN에서 특히 심각(LSTM·GRU로 완화). Transformer가 근본 회피.",
      map: [
        { as: "기울기 0 수렴", real: "기울기 소실", note: "앞 층 학습 안 됨" },
        { as: "기울기 발산", real: "기울기 폭주", note: "NaN" },
        { as: "포화 없는 활성화", real: "ReLU 해결", note: "" },
        { as: "지름길 연결", real: "잔차(ResNet)", note: "" },
      ],
      usage: "딥러닝 학습 안정화입니다. 시험은 원인, ReLU·배치정규화·잔차·클리핑 해결책입니다.",
      links: [
        { topic: "오류 역전파(Backpropagation)", how: "역전파에서 발생하는 문제입니다." },
        { topic: "활성화함수(Activation Function)", how: "ReLU가 소실을 완화합니다." },
      ],
      exam: "기울기 소실·폭주는 깊은 신경망 역전파에서 기울기가 연쇄 곱으로 0에 수렴하거나 발산하는 문제로, ReLU·배치정규화·잔차 연결·기울기 클리핑으로 해결한다.",
    }, image: "/concept/book/gradient-vanishing.png", easy: "깊은 신경망을 역전파로 학습할 때 기울기가 층을 거칠수록 점점 작아져 가중치가 업데이트되지 않는 것이 기울기 소실, 반대로 점점 커져 비정상적으로 발산하는 것이 기울기 폭주입니다. 전화 게임처럼 신호가 여러 층을 거치며 흐려지거나 증폭되는 셈입니다. 원인 — 활성화 함수 측면: 은닉층의 시그모이드(출력이 0/1에 수렴하면 기울기가 0에 가까워짐) / 가중치 측면: 부적합한 가중치·역전파 중 폭주. 해결이 시험 포인트 — 은닉층에 시그모이드 대신 ReLU·ReLU 변형 사용, Gradient Clipping(임계값을 넘지 않게 기울기를 자름), 가중치 초기화(Xavier: 층 간 기울기 분산 균형 / He: Xavier의 ReLU 부적합성 극복), 배치 정규화." },
"k-means": {
    guide: {
      hook: "데이터를 'K개 군집으로, 중심에 가깝게' 나누는 대표 클러스터링 알고리즘입니다.",
      scene: "고객을 몇 개 그룹으로 나누고 싶을 때, K-means는 K개의 중심점을 잡고 각 점을 가장 가까운 중심에 배정한 뒤 중심을 다시 계산하기를 반복해, 비슷한 것끼리 묶습니다.",
      why: "'K 지정·중심 반복'과 단점(K 선택·초기값·구형 가정)이 출제 핵심입니다. DBSCAN과의 대비가 포인트입니다.",
      mechanism: "절차: K개 초기 중심 선택 → 각 점을 가장 가까운 중심에 할당 → 각 군집의 중심(평균) 재계산 → 변화 없을 때까지 반복(수렴). 목표: 군집 내 제곱거리 합(SSE) 최소화. K 선택: 엘보우 방법·실루엣 계수. 단점: K 미리 지정, 초기 중심에 민감(K-means++로 개선), 구형·비슷한 크기 군집만 잘, 이상치 민감. DBSCAN(밀도·자동 개수)과 대비. 빠르고 단순·확장성.",
      map: [
        { as: "K개 중심 잡기", real: "초기 중심", note: "" },
        { as: "가까운 중심에 배정", real: "할당", note: "" },
        { as: "중심 재계산 반복", real: "수렴", note: "SSE 최소" },
        { as: "K 지정·구형만", real: "단점", note: "DBSCAN과 대비" },
      ],
      usage: "고객 세분화·군집입니다. 시험은 절차·K 선택(엘보우), 단점, DBSCAN과의 대비입니다.",
      links: [
        { topic: "밀도기반 클러스터링(DBSCAN)", how: "밀도 기반·자동 개수와 대비됩니다." },
        { topic: "머신러닝 학습방법", how: "비지도 군집의 대표입니다." },
      ],
      exam: "K-평균은 K개 중심에 점을 할당하고 중심을 재계산하기를 반복해 군집 내 거리 합을 최소화하는 클러스터링으로, K를 지정해야 하고 구형 군집만 잘 잡아 DBSCAN과 대비된다.",
    }, image: "/concept/book/k-means.png", easy: "n개의 데이터를 K개 군집으로 나누는 대표 비지도 클러스터링입니다. 절차: 군집 개수 K 지정 → 초기 평균값(중심) 무작위 선정 → 각 데이터를 가장 가까운 중심 기준으로 묶음 → 중심을 소속 데이터의 평균으로 재조정 → 평균값이 더 변하지 않을 때까지 반복 후 종료. 고객 세분화(구매 패턴으로 고객을 몇 그룹으로 나누기)가 대표 활용입니다. 성능평가 [실엘] — 실루엣 계수(인접 클러스터와의 비중, 대부분 높으면 적정)와 Elbow Method(적정 K에서 응집도가 최소로 꺾이는 지점), 그 외 응집도(중심과 거리 오차 제곱합)·외부평가(정답지 기반)·Dunn Index(군집 간 거리는 멀고 군집 내 분산은 작을수록 좋음)." },
"pca": {
    guide: {
      hook: "데이터의 '분산이 가장 큰 축'을 찾아 차원을 줄이는 대표 기법입니다.",
      scene: "변수가 수백 개면 다루기 어렵습니다. PCA는 정보(분산)를 가장 많이 담은 새 축(주성분)을 찾아, 적은 수의 축으로 데이터를 압축합니다. 시각화·노이즈 제거·전처리에 씁니다.",
      why: "'분산 최대 주성분·차원 축소'와 고유값·공분산이 출제 핵심입니다. 비지도 차원축소의 대표입니다.",
      mechanism: "절차: 데이터 표준화 → 공분산 행렬 계산 → 고유값 분해(고유벡터=주성분 방향, 고유값=그 방향 분산 크기) → 고유값 큰 순으로 주성분 선택 → 원 데이터를 주성분에 사영(투영). 주성분은 서로 직교·분산 최대. 설명된 분산 비율로 차원 수 결정. 선형·비지도. 활용: 차원 축소, 시각화(2·3차원), 노이즈 제거, 다중공선성 해소. 한계: 선형만·해석 어려움. SVD로 계산. LDA(지도)와 대비.",
      map: [
        { as: "분산 최대 축", real: "주성분", note: "정보 최대" },
        { as: "공분산·고유값 분해", real: "계산", note: "" },
        { as: "큰 고유값 순 선택", real: "차원 축소", note: "" },
        { as: "선형·비지도", real: "특성", note: "LDA와 대비" },
      ],
      usage: "차원 축소·시각화입니다. 시험은 분산 최대·고유값, 차원 축소, LDA·SVD와의 관계입니다.",
      links: [
        { topic: "차원 축소(Dimensionality Reduction)", how: "PCA가 대표 기법입니다." },
        { topic: "SVD(Singular Value Decomposition)", how: "PCA를 계산하는 방법입니다." },
      ],
      exam: "PCA는 데이터의 분산이 최대인 직교 주성분을 공분산 고유값 분해로 찾아 차원을 줄이는 선형·비지도 기법으로, 시각화·노이즈 제거에 쓰이며 SVD로 계산된다.",
    }, image: "/concept/book/pca.png", easy: "변수(차원)가 너무 많은 데이터를, 정보(분산)를 최대한 보존하는 새 축(주성분)으로 투영해 차원을 줄이는 기법입니다. 여러 각도에서 그림자를 비춰보고 물체의 특징이 가장 잘 드러나는(분산이 가장 큰) 각도를 고르는 것과 같습니다. 동작: 데이터셋 로드 → 평균·공분산 계산 → 고유값·고유벡터 계산 → 고유값 큰 순서로 주성분 선택(설명된 분산 비율로 개수 결정) → 변환(Transform). 수식 포인트: 공분산(두 변수의 상관관계 — C>0 양·C<0 음·C=0 독립), Eigen Vector(Ax=λx — 선형변환해도 자기 자신의 상수배가 되는 벡터), Eigen Value(그 상수배 λ). 활용: 차원 축소, 잡음 제거, 데이터 압축·시각화." },
"dim-reduction": {
    guide: {
      hook: "많은 특성을 '적은 수로 압축'해 차원의 저주를 피하는 기법 총칭입니다.",
      scene: "특성이 너무 많으면 계산이 폭발하고 과적합·거리 무의미(차원의 저주)가 생깁니다. 차원 축소는 정보를 최대한 유지하며 특성 수를 줄여, 학습·시각화를 돕습니다. 선택과 추출 두 갈래입니다.",
      why: "'특성 선택 vs 특성 추출'과 차원의 저주, 대표 기법(PCA·t-SNE)이 출제 핵심입니다.",
      mechanism: "두 접근: 특성 선택(Feature Selection — 기존 특성 중 유용한 것 선별: 필터·래퍼·임베디드), 특성 추출(Feature Extraction — 새 저차원 특성 생성: PCA·LDA·SVD 선형, t-SNE·UMAP·오토인코더 비선형). 목적: 차원의 저주 완화(고차원서 데이터 희소·거리 무의미·과적합), 계산·저장 절감, 시각화, 노이즈 제거. 선형(PCA)·비선형(t-SNE 시각화용). 정보 손실 최소화가 관건.",
      map: [
        { as: "유용한 특성 선별", real: "특성 선택", note: "" },
        { as: "새 저차원 생성", real: "특성 추출(PCA)", note: "" },
        { as: "고차원 문제", real: "차원의 저주", note: "" },
        { as: "선형 vs 비선형", real: "PCA vs t-SNE", note: "" },
      ],
      usage: "고차원 데이터 전처리입니다. 시험은 선택/추출, 차원의 저주, PCA·t-SNE입니다.",
      links: [
        { topic: "PCA(Principal Component Analysis)", how: "대표적 특성 추출 기법입니다." },
        { topic: "LDA(Linear Discriminant Analysis)", how: "지도 차원 축소 기법입니다." },
      ],
      exam: "차원 축소는 특성을 적은 수로 줄여 차원의 저주를 완화하는 기법으로, 기존 특성을 고르는 특성 선택과 새 특성을 만드는 특성 추출(PCA·t-SNE)로 나뉜다.",
    }, image: "/concept/book/dim-reduction.png", easy: "피처(변수)가 매우 많은 다차원 데이터 세트의 차원을 줄여 새로운 데이터 세트를 만드는 기법의 총칭입니다. 목적: 2~3차원으로 줄여 시각적으로 빠르게 분석(직관적 분석)하고, 특성이 너무 많으면 학습이 어려워지는 '차원의 저주'를 완화합니다. 유형이 시험 포인트 — 선형: PCA(분산이 최대인 주성분으로 변환), LDA(클래스 간/내 분산 비율 최대화), SVD(특이값 분해 — 임의 m×n 행렬 분해), 요인 분석 / 비선형: ISOMAP(MDS와 PCA의 확장·결합), 로컬 선형 임베딩 LLE(이웃 간 선형 구조를 보존하며 저차원 임베딩), AutoEncoder(압축 후 복원하는 신경망), SOM(저차원 격자에 대응시키는 신경망식 군집화)." },
"genetic-algorithm": {
    guide: {
      hook: "'자연 진화(선택·교차·돌연변이)를 모방해' 최적해를 찾는 탐색 알고리즘입니다.",
      scene: "정답을 직접 못 구하는 복잡한 최적화 문제에서, 여러 후보 해(개체)를 만들고 좋은 것끼리 교배·변이시키며 세대를 거쳐 점점 나은 해로 진화시킵니다. 자연선택을 흉내 냅니다.",
      why: "'유전 연산(선택·교차·돌연변이)'과 메타휴리스틱·전역 탐색이 출제 핵심입니다.",
      mechanism: "절차: 초기 집단(후보 해=염색체·유전자 인코딩) → 적합도 평가(목적함수) → 선택(우수 개체 — 룰렛·토너먼트) → 교차(Crossover — 부모 해 조합해 자식 생성) → 돌연변이(Mutation — 일부 유전자 무작위 변경, 지역 최적 탈출) → 세대 반복 → 수렴. 메타휴리스틱(정확해 아닌 좋은 근사해). 장점: 전역 탐색·미분 불필요·복잡한 공간. 단점: 수렴 느림·파라미터 튜닝·최적 보장 없음. 조합 최적화·하이퍼파라미터·설계.",
      map: [
        { as: "후보 해 집단", real: "염색체·유전자", note: "" },
        { as: "우수 개체 선택", real: "선택", note: "적합도" },
        { as: "부모 조합", real: "교차(Crossover)", note: "" },
        { as: "무작위 변경", real: "돌연변이", note: "지역 최적 탈출" },
      ],
      usage: "복잡 최적화·설계입니다. 시험은 선택·교차·돌연변이, 메타휴리스틱, 장단점입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "다른 최적화 접근과 대비됩니다." },
        { topic: "AutoML", how: "하이퍼파라미터 탐색에 활용됩니다." },
      ],
      exam: "유전 알고리즘은 선택·교차·돌연변이의 진화 과정을 모방해 세대를 반복하며 최적해를 찾는 메타휴리스틱으로, 전역 탐색·미분 불필요가 장점이나 수렴이 느리다.",
    }, image: "/concept/book/genetic-algorithm.png", easy: "생물 진화(적자생존)를 흉내 내 세대를 거듭하며 점진적으로 최적해를 찾아가는 알고리즘입니다. 해를 유전자로 표현해 놓고 좋은 해끼리 교배시키면 더 좋은 해가 나온다는 발상 — 수식으로 풀기 어려운 배차·시간표·설계 최적화에 씁니다. 절차 [선교변대반] — 초기화 후 선택(적합도 높은 후보 고르기) → 교차(둘을 섞어 후대 유전자 생성) → 변이(일부를 확률적으로 바꿔 다양성 확보) → 대체(현재 유전자를 후대로 교체) → 반복(유전자가 수렴할 때까지). 기법 [룰랭토 일다균산] — 선택: 룰렛 휠(적합도 비례 확률)·랭크(순위순)·토너먼트(임의 그룹 중 최고) / 교차: 단일점·다점(특정 지점 기준)·균등(난수로 선택)·산술 교차(산술 연산 적용). 137회 정보관리 4교시 기출." },
"ensemble": {
    guide: {
      hook: "'여러 모델의 예측을 결합해' 단일 모델보다 강력하게 만드는 기법입니다.",
      scene: "한 명의 전문가보다 여러 전문가의 의견을 모으면 더 정확합니다. 앙상블은 여러 모델을 학습시켜 그 예측을 투표·평균해, 개별 모델의 약점을 상쇄하고 성능·안정성을 높입니다.",
      why: "3대 방식(배깅·부스팅·스태킹)과 편향-분산, 대표 모델(랜덤포레스트·XGBoost)이 출제 핵심입니다.",
      mechanism: "배깅(Bagging — 병렬): 데이터 부트스트랩 샘플로 여러 모델 독립 학습 후 투표·평균 → 분산↓(과적합 완화), 랜덤 포레스트(결정트리 배깅+특성 무작위). 부스팅(Boosting — 순차): 이전 모델의 오류를 다음 모델이 보완(가중치 조정) → 편향↓(성능↑), AdaBoost·Gradient Boosting·XGBoost·LightGBM. 스태킹(Stacking): 여러 모델 예측을 메타 모델이 결합. 원리: 다양성 있는 약한 학습기 결합 → 강한 학습기. 편향-분산 트레이드오프 개선. 캐글 우승 단골.",
      map: [
        { as: "병렬·투표·분산↓", real: "배깅(랜덤포레스트)", note: "" },
        { as: "순차·오류 보완·편향↓", real: "부스팅(XGBoost)", note: "" },
        { as: "메타 모델 결합", real: "스태킹", note: "" },
        { as: "약한 학습기 결합", real: "원리", note: "" },
      ],
      usage: "예측 성능 향상입니다. 시험은 배깅/부스팅/스태킹, 편향-분산, 랜덤포레스트·XGBoost입니다.",
      links: [
        { topic: "Dropout", how: "암묵적 앙상블 효과를 냅니다." },
        { topic: "서포트 벡터 머신 SVM(Support Vector Machine)", how: "단일 분류기와 대비됩니다." },
      ],
      exam: "앙상블 학습은 여러 모델을 결합해 성능을 높이는 기법으로, 병렬로 분산을 줄이는 배깅(랜덤포레스트)·순차로 편향을 줄이는 부스팅(XGBoost)·메타 모델의 스태킹으로 나뉜다.",
    }, image: "/concept/book/ensemble.png", easy: "분류기 하나에 맡기지 않고 여러 개를 만들어 예측을 결합해, 더 정확한 답을 내는 기법 — 집단지성입니다. 4대 기법이 시험 핵심: 보팅(서로 다른 알고리즘들이 투표 — 다수결이면 하드보팅, 확률 평균이면 소프트보팅), 배깅(같은 알고리즘을 부트스트랩 샘플링한 서로 다른 데이터로 병렬 학습 — 대표가 랜덤 포레스트), 부스팅(분류기를 순차 학습시키며 앞의 오류에 가중치를 부여해 강한 분류기로 — AdaBoost, GB(잔차를 경사하강법으로 보정), XGBoost, LightGBM, CatBoost), 스태킹(Cross Validation 기반으로 개별 모델의 예측값을 meta dataset 삼아 최종 Meta Learner가 학습). 한 줄 연결: 배깅=랜덤 포레스트, 부스팅=XGBoost." },
"similarity": {
    guide: {
      hook: "두 데이터가 '얼마나 비슷한지'를 수치로 재는 척도들입니다.",
      scene: "추천·검색·군집은 모두 '비슷함'을 계산해야 합니다. 방향이 비슷한지(코사인), 거리가 가까운지(유클리드), 집합이 겹치는지(자카드) 등 데이터 유형에 맞는 유사도를 씁니다.",
      why: "주요 유사도(코사인·유클리드·자카드)의 특성과 용도가 출제 핵심입니다. 거리와의 관계가 포인트입니다.",
      mechanism: "코사인 유사도(벡터 방향 각도, −1~1, 크기 무관 — 텍스트·임베딩·추천), 유클리드 거리(직선 거리 — 크기 반영), 맨해튼 거리, 자카드 유사도(집합 교집합/합집합 — 범주·집합), 피어슨 상관(선형 관계 — 협업 필터링), 해밍 거리(비트 차이). 유사도↔거리(가까울수록 유사, 거리=1−유사도 등). 선택: 데이터 유형(벡터·집합·범주)·크기 중요성. 추천·검색·군집·이상탐지·NLP에 핵심.",
      map: [
        { as: "방향 각도", real: "코사인 유사도", note: "텍스트·임베딩" },
        { as: "직선 거리", real: "유클리드", note: "크기 반영" },
        { as: "집합 겹침", real: "자카드", note: "범주" },
        { as: "선형 관계", real: "피어슨", note: "협업 필터링" },
      ],
      usage: "추천·검색·군집입니다. 시험은 코사인·유클리드·자카드 특성·용도입니다.",
      links: [
        { topic: "거리 공식(Distance Formula)", how: "유사도와 짝을 이룹니다." },
        { topic: "벡터 데이터베이스(Vector Database)", how: "유사도로 검색합니다." },
      ],
      exam: "유사도는 데이터의 비슷한 정도를 재는 척도로, 방향의 코사인 유사도(텍스트)·거리의 유클리드·집합의 자카드·선형 관계의 피어슨이 데이터 유형에 따라 쓰인다.",
    }, image: "/concept/book/similarity.png", easy: "단어나 문장을 벡터화해 특징벡터를 만들고, 두 벡터가 얼마나 닮았는지를 재는 척도입니다. 측정법 4가지 — 코사인 유사도(두 벡터 간 각도로 계산: A·B/(‖A‖·‖B‖) — 문서 길이가 달라도 방향만 비교, 검색·추천의 기본), 해밍 거리(같은 길이의 이진 벡터에서 서로 다른 비트 개수 — XOR 연산으로 측정, 길이가 다르면 측정 불가), 자카드 인덱스(교집합/합집합 비율 — 0이면 무관, 1에 가까울수록 동일), 소렌슨-다이스 인덱스(2|A∩B|/(|A|+|B|) — 교집합을 두 배로 반영해 일치 정도를 강조). '이 상품을 본 사람들이 함께 본 상품' 추천이 대표 활용입니다." },
"lda": {
    guide: {
      hook: "'클래스를 가장 잘 구분하는 축'을 찾는 지도 차원 축소·분류 기법입니다.",
      scene: "PCA가 분산이 큰 축을 찾는다면(정답 무시), LDA는 정답(클래스)을 알고 '클래스끼리 잘 분리되는' 축을 찾습니다. 같은 클래스는 뭉치고 다른 클래스는 멀어지는 방향으로 차원을 줄입니다.",
      why: "'클래스 분리 최대·지도 차원축소'와 PCA와의 차이가 출제 핵심입니다.",
      mechanism: "목표: 클래스 간 분산(between-class)은 최대, 클래스 내 분산(within-class)은 최소인 축(판별 축) 찾기 → 그 비(피셔 판별비) 최대화. 지도학습(레이블 사용). 차원 축소(최대 클래스수−1개 축)와 분류에 활용. PCA(비지도·분산 최대)와 대비 — LDA는 판별력 최대. 가정: 정규분포·등공분산. 선형(비선형은 커널 LDA). 얼굴 인식·분류 전처리. 이름 겹침 주의: 토픽 모델 LDA(Latent Dirichlet Allocation)와 다름.",
      map: [
        { as: "클래스 잘 나누는 축", real: "판별 축", note: "지도" },
        { as: "클래스 간 분산 최대", real: "between-class↑", note: "" },
        { as: "클래스 내 분산 최소", real: "within-class↓", note: "" },
        { as: "PCA는 분산 최대", real: "대비", note: "비지도" },
      ],
      usage: "지도 차원축소·분류입니다. 시험은 클래스 분리, PCA와의 차이, 토픽 LDA와의 구분입니다.",
      links: [
        { topic: "PCA(Principal Component Analysis)", how: "비지도 분산 최대와 대비됩니다." },
        { topic: "차원 축소(Dimensionality Reduction)", how: "지도 차원축소 기법입니다." },
      ],
      exam: "LDA는 클래스 간 분산은 최대, 클래스 내 분산은 최소인 판별 축을 찾는 지도 차원 축소·분류 기법으로, 분산 최대의 비지도 PCA와 대비되며 토픽 모델 LDA와는 다르다.",
    }, image: "/concept/book/lda.png", easy: "클래스 간 분산은 최대로, 클래스 내 분산은 최소로 만드는 축으로 투영해 차원을 줄이는 지도학습 차원 축소입니다. 두 반 학생들을 한 줄 위에 세울 때 반끼리는 최대한 멀리, 같은 반끼리는 최대한 모이게 하는 축을 찾는 것입니다. 동작과정 [전산고변] — 전처리(정규화) → 산포행렬 계산(클래스 간 S(B)·클래스 내 S(W)) → 고유값·고유벡터 계산(S(W) 역행렬 × S(B)) → 변환. PCA와의 비교가 단골: PCA는 비지도·데이터 분산 최대화·모든 차원 축소 가능, LDA는 지도(라벨 필요)·클래스 분리 최대화·최대 (클래스 수−1)차원까지. 가정: 각 집단이 정규분포이고 비슷한 공분산 구조를 가질 것 — 평균 차이는 극대화, 분산은 최소화." },
"transformer": {
    guide: {
      hook: "'어텐션만으로' 순차 처리 없이 문맥을 파악하는 현대 AI의 근간 아키텍처입니다.",
      scene: "RNN은 단어를 하나씩 순서대로 처리해 느리고 긴 문맥을 잊습니다. 트랜스포머는 셀프 어텐션으로 문장의 모든 단어를 한 번에 보고 서로의 관련성을 계산해, 병렬 처리하며 긴 문맥을 잡습니다. GPT·BERT의 기반입니다.",
      why: "'셀프 어텐션·병렬 처리'와 구조(인코더-디코더·멀티헤드·위치 인코딩)가 출제 핵심입니다.",
      mechanism: "핵심: 셀프 어텐션(Self-Attention — 각 토큰이 다른 모든 토큰과의 관련도를 Query·Key·Value로 계산). 멀티헤드 어텐션(여러 관점 병렬). 위치 인코딩(순서 정보 주입 — 순차 처리 안 하므로). 인코더(양방향 — BERT)·디코더(자기회귀 — GPT). 잔차 연결·레이어 정규화·FFN. 장점: 병렬(RNN보다 빠름), 장거리 의존성. 확장성(대규모 학습 → LLM). Attention Is All You Need(2017). CV(ViT)·멀티모달로 확장.",
      map: [
        { as: "모든 단어 관련성", real: "셀프 어텐션", note: "핵심" },
        { as: "여러 관점 병렬", real: "멀티헤드", note: "" },
        { as: "순서 정보 주입", real: "위치 인코딩", note: "" },
        { as: "양방향 vs 자기회귀", real: "BERT/GPT", note: "" },
      ],
      usage: "LLM·NLP·CV의 근간입니다. 시험은 셀프 어텐션·멀티헤드·위치 인코딩, RNN과의 차이입니다.",
      links: [
        { topic: "어텐션 메커니즘(Attention Mechanism)", how: "트랜스포머의 핵심입니다." },
        { topic: "초거대 언어 모델(Large Language Model)", how: "트랜스포머 기반입니다." },
      ],
      exam: "트랜스포머는 셀프 어텐션으로 모든 토큰의 관련성을 병렬 계산하는 아키텍처로, 멀티헤드 어텐션·위치 인코딩을 쓰며 RNN의 순차 처리 한계를 극복해 LLM의 근간이 된다.",
    }, image: "/concept/book/transformer.png", easy: "어텐션 메커니즘으로 문장을 병렬 처리하는, 오늘날 생성형 AI 전체의 뿌리가 되는 딥러닝 모델입니다. RNN처럼 단어를 한 개씩 순서대로 읽지 않고 문장 전체를 한 번에 보되, 포지셔널 인코딩(사인·코사인 함수)으로 단어의 위치 정보를 보존합니다. 구성 두음 [입포 인언피 디마인피 출리소] — 입력(포지셔널 인코딩) / 인코더(셀프 어텐션: Query=Key=Value 병렬처리 + 피드 포워드 신경망: 잔차 연결·정규화) / 디코더(마스크드 셀프 어텐션: 현재 이후 단어 마스킹 + 인코더-디코더 어텐션: 인코더가 Key·Value, 디코더가 Query + 피드 포워드) / 출력(Linear Layer → Softmax로 출력단어 예측). GPT는 이 중 디코더만, BERT는 인코더만 쓴 구조입니다." },
"nlp": {
    guide: {
      hook: "컴퓨터가 '사람의 언어를 이해하고 생성'하게 하는 AI 분야입니다.",
      scene: "번역·챗봇·감성 분석·요약은 모두 자연어를 다룹니다. NLP는 비정형 텍스트를 컴퓨터가 처리할 수 있게 토큰화·임베딩하고, 의미를 이해·생성하는 기술입니다. 트랜스포머·LLM으로 도약했습니다.",
      why: "처리 단계(토큰화·임베딩)와 발전(규칙→통계→딥러닝→LLM), 주요 과업이 출제 포인트입니다.",
      mechanism: "전처리: 토큰화(단어·서브워드 BPE), 정규화, 임베딩(단어를 벡터로 — Word2Vec·GloVe→문맥 임베딩 BERT). 과업: 분류(감성·의도), 개체명 인식(NER), 기계번역, 요약, 질의응답, 생성. 발전: 규칙 기반→통계(n-gram·TF-IDF)→딥러닝(RNN·LSTM)→트랜스포머·LLM(사전학습+파인튜닝). 도전: 중의성·문맥·상식·다국어. 현재 LLM이 대부분 과업 통합. 감성 지능·검색·RAG와 연계.",
      map: [
        { as: "텍스트를 토큰으로", real: "토큰화", note: "" },
        { as: "단어를 벡터로", real: "임베딩", note: "Word2Vec·BERT" },
        { as: "번역·요약·QA", real: "주요 과업", note: "" },
        { as: "규칙→통계→LLM", real: "발전", note: "" },
      ],
      usage: "챗봇·번역·검색·분석입니다. 시험은 토큰화·임베딩, 발전 단계, 과업입니다.",
      links: [
        { topic: "트랜스포머(Transformer)", how: "현대 NLP의 근간입니다." },
        { topic: "초거대 언어 모델(Large Language Model)", how: "NLP 과업을 통합합니다." },
      ],
      exam: "NLP는 컴퓨터가 사람 언어를 이해·생성하는 분야로 토큰화·임베딩으로 텍스트를 처리하며, 규칙→통계→딥러닝→트랜스포머·LLM으로 발전해 번역·요약·QA를 수행한다.",
    }, image: "/concept/book/nlp.png", easy: "사람의 언어를 컴퓨터가 이해할 수 있는 형태로 바꾸고(NLU: 자연어 이해), 컴퓨터의 처리 결과를 다시 사람의 언어로 표현하는(NLG: 자연어 생성) 기술의 총칭입니다. 주요기술 [형구의담] — 형태소 분석(품사 인식) → 구문 분석(문장 구조와 chunk 관계) → 의미 분석(성분 간 의미관계) → 담화 분석(문맥 속 의미), 이 4단계가 시험 단골입니다. NLU 쪽에는 Word Embedding·문장 분류·Seq2Seq·MRC·대화 모델, NLG 쪽에는 담화 생성·문장 계획·Lexical 선택·TTS가 있습니다. LLM 3형제도 함께: GPT(트랜스포머 디코더, 순방향), BERT(트랜스포머 인코더, 양방향), T5(문제-정답 쌍 전이학습)." },
"vae": {
    guide: {
      hook: "'데이터를 압축했다 복원하며' 새 데이터를 생성하는 확률적 오토인코더입니다.",
      scene: "오토인코더가 데이터를 압축·복원한다면, VAE는 그 압축 공간(잠재 공간)을 확률 분포로 만들어, 그 분포에서 샘플링해 새로운 데이터를 생성합니다. 생성 모델의 한 축입니다.",
      why: "'잠재 공간·확률 분포·재구성+KL 손실'과 GAN·Diffusion과의 대비가 출제 포인트입니다.",
      mechanism: "구조: 인코더(입력→잠재 분포의 평균·분산) → 잠재 변수 샘플링(재매개변수화 트릭 — 미분 가능하게) → 디코더(잠재→복원). 손실: 재구성 손실(입력-복원 차이) + KL 발산(잠재 분포를 표준정규에 가깝게 → 연속·부드러운 잠재 공간). 생성: 잠재 공간에서 샘플링→디코더로 새 데이터. GAN(적대적·선명하나 불안정)·Diffusion(고품질·느림)과 대비 — VAE는 안정·잠재 공간 해석 좋으나 흐릿. 이상탐지·표현 학습에도.",
      map: [
        { as: "압축→확률 분포", real: "잠재 공간", note: "" },
        { as: "분포에서 샘플링", real: "생성", note: "" },
        { as: "재구성+KL 손실", real: "학습", note: "" },
        { as: "안정·흐릿", real: "GAN과 대비", note: "" },
      ],
      usage: "생성·표현 학습·이상탐지입니다. 시험은 잠재 공간·KL 손실, GAN·Diffusion과의 대비입니다.",
      links: [
        { topic: "GAN(Generative Adversarial Network)", how: "다른 생성 모델과 대비됩니다." },
        { topic: "Diffusion 모델", how: "최신 생성 모델과 대비됩니다." },
      ],
      exam: "VAE는 인코더로 입력을 잠재 확률 분포로 압축하고 디코더로 복원하며 재구성 손실과 KL 발산으로 학습하는 생성 모델로, 안정적이나 GAN보다 흐릿한 결과를 낸다.",
    }, image: "/concept/book/vae.png", easy: "입력 데이터의 평균(μ)과 표준편차(σ)를 학습해 '비슷하지만 새로운' 데이터를 만들어내는 생성 모델입니다. 인코더가 데이터를 잠재 공간(Latent Space)의 확률분포로 압축하고, 거기서 샘플링한 값을 디코더가 되살립니다 — 사진을 '레시피(분포)'로 요약해 두고, 레시피를 조금 바꿔 새 요리를 만드는 셈입니다. AE와의 비교가 시험 포인트: AE는 Encoder 학습을 위해 Decoder를 연결하고 잠재 벡터가 '어떤 하나의 값'이지만, VAE는 Decoder(생성) 학습을 위해 Encoder를 쓰고 잠재 벡터가 가우시안 확률 분포 기반의 확률 값입니다. 목적: 데이터 압축·표현 학습(정규분포로 일반화된 특성 학습)과 데이터 생성(샘플링)." },
"gan": {
    guide: {
      hook: "'생성자와 판별자가 경쟁하며' 진짜 같은 데이터를 만드는 생성 모델입니다.",
      scene: "위조지폐범(생성자)은 진짜 같은 가짜를 만들고, 경찰(판별자)은 진짜·가짜를 구별합니다. 둘이 경쟁하며 실력을 키워, 결국 생성자가 진짜와 구별 안 되는 데이터를 만듭니다. 딥페이크의 기반입니다.",
      why: "'생성자-판별자 적대적 학습'과 문제(모드 붕괴·불안정), GAN/VAE/Diffusion 대비가 출제 핵심입니다.",
      mechanism: "구조: 생성자(Generator — 노이즈→가짜 데이터), 판별자(Discriminator — 진짜/가짜 판별). 적대적 학습(minimax): 판별자는 구별 잘하게, 생성자는 판별자를 속이게 번갈아 학습 → 내시 균형. 문제: 모드 붕괴(다양성 없이 몇 개만 생성), 학습 불안정, 수렴 어려움. 변형: DCGAN·StyleGAN(고품질 얼굴)·CycleGAN(도메인 변환)·조건부 GAN. 활용: 이미지 생성·딥페이크·데이터 증강·초해상도. Diffusion에 주류 자리 내줌. VAE(안정·흐릿)와 대비.",
      map: [
        { as: "가짜 만들기", real: "생성자", note: "" },
        { as: "진짜·가짜 구별", real: "판별자", note: "" },
        { as: "경쟁 학습", real: "적대적(minimax)", note: "" },
        { as: "다양성 없음", real: "모드 붕괴", note: "문제" },
      ],
      usage: "이미지 생성·딥페이크·증강입니다. 시험은 생성자-판별자, 모드 붕괴·불안정, VAE·Diffusion과의 대비입니다.",
      links: [
        { topic: "딥페이크(Deepfake)", how: "GAN이 딥페이크의 기반입니다." },
        { topic: "Diffusion 모델", how: "GAN을 대체한 생성 모델입니다." },
      ],
      exam: "GAN은 가짜를 만드는 생성자와 진짜·가짜를 구별하는 판별자가 적대적으로 경쟁하며 학습하는 생성 모델로, 모드 붕괴·학습 불안정이 문제이며 딥페이크의 기반이다.",
    }, image: "/concept/book/gan.png", easy: "위조지폐범(Generator)과 감별사(Discriminator)가 서로 경쟁하며 함께 실력이 느는 생성 모델입니다. 생성방법 [가신간디] — 생성자는 가짜가 진짜(1)로 판별되게 V(D,G)를 최소화, 판별자는 가짜=0·진짜=1로 가려내게 최대화하는 Min-Max 게임이고, 균형점이 Nash균형입니다. 유형: DCGAN(사실적 이미지), SRGAN(저해상도→고해상도), 스택 GAN(문장→이미지), 3D-GAN(입체 모델), 사이클 GAN(스타일 변환). 문제점이 단골 출제 — 모드진동(특정 단계에 머묾)·모드붕괴(일부 데이터만 학습)는 Mini-Batch Discrimination·Historical Averaging으로, 학습 성능 편차는 DCGAN·Leaky ReLU 병용으로 해결합니다. 딥페이크의 원천 기술이기도 합니다." },
"svd": {
    guide: {
      hook: "행렬을 '세 개의 의미 있는 행렬로 분해'하는 강력한 선형대수 기법입니다.",
      scene: "복잡한 데이터 행렬을 회전·확대·회전으로 분해하면 그 안의 핵심 구조가 드러납니다. SVD는 어떤 행렬이든 세 행렬(U·Σ·V)로 분해해, 차원 축소·추천·잠재 의미 분석의 기반이 됩니다.",
      why: "'행렬 분해 A=UΣVᵀ'와 활용(PCA·추천·LSA), 저차원 근사가 출제 핵심입니다.",
      mechanism: "A = U Σ Vᵀ: U(좌특이벡터·직교), Σ(특이값 대각·중요도 순), Vᵀ(우특이벡터·직교). 특이값 큰 상위 k개만 남기면 저차원 근사(Truncated SVD — 정보 최대 유지 압축). 활용: PCA 계산(공분산 대신), 차원 축소, 추천(잠재요인 — 사용자·아이템 행렬 분해), 잠재 의미 분석(LSA — 문서-단어), 이미지 압축, 노이즈 제거. 어떤 행렬(비정방 포함)에도 적용. 협업 필터링·NLP의 기반.",
      map: [
        { as: "세 행렬로 분해", real: "A=UΣVᵀ", note: "" },
        { as: "중요도 순 특이값", real: "Σ", note: "" },
        { as: "상위 k개 근사", real: "저차원 압축", note: "" },
        { as: "추천·LSA", real: "활용", note: "잠재요인" },
      ],
      usage: "차원 축소·추천·NLP입니다. 시험은 UΣVᵀ, 저차원 근사, PCA·추천·LSA와의 관계입니다.",
      links: [
        { topic: "PCA(Principal Component Analysis)", how: "SVD로 PCA를 계산합니다." },
        { topic: "차원 축소(Dimensionality Reduction)", how: "SVD가 차원 축소 기법입니다." },
      ],
      exam: "SVD는 행렬을 A=UΣVᵀ로 분해하는 기법으로 특이값 상위 k개로 저차원 근사하며, PCA 계산·추천(잠재요인)·잠재 의미 분석(LSA)의 기반이 된다.",
    }, image: "/concept/book/svd.png", easy: "아무 행렬이나 고유한 기하학적 성질을 가진 세 행렬의 곱 A=UΣV^T로 분해해, 중요한 정보만 남기고 차원을 줄이는 기법입니다. U(좌측 특이 벡터, m×m 직교행렬 — 행 공간), Σ(대각행렬 — 특이값), V^T(우측 특이 벡터, n×n 전치행렬 — 열 공간). 동작 [행분선재] — 행렬 준비 → 분해(A=UΣV^T) → 특이값 선택(큰 것만 남기고 작은 건 노이즈로 간주) → 재구성(저차원 근사 행렬). PCA와 비교가 시험 포인트: PCA는 대칭(공분산) 행렬의 고유값 분해로 분산 최대화, SVD는 비대칭 행렬에도 적용 가능한 특이값 분해입니다. 활용: 추천 시스템, 이미지 압축, 문서 분류." },
"rig": {
    guide: {
      hook: "생성 도중 '검색 결과를 문장 사이사이에 끼워 넣어' 정확도를 높이는 기법입니다.",
      scene: "RAG가 답변 생성 전에 한 번 검색한다면, RIG는 생성하는 도중에 필요할 때마다 검색해 그 결과를 답변에 인터리빙(교차 삽입)합니다. 실시간 사실을 문장 단위로 반영해 할루시네이션을 더 줄입니다.",
      why: "'생성 중 반복 검색·인터리빙'과 RAG와의 차이가 출제 포인트입니다.",
      mechanism: "생성 과정에서 모델이 사실이 필요한 지점마다 검색(Retrieval)을 호출 → 검색 결과를 생성 텍스트에 교차 삽입(Interleave) → 통계·수치 같은 사실을 실시간 근거로 대체·보강. RAG(생성 전 일괄 검색·프롬프트 주입)보다 세밀·동적 — 문장·주장 단위로 근거 확보. 효과: 할루시네이션 감소, 사실 정확도↑, 출처 추적. 구글 데이터 커먼즈 등에서 통계 답변에 활용. 에이전트·툴 사용과 결합.",
      map: [
        { as: "생성 중 검색", real: "반복 검색", note: "" },
        { as: "결과 교차 삽입", real: "인터리빙", note: "핵심" },
        { as: "문장 단위 근거", real: "세밀 반영", note: "" },
        { as: "생성 전 일괄 검색", real: "RAG와 차이", note: "" },
      ],
      usage: "사실 정확도·통계 답변입니다. 시험은 생성 중 검색·인터리빙, RAG와의 차이입니다.",
      links: [
        { topic: "검색 증강 생성(RAG, Retrieval Augmented Generation)", how: "생성 전 일괄 검색과 대비됩니다." },
        { topic: "할루시네이션(Hallucination)", how: "RIG가 이를 줄입니다." },
      ],
      exam: "RIG는 생성 도중 필요한 지점마다 검색해 결과를 텍스트에 교차 삽입하는 기법으로, 생성 전 일괄 검색하는 RAG보다 세밀하게 사실을 반영해 할루시네이션을 줄인다.",
    }, image: "/concept/book/rig.png", easy: "LLM이 답을 만드는 '중간중간에' 필요할 때마다 외부 정보를 반복 검색해 답의 정확성을 높이는 기술입니다. 동작 [초검생반] — 초기 생성(쿼리로 초안 생성) → 검색(생성된 텍스트 기반으로 필요한 정보를 외부에서 검색) → 생성 업데이트 → 반복. RAG와의 비교가 핵심 시험 포인트: RAG는 생성 '전'에 보통 한 번 검색하고 일관성이 높은 반면, RIG는 생성 '중'에 필요한 만큼 여러 번 검색해 효율성·문맥 적합성이 높지만 복잡성·학습 난이도도 높습니다. 대표 모델: RAG는 Facebook AI, RIG는 구글 데이터젬마(DataGemma)." },
"rag": {
    guide: {
      hook: "'외부 지식을 검색해 프롬프트에 넣어' LLM이 최신·정확한 답을 하게 하는 기법입니다.",
      scene: "LLM은 학습 시점 이후를 모르고 사내 문서도 모릅니다. RAG는 질문에 관련된 문서를 벡터 DB에서 검색해 프롬프트에 함께 넣어, LLM이 그 근거로 답하게 합니다. 할루시네이션을 줄이고 최신성을 확보합니다.",
      why: "'검색+생성' 파이프라인과 벡터 DB·임베딩, 할루시네이션 감소가 출제 핵심입니다.",
      mechanism: "파이프라인: 문서를 청킹→임베딩→벡터 DB 저장(인덱싱). 질의 시: 질문 임베딩→유사도 검색(ANN)으로 관련 청크 검색→검색 결과를 프롬프트에 결합(증강)→LLM 생성. 효과: 최신·도메인 지식 반영(재학습 불필요), 할루시네이션↓, 출처 제시. 개선: 리랭킹, 하이브리드 검색(키워드+벡터), 청킹 전략, 쿼리 재작성. 파인튜닝(지식 주입)과 대비·보완. RIG·에이전트로 발전. 기업 AI의 핵심 패턴.",
      map: [
        { as: "관련 문서 검색", real: "Retrieval(벡터 DB)", note: "" },
        { as: "프롬프트에 결합", real: "증강(Augment)", note: "" },
        { as: "근거로 답변", real: "생성(Generation)", note: "" },
        { as: "재학습 없이 최신", real: "효과", note: "할루시네이션↓" },
      ],
      usage: "기업 지식 챗봇·QA입니다. 시험은 검색+생성 파이프라인, 벡터 DB, 파인튜닝과의 대비입니다.",
      links: [
        { topic: "벡터 데이터베이스(Vector Database)", how: "RAG의 검색 인프라입니다." },
        { topic: "파인 튜닝(Fine-tuning)", how: "지식 주입 방식과 대비됩니다." },
      ],
      exam: "RAG는 질문에 관련된 외부 문서를 벡터 DB에서 검색해 프롬프트에 결합한 뒤 LLM이 생성하게 하는 기법으로, 재학습 없이 최신·도메인 지식을 반영하고 할루시네이션을 줄인다.",
    }, image: "/concept/book/rag.png", easy: "LLM이 답하기 전에 외부 지식(벡터 DB)을 검색해서 그 근거를 컨텍스트로 붙여 답하게 하는 기술 — '오픈북 시험'을 보게 하는 것입니다. 왜 필요한가: 지식단절(학습 이후 데이터를 모름), 환각현상(그럴듯한 거짓말), 범용성(전문성 부족). 처리 단계 [저쿼정답출] — ① 문서 변환·저장(문서를 Load·Split·Parsing 후 Sentence Embedding으로 변환해 벡터 DB에 인덱싱) → ② 입력 쿼리·문서 검색(말뭉치에서 관련 스니펫 검색) → ③ 정보 증강(쿼리+검색 문서로 맥락 통합) → ④ 답변 생성(증강된 입력을 GPT·BART 같은 seq2seq 모델에) → ⑤ 출력 생성(정제·형식화). 사내 문서 챗봇이 대표 활용입니다." },
"hallucination": {
    guide: {
      hook: "LLM이 '그럴듯하지만 사실이 아닌 내용'을 지어내는 현상입니다.",
      scene: "LLM은 다음 단어를 확률로 생성할 뿐 사실을 검증하지 않아, 존재하지 않는 논문·판례·수치를 자신만만하게 지어냅니다. 이 할루시네이션이 신뢰성의 최대 걸림돌입니다.",
      why: "'원인(확률적 생성·지식 한계)'과 대응(RAG·근거 제시·검증)이 출제 핵심입니다.",
      mechanism: "원인: 확률적 다음 토큰 예측(사실 검증 없음), 학습 데이터의 한계·편향·오류, 지식 컷오프(최신 모름), 과도한 일반화, 모호한 프롬프트. 유형: 사실 오류, 존재하지 않는 인용·출처, 논리 모순. 대응: RAG(외부 근거), 출처·인용 요구, 프롬프트 개선(모르면 모른다고), 파인튜닝, 자기 검증(self-consistency·비판), 사후 검증(팩트체크), 낮은 temperature. AI 신뢰성·거버넌스의 핵심 이슈. 완전 제거는 어려움(생성 모델 본질).",
      map: [
        { as: "그럴듯한 거짓", real: "할루시네이션", note: "" },
        { as: "확률적 생성", real: "원인", note: "검증 없음" },
        { as: "외부 근거", real: "RAG 대응", note: "" },
        { as: "모르면 모른다고", real: "프롬프트 개선", note: "" },
      ],
      usage: "AI 신뢰성 관리입니다. 시험은 원인, RAG·근거 제시·검증 대응입니다.",
      links: [
        { topic: "검색 증강 생성(RAG, Retrieval Augmented Generation)", how: "할루시네이션을 줄입니다." },
        { topic: "AI TRiSM(AI Trust, Risk and Security Management)", how: "신뢰성 관리 대상입니다." },
      ],
      exam: "할루시네이션은 LLM이 사실 검증 없이 확률적으로 그럴듯한 거짓을 생성하는 현상으로, RAG·출처 제시·프롬프트 개선·사후 검증으로 완화하나 완전 제거는 어렵다.",
    }, image: "/concept/book/hallucination.png", easy: "AI가 정확하지 않거나 사실이 아닌 조작된 정보를 그럴듯하게 생성하는 현상입니다. 교재 개념도가 직관적입니다 — '이순신', '거북선'은 각각 잘 답하다가 '이순신과 여객선'을 조합해 물으면 엉터리 조합 답이 나옵니다. 발생원인 [불과적모맥제] — 불충분·편향된 학습 데이터, 과적합, 적대적 공격, 복잡한 모델 아키텍처, 맥락이해 부족, 제한된 도메인 지식. 해결방안 4가지가 시험 포인트: 고품질 학습 데이터 제공, 자연어 처리기술 기반 문맥 개선, RLHF 통한 보상모델 개발, 그리고 RAG(외부의 신뢰할 수 있는 지식 베이스를 참조시켜 '사실 관계 오류'와 '맥락 이해 한계'를 개선)." },
"llm": {
    guide: {
      hook: "방대한 텍스트로 학습한 '초거대 파라미터 언어 모델' — 생성형 AI의 중심입니다.",
      scene: "수천억 개 파라미터를 인터넷 규모 텍스트로 자기지도 학습한 모델이, 번역·요약·코딩·대화를 하나로 해냅니다. 규모를 키우자 창발적 능력이 나타난 것이 LLM 혁명입니다.",
      why: "'트랜스포머·자기지도 사전학습·스케일링 법칙'과 정렬(RLHF)·한계가 출제 핵심입니다.",
      mechanism: "구조: 트랜스포머(주로 디코더) 기반. 학습: 자기지도 사전학습(다음 토큰 예측, 대규모 코퍼스) → 미세조정(지시 튜닝) → 정렬(RLHF — 인간 선호로 강화학습). 스케일링 법칙(모델·데이터·연산↑ → 성능↑, 창발 능력). 추론: 프롬프트 기반(In-context learning·퓨샷). 한계: 할루시네이션, 지식 컷오프, 편향, 비용·환경, 추론 약점. 확장: RAG·툴·에이전트·멀티모달·MoE. GPT·Claude·Gemini·Llama. 생성형 AI의 기반.",
      map: [
        { as: "초거대 파라미터", real: "스케일링", note: "창발" },
        { as: "다음 토큰 자기지도", real: "사전학습", note: "" },
        { as: "인간 선호 강화", real: "RLHF 정렬", note: "" },
        { as: "할루시네이션·편향", real: "한계", note: "" },
      ],
      usage: "대화·생성·코딩입니다. 시험은 트랜스포머·자기지도·스케일링·RLHF, 한계·확장입니다.",
      links: [
        { topic: "트랜스포머(Transformer)", how: "LLM의 아키텍처 기반입니다." },
        { topic: "파인 튜닝(Fine-tuning)", how: "LLM을 특화하는 방법입니다." },
      ],
      exam: "LLM은 트랜스포머 기반으로 대규모 텍스트를 자기지도 사전학습하고 RLHF로 정렬한 초거대 언어 모델로, 스케일링에 따라 창발 능력을 보이나 할루시네이션·편향의 한계가 있다.",
    }, image: "/concept/book/llm.png", easy: "대량 연산이 가능한 컴퓨팅 인프라와 대량의 데이터로 학습해 사람의 언어를 이해·생성하는 언어모델 — ChatGPT의 기반입니다. 구성도 [컴데모] — 컴퓨팅 파워(GPU·수퍼컴퓨팅 자원, OpenAI-MS 협약처럼 자원 확보가 관건), 데이터(대규모 학습 데이터 구축, 비지도학습으로 라벨링 부담 완화), 모델 알고리즘(GPT-3·트랜스포머·BERT — 연구는 대형화, 서비스는 경량화). 기술요소: 학습모델(제로샷·퓨샷 러닝, 파인튜닝)과 프레임워크(랭체인, 벡터DB, 프롬프트 엔지니어링). 문제점(환각, 개인정보 유출, 편향, 확장/배포 어려움)에는 RAG·합성데이터·프롬프트 엔지니어링·프레임워크 적용으로 대응합니다." },
"attention": {
    guide: {
      hook: "입력에서 '중요한 부분에 집중'하도록 가중치를 주는 메커니즘 — 트랜스포머의 심장입니다.",
      scene: "번역할 때 사람은 관련 있는 단어에 주목합니다. 어텐션은 각 출력이 입력의 어느 부분과 관련 있는지 가중치로 계산해 집중합니다. 이 덕분에 긴 문장의 먼 관계도 잡습니다.",
      why: "'Query·Key·Value와 가중합'과 셀프 어텐션·멀티헤드가 출제 핵심입니다. RNN 한계 극복이 포인트입니다.",
      mechanism: "핵심: Query(질의)와 Key(키)의 유사도(내적)로 어텐션 가중치 계산(소프트맥스로 정규화) → Value(값)의 가중합 = 출력. 즉 '어디에 얼마나 집중할지' 학습. 종류: 셀프 어텐션(같은 시퀀스 내 토큰끼리 — 문맥), 크로스 어텐션(인코더-디코더 간), 멀티헤드(여러 관점 병렬). Scaled Dot-Product(√d로 스케일). 효과: 장거리 의존성, 병렬(RNN 순차 극복), 해석 가능(가중치 시각화). 트랜스포머·LLM의 핵심 연산.",
      map: [
        { as: "질의-키 유사도", real: "Q·K 내적", note: "" },
        { as: "집중 가중치", real: "소프트맥스", note: "" },
        { as: "값의 가중합", real: "출력", note: "" },
        { as: "자기 문맥 집중", real: "셀프 어텐션", note: "" },
      ],
      usage: "트랜스포머·LLM 핵심입니다. 시험은 Q·K·V·가중합, 셀프·멀티헤드, RNN 극복입니다.",
      links: [
        { topic: "트랜스포머(Transformer)", how: "어텐션이 트랜스포머의 핵심입니다." },
        { topic: "초거대 언어 모델(Large Language Model)", how: "어텐션 기반으로 동작합니다." },
      ],
      exam: "어텐션 메커니즘은 Query·Key 유사도로 가중치를 구해 Value를 가중합하는 연산으로 입력의 중요 부분에 집중하며, 셀프·멀티헤드 어텐션으로 트랜스포머의 핵심이 된다.",
    }, image: "/concept/book/attention.png", easy: "디코더가 단어를 예측하는 매 시점마다 입력 문장 전체에서 '지금 예측할 단어와 연관 있는 부분'에 집중해 참고하는 방법 — 번역할 때 원문에서 관련 단어에 형광펜을 치는 것과 같습니다. 어텐션 함수 [쿼키벨어]: Attention(Q,K,V) — 쿼리에 대해 모든 키의 유사도를 구하고 → 유사도를 값(Value)에 반영하고 → 모두 더해서 → 어텐션 값을 반환. 예측 과정 [스분값연예] — 어텐션 스코어(디코더와 인코더 hidden state의 유사도) → 어텐션 분포(softmax로 가중치화) → 어텐션 값(가중합 = Context Vector) → 연결(디코더 hidden state와 concatenate — 문장이 길어져도 정보 손실이 적음) → 최종값 예측. 트랜스포머의 심장입니다." },
"langchain": {
    guide: {
      hook: "여러 LLM·데이터·도구를 레고처럼 조립해 AI 앱을 만드는 프레임워크입니다.",
      scene: "LLM 하나만으로는 앱이 안 됩니다. 모델 호출·데이터 연결·도구 사용·기억을 매번 직접 짜야 하죠. LangChain은 이 조각들을 표준 컴포넌트로 제공해, 체인으로 연결하면 LLM 앱이 완성되게 합니다.",
      why: "핵심 모듈(Model I/O·Data Connection·Chains·Agent·Memory)과 체인 개념이 출제 포인트입니다.",
      mechanism: "메인 모듈: Model I/O(모든 언어모델과 표준 인터페이스), Data Connection(외부 데이터 로드·변환·저장·쿼리 — RAG 기반), Agent(체인이 쓸 도구를 LLM이 스스로 선택). 추가: Chains(컴포넌트를 순차 연결), Memory(대화 상태 유지), Callbacks(로깅·모니터링). 프롬프트 템플릿·출력 파서로 입출력 정형화. RAG·에이전트·멀티에이전트(LangGraph)의 기반. 파이썬·JS 지원.",
      map: [
        { as: "모델 표준 연결", real: "Model I/O", note: "" },
        { as: "외부 데이터 로드·쿼리", real: "Data Connection", note: "RAG" },
        { as: "컴포넌트 순차 연결", real: "Chains", note: "" },
        { as: "도구 자율 선택", real: "Agent", note: "" },
      ],
      usage: "LLM 앱 개발입니다. 시험은 핵심 모듈, 체인, 에이전트·RAG 기반입니다.",
      links: [
        { topic: "LangGraph", how: "체인을 그래프로 확장한 멀티에이전트 프레임워크입니다." },
        { topic: "RAG (Retrieval-Augmented Generation)", how: "Data Connection으로 RAG를 구현합니다." },
      ],
      exam: "LangChain은 Model I/O·Data Connection·Chains·Agent·Memory 모듈을 체인으로 조립해 LLM 앱을 만드는 프레임워크로, RAG·에이전트 개발의 기반이 된다.",
    }, image: "/concept/book/langchain.png", easy: "언어모델 기반 애플리케이션을 만들 때 여러 언어 모델과의 통합을 간소화해 주는 SDK이자 프레임워크 — LLM 앱 개발의 '레고 블록 상자'입니다. 구성요소 [모커에 체메콜] — 메인 모듈: Model I/O(모든 언어모델과 인터페이스), Data Connection(사용자별 데이터를 로드·변환·저장·쿼리), Agent(체인이 사용할 도구를 선택해 동작) / 추가 모듈: Chains(컴포넌트를 체인으로 연결), Memory(이전 상황을 기억해 상태 유지), Callbacks(중간단계 기록·로깅·모니터링·스트리밍). 흐름: 외부 데이터 가져오기 → Word Embedding 생성 → 벡터 DB 저장·검색 → LLM에 프롬프트 전송·응답 수신. RAG 챗봇을 만들 때 사실상 표준 도구입니다." },
"fine-tuning": {
    guide: {
      hook: "사전학습 모델을 내 데이터로 추가 학습해 특정 작업에 맞추는 과정입니다.",
      scene: "GPT 같은 모델을 처음부터 학습하면 천문학적 비용입니다. 파인튜닝은 이미 학습된 모델의 가중치를 출발점 삼아, 내 데이터셋으로 조금 더 학습해 도메인·작업에 맞게 조정합니다.",
      why: "방식(Full vs Repurposing)과 PEFT(LoRA 등) 경량화가 출제 핵심입니다.",
      mechanism: "절차: 사전학습 모델→출력 계층 조정→추가 학습→최적화. 방식: Full Fine-tuning(전체 파라미터 갱신 — 작업 차이 클 때, 비용 큼), Repurposing(하위 레이어 동결·상위만 튜닝 — 유사·소량 데이터). 유형: 지도(레이블 데이터), 비지도, 지시(instruction), RLHF(인간 피드백 강화). 경량화: PEFT(LoRA·Prompt Tuning — 일부만 학습). 프롬프트 엔지니어링·RAG와 목적 구분(지식 주입 vs 행동 조정).",
      map: [
        { as: "전체 갱신", real: "Full Fine-tuning", note: "비용 큼" },
        { as: "상위만 튜닝", real: "Repurposing", note: "" },
        { as: "일부만 학습", real: "PEFT·LoRA", note: "경량" },
        { as: "인간 피드백 강화", real: "RLHF", note: "" },
      ],
      usage: "LLM 도메인 특화입니다. 시험은 Full/Repurposing, PEFT, RAG와의 구분입니다.",
      links: [
        { topic: "LoRA (Low-Rank Adaptation)", how: "대표적 경량 파인튜닝 기법입니다." },
        { topic: "PEFT (Parameter-Efficient Fine-Tuning)", how: "파인튜닝의 경량화 계열입니다." },
      ],
      exam: "파인튜닝은 사전학습 모델을 내 데이터로 추가 학습해 작업에 맞추는 과정으로, 전체 갱신(Full)·상위층 튜닝(Repurposing)이 있고 LoRA 등 PEFT로 경량화한다.",
    }, image: "/concept/book/fine-tuning.png", easy: "이미 학습된 모델의 가중치를 출발점 삼아, 새로운 데이터셋으로 추가 학습해 내 작업에 맞게 조정하는 과정입니다. 절차 [사조학최] — 사전 학습 모델 → 출력 계층 조정 → 모델 학습 → 모델 최적화. 방법 2가지: Full Fine-tuning(모든 레이어·매개변수 업데이트 — 작업과 모델 차이가 클 때)과 Repurposing(하위 레이어는 유지, 상위 레이어만 튜닝 — 유사성이 있거나 데이터셋이 작을 때). 유형 2가지: 지도 파인튜닝(레이블 있는 데이터로 목표 출력 학습)과 비지도 파인튜닝(레이블 없이 데이터 구조에서 특징 추출). 고려사항: 학습률(원래 가중치 훼손 방지), 데이터 양, 모델 복잡성. 병행 기법으로 프롬프트 튜닝이 있습니다." },
"prompt-tuning": {
    guide: {
      hook: "모델은 얼려두고 '학습 가능한 소프트 프롬프트'만 조정하는 경량 기법입니다.",
      scene: "파인튜닝은 모델 전체를 바꿔 비쌉니다. 프롬프트 튜닝은 LLM 파라미터를 그대로 동결하고, 입력 앞에 붙는 학습 가능한 벡터(소프트 프롬프트)만 학습해 원하는 응답을 유도합니다.",
      why: "파인튜닝과의 비교표(모델 구조·리소스·오버피팅)가 그대로 출제됩니다.",
      mechanism: "핵심: 모델 가중치 동결 + 소프트 프롬프트(learnable embedding)만 역전파로 학습. 비교(vs 파인튜닝): 모델 구조(유지 vs 변경), 리소스(경량 vs 대량 컴퓨팅), 정확도(프롬프트 품질 좌우 vs 데이터 품질), 오버피팅(모델 고정이라 거의 없음 vs 소량 데이터 시 발생), 확장성(태스크별 프롬프트만 교체 vs 모델별 재학습). PEFT 계열. 하드 프롬프트(사람이 쓴 텍스트)와 구분되는 소프트 프롬프트.",
      map: [
        { as: "모델 동결", real: "파라미터 유지", note: "" },
        { as: "학습되는 입력 벡터", real: "소프트 프롬프트", note: "" },
        { as: "오버피팅 거의 없음", real: "모델 고정", note: "" },
        { as: "PEFT 계열", real: "경량 튜닝", note: "" },
      ],
      usage: "LLM 경량 적응입니다. 시험은 소프트 프롬프트, 파인튜닝 비교표입니다.",
      links: [
        { topic: "PEFT (Parameter-Efficient Fine-Tuning)", how: "프롬프트 튜닝이 속한 경량 계열입니다." },
        { topic: "파인튜닝(Fine-tuning)", how: "모델 변경 방식과 대비됩니다." },
      ],
      exam: "프롬프트 튜닝은 LLM 파라미터를 동결하고 학습 가능한 소프트 프롬프트만 조정하는 PEFT 기법으로, 경량·오버피팅 회피 면에서 파인튜닝과 대비된다.",
    }, image: "/concept/book/prompt-tuning.png", easy: "LLM의 파라미터는 그대로 얼려두고, 학습 가능한 소프트 프롬프트(learnable input)만 추가·조정해 원하는 응답을 얻는 기법입니다. 파인튜닝과의 비교표가 그대로 시험에 나옵니다 — 모델 구조: 프롬프트 튜닝은 모델 유지 vs 파인튜닝은 구조 변경 / 리소스: 경량 vs 대량 컴퓨팅 필요 / 정확도: 프롬프트 품질에 좌우 vs 데이터 품질에 좌우 / 오버피팅: 모델이 고정이라 발생 불가 vs 스몰 데이터 추가 학습이라 가능성 존재 / 확장성: 다양한 작업에 적용 용이 vs 특정 도메인 최적화로 전환 불가. 기반 기술도 짝으로: 프롬프트 튜닝은 Zero/One-Shot Prompting·CoT, 파인튜닝은 전이학습·LoRA입니다. 2025.04 ITPE 모의고사 기출." },
"context-engineering": {
    guide: {
      hook: "프롬프트 한 줄이 아니라 '문맥 전체'를 설계해 LLM 성능을 끌어올립니다.",
      scene: "프롬프트만 다듬는 데는 한계가 있습니다. 컨텍스트 엔지니어링은 모델에 주는 문맥(검색 지식·메모리·도구·이력) 전체를 어떻게 구성·선택·압축할지 설계해, 정확도와 일관성을 높입니다.",
      why: "4대 전략(작성·선택·압축·분리)과 프롬프트 엔지니어링과의 차이가 출제 핵심입니다.",
      mechanism: "4대 전략: 작성(Write — 정보를 저장소·메모리에 기록), 선택(Select — 상황에 맞는 문맥만 골라 제공), 압축(Compress — 토큰 절약 위해 요약·생략), 분리(Isolate — 작업·역할별 컨텍스트 분리 관리). 구현: RAG, 메모리 시스템, 도구 통합 추론, 멀티에이전트. vs 프롬프트 엔지니어링(문구 최적화)보다 넓은 '문맥 자원 관리'. 컨텍스트 윈도·토큰 한계가 배경. 에이전트 성능의 핵심.",
      map: [
        { as: "저장소에 기록", real: "작성(Write)", note: "" },
        { as: "필요 문맥만 제공", real: "선택(Select)", note: "" },
        { as: "요약·생략", real: "압축(Compress)", note: "토큰" },
        { as: "역할별 분리", real: "분리(Isolate)", note: "" },
      ],
      usage: "LLM·에이전트 문맥 설계입니다. 시험은 4대 전략, 프롬프트 엔지니어링 비교입니다.",
      links: [
        { topic: "프롬프트 엔지니어링(Prompt Engineering)", how: "문구 최적화의 상위 개념으로 대비됩니다." },
        { topic: "RAG (Retrieval-Augmented Generation)", how: "문맥 주입의 대표 구현입니다." },
      ],
      exam: "컨텍스트 엔지니어링은 LLM에 주는 문맥 전체를 작성·선택·압축·분리 전략으로 설계하는 기법으로, 프롬프트 엔지니어링보다 넓은 문맥 자원 관리이며 에이전트 성능의 핵심이다.",
    }, image: "/concept/book/context-engineering.png", easy: "프롬프트 한 줄이 아니라 모델에게 주는 '문맥(Context) 전체'를 설계·조작·구성해서 LLM의 정확도·일관성·목적 적합성을 높이는 기법입니다. 핵심전략 4가지 — 컨텍스트 작성(정보를 저장소에 기록), 선택(상황에 맞는 문맥만 골라 제공), 압축(토큰 절약을 위해 생략·요약), 분리(작업·역할별로 컨텍스트 분리 관리). 구현 기술: RAG, 메모리 시스템, 도구 통합 추론, 다중 에이전트 시스템. 프롬프트 엔지니어링과의 비교가 시험 포인트 — 프롬프트 엔지니어링은 '입력 명령문'을 다듬어 출력 품질을 높이고, 컨텍스트 엔지니어링은 '문맥·배경 정보'를 설계해 이해력과 일관성을 높입니다. 2026.02·2025.08 ITPE FR 기출." },
"prompt-engineering": {
    guide: {
      hook: "AI에게서 좋은 결과를 얻도록 프롬프트(질문)를 잘 구성하는 기법입니다.",
      scene: "같은 모델도 어떻게 묻느냐에 따라 답이 천차만별입니다. 프롬프트 엔지니어링은 작업 설명·입력·출력 형식을 체계적으로 구성하고 예시·추론 유도를 더해, 원하는 고품질 응답을 끌어냅니다.",
      why: "질문 4요소와 Shot 방식(Zero/One/Few-Shot·CoT)이 출제 핵심입니다.",
      mechanism: "질문 4요소: Task Description(수행 상황 상세), Input Indicator(입력 지시자), Current Input(질문 내용), Output Indicator(출력 형식). 방식: Zero-Shot(예시 없이), One-Shot(예시 1개), Few-Shot(예시 수 개), CoT(Chain-of-Thought — 풀이 과정 유도). 고급: ToT·Self-Consistency·ReAct. 역할 부여·제약 명시. vs 컨텍스트 엔지니어링(문맥 전체 설계)보다 좁은 문구 최적화.",
      map: [
        { as: "작업·출력 형식 명시", real: "질문 4요소", note: "" },
        { as: "예시 개수", real: "Zero/One/Few-Shot", note: "" },
        { as: "풀이 과정 유도", real: "CoT", note: "" },
        { as: "문구 최적화", real: "vs 컨텍스트 엔지니어링", note: "" },
      ],
      usage: "LLM 활용입니다. 시험은 질문 4요소, Shot 방식·CoT입니다.",
      links: [
        { topic: "CoT (Chain of Thought)", how: "추론 과정을 유도하는 대표 프롬프트 기법입니다." },
        { topic: "컨텍스트 엔지니어링(Context Engineering)", how: "문맥 설계의 상위 개념과 대비됩니다." },
      ],
      exam: "프롬프트 엔지니어링은 작업·입력·출력 4요소를 구성하고 Zero/Few-Shot·CoT로 추론을 유도해 LLM 응답 품질을 높이는 기법이다.",
    }, image: "/concept/book/prompt-engineering.png", easy: "AI에게서 높은 수준의 결과물을 얻기 위해 적절한 프롬프트를 구성하는 기법입니다. 구성요소 [태인커아 제원퓨C] — 질문 4요소: Task Description(수행할 상황의 상세 설명), Input Indicator(입력 지시자), Current Input(질문 내용), Output Indicator(결과물 형식) / 프롬프트 방식: Zero-Shot(예제 없이), One-Shot(예제 1개), Few-Shot(예제 수 개), CoT(풀이 과정 중심) / 추론 방식: Zero-Shot CoT, ToT(사고를 나무로 분기해 최적 경로 선택), Self Consistency(여러 추론을 종합해 일관된 답), Meta-Reasoning(여러 체인 비교 분석). 고려사항: 대화 스타일 조정, 미사여구 최소화, 닫힌 지시문, 구체적 지시, 예제 제공." },
"lora": {
    guide: {
      hook: "원래 가중치는 얼려두고 작은 '저랭크 행렬'만 학습하는 효율적 파인튜닝입니다.",
      scene: "수십억 파라미터 LLM을 통째로 파인튜닝하려면 GPU 메모리가 감당 못 합니다. LoRA는 원 가중치를 동결하고 그 옆에 작은 행렬 두 개(A·B)만 붙여 학습해, 적은 자원으로 모델을 적응시킵니다.",
      why: "저랭크 분해(A·B 행렬)와 원본 동결로 VRAM을 줄이는 원리가 출제 핵심입니다.",
      mechanism: "원리: 가중치 갱신량 ΔW를 저랭크 분해 ΔW=B·A로 근사(A: d×r, B: r×k, r≪d). 원 가중치 W는 동결, A(정규분포 초기화)·B(0 초기화)만 학습→추론 시 W+BA. r만큼만 파라미터 학습해 VRAM·저장 급감. 여러 태스크별 LoRA 어댑터 교체 가능. QLoRA(양자화+LoRA)로 더 경량. PEFT 대표 기법. 성능 손실 최소.",
      map: [
        { as: "원 가중치 동결", real: "Freeze W", note: "" },
        { as: "저랭크 행렬 학습", real: "A·B (r≪d)", note: "" },
        { as: "VRAM·저장 급감", real: "효율", note: "" },
        { as: "양자화 결합", real: "QLoRA", note: "" },
      ],
      usage: "LLM 경량 파인튜닝입니다. 시험은 저랭크 분해, 원본 동결, QLoRA입니다.",
      links: [
        { topic: "PEFT (Parameter-Efficient Fine-Tuning)", how: "LoRA가 대표하는 경량 튜닝 계열입니다." },
        { topic: "파인튜닝(Fine-tuning)", how: "Full 파인튜닝의 경량 대안입니다." },
      ],
      exam: "LoRA는 원 가중치를 동결하고 갱신량을 저랭크 행렬 A·B로 근사해 학습하는 PEFT 기법으로, 적은 VRAM으로 LLM을 적응시키며 QLoRA로 확장된다.",
    }, image: "/concept/book/lora.png", easy: "거대 모델 전체를 재훈련하지 않고, 원래 가중치는 얼려둔(Freeze) 채 옆에 작은 저랭크 행렬 두 개(A: d×r, B: r×k)만 붙여 학습하는 효율적 파인튜닝입니다. 왜 필요한가 — LLM 가중치는 1.5~3B라 GPU에 올리는 것만도 큰 비용이고, Forward·Backward·가중치·gradient까지 저장하면 가중치의 2~3배 VRAM이 필요합니다. LoRA는 A(정규분포 초기화)·B(0으로 초기화)의 가중치만 업데이트해 Pretrain Model에 더해줍니다 → VRAM 절약. Transformer의 W_q(query)·W_k(key) 레이어에 적용했을 때 성능이 가장 좋았다는 실험 결과까지 시험 포인트. PEFT 기법의 대표 주자입니다." },
"llm-enhancement": {
    guide: {
      hook: "LLM의 추론 부족·부정확·비용 문제를 극복하는 기술 묶음입니다.",
      scene: "LLM은 복잡한 추론에 약하고 환각·비용 문제가 있습니다. LLM 고도화는 추론 강화·외부 지식 결합·모델 병합·효율화·멀티모달을 조합해 이런 한계를 보완하는 기술 집합입니다.",
      why: "5대 기법군(추론·RAG·모델병합·효율·멀티모달)의 분류가 출제 핵심입니다.",
      mechanism: "추론 강화: CoT·ToT·Least-to-Most. RAG: 외부 지식 검색 결합(지식집약 NLP). 모델 병합·결합: Model Merging·DARE·Evolutionary Merging. 효율·비용: MoE(전문가 혼합)·Sparse Attention·양자화·LoRA. 멀티모달: 텍스트+이미지·음성 통합. 목적: 정확성·일관성·비용 개선. 파인튜닝·프롬프트 엔지니어링과 함께 LLM 활용 스택 구성.",
      map: [
        { as: "CoT·ToT", real: "추론 강화", note: "" },
        { as: "외부 지식 결합", real: "RAG", note: "" },
        { as: "MoE·양자화·LoRA", real: "효율·비용", note: "" },
        { as: "모델 병합", real: "Merging·DARE", note: "" },
      ],
      usage: "LLM 성능 개선입니다. 시험은 5대 기법군 분류입니다.",
      links: [
        { topic: "RAG (Retrieval-Augmented Generation)", how: "외부 지식 결합 기법입니다." },
        { topic: "MoE (Mixture of Experts)", how: "효율화 대표 기법입니다." },
      ],
      exam: "LLM 고도화는 추론 강화(CoT)·RAG·모델 병합·효율화(MoE·양자화·LoRA)·멀티모달을 조합해 LLM의 추론·정확성·비용 한계를 극복하는 기술 묶음이다.",
    }, image: "/concept/book/llm-enhancement.png", easy: "LLM의 추론 능력 부족·정확성 문제·일관성 유지 어려움을 극복하는 기술 묶음입니다. 주요기법 [추R모효멀] — 추론 능력 강화(CoT, ToT, Least-to-Most Prompting), RAG(외부 지식 활용·정밀 검색, Knowledge-Intensive NLP), 모델 병합·결합(Model Merging, DARE, Evolutionary Model Merging), 효율성·비용 절감(MoE, Sparse Attention, 양자화, LoRA), 멀티모달 통합(CLIP, Flamingo, BLIP-2). Reasoning 상세도 시험 포인트 — 사고사슬 CoT(중간 추론을 단계별 서술), 디컴포지션(하위 문제로 분해 — Self-Ask), 메타-리즌(자기 추론을 검토·수정 — Self-Reflection·ReAct), 귀납적 추론(패턴에서 일반화 — In-Context Learning), 상호 추론(두 모델이 서로 검증 — rStar). 2025.05 ITPE FR 기출." },
"lcm": {
    guide: {
      hook: "토큰이 아니라 '문장 단위 개념'으로 추론하는 메타AI의 모델입니다.",
      scene: "기존 LLM은 단어 조각(토큰) 하나씩 예측해 긴 맥락에 약합니다. LCM(Large Concept Model)은 문장 수준의 의미 단위(개념) 임베딩으로 추론해, 언어·양식에 독립적이고 긴 문맥에 강한 구조를 지향합니다.",
      why: "'개념(문장) 단위 추론'과 SONAR 임베딩 아키텍처가 출제 핵심입니다.",
      mechanism: "추론 단위: 토큰이 아닌 개념(문장 임베딩). 아키텍처: SONAR 인코더/디코더(문장↔개념 임베딩 변환), PreNet(입력 정규화·매핑), Transformer 디코더(다음 문장 임베딩 예측), PostNet(디노멀화 출력). SONAR 공간은 200개 언어 텍스트·76개 언어 음성 지원(언어·양식 독립). 특징: 계층 구조로 긴 컨텍스트·다국어 강점. 기존 토큰 기반 LLM과 대비되는 개념 기반 접근.",
      map: [
        { as: "문장 단위 추론", real: "개념(Concept)", note: "vs 토큰" },
        { as: "문장↔개념 변환", real: "SONAR", note: "" },
        { as: "다음 문장 예측", real: "Transformer 디코더", note: "" },
        { as: "다국어·긴 문맥 강점", real: "언어 독립", note: "" },
      ],
      usage: "차세대 LLM 구조입니다. 시험은 개념 단위 추론, SONAR 아키텍처입니다.",
      links: [
        { topic: "LLM (Large Language Model)", how: "토큰 기반과 대비되는 개념 기반입니다." },
        { topic: "트랜스포머(Transformer)", how: "디코더 백본으로 활용됩니다." },
      ],
      exam: "LCM은 토큰이 아닌 문장 수준 개념 임베딩(SONAR)으로 추론하는 메타AI 모델로, 언어·양식에 독립적이고 긴 문맥·다국어에 강점을 갖는다.",
    }, image: "/concept/book/lcm.png", easy: "토큰(단어 조각) 단위가 아니라 '개념(Concept)' — 문장 수준의 의미 단위 — 로 추론하는 메타AI의 모델입니다. 아키텍처 [소프트포] — SONAR 인코더·디코더(문장↔개념 임베딩 변환), PreNet(입력 정규화·매핑), Transformer 기반 디코더(다음 '문장 임베딩'을 예측), PostNet(디노멀화해 출력). SONAR 임베딩 공간은 200개 언어 텍스트와 76개 언어 음성을 지원합니다. 특징: 계층 구조로 긴 컨텍스트 가독성 향상, 컨텍스트 길이에 따라 계산량이 기하급수로 느는 트랜스포머 단점 해결, 뛰어난 제로샷 일반화, 인코더·디코더 모듈화로 확장성. 유형: Base-LCM, Diffusion-based LCM(One-Tower/Two-Tower), Quant-LCM(연속 표현을 이산화)." },
"lam": {
    guide: {
      hook: "언어 이해에 '실제 행동 수행'을 결합한 대규모 행동 모델입니다.",
      scene: "LLM은 말은 잘하지만 실제로 일을 하진 못합니다. LAM(Large Action Model)은 LLM의 이해력에 행동 계획·실행을 더해, 마우스를 움직이고 앱을 조작해 태스크를 자동으로 완수하는 AI로 진화합니다.",
      why: "발전 계단(LLM→LMM→LAM)과 행동 실행 파이프라인이 출제 핵심입니다.",
      mechanism: "발전: LLM(언어 이해·생성)→LMM(멀티모달 통합)→LAM(행동 계획·작업 실행). 단계: 입력처리(원시 상태·데이터 수집)→분석(행동이력 기반 도메인 프롬프트 설계)→실행(행동 생성·수행). 핵심기술: 멀티모달 Input Processing, 행동 계획, 도구·환경 상호작용, 피드백 학습. AI 에이전트·자동화의 실행 엔진. 안전·통제(잘못된 행동 위험)가 과제.",
      map: [
        { as: "LLM→LMM→LAM", real: "발전 계단", note: "" },
        { as: "상태·데이터 수집", real: "입력처리", note: "" },
        { as: "도메인 프롬프트 설계", real: "분석", note: "" },
        { as: "행동 생성·수행", real: "실행", note: "" },
      ],
      usage: "행동형 AI입니다. 시험은 발전 계단, 실행 파이프라인, 에이전트 연계입니다.",
      links: [
        { topic: "AI 에이전트(AI Agent)", how: "LAM이 에이전트의 실행 엔진이 됩니다." },
        { topic: "멀티모달 AI(Multimodal AI)", how: "LMM 단계의 기반입니다." },
      ],
      exam: "LAM은 LLM의 언어 이해에 행동 계획·실행을 결합한 모델로, LLM→LMM→LAM 발전 단계를 거쳐 입력처리·분석·실행 파이프라인으로 태스크를 자동 수행한다.",
    }, image: "/concept/book/lam.png", easy: "LLM의 언어 이해에 '실제 행동 수행 능력'을 결합한 모델 — 말만 하는 AI에서 마우스를 움직이고 버튼을 눌러 일을 해내는 AI로의 진화입니다. 발전 계단이 시험 포인트: LLM(자연어 이해·텍스트 생성) → LMM(멀티모달 통합 처리) → LAM(행동 계획·작업 실행, 태스크 자동화). 단계: 입력처리(원시 상태·데이터 수집) → 분석(행동이력 기반 도메인 특화 프롬프트 설계) → 실행(행동 생성). 핵심기술 4그룹 — Input Processing(멀티모달 인코딩·의도 분류·동적 컨텍스트 윈도우), Planning & Reasoning(CoT·계층적 작업분해·Neuro-symbolic Programming), Action Execution(API 오케스트레이션·동적 계획·원자적 액션), Self-Correction(다차원 평가·Contextual Memory·RLHF). 2025.04 KPC 기출." },
"langgraph": {
    guide: {
      hook: "AI 에이전트 협업을 '그래프'로 설계하는 LangChain 기반 라이브러리입니다.",
      scene: "LangChain의 순차 체인으로는 반복·분기 같은 복잡한 흐름을 표현하기 어렵습니다. LangGraph는 작업을 노드와 엣지의 그래프로 구성해, 여러 에이전트가 상태를 공유하며 순환·분기하는 워크플로우를 만듭니다.",
      why: "체인(순차) vs 그래프(순환·분기) 구조 차이와 상태 관리가 출제 핵심입니다.",
      mechanism: "구조: 노드(개별 작업·에이전트 모듈)+엣지(데이터 흐름·종속). vs LangChain 체인(순차)과 달리 반복·조건 분기·순환 표현 가능. 상태(State) 객체를 노드 간 공유·갱신해 문맥 유지. Thought→Action→Observation 순환(ReAct) 구현. 멀티에이전트 오케스트레이션·휴먼인더루프·체크포인트 지원. 복잡한 에이전트 워크플로우의 제어 흐름 엔진.",
      map: [
        { as: "작업 모듈", real: "노드(Node)", note: "" },
        { as: "흐름·종속", real: "엣지(Edge)", note: "" },
        { as: "순환·분기 가능", real: "vs 순차 체인", note: "" },
        { as: "상태 공유", real: "State", note: "" },
      ],
      usage: "멀티에이전트 워크플로우입니다. 시험은 그래프 구조, 체인과의 차이, 상태 관리입니다.",
      links: [
        { topic: "LangChain", how: "순차 체인 기반을 그래프로 확장합니다." },
        { topic: "AI 에이전트(AI Agent)", how: "멀티에이전트 협업을 오케스트레이션합니다." },
      ],
      exam: "LangGraph는 노드·엣지 그래프와 공유 상태로 반복·분기 워크플로우를 표현하는 LangChain 기반 라이브러리로, 순차 체인과 달리 멀티에이전트 협업을 오케스트레이션한다.",
    }, image: "/concept/book/langgraph.png", easy: "여러 AI 에이전트가 협업하는 멀티 에이전트 시스템을 만들기 위한, LangChain 기반의 상태 관리·워크플로우 라이브러리입니다. 핵심은 구조의 차이 — LangChain이 작업을 '체인(사슬)'으로 순차 연결한다면, LangGraph는 노드(Node: 개별 작업 모듈)와 엣지(Edge: 데이터 흐름·종속 관계)로 이뤄진 '그래프'라서 반복·분기 같은 비순차적 흐름을 표현할 수 있습니다. 개념도의 Thought → Action → Observation 순환(끝나면 Finish)이 에이전트 루프의 전형입니다. 구성: 노드·엣지·데이터레이어·워크플로우 디자이너(시각적 UI)·API 통합. LangChain vs LangGraph 비교표(체인 기반 vs 그래프 기반, 코드 커스터마이징 vs 시각적 설계)가 시험 포인트입니다." },
"cot": {
    guide: {
      hook: "정답만 말하지 말고 '풀이 과정을 단계별로' 밟게 유도하는 추론 기법입니다.",
      scene: "LLM에 계산·논리 문제를 바로 물으면 자주 틀립니다. CoT(Chain of Thought)는 '단계별로 생각해 보라'며 중간 사고 과정을 거치게 해, 수학·논리 문제의 정답률을 크게 올립니다.",
      why: "IO 직행 vs 사고 단계 경유 구조와 설명 가능성이 출제 핵심입니다.",
      mechanism: "표준 프롬프팅: Input→Output 직행(중간 과정 없음). CoT: Input→thought→thought→…→Output(단계적 추론). 효과: 수학·논리·복잡한 의사결정 정확도↑, 중간 사고를 보여줘 설명 가능성·신뢰성↑. 확장: Zero-shot CoT('단계별로 생각'), Self-Consistency(여러 CoT 다수결), ToT(트리 탐색), GoT(그래프). 프롬프트 엔지니어링의 핵심 기법. 추론 특화 모델의 기반.",
      map: [
        { as: "직행 출력", real: "표준 프롬프팅", note: "오답 잦음" },
        { as: "사고 단계 경유", real: "CoT", note: "" },
        { as: "다수결 결합", real: "Self-Consistency", note: "" },
        { as: "중간 과정 노출", real: "설명 가능성", note: "" },
      ],
      usage: "LLM 추론 강화입니다. 시험은 IO 대비, 설명 가능성, Self-Consistency입니다.",
      links: [
        { topic: "프롬프트 엔지니어링(Prompt Engineering)", how: "CoT가 대표 프롬프트 기법입니다." },
        { topic: "LLM 고도화(LLM Enhancement)", how: "추론 강화 기법군에 속합니다." },
      ],
      exam: "CoT는 LLM이 Input→중간 사고→Output으로 풀이 과정을 단계별로 밟게 유도하는 프롬프트 기법으로, 복잡 추론 정확도와 설명 가능성을 높인다.",
    }, image: "/concept/book/cot.png", easy: "언어 모델이 복잡한 문제를 풀 때 '문제-풀이-답'처럼 중간 과정을 단계별로 밟아 논리적으로 추론하게 유도하는 방법론입니다. 개념도가 핵심: 표준 IO 프롬프팅은 Input→Output 직행이라 계산 문제를 자주 틀리지만, CoT는 Input→thought→thought→thought→Output으로 풀이 과정을 거쳐 정답률이 오릅니다. 특징·구성요소 [문사최] — 특징: 단계적 추론, 문제 해결력 향상(수학·논리 퍼즐·복잡한 의사결정), 설명 가능한 AI(중간 사고 과정을 보여줘 신뢰성↑), Prompt Engineering 활용 / 구성요소: 문제 입력 → 사고 과정 단계(이전 정보 기반으로 다음 단계 진행) → 최종 출력. 2025.04 ITPE 모의고사 기출." },
"moe": {
    guide: {
      hook: "여러 전문가 중 입력에 맞는 '일부만 골라 쓰는' 모델 아키텍처입니다.",
      scene: "거대 모델을 매번 통째로 돌리면 계산이 막대합니다. MoE(Mixture of Experts)는 여러 전문가 네트워크 중 라우터가 입력에 맞는 소수만 활성화해, 큰 모델을 효율적으로 돌립니다 — 증상별 전문의 배정과 같습니다.",
      why: "Router·Expert 구조와 Sparse Computation(부분 활성화)이 출제 핵심입니다.",
      mechanism: "구성: Experts(각자 특정 특징 공간에 특화된 전문가 네트워크), Router/Gating(입력별로 어떤 전문가를 쓸지 Softmax·Top-k로 결정). 핵심: Sparse Computation — 전체가 아닌 일부 전문가만 활성화해 파라미터는 크되 연산은 적음. 효과: 초대형 모델을 효율적으로(GPT급·딥시크의 비결). 과제: 부하 분산(전문가 편중), 통신 비용. LLM 효율화·고도화 기법.",
      map: [
        { as: "특화 네트워크", real: "Experts", note: "" },
        { as: "전문가 선택", real: "Router (Top-k)", note: "" },
        { as: "일부만 활성화", real: "Sparse Computation", note: "" },
        { as: "부하 분산", real: "과제", note: "" },
      ],
      usage: "초대형 LLM 효율화입니다. 시험은 Router·Expert, Sparse Computation입니다.",
      links: [
        { topic: "LLM 고도화(LLM Enhancement)", how: "효율화 대표 기법입니다." },
        { topic: "트랜스포머(Transformer)", how: "FFN 계층을 MoE로 대체합니다." },
      ],
      exam: "MoE는 라우터가 입력별로 소수 전문가만 선택·활성화하는 Sparse Computation 아키텍처로, 초대형 모델을 적은 연산으로 효율적으로 동작시킨다.",
    }, image: "/concept/book/moe.png", easy: "여러 전문가 모델(Expert) 중 입력에 맞는 최적의 전문가만 골라 쓰는 모델 아키텍처 — 종합병원에서 증상에 맞는 전문의에게 배정하는 것과 같습니다. 개념도 [익라] — Experts(각자 특정 Feature Space에 특화 학습된 전문가 네트워크)와 Router(입력에 따라 어떤 전문가를 쓸지 Softmax·Top-k로 결정). 핵심 특징이 Sparse Computation: 전체 전문가를 다 돌리지 않고 일부만 활성화해 계산 효율을 높이므로, 매우 큰 모델도 효율적으로 동작합니다(딥시크·GPT급 모델의 비결). 구성요소: 게이팅 네트워크(Softmax로 전문가 가중치 결정), 전문가 네트워크(서브 모델들), 출력 조합 모듈(선택된 전문가 예측값을 가중합). 2025.04 ITPE·KPC 기출." },
"peft": {
    guide: {
      hook: "전체가 아닌 '일부 파라미터만' 조정해 적은 자원으로 파인튜닝하는 기법 통칭입니다.",
      scene: "수십억 파라미터를 다 갱신하는 파인튜닝은 자원이 막대합니다. PEFT는 전체의 수 %만 학습해 비슷한 효과를 내는 경량 파인튜닝 기법들의 총칭으로, LoRA·Adapter 등이 여기 속합니다.",
      why: "대표 기법 5종(Adapter·Prefix·LoRA 등)과 '일부만 갱신' 원리가 출제 핵심입니다.",
      mechanism: "원리: 사전학습 모델 대부분 동결, 소수 파라미터만 학습(전체 대비 수~몇 %). 기법: Adapter(중간에 Bottleneck 신경망 삽입), Prefix Tuning(입력 앞 학습 벡터 추가), Prompt Tuning(소프트 프롬프트만), LoRA(저랭크 행렬 추가), Parallel/Scaled Adapter. 효과: VRAM·저장·시간 급감, 태스크별 어댑터 교체. QLoRA로 양자화 결합. Full 파인튜닝의 경량 대안.",
      map: [
        { as: "Bottleneck 삽입", real: "Adapter", note: "" },
        { as: "입력 앞 벡터", real: "Prefix/Prompt Tuning", note: "" },
        { as: "저랭크 행렬", real: "LoRA", note: "" },
        { as: "일부만 갱신", real: "경량화", note: "수 %" },
      ],
      usage: "LLM 경량 파인튜닝입니다. 시험은 5대 기법, 일부 갱신 원리입니다.",
      links: [
        { topic: "LoRA (Low-Rank Adaptation)", how: "PEFT의 대표 기법입니다." },
        { topic: "파인튜닝(Fine-tuning)", how: "Full 파인튜닝의 경량 대안입니다." },
      ],
      exam: "PEFT는 사전학습 모델 대부분을 동결하고 소수 파라미터(Adapter·Prefix·LoRA 등)만 학습하는 경량 파인튜닝 기법의 통칭으로, 적은 자원으로 Full 파인튜닝에 준하는 효과를 낸다.",
    }, image: "/concept/book/peft.png", easy: "사전학습 모델의 전체 파라미터가 아니라 일부만 조정해서, 적은 자원으로 파인튜닝 효과를 내는 기법의 통칭입니다(전체 대비 수~몇 %만 업데이트). 기법 5가지가 시험 핵심 — Adapter(PLM 중간에 Bottleneck 구조의 작은 신경망 삽입), Prefix Tuning(입력 앞단에 학습 가능한 벡터 추가, Softmax로 영향 조절), LoRA(가중치 대신 저랭크 행렬 추가 학습), Parallel Adapter(PLM 경로와 병렬로 ReLU 기반 어댑터 연결 후 합침), Scaled PA(Parallel Adapter에 Scaling 추가로 영향력 미세 조정). 목적은 하나: 비용·자원·시간을 최소화하면서 커스터마이징. 2025.10 ITPE 모의고사 기출." },
"mlperf": {
    guide: {
      hook: "AI 하드웨어·SW 성능을 공정하게 겨루는 국제 벤치마크입니다.",
      scene: "AI 칩·시스템의 성능을 저마다 다른 기준으로 자랑하면 비교가 안 됩니다. MLPerf는 학습·추론 성능을 표준 과업으로 측정해 공정하게 순위를 매기는 'AI 업계의 공인 기록 경기'입니다.",
      why: "평가 부문(학습·추론)과 CLOSED/OPEN 두 경기 방식이 출제 핵심입니다.",
      mechanism: "부문: Training(학습 속도), Inference(추론 속도·정확도). 지표: 학습(훈련시간·처리량), 추론(추론속도·정확도·처리량). 종목: 이미지 분류, 객체탐지, 음성인식, NLP, 추천, 강화학습. 방식: CLOSED(과업·모델·데이터 고정 — 순수 시스템 성능 비교), OPEN(모델·기법 자유 — 혁신 허용). MLCommons 주관. 하드웨어·프레임워크 벤치마크 표준.",
      map: [
        { as: "학습 속도", real: "Training", note: "" },
        { as: "추론 속도·정확도", real: "Inference", note: "" },
        { as: "조건 고정 비교", real: "CLOSED", note: "" },
        { as: "기법 자유", real: "OPEN", note: "" },
      ],
      usage: "AI 시스템 성능 평가입니다. 시험은 학습·추론 부문, CLOSED/OPEN 방식입니다.",
      links: [
        { topic: "AI 반도체(AI Semiconductor)", how: "하드웨어 성능을 MLPerf로 검증합니다." },
        { topic: "TPU (Tensor Processing Unit)", how: "AI 가속기 성능 비교 대상입니다." },
      ],
      exam: "MLPerf는 학습·추론 성능을 표준 과업으로 측정하는 국제 AI 벤치마크로, 조건을 고정한 CLOSED와 기법이 자유로운 OPEN 방식으로 시스템을 공정하게 비교한다.",
    }, image: "/concept/book/mlperf.png", easy: "AI 하드웨어·소프트웨어의 성능을 공정하게 겨루는 국제 벤치마크 — AI 업계의 '공인 기록 경기'입니다. 평가항목 [학추] — 학습부문(Training: 얼마나 빨리 모델을 학습시키는가)과 추론부문(Inference: 얼마나 빠르고 정확하게 결과를 내는가). 평가지표 [훈처 추정처] — 학습은 훈련시간·처리량, 추론은 추론속도·정확도·처리량. 벤치마크 종목: 이미지 분류, 객체탐지, 음성인식, 자연어처리, 추천시스템, 강화학습(승률 50% 도달 시 종료). 경기 방식 2가지가 시험 포인트: CLOSED(과업·모델·데이터를 고정하고 시간으로만 경쟁 — 공정 비교)와 OPEN(모델 성능 외 모든 항목 자유 설정). 2025.06 KPC 기출." },
"tts": {
    guide: {
      hook: "재학습 없이 '추론 시점에 연산을 더 써서' 성능을 끌어올리는 기법입니다.",
      scene: "모델을 더 크게 학습하는 건 비쌉니다. Test-Time Scaling은 학습된 모델 그대로, 답을 낼 때 여러 번 생각·검산·탐색하도록 추론 연산을 늘려 성능을 높입니다 — 시험 시간에 검산을 여러 번 하는 셈입니다.",
      why: "학습 스케일링과 대비되는 '추론 스케일링'과 대표 기법군이 출제 핵심입니다.",
      mechanism: "핵심: 파라미터·학습이 아닌 추론 연산 투자. 기법: Sampling(Best-of-N — N개 중 최고 선택), Decoding(Beam Search, Self-Consistency — CoT 다수결), Reasoning(CoT·ToT·GoT — 사고 확장), Search & Verification(보상모델 평가, MCTS 롤아웃). o1 등 추론 모델의 원리. 학습 스케일링 한계 보완, 추론 비용↑ 트레이드오프. LLM 고도화 축.",
      map: [
        { as: "N개 중 최고", real: "Best-of-N", note: "" },
        { as: "CoT 다수결", real: "Self-Consistency", note: "" },
        { as: "사고 확장", real: "CoT·ToT", note: "" },
        { as: "탐색·검증", real: "MCTS·보상모델", note: "" },
      ],
      usage: "추론 성능 강화입니다. 시험은 추론 스케일링, 기법군, 학습 스케일링 대비입니다.",
      links: [
        { topic: "CoT (Chain of Thought)", how: "추론 스케일링의 기본 기법입니다." },
        { topic: "LLM 고도화(LLM Enhancement)", how: "추론 강화 축에 속합니다." },
      ],
      exam: "Test-Time Scaling은 재학습 없이 추론 시점 연산을 늘려(Best-of-N·Self-Consistency·MCTS) 성능을 높이는 기법으로, 학습 스케일링과 대비되는 추론 스케일링 축이다.",
    }, image: "/concept/book/tts.png", easy: "모델을 다시 학습시키지 않고, 추론(inference) 시점에 시간·연산을 더 투자해 성능을 끌어올리는 기법입니다 — '시험 시간에 검산을 여러 번 하게 하는 것'. 대표 기법 [베빔체몬] — Sampling 기반: Best-of-N(N개 응답 중 신뢰도 최고 선택) / Decoding 기반: Beam Search(중간단계 평가하며 확장), Self-Consistency(여러 CoT 응답의 다수결) / Reasoning 기반: CoT·ToT·GoT / Search & Verification: 보상모델 평가, MCTS(rollout으로 탐색 경로 확장) / Self-Improvement: 응답→비판→수정 반복 / Compute 최적화: COS(난이도 따라 순차·병렬 탐색 배분). 사전학습과의 비교가 시험 포인트: 사전학습은 모델 능력 자체를 확장(파라미터 수정·고비용), TTS는 파라미터 유지한 채 추론 품질 향상(유연한 비용, 단 느릴 수 있음)." },
"mlops": {
    guide: {
      hook: "ML의 데이터~배포 전 과정을 DevOps와 결합해 자동화하는 운영 프레임워크입니다.",
      scene: "모델을 잘 만들어도 운영·재학습이 수동이면 실전에서 무너집니다. MLOps는 데이터 수집·학습·배포·모니터링을 DevOps 방식으로 자동화해, 모델을 '만드는 것'과 '운영하는 것' 사이 골짜기를 메웁니다.",
      why: "파이프라인 단계와 성숙도 3단계(0/1/2)가 출제 핵심입니다.",
      mechanism: "파이프라인: 도구 선택→구축→데이터 수집→학습→평가→배포→모니터링→재학습(순환). 성숙도: 0단계(수동 빌드·배포, 형상관리 부재), 1단계(ML 파이프라인 자동화 — Feature Store로 재현성 보장), 2단계(CI/CD 자동화 — 배포·재학습 완전 자동). 요소: Feature Store, 모델 레지스트리, 데이터·모델 버전관리, 드리프트 모니터링. DevOps+데이터+ML 융합.",
      map: [
        { as: "수동 빌드·배포", real: "성숙도 0단계", note: "" },
        { as: "파이프라인 자동화", real: "1단계", note: "Feature Store" },
        { as: "CI/CD 자동화", real: "2단계", note: "" },
        { as: "드리프트 감시", real: "모니터링", note: "" },
      ],
      usage: "ML 운영 자동화입니다. 시험은 파이프라인, 성숙도 3단계입니다.",
      links: [
        { topic: "LLMOps", how: "LLM에 특화된 MLOps입니다." },
        { topic: "모델 드리프트(Model Drift)", how: "모니터링으로 탐지·대응합니다." },
      ],
      exam: "MLOps는 데이터 수집·학습·배포·모니터링을 DevOps로 자동화하는 ML 운영 프레임워크로, 성숙도 0(수동)·1(파이프라인)·2(CI/CD) 단계로 발전한다.",
    }, image: "/concept/book/mlops.png", easy: "머신러닝의 데이터 수집→분석→배포 전 과정을 DevOps와 결합해 자동화하는 IT 운영 프레임워크입니다. 모델을 '만드는 것'과 '운영하는 것' 사이의 골짜기를 메웁니다. 파이프라인 [도파 데학평배] — ML옵스 도구 선택 → 파이프라인 구축 → 데이터 수집 → 모델 학습 → 모델 평가 → 모델 배포. 성숙도 3단계가 시험 핵심: 0단계(빌드·배포 수동 — 형상관리 부재로 비효율), 1단계(ML 파이프라인 자동화 — Feature Store로 데이터·특징추출 과정 관리, 재현성 보장), 2단계(CI/CD 파이프라인 자동화 — 배포·모니터링까지 자동화, 실시간 성능 추적과 데이터 드리프트 감지). 구성: ML(Data·Model) + DEV(Create~Package) + OPS(Release~Monitor)." },
// ─────────────── 3주차: 확률·통계(ST) — 교재 슬라이드 + 쉬운 설명 ───────────────
"st-prob-dist": {
    guide: {
      hook: "'어떤 값이 얼마나 자주 나오는지'를 수학으로 표현한 것이 확률분포입니다.",
      scene: "주사위는 1~6이 각 1/6, 키는 평균 근처가 많고 극단은 드뭅니다. 확률분포는 이렇게 값과 그 발생 확률의 관계를 함수로 나타내며, 이산(셀 수 있는)과 연속(측정값)으로 나뉩니다.",
      why: "이산/연속 구분과 대표 분포(이항·포아송·정규 등)의 용도가 출제 핵심입니다. 통계 추론의 기반입니다.",
      mechanism: "이산분포(확률질량함수 PMF): 베르누이(성공/실패 1회), 이항(n회 중 성공 수), 포아송(단위시간 발생 수), 기하. 연속분포(확률밀도함수 PDF): 정규(종형), 균등, 지수, t·카이제곱·F(추론용). 기댓값 E(X)·분산으로 특성화. 표본이 크면 정규 근사(CLT). 추정·검정의 기반.",
      map: [
        { as: "셀 수 있는 값", real: "이산분포(PMF)", note: "이항·포아송" },
        { as: "측정값·연속", real: "연속분포(PDF)", note: "정규·지수" },
        { as: "종형 곡선", real: "정규분포", note: "핵심" },
        { as: "평균·퍼짐", real: "기댓값·분산", note: "" },
      ],
      usage: "통계 추론·모델링의 기반입니다. 시험은 이산/연속 구분, 대표 분포 용도입니다.",
      links: [
        { topic: "정규분포(Normal Distribution)", how: "가장 중요한 연속분포입니다." },
        { topic: "확률분포와 확률 밀도 함수", how: "분포를 함수로 표현합니다." },
      ],
      exam: "확률분포는 값과 발생 확률의 관계를 나타내며 이산(PMF — 이항·포아송)과 연속(PDF — 정규·지수)으로 나뉘고, 기댓값·분산으로 특성화해 통계 추론의 기반이 된다.",
    }, image: "/concept/book/st-prob-dist.png", easy: "확률변수가 특정한 값을 가질 확률을 나타내는 분포입니다. 큰 갈래부터: 이산확률분포(주사위 눈처럼 셀 수 있는 값)와 연속확률분포(키·몸무게처럼 실수 구간의 값). 유형 [이연 베이포 정표T카F] — 이산 3형제: 베르누이(성공/실패 두 결과, 각 시행 독립), 이항(n번 시행 중 k번 성공할 확률 — 시행 횟수가 많아지면 정규분포와 유사), 포아송(단위 시간·면적당 사건 발생 횟수, 기댓값=분산=λ) / 연속 5형제: 정규(종모양 대칭), 표준정규 Z(평균 0·분산 1로 표준화), T(모집단 표준편차를 모를 때 평균 추측 — n이 크면 정규분포에 수렴), 카이제곱 χ²(모집단 1개, 분산 추측·적합도 검정), F(모집단 2개, 분산 비율)." },
"st-pdf": {
    guide: {
      hook: "연속 변수의 확률을 '넓이(적분)'로 나타내는 함수가 확률밀도함수(PDF)입니다.",
      scene: "연속값(키·시간)은 '정확히 175.0cm일 확률'이 0입니다. 그래서 한 점이 아니라 '170~180cm 사이 확률'을 곡선 아래 넓이로 봅니다. PDF의 특정 구간 적분이 그 구간에 속할 확률입니다.",
      why: "이산(PMF, 값=확률) vs 연속(PDF, 넓이=확률)의 차이와 CDF와의 관계가 출제 핵심입니다.",
      mechanism: "PDF f(x): 전체 적분=1, f(x)≥0, P(a≤X≤b)=∫f(x)dx (구간 넓이), 한 점의 확률=0. CDF(누적분포함수) F(x)=P(X≤x)=∫f. F는 PDF의 적분, PDF는 CDF의 미분. 이산은 PMF(각 값에 확률 질량). 정규 PDF는 종형. 기댓값=∫x·f(x)dx. 밀도 자체는 확률이 아니라 '단위당 확률'.",
      map: [
        { as: "곡선 아래 넓이=확률", real: "PDF 구간 적분", note: "연속" },
        { as: "한 점 확률=0", real: "연속 특성", note: "" },
        { as: "누적 확률", real: "CDF(적분)", note: "PDF의 적분" },
        { as: "값=확률(이산)", real: "PMF와 대비", note: "" },
      ],
      usage: "연속확률 계산의 기초입니다. 시험은 PDF 넓이=확률, PMF와의 차이, CDF 관계입니다.",
      links: [
        { topic: "확률분포", how: "PDF는 연속분포의 표현입니다." },
        { topic: "정규분포(Normal Distribution)", how: "대표적 PDF입니다." },
      ],
      exam: "확률밀도함수(PDF)는 연속 변수의 확률을 구간 적분(넓이)으로 나타내며 한 점 확률은 0이고, 누적분포함수(CDF)는 그 적분으로 이산분포의 PMF와 구분된다.",
    }, image: "/concept/book/st-pdf.png", easy: "확률분포는 '각 값이 나올 확률'을 정의한 것이고, 확률밀도함수(PDF)는 그 확률분포를 연속적인 함수로 표현한 것입니다. 주사위 두 개의 합(2~12)으로 보면 직관적입니다 — 합이 2일 확률 1/36, 7일 확률 6/36… 이렇게 점으로 찍으면 확률분포이고, 이 점들을 P(x)=f(x)로 매끄러운 곡선으로 이으면 확률밀도함수입니다. 흐름: 확률변수 →(특정 값 확률 함수)→ 확률분포 →(연속확률분포 표현)→ 확률밀도함수. 셀 수 있으면 확률질량함수(PMF, 베르누이·이항·포아송), 연속이면 확률밀도함수(PDF, 정규·T·카이제곱·F·지수)를 씁니다." },
"st-normal-dist": {
    guide: {
      hook: "평균을 중심으로 좌우 대칭인 '종 모양' 분포 — 자연·사회 현상 대부분이 따릅니다.",
      scene: "키·시험 점수·측정 오차는 평균 근처가 가장 많고 극단으로 갈수록 드물게, 좌우 대칭 종형으로 분포합니다. 평균과 표준편차 두 값만으로 완전히 정해지며, 통계의 중심에 있습니다.",
      why: "68-95-99.7 법칙과 표준정규분포(Z 변환)가 출제 핵심입니다. CLT로 표본평균이 정규를 따르는 것이 포인트입니다.",
      mechanism: "평균 μ·표준편차 σ로 결정. 경험규칙(68-95-99.7): μ±1σ에 68%, ±2σ 95%, ±3σ 99.7%. 표준화: Z=(X−μ)/σ로 표준정규분포(μ=0, σ=1) 변환 → 표준 정규표로 확률 계산. 중심극한정리로 표본평균 분포가 정규 근사. 많은 검정·추정이 정규 가정에 기반.",
      map: [
        { as: "종 모양 좌우 대칭", real: "정규분포", note: "μ·σ로 결정" },
        { as: "±1σ 68%·±2σ 95%", real: "경험규칙", note: "68-95-99.7" },
        { as: "Z=(X−μ)/σ", real: "표준화", note: "표준정규" },
        { as: "표본평균이 정규로", real: "CLT 근거", note: "" },
      ],
      usage: "추정·검정·품질관리(관리도)의 기반입니다. 시험은 68-95-99.7, Z 변환·확률 계산입니다.",
      links: [
        { topic: "중심극한정리", how: "표본평균이 정규를 따르는 근거입니다." },
        { topic: "확률분포와 확률 밀도 함수", how: "정규는 대표적 PDF입니다." },
      ],
      exam: "정규분포는 평균·표준편차로 결정되는 종형 대칭 분포로 μ±1σ·2σ·3σ에 68·95·99.7%가 들며, Z 변환으로 표준정규분포로 바꿔 확률을 계산한다.",
    }, image: "/concept/book/st-normal-dist.png", easy: "평균을 중심으로 좌우 대칭인 종모양 분포 — 키, 시험 점수, 측정 오차 등 자연 현상 대부분이 따르는 분포입니다. 표기는 X ~ N(μ, σ²). 모양은 두 값이 결정합니다: 평균 μ가 위치(대칭축)를, 표준편차 σ가 폭을 정합니다(σ가 클수록 평평, 작을수록 뾰족). 시험 단골은 68-95-99.7 규칙 — 평균에서 ±1σ 안에 68.3%, ±2σ 안에 95.5%, ±3σ 안에 99.7%의 데이터가 들어갑니다(경험규칙, The Empirical Rule). 그 외 특징: 곡선 아래 전체 면적은 1, 평균=중앙값=최빈값이 모두 같음, 곡선이 x축에 무한히 가까워지지만 닿지는 않음. 확률밀도함수는 f(x)=1/(σ√2π)·e^(−(x−μ)²/2σ²)." },
"st-clt": {
    guide: {
      hook: "'표본평균의 분포는 모집단이 뭐든 정규분포로 수렴한다'는 통계학의 기둥 정리입니다.",
      scene: "모집단이 치우쳐 있어도, 표본을 여러 번 뽑아 각 표본의 평균을 모으면 그 평균들의 분포는 표본 크기가 클수록 정규분포에 가까워집니다. 그래서 정규 가정 검정·추정이 널리 통합니다.",
      why: "'표본평균의 정규 수렴'과 표준오차(σ/√n)가 출제 핵심입니다. 추론 통계가 성립하는 근거입니다.",
      mechanism: "표본평균 X̄의 분포: 표본 크기 n이 충분히 크면(보통 n≥30) 모집단 분포와 무관하게 정규분포 근사. 평균=모평균 μ, 표준편차=표준오차 σ/√n(n 커질수록 좁아짐 — 추정 정밀도↑). 원 모집단이 정규면 n 작아도 성립. 이 정리 덕에 표본으로 모수를 추정·검정 가능. 대수의 법칙(표본평균→모평균)과 구분(CLT는 분포 형태).",
      map: [
        { as: "평균들이 정규로 수렴", real: "표본평균의 정규성", note: "모집단 무관" },
        { as: "n 크면(≥30)", real: "충분한 표본", note: "" },
        { as: "σ/√n", real: "표준오차", note: "n↑ 정밀↑" },
        { as: "추론 성립 근거", real: "추정·검정 기반", note: "" },
      ],
      usage: "추정·가설검정의 이론적 근거입니다. 시험은 표본평균 정규성, 표준오차, 대수의 법칙과의 구분입니다.",
      links: [
        { topic: "정규분포(Normal Distribution)", how: "표본평균이 수렴하는 분포입니다." },
        { topic: "추론 통계(Inferential Statistics)", how: "CLT가 추론을 가능케 합니다." },
      ],
      exam: "중심극한정리는 표본 크기가 크면 모집단 분포와 무관하게 표본평균이 평균 μ, 표준오차 σ/√n의 정규분포를 따른다는 정리로, 추론 통계의 근거가 된다.",
    }, image: "/concept/book/st-clt.png", easy: "표본 크기 n이 충분히 크면(보통 30 이상) '표본 평균들이 이루는 분포'는 원래 모집단이 어떤 모양이든 상관없이 정규분포를 따른다는 원리입니다. 이게 왜 중요한가 — 모집단 분포를 몰라도 Z값을 구해 확률을 계산할 수 있게 되어, 수학적 확률 판단(추정)이 가능해집니다. 통계적 추론 전체의 토대죠. 교재 그림이 핵심: 균등분포·비균등분포·정규분포 어떤 모집단에서 뽑아도, n=1→5→30→100으로 갈수록 표본평균의 분포는 정규분포 모양으로 수렴합니다(Bin·Pois·Expo·Beta 전부). 표본평균의 표준편차(표준오차)는 σ/√n — 표본이 커질수록 평균이 더 촘촘해집니다." },
"st-data-type": {
    guide: {
      hook: "데이터를 '측정 수준'으로 나눈 4척도 — 명목·순서·등간·비율입니다.",
      scene: "성별(명목)·학점(순서)·온도(등간)·키(비율)는 다룰 수 있는 연산과 통계가 다릅니다. 데이터 유형을 알아야 어떤 그래프·통계·모델을 쓸지 정할 수 있습니다.",
      why: "4척도의 구분과 각 척도에서 가능한 연산·통계가 출제 핵심입니다. 질적/양적 구분이 포인트입니다.",
      mechanism: "질적(범주형): 명목척도(구분만 — 성별·혈액형, 최빈값), 순서척도(순위 有·간격 無 — 학점·만족도, 중앙값). 양적(수치형): 등간척도(간격 의미·절대영점 無 — 섭씨온도, 덧셈·평균 가능·비율 무의미), 비율척도(절대영점 有 — 키·무게·소득, 모든 연산). 상위 척도일수록 더 많은 연산·통계 가능. 이산/연속과 교차.",
      map: [
        { as: "구분만(성별)", real: "명목척도", note: "최빈값" },
        { as: "순위(학점)", real: "순서척도", note: "중앙값" },
        { as: "간격(섭씨)", real: "등간척도", note: "비율 무의미" },
        { as: "절대영점(키)", real: "비율척도", note: "모든 연산" },
      ],
      usage: "분석 기법·시각화 선택의 기준입니다. 시험은 4척도 구분, 가능한 연산·통계입니다.",
      links: [
        { topic: "기술 통계(Descriptive statistics)", how: "척도에 맞는 대표값을 씁니다." },
        { topic: "데이터 시각화", how: "척도별 적합 차트를 고릅니다." },
      ],
      exam: "데이터 유형은 측정 수준에 따라 명목·순서(질적)·등간·비율(양적) 4척도로 나뉘며, 상위 척도일수록 더 많은 연산·통계가 가능하다.",
    }, image: "/concept/book/st-data-type.png", easy: "데이터를 어떤 척도로 쟀느냐에 따라 쓸 수 있는 통계 기법이 달라지므로, 유형 구분이 통계의 출발점입니다. 자료 형태 [명순등비] — 범주형(질적): 명목 자료(단순 분류, 숫자를 매겨도 크기 의미 없음 — 성별·혈액형·직업구분), 순서 자료(범주에 순서 관계 성립 — 우선순위·등수·학점·선호도) / 수치형(양적): 등간 자료(균일한 간격, 셀 수 있는 형태 — 설문 문항·온도·IQ), 비율 자료(절대영점이 있어 비율 계산 가능 — 시험점수·키·몸무게). 시간 기준으로는 횡단형(한 시점에 얻은 데이터)과 종단형(같은 대상을 여러 시점에 걸쳐 — 시계열 자료)으로 나뉩니다." },
"st-sampling": {
    guide: {
      hook: "전체를 다 조사할 수 없을 때 '대표성 있게 일부를 뽑는' 표본 추출 기법입니다.",
      scene: "국민 전체 여론을 다 물을 순 없으니 일부를 뽑아 추정합니다. 어떻게 뽑느냐가 대표성을 좌우합니다 — 무작위로, 층을 나눠, 집락으로, 계통적으로. 잘못 뽑으면 편향된 결론이 나옵니다.",
      why: "확률/비확률 표본과 4대 확률 추출법(단순·층화·군집·계통)이 출제 핵심입니다. 표본 편향이 포인트입니다.",
      mechanism: "확률 표본(대표성·추론 가능): 단순 무작위(모두 동일 확률), 층화(Stratified — 동질 층으로 나눠 각 층에서 추출, 정밀), 군집/집락(Cluster — 집단 단위로 추출, 비용↓·오차↑), 계통(Systematic — 일정 간격). 비확률 표본(편의·판단·할당·눈덩이 — 대표성 약함). 표본 크기·오차한계·신뢰수준 고려. 선택 편향·무응답 편향 주의.",
      map: [
        { as: "모두 동일 확률", real: "단순 무작위", note: "" },
        { as: "층 나눠 뽑기", real: "층화 추출", note: "정밀" },
        { as: "집단 단위로", real: "군집 추출", note: "비용↓" },
        { as: "일정 간격", real: "계통 추출", note: "" },
      ],
      usage: "설문·여론조사·품질검사입니다. 시험은 확률/비확률, 4추출법 특성, 편향입니다.",
      links: [
        { topic: "추론 통계(Inferential Statistics)", how: "표본으로 모집단을 추론합니다." },
        { topic: "중심극한정리", how: "표본평균 분포의 근거입니다." },
      ],
      exam: "표본 추출은 모집단 일부를 뽑는 기법으로, 대표성 있는 확률 표본(단순·층화·군집·계통)과 편의 위주 비확률 표본으로 나뉘며 선택·무응답 편향을 주의한다.",
    }, image: "/concept/book/st-sampling.png", easy: "모집단 전체를 조사할 수 없으니 표본을 뽑는데, '모든 요소가 동일한 확률로 뽑히느냐'가 확률/비확률 추출을 가릅니다. 확률 추출 [단층계집] — 단순확률(난수로 무작위: 1000명 중 100명), 층화확률(모집단을 겹치지 않는 층으로 나눈 뒤 각 층에서 무작위: 연령대별 추출), 계통(k번째 간격마다 하나씩: k=3), 집락/군집(인접한 단위로 군집을 만들고 군집 단위로 조사: 거주 지역별). 비확률 추출 [눈편할유판] — 눈덩이(응답자가 다음 응답자를 소개), 편의(조사원이 편한 대로), 할당(특성별 층을 만들되 조사원이 직접 선정), 유의추출·포커스 그룹(전문가가 주관적 판단으로), 판단추출(가장 대표적이라 여겨지는 표본을 주관적으로 — 표본이 아주 작을 때)." },
"st-skew-kurt": {
    guide: {
      hook: "분포가 '한쪽으로 치우쳤나(왜도)'와 '뾰족하거나 두꺼운 꼬리인가(첨도)'를 재는 값입니다.",
      scene: "정규분포는 대칭·적당한 봉우리입니다. 왜도는 좌우 비대칭 정도(소득처럼 오른쪽 꼬리가 길면 양의 왜도), 첨도는 봉우리의 뾰족함·꼬리 두께를 나타내 정규와의 차이·이상치를 진단합니다.",
      why: "왜도·첨도의 부호·값 해석과 정규분포 기준이 출제 핵심입니다. 이상치·분포 진단과 연결됩니다.",
      mechanism: "왜도(Skewness — 3차 모멘트): 0=대칭(정규), 양수=오른쪽 꼬리 길다(평균>중앙값, 소득), 음수=왼쪽 꼬리. 첨도(Kurtosis — 4차 모멘트): 정규=3(초과첨도 0 기준), >3(급첨 leptokurtic — 뾰족·두꺼운 꼬리·이상치 많음), <3(완첨 platykurtic — 납작). 데이터 정규성 진단·변환(로그) 판단·이상치 탐지에 활용.",
      map: [
        { as: "좌우 치우침", real: "왜도(Skewness)", note: "양=우측 꼬리" },
        { as: "봉우리·꼬리", real: "첨도(Kurtosis)", note: "정규=3" },
        { as: "평균>중앙값", real: "양의 왜도", note: "" },
        { as: "뾰족·두꺼운 꼬리", real: "급첨(>3)", note: "이상치" },
      ],
      usage: "분포 진단·정규성 검토입니다. 시험은 왜도·첨도 부호·값 해석, 정규 기준입니다.",
      links: [
        { topic: "정규분포(Normal Distribution)", how: "왜도 0·첨도 3의 기준입니다." },
        { topic: "이상치(Outlier)", how: "높은 첨도가 이상치를 시사합니다." },
      ],
      exam: "왜도는 분포의 좌우 비대칭(양수=오른쪽 꼬리), 첨도는 봉우리·꼬리 두께(정규=3, >3 급첨)를 재는 값으로, 정규성 진단과 이상치 탐지에 활용된다.",
    }, image: "/concept/book/st-skew-kurt.png", easy: "정규분포와 얼마나 다른지를 재는 두 지표 — 정규성 검정에 씁니다. 왜도(Skewness)는 분포가 '어느 쪽으로 기울었나'입니다: 왜도 < 0이면 오른쪽으로 치우친 분포(Negative Skewness), 0이면 정규분포와 유사한 대칭, > 0이면 왼쪽으로 치우친 분포(Positive Skewness). 첨도(Kurtosis)는 '얼마나 뾰족한가'입니다: 첨도 < 0이면 상대적으로 평평(Platykurtic), 0이면 정규분포 수준(Mesokurtic), > 0이면 뾰족(Leptokurtic). 수식은 표준화한 편차의 3제곱 평균이 왜도(γ₁), 4제곱 평균에서 3을 뺀 것이 첨도(γ₂)입니다 — 3을 빼는 이유는 정규분포의 첨도를 0으로 맞추기 위해서입니다." },
"st-outlier": {
    guide: {
      hook: "다른 값들과 '동떨어진 극단값' — 오류일 수도, 중요한 신호일 수도 있습니다.",
      scene: "대부분 30대 고객인데 한 명이 120세라면 입력 오류일 수 있습니다. 반대로 사기 거래처럼 이상치가 진짜 중요한 발견일 수도 있습니다. 그래서 무조건 지우지 않고 원인을 따져 처리합니다.",
      why: "탐지 기법(IQR·Z-score·시각화)과 처리 방법(제거·대체·변환·유지)이 출제 핵심입니다. 분석 왜곡 영향이 포인트입니다.",
      mechanism: "탐지: IQR 방법(Q1−1.5×IQR 미만, Q3+1.5×IQR 초과 — 박스플롯), Z-score(|z|>3), 통계·거리 기반(마할라노비스), ML(격리 숲·LOF). 원인: 입력 오류·측정 오류·진짜 극단·이질 집단. 처리: 제거(오류 확실 시), 대체(대푯값·상한 캡핑 winsorizing), 변환(로그), 유지(중요 신호 — 사기·희귀사건). 평균·분산·회귀를 크게 왜곡하므로 신중히.",
      map: [
        { as: "박스플롯 밖 값", real: "IQR 탐지", note: "1.5×IQR" },
        { as: "|z|>3", real: "Z-score 탐지", note: "" },
        { as: "오류면 제거", real: "제거·대체", note: "" },
        { as: "사기 같은 진짜 신호", real: "유지", note: "중요 발견" },
      ],
      usage: "데이터 정제·이상 탐지입니다. 시험은 IQR·Z-score 탐지, 처리 방법, 분석 왜곡입니다.",
      links: [
        { topic: "결측치(Missing Value)", how: "데이터 정제의 짝 문제입니다." },
        { topic: "왜도(Skewness) & 첨도(Kurtosis)", how: "첨도가 이상치를 시사합니다." },
      ],
      exam: "이상치는 다른 값과 동떨어진 극단값으로 IQR·Z-score·시각화로 탐지하며, 원인에 따라 제거·대체·변환·유지하고 평균·회귀를 왜곡하므로 신중히 처리한다.",
    }, image: "/concept/book/st-outlier.png", easy: "관측 데이터 범위에서 많이 벗어난 아주 작거나 큰 값 — 그냥 두면 평균·분산을 왜곡해 분석 결과를 망칩니다. 가장 많이 쓰는 검출법이 사분위수 기반: IQR = Q3 − Q1일 때, 내부울타리 Q1−1.5×IQR ~ Q3+1.5×IQR 밖이면 이상치, 외부울타리(±3.0×IQR) 밖이면 극단 이상값입니다(상자수염그림의 그 기준). 그 외 검출 방법: Variance(정규분포 97.5% 이상 또는 2.5% 이하), Likelihood(베이즈 정리로 정상/이상 발생 확률 비교), Nearest-Neighbor(모든 쌍의 거리 계산), Density(LoF 값이 큰 것), Clustering(작은 클러스터나 멀리 떨어진 클러스터). 대체 방법: 하한/상한값 대체, 3시그마 기준, 중위수 기준 절대편차, 백분위수, Winsorization(윈저화)." },
"st-missing-value": {
    guide: {
      hook: "'비어 있는 값'을 어떻게 채우거나 처리하느냐가 분석 품질을 좌우합니다.",
      scene: "설문에 무응답, 센서 오류로 빈칸이 생깁니다. 무작정 지우면 데이터가 줄고 편향될 수 있어, 결측이 왜 생겼는지(패턴)에 따라 삭제·대체 방법을 골라야 합니다.",
      why: "결측 유형(MCAR·MAR·MNAR)과 처리 방법(삭제·대치)이 출제 핵심입니다. 편향 위험이 포인트입니다.",
      mechanism: "결측 유형: MCAR(완전 무작위 — 결측이 다른 변수와 무관, 삭제 무해), MAR(무작위 — 관측된 다른 변수로 설명 가능), MNAR(비무작위 — 결측 자체가 값에 의존, 편향 위험 큼). 처리: 삭제(목록별·쌍별 — 데이터 손실), 단순 대치(평균·중앙값·최빈값 — 분산 축소), 회귀 대치, 다중 대치(MI — 여러 값 생성해 불확실성 반영), KNN·ML 대치. 결측 패턴 파악 후 방법 선택.",
      map: [
        { as: "완전 무작위 결측", real: "MCAR", note: "삭제 무해" },
        { as: "다른 변수로 설명", real: "MAR", note: "" },
        { as: "값 자체에 의존", real: "MNAR", note: "편향 위험" },
        { as: "여러 값으로 채움", real: "다중 대치(MI)", note: "불확실성 반영" },
      ],
      usage: "데이터 전처리입니다. 시험은 MCAR/MAR/MNAR, 대치 방법, 편향입니다.",
      links: [
        { topic: "이상치(Outlier)", how: "데이터 정제의 짝 문제입니다." },
        { topic: "데이터 프로파일링(Data Profiling)", how: "결측률을 진단합니다." },
      ],
      exam: "결측치는 결측 원인에 따라 MCAR·MAR·MNAR로 나뉘며, 삭제·단순대치·다중대치 등으로 처리하되 MNAR과 부적절한 대치는 편향을 유발하므로 주의한다.",
    }, image: "/concept/book/st-missing-value.png", easy: "관측되어야 할 값을 얻지 못한 데이터입니다. 그냥 두면 데이터 손실뿐 아니라 분포를 왜곡시켜 편향을 만들기 때문에 반드시 처리해야 합니다. 처리는 크게 둘 — 삭제(Deletion): 행 삭제(Listwise, 결측이 포함된 행 제거)와 열 삭제(결측 비율이 높은 변수 제거). 결측치가 5% 이하로 소수일 때만 안전합니다 / 대체(Imputation): 통계값 대체(연속형은 평균·중앙값, 범주형은 최빈값), 회귀 대체(선형 회귀 등 예측 모델로 보완), KNN 대체(유사한 데이터를 찾아 대체), 다중 대체(여러 번 샘플링해 예측값으로). 나아가 Decision Tree·Random Forest 같은 머신러닝 모델로 결측값을 예측하기도 합니다. 유형은 매커니즘(완전 무작위·무작위·비무작위 결측)과 패턴(일변량·단조·일반·규칙)으로 나뉩니다." },
"st-timeseries": {
    guide: {
      hook: "'시간 순서로 쌓인 데이터'에서 추세·계절성을 찾아 미래를 예측하는 분석입니다.",
      scene: "매출·주가·기온처럼 시간에 따라 변하는 데이터는 추세(장기 방향)·계절성(주기 반복)·순환·불규칙이 섞여 있습니다. 이를 분해하고 모델링해 미래 값을 예측합니다.",
      why: "구성요소 분해(추세·계절·순환·불규칙)와 대표 모델(ARIMA·지수평활)이 출제 핵심입니다. 정상성이 포인트입니다.",
      mechanism: "구성요소: 추세(Trend), 계절성(Seasonality — 고정 주기), 순환(Cycle — 불규칙 주기), 불규칙(Irregular). 분해(가법·승법). 정상성(Stationarity — 평균·분산 시간 불변, 차분으로 확보). 모델: AR(자기회귀)·MA(이동평균)·ARIMA(차분+AR+MA), 계절 SARIMA, 지수평활(단순·Holt·Holt-Winters), 최근 딥러닝(LSTM). 자기상관(ACF/PACF)으로 차수 결정.",
      map: [
        { as: "장기 방향", real: "추세", note: "" },
        { as: "주기 반복", real: "계절성", note: "" },
        { as: "차분으로 안정화", real: "정상성", note: "ARIMA 전제" },
        { as: "AR+I+MA", real: "ARIMA 모델", note: "" },
      ],
      usage: "수요·매출·주가 예측입니다. 시험은 구성요소, 정상성·차분, ARIMA·지수평활입니다.",
      links: [
        { topic: "회귀분석(Regression Analysis)", how: "예측 모델링의 다른 축입니다." },
        { topic: "탐색적 데이터 분석과 확증적 데이터 분석", how: "시계열 탐색과 연결됩니다." },
      ],
      exam: "시계열분석은 추세·계절성·순환·불규칙으로 분해하고 정상성을 확보해 ARIMA·지수평활 등으로 미래를 예측하며, ACF/PACF로 모델 차수를 결정한다.",
    }, image: "/concept/book/st-timeseries.png", easy: "시간 흐름에 따라 관측되는 자료의 특성을 분석해 미래를 예측하는 기법입니다. 전제 조건이 정상성 — 시간에 따라 통계적 특성이 변하지 않는 상태(평균 일정, 분산 일정, 공분산은 시차에만 의존). 구성 요소 [추순계불] — 추세(장기 변동: GDP·인구증가율), 순환(중기, 2~10년 주기), 계절(1년 주기 단기 변동), 불규칙(예측 불가한 우연 변동). 모델 4형제가 시험 핵심: AR(자기회귀 — 과거 '값'의 선형 조합으로 예측), MA(이동평균 — 과거 '예측 오차'가 현재에 영향), ARMA(AR+MA 결합), ARIMA(ARMA에 차분을 더해 비정상 데이터를 정상성 데이터로 변환 — 평균을 0으로 유지). 138회 정보관리 1교시 기출." },
"st-bayes": {
    guide: {
      hook: "'새로운 증거로 기존 믿음을 갱신'하는 확률 갱신의 공식입니다.",
      scene: "질병 유병률이 낮을 때, 양성 판정이 나와도 실제 환자일 확률은 생각보다 낮습니다. 베이즈 정리는 사전 확률(기존 믿음)에 증거(검사 결과)를 곱해 사후 확률(갱신된 믿음)을 계산합니다.",
      why: "사전→사후 갱신 구조와 조건부 확률, 낮은 유병률의 함정이 출제 핵심입니다. 나이브 베이즈·베이지안 추론의 토대입니다.",
      mechanism: "P(A|B) = P(B|A)·P(A) / P(B). A=가설(예: 질병), B=증거(양성). P(A)=사전확률, P(B|A)=우도, P(A|B)=사후확률. P(B)=전확률(정규화). 유병률 낮으면 위양성 때문에 사후확률이 낮음(기저율 오류). 반복 적용으로 믿음 갱신. 응용: 스팸 필터(나이브 베이즈), 의료 진단, 베이지안 추론(빈도주의와 대비).",
      map: [
        { as: "기존 믿음", real: "사전확률 P(A)", note: "" },
        { as: "증거의 우도", real: "P(B|A)", note: "" },
        { as: "갱신된 믿음", real: "사후확률 P(A|B)", note: "핵심" },
        { as: "낮은 유병률 함정", real: "기저율 오류", note: "" },
      ],
      usage: "진단·스팸 필터·머신러닝입니다. 시험은 공식 계산, 사전/사후, 기저율 오류입니다.",
      links: [
        { topic: "추론 통계(Inferential Statistics)", how: "베이지안 추론의 토대입니다." },
        { topic: "knn(K-Nearest Neighbors)", how: "나이브 베이즈와 함께 분류 알고리즘입니다." },
      ],
      exam: "베이즈 정리는 사전확률에 우도를 결합해 사후확률로 믿음을 갱신하는 공식 P(A|B)=P(B|A)P(A)/P(B)로, 유병률이 낮으면 기저율 오류가 발생한다.",
    }, image: "/concept/book/st-bayes.png", easy: "새로운 증거(사건 B)를 관측했을 때, 원래 알던 확률(사전확률)을 갱신해 사후확률을 구하는 정리입니다. 수식 P(A|B) = P(B|A)P(A)/P(B) — 우변의 P(A)가 사전확률, P(B|A)가 우도(Likelihood), 좌변이 사후확률입니다. 용어 [전우후]: 사전확률(이미 알고 있는 초기 확률) → 우도(그 원인에서 이 사건이 일어날 확률) → 사후확률(증거를 반영해 갱신된 조건부 확률). 수식 이론 [조곱전베]: 조건부 확률 P(A|B)=P(A∩B)/P(B) → 곱셈의 정리 P(A∩B)=P(B|A)P(A) → 전확률의 법칙 P(B)=ΣP(B∩Aᵢ) → 베이즈 정리(이 셋을 조합). 스팸 필터·의료 진단·나이브 베이즈 분류기의 원리입니다. 138회 정보관리 1교시 기출." },
"st-descriptive": {
    guide: {
      hook: "데이터를 '요약해서 특징을 보여 주는' 기술 통계 — 대푯값과 산포도입니다.",
      scene: "수천 개 값을 다 볼 순 없으니 대표 숫자로 요약합니다. 중심이 어디인지(평균·중앙값), 얼마나 퍼졌는지(분산·표준편차), 어떤 모양인지(왜도·첨도)로 데이터의 성격을 한눈에 파악합니다.",
      why: "대푯값(평균·중앙값·최빈값)과 산포도(분산·표준편차·IQR)의 구분이 출제 핵심입니다. 추론 통계와의 차이가 포인트입니다.",
      mechanism: "중심 경향(대푯값): 평균(이상치 민감), 중앙값(이상치 강건), 최빈값(범주형). 산포도: 범위, 분산·표준편차(평균 중심 퍼짐), IQR(사분위 범위, 강건), 변동계수(CV — 단위 무관 비교). 분포 형태: 왜도·첨도. 요약·시각화(박스플롯·히스토그램)로 데이터 이해. 표본을 넘어 모집단을 추정하는 추론 통계와 구분(기술=요약, 추론=일반화).",
      map: [
        { as: "평균·중앙값·최빈값", real: "대푯값(중심)", note: "" },
        { as: "분산·표준편차·IQR", real: "산포도(퍼짐)", note: "" },
        { as: "이상치에 강건", real: "중앙값·IQR", note: "" },
        { as: "요약 vs 일반화", real: "추론과 구분", note: "" },
      ],
      usage: "데이터 요약·EDA입니다. 시험은 대푯값·산포도 구분, 이상치 강건성, 추론과의 차이입니다.",
      links: [
        { topic: "추론 통계(Inferential Statistics)", how: "기술(요약) vs 추론(일반화)입니다." },
        { topic: "데이터 시각화", how: "기술 통계를 시각화로 보완합니다." },
      ],
      exam: "기술 통계는 데이터를 대푯값(평균·중앙값·최빈값)과 산포도(분산·표준편차·IQR)로 요약하며, 표본으로 모집단을 일반화하는 추론 통계와 구분된다.",
    }, image: "/concept/book/st-descriptive.png", easy: "주어진 표본 자체의 속성을 정량적으로 기술·요약하는 통계입니다(모집단 추정은 추론통계의 몫). 데이터 요약 3축 — 중심경향값(평균: 모두 더해 개수로 나눔 / 중위수: 순서대로 나열했을 때 중앙값 / 최빈값: 가장 많이 관찰되는 값), 변산도(최대·최소·범위, 분산: 평균에서 떨어진 정도, 표준편차: 분산의 제곱근), 분포(왜도: 비대칭성, 첨도: 뾰족한 정도). 데이터 시각화 3종 — 히스토그램(도수 분포를 직사각형 기둥으로), 상자수염그림(사분위수로 분포 표현 + 이상치 탐지), 산점도(두 수치형 변수의 관계 시각화). 이상치에 강한 지표를 원하면 평균 대신 중위수를 보는 것이 실무 감각입니다." },
"st-inferential": {
    guide: {
      hook: "'표본으로 모집단을 추측'하는 통계 — 추정과 검정이 두 축입니다.",
      scene: "국민 전체를 못 조사하니 표본으로 전체를 추측합니다. 모수가 얼마쯤인지 범위로 추정하고(신뢰구간), 어떤 주장이 맞는지 검정(가설검정)합니다. 불확실성을 확률로 다루는 게 핵심입니다.",
      why: "추정·검정의 두 축과 표본→모집단 일반화가 출제 핵심입니다. CLT·표준오차가 근거입니다.",
      mechanism: "두 축: 추정(Estimation — 점추정: 모수의 단일값 / 구간추정: 신뢰구간, 예 95% CI), 가설검정(Hypothesis Testing — 귀무·대립가설, p값·유의수준). 근거: 표본분포(CLT — 표본평균이 정규), 표준오차. 불확실성을 신뢰수준·유의수준으로 정량화. 표본에서 모집단으로 일반화(귀납). 기술 통계(요약)와 구분.",
      map: [
        { as: "표본으로 전체 추측", real: "일반화(귀납)", note: "" },
        { as: "범위로 추정", real: "추정(신뢰구간)", note: "" },
        { as: "주장 검증", real: "가설검정", note: "" },
        { as: "CLT·표준오차", real: "이론 근거", note: "" },
      ],
      usage: "모수 추정·의사결정입니다. 시험은 추정/검정 두 축, CLT 근거, 기술과의 차이입니다.",
      links: [
        { topic: "추정 이론(Estimation Theory)", how: "추론의 추정 축입니다." },
        { topic: "통계적 가설검정(Hypothesis Testing)", how: "추론의 검정 축입니다." },
      ],
      exam: "추론 통계는 표본으로 모집단을 추측하는 통계로 추정(신뢰구간)과 가설검정이 두 축이며, 중심극한정리·표준오차를 근거로 불확실성을 확률로 정량화한다.",
    }, image: "/concept/book/st-inferential.png", easy: "표본 데이터를 근거로 모집단의 특성을 추정하거나 가설을 검정하는 통계입니다. 기술통계와의 차이가 시험 포인트: 기술통계는 '수집한 표본 자체'를 요약하는 게 목적(특정 학급 성적 추세), 추론통계는 표본으로 '모집단'을 추정하는 게 목적(생산라인 불량률 추정, 선거 지지도 조사). 방법은 셋으로 갈립니다 — 모수적 방법(정규성 가정: 대응표본 t-검정(같은 집단 두 시점), 독립표본 t-검정(다른 두 집단), 일원배치·반복측정 분산분석(3개 이상)), 비모수적 방법(정규성 가정 없음: 윌콕슨 부호순위, 맨휘트니, 크루스컬-월리스, 후리드만 — 모수적 방법과 1:1로 대응), 가설 검정(가설수립 → 검정통계량 선정 → 유의수준 결정 → 계산 → p값으로 판정)." },
"st-estimation": {
    guide: {
      hook: "'모수의 참값을 표본으로 추정'하는 이론 — 점추정과 구간추정입니다.",
      scene: "모집단 평균을 정확히는 모르니 표본으로 추정합니다. 하나의 값으로(점추정) 또는 '95% 확신하는 범위'로(구간추정) 추정하며, 좋은 추정량의 조건이 있습니다.",
      why: "점/구간 추정과 좋은 추정량 4조건(불편·효율·일치·충분)이 출제 핵심입니다. 신뢰구간 해석이 포인트입니다.",
      mechanism: "점추정: 모수를 단일값으로(표본평균→모평균). 구간추정: 신뢰구간(점추정 ± 오차한계, 예 95% CI = 추정치 ± 1.96×표준오차) — '같은 방식 반복 시 95%가 참값 포함'. 좋은 추정량 조건: 불편성(기댓값=모수), 효율성(분산 최소), 일치성(n↑ 시 수렴), 충분성(정보 다 포함). 추정법: 최대우도(MLE), 적률법, 베이지안. 신뢰수준↑면 구간 넓어짐.",
      map: [
        { as: "하나의 값", real: "점추정", note: "" },
        { as: "확신하는 범위", real: "구간추정(CI)", note: "" },
        { as: "기댓값=모수", real: "불편성", note: "추정량 조건" },
        { as: "분산 최소", real: "효율성", note: "" },
      ],
      usage: "모수 추정입니다. 시험은 점/구간, 추정량 4조건, 신뢰구간 해석입니다.",
      links: [
        { topic: "추론 통계(Inferential Statistics)", how: "추론의 추정 축입니다." },
        { topic: "통계적 가설검정(Hypothesis Testing)", how: "추론의 다른 축입니다." },
      ],
      exam: "추정 이론은 모수를 표본으로 추정하는 이론으로 점추정과 신뢰구간(구간추정)이 있으며, 좋은 추정량은 불편성·효율성·일치성·충분성을 갖춰야 한다.",
    }, image: "/concept/book/st-estimation.png", easy: "표본에서 모집단의 모수(평균·분산 등)를 알아내는 과정입니다. 추정 방법 [점구] — 점 추정(모수를 값 하나로: MLE 최대우도추정, MOM 모멘트추정, MAP 베이지안 — 구체적이지만 불확실성을 못 보여줌)과 구간 추정(모수가 이 구간 안에 있을 것이라는 신뢰 구간 제시 — 불확실성을 표현). 좋은 추정량의 조건 [불효일충] — 불편성(기대값이 실제 모수와 동일), 효율성(불편 추정량 중 분산이 가장 작음), 일치성(표본이 커질수록 실제 모수에 수렴), 충분성(통계량만으로 충분한 정보 제공). 시험 단골 포인트: 표본분산을 구할 때 n이 아니라 n−1(자유도)로 나누는 이유가 불편추정량을 만들기 위해서입니다. 자유도 = 독립된 표본의 수(x+y+z=10에서 x·y를 알면 z는 자동 결정 → 자유도 2)." },
"st-association": {
    guide: {
      hook: "두 변수가 '함께 변하는 정도'를 재는 기초 통계 — 공분산과 상관계수입니다.",
      scene: "키가 크면 몸무게도 큰가? 두 변수가 같이 오르내리는지를 봅니다. 공분산은 방향을, 상관계수는 −1~1로 강도와 방향을 표준화해 보여 줍니다. 단, 상관은 인과가 아닙니다.",
      why: "공분산 vs 상관계수(표준화)와 '상관≠인과'가 출제 핵심입니다. 피어슨/스피어만 구분이 포인트입니다.",
      mechanism: "공분산 Cov(X,Y): 양수=같이 증가, 음수=반대, 단위 의존(비교 어려움). 상관계수 r = Cov(X,Y)/(σx·σy): −1~1 표준화, |r|→1 강한 선형관계, 0=선형관계 없음. 피어슨(선형·연속), 스피어만(순위·비선형·강건), 켄달. 주의: 상관≠인과(교란변수·우연), 비선형 관계는 r로 못 잡음, 이상치 민감. 회귀분석의 기초.",
      map: [
        { as: "같이 변하는 방향", real: "공분산", note: "단위 의존" },
        { as: "−1~1 표준화 강도", real: "상관계수 r", note: "핵심" },
        { as: "선형 vs 순위", real: "피어슨/스피어만", note: "" },
        { as: "상관≠인과", real: "해석 주의", note: "교란변수" },
      ],
      usage: "변수 관계 분석·EDA입니다. 시험은 공분산/상관계수, 상관≠인과, 피어슨/스피어만입니다.",
      links: [
        { topic: "회귀분석(Regression Analysis)", how: "상관을 인과·예측 모델로 확장합니다." },
        { topic: "연관성 분석(association analysis) - 데이터마이닝", how: "범주형 연관규칙과 구분됩니다." },
      ],
      exam: "연관성 분석(기초통계)은 공분산(방향)과 상관계수 r(−1~1 표준화 강도)로 두 변수의 함께 변하는 정도를 재며, 상관은 인과가 아니고 피어슨·스피어만으로 나뉜다.",
    }, image: "/concept/book/st-association.png", easy: "변수들 사이에 어떤 관계가 있는지 판단하는 분석인데, 어떤 척도로 잰 데이터냐에 따라 방법이 갈립니다. 명목척도 → 교차분석(카이제곱 검정): 범주형 자료로 교차표를 만들어 관측빈도와 기대빈도를 비교합니다(적합도·독립성·동질성 검정). 서열척도 → 스피어만 서열 상관분석. 등간·비율척도 → 피어슨 상관분석(두 연속형 변수의 선형 관계), 제3의 변수를 통제하고 싶으면 편상관분석. 상관분석의 핵심은 상관계수 r — 산포도로 보면 양의 상관(우상향), 상관관계 없음(r=0, 선형관계 아님), 음의 상관(우하향)입니다. 상관계수 유형은 피어슨·켄달·스피어만 세 가지." },
"st-regression": {
    guide: {
      hook: "'독립변수로 종속변수를 예측·설명'하는 모델 — 관계를 수식으로 만듭니다.",
      scene: "광고비(X)로 매출(Y)을 예측하고 싶습니다. 회귀분석은 데이터에 가장 잘 맞는 직선(또는 곡선)을 찾아 Y = aX + b 관계를 세우고, X가 Y를 얼마나 설명하는지 측정합니다.",
      why: "최소제곱법·결정계수(R²)와 회귀 가정, 다중공선성이 출제 핵심입니다. 상관과의 차이(예측·인과 방향)가 포인트입니다.",
      mechanism: "단순/다중 회귀: Y=β0+β1X1+…+ε, 최소제곱법(잔차 제곱합 최소)으로 계수 추정. 적합도: 결정계수 R²(설명력 0~1), 조정 R², F검정(모델 유의성), t검정(계수 유의성). 가정: 선형성·독립성·등분산성·정규성(잔차). 문제: 다중공선성(독립변수 간 상관 — VIF), 과적합. 로지스틱 회귀(범주 종속). AIC/BIC로 모델 선택.",
      map: [
        { as: "잔차 최소 직선", real: "최소제곱법", note: "" },
        { as: "설명력 0~1", real: "결정계수 R²", note: "" },
        { as: "잔차 정규·등분산", real: "회귀 가정", note: "" },
        { as: "변수 간 상관 문제", real: "다중공선성(VIF)", note: "" },
      ],
      usage: "예측·인과 분석의 기본입니다. 시험은 최소제곱·R², 가정, 다중공선성입니다.",
      links: [
        { topic: "연관성 분석(association analysis) - 기초통계", how: "상관을 예측 모델로 확장합니다." },
        { topic: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)", how: "회귀 모델 선택 기준입니다." },
      ],
      exam: "회귀분석은 독립변수로 종속변수를 최소제곱법으로 예측·설명하는 모델로 R²로 설명력을 평가하며, 선형성·등분산성 등 가정과 다중공선성을 점검한다.",
    }, image: "/concept/book/st-regression.png", easy: "특정 변수(독립변수)가 다른 변수(종속변수)에 어떤 영향을 미치는지 수학적 모형 y=ax+bx+…+c로 설명·예측하는 기법입니다. 회귀선은 보통 최소제곱법으로 구합니다. 가정 [선정독등공]이 시험 최다 출제 — (1)선형성(독립·종속변수가 선형 관계), (2)잔차 정규성(잔차 기댓값 0, 정규분포), (3)잔차 독립성(관측치 간 상관관계 없음), (4)잔차 등분산성(잔차 분산이 일정), (5)다중 공선성 없음(독립변수끼리 상관 문제 없음 — 전진선택·후진소거·단계적 선택법으로 변수 선택). 1~4는 모두 만족해야 합니다. 유형 [단다일다선로공분 리라엘]: 단순/다중, 일변량/다변량, 선형/로지스틱, 공분산분석/분산분석, 리지·라쏘·엘라스틱넷. 평가: 결정계수 R²(설명력), AIC/BIC(복잡성 고려), p-value(유의성), 잔차 분석(오차진단)." },
"st-aic-bic": {
    guide: {
      hook: "'설명력과 단순함의 균형'으로 최적 모델을 고르는 두 정보 기준입니다.",
      scene: "변수를 많이 넣으면 데이터에 잘 맞지만 과적합됩니다. AIC·BIC는 모델의 적합도에 '복잡도 벌점'을 매겨, 가장 균형 잡힌 모델을 고르게 합니다. 값이 작을수록 좋습니다.",
      why: "'적합도 − 복잡도 벌점'과 AIC vs BIC의 차이(BIC가 더 엄격)가 출제 핵심입니다. 과적합 방지가 포인트입니다.",
      mechanism: "AIC = 2k − 2ln(L) (k=파라미터 수, L=우도): 적합도(우도)와 복잡도(k) 절충, 예측 정확도 지향. BIC = k·ln(n) − 2ln(L) (n=표본 수): 표본 크기를 벌점에 반영해 AIC보다 파라미터에 더 큰 벌점(더 단순한 모델 선호), 참 모델 식별 지향. 둘 다 작을수록 좋음. 여러 모델 비교 시 사용. 과적합(복잡)↔과소적합(단순) 균형.",
      map: [
        { as: "적합도 − 복잡도 벌점", real: "정보 기준", note: "작을수록 좋음" },
        { as: "예측 정확도 지향", real: "AIC", note: "" },
        { as: "더 엄격한 벌점", real: "BIC", note: "단순 선호" },
        { as: "과적합 방지", real: "모델 선택", note: "" },
      ],
      usage: "모델 선택·변수 선택입니다. 시험은 AIC/BIC 공식·차이, 과적합 방지입니다.",
      links: [
        { topic: "회귀분석(Regression Analysis)", how: "회귀 모델 선택에 씁니다." },
        { topic: "시계열분석", how: "ARIMA 차수 선택에 활용됩니다." },
      ],
      exam: "AIC·BIC는 적합도에 복잡도 벌점을 더해 최적 모델을 고르는 기준으로 값이 작을수록 좋으며, BIC가 표본 크기를 반영해 AIC보다 단순한 모델을 선호한다.",
    }, image: "/concept/book/st-aic-bic.png", easy: "모델이 데이터에 얼마나 잘 맞는지(적합도)와 얼마나 복잡한지(변수 개수)를 함께 따져 '가장 좋은 모델'을 고르는 지표 — 둘 다 작을수록 좋은 모델입니다. AIC = −2log(likelihood) + 2p — 앞부분이 적합도(우도가 클수록 작아짐), 뒷부분이 변수 개수 p에 대한 패널티. BIC = −2log(likelihood) + log(n)p — 표본 크기 n을 반영해 패널티를 키운 버전입니다. 비교가 시험 포인트: n이 8보다 크면 2p < log(n)p가 성립하므로 BIC가 변수 개수에 더 민감합니다. 결과적으로 AIC는 패널티가 약해 복잡한 모델을 고르고(예측 성능 중심, 과적합 위험), BIC는 패널티가 강해 단순한 모델을 고릅니다(모델의 진실성 중심). 2025.06 ITPE 모의고사 기출." },
"st-hypothesis-test": {
    guide: {
      hook: "'어떤 주장이 통계적으로 유의한지'를 검정하는 절차 — 귀무가설을 기각하느냐입니다.",
      scene: "'새 약이 효과 있다'를 증명하려면, 먼저 '효과 없다(귀무가설)'를 세우고, 데이터가 이를 뒤집을 만큼 강한지 봅니다. p값이 유의수준보다 작으면 귀무가설을 기각해 '효과 있다'고 결론합니다.",
      why: "귀무/대립가설, p값·유의수준, 1종·2종 오류가 출제 핵심입니다. '기각 못 함 ≠ 참'이 포인트입니다.",
      mechanism: "절차: 귀무가설 H0(차이 없음)·대립가설 H1 설정 → 유의수준 α(보통 0.05) 결정 → 검정통계량 계산 → p값(H0가 참일 때 관측값 이상 나올 확률) 산출 → p<α면 H0 기각, 아니면 기각 못 함. 오류: 1종 오류(α — H0가 참인데 기각, 위양성), 2종 오류(β — H0가 거짓인데 채택), 검정력=1−β. 단측/양측 검정. t·Z·카이제곱·F 검정.",
      map: [
        { as: "차이 없다 가정", real: "귀무가설 H0", note: "" },
        { as: "관측 이상 나올 확률", real: "p값", note: "<α면 기각" },
        { as: "참인데 기각", real: "1종 오류(α)", note: "위양성" },
        { as: "거짓인데 채택", real: "2종 오류(β)", note: "" },
      ],
      usage: "실험·A/B 테스트·연구 검증입니다. 시험은 H0/H1, p값·α, 1종/2종 오류입니다.",
      links: [
        { topic: "추론 통계(Inferential Statistics)", how: "추론의 검정 축입니다." },
        { topic: "ANOVA(Analysis of variance)", how: "여러 집단 평균 비교 검정입니다." },
      ],
      exam: "가설검정은 귀무가설을 세우고 p값이 유의수준보다 작으면 기각하는 절차로, 1종 오류(위양성 α)·2종 오류(β)가 있으며 기각 못 함이 참을 뜻하진 않는다.",
    }, image: "/concept/book/st-hypothesis-test.png", easy: "표본에서 얻은 사실로 모집단에 대한 가설이 맞는지 통계적으로 판정하는 방법입니다. 두 가설의 관계가 핵심: 귀무가설 H₀(직접 검정 대상, '옳다'는 가정에서 시작 — 예: 교육자소득 ≤ 비교육자소득)와 대립가설 H₁(실제로 입증하고자 하는 새 주장 — 교육자소득 > 비교육자소득). 절차 6단계: 가설 설정 → 검정통계량 선택 → 유의수준(α) 결정 → 검정통계량 계산 → p값과 α 비교 → 기각/수용 결정. 판정 규칙: p-value ≤ 유의수준이면 귀무가설 기각(대립가설 채택). 오류 2종이 단골 — 제1종 오류(α): 귀무가설이 옳은데 기각할 확률 / 제2종 오류(β): 귀무가설이 거짓인데 기각 못할 확률. 둘은 상반되어(하나가 커지면 다른 게 작아짐) 보통 α를 기준으로 판단합니다." },
"st-anova": {
    guide: {
      hook: "'셋 이상 집단의 평균이 같은지'를 분산을 이용해 한 번에 검정합니다.",
      scene: "세 가지 교육법의 점수 평균이 다른지 보려고 t검정을 여러 번 하면 오류가 커집니다. ANOVA는 집단 간 분산과 집단 내 분산의 비(F값)로 '적어도 하나는 다르다'를 한 번에 검정합니다.",
      why: "'집단 간/내 분산 비(F검정)'와 다중 t검정 대비 이점, 사후검정이 출제 핵심입니다.",
      mechanism: "원리: 총변동 = 집단 간 변동(처리 효과) + 집단 내 변동(오차). F = 집단 간 분산 / 집단 내 분산 → 크면 집단 차이 유의. 여러 t검정은 1종 오류 누적 → ANOVA로 한 번에. 유형: 일원(One-way — 요인 1개), 이원(Two-way — 요인 2개·상호작용). 귀무가설 '모든 평균 같다' 기각 시, 어느 집단이 다른지는 사후검정(Tukey·Bonferroni). 가정: 정규성·등분산성·독립성.",
      map: [
        { as: "집단 간/내 분산 비", real: "F값", note: "크면 유의" },
        { as: "여러 t검정 오류 방지", real: "한 번에 검정", note: "이점" },
        { as: "요인 1개 vs 2개", real: "일원/이원 ANOVA", note: "" },
        { as: "어느 집단이 다른가", real: "사후검정(Tukey)", note: "" },
      ],
      usage: "여러 집단 평균 비교·실험 분석입니다. 시험은 F검정 원리, 다중 t검정 대비, 사후검정입니다.",
      links: [
        { topic: "통계적 가설검정(Hypothesis Testing)", how: "ANOVA는 평균 비교 검정입니다." },
        { topic: "회귀분석(Regression Analysis)", how: "ANOVA는 회귀의 특수형으로 연결됩니다." },
      ],
      exam: "ANOVA는 집단 간 분산과 집단 내 분산의 비(F값)로 셋 이상 집단의 평균이 같은지 한 번에 검정하며, 기각 시 사후검정으로 어느 집단이 다른지 확인한다.",
    }, image: "/concept/book/st-anova.png", easy: "독립적인 집단이 셋 이상일 때 집단 간 평균 차이가 통계적으로 유의미한지 F검정으로 판단하는 기법입니다(두 집단이면 t-검정). 조건 [정등독] — 정규성(모집단 분포가 모두 정규분포), 등분산성(집단 간 분산 동일), 독립성(독립변수 범주가 세 집단 이상). 예외: 빅데이터급이면 정규성 증명 예외, 분산비 4 이하면 등분산성 증명 예외. F검정량은 두 집단 샘플 분산의 비율로, 집단 간 분산 대비 집단 내 분산을 봅니다. 유형은 독립·종속변수 개수로 갈립니다 — One Way(독립 1·종속 1: 급여→생산성), Repeated Measures(같은 집단 반복 측정: 1·3·6개월 후), Two Way(독립 2: 급여+나이), Multi Way(독립 3개 이상), Multivariate ANOVA(종속 2개 이상: 급여→생산성+만족도)." },
// ─────────────── 4주차: 네트워크(NW) — 교재 슬라이드 + 쉬운 설명 ───────────────
"nw-transmission-coding": {
    guide: {
      hook: "데이터를 전송하기 전 '3번 옷을 갈아입히는' 부호화 — 압축·오류대비·전기신호화입니다.",
      scene: "원본 데이터를 그대로 못 보냅니다. 먼저 군더더기를 줄이고(소스 코딩=압축), 오류에 대비해 검사 정보를 붙이고(채널 코딩), 마지막으로 전선에 흐를 전기 신호 모양으로 바꿉니다(라인 코딩). 목적이 서로 다른 3단계입니다.",
      why: "세 코딩의 '목적 구분'이 출제 핵심입니다 — 소스(효율), 채널(신뢰), 라인(전송 매체 적합). 각각의 대표 기법이 포인트입니다.",
      mechanism: "소스 코딩(Source): 중복 제거로 데이터량 축소 — 허프만·LZ 등 압축. 채널 코딩(Channel): 오류 검출·정정 위해 잉여 비트 추가 — 해밍·CRC·FEC. 라인 코딩(Line): 비트를 전기·광 신호 파형으로 변환 — NRZ·맨체스터·4B/5B(동기·DC 균형·대역 고려). 순서: 소스→채널→라인.",
      map: [
        { as: "군더더기 줄이기", real: "소스 코딩(압축)", note: "효율" },
        { as: "오류 대비 검사 추가", real: "채널 코딩", note: "신뢰" },
        { as: "전선 신호로 변환", real: "라인 코딩", note: "매체 적합" },
        { as: "압축→검사→신호화", real: "3단계 순서", note: "" },
      ],
      usage: "통신 시스템 설계의 기초입니다. 시험은 3코딩 목적·대표기법 매핑입니다.",
      links: [
        { topic: "해밍코드(Hamming code)", how: "채널 코딩의 오류 정정 기법입니다." },
        { topic: "PCM(Pulse-Code Modulation)", how: "아날로그를 디지털로 바꾸는 소스 부호화입니다." },
      ],
      exam: "전송부호화는 압축하는 소스 코딩, 오류에 대비하는 채널 코딩, 전송 매체에 맞는 파형으로 바꾸는 라인 코딩의 3단계로, 목적이 각각 효율·신뢰·매체 적합이다.",
    }, image: "/concept/book/nw-transmission-coding.png", easy: "음성·영상 같은 아날로그 정보를 디지털로 바꿔 보낼 때 거치는 세 가지 코딩입니다. 송신 흐름: 아날로그신호 → A/D변환 → 소스코딩 → 채널코딩 → 변조 → 라인코딩 → 전송(수신은 역순). 소스 코딩(압축): 불필요·중복 정보를 제거해 전송량을 줄입니다 — 고정 길이(ASCII) vs 가변 길이(모스부호), 무손실(허프만·런렝스) vs 손실(JPEG·MPEG). 채널 코딩(오류제어): 전송 중 잡음으로 생기는 오류를 잡으려 일부러 잉여 비트를 덧붙입니다 — 100kbps 정보에 50kbps redundancy를 더해 150kbps로 보내고, 오류가 나면 FEC로 스스로 복원합니다(속도는 떨어지지만 신뢰도 확보). 라인 코딩: 0과 1의 디지털 데이터를 실제 전기 신호 파형으로 바꿉니다(unipolar·polar·bipolar) — 수신 측 동기 재생과 오류 검출이 목적입니다." },
"nw-pcm": {
    guide: {
      hook: "아날로그 소리를 디지털로 바꾸는 3단계 — 표본화·양자화·부호화입니다.",
      scene: "연속적인 목소리 파형을 컴퓨터가 다루려면 숫자로 바꿔야 합니다. 일정 간격으로 값을 집고(표본화), 그 값을 정해진 단계로 반올림하고(양자화), 그걸 0·1 비트로 적습니다(부호화). 전화·오디오 디지털화의 기본입니다.",
      why: "3단계와 나이퀴스트 정리(표본화 주파수 ≥ 2×최대 주파수), 양자화 잡음이 출제 핵심입니다.",
      mechanism: "표본화(Sampling): 나이퀴스트 정리에 따라 신호 최대 주파수의 2배 이상으로 표본 추출(전화 4kHz→8kHz 표본). 양자화(Quantization): 표본값을 유한 단계로 근사 → 양자화 오차(잡음) 발생, 비트 수↑면 잡음↓. 부호화(Encoding): 양자화 레벨을 이진 비트열로 변환. 전화망은 8kHz×8bit=64kbps.",
      map: [
        { as: "일정 간격 값 집기", real: "표본화(나이퀴스트)", note: "≥2×fmax" },
        { as: "정해진 단계로 반올림", real: "양자화", note: "양자화 잡음" },
        { as: "0·1 비트로 적기", real: "부호화", note: "" },
        { as: "전화 64kbps", real: "8kHz×8bit", note: "예시" },
      ],
      usage: "디지털 전화·오디오의 기본 방식입니다. 시험은 3단계, 나이퀴스트 정리, 양자화 잡음입니다.",
      links: [
        { topic: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)", how: "PCM은 소스 부호화의 아날로그→디지털 단계입니다." },
        { topic: "QAM(Quadrature Amplitude Modulation)", how: "디지털 신호를 반송파에 싣는 변조입니다." },
      ],
      exam: "PCM은 아날로그 신호를 표본화(나이퀴스트 2배)·양자화(양자화 잡음)·부호화의 3단계로 디지털화하는 방식으로, 전화망은 8kHz×8bit=64kbps를 쓴다.",
    }, image: "/concept/book/nw-pcm.png", easy: "아날로그 소리를 디지털로 바꾸는 가장 기본적인 방식 — CD 음원과 전화 음성이 이 원리입니다. 송신 3단계가 시험 핵심: ① 표본화(Sampling) — 연속 파형을 일정 간격으로 찍어 값을 뽑음(찍힌 펄스열이 PAM 신호) ② 양자화(Quantization) — 뽑은 값을 정해진 눈금(레벨)에 맞춰 이산 값으로 반올림, 양자화 레벨=2^n ③ 부호화(Encoding) — 그 값을 2진수 0·1로 표시. 수신은 재생 → 복호화 → 재구성(필터링)으로 되돌립니다. 나이퀴스트 정리가 반드시 나옵니다: 표본화 횟수 fs ≥ 2 × 최고주파수 fm — 최고 주파수의 2배 이상으로 찍어야 원신호를 복원할 수 있고, 부족하게 찍으면(under sampling) 앨리어싱이 생겨 엉뚱한 파형이 됩니다." },
"nw-qam": {
    guide: {
      hook: "'진폭'과 '위상' 두 축을 동시에 써서 한 신호에 더 많은 비트를 싣는 변조입니다.",
      scene: "진폭만 바꾸거나 위상만 바꾸면 표현 가능한 신호가 몇 개뿐입니다. QAM은 진폭과 위상을 함께 조합해 격자(성상도) 위 여러 점을 만들어, 한 심볼에 여러 비트를 실어 전송 효율을 높입니다.",
      why: "'진폭+위상 결합'과 성상도(Constellation), 그리고 '고차 QAM일수록 효율↑·잡음 취약↑'의 트레이드오프가 출제 핵심입니다.",
      mechanism: "직교하는 두 반송파(I: cos, Q: sin)의 진폭을 각각 조절해 합성 → 성상도 상의 점 하나가 한 심볼. 16-QAM(4bit/심볼), 64-QAM(6bit), 256-QAM(8bit)… 점이 많을수록 심볼당 비트↑(효율↑)지만 점 간격이 좁아 잡음·간섭에 취약(높은 SNR 필요). Wi-Fi·LTE·5G·케이블에서 채널 상태에 따라 적응적으로 차수 조절.",
      map: [
        { as: "진폭+위상 함께", real: "직교 반송파(I/Q) 결합", note: "" },
        { as: "격자 위 점 하나=한 심볼", real: "성상도", note: "" },
        { as: "점 많을수록 비트↑", real: "고차 QAM 효율↑", note: "16/64/256" },
        { as: "촘촘하면 잡음 취약", real: "SNR 요구↑", note: "트레이드오프" },
      ],
      usage: "Wi-Fi·LTE·5G·케이블 모뎀의 변조 방식입니다. 시험은 I/Q 결합, 성상도, 고차 QAM의 효율-잡음 트레이드오프입니다.",
      links: [
        { topic: "PCM(Pulse-Code Modulation)", how: "디지털화 이후 변조로 연결됩니다." },
        { topic: "QoS(Quality of Service)", how: "채널 상태에 따른 적응 변조와 연계됩니다." },
      ],
      exam: "QAM은 직교하는 두 반송파의 진폭·위상을 결합해 한 심볼에 여러 비트를 싣는 변조로, 고차 QAM일수록 효율이 높으나 잡음에 취약해 높은 SNR을 요구한다.",
    }, image: "/concept/book/nw-qam.png", easy: "반송파의 진폭과 위상을 '동시에' 바꿔 한 번에 여러 비트를 실어 보내는 변조 방식입니다 — PSK(위상만)에 진폭 변조를 더한 것. 성상도(Constellation Diagram)로 이해합니다: X축은 동위상 반송파(I), Y축은 구상 반송파(Q)이고, 평면 위의 점 하나가 심볼 하나입니다. 16QAM은 점이 16개라 1심볼=4비트(3가지 진폭 × 12가지 위상). 같은 원 위의 점들은 진폭이 같고 위상만 다르며, 같은 방향의 점들은 위상이 같고 진폭만 다릅니다. 계층적 변조(64QAM 예)가 응용 포인트: 심볼당 6비트 중 상위 2비트를 QPSK로 써서, 수신 상태가 좋으면 전체 64QAM 좌표를, 나쁘면 상위 2비트(QPSK)만 뽑아 중요한 정보라도 살립니다 — 디지털 TV 표준 DVB-T에 적용." },
"nw-ipv6": {
    guide: {
      hook: "IPv4 주소 고갈을 해결한 '128비트 주소' 차세대 인터넷 프로토콜입니다.",
      scene: "IPv4의 43억 개 주소는 이미 바닥났습니다. IPv6는 128비트로 사실상 무한한 주소(3.4×10^38)를 제공하고, 헤더를 단순화하고 자동 설정·보안을 내장해 IoT 시대를 대비합니다.",
      why: "IPv4 대비 개선점(주소 공간·헤더 단순화·자동설정·IPsec)과 표기법이 출제 핵심입니다. 전환 기술(듀얼스택·터널링)과 연결됩니다.",
      mechanism: "128비트 주소(16진수 8그룹, :: 로 0 생략). 개선: 고정 40B 헤더(옵션은 확장 헤더로 분리 → 라우팅 효율), NAT 불필요(주소 충분), SLAAC(무상태 자동 구성), IPsec 권장 내장, 흐름 라벨(QoS). 주소 유형: 유니캐스트·애니캐스트·멀티캐스트(브로드캐스트 폐지). 전환: 듀얼스택·터널링·NAT64.",
      map: [
        { as: "사실상 무한 주소", real: "128비트", note: "IPv4 고갈 해결" },
        { as: "고정 단순 헤더", real: "40B + 확장 헤더", note: "라우팅 효율" },
        { as: "자동 주소 설정", real: "SLAAC", note: "NAT 불필요" },
        { as: "브로드캐스트 없음", real: "애니캐스트·멀티캐스트", note: "" },
      ],
      usage: "IoT·차세대 인터넷의 기반입니다. 시험은 IPv4 대비 개선, 표기법, 전환 기술입니다.",
      links: [
        { topic: "IPv4와 IPv6 터널링", how: "IPv6 도입기의 전환 기술입니다." },
        { topic: "IoT Matter", how: "IP 기반 IoT가 IPv6를 활용합니다." },
      ],
      exam: "IPv6는 128비트 주소로 IPv4 고갈을 해결하고 고정 헤더·SLAAC 자동설정·IPsec 내장·브로드캐스트 폐지를 특징으로 하며, 듀얼스택·터널링으로 전환한다.",
    }, image: "/concept/book/nw-ipv6.png", easy: "IPv4의 32비트 주소가 바닥나면서 나온 128비트 차세대 주소체계로, 주소 고갈뿐 아니라 보안성·이동성 문제까지 함께 풀려고 만들었습니다. 기본 헤더는 40바이트 고정이고 필드 8개 [버터플파네호+송수] 순으로 외웁니다 — Version(4bit) / Traffic Class(8bit, 송신 우선순위) / Flow Label(20bit, QoS 서비스별 구분) / Payload Length(16bit) / Next Header(8bit, 다음 헤더 유형) / Hop Limit(8bit, IPv4의 TTL에 해당) / Source Address(128bit) / Destination Address(128bit). IPv4와 결정적으로 다른 점은 옵션을 헤더에 욱여넣지 않고 확장 헤더로 뒤에 붙인다는 것 — 그래서 기본 헤더가 단순·고정 길이가 되고 라우터 처리가 빨라집니다. 표기법 4단계도 자주 나옵니다: 16bit씩 8필드를 콜론으로 나눈 일반 16진수 → 앞자리 0을 지운 0 억제 → 연속된 0 필드를 ::로 접은 0 압축 → 마지막 32비트만 10진수로 쓰는 혼합 표기법(IPv4 호환 표기)." },
"nw-sliding-window": {
    guide: {
      hook: "'확인응답을 안 기다리고 여러 개를 미리 보내' 처리량을 높이는 흐름 제어 창(window)입니다.",
      scene: "한 개 보내고 응답 기다리고 또 보내면(정지-대기) 회선이 논다. 슬라이딩 윈도우는 창 크기만큼 미리 여러 개를 보내 놓고, 응답이 오는 대로 창을 밀어 계속 전송합니다. 네이글 알고리즘은 반대로 자잘한 패킷을 모아 보냅니다.",
      why: "'창 기반 파이프라이닝'과 흐름제어, 그리고 네이글(작은 패킷 병합)의 역할·부작용이 출제 포인트입니다.",
      mechanism: "슬라이딩 윈도우: 송신 창(미확인 전송 가능 범위)만큼 ACK 없이 연속 전송 → ACK 수신 시 창을 앞으로 슬라이드. 수신 창(rwnd)으로 흐름제어(수신 버퍼 보호). Go-Back-N·Selective Repeat와 결합. 네이글 알고리즘: 미확인 데이터가 있으면 작은 조각을 모아 한 번에 전송(작은 패킷 남발 방지) → 대화형 응답에선 지연 유발(Delayed ACK와 겹치면 지연 악화, TCP_NODELAY로 비활성).",
      map: [
        { as: "창만큼 미리 보내기", real: "슬라이딩 윈도우", note: "파이프라이닝" },
        { as: "응답 오면 창 밀기", real: "윈도우 슬라이드", note: "" },
        { as: "수신 버퍼 보호", real: "흐름제어(rwnd)", note: "" },
        { as: "작은 패킷 모아 보내기", real: "네이글 알고리즘", note: "지연 부작용" },
      ],
      usage: "TCP 흐름제어·성능 튜닝입니다. 시험은 창 기반 전송, 흐름제어, 네이글의 이점·부작용(TCP_NODELAY)입니다.",
      links: [
        { topic: "TCP 혼잡제어", how: "혼잡 윈도우와 함께 전송량을 결정합니다." },
        { topic: "TCP 와 UDP 비교", how: "TCP 흐름제어의 핵심 기법입니다." },
      ],
      exam: "슬라이딩 윈도우는 창 크기만큼 ACK 없이 연속 전송하고 응답에 따라 창을 밀어 처리량과 흐름제어를 달성하며, 네이글 알고리즘은 작은 패킷을 병합하나 대화형에선 지연을 유발한다.",
    }, image: "/concept/book/nw-sliding-window.png", easy: "둘 다 '보내는 양을 조절한다'는 점은 같지만 목적이 다릅니다 — Sliding Window는 수신 측이 감당할 만큼만 보내는 흐름제어, 네이글은 자잘한 패킷을 모아 보내는 부하 감소입니다. Sliding Window는 수신 측이 알려준 윈도우 크기만큼은 ACK를 기다리지 않고 미리 보낼 수 있게 해줍니다(Window num = Min(cwnd, rwnd) — 혼잡 윈도우와 수신 윈도우 중 작은 쪽). 윈도우 구간은 왼쪽부터 ACK 수신 완료 / ACK 미수신(전송됨) / 즉시 전송 가능 / ACK 후 전송 가능 네 칸이고, 경계가 움직이는 3가지 동작이 시험 포인트입니다: 열림(ACK 도착 → 오른쪽 경계가 오른쪽으로, 전송량 증가), 닫힘(전송 완료 ACK → 왼쪽 경계가 오른쪽으로), 축소(윈도우 크기 변경 → 오른쪽 경계가 왼쪽으로). 네이글은 1바이트짜리 패킷이 헤더 40바이트를 달고 날아가는 낭비를 막습니다 — ACK가 올 때까지 버퍼에 모았다가 한 번에 보내되, 수신 윈도우보다 보낼 게 크면 바로 보내고 더 보낼 데이터가 없으면 즉시 보냅니다." },
"nw-bgp": {
    guide: {
      hook: "인터넷 '자율 시스템(AS)들 사이'의 경로를 정하는 라우팅 프로토콜 — 인터넷의 척추입니다.",
      scene: "통신사·기업 같은 거대 네트워크(AS) 수만 개가 인터넷을 이룹니다. BGP는 이 AS들 사이에서 '어느 AS를 거쳐 목적지에 가는지' 경로를 교환합니다. 홉수가 아니라 정책(경제·계약)으로 경로를 고르는 게 특징입니다.",
      why: "'AS 간 경로벡터·정책 기반'이 출제 핵심입니다. OSPF(AS 내부)와의 구분, 경로 속성·보안(하이재킹)이 포인트입니다.",
      mechanism: "경로벡터(Path Vector): 목적지까지 거치는 AS 번호 목록(AS-PATH)을 교환 → 루프 방지(자기 AS 있으면 거부). eBGP(AS 간)·iBGP(AS 내부 전파). 경로 선택은 정책 속성(Local Preference·AS-PATH 길이·MED 등)으로, 최단이 아니라 정책 우선. TCP 179 위에서 동작. 취약: 인증 부재로 BGP 하이재킹(잘못된 경로 광고) → RPKI로 완화. 수렴 느림.",
      map: [
        { as: "AS 거쳐 가는 목록", real: "AS-PATH(경로벡터)", note: "루프 방지" },
        { as: "정책으로 경로 선택", real: "Local Pref·MED 등", note: "최단 아님" },
        { as: "AS 간 vs AS 내부", real: "eBGP/iBGP", note: "" },
        { as: "가짜 경로 광고", real: "BGP 하이재킹", note: "RPKI 완화" },
      ],
      usage: "인터넷 백본·ISP 라우팅입니다. 시험은 경로벡터·정책 기반, OSPF와의 구분, 하이재킹·RPKI입니다.",
      links: [
        { topic: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", how: "BGP는 AS 간 경로벡터 라우팅입니다." },
        { topic: "IPv6", how: "BGP가 IPv6 경로도 광고합니다." },
      ],
      exam: "BGP는 자율 시스템(AS) 간 경로를 AS-PATH 경로벡터로 교환하고 Local Preference·MED 등 정책으로 선택하는 라우팅 프로토콜로, 하이재킹에 취약해 RPKI로 보완한다.",
    }, image: "/concept/book/nw-bgp.png", easy: "AS(Autonomous System, 하나의 관리 주체가 운영하는 네트워크 덩어리 — 통신사 하나가 보통 AS 하나) 사이에서 경로 정보를 주고받는 프로토콜입니다. OSPF·RIP이 AS 안(Interior)에서 쓰는 것과 달리 BGP는 AS 밖(Exterior Gateway)을 담당합니다. 같은 AS 번호끼리 쓰면 iBGP, 다른 AS끼리 연결하면 eBGP입니다. 경로 선택 방식이 Path Vector — 거리(홉 수)가 아니라 '거쳐 온 AS 번호들의 목록'을 보고 판단합니다. 경로 속성 4개: Next-Hop(반드시 거쳐야 할 라우터 IP), Local Preference(밖으로 나가는 경로 우선순위, 기본값 100), AS-Path(경유 AS 목록 — 개수가 적을수록 짧은 경로로 선택), MED(인입 경로가 여럿일 때의 우선순위). 메시지 5종은 연결 수명 순서로 외우면 편합니다: Open(TCP 179번으로 이웃 맺기) → Update(경로 정보 교환·갱신) → Keepalive(살아있나 확인) → Route-Refresh(정보 재확인) → Notification(문제 발생·이웃 단절 통보)." },
"nw-wireless-charging": {
    guide: {
      hook: "선 없이 '전자기'로 전력을 전달하는 기술 — 자기유도·자기공진·전자기파 방식입니다.",
      scene: "폰을 패드에 올리면 충전되는 것은 코일 간 자기유도 덕입니다. 좀 떨어져도 되게 하려면 공진을, 멀리 보내려면 전자기파(RF)를 씁니다. 거리와 효율이 반비례하는 트레이드오프가 핵심입니다.",
      why: "3방식(자기유도·자기공진·전자기파)의 원리·거리·효율 비교가 출제 핵심입니다. Qi 표준·IoT 급전이 포인트입니다.",
      mechanism: "자기유도(Inductive — 코일 간 근접 자기결합, 수 mm~cm, 고효율, Qi 표준·스마트폰), 자기공진(Resonant — 같은 공진주파수 코일 간, 수십 cm, 다기기·위치 자유, 효율 중간), 전자기파(RF/Microwave — 원거리 방사, 수 m 이상, 저효율, IoT 센서·우주태양광). 거리↑면 효율↓. 안전(EMF)·정렬·발열이 과제.",
      map: [
        { as: "코일 밀착 충전", real: "자기유도(Qi)", note: "근접·고효율" },
        { as: "좀 떨어져도", real: "자기공진", note: "수십 cm" },
        { as: "멀리 방사", real: "전자기파(RF)", note: "원거리·저효율" },
        { as: "거리↑ 효율↓", real: "트레이드오프", note: "" },
      ],
      usage: "스마트폰·웨어러블·전기차·IoT 급전입니다. 시험은 3방식 원리·거리·효율 비교, Qi 표준입니다.",
      links: [
        { topic: "Passive WiFi", how: "에너지 하베스팅과 함께 배터리리스를 지향합니다." },
        { topic: "IoT Matter", how: "IoT 기기 급전과 연결됩니다." },
      ],
      exam: "무선 충전은 자기유도(근접·고효율·Qi)·자기공진(중거리·위치 자유)·전자기파(원거리·저효율) 방식으로 나뉘며, 전달 거리와 효율이 반비례하고 EMF·발열이 과제다.",
    }, image: "/concept/book/nw-wireless-charging.png", easy: "전선 없이 배터리를 채우는 기술로, 방식 3가지를 '거리와 효율의 맞바꿈'으로 보면 정리가 됩니다. 자기유도는 송신 코일에 전류를 흘려 만든 자기장이 수신 코일에 유도 전류를 만드는 방식 — 수 cm 근접형이지만 효율 75% 이상으로 가장 높고, 교통카드·스마트폰 충전패드가 이것입니다(표준 WPC). 자기공진(자기공명)은 두 코일의 공진 주파수를 똑같이 맞춰 에너지를 결합하는 방식 — 수 m까지 늘어나 이동성이 좋아지지만 효율은 40~60%로 떨어집니다(표준 A4WP). 전자기파는 전력을 마이크로파로 바꿔 안테나로 쏘는 방식 — 수 km까지 가고 고출력이지만 효율이 5% 이내이고 인체에 유해해서 위성·우주태양광 같은 데만 씁니다(ITU-R SG1). 시험에는 이 비교표가 그대로 나오니 거리(cm/m/km) ↑ 효율(75%/50%/5%) ↓ 라는 반비례 관계와, 인체유해성이 전자기파에만 있다는 점을 잡아두세요. 기타 방식으로 RF(비콘으로 위치 인지 후 집중 충전), 적외선, 초음파가 있습니다." },
"nw-cdn": {
    guide: {
      hook: "콘텐츠를 '사용자 가까운 서버에 미리 복제'해 빠르고 안정적으로 전달합니다.",
      scene: "원본 서버가 미국에 있으면 한국 사용자는 느립니다. CDN은 전 세계 엣지 서버에 콘텐츠(이미지·영상·JS)를 캐싱해 두고, 사용자를 가장 가까운 서버로 보내 지연을 줄이고 원본 부하를 낮춥니다.",
      why: "'엣지 캐싱·근접 전달'의 원리와 이점(지연↓·부하↓·가용성↑), 요청 라우팅(DNS·Anycast)이 출제 포인트입니다.",
      mechanism: "구성: 원본 서버 + 전 세계 엣지(PoP) 캐시 서버 + 요청 라우팅. 동작: 사용자 요청을 DNS 기반 또는 Anycast로 가까운 엣지로 유도 → 엣지에 캐시 있으면 즉시 응답(Cache Hit), 없으면 원본에서 가져와 캐싱(Miss). 정적 콘텐츠 캐싱이 기본, 동적 가속(TCP 최적화)·DDoS 완화·WAF도 제공. TTL·캐시 무효화로 신선도 관리.",
      map: [
        { as: "가까운 서버에 복제", real: "엣지 캐싱", note: "핵심" },
        { as: "제일 가까운 곳으로", real: "요청 라우팅(DNS/Anycast)", note: "" },
        { as: "있으면 즉시 응답", real: "Cache Hit", note: "" },
        { as: "원본 부하 감소", real: "오프로딩", note: "이점" },
      ],
      usage: "웹·영상 스트리밍·대규모 서비스 가속입니다. 시험은 엣지 캐싱, 요청 라우팅, 이점·캐시 관리입니다.",
      links: [
        { topic: "DNS(Domain Name System)", how: "DNS로 가까운 엣지로 유도합니다." },
        { topic: "DoS(Denial of Service)", how: "CDN이 DDoS 완화·흡수에 쓰입니다." },
      ],
      exam: "CDN은 콘텐츠를 전 세계 엣지 서버에 캐싱하고 DNS·Anycast로 사용자를 가까운 서버로 유도해 지연·원본 부하를 줄이는 전달망으로, DDoS 완화도 제공한다.",
    }, image: "/concept/book/nw-cdn.png", easy: "CDN은 콘텐츠를 미리 여러 지역의 캐시 서버(PoP)에 복제해 두고 사용자와 가장 가까운 곳에서 꺼내주는 콘텐츠 전송망입니다. 원 서버 한 곳에서만 내려주면 멀리 있는 사용자는 느리기 때문입니다. 동작 흐름 4단계가 시험 포인트 — ① 사용자가 CP 웹서버 접속 → ② CDN 서버 주소가 박힌 Embedded URL이 든 HTML을 받음 → ③ 사용자가 그 CDN 주소로 오브젝트 요청 → ④ CDN이 복제본을 전달. 구간 이름도 함께 외우세요: 사용자쪽부터 Last-mile / Middle-mile / First-mile입니다. 기술 요소 중 헷갈리는 쌍이 있습니다 — Global Server Load Balancing은 '전 세계 캐시 서버 중 어느 서버를 붙일까'를 고르는 것이고, Load Balancing은 고른 서버군 안에서 트래픽을 나누는 것, Request Routing은 부하를 보고 가장 인접한 캐시를 선택하는 방법입니다. Grid Delivery는 트래픽이 넘칠 때 사용자 PC를 작은 서버로 쓰는 P2P 방식입니다." },
"nw-net-neutrality": {
    guide: {
      hook: "ISP가 '모든 트래픽을 차별 없이' 다뤄야 한다는 원칙 — 기술이 아니라 정책 논쟁입니다.",
      scene: "통신사가 특정 서비스(경쟁 OTT)를 느리게 하거나 돈 받고 빠르게 해 주면 공정성이 깨집니다. 망 중립성은 콘텐츠·출발지·목적지에 따라 차별·차단·우선순위를 두지 말라는 원칙입니다. 반대로 망 투자 유인·QoS와 충돌하기도 합니다.",
      why: "'기술(QoS)과 정책(공정성)의 긴장'이 출제 포인트입니다. 3대 원칙(차단·스로틀·유료 우선 금지)과 찬반 논거가 핵심입니다.",
      mechanism: "핵심 원칙: 차단 금지(No Blocking), 대역 조절 금지(No Throttling), 유료 우선순위 금지(No Paid Prioritization). 찬성 논거: 인터넷 개방성·혁신·표현의 자유·공정 경쟁. 반대 논거: 망 투자 회수·트래픽 폭증 관리·QoS 필요(응급·자율주행). 5G 슬라이싱·제로레이팅이 새로운 쟁점. 국가별 규제 상이.",
      map: [
        { as: "차단하지 말 것", real: "No Blocking", note: "3원칙" },
        { as: "느리게 하지 말 것", real: "No Throttling", note: "" },
        { as: "돈 받고 우대 말 것", real: "No Paid Prioritization", note: "" },
        { as: "투자 유인·QoS와 충돌", real: "반대 논거", note: "긴장" },
      ],
      usage: "통신 규제·정책 논의입니다. 시험은 3원칙, 찬반 논거, 슬라이싱·제로레이팅 쟁점입니다.",
      links: [
        { topic: "QoS(Quality of Service)", how: "우선순위 기술과 중립성 원칙이 충돌합니다." },
        { topic: "네트워크 슬라이싱", how: "차등 제공이 중립성 논쟁을 일으킵니다." },
      ],
      exam: "망 중립성은 ISP가 트래픽을 차단·조절·유료 우선하지 말아야 한다는 원칙으로, 인터넷 개방성과 망 투자·QoS 필요성이 충돌하며 슬라이싱·제로레이팅이 새 쟁점이다.",
    }, image: "/concept/book/nw-net-neutrality.png", easy: "ISP(통신사)가 어떤 트래픽이든 내용·유형·단말기를 따지지 말고 똑같이 취급해야 한다는 원칙입니다. 넷플릭스 트래픽이 많다고 일부러 느리게 하거나 돈을 더 받고 빠르게 해주면 안 된다는 얘기입니다. 3대 원칙은 '무엇을 금지하는가'로 묶으면 외워집니다 — 비차별성 확립(트래픽 이용 차별 금지: CP·이용자 등급 차등 금지, 이용자 권리 보호, 단대단 선택권), 상호접속 허용(일방적 접근 차단 금지: 서비스 이용 보장, 컨텐츠 차단 금지, 합법적 트래픽 관리), 접근성 제공(자유로운 이용 허용: 정책 투명성, 디바이스 접근 보장). 국내 망 중립성 가이드라인('21.1.11)의 조문 4개도 함께 봐두세요: 투명성(제4조), 차단금지(제5조), 불합리한 차별 금지(제6조), 합리적인 트래픽 관리(제7조). 마지막 제7조가 예외 조항인데, 망 보안·안정성 확보나 일시적 혼잡 해소, 법령상 필요한 경우엔 통신사가 트래픽을 관리할 수 있습니다." },
"nw-ibn": {
    guide: {
      hook: "'무엇을 원하는지(의도)'만 말하면 망이 알아서 설정·검증·수정하는 자율 네트워킹입니다.",
      scene: "관리자가 라우터마다 일일이 명령을 치는 대신, '영업팀에 화상회의 우선순위를 보장하라'는 의도만 선언하면, 시스템이 이를 정책으로 변환·적용하고 실제로 지켜지는지 계속 검증합니다.",
      why: "'선언적 의도 → 자동 변환·검증'의 폐루프가 출제 핵심입니다. SDN·네트워크 지능과의 관계, 자율 운영이 포인트입니다.",
      mechanism: "폐루프 4단계: ①의도 수집·변환(비즈니스 의도를 네트워크 정책으로 번역) ②자동화된 구성(전체 망에 정책 배포 — SDN) ③상태 인지(실시간 텔레메트리로 망 상태 파악) ④검증·보증(의도가 실제 충족되는지 지속 확인, 어긋나면 자동 교정). AI/ML로 의도 해석·이상 대응. SDN의 프로그래머빌리티 위에서 동작.",
      map: [
        { as: "의도만 선언", real: "선언적 의도", note: "명령 대신" },
        { as: "정책으로 자동 변환", real: "의도 변환·구성", note: "" },
        { as: "지켜지는지 계속 확인", real: "검증·보증", note: "핵심" },
        { as: "어긋나면 자동 교정", real: "폐루프 자율", note: "" },
      ],
      usage: "차세대 네트워크 자동 운영입니다. 시험은 폐루프 4단계, 선언적 의도, SDN·네트워크 지능과의 관계입니다.",
      links: [
        { topic: "SDN(Software Defined Network)", how: "IBN이 SDN의 프로그래머빌리티 위에서 동작합니다." },
        { topic: "네트워크 지능", how: "IBN은 망 자율화의 운영 패러다임입니다." },
      ],
      exam: "인텐트 기반 네트워킹(IBN)은 비즈니스 의도를 정책으로 자동 변환·구성하고 실시간으로 충족을 검증·교정하는 폐루프 자율 네트워킹으로, SDN·AI 위에서 동작한다.",
    }, image: "/concept/book/nw-ibn.png", easy: "지금까지는 관리자가 '이 포트를 열어라, 이 경로로 보내라' 하고 장비마다 명령을 넣었다면, IBN은 '영업팀 화상회의는 끊기지 않게 해줘' 같은 의도(Intent)만 말하면 AI가 알아서 유·무선망 설정을 잡아주는 기술입니다. 핵심은 폐쇄 루프(Closed-Loop Intent Control) 순환입니다: 의도 입력 → Translation/Optimization이 High-level Policy로 번역 → Activation/Configuration이 Low-level Policy로 장비에 적용 → Infrastructure 동작 → Monitoring 데이터 수집 → Assurance가 의도대로 됐는지 검증 → Feedback으로 다시 번역 단계로 돌아감. 요건 4개(변환과 검증 / 자동 수행 / 상황 인식 / 동적인 최적화)가 이 루프의 각 구간과 그대로 대응합니다. 요즘은 의도 번역 단계에 LLM이 들어가 음성·텍스트 의도를 컴퓨터 스크립트로 바꿉니다. 앞서 본 '네트워크 지능'과 같은 폐쇄형 반복 제어 구조라는 점을 엮어두면 답안에서 쓸 데가 많습니다." },
"nw-sdr": {
    guide: {
      hook: "하드웨어로 고정하던 무선 처리를 '소프트웨어로' 바꿔 한 장비로 여러 규격을 지원합니다.",
      scene: "예전 무전기는 하드웨어가 특정 방식에 고정됐습니다. SDR은 변조·필터·복조를 소프트웨어로 처리해, 같은 장비로 소프트웨어만 바꿔 LTE·5G·Wi-Fi 등 다양한 규격을 다룰 수 있습니다.",
      why: "'하드웨어 → 소프트웨어 무선'의 유연성과 구조(RF 프론트엔드 + 디지털 처리)가 출제 포인트입니다. O-RAN·인지 무선의 기반입니다.",
      mechanism: "구조: 안테나·RF 프론트엔드(최소 하드웨어)에서 신호를 디지털로 변환(ADC/DAC) → 이후 변조·복조·필터링·인코딩을 프로그래머블 프로세서(FPGA·DSP·CPU) 소프트웨어로 처리. 이점: 다중 규격·대역 지원, 원격 업그레이드, 인지 무선(CR — 유휴 대역 탐지·적응)·군용·연구 활용. O-RAN vRAN의 기반 개념.",
      map: [
        { as: "무선 처리를 SW로", real: "소프트웨어 정의 무선", note: "핵심" },
        { as: "SW만 바꿔 규격 전환", real: "다중 규격 지원", note: "유연성" },
        { as: "최소 RF+디지털 처리", real: "RF 프론트엔드+DSP", note: "구조" },
        { as: "유휴 대역 적응", real: "인지 무선(CR)", note: "응용" },
      ],
      usage: "기지국·군용·연구·인지 무선입니다. 시험은 하드웨어 대비 유연성, 구조, O-RAN·CR과의 관계입니다.",
      links: [
        { topic: "O-RAN", how: "SDR이 vRAN·개방형 무선의 기반입니다." },
        { topic: "6G", how: "재구성 가능 무선 기술과 연결됩니다." },
      ],
      exam: "SDR은 변조·복조 등 무선 처리를 소프트웨어로 구현해 한 장비로 다중 규격·대역을 지원하는 기술로, 원격 업그레이드·인지 무선을 가능케 하며 vRAN의 기반이 된다.",
    }, image: "/concept/book/nw-sdr.png", easy: "SDR은 무선 특성(주파수 범위, 변조 방식, 무선 출력)을 소프트웨어로 바꿀 수 있게 만든 기술입니다. 예전 단말기는 이 특성이 하드웨어 칩에 박혀 있어 규격이 바뀌면 기기를 새로 사야 했습니다 — 소프트웨어만 업데이트하면 다른 통신 규격을 쓰는 단말이 됩니다. 개념도 비교가 핵심입니다: 기존 단말기는 기저대역부가 BBA(ADC/DAC) → MSM → CODEC 으로 하드웨어 블록이 줄줄이 나뉘어 있는데, SDR 단말기는 안테나에서 받은 신호를 ADC로 바로 디지털화한 뒤 그 블록 전체를 SDR 소프트웨어 하나가 처리합니다. 그래서 앞단 RF는 광대역 처리가 필요해집니다. 기술 요소는 4갈래 — 소자(A/D·D/A, 광대역 RF, Digital IF, FPGA/DSP), 소프트웨어(SCA 구조, 미들웨어, RTOS, XML/UML 기술언어), 통신(핸드오버, OTA 다운로드, 보안·인증), 시스템(HW/SW 플랫폼, 스마트 안테나)." },
"nw-sdwan": {
    guide: {
      hook: "SDN 원리를 WAN에 적용해 '여러 회선을 소프트웨어로 지능 관리'하는 기술입니다.",
      scene: "지사들이 값비싼 전용선(MPLS)에만 의존하던 것을, SD-WAN은 인터넷·LTE·MPLS 여러 회선을 함께 쥐고 트래픽을 애플리케이션별로 최적 경로에 자동 배분합니다. 클라우드 접속도 가깝게 최적화합니다.",
      why: "'MPLS 종속 탈피·앱 인지 라우팅'이라는 이점과 중앙 정책 제어가 출제 핵심입니다. SASE로의 확장이 포인트입니다.",
      mechanism: "SDN 원리(제어-데이터 분리)를 WAN에. 특징: 다중 회선 통합·본딩, 애플리케이션 인지 라우팅(중요 앱은 좋은 회선으로), 중앙 오케스트레이터로 정책 일괄 배포(Zero-touch 프로비저닝), 동적 경로 선택(회선 품질 실시간 반영), 암호화 터널(오버레이). 이점: 비용↓·클라우드 최적화·민첩성. 보안 결합 시 SASE로 확장.",
      map: [
        { as: "여러 회선 함께 쥐기", real: "다중 회선 통합", note: "MPLS 탈피" },
        { as: "앱별 최적 경로", real: "애플리케이션 인지 라우팅", note: "핵심" },
        { as: "중앙에서 정책 배포", real: "오케스트레이터", note: "Zero-touch" },
        { as: "보안 결합 확장", real: "SASE", note: "" },
      ],
      usage: "기업 WAN·지사 연결·클라우드 접속입니다. 시험은 MPLS 대비 이점, 앱 인지 라우팅, SASE와의 관계입니다.",
      links: [
        { topic: "SDN(Software Defined Network)", how: "SD-WAN은 SDN의 WAN 응용입니다." },
        { topic: "SASE(Secure Access Service Edge)", how: "SD-WAN에 보안을 결합한 확장입니다." },
      ],
      exam: "SD-WAN은 SDN 원리를 WAN에 적용해 인터넷·MPLS 등 다중 회선을 애플리케이션 인지 라우팅으로 최적 배분하고 중앙에서 정책을 제어하며, 보안 결합 시 SASE로 확장된다.",
    }, image: "/concept/book/nw-sdwan.png", easy: "SDN이 데이터센터·사옥 안(LAN)에서 제어와 전송을 분리한 기술이라면, SD-WAN은 그 방식을 지사와 본사를 잇는 WAN 구간으로 끌고 나온 것입니다. 기존에는 비싼 MPLS 전용회선 하나에 의존했는데, SD-WAN은 MPLS와 일반 인터넷 회선을 동시에 묶어놓고 소프트웨어가 상황에 맞춰 골라 씁니다. 장비는 둘 — SD-WAN Controller(중앙에서 정책·QoS 설정, 토폴로지 관리, 성능 보고)와 각 지점의 SD-WAN CPE(=SD-WAN Edge, 오버레이 터널을 만들고 방화벽·암호화·WAN 최적화 수행). 시험에 나오는 건 트래픽 제어 5종입니다: Dynamic Path Switching(경로 성능이 나빠지면 다른 경로로 갈아탐), Packet Duplication(중요 패킷은 여러 경로로 중복 전송해 유실 대비), Link Aggregation(여러 물리 회선을 논리적 하나로 묶어 대역폭 확장), Network Segmentation(VLAN으로 논리 분리, 세그먼트 간 통신은 방화벽 경유), Traffic Steering(애플리케이션별로 경로를 따로 지정)." },
"nw-openflow": {
    guide: {
      hook: "SDN 컨트롤러가 '스위치의 전달 규칙(플로우)을 직접 설치'하는 사우스바운드 프로토콜입니다.",
      scene: "SDN에서 중앙 두뇌(컨트롤러)가 각 스위치에게 '이런 패킷은 저리로 보내라'는 규칙표(플로우 테이블)를 내려 줍니다. 오픈플로우는 그 명령을 전달하는 표준 규약으로, SDN을 실제로 동작하게 하는 핵심입니다.",
      why: "'SDN 제어-데이터 평면 간 표준 인터페이스'라는 위치와 플로우 테이블(매치-액션) 구조가 출제 핵심입니다.",
      mechanism: "구조: 스위치의 플로우 테이블 = 여러 플로우 엔트리(Match 필드 + Action + Counter). 패킷 도착 → 플로우 테이블 매칭 → 일치 액션(전달·드롭·수정·컨트롤러로 전송) 수행 → 미일치면 컨트롤러에 문의(Packet-In) → 컨트롤러가 규칙 설치(Flow-Mod). 파이프라인(다중 테이블)·그룹 테이블 지원. 컨트롤러가 망 전체 플로우를 프로그래밍.",
      map: [
        { as: "패킷 처리 규칙표", real: "플로우 테이블", note: "" },
        { as: "조건+동작", real: "Match-Action 엔트리", note: "핵심 구조" },
        { as: "모르면 두뇌에 문의", real: "Packet-In", note: "" },
        { as: "규칙 설치", real: "Flow-Mod", note: "컨트롤러→스위치" },
      ],
      usage: "SDN 구현의 표준 프로토콜입니다. 시험은 SDN 사우스바운드 위치, 플로우 테이블(Match-Action), Packet-In/Flow-Mod입니다.",
      links: [
        { topic: "SDN(Software Defined Network)", how: "오픈플로우가 SDN의 제어-데이터 인터페이스입니다." },
        { topic: "SD-WAN(Software Defined-Wide Area Network)", how: "SDN 원리의 WAN 응용입니다." },
      ],
      exam: "오픈플로우는 SDN 컨트롤러가 스위치의 플로우 테이블(Match-Action)을 제어하는 사우스바운드 프로토콜로, Packet-In으로 문의하고 Flow-Mod로 규칙을 설치한다.",
    }, image: "/concept/book/nw-openflow.png", easy: "SDN이 '제어와 전송을 분리하자'는 개념이라면, 오픈플로우는 그 둘을 실제로 잇는 표준 인터페이스 규격입니다 — 즉 SDN 컨트롤러가 스위치에게 명령을 내리는 공용 언어입니다. 스위치 쪽 3대 구성요소: OpenFlow Channel(컨트롤러↔스위치 관리 인터페이스), Flow Table(패킷 처리 규칙 모음), Group Table(여러 동작을 묶은 실행 집합). Flow Table이 핵심인데, 각 Flow entry는 match fields(어떤 패킷에 해당하나) + counters(통계) + instructions(맞으면 뭘 하나) 세 조각으로 되어 있고, 테이블 여러 개를 차례로 거치는 파이프라인(Pipelining)으로 처리합니다. 프로토콜 메시지 3종도 방향으로 외우면 쉽습니다 — Controller-to-Switch(컨트롤러가 시작, 상태 확인·제어), Asynchronous(스위치가 시작, 상태 변경 보고), Symmetric(양쪽 다 시작 가능, 요청 없이 전송)." },
"nw-iot-matter": {
    guide: {
      hook: "브랜드가 달라도 '스마트홈 기기가 서로 통하게' 하는 IoT 통합 표준입니다.",
      scene: "예전엔 애플·구글·아마존 생태계가 갈려 기기 호환이 안 됐습니다. Matter는 이들이 함께 만든 공통 표준으로, 어느 앱·허브에서도 인증받은 스마트홈 기기를 제어할 수 있게 합니다.",
      why: "'생태계 파편화 해소·상호운용'이라는 목적과 기반 기술(IP·Thread)이 출제 포인트입니다. CSA 표준·멀티 어드민이 핵심입니다.",
      mechanism: "CSA(Connectivity Standards Alliance) 표준. 특징: IP 기반(모든 기기가 IP로 통신), 전송으로 Wi-Fi·Ethernet·Thread(저전력 메시) 사용, BLE로 초기 커미셔닝. 멀티 어드민(한 기기를 여러 생태계에서 동시 제어), 로컬 제어(클라우드 없이도 동작), 보안(인증·암호화). 애플 HomeKit·구글·아마존·삼성 지원. Thread 메시로 저전력 기기 확장.",
      map: [
        { as: "브랜드 달라도 호환", real: "상호운용 표준", note: "파편화 해소" },
        { as: "모두 IP로 통신", real: "IP 기반", note: "" },
        { as: "저전력 메시", real: "Thread", note: "전송" },
        { as: "여러 생태계 동시 제어", real: "멀티 어드민", note: "" },
      ],
      usage: "스마트홈 기기 통합입니다. 시험은 상호운용 목적, IP·Thread 기반, 멀티 어드민입니다.",
      links: [
        { topic: "Passive WiFi", how: "저전력 IoT 통신 축을 공유합니다." },
        { topic: "IoT Matter", how: "동일 주제 서브노트입니다." },
      ],
      exam: "Matter는 CSA의 IP 기반 스마트홈 통합 표준으로 Wi-Fi·Thread를 전송으로 쓰며, 멀티 어드민·로컬 제어로 생태계 파편화를 해소해 브랜드 간 상호운용을 보장한다.",
    }, image: "/concept/book/nw-iot-matter.png", easy: "스마트홈 기기가 제조사마다 규격이 달라 서로 연동이 안 되던 문제를 풀려고 CSA(Connectivity Standards Alliance)가 만든 IoT 통합 표준입니다. 핵심 아이디어는 'IP 기반 응용계층 표준' — 아래쪽 무선 방식은 각자 쓰던 걸 그대로 두고, 위에 IP(IPv6)와 공통 응용 계층(Matter)을 얹어 통일합니다. 스택을 아래에서 위로 읽으면: Radio는 802.11(Wi-Fi)과 802.15.4(Thread) 두 갈래, 그 위 Network는 IPv6로 합쳐지고, Transport는 TCP/IP(신뢰성)와 UDP(대량 전송), 맨 위가 Matter입니다. BLE는 옆으로 빠진 별도 스택인데 통신용이 아니라 기기 최초 등록(provisioning) 전용입니다. Wi-Fi와 Thread를 나눠 쓰는 이유가 시험 포인트 — Wi-Fi는 동영상 같은 고속 통신용, Thread는 메쉬로 SPOF를 막고(최대 64개 라우터) 배터리로 도는 저전력 기기용입니다." },
// ── 5주차 데이터베이스(DB) ──
"db-transaction": {
    guide: {
      hook: "쪼갤 수 없는 '하나의 일 묶음' — 계좌이체처럼 전부 되거나 전부 안 되어야 하는 작업 단위입니다.",
      scene: "A에서 B로 송금은 '출금 + 입금' 두 동작이지만, 출금만 되고 입금이 실패하면 돈이 증발합니다. 트랜잭션은 이 둘을 한 묶음으로 묶어 '둘 다 성공(Commit)'하거나 '둘 다 취소(Rollback)'만 허용합니다.",
      why: "ACID 4속성이 DB의 신뢰성 근간이라 모든 동시성·회복 이론의 출발점입니다. 원자성·일관성·격리성·지속성 각각을 무엇이 보장하는지가 출제 핵심입니다.",
      mechanism: "ACID: 원자성(All-or-Nothing — 회복 관리자·로그로 보장), 일관성(제약조건 유지), 격리성(동시 실행이 순차 실행처럼 — 동시성 제어로 보장), 지속성(Commit 후 장애에도 유지 — 로그·백업). 상태: 활동→부분완료→완료(Commit) 또는 실패→철회(Rollback).",
      map: [
        { as: "출금+입금 한 묶음", real: "트랜잭션 단위", note: "" },
        { as: "둘 다 되거나 둘 다 취소", real: "원자성(Atomicity)", note: "로그·회복" },
        { as: "동시에 해도 안 꼬임", real: "격리성(Isolation)", note: "동시성 제어" },
        { as: "커밋 후엔 안 사라짐", real: "지속성(Durability)", note: "로그·백업" },
      ],
      usage: "은행·예약·재고 등 모든 정합성이 중요한 시스템의 기본입니다. 시험은 ACID 4속성 각각의 보장 수단과 상태 전이도입니다.",
      links: [
        { topic: "DB 회복기법", how: "원자성·지속성을 로그로 보장하는 방법입니다." },
        { topic: "DB 동시성제어", how: "격리성을 실현하는 기법입니다." },
      ],
      exam: "트랜잭션은 원자성·일관성·격리성·지속성(ACID)을 만족하는 작업 단위로, 회복기법이 원자성·지속성을, 동시성 제어가 격리성을 보장한다.",
    }, image: "/concept/book/db-transaction.png", easy: "트랜잭션은 데이터베이스에서 하나의 논리적 작업 단위로 묶여 전부 수행되거나 전부 취소되어야 하는 연산 묶음입니다. 계좌이체가 대표 예 — '내 계좌에서 빼기'와 '상대 계좌에 넣기'는 반드시 둘 다 되거나 둘 다 안 돼야 합니다. 특징 4개가 ACID — 원자성(All or Nothing, 회복기법이 보장), 일관성(끝나면 모순 없는 상태, 무결성 제약·동시성 제어가 보장), 고립성(실행 중간 결과를 남이 못 봄, Locking), 영속성(완료 결과는 영구 저장, 회복기법). 상태전이도 [활부완실천]도 시험 단골입니다 — 활동(Active) → 부분 완료(마지막 명령문 실행 후) → 완료(Committed), 실패하면 실패(Failed) → 철회(Aborted, 시작 전 상태로 환원). '부분 완료'가 커밋 직전 상태라는 점이 헷갈림 포인트입니다." },
"db-isolation-level": {
    guide: {
      hook: "'동시성을 얼마나 허용할지'를 4단계로 조절하는 다이얼 — 성능과 정확성의 트레이드오프입니다.",
      scene: "격리를 느슨하게 하면 빠르지만 남의 미완성 데이터를 읽는 사고가 나고, 엄격하게 하면 정확하지만 느립니다. 4단계로 '어떤 이상 현상까지 허용할지'를 고릅니다.",
      why: "3대 이상현상(Dirty·Non-repeatable·Phantom Read)과 4레벨의 대응이 출제 핵심입니다. 레벨이 높아질수록 어떤 현상이 차단되는지 매핑이 단골입니다.",
      mechanism: "이상현상: Dirty Read(미완료 데이터 읽음), Non-repeatable Read(같은 행 재조회 시 값 변함), Phantom Read(같은 조건 재조회 시 행 수 변함). 레벨: Read Uncommitted(모두 허용)→Read Committed(Dirty 차단)→Repeatable Read(Non-repeatable 차단)→Serializable(Phantom까지 차단, 완전 직렬화). 높을수록 잠금↑·성능↓.",
      map: [
        { as: "미완성 데이터 읽기", real: "Dirty Read", note: "Read Committed가 차단" },
        { as: "같은 행 값이 바뀜", real: "Non-repeatable Read", note: "Repeatable Read가 차단" },
        { as: "행이 생기거나 사라짐", real: "Phantom Read", note: "Serializable이 차단" },
        { as: "성능↔정확성 다이얼", real: "4단계 격리 레벨", note: "트레이드오프" },
      ],
      usage: "DB 성능 튜닝의 핵심 설정입니다. 시험은 3이상현상×4레벨 매핑표입니다.",
      links: [
        { topic: "트랜잭션", how: "격리성(I)의 세부 수준을 정합니다." },
        { topic: "MVCC(다중 버전 동시성 제어) 2가지 유형", how: "잠금 없이 격리를 구현하는 방식입니다." },
      ],
      exam: "격리 레벨은 Read Uncommitted·Committed·Repeatable Read·Serializable 4단계로, 레벨이 오를수록 Dirty·Non-repeatable·Phantom Read를 차례로 차단하며 성능과 상충한다.",
    }, image: "/concept/book/db-isolation-level.png", easy: "격리 레벨은 동시에 실행되는 트랜잭션 사이의 고립 정도를 4단계 중에서 고르는 설정입니다. 고립성을 칼같이 지키면(Serializable) 안전하지만 동시성이 줄어 느려지므로, '어느 정도 부정합을 감수하고 동시성을 벌 것인가'를 고르는 것입니다 [언커리씨] — Read Uncommitted(커밋 안 된 것도 읽음), Read Committed(커밋된 것만), Repeatable Read(같은 쿼리 두 번 결과 보장), Serializable(완전 직렬화). 아래로 갈수록 고립성↑ 동시성↓. 각 레벨이 막는 이상현상 3종 [DNP 부비가]과 짝지어야 합니다 — Dirty Read(부정판독: 커밋 전 데이터를 읽음), Non-Repeatable Read(비반복판독: 두 번 읽는 사이 남이 수정·삭제), Phantom Read(가상판독: 없던 행이 나타남). 표에서 '레벨이 하나 오를 때마다 위에서부터 하나씩 불가능해진다'로 외우면 됩니다." },
"db-ansi-sparc": {
    guide: {
      hook: "DB를 3층으로 나눠, '한 층을 바꿔도 다른 층이 안 흔들리게' 만드는 구조입니다.",
      scene: "건물을 사용자 눈에 보이는 인테리어(외부)·설계도(개념)·기초 배관(내부)으로 나누면, 인테리어를 바꿔도 기초는 그대로입니다. DB도 3단계로 나눠 저장 방식이 바뀌어도 응용은 안 고치게 만듭니다.",
      why: "3단계와 '2가지 데이터 독립성'의 대응이 핵심입니다. 논리적 독립성·물리적 독립성이 각각 어느 계층 간 변화를 흡수하는지가 출제 포인트입니다.",
      mechanism: "3단계: 외부 스키마(사용자·응용별 뷰), 개념 스키마(전체 논리 구조·통합 뷰), 내부 스키마(물리적 저장 구조). 독립성: 논리적 독립성(개념 스키마 변경이 외부 스키마·응용에 영향 없음), 물리적 독립성(내부 스키마 변경이 개념 스키마에 영향 없음). 사상(mapping)이 계층을 연결.",
      map: [
        { as: "사용자별 인테리어", real: "외부 스키마(뷰)", note: "" },
        { as: "전체 설계도", real: "개념 스키마", note: "통합 논리 구조" },
        { as: "기초 배관", real: "내부 스키마", note: "물리 저장" },
        { as: "설계 바꿔도 응용 그대로", real: "논리적 독립성", note: "개념↔외부" },
      ],
      usage: "DB 설계·유지보수의 기본 원리입니다. 시험은 3스키마와 논리·물리 독립성 대응입니다.",
      links: [
        { topic: "데이터베이스 모델링", how: "개념→논리→물리 설계 단계와 대응됩니다." },
        { topic: "데이터 독립성", how: "이 구조가 제공하는 핵심 이점입니다." },
      ],
      exam: "ANSI/SPARC 모델은 외부·개념·내부 3단계 스키마로 DB를 분리해, 개념 변경을 응용이 흡수하는 논리적 독립성과 물리 변경을 개념이 흡수하는 물리적 독립성을 제공한다.",
    }, image: "/concept/book/db-ansi-sparc.png", easy: "DB를 보는 눈높이를 3층으로 나눈 표준 구조입니다 [외개내] — 외부 스키마(사용자·응용 프로그램마다 다른 뷰), 개념 스키마(조직 전체의 논리적 구조, 통합 관점), 내부 스키마(디스크에 실제로 저장되는 물리적 방법). 층을 나눈 이유가 데이터 독립성입니다. 논리적 독립성 — 개념 스키마(테이블 구조)가 바뀌어도 외부 스키마(응용 화면)는 안 바뀌게. 물리적 독립성 — 내부 스키마(저장 방식·인덱스)가 바뀌어도 개념·외부는 안 바뀌게. 층 사이를 잇는 것이 사상(Mapping)인데, 외부/개념 사상은 응용 인터페이스, 개념/내부 사상은 저장 인터페이스입니다. '아래층을 갈아엎어도 위층이 모르게'가 이 구조의 존재 이유입니다." },
"db-modeling": {
    guide: {
      hook: "현실 세계를 DB 테이블로 옮기는 3단계 설계 — 개념→논리→물리입니다.",
      scene: "집을 지을 때 대략 스케치(개념)→상세 도면(논리)→시공 명세(물리) 순으로 구체화하듯, DB도 무엇을 저장할지 개념부터 잡고 점점 실제 테이블로 내려갑니다.",
      why: "3단계 산출물(ERD·관계 스키마·물리 스키마)과 각 단계의 결정사항이 출제 핵심입니다. 정규화·역정규화가 어느 단계에서 일어나는지가 포인트입니다.",
      mechanism: "개념 모델링: 엔티티·관계·속성 식별 → ERD(업무 중심, DBMS 독립). 논리 모델링: ERD를 관계 스키마로 변환, 정규화로 이상 제거, 키·제약 정의(DBMS 독립적 관계 모델). 물리 모델링: 실제 DBMS에 맞춰 테이블·인덱스·파티션·자료형 결정, 성능 위해 역정규화 검토.",
      map: [
        { as: "대략 스케치", real: "개념 모델링(ERD)", note: "업무 중심" },
        { as: "상세 도면", real: "논리 모델링(정규화)", note: "관계 스키마" },
        { as: "시공 명세", real: "물리 모델링", note: "테이블·인덱스·역정규화" },
        { as: "점점 구체화", real: "3단계 추상화", note: "" },
      ],
      usage: "모든 DB 구축의 설계 프로세스입니다. 시험은 3단계 산출물과 정규화·역정규화의 위치입니다.",
      links: [
        { topic: "데이터베이스 정규화(Normalization)", how: "논리 모델링 단계의 핵심 작업입니다." },
        { topic: "엔티티(Entity)", how: "개념 모델링의 기본 구성요소입니다." },
      ],
      exam: "데이터베이스 모델링은 개념(ERD)·논리(정규화된 관계 스키마)·물리(테이블·인덱스) 3단계로 현실을 DB로 옮기는 설계로, 정규화는 논리·역정규화는 물리 단계에서 다룬다.",
    }, image: "/concept/book/db-modeling.png", easy: "현실의 업무를 컴퓨터에 넣을 수 있는 데이터 구조로 바꿔 가는 과정입니다. 개념도 그대로 — 현실 세계(개체) → 개념적 구조 → 논리적 구조 → 저장 DB. 원칙 3개 [커상논]: 커뮤니케이션(모두가 이해할 모델), 상세화(최소 공통 분모로 분할·중복 제거), 논리적 표현(비즈니스를 그대로 반영). 단계 [개논물]가 핵심 — 개념 모델링(주제 영역 → 후보 Entity → 핵심 Entity → 관계 정의 [주후핵관]), 논리 모델링(속성 정의 → Entity 상세화(정규화·M:M 해소) → 이력 관리 [속엔이]), 물리 모델링(환경 조사 → 논리모델 변환 → 반정규화 [물논반]). '정규화는 논리 단계, 반정규화는 물리 단계'가 시험 포인트입니다." },
"db-integrity": {
    guide: {
      hook: "'DB에 들어갈 자격 없는 데이터'를 막는 규칙 — 데이터의 정확성·일관성을 지킵니다.",
      scene: "학번 없는 학생, 존재하지 않는 학과 코드, 중복된 주민번호가 들어오면 DB가 오염됩니다. 무결성 제약은 이런 잘못된 데이터의 입력·수정·삭제를 애초에 거부합니다.",
      why: "4대 무결성(개체·참조·도메인·사용자정의)의 구분과 각각이 막는 것이 출제 핵심입니다. 특히 참조 무결성의 연쇄 동작(CASCADE·RESTRICT)이 포인트입니다.",
      mechanism: "개체 무결성(기본키는 NULL·중복 불가), 참조 무결성(외래키는 참조 대상이 존재하거나 NULL — 삭제 시 CASCADE/SET NULL/RESTRICT), 도메인 무결성(속성값이 정의된 타입·범위·형식), 사용자 정의 무결성(업무 규칙, 예: 급여>0). 트리거·제약조건·응용에서 구현.",
      map: [
        { as: "학번 없는 학생 거부", real: "개체 무결성(PK)", note: "NULL·중복 불가" },
        { as: "없는 학과 코드 거부", real: "참조 무결성(FK)", note: "CASCADE 등" },
        { as: "타입·범위 검증", real: "도메인 무결성", note: "" },
        { as: "급여>0 같은 규칙", real: "사용자 정의 무결성", note: "" },
      ],
      usage: "DB 스키마 설계의 필수입니다. 시험은 4무결성 구분과 참조 무결성 연쇄 옵션입니다.",
      links: [
        { topic: "릴레이션 키(key)", how: "개체·참조 무결성이 키를 기반으로 합니다." },
        { topic: "데이터베이스 정규화(Normalization)", how: "무결성 유지를 위한 구조 설계입니다." },
      ],
      exam: "데이터베이스 무결성은 개체(PK)·참조(FK)·도메인(타입·범위)·사용자정의(업무규칙) 제약으로 잘못된 데이터를 막아 정확성·일관성을 보장한다.",
    }, image: "/concept/book/db-integrity.png", easy: "무결성은 데이터의 정확성·일관성·유효성을 지키는 제약 규칙입니다(138회 1교시 기출). 두 축으로 나눠 외웁니다. ① 데이터 무결성 [개참속사키도] — 개체(기본키는 NULL 불가·유일, PK), 참조(외래키는 상대 기본키 값이거나 NULL, FK), 속성(지정된 데이터 형식만), 사용자 정의(Business Rule 준수, Trigger·Check), 키(동일 키값 튜플 불가), 도메인(정의된 범위 안의 값만, CHECK). ② 릴레이션 무결성 [상과집튜즉지] — 상태/과도(정적이냐 상태 변환이냐), 집합/튜플(전체냐 처리 중인 튜플이냐), 즉시/지연(연산 즉시냐 커밋 후냐). 개체·참조 무결성 구분(PK vs FK)이 가장 자주 나옵니다." },
"db-relation-key": {
    guide: {
      hook: "행을 '유일하게 식별'하는 열의 계보 — 슈퍼키에서 기본키까지 좁혀 갑니다.",
      scene: "학생 테이블에서 한 명을 콕 집으려면 학번이면 충분하지만, '학번+이름'도 되긴 됩니다(불필요한 조합). 이 중 군더더기 없이 최소로 식별하는 것을 골라 대표(기본키)로 삼습니다.",
      why: "슈퍼키→후보키→기본키→대체키, 그리고 외래키의 관계가 출제 핵심입니다. 유일성·최소성이라는 두 성질로 키가 좁혀지는 논리가 포인트입니다.",
      mechanism: "슈퍼키(유일성만 — 식별 가능한 모든 조합), 후보키(유일성+최소성 — 군더더기 없음), 기본키(후보키 중 대표로 선택, NULL 불가), 대체키(선택 안 된 후보키), 외래키(다른 릴레이션의 기본키를 참조 — 관계 연결). 유일성=중복 없음, 최소성=속성 하나만 빼도 식별 불가.",
      map: [
        { as: "식별 가능한 모든 조합", real: "슈퍼키", note: "유일성만" },
        { as: "군더더기 없는 조합", real: "후보키", note: "유일성+최소성" },
        { as: "대표로 뽑은 후보키", real: "기본키(PK)", note: "NULL 불가" },
        { as: "남의 PK를 참조", real: "외래키(FK)", note: "관계 연결" },
      ],
      usage: "테이블 설계·무결성의 기초입니다. 시험은 키 계층 정의와 유일성·최소성 판별입니다.",
      links: [
        { topic: "데이터베이스 무결성", how: "개체·참조 무결성이 키에 기반합니다." },
        { topic: "함수적 종속성(Functional Dependency)", how: "키 판별의 이론적 근거입니다." },
      ],
      exam: "릴레이션 키는 유일성만 갖는 슈퍼키에서 최소성을 더한 후보키, 대표로 선택한 기본키, 나머지 대체키로 좁혀지며, 외래키는 다른 릴레이션의 기본키를 참조한다.",
    }, image: "/concept/book/db-relation-key.png", easy: "튜플(행)을 한 줄로 콕 집어낼 수 있는 속성 묶음이 키입니다. 도출 절차 [유최대] — 유일성 검증(함수적 종속성 확인) → 최소성 검증(여기서 후보키가 나옴) → 엔티티 대표성으로 기본키 확정. 유형 5개 [슈후기대외]를 포함 관계로 외우면 쉽습니다: 슈퍼키(유일성만, 최소성 없음) ⊃ 후보키(유일성+최소성) ⊃ 기본키(후보키의 대표 하나)와 대체키(뽑히고 남은 나머지), 그리고 외래키(내 속성이 다른 릴레이션의 기본키인 것). 제약유형 3개도 함께 — 본질적(PK 필수·셀은 단일 값=1차 정규화 의미), 내재적(스키마에 지정, FK·Check·Default), 명시적(프로그램·수작업 생성)입니다." },
"db-entity": {
    guide: {
      hook: "DB로 관리할 '독립적으로 존재하는 대상' — 학생·과목·주문 같은 것들입니다.",
      scene: "학사 시스템을 설계하면 '학생', '과목', '수강신청'이 각각 관리 대상이 됩니다. 이 관리 대상 하나하나가 엔티티이고, 이들이 테이블이 됩니다. 엔티티는 속성(이름·학번)과 관계(수강)를 가집니다.",
      why: "엔티티의 성립 요건과 유형(강한/약한, 유·무형) 구분이 출제 포인트입니다. 인스턴스·속성·관계와의 관계, 식별자 필요성이 핵심입니다.",
      mechanism: "요건: 업무에 필요, 인스턴스가 2개 이상, 속성 보유, 식별자 존재, 관계 존재. 유형: 강한 엔티티(독립적으로 식별 — 학생), 약한 엔티티(다른 엔티티에 의존해야 식별 — 주문상세). 유형별: 유형(물리적 — 상품), 개념(무형 — 부서), 사건(행위 — 주문). 인스턴스는 엔티티의 실제 발생 건.",
      map: [
        { as: "학생·과목·주문", real: "엔티티(관리 대상)", note: "테이블이 됨" },
        { as: "독립 식별 가능", real: "강한 엔티티", note: "" },
        { as: "부모 있어야 식별", real: "약한 엔티티", note: "주문상세" },
        { as: "실제 한 건", real: "인스턴스", note: "행(row)" },
      ],
      usage: "개념 모델링(ERD)의 기본 단위입니다. 시험은 엔티티 성립 요건과 강·약 엔티티 구분입니다.",
      links: [
        { topic: "데이터베이스 모델링", how: "엔티티 식별이 개념 모델링의 시작입니다." },
        { topic: "릴레이션 키(key)", how: "엔티티의 식별자가 키가 됩니다." },
      ],
      exam: "엔티티는 업무상 관리할 독립 대상으로 속성·식별자·관계를 가지며, 독립 식별되는 강한 엔티티와 다른 엔티티에 의존하는 약한 엔티티로 나뉜다.",
    }, image: "/concept/book/db-entity.png", easy: "업무에 필요한 정보를 담는 데이터 덩어리입니다. 아무 명사나 엔티티가 되는 게 아니라 자격 요건 6개 [업식집프속관]를 통과해야 합니다 — 업무적 필요성, 식별성(식별자로 한 개씩), 집합성(다수의 값), 프로세스 활용(CRUD 확인), 속성 보유, 관계성(다른 엔티티와 최소 1개 관계). 유형 [유개사기중행]은 두 축으로 — 유무형 기준: 유형(사원·물품), 개념(조직·보험상품), 사건(주문·청구) / 발생시점 기준: 기본(독립 생성, 타 엔티티의 부모 — 사원·부서·고객), 중심(기본에서 파생, 행위를 낳음 — 계약·주문·매출), 행위(변경 잦고 대량 발생 — 주문목록·사원변경이력). 도출은 후보 도출(명사 표기) → 정제(중복·유사 정리) → 확정 순입니다." },
"db-functional-dependency": {
    guide: {
      hook: "'A를 알면 B가 하나로 정해진다'는 속성 간 결정 관계 — 정규화의 이론적 토대입니다.",
      scene: "학번을 알면 이름이 하나로 정해집니다(학번→이름). 이 '결정한다'는 관계가 함수적 종속입니다. 어떤 속성이 무엇을 결정하는지 따지면, 어디를 테이블로 쪼개야 할지가 보입니다.",
      why: "정규화의 근거이자, 종속 유형(완전·부분·이행)이 각 정규형과 직결됩니다. 결정자·종속자 개념과 종속 유형 판별이 출제 핵심입니다.",
      mechanism: "X→Y: X(결정자)가 Y(종속자)를 유일하게 결정. 완전 함수 종속(복합키 전체에 종속 — 2NF 대상), 부분 함수 종속(복합키 일부에만 종속 — 2NF 위반), 이행 함수 종속(X→Y→Z로 간접 종속 — 3NF 위반). 종속을 분석해 이상현상 없는 릴레이션으로 분해.",
      map: [
        { as: "학번→이름", real: "함수 종속(결정 관계)", note: "결정자→종속자" },
        { as: "복합키 전체에 의존", real: "완전 함수 종속", note: "" },
        { as: "복합키 일부에만 의존", real: "부분 함수 종속", note: "2NF 위반" },
        { as: "간접 결정 X→Y→Z", real: "이행 함수 종속", note: "3NF 위반" },
      ],
      usage: "정규화 판단의 도구입니다. 시험은 종속 유형과 대응 정규형(부분→2NF, 이행→3NF)입니다.",
      links: [
        { topic: "데이터베이스 정규화(Normalization)", how: "종속 유형 제거가 정규화의 본질입니다." },
        { topic: "암스트롱 공리(Armstrong's Axioms)", how: "종속으로부터 다른 종속을 추론하는 규칙입니다." },
      ],
      exam: "함수적 종속성은 결정자 X가 종속자 Y를 유일하게 결정하는 관계로, 부분 종속은 2NF, 이행 종속은 3NF 위반을 낳아 정규화의 근거가 된다.",
    }, image: "/concept/book/db-functional-dependency.png", easy: "'학번을 알면 이름이 정해진다'처럼 결정자가 종속자를 정하는 제약이 함수적 종속성이고, 정규화가 단계별로 제거하는 대상이 바로 이것입니다. 유형 [완부이결다조]와 정규형을 짝지어야 합니다 — 완전 함수 종속(기본키 전체에만 종속, 이상적), 부분 함수 종속(키의 일부에 종속 → 2NF가 제거), 이행 함수 종속(A→X→Y로 건너 종속 → 3NF가 제거), 결정자 함수 종속(결정자가 후보키가 아님 → BCNF가 제거), 다중값 종속(X->>Y → 4NF), 조인 종속(셋 이상으로 나눠야 복원 가능 → 5NF). '몇 정규형이 무엇을 제거하나'가 단골 출제이고, 추론규칙이 암스트롱 공리로 이어집니다." },
"db-armstrong": {
    guide: {
      hook: "알려진 함수 종속으로부터 '숨은 종속을 모두 추론'하는 규칙 6개입니다.",
      scene: "'학번→학과'와 '학과→학과장'을 알면 '학번→학과장'도 자동으로 참입니다(이행). 암스트롱 공리는 이렇게 주어진 종속에서 논리적으로 따라오는 종속을 빠짐없이 끌어내는 추론 규칙입니다.",
      why: "정규화·키 결정의 수학적 기반이라는 위치가 핵심입니다. 3개 기본 공리(반사·증가·이행)와 3개 추가 규칙(합집합·분해·의사이행)의 구분이 출제 포인트입니다.",
      mechanism: "기본 공리: 반사(Y⊆X면 X→Y), 증가(X→Y면 XZ→YZ), 이행(X→Y, Y→Z면 X→Z). 추가 규칙(기본에서 유도): 합집합(X→Y, X→Z면 X→YZ), 분해(X→YZ면 X→Y, X→Z), 의사이행(X→Y, WY→Z면 WX→Z). 이 규칙으로 폐포(closure)를 구해 후보키·정규형을 판정.",
      map: [
        { as: "자기 부분집합 결정", real: "반사 규칙", note: "기본" },
        { as: "양쪽에 같이 붙이기", real: "증가 규칙", note: "기본" },
        { as: "A→B→C면 A→C", real: "이행 규칙", note: "기본" },
        { as: "폐포로 키 판정", real: "속성 폐포 계산", note: "응용" },
      ],
      usage: "후보키 도출·정규형 판정의 이론 도구입니다. 시험은 기본 3공리·추가 3규칙 구분과 폐포 계산입니다.",
      links: [
        { topic: "함수적 종속성(Functional Dependency)", how: "공리가 다루는 대상입니다." },
        { topic: "데이터베이스 정규화(Normalization)", how: "종속 폐포로 정규형을 판정합니다." },
      ],
      exam: "암스트롱 공리는 반사·증가·이행의 3기본 공리와 합집합·분해·의사이행의 추가 규칙으로 함수 종속의 폐포를 도출해 후보키·정규형 판정의 기반이 된다.",
    }, image: "/concept/book/db-armstrong.png", easy: "주어진 함수종속 집합 F에서 숨어 있는 종속까지 전부 유도해 폐포(F+)를 구하는 추론 규칙입니다. 특징 [정완] — 정당(Sound: 틀린 종속은 안 만든다), 완전(Complete: 맞는 종속은 다 찾는다). 기본규칙 [기재부이] — 재귀성(Y⊆X면 X→Y), 부가성(X→Y면 XZ→YZ), 이행성(X→Y, Y→Z면 X→Z). 부가규칙 [부분합의] — 분해(X→YZ면 X→Y, X→Z), 합집합(X→Y, X→Z면 X→YZ), 의사이행(X→Y, YZ→W면 XZ→W). 계산 문제도 나옵니다 — F={A→B, A→C, CG→H, CG→I, B→H}일 때 AG의 폐포는 ABCGHI, 그래서 AG가 후보키입니다." },
"db-normalization": {
    guide: {
      hook: "중복과 이상현상을 없애려고 테이블을 '무손실로 쪼개는' 단계적 설계 기법입니다.",
      scene: "한 테이블에 학생·수강과목·교수를 다 넣으면, 수강생이 없는 과목은 저장이 안 되고(삽입 이상), 교수 변경 시 여러 행을 고쳐야 하며(갱신 이상), 마지막 수강생 삭제 시 과목 정보도 사라집니다(삭제 이상). 정규화는 종속에 따라 테이블을 나눠 이를 제거합니다.",
      why: "1NF~BCNF 각 단계가 제거하는 종속과 이상현상의 대응이 출제 핵심입니다. 정규화의 이득(이상 제거)과 대가(조인 증가·성능 저하 → 역정규화)의 트레이드오프가 포인트입니다.",
      mechanism: "1NF(원자값 — 반복 그룹 제거), 2NF(부분 함수 종속 제거 — 복합키 일부 종속 분리), 3NF(이행 함수 종속 제거), BCNF(모든 결정자가 후보키 — 3NF의 예외 제거). 각 단계는 무손실 분해·종속성 보존을 지향. 지나친 정규화는 조인 비용↑ → 역정규화로 보정.",
      map: [
        { as: "칸에 하나의 값만", real: "1NF(원자값)", note: "반복 제거" },
        { as: "복합키 일부 종속 분리", real: "2NF(부분 종속 제거)", note: "" },
        { as: "간접 종속 분리", real: "3NF(이행 종속 제거)", note: "" },
        { as: "결정자=후보키", real: "BCNF", note: "3NF 예외 제거" },
      ],
      usage: "관계형 DB 설계의 표준 절차입니다. 시험은 이상현상 3종, 정규형별 제거 대상, BCNF 판별입니다.",
      links: [
        { topic: "함수적 종속성(Functional Dependency)", how: "종속 유형이 각 정규형의 대상입니다." },
        { topic: "데이터베이스 반정규화(De-Normalization)", how: "성능을 위한 반대 방향 조정입니다." },
      ],
      exam: "정규화는 함수 종속에 따라 테이블을 무손실 분해해 삽입·갱신·삭제 이상을 제거하는 기법으로, 1NF(원자값)·2NF(부분종속)·3NF(이행종속)·BCNF 순으로 진행된다.",
    }, image: "/concept/book/db-normalization.png", easy: "정규화는 함수적 종속성을 기준으로 릴레이션을 분해해 중복과 이상현상을 없애는 과정입니다(136회 1교시 기출). 테이블 하나에 다 욱여넣으면 이상현상 [삽삭갱]이 생깁니다 — 삽입 이상(새 학과 넣으려고 가짜 학번 생성), 삭제 이상(학생 지우면 학과 정보도 소멸), 갱신 이상(학과 바꾸면 여러 행을 같이 수정). 원인은 부분함수 종속과 이행함수 종속이고, 처방이 릴레이션 분해=정규화입니다. 단계별 제거 대상을 한 줄로: 1NF(원자값 아닌 속성 분리) → 2NF(부분함수종속 제거) → 3NF(이행함수종속 제거) → BCNF(결정자가 후보키 아닌 종속 제거) → 4NF(다중값 종속) → 5NF(조인 종속). 원칙 [무중분] — 무손실, 중복 감소, 분리. 함수적 종속성 토픽과 한 몸으로 외우세요." },
"db-denormalization": {
    guide: {
      hook: "정규화를 '일부러 되돌려' 조인을 줄이고 조회 성능을 올리는 의도적 중복입니다.",
      scene: "정규화로 잘게 쪼갠 테이블은 정합성은 좋지만, 조회 때마다 여러 테이블을 조인해 느립니다. 자주 함께 읽는 데이터를 일부러 한 테이블에 중복 저장해 조인을 없앱니다 — 성능을 위해 중복을 감수하는 것입니다.",
      why: "'정규화(정합성) ↔ 역정규화(성능)'의 트레이드오프가 핵심입니다. 기법 유형과 '중복에 따른 정합성 관리 부담'이라는 대가가 출제 포인트입니다.",
      mechanism: "기법: 테이블 병합(1:1·1:M 통합), 테이블 분할(수직·수평 파티셔닝), 중복 컬럼 추가(조인 회피), 파생 컬럼(집계값 미리 저장), 이력 테이블 통합. 대가: 중복 데이터의 갱신 정합성을 트리거·배치·응용으로 관리해야 함. 조회 빈도·성능 요구가 높을 때 선택적으로 적용.",
      map: [
        { as: "자주 같이 읽는 것 합치기", real: "테이블 병합", note: "조인 제거" },
        { as: "집계값 미리 저장", real: "파생 컬럼", note: "계산 회피" },
        { as: "성능 위해 중복 허용", real: "의도적 중복", note: "정규화 역방향" },
        { as: "중복 정합성 관리 부담", real: "갱신 이상 위험", note: "대가" },
      ],
      usage: "OLAP·대량 조회 시스템의 성능 튜닝입니다. 시험은 정규화와의 트레이드오프, 기법 유형, 정합성 관리 대가입니다.",
      links: [
        { topic: "데이터베이스 정규화(Normalization)", how: "역정규화의 반대 방향 기법입니다." },
        { topic: "데이터베이스 파티셔닝(Partitioning)", how: "테이블 분할 기법과 연결됩니다." },
      ],
      exam: "반정규화는 조인·조회 성능을 위해 테이블 병합·중복·파생 컬럼으로 의도적 중복을 두는 기법으로, 정규화의 정합성과 성능을 맞바꾸며 갱신 정합성 관리가 대가다.",
    }, image: "/concept/book/db-denormalization.png", easy: "반정규화는 조회 성능을 위해 정규화된 테이블에 의도적으로 중복을 다시 허용하는 설계 기법입니다(135회 2교시 기출). 정규화로 잘게 쪼갠 테이블은 무결성은 좋지만 조인이 많아져 느려지기 때문입니다. 절차 [대다반]이 포인트 — ① 대상 조사(범위 처리 빈도·대량 처리·통계 프로세스·조인 개수) ② 다른 방법 유도 검토(뷰·클러스터링·인덱스 조정으로 해결되면 반정규화 안 함) ③ 적용. '바로 합치는 게 아니라 다른 방법을 먼저 검토한다'가 시험 포인트입니다. 기법 [테칼관]은 레벨별로 — 테이블(병합·분할·추가), 컬럼(중복·계산·이력 컬럼 추가), 관계(중복관계 추가). 공통 장단점: 조인 비용은 줄지만 갱신 비용이 늘고 무결성 관리가 어려워집니다." },
"db-connection-trap": {
    guide: {
      hook: "ERD의 관계 설계가 잘못돼 '정보를 제대로 못 뽑는' 함정 — 팬 트랩과 카즘 트랩입니다.",
      scene: "부서-사원-프로젝트를 어설프게 연결하면, '이 사원이 어느 프로젝트인지'가 애매해지거나(팬 트랩), 프로젝트에 배정 안 된 사원이 아예 조회에서 빠지는(카즘 트랩) 문제가 생깁니다. 관계선은 있는데 경로 해석이 안 되는 상황입니다.",
      why: "ERD 설계 결함을 진단·해결하는 문제로 출제됩니다. 두 트랩의 원인(팬=1:M 분기, 카즘=선택적 관계·NULL)과 해결(관계 재설정·직접 관계 추가)이 핵심입니다.",
      mechanism: "팬 트랩(Fan Trap): 한 엔티티에서 두 개의 1:M 관계가 갈라져(팬 모양) 경로가 모호 — 두 M쪽 간 실제 관계를 못 특정. 해결: 관계를 재배치하거나 직접 관계 추가. 카즘 트랩(Chasm Trap): 선택적(부분) 참여 관계로 인해 경로가 끊겨(NULL) 일부 인스턴스가 조회 누락 — 직접 관계를 추가해 경로 확보.",
      map: [
        { as: "두 갈래로 벌어진 부채", real: "팬 트랩(1:M 분기)", note: "경로 모호" },
        { as: "끊긴 협곡", real: "카즘 트랩(선택적 관계)", note: "경로 단절·누락" },
        { as: "직접 관계 추가", real: "트랩 해결", note: "경로 복원" },
        { as: "ERD 관계 재설계", real: "근본 해결", note: "" },
      ],
      usage: "ERD 검증·리뷰의 점검 항목입니다. 시험은 팬·카즘 트랩 원인·해결 구분입니다.",
      links: [
        { topic: "데이터베이스 모델링", how: "ERD 설계 단계의 결함 진단입니다." },
        { topic: "엔티티(Entity)", how: "엔티티 간 관계 설계의 문제입니다." },
      ],
      exam: "연결함정은 ERD 관계 설계 결함으로, 1:M이 갈라져 경로가 모호한 팬 트랩과 선택적 관계로 경로가 끊겨 조회가 누락되는 카즘 트랩이 있으며 직접 관계 추가로 해결한다.",
    }, image: "/concept/book/db-connection-trap.png", easy: "ER 모델을 그렸는데 관계가 모호해서 원하는 답이 안 나오는 설계 실수입니다. 두 가지 — 부채꼴 함정(Fan Trap): 단과대학 1─N 교수, 단과대학 1─N 학과처럼 한 엔티티에서 부챗살처럼 관계가 퍼져 '교수가 어느 학과 소속인지' 알 수 없는 경우. 해결은 관계 재배치(교수 N─1 학과 N─1 단과대학으로 사슬을 바로 세움). 균열 함정(Chasm Trap): 학생─(지도)─교수─(재직)─학과 경로만 있는데 지도교수 없는 학생이 생기면 그 학생의 학과를 알 수 없는 경우 — 관계에 균열(빈틈)이 있는 것. 해결은 균열 난 두 엔티티(학과-학생) 사이에 재학함 관계를 직접 추가. '퍼져서 모호하면 부채꼴, 끊겨서 못 가면 균열'로 구분하세요." },
"db-relational-algebra": {
    guide: {
      hook: "'어떻게 가져올지'를 연산 순서로 기술하는 절차적 질의 언어 — SQL의 이론적 뿌리입니다.",
      scene: "원하는 데이터를 얻으려면 '먼저 이 조건으로 걸러(선택), 이 열만 뽑고(추출), 저 테이블과 붙여라(조인)'처럼 연산을 순서대로 지정합니다. SQL 옵티마이저가 내부적으로 이 대수식으로 질의를 표현·최적화합니다.",
      why: "관계해석(비절차적)과의 대비, 그리고 순수·유도 연산의 구분이 출제 핵심입니다. 각 연산이 SQL의 어느 절에 대응하는지가 포인트입니다.",
      mechanism: "순수 관계 연산: Select(σ, 조건 행 선택=WHERE), Project(π, 열 추출=SELECT), Union·Difference·Cartesian Product. 유도 연산: Join(⋈, 조건 결합), Intersection, Division(÷). 절차적 — 연산 순서를 명시. 관계 완전성(관계해석과 표현력 동등)을 가지며 질의 최적화의 내부 표현으로 쓰임.",
      map: [
        { as: "조건으로 행 거르기", real: "Select(σ)=WHERE", note: "순수 연산" },
        { as: "원하는 열만", real: "Project(π)=SELECT", note: "순수 연산" },
        { as: "테이블 붙이기", real: "Join(⋈)", note: "유도 연산" },
        { as: "연산 순서 명시", real: "절차적 언어", note: "관계해석과 대비" },
      ],
      usage: "질의 최적화·SQL 내부 이해의 기초입니다. 시험은 순수·유도 연산 구분, 관계해석과의 대비, SQL 대응입니다.",
      links: [
        { topic: "관계해석(Relational Calculus)", how: "비절차적 짝 언어로 표현력이 동등합니다." },
        { topic: "SQL(Structured Query Language)", how: "대수 연산이 SQL 절로 구현됩니다." },
      ],
      exam: "관계대수는 Select·Project·Join 등 연산 순서로 질의를 기술하는 절차적 언어로, 비절차적 관계해석과 표현력이 동등하며 SQL 질의 최적화의 내부 표현이 된다.",
    }, image: "/concept/book/db-relational-algebra.png", easy: "원하는 데이터를 '어떻게(How) 꺼낼지' 연산 순서로 기술하는 절차적 언어입니다. 연산자를 두 묶음으로 — 일반 집합 연산자 [합교차카]: 합집합 ∪, 교집합 ∩, 차집합 −, 카티션 프로덕트 ×(두 릴레이션 튜플을 모두 연결). 순수 관계 연산자 [셀프조디]: 셀렉트 σ(조건 맞는 행 고르기), 프로젝션 π(원하는 열만 뽑기), 조인 ⋈(공통 속성으로 연결), 디비전 ÷(S의 모든 튜플과 관련된 R의 튜플). 셀렉트는 가로로 자르고 프로젝션은 세로로 자른다고 기억하면 그림이 그려집니다. 관계해석(What, 선언적)과의 대비가 단골 출제입니다." },
"db-relational-calculus": {
    guide: {
      hook: "'무엇을 원하는지'만 선언하는 비절차적 질의 언어 — 과정은 안 적습니다.",
      scene: "관계대수가 '이렇게 해서 가져와'라면, 관계해석은 '조건을 만족하는 것들'이라고 결과만 선언합니다. 술어논리로 '이런 성질을 가진 튜플들의 집합'을 기술하면 시스템이 방법을 알아서 찾습니다.",
      why: "'선언적 vs 절차적'의 대비와 튜플·도메인 해석 구분이 출제 핵심입니다. SQL이 선언적 언어인 이유의 이론적 배경입니다.",
      mechanism: "술어 논리 기반: 튜플 관계해석({t | P(t)} — 튜플 변수 t가 조건 P를 만족), 도메인 관계해석({<x,y> | P(x,y)} — 도메인 변수 사용). 정량자 ∀(전체)·∃(존재) 사용. 비절차적 — 결과의 조건만 명시하고 처리 방법은 미지정. 관계대수와 표현력 동등(관계 완전성).",
      map: [
        { as: "결과 조건만 선언", real: "비절차적 기술", note: "방법 미지정" },
        { as: "튜플 변수로 조건", real: "튜플 관계해석", note: "" },
        { as: "도메인 변수로 조건", real: "도메인 관계해석", note: "QBE 기반" },
        { as: "∀·∃ 정량자", real: "술어 논리", note: "" },
      ],
      usage: "SQL의 선언적 성격·QBE의 이론 배경입니다. 시험은 관계대수와의 대비, 튜플·도메인 해석 구분입니다.",
      links: [
        { topic: "관계대수(Relational Algebra)", how: "절차적 짝 언어로 표현력이 동등합니다." },
        { topic: "SQL(Structured Query Language)", how: "SQL의 선언적 성격이 여기서 나옵니다." },
      ],
      exam: "관계해석은 술어 논리로 원하는 결과의 조건만 선언하는 비절차적 언어로, 튜플·도메인 해석으로 나뉘며 절차적 관계대수와 표현력이 동등하다.",
    }, image: "/concept/book/db-relational-calculus.png", easy: "'무엇(What)을 원하는지'만 수학 논리식으로 선언하는 비절차적 언어입니다 — SQL이 이 계열입니다. 수식 재료는 연산자(∨ 또는, ∧ 그리고, ¬ 부정)와 정량자(∀ 모든 튜플, ∃ 하나라도 존재). 유형 [튜도] 구분이 핵심 — 튜플 관계해석(TRC): 튜플(행) 단위로 질의, { t | t ∈ Employees AND t.age > 30 } 처럼 행 전체를 반환. 도메인 관계해석(DRC): 속성(열) 단위로 질의, { <name, age> | ∃ d (…) } 처럼 특정 속성 값만 반환. 예시 하나로 연결: {(t.Ename, t.Salary) | t ∈ EMPLOYEE ∧ t.Salary ≥ 3000} = SELECT Ename, Salary FROM EMPLOYEE WHERE Salary >= 3000. 관계대수(How)와 짝으로 외우세요." },
"db-recovery": {
    guide: {
      hook: "장애가 나도 '커밋된 것은 지키고, 안 된 것은 되돌려' 일관 상태로 복구합니다.",
      scene: "정전으로 DB가 죽었을 때, 이미 완료(Commit)된 이체는 살리고(Redo), 진행 중이던 미완료 작업은 취소(Undo)해야 합니다. 로그에 '누가 무엇을 바꿨는지'를 미리 기록해 두면 이 판단이 가능합니다.",
      why: "트랜잭션의 원자성·지속성을 실현하는 핵심이라 로그 기법과 Redo/Undo 판단, 체크포인트가 출제 핵심입니다. 즉시·지연 갱신의 차이가 포인트입니다.",
      mechanism: "로그 기반: WAL(Write-Ahead Logging — 데이터보다 로그를 먼저 기록). 즉시 갱신(변경 즉시 반영 → 미완료는 Undo, 완료는 Redo), 지연 갱신(커밋까지 로그만 → Redo만, Undo 불필요). 체크포인트(주기적으로 로그·버퍼를 디스크에 반영 → 복구 범위 축소). 미디어 장애는 백업+로그로 복구. ARIES가 대표 알고리즘.",
      map: [
        { as: "로그 먼저 기록", real: "WAL", note: "복구의 전제" },
        { as: "완료된 것 재실행", real: "Redo", note: "지속성" },
        { as: "미완료 취소", real: "Undo", note: "원자성" },
        { as: "복구 시작점 표시", real: "체크포인트", note: "범위 축소" },
      ],
      usage: "DBMS 신뢰성의 핵심입니다. 시험은 Redo/Undo 판단, 즉시·지연 갱신, 체크포인트, WAL입니다.",
      links: [
        { topic: "트랜잭션", how: "원자성·지속성을 실현합니다." },
        { topic: "DB 동시성제어", how: "함께 트랜잭션 격리·회복을 담당합니다." },
      ],
      exam: "DB 회복기법은 WAL 로그를 기반으로 커밋된 트랜잭션은 Redo, 미완료는 Undo해 일관 상태로 복구하며, 체크포인트로 복구 범위를 줄이고 원자성·지속성을 보장한다.",
    }, image: "/concept/book/db-recovery.png", easy: "장애가 나도 트랜잭션의 일관성·무결성을 되살리는 기법입니다. 장애 유형 [하소사] — H/W(Media 장애: 디스크 문제로 데이터 유실), S/W(Syntax·Instance 장애), 사용자(Fat-finger: 실수로 테이블 삭제). 회복의 두 연산이 축입니다 — REDO(완료된 트랜잭션을 다시 반영), UNDO(미완료 트랜잭션을 되돌림). 기법 [회로(즉지)체그아]: 즉시 갱신(갱신마다 Log+DB 반영, 장애 시 UNDO), 지연 갱신(Log만 쌓고 종료 후 DB 반영, 장애 시 REDO만 — UNDO 불필요), 체크포인트(검사점 이후 완료분 REDO·진행분 UNDO), 그림자 페이지(시작 전 페이지 테이블 복제, 로그 불필요), ARIES(WAL과 LSN 이용 — 현대 DBMS 표준). '즉시=UNDO 필요, 지연=REDO만'이 헷갈림 포인트입니다." },
"db-concurrency": {
    guide: {
      hook: "여러 트랜잭션이 동시에 돌아도 '혼자 순서대로 한 것처럼' 보이게 하는 제어입니다.",
      scene: "두 사람이 동시에 같은 잔고를 읽고 각자 입금하면, 한 명의 입금이 사라질 수 있습니다(갱신 손실). 동시성 제어는 이런 충돌을 막아, 결과가 어떤 순차 실행과 같아지도록(직렬가능성) 보장합니다.",
      why: "직렬가능성이라는 목표와 이를 달성하는 기법(잠금·타임스탬프·낙관·MVCC)의 비교가 출제 핵심입니다. 2PL과 교착상태가 포인트입니다.",
      mechanism: "이상현상: 갱신 손실, 오손 읽기, 모순성, 연쇄 복귀. 목표: 직렬가능성. 기법: 잠금(Locking — 2단계 잠금 2PL: 확장→수축, 직렬가능 보장하나 교착 위험), 타임스탬프 순서(트랜잭션 시각으로 순서 강제), 낙관적 검증(충돌 드물 때 실행 후 검증), MVCC(버전으로 읽기·쓰기 비충돌). 교착은 예방·회피·탐지·회복으로 처리.",
      map: [
        { as: "동시 입금으로 한 건 증발", real: "갱신 손실", note: "막을 대상" },
        { as: "순차 실행처럼 보이게", real: "직렬가능성", note: "목표" },
        { as: "확장→수축 잠금", real: "2단계 잠금(2PL)", note: "교착 위험" },
        { as: "버전으로 안 겹치게", real: "MVCC", note: "읽기·쓰기 비충돌" },
      ],
      usage: "다중 사용자 DB의 정합성 기반입니다. 시험은 직렬가능성, 2PL·교착, 기법 비교입니다.",
      links: [
        { topic: "Isolation Level(격리 레벨)", how: "동시성 제어 강도를 단계로 조절합니다." },
        { topic: "MVCC(다중 버전 동시성 제어) 2가지 유형", how: "잠금 없는 동시성 제어 방식입니다." },
      ],
      exam: "DB 동시성제어는 동시 트랜잭션의 갱신 손실·오손 읽기 등을 막아 직렬가능성을 보장하는 기법으로, 2단계 잠금·타임스탬프·낙관적 검증·MVCC가 있으며 교착상태를 관리한다.",
    }, image: "/concept/book/db-concurrency.png", easy: "여러 사용자가 같은 데이터를 동시에 만질 때 사고를 막는 제어입니다. 안 하면 생기는 문제 4가지 [갱현모연] — 갱신손실(같은 데이터를 동시에 고쳐 한쪽이 덮임), 현황파악오류(Dirty Read: 중간 결과를 참조), 모순성(일관성 없는 상태에서 읽어 모순 발생), 연쇄복귀(하나가 rollback되면 그 데이터를 쓴 트랜잭션도 줄줄이 rollback). 기법은 Locking(상호 배제)이 기본이고 [2PL낙타다] — 2PL(확장단계엔 Lock만, 수축단계엔 Unlock만 → 직렬성 보장), 낙관적 검증(실행 중엔 안 막고 종료 시 일괄 검증), Timestamp ordering(식별자 순서대로 직렬화), MVCC(데이터의 여러 버전 중 직렬 가능성이 보장되는 버전을 골라 접근 — 읽기가 쓰기를 안 막음). '비관적=미리 잠금, 낙관적=나중 검증'의 대비가 시험 포인트입니다." },
"db-validation": {
    guide: {
      hook: "일단 자유롭게 실행하고 '커밋 직전에만 충돌을 검사'하는 낙관적 동시성 제어입니다.",
      scene: "충돌이 드물다고 낙관하는 방식입니다. 잠금 없이 자기 작업공간에서 마음껏 읽고 쓰다가, 커밋하려는 순간에만 '내가 읽는 사이 남이 바꿨나'를 검사해, 충돌이면 롤백하고 아니면 반영합니다.",
      why: "'비관적(잠금) vs 낙관적(검증)'의 대비가 핵심입니다. 3단계(읽기·검증·쓰기)와 충돌이 적은 환경에서의 이점이 출제 포인트입니다.",
      mechanism: "3단계: 읽기 단계(잠금 없이 로컬 사본에서 읽고 수정), 검증 단계(커밋 시점에 다른 트랜잭션과의 직렬가능성 충돌 검사 — 읽기집합·쓰기집합 비교), 쓰기 단계(통과 시 DB 반영, 실패 시 롤백·재시도). 잠금 오버헤드가 없어 충돌 적은 읽기 위주 환경에 유리하나, 충돌 잦으면 롤백 비용↑.",
      map: [
        { as: "충돌 드물 거라 낙관", real: "낙관적 접근", note: "잠금 없음" },
        { as: "로컬 사본에서 자유 작업", real: "읽기 단계", note: "" },
        { as: "커밋 직전 충돌 검사", real: "검증 단계", note: "핵심" },
        { as: "통과 시만 반영", real: "쓰기 단계", note: "실패 시 롤백" },
      ],
      usage: "읽기 많고 충돌 적은 웹·분산 환경에 적합합니다. 시험은 3단계, 비관적 잠금과의 비교, 적용 조건입니다.",
      links: [
        { topic: "DB 동시성제어", how: "낙관적 기법의 한 종류입니다." },
        { topic: "MVCC(다중 버전 동시성 제어) 2가지 유형", how: "낙관적 제어와 자주 결합됩니다." },
      ],
      exam: "낙관적 검증 기법은 잠금 없이 읽기·검증·쓰기 3단계로 실행 후 커밋 직전 충돌을 검사하는 동시성 제어로, 충돌이 드문 읽기 위주 환경에 유리하다.",
    }, image: "/concept/book/db-validation.png", easy: "충돌이 드물 거라고 '낙관'하고, 실행 중엔 잠그지 않다가 끝날 때 검사하는 방식입니다. 3단계 [판확기] — 판독(Read: 모든 갱신을 메모리 사본에만, DB엔 미반영) → 확인(Validation: DB 반영 전에 직렬 가능성 위반 여부 검사) → 기록(Write: 통과하면 디스크 반영, 실패하면 취소·복귀). 확인 단계의 3가지 통과 조건이 심화 포인트 — 조건1: Ti가 Tk 시작 전에 이미 끝남(겹침 없음), 조건2: Ti의 Write-set과 Tk의 Read-set이 안 겹침(Tk 검증 전 종료), 조건3: Write-Read·Write-Write 모두 안 겹침. 타임스탬프 3개(Start·Validation·Finish)로 판정합니다. 읽기 위주 환경에 유리하고, 충돌이 잦으면 복귀 비용이 커집니다." },
"db-mvcc": {
    guide: {
      hook: "데이터의 '여러 버전'을 두어, 읽기와 쓰기가 서로 안 막게 하는 동시성 제어입니다.",
      scene: "누가 수정 중이어도 다른 사람은 '수정 전 스냅샷'을 읽을 수 있게 버전을 여러 개 유지합니다. 그래서 읽기가 쓰기를 기다리지 않고(읽기-쓰기 비차단), 성능이 크게 오릅니다.",
      why: "'읽기-쓰기 비차단'의 원리와 버전 저장 방식 2유형이 출제 핵심입니다. 격리 레벨 구현·스냅샷 격리와의 관계가 포인트입니다.",
      mechanism: "각 쓰기가 새 버전을 만들고, 트랜잭션은 시작 시점 스냅샷과 일관된 버전을 읽음. 2유형: ①롤백 세그먼트/언두 방식(Oracle — 현재 버전 + 언두 로그로 과거 버전 재구성), ②추가 전용/버전 체인 방식(PostgreSQL — 각 행의 여러 버전을 테이블에 함께 저장, VACUUM으로 정리). 읽기는 잠금 없이 스냅샷, 쓰기 충돌만 관리.",
      map: [
        { as: "수정 전 스냅샷 읽기", real: "읽기-쓰기 비차단", note: "핵심 이점" },
        { as: "언두 로그로 과거 재구성", real: "롤백 세그먼트 방식", note: "Oracle" },
        { as: "여러 버전 함께 저장", real: "버전 체인 방식", note: "PostgreSQL·VACUUM" },
        { as: "시작 시점 일관 조회", real: "스냅샷 격리", note: "" },
      ],
      usage: "Oracle·PostgreSQL·MySQL InnoDB의 기본 동시성 방식입니다. 시험은 읽기-쓰기 비차단, 2유형(언두 vs 버전 체인), 스냅샷 격리입니다.",
      links: [
        { topic: "DB 동시성제어", how: "잠금 대신 버전으로 격리를 구현합니다." },
        { topic: "Isolation Level(격리 레벨)", how: "스냅샷 격리로 레벨을 구현합니다." },
      ],
      exam: "MVCC는 데이터의 여러 버전을 유지해 읽기가 쓰기를 막지 않는 동시성 제어로, 언두 로그 방식(Oracle)과 버전 체인 방식(PostgreSQL)으로 나뉜다.",
    }, image: "/concept/book/db-mvcc.png", easy: "읽는 사람을 잠금으로 기다리게 하지 않고, 데이터의 옛 버전을 보여줘서 읽기 일관성을 지키는 방식입니다. 구현이 DBMS마다 달라 두 유형을 비교합니다. MGA(PostgreSQL): 업데이트가 나면 기존 행은 그대로 두고 새 행을 추가(기존 데이터에 표시만) — 그래서 물리적 위치가 바뀌고, 업데이트마다 인덱스 수정이 발생하며, 죽은 버전을 청소하는 VACUUM이 주기적으로 필요합니다. Rollback Segment(Oracle): 기존 블록을 새 데이터로 바로 바꾸되 이전 데이터를 롤백 세그먼트에 보관 — 셀렉트 시점의 SCN보다 나중에 바뀐 블록은 이전 이미지로 CR 블록을 만들어 읽습니다. 물리적 위치가 안 바뀐다는 게 MGA와의 결정적 차이입니다. '포스트그레는 옆에 새로 쓰고, 오라클은 제자리에 쓰고 과거를 따로 보관'으로 기억하세요." },
"db-distributed": {
    guide: {
      hook: "데이터를 여러 사이트에 나눠 두고도 '하나의 DB처럼' 쓰게 하는 시스템입니다.",
      scene: "지사마다 서버를 두되 사용자는 어디에 데이터가 있는지 몰라도 되게 만듭니다(투명성). 문제는 여러 사이트에 걸친 트랜잭션의 일관성과, 네트워크가 끊겨도 동작해야 한다는 점입니다.",
      why: "6대 투명성과 분산의 이점(가용성·지역성) vs 대가(복잡성·일관성)가 출제 핵심입니다. 2PC·CAP 이론으로 이어지는 관문입니다.",
      mechanism: "6투명성: 위치(어디 있는지 몰라도 됨), 분할(단편화 은닉), 중복(복제 은닉), 병행(동시성 은닉), 장애(부분 장애 은닉), 이질(DBMS 차이 은닉). 데이터 분산: 단편화(수평·수직 분할)·복제·할당. 분산 트랜잭션은 2PC로 원자성 보장. CAP·PACELC로 일관성-가용성 트레이드오프.",
      map: [
        { as: "어디 있는지 몰라도 됨", real: "위치 투명성", note: "6투명성" },
        { as: "복제본을 하나처럼", real: "중복 투명성", note: "" },
        { as: "여러 사이트 원자 커밋", real: "2PC", note: "분산 트랜잭션" },
        { as: "일관성↔가용성 선택", real: "CAP 이론", note: "대가" },
      ],
      usage: "글로벌 서비스·대규모 시스템의 기반입니다. 시험은 6투명성, 단편화·복제, 2PC·CAP과의 연결입니다.",
      links: [
        { topic: "2PC", how: "분산 트랜잭션의 원자성을 보장합니다." },
        { topic: "CAP 이론과 BASE 이론", how: "분산의 일관성-가용성 트레이드오프입니다." },
      ],
      exam: "분산 DB는 여러 사이트에 데이터를 분산하고도 위치·중복·장애 등 6투명성으로 하나의 DB처럼 쓰게 하며, 분산 트랜잭션은 2PC로, 일관성-가용성은 CAP로 다룬다.",
    }, image: "/concept/book/db-distributed.png", easy: "분산 DB는 논리적으로는 하나의 DB처럼 보이지만 물리적으로는 네트워크로 연결된 여러 지역에 나뉘어 관리되는 데이터베이스입니다(138회 3교시 기출). 핵심 시험 포인트는 투명성 5가지 [위복병분장] — 위치(데이터가 어디 있는지 몰라도 됨, Distributed Data Dictionary 필요), 복제(몇 곳에 복제됐는지 몰라도 됨), 병행(동시에 트랜잭션해도 이상 없음), 분할(릴레이션이 단편으로 나뉜 걸 몰라도 됨), 장애(지역 시스템이 죽어도 무결성 보존 — 2PC 활용). 설계 전략 [탑버하]는 Top Down(신규 구축, 전체 설계 후 분산), Bottom Up(기존 DB들을 통합, 게이트웨이 필요), Hybrid(복잡도가 심해 둘을 혼합). 분산방법 [위분복요] — 위치·분할(수평/수직)·복제(부분/광역)·요약(분석/통합) 분산입니다." },
"db-2pc": {
    guide: {
      hook: "여러 사이트에 걸친 트랜잭션을 '전부 커밋하거나 전부 취소'하게 조율하는 2단계 합의입니다.",
      scene: "여러 지점이 관련된 이체는 한 곳만 커밋되면 안 됩니다. 조정자가 먼저 '준비됐나?' 물어 모두 'Yes'면 커밋을, 하나라도 'No'면 전체 취소를 명령합니다 — 준비 투표(1단계)와 커밋 결정(2단계)의 2단계입니다.",
      why: "분산 원자성의 표준 프로토콜이라 2단계 흐름과 '조정자 장애 시 블로킹'이라는 치명적 한계가 출제 핵심입니다. 3PC·Saga와의 대비가 포인트입니다.",
      mechanism: "1단계(준비/투표): 조정자가 참여자에게 prepare 전송 → 참여자는 로그 기록 후 Yes(ready)/No 응답. 2단계(커밋/결정): 모두 Yes면 global commit, 하나라도 No면 global abort 전송 → 참여자 반영·ack. 한계: 조정자가 커밋 결정 직후 다운되면 참여자가 무한 대기(블로킹) → 3PC(타임아웃 추가)나 Saga(보상 트랜잭션)로 완화.",
      map: [
        { as: "준비됐나 투표", real: "1단계 prepare/vote", note: "" },
        { as: "모두 Yes면 커밋 명령", real: "2단계 commit/abort", note: "" },
        { as: "하나라도 No면 전체 취소", real: "원자성 보장", note: "" },
        { as: "조정자 죽으면 무한 대기", real: "블로킹 한계", note: "3PC·Saga로 완화" },
      ],
      usage: "분산 트랜잭션·XA 트랜잭션의 표준입니다. 시험은 2단계 흐름, 블로킹 한계, 3PC·Saga 대안입니다.",
      links: [
        { topic: "분산 DB", how: "분산 트랜잭션의 원자성 수단입니다." },
        { topic: "CAP 이론과 BASE 이론", how: "강한 일관성을 택할 때의 대가를 보여줍니다." },
      ],
      exam: "2PC는 조정자가 준비 투표(1단계)와 커밋·취소 결정(2단계)으로 분산 트랜잭션의 원자성을 보장하는 프로토콜로, 조정자 장애 시 블로킹 한계가 있어 3PC·Saga로 보완한다.",
    }, image: "/concept/book/db-2pc.png", easy: "분산 DB에서 여러 노드에 걸친 트랜잭션을 '전원 커밋 아니면 전원 롤백'으로 만드는 합의 절차입니다. 등장인물 — 조정자(Global Coordinator: 참여자 목록을 갖고 커밋을 지휘), 지역 노드(로컬 트랜잭션 수행, 조정자 결정에 따름), Commit Point Site(가장 중요한 데이터를 가진 노드로 제일 먼저 커밋·롤백), 클라이언트. 이름 그대로 2단계입니다 — Phase 1(Prepare): 커밋 요구가 오면 조정자가 Commit Point Site를 정하고 모든 노드에 Prepare 메시지를 보내 응답을 받음. Phase 2(Commit): 전원이 '준비됐다'고 하면 commit 명령, 하나라도 에러 보고가 오면 Rollback 명령. 분산 DB의 장애 투명성을 받치는 메커니즘이라 분산 DB 토픽과 세트로 나옵니다." },
"db-nosql": {
    guide: {
      hook: "관계형의 엄격한 스키마·조인을 버리고 '확장성'을 택한 비관계형 DB 계열입니다.",
      scene: "대규모 웹 서비스는 정해진 표 구조에 데이터를 억지로 맞추기 어렵고, 서버를 옆으로 늘려(수평 확장) 폭증하는 트래픽을 감당해야 합니다. NoSQL은 유연한 스키마와 수평 확장을 얻는 대신 강한 일관성·조인을 포기합니다.",
      why: "4대 유형과 'RDBMS vs NoSQL'(ACID vs BASE, 수직 vs 수평 확장)의 대비가 출제 핵심입니다. CAP 이론과 직결됩니다.",
      mechanism: "4유형: Key-Value(단순 키로 값 저장 — Redis·DynamoDB), Document(JSON 문서 — MongoDB), Column-Family(열 그룹 — Cassandra·HBase), Graph(노드·관계 — Neo4j). 특징: 스키마 유연, 수평 확장(샤딩), BASE(결과적 일관성). RDBMS 대비 조인·복잡 트랜잭션 약함.",
      map: [
        { as: "단순 키로 꺼내기", real: "Key-Value", note: "Redis" },
        { as: "JSON 문서 통째", real: "Document", note: "MongoDB" },
        { as: "열 그룹으로", real: "Column-Family", note: "Cassandra" },
        { as: "관계를 그래프로", real: "Graph", note: "Neo4j" },
      ],
      usage: "대규모·비정형·고트래픽 서비스에 쓰입니다. 시험은 4유형 매핑, RDBMS와의 비교, BASE·CAP과의 연결입니다.",
      links: [
        { topic: "CAP 이론과 BASE 이론", how: "NoSQL의 일관성 모델 근거입니다." },
        { topic: "NoSQL 데이터모델링 패턴", how: "NoSQL 설계 방법을 다룹니다." },
      ],
      exam: "NoSQL은 유연한 스키마와 수평 확장을 위해 Key-Value·Document·Column-Family·Graph 4유형으로 나뉘며, ACID 대신 BASE를 택해 대규모·비정형 데이터에 적합하다.",
    }, image: "/concept/book/db-nosql.png", easy: "RDBMS의 테이블-컬럼 스키마 없이, 분산 환경에서 단순 검색·추가에 강하고 처리율이 높은 DB입니다. 유형 4개 [키컬도그]가 핵심 — Key-Value(가장 단순, 단위연산 빠름, 대신 키 범위 처리 안 됨), Column Family(키 기반 Sorting 저장으로 키 범위 처리를 개선한 Ordered Key-Value), Document(JSON·XML 문서 저장, 임의 속성 추가 자유, 대신 Parsing 오버헤드), Graph(관계 자체를 저장, Traversing이 미리 저장돼 관계 검색이 빠름). 각 유형의 '개선 계보'로 외우면 좋습니다 — Key-Value의 범위 처리 약점을 Column Family가, 구조 표현 약점을 Document가 보완. 절차는 탐색(도메인 파악) → 설계(쿼리결과 디자인·패턴 모델링·기능 최적화) → 최적화(후보 선정·테스트) 순입니다." },
"db-nosql-modeling": {
    guide: {
      hook: "NoSQL은 '조인이 없어서', 정규화 대신 '쿼리에 맞춰' 데이터를 미리 뭉쳐 설계합니다.",
      scene: "RDBMS는 정규화 후 조인하지만, NoSQL은 조인이 약하거나 없어서 '어떻게 조회할지'를 먼저 정하고 그에 맞게 데이터를 한 문서에 묶거나(임베딩) 참조를 둡니다. 설계의 출발점이 데이터가 아니라 쿼리입니다.",
      why: "'정규화 → 쿼리 주도 설계'라는 발상 전환이 핵심입니다. 임베딩 vs 참조, 대표 패턴이 출제 포인트입니다.",
      mechanism: "원칙: 쿼리 우선(액세스 패턴 파악 후 모델링), 조인 회피(비정규화). 임베딩(관련 데이터를 한 문서에 중첩 — 함께 읽을 때 빠름, 문서 커짐), 참조(ID로 연결 — 중복 적으나 여러 번 조회). 패턴: 버킷(시계열 묶음), 아웃라이어(예외 처리), 사전 계산(집계 저장), 스키마 버저닝. 1:1·1:N·N:M별 임베딩/참조 선택.",
      map: [
        { as: "조회 먼저 정하고 설계", real: "쿼리 주도 모델링", note: "핵심" },
        { as: "관련 데이터 한 문서에", real: "임베딩", note: "함께 읽기 빠름" },
        { as: "ID로 연결", real: "참조(Referencing)", note: "중복 감소" },
        { as: "시계열 묶기·집계 저장", real: "버킷·사전계산 패턴", note: "" },
      ],
      usage: "MongoDB·DynamoDB 설계의 기본입니다. 시험은 쿼리 주도 설계, 임베딩 vs 참조 선택 기준, 패턴입니다.",
      links: [
        { topic: "NoSQL", how: "이 모델링이 적용되는 대상 DB입니다." },
        { topic: "데이터베이스 반정규화(De-Normalization)", how: "비정규화·중복을 적극 활용합니다." },
      ],
      exam: "NoSQL 데이터모델링은 조인이 약한 특성상 액세스 패턴을 먼저 정해 임베딩·참조로 데이터를 뭉치는 쿼리 주도 설계로, 버킷·사전계산 등 패턴을 활용한다.",
    }, image: "/concept/book/db-nosql-modeling.png", easy: "NoSQL 데이터모델링 패턴은 Put/Get 위주의 NoSQL에서 다양한 조회를 지원하기 위한 테이블 설계 기법 모음입니다. RDBMS처럼 쿼리로 풀 수 없으니 설계 단계에서 미리 푸는 것입니다. 기본 패턴 3 — Denormalization(중복 저장해서 Join 없이 한 번의 I/O로 조회), Aggregation(1:n 관계 최소화, row마다 컬럼·타입이 달라도 됨 = Soft Scheme), Application Side Join(Join이 꼭 필요하면 클라이언트 앱에서 처리). 확장 패턴 3 — Atomic aggregation(일관성 위해 테이블을 하나로 통합), Index Table(인덱스가 없으니 별도 인덱스 테이블을 직접 생성), Composite Key Table(복합 키 인덱스 구성). 계층 패턴 3 — Tree Aggregation(트리 전체를 하나의 Value에), Adjacent Lists(부모·자식 포인터 저장), Materialized Path(루트부터 전체 경로를 key로 저장)입니다." },
"db-cap-base": {
    guide: {
      hook: "분산 DB는 '일관성·가용성·분단내성' 셋 중 둘만 가질 수 있다 — CAP의 냉정한 선택입니다.",
      scene: "네트워크가 끊기는(분단) 순간, '최신 데이터만 주되 응답 못 할 수도(일관성)'와 '일단 응답하되 옛 데이터일 수도(가용성)' 중 하나를 골라야 합니다. 분산 시스템에선 분단내성이 필수라, 실제 선택은 C냐 A냐입니다.",
      why: "CAP의 '셋 중 둘'과 CP/AP 시스템 예시, 그리고 BASE(가용성 중심 완화된 일관성)가 출제 핵심입니다. NoSQL 설계 철학의 근거입니다.",
      mechanism: "CAP: Consistency(모든 노드가 같은 최신 데이터), Availability(항상 응답), Partition tolerance(분단에도 동작). 분단(P)은 분산에서 불가피 → C와 A 중 택1. CP(일관성 우선 — HBase·MongoDB 기본), AP(가용성 우선 — Cassandra·DynamoDB). BASE: Basically Available·Soft state·Eventual consistency — ACID 반대편, 결과적 일관성 허용.",
      map: [
        { as: "모두 최신 같은 값", real: "일관성(C)", note: "" },
        { as: "항상 응답", real: "가용성(A)", note: "" },
        { as: "끊겨도 동작", real: "분단내성(P)", note: "분산 필수" },
        { as: "결국엔 일치", real: "BASE(결과적 일관성)", note: "ACID 반대" },
      ],
      usage: "NoSQL·분산 시스템 선택의 이론 근거입니다. 시험은 CAP 셋 중 둘, CP/AP 예시, BASE vs ACID입니다.",
      links: [
        { topic: "NoSQL", how: "CAP·BASE가 NoSQL 설계 철학입니다." },
        { topic: "PACELC", how: "CAP을 지연·일관성으로 확장합니다." },
      ],
      exam: "CAP 이론은 분산 DB가 일관성·가용성·분단내성 중 둘만 만족할 수 있음을 말하며, 분단이 불가피해 CP/AP를 택하고, BASE는 결과적 일관성으로 가용성을 우선한다.",
    }, image: "/concept/book/db-cap-base.png", easy: "분산시스템은 일관성(C: 모든 서버가 같은 시점에 같은 데이터)·가용성(A: 일부 서버가 죽어도 정상 동작)·부분결함허용(P: 메시지 유실에도 동작) 셋을 다 가질 수 없고 둘만 고를 수 있다는 것이 CAP [일가파]입니다. 조합별 제품까지 — CA(Oracle·MySQL 등 RDBMS), CP(HBase·MongoDB — 분할 시 가용성 저하), AP(Dynamo·Cassandra — 일관성 저하). 한계는 '네트워크 분할 시 C와 A 중 하나를 골라야 한다'는 것이고, 이를 보완한 것이 PACELC입니다. BASE [가분데비일]는 가용성을 중시하는 NoSQL의 성질 — Basically Available(복사본 저장으로 항상 가용), Soft State(노드 상태는 외부 전송 정보로 결정), Eventually Consistent(일시적 비일관성을 허용하되 결국 일관성 회복). ACID와의 대비가 단골입니다." },
"db-pacelc": {
    guide: {
      hook: "CAP이 놓친 '평소(분단이 없을 때)'까지 따지는 확장 이론 — 지연과 일관성의 트레이드오프입니다.",
      scene: "CAP은 네트워크가 끊긴 상황만 다루지만, 정상일 때도 '빠른 응답(낮은 지연)'과 '강한 일관성'은 상충합니다. PACELC은 '분단이면(P) C냐 A냐, 아니면(E, Else) 지연(L)이냐 일관성(C)이냐'를 함께 봅니다.",
      why: "CAP의 한계를 보완한다는 점과 시스템 분류(PA/EL, PC/EC 등)가 출제 포인트입니다. 실무 DB의 일관성 설계 이해에 쓰입니다.",
      mechanism: "PACELC: if Partition → choose C or A; Else → choose L(atency) or C(onsistency). 분류 예: PA/EL(Dynamo·Cassandra — 분단 시 가용성, 평소 저지연), PC/EC(강한 일관성 우선 — VoltDB), PA/EC 등. 복제 동기화 방식(동기=일관성·고지연, 비동기=저지연·약일관성)이 EL/EC를 가름.",
      map: [
        { as: "끊기면 C냐 A냐", real: "Partition → C/A", note: "CAP 부분" },
        { as: "평소엔 지연이냐 일관성이냐", real: "Else → L/C", note: "CAP 확장" },
        { as: "분단 가용·평소 저지연", real: "PA/EL(Cassandra)", note: "" },
        { as: "언제나 일관성", real: "PC/EC", note: "" },
      ],
      usage: "분산 DB의 일관성-지연 설계 분석에 쓰입니다. 시험은 CAP과의 차이, PA/EL·PC/EC 분류입니다.",
      links: [
        { topic: "CAP 이론과 BASE 이론", how: "PACELC가 확장하는 기반 이론입니다." },
        { topic: "NoSQL", how: "NoSQL의 일관성 설계를 세밀히 설명합니다." },
      ],
      exam: "PACELC는 CAP을 확장해 분단 시 일관성·가용성, 정상 시 지연·일관성의 트레이드오프까지 다루며, 시스템을 PA/EL·PC/EC 등으로 분류한다.",
    }, image: "/concept/book/db-pacelc.png", easy: "PACELC는 분산시스템의 트레이드오프를 장애 시(P: A vs C)와 정상 시(E: L vs C) 두 상황으로 나눠 설명하는 이론입니다. 장애 상황만 다루는 CAP의 보완판입니다 — P(파티션, 장애) 상황에서는 A(가용성)와 C(일관성)가 상충하고, E(else, 정상) 상황에서는 L(지연시간)과 C(일관성)가 상충한다(모든 노드에 반영하려면 응답이 길어지므로). 그래서 시스템이 4가지로 분류됩니다 — PC/EC(늘 일관성 우선: HBase·VoltDB·Megastore), PA/EL(늘 가용성·속도 우선: Cassandra·Dynamo), PA/EC(장애 땐 가용성, 평상시엔 일관성: MongoDB), PC/EL(장애 땐 일관성, 평상시엔 속도: PNUTS). 대표 제품과 분류를 짝짓는 문제가 그대로 나옵니다." },
"db-newsql": {
    guide: {
      hook: "'NoSQL의 확장성 + RDBMS의 ACID·SQL'을 둘 다 잡으려는 차세대 DB입니다.",
      scene: "NoSQL은 확장은 좋지만 강한 일관성·SQL·트랜잭션이 약하고, RDBMS는 반대입니다. NewSQL은 SQL과 ACID 트랜잭션을 유지하면서도 수평 확장을 달성하려는 시도입니다 — Google Spanner가 대표입니다.",
      why: "'NoSQL의 확장성과 RDBMS의 정합성을 결합'이라는 위치가 핵심입니다. 분산 트랜잭션·합의(Paxos/Raft)·시간 동기화 같은 실현 기술이 출제 포인트입니다.",
      mechanism: "특징: 관계형 모델·SQL 유지, 분산 아키텍처로 수평 확장, 분산 ACID 트랜잭션(합의 알고리즘 Paxos·Raft로 복제 일관성), 자동 샤딩. 구현 사례: Google Spanner(TrueTime — 원자시계·GPS로 전역 시간 동기화해 외부 일관성), CockroachDB, TiDB. NoSQL(BASE)·전통 RDBMS(단일 노드)의 한계를 동시에 극복.",
      map: [
        { as: "SQL·트랜잭션 유지", real: "RDBMS 정합성", note: "" },
        { as: "옆으로 확장", real: "NoSQL 수평 확장", note: "" },
        { as: "합의로 복제 일관성", real: "Paxos/Raft", note: "" },
        { as: "전역 시간 동기화", real: "Spanner TrueTime", note: "외부 일관성" },
      ],
      usage: "글로벌 규모의 정합성 필요 서비스(금융·전자상거래)에 쓰입니다. 시험은 NoSQL·RDBMS와의 3자 비교, Spanner·합의 알고리즘입니다.",
      links: [
        { topic: "NoSQL", how: "확장성은 취하되 BASE 한계는 극복합니다." },
        { topic: "CAP 이론과 BASE 이론", how: "강한 일관성과 확장성의 양립 시도입니다." },
      ],
      exam: "NewSQL은 SQL·ACID 트랜잭션을 유지하면서 수평 확장을 달성하는 DB로, 합의 알고리즘과 시간 동기화(Spanner TrueTime)로 분산 일관성을 구현한다.",
    }, image: "/concept/book/db-newsql.png", easy: "RDBMS(ACID·SQL은 되지만 확장이 어려움)와 NoSQL(확장·고가용은 되지만 ACID 포기)의 장점만 합친 세대입니다 — ACID + 수평 확장 + 고가용성 + SQL을 모두 지원. 기능 [트아 SA비 노병] — 트랜잭션 측면(SQL 기반 상호작용, ACID 지원, Non-locking 비잠금 동시성제어), 아키텍처 측면(노드단위 고성능, 병렬/비공유 — 데이터가 서버마다 중복 없이 독립 존재). 기술요소는 양쪽에서 가져옵니다 — RDBMS 쪽: 인덱싱·MVCC·샤딩 / NoSQL 쪽: 스키마리스·인메모리·DB 스케일링(scale-out). 3자 비교표가 그대로 출제됩니다: ACID(New○ R○ No✕), BASE(New○ R✕ No○), 확장(New/No는 Scale-out, R은 Scale-up), 솔루션(VoltDB·Spanner / Oracle·MSSQL / MongoDB·Redis)." },
"db-vector-db": {
    guide: {
      hook: "숫자 벡터로 바뀐 데이터를 '의미가 비슷한 순'으로 찾아 주는 DB — RAG의 심장입니다.",
      scene: "텍스트·이미지를 AI가 임베딩(숫자 벡터)으로 바꾸면, '고양이'와 '고양이과 동물'은 벡터 공간에서 가깝습니다. 벡터 DB는 '이 벡터와 가장 가까운 것들'을 찾아, 키워드가 안 겹쳐도 의미로 검색합니다.",
      why: "생성형 AI·RAG의 핵심 인프라라는 위치가 최신 출제 포인트입니다. 유사도 척도와 ANN 인덱싱(정확도-속도 트레이드오프)이 핵심입니다.",
      mechanism: "임베딩 벡터를 저장하고 유사도(코사인·유클리드·내적)로 최근접 이웃 검색. 정확한 전수 비교는 느려 ANN(근사 최근접) 인덱스 사용 — HNSW(그래프), IVF(클러스터), PQ(양자화). 필터링(메타데이터)·하이브리드 검색(키워드+벡터) 지원. Pinecone·Milvus·pgvector·Weaviate 등.",
      map: [
        { as: "의미를 숫자 좌표로", real: "임베딩 벡터", note: "" },
        { as: "가까운 순 찾기", real: "유사도 검색(코사인 등)", note: "" },
        { as: "빠르게 근사로", real: "ANN 인덱스(HNSW·IVF)", note: "정확도-속도" },
        { as: "RAG의 지식 저장소", real: "검색 증강 생성 연동", note: "핵심 용도" },
      ],
      usage: "LLM RAG·추천·이미지 검색의 기반입니다. 시험은 유사도 척도, ANN 인덱스, RAG와의 관계입니다.",
      links: [
        { topic: "ANN(Approximate Nearest Neighbor) 알고리즘", how: "벡터 검색의 핵심 인덱싱입니다." },
        { topic: "도메인 특화 언어 모델(Domain-Specific Language Model)", how: "RAG로 벡터 DB와 결합합니다." },
      ],
      exam: "벡터 데이터베이스는 임베딩 벡터를 저장하고 코사인 등 유사도로 최근접 이웃을 검색하는 DB로, ANN 인덱스로 속도를 확보하며 RAG의 핵심 인프라가 된다.",
    }, image: "/concept/book/db-vector-db.png", easy: "벡터 DB는 텍스트·이미지 같은 원본을 임베딩 모델로 고차원 숫자 벡터로 바꿔 저장하고, 유사한 것을 빠르게 찾아 주는 데이터베이스입니다 — RAG의 저장소이며 137회 4교시 기출입니다. 동작 5단계: ① 벡터 임베딩(원본→고차원 벡터) ② 저장·인덱싱(해싱/양자화/그래프/트리 기반) ③ 쿼리 처리(질문도 같은 모델로 벡터화) ④ 유사성 측정 ⑤ 후처리(필터링·순위 재조정). 알고리즘 [랜양LHI] — 랜덤 투영(저차원 투영), 제품 양자화 PQ(나눠서 압축), LSH(유사한 것끼리 같은 해시), HNSW(계층적 그래프 탐색), IVF(그룹 나눠 필요한 그룹만 검색). 유사도 측정은 코사인(각도)·유클리드(직선거리)·맨해튼(격자거리)·내적(방향)·자카드(집합)입니다." },
"db-ann": {
    guide: {
      hook: "'정확히 가장 가까운 것' 대신 '거의 가까운 것'을 빠르게 찾는 근사 최근접 탐색입니다.",
      scene: "수백만 벡터를 전부 비교해 정확한 1등을 찾으면 너무 느립니다. ANN은 약간의 정확도를 포기하는 대신, 후보를 영리하게 좁혀 수십 배 빠르게 '거의 최근접'을 찾습니다 — 벡터 검색의 실용성을 만듭니다.",
      why: "'정확도-속도 트레이드오프'와 대표 알고리즘(HNSW·IVF·PQ)의 원리가 출제 핵심입니다. 벡터 DB 성능의 근간입니다.",
      mechanism: "완전 탐색(brute-force)은 O(N)이라 느림 → 근사 인덱스로 후보 축소. HNSW(계층적 탐색 가능 그래프 — 이웃 그래프를 따라 점프하며 탐색, 고정확·고속), IVF(역파일 — 클러스터로 나눠 관련 클러스터만 탐색), PQ(곱 양자화 — 벡터를 압축 코드로 근사해 메모리·계산 절감), IVF+PQ 결합. recall(재현율)로 정확도 측정, 파라미터로 속도-정확도 조절.",
      map: [
        { as: "거의 가까운 것 빠르게", real: "근사 탐색", note: "정확도-속도" },
        { as: "이웃 그래프 점프", real: "HNSW", note: "고정확·고속" },
        { as: "클러스터로 후보 축소", real: "IVF", note: "" },
        { as: "벡터 압축 근사", real: "PQ(곱 양자화)", note: "메모리 절감" },
      ],
      usage: "벡터 DB·추천·검색 엔진의 핵심 알고리즘입니다. 시험은 완전탐색 한계, HNSW·IVF·PQ 원리, recall-속도 트레이드오프입니다.",
      links: [
        { topic: "벡터 데이터베이스(Vector Database)", how: "ANN이 벡터 DB의 검색 엔진입니다." },
        { topic: "RDBMS 인덱스(index)", how: "전통 인덱스와 대비되는 벡터 인덱싱입니다." },
      ],
      exam: "ANN은 정확도를 약간 희생해 최근접 이웃을 빠르게 찾는 근사 탐색으로, HNSW(그래프)·IVF(클러스터)·PQ(양자화) 등으로 벡터 DB의 검색 성능을 확보한다.",
    }, image: "/concept/book/db-ann.png", easy: "ANN은 정확한 최근접 이웃(NN)의 전수 비교가 너무 느리기 때문에, '거의 가장 가까운' 이웃을 빠르게 찾는 근사 탐색 알고리즘입니다 — 벡터 DB의 검색 엔진 역할입니다. 절차(트리 기반 예시): ① 임의의 두 점 사이 hyperplane으로 공간을 나누고 ② subspace의 점 개수를 노드로 binary tree 생성 ③ 점이 K개 넘으면 재귀 반복 ④ 검색 시 트리를 타고 내려가 해당 subspace 안에서만 NN 탐색. 구성요소 3계열이 시험 포인트 — 공간 분할 기반(k-d 트리·Annoy·LSH: 직관적이나 고차원에서 성능 저하), 그래프 기반(HNSW·NSG: 정확도·효율 높으나 인덱스 구축이 김), 압축·양자화 기반(PQ·IVF: 메모리·속도 유리하나 정보 손실로 정확도 저하 위험). 벡터 DB 토픽과 한 세트입니다." },
"db-sql": {
    guide: {
      hook: "관계형 DB를 다루는 표준 언어 — '무엇을 원하는지'만 쓰면 되는 선언적 언어입니다.",
      scene: "데이터를 어떻게 찾을지(순회·인덱스)는 DBMS가 알아서 하고, 사용자는 'A 조건인 것들의 B를 줘'라고 결과만 선언합니다. 이 선언적 성격이 관계해석에서 나옵니다.",
      why: "SQL의 4분류(DDL·DML·DCL·TCL)와 각 명령의 역할이 출제 핵심입니다. 선언적 성격·질의 처리 과정도 포인트입니다.",
      mechanism: "DDL(정의 — CREATE·ALTER·DROP·TRUNCATE: 스키마 정의), DML(조작 — SELECT·INSERT·UPDATE·DELETE: 데이터 처리), DCL(제어 — GRANT·REVOKE: 권한), TCL(트랜잭션 — COMMIT·ROLLBACK·SAVEPOINT). 질의 처리: 파싱→최적화(실행 계획 선택)→실행. 선언적이라 옵티마이저가 관계대수 기반으로 최적 경로 결정.",
      map: [
        { as: "표 구조 만들기", real: "DDL(CREATE 등)", note: "정의" },
        { as: "데이터 조회·수정", real: "DML(SELECT 등)", note: "조작" },
        { as: "권한 주고 뺏기", real: "DCL(GRANT/REVOKE)", note: "제어" },
        { as: "커밋·롤백", real: "TCL", note: "트랜잭션" },
      ],
      usage: "모든 관계형 DB 조작의 표준입니다. 시험은 4분류 명령 매핑, 선언적 성격, 질의 처리 과정입니다.",
      links: [
        { topic: "관계해석(Relational Calculus)", how: "SQL 선언적 성격의 이론 근거입니다." },
        { topic: "조인(Join)", how: "SQL 다중 테이블 조회의 핵심 연산입니다." },
      ],
      exam: "SQL은 관계형 DB의 표준 선언적 언어로, 스키마 정의(DDL)·데이터 조작(DML)·권한 제어(DCL)·트랜잭션 제어(TCL)로 분류되며 옵티마이저가 실행 계획을 최적화한다.",
    }, image: "/concept/book/db-sql.png", easy: "RDBMS에 말을 거는 표준 언어이고, 명령어를 4갈래로 분류하는 것이 전부입니다. DDL(구조 정의 — CREATE·ALTER·DROP·TRUNCATE·RENAME): 테이블 같은 스키마 객체를 만들고 바꾸고 없앰. DML(데이터 조작 — SELECT·INSERT·UPDATE·DELETE): 저장된 자료를 넣고 고치고 지우고 조회. DCL(권한 제어 — GRANT·REVOKE): 사용자에게 권한을 주거나 뺏음. TCL(트랜잭션 제어 — COMMIT·ROLLBACK·SAVEPOINT): 트랜잭션을 확정·취소. 헷갈림 포인트 둘 — TRUNCATE는 데이터를 지우지만 DDL이고(구조 초기화), COMMIT·ROLLBACK은 원래 DCL로 분류하다가 따로 떼어 TCL이라 부르기도 한다는 점입니다." },
"db-join": {
    guide: {
      hook: "여러 테이블을 '공통 값으로 이어 붙여' 하나처럼 조회하는 관계형의 핵심 연산입니다.",
      scene: "학생 테이블과 학과 테이블을 '학과코드'로 이으면, 학생 이름 옆에 학과명이 붙습니다. 정규화로 나눈 데이터를 다시 합쳐 보는 게 조인입니다. 어떻게 이을지(내부/외부)와 물리적으로 어떻게 처리할지(알고리즘)가 다릅니다.",
      why: "논리적 조인 유형(Inner·Outer·Cross 등)과 물리적 조인 알고리즘(Nested Loop·Sort Merge·Hash)의 구분이 출제 핵심입니다. 성능 최적화와 직결됩니다.",
      mechanism: "논리 유형: Inner(양쪽 일치만), Left/Right/Full Outer(한쪽·양쪽 미일치도 포함, NULL 채움), Cross(곱집합), Self(자기 조인). 물리 알고리즘: Nested Loop(한 행씩 대조 — 소량·인덱스 유리), Sort Merge(양쪽 정렬 후 병합 — 대량·정렬됨), Hash Join(해시 테이블로 매칭 — 대량·등가 조인). 옵티마이저가 통계로 선택.",
      map: [
        { as: "양쪽 일치만", real: "Inner Join", note: "" },
        { as: "한쪽은 다 포함", real: "Outer Join", note: "NULL 채움" },
        { as: "한 행씩 대조", real: "Nested Loop", note: "소량·인덱스" },
        { as: "해시로 매칭", real: "Hash Join", note: "대량·등가" },
      ],
      usage: "다중 테이블 조회·성능 튜닝의 핵심입니다. 시험은 조인 유형, 물리 알고리즘 3종의 적용 조건입니다.",
      links: [
        { topic: "SQL(Structured Query Language)", how: "조인이 SQL 다중 테이블 조회입니다." },
        { topic: "RDBMS 인덱스(index)", how: "인덱스가 조인 성능을 좌우합니다." },
      ],
      exam: "조인은 공통 값으로 여러 테이블을 결합하는 연산으로, 논리적으로 Inner·Outer·Cross로, 물리적으로 Nested Loop·Sort Merge·Hash Join으로 나뉘며 옵티마이저가 선택한다.",
    }, image: "/concept/book/db-join.png", easy: "두 테이블을 엮어 원하는 데이터를 뽑는 방법인데, 시험은 '논리(어떤 결과)'보다 '물리(어떻게 실행)'를 묻습니다. 관계대수 측면: Equi·Natural·Outer·Semi Join(벤 다이어그램의 LEFT/RIGHT/INNER/FULL). 메커니즘 측면 3형제가 핵심 — Nested Loop(선행 테이블을 한 건씩 읽으며 후행을 인덱스로 찾음: 소량·OLTP·부분범위·Buffer Cache), Sort Merge(양쪽을 각자 정렬해 차례로 병합: 인덱스 없을 때·대량), Hash(작은 집합으로 메모리에 해시 테이블을 만들고 큰 집합이 탐색: 대량 집계·OLAP). 비교표의 힌트(/*+ USE_NL, USE_MERGE, USE_HASH */)와 사용자원(Buffer Cache vs PGA) 구분까지 외우면 완성입니다." },
"db-index": {
    guide: {
      hook: "책 뒤 '찾아보기'처럼, 전체를 안 뒤지고 원하는 행을 빨리 찾게 하는 자료구조입니다.",
      scene: "1만 페이지 책에서 단어를 찾을 때 처음부터 넘기면(풀 스캔) 느리지만, 색인을 보면 몇 페이지인지 바로 압니다. 인덱스는 조회를 빠르게 하지만, 색인도 갱신해야 하므로 INSERT·UPDATE는 느려집니다.",
      why: "'조회 성능↑ ↔ 쓰기 성능↓·저장공간↑'의 트레이드오프와 자료구조(B-tree·해시·비트맵)가 출제 핵심입니다. 인덱스가 안 타는 경우(선두 컬럼·형변환)도 포인트입니다.",
      mechanism: "구조: B-tree/B+tree(범위·정렬 조회, 가장 일반적), Hash(등가 조회만, 범위 불가), Bitmap(카디널리티 낮은 컬럼·OLAP), 함수 기반. 클러스터형(데이터가 인덱스 순으로 물리 정렬 — 1개)/비클러스터형(별도 구조). 주의: 복합 인덱스 선두 컬럼 미사용·컬럼 가공 시 인덱스 미적용, 과다 인덱스는 DML 저하.",
      map: [
        { as: "책 뒤 찾아보기", real: "인덱스", note: "조회 가속" },
        { as: "범위·정렬 조회", real: "B-tree 인덱스", note: "일반적" },
        { as: "등가 조회만", real: "Hash 인덱스", note: "범위 불가" },
        { as: "색인도 갱신 부담", real: "DML 성능 저하", note: "트레이드오프" },
      ],
      usage: "쿼리 성능 튜닝의 1순위 도구입니다. 시험은 B-tree/해시/비트맵 용도, 트레이드오프, 인덱스 미적용 조건입니다.",
      links: [
        { topic: "조인(Join)", how: "인덱스가 조인 알고리즘·성능을 결정합니다." },
        { topic: "데이터베이스 파티셔닝(Partitioning)", how: "대용량 인덱스 관리와 함께 쓰입니다." },
      ],
      exam: "RDBMS 인덱스는 B-tree·해시·비트맵 등으로 조회를 가속하는 자료구조로, 쓰기 성능·저장공간과 트레이드오프이며 선두 컬럼 미사용·컬럼 가공 시 적용되지 않는다.",
    }, image: "/concept/book/db-index.png", easy: "인덱스는 <키 값, 레코드 주소> 쌍을 체계적으로 모아 두어 풀 스캔 없이 원하는 행에 바로 접근하게 하는 DB 오브젝트입니다 — 책 뒤의 찾아보기와 같은 원리입니다. 유형 [트해비 함조도 정동 논물]을 분류 축으로 — 형태(트리 기반: RDBMS 대부분 B-tree / 해시 기반: = 계열 연산만 가능 / 비트맵: 비트로 저장·ROWID 자동 생성), 목적(함수기반·조인·도메인 인덱스), 구조(정적: 구조 불변 / 동적: 빈 공간을 미리 준비), 논리(논리적/물리적). 스캔방식 5종은 그림과 함께 — Range Scan(수직 탐색 후 필요한 범위만), Full Scan(리프를 처음부터 끝까지, 차선책), Unique Scan(= 조건, 수직 탐색만), Skip Scan(선두 칼럼이 조건에 없어도 활용), Range Scan Descending(뒤에서 앞으로 내림차순). '해시 인덱스는 범위 검색이 안 된다'가 자주 나오는 함정입니다." },
"db-query-offloading": {
    guide: {
      hook: "읽기 트래픽을 원본 DB에서 '복제본으로 떠넘겨' 부하를 분산하는 기법입니다.",
      scene: "인기 쇼핑몰의 상품 조회가 폭주하면 원본 DB(마스터)가 버겁습니다. 조회 전용 복제본(슬레이브)을 여러 대 두고 읽기를 그쪽으로 보내면, 원본은 쓰기에만 집중해 전체 처리량이 올라갑니다.",
      why: "'읽기/쓰기 분리(CQRS 발상)'와 복제 지연(replication lag)이라는 트레이드오프가 출제 핵심입니다. 샤딩·파티셔닝과 함께 확장 전략으로 묶입니다.",
      mechanism: "마스터-슬레이브 복제: 쓰기는 마스터, 읽기는 여러 슬레이브로 라우팅. 복제는 비동기가 일반적 → 복제 지연으로 방금 쓴 데이터를 슬레이브에서 못 볼 수 있음(read-your-writes 문제) → 중요 조회는 마스터로. 애플리케이션·미들웨어·프록시가 라우팅 담당. 캐시(Redis)와 결합해 부하를 더 줄임.",
      map: [
        { as: "조회는 복제본으로 넘기기", real: "읽기/쓰기 분리", note: "부하 분산" },
        { as: "원본은 쓰기 전담", real: "마스터", note: "" },
        { as: "조회 전용 복제본", real: "슬레이브", note: "" },
        { as: "방금 쓴 게 안 보임", real: "복제 지연(lag)", note: "트레이드오프" },
      ],
      usage: "읽기 많은 웹 서비스의 확장 기본기입니다. 시험은 읽기/쓰기 분리, 복제 지연, 샤딩과의 차이입니다.",
      links: [
        { topic: "데이터베이스 샤딩(Sharding)", how: "샤딩(쓰기 분산)과 함께 쓰이는 확장 전략입니다." },
        { topic: "쿼리오프로딩(Query offloading)", how: "동일 주제 서브노트입니다." },
      ],
      exam: "쿼리오프로딩은 읽기 트래픽을 복제본(슬레이브)으로 분산해 원본 부하를 줄이는 기법으로, 비동기 복제에 따른 복제 지연이 트레이드오프다.",
    }, image: "/concept/book/db-query-offloading.png", easy: "쿼리 오프로딩은 Update 트랜잭션은 Master DB에서만 받고, Read 트랜잭션은 여러 대의 Slave DB로 분리(오프로딩)해 DB 처리량을 늘리는 기법입니다. DB 부하의 대부분이 읽기(Read 70~90%, Update 10~30%)라서 효과가 큽니다. 구성요소 [마스슬C로] — Master DB(Update만), Staging DB(중간 경유지 — Master가 다수 Slave로 직접 복제할 때의 성능저하 방지), Slave DB(Read만, N개 구성 + 장애 시 다른 인스턴스로 접근하는 HA), CDC(Source DB의 Back Log를 읽어 Target에 replay — Golden Gate, Share Flex, Galera), load balancing(Slave 조회 부하 분산). 샤딩과 헷갈리기 쉬운데, 쿼리 오프로딩은 '트랜잭션을 유형별로 분리'(성능 향상 목적)이고 샤딩은 '데이터를 여러 인스턴스로 분할'(용량한계 극복 목적)입니다." },
"db-partitioning": {
    guide: {
      hook: "큰 테이블을 '조각으로 나눠' 관리·조회 성능을 올리는 기법 — 같은 DB 안에서 쪼갭니다.",
      scene: "수억 건 주문 테이블을 통째로 두면 조회·삭제가 느립니다. 월별로 조각(파티션)을 나누면, '지난달 데이터'만 스캔하거나(파티션 프루닝) 오래된 조각을 통째로 버릴 수 있습니다.",
      why: "수평/수직 파티셔닝 구분과 방식(Range·Hash·List)이 출제 핵심입니다. 샤딩(여러 서버로 분산)과의 차이가 포인트입니다.",
      mechanism: "수평 파티셔닝(행을 기준으로 분할 — Range: 날짜·범위, Hash: 균등 분산, List: 값 목록, Composite: 조합), 수직 파티셔닝(열을 분할 — 자주 쓰는 컬럼 분리). 이점: 파티션 프루닝(필요 조각만 스캔), 병렬 처리, 조각 단위 관리(삭제·백업). 단일 DB 인스턴스 내부 분할이라 샤딩과 다름.",
      map: [
        { as: "월별로 조각내기", real: "Range 파티셔닝", note: "수평" },
        { as: "균등 해시 분산", real: "Hash 파티셔닝", note: "수평" },
        { as: "필요 조각만 스캔", real: "파티션 프루닝", note: "성능 이점" },
        { as: "같은 DB 안 분할", real: "샤딩과 차이", note: "단일 인스턴스" },
      ],
      usage: "대용량 테이블 관리·성능 튜닝입니다. 시험은 수평/수직, Range/Hash/List, 샤딩과의 구분입니다.",
      links: [
        { topic: "데이터베이스 샤딩(Sharding)", how: "여러 서버로 분산하는 확장형입니다." },
        { topic: "RDBMS 인덱스(index)", how: "파티션별 인덱스로 성능을 높입니다." },
      ],
      exam: "파티셔닝은 큰 테이블을 Range·Hash·List로 수평 또는 수직 분할해 파티션 프루닝·병렬 처리·조각 관리를 얻는 기법으로, 단일 DB 내 분할이라 샤딩과 구분된다.",
    }, image: "/concept/book/db-partitioning.png", easy: "파티셔닝은 대규모 테이블을 파티션 키 기준으로 물리적 세그먼트 여러 개에 나눠 저장하는 DB 설계 기법입니다(2025.01 ITPE FR·119회 컴시응 기출). 샤딩과 달리 한 서버(한 DB 인스턴스) 안에서의 분할입니다. 테이블 파티셔닝 유형 6가지: 레인지(키 값 범위로 — 가장 일반적), 리스트(불연속 값 목록을 지정 — 서울/경기 같은 그룹핑), 해시(해시 함수로 고르게 분산 — 병렬 처리 유리), 결합(레인지 후 해시/리스트로 서브 파티션), Reference(부모 테이블 키로 자식 테이블 파티셔닝), Interval(정해진 간격으로 자동 확장). 인덱스도 파티셔닝 — 글로벌(여러 파티션이 공유)과 로컬(파티션마다 개별). 설계 절차는 액세스 패턴 분석 → 데이터 분포 분석 → 인덱스 설계 → 테이블 파티셔닝 설계 → 인덱스 파티셔닝 설계 순입니다." },
"db-sharding": {
    guide: {
      hook: "데이터를 '여러 서버(샤드)에 나눠' 쓰기 부하와 용량을 수평 확장하는 기법입니다.",
      scene: "한 대 DB로 감당 안 되는 규모면, 사용자 ID로 데이터를 여러 서버에 쪼개 담습니다(A~M은 1번, N~Z는 2번). 각 서버가 자기 몫만 처리해 쓰기까지 분산됩니다 — 파티셔닝을 여러 서버로 확장한 것입니다.",
      why: "'수평 확장의 대표 기법'과 샤드 키 선택·리밸런싱·크로스 샤드 조인 문제가 출제 핵심입니다. 쿼리오프로딩(읽기)·파티셔닝(단일 DB)과의 차이가 포인트입니다.",
      mechanism: "샤딩 전략: Range(범위 — 핫스팟 위험), Hash(균등 — 범위 조회 어려움), Directory(매핑 테이블 — 유연·SPOF), Geo(지역). 난점: 샤드 키 잘못 고르면 편중, 크로스 샤드 조인·트랜잭션 어려움(분산 트랜잭션 필요), 재샤딩(리밸런싱) 비용. 애플리케이션·미들웨어(Vitess)·DB 내장으로 구현.",
      map: [
        { as: "ID로 여러 서버에 분산", real: "샤딩(수평 확장)", note: "쓰기까지 분산" },
        { as: "무엇으로 나눌지", real: "샤드 키", note: "편중 좌우" },
        { as: "서버 걸친 조인 곤란", real: "크로스 샤드 조인", note: "난점" },
        { as: "여러 서버로 확장", real: "파티셔닝과 차이", note: "분산 인스턴스" },
      ],
      usage: "초대규모 서비스의 확장 전략입니다. 시험은 샤딩 전략, 샤드 키·크로스 샤드 문제, 파티셔닝·오프로딩과의 구분입니다.",
      links: [
        { topic: "데이터베이스 파티셔닝(Partitioning)", how: "샤딩은 파티셔닝의 다중 서버 확장입니다." },
        { topic: "분산 DB", how: "샤딩이 분산 DB의 데이터 분산 방식입니다." },
      ],
      exam: "샤딩은 데이터를 샤드 키로 여러 서버에 분산해 쓰기·용량을 수평 확장하는 기법으로, 샤드 키 편중·크로스 샤드 조인·리밸런싱이 과제이며 파티셔닝과 달리 다중 인스턴스에 분산한다.",
    }, image: "/concept/book/db-sharding.png", easy: "샤딩은 데이터를 샤드(Shard)라는 개별 파티션으로 수평 분할해, 물리적으로 다른 DB 서버들에 나눠 저장·조회하는 기법입니다(127회 정보관리 4교시 기출). 파티셔닝이 '한 인스턴스 안 분할'이라면 샤딩은 '여러 인스턴스로 분할'입니다. MongoDB 그림처럼 Application → MongoS(라우터) → Shard1·2·3 구조로, shard key(어느 샤드로 갈지 정하는 칼럼)와 proxy(힌트+메타데이터로 요청을 해당 샤드에 전달)가 핵심 구성요소입니다. 분할방법 [해레디] — Hash(해시로 균일 분산, 샤드 추가 시 재정렬 필요), Range(범위 기준, 일부 샤드에 데이터 집중 가능), Directory(별도 조회 테이블로 라우팅, 그 테이블이 단일 장애 포인트). 비교표의 '샤딩=수평 분할·별도 서버·Master Node 관리 / 파티셔닝=수평·수직·동일 서버·Master 없음'이 답안 단골입니다." },
"db-data-standard": {
    guide: {
      hook: "부서마다 제각각인 용어·형식을 '하나의 기준'으로 통일하는 데이터 품질의 기초 작업입니다.",
      scene: "한 회사에서 '고객번호'를 어디선 CUST_NO, 어디선 CUSTOMER_ID로 쓰고 날짜 형식도 제각각이면 데이터를 합칠 수 없습니다. 표준화는 이름·형식·코드값·용어를 통일해 데이터가 일관되게 만듭니다.",
      why: "데이터 거버넌스·품질의 출발점이라는 위치와 4대 표준화 대상이 출제 핵심입니다. 마스터 데이터·메타데이터 관리와 연결됩니다.",
      mechanism: "표준화 대상: 표준 용어(업무 용어 통일), 표준 단어(용어를 구성하는 최소 단위), 표준 도메인(데이터 타입·길이·형식), 표준 코드(코드값 체계). 절차: 현행 진단 → 표준 정의 → 표준 확정·공표 → 준수·관리(변경 통제). 데이터 사전·메타데이터 저장소로 관리하고 거버넌스로 지속 통제.",
      map: [
        { as: "용어를 하나로", real: "표준 용어·단어", note: "" },
        { as: "형식·타입 통일", real: "표준 도메인", note: "" },
        { as: "코드값 체계 통일", real: "표준 코드", note: "" },
        { as: "지속 준수 통제", real: "거버넌스 연계", note: "" },
      ],
      usage: "데이터 통합·품질·거버넌스의 기초입니다. 시험은 4대 표준화 대상, 절차, 거버넌스와의 관계입니다.",
      links: [
        { topic: "데이터 거버넌스(Data Governance)", how: "표준화를 지속 통제하는 상위 체계입니다." },
        { topic: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)", how: "공공 표준화의 제도적 기준입니다." },
      ],
      exam: "데이터 표준화는 표준 용어·단어·도메인·코드를 통일해 데이터 일관성을 확보하는 작업으로, 데이터 사전으로 관리하고 거버넌스로 지속 통제하는 품질의 기초다.",
    }, image: "/concept/book/db-data-standard.png", easy: "데이터 표준화는 데이터의 명칭·정의·형식·규칙에 대한 원칙을 수립해 전사적으로 적용하는 활동입니다. 시스템마다 같은 데이터를 '고객명', 'CUST_NM', 'customer'로 제각각 부르면 불일치가 생기고, DW 통합과 유지보수가 어려워지기 때문입니다. 표준화 대상 4가지: 명칭(유일하게 구별해주는 이름), 정의(의미하는 범위·자격요건), 형식(표현 형태 정의로 입력 오류 최소화), 규칙(가능한 값을 사전 정의). 이를 떠받치는 체계 3가지: 데이터 표준(표준용어·표준단어·표준 도메인·표준코드), 데이터 표준 관리조직(데이터 관리자가 정의·체계화·감독·보안 담당), 데이터 표준화 프로세스(요구사항 수집 → 표준 정의 → 표준 확정 → 표준 관리 순)입니다." },
"db-governance": {
    guide: {
      hook: "데이터를 '자산'으로 관리하기 위한 조직·정책·프로세스의 통제 체계입니다.",
      scene: "데이터가 늘어나면 '누가 소유하고, 누가 품질을 책임지고, 어떻게 표준을 지킬지'가 없으면 혼란입니다. 거버넌스는 데이터의 주인(오너십)·규칙·역할을 정해 전사적으로 일관되게 관리합니다.",
      why: "3대 구성요소(원칙·조직·프로세스)와 데이터 오너십·스튜어드 역할이 출제 핵심입니다. 표준화·품질·보안을 아우르는 상위 체계입니다.",
      mechanism: "구성: 원칙(정책·표준·지침), 조직(데이터 오너 — 책임, 데이터 스튜어드 — 실무 관리, 거버넌스 위원회), 프로세스(표준 관리·품질 관리·변경 통제·이슈 관리). 관리 대상: 데이터 표준, 데이터 품질, 데이터 흐름, 메타데이터, 보안·프라이버시. DAMA-DMBOK 프레임워크를 준거로 함.",
      map: [
        { as: "데이터의 주인 지정", real: "데이터 오너십", note: "" },
        { as: "실무 관리자", real: "데이터 스튜어드", note: "조직" },
        { as: "정책·표준·지침", real: "원칙", note: "구성요소" },
        { as: "품질·변경 통제", real: "프로세스", note: "" },
      ],
      usage: "전사 데이터 관리·DX의 기반입니다. 시험은 3구성요소, 오너/스튜어드 역할, DAMA-DMBOK입니다.",
      links: [
        { topic: "데이터 표준화", how: "거버넌스가 통제하는 핵심 대상입니다." },
        { topic: "데이터 분석 거버넌스(Data Analytics Governance)", how: "분석 영역으로 확장한 거버넌스입니다." },
      ],
      exam: "데이터 거버넌스는 원칙·조직·프로세스로 데이터를 자산으로 통제하는 체계로, 데이터 오너·스튜어드가 표준·품질·보안을 관리하며 DAMA-DMBOK을 준거로 한다.",
    }, image: "/concept/book/db-governance.png", easy: "데이터 거버넌스는 전사 데이터에 대한 정책·지침·표준화·전략을 수립하고 관리 조직과 프로세스를 구축해, 고품질 데이터로 가치 창출을 지원하는 관리 체계입니다. 프레임워크는 신전 그림으로 기억하세요 — 지붕(데이터 관리 원칙), 그 아래 데이터 관리 조직, 여섯 기둥(데이터 표준·구조·흐름·품질·베이스·보안), 바닥(데이터 관리 프로세스와 인프라). 주요기능 [품메주보] — 품질 관리(DQM: 프로파일링·정제), 메타 데이터 관리, 데이터 주기 관리(생성부터 폐기까지), 보안 및 프라이버시(역할 기반 보호 수준). 성숙도는 도입 → 프로세스화 → 통합경영 → 위험대응 → 가치창출 5단계로, 단계가 오를수록 품질·통제·조직 부문이 전사 전략과 하나로 묶입니다." },
"db-profiling": {
    guide: {
      hook: "데이터의 실제 상태를 '통계로 진단'해 숨은 품질 문제를 찾아내는 작업입니다.",
      scene: "고객 테이블에 나이가 -5거나 999인 값, 빈 칸, 형식 안 맞는 이메일이 얼마나 있는지 눈으로는 모릅니다. 프로파일링은 값의 분포·패턴·결측·이상치를 자동 집계해 데이터의 건강 상태를 보여 줍니다.",
      why: "데이터 품질 진단의 첫 단계라는 위치와 분석 유형(칼럼·구조·관계)이 출제 포인트입니다. 품질관리·정제의 근거가 됩니다.",
      mechanism: "칼럼 분석(값 분포·최소·최대·결측률·유일값·패턴·이상치), 구조 분석(데이터 타입·길이·PK 후보·형식 준수), 관계 분석(테이블 간 참조 무결성·중복·종속성). 결과로 품질 규칙을 도출하고 정제(클렌징) 대상을 식별. 자동화 도구로 대량 데이터를 스캔.",
      map: [
        { as: "값 분포·결측·이상치", real: "칼럼 분석", note: "" },
        { as: "타입·PK 후보·형식", real: "구조 분석", note: "" },
        { as: "참조 무결성·중복", real: "관계 분석", note: "" },
        { as: "정제 대상 도출", real: "품질 규칙 발굴", note: "다음 단계" },
      ],
      usage: "데이터 품질관리·마이그레이션 전 필수입니다. 시험은 프로파일링 3유형, 품질관리와의 관계입니다.",
      links: [
        { topic: "데이터 거버넌스(Data Governance)", how: "품질 관리 프로세스의 진단 단계입니다." },
        { topic: "탐색적 데이터 분석과 확증적 데이터 분석", how: "탐색적 분석과 목적이 유사합니다." },
      ],
      exam: "데이터 프로파일링은 칼럼·구조·관계 분석으로 값 분포·결측·이상치·무결성을 통계 진단해 데이터 품질 문제를 식별하는 품질관리의 첫 단계다.",
    }, image: "/concept/book/db-profiling.png", easy: "데이터 품질 작업의 첫 단추 — 데이터를 고치기 전에 '어떤 상태인지'를 통계적으로 훑어보는 과정입니다. 절차 [수대수리종]: 메타데이터 수집 및 분석(사전 수집 테이블·컬럼 분석) → 대상 및 유형선정 → 수행(누락값·비유효값·무결성 위반 분석) → 결과 리뷰 → 결과 종합(보고서 작성). 정형 데이터 분석기술 [기컬패유구] — 기초데이터(컬럼속성), 컬럼값(누락값·허용범위), 컬럼패턴(문자열 패턴·날짜유형·특수도메인), 컬럼 유형(유일값), 테이블 구조 분석. 비정형 데이터 분석기술 [탐도이매] — 탐색기능(통계), 도메인 자동판별(분류 알고리즘), 이상값 탐지(시각화), 매칭 및 중복관리(유사도). 데이터 거버넌스의 DQM 기능 안에서 프로파일링이 실행된다는 연결고리도 기억해 두세요." },
"db-analytics-governance": {
    guide: {
      hook: "데이터 '분석'이 신뢰받고 재사용되도록 분석 자산·모델·프로세스를 통제하는 체계입니다.",
      scene: "부서마다 제각각 분석하면 같은 지표가 다른 값을 내고, 누가 만든 모델인지 추적도 안 됩니다. 분석 거버넌스는 분석 표준·지표 정의·모델 관리·재사용을 통제해 '믿을 수 있는 분석'을 만듭니다.",
      why: "데이터 거버넌스(원천 데이터)의 분석 영역 확장이라는 위치가 핵심입니다. 지표 표준화·모델 관리(MLOps)·분석 재현성이 출제 포인트입니다.",
      mechanism: "관리 대상: 분석 지표·정의 표준화(단일 진실), 분석 모델·알고리즘 관리(버전·성능·재현성), 분석 프로세스·품질, 분석 자산 재사용(카탈로그), 분석 윤리·설명가능성. 조직: 분석 거버넌스 위원회·데이터 분석가·스튜어드. AI/ML 확산으로 모델 거버넌스(MLOps·모델 리스크)와 결합.",
      map: [
        { as: "지표를 하나로 정의", real: "지표 표준화", note: "단일 진실" },
        { as: "모델 버전·성능 관리", real: "분석 모델 관리", note: "재현성" },
        { as: "분석 자산 재사용", real: "분석 카탈로그", note: "" },
        { as: "설명가능성·윤리", real: "분석 윤리", note: "AI 확장" },
      ],
      usage: "데이터 기반 의사결정·AI 도입 조직의 통제입니다. 시험은 데이터 거버넌스와의 차이(분석 영역), 지표·모델 관리, MLOps와의 관계입니다.",
      links: [
        { topic: "데이터 거버넌스(Data Governance)", how: "원천 데이터 거버넌스의 분석 확장입니다." },
        { topic: "데이터 분석 준비도와 데이터 분석 성숙도", how: "분석 역량 평가와 연계됩니다." },
      ],
      exam: "데이터 분석 거버넌스는 분석 지표·모델·프로세스·자산을 통제해 신뢰·재사용 가능한 분석을 만드는 체계로, 데이터 거버넌스를 분석 영역으로 확장하고 MLOps와 결합한다.",
    }, image: "/concept/book/db-analytics-governance.png", easy: "데이터 거버넌스가 '데이터 전반'을 다스린다면, 이건 '분석 활동'을 다스리는 체계입니다. 구성요소 [조프시데인] — 조직(분석기획·관리 수행), 프로세스(과제 기획 및 운영), 시스템(분석관리시스템), 데이터, 인력자원(분석교육·마인드 육성체계). 거버넌스 체계 [조프인수교] — 분석조직(데이터 분석 컨트롤 타워: 가치 발견·과제 정의·인사이트 실행), 프로세스(EDA 탐색적 분석과 CDA 확증적 분석: 요건정의→모델링→검증→적용), 분석전문인력(데이터 사이언티스트), 분석수준진단(준비도·성숙도 점검), 분석교육(가설 검증 능력 확보). 두음 두 개가 비슷하니 '구성요소는 시스템·데이터 포함(조프시데인), 체계는 인력·수준·교육 포함(조프인수교)'으로 구분하세요." },
"db-readiness-maturity": {
    guide: {
      hook: "조직이 '데이터 분석을 할 준비가 됐나(준비도)'와 '얼마나 성숙했나(성숙도)'를 진단하는 모델입니다.",
      scene: "분석을 시작하기 전에 우리 조직이 데이터·인력·인프라를 갖췄는지(준비도) 재고, 이미 하고 있다면 어느 수준까지 왔는지(성숙도) 단계로 평가해, 다음에 무엇을 보강할지 로드맵을 만듭니다.",
      why: "'준비도(현재 역량 점검) vs 성숙도(발전 단계)'의 구분과 사분면 매트릭스가 출제 핵심입니다. 분석 거버넌스·전략 수립의 진단 도구입니다.",
      mechanism: "준비도: 분석 업무·인력·기법·데이터·인프라 등 영역별 현재 역량 평가. 성숙도: 도입 → 활용 → 확산 → 최적화의 단계로 조직·역량 발전 수준을 진단(CMMI식). 두 축을 결합한 사분면(준비도 高/低 × 성숙도 高/低)으로 조직을 분류해 '정착형·준비형·확산형·도입형' 등 전략 방향 제시.",
      map: [
        { as: "지금 준비됐나", real: "분석 준비도", note: "현재 역량" },
        { as: "얼마나 발전했나", real: "분석 성숙도", note: "발전 단계" },
        { as: "도입→활용→확산→최적화", real: "성숙도 단계", note: "CMMI식" },
        { as: "사분면으로 진단", real: "준비도×성숙도 매트릭스", note: "전략 방향" },
      ],
      usage: "데이터 분석 전략 수립·역량 진단에 쓰입니다. 시험은 준비도와 성숙도의 구분, 성숙도 단계, 사분면 매트릭스입니다.",
      links: [
        { topic: "데이터 분석 거버넌스(Data Analytics Governance)", how: "역량 진단을 거버넌스에 반영합니다." },
        { topic: "데이터 마이닝 방법론", how: "분석 실행 방법론과 연계됩니다." },
      ],
      exam: "데이터 분석 준비도는 현재 분석 역량을, 성숙도는 도입·활용·확산·최적화의 발전 단계를 진단하며, 두 축의 사분면 매트릭스로 조직의 분석 전략 방향을 제시한다.",
    }, image: "/concept/book/db-readiness-maturity.png", easy: "우리 회사가 데이터 분석을 '도입할 준비가 됐는지'(준비도)와 '얼마나 잘 쓰고 있는지'(성숙도)를 진단하는 두 축입니다. 준비도 [업조기데문인] 6개 영역 — 분석 업무파악, 인력 및 조직, 분석 기법, 분석 데이터(MDM 포함), 분석 문화(직관보다 데이터), IT 인프라(EAI/ETL·빅데이터 환경). 성숙도 [도활확최]는 CMMI 기반 4단계 — 도입(시스템 구축) → 활용(업무적용) → 확산(전사공유) → 최적화(혁신·성과 기여), 대상 부문은 비즈니스·조직 및 역량·IT. 두 축을 교차하면 사분면 4유형 — 준비도만 높으면 도입형(바로 도입 가능), 둘 다 높으면 확산형, 둘 다 낮으면 준비형(사전 준비 필요), 성숙도만 높으면 정착형(1차적 정착 필요)입니다." },
"db-mining-methodology": {
    guide: {
      hook: "데이터에서 패턴·지식을 캐내는 프로젝트의 '표준 절차' — 대표는 CRISP-DM입니다.",
      scene: "무작정 데이터를 돌리면 헤맵니다. 방법론은 '비즈니스 문제 이해 → 데이터 이해·준비 → 모델링 → 평가 → 배포'의 단계를 정해, 분석 프로젝트가 목적을 놓치지 않고 반복·개선되게 합니다.",
      why: "CRISP-DM 6단계와 반복적 특성이 출제 핵심입니다. SEMMA·KDD 등 다른 방법론과의 비교가 포인트입니다.",
      mechanism: "CRISP-DM 6단계: ①비즈니스 이해(목표·성공기준) ②데이터 이해(수집·탐색) ③데이터 준비(정제·변환·피처) ④모델링(알고리즘 적용·튜닝) ⑤평가(목표 대비 검증) ⑥배포(운영 적용). 순환적(평가 후 비즈니스 이해로 되돌아감). 대안: SEMMA(SAS — 표본·탐색·수정·모델·평가), KDD(선택·전처리·변환·마이닝·해석).",
      map: [
        { as: "문제부터 정의", real: "① 비즈니스 이해", note: "목표" },
        { as: "정제·피처 만들기", real: "③ 데이터 준비", note: "가장 오래 걸림" },
        { as: "모델 적용·튜닝", real: "④ 모델링", note: "" },
        { as: "다시 문제로 순환", real: "반복적 특성", note: "" },
      ],
      usage: "데이터 마이닝·분석 프로젝트의 표준입니다. 시험은 CRISP-DM 6단계, SEMMA·KDD와의 비교, 순환적 특성입니다.",
      links: [
        { topic: "탐색적 데이터 분석과 확증적 데이터 분석", how: "데이터 이해·준비 단계와 연결됩니다." },
        { topic: "연관성 분석(association analysis) - 데이터마이닝", how: "모델링 단계의 대표 기법입니다." },
      ],
      exam: "데이터 마이닝 방법론은 CRISP-DM의 비즈니스 이해·데이터 이해·준비·모델링·평가·배포 6단계 순환 절차가 대표이며, SEMMA·KDD 등과 함께 분석 프로젝트를 체계화한다.",
    }, image: "/concept/book/db-mining-methodology.png", easy: "데이터에서 인사이트를 캐내는 표준 절차 3형제 — KDD, SEMMA, CRISP-DM입니다. KDD(1996, Fayyad)는 5개 프로세스: 데이터셋 선택 → 전처리(잡음·이상값·결측값 제거) → 변환(변수 선택·차원 축소) → 데이터 마이닝 → 결과 평가. SEMMA(SAS)는 이름 자체가 절차: Sampling(데이터 생성) → Explore(탐색·오류 검색) → Modify(수정·변환) → Modeling(Neural Network·Decision Tree로 모델 구축) → Assessment(평가·검증). CRISP-DM은 비즈니스 목적 중심의 계층적 모델로 4개 레벨(Phase → Generic Tasks → Specialized Tasks → Process Instances)과 6단계(비즈니스 이해 → 데이터 이해 → 데이터 준비 → 모델링 → 평가 → 전개)로 수행 — 단계마다 산출물(Quality Report, Model Assessment, Final Report 등)이 정해져 있다는 게 답안 포인트입니다." },
"db-eda-cda": {
    guide: {
      hook: "'데이터를 뒤져 가설을 찾는' 탐색적 분석과 '가설을 검증하는' 확증적 분석 — 방향이 반대입니다.",
      scene: "EDA는 형사가 단서를 뒤지며 '무슨 일이 있었나' 가설을 세우는 과정, CDA는 세운 가설을 통계 검정으로 '정말 맞나' 확인하는 과정입니다. 분석은 보통 EDA로 시작해 CDA로 결론짓습니다.",
      why: "'가설 생성(EDA) vs 가설 검증(CDA)'의 대비가 출제 핵심입니다. 시각화·기술통계(EDA)와 가설검정·추론통계(CDA)의 도구 차이가 포인트입니다.",
      mechanism: "EDA(탐색적 — Tukey): 시각화·기술통계로 데이터 분포·이상치·패턴·관계를 탐색해 가설을 생성, 선입견 없이 데이터가 말하게 함. CDA(확증적): 세운 가설을 표본으로 통계적 가설검정(t검정·ANOVA·회귀 등)해 유의성·인과를 확인, 추론통계로 모집단에 일반화. EDA→CDA 흐름이 일반적.",
      map: [
        { as: "단서 뒤져 가설 찾기", real: "EDA(탐색·가설 생성)", note: "시각화·기술통계" },
        { as: "가설이 맞나 검정", real: "CDA(확증·가설 검증)", note: "가설검정·추론통계" },
        { as: "선입견 없이 탐색", real: "EDA 철학", note: "Tukey" },
        { as: "먼저 탐색 후 확증", real: "EDA→CDA 흐름", note: "" },
      ],
      usage: "데이터 분석의 기본 흐름입니다. 시험은 EDA vs CDA(가설 생성/검증), 사용 도구·통계의 차이입니다.",
      links: [
        { topic: "데이터 시각화", how: "EDA의 핵심 도구입니다." },
        { topic: "데이터 마이닝 방법론", how: "데이터 이해 단계에서 EDA를 수행합니다." },
      ],
      exam: "탐색적 데이터 분석(EDA)은 시각화·기술통계로 가설을 생성하고, 확증적 데이터 분석(CDA)은 가설검정·추론통계로 가설을 검증하며, 보통 EDA에서 CDA로 진행한다.",
    }, image: "/concept/book/db-eda-cda.png", easy: "EDA(탐색적 데이터 분석)는 시각화로 데이터를 탐색해 패턴과 가설을 도출하는 기법이고(데이터 → 모형, Exploratory), CDA(확증적 데이터 분석)는 세운 가설을 통계 분석과 P-value 기준으로 검정하는 기법입니다(모형 → 데이터, Confirmatory). 교재는 이를 Statistics as Detective(탐정) vs Judge(판사)로 대비합니다. 기법도 대비되게: EDA는 히스토그램·줄기잎그림·상자수염그림·산점도 같은 시각화 도구, CDA는 t-test·F-test·ANOVA·상관/회귀분석·카이제곱검정 같은 검정 도구. 핵심요소는 EDA가 저항성·잔차 해석·재표현·현시성, CDA가 중심극한의 정리·P-value입니다. 데이터 분석 거버넌스의 프로세스 항목(EDA/CDA)과 연결해 두면 좋습니다." },
"db-visualization": {
    guide: {
      hook: "숫자를 '한눈에 보이게' 바꿔 통찰을 끌어내는 것 — 목적에 맞는 그래프 선택이 핵심입니다.",
      scene: "표에 숨은 추세·비교·분포는 눈으로 안 보이지만, 선그래프·막대·산점도로 바꾸면 즉시 드러납니다. 중요한 건 예쁜 그림이 아니라 '무엇을 말하려는지'에 맞는 표현을 고르는 것입니다.",
      why: "'분석 목적별 차트 유형' 매핑이 출제 핵심입니다. EDA의 핵심 도구이자, 잘못된 시각화(왜곡)의 위험도 포인트입니다.",
      mechanism: "목적별 유형: 비교(막대·방사형), 관계(산점도·버블), 분포(히스토그램·박스플롯), 시간(선그래프), 구성(파이·트리맵·누적막대), 공간(지도). 시각화 원칙: 데이터-잉크 비율(불필요 장식 제거), 정직성(축 조작 금지), 인지 편의. 대시보드로 실시간 모니터링, 인포그래픽으로 전달.",
      map: [
        { as: "크기 비교", real: "막대그래프", note: "비교" },
        { as: "두 변수 관계", real: "산점도", note: "관계" },
        { as: "시간 추세", real: "선그래프", note: "시간" },
        { as: "축 조작 금지", real: "시각화 정직성", note: "왜곡 위험" },
      ],
      usage: "EDA·보고·대시보드의 핵심입니다. 시험은 목적별 차트 매핑, 시각화 원칙, 왜곡 방지입니다.",
      links: [
        { topic: "탐색적 데이터 분석과 확증적 데이터 분석", how: "EDA의 핵심 도구가 시각화입니다." },
        { topic: "데이터 프로파일링(Data Profiling)", how: "분포·이상치 시각화로 진단합니다." },
      ],
      exam: "데이터 시각화는 분석 목적(비교·관계·분포·시간·구성)에 맞는 차트로 통찰을 전달하는 것으로, 데이터-잉크 비율·축 정직성 등 원칙을 지켜 왜곡을 피한다.",
    }, image: "/concept/book/db-visualization.png", easy: "데이터 시각화는 수집된 정보를 재조직하고 시각화하여 정보전달 효과를 극대화하는 프로세스입니다. 시각화 프로세스 [구시표] 3단계 — ① 정보 구조화(탐색·분류·배열로 그룹핑: 데이터 수집·분류(JSON/XML/CSV)·배열(래치 방법: 위치·알파벳·시간·카테고리·위계)·관계 탐색), ② 정보 시각화(막대·파이차트·스캐터·버블·히스토그램으로 시간·분포·관계를 직관적으로 표현), ③ 정보 시각 표현(타이포그래피·색상·그리드 같은 디자인 원리와 인터렉션 디자인으로 완성). 시각화로 인사이트를 얻는 절차는 [탐분활] — 탐색(데이터 확인·연결포인트·관계 탐색) → 분석(분석대상 정의·시각화 도구·지표설정) → 활용(내부적용·외부적용·인사이트 발전과 확장)입니다. '구조화 없이 그래프부터 그리면 안 된다'는 흐름이 출제 포인트입니다." },
"db-lakehouse": {
    guide: {
      hook: "데이터 레이크의 '유연성'과 데이터 웨어하우스의 '신뢰성'을 한 아키텍처에 합쳤습니다.",
      scene: "레이크는 아무 데이터나 싸게 담지만 정합성·성능이 약하고, 웨어하우스는 정형·빠르지만 비싸고 경직됩니다. 레이크하우스는 값싼 레이크 저장소 위에 트랜잭션·스키마·성능 계층을 얹어 둘의 장점을 합칩니다.",
      why: "'레이크 vs 웨어하우스 vs 레이크하우스'의 3자 비교가 출제 핵심입니다. 개방형 테이블 포맷(Delta·Iceberg·Hudi)과 ACID 지원이 포인트입니다.",
      mechanism: "구조: 저비용 오브젝트 스토리지(S3 등) + 메타데이터·트랜잭션 계층(Delta Lake·Apache Iceberg·Hudi — ACID·스키마 진화·타임트래블). 하나의 저장소로 BI(정형 분석)와 ML(비정형·대용량)을 동시 지원 → ETL 중복·데이터 사본 제거. 메달리온 아키텍처(Bronze-Silver-Gold)로 정제 단계 구성.",
      map: [
        { as: "아무거나 싸게 담기", real: "레이크의 유연성", note: "" },
        { as: "정형·빠른 분석", real: "웨어하우스의 신뢰성", note: "" },
        { as: "레이크 위 ACID 계층", real: "개방형 테이블 포맷", note: "Delta·Iceberg" },
        { as: "BI+ML 한 저장소", real: "사본·ETL 중복 제거", note: "핵심 이점" },
      ],
      usage: "현대 데이터 플랫폼(Databricks 등)의 표준입니다. 시험은 3자 비교, 개방형 테이블 포맷, 메달리온 아키텍처입니다.",
      links: [
        { topic: "아파치 카프카(Apache Kafka)", how: "레이크하우스로 스트리밍 데이터를 적재합니다." },
        { topic: "데이터 거버넌스(Data Governance)", how: "레이크하우스의 데이터 품질·통제가 필요합니다." },
      ],
      exam: "데이터 레이크하우스는 저비용 레이크 저장소에 Delta·Iceberg 같은 ACID 테이블 계층을 얹어 웨어하우스의 신뢰성과 레이크의 유연성을 결합해 BI·ML을 한 저장소에서 지원한다.",
    }, image: "/concept/book/db-lakehouse.png", easy: "데이터 레이크(정형·비정형 뭐든 원본으로 던져 넣는 호수)와 데이터 웨어하우스(주제지향·시계열로 정리된 창고)의 장점만 합친 하이브리드 플랫폼입니다. 개념도는 아래부터 데이터 레이크 계층 → 데이터 웨어하우스 계층 → Open API → BI·SQL 분석, 실시간 응용, 데이터 사이언스, 머신러닝 순으로 쌓입니다. 기술요소는 3그룹 — 수집·변환·처리(Batch Processing, CDC·CEP 기반 Streaming Processing), 저장 관리(ACID 트랜잭션으로 정확성 보장, 데이터 파이프라인, 스키마 레지스트리로 구조·포맷·변경 히스토리 통제), 서빙(REST·gRPC·JDBC/ODBC Open API, BI 도구·대시보드). '레이크의 유연함에 웨어하우스의 ACID·스키마 관리를 얹었다'가 한 줄 요약입니다." },
"db-kafka": {
    guide: {
      hook: "대량 이벤트를 '실시간 스트림'으로 안정적으로 주고받는 분산 메시징 플랫폼입니다.",
      scene: "수많은 시스템이 서로 데이터를 직접 주고받으면 거미줄이 됩니다. 카프카는 가운데 '거대한 로그 게시판'을 두고, 생산자는 이벤트를 올리고(발행) 소비자는 필요할 때 읽어 가(구독), 시스템을 느슨하게 연결합니다.",
      why: "발행-구독 모델과 핵심 개념(토픽·파티션·오프셋·컨슈머 그룹), 그리고 '로그 기반·재처리 가능'이 출제 핵심입니다. 이벤트 기반 아키텍처의 중추입니다.",
      mechanism: "구조: Producer가 Topic에 발행 → Topic은 여러 Partition으로 분산(병렬·순서는 파티션 내 보장) → 메시지는 디스크 로그에 보존(오프셋으로 위치) → Consumer Group이 파티션을 나눠 병렬 소비, 오프셋으로 재처리 가능. 브로커 클러스터·복제로 고가용. 높은 처리량·내구성이 강점.",
      map: [
        { as: "거대한 로그 게시판", real: "발행-구독(Pub-Sub)", note: "느슨한 결합" },
        { as: "주제별 채널", real: "토픽·파티션", note: "병렬" },
        { as: "읽은 위치 표시", real: "오프셋", note: "재처리 가능" },
        { as: "여러 소비자 분담", real: "컨슈머 그룹", note: "확장" },
      ],
      usage: "실시간 데이터 파이프라인·MSA 이벤트 백본입니다. 시험은 토픽·파티션·오프셋·컨슈머 그룹, 로그 기반 재처리, 이벤트 기반 아키텍처입니다.",
      links: [
        { topic: "데이터 레이크하우스(Data Lakehouse)", how: "카프카로 스트림을 레이크하우스에 적재합니다." },
        { topic: "SAGA 패턴", how: "MSA 이벤트 기반 트랜잭션에 카프카를 씁니다." },
      ],
      exam: "아파치 카프카는 토픽·파티션·오프셋·컨슈머 그룹 기반의 분산 발행-구독 메시징 플랫폼으로, 로그에 보존해 재처리가 가능하며 이벤트 기반 아키텍처의 중추가 된다.",
    }, image: "/concept/book/db-kafka.png", easy: "실시간 데이터 피드를 위한 발행-구독(Pub/Sub) 메시징 플랫폼입니다. 우체국 비유로 — producer(편지를 쓰는 사람)가 메시지를 만들어 broker(우체국, 클러스터 서버)에 보내면, broker가 topic(주소별 사서함)별로 분류해 저장하고, consumer(수신인)가 자기가 구독하는 topic의 메시지를 가져갑니다. 동작방식의 핵심은 4번 — 프로듀서는 컨슈머와 '관계없이' 보내고, 컨슈머도 프로듀서와 '관계없이' 가져온다는 비동기 완전 분리(디커플링)입니다. 메시지는 토픽이라는 식별자로 토픽 단위 저장되므로 수많은 메시지가 쌓여도 구분됩니다. 데이터 레이크하우스의 Streaming Processing(CDC 기반 실시간 수집)을 실제로 구현할 때 쓰는 대표 기술로 연결해 두세요." },
"db-public-quality": {
    guide: {
      hook: "공공데이터의 오류를 '사후 수정이 아니라 사전 예방'하도록 진단하는 정부 가이드입니다.",
      scene: "공공기관이 개방하는 데이터에 오류가 있으면 국민·기업이 그대로 피해를 봅니다. 이 가이드는 데이터가 생성·수집되는 단계에서부터 품질 문제를 미리 진단·차단하도록 예방 중심의 진단 절차를 제시합니다.",
      why: "'사후 정제 → 사전 예방'이라는 공공데이터 품질 관점이 핵심입니다. 진단 절차와 품질 기준(정확성·완전성 등)이 출제 포인트입니다.",
      mechanism: "예방적 품질관리: 데이터 생성·수집 시점에 품질 규칙을 내재화해 오류 유입을 차단. 진단 절차: 대상 선정 → 품질 진단(프로파일링·규칙 검증) → 원인 분석 → 개선(프로세스·시스템 보정) → 모니터링. 품질 기준: 정확성·완전성·일관성·유효성·유일성·적시성 등. 데이터 표준·거버넌스와 연계.",
      map: [
        { as: "생기기 전에 막기", real: "예방적 품질관리", note: "사전 vs 사후" },
        { as: "규칙으로 오류 차단", real: "품질 규칙 내재화", note: "" },
        { as: "정확·완전·일관", real: "품질 기준", note: "" },
        { as: "지속 점검", real: "모니터링", note: "" },
      ],
      usage: "공공기관 데이터 품질 관리의 진단 기준입니다. 시험은 예방적 관점, 진단 절차, 품질 기준입니다.",
      links: [
        { topic: "데이터 프로파일링(Data Profiling)", how: "품질 진단의 실행 기법입니다." },
        { topic: "공공데이터 품질인증 매뉴얼(2025.07.)", how: "품질 수준을 인증하는 짝 제도입니다." },
      ],
      exam: "공공데이터 예방적 품질관리 진단 가이드는 데이터 생성·수집 단계에서 품질 규칙을 내재화해 오류를 사전 차단하도록 진단 절차와 정확성·완전성 등 품질 기준을 제시한다.",
    }, image: "/concept/book/db-public-quality.png", easy: "공공데이터법 제22조에 근거해, 데이터 품질을 '사후에 고치는' 게 아니라 '만들 때부터 지키는' 예방적 진단 체계입니다. 진단영역 [표구값관] 4개 — 표준(데이터 표준화·공통 표준화·표준 관리 도구), 구조(설계·검증·관리 도구), 값(값 검증·이관 데이터 검증), 관리체계(표준·구조·연계·값 관리체계와 개방 관리체계). 구성체계는 진단영역 4 → 진단항목 10 → 진단기준 20으로 세분화됩니다. 구축 단계별 절차 [계발설개완] — 계획(ISP/ISMP로 개선 과제 정의) → 발주(개선과제를 요구사항으로, RFP·기술 협상서) → 설계(운영까지 품질 유지되는 유연한 설계) → 개발(테스트로 완성도 확보, 데이터 매핑서·진단 규격) → 완료(이관 완결성·관리체계 점검, 이행계획서)로, 단계마다 산출물이 정해져 있습니다." },
"db-quality-cert": {
    guide: {
      hook: "공공데이터가 '일정 품질 수준을 갖췄음'을 정부가 인증하는 제도의 실무 매뉴얼(2025.07)입니다.",
      scene: "예방 가이드가 '품질을 어떻게 관리하나'라면, 이 매뉴얼은 그 결과가 기준을 충족하는지 심사해 인증을 부여하는 절차입니다. 인증받은 데이터는 신뢰할 수 있는 자산으로 개방·활용됩니다.",
      why: "'품질관리(과정) vs 품질인증(결과 심사)'의 관계가 핵심입니다. 인증 절차·품질 기준·등급이 출제 포인트입니다.",
      mechanism: "인증 절차: 신청 → 품질 진단(품질 기준별 측정 — 프로파일링·규칙 검증) → 심사·평가(정량 지표로 등급 산정) → 인증 부여 → 사후관리(유효기간·재인증). 품질 기준: 정확성·완전성·일관성·유효성·유일성 등을 지표화해 충족률로 평가. 데이터 표준·거버넌스 준수를 전제.",
      map: [
        { as: "품질 결과 심사", real: "품질인증(결과)", note: "관리와 구분" },
        { as: "기준별 충족률 측정", real: "정량 진단·평가", note: "" },
        { as: "등급 부여", real: "인증 등급", note: "" },
        { as: "유효기간·재인증", real: "사후관리", note: "" },
      ],
      usage: "공공데이터 품질 대외 증명입니다. 시험은 예방 가이드(관리)와 인증(심사)의 관계, 인증 절차, 품질 지표입니다.",
      links: [
        { topic: "공공데이터 예방적 품질관리 진단 가이드", how: "관리 과정에 대응하는 인증 제도입니다." },
        { topic: "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)", how: "데이터 품질인증(DQ)과 유사 체계입니다." },
      ],
      exam: "공공데이터 품질인증 매뉴얼(2025.07)은 정확성·완전성 등 품질 기준을 정량 진단·평가해 공공데이터의 품질 수준을 인증·등급화하고 사후관리하는 실무 절차를 규정한다.",
    }, image: "/concept/book/db-quality-cert.png", easy: "공공데이터 품질인증은 공공데이터법에 따라 기관 전체의 품질관리 체계와 보유 DB 품질을 심사해 우수 기관에 인증을 부여하는 제도입니다(2025.11 ITPE 모의고사 출제). 심사 영역은 100점 구조입니다 — 관리체계(40점: 품질관리 계획, 보안체계, DB 관리 역량(10), 예방적 품질관리 진단, 표준관리체계, 표준 확산(9), 구조 안정화, 연계 관리), 값 관리(40점: 품질진단(15)·오류율(10)·결과 조치(15)), 개방 및 활용(20점: 개방 활성화(12)·활용 및 개선(8)). 등급은 두 단계 — 최우수는 값 관리 측면 DB 개별 점수 40점 만점 + 전체 만점의 95% 충족, 우수는 DB 개별 점수 만점의 90% 이상 + 전체 90% 이상. 앞의 '예방적 품질관리 진단'이 심사 항목 중 하나로 들어간다는 연결고리를 기억하세요." },
"db-public-std-guideline": {
    guide: {
      hook: "공공기관 DB의 용어·코드·구조를 통일하기 위한 정부의 표준화 지침(2023.04 개정)입니다.",
      scene: "기관마다 DB 용어·코드가 다르면 데이터 연계·개방이 막힙니다. 이 지침은 공공기관이 DB를 설계·운영할 때 지켜야 할 표준(용어·도메인·코드·구조)을 규정해, 기관 간 데이터가 통하게 만듭니다.",
      why: "공공 데이터 표준화의 제도적 근거라는 위치가 핵심입니다. 표준화 대상과 범정부 데이터 연계·개방과의 관계가 출제 포인트입니다.",
      mechanism: "규정 대상: 표준 용어·단어·도메인·코드(데이터 표준화 4대 요소), DB 명명 규칙, 메타데이터 관리, 표준 준수·변경 관리 절차. 목적: 기관 간 데이터 상호운용·연계·개방 지원, 중복 방지, 품질 향상. 데이터 거버넌스 조직과 범정부 표준(공통표준용어)과 연계.",
      map: [
        { as: "기관마다 다른 용어 통일", real: "표준 용어·코드", note: "4대 요소" },
        { as: "명명 규칙", real: "DB 명명 표준", note: "" },
        { as: "기관 간 연계", real: "상호운용·개방", note: "목적" },
        { as: "준수·변경 관리", real: "거버넌스 연계", note: "" },
      ],
      usage: "공공기관 DB 구축·운영의 표준 기준입니다. 시험은 표준화 4대 요소, 데이터 표준화·거버넌스와의 관계입니다.",
      links: [
        { topic: "데이터 표준화", how: "이 지침이 규정하는 대상입니다." },
        { topic: "데이터 거버넌스(Data Governance)", how: "표준 준수를 통제하는 체계입니다." },
      ],
      exam: "공공기관 데이터베이스 표준화지침은 표준 용어·단어·도메인·코드와 명명 규칙을 규정해 기관 간 데이터 상호운용·연계·개방을 지원하는 공공 표준화의 제도적 근거다.",
    }, image: "/concept/book/db-public-std-guideline.png", easy: "전자정부법 50조·공공데이터법 23조에 따라 공공기관 DB 표준화의 세부 사항을 정한 고시입니다. 2023년 4월 개정의 골자 — 관리항목 유연성 강화(별표 신설), 비표준데이터 관리체계 마련, 메타정보 관리항목 정비, 용어 정의 추가, 관리시스템 현행화. 실무 뼈대는 두 축입니다. ① 데이터 표준사전 관리항목: 표준 용어(용어명·영문명·도메인명·허용값 등), 표준 단어(형식단어 여부·이음동의어·금칙어), 표준 도메인(데이터타입·길이·저장/표현형식·단위), 표준 코드(코드값과 의미). ② 산출물 표준 관리항목: DB 정의서 → 논리모델 다이어그램 → 엔터티정의서 → 애트리뷰트 정의서 → 물리모델 다이어그램 → 테이블정의서 → 컬럼정의서(PK/AK/FK, 개인정보·암호화·공개 여부까지) — 논리에서 물리로 내려가는 설계 산출물 체계 그대로입니다." },
"db-dq-cert": {
    guide: {
      hook: "데이터 품질을 객관적 지표로 심사해 인증하는 'DQ인증' 가이드라인(2025.02.26)입니다.",
      scene: "우리 데이터가 믿을 만한지 대외에 증명하려면 제3자 심사가 필요합니다. DQ인증은 데이터 품질을 표준 기준으로 측정·심사해 인증을 부여하고, 신뢰할 수 있는 데이터임을 보증합니다.",
      why: "데이터 품질인증의 표준 프레임(공공·민간 공통)이라는 위치와 품질 기준·평가 체계가 출제 포인트입니다. 공공데이터 품질인증과의 관계가 핵심입니다.",
      mechanism: "품질 기준(예: 완전성·유일성·유효성·일관성·정확성·적시성 등 품질 진단 항목)을 지표화 → 데이터·관리 프로세스 양면을 심사(데이터 값 품질 + 품질관리 체계) → 등급·인증 부여 → 유효기간·사후관리. 데이터 프로파일링·품질 규칙으로 정량 측정하며 거버넌스 성숙도를 함께 평가.",
      map: [
        { as: "제3자 품질 심사", real: "DQ인증", note: "" },
        { as: "값 품질 + 관리 체계", real: "이원 심사", note: "" },
        { as: "지표별 정량 평가", real: "품질 기준 측정", note: "" },
        { as: "등급·사후관리", real: "인증 운영", note: "" },
      ],
      usage: "데이터 품질 대외 인증(공공·민간)입니다. 시험은 품질 기준, 데이터·프로세스 이원 심사, 공공데이터 품질인증과의 관계입니다.",
      links: [
        { topic: "공공데이터 품질인증 매뉴얼(2025.07.)", how: "공공 영역의 유사 인증 제도입니다." },
        { topic: "데이터 프로파일링(Data Profiling)", how: "품질 지표 측정의 기법입니다." },
      ],
      exam: "데이터 품질인증(DQ인증) 가이드라인은 완전성·정확성 등 품질 기준으로 데이터 값과 관리 체계를 이원 심사해 품질을 등급 인증하는 공공·민간 공통 프레임이다.",
    }, image: "/concept/book/db-dq-cert.png", easy: "DQ인증은 데이터 기본법 제20조 5항에 근거해 데이터 내용과 데이터 관리체계를 진단·평가하여 품질을 인증하는 민간 대상 제도입니다(2025.06 ITPE 모의고사 기출 — 공공데이터 품질인증과 구분!). 인증은 두 갈래 — ① 데이터 내용 인증: 유형은 Complex/Normal/Simple-Type, 심사 지표는 A/B/C Class, 정형 데이터 필수 지표는 완전성·유효성·일관성, 비정형은 완전성·유효성·정확성·유일성. ② 데이터 관리체계 인증: 등급은 Level 2~5, 성숙도 수준은 도입(1)→관리(2)→체계화(3)→예측화(4)→혁신화(5). 절차 [사계인품작심품보보]는 신청(사전협의→서류·계약) → 심사(인증계획→품질인증실시(서류·현장)→심사결과보고서, 미비 시 보완) → 심의(인증심의위원회 심의→인증서 발급)이고, 인증서는 3년 유효에 사후심사·갱신심사가 따라붙습니다." },
"db-value-assessment": {
    guide: {
      hook: "데이터를 '자산'으로 보고 그 경제적 가치를 정량 평가하는 방법입니다.",
      scene: "데이터가 자산이라면 얼마짜리인지 값을 매길 수 있어야 거래·투자·활용 판단이 됩니다. 데이터 가치 평가는 원가·시장·수익 관점 등으로 데이터의 값어치를 산정합니다.",
      why: "'데이터=자산'이라는 관점과 평가 접근법(원가·시장·수익)이 출제 핵심입니다. 데이터 거래·DaaP·데이터 경제와 연결됩니다.",
      mechanism: "평가 접근: 원가법(수집·구축 비용 기반), 시장법(유사 데이터 거래 가격 비교), 수익법(데이터가 창출할 미래 수익·활용 효과 현재가치화). 고려 요소: 품질·희소성·활용도·최신성·법적 이용 가능성. 데이터 특성(비소모·복제 가능·결합 시 가치 증대)이 전통 자산 평가와 다른 점.",
      map: [
        { as: "만드는 데 든 비용", real: "원가법", note: "" },
        { as: "비슷한 데이터 시세", real: "시장법", note: "" },
        { as: "미래 수익 환산", real: "수익법", note: "" },
        { as: "결합할수록 가치↑", real: "데이터 특성", note: "전통 자산과 차이" },
      ],
      usage: "데이터 거래·자산화·투자 판단에 쓰입니다. 시험은 3대 평가 접근법, 데이터 특성, DaaP·데이터 경제와의 관계입니다.",
      links: [
        { topic: "DaaP(Data as a product)", how: "데이터를 상품화·거래하는 개념과 연결됩니다." },
        { topic: "데이터 거버넌스(Data Governance)", how: "자산 관리 관점에서 가치 평가가 필요합니다." },
      ],
      exam: "데이터 가치 평가는 데이터를 자산으로 보고 원가·시장·수익 접근법으로 경제적 가치를 산정하는 방법으로, 결합 시 가치가 증대하는 데이터 특성을 고려한다.",
    }, image: "/concept/book/db-value-assessment.png", easy: "데이터 가치 평가는 데이터 기본법 14조에 근거해, 시장에서 거래되는 데이터의 경제적 가치를 가액·등급·점수로 평가하는 제도입니다. 평가기법 3대 접근법이 답안 핵심: 시장 접근법(유사 거래 사례 참고 — 사례 없으면 사용 불가), 수익 접근법(데이터 수명·가치 추정으로 수익 관점 평가 — 주관 개입 여지), 원가 접근법(역사적·재생산·대체 원가 — 경제적 효익 반영 불가). 각 기법의 '한계'까지 같이 외우세요. 가액·등급 산출의 핵심변수 [경할기] — 경제적 수명, 할인율, 기여도. 운영 축은 가치평가 자문단(위원장 포함 9명+간사 1명)과 평가기관(전문인력 6인 이상 상시 고용, 과기정통부가 지정). 절차는 평가의뢰부터 사후관리까지 9단계입니다." },
"db-association": {
    guide: {
      hook: "'맥주를 사면 기저귀도 산다'처럼 '함께 일어나는 규칙'을 찾는 데이터마이닝 기법입니다.",
      scene: "장바구니 데이터에서 어떤 상품이 같이 팔리는지 규칙을 찾아 진열·추천에 씁니다. '{A} → {B}' 규칙이 얼마나 자주(지지도), 얼마나 믿을 만하고(신뢰도), 우연 이상인지(향상도)로 평가합니다.",
      why: "3대 척도(지지도·신뢰도·향상도)의 정의와 해석이 출제 핵심입니다. Apriori·FP-Growth 알고리즘의 기반 개념입니다.",
      mechanism: "규칙 X→Y 평가: 지지도(Support — 전체 중 X,Y가 함께 나온 비율), 신뢰도(Confidence — X가 있을 때 Y가 있을 조건부 확률), 향상도(Lift — 신뢰도/Y의 지지도, 1이면 독립·>1 양의 상관·<1 음의 상관). 최소 지지도·신뢰도로 빈발 항목집합을 찾고 규칙 생성. 향상도로 '우연한 동반'을 걸러냄.",
      map: [
        { as: "함께 나온 비율", real: "지지도(Support)", note: "빈도" },
        { as: "A면 B일 확률", real: "신뢰도(Confidence)", note: "조건부" },
        { as: "우연 이상인가", real: "향상도(Lift)", note: ">1 상관" },
        { as: "장바구니 분석", real: "적용 사례", note: "" },
      ],
      usage: "추천·상품 진열·교차판매 분석입니다. 시험은 지지도·신뢰도·향상도 계산·해석, Apriori와의 관계입니다.",
      links: [
        { topic: "Apriori 알고리즘", how: "빈발 항목집합을 찾는 대표 알고리즘입니다." },
        { topic: "FP(Frequent Pattern)-Growth 알고리즘", how: "Apriori를 개선한 기법입니다." },
      ],
      exam: "연관성 분석은 항목이 함께 발생하는 규칙(X→Y)을 지지도·신뢰도·향상도로 평가하는 데이터마이닝 기법으로, 향상도가 1보다 크면 양의 상관을 뜻한다.",
    }, image: "/concept/book/db-association.png", easy: "'빵과 계란을 산 사람은 우유도 산다' — 장바구니 데이터에서 IF(선행 항목) → THEN(후행 항목) 규칙을 찾는 분석입니다. 3대 지표가 답안 핵심: 지지도(전체 거래 중 A·B가 함께 등장한 비율 — 얼마나 자주 같이?), 신뢰도(A가 발생했을 때 B도 발생할 확률), 향상도(B의 평소 빈도 대비 A가 있을 때 B의 발생 가능성 — 1보다 커야 '우연이 아닌 의미 있는 관계'). 보조 지표로 레버리지(함께 발생 확률과 독립 발생 확률의 차이)와 컨빅션(A는 발생했는데 B는 안 나올 확률의 예측 정확도)까지 쓰면 관계의 강도를 정교하게 해석합니다. 최소 지지도 이상이면 빈발규칙(맥주→땅콩, 추천·마케팅), 미만이면 비빈발규칙(캐비아→샴페인, 이상 탐지·프리미엄 고객 분석)으로 나눠 활용합니다." },
"db-apriori": {
    guide: {
      hook: "'빈발하지 않은 것의 상위집합도 빈발하지 않다'는 성질로 후보를 쳐내는 연관규칙 알고리즘입니다.",
      scene: "모든 상품 조합을 다 세면 폭발합니다. Apriori는 '{맥주}가 드물면 {맥주,기저귀}도 드물다'는 당연한 성질(반단조성)을 이용해, 빈발하지 않은 조합은 아예 후보에서 제외해 계산을 줄입니다.",
      why: "Apriori 원리(반단조성)로 탐색 공간을 줄이는 아이디어가 핵심입니다. DB를 여러 번 스캔하는 한계와 FP-Growth·DHP의 개선 배경이 출제 포인트입니다.",
      mechanism: "절차: 1-항목집합의 지지도 계산 → 최소 지지도 미만 제거 → 남은 것으로 (k+1)-항목집합 후보 생성 → 다시 스캔·가지치기 반복. 핵심 원리: 반단조성(Apriori property — 어떤 집합이 빈발하면 그 부분집합도 빈발, 대우로 부분집합이 비빈발이면 상위집합도 비빈발). 한계: 후보 생성·반복 DB 스캔으로 대용량에서 느림.",
      map: [
        { as: "드문 것의 확장도 드물다", real: "반단조성(Apriori 원리)", note: "가지치기 근거" },
        { as: "후보 만들고 스캔 반복", real: "레벨별 탐색", note: "" },
        { as: "최소 지지도 미달 제거", real: "가지치기", note: "" },
        { as: "DB 여러 번 스캔", real: "성능 한계", note: "FP-Growth로 개선" },
      ],
      usage: "장바구니 분석의 기본 알고리즘입니다. 시험은 반단조성 원리, 절차, DB 스캔 한계와 개선 알고리즘입니다.",
      links: [
        { topic: "연관성 분석(association analysis) - 데이터마이닝", how: "Apriori가 빈발 항목집합을 찾습니다." },
        { topic: "FP(Frequent Pattern)-Growth 알고리즘", how: "후보 생성 없이 개선한 기법입니다." },
      ],
      exam: "Apriori 알고리즘은 부분집합이 비빈발이면 상위집합도 비빈발이라는 반단조성으로 후보를 가지치기해 빈발 항목집합을 찾으며, 반복 DB 스캔이 한계다.",
    }, image: "/concept/book/db-apriori.png", easy: "Apriori는 후보 항목 집합을 만들고 최소 지지도 기준으로 가지치기하며 빈발 항목 집합을 찾아내는, 연관 규칙 탐사의 기본 알고리즘입니다(2025.04 모의고사 기출). 핵심 원리는 반(反)모노톤성(Anti-monotone property) — '빈발 집합의 하위 집합도 빈발하다'를 뒤집으면 '빈발하지 않은 집합을 포함한 상위 집합은 볼 필요도 없다'가 되어, 격자(null→A,B,C,D→AB→ABC→ABCD)에서 가지치기로 탐색 공간을 확 줄입니다. 절차 6단계: ① DB 스캔으로 항목별 빈도 수집 → ② 지지도 계산 → ③ 최소 지지도 이하 가지치기 → ④ 1-빈발 항목 집합 생성 → ⑤ 조합으로 후보 k-itemset 생성·검증 반복 → ⑥ 최대 빈발 항목 집합 도출. 약점은 후보 집합을 매번 만들며 DB를 여러 번 스캔한다는 것 — 이걸 개선한 게 DHP(해시)와 FP-Growth(후보 제거)입니다." },
"db-dhp": {
    guide: {
      hook: "해싱으로 후보를 미리 걸러 Apriori의 '후보 폭발'을 줄인 개선 알고리즘입니다.",
      scene: "Apriori는 후보 조합이 너무 많이 생깁니다. DHP는 스캔하면서 항목 조합을 해시 버킷에 세어 두고, 버킷 카운트가 최소 지지도 미만이면 그 조합 후보를 미리 제거(pruning)해 후보 수를 확 줄입니다.",
      why: "'해시 기반 후보 축소 + 트랜잭션 축소'라는 Apriori 개선 포인트가 출제됩니다. 특히 초기 2-항목집합 단계의 효율화가 핵심입니다.",
      mechanism: "Direct Hashing: k-항목집합을 세는 동안 (k+1)-조합을 해시 함수로 버킷에 매핑·카운트 → 다음 단계에서 버킷 카운트가 임계 미만인 조합은 후보에서 제외(특히 2-항목집합 후보 대폭 감소). Pruning: 빈발하지 않은 항목을 포함한 트랜잭션·항목을 제거해 이후 스캔 대상 축소. Apriori보다 초기 단계가 빠름.",
      map: [
        { as: "조합을 해시 버킷에 세기", real: "Direct Hashing", note: "후보 사전 축소" },
        { as: "버킷 미달 조합 제거", real: "후보 가지치기", note: "특히 2-항목" },
        { as: "쓸모없는 항목·거래 제거", real: "트랜잭션 축소", note: "Pruning" },
        { as: "Apriori 초기 단계 개선", real: "성능 향상", note: "" },
      ],
      usage: "연관규칙 마이닝 성능 개선입니다. 시험은 해싱 기반 후보 축소, Apriori 대비 개선점(2-항목집합)입니다.",
      links: [
        { topic: "Apriori 알고리즘", how: "DHP가 개선하는 기준 알고리즘입니다." },
        { topic: "FP(Frequent Pattern)-Growth 알고리즘", how: "또 다른 개선 방향(트리 기반)입니다." },
      ],
      exam: "DHP 알고리즘은 항목 조합을 해시 버킷에 카운트해 최소 지지도 미달 후보를 미리 제거하고 트랜잭션을 축소해 Apriori의 후보 생성 부담, 특히 2-항목집합 단계를 개선한다.",
    }, image: "/concept/book/db-dhp.png", easy: "Apriori의 '후보가 너무 많아지는' 문제를 해시로 푸는 개량형입니다(2025.04 모의고사 기출). 아이디어는 간단합니다 — (k+1)-항목 집합 후보를 만들 때 각 조합을 해시 함수로 해시 테이블 버킷에 매핑하고 출현 횟수(count)를 누적해 두면, count가 낮은 버킷에 속한 후보들은 볼 것도 없이 미리 가지치기할 수 있습니다. 절차: ① 첫 스캔으로 1-빈발 항목 집합 → ② 빈발 k-itemset 기반 (k+1) 후보 생성 → ③ 해시 버킷 매핑·count 누적 → ④ 저조한 버킷 가지치기 → ⑤ 재스캔으로 실제 빈발 (k+1)-항목 집합 결정 → ⑥ 최대 빈발 항목 집합 생성. 후보 집합(Candidate Itemset) 크기 자체를 줄여 Apriori보다 빠르다는 게 비교 포인트입니다." },
"db-fp-growth": {
    guide: {
      hook: "'후보 생성 없이' 트리로 빈발 패턴을 찾아 Apriori보다 빠른 알고리즘입니다.",
      scene: "Apriori는 후보를 만들고 DB를 반복 스캔해 느립니다. FP-Growth는 데이터를 딱 두 번 스캔해 압축 트리(FP-Tree)로 만든 뒤, 그 트리를 재귀적으로 파고들며 후보 없이 빈발 패턴을 직접 캡니다.",
      why: "'후보 생성 없음 + DB 2회 스캔'이라는 Apriori 대비 핵심 개선이 출제됩니다. FP-Tree 구조와 조건부 패턴 기반이 포인트입니다.",
      mechanism: "1차 스캔: 항목별 빈도 계산·정렬. 2차 스캔: 각 트랜잭션을 빈도순으로 FP-Tree에 삽입(공통 접두사 공유로 압축). 마이닝: 각 항목의 조건부 패턴 기반(Conditional Pattern Base)을 모아 조건부 FP-Tree를 만들고 재귀적으로 빈발 패턴 추출. 후보 생성·반복 스캔이 없어 대용량에서 Apriori보다 빠름(단, 트리가 크면 메모리 부담).",
      map: [
        { as: "압축 트리로 저장", real: "FP-Tree", note: "공통 접두사 공유" },
        { as: "딱 두 번만 스캔", real: "DB 2회 스캔", note: "Apriori 개선" },
        { as: "후보 안 만들고 직접", real: "후보 생성 없음", note: "핵심" },
        { as: "조건부로 재귀 추출", real: "조건부 패턴 기반", note: "" },
      ],
      usage: "대용량 연관규칙 마이닝의 표준입니다. 시험은 FP-Tree, DB 2회 스캔·후보 없음, Apriori 대비 장단점입니다.",
      links: [
        { topic: "Apriori 알고리즘", how: "FP-Growth가 개선하는 기준입니다." },
        { topic: "연관성 분석(association analysis) - 데이터마이닝", how: "빈발 패턴을 찾는 목적을 공유합니다." },
      ],
      exam: "FP-Growth는 DB를 두 번 스캔해 FP-Tree로 압축한 뒤 조건부 패턴 기반으로 후보 생성 없이 빈발 패턴을 추출하는 알고리즘으로, Apriori보다 빠르나 트리 메모리 부담이 있다.",
    }, image: "/concept/book/db-fp-growth.png", easy: "Apriori·DHP가 후보를 '만들고 검증'하는 반면, FP-Growth는 후보 생성 과정 자체를 제거합니다(2025.04 모의고사 기출). 트랜잭션 데이터를 FP-Tree라는 압축 트리로 바꾸는 게 핵심 — 빈발 항목만 남겨 지지도 내림차순으로 정렬한 뒤 트리에 넣으면 공통 항목은 같은 경로를 공유하고, 각 노드는 항목명+빈도수를 저장하며, 헤더 테이블이 같은 항목의 노드들을 링크로 연결합니다. 이후 특정 항목이 포함된 모든 경로를 모은 조건부 패턴 베이스를 만들고 → 그걸로 조건부 FP-Tree를 만들어 → 재귀적으로 빈발 패턴을 추출합니다. '압축(FP-Tree) + 분할정복(조건부 트리)으로 DB 스캔 2회면 끝'이 Apriori 대비 강점 요약입니다." },
"db-daap": {
    guide: {
      hook: "데이터를 '제품처럼' 만들어 관리·제공하는 데이터 메시의 핵심 개념입니다.",
      scene: "데이터를 그냥 쌓아 두는 게 아니라, 소비자가 바로 쓸 수 있게 문서·품질·접근을 갖춘 '상품'으로 취급합니다. 각 도메인 팀이 자기 데이터를 제품으로 책임지고 제공합니다 — 중앙 데이터팀 병목을 없애는 발상입니다.",
      why: "데이터 메시의 4원칙 중 하나라는 위치와 '데이터 제품'의 요건(발견·이해·신뢰 가능)이 출제 포인트입니다. 데이터 거버넌스·가치 평가와 연결됩니다.",
      mechanism: "데이터 메시 원칙: 도메인 소유권, 제품으로서의 데이터(DaaP), 셀프서비스 플랫폼, 연합 거버넌스. 데이터 제품 요건(DATSIS): 발견가능(Discoverable)·주소지정가능(Addressable)·신뢰가능(Trustworthy)·자기설명적(Self-describing)·상호운용(Interoperable)·보안(Secure). 도메인 팀이 데이터 제품 오너로서 품질·SLA·메타데이터를 책임.",
      map: [
        { as: "데이터를 상품으로", real: "제품으로서의 데이터", note: "데이터 메시" },
        { as: "도메인 팀이 소유", real: "도메인 오너십", note: "병목 제거" },
        { as: "발견·이해·신뢰 가능", real: "데이터 제품 요건", note: "DATSIS" },
        { as: "연합 거버넌스", real: "분산 통제", note: "" },
      ],
      usage: "데이터 메시 아키텍처·대규모 데이터 조직에 쓰입니다. 시험은 데이터 메시 4원칙, 데이터 제품 요건, 중앙집중 대비 이점입니다.",
      links: [
        { topic: "데이터 가치 평가", how: "데이터를 자산·상품으로 보는 관점을 공유합니다." },
        { topic: "데이터 거버넌스(Data Governance)", how: "연합 거버넌스로 데이터 메시를 통제합니다." },
      ],
      exam: "DaaP는 데이터를 발견·이해·신뢰 가능한 제품으로 도메인 팀이 소유·제공하는 데이터 메시의 핵심 원칙으로, 중앙 데이터팀 병목을 없애는 분산 데이터 아키텍처를 지향한다.",
    }, image: "/concept/book/db-daap.png", easy: "DaaP는 데이터를 단순한 저장 자산이 아니라 최종 사용자 중심의 독립적인 '제품'으로 관리하는 거버넌스·아키텍처 패러다임입니다(2025.11 모의고사 기출). 계층 구조: 원천 데이터(Source: 트랜잭션DB·Log·IoT센서) → 데이터플랫폼&거버넌스(표준화 저장소·CI/CD·접근제어) → 데이터제품(데이터셋+메타데이터+품질지표, API 제공, SLA 보장, Owner 지정!) → 데이터소비자(BI·AI모델·앱). 핵심원칙 4가지 — 도메인 소유권(데이터를 가장 잘 아는 팀이 직접 관리, 데이터 메시의 원칙), 데이터 제품('데이터셋'이 아니라 '사용자를 가진 제품'), 표준화&상호운용성(도메인 간 호환 공통 규칙), 관측 가능성(품질·지연·스키마 변동 모니터링). 데이터 메시·패브릭·리니지·카탈로그 같은 키워드와 세트로 출제됩니다." },
"mg-tech-debt": {
    guide: {
      hook: "'급하게 대충 짠 코드'가 나중에 이자처럼 불어나는 유지보수 부담 — 금융 빚에 빗댄 개념입니다.",
      scene: "마감에 쫓겨 임시방편으로 코드를 짜면 당장은 빠릅니다. 하지만 그 부실이 쌓이면 나중에 수정·확장할 때마다 시간이 더 들어(이자), 방치하면 눈덩이처럼 커집니다. 이를 갚는 것이 리팩토링입니다.",
      why: "'부채(원금)+이자(누적 비용)'라는 비유 구조와 유형(의도적/비의도적), 관리 방법이 출제 포인트입니다. 리팩토링·품질과 연결됩니다.",
      mechanism: "유형(마틴 파울러 4분면): 의도적/비의도적 × 신중한/무모한. 발생: 설계 미흡·문서 부재·테스트 부족·구식 기술. 측정: 정적 분석(코드 복잡도·중복·냄새), SonarQube 등. 관리: 가시화(부채 목록·백로그), 우선순위화, 지속적 리팩토링, 예방(코드 리뷰·테스트·표준). 방치하면 개발 속도 저하·장애 증가.",
      map: [
        { as: "급하게 진 빚", real: "기술 부채(원금)", note: "" },
        { as: "갚을 때마다 더 드는 비용", real: "이자(누적 유지비)", note: "핵심" },
        { as: "의도적 vs 무모한", real: "부채 4분면", note: "파울러" },
        { as: "빚 갚기", real: "리팩토링", note: "" },
      ],
      usage: "SW 품질·유지보수 관리의 핵심 개념입니다. 시험은 부채 비유, 4분면, 측정·관리 방법입니다.",
      links: [
        { topic: "소프트웨어 리팩토링", how: "기술 부채를 갚는 대표 기법입니다." },
        { topic: "DevSecOps", how: "지속적 품질 관리로 부채를 예방합니다." },
      ],
      exam: "기술 부채는 급한 개발로 생긴 부실이 이자처럼 유지보수 비용을 늘리는 것으로, 의도/무모함 4분면으로 분류하고 정적 분석 측정·지속적 리팩토링으로 관리한다.",
    }, image: "/concept/book/mg-tech-debt.png", easy: "기술 부채는 SW 개발 전 과정에서 장기적 해법 대신 임시방편을 선택한 대가로 나중에 발생하는 추가 위험 비용입니다 — 빚에 이자가 붙는 것과 같은 구조입니다. 원인 4가지 — Business Pressure(무리한 일정·적은 예산), Low Technology Maturity(잘못된 아키텍처·경험 부족), Frequent Requirement Changes(코드 복잡성 상승·낮은 테스트 커버리지), Lack of Experts(부족한 테스팅·스파게티 코드). 유형은 설계(모듈성 부족)·코드(정적 분석/컨벤션 위반)·테스트(방법론 부재)·문서(산출물 누락) 부채 4가지. 관리방안은 부채 추정(SonarQube·Coverity 정적 분석) → 우선순위화 → 템플릿 통합(Prettier·Lint) → 기술 업데이트(도커·k8s) → 리팩토링과 테스팅(Peer Review·Inspection). 사분면 그림 — 보이는 긍정=Feature, 안 보이는 긍정=Architecture, 보이는 부정=Bug, 안 보이는 부정=Technical Debt — 가 시험 단골입니다." },
"mg-living-lab": {
    guide: {
      hook: "실험실이 아니라 '실제 생활 현장'에서 사용자와 함께 혁신을 실험하는 개방형 방법입니다.",
      scene: "새 서비스를 연구소에서만 개발하면 현실과 동떨어집니다. 리빙랩은 주민·시민이 실제 생활 공간에서 직접 써 보며 문제를 발굴·개선하는 사용자 참여형 실험장입니다. S.O.S랩은 사회문제 해결형 리빙랩입니다.",
      why: "'사용자 참여·현장 실증'이라는 특징과 개방형 혁신·4중 나선(정부·기업·대학·시민)이 출제 포인트입니다.",
      mechanism: "특징: 실제 환경(Real-life setting)에서 사용자를 공동 창조자(co-creator)로 참여, 다중 이해관계자 협력(Quadruple Helix — 정부·산업·학계·시민), 반복적 실증(탐색→실험→평가). S.O.S(Solving Our Society)랩: 국민 생활 문제를 시민 참여로 해결하는 한국형 리빙랩. 스마트시티·복지·환경 등에 적용.",
      map: [
        { as: "실제 생활 현장 실험", real: "Real-life setting", note: "핵심" },
        { as: "시민이 공동 개발자", real: "사용자 참여(co-creation)", note: "" },
        { as: "정부·기업·대학·시민", real: "4중 나선", note: "" },
        { as: "사회문제 해결형", real: "S.O.S랩", note: "" },
      ],
      usage: "스마트시티·사회혁신·공공서비스 개발입니다. 시험은 사용자 참여·현장 실증, 4중 나선, S.O.S랩입니다.",
      links: [
        { topic: "디자인 씽킹(Design Thinking)", how: "사용자 중심 문제 해결을 공유합니다." },
        { topic: "시빅 해킹(Civic Hacking)", how: "시민 참여 문제 해결과 연결됩니다." },
      ],
      exam: "리빙랩은 실제 생활 현장에서 시민을 공동 창조자로 참여시켜 반복 실증하는 개방형 혁신 방법으로, 정부·산업·학계·시민의 4중 나선 협력을 특징으로 하며 S.O.S랩은 사회문제 해결형이다.",
    }, image: "/concept/book/mg-living-lab.png", easy: "리빙랩은 '실험실이 아니라 생활 현장'에서 공공·기업·시민이 함께 문제를 푸는 사용자 주도형 연구소, S.O.S랩은 지역사회 문제를 '소프트웨어로' 해결하는 사회문제 연구소입니다. 리빙랩 프로세스 [기탐실평공] — 운영 기획(문제 구체화·사용자 그룹 선정) → 대안 탐색(아이디어 발굴·개념화) → 대안 실험(프로토타입 개발·테스트) → 대안 평가(실증·확산), 전 과정에 피드백과 공동 창조(co-creation)가 순환합니다. S.O.S랩 [조개구실공사] — 조직화→개념화→구체화→실체화→공유화→사업화, Problem에서 Value로 가되 바탕은 '공감'. 비교표 핵심: 리빙랩은 Bottom-up 나선 모델, SOS랩은 Top-down & Bottom-up 병행에 지역 SW혁신 생태계 구축(상용 플랫폼)이 목적입니다." },
"mg-itil4": {
    guide: {
      hook: "IT 서비스 관리의 국제 모범사례 — 4.0은 '가치 공동창출'과 애자일·데브옵스를 품었습니다.",
      scene: "ITIL은 IT 서비스를 어떻게 기획·제공·개선할지 정리한 베스트 프랙티스 모음입니다. v3의 서비스 생명주기에서, 4.0은 서비스 가치 시스템(SVS)과 유연한 실천(practice)으로 바꿔 디지털·애자일 시대에 맞췄습니다.",
      why: "'v3→4.0 변화(가치 공동창출·SVS·4차원)'가 출제 핵심입니다. 서비스 가치 사슬과 7대 지도 원칙이 포인트입니다.",
      mechanism: "핵심: 서비스 가치 시스템(SVS) — 기회/수요 → 서비스 가치 사슬(계획·개선·참여·설계전환·확보구축·제공지원) → 가치. 4차원(조직·정보기술·파트너·가치흐름). 7 지도 원칙(가치 집중·현 상태서 시작·반복 진행·협업·전체론·단순 실용·최적 자동화). 34개 실천(practice). 애자일·린·데브옵스 통합. v3의 26 프로세스 → 유연한 실천으로.",
      map: [
        { as: "가치를 함께 만든다", real: "가치 공동창출·SVS", note: "4.0 핵심" },
        { as: "6개 활동의 가치 사슬", real: "서비스 가치 사슬", note: "" },
        { as: "조직·기술·파트너·흐름", real: "4차원", note: "" },
        { as: "34개 유연한 실천", real: "practice", note: "v3 프로세스 대체" },
      ],
      usage: "IT 서비스 관리 체계의 기준입니다. 시험은 v3→4.0 변화, SVS·가치사슬, 지도 원칙입니다.",
      links: [
        { topic: "ITSM(Information Technology Service Management)", how: "ITIL은 ITSM의 대표 프레임워크입니다." },
        { topic: "서비스 수준 관리 (SLM, Service Level Management)", how: "ITIL의 핵심 실천 영역입니다." },
      ],
      exam: "ITIL 4.0은 서비스 가치 시스템(SVS)과 가치 사슬·4차원·7지도원칙·34실천으로 재구성한 IT 서비스 관리 모범사례로, v3의 생명주기를 애자일·데브옵스와 통합했다.",
    }, image: "/concept/book/mg-itil4.png", easy: "IT 서비스 관리(ITSM)의 교과서 격인 Best Practice 모음, 4.0 버전입니다. 뼈대는 서비스 가치 시스템(SVS) [지거서지실] — 지도 원칙(어떤 상황에서든 통하는 7가지 원칙), 거버넌스(감독·통제 수단), 서비스 가치 사슬(가치 실현 6가지 활동), 지속적인 개선, 실행(34가지 Practices). 서비스를 보는 렌즈는 4차원 모델 [조정파가] — 조직과 사람, 정보 및 기술, 파트너 및 공급업체(SIAM 프레임워크), 가치 흐름과 프로세스. 중심축인 서비스 가치사슬 [계참설획제개]은 계획→참여→설계 및 전환→획득/구축→제공 및 지원→개선 6활동이 Demand에서 Value까지 이어지는 구조입니다. 'ITIL은 지침서, ITSM은 그걸로 만드는 관리 체계'라는 관계로 다음 토픽과 연결됩니다." },
"mg-itsm": {
    guide: {
      hook: "IT를 '기술'이 아니라 '서비스'로 보고 고객 관점에서 관리하는 체계입니다.",
      scene: "서버·네트워크를 잘 돌리는 게 목적이 아니라, 사용자가 필요한 IT 서비스를 안정적으로 받는 게 목적입니다. ITSM은 프로세스·조직·기술을 갖춰 IT를 서비스로 기획·제공·운영·개선합니다.",
      why: "'기술 중심 → 서비스 중심' 패러다임과 핵심 프로세스(사고·문제·변경·구성 관리)가 출제 포인트입니다. ITIL과의 관계가 핵심입니다.",
      mechanism: "핵심 프로세스: 사고 관리(Incident — 신속 복구), 문제 관리(Problem — 근본원인 제거), 변경 관리(Change — 위험 통제 하 변경), 구성 관리(CMDB — 자산·구성 추적), 릴리스·배포, 서비스 수준 관리(SLM). 지원 도구(ITSM 툴), SPOC(단일 창구 서비스 데스크). ITIL·ISO 20000을 준거 프레임워크로 함.",
      map: [
        { as: "빠른 복구", real: "사고 관리(Incident)", note: "" },
        { as: "근본원인 제거", real: "문제 관리(Problem)", note: "" },
        { as: "안전한 변경", real: "변경 관리(Change)", note: "" },
        { as: "자산·구성 추적", real: "구성 관리(CMDB)", note: "" },
      ],
      usage: "기업 IT 운영의 표준 체계입니다. 시험은 서비스 중심 관점, 핵심 프로세스, ITIL·ISO 20000과의 관계입니다.",
      links: [
        { topic: "ITIL(IT Infrastructure Library) 4.0", how: "ITSM의 대표 모범사례 프레임워크입니다." },
        { topic: "서비스 수준 관리 (SLM, Service Level Management)", how: "ITSM의 핵심 프로세스입니다." },
      ],
      exam: "ITSM은 IT를 고객 관점의 서비스로 관리하는 체계로 사고·문제·변경·구성 관리 등 프로세스를 갖추며, ITIL·ISO 20000을 준거로 한다.",
    }, image: "/concept/book/mg-itsm.png", easy: "고객과 합의한 SLA 수준에 맞게 프로세스·조직·자원·기술을 종합 관리하는 IT 서비스 관리 체계입니다. 프레임워크 지도를 그려보면 — ITIL(Best Practice 지침서), eSCM/ISO20000(아웃소싱 제공업자 능력 평가), CMMI·SPICE(품질·성숙도 모델), SLM·SLA·SoW(서비스 수준 측정)가 사방에서 ITSM을 떠받칩니다. SLA는 사용자와 공급자가 서비스 수준을 명시적으로 정의해 문서화한 약정서 — 업무 목표(서비스 정의·기본계약서·서비스 카탈로그), 성과 지표(SOW·SLO·SLM·SLR), 조정 절차(변경 절차·유효 기간)로 구성됩니다. 주요지표 공식은 답안에 그대로 쓰입니다: 서비스 가동률(%) = (1−장애시간/서비스시간)×100, SR 적기 처리율(%) = 적기 처리 SR/전체 SR×100, 고객 만족도는 100점 만점." },
"mg-slm": {
    guide: {
      hook: "'약속한 서비스 품질(SLA)을 지키는지' 측정·관리하는 프로세스입니다.",
      scene: "IT 서비스에 '가용성 99.9%' 같은 목표를 정하고(SLA), 실제로 지켜지는지 측정하고, 미달하면 개선합니다. 서비스 제공자와 고객 사이의 품질 약속을 관리하는 게 SLM입니다.",
      why: "SLA·OLA·UC의 계층 관계와 SLM 사이클(정의·측정·보고·개선)이 출제 포인트입니다. ITIL·ITSM의 핵심입니다.",
      mechanism: "계약 계층: SLA(Service Level Agreement — 제공자↔고객 서비스 목표), OLA(Operational Level Agreement — 내부 부서 간), UC(Underpinning Contract — 외부 공급자와). SLM 활동: 서비스 목록·SLR(요구) 파악 → SLA 협상·정의 → 모니터링·측정(가용성·응답시간) → 서비스 리뷰·보고 → 개선(SIP). SLA 위반 시 페널티·개선계획.",
      map: [
        { as: "고객과 품질 약속", real: "SLA", note: "제공자↔고객" },
        { as: "내부 부서 간 약속", real: "OLA", note: "" },
        { as: "외부 공급자 계약", real: "UC", note: "" },
        { as: "측정·보고·개선", real: "SLM 사이클", note: "" },
      ],
      usage: "IT 서비스 품질 관리·계약입니다. 시험은 SLA/OLA/UC 계층, SLM 사이클입니다.",
      links: [
        { topic: "ITSM(Information Technology Service Management)", how: "SLM은 ITSM의 핵심 프로세스입니다." },
        { topic: "ITIL(IT Infrastructure Library) 4.0", how: "ITIL의 서비스 수준 관리 실천입니다." },
      ],
      exam: "SLM은 SLA(고객)·OLA(내부)·UC(외부)의 서비스 목표를 정의·측정·보고·개선하는 프로세스로, 위반 시 페널티·개선계획을 통해 서비스 품질을 관리한다.",
    }, image: "/concept/book/mg-slm.png", easy: "SLM은 사용자 관점에서 서비스 요구사항을 파악하고, 서비스 수준의 측정과 개선 우선순위를 관리하는 도구이자 체계입니다. SLA가 '계약서'라면 SLM은 그 계약을 지키게 만드는 관리 활동입니다. 개념도 구조가 핵심 — 사용자·고객은 관리조직과 SLA로 소통(SLA 협상·수준 예측·보고)하고, 관리조직은 운영조직과 OLA로 소통(서비스 운영·수준 관리·측정)합니다. 구성요소 [카스(에)오 플로(리)엔] 6가지 — Service Catalog(제공 서비스 전체 목록), SLA(외부 업체 간 계약서), OLA(내부 부서 간 협약서 — SLA와의 내/외부 구분이 단골 문제!), Service Quality Plan(수준 보장 내부 계획), Service Report(주기적 위반 검토), SLM 엔진(지표별 측정치 산출·보고 자동화·실시간 모니터링). 측정지표는 HW(가동률·동일장애발생률), SW(오류건수·SR 적기 처리율), NW(가동률·장애건수)로 ITSM 지표와 세트로 외우면 됩니다." },
"mg-bcp": {
    guide: {
      hook: "재해가 나도 '핵심 업무를 계속하거나 빨리 복구'하도록 미리 세우는 사업 연속성 계획입니다.",
      scene: "화재·지진·해킹으로 시스템이 멈춰도 회사는 굴러가야 합니다. BCP는 무엇이 핵심 업무인지 파악하고(BIA), 목표 복구 시간을 정하고(RTO/RPO), 대체 수단과 절차를 미리 마련해 둡니다.",
      why: "BCP 수립 절차와 BIA·RTO/RPO·DRS와의 관계가 출제 핵심입니다. '업무 연속성(BCP) vs 시스템 복구(DRP)'의 구분이 포인트입니다.",
      mechanism: "수립 절차: 정책·범위 → BIA(핵심 업무·영향·복구 목표 도출) → 위험 평가 → 연속성 전략 수립(대체 사이트·백업·인력) → 계획 문서화(BCP/DRP) → 훈련·테스트 → 유지·개선. 핵심 지표: RTO(복구 목표 시간), RPO(복구 목표 시점=데이터 손실 허용), MTPD·MBCO. DRP(IT 시스템 복구)는 BCP의 하위. ISO 22301 표준.",
      map: [
        { as: "핵심 업무 파악", real: "BIA", note: "선행 분석" },
        { as: "얼마 만에 복구", real: "RTO", note: "시간 목표" },
        { as: "어디까지 데이터 복구", real: "RPO", note: "손실 허용" },
        { as: "시스템 복구는 하위", real: "DRP", note: "BCP ⊃ DRP" },
      ],
      usage: "재해·위기 대응 체계의 근간입니다. 시험은 수립 절차, BIA·RTO/RPO, BCP vs DRP, ISO 22301입니다.",
      links: [
        { topic: "BIA (Business Impact Analysis)", how: "BCP 수립의 핵심 선행 분석입니다." },
        { topic: "DRS (Disaster Recovery System)", how: "BCP의 IT 복구 인프라입니다." },
      ],
      exam: "BCP는 재해 시 핵심 업무를 지속·복구하기 위한 사업 연속성 계획으로, BIA로 핵심 업무·RTO/RPO를 도출하고 대체 전략·훈련을 포함하며 IT 복구 DRP를 하위로 둔다.",
    }, image: "/concept/book/mg-bcp.png", easy: "재해가 나도 사업을 멈추지 않기 위한 종합 계획입니다. 큰 흐름은 위기 분석(취약성·업무 분석, BIA·CBA·리스크 관리) → 전략 수립(업무별 복구 전략, Risk Mitigation, BCP 전략) → 계획 수립(상시 운영·대응/복구·복구 진행·위기 상황 전달) → 실행(훈련·학습·Plan Backup) 4단계. 아래층에는 범위가 넓어지는 4가지 계획이 있습니다 — 재해복구(핵심업무 지원 어플리케이션 → 재해복구 계획), 업무복구(핵심 프로세스), 업무재개(업무 프로세스 전반 → 대체프로세스 계획), 비상계획(내/외부 사건 → 업무비상 계획). 복구 목표 지표 4종(RPO·RTO·RSO·RCO)과 DR 사이트 유형(구축: Mirror/Hot/Warm/Cold, 운영: 상호계약·공동이용·외부위탁·독자구축)은 BIA·DRS 토픽과 세트로 이어집니다." },
"mg-bia": {
    guide: {
      hook: "'어느 업무가 멈추면 얼마나 큰일 나는지'를 분석해 복구 우선순위를 정하는 작업입니다.",
      scene: "모든 업무를 똑같이 지킬 순 없습니다. BIA는 각 업무가 중단됐을 때의 재무·법적·평판 영향을 시간에 따라 분석해, 무엇을 먼저 얼마나 빨리 복구해야 하는지(RTO·RPO)를 정합니다 — BCP의 뼈대입니다.",
      why: "'핵심 업무·복구 목표 도출'이라는 BCP 선행 분석 위치가 출제 핵심입니다. 영향도 분석과 RTO/RPO 산출이 포인트입니다.",
      mechanism: "절차: 업무 식별 → 중단 영향 분석(시간 경과별 재무·운영·법규·평판 손실) → 핵심 업무 선정·우선순위 → 복구 목표 설정(RTO·RPO·MTPD·MBCO) → 자원 요구 파악(인력·시스템·데이터). 결과가 연속성 전략·DRS 설계의 근거. 정량(손실액)·정성(평판) 평가 병행.",
      map: [
        { as: "멈추면 얼마나 손해", real: "중단 영향 분석", note: "시간별" },
        { as: "무엇을 먼저 복구", real: "핵심 업무 우선순위", note: "" },
        { as: "언제까지·어디까지", real: "RTO/RPO 도출", note: "" },
        { as: "BCP의 뼈대", real: "선행 분석", note: "" },
      ],
      usage: "BCP·재해복구 설계의 필수 단계입니다. 시험은 영향 분석, RTO/RPO 산출, BCP와의 관계입니다.",
      links: [
        { topic: "BCP (Business Continuity Planning)", how: "BIA가 BCP 수립의 선행 분석입니다." },
        { topic: "BCP 지표 중 MBCO, MTPD, MAO", how: "BIA에서 도출하는 복구 지표입니다." },
      ],
      exam: "BIA는 업무 중단의 시간별 영향을 분석해 핵심 업무와 복구 목표(RTO·RPO·MTPD)를 도출하는 BCP의 선행 분석으로, 연속성 전략·DRS 설계의 근거가 된다.",
    }, image: "/concept/book/mg-bia.png", easy: "BIA는 재난·비상상황이 각 업무에 미치는 영향도를 평가해 복구 우선순위와 복구 목표를 정의하는 분석 활동입니다 — BCP 수립의 첫 단계입니다. 절차는 비즈니스 분석(기능 정의·분할·의존성) → 비즈니스 평가(설문·영향도 측정) → 우선순위 도출 → 복구자원 분석(민감 사업의 RTO·RPO). 지표 7종을 구분해서 외우세요: RPO(데이터가 복구되어야 하는 시점), RTO(업무가 복구될 때까지 시간), RSO(복구 범위 — 계정계·정보계·대외계), RCO(NW 정상 가동 재개 목표), BCO(백업 센터 구축 목표), MBCO(최소 연속성 목표), MTPD(최대허용 중단기간). 최종등급 표가 답안 킬러 — 1등급 부분/국지적(RTO=8H, Cold Site, 테스트계)부터 4등급 광범위/전파(RTO=2H·RPO=2H, Mirror Site, 온라인 쇼핑몰)까지, 중요할수록 목표시간이 짧아지고 사이트가 뜨거워집니다." },
"mg-mbco-mtpd-mao": {
    guide: {
      hook: "BCP의 복구 목표를 재는 3지표 — '언제까지 멈춰도 되나(MTPD)'와 '최소 얼마는 돌려야 하나(MBCO)'입니다.",
      scene: "업무가 멈췄을 때, 이 시간을 넘기면 회사가 위태로운 한계선(MTPD/MAO)이 있고, 복구하더라도 처음부터 100%가 아니라 최소한 이만큼은 돌려야 하는 수준(MBCO)이 있습니다. 이 목표들이 복구 전략을 좌우합니다.",
      why: "세 지표의 정의 구분과 RTO와의 관계(RTO ≤ MTPD)가 출제 핵심입니다. BIA에서 도출됩니다.",
      mechanism: "MTPD(Maximum Tolerable Period of Disruption — 최대 허용 중단 시간, 이를 넘으면 조직 생존 위협), MAO(Maximum Acceptable Outage — MTPD와 사실상 동의어). MBCO(Minimum Business Continuity Objective — 중단 중/복구 시 유지해야 할 최소 서비스 수준). 관계: RTO(복구 목표 시간)는 MTPD보다 작아야 함(RTO < MTPD). 복구는 MBCO를 먼저 달성 후 정상화.",
      map: [
        { as: "이 시간 넘기면 위험", real: "MTPD/MAO", note: "최대 허용 중단" },
        { as: "최소한 이만큼은 유지", real: "MBCO", note: "최소 서비스 수준" },
        { as: "MTPD 안에 복구", real: "RTO < MTPD", note: "관계" },
        { as: "BIA에서 도출", real: "복구 지표", note: "" },
      ],
      usage: "BCP 복구 목표 설정입니다. 시험은 MTPD/MBCO/MAO 정의, RTO와의 관계입니다.",
      links: [
        { topic: "BIA (Business Impact Analysis)", how: "이 지표들을 BIA에서 도출합니다." },
        { topic: "BCP (Business Continuity Planning)", how: "복구 전략의 목표 값입니다." },
      ],
      exam: "MTPD(MAO)는 조직 생존을 위협하지 않는 최대 허용 중단 시간, MBCO는 중단 중 유지할 최소 서비스 수준이며, 복구 목표 RTO는 MTPD보다 작아야 한다.",
    }, image: "/concept/book/mg-mbco-mtpd-mao.png", easy: "업무 연속성의 최소 수준(MBCO), 최대 허용 중단기간(MTPD·MAO), 복구 목표(RTO·RPO)를 정의하는 BCP 성능 지표들입니다 — 성능×시간 그래프 하나로 정리됩니다. 사고가 나면 성능이 뚝 떨어지는데 — 이때 버텨야 하는 최소 서비스 수준이 ① MBCO(최소 비즈니스 업무연속성 목표), 조직이 견딜 수 있는 중단 시간의 한계가 ② MAO 또는 MTPD(최대수용가능 중단기간), 업무별 복구를 완료해야 하는 목표 시간이 ③ RTO입니다. MTPD는 재무요소를 적용해 산정하고, MAO는 제품/서비스 미제공 상황을 견딜 수 있는 최대 시간이라는 뉘앙스 차이도 알아두세요. 구간별 표준 매핑 — 전체는 ISO22301·22313, 예방은 ISO31000, 대응은 ISO22320, 복구는 BS25999 — 와 결론 키워드 '레질리언스(충격을 흡수해 복구 불능으로 가지 않게 하는 재건 능력)'까지 쓰면 고득점 답안입니다." },
"mg-drs": {
    guide: {
      hook: "재해로 주 전산센터가 멈추면 '대신 돌릴' 백업 시스템·센터입니다.",
      scene: "본사 데이터센터가 화재로 죽어도 서비스가 이어지려면, 미리 준비한 재해복구 센터로 전환해야 합니다. DRS는 백업 인프라와 복구 절차를 갖춘 시스템으로, 얼마나 빨리 전환되느냐에 따라 유형이 갈립니다.",
      why: "복구 센터 유형(Mirror·Hot·Warm·Cold)과 RTO/비용 트레이드오프가 출제 핵심입니다. BCP·DRP의 IT 인프라입니다.",
      mechanism: "유형(복구 속도-비용): Mirror Site(실시간 이중화, RTO 즉시, 최고 비용), Hot Site(수시간 내, 최신 데이터 대기), Warm Site(수일, 부분 구성), Cold Site(수주, 공간·전원만). 복구 지표 RTO·RPO에 맞춰 선택. 구성: 데이터 복제(동기/비동기), 대체 사이트, 전환 절차·훈련. DRaaS(클라우드 기반 DR 서비스)로 진화.",
      map: [
        { as: "실시간 이중화", real: "Mirror Site", note: "즉시·최고 비용" },
        { as: "수시간 내 복구", real: "Hot Site", note: "" },
        { as: "수일 내 복구", real: "Warm Site", note: "" },
        { as: "공간·전원만", real: "Cold Site", note: "수주·저비용" },
      ],
      usage: "재해복구 인프라 설계입니다. 시험은 4유형 RTO/비용 비교, RPO, DRaaS입니다.",
      links: [
        { topic: "BCP (Business Continuity Planning)", how: "DRS는 BCP의 IT 복구 인프라입니다." },
        { topic: "DRaaS(Disaster Recovery as a Service)", how: "DRS를 클라우드 서비스로 제공합니다." },
      ],
      exam: "DRS는 재해 시 주 센터를 대체하는 복구 시스템으로 Mirror·Hot·Warm·Cold Site로 나뉘며, 복구 속도와 비용이 트레이드오프이고 RTO/RPO에 맞춰 선택한다.",
    }, image: "/concept/book/mg-drs.png", easy: "DRS는 비상사태에 대비한 대비체계와 복구계획으로 업무 연속성을 유지하게 하는 재해복구 시스템입니다. BCP가 '계획'이라면 DRS는 이를 구현한 '시스템'입니다. 개념도는 메인센터와 DR센터가 HW/SW·스토리지·네트워크·기업정보를 DWDM 회선으로 데이터 복제하는 구조. 구축유형 [미핫웜콜]은 목표시간과 세트로 — Mirror Site(동시 처리·즉시 대체, RTO=0), Hot Site(거의 동일 자원·실시간 이중화, RTO≤2H), Warm Site(일부 장비·주요 업무만, RTO≤1주), Cold Site(기본시설만, 수개월). 운영형태 [상공외독] — 상호계약형(유사기관 상호 백업), 공동이용형(공동 출자), 외부위탁형(전문 기관 위탁), 독자구축형. 기술요소는 HA(클러스터링/Stand-By), FT(실시간 복구 Dual), IP-SAN, DWDM. 복구절차 [분재시운]: 업무영향분석→재해복구 전략→시스템구축·복구계획→운영 및 모의훈련입니다." },
"mg-iso22301": {
    guide: {
      hook: "사업 연속성 관리 시스템(BCMS)의 국제 표준 — BCP를 체계로 인증합니다.",
      scene: "BCP를 잘 만들었다고 말만으론 안 됩니다. ISO 22301은 사업 연속성을 PDCA 기반 관리 시스템으로 운영·인증하는 국제 표준으로, 조직이 재해 대응 역량을 갖췄음을 제3자가 보증합니다.",
      why: "'BCP(계획) → BCMS(관리 시스템·인증)'의 관계가 출제 핵심입니다. PDCA 구조와 BCP·BIA와의 연계가 포인트입니다.",
      mechanism: "BCMS를 PDCA로 운영: Plan(사업 연속성 정책·BIA·위험평가·전략), Do(BCP 수립·구현·훈련), Check(모니터링·내부감사·훈련 평가), Act(개선). Annex SL 공통 구조(ISO 경영시스템 표준 공통 골격). 요구: 리더십·기획·지원·운영·성과평가·개선. 인증으로 이해관계자 신뢰 확보. ISO 27001(정보보안)·9001(품질)과 통합 운영 가능.",
      map: [
        { as: "말이 아닌 체계 인증", real: "BCMS 국제 표준", note: "" },
        { as: "정책·BIA·전략", real: "Plan", note: "PDCA" },
        { as: "BCP 구현·훈련", real: "Do", note: "" },
        { as: "감사·개선", real: "Check·Act", note: "" },
      ],
      usage: "사업 연속성 대외 인증입니다. 시험은 BCP와의 관계, PDCA 구조, Annex SL입니다.",
      links: [
        { topic: "BCP (Business Continuity Planning)", how: "ISO 22301이 BCP를 관리 시스템으로 인증합니다." },
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "같은 PDCA 기반 관리체계 인증입니다." },
      ],
      exam: "ISO 22301은 사업 연속성 관리 시스템(BCMS)의 국제 표준으로, PDCA와 Annex SL 공통 구조로 BCP를 운영·인증해 조직의 재해 대응 역량을 보증한다.",
    }, image: "/concept/book/mg-iso22301.png", easy: "BCP·BCM을 '관리체계(BCMS)'로 승격시킨 국제표준입니다. 뼈대는 PDCA — Plan(BCM 정책·전략·절차 수립), Do(이행·운영), Check(운영결과 검토·내부감사·경영진 보고), Act(교정활동으로 유지관리·개선) — 가 '이해관계자의 연속성 요구사항'을 입력으로 받아 '관리된 비즈니스 연속성'을 출력하는 순환 구조입니다. 요구사항 조항 [조리계지운성개] 7개 — 조직상황(BCM 범위 설정), 리더십(최고경영진 책임), 계획수립(위험평가·영향분석·경감/대응 계획), 지원(자원·커뮤니케이션), 운영(업무영향분석, 모의훈련 검증, RTO 기준), 성과관리(감시·측정·내부감사), 개선(시정조치) — 은 ISO 경영시스템 표준의 공통 골격이라 ISMS(27001) 등과 비교 문제로도 나옵니다." },
"mg-draas": {
    guide: {
      hook: "재해복구 시스템을 '직접 짓지 않고 클라우드 구독'으로 쓰는 서비스입니다.",
      scene: "자체 DR 센터를 짓고 유지하려면 비싸고 전문 인력이 필요합니다. DRaaS는 클라우드 사업자가 재해복구 환경을 서비스로 제공해, 평소엔 저렴하게 대기하다 재해 시 클라우드로 전환(페일오버)합니다.",
      why: "'DRS의 클라우드 서비스화'와 이점(CapEx→OpEx·신속 구축)·과제(종속·네트워크)가 출제 포인트입니다.",
      mechanism: "클라우드에 데이터·시스템을 복제해 두고 재해 시 클라우드에서 워크로드 가동(Failover), 복구 후 원복(Failback). 이점: 초기 투자·운영 부담↓, 빠른 구축, 유연한 확장, 정기 테스트 용이. 유형: 관리형(사업자 운영)·자가관리형·지원형. 과제: 데이터 전송·네트워크 지연, 클라우드 종속, 규정 준수. 중소기업에 특히 유효.",
      map: [
        { as: "DR을 구독형으로", real: "클라우드 DR 서비스", note: "CapEx→OpEx" },
        { as: "재해 시 클라우드로", real: "Failover", note: "" },
        { as: "복구 후 원복", real: "Failback", note: "" },
        { as: "빠른 구축·저비용", real: "이점", note: "중소기업" },
      ],
      usage: "중소기업·클라우드 기반 재해복구입니다. 시험은 DRS와의 관계, Failover/Failback, 이점·과제입니다.",
      links: [
        { topic: "DRS (Disaster Recovery System)", how: "DRaaS는 DRS를 클라우드 서비스로 제공합니다." },
        { topic: "BCP (Business Continuity Planning)", how: "BCP의 클라우드 기반 복구 수단입니다." },
      ],
      exam: "DRaaS는 재해복구 환경을 클라우드 구독형으로 제공해 재해 시 클라우드로 페일오버하는 서비스로, 초기 투자·운영 부담을 줄이나 클라우드 종속·네트워크가 과제다.",
    }, image: "/concept/book/mg-draas.png", easy: "DRS를 직접 구축하는 대신 클라우드로 사서 쓰는 재해복구입니다. 개념도 흐름 — ① 고객사 CDP 서버에서 1차 보호 → ② Cloud DR Center로 Replication → ③ 클라우드 CDP 서버에서 2차 보호 → ④ 재해 시 클라우드 가상 서버타운으로 긴급 복구. 효과 3종 그래프가 인상적입니다: 비용은 CAPEX→OPEX로 절감, RTO는 Tape 12시간→15분, RPO는 1분단위로 증대(데이터가 이전 상태에 최대한 근접하게 복구). 모델 [관지D]는 책임 소재로 구분 — 관리형(전 과정을 업체에 아웃소싱, 업체가 fail-over 관리·SLA 제공), 지원형(기업이 DR 과정을 통제하고 업체는 지원 — 맞춤형 앱 보유 기업), DIY형(IT 인력 많은 기업이 전체 자체 관리, fail-over도 직접). '누가 fail-over를 관리하는가'로 세 모델을 구분하세요." },
"mg-digital-safety-3": {
    guide: {
      hook: "디지털 서비스 장애로부터 국민을 보호하기 위한 '디지털 안전 3법'입니다.",
      scene: "카카오 먹통 사태처럼 디지털 서비스가 멈추면 사회 전체가 마비됩니다. 이에 대응해 주요 디지털 서비스 사업자에게 재난관리·안정성 의무를 부과하는 법 개정이 이뤄졌습니다 — 방송통신발전기본법·정보통신망법·전기통신사업법.",
      why: "'디지털 서비스 안정성 제도화'라는 배경과 3법의 역할이 출제 포인트입니다. BCP·재난 대응과 연결됩니다.",
      mechanism: "3법 개정: 방송통신발전기본법(주요 디지털 서비스·데이터센터를 방송통신재난관리 대상에 포함 — 재난관리계획 의무), 정보통신망법(부가통신·집적정보통신시설의 안정성 확보 의무), 전기통신사업법(부가통신사업자 서비스 안정성 확보·이용자 보호). 배경: 데이터센터 화재·서비스 장애. 사업자에 이중화·재난 대비·통지 의무 부과.",
      map: [
        { as: "데이터센터도 재난관리", real: "방송통신발전기본법", note: "" },
        { as: "시설 안정성 의무", real: "정보통신망법", note: "" },
        { as: "서비스 안정성·이용자 보호", real: "전기통신사업법", note: "" },
        { as: "먹통 사태 대응", real: "제도화 배경", note: "" },
      ],
      usage: "디지털 서비스 안정성 규제입니다. 시험은 3법 역할, 배경(장애 사태), BCP와의 연계입니다.",
      links: [
        { topic: "BCP (Business Continuity Planning)", how: "사업자 서비스 연속성 의무와 연결됩니다." },
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "서비스 회복탄력성 관점을 공유합니다." },
      ],
      exam: "디지털 안전 3법은 방송통신발전기본법·정보통신망법·전기통신사업법 개정으로 주요 디지털 서비스·데이터센터에 재난관리·안정성 확보 의무를 부과한 제도다.",
    }, image: "/concept/book/mg-digital-safety-3.png", easy: "대형 디지털 재난 이후 '데이터센터와 부가통신서비스도 재난관리 대상'으로 끌어들인 3개 법 개정 패키지입니다 [방정전]. ① 방송통신발전법: 부가통신사업자·데이터센터 사업자를 '주요방송통신사업자'에 포함(제35조) — 기준은 이용자 1000만명 이상 또는 트래픽 2% 이상, 데이터센터는 바닥면적 22500㎡ 이상 또는 수전설비 40MW 이상 + 매출 100억원 이상. ② 정보통신망법: 바닥면적 500㎡ 이상 데이터센터에 보호조치 의무 부과(제46조), 재난 발생 시 보고 방법과 배타적 임차사업자 조치의무 규정. ③ 전기통신사업법: 부가통신서비스 안정성 확보의무(제22조의7). 숫자 4개(1000만명/2%/22500㎡·40MW/500㎡)가 그대로 출제 포인트입니다." },
"mg-it-governance": {
    guide: {
      hook: "IT가 '사업 목표에 기여하도록' 이사회·경영진이 통제·조정하는 지배구조입니다.",
      scene: "IT에 돈은 쓰는데 사업 성과로 이어지는지, 위험은 관리되는지를 경영진이 챙겨야 합니다. IT 거버넌스는 IT 의사결정 권한·책임을 정하고 IT를 전략과 정렬(align)시키는 통제 체계입니다.",
      why: "'IT-비즈니스 정렬'과 5대 초점 영역, 그리고 프레임워크(COBIT·ISO 38500)가 출제 핵심입니다.",
      mechanism: "5 초점 영역(COBIT): 전략적 정렬(IT↔사업), 가치 전달(IT 투자 효익), 위험 관리, 자원 관리, 성과 측정(IT-BSC). 프레임워크: COBIT(통제 목표), ISO 38500(원칙 — 책임·전략·획득·성과·준거·인적행동), ITIL(서비스). 이사회·경영진의 책임. EDM(평가·지시·모니터) 구조로 지배.",
      map: [
        { as: "IT를 사업 목표에 정렬", real: "전략적 정렬", note: "핵심" },
        { as: "투자 효익 확보", real: "가치 전달", note: "" },
        { as: "위험·자원·성과 관리", real: "나머지 초점", note: "" },
        { as: "평가·지시·모니터", real: "EDM(ISO 38500)", note: "" },
      ],
      usage: "기업 IT 지배구조의 기준입니다. 시험은 5초점 영역, COBIT·ISO 38500, IT-비즈니스 정렬입니다.",
      links: [
        { topic: "ISO 38500:2024", how: "IT 거버넌스의 국제 원칙 표준입니다." },
        { topic: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)", how: "IT 성과 측정 도구입니다." },
      ],
      exam: "IT 거버넌스는 IT를 사업 전략과 정렬시키고 가치·위험·자원·성과를 통제하는 지배구조로, COBIT·ISO 38500을 프레임워크로 이사회·경영진이 EDM으로 지배한다.",
    }, image: "/concept/book/mg-it-governance.png", easy: "'IT가 기업 전략을 따라가게 만드는 통제 체계'입니다. ITGI의 도메인 프레임워크 [전가위자성]이 골격 — 전략적 연계(EA·ISP), 가치 전달(ERP·SCM·CRM·BPM), 위험관리(DRS·BCP·ERM), 자원관리(ITSM·ITAM), 성과측정(BSC·IT ROI). Business Area에서 Customer Area로 가치가 흐르는 화살표 그림으로 기억하세요. 프레임워크 유형 6가지 — 가트너의 IT거버넌스 모델(원칙·메커니즘·프로세스), ITGI의 도메인 프레임워크, COBIT(IT통제 개선용 국제 프레임워크), MIT Sloan의 의사결정영역 프레임워크, Val IT(IT투자의 가치 실현), Risk IT(IT위험을 전사 위험관리와 통합). 참조모델로 COBIT·EA/ITA·CMMI/SPICE·ITIL·IT BSC가 각 영역을 구현합니다." },
"mg-iso38500": {
    guide: {
      hook: "조직의 IT 거버넌스를 위한 '6대 원칙'을 정한 국제 표준(2024 개정)입니다.",
      scene: "IT 거버넌스를 어떻게 해야 하는지 원칙으로 정리한 것이 ISO 38500입니다. 경영진이 IT를 평가하고(Evaluate)·지시하고(Direct)·모니터링(Monitor)하는 EDM 모델과 6원칙을 제시합니다.",
      why: "6원칙과 EDM 모델이 출제 핵심입니다. IT 거버넌스(COBIT)와의 관계, 2024 개정 동향이 포인트입니다.",
      mechanism: "6원칙: 책임(Responsibility), 전략(Strategy), 획득(Acquisition), 성과(Performance), 준거(Conformance), 인간 행동(Human Behaviour). EDM 모델: 경영진이 IT 활용을 Evaluate(현재·미래 평가) → Direct(계획·정책 지시) → Monitor(성과·준거 감시). 2024 개정은 디지털 전환·데이터·AI 거버넌스 반영. 조직 규모 무관 적용.",
      map: [
        { as: "책임·전략·획득", real: "6원칙(전반)", note: "" },
        { as: "성과·준거·인간행동", real: "6원칙(후반)", note: "" },
        { as: "평가→지시→감시", real: "EDM 모델", note: "핵심" },
        { as: "AI·데이터 반영", real: "2024 개정", note: "" },
      ],
      usage: "IT 거버넌스 국제 원칙입니다. 시험은 6원칙, EDM 모델, COBIT과의 관계입니다.",
      links: [
        { topic: "IT 거버넌스(IT-Governance)", how: "ISO 38500이 그 원칙 표준입니다." },
        { topic: "IT-Compliance", how: "준거 원칙이 컴플라이언스와 연결됩니다." },
      ],
      exam: "ISO 38500:2024는 책임·전략·획득·성과·준거·인간행동의 6원칙과 평가·지시·모니터(EDM) 모델로 IT 거버넌스를 규정한 국제 표준으로, 개정판은 AI·데이터를 반영한다.",
    }, image: "/concept/book/mg-iso38500.png", easy: "IT 거버넌스를 '경영진의 행위'로 정의한 국제표준의 2024년판입니다. 핵심 모델 [평지모이] — 평가(Evaluate: 내외부 환경 고려), 지휘(Direct: 계획·정책 구현), 감독(Monitor: 준수·성과 모니터링)의 EDM 삼각형이 Management of IT와 순환하고, 2024판에서 이해관계자 참여(Engage Stakeholders)가 추가되어 효과성을 극대화합니다. 원칙은 11개로 확장 [목가전감책 이리의위사지] — 주요 원칙(목적), 기초 원칙(가치 모델·전략·감독·책임), 지원 원칙(이해관계자 참여·리더십·데이터와 의사결정·위험 거버넌스·사회적 책임·지속가능성과 성과). ISO 37000(조직 거버넌스)과 연계해 정합성을 강화했다는 점이 구판(6원칙)과의 차별 포인트입니다." },
"mg-it-compliance": {
    guide: {
      hook: "IT가 '법규·규제·내부 정책을 지키도록' 관리하는 준거성 체계입니다.",
      scene: "개인정보보호법·전자금융감독규정 등 IT 관련 규제를 어기면 벌금·영업정지를 당합니다. IT 컴플라이언스는 이런 외부 법규와 내부 규정을 식별·이행·점검해 위반 위험을 관리합니다.",
      why: "'준거성 관리'라는 위치와 거버넌스·리스크와의 관계(GRC)가 출제 포인트입니다.",
      mechanism: "활동: 관련 법규·규제·표준·내부정책 식별 → 요구사항을 통제로 매핑 → 이행(정책·프로세스·시스템) → 모니터링·감사 → 위반 대응·개선. 대상: 개인정보보호법·정보통신망법·전자금융·SOX·GDPR 등. GRC(거버넌스·리스크·컴플라이언스) 통합 관리. ISO 37301(컴플라이언스 경영시스템). 자동화(RegTech)로 효율화.",
      map: [
        { as: "지켜야 할 규제 식별", real: "법규·규정 파악", note: "" },
        { as: "통제로 매핑·이행", real: "요구사항 이행", note: "" },
        { as: "감사·위반 대응", real: "모니터링", note: "" },
        { as: "거버넌스·리스크와 통합", real: "GRC", note: "" },
      ],
      usage: "규제 산업 IT 관리입니다. 시험은 준거성 관리, GRC 통합, 대상 법규입니다.",
      links: [
        { topic: "IT 거버넌스(IT-Governance)", how: "준거(Conformance)가 거버넌스의 초점입니다." },
        { topic: "ISO 38500:2024", how: "준거 원칙과 연결됩니다." },
      ],
      exam: "IT 컴플라이언스는 IT 관련 법규·규제·내부정책을 식별·이행·점검해 위반 위험을 관리하는 준거성 체계로, 거버넌스·리스크와 통합한 GRC로 운영된다.",
    }, image: "/concept/book/mg-it-compliance.png", easy: "정부·기관의 규제와 법안을 IT 관점에서 충족하도록 시스템을 재정비하는 활동입니다. 프레임워크는 원인 → 대응체계 → 효과 구조 — 외부 규제(ISMS·GDPR·Basel II·SOX)와 내부 통제(거버넌스·리스크 관리)가 원인이 되고, 조직구성·Rule set·프로세스·인식강화에 모니터링·감사·관리 도구를 더한 대응체계를 갖추면, 투명성 확보·경쟁력 제고·리스크 감소 효과를 얻습니다. 주요 요구사항 5가지 — 데이터 공개(E-Discovery), 데이터 보존(보존 기한 준수), 데이터 보호(암호화·접근 제어), 내부통제(감시·감사), 책임성(라이프사이클 전 과정의 사고 고지·책임). 규제 종류는 개인정보 보호(GDPR/개인정보보호법), 정보관리(SOX·Basel II), 정보보안으로 묶어 정리하면 됩니다." },
"mg-env-analysis": {
    guide: {
      hook: "전략을 세우기 전 '외부·내부 환경을 스캔'하는 분석 도구 모음입니다.",
      scene: "전략은 감이 아니라 환경 분석에서 나옵니다. 거시 환경(정치·경제 등), 산업 구조, 내부 역량을 각각 도구로 분석해 기회·위협·강점·약점을 파악하고 전략 방향을 잡습니다.",
      why: "환경별 분석 도구 매핑(거시=PEST, 산업=5 Forces, 내부=가치사슬, 종합=SWOT)이 출제 핵심입니다.",
      mechanism: "거시환경: PEST(EL)(정치·경제·사회·기술·환경·법). 산업환경: Porter 5 Forces(신규진입·대체재·구매자·공급자·경쟁강도). 내부역량: 가치사슬(본원·지원 활동), VRIO(자원 기반), 7S. 종합: SWOT(강점·약점·기회·위협)로 통합 → SO/WO/ST/WT 전략 도출. 3C(Customer·Competitor·Company)도 활용.",
      map: [
        { as: "정치·경제·기술 흐름", real: "PEST 분석", note: "거시" },
        { as: "산업 경쟁 구조", real: "5 Forces", note: "산업" },
        { as: "내부 활동·역량", real: "가치사슬·VRIO", note: "내부" },
        { as: "종합해 전략 도출", real: "SWOT", note: "" },
      ],
      usage: "전략 기획의 출발점입니다. 시험은 환경별 도구 매핑, SWOT 전략 도출입니다.",
      links: [
        { topic: "가치사슬(Value Chain)", how: "내부 역량 분석 도구입니다." },
        { topic: "Ansoff Matrix", how: "분석 후 성장 전략 선택에 씁니다." },
      ],
      exam: "환경분석은 거시(PEST)·산업(5 Forces)·내부(가치사슬·VRIO)를 분석해 SWOT로 종합하고 SO/WO/ST/WT 전략을 도출하는 전략 기획의 출발점이다.",
    }, image: "/concept/book/mg-env-analysis.png", easy: "환경분석은 기업 경영에 영향을 주는 요인을 외부(기회·위협)와 내부(강점·약점)로 나눠 분석하는 활동입니다 — 경영전략 수립의 출발점입니다. 외부환경분석은 [기회/위협]을 찾는 것: 절차는 거시 환경분석→산업 구조분석→경쟁 환경분석→산업 진화분석→시사점도출이고, 기법은 PEST(정치·경제·사회문화·기술의 거시 환경), 5 Force(산업 내 경쟁자 상호작용으로 기회·위협요인 도출), 3C(고객·경쟁사·자사 비교로 차별화 포인트 분석). 내부환경분석은 [강점/약점]을 찾는 것: 사업성과·재무성과 분석→경영 현황 진단→내부 역량 분석→시사점 도출 순이며, 기법은 Value Chain(가치 창출 활동의 강약점·비용 우위), BSC(재무+비재무 관점을 측정 가능한 지표로), 7S(Hard/Soft Element로 조직 총체 역량 진단), 가능역량 자원분석(자원·핵심역량·경쟁우위). 외부 기회/위협 + 내부 강점/약점 = SWOT으로 이어집니다." },
"mg-ansoff": {
    guide: {
      hook: "'제품'과 '시장'의 신·구 조합으로 성장 전략을 4가지로 나눈 매트릭스입니다.",
      scene: "성장하려면 기존 제품/시장을 더 파고들지, 새 시장에 나갈지, 새 제품을 낼지, 완전히 새 영역으로 갈지 정해야 합니다. 앤소프 매트릭스는 이를 2×2로 정리해 위험 수준별 성장 경로를 제시합니다.",
      why: "4전략의 정의와 위험 수준(시장침투<시장개발·제품개발<다각화)이 출제 핵심입니다.",
      mechanism: "2축(제품: 기존/신규 × 시장: 기존/신규): 시장 침투(기존 제품·기존 시장 — 점유율 확대, 최저 위험), 시장 개발(기존 제품·신규 시장 — 새 지역·세그먼트), 제품 개발(신제품·기존 시장 — 혁신), 다각화(신제품·신시장 — 최고 위험, 관련/비관련). 위험·수익이 우상단으로 갈수록 커짐.",
      map: [
        { as: "기존×기존 더 팔기", real: "시장 침투", note: "최저 위험" },
        { as: "기존 제품 새 시장", real: "시장 개발", note: "" },
        { as: "새 제품 기존 시장", real: "제품 개발", note: "" },
        { as: "신제품×신시장", real: "다각화", note: "최고 위험" },
      ],
      usage: "성장 전략 수립입니다. 시험은 4전략 정의, 위험 수준 순서입니다.",
      links: [
        { topic: "BCG Matrix", how: "사업 포트폴리오 분석 도구와 짝을 이룹니다." },
        { topic: "환경분석", how: "분석 후 성장 전략 선택에 활용합니다." },
      ],
      exam: "앤소프 매트릭스는 제품·시장의 신구 조합으로 시장침투·시장개발·제품개발·다각화 4성장 전략을 제시하며, 다각화로 갈수록 위험·수익이 커진다.",
    }, image: "/concept/book/mg-ansoff.png", easy: "Ansoff Matrix는 기업의 성장 방향을 '제품(기존/신규) × 시장(기존/신규)' 두 축으로 정하는 의사결정 전략 기법입니다 [시제 침개개다](2025.10 모의고사 기출). 기존 제품을 기존 시장에 더 팔면 시장 침투(위험 최소), 기존 제품을 새 시장으로 가져가면 시장 개발, 기존 시장에 새 제품을 내면 제품 개발, 새 제품으로 새 시장에 진입하면 다각화(위험 최대) — 원점에서 멀어질수록 위험도가 커진다는 축의 의미까지 쓰면 완성입니다. 같은 슬라이드의 BCG 매트릭스(사업 포트폴리오 관리)·GE 매트릭스(다차원 포트폴리오 전략)와 묶어 '성장 방향은 Ansoff, 사업 선택과 집중은 BCG/GE'로 역할을 구분해 기억하세요." },
"mg-bcg": {
    guide: {
      hook: "사업들을 '시장 성장률'과 '시장 점유율' 두 축으로 나눠 투자 우선순위를 정합니다.",
      scene: "여러 사업을 가진 회사가 어디에 돈을 넣고 어디서 뺄지 결정해야 합니다. BCG 매트릭스는 각 사업을 성장률·점유율로 별·젖소·물음표·개로 분류해 자원 배분 전략을 제시합니다.",
      why: "4분면(Star·Cash Cow·Question Mark·Dog)의 특성과 전략(투자·수확·육성·철수)이 출제 핵심입니다. 자금 흐름(Cash Cow→Question Mark)이 포인트입니다.",
      mechanism: "2축(시장성장률 高/低 × 상대적 시장점유율 高/低): Star(고성장·고점유 — 투자 지속, 미래 캐시카우), Cash Cow(저성장·고점유 — 수확, 자금원), Question Mark/Problem Child(고성장·저점유 — 선별 육성 또는 철수), Dog(저성장·저점유 — 철수·회수). 전략: Cash Cow에서 번 돈을 Question Mark·Star에 투자. PLC와 연계.",
      map: [
        { as: "고성장·고점유", real: "Star(투자)", note: "미래 캐시카우" },
        { as: "저성장·고점유", real: "Cash Cow(수확)", note: "자금원" },
        { as: "고성장·저점유", real: "Question Mark(육성/철수)", note: "" },
        { as: "저성장·저점유", real: "Dog(철수)", note: "" },
      ],
      usage: "사업 포트폴리오 관리입니다. 시험은 4분면 특성·전략, 자금 흐름, 앤소프와의 구분입니다.",
      links: [
        { topic: "Ansoff Matrix", how: "성장 전략 도구와 짝을 이룹니다." },
        { topic: "가치사슬(Value Chain)", how: "사업 경쟁력 분석과 연계됩니다." },
      ],
      exam: "BCG 매트릭스는 시장 성장률·점유율로 사업을 Star·Cash Cow·Question Mark·Dog로 분류해, Cash Cow의 자금을 Star·Question Mark에 투자하는 포트폴리오 전략을 제시한다.",
    }, image: "/concept/book/mg-bcg.png", easy: "보스턴컨설팅 그룹이 1968년 제안한 사업 포트폴리오 분석의 원조입니다. 세로축 시장 성장률 × 가로축 상대적 시장점유율로 4분면 [별들에게 물어봐 소인지 개인지] — Star(육성 사업: 둘 다 높음, 지속 투자로 집중 육성), Question Mark(신규 사업: 성장률만 높음, 선별적 투자로 육성), Cash Cow(합리화 사업: 점유율만 높음, 낮은 투자·높은 수익으로 현상유지 또는 재배치), Dog(철수 대상: 둘 다 낮은 한계사업). 분석방향 두 화살표가 고급 답안 포인트 — 자금은 Cash Cow에서 나와 Question Mark·Star로 흘러야 하고, 사업부는 Question Mark→Star→Cash Cow로 성장해야 합니다. 제품생명주기(도입→성장→성숙→쇠퇴)와 4분면이 그대로 대응된다는 관계 분석도 함께 나옵니다." },
"mg-hw-sizing": {
    guide: {
      hook: "정보시스템에 필요한 'CPU·메모리·디스크 규모를 산정'하는 정부 지침입니다.",
      scene: "시스템을 구축할 때 서버를 너무 작게 잡으면 성능 부족, 크게 잡으면 예산 낭비입니다. 규모산정 지침은 업무량·사용자·데이터를 근거로 적정 하드웨어 용량을 계산하는 표준 방법을 제시합니다.",
      why: "산정 방식(참조 모델·정량 산정)과 대상 자원, 공공사업 적용이 출제 포인트입니다.",
      mechanism: "산정 대상: CPU(TPC·SPEC 성능단위 기반 처리량 산정), 메모리(동시 사용자·프로세스), 디스크(데이터량·증가율·RAID·백업), 네트워크. 방식: 참조 유형(유사 사례 기반), 정량적 산정(업무량·트랜잭션·보정계수 반영). 여유율·피크 부하·증가율 고려. 공공정보화 사업의 적정 예산·성능 확보 근거. NIA 지침.",
      map: [
        { as: "처리량으로 CPU", real: "CPU 산정(TPC/SPEC)", note: "" },
        { as: "동시 사용자로 메모리", real: "메모리 산정", note: "" },
        { as: "데이터량·증가율로 디스크", real: "디스크 산정", note: "" },
        { as: "여유율·피크 반영", real: "보정", note: "" },
      ],
      usage: "공공 정보시스템 구축 규모 산정입니다. 시험은 자원별 산정, 참조/정량 방식, 보정 요소입니다.",
      links: [
        { topic: "IT 투자성과 평가", how: "적정 투자 규모 판단과 연계됩니다." },
        { topic: "ISP (Information Strategy Planning)", how: "정보화 계획의 인프라 규모 산정입니다." },
      ],
      exam: "하드웨어 규모산정 지침은 업무량·사용자·데이터를 근거로 CPU·메모리·디스크·네트워크 용량을 참조·정량 방식으로 산정하는 공공 정보화의 적정 규모 확보 기준이다.",
    }, image: "/concept/book/mg-hw-sizing.png", easy: "TTA 표준(TTAK.KO-10.0292/R3, 2023.12 개정)으로, 시스템 도입 시 CPU·메모리·디스크·스토리지 규모를 산정하는 지침입니다. 대상별 논리 — CPU 전체규모를 먼저 계산해 서버 기종을 정하고, 그 구성방안에 의거해 메모리·디스크를, 서버 규모에 따라 스토리지를 산정합니다(모든 것의 기준이 CPU). 절차 4단계: 구축방향·기초자료 조사 → 기초자료·업무분석(기준 부하 산정) → 참조모델 결정·서버 규모산정 → 참조모델별 가중치 적용. 방법 [수참시] — 수식계산법(사용자 수 × 보정치), 참조법(유사 시스템 규모 비교), 시뮬레이션법(작업부하 모델링). 지표는 서버 종류별로: OLTP 서버=tpmC(TPC-C), WEB/WAS 서버=max-jOPS(SPECjbb2015), 스토리지=IOPS(SPC-1) — 짝을 정확히 맞추는 게 출제 포인트입니다." },
"mg-value-chain": {
    guide: {
      hook: "기업 활동을 '가치를 만드는 사슬'로 쪼개, 어디서 경쟁우위가 나오는지 분석합니다(포터).",
      scene: "제품이 만들어져 고객에게 가기까지 여러 활동을 거칩니다. 가치사슬은 이를 본원적 활동과 지원 활동으로 나눠, 각 단계가 얼마나 가치를 더하고 어디서 원가·차별화 우위가 생기는지 짚습니다.",
      why: "본원적/지원 활동 구분과 마진(가치-원가)이 출제 핵심입니다. 원가우위·차별화 전략과 연결됩니다.",
      mechanism: "본원적 활동(Primary): 유입 물류→운영(생산)→유출 물류→마케팅·판매→서비스. 지원 활동(Support): 기업 인프라·인적자원관리·기술개발·조달. 각 활동이 더하는 가치의 합에서 원가를 뺀 것이 마진. 분석으로 원가절감 지점·차별화 원천 식별. IT는 기술개발·인프라로 가치사슬 전반을 강화(가치사슬 재구성).",
      map: [
        { as: "생산·물류·판매·서비스", real: "본원적 활동", note: "" },
        { as: "인프라·인사·기술·조달", real: "지원 활동", note: "" },
        { as: "가치 - 원가", real: "마진", note: "" },
        { as: "우위 원천 찾기", real: "원가/차별화 분석", note: "" },
      ],
      usage: "내부 역량·경쟁우위 분석입니다. 시험은 본원/지원 활동, 마진, IT의 가치사슬 강화입니다.",
      links: [
        { topic: "환경분석", how: "내부 역량 분석 도구입니다." },
        { topic: "BCG Matrix", how: "사업 경쟁력 분석과 연계됩니다." },
      ],
      exam: "가치사슬은 기업 활동을 본원적 활동(물류·생산·판매·서비스)과 지원 활동(인프라·인사·기술·조달)으로 나눠 마진을 분석하는 포터의 도구로, 원가우위·차별화 원천을 찾는다.",
    }, image: "/concept/book/mg-value-chain.png", easy: "포터의 가치사슬 — 기업의 모든 활동을 '가치(Value)를 만드는 연쇄(Chain)'로 보고, 궁극의 목적을 이윤(Margin) 창출로 파악합니다. 구성요소 [내생외마서 기인기조] — 주 활동 5개: 내부 로지스틱스(원재료·부품 품질, 구매 물류), 생산활동(무결점 제품 — 품질·원가·납기), 외부 로지스틱스(신속 배송·주문처리, 출하 물류), 마케팅 및 판매(매출·점유율·브랜드), 서비스(기술지원·신뢰도). 지원 활동 4개: 기업 하부구조(MIS), 인적자원 관리(수급관리·교육훈련), 기술개발(신제품·신기술), 조달(투입물 구매 기능 — '비용'이 아니라 '기능'이라는 점 주의). 내부환경분석 기법으로 환경분석 토픽과 연결되고, ITIL 4.0의 서비스 가치사슬과 이름이 비슷하니 혼동 주의입니다." },
"mg-pdca": {
    guide: {
      hook: "'계획·실행·점검·개선'을 돌리는 지속적 개선의 기본 사이클(데밍 사이클)입니다.",
      scene: "한 번 하고 끝이 아니라, 계획을 세워 실행하고 결과를 점검해 개선한 뒤 다시 계획으로 돌아가는 나선형 개선입니다. 품질·관리 시스템·프로세스 개선의 뼈대로, ISO 경영시스템 표준의 공통 골격입니다.",
      why: "4단계의 의미와 '지속적·나선형 개선'이 출제 핵심입니다. ISO 표준·품질관리와의 연결이 포인트입니다.",
      mechanism: "Plan(목표·계획 수립), Do(실행·시범 적용), Check(측정·평가 — 계획 대비 결과), Act(개선·표준화 — 성공은 표준화, 실패는 원인 분석 후 재계획). 반복하며 점진 향상(나선). ISO 9001·27001·22301 등 경영시스템 표준의 운영 골격. 린·식스시그마의 DMAIC와 유사 철학.",
      map: [
        { as: "목표·계획", real: "Plan", note: "" },
        { as: "실행·시범", real: "Do", note: "" },
        { as: "측정·평가", real: "Check", note: "" },
        { as: "개선·표준화", real: "Act", note: "" },
      ],
      usage: "품질·프로세스·경영시스템 개선의 기본입니다. 시험은 4단계, 나선형 개선, ISO 표준과의 관계입니다.",
      links: [
        { topic: "ISO 22301", how: "PDCA 기반으로 운영되는 경영시스템입니다." },
        { topic: "OKR", how: "목표 설정·점검 사이클과 유사합니다." },
      ],
      exam: "PDCA는 계획·실행·점검·개선을 반복하는 데밍 사이클로 지속적·나선형 개선을 추구하며, ISO 9001·27001·22301 등 경영시스템 표준의 공통 운영 골격이다.",
    }, image: "/concept/book/mg-pdca.png", easy: "데밍 사이클 — 계획하고(Plan), 실행하고(Do), 평가하고(Check), 개선하는(Act) 바퀴를 계속 굴려 품질을 끌어올리는 방법입니다. 각 단계의 정의를 정확히: Plan은 자료 수집·분석과 개선 계획의 개발 및 평가 기준 설정, Do는 계획 이행 중 변화를 파악하고 평가용 자료를 체계적으로 수집, Check는 Plan에서 수립한 전략과 연계돼 수행되는지 평가·분석, Act는 Check 결과로 표준화 또는 피드백을 도출. 개념도의 경사면 그림이 핵심 은유 — 바퀴는 Continuous Improvement로 언덕을 오르고, Standard(표준화)라는 쐐기가 뒤로 미끄러지지 않게 고정합니다. '목표는 반드시 수치화, 지속적 반복'이 슬라이드가 강조하는 두 원칙입니다." },
"mg-mece-liss": {
    guide: {
      hook: "'빠짐없이·겹치지 않게(MECE)' 나누고, 논리를 '빈틈없이·건너뜀 없이(LISS)' 잇는 사고 원칙입니다.",
      scene: "문제를 분해할 때 항목이 서로 겹치거나 누락되면 분석이 틀립니다. MECE는 상호배타적·전체포괄로 나누는 원칙이고, LISS는 논리를 도약·누락 없이 연결하는 원칙입니다. 컨설팅·기술사 답안 구조화의 기본입니다.",
      why: "MECE(분류 원칙)와 LISS(논리 전개 원칙)의 구분이 출제 포인트입니다. 로직트리·피라미드 구조와 연결됩니다.",
      mechanism: "MECE(Mutually Exclusive, Collectively Exhaustive — 상호 배타적이면서 전체를 포괄): 항목 간 중복 없고 빠짐 없음. 분류 방식: 요소·단계·대조·수식. LISS(Linking Invariant Sequential Steps): 논리 전개가 도약이나 누락 없이 순차적으로 연결(각 단계가 앞뒤와 연결). 로직트리(MECE 분해)·피라미드 구조(LISS 논리)로 활용. 답안·보고서 구조화에 필수.",
      map: [
        { as: "겹치지 않게", real: "상호 배타적(ME)", note: "MECE" },
        { as: "빠짐없이", real: "전체 포괄(CE)", note: "MECE" },
        { as: "논리 건너뜀 없이", real: "순차 연결", note: "LISS" },
        { as: "로직트리·피라미드", real: "구조화 도구", note: "" },
      ],
      usage: "문제 분해·답안 구조화의 기본입니다. 시험은 MECE vs LISS, 로직트리·피라미드 구조입니다.",
      links: [
        { topic: "환경분석", how: "MECE로 분석 항목을 구조화합니다." },
        { topic: "디자인 씽킹(Design Thinking)", how: "문제 정의·분해에 활용됩니다." },
      ],
      exam: "MECE는 항목을 상호 배타적·전체 포괄로 나누는 분류 원칙이고 LISS는 논리를 도약·누락 없이 순차 연결하는 전개 원칙으로, 로직트리·피라미드 구조로 활용된다.",
    }, image: "/concept/book/mg-mece-liss.png", easy: "컨설팅식 문제 분해의 두 도구입니다. MECE는 '서로 겹치지 않고(상호 배제) 빠짐없이(전체 포괄)' 문제 전체를 파악하는 사고방식 — 잘된 예: 사람=남자/여자. 잘못된 사례 3종: 중복은 없으나 빠짐(자금조달에서 회사채 누락), 빠짐은 없으나 중복(공립병원이 두 분류에 걸침), 둘 다 발생. 절차는 초기 가설 설정 → 핵심 요인 파악 → 해결책 산출·제시 3단계. LISS는 문제를 종합할 때 '중복 없이 핵심만' 산출하는 전략적 분석 기법 — 문제파악 → 문제분해(로직트리) → 문제제거 → 가설(기승전결) → 계획수립 → 분석과 종합 → 결과도출(결정권자 입장의 보고서) 7단계입니다. 'MECE는 빠짐·겹침 없는 분해, LISS는 핵심 추출'로 구분하세요." },
"mg-isp-guide": {
    guide: {
      hook: "정보화 전략계획(ISP)·정보시스템 마스터플랜(ISMP)을 어떻게 수립할지 정한 공통 가이드(9판, 2025.05)입니다.",
      scene: "공공기관이 정보화 사업을 발주하기 전에 무엇을·왜·어떻게 할지 체계적으로 계획해야 합니다. 이 가이드는 ISP와 ISMP 수립 절차·산출물을 표준화해 사업의 품질과 예산 적정성을 확보합니다.",
      why: "'ISP vs ISMP'의 구분과 수립 절차 표준이 출제 핵심입니다. 최신 개정(9판) 동향이 포인트입니다.",
      mechanism: "ISP(정보화 전략 계획 — 조직 전체 정보화 방향·중장기 로드맵), ISMP(정보시스템 마스터플랜 — 특정 시스템 구축 상세 계획·요구사항 명확화로 발주 품질 제고). 공통 절차: 환경분석(현황·요구) → 목표모델 수립(정보화 비전·아키텍처) → 이행계획(과제·로드맵·예산). 9판은 디지털플랫폼정부·클라우드·AI 반영. 산출물·품질기준 표준화.",
      map: [
        { as: "조직 전체 방향", real: "ISP(전략 계획)", note: "중장기" },
        { as: "특정 시스템 상세", real: "ISMP(마스터플랜)", note: "발주 품질" },
        { as: "환경분석→목표→이행", real: "공통 절차", note: "" },
        { as: "AI·클라우드 반영", real: "9판 개정", note: "" },
      ],
      usage: "공공 정보화 사업 기획입니다. 시험은 ISP/ISMP 구분, 수립 절차, 9판 동향입니다.",
      links: [
        { topic: "ISP (Information Strategy Planning)", how: "이 가이드가 표준화하는 계획입니다." },
        { topic: "ISMP (Information System Master Plan)", how: "발주용 상세 계획을 다룹니다." },
      ],
      exam: "ISP·ISMP 수립 공통가이드 9판은 정보화 전략계획(ISP)과 시스템 마스터플랜(ISMP)의 수립 절차·산출물을 표준화한 지침으로, 디지털플랫폼정부·AI·클라우드를 반영한다.",
    }, image: "/concept/book/mg-isp-guide.png", easy: "ISP·ISMP 수립 공통가이드 9판(2025.05)은 소규모 정보시스템 구축 시 ISP·ISMP 수립 의무를 면제하도록 개정한 정부 지침입니다(2025.06 모의고사 기출). 골자: 총구축비 20억원 미만 소규모 정보시스템 구축·재구축 사업은 ISP·ISMP 수립 의무를 면제하고, 대신 구체적 사업계획 수립·검토로 사업기간을 단축하고 자원투입을 절감합니다. 절차는 부처(사업계획서 수립·검토요청) → NIA 사전검토 5일 → 충실성 판정(부적합 시 회송) → NIA 검토의견서 10일 → 기획재정부 예산편성 참작, 검토기간 최대 15일. 검토 내용 [필시중 사기 클 규] — 사업 타당성(필요성·시급성·중복성), 실현 가능성(사업추진 여건·기술 적정성), 클라우드 우선 적용, 규모 적정성. 판정 플로우에서 단순기능 개발·DB구축·HW/SW 도입·운영유지 사업 등도 ISP수립 예외라는 점까지 알아두면 좋습니다." },
"mg-isp": {
    guide: {
      hook: "조직의 '중장기 정보화 방향과 로드맵'을 잡는 정보화 전략 계획입니다.",
      scene: "IT를 산발적으로 도입하면 낭비와 중복이 생깁니다. ISP는 조직 전체 관점에서 사업 전략과 정렬된 정보화 비전·목표 아키텍처·이행 로드맵을 수립해 IT 투자의 방향을 정합니다.",
      why: "'전사 정보화 전략'이라는 위치와 수립 4단계, 목표 아키텍처(EA)가 출제 핵심입니다. ISMP와의 구분이 포인트입니다.",
      mechanism: "4단계: 환경분석(경영·정보기술 환경, 현행 시스템·요구), 현황분석(As-Is), 목표모델 수립(To-Be — 정보화 비전·정보/애플리케이션/기술 아키텍처=EA), 이행계획(과제 정의·우선순위·로드맵·예산·기대효과). 비즈니스-IT 정렬이 핵심. EA·BPR과 연계. ISMP보다 상위·포괄적.",
      map: [
        { as: "환경·현황 파악", real: "As-Is 분석", note: "" },
        { as: "목표 아키텍처", real: "To-Be(EA)", note: "" },
        { as: "과제·로드맵·예산", real: "이행계획", note: "" },
        { as: "사업-IT 정렬", real: "전략적 정렬", note: "핵심" },
      ],
      usage: "전사 정보화 기획입니다. 시험은 4단계, 목표 아키텍처, ISMP와의 구분입니다.",
      links: [
        { topic: "ISMP (Information System Master Plan)", how: "ISP 하위의 시스템별 상세 계획입니다." },
        { topic: "ISP 및 ISMP 수립 공통가이드 9판(2025.05)", how: "수립 절차를 표준화한 지침입니다." },
      ],
      exam: "ISP는 조직 전체의 정보화 비전·목표 아키텍처·이행 로드맵을 사업 전략과 정렬해 수립하는 중장기 정보화 전략 계획으로, 환경·현황·목표모델·이행계획 4단계로 진행된다.",
    }, image: "/concept/book/mg-isp.png", easy: "조직의 중장기 마스터 플랜을 받쳐 줄 정보화 전략을 세우는 활동입니다. 절차 [환현정목통] 5단계를 산출물과 짝지어 외우세요 — 환경 분석(경영환경·법령제도·정보기술 환경 → 각 분석서), 현황분석 As-Is(업무현황·IT 현황·벤치마킹·Gap 분석·이슈통합 및 개선과제도출 → 요구사항 및 개선과제 분석서), 정보화 비전 및 전략수립(→ 정보화 전략 정의서), 목표모델 설계 To-Be(개선과제 상세화·업무프로세스·정보시스템 구조·데이터 구조·기술 및 보안 구조 설계), 통합 이행계획(이행계획 수립·총구축비 산출·효과분석 → 통합 이행 계획 수립서). '전사 차원의 전략(ISP) → 과제 → 과제별 상세 계획(ISMP)'이라는 위계가 ISMP 토픽과의 연결고리입니다." },
"mg-ismp": {
    guide: {
      hook: "특정 시스템을 발주하기 전 '요구사항을 명확히' 하는 상세 마스터플랜입니다.",
      scene: "요구가 불명확한 채 SW 사업을 발주하면 분쟁·재작업이 생깁니다. ISMP는 대상 시스템의 기능·성능 요구사항을 사전에 상세히 정의해, 제안요청서(RFP) 품질을 높이고 적정 사업 대가를 산정합니다.",
      why: "'발주 품질 제고·요구사항 상세화'라는 목적이 출제 핵심입니다. ISP와의 구분(범위·상세도)이 포인트입니다.",
      mechanism: "목적: 특정 정보시스템 구축을 위한 요구사항 상세 정의 → RFP 명확화·적정 대가 산정. 절차: 프로젝트 착수 → 시스템 방향 정의 → 업무·기능 요구 상세화(기능·성능·인터페이스·데이터) → 시스템 구조 설계 → 이행계획·예산. ISP(전사·중장기)보다 좁고 깊음(특정 시스템·상세 요구). SW사업 대가 산정 근거.",
      map: [
        { as: "요구를 미리 상세히", real: "요구사항 상세화", note: "핵심" },
        { as: "RFP 품질 제고", real: "발주 명확화", note: "" },
        { as: "적정 대가 산정", real: "예산 근거", note: "" },
        { as: "특정 시스템 깊게", real: "ISP와 구분", note: "범위·상세" },
      ],
      usage: "SW 사업 발주 준비입니다. 시험은 목적(발주 품질), ISP와의 구분, 요구사항 상세화입니다.",
      links: [
        { topic: "ISP (Information Strategy Planning)", how: "전사 전략의 하위 시스템별 상세 계획입니다." },
        { topic: "ISP 및 ISMP 수립 공통가이드 9판(2025.05)", how: "수립 절차를 표준화한 지침입니다." },
      ],
      exam: "ISMP는 특정 정보시스템 구축의 기능·성능 요구사항을 사전 상세 정의해 RFP 품질과 적정 대가 산정을 확보하는 마스터플랜으로, ISP보다 좁고 깊게 다룬다.",
    }, image: "/concept/book/mg-ismp.png", easy: "특정 SW 개발 사업 하나를 '기능점수를 도출할 수 있는 수준'까지 파고들어 RFP를 만들어내는 활동입니다. 절차 [착방업구이] — 프로젝트 착수 및 참여자 결정 → 정보시스템 방향성 수립 → 업무 및 정보기술 요건 분석 → 정보시스템 구조 및 요건 정의(아키텍처·요건 기술서) → 구축사업 이행 방안 수립(분리발주 평가, 예산 수립, RFP 작성, 업체 선정 지원). 3자 비교표가 단골 — ISP는 전사 정보화 전략(산출물: IT비전·로드맵), EA/ITA는 업무와 IT 관계의 청사진(산출물: 참조모델 BRM·SRM·DRM·TRM, AS-IS/TO-BE 아키텍처), ISMP는 단위 프로젝트의 요구사항 상세화(산출물: RFP, 정보시스템 예산). '범위'와 '산출물' 행으로 셋을 구분하면 틀리지 않습니다." },
"mg-trl": {
    guide: {
      hook: "기술이 '연구실 아이디어에서 상용화까지' 얼마나 성숙했는지를 9단계로 재는 척도입니다.",
      scene: "새 기술이 실제로 쓸 만한지 판단하려면 성숙도를 알아야 합니다. TRL은 기초 원리 관찰(1)부터 실제 운용 검증(9)까지 9단계로 나눠, R&D 투자·상용화 시점 판단의 공통 언어를 제공합니다(NASA 유래).",
      why: "9단계 구조와 각 구간(기초·실험·시제품·실증)의 의미가 출제 핵심입니다. R&D 관리·기술 가치평가와 연결됩니다.",
      mechanism: "9단계: 1(기초원리 관찰)·2(개념 정립) — 기초연구, 3(개념 실험적 검증)·4(실험실 환경 검증) — 실험, 5(유사 환경 검증)·6(파일럿 시제품) — 시작품, 7(실제 환경 시제품 실증)·8(시스템 완성·인증)·9(실제 운용 성공) — 실용화. 죽음의 계곡(연구↔상용화 간극)이 4~7 구간. R&D 단계 관리·정부 과제 평가에 사용.",
      map: [
        { as: "원리 관찰·개념", real: "TRL 1~2(기초)", note: "" },
        { as: "실험실 검증", real: "TRL 3~4(실험)", note: "" },
        { as: "시제품·파일럿", real: "TRL 5~6(시작품)", note: "" },
        { as: "실증·운용", real: "TRL 7~9(실용화)", note: "죽음의 계곡" },
      ],
      usage: "R&D 성숙도 평가·상용화 판단입니다. 시험은 9단계 구간, 죽음의 계곡, 기술 가치평가와의 관계입니다.",
      links: [
        { topic: "기술 가치 평가", how: "성숙도가 기술 가치 산정에 반영됩니다." },
        { topic: "기술수용 주기(Technology Adoption Life Cycle)", how: "시장 수용 단계와 대비됩니다." },
      ],
      exam: "TRL은 기술 성숙도를 기초원리(1)부터 실제 운용(9)까지 9단계로 재는 척도로, 4~7 구간의 죽음의 계곡을 넘어야 상용화되며 R&D 관리·기술 가치평가에 쓰인다.",
    }, image: "/concept/book/mg-trl.png", easy: "기술이 '얼마나 여물었는지'를 1~9로 재는 NASA 유래 지표입니다. 5개 이행 단계 × 9레벨 — 기초연구(1: 기초 이론/실험, 2: 아이디어·특허 개념 정립), 실험(3: 기본성능 검증, 4: 핵심성능 평가 — 실험실 규모), 시작품(5: 시작품 제작·성능 평가, 6: 파일럿 규모), 실용화(7: 신뢰성평가·수요기업 평가, 8: 시제품 인증·표준화), 양산(9: 사업화). 개념도의 U자 곡선은 'Valley of Death' — 중간 단계(4~6)에서 자원이 바닥나는 구간을 academia·정부(초기)와 기업·민간(후기)이 나눠 메웁니다. 기술준비도 분석의 4W1H(when 예산 투입·평가 시점, who 전문가, where 문헌조사·실험실·현장, what 목표대비 현재 수준, how 계획 대비 실제 수행시간 차이로 가부 판단)까지 세트로 나옵니다." },
"mg-talc": {
    guide: {
      hook: "새 기술을 받아들이는 소비자를 '수용 시점별 5집단'으로 나눈 확산 이론입니다.",
      scene: "신기술은 모두가 동시에 쓰지 않습니다. 모험적인 혁신가부터 신중한 지각수용자까지 시간차를 두고 퍼집니다. 특히 초기 시장과 주류 시장 사이의 '캐즘(단절)'을 넘느냐가 성패를 가릅니다.",
      why: "5집단과 '캐즘(Chasm)'이 출제 핵심입니다. 정규분포 형태와 마케팅 전략 시사점이 포인트입니다.",
      mechanism: "5집단(정규분포): 혁신가(Innovators 2.5% — 기술 애호), 초기 수용자(Early Adopters 13.5% — 선각자), 전기 다수(Early Majority 34% — 실용주의), 후기 다수(Late Majority 34% — 보수), 지각 수용자(Laggards 16%). 캐즘(무어): 초기 수용자와 전기 다수 사이의 깊은 단절 — 많은 기술이 여기서 실패. 극복: 전기 다수를 겨냥한 완전완비제품·틈새 집중.",
      map: [
        { as: "기술 애호 모험가", real: "혁신가 2.5%", note: "" },
        { as: "선각자", real: "초기 수용자 13.5%", note: "" },
        { as: "초기↔주류 단절", real: "캐즘", note: "성패 관건" },
        { as: "실용주의 다수", real: "전기 다수 34%", note: "" },
      ],
      usage: "신기술·제품 마케팅 전략입니다. 시험은 5집단, 캐즘, 극복 전략입니다.",
      links: [
        { topic: "TRL(Technology Readiness Level)", how: "기술 성숙도와 시장 수용을 함께 봅니다." },
        { topic: "그로스 해킹(Growth hacking)", how: "초기 사용자 확산 전략과 연결됩니다." },
      ],
      exam: "기술수용 주기(TALC)는 소비자를 혁신가·초기수용자·전기다수·후기다수·지각수용자 5집단으로 나눈 확산 이론으로, 초기 시장과 주류 시장 사이 캐즘 극복이 성패를 가른다.",
    }, image: "/concept/book/mg-talc.png", easy: "신제품이 시장에 퍼지는 과정을 소비자 유형으로 자른 곡선입니다 [혁선전후지] — 혁신수용자(2.5%, 기술애호가: 기술 자체에 관심, 비싼 가격 지불), 선각수용자(13.5%, 선각자: 가치를 알아 가격에 둔감), 전기다수(34%, 실용주의자: 가격에 민감, 시장 1/3), 후기다수(34%, 보수주의자: 첨단기술 두려움, 유명상표 중시), 지각수용자(회의론자: 신기술 거부·방해). 핵심 개념은 캐즘(Chasm) — 선각수용자까지 보급된 뒤 다수 대중(전기다수)으로 넘어가기 직전 수요가 정체·단절되는 골짜기입니다. 극복방안 8가지: 목표 고객 세분화, 명확한 가치제안, 신뢰확보(레퍼런스), 제품완성도 향상, 가격전략 조정, 강력한 유통망 구축, 고객 지원 강화, 브랜드 인지도 확립 — '기술 자랑 대신 실용 가치로 주류 시장을 설득한다'가 관통하는 원리입니다." },
"mg-it-invest": {
    guide: {
      hook: "IT 투자가 '실제로 성과를 냈는지'를 재무·비재무로 평가하는 활동입니다.",
      scene: "IT에 돈을 썼으면 그만한 가치를 냈는지 검증해야 합니다. IT 투자성과 평가는 비용 대비 효익을 재무 지표(ROI·NPV)와 비재무 관점(전략 기여·품질)으로 측정해 투자 의사결정과 사후 관리를 돕습니다.",
      why: "재무 기법(ROI·NPV·IRR·TCO)과 비재무 관점(IT-BSC)의 병행이 출제 핵심입니다. IT의 무형 효익 측정 난제가 포인트입니다.",
      mechanism: "재무 기법: ROI(투자수익률), NPV(순현재가치 — 화폐 시간가치 반영), IRR(내부수익률), TCO(총소유비용 — 도입+운영), Payback(회수기간). 비재무: IT-BSC(재무·고객·내부프로세스·학습성장 4관점), 정보경제학(Information Economics — 무형효익 가중). 단계: 사전(타당성)·중간·사후(성과 검증). IT 효익은 무형·간접이 많아 측정이 어려움.",
      map: [
        { as: "투자수익률", real: "ROI", note: "재무" },
        { as: "화폐 시간가치", real: "NPV·IRR", note: "재무" },
        { as: "도입+운영 총비용", real: "TCO", note: "" },
        { as: "4관점 비재무", real: "IT-BSC", note: "무형 효익" },
      ],
      usage: "IT 투자 의사결정·사후 평가입니다. 시험은 재무 기법, IT-BSC, 무형 효익 측정입니다.",
      links: [
        { topic: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)", how: "비재무 성과 측정 도구입니다." },
        { topic: "기술 가치 평가", how: "가치·효익 산정 관점을 공유합니다." },
      ],
      exam: "IT 투자성과 평가는 ROI·NPV·TCO 등 재무 기법과 IT-BSC 비재무 관점으로 IT 투자 효익을 측정하는 활동으로, 무형·간접 효익 측정이 난제다.",
    }, image: "/concept/book/mg-it-invest.png", easy: "'IT에 쓴 돈이 얼마짜리 효과로 돌아왔나'를 화폐가치로 표현하는 방법입니다. 지표 흐름 [투품이효] — 기획→투자→구축→업무/운영→효과→경영성과로 이어지는 사슬에서 투자지표(투자비용) → 품질지표(개발부서평가) → 이용지표(사용부서평가) → 효과지표(투자성과)를 차례로 재고, 사전 ROI와 사후 ROI를 Feedback으로 잇습니다. 평가는 3단계 — 사전평가(기대효과 추정, 투자 우선순위), 중간평가(비용·위험 수치화, 수정안), 사후평가(CSF·KPI 도출과 측정, 개선안 설계). 성과측정 모델은 BSC(재무지표+CSF·KPI 결합). 분석기법 4종의 정의를 정확히: NPV(예정 순이익을 현재 화폐가치로 변환), ROI(투자 대비 수익 비율), Payback Period(누적 흐름이 플러스로 돌아서는 시점까지 기간), BCR(편익/비용 — 1보다 크면 경제성 있음)." },
"mg-tech-value": {
    guide: {
      hook: "기술(특허·노하우)의 '경제적 가치를 돈으로' 산정하는 평가입니다.",
      scene: "기술을 거래·투자·담보로 쓰려면 값을 매겨야 합니다. 기술 가치 평가는 그 기술이 창출할 경제적 이익을 원가·시장·수익 접근으로 산정하며, 데이터 가치 평가와 유사한 틀을 씁니다.",
      why: "3대 접근법(원가·시장·수익)과 기술 특유 고려요소(기술성·시장성·사업성)가 출제 핵심입니다. TRL과의 연계가 포인트입니다.",
      mechanism: "3접근: 원가법(개발·재현 비용), 시장법(유사 기술 거래가 비교), 수익법(기술이 창출할 미래 현금흐름 현재가치 — 로열티 공제법·DCF, 가장 널리 사용). 고려: 기술성(수준·수명·TRL), 시장성(규모·성장), 사업성(수익성·위험). 목적별: 이전·거래·담보·투자·현물출자. 무형자산 평가의 일종.",
      map: [
        { as: "개발·재현 비용", real: "원가법", note: "" },
        { as: "유사 거래가", real: "시장법", note: "" },
        { as: "미래 현금흐름", real: "수익법(DCF)", note: "주류" },
        { as: "기술성·시장성·사업성", real: "고려요소", note: "" },
      ],
      usage: "기술 이전·거래·담보·투자입니다. 시험은 3접근법, 고려요소, TRL과의 연계입니다.",
      links: [
        { topic: "TRL(Technology Readiness Level)", how: "기술 성숙도가 가치에 반영됩니다." },
        { topic: "데이터 가치 평가", how: "무형자산 가치 평가의 유사 틀입니다." },
      ],
      exam: "기술 가치 평가는 기술의 경제적 가치를 원가·시장·수익(DCF) 접근으로 산정하는 평가로, 기술성·시장성·사업성을 고려하며 이전·거래·담보 등 목적에 활용된다.",
    }, image: "/concept/book/mg-tech-value.png", easy: "기술 가치 평가는 기술이 사업을 통해 창출하는 경제적 가치를, 인정된 가치평가 원칙과 방법론에 따라 평가하는 활동입니다. 절차 5단계를 구간과 함께 — 평가 준비(사전검토: 사업화 가능성·평가인력·일정·현장 실사 / 평가방법 선정: 목적·대상·기간에 따라 결정), 본 평가(사업타당성 분석 → 가치 산정: 경제적수명·매출 규모 추정, 현금흐름·유사 거래 라이선스 비교, 할인율·NPV), 평가 완료(품질검수: 품질관리 위원회·실적 관리). 평가요인 [기권시사] — 기술성(차별성·비교우위), 권리성(권리의 안정적 유지·등록 가능성), 시장성(목표시장·진입 가능성), 사업성(사업화 역량·경쟁력). 평가방법 [수원시] — 수익 접근법(기술요소법·현금흐름법), 원가 접근법(역사적 원가법·재생산원가법), 시장 접근법(거래사례 비교법·로열티 공제법). 데이터 가치 평가(DB 과목)의 3대 접근법과 골격이 같아 세트로 외우면 이득입니다." },
"mg-ipr": {
    guide: {
      hook: "발명·창작·브랜드에 대한 '무형의 재산권' — 산업재산권과 저작권으로 나뉩니다.",
      scene: "아이디어·기술·디자인·이름을 보호하지 않으면 남이 베껴도 못 막습니다. 지식재산권은 이런 무형 창작물에 배타적 권리를 줘, 창작 유인과 공정 경쟁을 보장합니다.",
      why: "산업재산권 4종(특허·실용신안·디자인·상표)과 저작권의 구분이 출제 핵심입니다. 등록주의/무방식주의, SW 보호가 포인트입니다.",
      mechanism: "산업재산권(특허청 등록·심사): 특허(발명, 20년), 실용신안(소발명·고안, 10년), 디자인(물품 외관), 상표(식별표지, 갱신 무한). 저작권(창작 즉시 발생·무방식주의): 어문·음악·SW 등, 저작인격권+저작재산권. 신지식재산권: 영업비밀, 반도체 배치설계, 데이터베이스. SW는 저작권(코드)+특허(알고리즘 방법)로 보호. 속지주의·국제조약(PCT·마드리드).",
      map: [
        { as: "발명 20년", real: "특허", note: "산업재산권" },
        { as: "물품 외관", real: "디자인권", note: "" },
        { as: "브랜드·식별", real: "상표권(갱신 무한)", note: "" },
        { as: "창작 즉시 발생", real: "저작권(무방식)", note: "SW 코드" },
      ],
      usage: "기술·콘텐츠 보호·거래입니다. 시험은 산업재산권 4종·저작권 구분, SW 보호, 등록/무방식주의입니다.",
      links: [
        { topic: "기술 가치 평가", how: "특허 등 지재권 가치 산정과 연계됩니다." },
        { topic: "SW난독화", how: "SW 저작권 보호의 기술적 수단입니다." },
      ],
      exam: "지식재산권은 산업재산권(특허·실용신안·디자인·상표 — 등록주의)과 저작권(창작 즉시 발생 — 무방식주의)으로 나뉘며, SW는 저작권과 특허로 함께 보호된다.",
    }, image: "/concept/book/mg-ipr.png", easy: "머릿속에서 나온 무형의 창작물을 법이 지켜주는 권리로, 3대 분류 [산저신]에 세부 권리를 매달아 외웁니다. ① 산업재산권 [특실디상] — 특허권(자연법칙 이용, 발명 수준이 '고도'한 것), 실용신안권(물품의 형상·구조·조합의 창작 — 특허보다 수준이 낮은 소발명), 디자인권(시각적 미감), 상표권(식별용 표장). ② 저작권 [재인인] — 저작재산권(복제·공연·방송·전시·배포권 등 경제적 권리), 저작인격권(공표권·이름표시권·동일성 유지권 — 주체와 분리 불가), 저작인접권(실연자·음반제작자·방송사업자의 권리). ③ 신지식재산권 [영데식반] — 영업비밀(침해 시 민·형사 구제), 데이터베이스권(DB 구축 투자 보호), 식물신품종권(특허법+종자산업법), 반도체배치설계권. '특허=고도, 실용신안=형상·구조'의 수준 차이가 단골 함정입니다." },
"mg-okr": {
    guide: {
      hook: "'도전적 목표(O)'와 '측정 가능한 핵심결과(KR)'로 조직을 정렬하는 목표 관리 기법입니다.",
      scene: "구글이 쓰는 목표 관리로, '무엇을 이룰까(Objective — 야심찬 방향)'와 '어떻게 알까(Key Results — 정량 지표)'를 세트로 정합니다. 전사부터 개인까지 목표를 투명하게 정렬하고 짧은 주기로 점검합니다.",
      why: "'O(정성 목표)+KR(정량 결과)' 구조와 MBO·KPI와의 차이가 출제 핵심입니다. 도전성·투명성·정렬이 포인트입니다.",
      mechanism: "구조: Objective(정성적·영감을 주는 방향 3~5개) + 각 O당 Key Results(측정 가능한 결과 2~4개, 60~70% 달성이 이상적인 도전 수준). 특징: 상향+하향 정렬(전사→팀→개인 연결), 투명 공개, 짧은 주기(분기), 평가와 분리(도전 장려). MBO/KPI와 차이: OKR은 도전적·투명·상향식, KPI는 성과 측정·관리 지표.",
      map: [
        { as: "야심찬 방향", real: "Objective(정성)", note: "" },
        { as: "정량 지표", real: "Key Results", note: "60~70% 도전" },
        { as: "전사~개인 연결", real: "정렬(Alignment)", note: "" },
        { as: "평가와 분리", real: "도전 장려", note: "KPI와 차이" },
      ],
      usage: "조직 목표 관리·성과 정렬입니다. 시험은 O+KR 구조, MBO/KPI와의 차이, 도전성입니다.",
      links: [
        { topic: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)", how: "전략 목표 관리 도구와 대비됩니다." },
        { topic: "PDCA(Plan-Do-Check-Act, Deming Cycle)", how: "목표 설정·점검 사이클을 공유합니다." },
      ],
      exam: "OKR은 도전적 정성 목표(Objective)와 측정 가능한 핵심결과(Key Results)로 조직을 투명하게 정렬하는 목표 관리 기법으로, 평가와 분리해 도전을 장려한다.",
    }, image: "/concept/book/mg-okr.png", easy: "인텔에서 시작해 구글이 키운 목표 관리 프레임워크입니다. O(목표: 조직 Mission 달성 위해 자신이 설정)와 KR(핵심결과: 목표 달성 여부를 판단하는 핵심 지표)로 구성되고, 원칙 4가지 — 집중·정렬(목표를 투명하게 공개·공유)·추적·도전(실패할 자유, 도전-실패-수정-도전 반복). 운영 원칙의 숫자들이 답안 포인트: 최대 5개 목표 × 목표당 최대 4개 KR, 목표의 60%는 Bottom-up, 달성 목표는 60~70%(40% 미만 BAD, 100%면 목표가 쉬웠던 것), 그리고 평가 연동 금지. MBO와의 비교 — OKR은 1970년대 인텔·KR·정성적(Moon-Shot)·Bottom-up·간접적, MBO는 1950년대 피터 드러커·KPI/S.M.A.R.T.·정량적(Roof-Shot)·Top-down·직접적 — 이 표가 단골 출제입니다." },
"mg-bsc": {
    guide: {
      hook: "재무 지표만이 아니라 '4가지 균형 잡힌 관점'으로 성과를 측정하는 전략 경영 도구입니다.",
      scene: "재무 성과는 과거의 결과일 뿐, 미래 동력은 못 보여 줍니다. BSC는 재무·고객·내부프로세스·학습성장 4관점으로 균형 있게 측정해, 전략을 실행 가능한 지표로 연결합니다. IT-BSC는 이를 IT에 맞춘 것입니다.",
      why: "4관점과 인과관계(학습성장→프로세스→고객→재무), 전략지도가 출제 핵심입니다. IT-BSC의 관점 변형이 포인트입니다.",
      mechanism: "4관점: 재무(주주 관점 — 매출·수익), 고객(만족·점유), 내부 프로세스(효율·품질), 학습·성장(인재·혁신·정보자본). 인과: 학습성장이 프로세스를, 프로세스가 고객을, 고객이 재무를 견인(전략지도로 시각화). 각 관점에 목표·KPI·목표치·실행과제. IT-BSC 관점: 기업 기여도·사용자 지향·운영 우수성·미래 지향. KPI·OKR과 연계.",
      map: [
        { as: "매출·수익", real: "재무 관점", note: "" },
        { as: "만족·점유", real: "고객 관점", note: "" },
        { as: "효율·품질", real: "내부 프로세스", note: "" },
        { as: "인재·혁신", real: "학습·성장", note: "동력" },
      ],
      usage: "전략 실행·성과 관리입니다. 시험은 4관점·인과관계·전략지도, IT-BSC 변형입니다.",
      links: [
        { topic: "OKR", how: "목표 관리 도구와 대비·연계됩니다." },
        { topic: "IT 투자성과 평가", how: "IT-BSC로 비재무 성과를 측정합니다." },
      ],
      exam: "BSC는 재무·고객·내부프로세스·학습성장 4관점으로 성과를 균형 측정하고 인과관계를 전략지도로 연결하는 전략 경영 도구로, IT-BSC는 이를 IT 관점으로 변형한다.",
    }, image: "/concept/book/mg-bsc.png", easy: "재무 숫자만으로는 성과를 다 볼 수 없다는 문제의식에서 나온 균형성과표입니다. BSC 4관점 [재고내학] — 재무, 고객, 내부 프로세스, 학습과 성장. 이를 IT 투자 평가용으로 바꾼 게 IT-BSC [기사운미] — 기업 공헌도(IT 투자로 창출되는 사업가치), 사용자 관점(사용자들이 IT를 어떻게 평가하는지), 운영 프로세스(시스템 개발·구축 프로세스의 효율성), 미래지향(미래 IT 서비스에 필요한 인적·기술적 지원). 관점끼리 짝을 맞추는 문제가 자주 나옵니다: 재무↔기업 공헌도, 고객↔사용자, 내부 프로세스↔운영 프로세스, 학습과 성장↔미래지향. 비교표 한 줄 요약 — BSC는 기업성과측정도구(Biz 거버넌스·경영목표달성지원), IT-BSC는 정보화투자평가도구(IT 거버넌스·IT 가치전달)입니다." },
"mg-esg": {
    guide: {
      hook: "'환경·사회·지배구조'를 경영의 핵심 축으로 삼는 지속가능 경영 패러다임입니다.",
      scene: "이익만 좇던 기업이 이제 환경(E)·사회(S)·지배구조(G)를 함께 챙겨야 투자·소비자에게 선택받습니다. ESG는 비재무 요소를 경영·투자 의사결정에 반영하는 흐름으로, 공시·평가가 제도화되고 있습니다.",
      why: "E·S·G 3요소와 공시·평가 제도, IT의 역할(그린IT·데이터)이 출제 포인트입니다. 지속가능성·규제 동향이 핵심입니다.",
      mechanism: "3요소: 환경(탄소·에너지·자원·오염), 사회(노동·인권·안전·공급망·지역사회), 지배구조(이사회·윤리·투명성·주주권). 공시: 지속가능성 보고(GRI·SASB·ISSB(IFRS S1/S2)·TCFD), 의무화 확대. 평가: MSCI·KCGS 등급. IT 역할: 그린IT(데이터센터 효율), ESG 데이터 관리·공시 자동화, AI 탄소 이슈. 규제(CBAM·공급망 실사) 대응.",
      map: [
        { as: "탄소·자원·오염", real: "환경(E)", note: "" },
        { as: "노동·인권·공급망", real: "사회(S)", note: "" },
        { as: "이사회·윤리·투명성", real: "지배구조(G)", note: "" },
        { as: "지속가능성 공시", real: "ISSB·GRI·TCFD", note: "제도화" },
      ],
      usage: "지속가능 경영·투자·공시입니다. 시험은 3요소, 공시·평가 제도, IT의 역할입니다.",
      links: [
        { topic: "IT 거버넌스(IT-Governance)", how: "지배구조(G)와 연결됩니다." },
        { topic: "데이터 거버넌스(Data Governance)", how: "ESG 데이터 관리·공시에 필요합니다." },
      ],
      exam: "ESG 경영은 환경·사회·지배구조를 경영·투자 의사결정에 반영하는 지속가능 경영으로, ISSB·GRI 공시와 평가 등급이 제도화되며 그린IT·ESG 데이터 관리가 IT의 역할이다.",
    }, image: "/concept/book/mg-esg.png", easy: "ESG 경영은 환경(E)·사회(S)·지배구조(G) 요소를 경영에 반영해, 장기적 기업 가치와 지속 가능성을 높이는 경영 방식입니다. 구성요소 [환사지] — 환경(기후변화·탄소 배출, 에너지 효율, 폐기물 관리, 책임 있는 구매), 사회(고객 만족, 개인정보 보호, 성 평등·다양성, 인권, 근로자 안전, 공급망 관리), 지배구조(이사회·감사위원회 구성, 내부고발제도, 반부패·컴플라이언스). 개념도 흐름은 E+S+G → 비재무적 성과 → 기업생존전략 → 지속가능경영. 국내 ESG 4법(국민연금법·국가재정법·조달사업법·공공기관운영법)은 '주요 내용 vs 재계 우려(공시·평가 기준 부재, 수익성 악화)'를 쌍으로 정리하고, 정보 공개 6원칙(정확성·명확성·비교가능성·균형·검증가능성·적시성)과 목표 3가지(기업가치제고·자본조달·지속가능경영)까지 갖추면 답안이 완성됩니다." },
"mg-design-thinking": {
    guide: {
      hook: "'사용자 공감'에서 출발해 문제를 재정의하고 빠르게 시제품·검증하는 혁신 방법론입니다.",
      scene: "책상에서 추측하지 말고 사용자를 관찰·공감해 진짜 문제를 찾습니다. 아이디어를 발산하고 시제품을 만들어 사용자에게 테스트하며, 실패를 빠르게 반복 개선합니다(IDEO·스탠퍼드 d.school).",
      why: "5단계(공감·정의·아이디어·프로토타입·테스트)와 발산-수렴(더블 다이아몬드)이 출제 핵심입니다. 사용자 중심·반복이 포인트입니다.",
      mechanism: "5단계: 공감(Empathize — 사용자 관찰·인터뷰), 정의(Define — 진짜 문제 재정의·POV), 아이디어(Ideate — 브레인스토밍 발산), 프로토타입(Prototype — 빠른 시제품), 테스트(Test — 사용자 검증·반복). 발산↔수렴 반복(더블 다이아몬드: 문제 발산·정의, 해결 발산·전달). 인간 중심·실패 수용·다학제 협업. 리빙랩·애자일과 연계.",
      map: [
        { as: "사용자 공감", real: "Empathize", note: "출발점" },
        { as: "진짜 문제 재정의", real: "Define(POV)", note: "" },
        { as: "발산·시제품", real: "Ideate·Prototype", note: "" },
        { as: "검증·반복", real: "Test", note: "" },
      ],
      usage: "제품·서비스 혁신·문제 해결입니다. 시험은 5단계, 더블 다이아몬드, 사용자 중심입니다.",
      links: [
        { topic: "리빙랩(Living Lab), S.O.S랩", how: "사용자 참여 혁신을 공유합니다." },
        { topic: "그로스 해킹(Growth hacking)", how: "빠른 실험·반복 정신을 공유합니다." },
      ],
      exam: "디자인 씽킹은 공감·정의·아이디어·프로토타입·테스트 5단계로 사용자 중심 문제를 발산·수렴 반복하며 해결하는 혁신 방법론으로, 리빙랩·애자일과 연계된다.",
    }, image: "/concept/book/mg-design-thinking.png", easy: "사용자에 대한 '공감'에서 출발하는 창의적 문제 해결법입니다. 절차 [공정아프테] 5단계 — 공감(사용자 관찰·인터뷰·Shadowing으로 문제 발견) → 문제 정의(페르소나·고객여정지도로 문제 해석) → 아이디어 도출(브레인스토밍, Divergence 확장적 사고와 Convergence 집중적 사고) → 프로토타이핑(스토리보드·MVP로 실체화) → 테스트(사용성 테스트·Role play, 피드백 회고). 3단계 묶음(Understanding→Create→Feedback)과 함께 기억하세요. 더블 다이아몬드 모델은 확산-수렴을 두 번 반복 — 문제 정의·공감 탐색(첫 다이아몬드, 무엇·왜) → 해결책 개발·실행(둘째 다이아몬드, 어떻게). 3I모델(Innovation=Ideate, Integration=프로토타입·테스트, Impact=피드백)로 혁신전략 계획과 연결되는 것도 출제 포인트입니다." },
"mg-servitization": {
    guide: {
      hook: "제품만 팔던 제조업이 '제품+서비스'를 묶어 파는 서비스화 전략입니다.",
      scene: "엔진을 파는 대신 '비행 시간당 요금'을 받는 롤스로이스처럼, 제조사가 제품에 유지보수·운영·성과 보장 같은 서비스를 결합해 지속 수익과 고객 관계를 만듭니다. 제품-서비스 시스템(PSS)입니다.",
      why: "'제품→서비스 결합'의 유형(제품·사용·결과 지향)과 IoT·구독경제와의 연결이 출제 포인트입니다.",
      mechanism: "PSS(Product-Service System) 유형: 제품 지향(제품 판매+유지보수 서비스), 사용 지향(제품 소유는 공급자, 사용권 판매 — 리스·렌탈), 결과 지향(성과·결과 판매 — Power-by-the-hour). 동인: 차별화·안정적 수익·고객 락인·지속가능성. 기반: IoT(원격 모니터링)·데이터·AI로 예지보전·성과 계약 가능. 구독경제·XaaS와 연결.",
      map: [
        { as: "제품+유지보수", real: "제품 지향 PSS", note: "" },
        { as: "소유 대신 사용권", real: "사용 지향(리스)", note: "" },
        { as: "성과·결과 판매", real: "결과 지향", note: "Power-by-hour" },
        { as: "IoT로 원격 관리", real: "데이터 기반 서비스", note: "" },
      ],
      usage: "제조업 디지털 전환·비즈니스 모델 혁신입니다. 시험은 PSS 3유형, IoT·구독경제 연결입니다.",
      links: [
        { topic: "IoT Matter", how: "원격 모니터링으로 서비스화를 가능케 합니다." },
        { topic: "프로토콜 경제(Protocol Economy)", how: "새로운 비즈니스 모델 흐름을 공유합니다." },
      ],
      exam: "서비타이제이션은 제조업이 제품에 서비스를 결합하는 전략으로, 제품·사용·결과 지향 PSS 유형이 있으며 IoT·데이터로 성과 계약·구독경제를 실현한다.",
    }, image: "/concept/book/mg-servitization.png", easy: "'제품을 파는 회사'에서 '제품이 주는 경험·서비스를 파는 회사'로의 전환 전략입니다. 등장배경은 스마일 커브 — Value Chain에서 제조(Manufacturing) 구간의 부가가치가 꺼지고 R&D와 마케팅·A/S 양 끝이 올라가면서, Products as a Service로 제조업의 패러다임 시프트가 일어났습니다. 유형 [서제시] 3가지 — Product Servitization(제품의 서비스화: 제품에 서비스를 결합, 예: 기기+구독), Service Productization(서비스의 제품화: 표준화·프로세스화·자동화로 서비스를 대량생산하는 제조업화), PSS(Product Service System: 제품+서비스 통합 제공으로 고객 요구를 공동 해결). 적용기술은 Platform·AI·Bigdata·IoT·IIoT·Mobile. 추진전략 그림 '제품 —서비스화→ 융합 ←제품화— 서비스'가 한 장 요약입니다." },
"mg-protocol-economy": {
    guide: {
      hook: "거대 플랫폼의 독점을 벗어나 '개방형 프로토콜과 참여자 보상'으로 돌아가는 경제 모델입니다.",
      scene: "플랫폼 경제는 중개자(빅테크)가 데이터·수익을 독점합니다. 프로토콜 경제는 블록체인 같은 공개 규약 위에서 참여자들이 직접 연결·거래하고 기여에 따라 토큰으로 보상받는 탈중앙 모델을 지향합니다.",
      why: "'플랫폼 경제 vs 프로토콜 경제'의 대비가 출제 핵심입니다. 탈중앙·토큰 인센티브·데이터 주권이 포인트입니다.",
      mechanism: "특징: 개방형 프로토콜(공통 규약)로 참여자 직접 연결(중개자 최소화), 토큰 기반 인센티브(기여자에 보상·거버넌스 참여), 데이터·수익의 참여자 귀속(주권). 기반: 블록체인·Web3·DAO. 플랫폼 경제(중앙 독점)와 대비. 과제: 규제·확장성·수익모델. 협동조합형·공정 분배 지향.",
      map: [
        { as: "중개자 독점", real: "플랫폼 경제(대비)", note: "" },
        { as: "공개 규약으로 직접 연결", real: "개방형 프로토콜", note: "탈중앙" },
        { as: "기여에 토큰 보상", real: "토큰 인센티브", note: "" },
        { as: "데이터·수익 참여자에", real: "데이터 주권", note: "" },
      ],
      usage: "Web3·탈중앙 비즈니스 모델입니다. 시험은 플랫폼 경제와의 대비, 토큰 인센티브, 데이터 주권입니다.",
      links: [
        { topic: "데이터 스페이스(Data Space)", how: "데이터 주권·탈중앙을 공유합니다." },
        { topic: "블록체인 암호기술 가이드라인", how: "프로토콜 경제의 기술 기반입니다." },
      ],
      exam: "프로토콜 경제는 개방형 프로토콜 위에서 참여자가 직접 연결·거래하고 토큰으로 보상받는 탈중앙 경제 모델로, 중개자가 독점하는 플랫폼 경제와 대비된다.",
    }, image: "/concept/book/mg-protocol-economy.png", easy: "프로토콜 경제는 블록체인 기반으로 개인 간 프로토콜(약속)을 정해 중개자 없이 거래하는, 탈중앙화·탈독점화된 공정 플랫폼 경제입니다. 플랫폼 사업자가 수수료를 독식하는 기존 플랫폼 경제의 대안으로 나왔습니다. 개인 간 프로토콜(약속)을 정해 중개자 없이 직접 거래하고, 생산자와 소비자가 '공정한 대가'를 주고받는 상생 생태계를 만듭니다. 핵심요소는 탈중앙화·탈독점화·공정한 분배(분권화). 주요특징 3가지 — 개별성(중개자 없이 판매·대여·공유), 투명성(정보 공개로 신뢰 형성), 공정성(공정한 기회와 인센티브). 적용사례로 디지털 자산거래, 마이데이터 사업, BaaS(서비스형 블록체인), De-Fi 사업이 나오며, 플랫폼 노동자·전통 산업과의 상생모델, 공유경제 활성화 모델 등이 주요 서비스 분류입니다." },
"mg-intention-economy": {
    guide: {
      hook: "기업이 소비자를 좇던 '관심 경제'를 뒤집어, 소비자가 '의도를 내걸고 기업이 응답'하는 모델입니다.",
      scene: "지금은 기업이 광고로 소비자 관심을 사려 다툽니다(관심 경제). 의도 경제는 반대로 소비자가 '이런 걸 이 조건에 사고 싶다'는 구매 의도를 공개하면 기업들이 제안으로 응답합니다 — 주도권이 소비자에게 넘어갑니다. AI 에이전트가 이를 대행합니다.",
      why: "'관심 경제(Attention) → 의도 경제(Intention)'의 전환과 AI 에이전트의 역할이 출제 포인트입니다. 프라이버시·데이터 주권과 연결됩니다.",
      mechanism: "관심 경제(기업이 소비자 주의를 상품화 — 광고) 대비, 의도 경제는 소비자가 자신의 구매 의도(VRM — Vendor Relationship Management)를 표명·통제하고 기업이 그에 응답. AI 에이전트가 소비자 대신 의도를 파악·협상·구매(에이전틱 커머스). 소비자가 데이터·의도의 주도권을 쥠. 프라이버시·데이터 주권 강화. AP2/ACP 같은 에이전트 결제와 연결.",
      map: [
        { as: "기업이 관심 사기(광고)", real: "관심 경제(대비)", note: "" },
        { as: "소비자가 의도 내걸기", real: "의도 경제", note: "주도권 전환" },
        { as: "AI가 대신 협상·구매", real: "AI 에이전트", note: "에이전틱 커머스" },
        { as: "데이터·의도 주권", real: "소비자 통제", note: "" },
      ],
      usage: "AI 에이전트 커머스·마케팅 패러다임입니다. 시험은 관심 경제와의 대비, AI 에이전트, 데이터 주권입니다.",
      links: [
        { topic: "ACP(Agentic Commerce Protocol)", how: "의도 경제를 구현하는 에이전트 결제입니다." },
        { topic: "프로토콜 경제(Protocol Economy)", how: "소비자 주권 강화 흐름을 공유합니다." },
      ],
      exam: "의도 경제는 소비자가 구매 의도를 표명·통제하고 기업이 응답하는 모델로, 기업이 관심을 상품화하는 관심 경제를 뒤집으며 AI 에이전트가 의도를 대행한다.",
    }, image: "/concept/book/mg-intention-economy.png", easy: "의도 경제는 소비자가 자신의 필요와 구매 의도를 직접 표현하면 기업이 그 의도에 맞춰 반응하는 경제 활동 시스템입니다 — 광고로 시선을 붙잡는 주목 경제(Attention Economy)의 반대 개념으로, '러닝이 편안하려면?'이라 물으면 'A 운동화 어떠세요?'로 답하는 방식입니다. 비교표가 핵심: 주목 경제는 제품 노출로 시선 끌기·수동적 소비자·자극적 콘텐츠와 Funnel 분석, 의도 경제는 의도와 목적을 먼저 파악·능동적 소비자·개인 맞춤형 추천과 의도 기반 마케팅. 구성요소는 3그룹 — 대화(프롬프트 + LLM), 의도 분석(Intention Detection Model + 인텐토노미: 2021년 메타가 발표한 인간 의도 이해용 데이터 세트), 추천 시스템(컨텐츠 기반 추천 + 협업 필터링). LLM 시대에 다시 뜨는 개념이라 최신 트렌드 문제로 나오기 좋습니다." },
"mg-growth-hacking": {
    guide: {
      hook: "'데이터 실험'으로 저비용·고속 성장을 이끄는 마케팅+개발 융합 방법입니다.",
      scene: "대규모 광고 대신, 제품 자체에 성장 장치를 심고 빠른 A/B 실험으로 무엇이 사용자 확보·유지·수익화에 효과적인지 찾아 반복합니다. 드롭박스의 추천 보상처럼 데이터 기반으로 성장 지렛대를 찾습니다.",
      why: "AARRR(해적 지표) 퍼널과 '실험·데이터 기반'이 출제 핵심입니다. 전통 마케팅과의 차이가 포인트입니다.",
      mechanism: "AARRR 퍼널: Acquisition(획득), Activation(활성화 — 첫 가치 경험), Retention(유지), Referral(추천 — 바이럴), Revenue(수익). 방법: 지표 설정→가설→빠른 A/B 실험→분석→확산(반복). 제품에 성장 루프(바이럴·추천 보상) 내장. 데이터·개발·마케팅 융합(그로스 팀). 스타트업의 저비용 성장 전략.",
      map: [
        { as: "획득·활성·유지·추천·수익", real: "AARRR 퍼널", note: "" },
        { as: "가설→A/B→분석", real: "빠른 실험", note: "핵심" },
        { as: "제품에 성장 루프", real: "바이럴·추천", note: "" },
        { as: "데이터 기반", real: "전통 마케팅과 차이", note: "" },
      ],
      usage: "스타트업·디지털 제품 성장입니다. 시험은 AARRR, 실험 기반, 전통 마케팅과의 차이입니다.",
      links: [
        { topic: "기술수용 주기(Technology Adoption Life Cycle)", how: "초기 사용자 확산 전략과 연결됩니다." },
        { topic: "탐색적 데이터 분석과 확증적 데이터 분석", how: "실험·데이터 분석을 활용합니다." },
      ],
      exam: "그로스 해킹은 AARRR 퍼널을 데이터·A/B 실험으로 최적화해 저비용 고속 성장을 이끄는 마케팅·개발 융합 방법으로, 제품에 바이럴 성장 루프를 내장한다.",
    }, image: "/concept/book/mg-growth-hacking.png", easy: "감이 아니라 데이터로 성장을 만드는 마케팅 전략입니다. 프로세스는 4단계 순환 — 데이터 분석 → 아이디어 도출 → 우선순위 결정 → 실험 — 을 계속 돌립니다. 기법 [A코퍼] 3종: A/B Test(첫 페이지를 A·B 두 방식으로 시험해 좋은 쪽 선택), Cohort analysis(동일 특성 고객 그룹의 성과를 시간 흐름 따라 비교), Funnel Analysis(단계별로 사용자가 얼마나 남는지 측정). 단계 방법론은 깔때기 모양의 AARRR — Acquisition(신규 고객 획득) → Activation(주요 기능 첫 사용) → Revenue(금액 지불) → Retention(지속 이용·재구매) → Referral(만족한 고객이 주변에 추천). '해적 지표(Pirate Metrics)'라는 별명과 함께 깔때기 순서를 정확히 외우는 게 포인트입니다." },
"mg-civic-hacking": {
    guide: {
      hook: "시민이 '공공데이터·기술로 사회 문제를 직접 해결'하는 참여형 혁신입니다.",
      scene: "정부만 기다리지 않고, 시민·개발자가 공개된 공공데이터를 활용해 미세먼지 앱·재난 지도 같은 걸 직접 만들어 문제를 풉니다. 오픈데이터·오픈소스 정신에 기반한 시민 주도 혁신입니다.",
      why: "'시민 주도·공공데이터 활용'과 오픈 거버먼트·리빙랩과의 관계가 출제 포인트입니다.",
      mechanism: "기반: 공공데이터 개방(Open Data), 오픈소스·오픈API, 시민 개발자 커뮤니티. 활동: 해커톤, 공공서비스 앱 개발, 데이터 시각화, 정책 참여. 원칙: 협력·투명·개방. 오픈 거버먼트(정부 데이터·의사결정 개방)를 시민이 실현. Code for America/Korea 등. 리빙랩·S.O.S랩과 결이 같음.",
      map: [
        { as: "시민이 직접 해결", real: "시민 주도 혁신", note: "" },
        { as: "공공데이터 활용", real: "Open Data", note: "기반" },
        { as: "해커톤·앱 개발", real: "참여 활동", note: "" },
        { as: "정부 개방과 결합", real: "오픈 거버먼트", note: "" },
      ],
      usage: "공공혁신·시민 참여입니다. 시험은 시민 주도·공공데이터, 오픈 거버먼트·리빙랩과의 관계입니다.",
      links: [
        { topic: "리빙랩(Living Lab), S.O.S랩", how: "시민 참여 사회문제 해결을 공유합니다." },
        { topic: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)", how: "공공데이터 개방·활용 기반입니다." },
      ],
      exam: "시빅 해킹은 시민·개발자가 공공데이터와 오픈소스로 사회 문제를 직접 해결하는 참여형 혁신으로, 오픈 거버먼트를 실현하며 리빙랩·해커톤으로 이뤄진다.",
    }, image: "/concept/book/mg-civic-hacking.png", easy: "시민이 공공데이터와 ICT로 직접 사회 문제를 고치는 사회운동입니다 — 코로나 시기 '마스크 지도'가 대표 사례 유형이죠. 개념도: 사회적 이슈/문제(원인·동기)에 시민의 자발적 참여가 더해져 시빅 해킹이 일어나고, 삶의 질 향상(기대효과)으로 이어집니다. 요소기술은 공공데이터·OpenAPI·오픈소스. 참여주체 4인방 — 개발자(공공데이터·OpenAPI·오픈소스로 참여 도구 개발), 기획자(문제 파악·아이디어 구상·의사소통), 디자이너(이해하기 쉬운 UI/UX), 일반시민(참여와 피드백으로 집단지성·정보 확산). 기술요소 표는 주체별로 — 프로그래머(Open Source, Web 2.0), 디자이너(UI/UX 디자인, 웹·앱 접근성 설계 원칙), 시민(공공 데이터, 공공 API)로 정리됩니다. 그로스 해킹(기업 성장)과 대비해 '시민·공공 혁신'이라는 게 구분 포인트입니다." },
"sc-encryption": {
    guide: {
      hook: "평문을 못 읽게 잠그는 자물쇠 — 열쇠를 하나 쓰느냐 둘 쓰느냐가 전부를 가릅니다.",
      scene: "집 열쇠(대칭키)는 잠글 때와 열 때 같은 열쇠라 빠르지만, 열쇠를 상대에게 어떻게 전달하느냐가 문제입니다. 우편함(공개키)은 넣는 구멍은 누구나 쓰지만 꺼내는 열쇠는 주인만 갖고 있어 전달 문제가 없는 대신 느립니다.",
      why: "실무는 둘 중 하나를 고르지 않고 섞어 씁니다 — 데이터는 빠른 대칭키로 잠그고, 그 대칭키만 공개키로 포장해 보냅니다(하이브리드). TLS·전자봉투가 전부 이 구조라, 대칭/비대칭의 한 줄 비교가 모든 암호 문제의 출발점입니다.",
      mechanism: "대칭키: 송수신자가 같은 비밀키 공유(AES·SEED·ARIA), 키 개수 n(n-1)/2로 폭증. 비대칭키: 공개키로 암호화하면 개인키로만 복호(RSA·ECC), 키 2n개로 관리 단순 — 대신 수백~수천 배 느림.",
      map: [
        { as: "같은 열쇠로 잠그고 열기", real: "대칭키 암호(AES·SEED·ARIA)", note: "빠름, 키 배송 문제" },
        { as: "누구나 넣는 우편함 + 주인만 여는 열쇠", real: "공개키 암호(RSA·ECC)", note: "느림, 키 배송 해결" },
        { as: "데이터는 집 열쇠, 열쇠는 우편함으로", real: "하이브리드 암호", note: "TLS·전자봉투의 실제 구조" },
      ],
      usage: "HTTPS 접속 한 번에 두 방식이 다 들어갑니다 — 핸드셰이크에서 비대칭으로 세션키를 교환하고 본문은 대칭으로 암호화. 시험은 대칭 vs 비대칭 3단표 비교와 하이브리드 흐름이 단골입니다.",
      links: [
        { topic: "전자봉투(Digital Envelope)", how: "하이브리드 구조를 그대로 구현한 응용입니다." },
        { topic: "TLS/SSL(Secure Socket Layer)", how: "키 교환은 비대칭, 본문은 대칭 — 같은 뼈대입니다." },
      ],
      exam: "암호화는 대칭키(고속·키 배송 문제)와 비대칭키(저속·키 배송 해결)로 구분되며, 실무는 둘을 결합한 하이브리드 방식을 사용한다.",
    }, image: "/concept/book/sc-encryption.png", easy: "암호화는 알고리즘과 암호화 키를 이용해 평문(읽을 수 있는 메시지)을 암호문(읽을 수 없는 문자열)으로 바꾸는 기술입니다. 열쇠(암호키)로 잠그고 열쇠(복호화키)로 여는 잠금장치라고 보면 됩니다. 목적은 네 가지 — 인증·기밀성·무결성·부인방지. 종류는 세 축으로 정리됩니다. 정보 단위로는 스트림 암호(1비트/1바이트씩, 빠르고 에러 파급 적음)와 블록 암호(단위 블록으로 나눠 처리), 키 형태로는 대칭키(같은 비밀키 공유 — 빠르지만 키 공유 필요, AES·DES)와 비대칭키(공개키-비밀키 쌍 — 키 공유 불필요·전자서명 가능, RSA·ECC), 기반 기술로는 SPN(AES·ARIA)·Feistel(DES·SEED)·인수분해(RSA)·이산대수(디피-헬만·DSA)·해시함수(SHA)입니다. '대칭=빠름+키 공유 문제, 비대칭=느림+전자서명 가능'의 대비가 시험 단골입니다." },
"sc-shannon-principle": {
    guide: {
      hook: "좋은 암호의 설계 기준은 1949년에 이미 두 단어로 정리됐습니다 — 혼돈과 확산.",
      scene: "밀가루 반죽을 생각하세요. 혼돈(Confusion)은 재료(키)와 결과(암호문)의 관계를 뒤엉키게 해 '맛을 보고 레시피를 못 맞히게' 하는 것, 확산(Diffusion)은 소금 한 톨(평문 1비트)을 바꿔도 반죽 전체 맛이 변하게 퍼뜨리는 것입니다.",
      why: "AES 같은 현대 블록 암호의 라운드 구조가 전부 이 두 원칙의 구현입니다 — S-Box가 혼돈을, P-Box(치환·순열)가 확산을 담당합니다. '어느 구성요소가 어느 원칙인가'를 짝짓는 문제가 출제 포인트입니다.",
      mechanism: "혼돈: 키와 암호문의 통계적 상관관계를 없앰 — 비선형 S-Box 대치 연산. 확산: 평문 한 비트 변경이 암호문 절반가량을 바꿈(눈사태 효과) — 행 이동·열 섞기 같은 순열 연산. 라운드를 반복해 두 효과를 증폭합니다.",
      map: [
        { as: "레시피를 못 맞히게 뒤엉킴", real: "혼돈(Confusion)", note: "키↔암호문 관계 은닉, S-Box" },
        { as: "소금 한 톨이 전체 맛을 바꿈", real: "확산(Diffusion)", note: "평문 1비트→암호문 절반, P-Box" },
        { as: "반죽을 여러 번 치댐", real: "라운드 반복", note: "두 효과 증폭" },
      ],
      usage: "AES 내부 구조(SubBytes=혼돈, ShiftRows·MixColumns=확산) 문제와 함께 나옵니다. 눈사태 효과(Avalanche Effect)라는 용어를 답안에 쓰면 확산 이해를 어필할 수 있습니다.",
      links: [
        { topic: "블록 암호화(Block Cipher)", how: "라운드 구조가 혼돈·확산의 구현체입니다." },
        { topic: "해시 함수의 안전성", how: "눈사태 효과는 해시에도 같은 원리로 요구됩니다." },
      ],
      exam: "Shannon의 암호 설계 원칙은 키와 암호문의 관계를 숨기는 혼돈, 평문 변화를 암호문 전체로 퍼뜨리는 확산으로 구성된다.",
    }, image: "/concept/book/sc-shannon-principle.png", easy: "Shannon의 암호 설계 원칙은 혼돈(Confusion)과 확산(Diffusion)을 혼합하면 안전한 암호 시스템을 만들 수 있다는 원칙입니다. 혼돈은 평문·키·암호문 사이의 상관관계를 숨기는 것 — 키 1비트가 암호문 여러 부분에 영향을 주게 해서, 평문-암호문 쌍을 많이 모아도 키를 못 찾게 합니다(구현: 대치, AES/DES의 S-Box). 확산은 평문의 통계적 구조를 암호문 전체에 흩뿌리는 것 — 평문 1비트만 바뀌어도 암호문 여러 비트가 바뀌게 합니다(구현: 치환·전치, DES의 Permutation). 암호화 기법 5종은 두음 [대전압불확] — 대치(카이사르 암호: 값 변경·위치 유지), 전치(레일 펜스 암호: 위치 변경·값 유지), 압축(해시 함수), 블록(AES/DES), 확장(DES 확장 순열). '혼돈=대치=값을 바꿈, 확산=전치=위치를 바꿈' 대응이 시험 포인트입니다." },
"sc-hash-security": {
    guide: {
      hook: "해시가 안전하려면 세 가지를 '못 하게' 해야 합니다 — 역산, 같은 값 찾기, 아무 쌍이나 찾기.",
      scene: "지문 채취로 비유하면 — 지문(해시값)에서 사람(원문)을 복원 못 해야 하고(역상 저항성), 특정인과 같은 지문을 가진 사람을 못 찾아야 하고(제2 역상 저항성), 지문이 같은 아무 두 사람도 못 찾아야 합니다(충돌 저항성). 마지막이 가장 깨기 쉽습니다 — 생일 역설 때문입니다.",
      why: "23명만 모여도 생일이 겹칠 확률이 50%를 넘듯, n비트 해시의 충돌은 2^(n/2) 시도면 찾습니다. SHA-1(160비트)이 퇴출된 이유가 바로 이것 — 안전성 세 조건과 생일 역설의 연결이 출제 핵심입니다.",
      mechanism: "역상 저항성: h가 주어져도 h=H(m)인 m을 못 찾음. 제2 역상: m1이 주어져도 H(m1)=H(m2)인 다른 m2를 못 찾음. 충돌 저항성: H(m1)=H(m2)인 임의의 쌍을 못 찾음 — 생일 공격으로 2^(n/2)에 뚫리므로 출력 길이가 보안 강도의 절반이 됩니다.",
      map: [
        { as: "지문에서 사람 복원 불가", real: "역상 저항성(일방향성)", note: "2^n 시도 필요" },
        { as: "특정인과 같은 지문 찾기 불가", real: "제2 역상 저항성", note: "2^n" },
        { as: "지문 같은 아무 쌍 찾기 불가", real: "충돌 저항성", note: "생일 역설로 2^(n/2) — 가장 약함" },
      ],
      usage: "SHA-256의 충돌 보안 강도는 128비트(절반)라는 계산 문제, SHA-1 퇴출·SHA-3 채택 배경 문제로 나옵니다. 전자서명·블록체인·비밀번호 저장이 모두 이 세 성질 위에 서 있습니다.",
      links: [
        { topic: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)", how: "비밀번호 저장에서 해시를 보강하는 실무 기법입니다." },
        { topic: "암호학적 보안 강도(Security Strength)", how: "해시는 출력 절반이 보안 강도가 되는 근거입니다." },
      ],
      exam: "해시 안전성은 역상·제2 역상·충돌 저항성으로 정의되며, 생일 역설로 충돌 저항성이 출력 길이의 절반 강도로 가장 먼저 위협받는다.",
    }, image: "/concept/book/sc-hash-security.png", easy: "해시 함수의 안전성은 암호학적 해시 함수가 가져야 하는 세 가지 저항성 성질입니다. 해시 함수는 가변 길이 데이터를 고정 길이 다이제스트로 바꾸는 단방향 알고리즘인데('안녕하세요'와 '안녕하세여'처럼 한 글자만 달라도 전혀 다른 값이 나옴), 안전하려면 — ① 역상 저항성: 해시값 Y만 주어졌을 때 H(X)=Y인 입력 X를 못 찾아야 함(일방향 함수), ② 제2역상 저항성(약한 충돌 저항성): 주어진 입력 X와 같은 해시값을 내는 다른 입력 X′를 못 찾아야 함, ③ 충돌 저항성(강한 충돌 저항성): 같은 해시값을 내는 임의의 두 입력 쌍을 아예 못 찾아야 함. 각각을 깨려는 공격이 제1역상 공격(해시값→입력 찾기), 제2역상 공격(같은 해시값의 다른 입력 찾기)입니다. '약한=주어진 입력 기준, 강한=임의의 쌍 기준'이라는 구분이 시험 포인트입니다." },
"sc-salt-key-stretching": {
    guide: {
      hook: "비밀번호 해시가 뚫리는 건 해시가 약해서가 아니라, 미리 계산해 둔 표(레인보우 테이블) 때문입니다.",
      scene: "같은 요리(비밀번호)라도 집집마다 다른 향신료(솔트)를 치면 맛(해시값)이 달라져 '맛 사전'이 무용지물이 됩니다. 여기에 요리를 만 번 반복해서 끓이면(키 스트레칭) 한 그릇 흉내 내는 데도 만 배의 시간이 들어 대량 시도가 불가능해집니다.",
      why: "솔트는 '미리 계산'을 막고, 스트레칭은 '빠른 계산'을 막습니다 — 방어 대상이 다르므로 반드시 같이 씁니다. bcrypt·PBKDF2·scrypt가 이 둘을 내장한 표준 함수라는 것까지가 한 세트입니다.",
      mechanism: "저장 시: 사용자마다 난수 솔트 생성 → H(비밀번호‖솔트)를 수천~수만 회 반복 → 솔트와 최종 해시를 함께 저장. 검증 시 같은 솔트·같은 횟수로 재계산해 비교합니다. 같은 비밀번호라도 솔트가 달라 해시가 다르고, 레인보우 테이블은 솔트별로 새로 만들어야 해 무력화됩니다.",
      map: [
        { as: "집집마다 다른 향신료", real: "솔트(Salt) — 사용자별 난수", note: "레인보우 테이블 무력화" },
        { as: "만 번 반복해 끓이기", real: "키 스트레칭 — 해시 반복", note: "무차별 대입 속도 저하" },
        { as: "이 둘을 내장한 요리법", real: "bcrypt·PBKDF2·scrypt", note: "실무 표준" },
      ],
      usage: "회원 DB 유출 사고에서 '평문 저장이었나, 솔트 있었나'가 처벌 수위를 가릅니다. 시험은 레인보우 테이블 공격 → 솔트, 무차별 대입 → 스트레칭의 대응 짝 맞추기입니다.",
      links: [
        { topic: "해시 함수의 안전성", how: "해시 자체의 성질 위에 얹는 운영 보강책입니다." },
        { topic: "간편인증 인터페이스 가이드라인", how: "인증 정보 저장 요건으로 함께 나옵니다." },
      ],
      exam: "솔트는 사용자별 난수를 더해 레인보우 테이블을 무력화하고, 키 스트레칭은 해시 반복으로 무차별 대입을 지연시킨다 — bcrypt·PBKDF2가 표준 구현이다.",
    }, image: "/concept/book/sc-salt-key-stretching.png", easy: "솔트는 해시 함수 입력에 임의의 문자열을 추가해 다이제스트를 만드는 기법이고, 키 스트레칭은 해시 결과를 다시 입력으로 넣어 N번 반복 실행하는 기법입니다. 같은 비밀번호라도 솔트가 다르면 전혀 다른 해시가 나오므로, 미리 계산해 둔 해시 사전인 레인보우 테이블 공격이 무력화됩니다. 해시를 N번 반복하면 검증 한 번에 걸리는 시간이 N배가 되어 무차별 대입(Brute Force) 공격이 그만큼 느려집니다. 절차는 사용자 데이터 입력 → 임의의 Salt 값 생성·추가 → (스트레칭이면) Hash N번 반복 → Digest 저장. 비슷한 개념인 페퍼(Pepper)는 반대로 '모든 사용자에게 동일한 값'을 추가하며, 솔트는 DB에 평문 저장이 가능하지만 페퍼는 외부에 공개되지 않도록 별도 암호화 보관한다는 차이가 비교 포인트입니다." },
"sc-diffie-hellman": {
    guide: {
      hook: "만난 적 없는 두 사람이 도청당하는 회선으로 비밀 열쇠를 합의하는 마술 — 1976년, 공개키 암호의 출발점입니다.",
      scene: "물감 섞기로 보세요. 공통 물감(공개 파라미터 g, p)에 각자 비밀 물감(개인값 a, b)을 섞어 교환합니다. 도청자는 섞인 물감을 봐도 원래 비밀 물감을 분리하지 못하지만(이산대수 문제), 두 사람은 받은 물감에 자기 비밀을 다시 섞으면 똑같은 최종 색(공유 비밀키)을 얻습니다.",
      why: "키를 '전달'하지 않고 '합의'한다는 발상이 핵심입니다. 다만 상대가 진짜인지 확인하지 않으므로 중간자(MITM)가 양쪽과 각각 키를 만들면 통째로 도청됩니다 — 그래서 인증서(서명)와 반드시 결합해야 한다는 한계까지가 시험 범위입니다.",
      mechanism: "공개: 소수 p와 생성원 g. A는 비밀 a로 g^a mod p 전송, B는 비밀 b로 g^b mod p 전송. 각자 받은 값을 자기 비밀로 거듭제곱하면 g^ab mod p로 동일 — 도청자는 g^a, g^b만으로 g^ab를 못 구합니다(이산대수 난제). 세션마다 비밀값을 새로 뽑으면 DHE, 타원곡선을 쓰면 ECDHE입니다.",
      map: [
        { as: "공통 물감", real: "공개 파라미터 g, p", note: "도청돼도 무방" },
        { as: "각자의 비밀 물감", real: "개인 비밀값 a, b", note: "전송하지 않음" },
        { as: "분리 불가능한 섞임", real: "이산대수 문제", note: "안전성의 근거" },
        { as: "가짜와 각각 물감 섞기", real: "중간자 공격(MITM)", note: "인증 부재의 한계 — 서명으로 보완" },
      ],
      usage: "TLS의 ECDHE 키 교환이 실물입니다 — 세션마다 새 키를 합의하므로 서버 개인키가 나중에 털려도 과거 통신은 안전(완전 순방향 비밀성, PFS). 시험은 절차 그림과 MITM 한계가 단골입니다.",
      links: [
        { topic: "TLS/SSL(Secure Socket Layer)", how: "ECDHE로 이 알고리즘이 실전 배치돼 있습니다." },
        { topic: "포스트 양자 암호(Post-Quantum Cryptography)", how: "이산대수는 양자 컴퓨터(쇼어)에 깨져 PQC로 대체됩니다." },
      ],
      exam: "디피-헬만은 이산대수 난제 기반으로 공개 채널에서 비밀키를 합의하는 최초의 공개키 기법이며, 인증 부재로 중간자 공격에 취약해 서명과 결합한다.",
    }, image: "/concept/book/sc-diffie-hellman.png", easy: "디피-헬만 알고리즘은 암호화되지 않은 공개망에서 도청자가 있어도 안전하게 대칭키를 공유하는 키 교환 알고리즘입니다. 절차 — ① 공개값 공유: 충분히 큰 소수 p와 원시근 g를 공개적으로 공유 ② 비공개 정수 선정: Alice는 x, Bob은 y를 각자 비밀로 정하고 R1=g^x mod p, R2=g^y mod p를 계산 ③ 공개키 교환: R1과 R2를 서로 전송(도청돼도 무방) ④ 재연산: Alice는 (R2)^x mod p, Bob은 (R1)^y mod p를 계산 ⑤ 두 값이 똑같이 g^xy mod p가 되어 공통 비밀키 완성. 도청자는 g, p, R1, R2를 다 봐도 지수 x·y를 역산할 수 없는데, 이것이 이산대수 문제의 어려움입니다. '키 자체를 전송하지 않고 키를 합의한다'는 발상과 최종 키 수식 g^xy mod p가 시험 포인트입니다." },
"sc-block-cipher": {
    guide: {
      hook: "데이터를 고정 크기 블록으로 잘라 잠그는 방식 — 진짜 문제는 '블록들을 어떻게 이어 붙이나'(운영 모드)입니다.",
      scene: "같은 도장(키)으로 같은 내용을 찍으면 같은 자국이 남습니다. ECB 모드로 이미지를 암호화하면 윤곽이 그대로 비치는 유명한 펭귄 그림이 그 증거입니다. 그래서 앞 블록의 결과를 다음 블록에 섞거나(CBC), 카운터를 섞어(CTR) 같은 평문도 다른 암호문이 되게 만듭니다.",
      why: "알고리즘(AES)이 안전해도 모드를 잘못 고르면 무너집니다. 모드별 특성 — 병렬 처리 가능 여부, 오류 전파, IV 필요 여부 — 를 비교하는 표가 출제의 중심입니다.",
      mechanism: "구조는 Feistel(DES — 좌우 교차, 암복호 동일 구조)과 SPN(AES — S-Box 대치 + 순열, 병렬성 우수)으로 나뉩니다. 운영 모드: ECB(블록 독립 — 패턴 노출), CBC(이전 암호문과 XOR 후 암호화 — 직렬), CFB/OFB(스트림처럼 사용), CTR(카운터 암호화 후 XOR — 병렬·랜덤 액세스), GCM(CTR + 인증 태그 — 기밀성과 무결성 동시).",
      map: [
        { as: "같은 내용 같은 도장 자국", real: "ECB 모드의 패턴 노출", note: "사용 금지 수준" },
        { as: "앞 결과를 다음에 섞기", real: "CBC 모드", note: "IV 필요, 직렬 처리" },
        { as: "일련번호를 섞어 찍기", real: "CTR 모드", note: "병렬 처리·랜덤 액세스" },
        { as: "자물쇠 + 봉인 스티커", real: "GCM(인증 암호화)", note: "TLS 1.3 기본" },
      ],
      usage: "TLS 1.3이 AES-GCM을 기본으로 쓰는 이유(기밀성+무결성+병렬)가 실무 정답입니다. 시험은 모드 5종 비교표와 'ECB는 왜 안 되나' 서술입니다.",
      links: [
        { topic: "Shannon의 암호 설계 원칙", how: "SPN 구조의 S-Box·P-Box가 혼돈·확산의 구현입니다." },
        { topic: "TLS/SSL(Secure Socket Layer)", how: "협상되는 대칭 알고리즘·모드가 여기서 나옵니다." },
      ],
      exam: "블록 암호는 Feistel·SPN 구조로 나뉘고 ECB·CBC·CTR·GCM 등 운영 모드가 패턴 노출·병렬성·인증 여부를 가른다.",
    }, image: "/concept/book/sc-block-cipher.png", easy: "블록 암호화는 평문을 일정한 블록 단위(예: 16비트씩)로 잘라, 블록마다 암호화를 수행해 고정 크기 암호문을 만드는 방식입니다. 마지막 블록이 모자라면 비트를 채워(패딩) 크기를 맞춥니다. 구조는 세 갈래 — Feistel(DES·3DES), SPN(AES), 기타(IDEA·Blowfish·RC6). 핵심 출제는 운영 모드 6종입니다: ECB(블록 1:1 독립 암호화 — 가장 단순·병렬 가능하지만 같은 평문이 같은 암호문이 되어 기밀성 최하), CBC(첫 블록은 IV와 XOR, 다음부터는 이전 암호문과 XOR — 체인 연결), PCBC(데이터와 암호 결과를 한 번 더 XOR해 복호화 복잡도까지 높임), CFB(데이터가 아니라 IV를 암호화해 스트림 암호처럼 변환), OFB(키 스트림을 미리 생성해 XOR만 나중에 — 암/복호화 구조 동일), CTR(카운터로 키 스트림 생성 — 패딩 불필요·병렬 가능). IV(초기화 벡터)는 같은 평문도 매번 다른 암호문이 되게 하는 임의 값 — 'ECB만 IV가 없다'와 'CTR은 패딩이 필요 없다'가 시험 포인트입니다." },
"sc-security-strength": {
    guide: {
      hook: "'몇 비트 보안'이라는 말은 열쇠 길이가 아니라 공격 비용의 지수를 뜻합니다.",
      scene: "금고 자물쇠 숫자판이 n자리면 도둑은 최대 10^n번 돌려야 합니다. 보안 강도 112비트란 '2^112번 시도해야 뚫린다'는 공격 비용 단위 — 그런데 자물쇠 종류마다 지름길이 달라서, 같은 강도를 내는 데 필요한 키 길이가 제각각입니다.",
      why: "대칭키는 키 길이 그대로(AES-128=128비트), 해시는 충돌 기준 절반(SHA-256=128비트), RSA는 소인수분해 지름길 때문에 3072비트나 필요합니다(=128비트 강도). 이 환산표가 암기 대상이고, '112비트 미만 퇴출' 같은 정책 판단의 근거입니다.",
      mechanism: "보안 강도 x비트 = 최선의 공격이 약 2^x 연산. 등가 환산(NIST): 112비트 ≈ 3TDEA·RSA 2048·ECC 224·SHA-224, 128비트 ≈ AES-128·RSA 3072·ECC 256·SHA-256, 192비트 ≈ AES-192·RSA 7680·ECC 384, 256비트 ≈ AES-256·RSA 15360·ECC 512. ECC가 RSA보다 짧은 키로 같은 강도를 내는 이유가 여기 있습니다.",
      map: [
        { as: "숫자판 자릿수", real: "보안 강도(비트) = 공격 비용 2^x", note: "키 길이 그 자체가 아님" },
        { as: "자물쇠별 지름길 차이", real: "알고리즘별 등가 키 길이", note: "RSA 3072 = ECC 256 = AES-128" },
        { as: "낡은 자물쇠 교체 기준", real: "112비트 미만 사용 중지 권고", note: "SHA-1·RSA1024 퇴출 근거" },
      ],
      usage: "인증서를 RSA 2048에서 ECC P-256으로 바꾸는 실무 결정, SHA-1 퇴출 공지가 모두 이 표에서 나옵니다. 시험은 등가 환산표 채우기가 단골입니다.",
      links: [
        { topic: "해시 함수의 안전성", how: "해시 강도가 출력 절반인 이유(생일 역설)를 제공합니다." },
        { topic: "포스트 양자 암호(Post-Quantum Cryptography)", how: "양자 공격은 이 환산표 자체를 무너뜨립니다(그로버·쇼어)." },
      ],
      exam: "암호학적 보안 강도는 공격에 필요한 연산량 2^x로 정의되며, 같은 강도라도 대칭·해시·RSA·ECC의 소요 키 길이가 다르다(128비트 = AES-128 = SHA-256 = RSA 3072 = ECC 256).",
    }, image: "/concept/book/sc-security-strength.png", easy: "암호학적 보안 강도는 특정 암호 알고리즘이나 해시 함수를 깨는 데(키 탐색·충돌 탐색·역상 탐색) 필요한 계산량을 2^n 연산량으로 나타낸 척도입니다. '보안 강도 128비트'면 2^128번 연산해야 뚫린다는 뜻이죠. 결정 요소는 네 가지 — 암호 키 길이(키 공간 크기), 해시 출력 길이(충돌·역상 저항성), 운용 모드(평문 노출·무결성 수준), IV·논스 사용 방식(재사용하면 기밀성 저하). 방식별 평가 기준이 달라서: 대칭키는 키 길이 그대로(AES-128 ≈ 128비트), 공개키는 대칭키와의 대응 수준으로(128비트 = RSA 3072 = ECC 256 — 같은 강도에 훨씬 긴 키 필요), 해시는 출력 길이 기준으로 충돌 저항성 n/2비트·역상 저항성 n비트입니다. 숫자 암기 포인트: 112비트(RSA 2048, ~2030년까지) → 128비트(RSA 3072, 2030년 이후 권고) 전환, 그리고 'SHA-256의 충돌 저항성은 128비트'라는 n/2 계산이 단골입니다." },
"sc-homomorphic": {
    guide: {
      hook: "암호문을 풀지 않고 그대로 계산하는 암호 — '데이터를 보여주지 않고 빌려주는' 기술입니다.",
      scene: "잠긴 금고 안에 손만 넣을 수 있는 장갑 구멍이 있다고 보세요. 세탁소(클라우드)는 금고를 못 열지만 장갑 구멍으로 안의 옷을 다려서(연산) 돌려줍니다. 주인이 열어 보면 다려진 옷(연산 결과)이 나옵니다 — 내용물은 한 번도 노출되지 않았습니다.",
      why: "클라우드에 민감 데이터를 맡기는 순간 '처리 중 데이터'가 평문으로 노출되는 문제를 근본 해결합니다. 저장·전송 암호화는 흔하지만 연산 중 암호화는 동형암호가 유일한 소프트웨어적 해법 — PEC(프라이버시 강화 계산)의 대표 기술로 묶어 출제됩니다.",
      mechanism: "E(a)⊕E(b) = E(a+b)처럼 암호문 연산이 평문 연산과 대응(준동형성). 덧셈 또는 곱셈 한 종류만 되면 부분동형(PHE), 제한 횟수는 SHE, 임의 연산은 완전동형(FHE) — 연산마다 노이즈가 쌓여 부트스트래핑으로 재암호화해야 하고, 이 비용이 실용화의 벽입니다. 격자 기반이라 양자 내성도 겸합니다.",
      map: [
        { as: "금고 안 장갑 구멍", real: "암호문 상태 연산", note: "복호화 없이 처리" },
        { as: "다림질 한 가지만 가능", real: "부분동형(PHE)", note: "덧셈 or 곱셈" },
        { as: "무엇이든 손질 가능", real: "완전동형(FHE)", note: "임의 연산, 부트스트래핑 필요" },
        { as: "장갑 낀 손의 둔함", real: "연산 속도·노이즈 누적", note: "실용화 과제" },
      ],
      usage: "의료 데이터 결합 분석, 금융 신용평가 위탁처럼 '원본을 못 주는 데이터의 위탁 연산'이 적용처입니다. 시험은 PHE/SHE/FHE 구분과 PEC·가명처리와의 비교입니다.",
      links: [
        { topic: "PEC(Privacy-Enhancing Computation)", how: "동형암호·MPC·연합학습을 묶는 상위 범주입니다." },
        { topic: "포스트 양자 암호(Post-Quantum Cryptography)", how: "같은 격자 기반 수학을 공유합니다." },
      ],
      exam: "동형암호는 복호화 없이 암호문 상태로 연산해 처리 중 데이터 노출을 원천 차단하며, 지원 연산 범위에 따라 부분·완전동형으로 구분된다.",
    }, image: "/concept/book/sc-homomorphic.png", easy: "동형 암호는 평문과 암호문 사이의 동형(Homomorphic) 성질 덕분에, 복호화하지 않고 암호문 상태 그대로 연산할 수 있는 차세대 암호입니다. 교재 예시로 — 8과 10을 (4로 나눈 나머지, 7로 나눈 나머지)로 암호화하면 (0,1)과 (2,3)이 되고, 이 둘을 암호 상태에서 더한 (2,4)를 복호화하면 정확히 18이 나옵니다. 데이터를 열어보지 않고 계산했는데 결과가 맞는 거죠. 유형은 3단계 — 부분 동형(PHE: 한 유형 연산만), 준 동형(SHE: 덧셈·곱셈 몇 번까지), 완전 동형(FHE: bootstrapping으로 이론상 무한 연산). 설계 원리는 부트스트래핑(암호화된 비밀키로 노이즈 줄인 새 암호문 생성)과 스쿼싱(노이즈 증가 억제), 알고리즘 계보는 RAD78(최초·매우 느림) → BGN05(덧셈+곱셈 1회) → Gen09(격자 기반) → CRT 기반입니다. '연산할수록 노이즈가 쌓여 이를 제어하는 게 핵심'이라는 원리와, 프라이버시 보존 컴퓨팅(PEC)의 대표 기술이라는 위치가 시험 포인트입니다." },
"sc-cryptanalysis": {
    guide: {
      hook: "공격자가 쥔 카드가 많아지는 순서대로 4단계 — 암호문만, 평문 짝, 고른 평문, 고른 암호문.",
      scene: "자물쇠 도둑의 성장기로 보세요. 처음엔 잠긴 자물쇠만 굴려 보고(암호문 단독), 다음엔 열림-잠김 짝을 몇 개 주워서 비교하고(기지 평문), 나중엔 원하는 내용을 직접 잠가 보며 반응을 관찰하고(선택 평문), 끝판엔 복호화 장치까지 빌려 씁니다(선택 암호문).",
      why: "공격 모델의 강도 순서(COA < KPA < CPA < CCA)가 곧 암호가 견뎌야 할 시험 수준입니다. 현대 암호의 안전성 증명이 'CCA에도 안전'을 목표로 하는 이유 — 그리고 차분·선형 분석이 CPA·KPA의 대표 기법이라는 연결이 출제 포인트입니다.",
      mechanism: "COA(암호문 단독): 암호문 통계만으로 분석 — 빈도 분석이 고전 사례. KPA(기지 평문): 평문-암호문 쌍 확보 — 선형 분석. CPA(선택 평문): 원하는 평문의 암호문을 획득 — 차분 분석(입력 차이가 출력 차이로 어떻게 전파되나). CCA(선택 암호문): 복호화 오라클 접근 — 패딩 오라클 공격이 실전 사례.",
      map: [
        { as: "잠긴 자물쇠만 관찰", real: "암호문 단독 공격(COA)", note: "빈도 분석" },
        { as: "열림-잠김 짝 입수", real: "기지 평문 공격(KPA)", note: "선형 분석" },
        { as: "원하는 내용 잠가 보기", real: "선택 평문 공격(CPA)", note: "차분 분석" },
        { as: "복호화 장치까지 활용", real: "선택 암호문 공격(CCA)", note: "패딩 오라클" },
      ],
      usage: "TLS의 패딩 오라클 취약점(POODLE 등)이 CCA의 실전판입니다. 시험은 4가지 모델을 공격자 능력 순으로 나열하고 대표 분석 기법을 짝짓는 문제입니다.",
      links: [
        { topic: "블록 암호화(Block Cipher)", how: "차분·선형 분석에 견디도록 S-Box가 설계됩니다." },
        { topic: "부채널 공격(Side Channel Attack)", how: "수학이 아니라 구현의 물리 정보를 치는 별개 축입니다." },
      ],
      exam: "암호 분석은 공격자 능력에 따라 암호문 단독·기지 평문·선택 평문·선택 암호문 공격으로 강해지며, 현대 암호는 CCA 안전성을 목표로 설계된다.",
    }, image: "/concept/book/sc-cryptanalysis.png", easy: "암호 분석 공격은 암호 시스템을 분석해 암호문을 평문으로 해독하거나 암호 키를 뽑아내려는 공격 기법입니다. 4유형은 '공격자가 얼마나 많은 정보를 갖고 시작하나'의 사다리로 외우면 됩니다 — ① COA(암호문만 보유: 가장 어려운 조건, 방어는 충분한 키 길이·강한 알고리즘) ② KPA(일부 평문 조각(Crib)과 대응 암호문 보유, 방어는 키 스케줄링·솔트) ③ CPA(암호화 장치를 마음대로 써서 평문→암호문 쌍을 무한 생성, 방어는 안전한 암호 구조) ④ CCA(복호화 장치까지 이용해 암호문→평문 확보, 방어는 MAC·안전한 패딩). 뒤로 갈수록 공격자에게 유리한 강한 공격 모델입니다. 함께 나오는 커크호프의 원칙 — 알고리즘은 공개되어도 안전해야 하고, 보안은 오직 '키의 비밀성'에만 의존해야 한다 — 은 'CCA까지 버티는 설계'의 대전제로 결론에 쓰기 좋습니다." },
"sc-quantum-crypto": {
    guide: {
      hook: "도청하면 신호가 망가져서 들킨다 — 수학이 아니라 물리 법칙으로 지키는 키 분배입니다.",
      scene: "봉인 편지가 아니라 '만지면 터지는 비눗방울'로 열쇠를 보내는 셈입니다. 광자 하나에 비트를 실어 보내면, 도청자가 중간에서 관측하는 순간 양자 상태가 무너져(측정 교란) 수신 측 오류율이 튀고, 두 사람은 도청을 즉시 알아챕니다.",
      why: "양자암호(QKD)는 '키 분배'를 물리로 보호하는 것이고, 포스트 양자 암호(PQC)는 '알고리즘'을 수학으로 교체하는 것 — 이 둘의 구분이 최다 출제 포인트입니다. QKD는 전용 광섬유·거리 제한·비용이라는 인프라 한계도 함께 써야 합니다.",
      mechanism: "BB84 프로토콜: 송신자가 광자를 두 기저(＋, ×) 중 무작위로 골라 편광 전송 → 수신자도 무작위 기저로 측정 → 공개 채널로 기저만 대조해 일치한 비트만 키로 채택 → 일부를 공개 비교해 오류율이 임계치를 넘으면 도청 판정 후 폐기. 근거는 측정 시 상태 붕괴와 복제 불가 정리입니다.",
      map: [
        { as: "만지면 터지는 비눗방울", real: "광자의 양자 상태", note: "관측 즉시 교란" },
        { as: "무작위 두 종류 필터", real: "BB84의 이중 기저(＋/×)", note: "기저 일치 비트만 채택" },
        { as: "터진 흔적으로 도둑 적발", real: "오류율 상승 → 도청 탐지", note: "복제 불가 정리" },
        { as: "전용 유리관 배송", real: "QKD 전용 광섬유·거리 제한", note: "인프라 한계" },
      ],
      usage: "국내 통신사의 QKD 시범망(국가기관 전용회선)이 실전 사례입니다. 시험은 BB84 절차 그림과 'QKD vs PQC' 비교 — 물리 기반 키 분배 vs 수학 기반 알고리즘 교체 — 가 단골입니다.",
      links: [
        { topic: "포스트 양자 암호(Post-Quantum Cryptography)", how: "같은 양자 위협에 대한 다른 접근(수학적 교체)입니다." },
        { topic: "디피-헬만 알고리즘(Diffie-Hellman Algorithm)", how: "QKD가 대체하려는 고전 키 교환입니다." },
      ],
      exam: "양자암호(QKD)는 측정 교란과 복제 불가 정리로 도청을 탐지하는 물리 기반 키 분배이며, 알고리즘을 교체하는 PQC와 구분된다.",
    }, image: "/concept/book/sc-quantum-crypto.png", easy: "양자 암호는 양자 중첩·얽힘·불확실성 같은 양자역학 원리로 데이터를 안전하게 암호화·전송하는 기법입니다. 안전의 근거가 수학이 아니라 물리 법칙입니다 — 불확정성 원리 때문에 양자는 복제가 불가능하고, 도청자가 중간에서 측정하는 순간 양자 상태가 바뀌어 도청 시도 자체가 들통납니다. 핵심 응용이 양자 키 분배(QKD): 멀리 떨어진 Alice와 Bob이 완벽한 보안성이 보장되는 비밀 키를 나눠 갖는 기술로, 구현에는 양자광원(단일광자광원)·단일광자 검출기·양자 난수 생성기(QRNG)·양자 채널이 필요합니다. 대표 프로토콜 BB84의 흐름 — 엘리스가 임의 비트를 편광 필터로 보내면, 밥도 임의 필터로 측정한 뒤, 공개 채널에서 '같은 필터를 쓴 비트만' 남겨 최종 키(예: 0101)를 만듭니다. '키를 수학으로 숨기는 게 아니라 물리로 지킨다', 그리고 포스트 양자 암호(수학 알고리즘)와의 구분이 시험 포인트입니다." },
"sc-pqc": {
    guide: {
      hook: "양자 컴퓨터로도 못 깨는 '수학 문제'로 만든 차세대 암호 — 알고리즘 자체를 교체합니다.",
      scene: "쇼어 알고리즘을 돌리는 양자 컴퓨터가 나오면 RSA·ECC가 무너집니다. PQC는 양자로도 풀기 어려운 격자·해시 등의 문제로 암호를 새로 만들어, 기존 통신 인프라(고전 컴퓨터)에서 그대로 씁니다.",
      why: "'QKD(물리 키 분배) vs PQC(수학 알고리즘 교체)'의 구분과 NIST 표준화가 출제 핵심입니다. 격자 기반이 주류인 점이 포인트입니다.",
      mechanism: "양자 내성 수학 문제 기반: 격자 기반(Lattice — 최단벡터 문제, 주류: CRYSTALS-Kyber(KEM)·Dilithium(서명)), 해시 기반 서명(SPHINCS+), 코드 기반(McEliece), 다변수. NIST 표준화(2024 FIPS 203/204/205 확정). 고전 컴퓨터에서 동작(QKD와 달리 전용 하드웨어 불필요). 하베스트 나우-디크립트 레이터(지금 수집·나중 해독) 위협 → 조기 전환(마이그레이션)·크립토 어질리티 필요.",
      map: [
        { as: "양자로도 못 푸는 문제", real: "양자 내성 수학", note: "" },
        { as: "격자 기반 주류", real: "Kyber·Dilithium", note: "NIST 표준" },
        { as: "고전 컴퓨터서 동작", real: "QKD와 차이", note: "하드웨어 불필요" },
        { as: "지금 수집·나중 해독", real: "조기 전환 필요", note: "HNDL 위협" },
      ],
      usage: "차세대 공개키 암호 전환입니다. 시험은 QKD와의 구분, 격자 기반·NIST 표준, HNDL 위협입니다.",
      links: [
        { topic: "양자 암호(Quantum Cryptography)", how: "물리 기반 QKD와 대비되는 수학적 접근입니다." },
        { topic: "암호학적 보안 강도(Security Strength)", how: "양자 공격이 강도 체계를 무너뜨립니다." },
      ],
      exam: "PQC는 양자 컴퓨터로도 풀기 어려운 격자·해시 등 문제로 만든 암호로 고전 컴퓨터에서 동작하며, NIST가 Kyber·Dilithium을 표준화했고 QKD와 달리 알고리즘을 교체한다.",
    }, image: "/concept/book/sc-pqc.png", easy: "포스트 양자 암호(PQC, 양자 내성 암호)는 양자 컴퓨터의 계산 능력에도 안전하도록 설계된 새로운 수학 기반 암호 체계입니다. 왜 필요한가 — 양자 컴퓨터의 쇼어 알고리즘은 소인수분해를 다항 시간에 풀어 RSA·ECC 같은 공개키 암호를 사실상 무너뜨리고, 그로버 알고리즘은 탐색을 가속해 AES·SHA의 보안 강도를 절반으로 깎습니다. 대응 유형 5가지 — 격자 기반(NTRU·LWE: 다양한 응용·빠른 구현, 파라미터 설정 어려움), 코드 기반(McEliece: 빠른 암복호화, 큰 키), 다변수 기반(Rainbow·UOV: 작은 서명, 큰 키), 아이소제니 기반(SIDH: 작은 키, 느린 연산), 해시 기반 전자서명(SPHINCS: 안전성 증명 가능, 큰 서명). 양자 암호(QKD)가 물리 장비로 키를 지키는 것과 달리 PQC는 기존 인프라에서 소프트웨어 교체로 적용 가능한 '수학'이라는 대비, 그리고 '쇼어=공개키, 그로버=대칭키' 매핑이 시험 포인트입니다." },
"sc-deepvoice": {
    guide: {
      hook: "AI로 목소리를 복제해 '아는 사람 목소리'로 속이는 피싱 — 보이스피싱의 진화형입니다.",
      scene: "자녀·상사·거래처의 짧은 통화나 유튜브 음성 몇 초만 있으면 AI가 그 사람 목소리를 그대로 흉내 냅니다. '엄마 나야, 폰 고장 나서…'가 진짜 목소리로 걸려 오면 사람은 거의 못 거릅니다.",
      why: "생성형 AI 악용의 대표 사례로, 딥페이크(영상)와 짝을 이룹니다. 기술적 탐지(음성 위조 검출)와 절차적 방어(콜백 검증·가족 암호)를 함께 써야 한다는 다층 방어 논리가 출제 포인트입니다.",
      mechanism: "공격: 표적 음성 수집(SNS·통화) → TTS/음성 변환 모델로 클로닝 → 실시간 통화에 합성음 주입. 방어: 합성음의 미세 주파수·운율 이상 탐지(AI 탐지 모델), 워터마킹된 정품 음성 식별, 절차적으로 별도 채널 콜백·사전 약속 암호 확인.",
      map: [
        { as: "몇 초 음성으로 목소리 복제", real: "음성 클로닝(TTS·음성변환)", note: "공격 수단" },
        { as: "진짜 같은 가짜 통화", real: "실시간 합성음 주입", note: "사회공학 결합" },
        { as: "AI로 가짜 음성 색출", real: "합성음 탐지 모델", note: "기술적 방어" },
        { as: "다른 번호로 되걸기·암호 확인", real: "콜백·사전 약속 검증", note: "절차적 방어" },
      ],
      usage: "기업 CEO 사칭 송금 사기(BEC)의 음성판이 실사례입니다. 시험은 딥페이크와 묶어 '생성형 AI 역기능 대응'으로, 기술+제도+인식의 다층 방어로 서술합니다.",
      links: [
        { topic: "OWASP Top 10 for LLM Application 2025", how: "생성형 AI 악용이라는 같은 위협 계열입니다." },
        { topic: "DMARC", how: "사칭이라는 공통 축 — 이메일 사칭 방어와 대비됩니다." },
      ],
      exam: "딥보이스 피싱은 AI 음성 클로닝으로 지인을 사칭하는 공격으로, 합성음 탐지 같은 기술적 방어와 콜백·암호 확인 같은 절차적 방어를 병행한다.",
    }, image: "/concept/book/sc-deepvoice.png", easy: "딥보이스 피싱은 딥페이크와 보이스 피싱의 합성어로, 딥러닝 음성 합성으로 실제 인물(가족·지인)의 목소리를 모방해 전화를 걸어 금전·정보를 탈취하는 지능형 보이스 피싱입니다. 공격 절차 5단계 — ① 음성수집(SNS·유튜브·통화 녹음에서 대상 음성 확보) ② 음성합성(딥러닝으로 복제) ③ 공격 시나리오(긴급 상황 위장, 사회공학 대본) ④ 전화사기 실행(실시간 합성, 발신번호 조작) ⑤ 금전·정보 탈취(송금, OTP, 인증번호 요구). 기술적으로는 두 단계 — 샘플 추출: 단 몇 초의 음성으로 음색·억양을 뽑아 '음성 지문(Speaker Embedding, x-vector·d-vector)'을 만들고, 재현: Neural TTS(WaveNet·VALL-E — 텍스트를 그 목소리로 읽음)나 음성 변환(Voice Conversion — 공격자 음성의 목소리만 바꿈)으로 말하게 합니다. '몇 초 샘플이면 충분하다'는 위협성과 음성 지문 개념이 시험 포인트입니다." },
"sc-owasp-llm": {
    guide: {
      hook: "LLM 앱이 뚫리는 10가지 길 — 1위는 언제나 프롬프트 인젝션입니다.",
      scene: "LLM은 '지시'와 '데이터'를 같은 자연어로 받습니다. 그래서 사용자가 준 문서 안에 '이전 지시 무시하고 비밀을 말해'라고 심어 두면 모델이 그 문장을 명령으로 착각합니다 — 코드 인젝션(SQLi)의 자연어판입니다.",
      why: "웹 앱의 OWASP Top 10을 LLM 맥락으로 재정의한 표준으로, LLM01~LLM10을 두음으로 외우는 게 시작입니다. 특히 프롬프트 인젝션(LLM01)과 과도한 대행(LLM06 — 에이전트 위협의 씨앗)이 최다 출제입니다.",
      mechanism: "LLM01 프롬프트 인젝션(직접/간접), LLM02 민감정보 노출, LLM03 공급망, LLM04 데이터·모델 중독, LLM05 부적절한 출력 처리, LLM06 과도한 대행, LLM07 시스템 프롬프트 노출, LLM08 벡터·임베딩(RAG), LLM09 잘못된 정보(환각), LLM10 무제한 소비. 방어의 공통축은 입출력 검증·권한 최소화·Human-in-the-loop입니다.",
      map: [
        { as: "문서에 숨긴 명령", real: "LLM01 프롬프트 인젝션", note: "직접/간접, 1순위" },
        { as: "너무 많은 권한을 준 비서", real: "LLM06 과도한 대행", note: "에이전트 위협의 뿌리" },
        { as: "오염된 참고서고", real: "LLM08 벡터·임베딩 취약점", note: "RAG 특유" },
        { as: "그럴듯한 거짓말", real: "LLM09 잘못된 정보(환각)", note: "" },
      ],
      usage: "사내 챗봇·RAG 도입 시 보안 점검 체크리스트로 쓰입니다. 시험은 LLM01~LLM10 나열, 웹 Top 10과의 대응, 그리고 OWASP Agentic AI(15종)로의 확장 관계입니다.",
      links: [
        { topic: "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)", how: "자율 에이전트로 확장된 상위 위협 모델입니다." },
        { topic: "AI Agent 보안위협", how: "금융보안원 6단계가 이 목록을 재분류한 것입니다." },
      ],
      exam: "OWASP LLM Top 10은 프롬프트 인젝션·과도한 대행·벡터 취약점 등 LLM 앱 고유 위협 10종을 정의하며, 입출력 검증·권한 최소화·인간 개입으로 대응한다.",
    }, image: "/concept/book/sc-owasp-llm.png", easy: "OWASP Top 10 for LLM Application 2025는 대규모 언어 모델(LLM) 기반 앱에서 가장 심각한 10대 보안 취약점을 정리한 가이드라인입니다. 웹 앱용 OWASP Top 10과 별개로, 생성형 AI 고유의 위협을 다루는 게 핵심입니다. 두음 [프민공데부 과시벡잘무]로 외웁니다 — 프롬프트 인젝션(악의적 프롬프트로 LLM 행동 조작), 민감정보 공개(개인정보·기밀 노출), 공급망(서드파티·사전학습모델 취약점), 데이터·모델 중독(학습데이터 변조), 부적절한 출력 처리(검증·Sandboxing 미흡), 과도한 대행(지나친 자율 행동), 시스템 프롬프트 노출(내부 지시 공개), 벡터·임베딩 취약점(RAG 검색 결함), 잘못된 정보(환각·편향), 무제한 소비(자원 고갈). 대응의 공통 축은 입력 검증·출력 모니터링·인간 개입(Human-in-the-loop)·SBOM·속도 제한입니다. '프롬프트 인젝션이 1위', '벡터·임베딩은 RAG 취약점', '과도한 대행은 에이전트 위협'이 시험 포인트입니다." },
"sc-cyber-warfare": {
    guide: {
      hook: "국가가 국가를 공격하는 다섯 번째 전장 — 육·해·공·우주 다음이 사이버입니다.",
      scene: "미사일 없이 발전소를 멈추고 은행을 마비시킵니다. 스턱스넷이 이란 원심분리기를 물리적으로 파괴한 사건처럼, 코드가 실제 설비를 부수는 시대의 전쟁 개념입니다.",
      why: "APT·랜섬웨어 같은 개별 공격 기법의 '동기·주체'가 국가라는 점이 핵심 — 정치·경제·군사 목적과 결합됩니다. 국가 기반시설(SCADA·발전·금융) 보호와 사이버 레질리언스로 연결되는 상위 개념으로 출제됩니다.",
      mechanism: "유형: 정보전(정찰·유출), 심리전(가짜뉴스·여론 조작), 인프라 공격(전력·통신·금융 마비), 무기화(스턱스넷류 물리 파괴). 특징은 귀속(attribution)의 어려움 — 공격 주체를 특정하기 어려워 보복·억제가 성립하기 힘듭니다.",
      map: [
        { as: "정찰·기밀 탈취", real: "사이버 정보전", note: "APT와 결합" },
        { as: "가짜뉴스·여론 조작", real: "심리전·영향력 공작", note: "" },
        { as: "발전소·금융망 마비", real: "국가기반시설 공격", note: "SCADA·ICS 표적" },
        { as: "코드로 설비 파괴", real: "무기화(스턱스넷)", note: "물리적 피해" },
      ],
      usage: "국가 사이버안보 전략, 주요정보통신기반시설 보호법의 배경입니다. 시험은 사이버전의 특징(비대칭성·귀속 곤란)과 대응 거버넌스(민관군 협력) 서술입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "사이버전의 실행 수단이 되는 지속 공격 기법입니다." },
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "공격을 전제로 버티고 복원하는 국가급 대응 개념입니다." },
      ],
      exam: "사이버전은 국가 주체가 정보·심리·기반시설·무기화 공격을 수행하는 제5의 전장으로, 귀속의 어려움과 기반시설 보호가 핵심 쟁점이다.",
    }, image: "/concept/book/sc-cyber-warfare.png", easy: "사이버전은 가상 공간에서 사이버 공격 수단으로 적의 정보 체계를 교란·거부·통제·파괴하고 이를 방어하는 국가 차원의 활동입니다. 특징 6가지 — 비대칭 전력(약자도 강자를 타격), 공격자·장소 추적의 난해성, 전쟁 행위 경계의 모호성, 신규 무기 체계, 조기 경보 체계 부재, 전선 부재. 개념도로 보면 국가 Cyber System(컴퓨터·네트워크·데이터)을 두고 Cyber Space에서 방어·공격이 오가며, Cyber 해킹(정보 획득)·Cyber 전쟁(정보 체계 파괴)·Cyber 테러(인터넷 기반 공격)로 나뉩니다. 보안기술은 4영역 — 정보보안 핵심 원천기술(초경량 고비도 암호·양자 암호), 방어 기술(CTI·사이버 킬 체인·능동형 자가 방어), 분석 기술(해킹 역추적·밀리터리 포렌식), 공격 기술(봇 공격·EMP 폭탄). '전선도 경보도 없이 누가 공격했는지도 모른다'는 비대칭성과, 방어·분석·공격 3계층 분류가 시험 포인트입니다." },
"sc-apt": {
    guide: {
      hook: "한 방이 아니라 몇 달을 숨어 파고드는 '지속' 공격 — 표적을 정해 끈질기게 노립니다.",
      scene: "빈집털이가 아니라 위장 취업한 스파이입니다. 스피어피싱 한 통으로 발판을 만들고, 들키지 않게 조금씩 권한을 넓히며 몇 달간 잠복하다가, 원하는 자료를 찾으면 천천히 빼돌립니다.",
      why: "일반 공격과 달리 '표적형·지속형·은밀형'이라는 3특성이 핵심이고, 방어가 경계선(예방)이 아니라 내부 탐지(위협 헌팅·EDR)로 넘어가야 하는 근거입니다. 사이버 킬체인 단계와 매핑해 출제됩니다.",
      mechanism: "킬체인: 정찰 → 초기 침투(스피어피싱·워터링홀) → 발판 확보(C2 채널) → 권한 상승·내부 이동(Lateral Movement) → 목표 달성(데이터 유출·파괴) → 흔적 제거. 오래 머물며 정상 트래픽에 섞이므로 시그니처 기반 탐지가 무력합니다.",
      map: [
        { as: "위장 취업한 스파이", real: "지속·은밀 잠복", note: "저속·저노이즈" },
        { as: "특정 회사만 노림", real: "표적형(Targeted)", note: "무차별 아님" },
        { as: "미끼 메일로 문 열기", real: "스피어피싱 초기 침투", note: "" },
        { as: "옆방으로 조금씩 이동", real: "내부 이동(Lateral Movement)", note: "권한 확대" },
      ],
      usage: "국가·대기업 대상 침해사고 대부분이 APT입니다. 시험은 킬체인 단계 나열과 '경계 방어의 한계 → 위협 헌팅·EDR/XDR 전환' 논리입니다.",
      links: [
        { topic: "위협 헌팅(Threat Hunting)", how: "잠복한 APT를 능동적으로 찾아내는 대응입니다." },
        { topic: "EDR(Endpoint Detection and Response)", how: "내부 이동·잠복을 단말에서 탐지합니다." },
      ],
      exam: "APT는 특정 표적을 장기간 은밀히 노리는 지속 공격으로, 킬체인을 따라 침투·잠복·유출하며 경계 방어 대신 위협 헌팅·EDR로 대응한다.",
    }, image: "/concept/book/sc-apt.png", easy: "APT(지능형 지속 위협)는 특정 표적을 장기 계획과 고도화된 수법으로 오랜 기간 끈질기게 공격하는 정교한 사이버 공격입니다. 무차별 공격이 아니라 '한 곳만 파는' 표적형이라는 게 핵심 — 특징이 지능화·지속성·명확한 타겟입니다. 공격 절차 4단계 — ① 침투(Incursion: 사회공학·제로데이·훔친 인증정보로 거점 구축) ② 검색(Discovery: 다중벡터로 은밀히 내부 정보·기밀 자동 검색, 'Run silent, run deep') ③ 수집(Capture: 권한 상승으로 보호되지 않은 데이터 노출) ④ 제어(Control: 제어권 장악 후 기밀 유출·시스템 손상). 대응은 조직(CISO·APT 대응 TFT)·규정·보안의식·시스템(계층 방어·망 분리)·네트워크(Outbound Callback 탐지)·데이터(DLP·SIEM·로그 시계열 분석) 6축입니다. '느리고 은밀하게, 정상 계정으로' 움직여 기존 시그니처 탐지를 피한다는 점과 침투→검색→수집→유출 4단계가 시험 포인트입니다." },
"sc-sniffing-spoofing": {
    guide: {
      hook: "엿듣기(스니핑)와 속이기(스푸핑) — 수동 공격과 능동 공격의 원형 한 쌍입니다.",
      scene: "스니핑은 회선에 도청기를 붙여 조용히 듣는 것(수동), 스푸핑은 가짜 신분증으로 남 행세를 하는 것(능동)입니다. 둘을 결합하면 통신 중간에 끼어들어 양쪽을 속이며 엿듣는 중간자 공격이 됩니다.",
      why: "정보보안 3요소로 정리됩니다 — 스니핑은 기밀성 침해, 스푸핑은 무결성·인증 침해. ARP·IP·DNS 등 '무엇을 위조하느냐'로 스푸핑 종류가 갈리고, 세션 하이재킹으로 이어지는 연결이 출제 포인트입니다.",
      mechanism: "스니핑: NIC를 무차별 모드(Promiscuous)로 두어 지나는 패킷 수집 — 스위치 환경에선 ARP 스푸핑으로 트래픽을 자기 쪽으로 끌어옴. 스푸핑: ARP(MAC-IP 매핑 위조), IP(출발지 주소 위조), DNS(응답 위조로 가짜 사이트 유도). 방어는 암호화(스니핑 무력화)와 인증·검증(스푸핑 차단).",
      map: [
        { as: "회선 도청기", real: "스니핑 — 수동, 기밀성 침해", note: "무차별 모드" },
        { as: "가짜 신분증", real: "스푸핑 — 능동, 인증·무결성 침해", note: "ARP·IP·DNS" },
        { as: "중간에 끼어 양쪽 속이기", real: "중간자 공격(MITM)", note: "둘의 결합" },
        { as: "통화 가로채 이어받기", real: "세션 하이재킹", note: "후속 공격" },
      ],
      usage: "공용 와이파이 도청, 피싱 사이트 유도(DNS 스푸핑)가 실사례입니다. 시험은 두 공격의 능동/수동·침해 요소 비교와 방어책(암호화 vs 인증) 대응입니다.",
      links: [
        { topic: "디피-헬만 알고리즘(Diffie-Hellman Algorithm)", how: "MITM에 취약해 인증서 결합이 필요합니다." },
        { topic: "DNSSEC(Domain Name System Security Extension)", how: "DNS 스푸핑을 서명으로 차단합니다." },
      ],
      exam: "스니핑은 기밀성을 침해하는 수동 도청, 스푸핑은 인증·무결성을 침해하는 능동 위장이며, 결합하면 중간자 공격이 되어 암호화와 인증으로 각각 방어한다.",
    }, image: "/concept/book/sc-sniffing-spoofing.png", easy: "스니핑과 스푸핑은 짝으로 나오는 네트워크 공격입니다. 스니핑은 남의 패킷을 몰래 엿보는 '감청'(수동적, 기밀성 침해)이고, 스푸핑은 가짜 정보로 신뢰받는 시스템인 척 '위장'하는 것(능동적, 무결성 침해)입니다. 한 줄 대구 — 스니핑=엿보기, 스푸핑=속이기. 스니핑은 허브 환경의 패시브 스니핑과 스위치 환경의 액티브 스니핑으로 나뉘는데, 스위치에서는 몰래 볼 수가 없어서 ARP 스푸핑을 먼저 걸어 트래픽을 끌어옵니다(그래서 둘이 엮임). 스푸핑 종류는 ARP(가짜 MAC)·IP(가짜 IP)·DNS(가짜 사이트 유도)·이메일(발신자 위조). 방어는 스니핑에 VPN·HTTPS·TLS(암호화하면 감청해도 못 읽음), 스푸핑에 ARP/DNS 보호·이메일 인증. 더 나아가 Sniffing+Spoofing으로 Sequence Number를 얻으면 Session Hijacking(세션 탈취)까지 이어진다는 상관관계가 시험 포인트입니다." },
"sc-bpf-door": {
    guide: {
      hook: "리눅스 커널의 패킷 필터 기능(BPF)을 악용해 포트 없이 숨어 있는 백도어입니다.",
      scene: "일반 백도어는 문을 하나 열어 두므로 포트 스캔에 걸립니다. BPF Door는 문을 열지 않고, 커널이 모든 패킷을 훑는 길목에 감시병을 심어 뒀다가 '특정 암호가 담긴 패킷'이 지나갈 때만 깨어나 명령을 실행합니다.",
      why: "커널 수준·무포트라 기존 네트워크 탐지가 못 잡는다는 점이 핵심입니다. BPF라는 정상 기능의 오남용 사례로, EDR·커널 무결성 모니터링의 필요성을 보여주는 최신 출제 소재입니다.",
      mechanism: "공격자가 raw 소켓에 악성 BPF 필터를 부착 → 커널이 수신하는 모든 패킷을 필터가 검사 → 사전 정의된 매직 패킷(특정 페이로드) 도착 시에만 트리거 → 리버스 셸 등 실행. 리스닝 포트가 없어 netstat·포트 스캔에 안 잡힙니다.",
      map: [
        { as: "길목의 잠복 감시병", real: "커널 BPF 필터 후킹", note: "무포트" },
        { as: "정해진 암구호에만 반응", real: "매직 패킷 트리거", note: "은밀성" },
        { as: "포트 스캔에 안 걸림", real: "리스닝 소켓 부재", note: "탐지 회피" },
      ],
      usage: "리눅스 서버 대상 APT에서 관측된 실제 기법입니다. 시험은 '정상 기능(BPF)의 악용'과 '무포트 백도어라 EDR/커널 모니터링이 필요' 논리로 씁니다.",
      links: [
        { topic: "루트킷(Rootkit)", how: "커널 수준 은닉이라는 공통 축의 백도어입니다." },
        { topic: "EDR(Endpoint Detection and Response)", how: "무포트·커널 위협을 단말 행위로 탐지합니다." },
      ],
      exam: "BPF Door는 커널 패킷 필터를 악용해 포트 없이 매직 패킷에만 반응하는 백도어로, 네트워크 탐지를 회피하므로 EDR·커널 무결성 모니터링이 필요하다.",
    }, image: "/concept/book/sc-bpf-door.png", easy: "BPF Door는 리눅스 커널의 BPF(패킷 필터) 기술을 악용한 백도어입니다. 무서운 점은 '포트를 열지 않는다'는 것 — 보통 백도어는 특정 포트를 열어 두다 포트 스캔에 걸리는데, BPF Door는 커널에 패킷 감청 필터를 심어두고 평소엔 조용히 있다가 공격자가 보낸 특정 '매직 패킷(Magic Packet)'이 도착할 때만 깨어납니다. 게다가 커널 레벨에서 iptables 방화벽보다 먼저 패킷을 읽어 방화벽도 우회합니다. 공격 흐름 — ① 정상 데몬으로 위장해 잠입 ② 자신만의 BPF 필터를 커널에 등록 ③ 매직 패킷 감시 ④ 방화벽 우회 ⑤ iptables 규칙을 임시 조작해 리버스 셸/바인드 셸 실행 ⑥ root 권한 획득·완전 제어. 대응은 최소권한·포트 차단(관리적)과 IOC 기반 EDR/NIDS 탐지·비정상 트래픽 분석(기술적). '포트 미개방 + 매직 패킷 트리거 + 방화벽 우회'라는 은닉성이 시험 포인트입니다." },
"sc-side-channel": {
    guide: {
      hook: "암호 알고리즘이 아니라 '구현이 흘리는 부수 정보'를 쳐서 키를 훔칩니다.",
      scene: "금고 다이얼을 못 풀어도, 돌릴 때 나는 소리·걸리는 시간·손끝의 미세한 저항으로 번호를 알아내는 도둑입니다. 연산 시간, 전력 소모, 전자파, 심지어 소리까지가 단서가 됩니다.",
      why: "수학적으로 완벽한 암호도 물리 구현에서 새는 정보로 뚫린다는 점이 핵심 — 방어도 알고리즘이 아니라 구현(일정 시간 연산·잡음 삽입)에서 해야 합니다. 스마트카드·TPM 같은 하드웨어 보안의 필수 고려사항으로 출제됩니다.",
      mechanism: "유형: 타이밍 공격(연산 시간 차이 → 키 추정), 전력 분석(SPA/DPA — 소비 전력 패턴), 전자파 분석(EM), 캐시 공격(Spectre·Meltdown류), 폴트 주입(전압·클록 교란으로 오류 유발 후 분석). 방어: 상수 시간 구현(입력 무관 동일 시간), 마스킹·블라인딩, 물리 차폐, 잡음 삽입.",
      map: [
        { as: "다이얼 돌리는 시간", real: "타이밍 공격", note: "상수 시간 구현으로 방어" },
        { as: "돌릴 때 전류 변화", real: "전력 분석(SPA/DPA)", note: "마스킹·잡음" },
        { as: "일부러 흔들어 오류 유발", real: "폴트 주입 공격", note: "" },
        { as: "옆방 캐시 흔적 엿보기", real: "캐시 공격(Spectre)", note: "CPU 마이크로아키텍처" },
      ],
      usage: "스마트카드·하드웨어 지갑·TPM 설계의 핵심 위협입니다. 시험은 '수학 안전 ≠ 구현 안전' 논지와 상수 시간·마스킹 같은 구현 수준 대응입니다.",
      links: [
        { topic: "암호 분석 공격(Cryptanalysis Attacks) 기법", how: "수학적 분석과 대비되는 물리적 분석 축입니다." },
        { topic: "기밀컴퓨팅(Confidential Computing)", how: "TEE도 부채널을 위협 모델로 다룹니다." },
      ],
      exam: "부채널 공격은 연산 시간·전력·전자파 등 구현이 흘리는 정보로 키를 추론하는 공격으로, 상수 시간 구현·마스킹 등 구현 수준 방어가 필요하다.",
    }, image: "/concept/book/sc-side-channel.png", easy: "부채널 공격은 암호 알고리즘 자체를 수학적으로 깨는 게 아니라, 그 알고리즘이 돌아가는 '물리 장치가 흘리는 정보'를 역이용해 비밀키를 알아내는 공격입니다. 디바이스가 연산할 때 새어 나오는 전력 소모량·연산 시간·발열·전자파·소리·파장을 측정·분석하면, 놀랍게도 내부의 Secret Key를 추론할 수 있습니다. 기법은 세 축 — SW 연산 과정(수동적: 시차·전력분석·전자파 / 능동적: 오류주입·콜드부트), 모듈 접근(침입·준침입·비침입 TEMPEST), 표본 분석(단순 SPA·차분 DPA). 대응은 무작위성(랜덤화)·블라인딩·마스킹·하이딩(더미 연산 삽입·셔플링)으로 누수 정보와 실제 키의 상관관계를 끊는 것입니다. '알고리즘이 아무리 안전해도 구현·물리 계층이 새면 뚫린다'는 발상, 그리고 스마트카드·IoT·OTP처럼 물리 접근이 쉬운 기기가 표적이라는 점이 시험 포인트입니다." },
"sc-drive-by-download": {
    guide: {
      hook: "클릭도 안 했는데 웹페이지를 '보기만' 해도 악성코드가 깔립니다.",
      scene: "정상 사이트가 해킹돼 악성 스크립트가 심기면, 방문자의 브라우저·플러그인 취약점을 자동으로 찔러 몰래 설치합니다. 사용자는 아무 동의도, 클릭도 하지 않았습니다.",
      why: "사용자 부주의가 아니라 '취약점 자동 악용'이 핵심이라 패치 관리와 브라우저 격리가 방어의 중심입니다. 워터링홀(표적이 자주 가는 사이트 감염)·멀버타이징(악성 광고)과 묶여 출제됩니다.",
      mechanism: "정상 웹서버 침해 또는 악성 광고 삽입 → 방문자 접속 시 익스플로잇 킷이 브라우저·플러그인·문서뷰어의 알려진 취약점을 자동 탐지·공격 → 사용자 상호작용 없이 페이로드 다운로드·실행. 제로데이면 패치도 무력.",
      map: [
        { as: "보기만 해도 감염", real: "무상호작용 자동 설치", note: "클릭 불필요" },
        { as: "미끼 놓인 물웅덩이", real: "워터링홀(표적 사이트 감염)", note: "APT 초기 침투" },
        { as: "악성 배너 광고", real: "멀버타이징", note: "광고망 경유" },
        { as: "취약점 자동 탐침 도구", real: "익스플로잇 킷", note: "" },
      ],
      usage: "정상 뉴스·커뮤니티 사이트를 통한 대량 감염이 실사례입니다. 시험은 '사용자 과실 아님 → 패치·브라우저 샌드박스·백신' 대응과 워터링홀 연결입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "워터링홀은 APT의 초기 침투 수단입니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "'신뢰하는 경로의 감염'이라는 공통 발상입니다." },
      ],
      exam: "드라이브 바이 다운로드는 웹 접속만으로 브라우저 취약점을 자동 악용해 악성코드를 설치하는 공격으로, 패치 관리와 브라우저 격리가 핵심 방어다.",
    }, image: "/concept/book/sc-drive-by-download.png", easy: "드라이브 바이 다운로드는 사용자가 아무것도 클릭·실행하지 않고 웹사이트에 '접속만 해도' 악성코드가 자동으로 내려받아져 실행되는 공격입니다. 지나가다 차에서 총 맞는다는 'drive-by'에서 온 이름이죠. 절차 5단계 — ① 정상 사이트의 배너·게시판에 리다이렉션 코드 삽입(iFrame Injection·XSS) ② 피해자가 그 페이지 방문 ③ 공격자가 미리 만든 페이지로 리다이렉션 ④ 악성코드 유포 사이트(Malware Server)로 이동 ⑤ 드로퍼가 악성코드 다운로드·실행. 핵심 구성은 Landing Site(진입점) → Exploit Server(브라우저 취약점 공격) → Malware Server(악성코드 배포)로 이어지는 리다이렉션 연쇄입니다. 대응은 서버 측(Secure Coding·API 취약점 제거·샌드박스)과 클라이언트 측(브라우저·SW 최신 유지·NoScript·웹 필터링). '실행 안 해도 접속만으로 감염'과 브라우저 취약점 악용이 시험 포인트입니다." },
"sc-supply-chain": {
    guide: {
      hook: "표적을 직접 못 뚫으면, 그가 '믿고 쓰는 것'을 오염시킵니다 — 신뢰의 사슬을 노립니다.",
      scene: "성을 정면 공격하는 대신 성에 납품되는 식자재에 독을 타는 격입니다. 업데이트 서버, 오픈소스 라이브러리, 하드웨어 부품처럼 표적이 검증 없이 신뢰하는 경로에 악성코드를 심습니다.",
      why: "'한 번의 오염으로 다수 감염'이라는 파급력과 '신뢰된 경로라 탐지 어려움'이 핵심입니다. SBOM(구성요소 명세)·코드 서명·공급업체 검증이 방어의 축으로, DevSecOps와 강하게 연결됩니다.",
      mechanism: "유형: 소프트웨어(정상 업데이트에 백도어 — SolarWinds), 오픈소스(악성 패키지·의존성 혼동 공격), 하드웨어(부품 단계 변조), 빌드 시스템(CI/CD 파이프라인 침해). 방어: SBOM으로 구성요소 가시화, 코드 서명·무결성 검증, 공급업체 보안 평가, 최소 의존성.",
      map: [
        { as: "납품 식자재에 독 타기", real: "신뢰 경로 오염", note: "정면 공격 회피" },
        { as: "정품 업데이트에 백도어", real: "소프트웨어 공급망 공격", note: "SolarWinds" },
        { as: "성분표 요구", real: "SBOM(구성요소 명세서)", note: "가시성 확보" },
        { as: "봉인 스티커 확인", real: "코드 서명·무결성 검증", note: "" },
      ],
      usage: "SolarWinds·xz 백도어 사건이 대표 사례입니다. 시험은 유형 분류와 'SBOM·코드 서명·공급업체 검증' 대응, DevSecOps 통합으로 씁니다.",
      links: [
        { topic: "DevSecOps", how: "파이프라인에 공급망 보안 검증을 내재화합니다." },
        { topic: "Secure Software Development Framework(SSDF)", how: "공급망 무결성을 개발 프레임워크로 요구합니다." },
      ],
      exam: "공급망 공격은 표적이 신뢰하는 소프트웨어·오픈소스·하드웨어 경로를 오염시키는 공격으로, SBOM·코드 서명·공급업체 검증으로 대응한다.",
    }, image: "/concept/book/sc-supply-chain.png", easy: "공급망 공격은 최종 표적을 직접 치지 않고, 그 표적이 신뢰하는 소프트웨어 공급사를 뚫는 우회 공격입니다. 정상 SW를 만들어 배포하는 과정(개발자 PC·업데이트 서버)에 침투해 소프트웨어를 변조하면, 그걸 믿고 설치·업데이트하는 수많은 고객이 한꺼번에 감염됩니다. 절차 5단계 — ① 공급사 개발환경 침투 ② 변조된 업데이트 파일 유포 ③ 개인·기업으로 확산 ④ 내부 타 서버로 범위 확대 ⑤ 추가 악성코드 감염. '정상 공급사를 신뢰한다'는 관계 자체를 무기로 쓰는 게 핵심이라(SolarWinds 사건이 대표 사례), 서명된 정식 업데이트로 위장해 탐지가 매우 어렵습니다. 대응은 기술적(별도 인증서 관리·개발 환경 망분리·코드 서명)과 관리적(업데이트 무결성 검증·침해사고 대응·SBOM 소프트웨어 자재명세서). 'SBOM으로 구성요소를 투명하게, 무결성 검증으로 변조를 잡는다'가 시험 포인트입니다." },
"sc-dos": {
    guide: {
      hook: "뚫는 게 아니라 '못 쓰게' 만드는 공격 — 가용성을 직접 겨냥합니다.",
      scene: "가게 입구를 사람들로 가득 메워 진짜 손님이 못 들어오게 하는 것입니다. 서버의 자원(대역폭·연결·CPU)을 고갈시켜 정상 사용자의 서비스를 마비시킵니다. 여러 좀비 PC를 동원하면 분산 공격(DDoS)입니다.",
      why: "기밀성·무결성이 아닌 '가용성' 침해라는 점, 그리고 공격 계층(네트워크 L3/4 vs 응용 L7)에 따라 방어가 다르다는 점이 핵심입니다. DRDoS(반사·증폭)로 이어지는 계보로 출제됩니다.",
      mechanism: "유형: 볼류메트릭(대역폭 고갈 — UDP 홍수), 프로토콜(연결 자원 고갈 — SYN 홍수: 핸드셰이크 반만 열어 백로그 소진), 응용계층(정상처럼 보이는 HTTP 요청 폭주 — Slowloris). 방어: 트래픽 임계·레이트 리밋, SYN 쿠키, CDN·스크러빙 센터로 흡수, 이상 트래픽 필터링.",
      map: [
        { as: "입구를 사람으로 메움", real: "볼류메트릭(대역폭 고갈)", note: "UDP 홍수" },
        { as: "반쯤 열고 안 닫는 손님", real: "SYN 홍수(프로토콜)", note: "SYN 쿠키로 방어" },
        { as: "느리게 계속 말 거는 손님", real: "Slowloris(응용계층)", note: "L7" },
        { as: "떼로 몰려온 좀비", real: "DDoS(분산)", note: "봇넷 동원" },
      ],
      usage: "게임·금융·공공 서비스 마비 사건이 실사례입니다. 시험은 계층별 유형과 방어(SYN 쿠키·레이트 리밋·CDN 스크러빙), DRDoS와의 구분입니다.",
      links: [
        { topic: "DRDoS(Distributed Reflection DoS)", how: "반사·증폭으로 위력을 키운 진화형입니다." },
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "가용성 침해를 견디고 복원하는 상위 개념입니다." },
      ],
      exam: "DoS는 자원 고갈로 가용성을 침해하는 공격으로 볼류메트릭·프로토콜·응용계층으로 나뉘며, 다수 좀비를 쓰면 DDoS가 되고 레이트 리밋·SYN 쿠키·CDN으로 대응한다.",
    }, image: "/concept/book/sc-dos.png", easy: "DoS(서비스 거부)는 시스템·네트워크 자원을 일부러 고갈시켜 정상 사용자가 서비스를 못 쓰게 만드는 공격입니다. 기밀성·무결성이 아니라 '가용성'을 노린다는 게 핵심입니다. 공격 유형은 세 계층 — Flooding 공격(SYN·ICMP·UDP·IP Flooding: 대량 패킷으로 회선·자원 소진, SYN Flooding은 TCP 3-Way Handshake의 미완성 연결을 악용), Connection 공격(HTTP/TCP Connection을 폭증시켜 큐 마비), Application 공격(SIP·CC·HashDoS: 애플리케이션 처리 로직을 노림). 대응 절차는 공격 인지 → 유형 파악 → 유형별 차단 → 사후 조치 4단계이고, 수단은 라우터(Sink Hole·Ingress/Egress 필터링), 보안 장비(방화벽·IDS/IPS·L7 스위치), 네트워크(로드밸런싱·대역폭 제한·SPOF 제거)입니다. DoS는 공격원이 하나, DDoS는 다수 좀비 PC로 분산한다는 차이가 시험 포인트입니다." },
"sc-drdos": {
    guide: {
      hook: "출발지를 피해자로 위조해 '남의 서버가 피해자를 때리게' 만드는 DDoS의 진화형입니다.",
      scene: "피해자 이름으로 수천 곳에 엽서를 보내면, 답장이 전부 피해자에게 쏟아집니다. 공격자는 요청의 출발지 주소를 피해자로 속여 반사 서버(DNS·NTP 등)에 보내고, 그 응답이 피해자에게 증폭돼 몰립니다.",
      why: "반사(공격 근원 은닉)와 증폭(작은 요청→큰 응답)이라는 두 무기가 핵심입니다. UDP 기반 프로토콜의 취약점을 악용하고, 증폭 배수가 방어 난이도를 결정한다는 점이 출제 포인트입니다.",
      mechanism: "출발지 IP를 피해자로 위조(스푸핑) → 개방된 반사기(DNS·NTP·memcached 등)에 소량 질의 → 반사기가 큰 응답을 피해자에게 전송. NTP monlist·memcached는 증폭 배수가 수백~수만 배. 방어: 출발지 검증(BCP38), 개방 리졸버 차단, 반사 트래픽 필터링·스크러빙.",
      map: [
        { as: "피해자 이름으로 엽서 발송", real: "출발지 IP 스푸핑", note: "근원 은닉" },
        { as: "쏟아지는 답장", real: "반사(Reflection)", note: "제3 서버가 공격" },
        { as: "한 통이 열 통으로", real: "증폭(Amplification)", note: "memcached 수만 배" },
        { as: "발신지 진위 검사", real: "BCP38 출발지 검증", note: "근본 방어" },
      ],
      usage: "역대 최대 규모 DDoS가 대부분 DRDoS(memcached 반사)입니다. 시험은 DoS/DDoS와의 차이(반사·증폭)와 방어(개방 리졸버 차단·출발지 검증)입니다.",
      links: [
        { topic: "DoS(Denial of Service)", how: "가용성 침해의 기본형 — 그 반사·증폭 진화판입니다." },
        { topic: "스니핑(Sniffing) & 스푸핑(Spoofing)", how: "출발지 IP 위조가 반사의 전제입니다." },
      ],
      exam: "DRDoS는 출발지를 피해자로 위조해 반사 서버가 증폭된 응답을 피해자에게 보내게 하는 공격으로, 출발지 검증과 개방 리졸버 차단으로 대응한다.",
    }, image: "/concept/book/sc-drdos.png", easy: "DRDoS(분산 반사 DoS)는 좀비 PC를 심을 필요 없이, 정상적으로 운영 중인 서버(DNS·NTP·SNMP·CHARGEN)를 '반사판'으로 악용하는 진화된 DDoS입니다. 원리는 두 가지 — 반사(Reflection)와 증폭(Amplification). 공격자가 출발지 IP를 피해자(Victim) IP로 위조해 정상 서버에 작은 요청을 보내면, 서버는 그 응답을 피해자에게 보냅니다. 게다가 30바이트 요청이 3000바이트 응답으로 돌아오는 식으로 트래픽이 수십~수백 배 증폭됩니다. 증폭 수단 — DNS(ANY·TXT 대량 레코드), NTP(monlist 서버 목록), SNMP(GetBulkRequest로 MIB 대량 조회), CHARGEN(대량 문자열). 근본 방어는 출발지 IP 위조가 전제이므로 ISP의 egress filtering(위조 패킷 인터넷 유입 차단)이고, RAW Socket 같은 공격 API 제한도 병행합니다. '에이전트 없이 정상 서버를 무기로', '위조 IP + 증폭'이 시험 포인트입니다." },
"sc-raas": {
    guide: {
      hook: "랜섬웨어를 '서비스'로 파는 범죄 비즈니스 — 코딩 못 해도 구독하면 공격자가 됩니다.",
      scene: "SaaS처럼, 개발자(운영조직)는 랜섬웨어와 관리 콘솔·협상 채널을 만들어 팔고, 실행자(제휴사)는 이를 빌려 침투만 담당한 뒤 수익을 나눕니다. 공격의 분업화·대중화입니다.",
      why: "랜섬웨어가 개별 악성코드가 아니라 '생태계·비즈니스 모델'이 됐다는 점이 핵심입니다. 이중 갈취(암호화+유출 협박) 전술과 백업·복원 중심 방어(사이버 레질리언스)로 연결됩니다.",
      mechanism: "구조: 운영조직(랜섬웨어·인프라·협상 포털 제공) + 제휴사(초기 침투·배포) → 수익 분배(제휴사 70~80%). 전술 진화: 단순 암호화 → 이중 갈취(데이터 유출 후 공개 협박) → 삼중 갈취(피해 고객·파트너까지 협박)+DDoS. 방어: 오프라인·불변(Immutable) 백업, 최소 권한, EDR, 침해 대응 훈련.",
      map: [
        { as: "구독형 소프트웨어", real: "RaaS 비즈니스 모델", note: "공격의 대중화" },
        { as: "본사와 가맹점", real: "운영조직 + 제휴사", note: "수익 분배" },
        { as: "암호화 + 유출 협박", real: "이중 갈취", note: "백업만으론 불충분" },
        { as: "지워도 살아나게 대비", real: "불변 백업·복원 훈련", note: "레질리언스" },
      ],
      usage: "LockBit·Conti 같은 조직이 실사례입니다. 시험은 RaaS 구조도, 이중·삼중 갈취 진화, 그리고 '백업·복원 중심 방어(레질리언스)' 논지입니다.",
      links: [
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "암호화·유출을 전제로 버티고 복원하는 대응입니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "제휴사의 초기 침투 경로로 자주 결합됩니다." },
      ],
      exam: "RaaS는 랜섬웨어를 서비스로 제공해 운영조직과 제휴사가 분업·수익분배하는 범죄 모델로, 이중 갈취에 대응하려면 불변 백업과 복원 훈련이 필요하다.",
    }, image: "/concept/book/sc-raas.png", easy: "RaaS(서비스형 랜섬웨어)는 다크웹에서 비용만 내면 랜섬웨어 공격을 할 수 있게 '서비스 상품'으로 파는 것입니다. SaaS(서비스형 소프트웨어)처럼 랜섬웨어도 구독 상품이 된 거죠. 구조는 제작자-공격자의 분업 — ① 공격자가 제작자에게 랜섬웨어 구매 의뢰 ② 제작자가 랜섬웨어 Tool 제공 ③ 공격자가 피해자 자료를 암호화하고 복호화 대가로 금전 요구 ④ 피해자가 비트코인 등 지급 ⑤ 수익을 제작자와 공격자가 일정 비율로 배분 ⑥ 제작자가 지속적으로 업데이트·애프터서비스 지원. 가장 위험한 점은 '기술 없는 사람도 돈만 내면 공격자가 될 수 있다'는 진입장벽 붕괴로 위협이 폭증한다는 것입니다. 대응은 백업(망 분리한 백업 서버)·사용자 교육(메일 필터링)·최신 패치·화이트리스트 기반 실행 제어입니다. '분업형 수익 배분 비즈니스 모델'이라는 성격이 시험 포인트입니다." },
"sc-rootkit": {
    guide: {
      hook: "자신의 존재 자체를 시스템에서 지워 버리는 은닉 악성코드 — '보이지 않게' 만드는 기술입니다.",
      scene: "도둑이 침입한 뒤 CCTV 녹화에서 자기 모습만 지우고, 관리인의 명부에서 자기 이름을 빼는 격입니다. 프로세스·파일·네트워크 연결 목록에서 자신을 숨겨 백신·관리자 눈에 안 띄게 합니다.",
      why: "'감염보다 은닉'이 본질이라 계층(사용자/커널/펌웨어)이 깊을수록 탐지·제거가 어렵다는 점이 핵심입니다. 커널·부트·하이퍼바이저 루트킷으로 갈수록 OS 아래로 파고들어 무결성 검증(TPM·시큐어부트)이 방어의 근거가 됩니다.",
      mechanism: "계층별: 사용자 모드(API 후킹으로 목록 조작), 커널 모드(시스템 콜 테이블·SSDT 후킹 — OS가 거짓 보고), 부트킷(MBR/UEFI 감염 — OS보다 먼저 로드), 하이퍼바이저(OS를 가상화해 아래에서 관측). 방어: 시큐어부트·측정부트(TPM), 커널 무결성 모니터링, 오프라인 검사.",
      map: [
        { as: "CCTV에서 자기만 삭제", real: "목록에서 자기 은닉", note: "탐지 회피" },
        { as: "관리자 API를 가로챔", real: "사용자/커널 모드 후킹", note: "거짓 보고" },
        { as: "OS보다 먼저 깨어남", real: "부트킷(UEFI/MBR)", note: "제거 곤란" },
        { as: "무결성 봉인으로 검증", real: "시큐어부트·TPM 측정부트", note: "방어 근거" },
      ],
      usage: "BPF Door 같은 커널 백도어와 결합됩니다. 시험은 계층별 분류(깊을수록 탐지 난이도↑)와 '시큐어부트·TPM·오프라인 검사' 대응입니다.",
      links: [
        { topic: "BPF(Berkeley Packet Filter) Door", how: "커널 수준 은닉이라는 공통 축입니다." },
        { topic: "디지털 면역 시스템(DIS, Digital Immune System)", how: "은닉 위협을 자율 탐지·복원하는 상위 대응입니다." },
      ],
      exam: "루트킷은 프로세스·파일 목록에서 자신을 숨기는 은닉 악성코드로, 사용자·커널·부트·하이퍼바이저 계층이 깊을수록 탐지가 어려워 시큐어부트·TPM으로 방어한다.",
    }, image: "/concept/book/sc-rootkit.png", easy: "루트킷(Rootkit)은 최고 관리자 권한(Root)을 탈취해 시스템을 장악한 뒤, 자기 존재를 숨긴 채(은닉) 해커에게 계속 뒷문을 열어주는 악성 소프트웨어 '모음(Kit)'입니다. 단일 악성코드가 아니라 여러 도구의 묶음이라는 게 이름의 유래죠. 침투 흐름 — 초기 침투(취약점·사회공학) → 권한 상승(User Mode → Kernel Mode) → 은닉·후킹(시스템 콜 테이블 SSDT·IDT 변조로 탐지 회피) → 백도어 설치 → C2(명령·제어)로 원격 조종. 유형은 은닉 계층이 깊을수록 강력합니다 — 사용자 모드 루트킷(API 후킹, 탐지 쉬움) < 부트킷(MBR 감염, OS 재설치해도 생존) < 펌웨어 루트킷(BIOS/UEFI 기생) < 하이퍼바이저 루트킷(OS를 가상머신으로 밀어내고 아래에서 통제). 탐지·대응은 XDR·NTA·SIEM·위협 헌팅과 AI 기반(UEBA·SOAR)으로 커널·부팅 무결성을 검증합니다. '권한 상승 후 은닉'이라는 2단 구조와 계층별 유형이 시험 포인트입니다." },
"sc-owasp-2021": {
    guide: {
      hook: "웹 애플리케이션 취약점의 국제 표준 순위 — 1위가 인젝션에서 접근통제 붕괴로 바뀐 판입니다.",
      scene: "웹 개발자의 '가장 자주 틀리는 실수 10개' 체크리스트입니다. 2021년판은 접근통제(권한 검사 누락)를 1위로 올리고, '안전하지 않은 설계'라는 설계 단계 항목을 새로 넣어 '코딩 후 점검'에서 '설계부터 보안'으로 무게를 옮겼습니다.",
      why: "OWASP는 웹 보안의 기준선이라 순위 변화가 곧 위협 트렌드입니다. 2025판과의 비교(무엇이 오르내렸나)가 출제 핵심이고, 시큐어 코딩·DevSecOps의 근거 목록입니다.",
      mechanism: "2021 Top 10: A01 접근통제 취약점(1위 상승), A02 암호화 실패, A03 인젝션(1→3위 하락), A04 안전하지 않은 설계(신규), A05 보안 설정 오류, A06 취약·구버전 요소, A07 인증·식별 실패, A08 SW·데이터 무결성 실패(신규), A09 로깅·모니터링 실패, A10 SSRF(신규).",
      map: [
        { as: "권한 검사를 빼먹음", real: "A01 접근통제 취약점", note: "새 1위" },
        { as: "설계부터 잘못된 집", real: "A04 안전하지 않은 설계", note: "신규 — Shift Left" },
        { as: "서버를 심부름꾼으로", real: "A10 SSRF", note: "신규 진입" },
        { as: "봉인·서명 누락", real: "A08 무결성 실패", note: "공급망 반영" },
      ],
      usage: "웹 취약점 진단·시큐어 코딩 가이드의 기준입니다. 시험은 2021 항목 나열과 2025판 대비 변화, '설계 단계 보안(안전하지 않은 설계)' 강조입니다.",
      links: [
        { topic: "OWASP Top 10:2025", how: "최신 개정판 — 순위·신규 항목 비교 대상입니다." },
        { topic: "시큐어 코딩(Secure Coding)", how: "이 목록을 코드 수준에서 예방합니다." },
      ],
      exam: "OWASP Top 10:2021은 접근통제 취약점을 1위로 올리고 안전하지 않은 설계·SSRF를 신설해 설계 단계 보안(Shift Left)을 강조한 웹 취약점 표준이다.",
    }, image: "/concept/book/sc-owasp-2021.png", easy: "OWASP Top 10:2021은 웹 애플리케이션에서 빈도와 영향이 큰 10대 보안 취약점을 선정한 가이드입니다(3~4년마다 개정). 2021판 목록 — A01 취약한 접근 통제(5위→1위로 급부상), A02 암호학적 실패, A03 인젝션(SQL·XSS 등, 예전 1위에서 하락), A04 안전하지 않은 설계(신설), A05 보안 설정 오류, A06 취약하고 오래된 컴포넌트, A07 식별·인증 실패, A08 SW·데이터 무결성 실패(신설), A09 보안 로깅·모니터링 실패, A10 SSRF 서버 사이드 요청 위조(신설). 대표 사례인 SQL Injection은 'teacherId=117 or 1=1'처럼 조건을 항상 참으로 만들어 전체 데이터를 빼내는 공격입니다. 2021판의 핵심 변화는 접근 통제가 1위로 올라오고, 설계·무결성·SSRF 3개가 새로 들어온 것 — 2025판과의 비교 출제에 대비해 '무엇이 신설·상승했나'를 기억하는 게 포인트입니다." },
"sc-owasp-2025": {
    guide: {
      hook: "2025 개정 웹 Top 10 — 공급망과 설정 오류의 비중이 커진 최신 순위입니다.",
      scene: "2021판을 4년 만에 다시 매긴 성적표입니다. 접근통제는 여전히 상위, 여기에 '공급망'과 확대된 '보안 설정 오류'가 부상해, 코드 자체보다 '무엇을 가져다 쓰고 어떻게 구성했나'가 더 위험해진 흐름을 반영합니다.",
      why: "최신판이라 실무·시험 모두 최신 트렌드 근거로 쓰입니다. 2021 대비 변화(공급망 강화, 설정 오류 상승)를 짚는 비교가 핵심이고, DevSecOps·공급망 보안과 직결됩니다.",
      mechanism: "2025 주요 흐름: 접근통제 취약점 상위 유지, 보안 설정 오류 순위 상승(클라우드·컨테이너 확산 반영), 취약·구버전 요소가 '소프트웨어 공급망' 관점으로 확장, 인증·암호화 실패 지속, 로깅·모니터링 실패 유지. 방어 축은 여전히 입출력 검증·최소 권한·구성 관리·의존성 관리.",
      map: [
        { as: "여전한 권한 검사 누락", real: "접근통제 취약점", note: "상위 유지" },
        { as: "잘못 열어 둔 설정", real: "보안 설정 오류 상승", note: "클라우드·컨테이너" },
        { as: "가져다 쓴 부품 오염", real: "소프트웨어 공급망", note: "확장 강화" },
        { as: "구버전 그대로 방치", real: "취약·구버전 요소", note: "의존성 관리" },
      ],
      usage: "최신 웹 보안 점검·클라우드 구성 감사의 기준입니다. 시험은 2021→2025 변화표와 '공급망·설정 오류 부상'의 배경(클라우드·오픈소스 확산) 서술입니다.",
      links: [
        { topic: "OWASP Top 10:2021", how: "직전 판 — 순위 변동 비교의 기준입니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "2025판이 강화한 항목의 실체입니다." },
      ],
      exam: "OWASP Top 10:2025는 접근통제 취약점을 상위로 유지하며 보안 설정 오류와 소프트웨어 공급망 비중을 키워 클라우드·오픈소스 시대의 위협을 반영한다.",
    }, image: "/concept/book/sc-owasp-2025.png", easy: "OWASP Top 10:2025는 웹 애플리케이션 10대 취약점의 최신 개정판입니다. 2021판과 비교해 무엇이 바뀌었는지가 핵심 — A01 취약한 접근 제어는 여전히 1위이고 SSRF가 이 항목으로 흡수 통합됐습니다. 가장 큰 변화는 A03에 '소프트웨어 공급망 실패(Software Supply Chain Failures)'가 새로 부상한 것으로, 단순 취약 컴포넌트를 넘어 CI/CD 파이프라인 침해·빌드 인프라 탈취까지 공급망 생태계 전체를 다룹니다. 또 A10에 '예외적 조건의 오처리(Mishandling of Exceptional Conditions)'가 신설되어, 예외 상황에서 서버 마비(DoS)나 상세 오류 정보 노출이 공격 단초가 되는 문제를 다룹니다. 나머지는 암호화 실패·인젝션·안전하지 않은 설계·인증 실패·무결성 실패·로깅 실패로 구성됩니다. '2021 대비 공급망 실패 부상, SSRF 통합, 예외 처리 신설'이라는 3가지 변화가 시험 포인트입니다." },
"sc-secure-coding": {
    guide: {
      hook: "취약점을 '고치는' 게 아니라 '처음부터 안 만드는' 코딩 — 개발 단계의 예방접종입니다.",
      scene: "완공 후 하자 보수(모의해킹)보다 시공 기준(코딩 규칙)을 지키는 게 싸고 확실합니다. 입력값을 항상 의심하고, 권한을 최소로 주고, 오류 메시지에 내부 정보를 안 흘리는 습관을 규칙으로 못 박습니다.",
      why: "'설계·구현 단계 예방(Shift Left)'이 비용 대비 효과가 가장 크다는 SW공학 원리와 맞닿습니다. 행안부 시큐어코딩 가이드의 7대 유형이 암기 대상이고, DevSecOps·SSDF로 확장됩니다.",
      mechanism: "행안부 7유형: 입력데이터 검증·표현(SQLi·XSS 방지), 보안기능(인증·권한·암호), 시간·상태(경쟁 조건·TOCTOU), 에러처리(정보 노출 방지), 코드오류(자원 해제·형변환), 캡슐화(정보 은닉), API오용. 핵심 원리는 신뢰 경계에서의 입력 검증과 최소 권한.",
      map: [
        { as: "재료 검수 규칙", real: "입력데이터 검증·표현", note: "SQLi·XSS 예방" },
        { as: "출입 통제 규정", real: "보안기능(인증·권한)", note: "" },
        { as: "동시 작업 충돌 방지", real: "시간·상태(경쟁 조건)", note: "TOCTOU" },
        { as: "고장 안내에 설계도 안 붙이기", real: "에러처리(정보 노출 방지)", note: "" },
      ],
      usage: "SW 개발보안(전자정부·공공사업 의무)의 기준입니다. 시험은 7유형 분류와 대표 취약점(SQLi=입력검증) 매핑, OWASP Top 10과의 대응입니다.",
      links: [
        { topic: "OWASP Top 10:2025", how: "예방 대상 취약점 목록을 제공합니다." },
        { topic: "DevSecOps", how: "시큐어 코딩을 파이프라인 자동 검사로 내재화합니다." },
      ],
      exam: "시큐어 코딩은 입력 검증·보안기능·에러처리 등 7유형 규칙으로 개발 단계에서 취약점을 예방하는 기법으로, DevSecOps로 자동화·내재화된다.",
    }, image: "/concept/book/sc-secure-coding.png", easy: "시큐어 코딩은 해킹의 원인인 보안취약점을 개발 단계에서 미리 제거해 안전한 소프트웨어를 만드는 개발 기법입니다. 취약점을 다 만든 뒤 잡는 게 아니라 '짤 때부터' 막는다는 발상이죠. 제거해야 할 보안약점은 7대 항목, 두음 [입보시에코캡A]로 외웁니다 — 입력데이터 검증 및 표현(SQL 삽입·XSS·CSRF·파일 업로드, 가장 항목 많음 17개), 보안 기능(취약한 암호화·하드코딩된 비밀번호), 시간 및 상태(경쟁조건 TOCTOU), 에러 처리(오류 메시지로 정보 노출), 코드 오류(Null Pointer 역참조·자원 해제), 캡슐화(잘못된 세션·Private 배열 노출), API 오용(취약한 API 사용). 또 '안전한 암호 알고리즘 및 키 길이'로 최소 112비트, 블록암호 ARIA·SEED, 운영모드 기밀성(ECB~CTR)·인증(CCM·GCM), 해시 SHA-224 이상, MAC(HMAC·CMAC)을 권고합니다. 7대 두음과 '취약한 암호 알고리즘은 솔트·키 스트레칭으로 보완'이 시험 포인트입니다." },
"sc-ssrf": {
    guide: {
      hook: "서버를 꼬드겨 '내부망에 대신 요청하게' 만드는 공격 — 서버를 심부름꾼으로 부립니다.",
      scene: "외부인은 회사 내부망에 못 들어가지만, '이 URL의 이미지를 가져와 줘' 기능을 악용해 서버에게 내부 주소(관리 콘솔·클라우드 메타데이터)를 대신 조회하게 시킵니다. 서버는 내부에 있으니 요청이 통합니다.",
      why: "OWASP 2021에 신규 진입할 만큼 클라우드에서 치명적입니다 — 특히 클라우드 메타데이터(169.254.169.254)로 임시 자격증명을 탈취하는 경로가 핵심 출제 포인트입니다.",
      mechanism: "사용자가 제어하는 URL을 서버가 검증 없이 요청 → 공격자가 내부 IP·localhost·클라우드 메타데이터 엔드포인트를 지정 → 서버가 내부 자원 응답을 반환하거나 부작용 유발. 방어: URL 허용목록(스킴·호스트), 내부 IP 대역 차단, 메타데이터 접근 차단(IMDSv2), 리다이렉트 검증.",
      map: [
        { as: "서버를 심부름 보냄", real: "서버 측 요청 위조", note: "내부망 우회" },
        { as: "회사 안 관리실 조회", real: "내부 자원 접근", note: "localhost·사설IP" },
        { as: "금고 임시열쇠 탈취", real: "클라우드 메타데이터 접근", note: "임시 자격증명" },
        { as: "심부름 목적지 화이트리스트", real: "URL 허용목록·IMDSv2", note: "방어" },
      ],
      usage: "Capital One 유출이 SSRF+메타데이터의 대표 사례입니다. 시험은 클라우드 메타데이터 탈취 경로와 방어(허용목록·IMDSv2·내부대역 차단)입니다.",
      links: [
        { topic: "OWASP Top 10:2021", how: "A10으로 신규 진입한 항목입니다." },
        { topic: "클라우드 컴퓨팅 취약점, 대응기술", how: "메타데이터 서비스 악용이 클라우드 특유 위협입니다." },
      ],
      exam: "SSRF는 서버가 사용자 지정 URL을 검증 없이 요청하게 만들어 내부망·클라우드 메타데이터에 접근하는 공격으로, URL 허용목록과 IMDSv2로 대응한다.",
    }, image: "/concept/book/sc-ssrf.png", easy: "SSRF(서버 사이드 요청 위조)는 공격자가 서버를 '대리인'으로 악용해, 직접 접근할 수 없는 내부 서버 자원에 접근하게 만드는 공격입니다. 방화벽 뒤 내부망(Private Network)은 외부에서 직접 못 들어가지만, 외부에 노출된 웹 서버는 들어갈 수 있죠. 그래서 공격자는 그 웹 서버에게 위조된 URL 요청을 시켜서(예: content=http://10.0.0.1/administrator), 서버가 대신 내부 자원에 접근해 그 결과를 돌려주게 합니다. 절차는 URL 변조 요청 → 백엔드로 요청 전달 → 내부 주요 정보 요청(DB 등) → 결과 응답. 유형은 결과가 보이는 Non-blind SSRF와 결과 없이 유해 작업만 하는 Blind SSRF로 나뉩니다. 대응은 One Time Token·입력값 검증·URL 스키마와 포트 화이트리스트·HTTP 리다이렉션 차단입니다. 헷갈리는 CSRF와의 구분이 핵심 — SSRF는 '서버'가 위조 요청의 주체(내부 노림), CSRF는 '사용자 브라우저'가 주체(사용자 권한 도용)입니다. OWASP 2021 A10 신규였다가 2025판에서 A01로 통합된 것도 포인트입니다." },
"sc-sw-obfuscation": {
    guide: {
      hook: "코드를 일부러 읽기 어렵게 꼬아 역공학·변조를 늦추는 방어 기술입니다.",
      scene: "설계도를 알아볼 수 없게 뒤섞어 경쟁사가 베끼지 못하게 하는 것입니다. 기능은 그대로 두되 변수명을 무의미하게 바꾸고, 제어 흐름을 스파게티로 만들고, 문자열을 암호화해 분석 비용을 폭증시킵니다.",
      why: "'완전 차단이 아니라 지연·비용 증가'가 목적이라는 점이 핵심입니다. DRM·안티탬퍼·모바일 앱 보호의 구성요소이고, 반대로 악성코드도 탐지 회피에 같은 기법을 쓴다는 양면성이 출제 포인트입니다.",
      mechanism: "기법: 레이아웃(식별자 renaming·주석 제거), 데이터(문자열 암호화·상수 분할), 제어 흐름(불투명 서술어·흐름 평탄화·가짜 분기), 가상화(코드를 자체 VM 바이트코드로 변환). 평가 축은 강도(분석 저항)·내성(자동 해제 저항)·은밀성·비용(성능 오버헤드).",
      map: [
        { as: "이름표를 뜯어 뒤섞기", real: "레이아웃 난독화(renaming)", note: "약함·저비용" },
        { as: "글자를 암호로 숨김", real: "데이터 난독화(문자열 암호화)", note: "" },
        { as: "길을 스파게티로", real: "제어 흐름 평탄화·가짜 분기", note: "강함" },
        { as: "자체 언어로 재작성", real: "코드 가상화", note: "최강·고비용" },
      ],
      usage: "모바일 게임·금융 앱의 탬퍼링 방지, DRM에 쓰입니다. 시험은 난독화 기법 4분류와 평가 축(강도·내성·은밀성·비용), 악성코드의 회피 악용 양면성입니다.",
      links: [
        { topic: "DRM(Digital Right Management)", how: "콘텐츠 보호에서 난독화·안티탬퍼로 결합됩니다." },
        { topic: "루트킷(Rootkit)", how: "악성코드도 같은 난독화로 탐지를 회피합니다." },
      ],
      exam: "SW 난독화는 기능을 유지한 채 코드를 읽기 어렵게 변형해 역공학·변조를 지연시키는 기법으로, 레이아웃·데이터·제어흐름·가상화로 나뉜다.",
    }, image: "/concept/book/sc-sw-obfuscation.png", easy: "SW 난독화는 소스 코드나 바이너리를 일부러 알아보기 어렵게 변형해 소프트웨어를 보호하는 기술입니다. 핵심 전제는 '난독화 전 결과 = 난독화 후 결과' — 실행 결과는 똑같고 사람이 읽고 분석하기만 어렵게 만든다는 것입니다. 목적은 리버스 엔지니어링(역공학) 방지, 무단 복제·크랙 방지, 저작권 보호입니다. 분류 5기법 [구데집제예] — 구획 난독화(형식 변환·주석 제거·식별자 손상 같은 세부 요소 변경), 데이터 난독화(변수를 쪼개거나 합쳐 읽기 어렵게), 집합 난독화(자료 순서를 바꿔 난독화), 제어 난독화(문장이 묶이지 않는 단위 조절), 예방 난독화(알려진 역난독화 방법을 미리 봉쇄). 주요 기술로는 심볼 정보 제거(메소드·변수 이름 변경), 코드 암호화(해독키를 HW에 숨김), 제어 흐름 변환, 자료 난독화가 있습니다. '실행 결과는 보존하면서 이해만 막는다'와 5대 기법 두음이 시험 포인트입니다." },
"sc-devsecops": {
    guide: {
      hook: "보안을 개발 '마지막 관문'이 아니라 '파이프라인 전체'에 녹여 넣는 문화입니다.",
      scene: "출고 직전 검수 한 번으로 불량을 잡으려면 늦고 비쌉니다. 대신 조립 라인 각 공정마다 자동 검사기를 달아 두는 것 — DevOps의 CI/CD 파이프라인 곳곳에 보안 자동 점검을 심습니다.",
      why: "'보안을 왼쪽으로(Shift Left)'와 '자동화·전원 책임'이 핵심입니다. SAST/DAST/SCA 도구를 파이프라인 어느 단계에 붙이는지가 출제 포인트이고, 시큐어 코딩·공급망 보안을 실행하는 운영 체계입니다.",
      mechanism: "파이프라인 매핑: 코딩(IDE 보안 린트·시크릿 스캔) → 빌드(SAST 정적분석·SCA 의존성 취약점) → 테스트(DAST 동적분석) → 배포(IaC 스캔·이미지 스캔) → 운영(RASP·모니터링). 문화 원칙: 보안을 전원의 책임으로, 자동화로 마찰 최소화, 빠른 피드백.",
      map: [
        { as: "라인마다 검사기", real: "파이프라인 단계별 자동 보안", note: "Shift Left" },
        { as: "설계도 정적 검토", real: "SAST(정적 분석)", note: "빌드 단계" },
        { as: "완성품 실사용 테스트", real: "DAST(동적 분석)", note: "테스트 단계" },
        { as: "부품 성분표 대조", real: "SCA(구성요소 분석)", note: "공급망 취약점" },
      ],
      usage: "CI/CD를 쓰는 모든 현대 개발 조직의 보안 표준입니다. 시험은 SAST/DAST/SCA/IAST 구분과 파이프라인 단계 매핑, '보안=전원 책임' 문화 서술입니다.",
      links: [
        { topic: "시큐어 코딩(Secure Coding)", how: "코드 규칙을 파이프라인에서 자동 검증합니다." },
        { topic: "Secure Software Development Framework(SSDF)", how: "NIST의 개발보안 프레임워크로 제도화됩니다." },
      ],
      exam: "DevSecOps는 CI/CD 파이프라인 각 단계에 SAST·DAST·SCA 등 보안 자동화를 내재화하는 문화로, 보안을 왼쪽으로 당겨 전원의 책임으로 만든다.",
    }, image: "/concept/book/sc-devsecops.png", easy: "DevSecOps는 개발(Dev)과 운영(Ops)의 협업 주기인 DevOps에 보안(Sec)을 통합한 개발 방법론입니다. 핵심은 '보안을 개발 맨 마지막에 검사하지 말고, 처음부터 전 주기에 녹여라'(Shift-Left, 보안 좌측 이동)입니다. 작동 방식 — DevOps(개발·운영 팀 통합)에 CI/CD(자동화된 구축·테스트)를 더하고, 그 CI/CD 파이프라인 전반에 보안 평가를 통합합니다. 개발팀은 코드 구현 전 보안팀과 협업하고, 운영팀은 배포 후 보안 문제를 모니터링합니다. 구현 성공 요소 5가지 — 문화(보안 조직 조기 참여), 프로세스(초기 보안 분석·테스트), 자동화(Security as Code), 도구(보안 점검 도구), 성과 평가(보안코드 품질 점수). 개념도는 Dev(Create·Plan·Verify)와 Ops(Prevent·Detect·Respond)가 Sec을 사이에 두고 무한 루프(∞)로 도는 Continuous Delivery입니다. '보안을 코드처럼 관리(Security as Code)', '전 주기 통합'이 시험 포인트입니다." },
"sc-pbd": {
    guide: {
      hook: "개인정보 보호를 '사고 난 뒤'가 아니라 '설계 단계부터' 넣자 — 7원칙의 예방 철학입니다.",
      scene: "안전벨트를 사고 후 다는 게 아니라 차 설계 때부터 넣듯, 서비스를 기획할 때부터 개인정보 보호를 기본값으로 심습니다. 사용자가 설정을 안 만져도 가장 안전한 상태가 기본이어야 합니다.",
      why: "GDPR의 'Data Protection by Design and Default'로 법제화된 국제 원칙입니다. 7원칙 암기와 '사후 대응 → 사전 예방', '기본값이 곧 보호'라는 발상이 출제 핵심입니다.",
      mechanism: "7원칙: ①사전 예방(사후 아님) ②기본값으로서의 프라이버시 ③설계에 내재화 ④완전한 기능성(보안↔프라이버시 제로섬 거부) ⑤전 생애주기 보호(수집~파기) ⑥가시성·투명성 ⑦이용자 프라이버시 존중. 실행은 최소 수집·목적 제한·가명처리·접근통제로 구현됩니다.",
      map: [
        { as: "사고 전 안전벨트 설계", real: "사전 예방·설계 내재화", note: "①③" },
        { as: "안 만져도 가장 안전", real: "기본값으로서의 프라이버시", note: "②" },
        { as: "보안과 편의 둘 다", real: "완전한 기능성(제로섬 거부)", note: "④" },
        { as: "수집부터 파기까지", real: "전 생애주기 보호", note: "⑤" },
      ],
      usage: "GDPR·개인정보보호법의 설계 원칙이자 PbD 인증제도의 기준입니다. 시험은 7원칙 나열과 'by Design/by Default' 구분, PIA·가명처리와의 연결입니다.",
      links: [
        { topic: "PbD(Privacy by Design) 인증제도", how: "7원칙 준수를 제3자가 인증하는 제도입니다." },
        { topic: "개인정보 영향평가(Privacy Impact Assessment)", how: "설계 단계 프라이버시 위험을 사전 평가합니다." },
      ],
      exam: "PbD는 개인정보 보호를 설계 단계부터 기본값으로 내재화하는 7원칙으로, 사후 대응이 아닌 사전 예방과 전 생애주기 보호를 지향한다.",
    }, image: "/concept/book/sc-pbd.png", easy: "개인정보보호 중심 설계(PbD, Privacy by Design)는 프라이버시 침해가 일어난 뒤 수습하는 게 아니라, 서비스 기획·설계 단계에서 미리 예방하도록 하는 설계 원칙입니다. 7대 기본 원칙을 3영역으로 묶으면 — Design 영역(① 사후조치가 아닌 사전예방 ② 초기설정부터 프라이버시 보호(기본값) ③ 설계에 프라이버시 내재화), Coverage 영역(④ 프라이버시와 사업 기능의 균형 — 제로섬이 아닌 포지티브섬 ⑤ 개인정보 생애주기 전체 보호), Usability 영역(⑥ 처리과정의 가시성·투명성 ⑦ 이용자 프라이버시 존중). 적용 절차는 파악(데이터 현황) → 분석(식별자·속성 유형) → 결정(수집근거·활용방식) → 예방(처리 흐름도·위험성 분석)입니다. '사후가 아닌 사전, 옵션이 아닌 기본값, 나중이 아닌 설계 단계'라는 발상이 핵심이고, 표준 근거가 ISO 31700이라는 점이 시험 포인트입니다." },
"sc-pbd-cert": {
    guide: {
      hook: "'우리 서비스는 설계부터 개인정보를 지킵니다'를 제3자가 보증하는 인증제도입니다.",
      scene: "PbD 7원칙을 말로만 지킨다고 하면 못 믿으니, 독립 기관이 설계·구현을 심사해 도장을 찍어 주는 것입니다. 소비자에게는 신뢰 표시, 기업에게는 차별화 근거가 됩니다.",
      why: "PbD가 '원칙'이라면 이건 '준수를 증명하는 제도'라는 역할 구분이 핵심입니다. ISMS-P·PIA와 함께 개인정보 보호 거버넌스의 인증 축으로 출제됩니다.",
      mechanism: "절차: 신청 → 서면·현장 심사(설계 문서·구현·운영이 7원칙을 충족하는지) → 인증위원회 심의 → 인증서 발급 → 사후관리(유효기간·갱신). 평가는 설계 단계 반영 여부, 기본값 보호, 생애주기 관리 등 PbD 원칙의 실증에 초점.",
      map: [
        { as: "말이 아닌 도장", real: "제3자 인증", note: "신뢰 표시" },
        { as: "설계도 심사", real: "PbD 7원칙 충족 심사", note: "" },
        { as: "정기 재검", real: "사후관리·갱신", note: "유효기간" },
      ],
      usage: "개인정보 보호 수준을 대외 증명하려는 서비스가 취득합니다. 시험은 'PbD(원칙) vs 인증제도(증명)' 구분과 ISMS-P와의 관계입니다.",
      links: [
        { topic: "개인정보보호 중심 설계(Privacy by Design)", how: "인증이 검증하는 대상 원칙입니다." },
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "관리체계 인증과 함께 보호 거버넌스를 이룹니다." },
      ],
      exam: "PbD 인증제도는 서비스가 개인정보보호 중심 설계 7원칙을 충족하는지 제3자가 심사·인증하는 제도로, ISMS-P·PIA와 함께 보호 거버넌스를 구성한다.",
    }, image: "/concept/book/sc-pbd-cert.png", easy: "PbD 인증제도는 일상에서 쓰는 기기(IoT 등)를 중심으로 개인정보가 안전하게 보호되도록 설계됐는지(Privacy by Design) 검증하는 인증제도입니다. PbD가 '설계 원칙'이라면, 이건 그 원칙이 실제 제품에 구현됐는지 심사하는 '인증'입니다. 인증기준 4영역(71영역) — Ⅰ. 기본적인 요구사항(개인정보 식별·처리 흐름), Ⅱ. 개인정보 처리의 적법성(동의·수집 제한·파기·열람권), Ⅲ. 정보보안 및 프라이버시 강화(인증·암호 알고리즘·정보 노출 방지), Ⅳ. 조직적 보호조치(처리방침·책임자·사고 대응). 함께 나오는 PbD 8대 전략은 데이터 지향(최소화·숨기기·분리·총계화)과 프로세스 중심(정보제공·통제·집행·입증)으로 나뉩니다. 4대 인증영역과 8대 전략의 두 축, 그리고 표준 근거 ISO 31700이 시험 포인트입니다." },
"sc-pseudonymization": {
    guide: {
      hook: "이름을 지우는 게 아니라 '추가 정보 없이는 못 알아보게' 바꾸는 것 — 익명화와 다릅니다.",
      scene: "환자 명단에서 '홍길동'을 'P-0421'로 바꾸고, 원래 이름과의 매핑표는 따로 금고에 잠급니다. 매핑표 없이는 누군지 모르지만(가명), 필요하면 매핑표로 복원할 수 있습니다 — 이 '복원 가능성'이 익명화와의 결정적 차이입니다.",
      why: "가명정보는 '추가 정보의 분리 보관'을 조건으로 동의 없이 통계·연구·산업 목적에 쓸 수 있다는 법적 지위가 핵심입니다. 익명화(복원 불가·개인정보 아님)와의 구분이 최다 출제 포인트입니다.",
      mechanism: "기법: 가명(식별자 대체), 총계처리(평균·합), 삭제(부분·행), 범주화(구간화), 마스킹(부분 은닉). 안전성 관리: 추가 정보(매핑표)를 물리·논리적으로 분리 보관, 접근 통제, 재식별 금지·시도 시 처벌. 결합은 지정된 결합전문기관을 통해서만.",
      map: [
        { as: "이름표를 코드로 교체", real: "가명(식별자 대체)", note: "복원 가능" },
        { as: "매핑표를 금고에 격리", real: "추가 정보 분리 보관", note: "안전성 핵심" },
        { as: "구간으로 뭉뚱그리기", real: "범주화·총계처리", note: "" },
        { as: "복원 열쇠 자체를 폐기", real: "익명화(대비 개념)", note: "개인정보 아님" },
      ],
      usage: "가명정보 결합을 통한 의료·금융 빅데이터 연구가 적용처입니다. 시험은 가명 vs 익명 비교표, 5대 기법, 추가정보 분리보관 요건입니다.",
      links: [
        { topic: "가명정보 처리 가이드라인", how: "가명처리 절차·안전조치의 구체 기준입니다." },
        { topic: "ISO/IEC 20889", how: "비식별화 기법의 국제 표준 분류입니다." },
      ],
      exam: "가명처리는 추가 정보 없이는 특정 개인을 알아볼 수 없게 하는 기법으로, 추가 정보를 분리 보관하면 동의 없이 통계·연구에 활용 가능하며 복원 불가한 익명화와 구분된다.",
    }, image: "/concept/book/sc-pseudonymization.png", easy: "가명처리는 개인정보의 일부를 삭제하거나 대체해서, '추가 정보 없이는' 특정 개인을 알아볼 수 없게 만드는 기술입니다(개인정보보호법 제2조). 완전히 지우는 익명처리와 달리, 추가 정보를 따로 잘 보관하면 다시 결합해 활용할 수 있다는 게 핵심 — 그래서 통계작성·과학연구·공익적 기록보존에 동의 없이 쓸 수 있습니다. 처리 대상은 4종 — 직접식별자(주민번호처럼 그 자체로 식별), 간접식별자(준식별자, 결합하면 식별), 속성정보(처리자만 보유), 특이정보(민감정보). 참고로 개인식별정보(PII) = 직접 식별자 + 간접 식별자입니다. 기법은 삭제(마스킹)·통계(총계처리)·일반화(라운딩·범주화)·암호화(양방향·순서보존·동형)·무작위화(잡음·치환·토큰화)·기타(재현데이터·차분 프라이버시)로 나뉩니다. '추가 정보 분리 보관이 전제', '익명처리와의 차이(복원 가능성)'가 시험 포인트이고 표준은 ISO/IEC 20889입니다." },
"sc-pseudonym-guideline": {
    guide: {
      hook: "가명정보를 '어떻게 만들고, 결합하고, 지킬지'를 단계별로 정한 실무 지침입니다.",
      scene: "가명처리라는 개념을 현장에서 그대로 따라 할 수 있게 만든 매뉴얼입니다. 목적을 정하고 → 위험을 따져 처리 수준을 정하고 → 가명처리하고 → 안전하게 관리하고 → 활용·파기하는 절차를 규정합니다.",
      why: "개념(가명처리)과 제도(가이드라인)의 관계로, 결합전문기관을 통한 결합 절차와 적정성 검토가 출제 포인트입니다. 개인정보보호법 개정(데이터 3법)의 실행 문서입니다.",
      mechanism: "5단계: ①사전 준비(대상·목적 선정, 위험성 검토) ②가명처리(식별자·준식별자 처리 수준 결정) ③적정성 검토(재식별 가능성 평가, 3인 이상 검토) ④안전한 관리(추가정보 분리, 접근통제, 재식별 금지) ⑤활용·제공·파기. 결합은 지정 결합전문기관에서 가명·익명 상태로 반출.",
      map: [
        { as: "목적·위험 먼저 정리", real: "사전 준비", note: "①" },
        { as: "지울지 뭉갤지 결정", real: "처리 수준 결정", note: "②" },
        { as: "정말 못 알아보나 검증", real: "적정성 검토(재식별 평가)", note: "③" },
        { as: "결합은 지정 기관만", real: "결합전문기관 경유", note: "④⑤" },
      ],
      usage: "기업·기관의 가명정보 활용 실무 표준입니다. 시험은 5단계 절차, 적정성 검토(3인 이상)·결합전문기관 요건입니다.",
      links: [
        { topic: "가명처리(Pseudonymization) 기법", how: "이 가이드라인이 절차화하는 개념입니다." },
        { topic: "개인정보 영향평가(Privacy Impact Assessment)", how: "가명처리 위험 평가와 연계됩니다." },
      ],
      exam: "가명정보 처리 가이드라인은 사전 준비·가명처리·적정성 검토·안전한 관리·활용의 5단계 절차와 결합전문기관 경유 요건을 규정한 실무 지침이다.",
    }, image: "/concept/book/sc-pseudonym-guideline.png", easy: "가명정보 처리 가이드라인은 기업·개인이 안전하게 가명처리하도록 개인정보보호위원회가 발표한 공식 지침입니다. 가명처리 '기법'이 방법론이라면, 이건 '어떤 절차와 보호조치로 실제 처리하나'를 규정한 실무 지침입니다. 처리 절차 5단계 — ① 사전준비(목록 설정) → ② 위험성 검토 → ③ 가명처리 → ④ 적정성 검토 → ⑤ 안전한 관리(각 단계에 재점검·재검토 순환). 안전한 관리를 위한 보호조치는 3종 — 관리적(내부 관리계획 수립·수탁자 감독), 기술적(추가정보 분리 보관·접근권한 분리·처리 기록 보관), 물리적(출입 통제·보조저장매체 반출입 통제). 여러 기관의 가명정보를 합칠 때는 별도의 결합·반출 절차(결합신청 → 결합·추가처리 → 반출·활용 → 안전한 관리)를 거칩니다. 법적 근거는 가명정보 처리(제28조의2)·결합 제한(제28조의3)이고, '추가정보를 반드시 분리 보관'이 기술적 보호조치의 핵심 포인트입니다." },
"sc-ssdf": {
    guide: {
      hook: "NIST가 정리한 '안전한 소프트웨어를 만드는 4묶음 실천법' — SP 800-218입니다.",
      scene: "시큐어 코딩·DevSecOps가 현장의 습관이라면, SSDF는 그 습관을 조직 차원의 표준 실천 항목으로 목록화한 것입니다. 준비 → 보호 → 생산 → 대응의 네 단계로 '무엇을 갖춰야 하나'를 정의합니다.",
      why: "미국 행정명령(EO 14028) 이후 공급망 보안의 근거 프레임워크로 부상했습니다. 4개 그룹(PO·PS·PW·RV)의 뼈대와 공급망(SBOM·서명)과의 연결이 출제 포인트입니다.",
      mechanism: "4그룹: PO(Prepare the Organization — 보안 요구·역할·도구 준비), PS(Protect the Software — 무단 접근·변조로부터 코드·산출물 보호, 무결성 서명), PW(Produce Well-Secured Software — 설계·리뷰·시큐어 코딩·테스트로 취약점 최소화), RV(Respond to Vulnerabilities — 취약점 식별·수정·공개·근본원인 분석).",
      map: [
        { as: "공사 전 안전 교육·장비", real: "PO 조직 준비", note: "역할·도구" },
        { as: "자재 도난·변조 방지", real: "PS 소프트웨어 보호", note: "무결성 서명" },
        { as: "튼튼하게 시공", real: "PW 안전한 소프트웨어 생산", note: "설계·리뷰·테스트" },
        { as: "하자 접수·보수 체계", real: "RV 취약점 대응", note: "식별·수정·공개" },
      ],
      usage: "미 연방 조달 소프트웨어의 보안 준수 요건입니다. 시험은 PO/PS/PW/RV 4그룹 서술과 DevSecOps·공급망(SBOM)과의 관계입니다.",
      links: [
        { topic: "DevSecOps", how: "SSDF 실천을 파이프라인으로 자동화합니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "PS·RV가 공급망 무결성을 요구합니다." },
      ],
      exam: "SSDF(NIST SP 800-218)는 준비(PO)·보호(PS)·생산(PW)·대응(RV) 4그룹으로 안전한 SW 개발 실천을 정의한 프레임워크로, 공급망 보안의 근거가 된다.",
    }, image: "/concept/book/sc-ssdf.png", easy: "SSDF(보안 소프트웨어 개발 프레임워크)는 소프트웨어 개발 생명주기(SDLC)의 모든 단계에 보안 관행을 통합하도록 체계적 접근을 제시하는 NIST 프레임워크(SP 800-218)입니다. DevSecOps·시큐어 코딩이 '어떻게'라면, SSDF는 그것들을 SDLC 전 단계에 매핑하는 '상위 뼈대'입니다. 구성 4단계 — ① 조직 준비(PO, Prepare the Organization): 보안 요구사항 정의·역할 구분·안전한 개발 환경 마련 ② SW 보호(PS, Protect the Software): 코드를 무단 액세스·변조로부터 보호하고 릴리스 무결성 검증 ③ 보안이 잘된 SW 제작(PW, Produce Well Secured Software): 보안 요구사항 충족 설계·보안 코딩 준수·코드 검토 ④ 취약점 대응(RV, Respond to Vulnerabilities): 지속적 취약점 검색·평가·근본 원인 분석. 두음은 PO → PS → PW → RV로, '조직부터 준비하고, 코드를 보호하고, 잘 만들고, 취약점에 대응한다'는 흐름입니다. SDLC 전 단계 보안 내재화라는 큰 그림과 4단계 구성이 시험 포인트입니다." },
"sc-dns-sinkhole": {
    guide: {
      hook: "악성 도메인 질의를 '가짜 안전지대'로 유도해 감염 PC와 공격자 서버의 연결을 끊습니다.",
      scene: "좀비 PC가 공격자 지휘 서버(C2)의 주소를 물어보면, DNS가 진짜 주소 대신 '싱크홀' 서버(경찰이 관리)의 주소를 돌려줍니다. 좀비는 경찰서로 전화를 걸게 되고, 명령을 못 받아 무력화되며 동시에 감염 현황이 파악됩니다.",
      why: "악성코드 자체를 지우는 게 아니라 'C2 통신을 차단'하는 대응이라는 발상이 핵심입니다. 봇넷 무력화·감염 IP 식별의 실전 기법으로, DNS를 방어 지렛대로 쓰는 대표 사례입니다.",
      mechanism: "알려진 악성 도메인 목록을 DNS 리졸버에 등록 → 해당 도메인 질의가 오면 정상 IP 대신 싱크홀 IP로 응답 → 감염 단말은 C2 대신 싱크홀로 접속 → C2 명령 차단 + 접속 로그로 감염 단말·규모 식별. 봇넷 테이크다운·침해 대응에 활용.",
      map: [
        { as: "가짜 주소로 안내", real: "악성 도메인 → 싱크홀 IP 응답", note: "C2 차단" },
        { as: "경찰서로 걸려온 전화", real: "감염 단말 접속 수집", note: "현황 파악" },
        { as: "지휘 끊긴 좀비", real: "봇넷 무력화", note: "" },
      ],
      usage: "KISA·통신사의 악성코드 감염 PC 치료 안내가 싱크홀 로그 기반입니다. 시험은 'C2 차단·감염 식별' 목적과 DNSSEC·DNS 보안과의 구분입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "C2 통신 차단으로 APT를 무력화합니다." },
        { topic: "DNSSEC(Domain Name System Security Extension)", how: "같은 DNS 계층이지만 목적(응답 무결성)이 다릅니다." },
      ],
      exam: "DNS 싱크홀은 악성 도메인 질의를 통제된 싱크홀 IP로 응답해 C2 통신을 차단하고 감염 단말을 식별하는 봇넷 대응 기법이다.",
    }, image: "/concept/book/sc-dns-sinkhole.png", easy: "DNS 싱크홀은 악성봇에 감염된 좀비 PC가 해커의 명령서버(C&C)에 접속하려 할 때, DNS 단계에서 C&C 대신 '싱크홀 서버'로 우회시켜 명령을 못 받게 막는 시스템입니다. 원리가 영리한데 — 감염 PC도 C&C에 접속하려면 먼저 도메인의 IP를 DNS에 물어봐야 합니다. 이때 ISP DNS 서버가 진짜 C&C IP 대신 KISA 싱크홀 서버 IP를 응답으로 주면, 감염 PC는 해커가 아니라 싱크홀에 접속하게 되어 악의적 명령을 받지 못합니다. 덤으로 어떤 PC가 감염됐는지 현황도 파악할 수 있죠. 블랙홀 라우팅(트래픽을 버림)과 비슷하지만, DNS 응답 자체를 조작해 우회시킨다는 점이 특징입니다. 국내는 KISA가 싱크홀 서버를 운영합니다. '감염 PC를 치료하는 게 아니라 명령 통로(C&C)를 끊는다'는 발상이 시험 포인트입니다." },
"sc-dnssec": {
    guide: {
      hook: "DNS 응답에 전자서명을 붙여 '이 주소가 위조되지 않았음'을 증명합니다.",
      scene: "전화번호부(DNS)는 원래 서명이 없어서, 중간에서 '이 은행 주소는 여기야'라고 가짜를 끼워 넣어도(DNS 스푸핑) 알 수 없었습니다. DNSSEC은 각 응답에 공개키 서명을 붙여, 위조된 응답을 검증 단계에서 걸러냅니다.",
      why: "DNS 스푸핑·캐시 포이즈닝을 근본 차단하는 무결성·출처 인증 장치라는 점이 핵심입니다. 다만 '기밀성은 제공하지 않는다'(내용 암호화 아님)는 한계와 신뢰 사슬(DNS 계층 서명) 구조가 출제 포인트입니다.",
      mechanism: "각 존이 키 쌍(ZSK·KSK)으로 레코드에 서명(RRSIG) → 상위 존이 하위 존의 키 해시(DS)를 서명해 신뢰 사슬 형성(루트→TLD→도메인) → 리졸버가 루트 신뢰 앵커부터 서명을 검증. 위조 응답은 서명 불일치로 거부. 무결성·출처 인증 제공, 기밀성은 미제공.",
      map: [
        { as: "응답마다 서명 날인", real: "RRSIG(레코드 서명)", note: "무결성" },
        { as: "상위가 하위 신원 보증", real: "DS 레코드·신뢰 사슬", note: "루트→도메인" },
        { as: "서명 안 맞으면 거부", real: "리졸버 검증", note: "스푸핑 차단" },
        { as: "내용은 여전히 평문", real: "기밀성 미제공", note: "한계 — DoH/DoT 별도" },
      ],
      usage: "정부·금융 도메인의 위·변조 방지에 적용됩니다. 시험은 DNS 스푸핑 방어 원리, 신뢰 사슬, '무결성 O·기밀성 X' 한계와 DoH/DoT와의 차이입니다.",
      links: [
        { topic: "스니핑(Sniffing) & 스푸핑(Spoofing)", how: "DNS 스푸핑을 서명으로 차단하는 대응입니다." },
        { topic: "DNS 싱크홀(Sinkhole)", how: "같은 DNS 계층이나 목적(C2 차단)이 다릅니다." },
      ],
      exam: "DNSSEC은 DNS 응답에 전자서명과 신뢰 사슬을 더해 위·변조를 검증하는 확장으로, 무결성·출처 인증을 제공하나 기밀성은 제공하지 않는다.",
    }, image: "/concept/book/sc-dnssec.png", easy: "DNSSEC는 DNS 응답에 공개키 전자서명을 붙여 '이 DNS 데이터가 위조되지 않았음'을 검증하게 하는 인터넷 보안 표준입니다. 기존 DNS는 응답에 인증이 없어서, 공격자가 가짜 응답을 끼워넣으면(DNS 캐시 포이즈닝) 사용자가 진짜 은행 사이트인 줄 알고 가짜 사이트로 끌려갑니다(파밍). DNSSEC는 이걸 막습니다 — DNS 존 관리자가 개인키로 레코드에 서명(Signing)해 서명 데이터(RRSIG)를 붙이고, 사용자는 공개키(DNSKEY)로 그 서명을 검증(같은 해시인지 확인)합니다. 위조된 응답은 서명 검증에 실패하니 걸러지죠. 리소스 레코드는 세 가지 — DNSKEY(존의 공개키), 일반 레코드/NSEC/DS(원본 데이터), RRSIG(서명 데이터). '기밀성이 아니라 무결성·인증을 보장한다(내용을 숨기는 게 아니라 위조를 막는다)'와 파밍·캐시 포이즈닝 방어가 시험 포인트입니다." },
"sc-ipsec": {
    guide: {
      hook: "IP 계층에서 통째로 암호화·인증하는 VPN의 뼈대 프로토콜입니다.",
      scene: "TLS가 특정 앱(브라우저)만 보호한다면, IPSec은 우편물의 봉투 자체를 암호화해 그 위를 지나는 모든 편지를 한꺼번에 보호합니다. 네트워크 계층에서 동작해 응용을 안 가립니다.",
      why: "두 모드(전송/터널)와 두 프로토콜(AH/ESP)의 조합이 핵심입니다 — 특히 '무결성만이냐(AH), 기밀성까지냐(ESP)', '끝점 간이냐(전송), 게이트웨이 간이냐(터널)'의 구분이 출제 단골입니다.",
      mechanism: "프로토콜: AH(인증·무결성만, 암호화 없음), ESP(암호화+인증). 모드: 전송(페이로드만 보호, 호스트 간), 터널(IP 헤더까지 새로 감쌈, 게이트웨이 간 — 사이트 간 VPN). 키 교환·SA 협상은 IKE(디피-헬만 기반). SA(보안 연관)가 방향별 파라미터를 정의.",
      map: [
        { as: "봉투 전체 암호화", real: "ESP(기밀성+무결성)", note: "" },
        { as: "봉투 진위만 도장", real: "AH(무결성만)", note: "암호화 없음" },
        { as: "편지 내용만 보호", real: "전송 모드", note: "호스트 간" },
        { as: "봉투째 새 봉투에", real: "터널 모드", note: "사이트 간 VPN" },
      ],
      usage: "본사-지사 사이트 간 VPN의 표준입니다. 시험은 AH/ESP·전송/터널 4조합 매핑과 IKE 키 교환, TLS VPN과의 계층 차이입니다.",
      links: [
        { topic: "VPN(Virtual Private Network)", how: "IPSec은 VPN을 구현하는 핵심 프로토콜입니다." },
        { topic: "TLS/SSL(Secure Socket Layer)", how: "응용 계층 보안과 대비되는 네트워크 계층 보안입니다." },
      ],
      exam: "IPSec은 네트워크 계층에서 AH(무결성)·ESP(기밀성)와 전송·터널 모드로 통신을 보호하는 프로토콜로, IKE로 키를 교환하며 사이트 간 VPN의 기반이 된다.",
    }, image: "/concept/book/sc-ipsec.png", easy: "IPSec은 IP 계층(네트워크 계층)에서 동작하는 보안 프로토콜 모음으로, 원래 보안이 없던 IP에 인증·암호화를 더합니다. 두 개의 핵심 프로토콜 — AH(인증 헤더: 무결성·인증·재전송 공격 방지, 암호화는 안 함)와 ESP(암호화까지 제공, 기밀성). 키 관리는 IKE가, 보안 정책은 SPD(정책 DB)·SAD(연계 DB)가 담당하고, 교환 전 합의해야 할 알고리즘·키 정보를 SA(Security Association)라 부릅니다. 가장 중요한 시험 포인트는 두 가지 모드 구분 — 전송 모드(Transport)는 IP 페이로드만 보호하고 원본 IP 헤더는 그대로 써서 종단 장치(PC↔PC)끼리 직접 처리, 터널 모드(Tunnel)는 원본 IP 패킷 전체를 보호하고 새 IP 헤더를 덧붙여 게이트웨이(본사 방화벽↔지사 방화벽)끼리 통신합니다. 그래서 VPN은 주로 ESP 터널 모드로 구성됩니다. 'AH=인증만, ESP=암호화까지'와 '전송=종단 간, 터널=게이트웨이 간'이 핵심입니다." },
"sc-tls-ssl": {
    guide: {
      hook: "브라우저 자물쇠 아이콘의 정체 — 응용 계층 바로 아래에서 통신을 암호화·인증합니다.",
      scene: "편지를 보내기 전에 상대가 진짜인지 신분증(인증서)으로 확인하고, 둘만 아는 임시 열쇠를 안전하게 나눠 가진 뒤, 그 열쇠로 대화를 잠급니다. 이 준비 과정이 핸드셰이크입니다.",
      why: "핸드셰이크에서 '인증(인증서)+키 교환(비대칭)+본문 암호(대칭)'가 한 번에 일어나는 하이브리드 구조가 핵심입니다. TLS 1.3의 개선(핸드셰이크 단축·PFS 기본·취약 알고리즘 제거)이 최신 출제 포인트입니다.",
      mechanism: "핸드셰이크: ClientHello(지원 암호군) → 서버 인증서 제시 → 클라이언트가 인증서 체인 검증 → (EC)DHE로 세션키 합의(PFS) → 이후 대칭키(AES-GCM)로 본문 암호화. TLS 1.3은 왕복 횟수를 1-RTT로 줄이고 정적 RSA 키 교환·구식 암호를 제거해 안전성·속도를 개선.",
      map: [
        { as: "신분증 확인", real: "인증서 검증(X.509)", note: "서버 인증" },
        { as: "임시 열쇠 몰래 합의", real: "ECDHE 키 교환", note: "PFS" },
        { as: "그 열쇠로 대화 잠금", real: "대칭키(AES-GCM) 본문 암호", note: "" },
        { as: "인사 절차 간소화", real: "TLS 1.3 1-RTT", note: "속도·보안 개선" },
      ],
      usage: "HTTPS·이메일·API 전 구간의 표준입니다. 시험은 핸드셰이크 단계 그림, 1.2 vs 1.3 차이, PFS·인증서 검증 서술입니다.",
      links: [
        { topic: "디피-헬만 알고리즘(Diffie-Hellman Algorithm)", how: "ECDHE 키 교환이 핸드셰이크의 핵심입니다." },
        { topic: "암호화(Encryption)", how: "하이브리드 암호의 대표 실전 구현입니다." },
      ],
      exam: "TLS/SSL은 인증서 검증·ECDHE 키 교환·대칭키 본문 암호를 결합한 하이브리드 보안 프로토콜로, TLS 1.3은 핸드셰이크를 단축하고 PFS를 기본화했다.",
    }, image: "/concept/book/sc-tls-ssl.png", easy: "TLS/SSL은 응용 계층(HTTP 등)과 TCP 계층 사이에서 동작하며 데이터를 암호화하는 프로토콜입니다. HTTPS의 S가 바로 이것이죠. 구성은 상위의 Handshake(상호 인증·암호 방식·키 협상)·Change Cipher Spec(협상된 방식 적용 알림)·Alert(종료·오류 알림)와, 하위의 Record Protocol(실제 데이터를 단편화·압축·MAC·암호화)로 나뉩니다. 핵심 동작인 Handshake 흐름 — ① Client Hello/Server Hello로 커넥션 시작 ② 서버가 인증서(공개키) 전송 ③ 클라이언트가 대칭키(세션키)를 서버의 공개키로 암호화해 전송 ④ 이후 실제 데이터는 그 대칭키로 암호화. 즉 '비대칭키로 대칭키를 안전하게 나눠 갖고, 실제 통신은 빠른 대칭키로' 하는 하이브리드 방식이 가장 중요한 포인트입니다. 비대칭키만 쓰면 느리고 대칭키만 쓰면 키 공유가 위험한데, 둘의 장점만 결합한 구조라는 게 시험 단골입니다." },
"sc-vpn": {
    guide: {
      hook: "공용 인터넷 위에 '나만의 사설 터널'을 뚫어 안전하게 통신하는 기술입니다.",
      scene: "공용 도로(인터넷) 위에 밀폐된 전용 터널을 세워, 그 안을 지나는 차(데이터)는 밖에서 안 보이게 하는 것입니다. 재택근무자가 회사 내부망에 있는 것처럼 접속하는 게 대표 용도입니다.",
      why: "구현 계층(IPSec=네트워크, SSL=응용)에 따라 특성이 갈리고, 최근 제로트러스트·SASE로 '경계형 VPN의 한계'가 지적되는 흐름이 출제 포인트입니다.",
      mechanism: "핵심 기술: 터널링(원 패킷을 새 헤더로 캡슐화 — L2TP·IPSec·SSL), 암호화(기밀성), 인증(사용자·기기), 무결성. 유형: IPSec VPN(사이트 간·전 트래픽), SSL VPN(원격 사용자·앱 단위·브라우저 기반). 한계: 접속하면 내부망 전체 접근(과신뢰) → 제로트러스트·SDP로 대체 흐름.",
      map: [
        { as: "도로 위 전용 터널", real: "터널링(캡슐화)", note: "" },
        { as: "터널 벽으로 가림", real: "암호화·무결성", note: "IPSec/SSL" },
        { as: "사이트 간 상시 연결", real: "IPSec VPN", note: "본사-지사" },
        { as: "브라우저로 앱만 접근", real: "SSL VPN", note: "원격 근무" },
      ],
      usage: "재택근무·지사 연결의 표준이었으나, 제로트러스트 전환으로 SDP·ZTNA로 이동 중입니다. 시험은 IPSec/SSL VPN 비교와 '경계형 한계 → 제로트러스트' 논지입니다.",
      links: [
        { topic: "IPSec", how: "네트워크 계층 VPN의 핵심 프로토콜입니다." },
        { topic: "SDP(Software Defined Perimeter)", how: "VPN의 과신뢰 한계를 제로트러스트로 대체합니다." },
      ],
      exam: "VPN은 공용망 위에 터널링·암호화로 사설 통신 경로를 만드는 기술로 IPSec·SSL 방식이 있으며, 접속 후 과신뢰 한계로 제로트러스트·SDP로 대체되고 있다.",
    }, image: "/concept/book/sc-vpn.png", easy: "VPN(가상 사설망)은 암호화된 '터널'을 통해 인터넷에 연결함으로써, 공용 인터넷망을 마치 나만 쓰는 사설 전용회선처럼 안전하게 이용하는 서비스입니다. 기술 요소 네 가지 — 터널링(공중망에 가상 경로를 뚫음), 암호화(터널 통과 패킷을 암호화해 기밀성), 인증(MAC·해시로 무결성), 접근 제어(패킷 필터링). 종류는 SSL VPN(웹 브라우저로 접속, 별도 장비 불필요), IPSec VPN(보안 우수하나 초기 비용 높음), MPLS VPN(확장성 우수, 동일 ISP망 내부). 가장 자주 나오는 IPSec VPN vs SSL VPN 비교 — IPSec은 네트워크 계층(Layer 3)에서 IP 패킷을 통째로 암호화해 종단 간 보호하고 속도가 빠르지만 설치·관리 부담이 크고, SSL은 응용 계층(Layer 4~7)에서 웹 기반으로 동작해 설치가 편하고 비용이 싸지만 속도가 느리고 동시 접속자가 적습니다. 'Layer 3 IPSec vs Layer 4~7 SSL'이 시험 포인트입니다." },
"sc-cwpp-cspm": {
    guide: {
      hook: "클라우드 보안의 두 축 — 워크로드 '안'을 지키는 CWPP, 설정 '밖'을 감시하는 CSPM.",
      scene: "CWPP는 건물 안 각 사무실(VM·컨테이너)에 경비를 두는 것, CSPM은 건물 전체 도면을 보며 '이 문이 잠기지 않았다'는 설정 실수를 찾아내는 것입니다. 클라우드 사고의 대부분이 잘못된 설정이라 둘 다 필요합니다.",
      why: "'실행 중 워크로드 보호(CWPP)'와 '구성 오류·규정 준수 점검(CSPM)'의 역할 구분이 핵심입니다. 둘을 통합한 CNAPP로 수렴하는 흐름과 클라우드 책임 공유 모델이 출제 포인트입니다.",
      mechanism: "CWPP: VM·컨테이너·서버리스의 취약점 스캔, 런타임 위협 탐지, 무결성·세그멘테이션, 호스트 방화벽 — 워크로드 내부 보호. CSPM: 클라우드 리소스 설정을 지속 점검해 잘못된 구성(공개 버킷·과권한 IAM)·규정 위반 탐지·자동 교정 — 컨트롤 플레인 보호. 통합 = CNAPP.",
      map: [
        { as: "사무실마다 경비", real: "CWPP(워크로드 보호)", note: "런타임 위협" },
        { as: "전체 도면으로 열린 문 찾기", real: "CSPM(설정 점검)", note: "구성 오류·규정" },
        { as: "잠기지 않은 창고", real: "잘못된 구성(공개 버킷)", note: "클라우드 사고 1위" },
        { as: "둘을 한 팀으로", real: "CNAPP 통합", note: "수렴 추세" },
      ],
      usage: "멀티클라우드 보안 운영의 기본 도구입니다. 시험은 CWPP vs CSPM 역할 비교와 클라우드 책임 공유 모델, CNAPP 통합 추세입니다.",
      links: [
        { topic: "클라우드 컴퓨팅 취약점, 대응기술", how: "클라우드 위협에 대한 구체적 대응 도구입니다." },
        { topic: "SASE(Secure Access Service Edge)", how: "클라우드 보안을 네트워크 접근까지 확장합니다." },
      ],
      exam: "CWPP는 VM·컨테이너 등 워크로드의 런타임을 보호하고, CSPM은 클라우드 구성 오류·규정 위반을 점검하는 상호보완 도구로 CNAPP로 통합되고 있다.",
    }, image: "/concept/book/sc-cwpp-cspm.png", easy: "CWPP와 CSPM은 클라우드 보안의 두 축으로, 짝으로 비교됩니다. CWPP(클라우드 워크로드 보호 플랫폼)는 가상 머신·컨테이너·서버리스 같은 '워크로드(실제 돌아가는 것)'를 보호합니다 — 무결성 점검·호스트 방화벽·시스템 감시로 '내부에서 실행되는 위협'을 막죠. CSPM(클라우드 보안 형상 관리)은 클라우드 인프라의 '설정(구성)'이 잘못됐거나 규정을 위반했는지 지속 모니터링합니다 — 잘못된 S3 버킷 공개 설정 같은 '구성 오류·컴플라이언스 위반'을 탐지하죠. 한 줄 구분 — CWPP는 '워크로드 보호'(애플리케이션·컨테이너·VM 보안), CSPM은 '설정·규정 준수 관리'(클라우드 환경 설정 오류·정책 위반 탐지). 적용 환경도 CWPP는 IaaS 중심, CSPM은 PaaS 중심으로 갈립니다. Gartner 클라우드 보안 커버리지에서 CASB·CSPM·CWPP·SASE가 각 계층을 담당한다는 큰 그림과, 'CWPP=워크로드, CSPM=설정'이라는 역할 구분이 시험 포인트입니다." },
"sc-sase": {
    guide: {
      hook: "네트워크(WAN)와 보안을 클라우드에서 하나로 합친 것 — '접속하는 곳'이 아니라 '누가·어디서'로 보호합니다.",
      scene: "예전엔 모든 트래픽을 본사 데이터센터로 끌어와 보안 장비를 거친 뒤 내보냈습니다(백홀). 원격근무·클라우드 시대엔 비효율이라, 보안 기능을 사용자 가까운 클라우드 엣지로 옮겨 그 자리에서 검사하고 바로 목적지로 보냅니다.",
      why: "SD-WAN(네트워크)과 보안 스택(SWG·CASB·ZTNA·FWaaS)을 클라우드에서 통합한 개념이라, 구성요소 나열과 '경계 소멸→아이덴티티 중심' 논지가 출제 핵심입니다. 제로트러스트의 네트워크 구현체입니다.",
      mechanism: "SASE = SD-WAN + 보안 서비스 엣지(SSE). SSE 구성: SWG(웹 게이트웨이), CASB(클라우드 앱 가시성·통제), ZTNA(제로트러스트 접근), FWaaS(방화벽). 사용자·기기의 아이덴티티와 컨텍스트로 정책을 적용하고, PoP(엣지)에서 인라인 검사 후 목적지로 직결.",
      map: [
        { as: "본사로 다 끌어오던 우회로", real: "백홀 → 엣지 인라인 검사", note: "지연 감소" },
        { as: "길과 검문소를 한 회사가", real: "SD-WAN + SSE 통합", note: "" },
        { as: "클라우드 앱 감시", real: "CASB", note: "SSE 구성" },
        { as: "접속 전 신원·상태 확인", real: "ZTNA", note: "제로트러스트" },
      ],
      usage: "글로벌 분산·원격근무 기업의 네트워크·보안 통합에 채택됩니다. 시험은 SSE 구성요소(SWG·CASB·ZTNA·FWaaS)와 '경계형 VPN → SASE' 전환 논지입니다.",
      links: [
        { topic: "제로트러스트 가이드라인 2.0", how: "SASE는 제로트러스트를 네트워크로 구현합니다." },
        { topic: "SECaaS(Security as a Service)", how: "보안 기능의 클라우드 서비스화라는 공통 흐름입니다." },
      ],
      exam: "SASE는 SD-WAN과 SWG·CASB·ZTNA·FWaaS 등 보안 기능을 클라우드 엣지에서 통합해 아이덴티티 중심으로 보호하는 제로트러스트 네트워크 아키텍처다.",
    }, image: "/concept/book/sc-sase.png", easy: "SASE(보안 접근 서비스 엣지, '새시'라 읽음)는 광역 네트워킹(WAN)과 네트워크 보안을 하나의 클라우드 서비스로 통합한 모델입니다. 원격근무와 클라우드가 확산되면서, 예전처럼 본사 데이터센터에 트래픽을 모아 보안 검사하는 방식이 비효율적이 됐죠. 그래서 SASE는 사용자 가까운 클라우드 엣지에서 네트워크와 보안을 동시에 처리합니다. 구성은 두 덩어리 — 네트워크 서비스(SD-WAN·SD-브랜치: 소프트웨어로 정의된 유연한 광역망)와 보안 서비스(CASB·SECaaS·ZTNA). 특히 ZTNA(제로 트러스트 네트워크 액세스)는 기존의 넓은 경계선(perimeter) 보안을 데이터 하나하나의 바깥 경계선(microperimeter)으로 좁힌 개념입니다. 공식으로 표현하면 SASE = SSE(보안: FWaaS·ZTNA·CASB·SWG) + 네트워크 접속(SD-WAN)입니다. '네트워크(SD-WAN) + 보안(ZTNA·CASB)을 클라우드 엣지에서 통합'이 시험 포인트입니다." },
"sc-secaas": {
    guide: {
      hook: "보안 장비를 사는 대신 '구독'하는 것 — 보안 기능의 클라우드 서비스화입니다.",
      scene: "방화벽·백신·SIEM을 직접 사서 운영하려면 비싸고 전문가도 필요합니다. SECaaS는 이를 클라우드 사업자가 서비스로 제공해, 필요한 만큼 구독해 쓰고 운영은 맡기는 모델입니다.",
      why: "SaaS의 보안판으로 '자본지출→운영지출', '전문성 아웃소싱'이 핵심 가치입니다. 다만 데이터·통제권을 외부에 맡기는 책임 공유·종속성 이슈가 한계로 출제됩니다.",
      mechanism: "제공 형태: IAM·SWG·이메일 보안·SIEM/SOAR·취약점 관리·DDoS 방어 등을 멀티테넌트 클라우드로 제공. 이점: 초기 투자·운영 부담 감소, 최신 위협 인텔리전스 자동 반영, 확장 용이. 한계: 데이터 위탁에 따른 프라이버시·규정, 가용성·종속(lock-in) 위험.",
      map: [
        { as: "구독형 보안 서비스", real: "SECaaS 모델", note: "CapEx→OpEx" },
        { as: "운영을 전문업체에", real: "보안 관제 아웃소싱", note: "전문성 확보" },
        { as: "최신 위협 자동 업데이트", real: "클라우드 위협 인텔리전스", note: "" },
        { as: "열쇠를 남에게 맡김", real: "데이터 위탁·종속 위험", note: "한계" },
      ],
      usage: "보안 인력이 부족한 중견·중소기업이 주 고객입니다. 시험은 SECaaS 제공 항목과 이점·한계(책임 공유·종속), SASE와의 관계입니다.",
      links: [
        { topic: "SASE(Secure Access Service Edge)", how: "네트워크와 보안을 함께 서비스화한 확장형입니다." },
        { topic: "클라우드 컴퓨팅 취약점, 대응기술", how: "책임 공유 모델이 SECaaS에도 적용됩니다." },
      ],
      exam: "SECaaS는 방화벽·SIEM·이메일 보안 등 보안 기능을 클라우드 구독형으로 제공하는 모델로, 초기 투자·운영 부담을 줄이나 데이터 위탁·종속 위험이 있다.",
    }, image: "/concept/book/sc-secaas.png", easy: "SECaaS(서비스형 보안)는 보안 장비·인프라를 직접 사거나 구축하지 않고, 클라우드에서 구독 형태로 보안 기능을 받아 쓰는 모델입니다. SaaS(서비스형 소프트웨어), IaaS(서비스형 인프라)처럼 '보안'도 서비스 상품이 된 거죠. 유형은 둘 — CSP SECaaS(기존 클라우드 제공자가 자기 서비스 보안을 위해 제공)와 SSP SECaaS(모든 시스템에 전문 보안 서비스를 제공). 제공 서비스는 보안의 각 분야를 망라합니다 — IAM(인증·접근 제어, Okta), DLP(데이터 유출 방지, Symantec), SIEM(로그 분석·위협 탐지, Splunk), EDR(엔드포인트 탐지·대응, CrowdStrike), FWaaS(클라우드 방화벽, Zscaler), MDR(관리형 탐지·대응, Rapid7). 장점은 초기 구축 비용 없이 전문 보안을 빠르게 도입하고 확장할 수 있다는 것입니다. SASE의 보안 구성요소로도 들어간다는 연결, 그리고 '보안의 서비스화'라는 성격이 시험 포인트입니다." },
"sc-dual-signature": {
    guide: {
      hook: "'주문 정보'와 '결제 정보'를 서로 못 보게 분리하면서도 둘의 연결은 증명하는 전자상거래 서명입니다.",
      scene: "쇼핑몰은 내 카드번호를 몰라야 하고, 카드사는 내가 뭘 샀는지 몰라야 합니다. 이중서명은 두 정보를 각각 해시한 뒤 합쳐서 한 번 서명해, 상인은 주문만·은행은 결제만 보되 '이 결제가 이 주문의 것'임은 서로 검증하게 합니다.",
      why: "SET 프로토콜의 핵심 기법으로, '정보 분리 + 연결 증명'이라는 프라이버시 보존 서명의 원형입니다. 해시·전자서명의 응용 사례로 절차 계산 문제가 출제됩니다.",
      mechanism: "주문정보(OI) 해시와 결제정보(PI) 해시를 각각 구함 → 두 해시를 이어 붙여 다시 해시(POMD) → 그 값을 고객 개인키로 서명 = 이중서명. 상인은 OI 원문+PI 해시로, 은행은 PI 원문+OI 해시로 각각 POMD를 재계산해 서명을 검증 — 원문은 상대 것을 못 보면서 연결만 확인.",
      map: [
        { as: "상인은 주문만, 은행은 결제만", real: "정보 분리 열람", note: "프라이버시" },
        { as: "둘을 묶어 한 번 도장", real: "두 해시 결합 후 서명", note: "POMD" },
        { as: "상대 것은 해시만 받음", real: "교차 검증", note: "연결 증명" },
      ],
      usage: "SET(Secure Electronic Transaction) 신용카드 결제의 핵심입니다. 시험은 이중서명 생성·검증 절차 계산과 '정보 분리+연결 증명' 원리입니다.",
      links: [
        { topic: "해시 함수의 안전성", how: "두 해시 결합이 이중서명의 뼈대입니다." },
        { topic: "전자봉투(Digital Envelope)", how: "같은 전자상거래 보안의 하이브리드 기법입니다." },
      ],
      exam: "이중 서명은 주문·결제 정보를 각각 해시·결합해 서명함으로써 상인·은행이 상대 정보를 못 보면서 거래 연결성을 검증하게 하는 SET의 핵심 기법이다.",
    }, image: "/concept/book/sc-dual-signature.png", easy: "이중 서명(Dual Signature)은 온라인 카드 결제에서, 판매자는 '구매 정보'만 보고 금융기관은 '지불 정보'만 보게 정보를 분리하는 전자서명입니다. 판매자에게 내 카드번호를 보여주기 싫고, 은행에는 내가 뭘 샀는지 보여주기 싫은 거죠. 원리 — 구매정보 해시(M1)와 결제정보 해시(M2)를 이어붙여(연접) 다시 해시한 M을 만들고, 이 M을 구매자 개인키로 서명합니다. 결제정보는 대칭키로 암호화하고, 그 대칭키는 결제기관 공개키로 암호화(전자봉투)해서 판매자를 거쳐 전달합니다. 판매자는 구매정보로 M1을 만들고 받은 M2와 합쳐 M을 검증하지만 결제정보 자체는 못 봅니다. 카드사는 반대로 결제정보만 봅니다. SET(전자결제) 프로토콜의 핵심 기술입니다. 다중 서명과 헷갈리지 마세요 — 이중 서명은 '한 사람이 두 정보를 분리 서명', 다중 서명은 'M명 중 N명이 합의 서명'입니다." },
"sc-multi-signature": {
    guide: {
      hook: "한 사람의 서명이 아니라 'N명 중 M명'이 서명해야 승인되는 다중 결재 방식입니다.",
      scene: "회사 금고를 임원 한 명이 못 열고 3명 중 2명이 동시에 열쇠를 돌려야 열리게 하는 것입니다. 하나의 개인키에 의존하지 않아, 키 하나가 털려도 자금이 안전합니다.",
      why: "블록체인 지갑·기업 자금 통제의 핵심으로, '단일 실패점 제거'와 'M-of-N 임계' 개념이 출제 포인트입니다. 이중서명(정보 분리)과 이름은 비슷하나 목적(공동 승인)이 다르다는 구분이 중요합니다.",
      mechanism: "N개의 공개키를 등록하고 M개 이상의 유효 서명이 모여야 트랜잭션 승인(M-of-N). 구현: 스크립트 기반(비트코인 P2SH), 임계 서명(TSS — 키를 분산 생성해 부분 서명 결합), 스마트컨트랙트 지갑. 키 분실·탈취 내성과 내부 통제(권한 분산)를 동시에 제공.",
      map: [
        { as: "3명 중 2명이 열쇠", real: "M-of-N 임계 승인", note: "공동 결재" },
        { as: "한 명 배신해도 안전", real: "단일 실패점 제거", note: "탈취 내성" },
        { as: "열쇠를 나눠 만들기", real: "임계 서명(TSS)", note: "고급 구현" },
        { as: "이중서명과는 다름", real: "정보 분리 아님·공동 승인", note: "구분" },
      ],
      usage: "거래소·기업 암호자산 지갑, 탈중앙 조직(DAO) 자금 관리에 쓰입니다. 시험은 M-of-N 개념, 이중서명과의 차이, 단일 실패점 제거 효과입니다.",
      links: [
        { topic: "이중 서명(Dual Signature)", how: "이름은 비슷하나 목적(정보 분리 vs 공동 승인)이 다릅니다." },
        { topic: "블록체인 암호기술 가이드라인", how: "블록체인 지갑 보안의 핵심 기법입니다." },
      ],
      exam: "다중 서명은 N개 키 중 M개 이상의 서명이 모여야 승인하는 M-of-N 방식으로, 단일 실패점을 제거해 키 탈취·내부 통제 위험을 완화한다.",
    }, image: "/concept/book/sc-multi-signature.png", easy: "다중 서명(Multi Signature)은 하나의 거래를 승인하려면 미리 정한 여러 개의 키 중 정해진 수(M of N) 이상이 서명해야 하는 방식입니다. 예를 들어 '3명 중 2명(2 of 3)'이 서명해야 자금이 나가는 공동 지갑이죠. 키 하나를 잃거나 도둑맞아도 거래가 안 되니 안전하고, 회사 자금·에스크로에 씁니다. 블록체인 절차 — ① 조건설정(3 of 5 등 스마트계약) → ② 키생성(각자 개인키·공개키) → ③ 주소생성(공개키들로 스크립트 해시 주소) → ④ 거래생성(멀티시그 주소로) → ⑤ 서명요청(각자 개인키로 서명) → ⑥ 서명검증(조건 이상 서명 확인) → ⑦ 제출 → ⑧ 완료. 구현 기법은 비트코인의 P2SH(Pay-to-Script-Hash, 프로토콜 레벨)와 이더리움의 스마트 컨트랙트(애플리케이션 레벨)로 나뉩니다. 'M of N 합의'와 이중 서명(SET 결제의 정보 분리)과의 구분이 시험 포인트입니다." },
"sc-simple-auth": {
    guide: {
      hook: "공인인증서의 불편을 걷어낸 '간편인증'을 서비스끼리 표준으로 연동하는 가이드라인입니다.",
      scene: "카카오·네이버·통신사 PASS 등 여러 간편인증을 서비스마다 제각각 붙이면 혼란스럽습니다. 가이드라인은 인증 요청·응답의 공통 인터페이스를 정해, 이용자·서비스·인증사업자가 한 규격으로 연동되게 합니다.",
      why: "전자서명법 개정(공인인증서 폐지) 이후의 인증 생태계 표준화가 배경입니다. 인증 3주체 구조와 보안 요구사항(전송 암호화·부인방지)이 출제 포인트입니다.",
      mechanism: "구조: 이용자 — 이용기관(서비스) — 인증기관(간편인증 사업자) 3주체. 흐름: 서비스가 인증 요청 → 이용자가 인증앱에서 승인(생체·PIN) → 인증기관이 결과 서명·반환 → 서비스가 검증. 요구사항: 전송 구간 암호화, 인증 결과 무결성·부인방지, 개인정보 최소 전달.",
      map: [
        { as: "이용자-서비스-인증사 삼각", real: "인증 3주체 구조", note: "" },
        { as: "제각각을 한 규격으로", real: "표준 인터페이스", note: "연동성" },
        { as: "결과에 도장·되돌릴 수 없음", real: "무결성·부인방지", note: "보안 요구" },
        { as: "필요한 정보만 전달", real: "개인정보 최소화", note: "" },
      ],
      usage: "공공·민간 서비스의 간편인증 도입 표준입니다. 시험은 3주체 구조, 공인인증서 폐지 배경, 보안 요구사항 서술입니다.",
      links: [
        { topic: "OAuth(Open Authorize) 2.0", how: "위임 인증·인가의 국제 표준 프로토콜입니다." },
        { topic: "패스키(Passkey)", how: "비밀번호 없는 차세대 간편인증입니다." },
      ],
      exam: "간편인증 인터페이스 가이드라인은 이용자·이용기관·인증기관 3주체의 인증 연동을 표준화한 지침으로, 전송 암호화·무결성·부인방지를 요구한다.",
    }, image: "/concept/book/sc-simple-auth.png", easy: "간편인증 인터페이스 가이드라인은 긴 공인인증서 비밀번호 대신 PIN·지문·패턴 같은 간편한 방법으로 전자서명 서비스를 이용하도록 한 지침입니다. 카카오·네이버 인증서로 로그인하는 그 방식이죠. 절차 — 사용자가 전자서명 수단을 고르고 정보 입력 → 이용기관이 인증 요청 → 전자서명인증사업자가 인증앱을 호출(앱스킴·딥링크·QR·PUSH) → 사용자가 앱에서 전자서명 → 결과를 이용기관에 전달·확인. 보안의 핵심은 두 개의 키 — 클라이언트 시크릿(CS: 접근토큰 발급 인증과 메시지 무결성 검증)과 마스터 시크릿(MS: 중요정보 암호화), 둘 다 유효기간 최대 2년 권고입니다. 특히 메시지 인증(HMAC)할 때는 클라이언트 시크릿과 랜덤 솔트로 새 비밀키(MacK)를 유도하고, 중요정보 암호화 때는 마스터 시크릿과 매번 새 솔트로 암호키(EncK)를 만듭니다. '이중 키 구조 + 랜덤 솔트로 매번 새 키 유도'가 시험 포인트입니다." },
"sc-digital-envelope": {
    guide: {
      hook: "대칭키의 속도와 공개키의 안전한 배송을 결합한 하이브리드 암호의 원형입니다.",
      scene: "큰 짐(데이터)은 빠른 자물쇠(대칭키)로 잠그고, 그 자물쇠 열쇠만 수신자의 우편함(공개키)에 넣어 보냅니다. 받는 사람은 자기 개인키로 열쇠를 꺼내 짐을 엽니다 — 빠르면서도 열쇠 배송이 안전합니다.",
      why: "'왜 대칭·비대칭을 섞나'의 정답 구조 그 자체입니다. TLS·S/MIME·PGP가 모두 이 원리라, 봉투 생성·개봉 절차가 출제 단골입니다.",
      mechanism: "생성: 임의 세션키(대칭)로 평문 암호화 → 세션키를 수신자 공개키로 암호화 → (암호문 + 암호화된 세션키)를 함께 전송. 개봉: 수신자가 개인키로 세션키 복호 → 그 세션키로 본문 복호. 무결성·인증이 필요하면 발신자 서명·해시를 추가.",
      map: [
        { as: "짐은 빠른 자물쇠로", real: "세션키(대칭) 본문 암호", note: "속도" },
        { as: "열쇠만 우편함에", real: "세션키를 공개키로 암호화", note: "안전 배송" },
        { as: "개인키로 열쇠 꺼내기", real: "수신자 복호", note: "" },
        { as: "발신 도장 추가", real: "서명·해시 결합", note: "무결성·인증" },
      ],
      usage: "PGP 이메일·S/MIME·TLS의 기본 구조입니다. 시험은 전자봉투 생성·개봉 절차 그림과 하이브리드 암호의 이유입니다.",
      links: [
        { topic: "암호화(Encryption)", how: "하이브리드 암호를 구체화한 응용입니다." },
        { topic: "TLS/SSL(Secure Socket Layer)", how: "핸드셰이크가 전자봉투와 같은 원리입니다." },
      ],
      exam: "전자봉투는 세션키로 본문을 대칭 암호화하고 그 세션키를 수신자 공개키로 암호화해 보내는 하이브리드 기법으로, 속도와 키 배송 안전성을 함께 얻는다.",
    }, image: "/concept/book/sc-digital-envelope.png", easy: "전자봉투(Digital Envelope)는 대칭키와 비대칭키의 장점만 결합한 하이브리드 암호 전송 방식입니다. 문제 상황 — 대칭키는 빠르지만 '이 키를 어떻게 안전하게 상대에게 전달하지?'가 위험하고, 비대칭키는 안전하지만 느립니다. 해법 — 실제 데이터(컨텐츠)는 빠른 대칭키(비밀키)로 암호화하고, 그 대칭키만 수신자의 공개키로 암호화(이게 '전자봉투')해서 함께 보냅니다. 송신 절차 — ① 메시지 해시로 다이제스트 생성 ② 송신자 개인키로 서명 ③ 비밀키로 전자서명·메시지·인증서 암호화 ④ 수신자 공개키로 비밀키 암호화(전자봉투) ⑤ 전송. 수신자는 자기 개인키로 전자봉투를 열어 비밀키를 얻고 → 암호문을 풀고 → 송신자 공개키로 전자서명을 검증합니다. 열쇠(대칭키)를 상자(수신자 공개키)에 넣어 보낸다고 생각하면 됩니다. TLS/SSL·PGP의 기반 원리이고, '데이터는 대칭키로, 그 키는 공개키로'가 핵심입니다." },
"sc-drm": {
    guide: {
      hook: "콘텐츠를 산 뒤에도 '어떻게 쓸지'를 통제하는 디지털 저작권 관리입니다.",
      scene: "영화를 내려받아도 복사·캡처·기한 초과 재생이 안 되는 것 — 콘텐츠에 사용 규칙(라이선스)을 붙이고, 규칙을 지킬 때만 복호화 열쇠를 내주는 방식입니다.",
      why: "'암호화 + 라이선스(권한) + 지속 통제'의 결합 구조가 핵심입니다. 워터마킹(추적)과 역할이 다르고(사전 통제 vs 사후 추적), 난독화·안티탬퍼와 묶여 콘텐츠 보호 체계로 출제됩니다.",
      mechanism: "구성: 콘텐츠 암호화(패키징), 라이선스 서버(권한·유효기간·기기 제한 발급), 클라이언트 DRM 에이전트(라이선스 검증 후 복호·재생, 화면 캡처·재배포 차단), 키 관리. 사용 시마다 라이선스를 확인하는 '지속적 통제'가 일반 암호화와의 차이입니다.",
      map: [
        { as: "콘텐츠에 사용 규칙 부착", real: "라이선스(권한·기한·기기)", note: "지속 통제" },
        { as: "규칙 지킬 때만 열쇠", real: "라이선스 서버·복호 키", note: "" },
        { as: "캡처·복사 차단", real: "DRM 에이전트 통제", note: "" },
        { as: "사후 추적은 워터마크", real: "역할 분담", note: "DRM=사전 통제" },
      ],
      usage: "OTT·전자책·기업 문서 보안(IRM)에 쓰입니다. 시험은 DRM 구성요소와 워터마킹과의 역할 구분(사전 통제 vs 사후 추적)입니다.",
      links: [
        { topic: "디지털 워터마킹(Digital Watermarking)", how: "사후 추적을 담당하는 보완 기술입니다." },
        { topic: "SW난독화", how: "DRM 클라이언트의 변조 방지에 함께 쓰입니다." },
      ],
      exam: "DRM은 콘텐츠 암호화에 라이선스 기반 권한 통제를 결합해 구매 후에도 복사·재생을 지속 통제하는 저작권 관리 기술로, 사후 추적하는 워터마킹과 역할이 다르다.",
    }, image: "/concept/book/sc-drm.png", easy: "DRM(디지털 저작권 관리)은 음악·영상·전자책 같은 디지털 콘텐츠의 불법 복제·사용을 막고 정상 사용자만 쓰도록 통제하는 저작권 보호 기술입니다. 산 사람만, 산 만큼만, 정해진 기기에서만 쓰게 하는 거죠. 4대 주체 [CP·CD·CC·CH] — 콘텐츠 제공자(CP)·분배자(CD)·소비자(CC)·클리어링하우스(CH). 흐름은 CP가 콘텐츠를 패키저로 암호화(Secure Container)해 유통하고, 소비자는 DRM 컨트롤러로 재생하되 라이선스는 클리어링하우스가 발급·과금합니다. 기술 요소는 네 갈래 — 컨텐츠 식별체계(DOI·URI), 메타데이터(INDECS·MPEG-7), 저작권 표현 언어(XrML·ODRL), 불법유통 적발(Watermark·Fingerprint). 즉 워터마킹·핑거프린팅이 DRM의 하위 기술로 들어갑니다. '암호화로 못 쓰게 막고, 라이선스로 권한을 통제하고, 워터마크로 추적한다'는 3단 구조와 4대 주체가 시험 포인트입니다." },
"sc-watermarking": {
    guide: {
      hook: "콘텐츠에 안 보이는 '출처 도장'을 새겨, 유출되면 누가 흘렸는지 추적합니다.",
      scene: "지폐의 숨은 그림처럼, 이미지·영상·문서에 사람 눈에 안 띄는 정보를 삽입합니다. 파일이 유출되면 그 워터마크를 읽어 원 소유자·배포 경로를 밝힙니다.",
      why: "DRM이 '사전에 못 쓰게' 막는다면 워터마킹은 '이미 나간 뒤 추적'한다는 역할 구분이 핵심입니다. 강인성(변형 후에도 살아남기)과 비가시성의 상충, 핑거프린팅과의 관계가 출제 포인트입니다.",
      mechanism: "삽입: 원본의 공간·주파수 영역(DCT·DWT)에 정보를 미세하게 embed → 압축·크롭·필터를 거쳐도 검출되게 강인성 확보. 요구 특성: 비가시성(품질 저하 최소), 강인성(변형 내성), 보안성(제거·위조 저항), 용량. 소유권 증명용은 동일 워터마크, 배포자 추적용은 사용자별 고유값(=핑거프린팅).",
      map: [
        { as: "지폐 숨은 그림", real: "비가시성 워터마크 삽입", note: "품질 유지" },
        { as: "구겨도 남는 무늬", real: "강인성", note: "변형 내성" },
        { as: "유출자 색출", real: "사후 추적", note: "DRM과 역할 분담" },
        { as: "사람마다 다른 도장", real: "핑거프린팅", note: "배포자 식별" },
      ],
      usage: "영상 유출 추적, 저작권 증명, AI 생성물 표시에 쓰입니다. 시험은 워터마킹 요구특성(비가시성·강인성 상충)과 DRM·핑거프린팅과의 관계입니다.",
      links: [
        { topic: "핑거프린팅(Fingerprinting)", how: "사용자별 고유 워터마크로 배포자를 특정합니다." },
        { topic: "DRM(Digital Right Management)", how: "사전 통제(DRM) + 사후 추적(워터마크) 조합입니다." },
      ],
      exam: "디지털 워터마킹은 콘텐츠에 비가시적 정보를 삽입해 저작권 증명·유출 추적에 쓰는 기술로, 비가시성과 강인성이 상충하며 DRM의 사후 보완책이 된다.",
    }, image: "/concept/book/sc-watermarking.png", easy: "디지털 워터마킹은 이미지·영상·음악 같은 콘텐츠에 사람 눈엔 안 보이는 '소유권 마크'를 몰래 삽입해, 불법 복제됐을 때 저작권자를 추적할 수 있게 하는 정보은닉 기술입니다. 지폐의 숨은 그림처럼요. 삽입 기술은 두 방식 — 공간영역(픽셀 값에 직접 삽입, 계산 간단하지만 JPEG 압축·필터링에 약함)과 주파수영역(DCT·DWT 등으로 변환 후 삽입, 전 영역에 퍼져 삭제 어렵지만 연산 부하 큼). 검출 기술은 공개형(Blind, 원본 없이 검출·누구나 검증 가능)과 비공개형(non-Blind, 원본 필요·보안성 우수). 공격 기법은 Filtering·Copy·Mosaic·Template Attack이 있습니다. 가장 중요한 두 품질 요건은 비가시성(안 보여야 함)과 견고성(공격에 견뎌야 함)인데 서로 상충해서 균형이 핵심입니다. 핑거프린팅과의 차이 — 워터마킹은 '저작권 정보'만 삽입(복제 방지)이 시험 포인트입니다." },
"sc-fingerprinting": {
    guide: {
      hook: "구매자마다 다른 '개인 표식'을 콘텐츠에 심어, 유출되면 '누가 흘렸는지'를 특정합니다.",
      scene: "같은 영화라도 사용자 A와 B에게 미세하게 다른 워터마크를 넣어 판매합니다. 불법 유통본이 발견되면 그 표식을 읽어 원 구매자를 정확히 지목할 수 있습니다.",
      why: "워터마킹의 특수형(사용자별 고유값)으로 '배포자 추적'이 목적입니다. 여럿이 사본을 합쳐 표식을 지우려는 공모 공격(Collusion)과 그 방어(공모 내성 코드)가 출제 포인트입니다. 웹 브라우저 핑거프린팅(기기 식별 추적)과 용어가 겹치니 문맥 구분이 필요합니다.",
      mechanism: "각 사본에 구매자 식별 정보를 워터마크로 삽입 → 유출본에서 추출해 구매자 특정. 위협: 여러 구매자가 사본을 비교·평균해 표식을 제거·왜곡하는 공모 공격 → 방어로 공모 내성 코드(예: Tardos 코드)를 설계. 프라이버시 이슈로 삽입 정보는 최소화·암호화.",
      map: [
        { as: "사람마다 다른 표식", real: "사용자별 고유 워터마크", note: "배포자 추적" },
        { as: "유출본에서 표식 판독", real: "구매자 특정", note: "" },
        { as: "여럿이 모여 표식 지우기", real: "공모 공격(Collusion)", note: "핵심 위협" },
        { as: "지워도 남게 설계", real: "공모 내성 코드", note: "방어" },
      ],
      usage: "프리미엄 영상·문서의 유출 추적, 화면 워터마크에 쓰입니다. 시험은 워터마킹과의 차이(공용 vs 사용자별), 공모 공격·내성 코드, 브라우저 핑거프린팅과의 구분입니다.",
      links: [
        { topic: "디지털 워터마킹(Digital Watermarking)", how: "핑거프린팅은 사용자별 워터마킹입니다." },
        { topic: "DRM(Digital Right Management)", how: "추적을 통한 유출 억지에 함께 쓰입니다." },
      ],
      exam: "핑거프린팅은 구매자별 고유 워터마크를 삽입해 유출 시 배포자를 특정하는 기법으로, 공모 공격에 대비한 공모 내성 코드 설계가 관건이다.",
    }, image: "/concept/book/sc-fingerprinting.png", easy: "핑거프린팅은 디지털 콘텐츠에 저작권 정보뿐 아니라 '구매자 정보'까지 삽입해, 불법 유통됐을 때 '누가 유출했는지' 추적하는 정보은닉 기술입니다. 워터마킹과 짝으로 비교되는데 결정적 차이가 삽입 정보 — 워터마킹은 저작권 정보만(최초 저작 시점), 핑거프린팅은 저작권 정보 + 구매자 정보(구매 시점마다 다르게). 그래서 같은 영화라도 사람마다 다른 핑거프린트가 박혀, 유출본을 잡으면 누구 사본인지 알 수 있죠. 고유 취약점은 '공모 공격' — 여러 구매자가 자기 사본을 합쳐 핑거프린트를 지우려는 시도입니다. 유형은 평균화 공격(사본들을 평균), 최대최소 공격, 상관계수 음수화·제로화 공격(검출을 방해), 모자이크 공격(잘게 조각내 재조합)이 있습니다. '구매자 정보 삽입으로 배포자 추적', '공모 공격이라는 고유 취약점'이 시험 포인트이고, 해결책으로 통합 DRM 기술을 활용합니다." },
"sc-biometric": {
    guide: {
      hook: "지문·얼굴·홍채처럼 '내가 곧 열쇠' — 생체 특징으로 신원을 확인합니다.",
      scene: "비밀번호는 잊고 도난당하지만 지문은 늘 몸에 있습니다. 다만 유출되면 바꿀 수 없다는 게 치명적 — 그래서 원본을 저장하지 않고 특징점만 변환해 보관하고, 통신을 텔레바이오(원격 생체) 표준으로 보호합니다.",
      why: "'지식(비밀번호)·소유(토큰)·존재(생체)' 인증 3요소 중 존재 요소라는 위치, 그리고 오인식률(FAR/FRR) 상충과 '변경 불가·재발급 불가'의 근본 한계가 출제 핵심입니다.",
      mechanism: "절차: 등록(생체 획득→특징 추출→템플릿 저장) / 인증(재획득→특징 비교→임계값 판정). 성능: FAR(타인 수락률)와 FRR(본인 거부률)은 임계값을 두고 상충 — 교차점이 EER. 보안: 원본 대신 특징점 변환 저장(가역 불가), 위조(가짜 지문)·재생 공격 대비 생체 검출(Liveness), 텔레바이오 인증으로 전송 보호.",
      map: [
        { as: "몸이 곧 열쇠", real: "존재(생체) 인증 요소", note: "3요소 중 하나" },
        { as: "너무 엄격 vs 너무 허술", real: "FRR ↔ FAR 상충(EER)", note: "임계값 조정" },
        { as: "가짜 지문 판별", real: "생체 검출(Liveness)", note: "위조 대응" },
        { as: "유출돼도 못 바꿈", real: "재발급 불가 한계", note: "특징점 변환 저장" },
      ],
      usage: "스마트폰 잠금·간편결제·출입통제의 표준입니다. 시험은 FAR/FRR/EER 개념, 인증 3요소 위치, 생체정보 보호(변환 저장·Liveness)입니다.",
      links: [
        { topic: "생체정보 보호 안내서(24.12)", how: "생체정보의 안전한 처리 기준을 제시합니다." },
        { topic: "패스키(Passkey)", how: "생체로 개인키를 잠그는 비밀번호 없는 인증입니다." },
      ],
      exam: "생체 인증은 지문·얼굴 등 존재 요소로 신원을 확인하며 FAR·FRR이 상충하고, 재발급 불가·위조 위험 때문에 특징점 변환 저장과 생체 검출이 필요하다.",
    }, image: "/concept/book/sc-biometric.png", easy: "생체 인증(텔레바이오 인증)은 유무선 통신 환경에서 멀리 떨어진 사용자의 신분을 지문·얼굴·홍채 같은 바이오 정보로 식별하는 기술입니다. 원격(텔레)이라는 게 포인트로, 비대면 환경에서의 생체 인증이죠. 생체정보가 갖춰야 할 고유 특성 7가지 — 보편성·유일성·영구성·획득성·정확성·접근성·기만성. 유형은 두 갈래 [지열홍정 음걸행서] — 신체적 특징(지문·얼굴·홍채·정맥)과 행동적 특징(음성·걸음걸이·행동·서명). 가장 중요한 시험 포인트는 3대 측정 지표 — FRR(본인 거부율: 올바른 사용자를 잘못 거부), FAR(타인 수용율: 잘못된 사용자를 허용), EER(FAR과 FRR이 같아지는 지점). FAR과 FRR은 상충 관계입니다(보안을 빡세게 하면 본인도 자꾸 거부당하고, 느슨하게 하면 남도 통과). 그래서 둘이 만나는 EER이 낮을수록 우수한 시스템입니다. 'FAR·FRR 상충과 EER'이 계산·비교 문제로 단골 출제됩니다." },
"sc-biometric-guide": {
    guide: {
      hook: "생체정보는 '못 바꾸는 개인정보'라 특별히 더 엄격하게 다루라는 보호 안내서(2024.12)입니다.",
      scene: "지문·얼굴은 유출돼도 재발급이 안 되니 비밀번호보다 훨씬 위험합니다. 안내서는 생체정보를 수집·이용·보관·파기하는 전 단계에서 무엇을 지켜야 하는지를 구체 기준으로 제시합니다.",
      why: "생체 인증(기술)과 보호 안내서(제도)의 관계로, '원본 미저장·특징정보 변환·분리보관'이라는 안전조치가 출제 포인트입니다. 개인정보보호법상 민감정보 처리 기준의 구체화입니다.",
      mechanism: "핵심 원칙: 원본(이미지) 저장 금지·특징정보로 변환, 특징정보 암호화·분리 보관, 목적 외 이용 금지, 별도 동의, 안전한 파기. 인증 단계별 통제와 위조·재생 공격 대비(생체 검출), 대체 수단 제공(생체 거부자 배려)까지 포함.",
      map: [
        { as: "원본 사진은 안 남김", real: "원본 미저장·특징 변환", note: "핵심 안전조치" },
        { as: "특징도 잠가서 따로 보관", real: "암호화·분리 보관", note: "" },
        { as: "다른 데 못 씀", real: "목적 외 이용 금지·별도 동의", note: "민감정보" },
        { as: "가짜 생체 판별", real: "위조·재생 공격 대비", note: "Liveness" },
      ],
      usage: "생체 인증을 도입하는 서비스의 컴플라이언스 기준입니다. 시험은 원본 미저장·특징 변환·분리보관 원칙과 민감정보 처리 요건입니다.",
      links: [
        { topic: "생체 인증(텔레바이오 인증)", how: "이 안내서가 규율하는 기술 대상입니다." },
        { topic: "개인정보 보호기술", how: "민감정보 보호 기술의 적용 대상입니다." },
      ],
      exam: "생체정보 보호 안내서(24.12)는 재발급 불가한 생체정보를 원본 미저장·특징정보 변환·암호화 분리보관 원칙으로 다루도록 한 민감정보 보호 기준이다.",
    }, image: "/concept/book/sc-biometric-guide.png", easy: "생체정보 보호 안내서(24.12)는 지문·얼굴 같은 생체정보를 안전하게 처리·보호하기 위한 지침입니다. 먼저 개념 관계를 잡아야 합니다 — 개인정보 ⊃ 생체정보 ⊃ 생체인식정보(인증·식별 목적). 생체인식정보는 다시 원본정보(입력장치로 수집되는 것)와 특징정보(원본에서 특징점을 뽑아낸 민감정보)로 나뉩니다. 보호 6대 원칙 [비적목투안통] — 비례성(편익 대비 침해 위험 고려), 적법성(처리 근거 명확), 목적제한(동의받은 목적 외 사용 금지), 투명성(공개), 안전성(분실·위조 방지), 통제권보장(정보주체가 스스로 통제). 보호조치는 생애주기 5단계 — ① 기획·설계(PbD 적용·영향평가) ② 수집(전송구간 보호) ③ 이용·제공(목적 범위 내) ④ 보관·파기(저장 시 암호화·원본 분리보관) ⑤ 상시 점검. '생체정보와 생체인식정보의 포함 관계', '원본정보-특징정보 구분', '저장 시 암호화·원본 분리보관'이 시험 포인트입니다." },
"sc-oauth": {
    guide: {
      hook: "비밀번호를 넘겨주지 않고 '이 앱에 이만큼만 허락'하는 권한 위임의 국제 표준입니다.",
      scene: "사진 인화 앱에 구글 비밀번호를 주면 위험하니, 대신 구글이 '이 앱은 네 사진만 볼 수 있다'는 임시 출입증(토큰)을 발급합니다. 앱은 그 토큰으로만 사진에 접근하고, 비밀번호는 결코 모릅니다.",
      why: "'인증(누구냐)'이 아니라 '인가(무엇을 허락하냐)' 프로토콜이라는 점이 최다 오해·출제 포인트입니다. 4개 역할과 권한부여 흐름, 그리고 인증을 얹은 OIDC와의 관계가 핵심입니다.",
      mechanism: "역할: 리소스 소유자(사용자), 클라이언트(앱), 인가 서버, 리소스 서버. 흐름(Authorization Code): 사용자가 인가 서버에서 동의 → 인가 코드 발급 → 클라이언트가 코드를 액세스 토큰으로 교환 → 토큰으로 리소스 접근. 토큰은 범위(scope)·수명 제한. 인증 정보(신원)가 필요하면 OIDC(ID 토큰)를 얹음.",
      map: [
        { as: "비밀번호 대신 출입증", real: "액세스 토큰", note: "위임" },
        { as: "이 방만 들어가기", real: "스코프(권한 범위)", note: "최소 권한" },
        { as: "동의 → 코드 → 토큰", real: "Authorization Code Flow", note: "표준 흐름" },
        { as: "누구인지까지 확인", real: "OIDC(ID 토큰)", note: "인증 확장" },
      ],
      usage: "소셜 로그인·API 연동의 사실상 표준입니다. 시험은 '인가 O·인증 X', 4역할·Authorization Code 흐름, OIDC와의 구분입니다.",
      links: [
        { topic: "패스키(Passkey)", how: "인증(신원 확인) 축의 최신 방식과 대비됩니다." },
        { topic: "간편인증 인터페이스 가이드라인", how: "국내 간편인증 연동의 표준 축입니다." },
      ],
      exam: "OAuth 2.0은 비밀번호 공유 없이 스코프 제한 토큰으로 권한을 위임하는 인가 프로토콜로, 신원 확인이 필요하면 OIDC를 결합한다.",
    }, image: "/concept/book/sc-oauth.png", easy: "OAuth 2.0은 제3자 앱에게 '내 비밀번호를 주지 않고' 내 자원 접근 권한만 위임하는 개방형 표준입니다. '카카오로 로그인'을 누르면 그 앱이 내 카카오 비밀번호는 모른 채 프로필만 받아가는 게 바로 이것이죠. 4대 구성요소 — 자원 소유자(나), 클라이언트(제3자 앱), 권한 서버(토큰 발급), 자원 서버(자원 보관). 흐름은 클라이언트가 권한 요청 → 권한 서버가 액세스 토큰 발급 → 자원 서버가 토큰으로 검증 후 자원 제공입니다. 권한 부여 방식 4종 — Authorization Code Grant(가장 안전·대표적, 인가 코드를 거쳐 토큰 발급), Implicit Grant(코드 없이 바로 토큰), Password Credentials Grant(믿을 수 있는 관계에서 ID/PW로), Client Credentials Grant(클라이언트=소유자일 때). 액세스 토큰이 만료되면 리프레시 토큰으로 재발급합니다. 가장 중요한 시험 포인트는 'OAuth는 인증(Authentication)이 아니라 인가(Authorization) 프로토콜'이라는 점, 그리고 Authorization Code Grant가 표준이라는 것입니다." },
"sc-passkey": {
    guide: {
      hook: "비밀번호를 아예 없앤 로그인 — 피싱당할 비밀번호 자체가 없습니다.",
      scene: "기기에 개인키를, 서비스에 공개키를 두고, 로그인할 때 생체(지문·얼굴)로 개인키 잠금을 풀어 서명합니다. 서버로 가는 건 서명뿐 — 훔칠 비밀번호가 없으니 피싱·유출·재사용 공격이 원천 무력화됩니다.",
      why: "FIDO2/WebAuthn 기반의 비밀번호 대체 표준으로, '공개키 암호를 로그인에 적용'한 발상이 핵심입니다. 피싱 저항성(도메인 바인딩)과 기기 간 동기화(클라우드 패스키)가 출제 포인트입니다.",
      mechanism: "등록: 기기가 서비스별 키쌍 생성 → 공개키를 서버에 저장, 개인키는 기기 보안영역(TPM·Secure Enclave)에. 인증: 서버가 챌린지 전송 → 기기가 생체로 개인키 잠금 해제 후 챌린지 서명 → 서버가 공개키로 검증. 개인키는 기기를 안 떠나고, 서명은 등록 도메인에만 유효(피싱 저항). 동기화 패스키는 클라우드로 기기 간 공유.",
      map: [
        { as: "훔칠 비밀번호 없음", real: "지식 요소 제거", note: "피싱·유출 무력화" },
        { as: "기기에 개인키·서버에 공개키", real: "FIDO2/WebAuthn 키쌍", note: "" },
        { as: "지문으로 개인키 잠금 해제", real: "생체 로컬 인증", note: "존재+소유" },
        { as: "그 사이트에만 통하는 서명", real: "도메인 바인딩", note: "피싱 저항 근거" },
      ],
      usage: "구글·애플·MS가 기본 지원하는 차세대 로그인입니다. 시험은 비밀번호 대비 이점(피싱 저항), FIDO2/WebAuthn 구조, OAuth(인가)와의 축 구분입니다.",
      links: [
        { topic: "생체 인증(텔레바이오 인증)", how: "생체로 개인키를 잠그는 로컬 인증 요소입니다." },
        { topic: "OAuth(Open Authorize) 2.0", how: "인가(위임)와 대비되는 인증(신원) 축입니다." },
      ],
      exam: "패스키는 FIDO2/WebAuthn 기반 공개키 인증으로 비밀번호를 제거해 피싱·유출을 원천 차단하며, 개인키는 기기에 두고 생체로 잠금 해제한다.",
    }, image: "/concept/book/sc-passkey.png", easy: "패스키(Passkey)는 비밀번호를 아예 없애는(Passwordless) FIDO 기반 인증입니다. 비밀번호는 유출되고 피싱당하고 재사용되는 문제가 많은데, 패스키는 공개키 암호로 이를 해결합니다. 원리 — 개인키는 내 기기(Authenticator, 예: Face ID·Windows Hello)에 안전하게 보관되고, 공개키만 서비스 서버(Relying Party)에 등록됩니다. 로그인할 때 기기가 개인키로 서명하고 서버는 공개키로 검증하죠. 서버에 비밀번호 자체가 없으니 서버가 털려도 샐 게 없고, 가짜 사이트에는 서명을 안 하니 피싱에도 강합니다. 구성요소 — Authenticator(신원 증명 장치), Client Application(프론트엔드), Relying Party(백엔드), Metadata repository(인증기 제조사·모델 식별). 표준은 FIDO2 = WebAuthn(브라우저 API) + CTAP(인증기 프로토콜)입니다. '개인키는 기기에, 공개키만 서버에 → 유출·피싱에 강함'이 핵심 시험 포인트입니다." },
"sc-asm": {
    guide: {
      hook: "공격자 시점에서 '우리 조직이 밖으로 드러낸 모든 문'을 찾아 관리하는 것입니다.",
      scene: "회사가 모르고 열어 둔 창문(방치된 서버·테스트 도메인·노출된 API·클라우드 버킷)을 공격자는 스캔으로 찾아냅니다. ASM은 그걸 공격자보다 먼저, 지속적으로 발견해 줄여 나갑니다.",
      why: "'경계가 사라진 시대엔 자산 목록조차 불완전하다'는 문제의식이 핵심입니다. 지속적 발견(외부 정찰 시점)과 우선순위 축소가 위협 헌팅·취약점 관리와 연결됩니다.",
      mechanism: "단계: 발견(도메인·IP·인증서·클라우드·SaaS 등 외부 노출 자산 지속 탐지, 그림자 IT 포함) → 목록화·분류 → 위험 평가(취약점·노출도) → 우선순위 기반 축소·조치 → 지속 모니터링. EASM(외부), CAASM(사이버 자산 통합), 공급자까지 보면 확장.",
      map: [
        { as: "모르고 열어 둔 창문", real: "미인지 노출 자산(그림자 IT)", note: "핵심 대상" },
        { as: "공격자보다 먼저 찾기", real: "외부 정찰 시점 발견", note: "지속성" },
        { as: "위험한 문부터 닫기", real: "우선순위 기반 축소", note: "" },
        { as: "계속 순찰", real: "지속 모니터링", note: "일회성 아님" },
      ],
      usage: "클라우드·SaaS 확산으로 자산이 흩어진 조직의 필수 관리입니다. 시험은 'ASM = 공격 표면의 지속 발견·축소'와 취약점 관리·위협 헌팅과의 관계입니다.",
      links: [
        { topic: "위협 헌팅(Threat Hunting)", how: "노출 자산을 근거로 능동 탐지를 수행합니다." },
        { topic: "위협 모델링(Threat Modeling)", how: "공격 표면을 설계 단계에서 분석하는 접근입니다." },
      ],
      exam: "ASM은 조직이 외부에 노출한 모든 자산을 공격자 관점에서 지속 발견·평가·축소하는 관리 활동으로, 그림자 IT까지 포함해 공격 표면을 줄인다.",
    }, image: "/concept/book/sc-asm.png", easy: "공격 표면 관리(ASM)는 조직이 공격받을 수 있는 모든 지점(공격 표면)을 '공격자 관점(Outside-In)'에서 지속적으로 찾아내 관리하는 보안 프로세스입니다. 회사가 모르는 사이 열려 있는 클라우드 저장소, 방치된 서브도메인, 노출된 API 같은 것들이죠. 프로세스 4단계 — ① 디지털 자산 발견(GitHub·클라우드·OSINT·다크웹까지 뒤져 네트워크에 연결된 모든 자산 식별) ② 자산 식별·분류(중요도·컴플라이언스로 등급화) ③ 지속 보안 모니터링(CVSS·CWE로 위험도 산정·우선순위) ④ 악성자산·사고 모니터링. 최소화 대응은 인프라(제로 트러스트·마이크로 세그멘테이션), 데이터(암복호화·PETs), 소프트웨어(DevSecOps·시큐어코딩), 사용자(모의해킹) 측면으로 나뉩니다. 외부 노출 표면에 특화한 것을 EASM이라 합니다. '조직이 인지 못한 그림자 자산(Shadow IT)까지 공격자 시선으로 찾는다'가 시험 포인트입니다." },
"sc-siem": {
    guide: {
      hook: "흩어진 로그를 한곳에 모아 상관분석으로 '사고의 징후'를 잡아내는 보안 관제의 두뇌입니다.",
      scene: "방화벽·서버·단말이 각자 일지를 쓰면 큰 그림이 안 보입니다. SIEM은 모든 일지를 한 상황실로 모아 '이 실패 로그인 + 저 비정상 접속'을 이어 붙여 하나의 사건으로 알려 줍니다. 차세대는 여기에 AI·자동대응(SOAR)을 얹습니다.",
      why: "'수집·정규화·상관분석·경보'라는 파이프라인과, 전통 SIEM의 한계(오탐·수동 대응)를 UEBA·SOAR·클라우드로 극복하는 '차세대'의 방향이 출제 포인트입니다.",
      mechanism: "파이프라인: 로그 수집(다양한 소스) → 정규화·저장 → 상관분석 규칙·통계로 위협 탐지 → 경보·대시보드. 차세대 강화: UEBA(사용자·개체 행위 이상탐지 — ML), SOAR(플레이북 기반 자동 대응), 클라우드·확장성, 위협 인텔리전스 연동. XDR과 경계가 흐려지는 추세.",
      map: [
        { as: "모든 일지를 한 상황실로", real: "로그 수집·정규화", note: "" },
        { as: "흩어진 단서 이어 붙이기", real: "상관분석(Correlation)", note: "핵심" },
        { as: "평소와 다른 행동 감지", real: "UEBA(행위 이상탐지)", note: "차세대" },
        { as: "각본대로 자동 조치", real: "SOAR 연동", note: "대응 자동화" },
      ],
      usage: "보안관제센터(SOC)의 중심 플랫폼입니다. 시험은 SIEM 파이프라인, 차세대 강화(UEBA·SOAR·클라우드), XDR과의 관계입니다.",
      links: [
        { topic: "XDR(eXtended Detection Response)", how: "탐지·대응을 통합해 SIEM과 수렴합니다." },
        { topic: "위협 헌팅(Threat Hunting)", how: "SIEM 데이터를 근거로 능동 탐지를 수행합니다." },
      ],
      exam: "차세대 SIEM은 로그를 수집·정규화·상관분석해 위협을 탐지하는 관제 플랫폼으로, UEBA·SOAR·클라우드를 결합해 오탐·수동대응 한계를 극복한다.",
    }, image: "/concept/book/sc-siem.png", easy: "차세대 SIEM은 방화벽·서버·앱이 쏟아내는 대규모 로그를 AI·UEBA로 분석해 지능형 위협을 탐지하고, SOAR로 자동 대응까지 하는 클라우드 보안 플랫폼입니다. 기존 SIEM이 정해진 룰(규칙)로 로그를 상관분석했다면, 차세대 SIEM은 여기에 다섯 기술을 결합합니다 — AI/ML(정상·비정상 분류·이상 탐지), UEBA(사용자·엔티티 행위 프로파일링으로 내부자 위협·계정 탈취 탐지), SOAR(플레이북으로 대응 자동화해 대응 시간 단축), XDR(엔드포인트·네트워크·클라우드 교차분석), TIP(최신 위협정보 IoC 매칭). 수집 로그는 네트워크 장치·엔드포인트·DB·모바일 전 계층에서 모읍니다. 이 위에서 위협 헌팅(수집→가설 수립→헌팅→탐지자 개발→위협 탐지→대응)이 돌아갑니다. '룰 기반을 넘어 AI/UEBA/SOAR로 알려지지 않은 위협까지 능동 탐지·자동 대응'이 핵심 시험 포인트입니다." },
"sc-threat-hunting": {
    guide: {
      hook: "경보를 기다리지 않고 '이미 들어와 숨어 있다'고 가정해 능동적으로 찾아 나섭니다.",
      scene: "경보가 울리길 기다리는 경비(수동 탐지)와 달리, 형사가 '범인이 잠입했다'는 가설을 세우고 단서를 뒤지는 수사입니다. APT처럼 시그니처에 안 걸리는 잠복 위협을 사람이 가설·데이터로 파냅니다.",
      why: "'탐지 실패를 전제한 능동 탐지'라는 발상 전환이 핵심입니다. 가설 기반 접근과 MITRE ATT&CK(공격 전술·기법 지식베이스) 활용, EDR/SIEM 데이터 의존이 출제 포인트입니다.",
      mechanism: "절차: 가설 수립(위협 인텔·ATT&CK 기법 기반 '이런 공격이 있었다면?') → 데이터 수집·조사(EDR·SIEM·네트워크 로그) → 이상 탐지·검증 → 확인 시 대응, 미확인 시 탐지 규칙으로 자동화(피드백). 사람의 분석력 + 도구가 결합된 반복 프로세스.",
      map: [
        { as: "숨었다고 가정하고 수색", real: "가설 기반 능동 탐지", note: "탐지 실패 전제" },
        { as: "범행 수법 카탈로그", real: "MITRE ATT&CK 활용", note: "" },
        { as: "단서 창고 뒤지기", real: "EDR·SIEM 데이터 조사", note: "" },
        { as: "찾은 수법을 규칙화", real: "탐지 자동화 피드백", note: "선순환" },
      ],
      usage: "성숙한 SOC의 고급 활동입니다. 시험은 '수동 탐지 vs 능동 헌팅', 가설 기반 절차, ATT&CK·EDR 연계입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "헌팅이 겨냥하는 대표적 잠복 위협입니다." },
        { topic: "EDR(Endpoint Detection and Response)", how: "헌팅의 핵심 데이터·조사 도구입니다." },
      ],
      exam: "위협 헌팅은 침해를 전제로 가설을 세워 EDR·SIEM 데이터에서 잠복 위협을 능동 탐지하는 활동으로, MITRE ATT&CK를 활용하고 결과를 탐지 규칙으로 자동화한다.",
    }, image: "/concept/book/sc-threat-hunting.png", easy: "위협 헌팅(Threat Hunting)은 경보가 울리길 기다리는 게 아니라, 보안 통제를 이미 우회해 숨어든 위협을 '가설을 세워 선제적으로 찾아 나서는' 프로세스입니다. 백신·방화벽을 통과한 공격은 조용히 잠복하는데, 이를 능동적으로 사냥하는 거죠. 절차 — 수집(엔드포인트 포함 모든 데이터) → 가설 수립(MITRE ATT&CK·사이버 킬 체인 모델로 '이런 공격이 있을 것' 가정) → 헌팅(가설 기반 반복 분석) → 탐지자 개발(위협 행동을 프로그램화·자동화) → 위협 탐지 → 조사·대응. 기술적으로는 EDR(엔드포인트 행위 탐지), SIEM(전체 데이터 분석·가시화), Cyber Kill Chain(공격 단계별 분석)을 활용합니다. Active(능동)와 Passive Threat Hunting으로 나뉘고, 핵심은 '탐지 룰이 없는 미지의 위협도 가설과 데이터로 찾아낸다'는 선제성입니다. 차세대 SIEM의 핵심 활동으로 함께 출제됩니다." },
"sc-threat-modeling": {
    guide: {
      hook: "'우리 시스템을 어떻게 공격할까'를 설계 단계에서 미리 그려 보는 보안 설계 기법입니다.",
      scene: "집을 짓기 전 도둑 입장에서 '어디로 들어올까'를 따져 창문·자물쇠를 배치하는 것입니다. 자산·진입점·신뢰경계를 그린 뒤, 위협을 체계적으로 나열하고 대응을 설계에 반영합니다.",
      why: "'사후 점검이 아니라 설계 단계 보안(Shift Left)'의 대표 기법이라는 점이 핵심입니다. STRIDE·DREAD·공격 트리 같은 방법론과 데이터 흐름도(DFD) 기반 절차가 출제 포인트입니다.",
      mechanism: "절차: ①대상 분해(DFD로 자산·프로세스·데이터흐름·신뢰경계 도식) ②위협 식별(STRIDE — 위장/변조/부인/정보노출/서비스거부/권한상승) ③위험 평가(DREAD 등 우선순위) ④완화 설계·검증. 공격자 관점 모델링으로 설계 결함을 조기에 제거.",
      map: [
        { as: "집 도면에 침입 경로 표시", real: "DFD·신뢰경계 분석", note: "①" },
        { as: "6가지 침입 수법 점검", real: "STRIDE 위협 분류", note: "②" },
        { as: "어느 위험부터 막을까", real: "DREAD 우선순위", note: "③" },
        { as: "설계에 자물쇠 반영", real: "완화 설계·검증", note: "④" },
      ],
      usage: "SDLC 설계 단계의 보안 활동입니다. 시험은 STRIDE 6요소, DFD 기반 절차, DevSecOps·시큐어 코딩과의 관계입니다.",
      links: [
        { topic: "공격 표면 관리(Attack Surface Management)", how: "공격 표면 분석을 운영 단계로 확장한 개념입니다." },
        { topic: "시큐어 코딩(Secure Coding)", how: "모델링 결과를 코드 수준에서 예방합니다." },
      ],
      exam: "위협 모델링은 DFD로 시스템을 분해하고 STRIDE로 위협을 식별해 설계 단계에서 완화책을 마련하는 보안 설계 기법으로, Shift Left를 구현한다.",
    }, image: "/concept/book/sc-threat-modeling.png", easy: "위협 모델링(Threat Modeling)은 시스템을 만들 때 '어떤 공격이 가능한지'를 설계 단계에서 미리 식별·분석·평가하고 대응책을 세우는 프로세스입니다. 다 만든 뒤가 아니라 설계 때 위협을 그려보는 거죠. 절차는 보안 요구사항 정의 → 위협 식별 → 분석·평가 → 완화 계획 → 검증·반복(5단계). 대표 기법 3가지 — STRIDE(위협을 6가지로 분류: 스푸핑·변조·부인·정보유출·서비스거부·권한상승), DREAD(위험도를 점수화: 피해·재현성·공격가능성·영향 사용자·발견 용이성), PASTA(공격자 관점 7단계 프로세스). 위협을 그리는 도구가 DFD(데이터 흐름도)로, 외부 개체·프로세스·데이터 저장소·데이터 흐름·신뢰 경계(Trust Boundary)로 구성됩니다. 특히 신뢰 수준이 다른 영역이 만나는 '신뢰 경계'에서 대부분의 취약점이 발생합니다. 'STRIDE=분류, DREAD=점수화, PASTA=프로세스'와 신뢰 경계 개념이 시험 포인트입니다." },
"sc-waap": {
    guide: {
      hook: "웹 방화벽(WAF)을 넘어 'API·봇·DDoS까지' 묶어 지키는 차세대 웹·API 보호입니다.",
      scene: "예전엔 웹 앱만 WAF로 막으면 됐지만, 지금은 트래픽의 대부분이 API고 자동화 봇 공격도 많습니다. WAAP은 WAF에 API 보호·봇 관리·DDoS 방어를 한 세트로 묶어 클라우드에서 제공합니다.",
      why: "'API 우선 시대에 WAF만으론 부족'하다는 문제의식이 핵심입니다. 4대 구성요소와 클라우드 서비스형 제공, 그리고 OWASP API Security와의 연결이 출제 포인트입니다.",
      mechanism: "4대 기능: WAF(SQLi·XSS 등 웹 공격 차단), API 보호(스키마 검증·비정상 호출 탐지·OWASP API Top 10 대응), 봇 관리(자동화 트래픽 식별·크리덴셜 스터핑 차단), DDoS 방어(L7). 대개 클라우드(엣지)에서 인라인 제공하며 ML로 이상 탐지.",
      map: [
        { as: "웹 공격 차단 기본", real: "WAF", note: "SQLi·XSS" },
        { as: "API 규격 위반 감지", real: "API 보호", note: "핵심 추가" },
        { as: "자동화 봇 걸러내기", real: "봇 관리", note: "크리덴셜 스터핑" },
        { as: "요청 폭주 흡수", real: "L7 DDoS 방어", note: "" },
      ],
      usage: "MSA·API 중심 서비스의 표준 보호입니다. 시험은 WAF와의 차이(API·봇·DDoS 통합), OWASP API Security와의 관계입니다.",
      links: [
        { topic: "OWASP Top 10:2025", how: "웹·API 위협 목록을 방어 대상으로 삼습니다." },
        { topic: "DoS(Denial of Service)", how: "L7 DDoS가 WAAP의 방어 범위입니다." },
      ],
      exam: "WAAP은 WAF·API 보호·봇 관리·DDoS 방어를 통합한 클라우드형 웹·API 보호로, API 우선 환경에서 WAF만으로 부족한 위협을 함께 방어한다.",
    }, image: "/concept/book/sc-waap.png", easy: "WAAP(웹 애플리케이션·API 보호)은 기존 웹방화벽(WAF)에 API 보안·봇 방어 등을 더해 웹 환경의 공격을 종합적으로 막는 솔루션입니다. API 경제와 클라우드가 확산되면서 API 자체가 새로운 공격 표면이 됐는데, 전통 WAF만으로는 부족해 등장했죠. 주요 기능 4가지 — 웹 애플리케이션 방화벽(WAF: 웹 공격·정보 유출·웹 변조 방어), DDoS 보호, API 보호(API 탈취 방어), Bot 보호(무차별 대입·크리덴셜 스터핑·핑거프린팅 차단, RASP 런타임 자기방어). 기존 시스템과 비교하면 — Firewall은 Layer 3에서 IP·Port로 접근제어, WAF는 Layer 7에서 웹 공격 방어, WAAP는 Layer 7에서 웹 + API + 봇을 클라우드·사용자행위 기반으로 종합 방어합니다. 'WAF의 확장판으로 API·봇 보호까지 통합', 'API가 새 공격면'이 시험 포인트입니다." },
"sc-edr": {
    guide: {
      hook: "백신이 '아는 악성코드'를 막는다면, EDR은 '단말의 행위'를 기록·분석해 미지의 공격까지 잡습니다.",
      scene: "CCTV 없이 도난 신고만 받던 매장에, 상시 녹화 CCTV(행위 기록)와 실시간 분석을 붙이는 것입니다. PC·서버에서 일어나는 프로세스·파일·네트워크 행위를 계속 기록해, 이상 패턴을 탐지하고 원격으로 격리·차단합니다.",
      why: "'시그니처(백신)의 한계 → 행위 기반 탐지·대응(EDR)'이라는 전환이 핵심입니다. 가시성·탐지·대응·조사(포렌식)의 4역할과, 여러 계층으로 확장한 XDR과의 관계가 출제 포인트입니다.",
      mechanism: "단말 에이전트가 프로세스 생성·파일·레지스트리·네트워크 행위를 지속 수집 → 행위 분석·위협 인텔·ML로 이상 탐지(파일리스·APT 포함) → 대응(프로세스 종료·단말 격리·롤백) → 조사(타임라인·근본원인). 시그니처 없이 '무엇을 했나'로 판단하는 게 백신과의 차이.",
      map: [
        { as: "상시 녹화 CCTV", real: "단말 행위 지속 기록", note: "가시성" },
        { as: "평소와 다른 행동 포착", real: "행위 기반 탐지", note: "미지 공격·파일리스" },
        { as: "원격으로 문 잠그기", real: "단말 격리·프로세스 종료", note: "대응" },
        { as: "사건 경위 재구성", real: "타임라인 조사", note: "포렌식" },
      ],
      usage: "APT·랜섬웨어 대응의 핵심 단말 방어입니다. 시험은 '백신 vs EDR'(시그니처 vs 행위), 4역할, XDR로의 확장입니다.",
      links: [
        { topic: "XDR(eXtended Detection Response)", how: "EDR을 네트워크·클라우드로 확장한 통합형입니다." },
        { topic: "APT(Advanced Persistent Threat) 공격", how: "EDR이 겨냥하는 잠복·내부이동을 탐지합니다." },
      ],
      exam: "EDR은 단말의 행위를 지속 수집·분석해 시그니처 없는 위협까지 탐지하고 격리·조사하는 방어로, 백신의 한계를 넘어 XDR로 확장된다.",
    }, image: "/concept/book/sc-edr.png", easy: "EDR(엔드포인트 탐지·대응)은 PC·서버 같은 엔드포인트의 동작을 지속적으로 모니터링해 위협을 탐지하고 대응하는 보안 솔루션입니다. 기존 백신이 '알려진 악성코드 시그니처'만 잡았다면, EDR은 '행위'를 분석해 알려지지 않은 공격도 잡습니다. 프로세스 4단계 — ① Predict(위협 예측·위험 평가·기본 보안 태세) ② Prevent(시스템 강화·격리·공격 방지) ③ Detect(사고 탐지·위험 확인·우선순위 지정) ④ Response(치료·정책 변경·사건 조사). 이 사이클은 지속적 가시성·검증(Continuous Visibility and Verification)으로 돌아갑니다. 핵심 도구로 알려진 침해지표(IOC, Indicator of Compromise)와 행위 분석을 써서 침해를 조기에 찾아냅니다. XDR과의 구분이 중요한데 — EDR은 엔드포인트만 보고, XDR은 EDR을 확장해 네트워크·클라우드·이메일까지 통합 분석합니다. '시그니처가 아닌 행위 기반 탐지', 'IOC 활용', 'XDR로의 확장'이 시험 포인트입니다." },
"sc-xdr": {
    guide: {
      hook: "단말(EDR)에 네트워크·이메일·클라우드까지 '탐지·대응을 하나로 통합'한 확장형입니다.",
      scene: "EDR이 단말 CCTV라면, XDR은 매장·주차장·창고 CCTV를 한 관제실에서 통합해 보는 것입니다. 여러 계층의 신호를 자동으로 상관분석해, 흩어진 단서를 하나의 공격 스토리로 엮습니다.",
      why: "'사일로(EDR·NDR·이메일 각자) → 통합 상관분석'이 핵심 가치입니다. SIEM과의 차이(SIEM=로그 수집·개방형, XDR=벤더 통합·탐지대응 특화)가 최다 출제 포인트입니다.",
      mechanism: "다계층 텔레메트리(단말·네트워크·이메일·클라우드·ID)를 통합 수집 → 교차 상관분석으로 단일 인시던트로 그룹화 → 자동 대응(플레이북)·우선순위화. EDR 대비 범위 확장, SIEM 대비 사전 통합·탐지대응 최적화. 개방형(Open XDR) vs 단일 벤더형(Native XDR) 구분.",
      map: [
        { as: "여러 CCTV를 한 관제실로", real: "다계층 텔레메트리 통합", note: "" },
        { as: "흩어진 단서를 한 사건으로", real: "교차 상관분석", note: "핵심" },
        { as: "각본대로 자동 조치", real: "자동 대응(플레이북)", note: "" },
        { as: "로그 창고(SIEM)와 다름", real: "탐지·대응 특화", note: "구분 포인트" },
      ],
      usage: "여러 보안 도구를 운영하는 조직의 통합 탐지·대응입니다. 시험은 EDR→XDR 확장, SIEM과의 차이(개방·수집 vs 통합·대응), Open vs Native입니다.",
      links: [
        { topic: "EDR(Endpoint Detection and Response)", how: "XDR은 EDR을 다계층으로 확장한 것입니다." },
        { topic: "차세대 SIEM(Security Information and Event Management)", how: "역할이 겹치며 수렴하는 관제 플랫폼입니다." },
      ],
      exam: "XDR은 단말·네트워크·이메일·클라우드 신호를 통합 상관분석해 하나의 인시던트로 탐지·대응하는 확장형으로, 로그 수집 중심 SIEM과 달리 탐지·대응에 특화된다.",
    }, image: "/concept/book/sc-xdr.png", easy: "XDR(확장 탐지·대응)은 EDR을 확장해, 엔드포인트뿐 아니라 네트워크·이메일·클라우드 워크로드까지 단일 플랫폼(Data Lake)에 통합해 교차 분석하는 보안 솔루션입니다. EDR이 '엔드포인트만' 봤다면, XDR은 여러 계층의 보안 데이터를 한데 모아 '이 엔드포인트의 이상 행위가 저 네트워크 트래픽·그 이메일과 연결된 하나의 공격'임을 밝혀냅니다(Root-cause Analysis). SIEM·SOAR와 비교하면 — SIEM은 로그를 수집·상관분석해 위협을 탐지하지만 대응은 전문가 주도, SOAR는 대응을 자동화, XDR은 다계층 데이터를 통합해 정밀 탐지 + AI/ML 기반 자동 대응까지 합니다. 측정 지표로 MTTD(평균 탐지 시간)·MTTR(평균 대응 시간) 단축을 봅니다. 단점은 도입 비용이 비싸다는 것. 'EDR의 확장(엔드포인트 → 다계층 통합)', 'SIEM/SOAR와의 역할 구분'이 시험 포인트입니다." },
"sc-dmarc": {
    guide: {
      hook: "'이 메일이 진짜 그 도메인에서 왔나'를 검증해 사칭 메일을 걸러내는 이메일 인증 정책입니다.",
      scene: "봉투에 찍힌 발신 주소(From)는 위조가 쉬워서 피싱·스팸이 남 행세를 합니다. DMARC는 SPF(발송 서버 대조)와 DKIM(서명 검증) 결과를 발신 도메인과 '정렬(alignment)'해 확인하고, 실패한 메일을 어떻게 처리할지(격리·거부) 도메인 주인이 정책으로 선언합니다.",
      why: "SPF·DKIM만으론 From 위조를 못 막는 틈을 'alignment + 정책 + 리포트'로 메운다는 점이 핵심입니다. p=none→quarantine→reject 단계적 강화와 리포트 기반 가시성이 출제 포인트입니다.",
      mechanism: "SPF(발송 IP가 도메인 SPF 레코드에 있나)·DKIM(본문 서명이 유효한가) 중 하나 이상 통과 + 그 도메인이 From과 정렬되면 인증 성공. DMARC 정책(DNS TXT)이 실패 메일 처리를 지정: p=none(관찰·리포트만)→quarantine(스팸함)→reject(거부). aggregate/forensic 리포트로 사칭 시도 가시화.",
      map: [
        { as: "발신 주소 위조 차단", real: "From 도메인 정렬(alignment)", note: "핵심" },
        { as: "발송 서버 명부 대조", real: "SPF", note: "" },
        { as: "본문에 도장 검증", real: "DKIM", note: "" },
        { as: "실패 메일 처리 선언", real: "정책 p=none→reject", note: "단계 강화" },
      ],
      usage: "기업 도메인 사칭(BEC)·피싱 방어의 표준입니다. 시험은 SPF·DKIM·DMARC 관계, alignment 개념, 정책 단계와 리포트입니다.",
      links: [
        { topic: "딥보이스(Deep Voice) 피싱", how: "사칭이라는 공통 축 — 이메일 사칭 방어입니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "협력사 사칭 메일 차단에 연결됩니다." },
      ],
      exam: "DMARC는 SPF·DKIM 결과를 From 도메인과 정렬해 검증하고 실패 메일 처리 정책(none→quarantine→reject)과 리포트를 제공하는 이메일 사칭 방지 표준이다.",
    }, image: "/concept/book/sc-dmarc.png", easy: "DMARC는 이메일이 '진짜 그 도메인에서 보낸 것인지'를 검증해 스푸핑·피싱 메일을 막는 인증 프로토콜입니다(RFC 7489). 두 가지 기존 기술을 묶어서 씁니다 — SPF(발신 서버 정보를 DNS에 미리 등록해두고, 메일에 찍힌 발송자가 실제 서버와 일치하는지 확인)와 DKIM(메일 헤더에 디지털 서명을 붙여 내용이 위·변조되지 않았음을 보장). DMARC는 이 둘의 검증 결과를 바탕으로 '실패한 메일을 어떻게 처리할지(차단·격리·통과)'를 발신 도메인이 DNS 정책으로 지정하고, 처리 결과를 보고서로 받습니다. 흐름 — 발신측이 DMARC 정책을 DNS에 등록 → 수신측이 SPF·DKIM 검증 → 실패 시 차단·격리 후 보고서 발송. 'SPF(발신 IP 검증) + DKIM(내용 무결성 서명)을 결합해 도메인 위조 메일을 판별·차단'이 핵심 시험 포인트입니다." },
"sc-cyber-deception": {
    guide: {
      hook: "공격자를 '가짜 미끼'로 유인해 탐지하고, 시간을 벌며, 수법을 관찰합니다.",
      scene: "진짜 금고 옆에 그럴듯한 가짜 금고(허니팟)를 두는 것입니다. 정상 사용자는 건드릴 일 없는 미끼 자산을 공격자가 만지는 순간, 그건 곧 침입 신호 — 오탐이 거의 없고 공격자의 도구·의도까지 드러납니다.",
      why: "'막기(방어)'가 아니라 '속여서 드러내기'라는 능동 방어 발상이 핵심입니다. 낮은 오탐률과 위협 인텔 수집, 그리고 허니팟/허니토큰/디셉션 그리드의 계층이 출제 포인트입니다.",
      mechanism: "요소: 허니팟(가짜 서버·서비스), 허니토큰(가짜 계정·문서·API 키 — 사용되면 즉시 경보), 브레드크럼(공격자를 미끼로 유도하는 흔적), 디셉션 플랫폼(내부망에 미끼를 분산 배치). 미끼 접촉 자체가 고신뢰 경보라 조기 탐지·수법 관찰·대응 시간 확보에 유리.",
      map: [
        { as: "가짜 금고", real: "허니팟", note: "가짜 자산" },
        { as: "건드리면 울리는 가짜 열쇠", real: "허니토큰", note: "고신뢰 경보" },
        { as: "미끼로 유인하는 흔적", real: "브레드크럼", note: "" },
        { as: "정상은 안 건드림", real: "낮은 오탐률", note: "핵심 이점" },
      ],
      usage: "APT·내부 이동 조기 탐지에 쓰입니다. 시험은 허니팟/허니토큰 구분, '낮은 오탐·위협 인텔 수집' 이점, 능동 방어 개념입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "내부 이동을 미끼로 조기 포착합니다." },
        { topic: "위협 헌팅(Threat Hunting)", how: "디셉션 신호를 능동 탐지에 활용합니다." },
      ],
      exam: "사이버 디셉션은 허니팟·허니토큰 등 미끼로 공격자를 유인해 조기 탐지·수법 관찰·대응 시간을 확보하는 능동 방어로, 미끼 접촉이 곧 고신뢰 경보가 된다.",
    }, image: "/concept/book/sc-cyber-deception.png", easy: "사이버 디셉션은 공격자가 시스템을 공격할 때 가짜 미끼(Decoy)로 유인해 함정(Trap)에 빠뜨리고, 그 행위를 기록·분석하는 능동적 방어 기법입니다. 방어벽을 세워 막기만 하는 게 아니라, 공격자를 속여서 진짜 시스템 대신 가짜로 끌어들이는 거죠. 구성 — Decoy(미끼: 가짜 쿠키·서버접근정보·로그인정보), Trap(함정: EndPoint·Network·OS), Deception System(탐지·포렌식). 정상 사용자는 Real System으로 가고, 악의적 사용자는 미끼에 걸려 Deception System으로 격리되어 모든 행위가 기록됩니다. 비슷한 허니팟과의 차이가 시험 포인트 — 사이버 디셉션은 내·외부를 포괄 대응하고 오탐율을 최소화(제로화)하며 자동화로 확장 가능한 반면, 허니팟은 외부 접근 중심에 로그분석 기반이라 오탐이 높고 배치가 제한적입니다. '속여서 유인·탐지하는 능동 방어', '허니팟보다 포괄적·저오탐'이 핵심입니다." },
"sc-dis": {
    guide: {
      hook: "인체 면역계처럼 위협을 스스로 탐지·격리·복원하는 자율 방어 시스템 — 가트너 전략 기술입니다.",
      scene: "감기 바이러스가 들어오면 몸이 알아서 항체를 만들고 회복하듯, 소프트웨어가 공격·장애를 스스로 감지해 격리하고 복구합니다. 사람이 일일이 대응하지 않아도 회복탄력성을 갖도록 설계합니다.",
      why: "'예방 중심'에서 '자가 치유·회복 중심'으로의 패러다임 전환이 핵심입니다. 6대 구성요소와 사이버 레질리언스와의 관계가 출제 포인트입니다.",
      mechanism: "가트너 6요소: 관측 가능성(Observability), 카오스 엔지니어링(의도적 장애 주입 테스트), 사이트 신뢰성 공학(SRE), 자동화된 사고 대응, 소프트웨어 공급망 보안, AI 증강 테스트. 이들이 결합해 결함·공격을 조기 감지하고 자동 격리·복원하는 회복탄력적 SW를 만든다.",
      map: [
        { as: "이상 징후 상시 감지", real: "관측 가능성", note: "" },
        { as: "일부러 병을 앓게 해 대비", real: "카오스 엔지니어링", note: "" },
        { as: "스스로 회복", real: "자동화된 사고 대응·SRE", note: "핵심" },
        { as: "부품 오염 차단", real: "공급망 보안", note: "" },
      ],
      usage: "가트너 전략 기술 트렌드로 제시됩니다. 시험은 6구성요소 나열과 '예방→자가치유' 전환, 사이버 레질리언스와의 관계입니다.",
      links: [
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "회복탄력성이라는 목표를 공유합니다." },
        { topic: "DevSecOps", how: "카오스·SRE·공급망 보안을 실천으로 연결합니다." },
      ],
      exam: "디지털 면역 시스템은 관측 가능성·카오스 엔지니어링·SRE·자동 대응·공급망 보안·AI 테스트로 위협을 스스로 감지·격리·복원하는 회복탄력적 SW 전략이다.",
    }, image: "/concept/book/sc-dis.png", easy: "디지털 면역 시스템(DIS)은 인체의 면역계처럼, 컴퓨터 시스템이 사이버 위협을 스스로 감지하고 복원(면역)하도록 설계된 프로토콜·시스템·기술입니다. 사람이 일일이 대응하는 게 아니라 시스템이 자가 방어·자가 치유하는 게 핵심이죠(Gartner 전략 기술). 구축을 위한 6가지 조건 — ① 관찰성(시스템 상태 모니터링으로 문제 식별) ② 인공지능 증강 테스팅(테스트 자동화·확장) ③ 카오스 엔지니어링(일부러 장애를 주입해 취약점·복원력 검증) ④ 자동 복원/교정(모니터링+자동 복구를 앱에 내장) ⑤ 사이트 신뢰성 엔지니어링(사람 개입 최소화로 안정성·가동시간 극대화) ⑥ 소프트웨어 공급망 보안(타사 SW·아웃소싱까지 보안 보장). 구성은 모니터링(악의적 활동 감시) + 보안 조치(침입탐지·암호화)입니다. '시스템이 스스로 감지·복원하는 면역'이라는 발상과 6대 조건이 시험 포인트입니다." },
"sc-cyber-resilience": {
    guide: {
      hook: "'뚫리지 않기'가 아니라 '뚫려도 버티고 빨리 회복하기' — 침해를 전제한 방어 철학입니다.",
      scene: "완벽한 방벽은 없다는 전제에서, 지진에도 무너지지 않고 빨리 복구되는 내진 설계처럼 시스템을 짓습니다. 공격을 받아도 핵심 기능을 유지하고 신속히 정상화하는 능력이 목표입니다.",
      why: "예방(Protection) 일변도의 한계를 인정하고 '식별·보호·탐지·대응·복구'의 균형으로 옮긴다는 점이 핵심입니다. NIST CSF·BCP/DRP와 연결되고, 랜섬웨어·재해 대응의 상위 개념으로 출제됩니다.",
      mechanism: "NIST CSF 5기능: 식별(자산·위험) → 보호(예방 통제) → 탐지(이상 감지) → 대응(사고 처리) → 복구(정상화·교훈 반영). 여기에 BCP(업무 연속성)·DRP(재해 복구), 불변 백업, 중복·이중화, 복원 훈련을 결합해 '버티고 회복하는' 능력을 확보.",
      map: [
        { as: "내진 설계", real: "침해 전제 회복탄력성", note: "핵심 발상" },
        { as: "예방만이 아니라 5단계 균형", real: "식별·보호·탐지·대응·복구", note: "NIST CSF" },
        { as: "무너져도 업무 지속", real: "BCP/DRP", note: "" },
        { as: "지워도 복원", real: "불변 백업·복원 훈련", note: "랜섬웨어 대응" },
      ],
      usage: "국가 기반시설·금융의 대응 전략입니다. 시험은 NIST CSF 5기능, '예방→회복' 전환, BCP/DRP·백업과의 관계입니다.",
      links: [
        { topic: "RaaS(Ransomware as a Service)", how: "이중 갈취에 백업·복원으로 버티는 근거입니다." },
        { topic: "디지털 면역 시스템(DIS, Digital Immune System)", how: "회복탄력성을 자율화한 상위 전략입니다." },
      ],
      exam: "사이버 레질리언스는 침해를 전제로 식별·보호·탐지·대응·복구의 균형을 통해 공격 속에서도 기능을 유지·회복하는 능력으로, BCP/DRP·불변 백업과 결합한다.",
    }, image: "/concept/book/sc-cyber-resilience.png", easy: "사이버 레질리언스(회복탄력성)는 예상 밖의 사이버 위협에 당하더라도, 조직이 목표 성과(outcome)를 계속 전달할 수 있는 능력입니다. 사이버 보안과의 대비가 핵심 시험 포인트입니다 — 사이버 보안은 '알려진 위협을 막는다(fail-safe, 실패하지 않게)'에 초점이라면, 레질리언스는 '뚫려도 비즈니스는 굴러가게(Safe-to-fail, 실패해도 안전하게)'에 초점입니다. 즉 '알려지지 않은, 예측 불가능한 위협'까지 전제하고, 완벽한 차단이 아니라 침해 후에도 성과를 내는 것을 목표로 합니다. 접근도 보안은 외부로부터의 방어, 레질리언스는 내부에서 구축이고, 범위도 단일 조직 vs 조직 네트워크로 넓어집니다. 구성 요소는 비즈니스 영향 분석·보안 정책 통제·종합적 테스트·매니지드 보안 도구·사이버 복구 계획입니다. 'fail-safe(보안) vs Safe-to-fail(레질리언스)' 대비가 반드시 나오는 포인트입니다." },
"sc-pec": {
    guide: {
      hook: "데이터를 '보여주지 않고도 함께 쓰는' 기술 묶음 — 프라이버시를 지키며 활용합니다.",
      scene: "여러 병원이 환자 데이터를 합쳐 연구하고 싶지만 원본은 못 줍니다. PEC은 원본을 노출하지 않고도 계산·학습·분석을 가능하게 하는 기술들의 우산 개념입니다 — 가트너가 꼽은 프라이버시 강화 계산.",
      why: "개별 기술(동형암호·MPC·연합학습·TEE)을 '프라이버시 보존 활용'이라는 목적으로 묶는 상위 개념이라는 점이 핵심입니다. 데이터 3법·가명처리를 넘어 '원본 미노출 활용'을 실현하는 기술 축으로 출제됩니다.",
      mechanism: "3범주: ①연산 중 보호 — 동형암호(암호문 상태 연산), MPC(다자간 비밀 분산 계산), TEE(신뢰 실행 환경에서 격리 처리). ②데이터 변환 — 차분 프라이버시(잡음 삽입), 합성데이터, 가명·익명화. ③분산 학습 — 연합학습(데이터를 안 모으고 모델만 교환). 목적은 '활용 가치 유지 + 프라이버시 보존'.",
      map: [
        { as: "잠근 채로 계산", real: "동형암호·MPC·TEE", note: "연산 중 보호" },
        { as: "잡음으로 개인 흐리기", real: "차분 프라이버시·합성데이터", note: "데이터 변환" },
        { as: "데이터는 두고 모델만 이동", real: "연합학습", note: "분산 학습" },
        { as: "이 모두의 우산", real: "PEC 상위 개념", note: "가트너" },
      ],
      usage: "의료·금융 데이터 협업, AI 학습에 적용됩니다. 시험은 PEC 3범주와 개별 기술 매핑, 가명처리와의 관계입니다.",
      links: [
        { topic: "동형 암호(Homomorphic Encryption)", how: "연산 중 보호를 담당하는 대표 기술입니다." },
        { topic: "기밀컴퓨팅(Confidential Computing)", how: "TEE 기반 연산 중 보호입니다." },
      ],
      exam: "PEC는 동형암호·MPC·TEE·차분 프라이버시·연합학습 등 원본을 노출하지 않고 데이터를 활용하는 프라이버시 강화 계산 기술의 상위 개념이다.",
    }, image: "/concept/book/sc-pec.png", easy: "PEC(프라이버시 강화 컴퓨팅)는 '데이터를 열어보지 않고도 안전하게 공유·활용'하게 하는 기술들의 총칭입니다. 데이터를 쓰려면 노출 위험이 있고, 보호하려면 못 쓰는 딜레마를 푸는 상위 개념이죠. 3영역으로 나뉩니다 — ① 데이터 변환(암호화): 데이터·알고리즘 자체를 변형, 재현 데이터·동형 암호·차분 프라이버시 ② 소프트웨어 Computation(분산 처리): 데이터를 나눠 처리, 다자간 컴퓨팅(MPC)·영지식 증명·연합학습 ③ 하드웨어 환경(신뢰 실행): 하드웨어 단계에서 안전 보장, 기밀 컴퓨팅(TEE). 즉 동형암호·연합학습·기밀컴퓨팅·영지식증명이 전부 PEC 우산 아래 들어갑니다. 'AI 학습에 개인정보를 쓰되 원본은 노출 안 되게' 같은 상황에 쓰입니다. Gartner 전략 기술이며, '보호하면서 활용', 3영역(데이터 변환·SW·HW)의 대표 기술 매핑이 시험 포인트입니다." },
"sc-zkp": {
    guide: {
      hook: "'비밀을 밝히지 않고도 그 비밀을 안다는 사실만 증명'하는 마법 같은 프로토콜입니다.",
      scene: "동굴 갈림길 문제로 비유됩니다 — 비밀 통로 암호를 아는 사람은, 암호를 말하지 않고도 검증자가 지정한 쪽으로 매번 나오는 것을 반복해 '나는 암호를 안다'를 증명합니다. 우연히 맞힐 확률은 반복할수록 0에 수렴합니다.",
      why: "인증에서 '비밀번호 자체를 전송하지 않는다'는 발상, 그리고 블록체인 확장·프라이버시(zk-SNARK/STARK)의 기반이라는 점이 핵심입니다. 완전성·건전성·영지식성 3속성이 출제 포인트입니다.",
      mechanism: "3속성: 완전성(참이면 정직한 증명자는 검증 통과), 건전성(거짓이면 속일 확률 무시 가능), 영지식성(검증자는 '참'이라는 사실 외 아무 정보도 못 얻음). 대화형(반복 챌린지)·비대화형(zk-SNARK — 짧은 증명, zk-STARK — 신뢰설정 불필요·양자내성)으로 구현.",
      map: [
        { as: "암호 말 안 하고 통로 시연", real: "영지식성", note: "정보 누출 0" },
        { as: "진짜면 늘 통과", real: "완전성", note: "" },
        { as: "가짜는 못 속임", real: "건전성", note: "반복으로 확률↓" },
        { as: "짧게 한 번에 증명", real: "zk-SNARK/STARK", note: "비대화형" },
      ],
      usage: "익명 인증, 블록체인 프라이버시 코인·롤업(확장)에 쓰입니다. 시험은 3속성, 대화형/비대화형, 인증에서 비밀 미전송 이점입니다.",
      links: [
        { topic: "블록체인 암호기술 가이드라인", how: "zk 롤업·프라이버시의 기반 기술입니다." },
        { topic: "PEC(Privacy-Enhancing Computation)", how: "프라이버시 보존 증명 기술 축입니다." },
      ],
      exam: "영지식증명은 비밀 자체를 노출하지 않고 그 진위만 증명하는 프로토콜로, 완전성·건전성·영지식성을 만족하며 익명 인증·블록체인 확장에 쓰인다.",
    }, image: "/concept/book/sc-zkp.png", easy: "영지식증명(ZKP)은 어떤 정보를 '직접 공개하지 않고도' 그 명제가 참임을 증명하는 암호학적 기법입니다. 예를 들어 비밀번호를 알려주지 않고도 '내가 비밀번호를 안다'는 사실만 증명하는 거죠. 교재의 동굴 예시 — 갈림길(C·D)로 막힌 비밀 문이 있는 동굴에서, Alice가 키를 가졌음을 증명하려면 Bob이 요청한 방향(C 또는 D)으로 매번 나오면 됩니다. 키가 있으면 어느 방향이든 나올 수 있지만, 키가 없으면 우연히 맞을 확률이 50%라서, 여러 번 반복하면 사실상 키 보유가 증명됩니다(키 자체는 안 보여줌). 3대 성질 [완건영] — 완전성(참이면 정직한 증명자가 검증자를 납득시킴), 건전성(거짓이면 어떤 부정직한 증명자도 못 속임), 영지식성(검증자는 참·거짓 외엔 아무것도 못 앎). 참여자는 증명자(Prover)와 검증자(Verifier)입니다. zk-SNARK 방식으로 블록체인·프라이버시에 쓰이며, 3대 성질이 시험 단골입니다." },
"sc-confidential-computing": {
    guide: {
      hook: "'사용 중(in-use) 데이터'를 하드웨어 격리 구역(TEE)에서 처리해 노출을 막습니다.",
      scene: "데이터는 저장 중(암호화)·전송 중(TLS)엔 보호되지만, CPU에서 '처리되는 순간'엔 평문으로 노출됩니다. 기밀컴퓨팅은 CPU 안에 외부(OS·관리자·클라우드 사업자)도 못 들여다보는 금고방(TEE)을 만들어 그 안에서만 처리합니다.",
      why: "저장·전송에 이은 '세 번째 상태(사용 중) 보호'라는 위치가 핵심입니다. TEE·원격 증명(Attestation) 개념과 동형암호와의 비교(성능 vs 신뢰 근거)가 출제 포인트입니다.",
      mechanism: "CPU가 암호화된 격리 영역(Enclave)을 생성 — Intel SGX·TDX, AMD SEV, ARM CCA. 코드·데이터는 엔클레이브 안에서만 복호·처리되고 외부는 접근 불가. 원격 증명(Attestation)으로 '진짜 정품 TEE에서 지정 코드가 돈다'를 검증. 동형암호보다 빠르지만 하드웨어 신뢰(및 부채널)가 전제.",
      map: [
        { as: "CPU 안 금고방", real: "TEE·엔클레이브", note: "사용 중 보호" },
        { as: "관리자도 못 봄", real: "외부 접근 차단", note: "클라우드 신뢰 문제 해결" },
        { as: "정품 금고 인증서", real: "원격 증명(Attestation)", note: "핵심" },
        { as: "빠르지만 하드웨어 믿어야", real: "동형암호와 트레이드오프", note: "" },
      ],
      usage: "멀티클라우드에서 민감 데이터 처리, 프라이버시 보존 AI에 쓰입니다. 시험은 데이터 3상태(저장·전송·사용) 중 위치, TEE·Attestation, 동형암호 비교입니다.",
      links: [
        { topic: "동형 암호(Homomorphic Encryption)", how: "'사용 중 보호'의 다른 접근(암호문 연산)입니다." },
        { topic: "부채널 공격(Side Channel Attack)", how: "TEE의 잔여 위협 모델입니다." },
      ],
      exam: "기밀컴퓨팅은 CPU의 신뢰 실행 환경(TEE)에서 사용 중 데이터를 격리 처리하고 원격 증명으로 무결성을 검증하는 기술로, 저장·전송에 이은 세 번째 보호 상태를 담당한다.",
    }, image: "/concept/book/sc-confidential-computing.png", easy: "기밀컴퓨팅(Confidential Computing)은 '사용 중(연산 중)인 데이터'를 보호하는 데 중점을 둔 컴퓨팅 방식입니다. 데이터 보호에는 세 상태가 있는데 — 저장 중(암호화)과 전송 중(TLS)은 이미 잘 보호하지만, CPU가 실제로 연산하는 '사용 중' 데이터는 메모리에 평문으로 있어 사각지대였습니다. 기밀컴퓨팅이 이 마지막 구멍을 메웁니다. 핵심은 신뢰 실행 환경(TEE, Trusted Execution Environment) — CPU 안에 격리된 안전 영역을 만들어 그 안에서만 코드·데이터를 다루고, 운영체제나 관리자조차 그 내부를 못 봅니다. 구현은 Intel SGX·Intel TDX·AMD SEV·ARM TrustZone이 대표적입니다. 그리고 원격 실행증명(Attestation)으로 '이 TEE가 진짜 안전한 환경인지'를 검증합니다. 구성요소는 TEE·실행증명·주변장치(GPU·Smart NIC)·시스템 소프트웨어(ECALL·OCALL)·응용(TPM)입니다. '데이터 3상태 중 사용 중 보호', 'TEE 격리 실행'이 핵심 시험 포인트입니다." },
"sc-iso-27017": {
    guide: {
      hook: "ISO 27001을 '클라우드에 맞게' 확장한 클라우드 보안 통제 지침입니다.",
      scene: "일반 정보보안 통제(27001)만으론 클라우드 특유의 문제 — 사업자와 이용자의 책임 경계, 가상자원 격리, 관리자 접근 — 를 못 다룹니다. 27017은 클라우드 제공자·이용자 각각이 무엇을 해야 하는지 추가 통제를 제시합니다.",
      why: "'책임 공유 모델의 명문화'가 핵심입니다. 27001·27018과의 관계(일반/클라우드/클라우드 개인정보)와 제공자·이용자 역할 구분이 출제 포인트입니다.",
      mechanism: "27002(통제 실무) 위에 클라우드 특화 통제와 각 통제의 '제공자 책임 vs 이용자 책임'을 명시. 주요 영역: 자원 격리(멀티테넌시), 가상 네트워크 보안, 관리자 운영 보안, 이용자 데이터 삭제·반환, 모니터링 정보 제공. 인증은 27001 기반에 27017을 추가 적용.",
      map: [
        { as: "클라우드용 추가 규칙", real: "27001/27002 클라우드 확장", note: "" },
        { as: "누가 무엇을 책임지나", real: "책임 공유 명문화", note: "핵심" },
        { as: "옆 세입자와 격리", real: "멀티테넌시 자원 격리", note: "" },
        { as: "떠날 때 데이터 반환·삭제", real: "이용자 데이터 처리", note: "" },
      ],
      usage: "클라우드 서비스 제공자·도입 기업의 보안 인증 기준입니다. 시험은 27001·27017·27018 관계와 책임 공유 통제입니다.",
      links: [
        { topic: "ISO 27018", how: "클라우드 '개인정보' 보호 통제로 짝을 이룹니다." },
        { topic: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)", how: "클라우드 통제를 도구로 구현합니다." },
      ],
      exam: "ISO 27017은 ISO 27001/27002를 클라우드로 확장해 제공자·이용자의 책임 공유와 자원 격리·데이터 반환 등 클라우드 특화 보안 통제를 제시하는 국제 지침이다.",
    }, image: "/concept/book/sc-iso-27017.png", easy: "ISO 27017은 클라우드 서비스에 특화된 정보보호 통제 국제 표준입니다. 일반 정보보호 지침인 ISO 27002를 기반으로, 클라우드 환경 특유의 통제 사항을 추가한 것이죠. 표준 계보를 잡으면 — ISO 27001(정보보호 관리체계) + ISO 27002(정보보호 보안지침) + ISO 29100(개인정보보호)를 토대로 ISO 27017(클라우드 정보보호)이 자리합니다. 클라우드만의 핵심 통제 — 멀티 테넌트 환경에서 사용자 간 리소스 분리, 이용자가 암호키를 독립적으로 저장·관리할 능력 제공, 클라우드 공급자와 사용자의 역할·책임 분담, 공급자가 지원할 보안통제 서비스 명세 제공, 고객이 감지한 보안 이벤트를 공급자에게 보고하는 사고관리. 통제 항목은 정보보호 정책·접근통제·암호화·공급망관리·사고관리·연속성·법적준거성 등을 다룹니다. '27002 기반의 클라우드 전용 지침', '멀티테넌트 분리·암호키 독립 관리·역할 분담'이 시험 포인트입니다." },
"sc-privacy-8principles": {
    guide: {
      hook: "전 세계 개인정보보호법의 뿌리 — OECD가 1980년 정한 8가지 원칙입니다.",
      scene: "개인정보를 다룰 때 지켜야 할 '헌법 조문' 같은 기본 원칙입니다. 필요한 만큼만 모으고, 정확하게 유지하고, 목적을 밝히고, 안전하게 지키고, 무엇을 하는지 공개하고, 본인이 열람·정정할 수 있게 하며, 책임진다 — 이 8개가 각국 법의 원형입니다.",
      why: "GDPR·개인정보보호법 조항 대부분이 이 8원칙의 변주라는 점이 핵심입니다. 원칙명과 의미 매핑이 출제 단골이고, PbD·처리 원칙의 근거입니다.",
      mechanism: "OECD 8원칙: ①수집 제한 ②정보 정확성(품질) ③목적 명확화 ④이용 제한 ⑤안전성 확보 ⑥공개(처리방침) ⑦개인 참여(열람·정정·삭제) ⑧책임. 국내법의 '수집·이용·제공·파기' 원칙과 GDPR의 처리 원칙이 여기서 파생.",
      map: [
        { as: "필요한 만큼만", real: "수집 제한·이용 제한", note: "①④" },
        { as: "왜 모으는지 밝히기", real: "목적 명확화·공개", note: "③⑥" },
        { as: "안전하게 지키기", real: "안전성 확보", note: "⑤" },
        { as: "내 정보 열람·정정", real: "개인 참여·책임", note: "⑦⑧" },
      ],
      usage: "개인정보보호법·GDPR 해석의 기준입니다. 시험은 8원칙 나열·매핑과 국내법·GDPR 원칙과의 대응입니다.",
      links: [
        { topic: "개인정보보호 중심 설계(Privacy by Design)", how: "8원칙을 설계에 내재화한 확장입니다." },
        { topic: "개인정보 보호기술", how: "원칙을 구현하는 기술적 수단입니다." },
      ],
      exam: "개인정보 프라이버시 8원칙은 OECD가 정한 수집제한·정확성·목적명확화·이용제한·안전성·공개·개인참여·책임으로, 각국 개인정보보호법과 GDPR의 원형이다.",
    }, image: "/concept/book/sc-privacy-8principles.png", easy: "개인정보 프라이버시 8원칙은 OECD가 개인정보의 국제 유통과 프라이버시 보호를 위해 제시한 8가지 기본 원칙으로, 우리나라 개인정보보호법과 GDPR의 뿌리입니다. 8원칙 — ① 수집 제한(합법·공정 절차로, 동의 후 수집) ② 정보 정확성(목적에 맞게 정확·완전·최신 유지) ③ 목적 명확화(수집 시 목적 명확, 변경 시 재명확화) ④ 이용 제한(동의·법률 외에는 목적 외 이용 금지) ⑤ 안전성 확보(분실·불법접근·파괴 대비 안전장치) ⑥ 공개(처리 정책을 일반에 공개) ⑦ 개인 참가(정보주체의 열람·정정·삭제 청구권) ⑧ 책임(관리자가 원칙 준수 책임). 두음으로 '수집제한·정보정확성·목적명확화·이용제한·안전성·공개·개인참가·책임'을 외웁니다. '이용 제한'과 '목적 명확화'가 짝을 이뤄 목적 외 사용을 막고, '개인 참가'가 정보주체의 통제권을 보장한다는 구조가 시험 포인트입니다." },
"sc-privacy-tech": {
    guide: {
      hook: "개인정보 보호 '원칙'을 실제로 구현하는 기술적 수단들의 묶음입니다.",
      scene: "'안전하게 지켜라'는 원칙만으론 부족하니, 암호화·가명처리·접근통제·비식별화 같은 구체 기술로 실현합니다. 데이터 생애주기 각 단계에서 무엇으로 지킬지를 기술로 대응시킵니다.",
      why: "원칙(8원칙·PbD)과 기술(구현 수단)의 연결 고리라는 점이 핵심입니다. PET(프라이버시 강화 기술)로 확장되며, 최근 동형암호·차분 프라이버시·연합학습(PEC)까지 포함하는 흐름이 출제 포인트입니다.",
      mechanism: "생애주기별: 수집(최소 수집·동의 관리), 저장(암호화·접근통제·DLP), 이용(가명·익명화·마스킹·차분 프라이버시), 제공(비식별·결합전문기관), 파기(완전 삭제). PET 확장: 동형암호·MPC·연합학습·TEE. 원칙을 데이터 흐름에 매핑해 적용.",
      map: [
        { as: "잠가서 저장", real: "암호화·접근통제·DLP", note: "저장" },
        { as: "누군지 흐리기", real: "가명·익명·마스킹·차분", note: "이용" },
        { as: "합칠 땐 지정 기관만", real: "비식별·결합전문기관", note: "제공" },
        { as: "노출 없이 활용", real: "PET(동형·연합학습)", note: "확장" },
      ],
      usage: "개인정보 보호 조치의 기술적 이행 기준입니다. 시험은 생애주기별 기술 매핑과 PET·PEC와의 관계, 가명·익명 구분입니다.",
      links: [
        { topic: "개인정보 프라이버시 8원칙", how: "이 기술들이 구현하는 상위 원칙입니다." },
        { topic: "PEC(Privacy-Enhancing Computation)", how: "최신 프라이버시 강화 기술로 확장됩니다." },
      ],
      exam: "개인정보 보호기술은 암호화·접근통제·가명/익명화·차분 프라이버시 등으로 보호 원칙을 데이터 생애주기 단계별로 구현하는 기술 수단으로, PET·PEC로 확장된다.",
    }, image: "/concept/book/sc-privacy-tech.png", easy: "개인정보 보호기술은 개인정보의 처리(수집·기록·파기) 중 발생할 수 있는 부정 사용·유출로부터 정보를 지키는 기술과 정책의 총칭입니다. 크게 네 계층으로 정리됩니다. ① 필터링(노출·침해 차단): 방화벽·IDS/IPS·DLP로 유출을 막고, 개인정보 스캐너·스팸 방지로 침해를 차단 ② 통신 보호: 은닉(리메일러·Proxy로 발신자·IP 숨김), 암호화(VPN·HTTPS·i-PIN), 인증(PKI·OpenID) ③ 저장 보호: DB 암호화 솔루션·Secure OS ④ 정책: P3P(W3C 표준으로 웹사이트 개인정보 정책을 기계가 읽게 기술). 보호기술 종류로는 정책협상 기술(P3P), 프라이버시 정책 생성 SW, 쿠키 관리, 암호화 S/W, 익명화(anonymizers) 기술이 있습니다. '노출을 막고(필터링), 통신을 지키고(은닉·암호화·인증), 저장을 보호하고(DB암호화), 정책으로 통제(P3P)'하는 4단 구조가 시험 포인트입니다." },
"sc-risk-analysis": {
    guide: {
      hook: "'무엇을, 얼마나 지킬지'를 정하는 보안의 출발점 — 위험을 재서 우선순위를 매깁니다.",
      scene: "예산은 유한하니 모든 걸 똑같이 지킬 순 없습니다. 자산의 가치, 위협의 가능성, 취약점을 곱해 '위험'을 계산하고, 큰 것부터 대응합니다. 위험 = 자산 × 위협 × 취약점이 뼈대입니다.",
      why: "정량적(금액·확률)과 정성적(등급) 분석의 트레이드오프, 그리고 위험 대응 4전략(감소·회피·전가·수용)이 출제 핵심입니다. ISMS·영향평가의 기반 방법론입니다.",
      mechanism: "절차: 자산 식별·가치 평가 → 위협·취약점 분석 → 위험 산정(정량: ALE=SLE×ARO 등 금액, 정성: High/Med/Low 등급) → 위험 대응(감소=통제 도입, 회피=활동 중단, 전가=보험·아웃소싱, 수용=DoA 이내 감내) → 잔여위험 관리. 접근법: 기준선·비정형·상세·복합.",
      map: [
        { as: "가치×가능성×약점", real: "위험 = 자산×위협×취약점", note: "산정 공식" },
        { as: "금액으로 vs 등급으로", real: "정량 분석 ↔ 정성 분석", note: "트레이드오프" },
        { as: "줄일까·피할까·넘길까·감수할까", real: "위험 대응 4전략", note: "감소·회피·전가·수용" },
        { as: "남은 위험 받아들이기", real: "잔여위험·DoA", note: "수용 기준" },
      ],
      usage: "ISMS-P·개인정보 영향평가의 필수 단계입니다. 시험은 위험 산정 공식, 정량/정성 비교, 대응 4전략입니다.",
      links: [
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "위험분석이 관리체계의 핵심 프로세스입니다." },
        { topic: "위협 모델링(Threat Modeling)", how: "설계 단계 위협 식별과 연계됩니다." },
      ],
      exam: "위험분석은 자산·위협·취약점으로 위험을 정량·정성 산정하고 감소·회피·전가·수용의 4전략으로 대응해 잔여위험을 관리하는 보안의 기반 방법론이다.",
    }, image: "/concept/book/sc-risk-analysis.png", easy: "위험분석 방법론(ISO/IEC 1335-1)은 자산의 위험을 식별·분석·평가해 보안 대책을 세우는 접근법과 평가 방법의 체계입니다. 접근법 4종 — ① 베이스라인 접근법(표준 보안대책 체크리스트로 점검, 빠르고 저비용이지만 획일적) ② 비정형 접근법(전문가의 지식·경험·통찰로 분석, 부담 없지만 주관적) ③ 상세 위험 분석(자산·위협·취약성을 단계별로 정량 분석, 정확하지만 시간·비용 큼) ④ 복합 접근법(고위험 영역만 상세 분석, 나머지는 베이스라인 — 효율과 정확의 균형). 평가 방법은 두 갈래 — 정성적 평가(위험을 상대적 크기로 비교, 델파이·시나리오·순위결정법, 주관적이지만 빠름)와 정량적 평가(금액·숫자로 표현, 몬테카를로·의사결정나무·민감도 분석, 객관적이지만 복잡). '복합 접근법이 실무 최적', '정성=상대비교, 정량=금액환산' 구분이 시험 포인트입니다." },
"sc-iec-62443": {
    guide: {
      hook: "공장·발전소 같은 산업제어시스템(ICS/OT)을 위한 전용 보안 국제 표준입니다.",
      scene: "IT 보안은 '정보 유출'을 막지만, 공장 제어망은 '멈추면 폭발·정전'이 되므로 우선순위가 다릅니다(가용성·안전 최우선). 62443은 OT 환경에 맞춰 구역을 나누고(Zone) 통로를 통제하며(Conduit) 보안 등급(SL)을 요구합니다.",
      why: "IT(기밀성 우선)와 OT(가용성·안전 우선)의 차이, 그리고 Zone·Conduit 분할과 보안수준(SL 1~4) 개념이 출제 포인트입니다. 스마트팩토리·기반시설 보안의 표준 축입니다.",
      mechanism: "핵심 개념: Zone(보안 요구가 같은 자산 그룹)과 Conduit(존 간 통신 경로)로 망을 분할·통제, 보안 수준 SL 1(우발적)~4(국가급 공격) 목표 설정, 역할별(운영자·통합자·제조사) 요구사항 규정. IEC 62443-3-3(시스템)·4-1/4-2(개발·컴포넌트)로 구성.",
      map: [
        { as: "위험 구역을 벽으로 분리", real: "Zone 분할", note: "" },
        { as: "구역 간 통로만 검문", real: "Conduit 통제", note: "" },
        { as: "위협 수준별 방어 목표", real: "보안 수준 SL 1~4", note: "" },
        { as: "멈추면 큰일", real: "가용성·안전 우선", note: "IT와 차이" },
      ],
      usage: "스마트팩토리·발전·플랜트 보안의 기준입니다. 시험은 IT vs OT 보안 우선순위, Zone/Conduit, SL 등급입니다.",
      links: [
        { topic: "스마트팩토리 보안취약점 및 대응방안", how: "62443이 스마트팩토리 보안의 기준 표준입니다." },
        { topic: "차량 사이버 보안 국제 표준(ISO 21434)", how: "또 다른 도메인(자동차) 특화 보안 표준입니다." },
      ],
      exam: "IEC 62443은 산업제어시스템(OT)을 위한 보안 표준으로, 가용성·안전을 우선해 Zone·Conduit로 망을 분할하고 보안수준(SL 1~4)을 요구한다.",
    }, image: "/concept/book/sc-iec-62443.png", easy: "IEC 62443은 산업제어시스템(IACS·SCADA·PLC)의 보안을 다루는 국제 표준으로, 발전소·스마트팩토리 같은 OT(운영기술) 환경 보안의 근거입니다. IT 보안과 달리 '멈추면 안 되는' 제어시스템 특성을 반영하죠. 구성은 4파트 — Part 1 General(용어·개념·모델·7개 FR 정의), Part 2 Policy & Procedure(IACS 보안 프로그램·패치 관리·공급업체 준수), Part 3 System(시스템 보안 기술·수준), Part 4 Component(제품 개발·컴포넌트 요구사항). 핵심은 7대 기본 요구사항(7 FR) — ① 식별·인증 ② 사용제어 ③ 시스템 무결성 ④ 데이터 기밀성 ⑤ 데이터 제한성 ⑥ 적시성·이벤트 응답 ⑦ 자원 가용성. IT 보안이 기밀성(C)을 최우선하는 반면, IACS는 가용성(A)이 최우선이라는 점이 다릅니다. '4파트 구성'과 '7대 FR'이 시험 포인트입니다." },
"sc-iso-27018": {
    guide: {
      hook: "클라우드에 맡긴 '개인정보(PII)'를 어떻게 보호할지 정한 국제 실천 규범입니다.",
      scene: "27017이 클라우드 '보안' 전반이라면, 27018은 그중 '개인정보'에 초점을 맞춥니다. 클라우드 사업자(PII 처리자)가 고객 개인정보를 목적 외로 쓰지 않고, 하위 위탁·국외 이전을 투명하게 하도록 요구합니다.",
      why: "'클라우드 개인정보 보호'라는 특화 위치와 27001·27017과의 관계가 핵심입니다. GDPR·개인정보보호법의 클라우드 위탁 요건과 연결되는 실무 기준으로 출제됩니다.",
      mechanism: "27002 통제에 PII 특화 항목 추가: 목적 외 이용·마케팅 금지(고객 동의 없이), 하위 처리자(재위탁) 공개, 국외 이전 투명성, 이용자 권리(접근·삭제) 지원, 데이터 반환·삭제, 침해 통지. 클라우드 사업자가 '개인정보 처리자'로서 지킬 실천 규범.",
      map: [
        { as: "맡긴 개인정보 목적 외 금지", real: "목적 제한·마케팅 금지", note: "핵심" },
        { as: "재하청 공개", real: "하위 처리자 투명성", note: "" },
        { as: "어디로 보내는지 공개", real: "국외 이전 투명성", note: "" },
        { as: "떠날 때 돌려주고 지우기", real: "데이터 반환·삭제", note: "" },
      ],
      usage: "글로벌 클라우드 사업자의 개인정보 컴플라이언스 인증입니다. 시험은 27017(보안)과 27018(개인정보)의 역할 구분, GDPR 위탁 요건과의 관계입니다.",
      links: [
        { topic: "ISO 27017", how: "클라우드 '보안' 통제로 짝을 이룹니다." },
        { topic: "ISO 27701", how: "개인정보 관리체계(PIMS)로 확장됩니다." },
      ],
      exam: "ISO 27018은 클라우드 사업자가 고객 개인정보(PII)를 목적 외 이용 금지·재위탁 공개·국외이전 투명성 원칙으로 보호하도록 한 클라우드 개인정보 실천 규범이다.",
    }, image: "/concept/book/sc-iso-27018.png", easy: "ISO 27018은 퍼블릭 클라우드에서 개인식별정보(PII)를 보호하기 위한 통제 국제 표준입니다. 표준 계보로 보면 ISO 27001(관리체계)·27002(보안지침)·29100(개인정보) 위에 얹혀, 클라우드에 맡긴 고객의 개인정보를 클라우드 사업자가 어떻게 다뤄야 하는지를 규정합니다. ISO 27017(클라우드 정보보호 일반)과 짝인데, 27018은 특히 'PII 보호'에 특화된 게 차이입니다. 확장 통제 12개(A.1~A.12) — 개요, 동의와 선택(고객 지시에 따라만 처리), 사용목적 정당성(목적 외 사용 금지·명시적 동의), 수집제한, 데이터 최소화, 사용·보유·공개 제한(법적 의무 시 사전 고지), 정확성·품질, 개방성·투명성(PII 처리 위치 공개), 개인 참여·접근, 책임(무단 접근 시 즉시 고지), 정보보호(암호화), 개인정보 보호규정(반품·삭제 정책). '고객 지시에 따라서만 처리', 'PII 처리 위치 투명 공개'가 클라우드 특유의 핵심 통제이자 시험 포인트입니다." },
"sc-iso-21434": {
    guide: {
      hook: "커넥티드·자율주행차의 '사이버 보안'을 전 생애주기로 요구하는 자동차 전용 국제 표준입니다.",
      scene: "차가 인터넷에 연결되면 해킹으로 브레이크·조향까지 노려집니다. 21434는 기획·개발·생산·운영·폐차까지 차량 사이버 보안을 관리하도록 요구하고, 안전 표준(ISO 26262)과 짝을 이룹니다.",
      why: "'기능안전(26262) + 사이버보안(21434)'의 결합과 TARA(위협분석·위험평가), 전 생애주기 관리가 출제 포인트입니다. 자율주행 보안의 근거 표준입니다.",
      mechanism: "핵심: TARA(자산 식별→위협 분석→공격 실현가능성·영향 평가→위험 결정), 개념·개발·생산·운영·사후지원의 생애주기별 보안활동, 공급망(OEM·부품사) 책임 분담, CSMS(사이버보안 관리체계). UNECE R155 규정과 연계돼 형식승인에 요구됨.",
      map: [
        { as: "차량 위협을 재고 평가", real: "TARA", note: "핵심 절차" },
        { as: "기획부터 폐차까지", real: "생애주기 보안", note: "" },
        { as: "OEM-부품사 책임 분담", real: "공급망 보안", note: "" },
        { as: "안전+보안 함께", real: "ISO 26262 + 21434", note: "기능안전 결합" },
      ],
      usage: "완성차·부품사의 사이버보안 형식승인(R155) 근거입니다. 시험은 TARA, 26262와의 관계, 생애주기·공급망 보안입니다.",
      links: [
        { topic: "자율주행 자동차 보안취약점 및 대응방안", how: "21434가 자율주행 보안의 기준 표준입니다." },
        { topic: "IEC 62443", how: "또 다른 도메인(산업제어) 특화 보안 표준입니다." },
      ],
      exam: "ISO 21434는 커넥티드·자율주행차의 사이버 보안을 TARA와 전 생애주기·공급망으로 관리하는 자동차 전용 표준으로, 기능안전(26262)과 결합된다.",
    }, image: "/concept/book/sc-iso-21434.png", easy: "ISO 21434(ISO/SAE 21434)는 차량의 기획 단계부터 생산·운영·폐기까지 전 생애주기의 사이버보안 활동 프로세스를 정의하는 자동차 보안 국제 표준입니다. 커넥티드카·자율주행이 늘면서 차량이 해킹 대상이 됐고, 이를 개발 초기부터 체계적으로 관리하자는 거죠. 구성 — ① 기본(개요·용어) ② 조직 사이버보안 관리(정책·문화·감사) ③ 프로젝트 사이버보안 관리(책임자·계획·사례) ④ 분산 사이버보안 활동(공급망 이해관계자 능력 평가·책임 분담) ⑤ 지속적 사이버보안 활동(모니터링·취약점 관리) ⑥ 개념~검증(설계·개발·검증) ⑦ 생산 이후(운영·유지·폐기) + 위험 분석·평가. 이 표준이 CSMS(사이버보안 관리체계) 인증의 근거가 됩니다. '차량 전 생애주기 보안 프로세스'와 '공급망까지 포함'이 시험 포인트로, 자율주행 자동차 보안 토픽과 엮입니다." },
"sc-iso-27701": {
    guide: {
      hook: "정보보안 관리체계(ISMS, 27001)에 '개인정보'를 얹은 개인정보 관리체계(PIMS) 표준입니다.",
      scene: "27001이 '정보 전반'을 체계로 지킨다면, 27701은 그 위에 개인정보 특화 요구를 더해, 개인정보 컨트롤러·프로세서가 GDPR 같은 법을 체계적으로 준수하도록 만듭니다.",
      why: "'ISMS 확장형 PIMS'라는 위치와 컨트롤러/프로세서 역할 구분, GDPR 매핑이 출제 포인트입니다. 국내 ISMS-P와 유사 개념으로 비교됩니다.",
      mechanism: "27001/27002를 확장해 개인정보 특화 통제 추가: 컨트롤러 통제(수집·이용·동의·정보주체 권리), 프로세서 통제(위탁 처리·재위탁·삭제). PII 위험을 ISMS 위험관리에 통합, GDPR·각국 법과의 매핑 부록 제공. 27001 인증에 27701을 추가 취득.",
      map: [
        { as: "ISMS에 개인정보 얹기", real: "PIMS(27001 확장)", note: "" },
        { as: "수집·동의·권리는 컨트롤러", real: "컨트롤러 통제", note: "" },
        { as: "위탁·삭제는 프로세서", real: "프로세서 통제", note: "" },
        { as: "GDPR와 대조표", real: "법령 매핑", note: "컴플라이언스" },
      ],
      usage: "글로벌 개인정보 컴플라이언스 인증입니다. 시험은 27001→27701 확장, 컨트롤러/프로세서 구분, ISMS-P와의 비교입니다.",
      links: [
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "국내의 유사한 통합 관리체계 인증입니다." },
        { topic: "ISO 27018", how: "클라우드 개인정보 통제로 연계됩니다." },
      ],
      exam: "ISO 27701은 ISO 27001 ISMS를 확장한 개인정보 관리체계(PIMS) 표준으로, 컨트롤러·프로세서 통제를 더해 GDPR 등 법 준수를 체계화한다.",
    }, image: "/concept/book/sc-iso-27701.png", easy: "ISO 27701은 개인정보 보호를 위한 ISO 27001·27002의 확장판으로, 기존 정보보호 관리체계(ISMS) 위에 개인정보보호 관리체계(PIMS)를 얹은 표준입니다. 즉 '보안(27001) + 개인정보(27701)'를 하나로 묶어 GDPR 대응의 국제 인증으로 쓰입니다. 구성 — 1~4(범위·용어), 5(27001 관련 PIMS 요구사항), 6(27001 관련 PIMS 지침), 7(PII 통제자에 대한 추가 27002 지침), 8(PII 처리자에 대한 추가 27002 지침). 여기서 'PII 통제자'(개인정보 처리 목적·수단을 정하는 자)와 'PII 처리자'(통제자를 대신해 처리하는 자)를 구분해 각각 다른 지침을 주는 게 핵심입니다(GDPR의 controller/processor 구분과 동일). 점검 항목은 Scope·Gap Analysis·Control Implementation·SOA(적용성 명세서)·Internal Audit·Maintenance입니다. 'ISMS+PIMS 결합', 'PII 통제자/처리자 구분'이 시험 포인트입니다." },
"sc-iso-20889": {
    guide: {
      hook: "비식별화(가명·익명) 기법들을 국제적으로 '분류·용어 통일'한 표준입니다.",
      scene: "가명처리·마스킹·총계처리·잡음추가 등 비식별 기법이 나라·문서마다 이름이 달라 혼란스럽습니다. 20889는 이 기법들을 체계적으로 분류하고 각각의 재식별 위험·효용을 정리해 공통 언어를 제공합니다.",
      why: "'가명처리 가이드라인의 국제 표준 근거'라는 위치가 핵심입니다. 기법 분류(대치·삭제·일반화·잡음 등)와 프라이버시 모델(k-익명성 등)이 출제 포인트입니다.",
      mechanism: "비식별 기법 분류: 통계적(샘플링·총계), 암호적(가명·토큰화), 억제(삭제·마스킹), 일반화(범주화·라운딩), 랜덤화(잡음 추가·순열). 프라이버시 모델: k-익명성(동일 준식별자 k개 이상), l-다양성, t-근접성. 각 기법의 재식별 위험과 데이터 효용의 균형을 제시.",
      map: [
        { as: "이름표 바꾸기", real: "가명·토큰화(암호적)", note: "" },
        { as: "뭉뚱그려 구간화", real: "일반화(범주화)", note: "" },
        { as: "일부러 잡음 섞기", real: "랜덤화(잡음 추가)", note: "" },
        { as: "k명 이상 똑같이 보이게", real: "k-익명성 모델", note: "재식별 방어" },
      ],
      usage: "가명·익명처리 기법 선택의 국제 기준입니다. 시험은 기법 분류, k-익명성·l-다양성·t-근접성, 가명 가이드라인과의 관계입니다.",
      links: [
        { topic: "가명처리(Pseudonymization) 기법", how: "20889가 그 기법의 국제 분류 근거입니다." },
        { topic: "가명정보 처리 가이드라인", how: "국내 가이드라인이 이 표준을 참조합니다." },
      ],
      exam: "ISO/IEC 20889는 대치·일반화·랜덤화 등 비식별화 기법과 k-익명성 등 프라이버시 모델을 분류·정의해 재식별 위험과 효용의 균형을 제시하는 국제 표준이다.",
    }, image: "/concept/book/sc-iso-20889.png", easy: "ISO/IEC 20889는 프라이버시 침해 없이 개인정보를 처리하기 위한 비식별화 기법을 제시하는 국제 표준으로, 가명처리 기법의 국제 근거입니다. 비식별 기법을 네 갈래로 정리합니다 — 대체(통계도구·일반화·해부화·가명화), 제거(삭제·마스킹), 변경(암호화·무작위화), 생성(재현데이터). 그리고 가장 중요한 게 프라이버시 보호 모델 3단계입니다 — ① K-익명성(같은 값이 K개 이상 있게 해서 특정 개인을 못 집게 함, 동질성·배경지식 공격 방어) ② L-다양성(K-익명성의 한계 보완, 민감 속성이 L개 이상 다양하게, 쏠림·유사성 공격 방어) ③ T-근접성(L-다양성의 한계 보완, 민감 속성 분포가 전체와 T 이하로 비슷하게 유지). K→L→T로 갈수록 방어가 강해지는데, 각 단계가 이전 모델의 약점을 메운다는 계보가 핵심 시험 포인트입니다. 가명처리 기법 토픽과 반드시 엮어서 봅니다." },
"sc-e-discovery": {
    guide: {
      hook: "소송에서 '전자적으로 저장된 정보(ESI)'를 증거로 수집·제출하는 전자증거개시 제도입니다.",
      scene: "예전엔 종이 문서를 제출했지만, 지금 증거는 이메일·메신저·클라우드 파일입니다. e-Discovery는 이 전자 증거를 원형·무결성을 유지한 채 찾아내고 검토해 법정에 제출하는 절차입니다.",
      why: "'디지털 포렌식 + 법적 절차'의 결합이고, 무결성·연계보관(Chain of Custody)이 핵심입니다. EDRM 단계 모델과 국내 도입 논의가 출제 포인트입니다.",
      mechanism: "EDRM 단계: 정보 거버넌스 → 식별 → 보존(법적 보존의무·Legal Hold) → 수집 → 처리 → 검토(관련성·특권) → 분석 → 제출 → 제시. 핵심 요건: 원본 무결성(해시), 연계보관 기록, 메타데이터 보존, 대량 데이터의 효율적 검토(TAR·AI 활용).",
      map: [
        { as: "전자 증거 찾기", real: "식별·수집", note: "ESI" },
        { as: "지우지 말라는 명령", real: "Legal Hold(보존의무)", note: "" },
        { as: "원본 그대로 봉인", real: "무결성·연계보관", note: "포렌식 요건" },
        { as: "방대한 자료 선별", real: "검토(TAR·AI)", note: "효율화" },
      ],
      usage: "국제 소송·기업 분쟁·규제 대응에 쓰입니다. 시험은 EDRM 단계, 디지털 포렌식과의 관계, 무결성·연계보관입니다.",
      links: [
        { topic: "디지털 포렌식(Digital Forensic)", how: "증거 수집·무결성 기법을 공유합니다." },
        { topic: "안티 포렌식(Anti-forensic)", how: "증거 인멸 대응이라는 반대 축입니다." },
      ],
      exam: "전자증거개시(e-Discovery)는 소송에서 전자 증거(ESI)를 EDRM 단계로 보존·수집·검토·제출하는 제도로, 무결성과 연계보관 유지가 핵심이다.",
    }, image: "/concept/book/sc-e-discovery.png", easy: "전자증거개시제도(e-Discovery)는 소송이나 규제 대응을 위해, 디지털로 존재하는 전자적 자료(ESI, Electronically Stored Information)를 수집·검토·생산해서 상대방·법원에 '개시(공개)'하는 절차입니다. 미국 민사소송에서 '가진 전자자료를 다 내놓아라'는 요구에 대응하는 거죠. 참조모델 EDRM 절차 — 정보관리(기록 보존) → 식별(중요 ESI 식별) → 보존·수집(손상 없이 취합) → 처리·검토·분석(데이터 최소화·민감성 검토·법률 분석) → 산출(면책·기밀 제거 후 제공). 헷갈리는 디지털 포렌식과의 비교가 시험 포인트 — e-Discovery는 '민사·방어적·사전 원칙 중심·쌍방 민간 적용'인 반면, 디지털 포렌식은 '형사·공격적 수사·사후 추적·강제 소송 적용·연계보관성(CoC) 원칙'입니다. 즉 e-Discovery는 소송 자료를 정리해 내주는 절차, 포렌식은 범죄 증거를 추적·수집하는 수사 기법입니다." },
"sc-zerotrust-2": {
    guide: {
      hook: "'절대 믿지 말고 항상 검증하라' — 내부망도 안전하지 않다는 전제의 보안 모델(2.0)입니다.",
      scene: "예전엔 회사 담장(경계) 안이면 믿었지만, 내부자·탈취 계정이 뚫으면 다 털립니다. 제로트러스트는 위치와 무관하게 모든 접근을 매번 검증하고 최소 권한만 줍니다. 2.0은 이를 성숙도 모델·구현 절차로 구체화한 국내 가이드라인입니다.",
      why: "'경계 기반 → 아이덴티티 기반'의 전환과 핵심 원칙(명시적 검증·최소 권한·침해 가정)이 출제 핵심입니다. 5대 핵심요소와 성숙도 단계, SDP·SASE와의 관계가 포인트입니다.",
      mechanism: "원칙: 명시적 검증(모든 접근을 아이덴티티·기기·컨텍스트로 확인), 최소 권한(JIT·JEA), 침해 가정(마이크로세그멘테이션·모니터링). 5핵심요소: 사용자·기기·네트워크·애플리케이션·데이터. PDP(정책결정)/PEP(정책시행) 구조로 매 요청 인가. 2.0은 성숙도(기초·향상·고도)와 도입 절차 제시.",
      map: [
        { as: "담장 안도 안 믿음", real: "침해 가정·경계 제거", note: "핵심 전환" },
        { as: "매번 신분·기기 확인", real: "명시적 검증", note: "" },
        { as: "딱 필요한 만큼만", real: "최소 권한(JIT/JEA)", note: "" },
        { as: "구역을 잘게 쪼갬", real: "마이크로세그멘테이션", note: "확산 차단" },
      ],
      usage: "공공·기업의 보안 아키텍처 전환 기준(KISA 가이드라인 2.0)입니다. 시험은 3원칙·5핵심요소·성숙도 단계, SDP/SASE와의 관계입니다.",
      links: [
        { topic: "SDP(Software Defined Perimeter)", how: "제로트러스트를 네트워크 접근으로 구현합니다." },
        { topic: "SASE(Secure Access Service Edge)", how: "제로트러스트를 클라우드 네트워크로 확장합니다." },
      ],
      exam: "제로트러스트 가이드라인 2.0은 명시적 검증·최소 권한·침해 가정 원칙과 5핵심요소·성숙도 단계로 경계 기반을 아이덴티티 기반 보안으로 전환하는 국내 지침이다.",
    }, image: "/concept/book/sc-zerotrust-2.png", easy: "제로트러스트 가이드라인 2.0은 '절대 신뢰하지 말고 항상 검증하라(Never Trust, Always Verify)'는 무신뢰 기반 보안 모델입니다. 기존 경계 보안은 '내부망은 안전하다'고 암시적으로 신뢰했지만, 내부자·침입자에게 뚫리면 끝이었죠. 제로트러스트는 이 암시적 신뢰를 제거하고, 모든 접근을 매번 인증·검증하며 최소 권한만 줍니다(과립형 경계 Granular Perimeter). 핵심 구성요소 — PE(정책 엔진: 신뢰도 분석해 허용/거부 결정), PA(정책 관리자: 세션 생성·통제), PDP(정책결정지점=PE+PA), PEP(정책시행지점: 실제 접근을 허용·차단), PIP(정책정보지점: 신뢰도 데이터 제공). 즉 '결정(PDP)과 시행(PEP)을 분리'하는 게 구조의 핵심입니다. 성숙도 4단계(기존→초기→향상→최적화)로 점진 도입하며, SDP·마이크로세그멘테이션으로 구현합니다. '암시적 신뢰 제거', 'PDP/PEP 분리', '최소 권한'이 시험 포인트입니다." },
"sc-sdp": {
    guide: {
      hook: "접근이 허가되기 전엔 서버가 '보이지도 않게' 숨기는 소프트웨어 정의 경계입니다.",
      scene: "VPN은 접속하면 내부망이 다 보이지만, SDP는 인증·인가를 통과하기 전까지 서버를 아예 네트워크에서 안 보이게 가립니다(블랙 클라우드). 스캔해도 포트가 안 잡히니 공격 표면 자체가 사라집니다.",
      why: "'선(先) 인증 후(後) 접속'과 '드러나지 않는 인프라'가 핵심입니다. 제로트러스트의 네트워크 구현체이자 VPN의 과신뢰를 대체하는 흐름이 출제 포인트입니다.",
      mechanism: "구조: SDP 컨트롤러(정책·인증), 초기 접속 클라이언트(IH), 접속 수용 호스트(AH). 흐름: 클라이언트가 컨트롤러에 인증(SPA — 단일 패킷 인가로 존재 노출 없이) → 컨트롤러가 정책 평가 후 허가 → 클라이언트-서버 간 개별 암호화 터널 생성. 인가 전 서버는 모든 연결을 드롭(default-deny)해 비가시.",
      map: [
        { as: "허가 전엔 안 보임", real: "블랙 클라우드(비가시)", note: "공격표면 제거" },
        { as: "문 두드리기 전 신원 확인", real: "선 인증 후 접속(SPA)", note: "" },
        { as: "사용자별 개별 터널", real: "동적 마이크로 터널", note: "" },
        { as: "VPN 과신뢰 대체", real: "제로트러스트 구현", note: "" },
      ],
      usage: "원격근무·클라우드 접근의 VPN 대체(ZTNA)로 채택됩니다. 시험은 VPN과의 차이(비가시·선인증), 컨트롤러/IH/AH 구조, 제로트러스트와의 관계입니다.",
      links: [
        { topic: "제로트러스트 가이드라인 2.0", how: "SDP는 제로트러스트의 네트워크 구현입니다." },
        { topic: "VPN(Virtual Private Network)", how: "과신뢰 한계를 SDP가 대체합니다." },
      ],
      exam: "SDP는 인증·인가 전 서버를 네트워크에서 비가시화하고 선 인증 후 개별 터널을 여는 소프트웨어 정의 경계로, VPN의 과신뢰를 대체하는 제로트러스트 구현이다.",
    }, image: "/concept/book/sc-sdp.png", easy: "SDP(소프트웨어 정의 경계)는 애플리케이션에 연결을 허용하기 전에 사용자의 상태와 ID를 먼저 검증하는 '선 인증, 후 연결' 방식의 네트워크 접근제어 프레임워크입니다. 제로트러스트(ZTNA)의 대표 구현이죠. 기존 VPN은 일단 연결한 뒤 내부망을 열어주지만, SDP는 인증되기 전까지는 서버가 아예 보이지도 않게(포트를 숨김) 합니다. 구성요소 3가지 — SDP Controller(정책에 따라 연결 가능 여부 결정), SDP Agent(Controller와 통신 후 Gateway로 보안접속), SDP Gateway(신원 확인된 사용자에게만 연결 제공). 메커니즘은 인증(접속요청→SPA 단일패킷인증→제로트러스트 기반 접속허가)과 연결(IPSec 보안접속→허용 서비스 접속) 순서입니다. VPN과 비교하면 SDP는 화이트리스트·ID 기반 동적 설정인 반면 VPN은 블랙리스트·IP 기반 정적 설정입니다. 정책은 PDP(결정)와 PEP(시행)로 분리됩니다. '선 인증 후 연결', 'VPN과의 차이'가 시험 포인트입니다." },
"sc-access-control": {
    guide: {
      hook: "'누가 무엇에 접근할 수 있나'를 통제하는 보안의 기본기 — 식별·인증·인가·책임추적의 흐름입니다.",
      scene: "건물 출입으로 보면 — 이름표를 대고(식별), 진짜 본인인지 확인하고(인증), 어느 층에 갈 수 있는지 정하고(인가), 누가 언제 드나들었는지 기록합니다(책임추적성). 이 4단계가 접근통제의 뼈대입니다.",
      why: "AAA(인증·인가·계정관리)와 식별·인증·인가·감사의 4요소, 그리고 접근통제 3정책(DAC·MAC·RBAC)의 상위 개념이라는 점이 핵심입니다.",
      mechanism: "4요소: 식별(ID 제시), 인증(지식·소유·존재로 본인 확인), 인가(권한 부여 — 정책에 따라), 책임추적성(로그·감사). 참조모니터가 모든 접근 요청을 정책과 대조해 허용/거부. 최소 권한·직무 분리(SoD) 원칙이 관통. 구체 정책은 DAC/MAC/RBAC로 분화.",
      map: [
        { as: "이름표 제시", real: "식별(Identification)", note: "" },
        { as: "본인 확인", real: "인증(Authentication)", note: "지식·소유·존재" },
        { as: "갈 수 있는 층 지정", real: "인가(Authorization)", note: "최소 권한" },
        { as: "출입 기록", real: "책임추적성(감사)", note: "" },
      ],
      usage: "모든 시스템 보안 설계의 기초입니다. 시험은 4요소 흐름, 최소 권한·직무 분리, 접근통제 모델(DAC/MAC/RBAC)로의 연결입니다.",
      links: [
        { topic: "접근 통제 모델", how: "DAC·MAC·RBAC 등 구체 정책으로 구현됩니다." },
        { topic: "제로트러스트 가이드라인 2.0", how: "매 접근 검증·최소 권한을 극단화한 모델입니다." },
      ],
      exam: "접근 통제는 식별·인증·인가·책임추적성으로 자원 접근을 통제하는 보안 기본기로, 최소 권한·직무 분리를 원칙으로 DAC·MAC·RBAC 모델로 구현된다.",
    }, image: "/concept/book/sc-access-control.png", easy: "접근 제어(Access Control)는 사용자(주체)의 신원을 식별·인증한 뒤, 대상 정보(객체)에 어디까지 접근·사용할지를 인가(Authorization)하는 기법입니다. 구성 3요소 — 정책(누가 무엇에 접근할지 결정), 모델(정책을 수학·논리로 구조화), 메커니즘(기술적 실현). 가장 중요한 시험 포인트는 4대 접근 통제 정책 비교입니다 — MAC(강제적: 관리자가 보안등급으로 통제, 군사·정부, 기밀성 강함), DAC(임의적: 객체 소유자가 권한 부여, 상용 DBMS, 유연하지만 보안 약함), RBAC(역할 기반: 역할에 권한 부여, 기업·금융), ABAC(속성 기반: 사용자·리소스·환경 속성으로 동적 통제, 클라우드·IoT). 2대 원칙은 최소 권한 부여(업무에 꼭 필요한 만큼만)와 직무 분리(개발·운영·보안을 나눔)입니다. 'MAC=강제·군사, DAC=임의·소유자, RBAC=역할, ABAC=속성·동적' 대응이 반드시 나옵니다." },
"sc-access-control-model": {
    guide: {
      hook: "접근 권한을 '누가 정하느냐'로 갈리는 세 모델 — DAC·MAC·RBAC입니다.",
      scene: "내 파일 권한을 내가 정하면 DAC(임의적), 국가 기밀처럼 등급으로 강제되면 MAC(강제적), 회사에서 '팀장'이라는 직책에 권한을 묶으면 RBAC(역할 기반)입니다. 누가 규칙을 쥐느냐가 다릅니다.",
      why: "'권한 결정 주체'라는 분류 기준과 각 모델의 장단·적용처가 출제 핵심입니다. RBAC의 확장인 ABAC(속성 기반)까지 이어지는 계보가 포인트입니다.",
      mechanism: "DAC: 자원 소유자가 재량으로 권한 부여(유연·전파 위험, 예: 파일 ACL). MAC: 보안 등급·레이블로 시스템이 강제(Bell-LaPadula 기밀성, Biba 무결성 — 군·정부). RBAC: 역할에 권한을 묶고 사용자에 역할 할당(관리 효율·직무분리). ABAC: 사용자·자원·환경 속성으로 정책 평가(세밀·동적 — 제로트러스트).",
      map: [
        { as: "내 파일은 내 마음대로", real: "DAC(임의적)", note: "소유자 재량" },
        { as: "기밀 등급으로 강제", real: "MAC(강제적)", note: "Bell-LaPadula" },
        { as: "직책에 권한 묶기", real: "RBAC(역할 기반)", note: "관리 효율" },
        { as: "상황·속성으로 판단", real: "ABAC(속성 기반)", note: "제로트러스트" },
      ],
      usage: "OS·DB·클라우드 권한 설계의 기준입니다. 시험은 DAC/MAC/RBAC 비교표, Bell-LaPadula(기밀성)·Biba(무결성), ABAC 확장입니다.",
      links: [
        { topic: "접근 제어/접근 통제(Access Control)", how: "이 모델들이 인가를 구체화합니다." },
        { topic: "제로트러스트 가이드라인 2.0", how: "ABAC로 매 접근을 동적 평가합니다." },
      ],
      exam: "접근 통제 모델은 권한 결정 주체에 따라 DAC(소유자)·MAC(등급 강제)·RBAC(역할)로 나뉘며, 속성 기반 ABAC로 확장돼 제로트러스트에 활용된다.",
    }, image: "/concept/book/sc-access-control-model.png", easy: "접근 통제 모델은 주체가 객체에 대해 어떤 권한을 가지는지 결정하는 규칙·정책 모델입니다. 4대 모델이 짝지어 나옵니다. ① Bell-LaPadula(BLP): 기밀성 모델로 'No Read Up(위 등급 못 읽음)·No Write Down(아래 등급에 못 씀)' — 기밀이 아래로 새는 걸 막습니다. ② BIBA: 무결성 모델로 BLP와 정반대인 'No Read Down(아래 못 읽음)·No Write Up(위에 못 씀)' — 오염된 하위 데이터가 상위를 더럽히는 걸 막습니다. ③ Clark-Wilson: 상업적 무결성 모델로 객체는 반드시 프로그램(Well-Formed Transaction)을 통해서만 접근, 임무 분리 원칙. ④ 만리장성(Brewer-Nash): 이해충돌 방지 모델로, 경쟁 관계 회사의 정보를 동시에 못 보게(직무 분리·이익 충돌 방지) 합니다. 핵심은 'BLP=기밀성=위를 못 읽고 아래에 못 쓴다', 'BIBA=무결성=아래를 못 읽고 위에 못 쓴다'는 방향의 반대 대응입니다." },
"sc-cc-cert": {
    guide: {
      hook: "보안 제품을 '국제 공통 기준'으로 평가·인증하는 제도 — 한 번 받으면 여러 나라가 인정합니다(CCRA).",
      scene: "방화벽·스마트카드 같은 보안 제품이 '정말 안전한가'를 나라마다 따로 검증하면 낭비입니다. Common Criteria는 공통 평가 기준으로 심사하고, 그 결과를 상호 인정해 중복을 없앱니다.",
      why: "'보안 기능(SFR) + 보증 수준(EAL)'의 분리와 PP/ST 개념이 출제 핵심입니다. EAL 1~7 등급과 상호인정(CCRA)이 포인트입니다.",
      mechanism: "핵심 개념: PP(보호프로파일 — 제품군에 요구되는 보안요구 정의), ST(보안목표명세 — 특정 제품이 충족하는 요구), TOE(평가 대상), SFR(보안기능요구), SAR(보증요구). EAL 1(기능 시험)~7(정형 검증)로 보증 수준을 등급화. CCRA로 EAL2까지 국제 상호인정.",
      map: [
        { as: "제품군 요구 규격", real: "PP(보호프로파일)", note: "" },
        { as: "이 제품이 지킨다는 명세", real: "ST(보안목표명세)", note: "" },
        { as: "얼마나 엄격히 검증했나", real: "EAL 1~7 보증 수준", note: "핵심" },
        { as: "한 번 받고 여러 나라 인정", real: "CCRA 상호인정", note: "" },
      ],
      usage: "공공 보안 제품 도입 요건(국내 CC 인증)입니다. 시험은 PP/ST/TOE, EAL 등급, 상호인정 범위입니다.",
      links: [
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "제품 인증(CC) vs 관리체계 인증(ISMS)의 구분입니다." },
        { topic: "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)", how: "보증 요구 설정에 위험 평가가 연계됩니다." },
      ],
      exam: "CC 평가·인증은 보안 기능(SFR)과 보증 수준(EAL 1~7)을 PP·ST 기반으로 심사하는 국제 공통 기준 제도로, CCRA를 통해 결과를 상호 인정한다.",
    }, image: "/concept/book/sc-cc-cert.png", easy: "CC 평가·인증(정보보호제품 평가·인증)은 정보보호 제품에 구현된 보안기능이 안전하고 신뢰할 만한지 평가·시험해 인증하는 제도입니다. 국제 표준 Common Criteria(ISO 15408)에 기반하죠. CC는 3파트 — Part 1(소개·일반모델), Part 2(보안 기능 요구사항: 무엇을 하는가), Part 3(보안 보증 요구사항: 얼마나 믿을 만한가). 핵심 개념 3가지 — PP(보호 프로파일: 제품군이 갖춰야 할 공통 보안 요구사항 모음), ST(보안목표 명세서: 특정 제품이 그 요구를 어떻게 구현하는지, 벤더가 PP를 참조해 작성), TOE(평가 대상 제품). 보증등급 EAL은 EAL1(기능시험)부터 EAL7(정형 검증)까지로, 높을수록 평가가 엄격합니다. 국내용은 EAL2~4·상호인정 안 됨, 국제용은 EAL1~7·CCRA 회원국 상호인정입니다. 'PP→ST→TOE', 'EAL1~7', 'CCRA 국제 상호인정'이 시험 포인트입니다." },
"sc-pia": {
    guide: {
      hook: "개인정보를 다루는 시스템을 '만들기 전에' 프라이버시 위험을 미리 평가하는 제도입니다.",
      scene: "대규모 개인정보 시스템을 다 만든 뒤 문제가 터지면 고치기 어렵습니다. PIA는 구축 전에 '어떤 개인정보를, 어떻게 흐르게 하고, 무슨 위험이 있는지'를 분석해 설계에 반영하게 합니다 — PbD의 실행 도구입니다.",
      why: "'사전 예방(Shift Left)'의 개인정보판이자, 공공기관 일정 규모 이상 시 의무라는 법적 지위가 핵심입니다. 절차 단계와 GDPR DPIA와의 관계가 출제 포인트입니다.",
      mechanism: "절차: 사전 준비(대상·팀 구성) → 개인정보 흐름 분석(수집·이용·제공·파기 흐름도) → 위험 분석(자산·위협·취약점으로 침해 위험 산정) → 개선계획 수립(위험별 통제) → 이행·점검. 공공기관은 5만 명 민감정보·50만 명 연계·100만 명 이상 등 요건 시 의무 수행.",
      map: [
        { as: "짓기 전 위험 진단", real: "구축 전 사전 평가", note: "Shift Left" },
        { as: "개인정보 이동 경로 그리기", real: "개인정보 흐름 분석", note: "" },
        { as: "침해 위험 점수화", real: "위험 분석", note: "위험분석 방법론 적용" },
        { as: "위험별 개선책", real: "개선계획·이행", note: "" },
      ],
      usage: "공공 개인정보 시스템 구축의 의무 절차입니다. 시험은 PIA 단계, 의무 대상 요건, GDPR DPIA·PbD와의 관계입니다.",
      links: [
        { topic: "개인정보보호 중심 설계(Privacy by Design)", how: "PIA가 PbD의 사전 평가 실행 도구입니다." },
        { topic: "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)", how: "PIA의 위험 산정에 적용됩니다." },
      ],
      exam: "개인정보 영향평가(PIA)는 개인정보 시스템 구축 전에 흐름을 분석하고 침해 위험을 평가해 개선책을 설계에 반영하는 사전 예방 제도로, 공공기관은 일정 규모 시 의무다.",
    }, image: "/concept/book/sc-pia.png", easy: "개인정보 영향평가(PIA)는 개인정보 시스템을 새로 만들거나 크게 바꿀 때, 개인정보에 미칠 영향을 미리 조사하고 개선 방안을 도출하는 절차입니다. 사고가 나기 전에 위험을 점검하는 거죠. 대상 기준 숫자가 시험 단골입니다 — 5만명 이상 민감·고유식별정보, 50만명 이상 연계, 100만명 이상 정보주체(개인정보 보호법 제33조·시행령 제35조). 수행 절차 3단계 — ① 사전준비단계(사업계획 작성·예산 확보·영향평가 기관 선정) ② 영향평가 수행단계(평가계획·자료 수집·개인정보 흐름 분석·침해요인 분석·위험도 산정·개선계획·영향평가서 작성) ③ 이행 단계(개선계획 반영 점검·1년 이내 개선사항 이행 확인). 핵심은 '개인정보 흐름 분석 → 침해요인 도출 → 위험도 산정 → 개선'의 흐름과 '5만·50만·100만' 대상 숫자입니다. 공공기관은 일정 규모 이상이면 PIA가 의무입니다." },
"sc-isms-p": {
    guide: {
      hook: "정보보안(ISMS)과 개인정보보호를 하나로 묶은 국내 통합 관리체계 인증입니다.",
      scene: "예전엔 정보보안(ISMS)과 개인정보(PIMS)를 따로 인증받았습니다. ISMS-P는 이를 통합해, 관리체계 + 보호대책 + 개인정보 흐름을 한 번에 심사합니다. 개인정보를 안 다루면 ISMS만, 다루면 ISMS-P.",
      why: "'관리체계 인증'(제품 인증 CC와 다름)이라는 성격과 인증 구조(3영역), 의무 대상이 출제 핵심입니다. 국제 27001/27701에 대응하는 국내 제도입니다.",
      mechanism: "인증 기준 3영역: ①관리체계 수립·운영(정책·위험관리·내부감사 — PDCA), ②보호대책 요구사항(접근통제·암호·물리·운영 보안 등), ③개인정보 처리단계별 요구사항(수집·이용·제공·파기 — ISMS-P만). 의무 대상: ISP·IDC·일정 매출·이용자 수 이상 기업. KISA 인증.",
      map: [
        { as: "체계를 갖추고 돌리기", real: "관리체계(PDCA)", note: "①" },
        { as: "구체 보호 조치", real: "보호대책 요구사항", note: "②" },
        { as: "개인정보 생애주기 관리", real: "처리단계별 요구사항", note: "③ ISMS-P" },
        { as: "제품 아닌 조직 인증", real: "관리체계 인증", note: "CC와 구분" },
      ],
      usage: "국내 정보보호 의무 대상 기업의 인증입니다. 시험은 3영역 구조, ISMS vs ISMS-P, 의무 대상, 27001/27701과의 대응입니다.",
      links: [
        { topic: "ISO 27701", how: "국제 PIMS로 ISMS-P와 대응됩니다." },
        { topic: "정보보호 공시제도", how: "정보보호 현황을 대외 공개하는 짝 제도입니다." },
      ],
      exam: "ISMS-P는 관리체계·보호대책·개인정보 처리단계 3영역을 통합 심사하는 국내 관리체계 인증으로, 개인정보를 다루면 ISMS-P, 아니면 ISMS를 받는다.",
    }, image: "/concept/book/sc-isms-p.png", easy: "ISMS-P는 정보보호(ISMS)와 개인정보보호(PIMS)를 통합한 관리체계 인증으로, 기업의 보안 조치가 인증기준에 맞는지 KISA·인증기관이 증명하는 제도입니다. 법적 근거는 ISMS(정보통신망법 제47조)와 PIMS(개인정보보호법 제32조의2)를 합친 것이죠. 인증 기준은 3분야 — ① 관리체계 수립 및 운영(16개): PDCA 순환으로 관리체계 기반 마련·위험 관리·점검·개선 ② 보호대책 요구사항(64개): 정책·조직·자산·인적/물리 보안·접근통제·사고예방/재해복구 등 12개 분야 ③ 개인정보 처리단계별 요구사항(21개): 수집·보유이용·제공·파기·권리보호 등 개인정보 생명주기별. 여기서 정보보호만 받으려면 앞 2분야(16+64=80개)로 'ISMS', 개인정보까지 포함하면 3분야 전체로 'ISMS-P'입니다. '3분야 인증기준(16·64·21)'과 'ISMS vs ISMS-P 범위 차이'가 시험 포인트입니다." },
"sc-security-disclosure": {
    guide: {
      hook: "기업이 '우리는 보안에 이만큼 투자·대비한다'를 대외에 공개하게 하는 제도입니다.",
      scene: "재무제표처럼, 정보보호 투자액·전담인력·인증 현황·활동을 공시해 이용자·투자자가 그 기업의 보안 수준을 보고 판단하게 합니다. 시장의 힘으로 보안 투자를 유도하는 접근입니다.",
      why: "'규제 강제'가 아니라 '투명성·시장 압력'으로 보안을 끌어올린다는 발상이 핵심입니다. 의무 공시 대상과 공시 항목이 출제 포인트입니다.",
      mechanism: "공시 항목: 정보보호 투자액·정보기술 투자 대비 비중, 정보보호 전담인력·전체 인력 대비, 정보보호 인증(ISMS 등) 취득 현황, 관련 활동. 의무 대상: 일정 규모 이상 정보통신서비스 제공자 등. 자율 공시도 병행. 이용자의 알 권리·기업 간 비교를 지원.",
      map: [
        { as: "보안 투자 성적표 공개", real: "투자액·인력 공시", note: "투명성" },
        { as: "재무제표처럼", real: "정기 공시", note: "" },
        { as: "인증 현황 밝히기", real: "ISMS 등 인증 공시", note: "" },
        { as: "시장이 평가하게", real: "시장 압력 유도", note: "규제 대안" },
      ],
      usage: "정보보호 투자 활성화 정책의 축입니다. 시험은 공시 항목, 의무/자율 구분, ISMS-P와의 관계입니다.",
      links: [
        { topic: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)", how: "인증 현황이 공시 항목에 포함됩니다." },
        { topic: "정보보호제품 평가·인증(CC 평가·인증) 제도", how: "보안 투자·역량을 보여주는 또 다른 지표입니다." },
      ],
      exam: "정보보호 공시제도는 기업이 정보보호 투자·인력·인증 현황을 공개해 시장의 투명성과 압력으로 보안 투자를 유도하는 제도로, 일정 규모 기업은 의무 공시한다.",
    }, image: "/concept/book/sc-security-disclosure.png", easy: "정보보호 공시제도는 기업이 정보보호에 얼마나 투자하고 인력을 두고 활동하는지를 일반에 공개하는 제도입니다. 투자자·고객이 그 기업의 보안 수준을 알 수 있게 하는 거죠(정보보호산업의 진흥에 관한 법률 제13조). 자율 공시도 있지만 의무 대상이 정해져 있는데, 3가지 기준입니다 — ① 사업 분야(회선설비 보유 기간통신사업자·집적정보통신시설 사업자·상급종합병원·클라우드컴퓨팅 서비스제공자) ② 매출액(CISO 지정 대상 상장법인 중 매출 3,000억원 이상) ③ 이용자 수(일일평균 100만명 이상). 공시 항목 4가지 — 정보보호 투자 현황(투자액·비율), 정보보호 인력 현황(전담인력·CISO/CPO 지정), 정보보호 인증·평가·점검 사항, 이용자 정보보호 활동 현황. '의무 대상 3기준(사업분야·매출 3천억·이용자 100만)'과 '4대 공시항목(투자·인력·인증·활동)'이 시험 포인트입니다." },
"sc-anti-forensic": {
    guide: {
      hook: "디지털 포렌식 수사를 방해하려는 '증거 인멸·은닉' 기술 — 포렌식의 반대 축입니다.",
      scene: "수사관이 증거를 찾는다면, 안티포렌식은 그 증거를 지우거나(완전 삭제), 숨기거나(스테가노그래피·암호화), 가짜로 오염시켜(타임스탬프 조작) 분석을 어렵게 만듭니다.",
      why: "포렌식과 안티포렌식의 '창과 방패' 구도, 그리고 유형별 대응(로그 다중화·무결성·클라우드 보존)이 출제 포인트입니다. 증거의 무결성·연계보관을 위협하는 요인으로 다뤄집니다.",
      mechanism: "유형: 데이터 완전 삭제(와이핑·물리 파괴), 은닉(스테가노그래피·암호화·숨김 파티션·슬랙 공간), 흔적 조작(타임스탬프 변조·로그 삭제·안티디버깅), 포렌식 도구 무력화(악성 파일로 분석 방해). 대응: 실시간 로그 원격 다중 보존, 해시 무결성, 메모리 포렌식, 클라우드 로그 활용.",
      map: [
        { as: "완전히 지워 복구 불가", real: "와이핑·물리 파괴", note: "삭제" },
        { as: "그림 속에 숨기기", real: "스테가노그래피·암호화", note: "은닉" },
        { as: "시간 도장 위조", real: "타임스탬프·로그 조작", note: "흔적 조작" },
        { as: "지워도 남게 원격 보존", real: "로그 다중화·무결성", note: "대응" },
      ],
      usage: "침해사고·범죄 수사에서 대응해야 할 위협입니다. 시험은 안티포렌식 유형과 포렌식 대응(다중 보존·무결성), 창과 방패 구도입니다.",
      links: [
        { topic: "디지털 포렌식(Digital Forensic)", how: "안티포렌식이 방해하는 대상 절차입니다." },
        { topic: "전자증거개시제도(e-Discovery)", how: "증거 무결성 확보가 공통 관심입니다." },
      ],
      exam: "안티 포렌식은 완전 삭제·은닉·흔적 조작으로 디지털 포렌식을 방해하는 기술로, 실시간 원격 로그 보존과 해시 무결성으로 대응한다.",
    }, image: "/concept/book/sc-anti-forensic.png", easy: "안티 포렌식은 자신에게 불리한 디지털 증거를 훼손하거나 숨겨서 포렌식 수사를 방해하는 행위입니다. 디지털 포렌식(증거를 찾는 것)의 정반대죠. 기술은 두 갈래 — ① 데이터 삭제: 디가우징(강한 자기장으로 디스크를 물리적으로 영구 삭제), 와이핑(디스크를 난수나 0으로 덮어씀) ② 데이터 은닉·변조: 스테가노그래피(데이터의 존재 자체를 이미지 등에 숨김), 디스크 슬랙공간 은닉(파일시스템의 낭비 영역에 숨김), 데이터 암호화(BitLocker·TrueCrypt), 데이터 변조(파일 헤더 조작·날짜 수정). 이에 맞서는 대응기술 — 스테가노그래피 탐지(Staganalysis: 픽셀 색상변화 비교), 데이터 검색·탐지(인덱스 기반·BitWise·Hash 검증), 데이터 복구(유실 헤더 재구성·메모리/Swap 검색). '증거를 없애거나 숨기는 기술'과 그에 맞선 '탐지·복구 대응'이 창과 방패처럼 짝을 이룬다는 게 시험 포인트입니다." },
"sc-blockchain-crypto": {
    guide: {
      hook: "블록체인이 '위·변조 불가'를 어떻게 달성하는지를 암호기술로 정리한 가이드라인입니다.",
      scene: "블록체인의 신뢰는 마법이 아니라 세 가지 암호기술의 합작입니다 — 해시로 블록을 사슬로 엮고(변조 시 연쇄 붕괴), 전자서명으로 거래를 인증하고, 합의 알고리즘으로 분산 원장을 일치시킵니다.",
      why: "블록체인을 '분산 + 암호'로 분해해 이해하는 게 핵심입니다. 해시체인·머클트리·전자서명·합의(PoW/PoS)의 역할 분담과 양자내성·zk 확장이 출제 포인트입니다.",
      mechanism: "구성: 해시(이전 블록 해시를 포함해 사슬 형성 — 변조 시 이후 전부 불일치), 머클트리(다수 거래를 해시 트리로 요약해 무결성·경량 검증), 전자서명(ECDSA — 거래 주체 인증·부인방지), 합의(PoW 작업증명·PoS 지분증명 — 분산 원장 일치). 확장: zk 증명(프라이버시), PQC(양자내성 서명).",
      map: [
        { as: "블록을 사슬로 엮기", real: "해시체인", note: "변조 연쇄 붕괴" },
        { as: "거래 묶음 요약 검증", real: "머클트리", note: "경량 무결성" },
        { as: "거래에 도장", real: "전자서명(ECDSA)", note: "인증·부인방지" },
        { as: "분산 장부 합의", real: "합의(PoW/PoS)", note: "" },
      ],
      usage: "블록체인·CBDC·자산 토큰화 보안의 기준입니다. 시험은 해시·머클·서명·합의 역할 분담, zk·PQC 확장, 다중서명과의 연계입니다.",
      links: [
        { topic: "영지식증명(Zero Knowledge Proof)", how: "블록체인 프라이버시·확장의 핵심입니다." },
        { topic: "다중 서명(Multi Signature)", how: "블록체인 지갑 보안의 대표 기법입니다." },
      ],
      exam: "블록체인 암호기술 가이드라인은 해시체인·머클트리·전자서명·합의 알고리즘으로 분산 원장의 위·변조 불가와 인증을 달성하는 원리를 정리하며, zk·PQC로 확장된다.",
    }, image: "/concept/book/sc-blockchain-crypto.png", easy: "블록체인 암호기술 가이드라인은 블록체인의 보안성·무결성을 보장하기 위한 암호 기술과 적용 기준을 제시한 지침입니다. 사용되는 주요 암호 기술이 다양한데, 특히 서명 계열이 풍부합니다 — 다중 서명(여러 개체 서명 집계), 임계 서명(최소 인원 이상), 은닉 서명(문서를 가린 후 서명, 전자화폐·전자투표), 환 서명(그룹 중 하나의 서명만 드러내 익명성, CryptoNote), 영지식 증명(참·거짓 외 노출 없이 증명, Zcash·Monero), 안전한 다자간 계산, 비밀 분산, Accumulator 등. 가이드라인 7가지 — ① 암호 사용 기준(검증된 알고리즘) ② 계정 관리(키 안전 등록·교체) ③ 데이터 전송 보안(상호 인증) ④ 합의 프로토콜(안전·효율) ⑤ 원장(식별자·전자서명·해시값 포함) ⑥ 스마트 컨트랙트(결과 검증·취약점 없음) ⑦ 데이터베이스(신뢰성). '익명성 보장 서명 기술(은닉·환·영지식)'과 '7대 가이드라인'이 시험 포인트입니다." },
"sc-autonomous-vehicle": {
    guide: {
      hook: "해킹이 곧 '인명 사고'가 되는 자율주행차의 보안 취약점과 대응입니다.",
      scene: "자율주행차는 센서로 세상을 인식하고 통신으로 정보를 받는데, 이 둘이 다 공격면입니다. 표지판에 스티커를 붙여 카메라를 속이거나(적대적 공격), V2X 통신을 위조하거나, 내부 CAN 버스를 장악하면 조향·제동까지 노려집니다.",
      why: "'물리 안전과 직결'이라는 특수성과 공격면(센서·통신·내부망)별 위협·대응이 출제 핵심입니다. ISO 21434·CAN 보안·적대적 예제와 연결됩니다.",
      mechanism: "공격면·위협: 센서(카메라·라이다 스푸핑·적대적 패치로 오인식), V2X 통신(위·변조·재전송), 내부 네트워크(CAN 버스 무인증 → 메시지 주입), OTA 업데이트(변조), 텔레매틱스(원격 침입). 대응: 센서 융합·이상탐지, V2X 인증·PKI, CAN 침입탐지(IDS)·메시지 인증(MAC), OTA 서명, ISO 21434 생애주기 보안.",
      map: [
        { as: "표지판 스티커로 착시", real: "센서 적대적 공격", note: "센서 융합 방어" },
        { as: "가짜 교통정보 주입", real: "V2X 위·변조", note: "PKI 인증" },
        { as: "내부 배선 장악", real: "CAN 버스 메시지 주입", note: "차량 IDS·MAC" },
        { as: "가짜 업데이트", real: "OTA 변조", note: "코드 서명" },
      ],
      usage: "자율주행 상용화의 핵심 안전 이슈입니다. 시험은 공격면별 위협·대응 매핑, ISO 21434·26262와의 관계입니다.",
      links: [
        { topic: "차량 사이버 보안 국제 표준(ISO 21434)", how: "자율주행 보안의 기준 표준입니다." },
        { topic: "스마트시티 보안취약점 및 대응방안", how: "V2X·인프라 보안으로 연결됩니다." },
      ],
      exam: "자율주행차 보안은 센서 적대적 공격·V2X 위변조·CAN 메시지 주입·OTA 변조 등 물리 안전과 직결된 위협에 센서 융합·PKI·차량 IDS·코드 서명으로 대응한다.",
    }, image: "/concept/book/sc-autonomous-vehicle.png", easy: "자율주행 자동차 보안은 차량을 세 구간으로 나눠 위협과 대응을 봅니다. ① 차량 구간: 펌웨어 변조·차량 원격제어 해킹·CAN 위변조·불법 조작·DoS 위협 → Secure Boot·HSM(펌웨어 무결성), IDS·SecOC(CAN 위변조 탐지), Secure Diagnosis(원격 해킹 대응)로 방어 ② 통신채널(차량-차량·차량-인프라): 통신 도청·메시지 위변조·거짓정보·부인 위협 → IPSec·TLS/DTLS·WAVE 통신 보안 ③ 백엔드 인프라: 정보 유출·권한 상승·DoS 위협 → Firewall(WAF·UTM·NGFW)·DB 암호화·Access Control·EDR. 점검 절차는 계획 → 현황분석 → 취약점점검 → 위험도검토 → 대책수립 5단계입니다. 이 토픽은 ISO 21434(차량 사이버보안 표준)와 연계되며, '3구간(차량·통신·백엔드)별로 위협과 대응 기술이 다르다', '차량 구간의 Secure Boot·HSM·SecOC'가 시험 포인트입니다." },
"sc-cmmc": {
    guide: {
      hook: "미 국방 계약자가 '보안 요구를 지켰는지'를 등급으로 인증받는 성숙도 모델입니다.",
      scene: "국방 정보를 다루는 협력업체가 '우리는 안전하다'고 말만 하던 것을, 제3자가 성숙도 등급으로 인증하게 만든 제도입니다. 자기 선언 → 외부 인증으로 공급망 보안을 강제합니다.",
      why: "'공급망 보안을 인증 등급으로 강제'하는 접근과 성숙도 단계(레벨) 개념이 핵심입니다. NIST SP 800-171과의 관계, 공급망 공격 대응 축으로 출제됩니다.",
      mechanism: "레벨 체계(CMMC 2.0): Level 1(기초 — 연방계약정보 보호, 자체 평가), Level 2(고급 — 통제정보 CUI 보호, NIST SP 800-171 110개 통제, 제3자 인증), Level 3(전문가 — APT 대응, 정부 평가). 낮은 등급은 자가 평가, 높을수록 외부·정부 인증. 계약 요건으로 등급 요구.",
      map: [
        { as: "말이 아닌 등급 인증", real: "성숙도 레벨 인증", note: "자기선언→외부인증" },
        { as: "기초 위생부터", real: "Level 1(자체 평가)", note: "" },
        { as: "CUI 보호 110통제", real: "Level 2(SP 800-171)", note: "제3자 인증" },
        { as: "APT까지 대응", real: "Level 3(정부 평가)", note: "" },
      ],
      usage: "미 국방부 조달 공급망 보안 요건입니다. 시험은 CMMC 레벨 체계, NIST SP 800-171과의 관계, 공급망 보안 강제입니다.",
      links: [
        { topic: "공급망 공격(Supply Chain Attack)", how: "CMMC가 방어하려는 공급망 위협입니다." },
        { topic: "Secure Software Development Framework(SSDF)", how: "미국 공급망 보안 정책의 짝 프레임워크입니다." },
      ],
      exam: "CMMC는 미 국방 계약자의 정보보호 준수 수준을 성숙도 레벨로 제3자 인증하는 제도로, NIST SP 800-171 통제를 기반으로 공급망 보안을 강제한다.",
    }, image: "/concept/book/sc-cmmc.png", easy: "CMMC(사이버 보안 성숙도 모델 인증)는 미국 국방 계약자(방산업체)가 민감한 국방 정보를 다룰 자격이 있는지를 성숙도 등급으로 인증하는 제도입니다. 국방 공급망을 통한 정보 유출을 막으려는 거죠. 처음엔 CMMC 1.0으로 5등급이었는데 2021년 11월 2.0으로 간소화되어 3등급이 됐습니다 — Level 1 Foundational(연방 계약 정보 FCI 보호, NIST SP 800-171 일부, 자체평가), Level 2 Advanced(통제된 미분류 정보 CUI 협력, NIST SP 800-171, 자체+제3자 평가), Level 3 Expert(APT 지능형 지속 공격 위협 감소, NIST SP 800-171+800-172, 정부 주도 제3자 평가). 등급이 올라갈수록 평가 주체가 자체→제3자→정부로 엄격해집니다. 'FCI/CUI 정보 등급', 'NIST SP 800-171/172 기준', '평가 주체가 등급별로 다름'이 시험 포인트입니다." },
"sc-cyber-genome": {
    guide: {
      hook: "악성코드의 'DNA(유전자)'를 분석해 변종·출처·계보를 추적하는 기술입니다.",
      scene: "범죄 현장의 DNA로 범인 계보를 밝히듯, 악성코드의 코드 조각·행위 특징을 유전자처럼 추출해 '이 변종은 저 조직의 계열'임을 밝힙니다. 시그니처가 조금 바뀐 변종도 계보로 잡아냅니다.",
      why: "시그니처 기반 탐지가 변종에 무력한 한계를, '유전적 유사도'로 넘어선다는 발상이 핵심입니다. 악성코드 귀속(attribution)·변종 예측, AI 기반 분석이 출제 포인트입니다.",
      mechanism: "악성코드에서 특징(코드 블록·API 호출 시퀀스·문자열·행위)을 유전자로 추출 → 기존 DB와 유사도 비교로 계열·출처·변종 관계 도출 → 변종 자동 분류·미래 변종 예측. 정적·동적 분석과 ML을 결합. DARPA Cyber Genome 프로젝트가 기원.",
      map: [
        { as: "현장 DNA로 계보 추적", real: "악성코드 유전자 추출", note: "" },
        { as: "조금 바뀐 변종도 식별", real: "유사도 기반 계열 분류", note: "시그니처 한계 극복" },
        { as: "누구 소행인가", real: "귀속(attribution)", note: "" },
        { as: "다음 변종 예측", real: "변종 예측", note: "선제 대응" },
      ],
      usage: "위협 인텔리전스·APT 귀속 분석에 쓰입니다. 시험은 시그니처 탐지 한계 극복, 유전자 유사도·귀속, AI 분석 결합입니다.",
      links: [
        { topic: "APT(Advanced Persistent Threat) 공격", how: "공격 조직 귀속·변종 추적에 활용됩니다." },
        { topic: "디지털 포렌식(Digital Forensic)", how: "악성코드 분석·증거화와 연계됩니다." },
      ],
      exam: "사이버 게놈은 악성코드의 코드·행위 특징을 유전자처럼 추출·비교해 변종 분류와 출처 귀속을 수행하는 기술로, 시그니처 탐지의 변종 한계를 극복한다.",
    }, image: "/concept/book/sc-cyber-genome.png", easy: "사이버 게놈(Cyber genome)은 생물의 유전자(게놈)처럼, 악성코드의 '변하지 않는 고유 특성'을 추출해 DB화하고 해커의 과거 행동을 분석해 향후 공격을 추론·사전 차단하는 기법입니다. 변종 악성코드가 쏟아져도 근본 유전자는 비슷하다는 발상이죠. 분석은 3대 센트릭 관점 — ① 아티팩트 센트릭(Artifact-Centric): 악성코드 샘플·IP·도메인 같은 '증거 자체'를 리버스 엔지니어링·샌드박스·IoC로 분석 ② 케이스 센트릭(Case-Centric): '공격 사건'을 육하원칙(5W1H)과 MITRE ATT&CK로 재구성해 공격 캠페인 프로파일링 ③ 휴먼 센트릭(Human-Centric): 배후의 '해커 사람'을 OSINT·소셜 네트워크 분석(SNA)·자연어 처리(NLP)로 추적. 즉 증거(Artifact)→사건(Case)→사람(Human)으로 시야를 넓혀갑니다. '악성코드 유전자 추출로 변종 사전 차단', '3대 센트릭 분석'이 시험 포인트입니다." },
"sc-digital-forensic": {
    guide: {
      hook: "디지털 증거를 '법정에서 인정받게' 수집·분석하는 과학수사 — 무결성이 생명입니다.",
      scene: "PC·폰·서버에서 증거를 찾되, 원본을 건드리면 법정에서 무효가 됩니다. 그래서 원본을 그대로 복제(이미징)하고, 해시로 '안 바뀌었음'을 증명하며, 누가 언제 다뤘는지 기록(연계보관)합니다.",
      why: "'증거능력'을 위한 5원칙(정당성·무결성·재현·신속·연계보관)이 출제 핵심입니다. 절차 단계와 안티포렌식·e-Discovery와의 관계가 포인트입니다.",
      mechanism: "절차: 준비 → 증거 수집(원본 쓰기방지·이미징) → 보존(해시 무결성·연계보관) → 분석(파일·로그·메모리·타임라인) → 보고. 5원칙: 정당성(적법 수집), 무결성(해시로 불변 증명), 재현성(같은 결과 재현), 신속성(휘발 증거 우선), 연계보관성(Chain of Custody). 유형: 디스크·메모리·네트워크·모바일·클라우드 포렌식.",
      map: [
        { as: "원본 그대로 복제", real: "쓰기방지 이미징", note: "무결성" },
        { as: "안 바뀌었다는 증명", real: "해시 검증", note: "핵심" },
        { as: "누가 언제 다뤘나", real: "연계보관(CoC)", note: "" },
        { as: "휘발 증거 먼저", real: "신속성(메모리 우선)", note: "" },
      ],
      usage: "침해사고 대응·범죄 수사·내부 감사에 쓰입니다. 시험은 5원칙, 절차 단계, 유형별 포렌식, 안티포렌식·e-Discovery와의 관계입니다.",
      links: [
        { topic: "안티 포렌식(Anti-forensic)", how: "포렌식을 방해하는 반대 축입니다." },
        { topic: "클라우드 포렌식(Cloud Forensic)", how: "클라우드 환경으로 확장된 포렌식입니다." },
      ],
      exam: "디지털 포렌식은 정당성·무결성·재현·신속·연계보관 5원칙에 따라 디지털 증거를 수집·분석해 증거능력을 확보하는 과학수사로, 원본 이미징과 해시 무결성이 핵심이다.",
    }, image: "/concept/book/sc-digital-forensic.png", easy: "디지털 포렌식은 컴퓨터·네트워크 등 디지털 자료를 법정에 제출할 증거로 확보하는 절차와 방법입니다. 범죄 수사에서 디지털 증거를 다루는 과학수사죠. 반드시 지켜야 할 5대 원칙 [정재신연무] — 정당성(적법 절차로 획득, 위법 수집 증거는 효력 상실), 재현(같은 조건이면 같은 결과), 신속성(휘발성 데이터가 사라지기 전 빠르게), 연계 보관성(증거의 이동·보관 과정이 명확히 추적 가능, Chain of Custody), 무결성(위·변조 없음). 절차 5단계 [수증보분보] — 수사준비 → 증거물 획득(Disk imaging·Snap Shot) → 보관 및 이송 → 분석 및 조사(TimeLine·Hash·log 분석) → 보고서 작성. 특히 연계 보관성(CoC)이 법정에서 증거 능력을 좌우하는 핵심입니다. 안티 포렌식(증거 훼손)의 반대이고, e-Discovery(민사·사전)와 달리 형사·사후 수사라는 점이 시험 포인트입니다." },
"sc-cloud-forensic": {
    guide: {
      hook: "'내 서버가 아닌' 클라우드에서 증거를 수집하는 포렌식 — 통제권이 사업자에게 있는 게 난제입니다.",
      scene: "내 PC라면 디스크를 그대로 떼어 분석하지만, 클라우드는 물리 장비에 접근할 수 없고, 자원이 여러 고객과 섞여 있으며(멀티테넌시), 로그도 사업자가 쥐고 있습니다. 그래서 수집 자체가 특수한 절차를 요구합니다.",
      why: "'통제권 분리·멀티테넌시·휘발성·관할'이라는 클라우드 특유의 난점이 출제 핵심입니다. CSP 협조·API 기반 수집, 책임 공유 모델과 연결됩니다.",
      mechanism: "난점: 물리 접근 불가(사업자 소유), 멀티테넌시(타 고객 데이터 격리 필요), 데이터 휘발·분산(자동 확장·삭제), 관할·법적 문제(국외 데이터센터), 로그 의존(CSP가 제공). 접근: CSP 협조·SLA에 포렌식 조항, API·관리콘솔로 스냅샷·로그 수집, 무결성·연계보관 유지, 책임 공유에 따른 역할 분담.",
      map: [
        { as: "장비를 못 뗌", real: "물리 접근 불가", note: "CSP 협조 필요" },
        { as: "옆 고객과 섞임", real: "멀티테넌시 격리", note: "" },
        { as: "금방 사라지는 자원", real: "휘발·자동 삭제", note: "신속 수집" },
        { as: "사업자 로그 의존", real: "API·SLA 기반 수집", note: "" },
      ],
      usage: "클라우드 침해사고 대응의 특수 절차입니다. 시험은 클라우드 포렌식 난점, CSP 책임 공유, API·SLA 기반 수집입니다.",
      links: [
        { topic: "디지털 포렌식(Digital Forensic)", how: "기본 원칙을 클라우드로 확장합니다." },
        { topic: "클라우드 컴퓨팅 취약점, 대응기술", how: "책임 공유 모델을 공유합니다." },
      ],
      exam: "클라우드 포렌식은 통제권 분리·멀티테넌시·휘발성·관할 문제 때문에 CSP 협조와 API·SLA 기반으로 증거를 수집하며 무결성·연계보관을 유지하는 포렌식이다.",
    }, image: "/concept/book/sc-cloud-forensic.png", easy: "클라우드 포렌식은 클라우드에 있는 전자적 증거물을 수집·분석해 사법기관에 제출하는 과학수사 기법입니다. 일반 디지털 포렌식과 결정적으로 다른 점은 데이터가 '내 손 안의 기기'가 아니라 여러 국가에 분산된 클라우드 서버에 가상화되어 있다는 것이죠. 그래서 '사법관할권'과 '국제 공조'가 최대 이슈입니다. 조사 활동 — ① 대상 확인(SaaS/PaaS/IaaS 중 어떤 서비스인지) ② 증거 확보(로그인 정보·웹 브라우저 포렌식) ③ 협조 요구(클라우드 사업자의 물리적 위치 확인, 국제형사사법 공조법 활용, 이용자 동의 하에 ID·Password 확보) ④ 증거 수집(통신비밀보호법 준수, 계정 접근 차단, 파일 카빙·스테가노그래피) ⑤ 증거 분석(클라우드 시그니처 분석). 국제 공조가 거절되면 클라우드 상세분석이 불가능해서, Client 단말에 남은 클라우드 시그니처(사용 기록)를 분석합니다. '사법관할권·국제 공조 이슈'가 시험 포인트입니다." },
"sc-smart-city": {
    guide: {
      hook: "도시 전체가 연결된 만큼, 해킹 한 번이 교통·전력·상수도를 마비시킬 수 있습니다.",
      scene: "스마트시티는 수많은 센서·CCTV·교통신호·에너지 관리가 네트워크로 얽혀 있습니다. 한 곳의 취약점이 도시 서비스로 연쇄 파급되고, 시민 데이터도 대량 수집돼 프라이버시 위험이 큽니다.",
      why: "'대규모 융복합 인프라의 연쇄 위험 + 프라이버시'가 특수성입니다. 계층별(디바이스·네트워크·플랫폼·서비스) 위협과 대응, 개인정보 보호가 출제 포인트입니다.",
      mechanism: "위협: 디바이스(IoT 센서·CCTV 취약·물리 접근), 네트워크(대규모 통신 도청·교란), 플랫폼(통합관제 침해 시 도시 마비), 서비스·데이터(시민 개인정보·위치 대량 노출). 대응: IoT 보안 내재화, 네트워크 분리·암호화, 통합관제 접근통제·이상탐지, 개인정보 최소화·비식별, 회복탄력성(중요 서비스 이중화).",
      map: [
        { as: "센서·CCTV 취약", real: "디바이스 계층 위협", note: "IoT 보안" },
        { as: "관제 뚫리면 도시 마비", real: "플랫폼 계층 위협", note: "접근통제·이상탐지" },
        { as: "시민 데이터 대량 수집", real: "프라이버시 위험", note: "비식별·최소화" },
        { as: "핵심 서비스 이중화", real: "회복탄력성", note: "" },
      ],
      usage: "스마트시티 구축의 보안 설계 기준입니다. 시험은 계층별 위협·대응 매핑, 프라이버시, 회복탄력성입니다.",
      links: [
        { topic: "자율주행 자동차 보안취약점 및 대응방안", how: "V2X·도시 인프라 보안으로 연결됩니다." },
        { topic: "사이버 레질리언스(Cyber Resilience)", how: "도시 서비스 회복탄력성의 근거입니다." },
      ],
      exam: "스마트시티 보안은 디바이스·네트워크·플랫폼·서비스 계층의 연쇄 위협과 시민 프라이버시 위험에 IoT 보안·접근통제·비식별·회복탄력성으로 대응한다.",
    }, image: "/concept/book/sc-smart-city.png", easy: "스마트시티 보안은 도시 전체를 IoT·CCTV·관제 시스템으로 연결한 융합 인프라를 지키는 것입니다. 한 곳(예: CCTV 하나)이 뚫리면 도시 전체로 파급되기 때문에 계층별로 나눠 방어합니다. ① 서비스 계층: 개인정보 유출·서비스 위변조·앱 취약점 → 인증·인가 강화·데이터 암호화·시큐어 코딩 ② 플랫폼 계층: 관제 시스템 해킹·통합 플랫폼 침해·API 취약점 → 통합 보안관제(SIEM)·API 보안(WAAP)·이상탐지 ③ 인프라 계층: IoT 디바이스 해킹·CCTV 침해·네트워크 도청·물리 공격 → IoT 보안 인증·네트워크 분리·전송 암호화(TLS)·물리 보안. 핵심은 도시가 하나로 연결된 만큼 계층별 다중 방어와 제로트러스트가 필요하다는 것이고, 스마트팩토리·디지털트윈과 '계층별 위협-대응'이라는 유사한 구조로 출제된다는 점입니다." },
"sc-smart-factory": {
    guide: {
      hook: "공장의 IT와 OT가 연결되면서, 사이버 공격이 '생산 중단·안전 사고'로 이어집니다.",
      scene: "예전엔 공장 제어망(OT)이 외부와 단절돼 안전했지만, 스마트팩토리는 IT와 연결돼 사무망을 통한 침입이 생산라인·로봇까지 도달합니다. 멈추면 손실, 오작동하면 안전 사고입니다.",
      why: "'IT-OT 융합의 경계 붕괴'와 가용성·안전 우선(IEC 62443)이 핵심입니다. 계층 모델(퍼듀)·망 분리·이상탐지가 출제 포인트입니다.",
      mechanism: "위협: IT-OT 연결로 사무망 침해가 제어망 전파, 레거시 PLC·SCADA의 무인증·구식 프로토콜, 공급망(설비·SW) 오염, 랜섬웨어로 생산 중단. 대응: 퍼듀 모델 기반 계층 분리(Zone/Conduit), OT 전용 IDS·이상탐지, 원격접속 통제, 자산 가시성, IEC 62443 적용, 안전 계통 분리.",
      map: [
        { as: "사무망 통해 라인까지", real: "IT-OT 경계 붕괴", note: "핵심 위협" },
        { as: "낡은 PLC 무인증", real: "레거시 제어기기 취약", note: "" },
        { as: "멈추면 손실·오작동 사고", real: "가용성·안전 우선", note: "IEC 62443" },
        { as: "구역 나눠 통로만 검문", real: "Zone/Conduit 분리", note: "대응" },
      ],
      usage: "제조 DX 보안의 기준입니다. 시험은 IT-OT 융합 위협, 퍼듀 모델·망 분리, IEC 62443 적용입니다.",
      links: [
        { topic: "IEC 62443", how: "스마트팩토리 보안의 기준 표준입니다." },
        { topic: "공급망 공격(Supply Chain Attack)", how: "설비·SW 공급망 오염이 주요 위협입니다." },
      ],
      exam: "스마트팩토리 보안은 IT-OT 융합으로 사무망 침해가 제어망·생산라인으로 전파되는 위협에 퍼듀 모델 기반 망 분리·OT 이상탐지·IEC 62443으로 대응한다.",
    }, image: "/concept/book/sc-smart-factory.png", easy: "스마트팩토리 보안은 공장의 IT(경영·정보 시스템)와 OT(생산 설비 제어)가 융합된 환경을 지키는 것입니다. 가장 중요한 포인트는 IT 보안과 OT 보안의 우선순위가 다르다는 것 — IT는 기밀성이 최우선이지만, OT는 '가용성과 안전(Safety)'이 최우선입니다. 공장이 멈추면 생산 손실은 물론 인명 피해로 이어지니까요. 계층별로 — ① 애플리케이션(IT): MES/ERP 해킹·랜섬웨어 → 접근통제·백업·EDR ② 플랫폼/네트워크: 통신 도청·프로토콜 취약점 → IT-OT 망 분리·산업용 방화벽·이상탐지 ③ 제어(OT): PLC/SCADA 조작·펌웨어 변조·가동 중단 → IEC 62443 적용·제어시스템 무결성 검증·화이트리스트·안전(Safety) 연계. 산업제어시스템 보안 표준인 IEC 62443이 근거가 되고, 'IT-OT 망 분리'와 'OT는 가용성·안전 우선'이 시험 포인트입니다." },
"sc-cloud-computing": {
    guide: {
      hook: "'내 것이 아닌 남의 인프라'를 쓰는 만큼, 보안 책임이 나뉘고 새로운 취약점이 생깁니다.",
      scene: "클라우드는 편하지만, 물리 인프라는 사업자가, 그 위 설정·데이터는 내가 책임집니다(책임 공유). 대부분의 사고는 사업자 잘못이 아니라 '내가 잘못 설정한' 공개 버킷·과권한 계정에서 납니다.",
      why: "'책임 공유 모델'과 서비스 유형(IaaS/PaaS/SaaS)별 책임 경계가 최다 출제 포인트입니다. 멀티테넌시·설정 오류·API 취약점과 CSPM/CWPP 대응이 핵심입니다.",
      mechanism: "취약점: 잘못된 구성(공개 스토리지·과권한 IAM — 사고 1위), 멀티테넌시(격리 실패·부채널), 안전하지 않은 API, 계정 탈취, 데이터 유출·상주, 가시성 부족. 책임 공유: IaaS(사업자=물리·가상화, 이용자=OS 위 전부), PaaS(플랫폼까지 사업자), SaaS(대부분 사업자). 대응: CSPM(설정)·CWPP(워크로드)·CIEM(권한)·암호화·최소 권한.",
      map: [
        { as: "내가 문을 안 잠금", real: "잘못된 구성(공개 버킷)", note: "사고 1위" },
        { as: "누가 어디까지 책임지나", real: "책임 공유 모델", note: "IaaS/PaaS/SaaS" },
        { as: "옆 세입자와 격리 실패", real: "멀티테넌시 취약", note: "" },
        { as: "설정·워크로드·권한 감시", real: "CSPM·CWPP·CIEM", note: "대응" },
      ],
      usage: "클라우드 도입 보안의 기본입니다. 시험은 책임 공유(IaaS/PaaS/SaaS 경계), 설정 오류, CSPM/CWPP 대응입니다.",
      links: [
        { topic: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)", how: "클라우드 위협의 핵심 대응 도구입니다." },
        { topic: "SSRF(Server-Side Request Forgery)", how: "클라우드 메타데이터 탈취가 대표 위협입니다." },
      ],
      exam: "클라우드 컴퓨팅 보안은 책임 공유 모델 하에서 잘못된 구성·멀티테넌시·API 취약점에 대응하며, IaaS/PaaS/SaaS별 책임 경계와 CSPM·CWPP가 핵심이다.",
    }, image: "/concept/book/sc-cloud-computing.png", easy: "클라우드 컴퓨팅 취약점은 기술 측면과 기술 외 측면으로 나눠 봅니다. 기술 측면 — ① 기존 보안 위협 상속: DoS/DDoS·네트워크 위변조·인증 탈취(일반 시스템 위협을 그대로 물려받음) → TLS·SSH·AES-256 암호화·SIEM ② 가상화를 통한 위협(클라우드 고유): 하이퍼바이저 감염(가상머신 관리자가 뚫리면 그 위 VM 전부 위험)·가상머신 간 상호연결(한 VM에서 다른 VM으로 전파)·이동성 문제(vMotion으로 VM이 옮겨다니며 보안 경계 모호) → VMI(VM Introspection) 침입탐지·Agentless 보안·VM 간 독립성 확보(Isolation). 기술 외 측면 — 관리(멀티테넌시로 한 고객 피해가 확산·내부자 위험) → ISO 27001·SLA 정량화, 법제도(국가별 법체계 상이·보안책임 귀속 모호) → 국제표준 준수. '가상화 고유 위협(하이퍼바이저·VM 간·vMotion)'과 'ISO 27017 연계'가 시험 포인트입니다." },
"sc-digital-twin": {
    guide: {
      hook: "현실과 똑같은 가상 쌍둥이 — 그 연결 고리(데이터·모델·동기화)가 새로운 공격면이 됩니다.",
      scene: "디지털 트윈은 현실 설비를 가상으로 복제해 예측·제어합니다. 문제는 둘을 잇는 데이터가 조작되면 가상 판단이 틀리고, 그 틀린 판단이 현실 설비를 잘못 제어해 물리 피해로 이어진다는 점입니다.",
      why: "'가상-현실 양방향 연결의 위협 전파'가 특수성입니다. 프로세스 단계(생성·전달·분석·이해·행동)별 보안이 교재 표의 출제 포인트입니다.",
      mechanism: "단계별 위협: 생성(모델 위·변조), 전달(센서·통신 데이터 조작·중간자), 분석(AI 모델 오염·적대적 공격), 이해(오판 유도), 행동(제어 명령 변조 → 물리 피해). 대응: 데이터 무결성·인증, 통신 암호화, 모델 보호·검증, 명령 인증, 이상탐지, 물리-가상 정합성 검증.",
      map: [
        { as: "가짜 모델 심기", real: "생성 단계 변조", note: "" },
        { as: "센서 데이터 조작", real: "전달 단계 중간자", note: "무결성·인증" },
        { as: "AI 판단 오염", real: "분석 단계 적대적 공격", note: "" },
        { as: "틀린 제어가 현실 피해", real: "행동 단계 명령 변조", note: "명령 인증" },
      ],
      usage: "제조·에너지·도시 디지털 트윈 보안의 기준입니다. 시험은 5단계 프로세스별 위협·대응 매핑, 물리 피해 전파입니다.",
      links: [
        { topic: "스마트팩토리 보안취약점 및 대응방안", how: "제조 디지털 트윈 보안으로 연결됩니다." },
        { topic: "스마트시티 보안취약점 및 대응방안", how: "도시 트윈의 위협 전파와 유사합니다." },
      ],
      exam: "디지털 트윈 보안은 생성·전달·분석·이해·행동 단계에서 데이터·모델·명령 변조가 가상 오판을 거쳐 현실 피해로 전파되는 위협에 무결성·인증·이상탐지로 대응한다.",
    }, image: "/concept/book/sc-digital-twin.png", easy: "디지털 트윈은 현실의 사물·시스템을 가상에 똑같이 복제한 것이라, 그 보안은 데이터가 흐르는 프로세스 5단계별로 봅니다. ① 생성(Create): 데이터 유출·위변조·수집 디바이스 취약점 → 암·복호화·인증(Authentication)과 인가(Authorization) 강화 ② 전달(Communicate): 시스템·인프라·네트워크 공격 → 제로트러스트 아키텍처·접근통제 ③ 종합과 분석(Aggregate & Analyze): 위·변조 데이터 학습·AI 권한 탈취 → AI 기반 보안 운영 자동화(AIOps)·자동 진단 ④ 이해(Insight): 가상환경(AR/VR) 위협·분석 데이터 위변조 → 지능형 보안 관제 ⑤ 행동(Act): 현실에 중대한 위협(기기 오작동·센서 조작)·정보 대량 유출 → 자기통제 보호 기술·프라이버시 보존기술(PETs). 가장 위험한 단계가 '행동(Act)'인데, 가상의 조작이 실제 기기 오작동으로 이어져 물리적 피해가 나기 때문입니다. '생성→전달→분석→이해→행동' 프로세스별 위협-대응이 시험 포인트입니다." },
"sc-n2sf": {
    guide: {
      hook: "'일률적 망분리'의 경직성을 걷어내고 업무 중요도별로 보안을 차등 적용하는 국가 망 보안체계입니다.",
      scene: "예전엔 업무망과 인터넷망을 무조건 물리적으로 분리했습니다(경직·비효율). N2SF는 업무를 기밀(C)·민감(S)·공개(O) 등급으로 나눠, 등급에 맞는 보안만 차등 적용해 클라우드·AI 도입을 유연하게 합니다.",
      why: "'획일적 망분리 → 등급별 차등 통제'라는 전환이 핵심입니다. C/S/O 분류와 적용 절차, 기존 망분리와의 비교가 출제 포인트입니다.",
      mechanism: "C/S/O 분류: 기밀(C — 안보·국방·국민 안전 직결), 민감(S — 비공개, 침해 가능), 공개(O — 그 외). 절차: 준비 → C/S/O 등급분류 → 위협식별 → 보안대책 수립 → 적절성 평가·조정(국정원 검토). 기존 완전 분리 대비, 등급별로 분리·논리·개방을 차등 적용해 유연성 확보.",
      map: [
        { as: "무조건 물리 분리 탈피", real: "일률적 망분리 개선", note: "핵심 전환" },
        { as: "기밀·민감·공개로 등급화", real: "C/S/O 분류", note: "" },
        { as: "등급 맞춤 보안", real: "차등 보안 적용", note: "" },
        { as: "클라우드·AI 도입 가능", real: "유연성 확보", note: "목적" },
      ],
      usage: "공공부문 클라우드·AI 도입의 보안 프레임워크입니다. 시험은 C/S/O 분류, 적용 절차, 기존 망분리와의 비교입니다.",
      links: [
        { topic: "제로트러스트 가이드라인 2.0", how: "등급·컨텍스트 기반 차등 통제라는 흐름을 공유합니다." },
        { topic: "클라우드 컴퓨팅 취약점, 대응기술", how: "공공 클라우드 도입의 보안 근거입니다." },
      ],
      exam: "N2SF는 업무를 기밀(C)·민감(S)·공개(O) 등급으로 분류해 보안을 차등 적용하는 국가 망 보안체계로, 일률적 망분리의 경직성을 개선해 클라우드·AI 도입을 유연화한다.",
    }, image: "/concept/book/sc-n2sf.png", easy: "국가 망 보안체계(N2SF, National Network Security Framework)는 각급 공공기관의 업무를 중요도별로 등급을 나눠, 등급에 맞게 보안 대책을 '차등' 적용하는 프레임워크입니다. 기존의 일률적인 물리적 망분리가 AI·클라우드 도입을 막는 경직성 문제를 개선한 것이죠. 업무정보를 C/S/O 3등급으로 분류 — 기밀 정보(C, Classified): 안보·국방·외교·수사 등 기밀 / 민감 정보(S, Sensitive): 비공개지만 침해 시 개인·국가 이익 침해 가능 / 공개 정보(O, Open): 그 외 모든 정보. 적용 절차 5단계 — 준비(Prepare) → C/S/O 등급분류(Categorize) → 위협식별(Identify) → 보안대책 수립(Select) → 적절성 평가·조정(Assess), 마지막에 국가정보원 보안성 검토. 기존은 무조건 물리 분리였다면, N2SF는 기밀(C)은 완전 분리하되 공개(O)는 인터넷 활용을 허용하는 식으로 유연합니다. 'C/S/O 등급 차등 적용', '5단계 절차'가 시험 포인트입니다." },
"sc-owasp-agentic": {
    guide: {
      hook: "자율 AI 에이전트의 신종 위협 15종(T1~T15) — 'Top 10'이 아니라 15개인 게 함정입니다.",
      scene: "에이전트는 계획하고, 도구를 부리고, 다른 에이전트와 협업합니다. 그 세 능력이 그대로 공격면이 되어, OWASP가 위협을 15개로 정리했습니다. 실행 파이프라인 순서로 묶으면 외워집니다 — 기억·목표·도구·권한·감사·인간·다중.",
      why: "★출처 주의★ 흔히 'OWASP Top 10 for Agentic AI'라 부르지만 실제 문서는 15종(T1~T15)이고, Top 10은 LLM 애플리케이션용(LLM01~10)이 따로 있습니다. 15종의 파이프라인 매핑과 금융보안원 6단계와의 관계가 핵심입니다.",
      mechanism: "T1~T15: 기억(T1 메모리 오염·T5 연쇄 환각) → 목표(T6 목표 조작·T7 기만) → 도구(T2 도구 오용·T4 자원 과부하·T11 RCE) → 권한(T3 권한 침해·T9 신원 사칭) → 감사(T8 추적 불가) → 인간(T10 개입 무력화·T15 인간 조종) → 다중(T12 통신 오염·T13 악성 에이전트·T14 인적 공격). 대응: 메모리 격리·의도 검증·도구 허용목록·최소 권한·감사 로그·인간 승인·통신 서명.",
      map: [
        { as: "기억에 거짓 심기", real: "T1·T5(메모리·환각)", note: "메모리 격리" },
        { as: "목표를 벗어나게", real: "T6·T7(목표·기만)", note: "의도 검증" },
        { as: "도구로 악행", real: "T2·T4·T11(도구·실행)", note: "허용목록·샌드박스" },
        { as: "'Top 10' 아니라 15개", real: "출처 주의", note: "LLM Top 10과 구분" },
      ],
      usage: "에이전트 앱 보안 설계 체크리스트입니다. 시험은 15종의 파이프라인 매핑, LLM Top 10과의 구분, 금융보안원 6단계와의 관계입니다.",
      links: [
        { topic: "AI Agent 보안위협", how: "이 15종의 국내 금융권 6단계 재분류입니다." },
        { topic: "OWASP Top 10 for LLM Application 2025", how: "혼동하기 쉬운 별개 문서(LLM01~10)입니다." },
      ],
      exam: "OWASP Agentic AI 위협은 자율 에이전트의 신종 위협 15종(T1~T15)으로, 기억·목표·도구·권한·감사·인간·다중 파이프라인에 매핑되며 LLM Top 10과 구분해야 한다.",
    }, easy: "AI 에이전트는 챗봇과 다릅니다. 스스로 계획을 세우고, 도구(API·터미널·결제)를 직접 호출하고, 다른 에이전트와 협업합니다. 그 세 가지가 그대로 새로운 공격면이 됩니다. OWASP가 이걸 15개 위협(T1~T15)으로 정리했습니다. 실행 파이프라인 순서로 묶으면 외워집니다 — ①기억: 메모리 오염(T1)으로 허위 정보를 심어두면 이후 판단이 계속 틀어지고, 그 허위가 퍼지면 연쇄 환각(T5)이 됩니다. ②목표·추론: 의도 훼손·목표 조작(T6)으로 원래 시킨 일에서 벗어나게 하고, 오정렬·기만 행위(T7)로 허용 안 된 방법을 쓰게 만듭니다. ③도구·실행: 도구 오용(T2), 자원 과부하(T4), 예기치 않은 원격코드 실행(T11). ④권한·신원: 권한 침해(T3), 신원 사칭(T9). ⑤감사: 부인·추적 불가(T8) — 로그가 없으면 사고가 나도 누구 책임인지 못 밝힙니다. ⑥인간 감독: 승인 요청을 폭주시켜 사람이 못 보게 만드는 인간 개입 무력화(T10), 반대로 에이전트가 사람을 꼬드기는 인간 조종(T15). ⑦다중 에이전트: 통신 오염(T12), 악성 에이전트(T13), 신뢰 관계를 악용한 인적 공격(T14). ★시험에서 조심할 것★ — 'OWASP Top 10 for Agentic AI'라고 부르는 사람이 많지만 실제 문서는 15개입니다. Top 10은 LLM 애플리케이션용(LLM01~LLM10)이 따로 있습니다. 답안에는 'OWASP Agentic AI 위협 15종'으로 쓰세요." },
"ai-iso-25059": {
    guide: {
      hook: "SW 품질 표준(25010)을 'AI용으로 확장'한 국제 품질 표준입니다.",
      scene: "AI는 같은 입력에도 답이 달라지고(비결정성) 데이터에 성능이 좌우돼, 기존 SW 품질 표준으로는 평가가 안 됩니다. ISO/IEC 25059는 25010의 8대 품질특성을 AI 특성에 맞게 확장해 AI 품질을 평가하게 합니다.",
      why: "25010 8특성의 AI용 확장 속성(강건성·기능 적응성 등)이 출제 핵심입니다.",
      mechanism: "기반: 25010(SQuaRE) 8특성[기신사효유이호보] — 기능 적합성·신뢰성·사용성·성능 효율성·유지보수성·이식성·호환성·보안성. AI 확장 하위속성: 신뢰성의 강건성(Robustness — 다양·이상 조건에서 안정), 기능적 적응성·정확성, 사용성의 사용자 통제·투명성, 그리고 비결정성·데이터 의존성 반영. 25010을 대체가 아닌 확장. AI 신뢰성·품질 평가 근거. 23894(위험)·22989(개념)과 연계.",
      map: [
        { as: "25010 8특성 기반", real: "품질 모델", note: "" },
        { as: "이상 조건서 안정", real: "강건성(Robustness)", note: "신뢰성" },
        { as: "비결정·데이터 의존", real: "AI 특성 반영", note: "" },
        { as: "확장(대체 아님)", real: "25010 연계", note: "" },
      ],
      usage: "AI 시스템 품질 평가입니다. 시험은 8특성 확장, 강건성입니다.",
      links: [
        { topic: "ISO/IEC 25010:2023", how: "확장의 기반이 되는 SW 품질 모델입니다." },
        { topic: "ISO/IEC 42001 (AI 경영시스템)", how: "AI 거버넌스 표준과 연계됩니다." },
      ],
      exam: "ISO/IEC 25059는 25010의 8대 품질특성을 AI의 비결정성·데이터 의존성에 맞춰 확장한 표준으로, 강건성 등 AI 특화 속성으로 품질을 평가한다.",
    }, image: "/concept/book/ai-iso-25059.png", easy: "기존 소프트웨어 품질 표준(ISO/IEC 25010, SQuaRE)만으로는 AI를 평가할 수 없습니다. 같은 입력에도 답이 달라지는 비결정성, 학습 데이터에 성능이 좌우되는 데이터 의존성 때문입니다. 그래서 25010의 8대 특성을 AI용으로 확장한 것이 25059입니다. 8특성 두음은 [기신사효유이호보] — 기능 적합성, 신뢰성, 사용성, 성능 효율성, 유지보수성, 이식성, 호환성, 보안성. AI 때문에 새로 붙거나 확장된 하위 속성이 시험 포인트입니다: 신뢰성의 강건성(다양한 조건에서 안정적으로 작동하는가), 사용성의 사용자 제어성·투명성(동작을 제어할 수 있고 작동 원리를 이해할 수 있는가), 보안성의 개입 가능성·책임성(사용자가 개입해 조치할 수 있고, 행동을 추적해 책임을 물을 수 있는가), 기능 적합성의 기능 정확성·적응성. AI 표준 계보로 묶어 외우세요 — 22989(용어·개념), 23053(ML 프레임워크), 23894(위험관리), 42001(AI 경영시스템), 25059(품질모델)." },
"dx-ap2": {
    guide: {
      hook: "AI 에이전트가 내 대신 결제할 때 '정말 내가 시켰나'를 위임장 3장으로 증명합니다(구글).",
      scene: "비서에게 심부름을 시키되, '무엇을 사라(Intent)', '이걸 담았다(Cart)', '이렇게 결제한다(Payment)'는 위임장 3장에 매번 내 서명을 받아 두는 것입니다. 나중에 문제가 나면 어디까지 승인했는지 되짚을 수 있습니다.",
      why: "에이전트 커머스에서 '검증 가능한 위임'을 어떻게 구현하나가 핵심입니다. 위임장 3종과 역할 6주체, ACP·UCP와의 비교가 출제 포인트입니다.",
      mechanism: "위임장(Mandate) 3종: Intent(구매 의도), Cart(장바구니 확정), Payment(결제 방식) — 각 단계에 사용자 서명 + 검증 가능한 디지털 자격증명(VDC). 역할 6주체: 사용자-사용자 에이전트-자격증명 제공자-판매자 엔드포인트-판매자 결제프로세스-네트워크/발급사. 기술축: 보안(VC)·연동(A2A·MCP·x402)·거래(스마트계약·EVM)·결제(스테이블코인·카드).",
      map: [
        { as: "무엇을 사라는 위임장", real: "Intent Mandate", note: "" },
        { as: "이걸 담았다는 위임장", real: "Cart Mandate", note: "" },
        { as: "이렇게 결제한다는 위임장", real: "Payment Mandate", note: "" },
        { as: "매 단계 서명으로 증명", real: "검증 가능 자격증명(VDC)", note: "사후 증명" },
      ],
      usage: "AI 쇼핑 에이전트의 결제 표준입니다. 시험은 위임장 3종·6주체, AP2(구글)·ACP(OpenAI)·UCP 비교입니다.",
      links: [
        { topic: "ACP(Agentic Commerce Protocol)", how: "OpenAI 주도의 경쟁 상거래 프로토콜입니다." },
        { topic: "UCP(Universal Commerce Protocol)", how: "결제는 AP2에 위임하는 상거래 데이터 규격입니다." },
      ],
      exam: "AP2는 AI 에이전트 결제에서 Intent·Cart·Payment 위임장 3종에 사용자 서명과 검증 가능 자격증명을 붙여 '누가 승인했는지'를 증명하는 구글 주도 결제 프로토콜이다.",
    }, image: "/concept/book/dx-ap2.png", easy: "AI 에이전트가 내 대신 물건을 살 때, '정말 이 사람이 시킨 게 맞나'를 증명하는 결제 규약입니다(구글 주도). 핵심은 위임장(Mandate) 3장 — Intent(무엇을 사라는 의도), Cart(무엇을 담았는지), Payment(어떻게 결제하는지). 각 장에 사용자의 서명이 붙어서, 나중에 문제가 생기면 '어디까지 내가 승인했는지'를 되짚을 수 있습니다. 역할은 6개로 나뉩니다: 사용자 → 사용자 에이전트(쇼핑 담당) → 자격증명 제공자(결제 수단 관리) → 판매자 엔드포인트 → 판매자 결제프로세스 → 네트워크·발급사. 기술 축은 보안(Verifiable Credential), 연동(A2A·MCP·x402), 거래(스마트계약·EVM·Solana), 결제(스테이블코인·카드·계좌이체) 4가지입니다." },
"dx-ucp": {
    guide: {
      hook: "AI 에이전트가 여러 쇼핑몰을 하나의 규격으로 상대하게 만드는 상거래 프로토콜입니다(구글).",
      scene: "쇼핑몰마다 다른 API를 에이전트가 다 배우면 비효율입니다. UCP는 상품 탐색부터 결제·주문까지의 데이터 교환을 표준화해, 에이전트가 한 규격으로 여러 몰과 거래하게 합니다. 결제 실행은 AP2에 맡깁니다.",
      why: "'상거래 데이터 교환 규격(UCP)'과 '결제 실행(AP2)'의 분업이 핵심입니다. 계층 구조와 전송 방식(REST·MCP·A2A·JSON-RPC), 구성요소가 출제 포인트입니다.",
      mechanism: "계층: 소비자 접점(Gemini 등) → UCP 코어(Shopping Service·Capabilities·Extensions) → 전송(REST·MCP·A2A·JSON-RPC) → 보안·결제(AP2, OAuth·PCI-DSS) → 판매자 백엔드(기존 인프라). 구성요소: Checkout(결제 처리), Identity Linking(OAuth 대리 행동), Order(웹훅 상태 알림), Payment Token Exchange(안전한 토큰 교환).",
      map: [
        { as: "여러 몰을 한 규격으로", real: "표준 상거래 데이터 교환", note: "핵심" },
        { as: "결제는 AP2에 위임", real: "보안·결제 계층 연동", note: "분업" },
        { as: "대리 행동 권한", real: "Identity Linking(OAuth)", note: "" },
        { as: "배송·반품 상태 알림", real: "Order(웹훅)", note: "" },
      ],
      usage: "AI 커머스 생태계의 데이터 표준입니다. 시험은 계층 구조, AP2와의 역할 분담, 전송 방식입니다.",
      links: [
        { topic: "AP2(Agent Payment Protocol)", how: "UCP가 결제 실행을 위임하는 프로토콜입니다." },
        { topic: "ACP(Agentic Commerce Protocol)", how: "OpenAI 주도의 경쟁 상거래 프로토콜입니다." },
      ],
      exam: "UCP는 AI 에이전트가 여러 쇼핑몰과 상품 탐색·결제·주문 데이터를 표준 교환하게 하는 구글 주도 프로토콜로, 결제 실행은 AP2에 위임한다.",
    }, image: "/concept/book/dx-ucp.png", easy: "AI 에이전트가 여러 쇼핑몰을 돌아다니며 상품을 찾고 주문까지 하려면 쇼핑몰마다 다른 API를 다 배워야 하는데, 그걸 하나의 표준으로 통일한 게 UCP입니다(구글 주도). 계층으로 보면 위에서부터 소비자 접점(Gemini·AI Mode 등) → UCP 프로토콜 코어(Shopping Service·Capabilities·Extensions) → 전송 방식(REST API·MCP·A2A·JSON-RPC) → 보안·결제 계층(AP2, OAuth 2.0·PCI-DSS) → 판매자 백엔드(기존 인프라 그대로). 구성요소 4개는 Checkout(결제 처리), Identity Linking(OAuth로 대리 행동), Order(웹훅 기반 배송·반품·환불 알림), Payment Token Exchange(PSP와 안전한 토큰 교환). 결제 실행은 AP2에 맡기고 UCP는 데이터 교환 규격을 맡는 분업 관계가 시험 포인트입니다." },
"dx-acp": {
    guide: {
      hook: "ChatGPT 안에서 바로 물건을 사게 하는 OpenAI 주도 상거래 프로토콜 — 위험을 '범위 제한 토큰'으로 막습니다.",
      scene: "AP2가 위임장 3장으로 권한을 증명한다면, ACP는 '이 금액·이 판매자에만 쓸 수 있는' 토큰으로 위험을 좁힙니다. 셀러가 붙일 것은 REST 엔드포인트 4개뿐이라 도입이 가볍습니다.",
      why: "'범위 제한 결제 토큰(SPT)'으로 위험을 한정하는 접근이 AP2(위임장)와의 대비 포인트입니다. 구성요소와 REST 4엔드포인트가 출제됩니다.",
      mechanism: "구성: Shared Payment Token(SPT — 특정 금액·판매자로 범위 제한), Delegated Payment(자격증명 토큰화·사용제약 후 위임), REST 4엔드포인트(주문 Create·Update·Complete·Cancel), 보안 요구(API 버전 헤더·HTTPS 필수). 흐름: 구매자→AI Agent(LLM)→결제(Stripe·PayPal 등)→판매자.",
      map: [
        { as: "금액·판매자 제한 토큰", real: "Shared Payment Token(SPT)", note: "위험 한정" },
        { as: "제약 걸어 위임", real: "Delegated Payment", note: "" },
        { as: "셀러는 4개만 구현", real: "REST 4엔드포인트", note: "경량 도입" },
        { as: "위임장 아닌 토큰으로", real: "AP2와 대비", note: "안전장치 차이" },
      ],
      usage: "ChatGPT 인앱 커머스의 기반입니다. 시험은 SPT·4엔드포인트, AP2(위임장)와 ACP(범위 토큰)의 안전장치 차이입니다.",
      links: [
        { topic: "AP2(Agent Payment Protocol)", how: "위임장 기반 대비 범위 토큰 기반의 차이입니다." },
        { topic: "UCP(Universal Commerce Protocol)", how: "구글 주도의 상거래 데이터 규격입니다." },
      ],
      exam: "ACP는 구매자가 AI 에이전트로 안전하게 쇼핑하도록 범위 제한 결제 토큰(SPT)과 REST 4엔드포인트로 구현한 OpenAI 주도 상거래 프로토콜이다.",
    }, image: "/concept/book/dx-acp.png", easy: "OpenAI가 주도하는 에이전틱 상거래 프로토콜로, ChatGPT 같은 대화창 안에서 물건을 찾아 바로 사게 하는 것이 목표입니다. AP2가 '위임장 3장'으로 권한을 증명한다면, ACP는 '범위를 좁힌 토큰'으로 위험을 한정합니다 — 공유 결제 토큰(SPT)은 특정 금액과 특정 판매자에만 쓸 수 있게 제한되고, 위임 결제(Delegated Payment)는 자격증명을 토큰화한 뒤 사용 제약을 걸어 판매자에게 넘깁니다. 셀러가 구현할 것은 REST 엔드포인트 4개(주문 Create·Update·Complete·Cancel)뿐이고, 모든 요청에 API 버전 헤더와 HTTPS가 필수입니다. AP2·UCP·ACP를 '누가 주도하고, 안전장치를 어떻게 거는가'로 비교하면 답안이 정리됩니다." },
"dx-stablecoin": {
    guide: {
      hook: "가격이 안 튀는 암호화폐 — 법정화폐·실물에 값을 묶어 결제 수단이 되게 합니다.",
      scene: "비트코인은 가격이 요동쳐 결제엔 부적합합니다. 스테이블 코인은 달러 같은 자산에 1:1로 값을 고정해, 블록체인의 장점(즉시 송금)은 살리고 변동성은 없앱니다. 발행(Mint)과 소각(Burn)이 대칭 흐름입니다.",
      why: "담보 유형 3종과 발행·소각의 대칭 절차, Terra 사태(무담보형 디페깅)·준비금 증명이 출제 핵심입니다. AP2 등 에이전트 결제의 정산 수단으로도 연결됩니다.",
      mechanism: "유형: 법정화폐 담보형(달러 예치 후 발행 — Tether·USDC), 암호화폐 담보형(코인 초과담보 — MakerDao), 무담보 알고리즘형(공급량 알고리즘 조절 — Terra, 디페깅 위험). 발행(Mint): 입금 확인→토큰 발행→블록체인 전송. 소각(Burn): 소각 요청→허가 서명(Permit)→토큰 소각→법정화폐 송금. 신뢰 근거는 준비금 증명(Proof of Reserves).",
      map: [
        { as: "달러 예치 후 발행", real: "법정화폐 담보형", note: "USDC·Tether" },
        { as: "코인 초과담보", real: "암호화폐 담보형", note: "MakerDao" },
        { as: "알고리즘만으로 조절", real: "무담보 알고리즘형", note: "Terra 붕괴 위험" },
        { as: "찍기와 없애기 대칭", real: "발행(Mint)·소각(Burn)", note: "" },
      ],
      usage: "블록체인 결제·정산·에이전트 커머스 수단입니다. 시험은 담보 3유형, 발행·소각 절차, Terra 사태·준비금 증명입니다.",
      links: [
        { topic: "AP2(Agent Payment Protocol)", how: "에이전트 결제의 정산 수단으로 쓰입니다." },
        { topic: "블록체인 암호기술 가이드라인", how: "발행·소각이 블록체인 위에서 동작합니다." },
      ],
      exam: "스테이블 코인은 법정화폐·실물·알고리즘으로 가치를 고정한 암호화폐로 발행(Mint)·소각(Burn)이 대칭이며, 무담보형은 디페깅 위험 때문에 준비금 증명이 쟁점이다.",
    }, image: "/concept/book/dx-stablecoin.png", easy: "비트코인처럼 가격이 요동치면 결제 수단으로 못 쓰니까, 달러 같은 법정화폐나 실물 자산에 가격을 묶어 둔 암호화폐입니다. 유형 3가지가 답안 뼈대 — 법정화폐 담보형(달러를 예치하고 그만큼 토큰 발행: Tether, True USD), 암호화폐 담보형(비트코인·이더리움을 제3기관에 예치: BitShare, MakerDao), 무담보 알고리즘형(담보 없이 알고리즘으로 공급량 조절: BaseCoin, Terra). 절차는 대칭입니다 — 발행(Mint)은 은행 입금 확인 → 주문 생성 → 입금 확인 → 상태 갱신 → 민팅 개시 → 작업 실행 → 블록체인 전송 → 결과 대기 → 기록 저장, 소각(Burn)은 소각 요청 → 허가 서명(Permit) → burnFromWithPermit 실행 → 결과 확인 → 법정화폐 송금 → 최종 기록. Terra 붕괴로 무담보형의 디페깅 위험과 준비금 증명(Proof of Reserves)이 쟁점이 됐습니다." },
"dx-data-space": {
    guide: {
      hook: "데이터를 한곳에 모으지 않고 '각자 쥔 채 규칙만 합의해' 주고받는 연합형 생태계입니다.",
      scene: "중앙 플랫폼에 데이터를 다 올리면 주권을 잃습니다. 데이터 스페이스는 각자 데이터를 보유한 채, 공통 규칙과 신뢰 체계로만 교환합니다. 핵심어는 '데이터 주권' — 넘겨줘도 이용 조건은 내가 정합니다.",
      why: "'중앙집중 vs 연합형(데이터 주권)'의 대비가 핵심입니다. 거버넌스 원칙과 2계층(비즈니스·기술) 구조, K-Data Space가 출제 포인트입니다.",
      mechanism: "거버넌스 6원칙: 데이터 주권 보장, 연합·분산 구조, 신뢰·보안, 상호운용성, 투명성, 거버넌스 유연성. 2계층: 비즈니스 계층(Use Case·참여자 등록·권한·데이터 제품), 기술 계층(표준 API·커넥터, DID/VC/eIDAS 신뢰관리, Policy-as-Code, 연합 카탈로그, 클리어링하우스, NFT·스테이블코인 결제). 유럽 GAIA-X·IDSA의 국내판이 K-Data Space.",
      map: [
        { as: "각자 쥔 채 교환", real: "연합·분산 구조", note: "중앙집중 대비" },
        { as: "넘겨도 조건은 내가", real: "데이터 주권", note: "핵심어" },
        { as: "무엇을 거래하나", real: "비즈니스 계층", note: "" },
        { as: "어떻게 거래하나", real: "기술 계층(커넥터·DID)", note: "" },
      ],
      usage: "산업 데이터 협업·마이데이터 생태계에 적용됩니다. 시험은 데이터 주권, 2계층 구조, GAIA-X·K-Data Space입니다.",
      links: [
        { topic: "데이터 상호 운용성 & 데이터 이동권", how: "데이터 교환·이동을 뒷받침하는 개념입니다." },
        { topic: "스테이블 코인(Stable coin)", how: "데이터 거래 정산 수단으로 결합됩니다." },
      ],
      exam: "데이터 스페이스는 데이터를 중앙 집중하지 않고 데이터 주권을 유지한 채 공통 규칙·신뢰 체계로 교환하는 연합형 생태계로, 비즈니스·기술 2계층으로 구성된다.",
    }, image: "/concept/book/dx-data-space.png", easy: "데이터를 한 군데 몰아넣는 중앙 플랫폼 대신, 각자 데이터를 쥔 채로 규칙만 합의해서 주고받는 연합형 생태계입니다. 핵심어는 '데이터 주권' — 내 데이터를 넘겨도 이용 조건은 내가 정합니다. 거버넌스 원칙 6가지는 데이터 주권 보장, 연합형·분산형 구조, 신뢰·보안 확보, 상호운용성 확보, 투명성 확보, 거버넌스 유연성·자율성. 구조는 2단입니다 — 비즈니스 계층(Use Case 개발, 참여자 등록·계약, 접근 권한 설정, 데이터 제품 제공)과 기술 계층(표준 API·커넥터, DID·VC·eIDAS 신뢰관리, Policy-as-Code, 연합 카탈로그, 메타데이터 브로커, 클리어링하우스, NFT·스테이블코인 전자결제). 유럽 GAIA-X·IDSA의 국내판이 K-Data Space입니다." },
"dx-dslm": {
    guide: {
      hook: "범용 LLM을 특정 산업 데이터로 좁혀 정확도를 끌어올린 도메인 특화 언어 모델입니다.",
      scene: "범용 LLM은 넓게 알지만 금융·의료·법률에선 깊이가 부족합니다. DSLM은 해당 도메인 데이터로 다시 학습·조정해 그 분야에서 훨씬 정확한 답을 냅니다. Vertical AI·sLLM과 같은 계보입니다.",
      why: "'범용→도메인 특화'의 방법(DAPT·RAG·PEFT)이 핵심입니다. 데이터·학습·성능 기술의 역할 분담이 출제 포인트입니다.",
      mechanism: "만드는 흐름: Foundation Model + 범용 데이터 →파인튜닝(DAPT: 도메인 특화 사전학습)→ 도메인 특화 언어 모델(+ RAG·RLHF). 기술: 데이터(고품질 말뭉치 큐레이션·벡터DB), 학습(DAPT·RLHF), 성능(RAG로 지식베이스 연동·Prompt Chain·PEFT/LoRA·QLoRA 경량 튜닝).",
      map: [
        { as: "도메인 데이터로 재학습", real: "DAPT(도메인 특화 사전학습)", note: "" },
        { as: "지식베이스 연동 답변", real: "RAG", note: "" },
        { as: "가볍게 튜닝", real: "PEFT(LoRA·QLoRA)", note: "" },
        { as: "Vertical AI 계보", real: "sLLM·수직 AI", note: "" },
      ],
      usage: "금융·의료·법률 전문 AI 서비스에 쓰입니다. 시험은 DAPT·RAG·PEFT 역할, Vertical AI·sLLM과의 관계입니다.",
      links: [
        { topic: "데이터 스페이스(Data Space)", how: "도메인 데이터 확보·거래 생태계와 연결됩니다." },
        { topic: "AI OS(Artificial Intelligence Operating System)", how: "LLM 중심 컴퓨팅 환경의 응용입니다." },
      ],
      exam: "DSLM은 범용 LLM을 도메인 데이터로 DAPT·RAG·PEFT를 통해 특화해 정확도를 높인 모델로, Vertical AI·sLLM과 같은 계보다.",
    }, image: "/concept/book/dx-dslm.png", easy: "범용 LLM은 넓게 알지만 금융·의료·법률 같은 분야에서는 깊이가 부족합니다. 그래서 해당 도메인 데이터로만 다시 학습·조정해 정확도를 끌어올린 모델이 DSLM입니다. 만드는 흐름은 Foundation Model + 범용 데이터에서 시작해 → 도메인 데이터로 파인튜닝(DAPT, 도메인 특화 사전학습) → 도메인 특화 언어 모델, 여기에 RAG/RLHF를 얹습니다. 기술은 세 갈래 — 데이터(고품질 말뭉치 큐레이션, 벡터 DB), 학습(DAPT, RLHF), 성능(RAG로 지식베이스 연동, Prompt Chain으로 단계적 사고, PEFT/LoRA·QLoRA로 가볍게 튜닝). Vertical AI·sLLM과 같은 계보로 묶어 외우면 됩니다." },
"sc-ai-privacy-risk": {
    guide: {
      hook: "AI가 학습데이터를 암기해 개인정보를 뱉거나 자동결정으로 권리를 약화시키는 위험을 체계로 관리합니다.",
      scene: "AI는 학습한 데이터를 그대로 기억했다가 노출하거나, 합성 콘텐츠로 사람을 해치거나, 자동화된 결정으로 개인 권리를 약화시킵니다. 개인정보보호위원회가 이 위험을 4단계 절차로 관리하게 한 모델입니다.",
      why: "'AI 생애주기별 프라이버시 위험'을 식별·측정·경감하는 절차와, 관리적·기술적 조치의 분담이 출제 핵심입니다. PIA·ISMS-P와 묶여 'AI 시대 개인정보 보호'로 출제됩니다.",
      mechanism: "4단계: ①AI 유형·용례 파악(목적·범위·처리 데이터) → ②리스크 식별(기획·개발 단계: 부적법 수집·부적절 보관 / 서비스 단계: 학습데이터 암기·유출·합성콘텐츠·자동결정) → ③리스크 측정(발생확률·영향 정량·정성) → ④리스크 경감(관리적: 출처관리·레드팀·영향평가 / 기술적: 전처리·합성데이터·필터링·차분 프라이버시).",
      map: [
        { as: "무엇을 하는 AI인가부터", real: "① 유형·용례 파악", note: "" },
        { as: "학습데이터 암기·유출", real: "② 리스크 식별", note: "단계별" },
        { as: "확률×영향 점수화", real: "③ 리스크 측정", note: "" },
        { as: "관리+기술로 줄이기", real: "④ 리스크 경감", note: "레드팀·차분 프라이버시" },
      ],
      usage: "생성형 AI 서비스의 개인정보 컴플라이언스 기준입니다. 시험은 4단계 절차, 단계별 위험, 관리적·기술적 조치, PIA와의 관계입니다.",
      links: [
        { topic: "개인정보 영향평가(Privacy Impact Assessment)", how: "AI 위험 평가와 연계되는 사전 평가입니다." },
        { topic: "AI Agent 보안위협", how: "AI 위협의 보안 축과 짝을 이룹니다." },
      ],
      exam: "AI 프라이버시 리스크 관리는 AI 유형 파악·리스크 식별·측정·경감의 4단계로 학습데이터 암기·자동결정 등 위험을 관리적·기술적 조치로 다루는 개인정보위 모델이다.",
    }, image: "/concept/book/sc-ai-privacy-risk.png", easy: "AI가 학습데이터를 그대로 기억했다가 개인정보를 뱉거나, 합성 콘텐츠로 사람을 해치거나, 자동화된 결정으로 권리를 약화시키는 일이 실제로 벌어집니다. 그래서 개인정보보호위원회가 내놓은 리스크 관리 체계입니다. 절차 4단계 — ① AI의 유형·용례 파악(목적·범위·처리 데이터부터 확정) → ② 리스크 식별(생애주기별로) → ③ 리스크 측정(발생확률과 영향을 정량·정성 평가, 수용 가능 여부와 우선순위 판단) → ④ 리스크 경감(관리적 방안·기술적 방안 검토·도입). 식별 단계는 둘로 나뉩니다: 기획·개발 단계(부적법한 학습데이터 수집, 부적절한 보관, 가치망 다양화로 책임 복잡화)와 서비스 제공 단계(학습데이터 암기·유출, 악의적 합성콘텐츠, 자동화 결정, 대중 감시·민감정보 추론). 경감은 관리적 조치(출처·이력 관리, 레드팀 운영, 영향평가)와 기술적 조치(전처리, 합성데이터, 필터링, 차분 프라이버시)로 갈립니다." },
"dx-data-interop": {
    guide: {
      hook: "'기술이 되게 하는' 상호 운용성과 '개인이 요구하는' 이동권 — 데이터 활용의 두 축입니다.",
      scene: "상호 운용성은 시스템이 달라도 데이터를 주고받게 하는 기술적 능력, 이동권은 내 데이터를 내가 지정한 곳으로 옮기라고 요구할 권리입니다. 하나는 수단, 하나는 권리입니다.",
      why: "'수단(상호운용성) vs 권리(이동권)'의 관계 정리가 핵심입니다. 상호운용성 3요소와 이동권 3요소, 관련 표준이 출제 포인트입니다.",
      mechanism: "상호 운용성 3요소: 기술적 안정성(MCP·API), 구문적 표준화(XML·JSON), 의미적 일관성(표준용어·온톨로지) — 표준 ISO 11179·19941·23053. 이동권 3요소: 데이터 유형(자발·관찰·파생·획득 중 무엇), 수혜자(개인이냐 기업이냐), 운영 방식(일시적 전송이냐 실시간이냐). 상호운용성이 이동권 실현의 기술 기반.",
      map: [
        { as: "달라도 주고받게", real: "상호 운용성(수단)", note: "MCP·XML·온톨로지" },
        { as: "내 데이터 옮길 권리", real: "데이터 이동권(권리)", note: "" },
        { as: "무엇을·누구를·어떻게", real: "이동권 3요소", note: "유형·수혜자·방식" },
        { as: "수단이 권리를 실현", real: "상호운용성 → 이동권", note: "관계" },
      ],
      usage: "마이데이터·데이터 스페이스의 기반 개념입니다. 시험은 상호운용성 3요소·이동권 3요소, 수단과 권리의 관계입니다.",
      links: [
        { topic: "데이터 스페이스(Data Space)", how: "상호운용성·이동권이 데이터 교환을 뒷받침합니다." },
        { topic: "데이터 상호 운용성 & 데이터 이동권", how: "동일 주제의 교재 서브노트입니다." },
      ],
      exam: "데이터 상호 운용성은 시스템 간 데이터 호환을 보장하는 기술적 수단이고, 데이터 이동권은 개인이 자기 데이터를 옮길 권리로, 수단이 권리를 실현하는 관계다.",
    }, image: "/concept/book/dx-data-interop.png", easy: "두 개념을 한 세트로 묻는 토픽입니다. 상호 운용성은 '기술이 되게 하는 것' — 시스템이 달라도 데이터를 주고받을 수 있게 기술적 안정성(MCP·API), 구문적 표준화(XML·JSON), 의미적 일관성(표준용어·온톨로지)을 갖추는 능력이고, 표준으로 ISO/IEC 11179(메타데이터)·19941(클라우드 상호운용성)·23053(AI 프레임워크)이 붙습니다. 이동권은 '개인이 요구할 수 있는 것' — 의료·금융·행정·여행·에너지·통신 등 내 데이터를 내가 지정한 곳으로 옮기라고 요구할 권리입니다. 이동권 3요소는 데이터 유형(자발적·관찰·파생·획득 중 무엇을 보낼지), 수혜자(개인이냐 기업이냐), 운영 방식(한 번 받는 일시적 전송이냐, 상호운용성 기반 실시간 전송이냐). 상호운용성이 수단이고 이동권이 권리라는 관계로 정리하면 답안이 섭니다." },
"sc-ai-agent-threat": {
    guide: {
      hook: "스스로 판단하고 도구를 부리는 AI 에이전트의 실행 6단계에서 생기는 신종 위협입니다(금융보안원).",
      scene: "에이전트는 결정하고, 기억하고, 도구를 호출하고, 인증받고, 사람 개입을 받고, 다른 에이전트와 협업합니다. 이 파이프라인 각 단계가 그대로 공격면이 됩니다 — 목표를 조작당하거나, 메모리가 오염되거나, 권한을 탈취당합니다.",
      why: "'에이전트 실행 파이프라인 6단계별 위협·대응'이 핵심 구조입니다. OWASP Agentic AI(15종)의 국내 금융권 재분류라는 관계가 출제 포인트입니다.",
      mechanism: "6단계 위협: ①자율적 의사결정(목표 조작·기만·추적불가) ②메모리 활용(메모리 오염·연쇄 환각) ③외부 도구 호출(도구 오용·권한 탈취·자원 과부하·RCE) ④인증·권한(신원 사칭) ⑤인간 개입(개입 무력화·사용자 기만) ⑥다중 에이전트(통신 오염·악성 에이전트). 대응: 단계별로 일관성 검증·메모리 격리·최소 권한·감사·인간 승인·서명 검증.",
      map: [
        { as: "목표를 바꿔치기", real: "① 자율 의사결정 위협", note: "일관성 검증" },
        { as: "기억에 거짓 심기", real: "② 메모리 오염", note: "세션 격리" },
        { as: "도구로 악행 유도", real: "③ 도구 오용·권한 탈취", note: "최소 권한" },
        { as: "승인 폭주로 감독 마비", real: "⑤ 인간 개입 무력화", note: "승인 상한" },
      ],
      usage: "금융권 AI 에이전트 도입 보안 기준입니다. 시험은 6단계 위협·대응 매핑, OWASP Agentic AI(15종)와의 관계입니다.",
      links: [
        { topic: "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)", how: "이 6단계의 국제 원본(15종)입니다." },
        { topic: "OWASP Top 10 for LLM Application 2025", how: "LLM 위협이 에이전트로 확장된 계보입니다." },
      ],
      exam: "AI Agent 보안위협은 자율 의사결정·메모리·도구 호출·인증·인간 개입·다중 에이전트 6단계별 위협을 일관성 검증·메모리 격리·최소 권한·감사로 대응하는 금융보안원 모델이다.",
    }, image: "/concept/book/sc-ai-agent-threat.png", easy: "AI 에이전트가 스스로 판단하고 도구를 호출하며 다른 에이전트와 협업하는 순간, 기존 보안 모델로는 못 막는 위협이 생깁니다. 금융보안원이 에이전트의 실행 파이프라인 6단계로 나눠 정리했습니다. ①자율적 의사결정 — 목표 조작, 오작동·기만적 행동, 부인·추적 불가. ②메모리 활용 — 메모리 오염, 연쇄 환각 공격. ③외부 도구·시스템 호출 — 도구 오용, 권한 탈취, 자원 과부하, 원격코드 실행. ④인증·권한 관리 — 신원 사칭·위장. ⑤인간 개입 — 개입 무력화, 사용자 기만. ⑥다중 에이전트 — 통신 오염, 사용자 기만, 악성 에이전트. 대응도 같은 단계로 붙습니다: 목표 일관성 검증·출력 검증·암호화 로깅 / 신뢰 출처만 학습·세션 메모리 격리·확률적 사실 검증 / 사전 승인 도구 목록·역할 기반 최소 권한 / 다중 인증 / 자동 승인 제한·과도 승인 탐지 / 서명 검증 네트워크·비정상 접근 탐지." },
"dx-ai-dlc-sdd": {
    guide: {
      hook: "AI가 개발을 주도하는 두 방법론 — '생명주기를 돌리는' AI-DLC와 '명세에서 파생하는' SDD입니다.",
      scene: "AI-DLC는 AI가 계획·코딩을 주도하고 사람이 검증하는 개발 방식이고, SDD는 기계가 읽는 명세(Spec)를 단일 진실 원천으로 삼아 코드·테스트·문서를 자동 파생합니다. 프로세스냐 산출물 기준이냐로 갈립니다.",
      why: "'AI-DLC(프로세스) vs SDD(산출물 근거)'의 대비와 각 구조가 핵심입니다. AI-DLC의 3단 계층(인텐트·유닛·볼트)과 SDD 4절차가 출제 포인트입니다.",
      mechanism: "AI-DLC: 인텐트(높은 수준 목표) > 유닛(독립 측정 가능 작업 묶음, DDD 서브도메인/스크럼 에픽) > 볼트(스프린트보다 짧은 최소 반복 주기)의 3단 계층 — AI 주도, 사람 검증. SDD: 명세를 단일 진실 원천(SSoT)으로 정의(Specify)→설계(Plan)→분해(Break Down)→구현(Implement)의 4절차로 코드·테스트·문서를 파생.",
      map: [
        { as: "AI가 돌리고 사람이 검증", real: "AI-DLC(프로세스)", note: "" },
        { as: "목표>작업묶음>최소반복", real: "인텐트>유닛>볼트", note: "3단 계층" },
        { as: "명세가 유일한 근거", real: "SDD 단일 진실 원천", note: "" },
        { as: "정의>설계>분해>구현", real: "SDD 4절차", note: "" },
      ],
      usage: "바이브 코딩·AI 페어 프로그래밍 시대의 개발 방법론입니다. 시험은 AI-DLC vs SDD(프로세스 vs 산출물), 3단 계층·4절차입니다.",
      links: [
        { topic: "AI OS(Artificial Intelligence Operating System)", how: "AI 중심 개발·실행 환경으로 연결됩니다." },
        { topic: "도메인 특화 언어 모델(Domain-Specific Language Model)", how: "AI 개발을 뒷받침하는 모델 축입니다." },
      ],
      exam: "AI-DLC는 AI가 계획·코딩을 주도하고 사람이 검증하는 개발 프로세스(인텐트·유닛·볼트)이고, SDD는 명세를 단일 진실 원천으로 코드·테스트를 파생하는 방법론이다.",
    }, image: "/concept/book/dx-ai-dlc-sdd.png", easy: "AI가 개발을 주도하는 두 가지 방법론을 한 세트로 묻습니다. AI-DLC는 '생명주기를 어떻게 돌릴까' — AI가 계획 수립과 코딩을 주도하고 사람이 검증합니다. 구조는 3단 계층: 인텐트(Intent, 달성할 높은 수준의 목표) 안에 유닛(Unit, 독립적으로 측정 가능한 작업 묶음 — DDD 서브도메인·스크럼 에픽과 유사)이 있고, 유닛 안에 볼트(Bolt, 스프린트보다 짧은 최소 반복 주기)가 여러 개 들어갑니다. SDD는 '무엇을 근거로 만들까' — 기계가 읽을 수 있는 명세(Spec)를 단일 진실 원천(Single Source of Truth)으로 삼고, 거기서 코드·테스트·문서를 자동 파생합니다. 절차는 정의(Specify) → 설계(Plan) → 분해(Break Down) → 구현(Implement). 프로세스냐 산출물 기준이냐로 갈라 쓰면 비교가 깔끔합니다." },
"dx-aios": {
    guide: {
      hook: "CPU·RAM 대신 'LLM과 컨텍스트'를 자원으로 관리하는 차세대 운영체제입니다.",
      scene: "지금 OS가 프로세스에 CPU·메모리를 나눠 주듯, AI OS는 에이전트에 LLM과 컨텍스트를 나눠 줍니다. 대응으로 외우면 쉽습니다 — CPU+RAM↔LLM+Context, Kernel↔AI OS Kernel, Process↔Agent.",
      why: "'전통 OS 3요소(프로세스·메모리·파일)가 에이전트·컨텍스트·벡터저장소로 치환'되는 대응이 핵심입니다. 구성요소와 전통 OS 비교표가 출제 포인트입니다.",
      mechanism: "구성: LLM(LLMCore 인스턴스 추상화·LLMScheduler 이기종 GPU 스케줄링), Data Manager(Context Manager 추론 중단점 저장·복원, Memory Manager 단기·장기, Storage Manager 벡터DB), Tool Manager(도구 표준화·Access Manager 접근제어). 전통 OS 대비: 자원 예약을 스레드→LLM 요청 단위, 컨텍스트 스위칭을 체크포인트→스냅샷·복원 경로로.",
      map: [
        { as: "CPU+RAM ↔ LLM+Context", real: "자원 치환", note: "핵심 대응" },
        { as: "프로세스 스케줄링 ↔ LLM 스케줄링", real: "LLMScheduler", note: "" },
        { as: "컨텍스트 스위칭", real: "Context Manager(스냅샷·복원)", note: "" },
        { as: "파일 ↔ 벡터 저장소", real: "Storage Manager(벡터DB)", note: "" },
      ],
      usage: "에이전트 실행 환경의 차세대 개념입니다. 시험은 전통 OS 3요소와의 치환, 구성요소, 비교표입니다.",
      links: [
        { topic: "AI-DLC(AI-Driven SDLC)와 SDD(Spec Driven Development)", how: "AI 중심 개발과 짝을 이루는 실행 환경입니다." },
        { topic: "도메인 특화 언어 모델(Domain-Specific Language Model)", how: "AI OS 위에서 도는 모델 축입니다." },
      ],
      exam: "AI OS는 CPU·RAM 대신 LLM·컨텍스트를 자원으로 관리하는 차세대 운영체제로, 전통 OS의 프로세스·메모리·파일이 에이전트·컨텍스트·벡터저장소로 치환된다.",
    }, image: "/concept/book/dx-aios.png", easy: "지금 OS는 CPU와 RAM을 프로세스에 나눠주는 게 일인데, AI OS는 LLM과 컨텍스트를 에이전트에 나눠줍니다. 대응 관계로 외우면 쉽습니다 — CPU+RAM ↔ LLM+Context, Kernel ↔ AI OS Kernel, Process(Users) ↔ Agent(Users). 구성요소는 세 묶음: LLM 쪽(LLMCore로 인스턴스 추상화, LLMScheduler로 이기종 GPU 스케줄링), Data Manager 쪽(Context Manager로 추론 중단점 저장·복원, Memory Manager로 단기·장기 메모리, Storage Manager로 영구 저장·벡터 DB 검색), Tool Manager 쪽(Tool Manager로 API 도구 표준화, Access Manager로 접근제어). 전통 OS와의 비교표가 그대로 시험 문제가 됩니다: 자원 예약은 스레드 단위 vs LLM 요청 단위, 컨텍스트 스위칭은 체크포인트·가상메모리 vs 스냅샷·복원 경로, 개발자 인터페이스는 POSIX vs LLM API + AI OS SDK." },
"nw-nwdaf": {
    guide: {
      hook: "5G 코어 안에서 '데이터를 분석해 망을 스스로 최적화'하는 AI 분석 기능입니다.",
      scene: "5G 코어가 쏟아내는 로그·상태를 모아 머신러닝 모델로 '앞으로 무슨 일이 생길지' 예측하고, 그 결과로 망을 실시간 제어합니다. 학습(모델 만들기)과 추론(예측하기)이 분리된 게 핵심입니다.",
      why: "'네트워크 자동화·지능화'의 표준 기능이라는 위치와 학습/추론 분리(MTLF/AnLF)가 출제 포인트입니다. 네트워크 지능·자동화와 연결됩니다.",
      mechanism: "3GPP 표준 5G 코어 NF. 기능 분리: MTLF(Model Training Logical Function — 데이터로 ML 모델 학습·배포), AnLF(Analytics Logical Function — 그 모델로 추론해 통계·예측을 소비자 NF에 제공). 데이터 지원: DCCF(수집 조정·중복 방지), ADRF(데이터 저장소), MFAF(데이터 전달). 용도: 이동성 예측·부하 예측·이상 탐지로 슬라이스·QoS 자동 최적화.",
      map: [
        { as: "모델 학습·배포", real: "MTLF", note: "학습" },
        { as: "예측해서 제공", real: "AnLF", note: "추론" },
        { as: "데이터 중복 방지", real: "DCCF", note: "수집 조정" },
        { as: "망 자동 최적화", real: "예측 기반 제어", note: "용도" },
      ],
      usage: "5G 네트워크 자동화의 핵심입니다. 시험은 MTLF/AnLF 분리, 데이터 기능, 자동화 용도입니다.",
      links: [
        { topic: "네트워크 지능", how: "NWDAF가 망 지능화를 구현합니다." },
        { topic: "네트워크 슬라이싱", how: "예측으로 슬라이스를 최적화합니다." },
      ],
      exam: "NWDAF는 5G 코어의 데이터를 분석·예측해 망을 자동 최적화하는 표준 NF로, 모델 학습(MTLF)과 추론(AnLF)을 분리하고 DCCF·ADRF·MFAF가 데이터를 지원한다.",
    }, image: "/concept/book/nw-nwdaf.png", easy: "5G 코어 안에 들어간 'AI 분석 담당 장비'입니다(3GPP 표준). 네트워크가 돌아가며 쏟아내는 로그·상태 정보를 모아 머신러닝 모델을 만들고, 그 모델로 앞으로 무슨 일이 생길지 예측해 네트워크를 실시간으로 제어합니다. 기능이 5개로 쪼개져 있는데 학습과 추론이 분리된 게 핵심입니다 — MTLF는 모델을 '학습'해서 배포하고, AnLF는 그 모델로 '추론'해서 요청한 NF(Analytics Consumer)에게 통계·예측 결과를 돌려줍니다. 나머지 셋은 데이터 뒷바라지: DCCF는 같은 요청이 또 오면 기존 결과를 그냥 주고 새 요청이면 OAM/NF에서 데이터를 끌어오는 중복 방지 담당, ADRF는 과거 데이터 창고, MFAF는 수집된 데이터를 AnLF에게 배달하는 메신저입니다." },
"nw-network-intelligence": {
    guide: {
      hook: "네트워크가 스스로 '보고·판단·최적화'하는 자율 지능화 — AI를 망 운영에 심습니다.",
      scene: "사람이 일일이 망을 튜닝하던 것을, AI가 트래픽·장애를 예측해 자동으로 라우팅·자원·정책을 조정합니다. 관찰(데이터)→분석(AI)→실행(제어)의 자율 루프를 망 안에 넣는 것입니다.",
      why: "'자율 네트워크(SON→IBN→자율화)'의 상위 개념이라는 위치가 핵심입니다. 자율화 단계(레벨)와 NWDAF·IBN·SDN과의 관계가 출제 포인트입니다.",
      mechanism: "구성: 데이터 수집(텔레메트리)→AI/ML 분석(예측·이상탐지·근본원인)→자동 제어(폐루프 최적화). 진화: SON(자가 구성·최적화·치유)→IBN(의도 기반)→완전 자율 네트워크(TM Forum 자율 레벨 0~5). 기반: NWDAF(5G 분석), SDN/NFV(프로그래머블), 디지털 트윈(시뮬레이션). 목표: 무인 운영·SLA 자동 보장.",
      map: [
        { as: "망이 스스로 판단", real: "자율 지능화", note: "" },
        { as: "관찰→분석→실행 루프", real: "폐루프 최적화", note: "" },
        { as: "자가 구성·치유", real: "SON", note: "진화 단계" },
        { as: "자율 레벨 0~5", real: "자율 네트워크", note: "TM Forum" },
      ],
      usage: "차세대 통신망 운영 자동화입니다. 시험은 SON→IBN→자율화, NWDAF·SDN과의 관계, 자율 레벨입니다.",
      links: [
        { topic: "NWDAF(Network Data Analytics Function)", how: "5G에서 망 지능화를 구현하는 기능입니다." },
        { topic: "인텐트 기반 네트워킹(Intent-Based Networking)", how: "지능화의 상위 운영 패러다임입니다." },
      ],
      exam: "네트워크 지능은 데이터 수집·AI 분석·자동 제어의 폐루프로 망을 스스로 최적화하는 자율화로, SON에서 IBN·완전 자율 네트워크(레벨 0~5)로 진화한다.",
    }, image: "/concept/book/nw-network-intelligence.png", easy: "사람이 손으로 하던 네트워크 운용·관리를 AI가 스스로 판단해 완전 자동으로 돌리는 네트워크입니다. 핵심 엔진은 폐쇄형 반복 제어(Closed-loop control) — 데이터 자동 수집 → AI 분석 → 자율 의사결정 → 피드백을 계속 돌려 네트워크가 알아서 최적 상태를 유지합니다. 이게 가능하려면 밑판이 있어야 하는데, SDN/NFV가 소프트웨어로 제어할 수 있는 유연한 구조를 깔아주고, 클라우드·엣지 가상화가 AI 플랫폼을 집중형/분산형으로 배치할 하드웨어를 제공하고, 인공지능/머신러닝과 빅데이터 분석이 실제 판단을 합니다. 결정된 정책을 물리·가상 자원에 실제로 꽂아넣는 건 OAM/MANO의 몫입니다. 쓰이는 곳: 데이터센터 트래픽 조정, 무선 커버리지 최적화, 지능형 슬라이싱·SD-WAN 관리, 장애 예측." },
"nw-6g": {
    guide: {
      hook: "5G 다음 세대 — '테라헤르츠·AI 네이티브·지상+위성 통합'을 지향하는 차세대 이동통신입니다.",
      scene: "5G가 사람·사물을 잇는다면, 6G는 초당 테라비트급 속도와 마이크로초급 지연으로 홀로그램·디지털 트윈·완전 자율을 지원하고, 지상망과 위성망을 하나로 묶어 어디서나 연결을 목표로 합니다(2030년경).",
      why: "6G 비전(성능 목표·핵심 기술)과 5G 대비 진화가 출제 포인트입니다. 특히 AI 네이티브·NTN·테라헤르츠가 핵심입니다.",
      mechanism: "성능 목표: Tbps급 속도(5G의 ~50배), 0.1ms 지연, 초고밀도 연결. 핵심 기술: 테라헤르츠(THz) 대역, AI 네이티브(설계부터 AI 내장), 지상-비지상 통합(NTN — 위성·HAPS), 리컨피규러블 인텔리전트 서피스(RIS — 전파 반사 제어), 센싱-통신 융합(JCAS), 초정밀 측위. 응용: 홀로그램·XR·디지털 트윈·완전 자율.",
      map: [
        { as: "5G의 수십 배 속도", real: "Tbps·0.1ms", note: "성능 목표" },
        { as: "설계부터 AI", real: "AI 네이티브", note: "" },
        { as: "지상+위성 통합", real: "NTN 통합", note: "어디서나 연결" },
        { as: "전파 반사 제어", real: "RIS", note: "핵심 기술" },
      ],
      usage: "차세대 통신 연구·표준화 이슈입니다. 시험은 6G 성능 목표, 핵심 기술, 5G 대비 진화입니다.",
      links: [
        { topic: "비지상네트워크(NTN, Non-Terrestrial Networks)", how: "6G의 지상-위성 통합 요소입니다." },
        { topic: "네트워크 지능", how: "6G의 AI 네이티브와 연결됩니다." },
      ],
      exam: "6G는 Tbps 속도·0.1ms 지연을 목표로 테라헤르츠·AI 네이티브·지상-비지상 통합(NTN)·RIS·센싱 융합을 핵심 기술로 하는 차세대 이동통신이다.",
    }, image: "/concept/book/nw-6g.png", easy: "5G 다음 세대로, 최대 1Tbps(5G의 50배)·체감 1Gbps(10배)를 목표로 합니다. 비전 6개를 '초'자 돌림으로 외우면 편합니다 — 초성능(1Tbps), 초대역(100GHz 이상, 대역폭 수십GHz), 초현실(실시간 홀로그램), 초지능(기계학습을 통신 시스템에 내장), 초정밀(무선 구간 지연 0.1ms), 초공간(시속 1000km·고도 10km까지 커버). 지원 기술도 짝을 이룹니다: 테라헤르츠(0.1~10THz) 대역은 경로 손실이 심해서 빔포밍·신규 안테나가 필수고, 통신-컴퓨팅 융합은 무거운 연산을 네트워크가 대신 해주며, 네이티브 AI는 처음부터 AI를 내장하고, 주파수 공유(CBRS)와 5G Massive MIMO를 넘는 안테나 기술이 뒷받침합니다. 시험 포인트는 5G 대비 배수(속도 50배, 대역폭 10배, 지연 1/10, 단말밀도 km²→km³)." },
"nw-digital-twin-network": {
    guide: {
      hook: "실제 네트워크의 '가상 쌍둥이'를 만들어 시뮬레이션·예측·자동 제어에 쓰는 기술입니다.",
      scene: "실제 망에서 설정을 바꿔 보면 위험하니, 똑같은 가상 망(디지털 트윈)에서 먼저 실험합니다. 변경 영향·장애 시나리오를 안전하게 예측하고, 최적 설정을 찾아 실제 망에 반영합니다.",
      why: "'가상 실험·예측을 통한 네트워크 자율화 도구'라는 위치가 핵심입니다. 실시간 동기화·What-if 분석이 출제 포인트입니다.",
      mechanism: "구성: 물리 네트워크의 실시간 데이터를 수집해 가상 모델과 동기화 → 가상에서 What-if 시뮬레이션(구성 변경·장애·트래픽 변동 예측) → AI로 최적안 도출 → 물리 망에 적용(폐루프). 활용: 사전 검증(변경 리스크↓), 장애 예측·근본원인, 용량 계획, 자율 최적화. 네트워크 지능·6G의 핵심 도구.",
      map: [
        { as: "망의 가상 쌍둥이", real: "디지털 트윈 네트워크", note: "" },
        { as: "실시간 동기화", real: "물리-가상 동기", note: "" },
        { as: "먼저 실험해 보기", real: "What-if 시뮬레이션", note: "핵심 이점" },
        { as: "검증 후 실제 반영", real: "폐루프 최적화", note: "" },
      ],
      usage: "네트워크 자율화·사전 검증 도구입니다. 시험은 실시간 동기화, What-if 분석, 네트워크 지능과의 관계입니다.",
      links: [
        { topic: "네트워크 지능", how: "디지털 트윈이 자율 최적화의 시뮬레이션 도구입니다." },
        { topic: "6G", how: "6G의 핵심 운영 기술입니다." },
      ],
      exam: "디지털 트윈 네트워크는 실제 망을 실시간 동기화한 가상 모델로 What-if 시뮬레이션·예측을 수행해 최적안을 물리 망에 반영하는 네트워크 자율화 도구다.",
    }, image: "/concept/book/nw-digital-twin-network.png", easy: "실제 물리 네트워크를 그대로 복제한 '가상 쌍둥이'를 만들어 놓고, 거기서 설계·진단·분석·최적화를 먼저 돌려본 뒤 실제 망에 적용하는 6G용 네트워크입니다. 시뮬레이션과 헷갈리기 쉬운데 결정적 차이는 매핑(mapping) — 물리망과 가상망이 실시간으로 양방향 연동된다는 점입니다(시뮬레이션은 한 번 만들어놓고 끝). 특징 4개: 데이터(통합 저장소에 수집), 매핑(실시간 인터랙티브), 모델(다양한 모델 내장·유연 결합), 인터페이스(물리↔가상 연결 + 애플리케이션 연결). 아키텍처는 3계층으로, 위에서부터 Network Application(설계·검증·관리·최적화) → Digital Twin(데이터/모델/관리 3개 도메인) → Physical Network이고, 위에서 인텐트를 내리면 트윈이 에뮬레이트한 뒤 제어 메시지를 물리 계층에 전송합니다." },
"nw-ntn": {
    guide: {
      hook: "위성·고고도 플랫폼으로 '하늘에서 통신을 제공'하는 비지상 네트워크입니다.",
      scene: "지상 기지국이 닿지 않는 바다·산악·재난 지역을, 저궤도 위성(스타링크 등)이나 성층권 무인기(HAPS)로 커버합니다. 6G는 이 하늘 망을 지상망과 하나로 통합해 진정한 전지구 연결을 목표로 합니다.",
      why: "'지상망 한계 보완·전지구 커버리지'와 구성(LEO·GEO·HAPS)이 출제 핵심입니다. 3GPP NTN 표준화와 5G/6G 통합이 포인트입니다.",
      mechanism: "구성: LEO(저궤도 위성 — 저지연·다수 위성 군집, 스타링크), MEO/GEO(중·정지궤도 — 광역·고지연), HAPS(성층권 무인기·기구 — 준정지 커버), UAV. 3GPP가 5G NR로 위성 접속 표준화(NTN). 과제: 큰 전파 지연·도플러(고속 이동)·핸드오버 빈발·전력. 활용: 오지·해상·항공·재난·IoT 백홀.",
      map: [
        { as: "저궤도 위성 군집", real: "LEO", note: "저지연" },
        { as: "성층권 무인기", real: "HAPS", note: "준정지" },
        { as: "지상 안 닿는 곳", real: "커버리지 보완", note: "핵심" },
        { as: "지상+위성 하나로", real: "5G/6G NTN 통합", note: "" },
      ],
      usage: "오지·재난·해상 통신, 6G 통합입니다. 시험은 LEO/GEO/HAPS 구성, NTN 과제, 6G 통합입니다.",
      links: [
        { topic: "6G", how: "6G의 지상-비지상 통합 핵심입니다." },
        { topic: "네트워크 슬라이싱", how: "위성 자원도 슬라이스로 관리합니다." },
      ],
      exam: "NTN은 LEO·GEO 위성과 HAPS로 지상망이 닿지 않는 지역까지 커버하는 비지상 네트워크로, 3GPP NTN 표준화로 5G/6G와 통합되며 전파 지연·핸드오버가 과제다.",
    }, image: "/concept/book/nw-ntn.png", easy: "기지국을 세울 수 없는 곳 — 바다, 산간, 오지, 항공, 재난 지역 — 에 위성·성층권 비행체·드론을 띄워 5G를 제공하는 기술입니다. 고도별로 GEO(정지궤도) / MEO / LEO(저궤도) 위성, 성층권의 HAPS(고고도 플랫폼), 저고도의 드론(UAV)이 층을 이룹니다. 링크 이름을 구분하는 게 시험 포인트입니다: 서비스 링크는 단말↔위성(3GPP NR 기반), 피더 링크는 위성↔지상 게이트웨이, 위성 간 링크(ISL)는 위성끼리. 위성 방식도 두 가지 — Transparent는 신호를 그냥 중계만 하고, Regenerative는 위성이 직접 복조·재생해서 보냅니다. 기술요소는 전송(빔포밍, MIMO), 네트워크 제어(자원 할당), 보안(인증·암호화), 위치 추적입니다." },
"nw-wifi7": {
    guide: {
      hook: "'320MHz·4K-QAM·다중 링크'로 유선급 속도를 노리는 Wi-Fi 7(802.11be)입니다.",
      scene: "Wi-Fi 6가 효율을 높였다면, Wi-Fi 7은 채널을 더 넓게(320MHz), 신호를 더 촘촘하게(4096-QAM) 쓰고, 여러 주파수 대역을 동시에 묶어(MLO) 지연·속도를 크게 개선합니다. 초고화질 무선·XR용입니다.",
      why: "핵심 3기술(320MHz·4K-QAM·MLO)과 Wi-Fi 6 대비 개선이 출제 포인트입니다. 특히 MLO(다중 링크)가 최신 핵심입니다.",
      mechanism: "핵심: 320MHz 채널(6GHz 대역, Wi-Fi 6의 2배), 4096-QAM(심볼당 12bit, 6E의 1024-QAM 대비 20%↑), MLO(Multi-Link Operation — 2.4/5/6GHz 여러 링크 동시 사용해 처리량↑·지연↓·안정성↑), Multi-RU(자원 유연 할당), preamble puncturing(간섭 대역 회피). 최대 ~46Gbps 이론속도. 저지연 응용(게임·XR) 겨냥.",
      map: [
        { as: "채널 두 배로 넓게", real: "320MHz", note: "6GHz" },
        { as: "신호 더 촘촘하게", real: "4096-QAM", note: "12bit/심볼" },
        { as: "여러 대역 동시에", real: "MLO(다중 링크)", note: "핵심" },
        { as: "간섭 대역 회피", real: "preamble puncturing", note: "" },
      ],
      usage: "고화질 무선·XR·저지연 응용입니다. 시험은 320MHz·4K-QAM·MLO, Wi-Fi 6 대비 개선입니다.",
      links: [
        { topic: "CSMA/CA", how: "Wi-Fi의 매체 접근 기반입니다." },
        { topic: "Wi-Fi 8(IEEE 802.11bn)", how: "다음 세대(신뢰성 중심)입니다." },
      ],
      exam: "Wi-Fi 7(802.11be)은 320MHz 채널·4096-QAM·다중 링크(MLO)로 최대 46Gbps급 속도와 저지연을 제공하는 무선랜 표준으로, XR·고화질 응용을 겨냥한다.",
    }, image: "/concept/book/nw-wifi7.png", easy: "Wi-Fi 6보다 3배 빠른 30Gbps급 무선랜 표준으로, 정식 명칭은 IEEE 802.11be, 별칭은 EHT(Extremely High Throughput)입니다. 속도가 3배가 된 이유를 세 갈래로 보면 됩니다: 대역폭이 160MHz → 320MHz로 2배, 안테나가 MU-MIMO 8×8 → 16×16으로 2배, 변조가 1024QAM → 4096QAM(12bit 반송파 변조)로 20% 향상. 여기에 6GHz 비면허 대역이 추가돼 쓸 수 있는 주파수가 넓어졌습니다(2.4/5/6GHz). 나머지 기술요소도 짝이 있습니다 — MAC 쪽은 AP 간 다중협력통신(AP끼리 데이터·제어 정보를 공유), 하이브리드 ARQ(추가 패리티로 재전송 효율 개선), In-Band Full-Duplex(송·수신 동시)이고, PHY 쪽은 혼합 빔포밍(320MHz 광대역을 협대역 여러 개로 나눠 프리코딩)입니다." },
"nw-wifi8": {
    guide: {
      hook: "속도보다 '신뢰성·초저지연(UHR)'에 초점을 맞춘 차세대 Wi-Fi 8(802.11bn)입니다.",
      scene: "Wi-Fi 7이 최고 속도를 올렸다면, Wi-Fi 8은 '끊김 없고 일관된' 연결을 지향합니다. 혼잡한 환경·이동 중에도 지연이 튀지 않게, 여러 AP가 협력해 안정성을 보장하는 UHR(초고신뢰) 방향입니다.",
      why: "'속도 → 신뢰성·저지연'으로의 방향 전환과 핵심 기술(다중 AP 협력)이 출제 포인트입니다. Wi-Fi 7과의 대비가 핵심입니다.",
      mechanism: "목표(UHR — Ultra High Reliability): 최고 속도보다 최악 상황의 성능·일관성·지연 개선. 핵심 기술: 다중 AP 협력(Multi-AP Coordination — 인접 AP가 협력해 간섭 관리·핸드오버 매끄럽게), 개선된 MLO, 이동성 강화, 저지연 보장. 산업용·XR·자율이동체 등 신뢰성 필수 환경 겨냥. 2028년경 표준화 예상.",
      map: [
        { as: "최고속도보다 일관성", real: "UHR(초고신뢰)", note: "방향 전환" },
        { as: "AP들이 협력", real: "다중 AP 협력", note: "핵심 기술" },
        { as: "이동 중에도 안정", real: "이동성·핸드오버 강화", note: "" },
        { as: "지연 안 튀게", real: "저지연 보장", note: "" },
      ],
      usage: "산업용·XR·신뢰성 필수 무선입니다. 시험은 UHR 방향, 다중 AP 협력, Wi-Fi 7과의 대비입니다.",
      links: [
        { topic: "Wi-Fi 7(IEEE 802.11be)", how: "속도 중심 직전 세대와 대비됩니다." },
        { topic: "QoS(Quality of Service)", how: "신뢰성·저지연 보장과 연결됩니다." },
      ],
      exam: "Wi-Fi 8(802.11bn)은 최고 속도보다 신뢰성·초저지연(UHR)에 초점을 두고 다중 AP 협력·이동성 강화로 최악 환경의 일관된 성능을 지향하는 차세대 무선랜이다.",
    }, image: "/concept/book/nw-wifi8.png", easy: "2028년 예정인 IEEE 802.11bn으로, Wi-Fi 7과 결정적으로 다른 점은 '더 빠르게'가 아니라 '더 안정적으로'입니다 — 핵심 목표가 UHR(Ultra High Reliability, 극도로 높은 신뢰성)이고 대역폭(320MHz)·변조(4096QAM)·공간 스트림(8)은 Wi-Fi 7과 같습니다. 그래서 새로 붙은 기능들이 전부 혼잡·간섭 대응입니다: 멀티 AP 협력(AP끼리 협조), DSO(동적 스펙트럼 최적화)/NPCA(네트워크 성능 및 혼잡 방지), dRU(동적 자원 유닛), 협조적 대상 대기 시간. 버전별 비교표는 시험에 그대로 나올 수 있으니 흐름만 잡아두세요 — 대역폭 40→160→160→320→320, 변조 64→256→1024→4096→4096QAM, MU-MIMO는 Wi-Fi 5부터(DL only) Wi-Fi 6부터 UL&DL, 멀티링크는 Wi-Fi 7부터." },
"nw-passive-wifi": {
    guide: {
      hook: "'스스로 전파를 안 만들고' 주변 신호를 반사해 통신하는 초저전력 Wi-Fi입니다.",
      scene: "일반 Wi-Fi는 전파를 직접 생성해 전력을 많이 씁니다. Passive WiFi는 주변에 이미 있는 신호를 반사·변조(백스캐터)해 데이터를 실어 보내, 전력을 1만분의 1 수준으로 낮춥니다 — 배터리 없는 IoT용입니다.",
      why: "'백스캐터 기반 초저전력'이라는 원리와 IoT 적용이 출제 포인트입니다. 전력 절감 배수가 핵심입니다.",
      mechanism: "백스캐터(Backscatter) 통신: 별도 RF 신호원(플러그인 장치)이 반송파를 방출 → 센서(태그)는 스위치로 그 신호를 반사(반사=1)하거나 흡수(=0)하며 데이터 변조 → 일반 Wi-Fi 수신기가 디코딩. 자체 전파 생성이 없어 소비 전력이 극히 낮음(마이크로와트급, ~1/10000). 배터리리스·에너지 하베스팅 IoT 센서에 적합. 통신 거리·속도는 제한적.",
      map: [
        { as: "주변 신호 반사", real: "백스캐터 통신", note: "핵심" },
        { as: "반사=1, 흡수=0", real: "반사 변조", note: "" },
        { as: "전파 생성 안 함", real: "초저전력(~1/10000)", note: "" },
        { as: "배터리 없는 센서", real: "IoT 적용", note: "" },
      ],
      usage: "배터리리스 IoT·웨어러블 센서입니다. 시험은 백스캐터 원리, 초저전력, IoT 적용·한계입니다.",
      links: [
        { topic: "IoT Matter", how: "저전력 IoT 연결 생태계와 연결됩니다." },
        { topic: "무선 충전 기술", how: "에너지 하베스팅과 함께 배터리리스를 지향합니다." },
      ],
      exam: "Passive WiFi는 자체 전파를 생성하지 않고 주변 신호를 반사·변조하는 백스캐터 통신으로 소비 전력을 1/10000 수준으로 낮춰 배터리 없는 IoT 센서에 적합하다.",
    }, image: "/concept/book/nw-passive-wifi.png", easy: "Passive WiFi는 전력을 많이 쓰는 RF 송신부를 별도 장치(Plugged-In Device)로 떼어 두고, 센서 쪽 기기(Passive Device)는 그 신호를 반사만 해서 정보를 실어 보내는 초저전력 무선 기술입니다. Wi-Fi 전력의 범인이 디지털부(무어의 법칙 덕에 10μW)가 아니라 아날로그 RF부(여전히 100mW)라는 데서 출발한 발상입니다. 이 반사가 후방산란(backscatter) — 전파가 들어온 방향의 반대인 입사단으로 되돌아오는 현상입니다. 신호를 생성하지 않으니 전력 소모가 거의 없어 초저전력 IoT에 딱 맞습니다. 송신 측 기술은 RF Transfer(Up/Down 컨버터), RF Calibration(안테나 간 진폭·위상 보정), MAC(주소·채널 설정)이고, 수신은 Passive Device와 스마트기기인 Wi-Fi Receiver입니다." },
"nw-sdn": {
    guide: {
      hook: "네트워크의 '두뇌(제어)'와 '팔다리(전달)'를 분리해 소프트웨어로 망을 프로그래밍합니다.",
      scene: "기존 라우터·스위치는 경로 결정(제어)과 패킷 전달을 한 장비가 다 했습니다. SDN은 제어를 중앙 컨트롤러로 빼내, 소프트웨어로 전체 망을 한눈에 보고 프로그래밍하듯 제어합니다.",
      why: "'제어평면-데이터평면 분리'와 3계층 구조(애플리케이션·컨트롤·인프라)가 출제 핵심입니다. 오픈플로우·NFV와의 관계가 포인트입니다.",
      mechanism: "구조: 애플리케이션 계층(정책·앱) —(노스바운드 API)— 컨트롤 계층(중앙 컨트롤러 — 전체 뷰·경로 결정) —(사우스바운드 API, OpenFlow)— 인프라 계층(스위치 — 단순 전달). 제어평면을 논리 중앙화해 유연·자동화·가시성 확보. NFV(네트워크 기능 가상화)와 결합해 vRAN·슬라이싱 구현. 이점: 프로그래머빌리티·자동화, 과제: 컨트롤러 SPOF·확장성.",
      map: [
        { as: "두뇌를 중앙에", real: "제어평면 분리·중앙화", note: "핵심" },
        { as: "스위치는 전달만", real: "데이터평면", note: "" },
        { as: "컨트롤러↔스위치 규약", real: "사우스바운드(OpenFlow)", note: "" },
        { as: "앱↔컨트롤러", real: "노스바운드 API", note: "" },
      ],
      usage: "데이터센터·클라우드·5G 코어의 기반입니다. 시험은 제어/데이터 분리, 3계층, OpenFlow·NFV와의 관계입니다.",
      links: [
        { topic: "오픈플로우(OpenFlow)", how: "SDN의 대표 사우스바운드 프로토콜입니다." },
        { topic: "SD-WAN(Software Defined-Wide Area Network)", how: "SDN을 WAN에 적용한 것입니다." },
      ],
      exam: "SDN은 제어평면을 데이터평면에서 분리해 중앙 컨트롤러로 논리 집중화하는 아키텍처로, 애플리케이션·컨트롤·인프라 3계층과 OpenFlow로 망을 프로그래밍한다.",
    }, image: "/concept/book/nw-sdn.png", easy: "기존 스위치는 '어디로 보낼지 결정하는 두뇌(Control Plane — 라우팅, QoS, 정책)'와 '실제로 패킷을 밀어내는 손발(Data Plane — Forwarding)'이 한 장비 안에 붙어 있어서, 정책을 바꾸려면 장비를 하나하나 만져야 했습니다. SDN은 이 둘을 분리해 두뇌를 Controller로 중앙집중화하고, 스위치는 단순 포워딩만 하게 만듭니다. 그 사이를 잇는 개방형 프로토콜이 OpenFlow입니다. 구성 요소 4개: Application(Network OS 위에서 사용자 서비스 제공), Interface(OpenFlow — Control↔Data Plane 연계), Control Plane(ACL·라우팅·인증을 중앙집중 구현), Data Plane(Forward Engine — 단순 패킷 포워딩). 계층으로 보면 APPLICATION LAYER ─API─ CONTROL LAYER(SDN Control Software) ─OpenFlow─ INFRASTRUCTURE LAYER(Network Device)입니다." },
"nw-oran": {
    guide: {
      hook: "폐쇄적이던 기지국 장비를 '개방형 표준 인터페이스'로 열어 벤더 종속을 깬 RAN입니다.",
      scene: "기존 RAN은 한 제조사 장비로만 구성돼 종속·고비용이었습니다. O-RAN은 기지국 구성요소 간 인터페이스를 표준·개방해 서로 다른 벤더 장비를 섞어 쓰고(믹스앤매치), AI로 지능화합니다.",
      why: "'개방·지능화·가상화'라는 O-RAN 철학과 구성(DU/CU 분할·RIC)이 출제 핵심입니다. C-RAN과의 관계가 포인트입니다.",
      mechanism: "핵심: 개방형 인터페이스(O-RAN Alliance 표준 — 벤더 간 상호운용), 가상화(RAN 기능을 COTS 서버 SW로), 지능화(RIC — RAN Intelligent Controller가 AI/ML로 자원·정책 최적화, Non-RT/Near-RT). 기능 분할: RU(무선)-DU(분산)-CU(중앙). 이점: 종속 탈피·비용↓·혁신 가속. 과제: 상호운용 검증·보안(공격 표면 증가).",
      map: [
        { as: "벤더 섞어 쓰기", real: "개방형 인터페이스", note: "종속 탈피" },
        { as: "SW로 가상화", real: "vRAN", note: "COTS 서버" },
        { as: "AI로 최적화", real: "RIC(지능형 컨트롤러)", note: "" },
        { as: "RU-DU-CU 분할", real: "기능 분할", note: "" },
      ],
      usage: "차세대 개방형 5G 인프라입니다. 시험은 개방·가상화·지능화, RIC, C-RAN과의 관계입니다.",
      links: [
        { topic: "C-RAN(Centralized / Cloud RAN)", how: "O-RAN이 개방·지능화로 발전시킨 기반입니다." },
        { topic: "네트워크 지능", how: "RIC의 AI 기반 최적화와 연결됩니다." },
      ],
      exam: "O-RAN은 RAN 구성요소 간 인터페이스를 개방·표준화해 벤더 종속을 깨고 가상화·RIC 기반 AI 지능화를 더한 개방형 무선접속망으로, 상호운용·보안이 과제다.",
    }, image: "/concept/book/nw-oran.png", easy: "기지국 장비가 특정 제조사에 묶이지 않도록, RAN 구간에 가상화를 적용하고 인터페이스를 개방 표준으로 만든 아키텍처입니다(Apache 2.0 라이선스). 구성 3분할: O-CU(중앙 집중 — RRC·PDCP 실행, Control Plane과 User Plane으로 나뉨), O-DU(분산 — RLC·MAC·High PHY 실행, O-RU 근처), O-RU(안테나 부근 — 무선 신호를 디지털로 변환, Low PHY·빔포밍). 여기에 RIC(RAN Intelligent Controller)가 데이터를 수집·분석해 자원을 최적화합니다 — 실시간용 near-RT와 비실시간용 non-RT. 구간 이름도 함께: RU ←Fronthaul→ DU ←Midhaul→ CU ←Backhaul→ 코어. 인터페이스는 A1(non-RT↔near-RT), E2(RIC↔CU/DU), E1(CU-CP↔CU-UP), F1(CU↔DU), Open Front Haul(DU↔RU)." },
"nw-ran-sharing": {
    guide: {
      hook: "여러 통신사가 '기지국 자원을 함께 써서' 투자·운영 비용을 나누는 방식입니다.",
      scene: "통신사마다 전국에 기지국을 따로 세우면 중복 투자입니다. RAN 공유는 안테나·기지국 같은 무선 접속망을 사업자들이 공유해, 특히 농어촌·신규 대역에서 비용을 아끼고 커버리지를 빨리 넓힙니다.",
      why: "공유 수준(수동/능동)과 방식(MOCN·MORAN)이 출제 핵심입니다. 5G 투자 효율화·커버리지 확대 관점이 포인트입니다.",
      mechanism: "수동 공유(Passive — 철탑·전원·공간 등 물리 설비만 공유), 능동 공유(Active — RAN 장비까지 공유). 방식: MORAN(Multi-Operator RAN — 무선망 공유하되 주파수는 사업자별 분리), MOCN(Multi-Operator Core Network — 무선망·주파수까지 공유하고 코어만 분리), 국가로밍. 이점: CAPEX/OPEX 절감·빠른 확산. 과제: 성능 분리·경쟁 이슈·규제.",
      map: [
        { as: "철탑·전원만 공유", real: "수동 공유", note: "물리 설비" },
        { as: "RAN 장비까지 공유", real: "능동 공유", note: "" },
        { as: "주파수는 분리", real: "MORAN", note: "" },
        { as: "주파수까지 공유", real: "MOCN", note: "" },
      ],
      usage: "5G 농어촌·신대역 투자 효율화입니다. 시험은 수동/능동, MORAN/MOCN 구분, 이점·과제입니다.",
      links: [
        { topic: "C-RAN(Centralized / Cloud RAN)", how: "집중화된 RAN 자원을 공유합니다." },
        { topic: "네트워크 슬라이싱", how: "공유 인프라를 논리적으로 분리합니다." },
      ],
      exam: "RAN Sharing은 통신사들이 무선 접속망을 공유해 투자·운영 비용을 절감하는 방식으로, 수동/능동 공유와 주파수 분리(MORAN)·공유(MOCN)로 나뉜다.",
    }, image: "/concept/book/nw-ran-sharing.png", easy: "여러 통신사가 기지국·코어망을 함께 써서 중복 투자를 줄이는 기술입니다. 무엇까지 공유하느냐로 3가지가 갈립니다: MORAN — 기지국·컨트롤러는 공유하되 주파수는 사업자별로 분리(대역폭 조절로 품질 차별화 가능, 대신 복잡하고 비용 절감 효과는 작음). MOCN — 주파수까지 공유하고 코어망만 따로(구현이 단순하고 비용 절감이 크지만, 같은 RAN을 쓰니 서비스 차별화가 어려움). GWCN — 코어망의 MME·S-GW까지 공유하고 P-GW만 분리(공유가 가장 많아 구축비는 가장 적지만 구현 복잡성은 최대). 한 줄: 공유 범위 MORAN < MOCN < GWCN, 공유할수록 싸지고 차별화는 어려워집니다." },
"nw-5g-private": {
    guide: {
      hook: "특정 기업·장소 전용으로 구축하는 '나만의 5G 망'입니다.",
      scene: "공장·항만·병원이 공용 이동통신에 의존하면 보안·성능을 제어할 수 없습니다. 5G 특화망은 그 부지 전용으로 5G를 구축해, 초저지연·고신뢰가 필요한 스마트팩토리·로봇을 자체 통제 하에 운영합니다.",
      why: "'전용망'의 필요성(보안·성능·제어)과 국내 이음5G(28GHz·4.7GHz) 제도가 출제 포인트입니다. 네트워크 슬라이싱과의 비교가 핵심입니다.",
      mechanism: "특정 지역·기업 전용 5G(로컬 주파수 할당 — 국내 '이음5G' 4.7GHz·28GHz). 구성: 전용 코어(온프레미스 UPF로 데이터 로컬 처리 — 저지연·보안), RAN, 단말. 이점: 초저지연·고신뢰(URLLC), 데이터 외부 유출 없음, 맞춤 QoS. 공용망 슬라이싱(논리적 분리)과 달리 물리적 전용. 스마트팩토리·항만·국방에 적용.",
      map: [
        { as: "부지 전용 5G", real: "특화망(이음5G)", note: "로컬 주파수" },
        { as: "데이터 로컬 처리", real: "온프레미스 UPF", note: "저지연·보안" },
        { as: "초저지연·고신뢰", real: "URLLC", note: "" },
        { as: "물리 전용 vs 논리 분리", real: "슬라이싱과 차이", note: "" },
      ],
      usage: "스마트팩토리·항만·병원 전용망입니다. 시험은 특화망 필요성, 이음5G, 슬라이싱과의 차이입니다.",
      links: [
        { topic: "네트워크 슬라이싱", how: "공용망 논리 분리와 대비되는 전용망입니다." },
        { topic: "스마트팩토리 보안취약점 및 대응방안", how: "특화망의 대표 적용처입니다." },
      ],
      exam: "5G 특화망(이음5G)은 기업·장소 전용으로 로컬 주파수와 온프레미스 코어를 구축해 초저지연·고신뢰·보안을 확보하는 망으로, 공용망 슬라이싱과 달리 물리적 전용이다.",
    }, image: "/concept/book/nw-5g-private.png", easy: "통신사 상용망 대신 전용 주파수를 받아 공장·병원·건물 같은 특정 공간에만 구축하는 기업 맞춤형 5G입니다 — 국내 명칭은 '이음 5G'이고 4.7GHz·28GHz 대역을 씁니다. 왜 쓰나: 외부망을 타지 않아 보안이 강하고, MEC(사용자 가까운 곳의 엣지 서버)로 처리해 지연이 매우 짧습니다(스마트 팩토리 로봇 제어 등). 구성 요소: 5G 전용 주파수, UPF(패킷 라우팅·QoS 처리), MEC, gNB(기지국). 기술 요소: SDN(제어·데이터 평면 분리), NFV(장비 기능 가상화), Network Slicing(용도별 논리 분리), Open RAN(CU/DU/RU 분리), RAN Sharing. 유형은 자가구축(On-Premise)과 이음 5G 사업자형(On-Premise / 5G Core CP 공유 / 5G Core 전체 공유)으로 나뉩니다." },
"nw-network-slicing": {
    guide: {
      hook: "하나의 물리 5G 망을 '용도별 논리 망 여러 개로 잘라' 각기 다른 품질을 보장합니다.",
      scene: "같은 물리 망 위에 '초저지연 자율주행용', '대용량 영상용', '초다수 IoT용' 슬라이스를 각각 만들어, 서로 격리된 채 요구 품질을 보장받게 합니다 — 한 케이크를 용도별로 자르는 셈입니다.",
      why: "'물리 하나 → 논리 다수'와 5G 3대 서비스(eMBB·URLLC·mMTC)별 슬라이스가 출제 핵심입니다. SDN/NFV 기반과 특화망과의 구분이 포인트입니다.",
      mechanism: "SDN/NFV로 물리 자원(RAN·전송·코어)을 논리적으로 분할·격리해 슬라이스별 전용 자원·QoS 제공. 5G 서비스 매핑: eMBB(초고속 대용량 — 영상), URLLC(초저지연·고신뢰 — 자율주행·원격수술), mMTC(초다수 연결 — IoT). 각 슬라이스는 독립 SLA·격리(한 슬라이스 폭주가 다른 데 영향 없음). E2E 오케스트레이션으로 관리.",
      map: [
        { as: "케이크 용도별 자르기", real: "논리 망 분할", note: "물리 하나" },
        { as: "초고속 대용량", real: "eMBB 슬라이스", note: "영상" },
        { as: "초저지연 고신뢰", real: "URLLC 슬라이스", note: "자율주행" },
        { as: "초다수 IoT", real: "mMTC 슬라이스", note: "" },
      ],
      usage: "5G 서비스 차별화의 핵심입니다. 시험은 eMBB/URLLC/mMTC 매핑, SDN/NFV 기반, 특화망과의 구분입니다.",
      links: [
        { topic: "5G 특화망", how: "논리 분리(슬라이싱) vs 물리 전용(특화망)입니다." },
        { topic: "SDN(Software Defined Network)", how: "슬라이싱을 구현하는 기반 기술입니다." },
      ],
      exam: "네트워크 슬라이싱은 SDN/NFV로 하나의 물리 5G 망을 논리 망 여러 개로 격리 분할해 eMBB·URLLC·mMTC별 QoS를 보장하는 기술이다.",
    }, image: "/concept/book/nw-network-slicing.png", easy: "물리적으로 하나인 5G 망을 논리적으로 여러 개로 쪼개, 서비스마다 성격이 다른 전용망을 제공하는 기술입니다. 예: 통신/인터넷 Slice(일반 모바일), 물류/기후 Slice(대규모 IoT — 속도보다 접속 수가 중요), 스마트카/스마트팩토리 Slice(Mission critical — 초저지연이 생명). 이걸 가능하게 하는 두 축이 시험 핵심입니다. SDN: 장비에 붙어 있던 제어 기능을 떼어 중앙 컨트롤러로 모으고, OpenFlow 같은 개방형 API로 트래픽 흐름을 소프트웨어가 제어합니다(Application Plane → Control Plane → Data Plane). NFV: 방화벽·로드밸런서 같은 네트워크 장비 기능을 전용 하드웨어에서 떼어내 범용 서버 위의 소프트웨어(VNF)로 돌립니다 — NFVI(인프라) 위에서 VNF들이 동작하고 MANO가 관리합니다." },
"nw-rarp": {
    guide: {
      hook: "ARP의 반대 — 자기 'MAC 주소로 IP를 알아내는' 초기 부팅용 프로토콜입니다.",
      scene: "디스크 없는 단말은 켜질 때 자기 IP를 모릅니다. RARP는 '내 MAC은 이건데 IP 뭐야?'를 서버에 물어 IP를 받습니다. 지금은 더 기능이 많은 DHCP로 대체됐습니다.",
      why: "'ARP와 반대 방향(MAC→IP)'이라는 대비와 DHCP로 대체된 이유가 출제 포인트입니다.",
      mechanism: "디스크리스 워크스테이션 등이 부팅 시 RARP Request(자기 MAC 브로드캐스트) → RARP 서버가 MAC-IP 매핑 테이블에서 찾아 IP 응답. 한계: IP만 제공(서브넷·게이트웨이·DNS 미제공), 서버가 같은 물리 네트워크에 있어야 함 → BOOTP를 거쳐 DHCP로 대체(추가 설정·주소 임대 제공).",
      map: [
        { as: "MAC으로 IP 묻기", real: "L2→L3(ARP 반대)", note: "" },
        { as: "부팅 시 자기 IP 획득", real: "디스크리스 단말", note: "" },
        { as: "IP만 주고 끝", real: "기능 한계", note: "게이트웨이·DNS 없음" },
        { as: "DHCP로 대체됨", real: "BOOTP→DHCP", note: "" },
      ],
      usage: "역사적 프로토콜로 개념 이해용입니다. 시험은 ARP와의 대비, DHCP 대체 이유입니다.",
      links: [
        { topic: "ARP(Address Resolution Protocol)", how: "정반대 방향의 주소 변환입니다." },
        { topic: "DHCP(Dynamic Host Configuration Protocol)", how: "RARP를 대체한 자동 설정 프로토콜입니다." },
      ],
      exam: "RARP는 MAC 주소로 IP를 알아내는 ARP의 역방향 프로토콜로, 디스크리스 단말의 부팅에 쓰였으나 IP만 제공하는 한계로 BOOTP를 거쳐 DHCP로 대체됐다.",
    }, image: "/concept/book/nw-rarp.png", easy: "RARP는 자기 MAC 주소로 자신의 IP 주소를 알아내는 프로토콜입니다 — ARP(IP→MAC)의 반대 방향으로, 하드디스크 없이 부팅해 IP를 모르는 단말이 \"내 물리 주소는 A4:6E:A5:57:82:36인데 내 IP가 뭐죠?\"라고 서버에 물어보는 프로토콜입니다. 동작: RARP Request를 브로드캐스트로 뿌리면 네트워크의 모든 컴퓨터가 받지만 RARP 서버만 응답하고, 응답(RARP Reply)은 유니캐스트로 옵니다 — \"당신 IP는 141.14.56.21입니다\". RARP 서버가 2대 이상이면 둘 다 응답하는데, 호스트는 첫 번째 응답만 받고 나머지는 무시합니다. 한 줄 정리: ARP는 IP→MAC, RARP는 MAC→IP. 오늘날은 대부분 DHCP가 이 역할을 대신합니다." },
"nw-dhcp": {
    guide: {
      hook: "네트워크에 접속하면 'IP·게이트웨이·DNS를 자동으로' 나눠 주는 설정 프로토콜입니다.",
      scene: "카페 와이파이에 연결만 하면 알아서 인터넷이 됩니다. DHCP 서버가 IP 주소를 임대(lease)해 주고, 게이트웨이·DNS 같은 설정까지 자동으로 내려 주기 때문입니다.",
      why: "DORA 4단계 흐름과 임대(lease)·갱신 개념이 출제 핵심입니다. RARP/BOOTP 대비 확장성이 포인트입니다.",
      mechanism: "DORA: Discover(클라이언트 브로드캐스트 — DHCP 서버 탐색) → Offer(서버가 IP 제안) → Request(클라이언트가 특정 제안 수락 요청) → Ack(서버 확정·임대). 임대 기간(lease) 만료 전 갱신(Renew, T1=50%)·재바인딩(T2=87.5%). 제공: IP·서브넷·게이트웨이·DNS·임대시간. 릴레이 에이전트로 서브넷 넘어 서비스.",
      map: [
        { as: "서버 찾기", real: "Discover", note: "브로드캐스트" },
        { as: "IP 제안", real: "Offer", note: "" },
        { as: "수락 요청", real: "Request", note: "" },
        { as: "확정·임대", real: "Ack", note: "lease" },
      ],
      usage: "모든 자동 IP 할당의 표준입니다. 시험은 DORA 4단계, 임대·갱신, RARP/BOOTP와의 차이입니다.",
      links: [
        { topic: "RARP(Reverse Address Resolution Protocol)", how: "DHCP가 대체한 초기 방식입니다." },
        { topic: "DNS(Domain Name System)", how: "DHCP가 DNS 서버 주소도 배포합니다." },
      ],
      exam: "DHCP는 Discover·Offer·Request·Ack(DORA)로 IP와 게이트웨이·DNS 설정을 자동 임대하는 프로토콜로, 임대 갱신·재바인딩을 지원하며 RARP·BOOTP를 대체했다.",
    }, image: "/concept/book/nw-dhcp.png", easy: "DHCP는 네트워크에 접속한 단말에 IP 주소·DNS 같은 설정 정보를 자동으로 할당해 주는 프로토콜입니다 — Wi-Fi에 연결하면 IP가 저절로 잡히는 원리입니다. 할당 4단계 [DORA]: ① DISCOVER — 클라이언트가 \"DHCP 서버 있나요?\"를 브로드캐스트 ② OFFER — 서버가 \"이 IP 쓰세요\"를 유니캐스트로 제안(IP·임대시간·DNS 정보 포함) ③ REQUEST — 클라이언트가 \"그 IP 쓰겠습니다\"를 브로드캐스트(다른 서버들에게도 거절 통보) ④ ACK — 서버가 최종 승인. 포트는 클라이언트 UDP 68, 서버 UDP 67입니다. 갱신은 임대시간이 50% 남은 시점에 REQUEST → ACK 두 단계로 유니캐스트하고, 해제는 RELEASE 한 번으로 끝(서버 응답 없음). 보안 위협으로 DHCP Starvation(위조 MAC으로 대량 요청해 IP 풀 고갈)이 함께 출제됩니다." },
"nw-sctp": {
    guide: {
      hook: "TCP와 UDP의 장점을 합친 '멀티스트림·멀티호밍' 전송 프로토콜입니다.",
      scene: "TCP는 신뢰성은 좋지만 하나의 스트림이 막히면 다 멈추고(HOL), 연결도 한 경로뿐입니다. SCTP는 한 연결에 여러 스트림을 두고(막힘 격리), 여러 IP 경로를 동시에 쥐어(멀티호밍) 한 경로가 죽어도 이어집니다.",
      why: "TCP·UDP 대비 특징(멀티스트림·멀티호밍·메시지 지향)이 출제 핵심입니다. HOL 블로킹 완화와 시그널링(통신망) 활용이 포인트입니다.",
      mechanism: "멀티스트림(한 association 안에 독립 스트림 여러 개 → 스트림 간 HOL 블로킹 격리), 멀티호밍(양단이 여러 IP 보유 → 주 경로 장애 시 대체 경로로 페일오버), 메시지 지향(TCP의 바이트 스트림과 달리 메시지 경계 보존), 4-way 핸드셰이크(쿠키로 SYN 플러딩 방어). 통신 시그널링(SIGTRAN)·WebRTC 데이터 채널에 사용.",
      map: [
        { as: "여러 스트림 독립", real: "멀티스트림", note: "HOL 격리" },
        { as: "여러 경로 동시 보유", real: "멀티호밍", note: "페일오버" },
        { as: "메시지 경계 보존", real: "메시지 지향", note: "UDP 특성" },
        { as: "쿠키로 SYN 방어", real: "4-way 핸드셰이크", note: "보안" },
      ],
      usage: "통신망 시그널링·WebRTC에 쓰입니다. 시험은 TCP/UDP 대비 특징, 멀티스트림·멀티호밍입니다.",
      links: [
        { topic: "TCP 와 UDP 비교", how: "둘의 장점을 결합한 프로토콜입니다." },
        { topic: "HTTP/3", how: "멀티스트림·HOL 해소라는 문제의식을 공유합니다." },
      ],
      exam: "SCTP는 한 연결에 여러 스트림(HOL 격리)과 여러 IP 경로(멀티호밍 페일오버)를 두는 메시지 지향 전송 프로토콜로, 통신 시그널링·WebRTC에 쓰인다.",
    }, image: "/concept/book/nw-sctp.png", easy: "TCP의 신뢰성과 UDP의 메시지 지향성을 합친 전송 계층 프로토콜입니다. 두 가지 무기가 시험 핵심: Multi-homing — 한 세션이 여러 IP 주소를 동시에 보유해, 쓰던 경로가 끊겨도 다른 경로로 세션을 유지합니다(TCP는 IP 하나가 끊기면 연결도 끊김). Multi-streaming — 한 세션 안에 여러 스트림을 두어 한 스트림이 막혀도 다른 스트림은 진행합니다(HOL 블로킹 완화). 핸드셰이크가 TCP와 반대인 것도 포인트: 수립은 4-way(INIT → INIT-ACK → COOKIE-ECHO → COOKIE-ACK, 쿠키로 SYN 플러딩 방어), 종료는 3-way(SHUTDOWN → SHUTDOWN-ACK → SHUTDOWN-CMPL, Half-open Closing 해결). 전송 중에는 SACK로 선택적 확인, HEARTBEAT로 경로 생존을 감시합니다." },
"nw-cran": {
    guide: {
      hook: "기지국의 '두뇌(BBU)'를 중앙에 모아 자원을 공유하는 클라우드 무선 접속망입니다.",
      scene: "기존엔 기지국마다 안테나와 처리장치가 다 있었습니다. C-RAN은 신호 처리부(BBU)를 중앙 데이터센터에 풀(pool)로 모으고, 현장엔 안테나부(RRH)만 남겨 자원을 공유·집중 관리합니다.",
      why: "'BBU 집중화'의 이점(자원 풀링·에너지 절감·협력 통신)과 프론트홀 부담이 출제 핵심입니다. O-RAN·RAN 공유로 이어지는 관문입니다.",
      mechanism: "구조: RRH(원격 무선 헤드 — 안테나·RF, 현장) + 프론트홀(광링크, CPRI) + BBU 풀(중앙 집중 처리). 이점: BBU 자원 공유로 활용률↑, 협력 통신(CoMP)으로 간섭 관리, 유지보수·에너지 효율↑, 소형셀 확장 용이. 과제: BBU-RRH 간 프론트홀 대용량·저지연 요구. 5G에서 BBU를 DU/CU로 분할.",
      map: [
        { as: "두뇌를 중앙에 모으기", real: "BBU 풀 집중화", note: "핵심" },
        { as: "현장엔 안테나만", real: "RRH", note: "" },
        { as: "중앙-현장 광링크", real: "프론트홀(CPRI)", note: "대용량 부담" },
        { as: "협력으로 간섭 관리", real: "CoMP", note: "이점" },
      ],
      usage: "5G 기지국 아키텍처의 기반입니다. 시험은 BBU/RRH 분리, 프론트홀, O-RAN과의 관계입니다.",
      links: [
        { topic: "O-RAN", how: "C-RAN을 개방형 표준으로 발전시킵니다." },
        { topic: "RAN(Radio Access Network) Sharing", how: "집중화된 RAN 자원을 공유합니다." },
      ],
      exam: "C-RAN은 기지국 신호처리부(BBU)를 중앙에 풀로 집중하고 현장엔 안테나부(RRH)만 두어 자원 공유·협력 통신·에너지 효율을 얻는 구조로, 프론트홀 대용량이 과제다.",
    }, image: "/concept/book/nw-cran.png", easy: "기존 기지국은 디지털 처리부(DU)와 무선 송수신부(RF/RU)가 한 몸이었는데, 이를 분리해 DU만 중앙 데이터센터에 모으고 RU는 서비스 지역에 분산시킨 구조입니다. 중앙과 분산 장비를 잇는 구간을 프론트홀이라 부릅니다. 장점: DU가 한곳에 모여 있어 셀 간 간섭 조정이 쉽고 협력 통신 같은 고품질 서비스가 가능하며, 장비·전력 비용도 절감됩니다. 구성: RU(디지털 신호를 RF로 변환해 안테나로 송수신) + Centralized DU(클라우드 형태로 집중된 디지털 처리부). 인터페이스 규격 3종이 시험 포인트: CPRI(DU-RU 간 표준, 사실상 업계 주류), OBSAI(모듈 단위로 나눈 개방형 경쟁 규격), ORI(CPRI의 벤더 간 호환성 한계를 개선하려는 ETSI 주도 표준)." },
"nw-hamming": {
    guide: {
      hook: "패리티 비트를 여러 개 배치해 '어느 비트가 틀렸는지 위치까지' 찾아 정정하는 코드입니다.",
      scene: "패리티 1개는 '틀렸다'만 알지 어디가 틀렸는지 모릅니다. 해밍코드는 패리티를 2의 거듭제곱 위치에 여러 개 넣어, 오류 비트의 위치를 이진수로 지목해 그 비트를 뒤집어 고칩니다 — 1비트 오류 정정.",
      why: "'검출을 넘어 정정'하는 FEC의 대표라는 위치, 그리고 패리티 개수 공식(2^r ≥ m+r+1)과 위치 계산이 출제 핵심입니다.",
      mechanism: "패리티 비트 r개를 2^k 위치(1,2,4,8…)에 배치, 데이터는 나머지 위치. 각 패리티는 특정 비트 그룹의 짝수 패리티를 담당. 수신 측이 각 패리티를 재검사해 얻은 신드롬(이진수)이 오류 비트 위치를 지목 → 해당 비트 반전으로 정정. 최소 해밍거리 3이면 1비트 정정. SEC-DED(확장 해밍)는 1정정+2검출.",
      map: [
        { as: "패리티 여러 개 배치", real: "2^k 위치 패리티", note: "" },
        { as: "오류 위치를 이진수로", real: "신드롬", note: "위치 지목" },
        { as: "그 비트 뒤집어 정정", real: "1비트 오류 정정", note: "" },
        { as: "1정정+2검출", real: "SEC-DED", note: "확장" },
      ],
      usage: "메모리(ECC RAM)·전송 오류 정정에 쓰입니다. 시험은 패리티 개수 공식, 위치 계산, 신드롬입니다.",
      links: [
        { topic: "FEC(Forward Error Correction) / BEC(Backward Error Correction)", how: "해밍은 FEC의 대표 코드입니다." },
        { topic: "CRC(Cyclic Redundancy Check)", how: "검출 전용과 대비되는 정정 코드입니다." },
      ],
      exam: "해밍코드는 2의 거듭제곱 위치에 패리티를 배치해 신드롬으로 오류 비트 위치를 지목·정정하는 FEC로, 최소 해밍거리 3에서 1비트 정정이 가능하다.",
    }, image: "/concept/book/nw-hamming.png", easy: "패리티 비트를 여러 개 심어서 오류를 '검출'만 하는 게 아니라 '몇 번째 비트가 틀렸는지'까지 찾아 고치는 코드입니다. 절차: ① 패리티 개수 결정 — 2^p ≥ d+p+1 (데이터 4비트면 패리티 3개, 7비트면 4개) ② 위치 결정 — 1, 2, 4, 8번째(2의 거듭제곱 자리)에 삽입 ③ 값 결정 — P1은 1·3·5·7·9·11번 비트를, P2는 2·3·6·7·10·11번을, P4는 4~7번을, P8은 8~11번을 검사해 각각 짝수 패리티가 되게 함 ④ 전송 ⑤ 수신 측에서 P1~P8을 다시 검사. 검사 결과가 전부 0이면 정상이고, 0이 아니면 그 값을 P8P4P2P1 순으로 읽어 2진수로 보면 그게 바로 오류가 난 비트 위치입니다(예: 0011 → 3번째 비트를 뒤집으면 복구)." },
"nw-crc": {
    guide: {
      hook: "다항식 나눗셈의 '나머지'로 오류를 검출하는 강력하고 빠른 검사 기법입니다.",
      scene: "데이터를 특정 생성 다항식으로 나눈 나머지(CRC 값)를 붙여 보내고, 수신 측이 같은 방식으로 나눠 나머지가 0인지 봅니다. 0이 아니면 오류입니다 — 하드웨어로 빠르고, 연집(버스트) 오류를 잘 잡습니다.",
      why: "'검출 전용(정정 아님)'이라는 위치와 다항식 연산 원리, 버스트 오류 검출력이 출제 핵심입니다. 정정하는 해밍과의 구분이 포인트입니다.",
      mechanism: "송신: 데이터에 0을 r개 붙이고 생성 다항식 G(x)로 모듈로-2 나눗셈 → 나머지(CRC)를 데이터 뒤에 부착. 수신: 받은 전체를 G(x)로 나눠 나머지 0이면 정상, 아니면 오류(재전송 요청 — ARQ와 결합). 특징: r비트 CRC는 r비트 이하 버스트 오류를 확실히 검출, 하드웨어(시프트 레지스터·XOR)로 고속. 이더넷·USB·ZIP에 사용.",
      map: [
        { as: "다항식으로 나눈 나머지", real: "CRC 값", note: "모듈로-2" },
        { as: "나머지 0이면 정상", real: "수신 검증", note: "" },
        { as: "연속 오류 잘 잡음", real: "버스트 오류 검출", note: "강점" },
        { as: "고치진 못함", real: "검출 전용", note: "해밍과 구분" },
      ],
      usage: "이더넷 FCS·USB·저장매체 무결성 검사입니다. 시험은 다항식 나눗셈, 버스트 검출력, 검출 vs 정정 구분입니다.",
      links: [
        { topic: "해밍코드(Hamming code)", how: "정정 코드와 대비되는 검출 코드입니다." },
        { topic: "FEC(Forward Error Correction) / BEC(Backward Error Correction)", how: "CRC는 BEC의 검출 수단입니다." },
      ],
      exam: "CRC는 생성 다항식의 모듈로-2 나눗셈 나머지로 오류를 검출하는 기법으로, r비트 이하 버스트 오류를 확실히 잡고 하드웨어로 고속이나 정정은 못 한다.",
    }, image: "/concept/book/nw-crc.png", easy: "데이터를 하나의 큰 이진수로 보고 약속된 다항식(Divisor)으로 나눈 나머지를 뒤에 붙여 보내는 오류 검출 기법입니다. 수신 측은 받은 전체를 같은 다항식으로 나눠 나머지가 0이면 정상, 0이 아니면 오류로 보고 재전송을 요청합니다. 절차: Encoding(데이터 뒤에 n개의 0을 붙여 (n+1)비트 Divisor로 나눠 CRC 생성 → 데이터+CRC = 코드 워드) → Transmission → Decoding(같은 Divisor로 나눠 나머지 확인). 교재 예제: 데이터 1011010, 다항식 CRC-8 = X⁸+X²+X+1(100000111) → XOR 나눗셈 결과 나머지 10000001 → 전송 데이터 101101010000001. 강점은 여러 비트가 한꺼번에 깨지는 집단 오류(Burst Error)도 잡아낸다는 점이라 이더넷·Wi-Fi에서 표준으로 씁니다." },
"nw-qos": {
    guide: {
      hook: "제한된 대역에서 '중요한 트래픽에 우선순위'를 줘 품질을 보장하는 기술입니다.",
      scene: "화상회의·VoIP는 조금만 늦어도 끊기지만, 파일 다운로드는 좀 느려도 됩니다. QoS는 트래픽을 분류해 우선순위를 매기고, 대역·지연·손실을 관리해 중요한 통신의 품질을 지킵니다.",
      why: "4대 품질 지표(대역폭·지연·지터·손실)와 서비스 모델(IntServ·DiffServ)이 출제 핵심입니다. 큐잉·정책 기법이 포인트입니다.",
      mechanism: "지표: 대역폭, 지연(Latency), 지터(지연 변동), 패킷 손실. 모델: IntServ(흐름별 자원 예약 — RSVP, 확장성 낮음), DiffServ(패킷에 DSCP 표시로 클래스별 차등 — 확장성 좋음, 실무 주류). 기법: 분류·표시(마킹), 큐잉(PQ·WFQ·LLQ), 폴리싱/셰이핑(속도 제한), 혼잡 회피(WRED). 5G는 네트워크 슬라이싱으로 QoS를 논리망 단위로 보장.",
      map: [
        { as: "지연·지터·손실·대역", real: "4대 품질 지표", note: "" },
        { as: "흐름별 예약", real: "IntServ(RSVP)", note: "확장성 낮음" },
        { as: "클래스별 차등 표시", real: "DiffServ(DSCP)", note: "실무 주류" },
        { as: "우선 큐·속도 제한", real: "큐잉·셰이핑", note: "" },
      ],
      usage: "VoIP·영상·기업망 품질 보장입니다. 시험은 4지표, IntServ/DiffServ 비교, 큐잉 기법입니다.",
      links: [
        { topic: "네트워크 슬라이싱", how: "5G에서 QoS를 논리망으로 보장합니다." },
        { topic: "다중화(Multiplexing)", how: "자원 분배와 함께 품질을 관리합니다." },
      ],
      exam: "QoS는 대역폭·지연·지터·손실을 관리해 중요 트래픽 품질을 보장하는 기술로, 흐름별 예약 IntServ와 클래스별 차등 DiffServ 모델을 쓰며 큐잉·셰이핑으로 구현한다.",
    }, image: "/concept/book/nw-qos.png", easy: "한정된 대역폭을 트래픽 종류에 따라 차등 배분해서, 영상통화 같은 중요한 트래픽이 파일 다운로드에 밀리지 않게 하는 기술입니다. 주요 지표 [대지터패] — 대역폭(최대 처리 능력), 지연(전달까지 걸리는 시간), 지터(도착 간격이 들쭉날쭉한 정도), 패킷 손실. 관리 기술: 트래픽 쉐이핑(Leaky Bucket — 버킷에 담아 일정 속도로 흘려보냄 / Token Bucket — 토큰이 있어야 전송), 혼잡제어(RED — 혼잡 전에 미리 랜덤 폐기 / WRED — 클래스별 가중치 적용), 큐잉(FIFO / Priority Queuing / WFQ). 보장 기술 2가지가 시험 핵심: IntServ(RSVP로 흐름별 자원을 미리 예약 — 정확하지만 확장성 낮음)와 DiffServ(패킷 DS 필드에 DSCP를 마킹해 홉마다 등급대로 처리 — 확장성이 좋아 실무 표준)." },
"nw-arp": {
    guide: {
      hook: "IP 주소로 '같은 랜의 MAC 주소'를 알아내는 주소 변환 프로토콜입니다.",
      scene: "IP는 알아도 실제 이더넷 프레임을 보내려면 상대의 물리 주소(MAC)가 필요합니다. ARP는 '이 IP 쓰는 사람 MAC이 뭐야?'를 브로드캐스트로 물어, 해당 호스트가 자기 MAC으로 응답하면 캐시에 저장합니다.",
      why: "L3(IP)→L2(MAC) 매핑이라는 계층 연결이 출제 핵심입니다. ARP 캐시·스푸핑 취약점이 포인트입니다.",
      mechanism: "ARP Request(브로드캐스트 — '이 IP의 MAC?') → 해당 호스트가 ARP Reply(유니캐스트 — 자기 MAC) → ARP 캐시에 IP-MAC 저장(TTL). 같은 서브넷 내에서만 동작(다른 망은 게이트웨이 MAC으로). 취약: 인증이 없어 위조 응답으로 캐시를 오염(ARP 스푸핑) → 중간자 공격. 방어: 정적 ARP·DAI(Dynamic ARP Inspection).",
      map: [
        { as: "IP로 MAC 묻기", real: "L3→L2 매핑", note: "핵심" },
        { as: "전체에 물어보기", real: "ARP Request(브로드캐스트)", note: "" },
        { as: "당사자만 답하기", real: "ARP Reply(유니캐스트)", note: "" },
        { as: "위조 응답 오염", real: "ARP 스푸핑", note: "취약점" },
      ],
      usage: "이더넷 통신의 필수 기능입니다. 시험은 IP-MAC 매핑, 브로드캐스트/유니캐스트, ARP 스푸핑입니다.",
      links: [
        { topic: "RARP(Reverse Address Resolution Protocol)", how: "MAC→IP의 반대 방향입니다." },
        { topic: "스니핑(Sniffing) & 스푸핑(Spoofing)", how: "ARP 스푸핑이 중간자 공격에 쓰입니다." },
      ],
      exam: "ARP는 같은 서브넷에서 IP 주소로 MAC 주소를 알아내는 프로토콜로, 브로드캐스트 요청·유니캐스트 응답으로 동작하며 인증 부재로 ARP 스푸핑에 취약하다.",
    }, image: "/concept/book/nw-arp.png", easy: "IP 주소는 아는데 상대의 MAC 주소를 모를 때, 같은 LAN 안에서 \"이 IP 쓰는 사람 MAC 주소 알려줘\"라고 물어 알아내는 프로토콜입니다. 동작이 비대칭인 게 시험 포인트: 요청은 브로드캐스트 — 호스트 A가 Destination MAC을 FF:FF:FF:FF:FF:FF로 채운 ARP Request를 네트워크 전체에 뿌립니다. 응답은 유니캐스트 — 자기 IP임을 확인한 호스트 D만 ARP Reply를 A에게 1:1로 보냅니다. A는 받은 MAC을 자신의 ARP Cache 테이블에 저장해 두고 이후 통신에 씁니다(그래서 매번 묻지 않음). 반대 방향, 즉 MAC은 아는데 IP를 모를 때 쓰는 것이 RARP입니다." },
"nw-dns": {
    guide: {
      hook: "'사람이 읽는 도메인'을 '컴퓨터가 쓰는 IP'로 바꿔 주는 인터넷 전화번호부입니다.",
      scene: "www.example.com을 외우긴 쉬워도 컴퓨터는 IP 주소로 통신합니다. DNS는 이 이름을 IP로 번역해 주는 분산 데이터베이스로, 전 세계 서버가 계층적으로 나눠 관리합니다.",
      why: "계층 구조(루트→TLD→권한)와 재귀·반복 질의, 캐싱이 출제 핵심입니다. DNS 스푸핑·DNSSEC 보안과 연결됩니다.",
      mechanism: "계층: 루트(.) → TLD(.com) → 권한 네임서버(example.com). 질의: 스텁 리졸버 → 재귀 리졸버가 루트부터 반복 질의(iterative)로 최종 IP 획득 → 캐싱(TTL 동안). 레코드: A(IPv4)·AAAA(IPv6)·CNAME(별칭)·MX(메일)·NS(네임서버)·TXT. 보안: 응답 위조(스푸핑·캐시 포이즈닝) → DNSSEC 서명, DoH/DoT 암호화.",
      map: [
        { as: "이름을 IP로 번역", real: "이름 해석", note: "핵심 기능" },
        { as: "루트→TLD→권한", real: "계층 구조", note: "분산" },
        { as: "리졸버가 대신 반복 질의", real: "재귀·반복 질의", note: "" },
        { as: "TTL 동안 기억", real: "캐싱", note: "성능" },
      ],
      usage: "모든 인터넷 접속의 첫 단계입니다. 시험은 계층·질의 방식·레코드, 캐싱, DNSSEC 보안입니다.",
      links: [
        { topic: "DNSSEC(Domain Name System Security Extension)", how: "DNS 응답을 서명으로 보호합니다." },
        { topic: "CDN(Contents Delivery Network)", how: "DNS 기반으로 가까운 서버로 유도합니다." },
      ],
      exam: "DNS는 도메인 이름을 IP로 변환하는 계층적 분산 DB로, 재귀·반복 질의와 캐싱으로 동작하며 A·MX 등 레코드를 관리하고 DNSSEC으로 위조를 방지한다.",
    }, image: "/concept/book/nw-dns.png", easy: "사람이 외우는 이름(www.test.com)을 컴퓨터가 쓰는 IP 주소로 바꿔주는 인터넷 전화번호부입니다. 질의 두 종류가 시험 핵심입니다: Recursive Query(재귀) — 클라이언트가 로컬 DNS 서버에게 \"답을 찾아서 갖다 줘\"라고 위임하는 방식 / Iterative Query(반복) — 로컬 DNS 서버가 Root → TLD(.com) → Authoritative(ns.test.com) 순으로 \"다음엔 저기 물어봐\"를 안내받아 직접 찾아가는 방식. 전체 흐름 9단계: 클라이언트 질의 → 로컬 DNS가 Root에 질의 → .com 서버 IP 받음 → TLD에 질의 → test.com DNS 정보 받음 → ns.test.com에 질의 → www의 IP 받음 → 클라이언트에 전달 → 접속. 기능: Name Resolution, Host Aliasing(별칭), Mail Server Aliasing, Load Distribution(한 URL에 여러 IP를 두어 부하 분산)." },
"nw-routing": {
    guide: {
      hook: "패킷의 '최적 경로'를 정하는 두 철학 — 소문(거리벡터)과 지도(링크상태)입니다.",
      scene: "거리벡터는 이웃에게 '나는 거기까지 몇 홉'이라고 소문을 퍼뜨려 경로를 정하고(옆집 말만 믿음), 링크상태는 전체 망 지도를 각자 그려 최단경로를 계산합니다(전체를 봄). 정보 공유 방식이 다릅니다.",
      why: "거리벡터 vs 링크상태의 원리·장단 비교가 출제 핵심입니다. 대표 프로토콜(RIP·OSPF)과 수렴·무한 카운팅 문제가 포인트입니다.",
      mechanism: "거리벡터(Distance Vector — RIP): 이웃과 라우팅 테이블 전체를 주기적 교환, 벨만-포드로 홉수 최소 경로, 느린 수렴·무한 카운팅(스플릿 호라이즌·홀드다운으로 완화). 링크상태(Link State — OSPF): 링크 상태(LSA)를 전체에 플러딩해 각자 전체 지도 구성, 다익스트라로 최단경로, 빠른 수렴·확장성 좋으나 자원 부담. AS 간은 경로벡터(BGP).",
      map: [
        { as: "옆집 소문만 믿기", real: "거리벡터(RIP)", note: "벨만-포드·홉수" },
        { as: "전체 지도 그리기", real: "링크상태(OSPF)", note: "다익스트라" },
        { as: "느린 수렴·루프", real: "무한 카운팅", note: "거리벡터 단점" },
        { as: "AS 간 경로", real: "경로벡터(BGP)", note: "" },
      ],
      usage: "라우터 경로 결정의 핵심입니다. 시험은 거리벡터/링크상태 비교, RIP/OSPF, 무한 카운팅입니다.",
      links: [
        { topic: "BGP(Border Gateway Protocol)", how: "AS 간 경로벡터 라우팅입니다." },
        { topic: "OSI 7 Layer (ISO 7498)", how: "3계층 네트워크의 경로 기능입니다." },
      ],
      exam: "라우팅은 거리벡터(이웃과 테이블 교환·벨만포드·RIP)와 링크상태(전체 지도·다익스트라·OSPF)로 나뉘며, 거리벡터는 무한 카운팅, 링크상태는 자원 부담이 단점이다.",
    }, image: "/concept/book/nw-routing.png", easy: "패킷을 목적지까지 어느 길로 보낼지 정하는 라우팅 테이블을 만들고 유지하는 프로토콜입니다. 두 방식의 대비가 핵심입니다. 거리벡터(Distance Vector): 이웃 라우터가 주기적으로 알려주는 정보만 믿고, 홉 수(Hop count)가 가장 적은 길을 고릅니다 — 벨만-포드 알고리즘, RIP·IGRP. 이웃에게 받은 테이블에 자기까지의 거리를 더해 기존 값과 비교하고, 더 작으면 갱신하는 식입니다(소문으로 길 찾기). 링크상태(Link State): 각 라우터가 이웃의 링크 상태를 수집(LSA)해 전체 토폴로지 데이터베이스, 즉 '지도'를 만들고, SPF(다익스트라)로 최소 비용 경로를 직접 계산합니다 — OSPF·EIGRP. 계산 결과로 SPF 트리를 만들고 그것으로 라우팅 테이블을 생성합니다(지도 보고 길 찾기)." },
"nw-fec-bec": {
    guide: {
      hook: "오류를 '스스로 고치는' FEC와 '다시 보내달라 하는' BEC — 정정 방식이 반대입니다.",
      scene: "FEC는 미리 여분 정보를 붙여 수신 측이 재전송 없이 오류를 복원하고(위성·방송처럼 되묻기 어려운 곳), BEC는 오류를 검출하면 송신 측에 재전송을 요청합니다(되묻기 쉬운 유선). 지연과 대역의 트레이드오프입니다.",
      why: "'전진 정정(FEC) vs 후진 정정(BEC=ARQ)'의 원리·적용처가 출제 핵심입니다. ARQ 방식(정지대기·GBN·SR)이 포인트입니다.",
      mechanism: "FEC(Forward): 잉여 비트(오류정정부호 — 해밍·리드솔로몬·터보·LDPC)를 미리 추가해 수신 측이 재전송 없이 정정 → 지연↓·대역 오버헤드↑, 단방향·실시간(방송·위성·저장매체). BEC(Backward=ARQ): 오류 검출(CRC 등) 후 재전송 요청 — Stop-and-Wait, Go-Back-N, Selective Repeat → 대역 효율↑·지연↑, 양방향. 하이브리드 HARQ는 둘 결합(LTE·5G).",
      map: [
        { as: "여분 붙여 스스로 복원", real: "FEC(전진 정정)", note: "재전송 없음" },
        { as: "틀리면 다시 보내달라", real: "BEC(후진=ARQ)", note: "재전송" },
        { as: "위성·방송", real: "FEC 적용", note: "되묻기 어려움" },
        { as: "정지대기·GBN·SR", real: "ARQ 방식", note: "BEC 종류" },
      ],
      usage: "오류 제어 설계의 기본입니다. 시험은 FEC/BEC 원리·적용처, ARQ 3방식, HARQ입니다.",
      links: [
        { topic: "해밍코드(Hamming code)", how: "FEC의 대표 오류정정부호입니다." },
        { topic: "CRC(Cyclic Redundancy Check)", how: "BEC의 오류 검출에 쓰입니다." },
      ],
      exam: "FEC는 잉여 비트로 재전송 없이 오류를 정정하는 전진 정정으로 위성·방송에, BEC(ARQ)는 오류 검출 후 재전송을 요청하는 후진 정정으로 유선에 쓰이며 HARQ로 결합된다.",
    }, image: "/concept/book/nw-fec-bec.png", easy: "전송 중 생긴 오류를 어떻게 처리하느냐로 갈리는 두 방식입니다. FEC(전진 오류 정정): 보낼 때 미리 잉여비트를 넣어두어 수신 측이 재전송 요청 없이 스스로 고칩니다 — 되돌아갈 시간이 없는 실시간 방송·위성 통신에 유리. 기법은 블록 코드(해밍 코드 — 패리티 비트로 오류 위치까지 찾아 정정 / RS 코드 — 랜덤·연집 오류까지 정정)와 논블록 코드(길쌈 코드 — 과거 신호까지 활용하는 메모리 부호화 / 터보 코드)로 나뉩니다. BEC(후진 오류 정정): 오류를 검출만 하고 송신 측에 알려 다시 보내게 합니다 — 검출은 Parity Check·Block Sum·CRC·Check Sum, 재전송(ARQ)은 Stop and Wait(하나 보내고 응답 대기), Go-Back-N(오류 프레임부터 전부 다시), Selective-Repeat(오류 프레임만), Adaptive ARQ(블록 길이를 동적 조절)." },
"nw-tcp-congestion": {
    guide: {
      hook: "네트워크가 막히지 않게 '전송 속도를 스스로 조절'하는 TCP의 자율 브레이크입니다.",
      scene: "고속도로에 차를 마구 보내면 정체가 심해집니다. TCP는 처음엔 조금씩 빠르게 늘리다가(느린 시작), 어느 선부터 천천히 늘리고, 혼잡 신호(패킷 손실)가 오면 속도를 확 줄입니다. 네트워크 상태를 보며 창(window) 크기를 조절합니다.",
      why: "4단계(느린 시작·혼잡 회피·빠른 재전송·빠른 회복)와 AIMD 원리가 출제 핵심입니다. 흐름제어(수신자 보호)와의 구분이 포인트입니다.",
      mechanism: "혼잡 윈도우(cwnd) 조절. Slow Start(cwnd를 1부터 지수적 2배 증가 → 임계값 ssthresh까지), Congestion Avoidance(임계 후 선형 1씩 증가 — AIMD의 AI), Fast Retransmit(중복 ACK 3개면 타임아웃 전 재전송), Fast Recovery(손실 시 cwnd 절반 — AIMD의 MD). 타임아웃이면 Slow Start로. 흐름제어(rwnd, 수신자 버퍼)와 별개로 네트워크 혼잡을 다룸.",
      map: [
        { as: "처음엔 지수로 빠르게", real: "Slow Start", note: "cwnd 2배" },
        { as: "이후 천천히 선형", real: "혼잡 회피(AI)", note: "" },
        { as: "손실 시 절반으로", real: "빠른 회복(MD)", note: "AIMD" },
        { as: "중복 ACK로 즉시 재전송", real: "빠른 재전송", note: "" },
      ],
      usage: "인터넷 안정성의 핵심입니다. 시험은 4단계·AIMD, 흐름제어와의 구분, cwnd/ssthresh입니다.",
      links: [
        { topic: "TCP 연결의 설정 및 해제(Handshaking)", how: "연결 후 이 제어가 작동합니다." },
        { topic: "Sliding Window & 네이글(Nagle's) 알고리즘", how: "윈도우 기반 전송 제어를 공유합니다." },
      ],
      exam: "TCP 혼잡제어는 혼잡 윈도우를 느린 시작·혼잡 회피·빠른 재전송·빠른 회복으로 조절하는 AIMD 기반 제어로, 수신자 버퍼를 다루는 흐름제어와 구분된다.",
    }, image: "/concept/book/nw-tcp-congestion.png", easy: "네트워크가 감당할 수 있는 양보다 많은 트래픽이 몰리지 않게 송신 속도를 조절하는 메커니즘입니다. 4단계로 움직입니다: ① Slow Start — 처음엔 조심스럽게 시작해 전송할 때마다 윈도우(CWND)를 2배씩 지수 증가 ② Congestion Avoidance — 임계치(ssthresh)에 도달하면 급증을 멈추고 1씩 선형 증가 ③ Fast Retransmit — 손실이 감지되면 타임아웃을 기다리지 않고 즉시 재전송 ④ Fast Recovery — 재전송 후 처음부터 시작하지 않고 윈도우 절반에서 다시 선형 증가. 알고리즘 계보가 시험 포인트: Tahoe(손실 시 Slow Start부터 재시작) → Reno(Fast Recovery 도입, 절반에서 재개) → New Reno(Partial ACK로 한 윈도우에 여러 패킷이 손실돼도 RTO 대기 없이 복구)." },
"nw-tcp-udp": {
    guide: {
      hook: "'신뢰의 TCP'와 '속도의 UDP' — 목적이 정반대인 두 전송 프로토콜입니다.",
      scene: "중요한 파일은 빠짐없이 순서대로 도착해야 하니 TCP(연결·확인·재전송), 실시간 영상·게임은 조금 빠져도 빨리 와야 하니 UDP(비연결·무보장·저지연)를 씁니다. 신뢰성과 속도를 맞바꿉니다.",
      why: "두 프로토콜의 특성 비교표가 출제 핵심입니다. 각 응용(파일=TCP, 스트리밍/DNS/VoIP=UDP)의 선택 이유가 포인트입니다.",
      mechanism: "TCP: 연결 지향(3-way), 신뢰성(순서·재전송·확인응답), 흐름·혼잡 제어, 헤더 20B, 스트림. UDP: 비연결, 무보장(순서·재전송 없음), 제어 없음, 헤더 8B, 데이터그램, 저지연·저오버헤드. 선택: 정확성 중요(웹·파일·메일)=TCP, 실시간·소량·브로드캐스트(스트리밍·게임·DNS·VoIP)=UDP. QUIC는 UDP 위에 신뢰성을 얹음.",
      map: [
        { as: "빠짐없이 순서대로", real: "TCP(신뢰)", note: "연결·재전송" },
        { as: "빠르게 일단 보내기", real: "UDP(속도)", note: "비연결·무보장" },
        { as: "웹·파일·메일", real: "TCP 응용", note: "" },
        { as: "스트리밍·DNS·VoIP", real: "UDP 응용", note: "" },
      ],
      usage: "전송 프로토콜 선택의 기준입니다. 시험은 비교표, 응용별 선택 이유, QUIC의 위치입니다.",
      links: [
        { topic: "TCP 혼잡제어", how: "TCP만의 제어 메커니즘입니다." },
        { topic: "HTTP/3", how: "UDP 위에 신뢰성을 얹은 QUIC를 씁니다." },
      ],
      exam: "TCP는 연결 지향·신뢰성·흐름/혼잡 제어로 정확성이 중요한 응용에, UDP는 비연결·무보장·저지연으로 실시간 응용에 쓰이며 속도와 신뢰성을 맞바꾼다.",
    }, image: "/concept/book/nw-tcp-udp.png", easy: "TCP는 연결을 먼저 맺고 도착을 확인·재전송하며 보내는 신뢰성 중심의 전송 프로토콜이고, UDP는 연결 없이 확인도 없이 보내는 속도 중심의 전송 프로토콜입니다. TCP: 연결지향, 순서 유지, 중복·손실 없음, 에러 시 재전송, 슬라이딩 윈도우로 흐름제어, 헤더 20바이트, HTTP·FTP·SMTP에 사용 — 느리지만 신뢰성. UDP: 비연결, 순서 유지 안 함, 손실 가능, 재전송 없음, 흐름제어 없음, 헤더 8바이트, DNS·SNMP·RIP에 사용 — 빠르지만 비신뢰성(실시간 스트리밍·게임에 적합). TCP 제어 플래그 6개도 단골입니다: URG(긴급 우선 송신), ACK(확인응답번호 유효), PSH(버퍼 대기 없이 즉시 전달), RST(강제 연결 리셋), SYN(연결설정 순서번호 동기화), FIN(전송 종료)." },
"nw-ipv4-ipv6-tunneling": {
    guide: {
      hook: "IPv6 패킷을 IPv4 망 위로 '캡슐에 싸서' 보내는 과도기 전환 기술입니다.",
      scene: "IPv6 섬들 사이에 아직 IPv4 바다가 있습니다. 터널링은 IPv6 패킷을 IPv4 패킷 안에 통째로 넣어(캡슐화) IPv4 망을 건너보내고, 반대편에서 껍질을 벗겨 IPv6로 복원합니다.",
      why: "IPv4→IPv6 전환 3방식(듀얼스택·터널링·변환) 중 터널링의 원리가 출제 핵심입니다. 대표 방식(6to4·Teredo·ISATAP)이 포인트입니다.",
      mechanism: "전환 3방식: 듀얼스택(양쪽 동시 지원), 터널링(IPv6를 IPv4에 캡슐화 — 6to4·6in4·Teredo(NAT 통과)·ISATAP), 변환(NAT64/DNS64로 프로토콜 자체 변환). 터널: 진입점에서 IPv6 패킷을 IPv4 헤더로 감싸고, 출구에서 역캡슐화. IPv6 도입 초기 상호운용 확보.",
      map: [
        { as: "IPv6를 IPv4로 감싸기", real: "캡슐화 터널링", note: "핵심" },
        { as: "양쪽 다 지원", real: "듀얼스택", note: "다른 전환법" },
        { as: "프로토콜 자체 변환", real: "NAT64/변환", note: "다른 전환법" },
        { as: "NAT 뒤에서도", real: "Teredo", note: "터널 방식" },
      ],
      usage: "IPv6 전환기의 상호운용 기술입니다. 시험은 전환 3방식, 터널링 캡슐화 원리, 대표 방식입니다.",
      links: [
        { topic: "IPv6", how: "터널링이 IPv6 도입을 돕습니다." },
        { topic: "DNS(Domain Name System)", how: "DNS64가 변환 방식에 쓰입니다." },
      ],
      exam: "IPv4/IPv6 터널링은 IPv6 패킷을 IPv4 패킷에 캡슐화해 IPv4 망을 통과시키는 전환 기술로, 듀얼스택·변환과 함께 IPv6 도입기의 상호운용을 제공한다.",
    }, image: "/concept/book/nw-ipv4-ipv6-tunneling.png", easy: "IPv4에서 IPv6로 한 번에 갈아탈 수 없으니, 두 체계가 공존하며 연동하는 전환 기술 3가지입니다. 듀얼 스택: 한 장비에 IPv4와 IPv6 기능을 모두 설치해 상대에 맞춰 골라 씀 — 가장 확실하지만 프로토콜 스택 수정 비용이 큼. 터널링: IPv6 패킷을 IPv4 패킷 속에 통째로 캡슐화해서 중간의 IPv4망을 '터널'처럼 통과시킴 — IPv6망 사이에 IPv4 구간이 끼어 있을 때 사용(IPv6 Over IPv4 Tunnel). 주소 변환(G/W 방식): 중간에 주소변환기를 두어 IPv4망과 IPv6망을 상호 연동 — 호스트 수정이 불필요하고 구현이 쉬움. 변환 방식은 헤더변환, 수송계층 릴레이, 응용계층 게이트웨이(ALG) 셋입니다." },
"nw-csma-ca": {
    guide: {
      hook: "무선은 충돌을 못 '감지'하니, 아예 '회피'하도록 설계한 Wi-Fi의 접근 방식입니다.",
      scene: "무선에선 내가 보내는 순간 다른 신호를 못 들어(숨은 단말) 충돌을 감지할 수 없습니다. 그래서 미리 회피합니다 — 회선이 비어도 임의 시간 더 기다리고(백오프), 필요하면 '보내도 되냐' 예약(RTS/CTS)을 먼저 합니다.",
      why: "'왜 감지가 아니라 회피인가'(무선 특성·숨은 단말 문제)와 RTS/CTS·ACK가 출제 핵심입니다. CSMA/CD와의 대비가 포인트입니다.",
      mechanism: "회선 청취 → 유휴여도 DIFS 대기 + 랜덤 백오프(경쟁 완화) → 전송 → 수신자 ACK로 성공 확인(충돌 시 ACK 없음→재시도). 숨은 단말 문제 해결: RTS(전송 요청)/CTS(전송 허가) 교환으로 주변에 채널 점유를 알림(NAV 설정). 감지 대신 회피+확인응답으로 신뢰성 확보.",
      map: [
        { as: "비어도 더 기다리기", real: "DIFS+랜덤 백오프", note: "충돌 회피" },
        { as: "보내도 되냐 예약", real: "RTS/CTS", note: "숨은 단말 해결" },
        { as: "받았다는 응답", real: "ACK", note: "성공 확인" },
        { as: "감지 대신 회피", real: "무선 특성 대응", note: "CD와 대비" },
      ],
      usage: "Wi-Fi(802.11)의 매체 접근 방식입니다. 시험은 CSMA/CD와의 대비, 숨은 단말·RTS/CTS, ACK 기반 신뢰성입니다.",
      links: [
        { topic: "CSMA/CD", how: "유선의 짝 방식으로 충돌 감지를 씁니다." },
        { topic: "Wi-Fi 7(IEEE 802.11be)", how: "최신 Wi-Fi의 매체 접근 기반입니다." },
      ],
      exam: "CSMA/CA는 무선에서 충돌 감지가 불가능해 백오프·RTS/CTS로 충돌을 회피하고 ACK로 성공을 확인하는 Wi-Fi 접근 방식으로, 숨은 단말 문제에 대응한다.",
    }, image: "/concept/book/nw-csma-cd.png", easy: "무선 LAN(Wi-Fi)의 매체 접근 방식입니다. 유선(CSMA/CD)은 부딪히면 알아채고 다시 보내지만, 무선은 자기 송신 신호가 너무 커서 충돌을 감지할 수 없습니다 — 그래서 아예 안 부딪히게 예방(Avoidance)합니다. 기법: IFS(채널이 비어도 곧바로 안 보내고 일정 시간 대기 — 우선순위 부여) → Back-off(추가로 임의 시간 대기해 동시 전송 확률↓) → RTS/CTS(송신 요청과 수신 준비 완료를 주고받아 채널 예약 — 서로 안 보이는 단말끼리 부딪히는 히든 노드 문제 해결) → NAV(그 대화를 엿들은 다른 단말은 그동안 자제) → ACK(충돌 감지가 불가하니 수신 확인으로 성공 여부 판단, 없으면 재전송). 한 줄: CD=부딪히면 감지, CA=예약하고 확인받기." },
"nw-multiplexing": {
    guide: {
      hook: "하나의 회선에 '여러 신호를 함께 실어' 자원을 나눠 쓰는 기술입니다.",
      scene: "값비싼 광케이블 하나에 통화 하나만 흐르면 낭비입니다. 다중화는 주파수·시간·파장·코드를 나눠 여러 통신을 한 회선에 겹쳐 보내고, 수신 측에서 다시 분리(역다중화)합니다.",
      why: "4대 방식(FDM·TDM·WDM·CDM)의 원리와 적용처가 출제 핵심입니다. 나누는 '축'이 무엇인지가 구분 포인트입니다.",
      mechanism: "FDM(주파수 분할 — 대역을 채널로 나눔, 아날로그·방송), TDM(시간 분할 — 타임슬롯을 번갈아, 디지털·동기/통계적), WDM(파장 분할 — 광섬유에서 파장별로, 광통신 대용량·DWDM), CDM/CDMA(코드 분할 — 서로 다른 코드로 구분, 이동통신). 통계적 TDM은 필요할 때만 슬롯 할당해 효율↑.",
      map: [
        { as: "주파수 대역 나누기", real: "FDM", note: "아날로그·방송" },
        { as: "시간 슬롯 번갈아", real: "TDM", note: "디지털" },
        { as: "빛 파장별로", real: "WDM(DWDM)", note: "광통신 대용량" },
        { as: "코드로 구분", real: "CDM/CDMA", note: "이동통신" },
      ],
      usage: "모든 통신 인프라의 자원 공유 기법입니다. 시험은 4방식의 분할 축·적용처 매핑입니다.",
      links: [
        { topic: "QAM(Quadrature Amplitude Modulation)", how: "변조와 함께 대역 효율을 높입니다." },
        { topic: "네트워크 슬라이싱", how: "5G에서 논리적 다중화로 확장됩니다." },
      ],
      exam: "다중화는 하나의 회선에 여러 신호를 실어 자원을 공유하는 기술로, 주파수(FDM)·시간(TDM)·파장(WDM)·코드(CDM) 축으로 나누며 수신 측에서 역다중화한다.",
    }, image: "/concept/book/nw-multiplexing.png", easy: "하나의 전송로를 여러 채널로 쪼개 여러 신호를 동시에 보내는 기술 — 회선 하나를 여럿이 나눠 쓰는 것입니다. 종류가 시험 핵심: FDM(주파수 분할 — 넓은 대역폭을 주파수로 나눔, 라디오 채널), TDM(시간 분할 — 한 회선을 타임슬롯으로 나눠 번갈아 사용), CDM(코드 분할 — 서로 직교하는 코드를 부여해 확산 대역으로 동시 전송), WDM(파장 분할 — 파장이 다른 광 신호를 광섬유 한 가닥에), SDM(공간 분할 — 물리적으로 분리된 여러 채널을 하나처럼). 다원접속(Multiple Access)과의 비교도 나옵니다: 다중화는 한 지점에서 모아 보내는 하향(Down-link, FDM·TDM), 다원접속은 여러 단말이 각자 보내는 상향(Up-link, FDMA·TDMA·CDMA)." },
"nw-service-primitive": {
    guide: {
      hook: "계층 간 서비스 요청·응답을 정형화한 '4가지 원시 명령'입니다.",
      scene: "상위 계층이 하위 계층에 서비스를 요청하고 결과를 받는 대화를 표준 동작으로 정의한 것입니다. '요청→표시→응답→확인'의 4단계로 계층 간 협력이 이뤄집니다.",
      why: "4종 프리미티브(Request·Indication·Response·Confirm)와 확인형/비확인형 서비스 구분이 출제 포인트입니다. OSI 계층 서비스 모델의 기초입니다.",
      mechanism: "4 프리미티브: Request(서비스 요청 — 송신 상위→하위), Indication(도착 통지 — 수신 하위→상위), Response(응답 — 수신 상위→하위), Confirm(확인 회신 — 송신 하위→상위). 확인형 서비스(4개 모두 사용, 예: 연결 설정), 비확인형(Request·Indication만, 예: 데이터그램). 계층 간 SAP(서비스 접근점)를 통해 교환.",
      map: [
        { as: "서비스 요청", real: "Request", note: "송신측 상→하" },
        { as: "도착 알림", real: "Indication", note: "수신측 하→상" },
        { as: "응답", real: "Response", note: "수신측 상→하" },
        { as: "확인 회신", real: "Confirm", note: "송신측 하→상" },
      ],
      usage: "OSI 계층 서비스 정의의 기초 개념입니다. 시험은 4 프리미티브 흐름, 확인형/비확인형 구분입니다.",
      links: [
        { topic: "OSI 7 Layer (ISO 7498)", how: "계층 간 서비스 모델의 기초입니다." },
        { topic: "TCP 연결의 설정 및 해제(Handshaking)", how: "확인형 서비스의 실제 예입니다." },
      ],
      exam: "서비스 프리미티브는 계층 간 서비스를 Request·Indication·Response·Confirm 4종으로 정형화한 것으로, 4개를 다 쓰면 확인형, Request·Indication만 쓰면 비확인형 서비스다.",
    }, image: "/concept/book/nw-service-primitive.png", easy: "계층 구조에서 위아래 계층이 서로 서비스를 주고받을 때 쓰는 표준 대화 형식입니다. 4종류를 흐름으로 외우세요: ① Request(요청) — 송신측 상위계층이 하위계층에 전송·연결설정을 요구(아래로) → ② Indication(지시) — 수신측 하위계층이 상위계층에 도착을 알림(위로) → ③ Response(응답) — 수신측 상위계층이 처리 결과를 하위로 전달 → ④ Confirm(확인) — 송신측 하위계층이 상위계층에 응답이 왔음을 알림. 표기법도 시험에 나옵니다: T.CONNECT.request(called address, calling address, …, user data) — T는 서비스 제공 계층(Transport), CONNECT는 동작 이름, request는 방향, 괄호 안은 파라미터입니다." },
"nw-osi-7layer": {
    guide: {
      hook: "통신을 7개 계층으로 나눠 '각 층이 제 역할만' 하게 한 국제 참조 모델입니다.",
      scene: "복잡한 통신을 한 덩어리로 만들면 못 다룹니다. OSI는 물리 신호부터 응용까지 7층으로 나눠, 각 층이 아래층 서비스를 쓰고 위층에 서비스를 제공하게 합니다 — 한 층을 바꿔도 다른 층은 그대로입니다.",
      why: "7계층의 역할과 대표 프로토콜·장비 매핑이 출제 핵심입니다. TCP/IP 4계층과의 대응, 계층별 PDU(비트·프레임·패킷·세그먼트)가 포인트입니다.",
      mechanism: "1 물리(비트·전기신호·케이블·리피터), 2 데이터링크(프레임·MAC·오류/흐름 제어·스위치), 3 네트워크(패킷·IP·라우팅·라우터), 4 전송(세그먼트·TCP/UDP·포트·종단 신뢰), 5 세션(대화 관리·동기점), 6 표현(암호화·압축·인코딩), 7 응용(HTTP·FTP·사용자 서비스). 캡슐화로 각 층이 헤더를 붙임. 두음 '아파서티내다피(응용부터)' 등.",
      map: [
        { as: "전기신호·케이블", real: "1 물리(비트)", note: "리피터" },
        { as: "MAC·프레임", real: "2 데이터링크", note: "스위치" },
        { as: "IP·라우팅", real: "3 네트워크(패킷)", note: "라우터" },
        { as: "TCP·포트·신뢰", real: "4 전송(세그먼트)", note: "" },
      ],
      usage: "네트워크 이해·문제 진단의 기준 틀입니다. 시험은 7계층 역할·프로토콜·장비·PDU 매핑, TCP/IP와의 대응입니다.",
      links: [
        { topic: "TCP 와 UDP 비교", how: "4계층 전송 프로토콜입니다." },
        { topic: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", how: "3계층 네트워크의 경로 결정입니다." },
      ],
      exam: "OSI 7계층은 물리·데이터링크·네트워크·전송·세션·표현·응용으로 통신을 나눈 참조 모델로, 각 계층이 독립적 역할과 PDU를 가지며 TCP/IP 4계층과 대응된다.",
    }, image: "/concept/book/nw-osi-7layer.png", easy: "ISO가 만든 네트워크 표준 7계층 모델 — 두음 [아파서티내다]로 위에서부터 외웁니다. 7 Application(사용자가 네트워크에 접근: HTTP·SMTP·FTP) → 6 Presentation(표현 형태 변환·번역: JPEG·MPEG) → 5 Session(세션 구성·동기화: TLS·SSH) → 4 Transport(발신지-목적지 제어·에러 관리, 재전송으로 신뢰성 보장: TCP·UDP) → 3 Network(패킷을 목적지까지 전달: IP·ICMP·라우팅) → 2 Data Link(오류 없이 프레임 전달, MAC 주소 기반: Ethernet·PPP) → 1 Physical(비트 흐름 전송: RS-232C·광섬유). 함께 외울 것: 데이터 단위(Transport=세그먼트, Network=패킷, Data Link=프레임, Physical=비트)와 장비(Router 3계층, Bridge 2계층, Repeater 1계층). 송신은 헤더를 붙이며 내려가고(캡슐화) 수신은 벗기며 올라갑니다." },
"nw-http3": {
    guide: {
      hook: "TCP를 버리고 'UDP 기반 QUIC' 위에서 도는 차세대 HTTP — 지연을 확 줄였습니다.",
      scene: "HTTP/2는 TCP를 쓰는데, 패킷 하나만 유실돼도 모든 스트림이 멈추는 문제(HOL 블로킹)가 있었습니다. HTTP/3는 UDP 기반 QUIC로 갈아타 스트림을 독립시키고, 연결·암호화 핸드셰이크를 한 번에 끝내 접속을 빠르게 합니다.",
      why: "'왜 TCP를 버렸나'(HOL 블로킹)와 QUIC의 이점(0-RTT·연결 마이그레이션·TLS 1.3 통합)이 출제 핵심입니다. HTTP/1.1→2→3 진화가 포인트입니다.",
      mechanism: "QUIC(UDP 기반): 스트림별 독립 전송으로 전송 계층 HOL 블로킹 제거, 연결 설정+TLS 1.3 암호화를 1-RTT(재접속 0-RTT)로 통합, 연결 ID로 IP 변경에도 연결 유지(Wi-Fi↔셀룰러 마이그레이션). HTTP/2의 멀티플렉싱·헤더 압축(QPACK)은 계승. UDP라 방화벽 이슈는 폴백으로 대응.",
      map: [
        { as: "하나 막히면 다 멈춤 해소", real: "전송 HOL 블로킹 제거", note: "핵심" },
        { as: "UDP 위 신뢰 전송", real: "QUIC", note: "TCP 대체" },
        { as: "접속·암호화 한 번에", real: "1-RTT/0-RTT", note: "TLS 1.3 통합" },
        { as: "Wi-Fi↔셀룰러 유지", real: "연결 마이그레이션", note: "연결 ID" },
      ],
      usage: "최신 웹·모바일 성능 최적화입니다. 시험은 HTTP/2 HOL 블로킹, QUIC 이점, 1.1→2→3 진화입니다.",
      links: [
        { topic: "TCP 혼잡제어", how: "QUIC가 사용자 공간에서 혼잡제어를 구현합니다." },
        { topic: "TLS/SSL(Secure Socket Layer)", how: "QUIC에 TLS 1.3이 통합됩니다." },
      ],
      exam: "HTTP/3는 TCP의 HOL 블로킹을 없애기 위해 UDP 기반 QUIC 위에서 동작하며, 1-RTT/0-RTT 핸드셰이크와 연결 마이그레이션으로 지연을 줄인 차세대 HTTP다.",
    }, image: "/concept/book/nw-http3.png", easy: "구글이 만든 QUIC 위에서 도는 차세대 HTTP입니다. 기존 HTTP/2가 TCP+TLS 위에 있었다면, HTTP/3은 UDP 위에 QUIC(TLS 1.3 + TCP식 혼잡제어·손실복구)을 얹었습니다 — TCP의 느린 연결 설정을 버리고 속도를 얻은 것입니다. 핵심 특징: 0-RTT/1-RTT 연결(이전 연결의 캐시된 자격 증명으로 악수 생략), HOL 블로킹 해결(다중 스트림 — 앞 패킷이 막혀도 뒤 스트림은 진행), Seamless Connection(Connection ID로 Wi-Fi↔LTE 전환에도 연결 유지), SACK(선택적 재전송). HOL(Head Of Line) 블로킹이 시험 포인트: 대기열 맨 앞 패킷이 처리되지 않으면 뒤 패킷이 전부 대기하는 문제로, HTTP/1.1·2의 고질병이었습니다." },
"nw-tcp-handshake": {
    guide: {
      hook: "연결을 '3번 악수로 열고, 4번 인사로 닫는' TCP의 신뢰 연결 절차입니다.",
      scene: "전화를 걸 때 '여보세요(SYN)→네 들려요(SYN-ACK)→저도요(ACK)' 하고 대화를 시작하듯, TCP는 3-way로 서로 준비를 확인하고 연결을 엽니다. 끊을 때는 양쪽이 각자 '끊자'와 '알겠다'를 주고받아 4-way로 닫습니다.",
      why: "3-way 연결·4-way 해제의 상태 전이와 각 플래그(SYN·ACK·FIN)가 출제 핵심입니다. TIME_WAIT의 목적이 포인트입니다.",
      mechanism: "연결(3-way): SYN(클라 seq) → SYN+ACK(서버 seq, 확인) → ACK(확인) → ESTABLISHED. 해제(4-way): FIN(종료 요청) → ACK → (상대도) FIN → ACK. 양방향을 각각 닫으므로 4단계. 능동 종료 측은 TIME_WAIT(2MSL 대기 — 지연 패킷 처리·마지막 ACK 유실 대비) 후 종료. 초기 seq 랜덤화로 보안.",
      map: [
        { as: "여보세요→들려요→저도요", real: "3-way 핸드셰이크", note: "SYN/SYN-ACK/ACK" },
        { as: "양쪽이 각자 끊기", real: "4-way 종료", note: "FIN/ACK ×2" },
        { as: "잠깐 대기 후 종료", real: "TIME_WAIT(2MSL)", note: "지연 패킷 대비" },
        { as: "순서 번호로 신뢰", real: "seq/ack 번호", note: "" },
      ],
      usage: "TCP 신뢰 연결의 기본이자 방화벽·장애 진단의 기초입니다. 시험은 3-way/4-way 흐름, TIME_WAIT 목적입니다.",
      links: [
        { topic: "TCP 혼잡제어", how: "연결 후 전송 속도를 조절합니다." },
        { topic: "TCP 와 UDP 비교", how: "TCP의 연결 지향성을 보여줍니다." },
      ],
      exam: "TCP는 SYN·SYN-ACK·ACK의 3-way 핸드셰이크로 연결하고 FIN·ACK를 양방향으로 주고받는 4-way로 해제하며, 능동 종료 측은 TIME_WAIT로 지연 패킷을 처리한다.",
    }, image: "/concept/book/nw-tcp-handshake.png", easy: "TCP가 연결을 맺고 끊는 절차입니다. 수립은 3단계(3-way): ① 클라이언트가 SYN(초기순서번호 a) 전송 → ② 서버가 SYN(b) + ACK(a+1)로 응답 → ③ 클라이언트가 ACK(b+1) 전송 → 양쪽 ESTABLISHED. 종료는 4단계(4-way): ① 클라이언트 FIN(FIN_WAIT_1) → ② 서버 ACK(CLOSE_WAIT) → ③ 서버가 남은 작업을 마치고 FIN(LAST_ACK) → ④ 클라이언트 ACK 후 TIME_WAIT를 거쳐 CLOSED. 시험 단골 질문 두 가지: 종료가 왜 4단계인가 — 서버가 FIN을 받아도 아직 보낼 데이터가 남을 수 있어 ACK와 FIN을 나눠 보내기 때문(Half-Close). TIME_WAIT는 왜 있나 — 마지막 ACK가 유실될 경우를 대비해 일정 시간 기다렸다 완전히 닫기 위해서입니다." },
"nw-csma-cd": {
    guide: {
      hook: "유선 이더넷의 '먼저 듣고 보내다 충돌하면 멈추는' 매체 접근 방식입니다.",
      scene: "여러 사람이 한 회선을 공유할 때, 조용한지 먼저 듣고(반송파 감지) 말합니다. 그래도 동시에 말하면(충돌) 즉시 멈추고, 각자 랜덤 시간 기다렸다 재시도합니다 — 유선이라 충돌을 '감지'할 수 있습니다.",
      why: "CSMA/CA(무선)와의 대비가 출제 핵심입니다 — 유선은 충돌 감지(CD), 무선은 충돌 회피(CA). 이유(무선은 감지 불가)까지가 포인트입니다.",
      mechanism: "Carrier Sense(전송 전 회선 청취) → 유휴면 전송 → 전송 중에도 계속 감지(Collision Detection) → 충돌 감지 시 즉시 중단·JAM 신호 → 이진 지수 백오프(Binary Exponential Backoff)로 랜덤 대기 후 재시도. 유선은 송신하며 자기 신호와 충돌을 동시에 감지 가능. 현대 스위치드 이더넷(전이중)에선 충돌 자체가 사라짐.",
      map: [
        { as: "조용한지 먼저 듣기", real: "반송파 감지(CS)", note: "" },
        { as: "말하며 충돌 감지", real: "충돌 감지(CD)", note: "유선만 가능" },
        { as: "충돌 시 멈추고 신호", real: "JAM 신호", note: "" },
        { as: "랜덤 대기 후 재시도", real: "이진 지수 백오프", note: "" },
      ],
      usage: "전통 이더넷의 매체 접근 방식입니다. 시험은 CSMA/CA와의 대비, 백오프, 스위치 환경에서의 무의미화입니다.",
      links: [
        { topic: "CSMA/CA", how: "무선의 짝 방식으로 충돌 회피를 씁니다." },
        { topic: "OSI 7 Layer (ISO 7498)", how: "데이터링크 계층의 MAC 부계층 기능입니다." },
      ],
      exam: "CSMA/CD는 전송 전 회선을 감지하고 전송 중 충돌을 감지하면 중단·백오프하는 유선 이더넷 접근 방식으로, 무선의 CSMA/CA와 달리 충돌 감지가 가능하다.",
    }, image: "/concept/book/nw-csma-cd.png", easy: "여러 호스트가 하나의 회선을 나눠 쓸 때, 보내기 전에 먼저 '지금 누가 쓰나' 엿듣고(Carrier Sense) 충돌을 줄이는 유선 LAN(이더넷) 프로토콜입니다. 동작: 송신준비 → 채널 감시 → 비어 있으면 전송하며 계속 감시 → 충돌이 감지되면 Jam 신호를 보내 모두에게 알리고, Back-off 방식(임의 시간 대기)에 따라 기다렸다 재시도. 채널이 이미 Busy면 계속 재탐색합니다. 회선을 엿듣는 방식 3가지가 시험 포인트 — 1-Persistent(비면 즉시 전송, 확률 1 — 충돌 위험 큼), Non-Persistent(사용 중이면 임의 시간 기다렸다 다시 감시 — 충돌은 적지만 지연), P-Persistent(확률 p로 전송 여부 결정 — 앞 둘의 절충). 무선에서는 충돌 감지가 어려워 CSMA/CA를 씁니다." },
// ─────────────── 4주차: 알고리즘(AL) — 교재 슬라이드 + 쉬운 설명 ───────────────
"al-perf-eval": {
    guide: {
      hook: "알고리즘이 '얼마나 빠르고 메모리를 쓰는지'를 입력 크기 기준으로 평가합니다.",
      scene: "같은 문제를 푸는 알고리즘도 데이터가 커지면 성능 차이가 극명합니다. 실행 시간을 초로 재면 컴퓨터·언어마다 다르니, 입력 크기 n이 커질 때 연산 횟수가 어떻게 증가하는지(시간·공간 복잡도)로 평가합니다.",
      why: "시간/공간 복잡도와 최선·평균·최악 분석, 점근 표기(빅오)가 출제 핵심입니다.",
      mechanism: "시간 복잡도(연산 횟수 증가율)·공간 복잡도(메모리). 입력 크기 n의 함수로 표현, 상수·낮은 차수 무시(점근 분석). 경우: 최선(Ω)·평균(Θ)·최악(O). 빅오(상한)가 주로 쓰임. 시간-공간 트레이드오프(메모이제이션 등). 실측(벤치마크)과 이론 분석 병행. 복잡도 계층: O(1)<O(log n)<O(n)<O(n log n)<O(n²)<O(2ⁿ).",
      map: [
        { as: "연산 횟수 증가율", real: "시간 복잡도", note: "" },
        { as: "메모리 사용량", real: "공간 복잡도", note: "" },
        { as: "최선·평균·최악", real: "경우 분석", note: "Ω·Θ·O" },
        { as: "n 클 때 증가율", real: "점근 분석", note: "상수 무시" },
      ],
      usage: "알고리즘 선택·최적화의 기준입니다. 시험은 시간/공간, 최악 분석, 빅오 계층입니다.",
      links: [
        { topic: "빅오 표기법(O-Notation)", how: "복잡도를 표기하는 방법입니다." },
        { topic: "동적 계획법(Dynamic Programming)", how: "시간-공간 트레이드오프의 예입니다." },
      ],
      exam: "알고리즘 성능평가는 입력 크기 n에 대한 시간·공간 복잡도로 하며, 최선·평균·최악(주로 빅오 상한)을 점근 분석해 실행 환경과 무관하게 효율을 비교한다.",
    }, image: "/concept/book/al-perf-eval.png", easy: "알고리즘이 얼마나 좋은지를 '시간'과 '공간'이라는 두 자로 재는 프로세스입니다. 평가 유형 3가지 — 성능분석(직접 구현하지 않고 연산 횟수로 비교, n의 함수로 표현), 성능측정(실제 구현물을 같은 하드웨어에서 돌려 수행시간 측정), 효율성 평가(시간 복잡도=단위 연산을 몇 번 하는지 / 공간 복잡도=필요한 메모리 양 — 고정 공간+가변 공간). 보통 시간이 적게 들면 공간을 많이 쓰고, 공간을 아끼면 시간이 오래 걸립니다(트레이드오프). 점근적 표기법 3형제가 시험 핵심: O(빅오, 상한선 — 최악일 때), Ω(오메가, 하한선 — 최상일 때), Θ(세타, 상한과 하한의 교집합). 실무·시험 모두 최악을 보는 O를 씁니다." },
"al-big-o": {
    guide: {
      hook: "입력이 커질 때 성능이 '최악의 경우 얼마나 나빠지는지'를 나타내는 상한 표기법입니다.",
      scene: "O(n²)은 데이터가 10배면 시간이 100배로 늘어난다는 뜻입니다. 빅오는 상수와 낮은 차수를 무시하고 가장 지배적인 증가율만 남겨, 알고리즘의 확장성을 한눈에 비교하게 합니다.",
      why: "주요 복잡도 계층과 각 알고리즘의 빅오가 출제 핵심입니다. 빅오(O)·빅오메가(Ω)·빅세타(Θ)의 구분이 포인트입니다.",
      mechanism: "정의: f(n)=O(g(n)) — n이 충분히 크면 f≤c·g (상한, 최악). 규칙: 최고차항만·상수 무시(3n²+2n → O(n²)). 계층: O(1) 상수 < O(log n) 로그(이분탐색) < O(n) 선형 < O(n log n)(효율 정렬) < O(n²) 이차(버블) < O(2ⁿ) 지수 < O(n!) 팩토리얼. 관련: Ω(하한·최선), Θ(정확한 차수). 실무는 최악(O) 중심.",
      map: [
        { as: "최악의 증가율 상한", real: "빅오 O", note: "" },
        { as: "최고차항만 남김", real: "점근 규칙", note: "상수 무시" },
        { as: "O(1)<O(log n)<O(n)", real: "복잡도 계층", note: "" },
        { as: "하한·정확", real: "Ω·Θ", note: "" },
      ],
      usage: "알고리즘 효율 비교입니다. 시험은 복잡도 계층, 알고리즘별 빅오, Ω·Θ 구분입니다.",
      links: [
        { topic: "알고리즘 성능평가", how: "빅오가 복잡도 표기 방법입니다." },
        { topic: "퀵 정렬(Quick Sort)", how: "평균 O(n log n)·최악 O(n²)의 예입니다." },
      ],
      exam: "빅오 표기법은 입력이 커질 때 최악의 성능 증가율 상한을 최고차항으로 나타내며, O(1)<O(log n)<O(n)<O(n log n)<O(n²)<O(2ⁿ) 계층으로 알고리즘을 비교한다.",
    }, image: "/concept/book/al-big-o.png", easy: "데이터 수 N이 늘어날 때 수행시간이 어떤 함수로 커지는지를 간단히 표현하는 상한 점근 표기법입니다. 유형과 사례를 짝으로 외우세요 — O(1) 상수형(입력 크기와 무관하게 바로 답: 해시 함수), O(log N) 로그형(반씩 나눠 하나만 처리: 이진탐색), O(N) 선형(하나씩 모두 처리: 단순탐색), O(N log N) 분할·합병형(퀵 정렬), O(N²) 제곱형(2중 loop: 버블 정렬), O(N³) 세제곱형(3중 loop: 최단 경로), O(2ⁿ) 지수형(모든 경우 검사). 연산시간 순서가 그대로 시험에 나옵니다: O(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(N³) < O(2ⁿ) < O(N!)." },
"al-quick-sort": {
    guide: {
      hook: "'기준값(피벗)으로 나눠 정복'하는 평균 최速 정렬 — 분할정복의 대표입니다.",
      scene: "기준값 하나를 정해 그보다 작은 건 왼쪽, 큰 건 오른쪽으로 나누고(분할), 각 부분을 같은 방식으로 재귀 정렬합니다. 평균적으로 매우 빠르지만, 피벗을 잘못 고르면 최악이 됩니다.",
      why: "평균 O(n log n)·최악 O(n²)와 피벗 선택, 제자리 정렬(불안정)이 출제 핵심입니다. 병합 정렬과의 비교가 포인트입니다.",
      mechanism: "분할정복: 피벗 선택 → 파티션(피벗보다 작은 것/큰 것으로 분할) → 좌우 부분을 재귀 정렬. 평균 O(n log n), 최악 O(n²)(이미 정렬됨+최악 피벗 — 랜덤·중앙값 피벗으로 완화). 제자리(in-place, 공간 O(log n)), 불안정 정렬. 실무에서 가장 빠른 편(캐시 효율). 병합 정렬은 안정·항상 O(n log n)·추가 메모리 필요로 대비.",
      map: [
        { as: "기준값으로 좌우 분할", real: "파티션", note: "분할정복" },
        { as: "평균 매우 빠름", real: "O(n log n)", note: "" },
        { as: "피벗 나쁘면 느림", real: "최악 O(n²)", note: "랜덤 피벗" },
        { as: "제자리·불안정", real: "특성", note: "" },
      ],
      usage: "범용 고속 정렬입니다. 시험은 평균/최악 복잡도, 피벗, 병합 정렬과의 비교입니다.",
      links: [
        { topic: "병합 정렬(Merge Sort)", how: "안정·항상 O(n log n)과 대비됩니다." },
        { topic: "빅오 표기법(O-Notation)", how: "평균/최악 복잡도로 평가합니다." },
      ],
      exam: "퀵 정렬은 피벗으로 분할해 재귀 정렬하는 분할정복 정렬로 평균 O(n log n)·최악 O(n²)이며, 제자리·불안정 정렬이고 피벗 선택이 성능을 좌우한다.",
    }, image: "/concept/book/al-quick-sort.png", easy: "기준값(Pivot)을 하나 정해 그보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 몰아넣고, 나뉜 각 덩어리에 같은 일을 재귀로 반복하는 분할 정복 정렬입니다. 절차: Low는 왼쪽부터 Pivot보다 큰 값을 찾고, High는 오른쪽부터 Pivot보다 작은 값을 찾아 서로 교환 → 반복하다 두 지점이 교차하면 Pivot과 High를 교환 → 이제 Pivot 왼쪽은 전부 작고 오른쪽은 전부 큰 상태 → 양쪽에서 다시 Pivot을 잡고 재귀. 시간복잡도가 시험 포인트: 평균 O(n log n)으로 가장 빠른 축이지만, Pivot이 계속 한쪽 끝에 걸리면 최악 O(n²)로 나빠집니다." },
"al-insertion-sort": {
    guide: {
      hook: "카드를 손에 정렬하듯 '하나씩 제자리에 끼워 넣는' 단순 정렬입니다.",
      scene: "카드 게임에서 새 카드를 이미 정렬된 카드들 사이 알맞은 위치에 끼우듯, 원소를 하나씩 앞의 정렬된 부분과 비교해 제자리에 삽입합니다. 거의 정렬된 데이터엔 매우 빠릅니다.",
      why: "O(n²)이지만 거의 정렬 시 O(n), 안정·제자리가 출제 핵심입니다. 작은 데이터·하이브리드 정렬 활용이 포인트입니다.",
      mechanism: "두 번째 원소부터 시작, 앞의 정렬된 부분과 비교하며 자기 자리를 찾아 삽입(뒤로 밀기). 시간: 최악·평균 O(n²), 최선(이미 정렬) O(n). 안정 정렬, 제자리(O(1) 공간). 작은 배열·거의 정렬된 데이터에 효율적 → Timsort·인트로소트가 작은 부분에 삽입 정렬 사용. 버블·선택 정렬과 함께 O(n²) 기본 정렬.",
      map: [
        { as: "카드 제자리에 끼우기", real: "삽입", note: "" },
        { as: "이미 정렬이면 빠름", real: "최선 O(n)", note: "" },
        { as: "평균 O(n²)", real: "느린 편", note: "" },
        { as: "안정·제자리", real: "특성", note: "" },
      ],
      usage: "작은·거의 정렬된 데이터, 하이브리드 정렬입니다. 시험은 O(n²)/최선 O(n), 안정성, 활용입니다.",
      links: [
        { topic: "버블 정렬(Bubble Sort)", how: "같은 O(n²) 기본 정렬입니다." },
        { topic: "병합 정렬(Merge Sort)", how: "효율 정렬과 대비됩니다." },
      ],
      exam: "삽입 정렬은 원소를 앞의 정렬된 부분에 하나씩 끼워 넣는 정렬로 평균 O(n²)·최선(정렬됨) O(n)이며, 안정·제자리 정렬이고 작은·거의 정렬된 데이터에 효율적이다.",
    }, image: "/concept/book/al-insertion-sort.png", easy: "손에 쥔 카드를 정리하듯, 앞쪽의 '이미 정렬된 부분'과 비교해 자기 자리를 찾아 끼워 넣는 정렬입니다. 동작: 첫 원소는 정렬된 것으로 취급 → 다음 원소가 들어갈 위치를 앞에서 검색 → 그 위치 이후 값들을 오른쪽으로 Shift → 빈자리에 삽입. 교재 예제(31, 25, 12, 22, 11)를 따라가면 매 단계 앞쪽 정렬 구간이 하나씩 늘어납니다. 특징: 거의 정렬된 데이터에서는 매우 빠르지만(최선 O(n)), 일반적으로는 O(n²)라 대량 데이터에는 부적합합니다." },
"al-bubble-sort": {
    guide: {
      hook: "인접한 두 원소를 '비교·교환'하며 큰 값을 끝으로 밀어 올리는 가장 단순한 정렬입니다.",
      scene: "물속 거품이 위로 떠오르듯, 인접한 쌍을 비교해 순서가 틀리면 바꾸며 한 바퀴 돌면 가장 큰 값이 끝에 놓입니다. 이해는 쉽지만 느려서 교육용입니다.",
      why: "O(n²)와 안정·제자리, 그리고 최적화(교환 없으면 종료 → 최선 O(n))가 출제 포인트입니다.",
      mechanism: "인접 원소 비교 후 순서 틀리면 교환, 한 패스마다 최댓값이 끝으로 이동 → n−1 패스 반복. 시간: 평균·최악 O(n²), 최선(이미 정렬, 교환 없음 감지) O(n). 안정 정렬, 제자리. 교환 횟수 많아 실무엔 부적합(가장 느린 기본 정렬 중 하나). 선택·삽입 정렬과 함께 O(n²) 기본 정렬. 개념 학습용.",
      map: [
        { as: "인접 비교·교환", real: "버블 업", note: "" },
        { as: "한 패스=최댓값 끝으로", real: "패스 반복", note: "" },
        { as: "평균 O(n²)", real: "느림", note: "교육용" },
        { as: "교환 없으면 종료", real: "최선 O(n)", note: "최적화" },
      ],
      usage: "정렬 개념 학습용입니다. 시험은 O(n²), 안정·제자리, 최적화(최선 O(n))입니다.",
      links: [
        { topic: "삽입 정렬(Insertion Sort)", how: "같은 O(n²) 기본 정렬입니다." },
        { topic: "퀵 정렬(Quick Sort)", how: "효율 정렬과 대비됩니다." },
      ],
      exam: "버블 정렬은 인접 원소를 비교·교환해 최댓값을 끝으로 미는 정렬로 평균 O(n²)·최선(정렬됨) O(n)이며, 안정·제자리이나 교환이 많아 실무엔 부적합하다.",
    }, image: "/concept/book/al-bubble-sort.png", easy: "이웃한 두 값을 비교해 앞이 더 크면 자리를 바꾸는 일을 끝까지 반복하는, 가장 단순한 정렬입니다. 교재 예제(7, 5, 8, 3, 9)를 보면 1회전에서 A(1)-A(2), A(2)-A(3), A(3)-A(4)를 차례로 비교·교환해 가장 큰 9가 거품처럼 맨 뒤로 확정됩니다. 2회전에는 이미 확정된 뒤쪽을 빼고 A(1)~A(3)만 비교하고, 이렇게 정렬 완료 구간이 뒤에서 앞으로 자라며 n−1회전 반복합니다. 구현이 가장 쉬운 대신 비교·교환이 매번 일어나 최선·평균·최악 모두 O(n²)이고, 교재 빅오 슬라이드에서 O(N²) 제곱형(2중 loop)의 대표 사례로 등장합니다." },
"al-merge-sort": {
    guide: {
      hook: "'반으로 쪼갠 뒤 정렬하며 합치는' 분할정복 정렬 — 항상 O(n log n)입니다.",
      scene: "배열을 절반씩 쪼개 더 못 쪼갤 때까지 나눈 뒤(분할), 정렬된 두 부분을 비교하며 하나로 병합합니다(정복). 데이터 상태와 무관하게 항상 안정적으로 빠릅니다.",
      why: "항상 O(n log n)·안정 정렬·추가 메모리 O(n)가 출제 핵심입니다. 퀵 정렬과의 비교가 포인트입니다.",
      mechanism: "분할정복: 배열을 절반으로 재귀 분할(원소 1개까지) → 정렬된 두 부분을 비교·병합(merge). 시간: 최선·평균·최악 모두 O(n log n)(안정적). 안정 정렬. 공간: 병합용 추가 배열 O(n)(제자리 아님). 연결 리스트·외부 정렬(대용량 디스크)에 적합. 퀵(제자리·평균 빠름·최악 O(n²))과 트레이드오프. Timsort(병합+삽입)의 기반.",
      map: [
        { as: "절반씩 쪼개기", real: "분할", note: "" },
        { as: "정렬하며 합치기", real: "병합(merge)", note: "" },
        { as: "항상 O(n log n)", real: "안정적 성능", note: "" },
        { as: "추가 메모리 O(n)", real: "제자리 아님", note: "퀵과 차이" },
      ],
      usage: "안정·대용량·외부 정렬입니다. 시험은 항상 O(n log n), 안정성, 추가 메모리, 퀵과의 비교입니다.",
      links: [
        { topic: "퀵 정렬(Quick Sort)", how: "제자리·평균 빠름과 트레이드오프입니다." },
        { topic: "알고리즘 성능평가", how: "정렬 알고리즘 비교의 기준입니다." },
      ],
      exam: "병합 정렬은 배열을 절반으로 분할 후 정렬하며 병합하는 분할정복 정렬로 항상 O(n log n)·안정 정렬이나, 추가 메모리 O(n)이 필요해 제자리 정렬은 아니다.",
    }, image: "/concept/book/al-merge-sort.png", easy: "리스트를 반으로 계속 쪼개 원소 1개가 될 때까지 분할한 뒤, 두 개씩 순서에 맞춰 합치며(병합) 올라오는 분할 정복 정렬입니다. 절차: ① 데이터를 반으로 나눔 ② 하위 집합 크기가 2 이상이면 ①을 반복 ③ 같은 집합에서 나온 하위 집합 둘을 순서에 맞춰 병합 ④ 하나가 될 때까지 ③ 반복. 퀵 정렬과의 비교가 시험 포인트: 퀵은 평균 O(n log n)이지만 최악 O(n²)인 반면, 병합 정렬은 최악에도 O(n log n)이 보장되고 같은 값의 순서가 유지되는 안정 정렬입니다(대신 추가 메모리 필요)." },
"al-hash-table": {
    guide: {
      hook: "'키를 해시 함수로 위치를 계산해' 평균 O(1)에 저장·검색하는 자료구조입니다.",
      scene: "사전에서 단어를 찾을 때 처음부터 넘기지 않고 바로 펴듯, 해시 테이블은 키를 해시 함수로 배열 인덱스로 바꿔 즉시 접근합니다. 딕셔너리·맵의 기반입니다.",
      why: "평균 O(1)·최악 O(n)와 해시 함수·충돌이 출제 핵심입니다. 적재율(load factor)이 포인트입니다.",
      mechanism: "해시 함수로 키 → 배열 인덱스(버킷) 매핑 → 그 위치에 저장. 검색·삽입·삭제 평균 O(1)(좋은 해시·낮은 적재율), 최악 O(n)(충돌 몰림). 적재율(원소 수/버킷 수)↑면 충돌↑ → 임계 넘으면 리해싱(크기 확장·재배치). 충돌 해결: 체이닝(연결 리스트)·개방 주소법. 순서 없음. 집합·캐시·인덱스에 사용.",
      map: [
        { as: "키→인덱스 계산", real: "해시 함수", note: "" },
        { as: "즉시 접근", real: "평균 O(1)", note: "" },
        { as: "충돌 몰리면", real: "최악 O(n)", note: "" },
        { as: "차면 확장", real: "리해싱·적재율", note: "" },
      ],
      usage: "딕셔너리·캐시·인덱스입니다. 시험은 평균/최악 복잡도, 적재율·리해싱, 충돌입니다.",
      links: [
        { topic: "해싱과 충돌해결방법", how: "충돌 처리 기법을 다룹니다." },
        { topic: "RDBMS 인덱스(index)", how: "해시 인덱스로 활용됩니다." },
      ],
      exam: "해시 테이블은 키를 해시 함수로 인덱스로 변환해 평균 O(1)에 저장·검색하는 자료구조로, 적재율이 높으면 충돌로 최악 O(n)이 되어 리해싱이 필요하다.",
    }, image: "/concept/book/al-hash-table.png", easy: "키(key)를 인덱스처럼 써서 자료에 곧바로 접근하는 배열 구조 — 순서대로 찾지 않고 계산해서 바로 가기 때문에 평균 O(1)입니다. 흐름: Key → 해시함수 → 주소값 → 해시 테이블의 그 자리. 용어가 시험 핵심 — 해시 함수(키를 물리 주소로 사상하는 단방향 함수), 해시 키(계산에 쓰는 키 값), 버킷(하나의 주소를 갖는 구역), 슬롯(레코드 1개 저장 공간, n개가 모여 버킷), 동거자 Synonym(같은 주소로 변환된 모든 레코드), 충돌 Collision(서로 다른 레코드가 같은 주소로), 오버플로우(버킷이 가득 참). 파이썬 dict·자바 HashMap이 전부 이것입니다." },
"al-hashing-collision": {
    guide: {
      hook: "'다른 키가 같은 위치로 가는' 충돌을 해결하는 두 방식 — 체이닝과 개방 주소법입니다.",
      scene: "해시 함수가 아무리 좋아도 서로 다른 키가 같은 인덱스로 가는 충돌은 불가피합니다(비둘기집 원리). 이를 같은 칸에 줄줄이 매다는 방법(체이닝)과 빈 칸을 찾아가는 방법(개방 주소법)으로 해결합니다.",
      why: "체이닝 vs 개방 주소법의 원리·장단이 출제 핵심입니다. 개방 주소법의 탐사 방식이 포인트입니다.",
      mechanism: "체이닝(Separate Chaining): 각 버킷에 연결 리스트(또는 트리) — 충돌 시 같은 버킷에 추가, 적재율 1 초과 가능, 포인터 메모리. 개방 주소법(Open Addressing): 충돌 시 다른 빈 버킷 탐사 — 선형 탐사(다음 칸, 군집화), 이차 탐사, 이중 해싱(두 번째 해시로 간격). 삭제 시 표시(tombstone) 필요, 적재율<1. 좋은 해시 함수·적재율 관리가 성능 핵심.",
      map: [
        { as: "같은 칸에 줄줄이", real: "체이닝(연결 리스트)", note: "적재율>1 가능" },
        { as: "빈 칸 찾아가기", real: "개방 주소법", note: "" },
        { as: "다음 칸 탐사", real: "선형 탐사", note: "군집화" },
        { as: "두 번째 해시 간격", real: "이중 해싱", note: "" },
      ],
      usage: "해시 테이블 구현입니다. 시험은 체이닝/개방 주소법 비교, 탐사 방식, 적재율입니다.",
      links: [
        { topic: "해시 테이블", how: "충돌 해결이 해시 테이블의 핵심입니다." },
        { topic: "해시 함수의 안전성", how: "충돌 저항성 개념을 공유합니다." },
      ],
      exam: "해싱 충돌은 다른 키가 같은 인덱스로 가는 것으로, 각 버킷에 리스트를 다는 체이닝과 빈 버킷을 탐사하는 개방 주소법(선형·이차·이중 해싱)으로 해결한다.",
    }, image: "/concept/book/al-hashing-collision.png", easy: "해싱은 키에 해시함수를 적용해 주소를 계산하고 그 위치로 직접 가는 탐색 방법인데, 서로 다른 키가 같은 주소로 가는 충돌이 필연적으로 생깁니다. 해싱 기법 [나폴리는 중세기다] — 나눗셈법(키를 테이블 크기로 나눈 나머지), 폴딩법(키를 같은 길이로 쪼개 더하거나 XOR), 중간 제곱법(제곱한 뒤 중간 비트 사용), 기수 변환법(10진→7진 등 진법 변환), 자릿수 분석법(고른 분포의 자릿수 선택), 무작위 방법(난수 발생). 충돌 해결 [선이중무 체코] — 개방 주소법: 선형 조사(다음 칸으로), 이차 조사(제곱 간격), 이중 해싱(제2 해시 함수), 재해싱(새 해시 함수로 전체 재배치) / 폐쇄 주소법: 해시 체이닝(연결 리스트로 매달기), 병합 체이닝(빈 슬롯에 넣고 포인터 연결)." },
"al-dynamic-programming": {
    guide: {
      hook: "'큰 문제를 작은 문제로 나누고, 답을 저장해 재사용'하는 최적화 기법입니다.",
      scene: "피보나치를 순진하게 재귀하면 같은 계산을 수없이 반복합니다. DP는 한 번 푼 부분 문제의 답을 저장해두고(메모이제이션) 재사용해, 지수 시간을 다항 시간으로 줄입니다.",
      why: "두 조건(중복 부분문제·최적 부분구조)과 두 방식(하향식 메모이제이션·상향식 테이블)이 출제 핵심입니다. 분할정복·그리디와의 차이가 포인트입니다.",
      mechanism: "적용 조건: 중복 부분문제(같은 하위문제 반복), 최적 부분구조(부분 최적이 전체 최적 구성). 방식: 하향식(Top-down — 재귀+메모이제이션), 상향식(Bottom-up — 작은 것부터 테이블 채움). 시간-공간 트레이드오프(계산 대신 저장). 예: 피보나치, 배낭 문제, 최장 공통 부분수열(LCS), 최단경로(플로이드). 분할정복(독립 부분문제)·그리디(부분 최적만)와 구분.",
      map: [
        { as: "같은 하위문제 반복", real: "중복 부분문제", note: "조건" },
        { as: "부분 최적=전체 최적", real: "최적 부분구조", note: "조건" },
        { as: "재귀+저장", real: "하향식(메모이제이션)", note: "" },
        { as: "작은 것부터 테이블", real: "상향식", note: "" },
      ],
      usage: "최적화 문제(배낭·LCS·최단경로)입니다. 시험은 두 조건, 하향/상향식, 그리디와의 차이입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "부분 최적만 보는 방식과 대비됩니다." },
        { topic: "다익스트라(Dijkstra) 알고리즘", how: "최적 부분구조를 이용한 최단경로입니다." },
      ],
      exam: "동적 계획법은 중복 부분문제와 최적 부분구조를 가진 문제를 하위 문제 답을 저장·재사용(메모이제이션)해 푸는 기법으로, 하향식·상향식으로 지수 시간을 다항 시간으로 줄인다.",
    }, image: "/concept/book/al-dynamic-programming.png", easy: "큰 문제를 작은 문제로 쪼개 풀되, 한 번 푼 부분 문제의 답을 저장(Memoization)해 두고 재사용하는 최적화 기법입니다. 같은 계산을 반복하지 않는 것이 핵심 — 피보나치를 단순 재귀로 풀면 같은 값을 수없이 다시 계산하지만 DP는 한 번만 계산합니다. 전제 조건: 최적성 원리를 만족해 점화/재귀 관계식 a(n+1)=f(a(n))을 도출할 수 있어야 합니다. 동작: ① 점화식 도출·부분 문제 분할 → ② Memoization으로 부분 해를 테이블에 저장 → ③ Bottom-Up으로 저장된 해를 활용해 최종 최적해 도출. 접근방법 2가지: Top Down(재귀+메모이제이션)과 Bottom Up(반복문+타뷸레이션)." },
"al-greedy": {
    guide: {
      hook: "'매 순간 최선의 선택'만으로 전체 최적을 노리는 알고리즘 — 빠르지만 항상 맞진 않습니다.",
      scene: "거스름돈을 줄 때 큰 동전부터 주듯, 각 단계에서 지금 가장 좋아 보이는 것을 고릅니다. 특정 조건(탐욕 선택 속성)이 성립하면 전체 최적이 되지만, 아니면 국소 최적에 갇힙니다.",
      why: "적용 조건(탐욕 선택 속성·최적 부분구조)과 DP와의 차이, 대표 문제가 출제 핵심입니다.",
      mechanism: "매 단계 국소 최적 선택(되돌아보지 않음). 성립 조건: 탐욕 선택 속성(국소 최적 선택이 전체 최적으로 이어짐), 최적 부분구조. 성공 예: 거스름돈(정규 화폐), 활동 선택, 허프만 코딩, 최소 신장 트리(크루스칼·프림), 다익스트라. 실패 예: 0-1 배낭(DP 필요), 일부 화폐 체계. DP(모든 경우 고려)보다 빠르나 최적 보장 안 됨(증명 필요).",
      map: [
        { as: "지금 최선만 선택", real: "국소 최적", note: "되돌아보지 않음" },
        { as: "국소=전체 최적 조건", real: "탐욕 선택 속성", note: "" },
        { as: "빠름", real: "DP보다 효율", note: "" },
        { as: "항상 맞진 않음", real: "국소 최적 함정", note: "증명 필요" },
      ],
      usage: "MST·허프만·스케줄링입니다. 시험은 탐욕 선택 속성, DP와의 차이, 성공/실패 예입니다.",
      links: [
        { topic: "동적 계획법(Dynamic Programming)", how: "모든 경우 고려와 대비됩니다." },
        { topic: "허프만(Huffman) 코딩", how: "그리디의 대표 성공 사례입니다." },
      ],
      exam: "그리디 알고리즘은 매 단계 국소 최적을 선택해 전체 최적을 노리는 기법으로, 탐욕 선택 속성·최적 부분구조가 성립할 때만 최적이며 허프만·MST가 대표 사례다.",
    }, image: "/concept/book/al-greedy.png", easy: "매 순간 눈앞에서 가장 좋아 보이는 것을 고르고 뒤돌아보지 않는 알고리즘입니다. 거스름돈 770원을 최소 동전으로 주려면 매번 가장 큰 동전부터 고르는 식이죠. 절차 [해적검] — 해 선택(부분해에 더할 다음 항목 선택) → 적합성 검증(제약조건 위반 여부 검사, 위반이면 다시 선택) → 해 검증(문제의 해인지 확인, 아니면 반복). 가장 중요한 시험 포인트는 '항상 최적해가 나오지는 않는다'는 것: 거스름돈 800원에 400원 동전이 새로 생기면, 그리디는 500원 1개+100원 3개(4개)를 고르지만 실제 최적은 400원 2개입니다. 그래서 최적성이 보장되는 문제(MST, 허프만)에만 안전하게 씁니다." },
"al-beam-search": {
    guide: {
      hook: "'상위 K개 후보만 유지하며 탐색'해 넓은 공간을 효율적으로 훑는 휴리스틱 탐색입니다.",
      scene: "모든 경우를 다 보면 폭발하고, 하나만 보면 놓칩니다. 빔 서치는 각 단계에서 가장 유망한 K개(빔 폭)만 남기고 나머지는 버려, 최적성을 일부 포기하는 대신 메모리·속도를 확보합니다. LLM 텍스트 생성에 쓰입니다.",
      why: "'빔 폭 K로 후보 제한'과 최적성-효율 트레이드오프가 출제 핵심입니다. 그리디·완전탐색과의 중간이 포인트입니다.",
      mechanism: "너비 우선 탐색의 변형: 각 단계에서 모든 후보를 확장하되 평가 점수 상위 K개(빔 폭 beam width)만 유지, 나머지 가지치기. K=1이면 그리디, K=∞면 완전탐색(BFS). 최적 보장 없음(유망하지만 놓칠 수 있음). 메모리 O(K). 활용: LLM/기계번역 텍스트 생성(다음 토큰 K개 유지), 음성 인식, 경로 탐색. K↑면 품질↑·비용↑.",
      map: [
        { as: "상위 K개만 유지", real: "빔 폭(beam width)", note: "핵심" },
        { as: "K=1", real: "그리디", note: "" },
        { as: "K=∞", real: "완전탐색(BFS)", note: "" },
        { as: "최적 보장 없음", real: "휴리스틱", note: "트레이드오프" },
      ],
      usage: "LLM 텍스트 생성·기계번역·음성인식입니다. 시험은 빔 폭, 그리디/완전탐색 사이, 트레이드오프입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "K=1이 그리디에 해당합니다." },
        { topic: "그래프 순회(Graph Traversal)", how: "BFS의 가지치기 변형입니다." },
      ],
      exam: "빔 서치는 각 단계에서 평가 상위 K개(빔 폭) 후보만 유지하며 탐색하는 휴리스틱으로, K=1이면 그리디·K=∞면 완전탐색이며 LLM 텍스트 생성에 쓰인다.",
    }, image: "/concept/book/al-beam-search.png", easy: "빔 탐색은 매 단계에서 확률이 높은 상위 K개(Beam Size) 후보만 유지하며 해를 확장해 가는 탐색 알고리즘입니다. 최선 하나만 고르는 그리디가 더 좋은 길을 놓치는 문제와 전체 탐색 비용 사이의 절충안입니다. 절차: ① 문제·제약 정의 → ② 확률 높은 최초 K개 해 선택 → ③ 각 후보를 확장하며 확률 Score 계산 → ④ 그중 상위 K개만 남기고 나머지는 삭제, 시퀀스가 끝날 때까지 ③④ 반복 → ⑤ 최종 후보 중 확률이 가장 높은 해 선택. 교재 예제(Beam size=2): \"I am cat\"(1.0)과 \"the dog barked\"(0.9)를 끝까지 함께 끌고 가서 최종 1.0짜리를 고릅니다. K=1이면 그리디와 같고 K가 무한이면 완전 탐색 — 챗봇·번역기의 Seq2Seq 디코딩에 쓰입니다." },
"al-graph-traversal": {
    guide: {
      hook: "그래프의 모든 정점을 방문하는 두 방식 — 깊이 우선(DFS)과 너비 우선(BFS)입니다.",
      scene: "미로를 탐색할 때 한 길로 끝까지 파고들다 막히면 되돌아오거나(DFS), 현재 위치에서 가까운 곳부터 동심원으로 넓혀갑니다(BFS). 무엇을 찾느냐에 따라 방식을 고릅니다.",
      why: "DFS(스택/재귀) vs BFS(큐)의 원리·용도와 최단경로(무가중 BFS)가 출제 핵심입니다.",
      mechanism: "DFS(깊이 우선): 스택/재귀, 한 경로를 끝까지 → 백트래킹. 용도: 경로 존재·사이클 탐지·위상 정렬·연결 요소. BFS(너비 우선): 큐, 가까운 정점부터 층별 확장. 용도: 무가중 그래프 최단경로(최소 간선 수), 레벨 탐색. 둘 다 방문 표시(visited)로 중복 방지, 시간 O(V+E). 가중 최단경로는 다익스트라. 트리 순회의 그래프 일반화.",
      map: [
        { as: "끝까지 파고들기", real: "DFS(스택/재귀)", note: "사이클·위상정렬" },
        { as: "가까운 곳부터", real: "BFS(큐)", note: "최단경로" },
        { as: "무가중 최단경로", real: "BFS 용도", note: "" },
        { as: "방문 표시", real: "중복 방지", note: "O(V+E)" },
      ],
      usage: "경로 탐색·연결성·최단경로입니다. 시험은 DFS/BFS 원리·용도, 무가중 최단경로입니다.",
      links: [
        { topic: "트리 순회(Tree Traversal)", how: "DFS·BFS의 트리 특수형입니다." },
        { topic: "다익스트라(Dijkstra) 알고리즘", how: "가중 최단경로로 확장됩니다." },
      ],
      exam: "그래프 순회는 한 경로를 끝까지 파는 DFS(스택·사이클/위상정렬)와 가까운 정점부터 확장하는 BFS(큐·무가중 최단경로)로 나뉘며, 방문 표시로 중복을 막고 O(V+E)다.",
    }, image: "/concept/book/al-graph-traversal.png", easy: "그래프의 모든 정점을 한 번씩 방문하는 두 가지 방법입니다. BFS(너비 우선, 횡방향): 현재 정점과 연결된 이웃을 전부 먼저 훑고 다음 층으로 내려갑니다 — 큐(Queue)로 구현하며, 옆으로 넓은 그래프에 강하고 아래로 깊으면 오래 걸립니다. DFS(깊이 우선, 종방향): 한 갈래를 골라 갈 수 있는 데까지 끝까지 파고든 뒤, 막히면 되돌아옵니다(백트래킹) — 스택(Stack)으로 구현하며, 아래로 깊은 그래프에 강하고 옆으로 넓으면 오래 걸립니다. 외우는 요령: 너비=큐, 깊이=스택. 활용도 갈립니다 — BFS는 가중치 없는 그래프의 최단 경로·친구 추천에, DFS는 미로 탐색·위상 정렬·사이클 검출에 씁니다." },
"al-tf-idf": {
    guide: {
      hook: "'이 문서에서 자주 나오지만 다른 문서엔 드문 단어'에 높은 점수를 주는 가중치입니다.",
      scene: "'the'는 모든 문서에 흔해 중요치 않지만, 특정 문서에만 자주 나오는 단어는 그 문서의 핵심입니다. TF-IDF는 문서 내 빈도(TF)와 희소성(IDF)을 곱해 단어의 중요도를 수치화합니다.",
      why: "TF와 IDF의 결합 원리와 검색·문서 벡터화 활용이 출제 핵심입니다. 정보검색·NLP 기초입니다.",
      mechanism: "TF(Term Frequency — 문서 내 단어 출현 빈도, 정규화). IDF(Inverse Document Frequency — log(전체 문서 수/단어 포함 문서 수), 흔한 단어일수록 낮음). TF-IDF = TF × IDF → 특정 문서에 자주+전체엔 드문 단어 高. 활용: 검색 엔진 랭킹, 문서 벡터화(BoW 가중치), 키워드 추출, 문서 유사도(코사인). 한계: 의미·순서 무시(단어 가방) → 임베딩(Word2Vec)이 보완.",
      map: [
        { as: "문서 내 빈도", real: "TF", note: "" },
        { as: "다른 문서엔 드묾", real: "IDF(희소성)", note: "log 역빈도" },
        { as: "TF×IDF", real: "중요도 가중치", note: "핵심" },
        { as: "의미 무시", real: "한계", note: "임베딩 보완" },
      ],
      usage: "검색·키워드 추출·문서 벡터화입니다. 시험은 TF·IDF 결합, 활용, 임베딩과의 관계입니다.",
      links: [
        { topic: "벡터 데이터베이스(Vector Database)", how: "문서 벡터화·유사도와 연결됩니다." },
        { topic: "연관성 분석(association analysis) - 기초통계", how: "가중치·유사도 개념을 공유합니다." },
      ],
      exam: "TF-IDF는 문서 내 빈도(TF)와 역문서빈도(IDF)를 곱해 특정 문서에 자주 나오고 전체엔 드문 단어에 높은 가중치를 주는 지표로, 검색·문서 벡터화에 쓰인다.",
    }, image: "/concept/book/al-tf-idf.png", easy: "여러 문서 중에서 '이 단어가 이 문서에서 얼마나 중요한가'를 숫자로 매기는 가중치입니다. 두 값을 곱해서 구합니다 — TF(단어빈도: 이 문서에 몇 번 나왔나, 많을수록 중요)와 IDF(역문서빈도: 다른 문서에도 흔한가, 흔할수록 값이 작아짐). 핵심 직관: '이/그/은/는' 같은 단어는 모든 문서에 나오니 IDF가 0이 되어 중요도에서 탈락하고, 특정 문서에만 자주 나오는 단어가 높은 점수를 받습니다. 절차: DTM(문서-단어 행렬) 작성 → TF 계산 → 불용어 처리(조사·시제 제거) → IDF 산출 → TF×IDF. 교재 예제에서 this·is는 두 문서에 다 있어 log(2/2)=0으로 0점, a는 문서1에만 있어 0.6점을 받습니다. 검색 엔진 랭킹과 텍스트 마이닝의 기본 도구입니다." },
"al-mst": {
    guide: {
      hook: "'모든 정점을 최소 비용으로 잇는' 사이클 없는 트리 — 크루스칼·프림으로 구합니다.",
      scene: "여러 도시를 최소 비용 도로로 모두 연결하려면? MST는 모든 정점을 연결하되 사이클 없이 간선 가중치 합이 최소인 트리입니다. 그리디로 구합니다.",
      why: "크루스칼(간선 기준) vs 프림(정점 기준)의 원리·구현이 출제 핵심입니다. 그리디 적용 사례입니다.",
      mechanism: "MST: 연결·비순환·간선 가중치 합 최소(정점 V개면 간선 V−1개). 크루스칼(Kruskal): 간선을 가중치 오름차순 정렬 → 사이클 안 생기면 추가(Union-Find로 사이클 판별) → V−1개까지. O(E log E). 프림(Prim): 한 정점에서 시작, 트리에 인접한 최소 간선을 계속 추가(우선순위 큐) → O(E log V). 둘 다 그리디. 밀집 그래프는 프림, 희소는 크루스칼 유리.",
      map: [
        { as: "최소 비용 전체 연결", real: "MST", note: "V−1 간선" },
        { as: "간선 싼 것부터", real: "크루스칼", note: "Union-Find" },
        { as: "정점에서 확장", real: "프림", note: "우선순위 큐" },
        { as: "그리디로 최적", real: "적용 사례", note: "" },
      ],
      usage: "네트워크·도로·회로 최소 연결입니다. 시험은 크루스칼/프림 원리·구현, 그리디입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "MST는 그리디 대표 사례입니다." },
        { topic: "다익스트라(Dijkstra) 알고리즘", how: "그래프 그리디 알고리즘으로 대비됩니다." },
      ],
      exam: "MST는 모든 정점을 사이클 없이 최소 가중치 합으로 잇는 트리로, 간선 기준 크루스칼(Union-Find)과 정점 기준 프림(우선순위 큐)의 그리디로 구한다.",
    }, image: "/concept/book/al-mst.png", easy: "모든 정점을 빠짐없이 연결하되 간선 가중치의 합이 최소가 되는 트리 — 여러 도시를 최소 비용으로 잇는 도로망 설계 문제입니다. 두 알고리즘이 시험 단골입니다. 프림(Prim)은 '정점 중심': 시작 정점 하나에서 출발해, 지금까지 만든 트리에 인접한 간선 중 가장 싼 것을 계속 붙여 나가며 간선이 n−1개가 되면 종료합니다(눈덩이를 굴리듯 자라남). 크루스칼(Kruskal)은 '간선 중심': 전체 간선을 가중치 오름차순으로 정렬해 두고, 싼 것부터 차례로 고르되 사이클이 생기면 그 간선은 건너뜁니다(교재 예: BG 2 → EG 3 → CD 4 → AF 5 → FG 7 → DE 8 순으로 선택). 둘 다 그리디 알고리즘이며 결과는 같은 최소 비용입니다." },
"al-tree-traversal": {
    guide: {
      hook: "트리의 모든 노드를 '체계적 순서로 방문'하는 방법 — 전위·중위·후위·레벨입니다.",
      scene: "트리 구조를 빠짐없이 훑으려면 순서 규칙이 필요합니다. 루트를 언제 방문하느냐에 따라 전위(먼저)·중위(중간)·후위(나중)로 나뉘고, 층별로 훑는 레벨 순회도 있습니다.",
      why: "3가지 깊이 순회(전위·중위·후위)의 순서와 이진탐색트리에서 중위=정렬이 출제 핵심입니다.",
      mechanism: "깊이 우선(DFS 기반, 재귀/스택): 전위(Preorder — 루트→왼쪽→오른쪽, 트리 복사·수식 접두), 중위(Inorder — 왼쪽→루트→오른쪽, BST에서 오름차순 정렬), 후위(Postorder — 왼쪽→오른쪽→루트, 트리 삭제·수식 후위). 너비 우선(BFS 기반, 큐): 레벨 순회(층별 좌→우). 활용: 수식 트리, BST 정렬, 디렉터리 탐색.",
      map: [
        { as: "루트 먼저", real: "전위(Preorder)", note: "복사" },
        { as: "루트 중간", real: "중위(Inorder)", note: "BST 정렬" },
        { as: "루트 나중", real: "후위(Postorder)", note: "삭제" },
        { as: "층별로", real: "레벨 순회(BFS)", note: "큐" },
      ],
      usage: "트리 탐색·수식 처리·BST 정렬입니다. 시험은 3순회 순서, 중위=정렬, 레벨 순회입니다.",
      links: [
        { topic: "그래프 순회(Graph Traversal)", how: "DFS·BFS의 트리 버전입니다." },
        { topic: "동적 계획법(Dynamic Programming)", how: "트리 DP에서 순회를 씁니다." },
      ],
      exam: "트리 순회는 루트 방문 시점에 따라 전위(루트 먼저)·중위(중간, BST에서 정렬)·후위(나중)의 깊이 순회와 층별 레벨 순회(BFS)로 나뉜다.",
    }, image: "/concept/book/al-tree-traversal.png", easy: "트리의 모든 노드를 한 번씩 빠짐없이 방문하는 방법입니다. 이름의 '전·중·후'는 Root를 언제 방문하느냐를 말합니다 — 전위(Pre-Order): Root → Left → Right / 중위(In-Order): Left → Root → Right / 후위(Post-Order): Left → Right → Root. 재귀 코드는 세 줄의 순서만 바뀝니다(Visit·왼쪽·오른쪽 호출 순서). 활용이 시험 포인트: 이진 탐색 트리를 중위 순회하면 값이 정렬된 순서대로 나오고, 수식 트리에 적용하면 전위 순회는 전위 표기(prefix), 중위는 중위 표기(infix), 후위는 후위 표기(postfix)가 됩니다. 후위 순회는 자식을 다 처리한 뒤 부모를 처리하므로 디렉터리 용량 계산·소멸자 호출에 쓰입니다." },
"al-dijkstra": {
    guide: {
      hook: "'가중치 그래프에서 최단경로'를 찾는 대표 알고리즘 — 음수 간선은 안 됩니다.",
      scene: "내비게이션이 최단 경로를 찾듯, 시작점에서 각 정점까지의 최소 비용을 구합니다. 아직 확정 안 된 정점 중 가장 가까운 것을 하나씩 확정해 나가는 그리디 방식입니다.",
      why: "'가장 가까운 정점 확정(그리디)'과 음수 간선 불가, 우선순위 큐 복잡도가 출제 핵심입니다. 벨만-포드와의 구분이 포인트입니다.",
      mechanism: "각 정점 거리를 무한대로 초기화(시작=0) → 미확정 정점 중 거리 최소인 것 선택·확정 → 그 정점을 거쳐 인접 정점 거리 갱신(완화 relaxation) → 반복. 우선순위 큐(최소 힙) 사용 시 O((V+E)log V). 음수 간선 불가(확정한 최단거리가 뒤집힐 수 있음 → 벨만-포드는 음수 가능·O(VE), 음수 사이클 탐지). 단일 출발점 최단경로. 최적 부분구조 이용.",
      map: [
        { as: "가장 가까운 것 확정", real: "그리디 선택", note: "" },
        { as: "거쳐가면 짧아지나", real: "완화(relaxation)", note: "" },
        { as: "우선순위 큐", real: "O((V+E)log V)", note: "" },
        { as: "음수 간선 불가", real: "제약", note: "벨만-포드 대안" },
      ],
      usage: "최단경로·내비게이션·라우팅입니다. 시험은 그리디 원리, 음수 간선 불가, 벨만-포드와의 구분입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "다익스트라는 그리디 방식입니다." },
        { topic: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", how: "OSPF가 다익스트라를 씁니다." },
      ],
      exam: "다익스트라는 미확정 정점 중 최단인 것을 확정·완화하며 단일 출발점 최단경로를 찾는 그리디 알고리즘으로, 우선순위 큐로 O((V+E)log V)이며 음수 간선은 불가하다.",
    }, image: "/concept/book/al-dijkstra.png", easy: "출발지 하나에서 모든 정점까지의 최단 경로를 구하는 알고리즘 — 내비게이션 경로 탐색의 원리입니다. 두 개의 집합으로 관리합니다: S(이미 최단거리가 확정된 방문 노드)와 Q(아직 안 간 노드). 절차: ① 출발지 거리는 0, 나머지는 무한대(∞)로 초기화 → ② Q에서 거리가 가장 짧은 노드를 골라 S로 옮김 → ③ 그 노드의 이웃들까지의 거리를 재서, 기존보다 짧으면 갱신(Relaxation) → ④ Q가 빌 때까지 반복. 교재 예제에서 d[C]가 30→20으로, d[F]가 35→25로 갱신되는 부분이 핵심이고, 최종 답은 A→D→C→F, 거리 25입니다. 시험 포인트: 음수 가중치가 있으면 쓸 수 없고(그때는 벨만-포드), 매 단계 가장 짧은 것을 고르는 그리디 방식입니다." },
"al-run-length": {
    guide: {
      hook: "'같은 값이 연속되면 개수로 줄이는' 가장 단순한 무손실 압축입니다.",
      scene: "AAAAA를 'A5'로 적으면 짧아집니다. 런랭스 코딩(RLE)은 연속 반복되는 데이터를 '값+반복 횟수'로 표현해 압축합니다. 팩스·단순 이미지처럼 같은 값이 길게 이어지는 데이터에 효과적입니다.",
      why: "'연속 반복→값+개수'의 단순 원리와 적합/부적합 데이터가 출제 포인트입니다. 허프만과의 차이가 핵심입니다.",
      mechanism: "연속된 동일 값(run)을 (값, 길이) 쌍으로 인코딩: AAAB → A3B1. 무손실. 장점: 단순·빠름. 적합: 반복 많은 데이터(팩스, 아이콘, 단색 영역 많은 이미지 — BMP·TIFF·PCX). 부적합: 반복 적은 데이터(오히려 커질 수 있음). 허프만(빈도 기반 엔트로피 코딩)과 달리 연속성만 이용 → 종종 결합(RLE 후 허프만). JPEG의 계수 압축 단계에도 사용.",
      map: [
        { as: "AAAAA → A5", real: "값+반복 횟수", note: "" },
        { as: "반복 많으면 효과적", real: "적합 데이터", note: "팩스·단색" },
        { as: "반복 적으면 커짐", real: "부적합", note: "" },
        { as: "빈도가 아닌 연속성", real: "허프만과 차이", note: "" },
      ],
      usage: "팩스·단순 이미지 압축입니다. 시험은 원리, 적합/부적합 데이터, 허프만과의 차이입니다.",
      links: [
        { topic: "허프만(Huffman) 코딩", how: "빈도 기반 압축과 대비·결합됩니다." },
        { topic: "알고리즘 성능평가", how: "압축률로 평가합니다." },
      ],
      exam: "런랭스 코딩은 연속 반복되는 값을 값+개수로 표현하는 단순 무손실 압축으로, 반복이 많은 데이터에 효과적이나 반복이 적으면 오히려 커질 수 있다.",
    }, image: "/concept/book/al-run-length.png", easy: "같은 값이 연속으로 나오는 구간을 '값 + 반복 횟수'로 줄여 쓰는 무손실 압축입니다 — Run은 반복되는 문자, Length는 반복 횟수. 예제 1: AAAABBBBBCCCCCCCCCDEEEE(22byte) → 4A5B8C1D5E(10byte)로 LENGTH·RUN 순서로 나열합니다. 주의할 점이 시험 포인트 — 값이 자주 바뀌는 데이터에서는 오히려 압축률이 떨어집니다(ABAB… 같은 경우 길이가 늘어남). 그래서 예제 2처럼 유일한 자료 구간(ABC)은 그대로 두고 반복 구간에만 적용(ABC*8D*9E)하는 방식을 씁니다. 팩스, BMP, 단순한 아이콘 이미지처럼 같은 색이 길게 이어지는 데이터에 효과적입니다." },
"al-huffman": {
    guide: {
      hook: "'자주 나오는 글자엔 짧은 코드'를 주어 데이터를 압축하는 그리디 알고리즘입니다.",
      scene: "모든 글자에 같은 8비트를 쓰면 낭비입니다. 허프만은 자주 쓰는 글자(e)엔 짧은 코드, 드문 글자(z)엔 긴 코드를 배정해 전체 크기를 줄입니다. 무손실 압축의 기본입니다.",
      why: "'빈도 기반 가변길이·접두어 코드'와 트리 구성 절차가 출제 핵심입니다. 그리디 적용 사례로 나옵니다.",
      mechanism: "절차(그리디): 각 문자의 빈도 계산 → 빈도 가장 낮은 두 노드를 합쳐 부모 노드 생성(합=두 자식 빈도 합) → 최소 힙으로 반복해 하나의 트리 완성 → 왼쪽 0·오른쪽 1로 코드 부여. 접두어 코드(Prefix-free — 어떤 코드도 다른 코드의 접두어 아님 → 구분자 없이 해독). 가변 길이. 최적(엔트로피에 근접). 무손실. JPEG·ZIP·MP3의 엔트로피 코딩 단계.",
      map: [
        { as: "자주=짧게, 드물게=길게", real: "가변길이 코드", note: "" },
        { as: "최소 빈도 둘 합치기", real: "트리 구성(그리디)", note: "최소 힙" },
        { as: "구분자 없이 해독", real: "접두어 코드", note: "핵심" },
        { as: "무손실 압축", real: "엔트로피 코딩", note: "ZIP·JPEG" },
      ],
      usage: "무손실 압축(ZIP·JPEG·MP3)입니다. 시험은 트리 구성 절차, 접두어 코드, 그리디입니다.",
      links: [
        { topic: "그리디(탐욕) 알고리즘", how: "허프만은 그리디 대표 사례입니다." },
        { topic: "런랭스(Run Length) 코딩", how: "다른 무손실 압축 기법입니다." },
      ],
      exam: "허프만 코딩은 문자 빈도에 따라 자주 나오는 문자에 짧은 코드를 주는 가변길이 접두어 코드로, 최소 빈도 노드를 합치는 그리디로 트리를 구성해 무손실 압축한다.",
    }, image: "/concept/book/al-huffman.png", easy: "자주 나오는 문자에는 짧은 부호를, 드물게 나오는 문자에는 긴 부호를 주어 전체 길이를 줄이는 무손실 압축 기법입니다. 동작: ① 문자별 빈도수를 내림차순 정렬 → ② 빈도가 가장 낮은 두 문자를 연결하고, 그 묶음을 다음으로 낮은 것과 연결하는 식으로 모든 문자가 이어질 때까지 반복(Binary Fusion) → ③ 각 쌍에 0과 1을 배정(높은 쪽에 0) → ④ 각 문자에 코드 할당. 교재 예제: AAAAABABCCCDBBBCDA에서 A(7/18)→0, B(5/18)→10, C(4/18)→110, D(2/18)→111로 할당하면 18Byte가 35bit로 줄어듭니다. 활용: DEFLATE(PKZIP), JPEG·MP3 코덱의 기본 알고리즘." },
// ─────────────── 4주차: 자료구조(DS) — 교재 슬라이드 + 쉬운 설명 ───────────────
"ds-linear-nonlinear": {
    guide: {
      hook: "자료를 '한 줄로 잇는' 선형과 '가지치는' 비선형 — 자료구조의 큰 분류입니다.",
      scene: "데이터를 어떻게 배열·연결하느냐에 따라 자료구조가 나뉩니다. 한 원소 뒤에 하나만 오는 일렬(선형)과, 하나가 여러 갈래로 이어지는 계층·망(비선형)입니다. 용도가 다릅니다.",
      why: "선형/비선형 분류와 각 대표 자료구조가 출제 핵심입니다.",
      mechanism: "선형(Linear — 원소가 일대일 순차 연결): 배열, 연결 리스트, 스택(LIFO), 큐(FIFO), 덱. 순차 접근·단순. 비선형(Non-linear — 일대다·다대다 계층/망): 트리(계층 — 이진트리·BST·힙·B-트리), 그래프(망 — 정점·간선). 관계 표현·탐색에 유리. 저장 방식: 순차(배열 기반)·연결(포인터 기반). 문제 성격에 맞게 선택.",
      map: [
        { as: "한 줄로 순차", real: "선형(배열·리스트·스택·큐)", note: "" },
        { as: "가지·망 형태", real: "비선형(트리·그래프)", note: "" },
        { as: "순차 접근", real: "선형 특성", note: "" },
        { as: "계층·관계 표현", real: "비선형 특성", note: "" },
      ],
      usage: "자료구조 선택의 기본 분류입니다. 시험은 선형/비선형 구분, 대표 자료구조입니다.",
      links: [
        { topic: "링크드 리스트(Linked List)", how: "대표적 선형 자료구조입니다." },
        { topic: "이진 탐색 트리(Binary Search Tree)", how: "대표적 비선형 자료구조입니다." },
      ],
      exam: "자료구조는 원소가 일렬로 연결된 선형(배열·리스트·스택·큐)과 계층·망으로 이어진 비선형(트리·그래프)으로 나뉘며, 문제 성격에 맞게 선택한다.",
    }, image: "/concept/book/ds-linear-nonlinear.png", easy: "자료구조의 큰 지도입니다 — 데이터끼리 어떤 대응 구조로 저장되느냐로 갈립니다. 선형(1:1 대응, 한 줄): 구조가 간단하고 접근 속도가 빠릅니다 — Array(같은 크기 요소를 순차 나열), Linked List(노드=데이터+포인터를 한 줄로 연결), Stack(한쪽 끝에서만 삽입·삭제, 후입선출 LIFO — 설거지 그릇 쌓기), Queue(한쪽은 삽입·반대쪽은 삭제, 선입선출 FIFO — 은행 대기줄). 비선형(1:N, M:N 관계): 자료 간의 '관계'를 표현합니다 — Tree(나무 가지처럼 연결된 계층 구조, 순환 없는 연결 그래프)와 Graph(정점 V와 간선 E의 집합, G=(V,E)). 시험 답안 서두에 이 분류 지도를 그리면 강력합니다." },
"ds-linked-list": {
    guide: {
      hook: "'포인터로 노드를 줄줄이 연결'해 크기가 유동적인 선형 자료구조입니다.",
      scene: "배열은 크기가 고정이고 중간 삽입이 느립니다. 연결 리스트는 각 노드가 다음 노드 주소를 가리켜, 필요할 때 노드를 만들어 잇습니다. 삽입·삭제가 빠른 대신 임의 접근이 느립니다.",
      why: "배열과의 비교(삽입/삭제 vs 임의 접근)와 종류(단일·이중·원형)가 출제 핵심입니다.",
      mechanism: "노드(데이터+다음 노드 포인터)의 연결. 종류: 단일(다음만), 이중(이전·다음 — 양방향), 원형(마지막이 처음 가리킴). 삽입·삭제 O(1)(위치 알 때, 포인터만 변경), 임의 접근·탐색 O(n)(순차 이동). 배열 대비: 동적 크기·삽입삭제 유리, 임의 접근·캐시 지역성 불리·포인터 메모리. 스택·큐·해시 체이닝·그래프 인접 리스트 구현에 사용.",
      map: [
        { as: "다음 주소 가리킴", real: "노드+포인터", note: "" },
        { as: "삽입·삭제 빠름", real: "O(1)", note: "포인터 변경" },
        { as: "n번째 접근 느림", real: "탐색 O(n)", note: "순차" },
        { as: "단일·이중·원형", real: "종류", note: "" },
      ],
      usage: "동적 자료·스택/큐·해시 체이닝 구현입니다. 시험은 배열과의 비교, 종류, 복잡도입니다.",
      links: [
        { topic: "선형 자료구조와 비선형 자료구조", how: "대표적 선형 자료구조입니다." },
        { topic: "해싱과 충돌해결방법", how: "체이닝에 연결 리스트를 씁니다." },
      ],
      exam: "링크드 리스트는 노드가 포인터로 연결된 선형 자료구조로 삽입·삭제 O(1)·탐색 O(n)이며, 단일·이중·원형으로 나뉘고 동적 크기가 장점이나 임의 접근은 불리하다.",
    }, image: "/concept/book/ds-linked-list.png", easy: "각 노드가 '데이터 + 다음 노드를 가리키는 포인터'를 갖고 한 줄로 이어진 자료구조 — 보물찾기처럼 각 쪽지가 다음 위치를 알려줍니다. 구성: Head(시작을 알리는 노드), Tail(끝을 알리는 노드), Node(데이터 저장소+포인터). 배열과 달리 중간 삽입·삭제가 포인터 수정만으로 끝나는 게 강점입니다 — 삽입: 노드1→노드2로 포인터 수정, 노드2→노드3 연결 / 삭제: 노드1이 노드3을 직접 가리키게 하고 노드2를 free. 유형 4가지가 시험 포인트: Singly(다음만 가리킴, 마지막은 Null), Double(이전/다음 모두, 양방향 순환), Singly Circular(마지막이 처음을 가리킴), Double Circular(처음·마지막이 서로 가리킴)." },
"ds-stack": {
    guide: {
      hook: "'나중에 넣은 게 먼저 나오는(LIFO)' 접시 쌓기 자료구조입니다.",
      scene: "접시를 쌓으면 맨 위(마지막에 놓은 것)부터 꺼냅니다. 스택은 한쪽 끝(top)에서만 넣고(push) 빼서(pop), 되돌리기·함수 호출·괄호 검사처럼 '역순' 처리에 쓰입니다.",
      why: "LIFO와 연산(push/pop/peek), 활용(함수 호출 스택·수식·되돌리기)이 출제 핵심입니다. 큐와의 대비가 포인트입니다.",
      mechanism: "LIFO(Last In First Out): top에서만 push(삽입)·pop(제거)·peek(확인), 모두 O(1). 배열/연결 리스트로 구현. 활용: 함수 호출 스택(재귀·복귀 주소), 수식 계산(중위→후위·괄호 검사), 되돌리기(Undo), DFS, 브라우저 뒤로가기. 오버플로우(가득)·언더플로우(빈 상태 pop) 주의. 큐(FIFO)와 대비.",
      map: [
        { as: "접시 맨 위부터", real: "LIFO", note: "" },
        { as: "넣기·빼기·보기", real: "push/pop/peek", note: "O(1)" },
        { as: "함수 호출·되돌리기", real: "활용", note: "DFS" },
        { as: "선입선출과 대비", real: "큐와 구분", note: "" },
      ],
      usage: "함수 호출·수식·되돌리기·DFS입니다. 시험은 LIFO 연산, 활용, 큐와의 대비입니다.",
      links: [
        { topic: "Queue", how: "FIFO와 대비되는 자료구조입니다." },
        { topic: "그래프 순회(Graph Traversal)", how: "DFS에 스택을 씁니다." },
      ],
      exam: "스택은 top에서만 push·pop하는 LIFO 자료구조로 모든 연산 O(1)이며, 함수 호출·수식 계산·되돌리기·DFS에 쓰이고 FIFO 큐와 대비된다.",
    }, image: "/concept/book/ds-stack.png", easy: "나중에 넣은 것이 먼저 나오는 후입선출(LIFO) 자료구조 — 프링글스 통입니다. 삽입·삭제가 한쪽 끝(TOP)에서만 일어나고, 반대쪽(Bottom)에서는 아무 일도 없습니다. 연산: push(위에 추가), pop(맨 위 제거+반환), init(스택 포인터 0), isEmpty. 예외 2가지가 시험 단골 — Overflow(스택 포인터가 할당 메모리 끝을 넘어 꽉 참 → 더 못 넣음), Underflow(포인터 주소 0 = 삭제할 자료 없음). 실제 쓰임: 함수 호출 스택(브라우저 뒤로가기, 실행 취소 Ctrl+Z, 재귀 호출)이 전부 스택입니다." },
"ds-queue": {
    guide: {
      hook: "'먼저 넣은 게 먼저 나오는(FIFO)' 줄서기 자료구조입니다.",
      scene: "매표소 줄처럼 먼저 온 사람이 먼저 처리됩니다. 큐는 한쪽(rear)에서 넣고(enqueue) 반대쪽(front)에서 빼(dequeue), 순서대로 처리하는 대기열·버퍼에 쓰입니다.",
      why: "FIFO와 변형(원형 큐·우선순위 큐·덱), 활용(BFS·스케줄링·버퍼)이 출제 핵심입니다. 스택과의 대비가 포인트입니다.",
      mechanism: "FIFO(First In First Out): rear에서 enqueue·front에서 dequeue, O(1). 변형: 원형 큐(배열 공간 재활용), 우선순위 큐(우선순위 순 — 힙 구현), 덱(Deque — 양끝 삽입·삭제). 활용: BFS, CPU/프린터 스케줄링, 메시지 큐·버퍼(카프카), 캐시. 배열(원형) 또는 연결 리스트 구현. 스택(LIFO)과 대비.",
      map: [
        { as: "줄 선 순서대로", real: "FIFO", note: "" },
        { as: "넣기·빼기", real: "enqueue/dequeue", note: "O(1)" },
        { as: "우선순위 순", real: "우선순위 큐(힙)", note: "변형" },
        { as: "BFS·스케줄링·버퍼", real: "활용", note: "" },
      ],
      usage: "BFS·스케줄링·메시지 버퍼입니다. 시험은 FIFO 연산, 변형(원형·우선순위·덱), 스택과의 대비입니다.",
      links: [
        { topic: "Stack", how: "LIFO와 대비되는 자료구조입니다." },
        { topic: "힙(Heap)", how: "우선순위 큐 구현에 씁니다." },
      ],
      exam: "큐는 rear에서 넣고 front에서 빼는 FIFO 자료구조로, 원형 큐·우선순위 큐·덱으로 변형되며 BFS·스케줄링·메시지 버퍼에 쓰이고 LIFO 스택과 대비된다.",
    }, image: "/concept/book/ds-queue.png", easy: "먼저 들어온 데이터가 먼저 나가는 선입선출(FIFO) 자료구조 — 은행 번호표 줄입니다. 앞(Front)에서 빼고 뒤(Rear)로 넣습니다. 연산: Enqueue(후단 삽입), Dequeue(전단 삭제), isFull(배열만), isEmpty. 유형 [선순링덱]이 시험 핵심 — 선형 큐(배열을 한 줄로), 순환 큐/원형 큐(배열의 끝과 시작을 논리적으로 이어 빈자리를 재활용 — 선형 큐의 공간 낭비 해결), LinkedList 큐(연결 리스트로 구현, 크기 제한 없음), 덱(Deque: 전단·후단 모두에서 삽입·삭제 가능한 양방향 큐). 프린터 대기열·메시지 큐·OS 준비 큐가 전부 큐입니다." },
"ds-bst": {
    guide: {
      hook: "'왼쪽은 작고 오른쪽은 큰' 규칙으로 빠른 탐색을 지원하는 이진 트리입니다.",
      scene: "각 노드에서 왼쪽 자식은 작은 값, 오른쪽은 큰 값을 두면, 찾는 값과 비교하며 한쪽으로만 내려가 절반씩 좁힙니다. 정렬·탐색·범위 질의가 빠릅니다 — 단, 균형이 깨지면 느려집니다.",
      why: "탐색/삽입/삭제 평균 O(log n)·최악 O(n)와 중위순회=정렬, 균형 문제(→AVL)가 출제 핵심입니다.",
      mechanism: "규칙: 모든 노드에서 왼쪽 서브트리<노드<오른쪽 서브트리. 탐색·삽입·삭제: 비교하며 한쪽으로 이동, 평균 O(log n)(균형 시), 최악 O(n)(한쪽으로 치우쳐 리스트화 — 정렬된 입력). 중위 순회하면 오름차순 정렬. 삭제는 자식 수에 따라(리프·한 자식·두 자식은 후계자로 대체). 균형 유지 필요 → AVL·레드블랙 트리.",
      map: [
        { as: "왼쪽<노드<오른쪽", real: "BST 규칙", note: "" },
        { as: "절반씩 좁힘", real: "평균 O(log n)", note: "" },
        { as: "치우치면 리스트", real: "최악 O(n)", note: "균형 문제" },
        { as: "중위순회=정렬", real: "정렬 지원", note: "" },
      ],
      usage: "탐색·정렬·범위 질의입니다. 시험은 평균/최악 복잡도, 중위순회, 균형(AVL) 필요성입니다.",
      links: [
        { topic: "AVL 트리", how: "균형을 자동 유지하는 BST입니다." },
        { topic: "트리 순회(Tree Traversal)", how: "중위 순회로 정렬됩니다." },
      ],
      exam: "이진 탐색 트리는 왼쪽<노드<오른쪽 규칙의 트리로 탐색·삽입·삭제 평균 O(log n)·최악 O(n)이며, 중위 순회하면 정렬되고 치우침을 막으려 AVL 등으로 균형을 유지한다.",
    }, image: "/concept/book/ds-bst.png", easy: "이진탐색의 빠른 탐색력 + 연결리스트의 쉬운 삽입·삭제를 결합한 트리입니다. 규칙 4가지: ① 왼쪽 서브트리는 내 값보다 작은 값들 ② 오른쪽 서브트리는 큰 값들 ③ 중복 없음 ④ 모든 서브트리도 이진 탐색 트리. 탐색은 스무고개: 루트와 비교 → 작으면 왼쪽, 크면 오른쪽으로 재귀 — 한 번 비교할 때마다 후보가 절반으로 줄어듭니다(예: 10 찾기 — 루트 7과 비교 10>7이니 왼쪽(1,3,5) 통째로 제외 → 8과 비교 → 10 발견). 중위순회(in-order)하면 모든 값이 정렬된 순서로 나오는 것도 시험 포인트입니다." },
"ds-avl": {
    guide: {
      hook: "'양쪽 높이 차를 1 이하로' 자동 유지해 최악에도 O(log n)을 보장하는 균형 이진탐색트리입니다.",
      scene: "일반 BST는 치우치면 O(n)으로 느려집니다. AVL 트리는 삽입·삭제할 때마다 균형이 깨지면 회전(rotation)으로 바로잡아, 항상 균형을 유지해 O(log n)을 보장합니다.",
      why: "'균형 인수(±1)'와 4가지 회전(LL·RR·LR·RL)이 출제 핵심입니다. 레드블랙 트리와의 비교가 포인트입니다.",
      mechanism: "균형 인수(Balance Factor = 왼쪽 높이 − 오른쪽 높이) 유지: −1·0·1만 허용. 삽입·삭제 후 위반 시 회전: LL(오른쪽 단순 회전), RR(왼쪽 회전), LR(왼쪽-오른쪽 이중), RL(오른쪽-왼쪽 이중). 탐색·삽입·삭제 항상 O(log n). 엄격한 균형(레드블랙보다 탐색 빠름·삽입삭제 회전 많음). 레드블랙(느슨한 균형·삽입삭제 유리)과 트레이드오프.",
      map: [
        { as: "높이 차 ≤1", real: "균형 인수(±1)", note: "" },
        { as: "깨지면 회전", real: "LL·RR·LR·RL 회전", note: "핵심" },
        { as: "항상 O(log n)", real: "최악 보장", note: "BST 개선" },
        { as: "엄격 균형", real: "레드블랙과 트레이드오프", note: "" },
      ],
      usage: "탐색 많은 균형 트리입니다. 시험은 균형 인수, 4회전, 레드블랙과의 비교입니다.",
      links: [
        { topic: "이진 탐색 트리(Binary Search Tree)", how: "AVL은 균형 잡힌 BST입니다." },
        { topic: "B-Tree(Balanced Tree)", how: "디스크용 균형 트리로 대비됩니다." },
      ],
      exam: "AVL 트리는 균형 인수를 ±1 이내로 유지하는 균형 BST로, 삽입·삭제 시 LL·RR·LR·RL 회전으로 균형을 맞춰 항상 O(log n)을 보장한다.",
    }, image: "/concept/book/ds-avl.png", easy: "AVL 트리는 각 노드의 좌우 서브트리 높이 차이(Balance factor)를 절대값 1 이하로 강제해 균형을 지키는 이진 탐색 트리입니다. BST가 한쪽으로 기울면 사실상 연결 리스트가 되어 O(N)으로 느려지는 문제를 막습니다. 균형이 깨지면 회전으로 복구 — LL(왼쪽-왼쪽 치우침 → 오른쪽 한 번 회전), RR(오른쪽-오른쪽 → 왼쪽 한 번), LR(왼쪽-오른쪽 → LL 후 RR 두 번), RL(오른쪽-왼쪽 → RR 후 LL 두 번). 교재의 9→4→3→12→14→10 삽입 예제가 그대로 시험감입니다: 3 삽입 시 BF +2 → LL 회전, 14 삽입 시 −2 → RR 회전, 10 삽입 시 → RL 회전." },
"ds-heap": {
    guide: {
      hook: "'부모가 항상 자식보다 크거나(작거나)' 한 완전 이진 트리 — 우선순위 큐의 기반입니다.",
      scene: "최댓값이나 최솟값을 계속 빠르게 꺼내야 할 때 씁니다. 힙은 루트에 항상 최대(또는 최소)가 오도록 유지해, 최우선 원소를 O(1)에 보고 O(log n)에 꺼냅니다.",
      why: "최대/최소 힙과 삽입·삭제 O(log n), 힙 정렬·우선순위 큐 활용이 출제 핵심입니다.",
      mechanism: "완전 이진 트리(배열로 구현: 부모 i, 자식 2i+1·2i+2). 최대 힙(부모≥자식, 루트=최대)·최소 힙(부모≤자식, 루트=최소). 삽입: 끝에 추가 후 위로 올리기(sift-up) O(log n). 삭제(루트 추출): 루트 제거·마지막을 루트로·아래로 내리기(sift-down) O(log n). peek O(1). 활용: 우선순위 큐, 힙 정렬(O(n log n)), 다익스트라·허프만, top-K.",
      map: [
        { as: "루트=최대/최소", real: "최대/최소 힙", note: "" },
        { as: "완전 이진 트리", real: "배열 구현", note: "" },
        { as: "삽입·삭제", real: "sift-up/down O(log n)", note: "" },
        { as: "우선순위 큐·정렬", real: "활용", note: "다익스트라" },
      ],
      usage: "우선순위 큐·힙 정렬·top-K입니다. 시험은 최대/최소 힙, 삽입·삭제 O(log n), 활용입니다.",
      links: [
        { topic: "Queue", how: "우선순위 큐를 힙으로 구현합니다." },
        { topic: "다익스트라(Dijkstra) 알고리즘", how: "우선순위 큐로 힙을 씁니다." },
      ],
      exam: "힙은 부모가 자식보다 크거나(최대 힙) 작은(최소 힙) 완전 이진 트리로 삽입·삭제 O(log n)·peek O(1)이며, 우선순위 큐·힙 정렬·다익스트라에 쓰인다.",
    }, image: "/concept/book/ds-heap.png", easy: "가장 큰(또는 작은) 키 값을 빠르게 찾도록 만든 완전 이진 트리입니다. 최대 힙(Max-Heap): 모든 부모가 자손보다 큰 값 → 루트가 항상 최대값이라 우선순위 큐(priority queue) 구현에 최적. 최소 힙(Min-Heap): 부모가 자손보다 작은 값 → 루트가 최소값. 삽입 원리(교재 Min-Heap 예): 완전 이진 트리 형태를 유지하며 끝에 붙인 뒤, 부모보다 작으면 계속 위로 치환(1 삽입 → 4와 치환 → 2와 치환 → 루트 도달). 응급실 환자 분류, OS 우선순위 스케줄링, 다익스트라 알고리즘이 힙을 씁니다." },
"ds-btree": {
    guide: {
      hook: "'한 노드에 여러 키'를 두어 디스크 접근을 줄인 다진 균형 트리 — DB 인덱스의 뼈대입니다.",
      scene: "디스크는 읽기가 느려 트리 높이(접근 횟수)를 낮춰야 합니다. B-트리는 한 노드에 키를 여러 개 담아 자식을 많이 두어, 적은 높이로 방대한 데이터를 탐색합니다. DB·파일시스템 인덱스의 기본입니다.",
      why: "'다진 균형·낮은 높이·디스크 최적화'와 B+트리와의 차이가 출제 핵심입니다. AVL(이진)과의 대비가 포인트입니다.",
      mechanism: "차수 m의 B-트리: 노드당 최대 m개 자식·m−1개 키, 모든 리프가 같은 깊이(균형). 노드가 크므로(디스크 블록 크기) 한 번 읽어 여러 키 비교 → 높이↓·디스크 I/O↓. 탐색·삽입·삭제 O(log n). 분할(가득 차면 위로)·병합(부족하면)으로 균형. B+트리(변형): 키는 내부에도 있으나 실제 데이터는 리프에만, 리프끼리 연결 리스트로 연결 → 범위 검색 유리(DB 인덱스 주류).",
      map: [
        { as: "노드에 키 여러 개", real: "다진 트리", note: "" },
        { as: "높이 낮아 I/O↓", real: "디스크 최적화", note: "핵심" },
        { as: "리프 깊이 같음", real: "균형", note: "" },
        { as: "리프 연결·범위검색", real: "B+트리", note: "DB 인덱스" },
      ],
      usage: "DB·파일시스템 인덱스입니다. 시험은 다진 균형·디스크 최적화, B+트리, AVL과의 대비입니다.",
      links: [
        { topic: "RDBMS 인덱스(index)", how: "B+트리가 인덱스의 기본 구조입니다." },
        { topic: "AVL 트리", how: "이진 균형 트리와 대비됩니다." },
      ],
      exam: "B-트리는 한 노드에 여러 키를 담는 다진 균형 트리로 높이를 낮춰 디스크 I/O를 줄이며, 데이터를 리프에 두고 연결한 B+트리가 DB 인덱스의 기본 구조다.",
    }, image: "/concept/book/ds-btree.png", easy: "자식을 2개보다 많이 가질 수 있는 이진 트리의 확장형 균형 트리 — 데이터베이스 인덱스와 파일시스템의 심장입니다. 구조: Root(최소 자식 2·값 1), Internal(차수 m이면 최대 m개 자식), Leaf(전부 같은 레벨). 특징: 리프·루트 제외 노드는 최소 m/2개 자료 보유, 최악의 경우가 없어 O(log N) 일정, 노드가 자식을 많이 가져 트리 높이가 낮음, 노드 내 자료는 정렬 상태. 삽입은 항상 잎에서: 가득 차면(Overflow) 중간 키를 부모로 올리고 둘로 분할. 삭제도 잎에서: 내부 노드 값이면 후행 키와 자리를 바꿔 잎으로 옮긴 후 삭제. 유형: B+ Tree(인덱스 세트+순차 세트 — DB 인덱스 표준), B* Tree(최소 2/3 채움)." },
"ds-dag": {
    guide: {
      hook: "'방향이 있고 사이클이 없는' 그래프 — 순서·의존 관계를 표현합니다.",
      scene: "작업 A가 끝나야 B를 할 수 있는 의존 관계, 커밋 이력(git)처럼 되돌아오지 않는 흐름을 표현합니다. 방향이 있고 순환하지 않아, 위상 정렬로 실행 순서를 정할 수 있습니다.",
      why: "'방향+비순환'의 정의와 위상 정렬, 활용(작업 스케줄링·git·블록체인)이 출제 핵심입니다.",
      mechanism: "방향 간선(단방향)+사이클 없음. 위상 정렬(Topological Sort): 의존 순서대로 정점 나열(진입차수 0부터 제거 — 칸 알고리즘, 또는 DFS 후위). 사이클 있으면 위상 정렬 불가(순환 의존 탐지에 활용). 활용: 작업/빌드 스케줄링(선후 관계), 데이터 파이프라인, git 커밋 그래프, 스프레드시트 계산 순서, 블록체인(일부). 최장 경로(임계경로)·DP에도 사용.",
      map: [
        { as: "단방향 간선", real: "방향 그래프", note: "" },
        { as: "되돌아오지 않음", real: "비순환(Acyclic)", note: "" },
        { as: "실행 순서 정하기", real: "위상 정렬", note: "핵심" },
        { as: "작업 의존·git", real: "활용", note: "" },
      ],
      usage: "작업 스케줄링·빌드·git·파이프라인입니다. 시험은 위상 정렬, 사이클 탐지, 활용입니다.",
      links: [
        { topic: "그래프 순회(Graph Traversal)", how: "위상 정렬에 DFS를 씁니다." },
        { topic: "CPM (Critical Path Management)", how: "DAG의 임계경로 계산입니다." },
      ],
      exam: "DAG는 방향이 있고 사이클이 없는 그래프로 의존·순서 관계를 표현하며, 위상 정렬로 실행 순서를 정하고 작업 스케줄링·빌드·git 이력에 쓰인다.",
    }, image: "/concept/book/ds-dag.png", easy: "간선에 방향이 있고 순환이 없는 그래프 — 선수과목 이수 체계나 작업 의존 관계(빌드 순서, Airflow 파이프라인)를 표현하는 구조입니다. 핵심 알고리즘이 위상 정렬(Topological Ordering): 방향을 거스르지 않게 정점을 한 줄로 나열합니다. 절차: ① 정점별 진입차수(in-degree: 들어오는 간선 수) 표 작성 → ② 진입차수 0인 정점을 큐에 삽입하며 그 정점과 간선 제거 → ③ 새로 진입차수 0이 된 정점을 계속 큐에 삽입 → ④ 모든 정점 제거되면 완료. 교재 예제 결과: 4→1→6→2→3→5. DFS나 큐로 풀 수 있고, 순환이 있으면 위상 정렬이 불가능하다는 것도 시험 포인트입니다." },
"genai-data-quality-v2": {
    guide: {
      hook: "생성형 AI용 '지시(Instruction) 데이터'의 품질을 관리하는 가이드입니다.",
      scene: "생성형 AI는 캡션·요약·Q&A·대화 같은 지시 데이터로 학습해, 일반 AI 학습데이터와 품질 관리가 다릅니다. 이 가이드는 생성형 AI 특화 데이터의 구축·정제·가공·품질검증 절차를 체계적으로 제시합니다.",
      why: "일반 학습데이터(v3.1)와의 차이(Instruction 데이터 유형)와 구축 절차가 출제 핵심입니다.",
      mechanism: "특화: 가공 데이터가 Caption·Summary·Q&A·Dialogue·Translation·판독문(Radiology Report) 형태. 구축: 계획 수립→획득/수집(원시)→정제(원천)→가공(가공데이터)→품질검증→활용. 품질기준: 구문·의미 정확성, 다양성, 편향·유해성 관리. '학습용 데이터 품질관리 v3.1'(일반 AI)의 생성형 특화판. 데이터 품질이 생성 성능·안전성 좌우.",
      map: [
        { as: "지시 데이터", real: "Q&A·대화·요약", note: "" },
        { as: "수집→정제→가공", real: "구축 절차", note: "" },
        { as: "편향·유해성 관리", real: "품질기준", note: "" },
        { as: "v3.1 생성형 특화판", real: "위치", note: "" },
      ],
      usage: "생성형 AI 데이터 품질입니다. 시험은 지시 데이터 유형, 구축 절차입니다.",
      links: [
        { topic: "인공지능 학습용 데이터 품질관리 가이드 v3.1", how: "일반 AI판과 대비되는 생성형 특화판입니다." },
        { topic: "데이터 품질(Data Quality)", how: "데이터 품질 관리 원리를 공유합니다." },
      ],
      exam: "생성형 AI 데이터 품질관리 가이드는 캡션·Q&A·대화 등 지시 데이터의 구축·정제·가공·검증 절차를 제시하는 v3.1의 생성형 특화판이다.",
    }, image: "/concept/book/genai-data-quality-v2.png", easy: "생성형AI를 위한 데이터 품질관리 방법·절차를 체계적으로 제시하는 가이드입니다. '학습용 데이터 품질관리 v3.1'이 일반 AI 학습데이터용이라면, 이쪽은 생성형AI(Instruction Data) 특화판 — 가공 데이터가 Caption(캡션)·Summary(요약)·Q&A(질의응답)·Dialogue(대화)·Translation(번역)·Radiology Report(판독문) 형태라는 점이 다릅니다. 데이터 구축 과정: 구축계획 수립 → 데이터 획득/수집(원시데이터) → 데이터 정제(원천데이터) → 데이터 가공(가공데이터) → 데이터 학습(학습 데이터셋) → 반복. 품질지표 4개: 구축 공정 적정성(준비성·완전성·유용성), 데이터 적합성(기준 적합성·다양성·유사성·편향성·유용성·안전성), 가공 데이터 정확성(구문·의미 정확성), 학습모델 적정성(알고리즘 적정성·유효성). 2025 KPC·ITPE 다수 기출." },
"mas": {
    guide: {
      hook: "여러 자율 에이전트가 협력·경쟁하며 문제를 분산 해결하는 시스템입니다.",
      scene: "복잡한 문제를 하나의 큰 AI로 풀기 어려울 때가 있습니다. MAS(Multi-Agent System)는 각자 자율적으로 판단하는 여러 에이전트가 통신·협상하며 협력 또는 경쟁해, 개미 군집처럼 분산적으로 문제를 풉니다.",
      why: "6대 특성(자율·분산·통신·협력/경쟁 등)과 분산 AI 개념이 출제 핵심입니다.",
      mechanism: "특성[자분통 경전적]: 자율(중앙 통제 없이 독립 판단), 분산(제어 분산 → 부분 장애에도 유지, Fault-Tolerant), 통신(RPC·REST·Pub-Sub로 정보 교환·협상), 경쟁/협력(공동·상충 목표), 전문화(역할 분담), 적응(환경 학습). 구조: 에이전트+환경+상호작용 프로토콜. LLM 기반 에이전트로 부상(LangGraph·A2A). 조정·합의·오케스트레이션이 과제.",
      map: [
        { as: "독립 판단", real: "자율(Autonomy)", note: "" },
        { as: "제어 분산", real: "분산·내결함", note: "" },
        { as: "협상·정보 교환", real: "통신", note: "" },
        { as: "협력/경쟁", real: "상호작용", note: "" },
      ],
      usage: "분산 AI·멀티에이전트입니다. 시험은 6대 특성, 조정·오케스트레이션입니다.",
      links: [
        { topic: "LangGraph", how: "멀티에이전트 협업을 오케스트레이션합니다." },
        { topic: "A2A (Agent-to-Agent)", how: "에이전트 간 통신 프로토콜을 제공합니다." },
      ],
      exam: "MAS는 자율·분산·통신·협력/경쟁 특성을 갖는 여러 에이전트가 상호작용하며 문제를 분산 해결하는 분산 AI 시스템으로, LLM 기반 멀티에이전트로 재부상하고 있다.",
    }, image: "/concept/book/mas.png", easy: "여러 자율적 소프트웨어 에이전트가 상호작용하며 협력 또는 경쟁을 통해 복잡한 문제를 분산적으로 해결하는 분산 인공지능 시스템입니다. 개미 군집처럼 개별 에이전트는 단순하지만 모이면 복잡한 문제를 풉니다. 특성 6가지 [자분통 경전적] — 자율(중앙 통제 없이 독립 판단: GPT 기반 에이전트·RL 로봇), 분산(제어 권한 분산으로 특정 장애에도 전체 유지: Event-driven Architecture·Fault-Tolerant Agent Design), 통신(RPC/REST/Pub-Sub로 정보 교환·협상), 경쟁/협력(Multi-Agent Task Scheduler로 역할 분담), 전문화(Expert Agent — 서로 다른 역할·지식으로 상호보완), 적응성(RL로 환경 변화에 능동 대응). 유형: Independent(Discrete, Emergent Cooperation) vs Cooperative(Communicating — Deliberative·Negotiating / Non-communicating). A2A 프로토콜은 이 에이전트들이 조직 경계를 넘어 통신하기 위한 규약입니다. 2025.05 ITPE FR 기출." },
"llmops": {
    guide: {
      hook: "MLOps의 LLM 특화판 — LLM 앱의 설계·배포·운영을 통합 관리합니다.",
      scene: "LLM 앱은 프롬프트·임베딩·벡터DB·환각 관리 등 일반 ML과 다른 요소가 많습니다. LLMOps는 이런 LLM 특유의 개발·배포·모니터링을 체계화해, 프롬프트부터 운영까지 전 주기를 관리하는 패러다임입니다.",
      why: "MLOps와의 차이(프롬프트·임베딩·벡터DB)와 파이프라인 단계가 출제 핵심입니다.",
      mechanism: "정의: LLMOps = 머신러닝 ∩ DevOps ∩ 데이터 엔지니어링(LLM 특화). 단계: 데이터 수집·처리→기반모델 선정→임베딩(벡터화·벡터DB)→프롬프트 관리(엔지니어링·체이닝)→테스트→버전관리(CI/CD)→모니터링(지연·안전성·환각)→최적화(파인튜닝·프롬프트 반복). 기술: Spark/Kafka, GPT·LLaMA, LangChain, 벡터DB. MLOps 대비 프롬프트·RAG·환각 관리가 특징.",
      map: [
        { as: "벡터화·벡터DB", real: "임베딩", note: "" },
        { as: "엔지니어링·체이닝", real: "프롬프트 관리", note: "" },
        { as: "지연·환각 감시", real: "모니터링", note: "" },
        { as: "ML∩DevOps∩데이터", real: "정의", note: "" },
      ],
      usage: "LLM 앱 운영입니다. 시험은 MLOps 차이, 파이프라인 단계입니다.",
      links: [
        { topic: "MLOps", how: "LLMOps가 LLM 특화판입니다." },
        { topic: "RAG (Retrieval-Augmented Generation)", how: "임베딩·벡터DB 단계의 핵심입니다." },
      ],
      exam: "LLMOps는 임베딩·프롬프트·벡터DB·환각 관리를 포함해 LLM 앱의 개발~운영을 통합하는 MLOps의 LLM 특화 패러다임이다.",
    }, image: "/concept/book/llmops.png", easy: "MLOps의 LLM 특화판 — 대형 언어 모델의 설계부터 관리·배포·유지까지 통합하고 효율화하는 과정이자 패러다임입니다. 벤다이어그램이 핵심: LLMOps = 머신러닝 ∩ DevOps ∩ 데이터 엔지니어링. 단계별 구성요소: Data 수집·처리 → 기반모델 선정 → 임베딩 처리(벡터라이징·벡터 DB 저장) → 프롬프트 관리(프롬프트 엔지니어링·체이닝) → 테스트 → 버전 관리(CI/CD) → 모니터링(지연·안전성) → 최적화(파인튜닝·프롬프트 iteration). 구현 기술 예: Spark/Kafka(수집), GPT·LLAMA·Gemini(기반모델), Milvus/Weaviate(벡터 DB), Azure AI Studio(프롬프트), Jenkins X(CI/CD), Arize(모니터링)." },
"ai-watermark": {
    guide: {
      hook: "AI 생성물에 '보이지 않는 서명'을 심어 AI 제작임을 식별하는 기술입니다.",
      scene: "딥페이크·AI 생성 콘텐츠가 진짜와 구별이 안 되면 사회적 혼란입니다. AI 워터마크는 이미지·영상·오디오·텍스트에 사람 눈에 안 보이는 표식을 심어, 'AI 생성물'임을 검출·증명하게 합니다.",
      why: "3대 분류(공간·변환·학습 기반)와 도메인별 기법이 출제 핵심입니다.",
      mechanism: "공간 기반: 이미지·영상 최하위 비트에 삽입(LSB — 단순·취약). 변환 기반: 주파수 도메인 삽입(DCT 블록 계수, DWT 중·고주파 서브밴드, Edge Masking — 강인성↑). 학습 기반: 생성 모델이 서명을 숨기도록 학습(Stable Signature; 텍스트는 로짓·토큰 샘플링 워터마크). 오디오: AudioSeal·WavMark. 요건: 비가시성·강인성(변형 견딤)·검출성. AI 투명성·규제 대응.",
      map: [
        { as: "최하위 비트", real: "공간 기반(LSB)", note: "취약" },
        { as: "주파수 도메인", real: "변환 기반(DCT·DWT)", note: "강인" },
        { as: "생성 모델이 서명 학습", real: "학습 기반", note: "" },
        { as: "비가시·강인·검출", real: "요건", note: "" },
      ],
      usage: "AI 콘텐츠 식별입니다. 시험은 3대 분류, DCT·DWT, 강인성입니다.",
      links: [
        { topic: "딥페이크(Deepfake)", how: "워터마크로 생성물을 식별·대응합니다." },
        { topic: "생성형 AI 서비스 이용자 보호 가이드라인", how: "AI 생성 고지 수단으로 연계됩니다." },
      ],
      exam: "AI 워터마크는 AI 생성물에 비가시 표식을 심어 식별하는 기술로, 공간(LSB)·변환(DCT·DWT)·학습(Stable Signature) 기반으로 나뉘며 강인성·검출성이 핵심 요건이다.",
    }, image: "/concept/book/ai-watermark.png", easy: "AI가 만든 이미지·영상·오디오·텍스트에 사람 눈에 안 보이는 워터마크를 심어 'AI 생성물'임을 식별하게 하는 기술입니다. 분류 3가지가 시험 핵심 — 공간 기반(이미지·동영상: 최하위 비트에 삽입, LSB), 변환 기반(주파수 도메인으로 변환해 삽입: DCT는 블록 단위 주파수 계수, DWT는 저주파 LL 제외한 중·고주파 서브밴드에 삽입, Edge Masking), 학습 기반(생성 모델 자체가 서명을 숨기도록 학습: Stable Signature, 텍스트는 로짓 생성·토큰 샘플링 워터마크). 오디오는 Audio Seal·WavMark·Spread Spectrum 등. AI 기본법의 생성물 표시 의무와 연결되는 실무 기술입니다. 2025.05 ITPE FR 기출." },
"genai-user-protection": {
    guide: {
      hook: "생성형 AI의 위험을 사전 예방하고 이용자를 보호하는 가이드라인입니다.",
      scene: "생성형 AI가 허위·차별·인격권 침해 콘텐츠를 만들 수 있습니다. 이 가이드라인(방통위, 2025.02.28)은 서비스 제공자가 지켜야 할 기본 원칙과 실천 방안을 제시해, 잠재 위험을 사전에 막고 이용자 권익을 지킵니다.",
      why: "5대 기본원칙과 두 실행 축(권익 보호·콘텐츠 책임)이 출제 핵심입니다.",
      mechanism: "기본원칙[인설안공비]: 인간 존엄성 보호(AI는 보조·인간 결정권), 설명 가능성·투명성, 안전한 작동 보장, 공정성·비차별, 그리고 이를 관통하는 신뢰. 실행 축1(이용자 권익): 인격권 보호(필터링·신고·차단), 결정 과정 설명('AI 생성' 고지), 다양성 존중, 입력데이터 수집·활용 관리(고지·동의). 실행 축2(콘텐츠 관리·책임): 책임과 참여, 건전한 유통·배포. 자율규제 성격.",
      map: [
        { as: "인간 존엄·결정권", real: "기본원칙", note: "" },
        { as: "AI 생성 고지", real: "설명·투명성", note: "" },
        { as: "필터링·신고·차단", real: "인격권 보호", note: "" },
        { as: "건전한 유통", real: "콘텐츠 책임", note: "" },
      ],
      usage: "생성형 AI 서비스 규범입니다. 시험은 5대 원칙, 두 실행 축입니다.",
      links: [
        { topic: "AI 워터마크(AI Watermark)", how: "'AI 생성' 고지 수단이 됩니다." },
        { topic: "AI 기본법(AI Basic Act)", how: "생성형 AI 규제의 법적 기반과 연계됩니다." },
      ],
      exam: "생성형 AI 이용자 보호 가이드라인(방통위, 2025.02.28)은 인간 존엄·설명 가능성·안전·공정성 원칙 아래 이용자 권익 보호와 콘텐츠 책임을 실천하게 하는 자율규제 지침이다.",
    }, image: "/concept/book/genai-user-protection.png", easy: "생성형 AI 서비스의 잠재적 위험을 사전 방지하고 이용자 권익을 보호하기 위한 가이드라인입니다(방통위, 2025.02.28). 기본원칙 [인설안공비] — 인간 존엄성 보호(AI는 보조 수단), 설명 가능성과 투명성 확보, 안전한 작동 보장, 공정성과 비차별. 실행 방안이 두 축: 이용자 권익 보호 [이결다입] — 이용자 인격권 보호(필터링·신고·차단), 결정 과정의 설명 노력('AI 생성' 고지), 다양성 존중, 입력데이터 수집·활용 관리(사전 고지·동의) / 콘텐츠 관리·책임 [책건] — 책임과 참여, 건전한 유통·배포. 생태계 조성은 EU AI Act·AI 기본법·ISO/IEC 42001과 연계됩니다. 138회 정보관리 3교시 기출." },
"genai-user-protection-2502": {
    guide: {
      hook: "생성형 AI 이용자 보호 가이드라인(2025.02.28) — 방통위 발표판입니다.",
      scene: "생성형 AI 확산으로 허위정보·프롬프트 남용·차별 우려가 커졌습니다. 방통위가 2025.2.28 발표한 이 가이드라인은 이용 과정의 잠재 위험을 사전 방지하고 이용자 권익을 보호할 기본 원칙과 실천 방식을 담습니다.",
      why: "발표 주체·시점과 5대 기본원칙이 출제 핵심입니다.",
      mechanism: "발표: 방송통신위원회, 2025.02.28. 기본원칙[인설안공비]: 인간 존엄성 보호(AI는 인간 보조·결정권 보장), 설명 가능성·투명성(왜 그런 결과인지 설명), 안전한 작동 보장(오작동·허위 생성·프롬프트 남용 예방), 공정성·비차별(데이터 편향 관리). 실천: 이용자 권익 보호(인격권·고지·동의), 콘텐츠 관리·책임(건전 유통). 자율규제. '생성형 인공지능 서비스 이용자 보호 가이드라인'과 동일 문서.",
      map: [
        { as: "방통위 2025.02.28", real: "발표", note: "" },
        { as: "인간 보조·결정권", real: "인간 존엄성", note: "" },
        { as: "허위·남용 예방", real: "안전한 작동", note: "" },
        { as: "편향 관리", real: "공정성·비차별", note: "" },
      ],
      usage: "생성형 AI 규범입니다. 시험은 발표 주체·시점, 5대 원칙입니다.",
      links: [
        { topic: "생성형 AI 서비스 이용자 보호 가이드라인", how: "동일 문서의 발표일 표기판입니다." },
        { topic: "AI 기본법(AI Basic Act)", how: "생성형 AI 규제 기반과 연계됩니다." },
      ],
      exam: "생성형 AI 이용자 보호 가이드라인(방통위, 2025.02.28)은 인간 존엄·설명 가능성·안전·공정성 5대 원칙으로 생성형 AI의 위험을 사전 예방하고 이용자를 보호하는 자율규제 지침이다.",
    }, image: "/concept/book/genai-user-protection-2502.png", easy: "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)은 방송통신위원회가 발표한, 생성형 AI 이용 과정의 잠재적 위험을 사전 방지하고 이용자 권익을 보호하기 위한 기본 원칙과 실천 방식입니다('생성형 인공지능 서비스 이용자 보호 가이드라인'과 같은 문서의 발표일 표기판). 기본원칙 [인설안공비] — 인간 존엄성 보호(AI는 인간을 보조하는 수단, 인간의 결정권 보장), 설명 가능성과 투명성 확보(왜 그런 결과인지 알기 쉽게 설명), 안전한 작동 보장(오작동·잘못된 정보 생성·프롬프트 남용 사전 예방), 공정성과 비차별(데이터·알고리즘 편향 최소화). 실행 방안은 이용자 권익 보호 [이결다입](인격권 보호·결정 과정 설명·다양성 존중·입력데이터 관리)과 콘텐츠 관리·책임 [책건](책임과 참여·건전한 유통 배포). 답안 서두는 '방통위 2025.02.28 발표'로 잡으면 됩니다." },
"iso-42119-2": {
    guide: {
      hook: "SW 테스트 표준(29119)을 'AI 시스템 테스트'에 적용하는 기술 명세입니다.",
      scene: "AI는 비결정성·데이터 의존성 탓에 기존 테스트 표준을 그대로 쓰기 어렵습니다. ISO/IEC 42119-2는 SW 테스트 국제표준(29119)을 AI 시스템에 어떻게 적용할지 방법과 AI 특화 용어·기법을 제시합니다.",
      why: "29119의 AI 적용과 AI 특화 테스트 개념(메타모픽·데이터 테스트)이 출제 핵심입니다.",
      mechanism: "기반: ISO/IEC/IEEE 29119(SW 테스트 시리즈) + AI 표준(23894 위험·25059 품질·22989 개념). 구성: 범위·참조·AI 특화 용어(약 40개)·AI 테스트 기법. AI 특화 이슈: 비결정성·오라클 문제(정답 판정 곤란)·데이터 품질·강건성 테스트. 기법: 메타모픽 테스트, 데이터 기반 테스트, 적대적 테스트. AI 시스템 검증·품질 보증 근거.",
      map: [
        { as: "29119 기반", real: "SW 테스트 표준", note: "" },
        { as: "AI 표준 참조", real: "23894·25059·22989", note: "" },
        { as: "정답 판정 곤란", real: "오라클 문제", note: "" },
        { as: "메타모픽·적대적", real: "AI 테스트 기법", note: "" },
      ],
      usage: "AI 시스템 테스트입니다. 시험은 29119 적용, 오라클 문제·AI 테스트 기법입니다.",
      links: [
        { topic: "ISO/IEC 25059 (AI 품질 모델)", how: "AI 품질 특성을 테스트로 검증합니다." },
        { topic: "AI 시스템 테스트(AI System Test)", how: "AI 특화 테스트 기법을 공유합니다." },
      ],
      exam: "ISO/IEC 42119-2는 SW 테스트 표준 29119를 AI 시스템에 적용하는 기술 명세로, 비결정성·오라클 문제에 대응해 메타모픽·적대적 등 AI 특화 테스트 기법을 제시한다.",
    }, image: "/concept/book/iso-42119-2.png", easy: "소프트웨어 테스트 국제표준(ISO/IEC/IEEE 29119)을 AI 시스템에 적용하는 방법을 제시하는 기술 명세서입니다. 구성: 서문(범위 — 29119 적용 범위 한정, Normative references — 29119 시리즈+AI 표준 23894·25059·22989, AI 특화 용어 40개 — \"AI risk\"·\"drift testing\"·\"adversarial testing\") + 기술 본론 4개: AI 시스템·테스트 소개(생애주기 정의, 위험 기반 테스트 접근 중심), AI 시스템 리스크 식별(안전성·공정성·프라이버시·보안 리스크를 ISO/IEC 23894와 연계해 우선순위 설정), AI 테스트 접근법(레벨별 + 데이터 품질·모델·지식기반 시스템 테스트), Annex A~C(AI의 확률성·학습성·비결정성 특성). 2026.02 ITPE FR 기출." },
"brainbody-llm": {
    guide: {
      hook: "LLM을 '뇌(계획)'와 '몸(실행)'으로 나눠 쓰는 계층적 에이전트 구조입니다.",
      scene: "하나의 LLM이 고수준 계획과 세부 실행을 다 맡으면 비효율·오류가 큽니다. Brain-Body LLM은 큰 모델이 계획·추론(뇌)을, 작고 빠른 모델이 실제 도구 조작·실행(몸)을 맡아 역할을 계층 분리합니다.",
      why: "Brain(계획·추론) vs Body(실행) 역할 분리와 계층 협업이 출제 핵심입니다.",
      mechanism: "Brain-LLM: 고수준 작업 계획·의미론적 추론(크고 강력, 느림·고비용). Body-LLM: 저수준 행동·도구 조작·환경 상호작용(작고 빠름·저비용). 흐름: Brain이 목표를 하위 작업으로 분해→Body가 실행→관찰 피드백→Brain 재계획. 장점: 비용·지연 절감, 역할 특화. LAM·에이전트 구현 패턴. 계층 간 인터페이스·오류 전파가 과제.",
      map: [
        { as: "계획·추론", real: "Brain-LLM", note: "크고 느림" },
        { as: "실행·도구 조작", real: "Body-LLM", note: "작고 빠름" },
        { as: "분해→실행→재계획", real: "협업 흐름", note: "" },
        { as: "비용·지연 절감", real: "장점", note: "" },
      ],
      usage: "계층형 AI 에이전트입니다. 시험은 Brain/Body 역할 분리, 계층 협업입니다.",
      links: [
        { topic: "LAM (Large Action Model)", how: "행동 실행 계층의 기반이 됩니다." },
        { topic: "AI 에이전트(AI Agent)", how: "에이전트 구현 패턴을 제공합니다." },
      ],
      exam: "Brain-Body LLM은 큰 모델이 계획·추론(뇌)을, 작고 빠른 모델이 실행·도구 조작(몸)을 맡는 계층형 에이전트 구조로, 비용·지연을 줄이며 역할을 특화한다.",
    }, image: "/concept/book/brainbody-llm.png", easy: "LLM 두 개를 뇌(Brain)와 몸(Body)처럼 계층적으로 나눠 쓰는 에이전트 시스템입니다. Brain-LLM은 고수준 작업 계획과 의미론적 추론을 담당하고(\"소파에서 칩 먹기\" → 주방으로 가기·칩 찾기 같은 High-level Plan), Body-LLM은 하위 수준 제어·실행을 담당합니다(<walk><kitchen> 같은 Low-level Plan). 핵심은 Closed-Loop Feedback — 시뮬레이터/실환경에서 오류가 나면 오류 신호와 환경 상태가 즉시 Brain-LLM으로 돌아가고, Brain이 원인을 추론해 계획을 수정합니다(접시 씻기 실패 → 수세미 사용으로 계획 갱신 → SUCCESS). 로봇 제어형 Physical AI의 대표 아키텍처입니다." },
"confusion-matrix": {
    guide: {
      hook: "예측과 실제를 2×2 행렬로 놓고 분류 모델을 평가하는 기법입니다.",
      scene: "'정확도 99%'만으로는 모델을 신뢰할 수 없습니다. 혼동 행렬은 예측·실제의 일치를 TP·FN·FP·TN 네 칸으로 나눠, 정밀도·재현율 등 다양한 지표로 분류 성능을 정확히 평가하는 출발점입니다.",
      why: "TP/FN/FP/TN 정의와 Precision·Recall·F1 공식이 그대로 출제됩니다.",
      mechanism: "4칸: TP(맞게 양성), TN(맞게 음성), FP(양성 오탐 — 1종 오류), FN(음성 미탐 — 2종 오류). 지표: Precision=TP/(TP+FP)(예측 양성 중 진짜), Recall(민감도)=TP/(TP+FN)(실제 양성 중 잡음), Accuracy=(TP+TN)/전체, Specificity=TN/(FP+TN), F1=2PR/(P+R)(정밀도·재현율 조화평균). ROC·AUC로 확장. 불균형 데이터엔 Accuracy 대신 F1·Recall.",
      map: [
        { as: "맞게 양성", real: "TP", note: "" },
        { as: "예측 양성 중 진짜", real: "Precision", note: "" },
        { as: "실제 양성 중 잡음", real: "Recall(민감도)", note: "" },
        { as: "정밀·재현 조화평균", real: "F1", note: "" },
      ],
      usage: "분류 모델 평가입니다. 시험은 4칸 정의, Precision·Recall·F1 공식입니다.",
      links: [
        { topic: "클래스 불균형(Class Imbalance)", how: "불균형 시 Accuracy 대신 Recall·F1을 씁니다." },
        { topic: "머신러닝 평가지표", how: "분류 성능 지표의 기반입니다." },
      ],
      exam: "혼동 행렬은 예측·실제를 TP·FN·FP·TN로 구분해 분류 성능을 평가하는 기법으로, Precision=TP/(TP+FP)·Recall=TP/(TP+FN)·F1(조화평균) 지표를 도출한다.",
    }, image: "/concept/book/confusion-matrix.png", easy: "예측값과 실제값의 일치 여부를 2×2 행렬(TP·FN·FP·TN)로 놓고 모델을 평가하는 기법 — 분류 모델 평가의 출발점입니다. 지표 공식이 그대로 시험에 나옵니다: Precision=TP/(TP+FP)(Positive 예측 중 진짜), Accuracy=(TP+TN)/전체, Recall=TP/(TP+FN)(실제 Positive 중 잡아낸 비율, 민감도), Specificity=TN/(FP+TN)(진음성률), FP Rate=FP/(FP+TN)(=1−Specificity), F1 Score=2×(P×R)/(P+R)(정밀도·재현율의 조화), Cohen's Kappa=(Accuracy−P(e))/(1−P(e))(우연히 맞춘 것까지 보정 — 클래스 불균형에서 Accuracy의 함정 극복). ROC(모든 threshold의 FPR·TPR)·AUC(ROC 아래 면적)·PR Plot도 세트로 기억하세요." },
"class-imbalance": {
    guide: {
      hook: "타깃 데이터가 극소수인 상태 — 정확도의 함정을 부르는 문제입니다.",
      scene: "사기 1건 대 정상 9,999건 같은 데이터에서 모델이 전부 '정상'이라 해도 정확도 99.99%가 나옵니다. 하지만 정작 잡아야 할 사기는 못 잡죠. 클래스 불균형은 이런 소수 클래스 학습 실패를 다룹니다.",
      why: "정확도의 함정과 해결 3축(과대·과소 표집, 알고리즘)이 출제 핵심입니다.",
      mechanism: "함정: 다수 클래스만 맞혀도 Accuracy 높음, Recall은 0에 가까움 → F1·Recall로 평가. 해결: ①과대 표집(Over-Sampling — 소수 복제·생성: SMOTE·ADASYN·BLSMOTE, 과적합 위험), ②과소 표집(Under-Sampling — 다수 일부만: Random·Tomek·ENN, 정보 손실), ③알고리즘(비용민감 학습·Class Weight·앙상블). 평가지표 교체(F1·AUC). 데이터·알고리즘 양면 대응.",
      map: [
        { as: "다수만 맞혀도 고정확도", real: "정확도 함정", note: "" },
        { as: "소수 생성", real: "Over-Sampling(SMOTE)", note: "과적합" },
        { as: "다수 축소", real: "Under-Sampling", note: "정보 손실" },
        { as: "비용민감·가중치", real: "알고리즘", note: "" },
      ],
      usage: "불균형 데이터 학습입니다. 시험은 정확도 함정, SMOTE, F1 평가입니다.",
      links: [
        { topic: "혼동 행렬(Confusion Matrix)", how: "불균형 시 Recall·F1로 평가합니다." },
        { topic: "데이터 품질(Data Quality)", how: "학습 데이터 분포 관리와 연계됩니다." },
      ],
      exam: "클래스 불균형은 소수 타깃으로 정확도가 왜곡되는 문제로, 과대 표집(SMOTE)·과소 표집·비용민감 알고리즘으로 대응하고 F1·Recall로 평가한다.",
    }, image: "/concept/book/class-imbalance.png", easy: "타깃 데이터가 극소수인 상태 — 사기 거래 1건 vs 정상 9,999건 같은 상황입니다. 함정: 전부 '정상'이라고만 해도 Accuracy 99.99%가 나오지만 Recall은 0에 가깝습니다. 해결 3가지 — 과대 표집(Over-Sampling) [렌아스블디]: 소수 클래스를 복제·생성(Random Over Sampling, ADASYN, SMOTE, BLSMOTE, DBSMOTE — 정보 손실은 없지만 과적합 위험) / 과소 표집(Under-Sampling) [랜토이발]: 다수 클래스 일부만 선택(Random Under Sampling, Tomek Links, EasyEnsemble, BalanceCascade — 계산은 빠르지만 데이터 소실 큼) / 임곗값 이동: 학습은 그대로 하고 테스트 단계에서 컷오프를 데이터 많은 쪽으로 이동. 성능 지표는 상황 따라 F1·F0.5·F2·G-Mean·PR AUC 등을 선택합니다." },
"diffusion": {
    guide: {
      hook: "노이즈를 '거꾸로 제거'해 텍스트에서 이미지를 만드는 생성 모델입니다.",
      scene: "Stable Diffusion·DALL-E·Midjourney는 어떻게 그림을 그릴까요. 디퓨전은 이미지에 노이즈를 점점 더하는 과정을 학습해 두고, 생성 시 랜덤 노이즈에서 시작해 그 과정을 거꾸로 반복 제거(denoise)하며 이미지를 만듭니다.",
      why: "순방향/역방향 디퓨전 원리와 CLIP·U-Net 구성요소가 출제 핵심입니다.",
      mechanism: "학습(순방향): 이미지에 점진적으로 노이즈 첨가. 생성(역방향): 랜덤 노이즈→n번 반복 denoise→이미지. 요소: CLIP(텍스트→임베딩 Text Encoder), U-Net+Scheduler(노이즈 예측·제거 핵심), VAE(잠재공간 인코딩/디코딩 — Latent Diffusion으로 연산 절감), 잠재 공간. GAN 대비 안정적·고품질. 텍스트-투-이미지 생성형 AI의 주류.",
      map: [
        { as: "노이즈 점진 첨가", real: "순방향(학습)", note: "" },
        { as: "반복 노이즈 제거", real: "역방향(생성)", note: "denoise" },
        { as: "텍스트→임베딩", real: "CLIP", note: "" },
        { as: "노이즈 예측·제거", real: "U-Net", note: "" },
      ],
      usage: "이미지 생성입니다. 시험은 순/역방향 디퓨전, CLIP·U-Net·VAE입니다.",
      links: [
        { topic: "GAN (Generative Adversarial Network)", how: "이미지 생성 대안으로 대비됩니다." },
        { topic: "VAE (Variational AutoEncoder)", how: "잠재공간 인코딩에 활용됩니다." },
      ],
      exam: "디퓨전은 순방향으로 노이즈 첨가를 학습해 두고 역방향으로 노이즈를 반복 제거해 이미지를 생성하는 모델로, CLIP·U-Net·VAE로 구성되며 텍스트-투-이미지의 주류다.",
    }, image: "/concept/book/diffusion.png", easy: "텍스트 프롬프트에서 실사 이미지를 만들어내는 생성형 AI 모델 — Stable Diffusion·DALL-E·Midjourney의 원리입니다. 동작 직관: 이미지에 노이즈를 점점 첨가하는 순방향 디퓨전을 학습해 두고, 생성할 때는 랜덤 노이즈에서 시작해 그 과정을 거꾸로 반복 취소(denoise)하는 역방향 디퓨전으로 그림을 만들어 냅니다. 기술요소 4개가 시험 포인트 — CLIP(텍스트를 토큰화해 text embedding으로 변환하는 Text Encoder), U-Net+Scheduler(노이즈 제거의 핵심, n번 반복 denoise), VAE(Encoder로 특징 학습·Decoder로 최종 이미지 복원), 순방향/역방향 디퓨전. 흐름: 프롬프트 → CLIP → Text Embeddings → U-Net 반복 → Conditioned Latents → VAE → 이미지." },
"automl": {
    guide: {
      hook: "피처 추출·하이퍼파라미터 튜닝 등 ML의 반복 작업을 자동화합니다.",
      scene: "ML 성능은 피처 엔지니어링과 하이퍼파라미터 설정에 크게 좌우되는데, 이건 지루한 시행착오입니다. AutoML은 이 소모적 과정을 자동화해, 전문가가 아니어도 좋은 모델을 얻게 합니다.",
      why: "3대 프로세스(피처·하이퍼파라미터·NAS)와 NAS 구성이 출제 핵심입니다.",
      mechanism: "프로세스[피하신]: ①피처 엔지니어링(EDA·PCA·k-means·스케일링·BoW로 특징 자동 추출), ②하이퍼파라미터 최적화(Grid·Random·베이지안 최적화), ③신경망 구조 탐색(NAS — 검색 공간·검색 전략·성능 추정). 상용: Google Cloud AutoML, Azure ML, H2O. 효과: 진입장벽↓·생산성↑. 과제: 탐색 비용·해석성. MLOps와 연계.",
      map: [
        { as: "특징 자동 추출", real: "피처 엔지니어링", note: "" },
        { as: "Grid·베이지안", real: "하이퍼파라미터 최적화", note: "" },
        { as: "구조 자동 탐색", real: "NAS", note: "" },
        { as: "진입장벽↓", real: "효과", note: "" },
      ],
      usage: "ML 자동화입니다. 시험은 3대 프로세스, NAS 구성입니다.",
      links: [
        { topic: "MLOps", how: "ML 파이프라인 자동화와 연계됩니다." },
        { topic: "하이퍼파라미터 최적화", how: "AutoML의 핵심 단계입니다." },
      ],
      exam: "AutoML은 피처 엔지니어링·하이퍼파라미터 최적화·신경망 구조 탐색(NAS)을 자동화해 ML 생산성을 높이는 프로세스로, Grid·베이지안 최적화와 NAS가 핵심이다.",
    }, image: "/concept/book/automl.png", easy: "머신러닝에서 가장 소모적이고 반복적인 작업 — 피처 추출과 하이퍼파라미터 설정 — 을 자동화하는 프로세스입니다. 프로세스 [피하신] — ① 피처 엔지니어링(EDA로 원시데이터 해석: PCA, k-means, Min-max 스케일링, BoW) → ② 하이퍼 파라미터 최적화(그리드 탐색·랜덤 탐색·베이지안 최적화) → ③ 신경망 구조 탐색(NAS: 검색 공간·검색 전략·성능 추정 전략). 상용 서비스: Google Cloud AutoML(자동 전이학습·신경 아키텍처 검색), Azure Machine Learning(피처·알고리즘 탐색+튜닝), Amazon SageMaker(튜닝 수행, 자동 다중 모델 시도는 지양). 데이터 과학자 없이도 ML 모델을 만들 수 있게 하는 'ML의 민주화' 기술입니다." },
"ai-bias": {
    guide: {
      hook: "선입견·편향된 데이터로 AI가 공정성에서 벗어나는 경향입니다.",
      scene: "채용·대출 AI가 특정 집단을 차별하면 큰 사회 문제입니다. AI 편향은 학습 데이터나 알고리즘에 스며든 편견으로 AI가 객관성·공정성을 잃는 현상으로, 원인 규명과 완화가 신뢰 AI의 핵심입니다.",
      why: "데이터/프로세스 관점 유형과 XAI 기반 해결이 출제 핵심입니다.",
      mechanism: "유형[인숨데롱고] — 데이터 관점: 인간 편향(원시 데이터에 인간 편견 개입), 숨겨진 편향(발견 어려운 무의도 편향), 표본 편향(샘플링 편중). 프로세스 관점: 롱테일 편향(소수 범주 누락), 고의적 편향(악의적 조작 — 가장 위험). 해결: XAI(설명 가능 AI로 판단 근거 규명), 데이터 다양화·리샘플링, 공정성 지표(Demographic Parity), 편향 감사. AI 윤리·거버넌스 핵심.",
      map: [
        { as: "인간 편견 개입", real: "인간 편향", note: "" },
        { as: "발견 어려운 편향", real: "숨겨진 편향", note: "" },
        { as: "소수 범주 누락", real: "롱테일 편향", note: "" },
        { as: "판단 근거 규명", real: "XAI", note: "해결" },
      ],
      usage: "AI 공정성입니다. 시험은 편향 유형, XAI·공정성 지표입니다.",
      links: [
        { topic: "XAI (eXplainable AI)", how: "편향 규명·완화의 핵심 수단입니다." },
        { topic: "AI TRiSM", how: "AI 신뢰·공정성 관리 프레임과 연계됩니다." },
      ],
      exam: "AI 편향은 편향된 데이터·알고리즘으로 AI가 공정성을 잃는 현상으로, 인간·숨겨진·롱테일·고의적 편향 등이 있으며 XAI·공정성 지표로 규명·완화한다.",
    }, image: "/concept/book/ai-bias.png", easy: "선입견·편견·문화적 영향 등으로 AI가 객관성·공정성에서 벗어나는 경향입니다. 유형 [인숨데롱고] — Data 관점: 인간의 편향(원시 데이터에 인간의 편향이 개입), 숨겨진 편향(절대 발견될 수 없는 의도치 않은 편향 — 가장 찾기 어려움), 데이터 표본 편향(샘플링에 기인) / Process 관점: 롱테일 편향(특정 범주가 훈련 데이터에서 누락), 고의적 편향(해킹으로 의도적으로 편향 — 숨겨져 있어 가장 위험). 해결방안이 XAI(설명 가능한 AI): 기존 AI는 \"95% 확률로 고양이\"라는 결과만 주지만, XAI는 \"털·수염이 있고 ~모양이므로 95% 확률로 고양이\"처럼 결과가 생성되는 과정을 설명해 편향을 발견·교정할 수 있게 합니다." },
"ai-trism": {
    guide: {
      hook: "AI의 신뢰·위험·보안을 관리하는 가트너의 프레임워크입니다.",
      scene: "AI를 도입하면 편향·설명 불가·데이터 유출 같은 관리되지 않는 위험이 따라옵니다. AI TRiSM은 이런 위험을 걸러 관리 가능한 상태로 만드는, 가트너가 제시한 AI 신뢰·위험·보안 관리 체계입니다.",
      why: "4대 Pillar(설명·ModelOps·앱보안·프라이버시)와 위험 관리 구조가 출제 핵심입니다.",
      mechanism: "구조: 관리되지 않는 위험(Unmanaged)→TRiSM으로 걸러 관리(Managed). 4대 Pillar: ①Explainability/Model Monitoring(SHAP·Fairlearn으로 설명·모니터링), ②ModelOps(전사 단일소스, AI 거버넌스·라이프사이클), ③AI Application Security(적대적 공격 방어), ④Privacy(데이터 보호). TRiSM=Trust·Risk·Security Management. AI 거버넌스·신뢰 AI의 관리 체계.",
      map: [
        { as: "SHAP·모니터링", real: "설명 가능성", note: "" },
        { as: "거버넌스·수명주기", real: "ModelOps", note: "" },
        { as: "적대적 공격 방어", real: "앱 보안", note: "" },
        { as: "데이터 보호", real: "프라이버시", note: "" },
      ],
      usage: "AI 거버넌스입니다. 시험은 4대 Pillar, 위험 관리 구조입니다.",
      links: [
        { topic: "AI 편향(AI Bias)", how: "설명 가능성 Pillar로 편향을 관리합니다." },
        { topic: "ISO/IEC 42001 (AI 경영시스템)", how: "AI 거버넌스 표준과 연계됩니다." },
      ],
      exam: "AI TRiSM은 설명 가능성·ModelOps·앱 보안·프라이버시 4대 Pillar로 AI의 신뢰·위험·보안을 관리하는 가트너 프레임워크로, 관리되지 않는 위험을 관리 가능하게 만든다.",
    }, image: "/concept/book/ai-trism.png", easy: "AI의 부적절한 사용을 막기 위해 가트너가 제시한 AI 신뢰성·위험·보안 관리 프레임워크입니다. 개념도 [신위보]: Unmanaged Risks를 AI TRiSM으로 걸러 Managed Risks로 만드는 구조. 4개 Pillar [익모모응프]가 시험 핵심 — Explainability/Model Monitoring(SHAP·MS Fairlearn 툴킷으로 설명가능성 확보), ModelOps(전사 단일소스, AI 거버넌스·라이프사이클 관리 — 지식그래프·규칙·최적화), AI Application Security(적대적 AI 대응 모델 강화, 노이즈 면역력 — 견고성 테스트·모델 검증), Privacy(비식별화가 아니라 합성 데이터·허위 데이터 사용 — AI Reverie). AI 도입 기업의 거버넌스 답안 단골 프레임워크입니다." },
"deepfake": {
    guide: {
      hook: "딥러닝으로 얼굴·음성을 정교하게 합성하는 가짜 콘텐츠 기법입니다.",
      scene: "진짜 같은 가짜 영상이 허위정보·사기·명예훼손에 악용됩니다. 딥페이크는 딥러닝(주로 GAN)으로 원본 영상에 다른 얼굴·음성을 합성해 진위 구별이 어려운 콘텐츠를 만드는 기술입니다.",
      why: "GAN 기반 생성 원리와 탐지 기술(AI·포렌식)이 출제 핵심입니다.",
      mechanism: "원리: GAN — 생성자가 가짜 표본 생성, 판별자가 진짜/가짜 판별·피드백 반복→정교화. 절차: 수집(Source·Target)→생성(Autoencoder·GAN·LSTM)→식별·학습 반복→딥페이크. 탐지: AI 기반(얼굴 특징·영상 품질·생체 신호 이상 분석), 포렌식(메타데이터·압축 흔적), 워터마크·출처 증명(C2PA). 대응: 탐지 기술+법·제도. AI 워터마크와 연계.",
      map: [
        { as: "가짜 생성", real: "GAN 생성자", note: "" },
        { as: "진짜/가짜 판별", real: "판별자", note: "" },
        { as: "생체 신호 분석", real: "AI 탐지", note: "" },
        { as: "출처 증명", real: "워터마크·C2PA", note: "" },
      ],
      usage: "합성 미디어 위협입니다. 시험은 GAN 원리, 탐지 기술입니다.",
      links: [
        { topic: "GAN (Generative Adversarial Network)", how: "딥페이크 생성의 핵심 원리입니다." },
        { topic: "AI 워터마크(AI Watermark)", how: "생성물 식별·대응 수단입니다." },
      ],
      exam: "딥페이크는 GAN 기반 생성·판별 반복으로 얼굴·음성을 합성하는 기법으로, AI 기반·포렌식 탐지와 워터마크·출처 증명으로 대응한다.",
    }, image: "/concept/book/deepfake.png", easy: "딥러닝+Fake의 합성어 — 딥러닝으로 기존 영상에 다른 영상·이미지를 합성해 콘텐츠를 만드는 기법입니다. 원리는 GAN: 잠재 확률 변수 → 생성 AI가 가짜 표본을 만들고, 식별 AI가 진짜/가짜를 판별해 피드백(반복)하며 점점 정교해집니다. 요소기술 절차: 수집(Source·Target 영상) → 생성(GAN 활용 — Autoencoder·GAN·LSTM) → 식별·학습 반복(Real/Fake 구분 피드백) → 딥페이크 생성. 탐지기술: AI 기반(얼굴 특징·영상 품질·생체 신호 분석)과 포렌식 분석(픽셀 레벨·메타데이터). 대응방안 3축 — 기술적(탐지 시스템·라벨링·수정불가 워터마크), 법적(법제화·플랫폼 책임·국제 협력), 사회적(교육·탐지 도구 공개)." },
"prompt-injection": {
    guide: {
      hook: "조작된 입력을 넣어 LLM의 응답·보안 경계를 무너뜨리는 공격입니다.",
      scene: "LLM은 시스템 명령과 사용자 입력을 한 텍스트로 처리합니다. 프롬프트 인젝션은 이 틈을 노려 악성 입력을 주입해 지시를 덮어쓰고, 시스템 프롬프트 탈취·데이터 유출·탈옥을 일으킵니다(OWASP LLM Top 10 1위).",
      why: "명령·데이터 미분리 원인과 직접/간접 인젝션 유형이 출제 핵심입니다.",
      mechanism: "원리: 시스템 프롬프트(명령)에 사용자 입력으로 악성 데이터 주입→LLM이 명령·데이터를 구분 못 해 보안 경계 우회(탈옥). 피해: 프롬프트·컨텍스트 탈취, 원격코드 실행, 허위정보. 유형: 직접(프롬프트에 직접 악성 입력), 간접(외부 문서·웹에 악성 입력을 심어 LLM이 읽게 함). 대응: 입출력 필터링·가드레일, 권한 최소화, 명령/데이터 분리, 인간 승인, 샌드박싱.",
      map: [
        { as: "명령·데이터 미분리", real: "근본 원인", note: "" },
        { as: "직접 악성 입력", real: "직접 인젝션", note: "" },
        { as: "외부 소스에 은닉", real: "간접 인젝션", note: "" },
        { as: "필터·가드레일", real: "대응", note: "" },
      ],
      usage: "LLM 보안입니다. 시험은 OWASP 1위, 직접/간접, 가드레일입니다.",
      links: [
        { topic: "OWASP Top 10 for LLM", how: "인젝션이 LLM 위협 1위입니다." },
        { topic: "MCP 보안(MCP Security)", how: "간접 인젝션 위협을 공유합니다." },
      ],
      exam: "프롬프트 인젝션은 악성 입력으로 LLM의 명령을 덮어써 탈옥·데이터 유출을 일으키는 OWASP LLM 1위 공격으로, 직접/간접 유형이 있고 필터링·가드레일로 대응한다.",
    }, image: "/concept/book/prompt-injection.png", easy: "공격자가 프롬프트에 정교하게 조작된 입력을 주입해 LLM의 응답을 조작하고 민감 데이터를 유출시키는 공격입니다(OWASP LLM Top 10 1위). 공격절차: 시스템 프롬프트(정상 명령)에 사용자 입력으로 악성 데이터 주입 → LLM이 명령어와 데이터를 구분 못 해 보안 경계 우회(탈옥) → 프롬프트·데이터·컨텍스트 탈취, 원격코드 실행, 허위정보 캠페인. 유형 2가지가 시험 포인트: 직접 인젝션(프롬프트에 직접 악성 입력)과 간접 인젝션(외부소스에 악성 입력을 심어 LLM이 읽게 함). 대응: 입력 검증·필터링(Regex, 화이트/블랙리스트, 프롬프트 캡슐화, 의미 분석), 권한·접근 제어(최소권한, RBAC, 신뢰경계), 사용자 확인·모니터링(승인 프로세스, 감사로그, RLHF)." },
"adversarial-attack": {
    guide: {
      hook: "미세한 교란을 넣어 AI 모델의 오분류를 유도하는 공격입니다.",
      scene: "표지판에 스티커 몇 개로 자율주행차가 '정지'를 '속도제한'으로 오인하게 만들 수 있습니다. 적대적 공격은 사람은 못 느끼는 미세한 교란(Adversarial Perturbation)으로 신경망을 속여 오작동을 일으킵니다.",
      why: "4대 공격 유형(오염·회피·전도·추출)이 출제 핵심입니다.",
      mechanism: "유형[오회전추]: Poisoning(오염 — 악의적 학습 데이터 주입으로 모델 손상, '이루다' 사례), Evasion(회피 — 입력에 최소 변조로 오인, 스티커 공격), Inversion(전도 — 다량 쿼리 분석으로 학습 데이터 복원, 얼굴 복원), Model Extraction(추출 — 쿼리로 모델 자체 복제·탈취). 대응: 적대적 학습(Adversarial Training), 입력 검증·전처리, 방어적 증류, 쿼리 제한. AI 보안 핵심 위협.",
      map: [
        { as: "학습 데이터 오염", real: "Poisoning", note: "" },
        { as: "입력 미세 변조", real: "Evasion", note: "" },
        { as: "학습 데이터 복원", real: "Inversion", note: "" },
        { as: "모델 복제·탈취", real: "Extraction", note: "" },
      ],
      usage: "AI 보안입니다. 시험은 4대 공격 유형, 적대적 학습 대응입니다.",
      links: [
        { topic: "AI 레드팀(AI Red Team)", how: "적대적 공격으로 취약점을 탐색합니다." },
        { topic: "AI TRiSM", how: "앱 보안 Pillar로 방어합니다." },
      ],
      exam: "적대적 공격은 미세한 교란으로 신경망 오분류를 유도하는 공격으로, 오염(Poisoning)·회피(Evasion)·전도(Inversion)·추출로 나뉘며 적대적 학습으로 대응한다.",
    }, image: "/concept/book/adversarial-attack.png", easy: "심층신경망 모델에 적대적 교란(Adversarial Perturbation)을 가해 오분류를 일으키는 공격입니다. 공격 기법 [오회전추] — Poisoning(오염·중독공격: 악의적 학습 데이터 주입으로 모델 자체 손상 — MS '테이', '이루다' 사례), Evasion(회피공격: 입력에 최소 변조 — 표지판에 스티커 붙여 자율주행차가 '정지'를 '속도제한'으로 오인), Inversion(전도공격: 다량 쿼리 결과 분석으로 학습 데이터 추출 — 얼굴 이미지 복원), Model extraction(추출공격: 쿼리 반복으로 유사 모델 복제 — 70초 650번 쿼리로 아마존 모델 복제 연구). 방어 기법 [적갠쿼결탐] — 적대적 훈련, Defense-GAN, 쿼리 횟수 제한, 결과값 분석 차단, 적대적 공격 여부 탐지(별도 모델 비교)." },
"model-drift": {
    guide: {
      hook: "세상이 변해 배포된 모델의 성능이 시간이 갈수록 떨어지는 현상입니다.",
      scene: "여름에 잘 맞던 수요예측 모델이 겨울엔 빗나갑니다. 모델은 그대로인데 세상이 변한 것이죠. 모델 드리프트는 이렇게 환경 변화로 배포 모델 성능이 저하되는 현상으로, 지속 모니터링·재학습이 필요합니다.",
      why: "컨셉 드리프트 vs 데이터 드리프트 구분과 대응이 출제 핵심입니다.",
      mechanism: "컨셉 드리프트: 입력과 정답의 '관계'가 변함(정답 개념 자체 변화 — 금융사기 정의가 바뀜). 대응: Online Learning, Feature dropping, 재학습. 데이터 드리프트: 학습 때와 배포 때 입력의 '통계 분포'가 달라짐(계절성). 대응: 드리프트 탐지(PSI·KS 검정), 재학습, 데이터 보정. 모니터링: 성능·분포 지표 추적. MLOps의 핵심 운영 과제.",
      map: [
        { as: "입력-정답 관계 변화", real: "컨셉 드리프트", note: "" },
        { as: "입력 분포 변화", real: "데이터 드리프트", note: "계절성" },
        { as: "PSI·KS 탐지", real: "드리프트 탐지", note: "" },
        { as: "재학습·온라인 학습", real: "대응", note: "" },
      ],
      usage: "ML 운영입니다. 시험은 컨셉/데이터 드리프트 구분, 재학습입니다.",
      links: [
        { topic: "MLOps", how: "드리프트 모니터링·재학습을 자동화합니다." },
        { topic: "데이터 품질(Data Quality)", how: "입력 분포 관리와 연계됩니다." },
      ],
      exam: "모델 드리프트는 환경 변화로 배포 모델 성능이 저하되는 현상으로, 입력-정답 관계가 변하는 컨셉 드리프트와 입력 분포가 변하는 데이터 드리프트로 나뉘며 모니터링·재학습으로 대응한다.",
    }, image: "/concept/book/model-drift.png", easy: "환경이 끊임없이 변하면서 배포된 모델의 성능이 저하되는 현상 — 모델은 그대로인데 세상이 변한 것입니다. 두 종류의 비교가 시험 핵심입니다. 컨셉 드리프트: 입력과 정답 라벨의 '관계성'이 변함(정답의 개념 자체가 변화) — 예: 금융사기 예측모델에서 금융사기의 정의가 바뀐 경우. 해결: Online Learning, Feature dropping. 데이터 드리프트: 훈련 시와 배포 환경의 입력 데이터 '통계적 분포'가 달라짐 — 예: 여름에 잘 맞던 모델이 겨울에 성능 저하(계절성). 해결: 드리프트 모니터링, 모델 재학습·재배포. 한 줄 구분: 컨셉=라벨과의 관계 변화, 데이터=입력 분포 변화. MLOps 2단계의 '드리프트 감지'가 바로 이것입니다." },
"ai-redteam": {
    guide: {
      hook: "AI의 취약점·편향·해악을 찾으려 '일부러 공격'하는 적대적 테스트입니다.",
      scene: "AI를 배포 전에 스스로 공격해 봐야 진짜 위험을 압니다. AI 레드팀은 프롬프트 인젝션·탈옥·편향 유도 등으로 모델을 의도적으로 공격해, 취약점과 사회적 해악을 사전에 발굴하는 탐색적 테스팅입니다.",
      why: "레드팀 vs 블루팀 구조와 산출물(취약점·가드레일·평가지표)이 출제 핵심입니다.",
      mechanism: "구조: 레드팀(공격 — 프롬프트 인젝션·탈옥·데이터 유출·편향·적대적 입력) vs 블루팀(방어·분석). 산출물: 취약점 리포트·리스크 카탈로그, 신규 가드레일·필터 규칙, 신규 평가지표·테스트 기법. 팀: 기술·윤리·법·도메인 전문가+유저(10~100명), 내부·외부·크라우드소싱 혼합. 절차: 범위·환경 정의→공격 수행→분석→가드레일 반영. 안전·정렬(Alignment) 확보 수단.",
      map: [
        { as: "인젝션·탈옥 공격", real: "레드팀", note: "" },
        { as: "방어·분석", real: "블루팀", note: "" },
        { as: "취약점·가드레일", real: "산출물", note: "" },
        { as: "다분야 전문가", real: "팀 구성", note: "" },
      ],
      usage: "AI 안전 검증입니다. 시험은 레드/블루팀, 산출물, 절차입니다.",
      links: [
        { topic: "프롬프트 인젝션(Prompt Injection)", how: "레드팀의 대표 공격 기법입니다." },
        { topic: "AI 시스템 테스트(AI System Test)", how: "AI 특화 테스트와 연계됩니다." },
      ],
      exam: "AI 레드팀은 프롬프트 인젝션·탈옥·편향 유도로 AI를 의도적으로 공격해 취약점·해악을 발굴하는 적대적 테스트로, 레드/블루팀 대결로 가드레일·평가지표를 산출한다.",
    }, image: "/concept/book/ai-redteam.png", easy: "AI 모델·시스템의 취약점, 편향, 사회적 해악, 보안 문제를 찾기 위해 의도적으로 공격을 시도하는 적대적 탐색적 테스팅입니다. 개념도: 레드팀(공격 — 프롬프트 인젝션·탈옥·데이터 유출·편향 유도·적대적 입력)과 블루팀(방어·분석)이 맞붙고, 산출물로 취약점 리포트/리스크 카탈로그·신규 가드레일/필터링 규칙·신규 평가지표/테스트 기법이 나옵니다. 팀: 10~100명 이상, 기술·윤리·법·도메인 전문가와 유저 포함 / 내부·외부·클라우드소싱·전문가·유저 혼합형. 절차: 범위·환경 정의 → 레드팀 구성 → 공격 테스트 → 블루팀 방어/분석 → 리포트·대책. 모델 테스트 기법(인젝션·탈옥·편향 유도·Agent 오동작·포이즈닝)과 시스템 테스트 기법(데이터 유출·가드레일 무력화·보안 경계)이 구분 포인트. 2025.10 ITPE 기출." },
"ai-system-test": {
    guide: {
      hook: "정답 판정 기준(오라클)이 없는 AI를 어떻게 테스트할지 다루는 기법입니다.",
      scene: "AI는 휴리스틱이라 '무엇이 정답인지' 판정하기 어렵습니다(오라클 문제). AI 시스템 테스트는 이 한계를 넘도록 메타모픽·조합·뉴런 커버리지 등 AI 특화 테스트 기법을 제시합니다.",
      why: "오라클 문제와 블랙박스/화이트박스 AI 테스트 기법이 출제 핵심입니다.",
      mechanism: "문제: 테스트 오라클 부재(정답 판정 곤란). 블랙박스: 조합 테스팅(요소 상호작용 결함), 백투백(변형 대상 결과 비교), A/B 테스팅, 변성(메타모픽) 테스팅(입출력 관계로 새 출력 예측 — 오라클 대체). 화이트박스(신경망): 뉴런 커버리지(활성화 비율), 임계·부호·값·경계 커버리지 등. 데이터·강건성·공정성 테스트 병행. ISO 42119-2와 연계.",
      map: [
        { as: "정답 판정 곤란", real: "오라클 문제", note: "" },
        { as: "입출력 관계로 예측", real: "변성(메타모픽)", note: "" },
        { as: "요소 상호작용", real: "조합 테스팅", note: "" },
        { as: "활성화 비율", real: "뉴런 커버리지", note: "" },
      ],
      usage: "AI 품질 검증입니다. 시험은 오라클 문제, 메타모픽·뉴런 커버리지입니다.",
      links: [
        { topic: "ISO/IEC 42119-2", how: "AI 테스트 표준과 연계됩니다." },
        { topic: "AI 레드팀(AI Red Team)", how: "적대적 테스트와 상호 보완합니다." },
      ],
      exam: "AI 시스템 테스트는 오라클 부재 문제에 대응해 변성(메타모픽)·조합·백투백 등 블랙박스와 뉴런 커버리지 화이트박스 기법으로 AI를 검증하는 테스트다.",
    }, image: "/concept/book/ai-system-test.png", easy: "AI 모델은 휴리스틱이라 '정답 판정 기준(테스트 오라클)'이 없다는 문제를 해결하기 위한 테스트입니다. 블랙박스 테스팅 [변액(A)백조] — 조합 테스팅(결함은 2개 이상 요소의 상호작용에서 나온다는 착안, 입력 조합 하위 세트 테스트), 백투백(변형된 둘 이상 대상에 동일 케이스 실행해 결과 비교), A/B 테스팅(테스터에게 노출해 어느 변형이 더 선호되는지), 변성 테스팅(입출력 간 메타모픽 관계로 새 입력의 출력을 예측). 신경망 화이트박스 테스팅 [뉴임부값뿌레안] — 뉴런 커버리지(활성화 뉴런/전체), 임계점, 부호 변경, 값 변경, 부호-부호, 레이어 커버리지, 안전 변경 최대화 테스트. 코드 커버리지의 신경망 버전이라고 이해하면 쉽습니다." },
"foundation-model": {
    guide: {
      hook: "대규모 사전학습 후 여러 분야로 적응시켜 쓰는 다목적 기반 모델입니다.",
      scene: "태스크마다 모델을 새로 만들면 비효율입니다. 파운데이션 모델은 방대한 데이터로 한 번 사전학습해 두고, 파인튜닝·프롬프트로 질의응답·요약·이미지 캡셔닝 등 수많은 태스크에 적응시켜 쓰는 범용 기반 모델입니다(GPT·BERT).",
      why: "3대 특징(창발성·균일화·전이학습)과 자기지도·트랜스포머 기반이 출제 핵심입니다.",
      mechanism: "특징[창균전]: 창발성(Emergence — 규모가 커지며 예상 못한 능력 출현), 균일화(Homogenization — 하나의 모델이 여러 분야로 범용화), 전이학습(사전학습 가중치로 데이터 부족 완화). 구현: 대용량 데이터+자기지도학습+트랜스포머+대규모 컴퓨팅. 적응(Adaptation): 파인튜닝·프롬프트·RAG. 위험: 편향·오류의 하류 전파(단일점). LLM·멀티모달의 상위 개념.",
      map: [
        { as: "예상 못한 능력", real: "창발성", note: "" },
        { as: "여러 분야 범용화", real: "균일화", note: "" },
        { as: "가중치 재사용", real: "전이학습", note: "" },
        { as: "자기지도+트랜스포머", real: "구현 기반", note: "" },
      ],
      usage: "범용 AI 모델입니다. 시험은 3대 특징, 자기지도·전이학습입니다.",
      links: [
        { topic: "LLM (Large Language Model)", how: "언어 특화 파운데이션 모델입니다." },
        { topic: "파인튜닝(Fine-tuning)", how: "다운스트림 적응 수단입니다." },
      ],
      exam: "파운데이션 모델은 대규모 자기지도 사전학습 후 여러 태스크로 적응시키는 범용 기반 모델로, 창발성·균일화·전이학습을 특징으로 하며 GPT·BERT가 대표다.",
    }, image: "/concept/book/foundation-model.png", easy: "대규모 데이터셋으로 사전 학습해 두고, 다른 서비스·분야로 적응(Adaptation)시켜 쓰는 다목적 기반 모델입니다. GPT·BERT가 대표 — 하나의 모델이 질의응답·감성분석·정보추출·이미지 캡셔닝 등 여러 태스크로 뻗어나갑니다. 특징 [창균전] — 창발성(emergence: 스스로 문제 해결 지식을 도출), 균일화(homogenization: 적용 범위가 확대되며 범용화), 전이학습(사전 학습된 가중치로 데이터 부족 완화). 기반기술: 구현(대용량 학습데이터, 자기지도학습, 트랜스포머, 컴퓨팅 성능) + 최적화(지식 증류, Pruning, 양자화, Sparsity). FMOps: 기반모델 → Iteration → 테스트 → 최적화 → 모니터링 → 배포로 운용하는 방법론까지 세트로 기억하세요." },
"multimodal-ai": {
    guide: {
      hook: "이미지·텍스트·음성·영상을 '동시에' 이해하는 AI입니다.",
      scene: "사람은 눈·귀·입을 함께 씁니다. 멀티모달 AI는 여러 양식(모달리티)을 동시에 받아들여 통합 추론해, 단일 입력만 받는 유니모달보다 넓은 문제를 풉니다(사진을 보며 대화하는 GPT-4V).",
      why: "4대 요소기술(언어·음성·시각·통합)과 모달리티 융합이 출제 핵심입니다.",
      mechanism: "요소기술: ①지식/언어(NLP·NLU·NLG, Word Embedding, Seq2Seq), ②음성/청각(STT, Signal Processing — 핫워드·노이즈 필터), ③이미지/시각(Image Scaling·Feature 추출, CNN·ViT), ④멀티모달 통합(공통 임베딩 공간, Cross-Attention으로 양식 정렬·융합). Fusion 시점: Early·Late·Hybrid. LMM(Large Multimodal Model)로 발전. LAM의 기반.",
      map: [
        { as: "NLP·NLU·NLG", real: "언어 지능", note: "" },
        { as: "STT·신호처리", real: "음성 지능", note: "" },
        { as: "CNN·ViT", real: "시각 지능", note: "" },
        { as: "Cross-Attention 융합", real: "통합", note: "" },
      ],
      usage: "멀티모달 AI입니다. 시험은 4대 요소기술, 모달리티 융합입니다.",
      links: [
        { topic: "LAM (Large Action Model)", how: "멀티모달 인지가 행동의 기반입니다." },
        { topic: "트랜스포머(Transformer)", how: "Cross-Attention으로 양식을 융합합니다." },
      ],
      exam: "멀티모달 AI는 텍스트·이미지·음성·영상을 동시에 이해·융합하는 AI로, 언어·음성·시각·통합 요소기술과 Cross-Attention 융합으로 유니모달을 넘어선다.",
    }, image: "/concept/book/multimodal-ai.png", easy: "이미지·텍스트·음성·비디오 등 여러 모달리티(Modality)를 '동시에' 받아들여 사고하는 AI입니다. 사람이 눈·귀·입을 함께 쓰듯, 단일 입력만 받는 Unimodal AI보다 훨씬 넓은 범위의 결과를 냅니다(GPT-4V처럼 사진을 보며 대화). 요소기술 4축이 시험 포인트 — 지식/언어지능(NLP·NLU·NLG, Word Embedding, Seq2Seq), 음성/청각(STT, Signal Processing — hot word 인식·노이즈 필터링), 이미지/시각(Image Scaling·Filtering·Morphology — 얼굴·글자 인식, 이미지 검색), 추론/기계학습(회귀·시계열·클러스터링·연관분석 — KPI 예측, 자동 데이터 생성)." },
"gpai-risk-framework": {
    guide: {
      hook: "범용 AI(AGI)의 위험을 선제적으로 관리하는 종합 지침 체계입니다.",
      scene: "범용 AI는 예상 못한 능력이 출현해 통제가 어려울 수 있습니다. GPAI 위험관리 프레임워크는 이런 범용 AI의 개발·활용 위험을 사전에 식별·관리하는 선제적 지침으로, 인류 우선 원칙 아래 위험을 통제합니다.",
      why: "3원칙(3Ps)과 위험관리 4단계가 출제 핵심입니다.",
      mechanism: "3원칙[인목가]: 인류 우선성(최종 결정은 인간), 목표 지속성(예상 밖 기능이 생겨도 본래 목적 부합), 가치 보존성(사회·윤리·법·문화 가치 준수). 위험관리 4단계: 식별(Known/Unknown 위험 발굴·프로필 작성)→분석(원천·지속성·의도성·영향 범위)→평가(Risk Scoring·3D 위험 매트릭스)→대응(통제·완화·모니터링). AGI 안전·정렬(Alignment) 거버넌스. AI 기본법·거버넌스와 연계.",
      map: [
        { as: "최종 결정은 인간", real: "인류 우선성", note: "" },
        { as: "본래 목적 부합", real: "목표 지속성", note: "" },
        { as: "가치 준수", real: "가치 보존성", note: "" },
        { as: "식별→분석→평가→대응", real: "4단계", note: "" },
      ],
      usage: "AGI 위험 거버넌스입니다. 시험은 3Ps, 위험관리 4단계입니다.",
      links: [
        { topic: "AI 기본법(AI Basic Act)", how: "범용 AI 규제 기반과 연계됩니다." },
        { topic: "AI TRiSM", how: "AI 위험 관리 체계를 공유합니다." },
      ],
      exam: "GPAI 위험관리 프레임워크는 범용 AI의 위험을 인류 우선성·목표 지속성·가치 보존성(3Ps) 원칙 아래 식별·분석·평가·대응 4단계로 관리하는 선제적 거버넌스 체계다.",
    }, image: "/concept/book/gpai-risk-framework.png", easy: "범용 인공지능(AGI)의 개발·활용 과정의 위험을 사전에 식별하고 체계적으로 관리하기 위한 종합적·선제적 지침 체계입니다. 3원칙 '3Ps' [인목가] — 인류 우선성(최종 결정은 인간이), 목표 지속성(예상 밖 기능이 생겨도 본래 목적에 부합), 가치 보존성(사회·윤리·법·문화적 가치 준수). 위험관리 절차 4단계: 위험 식별(Known/Unknown risks 발굴, 위험 프로필 작성) → 위험 분석(원천·지속성·의도성·영향 범위) → 위험 평가(Risk Scoring, 3D 위험 매트릭스, Catastrophic~Minor 4단계 등급화) → 위험 대응(제거·완화·모니터링·수용, 피드백 루프로 갱신). 136회 정보관리 기출." },
"ai-agent": {
    guide: {
      hook: "목표 달성에 필요한 작업을 '스스로 판단해' 수행하는 자율 AI 시스템입니다.",
      scene: "챗봇은 답만 하지만, AI 에이전트는 환경을 인식하고 계획을 세워 도구를 써서 목표를 완수합니다. 사람이 매 단계 지시하지 않아도 스스로 결정·행동하는 자율 시스템입니다.",
      why: "인식-처리-행동 순환 구조와 구성요소(Sensor·Process·KB·Actuator)가 출제 핵심입니다.",
      mechanism: "순환: 환경→인식(Perception/Sensor)→처리·의사결정(Process ↔ Knowledge Base)→행동(Actuator/Action)→환경. 요소: Sensor(카메라·웹검색 등 수집), Process(추론·계획), Knowledge Base(정보·경험), Actuator(실행), 학습 알고리즘. LLM 기반 에이전트: 계획·도구 사용(Tool)·메모리·반성(ReAct). 확장: 멀티에이전트(MAS)·A2A·MCP. 자율성 수준·안전 통제가 과제.",
      map: [
        { as: "환경 인식", real: "Sensor/Perception", note: "" },
        { as: "추론·계획", real: "Process·KB", note: "" },
        { as: "행동 실행", real: "Actuator", note: "" },
        { as: "인식→처리→행동 순환", real: "구조", note: "" },
      ],
      usage: "자율 AI입니다. 시험은 순환 구조, 구성요소, LLM 에이전트입니다.",
      links: [
        { topic: "MCP (Model Context Protocol)", how: "에이전트에 도구·컨텍스트를 연결합니다." },
        { topic: "MAS (Multi-Agent System)", how: "여러 에이전트의 협업 시스템입니다." },
      ],
      exam: "AI 에이전트는 환경을 인식(Sensor)하고 처리·계획(Process·KB)해 행동(Actuator)하는 자율 시스템으로, 인식-처리-행동 순환으로 목표를 스스로 달성한다.",
    }, image: "/concept/book/ai-agent.png", easy: "환경과 상호작용하며 데이터를 수집하고, 사전 결정된 목표 달성에 필요한 작업을 '스스로 결정해' 수행하는 자율 시스템입니다. 개념도: Environment →Perception→ Sensor → Process ↔ Knowledge Base → Actuator →Action→ Environment 순환. 기술요소: Sensor(카메라·마이크·웹 검색 등 수집 인터페이스), Process(처리·의사결정), Knowledge Base(정보·경험 저장), Actuator(행동 실행), 학습 알고리즘, 엣지 컴퓨팅(Tiny ML). 유형 4가지가 시험 포인트 — 단순 반사(규칙 기반), 모델 기반(과거 경험 활용), 목표 기반(목표 달성 최적 행동), 유틸리티 기반(효용성 계산). AI Agent(단순 작업 자동화)에 강화·지도·비지도 학습이 더해지면 Agentic AI(자율적 의사결정)로 진화합니다." },
"a2a": {
    guide: {
      hook: "AI 에이전트끼리 조직·플랫폼 경계를 넘어 통신하는 개방형 프로토콜입니다.",
      scene: "서로 다른 회사가 만든 에이전트들이 협업하려면 공통 통신 규약이 필요합니다. A2A(Agent-to-Agent, 구글 주도)는 에이전트 간에 안전하게 정보를 교환하고 작업을 위임하게 하는 표준입니다.",
      why: "MCP와의 관계(에이전트 사이 vs 에이전트 내부)와 설계 원칙이 출제 핵심입니다.",
      mechanism: "위치: MCP(에이전트↔도구·컨텍스트, 내부), A2A(에이전트↔에이전트, 사이) — 상호 보완. 설계 원칙: 에이전트 능력 수용(메모리·도구·컨텍스트 공유 없이 협업), 기존 표준 기반(HTTP·SSE·JSON-RPC), 보안(엔터프라이즈 인증), 장기 실행 작업 지원. 기능: Agent Card(능력 광고), 작업 위임·상태 추적, 멀티모달 메시지. 멀티에이전트 생태계의 통신 계층.",
      map: [
        { as: "에이전트 사이 통신", real: "A2A", note: "vs MCP(내부)" },
        { as: "HTTP·JSON-RPC", real: "기존 표준 기반", note: "" },
        { as: "능력 광고", real: "Agent Card", note: "" },
        { as: "엔터프라이즈 인증", real: "보안", note: "" },
      ],
      usage: "에이전트 상호운용입니다. 시험은 MCP와의 관계, 설계 원칙입니다.",
      links: [
        { topic: "MCP (Model Context Protocol)", how: "에이전트 내부 도구 연결과 상호 보완합니다." },
        { topic: "MAS (Multi-Agent System)", how: "멀티에이전트 통신 계층을 제공합니다." },
      ],
      exam: "A2A는 서로 다른 플랫폼의 AI 에이전트가 통신·협업하게 하는 개방형 프로토콜로, 에이전트 내부를 잇는 MCP와 달리 에이전트 사이를 이으며 상호 보완한다.",
    }, image: "/concept/book/a2a.png", easy: "AI 에이전트들이 서로 다른 플랫폼·조직 경계를 넘어 통신하고 안전하게 정보를 교환하게 하는 개방형 프로토콜(구글 주도)입니다. MCP와의 관계가 핵심 시험 포인트: MCP는 에이전트에게 도구와 컨텍스트를 연결해 주고(에이전트 내부), A2A는 에이전트끼리 통신하게 합니다(에이전트 사이) — 상호 보완적. 설계 원칙: 에이전트 능력수용(메모리·도구·컨텍스트 공유 없이 협업), 기존 표준 기반(HTTP·SSE·JSON-RPC), 보안 보장(엔터프라이즈 인증), 장기 실행 작업 지원. 주요 기능: 모달리티 지원(오디오·비디오), 기능 검색(JSON 에이전트 카드로 자기 기능 공유), 작업 관리, 협업(컨텍스트·아티팩트 전달), 사용자 경험 협상('파트' 컨텐츠 관리). 2025.07 KPC 기출." },
"vibe-coding": {
    guide: {
      hook: "자연어로 지시하면 AI가 코드를 짜고 개발자는 검토·조정만 하는 방식입니다.",
      scene: "코드를 한 줄씩 타이핑하는 대신, '이런 기능을 만들어 줘'라고 말하면 AI가 코드를 생성합니다. 바이브 코딩은 개발자가 의도만 전하고 AI 생성 결과를 검토·조정하며 반복하는 새로운 개발 방식입니다.",
      why: "자연어→AI→코드 흐름과 검토·조정 반복, 도구가 출제 핵심입니다.",
      mechanism: "흐름: 아이디어→자연어 지시→AI 생성(Cursor·Copilot)→코드→검토·조정 반복. 기반: LLM(GPT·Claude — 자연어↔코드 변환), 의도 파악, 대화형 UI. 도구: Cursor(코드 제안·리팩토링·디버깅), GitHub Copilot(자동완성), Replit. 장점: 생산성·진입장벽↓. 과제: 코드 품질·보안·이해도(생성 코드 맹신 위험), 검토 책임은 개발자. LLM 기반 개발 패러다임 전환.",
      map: [
        { as: "자연어 지시", real: "의도 전달", note: "" },
        { as: "AI 코드 생성", real: "Cursor·Copilot", note: "" },
        { as: "검토·조정 반복", real: "개발자 역할", note: "" },
        { as: "품질·보안 위험", real: "과제", note: "" },
      ],
      usage: "AI 지원 개발입니다. 시험은 흐름, 도구, 검토 책임·과제입니다.",
      links: [
        { topic: "프롬프트 엔지니어링(Prompt Engineering)", how: "의도를 정확히 전달하는 기법입니다." },
        { topic: "LLM (Large Language Model)", how: "자연어를 코드로 변환하는 엔진입니다." },
      ],
      exam: "바이브 코딩은 자연어 지시로 AI가 코드를 생성하고 개발자가 검토·조정을 반복하는 개발 방식으로, LLM 기반이며 생산성 향상과 코드 품질·보안 관리가 과제다.",
    }, image: "/concept/book/vibe-coding.png", easy: "LLM에게 자연어로 지시해 코드를 생성하고, 개발자는 검토·조정만 하는 코딩 기법입니다. 흐름: 아이디어 →자연어→ AI(Cursor·Replit Ghostwriter) →생성→ 코드 → 검토·조정 반복. 기반 기술: LLM(GPT·Claude — 자연어를 코드로 변환하는 핵심 엔진), 명령어 의도 파악, 자연어↔코드 전환 UI. 도구: Cursor(설명하면 코드 제안+리팩토링·디버깅), Replit Ghostwriter(브라우저에서 바로), GitHub Copilot(자동 완성), Framer AI(노코드 웹), FlutterFlow(드래그앤드롭 UI). 장점: 자연어 개발·프로토타이핑·사용자 주도 / 단점: AI 의존성·코드 최적화 문제 → 보완책이 Human in the loop(사람이 의사결정에 개입·통제해 신뢰성·품질·책임 확보). 2025 KPC·ITPE 다수 기출." },
"mcp": {
    guide: {
      hook: "LLM 앱과 외부 데이터·도구를 표준 방식으로 잇는 'AI계 USB-C'입니다.",
      scene: "LLM마다 도구 연동을 제각각 구현하면 파편화됩니다. MCP(Model Context Protocol)는 LLM 앱과 외부 데이터·기능을 표준 규약으로 연결해, 어떤 모델이든 같은 방식으로 도구를 쓰게 합니다.",
      why: "3대 구성(Host·Client·Server)과 맥락 3요소(Resources·Tools·Prompts)가 출제 핵심입니다.",
      mechanism: "구성[호클서]: MCP Host(Claude·IDE 같은 LLM 앱, 여러 서버 조율), MCP Client(서버와 1:1 연결·메시지 직렬화·상태관리), MCP Server(외부 데이터·기능을 모델 맥락으로 제공). 맥락 3요소[리툴프]: Resources(읽기 전용 데이터), Tools(호출 가능 기능), Prompts(지시·템플릿). 전송: JSON-RPC(STDIO·SSE). A2A와 보완(내부 도구 vs 에이전트 간). 개방형 표준(Anthropic 주도).",
      map: [
        { as: "LLM 앱·조율", real: "Host", note: "" },
        { as: "서버 1:1 연결", real: "Client", note: "" },
        { as: "데이터·기능 제공", real: "Server", note: "" },
        { as: "Resources·Tools·Prompts", real: "맥락 3요소", note: "" },
      ],
      usage: "LLM 도구 연동입니다. 시험은 Host·Client·Server, 맥락 3요소입니다.",
      links: [
        { topic: "A2A (Agent-to-Agent)", how: "에이전트 간 통신과 상호 보완합니다." },
        { topic: "MCP 보안(MCP Security)", how: "MCP 생태계의 보안 위협을 다룹니다." },
      ],
      exam: "MCP는 LLM 앱과 외부 데이터·도구를 표준으로 잇는 개방형 프로토콜로, Host·Client·Server 구성과 Resources·Tools·Prompts 맥락 요소로 작동한다.",
    }, image: "/concept/book/mcp.png", easy: "LLM 애플리케이션과 외부 데이터·도구를 표준 방식으로 연결하는 개방형 프로토콜 — 'AI계의 USB-C 포트'입니다. 구성 [호클서]: MCP Host(Claude·IDE 같은 LLM 앱, 여러 서버와 동시 연결·전체 흐름 조율), MCP Client(서버와 1:1 연결, 메시지 직렬화·상태관리), MCP 서버(외부 데이터·기능을 모델이 이해할 맥락으로 제공). 맥락 3요소 [리툴프]: Resources(읽기 전용 데이터), Tools(호출 가능한 기능), Prompts(지시·템플릿). 동작절차 [초기모도응전]: 초기화 → 기능 협상·발견(JSON-RPC로 조회) → 모델의 요청 처리(도구 판단) → 도구호출요청 → 모델응답생성 → 응답전달. 통신은 JSON-RPC 2.0 표준 메시지." },
"mcp-security": {
    guide: {
      hook: "MCP 생태계의 보안 위협과 대응 — 137회 정보관리 기출입니다.",
      scene: "MCP로 외부 도구를 연결하면 편리하지만, 악성 도구·서버가 끼어들 위험도 생깁니다. MCP 보안은 도구·연동·서버·클라이언트 각 층위의 위협을 식별하고 방어하는 방안을 다룹니다.",
      why: "층위별 위협(Tool Poisoning·Rug Pull·Cross-Server)과 대응이 출제 핵심입니다.",
      mechanism: "위협: ①도구 — Tool Poisoning(도구 설명에 악성 명령 은닉), Hidden Risks(숨겨진 명령 실행), Rug Pull(설치 후 악의적 수정). ②연동 — Cross-Server Attack(악성 서버가 정상 도구 하이재킹). ③서버 — 프롬프트 인젝션·민감 데이터 유출. ④클라이언트 — 과잉 권한. 대응: 도구 검증·서명, 권한 최소화, 인간 승인(HITL), 격리·샌드박싱, 서버 신뢰 관리, 감사 로깅.",
      map: [
        { as: "도구 설명에 악성 은닉", real: "Tool Poisoning", note: "" },
        { as: "설치 후 악의적 수정", real: "Rug Pull", note: "" },
        { as: "정상 도구 하이재킹", real: "Cross-Server", note: "" },
        { as: "검증·최소권한·승인", real: "대응", note: "" },
      ],
      usage: "MCP 보안입니다. 시험은 층위별 위협, 대응 방안입니다.",
      links: [
        { topic: "MCP (Model Context Protocol)", how: "보호 대상인 MCP 구조입니다." },
        { topic: "프롬프트 인젝션(Prompt Injection)", how: "서버 측 주요 위협입니다." },
      ],
      exam: "MCP 보안은 Tool Poisoning·Rug Pull·Cross-Server Attack 등 도구·연동·서버 층위 위협에 대응하는 분야로, 도구 검증·최소 권한·인간 승인·샌드박싱으로 방어한다.",
    }, image: "/concept/book/mcp-security.png", easy: "MCP 생태계의 보안취약점과 대응방안 — 137회 정보관리 2교시 기출입니다. 위협: MCP Tool 측면 — Tool Poisoning(도구 설명에 악성 코드를 숨겨 AI가 실행하게 유도), Hidden Risks(무해해 보이지만 숨겨진 명령어 실행), Rug Pulls(설치 후 악의적 수정 — 가짜 업데이트) / 연동 구조 측면 — Cross-Server Attacks(악성 서버가 정상 서버의 도구를 덮어쓰는 신뢰된 도구 하이재킹) / 서버 측면 — 프롬프트 인젝션·민감 데이터 유출 / 클라이언트 측면 — 인증 미흡·무분별한 설치. 대응: 인증(토큰 바인딩 — HTTPS·OAuth 2.1+PKCE, 세션 바인딩), 실행(HITL 사용자 확인, 최소권한·화이트리스트·JIT, 샌드박스 격리), 서버(서버 간 격리, 실행 전 투명성, 권한 최소화), 클라이언트(도구 업데이트 모니터링, 감사로그, 사용자 교육)." },
"synthetic-data": {
    guide: {
      hook: "실데이터와 '통계 속성이 같은' 인공 생성 데이터입니다.",
      scene: "개인정보가 든 실데이터는 규제 때문에 AI 학습에 쓰기 어렵습니다. 합성 데이터는 실데이터의 통계 특성만 본떠 새로 생성해, 개인정보 없이 실데이터처럼 학습에 쓸 수 있게 합니다.",
      why: "종류(완전·부분·복합)와 생성방법(통계·AI 기반), 검증이 출제 핵심입니다.",
      mechanism: "종류[완부복]: 완전 합성(실데이터 0% — 보안 최강), 부분 합성(민감 변수만 대체), 복합 합성(대체 후 추가 변수 도출). 생성: 통계 기반(가우스 혼합·synthpop-CART·베이지안 네트워크), AI 기반(VAE·GAN·확산 모델). 검증: 유용성(모델 성능 유지), 유사성(분포 일치), 프라이버시(재식별 위험). 활용: 규제 산업 AI 학습·데이터 증강·불균형 완화. 프라이버시-유용성 트레이드오프.",
      map: [
        { as: "실데이터 0%", real: "완전 합성", note: "보안 최강" },
        { as: "민감 변수 대체", real: "부분 합성", note: "" },
        { as: "VAE·GAN·확산", real: "AI 기반 생성", note: "" },
        { as: "유용성·유사성·프라이버시", real: "검증", note: "" },
      ],
      usage: "프라이버시 보존 학습입니다. 시험은 3종류, 생성방법, 검증 3축입니다.",
      links: [
        { topic: "클래스 불균형(Class Imbalance)", how: "합성 데이터로 소수 클래스를 증강합니다." },
        { topic: "GAN (Generative Adversarial Network)", how: "AI 기반 합성 생성 기법입니다." },
      ],
      exam: "합성 데이터는 실데이터와 통계 속성이 같은 인공 데이터로, 완전·부분·복합 유형과 통계·AI(VAE·GAN) 생성법이 있으며 유용성·유사성·프라이버시로 검증한다.",
    }, image: "/concept/book/synthetic-data.png", easy: "통계적 방법으로 추정된 모형에서 새로 생성되어, 실제 데이터와 '통계 속성이 동일한' 모의 데이터입니다 — 개인정보 없이 실데이터처럼 쓸 수 있어 규제 산업의 AI 학습에 씁니다. 종류 [완부복] — 완전 합성(실데이터 0%, 보안성 최강), 부분 합성(민감 변수만 대체), 복합 합성(변수 대체 후 추가 대체 변수 도출). 생성방법 [가신베 변간확] — 통계기반(가우스 혼합 모델, synthpop-CART, 베이지안 네트워크) / AI기반(VAE, GANs, 확산 모델). 검증: 유용성(모델 성능·Visual Turing Test / 분포·관계 유사성)과 안전성(생성절차평가·유사성 / 구별·연결·추론 위험도). 생성 과정 [사생안유심활]: 사전준비 → 생성 → 안전성·유용성 검증 → 심의위원회 평가 → 활용·안전한 관리. 참조모델: 구강 이미지 1,000장(충치진단 AI) 등." },
"sovereign-ai": {
    guide: {
      hook: "자국 인프라·데이터·인력으로 AI를 구축하는 '국가 AI 주권' 역량입니다.",
      scene: "외국 빅테크 AI에 의존하면 자국 데이터가 국경을 넘고 문화·언어가 반영되지 않으며 정책 통제가 어렵습니다. 소버린 AI는 자체 인프라·데이터·모델로 AI를 구축해 데이터 주권과 규제 준수를 보장합니다.",
      why: "필요성(데이터 주권·문화 반영)과 기술 3축(데이터·학습배포·거버넌스)이 출제 핵심입니다.",
      mechanism: "필요성: 자국 데이터 국경 관리, 문화·언어 반영, 정책 통제. 구성: 자체 인프라, 인력·네트워크, 독립 운영, 자국어·문화 AI, 정책 준수. 기술 3축: 데이터(자체 클라우드 저장, 암호화·접근제어, 국경 관리), 학습·배포(분산·연합 학습, XAI, 온프레미스), 거버넌스(자국 규제 준수, 감사). 국가 AI 경쟁력·안보 이슈. 데이터 주권·연합학습과 연계.",
      map: [
        { as: "데이터 국경 관리", real: "데이터 주권", note: "" },
        { as: "자국어·문화 반영", real: "독립 AI", note: "" },
        { as: "연합·분산 학습", real: "학습·배포", note: "" },
        { as: "자국 규제 준수", real: "거버넌스", note: "" },
      ],
      usage: "국가 AI 전략입니다. 시험은 필요성, 기술 3축입니다.",
      links: [
        { topic: "연합학습(Federated Learning)", how: "데이터를 국경 내에 두고 학습합니다." },
        { topic: "AI 기본법(AI Basic Act)", how: "자국 AI 규제·거버넌스와 연계됩니다." },
      ],
      exam: "소버린 AI는 자국 인프라·데이터·인력으로 AI를 구축해 데이터 주권·문화 반영·규제 준수를 보장하는 국가 역량으로, 데이터·학습배포·거버넌스 3축으로 실현한다.",
    }, image: "/concept/book/sovereign-ai.png", easy: "자체 인프라·데이터·인력·비즈니스 네트워크로 AI를 구축하는 '국가의 역량' — 데이터 주권과 규제 준수를 보장하기 위한 AI입니다. 왜 필요한가: 외국 빅테크 AI에 의존하면 자국 데이터가 국경을 넘고, 문화·언어가 반영되지 않으며, 정책 통제가 어렵기 때문. 구성: 자체 인프라, 인력·네트워크, 독립 운영, 문화·언어 반영 AI, 자국 정책 준수·맞춤화. 기술요소 3축 — 데이터(자국 내 자체 클라우드 저장, 암호화·접근제어, 데이터 국경 관리), 학습·배포(분산·연합 학습, 설명가능한 AI, 모델 해석 도구), 인프라(고성능 GPU, 슈퍼컴퓨터 센터 고도화). 사례: 한국(자체 클라우드+엔비디아 협력), 프랑스(클라우드 네이티브 AI 슈퍼컴퓨터), 싱가포르(국가 슈퍼컴퓨터센터 GPU 업그레이드)." },
"iso-42001": {
    guide: {
      hook: "AI 경영시스템(AIMS)을 다루는 국제 표준 — 'ISO 27001의 AI판'입니다.",
      scene: "AI를 조직 차원에서 책임 있게 관리하려면 체계가 필요합니다. ISO/IEC 42001은 AI 경영시스템(AIMS)의 수립·구현·유지·개선 요구사항을 정의한 국제 표준으로, 보안의 27001처럼 인증받을 수 있습니다.",
      why: "PDCA 매핑(4~10장)과 AI 위험평가·영향평가가 출제 핵심입니다.",
      mechanism: "구성(PDCA): Plan(4.조직 상황, 5.리더십, 6.기획 — 리스크·AI 목표), Do(7.지원 — 자원·역량·문서, 8.운용 — 운용기획·AI 위험평가·위험처리·AI 시스템 영향평가), Check(9.성과평가 — 모니터링·내부심사·경영검토), Act(10.개선 — 부적합·시정·지속 개선). 특징: AI 위험평가·영향평가(개인·사회 영향) 요구. 27001·9001과 통합 가능. 인증 가능한 AI 거버넌스 표준.",
      map: [
        { as: "리더십·기획", real: "Plan(4~6)", note: "" },
        { as: "위험평가·영향평가", real: "Do(8.운용)", note: "" },
        { as: "모니터링·심사", real: "Check(9)", note: "" },
        { as: "시정·개선", real: "Act(10)", note: "" },
      ],
      usage: "AI 거버넌스 인증입니다. 시험은 PDCA 매핑, AI 위험·영향평가입니다.",
      links: [
        { topic: "ISO/IEC 25059 (AI 품질 모델)", how: "AI 품질 특성 표준과 연계됩니다." },
        { topic: "AI TRiSM", how: "AI 위험·거버넌스 관리를 공유합니다." },
      ],
      exam: "ISO/IEC 42001은 AI 경영시스템(AIMS)의 요구사항을 PDCA(4~10장)로 정의한 국제 표준으로, AI 위험평가·영향평가를 포함하며 인증 가능한 AI 거버넌스 표준이다.",
    }, image: "/concept/book/iso-42001.png", easy: "조직의 인공지능 경영시스템(AIMS) 수립·구현·유지·개선 요구사항을 담은 AI 국제 경영시스템 표준입니다 — ISO 27001(보안)의 AI 버전이라고 보면 됩니다. 표준 구성 [조리기지운성개]를 PDCA로 매핑하는 것이 시험 핵심: Plan(4.조직의 상황, 5.리더십, 6.기획 — 리스크 관리·AI 목표) / Do(7.지원 — 자원·역량·문서화, 8.운용 — 운용기획·AI 위험평가·AI 위험 처리·AI 시스템 영향평가) / Check(9.성과평가 — 모니터링·내부심사·경영검토) / Act(10.개선). 요구사항 [목리윤투책] — 목적과 범위 설정, 리스크 관리, 윤리 준수, 투명성, 책임성. 8장의 AI 위험평가·영향평가가 일반 경영시스템과의 차별점입니다." },
"ax": {
    guide: {
      hook: "AI를 전사적으로 적용해 사업 자체를 바꾸는 'DX의 다음 단계'입니다.",
      scene: "디지털 전환(DX)이 프로세스를 디지털화했다면, AX(AI Transformation)는 AI를 전사에 적용해 사업 모델·프로세스·제품을 근본적으로 바꾸는 전환입니다. AI를 도구가 아닌 핵심 동력으로 삼습니다.",
      why: "DX와의 차이(전환 단계)와 추진 절차·기술요소가 출제 핵심입니다.",
      mechanism: "절차[전파혁교커업]: ①AI 전략 수립(고유 데이터·자동화 유망 프로세스·리소스 식별)→②파일럿 실행(신뢰·모멘텀)→③사내 AI 혁신팀 구축(장기적 내부 육성)→④AI 교육→⑤내외부 커뮤니케이션→⑥전략 업데이트. 기술요소[서인거]: AI 서비스(NLP·영상), AI 인프라(데이터·컴퓨팅), AI 거버넌스. DX 기반 위에 AI로 사업 재창조. 데이터·인재·문화가 성공 요인.",
      map: [
        { as: "AI로 사업 재창조", real: "vs DX", note: "다음 단계" },
        { as: "고유 데이터·프로세스 식별", real: "전략 수립", note: "" },
        { as: "파일럿·혁신팀", real: "실행", note: "" },
        { as: "서비스·인프라·거버넌스", real: "기술요소", note: "" },
      ],
      usage: "AI 기반 사업 전환입니다. 시험은 DX 차이, 추진 절차입니다.",
      links: [
        { topic: "디지털 전환(Digital Transformation)", how: "AX의 이전 단계입니다." },
        { topic: "AI 에이전트(AI Agent)", how: "업무 자동화의 핵심 수단입니다." },
      ],
      exam: "AX는 AI를 전사에 적용해 사업 모델·프로세스·제품을 근본적으로 바꾸는 DX의 다음 단계로, 전략 수립·파일럿·혁신팀·교육 절차와 서비스·인프라·거버넌스 요소로 추진한다.",
    }, image: "/concept/book/ax.png", easy: "기업이 기존 사업 모델·프로세스를 버리고 AI를 전사적으로 적용해 사업 모델·프로세스·제품·서비스의 변화를 추구하는 전환 과정 — DX(디지털 전환)의 다음 단계입니다. 절차 [전파혁교커업] — ① AI 전략 수립(가치 있는 고유 데이터 소스·자동화 효율 좋은 프로세스·내부 리소스 식별) → ② 파일럿 프로젝트 실행(신뢰와 모멘텀 생성) → ③ 사내 AI 혁신팀 구축(아웃소싱보다 장기적으론 내부 육성) → ④ AI 교육 제공 → ⑤ 내외부 커뮤니케이션 → ⑥ AI 전략 업데이트. 기술요소 [서인거] — AI 서비스(NLP·영상 분석·ML·자율주행), AI 인프라(GPU/TPU·분산 컴퓨팅·개발/배포 플랫폼), AI 거버넌스(데이터·모델 거버넌스, 규정 준수). 기대 효과: 가치 창출, 효율성·생산성 향상, 신규 사업 진출." },
"agentic-ai": {
    guide: {
      hook: "메모리·계획·도구 활용을 결합해 목표를 '자율 수행'하는 AI입니다.",
      scene: "단순 AI 에이전트가 정해진 작업을 자동화한다면, 에이전틱 AI는 스스로 목표를 세우고 계획·도구 사용·학습까지 자율적으로 결정합니다. 사람의 개입 없이 복잡한 목표를 완수하는 한 단계 진화한 AI입니다.",
      why: "AI Agent와의 차이(자율 의사결정)와 인식-추론-행동-학습 순환이 출제 핵심입니다.",
      mechanism: "프로세스[인추행학]: 인식(Perceive — 데이터 수집·특징 추출)→추론(Reason — LLM·RAG 기반)→행동(Act — 목표 설정·자율 계획·API 통합)→학습(Learn — 피드백 루프로 개선, 데이터 플라이휠). 구성: LLM 두뇌+메모리+도구+환경 감지+가드레일. vs AI Agent(단순 자동화)보다 자율 의사결정·목표 지향. 멀티에이전트로 확장. 안전·통제·정렬이 핵심 과제.",
      map: [
        { as: "데이터 수집·특징 추출", real: "인식(Perceive)", note: "" },
        { as: "LLM·RAG 추론", real: "추론(Reason)", note: "" },
        { as: "자율 계획·API", real: "행동(Act)", note: "" },
        { as: "피드백 개선", real: "학습(Learn)", note: "플라이휠" },
      ],
      usage: "자율 AI입니다. 시험은 AI Agent 차이, 인식-추론-행동-학습 순환입니다.",
      links: [
        { topic: "AI 에이전트(AI Agent)", how: "단순 자동화 대비 자율 의사결정으로 진화합니다." },
        { topic: "MAS (Multi-Agent System)", how: "멀티에이전트로 확장됩니다." },
      ],
      exam: "에이전틱 AI는 메모리·계획·도구·가드레일을 결합해 목표를 자율 수행하는 AI로, 인식-추론-행동-학습 순환으로 동작하며 단순 AI Agent보다 자율 의사결정에 나아간다.",
    }, image: "/concept/book/agentic-ai.png", easy: "메모리·계획·환경 감지·도구 활용·안전 지침 준수를 결합해, 목표 달성 작업을 스스로 수행하는 AI입니다. AI Agent가 '단순 작업 자동화'라면 에이전틱 AI는 '자율적 의사결정'까지 갑니다. 프로세스 [인추행학]이 시험 핵심 — 인식(Perceive: 데이터 수집·특징 추출) → 추론(Reason: LLM 기반 추론·RAG 활용) → 행동(Act: 목표 설정·자율 계획·API 통합) → 학습(Learn: 피드백 루프로 모델 개선 — 데이터 플라이휠). 개념도: USER ↔ AI Agent(Database·Vector DB → LLM → Action) + Data Flywheel → Model Customization. 사례: 공급망 최적화·제조 자동화, 사이버보안 분석·금융 거래 감시, 의료진 보조·원격 모니터링, 개인화 고객 서비스·재고 예측." },
"data-quality-v3": {
    guide: {
      hook: "AI 학습용 데이터의 품질을 조직·절차·기준으로 관리하는 NIA 가이드입니다.",
      scene: "'쓰레기가 들어가면 쓰레기가 나온다' — AI 성능은 학습 데이터 품질에 달렸습니다. 이 가이드(NIA)는 AI 학습용 데이터의 품질을 확보할 조직·절차·품질기준·관리 활동을 정의하고 점검·조치하게 합니다.",
      why: "사업 3단계와 품질관리 프로세스 흐름, 데이터 용어 체계가 출제 핵심입니다.",
      mechanism: "사업 3단계: 100.준비·계획 / 200.구축 / 300.운영·활용. 프로세스[구획정가학운]: 110.구축계획(지표·목표)→210.획득/수집(원시데이터)→220.정제(중복제거·비식별화 → 원천데이터)→230.가공(라벨링데이터)→240.학습(학습데이터셋·성능 보정)→310.운영·활용(AI Hub 개방). 품질기준: 구문·의미 정확성·다양성·유효성. 원시→원천→라벨링 데이터 용어. 생성형은 v2 특화판.",
      map: [
        { as: "준비·구축·운영", real: "사업 3단계", note: "" },
        { as: "원시→원천→라벨링", real: "데이터 용어", note: "" },
        { as: "정제·비식별화", real: "220 정제", note: "" },
        { as: "정확성·다양성", real: "품질기준", note: "" },
      ],
      usage: "AI 데이터 품질입니다. 시험은 3단계, 프로세스, 데이터 용어 체계입니다.",
      links: [
        { topic: "생성형 AI 데이터 품질관리 가이드", how: "생성형 특화판(v2)과 대비됩니다." },
        { topic: "AI Ready 데이터(AI-Ready Data)", how: "데이터 용어 체계를 공유합니다." },
      ],
      exam: "AI 학습용 데이터 품질관리 가이드(NIA)는 준비·구축·운영 3단계와 획득→정제→가공→학습 프로세스로 데이터 품질을 관리하며, 원시→원천→라벨링 용어 체계를 정의한다.",
    }, image: "/concept/book/data-quality-v3.png", easy: "인공지능 학습용 데이터의 품질 확보에 필요한 조직·절차·품질기준·품질관리 활동을 정의하고 점검·조치하는 가이드라인(NIA)입니다. 사업 3단계: 100.준비·계획 / 200.구축 / 300.운영·활용. 품질관리 프로세스 [구획정가학운] — 110.구축계획 수립(품질지표·목표·점검 기준) → 210.데이터 획득/수집(원시데이터) → 220.데이터 정제(중복제거·비식별화 → 원천데이터) → 230.데이터 가공(라벨링데이터 부여) → 240.데이터 학습(학습데이터셋 생성·모델 성능 보정) → 310.데이터 운영·활용(AI Hub 개방·유지보수). 품질관리 지표 [준완유기기통구의알유] — 구축공정(준비성·완전성·유용성), 데이터 적합성(기준·기술 적합성, 통계적 다양성), 데이터 정확성(구문·의미 정확성), 학습모델(알고리즘 적정성·유효성)." },
"public-genai-guideline": {
    guide: {
      hook: "공공부문의 초거대 AI 도입 절차를 제시하는 가이드라인(2.0)입니다.",
      scene: "공공기관이 초거대 AI를 도입하려면 보안 등급·데이터 학습 방식·조달을 어떻게 할지 기준이 필요합니다. 이 가이드라인(2.0, 2025.04)은 공공 AI 도입 절차와 성과 관리 방법을 체계적으로 제시합니다.",
      why: "공공AI 3대 목표와 도입 절차, 데이터 보안 3등급이 출제 핵심입니다.",
      mechanism: "3대 목표: 대국민 서비스 혁신, 사회문제 해결, 일하는 방식 효율화. 절차[보클데서유성]: 데이터 보안 등급(기밀 Classified·민감 Sensitive·공개 Open 3등급)→클라우드 구성→데이터 학습 방식(파운데이션·파인튜닝·사후학습·RAG 구분)→서비스 도입(디지털서비스 구매/조달)→유지보수·운영(Ops)→성과 관리. 성과지표[투과산결]: 투입·과정·산출·결과. 공공 특화 보안·조달 반영.",
      map: [
        { as: "서비스·사회·효율", real: "3대 목표", note: "" },
        { as: "기밀·민감·공개", real: "데이터 보안 3등급", note: "" },
        { as: "파운데이션·RAG 구분", real: "학습 방식", note: "" },
        { as: "투입·과정·산출·결과", real: "성과지표", note: "" },
      ],
      usage: "공공 AI 도입입니다. 시험은 3대 목표, 도입 절차, 보안 3등급입니다.",
      links: [
        { topic: "소버린 AI(Sovereign AI)", how: "공공·국가 AI 자립과 맥을 같이합니다." },
        { topic: "RAG (Retrieval-Augmented Generation)", how: "공공 데이터 학습 방식의 하나입니다." },
      ],
      exam: "공공부문 초거대 AI 도입 가이드라인(2.0)은 서비스 혁신·사회문제 해결·효율화 3대 목표 아래 보안 등급→클라우드→학습 방식→도입→운영→성과 절차로 공공 AI 도입을 안내한다.",
    }, image: "/concept/book/public-genai-guideline.png", easy: "공공부문이 초거대AI를 도입하기 위한 절차와 내용의 가이드라인(2.0, 2025.04)입니다. 공공AI 3대 전략 목표: 대국민 서비스 혁신, 사회문제 해결, 일하는 방식 효율화. 도입절차 [보클데서유성] — 데이터 보안 등급(기밀 Classified·민감 Sensitive·공개 Open 3등급 분류) → 클라우드 구성 방안 → 데이터 학습 방식(파운데이션·파인튜닝·사후 학습·RAG 기반 구분) → 서비스 도입 방식(디지털 서비스 구매 또는 조달 용역발주) → 유지보수·운영(Ops) → 성과 관리. 성과 지표 [투과산결] — 투입지표(자원량) → 과정지표(중간 산출물) → 산출지표(1차 산출물) → 결과지표(궁극적 효과). AI 기능분류 [지자대모]: 지능형 정보처리·자동화 업무 지원·대화형 서비스·모니터링/알람." },
"ai-trust-cert": {
    guide: {
      hook: "AI가 지켜야 할 신뢰성 가치 기준 — 편향·위험을 해결하는 속성입니다.",
      scene: "AI가 널리 쓰이려면 '믿을 수 있어야' 합니다. 신뢰할 수 있는 AI는 데이터·모델의 편향과 내재 위험을 해결하고 확산 부작용을 막기 위해 안전성·설명 가능성·투명성 등 준수해야 할 가치 기준을 제시합니다.",
      why: "핵심 5속성(안전·설명·투명·견고·공평)과 신뢰성 요건이 출제 핵심입니다.",
      mechanism: "핵심 속성[안설투견공]: 안전성(위험 완화·제거), 설명 가능성(판단 근거 제시), 투명성(결정 이유·근거 추적, 목적·한계 전달), 견고성(외부 간섭·극한 환경서 성능 유지), 공평성(차별·편향 없음). 신뢰성 요건[존책안투]: 다양성 존중(공정·정당성), 책임성(책무·감사·답변 가능성), 안전성(통제·보안·강건성), 투명성. XAI·공정성 지표로 구현. AI 윤리·거버넌스·인증의 근거.",
      map: [
        { as: "위험 완화·제거", real: "안전성", note: "" },
        { as: "판단 근거 제시", real: "설명 가능성", note: "" },
        { as: "극한서 성능 유지", real: "견고성", note: "" },
        { as: "차별·편향 없음", real: "공평성", note: "" },
      ],
      usage: "신뢰 AI 기준입니다. 시험은 5대 속성, 신뢰성 요건입니다.",
      links: [
        { topic: "XAI (eXplainable AI)", how: "설명 가능성·투명성을 구현합니다." },
        { topic: "AI TRiSM", how: "신뢰·위험 관리 프레임과 연계됩니다." },
      ],
      exam: "신뢰할 수 있는 AI는 편향·위험을 해결하는 가치 기준으로, 안전성·설명 가능성·투명성·견고성·공평성 5대 속성과 책임성·다양성 존중 요건을 통해 확보한다.",
    }, image: "/concept/book/ai-trust-cert.png", easy: "데이터·모델의 편향과 AI에 내재한 위험·한계를 해결하고, 확산 과정의 부작용을 방지하기 위해 준수해야 하는 가치 기준입니다. 핵심 속성 [안설투견공] — 안전성(위험 가능성이 완화·제거된 상태), 설명가능성(판단 근거·과정을 이해할 수 있게 제시), 투명성(결정 이유 설명·근거 추적 가능, 목적·한계 정보 전달), 견고성(외부 간섭·극한 환경에서도 성능 유지), 공평성(특정 그룹 차별·편향 없음). 신뢰성 요건 [존책안투] — 다양성 존중(공정성·정당성), 책임성(책무성·감사가능성·답변가능성), 안전성(통제가능성·보안성·강건성·성능보장성), 투명성(설명·추적·이해·해석가능성). 관련 표준: ISO/IEC TR 24028(신뢰성 개요), 22989(개념·용어), 23053(AI·ML 프레임워크), 23894(위험 관리), 42001(경영시스템)." },
"ai-ready-data": {
    guide: {
      hook: "AI 학습에 '바로 쓸 수 있게' 준비·구조화된 데이터입니다.",
      scene: "현실에서 수집한 원시 데이터는 그대로 학습에 못 씁니다. AI Ready 데이터는 정제·라벨링을 거쳐 AI·ML의 훈련·검증·테스트에 즉시 투입 가능하도록 준비·구조화된 데이터를 뜻합니다.",
      why: "데이터 용어 체계(원시→원천→라벨링)와 처리 절차가 출제 핵심입니다.",
      mechanism: "용어: 원시데이터(Raw — 획득 단계 수집)→정제→원천데이터(Source — 전처리 완료, 라벨링 전)→라벨링→라벨링데이터(참값 Ground Truth+속성+어노테이션). 절차: 획득(법적 제약 없이 원시 확보)→정제(형식 변환·중복 제거·개인정보 비식별화)→라벨링(목적 부합 정보 부착). 요건: 정확성·일관성·완전성·적합성. 학습데이터 품질관리와 직결. AI 성능의 토대.",
      map: [
        { as: "수집 단계 데이터", real: "원시(Raw)", note: "" },
        { as: "정제 완료·라벨 전", real: "원천(Source)", note: "" },
        { as: "참값+어노테이션", real: "라벨링데이터", note: "" },
        { as: "획득→정제→라벨링", real: "절차", note: "" },
      ],
      usage: "AI 학습 데이터 준비입니다. 시험은 용어 체계, 처리 절차입니다.",
      links: [
        { topic: "AI 학습용 데이터 품질관리 가이드 v3.1", how: "데이터 품질 관리 절차를 공유합니다." },
        { topic: "데이터 라벨링(Data Labeling)", how: "라벨링데이터 생성 단계입니다." },
      ],
      exam: "AI Ready 데이터는 AI 학습에 즉시 쓸 수 있게 준비된 데이터로, 원시→(정제)→원천→(라벨링)→라벨링데이터 체계와 획득·정제·라벨링 절차를 거친다.",
    }, image: "/concept/book/ai-ready-data.png", easy: "AI·ML 모델의 훈련·검증·테스트에 '바로 사용할 수 있도록' 준비·구조화·정리된 데이터입니다. 용어 체계가 시험 핵심 — 원시데이터(Raw Data: 획득 단계에서 수집·생성한 데이터) →정제→ 원천데이터(Source Data: 전처리 완료, 라벨링 전) →라벨링→ 라벨링데이터(참값 Ground Truth + 속성 + 어노테이션의 집합). 데이터 획득(현실 세계에서 법률적 제약 없이 원시데이터 확보) → 데이터 정제(형식 변환·중복 제거·개인정보 비식별화) → 데이터 라벨링(목적에 부합하는 정보 부착). 획득·정제 절차: 데이터 정의 → 특성 분석 → 획득 절차·항목 → 정제 방식 → 도구 → 고려사항(법·제도 준수, 다양성 확보, 편향 방지·윤리). 2026.02 ITPE FR 기출." },
"ai-basic-law": {
    guide: {
      hook: "AI의 발전과 신뢰 기반 조성을 규정한 법 — 세계 두 번째 AI 종합법입니다.",
      scene: "AI 산업 육성과 위험 규제를 함께 다룰 법적 틀이 필요합니다. AI 기본법(2026.1 시행)은 인공지능의 건전한 발전과 신뢰 기반 조성에 필요한 기본 사항을 규정한, EU에 이은 세계 두 번째 AI 종합법입니다.",
      why: "3대 축(추진체계·산업육성·안전신뢰)과 고영향 AI 정의가 출제 핵심입니다.",
      mechanism: "3대 축: ①추진체계(기본계획 3년마다·제6조, 국가인공지능위원회·제7조, AI안전연구소·제12조), ②산업 육성(R&D 지원·제13조, 표준화·제14조, 집적단지·데이터센터), ③안전·신뢰(고영향·생성형 AI 정의, 자율 검·인증, 영향평가). 핵심 정의(제2조): 고영향 AI(생명·신체·기본권에 중대 영향 우려), 생성형 AI, AI사업자. 고영향·생성형에 투명성·안전 의무. 육성+규제 병행.",
      map: [
        { as: "위원회·안전연구소", real: "추진체계", note: "" },
        { as: "R&D·표준·집적단지", real: "산업 육성", note: "" },
        { as: "고영향·생성형 정의", real: "안전·신뢰", note: "" },
        { as: "생명·기본권 중대 영향", real: "고영향 AI", note: "" },
      ],
      usage: "AI 규제·육성 법제입니다. 시험은 3대 축, 고영향 AI 정의입니다.",
      links: [
        { topic: "고영향 AI(High-Impact AI)", how: "법의 핵심 규제 대상 정의입니다." },
        { topic: "ISO/IEC 42001 (AI 경영시스템)", how: "AI 거버넌스 표준과 연계됩니다." },
      ],
      exam: "AI 기본법(2026.1 시행)은 세계 두 번째 AI 종합법으로, 추진체계·산업육성·안전신뢰 3대 축과 고영향·생성형 AI 정의를 통해 AI 육성과 규제를 병행한다.",
    }, image: "/concept/book/ai-basic-law.png", easy: "인공지능의 건전한 발전과 신뢰기반 조성에 필요한 기본 사항을 규정한 법입니다(2026.1 시행, 세계 두 번째 AI 종합법). 3대 축: 추진체계(기본계획 3년마다 수립 제6조, 국가인공지능위원회 제7조, 인공지능안전연구소 제12조), 산업 육성(연구개발 지원 제13조, 표준화 제14조, 집적단지 제23조, 데이터센터 제25조), 안전·신뢰 기반 조성(고영향·생성형 AI 정의, 자율 검·인증 및 영향평가 지원). 핵심 정의(제2조): 고영향 인공지능(생명·신체 안전·기본권에 중대한 영향 우려가 있는 AI)·생성형 인공지능·인공지능사업자. 의무 조항이 시험 포인트 — 투명성 확보 의무(제31조: AI 생성물 사전 고지·표시), 안정성 확보 의무(제32조: 기준 이상 연산량 시 위험 식별·평가·완화), 고영향 AI 사업자 책무(제34조), 영향평가(제35조), 과태료(제43조: 3천만원 이하)." },
"ai-cost-estimation": {
    guide: {
      hook: "AI 서비스 도입 사업비를 '이용료+커스터마이징+구축'으로 산정합니다.",
      scene: "AI 사업 예산을 어떻게 잡을까요. AI 도입비 산정은 서비스 이용료·커스터마이징 작업비·구축 개발비를 사업 유형별로 계산해, AI 서비스 도입 사업비를 체계적으로 산정하는 방식입니다.",
      why: "산정 공식(도입비=이+커+구)과 사업유형별 산정이 출제 핵심입니다.",
      mechanism: "공식[이커구]: 도입비 = 서비스 이용료 + 커스터마이징 작업비 + 구축·개발비. 사업유형[단커시]: 단순 도입형(구독료만), 커스터마이징형 3종(기본·AI 데이터 구축·AI 모델 최적화·파인튜닝), 시스템통합형(커스터마이징+SW개발·SI). 절차[사서커구사]: 사전 준비(대상·유형 결정)→이용료 계산(기간·규모·단가)→커스터마이징비→구축비→사업비 합산. SW사업 대가 산정과 연계.",
      map: [
        { as: "이용료+커스터마이징+구축", real: "산정 공식", note: "" },
        { as: "구독료만", real: "단순 도입형", note: "" },
        { as: "데이터·모델 작업", real: "커스터마이징형", note: "" },
        { as: "커스터마이징+SI", real: "시스템통합형", note: "" },
      ],
      usage: "AI 사업비 산정입니다. 시험은 산정 공식, 사업유형별 산정입니다.",
      links: [
        { topic: "SW 사업대가 ('25년 개정판)", how: "SW 대가 산정 체계와 연계됩니다." },
        { topic: "AX (AI Transformation)", how: "AI 도입 사업의 비용 산정 근거입니다." },
      ],
      exam: "AI 도입비 산정은 서비스 이용료+커스터마이징 작업비+구축·개발비 공식으로, 단순 도입·커스터마이징·시스템통합 유형별로 AI 서비스 사업비를 산정하는 방식이다.",
    }, image: "/concept/book/ai-cost-estimation.png", easy: "AI 서비스 도입 사업비를 산정하는 방식 — 공식은 [도입비 = 이커구]: 서비스 이용료 + 커스터마이징 작업비용 + 구축·개발 비용입니다. 사업유형 [단기데모시] — 단순 AI 서비스 도입형(개발 없이 구독료만), 커스터마이징형 3종(기본: 최소한의 작업 / AI 데이터 구축: 데이터 신규·재구축 / AI 모델: 모델 최적화·파인튜닝·알고리즘 개발), 시스템통합형(커스터마이징+SW 개발·시스템통합 병행). 상세절차 [사서커구사] — ① 사전 준비(대상 서비스 식별·유형 결정) → ② 서비스 이용료 계산(도입기간·사용 규모·단위 이용료) → ③ 커스터마이징 작업비용 계산(요구분석·데이터 구축·모델 구현·검증) → ④ 구축·개발 비용 계산(기능점수 또는 투입공수 방식) → ⑤ AI 서비스 도입 사업비 산정." },
"distance-formula": {
    guide: {
      hook: "두 점이 '얼마나 떨어졌는지'를 재는 거리 공식들 — 유사도·군집의 기반입니다.",
      scene: "KNN·K-means·유사도는 모두 거리 계산이 핵심입니다. 직선으로 재는 유클리드, 격자로 재는 맨해튼, 최대 축 차이인 체비쇼프 등 상황에 맞는 거리를 씁니다.",
      why: "주요 거리(유클리드·맨해튼·민코프스키·코사인)의 정의·차이가 출제 핵심입니다.",
      mechanism: "유클리드(L2 — 직선 거리, √Σ(xi−yi)²), 맨해튼(L1 — 격자·절대차 합 Σ|xi−yi|), 민코프스키(Lp — 유클리드·맨해튼 일반화, p로 조절), 체비쇼프(L∞ — 최대 축 차이), 코사인(각도 — 크기 무관, 유사도), 마할라노비스(공분산 반영·상관 고려), 해밍(비트·범주 차이), 자카드(집합). 선택: 데이터 유형·차원·스케일. 정규화 필요(스케일 차이). 유사도와 상호 변환. KNN·군집·이상탐지·추천의 기반.",
      map: [
        { as: "직선 거리", real: "유클리드(L2)", note: "" },
        { as: "격자·절대차 합", real: "맨해튼(L1)", note: "" },
        { as: "Lp 일반화", real: "민코프스키", note: "" },
        { as: "공분산 반영", real: "마할라노비스", note: "" },
      ],
      usage: "KNN·군집·유사도입니다. 시험은 유클리드·맨해튼·민코프스키 정의·차이입니다.",
      links: [
        { topic: "유사도(Similarity)", how: "거리와 짝을 이룹니다." },
        { topic: "K-NN(Nearest Neighbor) Classification", how: "거리로 이웃을 판정합니다." },
      ],
      exam: "거리 공식은 두 점의 떨어진 정도를 재며 직선의 유클리드(L2)·격자의 맨해튼(L1)·일반화한 민코프스키(Lp)·공분산 반영 마할라노비스 등이 있어 KNN·군집의 기반이 된다.",
    }, image: "/concept/book/distance-formula.png", easy:"두 데이터 간의 차이를 재는 자 — 거리가 가까울수록 유사한 데이터로 판별합니다. 유형 5가지: 유클리디안 거리(L2, 두 점 사이 직선 거리 √Σ(p−q)²), 맨하탄 거리(L1, 격자 도시처럼 수평·수직으로만 이동한 거리 Σ|a−b|), 체비쇼프 거리(좌표 차원 중 가장 긴 거리 하나만: max|x−y|), 마할라노비스 거리(상관관계와 분산까지 고려한 통계적 거리 — 평균에서 멀리 떨어질수록 이상치로 탐지), 민코프스키 거리(일반화 공식 — p=1이면 맨하탄, p=2면 유클리디안, p=∞면 체비쇼프). K-NN·K-평균 등 거리 기반 알고리즘의 공통 기초입니다." },
};

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");

/** 제목 → TITLE_SLUG 조회(정규화 비교) */
function slugByTitle(title: string): string | undefined {
  const t = norm(title);
  for (const [k, slug] of Object.entries(TITLE_SLUG)) {
    if (norm(k) === t) return slug;
  }
  return undefined;
}

/**
 * topicId 또는 제목으로 부가 자료를 찾는다.
 *
 * ★주의★ topics.json 의 제목과 교재 서브노트 제목은 상당수 다르다
 * (예: "커널" ↔ "커널(Kernel)", "RAID" ↔ "RAID (Redundant Array…)").
 * 그래서 호출부에서 topics.json 으로 id 를 찾아 넘기면 대부분 실패한다.
 * 제목이 오면 subnoteByTitle 로 교재 서브노트를 먼저 확정하고, 그 서브노트의
 * topicId(없으면 제목 슬러그)로 조회한다.
 */
export function subnoteExtraFor(
  topicId?: string,
  title?: string,
): SubnoteExtra | undefined {
  if (topicId && EXTRAS[topicId]) return EXTRAS[topicId];
  // 교재 외 예전 토픽 — topicGuides 청크에서 조회
  if (topicId && TOPIC_GUIDES[topicId]) {
    return { guide: TOPIC_GUIDES[topicId] };
  }
  if (!title) return undefined;

  // ① 제목 슬러그 직접 조회(topicId 가 없는 교재 전용 토픽)
  const direct = slugByTitle(title);
  if (direct && EXTRAS[direct]) return EXTRAS[direct];

  // ② 교재 서브노트를 제목으로 확정한 뒤 그 id/제목으로 조회
  const book = subnoteByTitle(title);
  if (!book) return undefined;
  if (book.topicId && EXTRAS[book.topicId]) return EXTRAS[book.topicId];
  const slug = slugByTitle(book.title);
  return slug ? EXTRAS[slug] : undefined;
}
