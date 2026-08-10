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
  "연관성 분석(association analysis) — 기초통계": "st-association",
  "회귀분석(Regression Analysis)": "st-regression",
  "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)": "st-aic-bic",
  "통계적 가설검정 (Hypothesis Testing)": "st-hypothesis-test",
  "통계적 가설검정(Hypothesis Testing)": "st-hypothesis-test",
  "ANOVA(Analysis of variance)": "st-anova",
};

export const EXTRAS: Record<string, SubnoteExtra> = {
  "chaos-test": { image: "/concept/book/chaos-test.png", easy: "카오스 엔지니어링을 '테스트'로 실행하는 절차판입니다 [정가실결문] — 정상 상태 정량 측정(CPU·NW I/O) → 가설 수립(DB 다운에도 정상 유지) → 실험 디자인(작업 범위 최소화·롤백 계획) → 결과 확인 → 문제점 수정. Chaos Engineering Team이 Chaos Monkey·Kube Monkey·GameDay 같은 도구로 개발팀→애플리케이션→스위칭→인프라 계층별로 수행합니다." },
  "refactoring": { image: "/concept/book/refactoring.png", easy: "기능은 그대로 두고 코드의 구조만 개선하는 작업입니다. 냄새 나는 코드(중복, 긴 메소드, 큰 클래스)를 감지하고 → 작게 고치고 → 테스트로 '기능이 안 변했음'을 확인하는 반복입니다. 외부 동작 불변이 핵심 전제라서 TDD의 테스트가 안전망이 됩니다." },
  "keyword-driven-testing": { image: "/concept/book/keyword-driven-testing.png", easy: "테스트를 '키워드(동작 단어)'로 조립하는 자동화 기법입니다. Login, Input, Click 같은 키워드를 라이브러리로 만들어 두면, 코드를 모르는 사람도 키워드를 나열해(엑셀 시트처럼) 테스트를 만들 수 있습니다. 테스트 설계(키워드 나열)와 구현(키워드 코드)의 분리가 핵심입니다." },
  "three-r": { image: "/concept/book/three-r.png", easy: "레거시 시스템을 살려 쓰는 3형제입니다 — 역공학(코드·바이너리에서 설계 정보를 거꾸로 추출), 재공학(추출한 것을 재설계·재구조화·재모듈화해 개선), 재사용(완성된 결과물을 Library·Design Pattern·CBD로 신규 개발에 활용). 셋 다 레포지토리 기반입니다. 흐름: 역공학으로 이해 → 재공학으로 개선 → 재사용으로 활용." },
  "turing-test": { image: "/concept/book/turing-test.png", easy: "기계가 '사람처럼 생각하는가'를 대화로 판별하는 고전 테스트입니다. 심사관이 커튼 뒤의 사람과 기계에게 질문을 던져, 어느 쪽이 기계인지 구별하지 못하면 통과입니다." },
  "regression-test": { image: "/concept/book/regression-test.png", easy: "코드를 고친 뒤 '멀쩡하던 곳이 새로 망가지지 않았는지' 다시 돌려 보는 테스트입니다. 수정 → 기존 테스트 재실행 → 이전 결과와 비교. 자동화(CI)와 '일관성 검사 오라클'이 이 테스트의 짝입니다." },
  "test-exit-criteria": { image: "/concept/book/test-exit-criteria.png", easy: "테스트를 '언제 그만해도 되는가'의 기준입니다. 완벽한 테스트는 불가능하므로 종료 조건을 미리 정합니다 — 커버리지 목표 달성, 결함 발견율 수렴, 일정·예산 소진 등. 계획 단계에서 시작 기준(Entry)과 함께 정의합니다." },
  "lehman": { image: "/concept/book/lehman.png", easy: "소프트웨어는 살아있는 생물처럼 변한다는 법칙입니다 — 계속 사용되는 SW는 계속 변경되고(지속 변경), 변경할수록 구조가 복잡해지며(엔트로피 증가), 그대로 두면 품질이 하락합니다. 유지보수·리팩토링이 필연이라는 결론의 이론적 뿌리입니다." },
  "fuzzing-test": { image: "/concept/book/fuzzing-test.png", easy: "무작위·비정상 입력을 대량으로 퍼부어 프로그램이 죽거나 뚫리는 지점을 찾는 테스트입니다. 보안 취약점(버퍼 오버플로 등) 발견에 특히 강해 DevSecOps의 테스트 단계 도구로 함께 나옵니다." },
  "performance-test": { image: "/concept/book/performance-test.png", easy: "시스템이 '얼마나 빨리, 얼마나 많이, 얼마나 오래' 버티는지 재는 테스트 묶음입니다 — 부하(목표 부하에서 응답시간), 스트레스(한계까지), 스파이크(순간 폭증), 내구성(장시간). 지표는 응답시간·TPS·동시사용자·자원사용률입니다." },
  "iso-29119": { image: "/concept/book/iso-29119.png", easy: "SW 테스트의 국제 표준 시리즈입니다 — 1부 개념, 2부 테스트 프로세스(조직/관리/동적), 3부 문서, 4부 기법, 5부 키워드 주도 테스팅. '어떻게 하고, 뭘 남기고, 어떤 기법을 쓰나'를 통째로 표준화했습니다." },
  "iso-29119-11": { image: "/concept/book/iso-29119-11.png", easy: "ISO 29119의 11부, AI 시스템 테스트 가이드입니다. AI는 확률적·비결정적이라 참 오라클이 불가능하므로 백투백·A/B·변성(Metamorphic) 테스트 같은 대안과 데이터 품질·편향 검증을 다룹니다." },
  "mutation-test": { image: "/concept/book/mutation-test.png", easy: "'내 테스트가 결함을 잡는 실력이 있나'를 검증하는 테스트의 테스트입니다. 코드에 일부러 작은 결함(뮤턴트)을 심고 기존 테스트를 돌려, 죽이면 유능, 살아남으면 허술. 뮤테이션 점수 = 죽인 뮤턴트/전체." },
  "test-process": { image: "/concept/book/test-process.png", easy: "테스트도 프로세스로 돕니다 — 계획(범위·전략·종료기준) → 분석·설계 → 구현·실행 → 평가·보고 → 마감. ISO 29119-2가 조직/관리/동적 3계층으로 표준화했습니다." },
  "back-to-back": { image: "/concept/book/back-to-back.png", easy: "같은 입력을 여러 버전에 동시에 넣고 출력을 비교해 불일치를 찾는 테스트입니다. Test Case 작성 → 병렬 수행 → 결과 비교 → 원인 분석. 자동차·항공의 모델 기반 개발(MATLAB/Simulink)에서 모델-코드 동일성 검증에 쓰입니다." },
  "iso-25010": { image: "/concept/book/iso-25010.png", easy: "SW 품질을 9개 주특성으로 정의한 국제표준(2023 개정) — 기능적합성·신뢰성·상호작용능력·성능효율성·유지보수성·유연성·보안성·호환성·안전성. 개정 포인트: 사용성→상호작용 능력, 이식성→유연성, 안전성 신설, 보안성에 저항성 추가." },
  "sp-cert": { image: "/concept/book/sp-cert.png", easy: "소프트웨어 '프로세스' 품질 인증 — 개발 절차·관리 역량을 심사합니다. 'SP=과정, GS=제품' 한 줄이 결론입니다." },
  "gs-cert": { image: "/concept/book/gs-cert.png", easy: "소프트웨어 '제품' 품질 인증 — 시험기관이 ISO 25023/25051 기준으로 기능성·성능·보안성을 시험해 등급을 부여합니다. 인증 받으면 공공 우선구매·직접구매 대상이 됩니다." },
  "cmmi": { image: "/concept/book/cmmi.png", easy: "조직의 개발 역량 성숙도 5단계 모델(V3.0) — 초기→관리→정의→정량 관리→최적화. CMMI=조직 성숙도, SP=국내 프로세스 인증, GS=제품 인증으로 구분합니다." },
  "oss-governance": { image: "/concept/book/oss-governance.png", easy: "오픈소스를 도입→활용→관리 전 과정에서 통제하는 체계입니다. 라이선스 의무 준수, 사용 현황 인벤토리(SBOM), 취약점 패치 프로세스, 기여 정책까지. 오픈소스 보안위협·SBOM과 3형제입니다." },
  "sw-sizing": { image: "/concept/book/sw-sizing.png", easy: "소프트웨어 크기를 재는 방법 — 하향식(전문가 감정·델파이: 간편하나 비과학적), 상향식(LOC·M/M: 객관적), 수학적(FP·COCOMO: 수식 산정). 비교표가 그대로 출제됩니다." },
  "stpa": { image: "/concept/book/stpa.png", easy: "STAMP 기반 최신 위험분석 — 부품 고장이 아니라 '요소 간 상호작용(제어)'이 위험을 만든다고 봅니다. 4단계: 사고·위험 정의 → Control Structure 도식화 → Unsafe Control Action 도출(부재/부적절/시점·순서/지속시간 4유형) → 원인 시나리오." },
  "eta": { image: "/concept/book/eta.png", easy: "초기 이벤트에서 성공/실패 가지를 치며 시나리오 확률을 계산하는 정량·귀납 분석 [범위초 트결경]. FTA가 결과→원인 연역이라면 ETA는 원인→결과 귀납입니다." },
  "hazop": { image: "/concept/book/hazop.png", easy: "전문가들이 '공정변수 × 가이드워드'로 설계 의도 이탈을 브레인스토밍하는 정성적 위험 식별입니다. 가이드워드 7개 — 없음·증가·감소·반대·부가·부분·기타." },
  "fmea": { image: "/concept/book/fmea.png", easy: "고장 유형별 '심각도×발생도×검출도=RPN'으로 우선순위를 정해 사전 대응하는 귀납 분석입니다. 비교표 핵심 — FTA=원인·연역·Top-down, FMEA=영향·귀납·Bottom-up, HAZOP=식별·정성." },
  "ops-performance": { image: "/concept/book/ops-performance.webp", easy: "전자정부법에 따라 운영 시스템의 성과를 재서 계속/정비/폐기를 정하는 활동입니다. 비용 지표(운영 적정성·유지 용이성·비용 효율성)와 업무 지표(기능 활용도·업무성과 달성도)로 측정, 정비 방식은 폐기·통폐합·기능 고도화·전면 재개발." },
  "audit-report": { image: "/concept/book/audit-report.png", easy: "감리 최종 산출물 — ① 종합의견(전제조건·총평·요약) ② 감리영역별 점검결과 ③ 별첨(감리계획서). 개선권고사항엔 유형(필수/협의/권고)·시점(장기/단기)·중요도·협조필요를 표시합니다." },
  "common-audit-process": { image: "/concept/book/common-audit-process.png", easy: "모든 감리에 공통 적용되는 3단계 [예현조] — 예비조사(감리계획서) → 현장감리(감리수행결과보고서) → 시정조치 확인(확인보고서)." },
  "audit-mandatory": { image: "/concept/book/audit-mandatory.png", easy: "감리 의무 대상 — 대국민 서비스, 공동 구축, 사업비 5억 이상, 기관장 인정. 점검 기준 [성산절] — 성과(실현성·충족성)·산출물(기능성·무결성 등)·절차(적정성·준수성)." },
  "ops-maintenance-audit": { image: "/concept/book/ops-maintenance-audit.png", easy: "운영 중인 시스템을 보는 감리 — 안정 운영·성능·보안·백업을 점검합니다. 대상별 분야: 개발SW(릴리즈·장애관리), 상용SW(패치·보안), 인프라(OS/HW 패치·용량)." },
  "oss-security-threat": { image: "/concept/book/oss-security-threat.png", easy: "오픈소스라서 생기는 위협 — 관리: 현황 파악 부재·커뮤니티 코드 맹신(타이포스쿼팅)·점검 프로세스 부재 / 기술: Zero Day·악성코드 삽입·패치 호환성. 대응: Scan Tool·Hash 검증·Sandbox·시큐어코딩·자동 업데이트. Log4j가 대표 사례, SBOM이 해결 도구." },
  "fta": { image: "/concept/book/fta.png", easy: "사고(Top 이벤트)에서 원인을 트리로 파 내려가는 연역·Top-down 분석입니다. AND(둘 다)·OR(하나만) 게이트로 연결해 기본사상까지 내려가며, 정성·정량 모두 가능합니다." },
  "iso-14764": { image: "/concept/book/iso-14764.png", easy: "SW 유지보수 표준 프로세스 — 공정구현→문제·수정분석→수정구현→검토/승인→이전→폐기. 4분류 [수적완예] — 반응적(수정·적응) / 순향적(완벽·예방). 기법: 프로그램 이해·재공학·역공학·재구조화." },
  "mccabe": { image: "/concept/book/mccabe.png", easy: "제어 흐름 그래프의 독립 경로 수로 복잡도를 재는 지표 — V(G) = 간선−노드+2 = 폐구간+1 = 의사결정 수+조건 수+1. 판정: 5 이하 단순, 5~10 안정, 20 이상 과복잡. 계산 문제가 그대로 나옵니다." },
  "maintenance": { image: "/concept/book/maintenance.png", easy: "인도 후 SW를 고치는 활동, 분류 셋 — 시점 [계예응지], 대상 [데프문시], 원인 [수완예적](수정=오류, 완전=개선, 예방=정기, 적응=환경). 절차: CR 작성→검토→위원회 승인→수행." },
  "commercial-sw-quality-test": { image: "/concept/book/commercial-sw-quality-test.webp", easy: "동종 상용 SW끼리 기능·성능을 비교 평가하는 시험(SW진흥법 55조). 대상: 직접구매 중 구매금액 1억 이상 또는 SW 구매 2억 이상 등. 절차: 대상 검토→사전 협의→설계→발주→의뢰→실시→반영." },
  "function-point": { image: "/concept/book/function-point.png", easy: "SW 규모를 '기능 개수'로 재는 방법 [유범이의 데이트] — 유형→범위·경계→데이터 기능(ILF·EIF)→트랜잭션 기능(EI·EO·EQ)→미조정 점수→조정인자(14개)→조정 점수. 'EO는 가공 있음, EQ는 단순 조회'가 함정 포인트." },
  "sw-cost": { image: "/concept/book/sw-cost.png", easy: "SW 적정 대가 산정 가이드('25 개정, 1FP=605,784원). 기획 단계는 컨설팅 업무량/투입공수 방식, 구현 단계는 기능점수 방식 — 사전준비→기능점수→보정 전 원가→보정계수→직접경비·이윤(원가의 25% 이내) [사기전후직소]." },
  "obfuscation": { image: "/concept/book/obfuscation.png", easy: "코드를 읽기 어렵게 바꿔 역공학을 막는 기술 [구데집제예] — 구획(주석 제거·식별자 훼손, 성능저하 없음), 데이터(변수 변환), 집합(배열·클래스 분할), 제어(흐름 복잡화), 예방(역난독화 봉쇄). '레이아웃만 성능 저하 없음'이 비교 포인트." },
  "usability-eval": { image: "/concept/book/usability-eval.png", easy: "실사용자를 관찰해 효율성·학습용이성·문제점을 찾는 테스트. 절차: 계획→설계→실행→분석/보고. 4유형 — 탐색적(초반)·평가(중반)·검증(후반, 참여자 70% 기준)·비교(대안). 지표: 작업시간·사용패턴·정확성·완성도·학습용이성·일관성." },
  "sbom": { image: "/concept/book/sbom.png", easy: "소프트웨어의 '식자재 명세서' — 어떤 컴포넌트가 어떤 버전으로 들어갔는지 공급망을 목록화합니다. 속성: 작성자·타임스탬프·공급자·컴포넌트명·버전·해시·식별자·관계. 포맷 3종: SPDX·CycloneDX·SWID. Log4j 때 '어디 들어있지?'를 즉시 찾는 도구." },
  "direct-purchase": { image: "/concept/book/direct-purchase.png", easy: "공공 사업에서 상용 SW를 발주기관이 따로 직접 사는 제도(SW진흥법 54조). 대상: 총 3억 이상 사업 + 조달청 쇼핑몰 등록 SW 또는 5천만원 초과 인증 제품(GS 등). 중소 SW 판로 보호 목적." },
  "sw-impact-assessment": { image: "/concept/book/sw-impact-assessment.webp", easy: "국가기관이 SW 사업 발주 전 '민간 시장 침해 여부'를 검토하는 제도(43조). 기본정보→운영계획→민간 침해 검토→필요성·공공성→종합의견. 발주 후 사업자의 재평가 요청권('23.3 개정)이 최신 포인트." },
  "feasibility-study": { image: "/concept/book/feasibility-study.png", easy: "대규모 신규 사업의 타당성 사전 검증(국가재정법). 기준 [사5지3신] — 총사업비 500억+국가 재정지원 300억 이상 신규 사업. 필요성: 경제적(예산낭비 최소화)·기술적(리스크 완화)·정책적(우선순위)." },
  "sw-safety-guideline": { image: "/concept/book/sw-safety-guideline.png", easy: "SW 오작동으로 생명·신체·재산 피해가 없도록 단계별 관리기준을 정한 고시(SW진흥법 30조 2항). 총칙(총괄 담당자·대상 SW 지정) / 개발단계 안전확보(위험원 분석·설계·검증) / 운영단계(계획·점검·변경·장애관리). 위험원·장애·SW안전 용어 구분이 출제됩니다." },
  "se-135": { image: "/concept/book/se-135.png", easy: "코드를 먼저 짜고 나중에 테스트하는 게 아니라, 순서를 뒤집어 '실패하는 테스트'부터 만드는 개발법입니다. 주문(요구사항)을 받으면 → 채점표(테스트)부터 만들고 → 채점표를 통과할 만큼만 빠르게 코드를 짜고 → 지저분한 부분을 정리(리팩토링)합니다. 이 리듬이 RED(실패 테스트 작성)–GREEN(통과하는 최소 코드)–REFACTOR(개선)입니다. 채점표가 항상 먼저 있으니 고칠 때마다 안심하고 고칠 수 있다는 게 핵심 이득입니다. 교재 두음 [요테구리] — 요구사항·테스트·구현·리팩토링." },
  "se-139": { image: "/concept/book/se-139.png", easy: "개발팀(만드는 사람)과 운영팀(돌리는 사람)이 서로 떠넘기던 벽을 허물고, 소통·협업·자동화로 한 팀처럼 일하는 문화이자 방법론입니다. 개념도의 무한 루프(∞)가 전부입니다 — DEV(계획·개발·검증·패키징)와 OPS(릴리즈·설정·모니터링)가 끊임없이 이어집니다. 이를 받치는 도구가 CI(코드 바뀔 때마다 자동 빌드+테스트, Git+Jenkins), CD(운영 반영까지 자동화), 프로비저닝(서버 설치·구성 자동화)입니다. '완료(Done)의 기준이 코드 작성이 아니라 운영서버 정상동작'이라는 문장이 시험 포인트입니다." },
  "se-141": { image: "/concept/book/se-141.png", easy: "구글 운영팀에서 나온 방식으로, '운영을 사람 손이 아니라 소프트웨어 엔지니어링으로 한다'입니다. 핵심 발상 두 가지 — ① 측정: 서비스 수준을 숫자로 정의(SLI 지표, SLO 목표)하고 모든 판단을 데이터로 합니다. ② Error Budget: '이만큼은 장애 나도 된다'는 예산을 정해 두고, 예산이 남으면 과감히 배포하고 예산을 다 쓰면 안정화에 집중합니다. 반복 수작업(Toil)은 자동화로 없애고, 장애가 나면 비난 없이 회고(Postmortem)합니다. 배포는 카나리·롤링으로 조금씩 — 장애 원인의 70%가 '변경'이기 때문입니다." },
  "se-143": { image: "/concept/book/se-143.png", easy: "서비스를 끄지 않고 새 버전을 내보내는 세 가지 방법입니다. 식당으로 보면 — 롤링: 주방 화구를 하나씩 새것으로 교체(추가 비용 적고 롤백 쉬움, 교체 중엔 처리량 줄어듦). 블루/그린: 옆에 새 주방을 통째로 차려 놓고 손님을 한 번에 새 주방으로 안내(실제 환경으로 미리 테스트 가능, 대신 주방 2개 비용). 카나리: 손님 5%만 먼저 새 주방으로 보내 보고 문제없으면 전부 전환(위험을 빨리 감지, A/B 테스트 겸용). 광산의 카나리아 새에서 온 이름입니다." },
  "se-145": { image: "/concept/book/se-145.png", easy: "코드가 개발자 손을 떠나 사용자에게 도달하기까지의 컨베이어 벨트(파이프라인)를 설계·운영하는 공학입니다. 벨트의 6단계 — 통합(브랜치 병합, Git) → 지속적 통합(자동 빌드+테스트, Jenkins) → 빌드 시스템(Maven·CMake로 실행물 생성) → 코드형 인프라(IaC — 서버 환경을 코드로 자동 생성, Ansible·Docker) → 배포(블루그린·카나리 전략) → 릴리즈(사용자 공개). '사람 손 개입 없이, 안정적이고 예측 가능하게'가 목표입니다." },
  "se-144": { image: "/concept/book/se-144.png", easy: "멀쩡히 돌아가는 시스템에 일부러 고장을 내서(Fault Injection) 진짜로 버티는지 확인하는 기법입니다. 넷플릭스가 운영 중인 서버를 무작위로 죽이는 Chaos Monkey로 유명해졌습니다. 절차는 과학 실험과 같습니다 — ① 정상 상태를 숫자로 정의하고 ② '서버 하나가 죽어도 정상일 것'이라는 가설을 세우고 ③ 실제로 고장을 주입하고 ④ 지표를 측정해 ⑤ 가설이 맞았는지 검증, 틀렸으면 시스템을 보강합니다. '사고가 나기 전에 사고를 내 본다'는 발상 전환이 핵심입니다." },
  "sec-341": { image: "/concept/book/sec-341.png", easy: "DevOps의 무한 루프 한가운데에 Sec(보안)을 박아 넣은 것입니다. 예전엔 다 만든 뒤 마지막에 보안 검사를 했다면, 이제는 코드 작성·빌드·테스트·릴리즈·운영 전 단계에 보안이 스며듭니다 — 테스트 단계엔 IAST(정적+동적 분석)·퍼징·모의해킹, 분석엔 FMEA, 운영 중엔 RASP(실행 중 스스로 공격을 막는 기술). 평가 접근법 CARTA는 '보안은 한 번의 합격/불합격이 아니라 지속적(Continuous)·적응형(Adaptive) 위험(Risk)·신뢰(Trust) 평가(Assessment)'라는 뜻입니다." },
  "se-149": { image: "/concept/book/se-149.png", easy: "테스트가 따르는 7가지 상식 법칙입니다. ① 테스트의 목적은 결함 '발견'(제거가 아님) ② 완벽한 테스트는 불가능(자원 한계) ③ 테스트는 초기부터(늦을수록 수정 비용 폭증) ④ 결함의 80%는 20% 모듈에 몰려 있다(파레토) ⑤ 살충제 패러독스 — 같은 테스트만 반복하면 벌레가 내성이 생기듯 새 결함을 못 찾는다(→ 테스트 케이스를 바꾸고 추가해야) ⑥ 테스트는 도메인 상황에 의존 ⑦ 오류 부재의 궤변 — 결함을 다 잡았어도 사용자가 원하는 물건이 아니면 소용없다(→ V&V로 '맞는 것을 만들었는지'까지 확인). ⑤와 ⑦의 개선방안이 단골 출제입니다." },
  "review": { image: "/concept/book/review.png", easy: "코드를 '실행하지 않고' 눈으로 검토해 결함을 초기에 잡는 정적 테스트입니다. 실행 전 단계(요구사항 정의서·설계서)에서도 쓸 수 있다는 게 최대 강점 — 결함은 일찍 잡을수록 쌉니다. 공식성 순서로 4형식: 비공식 리뷰 < 기술적 리뷰 < 워크쓰루(사전 준비 생략, 작성자가 이끎) < 인스펙션(가장 공식적, 훈련된 중재자가 이끎). 페이건 인스펙션은 '전체 비용의 15%를 검토에 쓰면 전 단계 결함을 조기 발견한다'는 고전입니다. 프로세스 두음 [계시사미RF](계획–시작–사전검토–미팅–Rework–Follow-up), 참여자 [관중기작검]." },
  "se-156": { image: "/concept/book/se-156.png", easy: "속을 안 보고 '넣은 값 대비 나온 값'만 확인하는 사용자 관점 테스트입니다. 기법이 많아 보여도 발상은 셋뿐 — ① 다 못 해보니 대표만 고르기: 동등분할(입력을 구간으로 나눠 구간당 하나), 경계값 분석(버그는 경계에 몰리니 0·최대값 근처를 집중), 페어와이즈(결함 대부분은 두 요소의 조합에서 나니 쌍만 커버). ② 조건과 흐름을 표·그림으로 정리해 빠짐없이: 의사결정 테이블, 상태전이, 유스케이스, 분류트리, 원인-결과 그래프. ③ 감각으로 찌르기: 오류예측(입력 없이 엔터, 문법에 어긋난 입력)." },
  "se-158": { image: "/concept/book/se-158.png", easy: "소스 코드를 직접 들여다보며 논리 흐름을 검증하는 개발자 관점 테스트입니다. '코드를 얼마나 훑었나'를 재는 자가 커버리지인데, 강도 순서가 핵심입니다 — 구문(모든 문장 한 번씩) < 결정(모든 if의 참/거짓) < 조건(if 안의 개별 조건까지 참/거짓) < 조건/결정 < 변경조건/결정(MC/DC — 각 조건이 독립적으로 결과를 바꾸는지, 항공·차량 안전 인증 요구) < 다중조건(모든 조합). 그 외 루프 테스트(경계 오류), 제어 구조 테스트(McCabe 복잡도 기반 기본 경로)가 있습니다. 블랙박스와의 비교표(관점·기준 문서·V모델 위치)도 그대로 출제됩니다." },
  "code-coverage": { image: "/concept/book/code-coverage.png", easy: "테스트가 소스 코드를 몇 % 훑었는지의 지표로, 화이트박스 테스트의 '자'입니다. 포함 관계 그림 하나로 정리됩니다 — 구문(SC) ⊂ 결정(DC) ⊂ 조건/결정(C/DC) ⊂ 변경조건/결정(MC/DC) ⊂ 다중조건(MCC) ⊂ 전체 경로. 안쪽일수록 달성하기 쉽고 바깥일수록 강력합니다. 예를 들어 'if(A and B)'에서 — 구문 커버리지는 이 줄이 실행만 되면 만족, 결정은 참/거짓 다 나와야, 조건은 A와 B 각각 참/거짓, MC/DC는 A와 B가 각각 독립적으로 결과를 바꾸는 케이스까지 요구합니다. 항공(DO-178C)·차량 안전 인증이 MC/DC를 요구하는 이유까지 붙이면 서술형이 됩니다." },
  "se-160": { image: "/concept/book/se-160.png", easy: "문서 없이 테스터의 경험과 직관으로 '탐험하듯' 결함을 찾는 테스트입니다. 다만 마구잡이가 아니라 규칙이 있습니다 [세차노요] — 세션(방해받지 않는 45분~수시간의 타임박스), 차터(이 세션의 목표를 한두 문장 비전으로, 1세션 1차터), 노트(발견한 아이디어·제안을 최소한으로 기록), 요약보고(Debrief — 팀과 공유). 보고 틀이 PROOF입니다: Past(뭘 했나)·Results(뭘 얻었나)·Outlook(뭐가 남았나)·Obstacles(뭐가 방해였나)·Feelings(감이 어떤가). 명세가 부실하고 시간이 없을 때 위력을 발휘합니다." },
  "exp-based-test": { image: "/concept/book/exp-based-test.png", easy: "명세서가 아니라 테스터의 경험·직관·노하우에서 테스트를 뽑는 기법 묶음입니다 [경탐오체분]. 탐색적 테스팅(차터+타임박스로 탐험 — 별도 토픽), 오류추정(Ad-hoc — '여기가 잘 터지더라'는 감으로 결함을 예측해 찌름, 마지막 단계에 사용), 체크리스트(과거 노하우를 목록화해 누락 없이 재활용), 분류트리. 공식 기법(동등분할·경계값 같은 명세 기반)을 대체하는 게 아니라 '보완'한다는 위치가 시험 포인트입니다." },
  "risk-based-test": { image: "/concept/book/risk-based-test.png", easy: "테스트할 시간과 인력은 늘 모자라니, 위험이 큰 곳부터 집중하자는 전략입니다. 각 항목의 위험을 '장애 발생 가능성 × 영향'의 2축 매트릭스에 놓으면 네 구역이 나옵니다 — STA(가능성↑영향↑: 반드시 테스트), STTA(가능성↓영향↑), ITA(가능성↑영향↓), FTA(둘 다 낮음: 생략 가능). 순회 순서까지 나옵니다 — 사업적 리스크 중심이면 N자형(STA→STTA→ITA→FTA), 기술적 리스크 중심이면 S자형(STA→ITA→STTA→FTA). 절차는 위험 식별→분석→대응계획→테스트 계획→모니터링입니다." },
  "se-163": { image: "/concept/book/se-163.png", easy: "테스트 결과가 '맞았는지 틀렸는지'를 판정해 주는 채점 기준입니다 [참샘휴일]. 참 오라클(모든 입력의 정답을 다 앎 — 이상적이나 비쌈), 샘플링(특정 입력 몇 개만 정답 보유 — sin 함수의 0°·90°·180°처럼), 휴리스틱(샘플은 정확히, 나머지는 추정으로 — 샘플링의 개선), 일관성 검사(이전 실행 결과와 같은지 비교 — 회귀 테스트·자동화 도구가 사용). 요즘 단골 연계 — AI 시스템은 확률적이고 재현이 안 돼 참 오라클이 불가능하므로, 백투백·A/B·변성(Metamorphic) 테스트 같은 대안을 씁니다." },
"memory-fragmentation": {
    image: "/concept/book/memory-fragmentation.webp",
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
    image: "/concept/book/os-47.webp",
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
"cbam": { image: "/concept/book/cbam.png", easy: "ATAM이 '품질끼리 뭘 주고받는지'까지 보여줬다면, CBAM은 거기에 돈 계산을 더합니다. 각 아키텍처 안이 주는 효용(만족도)을 시나리오별로 점수화하고, 그 안을 구현하는 비용과 비교해 ROI가 가장 높은 안을 고릅니다. 절차는 시나리오 결정(수집→정제→우선순위) → 효용-반응값 곡선 작성(최악W·현재C·기대E·희망D·최선B) → 접근법별 이익 계산 → ROI로 순위 결정. 2단계 반복(1차는 우선순위, 2차는 위험·불확실성 반영)이 특징입니다." },
"uml": { image: "/concept/book/uml.png", easy: "설계를 그림으로 그리는 표준 언어이고, 다이어그램이 13개입니다. 딱 두 갈래만 기억하면 됩니다 — 정적(구조) 6개: 시스템이 '무엇으로' 되어 있나(Class·Component·Object·Deployment·Composite Structure·Package). 동적(행위) 7개: 시스템이 '어떻게' 움직이나(Activity·Use Case·State·Sequence·Communication·Interaction Overview·Timing). 동적 중 4개(시퀀스·커뮤니케이션·인터랙션 오버뷰·타이밍)를 묶어 인터랙션 다이어그램이라 부릅니다." },
"class-diagram": { image: "/concept/book/class-diagram.png", easy: "클래스들 사이의 관계를 그리는 정적 다이어그램입니다. 시험 포인트는 관계 화살표 구분입니다 — 연관(실선: 서로 안다), 집합(빈 마름모: 부분-전체인데 따로 살 수 있음, 팀과 선수), 복합(찬 마름모: 전체가 죽으면 부분도 죽음, 집과 방), 의존(점선: 잠깐 빌려 씀), 일반화(빈 삼각형: is-a 상속), 실체화(점선+빈 삼각형: 인터페이스 구현). 접근제어자는 +Public −Private #Protected ~Package 입니다." },
"usecase-diagram": { image: "/concept/book/usecase-diagram.png", easy: "시스템이 뭘 해주는지를 사용자(액터) 눈높이로 그린 그림입니다. 졸라맨(액터), 타원(유즈케이스), 사각형(시스템 경계)이 전부입니다. 시험 포인트는 include 와 extend 구분 — include 는 '반드시 같이 실행'(주문을 확인한다 ← 주문을 받는다에 필수 포함), extend 는 '조건이 맞을 때만 실행'(선택). 화살표 방향도 반대라 헷갈리기 쉬운데, '필수는 include' 하나만 확실히 잡으면 됩니다." },
"state-diagram": { image: "/concept/book/state-diagram.png", easy: "객체 하나가 일생 동안 거치는 상태 변화를 그립니다. 결재 문서로 보면 — 작성 →(상신) 결재대기 →(반려) 반려 →(재작업) 다시 작성, 또는 →(최종결재) 승인 → 종료. 검은 원이 시작, 겹친 원이 종료, 화살표가 전이, 화살표 위 글자가 이벤트(전이를 유발하는 자극), 대괄호가 전이조건([금액>100만] 같은 불리언 식)입니다. '하나의 객체'의 상태만 그린다는 것이 시퀀스 다이어그램과의 차이입니다." },
"sequence-diagram": { image: "/concept/book/sequence-diagram.png", easy: "객체들이 시간 순서대로 메시지를 주고받는 흐름을 그립니다. 위에 객체들이 나란히 서고, 아래로 시간이 흐르며(생명선), 활동 중인 구간은 막대(제어사각형)로 표시합니다. 메시지 화살표 구분이 포인트 — 채운 화살표는 동기(응답 올 때까지 기다림), 열린 화살표는 비동기(안 기다림), 점선은 응답. UML 2.0부터는 프레임(sd 이름)으로 감싸고 loop(반복)·opt(조건)·par(병렬) 연산자를 씁니다." },
"se-94": { image: "/concept/book/se-94.png", easy: "액티비티 다이어그램의 큰 흐름 안에, 상세한 부분만 시퀀스 다이어그램을 끼워 넣은 혼합 다이어그램입니다. 출입문 통제로 보면 — 전체 흐름(코드 입력 → OK면 문 열림 / 아니면 종료)은 액티비티로 그리고, '코드를 입력하고 검증하는' 세부 상호작용만 시퀀스로 박아 넣습니다. 큰 그림과 세부를 한 장에 담을 수 있어서 '흐름 + 상호작용'이 둘 다 필요할 때 씁니다." },
"msa": { image: "/concept/book/msa.png", easy: "큰 애플리케이션 하나를 작은 서비스 여러 개로 쪼개고, 각자 따로 배포·확장할 수 있게 만든 아키텍처입니다. 계층은 4개 — 클라이언트(웹/모바일) → API Gateway(관문) → 마이크로서비스들(주문·결제·재고, 언어도 제각각 가능=Polyglot) → 서비스마다 자기 DB. 핵심 성질은 '서비스마다 DB가 따로'라는 것인데, 그래서 트랜잭션 문제(SAGA)와 관문 문제(API Gateway)가 따라 나옵니다. 이 셋(MSA·API Gateway·SAGA)은 한 세트로 외우세요." },
"se-70": { image: "/concept/book/se-70.png", easy: "마이크로서비스 수십 개의 주소를 클라이언트가 다 알 수는 없으니, 입구를 하나로 모은 관문입니다. 하는 일 세 갈래 — 보안(인증·인가 Token, SSL 암호화, 로깅), 라우팅(어느 서비스로 보낼지 매칭, 로드밸런싱), 변환(클라이언트의 HTTP/JSON 요청을 내부 서비스가 처리 가능한 프로토콜로). 부가로 서비스 디스커버리(동적 IP·포트 관리)와 오케스트레이션(여러 서비스 묶어 신규 서비스)도 합니다. 호텔 프런트를 떠올리면 됩니다 — 손님은 프런트만 알면 되고, 몇 호실에 누가 있는지는 프런트가 압니다." },
"saga-pattern": { image: "/concept/book/saga-pattern.png", easy: "MSA에서는 서비스마다 DB가 따로라서 '주문-결제-재고'를 한 트랜잭션으로 묶을 수 없습니다. 그래서 중간에 실패하면 앞서 성공한 서비스들에게 '되돌려!'라는 보상 이벤트를 보내 원자성을 흉내 냅니다. 방식이 둘 — Choreography(지휘자 없음): 각 서비스가 이벤트를 Kafka 같은 메시지 큐로 전파하며 릴레이. 단순하지만 흐름 추적이 어려움. Orchestration(지휘자 있음): SAGA Manager 인스턴스가 중앙에서 트랜잭션을 요청·완료 수신. 흐름이 명확하지만 매니저가 단일 장애점이 될 수 있음." },
"ddd": { image: "/concept/book/ddd.png", easy: "개발자와 현업이 같은 말(유비쿼터스 언어)을 쓰면서, 업무(도메인) 중심으로 설계하는 방법입니다. 두 단계 — 전략적 설계(분석): 업무를 바운디드 컨텍스트(제한된 경계)로 자르고 컨텍스트 맵을 그려 마이크로서비스를 도출. 전술적 설계(설계): 그 안을 Entity(ID 있는 객체)·Value Object(값만 있는 객체)·Aggregate(엔티티+값 객체 묶음)·Repository(저장 관리)·Factory(생성 캡슐화)·Domain Event(변경 전파)로 구현. MSA에서 '서비스를 어떻게 자를 것인가'의 답이 DDD의 바운디드 컨텍스트입니다." },
"eda": { image: "/concept/book/eda.png", easy: "'무슨 일이 생기면(이벤트) 그에 반응해서 움직이는' 아키텍처입니다. 주문 완료라는 이벤트가 발생하면 재고 서비스도, 배송 서비스도, 알림 서비스도 각자 받아서 자기 일을 합니다. 구성은 4단계 — 이벤트 프로듀서(감지해서 메시지로 발행) → 이벤트 채널(큐에 쌓아 비동기 전달) → 이벤트 처리 엔진(식별하고 비즈니스 로직 실행) → 다운스트림 활동(알림·경고 표시). 보내는 쪽은 누가 받는지 모르고, 받는 쪽은 구독만 하면 되니 확장성과 병렬 처리에 강합니다." },
"design-pattern": { image: "/concept/book/design-pattern.png", easy: "자주 나오는 설계 문제의 모범답안 23개를 이름 붙여 정리한 것입니다. 분류는 [생구행] — 생성 패턴(객체를 어떻게 만들까): 아·베·프로·시·파(Abstract Factory·Builder·Prototype·Singleton·Factory Method). 구조 패턴(객체를 어떻게 조립할까): A·B·C·D·파·플·로(Adapter·Bridge·Composite·Decorator·Facade·Flyweight·Proxy). 행위 패턴(객체끼리 어떻게 협력할까): CCMMISSOTIV(Chain of Responsibility·Command·Mediator·Memento·Iterator·State·Strategy·Observer·Template Method·Interpreter·Visitor). 패턴 문서 형식은 이름–문제–해법–결과 4요소입니다." },
"singleton": { image: "/concept/book/singleton.png", easy: "인스턴스를 딱 하나만 만들고 어디서든 그 하나를 쓰게 하는 생성 패턴입니다. 프린터 스풀러나 설정 관리자처럼 '전체에서 하나여야' 하는 것에 씁니다. 구현 3요소 — ① 생성자를 private으로(밖에서 new 금지) ② static 변수에 유일한 인스턴스 보관 ③ public static getInstance()로만 접근. 구현 방식은 Lazy(첫 호출 때 생성), Eager(클래스 로딩 때 즉시), Double-Checked Locking(멀티스레드 안전), Enum(자바에서 가장 안전) 네 가지입니다." },
"view-4plus1": { image: "/concept/book/view-4plus1.png", easy: "아키텍처를 한 장으로 그리면 개발자·운영자·사용자가 각자 보고 싶은 게 달라 싸움이 납니다. 그래서 관점을 4+1개로 나눠 그립니다 — Logical View(설계자: 클래스 구조), Implementation View(개발자: 소스·모듈), Process View(통합자: 스레드·프로세스 동작), Deployment View(엔지니어: 어느 하드웨어에 배치). 그리고 가운데 +1이 Use Case View(사용자: 기능 시나리오)로, 네 뷰를 하나로 묶는 기준이 됩니다." },
"mvvm": { image: "/concept/book/mvvm.png", easy: "화면(View)과 데이터(Model) 사이에 View Model을 두고, View와 View Model을 Data Binding으로 자동 동기화하는 패턴입니다. 흐름은 — 사용자 Action이 View로 들어오면 → Command로 View Model에 전달 → View Model이 Model에 데이터 요청·응답받아 가공 → Data Binding이 알아서 화면 갱신. 핵심 이득은 View와 View Model이 서로를 직접 모른다는 것(독립) — 그래서 화면 없이도 View Model을 테스트할 수 있습니다. View:ViewModel = n:1 입니다." },
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
    image: "/concept/book/paging-segmentation.webp",
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
    image: "/concept/book/ca-58.webp",
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
"sw-methodology": { image: "/concept/book/sw-methodology.webp", easy: "개발을 '그때그때 알아서'가 아니라 표준으로 못 박아 둔 것이 방법론입니다. 구성요소 6개 [절방산관기도] — 절차(단계별 순서), 방법(누가 무엇을 어떻게), 산출물(무엇을 남기나), 관리(계획·일정·품질), 기법(ERD·DFD 같은 기술), 도구(CASE·UML Tool). 유형은 시대순으로 흘러갑니다 [구정객CAP] — 구조적(70s, 프로세스 중심) → 정보공학(80s, 데이터모델 중심) → 객체지향(90s, 객체 중심, White Box 재사용) → CBD(2000s, 컴포넌트 중심, Black Box 재사용) → Agile(2010s, 적시성). Product Line은 공통 기능을 미리 뽑아 두고 제품마다 조립하는 방식입니다." },
"sw-design-principle": { image: "/concept/book/sw-design-principle.webp", easy: "복잡한 걸 다루는 방법은 결국 둘 — 뭉뚱그리거나(일반화) 잘게 쪼개거나(구체화)입니다. 일반화 쪽에 추상화(필요한 것만 남기고 나머지는 생략)와 정보은닉(모듈 속을 안 보이게)이 있고, 구체화 쪽에 분할과 정복(큰 걸 서브시스템으로 쪼개 아래부터 완성), 단계적 분해(위에서 아래로 점점 잘게, 하향식), 모듈화(실제 개발 가능한 단위로 나눔)가 있습니다. 설계는 상위 설계(아키텍처·데이터·인터페이스·UI)와 하위 설계(모듈·자료구조·알고리즘)로 나뉩니다." },
"se-18": { image: "/concept/book/se-18.webp", easy: "객체지향의 다섯 특징 [캡추다정상]입니다. 캡슐화 — 데이터와 메소드를 하나로 묶고 속을 감춤. 추상화 — 공통 성질을 뽑아 슈퍼클래스를 만듦(자동차·오토바이 → 이동수단). 다형성 — 같은 이름으로 여러 메소드(Overloading은 수평 확장, Overriding은 수직 확장). 정보은닉 — private/protected로 선언해 밖에서 직접 못 건드리게. 상속성 — 미리 만든 클래스를 다시 씀(Animal → Dog·Cat·Human). 캡슐화와 정보은닉이 헷갈리는데, 정보은닉이 '숨기는 성질'이고 캡슐화는 '묶고 + 숨기는' 더 넓은 개념입니다." },
"polymorphism": { image: "/concept/book/polymorphism.webp", easy: "같은 이름의 메소드를 여러 개 두는 것인데, 두 방식의 규칙이 정반대라 표로 외웁니다. 오버로딩은 **같은 클래스 안**에서 이름은 같고 파라미터를 다르게 — 파라미터 개수나 자료형이 반드시 달라야 하고, 리턴 타입은 상관없으며, 상위 클래스에 같은 이름이 없어야 합니다. 오버라이딩은 **상속 관계**에서 하위 클래스가 상위 메소드를 덮어쓰는 것 — 이름·파라미터·리턴 타입이 전부 같아야 하고, 상위 클래스에 그 메소드가 반드시 있어야 합니다. 한 줄: 오버로딩=수평(같은 클래스), 오버라이딩=수직(상속)." },
"ood-principles": { image: "/concept/book/ood-principles.webp", easy: "SOLID 다섯 글자입니다. SRP — 클래스·메소드는 역할 하나만(Person에 DB 책임과 비즈니스 책임이 섞여 있으면 쪼갠다). OCP — 기능을 더할 때는 열려 있고, 기존 코드 수정에는 닫혀 있어야(도형이 늘어도 client 코드는 안 고침). LSP — 자식이 부모 자리를 대신할 수 있어야(자식이 부모의 약속을 깨면 위반). ISP — 인터페이스도 역할 하나만(뚱뚱한 인터페이스를 client별로 쪼갠다). DIP — 고차원 모듈이 저차원 모듈에 의존하지 말고, 둘 다 추상(인터페이스)에 의존해야." },
"law-of-demeter": { image: "/concept/book/law-of-demeter.webp", easy: "'최소 지식의 원칙'이라고도 합니다. A가 B를 아는 건 괜찮지만, B를 거쳐 C까지 파고드는 건(a.getB().getC().doSomething()) 하지 말라는 것입니다 — 친구의 친구는 남이니까요. 호출해도 되는 대상은 딱 다섯 — ① 객체 자신(this.method()), ② 메소드 파라미터로 받은 객체, ③ 메소드 안에서 직접 만든 객체, ④ 객체가 필드로 직접 갖고 있는 컴포넌트, ⑤ 접근 가능한 전역 변수. 이걸 지키면 결합도가 낮아져(loose coupling) 한쪽을 고쳐도 다른 쪽이 안 깨집니다." },
"se-28": { image: "/concept/book/se-28.webp", easy: "제품을 하나씩 따로 만들지 않고, 공통 부품(Core Asset)을 먼저 만들어 두고 제품마다 조립해 내는 생산 체계입니다. 두 축으로 굴러갑니다 — Domain Engineering은 '이 도메인 제품들의 공통점과 차이점'을 분석해 핵심자산(아키텍처·컴포넌트)을 만들고 Repository에 쌓습니다. Application Engineering은 그 핵심자산을 개별 제품 요구에 맞게 Instance화해서 실제 제품을 만듭니다. 자동차 플랫폼 하나로 여러 차종을 뽑는 것과 같습니다." },
"aop": { image: "/concept/book/aop.webp", easy: "로깅·보안·트랜잭션 같은 코드는 모든 모듈에 똑같이 흩어져 들어갑니다(횡단 관심사). 이걸 본래 로직(핵심 관심사)에서 떼어내 따로 만들어 두고, 필요한 지점에 자동으로 끼워 넣는 것이 AOP입니다. 용어가 헷갈리는데 짝지어 보면 쉽습니다 — Joint Point는 '끼울 수 있는 모든 지점'(Where), Pointcut은 '그중 실제로 끼울 곳을 고르는 조건'(When), Advice는 '끼워 넣을 실제 코드'(What), Weaving은 '실제로 끼우는 행위'(컴파일·클래스로딩·런타임 시점), Aspect는 'Pointcut + Advice를 묶은 클래스', Target은 'Advice를 받는 클래스'입니다." },
"tailoring": { image: "/concept/book/tailoring.webp", easy: "조직 표준 프로세스를 그대로 쓰면 소규모 프로젝트엔 과하고 대규모엔 모자랍니다. 그래서 프로젝트에 맞게 잘라 고치는 것이 테일러링입니다. 절차 5단계 [특선상세문] — 프로젝트 특징 정의(프로파일 작성) → 표준 프로세스 선정 및 검증 → 상위 수준 커스터마이징(생명주기·WBS) → 세부 커스터마이징(테일러링 매트릭스·산출물 구성도·스케줄) → 문서화(적용 근거 결과서). 고려사항은 프로젝트 측면(규모·기간·조직원 경험·위험수준)과 기술적 측면(기술혁신·데이터전환·시스템연계·분산시스템)으로 나뉩니다." },
"req-engineering": { image: "/concept/book/req-engineering.webp", easy: "요구사항을 다루는 전 과정을 체계로 묶은 것입니다. 크게 둘 — 요구사항 개발(CMMi L3) = 추출 → 분석 → 명세 → 검증 [추분명검], 요구사항 변경관리(CMMi L2) = 협상 → 기준선 → 변경관리 → 확인 및 검증 [협기변검]. 여기서 기준선(Baseline)이 핵심인데, 공식 합의된 명세서를 못 박아 두고 이후 모든 변경을 그 기준선 대비로 통제합니다. 좋은 요구사항의 조건 9개는 [정명완검일수추리해] — 정확성·명확성·완전성·검증성·일관성·수정성·추적성·이해성·해석성." },
"se-34": { image: "/concept/book/se-34.webp", easy: "'사용자'라고 뭉뚱그리면 설계 결정을 못 내리니, 실제 있을 법한 가상 인물 한 명을 구체적으로 만들어 놓고 그 사람 기준으로 판단하는 기법입니다. 이름·나이·직업·목표(Goals)·불만(Frustrations)까지 적습니다. 만드는 순서는 사용자 범주 파악 → 단서 분류 → 세부 범주·기간구조 → 평가·우선순위 → 페르소나 작성 → 평가 → 설문으로 프로파일 확정. 사용자 분석 기법에는 페르소나 말고도 인지(어떻게 인지하나), 역할(사용 행태), 사회기술(조직 특성) 모형이 있습니다." },
"iso-42010": { image: "/concept/book/iso-42010.webp", easy: "'아키텍처 문서에 무엇을 어떻게 적을 것인가'를 표준화한 메타모델입니다. 핵심 연결고리만 잡으면 됩니다 — 이해관계자(Stakeholder)에게는 관심사(Concern)가 있고, 그 관심사를 다루는 규칙이 관점(Viewpoint), 그 관점으로 실제 그려낸 것이 뷰(View)이며, 뷰들을 모은 것이 아키텍처 기술서(Architecture Description)입니다. 왜 그렇게 설계했는지는 Rationale에 남기고, 뷰들 사이의 일관성은 Correspondence로 표현합니다. 2022년판에서 Entity of Interest, Stakeholder Perspective, Architecture Aspect가 추가됐습니다." },
"sw-arch-process": { image: "/concept/book/sw-arch-process.webp", easy: "4단계입니다. ① 요구사항 분석 — 기능/비기능 요구를 식별·명세·검증. ② 아키텍처 분석 — 품질속성을 식별하고 우선순위를 매김(여기가 아키텍처의 진짜 출발점). ③ 아키텍처 설계 — 이해관계자별 관점(view) 정의 → 아키텍처 스타일 선택(pipe-filter, mvc, layer 등 혼용) → 후보 아키텍처 도출(배경도·관점별 다이어그램·SAD 작성). ④ 검증 및 승인 — 아키텍처 평가(요구 만족도·품질속성 간 관계) → 상세화 반복 → 최종 승인. 설계와 평가를 반복하는 게 포인트입니다." },
"se-67": { image: "/concept/book/se-67.webp", easy: "동심원 4겹입니다. 가운데부터 Entity(핵심 업무 규칙) → Use Case(응용 업무 규칙) → Interface Adapter(Presenter·View·Controller, 도메인과 인프라 사이의 번역기) → External Interface(UI·DB·프레임워크·장치). 규칙은 딱 하나 — **의존성은 항상 바깥에서 안쪽으로만 향한다.** 그래서 DB를 바꾸거나 웹 프레임워크를 갈아치워도 안쪽 업무 규칙은 그대로입니다. 가장 자주 바뀌는 것(프레임워크)을 가장 바깥에 두고, 가장 안 바뀌는 것(업무 규칙)을 한가운데 둔 구조입니다." },
"sw-arch-driver": { image: "/concept/book/sw-arch-driver.webp", easy: "요구사항이 수백 개라도 아키텍처를 실제로 좌우하는 건 몇 개뿐입니다. 그 몇 개를 골라낸 것이 아키텍처 드라이버입니다. 세 종류 — 기능 요구사항(시스템이 해야 할 기본 기능), 품질 요구사항(1분 간격으로 10만 명에게처럼 도달해야 할 목표 수준), 제약사항(J2EE로 개발하라처럼 시스템과 무관하게 주어진 조건). 비기능 제약은 다시 기술적 제약(레거시·신기술), 비즈니스 제약(거버넌스·전략, 대부분 타협 불가), 품질 제약(확장성·가용성·이식성 등)으로 나뉩니다. 적정 개수는 10개 미만입니다." },
"utility-tree": { image: "/concept/book/utility-tree.webp", easy: "품질 요구를 나무 모양으로 잘게 쪼개 시나리오까지 내려가는 도구입니다. 순서는 ①유틸리티 → ②품질속성(성능·확장성·신뢰성) → ③세분화된 품질속성(메시지 전달 속도, 동시 연결) → ④시나리오(Data 지연 5sec 이내, 동시 사용 최대 100명). 즉 추상적인 '빨라야 한다'를 측정 가능한 문장으로 바꾸는 과정입니다. 브레인스토밍과 비교하면 — 유틸리티 트리는 아키텍트 2~3명이 품질속성에서 시나리오를 뽑는 Bottom Up 방식, 브레인스토밍은 이해관계자 5~10명이 시나리오에서 품질속성을 뽑는 Top-Down 방식입니다." },
"quality-attribute-scenario": { image: "/concept/book/quality-attribute-scenario.webp", easy: "'가용성이 높아야 한다' 같은 말은 검증할 수가 없습니다. 그래서 6개 항목으로 쪼개 문장을 만듭니다 — 자극 유발원(누가), 자극(무엇이 일어나서), 환경(어떤 상황에서), 대상(무엇에게), 응답(시스템이 어떻게 반응하고), 응답 측정(그걸 어떻게 숫자로 확인하나). 예를 들어 가용성이라면 '외부에서(유발원) 예기치 못한 메시지가 와서(자극) 정상 운영 중(환경) 프로세스에(대상) 운영자에게 통지 후 계속 수행하며(응답) 정지 시간 0(응답 측정)'. 마지막 응답 측정이 있어야 나중에 검증이 됩니다." },
"sw-arch-style": { image: "/concept/book/sw-arch-style.webp", easy: "설계할 때 반복해서 나오는 문제의 정답지 모음입니다. 무엇을 중심에 두느냐로 묶으면 외워집니다 — 데이터 중심(칠판형·저장소형: 공유 데이터가 주인공), 데이터 흐름(일괄 순차형·파이프 필터형: 데이터가 흘러가며 변형됨), 가상 머신(번역기형·규칙기반: 이식성과 시뮬레이션), 호출과 리턴(주프로그램-서브루틴·원격 프로시저 호출·Layered·Client-Server: 누가 누구를 부르나), 분산 구조(Master-Slave·MSA), 중계(Event-bus·Broker: 중간에 전달자를 둠). 교재 두음이 [칠저일파 번규주원래클 마슬마서 이브]입니다." },
"se-59": { image: "/concept/book/se-59.webp", easy: "아키텍처가 품질 요구를 만족하는지 검사하는 방법들이며, 계보를 따라가면 정리됩니다. SAAM이 최초(수정 가능성·기능성 중심) → 이를 계승해 ATAM이 나왔고(품질 목표 사이의 Trade-off를 찾는 것이 핵심) → ATAM에 경제성 평가를 보탠 것이 CBAM(비용 대비 편익으로 투자 판단) → Product Line까지 확장한 것이 EATAM. 여기까지가 시나리오 기반입니다. 설계/혼합 기반으로 ADR(구성요소 간 응집도 평가)과 ARID(설계가 일부만 끝났어도 평가 가능, ATAM·SAAM에 설계검토 ARD를 섞음)가 있습니다." },
"gj-144": { image: "/concept/book/gj-144.webp", easy: "이 프로젝트를 할지 말지를 돈으로 따지는 네 가지 잣대입니다. BCR은 '1원 넣어 몇 원 버나'(수익/비용, 1보다 크면 남는 장사). PP는 '넣은 돈 언제 다 회수하나'(짧을수록 좋지만 회수 이후 수익은 안 봄). NPV는 '미래에 들어올 돈을 오늘 돈 가치로 환산하면 얼마 남나'(0보다 크면 해도 됨). IRR은 'NPV를 딱 0으로 만드는 할인율'로, 이 값이 우리 요구수익률보다 높으면 합니다. BCR·PP는 계산이 쉬운 대신 화폐의 시간가치를 못 보고, NPV·IRR은 시간가치를 반영합니다." },
"pm-plan-doc": { image: "/concept/book/pm-plan-doc.webp", easy: "프로젝트를 어떻게 굴릴지 적어 둔 최상위 문서로, 범위·일정·인력 같은 개별 계획서들을 하나로 묶은 것입니다. 목차 9개를 두음으로 외웁니다 — 개(개요)·업(업무 범위)·일(일정계획)·인(인력관리)·교(교육계획)·통(통제)·품(품질활동)·인(인수조건)·측(측정계획). 즉 '무엇을·언제·누가·어떻게 확인하고 넘길지'를 한 문서에 다 적어 둔 것입니다." },
"pm-24": { image: "/concept/book/pm-24.webp", easy: "'어디까지가 이 프로젝트 일인가'를 정하고 지키는 지식영역입니다. 6단계로 흐릅니다 — 계획 수립(어떻게 관리할지) → 요구사항 수집(뭘 원하나) → 범위 정의(범위기술서 작성) → WBS 작성(작업으로 쪼갬) → 범위 확인(고객 승인받기) → 범위 통제(변경 관리). 앞 4개는 계획 단계, 뒤 2개는 감시·통제 단계입니다. 범위 확인은 '고객이 인도물을 공식 승인'하는 것이라 품질 검사(검증)와 다릅니다." },
"pm-25": { image: "/concept/book/pm-25.webp", easy: "이해관계자가 뭘 원하는지 캐내는 기법 모음입니다. 성격별로 묶어 두면 외우기 쉽습니다 — 데이터 수집(인터뷰·포커스그룹·설문·벤치마킹·브레인스토밍), 데이터 분석(문서 분석), 데이터 표현(마인드매핑·친화도), 의사결정(다기준 의사결정·투표), 대인관계(명목집단·관찰·촉진), 기타(프로토타입·컨텍스트 다이어그램·전문가 판단). 교재 두음이 [수분표의대프컨]입니다." },
"srs": { image: "/concept/book/srs.webp", easy: "요구사항을 공식 문서로 못 박은 것이 SRS이고, 이후 분석·설계·구현·유지보수의 판단 기준이 됩니다. 세 덩어리로 외웁니다. ① 명세 원리 [명완검일수추개] — 명확성(뜻이 하나), 완전성(빠짐없이), 검증가능성(확인 가능하게), 일관성(모순 없이), 수정용이성, 추적성, 개발 후 이용성. ② 작성 시 유의사항 [이상기제테품]. ③ 목차 — 개요(범위·목적·시스템개요·제약), 기능적 요구사항, 기타 요구 및 제약(성능·논리DB·SW속성·HW), 인수 조건." },
"pm-27": { image: "/concept/book/pm-27.webp", easy: "할 일을 '인도물 중심'으로 계층적으로 쪼갠 그림입니다. 맨 아래 칸이 작업 패키지(Work Package)로, 관리 가능한 크기(보통 80시간 내외)까지 잘게 나눕니다. 핵심 규칙이 100% rule — 각 레벨의 작업량·예산 합이 상위의 100%가 되어야 합니다(빠뜨려도 안 되고 더해도 안 됨). 작업 패키지들을 묶어 원가를 관리하는 단위가 통제 계정(Control Account)이고, 각 항목의 상세 내용은 WBS 사전에, 고유 번호는 Code of Account(1.x.x)에 적습니다." },
"pm-30": { image: "/concept/book/pm-30.webp", easy: "둘 다 범위가 부푸는 현상인데 원인이 정반대입니다. Scope Creep은 '고객이 요구했는데 관리 없이 슬금슬금 들어온' 것 — 원인은 범위관리 실패이고, 변경 요청을 리뷰·승인 절차에 태워서 막습니다. Gold Plating은 '고객이 요구하지도 않았는데 우리가 좋으라고 더 넣은' 것 — 원인은 품질관리·요구사항 확인 실패이고, PM 승인 없는 기능 추가 금지로 막습니다. 한 줄 요약: Creep = 고객발 통제 실패, Gold Plating = 개발자발 과잉 서비스." },
"duration-estimating": { image: "/concept/book/duration-estimating.webp", easy: "각 활동이 며칠 걸릴지 추정하는 기법 모음이며, 두음이 [전유모3상데의미]입니다. 전문가 판단(경험자에게 물어봄), 유사 산정(비슷한 과거 프로젝트 참조 — 정보가 부족할 때), 모수 산정(과거 실적으로 수식을 만들어 계산), 3점 산정(낙관·비관·평균 3개로 계산 — 위험 반영), 상향식 산정(WBS 최하위부터 더해 올림 — 가장 정확하지만 오래 걸림), 데이터 분석(대안 분석·예비 분석으로 버퍼 반영), 의사결정, 미팅." },
"pm-35": { image: "/concept/book/pm-35.webp", easy: "기간을 하나로 못 박지 않고 낙관치(O)·평균치(M)·비관치(P) 세 개로 잡아 계산합니다. 삼각분포는 그냥 셋의 평균 (O+M+P)/3, 베타분포(PERT)는 가장 가능성 높은 값에 4배 가중치를 줘서 (O+4M+P)/6 입니다. 표준편차는 (P−O)/6 이고, 1σ·2σ·3σ가 각각 신뢰도 68%·95%·99%입니다. 유사 산정(과거 사례 참조)·모수 산정(수식)과 비교하면, 3점 산정만 유일하게 '위험(불확실성)'을 계산에 넣습니다." },
"pm-36": { image: "/concept/book/pm-36.webp", easy: "네트워크 다이어그램을 그려서 '이 프로젝트 최소 며칠 걸리나'를 구합니다. 앞에서부터 계산(전진)해 ES·EF를 구하고, 뒤에서부터 계산(후진)해 LS·LF를 구합니다. 그 차이가 여유시간 — TF = LF − EF = LS − ES 입니다. **TF가 0인 활동들을 이은 경로가 임계경로(Critical Path)** 이고, 여기가 하루라도 밀리면 프로젝트 전체가 밀립니다. TF는 '프로젝트 종료일을 안 밀리게 하는 총 여유', FF는 '바로 뒤 활동의 시작을 안 밀리게 하는 여유'로 FF ≤ TF 입니다." },
"pm-37": { image: "/concept/book/pm-37.webp", easy: "사람들이 각 작업마다 몰래 넣어 둔 여유시간을 다 빼앗아 한곳에 모아 두고, 그 통합 버퍼가 얼마나 줄었는지로 프로젝트를 관리하는 방법입니다. 버퍼는 셋 — 프로젝트 버퍼(임계연쇄 끝에 두는 총 버퍼, 안전/모니터링/행동 영역으로 나눠 관리), 피딩 버퍼(임계연쇄로 합류하는 곁가지 끝에 둬서 본류 착수 지연을 막음), 자원 버퍼(작업 착수 전에 담당 자원에게 미리 알려주는 경보). CPM과 비교하면 CPM은 ES(빨리 시작)·진척율 관리, CCM은 LS(늦게 시작)·버퍼 소진율 관리이고, 자원 제약을 처음부터 계획에 반영합니다." },
"schedule-compression": { image: "/concept/book/schedule-compression.webp", easy: "범위는 그대로 두고 일정만 당기는 두 가지 방법입니다. Crashing(공정 압축)은 임계경로에 사람·초과근무를 더 넣어 기간을 줄입니다 — 돈이 더 듭니다(10일 500만원 → 8일 800만원). Fast Tracking(공정 중첩)은 원래 순서대로 하던 작업을 겹쳐서 병행합니다 — 돈은 안 들지만 앞 작업이 바뀌면 재작업 위험이 커집니다. 그래서 예산 여유가 있으면 Crashing, 없으면 Fast Tracking입니다. 참고로 Fast Tracking은 임계경로 상의 활동에는 적용할 수 없습니다." },
"pm-46": { image: "/concept/book/pm-46.webp", easy: "'지금 일정과 비용이 계획대로인가'를 숫자 하나로 보는 기법입니다. 값 세 개만 알면 됩니다 — PV(오늘까지 하기로 계획한 일의 값), EV(오늘까지 실제로 끝낸 일의 값), AC(오늘까지 실제로 쓴 돈). 여기서 SV = EV − PV(음수면 일정 지연), CV = EV − AC(음수면 예산 초과)가 나오고, 나눗셈으로 SPI = EV/PV, CPI = EV/AC(1보다 작으면 나쁨)가 나옵니다. 헷갈릴 때는 '항상 EV가 앞에 온다'로 기억하면 됩니다. 지연이면 Crashing·Fast Tracking, 예산 초과면 원가 통제로 대응합니다." },
"pm-50": { image: "/concept/book/pm-50.webp", easy: "품질 문제를 통계로 잡는 고전 도구 7개입니다. 쓰임새로 묶으면 외워집니다 — 현상 파악(체크시트: 빠짐없이 세기 / 파레토차트: 빈도 순으로 세워 중점 문제 찾기 / 히스토그램: 분포 모양 보기), 자료 관리(관리도: 공정이 통계적으로 안정한지 판정), 원인 분석(특성요인도=생선뼈 그림: 결과와 원인의 관계 / 산점도: 두 변수의 상관관계 / 층별: 데이터를 부분집단으로 쪼개 원인 규명). 교재 두음이 현원자 · 체파히 · 특산층 · 관입니다." },
"pm-51": { image: "/concept/book/pm-51.webp", easy: "개발하다 보면 문서·코드가 계속 바뀌는데, '지금 무엇이 공식 버전인가'를 잃지 않게 관리하는 활동입니다. 절차는 식별 → 통제 → 감사 → 기록입니다. 형상 식별로 관리 대상과 기준선(Baseline)을 정하고, 변경 요청이 오면 CCB(형상관리 통제 위원회)가 심사해 승인한 것만 반영하며, 체크리스트로 감사하고, 결과를 저장소(SVN·Git)에 기록합니다. 기준선도 단계마다 이름이 달라 기능적 → 분배적 → 설계 → 시험 → 제품 → 운용 순으로 갑니다." },
"sw-quality-cost": { image: "/concept/book/sw-quality-cost.webp", easy: "품질에 쓰는 돈을 네 갈래로 나눕니다. 적합 품질비용은 잘 만들려고 쓰는 돈 — 예방비용(교육·표준·계획)과 평가비용(테스트·리뷰·인스펙션). 부적합 품질비용은 잘못돼서 나가는 돈 — 내부실패비용(고객에게 가기 전에 고쳐서 드는 재작업 비용)과 외부실패비용(고객에게 간 뒤 터져서 드는 하자보수·법적 책임·신용 실추). 핵심 메시지는 '앞의 둘에 돈을 더 써서 뒤의 둘을 줄여라'이고, 특히 외부실패비용이 압도적으로 비쌉니다." },
"pm-53": { image: "/concept/book/pm-53.webp", easy: "업무마다 누가 무슨 역할인지 표로 못 박는 도구입니다. R(Responsible)=실제로 일하는 사람, A(Accountable)=최종 책임지고 승인하는 사람, C(Consulted)=자문해 주는 사람, I(Informed)=결과만 통보받는 사람. 시험에 나오는 규칙이 있습니다 — 한 업무에 A는 반드시 있어야 하고 반드시 한 명이어야 합니다(여럿이면 의사소통 혼란). 반대로 C와 I는 없어도 됩니다. R과 A는 한 사람이 겸할 수 있습니다." },
"pm-40": { image: "/concept/book/pm-40.webp", easy: "한 사람이 같은 기간에 두 개 일에 배정돼 과부하가 걸릴 때 조정하는 기법이며, 둘의 차이는 딱 하나 — 주공정(완료일)을 건드리느냐입니다. Resource Leveling(자원 평준화)은 자원 한계를 지키기 위해 일정을 미뤄서라도 평탄하게 만듭니다 → 주공정이 바뀌고 보통 기간이 늘어납니다. Resource Smoothing(자원 평활화)은 완료일을 지키면서 여유시간(Free/Total Float) 안에서만 조정합니다 → 주공정이 안 바뀝니다. '납기를 포기해도 되면 Leveling, 안 되면 Smoothing'." },
"pm-55": { image: "/concept/book/pm-55.webp", easy: "사람을 어떻게 움직이게 하느냐에 대한 이론들이며, 관점 3개로 먼저 나눕니다 [내과강] — 내용 이론(무엇이 동기를 주나, What), 과정 이론(어떻게 동기가 생기나, How), 강화 이론(왜 일어나나, Why). 내용 이론에는 매슬로우 욕구 5단계(생·안·사·존·자), 허즈버그 2요인(위생요인은 불만족만 없애고 동기요인이 만족을 만듦), 맥그리거 X·Y이론, 맥클랜드 3욕구(성취·결연·권력)가 있고, 과정 이론에는 기대·목표설정·공정성 이론, 강화 이론에는 스키너가 있습니다." },
"pm-56": { image: "/concept/book/pm-56.webp", easy: "팀은 처음부터 잘 굴러가지 않고 다섯 단계를 거칩니다 [형스표수해] — 형성(서로 눈치 보며 탐색), 스토밍(갈등이 터짐, 효과성이 오히려 바닥), 표준화(규칙과 신뢰가 생김), 수행(성과가 나옴), 해산(마무리·Lessons Learned). 시험 포인트는 단계별 리더십입니다 — 형성기는 지시형(Direct), 격동기는 지도형(Coach), 표준화는 참여형(Participate), 수행기는 위임형(Delegate). 그래프가 U자를 그리는 이유는 스토밍에서 효과성이 떨어졌다가 회복되기 때문입니다." },
"conflict-management": { image: "/concept/book/conflict-management.webp", easy: "갈등 해결 방법 5개를 '내 주장을 얼마나 세우나 × 상대와 얼마나 협력하나' 2축으로 놓으면 한 번에 정리됩니다. Withdrawal(회피)=주장 낮음·협력 낮음(사소하거나 이길 가망 없을 때), Smoothing(수용)=주장 낮음·협력 높음(분위기가 더 중요할 때), Compromising(타협)=중간·중간(둘 다 조금씩 양보), Forcing(강요)=주장 높음·협력 낮음(급하거나 꼭 필요한 정책), Problem Solving(문제해결/대면)=주장 높음·협력 높음. **가장 바람직한 것은 Problem Solving, 가장 나쁜 것은 Withdrawal**입니다." },
"pm-59": { image: "/concept/book/pm-59.webp", easy: "위험을 찾아서 대비하는 7단계 활동입니다. 계획 수립 → 위험 식별(무엇이 위험인가, 산출물은 위험 관리대장) → 정성적 분석(확률·영향으로 우선순위 매기기) → 정량적 분석(숫자로 영향 계산) → 대응 계획 수립(여기까지가 계획) → 대응 실행 → 감시 및 통제. 정성적이 먼저이고 정량적이 나중인 이유는, 다 계산하기엔 비싸니까 우선순위를 먼저 걸러내기 때문입니다. 보헴의 10대 위험 요소(인력 부족, 비현실적 일정·예산, 요구사항 변경 등)도 같이 외웁니다." },
"pm-60": { image: "/concept/book/pm-60.webp", easy: "식별된 위험을 '확률 × 영향'으로 등급 매겨 우선순위를 정하는 단계입니다. 핵심 도구가 P-I Matrix(확률-영향 매트릭스) — 확률과 영향을 곱해 빨강/노랑/초록으로 등급화합니다. 모수를 3개 보고 싶으면 버블차트(계층적 차트)를 쓰는데, 버블 크기가 영향 값이라 클수록 위험합니다. 비슷한 원인끼리 묶을 때는 RBS(Risk Breakdown Structure)를 씁니다. 정량적 분석과 달리 숫자로 계산하지 않고 등급으로 줄 세우는 것이 이 단계입니다." },
"pm-62": { image: "/concept/book/pm-62.webp", easy: "정성적으로 걸러낸 위험이 프로젝트 전체에 미치는 영향을 실제 숫자로 계산하는 단계입니다. 도구 4개만 기억하면 됩니다 — 영향도(원인과 결과 관계를 도표로), 민감도 분석(다른 건 고정하고 하나만 흔들어 봄, 결과물이 토네이도 다이어그램), 의사결정 분석(EMV = 확률 × 금액으로 기대값 비교, 의사결정나무), 모의실험(몬테카를로로 수천 번 돌려 분포를 봄). 즉 '뭐가 제일 크게 흔드나(민감도) → 어느 쪽이 이득인가(EMV) → 전체 분포는 어떤가(몬테카를로)' 순입니다." },
"monte-carlo": { image: "/concept/book/monte-carlo.webp", easy: "정량적 위험 분석의 '모의실험' 기법입니다. 각 작업 기간이 '5일'처럼 딱 정해진 게 아니라 확률분포로 흩어져 있다고 보고, 주사위를 던지듯 무작위로 값을 뽑아 프로젝트 총 기간을 계산합니다. 이걸 수천~수만 번 반복하면 결과가 분포로 쌓이고, '80% 확률로 몇 일 안에 끝난다' 같은 답을 얻습니다. 절차는 변수 정의 → 무작위 샘플링 → 시뮬레이션 실행 → 결과 집계 네 단계입니다." },
"pm-64": { image: "/concept/book/pm-64.webp", easy: "위험을 어떻게 처리할지 정하는 단계이며, 나쁜 위험과 좋은 위험(기회)의 대응이 짝을 이룹니다. 부정적 [EATMA] — 에스컬레이션(내 권한 밖이라 위로 올림), 회피(위험 자체를 없앰: 범위 축소·일정 연기), 전가(보험처럼 남에게 넘김), 완화(발생 확률이나 영향을 낮춤), 수용(그냥 감수). 긍정적 [EESEA] — 에스컬레이션, 활용(반드시 실현되게 함), 공유(합작 투자처럼 남과 나눔), 증대(확률·효과를 키움), 수용. 왼쪽일수록 적극적, 오른쪽일수록 소극적 대응입니다. 수용은 문서만 남기는 수동적 수용과 예비비를 잡아 두는 능동적 수용으로 갈립니다." },
"pm-14": { image: "/concept/book/pm-14.webp", easy: "PMBOK 7판부터는 '이렇게 해라'(프로세스 중심)에서 '이런 원칙과 성과를 지향해라'로 바뀌었습니다. 8개 성과 영역 [이팀개기 성인측불] — 이해관계자, 팀, 개발방식 및 생애주기, 기획, 성과, 인도, 측정, 불확실성. 12원칙 [스팀이가 시리조품 복위적변] — 스튜어드십, 팀, 이해관계자, 가치, 시스템 사고, 리더십, 조정(Tailoring), 품질, 복잡성, 위험, 적응성과 복원력, 변화. 성과 영역은 '무엇을 잘해야 하나', 원칙은 '어떤 태도로 할 것인가'입니다." },
"pm-90": { image: "/concept/book/pm-90.webp", easy: "둘 다 프로젝트를 들여다보지만 서 있는 자리가 다릅니다. 감리는 제3자·독립적 관점에서 기술적 품질을 평가합니다 — 전자정부법 57조 1항에 따른 의무사항이고, 5억원 이상이면 의무이며, 감리법인이 수행하고 감리계획서·감리수행결과보고서를 냅니다. PMO는 발주자 관점에서 프로젝트 전 과정에 관리적으로 개입합니다 — 전자정부법 64조의2에 따른 권고사항(2013년부터 공공 정보화 사업에 도입 의무화)이고, 컨설팅업체·회계법인·대형 SI가 수행하며 SRS·아키텍처 정의서 등을 냅니다. 한 줄: 감리=평가·독립, PMO=관리·발주자 편." },
"agile-manifesto": { image: "/concept/book/agile-manifesto.webp", easy: "애자일 선언문은 '왼쪽도 가치 있지만 오른쪽을 더 중시한다'는 4쌍입니다 — 공정·도구보다 **개인과 상호작용**, 포괄적 문서보다 **작동하는 소프트웨어**, 계약 협상보다 **고객과의 협력**, 계획 준수보다 **변화에 대응**. 주의할 점은 왼쪽을 버리라는 게 아니라 우선순위를 말한 것입니다. 12원칙은 고객만족·요구변경 수용·짧은 배포·일일 의사소통·동기부여·면대면 대화·지속 가능한 개발·작동하는 SW·좋은 기술·단순성·자기조직적 팀·정기적 회고입니다." },
"pm-73": { image: "/concept/book/pm-73.webp", easy: "2~4주짜리 짧은 주기(Sprint)를 반복해 조금씩 완성해 가는 애자일 방법론입니다. 흐름은 — 제품 기능 목록(Product Backlog)에 우선순위를 매기고 → 스프린트 계획 회의에서 이번 주기에 할 것(Sprint Backlog)을 뽑고 → 매일 15분 데일리 스크럼으로 진척을 확인하고(번다운차트에 표시) → 끝나면 스프린트 리뷰로 결과물을 검토하고 → 회고(Retrospective)로 개선점을 찾습니다. 사람은 셋 — Product Owner(무엇을 만들지 정함, 운영엔 관여 안 함), Scrum Master(장애물 제거하는 조력자, 관리자가 아님), Scrum Team(실제로 만듦)." },
"pm-86": { image: "/concept/book/pm-86.webp", easy: "스프린트 안에서 '남은 일'이 얼마나 줄고 있는지를 보는 차트입니다. 가로축은 날짜, 세로축은 남은 작업량(스토리 포인트)이고, 계획선은 오른쪽 아래로 곧게 내려갑니다. 실제선이 계획선 위에 있으면 일정보다 늦은 것, 아래에 있으면 빠른 것입니다. 기울기가 곧 팀의 작업 속도(Velocity)입니다. EVM과 비교하면 — 번다운은 애자일용이고 남은 일을 100에서 0으로 태워 없애는 관점, EVM은 전통 방법론용이고 원가·획득가치 기반의 지표 관점입니다." },
"pm-74": { image: "/concept/book/pm-74.webp", easy: "의사소통과 테스트 주도 개발(TDD)을 축으로 아주 짧은 주기를 반복하는 애자일 방법론입니다. 핵심 가치 5개 [용단커피존] — 용기, 단순성, 커뮤니케이션, 피드백, 존중. 실천 항목 12개 중 시험에 자주 나오는 것은 페어 프로그래밍(둘이 한 대에서 개발), 공동 코드 소유(누구나 수정 가능), 지속적 통합(하루에도 몇 번씩 빌드), 리팩토링(기능은 그대로 두고 구조 개선), 테스트 주도 개발, 작은 릴리스(2주 단위), 주당 40시간 작업, 고객 상주(On-Site Customer)입니다." },
"pm-77": { image: "/concept/book/pm-77.webp", easy: "도요타 생산방식에서 온 '낭비 제거' 사고를 소프트웨어에 적용한 방법론입니다. 원칙 7개 [나배결빠 위통씨] — 낭비 제거, 배움 증폭, 늦은 결정(정보가 최대한 모일 때까지), 빠른 인도, 팀에 권한 위임, 통합성 구축, 전체를 볼 것. 그리고 없애야 할 낭비 7개 [미가재작 이지결] — 미완성 작업, 가외기능(안 쓰는 기능), 재학습, 작업전환, 이관(핸드오프), 지연, 결함. 파생으로 린 소프트웨어 개발, 린 UX, 린 스타트업(MVP로 빨리 내고 반응 보기), 린 애자일이 있습니다." },

// ─────────────── 3주차: 인공지능(AI) — 교재 슬라이드 + 쉬운 설명 ───────────────
"ml-learning-methods": { image: "/concept/book/ml-learning-methods.png", easy: "머신러닝이 배우는 방식은 '정답지(Label)가 있느냐'로 갈립니다. 지도학습은 정답이 붙은 데이터로 배웁니다 — 고양이 사진에 '고양이'라고 표시해 학습시키면 새 영상에서 고양이를 찾아냅니다(Decision tree, Regression, Neural Network 등). 비지도학습은 정답 없이 데이터끼리의 유사성만으로 스스로 무리를 짓고(K-Means, PCA 등), 준지도학습은 정답 있는 데이터로 먼저 배운 뒤 정답 없는 데이터로 이어 배웁니다. 강화학습은 정답 대신 보상(Reward)을 최대화하도록 시행착오로 배우는 방식 — 알파고·게임 AI가 대표입니다(Q-Learning, DQN, PPO). 진화학습은 생물 진화를 흉내 낸 탐색(유전 알고리즘)입니다. 구분 축 한 줄: 지도(정답 있음)·비지도(없음)·준지도(일부)·강화(보상)·진화(진화 모방)." },
"transfer-learning": { image: "/concept/book/transfer-learning.png", easy: "이미 잘 배운 모델의 지식을 가져와 내 문제에 맞게 조금만 더 학습시키는 기법입니다. 수백만 장으로 학습된 모델의 아래 계층은 가중치를 고정(Freeze)해 그대로 재사용하고, 위 계층만 내 데이터로 다시 학습(Fine Tuning)합니다 — 데이터가 부족하거나 훈련 시간을 줄여야 할 때 실무에서 가장 먼저 꺼내는 카드입니다. 주요 기법 [파프도레] — 파인튜닝, 프리트레인드 모델, 도메인 적응, 레이어 재사용. 유형 [적태도 레귀변자] — 적용 범위로는 과업(Task) 전이(영상인식→음성인식처럼 응용분야가 바뀜)와 도메인 전이(영불번역기→영한번역기처럼 데이터 분포가 다름), 데이터셋 레이블 여부로는 귀납(Inductive)·변형(Transductive)·자율(Unsupervised)입니다." },
"self-supervised": { image: "/concept/book/self-supervised.png", easy: "정답(레이블)이 없는 데이터에 스스로 문제를 만들어 배우는 '지도학습 형태의 비지도학습'입니다. 먼저 프리텍스트 태스크 단계에서 스스로 만든 문제(가린 부분 맞히기 등)를 풀며 데이터의 핵심 표현을 뽑는 법을 배우고, 다운스트림 태스크 단계에서 그 표현으로 소량의 레이블 데이터만 가지고 실제 목표 작업(이미지 분류·물체 인식)을 수행하며, 마지막에 파인튜닝으로 가중치를 미세 조정합니다 — 학습단계 [프다파]. GPT가 '다음 단어 맞히기'로 배우는 것이 대표 사례입니다. 유형은 생성 기반(오토인코더·GAN·MAE), Pre-text Task 기반(공간·시간 관계), 대조학습 기반(SimCLR, MoCo)입니다." },
"federated-learning": { image: "/concept/book/federated-learning.png", easy: "내 데이터는 단말 밖으로 내보내지 않고, 학습 결과(파라미터)만 서버로 보내 다 같이 모델을 키우는 분산 학습입니다. 동작 원리 [전지취갱] — ① 전역 모델 분배(서버가 참여 단말에 모델을 나눠줌) → ② 지역 모델 갱신(각 단말이 자기 데이터로 학습) → ③ 지역 모델 취합(파라미터만 압축·암호화해 서버로) → ④ 전역 모델 갱신(취합해 전체 모델 개선). 스마트폰 키보드 추천이 대표 사례 — 내가 뭘 입력했는지는 서버로 안 가고 학습된 파라미터만 갑니다. 알고리즘은 FedSGD(한 번 학습마다 전달)와 FedAVG(K번 반복 후 전달해 수렴 시간 단축)이고, 핵심 가치는 개인정보 보호입니다." },
"machine-unlearning": { image: "/concept/book/machine-unlearning.png", easy: "학습이 끝난 모델에서 특정 데이터의 흔적만 골라 지워, 애초에 배운 적 없는 것처럼 만드는 기술입니다. '잊혀질 권리'(GDPR) 때문에 필요해졌습니다 — 내 데이터를 지워달라고 요구하면, 처음부터 재학습하는 대신 언러닝으로 그 데이터가 모델에 미친 영향만 제거합니다. 절차는 언러닝 대상 정의 → 영향도 분석 → Impair(지울 데이터에 노이즈를 주입해 고의로 성능 저하) → Repair(나머지 데이터의 정확도 회복) → 평가·검증(Forget/Retain accuracy). 기술 요소로 Error-maximizing Noise, Impair & Repair 프레임워크, Zero-glance Unlearning(대상 데이터에 직접 접근 없이 언러닝), SISA(Sharded·Isolated·Sliced·Aggregated)가 있습니다. 2025.08 ITPE FR 기출." },
"vertical-ai": { image: "/concept/book/vertical-ai.png", easy: "특정 산업(의료·금융·제조)에 최적화된 데이터로 그 분야 문제만 깊게 파는 AI입니다. 반대말이 수평적 AI — ChatGPT처럼 광범위한 데이터로 뭐든 하는 범용 모델입니다. 만드는 방법은 수평적 AI(Pre-trained Model)를 도메인 특화 데이터로 파인튜닝하는 것 — 그래서 기술 요소가 sLLM(소형 언어 모델)·파인 튜닝·도메인 특화 알고리즘이고, 상대적으로 저비용이라 주로 스타트업·중소기업이 개발합니다(수평적 AI는 대형 테크 기업 주도·고비용·클라우드 인프라 필수). 활용: 의료 영상 분석, 금융 신용평가, 제조 공정 최적화." },
"physical-ai": { image: "/concept/book/physical-ai.png", easy: "로봇·자율주행차 같은 물리적 기기에 탑재되어 현실 세계를 인식·이해하고 상호작용하는 AI입니다. 챗봇이 화면 속에 있다면, 피지컬 AI는 몸을 갖고 세상에 나온 AI입니다. 구성 — 기기 쪽: 카메라/Lidar 센서, 온디바이스 AI, 모델 경량화(양자화·파라미터 가지치기·증류학습), sLLM, AI칩셋 / 개발 프레임워크 쪽: LWM(Large World Model — 가상 세계를 만들어 합성데이터로 학습 데이터 생성), Tokenizer(3D 데이터 토큰화), 디지털 트윈, AI 가속기 / 벡터DB. 엔비디아 솔루션이 시험 포인트: 코스모스(현실 객체 인식)·옴니버스(가상 공간 생성)·DGX(가상 공간 학습)·AGX(자율주행용 개발 플랫폼). 2025 KPC·ITPE 모의고사 기출." },
"on-device-ai": { image: "/concept/book/on-device-ai.png", easy: "클라우드 서버가 아니라 스마트폰 같은 단말 안에서 AI 추론을 돌리는 기술입니다. 왜 쓰나 — 클라우드 AI는 왕복 지연(레이턴시), 운영 비용 폭증, 민감 데이터 유출 위험, 오프라인 작동 불가라는 한계가 있어서입니다. 대신 단말은 연산·메모리·전력이 부족하므로 경량화가 필수 — 연산 최적화(양자화·프루닝·저랭크 분해), 전력 관리(DVFS·배치 크기조정), 발열 관리(점진적 조정·작업 분산)로 버팁니다. 기술 스택은 하드웨어(NPU·GPU·DSP) → 하드웨어 추상화 계층(NNAPI·Qualcomm SNPE·ARM NN) → 런타임(TensorFlow Lite·PyTorch Mobile·ONNX Runtime Mobile) → 경량 모델(MobileNet·EfficientNet·TinyML). 갤럭시 실시간 통역이 대표 사례입니다. 2025.10 ITPE 모의고사 기출." },
"aei": { image: "/concept/book/aei.png", easy: "AI에 감성지능을 결합해, 사람의 감정을 알아채고 감정적으로 반응하는 인공지능입니다. 기술 구성 3단계 — 감성 인식(심전도 ECG·피부반응 GSR·뇌파 EEG 같은 생리신호 분석 + 얼굴 PCA/LDA·음성 MFCC/HMM 같은 행태반응 분석) → 감성 생성(감성 엔진으로 반응을 만들고 TTS·멀티모달 UI로 표현) → 감성 증강(OCC 감성 평가 모델로 감성 유형을 정의하고 감성 추론기로 새로운 감성을 추론). 적용: 운전자 감정에 맞춰 음악·온도·조명을 바꾸는 AEI 자동차, 감정을 흉내내는 지능형 감성 로봇, 우울증 진단·치료 헬스케어." },
"activation-function": { image: "/concept/book/activation-function.png", easy: "신경망의 각 뉴런이 받은 신호를 '내보낼까 말까, 얼마나 세게 내보낼까'를 결정하는 함수입니다. 핵심은 비선형 변환 — 이게 없으면 층을 아무리 쌓아도 직선(선형) 계산만 되어 복잡한 문제를 못 풉니다. 단극성 [단시레] — 시그모이드(0~1 출력, 이진 분류 출력층에 쓰지만 기울기 소실 문제)와 ReLU(음수는 0, 양수는 그대로 — 빠르고 기울기 소실을 막아 깊은 신경망 DNN을 가능하게 함). 양극성 [양탄리프] — Tanh(-1~1 출력, 시그모이드보다 성능 좋음), Leaky ReLU(음수에 작은 기울기 0.01을 남겨 ReLU의 '음수에서 기울기 0' 문제 해결), PReLU(음수 기울기를 학습으로 정함). 시그모이드의 0.5 문제·기울기 소실이 단골 문제점입니다." },
"loss-function": { image: "/concept/book/loss-function.png", easy: "모델의 예측값과 실제값의 차이(오차)를 숫자 하나로 계산하는 함수입니다. 이 오차 점수가 있어야 옵티마이저가 역전파로 가중치를 고칠 방향을 압니다 — 시험 점수가 있어야 어디를 더 공부할지 아는 것과 같습니다. 문제 유형별로 골라 씁니다: 회귀(연속값 예측)는 MSE(차이를 제곱해 평균 — 큰 오차를 부각)·RMSE(제곱근으로 왜곡 감소)·MAE(절대값 평균), 이진분류는 BCE(시그모이드와 짝 — 맞으면 0, 틀리면 무한대로), 다중분류는 CCE(원-핫 인코딩 레이블)·SCCE(정수 레이블) — 소프트맥스와 짝입니다." },
"ml-optimizer": { image: "/concept/book/ml-optimizer.png", easy: "손실함수가 매긴 오차를 보고 가중치를 '어느 방향으로 얼마나' 고칠지 정하는 알고리즘 — 안개 낀 산에서 가장 낮은 골짜기를 찾아 내려가는 등산가입니다. 계보로 외우면 쉽습니다: SGD(경사를 따라 내려가지만 오버슈팅·지역 최소점 문제) → 관성 계열: Momentum(관성을 더해 지역 최소점 탈출) → NAG(관성으로 이동한 지점의 기울기를 미리 봐 오버슈팅에 제동) / 개별 학습률 계열: AdaGrad(파라미터마다 다른 학습률 적용) → RMSProp(지수이동평균으로 학습률이 0에 수렴하는 것 방지)·AdaDelta(학습률 자체를 안 씀) → 그리고 둘을 합친 Adam(RMSProp+Momentum)이 실무 기본값입니다." },
"svm": { image: "/concept/book/svm.png", easy: "두 무리를 가르는 경계를 긋되, 양쪽에서 가장 가까운 데이터(Support Vector)와의 거리(Margin)가 최대가 되는 경계를 찾는 분류 알고리즘입니다. 길을 내되 양옆 집에서 최대한 멀게 내는 것 — 여유가 클수록 새 데이터가 와도 잘 버팁니다(과적합 회피). 구성요소: Support Vector(분류 경계에 가장 가까운 데이터), Margin(그 거리 — 이상치를 허용 안 하면 하드마진, 허용하면 소프트마진), 초평면(다차원 공간을 가르는 n-1차원 평면), 커널기법(직선으로 못 가르는 비선형 데이터를 고차원 feature space로 변환해 선형으로 가르는 트릭). 고차원 문제에서 최대 마진 초평면으로 차원의 저주를 회피하는 것도 특징입니다." },
"data-labeling": { image: "/concept/book/data-labeling.png", easy: "라벨링은 AI가 기계학습에 쓸 수 있도록 원천데이터에 목적에 맞는 정보(정답)를 부착하는 활동이고, 어노테이션은 인간이 부여한 식별기준을 기계가 인식할 수 있도록 추가 정보를 기입하는 과정입니다. 데이터 유형별 방식이 시험 포인트 — 텍스트: 텍스트분류(클래스 라벨)·개체명인식(단어 라벨)·관계-의존성정의 / 이미지: 이미지분류(클래스 라벨)·객체인식(바운딩박스=사각형, 폴리곤=다각형) / 비디오: 객체인식(바운딩박스·키포인트)·객체추적(폴리곤·폴리라인) / 오디오: 분류(클래스 라벨)·음성인식(텍스트 전사). 국내 'AI 학습용 데이터 구축 사업'의 핵심 공정이기도 합니다." },
"knowledge-distillation": { image: "/concept/book/knowledge-distillation.png", easy: "크고 똑똑한 교사 모델(Teacher)의 지식을 작고 가벼운 학생 모델(Student)에게 옮겨, 성능은 비슷하면서 훨씬 가벼운 모델을 만드는 기법입니다. 비결은 소프트 타겟 — 교사가 '정답은 개'라고만 알려주는 게 아니라 '개 90%·늑대 8%·고양이 2%'라는 확률 분포(판단의 뉘앙스)까지 전달합니다. 손실은 Soft Loss(교사·학생의 확률분포 차이)와 Hard Loss(실제 레이블과의 차이)를 함께 씁니다. 유형 [로피관] — 로짓 기반(출력값이 지식)·피처 기반(중간 계층이 지식)·관계 기반(관계가 지식). 전달 방법 [오온자] — 오프라인(교사 고정)·온라인(교사·학생 실시간 동시 학습)·자기 증류(한 네트워크가 교사 겸 학생). 온디바이스 AI 경량화의 핵심 기술이며 123회 컴시응 기출입니다." },
"batch-normalization": { image: "/concept/book/batch-normalization.png", easy: "학습 시 미니배치 단위로, 각 층에 들어가는 값의 분포를 평균 0·분산 1로 맞춰주는 기법입니다. 층을 지날수록 데이터 분포가 제멋대로 흔들리면 학습이 느려지고 기울기가 사라지는데, 매 층 입구에서 저울의 눈금을 다시 맞춰주는 셈입니다. 절차: 미니배치의 평균·분산 계산 → 활성화값 정규화 → Scale/Shift 변환 후 활성함수·은닉층 적용 → 출력 확인·반복. 효과가 시험 포인트: 기울기 소실 문제 해결, Learning Rate를 자유롭게(크게) 설정해 빠른 학습, 자체 Regularization 효과로 Dropout 없이도 과적합 억제, 초기값 선택 의존성 저하." },
"norm-reg-std": { image: "/concept/book/norm-reg-std.png", easy: "이름이 비슷해 헷갈리는 3형제 — 대상부터 다릅니다. 정규화(Normalization)는 입력 데이터를 특정 구간(주로 0~1)으로 압축합니다. Min-Max 스케일링 (x−min)/(max−min) — 거리 기반 알고리즘 성능 향상, 단 이상치에 취약. 표준화(Standardization)는 입력 데이터를 평균 0·표준편차 1의 표준정규분포로 변환합니다. Z-score (x−μ)/σ — 경사하강법 속도 향상, 이상치 영향 축소. 규제화(Regularization)는 데이터가 아니라 모델 가중치에 패널티를 더해(J(w)=MSE+λ‖w‖²) 과적합을 방지합니다 — L1(Lasso)·L2(Ridge)가 대표. 한 줄 정리: 정규화·표준화=입력 데이터 손질, 규제화=모델 복잡도 단속." },
"dropout": { image: "/concept/book/dropout.png", easy: "학습할 때마다 은닉층 노드 일부를 무작위로 꺼버려 과적합을 막는 기법입니다. 매번 다른 조합의 '부분 팀'으로 연습시키면 특정 노드끼리 서로 의존하는 동조현상(co-adaptation)이 깨지고, 결과적으로 여러 모델을 합친 앙상블·Voting 효과가 납니다. 동작: Dropout Rate 입력(0.5면 50% 확률로 비활성화) → 임의 노드 비활성화 상태로 학습 → 오류 역전파를 반복 → 테스트 때는 노드를 전부 복원하되 확률 P를 가중치 W에 곱해 보정. 유형: Fast Dropout(가우시안 마스크로 속도 개선), Ad-hoc Dropout(균일 분포 마스크), DropConnect(노드 대신 가중치를 비활성화)." },
"dbscan": { image: "/concept/book/dbscan.png", easy: "점들이 빽빽한 곳(밀도)을 따라 군집을 만들어가는 클러스터링입니다. 반경 Epsilon 안에 이웃이 minPts개 이상이면 Core Point(군집의 핵), 핵은 못 되지만 핵의 반경 안에 있으면 Border Point(경계), 어디에도 못 끼면 Noise Point — 그리고 Core끼리 반경이 겹치면 Connected로 보고 하나의 군집으로 이어붙입니다. 구성요소 [코보노]. K-means와의 차이가 결정적 시험 포인트: K-means는 군집 개수를 미리 정해야 하고 원형 군집만 잘 찾지만, DBSCAN은 개수 지정이 필요 없고 반달 모양 같은 임의 형태 군집도 찾아내며 이상치(Noise)를 자동으로 걸러냅니다." },
"backpropagation": { image: "/concept/book/backpropagation.png", easy: "신경망이 틀린 만큼(오차)을 출력층에서 입력층 방향으로 거꾸로 전파하며 각 노드의 가중치를 고치는 학습 알고리즘입니다. '누가 오차에 얼마나 기여했나'를 따져 책임만큼 고치는 것 — 이를 수학적으로 가능하게 하는 것이 Chain Rule(합성함수의 미분은 각 함수 미분의 곱)이고, Delta Rule(오차에 기여한 만큼 가중치 조절: w ← w + α·e·x)로 업데이트합니다. 절차: 출력값과 실제값 간 오차 계산 → 역전파로 각 가중치에 대한 기울기 계산 → 경사하강법으로 가중치 조정(W ← W − α·∂E/∂W) → 성능이 오를 때까지 반복. 오늘날 모든 딥러닝 학습의 기본 엔진입니다." },
"knn": { image: "/concept/book/knn.png", easy: "새 데이터가 오면 가장 가까운 이웃 K개를 찾아 다수결로 분류하는 '유유상종' 알고리즘입니다. 동작: K값 설정(작으면 노이즈에 민감·과적합, 크면 과소적합) → 거리 측정방법 설정 → K개 최근접 이웃 탐색 → 가장 많은 클래스로 확정. 거리 [유맨민체코] — 유클리디안(직선)·맨하탄(격자 경로, 고차원에서 안정적)·민코프스키(둘의 일반화)·체비쇼프(최대 거리 기준)·코사인 유사도(벡터 간 각도). 성능평가 [정정재F RA] — 정확도·정밀도·재현율·F-1 Score(혼동행렬 환산)와 ROC·AUC(임계값 변화). 영화 추천('나와 취향이 가까운 사람들이 본 것')이 대표 활용입니다." },
"gradient-vanishing": { image: "/concept/book/gradient-vanishing.png", easy: "깊은 신경망을 역전파로 학습할 때 기울기가 층을 거칠수록 점점 작아져 가중치가 업데이트되지 않는 것이 기울기 소실, 반대로 점점 커져 비정상적으로 발산하는 것이 기울기 폭주입니다. 전화 게임처럼 신호가 여러 층을 거치며 흐려지거나 증폭되는 셈입니다. 원인 — 활성화 함수 측면: 은닉층의 시그모이드(출력이 0/1에 수렴하면 기울기가 0에 가까워짐) / 가중치 측면: 부적합한 가중치·역전파 중 폭주. 해결이 시험 포인트 — 은닉층에 시그모이드 대신 ReLU·ReLU 변형 사용, Gradient Clipping(임계값을 넘지 않게 기울기를 자름), 가중치 초기화(Xavier: 층 간 기울기 분산 균형 / He: Xavier의 ReLU 부적합성 극복), 배치 정규화." },
"k-means": { image: "/concept/book/k-means.png", easy: "n개의 데이터를 K개 군집으로 나누는 대표 비지도 클러스터링입니다. 절차: 군집 개수 K 지정 → 초기 평균값(중심) 무작위 선정 → 각 데이터를 가장 가까운 중심 기준으로 묶음 → 중심을 소속 데이터의 평균으로 재조정 → 평균값이 더 변하지 않을 때까지 반복 후 종료. 고객 세분화(구매 패턴으로 고객을 몇 그룹으로 나누기)가 대표 활용입니다. 성능평가 [실엘] — 실루엣 계수(인접 클러스터와의 비중, 대부분 높으면 적정)와 Elbow Method(적정 K에서 응집도가 최소로 꺾이는 지점), 그 외 응집도(중심과 거리 오차 제곱합)·외부평가(정답지 기반)·Dunn Index(군집 간 거리는 멀고 군집 내 분산은 작을수록 좋음)." },
"pca": { image: "/concept/book/pca.png", easy: "변수(차원)가 너무 많은 데이터를, 정보(분산)를 최대한 보존하는 새 축(주성분)으로 투영해 차원을 줄이는 기법입니다. 여러 각도에서 그림자를 비춰보고 물체의 특징이 가장 잘 드러나는(분산이 가장 큰) 각도를 고르는 것과 같습니다. 동작: 데이터셋 로드 → 평균·공분산 계산 → 고유값·고유벡터 계산 → 고유값 큰 순서로 주성분 선택(설명된 분산 비율로 개수 결정) → 변환(Transform). 수식 포인트: 공분산(두 변수의 상관관계 — C>0 양·C<0 음·C=0 독립), Eigen Vector(Ax=λx — 선형변환해도 자기 자신의 상수배가 되는 벡터), Eigen Value(그 상수배 λ). 활용: 차원 축소, 잡음 제거, 데이터 압축·시각화." },
"dim-reduction": { image: "/concept/book/dim-reduction.png", easy: "피처(변수)가 매우 많은 다차원 데이터 세트의 차원을 줄여 새로운 데이터 세트를 만드는 기법의 총칭입니다. 목적: 2~3차원으로 줄여 시각적으로 빠르게 분석(직관적 분석)하고, 특성이 너무 많으면 학습이 어려워지는 '차원의 저주'를 완화합니다. 유형이 시험 포인트 — 선형: PCA(분산이 최대인 주성분으로 변환), LDA(클래스 간/내 분산 비율 최대화), SVD(특이값 분해 — 임의 m×n 행렬 분해), 요인 분석 / 비선형: ISOMAP(MDS와 PCA의 확장·결합), 로컬 선형 임베딩 LLE(이웃 간 선형 구조를 보존하며 저차원 임베딩), AutoEncoder(압축 후 복원하는 신경망), SOM(저차원 격자에 대응시키는 신경망식 군집화)." },
"genetic-algorithm": { image: "/concept/book/genetic-algorithm.png", easy: "생물 진화(적자생존)를 흉내 내 세대를 거듭하며 점진적으로 최적해를 찾아가는 알고리즘입니다. 해를 유전자로 표현해 놓고 좋은 해끼리 교배시키면 더 좋은 해가 나온다는 발상 — 수식으로 풀기 어려운 배차·시간표·설계 최적화에 씁니다. 절차 [선교변대반] — 초기화 후 선택(적합도 높은 후보 고르기) → 교차(둘을 섞어 후대 유전자 생성) → 변이(일부를 확률적으로 바꿔 다양성 확보) → 대체(현재 유전자를 후대로 교체) → 반복(유전자가 수렴할 때까지). 기법 [룰랭토 일다균산] — 선택: 룰렛 휠(적합도 비례 확률)·랭크(순위순)·토너먼트(임의 그룹 중 최고) / 교차: 단일점·다점(특정 지점 기준)·균등(난수로 선택)·산술 교차(산술 연산 적용). 137회 정보관리 4교시 기출." },
"ensemble": { image: "/concept/book/ensemble.png", easy: "분류기 하나에 맡기지 않고 여러 개를 만들어 예측을 결합해, 더 정확한 답을 내는 기법 — 집단지성입니다. 4대 기법이 시험 핵심: 보팅(서로 다른 알고리즘들이 투표 — 다수결이면 하드보팅, 확률 평균이면 소프트보팅), 배깅(같은 알고리즘을 부트스트랩 샘플링한 서로 다른 데이터로 병렬 학습 — 대표가 랜덤 포레스트), 부스팅(분류기를 순차 학습시키며 앞의 오류에 가중치를 부여해 강한 분류기로 — AdaBoost, GB(잔차를 경사하강법으로 보정), XGBoost, LightGBM, CatBoost), 스태킹(Cross Validation 기반으로 개별 모델의 예측값을 meta dataset 삼아 최종 Meta Learner가 학습). 한 줄 연결: 배깅=랜덤 포레스트, 부스팅=XGBoost." },
"similarity": { image: "/concept/book/similarity.png", easy: "단어나 문장을 벡터화해 특징벡터를 만들고, 두 벡터가 얼마나 닮았는지를 재는 척도입니다. 측정법 4가지 — 코사인 유사도(두 벡터 간 각도로 계산: A·B/(‖A‖·‖B‖) — 문서 길이가 달라도 방향만 비교, 검색·추천의 기본), 해밍 거리(같은 길이의 이진 벡터에서 서로 다른 비트 개수 — XOR 연산으로 측정, 길이가 다르면 측정 불가), 자카드 인덱스(교집합/합집합 비율 — 0이면 무관, 1에 가까울수록 동일), 소렌슨-다이스 인덱스(2|A∩B|/(|A|+|B|) — 교집합을 두 배로 반영해 일치 정도를 강조). '이 상품을 본 사람들이 함께 본 상품' 추천이 대표 활용입니다." },
"lda": { image: "/concept/book/lda.png", easy: "클래스 간 분산은 최대로, 클래스 내 분산은 최소로 만드는 축으로 투영해 차원을 줄이는 지도학습 차원 축소입니다. 두 반 학생들을 한 줄 위에 세울 때 반끼리는 최대한 멀리, 같은 반끼리는 최대한 모이게 하는 축을 찾는 것입니다. 동작과정 [전산고변] — 전처리(정규화) → 산포행렬 계산(클래스 간 S(B)·클래스 내 S(W)) → 고유값·고유벡터 계산(S(W) 역행렬 × S(B)) → 변환. PCA와의 비교가 단골: PCA는 비지도·데이터 분산 최대화·모든 차원 축소 가능, LDA는 지도(라벨 필요)·클래스 분리 최대화·최대 (클래스 수−1)차원까지. 가정: 각 집단이 정규분포이고 비슷한 공분산 구조를 가질 것 — 평균 차이는 극대화, 분산은 최소화." },
"transformer": { image: "/concept/book/transformer.png", easy: "어텐션 메커니즘으로 문장을 병렬 처리하는, 오늘날 생성형 AI 전체의 뿌리가 되는 딥러닝 모델입니다. RNN처럼 단어를 한 개씩 순서대로 읽지 않고 문장 전체를 한 번에 보되, 포지셔널 인코딩(사인·코사인 함수)으로 단어의 위치 정보를 보존합니다. 구성 두음 [입포 인언피 디마인피 출리소] — 입력(포지셔널 인코딩) / 인코더(셀프 어텐션: Query=Key=Value 병렬처리 + 피드 포워드 신경망: 잔차 연결·정규화) / 디코더(마스크드 셀프 어텐션: 현재 이후 단어 마스킹 + 인코더-디코더 어텐션: 인코더가 Key·Value, 디코더가 Query + 피드 포워드) / 출력(Linear Layer → Softmax로 출력단어 예측). GPT는 이 중 디코더만, BERT는 인코더만 쓴 구조입니다." },
"nlp": { image: "/concept/book/nlp.png", easy: "사람의 언어를 컴퓨터가 이해할 수 있는 형태로 바꾸고(NLU: 자연어 이해), 컴퓨터의 처리 결과를 다시 사람의 언어로 표현하는(NLG: 자연어 생성) 기술의 총칭입니다. 주요기술 [형구의담] — 형태소 분석(품사 인식) → 구문 분석(문장 구조와 chunk 관계) → 의미 분석(성분 간 의미관계) → 담화 분석(문맥 속 의미), 이 4단계가 시험 단골입니다. NLU 쪽에는 Word Embedding·문장 분류·Seq2Seq·MRC·대화 모델, NLG 쪽에는 담화 생성·문장 계획·Lexical 선택·TTS가 있습니다. LLM 3형제도 함께: GPT(트랜스포머 디코더, 순방향), BERT(트랜스포머 인코더, 양방향), T5(문제-정답 쌍 전이학습)." },
"vae": { image: "/concept/book/vae.png", easy: "입력 데이터의 평균(μ)과 표준편차(σ)를 학습해 '비슷하지만 새로운' 데이터를 만들어내는 생성 모델입니다. 인코더가 데이터를 잠재 공간(Latent Space)의 확률분포로 압축하고, 거기서 샘플링한 값을 디코더가 되살립니다 — 사진을 '레시피(분포)'로 요약해 두고, 레시피를 조금 바꿔 새 요리를 만드는 셈입니다. AE와의 비교가 시험 포인트: AE는 Encoder 학습을 위해 Decoder를 연결하고 잠재 벡터가 '어떤 하나의 값'이지만, VAE는 Decoder(생성) 학습을 위해 Encoder를 쓰고 잠재 벡터가 가우시안 확률 분포 기반의 확률 값입니다. 목적: 데이터 압축·표현 학습(정규분포로 일반화된 특성 학습)과 데이터 생성(샘플링)." },
"gan": { image: "/concept/book/gan.png", easy: "위조지폐범(Generator)과 감별사(Discriminator)가 서로 경쟁하며 함께 실력이 느는 생성 모델입니다. 생성방법 [가신간디] — 생성자는 가짜가 진짜(1)로 판별되게 V(D,G)를 최소화, 판별자는 가짜=0·진짜=1로 가려내게 최대화하는 Min-Max 게임이고, 균형점이 Nash균형입니다. 유형: DCGAN(사실적 이미지), SRGAN(저해상도→고해상도), 스택 GAN(문장→이미지), 3D-GAN(입체 모델), 사이클 GAN(스타일 변환). 문제점이 단골 출제 — 모드진동(특정 단계에 머묾)·모드붕괴(일부 데이터만 학습)는 Mini-Batch Discrimination·Historical Averaging으로, 학습 성능 편차는 DCGAN·Leaky ReLU 병용으로 해결합니다. 딥페이크의 원천 기술이기도 합니다." },
"svd": { image: "/concept/book/svd.png", easy: "아무 행렬이나 고유한 기하학적 성질을 가진 세 행렬의 곱 A=UΣV^T로 분해해, 중요한 정보만 남기고 차원을 줄이는 기법입니다. U(좌측 특이 벡터, m×m 직교행렬 — 행 공간), Σ(대각행렬 — 특이값), V^T(우측 특이 벡터, n×n 전치행렬 — 열 공간). 동작 [행분선재] — 행렬 준비 → 분해(A=UΣV^T) → 특이값 선택(큰 것만 남기고 작은 건 노이즈로 간주) → 재구성(저차원 근사 행렬). PCA와 비교가 시험 포인트: PCA는 대칭(공분산) 행렬의 고유값 분해로 분산 최대화, SVD는 비대칭 행렬에도 적용 가능한 특이값 분해입니다. 활용: 추천 시스템, 이미지 압축, 문서 분류." },
"rig": { image: "/concept/book/rig.png", easy: "LLM이 답을 만드는 '중간중간에' 필요할 때마다 외부 정보를 반복 검색해 답의 정확성을 높이는 기술입니다. 동작 [초검생반] — 초기 생성(쿼리로 초안 생성) → 검색(생성된 텍스트 기반으로 필요한 정보를 외부에서 검색) → 생성 업데이트 → 반복. RAG와의 비교가 핵심 시험 포인트: RAG는 생성 '전'에 보통 한 번 검색하고 일관성이 높은 반면, RIG는 생성 '중'에 필요한 만큼 여러 번 검색해 효율성·문맥 적합성이 높지만 복잡성·학습 난이도도 높습니다. 대표 모델: RAG는 Facebook AI, RIG는 구글 데이터젬마(DataGemma)." },
"rag": { image: "/concept/book/rag.png", easy: "LLM이 답하기 전에 외부 지식(벡터 DB)을 검색해서 그 근거를 컨텍스트로 붙여 답하게 하는 기술 — '오픈북 시험'을 보게 하는 것입니다. 왜 필요한가: 지식단절(학습 이후 데이터를 모름), 환각현상(그럴듯한 거짓말), 범용성(전문성 부족). 처리 단계 [저쿼정답출] — ① 문서 변환·저장(문서를 Load·Split·Parsing 후 Sentence Embedding으로 변환해 벡터 DB에 인덱싱) → ② 입력 쿼리·문서 검색(말뭉치에서 관련 스니펫 검색) → ③ 정보 증강(쿼리+검색 문서로 맥락 통합) → ④ 답변 생성(증강된 입력을 GPT·BART 같은 seq2seq 모델에) → ⑤ 출력 생성(정제·형식화). 사내 문서 챗봇이 대표 활용입니다." },
"hallucination": { image: "/concept/book/hallucination.png", easy: "AI가 정확하지 않거나 사실이 아닌 조작된 정보를 그럴듯하게 생성하는 현상입니다. 교재 개념도가 직관적입니다 — '이순신', '거북선'은 각각 잘 답하다가 '이순신과 여객선'을 조합해 물으면 엉터리 조합 답이 나옵니다. 발생원인 [불과적모맥제] — 불충분·편향된 학습 데이터, 과적합, 적대적 공격, 복잡한 모델 아키텍처, 맥락이해 부족, 제한된 도메인 지식. 해결방안 4가지가 시험 포인트: 고품질 학습 데이터 제공, 자연어 처리기술 기반 문맥 개선, RLHF 통한 보상모델 개발, 그리고 RAG(외부의 신뢰할 수 있는 지식 베이스를 참조시켜 '사실 관계 오류'와 '맥락 이해 한계'를 개선)." },
"llm": { image: "/concept/book/llm.png", easy: "대량 연산이 가능한 컴퓨팅 인프라와 대량의 데이터로 학습해 사람의 언어를 이해·생성하는 언어모델 — ChatGPT의 기반입니다. 구성도 [컴데모] — 컴퓨팅 파워(GPU·수퍼컴퓨팅 자원, OpenAI-MS 협약처럼 자원 확보가 관건), 데이터(대규모 학습 데이터 구축, 비지도학습으로 라벨링 부담 완화), 모델 알고리즘(GPT-3·트랜스포머·BERT — 연구는 대형화, 서비스는 경량화). 기술요소: 학습모델(제로샷·퓨샷 러닝, 파인튜닝)과 프레임워크(랭체인, 벡터DB, 프롬프트 엔지니어링). 문제점(환각, 개인정보 유출, 편향, 확장/배포 어려움)에는 RAG·합성데이터·프롬프트 엔지니어링·프레임워크 적용으로 대응합니다." },
"attention": { image: "/concept/book/attention.png", easy: "디코더가 단어를 예측하는 매 시점마다 입력 문장 전체에서 '지금 예측할 단어와 연관 있는 부분'에 집중해 참고하는 방법 — 번역할 때 원문에서 관련 단어에 형광펜을 치는 것과 같습니다. 어텐션 함수 [쿼키벨어]: Attention(Q,K,V) — 쿼리에 대해 모든 키의 유사도를 구하고 → 유사도를 값(Value)에 반영하고 → 모두 더해서 → 어텐션 값을 반환. 예측 과정 [스분값연예] — 어텐션 스코어(디코더와 인코더 hidden state의 유사도) → 어텐션 분포(softmax로 가중치화) → 어텐션 값(가중합 = Context Vector) → 연결(디코더 hidden state와 concatenate — 문장이 길어져도 정보 손실이 적음) → 최종값 예측. 트랜스포머의 심장입니다." },
"langchain": { image: "/concept/book/langchain.png", easy: "언어모델 기반 애플리케이션을 만들 때 여러 언어 모델과의 통합을 간소화해 주는 SDK이자 프레임워크 — LLM 앱 개발의 '레고 블록 상자'입니다. 구성요소 [모커에 체메콜] — 메인 모듈: Model I/O(모든 언어모델과 인터페이스), Data Connection(사용자별 데이터를 로드·변환·저장·쿼리), Agent(체인이 사용할 도구를 선택해 동작) / 추가 모듈: Chains(컴포넌트를 체인으로 연결), Memory(이전 상황을 기억해 상태 유지), Callbacks(중간단계 기록·로깅·모니터링·스트리밍). 흐름: 외부 데이터 가져오기 → Word Embedding 생성 → 벡터 DB 저장·검색 → LLM에 프롬프트 전송·응답 수신. RAG 챗봇을 만들 때 사실상 표준 도구입니다." },
"fine-tuning": { image: "/concept/book/fine-tuning.png", easy: "이미 학습된 모델의 가중치를 출발점 삼아, 새로운 데이터셋으로 추가 학습해 내 작업에 맞게 조정하는 과정입니다. 절차 [사조학최] — 사전 학습 모델 → 출력 계층 조정 → 모델 학습 → 모델 최적화. 방법 2가지: Full Fine-tuning(모든 레이어·매개변수 업데이트 — 작업과 모델 차이가 클 때)과 Repurposing(하위 레이어는 유지, 상위 레이어만 튜닝 — 유사성이 있거나 데이터셋이 작을 때). 유형 2가지: 지도 파인튜닝(레이블 있는 데이터로 목표 출력 학습)과 비지도 파인튜닝(레이블 없이 데이터 구조에서 특징 추출). 고려사항: 학습률(원래 가중치 훼손 방지), 데이터 양, 모델 복잡성. 병행 기법으로 프롬프트 튜닝이 있습니다." },
"prompt-tuning": { image: "/concept/book/prompt-tuning.png", easy: "LLM의 파라미터는 그대로 얼려두고, 학습 가능한 소프트 프롬프트(learnable input)만 추가·조정해 원하는 응답을 얻는 기법입니다. 파인튜닝과의 비교표가 그대로 시험에 나옵니다 — 모델 구조: 프롬프트 튜닝은 모델 유지 vs 파인튜닝은 구조 변경 / 리소스: 경량 vs 대량 컴퓨팅 필요 / 정확도: 프롬프트 품질에 좌우 vs 데이터 품질에 좌우 / 오버피팅: 모델이 고정이라 발생 불가 vs 스몰 데이터 추가 학습이라 가능성 존재 / 확장성: 다양한 작업에 적용 용이 vs 특정 도메인 최적화로 전환 불가. 기반 기술도 짝으로: 프롬프트 튜닝은 Zero/One-Shot Prompting·CoT, 파인튜닝은 전이학습·LoRA입니다. 2025.04 ITPE 모의고사 기출." },
"context-engineering": { image: "/concept/book/context-engineering.png", easy: "프롬프트 한 줄이 아니라 모델에게 주는 '문맥(Context) 전체'를 설계·조작·구성해서 LLM의 정확도·일관성·목적 적합성을 높이는 기법입니다. 핵심전략 4가지 — 컨텍스트 작성(정보를 저장소에 기록), 선택(상황에 맞는 문맥만 골라 제공), 압축(토큰 절약을 위해 생략·요약), 분리(작업·역할별로 컨텍스트 분리 관리). 구현 기술: RAG, 메모리 시스템, 도구 통합 추론, 다중 에이전트 시스템. 프롬프트 엔지니어링과의 비교가 시험 포인트 — 프롬프트 엔지니어링은 '입력 명령문'을 다듬어 출력 품질을 높이고, 컨텍스트 엔지니어링은 '문맥·배경 정보'를 설계해 이해력과 일관성을 높입니다. 2026.02·2025.08 ITPE FR 기출." },
"prompt-engineering": { image: "/concept/book/prompt-engineering.png", easy: "AI에게서 높은 수준의 결과물을 얻기 위해 적절한 프롬프트를 구성하는 기법입니다. 구성요소 [태인커아 제원퓨C] — 질문 4요소: Task Description(수행할 상황의 상세 설명), Input Indicator(입력 지시자), Current Input(질문 내용), Output Indicator(결과물 형식) / 프롬프트 방식: Zero-Shot(예제 없이), One-Shot(예제 1개), Few-Shot(예제 수 개), CoT(풀이 과정 중심) / 추론 방식: Zero-Shot CoT, ToT(사고를 나무로 분기해 최적 경로 선택), Self Consistency(여러 추론을 종합해 일관된 답), Meta-Reasoning(여러 체인 비교 분석). 고려사항: 대화 스타일 조정, 미사여구 최소화, 닫힌 지시문, 구체적 지시, 예제 제공." },
"lora": { image: "/concept/book/lora.png", easy: "거대 모델 전체를 재훈련하지 않고, 원래 가중치는 얼려둔(Freeze) 채 옆에 작은 저랭크 행렬 두 개(A: d×r, B: r×k)만 붙여 학습하는 효율적 파인튜닝입니다. 왜 필요한가 — LLM 가중치는 1.5~3B라 GPU에 올리는 것만도 큰 비용이고, Forward·Backward·가중치·gradient까지 저장하면 가중치의 2~3배 VRAM이 필요합니다. LoRA는 A(정규분포 초기화)·B(0으로 초기화)의 가중치만 업데이트해 Pretrain Model에 더해줍니다 → VRAM 절약. Transformer의 W_q(query)·W_k(key) 레이어에 적용했을 때 성능이 가장 좋았다는 실험 결과까지 시험 포인트. PEFT 기법의 대표 주자입니다." },
"llm-enhancement": { image: "/concept/book/llm-enhancement.png", easy: "LLM의 추론 능력 부족·정확성 문제·일관성 유지 어려움을 극복하는 기술 묶음입니다. 주요기법 [추R모효멀] — 추론 능력 강화(CoT, ToT, Least-to-Most Prompting), RAG(외부 지식 활용·정밀 검색, Knowledge-Intensive NLP), 모델 병합·결합(Model Merging, DARE, Evolutionary Model Merging), 효율성·비용 절감(MoE, Sparse Attention, 양자화, LoRA), 멀티모달 통합(CLIP, Flamingo, BLIP-2). Reasoning 상세도 시험 포인트 — 사고사슬 CoT(중간 추론을 단계별 서술), 디컴포지션(하위 문제로 분해 — Self-Ask), 메타-리즌(자기 추론을 검토·수정 — Self-Reflection·ReAct), 귀납적 추론(패턴에서 일반화 — In-Context Learning), 상호 추론(두 모델이 서로 검증 — rStar). 2025.05 ITPE FR 기출." },
"lcm": { image: "/concept/book/lcm.png", easy: "토큰(단어 조각) 단위가 아니라 '개념(Concept)' — 문장 수준의 의미 단위 — 로 추론하는 메타AI의 모델입니다. 아키텍처 [소프트포] — SONAR 인코더·디코더(문장↔개념 임베딩 변환), PreNet(입력 정규화·매핑), Transformer 기반 디코더(다음 '문장 임베딩'을 예측), PostNet(디노멀화해 출력). SONAR 임베딩 공간은 200개 언어 텍스트와 76개 언어 음성을 지원합니다. 특징: 계층 구조로 긴 컨텍스트 가독성 향상, 컨텍스트 길이에 따라 계산량이 기하급수로 느는 트랜스포머 단점 해결, 뛰어난 제로샷 일반화, 인코더·디코더 모듈화로 확장성. 유형: Base-LCM, Diffusion-based LCM(One-Tower/Two-Tower), Quant-LCM(연속 표현을 이산화)." },
"lam": { image: "/concept/book/lam.png", easy: "LLM의 언어 이해에 '실제 행동 수행 능력'을 결합한 모델 — 말만 하는 AI에서 마우스를 움직이고 버튼을 눌러 일을 해내는 AI로의 진화입니다. 발전 계단이 시험 포인트: LLM(자연어 이해·텍스트 생성) → LMM(멀티모달 통합 처리) → LAM(행동 계획·작업 실행, 태스크 자동화). 단계: 입력처리(원시 상태·데이터 수집) → 분석(행동이력 기반 도메인 특화 프롬프트 설계) → 실행(행동 생성). 핵심기술 4그룹 — Input Processing(멀티모달 인코딩·의도 분류·동적 컨텍스트 윈도우), Planning & Reasoning(CoT·계층적 작업분해·Neuro-symbolic Programming), Action Execution(API 오케스트레이션·동적 계획·원자적 액션), Self-Correction(다차원 평가·Contextual Memory·RLHF). 2025.04 KPC 기출." },
"langgraph": { image: "/concept/book/langgraph.png", easy: "여러 AI 에이전트가 협업하는 멀티 에이전트 시스템을 만들기 위한, LangChain 기반의 상태 관리·워크플로우 라이브러리입니다. 핵심은 구조의 차이 — LangChain이 작업을 '체인(사슬)'으로 순차 연결한다면, LangGraph는 노드(Node: 개별 작업 모듈)와 엣지(Edge: 데이터 흐름·종속 관계)로 이뤄진 '그래프'라서 반복·분기 같은 비순차적 흐름을 표현할 수 있습니다. 개념도의 Thought → Action → Observation 순환(끝나면 Finish)이 에이전트 루프의 전형입니다. 구성: 노드·엣지·데이터레이어·워크플로우 디자이너(시각적 UI)·API 통합. LangChain vs LangGraph 비교표(체인 기반 vs 그래프 기반, 코드 커스터마이징 vs 시각적 설계)가 시험 포인트입니다." },
"cot": { image: "/concept/book/cot.png", easy: "언어 모델이 복잡한 문제를 풀 때 '문제-풀이-답'처럼 중간 과정을 단계별로 밟아 논리적으로 추론하게 유도하는 방법론입니다. 개념도가 핵심: 표준 IO 프롬프팅은 Input→Output 직행이라 계산 문제를 자주 틀리지만, CoT는 Input→thought→thought→thought→Output으로 풀이 과정을 거쳐 정답률이 오릅니다. 특징·구성요소 [문사최] — 특징: 단계적 추론, 문제 해결력 향상(수학·논리 퍼즐·복잡한 의사결정), 설명 가능한 AI(중간 사고 과정을 보여줘 신뢰성↑), Prompt Engineering 활용 / 구성요소: 문제 입력 → 사고 과정 단계(이전 정보 기반으로 다음 단계 진행) → 최종 출력. 2025.04 ITPE 모의고사 기출." },
"moe": { image: "/concept/book/moe.png", easy: "여러 전문가 모델(Expert) 중 입력에 맞는 최적의 전문가만 골라 쓰는 모델 아키텍처 — 종합병원에서 증상에 맞는 전문의에게 배정하는 것과 같습니다. 개념도 [익라] — Experts(각자 특정 Feature Space에 특화 학습된 전문가 네트워크)와 Router(입력에 따라 어떤 전문가를 쓸지 Softmax·Top-k로 결정). 핵심 특징이 Sparse Computation: 전체 전문가를 다 돌리지 않고 일부만 활성화해 계산 효율을 높이므로, 매우 큰 모델도 효율적으로 동작합니다(딥시크·GPT급 모델의 비결). 구성요소: 게이팅 네트워크(Softmax로 전문가 가중치 결정), 전문가 네트워크(서브 모델들), 출력 조합 모듈(선택된 전문가 예측값을 가중합). 2025.04 ITPE·KPC 기출." },
"peft": { image: "/concept/book/peft.png", easy: "사전학습 모델의 전체 파라미터가 아니라 일부만 조정해서, 적은 자원으로 파인튜닝 효과를 내는 기법의 통칭입니다(전체 대비 수~몇 %만 업데이트). 기법 5가지가 시험 핵심 — Adapter(PLM 중간에 Bottleneck 구조의 작은 신경망 삽입), Prefix Tuning(입력 앞단에 학습 가능한 벡터 추가, Softmax로 영향 조절), LoRA(가중치 대신 저랭크 행렬 추가 학습), Parallel Adapter(PLM 경로와 병렬로 ReLU 기반 어댑터 연결 후 합침), Scaled PA(Parallel Adapter에 Scaling 추가로 영향력 미세 조정). 목적은 하나: 비용·자원·시간을 최소화하면서 커스터마이징. 2025.10 ITPE 모의고사 기출." },
"mlperf": { image: "/concept/book/mlperf.png", easy: "AI 하드웨어·소프트웨어의 성능을 공정하게 겨루는 국제 벤치마크 — AI 업계의 '공인 기록 경기'입니다. 평가항목 [학추] — 학습부문(Training: 얼마나 빨리 모델을 학습시키는가)과 추론부문(Inference: 얼마나 빠르고 정확하게 결과를 내는가). 평가지표 [훈처 추정처] — 학습은 훈련시간·처리량, 추론은 추론속도·정확도·처리량. 벤치마크 종목: 이미지 분류, 객체탐지, 음성인식, 자연어처리, 추천시스템, 강화학습(승률 50% 도달 시 종료). 경기 방식 2가지가 시험 포인트: CLOSED(과업·모델·데이터를 고정하고 시간으로만 경쟁 — 공정 비교)와 OPEN(모델 성능 외 모든 항목 자유 설정). 2025.06 KPC 기출." },
"tts": { image: "/concept/book/tts.png", easy: "모델을 다시 학습시키지 않고, 추론(inference) 시점에 시간·연산을 더 투자해 성능을 끌어올리는 기법입니다 — '시험 시간에 검산을 여러 번 하게 하는 것'. 대표 기법 [베빔체몬] — Sampling 기반: Best-of-N(N개 응답 중 신뢰도 최고 선택) / Decoding 기반: Beam Search(중간단계 평가하며 확장), Self-Consistency(여러 CoT 응답의 다수결) / Reasoning 기반: CoT·ToT·GoT / Search & Verification: 보상모델 평가, MCTS(rollout으로 탐색 경로 확장) / Self-Improvement: 응답→비판→수정 반복 / Compute 최적화: COS(난이도 따라 순차·병렬 탐색 배분). 사전학습과의 비교가 시험 포인트: 사전학습은 모델 능력 자체를 확장(파라미터 수정·고비용), TTS는 파라미터 유지한 채 추론 품질 향상(유연한 비용, 단 느릴 수 있음)." },
"mlops": { image: "/concept/book/mlops.png", easy: "머신러닝의 데이터 수집→분석→배포 전 과정을 DevOps와 결합해 자동화하는 IT 운영 프레임워크입니다. 모델을 '만드는 것'과 '운영하는 것' 사이의 골짜기를 메웁니다. 파이프라인 [도파 데학평배] — ML옵스 도구 선택 → 파이프라인 구축 → 데이터 수집 → 모델 학습 → 모델 평가 → 모델 배포. 성숙도 3단계가 시험 핵심: 0단계(빌드·배포 수동 — 형상관리 부재로 비효율), 1단계(ML 파이프라인 자동화 — Feature Store로 데이터·특징추출 과정 관리, 재현성 보장), 2단계(CI/CD 파이프라인 자동화 — 배포·모니터링까지 자동화, 실시간 성능 추적과 데이터 드리프트 감지). 구성: ML(Data·Model) + DEV(Create~Package) + OPS(Release~Monitor)." },
// ─────────────── 3주차: 확률·통계(ST) — 교재 슬라이드 + 쉬운 설명 ───────────────
"st-prob-dist": { image: "/concept/book/st-prob-dist.png", easy: "확률변수가 특정한 값을 가질 확률을 나타내는 분포입니다. 큰 갈래부터: 이산확률분포(주사위 눈처럼 셀 수 있는 값)와 연속확률분포(키·몸무게처럼 실수 구간의 값). 유형 [이연 베이포 정표T카F] — 이산 3형제: 베르누이(성공/실패 두 결과, 각 시행 독립), 이항(n번 시행 중 k번 성공할 확률 — 시행 횟수가 많아지면 정규분포와 유사), 포아송(단위 시간·면적당 사건 발생 횟수, 기댓값=분산=λ) / 연속 5형제: 정규(종모양 대칭), 표준정규 Z(평균 0·분산 1로 표준화), T(모집단 표준편차를 모를 때 평균 추측 — n이 크면 정규분포에 수렴), 카이제곱 χ²(모집단 1개, 분산 추측·적합도 검정), F(모집단 2개, 분산 비율)." },
"st-pdf": { image: "/concept/book/st-pdf.png", easy: "확률분포는 '각 값이 나올 확률'을 정의한 것이고, 확률밀도함수(PDF)는 그 확률분포를 연속적인 함수로 표현한 것입니다. 주사위 두 개의 합(2~12)으로 보면 직관적입니다 — 합이 2일 확률 1/36, 7일 확률 6/36… 이렇게 점으로 찍으면 확률분포이고, 이 점들을 P(x)=f(x)로 매끄러운 곡선으로 이으면 확률밀도함수입니다. 흐름: 확률변수 →(특정 값 확률 함수)→ 확률분포 →(연속확률분포 표현)→ 확률밀도함수. 셀 수 있으면 확률질량함수(PMF, 베르누이·이항·포아송), 연속이면 확률밀도함수(PDF, 정규·T·카이제곱·F·지수)를 씁니다." },
"st-normal-dist": { image: "/concept/book/st-normal-dist.png", easy: "평균을 중심으로 좌우 대칭인 종모양 분포 — 키, 시험 점수, 측정 오차 등 자연 현상 대부분이 따르는 분포입니다. 표기는 X ~ N(μ, σ²). 모양은 두 값이 결정합니다: 평균 μ가 위치(대칭축)를, 표준편차 σ가 폭을 정합니다(σ가 클수록 평평, 작을수록 뾰족). 시험 단골은 68-95-99.7 규칙 — 평균에서 ±1σ 안에 68.3%, ±2σ 안에 95.5%, ±3σ 안에 99.7%의 데이터가 들어갑니다(경험규칙, The Empirical Rule). 그 외 특징: 곡선 아래 전체 면적은 1, 평균=중앙값=최빈값이 모두 같음, 곡선이 x축에 무한히 가까워지지만 닿지는 않음. 확률밀도함수는 f(x)=1/(σ√2π)·e^(−(x−μ)²/2σ²)." },
"st-clt": { image: "/concept/book/st-clt.png", easy: "표본 크기 n이 충분히 크면(보통 30 이상) '표본 평균들이 이루는 분포'는 원래 모집단이 어떤 모양이든 상관없이 정규분포를 따른다는 원리입니다. 이게 왜 중요한가 — 모집단 분포를 몰라도 Z값을 구해 확률을 계산할 수 있게 되어, 수학적 확률 판단(추정)이 가능해집니다. 통계적 추론 전체의 토대죠. 교재 그림이 핵심: 균등분포·비균등분포·정규분포 어떤 모집단에서 뽑아도, n=1→5→30→100으로 갈수록 표본평균의 분포는 정규분포 모양으로 수렴합니다(Bin·Pois·Expo·Beta 전부). 표본평균의 표준편차(표준오차)는 σ/√n — 표본이 커질수록 평균이 더 촘촘해집니다." },
"st-data-type": { image: "/concept/book/st-data-type.png", easy: "데이터를 어떤 척도로 쟀느냐에 따라 쓸 수 있는 통계 기법이 달라지므로, 유형 구분이 통계의 출발점입니다. 자료 형태 [명순등비] — 범주형(질적): 명목 자료(단순 분류, 숫자를 매겨도 크기 의미 없음 — 성별·혈액형·직업구분), 순서 자료(범주에 순서 관계 성립 — 우선순위·등수·학점·선호도) / 수치형(양적): 등간 자료(균일한 간격, 셀 수 있는 형태 — 설문 문항·온도·IQ), 비율 자료(절대영점이 있어 비율 계산 가능 — 시험점수·키·몸무게). 시간 기준으로는 횡단형(한 시점에 얻은 데이터)과 종단형(같은 대상을 여러 시점에 걸쳐 — 시계열 자료)으로 나뉩니다." },
"st-sampling": { image: "/concept/book/st-sampling.png", easy: "모집단 전체를 조사할 수 없으니 표본을 뽑는데, '모든 요소가 동일한 확률로 뽑히느냐'가 확률/비확률 추출을 가릅니다. 확률 추출 [단층계집] — 단순확률(난수로 무작위: 1000명 중 100명), 층화확률(모집단을 겹치지 않는 층으로 나눈 뒤 각 층에서 무작위: 연령대별 추출), 계통(k번째 간격마다 하나씩: k=3), 집락/군집(인접한 단위로 군집을 만들고 군집 단위로 조사: 거주 지역별). 비확률 추출 [눈편할유판] — 눈덩이(응답자가 다음 응답자를 소개), 편의(조사원이 편한 대로), 할당(특성별 층을 만들되 조사원이 직접 선정), 유의추출·포커스 그룹(전문가가 주관적 판단으로), 판단추출(가장 대표적이라 여겨지는 표본을 주관적으로 — 표본이 아주 작을 때)." },
"st-skew-kurt": { image: "/concept/book/st-skew-kurt.png", easy: "정규분포와 얼마나 다른지를 재는 두 지표 — 정규성 검정에 씁니다. 왜도(Skewness)는 분포가 '어느 쪽으로 기울었나'입니다: 왜도 < 0이면 오른쪽으로 치우친 분포(Negative Skewness), 0이면 정규분포와 유사한 대칭, > 0이면 왼쪽으로 치우친 분포(Positive Skewness). 첨도(Kurtosis)는 '얼마나 뾰족한가'입니다: 첨도 < 0이면 상대적으로 평평(Platykurtic), 0이면 정규분포 수준(Mesokurtic), > 0이면 뾰족(Leptokurtic). 수식은 표준화한 편차의 3제곱 평균이 왜도(γ₁), 4제곱 평균에서 3을 뺀 것이 첨도(γ₂)입니다 — 3을 빼는 이유는 정규분포의 첨도를 0으로 맞추기 위해서입니다." },
"st-outlier": { image: "/concept/book/st-outlier.png", easy: "관측 데이터 범위에서 많이 벗어난 아주 작거나 큰 값 — 그냥 두면 평균·분산을 왜곡해 분석 결과를 망칩니다. 가장 많이 쓰는 검출법이 사분위수 기반: IQR = Q3 − Q1일 때, 내부울타리 Q1−1.5×IQR ~ Q3+1.5×IQR 밖이면 이상치, 외부울타리(±3.0×IQR) 밖이면 극단 이상값입니다(상자수염그림의 그 기준). 그 외 검출 방법: Variance(정규분포 97.5% 이상 또는 2.5% 이하), Likelihood(베이즈 정리로 정상/이상 발생 확률 비교), Nearest-Neighbor(모든 쌍의 거리 계산), Density(LoF 값이 큰 것), Clustering(작은 클러스터나 멀리 떨어진 클러스터). 대체 방법: 하한/상한값 대체, 3시그마 기준, 중위수 기준 절대편차, 백분위수, Winsorization(윈저화)." },
"st-missing-value": { image: "/concept/book/st-missing-value.png", easy: "관측되어야 할 값을 얻지 못한 데이터입니다. 그냥 두면 데이터 손실뿐 아니라 분포를 왜곡시켜 편향을 만들기 때문에 반드시 처리해야 합니다. 처리는 크게 둘 — 삭제(Deletion): 행 삭제(Listwise, 결측이 포함된 행 제거)와 열 삭제(결측 비율이 높은 변수 제거). 결측치가 5% 이하로 소수일 때만 안전합니다 / 대체(Imputation): 통계값 대체(연속형은 평균·중앙값, 범주형은 최빈값), 회귀 대체(선형 회귀 등 예측 모델로 보완), KNN 대체(유사한 데이터를 찾아 대체), 다중 대체(여러 번 샘플링해 예측값으로). 나아가 Decision Tree·Random Forest 같은 머신러닝 모델로 결측값을 예측하기도 합니다. 유형은 매커니즘(완전 무작위·무작위·비무작위 결측)과 패턴(일변량·단조·일반·규칙)으로 나뉩니다." },
"st-timeseries": { image: "/concept/book/st-timeseries.png", easy: "시간 흐름에 따라 관측되는 자료의 특성을 분석해 미래를 예측하는 기법입니다. 전제 조건이 정상성 — 시간에 따라 통계적 특성이 변하지 않는 상태(평균 일정, 분산 일정, 공분산은 시차에만 의존). 구성 요소 [추순계불] — 추세(장기 변동: GDP·인구증가율), 순환(중기, 2~10년 주기), 계절(1년 주기 단기 변동), 불규칙(예측 불가한 우연 변동). 모델 4형제가 시험 핵심: AR(자기회귀 — 과거 '값'의 선형 조합으로 예측), MA(이동평균 — 과거 '예측 오차'가 현재에 영향), ARMA(AR+MA 결합), ARIMA(ARMA에 차분을 더해 비정상 데이터를 정상성 데이터로 변환 — 평균을 0으로 유지). 138회 정보관리 1교시 기출." },
"st-bayes": { image: "/concept/book/st-bayes.png", easy: "새로운 증거(사건 B)를 관측했을 때, 원래 알던 확률(사전확률)을 갱신해 사후확률을 구하는 정리입니다. 수식 P(A|B) = P(B|A)P(A)/P(B) — 우변의 P(A)가 사전확률, P(B|A)가 우도(Likelihood), 좌변이 사후확률입니다. 용어 [전우후]: 사전확률(이미 알고 있는 초기 확률) → 우도(그 원인에서 이 사건이 일어날 확률) → 사후확률(증거를 반영해 갱신된 조건부 확률). 수식 이론 [조곱전베]: 조건부 확률 P(A|B)=P(A∩B)/P(B) → 곱셈의 정리 P(A∩B)=P(B|A)P(A) → 전확률의 법칙 P(B)=ΣP(B∩Aᵢ) → 베이즈 정리(이 셋을 조합). 스팸 필터·의료 진단·나이브 베이즈 분류기의 원리입니다. 138회 정보관리 1교시 기출." },
"st-descriptive": { image: "/concept/book/st-descriptive.png", easy: "주어진 표본 자체의 속성을 정량적으로 기술·요약하는 통계입니다(모집단 추정은 추론통계의 몫). 데이터 요약 3축 — 중심경향값(평균: 모두 더해 개수로 나눔 / 중위수: 순서대로 나열했을 때 중앙값 / 최빈값: 가장 많이 관찰되는 값), 변산도(최대·최소·범위, 분산: 평균에서 떨어진 정도, 표준편차: 분산의 제곱근), 분포(왜도: 비대칭성, 첨도: 뾰족한 정도). 데이터 시각화 3종 — 히스토그램(도수 분포를 직사각형 기둥으로), 상자수염그림(사분위수로 분포 표현 + 이상치 탐지), 산점도(두 수치형 변수의 관계 시각화). 이상치에 강한 지표를 원하면 평균 대신 중위수를 보는 것이 실무 감각입니다." },
"st-inferential": { image: "/concept/book/st-inferential.png", easy: "표본 데이터를 근거로 모집단의 특성을 추정하거나 가설을 검정하는 통계입니다. 기술통계와의 차이가 시험 포인트: 기술통계는 '수집한 표본 자체'를 요약하는 게 목적(특정 학급 성적 추세), 추론통계는 표본으로 '모집단'을 추정하는 게 목적(생산라인 불량률 추정, 선거 지지도 조사). 방법은 셋으로 갈립니다 — 모수적 방법(정규성 가정: 대응표본 t-검정(같은 집단 두 시점), 독립표본 t-검정(다른 두 집단), 일원배치·반복측정 분산분석(3개 이상)), 비모수적 방법(정규성 가정 없음: 윌콕슨 부호순위, 맨휘트니, 크루스컬-월리스, 후리드만 — 모수적 방법과 1:1로 대응), 가설 검정(가설수립 → 검정통계량 선정 → 유의수준 결정 → 계산 → p값으로 판정)." },
"st-estimation": { image: "/concept/book/st-estimation.png", easy: "표본에서 모집단의 모수(평균·분산 등)를 알아내는 과정입니다. 추정 방법 [점구] — 점 추정(모수를 값 하나로: MLE 최대우도추정, MOM 모멘트추정, MAP 베이지안 — 구체적이지만 불확실성을 못 보여줌)과 구간 추정(모수가 이 구간 안에 있을 것이라는 신뢰 구간 제시 — 불확실성을 표현). 좋은 추정량의 조건 [불효일충] — 불편성(기대값이 실제 모수와 동일), 효율성(불편 추정량 중 분산이 가장 작음), 일치성(표본이 커질수록 실제 모수에 수렴), 충분성(통계량만으로 충분한 정보 제공). 시험 단골 포인트: 표본분산을 구할 때 n이 아니라 n−1(자유도)로 나누는 이유가 불편추정량을 만들기 위해서입니다. 자유도 = 독립된 표본의 수(x+y+z=10에서 x·y를 알면 z는 자동 결정 → 자유도 2)." },
"st-association": { image: "/concept/book/st-association.png", easy: "변수들 사이에 어떤 관계가 있는지 판단하는 분석인데, 어떤 척도로 잰 데이터냐에 따라 방법이 갈립니다. 명목척도 → 교차분석(카이제곱 검정): 범주형 자료로 교차표를 만들어 관측빈도와 기대빈도를 비교합니다(적합도·독립성·동질성 검정). 서열척도 → 스피어만 서열 상관분석. 등간·비율척도 → 피어슨 상관분석(두 연속형 변수의 선형 관계), 제3의 변수를 통제하고 싶으면 편상관분석. 상관분석의 핵심은 상관계수 r — 산포도로 보면 양의 상관(우상향), 상관관계 없음(r=0, 선형관계 아님), 음의 상관(우하향)입니다. 상관계수 유형은 피어슨·켄달·스피어만 세 가지." },
"st-regression": { image: "/concept/book/st-regression.png", easy: "특정 변수(독립변수)가 다른 변수(종속변수)에 어떤 영향을 미치는지 수학적 모형 y=ax+bx+…+c로 설명·예측하는 기법입니다. 회귀선은 보통 최소제곱법으로 구합니다. 가정 [선정독등공]이 시험 최다 출제 — (1)선형성(독립·종속변수가 선형 관계), (2)잔차 정규성(잔차 기댓값 0, 정규분포), (3)잔차 독립성(관측치 간 상관관계 없음), (4)잔차 등분산성(잔차 분산이 일정), (5)다중 공선성 없음(독립변수끼리 상관 문제 없음 — 전진선택·후진소거·단계적 선택법으로 변수 선택). 1~4는 모두 만족해야 합니다. 유형 [단다일다선로공분 리라엘]: 단순/다중, 일변량/다변량, 선형/로지스틱, 공분산분석/분산분석, 리지·라쏘·엘라스틱넷. 평가: 결정계수 R²(설명력), AIC/BIC(복잡성 고려), p-value(유의성), 잔차 분석(오차진단)." },
"st-aic-bic": { image: "/concept/book/st-aic-bic.png", easy: "모델이 데이터에 얼마나 잘 맞는지(적합도)와 얼마나 복잡한지(변수 개수)를 함께 따져 '가장 좋은 모델'을 고르는 지표 — 둘 다 작을수록 좋은 모델입니다. AIC = −2log(likelihood) + 2p — 앞부분이 적합도(우도가 클수록 작아짐), 뒷부분이 변수 개수 p에 대한 패널티. BIC = −2log(likelihood) + log(n)p — 표본 크기 n을 반영해 패널티를 키운 버전입니다. 비교가 시험 포인트: n이 8보다 크면 2p < log(n)p가 성립하므로 BIC가 변수 개수에 더 민감합니다. 결과적으로 AIC는 패널티가 약해 복잡한 모델을 고르고(예측 성능 중심, 과적합 위험), BIC는 패널티가 강해 단순한 모델을 고릅니다(모델의 진실성 중심). 2025.06 ITPE 모의고사 기출." },
"st-hypothesis-test": { image: "/concept/book/st-hypothesis-test.png", easy: "표본에서 얻은 사실로 모집단에 대한 가설이 맞는지 통계적으로 판정하는 방법입니다. 두 가설의 관계가 핵심: 귀무가설 H₀(직접 검정 대상, '옳다'는 가정에서 시작 — 예: 교육자소득 ≤ 비교육자소득)와 대립가설 H₁(실제로 입증하고자 하는 새 주장 — 교육자소득 > 비교육자소득). 절차 6단계: 가설 설정 → 검정통계량 선택 → 유의수준(α) 결정 → 검정통계량 계산 → p값과 α 비교 → 기각/수용 결정. 판정 규칙: p-value ≤ 유의수준이면 귀무가설 기각(대립가설 채택). 오류 2종이 단골 — 제1종 오류(α): 귀무가설이 옳은데 기각할 확률 / 제2종 오류(β): 귀무가설이 거짓인데 기각 못할 확률. 둘은 상반되어(하나가 커지면 다른 게 작아짐) 보통 α를 기준으로 판단합니다." },
"st-anova": { image: "/concept/book/st-anova.png", easy: "독립적인 집단이 셋 이상일 때 집단 간 평균 차이가 통계적으로 유의미한지 F검정으로 판단하는 기법입니다(두 집단이면 t-검정). 조건 [정등독] — 정규성(모집단 분포가 모두 정규분포), 등분산성(집단 간 분산 동일), 독립성(독립변수 범주가 세 집단 이상). 예외: 빅데이터급이면 정규성 증명 예외, 분산비 4 이하면 등분산성 증명 예외. F검정량은 두 집단 샘플 분산의 비율로, 집단 간 분산 대비 집단 내 분산을 봅니다. 유형은 독립·종속변수 개수로 갈립니다 — One Way(독립 1·종속 1: 급여→생산성), Repeated Measures(같은 집단 반복 측정: 1·3·6개월 후), Two Way(독립 2: 급여+나이), Multi Way(독립 3개 이상), Multivariate ANOVA(종속 2개 이상: 급여→생산성+만족도)." },
// ─────────────── 4주차: 네트워크(NW) — 교재 슬라이드 + 쉬운 설명 ───────────────
"nw-transmission-coding": { image: "/concept/book/nw-transmission-coding.png", easy: "음성·영상 같은 아날로그 정보를 디지털로 바꿔 보낼 때 거치는 세 가지 코딩입니다. 송신 흐름: 아날로그신호 → A/D변환 → 소스코딩 → 채널코딩 → 변조 → 라인코딩 → 전송(수신은 역순). 소스 코딩(압축): 불필요·중복 정보를 제거해 전송량을 줄입니다 — 고정 길이(ASCII) vs 가변 길이(모스부호), 무손실(허프만·런렝스) vs 손실(JPEG·MPEG). 채널 코딩(오류제어): 전송 중 잡음으로 생기는 오류를 잡으려 일부러 잉여 비트를 덧붙입니다 — 100kbps 정보에 50kbps redundancy를 더해 150kbps로 보내고, 오류가 나면 FEC로 스스로 복원합니다(속도는 떨어지지만 신뢰도 확보). 라인 코딩: 0과 1의 디지털 데이터를 실제 전기 신호 파형으로 바꿉니다(unipolar·polar·bipolar) — 수신 측 동기 재생과 오류 검출이 목적입니다." },
"nw-pcm": { image: "/concept/book/nw-pcm.png", easy: "아날로그 소리를 디지털로 바꾸는 가장 기본적인 방식 — CD 음원과 전화 음성이 이 원리입니다. 송신 3단계가 시험 핵심: ① 표본화(Sampling) — 연속 파형을 일정 간격으로 찍어 값을 뽑음(찍힌 펄스열이 PAM 신호) ② 양자화(Quantization) — 뽑은 값을 정해진 눈금(레벨)에 맞춰 이산 값으로 반올림, 양자화 레벨=2^n ③ 부호화(Encoding) — 그 값을 2진수 0·1로 표시. 수신은 재생 → 복호화 → 재구성(필터링)으로 되돌립니다. 나이퀴스트 정리가 반드시 나옵니다: 표본화 횟수 fs ≥ 2 × 최고주파수 fm — 최고 주파수의 2배 이상으로 찍어야 원신호를 복원할 수 있고, 부족하게 찍으면(under sampling) 앨리어싱이 생겨 엉뚱한 파형이 됩니다." },
"nw-qam": { image: "/concept/book/nw-qam.png", easy: "반송파의 진폭과 위상을 '동시에' 바꿔 한 번에 여러 비트를 실어 보내는 변조 방식입니다 — PSK(위상만)에 진폭 변조를 더한 것. 성상도(Constellation Diagram)로 이해합니다: X축은 동위상 반송파(I), Y축은 구상 반송파(Q)이고, 평면 위의 점 하나가 심볼 하나입니다. 16QAM은 점이 16개라 1심볼=4비트(3가지 진폭 × 12가지 위상). 같은 원 위의 점들은 진폭이 같고 위상만 다르며, 같은 방향의 점들은 위상이 같고 진폭만 다릅니다. 계층적 변조(64QAM 예)가 응용 포인트: 심볼당 6비트 중 상위 2비트를 QPSK로 써서, 수신 상태가 좋으면 전체 64QAM 좌표를, 나쁘면 상위 2비트(QPSK)만 뽑아 중요한 정보라도 살립니다 — 디지털 TV 표준 DVB-T에 적용." },
"nw-ipv6": { image: "/concept/book/nw-ipv6.png", easy: "IPv4의 32비트 주소가 바닥나면서 나온 128비트 차세대 주소체계로, 주소 고갈뿐 아니라 보안성·이동성 문제까지 함께 풀려고 만들었습니다. 기본 헤더는 40바이트 고정이고 필드 8개 [버터플파네호+송수] 순으로 외웁니다 — Version(4bit) / Traffic Class(8bit, 송신 우선순위) / Flow Label(20bit, QoS 서비스별 구분) / Payload Length(16bit) / Next Header(8bit, 다음 헤더 유형) / Hop Limit(8bit, IPv4의 TTL에 해당) / Source Address(128bit) / Destination Address(128bit). IPv4와 결정적으로 다른 점은 옵션을 헤더에 욱여넣지 않고 확장 헤더로 뒤에 붙인다는 것 — 그래서 기본 헤더가 단순·고정 길이가 되고 라우터 처리가 빨라집니다. 표기법 4단계도 자주 나옵니다: 16bit씩 8필드를 콜론으로 나눈 일반 16진수 → 앞자리 0을 지운 0 억제 → 연속된 0 필드를 ::로 접은 0 압축 → 마지막 32비트만 10진수로 쓰는 혼합 표기법(IPv4 호환 표기)." },
"nw-sliding-window": { image: "/concept/book/nw-sliding-window.png", easy: "둘 다 '보내는 양을 조절한다'는 점은 같지만 목적이 다릅니다 — Sliding Window는 수신 측이 감당할 만큼만 보내는 흐름제어, 네이글은 자잘한 패킷을 모아 보내는 부하 감소입니다. Sliding Window는 수신 측이 알려준 윈도우 크기만큼은 ACK를 기다리지 않고 미리 보낼 수 있게 해줍니다(Window num = Min(cwnd, rwnd) — 혼잡 윈도우와 수신 윈도우 중 작은 쪽). 윈도우 구간은 왼쪽부터 ACK 수신 완료 / ACK 미수신(전송됨) / 즉시 전송 가능 / ACK 후 전송 가능 네 칸이고, 경계가 움직이는 3가지 동작이 시험 포인트입니다: 열림(ACK 도착 → 오른쪽 경계가 오른쪽으로, 전송량 증가), 닫힘(전송 완료 ACK → 왼쪽 경계가 오른쪽으로), 축소(윈도우 크기 변경 → 오른쪽 경계가 왼쪽으로). 네이글은 1바이트짜리 패킷이 헤더 40바이트를 달고 날아가는 낭비를 막습니다 — ACK가 올 때까지 버퍼에 모았다가 한 번에 보내되, 수신 윈도우보다 보낼 게 크면 바로 보내고 더 보낼 데이터가 없으면 즉시 보냅니다." },
"nw-bgp": { image: "/concept/book/nw-bgp.png", easy: "AS(Autonomous System, 하나의 관리 주체가 운영하는 네트워크 덩어리 — 통신사 하나가 보통 AS 하나) 사이에서 경로 정보를 주고받는 프로토콜입니다. OSPF·RIP이 AS 안(Interior)에서 쓰는 것과 달리 BGP는 AS 밖(Exterior Gateway)을 담당합니다. 같은 AS 번호끼리 쓰면 iBGP, 다른 AS끼리 연결하면 eBGP입니다. 경로 선택 방식이 Path Vector — 거리(홉 수)가 아니라 '거쳐 온 AS 번호들의 목록'을 보고 판단합니다. 경로 속성 4개: Next-Hop(반드시 거쳐야 할 라우터 IP), Local Preference(밖으로 나가는 경로 우선순위, 기본값 100), AS-Path(경유 AS 목록 — 개수가 적을수록 짧은 경로로 선택), MED(인입 경로가 여럿일 때의 우선순위). 메시지 5종은 연결 수명 순서로 외우면 편합니다: Open(TCP 179번으로 이웃 맺기) → Update(경로 정보 교환·갱신) → Keepalive(살아있나 확인) → Route-Refresh(정보 재확인) → Notification(문제 발생·이웃 단절 통보)." },
"nw-wireless-charging": { image: "/concept/book/nw-wireless-charging.png", easy: "전선 없이 배터리를 채우는 기술로, 방식 3가지를 '거리와 효율의 맞바꿈'으로 보면 정리가 됩니다. 자기유도는 송신 코일에 전류를 흘려 만든 자기장이 수신 코일에 유도 전류를 만드는 방식 — 수 cm 근접형이지만 효율 75% 이상으로 가장 높고, 교통카드·스마트폰 충전패드가 이것입니다(표준 WPC). 자기공진(자기공명)은 두 코일의 공진 주파수를 똑같이 맞춰 에너지를 결합하는 방식 — 수 m까지 늘어나 이동성이 좋아지지만 효율은 40~60%로 떨어집니다(표준 A4WP). 전자기파는 전력을 마이크로파로 바꿔 안테나로 쏘는 방식 — 수 km까지 가고 고출력이지만 효율이 5% 이내이고 인체에 유해해서 위성·우주태양광 같은 데만 씁니다(ITU-R SG1). 시험에는 이 비교표가 그대로 나오니 거리(cm/m/km) ↑ 효율(75%/50%/5%) ↓ 라는 반비례 관계와, 인체유해성이 전자기파에만 있다는 점을 잡아두세요. 기타 방식으로 RF(비콘으로 위치 인지 후 집중 충전), 적외선, 초음파가 있습니다." },
"nw-cdn": { image: "/concept/book/nw-cdn.png", easy: "동영상이나 큰 파일을 원 서버 한 곳에서만 내려주면 멀리 있는 사용자는 느립니다. CDN은 콘텐츠를 미리 여러 지역의 캐시 서버(PoP)에 복제해두고 사용자와 가장 가까운 곳에서 꺼내주는 시스템입니다. 동작 흐름 4단계가 시험 포인트 — ① 사용자가 CP 웹서버 접속 → ② CDN 서버 주소가 박힌 Embedded URL이 든 HTML을 받음 → ③ 사용자가 그 CDN 주소로 오브젝트 요청 → ④ CDN이 복제본을 전달. 구간 이름도 함께 외우세요: 사용자쪽부터 Last-mile / Middle-mile / First-mile입니다. 기술 요소 중 헷갈리는 쌍이 있습니다 — Global Server Load Balancing은 '전 세계 캐시 서버 중 어느 서버를 붙일까'를 고르는 것이고, Load Balancing은 고른 서버군 안에서 트래픽을 나누는 것, Request Routing은 부하를 보고 가장 인접한 캐시를 선택하는 방법입니다. Grid Delivery는 트래픽이 넘칠 때 사용자 PC를 작은 서버로 쓰는 P2P 방식입니다." },
"nw-net-neutrality": { image: "/concept/book/nw-net-neutrality.png", easy: "ISP(통신사)가 어떤 트래픽이든 내용·유형·단말기를 따지지 말고 똑같이 취급해야 한다는 원칙입니다. 넷플릭스 트래픽이 많다고 일부러 느리게 하거나 돈을 더 받고 빠르게 해주면 안 된다는 얘기입니다. 3대 원칙은 '무엇을 금지하는가'로 묶으면 외워집니다 — 비차별성 확립(트래픽 이용 차별 금지: CP·이용자 등급 차등 금지, 이용자 권리 보호, 단대단 선택권), 상호접속 허용(일방적 접근 차단 금지: 서비스 이용 보장, 컨텐츠 차단 금지, 합법적 트래픽 관리), 접근성 제공(자유로운 이용 허용: 정책 투명성, 디바이스 접근 보장). 국내 망 중립성 가이드라인('21.1.11)의 조문 4개도 함께 봐두세요: 투명성(제4조), 차단금지(제5조), 불합리한 차별 금지(제6조), 합리적인 트래픽 관리(제7조). 마지막 제7조가 예외 조항인데, 망 보안·안정성 확보나 일시적 혼잡 해소, 법령상 필요한 경우엔 통신사가 트래픽을 관리할 수 있습니다." },
"nw-ibn": { image: "/concept/book/nw-ibn.png", easy: "지금까지는 관리자가 '이 포트를 열어라, 이 경로로 보내라' 하고 장비마다 명령을 넣었다면, IBN은 '영업팀 화상회의는 끊기지 않게 해줘' 같은 의도(Intent)만 말하면 AI가 알아서 유·무선망 설정을 잡아주는 기술입니다. 핵심은 폐쇄 루프(Closed-Loop Intent Control) 순환입니다: 의도 입력 → Translation/Optimization이 High-level Policy로 번역 → Activation/Configuration이 Low-level Policy로 장비에 적용 → Infrastructure 동작 → Monitoring 데이터 수집 → Assurance가 의도대로 됐는지 검증 → Feedback으로 다시 번역 단계로 돌아감. 요건 4개(변환과 검증 / 자동 수행 / 상황 인식 / 동적인 최적화)가 이 루프의 각 구간과 그대로 대응합니다. 요즘은 의도 번역 단계에 LLM이 들어가 음성·텍스트 의도를 컴퓨터 스크립트로 바꿉니다. 앞서 본 '네트워크 지능'과 같은 폐쇄형 반복 제어 구조라는 점을 엮어두면 답안에서 쓸 데가 많습니다." },
"nw-sdr": { image: "/concept/book/nw-sdr.png", easy: "예전 무선 단말기는 주파수 대역·변조 방식이 하드웨어 칩에 박혀 있어서, 규격이 바뀌면 기기를 새로 사야 했습니다. SDR은 그 무선 특성(주파수 범위, 변조 방식, 무선 출력)을 소프트웨어로 바꿀 수 있게 만든 기술입니다 — 소프트웨어만 업데이트하면 다른 통신 규격을 쓰는 단말이 됩니다. 개념도 비교가 핵심입니다: 기존 단말기는 기저대역부가 BBA(ADC/DAC) → MSM → CODEC 으로 하드웨어 블록이 줄줄이 나뉘어 있는데, SDR 단말기는 안테나에서 받은 신호를 ADC로 바로 디지털화한 뒤 그 블록 전체를 SDR 소프트웨어 하나가 처리합니다. 그래서 앞단 RF는 광대역 처리가 필요해집니다. 기술 요소는 4갈래 — 소자(A/D·D/A, 광대역 RF, Digital IF, FPGA/DSP), 소프트웨어(SCA 구조, 미들웨어, RTOS, XML/UML 기술언어), 통신(핸드오버, OTA 다운로드, 보안·인증), 시스템(HW/SW 플랫폼, 스마트 안테나)." },
"nw-sdwan": { image: "/concept/book/nw-sdwan.png", easy: "SDN이 데이터센터·사옥 안(LAN)에서 제어와 전송을 분리한 기술이라면, SD-WAN은 그 방식을 지사와 본사를 잇는 WAN 구간으로 끌고 나온 것입니다. 기존에는 비싼 MPLS 전용회선 하나에 의존했는데, SD-WAN은 MPLS와 일반 인터넷 회선을 동시에 묶어놓고 소프트웨어가 상황에 맞춰 골라 씁니다. 장비는 둘 — SD-WAN Controller(중앙에서 정책·QoS 설정, 토폴로지 관리, 성능 보고)와 각 지점의 SD-WAN CPE(=SD-WAN Edge, 오버레이 터널을 만들고 방화벽·암호화·WAN 최적화 수행). 시험에 나오는 건 트래픽 제어 5종입니다: Dynamic Path Switching(경로 성능이 나빠지면 다른 경로로 갈아탐), Packet Duplication(중요 패킷은 여러 경로로 중복 전송해 유실 대비), Link Aggregation(여러 물리 회선을 논리적 하나로 묶어 대역폭 확장), Network Segmentation(VLAN으로 논리 분리, 세그먼트 간 통신은 방화벽 경유), Traffic Steering(애플리케이션별로 경로를 따로 지정)." },
"nw-openflow": { image: "/concept/book/nw-openflow.png", easy: "SDN이 '제어와 전송을 분리하자'는 개념이라면, 오픈플로우는 그 둘을 실제로 잇는 표준 인터페이스 규격입니다 — 즉 SDN 컨트롤러가 스위치에게 명령을 내리는 공용 언어입니다. 스위치 쪽 3대 구성요소: OpenFlow Channel(컨트롤러↔스위치 관리 인터페이스), Flow Table(패킷 처리 규칙 모음), Group Table(여러 동작을 묶은 실행 집합). Flow Table이 핵심인데, 각 Flow entry는 match fields(어떤 패킷에 해당하나) + counters(통계) + instructions(맞으면 뭘 하나) 세 조각으로 되어 있고, 테이블 여러 개를 차례로 거치는 파이프라인(Pipelining)으로 처리합니다. 프로토콜 메시지 3종도 방향으로 외우면 쉽습니다 — Controller-to-Switch(컨트롤러가 시작, 상태 확인·제어), Asynchronous(스위치가 시작, 상태 변경 보고), Symmetric(양쪽 다 시작 가능, 요청 없이 전송)." },
"nw-iot-matter": { image: "/concept/book/nw-iot-matter.png", easy: "스마트홈 기기가 제조사마다 규격이 달라 서로 연동이 안 되던 문제를 풀려고 CSA(Connectivity Standards Alliance)가 만든 IoT 통합 표준입니다. 핵심 아이디어는 'IP 기반 응용계층 표준' — 아래쪽 무선 방식은 각자 쓰던 걸 그대로 두고, 위에 IP(IPv6)와 공통 응용 계층(Matter)을 얹어 통일합니다. 스택을 아래에서 위로 읽으면: Radio는 802.11(Wi-Fi)과 802.15.4(Thread) 두 갈래, 그 위 Network는 IPv6로 합쳐지고, Transport는 TCP/IP(신뢰성)와 UDP(대량 전송), 맨 위가 Matter입니다. BLE는 옆으로 빠진 별도 스택인데 통신용이 아니라 기기 최초 등록(provisioning) 전용입니다. Wi-Fi와 Thread를 나눠 쓰는 이유가 시험 포인트 — Wi-Fi는 동영상 같은 고속 통신용, Thread는 메쉬로 SPOF를 막고(최대 64개 라우터) 배터리로 도는 저전력 기기용입니다." },
// ── 5주차 데이터베이스(DB) ──
"db-transaction": { image: "/concept/book/db-transaction.png", easy: "계좌이체를 생각하면 됩니다 — '내 계좌에서 빼기'와 '상대 계좌에 넣기'는 반드시 둘 다 되거나 둘 다 안 돼야 합니다. 이렇게 쪼갤 수 없는 한 덩어리 작업이 트랜잭션입니다. 특징 4개가 ACID — 원자성(All or Nothing, 회복기법이 보장), 일관성(끝나면 모순 없는 상태, 무결성 제약·동시성 제어가 보장), 고립성(실행 중간 결과를 남이 못 봄, Locking), 영속성(완료 결과는 영구 저장, 회복기법). 상태전이도 [활부완실천]도 시험 단골입니다 — 활동(Active) → 부분 완료(마지막 명령문 실행 후) → 완료(Committed), 실패하면 실패(Failed) → 철회(Aborted, 시작 전 상태로 환원). '부분 완료'가 커밋 직전 상태라는 점이 헷갈림 포인트입니다." },
"db-isolation-level": { image: "/concept/book/db-isolation-level.png", easy: "고립성을 칼같이 지키면(Serializable) 안전하지만 동시에 일할 수 있는 트랜잭션이 줄어 느려집니다. 그래서 '어느 정도 부정합을 감수하고 동시성을 벌 것인가'를 4단계로 고르는 것이 격리 레벨입니다 [언커리씨] — Read Uncommitted(커밋 안 된 것도 읽음), Read Committed(커밋된 것만), Repeatable Read(같은 쿼리 두 번 결과 보장), Serializable(완전 직렬화). 아래로 갈수록 고립성↑ 동시성↓. 각 레벨이 막는 이상현상 3종 [DNP 부비가]과 짝지어야 합니다 — Dirty Read(부정판독: 커밋 전 데이터를 읽음), Non-Repeatable Read(비반복판독: 두 번 읽는 사이 남이 수정·삭제), Phantom Read(가상판독: 없던 행이 나타남). 표에서 '레벨이 하나 오를 때마다 위에서부터 하나씩 불가능해진다'로 외우면 됩니다." },
"db-ansi-sparc": { image: "/concept/book/db-ansi-sparc.png", easy: "DB를 보는 눈높이를 3층으로 나눈 표준 구조입니다 [외개내] — 외부 스키마(사용자·응용 프로그램마다 다른 뷰), 개념 스키마(조직 전체의 논리적 구조, 통합 관점), 내부 스키마(디스크에 실제로 저장되는 물리적 방법). 층을 나눈 이유가 데이터 독립성입니다. 논리적 독립성 — 개념 스키마(테이블 구조)가 바뀌어도 외부 스키마(응용 화면)는 안 바뀌게. 물리적 독립성 — 내부 스키마(저장 방식·인덱스)가 바뀌어도 개념·외부는 안 바뀌게. 층 사이를 잇는 것이 사상(Mapping)인데, 외부/개념 사상은 응용 인터페이스, 개념/내부 사상은 저장 인터페이스입니다. '아래층을 갈아엎어도 위층이 모르게'가 이 구조의 존재 이유입니다." },
"db-modeling": { image: "/concept/book/db-modeling.png", easy: "현실의 업무를 컴퓨터에 넣을 수 있는 데이터 구조로 바꿔 가는 과정입니다. 개념도 그대로 — 현실 세계(개체) → 개념적 구조 → 논리적 구조 → 저장 DB. 원칙 3개 [커상논]: 커뮤니케이션(모두가 이해할 모델), 상세화(최소 공통 분모로 분할·중복 제거), 논리적 표현(비즈니스를 그대로 반영). 단계 [개논물]가 핵심 — 개념 모델링(주제 영역 → 후보 Entity → 핵심 Entity → 관계 정의 [주후핵관]), 논리 모델링(속성 정의 → Entity 상세화(정규화·M:M 해소) → 이력 관리 [속엔이]), 물리 모델링(환경 조사 → 논리모델 변환 → 반정규화 [물논반]). '정규화는 논리 단계, 반정규화는 물리 단계'가 시험 포인트입니다." },
"db-integrity": { image: "/concept/book/db-integrity.png", easy: "138회 1교시에 나온 기출 토픽입니다. 무결성은 데이터의 정확성·일관성·유효성을 지키는 규칙인데, 두 축으로 나눠 외웁니다. ① 데이터 무결성 [개참속사키도] — 개체(기본키는 NULL 불가·유일, PK), 참조(외래키는 상대 기본키 값이거나 NULL, FK), 속성(지정된 데이터 형식만), 사용자 정의(Business Rule 준수, Trigger·Check), 키(동일 키값 튜플 불가), 도메인(정의된 범위 안의 값만, CHECK). ② 릴레이션 무결성 [상과집튜즉지] — 상태/과도(정적이냐 상태 변환이냐), 집합/튜플(전체냐 처리 중인 튜플이냐), 즉시/지연(연산 즉시냐 커밋 후냐). 개체·참조 무결성 구분(PK vs FK)이 가장 자주 나옵니다." },
"db-relation-key": { image: "/concept/book/db-relation-key.png", easy: "튜플(행)을 한 줄로 콕 집어낼 수 있는 속성 묶음이 키입니다. 도출 절차 [유최대] — 유일성 검증(함수적 종속성 확인) → 최소성 검증(여기서 후보키가 나옴) → 엔티티 대표성으로 기본키 확정. 유형 5개 [슈후기대외]를 포함 관계로 외우면 쉽습니다: 슈퍼키(유일성만, 최소성 없음) ⊃ 후보키(유일성+최소성) ⊃ 기본키(후보키의 대표 하나)와 대체키(뽑히고 남은 나머지), 그리고 외래키(내 속성이 다른 릴레이션의 기본키인 것). 제약유형 3개도 함께 — 본질적(PK 필수·셀은 단일 값=1차 정규화 의미), 내재적(스키마에 지정, FK·Check·Default), 명시적(프로그램·수작업 생성)입니다." },
"db-entity": { image: "/concept/book/db-entity.png", easy: "업무에 필요한 정보를 담는 데이터 덩어리입니다. 아무 명사나 엔티티가 되는 게 아니라 자격 요건 6개 [업식집프속관]를 통과해야 합니다 — 업무적 필요성, 식별성(식별자로 한 개씩), 집합성(다수의 값), 프로세스 활용(CRUD 확인), 속성 보유, 관계성(다른 엔티티와 최소 1개 관계). 유형 [유개사기중행]은 두 축으로 — 유무형 기준: 유형(사원·물품), 개념(조직·보험상품), 사건(주문·청구) / 발생시점 기준: 기본(독립 생성, 타 엔티티의 부모 — 사원·부서·고객), 중심(기본에서 파생, 행위를 낳음 — 계약·주문·매출), 행위(변경 잦고 대량 발생 — 주문목록·사원변경이력). 도출은 후보 도출(명사 표기) → 정제(중복·유사 정리) → 확정 순입니다." },
"db-functional-dependency": { image: "/concept/book/db-functional-dependency.png", easy: "'학번을 알면 이름이 정해진다'처럼 결정자가 종속자를 정하는 제약이 함수적 종속성이고, 정규화가 단계별로 제거하는 대상이 바로 이것입니다. 유형 [완부이결다조]와 정규형을 짝지어야 합니다 — 완전 함수 종속(기본키 전체에만 종속, 이상적), 부분 함수 종속(키의 일부에 종속 → 2NF가 제거), 이행 함수 종속(A→X→Y로 건너 종속 → 3NF가 제거), 결정자 함수 종속(결정자가 후보키가 아님 → BCNF가 제거), 다중값 종속(X->>Y → 4NF), 조인 종속(셋 이상으로 나눠야 복원 가능 → 5NF). '몇 정규형이 무엇을 제거하나'가 단골 출제이고, 추론규칙이 암스트롱 공리로 이어집니다." },
"db-armstrong": { image: "/concept/book/db-armstrong.png", easy: "주어진 함수종속 집합 F에서 숨어 있는 종속까지 전부 유도해 폐포(F+)를 구하는 추론 규칙입니다. 특징 [정완] — 정당(Sound: 틀린 종속은 안 만든다), 완전(Complete: 맞는 종속은 다 찾는다). 기본규칙 [기재부이] — 재귀성(Y⊆X면 X→Y), 부가성(X→Y면 XZ→YZ), 이행성(X→Y, Y→Z면 X→Z). 부가규칙 [부분합의] — 분해(X→YZ면 X→Y, X→Z), 합집합(X→Y, X→Z면 X→YZ), 의사이행(X→Y, YZ→W면 XZ→W). 계산 문제도 나옵니다 — F={A→B, A→C, CG→H, CG→I, B→H}일 때 AG의 폐포는 ABCGHI, 그래서 AG가 후보키입니다." },
"db-normalization": { image: "/concept/book/db-normalization.png", easy: "136회 1교시 기출입니다. 테이블 하나에 다 욱여넣으면 이상현상 [삽삭갱]이 생깁니다 — 삽입 이상(새 학과 넣으려고 가짜 학번 생성), 삭제 이상(학생 지우면 학과 정보도 소멸), 갱신 이상(학과 바꾸면 여러 행을 같이 수정). 원인은 부분함수 종속과 이행함수 종속이고, 처방이 릴레이션 분해=정규화입니다. 단계별 제거 대상을 한 줄로: 1NF(원자값 아닌 속성 분리) → 2NF(부분함수종속 제거) → 3NF(이행함수종속 제거) → BCNF(결정자가 후보키 아닌 종속 제거) → 4NF(다중값 종속) → 5NF(조인 종속). 원칙 [무중분] — 무손실, 중복 감소, 분리. 함수적 종속성 토픽과 한 몸으로 외우세요." },
"db-denormalization": { image: "/concept/book/db-denormalization.png", easy: "135회 2교시 기출입니다. 정규화로 잘게 쪼갠 테이블은 깨끗하지만 조인이 많아져 느려집니다. 그래서 조회 성능이 더 중요할 때 일부러 다시 합치는 것이 반정규화입니다. 절차 [대다반]이 포인트 — ① 대상 조사(범위 처리 빈도·대량 처리·통계 프로세스·조인 개수) ② 다른 방법 유도 검토(뷰·클러스터링·인덱스 조정으로 해결되면 반정규화 안 함) ③ 적용. '바로 합치는 게 아니라 다른 방법을 먼저 검토한다'가 시험 포인트입니다. 기법 [테칼관]은 레벨별로 — 테이블(병합·분할·추가), 컬럼(중복·계산·이력 컬럼 추가), 관계(중복관계 추가). 공통 장단점: 조인 비용은 줄지만 갱신 비용이 늘고 무결성 관리가 어려워집니다." },
"db-connection-trap": { image: "/concept/book/db-connection-trap.png", easy: "ER 모델을 그렸는데 관계가 모호해서 원하는 답이 안 나오는 설계 실수입니다. 두 가지 — 부채꼴 함정(Fan Trap): 단과대학 1─N 교수, 단과대학 1─N 학과처럼 한 엔티티에서 부챗살처럼 관계가 퍼져 '교수가 어느 학과 소속인지' 알 수 없는 경우. 해결은 관계 재배치(교수 N─1 학과 N─1 단과대학으로 사슬을 바로 세움). 균열 함정(Chasm Trap): 학생─(지도)─교수─(재직)─학과 경로만 있는데 지도교수 없는 학생이 생기면 그 학생의 학과를 알 수 없는 경우 — 관계에 균열(빈틈)이 있는 것. 해결은 균열 난 두 엔티티(학과-학생) 사이에 재학함 관계를 직접 추가. '퍼져서 모호하면 부채꼴, 끊겨서 못 가면 균열'로 구분하세요." },
"db-relational-algebra": { image: "/concept/book/db-relational-algebra.png", easy: "원하는 데이터를 '어떻게(How) 꺼낼지' 연산 순서로 기술하는 절차적 언어입니다. 연산자를 두 묶음으로 — 일반 집합 연산자 [합교차카]: 합집합 ∪, 교집합 ∩, 차집합 −, 카티션 프로덕트 ×(두 릴레이션 튜플을 모두 연결). 순수 관계 연산자 [셀프조디]: 셀렉트 σ(조건 맞는 행 고르기), 프로젝션 π(원하는 열만 뽑기), 조인 ⋈(공통 속성으로 연결), 디비전 ÷(S의 모든 튜플과 관련된 R의 튜플). 셀렉트는 가로로 자르고 프로젝션은 세로로 자른다고 기억하면 그림이 그려집니다. 관계해석(What, 선언적)과의 대비가 단골 출제입니다." },
"db-relational-calculus": { image: "/concept/book/db-relational-calculus.png", easy: "'무엇(What)을 원하는지'만 수학 논리식으로 선언하는 비절차적 언어입니다 — SQL이 이 계열입니다. 수식 재료는 연산자(∨ 또는, ∧ 그리고, ¬ 부정)와 정량자(∀ 모든 튜플, ∃ 하나라도 존재). 유형 [튜도] 구분이 핵심 — 튜플 관계해석(TRC): 튜플(행) 단위로 질의, { t | t ∈ Employees AND t.age > 30 } 처럼 행 전체를 반환. 도메인 관계해석(DRC): 속성(열) 단위로 질의, { <name, age> | ∃ d (…) } 처럼 특정 속성 값만 반환. 예시 하나로 연결: {(t.Ename, t.Salary) | t ∈ EMPLOYEE ∧ t.Salary ≥ 3000} = SELECT Ename, Salary FROM EMPLOYEE WHERE Salary >= 3000. 관계대수(How)와 짝으로 외우세요." },
"db-recovery": { image: "/concept/book/db-recovery.png", easy: "장애가 나도 트랜잭션의 일관성·무결성을 되살리는 기법입니다. 장애 유형 [하소사] — H/W(Media 장애: 디스크 문제로 데이터 유실), S/W(Syntax·Instance 장애), 사용자(Fat-finger: 실수로 테이블 삭제). 회복의 두 연산이 축입니다 — REDO(완료된 트랜잭션을 다시 반영), UNDO(미완료 트랜잭션을 되돌림). 기법 [회로(즉지)체그아]: 즉시 갱신(갱신마다 Log+DB 반영, 장애 시 UNDO), 지연 갱신(Log만 쌓고 종료 후 DB 반영, 장애 시 REDO만 — UNDO 불필요), 체크포인트(검사점 이후 완료분 REDO·진행분 UNDO), 그림자 페이지(시작 전 페이지 테이블 복제, 로그 불필요), ARIES(WAL과 LSN 이용 — 현대 DBMS 표준). '즉시=UNDO 필요, 지연=REDO만'이 헷갈림 포인트입니다." },
"db-concurrency": { image: "/concept/book/db-concurrency.png", easy: "여러 사용자가 같은 데이터를 동시에 만질 때 사고를 막는 제어입니다. 안 하면 생기는 문제 4가지 [갱현모연] — 갱신손실(같은 데이터를 동시에 고쳐 한쪽이 덮임), 현황파악오류(Dirty Read: 중간 결과를 참조), 모순성(일관성 없는 상태에서 읽어 모순 발생), 연쇄복귀(하나가 rollback되면 그 데이터를 쓴 트랜잭션도 줄줄이 rollback). 기법은 Locking(상호 배제)이 기본이고 [2PL낙타다] — 2PL(확장단계엔 Lock만, 수축단계엔 Unlock만 → 직렬성 보장), 낙관적 검증(실행 중엔 안 막고 종료 시 일괄 검증), Timestamp ordering(식별자 순서대로 직렬화), MVCC(데이터의 여러 버전 중 직렬 가능성이 보장되는 버전을 골라 접근 — 읽기가 쓰기를 안 막음). '비관적=미리 잠금, 낙관적=나중 검증'의 대비가 시험 포인트입니다." },
"db-validation": { image: "/concept/book/db-validation.png", easy: "충돌이 드물 거라고 '낙관'하고, 실행 중엔 잠그지 않다가 끝날 때 검사하는 방식입니다. 3단계 [판확기] — 판독(Read: 모든 갱신을 메모리 사본에만, DB엔 미반영) → 확인(Validation: DB 반영 전에 직렬 가능성 위반 여부 검사) → 기록(Write: 통과하면 디스크 반영, 실패하면 취소·복귀). 확인 단계의 3가지 통과 조건이 심화 포인트 — 조건1: Ti가 Tk 시작 전에 이미 끝남(겹침 없음), 조건2: Ti의 Write-set과 Tk의 Read-set이 안 겹침(Tk 검증 전 종료), 조건3: Write-Read·Write-Write 모두 안 겹침. 타임스탬프 3개(Start·Validation·Finish)로 판정합니다. 읽기 위주 환경에 유리하고, 충돌이 잦으면 복귀 비용이 커집니다." },
"db-mvcc": { image: "/concept/book/db-mvcc.png", easy: "읽는 사람을 잠금으로 기다리게 하지 않고, 데이터의 옛 버전을 보여줘서 읽기 일관성을 지키는 방식입니다. 구현이 DBMS마다 달라 두 유형을 비교합니다. MGA(PostgreSQL): 업데이트가 나면 기존 행은 그대로 두고 새 행을 추가(기존 데이터에 표시만) — 그래서 물리적 위치가 바뀌고, 업데이트마다 인덱스 수정이 발생하며, 죽은 버전을 청소하는 VACUUM이 주기적으로 필요합니다. Rollback Segment(Oracle): 기존 블록을 새 데이터로 바로 바꾸되 이전 데이터를 롤백 세그먼트에 보관 — 셀렉트 시점의 SCN보다 나중에 바뀐 블록은 이전 이미지로 CR 블록을 만들어 읽습니다. 물리적 위치가 안 바뀐다는 게 MGA와의 결정적 차이입니다. '포스트그레는 옆에 새로 쓰고, 오라클은 제자리에 쓰고 과거를 따로 보관'으로 기억하세요." },
"db-distributed": { image: "/concept/book/db-distributed.png", easy: "138회 3교시 기출입니다. 사용자에겐 하나의 DB처럼 보이지만 실제로는 여러 지역에 흩어져 있는 구조입니다. 핵심 시험 포인트는 투명성 5가지 [위복병분장] — 위치(데이터가 어디 있는지 몰라도 됨, Distributed Data Dictionary 필요), 복제(몇 곳에 복제됐는지 몰라도 됨), 병행(동시에 트랜잭션해도 이상 없음), 분할(릴레이션이 단편으로 나뉜 걸 몰라도 됨), 장애(지역 시스템이 죽어도 무결성 보존 — 2PC 활용). 설계 전략 [탑버하]는 Top Down(신규 구축, 전체 설계 후 분산), Bottom Up(기존 DB들을 통합, 게이트웨이 필요), Hybrid(복잡도가 심해 둘을 혼합). 분산방법 [위분복요] — 위치·분할(수평/수직)·복제(부분/광역)·요약(분석/통합) 분산입니다." },
"db-2pc": { image: "/concept/book/db-2pc.png", easy: "분산 DB에서 여러 노드에 걸친 트랜잭션을 '전원 커밋 아니면 전원 롤백'으로 만드는 합의 절차입니다. 등장인물 — 조정자(Global Coordinator: 참여자 목록을 갖고 커밋을 지휘), 지역 노드(로컬 트랜잭션 수행, 조정자 결정에 따름), Commit Point Site(가장 중요한 데이터를 가진 노드로 제일 먼저 커밋·롤백), 클라이언트. 이름 그대로 2단계입니다 — Phase 1(Prepare): 커밋 요구가 오면 조정자가 Commit Point Site를 정하고 모든 노드에 Prepare 메시지를 보내 응답을 받음. Phase 2(Commit): 전원이 '준비됐다'고 하면 commit 명령, 하나라도 에러 보고가 오면 Rollback 명령. 분산 DB의 장애 투명성을 받치는 메커니즘이라 분산 DB 토픽과 세트로 나옵니다." },
"db-nosql": { image: "/concept/book/db-nosql.png", easy: "RDBMS의 테이블-컬럼 스키마 없이, 분산 환경에서 단순 검색·추가에 강하고 처리율이 높은 DB입니다. 유형 4개 [키컬도그]가 핵심 — Key-Value(가장 단순, 단위연산 빠름, 대신 키 범위 처리 안 됨), Column Family(키 기반 Sorting 저장으로 키 범위 처리를 개선한 Ordered Key-Value), Document(JSON·XML 문서 저장, 임의 속성 추가 자유, 대신 Parsing 오버헤드), Graph(관계 자체를 저장, Traversing이 미리 저장돼 관계 검색이 빠름). 각 유형의 '개선 계보'로 외우면 좋습니다 — Key-Value의 범위 처리 약점을 Column Family가, 구조 표현 약점을 Document가 보완. 절차는 탐색(도메인 파악) → 설계(쿼리결과 디자인·패턴 모델링·기능 최적화) → 최적화(후보 선정·테스트) 순입니다." },
"db-nosql-modeling": { image: "/concept/book/db-nosql-modeling.png", easy: "Put/Get밖에 없는 NoSQL에서 RDBMS처럼 다양한 쿼리를 지원하려면 테이블을 설계로 풀어야 합니다. 그 설계 레시피 모음입니다. 기본 패턴 3 — Denormalization(중복 저장해서 Join 없이 한 번의 I/O로 조회), Aggregation(1:n 관계 최소화, row마다 컬럼·타입이 달라도 됨 = Soft Scheme), Application Side Join(Join이 꼭 필요하면 클라이언트 앱에서 처리). 확장 패턴 3 — Atomic aggregation(일관성 위해 테이블을 하나로 통합), Index Table(인덱스가 없으니 별도 인덱스 테이블을 직접 생성), Composite Key Table(복합 키 인덱스 구성). 계층 패턴 3 — Tree Aggregation(트리 전체를 하나의 Value에), Adjacent Lists(부모·자식 포인터 저장), Materialized Path(루트부터 전체 경로를 key로 저장)입니다." },
"db-cap-base": { image: "/concept/book/db-cap-base.png", easy: "분산시스템은 일관성(C: 모든 서버가 같은 시점에 같은 데이터)·가용성(A: 일부 서버가 죽어도 정상 동작)·부분결함허용(P: 메시지 유실에도 동작) 셋을 다 가질 수 없고 둘만 고를 수 있다는 것이 CAP [일가파]입니다. 조합별 제품까지 — CA(Oracle·MySQL 등 RDBMS), CP(HBase·MongoDB — 분할 시 가용성 저하), AP(Dynamo·Cassandra — 일관성 저하). 한계는 '네트워크 분할 시 C와 A 중 하나를 골라야 한다'는 것이고, 이를 보완한 것이 PACELC입니다. BASE [가분데비일]는 가용성을 중시하는 NoSQL의 성질 — Basically Available(복사본 저장으로 항상 가용), Soft State(노드 상태는 외부 전송 정보로 결정), Eventually Consistent(일시적 비일관성을 허용하되 결국 일관성 회복). ACID와의 대비가 단골입니다." },
"db-pacelc": { image: "/concept/book/db-pacelc.png", easy: "CAP은 장애 상황만 다뤄서 '평상시엔 뭘 포기하나'를 설명 못 합니다. PACELC는 이를 보완해 두 상황으로 나눕니다 — P(파티션, 장애) 상황에서는 A(가용성)와 C(일관성)가 상충하고, E(else, 정상) 상황에서는 L(지연시간)과 C(일관성)가 상충한다(모든 노드에 반영하려면 응답이 길어지므로). 그래서 시스템이 4가지로 분류됩니다 — PC/EC(늘 일관성 우선: HBase·VoltDB·Megastore), PA/EL(늘 가용성·속도 우선: Cassandra·Dynamo), PA/EC(장애 땐 가용성, 평상시엔 일관성: MongoDB), PC/EL(장애 땐 일관성, 평상시엔 속도: PNUTS). 대표 제품과 분류를 짝짓는 문제가 그대로 나옵니다." },
"db-newsql": { image: "/concept/book/db-newsql.png", easy: "RDBMS(ACID·SQL은 되지만 확장이 어려움)와 NoSQL(확장·고가용은 되지만 ACID 포기)의 장점만 합친 세대입니다 — ACID + 수평 확장 + 고가용성 + SQL을 모두 지원. 기능 [트아 SA비 노병] — 트랜잭션 측면(SQL 기반 상호작용, ACID 지원, Non-locking 비잠금 동시성제어), 아키텍처 측면(노드단위 고성능, 병렬/비공유 — 데이터가 서버마다 중복 없이 독립 존재). 기술요소는 양쪽에서 가져옵니다 — RDBMS 쪽: 인덱싱·MVCC·샤딩 / NoSQL 쪽: 스키마리스·인메모리·DB 스케일링(scale-out). 3자 비교표가 그대로 출제됩니다: ACID(New○ R○ No✕), BASE(New○ R✕ No○), 확장(New/No는 Scale-out, R은 Scale-up), 솔루션(VoltDB·Spanner / Oracle·MSSQL / MongoDB·Redis)." },
"db-vector-db": { image: "/concept/book/db-vector-db.png", easy: "137회 4교시 기출에 모의고사 단골인 최신 토픽입니다. 텍스트·이미지 같은 원본을 임베딩 모델로 고차원 숫자 벡터로 바꿔 저장하고, '비슷한 것'을 찾는 DB입니다 — RAG의 저장소가 이것입니다. 동작 5단계: ① 벡터 임베딩(원본→고차원 벡터) ② 저장·인덱싱(해싱/양자화/그래프/트리 기반) ③ 쿼리 처리(질문도 같은 모델로 벡터화) ④ 유사성 측정 ⑤ 후처리(필터링·순위 재조정). 알고리즘 [랜양LHI] — 랜덤 투영(저차원 투영), 제품 양자화 PQ(나눠서 압축), LSH(유사한 것끼리 같은 해시), HNSW(계층적 그래프 탐색), IVF(그룹 나눠 필요한 그룹만 검색). 유사도 측정은 코사인(각도)·유클리드(직선거리)·맨해튼(격자거리)·내적(방향)·자카드(집합)입니다." },
"db-ann": { image: "/concept/book/db-ann.png", easy: "벡터 DB의 검색 엔진입니다. 정확한 최근접 이웃(NN)을 전수 비교로 찾으면 너무 느려서, '거의 가장 가까운' 이웃을 빠르게 찾는 근사 알고리즘입니다. 절차(트리 기반 예시): ① 임의의 두 점 사이 hyperplane으로 공간을 나누고 ② subspace의 점 개수를 노드로 binary tree 생성 ③ 점이 K개 넘으면 재귀 반복 ④ 검색 시 트리를 타고 내려가 해당 subspace 안에서만 NN 탐색. 구성요소 3계열이 시험 포인트 — 공간 분할 기반(k-d 트리·Annoy·LSH: 직관적이나 고차원에서 성능 저하), 그래프 기반(HNSW·NSG: 정확도·효율 높으나 인덱스 구축이 김), 압축·양자화 기반(PQ·IVF: 메모리·속도 유리하나 정보 손실로 정확도 저하 위험). 벡터 DB 토픽과 한 세트입니다." },
"db-sql": { image: "/concept/book/db-sql.png", easy: "RDBMS에 말을 거는 표준 언어이고, 명령어를 4갈래로 분류하는 것이 전부입니다. DDL(구조 정의 — CREATE·ALTER·DROP·TRUNCATE·RENAME): 테이블 같은 스키마 객체를 만들고 바꾸고 없앰. DML(데이터 조작 — SELECT·INSERT·UPDATE·DELETE): 저장된 자료를 넣고 고치고 지우고 조회. DCL(권한 제어 — GRANT·REVOKE): 사용자에게 권한을 주거나 뺏음. TCL(트랜잭션 제어 — COMMIT·ROLLBACK·SAVEPOINT): 트랜잭션을 확정·취소. 헷갈림 포인트 둘 — TRUNCATE는 데이터를 지우지만 DDL이고(구조 초기화), COMMIT·ROLLBACK은 원래 DCL로 분류하다가 따로 떼어 TCL이라 부르기도 한다는 점입니다." },
"db-join": { image: "/concept/book/db-join.png", easy: "두 테이블을 엮어 원하는 데이터를 뽑는 방법인데, 시험은 '논리(어떤 결과)'보다 '물리(어떻게 실행)'를 묻습니다. 관계대수 측면: Equi·Natural·Outer·Semi Join(벤 다이어그램의 LEFT/RIGHT/INNER/FULL). 메커니즘 측면 3형제가 핵심 — Nested Loop(선행 테이블을 한 건씩 읽으며 후행을 인덱스로 찾음: 소량·OLTP·부분범위·Buffer Cache), Sort Merge(양쪽을 각자 정렬해 차례로 병합: 인덱스 없을 때·대량), Hash(작은 집합으로 메모리에 해시 테이블을 만들고 큰 집합이 탐색: 대량 집계·OLAP). 비교표의 힌트(/*+ USE_NL, USE_MERGE, USE_HASH */)와 사용자원(Buffer Cache vs PGA) 구분까지 외우면 완성입니다." },
"db-index": { image: "/concept/book/db-index.png", easy: "책 뒤의 찾아보기처럼 <키 값, 레코드 주소> 쌍을 모아 둔 DB 오브젝트로, 풀 스캔 없이 원하는 행에 바로 가게 해 줍니다. 유형 [트해비 함조도 정동 논물]을 분류 축으로 — 형태(트리 기반: RDBMS 대부분 B-tree / 해시 기반: = 계열 연산만 가능 / 비트맵: 비트로 저장·ROWID 자동 생성), 목적(함수기반·조인·도메인 인덱스), 구조(정적: 구조 불변 / 동적: 빈 공간을 미리 준비), 논리(논리적/물리적). 스캔방식 5종은 그림과 함께 — Range Scan(수직 탐색 후 필요한 범위만), Full Scan(리프를 처음부터 끝까지, 차선책), Unique Scan(= 조건, 수직 탐색만), Skip Scan(선두 칼럼이 조건에 없어도 활용), Range Scan Descending(뒤에서 앞으로 내림차순). '해시 인덱스는 범위 검색이 안 된다'가 자주 나오는 함정입니다." },
"nw-nwdaf": { image: "/concept/book/nw-nwdaf.png", easy: "5G 코어 안에 들어간 'AI 분석 담당 장비'입니다(3GPP 표준). 네트워크가 돌아가며 쏟아내는 로그·상태 정보를 모아 머신러닝 모델을 만들고, 그 모델로 앞으로 무슨 일이 생길지 예측해 네트워크를 실시간으로 제어합니다. 기능이 5개로 쪼개져 있는데 학습과 추론이 분리된 게 핵심입니다 — MTLF는 모델을 '학습'해서 배포하고, AnLF는 그 모델로 '추론'해서 요청한 NF(Analytics Consumer)에게 통계·예측 결과를 돌려줍니다. 나머지 셋은 데이터 뒷바라지: DCCF는 같은 요청이 또 오면 기존 결과를 그냥 주고 새 요청이면 OAM/NF에서 데이터를 끌어오는 중복 방지 담당, ADRF는 과거 데이터 창고, MFAF는 수집된 데이터를 AnLF에게 배달하는 메신저입니다." },
"nw-network-intelligence": { image: "/concept/book/nw-network-intelligence.png", easy: "사람이 손으로 하던 네트워크 운용·관리를 AI가 스스로 판단해 완전 자동으로 돌리는 네트워크입니다. 핵심 엔진은 폐쇄형 반복 제어(Closed-loop control) — 데이터 자동 수집 → AI 분석 → 자율 의사결정 → 피드백을 계속 돌려 네트워크가 알아서 최적 상태를 유지합니다. 이게 가능하려면 밑판이 있어야 하는데, SDN/NFV가 소프트웨어로 제어할 수 있는 유연한 구조를 깔아주고, 클라우드·엣지 가상화가 AI 플랫폼을 집중형/분산형으로 배치할 하드웨어를 제공하고, 인공지능/머신러닝과 빅데이터 분석이 실제 판단을 합니다. 결정된 정책을 물리·가상 자원에 실제로 꽂아넣는 건 OAM/MANO의 몫입니다. 쓰이는 곳: 데이터센터 트래픽 조정, 무선 커버리지 최적화, 지능형 슬라이싱·SD-WAN 관리, 장애 예측." },
"nw-6g": { image: "/concept/book/nw-6g.png", easy: "5G 다음 세대로, 최대 1Tbps(5G의 50배)·체감 1Gbps(10배)를 목표로 합니다. 비전 6개를 '초'자 돌림으로 외우면 편합니다 — 초성능(1Tbps), 초대역(100GHz 이상, 대역폭 수십GHz), 초현실(실시간 홀로그램), 초지능(기계학습을 통신 시스템에 내장), 초정밀(무선 구간 지연 0.1ms), 초공간(시속 1000km·고도 10km까지 커버). 지원 기술도 짝을 이룹니다: 테라헤르츠(0.1~10THz) 대역은 경로 손실이 심해서 빔포밍·신규 안테나가 필수고, 통신-컴퓨팅 융합은 무거운 연산을 네트워크가 대신 해주며, 네이티브 AI는 처음부터 AI를 내장하고, 주파수 공유(CBRS)와 5G Massive MIMO를 넘는 안테나 기술이 뒷받침합니다. 시험 포인트는 5G 대비 배수(속도 50배, 대역폭 10배, 지연 1/10, 단말밀도 km²→km³)." },
"nw-digital-twin-network": { image: "/concept/book/nw-digital-twin-network.png", easy: "실제 물리 네트워크를 그대로 복제한 '가상 쌍둥이'를 만들어 놓고, 거기서 설계·진단·분석·최적화를 먼저 돌려본 뒤 실제 망에 적용하는 6G용 네트워크입니다. 시뮬레이션과 헷갈리기 쉬운데 결정적 차이는 매핑(mapping) — 물리망과 가상망이 실시간으로 양방향 연동된다는 점입니다(시뮬레이션은 한 번 만들어놓고 끝). 특징 4개: 데이터(통합 저장소에 수집), 매핑(실시간 인터랙티브), 모델(다양한 모델 내장·유연 결합), 인터페이스(물리↔가상 연결 + 애플리케이션 연결). 아키텍처는 3계층으로, 위에서부터 Network Application(설계·검증·관리·최적화) → Digital Twin(데이터/모델/관리 3개 도메인) → Physical Network이고, 위에서 인텐트를 내리면 트윈이 에뮬레이트한 뒤 제어 메시지를 물리 계층에 전송합니다." },
"nw-ntn": { image: "/concept/book/nw-ntn.png", easy: "기지국을 세울 수 없는 곳 — 바다, 산간, 오지, 항공, 재난 지역 — 에 위성·성층권 비행체·드론을 띄워 5G를 제공하는 기술입니다. 고도별로 GEO(정지궤도) / MEO / LEO(저궤도) 위성, 성층권의 HAPS(고고도 플랫폼), 저고도의 드론(UAV)이 층을 이룹니다. 링크 이름을 구분하는 게 시험 포인트입니다: 서비스 링크는 단말↔위성(3GPP NR 기반), 피더 링크는 위성↔지상 게이트웨이, 위성 간 링크(ISL)는 위성끼리. 위성 방식도 두 가지 — Transparent는 신호를 그냥 중계만 하고, Regenerative는 위성이 직접 복조·재생해서 보냅니다. 기술요소는 전송(빔포밍, MIMO), 네트워크 제어(자원 할당), 보안(인증·암호화), 위치 추적입니다." },
"nw-wifi7": { image: "/concept/book/nw-wifi7.png", easy: "Wi-Fi 6보다 3배 빠른 30Gbps급 무선랜 표준으로, 정식 명칭은 IEEE 802.11be, 별칭은 EHT(Extremely High Throughput)입니다. 속도가 3배가 된 이유를 세 갈래로 보면 됩니다: 대역폭이 160MHz → 320MHz로 2배, 안테나가 MU-MIMO 8×8 → 16×16으로 2배, 변조가 1024QAM → 4096QAM(12bit 반송파 변조)로 20% 향상. 여기에 6GHz 비면허 대역이 추가돼 쓸 수 있는 주파수가 넓어졌습니다(2.4/5/6GHz). 나머지 기술요소도 짝이 있습니다 — MAC 쪽은 AP 간 다중협력통신(AP끼리 데이터·제어 정보를 공유), 하이브리드 ARQ(추가 패리티로 재전송 효율 개선), In-Band Full-Duplex(송·수신 동시)이고, PHY 쪽은 혼합 빔포밍(320MHz 광대역을 협대역 여러 개로 나눠 프리코딩)입니다." },
"nw-wifi8": { image: "/concept/book/nw-wifi8.png", easy: "2028년 예정인 IEEE 802.11bn으로, Wi-Fi 7과 결정적으로 다른 점은 '더 빠르게'가 아니라 '더 안정적으로'입니다 — 핵심 목표가 UHR(Ultra High Reliability, 극도로 높은 신뢰성)이고 대역폭(320MHz)·변조(4096QAM)·공간 스트림(8)은 Wi-Fi 7과 같습니다. 그래서 새로 붙은 기능들이 전부 혼잡·간섭 대응입니다: 멀티 AP 협력(AP끼리 협조), DSO(동적 스펙트럼 최적화)/NPCA(네트워크 성능 및 혼잡 방지), dRU(동적 자원 유닛), 협조적 대상 대기 시간. 버전별 비교표는 시험에 그대로 나올 수 있으니 흐름만 잡아두세요 — 대역폭 40→160→160→320→320, 변조 64→256→1024→4096→4096QAM, MU-MIMO는 Wi-Fi 5부터(DL only) Wi-Fi 6부터 UL&DL, 멀티링크는 Wi-Fi 7부터." },
"nw-passive-wifi": { image: "/concept/book/nw-passive-wifi.png", easy: "Wi-Fi 기기에서 전력을 잡아먹는 범인은 디지털부가 아니라 아날로그 RF부입니다 — 디지털은 무어의 법칙 덕에 10μW까지 떨어졌는데 RF는 여전히 100mW입니다. 그래서 전력 먹는 RF 송신부만 따로 떼어 콘센트에 꽂아두고(Plugged-In Device), 실제 센서 쪽 기기(Passive Device)는 신호를 직접 만들지 않고 공중에 떠다니는 그 신호를 반사만 해서 정보를 실어 보냅니다. 이 반사가 후방산란(backscatter) — 전파가 들어온 방향의 반대인 입사단으로 되돌아오는 현상입니다. 신호를 생성하지 않으니 전력 소모가 거의 없어 초저전력 IoT에 딱 맞습니다. 송신 측 기술은 RF Transfer(Up/Down 컨버터), RF Calibration(안테나 간 진폭·위상 보정), MAC(주소·채널 설정)이고, 수신은 Passive Device와 스마트기기인 Wi-Fi Receiver입니다." },
"nw-sdn": { image: "/concept/book/nw-sdn.png", easy: "기존 스위치는 '어디로 보낼지 결정하는 두뇌(Control Plane — 라우팅, QoS, 정책)'와 '실제로 패킷을 밀어내는 손발(Data Plane — Forwarding)'이 한 장비 안에 붙어 있어서, 정책을 바꾸려면 장비를 하나하나 만져야 했습니다. SDN은 이 둘을 분리해 두뇌를 Controller로 중앙집중화하고, 스위치는 단순 포워딩만 하게 만듭니다. 그 사이를 잇는 개방형 프로토콜이 OpenFlow입니다. 구성 요소 4개: Application(Network OS 위에서 사용자 서비스 제공), Interface(OpenFlow — Control↔Data Plane 연계), Control Plane(ACL·라우팅·인증을 중앙집중 구현), Data Plane(Forward Engine — 단순 패킷 포워딩). 계층으로 보면 APPLICATION LAYER ─API─ CONTROL LAYER(SDN Control Software) ─OpenFlow─ INFRASTRUCTURE LAYER(Network Device)입니다." },
"nw-oran": { image: "/concept/book/nw-oran.png", easy: "기지국 장비가 특정 제조사에 묶이지 않도록, RAN 구간에 가상화를 적용하고 인터페이스를 개방 표준으로 만든 아키텍처입니다(Apache 2.0 라이선스). 구성 3분할: O-CU(중앙 집중 — RRC·PDCP 실행, Control Plane과 User Plane으로 나뉨), O-DU(분산 — RLC·MAC·High PHY 실행, O-RU 근처), O-RU(안테나 부근 — 무선 신호를 디지털로 변환, Low PHY·빔포밍). 여기에 RIC(RAN Intelligent Controller)가 데이터를 수집·분석해 자원을 최적화합니다 — 실시간용 near-RT와 비실시간용 non-RT. 구간 이름도 함께: RU ←Fronthaul→ DU ←Midhaul→ CU ←Backhaul→ 코어. 인터페이스는 A1(non-RT↔near-RT), E2(RIC↔CU/DU), E1(CU-CP↔CU-UP), F1(CU↔DU), Open Front Haul(DU↔RU)." },
"nw-ran-sharing": { image: "/concept/book/nw-ran-sharing.png", easy: "여러 통신사가 기지국·코어망을 함께 써서 중복 투자를 줄이는 기술입니다. 무엇까지 공유하느냐로 3가지가 갈립니다: MORAN — 기지국·컨트롤러는 공유하되 주파수는 사업자별로 분리(대역폭 조절로 품질 차별화 가능, 대신 복잡하고 비용 절감 효과는 작음). MOCN — 주파수까지 공유하고 코어망만 따로(구현이 단순하고 비용 절감이 크지만, 같은 RAN을 쓰니 서비스 차별화가 어려움). GWCN — 코어망의 MME·S-GW까지 공유하고 P-GW만 분리(공유가 가장 많아 구축비는 가장 적지만 구현 복잡성은 최대). 한 줄: 공유 범위 MORAN < MOCN < GWCN, 공유할수록 싸지고 차별화는 어려워집니다." },
"nw-5g-private": { image: "/concept/book/nw-5g-private.png", easy: "통신사 상용망 대신 전용 주파수를 받아 공장·병원·건물 같은 특정 공간에만 구축하는 기업 맞춤형 5G입니다 — 국내 명칭은 '이음 5G'이고 4.7GHz·28GHz 대역을 씁니다. 왜 쓰나: 외부망을 타지 않아 보안이 강하고, MEC(사용자 가까운 곳의 엣지 서버)로 처리해 지연이 매우 짧습니다(스마트 팩토리 로봇 제어 등). 구성 요소: 5G 전용 주파수, UPF(패킷 라우팅·QoS 처리), MEC, gNB(기지국). 기술 요소: SDN(제어·데이터 평면 분리), NFV(장비 기능 가상화), Network Slicing(용도별 논리 분리), Open RAN(CU/DU/RU 분리), RAN Sharing. 유형은 자가구축(On-Premise)과 이음 5G 사업자형(On-Premise / 5G Core CP 공유 / 5G Core 전체 공유)으로 나뉩니다." },
"nw-network-slicing": { image: "/concept/book/nw-network-slicing.png", easy: "물리적으로 하나인 5G 망을 논리적으로 여러 개로 쪼개, 서비스마다 성격이 다른 전용망을 제공하는 기술입니다. 예: 통신/인터넷 Slice(일반 모바일), 물류/기후 Slice(대규모 IoT — 속도보다 접속 수가 중요), 스마트카/스마트팩토리 Slice(Mission critical — 초저지연이 생명). 이걸 가능하게 하는 두 축이 시험 핵심입니다. SDN: 장비에 붙어 있던 제어 기능을 떼어 중앙 컨트롤러로 모으고, OpenFlow 같은 개방형 API로 트래픽 흐름을 소프트웨어가 제어합니다(Application Plane → Control Plane → Data Plane). NFV: 방화벽·로드밸런서 같은 네트워크 장비 기능을 전용 하드웨어에서 떼어내 범용 서버 위의 소프트웨어(VNF)로 돌립니다 — NFVI(인프라) 위에서 VNF들이 동작하고 MANO가 관리합니다." },
"nw-rarp": { image: "/concept/book/nw-rarp.png", easy: "ARP의 반대입니다. 자기 MAC 주소는 아는데 IP 주소를 모르는 호스트(하드디스크 없이 부팅하는 단말 등)가 \"내 물리 주소는 A4:6E:A5:57:82:36인데 내 IP가 뭐죠?\"라고 서버에 물어보는 프로토콜입니다. 동작: RARP Request를 브로드캐스트로 뿌리면 네트워크의 모든 컴퓨터가 받지만 RARP 서버만 응답하고, 응답(RARP Reply)은 유니캐스트로 옵니다 — \"당신 IP는 141.14.56.21입니다\". RARP 서버가 2대 이상이면 둘 다 응답하는데, 호스트는 첫 번째 응답만 받고 나머지는 무시합니다. 한 줄 정리: ARP는 IP→MAC, RARP는 MAC→IP. 오늘날은 대부분 DHCP가 이 역할을 대신합니다." },
"nw-dhcp": { image: "/concept/book/nw-dhcp.png", easy: "Wi-Fi에 연결하면 IP가 자동으로 잡히는 그 원리입니다. 할당 4단계 [DORA]: ① DISCOVER — 클라이언트가 \"DHCP 서버 있나요?\"를 브로드캐스트 ② OFFER — 서버가 \"이 IP 쓰세요\"를 유니캐스트로 제안(IP·임대시간·DNS 정보 포함) ③ REQUEST — 클라이언트가 \"그 IP 쓰겠습니다\"를 브로드캐스트(다른 서버들에게도 거절 통보) ④ ACK — 서버가 최종 승인. 포트는 클라이언트 UDP 68, 서버 UDP 67입니다. 갱신은 임대시간이 50% 남은 시점에 REQUEST → ACK 두 단계로 유니캐스트하고, 해제는 RELEASE 한 번으로 끝(서버 응답 없음). 보안 위협으로 DHCP Starvation(위조 MAC으로 대량 요청해 IP 풀 고갈)이 함께 출제됩니다." },
"nw-sctp": { image: "/concept/book/nw-sctp.png", easy: "TCP의 신뢰성과 UDP의 메시지 지향성을 합친 전송 계층 프로토콜입니다. 두 가지 무기가 시험 핵심: Multi-homing — 한 세션이 여러 IP 주소를 동시에 보유해, 쓰던 경로가 끊겨도 다른 경로로 세션을 유지합니다(TCP는 IP 하나가 끊기면 연결도 끊김). Multi-streaming — 한 세션 안에 여러 스트림을 두어 한 스트림이 막혀도 다른 스트림은 진행합니다(HOL 블로킹 완화). 핸드셰이크가 TCP와 반대인 것도 포인트: 수립은 4-way(INIT → INIT-ACK → COOKIE-ECHO → COOKIE-ACK, 쿠키로 SYN 플러딩 방어), 종료는 3-way(SHUTDOWN → SHUTDOWN-ACK → SHUTDOWN-CMPL, Half-open Closing 해결). 전송 중에는 SACK로 선택적 확인, HEARTBEAT로 경로 생존을 감시합니다." },
"nw-cran": { image: "/concept/book/nw-cran.png", easy: "기존 기지국은 디지털 처리부(DU)와 무선 송수신부(RF/RU)가 한 몸이었는데, 이를 분리해 DU만 중앙 데이터센터에 모으고 RU는 서비스 지역에 분산시킨 구조입니다. 중앙과 분산 장비를 잇는 구간을 프론트홀이라 부릅니다. 장점: DU가 한곳에 모여 있어 셀 간 간섭 조정이 쉽고 협력 통신 같은 고품질 서비스가 가능하며, 장비·전력 비용도 절감됩니다. 구성: RU(디지털 신호를 RF로 변환해 안테나로 송수신) + Centralized DU(클라우드 형태로 집중된 디지털 처리부). 인터페이스 규격 3종이 시험 포인트: CPRI(DU-RU 간 표준, 사실상 업계 주류), OBSAI(모듈 단위로 나눈 개방형 경쟁 규격), ORI(CPRI의 벤더 간 호환성 한계를 개선하려는 ETSI 주도 표준)." },
"nw-hamming": { image: "/concept/book/nw-hamming.png", easy: "패리티 비트를 여러 개 심어서 오류를 '검출'만 하는 게 아니라 '몇 번째 비트가 틀렸는지'까지 찾아 고치는 코드입니다. 절차: ① 패리티 개수 결정 — 2^p ≥ d+p+1 (데이터 4비트면 패리티 3개, 7비트면 4개) ② 위치 결정 — 1, 2, 4, 8번째(2의 거듭제곱 자리)에 삽입 ③ 값 결정 — P1은 1·3·5·7·9·11번 비트를, P2는 2·3·6·7·10·11번을, P4는 4~7번을, P8은 8~11번을 검사해 각각 짝수 패리티가 되게 함 ④ 전송 ⑤ 수신 측에서 P1~P8을 다시 검사. 검사 결과가 전부 0이면 정상이고, 0이 아니면 그 값을 P8P4P2P1 순으로 읽어 2진수로 보면 그게 바로 오류가 난 비트 위치입니다(예: 0011 → 3번째 비트를 뒤집으면 복구)." },
"nw-crc": { image: "/concept/book/nw-crc.png", easy: "데이터를 하나의 큰 이진수로 보고 약속된 다항식(Divisor)으로 나눈 나머지를 뒤에 붙여 보내는 오류 검출 기법입니다. 수신 측은 받은 전체를 같은 다항식으로 나눠 나머지가 0이면 정상, 0이 아니면 오류로 보고 재전송을 요청합니다. 절차: Encoding(데이터 뒤에 n개의 0을 붙여 (n+1)비트 Divisor로 나눠 CRC 생성 → 데이터+CRC = 코드 워드) → Transmission → Decoding(같은 Divisor로 나눠 나머지 확인). 교재 예제: 데이터 1011010, 다항식 CRC-8 = X⁸+X²+X+1(100000111) → XOR 나눗셈 결과 나머지 10000001 → 전송 데이터 101101010000001. 강점은 여러 비트가 한꺼번에 깨지는 집단 오류(Burst Error)도 잡아낸다는 점이라 이더넷·Wi-Fi에서 표준으로 씁니다." },
"nw-qos": { image: "/concept/book/nw-qos.png", easy: "한정된 대역폭을 트래픽 종류에 따라 차등 배분해서, 영상통화 같은 중요한 트래픽이 파일 다운로드에 밀리지 않게 하는 기술입니다. 주요 지표 [대지터패] — 대역폭(최대 처리 능력), 지연(전달까지 걸리는 시간), 지터(도착 간격이 들쭉날쭉한 정도), 패킷 손실. 관리 기술: 트래픽 쉐이핑(Leaky Bucket — 버킷에 담아 일정 속도로 흘려보냄 / Token Bucket — 토큰이 있어야 전송), 혼잡제어(RED — 혼잡 전에 미리 랜덤 폐기 / WRED — 클래스별 가중치 적용), 큐잉(FIFO / Priority Queuing / WFQ). 보장 기술 2가지가 시험 핵심: IntServ(RSVP로 흐름별 자원을 미리 예약 — 정확하지만 확장성 낮음)와 DiffServ(패킷 DS 필드에 DSCP를 마킹해 홉마다 등급대로 처리 — 확장성이 좋아 실무 표준)." },
"nw-arp": { image: "/concept/book/nw-arp.png", easy: "IP 주소는 아는데 상대의 MAC 주소를 모를 때, 같은 LAN 안에서 \"이 IP 쓰는 사람 MAC 주소 알려줘\"라고 물어 알아내는 프로토콜입니다. 동작이 비대칭인 게 시험 포인트: 요청은 브로드캐스트 — 호스트 A가 Destination MAC을 FF:FF:FF:FF:FF:FF로 채운 ARP Request를 네트워크 전체에 뿌립니다. 응답은 유니캐스트 — 자기 IP임을 확인한 호스트 D만 ARP Reply를 A에게 1:1로 보냅니다. A는 받은 MAC을 자신의 ARP Cache 테이블에 저장해 두고 이후 통신에 씁니다(그래서 매번 묻지 않음). 반대 방향, 즉 MAC은 아는데 IP를 모를 때 쓰는 것이 RARP입니다." },
"nw-dns": { image: "/concept/book/nw-dns.png", easy: "사람이 외우는 이름(www.test.com)을 컴퓨터가 쓰는 IP 주소로 바꿔주는 인터넷 전화번호부입니다. 질의 두 종류가 시험 핵심입니다: Recursive Query(재귀) — 클라이언트가 로컬 DNS 서버에게 \"답을 찾아서 갖다 줘\"라고 위임하는 방식 / Iterative Query(반복) — 로컬 DNS 서버가 Root → TLD(.com) → Authoritative(ns.test.com) 순으로 \"다음엔 저기 물어봐\"를 안내받아 직접 찾아가는 방식. 전체 흐름 9단계: 클라이언트 질의 → 로컬 DNS가 Root에 질의 → .com 서버 IP 받음 → TLD에 질의 → test.com DNS 정보 받음 → ns.test.com에 질의 → www의 IP 받음 → 클라이언트에 전달 → 접속. 기능: Name Resolution, Host Aliasing(별칭), Mail Server Aliasing, Load Distribution(한 URL에 여러 IP를 두어 부하 분산)." },
"nw-routing": { image: "/concept/book/nw-routing.png", easy: "패킷을 목적지까지 어느 길로 보낼지 정하는 라우팅 테이블을 만들고 유지하는 프로토콜입니다. 두 방식의 대비가 핵심입니다. 거리벡터(Distance Vector): 이웃 라우터가 주기적으로 알려주는 정보만 믿고, 홉 수(Hop count)가 가장 적은 길을 고릅니다 — 벨만-포드 알고리즘, RIP·IGRP. 이웃에게 받은 테이블에 자기까지의 거리를 더해 기존 값과 비교하고, 더 작으면 갱신하는 식입니다(소문으로 길 찾기). 링크상태(Link State): 각 라우터가 이웃의 링크 상태를 수집(LSA)해 전체 토폴로지 데이터베이스, 즉 '지도'를 만들고, SPF(다익스트라)로 최소 비용 경로를 직접 계산합니다 — OSPF·EIGRP. 계산 결과로 SPF 트리를 만들고 그것으로 라우팅 테이블을 생성합니다(지도 보고 길 찾기)." },
"nw-fec-bec": { image: "/concept/book/nw-fec-bec.png", easy: "전송 중 생긴 오류를 어떻게 처리하느냐로 갈리는 두 방식입니다. FEC(전진 오류 정정): 보낼 때 미리 잉여비트를 넣어두어 수신 측이 재전송 요청 없이 스스로 고칩니다 — 되돌아갈 시간이 없는 실시간 방송·위성 통신에 유리. 기법은 블록 코드(해밍 코드 — 패리티 비트로 오류 위치까지 찾아 정정 / RS 코드 — 랜덤·연집 오류까지 정정)와 논블록 코드(길쌈 코드 — 과거 신호까지 활용하는 메모리 부호화 / 터보 코드)로 나뉩니다. BEC(후진 오류 정정): 오류를 검출만 하고 송신 측에 알려 다시 보내게 합니다 — 검출은 Parity Check·Block Sum·CRC·Check Sum, 재전송(ARQ)은 Stop and Wait(하나 보내고 응답 대기), Go-Back-N(오류 프레임부터 전부 다시), Selective-Repeat(오류 프레임만), Adaptive ARQ(블록 길이를 동적 조절)." },
"nw-tcp-congestion": { image: "/concept/book/nw-tcp-congestion.png", easy: "네트워크가 감당할 수 있는 양보다 많은 트래픽이 몰리지 않게 송신 속도를 조절하는 메커니즘입니다. 4단계로 움직입니다: ① Slow Start — 처음엔 조심스럽게 시작해 전송할 때마다 윈도우(CWND)를 2배씩 지수 증가 ② Congestion Avoidance — 임계치(ssthresh)에 도달하면 급증을 멈추고 1씩 선형 증가 ③ Fast Retransmit — 손실이 감지되면 타임아웃을 기다리지 않고 즉시 재전송 ④ Fast Recovery — 재전송 후 처음부터 시작하지 않고 윈도우 절반에서 다시 선형 증가. 알고리즘 계보가 시험 포인트: Tahoe(손실 시 Slow Start부터 재시작) → Reno(Fast Recovery 도입, 절반에서 재개) → New Reno(Partial ACK로 한 윈도우에 여러 패킷이 손실돼도 RTO 대기 없이 복구)." },
"nw-tcp-udp": { image: "/concept/book/nw-tcp-udp.png", easy: "TCP는 전화(먼저 연결하고 확인하며 대화), UDP는 우편엽서(그냥 보내고 도착 여부는 모름)입니다. TCP: 연결지향, 순서 유지, 중복·손실 없음, 에러 시 재전송, 슬라이딩 윈도우로 흐름제어, 헤더 20바이트, HTTP·FTP·SMTP에 사용 — 느리지만 신뢰성. UDP: 비연결, 순서 유지 안 함, 손실 가능, 재전송 없음, 흐름제어 없음, 헤더 8바이트, DNS·SNMP·RIP에 사용 — 빠르지만 비신뢰성(실시간 스트리밍·게임에 적합). TCP 제어 플래그 6개도 단골입니다: URG(긴급 우선 송신), ACK(확인응답번호 유효), PSH(버퍼 대기 없이 즉시 전달), RST(강제 연결 리셋), SYN(연결설정 순서번호 동기화), FIN(전송 종료)." },
"nw-ipv4-ipv6-tunneling": { image: "/concept/book/nw-ipv4-ipv6-tunneling.png", easy: "IPv4에서 IPv6로 한 번에 갈아탈 수 없으니, 두 체계가 공존하며 연동하는 전환 기술 3가지입니다. 듀얼 스택: 한 장비에 IPv4와 IPv6 기능을 모두 설치해 상대에 맞춰 골라 씀 — 가장 확실하지만 프로토콜 스택 수정 비용이 큼. 터널링: IPv6 패킷을 IPv4 패킷 속에 통째로 캡슐화해서 중간의 IPv4망을 '터널'처럼 통과시킴 — IPv6망 사이에 IPv4 구간이 끼어 있을 때 사용(IPv6 Over IPv4 Tunnel). 주소 변환(G/W 방식): 중간에 주소변환기를 두어 IPv4망과 IPv6망을 상호 연동 — 호스트 수정이 불필요하고 구현이 쉬움. 변환 방식은 헤더변환, 수송계층 릴레이, 응용계층 게이트웨이(ALG) 셋입니다." },
"nw-csma-ca": { image: "/concept/book/nw-csma-cd.png", easy: "무선 LAN(Wi-Fi)의 매체 접근 방식입니다. 유선(CSMA/CD)은 부딪히면 알아채고 다시 보내지만, 무선은 자기 송신 신호가 너무 커서 충돌을 감지할 수 없습니다 — 그래서 아예 안 부딪히게 예방(Avoidance)합니다. 기법: IFS(채널이 비어도 곧바로 안 보내고 일정 시간 대기 — 우선순위 부여) → Back-off(추가로 임의 시간 대기해 동시 전송 확률↓) → RTS/CTS(송신 요청과 수신 준비 완료를 주고받아 채널 예약 — 서로 안 보이는 단말끼리 부딪히는 히든 노드 문제 해결) → NAV(그 대화를 엿들은 다른 단말은 그동안 자제) → ACK(충돌 감지가 불가하니 수신 확인으로 성공 여부 판단, 없으면 재전송). 한 줄: CD=부딪히면 감지, CA=예약하고 확인받기." },
"nw-multiplexing": { image: "/concept/book/nw-multiplexing.png", easy: "하나의 전송로를 여러 채널로 쪼개 여러 신호를 동시에 보내는 기술 — 회선 하나를 여럿이 나눠 쓰는 것입니다. 종류가 시험 핵심: FDM(주파수 분할 — 넓은 대역폭을 주파수로 나눔, 라디오 채널), TDM(시간 분할 — 한 회선을 타임슬롯으로 나눠 번갈아 사용), CDM(코드 분할 — 서로 직교하는 코드를 부여해 확산 대역으로 동시 전송), WDM(파장 분할 — 파장이 다른 광 신호를 광섬유 한 가닥에), SDM(공간 분할 — 물리적으로 분리된 여러 채널을 하나처럼). 다원접속(Multiple Access)과의 비교도 나옵니다: 다중화는 한 지점에서 모아 보내는 하향(Down-link, FDM·TDM), 다원접속은 여러 단말이 각자 보내는 상향(Up-link, FDMA·TDMA·CDMA)." },
"nw-service-primitive": { image: "/concept/book/nw-service-primitive.png", easy: "계층 구조에서 위아래 계층이 서로 서비스를 주고받을 때 쓰는 표준 대화 형식입니다. 4종류를 흐름으로 외우세요: ① Request(요청) — 송신측 상위계층이 하위계층에 전송·연결설정을 요구(아래로) → ② Indication(지시) — 수신측 하위계층이 상위계층에 도착을 알림(위로) → ③ Response(응답) — 수신측 상위계층이 처리 결과를 하위로 전달 → ④ Confirm(확인) — 송신측 하위계층이 상위계층에 응답이 왔음을 알림. 표기법도 시험에 나옵니다: T.CONNECT.request(called address, calling address, …, user data) — T는 서비스 제공 계층(Transport), CONNECT는 동작 이름, request는 방향, 괄호 안은 파라미터입니다." },
"nw-osi-7layer": { image: "/concept/book/nw-osi-7layer.png", easy: "ISO가 만든 네트워크 표준 7계층 모델 — 두음 [아파서티내다]로 위에서부터 외웁니다. 7 Application(사용자가 네트워크에 접근: HTTP·SMTP·FTP) → 6 Presentation(표현 형태 변환·번역: JPEG·MPEG) → 5 Session(세션 구성·동기화: TLS·SSH) → 4 Transport(발신지-목적지 제어·에러 관리, 재전송으로 신뢰성 보장: TCP·UDP) → 3 Network(패킷을 목적지까지 전달: IP·ICMP·라우팅) → 2 Data Link(오류 없이 프레임 전달, MAC 주소 기반: Ethernet·PPP) → 1 Physical(비트 흐름 전송: RS-232C·광섬유). 함께 외울 것: 데이터 단위(Transport=세그먼트, Network=패킷, Data Link=프레임, Physical=비트)와 장비(Router 3계층, Bridge 2계층, Repeater 1계층). 송신은 헤더를 붙이며 내려가고(캡슐화) 수신은 벗기며 올라갑니다." },
"nw-http3": { image: "/concept/book/nw-http3.png", easy: "구글이 만든 QUIC 위에서 도는 차세대 HTTP입니다. 기존 HTTP/2가 TCP+TLS 위에 있었다면, HTTP/3은 UDP 위에 QUIC(TLS 1.3 + TCP식 혼잡제어·손실복구)을 얹었습니다 — TCP의 느린 연결 설정을 버리고 속도를 얻은 것입니다. 핵심 특징: 0-RTT/1-RTT 연결(이전 연결의 캐시된 자격 증명으로 악수 생략), HOL 블로킹 해결(다중 스트림 — 앞 패킷이 막혀도 뒤 스트림은 진행), Seamless Connection(Connection ID로 Wi-Fi↔LTE 전환에도 연결 유지), SACK(선택적 재전송). HOL(Head Of Line) 블로킹이 시험 포인트: 대기열 맨 앞 패킷이 처리되지 않으면 뒤 패킷이 전부 대기하는 문제로, HTTP/1.1·2의 고질병이었습니다." },
"nw-tcp-handshake": { image: "/concept/book/nw-tcp-handshake.png", easy: "TCP가 연결을 맺고 끊는 절차입니다. 수립은 3단계(3-way): ① 클라이언트가 SYN(초기순서번호 a) 전송 → ② 서버가 SYN(b) + ACK(a+1)로 응답 → ③ 클라이언트가 ACK(b+1) 전송 → 양쪽 ESTABLISHED. 종료는 4단계(4-way): ① 클라이언트 FIN(FIN_WAIT_1) → ② 서버 ACK(CLOSE_WAIT) → ③ 서버가 남은 작업을 마치고 FIN(LAST_ACK) → ④ 클라이언트 ACK 후 TIME_WAIT를 거쳐 CLOSED. 시험 단골 질문 두 가지: 종료가 왜 4단계인가 — 서버가 FIN을 받아도 아직 보낼 데이터가 남을 수 있어 ACK와 FIN을 나눠 보내기 때문(Half-Close). TIME_WAIT는 왜 있나 — 마지막 ACK가 유실될 경우를 대비해 일정 시간 기다렸다 완전히 닫기 위해서입니다." },
"nw-csma-cd": { image: "/concept/book/nw-csma-cd.png", easy: "여러 호스트가 하나의 회선을 나눠 쓸 때, 보내기 전에 먼저 '지금 누가 쓰나' 엿듣고(Carrier Sense) 충돌을 줄이는 유선 LAN(이더넷) 프로토콜입니다. 동작: 송신준비 → 채널 감시 → 비어 있으면 전송하며 계속 감시 → 충돌이 감지되면 Jam 신호를 보내 모두에게 알리고, Back-off 방식(임의 시간 대기)에 따라 기다렸다 재시도. 채널이 이미 Busy면 계속 재탐색합니다. 회선을 엿듣는 방식 3가지가 시험 포인트 — 1-Persistent(비면 즉시 전송, 확률 1 — 충돌 위험 큼), Non-Persistent(사용 중이면 임의 시간 기다렸다 다시 감시 — 충돌은 적지만 지연), P-Persistent(확률 p로 전송 여부 결정 — 앞 둘의 절충). 무선에서는 충돌 감지가 어려워 CSMA/CA를 씁니다." },
// ─────────────── 4주차: 알고리즘(AL) — 교재 슬라이드 + 쉬운 설명 ───────────────
"al-perf-eval": { image: "/concept/book/al-perf-eval.png", easy: "알고리즘이 얼마나 좋은지를 '시간'과 '공간'이라는 두 자로 재는 프로세스입니다. 평가 유형 3가지 — 성능분석(직접 구현하지 않고 연산 횟수로 비교, n의 함수로 표현), 성능측정(실제 구현물을 같은 하드웨어에서 돌려 수행시간 측정), 효율성 평가(시간 복잡도=단위 연산을 몇 번 하는지 / 공간 복잡도=필요한 메모리 양 — 고정 공간+가변 공간). 보통 시간이 적게 들면 공간을 많이 쓰고, 공간을 아끼면 시간이 오래 걸립니다(트레이드오프). 점근적 표기법 3형제가 시험 핵심: O(빅오, 상한선 — 최악일 때), Ω(오메가, 하한선 — 최상일 때), Θ(세타, 상한과 하한의 교집합). 실무·시험 모두 최악을 보는 O를 씁니다." },
"al-big-o": { image: "/concept/book/al-big-o.png", easy: "데이터 수 N이 늘어날 때 수행시간이 어떤 함수로 커지는지를 간단히 표현하는 상한 점근 표기법입니다. 유형과 사례를 짝으로 외우세요 — O(1) 상수형(입력 크기와 무관하게 바로 답: 해시 함수), O(log N) 로그형(반씩 나눠 하나만 처리: 이진탐색), O(N) 선형(하나씩 모두 처리: 단순탐색), O(N log N) 분할·합병형(퀵 정렬), O(N²) 제곱형(2중 loop: 버블 정렬), O(N³) 세제곱형(3중 loop: 최단 경로), O(2ⁿ) 지수형(모든 경우 검사). 연산시간 순서가 그대로 시험에 나옵니다: O(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(N³) < O(2ⁿ) < O(N!)." },
"al-quick-sort": { image: "/concept/book/al-quick-sort.png", easy: "기준값(Pivot)을 하나 정해 그보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 몰아넣고, 나뉜 각 덩어리에 같은 일을 재귀로 반복하는 분할 정복 정렬입니다. 절차: Low는 왼쪽부터 Pivot보다 큰 값을 찾고, High는 오른쪽부터 Pivot보다 작은 값을 찾아 서로 교환 → 반복하다 두 지점이 교차하면 Pivot과 High를 교환 → 이제 Pivot 왼쪽은 전부 작고 오른쪽은 전부 큰 상태 → 양쪽에서 다시 Pivot을 잡고 재귀. 시간복잡도가 시험 포인트: 평균 O(n log n)으로 가장 빠른 축이지만, Pivot이 계속 한쪽 끝에 걸리면 최악 O(n²)로 나빠집니다." },
"al-insertion-sort": { image: "/concept/book/al-insertion-sort.png", easy: "손에 쥔 카드를 정리하듯, 앞쪽의 '이미 정렬된 부분'과 비교해 자기 자리를 찾아 끼워 넣는 정렬입니다. 동작: 첫 원소는 정렬된 것으로 취급 → 다음 원소가 들어갈 위치를 앞에서 검색 → 그 위치 이후 값들을 오른쪽으로 Shift → 빈자리에 삽입. 교재 예제(31, 25, 12, 22, 11)를 따라가면 매 단계 앞쪽 정렬 구간이 하나씩 늘어납니다. 특징: 거의 정렬된 데이터에서는 매우 빠르지만(최선 O(n)), 일반적으로는 O(n²)라 대량 데이터에는 부적합합니다." },
"al-bubble-sort": { image: "/concept/book/al-bubble-sort.png", easy: "이웃한 두 값을 비교해 앞이 더 크면 자리를 바꾸는 일을 끝까지 반복하는, 가장 단순한 정렬입니다. 교재 예제(7, 5, 8, 3, 9)를 보면 1회전에서 A(1)-A(2), A(2)-A(3), A(3)-A(4)를 차례로 비교·교환해 가장 큰 9가 거품처럼 맨 뒤로 확정됩니다. 2회전에는 이미 확정된 뒤쪽을 빼고 A(1)~A(3)만 비교하고, 이렇게 정렬 완료 구간이 뒤에서 앞으로 자라며 n−1회전 반복합니다. 구현이 가장 쉬운 대신 비교·교환이 매번 일어나 최선·평균·최악 모두 O(n²)이고, 교재 빅오 슬라이드에서 O(N²) 제곱형(2중 loop)의 대표 사례로 등장합니다." },
"al-merge-sort": { image: "/concept/book/al-merge-sort.png", easy: "리스트를 반으로 계속 쪼개 원소 1개가 될 때까지 분할한 뒤, 두 개씩 순서에 맞춰 합치며(병합) 올라오는 분할 정복 정렬입니다. 절차: ① 데이터를 반으로 나눔 ② 하위 집합 크기가 2 이상이면 ①을 반복 ③ 같은 집합에서 나온 하위 집합 둘을 순서에 맞춰 병합 ④ 하나가 될 때까지 ③ 반복. 퀵 정렬과의 비교가 시험 포인트: 퀵은 평균 O(n log n)이지만 최악 O(n²)인 반면, 병합 정렬은 최악에도 O(n log n)이 보장되고 같은 값의 순서가 유지되는 안정 정렬입니다(대신 추가 메모리 필요)." },
"al-hash-table": { image: "/concept/book/al-hash-table.png", easy: "키(key)를 인덱스처럼 써서 자료에 곧바로 접근하는 배열 구조 — 순서대로 찾지 않고 계산해서 바로 가기 때문에 평균 O(1)입니다. 흐름: Key → 해시함수 → 주소값 → 해시 테이블의 그 자리. 용어가 시험 핵심 — 해시 함수(키를 물리 주소로 사상하는 단방향 함수), 해시 키(계산에 쓰는 키 값), 버킷(하나의 주소를 갖는 구역), 슬롯(레코드 1개 저장 공간, n개가 모여 버킷), 동거자 Synonym(같은 주소로 변환된 모든 레코드), 충돌 Collision(서로 다른 레코드가 같은 주소로), 오버플로우(버킷이 가득 참). 파이썬 dict·자바 HashMap이 전부 이것입니다." },
"al-hashing-collision": { image: "/concept/book/al-hashing-collision.png", easy: "해싱은 키에 해시함수를 적용해 주소를 계산하고 그 위치로 직접 가는 탐색 방법인데, 서로 다른 키가 같은 주소로 가는 충돌이 필연적으로 생깁니다. 해싱 기법 [나폴리는 중세기다] — 나눗셈법(키를 테이블 크기로 나눈 나머지), 폴딩법(키를 같은 길이로 쪼개 더하거나 XOR), 중간 제곱법(제곱한 뒤 중간 비트 사용), 기수 변환법(10진→7진 등 진법 변환), 자릿수 분석법(고른 분포의 자릿수 선택), 무작위 방법(난수 발생). 충돌 해결 [선이중무 체코] — 개방 주소법: 선형 조사(다음 칸으로), 이차 조사(제곱 간격), 이중 해싱(제2 해시 함수), 재해싱(새 해시 함수로 전체 재배치) / 폐쇄 주소법: 해시 체이닝(연결 리스트로 매달기), 병합 체이닝(빈 슬롯에 넣고 포인터 연결)." },
"al-dynamic-programming": { image: "/concept/book/al-dynamic-programming.png", easy: "큰 문제를 작은 문제로 쪼개 풀되, 한 번 푼 부분 문제의 답을 저장(Memoization)해 두고 재사용하는 최적화 기법입니다. 같은 계산을 반복하지 않는 것이 핵심 — 피보나치를 단순 재귀로 풀면 같은 값을 수없이 다시 계산하지만 DP는 한 번만 계산합니다. 전제 조건: 최적성 원리를 만족해 점화/재귀 관계식 a(n+1)=f(a(n))을 도출할 수 있어야 합니다. 동작: ① 점화식 도출·부분 문제 분할 → ② Memoization으로 부분 해를 테이블에 저장 → ③ Bottom-Up으로 저장된 해를 활용해 최종 최적해 도출. 접근방법 2가지: Top Down(재귀+메모이제이션)과 Bottom Up(반복문+타뷸레이션)." },
"al-greedy": { image: "/concept/book/al-greedy.png", easy: "매 순간 눈앞에서 가장 좋아 보이는 것을 고르고 뒤돌아보지 않는 알고리즘입니다. 거스름돈 770원을 최소 동전으로 주려면 매번 가장 큰 동전부터 고르는 식이죠. 절차 [해적검] — 해 선택(부분해에 더할 다음 항목 선택) → 적합성 검증(제약조건 위반 여부 검사, 위반이면 다시 선택) → 해 검증(문제의 해인지 확인, 아니면 반복). 가장 중요한 시험 포인트는 '항상 최적해가 나오지는 않는다'는 것: 거스름돈 800원에 400원 동전이 새로 생기면, 그리디는 500원 1개+100원 3개(4개)를 고르지만 실제 최적은 400원 2개입니다. 그래서 최적성이 보장되는 문제(MST, 허프만)에만 안전하게 씁니다." },
"al-beam-search": { image: "/concept/book/al-beam-search.png", easy: "매 단계에서 최선 하나만 고르는 그리디는 나중에 더 좋은 길이 있어도 놓칩니다. 빔 탐색은 하나로 확정하지 않고 확률이 높은 K개(Beam Size)를 손에 쥔 채 함께 뻗어나가는 절충안입니다. 절차: ① 문제·제약 정의 → ② 확률 높은 최초 K개 해 선택 → ③ 각 후보를 확장하며 확률 Score 계산 → ④ 그중 상위 K개만 남기고 나머지는 삭제, 시퀀스가 끝날 때까지 ③④ 반복 → ⑤ 최종 후보 중 확률이 가장 높은 해 선택. 교재 예제(Beam size=2): \"I am cat\"(1.0)과 \"the dog barked\"(0.9)를 끝까지 함께 끌고 가서 최종 1.0짜리를 고릅니다. K=1이면 그리디와 같고 K가 무한이면 완전 탐색 — 챗봇·번역기의 Seq2Seq 디코딩에 쓰입니다." },
"al-graph-traversal": { image: "/concept/book/al-graph-traversal.png", easy: "그래프의 모든 정점을 한 번씩 방문하는 두 가지 방법입니다. BFS(너비 우선, 횡방향): 현재 정점과 연결된 이웃을 전부 먼저 훑고 다음 층으로 내려갑니다 — 큐(Queue)로 구현하며, 옆으로 넓은 그래프에 강하고 아래로 깊으면 오래 걸립니다. DFS(깊이 우선, 종방향): 한 갈래를 골라 갈 수 있는 데까지 끝까지 파고든 뒤, 막히면 되돌아옵니다(백트래킹) — 스택(Stack)으로 구현하며, 아래로 깊은 그래프에 강하고 옆으로 넓으면 오래 걸립니다. 외우는 요령: 너비=큐, 깊이=스택. 활용도 갈립니다 — BFS는 가중치 없는 그래프의 최단 경로·친구 추천에, DFS는 미로 탐색·위상 정렬·사이클 검출에 씁니다." },
"al-tf-idf": { image: "/concept/book/al-tf-idf.png", easy: "여러 문서 중에서 '이 단어가 이 문서에서 얼마나 중요한가'를 숫자로 매기는 가중치입니다. 두 값을 곱해서 구합니다 — TF(단어빈도: 이 문서에 몇 번 나왔나, 많을수록 중요)와 IDF(역문서빈도: 다른 문서에도 흔한가, 흔할수록 값이 작아짐). 핵심 직관: '이/그/은/는' 같은 단어는 모든 문서에 나오니 IDF가 0이 되어 중요도에서 탈락하고, 특정 문서에만 자주 나오는 단어가 높은 점수를 받습니다. 절차: DTM(문서-단어 행렬) 작성 → TF 계산 → 불용어 처리(조사·시제 제거) → IDF 산출 → TF×IDF. 교재 예제에서 this·is는 두 문서에 다 있어 log(2/2)=0으로 0점, a는 문서1에만 있어 0.6점을 받습니다. 검색 엔진 랭킹과 텍스트 마이닝의 기본 도구입니다." },
"al-mst": { image: "/concept/book/al-mst.png", easy: "모든 정점을 빠짐없이 연결하되 간선 가중치의 합이 최소가 되는 트리 — 여러 도시를 최소 비용으로 잇는 도로망 설계 문제입니다. 두 알고리즘이 시험 단골입니다. 프림(Prim)은 '정점 중심': 시작 정점 하나에서 출발해, 지금까지 만든 트리에 인접한 간선 중 가장 싼 것을 계속 붙여 나가며 간선이 n−1개가 되면 종료합니다(눈덩이를 굴리듯 자라남). 크루스칼(Kruskal)은 '간선 중심': 전체 간선을 가중치 오름차순으로 정렬해 두고, 싼 것부터 차례로 고르되 사이클이 생기면 그 간선은 건너뜁니다(교재 예: BG 2 → EG 3 → CD 4 → AF 5 → FG 7 → DE 8 순으로 선택). 둘 다 그리디 알고리즘이며 결과는 같은 최소 비용입니다." },
"al-tree-traversal": { image: "/concept/book/al-tree-traversal.png", easy: "트리의 모든 노드를 한 번씩 빠짐없이 방문하는 방법입니다. 이름의 '전·중·후'는 Root를 언제 방문하느냐를 말합니다 — 전위(Pre-Order): Root → Left → Right / 중위(In-Order): Left → Root → Right / 후위(Post-Order): Left → Right → Root. 재귀 코드는 세 줄의 순서만 바뀝니다(Visit·왼쪽·오른쪽 호출 순서). 활용이 시험 포인트: 이진 탐색 트리를 중위 순회하면 값이 정렬된 순서대로 나오고, 수식 트리에 적용하면 전위 순회는 전위 표기(prefix), 중위는 중위 표기(infix), 후위는 후위 표기(postfix)가 됩니다. 후위 순회는 자식을 다 처리한 뒤 부모를 처리하므로 디렉터리 용량 계산·소멸자 호출에 쓰입니다." },
"al-dijkstra": { image: "/concept/book/al-dijkstra.png", easy: "출발지 하나에서 모든 정점까지의 최단 경로를 구하는 알고리즘 — 내비게이션 경로 탐색의 원리입니다. 두 개의 집합으로 관리합니다: S(이미 최단거리가 확정된 방문 노드)와 Q(아직 안 간 노드). 절차: ① 출발지 거리는 0, 나머지는 무한대(∞)로 초기화 → ② Q에서 거리가 가장 짧은 노드를 골라 S로 옮김 → ③ 그 노드의 이웃들까지의 거리를 재서, 기존보다 짧으면 갱신(Relaxation) → ④ Q가 빌 때까지 반복. 교재 예제에서 d[C]가 30→20으로, d[F]가 35→25로 갱신되는 부분이 핵심이고, 최종 답은 A→D→C→F, 거리 25입니다. 시험 포인트: 음수 가중치가 있으면 쓸 수 없고(그때는 벨만-포드), 매 단계 가장 짧은 것을 고르는 그리디 방식입니다." },
"al-run-length": { image: "/concept/book/al-run-length.png", easy: "같은 값이 연속으로 나오는 구간을 '값 + 반복 횟수'로 줄여 쓰는 무손실 압축입니다 — Run은 반복되는 문자, Length는 반복 횟수. 예제 1: AAAABBBBBCCCCCCCCCDEEEE(22byte) → 4A5B8C1D5E(10byte)로 LENGTH·RUN 순서로 나열합니다. 주의할 점이 시험 포인트 — 값이 자주 바뀌는 데이터에서는 오히려 압축률이 떨어집니다(ABAB… 같은 경우 길이가 늘어남). 그래서 예제 2처럼 유일한 자료 구간(ABC)은 그대로 두고 반복 구간에만 적용(ABC*8D*9E)하는 방식을 씁니다. 팩스, BMP, 단순한 아이콘 이미지처럼 같은 색이 길게 이어지는 데이터에 효과적입니다." },
"al-huffman": { image: "/concept/book/al-huffman.png", easy: "자주 나오는 문자에는 짧은 부호를, 드물게 나오는 문자에는 긴 부호를 주어 전체 길이를 줄이는 무손실 압축 기법입니다. 동작: ① 문자별 빈도수를 내림차순 정렬 → ② 빈도가 가장 낮은 두 문자를 연결하고, 그 묶음을 다음으로 낮은 것과 연결하는 식으로 모든 문자가 이어질 때까지 반복(Binary Fusion) → ③ 각 쌍에 0과 1을 배정(높은 쪽에 0) → ④ 각 문자에 코드 할당. 교재 예제: AAAAABABCCCDBBBCDA에서 A(7/18)→0, B(5/18)→10, C(4/18)→110, D(2/18)→111로 할당하면 18Byte가 35bit로 줄어듭니다. 활용: DEFLATE(PKZIP), JPEG·MP3 코덱의 기본 알고리즘." },
// ─────────────── 4주차: 자료구조(DS) — 교재 슬라이드 + 쉬운 설명 ───────────────
"ds-linear-nonlinear": { image: "/concept/book/ds-linear-nonlinear.png", easy: "자료구조의 큰 지도입니다 — 데이터끼리 어떤 대응 구조로 저장되느냐로 갈립니다. 선형(1:1 대응, 한 줄): 구조가 간단하고 접근 속도가 빠릅니다 — Array(같은 크기 요소를 순차 나열), Linked List(노드=데이터+포인터를 한 줄로 연결), Stack(한쪽 끝에서만 삽입·삭제, 후입선출 LIFO — 설거지 그릇 쌓기), Queue(한쪽은 삽입·반대쪽은 삭제, 선입선출 FIFO — 은행 대기줄). 비선형(1:N, M:N 관계): 자료 간의 '관계'를 표현합니다 — Tree(나무 가지처럼 연결된 계층 구조, 순환 없는 연결 그래프)와 Graph(정점 V와 간선 E의 집합, G=(V,E)). 시험 답안 서두에 이 분류 지도를 그리면 강력합니다." },
"ds-linked-list": { image: "/concept/book/ds-linked-list.png", easy: "각 노드가 '데이터 + 다음 노드를 가리키는 포인터'를 갖고 한 줄로 이어진 자료구조 — 보물찾기처럼 각 쪽지가 다음 위치를 알려줍니다. 구성: Head(시작을 알리는 노드), Tail(끝을 알리는 노드), Node(데이터 저장소+포인터). 배열과 달리 중간 삽입·삭제가 포인터 수정만으로 끝나는 게 강점입니다 — 삽입: 노드1→노드2로 포인터 수정, 노드2→노드3 연결 / 삭제: 노드1이 노드3을 직접 가리키게 하고 노드2를 free. 유형 4가지가 시험 포인트: Singly(다음만 가리킴, 마지막은 Null), Double(이전/다음 모두, 양방향 순환), Singly Circular(마지막이 처음을 가리킴), Double Circular(처음·마지막이 서로 가리킴)." },
"ds-stack": { image: "/concept/book/ds-stack.png", easy: "나중에 넣은 것이 먼저 나오는 후입선출(LIFO) 자료구조 — 프링글스 통입니다. 삽입·삭제가 한쪽 끝(TOP)에서만 일어나고, 반대쪽(Bottom)에서는 아무 일도 없습니다. 연산: push(위에 추가), pop(맨 위 제거+반환), init(스택 포인터 0), isEmpty. 예외 2가지가 시험 단골 — Overflow(스택 포인터가 할당 메모리 끝을 넘어 꽉 참 → 더 못 넣음), Underflow(포인터 주소 0 = 삭제할 자료 없음). 실제 쓰임: 함수 호출 스택(브라우저 뒤로가기, 실행 취소 Ctrl+Z, 재귀 호출)이 전부 스택입니다." },
"ds-queue": { image: "/concept/book/ds-queue.png", easy: "먼저 들어온 데이터가 먼저 나가는 선입선출(FIFO) 자료구조 — 은행 번호표 줄입니다. 앞(Front)에서 빼고 뒤(Rear)로 넣습니다. 연산: Enqueue(후단 삽입), Dequeue(전단 삭제), isFull(배열만), isEmpty. 유형 [선순링덱]이 시험 핵심 — 선형 큐(배열을 한 줄로), 순환 큐/원형 큐(배열의 끝과 시작을 논리적으로 이어 빈자리를 재활용 — 선형 큐의 공간 낭비 해결), LinkedList 큐(연결 리스트로 구현, 크기 제한 없음), 덱(Deque: 전단·후단 모두에서 삽입·삭제 가능한 양방향 큐). 프린터 대기열·메시지 큐·OS 준비 큐가 전부 큐입니다." },
"ds-bst": { image: "/concept/book/ds-bst.png", easy: "이진탐색의 빠른 탐색력 + 연결리스트의 쉬운 삽입·삭제를 결합한 트리입니다. 규칙 4가지: ① 왼쪽 서브트리는 내 값보다 작은 값들 ② 오른쪽 서브트리는 큰 값들 ③ 중복 없음 ④ 모든 서브트리도 이진 탐색 트리. 탐색은 스무고개: 루트와 비교 → 작으면 왼쪽, 크면 오른쪽으로 재귀 — 한 번 비교할 때마다 후보가 절반으로 줄어듭니다(예: 10 찾기 — 루트 7과 비교 10>7이니 왼쪽(1,3,5) 통째로 제외 → 8과 비교 → 10 발견). 중위순회(in-order)하면 모든 값이 정렬된 순서로 나오는 것도 시험 포인트입니다." },
"ds-avl": { image: "/concept/book/ds-avl.png", easy: "이진 탐색 트리가 한쪽으로 기울면 사실상 연결 리스트가 되어 탐색이 느려집니다(O(N)). AVL 트리는 각 노드의 좌우 서브트리 높이 차이(Balance factor)를 절대값 1 이하로 강제해 균형을 지키는 BST입니다. 균형이 깨지면 회전으로 복구 — LL(왼쪽-왼쪽 치우침 → 오른쪽 한 번 회전), RR(오른쪽-오른쪽 → 왼쪽 한 번), LR(왼쪽-오른쪽 → LL 후 RR 두 번), RL(오른쪽-왼쪽 → RR 후 LL 두 번). 교재의 9→4→3→12→14→10 삽입 예제가 그대로 시험감입니다: 3 삽입 시 BF +2 → LL 회전, 14 삽입 시 −2 → RR 회전, 10 삽입 시 → RL 회전." },
"ds-heap": { image: "/concept/book/ds-heap.png", easy: "가장 큰(또는 작은) 키 값을 빠르게 찾도록 만든 완전 이진 트리입니다. 최대 힙(Max-Heap): 모든 부모가 자손보다 큰 값 → 루트가 항상 최대값이라 우선순위 큐(priority queue) 구현에 최적. 최소 힙(Min-Heap): 부모가 자손보다 작은 값 → 루트가 최소값. 삽입 원리(교재 Min-Heap 예): 완전 이진 트리 형태를 유지하며 끝에 붙인 뒤, 부모보다 작으면 계속 위로 치환(1 삽입 → 4와 치환 → 2와 치환 → 루트 도달). 응급실 환자 분류, OS 우선순위 스케줄링, 다익스트라 알고리즘이 힙을 씁니다." },
"ds-btree": { image: "/concept/book/ds-btree.png", easy: "자식을 2개보다 많이 가질 수 있는 이진 트리의 확장형 균형 트리 — 데이터베이스 인덱스와 파일시스템의 심장입니다. 구조: Root(최소 자식 2·값 1), Internal(차수 m이면 최대 m개 자식), Leaf(전부 같은 레벨). 특징: 리프·루트 제외 노드는 최소 m/2개 자료 보유, 최악의 경우가 없어 O(log N) 일정, 노드가 자식을 많이 가져 트리 높이가 낮음, 노드 내 자료는 정렬 상태. 삽입은 항상 잎에서: 가득 차면(Overflow) 중간 키를 부모로 올리고 둘로 분할. 삭제도 잎에서: 내부 노드 값이면 후행 키와 자리를 바꿔 잎으로 옮긴 후 삭제. 유형: B+ Tree(인덱스 세트+순차 세트 — DB 인덱스 표준), B* Tree(최소 2/3 채움)." },
"ds-dag": { image: "/concept/book/ds-dag.png", easy: "간선에 방향이 있고 순환이 없는 그래프 — 선수과목 이수 체계나 작업 의존 관계(빌드 순서, Airflow 파이프라인)를 표현하는 구조입니다. 핵심 알고리즘이 위상 정렬(Topological Ordering): 방향을 거스르지 않게 정점을 한 줄로 나열합니다. 절차: ① 정점별 진입차수(in-degree: 들어오는 간선 수) 표 작성 → ② 진입차수 0인 정점을 큐에 삽입하며 그 정점과 간선 제거 → ③ 새로 진입차수 0이 된 정점을 계속 큐에 삽입 → ④ 모든 정점 제거되면 완료. 교재 예제 결과: 4→1→6→2→3→5. DFS나 큐로 풀 수 있고, 순환이 있으면 위상 정렬이 불가능하다는 것도 시험 포인트입니다." },
"genai-data-quality-v2": { image: "/concept/book/genai-data-quality-v2.png", easy: "생성형AI를 위한 데이터 품질관리 방법·절차를 체계적으로 제시하는 가이드입니다. '학습용 데이터 품질관리 v3.1'이 일반 AI 학습데이터용이라면, 이쪽은 생성형AI(Instruction Data) 특화판 — 가공 데이터가 Caption(캡션)·Summary(요약)·Q&A(질의응답)·Dialogue(대화)·Translation(번역)·Radiology Report(판독문) 형태라는 점이 다릅니다. 데이터 구축 과정: 구축계획 수립 → 데이터 획득/수집(원시데이터) → 데이터 정제(원천데이터) → 데이터 가공(가공데이터) → 데이터 학습(학습 데이터셋) → 반복. 품질지표 4개: 구축 공정 적정성(준비성·완전성·유용성), 데이터 적합성(기준 적합성·다양성·유사성·편향성·유용성·안전성), 가공 데이터 정확성(구문·의미 정확성), 학습모델 적정성(알고리즘 적정성·유효성). 2025 KPC·ITPE 다수 기출." },
"mas": { image: "/concept/book/mas.png", easy: "여러 자율적 소프트웨어 에이전트가 상호작용하며 협력 또는 경쟁을 통해 복잡한 문제를 분산적으로 해결하는 분산 인공지능 시스템입니다. 개미 군집처럼 개별 에이전트는 단순하지만 모이면 복잡한 문제를 풉니다. 특성 6가지 [자분통 경전적] — 자율(중앙 통제 없이 독립 판단: GPT 기반 에이전트·RL 로봇), 분산(제어 권한 분산으로 특정 장애에도 전체 유지: Event-driven Architecture·Fault-Tolerant Agent Design), 통신(RPC/REST/Pub-Sub로 정보 교환·협상), 경쟁/협력(Multi-Agent Task Scheduler로 역할 분담), 전문화(Expert Agent — 서로 다른 역할·지식으로 상호보완), 적응성(RL로 환경 변화에 능동 대응). 유형: Independent(Discrete, Emergent Cooperation) vs Cooperative(Communicating — Deliberative·Negotiating / Non-communicating). A2A 프로토콜은 이 에이전트들이 조직 경계를 넘어 통신하기 위한 규약입니다. 2025.05 ITPE FR 기출." },
"llmops": { image: "/concept/book/llmops.png", easy: "MLOps의 LLM 특화판 — 대형 언어 모델의 설계부터 관리·배포·유지까지 통합하고 효율화하는 과정이자 패러다임입니다. 벤다이어그램이 핵심: LLMOps = 머신러닝 ∩ DevOps ∩ 데이터 엔지니어링. 단계별 구성요소: Data 수집·처리 → 기반모델 선정 → 임베딩 처리(벡터라이징·벡터 DB 저장) → 프롬프트 관리(프롬프트 엔지니어링·체이닝) → 테스트 → 버전 관리(CI/CD) → 모니터링(지연·안전성) → 최적화(파인튜닝·프롬프트 iteration). 구현 기술 예: Spark/Kafka(수집), GPT·LLAMA·Gemini(기반모델), Milvus/Weaviate(벡터 DB), Azure AI Studio(프롬프트), Jenkins X(CI/CD), Arize(모니터링)." },
"ai-watermark": { image: "/concept/book/ai-watermark.png", easy: "AI가 만든 이미지·영상·오디오·텍스트에 사람 눈에 안 보이는 워터마크를 심어 'AI 생성물'임을 식별하게 하는 기술입니다. 분류 3가지가 시험 핵심 — 공간 기반(이미지·동영상: 최하위 비트에 삽입, LSB), 변환 기반(주파수 도메인으로 변환해 삽입: DCT는 블록 단위 주파수 계수, DWT는 저주파 LL 제외한 중·고주파 서브밴드에 삽입, Edge Masking), 학습 기반(생성 모델 자체가 서명을 숨기도록 학습: Stable Signature, 텍스트는 로짓 생성·토큰 샘플링 워터마크). 오디오는 Audio Seal·WavMark·Spread Spectrum 등. AI 기본법의 생성물 표시 의무와 연결되는 실무 기술입니다. 2025.05 ITPE FR 기출." },
"genai-user-protection": { image: "/concept/book/genai-user-protection.png", easy: "생성형 AI 서비스의 잠재적 위험을 사전 방지하고 이용자 권익을 보호하기 위한 가이드라인입니다(방통위, 2025.02.28). 기본원칙 [인설안공비] — 인간 존엄성 보호(AI는 보조 수단), 설명 가능성과 투명성 확보, 안전한 작동 보장, 공정성과 비차별. 실행 방안이 두 축: 이용자 권익 보호 [이결다입] — 이용자 인격권 보호(필터링·신고·차단), 결정 과정의 설명 노력('AI 생성' 고지), 다양성 존중, 입력데이터 수집·활용 관리(사전 고지·동의) / 콘텐츠 관리·책임 [책건] — 책임과 참여, 건전한 유통·배포. 생태계 조성은 EU AI Act·AI 기본법·ISO/IEC 42001과 연계됩니다. 138회 정보관리 3교시 기출." },
"genai-user-protection-2502": { image: "/concept/book/genai-user-protection-2502.png", easy: "'생성형 인공지능 서비스 이용자 보호 가이드라인'의 발표일(2025.02.28) 표기판 — 같은 문서입니다. 기본원칙 [인설안공비](인간 존엄성·설명 가능성·안전한 작동·공정성과 비차별)와 실행 방안 [이결다입]+[책건]을 그대로 기억하면 됩니다. 답안에서는 '방송통신위원회가 2025.02.28 발표, 생성형 AI 이용 과정의 잠재적 위험 사전 방지와 이용자 권익 보호를 위한 기본 원칙과 실천 방식 제시'로 서두를 잡으면 됩니다." },
"iso-42119-2": { image: "/concept/book/iso-42119-2.png", easy: "소프트웨어 테스트 국제표준(ISO/IEC/IEEE 29119)을 AI 시스템에 적용하는 방법을 제시하는 기술 명세서입니다. 구성: 서문(범위 — 29119 적용 범위 한정, Normative references — 29119 시리즈+AI 표준 23894·25059·22989, AI 특화 용어 40개 — \"AI risk\"·\"drift testing\"·\"adversarial testing\") + 기술 본론 4개: AI 시스템·테스트 소개(생애주기 정의, 위험 기반 테스트 접근 중심), AI 시스템 리스크 식별(안전성·공정성·프라이버시·보안 리스크를 ISO/IEC 23894와 연계해 우선순위 설정), AI 테스트 접근법(레벨별 + 데이터 품질·모델·지식기반 시스템 테스트), Annex A~C(AI의 확률성·학습성·비결정성 특성). 2026.02 ITPE FR 기출." },
"brainbody-llm": { image: "/concept/book/brainbody-llm.png", easy: "LLM 두 개를 뇌(Brain)와 몸(Body)처럼 계층적으로 나눠 쓰는 에이전트 시스템입니다. Brain-LLM은 고수준 작업 계획과 의미론적 추론을 담당하고(\"소파에서 칩 먹기\" → 주방으로 가기·칩 찾기 같은 High-level Plan), Body-LLM은 하위 수준 제어·실행을 담당합니다(<walk><kitchen> 같은 Low-level Plan). 핵심은 Closed-Loop Feedback — 시뮬레이터/실환경에서 오류가 나면 오류 신호와 환경 상태가 즉시 Brain-LLM으로 돌아가고, Brain이 원인을 추론해 계획을 수정합니다(접시 씻기 실패 → 수세미 사용으로 계획 갱신 → SUCCESS). 로봇 제어형 Physical AI의 대표 아키텍처입니다." },
"confusion-matrix": { image: "/concept/book/confusion-matrix.png", easy: "예측값과 실제값의 일치 여부를 2×2 행렬(TP·FN·FP·TN)로 놓고 모델을 평가하는 기법 — 분류 모델 평가의 출발점입니다. 지표 공식이 그대로 시험에 나옵니다: Precision=TP/(TP+FP)(Positive 예측 중 진짜), Accuracy=(TP+TN)/전체, Recall=TP/(TP+FN)(실제 Positive 중 잡아낸 비율, 민감도), Specificity=TN/(FP+TN)(진음성률), FP Rate=FP/(FP+TN)(=1−Specificity), F1 Score=2×(P×R)/(P+R)(정밀도·재현율의 조화), Cohen's Kappa=(Accuracy−P(e))/(1−P(e))(우연히 맞춘 것까지 보정 — 클래스 불균형에서 Accuracy의 함정 극복). ROC(모든 threshold의 FPR·TPR)·AUC(ROC 아래 면적)·PR Plot도 세트로 기억하세요." },
"class-imbalance": { image: "/concept/book/class-imbalance.png", easy: "타깃 데이터가 극소수인 상태 — 사기 거래 1건 vs 정상 9,999건 같은 상황입니다. 함정: 전부 '정상'이라고만 해도 Accuracy 99.99%가 나오지만 Recall은 0에 가깝습니다. 해결 3가지 — 과대 표집(Over-Sampling) [렌아스블디]: 소수 클래스를 복제·생성(Random Over Sampling, ADASYN, SMOTE, BLSMOTE, DBSMOTE — 정보 손실은 없지만 과적합 위험) / 과소 표집(Under-Sampling) [랜토이발]: 다수 클래스 일부만 선택(Random Under Sampling, Tomek Links, EasyEnsemble, BalanceCascade — 계산은 빠르지만 데이터 소실 큼) / 임곗값 이동: 학습은 그대로 하고 테스트 단계에서 컷오프를 데이터 많은 쪽으로 이동. 성능 지표는 상황 따라 F1·F0.5·F2·G-Mean·PR AUC 등을 선택합니다." },
"diffusion": { image: "/concept/book/diffusion.png", easy: "텍스트 프롬프트에서 실사 이미지를 만들어내는 생성형 AI 모델 — Stable Diffusion·DALL-E·Midjourney의 원리입니다. 동작 직관: 이미지에 노이즈를 점점 첨가하는 순방향 디퓨전을 학습해 두고, 생성할 때는 랜덤 노이즈에서 시작해 그 과정을 거꾸로 반복 취소(denoise)하는 역방향 디퓨전으로 그림을 만들어 냅니다. 기술요소 4개가 시험 포인트 — CLIP(텍스트를 토큰화해 text embedding으로 변환하는 Text Encoder), U-Net+Scheduler(노이즈 제거의 핵심, n번 반복 denoise), VAE(Encoder로 특징 학습·Decoder로 최종 이미지 복원), 순방향/역방향 디퓨전. 흐름: 프롬프트 → CLIP → Text Embeddings → U-Net 반복 → Conditioned Latents → VAE → 이미지." },
"automl": { image: "/concept/book/automl.png", easy: "머신러닝에서 가장 소모적이고 반복적인 작업 — 피처 추출과 하이퍼파라미터 설정 — 을 자동화하는 프로세스입니다. 프로세스 [피하신] — ① 피처 엔지니어링(EDA로 원시데이터 해석: PCA, k-means, Min-max 스케일링, BoW) → ② 하이퍼 파라미터 최적화(그리드 탐색·랜덤 탐색·베이지안 최적화) → ③ 신경망 구조 탐색(NAS: 검색 공간·검색 전략·성능 추정 전략). 상용 서비스: Google Cloud AutoML(자동 전이학습·신경 아키텍처 검색), Azure Machine Learning(피처·알고리즘 탐색+튜닝), Amazon SageMaker(튜닝 수행, 자동 다중 모델 시도는 지양). 데이터 과학자 없이도 ML 모델을 만들 수 있게 하는 'ML의 민주화' 기술입니다." },
"ai-bias": { image: "/concept/book/ai-bias.png", easy: "선입견·편견·문화적 영향 등으로 AI가 객관성·공정성에서 벗어나는 경향입니다. 유형 [인숨데롱고] — Data 관점: 인간의 편향(원시 데이터에 인간의 편향이 개입), 숨겨진 편향(절대 발견될 수 없는 의도치 않은 편향 — 가장 찾기 어려움), 데이터 표본 편향(샘플링에 기인) / Process 관점: 롱테일 편향(특정 범주가 훈련 데이터에서 누락), 고의적 편향(해킹으로 의도적으로 편향 — 숨겨져 있어 가장 위험). 해결방안이 XAI(설명 가능한 AI): 기존 AI는 \"95% 확률로 고양이\"라는 결과만 주지만, XAI는 \"털·수염이 있고 ~모양이므로 95% 확률로 고양이\"처럼 결과가 생성되는 과정을 설명해 편향을 발견·교정할 수 있게 합니다." },
"ai-trism": { image: "/concept/book/ai-trism.png", easy: "AI의 부적절한 사용을 막기 위해 가트너가 제시한 AI 신뢰성·위험·보안 관리 프레임워크입니다. 개념도 [신위보]: Unmanaged Risks를 AI TRiSM으로 걸러 Managed Risks로 만드는 구조. 4개 Pillar [익모모응프]가 시험 핵심 — Explainability/Model Monitoring(SHAP·MS Fairlearn 툴킷으로 설명가능성 확보), ModelOps(전사 단일소스, AI 거버넌스·라이프사이클 관리 — 지식그래프·규칙·최적화), AI Application Security(적대적 AI 대응 모델 강화, 노이즈 면역력 — 견고성 테스트·모델 검증), Privacy(비식별화가 아니라 합성 데이터·허위 데이터 사용 — AI Reverie). AI 도입 기업의 거버넌스 답안 단골 프레임워크입니다." },
"deepfake": { image: "/concept/book/deepfake.png", easy: "딥러닝+Fake의 합성어 — 딥러닝으로 기존 영상에 다른 영상·이미지를 합성해 콘텐츠를 만드는 기법입니다. 원리는 GAN: 잠재 확률 변수 → 생성 AI가 가짜 표본을 만들고, 식별 AI가 진짜/가짜를 판별해 피드백(반복)하며 점점 정교해집니다. 요소기술 절차: 수집(Source·Target 영상) → 생성(GAN 활용 — Autoencoder·GAN·LSTM) → 식별·학습 반복(Real/Fake 구분 피드백) → 딥페이크 생성. 탐지기술: AI 기반(얼굴 특징·영상 품질·생체 신호 분석)과 포렌식 분석(픽셀 레벨·메타데이터). 대응방안 3축 — 기술적(탐지 시스템·라벨링·수정불가 워터마크), 법적(법제화·플랫폼 책임·국제 협력), 사회적(교육·탐지 도구 공개)." },
"prompt-injection": { image: "/concept/book/prompt-injection.png", easy: "공격자가 프롬프트에 정교하게 조작된 입력을 주입해 LLM의 응답을 조작하고 민감 데이터를 유출시키는 공격입니다(OWASP LLM Top 10 1위). 공격절차: 시스템 프롬프트(정상 명령)에 사용자 입력으로 악성 데이터 주입 → LLM이 명령어와 데이터를 구분 못 해 보안 경계 우회(탈옥) → 프롬프트·데이터·컨텍스트 탈취, 원격코드 실행, 허위정보 캠페인. 유형 2가지가 시험 포인트: 직접 인젝션(프롬프트에 직접 악성 입력)과 간접 인젝션(외부소스에 악성 입력을 심어 LLM이 읽게 함). 대응: 입력 검증·필터링(Regex, 화이트/블랙리스트, 프롬프트 캡슐화, 의미 분석), 권한·접근 제어(최소권한, RBAC, 신뢰경계), 사용자 확인·모니터링(승인 프로세스, 감사로그, RLHF)." },
"adversarial-attack": { image: "/concept/book/adversarial-attack.png", easy: "심층신경망 모델에 적대적 교란(Adversarial Perturbation)을 가해 오분류를 일으키는 공격입니다. 공격 기법 [오회전추] — Poisoning(오염·중독공격: 악의적 학습 데이터 주입으로 모델 자체 손상 — MS '테이', '이루다' 사례), Evasion(회피공격: 입력에 최소 변조 — 표지판에 스티커 붙여 자율주행차가 '정지'를 '속도제한'으로 오인), Inversion(전도공격: 다량 쿼리 결과 분석으로 학습 데이터 추출 — 얼굴 이미지 복원), Model extraction(추출공격: 쿼리 반복으로 유사 모델 복제 — 70초 650번 쿼리로 아마존 모델 복제 연구). 방어 기법 [적갠쿼결탐] — 적대적 훈련, Defense-GAN, 쿼리 횟수 제한, 결과값 분석 차단, 적대적 공격 여부 탐지(별도 모델 비교)." },
"model-drift": { image: "/concept/book/model-drift.png", easy: "환경이 끊임없이 변하면서 배포된 모델의 성능이 저하되는 현상 — 모델은 그대로인데 세상이 변한 것입니다. 두 종류의 비교가 시험 핵심입니다. 컨셉 드리프트: 입력과 정답 라벨의 '관계성'이 변함(정답의 개념 자체가 변화) — 예: 금융사기 예측모델에서 금융사기의 정의가 바뀐 경우. 해결: Online Learning, Feature dropping. 데이터 드리프트: 훈련 시와 배포 환경의 입력 데이터 '통계적 분포'가 달라짐 — 예: 여름에 잘 맞던 모델이 겨울에 성능 저하(계절성). 해결: 드리프트 모니터링, 모델 재학습·재배포. 한 줄 구분: 컨셉=라벨과의 관계 변화, 데이터=입력 분포 변화. MLOps 2단계의 '드리프트 감지'가 바로 이것입니다." },
"ai-redteam": { image: "/concept/book/ai-redteam.png", easy: "AI 모델·시스템의 취약점, 편향, 사회적 해악, 보안 문제를 찾기 위해 의도적으로 공격을 시도하는 적대적 탐색적 테스팅입니다. 개념도: 레드팀(공격 — 프롬프트 인젝션·탈옥·데이터 유출·편향 유도·적대적 입력)과 블루팀(방어·분석)이 맞붙고, 산출물로 취약점 리포트/리스크 카탈로그·신규 가드레일/필터링 규칙·신규 평가지표/테스트 기법이 나옵니다. 팀: 10~100명 이상, 기술·윤리·법·도메인 전문가와 유저 포함 / 내부·외부·클라우드소싱·전문가·유저 혼합형. 절차: 범위·환경 정의 → 레드팀 구성 → 공격 테스트 → 블루팀 방어/분석 → 리포트·대책. 모델 테스트 기법(인젝션·탈옥·편향 유도·Agent 오동작·포이즈닝)과 시스템 테스트 기법(데이터 유출·가드레일 무력화·보안 경계)이 구분 포인트. 2025.10 ITPE 기출." },
"ai-system-test": { image: "/concept/book/ai-system-test.png", easy: "AI 모델은 휴리스틱이라 '정답 판정 기준(테스트 오라클)'이 없다는 문제를 해결하기 위한 테스트입니다. 블랙박스 테스팅 [변액(A)백조] — 조합 테스팅(결함은 2개 이상 요소의 상호작용에서 나온다는 착안, 입력 조합 하위 세트 테스트), 백투백(변형된 둘 이상 대상에 동일 케이스 실행해 결과 비교), A/B 테스팅(테스터에게 노출해 어느 변형이 더 선호되는지), 변성 테스팅(입출력 간 메타모픽 관계로 새 입력의 출력을 예측). 신경망 화이트박스 테스팅 [뉴임부값뿌레안] — 뉴런 커버리지(활성화 뉴런/전체), 임계점, 부호 변경, 값 변경, 부호-부호, 레이어 커버리지, 안전 변경 최대화 테스트. 코드 커버리지의 신경망 버전이라고 이해하면 쉽습니다." },
"foundation-model": { image: "/concept/book/foundation-model.png", easy: "대규모 데이터셋으로 사전 학습해 두고, 다른 서비스·분야로 적응(Adaptation)시켜 쓰는 다목적 기반 모델입니다. GPT·BERT가 대표 — 하나의 모델이 질의응답·감성분석·정보추출·이미지 캡셔닝 등 여러 태스크로 뻗어나갑니다. 특징 [창균전] — 창발성(emergence: 스스로 문제 해결 지식을 도출), 균일화(homogenization: 적용 범위가 확대되며 범용화), 전이학습(사전 학습된 가중치로 데이터 부족 완화). 기반기술: 구현(대용량 학습데이터, 자기지도학습, 트랜스포머, 컴퓨팅 성능) + 최적화(지식 증류, Pruning, 양자화, Sparsity). FMOps: 기반모델 → Iteration → 테스트 → 최적화 → 모니터링 → 배포로 운용하는 방법론까지 세트로 기억하세요." },
"multimodal-ai": { image: "/concept/book/multimodal-ai.png", easy: "이미지·텍스트·음성·비디오 등 여러 모달리티(Modality)를 '동시에' 받아들여 사고하는 AI입니다. 사람이 눈·귀·입을 함께 쓰듯, 단일 입력만 받는 Unimodal AI보다 훨씬 넓은 범위의 결과를 냅니다(GPT-4V처럼 사진을 보며 대화). 요소기술 4축이 시험 포인트 — 지식/언어지능(NLP·NLU·NLG, Word Embedding, Seq2Seq), 음성/청각(STT, Signal Processing — hot word 인식·노이즈 필터링), 이미지/시각(Image Scaling·Filtering·Morphology — 얼굴·글자 인식, 이미지 검색), 추론/기계학습(회귀·시계열·클러스터링·연관분석 — KPI 예측, 자동 데이터 생성)." },
"gpai-risk-framework": { image: "/concept/book/gpai-risk-framework.png", easy: "범용 인공지능(AGI)의 개발·활용 과정의 위험을 사전에 식별하고 체계적으로 관리하기 위한 종합적·선제적 지침 체계입니다. 3원칙 '3Ps' [인목가] — 인류 우선성(최종 결정은 인간이), 목표 지속성(예상 밖 기능이 생겨도 본래 목적에 부합), 가치 보존성(사회·윤리·법·문화적 가치 준수). 위험관리 절차 4단계: 위험 식별(Known/Unknown risks 발굴, 위험 프로필 작성) → 위험 분석(원천·지속성·의도성·영향 범위) → 위험 평가(Risk Scoring, 3D 위험 매트릭스, Catastrophic~Minor 4단계 등급화) → 위험 대응(제거·완화·모니터링·수용, 피드백 루프로 갱신). 136회 정보관리 기출." },
"ai-agent": { image: "/concept/book/ai-agent.png", easy: "환경과 상호작용하며 데이터를 수집하고, 사전 결정된 목표 달성에 필요한 작업을 '스스로 결정해' 수행하는 자율 시스템입니다. 개념도: Environment →Perception→ Sensor → Process ↔ Knowledge Base → Actuator →Action→ Environment 순환. 기술요소: Sensor(카메라·마이크·웹 검색 등 수집 인터페이스), Process(처리·의사결정), Knowledge Base(정보·경험 저장), Actuator(행동 실행), 학습 알고리즘, 엣지 컴퓨팅(Tiny ML). 유형 4가지가 시험 포인트 — 단순 반사(규칙 기반), 모델 기반(과거 경험 활용), 목표 기반(목표 달성 최적 행동), 유틸리티 기반(효용성 계산). AI Agent(단순 작업 자동화)에 강화·지도·비지도 학습이 더해지면 Agentic AI(자율적 의사결정)로 진화합니다." },
"a2a": { image: "/concept/book/a2a.png", easy: "AI 에이전트들이 서로 다른 플랫폼·조직 경계를 넘어 통신하고 안전하게 정보를 교환하게 하는 개방형 프로토콜(구글 주도)입니다. MCP와의 관계가 핵심 시험 포인트: MCP는 에이전트에게 도구와 컨텍스트를 연결해 주고(에이전트 내부), A2A는 에이전트끼리 통신하게 합니다(에이전트 사이) — 상호 보완적. 설계 원칙: 에이전트 능력수용(메모리·도구·컨텍스트 공유 없이 협업), 기존 표준 기반(HTTP·SSE·JSON-RPC), 보안 보장(엔터프라이즈 인증), 장기 실행 작업 지원. 주요 기능: 모달리티 지원(오디오·비디오), 기능 검색(JSON 에이전트 카드로 자기 기능 공유), 작업 관리, 협업(컨텍스트·아티팩트 전달), 사용자 경험 협상('파트' 컨텐츠 관리). 2025.07 KPC 기출." },
"vibe-coding": { image: "/concept/book/vibe-coding.png", easy: "LLM에게 자연어로 지시해 코드를 생성하고, 개발자는 검토·조정만 하는 코딩 기법입니다. 흐름: 아이디어 →자연어→ AI(Cursor·Replit Ghostwriter) →생성→ 코드 → 검토·조정 반복. 기반 기술: LLM(GPT·Claude — 자연어를 코드로 변환하는 핵심 엔진), 명령어 의도 파악, 자연어↔코드 전환 UI. 도구: Cursor(설명하면 코드 제안+리팩토링·디버깅), Replit Ghostwriter(브라우저에서 바로), GitHub Copilot(자동 완성), Framer AI(노코드 웹), FlutterFlow(드래그앤드롭 UI). 장점: 자연어 개발·프로토타이핑·사용자 주도 / 단점: AI 의존성·코드 최적화 문제 → 보완책이 Human in the loop(사람이 의사결정에 개입·통제해 신뢰성·품질·책임 확보). 2025 KPC·ITPE 다수 기출." },
"mcp": { image: "/concept/book/mcp.png", easy: "LLM 애플리케이션과 외부 데이터·도구를 표준 방식으로 연결하는 개방형 프로토콜 — 'AI계의 USB-C 포트'입니다. 구성 [호클서]: MCP Host(Claude·IDE 같은 LLM 앱, 여러 서버와 동시 연결·전체 흐름 조율), MCP Client(서버와 1:1 연결, 메시지 직렬화·상태관리), MCP 서버(외부 데이터·기능을 모델이 이해할 맥락으로 제공). 맥락 3요소 [리툴프]: Resources(읽기 전용 데이터), Tools(호출 가능한 기능), Prompts(지시·템플릿). 동작절차 [초기모도응전]: 초기화 → 기능 협상·발견(JSON-RPC로 조회) → 모델의 요청 처리(도구 판단) → 도구호출요청 → 모델응답생성 → 응답전달. 통신은 JSON-RPC 2.0 표준 메시지." },
"mcp-security": { image: "/concept/book/mcp-security.png", easy: "MCP 생태계의 보안취약점과 대응방안 — 137회 정보관리 2교시 기출입니다. 위협: MCP Tool 측면 — Tool Poisoning(도구 설명에 악성 코드를 숨겨 AI가 실행하게 유도), Hidden Risks(무해해 보이지만 숨겨진 명령어 실행), Rug Pulls(설치 후 악의적 수정 — 가짜 업데이트) / 연동 구조 측면 — Cross-Server Attacks(악성 서버가 정상 서버의 도구를 덮어쓰는 신뢰된 도구 하이재킹) / 서버 측면 — 프롬프트 인젝션·민감 데이터 유출 / 클라이언트 측면 — 인증 미흡·무분별한 설치. 대응: 인증(토큰 바인딩 — HTTPS·OAuth 2.1+PKCE, 세션 바인딩), 실행(HITL 사용자 확인, 최소권한·화이트리스트·JIT, 샌드박스 격리), 서버(서버 간 격리, 실행 전 투명성, 권한 최소화), 클라이언트(도구 업데이트 모니터링, 감사로그, 사용자 교육)." },
"synthetic-data": { image: "/concept/book/synthetic-data.png", easy: "통계적 방법으로 추정된 모형에서 새로 생성되어, 실제 데이터와 '통계 속성이 동일한' 모의 데이터입니다 — 개인정보 없이 실데이터처럼 쓸 수 있어 규제 산업의 AI 학습에 씁니다. 종류 [완부복] — 완전 합성(실데이터 0%, 보안성 최강), 부분 합성(민감 변수만 대체), 복합 합성(변수 대체 후 추가 대체 변수 도출). 생성방법 [가신베 변간확] — 통계기반(가우스 혼합 모델, synthpop-CART, 베이지안 네트워크) / AI기반(VAE, GANs, 확산 모델). 검증: 유용성(모델 성능·Visual Turing Test / 분포·관계 유사성)과 안전성(생성절차평가·유사성 / 구별·연결·추론 위험도). 생성 과정 [사생안유심활]: 사전준비 → 생성 → 안전성·유용성 검증 → 심의위원회 평가 → 활용·안전한 관리. 참조모델: 구강 이미지 1,000장(충치진단 AI) 등." },
"sovereign-ai": { image: "/concept/book/sovereign-ai.png", easy: "자체 인프라·데이터·인력·비즈니스 네트워크로 AI를 구축하는 '국가의 역량' — 데이터 주권과 규제 준수를 보장하기 위한 AI입니다. 왜 필요한가: 외국 빅테크 AI에 의존하면 자국 데이터가 국경을 넘고, 문화·언어가 반영되지 않으며, 정책 통제가 어렵기 때문. 구성: 자체 인프라, 인력·네트워크, 독립 운영, 문화·언어 반영 AI, 자국 정책 준수·맞춤화. 기술요소 3축 — 데이터(자국 내 자체 클라우드 저장, 암호화·접근제어, 데이터 국경 관리), 학습·배포(분산·연합 학습, 설명가능한 AI, 모델 해석 도구), 인프라(고성능 GPU, 슈퍼컴퓨터 센터 고도화). 사례: 한국(자체 클라우드+엔비디아 협력), 프랑스(클라우드 네이티브 AI 슈퍼컴퓨터), 싱가포르(국가 슈퍼컴퓨터센터 GPU 업그레이드)." },
"iso-42001": { image: "/concept/book/iso-42001.png", easy: "조직의 인공지능 경영시스템(AIMS) 수립·구현·유지·개선 요구사항을 담은 AI 국제 경영시스템 표준입니다 — ISO 27001(보안)의 AI 버전이라고 보면 됩니다. 표준 구성 [조리기지운성개]를 PDCA로 매핑하는 것이 시험 핵심: Plan(4.조직의 상황, 5.리더십, 6.기획 — 리스크 관리·AI 목표) / Do(7.지원 — 자원·역량·문서화, 8.운용 — 운용기획·AI 위험평가·AI 위험 처리·AI 시스템 영향평가) / Check(9.성과평가 — 모니터링·내부심사·경영검토) / Act(10.개선). 요구사항 [목리윤투책] — 목적과 범위 설정, 리스크 관리, 윤리 준수, 투명성, 책임성. 8장의 AI 위험평가·영향평가가 일반 경영시스템과의 차별점입니다." },
"ax": { image: "/concept/book/ax.png", easy: "기업이 기존 사업 모델·프로세스를 버리고 AI를 전사적으로 적용해 사업 모델·프로세스·제품·서비스의 변화를 추구하는 전환 과정 — DX(디지털 전환)의 다음 단계입니다. 절차 [전파혁교커업] — ① AI 전략 수립(가치 있는 고유 데이터 소스·자동화 효율 좋은 프로세스·내부 리소스 식별) → ② 파일럿 프로젝트 실행(신뢰와 모멘텀 생성) → ③ 사내 AI 혁신팀 구축(아웃소싱보다 장기적으론 내부 육성) → ④ AI 교육 제공 → ⑤ 내외부 커뮤니케이션 → ⑥ AI 전략 업데이트. 기술요소 [서인거] — AI 서비스(NLP·영상 분석·ML·자율주행), AI 인프라(GPU/TPU·분산 컴퓨팅·개발/배포 플랫폼), AI 거버넌스(데이터·모델 거버넌스, 규정 준수). 기대 효과: 가치 창출, 효율성·생산성 향상, 신규 사업 진출." },
"agentic-ai": { image: "/concept/book/agentic-ai.png", easy: "메모리·계획·환경 감지·도구 활용·안전 지침 준수를 결합해, 목표 달성 작업을 스스로 수행하는 AI입니다. AI Agent가 '단순 작업 자동화'라면 에이전틱 AI는 '자율적 의사결정'까지 갑니다. 프로세스 [인추행학]이 시험 핵심 — 인식(Perceive: 데이터 수집·특징 추출) → 추론(Reason: LLM 기반 추론·RAG 활용) → 행동(Act: 목표 설정·자율 계획·API 통합) → 학습(Learn: 피드백 루프로 모델 개선 — 데이터 플라이휠). 개념도: USER ↔ AI Agent(Database·Vector DB → LLM → Action) + Data Flywheel → Model Customization. 사례: 공급망 최적화·제조 자동화, 사이버보안 분석·금융 거래 감시, 의료진 보조·원격 모니터링, 개인화 고객 서비스·재고 예측." },
"data-quality-v3": { image: "/concept/book/data-quality-v3.png", easy: "인공지능 학습용 데이터의 품질 확보에 필요한 조직·절차·품질기준·품질관리 활동을 정의하고 점검·조치하는 가이드라인(NIA)입니다. 사업 3단계: 100.준비·계획 / 200.구축 / 300.운영·활용. 품질관리 프로세스 [구획정가학운] — 110.구축계획 수립(품질지표·목표·점검 기준) → 210.데이터 획득/수집(원시데이터) → 220.데이터 정제(중복제거·비식별화 → 원천데이터) → 230.데이터 가공(라벨링데이터 부여) → 240.데이터 학습(학습데이터셋 생성·모델 성능 보정) → 310.데이터 운영·활용(AI Hub 개방·유지보수). 품질관리 지표 [준완유기기통구의알유] — 구축공정(준비성·완전성·유용성), 데이터 적합성(기준·기술 적합성, 통계적 다양성), 데이터 정확성(구문·의미 정확성), 학습모델(알고리즘 적정성·유효성)." },
"public-genai-guideline": { image: "/concept/book/public-genai-guideline.png", easy: "공공부문이 초거대AI를 도입하기 위한 절차와 내용의 가이드라인(2.0, 2025.04)입니다. 공공AI 3대 전략 목표: 대국민 서비스 혁신, 사회문제 해결, 일하는 방식 효율화. 도입절차 [보클데서유성] — 데이터 보안 등급(기밀 Classified·민감 Sensitive·공개 Open 3등급 분류) → 클라우드 구성 방안 → 데이터 학습 방식(파운데이션·파인튜닝·사후 학습·RAG 기반 구분) → 서비스 도입 방식(디지털 서비스 구매 또는 조달 용역발주) → 유지보수·운영(Ops) → 성과 관리. 성과 지표 [투과산결] — 투입지표(자원량) → 과정지표(중간 산출물) → 산출지표(1차 산출물) → 결과지표(궁극적 효과). AI 기능분류 [지자대모]: 지능형 정보처리·자동화 업무 지원·대화형 서비스·모니터링/알람." },
"ai-trust-cert": { image: "/concept/book/ai-trust-cert.png", easy: "데이터·모델의 편향과 AI에 내재한 위험·한계를 해결하고, 확산 과정의 부작용을 방지하기 위해 준수해야 하는 가치 기준입니다. 핵심 속성 [안설투견공] — 안전성(위험 가능성이 완화·제거된 상태), 설명가능성(판단 근거·과정을 이해할 수 있게 제시), 투명성(결정 이유 설명·근거 추적 가능, 목적·한계 정보 전달), 견고성(외부 간섭·극한 환경에서도 성능 유지), 공평성(특정 그룹 차별·편향 없음). 신뢰성 요건 [존책안투] — 다양성 존중(공정성·정당성), 책임성(책무성·감사가능성·답변가능성), 안전성(통제가능성·보안성·강건성·성능보장성), 투명성(설명·추적·이해·해석가능성). 관련 표준: ISO/IEC TR 24028(신뢰성 개요), 22989(개념·용어), 23053(AI·ML 프레임워크), 23894(위험 관리), 42001(경영시스템)." },
"ai-ready-data": { image: "/concept/book/ai-ready-data.png", easy: "AI·ML 모델의 훈련·검증·테스트에 '바로 사용할 수 있도록' 준비·구조화·정리된 데이터입니다. 용어 체계가 시험 핵심 — 원시데이터(Raw Data: 획득 단계에서 수집·생성한 데이터) →정제→ 원천데이터(Source Data: 전처리 완료, 라벨링 전) →라벨링→ 라벨링데이터(참값 Ground Truth + 속성 + 어노테이션의 집합). 데이터 획득(현실 세계에서 법률적 제약 없이 원시데이터 확보) → 데이터 정제(형식 변환·중복 제거·개인정보 비식별화) → 데이터 라벨링(목적에 부합하는 정보 부착). 획득·정제 절차: 데이터 정의 → 특성 분석 → 획득 절차·항목 → 정제 방식 → 도구 → 고려사항(법·제도 준수, 다양성 확보, 편향 방지·윤리). 2026.02 ITPE FR 기출." },
"ai-basic-law": { image: "/concept/book/ai-basic-law.png", easy: "인공지능의 건전한 발전과 신뢰기반 조성에 필요한 기본 사항을 규정한 법입니다(2026.1 시행, 세계 두 번째 AI 종합법). 3대 축: 추진체계(기본계획 3년마다 수립 제6조, 국가인공지능위원회 제7조, 인공지능안전연구소 제12조), 산업 육성(연구개발 지원 제13조, 표준화 제14조, 집적단지 제23조, 데이터센터 제25조), 안전·신뢰 기반 조성(고영향·생성형 AI 정의, 자율 검·인증 및 영향평가 지원). 핵심 정의(제2조): 고영향 인공지능(생명·신체 안전·기본권에 중대한 영향 우려가 있는 AI)·생성형 인공지능·인공지능사업자. 의무 조항이 시험 포인트 — 투명성 확보 의무(제31조: AI 생성물 사전 고지·표시), 안정성 확보 의무(제32조: 기준 이상 연산량 시 위험 식별·평가·완화), 고영향 AI 사업자 책무(제34조), 영향평가(제35조), 과태료(제43조: 3천만원 이하)." },
"ai-cost-estimation": { image: "/concept/book/ai-cost-estimation.png", easy: "AI 서비스 도입 사업비를 산정하는 방식 — 공식은 [도입비 = 이커구]: 서비스 이용료 + 커스터마이징 작업비용 + 구축·개발 비용입니다. 사업유형 [단기데모시] — 단순 AI 서비스 도입형(개발 없이 구독료만), 커스터마이징형 3종(기본: 최소한의 작업 / AI 데이터 구축: 데이터 신규·재구축 / AI 모델: 모델 최적화·파인튜닝·알고리즘 개발), 시스템통합형(커스터마이징+SW 개발·시스템통합 병행). 상세절차 [사서커구사] — ① 사전 준비(대상 서비스 식별·유형 결정) → ② 서비스 이용료 계산(도입기간·사용 규모·단위 이용료) → ③ 커스터마이징 작업비용 계산(요구분석·데이터 구축·모델 구현·검증) → ④ 구축·개발 비용 계산(기능점수 또는 투입공수 방식) → ⑤ AI 서비스 도입 사업비 산정." },
"distance-formula": { image: "/concept/book/distance-formula.png", easy:"두 데이터 간의 차이를 재는 자 — 거리가 가까울수록 유사한 데이터로 판별합니다. 유형 5가지: 유클리디안 거리(L2, 두 점 사이 직선 거리 √Σ(p−q)²), 맨하탄 거리(L1, 격자 도시처럼 수평·수직으로만 이동한 거리 Σ|a−b|), 체비쇼프 거리(좌표 차원 중 가장 긴 거리 하나만: max|x−y|), 마할라노비스 거리(상관관계와 분산까지 고려한 통계적 거리 — 평균에서 멀리 떨어질수록 이상치로 탐지), 민코프스키 거리(일반화 공식 — p=1이면 맨하탄, p=2면 유클리디안, p=∞면 체비쇼프). K-NN·K-평균 등 거리 기반 알고리즘의 공통 기초입니다." },
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
