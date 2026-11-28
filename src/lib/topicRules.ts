/**
 * 토픽 ↔ 문항 맞추기의 「사람이 고치는 규칙」 — 엔진(examHistory.ts)에서 떼어 냈다(2026-11-20).
 *
 *  - DROP_ANY   : 제목 괄호 속 영문 가운데 열쇠로 쓰지 않을 것(넓은 분야 이름)
 *  - KEYS_FIXED : 제목 열쇠를 통째로 정하는 토픽
 *  - TRAP       : 열쇠가 딴 뜻으로 걸리는 문항을 막는 덫
 *  - EXTRA_ANY  : 제목 열쇠로는 안 잡히는 표기(눌러 쓴 꼴)
 * 사람이 읽는 다른 표기(별칭)는 topicAliases.ts 에 있다. 규칙을 고치면 걸리는 문항을 눈으로 훑는다.
 */

/**
 * 제목에서 찾을 열쇠들.
 *  all: 한글 개념 이름들 — "프로세스와 스레드 비교" → [프로세스, 스레드], 전부 들어 있어야 한다.
 *  any: 괄호 속 영문 이름 — 하나라도 들어 있으면 된다(한글 없이 영문만 쓴 문항용).
 */
export type Keys = { all: string[]; any: string[] };

/** 제목 괄호 속 영문 가운데 열쇠로 쓰지 않을 것(넓은 분야 이름) — keysOf 참고. */
export const DROP_ANY: Record<string, string[]> = {
  "소버린 AI(Artificial Intelligence)": ["artificialintelligence"],
  "RAN(Radio Access Network) Sharing": ["radioaccessnetwork"],
  "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안": ["digitaltwin"],
  "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)": ["cache"],
  "문맥(Context)": ["context"],
  // 괄호 조각을 따로 열쇠로 삼으면서(2026-11-05) 넓은 말이 열쇠가 된 것 — 「View Model」은 4+1 View Model 을,
  // 「Regression」은 회귀분석(ML) 문항 20개를 끌어왔다.
  "MVVM (Model, View, View Model)": ["viewmodel"],
  "리그레이션(회귀, Regression) 테스트": ["regression"],
  // 2026-11-15 전수 검수 — 「Validation」은 머신러닝 교차검증(Cross Validation) 문항 15개를 낙관적 검증(DB 동시성) 토픽으로 끌어왔다.
  "낙관적 검증(Validation) 기법": ["validation"],
};

/**
 * 제목 열쇠를 통째로 정하는 토픽 — 괄호가 종류 나열이라 괄호 밖이 넓은 말만 남는 경우.
 * 「데이터(웨어하우스, 레이크, 패브릭, 메시)」는 열쇠가 「데이터」 하나가 되어 문항 1,391개를 끌어왔다(2026-10-11).
 */
export const KEYS_FIXED: Record<string, Keys> = {
  "데이터(웨어하우스, 레이크, 패브릭, 메시)": { all: [], any: ["데이터웨어하우스", "데이터레이크", "데이터패브릭", "데이터메시"] },
  // 「RaaS」는 랜섬웨어 RaaS(Ransomware as a Service) 토픽과 겹친다 — 로봇 쪽은 원어·한글 이름으로만 찾는다(2026-11-04)
  "Robot-as-a-Service(RaaS)": { all: [], any: ["robotasaservice", "서비스형로봇"] },
};

/**
 * 열쇠가 더 긴 낱말에 먹히는 경우 — 그 낱말만 나오는 문항은 이 토픽이 아니다.
 * 예) "암호화"는 "암호화폐" 문항을 끌어왔고, "개인정보 보호기술"은 끝말 '기술'을 떼어
 *     "개인정보보호"가 되면서 개인정보보호위원회·영향평가 문항까지 자기 이력으로 삼았다.
 */
export const TRAP: Record<string, RegExp> = {
  암호화: /암호화폐|암호화페/,
  // 2026-11-15 전수 검수 — 괄호 속 영문 열쇠가 딴 뜻의 낱말에 걸린 것들.
  // SOLID 원칙 ← SSD(Solid State Drive) 14문항, Stack ← 오픈스택·AI 풀스택·스택 오버플로우, RDBMS 인덱스 ← 지니 지수·전자정부 발전지수,
  // 엔티티 ← NER·개체 무결성·ERD, DB 정규화 ← 배치 정규화·머신러닝 정규화, ML 옵티마이저 ← DB 옵티마이저, 메모리 단편화 ← 패킷·분산DB 단편화,
  // Queue ← 메시지 큐·대기행렬·멀티레벨 큐 스케줄링, 린 방법론 ← CALMS·린 스타트업, 암호화 ← 동형암호(따로 토픽이 있다)
  solid: /solidstate/,
  stack: /openstack|fullstack|stackoverflow|elkstack/,
  index: /giniindex|entropyindex|developmentindex/,
  entity: /namedentity|entityintegrity|entityrelationship/,
  normalization: /batchnormalization|layernormalization|머신러닝에서정규화normalization/,
  fragmentation: /패킷단편화fragmentation|horizontalfragmentation|verticalfragmentation|데이터단편화fragmentation/,
  queue: /messagequeue|queuesystem|levelqueue|singlequeue|multiqueue|큐queue멀티프로세서/,
  lean: /automationleanmeasure|leanstartup|leanstrartup|leancanvas/,
  encryption: /homomorphicencryption/,
  // 2026-11-18 다중화(Multiplexing) ← 「웹 서버의 다중화」(이중화·로드밸런서)·「다중화 안전 기법」(BCP)·HTTP/2 멀티플랙싱(스트림 다중화 — 전송 다중화 FDM·TDM 이 아니다)
  다중화: /웹서버의다중화|다중화안전/,
  multiplexing: /^[\s\S]*http\/?2[\s\S]*$/,
  멀티플랙싱: /^[\s\S]*http\/?2[\s\S]*$/,
  멀티플렉싱: /^[\s\S]*http\/?2[\s\S]*$/,
  // SW 가시화(Software Visualization)는 빅데이터 시각화가 아니다
  visualization: /swvisualization|softwarevisualization/,
  // RAID 수준 비교의 「고장허용 측면·범위」는 결함허용 컴퓨터(FTS) 토픽이 아니고, 생체인식 스푸핑은 네트워크 스푸핑이 아니다
  고장허용: /고장허용측면|고장허용범위/,
  스푸핑: /생체인식스푸핑|얼굴스푸핑|안티스푸핑/,
  개인정보보호: /개인정보보호위원회|개인정보보호법|개인정보영향평가/,
  // 「OWASP Top 10:2025」(웹)과 「OWASP Top 10 for LLM」은 다른 토픽이다.
  // 범정부 DRM(Data Reference Model)은 디지털 저작권 관리가 아니다.
  // 결함허용 양자컴퓨팅·교착상태 회복·조건부 확률분포는 각각 다른 토픽이다.
  결함허용: /결함허용양자|양자오류[^.]{0,40}결함허용/,
  회복기법: /(?:deadlock|교착상태)회복기법/,
  확률분포: /조건부확률분포/,
  drm: /범정부drm|drmdatareferencemodel/,
  // 소프트웨어 정의 로봇(SDR) 문항은 Software Defined Radio 가 아니다(NS19 8주차, 2026-11-07)
  sdr: /^[\s\S]*(?:softwaredefinedrobot|소프트웨어정의로봇|sdram|ddr)[\s\S]*$/,
  // 「스마트팩토리 보안취약점」 문항은 스마트 팩토리 시스템 토픽이 아니라 보안취약점 토픽이다
  // 예시로만 스마트팩토리를 든 문항(정규분포·통계 검증·스마트시티 나열·SW 안전성·SSPL·5G 특화망·TSN·산업데이터플랫폼·DRDoS)은 뺀다
  스마트팩토리: /^[\s\S]*(?:정규분포|표준편차|통계적검증|스마트시티|소프트웨어안전성|sspl|특화망|초저지연|산업데이터플랫폼|drdos)[\s\S]*$|스마트팩토리(?:의)?(?:보안|취약점)/,
  스마트공장: /^[\s\S]*(?:정규분포|표준편차|통계적검증|스마트시티|소프트웨어안전성|sspl|특화망|초저지연|산업데이터플랫폼|drdos)[\s\S]*$|스마트공장(?:의)?(?:보안|취약점)/,
  owasptop10: /owasptop10(?:for)?(?:llm|대형언어|대규모언어)/,
  // DB 옵티마이저(RBO·CBO) 문항은 머신러닝 옵티마이저가 아니다 — 15문항이 걸려 있었다(2026-10-17).
  // DB 이상현상(서브 토픽)은 FIFO 이상현상(Belady's Anomaly)이 아니다
  이상현상: /fifo이상현상|belady/,
  optimizer: /^[\s\S]*(?:rbo|cbo|rulebased|costbased|데이터베이스|database|dbms|관계형db|dboptimizer|질의최적화)[\s\S]*$/,
  // 2026-10-19 서브 토픽을 더하며 — 실내 측위 IPS(Indoor Positioning System)는 침입방지시스템이 아니고,
  // 「NFC, MST 비교」의 MST 는 마그네틱 결제(Magnetic Secure Transmission)다. 일정 계산 문항의 활동 이름
  // 「C B, D」가 붙어 CBD 로 읽혔다.
  ips: /^[\s\S]*(?:indoorpositioning|실내측위|위치기반)[\s\S]*$/,
  mst: /^[\s\S]*(?:nfc|magnetic|마그네틱)[\s\S]*$/,
  cbd: /^[\s\S]*(?:선행작업|주공정|criticalpath)[\s\S]*$/,
  // 문맥(서브 토픽)은 문맥교환이 아니다 — 「문맥교환」만 든 문항은 문맥교환 토픽 몫
  문맥: /문맥\s*교환|문맥\s*전환/,
  // 데이터 레이크(서브 토픽)는 데이터 레이크하우스가 아니다
  데이터레이크: /데이터레이크하우스/,
  datalake: /datalakehouse/,
  // 가명정보 가이드라인의 「대규모 비정형데이터 검수 방식 유형」은 데이터 유형 토픽이 아니다(NS19 07주차)
  데이터유형: /비정형데이터검수방식유형/,
  // 「ISMS-P 인증」은 SP 인증(소프트웨어 프로세스 품질인증)이 아니다
  sp인증: /ismsp/,
  // 2026-11-04 "Robot-as-a-Service(RaaS) 모범답안 잘못 붙었다" — 같은 약어라 랜섬웨어 RaaS 문항 5개가 로봇 토픽에,
  // 로봇 RaaS 문항 2개가 랜섬웨어 토픽에 걸려 있었다. 로봇 쪽은 KEYS_FIXED 로 열쇠를 바꿨고, 「raas」 열쇠(랜섬웨어 토픽)는 로봇 문항을 뺀다.
  raas: /^[\s\S]*(?:robot|로봇)[\s\S]*$/,
  // 2026-11-14 "스케줄링과 스케줄러는 다른 거 아냐?" — 스케줄러(장기·중기·단기, 디스패처)는 CPU 스케줄링(알고리즘·정책)과 다른 토픽이다.
  // 「각 스케줄러 알고리즘의 평균 대기 시간」(SJF·SRT 계산 문제의 말버릇)·쿠버네티스/컨테이너 오케스트레이션 스케줄러·배치 스케줄러는 운영체제 스케줄러 토픽이 아니다
  스케줄러: /^[\s\S]*(?:쿠버네티스|kubernetes|컨테이너오케스트레이션|다중클러스터|배치가스케줄러)[\s\S]*$|스케줄러알고리즘/,
  // 2026-11-15 서브 토픽 이름으로 답안을 찾게 하며 — 「…핵심적인 경제인프라이다」의 「라이다」는 LiDAR 가 아니고,
  // 「화학, 생물, 물리, 정보공학, 사회학 등」의 정보공학은 정보공학 방법론이 아니다
  라이다: /인프라이다|카메라이다/,
  정보공학: /물리정보공학|정보공학사회학/,
  // 「가트너(Gartner) 2026」은 2026년 전략 기술만 — 2016·2020·2022년 10대 기술 문항은 다른 해다
  가트너: /^(?![\s\S]*2026)[\s\S]*$/,
  gartner: /^(?![\s\S]*2026)[\s\S]*$/,
  // 2026-11-15 "토픽이 더 숨어있는거 같다" — 별칭·서브 토픽을 더하며 걸린 딴 뜻:
  // 운영체제의 병행성제어는 DB 동시성제어가 아니고, Rolling Wave Planning 은 차량통신 WAVE 가 아니다. 일정 계산 문항의 활동 이름 「E, D, F」가 EDF 로 읽혔다.
  // Bi-Ba 모델은 BI 가 아니고, DPI·SPI(Packet Inspection)는 인스펙션(리뷰)이 아니며, MVP 패턴(Model-View-Presenter)은 최소 기능 제품이 아니다.
  concurrencycontrol: /운영체제의병행성제어concurrencycontrol/,
  wave: /rollingwave/,
  edf: /^[\s\S]*(?:선행작업|선행활동|주공정|criticalpath|활동기간)[\s\S]*$/,
  bi: /biba/,
  inspection: /packetinspection/,
  mvp: /mvp패턴|^[\s\S]*modelviewpresenter[\s\S]*$/,
  // 2026-11-15 "서브 토픽들 찾아내" — 통신 LoRa(Long Range·LPWAN)는 LoRA(Low-rank adaptation)가 아니다. 9문항이 미세조정 토픽에 걸려 있었다.
  // TCB 는 Trusted Computing Base 이기도 하고, SCM 은 형상관리(Software Configuration Management)·Storage Class Memory 이기도 하다.
  lora: /^[\s\S]*(?:longrange|lorawan|lpwan|nbiot|sigfox|저전력|무선통신|통신기술)[\s\S]*$/,
  tcb: /^[\s\S]*(?:trustedcomputingbase|신뢰컴퓨팅)[\s\S]*$/,
  scm: /^[\s\S]*(?:softwareconfigurationmanagement|storageclassmemory)[\s\S]*$/,
  // 모니터링은 동기화 모니터(Monitor)가 아니고, SSL(Secure Socket Layer)은 소켓 통신이 아니며, JVM 은 가상화의 가상머신이 아니다.
  // MDM 은 Mobile Device Management 이기도 하고, DaaS 는 Data as a Service 이기도 하고, SIL 은 Software-in-the-Loop 이기도 하다.
  // 「G-ITS」가 Git 으로, 일정 계산 문항의 활동 이름 「B, D, D」가 BDD 로 읽혔다.
  모니터: /모니터링/,
  monitor: /monitoring/,
  // CBC(Client Based Computing — 망분리 방식)는 블록 암호 운영 모드 CBC 가 아니다
  cbc: /^[\s\S]*clientbasedcomputing[\s\S]*$/,
  socket: /securesocketlayer|securesocketslayer/,
  virtualmachine: /javavirtualmachine/,
  가상머신: /자바가상머신/,
  mdm: /^[\s\S]*(?:mobiledevicemanagement|모바일단말|byod)[\s\S]*$/,
  daas: /^[\s\S]*dataasaservice[\s\S]*$/,
  sil: /^[\s\S]*softwareintheloop[\s\S]*$/,
  git: /^[\s\S]*greenintelli[\s\S]*$/,
  bdd: /^[\s\S]*(?:선행작업|선행활동|주공정|criticalpath|활동기간)[\s\S]*$/,
  // 자료구조 해시 테이블·해싱 충돌 문항은 암호 해시 함수(서브 토픽)가 아니다
  ...Object.fromEntries(
    ["해시함수", "해쉬함수", "hashfunction", "해시알고리즘", "해쉬알고리즘", "hashalgorithm"].map((k) => [
      k,
      /^[\s\S]*(?:해시테이블|해쉬테이블|hashtable|해싱|충돌해결|해시충돌)[\s\S]*$/,
    ]),
  ),
};

/**
 * 제목 열쇠로는 도저히 안 잡히는 표기 — 토픽마다 손으로 붙인다.
 * 문항이 교재 제목을 한 글자도 안 쓰는 경우다(SOLID 원칙 → "객체지향 설계 원리").
 */
export const EXTRA_ANY: Record<string, string[]> = {
  "객체지향 설계 원리": ["solid원칙", "solid원리"],
  // 교재에 CI/CD 서브노트가 따로 없다 — CI/CD 문항은 데브옵스에서 본다.
  "데브옵스 (DevOps)": ["continuousintegration", "cicd"],
  // 문항은 풀어 쓴 이름만 적는다("AI-DLC(AI-Driven Development Life Cycle)").
  "AI-DLC(AI-Driven SDLC)": ["aidrivendevelopmentlifecycle"],
  // 교재는 "테스트", 문항은 "테스팅".
  "탐색적 테스트": ["탐색적테스팅", "exploratorytesting"],
  // 제목이 "감리/PMO 비교표" 라 PMO 를 다룬 문항을 못 찾았다.
  "감리/PMO 비교표": ["pmo", "pmc"],
};
