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
];

const BY_NAME = new Map(SUB_TOPICS.map((s) => [s.name, s]));
export const subTopicByName = (name?: string): SubTopic | undefined => (name ? BY_NAME.get(name.trim()) : undefined);
export const subTopicsOf = (parent?: string): SubTopic[] => (parent ? SUB_TOPICS.filter((s) => s.parent === parent) : []);
