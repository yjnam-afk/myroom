/**
 * 교재 속 서브 토픽 — 교재 토픽의 표·키워드 안에만 들어 있지만 따로 자주 출제되는 개념.
 *
 * 2026-10-18 "교재 안에 숨어 있는 중요 토픽들이 있거든? 이런 것들도 서브 토픽으로 만들고 싶은데" —
 * 2PL 은 「DB 동시성제어」 표의 한 행, ARIES 는 「DB 회복기법」 표의 한 행일 뿐이라 토픽 목록·지도·검색에
 * 안 나왔다. 서브 토픽은 자기 화면(/explain?topic=이름)을 갖고, 거기엔 그 이름이 나오는 교재 표 행·출제 이력·
 * 답안이 모인다. 상위 토픽 화면과 토픽 지도에는 상위 칩 아래 작은 칩으로 붙는다.
 *
 * 규칙: 이름·별칭은 교재(서브노트 표·키워드)에 실제로 있는 말만 쓴다 — `parent` 서브노트에 별칭 하나는 꼭 들어 있어야 한다
 * (`npx tsx scripts/check-sub-topics.ts`). 정의를 지어 넣지 않는다 — 화면은 교재 표 행을 그대로 보여 준다.
 * 별칭은 출제 이력 열쇠로도 쓰이므로(topicAliases) 넓은 말(「RTO」처럼 TCP 재전송 타이머와 겹치는 것)은 넣지 않는다.
 */
export type SubTopic = {
  /** 화면 제목 */
  name: string;
  /** 상위 토픽 — 교재 서브노트 제목 */
  parent: string;
  /** 교재·문항에 나오는 다른 표기 */
  aliases: string[];
};

export const SUB_TOPICS: SubTopic[] = [
  // 데이터베이스
  { name: "2PL(2 Phase Locking)", parent: "DB 동시성제어", aliases: ["2PL", "2단계 로킹", "2단계 잠금", "2단계 락킹", "Two Phase Locking", "2 Phase Locking"] },
  { name: "WAL(Write-Ahead Logging)", parent: "DB 회복기법", aliases: ["WAL", "Write-Ahead Log", "Write Ahead Log", "로그 우선 기록"] },
  { name: "ARIES 회복기법", parent: "DB 회복기법", aliases: ["ARIES"] },
  { name: "BCNF(Boyce-Codd Normal Form)", parent: "데이터베이스 정규화(Normalization)", aliases: ["BCNF", "보이스-코드 정규형", "보이스코드 정규형", "Boyce-Codd"] },
  { name: "이상현상(삽입·갱신·삭제 이상)", parent: "데이터베이스 정규화(Normalization)", aliases: ["삽입 이상", "갱신 이상", "삭제 이상", "삽입이상", "갱신이상", "삭제이상"] },
  { name: "CDC(Change Data Capture)", parent: "쿼리오프로딩(Query offloading)", aliases: ["CDC", "Change Data Capture"] },
  { name: "다중공선성(Multicollinearity)", parent: "회귀분석(Regression Analysis)", aliases: ["다중공선성", "다중 공선성", "Multicollinearity"] },
  // 운영체제
  // 2026-10-20 "문맥과 시스템콜, 교재에 없는 거 아냐?" — 교재엔 따로 쪽이 없어 토픽에서 서브 토픽으로 내렸다
  { name: "문맥(Context)", parent: "문맥교환(Context Switching)", aliases: ["하드웨어 문맥", "시스템 문맥", "사용자 문맥"] },
  { name: "시스템 콜(System Call)", parent: "커널(Kernel)", aliases: ["시스템 콜", "System Call", "시스템콜"] },
  { name: "Working Set(워킹 셋)", parent: "스레싱(Thrashing)", aliases: ["Working Set", "워킹셋", "워킹 셋", "작업 집합"] },
  // 네트워크
  { name: "RIP·OSPF", parent: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)", aliases: ["RIP", "OSPF"] },
  { name: "ARQ(Go-Back-N·Selective Repeat)", parent: "FEC(Forward Error Correction) / BEC(Backward Error Correction)", aliases: ["Go-Back-N", "Selective Repeat", "Selective-Repeat", "Stop and Wait", "Stop-and-Wait", "ARQ"] },
  { name: "MEC(Multi-access Edge Computing)", parent: "5G 특화망", aliases: ["MEC", "Multi-access Edge Computing", "모바일 엣지 컴퓨팅"] },
  { name: "NFV(Network Function Virtualization)", parent: "네트워크 슬라이싱", aliases: ["NFV", "네트워크 기능 가상화", "Network Function Virtualization"] },
  // 컴퓨터구조
  { name: "HBM(High Bandwidth Memory)", parent: "TPU (Tensor Processing Unit)", aliases: ["HBM", "고대역폭 메모리", "High Bandwidth Memory"] },
  // 소프트웨어공학
  { name: "SOLID 원칙", parent: "객체지향 설계 원리", aliases: ["SOLID", "단일 책임 원칙", "개방 폐쇄 원칙", "개방-폐쇄 원칙", "리스코프 치환", "인터페이스 분리 원칙", "의존 역전 원칙", "의존관계 역전"] },
  // 인공지능
  { name: "강화학습(Reinforcement Learning)", parent: "머신러닝 학습방법", aliases: ["강화학습", "강화 학습", "Reinforcement Learning"] },
  { name: "RLHF", parent: "할루시네이션(Hallucination)", aliases: ["RLHF", "인간 피드백 기반 강화학습", "인간 피드백 강화학습"] },
  { name: "RNN·LSTM", parent: "트랜스포머(Transformer)", aliases: ["RNN", "LSTM"] },
  // 보안
  { name: "SOAR", parent: "차세대 SIEM(Security Information and Event Management)", aliases: ["SOAR"] },
  { name: "CASB", parent: "SASE(Secure Access Service Edge)", aliases: ["CASB"] },
  { name: "DLP(Data Loss Prevention)", parent: "SECaaS(Security as a Service)", aliases: ["DLP", "Data Loss Prevention", "데이터 유출 방지"] },
  { name: "SPF·DKIM", parent: "DMARC(Domain-based Message Authentication, Reporting and Conformance)", aliases: ["SPF", "DKIM"] },
  { name: "XSS(Cross Site Scripting)", parent: "OWASP Top 10:2025", aliases: ["XSS", "크로스 사이트 스크립팅", "Cross Site Scripting", "Cross-Site Scripting"] },
  { name: "CSRF(Cross Site Request Forgery)", parent: "시큐어 코딩(Secure Coding)", aliases: ["CSRF", "크로스 사이트 요청 위조", "Cross Site Request Forgery"] },
  { name: "MITM(중간자 공격)", parent: "스니핑(Sniffing) & 스푸핑(Spoofing)", aliases: ["MITM", "중간자 공격", "Man In The Middle", "Man-in-the-Middle"] },
  { name: "허니팟(Honeypot)", parent: "사이버 디셉션(Cyber Deception)", aliases: ["허니팟", "Honeypot", "허니넷"] },
  // 2026-10-19 기출 검수로 더함 — "기출문제를 보고 토픽 선정하는 게 더 빠를걸?". 어느 토픽에도 안 걸리던 문항(6,951개)의
  // 주제부를 묶어 세고, 그 이름이 교재 서브노트 표·키워드에 있는 것만 골랐다.
  { name: "IoC(Indicators of Compromise)", parent: "XDR(eXtended Detection Response)", aliases: ["Indicators of Compromise", "Indicator of Compromise", "침해지표"] },
  { name: "CVE·CWE", parent: "공격 표면 관리(Attack Surface Management)", aliases: ["CVE", "CWE", "CVSS"] },
  { name: "FIDO(Fast IDentity Online)", parent: "패스키(Passkey)", aliases: ["FIDO", "Fast IDentity Online", "Fast Identity Online"] },
  { name: "IDS·IPS", parent: "DoS(Denial of Service)", aliases: ["IDS", "IPS", "침입탐지시스템", "침입방지시스템", "침입 탐지 시스템", "침입 방지 시스템"] },
  { name: "전자서명(Digital Signature)", parent: "암호화(Encryption)", aliases: ["전자서명", "디지털 서명", "Digital Signature"] },
  { name: "RSA·ECC", parent: "암호화(Encryption)", aliases: ["RSA", "타원곡선 암호", "타원 곡선 암호", "Elliptic Curve"] },
  { name: "해시 함수(Hash Function)", parent: "암호화(Encryption)", aliases: ["해시함수", "해시 함수", "해쉬 함수", "해쉬함수", "해시 알고리즘", "해쉬 알고리즘", "Hash Function", "Hash Algorithm"] },
  { name: "TPM(Trusted Platform Module)", parent: "기밀컴퓨팅(Confidential Computing)", aliases: ["TPM", "Trusted Platform Module"] },
  { name: "랜섬웨어(Ransomware)", parent: "RaaS(Ransomware as a Service)", aliases: ["랜섬웨어", "Ransomware"] },
  { name: "SCADA", parent: "IEC 62443", aliases: ["SCADA"] },
  { name: "JWT(JSON Web Token)", parent: "OAuth(Open Authorize) 2.0", aliases: ["JWT", "JSON Web Token"] },
  // 소프트웨어공학·경영
  { name: "MC/DC(Modified Condition/Decision Coverage)", parent: "코드 커버리지(Code Coverage)", aliases: ["MC/DC", "Modified Condition/Decision Coverage", "Modified Condition / Decision Coverage", "변경 조건/결정 커버리지", "변경조건/결정 커버리지"] },
  { name: "IaC(Infrastructure as Code)", parent: "릴리즈 엔지니어링", aliases: ["IaC", "Infrastructure as Code", "Infrastructure-as-Code", "코드형 인프라"] },
  { name: "CBD(Component Based Development)", parent: "소프트웨어 개발 방법론", aliases: ["CBD", "Component Based Development", "컴포넌트 기반 개발"] },
  { name: "오버라이딩·오버로딩", parent: "다형성 (Polymorphism)", aliases: ["오버라이딩", "오버로딩", "Overriding", "Overloading"] },
  { name: "REST API", parent: "MSA (Micro Service Architecture)", aliases: ["REST API", "RESTful", "REpresentational State Transfer", "Representational State Transfer"] },
  { name: "EA/ITA(Enterprise Architecture)", parent: "IT 거버넌스(IT-Governance)", aliases: ["EA/ITA", "Enterprise Architecture", "정보기술 아키텍처", "엔터프라이즈 아키텍처"] },
  { name: "COBIT", parent: "IT 거버넌스(IT-Governance)", aliases: ["COBIT"] },
  // 데이터베이스
  { name: "CRUD 매트릭스", parent: "엔티티(Entity)", aliases: ["CRUD"] },
  // 인공지능·통계
  { name: "과적합·과소적합(Overfitting·Underfitting)", parent: "Dropout", aliases: ["과적합", "과대적합", "과소적합", "Overfitting", "Underfitting"] },
  { name: "경사하강법(Gradient Descent)", parent: "머신러닝 옵티마이저(Optimizer)", aliases: ["경사하강법", "경사 하강법", "Gradient Descent"] },
  { name: "실루엣 계수(Silhouette Coefficient)", parent: "K-평균 알고리즘", aliases: ["실루엣 계수", "실루엣계수", "Silhouette"] },
  { name: "ROC 곡선·AUC", parent: "K-NN(Nearest Neighbor) Classification", aliases: ["ROC", "Receiver Operating Characteristic", "AUC"] },
  { name: "MRC(Machine Reading Comprehension)", parent: "자연어처리(NLP, Natural Language Processing)", aliases: ["MRC", "Machine Reading Comprehension", "기계독해", "기계 독해"] },
  // 운영체제·네트워크
  { name: "선점형·비선점형 스케줄링", parent: "CPU 스케줄링(CPU Scheduling)", aliases: ["선점형 스케줄링", "비선점형 스케줄링", "선점 스케줄링", "비선점 스케줄링", "Preemptive Scheduling", "Non-Preemptive"] },
  { name: "SLAM(Simultaneous Localization and Mapping)", parent: "ISAC(Integrated Sensing and Communication)", aliases: ["SLAM", "Simultaneous Localization and Mapping"] },
  // 2026-10-20 "서브 토픽이 이것밖에 안 된다는 게 말이 안 돼" — 문제은행 전체(기출·NS·모의) 주제부를 교재 표 이름 칸·키워드와 맞춰 더함
  { name: "Mutex·Spin Lock", parent: "경쟁조건(Race Condition) 해결 방안", aliases: ["Mutex", "뮤텍스", "Spin Lock", "스핀락", "스핀 락"] },
  { name: "TLB(Translation Lookaside Buffer)", parent: "직접 사상과 연관 사상 페이징 기법", aliases: ["TLB", "Translation Lookaside Buffer", "변환 색인 버퍼"] },
  { name: "CPU 스케줄링 알고리즘(SJF·SRT·HRN·MLFQ)", parent: "CPU 스케줄링(CPU Scheduling)", aliases: ["SJF", "SRT", "HRN", "MLFQ", "다단계 피드백 큐", "Multi Level Feedback Queue", "Round Robin", "라운드 로빈"] },
  { name: "FPGA", parent: "SDR(Software Defined Radio)", aliases: ["FPGA", "Field Programmable Gate Array"] },
  { name: "GPU·GPGPU", parent: "TPU (Tensor Processing Unit)", aliases: ["GPU", "GPGPU"] },
  { name: "시간 복잡도·공간 복잡도", parent: "알고리즘 성능평가", aliases: ["시간 복잡도", "공간 복잡도", "시간복잡도", "공간복잡도", "Time complexity", "Space complexity"] },
  { name: "분할 정복(Divide and Conquer)", parent: "퀵 정렬(Quick Sort)", aliases: ["분할 정복", "분할정복", "Divide and Conquer"] },
  { name: "BFS·DFS(너비·깊이 우선 탐색)", parent: "그래프 순회(Graph Traversal)", aliases: ["BFS", "DFS", "너비 우선", "깊이 우선"] },
  { name: "데이터 웨어하우스(Data Warehouse)", parent: "데이터(웨어하우스, 레이크, 패브릭, 메시)", aliases: ["데이터 웨어하우스", "데이터웨어하우스", "Data Warehouse"] },
  { name: "데이터 레이크(Data Lake)", parent: "데이터(웨어하우스, 레이크, 패브릭, 메시)", aliases: ["데이터 레이크", "Data Lake"] },
  { name: "ACID", parent: "트랜잭션", aliases: ["ACID"] },
  { name: "타임스탬프 순서 기법(Timestamp Ordering)", parent: "DB 동시성제어", aliases: ["타임스탬프 순서", "타임스탬프 기법", "Timestamp Ordering", "Timestamp ordering"] },
  { name: "조인 기법(Nested Loop·Sort Merge·Hash Join)", parent: "조인(Join)", aliases: ["Nested Loop", "Sort Merge", "Hash Join", "해시 조인", "중첩 루프 조인"] },
  { name: "CRISP-DM·SEMMA", parent: "데이터 마이닝 방법론", aliases: ["CRISP-DM", "SEMMA"] },
  { name: "온톨로지(Ontology)", parent: "메타 데이터와 데이터 카탈로그", aliases: ["Ontology", "온톨로지"] },
  { name: "DataOps", parent: "데이터패브릭(Data Fabric)", aliases: ["DataOps", "데이터옵스"] },
  { name: "소버린 클라우드(Sovereign Cloud)", parent: "데이터 파운드리(Data Foundry)", aliases: ["소버린 클라우드", "Sovereign Cloud"] },
  { name: "재공학·역공학", parent: "3R", aliases: ["재공학", "역공학", "Re-Engineering", "Reverse Engineering"] },
  { name: "정보은닉(Information Hiding)", parent: "객체지향 프로그래밍 특징", aliases: ["정보은닉", "정보 은닉", "Information Hiding"] },
  { name: "코드 스멜(Code Smell)", parent: "소프트웨어 리팩토링", aliases: ["코드 스멜", "Code Smell", "배드 스멜"] },
  { name: "페어 프로그래밍(Pair Programming)", parent: "XP (eXtreme Programming)", aliases: ["페어 프로그래밍", "Pair Programming", "짝 프로그래밍"] },
  { name: "ATAM", parent: "SW Architecture 평가", aliases: ["ATAM"] },
  { name: "변성 테스트(Metamorphic Testing)", parent: "테스트 오라클", aliases: ["변성 테스트", "변성 테스팅", "Metamorphic"] },
  { name: "정보공학 방법론", parent: "소프트웨어 개발 방법론", aliases: ["정보공학 방법론", "정보공학방법론", "Information Engineering"] },
  { name: "자원 평준화·평활화", parent: "자원 최적화", aliases: ["자원 평준화", "자원평준화", "자원 평활화", "Resource Leveling", "Resource Smoothing"] },
  { name: "NPV·IRR", parent: "경제성 분석 기법", aliases: ["NPV", "IRR", "순현재가치", "내부수익률"] },
  { name: "서비스 카탈로그(Service Catalog)", parent: "ITSM(Information Technology Service Management)", aliases: ["서비스 카탈로그", "Service Catalog"] },
  { name: "캐즘(Chasm)", parent: "기술수용 주기(Technology Adoption Life Cycle)", aliases: ["캐즘", "Chasm"] },
  { name: "코호트 분석(Cohort Analysis)", parent: "그로스 해킹(Growth hacking)", aliases: ["코호트", "Cohort"] },
  { name: "트래픽 쉐이핑(Traffic Shaping)", parent: "QoS(Quality of Service)", aliases: ["트래픽 쉐이핑", "트래픽 셰이핑", "Traffic Shaping", "WRED", "Random Early Detection"] },
  { name: "HARQ", parent: "Wi-Fi 7(IEEE 802.11be)", aliases: ["HARQ"] },
  { name: "MOCN·MORAN", parent: "RAN(Radio Access Network) Sharing", aliases: ["MOCN", "MORAN"] },
  { name: "엣지 컴퓨팅(Edge Computing)", parent: "네트워크 지능", aliases: ["엣지 컴퓨팅", "에지 컴퓨팅", "엣지컴퓨팅", "Edge Computing"] },
  { name: "기울기 소실(Vanishing Gradient)", parent: "활성화함수(Activation Function)", aliases: ["기울기 소실", "그래디언트 소실", "Vanishing Gradient"] },
  { name: "Zero-shot·Few-shot", parent: "프롬프트 엔지니어링(Prompt Engineering)", aliases: ["Zero-shot", "Few-shot", "제로샷", "퓨샷", "Zero shot", "Few shot"] },
  { name: "BERT", parent: "자연어처리(NLP, Natural Language Processing)", aliases: ["BERT"] },
  { name: "지도·비지도 학습", parent: "머신러닝 학습방법", aliases: ["지도학습", "지도 학습", "비지도학습", "비지도 학습", "Supervised Learning", "Unsupervised Learning"] },
  { name: "정밀도·재현율·F1-Score", parent: "혼동행렬(Confusion Matrix)", aliases: ["정밀도", "재현율", "F1-Score", "F1 Score", "F1-score"] },
  { name: "MCTS(Monte Carlo Tree Search)", parent: "테스트 타임 스케일링(Test-Time Scaling, TTS)", aliases: ["MCTS", "Monte Carlo Tree Search", "몬테카를로 트리"] },
  { name: "협업 필터링(Collaborative Filtering)", parent: "의도 경제(Intention Economy)", aliases: ["협업 필터링", "Collaborative Filtering"] },
  { name: "추천 시스템(Recommendation System)", parent: "의도 경제(Intention Economy)", aliases: ["추천 시스템", "추천시스템", "Recommendation System", "Recommender"] },
  { name: "Human-in-the-Loop(HITL)", parent: "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)", aliases: ["Human-in-the-Loop", "HITL", "휴먼 인 더 루프"] },
  { name: "잊혀질 권리(Right to be Forgotten)", parent: "머신 언러닝(Machine Unlearning)", aliases: ["잊혀질 권리", "잊힐 권리", "Right to be Forgotten"] },
  { name: "LiDAR(라이다)", parent: "Physical AI", aliases: ["LiDAR", "Lidar", "라이다"] },
  { name: "메타버스(Metaverse)", parent: "Physical AI", aliases: ["메타버스", "Metaverse"] },
  { name: "공간컴퓨팅(Spatial Computing)", parent: "옴니모달(Omni-modal) AI", aliases: ["공간컴퓨팅", "공간 컴퓨팅", "Spatial Computing"] },
  { name: "AI 거버넌스", parent: "ISO/IEC 23894", aliases: ["AI 거버넌스", "인공지능 거버넌스", "AI Governance"] },
  { name: "상관분석·상관계수", parent: "연관성 분석(association analysis) - 기초통계", aliases: ["상관분석", "상관 분석", "상관계수", "상관 계수"] },
  { name: "p-value(유의확률)", parent: "통계적 가설검정(Hypothesis Testing)", aliases: ["p-value", "p값", "유의확률"] },
  { name: "1종 오류·2종 오류", parent: "통계적 가설검정(Hypothesis Testing)", aliases: ["1종 오류", "2종 오류", "제1종 오류", "제2종 오류"] },
  { name: "t-검정(t-test)", parent: "추론 통계(Inferential Statistics)", aliases: ["t-검정", "t검정", "t-test", "t 검정"] },
  { name: "이항·포아송 분포", parent: "확률분포", aliases: ["포아송", "이항 분포", "이항분포", "베르누이"] },
  { name: "카이제곱 분포·검정", parent: "확률분포", aliases: ["카이제곱", "Chi-square", "χ²"] },
  { name: "RBAC·ABAC", parent: "접근 제어/접근 통제(Access Control)", aliases: ["RBAC", "ABAC", "역할 기반 접근", "속성 기반 접근"] },
  { name: "파밍(Pharming)", parent: "DNSSEC(Domain Name System Security Extension)", aliases: ["파밍", "Pharming"] },
  { name: "WAF(웹 방화벽)", parent: "WAAP(Web Application and API Protection)", aliases: ["WAF", "웹 방화벽", "웹방화벽"] },
  { name: "DTLS", parent: "스마트시티 보안취약점 및 대응방안", aliases: ["DTLS"] },
  { name: "사이버 킬체인(Cyber Kill Chain)", parent: "위협 헌팅(Threat Hunting)", aliases: ["킬체인", "킬 체인", "Kill Chain"] },
  { name: "SAML", parent: "OAuth(Open Authorize) 2.0", aliases: ["SAML"] },
  { name: "크리덴셜 스터핑(Credential Stuffing)", parent: "OWASP Top 10:2025", aliases: ["크리덴셜 스터핑", "Credential Stuffing"] },
  { name: "Secure OS(보안 운영체제)", parent: "자율주행 자동차 보안취약점 및 대응방안", aliases: ["Secure OS", "보안 운영체제", "보안운영체제"] },
  { name: "k-익명성·l-다양성·t-근접성", parent: "ISO/IEC 20889", aliases: ["k-익명성", "l-다양성", "L-다양성", "t-근접성", "k-anonymity"] },
  { name: "양자 컴퓨터(Quantum Computer)", parent: "포스트 양자 암호(Post-Quantum Cryptography)", aliases: ["양자 컴퓨터", "양자컴퓨터", "양자 컴퓨팅", "양자컴퓨팅", "Quantum Computer", "Quantum Computing"] },
  { name: "스마트 컨트랙트(Smart Contract)", parent: "블록체인 암호기술 가이드라인", aliases: ["스마트 컨트랙트", "스마트 계약", "스마트계약", "Smart Contract"] },
  { name: "블록체인(Blockchain)", parent: "블록체인 암호기술 가이드라인", aliases: ["블록체인", "Blockchain", "Block chain"] },
  { name: "정보통신망법", parent: "디지털 안전 3법", aliases: ["정보통신망법", "정보통신망 이용촉진"] },
  { name: "RTO·RPO", parent: "BCP (Business Continuity Planning)", aliases: ["RPO", "목표 복구 시점", "목표 복구 시간", "Recovery Time Objective", "Recovery Point Objective"] },
  { name: "멀티 클라우드(Multi Cloud)", parent: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)", aliases: ["멀티 클라우드", "멀티클라우드", "Multi Cloud", "Multi-Cloud", "MultiCloud"] },
  { name: "IaaS·PaaS·SaaS", parent: "지능정보기술 감리 실무 가이드 - 클라우드 감리", aliases: ["IaaS", "PaaS", "SaaS"] },
  { name: "NPU(Neural Processing Unit)", parent: "온디바이스 AI", aliases: ["NPU", "Neural Processing Unit", "신경망 처리 장치"] },
  { name: "로지스틱 회귀(Logistic Regression)", parent: "회귀분석(Regression Analysis)", aliases: ["로지스틱 회귀", "로지스틱회귀", "Logistic Regression"] },
  { name: "저궤도 위성(LEO)", parent: "비지상네트워크(NTN, Non-Terrestrial Networks)", aliases: ["LEO", "저궤도"] },
  { name: "큐잉 기법(WFQ·PQ)", parent: "QoS(Quality of Service)", aliases: ["WFQ", "큐잉", "Queuing", "Weighted Fair Queuing"] },
  { name: "CPI·SPI(성과 지수)", parent: "EVM(Earned Value Management, 획득 가치 관리)", aliases: ["CPI", "TCPI", "원가성과지수", "일정성과지수"] },
  { name: "CI/CD", parent: "데브옵스 (DevOps)", aliases: ["CI/CD", "지속적 통합", "지속적 배포", "지속적 전달", "Continuous Integration", "Continuous Delivery", "Continuous Deployment"] },
];

const BY_NAME = new Map(SUB_TOPICS.map((s) => [s.name, s]));
export const subTopicByName = (name?: string): SubTopic | undefined => (name ? BY_NAME.get(name.trim()) : undefined);
export const subTopicsOf = (parent?: string): SubTopic[] => (parent ? SUB_TOPICS.filter((s) => s.parent === parent) : []);
