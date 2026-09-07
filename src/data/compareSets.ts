// 시험 단골 "비교 세트" — 서로 견주며 외우면 좋은 개념들을 나란히 묶었다.
// 각 item.name 은 /explain 의 AI 설명으로 바로 연결된다(데이터 토픽 유무와 무관).
export type CompareItem = { name: string; hint: string };
export type CompareSet = {
  category: string;
  title: string; // 비교 주제
  axis: string; // 무엇을 기준으로 갈리는지 한 줄
  items: CompareItem[];
  /**
   * 출처. "교재"는 심화반 교재 서브노트의 표를 그대로 옮긴 것이고, ref 에 그
   * 서브노트 제목이 있다. 항목 이름·순서·설명이 교재와 같아야 한다 —
   * 시험은 교재 표기로 채점한다. 표시가 없는 세트는 교재 이전에 만든 것이다.
   */
  source?: "교재" | "보조";
  ref?: string;
};

export const compareSets: CompareSet[] = [
  // ─────────────────────────── 소프트웨어공학 ───────────────────────────
  {
    category: "소프트웨어공학",
    title: "SW 개발방법론",
    axis: "무엇을 중심으로 시스템을 나누나",
    items: [
      { name: "구조적 방법론", hint: "기능(프로세스) 중심·DFD" },
      { name: "정보공학(IE) 방법론", hint: "데이터 중심·전사 관점" },
      { name: "객체지향 방법론", hint: "객체(데이터+기능) 캡슐화" },
      { name: "CBD(컴포넌트 기반 개발)", hint: "재사용 컴포넌트 조립" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "SDLC 프로세스 모델",
    axis: "요구 변화 대응 vs 계획·문서 비중",
    items: [
      { name: "폭포수 모델", hint: "순차·문서 많음, 변경 취약" },
      { name: "프로토타입 모델", hint: "시제품으로 요구 확정" },
      { name: "나선형(Spiral) 모델", hint: "위험분석 중심 반복" },
      { name: "반복적·증분형 모델", hint: "기능 조금씩 인도" },
      { name: "RAD 모델", hint: "짧은 기간·CASE 도구" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "애자일 실천법",
    axis: "반복(Sprint) vs 흐름(Flow) vs 기술 실천",
    items: [
      { name: "스크럼(Scrum)", hint: "고정 스프린트·역할" },
      { name: "칸반(Kanban)", hint: "WIP 제한·연속 흐름" },
      { name: "XP(익스트림 프로그래밍)", hint: "TDD·페어·리팩터링" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "아키텍처 스타일",
    axis: "배포 단위·결합도·확장 방식",
    items: [
      { name: "모놀리식 아키텍처", hint: "단일 배포·강결합" },
      { name: "SOA", hint: "ESB 기반 서비스 재사용" },
      { name: "MSA(마이크로서비스)", hint: "독립 배포·느슨한 결합" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "객체지향 4대 특징",
    axis: "OOP를 지탱하는 핵심 개념",
    items: [
      { name: "캡슐화(Encapsulation)", hint: "데이터+기능 은닉" },
      { name: "상속(Inheritance)", hint: "부모 특성 재사용" },
      { name: "다형성(Polymorphism)", hint: "같은 호출·다른 동작" },
      { name: "추상화(Abstraction)", hint: "핵심만 모델링" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "테스트 관점(구조 vs 명세)",
    axis: "내부 구조를 보는가 vs 입출력만 보는가",
    items: [
      { name: "화이트박스 테스트", hint: "코드·경로 커버리지" },
      { name: "블랙박스 테스트", hint: "명세 기반 입출력" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "테스트 단계(V-모델)",
    axis: "무엇을 확인하는 단계인가",
    items: [
      { name: "단위 테스트", hint: "모듈 단위·화이트박스" },
      { name: "통합 테스트", hint: "인터페이스·모듈 결합" },
      { name: "시스템 테스트", hint: "전체·비기능 포함" },
      { name: "인수 테스트", hint: "사용자 요구 충족" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "통합 테스트 방식",
    axis: "어느 방향으로 모듈을 결합하나",
    items: [
      { name: "빅뱅 통합", hint: "한꺼번에·오류 격리 어려움" },
      { name: "하향식 통합", hint: "상위→하위, 스텁 사용" },
      { name: "상향식 통합", hint: "하위→상위, 드라이버 사용" },
      { name: "샌드위치 통합", hint: "상·하향 혼합" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "좋은 모듈 설계",
    axis: "모듈 내부는 강하게, 모듈 간은 약하게",
    items: [
      { name: "응집도(Cohesion)", hint: "높을수록 좋음" },
      { name: "결합도(Coupling)", hint: "낮을수록 좋음" },
    ],
  },
  {
    category: "운영체제",
    title: "CPU 스케줄링 방식",
    axis: "실행 중 CPU를 뺏을 수 있나",
    items: [
      { name: "선점형 스케줄링", hint: "RR·SRT·MLFQ, 응답성↑" },
      { name: "비선점형 스케줄링", hint: "FCFS·SJF·HRN, 문맥교환↓" },
    ],
  },
  {
    category: "운영체제",
    title: "실시간 스케줄링(RM vs EDF)",
    axis: "우선순위를 고정하나 vs 마감으로 정하나",
    items: [
      { name: "RM(Rate Monotonic)", hint: "주기 짧을수록 우선·정적" },
      { name: "EDF(Earliest Deadline First)", hint: "마감 임박 우선·동적" },
    ],
  },
  {
    category: "컴퓨터구조",
    title: "컴퓨터 구조(폰노이만 vs 하버드)",
    axis: "명령·데이터 메모리를 공유하나",
    items: [
      { name: "폰노이만 구조", hint: "메모리 공유·병목 존재" },
      { name: "하버드 구조", hint: "명령·데이터 분리·병렬" },
    ],
  },
  {
    category: "컴퓨터구조",
    title: "병렬처리 Flynn 분류",
    axis: "명령·데이터 스트림 수",
    items: [
      { name: "SISD", hint: "단일 명령·단일 데이터" },
      { name: "SIMD", hint: "단일 명령·다중 데이터(GPU)" },
      { name: "MISD", hint: "다중 명령·단일 데이터(희소)" },
      { name: "MIMD", hint: "다중 명령·다중 데이터" },
    ],
  },
  {
    category: "자료구조",
    title: "탐색 트리(B계열)",
    axis: "데이터·포인터를 어디에 두나",
    items: [
      { name: "B-Tree", hint: "모든 노드에 키·데이터" },
      { name: "B+ Tree", hint: "리프에만 데이터·순차↑" },
      { name: "B* Tree", hint: "노드 사용률↑(2/3)" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "디자인 패턴 3분류(GoF)",
    axis: "무엇을 다루는 패턴인가",
    items: [
      { name: "생성 패턴", hint: "객체 생성(싱글턴·팩토리)" },
      { name: "구조 패턴", hint: "구조 결합(어댑터·프록시)" },
      { name: "행위 패턴", hint: "책임·소통(옵서버·전략)" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "SW 규모·비용 산정",
    axis: "무엇을 근거로 규모를 재나",
    items: [
      { name: "LOC 기법", hint: "코드 라인 수·주관적" },
      { name: "기능점수(FP)", hint: "기능 관점·언어 무관" },
      { name: "COCOMO", hint: "LOC 기반 수학적 모델" },
    ],
  },
  {
    category: "소프트웨어공학",
    title: "유지보수 3R",
    axis: "기존 자산을 어떻게 다루나",
    items: [
      { name: "재사용(Reuse)", hint: "기존 모듈 활용" },
      { name: "역공학(Reverse)", hint: "코드→설계 복원" },
      { name: "재공학(Re-engineering)", hint: "재구조화·현대화" },
    ],
  },

  // ─────────────────────────── 데이터베이스 ───────────────────────────
  {
    category: "데이터베이스",
    title: "정규화 vs 반정규화",
    axis: "무결성 vs 조회 성능",
    items: [
      { name: "정규화(Normalization)", hint: "중복 제거·이상현상 방지" },
      { name: "반정규화(De-normalization)", hint: "중복 허용·조인 감소" },
    ],
  },
  {
    category: "데이터베이스",
    title: "정규형 단계(1NF~BCNF)",
    axis: "어떤 종속성을 제거하나",
    items: [
      { name: "제1정규형(1NF)", hint: "원자값" },
      { name: "제2정규형(2NF)", hint: "부분함수 종속 제거" },
      { name: "제3정규형(3NF)", hint: "이행함수 종속 제거" },
      { name: "BCNF", hint: "결정자=후보키" },
    ],
  },
  {
    category: "데이터베이스",
    title: "RDB vs NoSQL",
    axis: "스키마·확장·일관성(CAP)",
    items: [
      { name: "관계형 DB(RDBMS)", hint: "정형 스키마·ACID" },
      { name: "NoSQL", hint: "유연 스키마·수평확장·BASE" },
    ],
  },
  {
    category: "데이터베이스",
    title: "DBMS 유형(관계·객체)",
    axis: "객체 개념을 얼마나 수용하나",
    items: [
      { name: "RDBMS", hint: "관계형·정형" },
      { name: "OODBMS", hint: "객체 저장·복잡 데이터" },
      { name: "ORDBMS", hint: "관계형+객체 확장" },
    ],
  },
  {
    category: "데이터베이스",
    title: "NoSQL 데이터 모델",
    axis: "무엇을 단위로 저장하나",
    items: [
      { name: "키-값 저장소", hint: "단순·빠름(Redis)" },
      { name: "문서 DB", hint: "JSON 문서(MongoDB)" },
      { name: "칼럼 패밀리", hint: "칼럼 기반(Cassandra)" },
      { name: "그래프 DB", hint: "관계 탐색(Neo4j)" },
    ],
  },
  {
    category: "데이터베이스",
    title: "OLTP vs OLAP",
    axis: "실시간 거래 처리 vs 대량 분석",
    items: [
      { name: "OLTP", hint: "짧은 트랜잭션·정규화" },
      { name: "OLAP", hint: "집계·다차원 분석·비정규화" },
    ],
  },
  {
    category: "데이터베이스",
    title: "SQL 언어 분류",
    axis: "무엇을 하는 명령인가",
    items: [
      { name: "DDL", hint: "정의(CREATE·ALTER·DROP)" },
      { name: "DML", hint: "조작(SELECT·INSERT·UPDATE)" },
      { name: "DCL", hint: "제어(GRANT·REVOKE)" },
      { name: "TCL", hint: "트랜잭션(COMMIT·ROLLBACK)" },
    ],
  },
  {
    category: "데이터베이스",
    title: "동시성 제어(락 방식)",
    axis: "충돌을 미리 막나 vs 커밋 시 검증하나",
    items: [
      { name: "비관적 락(2PL)", hint: "선점 잠금·대기" },
      { name: "낙관적 검증", hint: "버전 검증·롤백" },
      { name: "MVCC", hint: "다중 버전·읽기 무대기" },
    ],
  },
  {
    category: "데이터베이스",
    title: "트랜잭션 격리수준",
    axis: "동시성 이상현상을 어디까지 막나",
    items: [
      { name: "Read Uncommitted", hint: "Dirty Read 허용" },
      { name: "Read Committed", hint: "Dirty Read 방지" },
      { name: "Repeatable Read", hint: "Non-repeatable 방지" },
      { name: "Serializable", hint: "Phantom까지 방지·직렬" },
    ],
  },
  {
    category: "데이터베이스",
    title: "DB 회복 기법",
    axis: "무엇으로 복구 정보를 남기나",
    items: [
      { name: "로그 기반 회복", hint: "REDO·UNDO 로그" },
      { name: "체크포인트", hint: "회복 범위 축소" },
      { name: "그림자 페이징", hint: "페이지 복제·로그 불요" },
    ],
  },
  {
    category: "데이터베이스",
    title: "인덱스 유형",
    axis: "물리 정렬·저장 구조",
    items: [
      { name: "클러스터형 인덱스", hint: "물리 정렬·테이블당 1개" },
      { name: "비클러스터형 인덱스", hint: "별도 구조·다수 가능" },
      { name: "비트맵 인덱스", hint: "낮은 카디널리티·DW" },
    ],
  },
  {
    category: "데이터베이스",
    title: "DW 스키마(Star vs Snowflake)",
    axis: "차원 테이블 정규화 여부",
    items: [
      { name: "스타 스키마", hint: "비정규화·조회 빠름" },
      { name: "스노우플레이크 스키마", hint: "차원 정규화·저장 절약" },
    ],
  },
  {
    category: "데이터베이스",
    title: "확장 기법(파티셔닝 vs 샤딩)",
    axis: "한 DB 안 분할 vs 여러 DB로 분산",
    items: [
      { name: "파티셔닝(Partitioning)", hint: "단일 DB 내 테이블 분할" },
      { name: "샤딩(Sharding)", hint: "여러 노드로 수평 분산" },
    ],
  },
  {
    category: "데이터베이스",
    title: "CAP vs PACELC",
    axis: "분산 DB의 트레이드오프 모델",
    items: [
      { name: "CAP 이론", hint: "일관성·가용성·분단내성 중 2" },
      { name: "PACELC", hint: "분단 아닐 때 지연 vs 일관성" },
    ],
  },
  {
    category: "데이터베이스",
    title: "빅데이터 처리(Hadoop vs Spark)",
    axis: "디스크 기반 vs 인메모리",
    items: [
      { name: "Hadoop MapReduce", hint: "디스크·배치·안정" },
      { name: "Apache Spark", hint: "인메모리·빠름·스트리밍" },
    ],
  },
  {
    category: "데이터베이스",
    title: "빅데이터 아키텍처(Lambda vs Kappa)",
    axis: "배치+실시간 vs 실시간 단일",
    items: [
      { name: "람다 아키텍처", hint: "배치+스피드 이중 경로" },
      { name: "카파 아키텍처", hint: "스트림 단일 경로·단순" },
    ],
  },

  // ─────────────────────────── 네트워크 ───────────────────────────
  {
    category: "네트워크",
    title: "참조 모델(OSI vs TCP/IP)",
    axis: "7계층 이론 vs 4계층 실무",
    items: [
      { name: "OSI 7계층", hint: "표준·계층별 역할 명확" },
      { name: "TCP/IP 4계층", hint: "인터넷 실제 구현" },
    ],
  },
  {
    category: "네트워크",
    title: "TCP vs UDP",
    axis: "신뢰성 vs 속도",
    items: [
      { name: "TCP", hint: "연결형·순서보장·재전송" },
      { name: "UDP", hint: "비연결·빠름·손실 허용" },
    ],
  },
  {
    category: "네트워크",
    title: "스위치 계층(L2~L7)",
    axis: "무엇을 보고 스위칭하나",
    items: [
      { name: "L2 스위치", hint: "MAC 주소 기반" },
      { name: "L3 스위치", hint: "IP·라우팅 기능" },
      { name: "L4 스위치", hint: "포트·부하분산" },
      { name: "L7 스위치", hint: "URL·콘텐츠 기반" },
    ],
  },
  {
    category: "네트워크",
    title: "동적 라우팅 방식",
    axis: "이웃 거리 vs 전체 지도",
    items: [
      { name: "거리 벡터(RIP)", hint: "홉 수·주기 광고" },
      { name: "링크 상태(OSPF)", hint: "전체 토폴로지·SPF" },
      { name: "경로 벡터(BGP)", hint: "AS 간·경로 속성" },
    ],
  },
  {
    category: "네트워크",
    title: "IPv4 vs IPv6",
    axis: "주소 길이·보안·자동설정",
    items: [
      { name: "IPv4", hint: "32비트·주소 고갈·NAT" },
      { name: "IPv6", hint: "128비트·IPSec 내장·자동설정" },
    ],
  },
  {
    category: "네트워크",
    title: "전송(캐스트) 방식",
    axis: "누구에게 보내나",
    items: [
      { name: "유니캐스트", hint: "1:1" },
      { name: "멀티캐스트", hint: "1:그룹" },
      { name: "브로드캐스트", hint: "1:전체" },
      { name: "애니캐스트", hint: "1:가장 가까운 하나" },
    ],
  },
  {
    category: "네트워크",
    title: "교환 방식(회선 vs 패킷)",
    axis: "전용 경로 vs 분할 전송",
    items: [
      { name: "회선 교환", hint: "전용 회선·지연 일정" },
      { name: "패킷 교환", hint: "분할·공유·효율" },
    ],
  },
  {
    category: "네트워크",
    title: "매체 접근 제어(CD vs CA)",
    axis: "충돌을 감지하나 vs 회피하나",
    items: [
      { name: "CSMA/CD", hint: "유선·충돌 감지" },
      { name: "CSMA/CA", hint: "무선·충돌 회피" },
    ],
  },
  {
    category: "네트워크",
    title: "오류 제어(FEC vs BEC)",
    axis: "스스로 정정 vs 재전송 요청",
    items: [
      { name: "FEC(전진 오류정정)", hint: "수신측 정정·재전송 없음" },
      { name: "BEC(후진, ARQ)", hint: "재전송 요구·오버헤드" },
    ],
  },
  {
    category: "네트워크",
    title: "ARQ 재전송 기법",
    axis: "무엇을 다시 보내나",
    items: [
      { name: "Stop-and-Wait", hint: "1개씩·비효율" },
      { name: "Go-Back-N", hint: "오류 이후 전부 재전송" },
      { name: "Selective Repeat", hint: "오류 프레임만 재전송" },
    ],
  },
  {
    category: "네트워크",
    title: "QoS 모델(IntServ vs DiffServ)",
    axis: "흐름별 예약 vs 클래스별 처리",
    items: [
      { name: "IntServ", hint: "RSVP·흐름별 예약·확장성↓" },
      { name: "DiffServ", hint: "DSCP·클래스 구분·확장성↑" },
    ],
  },
  {
    category: "네트워크",
    title: "저전력 광역 IoT(LPWAN)",
    axis: "대역·비면허 여부",
    items: [
      { name: "LoRa", hint: "비면허·장거리·저속" },
      { name: "SigFox", hint: "초협대역·초저전력" },
      { name: "NB-IoT", hint: "면허(LTE)·안정" },
      { name: "LTE-M", hint: "면허·중속·이동성" },
    ],
  },
  {
    category: "네트워크",
    title: "근거리 무선(WPAN)",
    axis: "거리·속도·용도",
    items: [
      { name: "블루투스", hint: "10m·기기 연결" },
      { name: "지그비(Zigbee)", hint: "저속·저전력·센서망" },
      { name: "UWB", hint: "초광대역·정밀 측위" },
      { name: "NFC", hint: "10cm·태그·결제" },
    ],
  },
  {
    category: "네트워크",
    title: "SDN vs NFV",
    axis: "제어 분리 vs 기능 가상화",
    items: [
      { name: "SDN", hint: "제어·데이터 평면 분리" },
      { name: "NFV", hint: "네트워크 기능 SW 가상화" },
    ],
  },
  {
    category: "네트워크",
    title: "다중화(Multiplexing)",
    axis: "무엇으로 채널을 나누나",
    items: [
      { name: "FDM", hint: "주파수 분할" },
      { name: "TDM", hint: "시간 분할" },
      { name: "WDM", hint: "파장 분할(광)" },
    ],
  },

  // ─────────────────────────── 보안 ───────────────────────────
  {
    category: "보안",
    title: "대칭키 vs 비대칭키",
    axis: "속도 vs 키 관리·부인방지",
    items: [
      { name: "대칭키 암호화(AES)", hint: "빠름·키 배포 문제" },
      { name: "비대칭키 암호화(RSA)", hint: "공개/개인키·느림·서명" },
    ],
  },
  {
    category: "보안",
    title: "블록 vs 스트림 암호",
    axis: "묶어서 vs 비트 단위로",
    items: [
      { name: "블록 암호", hint: "고정 블록·AES·DES" },
      { name: "스트림 암호", hint: "비트/바이트·빠름·RC4" },
    ],
  },
  {
    category: "보안",
    title: "해시 vs 암호화 vs 인코딩",
    axis: "복호 가능한가·목적이 뭔가",
    items: [
      { name: "해시(Hash)", hint: "단방향·무결성" },
      { name: "암호화(Encryption)", hint: "양방향·기밀성" },
      { name: "인코딩(Encoding)", hint: "형식 변환·보안 아님" },
    ],
  },
  {
    category: "보안",
    title: "IDS vs IPS",
    axis: "탐지·경보 vs 실시간 차단",
    items: [
      { name: "IDS(침입탐지)", hint: "탐지·알림·우회 경로" },
      { name: "IPS(침입방지)", hint: "인라인·즉시 차단" },
    ],
  },
  {
    category: "보안",
    title: "침입탐지 방식",
    axis: "알려진 패턴 vs 정상 이탈",
    items: [
      { name: "오용(시그니처) 탐지", hint: "알려진 패턴·오탐↓·미탐↑" },
      { name: "이상(행위) 탐지", hint: "정상 이탈·신종 대응·오탐↑" },
    ],
  },
  {
    category: "보안",
    title: "인증 vs 인가",
    axis: "너 누구야 vs 뭘 할 수 있어",
    items: [
      { name: "인증(Authentication)", hint: "신원 확인" },
      { name: "인가(Authorization)", hint: "권한 부여·접근 허용" },
    ],
  },
  {
    category: "보안",
    title: "접근통제 모델",
    axis: "누가 권한을 정하나",
    items: [
      { name: "DAC(임의적)", hint: "소유자가 결정" },
      { name: "MAC(강제적)", hint: "보안등급·정책 강제" },
      { name: "RBAC(역할기반)", hint: "역할에 권한 부여" },
      { name: "ABAC(속성기반)", hint: "속성 조합·동적" },
    ],
  },
  {
    category: "보안",
    title: "보안 모델(기밀 vs 무결)",
    axis: "무엇을 지키는 모델인가",
    items: [
      { name: "Bell-LaPadula", hint: "기밀성·No Read Up/No Write Down" },
      { name: "Biba", hint: "무결성·No Write Up/No Read Down" },
      { name: "Clark-Wilson", hint: "무결성·잘 구성된 트랜잭션" },
    ],
  },
  {
    category: "보안",
    title: "사용자 인증 유형",
    axis: "무엇으로 본인을 증명하나",
    items: [
      { name: "지식 기반", hint: "비밀번호·PIN" },
      { name: "소유 기반", hint: "OTP·스마트카드" },
      { name: "존재(생체) 기반", hint: "지문·홍채·얼굴" },
      { name: "행위 기반", hint: "서명·걸음걸이" },
    ],
  },
  {
    category: "보안",
    title: "악성코드 유형",
    axis: "자기복제·숙주 여부",
    items: [
      { name: "바이러스", hint: "숙주 필요·감염" },
      { name: "웜(Worm)", hint: "자기복제·네트워크 전파" },
      { name: "트로이 목마", hint: "정상 위장·복제 안 함" },
    ],
  },
  {
    category: "보안",
    title: "사회공학 피싱 변종",
    axis: "무슨 매체·수법을 쓰나",
    items: [
      { name: "피싱(Phishing)", hint: "가짜 메일·사이트" },
      { name: "파밍(Pharming)", hint: "DNS 변조·정상주소" },
      { name: "스미싱(Smishing)", hint: "문자 메시지·URL" },
      { name: "큐싱(Qshing)", hint: "악성 QR코드" },
    ],
  },
  {
    category: "보안",
    title: "악성코드 분석(정적 vs 동적)",
    axis: "실행하지 않고 vs 실행하며",
    items: [
      { name: "정적 분석", hint: "코드·시그니처·미실행" },
      { name: "동적 분석", hint: "샌드박스 실행·행위 관찰" },
    ],
  },
  {
    category: "보안",
    title: "망분리(물리 vs 논리)",
    axis: "물리 분리 vs 가상 분리",
    items: [
      { name: "물리적 망분리", hint: "PC·회선 이중화·안전·고비용" },
      { name: "논리적 망분리", hint: "가상화·유연·저비용" },
    ],
  },
  {
    category: "보안",
    title: "터널링 보안(SSL/TLS vs IPSec)",
    axis: "어느 계층에서 보호하나",
    items: [
      { name: "SSL/TLS", hint: "전송~응용·웹·SSL VPN" },
      { name: "IPSec", hint: "네트워크 계층·IPSec VPN" },
    ],
  },
  {
    category: "보안",
    title: "콘텐츠 보호(워터마킹 vs 핑거프린팅)",
    axis: "소유권 vs 구매자 추적",
    items: [
      { name: "워터마킹", hint: "저작권 정보 삽입" },
      { name: "핑거프린팅", hint: "구매자별 정보·불법유통 추적" },
      { name: "스테가노그래피", hint: "존재 자체 은닉" },
    ],
  },
  {
    category: "보안",
    title: "위험 분석 기법",
    axis: "수치화하나 vs 서술하나",
    items: [
      { name: "정량적 분석", hint: "손실액·ALE 계산·객관" },
      { name: "정성적 분석", hint: "등급·시나리오·주관" },
    ],
  },
  {
    category: "보안",
    title: "개인정보 비식별(가명 vs 익명)",
    axis: "재식별 가능성",
    items: [
      { name: "가명처리", hint: "추가정보로 재식별 가능" },
      { name: "익명처리", hint: "재식별 불가·복원 불가" },
    ],
  },

  // ─────────────────────────── 인공지능 ───────────────────────────
  {
    category: "인공지능",
    title: "거리 공식(Distance Formula)",
    axis: "무엇을 재나 — 수치·분포·방향·집합·문자열",
    items: [
      { name: "유클리드 거리(Euclidean Distance)", hint: "직선 거리(L2)·정규화 선행" },
      { name: "맨해튼 거리(Manhattan Distance)", hint: "격자 합(L1)·이상치 둔감" },
      { name: "민코프스키 거리(Minkowski Distance)", hint: "p로 일반화(Lp)" },
      { name: "체비셰프 거리(Chebyshev Distance)", hint: "최대 성분(L∞)·체스 킹" },
      { name: "마할라노비스 거리(Mahalanobis Distance)", hint: "공분산 보정·이상치 탐지" },
      { name: "코사인 유사도(Cosine Similarity)", hint: "각도·문서/임베딩" },
      { name: "자카드 유사도(Jaccard Similarity)", hint: "교집합/합집합·추천" },
      { name: "해밍 거리(Hamming Distance)", hint: "같은 길이·다른 자리 수" },
      { name: "편집 거리(Edit Distance, Levenshtein)", hint: "삽입·삭제·교체 최소 횟수" },
    ],
  },
  {
    category: "인공지능",
    title: "머신러닝 학습 유형",
    axis: "정답(라벨)이 있나·보상으로 배우나",
    items: [
      { name: "지도학습", hint: "라벨 있음·분류/회귀" },
      { name: "비지도학습", hint: "라벨 없음·군집·차원축소" },
      { name: "강화학습", hint: "보상·시행착오" },
      { name: "자기지도학습", hint: "데이터 자체로 라벨 생성" },
    ],
  },
  {
    category: "인공지능",
    title: "딥러닝 신경망",
    axis: "공간(이미지) vs 순서(시퀀스) vs 어텐션",
    items: [
      { name: "CNN", hint: "이미지·합성곱·특징추출" },
      { name: "RNN", hint: "시계열·순차·장기의존 약점" },
      { name: "트랜스포머(Transformer)", hint: "셀프 어텐션·병렬" },
    ],
  },
  {
    category: "인공지능",
    title: "순환신경망 개선(RNN·LSTM·GRU)",
    axis: "장기 의존성을 어떻게 다루나",
    items: [
      { name: "RNN", hint: "기본·기울기 소실" },
      { name: "LSTM", hint: "게이트 3개·셀 상태" },
      { name: "GRU", hint: "게이트 2개·경량·빠름" },
    ],
  },
  {
    category: "인공지능",
    title: "머신러닝 vs 딥러닝",
    axis: "특징을 사람이 vs 스스로",
    items: [
      { name: "머신러닝", hint: "특징 수작업·데이터 적음" },
      { name: "딥러닝", hint: "특징 자동학습·데이터·연산 많이" },
    ],
  },
  {
    category: "인공지능",
    title: "앙상블 기법",
    axis: "병렬로 분산 낮추기 vs 순차로 편향 줄이기",
    items: [
      { name: "배깅(Bagging)", hint: "병렬·분산↓·랜덤포레스트" },
      { name: "부스팅(Boosting)", hint: "순차·편향↓·XGBoost" },
      { name: "스태킹(Stacking)", hint: "메타모델로 결합" },
    ],
  },
  {
    category: "인공지능",
    title: "지도학습 문제 유형",
    axis: "무엇을 예측하나",
    items: [
      { name: "분류(Classification)", hint: "이산 범주 예측" },
      { name: "회귀(Regression)", hint: "연속 값 예측" },
    ],
  },
  {
    category: "인공지능",
    title: "분류 알고리즘",
    axis: "무엇을 기준으로 나누나",
    items: [
      { name: "SVM", hint: "최대 마진 초평면" },
      { name: "KNN", hint: "가까운 K개 다수결" },
      { name: "의사결정나무", hint: "규칙 분기·해석 쉬움" },
      { name: "나이브 베이즈", hint: "확률·독립 가정" },
    ],
  },
  {
    category: "인공지능",
    title: "군집(Clustering) 기법",
    axis: "군집 수·모양 가정",
    items: [
      { name: "K-평균(K-means)", hint: "K 지정·구형 군집" },
      { name: "DBSCAN", hint: "밀도 기반·K 불필요·잡음" },
      { name: "계층적 군집", hint: "덴드로그램·병합/분할" },
    ],
  },
  {
    category: "인공지능",
    title: "차원 축소",
    axis: "선형 vs 비선형·용도",
    items: [
      { name: "PCA(주성분분석)", hint: "선형·분산 최대 축" },
      { name: "t-SNE", hint: "비선형·시각화" },
      { name: "오토인코더", hint: "신경망·잠재표현" },
    ],
  },
  {
    category: "인공지능",
    title: "생성 모델(GAN·VAE·Diffusion)",
    axis: "어떻게 데이터를 생성하나",
    items: [
      { name: "GAN", hint: "생성자·판별자 경쟁" },
      { name: "VAE", hint: "잠재분포·인코더·디코더" },
      { name: "확산 모델(Diffusion)", hint: "노이즈 제거 복원·고품질" },
    ],
  },
  {
    category: "인공지능",
    title: "분류 성능 지표",
    axis: "무엇을 강조하는 지표인가",
    items: [
      { name: "정밀도(Precision)", hint: "예측 양성 중 실제 양성" },
      { name: "재현율(Recall)", hint: "실제 양성 중 맞춘 비율" },
      { name: "F1-Score", hint: "정밀도·재현율 조화평균" },
    ],
  },
  {
    category: "인공지능",
    title: "활성화 함수",
    axis: "어디에·왜 쓰나",
    items: [
      { name: "Sigmoid", hint: "0~1·이진·기울기 소실" },
      { name: "ReLU", hint: "은닉층·연산 간단·소실 완화" },
      { name: "Softmax", hint: "출력층·다중분류 확률" },
    ],
  },
  {
    category: "인공지능",
    title: "과적합(Overfitting) 대응",
    axis: "어떻게 일반화를 높이나",
    items: [
      { name: "드롭아웃", hint: "뉴런 임의 제거" },
      { name: "정규화(L1/L2)", hint: "가중치 penalty" },
      { name: "조기 종료", hint: "검증 손실 상승 시 중단" },
    ],
  },
  {
    category: "인공지능",
    title: "LLM 적용(RAG vs 파인튜닝)",
    axis: "외부 지식 검색 vs 모델 재학습",
    items: [
      { name: "RAG", hint: "검색+생성·최신 지식·저비용" },
      { name: "파인튜닝(Fine-tuning)", hint: "가중치 갱신·도메인 특화" },
      { name: "프롬프트 엔지니어링", hint: "학습 없이 지시로 유도" },
    ],
  },
  {
    category: "인공지능",
    title: "경량 파인튜닝(PEFT)",
    axis: "무엇만 학습하나",
    items: [
      { name: "Full Fine-tuning", hint: "전체 파라미터·비용↑" },
      { name: "LoRA", hint: "저랭크 행렬만·경량" },
      { name: "프롬프트 튜닝", hint: "소프트 프롬프트만 학습" },
    ],
  },
  {
    category: "인공지능",
    title: "판별형 vs 생성형 AI",
    axis: "경계를 나누나 vs 새로 만드나",
    items: [
      { name: "판별형 AI", hint: "분류·경계 학습" },
      { name: "생성형 AI", hint: "분포 학습·새 데이터 생성" },
    ],
  },

  // ─────────────────────────── 디지털서비스 ───────────────────────────
  {
    category: "디지털서비스",
    title: "클라우드 서비스 모델",
    axis: "어디까지 제공자가 관리하나",
    items: [
      { name: "IaaS", hint: "인프라 제공·OS부터 내가" },
      { name: "PaaS", hint: "플랫폼 제공·앱만 개발" },
      { name: "SaaS", hint: "완성 SW·바로 사용" },
    ],
  },
  {
    category: "디지털서비스",
    title: "클라우드 배포 모델",
    axis: "누가 소유·운영하나",
    items: [
      { name: "퍼블릭 클라우드", hint: "공용·확장·저비용" },
      { name: "프라이빗 클라우드", hint: "전용·보안·통제" },
      { name: "하이브리드 클라우드", hint: "공용+전용 혼합" },
    ],
  },
  {
    category: "디지털서비스",
    title: "가상화 방식(VM vs 컨테이너)",
    axis: "OS 통째 vs 프로세스 격리",
    items: [
      { name: "가상머신(VM)", hint: "하이퍼바이저·게스트 OS·무거움" },
      { name: "컨테이너(Docker)", hint: "OS 커널 공유·가벼움·빠름" },
    ],
  },
  {
    category: "디지털서비스",
    title: "하이퍼바이저 유형",
    axis: "하드웨어 직접 vs OS 위",
    items: [
      { name: "Type1(베어메탈)", hint: "HW 직접·성능·서버" },
      { name: "Type2(호스티드)", hint: "호스트 OS 위·데스크톱" },
    ],
  },
  {
    category: "디지털서비스",
    title: "실감기술(AR·VR·MR·XR)",
    axis: "현실과 가상을 얼마나 섞나",
    items: [
      { name: "VR(가상현실)", hint: "완전 가상·몰입" },
      { name: "AR(증강현실)", hint: "현실+가상 정보 오버레이" },
      { name: "MR(혼합현실)", hint: "현실·가상 상호작용" },
      { name: "XR(확장현실)", hint: "AR·VR·MR 총칭" },
    ],
  },
  {
    category: "디지털서비스",
    title: "웹 서비스 API(REST·SOAP·GraphQL)",
    axis: "구조·유연성",
    items: [
      { name: "REST", hint: "자원·HTTP·가벼움" },
      { name: "SOAP", hint: "XML·엄격·WS-Security" },
      { name: "GraphQL", hint: "필요한 필드만·단일 엔드포인트" },
    ],
  },
  {
    category: "디지털서비스",
    title: "블록체인 유형",
    axis: "누가 참여·검증하나",
    items: [
      { name: "퍼블릭 블록체인", hint: "누구나·완전 분산" },
      { name: "프라이빗 블록체인", hint: "허가된 자만·빠름" },
      { name: "컨소시엄 블록체인", hint: "협의체·반중앙" },
    ],
  },
  {
    category: "디지털서비스",
    title: "합의 알고리즘",
    axis: "무엇으로 신뢰를 만드나",
    items: [
      { name: "PoW(작업증명)", hint: "해시 연산·전력 소모" },
      { name: "PoS(지분증명)", hint: "보유 지분·에너지 절약" },
      { name: "PBFT", hint: "투표·허가형·빠른 확정" },
    ],
  },
  {
    category: "디지털서비스",
    title: "스토리지 연결(DAS·NAS·SAN)",
    axis: "어떻게·무엇 단위로 연결하나",
    items: [
      { name: "DAS", hint: "직접 연결·단순" },
      { name: "NAS", hint: "파일 단위·이더넷" },
      { name: "SAN", hint: "블록 단위·전용망(FC)" },
    ],
  },
  {
    category: "디지털서비스",
    title: "웹 발전(Web 1.0~3.0)",
    axis: "사용자 역할·지능화",
    items: [
      { name: "Web 1.0", hint: "읽기·정적" },
      { name: "Web 2.0", hint: "읽기·쓰기·참여·SNS" },
      { name: "Web 3.0", hint: "시맨틱·지능·탈중앙" },
    ],
  },

  // ─────────────────────────── 프로젝트관리 ───────────────────────────
  {
    category: "프로젝트관리",
    title: "감리 vs PMO",
    axis: "독립적 점검 vs 상시 지원",
    items: [
      { name: "정보시스템 감리", hint: "제3자·독립·시점 점검" },
      { name: "PMO", hint: "내부·상시·프로젝트 지원" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "일정 기법(CPM·PERT·CCM)",
    axis: "시간 추정·제약 관점",
    items: [
      { name: "CPM(주공정법)", hint: "확정 시간·임계경로" },
      { name: "PERT", hint: "3점 추정·확률 일정" },
      { name: "CCM(주공정연쇄)", hint: "자원 제약·버퍼 관리" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "여유시간(Free vs Total Float)",
    axis: "누구에게 영향 없는 여유인가",
    items: [
      { name: "자유 여유(Free Float)", hint: "후행 활동 영향 없음" },
      { name: "총 여유(Total Float)", hint: "프로젝트 종료 영향 없음" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "품질보증 vs 품질통제(QA·QC)",
    axis: "프로세스 vs 결과물",
    items: [
      { name: "품질보증(QA)", hint: "프로세스 준수·예방·감사" },
      { name: "품질통제(QC)", hint: "산출물 검사·결함 발견" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "위험 대응 전략(부정적)",
    axis: "위협을 어떻게 다루나",
    items: [
      { name: "회피(Avoid)", hint: "원인 제거·계획 변경" },
      { name: "전가(Transfer)", hint: "보험·외주로 이전" },
      { name: "완화(Mitigate)", hint: "확률·영향 축소" },
      { name: "수용(Accept)", hint: "받아들이고 대비" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "원가 산정 방식",
    axis: "정밀도·시점",
    items: [
      { name: "유사 산정(하향식)", hint: "과거 유사·빠름·부정확" },
      { name: "모수 산정", hint: "단가×수량·통계" },
      { name: "상향식 산정", hint: "WBS 합산·정밀·시간↑" },
    ],
  },
  {
    category: "프로젝트관리",
    title: "범위 이탈(Scope Creep vs Gold Plating)",
    axis: "누가 요구하지 않았는데 커지나",
    items: [
      { name: "스코프 크리프", hint: "통제 없는 요구 추가" },
      { name: "골드 플레이팅", hint: "개발자 임의 과잉 기능" },
    ],
  },

  // ─────────────────────────── 경영전략 ───────────────────────────
  {
    category: "경영전략",
    title: "기간 시스템(CRM·ERP·SCM)",
    axis: "무엇을 관리하는 시스템인가",
    items: [
      { name: "ERP", hint: "전사 자원·내부 통합" },
      { name: "CRM", hint: "고객 관계·영업·마케팅" },
      { name: "SCM", hint: "공급망·물류·협력사" },
    ],
  },
  {
    category: "경영전략",
    title: "IT 관리 vs 거버넌스",
    axis: "운영 관리 vs 통제·의사결정",
    items: [
      { name: "ITSM/ITIL", hint: "IT 서비스 운영·관리" },
      { name: "COBIT", hint: "IT 거버넌스·통제 프레임워크" },
      { name: "ISO 38500", hint: "IT 거버넌스 국제표준" },
    ],
  },
  {
    category: "경영전략",
    title: "재해복구 목표(RTO·RPO)",
    axis: "얼마나 빨리 vs 얼마나 잃어도 되나",
    items: [
      { name: "RTO(복구 시간 목표)", hint: "언제까지 복구" },
      { name: "RPO(복구 시점 목표)", hint: "데이터 손실 허용 시점" },
    ],
  },
  {
    category: "경영전략",
    title: "시장 규모(TAM·SAM·SOM)",
    axis: "얼마나 넓은 시장인가",
    items: [
      { name: "TAM", hint: "전체 시장" },
      { name: "SAM", hint: "유효 시장(도달 가능)" },
      { name: "SOM", hint: "수익 시장(획득 가능)" },
    ],
  },
  {
    category: "경영전략",
    title: "전략 방향(선도자 vs 추격자)",
    axis: "먼저 진입 vs 빠른 추격",
    items: [
      { name: "선도자(First Mover)", hint: "선점·표준 주도·리스크" },
      { name: "추격자(Fast Follower)", hint: "리스크↓·개선 진입" },
    ],
  },
  {
    category: "경영전략",
    title: "성과 관리(BSC vs OKR)",
    axis: "균형 관점 vs 목표·핵심결과",
    items: [
      { name: "BSC", hint: "재무·고객·프로세스·학습 4관점" },
      { name: "OKR", hint: "도전 목표·핵심결과·주기 짧음" },
    ],
  },
  // ─────────────── 5주차 보강: 데이터베이스 (교재 비교표 기반) ───────────────
  {
    category: "데이터베이스",
    title: "쿼리 오프로딩 vs 샤딩",
    axis: "트랜잭션을 유형별 분리 vs 데이터를 인스턴스로 분할",
    items: [
      { name: "쿼리오프로딩(Query offloading)", hint: "Update/Read 분리·CDC·성능 향상" },
      { name: "데이터베이스 샤딩(Sharding)", hint: "수평 분할·Shard·용량한계 극복" },
    ],
  },
  {
    category: "데이터베이스",
    title: "샤딩 vs 파티셔닝",
    axis: "여러 DB 인스턴스 vs 한 인스턴스 안 분할",
    items: [
      { name: "데이터베이스 샤딩(Sharding)", hint: "별도 서버 분산·Master Node 관리" },
      { name: "데이터베이스 파티셔닝(Partitioning)", hint: "동일 서버·수평/수직·Master 없음" },
    ],
  },
  {
    category: "데이터베이스",
    title: "EDA vs CDA",
    axis: "탐정(가설 도출) vs 판사(가설 검정)",
    items: [
      { name: "탐색적 데이터 분석과 확증적 데이터 분석", hint: "EDA: 시각화 탐색·인사이트 발견" },
      { name: "확증적 데이터 분석(CDA)", hint: "가설 설정 → P-value로 수용/기각" },
    ],
  },
  {
    category: "데이터베이스",
    title: "연관분석 알고리즘 3형제",
    axis: "후보 집합을 어떻게 줄이나",
    items: [
      { name: "Apriori 알고리즘", hint: "후보 생성·최소 지지도·가지치기" },
      { name: "DHP(Direct Hashing & Pruning) 알고리즘", hint: "해시 버킷 count로 후보 축소" },
      { name: "FP(Frequent Pattern)-Growth 알고리즘", hint: "후보 생성 제거·FP-Tree 압축" },
    ],
  },
  {
    category: "데이터베이스",
    title: "데이터 마이닝 방법론",
    axis: "누가 만들었고 몇 단계로 도나",
    items: [
      { name: "KDD", hint: "Fayyad·선택→전처리→변환→마이닝→평가" },
      { name: "SEMMA", hint: "SAS·Sample→Explore→Modify→Model→Assess" },
      { name: "CRISP-DM", hint: "비즈니스 중심·4레벨 6단계" },
    ],
  },
  {
    category: "데이터베이스",
    title: "레이크 vs 웨어하우스 vs 레이크하우스",
    axis: "원본 그대로 vs 정제된 주제지향 vs 결합",
    items: [
      { name: "데이터 레이크", hint: "정형·비정형 원본 통합 보관" },
      { name: "데이터 웨어하우스", hint: "주제지향·시계열·정제 분석" },
      { name: "데이터 레이크하우스(Data Lakehouse)", hint: "둘의 결합·ACID·스키마 관리" },
    ],
  },
  {
    category: "데이터베이스",
    title: "MVCC 구현 두 방식",
    axis: "새 행을 옆에 쓰나, 제자리에 쓰고 과거를 보관하나",
    items: [
      { name: "MGA(Multi Generation Architecture)", hint: "PostgreSQL·새 행 추가·VACUUM" },
      { name: "Rollback Segment", hint: "Oracle·제자리 갱신·이전 이미지 보관" },
    ],
  },
  {
    category: "데이터베이스",
    title: "데이터 가치 평가 vs 기술 가치 평가",
    axis: "무엇의 경제적 가치를 매기나 (접근법은 동일 골격)",
    items: [
      { name: "데이터 가치 평가", hint: "데이터 기본법 14조·경할기 변수" },
      { name: "기술 가치 평가", hint: "기권시사 요인·수원시 접근법" },
    ],
  },

  // ─────────────── 5주차 보강: 경영전략 (교재 비교표 기반) ───────────────
  {
    category: "경영전략",
    title: "OKR vs MBO",
    axis: "도전적 정성 목표 vs 정량 목표 관리",
    items: [
      { name: "OKR", hint: "1970 인텔·KR·Moon-Shot·Bottom-up" },
      { name: "MBO", hint: "1950 드러커·KPI·Roof-Shot·Top-down" },
    ],
  },
  {
    category: "경영전략",
    title: "BSC vs IT-BSC 관점 매핑",
    axis: "기업 성과 4관점 ↔ IT 투자 4관점",
    items: [
      { name: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)", hint: "재무↔기업공헌·고객↔사용자" },
      { name: "IT-BSC", hint: "내부프로세스↔운영·학습성장↔미래지향" },
    ],
  },
  {
    category: "경영전략",
    title: "ISP vs EA/ITA vs ISMP",
    axis: "전사 전략 vs 청사진 vs 단위 사업 상세",
    items: [
      { name: "ISP (Information Strategy Planning)", hint: "전사 정보화 전략·To-Be 로드맵" },
      { name: "EA/ITA", hint: "업무-IT 관계 청사진·참조모델" },
      { name: "ISMP (Information System Master Plan)", hint: "단위 프로젝트·RFP·예산" },
    ],
  },
  {
    category: "경영전략",
    title: "리빙랩 vs S.O.S랩",
    axis: "시민 참여 문제 해결 vs SW 기반 지역 생태계",
    items: [
      { name: "리빙랩(Living Lab), S.O.S랩", hint: "리빙랩: Bottom-up 나선·기탐실평공" },
      { name: "S.O.S랩", hint: "SW 해결·Top-down 병행·조개구실공사" },
    ],
  },
  {
    category: "경영전략",
    title: "BCG vs GE 매트릭스",
    axis: "2축 4분면 vs 다차원 9칸",
    items: [
      { name: "BCG Matrix", hint: "성장률×점유율·별들에게 물어봐" },
      { name: "GE 매트릭스", hint: "산업 매력도×경쟁력·투자/선별/철수" },
    ],
  },
  {
    category: "경영전략",
    title: "주목 경제 vs 의도 경제",
    axis: "시선을 끄나, 의도를 읽나",
    items: [
      { name: "주목 경제(Attention Economy)", hint: "제품 노출·수동적 소비자·Funnel" },
      { name: "의도 경제(Intention Economy)", hint: "의도 파악·능동적 소비자·LLM 추천" },
    ],
  },
  {
    category: "경영전략",
    title: "그로스 해킹 vs 시빅 해킹",
    axis: "기업의 성장 vs 시민의 공공 혁신",
    items: [
      { name: "그로스 해킹(Growth hacking)", hint: "데이터 기반·AARRR 퍼널" },
      { name: "시빅 해킹(Civic Hacking)", hint: "시민 협업·공공데이터·삶의 질" },
    ],
  },
  {
    category: "보안",
    title: "혼돈 vs 확산",
    axis: "값을 바꿔 숨기나, 위치로 퍼뜨리나",
    items: [
      { name: "혼돈(Confusion)", hint: "키-암호문 상관관계 은닉·대치·S-Box" },
      { name: "확산(Diffusion)", hint: "통계 구조 분산·전치·1비트→여러 비트" },
    ],
  },
  {
    category: "보안",
    title: "대칭키 vs 비대칭키 vs 해시",
    axis: "키를 나누나, 쌍으로 두나, 아예 없나",
    items: [
      { name: "대칭키 암호화", hint: "동일 비밀키·빠름·키 공유 필요·AES/DES" },
      { name: "비대칭키 암호화", hint: "공개키-비밀키 쌍·전자서명·RSA/ECC" },
      { name: "단방향 해시", hint: "키 없음·무결성·SHA-256/bcrypt" },
    ],
  },
  {
    category: "보안",
    title: "스트림 암호 vs 블록 암호",
    axis: "비트 단위로 흘리나, 블록으로 자르나",
    items: [
      { name: "스트림 암호", hint: "1비트/1바이트·빠름·에러 파급 적음" },
      { name: "블록 암호", hint: "단위 블록·혼돈성 부여·SPN/Feistel" },
    ],
  },
  {
    category: "보안",
    title: "솔트 vs 페퍼 vs 키 스트레칭",
    axis: "무엇을 더하나, 몇 번 돌리나",
    items: [
      { name: "해시 솔트(Salt)", hint: "사용자별 무작위 값·레인보우 테이블 대응·평문 저장 가능" },
      { name: "페퍼(Pepper)", hint: "전체 동일 값·별도 암호화 보관" },
      { name: "키 스트레칭(Key Stretching)", hint: "해시 N번 반복·무차별 대입 지연" },
    ],
  },
  {
    category: "보안",
    title: "SPN vs Feistel",
    axis: "행렬로 섞나, 반으로 갈라 반복하나",
    items: [
      { name: "SPN", hint: "대체순열구조·4×4 행렬·AES/ARIA" },
      { name: "Feistel(피스텔)", hint: "N/2 분할·R라운드 XOR 반복·DES/SEED" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 아래는 전부 심화반 교재 서브노트의 표를 그대로 옮긴 것이다(source: "교재").
  // 항목 이름은 교재 표기 그대로, 설명은 교재 2열을 줄인 것. ref 가 원본 서브노트다.
  // 교재에 없는 항목을 여기 보태지 않는다 — 시험은 교재 표기로 채점한다.
  // ═══════════════════════════════════════════════════════════════════

  // ─────────────────────────── 운영체제 ───────────────────────────
  {
    category: "운영체제", source: "교재", ref: "커널(Kernel)",
    title: "모놀리틱 커널 vs 마이크로 커널",
    axis: "커널 안에 기능을 얼마나 두나",
    items: [
      { name: "모놀리틱 커널", hint: "VFS·드라이버·IPC·파일시스템·스케줄러·메모리 관리를 모두 커널 안에 · 범용 PC" },
      { name: "마이크로 커널", hint: "기본 IPC·스케줄러·메모리 관리만 커널에, 나머지는 사용자 영역 · 임베디드·FEP" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "커널(Kernel)",
    title: "CPU의 2가지 실행 모드",
    axis: "권한이 어디까지인가",
    items: [
      { name: "운영 모드(user mode)", hint: "사용자 애플리케이션 실행 · 제한된 권한 · 시스템 호출로 커널 기능 사용" },
      { name: "시스템 호출(system call)", hint: "커널 기능을 사용자 프로그램이 쓰게 해 주는 인터페이스" },
      { name: "커널 모드(kernel mode)", hint: "운영체제 기능 수행 · 모든 명령어 실행 가능한 최고 권한" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "스케줄러(Scheduler)",
    title: "스케줄러의 종류",
    axis: "어느 상태 전이를 맡나",
    items: [
      { name: "장기(Long-Term) 스케줄러", hint: "생성(New) → 준비(Ready)" },
      { name: "중기(Medium-Term) 스케줄러", hint: "실행(Run) → 대기(Wait)" },
      { name: "단기(Short-Term) 스케줄러", hint: "준비(Ready) → 실행(Run)" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "스케줄러(Scheduler)",
    title: "스케줄러의 정책 요구 사항",
    axis: "무엇을 좋게 만들려는 정책인가",
    items: [
      { name: "처리량 (Maximum throughput)", hint: "짧은 작업 우선 처리 · 인터럽트 없이 수행" },
      { name: "최소 응답 시간 (Minimum Response time)", hint: "대화형 작업 선수행 · 일괄 처리 작업 후수행" },
      { name: "최소 반환 시간 (Minimum Turnaround time)", hint: "일괄 처리 작업을 선수행" },
      { name: "최소 대기 시간 (Minimum Waiting time)", hint: "사용자 수 감소" },
      { name: "CPU 최대 활용", hint: "CPU 중심의 작업만 수행" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "CPU 스케줄링(CPU Scheduling)",
    title: "선점형 스케줄링(Preemptive Scheduling)",
    axis: "실행 중인 프로세스에서 CPU를 뺏는 알고리즘",
    items: [
      { name: "RR(Round Robin)", hint: "단위시간 동안 CPU 할당, 시간 내 못 끝내면 준비 큐 마지막으로" },
      { name: "SRT(Shortest Remaining Time)", hint: "준비 큐에 처리시간 짧은 프로세스가 오면 선점" },
      { name: "MLQ(Multi Level Queue)", hint: "프로세스를 종류별로 분류, 다수의 큐 · 높은 우선순위가 선점" },
      { name: "MLFQ(Multi Level Feedback Queue)", hint: "큐마다 다른 Time Quantum · 수행시간 길어질수록 낮은 큐로 이동" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "CPU 스케줄링(CPU Scheduling)",
    title: "비선점형 스케줄링(Non-preemptive Scheduling)",
    axis: "한 번 잡은 CPU를 끝날 때까지 놓지 않는 알고리즘",
    items: [
      { name: "Priority", hint: "프로세스에 우선순위 부여, 순위에 따라 CPU 할당" },
      { name: "FCFS(First Come First Served)", hint: "대기 큐에 도착한 순서대로 CPU 할당" },
      { name: "SJF (Shortest Job First)", hint: "준비 큐에서 Burst Time 이 가장 짧은 것을 먼저" },
      { name: "HRN (Highest Response Ratio Next)", hint: "SJF 약점 보완 · 우선순위 = (대기시간 + 실행시간) / 실행시간" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "CPU 스케줄링(CPU Scheduling)",
    title: "호위효과와 기아상태",
    axis: "어느 스케줄링에서 무엇이 밀리나",
    items: [
      { name: "호위효과", hint: "FCFS 에서 선행 프로세스의 긴 수행시간 때문에 뒤에 온 짧은 프로세스가 지연" },
      { name: "기아상태", hint: "우선순위 기반에서 높은 우선순위가 계속 들어와 낮은 우선순위가 무한 대기" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스 상태 전이도",
    title: "프로세스 상태",
    axis: "상태마다 어느 스케줄러가 관여하나",
    items: [
      { name: "생성", hint: "Job Scheduler" },
      { name: "준비", hint: "Job Scheduler" },
      { name: "실행", hint: "Process Scheduler, Dispatcher" },
      { name: "대기", hint: "Process Scheduler" },
      { name: "종료", hint: "Job Scheduler, Process Scheduler" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스 상태 전이도",
    title: "상태 전이별 담당 스케줄러",
    axis: "어느 전이를 누가 일으키는가",
    items: [
      { name: "생성 → 준비 (Admit)", hint: "장기 스케줄러 (Job Scheduler)" },
      { name: "준비 → 실행 (Dispatch)", hint: "단기 스케줄러 (Process Scheduler) + 디스패처" },
      { name: "실행 → 준비 (Timeout)", hint: "단기 스케줄러" },
      { name: "실행 → 대기 (Block)", hint: "스케줄러 아님 — 프로세스 스스로 I/O 요청" },
      { name: "대기 → 준비 (Wake-up)", hint: "스케줄러 아님 — 사건 완료" },
      { name: "준비·대기 ↔ 보류 (Swap)", hint: "중기 스케줄러 (Swapper)" },
      { name: "실행 → 종료 (Exit)", hint: "장기·단기 공통" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "경쟁조건(Race Condition) 해결 방안",
    title: "경쟁조건 발생 원인",
    axis: "무엇이 겹쳐서 결과가 달라지나",
    items: [
      { name: "공유 자원(Shared Resource) 사용", hint: "여러 프로세스·스레드가 같은 변수·메모리·파일에 동시 접근" },
      { name: "비동기적 실행(Asynchronous Execution)", hint: "스케줄러가 스레드를 임의 순서로 실행해 실행 시간에 따라 결과가 다름" },
      { name: "임계 영역(Critical Section) 미보호", hint: "임계 영역에 대한 동기화 처리 부족" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "경쟁조건(Race Condition) 해결 방안",
    title: "소프트웨어 방식 경쟁조건 해결 방안",
    axis: "변수만으로 상호배제를 만드는 알고리즘",
    items: [
      { name: "데커(Dekker) 알고리즘", hint: "프로세스 2개일 때 상호 배제하는 최초 알고리즘 · flag 와 turn" },
      { name: "피터슨(Peterson) 알고리즘", hint: "데커와 같이 flag·turn 사용 · 상대에게 진입 기회를 양보" },
      { name: "램포트(Lamport) bakery 알고리즘", hint: "분산 환경에 유용 · 번호표를 받고 낮은 번호부터 실행" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "경쟁조건(Race Condition) 해결 방안",
    title: "하드웨어 방식 경쟁조건 해결 방안",
    axis: "원자적 명령으로 상호배제를 만드는 방법",
    items: [
      { name: "Test & Set", hint: "하나의 원자적 연산으로 메모리 값을 테스트하고 설정" },
      { name: "Compare & Swap", hint: "원자적으로 값을 비교해 예상값과 같을 때만 새 값으로 교체" },
      { name: "인터럽트 금지", hint: "문제 구간에서 인터럽트를 disable · 원자성 확보" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "경쟁조건(Race Condition) 해결 방안",
    title: "동기화 방식 경쟁조건 해결 방안",
    axis: "운영체제·언어가 제공하는 동기화 도구",
    items: [
      { name: "세마포어", hint: "P 연산·V 연산으로 동기화 · Binary, Count 세마포어" },
      { name: "모니터", hint: "고수준 동기화 · 프로그래밍 언어가 지원해야 사용 가능" },
      { name: "Spin Lock", hint: "임계 영역 진입이 안 되면 될 때까지 루프를 돌며 재시도" },
      { name: "Mutex", hint: "동기화 대상이 하나인 경우 상호 배제를 보장" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "경쟁조건(Race Condition) 해결 방안",
    title: "임계영역 해결을 위한 세가지 요건",
    axis: "동기화 기법이 반드시 만족해야 하는 조건",
    items: [
      { name: "상호 배제", hint: "한 프로세스가 임계영역에 있으면 다른 프로세스는 진입 불가" },
      { name: "진행", hint: "임계영역이 비었으면 진입하려는 프로세스를 미루면 안 됨" },
      { name: "한계 대기", hint: "한 번 들어갔던 프로세스는 다시 들어갈 때 제한 (기아 방지)" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "세마포어(Semaphore)",
    title: "세마포어(Semaphore) 연산의 종류",
    axis: "연산이 임계영역에서 무엇을 하나",
    items: [
      { name: "초기화 연산", hint: "Initialize" },
      { name: "P 연산", hint: "Wait · 임계영역 진입" },
      { name: "V 연산", hint: "Signal · 임계영역 탈출" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "세마포어(Semaphore)",
    title: "이진 세마포어 vs 계수형 세마포어",
    axis: "값의 범위와 지원하는 자원 수",
    items: [
      { name: "이진 세마포어(Binary Semaphore)", hint: "값 0 또는 1 · 단일 공유 자원의 상호 배제" },
      { name: "계수형 세마포어(Counting Semaphore)", hint: "값 0 이상 정수 · 여러 개의 동일 자원 접근 제어" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "세마포어(Semaphore)",
    title: "세마포어와 모니터의 비교",
    axis: "누가 제공하고 무엇을 보완하나",
    items: [
      { name: "세마포어", hint: "OS·개발자 주체 · Binary/Counting · P, V 연산으로 구현" },
      { name: "모니터", hint: "프로그래밍 언어 수준 · 한 시점에 하나만 내부 수행 · JAVA synchronized" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "교착상태(Deadlock)",
    title: "교착 상태 발생 조건",
    axis: "넷이 동시에 성립해야 교착이 생긴다",
    items: [
      { name: "상호 배제 (Mutual Exclusion)", hint: "필요한 자원에 대한 배타적 통제권 요구" },
      { name: "점유 대기 (Hold and wait)", hint: "자원을 배타적으로 점유한 채 다른 자원이 해제되기를 대기" },
      { name: "비선점 (Non-preemption)", hint: "할당된 자원은 스스로 반환하기 전까지 제거 불가" },
      { name: "환형 대기 (Circular wait)", hint: "자원 점유와 요구 관계가 환형을 이루며 대기" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "교착상태(Deadlock)",
    title: "교착상태 해결 방안",
    axis: "언제 손을 대나 — 사전에, 진행 중에, 사후에",
    items: [
      { name: "예방 (Prevention)", hint: "4가지 조건 중 하나라도 발생하지 않도록 처리" },
      { name: "회피 (Avoidance)", hint: "안전 상태 유지 · 은행원 알고리즘, 안전 알고리즘" },
      { name: "발견 (Detection)", hint: "상태 감시 알고리즘으로 교착상태 검사 · 쇼샤니와 포크만" },
      { name: "회복 (Recovery)", hint: "Deadlock 이 없어질 때까지 프로세스를 순차적으로 Kill" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "기아(Starvation)",
    title: "교착 상태와 기아 상태 비교",
    axis: "누가 누구를 기다리나",
    items: [
      { name: "교착상태(Deadlock)", hint: "집합 내 프로세스가 서로에 의해서만 풀리는 Event 를 무한 대기" },
      { name: "기아상태(Starvation)", hint: "교착 상태의 부산물 · 자원 무한 대기(무한 봉쇄)" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "기아(Starvation)",
    title: "기아 현상 해결 위한 스케줄링 알고리즘",
    axis: "오래 기다린 프로세스를 어떻게 끌어올리나",
    items: [
      { name: "HRN 스케줄링", hint: "대기시간을 고려하여 Aging 적용" },
      { name: "MLFQ 스케줄링", hint: "여러 개의 큐를 두고 Round Robin 수행 · 균형 할당" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "우선순위 역전(Priority Inversion) 현상",
    title: "우선순위 역전 해결 방안",
    axis: "낮은 우선순위가 자원을 쥔 상황을 어떻게 푸나",
    items: [
      { name: "우선순위 상속", hint: "임계영역에 진입한 낮은 Task 의 우선순위를 대기 중인 높은 Task 와 동일하게" },
      { name: "우선순위 올림", hint: "자원 R 에 우선순위를 부여하고 진입하는 Task 를 그 우선순위로 올림" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "가상메모리 관리기법",
    title: "할당(Allocation) 기법",
    axis: "프로그램에 메모리를 어떻게 공급할지",
    items: [
      { name: "단일 분할 할당", hint: "스와핑(Swapping) · 프로그램 전체를 할당하다가 필요 시 교체" },
      { name: "다중 분할 할당", hint: "고정 분할 · 가변 분할" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "가상메모리 관리기법",
    title: "배치(Placement) 기법",
    axis: "어디(Where)에 적재할지",
    items: [
      { name: "First Fit", hint: "최초 적합한 곳에 할당" },
      { name: "Best Fit", hint: "할당 가능한 곳 중 낭비 공간이 최소가 되는 곳" },
      { name: "Next Fit", hint: "최근 할당 공간 다음부터 스캔하여 할당" },
      { name: "Worst Fit", hint: "가장 큰 공간 할당" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "가상메모리 관리기법",
    title: "호출(인출, Fetch) 기법",
    axis: "언제(When) 적재할지",
    items: [
      { name: "Demand Fetch (요구)", hint: "실행 프로그램이 요구할 때 참조되는 페이지·세그먼트만 적재" },
      { name: "Pre Fetch (예측)", hint: "참조할 것을 예상하여 사전에 적재 (근거: 지역성)" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "가상메모리 관리기법",
    title: "스와핑(Swapping)",
    axis: "주기억장치와 보조기억장치 사이의 교체 이동",
    items: [
      { name: "스왑 아웃(Swap Out)", hint: "주기억장치의 프로세스·페이지를 보조기억장치 스왑 영역으로 내보내 공간 확보" },
      { name: "스왑 인(Swap In)", hint: "스왑 영역의 내용을 주기억장치로 다시 적재 · 페이지 부재 시" },
      { name: "스왑 영역(Swap Space)", hint: "스왑 아웃된 내용을 보관하려고 보조기억장치에 확보한 전용 영역" },
      { name: "스와핑 비용", hint: "디스크 입출력이 끼어들어 메모리 접근보다 수만 배 느림" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "페이지 교체 알고리즘(Paging Replacement Algorithm)",
    title: "페이지 교체 알고리즘 종류",
    axis: "무엇을 기준으로 내보낼 페이지를 고르나",
    items: [
      { name: "FIFO (First In First Out)", hint: "가장 먼저 들어온 페이지를 먼저 교체" },
      { name: "LRU (Least Recently Used)", hint: "가장 오랫동안 참조되지 않은 페이지 교체" },
      { name: "LFU (Least Frequently Used)", hint: "참조 횟수가 가장 적은 Page 교체" },
      { name: "NUR (Not Used Recently)", hint: "적은 오버헤드로 LRU 와 유사 · 최근 사용되지 않은 Page 교체" },
      { name: "SCR (Second Chance Replacement)", hint: "자주 쓰던 Page 도 교체 대상에 포함 · FIFO 보완" },
      { name: "Clock Page", hint: "SCR 과 동일하되 원형 List 구조 사용" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "가상메모리의 페이징과 세그멘테이션",
    title: "페이징과 세그멘테이션 비교",
    axis: "나누는 단위가 고정 크기냐 논리 단위냐",
    items: [
      { name: "페이징", hint: "동일 크기 분할 · 페이지 테이블 커짐 · 외부단편화(X) 내부단편화(O)" },
      { name: "세그멘테이션", hint: "가변 크기 · 기억장치 보호키 · 외부단편화(O) 내부단편화(X)" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "Belady's Anomaly(FIFO 이상현상)",
    title: "Belady's Anomaly 극복 방안",
    axis: "교체 정책을 바꾸나, 최적화 원칙을 세우나",
    items: [
      { name: "LRU 사용", hint: "페이지 교체 정책" },
      { name: "OPT 사용", hint: "페이지 교체 정책" },
      { name: "Locality", hint: "최적화 원칙 설계" },
      { name: "PFF", hint: "최적화 원칙 설계" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "스레싱(Thrashing)",
    title: "Working Set과 PFF의 비교",
    axis: "페이지 집합을 언제 고치나",
    items: [
      { name: "Working Set", hint: "매번 기억장치 참조시마다 워킹 세트 수정 · Overhead 매우 큼" },
      { name: "PFF", hint: "Page Fault 발생시만 상주 페이지 세트 수정 · Overhead 작음" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "지역성(Locality)",
    title: "지역성 유형",
    axis: "다음에 무엇을 참조할지 예측하는 근거",
    items: [
      { name: "Temporal Locality (시간적)", hint: "하나의 페이지를 일정 시간 동안 집중적으로 엑세스" },
      { name: "Spatial Locality (공간적)", hint: "일정 위치의 페이지를 집중적으로 엑세스" },
      { name: "Sequential Locality (순차적)", hint: "분기가 없는 한 저장된 순서대로 인출·실행" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "단편화(Fragmentation)",
    title: "단편화 유형",
    axis: "낭비되는 공간이 어디에 생기나",
    items: [
      { name: "내부단편화", hint: "할당된 Memory 안에 남아서 사용 못하는 공간" },
      { name: "외부단편화", hint: "영역이 너무 작아 어느 작업에도 할당되지 못하고 비어 있는 상태" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "단편화(Fragmentation)",
    title: "단편화 해결 방법",
    axis: "빈 공간을 어떻게 합치나",
    items: [
      { name: "통합(Coalescing)", hint: "반납되는 분할 영역을 인접한 공백 영역과 합쳐 하나로" },
      { name: "집약(Compaction)", hint: "분산된 단편화 빈 공간을 결합하여 하나의 큰 가용 공간으로" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "단편화(Fragmentation)",
    title: "커널 메모리 할당자",
    axis: "어느 단편화를 줄이는가",
    items: [
      { name: "버디(Buddy) 시스템", hint: "2의 거듭제곱 크기 블록 · 큰 블록을 절반씩 쪼개 짝(Buddy)을 만듦" },
      { name: "슬랩(Slab) 할당자", hint: "자주 쓰는 커널 객체를 크기별 캐시(슬랩)에 미리 만들어 재사용" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "기한부(Deadline) 스케줄링",
    title: "실시간 System의 종류",
    axis: "시간 제한을 얼마나 엄격하게 지키나",
    items: [
      { name: "경성 실시간 시스템(Hard Real-Time)", hint: "정한 시간내에 반드시 완료해야 하는 실시간 시스템" },
      { name: "연성 실시간 시스템(Soft Real-Time)", hint: "시간적 제한이 다소 약한 형태의 실시간 시스템" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "인터럽트(Interrupt)",
    title: "인터럽트 발생 원인과 종류",
    axis: "H/W 에서 오나 S/W 에서 오나",
    items: [
      { name: "기계 착오 인터럽트", hint: "H/W 인터럽트" },
      { name: "재시작 인터럽트(Restart Interrupt)", hint: "H/W 인터럽트" },
      { name: "외부 인터럽트(External Interrupt)", hint: "H/W 인터럽트" },
      { name: "입출력 인터럽트(I/O Interrupt)", hint: "H/W 인터럽트" },
      { name: "프로그램 검사 인터럽트(Program Check Interrupt)", hint: "S/W 인터럽트" },
      { name: "슈퍼바이저 호출 인터럽트(Supervisor Call Interrupt)", hint: "S/W 인터럽트" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스(Process)와 스레드(Thread) 비교",
    title: "프로세스와 스레드 비교",
    axis: "무엇을 따로 갖고 무엇을 공유하나",
    items: [
      { name: "프로세스", hint: "자원 할당의 기본 단위 · Code·data·Heap·Stack 각자 · PCB 전환, 느림 · System Call" },
      { name: "스레드", hint: "CPU 이용 기본 작업 단위 · Code·data·heap 공유, Stack 만 별도 · 전환 빠름 · Library Call" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스(Process)와 스레드(Thread) 비교",
    title: "PCB와 TCB의 비교",
    axis: "무엇을 관리하는 데이터 블록인가",
    items: [
      { name: "PCB", hint: "프로세스 관리 데이터 블록 · 프로세스 정보 저장 · 관리 Data 많음 (Linux 약 106개 필드)" },
      { name: "TCB", hint: "스레드 관리 · 모든 Thread 에 공유되는 정보 · 실행 환경 정보 교환" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "PCB(Process Control Block)",
    title: "PCB 구성 정보 (식상카레스계입메)",
    axis: "프로세스를 되살리는 데 무엇이 필요한가",
    items: [
      { name: "PID(프로세스 식별자)", hint: "각 프로세스에 대한 고유 식별자" },
      { name: "프로세스 상태", hint: "생성, 준비, 실행, 대기, 중단 등" },
      { name: "프로그램 카운터", hint: "다음 명령의 주소 표시" },
      { name: "레지스터 저장 영역", hint: "누산기, 인덱스, 범용 레지스터, 조건 코드" },
      { name: "프로세서 스케줄링 정보", hint: "우선순위, 스케줄링 큐 포인터, 스케줄 매개변수" },
      { name: "계정 정보", hint: "프로세서 사용시간, 실제 사용시간, 사용 상한시간" },
      { name: "입출력 상태 정보", hint: "할당된 입출력 장치, 개방된 파일 목록" },
      { name: "메모리 관리 정보", hint: "상한/하한 레지스터(경계 레지스터), 페이지 테이블 정보" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "멀티 쓰레드(Multi-Thread)",
    title: "멀티 쓰레드 종류",
    axis: "쓰레드를 언제 어떻게 번갈아 실행하나",
    items: [
      { name: "Single Thread", hint: "하나의 쓰레드만 실행" },
      { name: "Interleaved Multithreading (IMT)", hint: "여러 쓰레드의 명령어를 시간 단위로 번갈아 실행" },
      { name: "Blocked Multithreading (BMT)", hint: "한 쓰레드가 메모리 지연 등으로 블록되면 다른 쓰레드 실행" },
      { name: "Simultaneous Multithreading (SMT)", hint: "여러 쓰레드의 명령어를 같은 클록 사이클에 동시 실행" },
      { name: "Chip Multiprocessing (CMP)", hint: "하나의 칩에 다수의 독립 코어, 각각 쓰레드 독립 실행" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스간 통신(IPC)",
    title: "공유 메모리와 메시지 전달 방식의 비교",
    axis: "데이터를 직접 공유하나, 커널을 거치나",
    items: [
      { name: "공유 메모리 방식", hint: "같은 메모리 영역을 직접 교환 · 공유 메모리, mmap · 빠름 · 동기화 필수 · 대용량" },
      { name: "메시지 전달 방식", hint: "커널 채널로 메시지 교환 · 파이프·메시지 큐·소켓·시그널 · 느림 · 충돌 낮음 · 소량" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "프로세스간 통신(IPC)",
    title: "메시지 전달 방식",
    axis: "메시지를 어디로 보내나",
    items: [
      { name: "파이프(Pipe)", hint: "부모-자식처럼 혈연 관계 프로세스 간 단방향 통신" },
      { name: "네임드 파이프(Named Pipe, FIFO)", hint: "파일 시스템에 이름을 가진 특수 파일 · 혈연 없어도 통신" },
      { name: "메시지 큐(Message Queue)", hint: "커널 큐에 메시지를 타입과 함께 넣고 꺼냄 · 비동기" },
      { name: "소켓(Socket)", hint: "TCP/UDP 기반 양방향 · 원격 호스트와도 통신" },
      { name: "시그널(Signal)", hint: "이벤트 발생을 비동기로 알리는 소프트웨어 인터럽트 · 데이터 전달 아님" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "디스크 스케줄링(Disk Scheduling)",
    title: "디스크 스케줄링(Disk Scheduling) 기법의 유형",
    axis: "헤드를 어떻게 움직여 탐색시간을 줄이나",
    items: [
      { name: "FCFS(First Come First Serve)", hint: "요청이 들어온 순서대로 헤드 처리" },
      { name: "SSTF(Shortest Seek Time First)", hint: "가장 가까운 트랙 요청을 우선 처리" },
      { name: "SCAN(엘리베이터 알고리즘)", hint: "헤드가 한 방향으로 이동하며 요청 처리" },
      { name: "N-Step SCAN", hint: "SCAN 변형 · 요청을 일정 크기 그룹(N)으로 나눠 처리" },
      { name: "C-SCAN(Circular SCAN)", hint: "SCAN 을 원형으로 확장" },
      { name: "LOOK", hint: "SCAN 개선 · 요청이 있는 범위까지만 이동" },
      { name: "C-LOOK", hint: "C-SCAN 개선 · 요청이 있는 범위까지만 이동" },
      { name: "SLTF(Shortest Latency Time First)", hint: "같은 트랙 내에서 회전 지연 최소화" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "파일 시스템(유닉스 파일시스템)",
    title: "유닉스 파일시스템의 구조",
    axis: "디스크에 무엇이 어느 순서로 놓이나",
    items: [
      { name: "부트 블록(Boot Block)", hint: "부트 또는 초기화 Bootstrap 코드 저장" },
      { name: "슈퍼 블록(Super Block)", hint: "파일 시스템 크기·블록 수 등 메타데이터 저장" },
      { name: "아이노드 (i-node)", hint: "파일·디렉토리의 모든 정보를 가진 구조" },
      { name: "데이터 블록 (Data Block)", hint: "실제 데이터가 저장되는 곳" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "파일 시스템(유닉스 파일시스템)",
    title: "유닉스 파일의 종류",
    axis: "파일이 무엇을 담나",
    items: [
      { name: "루트 파일 시스템", hint: "하드디스크에 적어도 하나 존재 · 시스템 프로그램·디렉토리 포함" },
      { name: "일반 파일", hint: "프로그램·원시 프로그램·텍스트·데이터 파일" },
      { name: "디렉토리 파일", hint: "파일명과 inode 번호를 연결하는 논리적 단위" },
      { name: "특수 파일", hint: "주변 장치에 연결된 파일" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "Wait-Die와 Wound-Wait",
    title: "Wait-Die와 Wound-Wait의 비교",
    axis: "늙은 프로세스와 젊은 프로세스 중 누가 죽나",
    items: [
      { name: "Wait-Die", hint: "늙은 프로세스는 기다리고(Wait) 젊은 프로세스는 종료(Die·롤백)" },
      { name: "Wound-Wait", hint: "늙은 프로세스는 젊은 프로세스를 종료(Wound)하고 자원 선점, 젊은 것은 기다림" },
    ],
  },
  {
    category: "운영체제", source: "교재", ref: "기억장치 계층 구조 (Memory Hierarchy)",
    title: "기억장치 계층 구조 특징",
    axis: "상위에서 하위로 갈수록 무엇이 어떻게 변하나",
    items: [
      { name: "용량(Capacity)", hint: "하위 레벨로 갈수록 증가" },
      { name: "접근 시간(Access Time)", hint: "하위 레벨로 갈수록 증가" },
      { name: "비트당 비용(Cost per Bit)", hint: "하위 레벨로 갈수록 감소" },
      { name: "성능(Performance)", hint: "하위 레벨 접근 빈도가 낮을수록 전체 성능 향상" },
    ],
  },

  // ─────────────────────────── 컴퓨터구조 ───────────────────────────
  {
    category: "컴퓨터구조", source: "교재", ref: "CISC vs RISC",
    title: "CISC vs RISC",
    axis: "명령어를 복잡하게 두나 단순하게 두나",
    items: [
      { name: "CISC", hint: "가변 길이 명령어 · 마이크로 프로그램 제어 · 소수의 레지스터 · 파이프라인 어려움 · Intel 계열" },
      { name: "RISC", hint: "32비트 고정 명령어 · 하드와이어 제어 · 다중 레지스터 · Load/Store 만 메모리 · ARM 계열" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "Pipeline(파이프라인)",
    title: "파이프라인 구성에 따른 유형",
    axis: "단계를 얼마나 쪼개고 유닛을 얼마나 두나",
    items: [
      { name: "단일 파이프라인", hint: "몇 가지 동작을 각 단계에 한 번만 중첩" },
      { name: "슈퍼 파이프라인", hint: "각 단계를 엇갈리게 중첩 · 단계를 더욱 세분화" },
      { name: "슈퍼 스칼라", hint: "파이프라인 기능 유닛을 여러 개 · 한 사이클에 여러 명령어 동시 처리" },
      { name: "슈퍼 파이프라인 이용한 슈퍼스칼라", hint: "슈퍼 스칼라에 슈퍼 파이프라인을 적용해 수행 시간 단축" },
      { name: "VLIW (Very Long Instruction Word)", hint: "동시 수행 가능한 명령어를 컴파일러가 추출해 하나로 압축" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "Pipeline Hazard",
    title: "파이프라인 해저드 유형 (구데제)",
    axis: "무엇 때문에 파이프가 멈추나",
    items: [
      { name: "구조적 해저드", hint: "자원 충돌 · 해결: 리소스 추가, Havard 아키텍처, 메모리 인터리빙" },
      { name: "데이터 해저드", hint: "이전 명령 결과에 종속(RAW) · 해결: Register Renaming, Stall, 포워딩" },
      { name: "제어 해저드", hint: "분기 명령 · 해결: Stall, Predict Branch, 지연분기" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)",
    title: "캐시 사상 방식",
    axis: "블록이 들어갈 자리를 얼마나 자유롭게 주나",
    items: [
      { name: "직접 사상(direct mapping)", hint: "주기억장치 블록이 캐시의 특정 라인에만 적재" },
      { name: "완전-연관 사상(fully-associative mapping)", hint: "블록이 캐시의 어떤 라인으로든 적재 가능" },
      { name: "집합-연관 사상(set-associative mapping)", hint: "블록 그룹이 하나의 세트를 공유, 세트에 두 개 이상 라인" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "캐시메모리의 쓰기정책(Write Policy)",
    title: "Write Through vs Write Back",
    axis: "주기억장치에 언제 쓰나",
    items: [
      { name: "Write Through", hint: "동시 쓰기 · 일관성 항상 보장 · 구조 단순 · BUS Traffic·Write Time 증가" },
      { name: "Write Back", hint: "나중 쓰기 · Dirty Bit 두고 Swap Out 때 복사 · 쓰기 최소화 · Coherency 어려움" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "캐시 플러시(Cache Flush)",
    title: "캐시(Cache) Flush와 Clean",
    axis: "무효화하나, 메모리로 내려쓰나",
    items: [
      { name: "Cache Flush", hint: "캐시 데이터가 유효하지 않다고 알림 · Dirty Bit 를 0으로 reset" },
      { name: "Cache Clean", hint: "캐시 데이터를 메인-메모리로 저장 · Dirty Bit 1인 것을 모두 메모리에" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "캐시 일관성(Cache Coherence)",
    title: "캐시 일관성 유지 기법",
    axis: "SW 로 피하나, HW 로 감시하나",
    items: [
      { name: "공유 캐시 사용", hint: "SW 기법 · 모든 프로세서가 하나의 공유 캐시 · 액세스 충돌 빈번" },
      { name: "공유 변수 캐시 미사용", hint: "SW 기법 · 변경 가능 공유 데이터는 주기억 장치에만 기록" },
      { name: "디렉토리 프로토콜", hint: "HW 기법 · 캐시 블록의 공유 상태·노드를 디렉토리에 기록" },
      { name: "스누피 프로토콜(Snoopy Protocol)", hint: "HW 기법 · 주소 버스를 항상 감시" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "MESI",
    title: "MESI 상태",
    axis: "이 블록을 나만 갖고 있나, 고쳤나",
    items: [
      { name: "수정(Modify)", hint: "데이터가 수정(변경)된 상태" },
      { name: "배타(Exclusive)", hint: "유일한 복사본, 주기억 장치와 동일" },
      { name: "공유(Shared)", hint: "두개 이상 캐시에 데이터가 적재" },
      { name: "무효(Invalid)", hint: "다른 프로세스에 의해 수정된 데이터" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "메모리 인터리빙(Interleaving)",
    title: "메모리 인터리빙 유형",
    axis: "주소의 어느 비트로 모듈을 고르나",
    items: [
      { name: "상위 인터리빙", hint: "주소를 모듈에 순차 지정 · 상위 비트가 모듈 선택" },
      { name: "하위 인터리빙", hint: "주소가 모듈 단위로 인터리빙 · 하위 비트가 모듈 선택" },
      { name: "혼합 인터리빙", hint: "모듈을 뱅크로 그룹화 · 그룹 선택은 상위, 그룹 내는 하위" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "메모리 인터리빙(Interleaving)",
    title: "메모리 인터리빙 접근방식",
    axis: "주소가 순차로 오나, 모두 온 뒤 동시에 읽나",
    items: [
      { name: "C-ACCESS", hint: "주소가 순차적으로 도착 · 순차적 Data Read · 순차적 CPU 전송" },
      { name: "S-ACCESS", hint: "주소가 모두 도착하면 동시에 Data Read · 순차적으로 CPU 전송" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "메모리 단편화(Fragmentation)",
    title: "메모리 단편화 해결 방법",
    axis: "합치나, 미리 나누나, 구조로 막나",
    items: [
      { name: "통합", hint: "인접한 단편화 공간을 하나의 공간으로" },
      { name: "압축", hint: "분산된 단편화 공간을 결합해 하나의 큰 가용 공간으로 (=Garbage Collection)" },
      { name: "가상메모리 관리기법 활용", hint: "페이징: 동일 프레임(외부단편화 방지) · 세그먼트: 가변 블록(내부단편화 방지)" },
      { name: "Memory Pool 활용", hint: "메모리 요청을 객체 크기대로 나누고 포인터로 관리" },
      { name: "Buddy System", hint: "고정·가변 분할 단편화를 보완한 절충 · 미사용 페이지프레임 그룹화" },
      { name: "Slab Allocator", hint: "페이지 프레임을 받아 작은 크기로 분할해 할당·해제" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "DMA(Direct Memory Access)",
    title: "DMA 연결 방식에 의한 모드",
    axis: "버스를 몇 개 두고 어디에 붙이나",
    items: [
      { name: "단일버스 분리 방식", hint: "CPU·입출력 모듈이 함께 시스템 버스에 직접 연결 · 버스 2번 사용" },
      { name: "단일버스 통합방식", hint: "시스템 버스 1번 사용 · 입출력 모듈을 DMA 제어기 하위에" },
      { name: "입출력 버스 방식", hint: "시스템 버스와 입출력 버스 모두 사용" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "DMA(Direct Memory Access)",
    title: "DMA 전송 방식에 의한 모드",
    axis: "한 번에 얼마나, 언제 버스를 쓰나",
    items: [
      { name: "Burst Mode (Block Mode)", hint: "한번 시작되면 블록 단위로 지속 전송" },
      { name: "Cycle Stealing Mode (Word Mode)", hint: "한번에 한 word · CPU 의 메모리 사이클 하나를 훔쳐 수행" },
      { name: "Demand Transfer Mode", hint: "Burst 와 유사 · DREQ 비활성 시 중지, 활성 시 재시작" },
      { name: "Interleaved DMA", hint: "CPU 가 시스템 미사용 시 DMA 가 버스 사용" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "RAID (Redundant Array of Independent Disks)",
    title: "RAID 종류",
    axis: "스트라이핑·미러링·패리티를 어떻게 조합하나",
    items: [
      { name: "RAID 0", hint: "블록 레벨 스트라이핑 · 성능은 드라이브 수에 비례 · 오류 복구 없음" },
      { name: "RAID 1", hint: "디스크 미러링 · 최소 2개 · 읽기 성능 N배" },
      { name: "RAID 2", hint: "비트 레벨 스트라이핑 · 해밍 코드 ECC · Overhead" },
      { name: "RAID 5", hint: "블록 레벨 스트라이핑 · 분산 패리티 · 최소 3개" },
      { name: "RAID 10", hint: "미러링 + 블록 스트라이핑 · 패리티 없음 · 최소 4개" },
      { name: "RAID 01", hint: "블록 스트라이핑 + 미러링 · 패리티 없음 · 최소 4개" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "HA(High Availability)",
    title: "HA 구성 유형",
    axis: "대기 시스템이 평소에 무엇을 하나",
    items: [
      { name: "Hot Standby", hint: "가동 시스템 + 대기(또는 개발) 백업 시스템" },
      { name: "Mutual Takeover", hint: "2개 시스템이 각자 업무를 하다가 장애 시 상대 자원을 인수" },
      { name: "Concurrent Access", hint: "여러 시스템이 동시에 업무를 나누어 병렬 처리 · 전체 Active" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "결함허용 컴퓨터(FTS)",
    title: "결함허용 단계별 특성 (감진통복)",
    axis: "결함을 어떤 순서로 다루나",
    items: [
      { name: "결함감지", hint: "Fault Detection · 결함 발생 및 내용 감지" },
      { name: "결함진단", hint: "Fault Diagnosis · 원인/위치/파급효과 판단" },
      { name: "결함통제", hint: "Fault Isolation · 오류 파급 차단" },
      { name: "결함복구", hint: "Fault Recovery & Reconfiguration · 결함요소 제거, 재구성" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "결함허용 컴퓨터(FTS)",
    title: "결함허용 관점별 기법 — Hardware",
    axis: "하드웨어를 어떻게 중복시키나",
    items: [
      { name: "TMR (Triple Modular Redundancy)", hint: "3개 이상 프로세서가 같은 입력에 동일 연산" },
      { name: "Duplication with Comparison", hint: "하드웨어 2개 중복 · 동기 상태에서 수행" },
      { name: "Stand by Sparing", hint: "결함감지를 위한 여분의 하드웨어" },
      { name: "Watchdog Timer", hint: "주기적 타이머 가동을 위한 초기화" },
      { name: "RAID", hint: "디스크 미러링, 패리티 비트" },
      { name: "Self-Purging Redundancy", hint: "출력이 틀린 하드웨어는 계산과정에서 배제" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "결함허용 컴퓨터(FTS)",
    title: "결함허용 관점별 기법 — Software",
    axis: "되돌리나, 여러 판을 돌리나",
    items: [
      { name: "Check point", hint: "검사시점 설정 · 오류 발견 시 이전 검사시점으로 되돌아가 재수행" },
      { name: "Recovery Block", hint: "재수행(Rollback & Retry) · 단일 프로세서" },
      { name: "Conversation", hint: "Recovery 의 확장형 · 복수 프로세서 정보 교환" },
      { name: "Distributed Recovery Block", hint: "Recovery Block 을 분산환경으로 확장" },
      { name: "N self-checking programming", hint: "자가진단으로 결함 발견 · 2개 이상 Self-Checking 컴포넌트" },
      { name: "N version programming", hint: "TMR 과 유사 · N개의 독립 S/W 모듈" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "워치독 타이머(WDT, Watchdog timer)",
    title: "워치독 타이머 구성요소",
    axis: "어떤 신호가 오가나",
    items: [
      { name: "Kick (Clear)", hint: "주기적으로 Watchdog 에게 알려주는 Alive 신호" },
      { name: "Reset", hint: "워치독 타이머가 MCU 를 초기화하는 시그널" },
      { name: "Clock", hint: "외부 클럭 소스(Clock Source)" },
      { name: "Timeout", hint: "MCU 의 Task 가 정상 동작하지 않음을 알리는 신호" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "TPU (Tensor Processing Unit)",
    title: "TPU 구성요소",
    axis: "행렬 연산을 어디서 하고 데이터를 어떻게 공급하나",
    items: [
      { name: "행렬 곱셈 장치(MXU, Matrix Multiplier Unit)", hint: "대규모 행렬 곱셈·컨볼루션 고속 처리 · 시스톨릭 어레이" },
      { name: "벡터 장치(Vector Unit)", hint: "행렬 곱셈 외 요소별 연산 · 활성화함수, 정규화" },
      { name: "HBM(High Bandwidth Memory)", hint: "대용량 데이터를 빠르게 전송 · MXU 에 데이터 공급" },
      { name: "상호 연결(Inter-Chip Interconnect, ICI)", hint: "여러 개의 TPU 칩을 연결" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "CPU Ring Level",
    title: "CPU Ring Level 구조",
    axis: "권한이 높을수록 안쪽 링",
    items: [
      { name: "Ring 0 (Kernel Mode, Supervisor Mode)", hint: "가장 높은 권한 · OS 커널, 드라이버 동작" },
      { name: "Ring 1, Ring 2 (Middle Privilege Level)", hint: "드라이버·가상화 소프트웨어 · 현대 OS 에서 거의 사용 안 함" },
      { name: "Ring 3 (User Mode, Application Mode)", hint: "가장 낮은 권한 · 일반 애플리케이션 · 직접 하드웨어 접근 불가" },
    ],
  },
  {
    category: "컴퓨터구조", source: "교재", ref: "I2C(Inter Integrated Circuit)와 SPI(Serial Peripheral Interface)",
    title: "I2C vs SPI",
    axis: "라인 수·속도·통신 방식",
    items: [
      { name: "I2C", hint: "2개 라인(SCL, SDA) · 반 이중 · Master, Slave 공유 · 저속 100kbps · 전력소모 높음" },
      { name: "SPI", hint: "보드 내 고속 직렬 · 전 이중 · 라인 수 많음" },
    ],
  },

  // ─────────────────────────── 알고리즘 ───────────────────────────
  {
    category: "알고리즘", source: "교재", ref: "알고리즘 성능평가",
    title: "점근적 성능 표기법(Asymptotic Notation)",
    axis: "상한이냐 하한이냐 둘 다냐",
    items: [
      { name: "O Notation (빅오 표기법)", hint: "점근적 상한선 · 최악일 때 기준" },
      { name: "Ω Notation (오메가 표기법)", hint: "점근적 하한선 · 최상일 때 기준" },
      { name: "Θ Notation (세타 표기법)", hint: "상한과 하한의 교집합 · 빅오·오메가 둘 다 만족" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "빅오 표기법(O-Notation)",
    title: "빅오 표기법 유형",
    axis: "입력이 커질 때 시간이 어떻게 늘어나나",
    items: [
      { name: "O(1)", hint: "상수형 · 입력 크기와 무관" },
      { name: "O(log N)", hint: "로그형 · 입력을 나누어 그 중 하나만 처리" },
      { name: "O(N)", hint: "선형 · 입력을 차례로 하나씩 모두 처리" },
      { name: "O(N log N)", hint: "분할과 합병형 · 분할해 각각 처리하고 합병" },
      { name: "O(N²)", hint: "제곱형 · 기본 연산 loop 가 2중" },
      { name: "O(N³)", hint: "세제곱형 · loop 가 3중" },
      { name: "O(2ⁿ)", hint: "지수형 · 가능한 해결방법 모두 검사" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "해싱과 충돌해결방법",
    title: "해싱 기법 [나폴리는 중세기다]",
    axis: "키를 주소로 어떻게 바꾸나",
    items: [
      { name: "나눗셈법(Division)", hint: "나머지 연산자(%)로 테이블 주소 계산" },
      { name: "폴딩법(Folding)", hint: "키를 같은 길이로 나눠 모두 더함" },
      { name: "중간 제곱법(Mid Square)", hint: "키를 제곱한 뒤 중간 몇 비트를 홈 주소로" },
      { name: "기수 변환법(Radix-Exchange)", hint: "다른 진법으로 간주해 키를 변환" },
      { name: "자릿수 분석법(Digit-Analysis)", hint: "자리별 분포를 조사해 고른 자리를 선택" },
      { name: "무작위 방법(Pseudo-Random)", hint: "난수로 홈 주소 결정" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "해싱과 충돌해결방법",
    title: "충돌 해결방법 [선이중무 체코]",
    axis: "다른 버킷을 찾나(개방), 같은 버킷에 매다나(폐쇄)",
    items: [
      { name: "선형 조사법(Linear Probing)", hint: "개방 주소법" },
      { name: "이차 조사법(Quadratic Probing)", hint: "개방 주소법" },
      { name: "이중 해싱법(Double Hashing Probing)", hint: "개방 주소법" },
      { name: "재해싱(Rehashing)", hint: "개방 주소법" },
      { name: "해시 체이닝(Hash Chaining)", hint: "폐쇄 주소법" },
      { name: "병합 체이닝(Coalesced Hashing)", hint: "폐쇄 주소법" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "동적 계획법(Dynamic Programming)",
    title: "동적 계획법 동작 원리",
    axis: "부분 문제의 해를 어떻게 쌓아 올리나",
    items: [
      { name: "점화/재귀 관계식 도출", hint: "부분 문제로 분할" },
      { name: "Memoization", hint: "최소 문제 점화식 해를 테이블에 저장" },
      { name: "Bottom-Up Approach", hint: "상위 문제 계산 시 저장된 부분 해 활용" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "동적 계획법(Dynamic Programming)",
    title: "동적 계획법 접근방법",
    axis: "위에서 재귀로 내려가나, 아래에서 표로 올라가나",
    items: [
      { name: "Top Down", hint: "재귀 호출 fibo(n-1)+fibo(n-2) · 메모이제이션" },
      { name: "Bottom Up", hint: "for 문으로 cache[i] 를 차례로 채움" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "그리디(탐욕) 알고리즘",
    title: "그리디 수행 절차 [해적검]",
    axis: "매 단계 무엇을 확인하나",
    items: [
      { name: "해 선택", hint: "부분해 집합에 더해질 다음 항목 선택 · 현재 상태의 부분 최적" },
      { name: "적합성 검증", hint: "새 부분해 집합의 제약조건 위반 여부 검사" },
      { name: "해 검증", hint: "집합이 문제의 해인지 검사 · 아니면 해 선택으로 반복" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "최소 신장 트리(MST, Minimum Spanning Tree)",
    title: "프림(Prim) vs 크루스칼(Kruscal)",
    axis: "정점에서 넓혀 가나, 간선을 골라 담나",
    items: [
      { name: "프림(Prim) 알고리즘", hint: "시작 정점부터 인접 정점 중 최저 간선을 골라 확장 · n-1 간선에서 종료" },
      { name: "크루스칼(Kruscal) 알고리즘", hint: "간선을 가중치 오름차순 정렬 · 사이클 안 만드는 간선만 추가" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "그래프 순회(Graph Traversal)",
    title: "너비 우선 탐색(BFS)과 깊이 우선 탐색(DFS) 비교",
    axis: "옆으로 퍼지나, 아래로 파고드나",
    items: [
      { name: "너비 우선 탐색(BFS)", hint: "횡방향 탐색 · 큐 · 옆으로 넓은 그래프에 유리" },
      { name: "깊이 우선 탐색(DFS)", hint: "종방향 탐색 · 스택, 백트래킹 · 아래로 깊은 그래프에 유리" },
    ],
  },
  {
    category: "알고리즘", source: "교재", ref: "트리 순회(Tree Traversal)",
    title: "트리 순회 유형",
    axis: "Root 를 언제 방문하나",
    items: [
      { name: "전위 순회(Pre-Order)", hint: "Root → Left → Right · 전위 표기" },
      { name: "중위 순회(In-Order)", hint: "Left → Root → Right · 중위 표기" },
      { name: "후위 순회(Post-Order)", hint: "Left → Right → Root · 후위 표기" },
    ],
  },

  // ─────────────────────────── 자료구조 ───────────────────────────
  {
    category: "자료구조", source: "교재", ref: "선형 자료구조와 비선형 자료구조",
    title: "선형 자료구조",
    axis: "1:1 대응 구조 — 어디로 넣고 어디로 빼나",
    items: [
      { name: "Array", hint: "같은 데이터형 요소가 동일 크기로 순차 나열" },
      { name: "Linked List", hint: "노드가 데이터와 포인터를 갖고 한 줄로 연결" },
      { name: "Stack (LIFO)", hint: "한쪽 끝에서만 삽입·삭제" },
      { name: "Queue (FIFO)", hint: "한쪽에서 삽입, 다른 쪽에서 삭제" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "선형 자료구조와 비선형 자료구조",
    title: "비선형 자료구조",
    axis: "1:N 또는 M:N — 자료 간 관계를 표현",
    items: [
      { name: "Tree", hint: "노드들이 나무 가지처럼 연결된 계층 구조 · 그래프의 일종" },
      { name: "Graph", hint: "정점(Vertex) 집합 V 와 간선(Edge) 집합으로 구성" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "링크드 리스트(Linked List)",
    title: "링크드 리스트 유형",
    axis: "포인터가 몇 개고 끝이 어디를 가리키나",
    items: [
      { name: "Singly Linked List", hint: "데이터와 다음 노드 포인터 · 이전 노드는 알 필요 없음" },
      { name: "Double Linked List", hint: "이전/다음 포인터 · 전/후방 순환 가능" },
      { name: "Singly Circular Linked List", hint: "마지막 Node 가 Null 이 아닌 처음 노드를 가리킴" },
      { name: "Double Circular Linked List", hint: "처음과 마지막 노드가 서로를 가리킴" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "Stack",
    title: "스택 구성 요소",
    axis: "어디서 무엇이 일어나나",
    items: [
      { name: "TOP", hint: "삽입·삭제가 일어나는 끝 · 스택 포인터" },
      { name: "Bottom", hint: "TOP 의 반대쪽 끝 · 삽입·삭제 없음" },
      { name: "PUSH", hint: "값 삽입 · overflow: 스택 포인터 > 스택 크기" },
      { name: "POP", hint: "값 삭제 · Underflow: Top pointer 주소 = 0" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "Queue",
    title: "큐 유형 [선순링덱]",
    axis: "무엇으로 구현하고 어느 끝을 쓰나",
    items: [
      { name: "선형 큐", hint: "배열을 선형으로 사용" },
      { name: "순환 큐(원형 큐)", hint: "배열의 끝과 시작이 이어진 것처럼 관리" },
      { name: "LinkedList 큐", hint: "LinkedList 로 구현" },
      { name: "덱(Double-ended Queue)", hint: "전단과 후단 모두에서 삽입·삭제" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "AVL 트리",
    title: "AVL 트리 회전",
    axis: "어느 쪽으로 치우쳤나",
    items: [
      { name: "LL", hint: "왼쪽-왼쪽 치우침(3,2,1) → 오른쪽으로 한 번 회전" },
      { name: "RR", hint: "오른쪽-오른쪽 치우침(1,2,3) → 왼쪽으로 한 번 회전" },
      { name: "LR", hint: "왼쪽-오른쪽 치우침(3,1,2) → LL 회전 후 RR 회전" },
      { name: "RL", hint: "오른쪽-왼쪽 치우침(1,3,2) → RR 회전 후 LL 회전" },
    ],
  },
  {
    category: "자료구조", source: "교재", ref: "힙(Heap)",
    title: "최대 힙(Max-Heap)과 최소 힙(Min-Heap)",
    axis: "루트에 무엇이 오나",
    items: [
      { name: "최대 힙(Max-Heap)", hint: "완전 이진 트리 · 한 노드는 모든 자손보다 큰 키 · 루트가 최대" },
      { name: "최소 힙(Min-Heap)", hint: "완전 이진 트리 · 한 노드는 모든 후손보다 작은 키 · 루트가 최소" },
    ],
  },

  // ─────────────────────────── 확률·통계 ───────────────────────────
  {
    category: "확률·통계", source: "교재", ref: "데이터 유형",
    title: "자료 형태에 따른 분류 [명순등비]",
    axis: "범주형이냐 수치형이냐, 무엇까지 말할 수 있나",
    items: [
      { name: "명목 자료(Nominal)", hint: "범주형 · 명목 척도" },
      { name: "순서 자료(Ordinal)", hint: "범주형 · 서열 척도" },
      { name: "등간 자료(Interval)", hint: "수치형 · 이산형 자료" },
      { name: "비율 자료(Ratio)", hint: "수치형 · 연속형 자료" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "데이터 유형",
    title: "시간에 따른 자료 유형",
    axis: "한 시점이냐 여러 시점이냐",
    items: [
      { name: "횡단형(Cross-sectional Data)", hint: "한번의 시간에 얻어진 데이터" },
      { name: "종단형(Longitudinal Data)", hint: "동일 대상에서 여러 시간에 걸쳐 · 시계열 자료" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "확률분포",
    title: "확률분포 유형 [이연 베이포 정표T카F]",
    axis: "셀 수 있나, 구간의 모든 실수인가",
    items: [
      { name: "이산확률변수", hint: "값이 유한개 또는 자연수처럼 셀 수 있음 · 베르누이·이항·포아송" },
      { name: "연속확률변수", hint: "구간에 속하는 모든 실수값 · 정규·표준정규·T·카이제곱·F" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "확률분포",
    title: "이산확률분포",
    axis: "무엇을 세나",
    items: [
      { name: "베르누이 분포", hint: "성공 또는 실패 두 결과 중 하나 · 성공확률 + 실패확률 = 1" },
      { name: "이항 분포", hint: "n번 시행, 확률 p 일 때 k번 성공할 확률" },
      { name: "포아송 분포", hint: "단위 시간·영역에서 사건 발생 횟수 · 기댓값 = 분산 = λ" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "확률분포",
    title: "연속확률분포",
    axis: "무엇을 추정할 때 쓰나",
    items: [
      { name: "정규 분포", hint: "평균 중심 대칭 종모양" },
      { name: "표준정규분포(Z-분포)", hint: "평균 0, 분산 1로 표준화 · 확률변수 Z" },
      { name: "T-분포", hint: "모집단 정규, 표준편차 모를 때 평균 추측" },
      { name: "카이제곱 분포(χ²-분포)", hint: "표본 통계량이 표본분산일 때 · 독립 표준정규 제곱합" },
      { name: "F-분포", hint: "2개의 χ² 확률변수를 각각 자유도로 나눈 비율" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "표본 추출(Sampling)",
    title: "확률 추출 [단층계집]",
    axis: "모집단을 어떻게 나눠서 뽑나",
    items: [
      { name: "단순확률 추출(Simple Random Sampling)", hint: "요소 하나하나가 뽑힐 확률이 동일 · 기본 추출법" },
      { name: "층화확률 추출(Stratified Random Sampling)", hint: "겹치지 않는 층으로 분할 후 각 층별 단순 임의 추출" },
      { name: "계통 추출(Systematic Sampling)", hint: "추출 틀에서 k번째 간격마다 하나씩" },
      { name: "집락(군집) 추출(Cluster Sampling)", hint: "인접 단위로 군집을 만들고 추출된 군집 내 일부·전체 조사" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "표본 추출(Sampling)",
    title: "비확률 추출 [눈편할유판]",
    axis: "조사원의 판단이 어디에 들어가나",
    items: [
      { name: "눈덩이 추출법(Snowball Sampling)", hint: "소수 응답자에게서 비슷한 사람을 소개받아 감" },
      { name: "편의 표출(Convenience Sampling)", hint: "모집단 정보가 없을 때 조사원이 편리한 대로 선정" },
      { name: "할당 추출(Quota Sampling)", hint: "특성별 층을 구성한 뒤 조사원이 층 내에서 직접 선정" },
      { name: "유의추출법(포커스 그룹, Purposive Sampling)", hint: "모집단 특성을 조사원이 정확히 알 때 제한적 사용" },
      { name: "판단추출법(Judgement Sampling)", hint: "조사원이 가장 잘 대표한다고 판단한 표본을 주관적으로" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "왜도(Skewness) & 첨도(Kurtosis)",
    title: "왜도(비대칭성)",
    axis: "어느 쪽으로 치우쳤나",
    items: [
      { name: "왜도 < 0", hint: "오른쪽으로 치우친 분포 (Negative Skewness)" },
      { name: "왜도 = 0", hint: "비대칭성이 정규 분포와 유사" },
      { name: "왜도 > 0", hint: "왼쪽으로 치우친 분포 (Positive Skewness)" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "왜도(Skewness) & 첨도(Kurtosis)",
    title: "첨도(뾰족함)",
    axis: "정규분포보다 뾰족한가",
    items: [
      { name: "첨도 < 0", hint: "상대적으로 평평한 분포 (Platykurtic)" },
      { name: "첨도 = 0", hint: "정규 분포와 유사 (Mesokurtic)" },
      { name: "첨도 > 0", hint: "상대적으로 뾰족한 분포 (Leptokurtic)" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "이상치(Outlier)",
    title: "이상치 검출 방법",
    axis: "무엇을 기준으로 튀는 값을 찾나",
    items: [
      { name: "Variance", hint: "정규분포에서 97.5% 이상 또는 2.5% 이하" },
      { name: "Likelihood", hint: "베이즈 정리로 정상/이상 두 샘플의 발생 확률" },
      { name: "Nearest-Neighbor", hint: "모든 데이터 쌍의 거리 계산" },
      { name: "Density", hint: "LoF(Local Outlier Factor) 가 가장 큰 데이터" },
      { name: "Clustering", hint: "작은 클러스터나 클러스터 간 거리가 먼 경우" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "시계열분석",
    title: "시계열 정상성 조건",
    axis: "시간에 따라 통계적 특성이 변하지 않는 상태",
    items: [
      { name: "평균 일정", hint: "시점에 의존하지 않고 평균이 일정" },
      { name: "분산 일정", hint: "시점에 의존하지 않고 분산이 일정" },
      { name: "공분산 시차 의존", hint: "공분산은 시차에만 의존, 특정 시점에는 의존하지 않음" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "시계열분석",
    title: "시계열 특징 [추순계불]",
    axis: "변동의 주기가 얼마나 긴가",
    items: [
      { name: "추세(Trend)", hint: "장기 변동 요인 · GDP, 인구증가율, 기술변화" },
      { name: "순환(Cycle)", hint: "중기 변동 요인 · 2~10년 주기" },
      { name: "계절(Seasonal)", hint: "1년 주기 단기 변동 요인" },
      { name: "불규칙(Irregular)", hint: "규칙성 없이 예측 불가 · 우연적 변동" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "시계열분석",
    title: "시계열 모델 종류",
    axis: "과거 값을 쓰나, 과거 오차를 쓰나, 차분하나",
    items: [
      { name: "자기회귀 모델(AR, Autoregressive)", hint: "이전 시점(p) 값들의 선형 결합 + 백색 잡음" },
      { name: "이동평균 모델(MA, Moving Average)", hint: "과거의 예측 오차가 현재에 영향" },
      { name: "ARMA 모델", hint: "자기회귀 + 이동평균 결합" },
      { name: "ARIMA 모델", hint: "ARMA 의 정상성 확보를 위해 차분한 데이터 이용" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "베이즈 정리(Bayes's theorem)",
    title: "베이즈 정리 용어 [전우후]",
    axis: "사건 전에 아나, 사건이 나고 아나",
    items: [
      { name: "사전확률(Prior Probability)", hint: "이미 알고 있는 사건의 확률 · P(A1), P(A2)…" },
      { name: "우도(Likelihood)", hint: "알고 있는 사건이 발생했다는 조건에서 다른 사건이 발생할 확률 · P(B|A1)" },
      { name: "사후확률(Posterior Probability)", hint: "사전확률과 우도를 통해 알게 되는 조건부 확률 · P(Ai|B)" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "베이즈 정리(Bayes's theorem)",
    title: "베이즈 정리 수식 이론 [조곱전베]",
    axis: "베이즈 정리로 이어지는 네 단계",
    items: [
      { name: "조건부 확률", hint: "P(A|B) = P(A∩B) / P(B)" },
      { name: "곱셈의 정리", hint: "P(A∩B) = P(B|A)P(A) = P(A|B)P(B)" },
      { name: "전확률의 법칙", hint: "P(B) = P(B∩A₁) + P(B∩A₂) + P(B∩A₃)" },
      { name: "베이즈 정리", hint: "P(A₁|B) = P(B|A₁)P(A₁) / P(B)" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "기술 통계(Descriptive statistics)",
    title: "데이터 요약 기법",
    axis: "가운데냐, 퍼짐이냐, 모양이냐",
    items: [
      { name: "중심경향값", hint: "평균·중앙값·최빈값" },
      { name: "변산도", hint: "집중 경향치를 중심으로 얼마나 밀집·분산됐나 · 범위·분산·표준편차" },
      { name: "분포", hint: "형태와 대칭성 · 왜도, 첨도" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "기술 통계(Descriptive statistics)",
    title: "데이터 시각화 기법",
    axis: "무엇을 보여 주려는 그림인가",
    items: [
      { name: "히스토그램", hint: "도수 분포를 직사각형 기둥으로" },
      { name: "상자수염그림", hint: "사분위수로 분포 표현 · 이상치 탐지" },
      { name: "산점도(scatter plot)", hint: "두 수치형 변수 간의 관계" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "추론 통계(Inferential Statistics)",
    title: "기술통계와 추론통계 비교",
    axis: "표본을 설명하나, 모집단을 추론하나",
    items: [
      { name: "기술통계", hint: "수집한 표본의 주요 특성 분석 · 평균·표준편차·중위수·최빈수" },
      { name: "추론통계", hint: "표본으로 모집단의 특성을 추정·검정" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "추정 이론(Estimation Theory)",
    title: "모수적 추정 vs 비모수적 추정",
    axis: "분포를 가정하나",
    items: [
      { name: "모수적 추정(Parametric Estimation)", hint: "모집단이 특정 분포를 따른다고 가정하고 매개변수(모수) 추정" },
      { name: "비모수적 추정(Non-parametric Estimation)", hint: "분포를 가정하지 않고 데이터로 직접 특성 추정" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "추정 이론(Estimation Theory)",
    title: "추정 방법 [점구]",
    axis: "하나의 값이냐 구간이냐",
    items: [
      { name: "점 추정(Point Estimation)", hint: "모수를 하나의 값으로 · 구체적이지만 불확실성 전달 못함" },
      { name: "구간 추정(Interval Estimation)", hint: "모수가 특정 구간 안에 있을 신뢰 구간 제시 · 불확실성 표현" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "추정 이론(Estimation Theory)",
    title: "추정량의 조건 [불효일충]",
    axis: "좋은 추정량이 갖춰야 할 성질",
    items: [
      { name: "불편성(Unbiasedness)", hint: "기대값이 실제 모수 값과 동일" },
      { name: "효율성(Efficiency)", hint: "불편 추정량 중 분산이 가장 작음" },
      { name: "일치성(Consistency)", hint: "표본이 커질수록 추정량이 실제 모수에 수렴" },
      { name: "충분성(Sufficiency)", hint: "통계량만으로 모수에 대한 충분한 정보 제공" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "회귀분석(Regression Analysis)",
    title: "회귀분석의 가정 [선정독등공]",
    axis: "1~4 모두 만족해야 한다",
    items: [
      { name: "선형성(Linearity)", hint: "독립변수와 종속변수 간 선형 관계" },
      { name: "잔차 정규성(Normality)", hint: "잔차 기댓값 0, 정규분포" },
      { name: "잔차 독립성(Independence)", hint: "관측치 간 상관관계 없음" },
      { name: "잔차 등분산성(Homoscedasticity)", hint: "잔차 분산이 독립변수 값과 무관하게 일정" },
      { name: "다중 공선성(Multicollinearity)", hint: "다중 회귀에서 독립변수 간 상관관계로 인한 문제 없어야" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "회귀분석(Regression Analysis)",
    title: "회귀분석의 유형 [단다일다선로공분 리라엘]",
    axis: "무엇을 기준으로 나누나",
    items: [
      { name: "독립변수 기준", hint: "단순 회귀분석, 다중 회귀분석" },
      { name: "종속변수 기준", hint: "일변량 회귀분석, 다변량 회귀분석" },
      { name: "종속변수 형태", hint: "선형 회귀분석, 로지스틱 회귀분석" },
      { name: "분산 형태", hint: "공분산 분석, 분산분석" },
      { name: "정규화", hint: "리지, 라쏘, 엘라스틱넷 회귀분석" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)",
    title: "AIC와 BIC 비교",
    axis: "패널티를 얼마나 주나",
    items: [
      { name: "AIC", hint: "예측 성능 중심 · 패널티 2p · 비교적 낮아 과적합 위험 · 복잡한 모델 선택" },
      { name: "BIC", hint: "변수 개수 중점 · 패널티 log(n)p · n > 8 이면 AIC 보다 큼 · 단순한 모델 선택" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "통계적 가설검정(Hypothesis Testing)",
    title: "1종·2종 오류",
    axis: "무엇을 잘못 판정했나",
    items: [
      { name: "제 1종 오류(α)", hint: "귀무가설이 옳은데 기각할 확률 · 유의수준" },
      { name: "제 2종 오류(β)", hint: "귀무가설이 거짓인데 기각 못할 확률" },
    ],
  },
  {
    category: "확률·통계", source: "교재", ref: "ANOVA(Analysis of variance)",
    title: "ANOVA 조건 [정등독]",
    axis: "분산분석을 쓰기 위한 전제",
    items: [
      { name: "정규성", hint: "각 집단이 정규분포" },
      { name: "등분산성", hint: "집단 간 분산이 같음" },
      { name: "독립성", hint: "관측치가 서로 독립" },
    ],
  },
];
