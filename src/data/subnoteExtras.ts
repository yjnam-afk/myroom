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
