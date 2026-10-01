/**
 * 심화반 교재 서브노트(원본) — 내가 실제로 보는 교재를 그대로 옮긴 데이터.
 *
 * ★ 이 데이터는 AI가 생성한 topicDetails 보다 항상 우선한다. ★
 *  - 설명 페이지: AI 호출 없이 이 내용을 그대로 보여준다(무료 AI 한도와 무관).
 *  - 두음신공: 여기 keywords 를 정답 근거로 사용한다.
 *  - 답안/채점 프롬프트: 최우선 근거 자료로 주입한다.
 *
 * 새 서브노트가 생기면 SUBNOTES 에 항목만 추가하면 된다.
 */

export type SubnoteTable = {
  caption: string;
  headers: string[];
  rows: string[][];
  /**
   * 교재 항목 이름이 들어가는 열(0부터). 이 열은 칸 너비(5~7칸)를 재지 않는다 —
   * 「사업계획작성(예산확보)」「MIB(Management Information Base)」 같은 교재 이름을
   * 줄이지 않고 그대로 넣기 위해서다. [구분 | 항목 | 설명] 꼴이면 따로 적지 않아도 된다.
   */
  nameCol?: number | number[];
};

export type TextbookSubnote = {
  /** topics.json 의 id (있으면 설명·두음신공이 자동 연결) */
  topicId?: string;
  title: string;
  /** 교재 분류 (CA=컴퓨터구조, OS=운영체제, PM=프로젝트관리, SE=소프트웨어공학,
   *  AI=인공지능, ST=확률·통계, DS=자료구조, AL=알고리즘, NW=네트워크,
   *  DB=데이터베이스, MG=경영전략, SC=보안, DX=디지털서비스) */
  course:
    | "CA" | "OS" | "PM" | "SE" | "AI" | "ST" | "DS" | "AL"
    | "NW" | "DB" | "MG" | "SC" | "DX";
  /**
   * 교재 '■ 정의' 그대로.
   * ★교재에서 빨강·파랑 등 색으로 강조된 단어는 그 토픽의 채점 키워드다.
   *  옮길 때 절대 빼지 말고, 강조 사실이 남도록 **굵게** 표시한다.★
   */
  definition: string;
  /**
   * 답안 서론용 2줄 정의 — 공백 제외 29~30자로 맞춘 버전(2026-09 34~35자에서 축소).
   * ★줄이는 건 조사·수식어이지 강조어가 아니다. definition 에서 색으로
   *  강조됐던 단어는 글자 수를 맞추려고 잘라내면 안 된다 — 그 단어가
   *  빠지면 29~30자를 맞춰도 점수가 나오지 않는다. 종결어(기법/알고리즘/
   *  다이어그램/제도 …)도 그대로 둔다.★
   */
  defShort?: string;
  /** 답안 서론 첫 문장(리드문) — 정의 앞에 깔고 들어가는 배경·필요성 한 줄 */
  lead?: string;
  /**
   * 답안 서론 특징 — 간결한 말 3개(공백 제외 3~8칸).
   * ★교재(정의 강조어·키워드·표·메모)에서 뽑는다. 교재에 「특징」「특성」 표가 있으면
   *  그 항목 이름을 그대로 쓴다. 「기법 다양」「비용 효율」처럼 다른 토픽에 붙여도
   *  참인 빈말은 쓰지 않는다 — 2026-09 에 그런 특징 569개를 교재 근거로 다시 썼다.★
   */
  features?: string[];
  /**
   * 비교 토픽 전용 — 개념별 답안 정의·특징.
   * "A와 B 비교" 류는 두 개념 각각의 29~30자(공백 제외) 정의가 필요하다.
   * defPair 가 있으면 답안 서론에서 defShort 대신 개념별로 보여준다.
   */
  defPair?: {
    name: string;
    def: string;
    features?: string[];
    /** 개념별 리드문 — 소제목 "가. {lead}, {name}의 정의" 로 쓴다 */
    lead?: string;
  }[];
  /**
   * 정의 아래에 덧붙이는 하위 개념 정의 — defPair 와 달리 defShort 를 대체하지 않는다.
   * 예) 단편화 정의 → 가. 내부 단편화 정의 / 나. 외부 단편화 정의.
   */
  subDefs?: {
    name: string;
    def: string;
    lead?: string;
  }[];
  /** 교재 '■ 키워드' 그대로 — 두음신공·답안의 정답 근거 */
  keywords: string[];
  tables: SubnoteTable[];
  /** 교재 하단 보충 메모 */
  notes?: string[];
};

export const SUBNOTES: TextbookSubnote[] = [
  {
    topicId: "ca-17",
    title: "CPU 처리과정",
    course: "CA",
    definition:
      "CPU가 한 개의 명령어를 실행하는데 필요한 과정으로 실행하는 순간부터 중단될 때까지 반복되는 과정",
    defShort: "CPU가 한 개의 명령어를 실행하는데 필요한 과정으로 반복되는 과정",
    lead:
      "명령어 실행의 기본 순환, CPU 처리과정",
    features: ["중단 시까지 반복", "마이크로 연산 단위", "레지스터 경유 전송"],
    keywords: [
      "인출 사이클",
      "실행 사이클",
      "MAR",
      "MBR",
      "PC",
      "M(MAR)",
      "IR",
      "IR(addr)",
      "AC",
      "주소버스",
      "데이터버스",
      "제어버스",
    ],
    tables: [
      {
        caption: "명령어 인출 사이클",
        headers: ["주기", "마이크로 연산", "동작"],
        rows: [
          ["t0", "MAR ← PC", "PC 내용 전송"],
          ["t1", "MBR←M(MAR)\nPC←PC+1", "명령어 적재\nPC 1 증가"],
          ["t2", "IR ← MBR", "명령어 IR 이동"],
        ],
      },
      {
        caption: "명령어 실행 사이클",
        headers: ["주기", "마이크로 연산", "동작"],
        rows: [
          ["t0", "MAR ← IR(addr)", "MBR 저장 주소\nMAR로 전송"],
          ["t1", "MBR ← M(MAR)", "저장할 데이터\nMBR로 이동"],
          ["t2", "AC ← AC + MBR", "MBR과 AC 합\n결과 AC 저장"],
        ],
      },
    ],
  },
  {
    topicId: "ca-120",
    title: "CISC vs RISC",
    course: "CA",
    definition: "명령어 구성 방식에 따른 CPU 유형",
    defShort: "CISC와 RISC로 나뉘는 명령어의 구성 방식에 따른 CPU 유형",
    lead: "명령어 집합의 양대 방식, CISC vs RISC",
    features: ["명령어 복잡도 대비", "가변·고정 길이", "파이프라인 적합성"],
    keywords: [
      "Instruction Set",
      "마이크로 프로그램/하드와이어드",
      "가변/고정 길이 명령어",
      "컴파일러",
      "레지스터",
    ],
    tables: [
      {
        caption: "CISC vs RISC",
        headers: ["구분", "CISC", "RISC"],
        rows: [
          ["구성", "단일 캐쉬 경로\n마이크로 제어", "캐쉬 분리 경로\n하드와이어 제어"],
          ["명령어 세트", "OP·피연산자\n가변 바이트", "피연산자 2개\n32비트 고정"],
          ["정의", "단순~복합 명령\n다수 명령어 구조", "명령 종류 축소\n단순회로 고속"],
          ["사이클", "다중 사이클\n복잡 명령어", "단일 사이클\n단순 명령어"],
          ["메모리", "다수 명령어\n메모리 참조", "Load 적재\nStore 저장"],
          ["파이프라인", "파이프라인\n적용 어려움", "고도 파이프라인\n슈퍼 스칼라"],
          ["제어기법", "마이크로 코드\n프로그램 제어", "하드와이어\n회로 제어"],
          ["명령어 형식", "여러 형식 명령어", "고정형식 명령어"],
          ["명령어 길이", "가변 길이 상이", "32비트 동일"],
          ["컴파일러", "컴파일러 복잡", "단순 컴파일러"],
          ["레지스터", "소수 레지스터", "다중 레지스터"],
          ["회로구성", "회로 구성 복잡", "회로 구성 단순"],
          ["사례", "Intel 계열", "ARM 계열"],
        ],
      },
    ],
  },
  {
    topicId: "ca-102",
    title: "Pipeline(파이프라인)",
    course: "CA",
    definition:
      "CPU의 프로그램 처리 속도를 높이기 위해 CPU의 명령어 처리 과정을 여러 단계로 나누어 동시에 처리하는 기술",
    defShort: "CPU의 명령어 처리 과정을 여러 단계로 나누어 동시에 처리하는 기술",
    lead: "명령어 중첩의 속도 향상, 파이프라인",
    features: ["명령어 중첩 처리", "시간·공간 병렬", "해저드 존재"],
    keywords: [
      "단일 파이프라인",
      "슈퍼 파이프라인",
      "슈퍼스칼라",
      "슈퍼파이프라인을 이용한 슈퍼스칼라",
      "VLIW",
    ],
    tables: [
      {
        caption: "파이프라인 구성에 따른 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["기본", "단일 파이프라인", "단계별 1회 중첩 효과적 병렬 처리"],
          ["시간적 병렬", "슈퍼 파이프라인", "엇갈린 중첩 각 단계 중첩 수행\n단계 세분화 수행 시간 단축"],
          ["공간적 병렬", "슈퍼 스칼라", "다중 기능 유닛 사이클당 다중\n2세대 기법 명령어 동시 처리"],
          ["복합", "슈퍼 파이프라인 이용한 슈퍼스칼라", "슈퍼스칼라+ 다중 중첩 병렬화\n슈퍼파이프라인 엇갈려 시간 단축"],
          ["컴파일러 기반", "VLIW (Very Long Instruction Word)", "컴파일러 추출 동시 수행 명령\n단일 명령어 압축 압축 후 실행"],
        ],
      },
    ],
  },
  {
    topicId: "ca-106",
    title: "Pipeline Hazard",
    course: "CA",
    definition: "파이프라인 프로세스에서 명령어 의존성을 발생시킬 수 있는 문제",
    defShort: "파이프라인 프로세스에서 명령어 의존성을 발생시킬 수 있는 해저드 문제",
    lead:
      "파이프라인 성능 저하 요인, Pipeline Hazard",
    features: ["명령어 의존성 기인", "파이프라인 지연", "하드웨어 완화 가능"],
    keywords: ["구조적 해저드", "데이터 해저드", "제어 해저드"],
    tables: [
      {
        caption: "유형 (구데제)",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["자원 충돌", "구조적 해저드", "HW 자원 충돌 동시 수행 미지원\n폰노이만 구조 단일 메모리 공유"],
          ["명령 종속", "데이터 해저드", "이전 결과 종속 결과 대기 발생\nRAW·WAR WAW 동일 문제"],
          ["분기 예측", "제어 해저드", "분기 명령 발생 Jump 브랜치\n후속 명령 선적재 4클럭 폐기"],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["유형", "해결방안"],
        rows: [
          ["구조적 해저드", "리소스 추가\n하드웨어 추가\nHavard 아키텍처\n메모리 인터리빙"],
          ["데이터 해저드", "Register Renaming\nStall (Hardware Interlocks)\nChange Clock Cycle"],
          ["데이터 해저드", "Operand Forwarding\nRestrict software"],
          ["제어 해저드", "Stall\nPredict Branch\n(Taken / Not Taken)"],
          ["제어 해저드", "지연분기(Delayed branch)\nFast branches\nLoop Buffer\nBranch target buffer"],
        ],
      },
    ],
    notes: ["명령어 예제) ADD R1, R2, RC / SUB R4, R5, R1 — R1 쓰기 완료 전 R1 읽기 시 데이터 해저드"],
  },
  {
    title: "MMU(Memory Management Unit)",
    course: "CA",
    definition:
      "CPU가 메모리에 접근하도록 관리하는 하드웨어 부품으로 가상 메모리 주소를 실제 메모리 주소로 변환해 주는 장치",
    defShort: "메모리 접근 관리, 가상 메모리 주소를 실제 메모리 주소로 변환하는 장치",
    lead:
      "가상 주소 변환의 하드웨어, MMU",
    features: ["하드웨어 주소 변환", "페이지 테이블 기반", "메모리 접근 관리"],
    keywords: ["가상 주소", "물리주소", "주소변환", "TTB"],
    tables: [
      {
        caption: "주소 변환 과정",
        headers: ["과정", "설명"],
        rows: [
          ["① 가상주소 전달", "CPU→MMU 가상주소 전달"],
          ["② 페이지 테이블 검색", "TTB부터 페이지 테이블 검색"],
          ["③ 페이지 테이블 엔트리 전달", "물리주소 찾아 MMU에 전달"],
          ["④ 물리주소 접근", "MMU 주소신호 발생(RAS, CAS)"],
          ["⑤ 데이터 전달", "데이터 출력해 CPU에 전달\n가상주소 통해 데이터 수신"],
        ],
      },
    ],
  },
  {
    topicId: "ca-78",
    title: "캐시(Cache) 메모리의 사상 방식(Mapping Scheme)",
    course: "CA",
    definition: "주기억장치에서 필요한 정보를 캐시기억장치에 정보를 교환하는 기법",
    defShort: "주기억장치에서 필요한 정보를 캐시기억장치에 정보를 교환하는 기법",
    lead: "주기억장치·캐시 대응 기법, 캐시 사상 방식",
    features: ["주소 기반 위치 결정", "태그 비교 적중 판정", "적중률·비용 상충"],
    keywords: [
      "직접 사상(태그, 라인, 단어)",
      "완전 연관 사상(태그, 단어)",
      "집합 연관 사상(태그, 세트, 단어)",
    ],
    tables: [
      {
        caption: "직접 사상(direct mapping) 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["개념", "개요", "특정 라인 적재 블록별 고정 위치\n해당 라인만 검사 적중 여부 판정"],
          ["동작절차", "캐시 라인 선택", "s비트 라인번호 캐시 라인 선택"],
          ["동작절차", "태그 비교", "태그 비트 비교 선택 라인 대조"],
          ["동작절차", "캐시 적중/캐시 미스", "일치 시 적중 라인 내 단어 인출\n불일치 시 적재 태그 기록 후 교체"],
        ],
      },
      {
        caption: "완전-연관 사상(fully-associative mapping) 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["개념", "개요", "임의 라인 적재 위치 제약 없음"],
          ["동작절차", "태그 비교", "전 슬롯 태그 비교 내용 전체 대조"],
          ["동작절차", "캐시 적중/캐시 미스", "일치 슬롯 존재 캐시 적중 처리\n일치 슬롯 부재 캐시 미스 처리"],
        ],
      },
      {
        caption: "집합-연관 사상(set-associative mapping) 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["개념", "개요", "캐시 세트 공유 주기억 블록 그룹\n세트당 다중 라인 2개 이상 적재"],
          ["동작절차", "세트 선택", "세트 비트 이용 세트 하나 선택"],
          ["동작절차", "태그 비교", "세트 내 태그 태그 대조 수행"],
          ["동작절차", "캐시 적중/캐시 미스", "일치 시 적중 CPU로 인출\n불일치 시 미스 교체 라인 결정"],
        ],
      },
    ],
  },
  {
    topicId: "os-2",
    title: "커널(Kernel)",
    course: "OS",
    definition:
      "컴퓨터 하드웨어와 응용 프로그램과의 연계를 위하여 자원관리, 프로세스/네트워크 관리 및 추상화를 수행하는 운영체제의 핵심 프로그램",
    defShort: "자원관리, 프로세스/네트워크 관리 및 추상화 수행 OS 핵심 프로그램",
    lead:
      "운영체제의 핵심 관리자, 커널",
    features: ["HW 자원 추상화", "특권 모드 실행", "시스템 콜 경유 접근"],
    keywords: [
      "프로세스 관리 및 CPU Scheduling",
      "메모리 관리",
      "I/O Device 관리",
      "IPC(Inter Process Communication)",
      "네트워크",
      "File System",
      "운영모드/커널모드",
      "모놀리틱 커널/마이크로 커널",
    ],
    tables: [
      {
        caption: "커널의 주요 역할",
        headers: ["구분", "역할", "설명"],
        rows: [
          ["물리 자원", "하드웨어 제어", "인터럽트 처리 핸들러 동작\n특권 명령 물리 자원 제어"],
          ["실행 자원", "프로세스 관리", "PCB·스케줄링 상태 전이 관리\n문맥교환 CPU 배분"],
          ["실행 자원", "메모리 관리", "가상 메모리 페이징 주소 변환\n페이지 교체 단편화 관리"],
          ["물리 자원", "입출력(I/O) 관리", "장치 드라이버 주변 장치 교환\nDMA·VFS 파일 접근 제공"],
          ["접근 통로", "시스템 콜(System Call)", "모드 전환 Trap 전환\n커널 API HW 자원 보호"],
        ],
      },
      {
        caption: "커널 구조의 유형 — 단일·계층·마이크로",
        headers: ["구조 유형", "설명", "특징"],
        rows: [
          ["단일(Monolithic) 구조", "모든 관리 기능\n하나의 커널", "성능 좋음\n버그 가능성 높음"],
          ["계층(Layered) 구조", "시스템 콜→관리\n→HW 제어 층", "층 나눠 구성\n상위가 하위 이용"],
          ["마이크로(Micro) 구조", "IPC·스케줄러\n나머지는 서버", "커널 작음\n품질 관리 용이"],
        ],
      },
      {
        caption: "커널의 종류",
        headers: ["종류", "설명", "적용 사례"],
        rows: [
          ["모놀리틱(Monolithic) 커널", "전 기능 직접 제어", "UNIX·Linux"],
          ["마이크로(Micro) 커널", "기본 기능만 제공", "–"],
          ["하이브리드(Hybrid) 커널", "모놀리틱+마이크로\n일부 성능 개선", "Windows\nmacOS"],
          ["엑소(Exo) 커널", "약한 추상화 경량", "임베디드 OS"],
          ["유니(Uni) 커널", "한 주소 공간 경량", "–"],
        ],
      },
      {
        caption: "모놀리틱 커널과 마이크로 커널의 비교",
        headers: ["구분", "모놀리딕 커널", "마이크로 커널"],
        rows: [
          ["정의", "관리자 모드 동작\n고수준 플랫폼", "사용자 영역 구현\n최소 기능 제공"],
          ["구성", "VFS 드라이버\n메모리 관리 등", "IPC·스케줄\n메모리 관리만"],
          ["안정성", "커널 역할 큼\n버그 가능성 높음", "커널 자체 작음\n품질 관리 용이"],
          ["성능", "시스템 콜 호출\n오버헤드 발생", "서버 튜닝 용이\n최적화 여지 많음"],
          ["활용", "복잡 앱 동적 수행\n범용 PC 활용", "임베디드 시스템\n네트워크 장비 등"],
        ],
      },
      {
        caption: "CPU의 2가지 실행 모드",
        headers: ["모드", "설명"],
        rows: [
          ["운영 모드(user mode)", "사용자 앱 실행\n제한된 권한\n시스템 호출 사용"],
          ["시스템 호출(system call)", "커널 기능 사용\n인터페이스 제공"],
          ["커널 모드(kernel mode)", "운영체제 기능\n최고 권한 소유\nHW 직접 접근"],
        ],
      },
    ],
    notes: [
      "교재 구조도: System Call Interface → 파일 시스템 관리 / I/O 관리(Device Drivers) / 메모리 관리 / 프로세스 관리 · 스케줄러 · IPC · 동기화 / Protection → Hardware Control(Interrupt Handler..) → Hardware",
      "커널 보호: 사용자 모드와 Supervisor 모드를 분리하는 CPU Level Ring(Ring 0 커널 ~ Ring 3 사용자)으로 답안을 닫으면 좋다 — 15점 답안에서 Good",
      "시스템 콜 상세(6유형 — 프로세스 제어·파일 조작·장치 관리·정보 유지·통신·보호, 유저↔커널 모드 전환 5단계, 두 모드 비교)는 '시스템 콜(System Call)' 토픽에 정리",
    ],
  },
  {
    topicId: "ca-25",
    title: "DMA(Direct Memory Access)",
    course: "CA",
    definition:
      "CPU를 통하지 않고 주변장치(I/O 장치)와 주기억장치 사이의 데이터 전송을 담당하는 장치",
    defShort: "CPU를 통하지 않고 주변장치와 주기억장치 간 데이터 전송 담당 장치",
    lead: "CPU 개입 없는 전송, DMA",
    features: ["CPU 비경유 전송", "버스 사이클 점유", "CPU 부하 경감"],
    keywords: [
      "단일버스분리식",
      "단일버스통합형",
      "입출력버스",
      "Burst Mode",
      "Cycle Stealing",
      "Interleaved DMA",
    ],
    tables: [
      {
        caption: "연결 방식에 의한 모드",
        headers: ["구분", "동작모드", "설명"],
        rows: [
          ["단일 버스", "단일버스 분리 방식", "버스 직접 연결 입출력 모듈 공유\n버스 2회 사용 성능 저하 발생"],
          ["단일 버스", "단일버스 통합방식", "버스 1회 사용 버스 부담 감소\nDMA 하위 배치 입출력 모듈 종속"],
          ["이중 버스", "입출력 버스 방식", "입출력버스 추가 두 버스 모두 사용"],
        ],
      },
      {
        caption: "전송 방식에 의한 모드",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["연속 점유", "Burst Mode (Block Mode)", "블록 단위 전송 워드 블록 연속\n버스 사이클 독점 종료 시까지 점유"],
          ["교차 점유", "Cycle Stealing Mode (Word Mode)", "1 word 전송 사이클 훔침\nDMA 우선 제어 버스 경합 시 우선"],
          ["요구 기반", "Demand Transfer Mode", "Burst 유사 블록 전송 방식\nDREQ 기반 비활성 시 중지"],
          ["유휴 활용", "Interleaved DMA", "CPU 미사용 시 DMA 버스 사용"],
        ],
      },
    ],
  },
  {
    title: "메모리 단편화(Fragmentation)",
    course: "CA",
    definition:
      "메모리 상에서 프로그램에 의해 사용되지 못하고 낭비되는 공간이 발생하는 현상",
    defShort: "메모리에서 프로그램에 사용되지 못하고 낭비되는 공간이 발생하는 현상",
    lead:
      "메모리 공간의 낭비 현상, 메모리 단편화",
    features: ["낭비 공간 발생", "분할 방식 의존", "공간 재배치 해소"],
    keywords: [
      "낭비되는 공간",
      "내부단편화",
      "외부단편화",
      "통합",
      "압축",
      "메모리 풀",
      "버디 메모리 시스템",
      "슬랩 할당자",
    ],
    tables: [
      {
        caption: "메모리 단편화 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["고정 분할", "내부 단편화", "고정 분할 잔여 적재 후 남는 공간\n과대 할당 낭비 요구보다 큰 할당"],
          ["가변 분할", "외부 단편화", "분할 크기 부족 프로그램 미적재\n할당·교체 반복 작은 공간 산재"],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["공간 재배치", "통합", "인접 공간 통합 단편 하나로 결합"],
          ["공간 재배치", "압축", "분산 공간 결합 큰 가용 공간 생성"],
          ["관리 기법", "가상메모리 관리기법 활용", "페이징 동일 크기 외부단편화 방지\n세그먼트 가변 내부단편화 방지"],
          ["할당 기법", "Memory Pool 활용", "객체 크기별 분할 포인터 기반 관리"],
          ["할당 기법", "Buddy System", "고정·가변 절충 단편화 방지 보완\n프레임 그룹화 미사용 페이지"],
          ["할당 기법", "Slab Allocator", "프레임 작게 분할 작은 크기 공간화\n동적 할당·해제 요청 시 소량 할당"],
        ],
      },
      {
        caption: "단편화 발생 원인",
        headers: ["유형", "원인", "설명"],
        rows: [
          ["내부 단편화", "할당 크기 차이", "분할 영역 초과"],
          ["내부 단편화", "고정 분할 기법", "크기 무관 분할"],
          ["외부 단편화", "불연속 할당", "빈 공간 불연속"],
          ["외부 단편화", "가변 분할 기법", "불연속 낭비 발생"],
        ],
      },
    ],
    notes: [
      "연결 구조: OS 관점의 단편화(Fragmentation) 토픽과 짝 — 고정 분할(페이징)→내부 단편화, 가변 분할(세그멘테이션)→외부 단편화. 해결 방법에 '가상메모리 관리기법 활용'이 들어 있어 CA(물리 메모리)와 OS(가상 메모리)가 순환 연결된다",
      "할당자 상세: 위 표의 Buddy System·Slab Allocator가 각각 어느 단편화를 줄이는지는 OS 단편화 토픽의 「커널 메모리 할당자」 표에 정리 — 버디는 외부, 슬랩은 내부",
    ],
  },
  {
    topicId: "ca-214",
    title: "CXL(Compute Express Link) 3.0",
    course: "CA",
    definition:
      "CPU와 메모리·가속기 간 저지연 데이터 통신과 캐시 일관성을 지원하며, CXL Switch/Fabric을 통해 메모리 공유·Pooling 및 확장을 제공하는 차세대 컴퓨팅 인터페이스",
    defShort: "Fabric을 통해 메모리 공유·Pooling·확장 인터페이스",
    lead: "메모리 벽을 넘는 연결, CXL 3.0",
    features: ["PCIe 6.0 기반", "패브릭 구조 지원", "메모리 풀링 및 공유"],
    keywords: ["PCIe 6.0 기반", "Fabric 구조", "메모리 Pooling/Sharing"],
    tables: [
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["대역폭", "PCIe 6.0 기반 도입", "PCIe 6.0 대역폭 2배 향상\n64GT/s 256GB/s"],
          ["확장성", "패브릭(Fabric) 구조 지원", "다단계 스위칭 랙 간 연결 지원\n4,096 노드 유연한 노드 확장"],
          ["메모리", "메모리 풀링 및 공유", "CPU 미경유 중앙 처리 우회\n장치 직접 접근 데이터 병목 극복"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["Host", "CPU / SoC", "루트 포트 연결"],
          ["인터페이스", "CXL Link", "고속 데이터 전송"],
        ],
      },
      {
        caption: "프로토콜·Fabric·Device·메모리 관리",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["프로토콜", "CXL.io", "장치 검색·설정 및 I/O 통신 담당"],
          ["프로토콜", "CXL.cache", "Host 메모리 접근 Cache Coherency"],
          ["프로토콜", "CXL.mem", "Host가 Device 메모리 직접 접근"],
          ["Fabric", "CXL Switch", "Host 하나에 여러 CXL Device 연결"],
          ["Fabric", "Multi-Level Switching", "대규모 CXL Fabric 구성 지원"],
          ["Device", "CXL Memory", "외부 메모리 연결 Host 용량 확장"],
          ["Device", "Accelerator", "GPU·NPU CPU 간 일관성 데이터 공유"],
          ["메모리 관리", "Memory Pooling", "다중 Host 메모리 공유 활용률 향상"],
          ["메모리 관리", "Memory Sharing", "Host·Device 공유 복사·이동 감소"],
        ],
      },
      {
        caption: "서브 프로토콜 상세",
        headers: ["서브 프로토콜", "주요 목적", "설명"],
        rows: [
          ["CXL.io", "PCIe 기능\n낮은 접근 지연", "탐색·DMA\n모든 유형 공통"],
          ["CXL.cache", "비대칭형 일관성\nMESI 사용", "호스트가 책임\n스눕 트랜잭션"],
          ["CXL.mem", "메모리 접근\n로컬처럼 사용", "주변장치 메모리\n64B 라인 단위"],
        ],
      },
      {
        caption: "CXL 장치 유형(Device Type)",
        headers: ["장치 유형", "사용 프로토콜", "대표 사례"],
        rows: [
          ["Type 1", "CXL.io\nCXL.cache", "NIC\n무메모리 가속기"],
          ["Type 2", "CXL.io+cache\nCXL.mem", "HBM GPU\nFPGA 보드"],
          ["Type 3", "CXL.io\nCXL.mem", "DRAM 확장\n비휘발성 메모리"],
        ],
      },
    ],
    notes: [
      "개념도: Accelerator(Accelerator Logic + Accelerator Memory) ↔ CXL.io(PCIe: 검색·설정·초기화·인터럽트·DMA·ATS·오류신호) / CXL.cache(Coherent requests) / CXL.mem(Memory Flows) ↔ Host Processor(Coherence·Cache Logic, PCIe Logic, IA Core, I/O Device) ↔ Host Memory",
      "세 프로토콜의 방향: CXL.io는 장치 관리, CXL.cache는 Device→Host 메모리 접근, CXL.mem은 Host→Device 메모리 접근 — 누가 누구의 메모리를 보는지로 갈라 외운다",
      "연결 구조: 캐시 일관성(Cache Coherence)·MESI와 한 줄 — 가속기가 Host 메모리를 캐시할 때 일관성을 어떻게 유지하는가가 CXL.cache의 일이다",
      "한 줄로: PCIe 6.0 위에서 CPU·메모리·저장장치·가속기를 한 규격으로 잇는 통합 인터페이스 — 답안은 '메모리 벽을 넘는 연결'로 여는 것이 자연스럽다",
      "물리 계층은 PCIe PHY에 CXL logical PHY를 더한 형태 — 그 위 MUX가 CXL.io 트랜잭션과 CXL.mem·CXL.cache 트랜잭션을 구분하고, MUX 위에 서브 프로토콜별 링크·트랜잭션 계층이 놓인다",
    ],
  },
  {
    topicId: "ca-47",
    title: "I2C(Inter Integrated Circuit)와 SPI(Serial Peripheral Interface)",
    course: "CA",
    definition: "시리얼(Serial) 통신 방식",
    defShort: "보드 내 마이크로프로세서와 주변 기기 통신 위한 동기식 시리얼 통신 방식",
    lead: "임베디드 직렬 통신 방식, I2C와 SPI",
    features: ["클럭 동기식 직렬", "마스터 주도 통신", "배선·속도 상충"],
    keywords: ["SCL", "SDA", "CS", "SCLK", "MOSI", "MISO", "100kbps", "70MHz"],
    tables: [
      {
        caption: "I2C vs SPI",
        headers: ["구분", "I2C", "SPI"],
        rows: [
          ["정의", "클럭·데이터 2선\n표준모드 100Kbps\n반이중 동기식", "범용 고속 I/O\n4개 라인\n전이중 동기식"],
          ["동작 방식", "시작 신호 점유\nR/W 정보 전송", "CS 슬레이브 선택\nSCLK 통신 시작\nMOSI/MISO 전송"],
          ["통신방식", "반 이중 통신", "전 이중 통신"],
          ["구성", "클럭·데이터\nSCL·SDA", "CS·SCLK\nMISO 등 4선"],
          ["연결", "공유 버스 구조", "1:1 연결 구조"],
          ["속도", "표준모드 저속\n100kbps", "고속 통신\n70MHz"],
          ["전력소모", "전력 소모 높음", "전력 소모 낮음"],
        ],
      },
    ],
  },
  {
    topicId: "ca-76",
    title: "캐시메모리의 쓰기정책(Write Policy)",
    course: "CA",
    definition: "캐시(Cache)와 주기억장치에 기록하는 시점에 대한 정책",
    defShort: "캐시(Cache)와 주기억장치에 기록하는 시점에 대한 쓰기 정책",
    lead: "주기억장치 기록 시점 선택, 캐시 쓰기정책",
    features: ["기록 시점 결정", "일관성·속도 상충", "캐시 일관성 연계"],
    keywords: ["Write Through", "Write Back", "Cache Coherence"],
    tables: [
      {
        caption: "Write Through vs Write Back",
        headers: ["구분", "Write Through", "Write Back"],
        rows: [
          ["구성도", "동시 쓰기 방식\n캐시+주기억", "나중 쓰기 방식\n캐시만 기록"],
          ["동작원리", "쓰기 시 동시 기록\n주기억 즉시 반영", "더티 비트 설정\n스왑아웃 시 복사"],
          ["일관성", "일관성 항상 보장", "블록 교체 시 보장"],
          ["장점", "단순한 구조\n낮은 복잡도", "쓰기 동작 최소화\n쓰기 시간 단축"],
          ["단점", "버스 트래픽 증가\n쓰기 시간 증가", "일관성 유지 곤란\n더티 비트 확인"],
        ],
      },
    ],
  },
  {
    topicId: "ca-83",
    title: "캐시 플러시(Cache Flush)",
    course: "CA",
    definition:
      "캐시 메모리 전체 혹은 일부를 무효화(invalidate)하고 주 메모리에서 다시 읽어 들일 필요가 있을 경우 메모리에 데이터 저장 없이 캐시를 비우는 동작",
    defShort: "캐시 전체 혹은 일부를 무효화하고 데이터 저장 없이 캐시를 비우는 동작",
    lead:
      "캐시 무효화와 재적재, 캐시 플러시",
    features: ["캐시 무효화", "메모리 저장 없음", "더티 비트 리셋"],
    keywords: ["invalidate", "dirty bit", "valid bit", "cache flush", "cache clean"],
    tables: [
      {
        caption: "캐시(Cache) 상태",
        headers: ["상태", "설명"],
        rows: [
          ["Valid Bit(유효 비트)", "Cache Line이 활성화 상태 /\nCache Block의 데이터가 유효"],
          ["Dirty Bit(더티 비트)", "Data가\n변경되었는지\n파악"],
        ],
      },
      {
        caption: "캐시(Cache) Flush와 Clean",
        headers: ["구분", "동작", "설명"],
        rows: [
          ["무효화", "Cache Flush", "캐시 데이터 무효 알림\nDirty Bit 0으로 reset"],
          ["반영", "Cache Clean", "캐시 데이터 메인 메모리 저장\nDirty Bit 1 메모리 반영 후 0 초기화"],
        ],
      },
    ],
  },
  {
    topicId: "ca-77",
    title: "캐시 일관성(Cache Coherence)",
    course: "CA",
    definition:
      "공유 메모리 시스템에서 각 클라이언트(혹은 프로세서)가 가진 로컬 캐시 간의 일관성",
    defShort: "공유 메모리에서 각 클라이언트(혹은 프로세서)의 로컬 캐시 간 일관성",
    lead:
      "다중 캐시의 데이터 일치, 캐시 일관성",
    features: ["쓰기 시 불일치 발생", "상태 기반 유효 판단", "HW·SW 해결 기법"],
    keywords: [
      "SW 기법",
      "HW 기법",
      "공유 캐시 사용",
      "공유변수 캐시 미사용",
      "디렉토리(디풀리차)",
      "스누피(버스갱무)",
    ],
    tables: [
      {
        caption: "SW 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["캐시 공유", "공유 캐시 사용", "모든 프로세서 하나의 공유 캐시\n항상 캐시 일관성 유지\n캐시 액세스 충돌 빈번 성능 저하"],
          ["캐시 배제", "공유 변수 캐시 미사용", "공유 데이터 주기억 장치에만 기록\nLock 변수·프로세스 큐 캐시 불가\n임계 영역 보호 데이터 캐시 불가\n캐시 적중률·I/O 성능 저하"],
        ],
      },
      {
        caption: "HW 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["중앙 집중", "디렉토리 프로토콜", "공유 상태 기록 디렉토리 이용\nFull Map: 모든 포인터 저장\nLimited: 기억장소 부담 감소\nChained: linked list 연결"],
          ["분산 감시", "스누피 프로토콜(Snoopy Protocol)", "주소 버스 감시 메모리 접근 감지\n스누피 제어기: 감지 후 상태 조절\n쓰기 갱신: 갱신 정보 전송\n쓰기 무효: Invalid 브로드캐스팅"],
        ],
      },
      {
        caption: "프로토콜",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["프로토콜", "MESI 프로토콜", "M(수정)·E(배타)\nS(2개 이상 공유)·I(타 캐시 수정)\n4가지 상태로 유효성 판단"],
          ["프로토콜", "그 외 프로토콜", "MEI·MSI·MOESI·MESIF\nO(Owned): 변경 블록 타 곳 읽음\nF(Forwarding): 대표 할당"],
        ],
      },
      {
        caption: "캐시 불일치 발생 원인",
        headers: ["원인", "설명"],
        rows: [
          ["멀티 프로세서 환경", "프로세서별 로컬\n캐시에 같은\n데이터가 복사됨"],
          ["변경 가능한 데이터의 공유", "한 캐시의 쓰기가\n다른 캐시에\n반영되지 않음"],
          ["입출력 동작(I/O Activity)", "I/O가 메모리를\n직접 바꿔 캐시와\n어긋남"],
        ],
      },
    ],
    notes: [
      "쓰기 정책과의 연결: 변경된 캐시 값은 즉시 쓰기(Write through) 또는 지연 쓰기(Write back)로 메인 메모리에 반영되어 공유 — 두 방식 모두 불일치가 가능하므로 유지 기법이 필요 / Write through는 VI 프로토콜, Write back은 MSI·MESI·MOSI·MOESI (NS 19기 2주차 2교시 4번)",
    ],
  },
  {
    topicId: "ca-56",
    title: "메모리 인터리빙(Interleaving)",
    course: "CA",
    definition:
      "버스의 경합이나 기억장치의 충돌 회피를 위하여 기억장치를 여러 개의 독립적인 모듈들로 나누고 모듈들에서 동시에 엑세스 동작이 일어날 수 있도록 하는 기법",
    defShort: "기억장치를 독립 모듈로 나눠 모듈들에서 동시에 엑세스 동작하는 기법",
    lead:
      "기억장치 동시 접근 기법, 메모리 인터리빙",
    features: ["독립 모듈 분할", "동시 액세스", "버스 경합 회피"],
    keywords: [
      "상위 인터리빙",
      "하위 인터리빙",
      "혼합 인터리빙",
      "C-Access",
      "S-Access",
    ],
    tables: [
      {
        caption: "메모리 인터리빙 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["순차 접근", "상위 인터리빙", "순차 주소 지정 모듈별 연속 주소\n상위 비트 모듈 하위 비트 장소"],
          ["병렬 접근", "하위 인터리빙", "모듈 단위 교차 주소 순환 배치\n하위 비트 모듈 상위 비트 장소"],
          ["절충", "혼합 인터리빙", "상위 인터리빙 뱅크 그룹 선택\n하위 인터리빙 뱅크 내 모듈 간"],
        ],
      },
      {
        caption: "메모리 인터리빙 접근방식",
        headers: ["구분", "설명"],
        rows: [
          ["C-ACCESS", "주소 순차 도착\n순차 Data Read·CPU 전송\n액세스 시간 T=Ta+(M*tb)\nTa 액세스·M 모듈 수·tb 버스 주기"],
          ["S-ACCESS", "주소 모두 도착 시 동시 Data Read\n읽은 Data 순차 CPU 전송\n액세스 시간 T=Ta+(M*tb)\nTa 액세스·M 모듈 수·tb 버스 주기"],
        ],
      },
    ],
  },
  {
    topicId: "ca-81",
    title: "MESI",
    course: "CA",
    definition:
      "캐시의 일관성을 유지하기 위해서 별도의 Flag를 할당한 후 Flag의 상태를 확인하여 데이터의 유효 여부를 판단할 수 있는 프로토콜",
    defShort: "캐시의 일관성 유지 위해 Flag 상태로 데이터 유효 여부 판단 프로토콜",
    lead:
      "캐시 일관성 유지 프로토콜, MESI",
    features: ["캐시 일관성 유지", "상태 Flag 기반", "쓰기 시 무효화"],
    keywords: ["Cache Coherence", "Modify", "Exclusive", "Shared", "Invalid"],
    tables: [
      {
        caption: "MESI 상태",
        headers: ["구분", "세부 상태", "설명"],
        rows: [
          ["수정(Modify)", "데이터가 수정(변경)된 상태", "캐시 라인 수정됨(주기억과 다름)\n그 라인은 이 캐시에만 있음"],
          ["배타(Exclusive)", "유일한 복사본, 주기억 장치와 동일", "주기억장치 내용과 동일\n다른 캐시에는 존재하지 않음"],
          ["공유(Shared)", "두 개 이상 캐시에 데이터가 적재", "주기억장치 내용과 동일\n다른 캐시에도 있을 수 있음"],
          ["무효(Invalid)", "다른 프로세스에 의해 수정된 데이터", "캐시 라인에 유효 데이터 없음"],
        ],
      },
    ],
    notes: [
      "상태 전이(매커니즘): (1) Read miss (2) Write hit (3) Read miss (4) Cache miss (5) Invalidate signal (6) Write hit (7) Read miss (8) Write miss",
      "검은 화살표 = 프로세스 동작에 의한 전이, 빨간 화살표 = 다른 캐시의 변화에 의한 전이",
    ],
  },
  {
    topicId: "ca-135",
    title: "HA(High Availability)",
    course: "CA",
    definition:
      "두 대 이상의 시스템을 하나의 클러스터로 묶어, 한 시스템 장애시 최소한의 서비스 중단을 위해 클러스터 내의 다른 시스템에 신속하게 서비스를 Fail-Over하여 업무 연속성 유지 위한 메커니즘",
    defShort: "클러스터 다른 시스템 Fail-Over로 업무 연속성 유지 메커니즘",
    lead:
      "업무 연속성 보장 기술, HA(고가용성)",
    features: ["Heart-beat 감시", "신속 Fail-Over", "업무 연속성 유지"],
    keywords: ["Heart-beat", "Hot Standby", "Mutual Takeover", "Concurrent Access"],
    tables: [
      {
        caption: "구성 유형",
        headers: ["구성유형", "내용"],
        rows: [
          ["Hot Standby", "가동·백업 시스템 구성\n평상시 백업 대기상태 유지\n장애 발생 시 자원 Take-over\n외장 디스크 장애 시만 백업 접근"],
          ["Mutual Takeover", "각자 고유 가동 업무 수행\n장애 시 상대 자원 Failover\n동시에 2개 업무 수행\n외장 디스크 해당 시스템만 접근"],
          ["Concurrent Access", "여러 시스템 업무 나누어 병렬 처리\n시스템 전체 Active 상태 수행\n장애 시 Failover 없이 가용성 보장"],
        ],
      },
    ],
    notes: ["Heartbeat: HA 통신라인으로 서로의 상태를 모니터링"],
  },
  {
    topicId: "ca-136",
    title: "결함허용 컴퓨터(FTS)",
    course: "CA",
    definition:
      "하드웨어 혹은 소프트웨어의 결함 또는 고장이 발생하여도 정상적 혹은 부분적으로 기능을 수행할 수 있는 시스템",
    defShort: "HW·SW 결함 또는 고장이 발생해도 정상적·부분적 기능 수행 시스템",
    lead:
      "결함 속 지속 동작 시스템, 결함허용 컴퓨터",
    features: ["점진적 성능 저하", "다중화 기반", "결함 파급 차단"],
    keywords: ["Graceful Degradation", "결함 감지", "결함 진단", "결함 통제", "결함 복구"],
    tables: [
      {
        caption: "단계별 특성 (감진통복)",
        headers: ["기능", "내용"],
        rows: [
          ["결함감지", "Fault Detection\n시스템 내 결함 발생·내용 감지"],
          ["결함진단", "Fault Diagnosis\n결함 원인/위치/파급효과 판단"],
          ["결함통제", "Fault Isolation\n결함으로 인한 오류 파급 차단"],
          ["결함복구", "Fault Recovery\nReconfiguration\n결함요소 제거\n시스템 재구성"],
        ],
      },
      {
        caption: "관점별 기법 — Hardware",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["다중화", "TMR (Triple Modular Redundancy)", "3개 이상 CPU 동일 입력 연산"],
          ["다중화", "Duplication with Comparison", "하드웨어 2중화 중복 구성 비교\n2개 프로세서 동기 상태 수행"],
          ["대기 예비", "Stand by Sparing", "여분 하드웨어 결함 감지 대비"],
          ["감시", "Watchdog Timer", "주기적 타이머 가동 위한 초기화"],
          ["저장 장치", "RAID", "디스크 미러링 패리티 비트 활용"],
          ["자가 정화", "Self-Purging Redundancy", "오류 출력 배제 계산 과정 제외"],
        ],
      },
      {
        caption: "관점별 기법 — Software",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["복구 시점", "Check point", "검사시점 설정 S/W 수행 중\n이전 시점 복귀 오류 시 재수행"],
          ["복구 블록", "Recovery Block", "롤백·재시도 단일 프로세서\n대체 모듈 수행 다른 S/W 모듈"],
          ["복구 블록", "Conversation", "복구 블록 확장 롤백 재시도 기반\n복수 프로세서 정보 교환 간 적용"],
          ["복구 블록", "Distributed Recovery Block", "분산 환경 롤백 복구 블록 분산화\n결함 동일 대처 HW·SW 결함"],
          ["다중 버전", "N self-checking programming", "자가진단 결함 컴포넌트 점검\n1 수행·1 대기 2개 이상 병행"],
          ["다중 버전", "N version programming", "TMR 유사 기법 HW 3중화 유사\nN개 독립 모듈 다수 결과 채택"],
        ],
      },
      {
        caption: "관점별 기법 — DBMS",
        headers: ["기법", "설명"],
        rows: [
          ["Rollback (Undo)", "트랜잭션 ACID 보장"],
          ["Log File 활용 회복, Check Point, Shadow Paging", "DB 회복 기법으로 활용"],
        ],
      },
    ],
  },
  {
    topicId: "os-81",
    title: "워치독 타이머(WDT, Watchdog timer)",
    course: "CA",
    definition:
      "프로세서의 동작을 감시하여, 외부잡음이나 비정상적인 동작으로 오작동에 빠졌을 경우, 시스템을 리셋하여 복구하기 위해 사용되는 디바이스",
    defShort: "프로세서 동작을 감시하다 오작동 시 시스템을 리셋해 복구하는 디바이스",
    lead:
      "오작동 감시와 자동 복구, 워치독 타이머",
    features: ["프로세서 동작 감시", "타임아웃 기반 감지", "자동 리셋 복구"],
    keywords: ["Kick", "Reset", "Clock", "Time out"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "설명"],
        rows: [
          ["Kick (Clear)", "Watchdog에 주기적 Alive신호"],
          ["Reset", "워치독이 MCU 초기화 시그널"],
          ["Clock", "외부 클럭 소스(Clock Source)"],
          ["Timeout", "MCU Task 비정상 동작 알림 신호"],
        ],
      },
      {
        caption: "동작 과정",
        headers: ["구분", "실행절차", "내용"],
        rows: [
          ["초기화", "Setup Value", "설정값 초기화"],
          ["시작", "Timer Start", "카운트다운 시작"],
          ["Kick", "Watchdog Kick", "주기적 워치독 킥"],
          ["중단", "Task Runaway", "refresh 중단"],
          ["만료", "Watchdog Timer Expire", "타이머 expire"],
          ["리셋", "Reset MCU", "MCU 리셋"],
        ],
      },
      {
        caption: "구현 방법",
        headers: ["구분", "구현방법"],
        rows: [
          ["하드웨어 구현방법", "내부 워치독 타이머\n외부 워치독 타이머"],
          ["타이머 개수별 구현 방법", "단단계 워치독 타이머\n다단계 워치독 타이머"],
        ],
      },
    ],
  },
  {
    topicId: "ca-140",
    title: "RAID (Redundant Array of Independent Disks)",
    course: "CA",
    definition:
      "디스크의 가용성 및 성능 향상을 위해 스트라이핑 및 미러링 기술 이용하는 디스크 고가용성 기술",
    defShort: "가용성·성능 향상 위해 스트라이핑 및 미러링 이용 디스크 고가용성 기술",
    lead: "디스크 가용성·성능 향상, RAID",
    features: ["스트라이핑 병렬화", "중복성 기반 복구", "성능·가용성 교환"],
    keywords: ["스트라이핑", "미러링", "해밍", "패리티", "분산 패리티", "0+1", "1+0"],
    tables: [
      {
        caption: "종류",
        headers: ["종류", "설명"],
        rows: [
          ["RAID 0", "블록 레벨 스트라이핑\nI/O 성능 드라이브 수 비례\n오류 검출·복구 기능 없음\n최소 2개, 읽기/쓰기 N배 향상"],
          ["RAID 1", "디스크 미러링 방식\n가용성과 성능 고려\n최소 드라이브 수 2개\n읽기 성능: N배 향상"],
          ["RAID 2", "비트 레벨 스트라이핑\n해밍 코드 사용한 ECC 기능 제공\nOverhead 발생\n최소 드라이브 수 3개"],
          ["RAID 3", "바이트 레벨 스트라이핑\n패리티 디스크 사용"],
          ["RAID 4", "블록 레벨 스트라이핑\n패리티 디스크 사용"],
          ["RAID 5", "블록 레벨 스트라이핑\n분산 패리티 사용, 최소 3개\n읽기 성능: N배 향상\n쓰기 성능: 최대 N-1배 향상"],
          ["RAID 10", "미러링 + 블록 레벨 스트라이핑\n패리티 사용 안 함\n최소 드라이브 수 4개\nRAID 01 대비 복구 빠르고 안정적"],
          ["RAID 01", "블록 레벨 스트라이핑 + 미러링\n패리티 사용 안 함\n최소 드라이브 수 4개\n가용성·성능·안정성 10 대비 낮음"],
        ],
      },
    ],
    notes: [
      "RAID 3: 바이트 레벨 스트라이핑, 패리티 디스크 사용",
      "RAID 4: 블록 레벨 스트라이핑, 패리티 디스크 사용",
      "두음: 영스-일미-이이-삼패-사블-오분-육패 — 0 스트라이핑, 1 미러링, 2 ECC(해밍), 3 패리티 디스크(바이트), 4 블록, 5 분산 패리티, 6 이중 패리티",
      "고장 허용: RAID 0 복구 불가 / RAID 1 n-1개(공간 효율 1/n, 쓰기 향상 없음) / RAID 2 1개 디스크 / RAID 5는 RAID 0에서 성능·용량을 줄이는 대신 안전성 확보",
      "Nested RAID 1+0: RAID 0의 단점(안전성)을 강화하고 RAID 1의 단점(성능)을 향상 — 시스템 중요성과 비용을 고려해 레이드 유형 선택",
    ],
  },
  {
    title: "이레이저 코딩(erasure coding)",
    course: "CA",
    definition:
      "분할과 패리티를 이용하여 데이터를 인코딩하고, 데이터 손실 시 디코딩 과정을 거쳐 원본 데이터를 복구하는 기술",
    defShort: "분할과 패리티로 데이터 인코딩, 손실 시 디코딩해 원본을 복구하는 기술",
    lead:
      "패리티 기반 데이터 복구, 이레이저 코딩",
    features: ["패리티 기반 복구", "일부 블록 손실 허용", "분산 저장"],
    keywords: [
      "Reed-Solomon Code",
      "Tahoe-LAFS",
      "Weaver Code",
      "분할",
      "인코딩",
      "디코딩",
      "이레이저 코드(n+k)",
    ],
    tables: [
      {
        caption: "동작 방식",
        headers: ["동작", "절차", "설명"],
        rows: [
          ["분할", "데이터 분할", "동일 크기 n블록"],
          ["저장(인코딩)", "이레이저 코드\n(n+k)", "Reed-Solomon Code\nTahoe-LAFS\nWeaver Code\n패리티 블록 함께 저장"],
          ["복원(디코딩)", "패리티 복원", "오류 영역 복구"],
        ],
      },
      {
        caption: "알고리즘",
        headers: ["구분", "알고리즘", "설명"],
        rows: [
          ["패리티 기반", "Reed-Solomon Code", "n+k 조각 패리티 조각 추가\nn개로 재구성 원본 복원 가능"],
          ["분산 저장", "Tahoe-LAFS", "암호화 분산 저장 여러 서버 분산"],
          ["XOR 기반", "Weaver Code", "XOR 기반 코드 고내결함성 확보\n동일 스트립 배치 균형·대칭 구조"],
        ],
      },
    ],
    notes: ["매커니즘: DATA → ① n등분(n개) → ② 인코딩(k개) → 총 n+k개 저장 → ③ 디코딩 → n개 복원"],
  },
  {
    title: "지능형 반도체",
    course: "CA",
    definition:
      "데이터를 저장하는 메모리 반도체와 연산 기능을 수행할 수 있는 시스템 반도체의 융합된 형태를 가지는 반도체",
    defShort: "데이터 저장 메모리 반도체와 연산 시스템 반도체가 융합된 형태의 반도체",
    lead: "메모리·시스템 반도체 융합, 지능형 반도체",
    features: ["메모리·연산 융합", "병목현상 해소", "저전력화"],
    keywords: [
      "지능화",
      "저전력화",
      "안정화",
      "스마트 인지·제어 반도체",
      "스마트 통신 반도체",
      "초고속 컴퓨팅 반도체",
    ],
    tables: [
      {
        caption: "핵심 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["초고속 컴퓨팅 반도체", "뉴로모픽 고속 컴퓨팅", "자율학습·판단 신경망 칩 응용"],
          ["초고속 컴퓨팅 반도체", "지능형메모리", "SSD·UFS 저장장치 메모리\n제어부 융합 독립 기능 담당"],
          ["초고속 컴퓨팅 반도체", "빅데이터 고속처리", "실시간 대량 분석 고속 연산 처리\n병렬 처리 활용 멀티스레드 응용"],
          ["초고속 컴퓨팅 반도체", "IoT 프로세서", "소형·저전력 IoT 기기용\n주변장치 IP 다양한 응용 지원"],
          ["스마트 통신 반도체", "고속이동통신", "5G·6G 통신 AV 코덱 등 적용"],
          ["스마트 통신 반도체", "광대역 네트워크", "광 기반 고속망 차량 선박 항공\n기저대역 모뎀 HW 설계 기술"],
          ["스마트 통신 반도체", "초저전력 커넥티비티", "근접통신\n협업 미들웨어\n자율제어"],
          ["스마트 인지 제어 반도체", "얼굴인식", "99.15% 사람 이상 인식률\n페이스북 적용 대표 사례"],
          ["스마트 인지 제어 반도체", "콘텐츠 및 광고추천", "취향 분석 추천 넷플릭스 아마존"],
          ["스마트 인지 제어 반도체", "자동통역", "자동통역 서비스 스카이프·MS"],
          ["스마트 인지 제어 반도체", "음성비서", "개인형 음성비서 애플 시리 사례\n대화형 교육 IBM 왓슨"],
        ],
      },
    ],
    notes: [
      "개념도: 기존 반도체(중앙처리장치 CPU ↔ 전송회로 BUS ↔ 저장장치 메모리, 병목현상) → 설계·소자·공정·장비·소재 기술 → 뉴로모픽 반도체(뉴런·시냅스·통신 계층, 연산·저장·통신 기능 융합으로 병목현상 없음)",
    ],
  },
  {
    topicId: "ca-22",
    title: "TPU (Tensor Processing Unit)",
    course: "CA",
    definition: "AI 모델의 학습과 추론에 최적화된 주문형 반도체(ASIC)",
    defShort: "AI 모델 학습과 추론에 최적화된 행렬처리 주문형 반도체(ASIC)",
    lead:
      "AI 연산 전용 반도체, TPU",
    features: ["행렬 연산 특화", "데이터 이동 최소", "딥러닝 외 불가"],
    defPair: [
      {
        name: "TPU (Tensor Processing Unit)",
        lead: "행렬 연산 특화 반도체",
        def: "딥러닝 전용 설계로 AI 모델의 학습과 추론에 최적화된 주문형 반도체",
        features: ["딥러닝 전문성", "제어 축소 효율성", "텐서플로우 최적화"],
      },
      {
        name: "GPU (Graphics Processing Unit)",
        lead: "병렬 연산의 범용 프로세서",
        def: "그래픽 처리와 범용 병렬 컴퓨팅을 위한 병렬 연산 기반 범용 병렬 프로세서",
        features: ["범용성", "수천 코어 병렬성", "구매 접근성"],
      },
    ],
    keywords: ["텐서(Tensor)", "주문형 반도체", "AI학습", "MXU", "승산 누적 연산", "행렬처리"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["연산", "행렬 곱셈 장치(MXU, Matrix Multiplier Unit)", "대규모 행렬 곱셈·컨볼루션 고속\n시스톨릭 어레이 데이터 이동 최소"],
          ["연산", "벡터 장치(Vector Unit)", "요소별 연산 활성화·정규화"],
          ["메모리", "HBM(High Bandwidth Memory)", "고대역 메모리 대용량 고속 전송\nMXU 공급 연산 병목 감소"],
          ["연결", "상호 연결(Inter-Chip Interconnect, ICI)", "TPU 칩 연결 다중 칩 상호 연결"],
        ],
      },
      {
        caption: "TPU 전체 데이터 처리 흐름",
        headers: ["절차", "설명"],
        rows: [
          ["1", "호스트→인피드 데이터 스트리밍"],
          ["2", "인피드 큐 로드 HBM에 저장"],
          ["3", "매개변수 로드 HBM→MXU"],
          ["4", "데이터 로드 HBM에서 인출"],
          ["5", "행렬 곱셈 연산 컨볼루션 수행\n누산기 전달 메모리 접근 없음"],
          ["6", "결과 합 출력 데이터·변수 곱"],
        ],
      },
      {
        caption: "TPU와 GPU 비교",
        headers: ["구분", "TPU", "GPU"],
        rows: [
          ["설계목적", "딥러닝 전용", "범용 병렬 컴퓨팅"],
          ["아키텍처", "인공지능 특화형", "범용 병렬 처리기"],
          ["연산방식", "행렬 연산 중심", "병렬 연산 중심"],
          ["프레임워크", "텐서플로우\n단일 프레임워크", "CUDA 기반\n파이토치 등"],
          ["확장성", "구글 클라우드", "모든 환경 사용"],
          ["비용", "대규모 비용 효율", "높은 초기 투자"],
          ["전력", "데이터 이동 최소\n전력 효율 높음", "높은 연산 성능\n전력 소비 높음"],
          ["분산", "TPU Pod", "NVLink"],
          ["핵심 구조", "시스톨릭 배열", "SIMT 구조"],
          ["작동 원리", "수만 개 연산 유닛\n격자로 상호 연결", "수천 개 코어 병렬\n코어 그룹 독립"],
          ["칩 연결", "ICI 토러스\n3D 직접 연결", "NVLink 등\n중앙 스위치 통신"],
          ["약점", "딥러닝 외 불가\n유연성 낮음", "전력 소모 높음\n연산 코어 비율↓"],
        ],
      },
      {
        caption: "GPU와 TPU의 특징 비교",
        headers: ["GPU", "설명", "TPU", "설명"],
        rows: [
          ["범용성", "그래픽·AI 등\n범용 활용", "전문성", "대규모 행렬 연산\n딥러닝만 특화"],
          ["병렬성", "수천 개 코어로\n동시 처리", "효율성", "제어 축소로\n전력·공간 절약"],
          ["접근성", "누구나 구매\n다양한 환경 구축", "최적화", "텐서플로우 환경\n처리 속도 높음"],
        ],
      },
      {
        caption: "GPU와 TPU의 협업 시스템 설계",
        headers: ["구분", "시스템 역할", "설명"],
        rows: [
          ["시간 분담", "시간차 협업", "TPU 학습 Pod 고속 학습\nGPU 서비스 서버 추론 배포"],
          ["단계 분담", "전처리 구조", "GPU 전처리 회전·디코딩\nTPU 학습 행렬 연산 학습"],
          ["위치 분담", "엣지 구조", "TPU edge 저전력 단순 감지\nGPU 심화 분석 상세 분석 수행"],
        ],
      },
    ],
    notes: [
      "114회 응용 1교시 기출",
      "개념도: 시스톨릭 어레이(Systolic Array) 구조",
      "가성비 좋은 TPU로 학습하고 GPU로 추론·심화 분석을 하는 협업 구조가 실무 설계의 기본 (NS 19기 2주차 1교시 7번)",
    ],
  },
  {
    topicId: "os-45",
    title: "경쟁조건(Race Condition) 해결 방안",
    course: "OS",
    definition:
      "둘 이상의 프로세스가 동일한 공유 자원에 동시에 접근하면서 실행 순서에 따라 결과가 달라질 수 있는 상황",
    defShort: "둘 이상 프로세스가 공유 자원 동시 접근 시 실행 순서로 결과 달라지는 상황",
    lead:
      "공유 자원 동시 접근 문제, 경쟁조건 해결 방안",
    features: ["예측 불가", "비균등", "분석 난해"],
    keywords: [
      "데커(Dekker)",
      "피터슨(Peterson)",
      "램포트(Lamport)",
      "Test & Set",
      "Compare & Swap",
      "인터럽트 금지",
      "Spin Lock",
      "Mutex",
      "세마포어",
      "모니터",
      "상호배제",
      "진행",
      "한계 대기",
    ],
    tables: [
      {
        caption: "경쟁조건 발생 원인",
        headers: ["원인", "설명"],
        rows: [
          ["공유 자원(Shared Resource) 사용", "여러 프로세스가\n같은 변수·파일\n동시 접근"],
          ["비동기적 실행(Asynchronous Execution)", "임의 순서 실행\n실행 시간 따라\n결과 달라짐"],
          ["임계 영역(Critical Section) 미보호", "임계 영역 동기화\n처리가 부족함"],
        ],
      },
      {
        caption: "소프트웨어 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          ["데커(Dekker) 알고리즘", "프로세스 2개\n상호 배제 최초\nflag·turn 변수\n진입 후 양보"],
          ["피터슨(Peterson) 알고리즘", "flag·turn 변수\n상대에 먼저 양보\n이후 진입"],
          ["램포트(Lamport) bakery 알고리즘", "분산 처리 환경\n번호표 부여\n낮은 번호 우선"],
        ],
      },
      {
        caption: "하드웨어 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          ["Test & Set", "원자적 연산으로\n값 테스트·설정\n읽기→셋→반환"],
          ["Compare & Swap", "원자적으로 비교\n일치 시 새 값 변경"],
          ["인터럽트 금지", "인터럽트 disable\n원자성 확보\n문맥교환 불가"],
        ],
      },
      {
        caption: "동기화 방식 경쟁조건 해결 방안",
        headers: ["기법", "설명"],
        rows: [
          ["세마포어", "P·V 연산으로\n동기화 지원\nBinary·Count"],
          ["모니터", "고수준 동기화\n언어 지원 필요"],
          ["Spin Lock", "가능할 때까지\n루프 돌며 재시도"],
          ["Mutex", "동기화 대상 하나\n상호 배제 보장"],
        ],
      },
      {
        caption: "임계영역 해결을 위한 세가지 요건",
        headers: ["방법", "설명"],
        rows: [
          ["상호 배제", "수행 중 다른\n프로세스 진입 X"],
          ["진행", "비어 있을 때\n진입 미루지 않음"],
          ["한계 대기", "재진입에 제한\n기아 방지 조건"],
        ],
      },
      {
        caption: "경쟁조건의 특징",
        headers: ["특징", "설명"],
        rows: [
          ["예측 불가", "프로세스 경쟁에\n의한 출력값 예측\n불가"],
          ["비균등", "프로세스\n선점·자원 사용\n방식의 일관성\n부재"],
          ["분석 난해", "버그 발생 시 원인\n파악 위한 분석\n과정 난해"],
        ],
      },
    ],
    notes: [
      "임계영역(Critical Section): 병렬컴퓨팅에서 둘 이상의 프로세스가 동시에 접근해서는 안되는 공유 자원(자료 구조 또는 장치)을 접근하는 코드의 일부 영역",
      "Acquire the Lock → Lock is locked / Release the Lock → Lock is unlocked",
      "출제 변형: '운영체제 동기화 기법'으로 물어도 같은 토픽 — 서론만 바꿔 쓴다. 리드문: 경쟁조건 예방 위한 실행 순서 제어, 프로세스 동기화 기법 / 정의(34자): 공유 자원의 경쟁조건을 막기 위해 프로세스의 실행 순서를 제어하는 상호배제 기법 / 특징: 상호배제·진행 보장·한계 대기(임계영역 3요건)",
      "개념도 사례(count 변수): 프로세스 A가 공유 자원의 count(100)를 읽고 계산 → B도 읽고 계산 → A가 101을 write → B가 기존 값을 overwrite해 A의 결과가 무시됨 — 접근·read·write 순서에 따라 값이 달라진다",
      "인터럽트 금지는 단일 프로세서에서만 적용 가능하고 멀티 프로세서에서는 불가 / 제어 기법은 성능 저하를 부르므로 SW·HW 특성에 맞게 테스트 후 선택 (NS 19기 2주차 2교시 6번)",
    ],
  },
  {
    topicId: "os-37",
    title: "기아(Starvation)",
    course: "OS",
    definition:
      "우선순위 기반 CPU 스케줄링 시 높은 우선순위 프로세스의 지속적 진입으로 인해, 낮은 우선순위 프로세스가 수행되지 못하고 무한대기 하는 현상",
    defShort: "높은 우선순위 프로세스의 지속적 진입으로 낮은 우선순위 무한대기 현상",
    lead: "저순위 프로세스 무한 대기, 기아(Starvation)",
    features: ["저순위 무한대기", "일부 프로세스 한정", "Aging 기법 해소"],
    keywords: ["무한대기", "Aging기법 적용", "HRN 스케줄링", "MLFQ 스케줄링"],
    tables: [
      {
        caption: "기아 현상 발생 원인",
        headers: ["원인", "설명"],
        rows: [
          ["비선점", "할당된 CPU를\n강제로 못 빼앗는\n스케줄링 방식"],
          ["우선순위", "우선순위 부여\n최고 순위에\nCPU 할당"],
        ],
      },
      {
        caption: "기아 현상 발생 사례와 해결 방안",
        headers: ["구분", "설명"],
        rows: [
          ["문제 상황", "프로세스 1 순위\n가장 낮아 대기\n상위 요청 지속\n무한정 대기"],
          ["해결 방안", "오래 기다린 순\n우선순위 상향\nAging 기법"],
        ],
      },
      {
        caption: "기아 현상 해결 위한 스케줄링 알고리즘",
        headers: ["해결방안", "설명"],
        rows: [
          ["HRN 스케줄링", "대기시간을\n고려하여 Aging\n적용한 HRN\n스케줄링 사용"],
          ["MLFQ 스케줄링", "프로세스간 균형\n할당을 고려해\n여러 개의 큐를\n두고 Round Robin 수행"],
        ],
      },
      {
        caption: "교착 상태와 기아 상태 비교",
        headers: ["구분", "설명"],
        rows: [
          ["교착상태(Deadlock)", "다른 프로세스가\n야기한 Event를\n무한정 대기"],
          ["기아상태(Starvation)", "교착 상태 부산물\n자원 무한 대기\n(무한 봉쇄)"],
        ],
      },
      {
        caption: "기아 현상 발생 조건 — 네 측면",
        headers: ["구분", "발생 조건", "설명"],
        rows: [
          ["우선순위 측면", "우선순위 기반\n스케줄링", "고순위 지속 생성\n저순위 기회 없음"],
          ["스케줄링 알고리즘 측면", "비선점형\n스케줄링", "FCFS 긴 작업\n짧은 것 대기"],
          ["자원 할당 측면", "자원 할당의\n불공평성", "반복 사용 점유\n특정 자원 독점"],
          ["자원 관리 측면", "부적절한\n자원 관리", "순위·정책 오류\n일부 지속 점유"],
        ],
      },
      {
        caption: "기아 방지 기법 — 우선순위·스케줄링·자원관리·가중치",
        headers: ["구분", "방지 기법", "설명"],
        rows: [
          ["우선순위", "우선순위 승격\nAging 기법", "대기 시간 반영\n점진적 순위 상향"],
          ["스케줄링", "타임 퀀텀 설정\n선점형 조정", "퀀텀 크기 조정\n공정 CPU 할당"],
          ["스케줄링", "알고리즘 조합\n혼합 사용", "여러 기법 혼합\n장단점 상쇄"],
          ["자원 관리", "자원 할당 그래프\n상태 관리", "그래프로 관리\n지속 점유 방지"],
          ["자원 관리", "기한 기반 스케줄\n기한 기준", "프로세스별 기한\n기한 순 스케줄링"],
          ["가중치", "지분 비례 CPU", "저순위 진전 확보"],
        ],
      },
      {
        caption: "교착상태와 기아현상의 상세 비교",
        headers: ["구분", "교착상태", "기아현상"],
        rows: [
          ["원인", "Coffman\n4대 조건 만족", "선점·우선순위\nSJF 자원 독점"],
          ["대상 범위", "둘 이상 프로세스\n집단 상호 의존", "일부 프로세스\n저우선순위"],
          ["프로세스 상태", "대기·봉쇄 상태\n상태 변화 불가", "준비·대기 상태\n자원 할당만 거부"],
          ["자원 상태", "나눠 쥔 채 고립", "계속 할당·해제"],
          ["해결 메커니즘", "예방·회피\n탐지·복구", "에이징 공정큐잉\nHRRN 스케줄"],
          ["대표 알고리즘", "은행원 알고리즘\nRAG 그래프", "HRRN\n순위 Aging"],
        ],
      },
    ],
    notes: [
      "사례 개념도 — 문제 상황: Process1(실행시간 10, 우선순위 10), Process2(4, 7), Process3(5, 1), Process4(6, 5)",
      "사례 개념도 — 해결 방안: Process1(대기시간 15, 우선순위 10→9), Process2(대기시간 11, 우선순위 7→6), Process3(대기시간 0, 우선순위 1), Process4(우선순위 5)",
      "발생 환경 한 줄: 비선점·우선순위 스케줄링에서 기아가 생긴다 — 방지 기법은 우선순위·스케줄링·자원 관리·가중치 네 측면으로 나눠 쓴다",
    ],
  },
  {
    topicId: "os-47",
    title: "문맥교환(Context Switching)",
    course: "OS",
    definition:
      "CPU가 실행 중인 하나의 프로세스 상태를 저장하고, 다른 프로세스 상태를 복원하여 실행하는 과정",
    defShort: "실행 중 프로세스 상태 저장 후 다른 프로세스 상태를 복원해 실행하는 과정",
    lead:
      "프로세스 전환의 상태 저장, 문맥교환",
    features: ["상태 전이 시 발생", "PCB 기반 상태 보존", "오버헤드 발생"],
    keywords: ["디스패치(dispatch)", "타임아웃", "I/O", "시스템콜", "인터럽트", "오버헤드", "save/reload PCB"],
    tables: [
      {
        caption: "문맥교환 동작 메커니즘",
        headers: ["메커니즘", "주체", "설명"],
        rows: [
          ["① 실행", "P1", "CPU 할당 실행"],
          ["② Interrupt/System call", "운영체제", "P1 대기 전환"],
          ["③ PCB1 저장", "운영체제", "P1 문맥 저장"],
          ["④ PCB2 적재", "운영체제", "P2 CPU 할당"],
          ["⑤ 실행", "P2", "P2 실행 상태"],
          ["⑥ Interrupt/System call", "운영체제", "P2 대기 전환"],
          ["⑦ PCB2 저장", "운영체제", "P2 상태 기록"],
          ["⑧ PCB1 적재", "운영체제", "P1 복구 할당"],
          ["⑨ 실행", "P1", "완료 시 재실행"],
        ],
      },
      {
        caption: "문맥교환 특징",
        headers: ["특징", "설명"],
        rows: [
          ["발생 시점", "준비→실행\n실행→준비\n실행→대기 전환"],
          ["오버헤드", "메모리 속도\n레지스터 수\n특수 명령어 유무\n시스템마다 상이"],
        ],
      },
      {
        caption: "문맥의 유형과 내용",
        headers: ["문맥 유형", "문맥 내용", "설명"],
        rows: [
          ["시스템 문맥", "PCB 정보\nPID 식별자", "커널 자료구조\n프로세스 구분"],
          ["시스템 문맥", "State 상태\n스케줄 정보", "실행 상태 표시\n우선순위 관리"],
          ["시스템 문맥", "레지스터 계정", "자원 사용 정보"],
          ["메모리 문맥", "Stack 영역\nHeap 영역", "지역 변수 저장\n동적 할당 영역"],
          ["메모리 문맥", "Swap 공간\nData 영역", "가상 메모리\n전역 변수 저장"],
          ["메모리 문맥", "Text 영역", "실행 코드 저장"],
          ["하드웨어 문맥", "HW 레지스터\nPC 실행 위치", "연산 값 보관\n다음 명령 주소"],
          ["하드웨어 문맥", "전이 시 기억", "재개 위치 보존"],
        ],
      },
      {
        caption: "문맥교환 오버헤드 발생 지점",
        headers: ["단계", "실행 루틴", "오버헤드 발생 작업"],
        rows: [
          ["1", "현재 프로세스", "–"],
          ["2", "인터럽트", "PCB 상태 저장"],
          ["3", "프로세스\n스케줄러", "준비 큐에서\n다음 선택"],
          ["4", "디스패치", "PCB에서 복구"],
          ["5", "다음 프로세스", "–"],
        ],
      },
      {
        caption: "오버헤드 해결 방법",
        headers: ["해결 방법", "설명"],
        rows: [
          ["문맥교환 발생 빈도 최소화", "다중 프로그래밍\n수준을 낮추거나\n스케줄러\n알고리즘 개선"],
          ["쓰레드 사용", "경량 프로세스인\n쓰레드로\n전환되는 정보의\n양을 최소화"],
        ],
      },
    ],
    notes: [
      "① Context Switch가 자주 발생하지 않도록 다중 프로그래밍 정도 낮춤",
      "② 스택 중심의 시스템에서는 스택 포인터를 변경하여 프로세스간 문맥교환 수행",
      "③ Light weight 프로세스인 스레드를 이용하여 Context switch 부하 최소화",
      "동작 메커니즘 도식: process P0 ↔ operating system ↔ process P1 — save state into PCB0 → reload state from PCB1 → (P1 executing, P0 idle) → save state into PCB1 → reload state from PCB0",
      "문맥(Context)이란 중단된 프로세스를 그대로 이어가도록 보존하는 실행 상태 정보 — 세 유형과 내용은 '문맥(Context)' 토픽에 따로 정리",
      "잦은 문맥교환은 PCB 저장 등 I/O에 시스템 자원을 과다 소비 — 1차로 횟수를 줄이고, 경량 프로세스(쓰레드)로 상태 전환 정보를 일부 공유해 해결 (NS 19기 2주차 2교시 2번)",
    ],
  },
  {
    title: "문맥(Context)",
    course: "OS",
    // 교재에는 문맥교환 안에서만 다뤄진다. NS 19기 02주차 2교시 2번(가. 문맥의 개념과 유형)을 참고해 따로 세웠다.
    definition:
      "프로세스가 실행을 멈췄다가 같은 자리에서 다시 이어갈 수 있도록 레지스터·메모리·PCB에 담아 두는 실행 상태 정보",
    defShort: "중단된 프로세스를 잇도록 PCB·레지스터에 보존하는 실행 상태 정보",
    lead: "프로세스 실행 상태 보존, 문맥(Context)",
    features: ["중단 지점 재개", "PCB 기반 보존", "저장·복원 부담"],
    keywords: ["시스템 문맥", "메모리 문맥", "하드웨어 문맥", "PCB", "레지스터", "Program Counter"],
    tables: [
      {
        caption: "문맥의 세 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["OS 관리", "시스템 문맥", "PCB 커널 관리 정보\n프로세스별 관리 PID 상태 계정"],
          ["주소 공간", "메모리 문맥", "주소 공간 코드·스택·힙\n스왑 영역 할당 메모리 포함"],
          ["CPU 상태", "하드웨어 문맥", "CPU 레지스터 실행 상태 보관\n프로그램 카운터 실행 위치 기억"],
        ],
      },
      {
        caption: "문맥이 오가는 시점",
        headers: ["시점", "동작", "설명"],
        rows: [
          ["인터럽트·시스템 콜", "실행 문맥 저장", "PCB 기록 보존"],
          ["디스패치", "다음 문맥 복원", "PCB→CPU"],
          ["잦은 상태 전이", "저장·복원 반복\n오버헤드 증가", "교환에 시간 소모\nCPU 시간 낭비"],
        ],
      },
    ],
    notes: [
      "문맥교환은 이 세 문맥을 통째로 바꾸는 일 — 스레드처럼 메모리 문맥을 공유하면 바꿀 양이 줄어 전환이 가볍다",
      "한 쌍으로 볼 것: '문맥교환(Context Switching)' 토픽 — 이 토픽은 무엇을 보존하는가, 그쪽은 어떻게 바꾸는가",
      "출제 형태: 2교시에서 '문맥의 개념과 유형·내용'이 문맥교환 문제의 첫 소문항으로 나온다 (NS 19기 2주차)",
    ],
  },
  {
    topicId: "os-34",
    title: "우선순위 역전(Priority Inversion) 현상",
    course: "OS",
    definition:
      "동기화로 인해 우선순위가 높은 프로세스가 우선순위가 낮은 프로세스보다 실행이 지연되는 현상",
    defShort: "우선순위 높은 프로세스가 우선순위 낮은 프로세스보다 지연되는 현상",
    lead: "높은 순위의 실행 지연, 우선순위 역전",
    features: ["공유 자원 점유 기인", "실시간 응답 저해", "우선순위 상속 해결"],
    keywords: ["임계영역", "프로세스 선점", "자원", "우선순위 상속", "우선순위 올림"],
    tables: [
      {
        caption: "우선순위 역전 현상 메커니즘",
        headers: ["Process", "설명"],
        rows: [
          ["① 임계영역 진입", "Task 3이 자원 R 사용\n위해 임계 영역\n진입"],
          ["② 프로세스 선점", "스케줄링에 의해\n우선 순위 높은\nTask 1은 Task 3 선점하여 진행"],
          ["③ 임계영역 대기", "Task 1이 Task 3이 점유한 자원\nR 때문에 진행\n못하고 CPU\n제어권 반납"],
          ["④ 우선순위 역전", "Task 3보다 높은 Task 2가\n선점되어 최고\n순위 Task 1이 뒤로\n밀림"],
        ],
      },
      {
        caption: "해결 방안",
        headers: ["기법", "설명"],
        rows: [
          ["우선순위 상속", "낮은 Task 순위를\n대기 Task와 동일\n역전 현상 해결"],
          ["재귀적 우선순위 상속", "재귀적 자료구조\n여러 역전 해결"],
          ["우선순위 올림", "자원에 순위 부여\n진입 Task 순위를\n자원 순위로 올림"],
        ],
      },
      {
        caption: "우선순위 역전 발생 조건",
        headers: ["발생 조건", "설명"],
        rows: [
          ["세마포어(Semaphore)", "임계영역(Critical\nSection)을 통해 특정 자원에\n대한 점유"],
          ["선점 스케줄링", "우선순위 높은\nTask가 낮은 Task의 CPU\n점유를 선점"],
        ],
      },
      {
        caption: "해결 기법 비교 — 상속(BPI)·올림(PCE)·재귀 상속(RPI)",
        headers: ["구분", "BPI", "PCE", "RPI"],
        rows: [
          ["기본 우선순위 역전", "해결 가능", "해결 가능", "해결 가능"],
          ["자원 동시 소유", "해결 불가", "해결 가능", "해결 가능"],
          ["재귀적 소유·요청", "해결 불가", "해결 불가", "해결 가능"],
          ["시간 복잡도", "O(N)", "O(N*M)", "O(N+M)"],
          ["공간 복잡도", "O(1)", "O(M)", "O(N+M)"],
        ],
      },
    ],
    notes: [
      "우선순위 역전 현상 해결 위해 우선순위 상속과 우선순위 올림 존재",
      "발생 조건 두 가지가 겹칠 때 — 낮은 Task가 자원을 점유한 상태에서 높은 Task가 그 자원을 요구하면 역전 발생 가능",
      "8단계 흐름: ① Task3 세마포어 획득 → ② Task1 실행 → ③ Task1 자원 요청·대기 → ④ Task3 실행 → ⑤ Task2 실행(역전 구간, Task3는 세마포어 계속 소유) → ⑥ Task3 재실행 → ⑦ Task3 세마포어 반환 → ⑧ Task1 실행·획득",
    ],
  },
  {
    topicId: "os-32",
    title: "세마포어(Semaphore)",
    course: "OS",
    definition:
      "멀티프로세스 환경에서 상호 배제를 보장하고 동기화를 제어하기 위해 사용하는 동기화 기법",
    defShort: "멀티프로세스 환경에서 상호 배제 보장과 동기화 제어를 위한 동기화 기법",
    lead: "공유 자원의 상호 배제, 세마포어",
    features: ["상호배제 보장", "원자적 실행", "정수값 기반 제어"],
    keywords: [
      "상호배제",
      "동기화",
      "자원 경쟁",
      "다중프로세스",
      "원자적 실행",
      "공유자원",
      "동기화 지원",
      "이진 세마포어",
      "계수형 세마포어",
    ],
    tables: [
      {
        caption: "세마포어(Semaphore) 연산의 종류",
        headers: ["연산 종류", "연산", "설명"],
        rows: [
          ["초기화 연산", "Initialize", "S = 정수값(공유 자원 수)"],
          ["P 연산", "Wait\n임계영역 진입", "S = S−1\nS<0 → 대기 큐로 이동\nS>0 → 계속 진행"],
          ["V 연산", "Signal\n임계영역 탈출", "S = S+1"],
        ],
      },
      {
        caption: "이진 세마포어(Binary Semaphore)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "값이 0 또는 1\n단일 자원 배제"],
          ["특징", "0 또는 1 정수값"],
          ["P(s) 연산", "s가 1일 때 0으로\n다른 접근 차단"],
          ["V(s) 연산", "s가 0일 때 1로\n다른 접근 허용"],
          ["지원", "하나의 자원 공유\n동기화 지원"],
        ],
      },
      {
        caption: "계수형 세마포어(Counting Semaphore)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "0 이상 정수값\n동일 자원 여러 개\n접근 제어"],
          ["특징", "범위 제한 없는\n정수 값 세마포어"],
          ["지원", "다수 공유 자원\n여러 프로세스\n배제·동기화"],
          ["조건", "Task 수 n >\n공유 자원 수 m"],
        ],
      },
      {
        caption: "세마포어와 모니터의 비교",
        headers: ["구분", "세마포어", "모니터"],
        rows: [
          ["주체", "OS·개발자", "프로그래밍 언어"],
          ["상호작용", "이론적 기반 제공\n효과적 기법 제공", "타이밍 오류 해결\n개발 편의성 보완"],
          ["특징", "S 타입별 구분\n이진·계수형", "한 시점 하나 수행\n계산 능력 동일"],
          ["동기화 구현 사례", "P(S) 검사\n임계→V(S)", "모니터 지역변수\nentry 함수"],
          ["언어사례", "P·V 연산 구현", "JAVA synchronized\n.Net Monitor"],
          ["공통점", "동시성 조정 기능", "조정 기능 동일"],
        ],
      },
    ],
  },
  {
    title: "CPU Ring Level",
    course: "OS",
    definition:
      "시스템이 운영체제 및 소프트웨어의 실행 권한을 관리하기 위해 설계된 프로세서의 권한 수준(Privilege Level)를 나타내는 (보안) 계층적 구조",
    defShort: "OS·SW 실행 권한을 관리하는 프로세서 권한 수준의 보안 계층적 구조",
    lead:
      "실행 권한의 계층적 통제, CPU Ring Level",
    features: ["계층적 권한 구조", "HW 기반 권한 강제", "사용자 영역 격리"],
    keywords: [
      "Ring 0 (Kernel Mode, Supervisor Mode)",
      "Ring 1",
      "Ring 2 (Middle Privilege Level)",
      "Ring 3 (User Mode, Application Mode)",
    ],
    tables: [
      {
        caption: "CPU Ring Level 구조",
        headers: ["Level", "설명"],
        rows: [
          ["Ring 0 (Kernel Mode, Supervisor Mode)", "가장 높은 권한\nOS 커널 실행\n드라이버 동작"],
          ["Ring 1, Ring 2 (Middle Privilege Level, Uncommon in Modern OS)", "드라이버·가상화\n특정 기능 수행\n현대 OS 미사용"],
          ["Ring 3 (User Mode, Application Mode)", "가장 낮은 권한\n일반 앱 실행\nHW 직접 접근 불가\n커널 통해 사용"],
        ],
      },
      {
        caption: "CPU Ring Level 동작 메커니즘",
        headers: ["동작 절차", "설명"],
        rows: [
          ["① 사용자 모드(Ring 3) 프로세스 실행", "브라우저·게임 Ring 3 실행"],
          ["② 커널 모드(Ring 0)로 전환 (시스템 호출)", "시스템 호출 인터럽트 발생\nRing 3→0 OS 요청 처리"],
          ["③ 요청 처리 후 다시 Ring 3으로 전환", "Ring 0→3 커널 처리 후 복귀"],
        ],
      },
    ],
    notes: [
      "구조도(동심원, 바깥→안): User Programs → Standard Libraries → Device Drivers → Kernel",
      "Most Privileged: Ring 0(kernel mode) / Least Privileged: Ring 3(user mode)",
      "Ring 3→0 왕복의 실제 단계(시스템 콜 호출 → int 0x80/syscall → 모드 비트 변경 → 커널 함수 실행 → 반환·복귀)와 커널 모드·유저 모드 7항목 비교는 '시스템 콜(System Call)' 토픽",
    ],
  },
  {
    title: "시스템 콜(System Call)",
    course: "OS",
    // 교재 서브노트에 없는 토픽. NS 19기 02주차 1교시 13번을 참고해 세웠다.
    definition:
      "응용 프로그램이 커널이 가진 기능을 쓰려고 운영체제에 요청하는 정해진 호출 인터페이스 — 호출 순간 사용자 모드에서 커널 모드로 바뀐다",
    defShort: "응용 프로그램이 커널 기능을 쓰려 운영체제에 요청하는 호출 인터페이스",
    lead: "커널 기능의 요청 통로, 시스템 콜(System Call)",
    features: ["커널 모드 전환", "정해진 인터페이스", "HW 자원 보호"],
    keywords: ["프로세스 제어", "파일 조작", "장치 관리", "정보 유지", "통신", "보호", "커널 모드·유저 모드"],
    tables: [
      {
        caption: "시스템 콜의 동작 — 유저 모드에서 커널 모드로",
        headers: ["단계", "설명"],
        rows: [
          ["① 호출", "라이브러리 응용 함수 호출\nsyscall 명령 실행"],
          ["② 진입", "모드 비트 커널 모드 진입"],
          ["③ 처리", "호출 번호 해당 함수 실행"],
          ["④ 복사", "유저 공간 결과 데이터 복사"],
          ["⑤ 복귀", "반환 값 유저 모드 복귀"],
        ],
      },
      {
        caption: "시스템 콜의 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["실행", "프로세스 제어", "abort 중지 프로그램 종료\nexecute 실행 커널 위임"],
          ["자원", "파일 조작", "create 파일 생성·삭제\nopen 열기 읽기·쓰기 수행"],
          ["자원", "장치 관리", "request 장치 사용 요구\n속성 조회·설정 장치 속성 관리"],
          ["정보", "정보 유지", "시간·날짜 시스템 정보 조회\n프로세스 속성 속성 정보 조회"],
          ["통신", "통신", "메시지 송수신 전달\n공유 메모리 상태 정보 전달"],
          ["보안", "보호", "set·get 권한 조회·설정\n자원 접근 접근 권한 관리"],
        ],
      },
      {
        caption: "커널 모드와 유저 모드",
        headers: ["구분", "커널 모드", "유저 모드"],
        rows: [
          ["권한", "모든 명령어\n자원 접근", "자기 메모리만\nHW 접근 불가"],
          ["실행 주체", "커널·드라이버\n시스템 콜 핸들러", "일반 앱 실행\n브라우저 편집기"],
          ["오류 영향", "시스템 전체 장애\n커널 패닉 발생", "해당 프로세스만\n프로세스 종료"],
          ["진입 계기", "인터럽트·예외\n시스템 콜 호출", "시스템 콜 종료\n문맥교환 발생"],
          ["보호", "스스로 책임", "커널 보호 제약"],
        ],
      },
    ],
    notes: [
      "짝지어 볼 것: 유저 모드=Ring 3, 커널 모드=Ring 0 — 'CPU Ring Level' 토픽 / 커널이 시스템 콜을 어떤 역할로 두는지는 '커널(Kernel)' 토픽의 주요 역할 표",
      "출제 형태: '시스템 콜의 종류와 커널 모드/유저 모드 전환 과정' — 유형 6종 표와 동작 5단계 표를 나란히 쓰면 문제 요구 둘을 다 덮는다 (NS 18기·19기 2주차)",
    ],
  },
  {
    topicId: "ca-51",
    title: "기억장치 계층 구조 (Memory Hierarchy)",
    course: "OS",
    definition:
      "가격과 성능이 다른 여러 수준의 기억 장치를 비용 최소화, 빠른 속도, 대용량의 기억 공간을 효율적으로 구성하는 기억 장치 구조",
    defShort: "비용 최소화·빠른 속도·대용량 기억 공간 효율적 구성한 기억 장치 구조",
    lead: "비용·속도·용량의 절충, 기억장치 계층 구조",
    features: ["지역성 기반", "속도·용량 상충", "비트당 비용 차등"],
    keywords: [
      "기억장치 계층 구조(①보조기억장치→②주기억장치→③캐시 기억장치→④CPU)",
      "계층 상위로 갈수록 bit당 기억장치 비용 증가",
      "기억 장치 접근 속도 증가",
      "기억 장치 처리 속도 단축",
      "소용량",
    ],
    tables: [
      {
        caption: "기억장치 계층 구조 특징",
        headers: ["종류", "설명"],
        rows: [
          ["용량(Capacity)", "하위 레벨일수록 용량 증가"],
          ["접근 시간(Access Time)", "하위 레벨일수록 접근 시간 증가"],
          ["비트당 비용(Cost per Bit)", "하위 레벨일수록 비트당 비용 감소"],
          ["성능(Performance)", "하위 접근 빈도 낮을수록 성능 향상"],
        ],
      },
    ],
    notes: [
      "구조도(위→아래): CPU → 캐시 기억장치 → 주기억장치 → 보조기억장치 (위로 갈수록 비용 증가·접근 속도 향상·처리 속도 단축, 아래로 갈수록 대용량)",
      "메모리 계층 구조를 통한 성능 최적화의 근거: ① Space Locality ② Time Locality",
    ],
  },
  {
    topicId: "ca-55",
    title: "가상메모리 관리기법",
    course: "OS",
    definition:
      "운영체제가 제한된 물리적 메모리를 효율적으로 활용하기 위해 가상 주소 공간을 제공하고, 보조기억장치에 저장된 데이터를 필요할 때 동적으로 메모리에 로드하여 관리하는 기법",
    defShort: "제한된 물리적 메모리에 가상 주소 공간 제공, 동적 로드·관리하는 기법",
    lead:
      "물리 메모리의 논리적 확장, 가상메모리 관리기법",
    features: ["가상 주소 공간 제공", "요구 시 동적 적재", "Thrashing 위험"],
    keywords: [
      "할당(단일, 다중)",
      "배치(First, Best, Next, Worst)",
      "호출(Demand, Pre)",
      "교체(FIFO, LRU, LFU, OPT, NUR)",
    ],
    tables: [
      {
        caption: "할당(Allocation) 기법 — 프로그램에 메모리를 어떻게 공급할지 결정",
        headers: ["구분", "세부 기법", "설명"],
        rows: [
          ["연속 할당", "단일 분할 할당", "스와핑 교체 전체 할당 후 교체\n오버레이 분할 필요 부분만 교체"],
          ["분할 할당", "다중 분할 할당", "고정 분할 고정 크기 분할\n가변 분할 적재 시 동적 할당"],
        ],
      },
      {
        caption: "배치(Placement) 기법 — 어디(Where)에 적재할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          ["First Fit", "최초 적합한 곳에\n할당"],
          ["Best Fit", "할당 가능한 곳 중\n낭비 공간이\n최소가 되는 곳에\n할당"],
          ["Next Fit", "최근 할당 공간\n다음부터\n스캔하여 할당"],
          ["Worst Fit", "가장 큰 공간 할당"],
        ],
      },
      {
        caption: "호출(인출, Fetch) 기법 — 언제(When) 적재할지 결정",
        headers: ["구분", "세부 기법", "설명"],
        rows: [
          ["사후", "Demand Fetch (요구)", "요구 시 적재 참조 페이지 적재"],
          ["사전", "Pre Fetch (예측)", "지역성 예측 예상 후 사전 적재"],
        ],
      },
      {
        caption: "교체(Replacement) 기법 — 누구와(Who) 교체할지 결정",
        headers: ["세부 기법", "설명"],
        rows: [
          ["FIFO (First In First Out)", "가장 먼저 들어온\n페이지를 교체"],
          ["LFU (Least Frequency Used)", "현재 기준 사용\n횟수가 가장 적은\n페이지 교체"],
          ["LRU (Least Recently Used)", "현재 기준 가장\n오랫동안\n사용되지 않은\n페이지 교체"],
          ["OPT (Optimal Page)", "가장 오랫동안\n사용되지 않을\n페이지 선택 교체"],
          ["NUR (Not Used Recently)", "최근 사용되지\n않은 페이지를\n2bit 이용하여\n교체"],
        ],
      },
      {
        caption: "스와핑(Swapping) — 주기억장치와 보조기억장치 사이의 교체 이동",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["동작", "스왑 아웃(Swap Out)", "스왑 영역 이동 주기억 공간 확보\n교체 기법 선정 Dirty 기록"],
          ["동작", "스왑 인(Swap In)", "주기억 재적재 스왑→주기억\n페이지 부재 시 호출 기법 수행"],
          ["공간", "스왑 영역(Swap Space)", "보조기억 전용 스왑 아웃 보관\n영역 부족 시 스왑 실패 종료"],
          ["성능", "스와핑 비용", "디스크 입출력 수만 배 느림\n인·아웃 반복 스래싱 발생"],
        ],
      },
    ],
    notes: [
      "개념도: 할당 정책(Allocation) · 배치 정책(Placement) → 프로그램 A/B ↔ 스왑 아웃/스왑 인 ↔ 보조기억장치 → 페이지 교체(Replacement) → Thrashing",
      "스왑 방향: 주기억장치에서 보조기억장치로 내보내면 스왑 아웃, 보조기억장치에서 주기억장치로 되가져오면 스왑 인 — 4대 기법과의 연결은 '누구를 내보낼지는 교체 기법, 언제 되가져올지는 호출 기법'",
          "연결 구조: 페이징·세그멘테이션은 이 4대 기법(할당·배치·호출·교체)에 속하지 않는다 — 그것은 가상 주소 공간을 '어떻게 나누는가'(분할 구조)이고, 4대 기법은 나눠진 블록을 '어떻게 운영하는가'(관리 정책). 할당 기법의 다중 분할 할당에서 고정 분할이 페이징, 가변 분할이 세그멘테이션으로 이어진다",
      "단편화 연결: 배치 기법(First/Best/Worst Fit)의 선택이 외부 단편화 크기를 좌우하고, 교체가 반복 실패하면 Thrashing — '분할 구조가 단편화를 낳고, 관리 정책이 단편화를 줄인다'로 한 줄 정리",
    ],
  },
  {
    title: "가상메모리의 페이징과 세그멘테이션",
    course: "OS",
    definition:
      "[페이징] 물리적 메모리와 가상 메모리를 일정한 크기의 블록으로 나누어 관리하는 메모리 관리 기법 / [세그멘테이션] 프로세스의 메모리를 가변 크기의 논리적 블록(세그먼트)으로 나누어 관리하는 메모리 관리 기법",
    defShort: "메모리를 일정한 크기 블록 또는 가변 크기 논리적 블록으로 관리하는 기법",
    defPair: [
      {
        name: "페이징(Paging)",
        lead: "고정크기 블록 분할 관리",
        def: "물리적 메모리와 가상 메모리를 일정한 크기 블록으로 나눠 관리하는 기법",
        features: ["주소변환 사상", "페이지 부재", "내부단편화 발생"],
      },
      {
        name: "세그멘테이션(Segmentation)",
        lead: "논리 단위 분할 관리",
        def: "프로세스의 메모리를 가변 크기의 논리적 블록으로 나눠 관리하는 기법",
        features: ["기억장치 보호키", "크기 서로 다름", "외부단편화 발생"],
      },
    ],
    lead:
      "메모리 분할의 양대 기법, 페이징과 세그멘테이션",
    features: ["고정·가변 블록", "내부·외부 단편화", "주소변환 사상"],
    keywords: [
      "일정 크기 블록",
      "페이지 맵핑 테이블",
      "내부 단편화",
      "가변 크기 블록",
      "세그먼트 맵핑 테이블",
      "외부 단편화",
    ],
    tables: [
      {
        caption: "페이징(Paging) 기법 특징",
        headers: ["번호", "특징", "설명"],
        rows: [
          ["①", "주소변환 사상", "가상→실주소"],
          ["②", "맵핑 테이블 필요", "기억 장소 낭비"],
          ["③", "페이지 부재", "부재 발생 가능"],
          ["④", "내부단편화 O", "외부단편화 X"],
        ],
      },
      {
        caption: "세그멘테이션(Segmentation) 기법의 특징",
        headers: ["번호", "특징", "설명"],
        rows: [
          ["①", "기억장치 보호키", "침범 방지 필요"],
          ["②", "크기 서로 다름\n연속 공간 할당", "세그먼트별 상이\n각 세그먼트 연속"],
          ["③", "외부단편화 O", "내부단편화 X"],
          ["④", "최초·최적 적합", "위치 지정 할당"],
        ],
      },
      {
        caption: "단편화 대응 관계 — 분할 구조가 단편화 유형을 결정",
        headers: ["구분", "페이징(고정 분할)", "세그멘테이션(가변 분할)"],
        rows: [
          ["발생 단편화", "내부단편화 O\n외부단편화 X", "외부단편화 O\n내부단편화 X"],
          ["발생 원인", "마지막 페이지\n프레임 잔여 공간", "반납·할당 공백\n작은 공백 산재"],
          ["낭비 위치", "할당 블록 안쪽", "블록 사이 바깥"],
          ["낭비 규모", "페이지 절반 크기\n평균 예측 가능", "공백 크기·분포\n예측 어려움"],
          ["해결 방향", "페이지 크기 축소\n맵핑 테이블 증가", "인접 공백 통합\n전체 재배치 집약"],
          ["배치 기법 영향", "프레임 크기 동일\n배치 영향 없음", "배치 기법 선택\n남는 조각 좌우"],
        ],
      },
      {
        caption: "페이징과 세그멘테이션 비교",
        headers: ["구분", "페이징", "세그멘테이션"],
        rows: [
          ["메모리 관리", "동일 크기 수월\n내부단편화 발생", "테이블 작게 관리\n외부단편화 관리"],
          ["블록 구성", "일정 크기 블록\n메모리 균등 분할", "가변 크기 블록\n인접 불필요"],
          ["매핑 방식", "직접·연관 매핑\n집합연관 역매핑", "직접 매핑\n단일 매핑"],
          ["공유", "수정 불가만 공유\n사본 할당 낭비", "공유 세그먼트\n오버헤드 적음"],
        ],
      },
      {
        caption: "페이징과 세그멘테이션 비교",
        headers: ["구분", "페이징", "세그멘테이션"],
        rows: [
          ["메모리 관리", "동일 크기 수월\n내부단편화 발생", "테이블 작게 관리\n외부단편화 관리"],
          ["블록 구성", "일정 크기 블록\n메모리 균등 분할", "가변 크기 블록\n인접 불필요"],
          ["매핑 방식", "직접·연관 매핑\n집합연관 역매핑", "직접 매핑"],
          ["공유", "수정 불가만 공유\n사본 할당 낭비", "공유 세그먼트\n오버헤드 적음"],
        ],
      },
    ],
    notes: [
      "페이징 개념도: 보조기억장치 Page 1~6(각 10K) → 페이지 맵 테이블 → 주기억장치(10K 단위) → CPU / 주소 = br(페이지 존재 bit) + s(보조기억장치 주소) + p'(페이지 프레임 번호)",
      "페이지 크기가 작아질 경우: 페이지 수 증가 → 페이지 맵핑 테이블 크기 증가 → 페이지 단편화 증가",
          "연결 구조: 페이징·세그멘테이션은 가상메모리 관리기법(할당·배치·호출·교체)의 하나가 아니라, 그 전 단계인 '주소 공간 분할 구조'다. 다중 분할 할당의 고정 분할=페이징, 가변 분할=세그멘테이션",
      "단편화 연결: 페이징(고정 크기)은 마지막 페이지가 덜 차서 내부 단편화, 세그멘테이션(가변 크기)은 빈 공간이 조각나서 외부 단편화 — '고정=내부, 가변=외부' 대응이 출제 핵심. 외부 단편화 해결은 통합(Coalescing)·집약(Compaction), 내부 단편화 해결은 페이지 크기 조정",
      "페이지 크기 트레이드오프: 크기를 줄이면 마지막 페이지의 잔여 공간이 줄어 내부 단편화는 감소하지만, 페이지 수가 늘어 맵핑 테이블이 커지고 페이지 부재도 잦아진다 — 내부 단편화와 테이블 오버헤드가 서로 반대로 움직인다",
      "한 줄 대비: 페이징은 크기를 먼저 정하고(고정 프레임) 번호로 매핑, 세그멘테이션은 의미 단위로 먼저 나누고(가변 세그먼트) base·limit으로 매핑",
    ],
  },
  {
    topicId: "ca-87",
    title: "직접 사상과 연관 사상 페이징 기법",
    course: "OS",
    definition:
      "[직접 사상] 페이지 사상 테이블(PMT)을 참고하여 가상 주소를 실제 주소로 변환하는 기법 / [연관 사상] 메모리 주소 변환을 위해 연관 메모리 또는 내용 주소 지정 기억장치를 사용하는 기법",
    defShort: "페이지 사상 테이블이나 연관 메모리로 가상 주소를 실제 주소로 변환 기법",
    lead:
      "가상 주소 변환의 두 방식, 직접 사상과 연관 사상",
    features: ["가상→실주소 변환", "페이지·변위 분리", "속도·비용 상충"],
    defPair: [
      {
        name: "직접 사상(Direct Mapping)",
        lead: "사상표 참조의 주소 변환",
        def: "페이지 사상 테이블을 참고하여 가상 주소를 실제 주소로 변환하는 기법",
        features: ["PMT 직접 참조", "주기억 이중 접근", "주소 합산 방식"],
      },
      {
        name: "연관 사상(Associative Mapping)",
        lead: "병렬 검색의 고속 변환",
        def: "메모리 주소 변환을 위해 연관 메모리나 내용 주소 지정 기억장치 사용 기법",
        features: ["내용 주소화 탐색", "병렬 동시 탐색", "고가 연관 메모리"],
      },
    ],
    keywords: [
      "페이지 사상표 시작 주소",
      "가상 주소",
      "실주소",
      "페이지 사상표(Page Mapping Table)",
      "Page Frame",
      "Page 존재 bit",
      "변위",
      "변환 색인 버퍼(TLB)",
    ],
    tables: [
      {
        caption: "직접 사상에 의한 페이징 기법(Direct Mapping) 동작 방식",
        headers: ["방식", "설명"],
        rows: [
          ["①", "사상표 시작 주소 레지스터 b 적재"],
          ["②", "가상주소 v 참조 페이지 p 변위 d"],
          ["③", "b+p 합산 사상표 위치 획득"],
          ["④", "프레임 p' 획득 실기억장치 위치"],
          ["⑤", "p'+변위 d 실주소 획득"],
        ],
      },
      {
        caption: "연관(Associative) 사상에 의한 페이징 기법",
        headers: ["기법", "설명"],
        rows: [
          ["①", "연관 기억장치 사상표 전체 저장"],
          ["②", "내용 주소화 메모리 전체 탐색\n검색어 입력 주소 반환"],
          ["③", "순수 연관 사상 페이지 주소 변환"],
        ],
      },
    ],
    notes: [
      "가상 주소 v = (p, d) — p: 페이지 번호, d: 변위 / p': 프레임 번호",
      "연관 사상은 Parallel Search 로 연관 사상 테이블 전체를 동시 탐색",
    ],
  },
  {
    topicId: "ca-84",
    title: "페이지 교체 알고리즘(Paging Replacement Algorithm)",
    course: "OS",
    definition:
      "페이지 부재(page fault)가 발생하였을 경우, 가상기억장치의 필요한 페이지를 주기억장치의 어떤 페이지 프레임을 선택, 교체 해야하는가를 결정하는 기법",
    defShort: "페이지 부재 시 어떤 페이지 프레임을 선택, 교체해야 하는가 결정 기법",
    lead: "빈 프레임 확보 위한 선택, 페이지 교체 알고리즘",
    features: ["참조 이력 기반", "페이지 부재 최소화", "낮은 오버헤드 지향"],
    keywords: [
      "페이지 부재(page fault)",
      "최적화 원칙",
      "선택을 위한 기본 정책",
      "교체 제외 페이지",
      "OPT",
      "Random",
      "FIFO",
      "LRU",
      "LFU",
      "NUR",
      "SCR",
      "Clock",
    ],
    tables: [
      {
        caption: "페이지 교체 알고리즘 종류",
        headers: ["교체 기법", "교체 대상", "비고"],
        rows: [
          ["FIFO (First In First Out)", "최장 체류 페이지\n적재 시간 기준", "FIFO 큐 구현\n벨레이디 이상"],
          ["LRU (Least Recently Used)", "최장 미참조\n페이지 교체", "참조 시간 기록\n막대한 오버헤드"],
          ["LFU (Least Frequently Used)", "참조 횟수 최소", "참조 횟수 사용"],
          ["NUR (Not Used Recently)", "최근 미사용\nLRU 유사 성능", "참조·수정 비트\n적은 오버헤드"],
          ["SCR (Second Chance Replacement)", "자주 쓴 것도 대상\nFIFO 보완", "Queue 구조\n참조 bit 사용"],
          ["OPT (Optimal Replacement)", "최장 미래 미사용\n부재 횟수 최소", "참조 예측 필요\n실현 가능성 희박"],
          ["Clock Page", "SCR과 동일\n원형 List 구조", "원형 List 구조\n참조 bit 사용"],
        ],
      },
      {
        caption: "교체 대상 선택",
        headers: ["원칙", "설명"],
        rows: [
          ["① 최적화의 원칙", "최장 미사용 선택 이론적 최적\n미래 예측 불가 실현 불가능"],
          ["② 선택을 위한 기본 정책", "대체로 좋은 결론 오버헤드 적음"],
          ["③ 교체 제외 페이지", "슈퍼바이저 코드 페이징용 코드\n드라이버·버퍼 입출력 버퍼 영역"],
          ["④ 낮은 오버헤드", "선택 시간 최소 좋은 결정 유지"],
        ],
      },
      {
        caption: "NUR의 교체 순서",
        headers: ["페이지", "그룹1", "그룹2", "그룹3", "그룹4"],
        rows: [
          ["참조비트", "0", "0", "1", "1"],
          ["수정비트", "0", "1", "0", "1"],
          ["교체순서", "1", "2", "3", "4"],
        ],
      },
      {
        caption: "페이지 교체 알고리즘을 사용하는 이유",
        headers: ["구분", "사용 이유", "설명"],
        rows: [
          ["Size", "크기 제약 탈피", "메모리보다 커도"],
          ["Size", "메모리 제약 탈피", "부족 공간 확보"],
          ["Resource", "페이지 부재 대응", "교체 프레임 결정"],
          ["Resource", "다중 프로세스", "효율적 생성 처리"],
          ["Resource", "적재 성능 향상", "입출력 횟수 감소"],
        ],
      },
      {
        caption: "페이지 교체의 문제점과 해결방안",
        headers: ["구분", "주요 내용", "설명"],
        rows: [
          ["문제점", "Demand\nPaging", "필요 시 적재\n프로세스 증가"],
          ["문제점", "Page\nFault", "미적재 사용\n부재 OS 요구"],
          ["문제점", "Thrashing", "성능 저하 초래"],
          ["해결방안", "Load\nControl", "생성 지연\n보류 큐 대기"],
          ["해결방안", "Locality\n활용", "지역성 집중\n시간·공간 참조"],
          ["해결방안", "Working\nSet", "일정 시간 참조\n주기억에 유지"],
          ["해결방안", "PFF", "부재 빈도 조정"],
        ],
      },
    ],
    notes: [
      "① 동일 그룹 내에서는 무작위 선택",
      "② 일정 주기로 모든 참조비트를 0으로 변경. 수정비트는 유지 → 그룹2는 주기적으로 참조비트를 0으로 만든 결과",
      "페이지 버퍼링: 교체된 페이지를 잠시 메인 메모리에 유지하고 빈 프레임을 항상 유지 — 교체된 페이지 리스트를 '수정된 적 없는 페이지'와 '수정된 페이지(일괄 기록)' 둘로 관리",
      "SCR은 참조 비트 0이면 교체, 1이면 2차 기회를 주고 순환 큐로 다음 페이지 조사 — 모든 비트가 1이면 FIFO와 같아짐",
    ],
  },
  {
    topicId: "ca-90",
    title: "Belady's Anomaly(FIFO 이상현상)",
    course: "OS",
    definition:
      "FIFO 페이지 교체 알고리즘에서, 페이지 프레임의 개수 증가 불구하고 page fault 발생이 오히려 증가하는 현상",
    defShort: "FIFO 페이지 프레임 증가에도 page fault가 증가하는 현상",
    lead: "프레임 증가의 역효과, Belady's Anomaly",
    features: ["FIFO 한정 현상", "프레임 증가 역효과", "Locality 미고려"],
    keywords: ["FIFO", "page fault 증가", "Page Frame 증가", "LRU", "OPT"],
    tables: [
      {
        caption: "벨레이디의 변이의 원인과 영향",
        headers: ["구분", "설명"],
        rows: [
          ["원인", "Locality 미고려 FIFO의 한계"],
          ["영향", "Page Fault 증가로 인한 성능 저하\nThreshing 발생"],
        ],
      },
      {
        caption: "Belady's Anomaly 극복 방안",
        headers: ["구분", "극복 방안", "설명"],
        rows: [
          ["페이지 교체 정책", "LRU 사용", "Least Recently Used\n가장 최근 참조 안된 페이지 교체"],
          ["페이지 교체 정책", "OPT 사용", "Optimal Page Replacement\n향후 가장 오래 미사용 페이지 교체"],
          ["최적화 원칙 설계", "Locality", "시간적·공간적·순차적 지역성\nWorking Set 활용"],
          ["최적화 원칙 설계", "PFF", "빈도 따라 Residence Set 조정\nPFF 높으면 크기 증가\nPFF 낮으면 크기 줄임"],
        ],
      },
    ],
    notes: [
      "사례: 참조페이지 1,2,3,4,1,2,5,1,2,3,4,5 — 페이지 프레임이 3인 경우 page fault 총 9회, miss ratio 9/12=75%, hit ratio 25%",
      "페이지 프레임이 4인 경우 page fault 총 10회, miss ratio 10/12=83.3%, hit ratio 16.7% → 프레임을 늘렸는데 부재가 늘어남",
    ],
  },
  {
    topicId: "os-75",
    title: "스레싱(Thrashing)",
    course: "OS",
    definition:
      "멀티프로세싱 환경에서 페이지 부재로 인해 CPU가 프로세스 실행보다 페이지 교체에 더 많은 시간을 소요하는 비 정상적인 현상",
    defShort: "페이지 부재로 프로세스 실행보다 페이지 교체에 더 많은 시간 소요 현상",
    lead: "잦은 교체의 성능 저하, 스레싱",
    features: ["CPU 이용률 급락", "페이지 교체 과다", "임계점 이후 발생"],
    subDefs: [
      {
        name: "Working Set",
        lead: "Locality 페이지의 집합",
        def: "특정 시간 실행 프로그램의 Locality 포함 page들의 집합",
      },
      {
        name: "PFF(Page Fault Frequency)",
        lead: "부재율 기반 프레임 조정",
        def: "page fault가 발생 시 page frame을 조정하는 기법",
      },
    ],
    keywords: [
      "리소스 부족",
      "부적절한 Page 교체 정책",
      "과도한 다중 프로그래밍",
      "페이지 부재율 증가",
      "CPU 사용율 감소",
      "Working Set",
      "PFF",
    ],
    tables: [
      {
        caption: "스레싱 발생 원인",
        headers: ["구분", "발생원인", "설명"],
        rows: [
          ["① 리소스 부족", "CPU 성능 부족", "저사양 자원 부족"],
          ["① 리소스 부족", "저용량 메모리", "리소스 추가 불가"],
          ["② 부적절한 교체 정책", "요구 기반 교체", "지역성 미고려"],
          ["② 부적절한 교체 정책", "페이지 교체 문제", "빈번한 시간 지연"],
          ["③ 과도한 다중 프로그래밍", "다중 프로세스", "설계 의존 문제"],
          ["③ 과도한 다중 프로그래밍", "할당 프레임 감소", "멀티 과다 수행"],
        ],
      },
      {
        caption: "스레싱 발견 방법",
        headers: ["발견 방법", "설명"],
        rows: [
          ["① Page Fault 조사", "PFF 측정\nProcess별 Page Fault Frequency"],
          ["② Swapping 조사", "프로세스 주기억↔보조기억 이동"],
        ],
      },
      {
        caption: "스레싱 해결 방안",
        headers: ["기법", "정의", "설명"],
        rows: [
          ["Working Set", "Locality 포함 page 집합", "일정 시간 참조 page 집합 유지\n지역성 참조로 page fault 감소"],
          ["PFF", "page frame 조정 기법", "PFF > 상한 → Page Frame 증가\nPFF < 하한 → Page Frame 회수\nWorking Set 대비 Overhead 낮음"],
        ],
      },
      {
        caption: "Working Set과 PFF의 비교",
        headers: ["구분", "Working Set", "PFF"],
        rows: [
          ["페이지집합 수정방식", "참조 시마다 수정", "부재 시만 수정"],
          ["Thrashing 조절", "선페이징 유용\n조절 어려움", "직접 방지\nPFF 측정 조절"],
          ["Overhead", "참조마다 수정\n오버헤드 큼", "부재 시만 조절\n오버헤드 작음"],
        ],
      },
      {
        caption: "워킹셋 구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["대상", "Reference Page", "참조 페이지 메모리 참조 대상\n다수일수록 스레싱에 효과"],
          ["크기", "Working Set Size", "처리시간 의존 크기 동적 변화\n스왑 조절 워킹셋 충족"],
          ["범위", "Working Set Window", "지역성 집합 수용 범위 결정\n고정 페이지 수 크기 최적화"],
        ],
      },
      {
        caption: "스레싱 예방 기법 — 운영체제 설정·프로그램 설계 측면",
        headers: ["구분", "예방 기법", "세부 기법"],
        rows: [
          ["운영체제 설정", "Page\nSize 결정", "교체 부하 방지\nTLB 범위 고려"],
          ["운영체제 설정", "역 페이지 테이블", "테이블 공간 축소"],
          ["프로그램 설계", "Locality\n고려", "루프·배열 특성\n호출 구조 고려"],
          ["프로그램 설계", "페이지 Lock\nI/O 차단", "교체 방지\n사용자 공간"],
        ],
      },
    ],
    notes: [
      "개념도: CPU 이용율이 다중 프로그래밍 정도에 따라 상승하다 임계점 이후 급락 → Thrashing 구간",
      "Working Set 예: 참조된 페이지 a a b b b c a a c c c c d d c c e e c f — W(t, w) = { a, c, d }",
      "워킹셋 모델: 프로세스의 워킹셋 전체가 메모리에 올라와 있어야 수행되고, 아니면 모든 프레임을 반납한 후 Swap out",
      "PFF 상한선: Page Fault Rate > 상한 → 프레임 할당이 너무 적은 상황, 프레임 추가 할당 / 하한선: < 하한 → 프레임 할당이 많아 낭비, 프레임 회수",
      "Windows의 Auto Working-Set Trimming 등 운영체제별 공간 확보 기능이 있어 적극 활용 권장",
    ],
  },
  {
    topicId: "os-74",
    title: "지역성(Locality)",
    course: "OS",
    definition: "CPU가 어느 순간에 정보를 특정 부분만 집중적으로 참조하는 특성",
    defShort: "CPU가 어느 한 순간에 정보를 특정 부분만 집중적으로 참조하는 특성",
    lead: "참조 집중 경향의 성질, 지역성(Locality)",
    features: ["부분 집중 참조", "캐시 적중률 향상", "Thrashing 최소화"],
    keywords: ["시간적", "공간적", "순차적"],
    tables: [
      {
        caption: "지역성 유형",
        headers: ["유형", "내용", "사례"],
        rows: [
          ["Temporal Locality (시간적)", "페이지 집중 접근\n블록 교체 활용", "Looping\nLRU"],
          ["Spatial Locality (공간적)", "일정 위치 접근\n블록 교체 활용", "배열·순차 코드\n워킹셋 활용"],
          ["Sequential Locality (순차적)", "순차 인출 실행\nPrefetch", "명령어 순차 인출\n미리 인출"],
        ],
      },
      {
        caption: "Locality 사례",
        headers: ["구분", "내용", "유형"],
        rows: [
          ["Cache Memory", "LRU 블록 교체", "시간적"],
          ["Cache Memory", "인출 알고리즘\n미리 인출 배치", "공간적·순차적\n지역적"],
          ["Virtual Memory", "워킹셋 교환 최소", "공간적"],
          ["Virtual Memory", "NRU·FIFO·LRU", "시간적·공간적"],
          ["CDN", "컨텐츠 신속 전달", "공간적"],
        ],
      },
      {
        caption: "지역성의 필요성",
        headers: ["필요성", "설명"],
        rows: [
          ["Cache Access 시간 최소화", "집중 참조 부분을\n캐시에 두어 접근\n시간 단축"],
          ["Cache 적중률 향상", "지역성이\n높을수록 적중률\n극대화 달성"],
          ["Thrashing 최소화", "참조 집합을\n유지해 페이지\n교체 과다 방지"],
        ],
      },
    ],
    notes: [
      "캐시 동작 순서: ① 프로그램·데이터가 주기억장치에서 캐시와 CPU에 동시 적재 → ② CPU는 캐시를 먼저 조회 → ③ 없으면 주기억장치 접근 → ④ 해당 워드를 포함한 블록이 캐시로 전송 — 이 블록 단위 참조가 지역성 활용",
      "캐시 활용 시 캐시 간 데이터 일관성 유지가 필수 — '캐시 일관성(Cache Coherence)' 토픽과 한 쌍 (NS 19기 2주차 1교시 10번)",
    ],
  },
  {
    topicId: "ca-58",
    title: "단편화(Fragmentation)",
    course: "OS",
    definition:
      "작업의 크기가 주기억장치 분할 영역과 맞지 않아 주기억장치 공간이 사용되지 못하고 낭비되는 현상",
    defShort: "작업 크기가 분할 영역과 안 맞아 주기억장치 공간 사용 못해 낭비되는 현상",
    lead:
      "할당 불일치의 공간 낭비, 단편화",
    features: ["분할 영역 불일치", "공간 낭비 현상", "분할 방식 의존"],
    subDefs: [
      {
        name: "내부 단편화",
        lead: "고정 분할의 잔여 공간",
        def: "분할 메모리에 프로세스 할당 시 할당된 메모리 내 남아서 사용 못하는 공간",
      },
      {
        name: "외부 단편화",
        lead: "가변 분할의 할당 불가",
        def: "영역이 너무 작아 작업에 할당되지 못하고 일정 분할 전체가 비어 있는 상태",
      },
    ],
    keywords: ["내부 단편화", "외부 단편화", "통합(Coalescing)", "집약(Compaction)"],
    tables: [
      {
        caption: "단편화 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["고정 분할", "내부단편화", "분할 메모리 할당 할당 내 잔여 공간"],
          ["가변 분할", "외부단편화", "작은 빈 분할 할당 불가 공백"],
        ],
      },
      {
        caption: "해결 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["병합", "통합(Coalescing)", "인접 공백 병합 하나의 공백 구성"],
          ["재배치", "집약(Compaction)", "분산 공백 결합 큰 가용 공간 생성\n재배치 필요 분할 주소 재지정"],
        ],
      },
      {
        caption: "커널 메모리 할당자 — 어느 단편화를 줄이는가",
        headers: ["구분", "할당자", "설명"],
        rows: [
          ["페이지 단위", "버디(Buddy) 시스템", "거듭제곱 블록 외부 단편화 억제\n짝 분할·병합 내부 단편화 잔존"],
          ["객체 단위", "슬랩(Slab) 할당자", "커널 객체 캐시 내부 단편화 최소\n크기 맞춤 재사용 초기화 비용 절감"],
          ["관계", "두 할당자의 관계", "버디 페이지 단위 외부 단편화 담당\n슬랩 객체 단위 내부 단편화 담당"],
        ],
      },
      {
        caption: "단편화 발생 원인",
        headers: ["유형", "원인", "설명"],
        rows: [
          ["내부 단편화", "할당 영역 크기 차", "영역>프로그램"],
          ["내부 단편화", "고정 분할 기법", "크기 무관 할당"],
          ["외부 단편화", "불연속 할당\n공간 합은 충분", "위치 불연속\n할당 불가"],
          ["외부 단편화", "가변 분할 기법", "불연속 낭비 발생"],
        ],
      },
    ],
    notes: [
      "내부단편화 예: 작업 큐 P1 7KB, P2 3KB, P3 6KB → 10KB 분할에 7KB 할당 시 3KB 내부 단편화, 4KB 분할에 3KB 할당 시 1KB 내부 단편화",
      "외부단편화 예: 작업 큐 P1 12KB, P2 8KB, P3 12KB → Memory 유휴 공간 16KB 존재하나 연속되어 있지 않아 P3 12KB 할당 불가",
      "통합 예: 공백(2K) + 프로그램 B(5K 사용) 종료 → 공백(2K)+공백(5K) → 통합 → 공백(7K)",
      "통합과 집약(압축)을 통해 단편화 일부 해소 가능 / 슬랩(Slab)과 버디(Buddy)는 Linux Kernel에서 사용하는 메모리 관리 기법",
      "할당자와 단편화 연결: 통합·집약이 이미 생긴 단편화를 사후에 걷어내는 방법이라면, 버디·슬랩은 애초에 덜 생기게 하는 할당 방식이다 — 버디가 외부, 슬랩이 내부를 맡는다고 짝지어 외운다",
          "연결 구조: 발생 원인을 분할 구조와 엮으면 — 고정 분할(페이징)→내부 단편화, 가변 분할(세그멘테이션)→외부 단편화. 배치 기법(First/Best/Worst Fit)이 외부 단편화 크기에 영향을 주고, 해결책이 통합(인접 공백 합침)·집약(전체 재배치)",
      "함께 볼 것: 대응 관계 상세는 '가상메모리의 페이징과 세그멘테이션'의 「단편화 대응 관계」 표 — 낭비가 블록 안이면 내부, 블록 사이면 외부로 위치만 기억하면 유형이 갈린다",
      "해결 대응: 내부 단편화 → 슬랩 할당자(프레임을 미리 작은 크기로 분할해 Cache→slab→object), 외부 단편화 → 버디 시스템(2의 거듭제곱 분할, 해제 시 free 버디 병합) / 통합·압축·재배치·메모리 풀로도 해결",
    ],
  },
  {
    topicId: "os-23",
    title: "스케줄러(Scheduler)",
    course: "OS",
    definition: "어떤 Process에게 시스템 자원을 할당할지를 결정하는 운영체제 커널의 모듈",
    defShort: "Process에 시스템 자원을 할당할지 결정하는 운영체제 커널 모듈",
    lead:
      "자원 할당의 결정자, 스케줄러",
    features: ["프로세스 상태 전이", "시스템 성능 최대화", "자원 할당 결정"],
    keywords: [
      "①장기(High Level/Job Scheduler)",
      "②중기(Middle-Level Scheduler)",
      "③단기(Low Level/CPU Scheduler)",
      "최대 처리량",
      "최소 응답시간",
      "최소 반환 시간",
      "최소 대기 시간",
      "CPU 최대 활용",
    ],
    tables: [
      {
        caption: "스케줄러의 종류",
        headers: ["종류", "프로세스 상태", "설명"],
        rows: [
          ["장기(Long-Term) 스케줄러", "생성(New)→준비(Ready)", "Job Poll 프로세스 준비상태 전환\n준비 상태 총 프로세스 수 제어\n멀티프로그래밍 정도 결정"],
          ["중기(Medium-Term) 스케줄러", "실행(Run)→대기(Wait)", "메인·보조 메모리로 스와핑"],
          ["단기(Short-Term) 스케줄러", "준비(Ready)→실행(Run)", "준비 큐 프로세스 중 CPU 할당 결정"],
        ],
      },
      {
        caption: "스케줄러의 정책 요구 사항",
        headers: ["요구사항", "증가 방법", "설명"],
        rows: [
          ["처리량 (Maximum throughput)", "짧은 작업 우선\n무인터럽트 수행", "주어진 시간 작업량 정도"],
          ["최소 응답 시간 (Minimum Response time)", "대화형 선수행\n일괄 처리 후수행", "요청→반응 시작까지 간격"],
          ["최소 반환 시간 (Minimum Turnaround time)", "일괄 작업 선수행", "요청 후 완료까지 소요 시간"],
          ["최소 대기 시간 (Minimum Waiting time)", "사용자 수 감소", "준비 큐에서 기다리는 시간"],
          ["CPU 최대 활용", "CPU 중심 작업", "CPU 이용 정도"],
        ],
      },
      {
        caption: "스케줄러(Scheduler)와 디스패처(Dispatcher)의 비교",
        headers: ["비교 항목", "스케줄러(Scheduler)", "디스패처(Dispatcher)"],
        rows: [
          ["개념", "자원 제공 결정\n프로세스 선택", "제어권 제공\n단기 선택 대상"],
          ["유형", "장기 중기 단기", "단일 명령어 집합"],
          ["알고리즘", "선점·비선점\nFCFS·SJF 등", "알고리즘 부재"],
          ["수행 기능", "전이 대상 선택", "문맥 교환\n사용자 모드 전환\n재시작 위치 이동"],
        ],
      },
      {
        caption: "스케줄러의 특징",
        headers: ["특징", "설명"],
        rows: [
          ["프로세스 상태 전이", "스케줄러에 의해\n각 프로세스의\n상태가 전이됨"],
          ["시스템 성능 최대화", "운영체제가\n시스템 성능을\n최대화하도록\n수행"],
        ],
      },
    ],
    notes: [
      "역할 구성도: Job Poll →(장기 스케줄러)→ Ready Queue →(단기 스케줄러)→ CPU / I/O Waiting Queue ↔ I/O, 중기 스케줄러가 스와핑 담당",
      "함께 볼 것: 어느 스케줄러가 어느 상태 전이를 일으키는지는 '프로세스 상태 전이도'의 「상태 전이별 담당 스케줄러」 표 — 장기=Job, 단기=Process, 중기=Swapper로 이름이 대응된다",
      "간트 차트 연결: 위 「정책 요구 사항」의 응답시간·반환시간·대기시간은 말로만 두면 비교가 안 된다 — 단기 스케줄러가 정한 실행 순서를 간트 차트로 그려야 세 지표가 숫자로 나오고 알고리즘 우열이 갈린다. 산출식은 'CPU 스케줄링' 토픽의 「간트 차트로 성능 평가」 표",
      "간트 차트를 쓰는 범위: 장기·중기 스케줄러는 큐 진입과 스와핑을 다루므로 시간축에 그릴 실행 구간이 없다 — 간트 차트는 CPU를 실제로 점유하는 단기 스케줄링에만 그린다",
      "다른 표현: 프로세스 상태를 보고 누구에게 CPU·메모리를 주고 거둘지 정하는 시스템 소프트웨어 — 프로세스를 큐나 CPU로 옮기는 것이 하는 일",
    ],
  },
  {
    title: "프로세스 상태 전이도",
    course: "OS",
    definition: "하나의 프로세스가 시스템 내에 존재하는 동안 그 프로세스가 가지는 상태",
    // 교재 정의는 '…가지는 상태'로 끝나지만 토픽은 그 상태와 전이를 그린 다이어그램이다 —
    // 종결어를 정확히(해설집: "생성·수행·소멸 과정에서 변경되는 상태 및 전이를 표현한 다이어그램").
    defShort: "하나의 프로세스가 시스템 내에 존재하는 동안 그 프로세스가 가지는 상태",
    lead:
      "프로세스 일생의 상태 흐름, 프로세스 상태 전이도",
    features: ["CPU 조건 따른 전이", "선점·비선점 정책", "문맥교환 유발"],
    keywords: [
      "①생성【Job】",
      "②준비【Job】",
      "③실행【Process, Dispatcher】",
      "④대기【Process】",
      "⑤종료【Job, Process】",
    ],
    tables: [
      {
        caption: "프로세스 상태",
        headers: ["상태", "스케줄러", "설명"],
        rows: [
          ["생성", "Job Scheduler", "작업 특성 맞는 Queue 생성\n예상 CPU 시간·우선순위 등 기록"],
          ["준비", "Job Scheduler", "CPU 할당을 대기하는 상태\n사전 정의 정책 따라 스케줄러 호출\n주기억장치 이용 가능성 검사\n요구 장치 검사"],
          ["실행", "Process Scheduler\nDispatcher", "준비→실행: FCFS·SJF 알고리즘\n스케줄러에 의해 CPU 제어권 획득\n실행→준비: 할당 시간 만료\n높은 우선순위 프로세스 도달 시"],
          ["대기", "Process Scheduler", "실행→대기: 자원·I/O 대기 보류\n대기→준비: I/O 관리자 Signal\nPage Interrupt handler Signal\nProcess는 준비 Queue로 전이"],
          ["종료", "Job Scheduler\nProcess Scheduler", "작업의 정상적 종료\nPCB 제거"],
        ],
      },
      {
        caption: "상태 전이별 담당 스케줄러 — 어느 전이를 누가 일으키는가",
        headers: ["전이", "담당", "설명"],
        rows: [
          ["생성 → 준비 (Admit)", "장기 스케줄러\n다중화 정도 결정", "작업 풀→준비 큐\n준비 수 조절"],
          ["준비 → 실행 (Dispatch)", "단기 스케줄러\n디스패처", "실행 대상 선택\n문맥교환 제어권"],
          ["실행 → 준비 (Timeout)", "단기 스케줄러", "만료·선점 복귀"],
          ["실행 → 대기 (Block)", "스케줄러 아님\n프로세스 요청", "I/O 자원 요청\n스스로 대기 전환"],
          ["대기 → 준비 (Wake-up)", "스케줄러 아님", "I/O 완료 신호"],
          ["준비·대기 ↔ 보류 (Swap)", "중기 스케줄러\n스와퍼", "부족 시 스왑 아웃\n여유 시 스왑 인"],
          ["실행 → 종료 (Exit)", "장기·단기 공통\nPCB 제거", "종료 처리\n할당 자원 회수"],
        ],
      },
      {
        caption: "프로세스 전이 이벤트",
        headers: ["전이", "설명"],
        rows: [
          ["Dispatch", "준비 리스트의\n우선순위 높은\n프로세스가\nCPU를 점유"],
          ["Timeout", "할당된 CPU Time Slice 초과로\nCPU 점유\n프로세스 변경"],
          ["Block I/O", "긴급 입출력 등\n외부 요인으로\nCPU 자원 반납"],
          ["Wake up", "입출력 작업 종료\n등 기다리던\n이벤트 완료"],
          ["Swap in", "프로세스가\nCPU에 적재되는\n이벤트"],
          ["Swap out", "프로세스가\nCPU에서\n해제되는 이벤트"],
        ],
      },
      {
        caption: "상태 전이에서 문맥교환이 발생하는 시점",
        headers: ["발생 시점", "상태 전이", "설명"],
        rows: [
          ["① Dispatch", "준비→실행", "CPU 받아 실행"],
          ["② Time Slice", "실행→준비", "할당 시간 종료"],
          ["③ 입출력", "실행→대기", "I/O 요청 대기"],
          ["④ 시스템 콜", "실행→대기", "시스템 콜 이벤트"],
        ],
      },
    ],
    notes: [
      "스케줄러 이름 대조: 같은 것을 교재마다 달리 부른다 — 장기=Job Scheduler, 단기=Process Scheduler(CPU Scheduler), 중기=Swapper. '스케줄러(Scheduler)' 토픽은 장기·중기·단기로, 이 토픽은 Job·Process로 적혀 있으니 한 쌍으로 외운다",
      "전이 중 스케줄러가 일으키지 않는 것: 실행→대기(프로세스 자신의 I/O 요청)와 대기→준비(I/O 완료 인터럽트) 둘뿐 — 나머지는 모두 스케줄러가 고른 결과다",
      "상태 전이 Diagram: 생성(New) → 준비(Ready) ⇄ 실행(Running) → 종료(Finished) / 준비→실행: 디스패칭, 실행→준비: 시간 만료, 실행→대기(Waiting): 보류, 대기→준비: 조건만족",
      "지연 상태: 지연준비 = CPU에 적재되지 못했으나 자원은 얻은 상태, 지연대기 = CPU에 적재되지 못하고 자원도 얻지 못한 상태 — 보류(Suspend) 상태의 두 갈래",
      "특징 두 줄: 상태의 전이는 CPU의 특정 조건에 따라 일어나고, 운영체제의 선점·비선점 스케줄링 정책에 맞춰 전이된다",
    ],
  },
  {
    title: "CPU 스케줄링(CPU Scheduling)",
    course: "OS",
    definition:
      "다중 프로세스 환경에서 운영체제(스케줄러)가 프로세스에 합리적으로 CPU 자원을 할당(dispatch)하는 정책",
    defShort: "다중 프로세스 환경에서 프로세스에 합리적으로 CPU 자원 할당 정책",
    lead: "효율적 CPU 이용, CPU 스케줄링",
    features: ["스케줄러 주도 할당", "선점·비선점 구분", "기아·호위 존재"],
    subDefs: [
      {
        name: "선점형 스케줄링",
        lead: "실행 중 CPU 회수",
        def: "실행중인 프로세스를 중단하고 다른 프로세스에게 CPU 자원을 할당",
      },
      {
        name: "비선점형 스케줄링",
        lead: "종료까지 CPU 보장",
        def: "CPU를 강제로 빼앗을 수 없고 프로세스의 사용이 끝난 이후 할당 정책",
      },
    ],
    keywords: [
      "선점(RR, SRT, MLQ, MLFQ)",
      "비선점(Priority, FCFS, SJF, HRN)",
      "호위효과",
      "기아상태",
    ],
    tables: [
      {
        caption: "선점형 스케줄링(Preemptive Scheduling)",
        headers: ["구분", "알고리즘 유형", "설명"],
        rows: [
          ["시간 할당", "RR(Round Robin)", "단위시간 할당 시간 할당량 부여\n큐 마지막 이동 미처리 시 재대기"],
          ["잔여 시간", "SRT(Shortest Remaining Time)", "잔여 시간 최단 짧은 도착 시 선점"],
          ["다단계 큐", "MLQ(Multi Level Queue)", "종류별 다수 큐 고순위 큐 선점"],
          ["다단계 큐", "MLFQ(Multi Level Feedback Queue)", "큐별 시간 할당량 장기 수행 하위 큐"],
        ],
      },
      {
        caption: "비선점형 스케줄링(Non-preemptive Scheduling)",
        headers: ["구분", "알고리즘 유형", "설명"],
        rows: [
          ["우선순위", "Priority", "우선순위 부여 순위별 할당"],
          ["도착 순", "FCFS(First Come First Served)", "대기 큐 도착 순 선착순 할당"],
          ["실행 시간", "SJF (Shortest Job First)", "최단 버스트 짧은 작업 우선"],
          ["응답 비율", "HRN (Highest Response Ratio Next)", "SJF 약점 보완 작업 불평등 완화\n대기 비율 산정 비율 높으면 우선"],
        ],
      },
      {
        caption: "호위효과와 기아상태",
        headers: ["구분", "설명", "해결방안"],
        rows: [
          ["호위효과", "긴 선행 프로세스\n짧은 것 대기 증가", "SJF 스케줄링\nPriority"],
          ["기아상태", "고순위 지속 진입\n저순위 무한 대기", "HRN 스케줄링\nMLFQ"],
        ],
      },
      {
        caption: "간트 차트로 성능 평가 — 알고리즘 우열을 숫자로 가른다",
        headers: ["구분", "항목", "산출"],
        rows: [
          ["그리기", "간트 차트", "시간축 구간 나열"],
          ["지표", "반환시간", "완료−도착 시각"],
          ["지표", "대기시간", "반환−실행시간"],
          ["지표", "응답시간", "최초 실행−도착"],
          ["판정", "평균값 비교", "평균 대기·반환"],
        ],
      },
    ],
    notes: [
      "선점형: 운영체제가 필요하다고 판단하면 실행중인 프로세스를 중단하고 다른 프로세스에게 CPU 자원을 할당",
      "비선점형: 프로세스에게 할당된 CPU를 강제로 빼앗을 수 없고 프로세스의 사용이 끝난 이후 다른 프로세스에게 CPU의 자원을 할당하는 정책",
      "간트 차트 주의: 프로젝트관리의 간트 차트와 이름만 같고 목적이 다르다 — CPU 스케줄링에서는 이미 정해진 알고리즘의 실행 결과를 그려 평균 대기·반환시간을 계산하는 검증 도구이고, 프로젝트관리에서는 앞으로 할 일을 배치하는 일정 계획 도구다",
      "지표의 출처: 반환·대기·응답시간은 '스케줄러(Scheduler)' 토픽의 「스케줄링 정책 요구 사항」에 나오는 목표들이다 — 그쪽이 무엇을 좋게 만들지, 이쪽이 그것을 어떻게 재는지를 맡는다",
    ],
  },
  {
    title: "기한부(Deadline) 스케줄링",
    course: "OS",
    definition: "작업이 주어진 기한(마감시간) 안에 완료되도록 계획하는 스케줄링 기법",
    defShort: "작업이 주어진 기한(마감시간) 안에 완료되게 계획하는 스케줄링 기법",
    lead: "마감시간 보장 실시간 계획, 기한부 스케줄링",
    features: ["마감 시간 중심", "실시간 OS 적용", "CPU 이용률 한계"],
    keywords: [
      "실시간 운영체제(Real-Time OS, RTOS)",
      "RM(Rate Monotonic) 스케줄링 – 주기 기반",
      "EDF(Earliest-Deadline First) 스케줄링 – 마감 기한 기반",
    ],
    tables: [
      {
        caption: "실시간 System의 종류",
        headers: ["종류", "설명"],
        rows: [
          ["① 경성 실시간 시스템(Hard Real-Time)", "정한 시간내 반드시 완료 필요"],
          ["② 연성 실시간 시스템(Soft Real-Time)", "시간적 제한이 다소 약한 형태"],
        ],
      },
      {
        caption: "기한부 스케줄링의 기법 — RM과 EDF의 비교",
        headers: ["비교", "RM(Rate Monotonic)", "EDF(Earliest-Deadline First)"],
        rows: [
          ["정책", "정적 스케줄링", "동적 스케줄링"],
          ["환경", "태스크 사전 정의", "발생 예측 불가"],
          ["알고리즘", "짧은 주기 우선", "임박 마감 우선"],
          ["CPU 이용률", "이용률 낮음\n무한대 69%", "이용률 높음\n이론상 100%"],
          ["장점", "예상 가능\n단순", "주기 불필요\nCPU 효율성"],
          ["단점", "마감 보장 불가", "스케줄 예상 불가"],
        ],
      },
    ],
    notes: [
      "RM: 짧은 주기(Task 실행이 자주 필요한) 프로세스에 더 높은 우선순위를 부여하는 스케줄링 기법 / 조건: Task A의 주기 > Task B의 주기 → Task의 주기가 짧은 TaskB에게 우선권을 부여하여 Task A는 선점 당함",
      "① RM → '주기가 짧은 작업일수록 높은 우선순위', 단순하고 안정적이지만 CPU 활용 효율이 떨어짐",
      "② EDF → '마감 시간이 가장 임박한 작업부터 실행', CPU 활용을 최대로 할 수 있으나 구현이 복잡하고 오버헤드 큼",
    ],
  },
  {
    topicId: "os-36",
    title: "교착상태(Deadlock)",
    course: "OS",
    definition:
      "다중 프로그램 환경에서 두 개 이상의 프로세스가 다른 프로세스가 점유한 자원을 기다리면서 무한 대기하는 상태",
    defShort: "두 개 이상의 프로세스가 서로 점유한 자원을 기다리며 무한 대기하는 상태",
    lead: "자원 점유의 무한 대기, 교착상태(Deadlock)",
    features: ["상호 무한 대기", "환형 대기 구조", "필요조건 동시 성립"],
    keywords: [
      "상호배제",
      "점유 대기",
      "비선점",
      "환형 대기(상점비환)",
      "예방",
      "회피",
      "발견",
      "복구(예피발복)",
    ],
    tables: [
      {
        caption: "교착 상태 발생 조건",
        headers: ["구분", "조건", "설명"],
        rows: [
          ["자원", "상호 배제 (Mutual Exclusion)", "배타적 통제권 점유 시 대기 요구"],
          ["프로세스", "점유 대기 (Hold and wait)", "점유 채 대기 타 자원 해제 대기"],
          ["자원", "비선점 (Non-preemption)", "스스로 반환 전까지 제거 불가"],
          ["프로세스", "환형 대기 (Circular wait)", "환형 요구 관계 순환 형태 대기"],
        ],
      },
      {
        caption: "교착상태 해결 방안",
        headers: ["해결방안", "핵심 내용"],
        rows: [
          ["예방 (Prevention)", "4가지 조건 중 하나라도 발생 차단"],
          ["회피 (Avoidance)", "안전 상태 유지(불안정 상태 회피)\n여러 자원: 은행원·안전 알고리즘\n단일: 선언간선 자원할당 그래프\nWait-die, wound-wait 알고리즘"],
          ["발견 (Detection)", "감시 알고리즘 통해 교착상태 검사\n쇼샤니·포크만 제시 알고리즘\n자원할당 그래프, Wait for Graph"],
          ["회복 (Recovery)", "교착 해소까지 프로세스 순차 Kill\n종료비용 최소화(우선순위 등)\n모든 프로세스 종료"],
        ],
      },
      {
        caption: "교착상태와 기아현상의 비교",
        headers: ["구분", "교착상태", "기아현상"],
        rows: [
          ["원인", "Coffman\n4조건 동시", "선점·우선순위\n자원 독점"],
          ["대상 범위", "둘 이상 집단 의존", "일부 저순위 대상"],
          ["프로세스 상태", "대기·차단 상태\n상태 변화 불가", "준비·대기 상태\n할당만 거부"],
          ["자원 상태", "나눠 쥔 채 고립", "계속 할당·해제"],
          ["해결 메커니즘", "예방·회피\n탐지·복구", "에이징·공정큐\nHRRN 기법"],
          ["대표 알고리즘", "은행원 알고리즘\nRAG", "HRRN\n에이징 우선순위"],
        ],
      },
    ],
    notes: [
      "4가지 조건 모두 동시 발생 할 경우 교착 상태 발생",
      "개념도: Process 1 →(Waiting for)→ Resource 2 →(Assigned to)→ Process 2 →(Waiting for)→ Resource 1 →(Assigned to)→ Process 1 — 환형 구조",
      "기아와 갈라 쓰기: 교착은 서로 쥔 자원 때문에 아무도 못 움직이는 상태, 기아는 자원은 돌지만 특정 프로세스만 계속 밀리는 현상 — 137회 컴시응 출제, NS 18기·19기 2주차 연속 출제",
    ],
  },
  {
    topicId: "os-39",
    title: "자원할당 그래프(Resource Allocation Graph)",
    course: "OS",
    definition:
      "정점(vertex)들과 정점을 연결하는 간선(edge)들로 이루어져, 프로세스와 자원 간의 관계를 나타내는 방향성 그래프",
    defShort: "정점과 간선으로 프로세스와 자원 사이의 관계를 나타내는 방향성 그래프",
    lead:
      "자원 관계의 시각화, 자원할당 그래프",
    features: ["방향성 그래프", "사이클로 교착 판별", "다중 자원 시 불확정"],
    keywords: [
      "정점(Vertex)",
      "프로세스",
      "자원",
      "간선(Edge)",
      "요청 간선",
      "할당 간선",
      "교착상태",
      "사이클",
    ],
    tables: [
      {
        caption: "자원할당 그래프 구성 요소",
        headers: ["구성 요소", "세부 요소", "설명"],
        rows: [
          ["정점(Vertex)", "프로세스(Process)", "원 내에 Process pi로 표시\n자원을 요청하는 Process\n정점 V={P, R} 표현"],
          ["정점(Vertex)", "자원(Resource)", "사각형 내 단위 자원 수만큼 원 표시\n외부에 rj로 표시\nProcess가 사용할 공유 자원"],
          ["간선(Edge)", "요청 간선(Request edge)", "프로세스→자원 방향 연결한 선\n프로세스가 자원의 한 형태 요청\nPi→Rj(P가 R 요청·대기)"],
          ["간선(Edge)", "할당 간선(Assignment edge)", "자원→프로세스 방향 연결한 선\n자원이 프로세스에 할당\nRj→Pi(R 하나가 P에 할당)"],
        ],
      },
      {
        caption: "교착상태 탐지 방법",
        headers: ["번호", "방법", "설명"],
        rows: [
          ["1", "자원 그래프 검사\n사이클 유무", "교착상태 판정\n없으면 교착 없음"],
          ["2", "사이클 존재\n자원 유형별 1개", "교착상태 확정\n필요충분조건"],
          ["3", "사이클 존재\n자원 다수 보유", "교착 가능성만\n필요조건"],
        ],
      },
      {
        caption: "교착상태 발견 시 해결방안",
        headers: ["구분", "방안", "설명"],
        rows: [
          ["사전", "교착상태 진입 방지 프로토콜", "예방·회피 기법 교착상태 차단"],
          ["사후", "교착상태 허용 후 복구", "탐지 후 회복 회복 알고리즘"],
          ["무시", "교착상태 미발생 가정", "문제 무시 가정 발생 시 재시작"],
        ],
      },
    ],
    notes: [
      "작성 사례 — 집합 P, R, E: ① P = {P1, P2, P3} ② R = {r1, r2, r3, r4} ③ E = {(P1, r1), (P2, r3), (r1, P2), (r2, P2), (r2, P1), (r3, P3)}",
      "단위 자원의 수: ① r1, r3: 1개 ② r2: 2개 ③ r3: 3개",
      "교착 가능성만 있을 때(자원 인스턴스 여러 개)는 자원 할당 그래프 소거법으로 발생 유무 판단",
      "사이클이 있어도 교착이 아닌 사례: P1이 작업을 완료하고 R3를 반환하면 P3가 그 자원을 할당받을 수 있으면 교착 아님 / 사이클이 있고 할당받을 자원이 없으면 교착",
    ],
  },
  {
    topicId: "os-41",
    title: "Banker's 알고리즘(은행가 알고리즘)",
    course: "OS",
    definition:
      "프로세스가 자원을 요구할 때 시스템은 자원을 할당한 후에도 안정 상태로 남아있게 되는 지를 사전에 검사하여 교착상태의 발생을 회피하는 기법",
    defShort: "자원을 할당한 후 안정 상태인지 사전에 검사해 교착상태를 회피하는 기법",
    lead: "안정 상태 검사 교착 회피, Banker's 알고리즘",
    features: ["교착상태 회피", "사전 안정 검사", "최대 요구 사전 파악"],
    keywords: ["안정상태", "Available", "Max", "Need", "Allocation", "Request"],
    tables: [
      {
        caption: "은행가 알고리즘의 자료 구조",
        headers: ["항목", "구성", "내용"],
        rows: [
          ["Available", "길이 m 벡터", "Rj 가용 k개"],
          ["Max", "n×m 행렬", "Pi 최대 요청 수"],
          ["Need", "n×m 행렬\nMax−Alloc", "Pi 완료 필요 수\n잔여 요구 산출"],
          ["Allocation", "n×m 행렬", "Pi 현재 할당 수"],
        ],
      },
      {
        caption: "안정상태",
        headers: ["번호", "설명"],
        rows: [
          ["①", "가용+선행 점유 만족 시 안정상태"],
          ["②", "즉시 사용 불가 선행 종료 대기"],
          ["③", "Pj 종료 후 획득 수행 후 자원 해제"],
          ["④", "Pi 종료 후 다음 순번 진행"],
        ],
      },
    ],
    notes: [
      "개념도: 준비(자원 상황과 최대 사용량들을 미리 파악) → 자원 할당 요청(프로세스의 자원 할당 요구) → 안정? (안정 알고리즘에 의한 상황 점검) → YES: 자원 할당 / NO: 할당 거부",
      "안정 상태이면 할당 / 불안정 상태이면 승인 거부",
      "n = 프로세스 개수, m = 자원 유형의 개수",
      "안정상태 정의: 특정한 순서대로 각 프로세스에 자원을 할당할 수 있고, 교착상태를 방지할 수 있는 경우",
    ],
  },
  {
    topicId: "os-38",
    title: "Wait-Die와 Wound-Wait",
    course: "OS",
    definition:
      "[Wait-Die] 자원 요청 프로세스와 보유 프로세스의 타임 스템프를 비교하여 대기하거나 롤백하는 비선점 기반 DeadLock 회피 기법 / [Wound-Wait] 자원 요청 프로세스와 보유 프로세스의 타임 스템프를 비교하여 대기하거나 강제 종료하는 선점 기반 DeadLock 회피 기법",
    defShort: "타임스템프 비교로 대기·롤백하는 비선점 DeadLock 회피 기법",
    lead:
      "타임스탬프 기반 교착 회피, Wait-Die와 Wound-Wait",
    features: ["타임스템프 비교", "선점·비선점 대비", "젊은 쪽 희생"],
    keywords: ["타임스템프", "Old", "Young", "롤백", "강제종료", "선점", "비선점"],
    tables: [
      {
        caption: "Wait-Die와 Wound-Wait의 비교",
        headers: ["기법", "동작 방식", "요청이 오래된 프로세스", "요청이 젊은 프로세스"],
        rows: [
          ["Wait-Die", "늙은 것은 대기\n젊은 것은 종료", "Wait\n(기다림 허용)", "Die\n(롤백)"],
          ["Wound-Wait", "젊은 것을 종료\n자원을 선점", "Wound\n(강제 종료)", "Wait\n(기다림 허용)"],
        ],
      },
    ],
    notes: [
      "Wait-Die 동작: 낮은 Timestamp(Old Tr) T1 → T2(자원 점유) ← T3(높은 Timestamp, Young TR) — T1은 Wait, T3는 Die / Young(젊은) 트랜잭션(프로세스)는 롤백을 수행하고, 여러 번 발생 가능",
      "Wound-Wait 동작: T1은 Wound(강제 종료 수행), T3는 Wait / Old(늙은) 트랜잭션(프로세스)는 Young(젊은) 트랜잭션(프로세스)를 강제로 죽이고(Wound) 자원을 획득",
    ],
  },
  {
    topicId: "os-63",
    title: "인터럽트(Interrupt)",
    course: "OS",
    definition:
      "CPU가 현재 실행 프로그램의 처리를 강제적으로 중단시키고, 특정 주소에 위치한 프로그램을 수행하는 절차 혹은 제어 신호",
    defShort: "실행 프로그램 처리를 강제 중단, 특정 주소 프로그램 수행하는 제어 신호",
    lead:
      "실행 흐름의 강제 전환, 인터럽트",
    features: ["비동기 발생", "우선순위 처리", "벡터 참조"],
    keywords: [
      "인터럽트 서비스 루틴",
      "인터럽트 소스",
      "인터럽트 벡터",
      "인터럽트 우선순위",
      "기계 착오",
      "재시작",
      "외부",
      "입출력",
      "프로그램 검사",
      "슈퍼바이저 호출",
    ],
    tables: [
      {
        caption: "인터럽트 처리 절차",
        headers: ["구성 모듈", "세부 동작 절차", "설명"],
        rows: [
          ["인터럽트 벡터 테이블(IVT)", "인터럽트 발생", "요청 신호 검출"],
          ["인터럽트 벡터 테이블(IVT)", "인터럽트\n벡터 조회", "IVT ID 조회\n처리 루틴 분기"],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 금지", "진입 후 Lock"],
          ["인터럽트 서비스 루틴(ISR)", "프로세스\n상태 저장", "이전 정보\n문맥 저장"],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 처리", "요청 작업 수행"],
          ["인터럽트 서비스 루틴(ISR)", "프로세스\n상태 복구", "이전 정보\n문맥 복구"],
          ["인터럽트 서비스 루틴(ISR)", "인터럽트 허용", "자원 반납 종료"],
        ],
      },
      {
        caption: "인터럽트 발생 원인과 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["H/W 인터럽트", "기계 착오 인터럽트", "정전, 컴퓨터 기계적 문제"],
          ["H/W 인터럽트", "재시작 인터럽트(Restart Interrupt)", "오퍼레이터·타 프로세서 재시작"],
          ["H/W 인터럽트", "외부 인터럽트(External Interrupt)", "Operator, Timer 의도적 중단"],
          ["H/W 인터럽트", "입출력 인터럽트(I/O Interrupt)", "입출력 종료·오류 CPU 기능 요청"],
          ["S/W 인터럽트", "프로그램 검사 인터럽트(Program Check Interrupt)", "보호 공간 접근, 불법 명령 수행"],
          ["S/W 인터럽트", "슈퍼바이저 호출 인터럽트(Supervisor Call Interrupt)", "SVC 통해 운영체제 서비스 요청"],
        ],
      },
      {
        caption: "인터럽트 중첩",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["개념", "정의", "ISR 실행 중 추가 요청 발생"],
          ["처리 방식", "Priority-based Preemption", "우선순위 선점 고순위 중첩 처리"],
          ["처리 방식", "Interrupt Pending", "대기 후 순차 다중 순차 처리"],
        ],
      },
      {
        caption: "인터럽트 우선순위 — 전원 이상부터 SVC까지",
        headers: ["순위", "인터럽트", "설명"],
        rows: [
          ["1", "전원 이상", "정전·모듈 이상"],
          ["2", "기계 착오", "CPU 기능 오류"],
          ["3", "외부 신호", "타이머 외부장치"],
          ["4", "입출력 인터럽트", "전송 요구·종료"],
          ["5", "명령어 오류", "잘못된 명령 수행"],
          ["6", "프로그램 검사", "오버플로우 예외"],
          ["7", "명령 요청 SVC", "감시 프로그램"],
        ],
      },
      {
        caption: "인터럽트 벡터 테이블과 서비스 루틴",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["자료 구조", "인터럽트 벡터 테이블(IVT)", "루틴 주소 벡터 핸들러 참조 표"],
          ["처리 루틴", "인터럽트 서비스 루틴(ISR)", "사전 정의 루틴 IVT 주소 저장"],
        ],
      },
    ],
    notes: [
      "우선순위 원칙: 하드웨어 인터럽트가 소프트웨어 인터럽트보다 높고, 내부보다 외부 인터럽트가 높다",
      "다중 인터럽트: 낮은 인터럽트의 ISR 실행 중 높은 인터럽트가 들어오면 현재 ISR을 중단하고 높은 것을 먼저 처리해 우선순위 보장",
    ],
  },
  {
    topicId: "os-53",
    title: "프로세스(Process)와 스레드(Thread) 비교",
    course: "OS",
    definition:
      "[프로세스] 운영체제에서 프로세서(CPU)에 의해 실행되는 프로그램 단위 / [스레드] 하나의 프로세스 내에서 제어 흐름으로 프로세스의 실행 부분을 담당하는 일관된 실행의 기본 단위의 경량 프로세스",
    defShort: "CPU 실행 프로그램 단위인 프로세스와 프로세스 내 실행 단위 스레드",
    defPair: [
      {
        name: "프로세스(Process)",
        lead: "자원 할당의 기본 단위",
        def: "OS에서 CPU에 의해 실행되는 프로그램 단위, 자원 할당 기본 단위",
        features: ["자원 할당 단위", "독립적 실행", "PCB 전환 느림"],
      },
      {
        name: "스레드(Thread)",
        lead: "실행 흐름의 경량 단위",
        def: "하나의 프로세스 내 실행 부분을 담당하는 실행 기본 단위 경량 프로세스",
        features: ["CPU 이용 단위", "영역 대부분 공유", "전환 속도 빠름"],
      },
    ],
    lead:
      "실행 단위의 두 층위, 프로세스와 스레드",
    features: ["메모리 독립·공유", "문맥 전환 속도 차", "보호·공유 상충"],
    keywords: ["자원 할당 기본 단위", "프로세스 내 여러 Thread"],
    tables: [
      {
        caption: "프로세스와 스레드 비교",
        headers: ["구분", "프로세스", "스레드"],
        rows: [
          ["개념", "자원 할당 단위", "CPU 이용 단위"],
          ["구성 요소", "Code 영역\nData 영역", "Code 공유\nData 공유"],
          ["구성 요소", "Heap 영역\nStack 보유", "Heap 공유\nStack 별도"],
          ["구성 요소", "각 메모리 차지", "영역 대부분 공유"],
          ["역할", "강력한 보호 요구\n독립적 실행", "보호 요구 낮음\n메모리 공유"],
          ["Context Switching", "PCB 전환 느림", "전환 속도 빠름"],
          ["상호 통신", "시스템 콜 사용\n전체 블로킹", "라이브러리 콜\n요청 스레드만"],
          ["다중 처리", "여러 프로그램", "단일 앱 내 작업"],
          ["장점", "문맥 전환 발생\n높은 시스템 부하", "경량화 문맥 전환\n낮은 부하 유지"],
          ["장점", "순차 실행 수행\n실행 순서 예측", "자원 효율성 확보\n응답성 경제성"],
          ["단점", "성능 부하 발생\n전환 비용 증가", "비순차적 실행\n순서 예측 곤란"],
        ],
      },
      {
        caption: "PCB와 TCB의 비교",
        headers: ["구분", "PCB", "TCB"],
        rows: [
          ["개념", "프로세스 관리\n데이터 블록", "스레드 상태 유지\n데이터 구조"],
          ["역할", "프로세스 정보\n전 스레드 공유", "스레드 정보 저장\n스레드 내 사용"],
          ["주요 구성 요소", "Owner 소유\nPID 식별자", "스택 포인터\nPC 카운터"],
          ["주요 구성 요소", "Heap 포인터\n우선순위 정보", "State 상태\n레지스터 값"],
          ["주요 구성 요소", "활성 스레드", "실행 문맥 정보"],
          ["상호 연계 정보", "하나 이상 TCB", "PCB 링크 정보"],
          ["Context 관점", "실행 환경 정보", "실행 관련 정보"],
          ["관리 데이터 양", "관리 데이터 많음\n약 106개 필드", "포인터로 최소\n24개 필드"],
          ["관리 데이터 양", "TCB 공유 포함", "PCB 연결 관리"],
        ],
      },
    ],
    notes: [
      "개념도: 프로세스는 코드·데이터·힙·스택을 각각 독립적으로 소유 / 스레드는 코드·데이터·힙을 공유하고 스택만 별도 소유",
    ],
  },
  {
    topicId: "os-48",
    title: "PCB(Process Control Block)",
    course: "OS",
    definition:
      "프로세스가 실행될 때마다 프로세스의 정보를 기록하여 프로세스를 관리할 수 있는 특별한 자료구조",
    defShort: "프로세스가 실행될 때마다 프로세스의 정보를 기록해 관리하는 자료구조",
    lead: "실행 프로세스의 정보 기록, PCB",
    features: ["프로세스당 1개", "상태·자원 기록", "문맥교환 기준"],
    keywords: ["PID(프로세스 식별자)", "프로세스 상태", "프로그램 카운터", "레지스터 저장 영역", "프로세서 스케줄링 정보", "계정 정보", "입출력 상태 정보", "메모리 관리 정보"],
    tables: [
      {
        caption: "PCB 구성 정보 (식상카레스계입메)",
        headers: ["항목", "내용", "비고"],
        rows: [
          ["PID(프로세스 식별자)", "고유 식별자", "숫자·색인 항목"],
          ["프로세스 상태", "생성·준비·실행\n대기·중단", "PSR\n상태 레지스터"],
          ["프로그램 카운터", "다음 명령 주소\n실행 위치 표시", "PC 레지스터\nJump"],
          ["레지스터 저장 영역", "누산기·인덱스\n범용·조건 코드", "AC·ISR·MBR\nMAR·AX·CX"],
          ["프로세서 스케줄링 정보", "우선순위·큐포인터\n스케줄 매개변수", ""],
          ["계정 정보", "CPU 사용시간\n실제 사용시간\n사용 상한시간\n작업 번호", "AC"],
          ["입출력 상태 정보", "할당 I/O 장치\n개방 파일 목록", "장치 리스트\n열린 파일 정보"],
          ["메모리 관리 정보", "경계 레지스터\n페이지 테이블", "Page·Segment Table\nCache address"],
        ],
      },
      {
        caption: "PCB와 TCB의 정의",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["프로세스", "PCB (Process Control Block)", "상태·자원 정보 스케줄링 기준\n제어 블록 문맥교환 기준"],
          ["스레드", "TCB (Thread Control Block)", "스레드 실행 상태 경량 문맥교환\nCPU 수행 정보 기준 제어 블록"],
        ],
      },
      {
        caption: "PCB·TCB가 스케줄링에 활용되는 방식",
        headers: ["구분", "PCB", "TCB"],
        rows: [
          ["관리 대상", "프로세스\nCPU 간접 할당", "스레드\nCPU 직접 할당"],
          ["상태 정보", "생성 준비 실행\n상태 기반 판단", "준비 실행 대기\n스레드 단위 판단"],
          ["실행 정보", "PC·레지스터\n전체 문맥 교체", "PC·SP\n경량 교환"],
          ["스케줄링 정보", "순위·사용 시간\n정책 판단 근거", "타임 슬라이스\n스케줄러 선택"],
          ["역할 요약", "자원 소유·관리\n스케줄링 기준", "실행 흐름 관리\n스케줄링 실체"],
        ],
      },
      {
        caption: "PCB와 TCB 비교",
        headers: ["구분", "PCB", "TCB"],
        rows: [
          ["스케줄링 실체", "논리적 기준 단위", "실제 실행 단위"],
          ["주소 공간 관계", "독립 주소 공간", "PCB 공간 공유"],
          ["병렬성 관점", "프로세스 간 병렬", "동일 프로세스 내"],
          ["스케줄링 효율", "전환 비용 큼", "전환 비용 작음"],
        ],
      },
    ],
    notes: [
      "Program이 실행되면 Process가 생성되며, Process Address Space에 'code', 'data', 'stack'이 만들어짐",
      "이 Process의 Metadata들은 PCB에 저장됨",
      "Process Management란 말은 곧 PCB Management말과 의미가 일치",
      "PCB 구조: Pointer | Process state / Process ID(Unique ID) / Program counter(Next program that run) / Registers / Memory Limits / Accounting(Log INFO about process) / List of open file",
      "PCB와 TCB의 연계: 스레드는 프로세스에 종속된 실행 단위이며 PCB는 하나 이상의 TCB를 포함 — 프로세스가 종료되면 포함된 스레드도 함께 종료",
      "PCB는 프로세스 자원 관리를 위한 제어 블록이고, 실제 CPU 스케줄링은 TCB 단위로 수행되어 Context Switch 비용을 최소화 (NS 19기 2주차 1교시 3번 '스케줄링에 활용되는 방식')",
    ],
  },
  {
    topicId: "os-54",
    title: "멀티 쓰레드(Multi-Thread)",
    course: "OS",
    definition:
      "하나의 Processor 내에서 둘 이상의 흐름(Thread)이 동시에 존재하며 독립적으로 실행될 수 있는 구조",
    defShort: "Processor 내 Thread가 동시에 존재, 독립적 실행 구조",
    lead: "프로세스 내 병행 실행, 멀티 쓰레드",
    features: ["독립적 실행 흐름", "프로세스 자원 공유", "쓰레드별 스택 소유"],
    subDefs: [
      {
        name: "Single Thread",
        lead: "단일 흐름의 순차 실행",
        def: "한 번에 하나의 쓰레드만 실행되어 명령어 흐름이 하나뿐인 단일한 구조",
      },
      {
        name: "Interleaved Multithreading(IMT)",
        lead: "클록 단위의 교대 실행",
        def: "여러 쓰레드 명령어를 시간 단위로 번갈아 한 클록 사이클씩 실행하는 구조",
      },
      {
        name: "Blocked Multithreading(BMT)",
        lead: "블록 시점의 쓰레드 전환",
        def: "한 쓰레드가 메모리 지연 등으로 블록되면 다른 쓰레드를 실행하는 구조",
      },
      {
        name: "Simultaneous Multithreading(SMT)",
        lead: "동일 사이클의 동시 실행",
        def: "여러 쓰레드의 명령어를 같은 클록 사이클에 동시에 실행, 유닛 공유 구조",
      },
      {
        name: "Chip Multiprocessing(CMP)",
        lead: "다수 코어의 병렬 처리",
        def: "하나의 칩에 다수의 독립적인 코어가 존재, 각각 쓰레드 독립 실행 구조",
      },
    ],
    keywords: [
      "Single Thread",
      "Interleaved Multithreading(IMT)",
      "Blocked Multithreading(BMT)",
      "Simultaneous Multithreading(SMT)",
      "Chip Multiprocessing(CMP)",
    ],
    tables: [
      {
        caption: "멀티 쓰레드 종류",
        headers: ["Thread 종류", "정의", "특징"],
        rows: [
          ["Single Thread", "한 쓰레드만 실행", "한 번에 한 흐름만\nCPU 활용률 낮음"],
          ["Interleaved Multithreading (IMT)", "시간 단위 번갈아", "클록마다 교대\n하나씩 실행"],
          ["Blocked Multithreading (BMT)", "블록 시 타 쓰레드", "블록 시에만 교대\nIMT보다 낮음"],
          ["Simultaneous Multithreading (SMT)", "같은 클록 동시", "파이프라인 공유\nHyper-Threading"],
          ["Chip Multiprocessing (CMP)", "한 칩 다수 코어\n쓰레드 독립 실행", "물리 코어 병렬\n실행 유닛 독립"],
        ],
      },
    ],
    notes: [
      "프로세스 내에서 독립적으로 실행될 수 있는 최소 실행 단위",
      "Thread는 병렬 처리, 응답성 향상, 자원 효율적 사용을 위해 사용",
      "동일 메모리 공간과 자원을 사용하지만, 자신의 실행 흐름과 레지스터(Registers), 스택(Stack)을 소유",
      "단일 쓰레드: code·data·files 공유, Registers/Stack 1개 / 멀티 쓰레드: code·data·files 공유, Registers/Stack을 쓰레드마다 별도 소유",
    ],
  },
  {
    topicId: "os-58",
    title: "파일 시스템(유닉스 파일시스템)",
    course: "OS",
    definition:
      "파일과 디렉터리를 계층적인 트리 구조로 조직하며, 모든 데이터를 저장하고 관리하는 구조",
    defShort: "파일과 디렉터리를 계층적 트리 구조로 조직해 데이터 저장·관리 구조",
    lead:
      "계층적 데이터 조직, 유닉스 파일시스템",
    features: ["계층적 트리 구조", "아이노드 기반 관리", "장치도 파일 취급"],
    keywords: [
      "루트파일시스템",
      "일반 파일",
      "디렉토리 파일",
      "특수 파일",
      "부트 블록(Boot Block)",
      "슈퍼 블록(Super Block)",
      "아이노드",
      "데이터 블록",
    ],
    tables: [
      {
        caption: "유닉스 파일시스템의 구조",
        headers: ["구조", "설명"],
        rows: [
          ["부트 블록(Boot Block)", "부트·초기화 Bootstrap 코드 저장"],
          ["슈퍼 블록(Super Block)", "파일 시스템 기술 메타데이터 저장\n슈퍼 블록 자료 구조·크기·블록 수\n이용가능한 빈 블록 목록\n다음 빈 블록 가리키는 인덱스"],
          ["아이노드 (i-node)", "파일·디렉토리 모든 정보 보유"],
          ["데이터 블록 (Data Block)", "실제 데이터 저장 파일 형태"],
        ],
      },
      {
        caption: "유닉스 파일의 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["시스템", "루트 파일 시스템", "최소 하나 존재 하드디스크 상\n시스템 프로그램 디렉토리 포함"],
          ["데이터", "일반 파일", "실행·원시 파일 텍스트·데이터"],
          ["구조", "디렉토리 파일", "논리적 단위 하위 파일 정보\n파일명↔번호 아이노드 연결"],
          ["장치", "특수 파일", "주변 장치 연결 특수 파일 소유"],
        ],
      },
    ],
    notes: [
      "구조도: Hard Disk → Hard Disk Record + Partition 1/2/3 / Partition → Boot Blocks + Super Blocks + Inode List + Data(files and directories) (Cylinder Group 반복)",
      "Inode List Table ↔ Directory List Table(Inum, Filename) ↔ Data Block Reference ↔ Meta Data",
    ],
  },
  {
    topicId: "os-57",
    title: "유닉스의 inode",
    course: "OS",
    definition: "UNIX 파일 시스템에서 파일의 속성과 저장 위치를 관리하는 메타데이터 구조체",
    defShort: "UNIX 파일 시스템에서 파일 속성과 저장 위치 관리 메타데이터 구조체",
    lead:
      "파일 메타데이터의 핵심, 유닉스의 inode",
    features: ["메타데이터 구조체", "다단계 간접 참조", "번호 기반 식별"],
    keywords: [
      "i-node 소유 정보",
      "i-node number",
      "state",
      "owner ID",
      "group ID",
      "TimeStamp(Create, Modify, Access time)",
      "size block count",
      "Direct Block",
      "Double/Triple Indirect",
    ],
    tables: [
      {
        caption: "i-node 구성 요소",
        headers: ["구성요소", "세부 요소"],
        rows: [
          ["Attribute(기본 정보)", "mode·소유자 식별자\n그룹소유자 식별자\n파일접근 허가권한\nDisk 실 주소·파일 크기"],
          ["Attribute(기본 정보)", "최초 생성 시기\n최종 사용 시기\n최종 수정 시기\n파일 링크 수·파일 종류"],
          ["Index(data 정보)", "direct blocks(직접 블록)\nsingle indirect(단일 간접)\ndouble indirect(이중 간접)\ntriple indirect block"],
        ],
      },
      {
        caption: "새로운 파일에 i-node를 할당하는 과정",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["일반", "자유 i-node 할당", "기억된 아이노드 슈퍼블록 마지막\n자유 계수 감소 다음 번호 반환"],
          ["목록 소진", "자유 i-node 저장 (자유 i-node가 빈 경우)", "목록 빈 경우 디스크 탐색 채움\n마지막 번호 기억 가져온 번호 배정"],
        ],
      },
      {
        caption: "i-node를 반납하는 과정",
        headers: ["번호", "설명"],
        rows: [
          ["①", "사용 가능 수 아이노드 수 증가"],
          ["②", "반납↔기억 비교 번호 크기 비교\n낮은 번호 기억 이전 번호 제거"],
          ["③", "목록 공간 없음 기억 번호와 비교"],
          ["④", "499 반납 기억 535 목록 제거"],
          ["⑤", "소진 후 반납 목록 변화 없음\n재사용 시 재검색 499부터 탐색"],
        ],
      },
    ],
    notes: [
      "i-node 구조도: Attribute(mode, owner info, size, timestamps, size block count) + index(Direct blocks, Single Indirect, Double Indirect, Triple Indirect) → data 블록",
      "direct block pointers: 4KB / 4byte = 1024 → 1024 x 4KB = 4096KB 크기 저장",
    ],
  },
  {
    topicId: "os-59",
    title: "프로세스간 통신(IPC)",
    course: "OS",
    definition:
      "운영체제(OS)에서 실행 중인 프로세스들 간 상호 데이터를 교환할 수 있도록 하는 메커니즘",
    defShort: "OS에서 실행 중인 프로세스들 간 상호 데이터를 교환하게 하는 메커니즘",
    lead:
      "프로세스 간 데이터 교환, IPC",
    features: ["격리 주소 공간 연결", "로컬·원격 통신", "속도·안전 상충"],
    keywords: [
      "공유 메모리 방식",
      "공유 메모리(Shared Memory)",
      "메모리 맵(mmap)",
      "메시지 전달 방식",
      "파이프(Pipe)",
      "네임드 파이프(Named Pipe, FIFO)",
      "메시지 큐(Message Queue)",
      "소켓(Socket)",
      "시그널(Signal)",
    ],
    tables: [
      {
        caption: "공유 메모리 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["메모리", "공유 메모리(Shared Memory)", "특정 메모리 영역 공유 데이터 교환\n빠르지만 동기화 문제 해결 필요"],
          ["파일", "메모리 맵(Map Memory, mmap)", "파일을 메모리처럼 맵핑 공유\n파일 기반 지속성 존재"],
        ],
      },
      {
        caption: "메시지 전달 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["파이프", "파이프(Pipe)", "프로세스 출력→입력 전달\n단방향 통신 기법(부모-자식)"],
          ["파이프", "네임드 파이프(Named Pipe, FIFO)", "파일 시스템에 이름 있는 파이프\n단방향, 양방향 가능"],
          ["큐", "메시지 큐(Message Queue)", "운영체제 큐로 메시지 비동기 전달"],
          ["네트워크", "소켓(Socket)", "네트워크 기반 통신 방식\n같은 시스템/다른 시스템 통신"],
          ["신호", "시그널(Signal)", "이벤트 발생 알리는 비동기 신호\n종료·인터럽트 용도(SIGKILL)"],
        ],
      },
      {
        caption: "공유 메모리와 메시지 전달 방식의 비교",
        headers: ["구분", "공유 메모리 방식", "메시지 전달 방식"],
        rows: [
          ["개념", "공통 메모리 영역\n이용 데이터 전달", "커널 통한\n메시지 전달"],
          ["대표 기법", "공유 메모리\nmmap", "파이프\n메시지 큐\n소켓·시그널"],
          ["속도", "커널 배제\n빠른 속도", "커널 거침\n다소 늦음"],
          ["충돌", "발생 가능\n별도 동기화 필요", "발생 없음"],
          ["크기", "많은 양 전달\n커널은 구축시만", "적은 양 메시지\n매번 커널 관여"],
        ],
      },
    ],
    notes: [
      "IPC 분류 두음: 공유 메모리 방식(공·맵) / 메시지 전달 방식(파·네·메·소·시)",
      "속도가 필요하면 공유 메모리 + 동기화, 안전·원격이 필요하면 메시지 전달(소켓)",
    ],
  },
  {
    topicId: "os-24",
    title: "디스크 스케줄링(Disk Scheduling)",
    course: "OS",
    definition:
      "디스크 상의 여러 곳에 저장되어 있는 데이터를 엑세스 하기 위해 디스크 헤드가 움직이는 최적의 경로를 결정하는 기법",
    defShort: "데이터 엑세스 위해 디스크 헤드가 움직일 최적의 경로를 결정하는 기법",
    lead:
      "헤드 이동의 최적화, 디스크 스케줄링",
    features: ["헤드 이동 최적화", "탐색 시간 단축", "효율·공정성 상충"],
    subDefs: [
      {
        name: "FCFS(First Come First Serve)",
        lead: "도착 순서의 헤드 처리",
        def: "요청이 들어온 순서대로 디스크 헤드를 이동해 처리하는 스케줄링 기법",
      },
      {
        name: "SSTF(Shortest Seek Time First)",
        lead: "최근접 트랙의 우선 처리",
        def: "현재 헤드에서 가장 가까운 트랙의 요청을 먼저 처리하는 스케줄링 기법",
      },
      {
        name: "SCAN(엘리베이터 알고리즘)",
        lead: "한 방향 이동의 요청 처리",
        def: "헤드가 끝까지 이동하며 경로상 요청 처리 후 방향 전환하는 스케줄링 기법",
      },
      {
        name: "N-Step SCAN",
        lead: "그룹 단위의 SCAN 처리",
        def: "요청을 일정 크기의 그룹으로 나눠 그룹별로 SCAN을 수행하는 기법",
      },
      {
        name: "C-SCAN(Circular SCAN)",
        lead: "원형 확장의 단방향 이동",
        def: "한쪽 방향으로만 이동하고 끝에 도달하면 처음으로 돌아오는 원형 방식",
      },
      {
        name: "LOOK",
        lead: "요청 범위까지의 이동",
        def: "요청이 있는 마지막 위치까지만 이동 후 방향 전환하는 SCAN 개선 기법",
      },
      {
        name: "C-LOOK",
        lead: "단방향 이동의 처음 점프",
        def: "한쪽 방향으로만 이동하다 요청이 끝나면 처음 요청으로 점프하는 기법",
      },
      {
        name: "SLTF(Shortest Latency Time First)",
        lead: "회전 지연의 최소화",
        def: "같은 트랙에서 가장 빨리 도달 가능한 섹터를 선택해 회전 지연 최소화 기법",
      },
    ],
    keywords: [
      "FCFS",
      "SSTF",
      "SCAN",
      "N-Step SCAN",
      "C-SCAN",
      "LOOK",
      "C-LOOK",
      "SLTF",
    ],
    tables: [
      {
        caption: "디스크 스케줄링(Disk Scheduling) 기법의 유형",
        headers: ["기법", "정의", "동작 방식", "장점", "단점"],
        rows: [
          ["FCFS(First Come First Serve)", "요청 순서 처리", "요청 순서대로", "구현 단순\n공정성 보장", "평균 응답시간↑\n헤드 이동 비효율"],
          ["SSTF(Shortest Seek Time First)", "최근접 트랙 우선", "최근접 요청 선택", "평균 탐색시간↓\n효율적", "먼 요청 기아(Starvation)"],
          ["SCAN(엘리베이터 알고리즘)", "한 방향 이동 처리", "끝까지 이동\n방향 전환", "응답시간 균형\nFCFS보다 효율", "양 끝까지 이동\n불필요 이동"],
          ["N-Step SCAN", "SCAN의 변형\nN개 그룹 처리", "N개씩 묶어 배치\n그룹별 SCAN\n신규 요청 나중", "응답시간 예측", "일부 요청 지연"],
          ["C-SCAN(Circular SCAN)", "SCAN 원형 확장", "한쪽 방향 이동\n끝 도달 시 처음", "요청 처리 균일\n응답시간 예측", "복귀 중 요청 무시\n이동 낭비"],
          ["LOOK", "SCAN 개선\n요청 범위만 이동", "마지막 요청까지\n이동 후 전환", "불필요 이동 감소", "SCAN보다 효율\n여전히 기아 가능"],
          ["C-LOOK", "C-SCAN 개선\n요청 범위만 이동", "한쪽 방향 이동\n처음 요청 점프", "응답시간 균일\n이동 효율적", "먼 점프 시 지연"],
          ["SLTF(Shortest Latency Time First)", "회전 지연 최소화", "최단 도달 섹터", "회전 대기↓\n빠른 응답", "여러 트랙 제한"],
        ],
      },
    ],
    notes: [
      "LOOK 알고리즘 동작 메커니즘(에센바흐기법): 현 헤드 위치 0에서 방향으로 이동 중 — SCAN 스케줄링과의 총 헤드 이동 차: 28, 헤드 총 이동거리 208",
      "C-LOOK 알고리즘 동작 메커니즘: 현 헤드 위치 50, 헤드는 항상 왼쪽에서 오른쪽으로 이동 — 더 이상 오른쪽 요청이 없을 때 반대편 맨 끝(가장 작은 요청)으로 점프, 헤드 총 이동거리 413",
      "두음: FCFS·SSTF·SCAN·N-Step SCAN·C-SCAN·LOOK·C-LOOK·SLTF (FSSNC LCS)",
    ],
  },
  // ── 프로젝트 관리(PM) — 심화반 2주차 ─────────────────────────────
  {
    topicId: "gj-144",
    title: "경제성 분석 기법",
    course: "PM",
    definition:
      "비용과 편익을 측정하고 이에 따라 경제적 수익율을 계산함으로써 프로젝트 수행 여부를 결정하기 위해 사용하는 분석 기법",
    defShort: "비용 편익 측정해 경제적 수익율 계산, 프로젝트 수행 여부 결정 분석 기법",
    lead:
      "프로젝트 수행 여부 판단, 경제성 분석 기법",
    features: ["비용·편익 정량화", "현재가치 환산", "수행 여부 판단"],
    keywords: ["비용편익비율(BCR)", "투자회수기간(PP)", "내부수익률(IRR)", "순현재가치(NPV)"],
    tables: [
      {
        caption: "경제성 분석 기법",
        headers: ["기법", "설명"],
        rows: [
          ["비용편익비율(BCR)", "수익/비용 비율\nBCR=B/C\n1보다 크면 좋음"],
          ["투자회수기간(PP)", "투자비 회수기간\n투자비/연현금\n시간가치 무시"],
          ["순현재가치(NPV)", "미래 현금흐름\n현재가치 환산\n수익-투자 차이"],
          ["내부수익률(IRR)", "현금유입 현가와\n유출 현가 일치\nNPV=0 할인율"],
        ],
      },
      {
        caption: "투자회수기간, PP(Payback Period)",
        headers: ["구분", "특징 및 설명"],
        rows: [
          ["공식", "순현금흐름 = 현금유입 - 현금유출\n누적현금 = 전년누적 + 순현금흐름\nPP = 투자비용 / 연간 현금흐름\n예) 20만달러 / 4만 = 5년"],
          ["장점", "계산이 편함"],
          ["단점", "현금흐름의 시간가치 무시\n회수기간 이후 현금흐름 무시"],
          ["평가", "PP 길면: 프로젝트 리스크 증가\nPP 짧으면: 초기 투자비 신속 회수"],
        ],
      },
    ],
    notes: ["N: 사업 전체 기간, t: 현금 흐름의 기간, Ct: 시간 t에서의 순 현금 흐름, r: 할인율"],
  },
  {
    title: "프로젝트 관리 계획서",
    course: "PM",
    definition:
      "프로젝트를 계획, 실행, 감시 및 통제, 종료하는 방법을 명시한 여러 개의 보조 관리 계획서를 통합한 프로젝트 관리 계획 문서",
    defShort: "방법을 명시한 여러 개의 보조 관리 계획서 통합한 프로젝트 관리 계획 문서",
    lead:
      "보조 계획서의 통합 문서, 프로젝트 관리 계획서",
    features: ["보조 계획서 통합", "관리 방법 명시", "계획~종료 포괄"],
    keywords: ["개요", "업무", "일정", "인력", "교육", "통제", "품질", "인수", "측정"],
    tables: [
      {
        caption: "목차 (개업일인교통품인측)",
        headers: ["구분", "목차", "설명"],
        rows: [
          ["1", "프로젝트 개요", "프로젝트 전반적인 내용 설명"],
          ["2", "프로젝트 업무 범위", "프로젝트 업무 명확한 정의 수립"],
          ["3", "일정계획", "납기 정상 달성 목표 작업 일정 수립"],
          ["4", "인력관리", "프로젝트 인력에 대한 관리"],
          ["5", "교육계획", "프로젝트 인력·고객 교육계획"],
          ["6", "프로젝트 통제", "이슈·상황 모니터링 예방 및 통제"],
          ["7", "품질활동 계획", "정기/비정기 품질활동 계획 수립"],
          ["8", "인수 조건", "프로젝트 종료 시 인수 조건 설명"],
          ["9", "측정 계획", "검수 위한 성과 측정 계획 수립"],
        ],
      },
    ],
    notes: ["교재 두음: [개업일인교통품인측]"],
  },
  {
    topicId: "pm-24",
    title: "범위관리",
    course: "PM",
    definition:
      "프로젝트를 성공적으로 완료하기 위해 필요한 모든 작업 범위 업무와 산출물을 정의하고 관리하는 지식영역",
    defShort: "프로젝트 완료에 필요한 작업 범위 업무와 산출물 정의·관리 지식영역",
    lead:
      "작업 범위와 산출물의 정의, 범위관리",
    features: ["포함·제외 정의", "WBS 계층 분해", "기준선 변경 통제"],
    keywords: ["범위 관리 계획수립", "요구사항 수집", "범위 정의", "작업분류체계(WBS) 작성", "범위 확인", "범위 통제"],
    tables: [
      {
        caption: "세부 프로세스 및 주요 산출물",
        headers: ["프로세스", "세부 프로세스", "내용", "주요 산출물"],
        rows: [
          ["계획 프로세스", "범위관리계획수립", "절차·방법 정의", "범위관리계획서\n요구사항관리계획서"],
          ["계획 프로세스", "요구사항 수집", "요구사항 수집\n요구사항 문서화", "요구사항 문서\n요구사항추적매트릭스"],
          ["계획 프로세스", "범위 정의", "범위 기술서 개발", "범위기술서"],
          ["계획 프로세스", "WBS 작성", "작업 계층적 정의", "WBS\n범위 기준선"],
          ["감시 및 통제", "범위 확인", "인도물 공식 승인", "승인된 인도물"],
          ["감시 및 통제", "범위 통제", "기준선 변경 관리", "변경요청(CR)"],
        ],
      },
    ],
    notes: ["6단계: 범위 관리 계획 수립 > 요구사항 수집 > 범위 정의 > WBS 작성 > 범위 확인 > 범위 통제", "앞 4개는 계획 프로세스, 뒤 2개(범위 확인·통제)는 감시 및 통제"],
  },
  {
    topicId: "pm-25",
    title: "요구사항 수집기법",
    course: "PM",
    definition:
      "프로젝트 이해관계자들이 필요로 하는 기능적/비기능적 요구사항을 수집하고 정의하여 이와 관련된 문서를 작성하는 기법",
    defShort: "기능적/비기능적 요구사항 수집·정의해 관련된 문서를 작성하는 기법",
    lead:
      "이해관계자 요구의 도출, 요구사항 수집기법",
    features: ["이해관계자 참여", "암묵적 요구 도출", "요구사항 문서화"],
    keywords: ["[수분표의대프컨, 인포설벤브, 문서, 마친, 다투, 명관촉] 인터뷰", "핵심 전문가 그룹"],
    tables: [
      {
        caption: "요구사항 수집기법",
        headers: ["구분", "수집 기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "직접 대화로 정보 수집"],
          ["데이터 수집", "포커스 그룹(핵심전문가 그룹)", "선별 전문가 대화식 토론 정보 수집"],
          ["데이터 수집", "설문지 및 설문조사", "다수 대상자 질문지로 정보 수집"],
          ["데이터 수집", "벤치마킹", "경쟁사·선진사례 참조 요구사항"],
          ["데이터 수집", "브레인스토밍", "팀원간 아이디어 회의 정보 수집"],
          ["데이터 분석", "문서 분석", "고객 RFP·현 시스템 문서 참고"],
          ["데이터 표현", "마인드 매핑", "브레인스토밍 아이디어 맵 통합"],
          ["데이터 표현", "친화도", "아이디어 관련성·친밀감 분류"],
          ["의사 결정", "다기준 의사결정 분석", "체계적 분석 의사결정 매트릭스"],
          ["의사 결정", "투표", "만장일치 등 평가·단체 의사결정"],
          ["대인관계와 팀 스킬", "명목 집단 기법", "투표 방식 우선순위 부여"],
          ["대인관계와 팀 스킬", "관찰", "업무처리 방법·절차 직접 관찰"],
          ["대인관계와 팀 스킬", "촉진", "집중 토론, 적극적 대화 참여 유도"],
          ["기타 기법", "프로토타입", "주요 기능 모형 요구사항 조기 수집"],
          ["기타 기법", "컨텍스트 다이어그램", "시스템·사용자 상호작용 가시화"],
          ["기타 기법", "전문가 판단", "비즈니스·도메인 전문가 판단"],
        ],
      },
    ],
    notes: ["교재 두음: [수분표의대프컨] 인포설벤브, 문서, 마친, 다투, 명관촉"],
  },
  {
    title: "요구사항 명세서 SRS",
    course: "PM",
    definition:
      "SW를 분석, 설계, 구현, 유지하는 단계에서 검토, 평가, 승인의 기준이 되는 문서",
    defShort: "분석·설계·구현·유지 단계의 검토·평가·승인 기준이 되는 문서",
    lead:
      "검토·평가·승인의 기준, 요구사항 명세서 SRS",
    features: ["명확성", "검증가능성", "추적성"],
    keywords: ["명세원리", "작성시 유의사항", "목차"],
    tables: [
      {
        caption: "명세 원리 (명완검일수추개)",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["표현", "명확성", "하나의 의미\n요구 단일 해석\n모호함 없음"],
          ["표현", "완전성", "모든 요구 포함\n기능·성능·속성\n인터페이스\n설계제약 포함"],
          ["검증", "검증가능성", "충족 여부 확인\n달성 정도까지\n확인 가능"],
          ["표현", "일관성", "상호 모순 없음\n명세 내용 간\n정합성 유지"],
          ["관리", "수정용이성", "쉬운 수정\n요구 변경 시\n쉽게 반영"],
          ["관리", "추적성", "근거 추적\n요구 근거 추적\n상호 참조 가능"],
          ["관리", "개발 후 이용성", "운영·유지보수\n개발 후에도\n효과적 이용"],
        ],
      },
      {
        caption: "작성시 유의사항 (이상기제테품)",
        headers: ["구분", "설명"],
        rows: [
          ["이해성", "사용자·개발자가\n쉽게 이해하게"],
          ["상호성", "쌍방 동의·이해\n계약 서명 후\n변경 불가 인지"],
          ["기능정의", "목표 시스템의\n모든 기능 기술"],
          ["제약조건", "시간·비용·HW\n사용자·언어\n특성 등 제약"],
          ["테스트 기준", "인수 위한\n테스트 기준\n기능·특성·품질\n정량적 기술"],
          ["품질측정", "시험 가능 수준\n품질 측정 방법"],
        ],
      },
      {
        caption: "명세서 목차 설명 (개요, 범목개제, 기외성논DB속성하기)",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["개요", "범위(Scope)\n목적(Purpose)\n시스템 개요(System)\n일반 제약사항(Constraints)", "요구 범위 기술\n작성 목적 기술\n전반 내용 요약\n표준·HW 제한"],
          ["기능적 요구사항", "기능요구사항(Functional Requirement)\n외부 인터페이스 요구사항", "입력·처리·출력\n입출력 상세 기술"],
          ["기타 요구 및 제약사항", "성능 요구사항(Performance Requirement)\n논리적 데이터베이스 요구사항\n소프트웨어 시스템 속성(Software System Attribute)\nHW 요구 사항", "정적·동적 수치\nDB 논리 요구\n신뢰·가용·보안\n기억장치·통신"],
          ["인수 조건", "기능 및 성능 시험", "인수 확인 테스트"],
        ],
      },
    ],
  },
  {
    topicId: "pm-27",
    title: "WBS (Work Breakdown Structure)",
    course: "PM",
    definition:
      "프로젝트 목표 달성과 필요한 산출물을 위해 실행할 작업을 인도물 중심의 계층구조로 세분해 놓은 계층도",
    defShort: "목표 달성에 필요한 작업을 인도물 중심의 계층구조로 세분해 놓은 계층도",
    lead:
      "인도물 중심의 작업 분해, WBS(Work Breakdown Structure)",
    features: ["인도물 중심", "계층적 분해", "100% 규칙"],
    keywords: ["Work Package", "Plan Package", "100% rule", "Control Account", "Code of Account", "3~5수준"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["작업분할", "작업 패키지(Work Package)\n계획 패키지(Planning Package)", "측정·관리 가능 WBS 최하위 요소\n미착수 계획 중인 패키지 단위"],
          ["작업분류", "작업분류체계 사전(WBS Dictionary)\n작업분류체계 코드(Code of Account)", "작업 패키지 세부 내용 설명 요소\nWBS 요소 고유 식별자"],
          ["작업통제", "통제 계정(Control Account)\nRAM(Responsibilities Assignment Matrix)", "작업 패키지의 묶음\n작업 패키지별 담당자 정의·관리"],
        ],
      },
    ],
    notes: ["100% rule: WBS 작성의 각 레벨의 작업량 합이 100%가 되어야 하며, 각 레벨의 예산의 합도 전체 예산과 100% 맞게 WBS를 작성해야 한다는 이론 및 방법론"],
  },
  {
    topicId: "pm-30",
    title: "Scope Creep vs Gold-Plating",
    course: "PM",
    definition: "범위 관리 실패 원인",
    defShort: "통제되지 않은 범위 확장과 고객 요구 이상 기능 추가의 범위 관리 실패 원인",
    lead: "범위 관리 실패의 두 원인, Scope Creep vs Gold-Plating",
    features: ["무통제 범위 확장", "요구 초과 기능", "시간·비용 과다"],
    keywords: ["통제 되지 않은 요구사항 관리", "고객이 요구한 것 이상으로 기능이나 특성을 추가"],
    tables: [
      {
        caption: "Scope Creep 과 Gold Plating 비교",
        headers: ["구분", "Scope Creep", "Gold Plating"],
        rows: [
          ["정의", "범위 확장 무통제\n시간 원가 미조정", "요구 초과 기능\n비용·일정 초과"],
          ["원인", "범위관리 실패\n요구 관리 오류", "품질관리 실패\n요구사항 미확인"],
          ["현상", "예산 조기 소모", "시간·비용 낭비"],
          ["영향", "범위 시간 자원\n과다 소모 발생", "불필요 기능\n과도 품질 양산"],
          ["추가요청", "리뷰·승인 허용", "PM 미승인 금지"],
          ["범위관리", "명확한 범위 명세", "품질 목표·측정"],
        ],
      },
      {
        caption: "Scope Creep 방지방안",
        headers: ["방안", "설명"],
        rows: [
          ["프로세스 개발", "범위 추가를 위한\n프로세스 개발"],
          ["서비스 범위 확정", "명확하게 정의된\n서비스 범위 및\n추정치 개발"],
          ["고객 요구 확정", "확정된 서비스\n범위에 대한 고객\n요구 사항 최종\n확인"],
          ["공식 범위 체결", "프로젝트 범위와\n프로젝트 팀 간의\n결약 체결"],
          ["타임 시트 기입", "타임 시트 등을\n활용한 추가\n서비스에 대한\n목록 기입"],
        ],
      },
      {
        caption: "Gold Plating 방지방안",
        headers: ["측면", "방안", "예시"],
        rows: [
          ["프로세스", "시스템 체계화\n정량 범위 명확화", "범위관리"],
          ["조직", "PMO/QA 참여\n품질·인력 강화", "잦은 변경 지양"],
          ["개발", "과잉구현 방지\n비기능 정량 관리\n인스펙션·코드리뷰", "명확화"],
          ["검증", "설계 정합성 확인", "테스트"],
          ["의사소통", "미팅 모니터링", "회의"],
        ],
      },
    ],
  },
  {
    title: "활동기간 산정기법",
    course: "PM",
    definition: "한정된 자원으로 각 활동을 수행하는데 소요될 기간을 추정하는 기법",
    defShort: "한정된 자원으로 각 활동을 수행하는데 소요될 기간을 추정하는 산정 기법",
    lead:
      "활동 소요 기간의 추정, 활동기간 산정기법",
    features: ["자원 제약 전제", "불확실성 반영", "과거 실적 활용"],
    keywords: ["전문가 판단", "유사 산정", "모수 산정", "3점 산정", "상향식 산정", "데이터 분석", "의사 결정", "미팅"],
    tables: [
      {
        caption: "활동기간 산정기법 (전유모3상데의미)",
        headers: ["산정 기법", "설명"],
        rows: [
          ["전문가 판단", "과거 정보 활용\n전문가가 산정"],
          ["유사 산정", "과거 유사 실적\n참조해 산정\n정보 부족 시"],
          ["모수 산정", "실적 데이터로\n함수 정의 산출"],
          ["3점 산정", "낙관·비관치\n평균치 3점\n평균으로 산정"],
          ["상향식 산정", "WBS 최하위에서\n기간·원가 산정"],
          ["데이터 분석", "대안 분석\n예비 분석\n버퍼 일정 반영"],
          ["의사 결정", "Fist to Five\n손가락 거수법"],
          ["미팅", "활동 산정 미팅"],
        ],
      },
    ],
  },
  {
    topicId: "pm-35",
    title: "3점 산정",
    course: "PM",
    definition:
      "프로젝트 일정산정에 있어 낙관치(O), 비관치(P), 평균치(M) 의 산정 값을 계산하여 일정을 산정하는 기법",
    defShort: "낙관치·비관치·평균치 산정 값 계산해 프로젝트 일정을 산정하는 기법",
    lead: "낙관·비관·평균치의 가중, 3점 산정",
    features: ["PERT 기반 추정", "일정 위험 고려", "가중 평균 산정"],
    keywords: ["낙관치", "비관치", "평균치"],
    tables: [
      {
        caption: "3점 산정 기법 구성요소",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["추정치 요소", "낙관치(o)", "Optimistic: 낙관적 추정치"],
          ["추정치 요소", "평균치(m)", "Most likely: 가능성 최고 추정치"],
          ["추정치 요소", "비관치(p)", "Pessimistic: 비관적 추정치"],
          ["계산식 종류", "삼각분포", "Triangular: tE=(tO+tM+tP)/3"],
          ["계산식 종류", "베타분포", "Beta: tE=(tO+4tM+tP)/6"],
          ["계산식 종류", "표준편차", "sigma: (p-o)/6\n1~3sigma: 신뢰도 68·95·99%\n분산: ((비관치-낙관치)/6)^2"],
        ],
      },
      {
        caption: "3점 산정기법과 모수 산정, 유사 산정의 비교",
        headers: ["구분", "3점 추정", "모수 산정", "유사 산정"],
        rows: [
          ["개념", "PERT 개념", "통계관계 기반", "유사 사례 참조"],
          ["특징", "위험 고려", "수학적 원리", "과거 사례 이용"],
          ["도구", "O/M/P", "Parameter", "기존 프로젝트"],
          ["장점", "일정 위험 최소", "정량적 산출", "신속 파악 유리"],
          ["사례", "불확실성 높음", "선례정보 활용", "유사 프로젝트"],
        ],
      },
    ],
    notes: ["PERT(Program Evaluation and Review Technique): 작업 분해 → 네트워크 구성 → 시간 추정(te = (a+4m+b)/6, σ² = ((b−a)/6)²) → 임계경로(Critical Path) 분석"],
  },
  {
    topicId: "pm-36",
    title: "CPM (Critical Path Management)",
    course: "PM",
    definition: "시간과 비용을 고려하여 프로젝트의 최소 시간을 결정하는 네트워크 분석기법",
    defShort: "시간과 비용 고려해 프로젝트의 최소 시간을 결정하는 네트워크 분석기법",
    lead:
      "최소 소요 기간의 도출, CPM(Critical Path Management)",
    features: ["시간·비용 고려", "최소 기간 결정", "여유 0 임계경로"],
    keywords: ["CP (Critical Path, 임계경로)", "ES", "EF", "LS", "LF", "Free float", "Total float"],
    tables: [
      {
        caption: "절차 및 주 경로 도출방법",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["전진계산(Forward pass)", "ES 빠른 개시일", "선행 EF + 1"],
          ["전진계산(Forward pass)", "EF 빠른 종료일", "ES + 기간 − 1"],
          ["후행계산(Backward pass)", "LF 늦은 종료일", "후행 LS − 1"],
          ["후행계산(Backward pass)", "LS 늦은 개시일", "LF − 기간 + 1"],
          ["여유시간 계산(Float)", "TF 총 여유", "종료 미지연 활동 총 여유시간\nTF = LF − EF\nTF = LS − ES"],
          ["여유시간 계산(Float)", "FF 자유 여유", "FF = 후행 ES − EF − 1\n1일 시작기준"],
          ["CP", "CP 임계경로", "여유기간 0인 경로 연결"],
        ],
      },
      {
        caption: "사례",
        headers: ["작업", "기간", "(활동순서 배열) 선행작업"],
        rows: [
          ["A", "3d", "–"],
          ["B", "2d", "A"],
          ["C", "2d", "B, D"],
          ["D", "4d", "A"],
          ["E", "6d", "D"],
          ["F", "3d", "C, E"],
        ],
      },
      {
        caption: "사례 — Free Float / Total Float",
        headers: ["Free Float", "Total Float"],
        rows: [
          ["후행활동 ES 미지연 여유기간", "종료일 미지연 활동 총 여유 시간"],
          ["B: 2d, C: 4d, 나머지: 0d", "B: 6d, C: 4d, 나머지 0d"],
        ],
      },
    ],
    notes: ["절차: 액티비티 정의 > 액티비티 수행기간 추정 > 네트워크 다이어그램 작성 > Forward(ES, EF 계산) > Backward(LS, LF 계산) > Float 계산 > 주 경로 분석 > 프로젝트 수행기간 추정", "ES: 빠른 개시일, EF: 빠른 종료일, LS: 늦은 개시일, LF: 늦은 종료일, TF: 여유 기간(Total Float), FF: 자유 여유(Free Float)"],
  },
  {
    topicId: "pm-37",
    title: "CCM (Critical Chain Management)",
    course: "PM",
    definition:
      "자원제약사항을 고려하여 계획수립 시 과다하게 설정될 수 있는 여유시간을 줄여 통합된 버퍼로 책정하고 버퍼의 소진율을 모니터링하여 전체 프로젝트 일정을 관리하는 방법",
    defShort: "통합된 버퍼 책정, 버퍼 소진율 모니터링해 전체 프로젝트 일정 관리 방법",
    lead:
      "자원제약 기반 버퍼 관리, CCM(Critical Chain Management)",
    features: ["자원제약 반영", "통합 버퍼 책정", "버퍼 소진율 감시"],
    keywords: ["프로젝트 버퍼(안전, 모니터링, 행동)", "피딩 버퍼", "자원 버퍼"],
    tables: [
      {
        caption: "CCM 버퍼 분류",
        headers: ["종류", "설명"],
        rows: [
          ["프로젝트 버퍼(Project Buffer)", "Critical Chain 끝에 버퍼 관리\n안전영역: 사용해도 안전\n모니터링 영역: 사용 추이·원인\n행동영역: 버퍼 통제 조치"],
          ["피딩 버퍼(Feeding Buffer)", "Non-Critical Chain 끝에 관리\n작업 착수 지연 방지"],
          ["자원 버퍼(Resource Buffer)", "일종의 경보장치\n작업착수 전 수행시기 알림"],
        ],
      },
      {
        caption: "CPM과 CCM 비교",
        headers: ["구분", "Critical Path Management", "Critical Chain Management"],
        rows: [
          ["착수일", "ES 빠른 개시", "LS 늦은 개시"],
          ["관리 관점", "진척율·EVM", "버퍼 소진율"],
          ["여유시간/버퍼", "활동별 여유 반영", "버퍼 통합 관리"],
          ["자원 제약", "의존성 우선 계획\n자원 평준화 해소", "자원제약 자체\n계획에 반영"],
        ],
      },
    ],
    notes: ["교재 두음: 프로젝트(안모행) — 안전, 모니터링, 행동 / 프로젝트·피딩·자원 버퍼"],
  },
  {
    title: "일정단축 기법",
    course: "PM",
    definition: "프로젝트 범위 변경 없이 일정 기간을 단축 시키는 기법",
    defShort: "범위 변경 없이 자원 추가·병행 추진으로 일정 기간을 단축시키는 기법",
    lead: "자원 추가·병행 납기 확보, 일정단축 기법",
    features: ["범위 변경 없음", "주공정 대상 적용", "기간·비용 교환"],
    keywords: ["Crashing(자원 추가)", "Fast Tracking(병행 추진)"],
    tables: [
      {
        caption: "Crashing 과 Fast Tracking 비교",
        headers: ["구분", "Crashing", "Fast Tracking"],
        rows: [
          ["정의", "비용·시간 상충\n최소 자원 추가", "활동 의존성 조정\n순서 활동 중첩"],
          ["핵심", "자원추가 투입", "작업 병행 추진"],
          ["장점", "유휴 리소스 활용", "일정 여유 확보"],
          ["단점", "비용 증가\n원가 여유 시 적용", "재작업 위험 증가\n병행 중 사고 발생"],
          ["제약사항", "인력 여유 활동", "CP상 적용 불가"],
        ],
      },
    ],
    notes: ["공정 압축법(Crashing) 예: 10일 500만원 → 초과근무·추가자원 투입 → 8일 800만원", "공정 중첩 단축법(Fast Tracking): 작업 간의 관계를 조정 후 병행 추진하여 기간 단축"],
  },
  {
    topicId: "pm-46",
    title: "EVM(Earned Value Management, 획득 가치 관리)",
    course: "PM",
    definition:
      "사업의 업무 범위, 일정 및 비용에 대한 개발 성과를 통합 관리 함으로써, 프로젝트의 최종 사업 일정과 비용을 예측하여 Risk 를 사전에 조치 할 수 있는 관리 기법",
    defShort: "프로젝트 최종 사업 일정·비용 예측해 Risk 사전 조치하는 관리 기법",
    lead: "일정·원가 통합 성과 측정, EVM(획득 가치 관리)",
    features: ["일정·비용 통합", "획득가치 기준 측정", "완료 비용 예측"],
    keywords: ["PV", "EV", "AC", "SV", "CV", "SPI", "CPI", "ETC", "EAC", "VAC", "TCPI"],
    tables: [
      {
        caption: "획득가치 분석",
        headers: ["지표", "설명"],
        rows: [
          ["BAC", "Budget at Completion, 전체\n프로젝트 예산"],
          ["PV", "Planned Value, 특정 시점의\n계획 비용"],
          ["EV", "Earned Value, 특정 시점의\n완료된 업무의\n비용"],
          ["AC", "Actual Cost, 특정 시점까지\n발생한 실제비용\n값"],
        ],
      },
      {
        caption: "차이 분석 · 추세 분석",
        headers: ["구분", "지표", "설명"],
        rows: [
          ["차이 분석", "SV", "Schedule Variance 일정 차이\nEV-PV, SV<0 일정 지연"],
          ["차이 분석", "CV", "Cost Variance 비용 차이\nEV-AC, CV<0 예산 초과"],
          ["차이 분석", "SPI", "Schedule Performance Index\n일정 성과 지표\nEV/PV, SPI<1 일정 지연"],
          ["차이 분석", "CPI", "Cost Performance Index\n비용 성과 지표\nEV/AC, CPI<1 예산 초과"],
          ["추세 분석", "ETC", "Estimates to Completion\n향후 추가 발생 추정 원가\n비정형: (BAC-EV)\n정형: (BAC-EV)/CPI 등"],
          ["추세 분석", "EAC", "Estimates at Completion\nAC+ETC, 종료시 발생 원가"],
          ["추세 분석", "VAC", "Variance at Completion\nBAC-EAC, 종료시 추가 원가 추정"],
          ["추세 분석", "BCWR", "Budgeted Cost for Work Remained\nBAC-EV, 시기별 추정 잔여 업무량"],
          ["추세 분석", "TCPI", "To Complete Performance Index\n완료 성과 지수\nBAC 적용: (BAC-EV)/(BAC-AC)\nEAC 적용: (BAC-EV)/(EAC-AC)"],
        ],
      },
      {
        caption: "EVM 분석을 통한 프로젝트 일정, 원가 통제 방안",
        headers: ["구분", "설명", "통제방안"],
        rows: [
          ["일정지연", "SV<0\nSPI<1", "Crashing\nFast Tracking"],
          ["비용초과", "CV<0\nCPI<1", "Cost Control\nCost Management"],
        ],
      },
    ],
    notes: ["CV = EV − AC, SV = EV − PV"],
  },
  {
    topicId: "pm-50",
    title: "품질통제도구, QC 7",
    course: "PM",
    definition:
      "품질의 개발, 개선, 관리의 제 활동에 대한 유용한 도구로, 데이터의 기초적인 정리 방법으로 널리 쓰이며, 품질관리를 하는데 있어서 가장 필수적인 통계적 방법",
    defShort: "품질 개발·개선·관리 도구로 품질관리에 가장 필수적인 통계적 방법",
    lead: "데이터 정리의 통계적 방법, 품질통제도구 QC 7",
    features: ["통계적 방법", "데이터 기초 정리", "품질관리 필수"],
    keywords: ["품질통제도구", "현원자", "체파히", "특산층", "관"],
    tables: [
      {
        caption: "현상파악 · 자료관리 · 원인분석",
        headers: ["구분", "도구", "설명"],
        rows: [
          ["현상파악", "체크시트", "데이터 누락·오류 방지 체크 도표"],
          ["현상파악", "파레토 차트", "발생빈도순 나열 중요도 파악"],
          ["현상파악", "히스토그램", "막대그래프로 DATA 분포 형태 파악"],
          ["자료관리", "관리도(그래프)", "통계적 안정 판정 품질 수준 유지"],
          ["원인분석", "특성요인도", "결과·원인 관계 한눈에 파악 그림"],
          ["원인분석", "산점도", "두 변수 관계 규명 시각적 표현\n정비례·반비례·무 관계"],
          ["원인분석", "층별", "부분집단 나눠 분석 원인 규명\n작은 그룹 품질 분포 비교"],
        ],
      },
    ],
    notes: ["교재 두음: 현원자 / 체파히(현상파악), 특산층(원인분석), 관(자료관리)"],
  },
  {
    topicId: "pm-51",
    title: "형상 관리",
    course: "PM",
    definition:
      "SW 개발과정의 형상 항목을 식별하고 기록과 변경 제어를 하고 요구 사항에 부합하는지 검증하는 활동",
    defShort: "형상 항목을 식별하고 기록과 변경 제어, 요구 사항 부합을 검증하는 활동",
    lead:
      "산출물 변경의 통제, 형상 관리",
    features: ["기준선 기반 관리", "공식 변경 통제", "요구 부합 검증"],
    keywords: ["형상 식별", "형상 통제", "형상 감사", "형상 기록", "기능적", "분배적", "설계", "시험", "제품", "운용"],
    tables: [
      {
        caption: "형상관리 절차",
        headers: ["절차", "세부절차"],
        rows: [
          ["형상관리 준비", "수행 계획 정의 활동\n형상 관리 표준, 절차 기술"],
          ["형상 식별", "형상 항목의 정의 및 선정\n기준선, 참조 등 세부 사항 식별"],
          ["형상 통제", "변경 요청 심사 및 실시, 확인"],
          ["형상 감사", "체크리스트 기반 감사\n결과 문서화"],
          ["형상 기록", "Repository 기록"],
        ],
      },
      {
        caption: "형상관리 기준선",
        headers: ["SDLC", "기준선", "형상항목"],
        rows: [
          ["계획 단계", "기능적 기준선", "프로젝트 계획서\n개발 표준\n개발 프로세스"],
          ["요구분석 단계", "분배적 기준선", "요구사항 정의서\n기능분해도\n작업 흐름도\n자료 흐름도"],
          ["설계 단계 (기본 설계)", "설계 기준선", "화면 보고서\n명세서"],
          ["설계 단계 (상세 설계)", "설계 기준선", "ERD\n아키텍처 설계서\n프로그램 설계서"],
          ["개발(구현) 단계", "시험 기준선", "원시 코드\n목적 코드\n실행 코드\n단위 시험 보고서"],
          ["시스템 통합 및 테스트 단계 (통합 시험)", "제품 기준선", "통합 시험 계획서\n통합 시험 케이스"],
          ["시스템 통합 및 테스트 단계 (시스템 시험)", "제품 기준선", "시험 계획서\n시험 케이스\n시험 보고서"],
          ["설치 및 운영 단계", "운용 기준선", "운영자 지침서\n사용자 지침서\n이관 소스"],
        ],
      },
    ],
    notes: ["형상 식별 → 형상 통제 → 형상 감사 → 형상 기록", "기능적 → 분배적 → 설계 → 시험 → 제품 → 운용", "CCB(형상관리 통제 위원회)가 변경 승인, Repository(SVN, Git)에 기록"],
  },
  {
    title: "SW 품질비용",
    course: "PM",
    definition:
      "품질 향상을 위해 수행하는 품질관리와 관련된 활동비용을 원가로 계산한 것. 예방비용과 평가비용을 높여서 실패비용을 줄이는 것이 목표",
    defShort: "품질 향상 위해 수행하는 품질관리와 관련된 활동비용을 원가로 계산한 것",
    lead:
      "품질 활동의 원가 환산, SW 품질비용",
    features: ["활동비용 원가화", "적합·부적합 상충", "예방 중심 투자"],
    keywords: ["적합 품질비용(예방비용, 평가비용)", "부적합 품질비용(내부실패 비용, 외부실패 비용)"],
    tables: [
      {
        caption: "품질 비용",
        headers: ["구분", "항목", "세부 내용"],
        rows: [
          ["적합 품질비용", "예방비용", "결함 예방 활동"],
          ["적합 품질비용", "평가비용", "품질 확인 검증"],
          ["부적합 품질비용", "내부실패비용", "인도 전 결함수정"],
          ["부적합 품질비용", "외부실패비용", "인도 후 수정비용"],
        ],
      },
      {
        caption: "품질 비용 항목별 사례",
        headers: ["유형", "사례"],
        rows: [
          ["예방비용", "품질 계획, 기획, 각종 보고\n데이터 수집/분석\n훈련, 문서화, 장비, 개선 일정\n방법론 수립, 품질 감사 비용"],
          ["평가비용", "검사, 파괴 시험 손실\nSW Test, Review, Inspection\n공정/일정관리 비용"],
          ["내부실패비용", "재작업, 폐기물·폐기처리\n대책 검토 비용\n선별 작업 비용"],
          ["외부실패비용", "법적 책임, 하자보수, 사업손실\n할인 및 가격(단가) 인하\n신용 실추, 기회손실\n긴급대응 비용"],
        ],
      },
    ],
  },
  {
    topicId: "pm-53",
    title: "RACI 매트릭스",
    course: "PM",
    definition:
      "프로젝트 활동의 책임과 역할을 책임, 승인, 고려해야 할 대상, 통보의 4단계로 구분하여 표현한 매트릭스로 프로젝트의 의사소통, 평가 및 수용 도구",
    defShort: "역할을 책임·승인·고려해야 할 대상·통보 4단계로 표현한 매트릭스",
    lead:
      "역할과 책임의 명확화, RACI 매트릭스",
    features: ["역할·책임 명확화", "의사소통 도구", "A 단일 주체"],
    keywords: ["R(Responsible:책임)-실무담당자", "A(Accountable:승인)-의사결정권자", "C(Consult:고려 대상)-업무수행조언자", "I(Inform:통보)-결과보고대상자"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "역할", "설명"],
        rows: [
          ["R(Responsible)", "실무 담당자", "업무 수행 책임\n결과 도출 주체"],
          ["A(Accountable)", "의사 결정권자", "최종 책임·승인\n작업당 한 명"],
          ["C(Consult)", "업무 수행 조언자", "정보·자문 제공\n직접 수행 안 함"],
          ["I(Inform)", "결과 보고 대상자", "진행·결과 통보\n상황 인지 필요"],
        ],
      },
      {
        caption: "작성 원칙",
        headers: ["순서", "작성 원칙", "설명"],
        rows: [
          ["1", "R에 대한 A 존재", "책임만 있고 승인 없는 업무는 위배"],
          ["2", "A는 한 주체 할당", "여러 주체면 의사소통 혼란 초래"],
          ["3", "C·I 없어도 무방", "고려 대상·통보는 필수 역할 아님"],
          ["4", "R/A, C/I 동시 할당 가능", "R/A, C/I 구분해 한 주체 할당 가능"],
        ],
      },
    ],
  },
  {
    topicId: "pm-40",
    title: "자원 최적화",
    course: "PM",
    definition: "활동에 분배되는 자원을 최적화 하는 기법",
    defShort: "활동에 분배되는 자원을 최적화하는 기법으로 자원 평준화·자원 평활화",
    lead:
      "자원 과부하의 조정, 자원 최적화",
    features: ["과부하 방지", "주공정 변경 여부", "여유시간 내 조정"],
    keywords: ["Resource Leveling (자원평준화)", "Resource Smoothing (자원 평활화)"],
    tables: [
      {
        caption: "자원 평준화와 자원 평활화 비교",
        headers: ["구분", "자원 평준화 (Resource Leveling)", "자원 평활화 (Resource Smoothing)"],
        rows: [
          ["정의", "가용 수량 제한\n과부하 방지", "일정 활동 조정\n자원 한도 준수"],
          ["구동 조건", "과도한 작업시간\n동일 기간 중복", "자원 불균형 시\n주공정 불변"],
          ["주공정 변경", "변경 가능 지연", "변경 되지 않음"],
          ["대상 활동", "TF 0 이상 활동", "FF TF 내 조정"],
          ["자원 제약 요인", "법정 근무시간\n자원 최대한계", "관리 시간 제약\n최적 활용 한계"],
        ],
      },
    ],
  },
  {
    topicId: "pm-55",
    title: "동기부여 이론",
    course: "PM",
    definition:
      "조직원들이 어떤 욕구나 보상에 의해 어떠한 행동을 보이고, 그 성과는 어떠한가를 분석하는 이론",
    defShort: "조직원이 어떤 욕구나 보상으로 행동하고 성과를 내는지 분석하는 이론",
    lead:
      "조직원 행동과 성과 분석, 동기부여 이론",
    features: ["욕구·보상 기반", "행동·성과 연계", "내용·과정 관점"],
    keywords: ["내용이론", "매슬로우 욕구 5단계 이론", "허즈버그 2요인 이론", "맥그리거 X, Y 이론", "맥클랜드 욕구 이론", "과정이론", "기대이론", "목표설정 이론", "공정성 이론", "강화이론", "스키너"],
    tables: [
      {
        caption: "동기부여 이론 유형 (내과강)",
        headers: ["이론", "관점", "설명"],
        rows: [
          ["내용 이론", "What 관점", "동기 요인 규명"],
          ["과정 이론", "How 관점", "동기 과정 규명"],
          ["강화 이론", "Why 관점", "동기 발생 원인"],
        ],
      },
      {
        caption: "동기부여 이론 상세 설명 (매5 허투 맥스 맥3 기목공 스키너)",
        headers: ["이론", "상세이론", "설명"],
        rows: [
          ["내용 이론", "매슬로우 5단계", "하위욕구 충족 시 상위욕구 추구\n생리<안전<사회<존경<자아실현"],
          ["내용 이론", "허즈버그 2요인", "불만족·만족 유발요인 다름\n위생요인(불만족)\n동기요인(만족-책임감·존경)"],
          ["내용 이론", "맥그리거 X 이론", "본래 미숙\n소극적·수동적·타율적"],
          ["내용 이론", "맥그리거 Y 이론", "본래 성숙\n적극적·능동적·창의적"],
          ["내용 이론", "맥클랜드 욕구", "성취욕구\n친교(결연)욕구\n권력욕구"],
          ["과정 이론", "기대 이론", "보상·도구·기대감 시 동기유발"],
          ["과정 이론", "목표설정 이론", "분명한 목표 수립 시 동기유발"],
          ["과정 이론", "공정성 이론", "공정한 평가와 보상 필요"],
          ["강화 이론", "스키너", "행동은 환경적 결과로 결정\n긍정적 강화(인센티브·칭찬)\n부정적 강화(해가 되는 자극 부여)"],
          ["강화 이론", "스키너", "소거(특정 행위 없애는 방법)\n처벌(비판·급여 삭감)"],
        ],
      },
    ],
  },
  {
    topicId: "pm-56",
    title: "터크만 팀 개발 5단계",
    course: "PM",
    definition:
      "프로젝트 수행 시 팀 개발 과정을 설명하기 위해 형성, 스토밍, 표준화, 수행, 해산의 5단계로 표현한 모델",
    defShort: "팀 개발 과정 형성·스토밍·표준화·수행·해산 5단계로 표현한 모델",
    lead:
      "팀 성숙 과정의 단계 모델, 터크만 팀 개발 5단계",
    features: ["순차적 팀 발전", "갈등 통한 성숙", "단계별 리더십 전환"],
    keywords: ["형성", "스토밍", "표준화", "수행", "해산"],
    tables: [
      {
        caption: "단계별 설명 (형스표수해)",
        headers: ["단계", "설명"],
        rows: [
          ["형성", "프로젝트 이해\n팀원 독립적\nPM 결속력 유도"],
          ["스토밍", "갈등 발생\n개성 표현\nPM 포용력 필요"],
          ["표준화", "신뢰 형성\n책임감 공유\nPM 자율·참여"],
          ["수행", "성공적 진행\n자율·역량 발휘\nPM 권한위임"],
          ["해산", "마무리·해산\n교훈 정리"],
        ],
      },
      {
        caption: "단계별 상세 설명",
        headers: ["구분", "형성기(Forming)", "격동기(Storming)", "표준화(Norming)", "수행(Performing)"],
        rows: [
          ["주요 관심", "서로 인식", "갈등 처리", "협력 구축", "생산성 향상"],
          ["과업 목표", "열성", "역할 명료화", "몰입", "성취"],
          ["관계 상 목표", "수용", "소속감", "지원", "자긍심"],
          ["주요 딜레마", "회의vs안정", "동질vs이질", "지원vs간섭", "관심vs고립"],
          ["필요한 리더십", "지시형", "지도형", "참여형", "위임형"],
          ["필요한 행동", "팀 방향성 정립", "역할 명료화", "업무 역할 몰입", "수행 관리 평가"],
        ],
      },
    ],
  },
  {
    title: "갈등관리",
    course: "PM",
    definition:
      "갈등: 목적, 이해 또는 아이디어 등과 관련하여 구성원 사이에 강한 불합의나 불일치가 있는 현상",
    defShort: "목적·이해 등과 관련해 구성원 사이에 강한 불합의나 불일치가 있는 현상",
    lead:
      "구성원 간 불일치 해소, 갈등관리",
    features: ["상황 의존성", "순기능 존재", "단계별 대응"],
    keywords: ["강요", "철회", "상대 의견 수용", "양쪽 의견 타협", "문제 해결"],
    tables: [
      {
        caption: "갈등 요인",
        headers: ["갈등요인", "설명"],
        rows: [
          ["일정", "일정 동의 부족"],
          ["프로젝트 우선순위", "자원할당·위험\n우선순위 이견"],
          ["자원", "한정된 인적자원\n확보 경쟁"],
          ["기술적 옵션", "기술 방법 차이"],
          ["관리 절차", "절차·문서작업\n불필요성 인식"],
          ["원가", "경비 부족\n사용방법 이견"],
          ["대인 관계", "팀원 성격 차이"],
        ],
      },
      {
        caption: "갈등 해결방안 상세 설명",
        headers: ["해결방법", "특징", "적용상황"],
        rows: [
          ["Withdrawal(철수/회피)", "낮은 주장\n낮은 협력", "사소한 이슈\n추가 정보 필요\n관철 가능성 낮음"],
          ["Smoothing(양보/수용)", "낮은 주장\n높은 협력", "신용 확보 목적\n조화·안정 중요\n상대방에 더 중요"],
          ["Compromising(타협)", "중간 주장\n중간 협력", "더 이상 설득 곤란\n대등한 파워\n합의점 도출"],
          ["Forcing(강요)", "높은 주장\n낮은 협력", "비인기 정책 집행\n긴급 사안 결정\n경쟁 우위 상황"],
          ["Problem Solving(문제해결/대면)", "높은 주장\n높은 협력", "통합 의견 도출\n관계 지속 유지"],
        ],
      },
    ],
  },
  {
    topicId: "pm-59",
    title: "프로젝트 위험관리",
    course: "PM",
    definition:
      "프로젝트 위험 식별, 분석 이에 대한 대응책 마련하여 프로젝트를 성공적으로 완료하기 위한 관리 활동",
    defShort: "위험 식별·분석, 대응책 마련해 프로젝트 성공적 완료 위한 관리 활동",
    lead:
      "위험의 식별·분석·대응, 프로젝트 위험관리",
    features: ["불확실성 관리", "긍정 위험 포함", "전 생애 반복 감시"],
    keywords: ["계획수립", "위험식별", "정성적 위험분석", "정량적 위험분석", "위험대응 계획수립", "위험대응 실행", "감시 및 통제"],
    tables: [
      {
        caption: "위험관리 절차 상세 설명",
        headers: ["프로세스", "절차", "설명", "산출물"],
        rows: [
          ["계획", "위험관리계획수립", "기준·활동 정의\n계획 수립", "위험관리 계획서"],
          ["계획", "위험식별", "영향 위험 식별\n특성 문서화", "위험 관리대장\n이슈로그"],
          ["계획", "정성적 위험 분석", "확률·영향 평가\n우선순위 결정", "PJT 문서 갱신"],
          ["계획", "정량적 위험 분석", "목표 영향\n수치적 분석", "위험 보고서"],
          ["계획", "위험대응계획수립", "긍정 위험 증대\n부정 위험 최소화", "변경 요청\n관리계획서 갱신\nPJT 문서 갱신"],
          ["실행", "위험 대응 실행", "합의된 대응\n계획 실행", "변경 요청\nPJT 문서 갱신"],
          ["감시 및 통제", "위험 감시 및 통제", "프로세스\n효율성 평가", "작업성과정보\nPJT 문서 갱신"],
        ],
      },
      {
        caption: "보헴의 10대 위험 요소",
        headers: ["구분", "위험 요소"],
        rows: [
          ["관리적 위험", "인력부족\n비현실적 일정 및 예산"],
          ["기술적 위험", "잘못된 기능 구현\n잘못된 UI 개발"],
          ["요구 사항", "과대포장\n지속적인 요구사항 변경"],
          ["품질", "외부 기능의 부족\n외부 작업의 부족\n실시간 성능 문제점\n기술적 취약"],
        ],
      },
    ],
  },
  {
    topicId: "pm-60",
    title: "정성적 위험 분석",
    course: "PM",
    definition:
      "위험 발생확률과 영향, 특징 평가하여 대응과 분석을 위한 개별 프로젝트 위험 우선 순위 결정하는 프로세스",
    defShort: "위험 발생확률과 영향 평가해 개별 프로젝트 위험 우선 순위 결정 프로세스",
    lead:
      "위험 대응 우선순위 결정, 정성적 위험 분석",
    features: ["확률·영향 평가", "위험 우선순위화", "전문가 판단 기반"],
    keywords: ["수분표대기", "인터뷰", "영품기", "영계", "촉진", "전유미"],
    tables: [
      {
        caption: "정성적 위험 분석 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "기밀 보장 인터뷰 환경 조성"],
          ["데이터 분석", "위험 확률 및 영향력 평가\n위험 데이터 품질 평가\n기타 위험 모수 평가", "위험 발생 시 목표 영향 정도 평가\n정확성·품질·신뢰성·무결성\n긴급성·가까움·전략적 영향 고려"],
          ["데이터 표현", "위험 확률 및 영향력 매트릭스", "확률-영향 P-I Matrix로 등급화"],
          ["데이터 표현", "계층적인 차트", "3개 모수 표현하는 버블차트\n버블 클수록 허용 불가 큰 위험\n버블 크기=영향 값(Impact value)"],
          ["대인관계 및 팀 기술", "촉진", "촉진자 통해 효과 분석\n편견 원인 식별, 충돌 해결"],
          ["기타 기법", "전문가 판단\n위험 유형 분류\n미팅", "확률·영향 평가해 위치 결정\n비슷한 원인 리스크 RBS로 분류\n위험 워크샵(Workshop)으로 수행"],
        ],
      },
    ],
    notes: ["교재 두음: 수분표대기 / 인터뷰, 영품기, 영계, 촉진, 전유미"],
  },
  {
    topicId: "pm-62",
    title: "정량적 위험 분석",
    course: "PM",
    definition:
      "식별된 개별 프로젝트 위험과 기타 불확실한 원인이 전체 프로젝트 목표에 미치는 영향을 수치적 분석하는 프로세스",
    defShort: "위험과 기타 불확실한 원인의 프로젝트 목표 영향 수치적 분석 프로세스",
    lead: "목표 영향의 수치화, 정량적 위험 분석",
    features: ["목표 영향 수치화", "확률 기반 분석", "전체 프로젝트 관점"],
    keywords: ["수분대기", "인터뷰", "영민의모", "촉진", "불전"],
    tables: [
      {
        caption: "정량적 위험 분석 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["데이터 수집", "인터뷰", "선례 정보·경험 참고 수치화\n정보는 확률분포 따라 상이"],
          ["데이터 분석", "영향도", "원인이 결과에 미치는 관계 도표화"],
          ["데이터 분석", "민감도 분석", "타 위험 고정·한 위험 변동 영향\n토네이도 다이어그램\n일원분산분석, 시나리오 분석"],
          ["데이터 분석", "의사결정 분석", "의사결정 기대값 계산 최적 선택\nEMV: 금전 가치로 위험 크기 측정"],
          ["데이터 분석", "모의실험", "변수 수치 대입 확률변수 분포 산정\n몬테카를로 분석법"],
          ["대인관계 및 팀 기술", "촉진", "워크샵 협의 도출, 창의적 접근"],
          ["기타 기법", "불확실성 표현", "불확실성을 확률분포로 표현"],
          ["기타 기법", "전문가 판단", "전문가 직접 위험 수치화·모델링"],
        ],
      },
    ],
    notes: ["교재 두음: 수분대기 / 인터뷰, 영민의모, 촉진, 불전", "영향도: 영향관계도 / 민감도: 토네이도 다이어그램 / 의사결정 분석: EMV / 모의실험: 몬테카를로"],
  },
  {
    title: "몬테카를로 시뮬레이션",
    course: "PM",
    definition:
      "불확실한 변수를 확률분포로 모델링하고, 반복적인 무작위 샘플링을 통해 다양한 결과의 발생 가능성을 추정하는 수학적 시뮬레이션 기법",
    defShort: "반복적 무작위 샘플링으로 다양한 결과 발생 가능성 추정 시뮬레이션 기법",
    lead:
      "무작위 반복 모의실험, 몬테카를로 시뮬레이션",
    features: ["확률적 결과 제공", "반복 무작위 샘플링", "정량적 위험 분석"],
    keywords: ["다양한 시나리오 분석", "확률적 결과 제공", "변수 정의", "무작위 샘플링", "시뮬레이션 실행", "결과 집계"],
    tables: [
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. 변수 정의", "불확실 변수 식별\n확률 분포 할당"],
          ["2. 무작위 샘플링", "난수 생성\n입력 값 추출"],
          ["3. 시뮬레이션 실행", "모델에 적용\n결과 계산"],
          ["4. 결과 집계", "반복 후 분포 분석\n평균·표준편차\n신뢰구간 도출"],
        ],
      },
    ],
    notes: ["정량적 위험 분석의 '모의실험' 기법에 해당한다"],
  },
  {
    topicId: "pm-64",
    title: "위험 대응",
    course: "PM",
    definition: "프로젝트에서 식별된 위험요소에 대해 상세한 대응방안을 계획하는 프로세스",
    defShort: "프로젝트에서 식별된 위험요소에 대해 상세한 대응방안 계획 프로세스",
    lead:
      "위험 유형별 대응 전략, 위험 대응",
    features: ["부정·긍정 위험", "적극·소극 대응", "위험별 상세 계획"],
    keywords: [
      "부정적 (에스컬레이션, 회피, 전가, 완화, 수용)",
      "긍정적 (에스컬레이션, 활용, 공유, 증대, 수용)",
    ],
    tables: [
      {
        caption: "부정적 위험 대응 (EATMA)",
        headers: ["방법", "설명"],
        rows: [
          ["에스컬레이션(Escalation)", "보고, 단계적 확대\nPM 권한 밖 사항 PMO조직에서 관리\n책임은 조직 내 관련자가 수용"],
          ["회피(Avoid)", "위험 영향권에서 목표 고립·변경\n일정연기, 전략 변경, 범위 축소"],
          ["전가(Transfer)", "영향력·대응 주체 제3자에게 이동\n보험 활용, 이행 보증, 각종 보증"],
          ["완화(Mitigate)", "발생 가능성·영향 수준 낮춤\n프로젝트 조기 조치·많은 테스트"],
          ["수용(Accept)", "위험 인지, 선제적 조치 수행 안 함\n리스크 제거 불가능 시 채택\n수동적 수용: 문서화 외 조치 없음\n능동적 수용: 우발사태 예비 구축"],
        ],
      },
      {
        caption: "긍정적 위험 대응 (EESEA)",
        headers: ["구분", "설명"],
        rows: [
          ["에스컬레이션(Escalation)", "권한 밖 사항 상위 관리자에게 올림"],
          ["활용(Exploit)", "기회 실현 위해 긍정적 리스크 선택\n프로젝트 조기 종료 시 성과급"],
          ["공유(Share)", "제3자에 유익한 기회 공유(분담)\n책임 일부·전부 할당, 합작 투자"],
          ["증대(Enhance)", "긍정적 영향 리스크 식별 극대화\n조기 종료 위해 활동 자원 보충"],
          ["수용(Accept)", "기회 수용 수반되면 활용\n적극적 기회 추구 않음"],
        ],
      },
    ],
    notes: ["EATMA(Escalation, Avoid, Transfer, Mitigate, Accept) / EESEA(Escalation, Exploit, Share, Enhance, Accept)", "왼쪽으로 갈수록 적극적 대응, 오른쪽으로 갈수록 소극적 대응"],
  },
  {
    topicId: "pm-14",
    title: "PMBOK 8개 성과 영역 및 프로젝트 관리 12원칙(PMBOK 7판)",
    course: "PM",
    definition:
      "PMBOK : 모든 프로젝트에 적용할 수 있는 원칙과 가치 제공에 초점을 맞춘 프로젝트 관리 지식 체계 지침서",
    defShort: "모든 프로젝트에 적용할 원칙과 가치 제공에 초점을 둔 지식체계 지침서",
    lead:
      "원칙과 가치 중심의 전환, PMBOK 7판",
    features: ["원칙 기반 접근", "가치 인도 중심", "Tailoring 강조"],
    keywords: [
      "성과: 이해관계자, 팀, 개발방식 및 생애주기, 기획, 성과, 인도, 측정, 불확실성 및 모호성 탐색",
      "원칙: 스튜어드쉽, 팀, 이해관계자, 가치, 시스템 사고, 리더쉽, 조정, 품질, 복잡성, 위험, 적응성과 복원력, 변화",
    ],
    tables: [
      {
        caption: "8개 성과 영역 (이팀개기 성인측불)",
        headers: ["성과영역", "기법"],
        rows: [
          ["이해관계자 (Stakeholder)", "이해관계자 식별\n의사소통 및 참여"],
          ["팀 (Team)", "갈등관리\n팀 관리"],
          ["개발방식 및 생애주기 (Development Approach and Life Cycle)", "Tailoring\n개발 방법론 조정"],
          ["기획 (Planning)", "프로젝트 관리 계획 및 검토"],
          ["성과 (Project Work)", "프로젝트 실행\n자원 관리"],
          ["인도 (Delivery)", "통합 변경관리\nCI/CD"],
          ["측정 (Measurement)", "비용성과지수\n일정성과지수, EVM"],
          ["불확실성 및 모호성 탐색 (Uncertainty)", "위험관리\n이슈관리"],
        ],
      },
      {
        caption: "프로젝트 관리 12원칙 (스팀이가 시리조품 복위적변)",
        headers: ["원칙", "영역"],
        rows: [
          ["스튜어드쉽 (Stewardship)", "진실성, 케어, 신뢰성, 규정준수"],
          ["팀 (Team)", "권한, 책임"],
          ["이해관계자 (Stakeholders)", "회의, 의사소통, 적극적 협업"],
          ["가치 (Value)", "프로젝트 정당성, 사업전략"],
          ["시스템 사고 (System thinking)", "사전 예방적 통합관리, 외부검토"],
          ["리더쉽 (Leadership)", "동기부여\n갈등관리\n공동목표일치"],
          ["조정 (Tailoring)", "기존 방법론 최적화, 생산성 향상"],
          ["품질 (Quality)", "성능, 만족도, 회복력, 신뢰성"],
          ["복잡성 (Complexity)", "인간행동, 시스템동작, 기술혁신"],
          ["위험 (Risk)", "비용 효율적\n관련 이해관계자 합의"],
          ["적응성과 복원력 (Adaptability and Resiliency)", "지속적인 학습과 개선\n짧은 피드백"],
          ["변화(Change)", "변경관리, 협업"],
        ],
      },
    ],
  },
  {
    topicId: "pm-90",
    title: "감리/PMO 비교표",
    course: "PM",
    definition:
      "감리는 기술적 측면의 평가 성격이며, PMO는 프로젝트 전 과정에 개입하는 관리적 성격이 강함",
    defShort: "기술적 평가 성격인 감리와 전 과정에 개입하는 관리 성격인 PMO의 비교",
    lead: "기술 평가와 전 과정 관리, 감리/PMO 비교",
    features: ["관점 차이", "법령 차이", "산출물 차이"],
    // 비교 토픽이라 개념별 정의·특징을 가/나로 나눠 적는다(defPair 가 defShort 를 대신한다).
    defPair: [
      {
        name: "정보시스템 감리",
        lead: "제3자 관점의 종합 점검",
        def: "제3자 관점에서 정보시스템의 구축·운영을 종합 점검해 개선하는 제도",
        features: ["독립적 제3자", "기술적 품질검토", "법정 의무"],
      },
      {
        name: "PMO(전자정부사업관리 위탁)",
        lead: "사업관리의 전문기관 위탁",
        def: "행정기관이 전자정부사업의 관리·감독을 전문기관에 위탁하는 제도",
        features: ["발주자 관점", "전 과정 참여", "선택적 위탁"],
      },
    ],
    keywords: ["관점 차이", "법령 차이", "산출물 차이"],
    tables: [
      {
        caption: "비교표",
        headers: ["구분", "감리", "PMO"],
        rows: [
          ["목적", "품질보증 평가\n공정성·투명성", "복수 PJT 관리\n자원·일정\n모니터링"],
          ["역할", "기술적 품질검토", "전과정 적극 참여\n의사소통\n경영·관리 성격"],
          ["효과", "위험 대응방안\n산출물 품질향상", "위험 조기 식별\nIT전략 연계\n비용 절감"],
          ["관점", "독립적 제3자", "발주자 관점\n사업관리"],
          ["법적 근거", "단순장비 제외\n5억 이상 의무\n5억 이하 선택", "2013년 도입\n공공 의무화"],
          ["법령", "전자정부 57조\n1항 의무사항", "전자정부 64조2\n권고사항\n시행령 78조\n위탁 규정"],
          ["수행조직", "감리법인", "컨설팅업체\n회계법인\n대형 SI"],
          ["주요 산출물", "감리계획서\n감리수행결과보고서\n시정조치확인보고서", "요구사항 정의서\n사업자 선정기준\n사업자 관리계획"],
          ["주요 산출물", "", "아키텍처 정의서\n영역별 관리계획"],
        ],
      },
    ],
  },
  {
    title: "Agile 선언문과 12개 원칙",
    course: "PM",
    definition: "고객 요구사항에 유연한 대응을 하는 Agile 방법론의 4가지 선언문과 12 원칙",
    defShort: "고객 요구에 유연히 대응 Agile 방법론 4가지 선언문과 12개 원칙",
    lead: "고객 요구 유연 대응 가치, Agile 선언문과 12개 원칙",
    features: ["변화 대응 우선", "고객 협력 중심", "작동하는 SW 중시"],
    keywords: ["공개포작 개변동고", "고요배의 동대지소 좋단자효"],
    tables: [
      {
        caption: "Agile 4대 가치 (공개포작 개변동고)",
        headers: ["가치", "설명"],
        rows: [
          ["개인과 상호작용", "공정·도구보다\n개인 상호작용"],
          ["변화에 대응", "계획 준수보다\n변화 대응 우선"],
          ["작동하는 소프트웨어", "포괄 문서보다\n작동 SW 우선"],
          ["고객과의 협력", "계약 협상보다\n고객 협력 우선"],
        ],
      },
      {
        caption: "Agile 12가지 원칙 (고요배의 동대지소 좋단자효)",
        headers: ["12가지 원칙", "핵심", "설명"],
        rows: [
          ["고객만족 추구", "고객 최우선", "빠른 배포 반영"],
          ["요구사항 변경 수용", "변경 상황 인정", "유연한 대응 확보"],
          ["짧은 배포 간격", "CI/CD 활용", "빠른 배포 반복"],
          ["현업-개발자간 일일 의사소통", "일일 소통 중시", "업무 효율화 확보"],
          ["동기부여된 사람들 중용/지원", "상호 존중 문화", "팀원 중용 지원"],
          ["면대면 대화", "의사소통 효율화", "일일 미팅 활용"],
          ["지속 가능한 개발 장려", "일정 속도 유지", "지속 개발 장려"],
          ["작동하는 소프트웨어", "진척도 SW 중시", "기능 진행 관리"],
          ["좋은 기술, 설계 관심", "기술 우수성", "우수 기술·아키텍처 중시 및 공유"],
          ["단순성 추구", "진행 단순화", "불필요 업무 제거"],
          ["자기 조직적 팀", "조직 생산성 증대", "책임감 부여, 자기조직적 팀"],
          ["정기적 효율성 제고", "업무 효율성 증대", "스프린트 리뷰로 다음 반복 반영"],
        ],
      },
    ],
  },
  {
    topicId: "pm-73",
    title: "스크럼 (SCRUM)",
    course: "PM",
    definition:
      "작은 개발팀과 짧은 개발기간 동안 점진적, 반복적으로 SW를 개발하는 애자일 개발방법론",
    defShort: "작은 개발팀·짧은 개발기간에 점진적·반복적 SW 애자일 개발방법론",
    lead:
      "짧은 주기의 반복 개발, 스크럼(SCRUM)",
    features: ["점진적 반복 개발", "소규모 팀 중심", "짧은 스프린트 주기"],
    keywords: ["Product backlog", "Sprint backlog", "회의 5개 세부내용", "Burn down chart", "담당자별 역할"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "수행 목록", "내용"],
        rows: [
          ["1", "Product Backlog 작성", "요구 우선순위화"],
          ["2", "스프린트계획회의\n(Sprint Planning Meeting)", "구현 목록 작성\n개발 시간 추정"],
          ["3", "스프린트 수행\nBurn down Chart\nDaily Scrum Meeting", "소멸 차트 표시\n진척 사항 확인"],
          ["4", "스프린트개발완료\n(Sprint Review)", "출시 가능 증분"],
          ["5", "스프린트 완료 후\n(Sprint Retrospective)", "검토·회고 회의\n다음 계획 회의"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["요구사항", "Product backlog\nSprint backlog", "우선순위 기능\n스프린트 작업"],
          ["주기", "Sprint", "2~4주 반복 주기"],
          ["회의", "Product Backlog Meeting\nSprint Planning Meeting\nDaily Scrum Meeting\nSprint Review", "우선순위 선별\n백로그 산정\n일일 15분 공유\n결과물 검토"],
          ["회의", "Sprint Retrospective", "개선점 회고"],
          ["관리", "Burndown chart", "작업 완료 추이"],
          ["담당자", "Product Owner\nScrum Master\nScrum Team", "기능 목록 작성\n장애 요소 제거\n요구사항 구현"],
        ],
      },
    ],
  },
  {
    topicId: "pm-86",
    title: "번다운차트 (Burn Down Chart)",
    course: "PM",
    definition:
      "Agile 프로젝트기반 조직에서 점수(Story Point)를 산정하여 Sprint 계획대비 현재 진행을 파악할 수 있는 차트",
    defShort: "스토리 포인트를 산정해 스프린트 계획대비 현재 진행을 파악하는 차트",
    lead:
      "스프린트 진척의 가시화, 번다운차트",
    features: ["잔여 작업량 추이", "애자일 적용", "이슈 예측 불가"],
    keywords: ["스토리포인트(Story Point) 산정", "Sprint 진척율 가시화"],
    tables: [
      {
        caption: "상세설명",
        headers: ["구분", "설명"],
        rows: [
          ["가로축", "시간 축으로\n스프린트 반복\n주기 날짜수"],
          ["세로축", "완료된 작업의\n추정 일수\n(스토리\n포인트로 표현)"],
          ["계획 그래프", "처음 계획을\n세웠을 때 날짜로\n남은 작업량 표현"],
          ["실제 그래프", "작업을\n수행하면서\n실제로 남은\n작업량"],
          ["기울기", "작업수행 속도\n판단"],
        ],
      },
      {
        caption: "번다운 차트와 EVM 비교",
        headers: ["항목", "Burn Down Chart", "EVM"],
        rows: [
          ["개념", "점수 기반 추이\n진척율 차트", "획득가치 기반\n계획 대비 통제"],
          ["목적", "업무 잔존 추정", "진척 성과 분석"],
          ["특징", "애자일 적용", "전통 방법론"],
          ["비용", "일일 회의 비용", "문서화 비용"],
          ["구성요소", "스프린트 회차\n업무 수행 시간", "PV EV AC\nSV CV SPI"],
          ["제반사항", "백로그 작성\n리뷰·회고", "철저한 문서화\n관리 계획 수립"],
          ["장점", "점수 부여 용이\n진행률 파악", "수치 지표 제공\n원가 예측 가능"],
          ["단점", "이슈 예측 불가\n점수 산정 부담", "방대한 문서화\n소규모 부적합"],
        ],
      },
    ],
  },
  {
    topicId: "pm-74",
    title: "XP (eXtreme Programming)",
    course: "PM",
    definition:
      "의사소통과 TDD(Test driven development)를 기반으로 짧은 개발 주기를 통해 SW를 생산하는 애자일 개발 방법론",
    defShort: "의사소통·TDD 기반 짧은 개발 주기로 SW 생산 애자일 개발 방법론",
    lead: "소통·TDD 기반 개발, XP(eXtreme Programming)",
    features: ["의사소통 중심", "테스트 주도 개발", "짧은 개발 주기"],
    keywords: ["용기", "단순함", "커뮤니케이션", "피드백", "존중", "12가지 실천 항목"],
    tables: [
      {
        caption: "핵심 가치 (용단커피존)",
        headers: ["핵심가치", "설명"],
        rows: [
          ["용기", "고객의 요구사항\n변화에 능동적인\n대처"],
          ["단순성", "부가적 기능,\n사용되지 않는\n구조와 알고리즘\n배제"],
          ["의사소통(커)", "공통의 메타포\n사용, 관리자,\n개발자, 고객\n간의 의사 소통"],
          ["피드백", "빠른 피드백을\n원칙으로 해결 할\n수 있는 일 먼저\n처리"],
          ["존중", "구성원 상호간의\n존중,\n프로젝트에 대한\n존중"],
        ],
      },
      {
        caption: "12가지 실천 항목",
        headers: ["구분", "실천항목", "내용"],
        rows: [
          ["개발", "페어 프로그래밍\n(Pair Programming)", "2인 1대 개발\n오류 감소\n생산성 향상"],
          ["개발", "공동 책임\n(Collective Ownership)", "누구나 수정 가능"],
          ["개발", "지속적 통합\n(Continuous Integration)", "하루 몇 번 빌드"],
          ["관리", "게임 계획\n(Planning Game)", "User Story로 범위 결정"],
          ["관리", "작은 릴리즈\n(Small Release)", "빠르게 릴리즈\n2주 단위"],
          ["관리", "메타포(Metaphor)", "문장형 아키텍처\n의사소통 언어"],
          ["구현", "Simple Design", "단순하게 설계"],
          ["구현", "테스트 주도 개발\n(Test Driven Develop)", "테스트 주도(TDD)\n고객 검증·승인"],
          ["구현", "리팩토링(Refactoring)", "기능 유지 개선"],
          ["환경", "주당 40시간 작업", "40시간 초과 금지"],
          ["환경", "On-Site Customer", "고객 상주\n의사 결정 지원"],
          ["기타", "코딩 표준화", "의사소통 향상"],
        ],
      },
      {
        caption: "프로세스 단계",
        headers: ["단계", "설명"],
        rows: [
          ["유저 스토리", "고객 요구 기술\n릴리스 계획 단위"],
          ["스파이크", "핵심 기능 시제품\n기술 위험 감소"],
          ["배포계획", "전체 배포 계획\n수행 규칙 정의"],
          ["반복", "1~3주 단위 반복\n평가·계획 단순"],
          ["인수 테스트", "고객이 진척 확인\n명세 테스트 통과"],
          ["소규모 배포", "짧은 주기 배포\n이득 조기 제공"],
        ],
      },
    ],
  },
  {
    topicId: "pm-77",
    title: "린 (Lean) 방법론",
    course: "PM",
    definition:
      "제품을 개발하는 전 과정에서 고객의 피드백을 수시로 반영하며, 불필요한 작업을 최소화하여 생산성을 높이는 것을 목표하는 방법론",
    defShort: "불필요한 작업을 최소화하여 생산성을 높이는 것을 목표로 하는 방법론",
    lead: "불필요 작업 최소화의 개발, 린(Lean) 방법론",
    features: ["낭비 제거", "고객 피드백 반영", "빠른 인도"],
    keywords: ["나배결빠위통씨", "미가재작이지결"],
    tables: [
      {
        caption: "원칙과 낭비요소 [나배결빠 위통씨] [미가재작 이지결]",
        headers: ["원칙", "낭비 요소"],
        rows: [
          ["Eliminate Waste (낭비 제거)", "미완성 작업 (Partial Done Work)"],
          ["Amplify Learning (배움증폭)", "가외기능 (Extra Feature)"],
          ["Decide as Late as Possible (늦은 결정)", "재학습 (Relearning)"],
          ["Deliver as Fast as Possible (빠른 인도)", "작업전환 (Task Switching)"],
          ["Empower the Team (팀에 권한 위임)", "이관 (Handoff)"],
          ["Build Integrity In (통합성 구축)", "지연 (Delay)"],
          ["See the Whole (전체를 볼 것)", "결함 (Defect)"],
        ],
      },
      {
        caption: "방법론 유형",
        headers: ["유형", "설명"],
        rows: [
          ["린 소프트웨어 개발", "낭비 최소화\n가치 최대화"],
          ["린 UX", "핵심 가치 정의\n가설 검증 반복"],
          ["린 스타트업", "MVP 빠른 개발\n시장 반응 반영"],
          ["린 애자일", "낭비 식별\n프로세스 개선"],
        ],
      },
    ],
    notes: ["주요 용어: MVP(Minimum Viable Product), A/B 테스트, 피벗(Pivot), 캔버스(Business Model Canvas), 린 캔버스(Lean Canvas)"],
  },
  // ── 소프트웨어공학(SE) — 심화반 2주차 ─────────────────────────────
  {
    title: "소프트웨어 개발 방법론",
    course: "SE",
    definition:
      "소프트웨어 개발에 관한 계획, 분석, 설계 및 구축에 관련 정형화된 방법과 절차, 도구 등이 공학적 기법으로 체계적으로 정리하여 표준화한 이론",
    defShort: "SW 개발 절차를 공학적 기법으로 체계적으로 정리하여 표준화한 이론",
    lead: "개발 절차·산출물 표준화, 소프트웨어 개발 방법론",
    features: ["공학적 체계화", "개발 절차 표준화", "중심 관점별 유형"],
    keywords: ["표준화", "절방산관기도", "구정객CAP"],
    tables: [
      {
        caption: "개발 방법론의 구성요소 (절방산관기도)",
        headers: ["구성요소", "설명", "예시"],
        rows: [
          ["절차", "단계별 활동 순서", "Phase-Activity-Task"],
          ["방법", "Task 수행 방법\n수행 주체·대상", "작업 방법"],
          ["산출물", "목록 및 양식", "설계서 등"],
          ["관리", "계획·일정·품질\n관리 방법", "계획서\n기준문서 등"],
          ["기법", "단계별 기법", "ERD, DFD 등"],
          ["도구", "단계·기법 활용\n가능한 도구", "CASE\nUML Tool 등"],
        ],
      },
      {
        caption: "개발 방법론 유형 상세 (구정객CAP)",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["절차 중심", "구조적 방법론", "정형화된 분석절차 적용\n프로세스 중심\n분할과 정복\n하향식 기능분해"],
          ["데이터 중심", "정보공학 방법론", "CASE 도구 등 공학적 접근\n데이터모델 중심\n데이터와 프로세스 균형\n기업정보시스템중심"],
          ["객체 중심", "객체지향 방법론", "객체지향 개념 적용\n사용자관점 분석설계·객체 중심\n객체·클래스·메시지 사용\nWhite Box Reuse"],
          ["컴포넌트 중심", "CBD 방법론", "컴포넌트 조합 통한 재사용 중심\n컴포넌트 중심\n생산성/품질향상, 유지보수 최소\nBlack Box Reuse"],
          ["변화 중심", "Agile 방법론", "즉시 피드백 받아 유동적 개발\n고객 요구 변화에 유연·신속 대응\nXP, Scrum, Kanban, Lean"],
          ["자산 중심", "Product Line", "특정 제품 적용 공통 기능 정의 개발\n도메인공학·응용공학\n레파지토리"],
        ],
      },
    ],
  },
  {
    title: "AI-DLC(AI-Driven SDLC)",
    course: "SE",
    definition:
      "SW SDLC에 인공지능을 통합하여, AI가 계획 수립과 코딩을 주도하고 사람이 검증하는 개발방법론",
    defShort: "AI가 계획 수립과 코딩을 주도하고 사람이 검증하는 SW 개발방법론",
    lead: "AI 에이전트 중심 생명주기, AI-DLC",
    features: ["AI 주도·사람 검증", "고속 반복(Bolt)", "단계 최소화"],
    keywords: ["AI-Centric", "유닛", "인텐트", "볼트"],
    tables: [
      {
        caption: "AI-DLC 특징",
        headers: ["구분", "설명"],
        rows: [
          ["AI-DLC 특징", "AI 역량과의 정렬\n고속 반복 (Bolt)\n단계 최소화, 흐름 극대화\n설계 기법 내재화"],
        ],
      },
      {
        caption: "AI-DLC 3단계 절차",
        headers: ["절차", "설명"],
        rows: [
          ["착수(Inception)", "의도 및 목표 무엇을 만들지\n사용자 스토리 범위·위험 정의"],
          ["구축(Construction)", "설계 및 아키텍처 올바른 방식 구축\n코드·테스트 문서화 빌드 검증"],
          ["운영(Operations)", "배포 준비 상태 실행 모니터링\n관측성 기술 지원 다음 주기 피드백"],
        ],
      },
      {
        caption: "AI-DLC 핵심",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["구조", "계층적 업무 분해", "계층적 분해 업무를 층으로\n인셉션 단계 상위→하위 전개"],
          ["맥락", "정보의 보존", "Context 단계 간 유지\n맥락 보존 정보 손실 방지"],
          ["호환", "기존 결과물과의 공존", "외부 컨텍스트 레거시와 공존\n기존 산출물 결과물 재활용"],
        ],
      },
      {
        caption: "AI-DLC 단계별 세부 요소",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["목표", "Intent(인텐트)", "달성 목표 AI에 요구 사항\n비즈니스 목적 무엇을 왜"],
          ["작업 단위", "Unit(유닛)", "작업 묶음 도메인 주도 개발\n하위 도메인 독립 측정 단위"],
          ["반복 단위", "Bolt(볼트)", "작업 반복 단위 볼트 묶음이 유닛\n스프린트 개념 짧은 반복 주기"],
        ],
      },
      {
        caption: "AI-DLC 워크플로우",
        headers: ["절차", "설명"],
        rows: [
          ["① 의도", "무엇을 왜 목표와 이유 정의"],
          ["② AI 초안", "사양 디자인 작업 AI가 초안 작성"],
          ["③ 사람의 검토", "가정 확인 통제권 유지\n이의 제기 판단은 사람이"],
          ["④ 승인된 결과물", "공유 팀 메모리 합의 산출물 축적"],
          ["⑤ 구현", "코드 및 테스트 승인 기준 구현"],
          ["⑥ 검증", "품질 및 배포 가속 중 통제 유지"],
        ],
      },
    ],
    notes: [
      "3단 계층 — 인텐트(달성 목표) 안에 유닛(작업 묶음)이 있고, 유닛 안에 볼트(반복 단위)가 여러 개 들어간다.",
      "워크플로우는 의도 → AI 초안 → 사람의 검토 → 승인된 결과물 → 구현 → 검증의 순환이며, AI가 가속하는 동안 사람의 판단이 통제권을 유지한다.",
    ],
  },
  {
    title: "소프트웨어 설계의 원리",
    course: "SE",
    definition:
      "소프트웨어 시스템을 효율적으로 설계하고 개발하여 복잡성을 줄이고 품질을 높이기 위해 지켜야 할 기본적인 지침과 규칙",
    defShort: "소프트웨어 시스템 설계 시 품질 높이려 지켜야 할 기본적인 지침과 규칙",
    lead:
      "복잡성 감소의 설계 지침, 소프트웨어 설계의 원리",
    features: ["복잡성 관리 중심", "변경 영향 국소화", "하향식 점진 분해"],
    keywords: ["추상화", "정보은닉", "분할과 정복", "단계적 분해", "모듈화"],
    tables: [
      {
        caption: "설계 원리",
        headers: ["구분", "설계원리", "설명"],
        rows: [
          ["일반화", "추상화", "필수 정보만 추출·강조\n관련 없는 세부 사항 생략\n본질적인 문제에 집중"],
          ["일반화", "정보은닉", "모듈 처리 내용 다른 부분에 감춤"],
          ["구체화", "분할과 정복", "큰 SW를 서브시스템으로 나눔\n작은 시스템·모듈로 나눠 개발\n하나씩 위로 올라가며 완성"],
          ["구체화", "단계적 분해", "기능을 작은 단위로 점차 구체화\n하향식 설계에 사용"],
          ["구체화", "모듈화", "실제 개발 가능한 작은 단위로 나눔\nSW 구조를 이루는 기본 단위"],
        ],
      },
      {
        caption: "SW 설계 유형",
        headers: ["종류", "주요 활동", "설명"],
        rows: [
          ["상위 설계", "아키텍처 설계", "예비 설계 또는 상위 수준 설계\nSW 시스템 전체 구조 기술\n컴포넌트 간 관계 정의"],
          ["상위 설계", "데이터 설계", "필요 정보 자료구조·DB 설계 반영"],
          ["상위 설계", "인터페이스 정의", "서브시스템 간 인터페이스 정의\n시스템·사용자 등 통신 정의"],
          ["상위 설계", "사용자인터페이스설계", "익숙하고 편리한 사용 위한 설계"],
          ["하위 설계", "모듈설계", "모듈 실제 내부 알고리즘 형태 표현"],
          ["하위 설계", "자료구조설계", "자료구조·변수 등 상세 정보 작성\n분석 정보를 구현 자료구조로 변환"],
          ["하위 설계", "알고리즘 설계", "절차·순서·제어흐름 정의"],
        ],
      },
    ],
    notes: ["설계 원리 분류도: 구체화 아래 일반화(추상화·정보은닉)와 구체화(분할과 정복·단계적 분해·모듈화)"],
  },
  {
    topicId: "se-18",
    title: "객체지향 프로그래밍 특징",
    course: "SE",
    definition:
      "현실 세계에서 개체(Entity)를 속성(Attribute)과 메소드(Method)를 결합된 형태의 객체(Object)로 표현하는 개념",
    defShort: "현실 세계 개체를 속성과 메소드가 결합된 형태의 객체로 표현하는 개념",
    lead:
      "객체 중심 개발의 성질, 객체지향 프로그래밍 특징",
    features: ["캡슐화", "상속성", "다형성"],
    keywords: ["캡슐화", "추상화", "다형성", "정보은닉", "상속성"],
    tables: [
      {
        caption: "객체지향 특징 (캡추다정상)",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["구조화", "캡슐화", "속성·행위 묶음 구현 내용 은닉\n정보은닉 확장 캡슐화 특성"],
          ["구조화", "추상화", "공통 속성 묶음 객체 이름 부여\n슈퍼클래스 공통 성질 추출"],
          ["유연성", "다형성", "동일 메소드명 복수 메서드 정의\n동적바인딩 수직·수평 확장"],
          ["보호", "정보은닉", "비공개 변수 선언 직접 제어 불가\n접근 제어 자기·자식 허용"],
          ["재사용", "상속성", "클래스 재이용 기존 클래스 활용\n일반화↔특수화 공통↔고유 속성"],
        ],
      },
    ],
    notes: ["교재 두음: [캡추다정상]"],
  },
  {
    title: "다형성 (Polymorphism)",
    course: "SE",
    definition: "같은 함수(Method) 이름으로, 여러 개의 메서드를 만들 수 있는 기법",
    defShort: "같은 함수(Method) 이름으로 여러 개의 메서드를 만드는 기법",
    lead:
      "하나의 이름, 여러 구현, 다형성(Polymorphism)",
    features: ["동일 이름 메서드", "수평적 확장", "수직적 확장"],
    keywords: ["오버로딩", "오버라이딩"],
    tables: [
      {
        caption: "오버로딩과 오버라이딩 비교",
        headers: ["구분", "오버로딩 (Overloading)", "오버라이딩 (Overriding)"],
        rows: [
          ["개념", "같은 이름 메소드\n매개변수 상이", "상위 메소드\n하위 재정의"],
          ["메소드 이름", "이름 동일 필수", "이름 동일 필수"],
          ["파라미터 개수/자료형", "개수 상이 필수\n동수시 타입 상이", "개수 동일\n자료형 동일"],
          ["리턴 타입", "리턴 타입 무관", "리턴 타입 동일"],
          ["기타", "상위 클래스에\n동명 메소드 없음", "상위 클래스에\n메소드 존재 전제"],
        ],
      },
    ],
    notes: ["오버로딩 = 수평적 확장(같은 클래스 안), 오버라이딩 = 수직적 확장(상속 관계)"],
  },
  {
    title: "객체지향 설계 원리",
    course: "SE",
    definition: "소프트웨어 개발 및 유지보수성 향상을 위한 설계관점의 기본원칙",
    defShort: "소프트웨어 개발 및 유지보수성 향상을 위한 객체지향 설계관점 기본원칙",
    lead:
      "유지보수성 향상 원칙, 객체지향 설계 원리 SOLID",
    features: ["응집도 강화", "결합도 완화", "추상 의존 설계"],
    keywords: ["SOLID", "SRP", "OCP", "LSP", "ISP", "DIP"],
    tables: [
      {
        caption: "응집도 측면 설계 원리 (SRP·ISP)",
        headers: ["설계원리", "개념"],
        rows: [
          ["SRP (Single Responsibility Principle)\n단일 책임 원리", "클래스·메소드 하나의 역할 수행"],
          ["ISP (Interface Segregation Principle)\n인터페이스 분리 원리", "인터페이스는 하나의 역할 수행"],
        ],
      },
      {
        caption: "결합도 측면 설계 원리 (OCP·LSP·DIP)",
        headers: ["설계원리", "개념"],
        rows: [
          ["OCP (Open Closed Principle)\n개방 폐쇄 원리", "확장에는 열려있고\n수정에는 닫혀있어야 함"],
          ["LSP (Liskov Substitution Principle)\n리스코프 치환 원리", "자식 클래스 객체 부모 클래스 대체"],
          ["DIP (Dependency Inversion Principle)\n의존관계 역전 원리", "고차원 모듈 저차원 모듈 의존 금지"],
        ],
      },
    ],
    notes: [
      "두음: SOLID = SRP · OCP · LSP · ISP · DIP",
      "응집도 축(SRP·ISP)은 하나를 쪼개는 원리다 — 한 클래스·한 인터페이스가 한 가지 일만 하게 만든다.",
      "결합도 축(OCP·LSP·DIP)은 쪼갠 것을 느슨하게 잇는 원리다 — 구체 타입 대신 추상에 기대게 만든다.",
      "쪼개기(응집도)를 먼저 하고 잇기(결합도)를 뒤에 한다. 순서를 뒤집으면 추상만 늘어난다.",
    ],
  },
  {
    title: "데메테르의 법칙 (Law of Demeter)",
    course: "SE",
    definition:
      "오브젝트는 주변 다른 오브젝트에 대해 제한된 정보만 갖고 자신과 밀접한 오브젝트만 이용해야 한다는 설계 법칙",
    defShort: "제한된 정보만 갖고 자신과 밀접한 오브젝트만 이용해야 한다는 설계 법칙",
    lead: "밀접 객체만 쓰는 최소지식, 데메테르의 법칙",
    features: ["최소 지식 원칙", "느슨한 결합", "호출 대상 제한"],
    keywords: [
      "최소지식의 원칙",
      "loose coupling",
      "객체 자체",
      "메소드의 변수",
      "메소드 안에서 만들어진 객체",
      "객체가 직접 관리하는 컴포넌트 객체",
      "메소드 스코프 내에서 객체가 접근 가능한 전역 변수",
    ],
    tables: [
      {
        caption: "데메테르 법칙의 호출 가능 메소드",
        headers: ["호출 가능 메소드", "코드", "설명"],
        rows: [
          ["객체 자체", "this.method();", "객체 자체에 속한 메소드 호출"],
          ["메소드의 변수", "user_method(friend obj)\nobj.parameters_method();", "파라미터로 전달된 객체의 메소드"],
          ["메소드 안에서 만들어진 객체", "class obj;\nobj.created_method();", "메소드 내부 직접 생성 객체 메소드"],
          ["객체가 직접 관리하는 컴포넌트 객체", "ComponentClass cc;\ncc.owner_method();", "자신의 일부, Reference 갖는 객체"],
          ["메소드 스코프 내에서 객체가 접근 가능한 전역 변수", "class global_cls;\nglobal_cls.\nglobal_method();", "접근 가능한 전역 변수(객체)"],
        ],
      },
    ],
    notes: ["A→B 메시지는 OK, A→C 메시지는 지양. friend of a friend is a stranger."],
  },
  {
    topicId: "se-28",
    title: "Product Line",
    course: "SE",
    definition:
      "제품/서비스군 별로 도메인 기반의 핵심자산(Core Asset)을 개발하여 제품 생산 과정에 재사용성과 생산성을 극대화 시키는 생산 체계",
    defShort: "도메인 기반 핵심자산 개발로 재사용성과 생산성을 극대화하는 생산 체계",
    lead:
      "핵심자산 재사용 생산 체계, Product Line",
    features: ["제품군 단위 생산", "Core Asset 재사용", "도메인 기반 개발"],
    keywords: ["Domain Engineering", "Application Engineering", "Core Asset"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["개발 활동", "Domain Engineering", "공통점·차이점 분석 자산 생성\n아키텍처 설계 광범위 설계 수행\n컴포넌트 설계 재사용성·생산성"],
          ["개발 활동", "Application Engineering", "핵심자산 활용 요구 맞춤 개발\n부족 기능 모델링 통합 제품 개발"],
          ["산출물", "Core Asset", "구현용 자산 Repository 생산\n개발 중 진화 제품 개발과 별개"],
        ],
      },
    ],
    notes: ["구성도: Core Asset Development ─Plug & Play→ Product Development, 사이에 Management(Asset 관리, Repository 저장, Process 관리·적용)"],
  },
  {
    title: "AOP (Aspect Oriented Programming)",
    course: "SE",
    definition:
      "관심사의 분리(Separation of Concern) 원칙에 기반하여, 시스템 구성을 핵심 관심사와 횡단 관심사로 분리하고 Weaving을 통해 프로그램을 구현하는 방법론",
    defShort: "핵심·횡단 관심사로 분리, Weaving으로 프로그램 구현 방법론",
    lead:
      "횡단 관심사의 분리, AOP(Aspect Oriented Programming)",
    features: ["핵심·횡단 분리", "Aspect 모듈화", "Weaving 결합"],
    keywords: ["핵심관심", "횡단관심", "Joint-Point", "Point-cut", "Weaving", "Aspect"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명", "사례"],
        rows: [
          ["관심사", "핵심 관심사", "단일 모듈의\n주된 요구사항", "Business Logic"],
          ["관심사", "횡단 관심사", "여러 모듈 공통\n부가 요구사항", "Logging, Security\nTransaction"],
          ["프로그래밍 요소", "결합점(Joint Point)", "Aspect 적용 지점\nAdvice 적용점", "필드·메소드\n'Where' 의미"],
          ["프로그래밍 요소", "교차점(Point Cut)", "Advice 적용될\nJoint Point 정의", "@Pointcut\n(execution(..))"],
          ["프로그래밍 요소", "Advice", "Aspect 구현체\nJoint Point 삽입", "Before, After\nAround 등"],
          ["프로그래밍 요소", "직조(Weaving)", "핵심 로직에\nAdvice 적용", "컴파일·로딩\n런타임 시점"],
          ["프로그래밍 요소", "Aspect", "Pointcut+Advice\n합친 클래스", "@Aspect\nAOP 중심 단위"],
          ["프로그래밍 요소", "Target", "Advice 받는\n클래스", ""],
        ],
      },
    ],
  },
  {
    title: "테일러링 (Tailoring)",
    course: "SE",
    definition:
      "조직의 표준 프로세스를 커스터마이징 하여 프로젝트 요구에 맞게 적합한 프로세스를 얻는 과정",
    defShort: "표준 프로세스 커스터마이징해 프로젝트 요구에 맞는 프로세스 얻는 과정",
    lead:
      "표준 프로세스의 맞춤 조정, 테일러링(Tailoring)",
    features: ["표준 프로세스 기반", "프로젝트 특성 반영", "How-To-Do 제시"],
    keywords: ["프로젝트 특징 정의", "표준 프로세스 선정 및 검증", "상위/하위 수준 커스터마이징", "문서화"],
    tables: [
      {
        caption: "수행 절차 (특선상세문)",
        headers: ["활동", "세부절차", "설명"],
        rows: [
          ["프로젝트 특징, 정의", "프로파일 파악\n특징의 파악", "사업 목표 확인\nPM 요구 이해"],
          ["표준프로세스 선정 검증", "프로세스 선정\n프로세스 검증", "의사결정 트리\n적합성 평가"],
          ["상위 Level Customizing", "생명주기 정의\nStage 조정", "Biz 요구 반영\nStep 조정"],
          ["세부 Customizing", "세부 WBS 적용\n일정의 수립", "매트릭스 활용\n세부 일정 수립"],
          ["문서화", "결정사항 문서화\n검토와 승인", "작업 결과 작성\nPM 승인 획득"],
        ],
      },
      {
        caption: "참고: 테일러링 7단계 절차",
        headers: ["절차", "설명"],
        rows: [
          ["프로젝트 분석", "문제점 수집 활용 정보 분석"],
          ["범위 정의", "분석 결과 기반 개선 영역 정의"],
          ["프로세스 확장", "프로세스 특화 부가 절차 추가"],
          ["프로세스 구성", "요구사항 지원 적합 규모 구성"],
          ["프로세스 준비", "효력 발휘 정의 프로젝트 적용"],
          ["프로세스 공표", "멤버에게 공표 수시 참고 활용"],
          ["프로세스 유지보수", "신규 특성 대응 프로세스 유지"],
        ],
      },
      {
        caption: "목적 / 필요성",
        headers: ["구분", "목적 / 필요성"],
        rows: [
          ["관리적 측면", "How-To-Do 제시\n지속적 개선"],
          ["기술적 측면", "최적화된 기술 및 방법론 도출\n최신 기술 수용"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["측면", "고려사항", "설명"],
        rows: [
          ["프로젝트 측면", "규모·기간", "대규모/소규모"],
          ["프로젝트 측면", "조직원 구성", "경험자 비경험자"],
          ["프로젝트 측면", "위험수준", "높음·낮음"],
          ["기술적 측면", "기술혁신", "파일럿 검토"],
          ["기술적 측면", "데이터전환", "전환 환경 구성"],
          ["기술적 측면", "시스템연계", "인터페이스 난이도"],
          ["기술적 측면", "분산시스템", "도입·미도입"],
        ],
      },
    ],
    notes: [
      "교재 두음: [특선상세문]",
      "단계별 산출물: ① 프로젝트 프로파일 ② 표준프로세스 심사결과 ③ 생명주기·WBS ④ 스케줄·WBS ⑤ 적용 결과물. WBS 는 통상 3~5단계에 걸쳐 분할 수행한다.",
      "수행 절차 표는 주신 채점 답안지의 「테일러링 수행 절차 설명」 그대로다. 아래 7단계 절차는 「도리의 디지털라이프」 항목으로, 같은 일을 더 잘게 나눈 다른 갈래다.",
    ],
  },
  {
    title: "요구공학 (Requirements Engineering)",
    course: "SE",
    definition:
      "요구사항의 수집, 분석, 명세, 검증, 변경, 관리 등의 원칙과 제반 활동에 대한 총체적인 접근 체계",
    defShort: "요구사항 수집·분석·명세·검증·변경·관리의 총체적인 접근 체계",
    lead: "요구사항 관리 총체적 체계, 요구공학",
    features: ["단계적 요구 개발", "기준선 기반 통제", "요구 추적성"],
    keywords: ["정명완검일수추리해", "추분명검", "협기변검"],
    tables: [
      {
        caption: "요구공학 프로세스 설명",
        headers: ["구성요소", "대상", "설명"],
        rows: [
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 추출", "도출 대상 선정\n제안서·사업수행계획서\n인터뷰·프로토타이핑"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 분석", "도출 기능 명확히 파악\n정보공학 분석법·UML"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 명세", "시스템 행동 기술\n요구사항 명세서"],
          ["요구사항 개발 (CMMi L3 PA)", "요구사항 검증", "요구사항·명세 일치 확인·승인\n타당성 검증\n일치성·완전성·현실성\n프로토타이핑"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 협상", "가용 자원·위험 수준 내 기능 협상"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항 기준선", "공식 검토·합의된 명세서\n향후 개발 기본(Baseline)"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항변경관리", "기준선 기반 모든 변경 공식 통제"],
          ["요구사항 변경관리 (CMMi L2 PA)", "요구사항확인·검증", "구축 시스템, 기대 요구사항 부합"],
        ],
      },
      {
        caption: "요구사항 평가 지표 (정명완검일수추리해)",
        headers: ["항목", "설명"],
        rows: [
          ["정확성", "요구명세는\n정확히 기술"],
          ["명확성", "요구 명세는\n이해당사자별\n명확히 제시"],
          ["완전성", "기능성, 성능 및\n제약사항 등 모든\n중요한 내용이\n문서화"],
          ["검증성", "요구명세는 증명\n가능"],
          ["일관성", "요구명세는\n요구사항 간에\n충돌이 없어야 함"],
          ["수정성", "요구사항은 수정\n가능"],
          ["추적성", "요구사항은\n근원, 원리가\n추정 가능"],
          ["이해성", "이해 당사자간에\n이해가 용이 해야\n함"],
          ["해석성", "요구사항:\n해석의 일관성\n제공"],
        ],
      },
    ],
    notes: [
      "교재 두음: 정명완검일수추리해 / 추분명검(개발) / 협기변검(변경관리)",
      "프로세스 표 2열은 교재의 「대상」 여덟 개를 그대로 쓴 것이다. 두음 추분명검·협기변검이 이 이름을 가리키므로 바꾸지 않는다.",
    ],
  },
  {
    topicId: "se-34",
    title: "페르소나 (Persona)",
    course: "SE",
    definition:
      "어떤 제품 혹은 서비스를 사용할 만한 목표 인구 집단안에 있는 다양한 사용자 유형들을 대표하는 가상의 인물",
    defShort: "제품·서비스를 쓸 목표 집단의 다양한 사용자 유형을 대표하는 가상 인물",
    lead:
      "목표 사용자의 대표 인물, 페르소나(Persona)",
    features: ["가상 인물 설정", "사용자 유형 대표", "목표 집단 기반"],
    keywords: ["사용자 분석", "사용자 범주 파악", "기간구조 잡기", "페르소나 평가", "프로파일 작성"],
    tables: [
      {
        caption: "페르소나를 통한 사용자 분석 프로세스",
        headers: ["순서", "내용"],
        rows: [
          ["1", "사용자 범주 파악"],
          ["2", "주요 단서분류"],
          ["3", "세부 범주 파악,\n기간구조 잡기"],
          ["4", "기간구조 평가,\n우선순위 선정"],
          ["5", "페르소나 작성"],
          ["6", "페르소나 평가"],
          ["7", "설문조사를 통한\n프로파일 (Profile) 작성"],
        ],
      },
      {
        caption: "사용자 분석 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["모형", "페르소나", "가상인물 기반 사용자 분석모형"],
          ["인지", "인지", "시스템 인지 방식 사용자 인식 분석"],
          ["행태", "역할", "사용 행태 분석 관계 특징 분석"],
          ["조직", "사회기술", "조직 특성 초점 개발·사용 조직"],
        ],
      },
    ],
  },
  {
    title: "ISO/IEC/IEEE 42010:2022",
    course: "SE",
    definition:
      "SW 집약적 시스템의 아키텍처에서 표현해야 하는 내용 및 이들간 관계를 제공하는 아키텍처 명세 위한 표준 메타모델",
    defShort: "아키텍처 표현 내용 및 관계를 제공하는 아키텍처 명세 위한 표준 메타모델",
    lead: "아키텍처 기술 메타모델, ISO/IEC/IEEE 42010",
    features: ["표준 메타모델", "관심사별 뷰 기술", "대응 관계 추적"],
    keywords: ["구성요소들 전부"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명", "세부"],
        rows: [
          ["Entity of Interest", "관심 가지는\n대상 개체", "비즈니스·IT"],
          ["Architecture", "기본 개념·속성\n실현 구조", "요소 간 관계\n기본 개념·속성"],
          ["Stakeholder Perspective", "우려사항 관련\n사고방식", "소유자·설계자\n빌더의 관점"],
          ["Stakeholder", "관심 갖는\n개인 또는 조직", "클라이언트\n공급자·CEO\n인증 기관"],
          ["Architecture Description", "아키텍처 표현\n작업산출물", "이해·분석\n구축 청사진"],
          ["Architecture Rationale", "선택·대체 근거\n논리적 근거", "정당성 기록\n추론 기록"],
          ["Correspondence", "AD 요소 사이의\n명명된 관계", "일관성·추적성\n종속성·제약"],
          ["Correspondence Method", "뷰·AD 요소 간\n일관성 표현", "모델 종류\n관점의 사양"],
          ["Concern", "대상 시스템의\n모든 관심 사항", "목적·기능\n지원 가능성\n상호 운용성"],
          ["Architecture Viewpoint", "뷰의 해석·사용\n분석 규칙", "모델링 방법\n관점 언어·기법"],
          ["Architecture View", "이해관계자 관점\n아키텍처 표현", "뷰포인트 통해\n관심 표현"],
          ["Architecture Aspect", "문제 분석·해결\n구조화 측면", "기능적·구조적\n정보적 측면"],
          ["Model Kind", "모델에 대한\n규칙 정의", "Class/Flow\n다이어그램"],
          ["View Component", "View 구성 모델\n기능·동작 설명", "데이터흐름도\n클래스다이어그램"],
        ],
      },
    ],
  },
  {
    title: "SW Architecture 구축 절차",
    course: "SE",
    definition:
      "요구사항을 분석하고 품질속성을 식별하여 아키텍처를 설계하고, 평가·승인까지 수행하는 절차",
    defShort: "요구사항·품질속성 분석 후 아키텍처를 설계하고 평가·승인하는 절차",
    lead: "품질속성 식별의 설계 흐름, SW Architecture 구축 절차",
    features: ["품질속성 주도", "이해관계자 관점", "반복적 상세화"],
    keywords: ["요구사항분석", "아키텍처분석", "아키텍처설계", "검증 및 승인", "품질속성", "아키텍처 스타일", "평가"],
    tables: [
      {
        caption: "구축 절차",
        headers: ["설계단계", "설계항목", "설명"],
        rows: [
          ["요구사항 분석", "요구사항 분석", "기능적/비기능적 요구 사항 분석\n식별, 명세, 분류, 검증"],
          ["아키텍처 분석", "품질속성 식별", "품질 속성 식별, 우선순위 결정\n반영 방법 개발"],
          ["아키텍처 설계", "관점 정의", "이해관계자 파악\n이해관계자별 관점(view) 정의"],
          ["아키텍처 설계", "아키텍처스타일선택", "pipe-filter, mvc, layer 등 혼용"],
          ["아키텍처 설계", "후보아키텍처도출", "배경도 및 관점별 다이어그램 작성\nSW 아키텍처 명세서(SAD) 기술"],
          ["검증 및 승인", "아키텍처 평가", "요구 사항 만족도, 적합성 등 평가\n품질속성 간 관계 평가"],
          ["검증 및 승인", "아키텍처상세화(반복)", "설계 패턴 고려 설계 방법 도출"],
          ["검증 및 승인", "아키텍처 승인", "이해관계자들 최종 승인"],
        ],
      },
    ],
  },
  {
    topicId: "se-67",
    title: "Clean Architecture",
    course: "SE",
    definition:
      "소프트웨어 아키텍처를 4개의 계층으로 관심사를 분리해 각 계층에서 가지는 의존성에서 탈피해 높은 모듈성, 확장성, 유연성을 가지는 아키텍처",
    defShort: "4개 계층으로 관심사를 분리해 모듈성·확장성·유연성 높인 아키텍처",
    lead:
      "의존성 방향의 통제, Clean Architecture",
    features: ["관심사 분리", "안쪽 방향 의존", "프레임워크 독립"],
    keywords: ["관심사 분리", "Entites", "Use Case", "Interface Adapters", "Frameworks & Drivers"],
    tables: [
      {
        caption: "구성 요소 (4계층)",
        headers: ["계층", "특징", "설명"],
        rows: [
          ["Entity", "핵심업무규칙캡슐화", "Entity 내부 핵심업무 규칙 호출\n시스템 사용 흐름 표현\n클래스 내부 속성·메소드로 작성"],
          ["Use Case", "Use Case 캡슐화&구현", "Entity와 데이터 흐름 조합 및 조정\nBiz. 규칙 사용 유즈케이스 달성"],
          ["Interface Adapter", "Presenter\nView\nController", "Domain·Infrastructure 번역기\nOutput을 GUI·DB 편리한 형식 변환"],
          ["External Interface", "Framework\nDrivers", "모든 I/O components 포함\n변화 가능성 높아 도메인과 분리"],
        ],
      },
    ],
    notes: ["안쪽부터 Entities(Enterprise Business Rules) → Use Cases(Application Business Rules) → Interface Adapters → Frameworks & Drivers. 의존성은 항상 바깥에서 안쪽으로만 향한다."],
  },
  {
    title: "소프트웨어 아키텍처 드라이버 (SW Architecture Driver)",
    course: "SE",
    definition:
      "아키텍처 요구 사항 항목을 분석, 아키텍처 설계에 직/간접적 근간이 될 수 있는 항목을 추출/정제하여, 이를 아키텍처 설계 원칙이나 근거로 표현한 항목",
    defShort: "아키텍처 설계 근간 항목을 추출/정제해 설계 원칙·근거로 표현한 항목",
    lead:
      "설계를 좌우하는 요구 항목, SW Architecture Driver",
    features: ["요구사항 기반 도출", "설계 근거 역할", "소수 핵심 선정"],
    keywords: ["기능 요구", "비기능 요구", "품질 요구", "제약 사항"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "사례", "설명"],
        rows: [
          ["기능 요구 사항", "트래픽 정보 제공", "System이 갖춰야 할 기본 기능"],
          ["품질 요구 사항", "1분 간격 제공\n최대 10만명", "System 기능이 도달해야 할 목표"],
          ["제약 사항", "J2EE 기반 개발", "System과 무관한 제약 사항"],
        ],
      },
      {
        caption: "비기능 요구사항 영역",
        headers: ["영역", "특징", "설명"],
        rows: [
          ["기술적 제약", "Legacy System·신기술 영향", "특정 기술 명시하여 구현기술 제한"],
          ["비즈니스 제약", "대부분 타협 불가", "Business 지속·성장 위한 제약"],
          ["품질 제약", "Stakeholder간 각 관심 분", "확장성, 가용성, 변경 용이성\n이식성, 사용성, 성능 등 요구"],
        ],
      },
    ],
    notes: ["선정된 아키텍처 드라이브의 적정 개수: 10개 미만"],
  },
  {
    title: "유틸리티 트리 (Utility Tree)",
    course: "SE",
    definition:
      "소프트웨어 아키텍처 등 품질을 기반으로 평가하는 모델에서 품질 특성을 기준으로 시나리오를 작성하는 분석법, 또는 그 구조",
    defShort: "품질 기반 평가 모델에서 품질 특성을 기준으로 시나리오를 작성하는 구조",
    lead:
      "품질 요구의 시나리오화, 유틸리티 트리",
    features: ["MECE 트리 구조", "품질→시나리오", "시나리오 우선순위"],
    keywords: ["유틸리티", "품질속성", "세분화된 품질 속성", "시나리오", "시나리오 우선순위", "부분→전체", "Bottom Up"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["속성", "품질 속성", "측정·검증 가능 테스트 가능 특성\n요구 만족도 이해당사자 충족"],
          ["사례", "시나리오", "특정 작업 위한 SW 사용 방법 설명\n사용자 행동 시뮬레이션과 설명"],
        ],
      },
      {
        caption: "유틸리티 트리와 브레인 스토밍 비교",
        headers: ["비교항목", "유틸리티 트리", "브레인 스토밍"],
        rows: [
          ["이해관계자", "아키텍트·PL", "모든 이해관계자"],
          ["참여규모", "2~3명 참여", "5~10명 참여"],
          ["1차 목표", "품질속성 도출\n우선순위 결정", "우선순위 도출\n유틸리티 검증"],
          ["접근법", "품질→시나리오\n부분→전체", "시나리오→품질\n전체→부분"],
          ["형식", "MECE 트리", "특정 형식 없음"],
        ],
      },
    ],
    notes: ["작성 순서: ①유틸리티 ②품질 속성 ③세분화된 품질 속성 ④시나리오 (유품세시)"],
  },
  {
    title: "소프트웨어 품질 속성 시나리오",
    course: "SE",
    definition:
      "SW의 비기능 요구사항을 도출하기 위해 시스템과 이해관계자의 상호작용으로 표현한 시나리오 기반 요구사항 도출 기법",
    defShort: "비기능 요구사항을 시스템·이해관계자 상호작용 시나리오로 도출 기법",
    lead:
      "검증 가능한 비기능 요구, 소프트웨어 품질 속성 시나리오",
    features: ["비기능 요구 도출", "자극·응답 표현", "측정 가능 결과"],
    keywords: ["자극유발원", "환경", "응답측정"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성항목", "상세설명", "특징"],
        rows: [
          ["자극 유발원(Source)", "자극 유발 존재", "사람·시스템 등"],
          ["자극(Stimulus)", "반응 유발 조건", "도달 시 고려사항"],
          ["환경(Environment)", "자극 발생 상황", "정상·과부하 등"],
          ["대상(Artifact)", "자극 받는 대상", "전체 또는 일부"],
          ["응답(Response)", "도달 후 동작", "측정 결과값 발생"],
          ["응답 측정(Response Measure)", "측정 가능 결과", "요구사항 검증"],
        ],
      },
      {
        caption: "가용성 달성을 위한 품질 속성 시나리오 사례",
        headers: ["구분", "내용"],
        rows: [
          ["자극", "예기치 못한 메시지"],
          ["자극의 원천", "외부에서 시스템"],
          ["대상(Artifact)", "프로세스"],
          ["환경", "정상 오퍼레이션"],
          ["응답", "운영자에게 통지 후 계속 수행"],
          ["응답 측정", "정지 시간 없음"],
        ],
      },
    ],
    notes: ["정전 또는 장애로 인해 시스템에 문제가 발생했을 경우 정지 시간 없이(무정지) 시스템이 정상적으로 작동"],
  },
  {
    title: "소프트웨어 아키텍처 스타일",
    course: "SE",
    definition:
      "아키텍처 설계에서 반복적, 일반적 발생 문제를 해결하고 아키텍처가 만족시켜야 하는 시스템 품질 속성 달성 위한 Best Practice를 정리한 패턴",
    defShort: "반복 문제 해결·품질 속성 달성의 Best Practice 정리 패턴",
    lead:
      "검증된 설계 해법의 유형, 소프트웨어 아키텍처 스타일",
    features: ["검증된 구조 재사용", "품질 속성 중심", "스타일 조합 가능"],
    keywords: ["칠저일파", "번규주원래클", "마슬마서", "이브"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "서브타입", "설명"],
        rows: [
          ["데이터 중심(Data-Centered)", "칠판형(Blackboard)", "데이터 정확성 위한 품질특성 구현"],
          ["데이터 중심(Data-Centered)", "저장소형(Repository)", "데이터 저장소 접근·갱신 초점"],
          ["데이터 흐름(Data Flow)", "일괄 순차형\n(Batch Sequence)", "컴포넌트 독립 프로그램 구성\n수행 완료 후 다음 컴포넌트 수행\n전통적 데이터 처리 응용분야"],
          ["데이터 흐름(Data Flow)", "파이프 필터형\n(Pipes and filters)", "연속 컴포넌트 데이터 점진적 변형\n필터: 데이터 스트림 변환기\n파이프: 필터 간 단순 데이터 이동"],
          ["가상 머신(Virtual Machine)", "번역기형(Interpreter)", "S/W 시스템 이식성 구현 초점"],
          ["가상 머신(Virtual Machine)", "규칙기반시스템형\n(Rule-Based System)", "H/W나 S/W에서 Simulation 수행"],
          ["호출과 리턴(Call and Return)", "주프로그램과서브루틴\nMain Program and subroutine", "서브루틴 구성, 수정성 품질 구현"],
          ["호출과 리턴(Call and Return)", "원격프로시저호출\n(Remote Procedure call)", "네트워크 서브루틴 구성 분산처리"],
          ["호출과 리턴(Call and Return)", "Layered Architecture", "SW 계층 분할, 인접 이웃과 통신\n시스템 수정용이성, 이식성 구현"],
          ["호출과 리턴(Call and Return)", "Client and Server", "Client 요청, Server 서비스 제공"],
          ["분산 구조", "Master and Slave", "Master 분산, Slave 결과값 종합"],
          ["분산 구조", "Micro Service Architecture", "독립 배치 서비스 단위 분리·조합\nREST API로 API Gateway간 통신"],
          ["중계", "Event-bus Pattern", "이벤트 소스·리스너·채널·버스\n소스는 버스 통해 메시지 전달\n리스너는 채널 구독"],
          ["중계", "Broker", "서버 서비스 정보 broker에 제공\n클라이언트 broker에 서비스 요청\nbroker 적당한 서버 리다이렉트"],
        ],
      },
    ],
    notes: ["교재 두음: 칠저일파 번규주원래클 마슬마서 이브"],
  },
  {
    topicId: "se-59",
    title: "SW Architecture 평가",
    course: "SE",
    definition:
      "제시된 소프트웨어 아키텍처가 개발될 소프트웨어에 대해서 요구되는 품질 특성을 충족시킬 수 있는지 아키텍처 수준에서 평가하는 절차",
    defShort: "SW 아키텍처가 품질 특성을 충족하는지 아키텍처 수준에서 평가 절차",
    lead: "품질 충족 여부 사전 검증, SW Architecture 평가",
    features: ["품질 특성 검증", "아키텍처 수준 평가", "시나리오 기반 모델"],
    keywords: ["SAAM", "CBAM", "ATAM", "EATAM", "ADR", "ARID"],
    tables: [
      {
        caption: "SW아키텍처 평가모델 상세 설명",
        headers: ["구분", "모델", "목표", "설명"],
        rows: [
          ["시나리오 기반 평가모델", "SAAM", "수정가능성·기능성", "최초의 아키텍처 평가 방법"],
          ["시나리오 기반 평가모델", "ATAM", "SAAM 계승\n품질 요소간 Trade-Off", "품질목표 간 Trade off 파악 평가"],
          ["시나리오 기반 평가모델", "CBAM", "편익·투자가치", "ATAM 보완, 경제성 평가까지 수행"],
          ["시나리오 기반 평가모델", "EATAM", "Product Line 확장 평가", "스테이지 기반 Product Line 평가"],
          ["설계/혼합 기반 평가모델", "ADR", "ATAM·ARID 혼합", "설계기반 구성요소 간 응집도 평가"],
          ["설계/혼합 기반 평가모델", "ARID", "특정 품질 집중", "초기 일부 설계만으로 쉽게 평가\nATAM·SAAM과 ARD 혼합"],
        ],
      },
    ],
    notes: ["관계도: SAAM ─계승/발전→ ATAM. ATAM ↔ CBAM(경제성 평가보강), ATAM → ADR, ADR+ATAM → ARID, SAAM → EATAM(Product Line 평가·스테이지 기반)"],
  },
  {
    title: "CBAM(Cost Benefit Analysis Method)",
    course: "SE",
    definition:
      "각 아키텍처 접근법의 시나리오별 효용을 계산하고, 이를 이득과 비용을 기준으로 분석하여 가장 비용 효율이 높은 방법을 선정하는 평가 프레임워크",
    defShort: "시나리오별 효용 계산해 비용 효율 높은 방법을 선정하는 평가 프레임워크",
    lead:
      "비용 대비 효용의 평가, CBAM",
    features: ["2단계 반복", "효용-반응 곡선", "불확실성 고려"],
    keywords: ["비용 효율", "2단계 반복", "효용-반응 곡선", "불확실성 고려"],
    tables: [
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["절차", "2단계 반복", "1차 우선순위 접근법 순위 결정\n2차 재평가 위험·자원 고려"],
          ["표현", "효용-반응 곡선", "반응값·효용 성능·비용 지표\n관계 시각화 곡선으로 표현"],
          ["한계", "불확실성 고려", "경험 기반 값 관계자 경험 의존\n불확실성 존재 오차 발생 가능"],
        ],
      },
      {
        caption: "CBAM 상세 절차",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["시나리오 결정", "시나리오 수집", "기존 ATAM·신규 시나리오 수집"],
          ["시나리오 결정", "시나리오 정제", "최선·최악·현재·기대 반응 값\n시나리오 집합 생성"],
          ["시나리오 결정", "시나리오 우선순위", "기대 반응 값 따라 상위 1/2 선별\n우선순위별 가중치 부여"],
          ["효용-반응값 곡선 선정", "효용-반응 값 곡선 작성", "반응 값으로 효용-반응 곡선 추정"],
          ["아키텍처 접근법 이익 계산", "예상반응 값 결정", "담당 아키텍처 접근법 연결\n예상 반응 값 결정"],
          ["아키텍처 접근법 이익 계산", "예상 효용 계산", "효용-반응 곡선으로 효용 계산"],
          ["아키텍처 접근법 이익 계산", "전체 이익 계산", "가중치 반영 시나리오 이익 계산"],
          ["아키텍처 접근법", "ROI 계산, 순위 결정", "ROI 기준 접근법 순위 결정"],
          ["아키텍처 접근법", "선정, 결과 검증", "비용·일정 고려 접근법 선정\n결과 검증"],
        ],
      },
    ],
    notes: ["효용 반응값 곡선 기호 — QA: 품질 속성, W: Worst 최악, C: Current 현재, E: Expected 기대, D: Desired 기대, B: Best 최선"],
  },
  {
    title: "UML (정적, 동적 다이어그램)",
    course: "SE",
    definition:
      "특정 언어나 공정에 종속되지 않고 보다 수준 높은 자동화 기반의 소프트웨어 시스템 아키텍처를 묘사하기 위한 표준 모델링 언어",
    defShort: "언어·공정에 종속되지 않고 SW 시스템 아키텍처 묘사 표준 모델링 언어",
    lead:
      "설계 표현의 표준 언어, UML",
    features: ["언어·공정 독립", "표준 표기법", "정적·동적 관점"],
    keywords: ["가시화", "구체화", "명세화", "문서화", "정적/동적 다이어그램", "13개 다이어그램 명칭"],
    tables: [
      {
        caption: "정적 다이어그램 (Structure Diagram)",
        headers: ["구분", "다이어그램", "설명"],
        rows: [
          ["구조", "Class", "정적 구조 표현 클래스 관계 표현"],
          ["구조", "Component", "컴포넌트 구성 논리 클래스 표현\n자신 구현 정보 구현 내용 포함"],
          ["인스턴스", "Object", "인스턴스 표현 관계 객체 표현\n이름 밑줄 표기 밑줄로 구분"],
          ["배치", "Deployment", "물리 구조 표현 배치 구조 기술\nHW·SW 관계 장치 간 관계"],
          ["구조", "Composite Structure", "분류자 내부 복합 구조 표현\n포트·파트 커넥터 포함"],
          ["묶음", "Package", "패키지 요소 내부 요소 표현\n그룹화 표기 클래스 묶음"],
        ],
      },
      {
        caption: "동적 다이어그램 (Behavior Diagram)",
        headers: ["구분", "다이어그램", "설명"],
        rows: [
          ["흐름", "Activity", "행위 순서 흐름 활동 흐름 표시"],
          ["기능", "Use Case", "행위자 연결 외부 액터 연결\n유즈케이스 뷰 제공 기능 표현"],
          ["상태", "State", "객체 상태 기술 가능 상태 표현"],
          ["상호작용", "Interaction", "4개 통합 그룹 시퀀스·타이밍"],
          ["상호작용", "Sequence", "메시지 순서 시간 순 표현\n객체 간 협력 동적 협력 기술"],
          ["상호작용", "Communication", "연결 중심 표현 객체 상호작용"],
          ["상호작용", "Interaction Overview", "액티비티 결합 흐름 중심 표현\n시퀀스 혼합 두 기법 통합"],
          ["상호작용", "Timing", "시간 흐름 상태 시간별 상태 표현"],
        ],
      },
    ],
    notes: ["구조 다이어그램(정적) 6개 + 행위 다이어그램(동적) 7개 = 13개. 인터랙션 다이어그램은 행위 다이어그램의 하위 묶음(시퀀스·커뮤니케이션·인터랙션 오버뷰·타이밍)"],
  },
  {
    title: "클래스 다이어그램 (Class Diagram)",
    course: "SE",
    definition:
      "시스템에서 사용되는 객체 타입을 정의하고, 그들 간에 존재하는 정적인 관계를 표현한 정적 다이어그램",
    defShort: "시스템의 객체 타입을 정의하고 그 정적 관계를 표현한 정적 다이어그램",
    lead:
      "객체 타입과 정적 관계, 클래스 다이어그램",
    features: ["정적 다이어그램", "객체 타입 정의", "클래스 간 관계 표현"],
    keywords: ["이름", "Attribute", "Operation", "접근제어자(Public, Private, Protected, Package)", "관계(연관, 직접연관, 집합연관, 복합연관, 의존, 일반화, 실체화)"],
    tables: [
      {
        caption: "접근 제어자",
        headers: ["구성요소", "설명", "표기법"],
        rows: [
          ["Public", "모든 객체 접근", "+"],
          ["Private", "자기 클래스만", "−"],
          ["Protected", "패키지·상속만", "#"],
          ["Package", "동일 패키지만", "~"],
        ],
      },
      {
        caption: "관계",
        headers: ["관계", "설명", "표기법"],
        rows: [
          ["연관관계(Association)", "상호 연관 존재", "실선"],
          ["직접연관관계(Direct Association)", "방향성 존재", "실선 화살표"],
          ["집합연관관계(Aggregation)", "부분·전체 관계", "속 빈 마름모"],
          ["복합연관관계(Composition)", "전체 소멸 시 소멸", "채워진 마름모"],
          ["의존관계(Dependency)", "변화가 영향 미침", "점선 화살표"],
          ["일반화 관계(Generalization)", "상하위 상속 관계", "빈 삼각형 화살표"],
          ["실체화 관계(Realization)", "인터페이스 구현", "점선 빈 삼각형"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["클래스", "이름", "클래스 이름 기입(Ex. Animal)"],
          ["클래스", "Attribute", "접근제어자·변수이름·자료형\nEx) -name : string"],
          ["클래스", "Operation", "메소드이름·접근제어자\n리턴타입\nEx) +eat() : void"],
          ["스테레오 타입(Stereo Type)", "길러멧(guillemet, 《 》)", "UML 추가 확장 요소\n《 》 사이 특성 정의\n《interface》·《utility》\n《abstract》·《enumeration》"],
        ],
      },
    ],
  },
  {
    title: "유즈케이스 다이어그램",
    course: "SE",
    definition:
      "시스템이 제공하고 있는 기능 및 그와 관련된 외부요소를 사용자의 관점에서 표현하는 동적 다이어그램",
    defShort: "시스템 제공 기능과 외부요소를 사용자 관점에서 표현한 동적 다이어그램",
    lead:
      "사용자 관점의 기능 표현, 유즈케이스 다이어그램",
    features: ["사용자 관점", "동적 다이어그램", "시스템 기능 중심"],
    keywords: ["액터", "유즈케이스", "시스템", "연관", "확장", "포함", "일반화", "그룹화"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["분류", "구분", "설명", "표기법"],
        rows: [
          ["기본 구성", "Usecase", "제공할 서비스\nActor 일련 행위", "타원"],
          ["기본 구성", "Actor(행위자)", "수행 역할(role)\n사람 또는 사물", "졸라맨"],
          ["기본 구성", "시스템(System)", "전체 영역 표현\n특별 의미 없음", "사각 테두리"],
          ["관계 표현", "연관(Association)", "Usecase·Actor 관계", "실선"],
          ["관계 표현", "확장(Extend)", "특별 조건 시 수행", "«extend»\n점선 화살표"],
          ["관계 표현", "포함(Include)", "별도 기능 포함\n반드시 수행", "«include»\n점선 화살표"],
          ["관계 표현", "일반화(Generalization)", "기능·역할 상속", "속이 빈 삼각형"],
          ["관계 표현", "그룹화(Grouping)", "여러 Usecase 단순화", "Package"],
        ],
      },
      {
        caption: "작성 절차",
        headers: ["절차", "설명"],
        rows: [
          ["Actor 식별", "시스템 사용자 식별\n상호작용 타 시스템 식별"],
          ["Use Case 식별", "액터 요구 서비스 식별\n액터 요구 정보 식별\n액터-시스템 상호작용 행위 식별"],
          ["Relationship 정의", "액터↔액터 관계 분석·정의\n액터↔유스케이스 관계 분석 정의\n유스케이스 간 관계 분석·정의"],
          ["Use Case 구조화", "여러 유스케이스 공통 서비스 추출\n추출 서비스 유스케이스로 정의\n유스케이스·사용자 관계 정의"],
        ],
      },
    ],
    notes: ["extend 는 조건을 만족할 때만 수행(선택), include 는 반드시 수행(필수)"],
  },
  {
    title: "상태 다이어그램 (State Diagram)",
    course: "SE",
    definition:
      "하나의 객체가 가질 수 있는 모든 가능한 상태와 특정 객체에 대한 사건발생에 따른 상태 전이 과정을 묘사한 동적 다이어그램",
    defShort: "객체의 가능한 상태와 사건에 따른 상태 전이 과정 묘사한 동적 다이어그램",
    lead:
      "객체 상태와 전이의 표현, 상태 다이어그램",
    features: ["단일 객체 중심", "이벤트 기반 전이", "동적 관점 표현"],
    keywords: ["상태", "전이", "이벤트", "전이조건"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명", "표기법"],
        rows: [
          ["상태", "객체의 조건\n상단 상태 이름\n하단 상세활동", "둥근 사각형"],
          ["시작상태", "Lifetime 시작", "● (검은 원)"],
          ["종료상태", "Lifetime 종료", "◉ (겹친 원)"],
          ["전이", "상태 간 변화\n상태 관계 의미", "화살표"],
          ["이벤트", "전이 유발 자극", "화살표 위 이름"],
          ["전이조건", "조건 만족 시 전이\n불리언 식", "[전이조건]"],
        ],
      },
    ],
    notes: ["결재 예: 시작 → 작성 →(상신) 결재대기 →(부분승인 반복) →(반려) 반려 →(재작업) 작성 / →(최종결재) 승인 → 종료"],
  },
  {
    title: "시퀀스 다이어그램 (Sequence Diagram)",
    course: "SE",
    definition:
      "시스템이 제공하고 있는 기능 및 그와 관련된 외부요소를 사용자의 관점에서 표현하는 동적 다이어그램",
    defShort: "시스템 기능 및 외부요소를 사용자의 관점에서 표현하는 동적 다이어그램",
    lead:
      "시간 순 메시지 흐름, 시퀀스 다이어그램",
    features: ["동적 다이어그램", "시간 순서 표현", "메시지 교환 중심"],
    keywords: ["액터", "활성 객체", "생명선", "제어사각형", "메시지", "프레임", "연산자"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명", "표기법"],
        rows: [
          ["액터(Actor)", "상호작용 사용자", "졸라맨"],
          ["활성 객체", "메시지 교환 객체\n맨 위에 위치", "사각형"],
          ["생명선", "객체 존재 기간\n위에서 아래 점선", "세로 점선"],
          ["제어사각형", "메시지 교환 상태\n생명선 위 위치", "가는 세로 막대"],
          ["메시지", "동기: 응답 대기\n비동기: 대기 X\n응답: 제어 복귀", "채운 화살표\n열린 화살표\n점선 화살표"],
          ["프레임", "UML2.0 프레임\n좌상단에 표시", "sd 이름"],
          ["연산자", "loop 반복 실행\nopt 조건 참 실행\npar 병렬 처리", "loop, opt, par"],
        ],
      },
    ],
  },
  {
    topicId: "se-94",
    title: "Interaction overview diagram",
    course: "SE",
    definition:
      "액티비티들의 순서적 흐름을 나타내는 액티비티 다이어그램에서 액티비티 대신 시퀀스로 흐름을 상세하게 표현하는 행위 다이어그램",
    defShort: "액티비티 대신 시퀀스로 순서적 흐름을 상세하게 표현한 행위 다이어그램",
    lead:
      "흐름과 상호작용의 결합, Interaction overview diagram",
    features: ["액티비티 흐름 기반", "시퀀스 상세 내포", "전체 흐름 조망"],
    keywords: ["Activity와 Sequence의 결합"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["Diagram", "구성요소", "설명", "표기법"],
        rows: [
          ["Activity", "Activity State", "워크 플로우 상의\n작업 단계", "ActionState"],
          ["Activity", "Initial/Final state", "시작 및 종료 지점", "● / ◉"],
          ["Activity", "Decision", "의사결정 지점", "◇"],
          ["Activity", "Transition", "제어 흐름의 전달", "화살표"],
          ["Sequence", "활성 객체", "시스템의 행위자\n또는 유효 객체", "«javascript»\nComments"],
          ["Sequence", "메시지", "활성 객체 간의\n의사소통 묘사", "Message 화살표"],
          ["Sequence", "제어 사각형", "제어와 정보의\n대기상태 표시", "세로 막대"],
        ],
      },
    ],
    notes: ["사례: sd AccessControl — Enter code 객체의 OK 값 여부에 의해 Access 승인과 불가로 분기. 바깥은 Activity Diagram, 안쪽 상자는 Sequence Diagram"],
  },
  {
    title: "MSA (Micro Service Architecture)",
    course: "SE",
    definition:
      "하나의 큰 애플리케이션을 여러 개의 작은 마이크로 서비스 단위로 나누어 변경과 조합이 가능하도록 만든 아키텍처",
    defShort: "작은 마이크로 서비스 단위로 나눠 변경·조합이 가능하게 만든 아키텍처",
    lead:
      "서비스 단위의 분할 구조, MSA",
    features: ["도메인 중심 분할", "독립 배포 단위", "서비스별 DB 분리"],
    keywords: ["API Gateway", "Orchestration", "REST API", "Persistent", "DevOps", "DDD(Domain Driven Design, 도메인 주도 설계)", "Polyglot(폴리글랏, 크로스 플랫폼인 데이터 교환을 의미)"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "설명", "구현 기능"],
        rows: [
          ["API Gateway", "계층 간 연계\n엔드포인트 통합\nRESTful 요청·응답 관리", "API Policy Management\nLoad Balancing\nTransaction Monitoring\nSession Monitoring"],
          ["API Server", "독립 배포 단위\nAPI 서버 계층", "DDD 기반\n비즈 기능 분리"],
          ["Persistence", "데이터 지속성\n다양한 DB 활용", "RDB·NoSQL·New SQL\nPolyglot Persistence"],
          ["User/Client", "웹·모바일 앱", "Web 서비스"],
        ],
      },
    ],
    notes: ["계층: User Interface Layer → API Gateway Layer → Business Logic Layer(Microservice 여러 개, Polyglot Programming) → Database Layer(서비스마다 별도 DB)"],
  },
  {
    topicId: "se-70",
    title: "API Gateway",
    course: "SE",
    definition:
      "클라이언트가 요청한 API 서비스를 내부에서 처리가 가능한 API 형태로 변환, 전달하는 Gateway",
    defShort: "내부에서 처리가 가능한 API 형태로 변환, 전달하는 Gateway",
    lead: "API 전달의 단일 관문, API Gateway",
    features: ["단일 진입 프록시", "프로토콜 변환", "보안 기능 집중"],
    keywords: ["프록시", "프로토콜 변환", "보안(인증, 로깅)", "라우팅", "마이크로 서비스"],
    tables: [
      {
        caption: "역할",
        headers: ["구분", "역할", "설명"],
        rows: [
          ["보안", "내부 데이터 보호", "인프라 보호·통신 데이터 암호화"],
          ["보안", "접근 통제", "비인가자 접근 막는 계정 증명\n보안정책 적용 접근 관리"],
          ["보안", "로깅 및 모니터링", "비정상 행위 감지 모니터링\n장애처리 위한 로그 수집·저장"],
          ["서비스 연결", "클라이언트 요청 변환", "외부 API 요청 내부 처리 가능 변환"],
          ["서비스 연결", "백엔드 처리 결과 반환", "결과 클라이언트 적합 형태 변환"],
        ],
      },
      {
        caption: "주요 기능",
        headers: ["기능", "세부 기능", "설명"],
        rows: [
          ["보안", "인증 및 인가", "클라이언트 인증 API Token 발급\nToken 이용 인증요청 및 검증"],
          ["보안", "암호화 통신", "데이터 보호 SSL 암호화 통신 구축\n인증서 관리"],
          ["보안", "로그 기능", "경로별 호출 로그 기록 및 관리\n로그 패턴 분석 통한 장애 관리"],
          ["라우팅", "서비스 매칭", "엔드 포인트·서비스 라우팅 결정"],
          ["라우팅", "로드 밸런싱", "백엔드 서버 로드 밸런싱\n메시지/헤더 기반 라우팅"],
          ["Mediation", "HTTP/JSON 프로토콜 변환", "요청 메시지 프로토콜 변환"],
          ["기타", "서비스오케스트레이션", "여러 서비스 묶어 신규 서비스 제공"],
          ["기타", "서비스디스커버리", "서비스 위치(동적IP·포트) 관리"],
          ["기타", "서비스 통계", "서비스별 접속 통계 통한 미터링\n빅데이터 연계"],
        ],
      },
    ],
  },
  {
    title: "SAGA패턴",
    course: "SE",
    definition:
      "마이크로 서비스들끼리 이벤트를 주고 받는 도중 작업이 실패하면 이전까지의 작업이 완료된 마이크서비스들에게 보상(complementary)이벤트를 소싱함으로써 분산 환경에서 원자성을 보장하는 패턴",
    defShort: "마이크로 서비스에 보상 이벤트 소싱으로 분산 환경에서 원자성 보장 패턴",
    lead:
      "분산 트랜잭션의 보상 처리, SAGA 패턴",
    features: ["보상 트랜잭션", "최종 일관성", "분산 원자성"],
    subDefs: [
      {
        name: "Choreography Based SAGA",
        lead: "이벤트 전파의 자율 조율",
        def: "App으로 이벤트를 보내고 완료 Event 수신 후 다음 작업 진행 패턴",
      },
      {
        name: "Orchestration Based SAGA",
        lead: "중앙 매니저의 일괄 제어",
        def: "중앙 트랜잭션 관리 인스턴스를 통해 요청·완료 수신 트랜잭션 처리 패턴",
      },
    ],
    keywords: ["트랜잭션처리", "Choreography 방식", "Orchestration 방식", "데이터 정합성 보장"],
    tables: [
      {
        caption: "Choreography 와 Orchestration 비교",
        headers: ["구분", "Choreography Based SAGA", "Orchestration Based SAGA"],
        rows: [
          ["개념", "로컬 트랜잭션\n이벤트 전파", "Saga 매니저\n일관성 보장"],
          ["트랜잭션 설명", "이벤트 비동기\n완료 후 다음 진행", "중앙 요청·수신\n트랜잭션 처리"],
        ],
      },
    ],
    notes: ["MSA 에서는 서비스마다 DB가 따로라 2PC 같은 분산 트랜잭션을 쓰기 어렵다. 그래서 실패 시 되돌리는 보상 트랜잭션으로 최종 일관성을 맞춘다."],
  },
  {
    title: "DDD (Domain Driven Design)",
    course: "SE",
    definition:
      "개발 참여자가 공통의 언어(유비쿼터스 언어) 사용을 통해 모델링과 개발의 불일치를 해결하고, 설계와 구현은 계속적인 수정 과정을 반복함으로써 개발 품질을 향상시키는 소프트웨어 설계 방법",
    defShort: "유비쿼터스 언어로 모델링과 개발의 불일치를 해결하는 SW 설계 방법",
    lead:
      "도메인 중심의 설계 방법, DDD",
    features: ["도메인 중심", "유비쿼터스 언어", "설계·구현 반복"],
    keywords: ["유비쿼터스 언어", "도메인", "서브도메인", "바운디드 컨텍스트", "컨텍스트 맵", "도메인 모델", "Entity", "Value", "Aggregate", "Repository", "Service"],
    tables: [
      {
        caption: "설계 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["거시", "전략적 설계(Strategic Design)", "비즈니스 전략적 중요 요소 구분\n유비쿼터스 언어 사용\n바운디드 컨텍스트·컨텍스트 맵\n최종적으로 서비스 도출"],
          ["미시", "전술적 설계(Tactical Design)", "디자인 패턴 집합 제공\n내부 아키텍처 설계"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["계층 구조", "User Interface", "사용자 요청을 하위 계층에 전달"],
          ["계층 구조", "Application", "App 상태관리\nBiz 처리는 도메인에 요청"],
          ["계층 구조", "Domain", "정보·상태 포함 Biz. Logic 제공"],
          ["계층 구조", "Infrastructure", "다른 계층 지원 라이브러리\n영속성 구현"],
          ["구현 패턴", "엔티티(Entity)", "영속성 필요한 고유 식별자 객체"],
          ["구현 패턴", "값 객체(Value Object)", "식별 불필요, 값만 가진 객체"],
          ["구현 패턴", "서비스(Service)", "Entity 등 여러 객체 발생 행위 담당"],
          ["구현 패턴", "어그리거트(Aggregate)", "도메인 구성 엔티티와 값 객체 묶음"],
          ["구현 패턴", "팩토리(Factory)", "객체 생성 절차 캡슐화"],
          ["구현 패턴", "레파지토리(Repository)", "생성된 Aggregate 영속성 관리\n엔티티 저장, 업데이트·삭제"],
          ["구현 패턴", "도메인 이벤트(Domain Event)", "도메인 내 변경 파생 작업 명시 구현\n트리거, 시스템간 데이터 동기화"],
          ["모델 관리", "Module", "낮은 결합도, 높은 응집도 구현"],
          ["모델 관리", "Refactoring", "코드·모델 리팩토링\n설계영역 재검토"],
        ],
      },
    ],
  },
  {
    title: "Event Driven Architecture",
    course: "SE",
    definition:
      "데이터의 변경, 생성, 삭제 등 이벤트 발생 등 상태변화에 반응하여 서비스가 변화하는 형태의 소프트웨어 아키텍처",
    defShort: "이벤트 발생 등 상태변화에 반응하여 서비스가 변화하는 SW 아키텍처",
    lead:
      "상태변화 이벤트 기반 동작, Event Driven Architecture",
    features: ["상태변화 반응", "비동기식", "실시간 처리"],
    keywords: ["이벤트 프로듀서", "이벤트 채널", "이벤트 처리 엔진", "다운스트림 이벤트 기반활동"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성요소", "설명", "특징"],
        rows: [
          ["이벤트 프로듀서", "이벤트 감지\n메시지로 표현", "채널로 전달"],
          ["이벤트 채널", "소비자에게 전달\n큐 저장·대기", "실시간 처리\n비동기식"],
          ["이벤트 처리 엔진", "이벤트 식별 후\n반응 실행", "비즈니스 로직"],
          ["다운스트림 이벤트 기반 활동", "결과 표시 계층\n알림·경고", "싱크 수준 따라\n불필요"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["구분", "활용 사례", "설명"],
        rows: [
          ["확장", "시스템 확장성", "확장성 우선 성능보다 확장\n복합 이벤트 복합 처리 필요"],
          ["병렬", "병렬 처리", "동일 이벤트 다수 시스템 처리\n병렬 실행 필요 동시 수행 상황"],
        ],
      },
    ],
    notes: ["Event Producers(Web Site·Mobile App·Retail App) → Event Router/Broker/Bus → Event Consumers(Inventory·Order·Payment Service)가 구독"],
  },
  {
    title: "이벤트 스토밍(Event Storming)과 헥사고날(Hexagonal) 아키텍처",
    course: "SE",
    definition:
      "[이벤트 스토밍] Event와 Brain Storming의 합성어로 **Domain Expert와 개발자 등의 이해관계자가 도메인 이벤트를 통한 서비스 간 의존 관계를 식별**하는 활동 / [헥사고날 아키텍처] **UI나 DB를 비지니스 로직으로 분리하고 비지니스 로직이 외부요소에 의존하지 않는** 아키텍처",
    defShort: "도메인 이벤트로 서비스 의존 관계 식별, 외부요소에 의존 않는 아키텍처",
    lead: "도메인 이벤트 식별과 로직 격리, 이벤트 스토밍과 헥사고날 아키텍처",
    features: ["도메인 이벤트 중심", "외부 요소 비의존", "포트·어댑터 구조"],
    defPair: [
      {
        name: "이벤트 스토밍(Event Storming)",
        lead: "도메인 이벤트 기반 의존 식별",
        def: "이해관계자가 도메인 이벤트를 통한 서비스 간 의존 관계를 식별하는 활동",
        features: ["도메인 전문가 참여", "도메인 이벤트 중심", "포스트잇 시각화"],
      },
      {
        name: "헥사고날(Hexagonal) 아키텍처",
        lead: "비즈니스 로직 격리 구조",
        def: "UI·DB와 분리해 외부 요소에 의존하지 않는 비즈니스 로직 아키텍처",
        features: ["UI·DB 분리", "로직 외부 비의존", "포트·어댑터 연결"],
      },
    ],
    keywords: ["도메인 이벤트", "커맨드", "외부시스템", "액터", "에그리게이트", "정책", "핫스팟(Hot Spot)", "driving adapter", "driven adapter", "Port", "Application Core", "Adapter Layer", "Application Layer", "Domain Layer"],
    tables: [
      {
        caption: "이벤트 스토밍 절차도",
        headers: ["절차", "설명"],
        rows: [
          ["① 도메인 이벤트 도출", "오렌지 포스트잇 발생 사건 도출"],
          ["② 커맨드 도출", "파란 포스트잇 트리거 명령 도출"],
          ["③ 외부 시스템 도출", "핑크 포스트잇 연계 시스템 식별"],
          ["④ 액터 도출", "작은 노란색 역할 주체 도출"],
          ["⑤ 애그리게이트 도출", "큰 노란색 상태 데이터 묶음"],
          ["⑥ 컨텍스트 경계 그리기", "경계 구획 문맥 범위 구분"],
          ["⑦ 정책 설정", "연한 핑크색 조건별 결정 정의"],
        ],
      },
      {
        caption: "이벤트 스토밍 절차 항목과 사용 포스트잇",
        headers: ["항목", "포스트잇", "설명"],
        rows: [
          ["도메인 이벤트", "오렌지색", "발생된 사건\n과거시제동사로 표현"],
          ["커맨드", "파란색", "이벤트 트리거 명령"],
          ["외부시스템", "진한 핑크색", "레거시 외부 시스템·장비"],
          ["액터", "작은 노란색", "개인 조직 역할"],
          ["에그리게이트", "큰 노란색", "상태 변경 데이터"],
          ["정책", "연한 핑크색", "조건 따른 결정"],
          ["핫스팟", "보라색", "의문 질문 미결정"],
        ],
      },
      {
        caption: "헥사고날 아키텍처 구성",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["어댑터", "driving adapter (UI)", "왼쪽 애플리케이션 코어를 호출"],
          ["어댑터", "driven adapter (DB)", "오른쪽 애플리케이션 코어가 호출"],
          ["포트", "Port", "애플리케이션 코어↔어댑터\n통신 인터페이스"],
          ["코어", "Application Core", "도메인 엔티티 코어 구성 요소\n유스케이스 외부 의존 없음"],
          ["계층", "Adapter Layer", "가장 바깥 계층 외부 시스템 연동"],
          ["계층", "Application Layer", "호출 경유 계층 반드시 거치는 곳"],
          ["계층", "Domain Layer", "도메인 엔티티 최내부 계층"],
        ],
      },
    ],
    notes: [
      "이벤트 스토밍은 Event 와 Brain Storming 의 합성어다.",
      "포스트잇 색이 곧 항목 구분이다 — 오렌지(도메인 이벤트)·파랑(커맨드)·진한 핑크(외부시스템)·작은 노랑(액터)·큰 노랑(에그리게이트)·연한 핑크(정책)·보라(핫스팟).",
    ],
  },
  {
    title: "디자인 패턴 (Design Pattern)",
    course: "SE",
    definition:
      "소프트웨어 개발의 여러 가지 문제 해결 설계 사례를 분류하고, 각 문제 유형별로 가장 적합한 설계를 일반화한 패턴",
    defShort: "문제 해결 설계 사례를 분류해 문제 유형별 가장 적합한 설계 일반화한 패턴",
    lead: "반복 설계 문제 정형 해법, 디자인 패턴",
    features: ["문제별 설계 일반화", "개발자 의사소통", "목적·범위별 분류"],
    keywords: ["개발 중 문제 해결 사례 모음", "생성 패턴", "구조 패턴", "행위 패턴"],
    tables: [
      {
        caption: "디자인 패턴 형식",
        headers: ["구분", "설명", "요소"],
        rows: [
          ["패턴이름(Pattern name)", "설계 의도 표현\n개발자 의사소통", "이름과 분류\n별칭"],
          ["문제(Problem)", "적용 시점 판단\n해결 문제·배경", "의도/목적\n적용 대상"],
          ["해법(Solution)", "구성요소·역할\n요소 간 관계", "구조·구성요소\n협력·샘플코드"],
          ["결과(Consequence)", "적용 결과\n장단점 서술", "효과·주의사항\n사례·관련 패턴"],
        ],
      },
      {
        caption: "디자인 패턴 분류 [생구행]",
        headers: ["구분", "생성패턴(Creational)", "구조패턴(Structural)", "행위패턴(Behavioral)"],
        rows: [
          ["의미", "객체 생성 방식\n구조화·캡슐화", "객체 조직화 방식\n라이브러리 통합", "객체 행위 조직화\n클래스 연동 유형"],
          ["클래스 범위", "Factory Method", "Adapter(Class)", "Interpreter\nTemplate Method"],
          ["객체 범위", "Abstract Factory\nBuilder, Prototype\nSingleton\nFactory Method", "Adapter(Object)\nBridge, Composite\nDecorator, Facade\nFlyweight, Proxy", "Chain of Responsibility\nCommand, Mediator, Memento\nIterator, State, Strategy\nObserver, Visitor"],
          ["암기법", "아 베 프로 시 파", "A B C D 파 플 로", "CCMMISSOTIV"],
        ],
      },
    ],
    notes: [
      "교재 두음: [생구행] / 생성 '아베프로시파' / 구조 'ABCD파플로' / 행위 'CCMMISSOTIV'",
      "클래스 범위 패턴은 셋뿐: 생성 Factory Method / 구조 Adapter(Class) / 행위 Interpreter·Template Method — 나머지는 전부 객체 범위",
      "생성 5: Abstract Factory·Builder·Prototype·Singleton·Factory Method / 구조 7: Adapter·Bridge·Composite·Decorator·Facade·Flyweight·Proxy / 행위 11: Chain of Responsibility·Command·Mediator·Memento·Iterator·State·Strategy·Observer·Visitor·Interpreter·Template Method",
    ],
  },
  {
    title: "싱글턴 패턴 (Singleton pattern)",
    course: "SE",
    definition:
      "클래스의 인스턴스가 오직 하나만 생성되도록 보장하고, 해당 인스턴스에 접근할 수 있는 전역적인 접근 지점을 제공하는 생성 패턴",
    defShort: "인스턴스 오직 하나만 생성 보장, 전역적인 접근 지점 제공하는 생성 패턴",
    lead:
      "유일 인스턴스의 보장, 싱글턴 패턴",
    features: ["인스턴스 1개 보장", "전역 접근 지점", "외부 생성 차단"],
    keywords: ["Private 생성자", "Static 인스턴스", "Public 정적 메서드"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["생성 제한", "Private 생성자", "private 직접 생성 방지\n생성자 제한 외부 접근 차단"],
          ["인스턴스", "Static 인스턴스", "static 클래스 내 선언\n유일 인스턴스 단일 객체 보관"],
          ["접근점", "Public 정적 메서드(getInstance)", "정적 메서드 외부 접근 제공\n공개 접근점 유일 객체 반환"],
        ],
      },
      {
        caption: "구현 방식",
        headers: ["항목", "설명"],
        rows: [
          ["Lazy Initialization", "최초 호출 시 객체\n생성. 지연\n초기화"],
          ["Eager Initialization", "클래스 로딩 시\n객체 즉시 생성.\n빠름"],
          ["Double-Checked Locking", "멀티스레드\n안전성 및 성능\n개선"],
          ["Enum Singleton", "Java에서 가장\n안전한 싱글턴\n구현 방법 (Serialization,\nReflection 우회 방지 가능)"],
        ],
      },
    ],
    notes: ["코드 3요소: private static instance / private constructor / public static synchronized getInstance()"],
  },
  {
    title: "UML의 4+1 View Model",
    course: "SE",
    definition:
      "소프트웨어 시스템의 아키텍처를 사용자, 개발자, 관리자 등 다양한 이해관계자의 관점에서 효과적으로 설계하고 문서화하기 위한 프레임워크",
    defShort: "사용자·개발자·관리자 등 이해관계자 관점 설계·문서화 프레임워크",
    lead:
      "이해관계자 관점별 문서화, UML의 4+1 View Model",
    features: ["이해관계자별 관점", "시나리오 중심 통합", "복잡성 관리"],
    keywords: ["Logical View", "Implementation View", "Process View", "Deployment View", "Use Case View"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "관점", "설명"],
        rows: [
          ["Logical View", "Designers\nAnalysts", "Class Diagram 구조·행동 명세화"],
          ["Implementation View", "Programmers\n(개발자 관점)", "UML 모델요소 물리적 SW 모듈 표현"],
          ["Process View", "System Integrators\n(시스템 통합관점)", "Thread·Process 동작 중점 표현"],
          ["Deployment View", "System Engineers\n(시스템 엔지니어)", "모델요소 배치 하드웨어 표현"],
          ["Use Case View", "End Users\n(최종 사용자)", "요구 분석 시스템 기능 명세화\n전체 View 아우르는 통합 관점"],
        ],
      },
      {
        caption: "유사 아키텍처 뷰와 비교",
        headers: ["구분", "4+1 View", "Siemens Four Views"],
        rows: [
          ["목적", "이해관계자 관점\n복잡성 관리", "분석 요인 파악\n설계 전략 도출"],
          ["핵심", "4가지 주요 관점\n1개 시나리오", "4개 상호 보완 뷰\n아키텍처 분리"],
          ["관점", "논리·프로세스\n개발·물리 뷰\n+1 유즈케이스 뷰", "개념·코드 뷰\n모듈·실행 뷰"],
        ],
      },
    ],
    notes: ["가운데 Use Case View 를 중심으로 Logical(설계자)·Implementation(개발자)·Process(통합자)·Deployment(엔지니어) 네 뷰가 둘러싼다"],
  },
  {
    title: "MVVM (Model, View, View Model)",
    course: "SE",
    definition:
      "모델, 뷰, 뷰 모델로 기능을 분리하고, data binding을 통하여 뷰와 뷰 모델 간의 통신을 자동화하는 아키텍처 패턴",
    defShort: "모델·뷰·뷰 모델로 기능 분리, 뷰·뷰 모델 통신 자동화 아키텍처 패턴",
    lead:
      "데이터 바인딩 기반 분리, MVVM",
    features: ["기능 분리 구조", "바인딩 통신 자동화", "View 독립성"],
    keywords: ["Model", "View", "View Model", "Data Binding"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["데이터", "Model", "어플리케이션 사용 데이터\n그 데이터를 처리"],
          ["화면", "View", "사용자에게 보여지는 UI"],
          ["중개", "View Model", "View 나타내기 위한 Model\nView 나타내기 위한 데이터 처리"],
          ["연결", "Data Binding", "화면 객체·데이터 동기화 기법\nView·View Model 연결 매개체\n서로 존재 몰라도 인터랙션 도움"],
        ],
      },
      {
        caption: "패턴의 동작",
        headers: ["순번", "동작", "설명"],
        rows: [
          ["1", "요청 처리", "사용자 Action은 View 통해 진입"],
          ["2", "요청 처리", "Command 패턴으로 Action 전달"],
          ["3", "데이터 처리", "View Model이 Model에 데이터 요청"],
          ["4", "데이터 처리", "Model이 요청 받은 데이터 응답"],
          ["5", "데이터 처리", "View Model이 데이터 가공·저장"],
          ["6", "화면 처리", "Data Binding으로 화면 표현"],
        ],
      },
    ],
    notes: ["View : View Model = n : 1 관계. Data Binding 덕분에 View와 ViewModel이 서로를 직접 몰라도 된다(독립)"],
  },
  {
    topicId: "se-135",
    title: "TDD (Test Driven Development)",
    course: "SE",
    definition:
      "Simple Code의 추구를 목적으로 Test Case를 먼저 개발하고 Test Case를 통과하는 실제코드를 나중에 개발하는 Agile 개발방법",
    defShort: "테스트 케이스 먼저 개발 후 통과하는 실제코드 개발하는 애자일 개발방법",
    lead:
      "테스트를 앞세운 개발, TDD",
    features: ["테스트 선행 작성", "짧은 구현 반복", "Simple Code 추구"],
    keywords: ["[요테구리] 요구사항", "테스트", "구현", "리팩토링"],
    tables: [
      {
        caption: "단계 설명 (요테구리)",
        headers: ["단계", "설명"],
        rows: [
          ["요구사항", "Story 작성 사용자 BA 참여\n요구사항 수집 제품 요구 정의"],
          ["테스트 작성", "테스트 케이스 동작 요구 기능\n인터페이스 개발 선행 테스트 작성"],
          ["구현(코드 작성)", "실행 가능 코드 빠른 코드 작성\n가짜·명백 구현 임시 자료 삽입"],
          ["리팩토링", "중복 코드 제거 임시 코드 정리\n모듈화·패턴 디자인 패턴 적용"],
          ["체크인", "깔끔한 코드 동작 코드 저장\n테스트 간격 조절 짧은 구현 반복"],
        ],
      },
      {
        caption: "단계별 코드 (Red-Green-Refactor)",
        headers: ["코드", "설명"],
        rows: [
          ["RED", "실패 테스트 실패하는 코드\n테스트 선행 작성 기능 전 작성"],
          ["GREEN", "통과 코드 작성 테스트 통과 목표\n최소 단위 구현 작은 코드 작성"],
          ["REFACTOR", "중복 코드 개선 반복 코드 제거\n긴 메소드 정리 큰 클래스 분할"],
        ],
      },
    ],
    notes: ["TDD의 주문: red, green, refactor — 실패 테스트부터 쓰고, 통과시키고, 다듬는다"],
  },
  {
    title: "SDD(Spec-Driven Development)",
    course: "SE",
    definition:
      "기계가 읽을 수 있는 구체적인 사양을 중심으로, AI가 코드, 테스트, 문서를 자동으로 파생하여 생성하는 개발방법론",
    defShort: "사양 중심, AI가 코드·테스트·문서 자동 파생 생성하는 개발방법론",
    lead: "명세 중심 AI 산출물 통제, SDD",
    features: ["실행 가능한 명세", "요구-코드 정합성", "진실의 단일 원천"],
    keywords: ["Spec First", "Single Source of Truth(SSoT)", "실행 가능한 명세", "Failing Test"],
    tables: [
      {
        caption: "SDD 특징",
        headers: ["구분", "설명"],
        rows: [
          ["SDD 특징", "실행 가능한 명세\n프롬프트와 행동 규격(Spec)중심\n요구-코드 간 의미적 정합성 보장\n진실의 단일 원천(SSoT)"],
        ],
      },
      {
        caption: "SDD 핵심원칙",
        headers: ["핵심원칙", "설명"],
        rows: [
          ["Spec First(명세 우선)", "코드 전에 명세\n착수 선행 조건"],
          ["Spec as Source of Truth(명세는 단일 기준)", "구현·테스트의\n단일 기준"],
          ["AI Guided by Explicit Rules(AI가 읽게 구조화)", "요구·계약·제약\n명시적 구조화"],
          ["Feedback Back to Spec(피드백은 다시 명세로)", "명세로 재반영\n다음 구현 통제"],
        ],
      },
      {
        caption: "SDD 절차 (정설분구)",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["명세", "정의(Specify)\n설계(Plan)", "상세 명세서 작성\n명세 기반 설계"],
          ["구현", "분해(Break Down)\n구현(Implement)", "테스트 가능 단위\n에이전트 코딩"],
        ],
      },
      {
        caption: "SDD·TDD·BDD 통합 개발 프로세스",
        headers: ["영역", "활동", "설명"],
        rows: [
          ["SDD 영역", "통합 요구 정의\n명세 수립", "명세 중심성 확보\n기술 계획 수립"],
          ["BDD 영역", "행위 시나리오\n인수 기준", "사용자 행위 명확\n테스트 설계"],
          ["TDD 영역", "실패 테스트 선행\n구현", "구현 품질 보장\n코드 리팩터"],
          ["검증·개선 영역", "검증·개선\n명세 갱신", "결과 검증 반영\n명세 재적용"],
        ],
      },
    ],
    notes: [
      "AI-DLC 는 '생명주기를 어떻게 돌릴까', SDD 는 '무엇을 근거로 만들까' — 프로세스 기준과 산출물 기준의 차이로 갈라 쓰면 비교가 선다.",
      "바이브 코딩·AI 페어 프로그래밍과 묶여 'AI 시대 개발 방법론'으로 출제된다.",
      "명세 개선 → 재적용의 순환이다. 오류 수정과 기능 개선 결과를 다시 명세에 반영해 다음 구현을 통제한다.",
      "통합 프로세스는 SDD의 명세 중심성, BDD의 사용자 행위 명확화, TDD의 구현 품질 보장을 결합해 설계한다.",
    ],
  },
  {
    topicId: "se-139",
    title: "데브옵스 (DevOps)",
    course: "SE",
    definition:
      "시스템 개발자와 운영을 담당하는 정보기술 전문가 사이의 소통, 협업, 통합 및 자동화를 강조하는 소프트웨어 개발론",
    defShort: "개발·운영 정보기술 전문가 간 소통·협업·통합·자동화 강조 개발론",
    lead:
      "개발과 운영의 통합, 데브옵스(DevOps)",
    features: ["개발·운영 협업", "자동화 중심", "사이클타임 축소"],
    keywords: ["CI/CD", "프로비저닝"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["측면", "구성요소", "설명"],
        rows: [
          ["품질", "품질 기준 정의\n테스트 자동화", "시나리오 기반\nXunit 활용"],
          ["프로세스", "사이클타임 축소\n완료 기준 확장\n지속적 출시\n릴리즈 배포 분리", "기능 흐름 지속 향상\n완료=운영서버 정상동작\n운영서버 반영 자동화\n기능 토글 활용"],
          ["도구", "지속적 통합\n릴리즈 자동화\n프로비저닝", "변경 시 자동 빌드\n형상 서버 트리거\n시스템 구성 관리"],
        ],
      },
    ],
    notes: [
      "개념도: DEV(Create·Plan·Verify·Package) ↔ OPS(Release·Configure·Monitor) 무한 루프. Development ∩ QA ∩ Operations = DevOps",
      "구성 요소 표를 한 줄로 접으면서 뺀 교재 부연: 완료 기준 확장은 운영 서버에서 정상 동작하는 시점까지, 릴리즈 배포 분리는 추상 브랜치·다크 론칭·블루그린, 지속적 통합은 Git 연동과 테스트 결과 발송, 릴리즈 자동화는 형상 서버 트리거와 표준 게이트웨이, 프로비저닝은 빌드 코드 배치까지 포함한다.",
    ],
  },
  {
    topicId: "se-141",
    title: "SRE (Site Reliability Engineering)",
    course: "SE",
    definition:
      "대규모 시스템의 지속적이고 적절한 수준의 안정성을 확보하기 위하여 고도의 자동화와 자가 치유 기능을 제공하는 SW 엔지니어링 기술",
    defShort: "안정성 위해 고도의 자동화와 자가 치유 기능 제공 SW 엔지니어링 기술",
    lead:
      "운영의 엔지니어링화, SRE",
    features: ["자가 치유", "SLI·SLO 기반 결정", "Error Budget 수용"],
    keywords: ["안정성", "자가치유", "자동화", "카나리 배포", "Toil 관리", "Error Budget", "구글 운영팀"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["기법", "설명", "지표 및 기법"],
        rows: [
          ["Metric & Monitoring", "지표 정의·관리\n데이터 기반 결정", "SLI(지표)\nSLO(목표)"],
          ["Capacity Planning", "리소스 유연 대응\n필요·확보 용량", "수요 기반 예측\nSW 성능 튜닝"],
          ["Change Management", "점진 배포·변경\n빠른 롤백", "카나리 배포\n롤링 업데이트"],
          ["Emergency Response", "장애 대응 자동화\n복구 모의 훈련", "MTTR, Playbook\nToil 관리"],
          ["Culture", "합리적 의사결정\n비난 없는 대응", "Error Budget"],
        ],
      },
      {
        caption: "주요 성공 요소(CSF)",
        headers: ["CSF", "설명", "비고"],
        rows: [
          ["Silo 조직의 통합", "정보·책임 공유\n동일 도구 사용", "오너십 공유"],
          ["실패에 대한 수용", "위험 감수·대책\n오류 정량화", "Postmortem 회고\nError Budget"],
          ["점진적 구현과 개선", "실패 비용 절감\n올바른 방향 지원", "카나리 배포\n롤링 업데이트"],
          ["자동화 시스템 사용", "반복 업무 자동화\n운영 오류 최소화", "Toil 관리"],
          ["모든 것에 대한 측정", "측정 방법 정의\n작동 문제 원인\nSW 문제로 인식", "시스템 지표\n수동 작업 시간\n장애 시간"],
        ],
      },
    ],
  },
  {
    topicId: "se-143",
    title: "무중단 배포",
    course: "SE",
    definition:
      "시스템에 의해 제공하는 비즈니스의 연속성과 안정성을 보장하기 위해 운영 환경에 소스 배포 시 서비스가 중단되지 않도록 코드를 Deploy할 수 있는 기술",
    defShort: "운영 환경에 서비스가 중단되지 않도록 코드를 Deploy하는 기술",
    lead: "연속성 보장의 코드 반영, 무중단 배포",
    features: ["비즈니스 연속성", "신·구버전 공존", "추가 자원 필요"],
    subDefs: [
      {
        name: "롤링 업데이트(Rolling Update)",
        lead: "한 대씩 순차 교체",
        def: "1개씩 Rolling을 통해 점진적으로 인스턴스를 변경하는 기법",
      },
      {
        name: "블루그린 디플로이먼트(Blue/Green Deployment)",
        lead: "신·구 환경의 일괄 전환",
        def: "모든 트래픽을 New 버전으로 한번에 Switching하는 기법",
      },
      {
        name: "카나리 릴리즈(Canary Release)",
        lead: "일부 노출의 위험 감지",
        def: "일부 사용자만 신규 서버로 접속, 모니터링 후 모든 서버로 교체하는 기법",
      },
    ],
    keywords: ["Rolling Update", "Blue/Green Deployment", "Canary Release"],
    tables: [
      {
        caption: "무중단 배포 기법 비교",
        headers: ["기법", "설명", "장점", "단점"],
        rows: [
          ["Rolling Update", "인스턴스 준비 후\n1개씩 점진 변경", "관리·롤백 용이", "처리 용량\n사전 고려 필요"],
          ["Blue/Green Deployment", "신버전 배포 후\n트래픽 일괄 전환", "운영 영향 없이\n신버전 테스트", "자원 두 배 필요\n비용 증가"],
          ["Canary Release", "일부 사용자만\n신규 서버 접속", "위험 조기 감지\nA/B 테스트 활용", "네트워크 트래픽\n제어 부담"],
        ],
      },
    ],
    notes: ["카나리 = 광산의 카나리아 새. 일부 사용자로 먼저 위험을 감지한다"],
  },
  {
    topicId: "se-145",
    title: "릴리즈 엔지니어링",
    course: "SE",
    definition:
      "소프트웨어 개발 과정에 신뢰성과 효율성을 추구하여 안정적이고 예측 가능한 배포·구현·개선 방법을 포괄적으로 연구하는 소프트웨어 엔지니어링",
    defShort: "안정적·예측 가능한 배포·구현·개선 방법 연구하는 SW 엔지니어링",
    lead: "예측 가능한 배포 체계, 릴리즈 엔지니어링",
    features: ["파이프라인 자동화", "사람 개입 최소화", "예측 가능 배포"],
    keywords: ["배포·구현·유지보수", "파이프라인(pipeline)"],
    tables: [
      {
        caption: "주요 역할",
        headers: ["구분", "역할", "설명"],
        rows: [
          ["구축", "CI/CD 파이프라인 구축", "CI/CD 구축 통합·배포 체계\n파이프라인 개발 및 관리"],
          ["실행", "배포 자동화", "배포 자동화 사람 개입 제거\n무인 배포 수행 자동 배포 구축"],
          ["관리", "설정 관리", "환경별 설정 다양 환경 대응\n설정 반영 유지 SW 설정 관리"],
          ["개선", "모니터링 및 분석", "과정·결과 감시 릴리즈 상태 확인\n분석 기반 개선 지속적 품질 향상"],
        ],
      },
      {
        caption: "파이프라인 단계",
        headers: ["단계", "주요 업무", "설명"],
        rows: [
          ["A. 통합(Integration)", "브랜칭 및 병합", "변경사항 브랜치 거쳐 마스터 이동\n버전 관리 시스템(VCS) 사용\nSubversion, Git 대표적 도구"],
          ["B. 지속적 통합(Continuous Integration)", "빌드 및 테스트", "변경사항 자동 빌드·초기 테스트\nJenkins, Bamboo\nTeam Foundation Server 등 도구"],
          ["C. 빌드 시스템(Build System)", "빌드 명세 관리", "바이너리·라이브러리 생성 명세\nGNU Make, Ant, Maven, CMake"],
          ["D. 코드형 인프라(IaC, Infrastructure-as-Code)", "환경 설정 자동화", "테스트·배포 환경 자동 생성\nPuppet, Chef, Ansible, Docker"],
          ["E. 배포(Deployment)", "릴리즈 준비 단계", "웹: 서버로 파일 전송\n모바일: 앱 스토어 제출\n블루/그린, 카나리아, A/B 테스트"],
          ["F. 릴리즈(Release)", "사용자 공개", "최종 사용자 새 버전 이용 단계\nDNS 변경, 앱 스토어 새 버전 게시"],
        ],
      },
    ],
  },
  {
    topicId: "se-144",
    title: "카오스 엔지니어링 (Chaos Engineering)",
    course: "SE",
    definition:
      "복잡한 분산 시스템 환경에서 시스템의 신뢰성을 확인하기 위해, 인위적인 혼돈(Chaos)을 가하여 시스템의 취약한 부분을 찾고 보강하는 방식의 엔지니어링 기법",
    defShort: "인위적 혼돈을 가해 시스템 취약한 부분을 찾고 보강하는 엔지니어링 기법",
    lead:
      "인위적 장애 주입 검증, 카오스 엔지니어링",
    features: ["인위적 혼돈 주입", "정상상태 가설 검증", "대조군 비교 실험"],
    keywords: ["Hypothesis", "Fault Injection", "Measuring", "Verify"],
    tables: [
      {
        caption: "프로세스 상세 설명",
        headers: ["절차", "세부 활동", "설명"],
        rows: [
          ["Step 1: Creating a Hypothesis", "Steady System State", "측정 가능 통계치로 정상상태 정의\n임계값 기준 장애 시 동작 예측\n지연 시간·초당 요청·리소스 측정"],
          ["Step 1: Creating a Hypothesis", "Hypothesis", "정상상태·정상 값 가설 수립"],
          ["Step 2: Fault Injection", "Fault Injection", "오류 추가, 대조·실험군 정상 가정\n역방향 옵션으로 백업계획 수립"],
          ["Step 3: Measuring the Impact", "Analyze the metrics", "실제 문제에 대한 변수 정의"],
          ["Step 3: Measuring the Impact", "Fix the failure", "버그 문제 중 시스템 모니터링\n테스트로 최선 해결 방법 모색"],
          ["Step 4: Verify(or Disprove) Your Hypothesis", "Verify", "대조·실험군 차이 조사 가설 검증\n시스템 복원력 확인·문제 탐색"],
          ["Step 4: Verify(or Disprove) Your Hypothesis", "Improve System", "도출 결과값으로 정상동작 개선"],
        ],
      },
    ],
    notes: ["넷플릭스 Chaos Monkey가 원조 — 운영 중 서버를 일부러 죽여 복원력을 검증한다"],
  },
  {
    topicId: "se-149",
    title: "테스트 원리",
    course: "SE",
    definition:
      "결함 발견·불완전·초기 시작·결함 집중·살충제 패러독스·정황 의존·오류 부재의 궤변 등 SW 테스트가 따르는 7가지 원리",
    defShort: "결함 발견·결함 집중·살충제 패러독스 등 테스트의 기본 7가지 원리",
    lead:
      "테스트가 따르는 기본 법칙, 테스트 원리 7가지",
    features: ["결함 존재 입증", "완벽 테스팅 불가", "정황 의존성"],
    keywords: ["살충제 패러독스", "오류부재 궤변", "결함발견", "초기 시작", "불완전", "결함 집중", "정황의존"],
    tables: [
      {
        caption: "SW 테스트 원리",
        headers: ["원리", "내용", "원인 또는 목적"],
        rows: [
          ["결함발견", "결함 제거 아닌\n결함 발견 목적", "테스트 목표"],
          ["불완전", "완벽한 테스팅\n불가능", "자원의 한계"],
          ["초기 시작", "설계 시부터 고려\n결함 조기 발견", "품질 비용 감소"],
          ["결함 집중(Defect Clustering)", "결함 80%가\n20% 모듈 집중", "파레토 법칙"],
          ["살충제 패러독스(Pesticide Paradox)", "동일 케이스 반복\n새 결함 못 찾음", "케이스에 맞춰진\n프로그램 수정"],
          ["정황 의존적", "테스트 주변 환경\n영향을 받음", "도메인 분야에\n목표가 좌우"],
          ["오류 부재의 궤변(Absence-errors fallacy)", "요구사항 미충족\n결함 제거 무의미", "프로그램 목적은\n비즈니스 요구"],
        ],
      },
      {
        caption: "살충제 패러독스와 오류부재의 궤변 개선방안",
        headers: ["구분", "개선방안", "설명"],
        rows: [
          ["살충제 패러독스", "테스트 케이스\n개선", "기법 재적용\n잠재 결함 발견"],
          ["살충제 패러독스", "테스트 케이스\n추가", "신규 시나리오\n커버 범위 확대"],
          ["오류부재의 궤변", "검증 및 확인", "요구사항 부합"],
          ["오류부재의 궤변", "제품/프로세스\n품질개선", "고객 참여 확인\nCMMI 진단"],
        ],
      },
    ],
  },
  {
    title: "리뷰(Review)",
    course: "SE",
    definition:
      "코드를 포함하여 요구사항 정의서, 설계서 등 개발 중간산출물을 실행하지 않고 검토하여, 개발 초기 단계에서 결함을 발견하고 예방하는 핵심적인 정적 테스팅 기법",
    defShort: "개발 중간산출물을 실행하지 않고 검토해 결함 발견하는 정적 테스팅 기법",
    lead:
      "실행 없는 정적 결함 검출, 리뷰(Review)",
    features: ["실행 없는 정적 검토", "초기 결함 발견", "공식성 단계 구분"],
    keywords: ["비공식적 리뷰", "기술적 리뷰", "워크쓰루", "인스펙션", "페이건의 인스펙션", "Process-계시사미RF", "참여자-관중기작검"],
    tables: [
      {
        caption: "리뷰(Review)의 Process (계시사미RF)",
        headers: ["단계", "목표/산출물", "공식적 리뷰 추가 활동"],
        rows: [
          ["① 계획활동", "인원 선정·역할\n리뷰 대상 선정", "시작·종료 기준\n정의"],
          ["② 시작(Kick-Off)", "문서 배포\n목표·절차 설명", "시작 기준 점검"],
          ["③ 사전 검토/개별 준비", "참석자별 리뷰\n잠재 결함 기록", "추가 활동 없음"],
          ["④ 리뷰 미팅", "결함 여부 결정\n처리 방안 제안", "상세의견록\n(Minutes) 작성"],
          ["⑤ Re-Work(재작업)", "발견된 결함 수정", "추가 활동 없음"],
          ["⑥ Follow-Up(후속처리 확인)", "결함 조치 확인", "측정치 수집\n종료 기준 점검"],
        ],
      },
      {
        caption: "리뷰(Review)의 형식",
        headers: ["형식", "설명"],
        rows: [
          ["비공식적 리뷰", ""],
          ["기술적 리뷰", ""],
          ["워크쓰루", "사전 준비 과정 대부분 생략\n동일 조직·동일 Level 참여\n역할 제한적\n참여 인원 비제한적"],
          ["인스펙션", "페이건의 인스펙션\n2배수의 인력(능력 있는)\n전체 비용의 15%"],
        ],
      },
      {
        caption: "리뷰의 참여자 역할 (관중기작검)",
        headers: ["리뷰 역할", "주요 특징", "설명"],
        rows: [
          ["관리자", "리뷰 목적\n달성 승인", "실행 여부 결정\n시간 할당"],
          ["중재자(Moderator)", "리뷰 리더\n교육 이수", "계획·진행 리드\n관점 중재"],
          ["기록자", "Minutes\n작성", "이슈 문제점\n미해결점 기록"],
          ["작성자", "중간 산출물\n작성자", "리뷰 대상 문서\n저자·책임자"],
          ["검토자", "테스트 전문가", "도메인 배경 보유"],
        ],
      },
    ],
    notes: ["교재 두음: Process [계시사미RF] / 참여자 [관중기작검]"],
  },
  {
    topicId: "se-156",
    title: "블랙박스 테스트",
    course: "SE",
    definition:
      "소프트웨어의 내부 구조를 고려하지 않고 입력값에 대한 출력값을 확인하여 기능과 S/W 외부와의 연계를 테스트하는 방법",
    defShort: "내부 구조 고려 없이 입력값에 대한 출력값을 확인해 기능 테스트하는 방법",
    lead:
      "입출력 기반의 기능 검증, 블랙박스 테스트",
    features: ["명세 기반", "사용자 관점", "내부 구조 무관"],
    subDefs: [
      {
        name: "동등 클래스 분할 기법",
        lead: "입력 도메인의 등가 분할",
        def: "입력 도메인을 등가 분할해 영역별 대표값으로 테스트 케이스 설계 방법",
      },
      {
        name: "경계값 분석",
        lead: "경계 근처 결함의 착안",
        def: "입력 영역의 분할 클래스의 경계값으로 테스트 케이스를 설계하는 방법",
      },
      {
        name: "의사결정 테이블 테스팅",
        lead: "결정 요소의 결합 조합",
        def: "의사결정 요소를 결정테이블로 만들어 결합으로 테스트 케이스 설계 기법",
      },
      {
        name: "상태전이 테스팅",
        lead: "상태 변화의 동작 파악",
        def: "상태전이 다이어그램으로 상태 변화로 발생되는 관계·동작 파악 테스트",
      },
      {
        name: "유스케이스 테스팅",
        lead: "비즈니스 시나리오 기반",
        def: "유즈케이스의 기본·대체 흐름을 기반으로 테스트를 명세화하는 기법",
      },
      {
        name: "분류 트리 기법",
        lead: "트리 구조의 분석 표현",
        def: "SW 일부·전체를 트리 구조로 분석·표현해 테스트 케이스 설계 기법",
      },
      {
        name: "페어와이즈 테스팅",
        lead: "두 요소 상호작용 조합",
        def: "각 값이 다른 파라미터 값과 최소 한 번씩 조합되도록 구성하는 테스트 기법",
      },
      {
        name: "원인-결과 그래프",
        lead: "입력·출력 관계의 분석",
        def: "입력 데이터 관계가 출력에 미치는 영향을 분석해 테스트 케이스 설계 기법",
      },
      {
        name: "오류예측 기법",
        lead: "감각과 경험의 결함 탐색",
        def: "시험 기법들이 놓치기 쉬운 오류를 감각과 경험으로 찾아 검증하는 기법",
      },
    ],
    keywords: ["요구명세서", "기능중심", "Data Driven", "I/O Driven", "동등분할", "경계값분석", "의사결정 테이블", "상태전이", "유즈케이스", "분류트리", "페어와이즈 테스트", "원인-결과 그래프 기법", "오류예측기법"],
    tables: [
      {
        caption: "블랙박스 테스트 기법",
        headers: ["기법", "상세 설명"],
        rows: [
          ["동등 클래스 분할 기법", "도메인 등가 분할, 영역별 대표값"],
          ["경계값 분석", "분할 클래스 경계값 테스트 케이스\n결함은 경계값 근처 많이 발생"],
          ["의사결정 테이블 테스팅", "의사결정 요소 결정테이블로 표현\n요소 간 결합 테스트 케이스"],
          ["상태 전이 테스팅", "상태전이 다이어그램 기반 테스트\n임베디드SW 테스트 시 적용"],
          ["유스케이스 테스팅", "유즈케이스 시나리오 기반 테스트\n기본 흐름·대체 흐름"],
          ["분류 트리 기법", "트리 구조 분석 테스트 케이스 설계"],
          ["페어와이즈 테스팅", "대부분 결함 Pair 상호작용 기인\n파라미터 값 쌍 최소 한번 조합"],
          ["원인-결과 그래프", "입력 관계·출력 영향 체계적 분석"],
          ["오류예측 기법", "놓치기 쉬운 오류 감각·경험 검증\n예) 문법 어긋난 입력 시험"],
        ],
      },
    ],
    notes: ["요구명세서·기능중심·Data Driven·I/O Driven 테스트라고도 부른다"],
  },
  {
    topicId: "se-158",
    title: "화이트박스 테스트",
    course: "SE",
    definition:
      "소프트웨어의 내부 구조, 동작, 소스 코드를 직접 보면서 논리적인 흐름이 올바른지 검증하는 테스트",
    defShort: "내부 구조와 소스 코드를 직접 보며 논리 흐름이 옳은지 검증하는 테스트",
    lead:
      "내부 논리 흐름의 검증, 화이트박스 테스트",
    features: ["내부 구조 참조", "개발자 관점", "코드 커버리지 측정"],
    subDefs: [
      {
        name: "제어 구조 테스트",
        lead: "논리 복잡도의 경로 정의",
        def: "SW의 논리적 복잡도를 측정해 수행할 기본 경로 집합을 정의하는 테스트",
      },
      {
        name: "루프 테스트",
        lead: "루프 경계선의 오류 검출",
        def: "단순·중첩·연결·비구조 루프 경계선에서 발생하는 경계오류 테스트",
      },
      {
        name: "구문 커버리지",
        lead: "모든 구문의 1회 실행",
        def: "프로그램의 모든 구문이 최소 한 번 실행되도록 데이터를 선정하는 기법",
      },
      {
        name: "결정 커버리지",
        lead: "결정문의 참·거짓 수행",
        def: "프로그램 내 전체 결정문이 적어도 한 번 참과 거짓을 수행하게 하는 기법",
      },
      {
        name: "조건 커버리지",
        lead: "개별 조건의 참·거짓",
        def: "결정 명령문 내의 각 조건이 적어도 한 번 참과 거짓이 되게 하는 커버리지",
      },
      {
        name: "조건/결정 커버리지",
        lead: "전체·개별 조건의 동시 충족",
        def: "전체 조건식과 개별 조건식이 모두 참 한 번, 거짓 한 번이 되게 하는 기법",
      },
      {
        name: "변경조건/결정 커버리지",
        lead: "개별 조건의 독립적 영향",
        def: "각 조건식이 다른 조건식 영향 없이 전체 조건식에 독립적 영향을 주는 기법",
      },
      {
        name: "다중조건/결정 커버리지",
        lead: "모든 조건 조합의 고려",
        def: "결정 포인트 내에 있는 모든 개별 조건식의 모든 조합을 고려한 커버리지",
      },
    ],
    keywords: ["내부 구조(Internal Structure)", "논리 흐름(Logical Flow)", "코드 커버리지(Code Coverage)", "제어구조", "루프"],
    tables: [
      {
        caption: "화이트박스 테스트 종류",
        headers: ["유형", "설명"],
        rows: [
          ["제어 구조 테스트", "SW 논리적 복잡도 측정\n복잡도 따라 기본 경로 집합 정의"],
          ["루프 테스트", "루프 경계선 발생 경계오류\n단순·중첩·연결·비구조적 루프"],
          ["구문 커버리지", "모든 구문 최소 한번 실행"],
          ["결정 커버리지", "전체 결정문 참·거짓 한번 이상"],
          ["조건 커버리지", "결정문 내 각 조건 참·거짓 수행"],
          ["조건/결정 커버리지", "전체·개별 조건식 참·거짓 한번씩"],
          ["변경조건/결정 커버리지", "개별 조건식 독립적 전체 영향"],
          ["다중조건/결정 커버리지", "결정 포인트 내 모든 조건 조합 고려"],
        ],
      },
      {
        caption: "블랙박스, 그레이박스, 화이트박스 비교",
        headers: ["비교항목", "블랙박스", "그레이박스", "화이트박스"],
        rows: [
          ["테스트 수행 관점", "사용자 관점", "사용자+개발자", "개발자 관점"],
          ["테스트 기준 문서", "요구사항 명세서", "요구+단위 설계", "단위 설계 명세"],
          ["V 모델 위치", "상위 레벨\n(사용 환경)", "하이브리드", "하위 레벨\n(개발 환경)"],
          ["TestCase 설계 유형", "동등분할\n경계값 분석", "통합 테스트", "루프·제어구조"],
          ["결함 여부 기준", "예상 출력값과\n일치 여부", "기존 테스팅에서\n미발견 결함", "설계문서·논리\n구조 일치 여부"],
        ],
      },
    ],
    notes: ["테스트 설계 기법 분류: SW 내부구조 참조여부(블랙/화이트) × 설계근원기준 [명·구·경](명세·구조·경험 기반)"],
  },
  {
    title: "코드 커버리지(Code Coverage)",
    course: "SE",
    definition:
      "전체 소스 코드 중 테스트 케이스가 실행한 코드의 비율(%)을 나타내는 화이트박스 테스트 지표",
    defShort: "소스 코드 중 테스트 케이스가 실행한 코드 비율인 화이트박스 테스트 지표",
    lead:
      "테스트 수행 범위의 정량화, 코드 커버리지",
    features: ["실행 코드 비율", "화이트박스 지표", "강도별 포함 관계"],
    keywords: ["구문(SC)", "결정(DC)", "조건(CC)", "조건(C/DC)", "변경조건(MC/DC)", "다중조건(MCC)", "Test Case"],
    tables: [
      {
        caption: "코드 커버리지 종류 (포함 관계: SC ⊂ DC ⊂ C/DC ⊂ MC/DC ⊂ MCC ⊂ 경로)",
        headers: ["구분", "기술", "설명", "Test Case"],
        rows: [
          ["SC 구문", "Statement", "모든 문장 호출\n참거짓 무관", "TF = F"],
          ["DC 결정", "Decision (Branch)", "모든 분기문 선정\n결과 참거짓 만족", "TT = T\nFF = F"],
          ["CC 조건", "Condition", "분기문 내부 조건\n모든 조건 참거짓\n결과 무관", "TF = F\nFT = F"],
          ["C/DC 조건/결정", "C/DC", "분기문 참거짓\n내부 조건 참거짓", "TT = T\nFF = F"],
          ["MC/DC 변경조건", "Modified C/DC", "개별 조건식\n타 조건식 무관\n전체에 독립 영향", "TF = F\nTT = T\nFF = F"],
          ["MCC 다중조건", "Multi Condition", "모든 경로 검사\n가장 강력\n100% 커버리지", "TT = T\nTF = F\nFT = F\nFF = F"],
        ],
      },
    ],
    notes: ["범위 그림: Statement ⊂ Decision ⊂ Condition/Decision ⊂ MC/DC ⊂ Multiple Condition ⊂ All Path(경로 커버리지)"],
  },
  {
    topicId: "se-160",
    title: "탐색적 테스트",
    course: "SE",
    definition:
      "테스터의 경험과 직관을 활용하여 애플리케이션의 동작을 조사하고 결함을 발견하는 것을 목표로 하는 테스트",
    defShort: "테스터의 경험·직관으로 동작을 조사해 결함 발견을 목표로 하는 테스트",
    lead:
      "휴리스틱 테스트 기법, 탐색적 테스트",
    features: ["경험·직관 기반", "타임박스 세션", "최소 문서화"],
    keywords: ["[세차노요] Heuristic 기반", "Time-boxing", "테스트세션", "테스트 차터", "테스트노트", "요약보고"],
    tables: [
      {
        caption: "구성 요소 (세차노요)",
        headers: ["구성요소", "설명", "특징"],
        rows: [
          ["테스트 세션(Session)", "방해 없는 시간\nTime boxing", "45분 ~ 수 시간"],
          ["세션 차터(Charter)", "세션 목표·비전\n한두 문장 구성", "1세션 당 1차터"],
          ["테스트 노트(Note)", "새로운 아이디어\n최소 내용 기록", "세션 리포트 작성"],
          ["요약 보고(Debrief)", "경험 공유로\n팀 학습·성장", "PROOF 아젠다"],
        ],
      },
      {
        caption: "Debriefing의 PROOF",
        headers: ["항목", "설명"],
        rows: [
          ["Past", "테스트 수행\n내용(What happened during\nthe testing?)"],
          ["Results", "테스트 수행\n성과(What was achieved\nduring the testing?)"],
          ["Outlook", "추가(보충)해야\n할 사항(What still needs to\nbe done?)"],
          ["Obstacles", "개선이 필요한\n요소(What got in the way of\ngood testing?)"],
          ["Feelings", "테스트 중 느낀\n점(How does the tester feel\nabout all this?)"],
        ],
      },
    ],
  },
  {
    title: "경험 기반 테스트",
    course: "SE",
    definition:
      "유사 어플리케이션이나 기술에서의 경험, 직관, 테스터의 기술 능력으로부터 테스트 케이스를 추출하는 기법",
    defShort: "유사 경험과 직관, 테스터 기술 능력으로 테스트 케이스를 추출하는 기법",
    lead:
      "노하우 기반 케이스 추출, 경험 기반 테스트",
    features: ["테스터 역량 의존", "명세 부족 시 유효", "공식 기법 보완"],
    keywords: ["[경탐오체분] 탐색적 테스팅", "오류추정", "체크리스트", "분류 트리"],
    tables: [
      {
        caption: "주요 기법",
        headers: ["유형", "설명", "고려사항"],
        rows: [
          ["탐색적 테스팅", "차터 기반 설계\n수행·기록·학습", "명세 부족 시\nFormal 보충"],
          ["오류추정", "Ad-hoc Testing\n결함 예측 설계\n직관·경험 기반", "마지막 단계 사용"],
          ["체크리스트", "평가 내용·결함\n분류 나열 목록", "공식 테스팅\n보완 용도"],
        ],
      },
      {
        caption: "탐색적 테스팅과 테스트케이스 기반 테스팅 비교",
        headers: ["구분", "탐색적 테스팅", "테스트케이스 기반 테스팅"],
        rows: [
          ["초점", "테스트 실행\n문서화 최소", "설계 향상 집중\n재사용·공유"],
          ["구성 요소", "테스트 차터\n세션 임무 정의", "테스트 계획서\n인력·일정·환경"],
          ["구성 요소", "타임 박싱\n세션당 시간제약", "테스트 케이스\n내용 명세화 문서"],
          ["구성 요소", "테스트 노트\n머릿속 작성 TC", "테스트 시나리오\nTC 흐름 집합"],
          ["구성 요소", "요약보고\n종료 후 간략보고", "테스트 결과서\n단위/통합결과서"],
        ],
      },
    ],
    notes: ["교재 두음: [경탐오체분] — 경험기반 아래 탐색적·오류추정·체크리스트·분류트리"],
  },
  {
    title: "위험 기반 테스트",
    course: "SE",
    definition:
      "위험을 측정하여 우선순위가 높은 부분에 주어진 테스팅 자원을 집중하여 전체적인 영향을 줄이기 위한 테스트 전략",
    defShort: "위험을 측정해 우선순위 높은 부분에 테스팅 자원을 집중하는 테스트 전략",
    lead:
      "위험 우선순위 기반 집중, 위험 기반 테스트",
    features: ["위험 우선순위 집중", "가능성×영향 평가", "한정 자원 배분"],
    keywords: ["테스트 자원 한정", "STA", "STTA", "ITA", "FTA"],
    tables: [
      {
        caption: "위험 기반 테스팅 절차",
        headers: ["절차", "설명"],
        rows: [
          ["위험 식별", "아이템별 위험 각 항목 위험 파악\n테스트 항목 대상 항목 도출"],
          ["위험 분석", "발생 가능성 가능성 수준 평가\n영향도 평가 우선순위 결정"],
          ["위험 대응 계획", "STA STTA 위험 최소화 계획\nITA FTA 영역별 대응 수립"],
          ["Test 계획", "종료 조건 정의 완료 기준 수립\n인력·일정 자원 계획 수립"],
          ["분석/모니터링", "하위 상위 테스트 단계별 수행\n지속적 점검 결과 분석 감시"],
        ],
      },
      {
        caption: "위험 수준에 따른 테스팅 영역 (가능성 × 영향)",
        headers: ["영역", "설명"],
        rows: [
          ["STA (Severe Test Area)", "반드시 테스트\n해야 함 —\n가능성↑ 영향↑"],
          ["STTA (Strong Test Area)", "테스트 해야 함 —\n가능성↓ 영향↑"],
          ["ITA (Intensive Test Area)", "테스트 해야 함 —\n가능성↑ 영향↓"],
          ["FTA (Fundamental Test Area)", "테스트 하지 않을\n수 있음 —\n가능성↓ 영향↓"],
        ],
      },
    ],
    notes: ["사업적 리스크 중심 시 N자형: STA→STTA→ITA→FTA / 기술적 리스크 중심 시 S자형: STA→ITA→STTA→FTA"],
  },
  {
    topicId: "se-163",
    title: "테스트 오라클",
    course: "SE",
    definition:
      "수행된 테스트 결과가 기대했던 결과인지를 판단하거나 분석하는 메커니즘",
    defShort: "수행된 테스트 결과가 기대했던 결과인지 판단하거나 분석하는 메커니즘",
    lead:
      "결과 판정의 채점 기준, 테스트 오라클",
    features: ["기대 결과 판정", "판정 범위 차등", "완전 구현 곤란"],
    keywords: ["[참샘휴일] 참 오라클", "샘플링 오라클", "휴리스틱 오라클", "일관성 검사"],
    tables: [
      {
        caption: "테스트 오라클의 유형 (참샘휴일)",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["완전", "참 오라클(True Oracle)", "모든 입력 검증 전 입력 결과 생성\n오류 미누락 발생 오류 검출"],
          ["부분", "샘플링 오라클(Sampling Oracle)", "특정 몇몇 입력 값만 결과 제공\n특정 값 한정 정확 참값 제공"],
          ["부분", "휴리스틱 오라클(Heuristic Oracle)", "샘플링 단점 개선 일부 값 정확 제공\n나머지 휴리스틱(추정) 처리"],
          ["비교", "일관성 검사 오라클(Consistent Oracle)", "이전·현재 비교 결과 동일성 검증\n회귀 테스트 수정 전후 확인"],
        ],
      },
      {
        caption: "AI시스템이 테스트 오라클 불가능 이유",
        headers: ["이유", "설명"],
        rows: [
          ["시스템 명세", "불완전·비공식 저품질 명세"],
          ["테스트 입력 데이터", "다양한 출처 비구조화 데이터\n개인정보보호규정 지킨 데이터"],
          ["자가학습 시스템", "학습 후 성공 테스트 실행 안 됨"],
          ["확률적, 비결정적", "매번 동일한 결과 얻지 못함"],
          ["복잡성", "심층신경망 연결·매개변수 복잡"],
        ],
      },
      {
        caption: "AI시스템의 블랙박스 테스트 기법",
        headers: ["기법"],
        rows: [
          ["조합테스트(Combination testing)"],
          ["백투백 테스트(Back-to-back testing)"],
          ["A/B testing"],
          ["변성 테스트(Metamorphic testing)"],
          ["탐색적 테스트(Exploratory testing)"],
        ],
      },
    ],
    notes: ["교재 두음: [참샘휴일]"],
  },
  // ── 인공지능(AI) — 심화반 3주차 ──────────────────────────────────
  {
    title: "머신러닝 학습방법",
    course: "AI",
    definition:
      "대량의 데이터를 스스로 학습하고 정리하여 문제에 대한 해답을 찾아내는 기법, 학습된 내용을 기반으로 미래를 예측하기 위한 기법",
    defShort: "대량 데이터를 스스로 학습·정리해 해답을 찾고 미래를 예측하는 기법",
    lead: "정답 유무별 학습 갈래, 머신러닝 학습방법",
    features: ["데이터 자율 학습", "정답 유무 구분", "미래 예측 지향"],
    keywords: ["지도학습", "비지도학습", "준지도학습", "강화학습", "진화학습"],
    tables: [
      {
        caption: "학습방법 유형",
        headers: ["분류", "설명", "알고리즘"],
        rows: [
          ["지도 학습(Supervised Learning)", "정답 있는 데이터\n학습 집합으로\n구분 모델 학습", "Bayesian classification\nDecision tree\nRegression, Neural Network\nhidden Markov model(HMM)"],
          ["비지도 학습(Unsupervised Learning)", "정답 없는 집합\n상호 유사성으로\n유형 구분", "K-Means, EM\nSOM, PCA\nICA"],
          ["준지도 학습(Semi-supervised Learning)", "지도+비지도\n라벨 학습 후\n무라벨 자율학습", "그래프생성모형\nSelf·Co-training\nLabel Propagation"],
          ["강화 학습(Reinforcement Learning)", "환경과 상호작용\n보상 최대 정책\n학습하는 방법", "Monte Carlo, MDP\nValue Function\nQ-Learning, DQN, PPO"],
          ["진화 학습", "진화 모방 탐색", "유전 알고리즘"],
        ],
      },
    ],
    notes: ["구분 축: 정답(Label) 유무 — 지도(있음)·비지도(없음)·준지도(일부), 보상 기반 — 강화, 진화 모방 — 진화"],
  },
  {
    title: "전이학습(Transfer Learning)",
    course: "AI",
    definition:
      "기존의 학습된 모델과 비슷한 유형의 다른 모델로 학습된 결과를 옮겨서 부족한 데이터를 통한 학습이나 훈련 시간을 단축시키는 머신러닝 기법",
    defShort: "다른 모델로 학습된 결과를 옮겨서 훈련 시간을 단축하는 머신러닝 기법",
    lead:
      "학습된 지식의 재활용, 전이학습",
    features: ["학습 결과 이전", "적은 데이터 학습", "유사 과업 전제"],
    keywords: ["미세조정(Fine Tuning)", "과업/도메인 전이", "Inductive/Transductive/Unsupervised"],
    tables: [
      {
        caption: "주요학습 기법 [파프도레]",
        headers: ["기법", ""],
        rows: [
          ["Fine-tuned CNN", "Pre-trained Model"],
          ["Domain Adaptation", "Layer Re-use"],
        ],
      },
      {
        caption: "학습방법 유형 [적태도 레귀변자]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["적용 범위", "과업(Task) 전이", "영상→음성인식, 응용분야 변경\n동결(Freeze): 일부 계층 재사용\n미세조정: 새 구조, 낮은 학습률"],
          ["적용 범위", "도메인(Domain) 전이", "영불→영한 번역, 확률분포 상이\nDaume2009: 3배 확장 분포 맞춤\nSun2016: 화이트닝·컬러링 변환"],
          ["데이터셋 label 여부", "귀납(Inductive)", "도메인 동일, 태스크 상이\n타겟 태스크 미세조정 학습\nMulti-task Learning\nSelf-taught Learning"],
          ["데이터셋 label 여부", "변형(Transductive)", "태스크 동일, 도메인 상이\n소스 도메인 라벨 정보 활용\nDomain Adaptation"],
          ["데이터셋 label 여부", "자율(Unsupervised)", "Unlabeled Data간 학습 진행"],
        ],
      },
    ],
    notes: ["다운스트림 학습 방식: 파인튜닝(가중치 업데이트) 외에 인컨텍스트 러닝 — 제로샷(예시 0개)·원샷(1개)·퓨샷(몇 개), 가중치 업데이트 없음 — 이 있다(파인튜닝과 혼동 금지)", "개념도: Pretrained A의 Hidden layer 1~3을 B에 재사용하되 1~2는 가중치 고정(Freeze), 3~4는 학습(Trainable)하여 A와 비슷한 모델 B 구성", "교재 두음: [파프도레] [적태도 레귀변자]"],
  },
  {
    title: "자기지도학습(Self-supervised Learning)",
    course: "AI",
    definition:
      "데이터에 스스로 레이블을 생성하여 학습하는 지도학습 형태의 비지도학습 (지도학습이 필요한 작업에 비지도 학습 사용)",
    defShort: "데이터에 스스로 레이블을 생성해 학습하는 지도학습 형태의 비지도학습",
    lead:
      "스스로 만드는 레이블, 자기지도학습",
    features: ["스스로 레이블 생성", "지도학습 형태", "소량 레이블 전이"],
    keywords: ["프리텍스트 태스크(pre-text task)", "다운스트림 태스크(downstream task)", "전이학습"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "기법"],
        rows: [
          ["생성 기반", "오토인코더\nGAN\nMAE(Masked Autoencoders)"],
          ["Pre-text Task 기반", "공간적 관계 기반\n시간적 관계 기반"],
          ["대조학습 기반", "SimCLR\nMoCo(Momentum Contrast)"],
        ],
      },
      {
        caption: "학습방법 유형 [프다]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["표현 학습", "프리텍스트 태스크(pre-text task)", "레이블 없는 데이터 대상 작업\n핵심 표현 추출 레이어 학습"],
          ["목표 작업", "다운스트림 태스크(downstream task)", "이미지 분류·물체 인식 최종 작업\n소량 레이블 데이터만으로 수행"],
        ],
      },
      {
        caption: "학습단계 [프다파]",
        headers: ["단계", "설명"],
        rows: [
          ["1) 프리텍스트 태스크 단계", "무라벨 데이터 프리텍스트 학습"],
          ["2) 다운스트림 태스크 단계", "학습된 특징으로 분류기 학습\n적은 레이블 새 데이터 적용"],
          ["3) 파인튜닝 단계", "새 데이터에도 적용 가능 파인튜닝\n사전 학습 가중치 미세 조정"],
        ],
      },
    ],
    notes: ["개념도: Unlabeled Dataset → Pre-text Task (Self-supervised) → Knowledge Transfer → Labeled Dataset → Downstream Task (Supervised)"],
  },
  {
    title: "연합학습(Federated Learning)",
    course: "AI",
    definition:
      "저장 데이터를 직접 공유하지 않는 다수의 로컬 기기와 하나의 중앙 서버가 협력하여 AI 모델을 학습하는 분산형 머신 러닝",
    defShort: "데이터 직접 공유하지 않고 협력하여 AI 모델 학습하는 분산형 머신 러닝",
    lead: "로컬 데이터 비공유 협력, 연합학습",
    features: ["데이터 비공유", "파라미터만 전송", "중앙 서버 취합"],
    keywords: ["전역모델", "지역모델", "FedSGD", "FedAVG"],
    tables: [
      {
        caption: "동작 원리 (전지취갱)",
        headers: ["절차", "설명"],
        rows: [
          ["① 전역(Global) 모델 분배(Broadcast)", "참여자 선정 서버 최적 단말\n작업 정보 전달 각 단말 배포"],
          ["② 지역 모델 갱신(Local Update)", "개인 데이터 로컬 모델 생성"],
          ["③ 지역 모델 취합(Aggregate)", "파라미터 압축 조건 만족 시 전송\n암호화 전달 서버로 취합"],
          ["④ 전역 모델 갱신(Global Update)", "취합값 반영 전역모델 갱신"],
        ],
      },
      {
        caption: "알고리즘",
        headers: ["구분", "알고리즘", "설명"],
        rows: [
          ["단일 갱신", "FedSGD(Federated Stochastic Gradient Descent)", "1회 학습 전달 단말→서버 전송\n평균 후 갱신 수렴까지 반복"],
          ["다회 갱신", "FedAVG(Federated Averaging)", "K회 반복 학습 단말 학습 후 전달\n미니배치 분할 수렴 시간 단축"],
        ],
      },
    ],
    notes: ["교재 두음: [전지취갱] — 전역 분배 · 지역 갱신 · 지역 취합 · 전역 갱신", "데이터는 단말을 떠나지 않고 파라미터만 서버로 — 개인정보 보호가 핵심 가치"],
  },
  {
    title: "머신 언러닝(Machine Unlearning)",
    course: "AI",
    definition:
      "한 번 학습된 머신러닝 모델에서 특정 데이터를 선택적으로 제거하여 해당 데이터를 학습하지 않은 것처럼 하는 기술",
    defShort: "모델의 특정 데이터를 선택적으로 제거해 학습하지 않은 것처럼 하는 기술",
    lead:
      "학습의 선택적 삭제, 머신 언러닝",
    features: ["선택적 데이터 제거", "재학습 불요", "잊혀질 권리 대응"],
    keywords: ["데이터가 모델에 미친 영향 제거", "개인정보 보호", "AI윤리", "재학습", "언러닝 알고리즘", "잊혀질 권리"],
    tables: [
      {
        caption: "언러닝 절차",
        headers: ["핵심", "설명"],
        rows: [
          ["언러닝 대상 정의", "삭제할 데이터 샘플 결정"],
          ["영향도 분석", "데이터가 모델에 미친 영향 추정"],
          ["Impair 단계", "제거 대상 성능 저하 노이즈 주입"],
          ["Repair 단계", "정확도 회복 위해 일반 학습 재적용"],
          ["평가 및 검증", "Forget/Retain accuracy\n언러닝 품질 검증\n리더보드 평가"],
        ],
      },
      {
        caption: "기술 요소와 평가",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["기술 요소", "Error-maximizing Noise", "loss 극대화 노이즈로 영향 제거"],
          ["기술 요소", "Impair & Repair 프레임워크", "손상 후 성능 복구 2단계 접근\n계산 효율·성능 유지 동시 달성"],
          ["기술 요소", "Zero-glance Unlearning", "삭제 데이터 직접 접근 없이 언러닝"],
          ["기술 요소", "SISA", "Sharded(분할)\nIsolated(독립화)\nSliced(슬라이싱)\nAggregated(통합)"],
          ["평가", "효율성", "재학습 대비 알고리즘 속도"],
          ["평가", "모델 효용성", "보존·직교 태스크 성능 저하 여부"],
          ["평가", "망각 품질", "망각 데이터 실제 언러닝 정도"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.08 ITPE FR 1일차 1교시", "법적 배경: 잊혀질 권리(GDPR) — 재학습 없이 특정 데이터의 흔적만 제거하는 것이 핵심"],
  },
  {
    title: "버티컬 AI(Vertical AI)",
    course: "AI",
    definition:
      "특정 산업이나 도메인에 최적화된 데이터를 활용하여 해당 분야의 고유한 문제를 해결하는 인공지능",
    defShort: "최적화된 데이터를 활용해 해당 분야의 고유한 문제를 해결하는 인공지능",
    lead:
      "도메인 특화 인공지능, 버티컬 AI",
    features: ["특정 산업 특화", "파인튜닝 기반", "저비용 경량 모델"],
    keywords: ["범용 데이터", "특화 데이터", "파인 튜닝", "sLLM"],
    tables: [
      {
        caption: "버티컬 AI와 수평적 AI 비교",
        headers: ["항목", "버티컬 AI(Vertical AI)", "수평적 AI(Horizontal AI)"],
        rows: [
          ["학습 데이터", "특화 데이터\n의료·금융", "광범위 비정형\n웹 콘텐츠·뉴스"],
          ["기술 요소", "소형 sLLM\n파인튜닝 특화", "대규모 LLM\n클라우드 AI"],
          ["데이터 품질", "고정확·고신뢰", "일반 비라벨링"],
          ["개발 주체", "스타트업 개발\n중소기업 개발", "대형 테크 기업\n구글·애플 주도"],
          ["학습 방식", "파인튜닝 맞춤형", "대규모 사전학습"],
          ["기능 및 목적", "산업 맞춤 솔루션\n효율성 향상", "범용 서비스 제공\n검색·번역"],
          ["활용 영역", "의료 영상·금융\n제조 공정 최적화", "음성비서·고객\n스마트홈 앱"],
          ["비용 및 인프라", "상대적 저비용\n산업 집중 인프라", "고비용 인프라\n클라우드 대규모"],
          ["확장성", "특정 산업 집중\n확장 제한적", "다양한 도메인\n쉬운 확장 가능"],
        ],
      },
    ],
    notes: ["개념도: 범용 데이터(대규모) →pre-training→ 수평적 AI(Pre-trained Model) →supervised fine-tuning(도메인 특화 데이터·소규모)→ 버티컬 AI(Fine-tuned Model)"],
  },
  {
    title: "Physical AI",
    course: "AI",
    definition:
      "로봇, 자율주행차와 같은 물리적 기기에 탑재되어, 물리적 세계를 인식하고 이해하며 상호작용하는 인공지능",
    defShort: "물리적 기기에 탑재돼 물리적 세계 인식·이해·상호작용하는 인공지능",
    lead: "물리 세계 인식·상호작용, Physical AI",
    features: ["LLM 적용", "물리세계인식", "산업 현장 활용"],
    keywords: ["LWM", "Tokenizer", "디지털트윈", "온디바이스AI", "모델 경량화", "sLLM", "벡터DB", "휴머노이드", "자율주행"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["피지컬AI", "카메라/Lidar", "현실세계 객체 인식 센서 기술"],
          ["피지컬AI", "온디바이스AI", "디바이스 사용 AI 모델·H/W 기술"],
          ["피지컬AI", "모델 경량화 기술", "양자화\n파라미터 가지치기\n증류학습"],
          ["피지컬AI", "sLLM", "파라미터 압축 경량 대형언어모델"],
          ["피지컬AI", "AI칩셋", "AI 학습/예측/제어 전용 칩 기술"],
          ["피지컬AI 개발F/W", "LWM", "Large World Model\n수천조 파라미터 가상세계 모델\n합성데이터 활용 학습 데이터 생성"],
          ["피지컬AI 개발F/W", "Tokenizer", "3D 데이터 압축 저장 토큰화"],
          ["피지컬AI 개발F/W", "디지털 트윈", "현실 세계와 동일한 가상 세계 구현"],
          ["피지컬AI 개발F/W", "메타버스", "3D 가상"],
          ["피지컬AI 개발F/W", "AI 가속기", "빠른 AI 학습 가속기"],
          ["DB", "벡터DB", "대용량 데이터 벡터 형태 저장"],
          ["서비스", "자율주행차", "피지컬 AI 형태 자율주행차 서비스"],
          ["서비스", "휴머노이드 로봇", "피지컬 AI 형태 휴머노이드 서비스"],
        ],
      },
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["모델", "LLM 적용", "디바이스 LLM 자연어 의사소통"],
          ["인식", "물리세계인식", "현실 환경 인식 물리 세계 이해"],
          ["활용", "산업 현장 활용", "자율주행·로봇 AI 시스템 운영\n병원·공장 산업 현장 지원"],
        ],
      },
      {
        caption: "피지컬 AI 패러다임 변화",
        headers: ["단계", "설명"],
        rows: [
          ["지각 AI(Perception AI)", "기초 지능"],
          ["생성 AI(Generative AI)", "새로운 데이터\n생성"],
          ["에이전트 AI(Agentic AI)", "작업수행 자율AI"],
          ["피지컬 AI(Physical AI)", "지각+생성+에이전트\n통합 물리작업\n수행"],
        ],
      },
      {
        caption: "엔비디아 개발 솔루션 (피지컬 AI 개발 솔루션)",
        headers: ["단계", "역할"],
        rows: [
          ["코스모스(COSMOS)", "현실 객체 인식,\n물리세계 이해"],
          ["옴니버스(Omniverse)", "가상 공간 생성"],
          ["DGX", "가상 공간 학습"],
          ["AGX", "자율주행용 개발\n플랫폼"],
        ],
      },
    ],
    notes: [
      "메커니즘 3단계 — 인지 단계: 데이터 수집(센서·멀티모달 데이터) → 데이터 저장(데이터센터·클라우드) / 판단 단계: AI 모델(LLM·VLM·시뮬레이션·디지털 트윈) / 실행 단계: AI모델 실세계 구현(액추에이터·로봇 활용). 실행 결과 및 환경 변화 데이터가 다시 축적되어 순환한다.",
      "개념도: 3D 대규모 데이터 →학습→ LWM →3D 가상 공간 생성→ 디지털트윈·메타버스 →공간 압축→ Tokenizer →학습→ Physical AI 모델 →모델 배포→ 카메라/Lidar + Physical AI 모델 + Physical H/W →서비스 제공→ 자율주행 차량·휴머노이드·제조 로봇.",
    ]
  },
  {
    title: "VLA(Vision-Language-Action) 모델",
    course: "AI",
    definition:
      "**시각 정보, 자연어 명령, 물리적 행동을 통합한 AI 모델**로, 로봇이나 자율주행차에 **'보고-이해하고-행동하는' 능력을 부여**하는 피지컬 AI의 핵심 기술",
    defShort: "시각 정보, 자연어 명령, 물리적 행동을 통합한 피지컬 AI의 핵심 모델",
    lead: "보고-이해하고-행동하는 피지컬 AI 핵심 기술, VLA 모델",
    features: ["멀티모달 통합", "행동 토큰 생성", "폐루프 자가 교정"],
    keywords: ["폐루프", "파운데이션 모델", "VLA 정책(인지, 행동)", "텍스트 토큰", "비전 토큰", "행동 토큰", "피지컬AI"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["입력 데이터", "다중 모달 데이터\n사용자 명령\n센서 데이터", "실시간 시각 정보\n인간 자연어 지시\n물리적 상태 정보"],
          ["VLA 핵심 모델", "VLM Backbone\nFusion Module\nTask Planner\n동작 생성 헤드", "사전학습 VLM\n감각 정보 결합부\n행동 순서 추론\n구체 제어값 출력"],
          ["출력 및 피드백", "Action Tokenizer\nController\n폐루프 피드백", "State·Action 토큰\n전기신호 변환\n상태 실시간 반영"],
        ],
      },
      {
        caption: "작동원리",
        headers: ["구분", "작동 원리", "핵심 기술"],
        rows: [
          ["입력 및 통합", "멀티모달 언어화", "ViT\n(Vision Transformer)"],
          ["맥락 추론", "상호 참조 이해", "Cross-modal Attention\n(교차 어텐션)"],
          ["행동 예측", "자기회귀 예측", "Autoregressive Decoder\n(자기회귀디코더)"],
          ["물리적 실행", "물리신호로 변환", "Low-level Controller\n(하위 제어기)"],
          ["실시간 자가 교정", "폐루프 환경 적응", "Closed-loop Feedback\n(폐루프 시스템)"],
        ],
      },
    ],
    notes: [
      "개념도: Text Tokens·Vision Tokens·Action Tokens → Enc → VLA → Dec → Action Chunk. 학습 손실 — (a) Image-Based Self-Supervised Learning(DINOv2, DINO Loss) (b) Language-Image Contrastive Learning(SigLIP, SigLIP Loss). Precise Env. Und. / Task-Relevant Und. / Policy Prior 관점에서 강점이 다르다.",
      "VLA 적용 구조 예시: 입력(멀티모달 데이터 — 카메라 피드·센서 데이터, 사용자 명령 '파란색 컵을 잡아서 올려줘') → VLA 핵심 모델(시각 인코더·언어 인코더 → 멀티모델 백본 → 동작 토큰화 → 동작 생성 헤드) → 출력(동작 토큰 시퀀스 A_001, A_045… → 제어) → 폐루프 피드백(상태 업데이트)으로 다시 입력.",
      "구성요소 원문: 입력 데이터 — 다중 모달 데이터(카메라를 통해 실시간으로 들어오는 시각 정보)·사용자 명령(인간의 자연어 지시)·센서 데이터(로봇의 위치, 관절 각도 등 물리적인 상태 정보) / VLA 핵심 모델 — VLM Backbone(대규모 시각-언어 데이터로 사전 학습된 모델)·Fusion Module(여러 감각 정보를 섞는 중앙 신경망의 결합부)·Task Planner(상황 판단해 행동 순서를 배열하는 추론 엔진)·동작 생성 헤드(로봇이 실행할 구체적인 제어 값을 출력) / 출력 및 피드백 — Action Tokenizer(AI 모델의 데이터를 의미 있는 단위로 생성, State Token·Action Token으로 변환)·Controller(전기적 신호(전압, 전류, 관절 각도 값) 최종 변환)·폐루프 피드백(로봇의 상태 실시간으로 전달해 다음 행동에 반영).",
    ],
  },
  {
    title: "월드 파운데이션 모델(World Foundation Model)",
    course: "AI",
    definition:
      "단순히 텍스트나 이미지를 생성하는 것을 넘어, **현실 세계의 물리적 법칙, 인과 관계, 시공간적 역동성을 이해**하고 **시뮬레이션할 수 있는 기초 모델**(Foundation Model)",
    defShort: "현실 세계 물리적 법칙·인과 관계·시공간적 역동성을 이해한 기초 모델",
    lead: "현실 세계를 시뮬레이션하는 기초 모델, 월드 파운데이션 모델",
    features: ["물리 법칙 인지", "시공간 모델링", "방대한 연산량"],
    keywords: ["시공간 모델링", "물리 법칙 인지", "인과관계 인지", "피지컬 AI"],
    tables: [
      {
        caption: "LLM과 비교",
        headers: ["비교항목", "기존 LLM", "월드 파운데이션 모델"],
        rows: [
          ["핵심 개념", "언어 기반 지능", "물리 기반 지능"],
          ["학습 데이터", "주로 텍스트\n웹 문서·도서\n코드·대화문", "멀티모달 데이터\n텍스트+비디오\n물리 시뮬레이션\n센서+행동 로그"],
          ["이해 범위", "문맥·논리 추론\n문법·개념 정의", "중력·인과관계\n시공간 변화 예측"],
          ["세계관(Grounding)", "기호·단어 사이\n확률적 관계 학습", "실제 물리 환경\n작용·반작용"],
          ["활용 예시", "글쓰기·요약\n번역·챗봇\n프로그래밍", "로봇·자율주행\n도시 시뮬레이션\n기후 변화 예측"],
          ["주요 한계/특징", "물리 감각 없음\nHallucination 발생", "방대한 연산량\n시뮬레이션 환경"],
        ],
      },
      {
        caption: "동작 메커니즘",
        headers: ["계층", "설명"],
        rows: [
          ["Perception Layer(Vision/Sensor)", "환경 데이터 수집"],
          ["Reasoning Layer(VLM)", "상황 인지·추론"],
          ["World Model(Environment Simulation)", "환경 시뮬레이션\n미래 예측"],
          ["Planning Layer(RL/MPC)", "최적 행동 계획"],
          ["Action Layer(VLA)", "제어 정책 생성"],
          ["Robot Control", "액추에이터 구동"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["계층", "구성요소"],
        rows: [
          ["인지\nPerception", "Vision/Sensor Fusion\n데이터 큐레이션\n시각적 토큰화"],
          ["추론\nReasoning", "VLM\n동역학 엔진"],
          ["World Model", "Dynamics Simulator"],
          ["계획\nPlanning", "RL / MPC\n모델예측제어"],
          ["행동\nAction", "VLA (Vision-Lang-Action)"],
          ["제어\nControl", "Actuator Control"],
        ],
      },
    ],
    notes: [
      "개념도: 고성능 AI, 초적응 대응, 최적 행동을 위해 월드 모델 기반 학습 — 월드 모델(월드 생성 + 월드 동작, 특화 도메인 지식·특화 물리 기반 동작) ↔학습↔ 피지컬 AI 모델(로봇의 인식-추론-행동, 특화 로봇·작업 세트) → AI 모델 온보딩(로봇). 아래층은 월드 파운데이션 모델(일반 도메인·일반 물리 기반 월드·시나리오 생성 → 월드 생성·시나리오 생성)과 피지컬 AI 파운데이션 모델(범용 로봇·범용 작업 → 특화 AI 모델·특화 행동 학습).",
      "동작 메커니즘 원문: Perception Layer(Vision/Sensor) 물리적 환경 데이터 수집 → Reasoning Layer(VLM) 멀티모달 기반 상황 인지 및 추론 → World Model(Environment Simulation) 내부 환경 시뮬레이션 및 미래 예측 → Planning Layer(RL/MPC) 예측 기반 최적 행동 계획 → Action Layer(VLA) 로봇 제어 정책 생성 → Robot Control 실제 물리적 모터/액추에이터 구동. 구성요소의 인지 계층은 Vision/Sensor Fusion·멀티모델 데이터 큐레이션·시각적 토큰화, 추론 계층은 VLM(Vision-Language Model)·동역학 엔진. LLM 한계는 현실 세계의 물리적 감각이 없음(Hallucination 발생 가능), 월드 파운데이션 모델은 방대한 연산량과 고차원적 시뮬레이션 환경 필요.",
    ],
  },
  {
    title: "온디바이스 AI",
    course: "AI",
    definition:
      "클라우드 서버가 아닌 단말 기기 내부에서 인공지능(AI) 모델의 추론(inference) 및 연산이 이루어지는 기술",
    defShort: "클라우드 아닌 단말 기기 내부에서 AI 모델 추론·연산이 이뤄지는 기술",
    lead:
      "단말 내부의 AI 연산, 온디바이스 AI",
    features: ["단말 내 추론", "클라우드 비의존", "자원 제약 존재"],
    keywords: ["레이턴시 지연", "보안", "모델 성능 제한", "모델 경량화", "전력 관리", "자원 제약", "하이브리드 AI"],
    tables: [
      {
        caption: "한계점 (레이턴시 & 비용)",
        headers: ["구분", "한계점", "설명"],
        rows: [
          ["클라우드 AI 한계점", "네트워크 지연(레이턴시)", "요청 왕복으로 지연 발생\n온디바이스는 지연 거의 없음"],
          ["클라우드 AI 한계점", "운영 비용 폭증", "LLM 운영 전력·장비 비용 매우 높음"],
          ["클라우드 AI 한계점", "보안·개인정보 보호 제한", "외부 전송으로 데이터 유출 위험\n민감 데이터는 업로드 제한"],
          ["클라우드 AI 한계점", "인터넷 의존성과 오프라인 한계", "오프라인 작동 불가\n네트워크 불안정 시 기능 제한"],
          ["온디바이스 AI 한계점", "모델 성능 제한", "경량화 필수\nLLM 수준 종합적 작업 어려움"],
          ["온디바이스 AI 한계점", "하드웨어 한계", "연산·메모리·전력 제약 큼\n모델 크기·성능 제한 존재"],
          ["온디바이스 AI 한계점", "업데이트 복잡성", "수많은 기기 개별 배포\n업데이트·일관성 유지 힘듦"],
          ["온디바이스 AI 한계점", "확장성 부족", "리소스 확장 어려움\n다양한 작업 동시 처리 어려움"],
        ],
      },
      {
        caption: "성능 최적화 및 전력관리 기술",
        headers: ["분류", "기법"],
        rows: [
          ["연산 최적화", "양자화\n프루닝\n저랭크 분해"],
          ["전력 관리", "DVFS\n배치 크기조정"],
          ["발열 관리", "점진적 조정\n작업 분산"],
        ],
      },
      {
        caption: "모델 실행을 위한 기술 스택",
        headers: ["스택", "핵심 기술", "설명"],
        rows: [
          ["하드웨어", "NPU", "딥러닝 연산 특화 전용 프로세서\n저전력·고효율 엣지 실시간 추론"],
          ["하드웨어", "GPU", "병렬 연산 강점 범용 연산 장치\nCNN·Transformer 행렬 연산 가속"],
          ["하드웨어", "DSP", "음성·영상·센서 신호 처리\n아날로그-디지털 변환 최적화"],
          ["런타임", "TensorFlow Lite", "구글 경량 딥러닝 프레임워크"],
          ["런타임", "PyTorch Mobile", "PyTorch 모델 모바일 경량 런타임"],
          ["런타임", "ONNX Runtime Mobile", "ONNX 포맷 모델 실행 범용 런타임"],
          ["하드웨어 추상화 계층(HAL)", "NNAPI", "Android OS AI 연산 인터페이스\nNPU·GPU·DSP 가속기 자동 매핑"],
          ["하드웨어 추상화 계층(HAL)", "Qualcomm SNPE", "Snapdragon 칩셋 추론 최적화 엔진"],
          ["하드웨어 추상화 계층(HAL)", "ARM NN", "ARM SoC 신경망 추론 라이브러리"],
          ["경량화 기술", "MobileNet 계열", "구글 제안 모바일·엣지용 경량 CNN"],
          ["경량화 기술", "EfficientNet", "신경망 구조 탐색(NAS) 기반 모델\n파라미터 대비 성능 최적화"],
          ["경량화 기술", "TinyML 모델", "센서·IoT·MCU 극저전력 추론"],
          ["어플리케이션", "ML Kit (Google)", "Google 제공 온디바이스 AI SDK"],
          ["어플리케이션", "Vision F/W (Apple)", "iOS/macOS 온디바이스 비전 처리"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.10 ITPE 모의고사 3교시"],
  },
  {
    title: "멀티모달(Multimodal) AI",
    course: "AI",
    definition:
      "이미지, 텍스트, 음성, 비디오 등 다양한 모달리티(Modality)를 동시에 받아들이고 사고하는 AI 모델",
    defShort: "이미지·텍스트 등 모달리티를 동시에 받아들이고 사고하는 AI 모델",
    lead:
      "여러 감각의 통합 지능, 멀티모달 AI",
    features: ["모달리티 동시 수용", "감각 기관 모방", "넓은 범위 결과"],
    keywords: ["모달리티", "다양한 감각 기관", "지식/언어지능", "음성/청각", "이미지/시각", "추론/기계학습"],
    tables: [
      {
        caption: "요소기술",
        headers: ["처리기술", "요소기술", "설명"],
        rows: [
          ["지식/언어지능", "NLP, NLU, NLG\nWord Embedding, Seq2Seq", "단어 분리, 유형 라벨링\n키워드 검색, 유의어, 반의어\n정보 분석 및 추출, 관계 추출\n일반언어 이해"],
          ["음성/청각", "STT(Speech-To-Text)\nSignal Processing", "언어 모델\n음성 머신러닝 모델 구축\nhot word 자동 인식\n노이즈 필터링"],
          ["이미지/시각", "Image Scaling\nFiltering, Morphology", "세분화, 이미지 이해\n얼굴 인식, 연령 및 성별 인식\n글자 인식, 이미지 기반 검색\n이미지 기반 예측 분석"],
          ["추론/기계학습", "회귀분석·시계열분석\n클러스터링·연관분석", "빅데이터 수집 및 처리\nKPI 예측\n빅데이터 기반 예측 분석\n머신러닝 위한 자동 데이터 생성"],
        ],
      },
    ],
    notes: ["모델 구조: Unimodal AI(단일 입력 → 제한된 출력) vs Multimodal AI(이미지+영상+문서 동시 입력 → 더 넓은 범위의 결과)"],
  },
  {
    title: "옴니모달(Omni-modal) AI",
    course: "AI",
    definition:
      "텍스트, 이미지, 음성, 영상, 행동(Action) 등 **모든 모달리티를 하나의 모델에서 통합 학습**하고 이해·생성하는 범용 인공지능",
    defShort: "모든 모달리티를 하나의 모델에서 통합 학습, 이해·생성 범용 인공지능",
    lead: "모든 모달리티를 하나의 모델로, 옴니모달 AI",
    features: ["단일 모델 통합", "공유 잠재공간", "Any-to-Any 생성"],
    keywords: ["토큰화", "공유 잠재공간", "통합 추론", "인터리브", "피지컬 AI"],
    tables: [
      {
        caption: "등장배경",
        headers: ["구분", "내용"],
        rows: [
          ["LLM 한계", "텍스트 중심 처리"],
          ["멀티모달", "모달별 개별 처리"],
          ["실시간 AI", "음성·영상 동시"],
          ["Physical AI", "로봇·자율주행"],
        ],
      },
      {
        caption: "옴니모달 AI 동작 메커니즘",
        headers: ["단계", "주요 기능", "핵심기술"],
        rows: [
          ["입력", "텍스트·이미지\n음성 수집", "Multi-modal Input"],
          ["토큰화", "공통 토큰 변환", "BPE, ViT, Whisper"],
          ["통합", "잠재공간 정렬", "Shared Latent Space"],
          ["추론", "통합 Transformer 처리", "Unified-IO2"],
          ["생성", "텍스트·영상·음성\n출력", "Interleaved Generation"],
        ],
      },
      {
        caption: "옴니모달 AI 활용 사례",
        headers: ["분야", "활용기술", "활용내용"],
        rows: [
          ["피지컬 AI", "로봇, 자율주행", "시각·음성·행동\n통합 인식\n실시간 의사결정"],
          ["제조·물류", "스마트팩토리\n디지털트윈", "영상·음성·센서\n통합 분석\n생산·물류\n최적화"],
          ["헬스케어", "의료 AI", "의료영상·음성\n생체신호 통합\n진단·치료 지원"],
          ["AI Agent", "개인비서\n업무자동화", "텍스트·음성\n영상 기반\n실시간 대화\n작업 수행"],
          ["XR·메타버스", "AR/VR\n공간컴퓨팅", "행동·공간 정보\n통합해 몰입형\n서비스 제공"],
        ],
      },
    ],
    notes: [
      "절차도: 입력(모달리티: 텍스트·이미지·음성·영상·행동(Action)) → 핵심 기술 흐름 1. 토큰화(Tokenization: 모든 모달리티를 공통 토큰으로 변환) → 2. 공유 잠재공간(Shared Latent Space: 모든 토큰을 하나의 공간에 정렬(Alignment), 의미적 유사성을 반영한 공통 표현) → 3. 통합 추론(Transformer: 단일 Transformer 모델로 모든 토큰을 통합 처리, 이산 흐름 매칭 기반 통합 학습) → 4. 인터리브(Interleaved: 텍스트·이미지·음성·행동 토큰을 자유롭게 혼합, 자유로운 순서로 입력/출력 시퀀스 구성) → 출력(Any-to-Any: 텍스트 생성·이미지 생성·음성 생성·행동(Action) 생성). 모든 모달리티를 하나의 모델에서 통합 학습·추론하여 원하는 형태로 생성하는 범용 AI.",
      "원문: 등장배경 — LLM 한계(텍스트 중심 처리), 멀티모달(모달별 개별 처리), 실시간 AI(음성·영상 동시 이해), Physical AI(로봇·자율주행 확대). 동작 메커니즘 — 입력(텍스트·이미지·음성 수집, Multi-modal Input) → 토큰화(공통 토큰 변환, BPE·ViT·Whisper) → 통합(공유 잠재공간 정렬, Shared Latent Space) → 추론(통합 Transformer 처리, Unified-IO2) → 생성(텍스트·영상·음성 출력, Interleaved Generation). 활용 — 피지컬 AI(로봇·자율주행: 시각·음성·행동을 통합 인식하여 실시간 의사결정 및 제어), 제조·물류(스마트팩토리·디지털트윈: 영상·음성·센서 데이터를 통합 분석하여 생산 및 물류 최적화), 헬스케어(의료 AI: 의료영상·생체신호·음성을 통합 분석하여 진단 및 치료 지원), AI Agent(개인비서·업무자동화: 텍스트·음성·영상 기반의 실시간 대화 및 작업 수행), XR·메타버스(AR/VR·공간컴퓨팅: 사용자 행동과 공간 정보를 통합하여 몰입형 서비스 제공). 다양한 모달리티를 동시에 이해·생성하여 Physical AI와 지능형 서비스 구현을 지원.",
    ],
  },
  {
    title: "정서 인공지능(Affective AI)",
    course: "AI",
    definition:
      "인공지능과 감성지능의 결합으로 AI가 스스로 감정을 가져 자신과 타인의 감정을 구별 및 새로운 사고와 행동을 결정하며 감정을 공유하는 인공지능 기술",
    defShort: "인공지능과 감성지능 결합으로 감정을 구별하고 공유하는 인공지능 기술",
    lead:
      "감정을 다루는 인공지능, AEI",
    features: ["멀티모달 감성 인식", "감정 구별·공유", "감성 기반 행동 결정"],
    keywords: ["AI + 감성", "감성인식", "감성생성", "감성증강 기술"],
    tables: [
      {
        caption: "기술구성",
        headers: ["기술구성", "기술요소", "설명"],
        nameCol: 1,
        rows: [
          ["감성 인식기술", "생리신호 기반 인식 기술", "외부 자극 생리적 반응 분석\n심혈관계(ECG/PGG)\n피부(GSR/SKT)\n중추신경계(EEG)"],
          ["감성 인식기술", "행태반응/멀티모달 기반 인식 기술", "감성 자극 행동적 특성 분석\n얼굴(PCA/LDA/ASM)\n제스처/음성(MFCC/HMM/GMM)"],
          ["감성 생성기술", "감성 엔진 기반 반응 생성 기술", "외부 자극 특정 패턴 감성 반응 생성\n의사결정트리, 3D 감성 모델"],
          ["감성 생성기술", "감성 합성 기반 표현 기술", "기계와의 감정 합성 감성 인터랙션\nTTS, 멀티모달 UI, Display 소자\nBCI, 해부학적 모델링"],
          ["감성 증강기술", "감성 유형 기반 평가 기술", "감성 군집화 통한 감성 유형 정의\nOCC 감성 평가 모델"],
          ["감성 증강기술", "감성 모델링 기반 추론 기술", "이벤트 감성 유발 상황 도출\n새로운 감성 증강\n감성 추론기"],
        ],
      },
      {
        caption: "적용가능 분야",
        headers: ["구분", "분야", "설명"],
        rows: [
          ["이동", "AEI 자동차", "생체·감정 학습 운전자 상태 파악\n맞춤 환경 음악·온도 조명"],
          ["서비스", "로봇", "감성 로봇 진화 감정 모방 잠재력"],
          ["의료", "헬스케어", "감정 상태 진단 우울증 등 분석\n치료 앱 개발 다양 지역 상용화"],
        ],
      },
    ],
    notes: ["개념도 흐름: 감성 인식(생리 신호·형태 반응) →즉각/자동 반응→ 감성 생성(감성 반응 생성·감성 합성) →사고/행동 결정→ 감성 증강(감성 기획·감성 추리/추론)"],
  },
  {
    title: "활성화함수(Activation Function)",
    course: "AI",
    definition:
      "인공신경망에서 현재 레이어(Layer)의 입력 신호와 가중치의 총합을 비선형적 출력 신호로 변환하여 활성화 여부를 결정하는 함수",
    defShort: "입력 신호와 가중치 총합을 비선형 출력으로 변환해 활성화 여부 결정 함수",
    lead:
      "신경망의 비선형 변환, 활성화함수",
    features: ["비선형 변환", "활성화 여부 결정", "기울기 소실 위험"],
    keywords: ["출력 신호 변환", "활성화 여부 결정"],
    tables: [
      {
        caption: "문제점",
        headers: ["문제점", "설명", "해결"],
        rows: [
          ["0.5 문제", "입력 0일 때 0.5\n임계값 설정 문제", "ReLU, Leaky ReLU\nTanh"],
          ["기울기 소실", "출력 0·1 수렴\n기울기 0 수렴", "ReLU, Leaky ReLU\nTanh"],
        ],
      },
      {
        caption: "단극성 함수 (단시레)",
        headers: ["구분", "활성화 함수", "설명"],
        rows: [
          ["확률 출력", "Sigmoid Function", "0~1 사이 값 출력, 평균 0.5\n장점) 이진 분류 출력계층 활용\n단점) 경사 기울기 소실 문제"],
          ["선형 정류", "ReLU", "음수 0 출력, 양수 그대로 출력\n깊은 신경망(DNN) 가능\n장점) 기울기 소실 방지, 빠른 속도\n단점) 음수에서 기울기 0"],
        ],
      },
      {
        caption: "양극성 함수 (양탄리프)",
        headers: ["구분", "활성화 함수", "설명"],
        rows: [
          ["쌍곡 함수", "Tanh", "-1~1 사이 값 출력, 평균 0\n장점) 시그모이드보다 성능 좋음\n단점) 경사 기울기 소실 문제"],
          ["ReLU 변형", "Leaky ReLU", "x에 0.01 같은 작은 값 곱함\nReLU 음수 기울기 문제 해결\n장점) 음수일 때 학습 더 잘됨"],
          ["ReLU 변형", "PReLU", "음수 영역 기울기 학습 가능\n장점) 기울기 조절 가능\n단점) 계산량 증가"],
        ],
      },
    ],
  },
  {
    title: "손실함수(Loss Function)",
    course: "AI",
    definition:
      "신경망의 최적 가중치를 찾기 위해 실제 값과 신경망의 예측 값의 차이를 수치화(오차계산)해주는 함수",
    defShort: "최적 가중치를 찾기 위해 실제 값과 신경망 예측 값의 차이를 수치화한 함수",
    lead: "예측 오차의 수치화 척도, 손실함수",
    features: ["오차 수치화", "가중치 갱신 기준", "문제 유형별 선택"],
    keywords: ["오차 계산", "MSE", "RMSE", "MAE", "BCE", "CCE", "SCCE"],
    tables: [
      {
        caption: "유형",
        headers: ["구분", "유형", "활성화함수"],
        rows: [
          ["회귀모델", "MSE, RMSE, MAE", ""],
          ["이진분류모델", "BCE", "시그모이드"],
          ["다중분류모델", "CCE, SCCE", "소프트맥스"],
        ],
      },
      {
        caption: "유형 상세",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["회귀", "Mean Squared Error(MSE)", "연속값 회귀 평균 차이 손실\n제곱 오차 큰 오차 명확화"],
          ["회귀", "Root Mean Squared Error(RMSE)", "MSE 제곱근 값 왜곡 감소"],
          ["회귀", "Mean Absolute Error(MAE)", "MSE 동일 회귀 에러 절대값 평균"],
          ["분류", "Binary Crossentropy(BCE)", "이진 분류 0·1 이진 분류기 훈련\n일치 시 0 수렴 불일치 무한대"],
          ["분류", "Categorical Crossentropy(CCE)", "다중 클래스 확률 소속 확률 예측\n원핫 인코딩 이진형 라벨 제공"],
          ["분류", "Sparse Categorical Crossentropy(SCCE)", "CCE 동일 다중 클래스 2개 이상\n정수 라벨 원핫 불필요"],
        ],
      },
    ],
    notes: ["개념도: 예측값 ↔ 실제값(레이블) 차이 → 손실함수 → 옵티마이저(역전파 과정)로 가중치 업데이트",
      "R² 는 손실함수가 아니라 회귀 모델의 설명력을 보는 평가지표다 — 0~1 사이로, 1에 가까울수록 예측이 실제를 잘 설명한다. 학습을 이끄는 값은 MSE·RMSE·MAE 다."],
  },
  {
    title: "머신러닝 옵티마이저(Optimizer)",
    course: "AI",
    definition:
      "손실함수의 최소값을 찾기 위해 신경망의 가중치를 갱신하여 신경망 모델을 최적화하는 알고리즘",
    defShort: "손실함수 최소값을 찾도록 가중치를 갱신해 신경망 모델 최적화 알고리즘",
    lead:
      "가중치 갱신의 전략, 머신러닝 옵티마이저",
    features: ["경사하강법 기반", "손실 최소화 탐색", "적응적 학습률"],
    keywords: ["가중치 갱신", "에포크", "러닝레이트", "경사하강법", "SGD", "Momentum", "NAG", "AdaGrad", "RMSProp", "AdaDelta", "Adam"],
    tables: [
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["방향 조정", "Stochastic Gradient Descent(SGD)", "학습률 경사 하강 경사 따라 갱신\n지역 최소점 오버슈팅 문제"],
          ["방향 조정", "Momentum", "SGD 관성 적용 지역 최소점 해결\n이동거리 활용 파라미터 갱신"],
          ["방향 조정", "NAG", "이동 지점 기울기 관성 이점 유지\n효과적 제동 오버슈팅 해결"],
          ["크기 조정", "AdaGrad", "파라미터별 기준 개별 기준 갱신\n적응적 변화 거리 따라 변화량"],
          ["크기 조정", "RMSProp", "AdaGrad 문제점 개선\n지수이동평균 최소 스텝 유지"],
          ["크기 조정", "AdaDelta", "AdaGrad 개선 제안 기법\nRMSProp 학습률 미사용"],
          ["방향·크기", "Adam", "RMSProp 기울기 제곱 평균\n관성 결합 스텝 변화량 조절"],
        ],
      },
    ],
    notes: ["개념도: 입력값→가중치→예측값→손실함수(실제값과 비교)→오차→옵티마이저가 역전파로 가중치 갱신", "계보: SGD → (관성) Momentum → NAG / (개별 학습률) AdaGrad → RMSProp·AdaDelta → 합체 Adam"],
  },
  {
    title: "기울기 소실과 기울기 폭주",
    course: "AI",
    definition:
      "기울기 소실: 깊은 인공 신경망 학습 시, 역전파 과정에서 기울기가 점차 작아져 가중치가 업데이트 되지 않는 현상 / 기울기 폭주: 역전파 과정에서 기울기가 점차 커져 가중치들이 비정상적인 큰 값으로 발산하는 현상",
    defShort: "역전파 시 기울기가 작아져 가중치 업데이트 안 되거나 커져 발산하는 현상",
    lead:
      "심층 학습의 두 실패 현상, 기울기 소실과 폭주",
    features: ["역전파 과정 발생", "활성화 함수 기인", "가중치 정지·발산"],
    keywords: ["ReLU", "Leaky ReLU", "Gradient Clipping"],
    tables: [
      {
        caption: "발생원인",
        headers: ["분류", "구분", "설명"],
        rows: [
          ["활성화 함수 측면", "시그모이드(Sigmoid)", "(소실) 출력값 0 또는 1에 수렴\n(폭주) 임계값 넘은 기울기 발산"],
          ["가중치 측면", "가중치 영향", "역전파 과정 중 가중치 폭주\n훈련 모델 부적합 가중치 사용"],
        ],
      },
      {
        caption: "해결방안",
        headers: ["분류", "구분", "설명"],
        rows: [
          ["활성화 함수 측면", "ReLU·ReLU 변형", "은닉층 시그모이드 함수 사용 지양\n기울기 수렴·발산 방지 ReLU 변형"],
          ["가중치 측면", "Gradient Clipping", "임계값 넘지 않도록 기울기 자름"],
          ["가중치 측면", "가중치 초기화", "훈련 모델 적합 가중치로 초기화\nXavier: 층 간 기울기 분산 균형\nHe: Xavier ReLU 부적합성 극복"],
          ["가중치 측면", "배치 정규화", "각 층 입력 평균·분산 정규화"],
        ],
      },
    ],
  },
  {
    title: "오류 역전파(Backpropagation)",
    course: "AI",
    definition:
      "신경망에서 최적의 결과를 유도하기 위하여 계산된 예측 값과 실제 값과의 차이인 오류(Error)를 신경망의 각 노드에 역방향으로 전파하여 각 노드의 가중치를 업데이트하여 최적화하는 기법",
    defShort: "예측·실제 값 차이를 역방향 전파해 각 노드 가중치를 업데이트하는 기법",
    lead: "오차 역방향의 가중치 갱신, 오류 역전파",
    features: ["오차 역방향 전파", "연쇄 법칙 미분", "경사하강 갱신"],
    keywords: ["오차(오류)", "Chain Rule", "Delta Rule", "경사하강법", "가중치 업데이트"],
    tables: [
      {
        caption: "역전파 절차",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["오차 계산 및 역전파", "출력값과 실제값\n간 오차계산", "출력층 출력값\n실제값 차이"],
          ["오차 계산 및 역전파", "경사하강법 이용", "가중치별 기울기"],
          ["최적화", "가중치 조정", "경사하강법 갱신"],
          ["최적화", "반복", "성능 향상 반복"],
        ],
      },
      {
        caption: "학습 단계",
        headers: ["동작원리", "설명"],
        rows: [
          ["출력층 오차", "현재 출력값과 정답의 차이\nE_total = Σ½(target−output)²\nE_total = E1 + E2"],
          ["은닉층 오차", "출력 오차 가중치 고려 역방향 전파"],
          ["Chain Rule", "∂E/∂W5 = 합성함수 미분의 곱\n∂E/∂o1 × ∂o1/∂z3 × ∂z3/∂W5"],
          ["Delta(δ) Rule", "입력 노드 가중치 오차 비례 조절\nw_ij ← w_ij + α·e_i·x_j\nα: 학습률, e_i: 출력노드 i 오차\nx_j: 입력노드 j의 출력"],
          ["가중치 업데이트(경사하강법 활용)", "경사 하강법 통해 가중치 업데이트\nW5⁺ = W5 − α·∂E/∂W5"],
        ],
      },
    ],
  },
  {
    title: "Dropout",
    course: "AI",
    definition:
      "신경망의 과적합을 방지하기 위해 은닉층의 일부 노드를 무작위로 비활성화 시켜 정규화(성능 일반화)하는 신경망 학습 기법",
    defShort: "과적합 방지 위해 은닉층 일부 노드를 무작위로 비활성화하는 학습 기법",
    lead:
      "무작위 비활성화의 일반화, Dropout",
    features: ["무작위 노드 제거", "동조현상 회피", "앙상블 효과"],
    keywords: ["노드 비활성화", "Overfitting", "co-adaption", "dropout rate"],
    tables: [
      {
        caption: "Dropout 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["노드 마스크", "Fast Dropout", "가우시안 마스크 느린 속도 개선"],
          ["노드 마스크", "Ad-hoc Dropout", "균일 분포 마스크 0~1 구간 추출"],
          ["가중치", "DropConnect", "가중치 비활성화 노드 그대로 유지"],
        ],
      },
      {
        caption: "동작원리",
        headers: ["구분", "동작원리", "설명"],
        rows: [
          ["학습", "Dropout Rate 입력", "입력 수치만큼 노드 제거 랜덤 결정\n0.5 입력 시 50% 확률 비활성화"],
          ["학습", "노드 비활성화", "임의 노드 확률 P 기준 비활성화"],
          ["학습", "신경망 학습", "노드 비활성화 상태에서 학습 수행"],
          ["학습", "오류 역전파", "노드 비활성화 다시 반복 학습"],
          ["테스트", "테스트 수행", "비활성 노드 복원 후 P×W 연산"],
        ],
      },
      {
        caption: "Dropout 효과",
        headers: ["구분", "효과"],
        rows: [
          ["학습측면", "동조현상 회피\n낮은 모델 복잡도\n앙상블 효과"],
          ["과적합 예방", "과적합 해결\nVoting 효과"],
        ],
      },
    ],
  },
  {
    title: "정규화, 규제화, 표준화",
    course: "AI",
    definition:
      "정규화: 머신러닝에서 사용되는 데이터를 일정한 범위로 변환 하여, 특징간의 스케일 차이를 맞추는 기법 / 규제화: 모델의 과적합되는 것을 방지하기 위해, 손실함수에 패널티 항을 추가하는 기법 / 표준화: 머신러닝에서 사용되는 데이터를 평균 0, 표준편차 1을 갖는 표준정규분포로 변환하는 데이터 전처리 기법",
    defShort: "스케일 차이 맞추는 정규화·표준화, 손실함수에 패널티 항 추가 규제화",
    lead:
      "스케일 조정과 과적합 억제, 정규화·규제화·표준화",
    features: ["스케일 영향 방지", "과적합 방지", "평균 0·분산 1"],
    keywords: ["Min-Max 스케일링", "L1(Lasso)", "L2(Ridge)", "Z-score 스케일링"],
    tables: [
      {
        caption: "비교",
        headers: ["구분", "표준화", "정규화", "규제화"],
        rows: [
          ["대상", "입력 데이터", "입력 데이터", "모델 가중치"],
          ["목적", "피처 스케일을\n평균 0·분산 1", "데이터 범위를\n0~1로 압축", "복잡도 제어로\n과적합 방지"],
          ["대표기법", "Z-score 스케일링", "Min-Max 스케일링", "L1(Lasso)\nL2(Ridge)"],
          ["효과", "경사하강 속도↑\n이상치 영향↓", "거리 기반\n알고리즘 성능↑", "모델 일반화\n성능 향상"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "수식", "특징"],
        rows: [
          ["정규화", "x_new =\n(x-x_min) /\n(x_max-x_min)", "스케일 영향 방지\n학습 속도 향상\n이상치에 취약"],
          ["표준화", "x_new =\n(x-μ) / σ\nz ~ N(0,1)", "스케일 영향 방지\n학습 속도 향상\n평균 0·분산 1"],
          ["규제화", "J(w) =\nMSE + λ||w||²", "제약 조건 만족\n에러 최소 지점"],
        ],
      },
    ],
  },
  {
    title: "배치 정규화(Batch Normalization)",
    course: "AI",
    definition:
      "학습 시의 배치를 한 단위로 정규화를 하는 것으로 분포의 평균이 0, 분산이 1이 되도록 정규화하는 작업",
    defShort: "학습 배치 단위로 분포 평균이 0, 분산이 1이 되도록 정규화하는 작업",
    lead:
      "분포 안정화의 학습 가속, 배치 정규화",
    features: ["배치 단위 정규화", "기울기 소실 완화", "자체 규제 효과"],
    keywords: ["기울기 소실문제", "배치정규화 Layer(BN Layer)", "데이터 분포 정규화(평균0, 분산1)"],
    tables: [
      {
        caption: "절차",
        headers: ["수행절차", "수행활동", "설명"],
        rows: [
          ["1. Input 미니배치 평균/분산 계산", "feature 분류\n배치단위 분리", "feature별 평균·표준편차 적용\nmini-batch 단위 데이터 로드"],
          ["2. BN층 활성화값/출력값 정규화", "Modify\n활성함수", "Input값 Modify 활성함수로 전달\n정규화 후 새 값 적용 활성함수 산출"],
          ["3. 활성함수 은닉층 적용", "변환 Scale/Shift\n입력분포 확인", "변환된 Scale/Shift 값 기반 수행\n가중치 이상유무 판단"],
          ["4. Output 확인", "재수행 여부\n개선판단", "반복여부 결정\n알고리즘 개선점 판단/전달"],
        ],
      },
      {
        caption: "필요성",
        headers: ["구분", "필요성"],
        rows: [
          ["학습측면", "기울기 소실 문제 해결책\nLearning Rate 상승 요인\n학습마다 Regularizer 역할 수행\n학습 시 초기 값 선택 의존성 저하"],
        ],
      },
      {
        caption: "효과",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["알고리즘 관점", "Propagation 시 파라미터의 scale에 영향 받지 않음", "Learning Rate 자유로운 설정\n빠른 학습 수행"],
          ["절차 관점", "자체 Regularization으로 인한 Drop out 제외 가능", "러닝 단계 간소화\n프로세스 속도 향상"],
        ],
      },
    ],
  },
  {
    title: "지식 증류(Knowledge Distillation)",
    course: "AI",
    definition:
      "사전 학습된 모델(Teacher Model)이 학습한 지식을 다른 작은 모델(Student Model)에게 전달하여, 학습한 내용이나 예측 성능을 모방하도록 학습하는 기법",
    defShort: "작은 모델에 지식 전달해 학습한 내용이나 예측 성능 모방하도록 학습 기법",
    lead:
      "큰 모델 지식의 압축 전수, 지식 증류",
    features: ["교사 지식 모방", "소프트 라벨 활용", "모델 경량화"],
    keywords: ["지식전달", "Teacher model", "Student model", "Distillation Loss"],
    tables: [
      {
        caption: "구성요소 및 동작절차",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["구성요소", "Teacher Model", "고성능 대형 모델, Soft Label 생성"],
          ["구성요소", "Student Model", "Teacher Model 지식 모방 학습"],
          ["구성요소", "Distillation Loss", "지식 증류에서 사용되는 손실 함수"],
          ["구성요소", "Soft Loss", "Teacher·Student 분포 차이 축소"],
          ["구성요소", "Hard Loss", "일반 Cross-Entropy Loss\n실제 레이블 잘 예측하도록 함"],
          ["동작절차", "1. 교사 모델 학습", "고성능 복잡 모델 충분 데이터 학습"],
          ["동작절차", "2. 소프트 타겟 생성", "하드 타겟 대신 소프트 타겟 추출\n소프트 타겟: 확률 분포 형태"],
          ["동작절차", "3. 학생 모델 정의", "교사보다 단순·경량 모델 설계"],
          ["동작절차", "4. 지식 전이", "소프트 타겟·정답 레이블 학습"],
          ["동작절차", "5. 학생 모델 학습 및 최적화", "최적화 알고리즘으로 학생 학습"],
        ],
      },
      {
        caption: "지식 증류 유형 (로피관)",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["출력", "로짓 기반 증류(응답 기반)", "출력 로짓 분포 학생 직접 학습\n출력 분포 미세한 차이 학습\n출력값이 지식"],
          ["중간층", "피처 기반 증류", "중간 레이어 출력 학생 모방\n저수준·고수준 특징 모두 학습\n중간 계층이 지식"],
          ["관계", "관계 기반 증류", "교사 관계 정보 학생 학습 유도\n관계가 지식"],
        ],
      },
      {
        caption: "지식 전달 방법 (오온자)",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["교사 고정", "오프라인 증류(Offline Distillation)", "교사 모델 고정 학습 중 미갱신\n지식 전이 개선 학생 성능 향상"],
          ["교사 갱신", "온라인 증류(Online Distillation)", "실시간 동시 학습 교사 지속 갱신\n피드백 루프 학생 성능 반영"],
          ["교사 없음", "자기 증류(Self-Distillation)", "동일 네트워크 교사=학생 겸용\n얕은 분류기 부착 정확도 저하 해결"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.05 ITPE FR 5일차 1교시, 2025.04 KPC 모의고사 4교시, 123회 컴시응 1교시", "교재 두음: 유형 [로피관] / 전달 방법 [오온자]"],
  },
  {
    title: "데이터라벨링과 어노테이션",
    course: "AI",
    definition:
      "라벨링: 인공지능이 기계학습에 활용할 수 있도록 기능이나 목적에 부합하는 정보를 원천데이터에 부착하는 활동 / 어노테이션: 라벨링 공정에서 인간이 부여한 식별기준을 기계가 인식할 수 있도록 선정된 데이터에 추가적인 정보를 기입하여 알고리즘이 이해할 수 있도록 만드는 과정",
    defShort: "목적 부합 정보를 원천데이터에 부착, 기계가 인식하도록 기입하는 과정",
    lead:
      "학습 데이터의 정답 부착, 데이터라벨링과 어노테이션",
    features: ["학습용 정보 부착", "인간 식별기준 기반", "데이터 유형별 방식"],
    keywords: ["라벨링", "어노테이션", "바운딩박스", "폴리곤", "텍스트 전사"],
    tables: [
      {
        caption: "기능",
        headers: ["구분", "라벨링 기능", "어노테이션 방식"],
        rows: [
          ["텍스트(Text)", "텍스트 분류\n개체명 인식\n관계-의존성", "클래스 라벨\n단어(구문) 라벨\n단어 간 관계"],
          ["이미지(Image)", "이미지 분류\n객체 인식", "클래스 라벨\n바운딩박스·폴리곤"],
          ["비디오(Video)", "동영상 분류\n객체 인식\n객체 추적", "클래스 라벨\n바운딩박스·키포인트\n폴리곤·폴리라인"],
          ["오디오(Audio)", "오디오 분류\n세그먼테이션\n음성인식(STT)", "클래스 라벨\n텍스트 전사\n텍스트 전사"],
          ["기타", "시계열세그먼테이션\nHTML 문서분류", "클래스 라벨\n클래스 라벨"],
        ],
      },
    ],
  },
  {
    title: "서포트 벡터 머신 SVM(Support Vector Machine)",
    course: "AI",
    definition:
      "데이터가 사상 된 공간에서 경계선과 가장 근접한 데이터(Support Vector)간의 거리가 가장 큰 경계를 식별하는 알고리즘",
    defShort: "경계선과 가장 근접한 데이터 간 거리가 가장 큰 경계를 식별하는 알고리즘",
    lead:
      "최대 마진의 분류 경계, SVM",
    features: ["과적합 회피", "통계적 학습", "차원의 저주 회피"],
    keywords: ["분류", "패턴인식", "지도학습", "종속변수", "독립변수", "Support Vector", "Margin", "초평면", "커널함수", "과적합"],
    tables: [
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["과적합 회피", "과적합 회피 예측 정확도 최대"],
          ["통계적 학습", "통계적 학습 이론 다양한 영역 적용"],
          ["차원의 저주 회피", "최대 마진 초평면 고차원 경계 극복"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["데이터", "Support Vector", "분류 경계 가장 가까운 학습 데이터"],
          ["경계", "Margin", "분류 경계와 최근접 데이터 거리\n하드마진: 이상치 불허\n소프트마진: 이상치 허용 분류"],
          ["경계", "초평면(hyperplane)", "다차원 공간 구분 위한 n-1평면\nSupport Vector 지나는 선"],
          ["변환", "커널기법(Kernel trick)", "input space→feature space 변환\n고차 공간 비선형 경계면 탐색"],
        ],
      },
    ],
  },
  {
    title: "K-평균 알고리즘",
    course: "AI",
    definition:
      "n개의 데이터를 K개의 군집으로 분류하기 위해 거리 기반으로 반복적으로 계산해 나가는 Clustering 알고리즘",
    defShort: "K개 군집으로 거리 기반 반복 계산하는 Clustering 알고리즘",
    lead:
      "거리 기반 반복 군집화, K-평균 알고리즘",
    features: ["거리 기반 군집화", "K값 사전 지정", "평균 반복 갱신"],
    keywords: ["Clustering", "비지도학습", "군집화", "거리기반"],
    tables: [
      {
        caption: "성능평가 방법 (실엘)",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["실루엣 계수", "인접클러스터와의 비중 계산", "대부분 개체 높은 값일 때 적정"],
          ["응집도", "중심과 거리 기반", "중심과 거리의 오차 제곱 합"],
          ["외부평가", "임의로 답을 정하여 평가", "정해진 정답지 바탕 정확도 평가"],
          ["Dunn Index", "군집간 거리 기반", "군집 내 최대 대비 군집 간 최소거리\n군집 간 멀고 내부 분산 작으면 우수"],
          ["Elbow Method", "중심과 거리 기반\n중심과 거리의 오차 제곱 합", "적정 K값에서 최소값 보이는 모델\n응집도라고도 함"],
        ],
      },
      {
        caption: "수행절차",
        headers: ["절차", "설명"],
        rows: [
          ["1) 시작", "전체 데이터 데이터 일괄 수용\nLazy 학습 지연 학습 방식"],
          ["2) Cluster K개 지정", "K값 파라미터 군집 수 사전 입력"],
          ["3) 초기 평균값 선정", "무작위 추출 임의 객체 선정"],
          ["4) 초기 평균값 기준으로 데이터 선별", "최근접 평균값 근접 중심 배정"],
          ["5) 최소 거리를 가진 데이터들로 그룹핑", "최소 거리 기반 거리 기준 그룹핑"],
          ["6) 평균값 재조정", "중심점 재계산 군집 평균 갱신\n3~5단계 반복 수렴까지 반복"],
          ["7) 알고리즘 종료", "평균값 불변 변화 없으면 완료"],
        ],
      },
    ],
  },
  {
    title: "K-NN(Nearest Neighbor) Classification",
    course: "AI",
    definition:
      "라벨링 된 데이터로부터 거리가 가까운 'k'개의 다른 데이터의 레이블을 참조하여 분류하는 알고리즘",
    defShort: "거리가 가까운 k개의 다른 데이터 레이블을 참조해 분류하는 알고리즘",
    lead: "최근접 이웃 참조의 분류, K-NN",
    features: ["거리 기반 분류", "지도 학습", "K값 의존 결과"],
    keywords: ["Classification", "회귀", "지도학습", "예측", "거리기반"],
    tables: [
      {
        caption: "동작과정",
        headers: ["순서", "설명"],
        rows: [
          ["1) 숫자 K값 설정", "이웃 수 K 결정 탐색 이웃 범위\n작으면 과적합 크면 과소적합"],
          ["2) 거리 측정방법 설정", "유클리드 맨하탄 거리 기준 선택"],
          ["3) K개의 최근접 이웃 탐색", "K개 이웃 탐색 샘플 최근접 탐색"],
          ["4) 가장 많은 클래스에 속한 클래스에 할당", "다수결 결정 최다 클래스 할당"],
          ["5) 클래스 확정", "최종 클래스 분류 결과 확정"],
        ],
      },
      {
        caption: "성능평가 방법 (정정재F RA)",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["혼동행렬 환산수식", "정확도 (Accuracy)", "(TP+TN)/(TP+FP+FN+TN)"],
          ["혼동행렬 환산수식", "정밀도 (Precision)", "TP/(TP+FP)"],
          ["혼동행렬 환산수식", "재현율 (Recall)", "TP/(TP+FN)"],
          ["혼동행렬 환산수식", "F-1 Score", "정밀도·재현율 조화평균\n2×P×R/(P+R)"],
          ["임계값 변화", "ROC(Receiver Operating Characteristic)", "X축 위 양성률, Y축 진 양성률"],
          ["임계값 변화", "AUC(Area Under the ROC Curve)", "ROC curve의 아래 면적\n1에 가까울수록 좋은 모델"],
        ],
      },
      {
        caption: "거리 (유맨민체코)",
        headers: ["구분", "거리", "설명"],
        rows: [
          ["거리 기반", "유클리디안 거리", "두 점 사이의 직선 거리"],
          ["거리 기반", "맨하탄 거리", "격자형 경로 따라 이동 거리(축)\n계산 간단, 고차원 안정적 결과"],
          ["거리 기반", "민코프스키 거리", "유클리디안·맨해튼 거리 일반화"],
          ["거리 기반", "체비쇼프 거리", "최대 거리를 기준으로 측정"],
          ["각도 기반", "코사인 유사도", "두 벡터 간 각도 기반 유사도 측정"],
        ],
      },
    ],
  },
  {
    title: "밀도기반 클러스터링(DBSCAN)",
    course: "AI",
    definition:
      "임의의 클러스터 중심을 이동시키며 중심으로부터 정해진 반경 거리 내에 최소 데이터 포인트 개수를 확인하며 밀도 기반으로 군집화를 수행하는 알고리즘",
    defShort: "반경 내 최소 데이터 포인트 개수를 확인하며 밀도 기반 군집화 알고리즘",
    lead:
      "밀도 기준의 군집 발견, DBSCAN",
    features: ["밀도 기반 군집화", "임의 형태 대응", "Noise 점 구분"],
    keywords: ["밀도", "군집화", "core", "border", "Epsilon", "connected"],
    tables: [
      {
        caption: "구성요소 (코보노)",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["점 유형", "Core Point", "Epsilon 반경 e 거리 이내\nm개 이상 존재 군집 인정 집합"],
          ["점 유형", "Border Point", "core 미달 군집 소속 경계점"],
          ["관계", "Connected", "core 간 겹침 하나의 군집 정의"],
          ["점 유형", "Noise Point", "조건 불만족 점 군집 미소속 잡음"],
        ],
      },
      {
        caption: "동작방식",
        headers: ["동작방식", "설명"],
        rows: [
          ["① Epsilon 설정", "두 인스턴스 최대 허용 거리\n거리 이내 인스턴스 neighbor 분류"],
          ["② minPts 설정", "군집 형성 Epsilon 내 최소 개수\n낮은 minPts는 noise point 다수"],
          ["③ Core point 분류", "Epsilon 내 minPts만큼 neighbor\n군집(cluster) 형성 포인트"],
          ["④ Border Point 분류", "minPts 미달이나 군집에 포함\n군집 경계 형성 포인트"],
        ],
      },
    ],
    notes: ["K-means와 비교: 반달 모양처럼 임의 형태의 데이터에서 K-means는 실패, DBSCAN은 성공 — 밀도 기반이라 군집 모양에 제약이 없다"],
  },
  {
    title: "거리 공식(Distance Formula)",
    course: "AI",
    definition:
      "두 데이터 간의 차이를 측정하기 위한 방법으로 데이터 간의 거리가 가까울수록 유사한 데이터로 판별하는 척도",
    defShort: "데이터 간의 거리가 가까울수록 유사한 데이터로 판별하는 차이 측정 척도",
    lead:
      "데이터 차이의 측정 자, 거리 공식",
    features: ["가까울수록 유사", "데이터별 척도 선정", "상관관계 반영"],
    keywords: ["직선거리", "절대값거리", "L2거리", "L1거리"],
    tables: [
      {
        caption: "유클리디안 거리 (L2 거리, 직선)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "두 점 직선 거리 이용 유사도 측정"],
          ["공식", "√Σ(p_i - q_i)²"],
          ["예시", "두점사이 직선거리"],
        ],
      },
      {
        caption: "맨하탄 거리 (L1 거리, 직각)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "수평·수직 이동 거리 유사도 측정"],
          ["공식", "d = Σ|a_i - b_i|"],
          ["예시", "두점사이 직각거리"],
        ],
      },
      {
        caption: "체비쇼프 거리",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "가장 긴 좌표 차원 거리 유사도 측정"],
          ["공식", "d(A,B) = max|x_i - y_i|"],
          ["예시", "좌표 차원 중 가장 긴 거리"],
        ],
      },
      {
        caption: "마할라노비스 거리 (상관관계)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "상관관계·분산 고려 통계적 거리"],
          ["공식", "√((x-μ)ᵀS⁻¹(x-μ))"],
          ["특징", "상관관계: 상관 높을수록 가깝게\n이상치 탐지: 평균서 멀면 이상치"],
          ["예시", "A·B 유클리드 거리(최단)\nA·C 마할라노비스 거리(상관)"],
        ],
      },
      {
        caption: "민코프스키 거리 (복합)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "L1·L2·체비쇼프 거리 일반화"],
          ["공식", "(Σ|x_i - y_i|^p)^(1/p)"],
          ["특징", "P값: p값으로 거리 척도 결정\n척도 선정: 차원별 적절 척도 선정"],
          ["예시", "p=1 맨하탄 거리\np=2 유클리디안 거리\np=∞ 체비쇼프 거리"],
        ],
      },
    ],
  },
  {
    title: "유사도(Similarity)",
    course: "AI",
    definition:
      "단어나 문장을 벡터화하여 특징벡터를 만들고, 벡터가 얼마나 같은지 나타내주는 척도",
    defShort: "단어나 문장을 벡터화하여 특징벡터가 얼마나 같은지 나타내주는 척도",
    lead:
      "벡터 간 닮음의 척도, 유사도",
    features: ["특징벡터 기반", "거리·각도 측정", "데이터 유형별 선택"],
    keywords: ["벡터", "교집합의 크기/합집합의 크기", "코사인 각도", "유사도"],
    tables: [
      {
        caption: "유사도 측정법",
        headers: ["측정법", "공식", "특징"],
        rows: [
          ["코사인 유사도", "cos(θ) =\nA·B/(||A||·||B||)", "코사인 각도 이용\n0이면 일치 없음"],
          ["해밍 거리", "D(p,q) =\nΣ|p_i - q_i|\n(p,q: 0 또는 1)", "다른 비트 수 측정\n동일 길이 필요\nXOR 연산 측정"],
          ["자카드 인덱스", "J(A,B) =\n|A∩B| / |A∪B|", "합·교집합 비율\n1이면 동일"],
          ["소렌슨-다이스 인덱스", "S(A,B) =\n2|A∩B| / (|A|+|B|)", "공동·평균 비율\n교집합 2배 반영"],
        ],
      },
    ],
  },
  {
    title: "앙상블 학습(Ensemble Learning)",
    course: "AI",
    definition:
      "여러 개의 분류기를 생성하고, 그 예측을 결합함으로써 보다 정확한 예측을 도출하는 기법",
    defShort: "여러 개 분류기를 생성, 예측을 결합해 보다 정확한 예측을 도출하는 기법",
    lead:
      "여러 모델의 집단 지성, 앙상블 학습",
    features: ["다수 분류기 결합", "과적합 완화", "연산 비용 증가"],
    keywords: ["과적합", "결합", "보팅"],
    tables: [
      {
        caption: "4대 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["병렬 결합", "보팅(Voting)", "이종 결합 보팅 다수 분류기 투표\n하드·소프트 다수결·평균"],
          ["병렬 결합", "배깅(Bagging)", "부트스트랩 샘플 동일 모델 학습\n투표·평균 결정 범주·연속 구분"],
          ["순차 결합", "부스팅(Boosting)", "오류 가중치 부여 순차 학습 강분류\nGB 잔차 보정 경사하강법 적용"],
          ["메타 결합", "스태킹(Stacking)", "교차검증 예측 개별 모델 결과\n메타 학습기 메타셋 최종 학습"],
        ],
      },
    ],
    notes: ["배깅의 대표가 랜덤 포레스트, 부스팅의 대표가 XGBoost — 한 줄 연결로 암기"],
  },
  {
    title: "유전 알고리즘(Genetic Algorithm)",
    course: "AI",
    definition:
      "자연세계의 진화현상인 유전학의 원리에 근거하여, 세대를 거치면서 적자생존을 통해 점진적으로 최적해를 탐색해가는 최적화 문제해결 알고리즘",
    defShort: "유전학 원리로 점진적으로 최적해를 탐색하는 최적화 문제해결 알고리즘",
    lead:
      "진화 모방의 최적해 탐색, 유전 알고리즘",
    features: ["유전학 원리 모방", "적자생존 선택", "점진적 최적해 탐색"],
    keywords: ["최적화 알고리즘", "반복"],
    tables: [
      {
        caption: "절차 (선교변대반)",
        headers: ["No.", "절차", "설명"],
        rows: [
          ["1", "초기화(Initialize)", "해결할 해를 유전자로 표현\n랜덤 유전자 적당 개수 준비"],
          ["2", "선택(Selection)", "적합도 계산해 다음 세대 후보 선택\n룰렛휠·순위·토너먼트 선택"],
          ["3", "교차(Crossover)", "선택 유전자로 후대 유전자 생성\n단일점·다점·균등·산술 교차"],
          ["4", "변이(Mutation)", "확률 따라 자손 염색체 일부 변이\n전형적 변이·비균등 변이"],
          ["5", "대체(Replace)", "새 자손 염색체 개체군에 포함\n현재 유전자를 후대 유전자로 교체"],
          ["6", "반복(Loop)", "변화 없을 때까지 절차 반복\n해 못 구할 가능성 → 튜닝 필요"],
        ],
      },
      {
        caption: "기법 (룰랭토 일다균산)",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["선택", "룰렛 휠", "적합도 비례 확률"],
          ["선택", "순위(랭크)", "적합도 순위 선택"],
          ["선택", "토너먼트", "최고 적합도 선택"],
          ["교차", "단일점/다점 교차", "특정 지점 기준\n유전자 교차"],
          ["교차", "균등 교차", "난수값 따라 선택"],
          ["교차", "산술 교차", "산술 연산 적용"],
        ],
      },
    ],
    notes: ["출제 이력: 137회 정보관리 4교시, 113회 정보관리 3교시, 80회 정보관리 1교시"],
  },
  {
    title: "차원 축소(Dimensionality Reduction)",
    course: "AI",
    definition:
      "매우 많은 피처로 구성된 다차원 데이터 세트의 차원을 축소해 새로운 차원의 데이터 세트를 생성",
    defShort: "다차원 데이터 세트의 차원을 축소해 새로운 차원의 데이터 세트를 생성",
    lead: "차원의 저주 극복 기법, 차원 축소",
    features: ["새로운 차원 생성", "차원의 저주 완화", "직관적 분석 지원"],
    keywords: ["차원의 저주", "PCA", "LDA", "ISOMAP", "로컬 선형 임베딩"],
    tables: [
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["직관적 분석", "2·3차원 변환 시각적 신속 분석"],
          ["차원의 저주 완화", "과다 특성 축소 학습 난이도 완화"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "내용"],
        rows: [
          ["선형", "PCA\nLDA\n특이값 분해(SVD)\n요인 분석", "주성분 저차원화\n분산비 최대 축소\n임의 행렬 분해\n공통 차원 축약"],
          ["비선형", "ISOMAP\n로컬선형임베딩(LLE)\nAutoEncoder\nSOM(Self-Organizing Map)", "MDS·PCA 결합\n인접 구조 보존\n압축 후 복원\n저차원 격자 군집"],
        ],
      },
    ],
  },
  {
    title: "PCA(Principal Component Analysis)",
    course: "AI",
    definition:
      "고차원 공간의 표본들을 선형 연관성이 없는 저차원공간(주성분)의 표본으로 변환하는 알고리즘",
    defShort: "고차원 표본을 저차원공간(주성분)의 표본으로 변환하는 알고리즘",
    lead: "주성분으로의 저차원 변환, PCA",
    features: ["선형 차원 축소", "분산 최대 보존", "변수 상관성 제거"],
    keywords: ["차원 축소", "잡음제거", "공분산", "Eigen Vector", "Eigen Value"],
    tables: [
      {
        caption: "동작과정",
        headers: ["절차", "설명"],
        rows: [
          ["1. 데이터 셋 로드", "분석 대상 준비 PCA 데이터셋"],
          ["2. 평균, 공분산 계산", "평균·편차 중심값 산출\n공분산 행렬 변수 관계 계산"],
          ["3. 고유값, 고유 벡터 계산", "고유값·벡터 데이터 최적 표현"],
          ["4. 주성분 선택", "고유값 큰 순 주성분 우선 선택\n설명 분산 비율 개수 결정 기준"],
          ["5. 변환(Transform) 수행", "회전·확장 저차원 변환 예측"],
        ],
      },
      {
        caption: "주요수식",
        headers: ["구분", "수식", "설명"],
        rows: [
          ["공분산", "Σ(X−X̄)(Y−Ȳ) / (n−1)", "두 확률 변수 상관관계 나타내는 값\nC>0, 양의 상관관계\nC<0, 음의 상관관계\nC=0, 두 변수는 독립"],
          ["Eigen Vector", "Ax = λx (x : Eigen Vector)", "선형변환 결과 자기 상수배인 벡터"],
          ["Eigen Value", "Ax = λx (λ : Eigen Value)", "선형변환 결과 자기 상수배인 값"],
        ],
      },
    ],
    notes: ["차원 축소 예시: 투영했을 때 분산이 큰 벡터를 찾는다"],
  },
  {
    title: "LDA(Linear Discriminant Analysis)",
    course: "AI",
    definition:
      "클래스간 분산과 클래스 내 분산의 비율을 최대화하는 방식으로 데이터에 대한 특징 벡터의 차원을 축소하는 알고리즘",
    defShort: "클래스간·클래스 내 분산 비율을 최대화해 특징 벡터 차원 축소 알고리즘",
    lead:
      "분리 최대의 차원 축소, LDA",
    features: ["분산 비율 최대화", "지도 학습 기반", "정규분포 가정"],
    keywords: ["클래스 간 분산/클래스 내 분산", "고유벡터", "고유 값", "decision boundary"],
    tables: [
      {
        caption: "동작과정 (전산고변)",
        headers: ["절차", "설명"],
        rows: [
          ["1. 데이터 전처리", "데이터 정규화 수행"],
          ["2. 산포행렬 계산", "클래스 간 산포행렬 S(B) 구성\n클래스 내부 산포행렬 S(W) 구성"],
          ["3. 고유값, 고유 벡터 계산", "S(W) 역행렬 S(B) 곱 연산\n고유값 계산 고유벡터 산출"],
          ["4. 변환(Transform) 수행", "고유벡터 이용 데이터셋 설명\n회전·확장 새 데이터 예측"],
        ],
      },
      {
        caption: "PCA와 LDA 비교",
        headers: ["구분", "PCA", "LDA"],
        rows: [
          ["목적", "데이터 분산 최대", "클래스 분리 최대"],
          ["학습 방식", "비지도 학습", "라벨 지도 학습"],
          ["기준", "데이터 자체 분포", "간/내 분산 비율"],
          ["차원 축소 가능 범위", "모든 차원 가능", "클래스 수−1"],
          ["데이터 성질", "선형 구조 데이터", "선형 구조+라벨"],
          ["사용 사례", "차원 축소·압축\n노이즈 제거", "분류 문제 해결\n클래스 간 축소"],
        ],
      },
    ],
    notes: ["LDA 가정: ① 각 집단이 정규분포 형태의 확률분포 가짐 ② 각 집단은 비슷한 형태의 공분산 구조를 가짐. 평균의 차이를 극대화하고 분산을 최소화"],
  },
  {
    title: "SVD(Singular Value Decomposition)",
    course: "AI",
    definition:
      "행렬을 고유한 기하학적 성질을 가진 세 행렬로 분해하여 원본 행렬의 중요한 정보만 유지하면서, 고차원 행렬을 저차원 행렬로 분리하는 기법",
    defShort: "세 행렬로 분해해 중요한 정보만 유지하며 저차원 행렬로 분리하는 기법",
    lead:
      "행렬 분해의 차원 압축, SVD",
    features: ["특이값 기반", "중요 정보 유지", "비대칭 행렬 적용"],
    keywords: ["특이값", "특이 벡터", "직교행렬", "대각행렬", "전치행렬"],
    tables: [
      {
        caption: "동작과정 [행분선재]",
        headers: ["절차", "설명"],
        rows: [
          ["① 데이터 행렬 준비", "m×n 행렬 A m행 n열 2차원"],
          ["② 특이값 분해(SVD 수행)", "A=UΣV^T 세 행렬 곱 분해"],
          ["③ 특이값 선택", "대각행렬 Σ 선택 큰 특이값만 보존\n작은 특이값 제외 노이즈로 간주"],
          ["④ 근사 행렬 재구성", "선택 특이벡터 저차원 근사 행렬"],
        ],
      },
      {
        caption: "주요수식 A = UΣV^T",
        headers: ["구분", "설명"],
        rows: [
          ["A", "m×n 크기의 원본\n행렬"],
          ["U", "좌측 특이 벡터\n행렬 m×m\n(직교행렬) — 행\n공간"],
          ["Σ", "대각 행렬 m×n\n(대각) — 특이값"],
          ["V^T", "우측 특이 벡터\n행렬 n×n\n(전치행렬) — 열\n공간"],
        ],
      },
      {
        caption: "PCA와 SVD 비교",
        headers: ["비교 항목", "PCA", "SVD"],
        rows: [
          ["개념", "분산 최대화 축소", "세 행렬 곱 분해"],
          ["목적", "분산 설명·압축", "압축·잡음 제거"],
          ["특징", "대칭 행렬 적용\n데이터 분산 기반", "비대칭도 적용\n특이값 기반"],
          ["계산방식", "공분산 고유분해", "UΣV^T 분해"],
          ["사례", "데이터 시각화\n특징 추출·축소", "추천 시스템\n압축·문서 분류"],
        ],
      },
    ],
  },
  {
    title: "GAN(Generative Adversarial Network)",
    course: "AI",
    definition:
      "Generator와 Discriminator가 서로 대립 과정을 통해 훈련 타깃을 생성하는 학습 모델로 두개의 네트워크로 구성된 심층 신경망",
    defShort: "생성자와 판별자가 대립 과정을 통해 훈련 타깃을 생성하는 심층 신경망",
    lead:
      "대립 학습의 생성 모델, GAN",
    features: ["생성·판별 대립", "Nash균형 수렴", "모드붕괴 발생"],
    keywords: ["Generator", "Discriminator", "Min-Max 학습", "Nash균형", "모드진동", "모드붕괴", "준지도학습"],
    tables: [
      {
        caption: "생성방법 [가신간디]",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["생성자", "D(G(z)) = 1", "가짜데이터 생성, 1 확률 판별 목표\nV(D,G) 최소화(min) 방향"],
          ["판별자", "D(x) = 1\nD(G(z)) = 0", "가짜 0, 실제 1 확률 판별 목표\nV(D,G) 최대화(max) 방향"],
          ["학습 데이터", "X(Real Data)", "학습할 Real Data\n지속적인 학습 데이터 제공"],
          ["Loss Function", "min_G max_D V(G,D) = E_x~Pdata(x)[log D(x)] + E_z~Pz(z)[log(1−D(G(z)))]", ""],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["이미지 생성", "DCGAN", "사실적인 이미지 생성 기술"],
          ["이미지 변환", "SRGAN", "저해상도→고해상도 이미지 변환"],
          ["텍스트 조건", "스택 GAN", "문장·단어 해석해 이미지 생성"],
          ["입체", "3D-GAN", "입체 모델 생성, 사진→3차원 그림"],
          ["스타일 변환", "사이클 GAN", "AI 자율 학습, 이미지 스타일 변환"],
        ],
      },
      {
        caption: "문제점",
        headers: ["문제점", "해결방안"],
        rows: [
          ["Generator와 Discriminator 간 학습 성능 편차로 인한 성능 한계 문제", "DCGAN 활용, 특징 값 추출 학습\nLeaky ReLU 병용"],
          ["모드(최빈 값) 진동 및 모드 붕괴로 인한 상호 학습 상쇄 및 Local Minimum 수렴 문제", "Mini-Batch Discrimination\nHistorical Averaging 활용\n데이터 분포 경계 학습·학습 기억"],
        ],
      },
    ],
    notes: ["모드진동: 특정 단계에 머무는 현상 / 모드붕괴: 일부 데이터만 학습", "개념도: Latent Space+Noise → Generator → 생성된 Fake Sample → Discriminator(Real Sample과 판별) → Correct? → Fine Tune Training"],
  },
  {
    title: "VAE(Variational Autoencoder)",
    course: "AI",
    definition:
      "모델평균(μ)과 표준편차(σ)를 학습하여 사후확률을 최대화 하여 입력 데이터와 유사한 새로운 데이터를 생성하는 AI 기술",
    defShort: "평균·표준편차를 학습해 입력 데이터와 유사한 새로운 데이터 생성 기술",
    lead:
      "확률 분포 학습의 생성, VAE",
    features: ["μ·σ 분포 학습", "확률적 데이터 생성", "정규분포 일반화"],
    keywords: ["목표 지향", "실시간 피드백", "적응형 학습", "미세조정"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["인코더(Encoder)", "Input Layer", "학습할 x의 입력 데이터"],
          ["인코더(Encoder)", "Encoder", "입력 데이터 차원 축소 학습\nAuto Encoder 사용"],
          ["Latent Space", "평균, 표준편차 벡터", "Input 평균·표준편차 학습 벡터 값"],
          ["Latent Space", "Sample Latent", "평균·표준편차로 사후 확률 추론\n변분추론으로 근사적 학습"],
          ["디코더(Decoder)", "Decoder", "사후 확률 최대화 확률 분포 학습\n네트워크 출력값 도출"],
          ["디코더(Decoder)", "Output Layer", "Input과 유사한 새 데이터 생성"],
        ],
      },
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["데이터 압축 및 표현 학습", "잠재 공간 변환 저차원 벡터 표현\n정규분포 표현 일반화 특성 학습"],
          ["데이터 생성", "잠재 공간 샘플링 새 데이터 생성"],
        ],
      },
      {
        caption: "VAE와 AE 비교",
        headers: ["비교 항목", "VAE(Variational Autoencoder)", "AE(Auto Encoder)"],
        rows: [
          ["목적", "Decoder 학습용 Encoder 사용", "Encoder 학습용 Decoder 연결"],
          ["Latent Vector", "가우시안 확률값", "단일 고정값"],
        ],
      },
    ],
    notes: ["개념도: INPUT → Encoder(축소) → Latent Space(coding μ · coding σ + Gaussian Noise) → Decoder(생성) → OUTPUT"],
  },
  {
    title: "자연어처리(NLP, Natural Language Processing)",
    course: "AI",
    definition:
      "인간의 언어를 기계적으로 분석해서 컴퓨터가 이해할 수 있는 형태로 만들거나 혹은 컴퓨터가 처리한 이해할 수 있는 언어로 표현하는 기술",
    defShort: "인간 언어 기계적으로 분석해 컴퓨터가 이해할 수 있는 형태 만드는 기술",
    lead: "인간 언어의 기계 이해, 자연어처리",
    features: ["비정형 텍스트 처리", "문맥 의존 해석", "대규모 말뭉치 학습"],
    keywords: ["자연어이해(NLU)", "자연어생성(NLG)", "자연어처리(NLP)"],
    tables: [
      {
        caption: "자연어 처리 모델 (LLM)",
        headers: ["구분", "모델", "설명"],
        rows: [
          ["디코더", "GPT(Generative pre-trained Transformer)", "트랜스포머 디코더 구조\nfew shot Learning 순방향 모델"],
          ["인코더", "BERT(Bidirectional Encoder Representations from Transformers)", "트랜스포머 인코더 구조\nfine tuning된 양방향 모델"],
          ["인코더-디코더", "T5(Text-to-Text Transfer Transformer)", "문제와 정답 쌍으로 제공\n전이 학습 사용 자연어 처리 모델"],
        ],
      },
      {
        caption: "자연어 처리 주요기술 [형구의담]",
        headers: ["구분", "주요 기술", "설명"],
        rows: [
          ["NLP", "형태소 분석", "발화 문장 품사 정보 인식\n명사·동사·형용사·조사 등"],
          ["NLP", "구문 분석", "형태소 결합 구문·문장 생성 규칙\nchunk 사이의 관계 분석"],
          ["NLP", "의미 분석", "구문 분석 결과 해석\n문장 성분간 의미관계 파악"],
          ["NLP", "담화 분석", "문맥 속 단어·문장 의미 분석"],
          ["NLU", "Word Embedding", "여러 문장 모델에 제공\n문맥 통해 단어 의미 학습"],
          ["NLU", "문장 분류(Sentence Classification)", "입력 문장 K개 카테고리 분류"],
          ["NLU", "Seq2Seq", "문장 입력받아 출력하는 기술"],
          ["NLU", "MRC(Machine Reading Comprehension)", "지문(Context) 학습\n질의(Query) 답변 추론"],
          ["NLU", "대화 모델(Conversation Model)", "입력 문장 이해·답변 생성\n대화 흐름 관리 기술"],
          ["NLG", "담화 생성(Discourse Generation)", "상황에 적합한 자연어로 변환"],
          ["NLG", "문장 계획(Sentence Planning)", "적합한 자연어 문법 계획·생성"],
          ["NLG", "Lexical 선택", "생성 문장에서 구문 선택\n명사/동사/형용사/부사"],
          ["NLG", "Morphological 생성", "부적합 표현·오류 검출\n최종 문장 확정"],
          ["NLG", "TTS(Text To Speech)", "텍스트를 사람 목소리로 구현"],
        ],
      },
    ],
    notes: ["개념도: 화자 → 음성 인식 → 언어 이해(NLU: 자연어 이해) → 대화 관리 ↔ Data Base → 언어(발화) 생성(NLG: 자연어 생성) → 음성 합성 → 화자", "LLM: GPT·BERT·T5와 같이 대량의 텍스트 데이터를 학습하여 인간과 유사한 언어 이해 및 생성 능력을 갖춘 초거대 언어 AI 모델"],
  },
  {
    title: "트랜스포머(Transformer)",
    course: "AI",
    definition:
      "어텐션 메커니즘을 사용하여 입력된 문장을 병렬적으로 처리하여 문장 내 단어들의 위치 정보를 보존하면서 효율적으로 처리하는 자연어 처리(NLP)를 위한 딥러닝 모델",
    defShort: "어텐션 메커니즘으로 문장을 병렬적 처리하는 자연어 처리 딥러닝 모델",
    lead:
      "어텐션 기반 병렬 처리, 트랜스포머",
    features: ["어텐션 메커니즘", "병렬 처리", "위치 정보 보존"],
    keywords: ["인코더", "디코더", "어텐션 메커니즘", "LLM"],
    tables: [
      {
        caption: "구성요소 [입포 인언피 디마인피 출리소]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["입력", "포지셔널 인코딩(Positional Encoding)", "입력단어 위치 값 추가\n사인, 코사인 함수 이용\nRNN 미 적용 단어 위치 문제해결"],
          ["인코더", "인코더 셀프 어텐션(Encoder Self-Attention)", "멀티 헤드 어텐션 토큰 병렬처리\nQuery=Key=Value\n6개 인코더가 이전 어텐션 참조"],
          ["인코더", "피드 포워드 신경망(Feed Forward NN)", "Position-Wise 완전 연결망\n잔차(Residual) 연결·정규화"],
          ["디코더", "마스크드 셀프 어텐션(Masked Self-Attention)", "멀티 헤드 어텐션 토큰 병렬처리\nQuery=Key=Value\n현재 이후 단어 마스킹 처리"],
          ["디코더", "인코더-디코더 어텐션", "셀프 어텐션 아님\n인코더·디코더 어텐션 결합 사용\n인코더 셀프 어텐션=Key=Value\n디코더 셀프 어텐션=Query"],
          ["디코더", "피드 포워드 신경망", "인코더 구조와 동일"],
          ["출력", "Linear Layer(Fully Connected Layer)", "디코더 출력 벡터화 신경망 연결"],
          ["출력", "Softmax", "출력단어 예측"],
        ],
      },
    ],
    notes: ["개념도: Input Embedding+Positional Encoding → [Multi-Head Attention → Add&Norm → Feed Forward → Add&Norm]×N(인코더) / Output Embedding(shifted right) → Masked Multi-Head Attention → 인코더-디코더 어텐션 → Feed Forward → Linear → Softmax → Output Probabilities(디코더)"],
  },
  {
    title: "어텐션 메커니즘(Attention Mechanism)",
    course: "AI",
    definition:
      "디코더에서 출력 단어를 예측하는 매 시점(time step)마다, 인코더에서의 전체 입력 문장의 예측해야 할 단어와 연관 있는 입력 단어 부분을 집중해 참고하는 방법",
    defShort: "매 시점 예측해야 할 단어와 연관 있는 입력 단어 부분 집중해 참고하는 방법",
    lead:
      "연관 부분 집중의 기법, 어텐션 메커니즘",
    features: ["연관 부분 집중", "매 시점 전체 참조", "유사도 가중 합"],
    keywords: ["Q(Query)", "K(Key)", "V(Value)", "Attention Score", "Attention Distribution", "Attention Value"],
    tables: [
      {
        caption: "어텐션 함수 [쿼키벨어] — Attention(Q,K,V)=Attention value",
        headers: ["순서", "설명"],
        rows: [
          ["1)", "'쿼리(Query)'에 대해 모든\n'키(Key)'의 유사도를\n각각 구한다"],
          ["2)", "유사도를\n키(Key)와\n매핑되어 있는\n각각의 '값(Value)'에 반영"],
          ["3)", "'유사도가\n반영된' 값(Value)을 모두\n더해서 리턴"],
          ["4)", "어텐션 값(Attention\nvalue)를 반환"],
        ],
      },
      {
        caption: "어텐션 메커니즘 예측 과정 [스분값연예]",
        headers: ["과정", "설명"],
        rows: [
          ["어텐션 스코어(Attention Score)", "은닉 상태 유사도 내적 점수 계산\n디코더·인코더 새 단어 예측 점수"],
          ["어텐션 분포(Attention Distribution)", "소프트맥스 적용 점수→분포 벡터\n어텐션 가중치 분포 벡터 각 값"],
          ["어텐션 값(Attention Value)", "가중 합 a_t 가중치·은닉 합\n맥락 벡터 별칭 인코더 맥락 포함"],
          ["연결(concatenate)", "어텐션 값 결합 은닉 상태와 연결\n긴 시퀀스 대응 정보 손실 최소화"],
          ["최종값 예측", "소프트맥스 출력 선형 변환 후 예측"],
        ],
      },
    ],
  },
  {
    title: "페이지드 어텐션(Paged Attention)",
    course: "AI",
    definition:
      "언어 모델(LLM)의 추론 속도와 처리량을 높이기 위해 운영체제(OS)의 **가상 메모리 페이징 기법을 KV 캐시(Key-Value Cache)에 적용**한 메모리 관리 기술",
    defShort: "가상 메모리 페이징 기법을 KV 캐시에 적용한 LLM 메모리 관리 기술",
    lead: "LLM 추론 KV 캐시의 단편화 해결, 페이지드 어텐션",
    features: ["가상 메모리 페이징", "비연속 동적 매핑", "단편화 최소화"],
    keywords: ["KV Cache", "가상메모리 페이징 기법", "비연속"],
    tables: [
      {
        caption: "기존 방식의 한계점",
        headers: ["한계점", "설명"],
        rows: [
          ["KV Cache 크기 증가", "시퀀스 길이 따라\n크기 증가"],
          ["연속 할당", "최대 시퀀스 길이\n메모리 연속 할당"],
          ["단편화", "미사용 공간\n내부 단편화 발생"],
        ],
      },
      {
        caption: "페이지드 어텐션 구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["논리적 관리", "Logical Block\nSequence", "고정크기 블록\nKV Cache 논리 단위"],
          ["매핑 관리", "Block Table\nBlock Mapping", "매핑 주소 테이블\n논리·물리 연결"],
          ["물리 메모리", "Physical GPU Block\nDynamic Allocation", "KV Cache 물리 블록\n동적 할당 기술"],
          ["Attention 연산", "Block Table Lookup\nPhysical Block Fetch", "물리 주소 테이블\nGPU에서 조회"],
          ["메모리 공유", "Block Sharing\nCopy-on-Write", "프롬프트 공유\n중복 할당 방지"],
        ],
      },
      {
        caption: "작동원리",
        headers: ["순서", "설명"],
        rows: [
          ["1)", "논리 블록 분할\n16개 토큰 단위\n가상 메모리 개념"],
          ["2)", "비연속 물리 블록\nGPU 동적 매핑"],
          ["3)", "블록 테이블 유지\n논리·물리 연결\nOS 페이지 테이블"],
          ["4)", "블록 테이블 참조\n흩어진 KV 블록\n순서대로 연산"],
        ],
      },
    ],
    notes: [
      "개념도: Logical KV Cache(Block 0~3) → Block Table(Logical 0→Physical 7, 1→2, 2→9, 3→4) → Physical GPU Memory에 흩어진 물리 블록. 기존 방식은 GPU 메모리 공간의 최대 60~80% 낭비 발생.",
      "작동원리 원문: 1) 가상 메모리 개념 도입하여 각 시퀀스의 KV 캐시를 고정된 크기(예: 16개 토큰 분량)의 '논리적 블록'으로 분할 2) 논리적 블록들을 GPU 물리 메모리 상의 비연속적인 '물리적 블록'에 동적으로 매핑 3) 운영체제의 페이지 테이블처럼, 논리적 블록과 물리적 블록의 연결 정보를 담은 '블록 테이블(Block Table)'을 유지(관리) 4) 모델이 어텐션 연산을 수행할 때, 블록 테이블을 참조하여 물리적으로 떨어져 있는 KV 캐시 블록들을 순서대로 읽어와 연산. 한계 원문: KV Cache 크기 증가(시퀀스의 길이에 맞춰 크기가 증가됨, 이전 토큰 정보 보관)·연속 할당(최대 시퀀스 길이에 맞춰 메모리 연속 할당 필요)·단편화(연속 할당으로 인하여 미사용 공간에 대한 내부 단편화 발생).",
      "140회 컴퓨터시스템응용 1교시 출제",
    ],
  },
  {
    title: "초거대 언어 모델(Large Language Model)",
    course: "AI",
    definition:
      "대량 연산이 가능한 컴퓨팅 인프라와 대량의 데이터로 학습하여 사람의 언어를 이해하고 생성가능한 언어모델",
    defShort: "대량 연산이 가능한 컴퓨팅 인프라와 대량의 데이터로 학습한 언어모델",
    lead:
      "대규모 학습의 언어 지능, 초거대 언어 모델",
    features: ["대규모 데이터 학습", "트랜스포머 기반", "언어 이해·생성"],
    keywords: ["컴퓨팅 파워", "데이터", "모델 알고리즘", "트랜스포머", "BERT", "ChatGPT"],
    tables: [
      {
        caption: "구성도 [컴데모]",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["컴퓨팅 파워", "GPU 자원\n수퍼 컴퓨팅 자원", "학습시간 증가, 컴퓨팅 자원 중요\n추론 성능 고려 시작\n정부 슈퍼컴퓨팅 센터·민간 협업"],
          ["데이터", "초대규모 모델 학습 데이터 구축\nAI 학습 데이터 구축 사업", "대규모 데이터 학습 성능 향상\n비지도학습으로 라벨링 부담 완화\n데이터셋 규모 증가"],
          ["모델 알고리즘", "GPT-3, 트랜스포머, BERT\n모델 스케일 업", "연구 분야 대형화, 서비스 경량화\nGLUE 등 기준 모델 성능 측정"],
        ],
      },
      {
        caption: "기술요소",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["학습모델", "제로샷 러닝", "명시적 훈련 없음"],
          ["학습모델", "퓨샷 러닝", "적은 데이터 학습"],
          ["학습모델", "파인튜닝", "용도별 미세 조정"],
          ["프레임워크", "랭체인", "기능 연결 통합"],
          ["프레임워크", "벡터DB", "유사도 인덱싱"],
          ["프레임워크", "프롬프트\n엔지니어링", "프롬프트 설계\n결과 도출"],
        ],
      },
      {
        caption: "문제점 및 대응방안",
        headers: ["구분", "설명"],
        rows: [
          ["문제점", "검증 안 된 응답 생성(환각 현상)\n훈련 데이터 확보·개인정보 유출\n편향 결과·응답 품질 저하\n모델 확장/배포 어려움"],
          ["대응방안", "신뢰 지식베이스 기반 RAG\n개인정보 없는 합성데이터 사용\n프롬프트 엔지니어링 입력 설계\n랭체인·벡터DB 프레임워크 적용"],
        ],
      },
    ],
  },
  {
    title: "할루시네이션(Hallucination)",
    course: "AI",
    definition:
      "인공지능 모델이 정확하지 않거나 사실이 아닌 조작된 정보를 생성하는 것을 의미",
    defShort: "AI 모델이 정확하지 않거나 사실이 아닌 조작된 정보를 생성하는 현상",
    lead: "사실 아닌 정보의 생성, 할루시네이션",
    features: ["사실 아닌 정보 생성", "조합 질문 취약", "외부 지식 완화"],
    keywords: ["편향", "과적합", "맥락이해 부족", "적대적 공격", "복잡한 모델", "고품질 데이터", "문맥개선", "RLHF", "RAG"],
    tables: [
      {
        caption: "발생원인 [불과적모맥제]",
        headers: ["구분", "원인", "설명"],
        rows: [
          ["데이터", "편향, 불충분한 학습 데이터", "오픈 데이터 오류 잘못된 정보 학습"],
          ["학습", "과적합", "학습 데이터 특화 새 데이터 부적합"],
          ["외부", "적대적 공격", "악의적 조작 행위자 조작 발생"],
          ["모델", "복잡한 모델 아키텍처", "매개변수 증가 복잡성 상승 발생"],
          ["모델", "맥락이해 부족", "맥락 이해 부족 맥락 무관 결과"],
          ["지식", "제한된 도메인 지식", "설계 외 도메인 외부 입력 시 발생"],
        ],
      },
      {
        caption: "해결방안",
        headers: ["구분", "방안", "설명"],
        rows: [
          ["데이터", "고품질 학습 데이터 제공", "다양 데이터 활용 부정확성 개선"],
          ["모델", "자연어 처리기술 기반 문맥 개선", "NLP 기술 활용 문맥 이해도 향상"],
          ["학습", "RLHF 통한 보상모델 개발", "피드백 기반 개선 정확·최신 유지"],
          ["외부 지식", "RAG(Retrieval-Augmented Generation)", "외부 지식 참조 신뢰 지식베이스\nDB 검색 활용 사실·맥락 개선"],
        ],
      },
    ],
    notes: ["개념도: '이순신'·'거북선' 개별 질문 → 유효 출력 / '이순신과 여객선' 조합 질문 → 조합 결과 출력 발생(부정확 출력) — AI 할루시네이션 현상"],
  },
  {
    title: "검색 증강 생성(RAG, Retrieval Augmented Generation)",
    course: "AI",
    definition:
      "생성형 AI 서비스를 외부 데이터를 검색하고 검색된 관련 데이터를 컨텍스트에 추가하여 AI 모델의 정확성과 신뢰성을 향상시키는 기술",
    defShort: "외부 데이터 검색해 컨텍스트 추가, AI 모델 정확성·신뢰성 향상 기술",
    lead:
      "외부 지식의 컨텍스트 보강, RAG",
    features: ["외부 데이터 검색", "최신 정보 반영", "할루시네이션 완화"],
    keywords: ["인덱싱", "청크", "임베딩", "벡터 DB", "유사도", "프롬프트 증강", "할루시네이션(hallucination)"],
    tables: [
      {
        caption: "필요성",
        headers: ["구분", "한계", "설명"],
        rows: [
          ["시점 한계", "지식단절", "학습 이후 데이터 미학습 품질 저하"],
          ["정확성", "환각현상", "사실 무관 답변 자연스러운 오답"],
          ["전문성", "범용성", "특정 영역 전문성 전문 답변 한계"],
        ],
      },
      {
        caption: "처리 단계 [저쿼정답출]",
        headers: ["단계", "기술 요소", "설명"],
        rows: [
          ["1. 문서 변환 & 저장", "Sentence Embedding\nVector DB", "문서 Load·Split·Parsing\nDense Vector 임베딩 변환\nIndexing 후 Vector DB 저장"],
          ["2. 입력 쿼리 & 문서 검색", "Query\n문서 검색\n(Document Retrieval)", "검색 시스템 활성화\n쿼리 처리(검색 시스템 이해)\n쿼리 기반 관련 문서·스니펫 검색"],
          ["3. 정보 증강(Information Augmentation)", "맥락 통합\n증강된 입력 형성", "입력·추출 정보 결합 쿼리 강화\n쿼리·검색 문서 추가 맥락 포함"],
          ["4. 답변 생성", "Sequence to Sequence\nBART", "강화 입력 GPT·BART 모델 제공\n언어 모델 입력 처리·응답 생성"],
          ["5. 출력 생성", "정제 및 형식화", "요구사항 맞게 정제·형식화\n최종 응답 RAG 출력 전달"],
        ],
      },
    ],
    notes: ["개념도: 사용자 질의 → 임베딩 모델 → 벡터 DB(지식 베이스)에서 컨텍스트 검색 → 질의+컨텍스트로 프롬프트 증강 → LLM 파운데이션 모델 → 답변. 외부지식은 임베딩 모델로 인덱싱하여 벡터 DB에 저장"],
  },
  {
    title: "검색 삽입 생성(RIG, Retrieval Interleaved Generation)",
    course: "AI",
    definition:
      "대규모 언어 모델 답변 생성 시 텍스트를 생성하는 중간에 필요한 정보를 반복적으로 검색하여 언어 모델 답변의 정확성과 신뢰성을 높이는 기술",
    defShort: "텍스트 생성 중간에 필요한 정보를 반복적으로 검색해 정확성 높이는 기술",
    lead:
      "생성 중간의 반복 검색, RIG",
    features: ["생성 중 반복 검색", "문맥 적합성 높음", "복잡성 상대적 높음"],
    keywords: ["임베딩", "벡터 DB", "답변 생성 중 검색", "반복 검색", "할루시네이션"],
    tables: [
      {
        caption: "동작절차 [초검생반]",
        headers: ["절차", "설명"],
        rows: [
          ["초기 생성", "입력 쿼리 기반 초기 텍스트 생성"],
          ["검색", "외부 지식 소스 필요 정보 검색"],
          ["생성 업데이트", "검색 정보 반영 생성 텍스트 갱신"],
          ["반복", "검색·생성 반복 텍스트 완성까지"],
        ],
      },
      {
        caption: "RAG와 RIG 비교",
        headers: ["구분", "RAG", "RIG"],
        rows: [
          ["검색 시점", "생성 전 사전 검색", "생성 중 필요 시"],
          ["검색 빈도", "일반적 한 번", "필요 시 여러 번"],
          ["효율성", "상대적 낮음", "상대적 높음\n필요 정보만 검색"],
          ["복잡성", "상대적 낮음", "상대적 높음"],
          ["문맥 적합성", "낮을 수 있음", "높을 수 있음"],
          ["학습 난이도", "상대적 낮음", "상대적 높음"],
          ["대표적인 모델", "페이스북 AI", "구글 데이터젬마"],
          ["일관성", "상대적 높음", "낮을 수 있음"],
        ],
      },
    ],
    notes: ["개념도: 사용자 질의 → 임베딩 모델(벡터 변환값 전달) → LLM 파운데이션 모델 → 답변생성 — (필요 시) 벡터 DB 검색 ↔ 생성 업데이트 반복 후 전달"],
  },
  {
    title: "프롬프트 엔지니어링(Prompt Engineering)",
    course: "AI",
    definition:
      "컴퓨터와 상호작용을 하는 사용자를 위한 AI 인터페이스 개발 분야로 높은 수준의 결과물을 얻기 위해 적절한 프롬프트를 구성하는 작업 또는 엔지니어링 기법",
    defShort: "높은 수준의 결과물 위해 적절한 프롬프트를 구성하는 엔지니어링 기법",
    lead: "적절한 프롬프트 구성 작업, 프롬프트 엔지니어링",
    features: ["모델 재학습 불요", "입력 설계 중심", "출력 품질 좌우"],
    keywords: ["생성형AI", "Task Description", "Input Indicator", "Output Indicator", "Zero-shot Prompting"],
    tables: [
      {
        caption: "구성요소 [태인커아 제원퓨C]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["질문", "Task Description", "수행 원하는 상황 상세 설명"],
          ["질문", "Input Indicator", "입력 데이터 지시자 설명"],
          ["질문", "Current Input", "프롬프트 통한 질문 내용"],
          ["질문", "Output Indicator", "생성 결과물 유형·형식 요소"],
          ["프롬프트 방식", "Zero-Shot Prompting", "추가 학습·예제 없이 답변 생성"],
          ["프롬프트 방식", "One-Shot Prompting", "하나의 예제·템플릿 기반 답변"],
          ["프롬프트 방식", "Few-Shot Prompting", "수개 예제 바탕 답변 생성"],
          ["프롬프트 방식", "CoT(Chain-of-Thought)", "답변 도달 과정 학습 중심 기술"],
          ["추론 방식", "CoT(Chain-of-Thought)", "답변 도달 과정 학습 중심 기술"],
          ["추론 방식", "Zero-Shot CoT", "예시·사전 학습 없이 단계별 추론"],
          ["추론 방식", "ToT(Tree of Thought)", "사고 경로 분기 후 최적 경로 선택"],
          ["추론 방식", "Self Consistency", "여러 추론 결과 종합 일관된 답변"],
          ["추론 방식", "Meta-Reasoning over Multiple Chains", "여러 추론 체인 비교 분석 최적 결론"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["구분", "고려사항"],
        rows: [
          ["가이드라인", "대화 스타일 조정\n미사여구 최소화\n닫힌 지시문"],
          ["가이드라인", "구체적인 지시사항\n예제를 함께 제공"],
          ["고도화", "마켓 플레이스 활용\n프레임워크 활용"],
        ],
      },
    ],
    notes: ["구성도: Prompt(Task Description · Input Indicator · Current Input · Output Indicator) → Language Model → Generated Text(Completion)"],
  },
  {
    title: "컨텍스트 엔지니어링(Context Engineering)",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)의 입력과 작동 방식에 있어, 사용자 의도와 목적에 따라 문맥(Context)을 정형화, 조작, 구성하여 정확도·일관성·목적 적합성을 향상시키는 기법",
    defShort: "사용자 의도와 목적에 따라 문맥을 정형화해 LLM 정확도를 높이는 기법",
    lead:
      "문맥 설계의 최적화, 컨텍스트 엔지니어링",
    features: ["문맥 중심 설계", "외부 지식 동적 주입", "토큰 최적화"],
    keywords: ["맥락(Context)을 설계·활용·최적화"],
    tables: [
      {
        caption: "핵심전략",
        headers: ["핵심 전략", "설명"],
        rows: [
          ["컨텍스트 작성(Context Writing)", "목적별 일정 저장소 기록·정리"],
          ["컨텍스트 선택(Context Retrieval)", "진행 상황별 적합 문맥 제공"],
          ["컨텍스트 압축(Context Compression)", "토큰 최적화 위한 불필요 정보 요약"],
          ["컨텍스트 분리(Context Segmentation)", "작업·역할·프로세스별 분리 관리"],
        ],
      },
      {
        caption: "구성요소 및 구현기술",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["핵심 구성요소", "맥락 검색 및 생성(Context Retrieval and Generation)", "외부 지식 검색 최적 맥락 주입"],
          ["핵심 구성요소", "맥락 처리(Context Processing)", "긴 텍스트·구조 정보 통합 처리"],
          ["핵심 구성요소", "맥락 관리(Context Management)", "계층적 메모리·정보 압축 관리"],
          ["구현 기술", "검색 증강 생성(RAG)", "외부 DB 정보 동적 프롬프트 융합"],
          ["구현 기술", "메모리 시스템", "지속 상호작용 맥락 유지"],
          ["구현 기술", "도구 통합 추론", "외부 API 호출 복합 추론"],
          ["구현 기술", "다중 에이전트 시스템", "에이전트 간 협업 작업 분담"],
        ],
      },
      {
        caption: "컨텍스트 엔지니어링과 프롬프트 엔지니어링 비교",
        headers: ["비교 항목", "컨텍스트 엔지니어링", "프롬프트 엔지니어링"],
        rows: [
          ["핵심 대상", "문맥·배경 정보", "입력 명령문"],
          ["목적", "이해력·일관성", "출력 품질 향상"],
        ],
      },
    ],
    notes: ["개념도: 프롬프트 + 메모리 시스템·RAG·도구 통합 추론 → 맥락 검색 및 생성·맥락 처리 → LLM 추론 → 출력 → 맥락관리", "출제 이력: 2026.02 ITPE FR 5일차 1교시, 2025.08 ITPE FR 2일차 1교시"],
  },
  {
    title: "파인 튜닝(Fine-tuning)",
    course: "AI",
    definition:
      "일반적인 학습 과정에서 얻은 모델의 가중치를 초기 설정으로 사용하고, 새로운 데이터셋에 대하여 추가적인 학습을 진행하며 조정하는 과정",
    defShort: "가중치를 새로운 데이터셋에 추가적인 학습을 진행하며 조정하는 과정",
    lead:
      "사전학습 모델의 재조정, 파인 튜닝",
    features: ["전이 학습 기반", "사전 가중치 재사용", "특정 작업 최적화"],
    keywords: ["특정 작업 최적화", "전이 학습", "지도 파인 튜닝", "비지도 파인 튜닝", "미세조정"],
    tables: [
      {
        caption: "절차 [사조학최]",
        headers: ["구분", "핵심", "활용사례"],
        rows: [
          ["데이터처리", "사전 훈련된 모델", "범용 데이터 학습"],
          ["인터렉션", "타깃 데이터셋", "특정 작업 도메인"],
          ["인터렉션", "추가 학습", "타깃 데이터 학습"],
          ["인터렉션", "성능 평가", "튜닝 모델 검증"],
        ],
      },
      {
        caption: "파인튜닝 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["전체 갱신", "Full Fine-tuning", "전 레이어 갱신 전 매개변수 조정\n작업 차이 클 때 높은 유연성 필요"],
          ["부분 갱신", "Repurposing", "상위 레이어 튜닝 하위 레이어 유지\n작업 유사 시 적합 소규모 데이터셋"],
        ],
      },
      {
        caption: "파인튜닝 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["레이블 유", "지도 파인튜닝", "레이블 데이터셋 레이블 기반 조정\n목표 출력 학습 특정 작업 적응"],
          ["레이블 무", "비지도 파인튜닝", "레이블 없는 셋 명시적 출력 없음\n고유 구조 활용 특징 추출·표현"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["구분", "고려사항", "설명"],
        rows: [
          ["학습측면", "학습률", "가중치 훼손 방지"],
          ["데이터 측면", "데이터 양", "타깃 셋 크기"],
          ["모델 측면", "모델의 복잡성", "적절한 복잡성"],
        ],
      },
      {
        caption: "프롬프트 튜닝(Prompt-tuning) – 파인튜닝과 병행",
        headers: ["유형", "내용"],
        rows: [
          ["개념", "학습 가능 프롬프트 추가 성능 개선\n모델 자체 변경 없음, 임베딩 벡터\nLLM 작업 수행 유도 텍스트나 명령"],
          ["목적", "요구·목적 따라 입력 조정 최적화"],
        ],
      },
    ],
    notes: ["절차 흐름: 사전 학습 모델 → 출력 계층 조정 → 모델 학습 → 모델 최적화 (사전 단계 → 파인튜닝 단계)", "프롬프트 튜닝(Prompt-tuning)과 병행: 사전 학습된 모델 자체를 변경하지 않고 학습 가능한 프롬프트(임베딩 벡터)를 추가하여 성능 개선"],
  },
  {
    title: "프롬프트 튜닝(Prompt Tuning)",
    course: "AI",
    definition:
      "초거대 언어모델(LLM)의 파라미터는 고정시킨 상태에서 새로운 작업에 적응시키기 위해 프롬프트(명령이나 요청 등의 텍스트)를 조정하여 모델이 원하는 방식으로 응답하도록 하는 기법",
    defShort: "파라미터는 고정하고 프롬프트를 조정해 새로운 작업에 적응시키는 기법",
    lead:
      "모델 고정의 경량 적응, 프롬프트 튜닝",
    features: ["모델 파라미터 고정", "최소 자원 소요", "오버피팅 불가"],
    keywords: ["최적화", "프롬프트 조합"],
    tables: [
      {
        caption: "프롬프트 튜닝과 파인튜닝 비교",
        headers: ["비교 항목", "프롬프트 튜닝(Prompt Tuning)", "파인 튜닝(Fine Tuning)"],
        rows: [
          ["목적", "프롬프트 조합\n출력 향상 목적", "특정 데이터 학습\n도메인 최적화"],
          ["방법", "소프트 프롬프트\n학습 가능 입력", "파라미터 재학습\n새 도메인 데이터"],
          ["모델의 구조 변경", "모델 고정·유지", "베이스 모델 변경"],
          ["소요 리소스", "경량·최소 자원", "대량 자원·시간"],
          ["정확도", "프롬프트 품질", "학습 데이터 품질"],
          ["기반 기술", "원샷·제로샷\nCoT 사고 사슬", "전이 학습 기반\nLoRA 적응"],
          ["오버 피팅", "모델 고정→불가", "스몰데이터 가능"],
          ["유연성 & 확장성", "다양한 작업 적용", "타 작업 전환 불가"],
        ],
      },
    ],
    notes: ["개념도: 프롬프트 튜닝은 프롬프트 조합을 변경(모델 고정), 파인튜닝은 특정 데이터 셋 추가 학습(모델 변경) — 파인튜닝과 다르게 입력 프롬프트 조합을 변경하는 것이 핵심", "방법: Mixed-task Batch — 소프트 프롬프트(learnable input)를 추가하여 모델 출력을 향상", "출제 이력: 2025.04 ITPE 모의고사 1교시"],
  },
  {
    title: "랭체인(LangChain)",
    course: "AI",
    definition:
      "언어모델을 활용한 서비스 개발 시 여러 언어 모델과 통합을 간소화 하도록 설계된 SDK이자 다양한 언어모델을 기반으로 하는 애플리케이션 개발을 위한 프레임워크",
    defShort: "여러 언어 모델과 통합을 간소화하도록 설계된 SDK이자 프레임워크",
    lead: "LLM 앱 개발 프레임워크, 랭체인",
    features: ["다중 LLM 통합", "체인 컴포넌트 연결", "외부 데이터 연결"],
    keywords: ["Agent", "Memory", "Model I/O", "Data Connection", "Chains", "Callbacks"],
    tables: [
      {
        caption: "구성요소 [모커에 체메콜]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["메인 모듈", "Model I/O", "언어모델 인터페이스 빌딩 블록"],
          ["메인 모듈", "Data Connection(데이터 연결)", "애플리케이션 데이터 인터페이스\n사용자별 데이터 필요\n로드·변환·저장·쿼리 빌딩 블록"],
          ["메인 모듈", "Agent(에이전트)", "체인이 사용할 도구 선택 지원\n언어모델로 수행할 작업 선택"],
          ["추가 모듈", "Chains", "기능 컴포넌트를 체인으로 연결"],
          ["추가 모듈", "Memory(메모리)", "체인 실행 시 이전 상황 기억\n애플리케이션 상태 유지"],
          ["추가 모듈", "Callbacks", "체인 중간단계 기록·스트리밍\n로깅·모니터링·스트리밍 연결"],
        ],
      },
      {
        caption: "주요기능",
        headers: ["주요기능", "설명"],
        rows: [
          ["다양한 데이터소스와 통합", "데이터베이스·API·파일 시스템\n실시간 데이터 활용 지원"],
          ["유연한 프롬프팅 및 컨텍스트 관리", "프롬프팅·컨텍스트 관리 도구\n맞춤형 응답, 사용자 경험 향상"],
          ["파인튜닝 및 커스터마이징", "비즈니스 요구 맞는 모델 구축\n작업별 모델 조정, 최적화·유연성"],
          ["데이터 반응형 애플리케이션 구축", "실시간 데이터 처리\n반응형 애플리케이션 구축"],
        ],
      },
    ],
    notes: ["흐름도: ① Data Sources 외부 데이터 가져오기(Fetch External Data) → ② Word Embeddings 생성 → ③ Vector Database 저장·검색(Store and Retrieve Vectors) → ④ LLM에 프롬프트 전송·응답 수신(Send Prompt and Retrieve Response)"],
  },
  {
    title: "LangGraph",
    course: "AI",
    definition:
      "여러 에이전트가 협업하여 작업을 수행하는 기능을 수행하기 위한 멀티 에이전트 시스템을 구축하는 데 사용되는 LangChain 기반의 상태 관리 및 워크플로우 라이브러리",
    defShort: "멀티 에이전트 구축용 LangChain 기반 워크플로우 라이브러리",
    lead:
      "멀티 에이전트 협업 도구, LangGraph",
    features: ["그래프 기반 흐름", "상태 관리", "멀티 에이전트 협업"],
    keywords: ["Agent", "멀티 Agent", "협업 Agent", "워크플로우 라이브러리", "노드", "엣지", "디자이너"],
    tables: [
      {
        caption: "구성",
        headers: ["구분", "설명"],
        rows: [
          ["목적", "NLP 작업 설계 및 실행 간소화\n데이터 흐름·프로세스 가시화\n모듈 간 상호작용 최적, AI Agent화"],
          ["상세 구성요소", "노드(Node): NLP 작업 개별 모듈\n엣지(Edge): 데이터 흐름·종속\n데이터레이어: 입출력 정의\n워크플로우 디자이너: UI 설계"],
          ["상세 구성요소", "API 통합: 외부 서비스·모델 연결"],
          ["주요기능", "NLP 파이프라인 구성·연계·관리\n멀티 에이전트 통합 데이터 전처리\n모델 학습/평가, 결과 시각화\n병렬 처리·재사용성 극대화"],
        ],
      },
      {
        caption: "LangChain과 LangGraph 비교",
        headers: ["구분", "LangChain", "LangGraph"],
        rows: [
          ["주요 목적", "LLM앱 구축\n체인 작업 흐름", "NLP 시각 설계\n그래프 흐름"],
          ["구조적 접근법", "체인 기반 연결\n순차·병렬", "그래프 기반\n노드·엣지"],
          ["사용사례", "API 상호작용\n정보 검색·요약", "NLP 작업 설계\n데이터 흐름 관리\n모듈화 최적화"],
          ["유연성", "코드 기반 정의", "시각 인터페이스"],
          ["확장성", "오픈소스 통합", "다중 소스 연결"],
        ],
      },
    ],
    notes: ["개념도: Question → Thought → Action → Observation → (If Finish Action) Finish — 자연어 처리를 위한 워크플로우 시각화 및 관리 도구, 그래프 기반 접근 방식, 다양한 NLP 모델 및 알고리즘 통합을 통한 Agent AI 지원"],
  },
  {
    title: "LAM(Large Action Model)",
    course: "AI",
    definition:
      "LLM의 언어 이해 능력에 실제 행동 수행 능력을 결합한 모델로 물리적인 세계와 상호작용하는 인공지능 모델",
    defShort: "LLM 언어 이해에 실제 행동 수행 능력을 결합한 물리 세계 상호작용 모델",
    lead: "언어 이해 넘어 행동 수행, LAM",
    features: ["행동 수행 결합", "계층적 작업분해", "물리 세계 상호작용"],
    keywords: ["AI Agent", "의도분류", "계층적작업분해", "Neuro-symbolic Programming", "RLHF"],
    tables: [
      {
        caption: "LAM 단계",
        headers: ["단계", "핵심", "설명"],
        rows: [
          ["입력처리 단계", "데이터 수집", "원시 상태·데이터 구성·수집"],
          ["분석 단계", "도메인 특화\n프롬프트 설계", "데이터·피드백 바탕 프롬프트\n프로세스 그래프·API로 생성"],
          ["실행 단계", "행동 생성", "현재 상태 관찰\n생성형 AI 기반 행동 생성"],
        ],
      },
      {
        caption: "핵심기술",
        headers: ["구분", "핵심기술", "설명"],
        rows: [
          ["Input Processing", "멀티모달 인코딩", "음성·이미지 통합표현 공간 매핑"],
          ["Input Processing", "의도 분류", "사전 정의 의도 카테고리와 매칭"],
          ["Input Processing", "동적 컨텍스트 윈도우", "상황·프로필 기반 컨텍스트 선택"],
          ["Planning & Reasoning", "Chain of Thought (CoT) Reasoning", "단계별 문제 해결 과정 설명"],
          ["Planning & Reasoning", "계층적 작업분해", "큰 작업을 여러 작업으로 순차실행"],
          ["Planning & Reasoning", "Neuro-symbolic Programming", "뉴럴·심볼릭 AI 결합 논리적 추론"],
          ["Action Execution", "API 오케스트레이션", "외부 시스템 연계 작업 수행 관리"],
          ["Action Execution", "동적 계획 수립", "변경 환경 따른 실시간 계획 조정"],
          ["Action Execution", "원자적 액션 실행", "각 작업 독립 실행 단위로 처리"],
          ["Self-Correction & Feedback Learning", "다차원 평가 메트릭", "여러 기준 조합 모델 성능 평가"],
          ["Self-Correction & Feedback Learning", "Contextual Memory & Adaptive Learning", "과거 상호작용 기억\n사용자 스타일 맞춤 업데이트"],
          ["Self-Correction & Feedback Learning", "RLHF", "사용자 피드백 기반 학습"],
        ],
      },
    ],
    notes: ["발전 단계: LLM(자연어 이해·처리 특화, 텍스트 기반 콘텐츠 생성) → LMM(Large Multimodal Model — 다양한 데이터 통합 처리, 직관적인 사용자 경험 제공) → LAM(실제 행동 계획 및 작업실행, 복잡한 태스크 자동화)", "출제 이력: 2025.04 KPC 모의고사 3교시, 2024.07 ITPE FR 1일차 1교시"],
  },
  {
    title: "대형개념모델(LCM, Large Concept Models)",
    course: "AI",
    definition:
      "\"개념(Concept)\"을 의미 단위로 사용하여 토큰 기반 제약을 벗어나 보다 의미론적인 추론을 수행하는 모델",
    defShort: "개념을 의미 단위로 사용해 토큰 제약을 벗어나 의미론적인 추론 수행 모델",
    lead: "토큰 넘는 개념 단위 추론, 대형개념모델",
    features: ["계층 구조", "제로샷 일반화", "확장성"],
    keywords: ["SONAR 임베딩 공간", "메타AI"],
    tables: [
      {
        caption: "아키텍처 [소프트포]",
        headers: ["구성", "설명"],
        rows: [
          ["① SONAR 인코더 및 디코더", "문장·개념 임베딩 간 변환 담당"],
          ["② PreNet [입력전처리]", "입력 정규화해 모델 내부 차원 매핑"],
          ["③ Transformer 기반 디코더", "문장 임베딩 처리\n다음 문장 임베딩 예측"],
          ["④ PostNet [출력]", "예측 임베딩 디노멀화하여 출력"],
        ],
      },
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["구조", "계층 구조", "계층적 표현 긴 문맥 가독성"],
          ["성능", "트랜스포머 단점 해결", "연산량 급증 계산 부담 해소"],
          ["일반화", "제로샷 일반화", "미학습 언어 새 모달 대응"],
          ["구조", "확장성", "인코더 모듈화 간섭 회피 확장"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["연속 표현", "Base-LCM", "단순한 자회귀적 문장 예측 모델"],
          ["연속 표현", "Diffusion-based LCM", "연속 임베딩 공간 의미 생성·변환"],
          ["연속 표현", "One-Tower Diffusion", "단일 Transformer 단순 구조\n간결성·학습 효율 우수\n복잡한 문맥 처리 제한적"],
          ["연속 표현", "Two-Tower Diffusion LCM", "문맥 처리·노이즈 제거 독립 모듈\n정교한 문맥 처리·고품질 생성\n컨텍스트라이저·디노이저 구성"],
          ["이산 표현", "Quant-LCM", "SONAR 연속 표현 이산적 변환\n모델링 효율성 향상"],
        ],
      },
    ],
    notes: ["SONAR 임베딩 공간: 200개 언어에 대한 텍스트 입력과 출력, 76개 언어의 음성 입력을 지원 → 문장 간 유사성을 효율적으로 측정하는 데 탁월"],
  },
  {
    title: "대규모 언어 모델(LLM) 성능 향상 기술",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)의 추론 능력 부족, 정보의 정확성 문제, 지식의 일관성 유지 어려움 등의 한계를 극복하기 위한 기술",
    defShort: "추론 능력·정보 정확성·지식 일관성 등 LLM 한계를 극복하는 기술",
    lead:
      "LLM 한계 극복의 기술군, LLM 성능 향상 기술",
    features: ["환각 완화 지향", "기존 모델 보강", "정확성·비용 균형"],
    subDefs: [
      {
        name: "추론 능력 강화(Reasoning Enhancement)",
        lead: "논리적 사고 과정의 유도",
        def: "모델이 논리적 사고 과정을 통해 정확하고 신뢰성 있는 응답을 만드는 기술",
      },
      {
        name: "외부 지식 활용 및 정밀 검색(RAG)",
        lead: "외부 지식의 문맥 보강",
        def: "외부 DB 참조해 최신 정보 반영, 문맥을 보강해 더 정확한 응답 생성 기술",
      },
      {
        name: "모델 병합 및 결합(Merging & Integration)",
        lead: "사전 훈련 모델의 결합",
        def: "여러 사전 훈련된 모델을 결합해 성능을 높이거나 태스크에 맞추는 기술",
      },
      {
        name: "효율성 및 비용 절감(Optimization & Efficiency)",
        lead: "계산 비용의 절감",
        def: "모델 계산 비용을 줄이면서도 성능을 유지하거나 향상시키는 최적화 기술",
      },
      {
        name: "멀티모달 통합(Multimodal Integration)",
        lead: "여러 모달의 동시 처리",
        def: "텍스트뿐 아니라 이미지·음성·영상을 함께 처리하도록 확장하는 기술",
      },
    ],
    keywords: ["추론 능력 강화", "RAG", "모델 병합 및 결합", "효율성 및 비용 절감", "멀티모달 통합"],
    tables: [
      {
        caption: "주요기법 [추R모효멀]",
        headers: ["기술 그룹", "정의", "주요 기법"],
        rows: [
          ["추론 능력 강화(Reasoning Enhancement)", "논리적 사고 과정\n정확·신뢰 응답", "Chain of Thought (CoT)\nTree of Thought (ToT)\nLeast-to-Most Prompting"],
          ["외부 지식 활용 및 정밀 검색(Retrieval-Augmented Generation, RAG)", "외부 DB 참조\n최신 정보 반영\n문맥 보강", "RAG\nKnowledge-Intensive NLP"],
          ["모델 병합 및 결합(Merging & Integration)", "훈련 모델 결합\n성능 향상\n태스크 맞춤 조정", "Model Merging\nDARE (Drop And REscale)\nEvolutionary Model Merging"],
          ["효율성 및 비용 절감(Optimization & Efficiency)", "계산 비용 절감\n성능 유지·향상", "Mixture of Experts (MoE)\nSparse Attention\nQuantization (양자화)\nLoRA"],
          ["멀티모달 통합(Multimodal Integration)", "텍스트·이미지·음성·영상\n함께 처리 확장", "CLIP\nFlamingo\nBLIP-2"],
        ],
      },
      {
        caption: "Reasoning 기술 상세",
        headers: ["Reasoning 종류", "설명", "대표적인 모델/기법"],
        rows: [
          ["사고사슬(Chain of Thought: CoT)", "중간 추론 과정\n단계별 서술", "GPT-3, GPT-4\nPaLM"],
          ["디컴포지션(Decomposition)", "하위 문제 분해\n단계별 해결", "Least-to-Most\nSelf-Ask"],
          ["메타-리즌(Meta-Reasoning)", "자기 추론 검토\n수정해 답변", "Self-Reflection\nReAct"],
          ["귀납적 추론(Inductive Reasoning)", "패턴·규칙 발견\n일반화 결론", "In-Context Learning\nTransformer 기반"],
          ["상호 추론(Mutual Reasoning)", "두 모델이 서로\n추론 검증", "rStar(Microsoft)"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.05 ITPE FR 2일차 1교시"],
  },
  {
    title: "PEFT(Parameter-Efficient Fine-Tuning)",
    course: "AI",
    definition:
      "사전학습 된 모델의 전체 파라미터를 업데이트하지 않고 일부만 조정하여, 적은 자원으로 효과적인 파인튜닝을 실현하는 방법",
    defShort: "사전학습 모델 파라미터 일부만 조정해 적은 자원으로 파인튜닝하는 방법",
    lead:
      "일부 조정의 효율 튜닝, PEFT",
    features: ["일부만 파인튜닝", "사전학습 모델 고정", "태스크별 선택 적용"],
    keywords: ["일부만 파인튜닝"],
    tables: [
      {
        caption: "상세설명",
        headers: ["구분 항목", "PEFT"],
        rows: [
          ["범위", "파인튜닝 기법 통칭"],
          ["적용 방식", "일부만 학습 모듈·파라미터\n나머지 고정 프리픽스 튜닝"],
          ["확장성", "선택적 적용 태스크별 대응"],
          ["파라미터 효율성", "수 % 수준 갱신 전체 대비 소량"],
          ["학습 영향", "구조·목적별 영향도 상이"],
          ["기술 목적", "비용·시간 절감 커스터마이징"],
        ],
      },
      {
        caption: "PEFT 기법",
        headers: ["구분", "방법론", "설명"],
        rows: [
          ["Adapter", "Bottleneck 구조", "PLM 중간에 작은 신경망 삽입\n입력 변환 후 원래 흐름에 합침"],
          ["Prefix Tuning", "Softmax/게이팅", "입력 앞단에 학습 가능한 벡터 추가\nSoftmax로 영향 조정"],
          ["LoRA", "저랭크 행렬 추가", "가중치 대신 저랭크 행렬 추가 학습\nScaling 통해 영향 조정"],
          ["Parallel Adapter", "병렬 어댑터", "PLM 병렬 ReLU 기반 어댑터 연결\n두 결과를 합침"],
          ["Scaled PA", "스케일 조정 병렬", "Parallel Adapter에 Scaling 추가\n영향력 미세 조정"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.10 ITPE 모의고사 1교시"],
  },
  {
    title: "LoRA(Low-rank adaptation)",
    course: "AI",
    definition:
      "전체 모델을 재 훈련하지 않고 특정 용도에 맞게 대규모 머신 러닝 모델을 조정하는 방법",
    defShort: "전체 모델 재훈련 없이 특정 용도에 맞게 대규모 머신 러닝 모델 조정 방법",
    lead:
      "저랭크 행렬의 경량 튜닝, LoRA",
    features: ["재훈련 불요", "원본 가중치 동결", "저차원 행렬 삽입"],
    keywords: ["매개변수 일부만 파인튜닝", "PEFT"],
    tables: [
      {
        caption: "Fully Fine-Tuning 이 힘든 이유",
        headers: ["구분", "설명"],
        rows: [
          ["① LLM의 가중치(Weight)는 1.5~3B", "GPU 로드만으로도 큰 비용 발생"],
          ["② 모델의 Forward, Backward, 가중치, gradient 모두 GPU에 저장", "가중치 수 × 2~3배 GPU vram 필요"],
        ],
      },
      {
        caption: "원리",
        headers: ["구분", "설명"],
        rows: [
          ["Pretrained Weights (W ∈ R^d×d)", "Query·Key·Value·Output layer\n차원(d×k)\n학습 시 Freeze\nWeight update 안됨 → vram save"],
          ["LoRA A Layer", "차원: d×r\nA = N(0, σ²) 초기화"],
          ["LoRA B Layer", "차원: r×k\nB = 0 초기화"],
          ["결과", "Pretrain Model에 weight 더함\nLoRA A·B layer weight만 업데이트"],
        ],
      },
    ],
    notes: ["사전 훈련된 모델의 가중치를 고정한 상태에서 Transformer 아키텍처 각각의 레이어에 훈련 가능한 행렬을 삽입해 다운스트림 과정에서의 매개변수 수를 크게 줄일 수 있는 방법. 모델의 매개변수를 저차원 구조로 유지함으로써 미세 조정 시 효율성을 높이는 기술", "W_q(query)·W_k(key)·W_v(value)·W_o(self-attention) 중 query와 key layer에 더해줬을 때 가장 좋은 성능(예: Trainable 18M, W_q·W_v Rank 4 — WikiSQL 73.7 / MultiNLI 91.3)"],
  },
  {
    title: "MOE(Mixture of Experts)",
    course: "AI",
    definition:
      "여러 개의 전문가 모델(Expert Model) 중에서 특정 입력에 대해 최적의 전문가를 선택하여 예측을 수행하는 모델 아키텍처",
    defShort: "특정 입력에 대해 최적의 전문가를 선택해 예측을 수행하는 모델 아키텍처",
    lead:
      "전문가 선택의 분업 구조, MOE",
    features: ["희소 연산 방식", "게이팅 전문가 선택", "대규모 모델 확장"],
    keywords: ["Expert", "Routing", "딥시크"],
    tables: [
      {
        caption: "개념도 [익라]",
        headers: ["구성", "설명"],
        rows: [
          ["Experts", "각 전문가 네트워크 독립 학습\n특정 Feature Space에 특화 학습"],
          ["Router", "입력 값 따라 사용할 전문가 결정\nSoftmax, Top-k"],
        ],
      },
      {
        caption: "특징 및 구성요소",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["특징", "Sparse Computation", "일부 전문가만 활성화해 계산 효율"],
          ["특징", "전문가 모델 활용", "각 전문가가 다른 하위 문제 담당\n모델 성능 향상"],
          ["특징", "게이팅 네트워크 활용", "입력 기반 적절한 전문가 선택 역할"],
          ["특징", "대규모 모델 확장 기능", "계산량 효과적 분배\n매우 큰 모델도 효율적 동작"],
          ["구성요소", "게이팅 네트워크", "입력 분석해 특정 전문가 활성화\nSoftmax로 전문가 가중치 결정"],
          ["구성요소", "전문가 네트워크", "여러 서브 모델로 구성\n특정 유형 문제 해결 학습\n서로 다른 데이터 패턴 학습"],
          ["구성요소", "출력 조합 모듈", "전문가 예측값 가중합해 최종 출력"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.04 ITPE 모의고사 1교시, 2025.04 KPC 모의고사 4교시"],
  },
  {
    title: "테스트 타임 컴퓨팅(Test-Time Compute)",
    course: "AI",
    definition:
      "**AI 모델**이 작업을 수행하는 추론(Inference) 시 **사용하는 연산 자원과 시간의 총량**",
    defShort: "AI 모델이 작업을 수행하는 추론 시 사용하는 연산 자원과 시간의 총량",
    lead: "추론 시 더 생각하게 하는 연산 확장, 테스트 타임 컴퓨팅",
    features: ["추론 시 연산 확장", "난이도별 연산 배분", "자가 검증·교정"],
    keywords: ["테스트 시간 적응(TTA)", "테스트 시간 추론(TTR)", "TENT", "프롬프트 적응", "CoT", "Self-Consistency", "Best-of-N", "Weighted Best-of-N", "STaR", "MCTS·ToT"],
    tables: [
      {
        caption: "테스트타임 컴퓨팅(Test-Time Compute) 목적",
        headers: ["목적", "설명"],
        rows: [
          ["가성비 향상", "난이도 따라 배분\n고품질 결과 획득"],
          ["할루시네이션 감소", "중간 추론 검증\n정확성·신뢰도"],
        ],
      },
      {
        caption: "Daniel Kahneman의 인간 인지 유형",
        headers: ["인지 유형", "인공지능 대응 유형", "설명"],
        rows: [
          ["System 1(빠른 사고)", "LLM 즉시 생성", "빠르고 자동적\n직관적 오류 취약"],
          ["System 2(느린 사고)", "TTC 추론 모델", "시간·연산 투입\n단계적 문제 해결"],
        ],
      },
      {
        caption: "Test-Time Compute 유형(분류)",
        headers: ["유형", "설명"],
        rows: [
          ["추론 시간 확장\n(TTA, Test-Time Action/Adaptation)", "실전 환경 맞춰\n파라미터 갱신\n데이터 변형 부여\n예측 개선"],
          ["추론 시간 재조정·수정\n(TTR, Test-Time Revision/Refinement)", "생성 답변(초안)\n자가 검증·교정\n출력 정확성 향상"],
        ],
      },
      {
        caption: "Test-Time Compute 유형",
        headers: ["분류", "TCC 기법", "특징", "설명"],
        rows: [
          ["테스트 시간 적응\n(TTA)", "TENT", "엔트로피 최소화\nBN 갱신\n무라벨", "테스트 데이터에 모델 일부 조정"],
          ["테스트 시간 적응\n(TTA)", "프롬프트 적응", "프롬프트 최적화\n본체 고정\n도메인 적응", "추론 환경 맞게 프롬프트 최적화"],
          ["테스트 시간 추론\n(TTR)", "CoT", "단계적 추론\n중간 과정\n순차 방식", "여러 추론 단계로 분해해 해결"],
          ["테스트 시간 추론\n(TTR)", "Self-Consistency", "병렬 샘플링\n다중 경로\n다수결", "여러 추론 결과 중 일관된 답 선택"],
          ["테스트 시간 추론\n(TTR)", "Best-of-N", "후보 생성\n보상 모델\n최적 답 선택", "여러 답변 중 최고 점수 답 채택"],
          ["테스트 시간 추론\n(TTR)", "Weighted Best-of-N", "빈도\n신뢰도\n일관성 가중", "후보의 빈도와 신뢰도 함께 반영"],
          ["테스트 시간 추론\n(TTR)", "STaR", "자기 생성\n평가\n피드백\n반복 개선", "생성 결과 피드백으로 추론 개선"],
          ["테스트 시간 추론\n(TTR)", "MCTS·ToT", "트리 탐색\n분기\n평가\n백트래킹", "여러 사고 경로 탐색 최적 경로 선택"],
        ],
      },
    ],
    notes: [
      "개념도: ① 입력(질문/프롬프트(문제)) → ② 모델 추론 시작(초기 응답 생성) → ③ TTC(추론 시 추가 연산) 추론 연산 확장 — 추가 연산을 통해 더 깊게 '생각': ① 단계적 추론(CoT) ② 다중 경로 탐색(후보 생성) ③ 반복 개선(자기검토·수정); 문제 난이도에 따라 연산량(시간·토큰·탐색 범위) 증가 → ④ 검증·평가(후보 답변의 타당성 평가) → ⑤ 최종 출력(최적 답변 생성). 추가 연산 반복(필요 시): 더 많은 시간·연산 자원을 투입하여 응답 품질 향상.",
      "원문 — 목적: 가성비 향상(문제 난이도에 따라 연산 자원을 유연하게 배분해 고품질 결과 획득), 할루시네이션 감소(중간 추론 과정을 생성·검증하여 답변의 정확성과 신뢰도 향상). Kahneman: System 1(빠른 사고) ↔ 일반 LLM의 즉시 생성(빠르고 자동적이지만 직관적 오류에 취약) / System 2(느린 사고) ↔ TTC 기반 추론 모델(시간과 연산을 투입해 단계적으로 복잡한 문제 해결). 유형(분류): 추론 시간 확장(TTA — 이미 학습된 AI 모델이 테스트 데이터 환경(실전)에 맞춰 스스로 파라미터를 업데이트하거나, 데이터에 다양한 변형을 주어 예측을 개선), 추론 시간 재조정·수정(TTR — 생성된 답변(초안)을 모델 스스로 검증하고 교정하여 출력의 정확성을 높이는 자가 검증 기법).",
      "기법 원문: TENT(엔트로피 최소화, BN 갱신, 무라벨 → 테스트 데이터에 맞춰 모델 일부를 조정), 프롬프트 적응(프롬프트 최적화, 본체 고정, 도메인 적응 → 추론 환경에 맞게 프롬프트를 최적화), CoT(단계적 추론, 중간 과정, 순차 방식 → 문제를 여러 추론 단계로 분해해 해결), Self-Consistency(병렬 샘플링, 다중 경로, 다수결 → 여러 추론 결과 중 일관된 답을 선택), Best-of-N(후보 생성, 보상 모델, 최적 답 선택 → 여러 답변 중 최고 점수의 답을 채택), Weighted Best-of-N(빈도, 신뢰도, 일관성 가중 → 후보의 빈도와 신뢰도를 함께 반영), STaR(자기 생성, 평가, 피드백, 반복 개선 → 생성 결과의 피드백으로 추론을 개선), MCTS·ToT(트리 탐색, 분기, 평가, 백트래킹 → 여러 사고 경로를 탐색해 최적 경로 선택).",
    ],
  },
  {
    title: "테스트 타임 스케일링(Test-Time Scaling, TTS)",
    course: "AI",
    definition:
      "모델을 추론(inference) 단계에서 더 나은 성능을 발휘하도록, 입력 크기·샘플 수·리소스 사용량 등을 시간 축에 따라 조정하는 기법",
    defShort: "추론 단계 성능 위해 샘플 수·리소스 등을 시간 축에 따라 조정하는 기법",
    lead:
      "추론 시점의 성능 조절, 테스트 타임 스케일링",
    features: ["파라미터 유지", "추론 시점 적용", "연산량 조절"],
    keywords: ["추론 성능 향상", "성능 향상", "연산량 조절"],
    tables: [
      {
        caption: "특징",
        headers: ["항목", "설명"],
        rows: [
          ["목적", "추론 성능 개선 파라미터 유지"],
          ["적용 시점", "모델 실행 시점 학습 후 적용"],
          ["핵심 전략", "다중 샘플링 여러 응답 생성\n탐색 디코딩 재정렬·수정"],
          ["장점", "성능 향상 가능 학습 없이 개선\n연산량 조절 저비용 고정밀"],
        ],
      },
      {
        caption: "대표 기법 [베빔체몬]",
        headers: ["분류", "대표 기법", "핵심 아이디어 & 설명"],
        rows: [
          ["Sampling 기반", "Best-of-N Sampling\nConfidence-based Sampling", "N개 응답 중 선택\n신뢰도 높은 응답"],
          ["Decoding 기반", "Beam Search\nSelf-Consistency Decoding", "중간 평가 확장\n다수결로 결정"],
          ["Reasoning 기반", "Chain-of-Thought(CoT)\nTree-of-Thought(ToT)\nGraph-of-Thought(GoT)", "단계별 사고 유도\n트리 분기 탐색\n그래프로 연결"],
          ["Search & Verification 기반", "Search Against Verifiers\nMonte Carlo Tree Search", "보상모델로 평가\nrollout 경로 확장"],
          ["Self-Improvement 기반", "Sequential Revision\nSelf-Refinement\nChain-of-Action-Thought", "응답·비판·수정\n반복 과정 수행\nfeedback loop 개선"],
          ["Compute 최적화 기반", "Compute-Optimal Scaling", "난이도 자동 판단\n쉬우면 순차 탐색\n어려우면 병렬"],
        ],
      },
      {
        caption: "사전학습과 TTS 비교",
        headers: ["구분", "사전학습(Pretraining)", "TTS(Test-Time Scaling)"],
        rows: [
          ["목적", "모델 자체의\n능력 확장", "추론 시점의\n성능 향상"],
          ["비용 구조", "초기 비용 높음", "유연한 비용 할당"],
          ["변경 여부", "모델 파라미터\n수정", "파라미터\n유지"],
          ["강점", "새로운 능력 획득", "응답 품질 향상"],
          ["단점", "재훈련 필요\n비용 큼", "느릴 수 있음\n최적화 필요"],
          ["대표 사례", "GPT-4\nLLaMA 학습", "CoT, Beam Search\nMCTS 등"],
        ],
      },
    ],
    notes: ["사전학습 모델을 활용하여 \"지금 이 순간\"에 더 잘 추론하게 만드는 기술", "기법 개념도: Best-of-N / Beam Search / Lookahead Search"],
  },
  {
    title: "MLPerf",
    course: "AI",
    definition:
      "AI 하드웨어와 소프트웨어의 학습(Training) 및 추론(Inference) 성능을 다양한 조건에서 평가할 수 있는 벤치마크",
    defShort: "AI HW·SW의 학습·추론 성능을 여러 조건에서 평가하는 벤치마크",
    lead:
      "AI 성능의 공인 벤치마크, MLPerf",
    features: ["학습·추론 평가", "HW·SW 함께 평가", "도달 시간 경쟁"],
    keywords: ["Training", "Inference", "CLOSED 방식", "OPEN 방식"],
    tables: [
      {
        caption: "평가항목 [학추]",
        headers: ["평가항목", "설명"],
        rows: [
          ["학습부문(Training)", "AI 모델 학습 소요 시간 평가"],
          ["추론부문(Inference)", "결과 도출 속도·정확도 평가"],
        ],
      },
      {
        caption: "평가지표 [훈처 추정처]",
        headers: ["구분", "지표"],
        rows: [
          ["학습부문(Training)", "훈련시간,\n처리량"],
          ["추론부문(Inference)", "추론속도,\n정확도, 처리량"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["벤치마크 측면", "이미지 분류", "최고 확률 분류"],
          ["벤치마크 측면", "객체탐지", "겹침 영역 평균"],
          ["벤치마크 측면", "음성인식", "단어 단위 비교"],
          ["벤치마크 측면", "자연어처리", "다음 단어 예측"],
          ["벤치마크 측면", "추천시스템", "분류 지표 활용"],
          ["벤치마크 측면", "강화학습", "승률 50% 종료"],
          ["학습방식 측면", "CLOSED 방식", "모델·데이터 고정 도달시간 경쟁"],
          ["학습방식 측면", "OPEN 방식", "CLOSED 제시 성능 외 항목 자유 설정"],
        ],
      },
    ],
    notes: ["출제 이력: 2025.06 KPC 모의고사 1교시"],
  },
  {
    title: "MLOps",
    course: "AI",
    definition:
      "머신 러닝 프로세스인 데이터 수집, 분석, 배포를 자동화하기 위하여 DevOps와 결합한 머신 러닝을 위한 IT 운영 프레임워크",
    defShort: "머신 러닝 프로세스 자동화 위해 DevOps 결합 IT 운영 프레임워크",
    lead:
      "머신러닝 운영의 자동화, MLOps",
    features: ["DevOps 결합", "파이프라인 자동화", "재현성 보장"],
    keywords: ["DevOps", "자동화", "CI/CD"],
    tables: [
      {
        caption: "파이프라인 [도파 데학평배]",
        headers: ["단계", "설명"],
        rows: [
          ["ML옵스 도구/솔루션 선택", "모델 자동화 프로세스 시작"],
          ["파이프라인 구축", "자동화 파이프라인 구성"],
          ["데이터 수집", "ML 옵스 자동화 구간의 시작"],
          ["모델 학습", "수집·정제된 데이터로 모델 학습"],
          ["모델 평가", "학습된 모델의 성능 검증"],
          ["모델 배포", "검증된 모델을 운영 환경에 배포"],
        ],
      },
      {
        caption: "단계",
        headers: ["단계", "설명"],
        rows: [
          ["0단계(빌드, 배포 수동)", "모델 개발, 학습, 배포가 수동\n수작업·형상관리 부재 비효율성"],
          ["1단계(ML 파이프라인 자동화)", "ML 파이프라인 구성\n자동화 및 재현성 보장\nFeature Store 활용 특징추출 관리"],
          ["2단계(CI/CD 파이프라인 자동화)", "CI/CD 통한 배포·모니터링 자동화\n실시간 성능 추적\n데이터 드리프트 감지"],
        ],
      },
    ],
    notes: ["구성도: ML(Data·Model) + DEV(Create·Plan·Verify·Package) + OPS(Release·Configure·Monitor)", "도입 배경: DSML(Data Science & Machine Learning) 기업 적용 시 경영진과 엔지니어의 인식 충돌, 조직의 문화적 거부, 시스템 간 충돌, 전문 인력 채용 곤란 → 인공지능 프로젝트 실패"],
  },
  {
    title: "LLMOps",
    course: "AI",
    definition:
      "대형 언어 모델(LLMs)의 설계부터 관리, 배포, 유지 관리를 통합하고 효율화하는 과정 및 패러다임",
    defShort: "대형 언어 모델 설계·관리·배포·유지 관리 통합하고 효율화하는 과정",
    lead: "대형 언어 모델 운영 체계, LLMOps",
    features: ["MLOps LLM 특화", "전 주기 자동화", "프롬프트 중심 관리"],
    keywords: ["LLM", "DevOps", "자동화", "CI/CD"],
    tables: [
      {
        caption: "LLMOps 단계별 구성요소",
        headers: ["구분", "구성 요소"],
        rows: [
          ["Data 수집, 처리", "정형, 비정형 Data 수집, 전처리"],
          ["기반모델", "기반모델 선정"],
          ["임베딩 처리", "벡터라이징 및 인덱싱\n벡터 데이터 베이스 저장"],
          ["프롬프트 관리", "프롬프트 엔지니어링\n프롬프트 체이닝"],
          ["테스트", "벌크 / 배치 테스트\n프롬프트 체이닝"],
          ["버전 관리", "CI / CD"],
          ["모니터링", "프롬프트 모니터링\n지연/안전성 모니터링"],
          ["최적화", "기반 모델 파인튜닝\n프롬프트 iteration"],
        ],
      },
      {
        caption: "데이터 수집 및 모델 개발 단계 구현 기술",
        headers: ["구분", "구현 기술", "설명"],
        rows: [
          ["Data 수집, 처리", "Spark / Kafka", "인메모리 기반 대용량 텍스트 처리\n실시간 스트리밍"],
          ["Data 수집, 처리", "S3 / Blob Storage", "클라우드 기반 object Storage"],
          ["기반모델", "open AI GPT 모델", "open AI에서 개발한 LLM 모델"],
          ["기반모델", "LLAMA 2 / LLAMA3", "Meta에서 개발한 LLAMA LLM 모델"],
          ["기반모델", "Gemini", "Google에서 개발한 Gemini 모델"],
          ["기반모델", "Hugging Face", "LLM 개발자 오픈소스 커뮤니티"],
          ["임베딩 처리", "Qdrant / Faiss index", "임베딩 결과 저장 벡터 Store"],
          ["임베딩 처리", "Milvus / Weaviate", "SaaS형 벡터 DBMS 서비스"],
          ["프롬프트 관리", "Gradient J / HoneyHive", "코드와 분리된 프롬프트 버전 관리"],
          ["프롬프트 관리", "Azure AI Studio", "UI/UX 기반 프롬프트 플로우 개발"],
        ],
      },
      {
        caption: "모델 운영 및 평가 단계 구현 기술",
        headers: ["구분", "구현 기술", "설명"],
        rows: [
          ["테스트", "Fiddler AI\nHumanloop", "RAI(Responsible AI) 기반기술"],
          ["버전 관리", "AWS code commit\nJenkins X", "클라우드 CI/CD 지속적 통합·배포"],
          ["모니터링", "AnyScale\nArize", "안전성·지연성·환각 모니터링"],
          ["최적화", "Autoblock\nTruEra", "앱 인터랙션 수집\n테스트 베드 전송하여 개선"],
        ],
      },
    ],
    notes: ["벤다이어그램: LLMOps = Machine Learning ∩ DevOps ∩ Data Engineering 교집합(MLOps의 LLM 특화판)", "구성도: Proprietary/Public Data → Data Processing Pipelines → Embeddings(Vector Stores) / Pre-Trained LLM → Fine-Tuning·Few-Shot Learning → Context-Specific LLM·SLM → LLM API → End User Apps + RLHF, Model Versioning·Caching·Monitoring"],
  },
  {
    title: "AutoML",
    course: "AI",
    definition:
      "기계학습 파이프라인에서 데이터의 특징 추출, 하이퍼 파라미터(Hyperparameter) 설정 등 소모적이고 반복적인 작업을 자동화하는 머신러닝 프로세스",
    defShort: "특징 추출·하이퍼 파라미터 설정 등 소모적·반복 작업 자동화 프로세스",
    lead:
      "머신러닝 과정의 자동화, AutoML",
    features: ["반복 작업 자동화", "ML 파이프라인 대상", "최적 모델 탐색"],
    keywords: ["피처 엔지니어링 및 하이퍼 파라미터 최적화를 자동화"],
    tables: [
      {
        caption: "프로세스 [피하신]",
        headers: ["프로세스", "주요 기법", "설명"],
        rows: [
          ["① 피처 엔지니어링(Feature Engineering)", "PCA\nk-means clustering\nMin-max 스케일링\nBoW(Bag of Words)", "EDA로 원시데이터 통계·시각 해석"],
          ["② 하이퍼 파라미터 최적화", "그리드 탐색\n랜덤 탐색\n베이지안 최적화", "일반화된 추론 성능 훈련 제어"],
          ["③ 신경망 구조 탐색", "검색 공간·전략\n성능 추정 전략", "신경망 아키텍처 탐색 기술"],
        ],
      },
      {
        caption: "현황",
        headers: ["현황", "기업", "설명"],
        rows: [
          ["Cloud AutoML", "Google", "자동 심층 전이 학습\n신경 아키텍처 검색 구현"],
          ["Azure Machine Learning", "Azure", "피처·알고리즘 탐색\n하이퍼파라미터 튜닝 포함"],
          ["Amazon SageMaker", "Amazon", "하이퍼파라미터 튜닝 수행\n여러 모델 자동 시도 지양\n특성 엔지니어링 자동 지양"],
        ],
      },
    ],
    notes: ["구성도: 학습데이터 →수집→ ①피처 엔지니어링 →정규화→ ②하이퍼파라미터 최적화 →미세튜닝→ ③신경망 구조 탐색 → 최적화 알고리즘 → 모델 → 예측"],
  },
  {
    title: "Diffusion 모델",
    course: "AI",
    definition:
      "텍스트 및 이미지 프롬프트에서 고유한 실사 이미지를 생성하는 생성형 인공지능(생성형 AI) 모델 (텍스트 정보를 바탕으로 인공지능이 그림을 생성하는 모델)",
    defShort: "텍스트 및 이미지 프롬프트에서 실사 이미지를 생성하는 생성형 AI 모델",
    lead: "노이즈 제거의 이미지 생성, Diffusion 모델",
    features: ["텍스트 조건 생성", "반복적 노이즈 제거", "잠재 공간 연산"],
    keywords: ["텍스트 to 이미지", "latent diffusion model", "CLIP", "U-Net", "VAE", "생성형 AI", "Diffusion", "가우시안 노이즈"],
    tables: [
      {
        caption: "기술요소",
        headers: ["기술", "기능"],
        rows: [
          ["Text Conditioning", "CLIP: Text Encoder\nTokenizer로 단어 추출·숫자 변환\nlatent vector형 text embedding"],
          ["U-net(+ Scheduler)", "U-Net: 이미지 노이즈 제거 핵심\nScheduler: 노이즈 방식 결정\nn번 반복 denoise 처리"],
          ["VAE(Variational Auto-Encoder)", "Encoder: 값의 특징 추출 학습\nDecoder: z로 원래 데이터 복원"],
          ["순방향 디퓨전", "이미지에 노이즈 첨가"],
          ["역방향 디퓨전", "순방향 디퓨전의 반복적 취소"],
        ],
      },
    ],
    notes: ["개념도: Prompt \"A dog wearing a hat\" → CLIP Model(Tokenizer → Token To Embedding) → Text Embeddings(1x77x768) → U-Net + Scheduler(노이즈 추가·제거 반복) → Conditioned Latents(1x4x64x64) → VAE → Output Image(3x512x512)", "Stable Diffusion·DALL-E·Midjourney가 이 구조 기반"],
  },
  {
    title: "VLM(Vision Language Model)",
    course: "AI",
    definition:
      "이미지인 **컴퓨터 비전과 자연어 처리 기능을 결합**하여 함께 처리할 수 있도록 설계된 멀티모델 AI 모델",
    defShort: "컴퓨터 비전과 자연어 처리 기능을 결합해 처리하는 멀티모달 AI 모델",
    lead: "이미지와 텍스트를 함께 이해하는 멀티모달 모델, VLM",
    features: ["비전·자연어 결합", "공유 임베딩 공간", "이미지 맥락 이해"],
    keywords: ["멀티모달 모델", "자연어처리", "이미지 처리", "LLM", "통합"],
    tables: [
      {
        caption: "VLM 의 구성요소",
        headers: ["구분", "구성요소", "관련기술"],
        rows: [
          ["모델 요소", "언어 인코더\n비전 인코더\n멀티모달 융합\n출력 레이어", "BERT·RoBERTa·MPNet\nViT / CNN / CLIP\nCross Attention·PrefixLM\nLLM 기반 디코더"],
          ["학습 방법", "대조적 학습\n마스킹\n생성형 모델 학습\n사전 학습 모델", ""],
        ],
      },
      {
        caption: "비전, 언어 통합 기술 (멀티모달융합)",
        headers: ["구분", "Cross Attention", "PrefixLM", "Contrastive Learning"],
        rows: [
          ["개념", "이미지 임베딩에\n디코더 attend", "이미지 임베딩을\n텍스트 앞에 결합", "이미지·텍스트\n쌍 유사도 학습"],
          ["입력 처리 방식", "이미지 임베딩을\n디코더 내부 참조", "이미지 프리픽스\n텍스트 순차 생성", "독립 인코딩 후\n벡터 비교"],
          ["활용 목적", "이미지 질의응답\n대화형 응답 생성", "자연어 생성\n캡션 생성", "이미지·텍스트\n매칭·검색·분류"],
          ["장점", "고정밀 정보 통합\n유연한 문맥 처리", "LLM 활용 가능\n프롬프트 확장", "효율적인 매칭\n제로샷 가능"],
          ["단점", "연산 복잡도 높음\nfine-tuning 필요", "텍스트만으론\n세부 문맥 부족", "텍스트 생성 불가\n표현력 제한적"],
        ],
      },
      {
        caption: "VLM도입 시 3대 핵심",
        headers: ["핵심", "설명"],
        rows: [
          ["맥락 이해", "상황 설명 능력이\n실무 가치 창출"],
          ["Few-shot + 파인튜닝 전략", "특화 데이터로\n빠르게 최적화"],
          ["적정 규모 선택", "7B~10B 모델로\n비용·성능 균형"],
        ],
      },
    ],
    notes: [
      "개념도: 이미지 → Image Encoder → Vision-Language Projector / 자연어 → Tokenizer + embedding layer → Positional Encoding → 둘이 Shared Embedding Space 에서 만나 Language Model(Decoder Component) → Text Output.",
      "원문: 멀티모달 융합 관련 기술 — Cross Attention, PrefixLM, Contrastive Learning. 통합 기술 비교 — 개념: 이미지 임베딩에 디코더가 주의(attend) / 이미지 임베딩을 텍스트 앞에 붙여 생성 / 이미지-텍스트 쌍 유사도 학습. 입력 처리: 이미지 임베딩을 언어 디코더 내부에서 참조 / 이미지 → 프리픽스 → 텍스트 생성 순 처리 / 독립 인코딩 후 벡터 비교. 활용: 멀티모달 질의응답·대화형 응답 생성 / 이미지 기반 자연어 생성·캡션 생성 / 이미지-텍스트 매칭·검색·분류. 장점: 고정밀 정보 통합·유연한 문맥 처리 / LLM 활용 가능·프롬프트 확장 용이 / 빠르고 효율적인 매칭·제로샷 가능. 단점: 연산 복잡도 높음·fine-tuning 필요 / 텍스트만으로는 이미지 세부 문맥 부족 / 텍스트 생성 불가·표현력 제한적. 3대 핵심: 맥락 이해(단순 탐지가 아닌 상황 설명 능력이 실무 가치 창출), Few-shot + 파인튜닝 전략(도메인 특화 데이터로 빠르게 최적화), 적정 규모 선택(7B~10B 모델로 비용과 성능 균형).",
    ],
  },
  {
    title: "파운데이션 모델(Foundation Model)",
    course: "AI",
    definition:
      "대규모 데이터셋을 사용해 사전에 학습을 하여 다른 서비스나 분야로 사용되기 위한 다목적 모델",
    defShort: "데이터셋을 사전 학습해 다른 서비스나 분야로 사용되기 위한 다목적 모델",
    lead: "사전 학습의 다목적 활용, 파운데이션 모델",
    features: ["창발성", "균일화", "전이학습"],
    keywords: ["자기지도학습", "adaptation", "기반모델", "창발성", "균일화", "FMOps"],
    tables: [
      {
        caption: "특징 [창균전]",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["능력", "창발성(emergence)", "스스로 지식 도출 문제 해결 능력"],
          ["활용", "균일화(homogenization)", "적용 범위 확대 범용 활용 현상"],
          ["학습", "전이학습(Transfer Learning)", "사전 학습 가중치 데이터 부족 완화"],
        ],
      },
      {
        caption: "기반기술",
        headers: ["구분", "기반 기술"],
        rows: [
          ["구현기술", "대용량 학습데이터 구축\n자기지도학습\n트랜스포머 아키텍처\n컴퓨팅 성능"],
          ["최적화", "지식 증류\nPruning 모델구조 변경\n양자화\nSparsity"],
        ],
      },
      {
        caption: "FMOps(Foundation Model Operations)",
        headers: ["구분", "설명"],
        rows: [
          ["흐름", "기반모델→Iteration→테스트\n배포→모니터링→최적화"],
          ["방법론", "프롬프트 엔지니어링\n프롬프트 체이닝·모니터링\n기반모델 파인 튜닝\n단계별 기법 개발 및 운용"],
        ],
      },
    ],
    notes: ["개념도: Data(Text·Images·Speech·Structured Data·3D Signals) →Training→ Foundation Model →Adaptation→ Tasks(질의응답·감성분석·정보추출·이미지 캡셔닝·객체 인식·지시 수행)"],
  },
  {
    title: "클래스 불균형(Class Imbalance)",
    course: "AI",
    definition:
      "탐색하는 타깃 데이터의 수가 매우 극소수인 상태",
    defShort: "탐색하는 타깃 데이터의 수가 매우 극소수여서 재현율이 작아지는 상태",
    lead:
      "치우친 데이터의 학습 왜곡, 클래스 불균형",
    features: ["타깃 극소수 분포", "재현율 급감", "비율 균형 조정"],
    keywords: ["정확도", "재현율", "Over sampling", "under sampling"],
    tables: [
      {
        caption: "해결방법 — 과대 표집(Over-Sampling) [렌아스블디]",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "소수 복제 생성 비율 균형 조정"],
          ["유형", "Random Over Sampling\nADASYN, SMOTE\nBLSMOTE, DBSMOTE"],
          ["특징", "정보 손실 없으나 과적합 초래 가능\n알고리즘 성능↑ 검증 성능 저하"],
        ],
      },
      {
        caption: "해결방법 — 과소 표집(Under-Sampling) [랜토이발]",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "다수 일부 선택 비율 균형 조정"],
          ["유형", "Random Under Sampling\nTomek Links\nEasyEnsemble, BalanceCascade"],
          ["특징", "데이터 소실 커 정상 데이터 유실\n과대 표집보다 계산 시간 감소"],
        ],
      },
      {
        caption: "해결방법 — 임곗값 이동(Cut-Off Value Moving)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "임곗값 이동 다수 쪽 이동"],
          ["특징", "테스트 단계 학습 후 조정"],
          ["예시", "기준 80점 우수·미흡 구분"],
        ],
      },
      {
        caption: "모델 성능 지표 선택",
        headers: ["예측 대상", "조건", "지표"],
        rows: [
          ["범주(Class Labels)", "두 범주 동등\n다수 80% 이상", "G-Mean\n기하 평균값"],
          ["범주(Class Labels)", "두 범주 동등\n다수 80% 미만", "정확도\n예측 정답률"],
          ["범주(Class Labels)", "FN·FP 동등", "F1 Score"],
          ["범주(Class Labels)", "양성 범주 중요\nFP 비용 큼", "F0.5\n정밀도 가중"],
          ["범주(Class Labels)", "양성 범주 중요\nFN 비용 큼", "F2 Score\n재현율 가중"],
          ["확률(Probabilities)", "확률 예측 필요", "Brier"],
          ["확률(Probabilities)", "범주 예측 필요\n양성 범주 중요", "PR AUC\n정밀·재현"],
          ["확률(Probabilities)", "범주 예측 필요\n두 범주 동등", "ROC AUC\n민감·특이"],
        ],
      },
    ],
    notes: ["클래스 불균형 문제: 불균형 데이터에서는 정확도(Accuracy)가 높아도 재현율(Recall)이 급격히 작아지는 현상 발생"],
  },
  {
    title: "멀티모달 데이터의 품질검증 방법",
    course: "AI",
    definition:
      "'멀티모달 데이터'의 **품질특성을 정의**하고, 대표 학습업무별 **의미 정확성과 생성형 멀티모달 모델의 유효성**을 검증하기 위한 방법을 제시하는 활동",
    defShort: "품질특성 정의, 의미 정확성과 생성형 멀티모달 모델의 유효성 검증 활동",
    lead: "표현·변환·정렬 품질특성과 생성 모델 유효성 지표, 멀티모달 데이터 품질검증",
    features: ["표현성", "변환(일치)성", "정렬(관계)성"],
    keywords: ["표현성", "변환", "정렬", "IS", "FID", "BLUE", "ROUGE-N", "PPL", "Meteor", "CIDEr", "Spice"],
    tables: [
      {
        caption: "품질특성",
        headers: ["품질특성", "설명"],
        rows: [
          ["표현성(Representation)", "유니모달 라벨링\n참값 부합 확인\n개체식별 판단"],
          ["변환(일치)성(Translation)", "멀티모달간 매핑\n정확성 판단"],
          ["정렬(관계)성(Alignment)", "둘 이상 인스턴스\n하위 구성요소\n관계·대응 평가\n시간·공간·관계"],
        ],
      },
      {
        caption: "이미지 생성 모델의 유효성 측정 지표 및 지표 선택 방법",
        headers: ["지표", "설명", "선택방법"],
        rows: [
          ["IS\n(Inception Score)", "Inception v3 활용\n품질·다양성\n동시 측정 지표", "객체 명확할 때\nn-gram 기반 정밀도"],
          ["FID(Fréchet\nInception distance)", "실제·생성 특징\n벡터 분포 유사성", "다른 모델과 성능\n정량적 비교 시"],
          ["Improved Precision\nand Recall", "정밀도·재현율\n두 축 독립 평가", "품질·다양성\n분석하고 싶을 때\nFID 총점만 나옴"],
          ["Density and\nCoverage", "이상치 취약 보완", "이상치 많을 때"],
        ],
      },
      {
        caption: "텍스트 생성 모델의 유효성 측정 지표 및 지표 선택 방법",
        headers: ["지표", "설명", "선택방법"],
        rows: [
          ["BLEU", "정답·생성 겹침\n정밀도 기반 지표", "정답 유사성 평가\nn-gram 기반 정밀도"],
          ["ROUGE-N", "정답·생성 겹침\n재현율 기반 지표", "정답 유사성 평가\nn-gram 기반 재현율"],
          ["PPL", "다음 예측 시\n오류 발생 정도", "모델 완성도 평가\n내적 평가 지표"],
          ["Meteor", "BLEU 단점 개선\n동의어·형태소", "번역 동의어 인정\n정밀도·재현율"],
          ["CIDEr", "이미지 캡셔닝\n모델 위한 지표", "이미지 하나에\n여러 설명 있을 때"],
          ["SPICE", "의미론적 관계\n문맥 구조\n씬 그래프 변환\n멀티모달 지표", "비전·언어 모델\n인과관계·속성"],
        ],
      },
    ],
    notes: [
      "품질특성 원문: 표현성(Representation) — 유니모달별 라벨링 정보와 실제 참값이 부합하는지 확인하는 특성(개체식별 판단) / 변환(일치)성(Translation) — 멀티모달간의 매핑이 정확한지를 판단 / 정렬(관계)성(Alignment) — 둘 이상의 양식에서 인스턴스의 하위 구성 요소간의 관계와 대응이 정확한지를 평가, 시간정렬·공간정렬·관계정렬.",
      "이미지 지표 원문: IS(Inception Score) — 이미지 분류 모델인 'Inception v3'를 활용해, 생성된 이미지의 품질과 다양성을 동시에 측정하는 전통적인 지표 → 명확한 객체(개, 고양이)가 존재할 때 사용하는 지표, n-gram 기반 정밀도 / FID(Fréchet Inception distance) — 실제 이미지 데이터셋과 생성한 이미지 데이터셋의 특징 벡터 분포가 얼마나 유사한지 측정하는 지표 → 다른 모델과 성능을 정량적으로 비교할 때 / Improved Precision and Recall — 생성 모델의 성능을 정밀도와 재현율 두 가지 독립된 축으로 나누어 정밀하게 평가 → 모델의 품질 또는 다양성을 분석하고 싶을 때, FID 총점만 나옴 / Density and Coverage — Improved Precision and Recall의 이상치 취약점을 보완한 지표 → 데이터에 이상치가 많아 측정이 어려울 때.",
      "텍스트 지표 원문: BLEU — 정답 문장과 생성 문장이 얼마나 겹치는지 정밀도 기반 지표 → 생성문장이 정답과 얼마나 유사한지 평가가 필요할 때, n-gram 기반 정밀도 / ROUGE-N — 정답 문장과 생성 문장이 얼마나 겹치는지 재현율 기반 지표 → n-gram 기반 재현율 / PPL — 모델이 다음을 예측할 때 얼마나 오류가 발생하는지 측정하는 지표 → 모델의 완성도를 평가하는 내적 평가(Intrinsic Evaluation) 지표 / Meteor — BLEU의 단점을 개선하여 동의어, 어근 변형, 형태소까지 고려하는 평가 지표 → 번역에서 동의어를 인정해 평가할 때, 정밀도와 재현율 모두 반영 / CIDEr — 이미지 설명을 다는 이미지 캡셔닝(Image Captioning) 모델을 위해 고안된 지표 → 하나의 이미지에서 여러 개의 설명이 있을 때 / SPICE — 문장의 '의미론적 관계'와 '문맥 구조'를 씬 그래프(Scene Graph) 형태로 변환하여 평가하는 최신 멀티모달 지표 → 비전-언어 모델에서 이미지의 인과관계나 속성을 평가하고자 할 때.",
    ],
  },
  {
    title: "혼동행렬(Confusion Matrix)",
    course: "AI",
    definition:
      "데이터 분석에서 잘못된 예측의 영향을 파악하기 위해 예측된 값과 실제 값이 일치하는지 여부를 행렬로 분류하는 모델 평가 기법",
    defShort: "예측된 값과 실제 값이 일치하는지 여부를 행렬로 분류하는 모델 평가 기법",
    lead:
      "분류 성능의 사분면, 혼동행렬",
    features: ["예측·실제 교차", "오류 유형 구분", "지표 산출 기반"],
    keywords: ["TP/FP/FN/TN", "Precision", "Accuracy", "Recall", "Specificity", "FP Rate", "F1 점수", "Kappa"],
    tables: [
      {
        caption: "개념도 — 실제 정답 × 예측 결과",
        headers: ["구분", "예측 TRUE", "예측 FALSE"],
        rows: [
          ["실제 TRUE", "TP 진양성", "FN 위음성"],
          ["실제 FALSE", "FP 위양성", "TN 진음성"],
        ],
      },
      {
        caption: "평가 지표",
        headers: ["평가 항목", "산출식", "설명"],
        rows: [
          ["Precision", "분자 TP\n분모 TP+FP", "예측 양성 정답\n전체 예측 양성"],
          ["Accuracy", "분자 TP+TN\n분모 전체 수", "옳은 예측 수\n전체 예측 건수"],
          ["Recall", "분자 TP\n분모 TP+FN", "진양성률 지표\n실제 양성 기준"],
          ["Specificity", "분자 TN\n분모 FP+TN", "실제 음성 적중\n실제 음성 전체"],
          ["FP Rate", "분자 FP\n분모 FP+TN", "오경보 건수\n실제 음성 전체"],
          ["F1 Score", "P·R 조화평균", "정밀·재현 균형"],
          ["Cohen's Kappa Coefficient", "분자 Accuracy−P(e)\n분모 1−P(e)", "우연 일치 보정\n불균형 보정"],
        ],
      },
    ],
    notes: ["ROC 커브: 이진 분류기의 성능을 표현하는 커브 — 가능한 모든 threshold에 대해 FPR과 TPR의 비율을 표현 / AUC: ROC 아래 면적 / PR Plot: 정밀도(Precision)와 재현율(Recall)의 관계를 나타내는 곡선"],
  },
  {
    title: "편향",
    course: "AI",
    definition:
      "개인이나 집단의 사전적인 견해, 선입견, 편견, 문화적 영향 등으로 인해 객관성이나 공정성에서 벗어난 경향을 의미",
    defShort: "선입견·편견·문화적 영향으로 객관성이나 공정성에서 벗어난 경향",
    lead:
      "공정성을 해치는 치우침, 편향",
    features: ["데이터 기반 전이", "탐지 어려움", "공정성 저해"],
    keywords: ["인간의 편향", "숨겨진 편향", "데이터 표본 편향", "롱테일 편향", "고의적 편향", "XAI"],
    tables: [
      {
        caption: "유형 [인숨데롱고]",
        headers: ["구분", "편향성 유형", "설명"],
        rows: [
          ["Data 관점", "인간의 편향", "원시 자료 개입"],
          ["Data 관점", "숨겨진 편향", "의도 없는 편향"],
          ["Data 관점", "데이터 표본 편향", "샘플링 기인"],
          ["Process 관점", "롱테일 편향", "범주 누락 발생"],
          ["Process 관점", "고의적 편향", "해킹 의도 주입"],
        ],
      },
      {
        caption: "해결방안 — XAI",
        headers: ["구분", "설명"],
        rows: [
          ["기존 인공지능", "결과만 제시 확률 값만 출력"],
          ["설명 가능한 인공지능(XAI)", "근거 함께 제시 생성 과정 설명"],
        ],
      },
    ],
  },
  {
    title: "XAI(eXplainable AI) 방법론",
    course: "AI",
    definition:
      "AI의 판단 과정과 근거를 **사람이 이해할 수 있게 설명**가능한 **인공지능**",
    defShort: "AI의 판단 과정과 근거를 사람이 이해할 수 있게 설명 가능한 인공지능",
    lead: "AI 판단 근거를 사람이 이해하게, XAI 방법론",
    features: ["판단 근거 제시", "사람 이해 중심", "성능·설명력 상충"],
    keywords: ["설명 가능", "특성 중요도(Feature Importance)", "LIME", "SHAP", "LRP", "탐색적 샘플링"],
    tables: [
      {
        caption: "XAI(eXplainable AI) 등장 배경",
        headers: ["등장 배경", "설명"],
        rows: [
          ["블랙박스 모델 확산", "근거 추적 곤란"],
          ["고위험 분야 활용 증가", "판단 신뢰성 확보"],
          ["AI 규제 강화", "투명성·책임성"],
        ],
      },
      {
        caption: "XAI(eXplainable AI) 방법론의 종류",
        headers: ["XAI 방법론", "중요 기술·키워드", "특징", "설명"],
        rows: [
          ["특성 중요도\n(Feature Importance)", "지니 불순도\n트리 분할\n순열 중요도", "전역 설명\n계산이 빠름\n트리 모델 적합", "예측에 영향 준\n특성 중요도 산정"],
          ["LIME", "슈퍼픽셀 마스킹\n대체 모델\n국소 선형 근사", "국소 설명\n모델 독립적\n결과 변동 가능", "예측 주변을\n단순 모델로 근사"],
          ["SHAP", "Shapley Value\n협력 게임이론\n특성 조합", "국소·전역 설명\n일관된 기여도\n계산량 큼", "게임이론으로\n특성 기여도 계산"],
          ["LRP", "관련성 전파\n층별 역전파\n히트맵", "신경망 특화\n픽셀별 기여도\n시각적 설명", "판단 기여도를\n역전파해 시각화"],
          ["탐색적 샘플링", "GAN·VAE\n잠재 공간\n결정 경계 샘플링", "모델 독립적\n경계 분석\n샘플 품질 의존", "경계 주변 샘플로\n판단 기준 탐색"],
        ],
      },
      {
        caption: "XAI(eXplainable AI) 한계 및 고려 사항",
        headers: ["한계 및 고려 사항", "설명"],
        rows: [
          ["성능·설명력 상충", "설명력 높이면\n성능 저하 가능"],
          ["계산 복잡도 증가", "SHAP·LRP\n고비용·긴 시간"],
          ["설명 불안정성", "LIME 샘플링별\n결과 변동"],
          ["설명 오해 가능성", "인과관계 아님"],
          ["사용자별 설명 차이", "사용자 유형별\n요구 상이"],
        ],
      },
    ],
    notes: [
      "개념도: AI — 학습 데이터 → 머신러닝 과정 → 학습 영역(신경망) → '고양이 판정' → 사용자(왜?). XAI — 학습 데이터 → 신규 머신러닝 과정 → 설명 가능한 모델(결정 트리) → 설명 인터페이스('고양이 판정, 이런 특징 소유') → 사용자.",
      "원문: 등장 배경 — 블랙박스 모델 확산(복잡한 AI 모델의 판단 근거를 추적하기 어려움)·고위험 분야 활용 증가(의료·금융 등에서 판단의 신뢰성과 안전 확보 필요)·AI 규제 강화(투명성·책임성 확보와 규제 준수 요구 확대). 한계 — 성능·설명력 상충(설명력을 높이면 모델 성능이 저하될 수 있음)·계산 복잡도 증가(SHAP·LRP 등은 높은 계산 비용과 시간이 필요)·설명 불안정성(LIME은 샘플링 방식에 따라 설명 결과가 달라짐)·설명 오해 가능성(특성 기여도가 실제 인과관계를 의미하지 않음)·사용자별 설명 차이(개발자·전문가·일반 사용자의 설명 요구가 다름).",
    ],
  },
  {
    title: "모델 드리프트(Model Drift) — 컨셉 드리프트 & 데이터 드리프트",
    course: "AI",
    definition:
      "고객, 환경, 상품, 산업 등등 변화는 끊임없이 변화하는 환경에 따라 모델의 성능이 저하되는 현상",
    defShort: "고객·상품 등 끊임없이 변화하는 환경에 따라 모델 성능이 저하되는 현상",
    lead:
      "환경 변화의 성능 저하, 모델 드리프트",
    features: ["환경 변화 기인", "배포 후 성능 저하", "재학습 대응 필요"],
    keywords: ["데이터와 라벨의 관계성 변화", "입력데이터의 분포 변화"],
    tables: [
      {
        caption: "컨셉 드리프트와 데이터 드리프트 비교",
        headers: ["비교 항목", "컨셉 드리프트", "데이터 드리프트"],
        rows: [
          ["원인(현상)", "입력-라벨 관계\n훈련 대비 변경", "입력 통계 분포\n훈련·배포 차이"],
          ["원인(본질)", "정답라벨 개념\n관계성 변화", "입력데이터 분포\n환경 간 변화"],
          ["사례", "금융사기 정의\n변경된 경우", "계절성 모델\n겨울 성능 저하"],
          ["해결방안", "온라인 학습\n피처 드로핑", "드리프트 감시\n재학습·재배포"],
        ],
      },
    ],
    notes: ["개념도: 컨셉 드리프트 — 클래스 경계(Margin)가 이동해 Class 0/1 관계가 변함 / 데이터 드리프트 — 훈련환경 분포 대비 배포환경(반년후) 입력데이터 분포가 이동해 성능감소"],
  },
  {
    title: "인공지능 적대적 공격",
    course: "AI",
    definition:
      "딥러닝의 심층신경망을 이용한 모델에 적대적 교란(Adversarial Perturbation)을 적용하여 오분류 발생시키는 공격기술",
    defShort: "심층신경망 모델에 적대적 교란을 적용해 오분류 발생시키는 공격기술",
    lead:
      "AI 모델을 속이는 교란, 인공지능 적대적 공격",
    features: ["적대적 교란 적용", "오분류 유발", "전 생애주기 위협"],
    keywords: ["Poisoning", "Evasion", "Inversion", "Model extraction"],
    tables: [
      {
        caption: "공격 기법 [오회전추]",
        headers: ["공격 기법", "설명", "사례"],
        rows: [
          ["Poisoning attack(중독공격, 오염공격)", "악성 데이터 주입\n모델 자체 손상", "MS 챗봇 테이\n스캐터랩 이루다\n의료 기계 오작동"],
          ["Evasion attack(회피공격)", "입력 최소 변조로\n모델 속임", "표지판 스티커\n정지→속도제한"],
          ["Inversion attack(학습 데이터 전도 공격)", "다량 쿼리 결과로\n학습데이터 추출", "얼굴 이미지\n복원 가능"],
          ["Model extraction attack(모델 추출 공격)", "쿼리 결과 분석해\n모델 추출", "650회 쿼리로\n아마존 모델 복제"],
        ],
      },
      {
        caption: "방어 기법 [적갠쿼결탐]",
        headers: ["방어 기법", "설명"],
        rows: [
          ["적대적 훈련(Adversarial training)", "해킹 데이터 입력해 저항성 기름"],
          ["Defense-GAN", "GAN 이용 적대적 공격 방어"],
          ["쿼리 횟수 제한", "반복적 쿼리 시도 제한\nInversion·Extraction 공격 방어"],
          ["결과값 분석 차단", "결과값 분석 모델 추론 공격 차단\n결과값 비노출 또는 분석 불가 변환"],
          ["적대적 공격 여부 탐지", "별도 적대적 공격 판단 모델 추가\n두 모델 추론 결과 큰 차이 시 탐지"],
        ],
      },
    ],
    notes: ["공격 지점: Get Data(Poisoning — 기밀성 Model Invasion) → Train Model(Poisoning·Evasion) → Model Testing → Deploy Model(Model Extraction — 무결성)"],
  },
  {
    title: "프롬프트 인젝션(Prompt Injection)",
    course: "AI",
    definition:
      "LLM 모델의 응답을 조작하기 위해, 공격자가 프롬프트에 정교하게 조작된 입력 값을 주입하여 민감 데이터를 유출하는 공격기법",
    defShort: "프롬프트에 정교하게 조작된 입력 값 주입, 민감 데이터 유출 공격기법",
    lead:
      "프롬프트를 노린 공격, 프롬프트 인젝션",
    features: ["자연어 입력 조작", "명령·데이터 혼재", "간접 주입 가능"],
    keywords: ["LLM 프롬프트", "자연어 명령어", "시스템 명령어", "입력값 조작", "보안 우회", "탈옥", "직접 인젝션", "간접 인젝션", "민감 데이터 유출", "외부소스", "입력값 검증"],
    tables: [
      {
        caption: "공격절차",
        headers: ["구분", "주요동작", "설명"],
        rows: [
          ["LLM 프롬프트", "시스템 프롬프트: 정상 명령\n사용자 입력: 악성 데이터 주입", "명령어/데이터 구분 어려움\n정교하게 조작된 입력값 주입"],
          ["LLM 모델처리", "LLM 모델: 새로운 악성 명령 처리", "LLM 모델 보안 경계 우회(탈옥)\n직접/간접 인젝션: 공격 범위 큼"],
          ["수행결과", "LLM 모델: 의도치 않은 결과 출력", "프롬프트·데이터·컨텍스트 탈취\n원격코드 실행, 멀웨어 전송\n잘못된 정보 캠페인"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["직접 입력", "직접(Direct) 인젝션", "LLM 프롬프트에 직접 접근\n정상 프롬프트에 악성 입력값 주입\n데이터 오남용, 개인정보 침해"],
          ["외부 소스", "간접(Indirect) 인젝션", "LLM 프롬프트에 외부소스 입력\n외부소스 내 악성 입력값 주입\n가용성·무결성 저해\n개인정보침해, 데이터 오남용"],
        ],
      },
      {
        caption: "공격 대응방안",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["입력", "입력 검증 및 필터링", "정규표현식 입력값 필터링\n화이트/블랙리스트 명령어 관리\n프롬프트 캡슐화 명령어 구분\n의미 분석: 퓨샷러닝, CoT"],
          ["권한", "권한 및 접근 제어", "\"최소권한\" 원칙\nAPI 토큰, 권한관리\nRBAC 플러그인 역할지정\n신뢰경계 설정"],
          ["운영", "사용자 확인 / 모니터링", "사용자 승인 프로세스\n실시간 모니터링\n감사로그\nRLHF 강화학습"],
        ],
      },
    ],
    notes: ["출제 이력 관련: OWASP LLM Top 10 1위 항목"],
  },
  {
    title: "딥페이크(Deepfake)",
    course: "AI",
    definition:
      "딥러닝과 Fake의 합성어로 딥러닝을 이용해 기존 영상에 다른 영상이나 이미지 정보를 합성하여 콘텐츠를 생성하는 기법",
    defShort: "딥러닝으로 기존 영상에 다른 영상·이미지 합성해 콘텐츠 생성하는 기법",
    lead:
      "딥러닝 합성의 명암, 딥페이크",
    features: ["GAN 기반 생성", "기존 영상 합성", "역기능 악용 우려"],
    keywords: ["GAN", "이미지 합성", "역기능"],
    tables: [
      {
        caption: "요소기술",
        headers: ["구분", "과정", "기술 또는 데이터", "설명"],
        rows: [
          ["수집", "영상 수집", "이미지·영상\n참고 데이터", "Source·Target\n정보 수집"],
          ["생성(GAN활용)", "생성 모델 훈련\n가짜표본 생성", "Autoencoder\nGAN, LSTM", "수집 기반 훈련\n잠재변수 이용"],
          ["식별 및 학습 반복", "Real/Fake 구분", "Autoencoder\nGAN, LSTM", "식별모델이 판별\n생성모델 피드백"],
          ["딥페이크 생성", "결과 생성", "Fake·Real 데이터", "딥페이크 완성"],
        ],
      },
      {
        caption: "탐지기술",
        headers: ["구분", "주요 기술"],
        rows: [
          ["인공지능 기반 탐지", "얼굴 특징 분석\n영상 품질 분석\n생체 신호 기반 탐지"],
          ["포렌식 분석", "픽셀 레벨 분석\n메타데이터 분석"],
        ],
      },
      {
        caption: "대응방안",
        headers: ["구분", "대응 방안"],
        rows: [
          ["기술적", "딥페이크 영상 탐지 시스템 구축\n딥페이크 라벨링\n수정불가 워터마크 삽입"],
          ["법적", "딥페이크 관련 법제화\n플랫폼 책임 강화\n국제 협력"],
          ["사회적", "교육과 인식제고\n딥페이크 탐지 도구 공개"],
        ],
      },
    ],
    notes: ["개념도: 실제 이미지→표본 / 잠재 확률 변수→생성 AI→가짜 표본 → 식별 AI(진짜/가짜 판별) → 딥페이크 생성 《GAN》"],
  },
  {
    title: "AI TRiSM(AI Trust, Risk and Security Management)",
    course: "AI",
    definition:
      "AI의 부적절한 사용 방지 위해 가트너에서 제시한 AI 신뢰성, 위험, 보안 관리에 관한 프레임워크",
    defShort: "AI 부적절한 사용 방지 위한 AI 신뢰성·위험·보안 관리 프레임워크",
    lead: "AI 신뢰·위험·보안 관리, AI TRiSM",
    features: ["부적절 사용 방지", "AI 설명가능성", "적대적 AI 대응"],
    keywords: ["AI 악용", "Explainability/Model Monitoring", "ModelOps", "AI Application Security", "Privacy"],
    tables: [
      {
        caption: "구성요소 — 4개 Pillar [익모모응프]",
        headers: ["구분", "설명", "기술요소/도구"],
        rows: [
          ["Explainability/Model Monitoring", "AI 설명가능성\n확보", "SHAP\nMS Fairlearn"],
          ["ModelOps", "전사 단일소스\n거버넌스 관리", "지식그래프\n규칙·최적화"],
          ["AI Application Security", "적대적 AI 대응\n노이즈 면역력", "견고성 테스트\n모델 검증·개선"],
          ["Privacy", "합성 데이터 또는\n허위 데이터 사용", "AI Reverie"],
        ],
      },
    ],
    notes: ["개념도 [신위보]: Unmanaged Risks → AI TRiSM(신뢰성·위험·보안 관리) → Managed Risks — 4 Pillar: Explainability/Model Monitoring · Privacy · ModelOps · AI Application Security"],
  },
  {
    title: "범용 인공지능 위험관리 프레임워크",
    course: "AI",
    definition:
      "범용 인공지능(AGI)의 개발과 활용 과정에서 발생할 수 있는 다양한 위험 요소를 사전에 식별하고, 이를 체계적으로 관리하기 위한 종합적이고 선제적인 지침 체계",
    defShort: "다양한 위험 요소를 사전에 식별, 체계적으로 관리하는 종합적 지침 체계",
    lead: "AGI 위험 사전 식별, 범용 인공지능 위험관리 프레임워크",
    features: ["3Ps 원칙 기반", "선제적 위험 식별", "3D 위험 등급화"],
    keywords: ["위험 식별", "분석", "평가 대응", "위험 프로필", "3D 위험 매트릭스"],
    tables: [
      {
        caption: "'3Ps' [인목가]",
        headers: ["원칙", "설명"],
        rows: [
          ["인류 우선성(Primacy of Humanity)", "인간 권리 우선 최종 결정 인간"],
          ["목표 지속성(Persistence of Goal)", "본래 목적 부합 예상 밖 기능시"],
          ["가치 보존성(Preservation of Value)", "사회·윤리 가치 글로벌 가치 준수"],
        ],
      },
      {
        caption: "위험관리 절차",
        headers: ["구성요소", "세부 내용", "설명"],
        rows: [
          ["위험 식별(Risk Identification)", "Known risks 인식\nUnknown risks 발굴\n위험 프로필 작성", "알려진·알려지지 않은 위험 탐색\n위험 목록 작성"],
          ["위험 분석(Risk Analysis)", "위험 원천 분석\n지속성·의도성\n영향 범위 평가\n분석 체계 적용", "위험 발생 근본 원인 파악\n위험 속성 다각도 분석·심층 이해"],
          ["위험 평가(Risk Evaluation)", "위험 점수 부여\n3D 위험 매트릭스\n위험 등급화\n우선순위 설정", "심각성·발생 가능성 정량화\n4단계 Catastrophic·Major\nModerate·Minor 구분\n대응 우선순위 결정"],
          ["위험 대응(Risk Treatment)", "제거(Elimination)\n완화(Mitigation)\n모니터링(Monitoring)\n수용(Acceptance)", "수준별 전략 수립·실행\n지속적 피드백 루프로 갱신"],
        ],
      },
    ],
    notes: ["개념도: GPAI Risk Management Framework — Identify(Discover·Profile·Recognise) → Analyse(Understand·Classify·Interpret) → Evaluate(Score·Grade·Prioritise) → Treat(Accept·Mitigate) + Monitoring·Review·Reporting 순환", "출제 이력: 2025.06 KPC 모의고사 2교시, 136회 정보관리 1교시, 2025.05 ITPE FR 1일차 1교시"],
  },
  {
    title: "ISO/IEC 23894",
    course: "AI",
    definition:
      "AI 시스템의 위험을 식별·분석·평가·처리·모니터링하기 위한 **AI 위험관리 국제표준**",
    defShort: "AI 위험 식별·분석·평가·처리·모니터링 AI 위험관리 국제표준",
    lead: "AI 위험의 식별부터 모니터링까지, ISO/IEC 23894",
    features: ["ISO 31000 확장", "전 생명주기 적용", "지속적 개선 순환"],
    keywords: ["AI Risk", "Governance", "Context", "Risk Assessment", "Risk Treatment", "Monitoring", "Explainability"],
    tables: [
      {
        caption: "등장배경",
        headers: ["구분", "내용"],
        rows: [
          ["AI 확산", "AI 의사결정\n사회 전반 확대"],
          ["AI 특성", "편향·불확실성\n비결정성 증가"],
          ["규제 대응", "EU AI Act 등\n글로벌 규제 대응"],
        ],
      },
      {
        caption: "ISO/IEC 23894 위험관리 절차",
        headers: ["절차", "핵심 구성기술", "설명"],
        rows: [
          ["Context 설정", "AI 거버넌스(Governance)", "조직 목표\n이해관계자\n기준 정의"],
          ["위험평가", "AI 위험평가\n(Risk Assessment)", "식별·분석·평가\n우선순위 결정"],
          ["위험처리", "AI 위험처리\n(Risk Treatment)", "회피·완화\n전가·수용\n대응방안 수립"],
          ["운영 및 검증", "신뢰가능 AI\n(Trustworthy AI)", "공정성·투명성\n설명가능성\n안전성 확보"],
          ["지속적 개선", "모니터링\n(Monitoring & Review)", "성능·드리프트\n규제 변화\n지속 점검·개선"],
        ],
      },
      {
        caption: "ISO/IEC 23894 적용 시 고려사항",
        headers: ["고려사항", "주요 내용", "대응방안"],
        rows: [
          ["데이터 신뢰성 확보", "편향·품질 저하\nAI 성능 저하", "데이터 품질관리\n대표성 확보\n공정성 검증"],
          ["설명가능성 및 투명성", "AI 의사결정\n근거 확인 어려움", "XAI 적용\n추론 근거 제공\n감사 체계 구축"],
          ["개인정보·보안 강화", "개인정보 유출\nAI 공격 위협", "Privacy by Design\n접근통제\n암호화\n보안성 검증"],
          ["지속적 위험관리", "모델 드리프트\n규제 변화\n성능 저하", "지속적 모니터링\n재학습\nAI 거버넌스\nCompliance 운영"],
        ],
      },
    ],
    notes: [
      "개념도: AI 관련 활동 및 기능(개발 → 생산 → 배포 → 사용) 아래 ISO/IEC 23894 리스크(위험) 관리 절차 — 범위·상황·기준 설정(Scope, context and criteria) → 리스크 평가(Risk assessment: 리스크 식별 Identification → 리스크 분석 Analysis → 리스크 판정 Evaluation) → 리스크 처리(Risk treatment: 회피·공유(전가)·저감(완화)·보유(수용)) → 기록 및 보고(Recording & Reporting). 좌측 의사소통 및 협의(Communication and consultation), 우측 모니터링 및 검토(Monitoring and review). AI 전 생명주기의 위험을 식별·분석·평가·처리·모니터링하여 신뢰성 있는 AI를 구현하는 위험관리 체계 제공.",
      "원문: 절차 — Context 설정(AI 거버넌스: 조직의 목표, 이해관계자, 위험관리 기준을 정의), 위험평가(AI 위험을 식별·분석·평가하여 우선순위를 결정), 위험처리(위험을 회피·완화·전가·수용하는 대응방안을 수립), 운영 및 검증(신뢰가능 AI: 공정성, 설명가능성, 투명성, 안전성을 확보), 지속적 개선(성능·드리프트·규제 변화 등을 지속적으로 점검 및 개선). 고려사항 — 데이터 신뢰성 확보(데이터 편향, 품질 저하로 AI 성능 저하 → 데이터 품질관리, 대표성 확보, 공정성 검증), 설명가능성 및 투명성(AI 의사결정 근거 확인 어려움 → XAI 적용, 추론 근거 제공, 감사(Audit) 체계 구축), 개인정보·보안 강화(민감정보 유출 및 AI 공격 위협 → Privacy by Design, 접근통제, 암호화, 보안성 검증), 지속적 위험관리(모델 드리프트, 규제 변화, 성능 저하 → 지속적 모니터링, 재학습, AI 거버넌스 및 Compliance 운영). 데이터 품질, 설명가능성, 개인정보 보호, 지속적 위험관리 고려 필요.",
    ],
  },
  {
    title: "AI RMF(AI Risk Management Framework)",
    course: "AI",
    definition:
      "AI 시스템의 **신뢰성과 안전성**을 확보하기 위해 AI 전 생명주기의 위험을 식별·측정·관리하는 **NIST 위험관리 프레임워크**",
    defShort: "AI 시스템 신뢰성과 안전성 확보를 위한 NIST 위험관리 프레임워크",
    lead: "AI 전 생명주기 위험의 식별·측정·관리, AI RMF",
    features: ["신뢰성 중심", "생명주기 적용", "자율적 적용"],
    keywords: ["NIST", "Trustworthy AI", "Governance", "MAP", "MEASURE", "MANAGE"],
    tables: [
      {
        caption: "특징",
        headers: ["구분", "설명"],
        rows: [
          ["신뢰성 중심", "Trustworthy AI 구현"],
          ["생명주기 적용", "기획~운영 관리"],
          ["자율적 적용", "비강제\n가이드라인"],
        ],
      },
      {
        caption: "AI RMF 절차",
        headers: ["절차", "주요활동", "산출물"],
        rows: [
          ["Governance", "AI 정책·조직\n역할·책임 정의\n거버넌스 구축", "AI 거버넌스 정책\nAI 윤리원칙\n역할·책임 RACI\n위험관리 계획"],
          ["Map", "목적·환경 분석\n이해관계자 식별\n위험 식별", "AI 위험 프로파일\n이해관계자분석서\n맥락 정의서\n위험 식별 목록"],
          ["Measure", "측정·분석·평가\n신뢰성 검증", "위험평가서\nTEVV 결과서\n편향·성능평가\nXAI 검증 결과"],
          ["Manage", "위험 대응·개선\n모니터링·운영", "위험 대응계획\n개선조치(CAPA)\n운영점검 결과서\nAI 위험관리 이력"],
        ],
      },
      {
        caption: "AI RMF와 ISO/IEC 23894 비교",
        headers: ["구분", "AI RMF", "ISO/IEC23894"],
        rows: [
          ["기관", "NIST", "ISO"],
          ["목적", "Trustworthy AI", "AI Risk"],
          ["구성", "Govern-Map-\nMeasure-Manage", "Identify-Analyze-\nEvaluate-Treat"],
          ["특징", "AI 특화", "ISO31000 기반"],
        ],
      },
    ],
    notes: [
      "개념도: AI Lifecycle 전반 — GOVERNANCE(정책·조직·책임체계) → MAP(위험 식별) → MEASURE(위험 측정) → MANAGE(위험 대응) → 지속적 개선(Feedback). 좌측 이해관계자(내·외부)의 의사소통 및 협의(Communication and consultation), 우측 모니터링 및 검토(Monitoring and review)가 전 단계와 양방향으로 연결된다. AI 생명주기 전반에 걸쳐 거버넌스 기반으로 위험을 식별·측정·관리하고 지속적으로 모니터링하는 AI 위험관리 체계.",
      "산출물 원문: Governance — AI 거버넌스 정책, AI 윤리원칙, 역할·책임(RACI), 위험관리 계획, AI 운영지침 / Map — AI 위험 프로파일(Risk Profile), 이해관계자 분석서, 시스템 맥락(Context) 정의서, 위험 식별 목록(Risk Register) / Measure — 위험평가서(Risk Assessment Report), TEVV 결과서(Test·Evaluation·Verification·Validation), 편향 분석보고서, 성능평가 보고서, 설명가능성(XAI) 검증 결과 / Manage — 위험 대응계획(Risk Treatment Plan), 개선조치 보고서(CAPA), 운영점검 결과서, AI 위험관리 이력. 특징 — 생명주기 적용(기획~운영 전 단계 관리), 자율적 적용(비강제 가이드라인).",
      "AI RMF는 AI 특화 위험관리 프레임워크이며, ISO/IEC 23894는 국제 AI 위험관리 표준임",
    ],
  },
  {
    title: "AI 시스템 테스트",
    course: "AI",
    definition:
      "휴리스틱으로 이루어진 AI 모델 특성상 테스트 오라클 부재를 해결하기 위한 테스트",
    defShort: "휴리스틱 AI 모델 특성상 테스트 오라클 부재를 해결하기 위한 테스트",
    lead:
      "오라클 부재의 검증 도전, AI 시스템 테스트",
    features: ["오라클 부재 대응", "모델 간 비교 검증", "뉴런 커버리지 기준"],
    keywords: ["블랙박스 테스팅", "신경망 화이트박스 테스팅"],
    tables: [
      {
        caption: "블랙박스 테스팅 [변액(A)백조]",
        headers: ["구분", "테스트 기법", "설명"],
        rows: [
          ["입력 조합", "조합 테스팅", "입력값 조합 세트 상호작용 결함"],
          ["모델 비교", "백투백(Back-to-Back) 테스팅", "동일 케이스 실행 변형 모델 비교"],
          ["모델 비교", "A/B 테스팅", "테스터 노출 비교 선호 변형 결정"],
          ["관계 기반", "변성 테스팅(Metamorphic Testing)", "메타모픽 관계 신규 입출력 예측"],
        ],
      },
      {
        caption: "신경망 화이트박스 테스팅 [뉴임부값뿌레안]",
        headers: ["구분", "커버리지 종류", "설명"],
        rows: [
          ["뉴런 활성", "뉴런 커버리지(Neuron Coverage)", "활성 뉴런 비율 활성값 0 초과"],
          ["뉴런 활성", "임계점 커버리지(Threshold Coverage)", "임계 활성값 초과 초과 뉴런 비율"],
          ["활성 변화", "부호 변경 커버리지(Sign Change Coverage)", "양·음 활성 뉴런 0은 음의 값 간주"],
          ["활성 변화", "값 변경 커버리지(Value Change Coverage)", "활성값 변화 범위 범위 초과 비율"],
          ["층 간 변화", "부호-부호 커버리지(Sign-Sign Coverage)", "부호 변경 뉴런 다음 층 상태 유지"],
          ["층 간 변화", "레이어 커버리지(Layer Coverage)", "전체 층 활성값 뉴런 세트 변화"],
          ["안전성", "안전 변경 최대화 테스트", "입력 공간 영역 안정 작동 영역"],
        ],
      },
    ],
  },
  {
    title: "ISO/IEC 42119-2",
    course: "AI",
    definition:
      "ISO/IEC/IEEE 29119 소프트웨어 테스트 표준을 AI 시스템에 적용하는 개요 및 가이드라인을 제시하는 기술 명세서",
    defShort: "29119 SW 테스트 표준의 AI 시스템 적용 가이드라인 기술 명세서",
    lead:
      "AI 테스트의 국제 명세, ISO/IEC TS 42119-2",
    features: ["29119 AI 적용", "위험 기반 접근", "AI 고유 리스크 식별"],
    keywords: ["범위", "용어", "AI시스템", "테스트 소개", "AI 시스템 리스크 식별", "AI 테스트 접근법"],
    tables: [
      {
        caption: "품질관리 활동",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["서문", "범위(Scope)", "29119 적용 범위 한정\nAI 시스템 테스트 개요"],
          ["서문", "Normative references", "29119 시리즈 + AI 표준\n23894·25059·22989"],
          ["서문", "Terms (40개)", "AI 특화 용어\nAI risk\ndrift testing\nadversarial testing"],
          ["서문", "Abbrev. Terms", "LLM, RTE 등 약어"],
          ["기술 본론", "AI 시스템·테스트 소개", "생애주기 정의(설계~재평가)\n기능·구조 관점 시스템 뷰 제시\n위험 기반 테스트 접근 중심\n프로세스·산출물·역할 규정"],
          ["기술 본론", "AI 시스템 리스크 식별", "AI 고유 리스크 식별·분류·분석\n안전성·공정성\n프라이버시·보안\nISO/IEC 23894 연계 우선순위 설정"],
          ["기술 본론", "AI 테스트 접근법", "시스템·통합·운영 등 레벨별 접근\n공통·데이터 품질·모델 테스트\n지식기반 시스템 테스트\nAI 특화 테스트 유형 제시"],
          ["기술 본론", "Annex A~C", "기존 SW 테스트 개요 정리\nAI 확률성·학습성·비결정성 특성"],
        ],
      },
    ],
    notes: ["표준 구성: 서문(범위 → Normative references → Terms 40개 → Abbrev. terms) / 기술 본론(AI 시스템·테스트 소개 → AI 시스템 리스크 식별 → AI 테스트 접근법 → Annex A~C)", "출제 이력: 2026.02 ITPE FR 1일차 1교시"],
  },
  {
    title: "AI 레드팀(Red team) 테스트",
    course: "AI",
    definition:
      "AI 모델 또는 시스템의 잠재적인 취약점, 편향, 사회적 해악, 보안 문제 등을 식별하기 위해 의도적으로 다양한 공격을 시도하고 한계를 시험하는 적대적인 탐색적 테스팅 방법",
    defShort: "AI에 의도적으로 다양한 공격을 시도하는 적대적인 탐색적 테스팅 방법",
    lead:
      "의도적 공격의 취약점 발굴, AI 레드팀 테스트",
    features: ["의도적 적대 공격", "탐색적 테스팅", "잠재 위협 노출"],
    keywords: ["의도", "비결정성", "탐색적 테스트", "잠재 위협"],
    tables: [
      {
        caption: "상세설명 — 팀",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["팀 구성", "10명~100명 이상", "테스트 규모·목표 따라 결정\n대부분 수십 명 구성"],
          ["팀 구성", "기술, 윤리, 법, 도메인 전문가, 유저 등 포함", "사회문화 해악 테스트 다양 구성원\n거버넌스 프레임워크 구성 도구"],
          ["팀 유형", "내부/외부 레드팀", "기업/기관 내부 또는 외부 팀 구성"],
          ["팀 유형", "클라우드 소싱 레드팀", "클라우드 통한 대규모 모집"],
          ["팀 유형", "전문가/유저 중심 레드팀", "전문가 집단 또는 유저 중심 구성"],
          ["팀 유형", "전문가/유저 혼합 레드팀", "전문가·유저 혼합 대규모 수행"],
          ["팀 역할", "잠재 위협 노출", "잠재 위협 탐색적 테스팅으로 노출"],
          ["팀 역할", "편향, 유해성 검출", "데이터 편향, 결과 편향\n모델 유해 결과 출력 유도"],
          ["팀 역할", "공격 시나리오 도출", "공격 시나리오 설계, 전략 도출"],
          ["팀 역할", "보안 취약점 발견", "데이터 유출·시스템 접근 취약점"],
        ],
      },
      {
        caption: "테스트 기법과 절차",
        headers: ["구분", "핵심", "설명"],
        rows: [
          ["모델 테스트 기법", "프롬프트 인젝션", "프롬프트에 악의적 내용 주입"],
          ["모델 테스트 기법", "탈옥 공격, 적대적 입력", "모델 안전장치 우회\n차단된 응답 도출\n모델 교란 공격"],
          ["모델 테스트 기법", "편향, 유해성 유도 공격", "인종 등 민감 주제 반복\n욕설 등 필터링 해제"],
          ["모델 테스트 기법", "Agent 오동작 유도", "프롬프트 교란 통한 Agent 교란\n금지된 작업 수행 지시"],
          ["모델 테스트 기법", "데이터 포이즈닝", "조작 데이터 주입 모델 오동작 유도"],
          ["시스템 테스트 기법", "데이터 유출, 권한 탈취", "개인정보 유출, 민감 데이터 유출"],
          ["시스템 테스트 기법", "가드레일 무력화", "안전 필터·정책 엔진 우회 경로"],
          ["시스템 테스트 기법", "보안 경계 테스트", "입출력·접근 통제 정상 작동 확인"],
          ["시스템 테스트 기법", "공격 대응 능력 테스트", "보안 솔루션 탐지·차단·복구 능력"],
          ["테스트 절차", "1) 범위, 환경 정의", "테스트·접근 권한 범위, 목표 설정"],
          ["테스트 절차", "2) 레드팀 구성", "전문가·유저 규모·구성 결정 모집"],
          ["테스트 절차", "3) 레드팀 공격 테스트", "레드팀 공격 시나리오 설계 및 실행"],
          ["테스트 절차", "4) 블루팀 방어/분석", "실시간 방어/차단 설계, 결과 분석"],
          ["테스트 절차", "5) 리포트/대책 마련", "리포트 발행, 취약점 대응 방안\n테스트 강화 방안 마련"],
          ["산출물", "취약점 리포트, 위협 카탈로그", "모델·시스템 취약점 리포트\n위협·공격기법 분류 카탈로그화"],
          ["산출물", "신규 가드레일, 필터링 규칙, 보안 대응 방안", "취약점별 신규 가드레일 적용\n기술적/관리적 보안 개선책"],
          ["산출물", "신규 평가지표, 테스트 케이스", "안전성·윤리 등 평가 지표 생성\n반복 노출 위험 테스트 케이스 개발"],
        ],
      },
    ],
    notes: ["개념도: 레드팀(프롬프트 인젝션·탈옥·데이터 유출·편향 유도·적대적 입력 공격) → AI 시스템 ← 블루팀(분석) → 취약점 리포트/리스크 카탈로그, 신규 가드레일/필터링 규칙, 신규 평가지표/테스트 기법", "출제 이력: 2025.10 ITPE 모의고사 1교시"],
  },
  {
    title: "MCP(Model Context Protocol)",
    course: "AI",
    definition:
      "LLM 애플리케이션과 외부 데이터 소스 및 도구들 간의 원활한 통합을 가능하게 하는 개방형 프로토콜",
    defShort: "LLM 애플리케이션과 외부 도구 간 통합을 가능케 하는 개방형 프로토콜",
    lead: "LLM·도구 표준 연결, MCP",
    features: ["개방형 프로토콜", "컨텍스트 표준화", "JSON-RPC 기반"],
    keywords: ["맥락", "프로토콜", "통합", "JSON-RPC 요청"],
    tables: [
      {
        caption: "목적",
        headers: ["목적", "설명"],
        rows: [
          ["컨텍스트 공유 표준화", "표준 프로토콜 일관 데이터 접근"],
          ["도구와 기능 노출", "로컬·원격 도구 안전한 기능 호출"],
          ["통합 워크플로우", "소스·도구 조합 워크플로우 생성\n프롬프트 템플릿 모듈화·확장성"],
        ],
      },
      {
        caption: "동작절차 [초기모도응전]",
        headers: ["절차", "설명"],
        rows: [
          ["초기화", "클라이언트 연결 초기화 메시지"],
          ["기능 협상 및 발견", "맥락 기능 조회 리소스·도구 등"],
          ["모델의 요청 처리", "질문 전달·판단 내외부 도구 선택"],
          ["도구호출요청", "클라이언트 개입 도구 호출 수행"],
          ["모델응답생성", "외부 결과 수신 맥락 반영 답변"],
          ["응답전달", "호스트 출력 최종 답변 표시"],
        ],
      },
      {
        caption: "개념도 구성요소 [호클서]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["애플리케이션", "MCP Host", "LLM 앱 조율 전체 흐름 통제\n다중 서버 연결 UI 보안 권한"],
          ["연결", "MCP Client", "서버 1:1 연결 전담 컴포넌트\n메시지 직렬화 역직렬화·상태"],
          ["데이터", "MCP 서버", "외부 데이터 제공 모델용 맥락 제공"],
        ],
      },
      {
        caption: "맥락 [리툴프]",
        headers: ["요소", "설명"],
        rows: [
          ["Resources", "모델이 참고할\n읽기 전용 데이터"],
          ["Tools", "모델이 호출할 수\n있는 기능 또는\n함수"],
          ["Prompts", "모델에게 특정\n지시나 템플릿을\n제공하는 문구"],
        ],
      },
    ],
    notes: ["프로토콜: MCP는 통신에 JSON-RPC 2.0을 기반으로 한 표준 메시지 형식을 사용", "개념도: MCP Host(Claude, IDEs, Tools) ⇄ MCP Protocol ⇄ MCP Server A/B/C ⇄ Local Resource A/B·Web APIs·Remote Resource C"],
  },
  {
    title: "MCP 보안취약점 및 대응방안",
    course: "AI",
    definition:
      "MCP(Model Context Protocol) 연동 구조에서 발생하는 Tool Poisoning, Rug Pulls, Cross-Server Attacks 등 보안위협과 인증·실행·서버·클라이언트 측면의 대응방안",
    defShort: "MCP 연동에서 생기는 도구·서버 보안위협과 인증·실행 대응방안",
    lead:
      "MCP 연동의 보안 위협, MCP 보안취약점 및 대응방안",
    features: ["도구 설명 조작", "신뢰 도구 하이재킹", "최소권한 원칙"],
    keywords: ["Tool Poisoning", "Rug Pulls", "Cross-Server Attacks", "프롬프트 인젝션", "토큰 바인딩", "최소권한"],
    tables: [
      {
        caption: "보안취약점",
        headers: ["구분", "보안위협", "설명"],
        rows: [
          ["MCP Tool 측면", "Tool Poisoning(툴 중독공격)", "도구 설명 악성코드 은닉 실행 유도"],
          ["MCP Tool 측면", "Hidden Risks(숨겨진 명령어)", "무해해 보이나 숨긴 명령어 AI 실행"],
          ["MCP Tool 측면", "Rug Pulls(가짜 업데이트)", "설치 후 악의적 수정 정보 유출 수행"],
          ["MCP 연동 구조 측면", "Cross-Server Attacks(신뢰된 도구 하이재킹)", "악성 서버 도구 덮어씀·가로챔"],
          ["MCP 연동 구조 측면", "취약한 보호체계", "사용자 보안 인식 부족\n도구변경 검증 부족"],
          ["MCP 연동 구조 측면", "엔드포인트 보안", "사용자의 기기 보안 취약"],
          ["MCP Server 측면", "프롬프트 인젝션", "악성 명령 입력으로 오작동 유도"],
          ["MCP Server 측면", "민감 데이터 유출", "앱·도구 연동 데이터 노출 증가"],
          ["MCP Client 측면", "인증 미흡", "토큰 유출 시 인증 우회·세션 탈취"],
          ["MCP Client 측면", "무분별한 설치", "미신뢰 SW 무작위 설치 위협 증가"],
        ],
      },
      {
        caption: "대응방안 — 인증 및 실행",
        headers: ["취약점", "대응방안", "설명"],
        rows: [
          ["인증/인가", "토큰 바인딩", "전 구간 HTTPS\nOAuth 2.1 + PKCE(S256) 강제\nRFC 8707로 토큰 리소스 바인딩"],
          ["인증/인가", "세션 바인딩\n로컬 소켓 활용", "세션 인증수단 사용 금지\n고엔트로피·주기 회전\n사용자ID와 세션 바인딩\nTLS/mTLS·로컬소켓 활용"],
          ["실행", "사용자 확인", "프롬프트 불신 입력 취급\n정적검사·금지어 룰\n민감행위 HITL(사용자 확인)\n레이트리밋·출처 고정"],
          ["실행", "최소권한 승인", "최소권한 스코프\n중요 툴 화이트리스트\n시간제(JIT) 권한\n변경 시 보안 승인"],
          ["실행", "시스템 로컬 실행", "컨테이너/샌드박스 격리\n인자 화이트리스트 검증\n파일/네트워크 egress 최소화\n비특권 실행, 이미지 서명/스캔"],
        ],
      },
      {
        caption: "대응방안 — 서버 & 클라이언트",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["MCP Server 측면", "서버 간 격리", "손상 범위 한정"],
          ["MCP Server 측면", "실행 전\n투명성 보장", "명령어 공개\n동작 사전 확인"],
          ["MCP Server 측면", "권한 최소화", "필요 범위 한정"],
          ["MCP Client 측면", "도구 업데이트\n모니터링", "주기적 변경 검사\n악성코드 탐지"],
          ["MCP Client 측면", "로그 기록\n및 감사", "사용 기록 보관\n이상 징후 감지"],
          ["MCP Client 측면", "사용자 교육", "안전 사용법"],
        ],
      },
    ],
    notes: ["출제 이력: 137회 정보관리 2교시, 2025.07 ITPE 모의고사 4교시"],
  },
  {
    title: "바이브코딩(Vibe Coding)",
    course: "AI",
    definition:
      "대규모 언어 모델(LLM)을 활용하여 사용자의 자연어 지시를 기반으로 코드를 생성하고, 개발자는 이를 검토 및 조정하여 소프트웨어를 개발하는 코딩 기법",
    defShort: "LLM을 활용하여 자연어 지시를 기반으로 코드를 생성하는 코딩 기법",
    lead:
      "자연어 지시의 코드 생성, 바이브코딩",
    features: ["자연어 지시 기반", "개발자 검토·조정", "AI 의존성 존재"],
    keywords: ["LLM", "자연어 처리", "소스코드 생성"],
    tables: [
      {
        caption: "바이브코딩 도구",
        headers: ["구분", "도구", "설명"],
        rows: [
          ["기반 기술", "LLM (GPT, Claude 등)", "자연어 명령 프로그래밍 언어 변환"],
          ["기반 기술", "명령어 의도 파악", "요구사항 분석 코딩 목적 추론"],
          ["기반 기술", "자연어 ↔ 코드 전환 UI", "사용자 입력 실시간 코드로 시각화"],
          ["SW측면 도구", "Cursor", "자연어 기능 설명 시 AI 코드 제안\n코드 설명, 리팩토링, 디버깅 지원"],
          ["SW측면 도구", "Replit Ghostwriter", "웹 기반 코딩 플랫폼\n브라우저에서 바로 vibe코딩 가능"],
          ["SW측면 도구", "GitHub Copilot", "JS, Python, React 등\n거의 모든 언어 코드 자동 완성"],
          ["SW측면 도구", "Framer AI", "노코드 웹 빌더"],
          ["SW측면 도구", "FlutterFlow", "복잡한 UI/UX 드래그앤드롭 설계"],
        ],
      },
      {
        caption: "장단점",
        headers: ["구분", "설명"],
        rows: [
          ["장점", "자연어 개발 대화형 코드 생성\n프로토타이핑 사용자 주도"],
          ["단점", "AI 의존성 코드 최적화 문제"],
        ],
      },
    ],
    notes: ["개념도: 아이디어 →자연어→ AI(Cursor·Replit Ghostwriter) →생성→ 코드 → 검토 및 조정(반복)", "Agentic Workflow 검증, Human in the loop: 사람이 시스템의 의사결정 과정에 개입하고 통제하는 방식 — AI 판단의 신뢰성·품질 확보, 윤리적·법적 책임 보장, 위험/오류 감소", "출제 이력: 2025.06 KPC 모의고사 4교시, 2025.06 ITPE 모의고사 1교시, 2025.04 KPC 모의고사 1교시"],
  },
  {
    title: "하네스 엔지니어링",
    course: "AI",
    definition:
      "AI 에이전트가 일관된 구조와 품질로 작업하도록 **컨텍스트, 제약, 피드백 루프를 기계적으로 설계·운영하는 환경** 중심의 엔지니어링",
    defShort: "컨텍스트·제약·피드백 루프 기계적 설계·운영 환경 중심 엔지니어링",
    lead: "에이전트가 일관된 구조로 일하는 환경 설계, 하네스 엔지니어링",
    features: ["환경 중심 설계", "기계적 제약 강제", "피드백 루프 개선"],
    keywords: ["AI 환경 설계", "컨텍스트(Context)", "가드레일(Guardrail)", "피드백 루프(Feedback Loop)", "Humans steer", "Agents execute"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "핵심 수단·기술", "핵심 기능", "설명"],
        rows: [
          ["지침·컨텍스트 체계", "지침 파일\n구조화 저장소", "판단 기준 제공", "규칙·판단 근거\n지속 제공"],
          ["가드레일·아키텍처 제약", "입출력 통제\n구조 규칙·검증", "행동 범위 통제", "허용 밖 동작\n드리프트 차단"],
          ["검증·피드백 루프", "CI/CD·린터\n테스트·리뷰", "검증·재주입", "결과 자동 검증\n수정 신호 재반영"],
        ],
      },
      {
        caption: "하네스(Harness)의 역할",
        headers: ["역할", "수행 내용", "설명"],
        rows: [
          ["제어(Control)", "입력 제한\n권한·정책 적용", "허용 밖 행동\n사전 제한"],
          ["감시(Monitoring)", "상태 추적\n로그·출력 기록", "동작·결과\n지속 관찰"],
          ["개선(Feedback)", "오류 반영\n재실행·보정", "이상 징후를\n다음 동작 반영"],
        ],
      },
      {
        caption: "프롬프트/컨텍스트/하네스 엔지니어링 비교",
        headers: ["구분", "Prompt Engineering", "Context Engineering", "Harness Engineering"],
        rows: [
          ["개념", "잘 답하게\n지시문 설계", "잘 판단하게\n참조 맥락 설계", "안정 실행 위한\n환경·제약·검증\n구조 설계"],
          ["개념적 비유", "'우회전' 명령", "지도·표지판\n지형 제공", "고삐·안장\n울타리·도로"],
          ["설계 대상", "입력 텍스트", "참조 정보·기억", "전체 실행 환경"],
          ["목표", "정확한 응답 유도", "풍부한 맥락 제공", "안정·일관된\n자율 수행"],
          ["제어 방식", "지시문 최적화", "필요 정보\n선별 주입", "제약·검증\n피드백 루프 내장"],
          ["사람의 역할", "질문을 잘 작성", "필요 맥락 정리", "환경·의도·검증\n구조 설계"],
        ],
      },
    ],
    notes: [
      "개념도: [지침·컨텍스트 체계(Guidelines & Context System) — System of Record, ARCHITECTURE.md, AGENTS.md, Instruction Files: 기준 문서·판단 기준·에이전트 규칙·프로젝트 맥락] → [가드레일·아키텍처 제약(Guardrails & Architecture Constraints) — 구조 규칙(명명 규칙·정적 검사·구조 검토), 아키텍처 제약(Lint 규칙·구조 검토), 정적 중도 제약(테스트 기준·레이어 구조)] → [에이전트 실행(Agent Execution) — 코드 생성·테스트·PR 생성·버그 수정·리뷰 응답 / 규칙 준수·문서 참조·작업 수행] ⟲ 검증·피드백 루프(Validation & Feedback Loop): CI/CD·자동 리뷰·자체 검증·문서 반영·재시도·드리프트 감소 — 양쪽에서 오류 수정·문서 보완·규칙 재반영·지속 개선이 돈다.",
      "원문: 구성 요소 — 지침·컨텍스트 체계(지침 파일, 구조화 문서 저장소 → 판단 기준 제공 → 에이전트가 따라야 할 규칙과 판단 근거를 지속 제공), 가드레일·아키텍처 제약(입출력 통제, 구조 규칙, 강제 검증 → 행동 범위 통제 → 허용 범위 밖 동작과 구조 드리프트를 사전에 차단), 검증·피드백 루프(CI/CD, 린터(Linter), 구조 테스트, 자동 리뷰 → 결과 검증 및 재주입 → 결과를 자동 검증하고 수정 신호를 다음 실행에 반영). 비교 — 개념: 모델이 잘 답하게 지시문을 설계 / 모델이 잘 판단하게 참조 맥락을 설계 / 에이전트가 안정적으로 일하게 실행 환경과 제약·검증 구조를 설계. 비유: 말에게 '우회전' 명령 / 지도·표지판·지형 제공 / 고삐·안장·울타리·도로 설계.",
    ],
  },
  {
    title: "AI BOM(Artificial Intelligence Bill of Materials)",
    course: "AI",
    definition:
      "**AI 시스템**을 구성하는 **데이터, 모델, 소프트웨어 라이브러리, 인프라** 등 모든 **구성요소**를 체계적으로 **목록화**하고 추적하는 **문서**",
    defShort: "AI 시스템 데이터·모델·SW 라이브러리·인프라 등 목록화 문서",
    lead: "AI 구성요소의 투명한 목록화, AI BOM",
    features: ["구성요소 목록화", "지속 추적 관리", "SBOM의 AI 확장"],
    keywords: ["모델 카드(Hugging Face Model Cards)", "SBOM", "CycloneDX", "SPDX"],
    tables: [
      {
        caption: "AI BOM 구성 요소",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["모델", "모델카드(Model Card)", "목적·성능·한계\n사용 지침 문서화"],
          ["데이터", "데이터시트(Datasheet)", "학습 데이터 출처\n수집·편향 명세"],
          ["연계", "SBOM 통합", "기존 SW BOM과\nCycloneDX/SPDX\nAI 명세 연계"],
          ["보안", "취약점 관리", "NVD/CVE 기반\n취약점 모니터링"],
        ],
      },
      {
        caption: "AI BOM 표준 포맷",
        headers: ["표준 포맷", "설명"],
        rows: [
          ["CycloneDX v1.5 (ML-BOM 확장)", "SW 구성요소 명세\nML 모델·데이터\n전용 필드 확장"],
          ["Hugging Face Model Cards", "의도된 용도\n성능·한계·편향\n정형화된 서식"],
        ],
      },
      {
        caption: "SBOM과 AI BOM 비교",
        headers: ["비교 기준", "SBOM", "AI BOM"],
        rows: [
          ["대상", "SW 패키지\n라이브러리", "AI 모델\n데이터셋\n알고리즘"],
          ["표준", "CycloneDX·SPDX", "모델카드\n데이터시트\n(표준 정립 중)"],
          ["보안 위협", "CVE 기반 취약점", "데이터 편향\n모델 오용\n적대적 공격"],
          ["규제 근거", "EO 14028(미국)", "EU AI Act\nNIST AI RMF"],
        ],
      },
    ],
    notes: [
      "AI BOM 구성 요소 체계: AI BOM → 모델 명세(아키텍처·버전·훈련 환경·성능 지표) / 데이터 명세(훈련 데이터셋·출처·라이선스·전처리) / 라이브러리(의존 패키지·버전·라이선스) / 알고리즘(학습 방법론·하이퍼파라미터·평가 기준).",
      "원문: 모델카드(Model Card) — 모델 목적·성능·한계·사용 지침을 표준 형식으로 문서화 / 데이터시트(Datasheet) — 학습 데이터 출처·수집 방법·편향 분석을 명세화 / SBOM 통합 — 기존 소프트웨어 BOM(CycloneDX/SPDX)과 AI 명세 연계 / 취약점 관리 — NVD/CVE 기반 AI 구성요소 취약점 지속 모니터링. 표준 포맷 — CycloneDX v1.5(ML-BOM 확장): 기존 소프트웨어 구성요소 명세 규격에 머신러닝(ML) 모델 아키텍처와 데이터 구조를 표현할 수 있는 전용 필드 목록을 확장하여 제공하는 대표적 표준 / Hugging Face Model Cards: AI 모델의 의도된 용도, 성능 메트릭, 한계점, 편향성 등의 성분을 한눈에 볼 수 있도록 정형화된 서식 목록. 비교 — 대상: 소프트웨어 패키지·라이브러리 / AI 모델·데이터셋·알고리즘, 표준: CycloneDX, SPDX / 모델카드, 데이터시트(표준 정립 중), 보안 위협: CVE 기반 소프트웨어 취약점 / 데이터 편향, 모델 오용, 적대적 공격, 규제 근거: EO 14028(미국) / EU AI Act, NIST AI RMF.",
    ],
  },
  {
    title: "오픈웨이트(Open-weight) 모델",
    course: "AI",
    definition:
      "학습 데이터와 소스 코드는 비공개하며, **학습된 가중치만 공개**하여 추론 및 추가 파인튜닝만 허용하는 AI 모델",
    defShort: "학습 데이터·소스 코드는 비공개, 학습된 가중치만 공개하는 AI 모델",
    lead: "가중치만 공개하는 AI 모델, 오픈웨이트 모델",
    features: ["가중치만 공개", "학습 데이터 비공개", "파인튜닝 허용"],
    keywords: ["가중치 공개", "파인튜닝", "재학습 제한", "라이선스", "상업 이용"],
    tables: [
      {
        caption: "오픈소스 모델과 오픈 웨이트 모델 비교",
        headers: ["구분", "Open Source", "Open Weights"],
        rows: [
          ["공개 범위", "코드·데이터\n훈련 과정\n가중치까지\n전부 공개", "훈련 끝난 모델의\n가중치만 공개"],
          ["활용", "구조·학습 방법\n수정·재현 가능", "그대로 실행\n파인튜닝해 활용"],
          ["예·한계", "초기 Stable Diffusion\n공개 모델", "데이터·코드\n전체 비공개 가능"],
        ],
      },
      {
        caption: "제공자 공개 범위",
        headers: ["구분", "오픈소스 모델", "오픈 웨이트 모델"],
        rows: [
          ["학습 데이터", "공개", "공개하지 않음"],
          ["전처리·학습 코드", "공개", "공개하지 않음"],
          ["모델 구조·학습 파이프라인", "공개", "공개하지 않음"],
          ["학습된 모델 가중치", "다운로드 공개", "다운로드 공개"],
          ["라이선스·문서", "공개", ""],
        ],
      },
    ],
    notes: [
      "사용자 환경(활용 및 개선): 오픈소스 모델은 누구나 활용 가능 — 다운로드/복제 → 환경 구성/재현 → 추론/사용 → 추가 학습/수정 → 개선본 공유/재배포(커뮤니티 기여·개선 사항 환류). 오픈 웨이트 모델은 가져온 가중치 사용 — 모델 로드 → 추론/사용 → 추가 학습(파인튜닝) → 개선된 모델 사용.",
      "원문: Open Source — 모델의 코드, 학습 데이터, 훈련 과정, 그리고 가중치까지 전부 공개, 누구나 모델 구조와 학습 방법을 수정하거나 재현 가능, 예: 초기 Stable Diffusion 공개 모델. Open Weights — 훈련이 끝난 모델의 가중치만 공개, 모델을 그대로 실행하거나 파인튜닝해 활용 가능, 하지만 학습 데이터나 학습 코드 전체가 공개되지 않을 수 있음.",
      "140회 정보관리 2교시 출제",
    ],
  },
  {
    title: "AI 슈퍼컴퓨팅 플랫폼(Supercomputing Platform)",
    course: "AI",
    definition:
      "GPU·NPU 등 AI 가속기와 고속 네트워크·스토리지를 결합하여 **초거대 AI 모델의 학습·추론을 대규모 병렬·분산 처리**하는 **고성능 컴퓨팅 플랫폼**",
    defShort: "초거대 AI 학습·추론을 대규모 병렬·분산 처리 고성능 컴퓨팅 플랫폼",
    lead: "초거대 AI 학습·추론을 위한 대규모 병렬·분산 처리, AI 슈퍼컴퓨팅 플랫폼",
    features: ["AI 가속기 결합", "노드 간 고속 통신", "대규모 병렬·분산"],
    keywords: ["AI 추론 및 학습", "병렬 및 분산처리"],
    tables: [
      {
        caption: "플랫폼 아키텍처",
        headers: ["계층", "구성"],
        rows: [
          ["⑤ Management(관리 계층)", "Scheduler·Kubernetes\nResource Management\nMonitoring·Security\nProvisioning"],
          ["④ Software(소프트웨어 계층)", "OS·CUDA·AI Framework\nPyTorch·TensorFlow\nDistributed Training\nMLOps"],
          ["③ Storage(스토리지 계층)", "NVMe\nParallel File System\nObject Storage\n분산 대용량 저장"],
          ["② Network(네트워크 계층)", "InfiniBand·RoCE\nNVLink\n고속 인터커넥트\n노드 간 통신"],
          ["① Compute(컴퓨트 계층)", "CPU·GPU·NPU·TPU\nAI Accelerator\n병렬·분산 연산\n다양한 연산 자원"],
        ],
      },
      {
        caption: "주요기술",
        headers: ["계층", "주요기술"],
        rows: [
          ["AI Compute", "GPU·NPU·TPU·CPU\nAI Accelerator"],
          ["High-Speed Network", "InfiniBand·RoCE\nNVLink·RDMA"],
          ["High-Performance Storage", "Parallel File System\nNVMe\nDistributed Storage\nObject Storage"],
          ["AI Software Stack", "CUDA·PyTorch·TensorFlow\nNCCL·MPI\nAI Framework"],
          ["Cluster / Resource Management", "Scheduler·Container\nKubernetes·Slurm"],
          ["AI Platform / MLOps", "Data Pipeline\nModel Registry\nTraining/Serving\nMLOps"],
        ],
      },
    ],
    notes: [
      "플랫폼 아키텍처 원문: ⑤ Management(관리 계층) — Scheduler, Kubernetes, Resource Management, Monitoring, Security, Provisioning / ④ Software(소프트웨어 계층) — OS, CUDA, AI Framework, PyTorch, TensorFlow, Distributed Training, MLOps / ③ Storage(스토리지 계층) — NVMe, Parallel File System, Object Storage, 분산 스토리지, 대용량 데이터 공급 / ② Network(네트워크 계층) — InfiniBand, RoCE, NVLink, 고속 인터커넥트, 노드 간 통신 / ① Compute(컴퓨트 계층) — CPU, GPU, NPU, TPU, AI Accelerator, 병렬·분산 연산(다양한 연산 자원, Compute Nodes).",
      "140회 정보관리 2교시 출제",
    ],
  },
  {
    title: "AI 네이티브 개발 플랫폼(AI-Native Development Platform)",
    course: "AI",
    definition:
      "**생성형 AI와 AI 에이전트를 활용**하여 코드 생성부터 테스트·배포까지 **소프트웨어 개발 전 과정을 지능화**하는 AI 기반 개발 플랫폼",
    defShort: "생성형 AI·AI 에이전트로 SW 개발 전 과정 지능화하는 개발 플랫폼",
    lead: "생성형 AI와 에이전트로 개발 전 과정을 지능화, AI 네이티브 개발 플랫폼",
    features: ["개발 전 과정 지능화", "자연어 기반 코딩", "AI Agent 협업"],
    keywords: ["생성형 AI", "AI Agent", "바이브 코딩", "MCP", "AI Gateway", "Model Studio"],
    tables: [
      {
        caption: "등장배경",
        headers: ["구분", "내용"],
        rows: [
          ["생산성 향상", "코드 자동 생성\n개발 효율 증대"],
          ["개발자 부족", "소규모 팀 지원"],
          ["시장 대응", "개발 기간 단축\n(TTM)"],
          ["AI 발전", "생성형 AI 확산\nAI Agent 확산"],
        ],
      },
      {
        caption: "AI 네이티브 개발 플랫폼 구성요소",
        headers: ["계층", "핵심기술", "설명"],
        rows: [
          ["AI 개발", "AI Developer Tools\nFramework", "코드 생성\n애플리케이션\n개발"],
          ["AI 테스트", "AI Agent·AI Gateway\nModel Studio", "테스트·AI 협업"],
          ["플랫폼", "LLM·MCP·Database\nAI Infra", "AI 개발환경\n실행 기반"],
        ],
      },
      {
        caption: "AI 네이티브 개발 플랫폼 개발절차",
        headers: ["단계", "주요 기능", "핵심기술", "설명"],
        rows: [
          ["요구 분석", "자연어 기반\n요구사항 입력", "Prompt\nAI Agent", "자연어 요구 분석\n기능 명세 도출\n개발 작업 도출"],
          ["코드 생성", "코드 자동 생성\n추천", "LLM\nCopilot", "소스·테스트\nAPI 코드 생성\n자동 최적화"],
          ["테스트", "테스트 및 디버깅", "AI Agent\nModel Studio", "테스트케이스\n생성·결함 분석\n코드 품질 검증"],
          ["배포", "CI/CD 및 운영", "MCP\nAI Gateway", "AI Agent 연계\n외부 시스템 연계\n자동 배포·운영"],
          ["개선", "코드 리팩토링\n최적화", "Feedback\nLLM", "운영 피드백 반영\n코드 개선\n성능 최적화 지속"],
        ],
      },
      {
        caption: "AI-Native vs 전통 개발플랫폼 비교",
        headers: ["구분", "AI-Native", "전통 개발"],
        rows: [
          ["개발", "AI 중심", "개발자 중심"],
          ["코딩", "자연어 기반", "직접 코딩"],
          ["테스트", "AI 자동화", "수동 수행"],
          ["생산성", "높음", "보통"],
        ],
      },
    ],
    notes: [
      "구성도: 개발자 —Prompt(자연어 입력)→ 개발 계층(Development Layer): AI 개발도구(Claude Code, Cursor 등) = AI Agent(자동화·협업) ↔ AI Gateway(통신 중개·제어) ↔ LLM(대규모 언어모델) + MCP Server(Model Context Protocol) → 테스트 계층(Test Layer): Model Studio(모델 개발·훈련·관리·배포 통합 환경) → 플랫폼 계층(Platform Layer): Framework(개발 프레임워크: Java, Python, Go 등)·Database(모델/리소스·메타데이터 저장)·AI Infrastructure(Cloud, GPU, 가상화, 스토리지)·기타 플랫폼 서비스(모니터링, 보안, 인증, 메시징, 로깅 등) → 코드 생성(Code Generation) → 테스트(Test & Debug) → 배포(CI/CD & Deploy) → 운영 및 모니터링(운영·관리) ⟲ 피드백(Feedback) → 지속적 개선(Optimization). 생성형 AI와 AI 에이전트를 기반으로 개발·테스트·플랫폼 계층을 통합하여 소프트웨어 개발 전 과정을 지능화.",
      "원문: 등장배경 — 생산성 향상(코드 자동 생성 및 개발 효율 증대), 개발자 부족(소규모 팀 개발 지원), 시장 대응(개발 기간 단축(TTM)), AI 발전(생성형 AI 및 AI Agent 확산). 구성요소 — AI 개발(AI Developer Tools, Framework: 코드 생성 및 애플리케이션 개발), AI 테스트(AI Agent, AI Gateway, Model Studio: 테스트 및 AI 협업), 플랫폼(LLM, MCP, Database, AI Infra: AI 개발환경 및 실행 기반). 개발절차 — 요구 분석(자연어 기반 요구사항 입력, Prompt·AI Agent: 자연어 요구사항을 분석하여 기능 명세와 개발 작업을 자동 도출), 코드 생성(코드 자동 생성 및 추천, LLM·Copilot: LLM이 소스코드, 테스트 코드 및 API를 자동 생성하고 최적화), 테스트(테스트 및 디버깅, AI Agent·Model Studio: 테스트케이스 생성, 결함 분석 및 코드 품질을 자동 검증), 배포(CI/CD 및 운영, MCP·AI Gateway: AI Agent와 외부 시스템을 연계하여 자동 배포 및 운영을 수행), 개선(코드 리팩토링 및 최적화, Feedback·LLM: 운영 피드백을 반영하여 코드 개선과 성능 최적화를 지속 수행).",
    ],
  },
  {
    title: "MAS(Multi Agent System)",
    course: "AI",
    definition:
      "여러 개의 자율적 소프트웨어 에이전트가 상호작용하며 협력 또는 경쟁을 통해 복잡한 문제를 분산적으로 해결하는 분산 인공지능 시스템",
    defShort: "SW 에이전트가 협력·경쟁을 통해 복잡한 문제를 분산 해결하는 시스템",
    lead:
      "에이전트 집단의 분산 지능, MAS",
    features: ["에이전트 자율성", "분산적 문제 해결", "경쟁/협력 수행"],
    keywords: ["자율", "분산", "통신", "경쟁/협력", "전문화", "적응성", "Crew AI", "Expert Agent", "강화학습"],
    tables: [
      {
        caption: "활용분야(특성별 핵심 기술)",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["자율", "GPT 기반 에이전트\n강화학습(RL) 기반 로봇", "독립 판단·동작\n중앙 통제 불요"],
          ["분산", "Event-driven Architecture\nFault-Tolerant Agent Design", "제어 권한 분산\n장애시 전체 유지"],
          ["통신", "RPC / REST / Pub-Sub", "정보 교환 통신\n협업·협상 수행"],
          ["경쟁/협력", "Multi-Agent Task Scheduler", "복잡 작업 효율화\n공동·경쟁 수행"],
          ["전문화", "전문가 에이전트 구조(Expert Agent)", "역할·지식 상이\n상호보완 작동"],
          ["적응성", "RL (Reinforcement Learning)", "환경 변화 대응\n새 상황 적응"],
        ],
      },
      {
        caption: "유형",
        headers: ["대분류", "세부 유형", "설명"],
        rows: [
          ["Independent", "이산형 독립", "각자 목표 추구"],
          ["Independent", "창발적 협력\n명시적 협력 없음", "상호작용 결과\n협력 행동 발현"],
          ["Cooperative", "통신·숙의", "공동 계획 수립"],
          ["Cooperative", "통신·협상", "자원·역할 배분"],
          ["Cooperative", "직접 통신 없음", "환경 관찰 협력"],
        ],
      },
    ],
    notes: ["개념도: Environment 안에 여러 Agent 집단(Organizational Relationship)이 존재하고, Agent 간 Interaction과 Area of Influence(영향 범위)가 겹치며 상호작용", "A2A 프로토콜과의 관계: MAS는 다중 에이전트 시스템 자체, A2A는 그 에이전트들이 조직·기술 경계를 넘어 통신하기 위한 개방형 프로토콜", "출제 이력: 2025.05 ITPE FR 5일차 1교시"],
  },
  {
    title: "A2A(Agent2Agent) 프로토콜",
    course: "AI",
    definition:
      "에이전트에 유용한 도구와 컨텍스트를 제공하는 MCP를 보완하여 AI 에이전트가 다양한 엔터프라이즈 플랫폼이나 애플리케이션에서 서로 통신하고 안전하게 정보는 교환할 수 있는 개방형 프로토콜",
    defShort: "AI 에이전트들이 다양한 플랫폼에서 서로 통신하는 개방형 프로토콜",
    lead:
      "에이전트 간 통신 규약, A2A 프로토콜",
    features: ["MCP 보완", "비공유 협업", "기존 표준 기반"],
    keywords: ["자율", "분산", "통신", "경쟁/협력", "전문화", "적응성", "Crew AI", "Expert Agent", "강화학습"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["설계 원칙", "에이전트 능력수용", "도구·컨텍스트 공유 없이 협업"],
          ["설계 원칙", "기존 표준 기반", "HTTP·SSE·JSON-RPC 등 기존 표준"],
          ["설계 원칙", "보안 보장", "OpenAPI 동등 엔터프라이즈 인증"],
          ["설계 원칙", "장기 실행 작업 지원", "실시간 피드백·알림\n상태 업데이트 제공"],
          ["주요 기능", "모달리티 지원", "오디오·비디오 스트리밍 등 지원"],
          ["주요 기능", "기능 검색", "JSON 에이전트 카드·기능 공유"],
          ["주요 기능", "작업 관리", "에이전트 간 통신 작업 완료 지향"],
          ["주요 기능", "협업", "컨텍스트·답변·아티팩트\n사용자 지시사항 전달"],
          ["주요 기능", "사용자 경험 협상", "'파트' 지정 컨텐츠 유형 관리\nUI 기능 명시"],
        ],
      },
    ],
    notes: ["MCP/A2A 상호 보완적 관계: 에이전트 내부는 MCP로 도구·API 연결, 에이전트끼리는 A2A protocol로 통신(조직·기술 경계를 넘어)", "개념도: User → Host Agent → Remote Agent(A2A Client) ⇄ A2A ⇄ A2A Server(LangGraph·Google ADK·Crew AI Agent)", "출제 이력: 2025.07 KPC 모의고사 1교시"],
  },
  {
    title: "AI Agent",
    course: "AI",
    definition:
      "환경과 상호 작용하여 데이터 수집하고, 데이터를 사용하여 사전 결정된 목표를 달성하기 위해 필요한 작업을 스스로 결정해서 수행할 수 있는 자율 시스템",
    defShort: "환경과 상호 작용해 목표 달성 위한 작업을 스스로 결정해 수행하는 시스템",
    lead:
      "목표 지향의 자율 시스템, AI Agent",
    features: ["환경 상호작용", "자율적 작업 결정", "경험 기반 학습"],
    keywords: ["인식(Perception)", "추론(Reasoning)", "행동(Action)", "학습(Learning)"],
    tables: [
      {
        caption: "기술요소 및 유형",
        headers: ["구분", "세부항목", "설명"],
        rows: [
          ["기술요소", "Sensor", "환경 데이터 수집 인터페이스\n카메라, 마이크, 웹 검색 기능 포함"],
          ["기술요소", "Process", "수집 데이터 처리, 의사결정 수행"],
          ["기술요소", "Knowledge Base", "보유한 정보와 경험 저장"],
          ["기술요소", "Actuator", "결정한 행동을 실행하는 구성요소"],
          ["기술요소", "학습 알고리즘", "과거 경험 기반 학습 알고리즘"],
          ["기술요소", "엣지 컴퓨팅", "엣지 컴퓨팅 이용 Tiny ML 수행"],
          ["유형", "단순 반사 에이전트", "사전 정의 규칙 기반 동작\n과거 경험 고려 안 함"],
          ["유형", "모델 기반 에이전트", "과거 경험 활용 의사결정"],
          ["유형", "목표 기반 에이전트", "구체적 목표 달성 최적 행동 선택"],
          ["유형", "유틸리티 기반 에이전트", "행동의 효용성 계산 의사결정"],
        ],
      },
    ],
    notes: ["개념도: Environment →Perception→ Sensor → Process ↔ Knowledge Base → Actuator →Action→ Environment", "발전: AI Agent(Automate simple task) + 강화/지도/비지도 학습 → Agentic AI(Make autonomous decision)"],
  },
  {
    title: "에이전틱 AI(Agentic AI)",
    course: "AI",
    definition:
      "다양한 AI 기술을 메모리, 계획, 환경 감지, 도구 활용, 안전 지침 준수와 같은 기능과 결합하여 목표를 달성하기 위한 작업을 스스로 수행하는 AI",
    defShort: "AI 기술을 결합해 목표를 달성하기 위한 작업을 스스로 수행하는 AI",
    lead: "목표 작업의 자율 수행, 에이전틱 AI",
    features: ["목표 지향 자율성", "외부 도구 행동", "지속적 자기 개선"],
    keywords: ["자율", "인식", "추론", "행동", "학습", "LLM", "RAG", "데이터 플라이 휠"],
    tables: [
      {
        caption: "프로세스 [인추행학]",
        headers: ["구분", "기술요소"],
        rows: [
          ["인식(Perceive)", "데이터 수집\n특징 추출"],
          ["추론(Reason)", "LLM 기반 추론\nRAG(검색 증강 생성)"],
          ["행동(Act)", "목표 설정\n자율 계획\nAPI 통합"],
          ["학습(Learn)", "피드백 루프\n데이터 플라이휠"],
          ["성숙도 및 관리", "SaaS 통합\nIoT 디바이스 통합\n자율적 의사 결정\n보안 및 거버넌스"],
        ],
      },
      {
        caption: "사례",
        headers: ["구분", "주요사례"],
        rows: [
          ["산업 최적화", "공급망 최적화\n제조 공정 자동화"],
          ["보안 강화", "사이버보안 취약성 분석\n금융 거래 감시"],
          ["의료 지원", "의료진 업무 보조\n원격 환자 모니터링"],
          ["소매 및 서비스", "개인화된 고객 서비스\n재고 관리 및 주문 예측"],
        ],
      },
    ],
    notes: ["개념도: USER ↔ AI Agent(Database·Vector DB → LLM → Action) + Data Flywheel → Model Customization", "프로세스 흐름: 인식(데이터 수집) → 추론(LLM 추론·RAG 활용) → 행동(API 기반 외부 서비스 통합) → 학습(피드백 루프로 모델을 개선 — 데이터 플라이 휠)"],
  },
  {
    title: "AX(AI Transformation)",
    course: "AI",
    definition:
      "기업이 기존 사업 모델과 작업 프로세스를 버리고 AI 기술을 전사적으로 적용해 사업 모델, 작업 프로세스, 제품, 서비스 등을 변화를 추구하는 전환 과정",
    defShort: "AI 기술을 전사적으로 적용해 사업 모델·프로세스 변화 추구 전환 과정",
    lead:
      "AI 전사 적용의 전환, AX(AI Transformation)",
    features: ["전사적 AI 적용", "사업 모델 전환", "파일럿 후 확산"],
    keywords: ["DX(Digital Transformation)", "AI 서비스", "AI 인프라", "AI 거버넌스"],
    tables: [
      {
        caption: "절차 [전파혁교커업]",
        headers: ["단계", "설명"],
        rows: [
          ["1) AI 전략 수립", "고유 데이터 소스 식별\n자동화 효율 좋은 프로세스 식별\nAI 혁신 위한 내부 리소스 식별"],
          ["2) 파일럿 프로젝트 실행", "조직 신뢰 확보 혁신 기반 마련\n모멘텀 생성 확산 동력 확보"],
          ["3) 사내 AI 혁신팀 구축", "내부 혁신팀 자체 역량 육성\n아웃소싱 지양 장기 관점 운영"],
          ["4) AI 교육 제공", "역할별 교육 직원 역량 강화"],
          ["5) 내외부 커뮤니케이션", "내외부 소통 의사소통 개선\n전사 조정 보장 업무 정합 확보"],
          ["6) AI 전략 업데이트", "전략 주기 갱신 환경 변화 반영\n혁신 지속 유지 지속 개선 체계"],
        ],
      },
      {
        caption: "기술요소 [서인거]",
        headers: ["구성요소", "특징 기술", "설명"],
        rows: [
          ["AI 서비스", "자연어 처리(NLP)\n영상 분석\n기계학습(ML)\n자율 주행", "언어 이해·처리 능력\n얼굴 인식, 물체 감지, 패턴 인식\n데이터 기반 자체 모델 학습·구축\n자율 주행 차량 및 드론 기술"],
          ["AI 인프라", "GPU, TPU", "대규모 데이터 병렬 처리 학습"],
          ["AI 인프라", "분산 컴퓨팅\n클라우드 서비스", "대규모 데이터 처리·분석\n분산 시스템·클라우드 기술 통합"],
          ["AI 인프라", "AI 개발 플랫폼\n배포 플랫폼", "모델 개발·훈련·배포 종합 플랫폼\nAI 생태계 형성 필수"],
          ["AI 거버넌스", "데이터 거버넌스", "수집·저장·처리·공유 표준 준수"],
          ["AI 거버넌스", "모델 거버넌스", "품질·윤리 모니터링\n생명주기 관리 프로세스 정의"],
          ["AI 거버넌스", "규정 준수", "국가·산업 규정 부합 보장\n법적 책임 준수"],
        ],
      },
    ],
    notes: ["개념도: 대상(전략·목표·시스템, 조직·문화·프로세스, 커뮤니케이션) + 적용 기술(Digital Transformation, AI 서비스, AI 인프라, AI 거버넌스) → 기대 효과(가치 창출/이익 증가, 효율성/생산성 향상, 신규 사업 진출)"],
  },
  {
    title: "공공 AX 전략",
    course: "AI",
    definition:
      "**AI 서비스 특성**에 따라 AI 전환(AX)은 **기존 사업 모델, 수행 방식과는 다른 접근**으로의 공공 서비스 구현과 운영을 요구 — 공공 AX는 단편적 AI 솔루션 도입이 아닌 **AI Full Stack(인프라·데이터·모델·오케스트레이션·응용 등) 관점**에서 **표준화, 종속 회피, 민첩 대응**이 가능한 방향으로의 접근이 핵심",
    defShort: "AI Full Stack 관점의 표준화·종속 회피·민첩 대응으로 공공 서비스를 구현·운영하는 AX 전략",
    lead: "단편적 솔루션 도입이 아닌 AI Full Stack 관점의 전환, 공공 AX 전략",
    features: ["표준화", "종속 회피", "민첩 대응"],
    keywords: ["AX 대상 서비스", "AX 구현", "AX 운영 거버넌스", "AX 도입 방법론"],
    tables: [
      {
        caption: "성공적인 AX의 3요소",
        headers: ["구분", "① AX 대상·서비스", "② AX 구현", "③ AX 운영·거버넌스"],
        rows: [
          ["방향(질문)", "AI 전환 대상", "구축·적용 방법", "지속 운영·관리"],
          ["방향(예)", "업무·서비스\n의사결정\n프로세스\n고객 접점", "데이터·모델\n인프라·시스템\nRAG·에이전트", "보안·모니터링\n품질·책임성\n조직·ROI"],
          ["구성요소", "고객 경험\n운영 및 생산성\n제품 및 서비스", "AI as a Service\nAI Infra\nAI Governance", "Active Learning\nMLOps\nCompliance"],
        ],
      },
      {
        caption: "전략 전환",
        headers: ["구분", "기존", "전환 방향"],
        rows: [
          ["구현 전략", "사업 단위 납품", "플랫폼 기반\n서비스 설계"],
          ["운영 인프라", "정적 시스템", "동적 AI\n파이프라인"],
          ["AI 솔루션", "단순 자동화 도구", "업무 지능화\n파트너"],
          ["거버넌스", "사후 규제", "내재화된\n책임 설계"],
        ],
      },
      {
        caption: "AI Full Stack 중심 AI 공공 AX 도입 방법론(프레임워크)",
        headers: ["도입 단계(7D)", "핵심 질문", "설명·키워드"],
        rows: [
          ["목표 정의\n(Define)", "대국민 대상\n어떤 서비스 제공", "목적·대상 도출\nIdentity·Objective\nUser/Scope"],
          ["Data 정립\n(Discover)", "어떤 Data 활용해\n서비스 운영?", "공공 서비스 위한\nData 선정\nMetadata"],
          ["Data 운영 방안 설계\n(Develop)", "어떻게 Data를\n축적·관리?", "지속 축적·관리\n보안 방안 설계\nData Architecture\nKnowledge Base"],
          ["AX 투자 모델 수립\n(Design)", "AX 사업 비용\n조달·집행 방법?", "구축·운영 지출\nCAPEX(선투자)\nOPEX(운영비)"],
          ["AI Full Stack 구성\n(Deploy)", "AX Framework\n어떻게 표준화?", "특정 업체 비종속\n최적화 아키텍처\nAI Full Stack·LLMOps"],
          ["서비스 제공 채널 선택\n(Deliver)", "대국민 대상\n어떤 채널로?", "쉽고 빠른 접근\n앱 선정\n옴니채널·UX\n포용적 접근"],
          ["AX 활용 진단·모니터링\n(Diagnose)", "이후 운영·관리\n어떻게?", "성능·비용·준법\n윤리 상시 진단\n환류 체계 구현\nPerformance·Compliance"],
        ],
      },
    ],
    notes: [
      "공공 AX는 단편적 AI 솔루션 도입이 아닌, AI Full Stack(인프라·데이터·모델·오케스트레이션·응용 등) 관점에서 표준화, 종속 회피, 민첩 대응이 가능한 방향으로의 접근이 핵심.",
      "원문: ① AX 대상·서비스 — (방향) 무엇을 AI로 전환할 것인가?(예: 업무, 서비스, 의사결정, 프로세스, 고객 경험 등) (구성요소) 고객 경험·운영 및 생산성·제품 및 서비스 / ② AX 구현 — (방향) 어떻게 AI를 구축·적용할 것인가?(예: 데이터, 모델, 인프라, 시스템, RAG, 에이전트 등) (구성요소) AI as a Service·AI Infra·AI Governance / ③ AX 운영·거버넌스 — (방향) 어떻게 AI를 지속 운영·관리할 것인가?(예: 보안, 모니터링, 품질, 책임성, 조직, ROI 등) (구성요소) Active Learning·MLOps·Compliance. ※ (구현 전략) '사업 단위 납품' → '플랫폼 기반 서비스 설계' (운영 인프라) '정적 시스템' → '동적 AI 파이프라인' (AI 솔루션) '단순 자동화 도구' → '업무 지능화 파트너' (거버넌스) '사후 규제' → '내재화된 책임 설계'.",
      "7D 원문: 목표 정의(대국민을 대상으로 어떤 공공 서비스를 제공할 것인가? → 공공 서비스의 목적·대상 도출 ※ Identity, Objective, User/Scope), Data 정립(어떤 Data를 활용하여 공공 서비스를 운영할 것인가? → 공공 서비스를 위한 Data 선정 ※ Metadata), Data 운영 방안 설계(어떻게 Data를 축적·관리할 것인가? → Data의 지속적 축적과 관리, 보안 방안 설계 ※ Data Architecture, Knowledge Base), AX 투자 모델 수립(AX 사업의 비용을 어떻게 조달·집행할 것인가? → AX 구축과 운영 지출 계획 수립 ※ CAPEX(선투자) & OPEX(운영비)), AI Full Stack 구성(AX Framework를 어떻게 표준화할 것인가? → 특정 업체·모델에 종속되지 않는, 최적화 아키텍처 정립 ※ AI Full Stack, LLMOps), 서비스 제공 채널 선택(대국민 대상 어떠한 채널을 통해 서비스를 제공할 것인가? → 대국민이 쉽고, 빠르게 접근할 수 있는 애플리케이션 선정 ※ 옴니채널, 사용자 경험, 포용적 접근), AX 활용 진단·모니터링(AX 이후 운영·관리는 어떻게 할 것인가? → 성능, 비용, 준법·윤리 등에 대한 상시 진단 및 환류 체계 구현 ※ Performance, Cost, Compliance).",
    ],
  },
  {
    title: "인공지능 경영시스템(ISO 42001:2023)",
    course: "AI",
    definition:
      "조직의 인공지능 경영시스템 수립, 구현, 유지, 개선을 위한 요구사항에 대한 AI 국제 경영시스템 표준",
    defShort: "수립·구현·유지·개선 요구사항에 대한 AI 국제 경영시스템 표준",
    lead:
      "AI 경영의 국제 표준, ISO 42001",
    features: ["PDCA 순환 구조", "AI 위험 기반 관리", "시스템 영향평가"],
    keywords: ["PDCA", "조직상황", "리더십", "기획", "지원", "운용", "성과평가", "개선", "AI 리스크 평가", "AI 영향 평가"],
    tables: [
      {
        caption: "표준 구성 [조리기지운성개] — PDCA 매핑",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["Plan", "조직의 상황(4장)", "조직 상황의 이해\n근로자 및 이해관계자\nAI 경영시스템 적용범위\n경영시스템"],
          ["Plan", "리더십(5장)", "리더십과 의지 표명, AI 방침\n조직의 역할 및 책임"],
          ["Plan", "기획(6장)", "리스크 관리\nAI 목표와 달성 기획\n변경기획"],
          ["Do", "지원(7장)", "자원, 역량, 인식\n의사소통, 문서화"],
          ["Do", "운용(8장)", "운용기획, AI 위험평가\nAI 위험 처리, AI 시스템 영향평가"],
          ["Check", "성과평가(9장)", "모니터링 및 성과평가\n내부심사, 경영검토"],
          ["Act", "개선(10장)", "일반사항, 시정조치, 지속적 개선"],
        ],
      },
      {
        caption: "요구사항 [목리윤투책]",
        headers: ["요구사항", "설명"],
        rows: [
          ["목적과 범위 설정", "AI 시스템의 목적과 범위 명확화"],
          ["리스크 관리", "잠재적 리스크 식별 및 관리"],
          ["윤리 준수", "개발·구현·운영·유지 윤리 준수"],
          ["투명성", "개발·구현·운영·유지 투명 공개"],
          ["책임성", "AI 시스템의 결과에 대한 책임"],
        ],
      },
    ],
    notes: ["표준 장 구성: 4.조직의 상황 → 5.리더십 → 6.기획 → 7.지원 → 8.운용 → 9.성과평가 → 10.개선 (8.2 AI 위험평가 · 8.3 AI 위험 처리 · 8.4 AI 시스템 영향평가가 핵심 차별점)"],
  },
  {
    title: "소버린 AI(Artificial Intelligence)",
    course: "AI",
    definition:
      "자체 인프라, 데이터, 인력 및 비즈니스 네트워크를 사용하여 AI를 구축하는 국가의 역량과 데이터 주권과 규제 준수를 보장하기 위해 개발된 AI 기술",
    defShort: "AI를 구축하는 국가의 역량과 데이터 주권·규제 준수 보장 AI 기술",
    lead: "데이터 주권의 자체 구축, 소버린 AI",
    features: ["데이터주권 보호", "자체 인프라 구축", "문화·언어 반영"],
    keywords: ["데이터주권", "자체 인프라", "독립적 운영", "대규모 AI 인프라"],
    tables: [
      {
        caption: "기술요소",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["데이터", "데이터 저장 및 관리 기술\n데이터 보안 기술\n데이터 주권 보호 기술", "자체 클라우드·데이터 센터 저장\n암호화·접근 제어 보안 강화\n국경 관리·로컬 데이터 처리\n기술 및 법적 조치"],
          ["학습 및 배포", "분산 학습, 연합 학습\n설명가능한 AI\n모델 해석 도구", "분산 학습·다양한 데이터 소스\n로컬 내에서 학습\n높은 신뢰성·투명성 확보"],
          ["인프라", "고성능 컴퓨팅 자원\n클라우드 서비스", "고성능 GPU·AI 아키텍처 활용\n대규모 AI 인프라 구축\n슈퍼컴퓨터 센터 고도화"],
        ],
      },
      {
        caption: "사례",
        headers: ["사례", "설명"],
        rows: [
          ["한국", "자체 개발 클라우드 서비스 기반\n엔비디아 협력 소버린 AI 구현"],
          ["프랑스", "소재 기업, 엔비디아와 협력\n클라우드 네이티브 AI 슈퍼컴퓨터"],
          ["싱가포르", "엔비디아와 협력\n슈퍼컴퓨터센터 GPU 업그레이드"],
        ],
      },
    ],
    notes: ["개념도: 소버린 AI — 자체 인프라 · 인력 및 네트워크 · 독립 운영 · 문화 및 언어 반영 AI · 자국 정책 준수 및 맞춤화"],
  },
  {
    title: "합성 데이터(Synthetic Data)",
    course: "AI",
    definition:
      "통계적 방법 등을 이용하여 추정된 모형에서 새롭게 생성되어 실제 데이터와 통계 속성이 동일한 모의 데이터",
    defShort: "추정된 모형에서 생성된 실제 데이터와 통계 속성이 동일한 모의 데이터",
    lead: "동일 통계 속성의 생성, 합성 데이터",
    features: ["통계 속성 동일", "모형 기반 생성", "민감 정보 보호"],
    keywords: ["통계적 속성", "모의 데이터", "완전합성", "부분합성", "복합합성", "전통적 통계 또는 베이지안", "기계학습 모형", "차등정보보호"],
    tables: [
      {
        caption: "종류 [완부복]",
        headers: ["종류", "특징", "설명"],
        rows: [
          ["완전 합성 데이터", "가상 생성 데이터", "실제 데이터 없이 모두 가상 생성\n정보보호 측면 가장 강력한 보안성"],
          ["부분 합성 데이터", "일부 변수만 대체", "일부 속성·변수 선택해 합성 대체\n민감 정보 변수 합성 데이터로 대치"],
          ["복합 합성 데이터", "추가대체변수도출", "일부 변수 값 합성 데이터로 생성\n실데이터와 함께 이용해 값 재도출"],
        ],
      },
      {
        caption: "생성방법 [가신베 변간확]",
        headers: ["구분", "기법"],
        rows: [
          ["통계기반", "가우스 혼합 모델\nsynthpop-CART\n베이지안 네트워크"],
          ["AI기반", "변분 오토인코드(VAE)\nGANs\n확산 모델(Diffusion Model)"],
        ],
      },
      {
        caption: "유용성 안전성 검증방안 [모V이 일2구모 생구지주 구연추]",
        headers: ["구분", "데이터 유형", "검증지표"],
        rows: [
          ["유용성", "비정형\n합성데이터", "모델 성능\nVisual Turing Test\n이미지 품질"],
          ["유용성", "정형\n합성데이터", "1차원 분포 유사\n2차원 관계 유사\n구별 불가능성\n모형성능 유사성"],
          ["안전성", "비정형\n합성데이터", "생성절차평가\n구조적 유사성\n지각적 유사성\n주관적 평가"],
          ["안전성", "정형\n합성데이터", "구별 위험도\n연결 위험도\n추론 위험도"],
        ],
      },
      {
        caption: "생성 과정 [사생안유심활]",
        headers: ["단계", "설명"],
        rows: [
          ["사전준비", "활용목적·범위 설정\n생성·활용 주체 설정\n원본데이터 이해·생성계획\n원본데이터 확보"],
          ["합성데이터 생성", "원본데이터 탐색적 분석\n원본데이터 전처리\n합성데이터 생성\n합성데이터 후처리"],
          ["안전성 및 유용성 검증", "측정지표 결정\n지표별 임계값 산출\n안전성 및 유용성 측정\n검토 및 후처리"],
          ["심의위원회 평가", "내외부 전문가 평가"],
          ["활용 및 안전한 관리", "활용\n안전한 관리"],
        ],
      },
      {
        caption: "합성 데이터 참조모델",
        headers: ["분야", "합성데이터셋", "유형", "규모", "활용 목적"],
        rows: [
          ["보건의료", "구강 이미지", "비정형", "1,000장", "충치진단 AI 개발"],
          ["공공안전", "안전모 착용", "비정형", "5,500장", "착용 감지 AI 개발"],
          ["보건의료", "혈당 측정정보", "정형", "723건", "IoT 기기 보정"],
          ["유통", "멤버십 사용내역", "정형", "102,503건", "제휴사 선호 분석"],
          ["금융", "기업주주·대표자", "정형", "1,860건", "신용평가 모델"],
        ],
      },
    ],
  },
  {
    title: "AI Ready Data",
    course: "AI",
    definition:
      "인공지능(AI) 및 머신러닝(ML) 모델의 훈련, 검증 및 테스트에 바로 사용할 수 있도록 준비, 구조화, 정리된 데이터",
    defShort: "AI 모델 훈련·검증 및 테스트에 바로 사용할 수 있도록 준비된 데이터",
    lead: "훈련·검증용 구조화 정리, AI Ready Data",
    features: ["학습에 바로 사용", "구조화된 형태", "클래스 라벨 부여"],
    keywords: ["원시데이터", "포맷", "가공 및 데이터 라벨링", "클래스 라벨(단일, 다중)"],
    tables: [
      {
        caption: "텍스트/음성/이미지 데이터 획득 및 정제 방법",
        headers: ["절차", "세부 절차"],
        rows: [
          ["데이터 정의", "원시데이터 정의 및 포맷\n획득 규모"],
          ["획득 데이터 특성 분석", "원시데이터 획득 이슈사항 도출\n원시데이터 적합성 검토·선정"],
          ["획득 절차 및 항목", "획득·정제·획득방법 절차 수립\n획득항목 정의, 저장 및 관리"],
          ["획득 데이터 정제 방식", "정제 프로세스 및 정제 기준 수립"],
          ["획득 도구 및 정제 도구", "획득 및 정제도구"],
          ["획득 시 고려사항", "법·제도 준수\n다양성 확보, 편향 방지, 윤리 준수\n사업계획서·구축 요건 일치\n기타 텍스트 데이터 품질 고려사항"],
        ],
      },
      {
        caption: "영상(동적/정적) 이미지 획득 및 정제 방법",
        headers: ["절차", "세부 절차"],
        rows: [
          ["데이터 정의", "동적 영상, 정적 이미지"],
          ["획득 데이터 특성 분석", "데이터 특성 분석·획득 방법\n데이터 확보 방안, 획득 방법·계획"],
          ["획득 절차 및 항목", "데이터 획득 단계 절차\n원시데이터 획득 방법\n가공·라벨링 단계 데이터 식별\n세부 항목·공통 참조 기준 항목"],
          ["획득 데이터 정제 방식", "정제 단계 절차·정제 방법·기준"],
          ["획득 도구 및 정제 도구", "종별 획득 도구 유형\n영상 이미지 데이터 획득 환경 정보\n영상(동적/정적) 이미지 형태\n원시데이터 정제 도구·제출 방법"],
          ["획득 시 고려사항", "획득 가능성, 데이터 정확성\n보안사항·개인정보 및 저작권\n데이터 균형, 신뢰성"],
        ],
      },
      {
        caption: "데이터 관련 용어",
        headers: ["구분", "용어", "설명"],
        rows: [
          ["활동", "데이터 획득(Data Acquisition)", "현실 세계에서 직접 수집·생성\n법률적 제약 없이 원시데이터 확보"],
          ["활동", "데이터 정제(Data Refinement)", "형식 맞춤·중복 제거·비식별화\n전처리로 원천데이터 확보"],
          ["활동", "데이터 라벨링(Data Labeling)", "목적 부합 정보 원천데이터 부착"],
          ["데이터", "라벨링데이터(Labeled Data)", "원천데이터에 부여한 참값·속성\n설명·주석 포함 어노테이션 집합"],
          ["데이터", "원시데이터(Raw Data)", "획득 단계 수집·생성 데이터\n음성·이미지·영상·텍스트"],
          ["데이터", "원천데이터(Source Data, Unlabeled Data)", "라벨링 투입 위한 정제 데이터\n라벨링데이터 미부여 상태"],
          ["활동", "인공지능 학습용 데이터 구축", "임무정의·획득·정제·라벨링 등\n학습용 데이터 구축 활동"],
          ["데이터", "참값(Ground Truth)", "라벨링된 정확한 값·사실 표현"],
          ["활동", "어노테이션(Annotation)", "원천데이터에 주석 표시 작업\n설명정보 표현방식 지칭"],
        ],
      },
    ],
    notes: ["영상(동적/정적) 이미지 획득·정제: 데이터 정의(동적 영상·정적 이미지) → 특성 분석 → 획득 절차 및 항목 → 정제 방식 → 도구 → 고려사항(획득 가능성, 데이터 정확성, 보안사항·개인정보 및 저작권, 데이터 균형, 신뢰성)", "출제 이력: 2026.02 ITPE FR 5일차 2교시"],
  },
  {
    title: "AI 신뢰성 인증",
    course: "AI",
    definition:
      "데이터 및 모델의 편향, 인공지능 기술에 내재한 위험과 한계를 해결하고, 인공지능을 활용하고 확산하는 과정에서 부작용을 방지하기 위해 준수해야 하는 가치 기준",
    defShort: "인공지능에 내재한 위험과 한계 해결, 부작용 방지 위해 준수할 가치 기준",
    lead:
      "믿을 수 있는 AI의 조건, AI 신뢰성 인증",
    features: ["안전성", "설명가능성", "공평성"],
    keywords: ["ISO/IEC TR 24028", "안전성", "설명가능성", "투명성", "견고성", "공평성", "다양성"],
    tables: [
      {
        caption: "핵심 속성 [안설투견공]",
        headers: ["핵심속성", "설명"],
        rows: [
          ["안전성(safety)", "실행 시 위험 가능성 완화·제거"],
          ["설명가능성(explainability)", "판단·예측 과정 이해 가능 제시\n원인 추적 가능한 상태"],
          ["투명성(transparency)", "결정 이유 설명·근거 추적 가능\n목적·한계 정보 사용자에게 전달"],
          ["견고성(robustness)", "외부 간섭·극한 환경 성능 유지"],
          ["공평성(fairness)", "특정 그룹 차별·편향성 없음\n차별·편향 포함 결론 배제"],
        ],
      },
      {
        caption: "신뢰성 요건 [존책안투]",
        headers: ["요건", "설명"],
        rows: [
          ["다양성 존중", "공평성·공정성(fairness)\n정당성(justice)"],
          ["책임성", "책무성(responsibility)\n감사가능성(auditability)\n답변가능성(answerability)"],
          ["안전성", "통제가능성·제어가능성\n보안성(security)\n강건성·견고성(robustness)\n성능보장성(reliability)"],
          ["투명성", "설명가능성(explainability)\n추적가능성(traceability)\n이해가능성\n해석가능성(Interpretability)"],
        ],
      },
      {
        caption: "AI 신뢰성에 관련된 표준",
        headers: ["표준", "핵심"],
        rows: [
          ["ISO/IEC TR 24028:2020", "인공 지능의\n신뢰성에 대한\n개요"],
          ["ISO/IEC 22989", "AI 개념과 용어"],
          ["ISO/IEC 23053", "인공 지능(AI) 및\n기계 학습(ML)\n프레임워크"],
          ["ISO/IEC 23894:2023", "인공지능 위험\n관리에 대한 지침"],
          ["ISO/IEC 42001", "인공지능 경영\n시스템에 대한\n지침"],
        ],
      },
    ],
    notes: ["신뢰성 요소: 생명주기별 요구사항 분류(계획 및 설계 → 데이터 수집 및 처리 → 인공지능 모델 개발 → 시스템 구현 → 운영 및 모니터링) × 인공지능 구성요소(학습용 데이터·모델 및 알고리즘·시스템·사람-인공지능 인터페이스) — 인공지능 윤리 기준 준용(3대 기본원칙 10대 핵심요건 중 기술적으로 적용 가능한 4개 요건 준용)"],
  },
  {
    title: "공공부문 초거대AI 도입, 활용 가이드라인 2.0(2025.04)",
    course: "AI",
    definition:
      "초거대AI 등장에 따라 기업 및 공공부문의 일하는 방식이 변화되고 있는 과정에서 초거대AI를 도입하기 위한 절차 및 내용에 대한 가이드라인",
    defShort: "공공부문 초거대AI를 도입하기 위한 절차 및 내용에 대한 가이드라인",
    lead: "공공 초거대AI 도입 지침, 공공부문 가이드라인 2.0",
    features: ["공공부문 특화", "보안 등급 연계", "성과 중심 관리"],
    keywords: ["데이터 보안 등급", "서비스 도입 방식", "서비스 레벨 목표", "유지보수 및 운영", "성과관리"],
    tables: [
      {
        caption: "도입절차 [보클데서유성]",
        headers: ["절차", "설명"],
        rows: [
          ["3.2.1 데이터 보안 등급", "업무 중요도 따라 3개 등급 분류\n기밀·민감·공개\n보안정책 적용"],
          ["3.2.2 클라우드 구성 방안", "클라우드 영역·규모 선정\n클라우드 도입유형 결정\n클라우드 서비스 구성"],
          ["3.2.3 데이터 학습 방식", "파운데이션 모델\n파인튜닝된 모델\n사후 학습된 모델\nRAG(검색증강생성) 기반 모델"],
          ["3.2.4 서비스 도입 방식", "디지털 서비스 구매\n(컴퓨팅서비스·융합서비스)\n조달 용역발주 방식 추진"],
          ["3.2.5 유지보수 및 운영(Ops)", "데이터 준비·모델 구축·초기 설정\n사전학습·추가학습·교육\n배포·모니터링·최적화\n운영 관리·거버넌스 체계 마련"],
          ["4 성과 관리", "AI 과제 체계적 성과 관리\n성과지표 설정 및 관리"],
        ],
      },
      {
        caption: "성과 지표 [투과산결]",
        headers: ["구분", "정의"],
        rows: [
          ["투입지표", "개발·운영 투입 자원량 지표\n데이터·컴퓨팅 자원·인력 등"],
          ["과정지표", "중간 산출물·진행 상황 지표"],
          ["산출지표", "구축 완료 후 1차적 산출물 지표"],
          ["결과지표", "궁극적 효과·공공부문 영향 지표"],
        ],
      },
      {
        caption: "AI 기능분류별 성과지표 Pool [지자대모]",
        headers: ["AI기능분류", "성과지표 Pool"],
        rows: [
          ["지능형 정보처리", "정보매칭·추출\n정보분석·전환\n예측·계획, 식별·분류\n언어·문서처리, 통합플랫폼"],
          ["자동화 업무 지원", "판정·의사결정\n서비스 연계·처리\n기획·창작\n통합플랫폼"],
          ["대화형 서비스", "상담, 번역\n추천·제안\n언어·문서처리\n통합플랫폼"],
          ["모니터링·알람", "모니터링·알람\n통합플랫폼"],
        ],
      },
    ],
    notes: ["공공AI 3대 전략 목표: 대국민 서비스 혁신(초개인화·포용적 서비스·사용자 경험 혁신), 사회문제 해결(사회적 난제 해법 도출·24시간 국민안전 확보), 일하는 방식 효율화(AI와 협업 일상화·업무 자동화 및 효율화·최적의 의사결정 지원)"],
  },
  {
    title: "생성형 인공지능 서비스 이용자 보호 가이드라인",
    course: "AI",
    definition:
      "생성형 인공지능 서비스 이용 과정에서 잠재적 위험들 사전 방지 및 이용자 권익 보호 위한 기본 원칙과 실천 방식 제시",
    defShort: "생성형 AI 위험 방지와 이용자 권익 보호를 위한 원칙·실천 방식 지침",
    lead:
      "이용자 권익의 보호 원칙, 생성형 AI 이용자 보호 가이드라인",
    features: ["사전 위험 방지", "이용자 권익 중심", "인간 존엄성 우선"],
    keywords: ["인간 존엄성 보호", "설명 가능성", "이용자 인격권 보호", "다양한 존중 노력"],
    tables: [
      {
        caption: "기본원칙 [인설안공비]",
        headers: ["원칙", "핵심내용", "설명"],
        rows: [
          ["인간 존엄성 보호", "인간 중심 운영", "인간 보조 수단으로 작동\n결정권·존엄 해치지 않게 설계"],
          ["설명 가능성과 투명성 확보", "이해 중심 정보", "결과 도출 이유 알기 쉽게 설명"],
          ["안전한 작동 보장", "피해 최소화\n악의적 이용 방지", "오작동 등 위험 사전 예방 안전장치"],
          ["공정성과 비차별", "차별적 결과 방지", "데이터·알고리즘 편향 감소\n모든 사용자 공정 서비스 설계"],
        ],
      },
      {
        caption: "실행 방안 — 이용자 권익 보호 [이결다입]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["이용자 인격권 보호", "개인정보·명예\n프라이버시 보호", "필터링·신고·차단 시스템 마련"],
          ["결정 과정의 설명 노력", "AI 작동 원리\n결정 과정 설명", "AI 생성 고지\n데이터 출처 등 정보 제공"],
          ["다양성 존중 노력", "편향 방지\n사회적 포용", "차별 방지\n다양한 관점 반영\n편향 신고 시스템"],
          ["입력데이터 수집·활용 관리", "사전 고지·동의", "이용자 선택권·프라이버시 보장"],
        ],
      },
      {
        caption: "실행 방안 — 콘텐츠 관리 및 책임 중심 [책건]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["문제 해결을 위한 책임과 참여", "책임 범위 정의", "신고·조치 절차"],
          ["건전한 유통·배포 노력", "유해물 차단", "청소년 보호"],
        ],
      },
      {
        caption: "생성형 AI 생태계 조성 방안",
        headers: ["구분", "방안", "설명"],
        rows: [
          ["핵심 요소", "투명성 확보\n설명 가능성", "정보 공개 원칙\n판단 근거 제시"],
          ["핵심 요소", "안전성·견고성", "위해 방지 대응"],
          ["핵심 요소", "공정성·형평성", "차별 방지 보장"],
          ["핵심 요소", "책임성 거버넌스", "책임 소재 확립"],
          ["핵심 요소", "개인정보 보호\n데이터 관리", "정보주체 권리\n수집·이용 관리"],
          ["핵심 요소", "EU AI Act\nAI 기본법", "해외 규제 연계\n국내 법제 연계"],
          ["핵심 요소", "ISO 표준", "42001 연계"],
          ["조성을 위한 방안", "연구 개발 투자", "지속 투자 확대"],
          ["조성을 위한 방안", "표준·평가 체계", "체계 구축 추진"],
          ["조성을 위한 방안", "규제·정책", "제도 기반 마련"],
          ["조성을 위한 방안", "교육·인식 개선", "이해도 향상"],
          ["조성을 위한 방안", "산학연 협력\n이용자 참여", "협업 생태 조성\n의견 수렴 반영"],
        ],
      },
    ],
    notes: ["적용범위: 생성형 인공지능 개발사 및 서비스 제공자, 이용자 / 생성형 인공지능 서비스 및 산출물", "출제 이력: 2025.05 ITPE FR 1일차 2교시, 2025.04 KPC 모의고사 3교시"],
  },
  {
    title: "생성형 AI 서비스 이용자 보호 가이드라인(2025.02.28)",
    course: "AI",
    definition:
      "생성형 인공지능 서비스 이용 과정에서 잠재적 위험들 사전 방지 및 이용자 권익 보호 위한 기본 원칙과 실천 방식 제시(방송통신위원회, 2025.02.28)",
    defShort: "생성형 AI 위험 방지·이용자 보호를 위해 방통위가 낸 원칙·실천 지침",
    lead:
      "방통위의 이용자 보호 기준, 생성형 AI 가이드라인",
    features: ["위험 사전 방지", "이용자 권익 중심", "원칙별 실행방안"],
    keywords: ["인간 존엄성 보호", "설명 가능성", "이용자 인격권 보호", "다양한 존중 노력"],
    tables: [
      {
        caption: "기본원칙 [인설안공비]",
        headers: ["원칙", "핵심내용", "설명"],
        rows: [
          ["인간 존엄성 보호", "인간 중심 운영", "AI 인간 보조 수단 작동\n결정권·존엄 해치지 않게 설계"],
          ["설명 가능성과 투명성 확보", "이해 중심 정보", "결과 도출 이유 쉽게 설명 구조"],
          ["안전한 작동 보장", "피해 최소화\n악의적 이용 방지", "오작동·잘못된 정보 생성\n프롬프트 남용 위험 사전 예방\n안전 장치 필요"],
          ["공정성과 비차별", "차별적 결과 방지", "데이터·알고리즘 편향 축소\n모든 사용자 공정 서비스 설계"],
        ],
      },
      {
        caption: "가이드라인 실행 방안 – 이용자 권익 보호 [이결다입]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["이용자 인격권 보호", "개인정보·명예\n프라이버시 보호", "AI 산출물 인격 침해 방지\n필터링·신고·차단 시스템 마련"],
          ["결정 과정의 설명 노력", "AI 작동 원리\n결정 과정 설명", "'AI가 생성한 것' 고지\n데이터 출처 등 이해 가능 정보 제공"],
          ["다양성 존중 노력", "알고리즘·데이터\n편향 방지\n사회적 포용", "차별 방지·다양한 관점 산출물\n편향 신고 시스템 구축"],
          ["입력데이터 수집·활용 관리", "데이터 활용\n사전 고지·동의", "입력값 학습 사용 시\n이용자 선택권·프라이버시 보호"],
        ],
      },
      {
        caption: "가이드라인 실행 방안 – 콘텐츠 관리 및 책임 중심 [책건]",
        headers: ["실행방안", "핵심내용", "설명"],
        rows: [
          ["문제 해결을 위한 책임과 참여", "오류·피해 발생\n책임 범위 정의\n대응 체계 구축", "이용자 책임 고지\n신고·조치 절차\n모니터링 체계 마련"],
          ["건전한 유통·배포 노력", "유해·불법콘텐츠\n생성·확산 방지", "허위정보·음란물 등 사전 차단\n청소년 보호 조치 포함"],
        ],
      },
    ],
    notes: ["'생성형 인공지능 서비스 이용자 보호 가이드라인'과 동일 문서(발표일 표기판) — 상세 표는 해당 서브노트 참조", "출제 이력: 138회 정보관리 3교시, 2025.05 ITPE FR 1일차 2교시, 2025.04 KPC 모의고사 3교시"],
  },
  {
    title: "인공지능 학습용 데이터 품질관리 가이드라인 v3.1",
    course: "AI",
    definition:
      "인공지능 학습용 데이터 품질을 확보하는 데 필요한 조직, 절차, 품질기준, 품질관리 방법이나 활동 정의하여 점검하고 조치하는 일련의 활동",
    defShort: "조직·절차·품질기준·품질관리 방법·활동 정의해 점검·조치 활동",
    lead:
      "학습 데이터 품질의 기준, 데이터 품질관리 가이드라인",
    features: ["사업 생애주기 전반", "공정별 품질관리", "품질지표 기반 점검"],
    keywords: ["100.준비·계획", "200.구축", "300.운영·활용 3단계 사업 단계", "단계", "프로세스", "산출물", "품질관리 활동"],
    tables: [
      {
        caption: "품질관리 지표 [준완유기기통구의알유]",
        headers: ["구분", "품질지표"],
        rows: [
          ["구축공정", "준비성\n완전성\n유용성"],
          ["데이터 적합성", "기준 적합성\n기술 적합성\n통계적 다양성"],
          ["데이터 정확성", "구문 정확성\n의미 정확성"],
          ["학습모델", "알고리즘 적정성\n유효성"],
        ],
      },
      {
        caption: "품질관리 프로세스 [구획정가학운]",
        headers: ["구분", "프로세스", "설명"],
        rows: [
          ["100. 준비·계획", "110. 구축계획 수립", "목적 일치성·일관성 확보 계획\n컨소시엄 간 업무 역할 정의\n품질지표·목표, 점검 기준 수립"],
          ["200. 구축", "210. 데이터 획득/수집", "기계학습 필요 데이터 획득/수집\n원시데이터 생성\n원시데이터 품질관리"],
          ["200. 구축", "220. 데이터 정제", "중복제거, 비식별화 등 정제 작업\n원천데이터 품질관리"],
          ["200. 구축", "230. 데이터 가공", "원천데이터에 라벨링데이터 부여\n인공지능 학습 형태 가공\n라벨링데이터 품질관리"],
          ["200. 구축", "240. 데이터 학습", "학습데이터셋 생성\n인공지능 모델 성능 보정"],
          ["300. 운영·활용", "310. 데이터 운영·활용", "AI Hub 개방 데이터 품질관리\n하자 및 유지보수 단계"],
        ],
      },
    ],
    notes: ["개념도: 사업수행기관 — 단계(100.준비·계획/200.구축/300.운영·활용) · 프로세스(단계별 구축 공정 프로세스) · 산출물(프로세스별 구축 및 품질 관련 산출물) · 품질관리 활동(공정별 품질관리, 품질 자가점검 및 품질검증) + NIA 품질 관련 활동"],
  },
  {
    title: "인공지능(AI) 도입 사업비 산정 절차",
    course: "AI",
    definition:
      "인공지능(AI) 서비스 도입 사업비는 서비스 가격표 또는 견적서에 제시된 서비스 총이용료와 투입공수 방식의 커스터마이징 작업비용, 구축·개발비용에 따라 대가를 산정하는 방식",
    defShort: "총이용료·커스터마이징 작업비용·구축·개발비용 대가 산정 방식",
    lead: "이용료·작업비 대가 산출, AI 도입 사업비 산정 절차",
    features: ["가격표 기반 산정", "투입공수 방식 병행", "유형별 비용 차등"],
    keywords: ["사전준비", "서비스 이용료 계산", "커스터마이징 작업비용 계산", "구축·개발 비용 계산", "AI 서비스 도입 사업비 산정"],
    tables: [
      {
        caption: "AI 서비스도입 사업유형 [단기데모시]",
        headers: ["구분", "항목별 활용 내용"],
        rows: [
          ["단순 AI 서비스 도입형", "개발 없이 구독료 지불하고 도입"],
          ["커스터마이징 — 기본 커스터마이징", "최소한의 커스터마이징 작업 요구\n요구사항 분석·설계, 샘플 데이터\n사전학습 모델 적용, 검증·안정화"],
          ["커스터마이징 — AI 데이터 구축 커스터마이징", "데이터 신규 구축 또는 재구축 유형\n요구사항 분석, 설계, 데이터 구축\n데이터 품질 검증 및 안정화"],
          ["커스터마이징 — AI 모델 커스터마이징", "기존 AI 모델 최적화\n새로운 AI 모델·알고리즘 개발\n요구사항 분석·설계, 데이터 구축\n파인튜닝, 검증 및 안정화"],
          ["시스템통합형", "커스터마이징+SW 개발·통합 병행"],
        ],
      },
      {
        caption: "상세절차 [사서커구사] [도입비 = 이커구]",
        headers: ["절차", "추가활동", "산출물"],
        rows: [
          ["1. 사전 준비", "도입 서비스 식별\n세부 항목·유형", "대상 서비스\n추가 활동 항목"],
          ["2. 서비스 이용료 계산", "사용기간 결정\n가격표·견적서\n이용료 산정", "서비스 이용료"],
          ["3. 커스터마이징 작업비용 계산", "비용 항목 식별\n가격표·견적서\n요구분석·설계\n데이터 구축", "커스터마이징작업비용"],
          ["4. 구축·개발 비용 계산", "SW 개발·SI 식별\n기능점수·공수", "구축·개발 비용"],
          ["5. AI 서비스 도입 사업비 산정", "서비스 이용료 +\n커스터마이징 +\n구축·개발 비용", "도입 사업비"],
        ],
      },
    ],
    notes: ["사업유형과 비용 요소 관계: 단순 도입형=서비스 이용료만 / 기본·데이터·모델 커스터마이징형=이용료+해당 커스터마이징 작업비용 / 시스템통합형=구축·개발비용 포함"],
  },
  {
    title: "AI 기본법",
    course: "AI",
    definition:
      "인공지능의 건전한 발전과 신뢰기반 조성에 필요한 기본적인 사항을 규정하는 것을 목적으로 제정된 법",
    defShort: "인공지능 건전한 발전과 신뢰기반 조성에 필요한 기본적인 사항 규정한 법",
    lead: "AI 발전·신뢰 법적 기반, AI 기본법",
    features: ["진흥·규제 병행", "고영향 AI 규제", "투명성 확보 의무"],
    keywords: ["국가인공지능위원회", "고영향 인공지능", "생성형 인공지능", "인공지능산업", "인공지능사업자"],
    tables: [
      {
        caption: "요약",
        headers: ["구분", "설명"],
        rows: [
          ["추진체계", "기본계획 3년 주기 수립·시행\n국가AI위원회 안전연구소 운영"],
          ["인공지능 산업 육성", "R&D·표준화 학습데이터 시책\n집적단지·인재 생태계 혁신 지원"],
          ["인공지능 안전·신뢰 기반 조성", "고영향 인공지능 규제 대상 정의\n생성형 인공지능 검인증 지원"],
        ],
      },
      {
        caption: "법령 — 정의(제2조)",
        headers: ["조항", "설명"],
        rows: [
          ["고영향 인공지능(2조 4호)", "생명 신체 안전 중대 영향 우려\n기본권 영향 위험 초래 AI"],
          ["생성형 인공지능(2조 5호)", "구조 특성 모방 입력 기반 학습\n글 소리 그림 영상 결과물 생성 AI"],
          ["인공지능산업(2조 6호)", "개발 제조 생산 제품 생산 활동\n유통 서비스 서비스 제공 산업"],
          ["인공지능사업자(2조 7호)", "인공지능산업 관련 사업 수행\n법인 개인 단체 국가기관 포함"],
        ],
      },
      {
        caption: "법령 — 주요 조항",
        headers: ["조항", "설명"],
        rows: [
          ["인공지능 기본계획의 수립(제6조)", "과기정통부 3년 정책·인력 방안"],
          ["국가인공지능위원회(제7조, 제8조)", "계획·인프라 고영향AI 심의"],
          ["인공지능안전연구소(제11조, 제12조)", "정책센터 지정 국제 규범 확산\n안전연구소 운영 AI 안전 확보"],
          ["인공지능기술개발 지원 및 표준화(제13조, 제14조)", "동향·실용화 연구개발 지원\n기술 표준화 과기부 사업 추진"],
          ["전문인력 확보(제21조)", "인공지능산업 전문인력 양성"],
          ["인공지능집적단지 지정(제23조)", "인공지능산업 경쟁력 강화\n연구개발 집적 기업·기관 집중"],
          ["인공지능윤리원칙(제27조)", "안전성·접근성 윤리원칙 포함\n삶·번영 공헌 제정·공표 가능"],
          ["인공지능 투명성 확보 의무(제31조)", "사전 고지·표시 생성 사실 표시\n가상 결과물 고지 실제 구분 곤란시"],
          ["인공지능 안정성 확보 의무(제32조)", "기준 이상 연산량 위험 식별·완화"],
          ["고영향 인공지능과 관련한 사업자의 책무(제34조)", "고영향 인공지능 안전·신뢰 조치"],
          ["인공지능 영향평가(제35조)", "인공지능사업자 사전 노력 의무\n고영향 인공지능 기본권 영향 평가"],
          ["국내대리인 지정(제36조)", "인공지능사업자 국내대리인 지정\n고영향 인공지능 확인 신청·신고"],
          ["사실조사 등(제40조)", "인공지능사업자 자료 요구·조사\n위반 확인시 중지·시정 명령"],
          ["과태료(제43조)", "고영향·생성형 고지 의무 위반\n국내대리인 미지정\n중지·시정명령 불이행\n3천만원 이하 과태료 부과"],
        ],
      },
    ],
  },
  {
    title: "인공지능 투명성 확보 가이드라인",
    course: "AI",
    definition:
      "이용자가 **AI를 사용**하고 있다는 사실과 **AI가 생성한 결과물**이라는 사실을 알 수 있도록 **고지·표시**하는 제도적 장치",
    defShort: "AI 사용 사실과 AI 생성 결과물임을 알도록 고지·표시 제도적 장치",
    lead: "AI 사용·생성 사실을 이용자에게 알리는 제도, 인공지능 투명성 확보 가이드라인",
    features: ["법 제31조 근거", "사전 고지 의무", "결과물 표시 의무"],
    keywords: ["인공지능기본법 제31조", "사전 고지 의무(1항)", "표시 의무(2항)", "딥페이크 고지 표시 의무(3항)", "서비스내 제공시", "외부 반출 시"],
    tables: [
      {
        caption: "인공지능기본법 제31조에 따른 인공지능 투명성 확보 의무 사항",
        headers: ["법 제31조", "적용 범위", "의무사항", "방법"],
        rows: [
          ["제1항", "고영향·생성형\nAI 제품·서비스", "고영향·생성형\nAI 기반 운용 사실", "사전 고지"],
          ["제2항", "생성형 AI 제품\n서비스 제공시", "결과물이 AI로\n생성됐다는 사실", "표시"],
          ["제3항", "실제와 구분 곤란\n가상 결과물 제공", "결과물이 AI로\n생성됐다는 사실", "고지 또는 표시"],
        ],
      },
      {
        caption: "투명성 의무 적용 대상",
        headers: ["적용 대상", "설명"],
        rows: [
          ["① AI 개발사업자", "AI 개발·개량\n제품 서비스 제공"],
          ["② AI 이용사업자", "타사 AI 활용해\n제품 서비스 제공"],
          ["③ 해외 사업자", "제품·서비스가\n국민에게 영향"],
        ],
      },
      {
        caption: "투명성 의무 사전 고지 방법",
        headers: ["구분", "설명"],
        rows: [
          ["이용약관·계약서", "가입 절차·약관\n계약서 등에 명시\nAI 활용 사실 명시"],
          ["화면·단말기 표시", "앱·SW 화면에\nAI 서비스임 표시"],
          ["제공 장소 게시", "오프라인 서비스\n이용 전 확인 가능\n장소에 게시"],
        ],
      },
      {
        caption: "투명성 확보를 위한 생성형 AI 결과물 표시 방법",
        headers: ["구분", "서비스 내 제공 시 표시", "외부 반출 시 표시"],
        rows: [
          ["적용 대상", "서비스 화면·UI\n안에서만 제공", "다운로드·공유\n저장 등 밖 반출"],
          ["표시 위치", "결과물 또는\n서비스 화면", "반출되는\n결과물 자체"],
          ["표시 시점", "최종 결과물 제공", "다운로드·저장\n공유 단계"],
          ["일반 생성물", "문구·로고·툴팁\n화면 안내 활용", "가시적 로고\n워터마크\n메타데이터\n디지털 워터마크"],
          ["기계 판독 방식", "적용 시 1회 이상\n문구·음성 안내", "비가시적 표시 시\n반출 시 1회 안내"],
          ["중간 생성물", "입력·편집 과정\n매번 표시 불필요", "최종 결과물만"],
          ["딥페이크", "일반 생성물과\n같은 방식 적용", "명확히 인식되는\n가시·가청 방식"],
          ["핵심 유의점", "UI에 표시해도\n반출 시 별도 표시", "결과물만 보아도\nAI 생성 사실 인지"],
        ],
      },
    ],
    notes: [
      "제31조 원문: 제1항 — 고영향 AI 및 생성형 AI를 이용한 제품·서비스 제공시, 제품·서비스의 고영향 또는 생성형 AI 기반 운용 사실을 사전 고지 / 제2항 — 생성형 AI 및 이를 이용한 제품·서비스 제공시, 결과물이 AI로 생성되었다는 사실을 표시 / 제3항 — AI시스템으로 실제와 구분하기 어려운 가상의 생성 결과물 제공시, 결과물이 AI로 생성되었다는 사실을 고지 또는 표시. 적용 대상 — ① AI 개발사업자(AI를 개발·개량하여 제품·서비스에 제공하는 자) ② AI 이용사업자(타사 AI를 활용해 AI 제품·서비스를 제공하는 자) ③ 해외 사업자(AI 제품·서비스가 대한민국 국민에게 영향을 미치는 경우). 사전 고지 방법 — 이용약관·계약서(가입 절차, 약관, 계약서 등에 AI 활용 사실 명시), 화면·단말기 표시(앱이나 소프트웨어 화면에 AI 기반 서비스임을 표시), 제공 장소 게시(오프라인 서비스 이용 전 확인 가능한 장소에 게시).",
      "표시 방법 원문: 적용 대상(결과물이 서비스 화면·UI 안에서만 제공되는 경우 / 다운로드·공유·저장 등 서비스 밖으로 내보내는 경우), 표시 위치(결과물 또는 서비스 화면에 표시 / 외부로 반출되는 결과물 자체에 표시), 표시 시점(최종 결과물 제공 단계 / 다운로드·저장·공유 단계), 일반 생성물(문구, 로고, 툴팁, 화면 안내 등 활용 / 가시적 로고·워터마크 또는 메타데이터·디지털 워터마크 적용), 기계 판독 방식(적용 시 1회 이상 문구·음성 안내 / 비가시적 표시 사용 시 다운로드 과정에서 1회 이상 안내 달), 중간 생성물(프롬프트 입력·편집 과정마다 표시할 필요 없음 / 최종 결과물에만 표시), 딥페이크(서비스 내에서는 일반 생성물과 같은 방식 적용 가능 / 사람이 명확히 인식할 수 있는 가시적·가청 방식 적용), 핵심 유의점(UI에 표시했더라도 외부 반출 시 별도 표시 필요 / 결과물만 보아도 AI 생성 사실을 알 수 있어야 함).",
    ],
  },
  {
    title: "고영향 인공지능(AI) 판단 가이드라인",
    course: "AI",
    definition:
      "**사람의 생명, 신체의 안전 및 기본권에 중대한 영향을 미치거나** 위험을 초래할 우려가 있어, **AI기본법에서 지정한 특정 영역에서 활용**되는 인공지능시스템",
    defShort: "생명·기본권에 중대 영향, AI기본법 지정 영역 활용 인공지능시스템",
    lead: "국민 생명·안전·기본권에 중대한 영향, 고영향 인공지능 판단 가이드라인",
    features: ["기본권 중대 영향", "AI기본법 지정 영역", "영향평가 의무"],
    keywords: ["AI 기본법", "위험관리", "영향 분석", "이행계획", "책임성", "설명가능성"],
    tables: [
      {
        caption: "고영향 인공지능 판단 절차",
        headers: ["구분", "확인 절차"],
        rows: [
          ["① 자가진단", "사업자의 1차 사전 검토 의무"],
          ["② 장관확인 요청", "과기정통부 장관에서 확인 요청\n고영향AI확인 요청서"],
          ["③ 전문위원회 자문", "전문위원회 설치 및 자문"],
          ["④ 장관의 판단", "고영향 인공지능 해당 여부 판단"],
          ["⑤ 고영향 여부 통지", "해당 여부 결정, 사업자에게 통지"],
          ["⑥ 후속 의무 이행", "시행령 제27조 사업자 책무 이행"],
        ],
      },
      {
        caption: "영향평가 법적 근거",
        headers: ["구분", "법적 근거", "주요 내용"],
        rows: [
          ["규정", "AI기본법 제35조\n시행령 제28조", "고영향 AI 대상\n영향평가 규정\n실시 제품 우선"],
          ["목적", "시행령 제28조\n제1항 이하", "생명·신체·기본권\n영향 사전 분석\n예방·완화·복구\n신뢰성·책임성"],
        ],
      },
      {
        caption: "영향평가 항목",
        headers: ["구분", "평가 항목"],
        rows: [
          ["식별 대상", "개인·집단 식별\n기본권 유형 식별\n사회·경제 영향\nAI 사용 행태"],
          ["평가 방식", "정량·정성 지표\n결과 산출 방식\n예방·완화·복구\n개선 이행계획"],
        ],
      },
      {
        caption: "사업자 책무",
        headers: ["구분", "사업자책무"],
        rows: [
          ["기술", "위험관리 방안\n설명가능성\n이용자 보호\n사람의 감독"],
          ["관리", "문서화·보관\n투명성 정보공개\n평가·조치 연계"],
        ],
      },
    ],
    notes: [
      "판단 절차 흐름: 자가진단 → 장관확인 → 전문위원회 자문 → 장관의 판단 → 고영향여부 통지 → 후속 의무 이행. 원문 — ① 자가진단(사업자의 1차 사전 검토 의무) ② 장관확인 요청(과학기술정보통신부 장관에서 확인 요청, 고영향AI확인 요청서) ③ 전문위원회 자문(전문위원회 설치 및 자문) ④ 장관의 판단(고영향 인공지능 해당 여부 판단) ⑤ 고영향 여부 통지(해당 여부 결정, 사업자에게 통지) ⑥ 후속 의무 이행(시행령 제27조 사업자 책무 이행).",
      "법적 근거 원문: 규정 — AI기본법 제35조, 시행령 제28조: 고영향 인공지능에 대하여 영향평가를 실시하도록 하는 규정, 영향평가 실시 제품 또는 서비스 우선 고려 / 목적 — 시행령 제28조제1항 이하: 고영향 인공지능이 사람의 생명·신체 안전·기본권에 미칠 영향을 사전에 체계적으로 분석하고, 그 결과를 바탕으로 위험 예방·완화·복구 조치와 개선계획을 마련함으로써, 신뢰성과 책임성을 확보하는 것. 영향평가 항목 — 식별 대상(개인이나 집단 식별, 기본권 유형의 식별, 사회적·경제적 영향의 내용 및 범위, 고영향 인공지능의 사용 행태), 평가 방식(정량·정성적 평가지표 및 결과 산출 방식, 위험 예방·완화·복구 방안, 개선 이행계획). 사업자 책무 — 기술(위험관리 방안 수립·운영, 설명가능성(Explainability), 이용자 보호·사람의 감독), 관리(문서화·보관 의무, 정보공개(투명성), 평가-조치 연계).",
    ],
  },
  {
    title: "인공지능 영향평가 가이드라인",
    course: "AI",
    definition:
      "고영향 인공지능이 **사람의 기본권과 사회에 미치는 영향**을 사전에 식별·평가하고 위험을 완화하기 위한 체계적인 평가 절차",
    defShort: "고영향 인공지능이 사람의 기본권과 사회에 미치는 영향 식별·평가 절차",
    lead: "고영향 AI의 기본권·사회 영향을 사전에 평가, 인공지능 영향평가 가이드라인",
    features: ["고영향 AI 대상", "기본권 영향 식별", "사전 위험 완화"],
    keywords: ["사전준비", "본평가 수행", "사후관리"],
    tables: [
      {
        caption: "등장배경",
        headers: ["구분", "내용"],
        rows: [
          ["AI 활용 확대", "AI 의사결정 증가"],
          ["AI 기본법 시행", "영향평가 제도화"],
          ["글로벌 규제 대응", "EU AI Act 등\n국제 규제 대응"],
        ],
      },
      {
        caption: "인공지능 영향평가 수행 절차",
        headers: ["단계", "상세 절차", "중요 기법", "산출물"],
        rows: [
          ["사전 준비", "평가 필요성 검토\n평가대상 정의\n평가계획 수립", "판별 체크리스트\n이해관계자 분석\nWBS·일정·역할", "고영향 AI 확인서\n평가대상 정의서\n영향평가 계획서"],
          ["본 평가 수행", "피영향자 분석\n작동원리 분석\n기본권 영향 식별\n위험 시나리오", "Stakeholder Mapping\n데이터 흐름 분석\n기본권 매핑\nSTPA·FMEA", "피영향자 분석서\n작동원리 분석서\n기본권 분석서\n영향평가서"],
          ["사후 관리", "완화 계획 수립\n개선조치 수행\n모니터링 재평가", "위험 완화 전략\nCAPA 시정·예방\nKPI 모니터링", "위험 완화 계획서\n개선조치 보고서\n모니터링 보고서\n재평가 보고서"],
        ],
      },
      {
        caption: "인공지능 영향평가와 PIA 비교",
        headers: ["구분", "AI 영향평가", "개인정보 영향평가(PIA)"],
        rows: [
          ["목적", "기본권 영향 평가", "개인정보 보호"],
          ["대상", "고영향 AI", "개인정보 처리"],
          ["중점", "사회·윤리\n기본권", "개인정보"],
          ["결과", "영향 완화", "개인정보 보호"],
        ],
      },
    ],
    notes: [
      "절차도: ❶ 사전 준비 단계 — ① 평가 필요성 검토(고영향 AI 여부 확인) ② 평가대상 정의(제품·서비스 기능, 목적, 적용 범위 / 사용 절차, 이용자, 데이터 등 정의) ③ 평가계획 수립(평가 범위, 방법, 일정, 역할 정의); 중요 기법: 고영향 AI 판단 기준(체크리스트), 이해관계자 식별, 평가 범위 설정 기법 → ❷ 본 평가 수행 단계 — ① 피영향자 분석(직접·간접·의도치 않은 피영향자 식별) ② 작동원리 분석(데이터 수집 → 모델 학습 → 추론 → 의사결정 → 피드백 전 과정 분석) ③ 기본권 영향 식별(관련 기본권(개인정보, 평등권, 생명권 등) 식별) ④ 위험 시나리오 및 영향 평가(시나리오 기반 위험 분석, 위험 발생 가능성 및 영향 수준 평가); 중요 기법: 이해관계자(피영향자) 분석 기법, 시스템/데이터 흐름 분석 기법, 시나리오 기반 위험 분석(STPA, FMEA 등), 기본권 영향 평가 매트릭스(가능성 × 영향도) → ❸ 사후 관리 단계 — ① 위험 완화 계획 수립(식별된 위험에 대한 개선·완화 대책 수립) ② 개선 조치 실행 및 반영(시스템·정책·프로세스 개선 적용) ③ 모니터링 및 재평가(운영 중 영향 모니터링, 중대한 변경 시 재평가 수행); 중요 기법: 위험 완화 전략 수립 기법, 모니터링 지표 설정 기법, 피드백 반영 및 재평가 기법. 핵심 흐름: 평가대상 정의 → 영향 식별 및 분석 → 위험 평가 → 완화 및 개선 → 지속적 관리. 고영향 AI의 작동원리와 기본권 영향을 분석하여 위험을 완화하고 신뢰성을 확보하는 체계.",
      "수행 절차 원문: 사전 준비 — 평가 필요성 검토(고영향 AI 판별, 체크리스트 → 고영향 AI 확인서), 평가대상 정의(이해관계자 분석, 범위 정의 → 평가대상 정의서), 평가계획 수립(WBS, 일정·역할 정의 → 영향평가 계획서) / 본 평가 수행 — 피영향자 분석(Stakeholder Mapping → 피영향자 분석서), 작동원리 분석(데이터 흐름 분석, Process Mapping, Model Card → 작동원리 분석서), 기본권 영향 식별(기본권 매핑, 체크리스트 → 기본권 영향 분석서), 위험 시나리오 및 영향평가(시나리오 분석, STPA, FMEA, 위험도 매트릭스 → 영향평가서, 위험 시나리오) / 사후 관리 — 위험 완화 계획 수립(위험 완화 전략(Mitigation) → 위험 완화 계획서), 개선조치 수행(CAPA(시정·예방조치), 피드백 반영 → 개선조치 보고서), 모니터링 및 재평가(KPI 모니터링, 재평가 → 모니터링 보고서, 재평가 보고서).",
    ],
  },
  {
    title: "인공지능 생성물 워터마크 적용 기술",
    course: "AI",
    definition:
      "인공지능을 포함한 알고리즘에 의해 크게 변경되거나 생성된 이미지, 동영상, 오디오, 텍스트 등의 정보",
    defShort: "AI 생성 이미지·영상·텍스트에 인지 불가 워터마크를 넣고 빼는 기술",
    lead:
      "AI 생성물의 식별 표지, 워터마크 적용 기술",
    features: ["인지 불가능 삽입", "AI 생성물 식별", "미디어별 기법 상이"],
    keywords: ["공간 기반", "변환 기반", "학습 기반", "이미지", "동영상", "텍스트 적용 기술"],
    tables: [
      {
        caption: "인지 불가능 워터마크 분류별 기술",
        headers: ["구분", "활용 범위", "설명"],
        rows: [
          ["공간 기반", "이미지, 동영상", "최하위 비트 삽입"],
          ["변환 기반", "이미지, 동영상\n오디오", "주파수 도메인\n변환 후 삽입"],
          ["학습 기반", "이미지, 동영상", "생성모델 학습"],
          ["학습 기반", "텍스트", "문장 생성 중 삽입"],
        ],
      },
      {
        caption: "이미지 및 동영상 워터마크 적용 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["공간 기반", "LSB(Least Significant Bit)", "픽셀 시각 영향 최소 하위 비트 삽입"],
          ["변환 기반", "DCT(Discrete Cosine Transform)", "블록 단위 주파수 변환 계수 삽입"],
          ["변환 기반", "DWT(Discrete Wavelet transform)", "다중 해상도 대역 변환\nLL 제외 중/고주파 서브밴드 삽입"],
          ["변환 기반", "Edge Masking", "엣지 정보 추출, 엣지 영역 삽입"],
          ["학습 기반", "Stable Signature", "인코더·디코더 사전 훈련\n디코더 미세 조정 생성 과정 삽입"],
        ],
      },
      {
        caption: "오디오 및 텍스트 워터마크 적용 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["변환 기반", "Audio Seal", "샘플 단위(1/16k 초 해상도) 삽입"],
          ["변환 기반", "Time Aligned", "특정 시간·시간 패턴 따라 삽입"],
          ["변환 기반", "Echo Based", "오디오에 에코 추가해 삽입"],
          ["변환 기반", "WavMark", "1초 샘플에 고정패턴 포함\n최대 32비트 워터마크 삽입"],
          ["변환 기반", "Spread Spectrum", "오디오 신호 전체 분산 삽입"],
          ["변환 기반", "QIM", "과도 검출 통해 주파수 변환 삽입"],
          ["변환 기반", "Patch Work", "진폭·위상·노이즈·주파수 조작\n미세한 차이 만들어 삽입"],
          ["변환 기반", "PerTH", "인식 불가 영역에 주파수 인코딩"],
          ["학습 기반", "학습 기반 워터마크", "언어 모델 훈련 단계 삽입"],
          ["학습 기반", "로짓 생성 워터마크", "다음 단어 확률 분포 조정 삽입"],
          ["학습 기반", "토큰 샘플링 워터마크", "조정 분포로 선택 토큰에 삽입"],
        ],
      },
    ],
    notes: ["인공지능 생성물 차원: Content(Purpose·Intent·Contextual Believability), Format(Media Type·Realism)", "출제 이력: 2025.05 ITPE FR 1일차 2교시"],
  },
  {
    title: "생성형AI 데이터 품질관리 가이드 v2.0",
    course: "AI",
    definition:
      "생성형AI 데이터 관점의 품질관리 역량 확보를 위한 품질관리 방법 및 절차의 체계적으로 제시하는 품질관리 가이드라인",
    defShort: "생성형AI 데이터 관점의 품질관리 역량 확보 방법·절차 가이드라인",
    lead: "생성형AI 데이터 품질기준, 생성형AI 데이터 품질관리 가이드",
    features: ["생성형AI 특화", "생애주기 단계별", "지표 기반 검사"],
    keywords: ["구축계획 수립", "데이터 획득/수집", "데이터 정제", "데이터 가공", "데이터 학습", "데이터 운영·활용"],
    tables: [
      {
        caption: "품질지표",
        headers: ["구분", "품질지표"],
        rows: [
          ["1. 구축 공정 적정성", "준비성, 완전성, 유용성"],
          ["2. 데이터 적합성", "기준 적합성, 다양성, 유사성\n편향성, 유용성, 안전성"],
          ["3. 가공 데이터 정확성", "구문 정확성\n의미 정확성(정답성)"],
          ["4. 학습모델 적정성", "알고리즘 적정성, 유효성"],
        ],
      },
      {
        caption: "품질관리 활동",
        headers: ["단계", "프로세스", "품질 관리 활동"],
        rows: [
          ["100. 준비·계획", "100.구축계획수립", "사업수행 계획\n구축 절차·조직\n임무 정의 검토\n품질목표·기준"],
          ["200. 구축", "210.데이터획득수집", "수집 기준 현행화\n법적 근거 검토\n도구·저장환경\n원시데이터 검사"],
          ["200. 구축", "220.데이터정제", "정제 기준 현행화\n비식별 법적 준거\n도구·저장환경\n원천데이터 검사"],
          ["200. 구축", "230.데이터가공", "가공 기준 현행화\n도구·저장환경\n가공데이터 검사"],
          ["200. 구축", "240.데이터학습", "AI모델 합치성\n학습결과 최적화\n검증결과 보완"],
          ["300. 운영·활용", "310.데이터운영활용", "개방 전 점검\n하자·유지보수\n품질개선 반영"],
        ],
      },
    ],
    notes: ["데이터 구축 과정: 구축계획 수립(구축계획서) → 데이터 획득/수집(원시데이터) → 데이터 정제(원천데이터) → 데이터 가공(가공데이터: Caption·Summary·Q&A·Dialogue·Translation·Radiology Report 등 Instruction Data) → 데이터 학습(학습 데이터셋) → 반복(Iteration)", "출제 이력: 2025.10 KPC 모의고사 4교시, 2025.08 ITPE FR 3일차 2교시, 2025.10 ITPE 모의고사 4교시"],
  },
  {
    title: "COT(Chain of Thought)",
    course: "AI",
    definition:
      "언어 모델이 복잡한 문제를 해결할 때, 단계별로 논리적 추론을 수행하도록 유도하는 방법론",
    defShort: "복잡한 문제 해결 시 단계별로 논리적 추론을 수행하도록 유도하는 방법론",
    lead: "단계별 논리 추론의 유도, COT",
    features: ["단계적 추론", "문제 해결력 향상", "설명 가능한 AI"],
    keywords: ["단계적 논리적 추론", "사고 과정 단계"],
    tables: [
      {
        caption: "특징 및 구성요소 [문사최]",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["특징", "단계적 추론", "중간 과정 생성"],
          ["특징", "문제 해결력 향상", "복잡 문제 성능"],
          ["특징", "설명 가능한 AI", "사고 과정 공개"],
          ["특징", "Prompt Engineering 활용", "추론 방식 유도"],
          ["구성요소", "문제 입력(Input Problem)", "적용 대상 문제"],
          ["구성요소", "사고 과정 단계(Step-by-Step Thought Process)", "이전 정보 연계"],
          ["구성요소", "최종 출력(Final Output)", "단계 종합 결과"],
        ],
      },
    ],
    notes: ["개념도: IO(Input-Output) Prompting은 Input→Output 직행 / CoT는 Input→thought→thought→thought→Output", "COT 프롬프트[프롬프트 엔지니어링]: '문제-풀이-답'과 같이 중간 과정을 단계별로 풀이했을 때, 성능 향상이 가능한 기법", "출제 이력: 2025.04 ITPE 모의고사 1교시"],
  },
  {
    title: "BrainBody LLM",
    course: "AI",
    definition:
      "두 개의 대형 언어 모델(LLM)을 계층적으로 사용하여 모델간 상호작용을 통해 오류를 지속적으로 개선하도록 설계된 에이전트 시스템",
    defShort: "두 LLM을 계층적으로 사용해 오류를 지속 개선하는 에이전트 시스템",
    lead:
      "계층적 LLM 협업 구조, BrainBody LLM",
    features: ["계층적 구조", "계획·실행 분리", "폐루프 피드백"],
    keywords: ["계층", "계획", "실행", "피드백 루프"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["계획", "Brain LLM", "고수준 계획 의미 추론 조정"],
          ["실행", "Body LLM", "하위 제어 실행 저수준 수행"],
          ["보정", "Closed-Loop Feedback", "오류 피드백 계획 재수정"],
        ],
      },
    ],
    notes: ["개념도: \"Eat chips on the sofa\" → Brain-LLM(Real World Knowledge) → High-level Plan(주방으로 걷기~칩 먹기) → Body-LLM → Low-level Plan(<char0>[walk]<kitchen>…) → Simulator/Controller → Feedback & Error Messages → Brain-LLM(반복)", "TPU 데이터 처리 흐름 예: WASH THE PLATE — Initial Plan 오류 → STATE FEEDBACK → Updated Plan(With Feedback) → SUCCESS"],
  },
  {
    title: "확률분포",
    course: "ST",
    definition: "확률변수가 특정한 값을 가질 확률을 나타내는 분포",
    defShort: "이산확률변수·연속확률변수가 특정한 값을 가질 확률을 나타내는 분포",
    lead:
      "확률의 흩어짐 표현, 확률분포",
    features: ["확률변수 값별 확률", "이산·연속 구분", "모집단 추정 근거"],
    keywords: ["이산확률분포", "연속확률분포", "기대치", "분산"],
    tables: [
      {
        caption: "확률분포 유형 [이연 베이포 정표T카F]",
        headers: ["유형", "설명"],
        rows: [
          ["이산확률변수", "X가 취할 수 있는 값이 유한개\n자연수처럼 셀 수 있는 변수"],
          ["연속확률변수", "X가 어떤 구간 모든 실수값 취할 때"],
        ],
      },
      {
        caption: "상세절차 — 이산확률분포",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["시행 결과", "베르누이 분포", "성공 또는 실패 두 결과 중 하나\n성공·실패 확률 합 1, 각 시행 독립\nn번 독립 반복 시 이항분포"],
          ["시행 결과", "이항 분포", "확률 p로 n번 시행 중 k번 성공 확률\n시행횟수 많으면 정규분포 유사"],
          ["발생 횟수", "포아송 분포", "단위 시간·영역 사건 발생 횟수\n기댓값·분산 λ 동일\n독립성·비례성·비집락성"],
        ],
      },
      {
        caption: "상세절차 — 연속확률분포",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["정규 계열", "정규 분포", "평균 중심 대칭 종모양\n확률밀도함수 연속확률분포"],
          ["정규 계열", "표준정규분포(Z-분포)", "평균 0·분산 1 표준화 표본분포\n따르는 확률변수는 Z로 표현"],
          ["평균 검정", "T-분포", "모집단 표준편차 모를 때 평균 추측\nn 클 때 중심극한정리로 정규분포"],
          ["분산 검정", "카이제곱 분포(χ²-분포)", "표본 통계량이 표본분산인 분포\n독립 표준정규 변수 제곱합 분포"],
          ["분산 검정", "F-분포", "자유도로 나눈 두 χ² 값의 비율 분포"],
        ],
      },
    ],
    notes: ["계보: 확률분포 → 이산확률분포(베르누이-상호 배타적인 두 사건 / 이항-무한모집단, 복원 / 포아송-단위시간, 단위면적) / 연속확률분포(정규-평균과 표준편차로 모집단 평균 추측 / 표준정규-평균 0, 표준편차 1 / T-모집단 표준편차를 모를 때 / 카이제곱-모집단 1개 / F-모집단 2개)"],
  },
  {
    title: "확률분포와 확률 밀도 함수",
    course: "ST",
    definition:
      "확률분포: 여러 번의 독립적 시행에서 각각의 값이 특정 횟수가 나타날 확률을 정의하는 분포 / 확률밀도함수: 연속확률변수의 확률분포를 수학적으로 표현하는 함수",
    defShort: "독립적 시행 값이 나타날 확률 분포와 확률분포를 수학적으로 표현한 함수",
    lead:
      "연속 확률의 수학적 표현, 확률분포와 확률 밀도 함수",
    features: ["이산·연속 구분", "함수로 수학적 표현", "독립 시행 기반"],
    keywords: ["이산확률분포", "연속확률분포", "정규분포", "지수분포", "확률질량함수"],
    tables: [
      {
        caption: "확률분포 개념도",
        headers: ["구분", "설명"],
        rows: [
          ["이산확률분포", "셀 수 있는 값을 가질 때\n확률질량함수(PMF) 활용\n베르누이·이항·포아송 분포"],
          ["연속확률분포", "연속적인 값을 가질 때\n확률밀도함수(PDF) 활용\n정규·T·카이제곱·F·지수 분포"],
        ],
      },
      {
        caption: "확률밀도함수 개념도",
        headers: ["구분", "설명"],
        rows: [
          ["정규분포", "평균 주변 대칭\n일반적 데이터 모델링"],
          ["지수분포", "사건이 발생하는 시간 간격 모델링"],
        ],
      },
      {
        caption: "확률분포와 확률밀도함수 관계",
        headers: ["단계", "설명"],
        rows: [
          ["확률변수 → 확률분포", "확률변수 특정 값 확률 함수"],
          ["확률분포 → 확률밀도함수", "연속확률분포 표현"],
        ],
      },
    ],
    notes: ["예시: 주사위 2개의 합(2~12)에 대한 확률(1/36, 4/36 …)을 점으로 찍으면 확률분포, P(x)=f(x)로 연속화하면 확률밀도함수"],
  },
  {
    title: "정규분포(Normal Distribution)",
    course: "ST",
    definition:
      "평균을 중심으로 종모양의 좌우 대칭인 분포로 평균과 분산(또는 표준편차)에 따라 분포의 위치와 모양이 결정되는 확률분포",
    defShort: "종모양의 좌우 대칭인 분포로 평균·분산이 위치·모양 정하는 확률분포",
    lead: "평균 중심 좌우대칭 종모양, 정규분포",
    features: ["좌우대칭 종모양", "μ·σ 의존 형태", "68-95-99.7 규칙"],
    keywords: ["확률변수", "종모양", "표준편차", "평균", "분산", "표준정규 분포", "Z값"],
    tables: [
      {
        caption: "모양 특징",
        headers: ["특징 구분", "상세 특징 설명"],
        rows: [
          ["분포 모양", "평균 중심 좌우 대칭인 종모양 형태\n평균·표준편차가 모양·위치 결정\n평균(μ)에서 곡선 높이 가장 큼"],
          ["분포 폭", "표준편차(σ)에 의해 결정\n곡선의 모양 변화\n클수록 평평, 작을수록 높아짐"],
          ["분포 위치", "평균(μ)에 의해 결정\n곡선의 대칭축 이동"],
          ["곡선", "멀어질수록 x축에 무한히 접근\nx축에 닿지 않음"],
        ],
      },
      {
        caption: "확률적 특징",
        headers: ["특징 구분", "상세 특징 설명"],
        rows: [
          ["표기", "X ~ N(μ, σ²)\nX: 확률변수, μ: 평균\nσ: 표준편차, σ²: 분산"],
          ["넓이", "정규곡선~X축 사이 전체 면적 1"],
          ["평균", "평균 값이 최대값\n평균=중앙값=최빈값 모두 동일"],
          ["확률밀도함수", "f(x) = e^(-(x-μ)²/2σ²) / σ√2π\n단, −∞<x<∞, e=2.71828…"],
          ["확률변수", "확률변수 x 값 구간 −∞ < x < ∞"],
          ["확률값", "68 − 95 − 99.7 규칙\n±1σ 68.3%, ±2σ 95.5%, ±3σ 99.7%\n경험규칙(The Empirical Rule)\n관측 데이터 대부분 99.7% ±3σ 내"],
        ],
      },
    ],
    notes: ["표준편차 ±1배 범위내에 약 68% 데이터, ±2배 약 95%, ±3배 약 99% 데이터가 들어감"],
  },
  {
    title: "중심극한정리",
    course: "ST",
    definition:
      "모집단으로부터 추출된 표본의 크기 n이 충분히 크다면(30 이상) 표본 평균들이 이루는 분포는 모집단의 분포와 상관없이 정규분포를 따른다는 원리",
    defShort: "표본 평균들이 이루는 분포는 모집단 분포 상관없이 정규분포 따르는 원리",
    lead:
      "표본평균의 정규 수렴, 중심극한정리",
    features: ["정규분포 근사화", "모집단 분포 독립적", "표본추출 유연성"],
    keywords: ["평균", "정규분포"],
    tables: [
      {
        caption: "특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["통계적 추론 관점", "정규분포 근사화", "추론 간편화"],
          ["통계적 추론 관점", "추론의 강화", "적은 표본 활용"],
          ["표본과 모집단 관점", "표본 크기 영향", "클수록 적용 용이"],
          ["표본과 모집단 관점", "모집단 분포 독립적", "표본평균 근사값"],
          ["표본 추출 및 설계 관점", "표본추출 유연성", "추출방법에 독립"],
          ["표본 추출 및 설계 관점", "실험의 재현성", "반복 시 경향 표현"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "설명"],
        rows: [
          ["표본 평균", "ΣXᵢ/n n개 표본 평균값"],
          ["표준오차", "모표준편차 σ 모집단 표준편차\nσ/√n 표본평균 분포 σ"],
        ],
      },
    ],
    notes: ["개념도: 균등분포·비균등분포·정규분포 어떤 모집단이든, 각각의 군을 n번 측정하여 G개 군의 평균의 평균을 구하면 정규분포로 수렴", "\"모집단 분포에 상관없이\" 큰 표본들의 \"표본평균의 분포\"가 정규분포로 수렴한다는 점을 이용하여, Z값을 구해 확률값을 구할 수 있게 된다. 즉, 수학적 확률 판단(추정)을 할 수 있다", "n이 커질수록 수렴: Bin(10,0.9)·Pois(2)·Expo(1)·Beta(0.8,0.8) 모두 n=1→5→30→100으로 갈수록 정규분포 모양"],
  },
  {
    title: "데이터 유형",
    course: "ST",
    definition: "자료의 형태와 측정 척도에 따라 데이터를 분류하는 체계",
    defShort: "자료 형태와 측정 척도에 따라 명목·순서·등간·비율로 나누는 체계",
    lead:
      "측정 척도의 분류 체계, 데이터 유형",
    features: ["측정 척도 기준 분류", "질적·양적 구분", "시간 축 구분"],
    keywords: ["범주", "수치", "명목", "순서", "등간", "비율"],
    tables: [
      {
        caption: "형태에 따른 자료 유형 [명순등비]",
        headers: ["유형", "세분류", "설명"],
        rows: [
          ["범주형 자료(Categorical Data) = 질적 자료", "명목 자료(Nominal)\n명목 척도", "특성 분류·확인\n단순 범주 표시\n예) 성별, 혈액형, 직업구분, 학력"],
          ["범주형 자료(Categorical Data) = 질적 자료", "순서 자료(Ordinal)\n서열 척도", "특성 몇 개 범주로 구분\n범주 사이 순서 관계 성립\n예) 우선순위, 등수, 학점, 선호도"],
          ["수치형 자료(Numeric Data) = 양적 자료", "등간 자료(Interval)\n이산형 자료", "양적 차이, 균일 간격 분할 측정\n셀 수 있는 형태\n예) 설문문항, 온도, IQ 지수"],
          ["수치형 자료(Numeric Data) = 양적 자료", "비율 자료(Ratio)\n연속형 자료", "절대영점 존재, 비율계산 가능\n연속적 속성 자료\n예) 시험점수, 키, 몸무게"],
        ],
      },
      {
        caption: "시간에 따른 자료 유형",
        headers: ["유형", "설명"],
        rows: [
          ["횡단형(Cross-sectional Data)", "한 시점 수집 1회 시간 데이터"],
          ["종단형(Longitudinal Data)", "동일 대상 반복 여러 시간 데이터\n시계열 자료 시간 흐름 자료"],
        ],
      },
    ],
    notes: ["예시: 명목(자동차 종류 X=1,2,3 / 성별 X=M,F), 순서(연령대 X=10대·20대 / 등급 X=A,B,C), 등간(만족도 X=1~5 / 온도 X=36.5, 23.5), 비율(몸무게 X=69.2 / 평점 X=3.45, 3.78)"],
  },
  {
    title: "표본 추출(Sampling)",
    course: "ST",
    definition:
      "확률 추출: 모집단의 모든 요소가 동일한 확률로 표본으로 선택될 기회를 가지는 방법 / 비확률 추출: 모집단의 요소들이 동일한 확률로 선택되지 않는 방법",
    defShort: "모든 요소가 동일한 확률로 선택되는 확률 추출, 그렇지 않은 비확률 추출",
    lead:
      "모집단 대표의 선별, 표본 추출",
    features: ["모집단 대표성 확보", "동일 확률 여부 구분", "비확률은 주관 개입"],
    keywords: ["확률 추출", "비확률 추출"],
    tables: [
      {
        caption: "확률 추출 [단층계집]",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["개별 추출", "단순확률 추출(Simple Random Sampling)", "동일 확률 추출 기본 추출법\n난수 이용 선정 학생 무작위 예"],
          ["층 분할", "층화확률 추출(Stratified Random Sampling)", "비중복 층 분할 겹치지 않는 층\n층별 단순추출 연령대별 추출 예"],
          ["개별 추출", "계통 추출(Systematic Sampling)", "k번째 간격 추출 추출 틀 순차 선정"],
          ["군집 분할", "집락(군집) 추출(Cluster Sampling)", "인접 단위 군집 군집 구성 후 추출\n군집 내 조사 거주 지역별 예"],
        ],
      },
      {
        caption: "비확률 추출 [눈편할유판]",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["연쇄", "눈덩이 추출법(Snowball Sampling)", "소수 응답자 시작 유사자 소개 확장"],
          ["편의", "편의 표출(Convenience Sampling)", "모집단 정보 없음 조사원 임의 선정\n선정 편리성 이용 가능 대상"],
          ["할당", "할당 추출(Quota Sampling)", "특성별 층 구성 층 내 직접 선정\n확률 근거 없음 성별·나이 예"],
          ["판단", "유의추출법(포커스 그룹, Purposive Sampling / Focus Groups)", "모집단 특성 숙지 대표자 심층 연구\n주관적 판단 소비자 10명 예"],
          ["판단", "판단추출법(Judgement Sampling)", "지식·경험 판단 대표성 주관 판단\n소규모 표본 크기 작을 때 사용"],
        ],
      },
    ],
  },
  {
    title: "왜도(Skewness) & 첨도(Kurtosis)",
    course: "ST",
    definition:
      "왜도: 분포의 비대칭성 정도, 분포가 기울어진 정도와 방향 / 첨도: 정규 분포와 비교해 얼마나 더 뾰족한 지 측정한 값",
    defShort: "왜도는 분포의 비대칭성 정도, 첨도는 얼마나 더 뾰족한 지를 측정한 값",
    lead:
      "분포 모양의 두 측정값, 왜도와 첨도",
    features: ["비대칭 측정", "뾰족함 측정", "정규성 검정"],
    keywords: ["분포의 비대칭성 정도", "얼마나 더 뾰족한 지 측정", "정규성 검정"],
    tables: [
      {
        caption: "왜도(비대칭성)",
        headers: ["값", "설명"],
        rows: [
          ["왜도 < 0", "오른쪽으로 치우진 분포\nNegative Skewness\nright-modal"],
          ["왜도 = 0", "비대칭성 정도가 정규 분포와 유사"],
          ["왜도 > 0", "왼쪽으로 치우진 분포\nPositive Skewness\nleft-modal"],
        ],
      },
      {
        caption: "첨도(뾰족함)",
        headers: ["값", "설명"],
        rows: [
          ["첨도 < 0", "상대적으로 평평한 분포\nPlatykurtic"],
          ["첨도 = 0", "뾰족한 정도가 정규 분포와 유사\nMesokurtic"],
          ["첨도 > 0", "상대적으로 뾰족한 분포\nLeptokurtic"],
        ],
      },
      {
        caption: "수식",
        headers: ["구분", "수식"],
        rows: [
          ["왜도", "γ₁ = 1/(n-1) Σ((xᵢ-x̄)/s)³\nn: 데이터의 수, s: 표준 편차\nxᵢ: i번째 x 값\nx̄: x의 평균"],
          ["첨도", "γ₂ = 1/(n-1) Σ((xᵢ-x̄)/s)⁴ - 3\nn: 데이터의 수, s: 표준 편차\nxᵢ: i번째 x 값\nx̄: x의 평균"],
        ],
      },
    ],
  },
  {
    title: "이상치(Outlier)",
    course: "ST",
    definition: "보통 관측된 데이터의 범위에서 많이 벗어난 아주 작은 값이나 큰 값",
    defShort: "관측된 데이터의 범위에서 많이 벗어나 결과를 왜곡하는 작은 값이나 큰 값",
    lead: "정상 범위를 벗어난 값, 이상치",
    features: ["범위 이탈 극단값", "결과 왜곡 유발", "분포 기준 판별"],
    keywords: ["결과 왜곡", "적정성 위협", "Percentile", "variance", "Likelihood", "Nearest-Neighbor", "Density", "Clustering"],
    tables: [
      {
        caption: "검출방법 — 사분위수 기반",
        headers: ["설명", "산정공식"],
        rows: [
          ["하 내부울타리(lower inner fence: LIF)", "LIF = Q1 − 1.5 × IQR"],
          ["상 내부울타리(upper inner fence: UIF)", "UIF = Q3 + 1.5 × IQR"],
          ["하 외부울타리(lower outer fence: LOF)", "LOF = Q1 − 3.0 × IQR"],
          ["상 외부울타리(upper outer fence: UOF)", "UOF = Q3 + 3.0 × IQR"],
        ],
      },
      {
        caption: "검출 방법",
        headers: ["검출 방법", "설명"],
        rows: [
          ["Variance", "정규분포 97.5% 이상·2.5% 이하 값"],
          ["Likelihood", "베이즈 정리, 정상/이상 샘플\n발생 확률(Likelihood)로 판별"],
          ["Nearest-Neighbor", "모든 데이터 쌍의 거리 계산"],
          ["Density", "LoF(Local Outlier Factor)\n값이 가장 큰 데이터 이상치 추정"],
          ["Clustering", "데이터를 클러스터로 구분\n작은 크기 클러스터 이상치 추정\n클러스터 간 거리 먼 경우 이상치"],
        ],
      },
      {
        caption: "Outlier Replacement(이상치 대체)",
        headers: ["방법", "설명"],
        rows: [
          ["(1) 하한값/상한값 대체", "하한값보다 적으면 하한값 대체\n상한값보다 크면 상한값 대체"],
          ["(2) 평균의 표준편차", "평균±nσ 경계 상하한 산정\n3시그마 기준 밖 값 제거·대체"],
          ["(3) 평균 절대 편차", "중위수 기준 n편차 큰 값 대체"],
          ["(4) 극 백분위수", "상위 P번째 초과 백분위 큰 값 대체"],
          ["(5) Winsorization(윈저화)", "지정 수 극한값 작은 값 대체"],
        ],
      },
    ],
    notes: ["백분위수: 크기가 있는 값들로 이뤄진 자료를 순서대로 나열했을 때 백분율로 나타낸 특정 위치의 값. 성적이 85퍼센타일(85%ile)이라 하면, 이 성적보다 낮은 사람이 85% 있으며, 높은 사람이 15% 있다는 것을 뜻", "IQR = Q3 − Q1, 내부 울타리(1.5×IQR) 밖이면 outlier, 외부 울타리(3.0×IQR) 밖이면 극단 이상값"],
  },
  {
    title: "결측치(Missing Value)",
    course: "ST",
    definition: "관측되어야 할 값을 얻지 못한 데이터(누락)",
    defShort: "관측되어야 할 값을 얻지 못해 분포를 왜곡, 편향을 야기하는 누락 데이터",
    lead: "누락으로 인한 편향 위험, 결측치",
    features: ["관측값 누락", "편향 야기", "삭제 또는 대체"],
    keywords: ["편향", "삭제", "대체"],
    tables: [
      {
        caption: "결측치 유형",
        headers: ["구분", "유형"],
        rows: [
          ["매커니즘", "완전 무작위 결측\n무작위 결측\n비무작위 결측"],
          ["패턴", "일변량 결측 패턴\n단조 결측 패턴\n일반 결측 패턴\n규칙 결측 패턴"],
          ["처리", "삭제\n대체"],
        ],
      },
      {
        caption: "결측치 제거 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["삭제(Removal)", "행 삭제(Listwise Deletion)", "결측치 포함 행 제거"],
          ["삭제(Removal)", "열 삭제(Column Deletion)", "결측치 비율 높은 변수 삭제"],
          ["삭제(Removal)", "적용 조건", "결측치 소수(예: 5% 이하) 시 사용"],
          ["대체(Imputation)", "평균/중앙값/최빈값 대체", "연속형 평균/중앙값 사용\n범주형 최빈값 사용"],
          ["대체(Imputation)", "회귀 대체(Regression Imputation)", "예측 모델(선형 회귀 등)로 보완"],
          ["대체(Imputation)", "KNN 대체(K-Nearest Neighbors Imputation)", "유사한 데이터 찾아 결측값 대체"],
          ["대체(Imputation)", "다중 대체(Multiple Imputation)", "여러 번 샘플링 예측값으로 대체"],
          ["예측 모델 활용", "머신러닝 모델(Decision Tree, Random Forest)", "머신러닝 모델로 결측값 예측"],
        ],
      },
    ],
    notes: ["결측치 제거 필요성: 데이터의 손실과 더불어, 분포를 왜곡시켜 편향을 야기시키는 원인"],
  },
  {
    title: "시계열분석",
    course: "ST",
    definition:
      "시간의 흐름에 따라 관측되는 자료의 시계열 특성을 AR, MA, ARMA, ARIMA 기법을 이용하여 분석, 미래를 예측하는 분석 기법",
    defShort: "시간의 흐름에 따라 관측되는 자료를 AR·MA로 분석해 미래 예측 기법",
    lead: "시간 흐름 자료의 예측, 시계열분석",
    features: ["추세(Trend)", "순환(Cycle)", "계절(Seasonal)"],
    keywords: ["추세", "순환", "계절", "불규칙", "AR", "MA", "ARMA", "ARIMA"],
    tables: [
      {
        caption: "정상성 (시간에 따라 통계적 특성이 변하지 않는 상태)",
        headers: ["조건", "설명"],
        rows: [
          ["평균 일정", "시간 의존 없음 평균 값 일정"],
          ["분산 일정", "시점 의존 없음 분산 값 일정"],
          ["공분산 시차 의존", "시차에만 의존 특정 시점 무관"],
        ],
      },
      {
        caption: "특징 [추순계불]",
        headers: ["특징", "설명"],
        rows: [
          ["추세(Trend)", "시계열 데이터의\n장기 변동 요인\n(GDP, 인구증가율,\n기술변화 등)"],
          ["순환(Cycle)", "시계열 데이터의\n중기 변동 요인.\n2~10년 기간을\n주기로 순환적"],
          ["계절(Seasonal)", "1년 주기로 발생\n단기 변동 요인.\n순환에 비해\n주기가 짧음"],
          ["불규칙(Irregular)", "규칙성 없이 예측\n불가한 요인.\n우연적으로\n발생하는 변동"],
        ],
      },
      {
        caption: "시계열 모델 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["단일 모델", "자기회귀 모델(AR, Autoregressive)", "과거 값 선형결합 이전 p 시점 값\n백색잡음 합 오차항 εt 포함"],
          ["단일 모델", "이동평균 모델(MA, Moving Average)", "과거 예측오차 오차의 현재 영향\n관측값 평균 몇 개 평균 예측"],
          ["결합 모델", "ARMA 모델(Autoregressive Moving Average)", "AR+MA 결합 회귀·이동평균\np값·q잡음 선형 결합의 합"],
          ["결합 모델", "ARIMA 모델(Autoregressive Integrated Moving Average)", "ARMA + 차분 차분 데이터 이용\n정상성 확보 비정상→정상화"],
        ],
      },
    ],
    notes: ["출제 이력: 138회 정보관리 1교시"],
  },
  {
    title: "베이즈 정리(Bayes's theorem)",
    course: "ST",
    definition: "두 확률 변수의 사전 확률과 사후 확률 사이의 관계를 나타내는 정리",
    defShort: "두 확률 변수의 사전 확률과 사후 확률 사이의 관계를 우도로 나타내는 정리",
    lead: "사전·사후 확률 갱신 원리, 베이즈 정리",
    features: ["사전→사후 갱신", "우도 기반 추론", "결과→원인 역추정"],
    keywords: ["사전확률", "우도(Likelihood)", "사후확률", "조건부확률", "확률의 곱셈정리", "전 확률의 정리"],
    tables: [
      {
        caption: "기본수식 및 용어 [전우후]",
        headers: ["구분", "설명"],
        rows: [
          ["기본수식", "좌변 사후확률 P(A|B) 값\n우도×사전확률 P(B) 나눔"],
          ["사전확률(Prior Probability)", "이미 아는 확률 관측자 기존 지식\n초기확률 설정 P(Ai) 표현"],
          ["우도(Likelihood)", "조건부 발생확률 이미 안 사건 조건\nP(B|Ai) 원인별 발생 확률"],
          ["사후확률(Posterior Probability)", "사전확률×우도 결합 산출 확률\n조건부확률 P(Ai|B)"],
        ],
      },
      {
        caption: "베이즈 정리 수식 이론 [조곱전베]",
        headers: ["이론", "표현", "설명"],
        rows: [
          ["조건부 확률", "P(A|B)=P(A∩B)/P(B)", "주어진 사건 가정 하 다른 사건 확률"],
          ["곱셈의 정리", "P(A∩B)=P(B|A)P(A)\n=P(A|B)P(B)", "교집합의 확률법칙"],
          ["전확률의 법칙", "P(B)=ΣP(B∩Ai)", "개별확률 합=전체조건 확률\n단, An·Am 서로소(m≠n)\nA1∪A2∪…∪An=전체집합"],
          ["베이즈 정리", "P(A1|B)=P(B∩A1)/P(B)\n=P(B|A1)P(A1)/P(B)", "n개 배반사건 중 하나 반드시 발생\n사건 B에 의한 사건 A 조건부 확률"],
        ],
      },
    ],
    notes: ["출제 이력: 138회 정보관리 1교시"],
  },
  {
    title: "기술 통계(Descriptive statistics)",
    course: "ST",
    definition: "주어진 표본 자체의 속성을 정량적으로 기술하고 요약하는데 초점을 두는 데이터 분석 통계",
    defShort: "주어진 표본 자체 속성을 정량적으로 기술하고 요약하는 데 초점을 둔 통계",
    lead: "표본 속성의 정량적 요약, 기술 통계",
    features: ["표본 자체 기술", "정량적 요약", "일반화 미포함"],
    keywords: ["데이터 요약(중심경향값, 변산도, 분포)", "데이터 시각화(히스토그램, 상자수염그림, 산점도)"],
    tables: [
      {
        caption: "데이터 요약 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["중심경향값", "평균 mean\n중위수·최빈값", "합÷총 개수 척도\n중앙 위치·최다"],
          ["변산도", "최대최소·범위\n분산·표준편차", "밀집·분산 정도\n평균 거리 척도"],
          ["분포", "왜도(비대칭)\n첨도(뾰족함)", "치우친 정도 척도\n뾰족한 정도 척도"],
        ],
      },
      {
        caption: "데이터 시각화 기법",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["분포", "히스토그램", "도수 분포 기둥 직사각형 그래프"],
          ["분포", "상자수염그림", "사분위수 이용 수치 분포 표현\n이상치 탐지 IQR 기준 경계"],
          ["관계", "산점도(scatter plot)", "두 수치형 변수 관계 시각화"],
        ],
      },
    ],
  },
  {
    title: "추론 통계(Inferential Statistics)",
    course: "ST",
    definition: "표본 데이터를 기반으로 모집단의 특성을 추정하거나 가설을 검정하는 통계 기법",
    defShort: "표본 데이터로 모집단의 특성을 추정하거나 가설을 검정하는 통계 기법",
    lead: "표본 기반의 모집단 추정, 추론 통계",
    features: ["표본 기반 일반화", "모집단 특성 추정", "확률적 판단"],
    keywords: ["모집단 특성 추정", "가설 검정"],
    tables: [
      {
        caption: "기술통계와 추론통계 비교",
        headers: ["비교", "기술통계", "추론통계"],
        rows: [
          ["목적", "표본 특성 분석", "모집단 특성 추정"],
          ["방법", "평균값·표준편차\n중위수·최빈수·최대값\n통계량 분석 기법", "모수추정\n가설검정"],
          ["활용", "학생 성적 추세", "불량률 추정\n선거 지지도 조사"],
        ],
      },
      {
        caption: "추론통계 방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["모수적 방법", "대응표본 t-검정", "두 기간 변화 분석"],
          ["모수적 방법", "독립표본 t-검정", "한 기간 서로 다른 2개 집단 분석"],
          ["모수적 방법", "일원배치 분산분석", "3집단 이상 분석"],
          ["모수적 방법", "반복측정 분산분석", "한 집단 3개 이상 기간 변화 분석"],
          ["비모수적 방법", "윌콕슨 부호순위 검정", "한 집단 두 기간 변화 분석"],
          ["비모수적 방법", "맨휘트니 검정", "한 기간 서로 다른 2개 집단 분석"],
          ["비모수적 방법", "크러스컬-월리스 검정", "한 기간 3개 이상 집단 분석"],
          ["비모수적 방법", "후리드만 검정", "한 집단 3개 이상 기간 변화 분석"],
          ["가설 검정", "통계학적 가설수립", "귀무가설(1·2종 오류)\n대립가설"],
          ["가설 검정", "검정통계량 선정", "표본에서 계산되는 표본통계량"],
          ["가설 검정", "유의수준 결정", "통계학적 검정 판단 기준"],
          ["가설 검정", "검정통계량 계산", "표본자료로부터 검정통계량 계산"],
          ["가설 검정", "판정", "유의확률(p값)에 따라 기각·채택"],
        ],
      },
    ],
    notes: ["개념도: 모집단(population)에서 표본(sample) 추출 → 표본의 특성 분석(기술통계) → 일반화 여부 판단 → 전체 모집단 특성으로 추정(추리통계)"],
  },
  {
    title: "추정 이론(Estimation Theory)",
    course: "ST",
    definition: "모집단으로부터 표본을 추출하여 모집단의 특성을 나타내는 모수에 대한 정보를 얻기 위한 일련의 과정",
    defShort: "표본을 추출해 모집단의 특성을 나타내는 모수에 대한 정보를 얻는 과정",
    lead: "표본으로 얻는 모수 정보, 추정 이론",
    features: ["표본 기반 모수 추정", "구간으로 오차 표현", "추정량 품질 조건"],
    keywords: ["추정", "추정량", "추정값", "점 추정", "구간 추정"],
    tables: [
      {
        caption: "추정(Estimation) — 표본으로부터 모수의 근사값을 결정하는 것",
        headers: ["구분", "설명"],
        rows: [
          ["모수적 추정(Parametric Estimation)", "특정 분포 가정 매개변수 추정"],
          ["비모수적 추정(Non-parametric Estimation)", "분포 가정 없음 데이터 직접 추정"],
        ],
      },
      {
        caption: "추정 방법 [점구]",
        headers: ["방법", "설명", "기법"],
        rows: [
          ["점 추정(Point Estimation)", "모수 한 값 추정\n불확실성 미전달", "최대우도추정(MLE)\n모멘트추정법(MOM)\n베이지안점추정(MAP)"],
          ["구간 추정(Interval Estimation)", "신뢰 구간 제시\n불확실성 표현", "신뢰 구간\n(Confidence Interval)"],
        ],
      },
      {
        caption: "추정량의 조건 [불효일충]",
        headers: ["조건", "설명"],
        rows: [
          ["불편성(Unbiasedness)", "기대값이 실제 모수 값과 동일"],
          ["효율성(Efficiency)", "불편한 추정량 중 분산 최소 추정량"],
          ["일치성(Consistency)", "표본 클수록 추정량 모수에 수렴"],
          ["충분성(Sufficiency)", "통계량만으로 모수 충분 정보 제공"],
        ],
      },
      {
        caption: "불편추정량",
        headers: ["구분", "설명"],
        rows: [
          ["표본평균의 추정량", "Σxᵢ/n = a 표본평균 기대값\n모수 동일 특성 불편추정량 성립"],
          ["표준분산의 추정량", "편차 제곱합 n 나눔 시 불일치\nn−1 자유도 불편추정량 확보"],
        ],
      },
    ],
    notes: ["자유도: 모집단에 대한 정보를 제공하는 독립된 표본의 수. 예) x + y + z = 10 방정식에서, x와 y값을 알면 z는 자동으로 결정 — 즉, 2개의 값만 알면 자동으로 알 수 있는 것으로, 예시는 자유도 2"],
  },
  {
    title: "연관성 분석(association analysis) - 기초통계",
    course: "ST",
    definition: "조사 대상에서 수집한 자료의 척도를 기준으로 변수들 간의 어떤 관계가 있는지 판단하기 위한 분석",
    defShort: "자료의 척도를 기준으로 변수들 간의 어떤 관계가 있는지 판단하는 분석",
    lead:
      "변수 간 관계의 판단, 연관성 분석",
    features: ["척도별 기법 선택", "기대빈도 비교", "선형 상관 측정"],
    keywords: ["관계", "척도", "카이제곱 검정", "관측빈도", "기대빈도", "자유도", "기각역", "상관계수", "상관분석", "공분산"],
    tables: [
      {
        caption: "연관성 분석 유형",
        headers: ["분석 구분", "분석 방법", "척도", "설명"],
        rows: [
          ["교차분석", "교차분석", "명목척도", "교차분할표 이용\n범주형 관계 분석"],
          ["상관분석", "스피어만서열상관", "서열척도", "서열 변수 간\n선형 상관 파악"],
          ["상관분석", "피어슨 상관분석", "등간·비율척도", "연속형 변수 간\n선형 상관 파악"],
          ["상관분석", "편상관분석", "등간·비율척도", "제3 변수 통제\n두 변수 상관"],
        ],
      },
      {
        caption: "교차 분석(Cross-tabulation analysis)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "범주형 교차표 자료 간 관계 확인\n카이제곱 검정 χ² 검정 별칭"],
          ["교차표", "항목 간 빈도표 범주별 빈도 표시\n관측빈도 집계 기대빈도 비교"],
          ["유형", "적합도·독립성 분포 적합 여부\n동질성 검정 집단 동일 여부"],
        ],
      },
      {
        caption: "상관 분석(correlation analysis)",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "변수 간 연관성 조사 목적별 분석"],
          ["분석방법", "선형 관계 분석 상관계수로 측정"],
          ["산포도", "양·음 상관관계 산포 방향 구분\n상관관계 없음 r=0 선형 아님"],
          ["상관계수 유형", "피어슨 계수 등간·비율 척도\n켄달·스피어만 서열 척도 변수"],
        ],
      },
    ],
  },
  {
    title: "회귀분석(Regression Analysis)",
    course: "ST",
    definition: "특정 변수가 다른 변수에 어떤 영향을 미치는지 수학적 모형으로 설명, 예측 기법",
    defShort: "변수가 다른 변수에 미치는 영향을 수학적 모형으로 설명·예측하는 기법",
    lead:
      "영향 관계의 모형화, 회귀분석",
    features: ["수학적 모형 기반", "변수 간 영향 설명", "가정 충족 전제"],
    keywords: ["선형성", "독립성", "등분산성", "정규성", "변수간 관계 모델링 및 예측"],
    tables: [
      {
        caption: "개념도 [선형회귀 예시]",
        headers: ["구분", "설명"],
        rows: [
          ["독립변수", "입력값 또는 원인을 설명하는 변수"],
          ["종속변수", "결과값 또는 효과를 설명하는 변수"],
          ["회귀선(회귀계수)", "독립변수별 종속변수의 기댓값\n일반적으로 최소제곱법 이용\na·b는 회귀계수, c는 y절편"],
        ],
      },
      {
        caption: "회귀분석의 가정 [선정독등공] — 1~4 모두 만족해야 함",
        headers: ["가정", "설명"],
        rows: [
          ["(1) 선형성(Linearity)", "독립·종속변수 간 선형적 관계"],
          ["(2) 잔차 정규성(Normality)", "잔차 기댓값 0, 정규분포 따라야 함"],
          ["(3) 잔차 독립성(Independence)", "관측치들 간 상관관계 없어야 함"],
          ["(4) 잔차 등분산성(Homoscedasticity)", "잔차 분산 독립변수 무관 일정"],
          ["(5) 다중 공선성(Multicollinearity)", "독립변수 간 상관관계 문제 없어야\n전진선택법, 후진소거법\n단계적 선택법"],
        ],
      },
      {
        caption: "회귀분석의 유형 [단다일다선로공분 리라엘]",
        headers: ["구분", "유형"],
        rows: [
          ["독립변수 기준", "단순 회귀분석\n다중 회귀분석"],
          ["종속변수 기준", "일변량 회귀분석\n다변량 회귀분석"],
          ["종속변수 형태", "선형 회귀분석\n로지스틱 회귀분석"],
          ["분산 형태", "공분산 분석\n분산분석"],
          ["정규화", "리지 회귀분석\n라쏘 회귀분석\n엘라스틱넷 회귀분석"],
        ],
      },
      {
        caption: "평가 및 진단방법",
        headers: ["구분", "방법", "설명"],
        rows: [
          ["모델 설명력", "결정계수 R²", "종속변수 설명 비율 나타낸 지표"],
          ["모델 설명력", "AIC/BIC", "적합도 평가 지표, 과적합 방지"],
          ["변수 유의성", "p-value", "영향의 유의미성 통계적 평가"],
          ["변수 유의성", "다중 공선성", "독립변수 간 상관성 높은 경우 진단"],
          ["오차진단", "잔차 분석", "관측·예측값 차이 분석 오차 진단"],
        ],
      },
    ],
    notes: ["절차도: 1.문제 정의 → 2.데이터 수집 및 전처리 → 3.변수 선택 → 4.모델 선택 및 구축 → 5.모델 적합성 검증 → 6.모델 튜닝 → 7.결과 해석 및 인사이트 도출 → 8.예측 및 모델 평가 → 9.보고서 작성 및 배포"],
  },
  {
    title: "AIC(Akaike information Criterion) & BIC(Bayesian information Criterion)",
    course: "ST",
    definition:
      "AIC: 모델의 적합도(log-likelihood)와 변수 개수(모델 복잡도)를 동시에 고려하는 지표 / BIC: 표본 크기 n을 고려하여 복잡한 모델에 더 큰 패널티를 부여하는 지표",
    defShort: "모델 적합도·복잡도 동시 고려, 복잡한 모델에 더 큰 패널티 부여 지표",
    lead:
      "모델 선택의 두 잣대, AIC와 BIC",
    features: ["복잡도 패널티 부여", "최소값 모델 선택", "BIC 표본 크기 반영"],
    keywords: ["회귀", "모델 적합도·복잡도 균형 평가 기준"],
    tables: [
      {
        caption: "AIC — 수식 AIC = −2log(likelihood) + 2p",
        headers: ["구분", "설명"],
        rows: [
          ["−2Log(Likelihood)", "모형 적합도 우도 증가 시 감소"],
          ["2p", "모형 패널티 2의 배수 부과\np 변수 개수 p 작을수록 감소"],
          ["방법 — AIC 최소화", "AIC 최소 조합 우도·p 결정\n적은 변수 설명 큰 우도 좋은 모델"],
          ["방법 — 변수 개수(p)에 따른 우도결정", "편향·분산 관계 제거·증가 오류\n균형점 제시 최적 모델 선택"],
        ],
      },
      {
        caption: "BIC — 수식 BIC = −2log(likelihood) + log(n)p",
        headers: ["구분", "설명"],
        rows: [
          ["−2Log(Likelihood)", "모형 적합도 우도 증가 시 감소"],
          ["Log(n)p", "모형 패널티 log n 배수\np 변수·n 자료 p 작을수록 감소"],
          ["방법 — AIC 보완하여 변수 개수 중점", "n>8 패널티↑ 표본 클수록 정확\n변수 개수 민감 변수 축소 시 참고"],
        ],
      },
      {
        caption: "AIC와 BIC 비교",
        headers: ["비교 항목", "AIC", "BIC"],
        rows: [
          ["목적", "예측 성능 중심", "모델 진실성 중심"],
          ["패널티 항목", "2p", "log(n)p"],
          ["패널티", "비교적 낮음\n과적합 위험", "더 강한 패널티\n단순 모델 선호"],
          ["모델선택", "복잡한 모델 선택", "단순한 모델 선택"],
        ],
      },
    ],
    notes: ["공통 개념도: 확률분포 차이 의미 — 실제 데이터의 분포와 모형이 예측하는 분포 사이의 차이 / 패널티 부여 — 모형이 복잡해 질수록 패널티 부여", "출제 이력: 2025.06 ITPE 모의고사 1교시"],
  },
  {
    title: "통계적 가설검정(Hypothesis Testing)",
    course: "ST",
    definition: "표본에서 얻은 사실을 근거로 하여 모집단에 대한 가설이 맞는지 통계적으로 검정하는 분석방법",
    defShort: "표본에서 얻은 사실로 모집단 가설이 맞는지 통계적으로 검정하는 방법",
    lead:
      "가설의 통계적 판정, 통계적 가설검정",
    features: ["표본 기반 추론", "귀무가설 기각 판단", "1종·2종 오류 상반"],
    keywords: ["귀무가설", "대립가설", "검정통계량", "유의확률", "기각역", "귀무가설 기각", "귀무가설 채택"],
    tables: [
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1단계", "H₀·H₁ 설정 통계 가설 수립"],
          ["2단계", "검정통계량 선택 분석방법 결정"],
          ["3단계", "유의수준 α 결정 통계적 기준 설정"],
          ["4단계", "검정통계량 계산 통계분석 수행"],
          ["5단계", "p값·α 비교 계산된 p값 대조"],
          ["6단계", "H₀ 기각·수용 귀무가설 판정"],
        ],
      },
      {
        caption: "용어",
        headers: ["구분", "설명"],
        rows: [
          ["Ho", "귀무가설 H₀ 영가설 별칭\n직접 검정 대상 옳다고 가정 시작"],
          ["H₁", "대립가설 H₁ 연구가설 별칭\n새 주장 입증 귀무가설에 대립"],
          ["통계분석 방법", "표본분포 고려 표본통계량 분포\n검정통계량 계산 방법 고려"],
          ["검정통계량", "Ho 근접도 수치 모수 예측 판단\nZ·t 통계량 정규·t 분포"],
          ["검정통계량", "χ² 통계량 적합도 검정용\nF 통계량 분산비 검정용"],
          ["유의수준(α, 알파값)", "Ho 참 전제 귀무가설 가정\n관찰 확률 통계량 관찰 확률"],
          ["임계치", "기각·수용 경계 경계 검정통계량"],
          ["기각/수용", "p≤α 시 기각 통계량≥임계치\np≥α 시 수용 통계량≤임계치"],
          ["검정 유형", "좌측검정 왼쪽 기각역\n우측검정 오른쪽 기각역"],
          ["검정 유형", "양측검정 양쪽 기각역\nZ검정 t검정 정규·t 검정"],
          ["검정 유형", "χ²검정 F검정 적합도·분산비"],
        ],
      },
      {
        caption: "P-value와 오류",
        headers: ["구분", "귀무가설이 사실", "대립가설이 사실"],
        rows: [
          ["귀무가설 채택", "옳은 결정 채택", "제2종 오류 β"],
          ["귀무가설 기각", "제1종 오류 α", "옳은 결정 기각"],
        ],
      },
      {
        caption: "1종·2종 오류",
        headers: ["오류", "설명"],
        rows: [
          ["제 1종 오류(α)", "옳은데 귀무가설을 기각할 확률"],
          ["제 2종 오류(β)", "거짓인데 귀무가설 기각 못할 확률"],
        ],
      },
    ],
    notes: ["유의수준: 귀무가설이 실제 옳음에도 기각할 오류 → 일반적으로 유의수준은 주어진 값을 이용(예. 0.05). 임계값: 귀무가설이 기각 or 채택인지 판단하기 위한 기준", "귀무가설이 기각영역에 속하면 귀무가설은 기각되고, 대립가설이 채택됨. p-value 값이 유의수준보다 작거나 같으면, 귀무가설은 기각되고, 대립가설이 채택됨", "1종 오류와 2종 오류는 크기가 서로 상반되므로(하나가 커지면, 다른 것은 작아짐) α 오류에 기준을 두고 기각·채택"],
  },
  {
    title: "ANOVA(Analysis of variance)",
    course: "ST",
    definition:
      "서로 독립적인 집단이 셋 이상인 경우, 집단간 평균차이를 확인하기 위해 F검정을 이용하는 검증해 통계적으로 유의미한지 판단하는 통계 기법",
    defShort: "독립 집단이 셋 이상인 경우 평균차이를 F검정으로 확인하는 통계 기법",
    lead:
      "세 집단 이상의 평균 비교, ANOVA",
    features: ["셋 이상 집단 비교", "분산 비율(F) 검정", "모수적 가정 전제"],
    keywords: ["분산분석", "후속검정", "F검정", "F분포", "F검정량", "단일변량 분산분석", "다변량 분산분석"],
    tables: [
      {
        caption: "ANOVA 조건 [정등독]",
        headers: ["구분", "특성", "설명"],
        rows: [
          ["조건", "정규성", "모집단 정규분포"],
          ["조건", "등분산성", "모집단 분산 동일"],
          ["조건", "독립성", "세 집단 이상 범주"],
          ["예외", "정규성", "빅데이터 시 면제"],
          ["예외", "등분산성", "분산비 4↓ 면제"],
        ],
      },
      {
        caption: "F검정",
        headers: ["구분", "설명"],
        rows: [
          ["F검정", "모집단 분산 차이 유의성 판별 기법"],
          ["F-분포", "동일 모평균 여부 표본 출처 판단"],
          ["F 검정량", "두 집단 샘플 분산의 비율\nF 검정량↑ 집단내·설명된 분산 큼\n그룹 간 평균 차 작고 유사"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "개념도 사례", "독립변수", "종속변수"],
        rows: [
          ["단일변량 분산분석", "One Way ANOVA", "집단 구분 1개\n급여→생산성", "1개", "1개"],
          ["단일변량 분산분석", "Repeated Measures ANOVA", "반복 측정 분석\n1·3·6개월 후", "1개", "1개"],
          ["단일변량 분산분석", "Two Way ANOVA", "집단 구분 2개\n급여+나이", "2개", "1개"],
          ["단일변량 분산분석", "Multi Way ANOVA", "집단 구분 다수\n급여+나이+성별", "3개 이상", "1개"],
          ["다변량 분산분석", "Multivariate ANOVA", "집단 구분 1개\n생산성+만족도", "1개", "2개 이상"],
        ],
      },
    ],
  },
  {
    title: "뮤테이션 테스트 (Mutation Test)",
    course: "SE",
    definition:
      "소스 코드 구문을 일정한 규칙으로 변형 후, 원본 프로그램으로 테스트할 때와 동일한 입력 값으로 서로 다른 결과를 출력시키는 테스트케이스를 선정하여 수행하는 결함 기반 테스트",
    defShort: "소스 코드 구문 변형 후 다른 결과 출력 테스트케이스 선정 결함 기반 테스트",
    lead:
      "테스트의 결함 검출력 검증, 뮤테이션 테스트",
    features: ["결함 주입 기반", "TC 품질 평가", "높은 수행 비용"],
    keywords: ["정상 코드", "돌연변이 코드(뮤턴트)", "테스트 케이스 검증", "의도적 소스 변경", "뮤턴트 연산자", "뮤턴트 스코어"],
    tables: [
      {
        caption: "Test Case 추출 방법",
        headers: ["결과", "설명"],
        rows: [
          ["R1 = R2", "뮤테이션 식별 불가\n결함 발견 불가\nTest case 제외"],
          ["R1 ≠ R2", "뮤테이션 식별 가능\n결함 발견 가능\nTest case set 포함"],
        ],
      },
      {
        caption: "Mutation 연산자의 종류",
        headers: ["연산자", "연산자 사례", "설명"],
        rows: [
          ["대치", "상수 대치\n변수 대치\n상수↔변수 대치", "변수·상수·배열 등 다른 값 대치"],
          ["변형(치환)", "입출력 값 변경\n서비스 순서 변경", "입력·출력 순서 변경\n속성 등의 변경"],
          ["삭제", "Cast 연산자 삭제\nOverload 함수 삭제", "함수·변수·연산자·반환문 삭제"],
        ],
      },
    ],
    notes: ["개념도: 동일 값 입력 → 정상 코드(R1)와 돌연변이 코드(R2) 실행 → 결과 비교", "뮤테이션 점수 계산법(Mutant Score): MS(P,T) = 죽은 뮤턴트 수 / (전체 뮤턴트 수 − 동등한 뮤턴트 수)"],
  },
  {
    title: "성능 테스트",
    course: "SE",
    definition:
      "개발된 시스템이 주어진 환경에서 요구사항의 목표치 달성 여부를 확인하는 테스트",
    defShort: "시스템이 주어진 환경에서 요구사항 목표치 달성 여부를 확인하는 테스트",
    lead:
      "목표 성능 달성의 확인, 성능 테스트",
    features: ["목표치 달성 확인", "정량 지표 기반", "부하 상황 재현"],
    keywords: ["요구사항 목표치 달성 여부 확인", "TPS", "응답시간", "부하/스파이크 테스트"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "구간"],
        rows: [
          ["요구사항 정의 → 성능테스트 계획", "성능테스트 계획"],
          ["성능테스트 설계 → 성능테스트 구현", "성능테스트\n설계/구현"],
          ["성능테스트 수행 → 성능테스트 종료", "성능테스트\n수행/종료"],
        ],
      },
      {
        caption: "성능 지표",
        headers: ["성능지표", "설명", "측정단위", "목표"],
        rows: [
          ["응답시간(Response Time)", "요청~응답까지\n걸린 시간", "초", "낮춤"],
          ["시간당 처리량(Throughput)", "단위시간 당\n성공 요청건수", "TPS, OPS", "높임"],
          ["자원사용량(Utilization)", "용량 중 실제\n사용 비율", "%", "낮춤"],
          ["효율성(Efficiency)", "처리량 ÷\n자원사용량", "%, tpmc", "높임"],
          ["반환시간(Turnaround Time)", "도착~완료 후\n반환까지 시간", "초", "낮춤"],
          ["가용도(Availability)", "사용 가능 확률\nMTBF, MTTR", "%", "높임"],
          ["신뢰도(Reliability)", "장애 미발생 확률", "%", "높임"],
        ],
      },
      {
        caption: "성능 테스트 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["테스트 방법 측면", "Load Test", "부하 인가 최대 TPS·응답시간 산출"],
          ["테스트 방법 측면", "Stress Test", "정상 초과 부하 최대 수용범위 측정"],
          ["테스트 방법 측면", "Spike Test", "특정시점 대량 트랜잭션 동시 발생"],
          ["테스트 방법 측면", "Endurance Test", "장시간 부하로 내구성 테스트"],
          ["테스트 방법 측면", "Breakpoint Test", "점진적 부하 증가, 장애발생 지점"],
          ["테스트 방법 측면", "Loop back Test", "특정위치 Loop back code 삽입\n병목지점 도출"],
          ["테스트 방법 측면", "Availability Test", "이중구성 장애 유도\n서비스전환 동작 여부"],
          ["테스트 목적 측면", "단위 성능 테스트", "대상 시스템 업무 단위 각각 수행"],
          ["테스트 목적 측면", "복합 성능 테스트", "시스템 사용 상황 재현 테스트"],
          ["테스트 목적 측면", "임계 성능 테스트", "시스템 최대 발휘 가능 성능 테스트"],
          ["테스트 목적 측면", "확장성테스트", "증설한 시스템 성능 비율 측정"],
        ],
      },
    ],
  },
  {
    title: "퍼징 테스트 (Fuzzing Test)",
    course: "SE",
    definition:
      "제품에 랜덤 데이터를 입력하여 발생되는 예외, 오류 등을 분석, 보안 취약점을 찾아내는 테스팅 기법",
    defShort: "랜덤 데이터 입력해 예외·오류 분석, 보안 취약점 찾아내는 테스팅 기법",
    lead: "비정상 입력의 취약점 탐지, 퍼징 테스트",
    features: ["무작위 입력 기반", "예외 동작 관찰", "보안 취약점 탐지"],
    keywords: ["Valid Case Fuzzing", "Invalid Case Skip Fuzzing", "Invalid Case Fail Fuzzing", "보안취약점", "블랙박스", "화이트박스"],
    tables: [
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1) 테스트 대상 분석", "분석 대상 시스템 식별·특징 분석\nApplication·Framework\n네트워크 프로토콜·source code\n역공학"],
          ["2) 입력 값 선정", "오류 유발 입력값 선정\n미디어·다큐먼트 파일, 프로토콜\n비정상 입력값"],
          ["3) 테스트 케이스 생성", "입력값 테스트 케이스 생성\n제너레이션, 뮤테이션\nTool: FuzzBox, Seed gathering"],
          ["4) 테스트 실행", "테스트 케이스 입력 프로그램 실행\nCommand line 인터페이스"],
          ["5) 시스템 동작 모니터링", "문제 발생 시 로그 수집\nSystem log, kernel log\nCrash call stack"],
          ["6) 문제 분류 및 해결", "문제 발생 항목 점검\n원인 분석 및 코드 수정\nNull pointer dereferencing\ndivide by 0, buffer overflow"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["데이터 생성", "Dumb Fuzzing", "변경(Mutate) 기반 테스트 데이터"],
          ["데이터 생성", "Smart Fuzzing", "Input 모델 기반 새 유형 데이터"],
          ["데이터 생성", "Evolutionary", "응답 결과 따라 새 데이터 생성"],
          ["데이터 투입", "Valid Case Fuzzing", "유효 명세 생성 데이터 통해\n정상동작 여부 확인"],
          ["데이터 투입", "Invalid Case Skip Fuzzing", "비정상 입력 처리 못하는 경우\n해당 TC 미수행 skip 여부 확인"],
          ["데이터 투입", "Invalid Case Fail Fuzzing", "비정상 데이터 투입 후 Fail 유도\n이후 정상데이터 정상 응답 체크\n미응답 시 Valid Data로 생존 체크"],
          ["변조 대상", "Mutation based Fuzzing", "비정상 변조데이터 대량 투입\n휴리스틱 Fuzz 테스팅"],
          ["변조 대상", "Generation based Fuzzing", "구조변형 기반 Fuzz 테스팅"],
          ["테스팅 기법", "블랙박스 퍼징", "내부 미분석 무작위 입력값 테스트"],
          ["테스팅 기법", "화이트박스 퍼징", "소스 코드 기반 분석 후 입력값 산출"],
          ["테스팅 기법", "그레이박스 퍼징", "내부구조 일부 정보로 입력값 생성\n블랙박스 테스트 수행"],
        ],
      },
    ],
  },
  {
    title: "리그레이션(회귀, Regression) 테스트",
    course: "SE",
    definition:
      "프로그램에 수정, 확장후 변경 부분 뿐만 아닌 기존 기능도 같이 테스트하여 오류사항 검출하는 테스트 기법",
    defShort: "수정·확장 후 기존 기능도 같이 테스트해 오류사항 검출하는 테스트 기법",
    lead:
      "변경에 따른 부작용 검출, 회귀 테스트",
    features: ["기존 기능 재검증", "변경 영향 검출", "기존 TC 재사용"],
    keywords: ["프로그램 수정/확장", "변경 외 기존 기능 테스트", "종류(Reset All, Selective, Priority)", "Ripple Effect", "Side Effect"],
    tables: [
      {
        caption: "회귀 테스트의 종류",
        headers: ["종류", "수행방법", "분야"],
        rows: [
          ["Reset All 기법", "축적 TC 전부 사용", "금융·대고객 등\n고위험 업무"],
          ["Selective 기법", "영향 범위 결정 후\n변경 대상 테스트", "일반 기업 시스템"],
          ["Priority 기법", "핵심 기능 위주\n우선순위 테스트", "저위험도 시스템"],
        ],
      },
      {
        caption: "회귀 테스트 검출 오류 종류",
        headers: ["검출 오류", "설명"],
        rows: [
          ["Ripple Effect(파급효과)", "변경 내용 연관 부분에 영향 전파"],
          ["Side Effect(부작용)", "수정은 의도대로 이루어짐\n미고려 부분 의도치 않은 결과 발생"],
        ],
      },
    ],
    notes: ["구조도: SW 변경 요청 → 개발/테스트(결함조치) → 변경 모듈이 영향 모듈로 파급(Ripple-Effect·Side-Effect) → 변경 영향 범위 확인 → 기존 테스트 케이스로 기존 기능의 영향 여부 확인(회귀 테스트)", "목적: 기존 버그가 SW 변경에 의한 재발 가능성 방지 / 기존 버그 수정에 의한 추가 버그 가능성 방지 / 결함 조치 확인 및 일부 모듈 변경에 따른 전체 정합성 재확인"],
  },
  {
    title: "튜링 테스트",
    course: "SE",
    definition:
      "인간과 구별할 수 없을 정도의 지적행동을 표시할 수 있는 기계의 능력을 확인하는 imitation game 테스트",
    defShort: "기계의 지적행동 능력을 확인하는 imitation game 테스트",
    lead:
      "기계 지능의 판별 실험, 튜링 테스트",
    features: ["문자 대화 방식", "행동 기반 판정", "인간 구별 불가 기준"],
    keywords: ["기계의 사고 능력 판별"],
    tables: [
      {
        caption: "절차도 및 세부 절차",
        headers: ["단계", "세부 절차", "설명"],
        rows: [
          ["1", "테스트 환경 구축", "2개 방에 인공지능·피실험자\n격리 공간에 제3 심사위원 위치"],
          ["2", "테스트 수행", "피실험자 B·인공지능 A 문자 답변\n서로에 대한 정보 없음\n약 5분 소요"],
          ["3", "테스트 평가", "심사위원 A·B 대화 청취\n구분 불가 시 인공지능 생각 가능"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["구분", "활용 사례", "설명"],
        rows: [
          ["이미지 인식분야", "CAPTCHA", "사람 여부 구별"],
          ["이미지 인식분야", "구텐베르크\n프로젝트", "문학작품 전자화\n캡차 형식 인식"],
          ["의료 분야", "엘리자(Eliza)", "심리 상담 활용"],
          ["의료 분야", "패리(Parry)", "정신분열증 모사"],
        ],
      },
    ],
    notes: ["절차도: ① 컴퓨터 화면을 통해 문자로 대화 → ② A, B 모두 사람이라고 주장 → ③ 어느 쪽이 사람인지 구분 시도"],
  },
  {
    title: "Keyword Driven Testing",
    course: "SE",
    definition:
      "테스트 대상 어플리케이션과 관련된 키워드 테스트 케이스를 포함하여 해석기, 시퀀서 이용한 ISO/IEC/IEEE 29119 Part 5에 명시된 소프트웨어 국제 표준 테스트 기법",
    defShort: "키워드 테스트 케이스 포함, 해석기·시퀀서 이용 국제 표준 테스트 기법",
    lead: "키워드 조립 테스트 자동화, Keyword Driven Testing",
    features: ["키워드 기반 TC", "상하위 키워드 계층", "ISO 29119-5 표준"],
    keywords: ["편집기", "해석기", "데이터 시퀀서", "툴 브릿지", "실행 엔진", "테스트 대상", "테스트 라이브러리 저장소", "테스트 데이터 저장소"],
    tables: [
      {
        caption: "프레임워크 구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["저장소", "테스트 라이브러리 저장소", "하나 이상 프로젝트 키워드 저장"],
          ["저장소", "테스트 데이터 저장소", "키워드 TC·TC 사용 테스트 데이터\nTC 실행 코드용 스크립트 저장"],
          ["작성", "편집기", "라이브러리 이용 키워드 TC 작성"],
          ["실행", "해석기와 데이터 시퀀서", "복합 키워드 하위 레벨로 변환"],
          ["실행", "툴 브릿지", "키워드 테스트 환경 동작 지원"],
          ["실행", "실행엔진", "키워드 연관 기능 수행 TC 실행"],
          ["대상", "SUT", "System Under Test\n테스트 대상 소프트웨어"],
        ],
      },
      {
        caption: "Keyword Driven Testing 절차",
        headers: ["절차", "수행내용"],
        rows: [
          ["키워드 정의", "요구사항 기반 계층 결정\n계층 범위 기반 키워드 식별"],
          ["키워드 테스트 케이스 작성", "사용자·라이브러리 키워드\n변수·테스트 데이터 이용 작성"],
          ["키워드 테스트 케이스 실행", "자동화 수행 툴로 TC 실행"],
          ["키워드 리팩토링", "키워드 TC 유지 보수"],
        ],
      },
    ],
    notes: ["프레임워크 흐름: 편집기(상위 레벨 키워드) → 해석기·데이터 시퀀서 → 툴 브리지(하위 레벨 키워드) → 실행 엔진 → 테스트 대상(SUT) — 키워드는 테스트 라이브러리 저장소·테스트 데이터 저장소와 연동"],
  },
  {
    title: "카오스 테스트 (Chaos Test)",
    course: "SE",
    definition:
      "시스템의 신뢰성을 확인하기 위해 실 서비스에 인위적 혼돈(Chaos)를 주입(Failure Injection)하여, 출시 전 테스트에서 드러나지 않은 아키텍처상의 문제를 테스트하는 방법",
    defShort: "인위적 혼돈 주입해 출시 전 드러나지 않은 아키텍처상의 문제 테스트 방법",
    lead:
      "실 서비스 혼돈 주입 시험, 카오스 테스트",
    features: ["실 서비스 장애 주입", "정상 상태 가설 검증", "최소 범위 실험"],
    keywords: ["[정가실결문]", "카오스 엔지니어링 팀", "정상 상태", "가설수립", "실험 디자인", "결과확인", "문제점 수정"],
    tables: [
      {
        caption: "상세 절차 [정가실결문]",
        headers: ["절차", "설명", "사례"],
        rows: [
          ["1) 정상 상태", "측정 가능 값으로\n정상 동작 측정", "CPU load, NW I/O\nMemory 사용률"],
          ["2) 가설 수립", "정상 유지 가설\n시나리오 작성", "DB 다운\n접속 초과\nDDoS 공격"],
          ["3) 실험 디자인", "가설·범위 설정\n지표 선정·알림", "작업 범위 최소\n롤백 계획\n폭발 최소화"],
          ["4) 결과확인", "정상 지표와 비교\n가설 검증", "감지 시간·전파\n알림·복구 시간"],
          ["5) 문제점 수정", "문제점 수정\n지속적 개선", "45분 접속 지연\nSLA 미충족"],
        ],
      },
      {
        caption: "효율적 카오스 테스트 수행 방안",
        headers: ["구분", "내용"],
        rows: [
          ["Team 구축", "Chaos Engineering Team"],
          ["도구 활용", "Chaos Monkey·Kube Monkey\nGameDay·Failure Injection\nChAP·Gremlin"],
          ["Layer별 테스트", "개발팀\n애플리케이션\n스위칭\n인프라"],
        ],
      },
    ],
    notes: ["절차도: 정상 상태(정상 지표 측정) → 가설 수립(시나리오 설계) → 실험 디자인(테스트 계획) → 결과 확인(실행 및 가설 검증) → 문제점 수정(수정 및 개선) — Chaos Engineering Team이 테스트 도구 및 자동화로 뒷받침"],
  },
  {
    title: "Back to Back 테스트",
    course: "SE",
    definition:
      "두 개의 혹은 그 이상의 테스트 시스템에 대하여, 동일한 입력 값을 주고 실행하여, 결과값을 비교한 후, 불일치할 경우 그 불일치를 비교하는 테스트 기법",
    defShort: "둘 이상 테스트 시스템에 동일한 입력 값을 주고 결과값 불일치 비교 기법",
    lead:
      "동일 입력의 결과 비교, Back to Back 테스트",
    features: ["동일 입력 병렬 수행", "결과값 상호 비교", "테스트 오라클 불요"],
    keywords: ["Testcase작성/테스트 수행/결과값 비교/원인 분석", "자동차", "항공기 분야 사용"],
    tables: [
      {
        caption: "상세 절차",
        headers: ["상세 절차", "설명"],
        rows: [
          ["① Test Case 작성", "수행될 Test Case를 작성"],
          ["② 테스트 수행", "테스트 시스템에 병렬 테스트 수행"],
          ["③ 결과값 비교", "각 테스트 시스템 출력 결과값 비교"],
          ["④ 원인 분석", "결과 값 불일치 시 원인 분석"],
        ],
      },
      {
        caption: "자동차 분야의 모델 — 코드간 back-to-back test 수행",
        headers: ["절차", "설명"],
        rows: [
          ["모델 분석", "시뮬링크 모델 적정 크기로 분할\n서브모델 세분화 입출력 값 분석"],
          ["테스트 케이스 작성", "제어 흐름 고려 모델별 TC 작성"],
          ["모델 테스트 케이스 수행", "모델 수행 출력 출력 데이터 도출\n커버리지 목표 미달 시 TC 보완"],
          ["소스코드 테스트 케이스 수행", "수행 환경 설정 코드 실행 환경\n출력·커버리지 결과 데이터 측정"],
          ["결과 비교 및 리포트", "모델·코드 출력 TC별 일치 판단"],
        ],
      },
    ],
    notes: ["절차도: Test Case → Program Version 1·2·n 병렬 실행 → Test Result Comparison → Test Result Analysis"],
  },
  {
    title: "Test Process",
    course: "SE",
    definition:
      "테스트 계획부터 오류 추적·수정까지 테스트 활동을 단계화한 5단계 프로세스 (IEEE 829)",
    defShort: "테스트 계획부터 오류 추적·수정까지 단계화한 5단계 표준 프로세스",
    lead:
      "테스트 활동의 단계화, Test Process",
    features: ["IEEE 829 기반", "문서 중심 관리", "오류 추적 환류"],
    keywords: ["[계케실결오]", "IEEE 829"],
    tables: [
      {
        caption: "5단계 프로세스 [계케실결오]",
        headers: ["절차", "세부 단계", "설명", "산출물"],
        rows: [
          ["테스트 계획", "요구사항 수립\n계획 작성\n계획 검토", "목표·범위 선정\n전략·일정·보고\n계획 정제·확정", "테스트요구사항정의서\n테스트 계획서"],
          ["테스트 케이스 설계", "설계기법 정의\n케이스 도출\n원시 데이터 수집", "기법 정의\n기법으로 도출\n수행 데이터 작성", "기법 명세서\n설계 명세서\n원시 데이터"],
          ["테스트 실행 및 측정", "환경 구축\n케이스 실행", "환경·자원 설정\n결과 측정", "테스트 측정 결과"],
          ["결과 분석 및 보고", "측정결과 분석\n결과 보고", "측정치 분석\n보고서 작성", "결과 분석서\nSW 상태 보고서\n결과 보고서"],
          ["오류 추적 및 수정", "원인 분석\n수정 계획\n오류 수정\n수정 후 검토", "오류 지점 분석\n우선순위 결정\n디버깅 도구 사용\n정합성 검증", "오류 보고서\n수정 계획서\n수정결과 보고서\n수정 대상물"],
        ],
      },
    ],
  },
  {
    title: "ISO 29119",
    course: "SE",
    definition:
      "SW개발 생명주기 전 과정에 걸쳐 있는 테스팅 프로세스와 관련 산출물에 대한 국제 표준",
    defShort: "SW 개발 생명주기 전 과정의 테스팅 프로세스와 관련 산출물의 국제 표준",
    lead: "테스팅 프로세스 국제 표준, ISO 29119",
    features: ["전 생명주기 적용", "산출물 표준화", "기존 표준 통합"],
    keywords: ["[개프도테키]", "개념", "프로세스", "문서화", "테스트 기법", "키워드 기반 테스팅"],
    tables: [
      {
        caption: "프레임워크 구성요소 [개프도테키]",
        headers: ["구분", "설명", "주요 항목"],
        rows: [
          ["Part 1. 개념과 정의(Concepts and Definitions)", "전체 가이드 제공\n용어·개념 정의", "테스팅 개념\n조직·PJT 관점\n위험 기반 테스팅\n결함관리"],
          ["Part 2. 테스트 프로세스(Test Process)", "테스트 프로세스\n3수준 계층 모델", "다계층 모델\n조직 테스트\n테스트 관리\n동적 테스트"],
          ["Part 3. 테스트 문서화(Test Documentation)", "문서 견본·예시\n산출 문서 작성", "조직 테스트 문서\n테스트 관리 문서\n동적 테스트 문서"],
          ["Part 4. 테스트 설계 기법(Test Techniques)", "테스팅 기법 제공\n설계·구현 활용", "명세 기반 기법\n구조 기반 기법\n경험 기반 기법\n커버리지 측정"],
          ["Part 5. 키워드 주도 테스팅(Keyword-Driven Testing)", "키워드 주도 소개\n접근 방법 제공", "활용 방법\n프레임워크\n이점·요구사항\n기본 키워드"],
        ],
      },
    ],
    notes: ["프레임워크 연계: Part 1(Concepts & Vocabulary — BS 7925-1) ↔ Part 2(Processes — ISO/IEC 33063 Process Assessment) ↔ Part 3(Documentation — IEEE 829) ↔ Part 4(Testing Techniques — BS 7925-2) ↔ Part 5(Keyword-Driven Testing), Reviews(ISO/IEC 20246·IEEE 1028)"],
  },
  {
    title: "ISO 29119-11",
    course: "SE",
    definition:
      "AI 기반 시스템을 도입하고 테스트하는 방법에 대한 지침을 제공하기 위한 ISO/IEC 기술보고서",
    defShort: "AI 기반 시스템 도입·테스트 방법 지침을 제공하는 ISO 기술보고서",
    lead:
      "AI 시스템 테스트 지침, ISO 29119-11",
    features: ["AI 시스템 특화", "기술보고서 형태", "AI 고유 특성 반영"],
    keywords: ["AI 기반 시스템", "1~10 파트"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성", "설명"],
        rows: [
          ["1. Scope", "ISO/IEC TR 29119-11의 범위"],
          ["2. Normative references", "규범적 참조"],
          ["3. Terms, definitions and abbreviated terms", "본 문서 목적 위한 용어와 정의"],
          ["4. Introduction to AI and Testing", "AI 소개\nAI 시스템 맥락에서 테스트 설명"],
          ["5. AI System characteristics", "AI 기반 시스템 특성 소개\nISO/IEC 25010 품질 특성 부분 적용\nAI 기반 시스템만의 특성 존재"],
          ["6. Introduction to the testing of AI-based systems", "기존 SW가 AI 구성요소 둘러쌈\nAI 부품도 일반 SW와 동일 결함 가능\nAI 기반 시스템 테스트 방법 소개"],
          ["7. Testing and QA of ML systems", "ML 관련 품질 보증 및 시험 기회 설명"],
          ["8. Black-box testing of AI-based systems", "AI 기반 시스템 블랙박스 테스트"],
          ["9. White-box testing of neural networks", "신경망 화이트 테스트 방법 설명"],
          ["10. Test environments for AI-based systems", "일반 테스트 환경과 공통점 많음\nML 격리 시험 시 개발 프레임워크 내"],
        ],
      },
      {
        caption: "ISO 29119-11의 블랙박스 테스트기법",
        headers: ["기법"],
        rows: [
          ["조합테스트(Combination testing)"],
          ["백투백 테스트 (Back-to-back testing)"],
          ["A/B testing"],
          ["변성 테스트 (Metamorphic testing)"],
          ["탐색적 테스트 (Exploratory testing)"],
        ],
      },
    ],
  },
  {
    title: "Test Exit Criteria",
    course: "SE",
    definition:
      "추정 결함밀도, 커버리지 달성률, 일정 및 비용 등 정량화 지표 활용, 하나의 테스트 레벨 또는 특정 목적의 테스팅에 대한 종료 시점 결정 위한 테스트 완료 조건",
    defShort: "테스트 레벨 또는 특정 목적 테스팅의 종료 시점 결정 위한 테스트 완료 조건",
    lead:
      "테스트 종료 시점의 기준, Test Exit Criteria",
    features: ["정량 지표 기반", "레벨별 종료 판단", "심각 결함 해소"],
    keywords: ["완전성", "목적", "기준", "커버리지", "리스크", "스케쥴"],
    tables: [
      {
        caption: "기본 원칙",
        headers: ["구분", "대상", "기본 원칙"],
        rows: [
          ["구현", "어플리케이션기능", "요구 서비스의\n정상 동작 여부"],
          ["구현", "어플리케이션산출물", "문서 작성 및\n최신화 유지"],
          ["단계", "Bugs의 100% 해결", "우선순위 높은\nBugs 100% 해결"],
          ["단계", "Test Entry Criteria", "빌드·재테스트\n완료 시점"],
        ],
      },
      {
        caption: "완료 조건 [완목기커리스]",
        headers: ["완료조건", "설명", "사례"],
        rows: [
          ["테스트 완전성", "모든 TC 수행\n심각 결함 없음", "TC 650개 완료\nCritical 미존재"],
          ["테스트 목적", "초기 품질 목표\n달성", "현업 만족도\n90% 이상"],
          ["테스트 기준", "레벨·완료 조건\n기준 도달", "TC 90% 이상\n만족 시"],
          ["테스트 커버리지", "요구사항 모두\n충족 판단", "5가지 요구기능\n구현"],
          ["테스트 리스크", "관련 Risk 제거\n완료", "결함 조치 속도\n미진함 해결"],
          ["테스트 스케쥴", "예정 일정 종료", "테스트 종료일\n경과"],
        ],
      },
    ],
  },
  {
    title: "Lehman의 Software 변화의 원리",
    course: "SE",
    definition:
      "소프트웨어의 지속적 진화에 대해 3가지 Type으로 분류하고 그 진화에 대해 설명한 8가지 원리 (Software 변화의 법칙)",
    defShort: "SW 진화를 3가지 Type 분류하고 진화에 대해 설명한 8가지 원리",
    lead:
      "소프트웨어 진화의 법칙, Lehman의 변화의 원리",
    features: ["계속적 변경", "복잡도 증가", "품질 감소"],
    keywords: ["[변복진조친성품피]", "①계속 변경 ②복잡도 증가 ③프로그램 진화 ④조직적 안정화 ⑤친근성 유지 ⑥지속 성장 ⑦품질감소 ⑧피드백 시스템"],
    tables: [
      {
        caption: "Lehman의 System Type",
        headers: ["System Type", "특징", "설명"],
        rows: [
          ["S-Type (Static Type System)", "고정된 사양\n비진화", "고정된 공식적 사양으로 정의"],
          ["P-Type (Practical Type System)", "고정된 사양\n사양 반복적 개선", "요구 사항 정확하게 정의\n형태·수용성 환경에 의존적"],
          ["E-Type (Embedded Type)", "변화되는 사양\nLehman의 원리 대상", "현실 세계 문제 해결 System\nSpecification 고정 불가 Type"],
        ],
      },
      {
        caption: "Lehman의 Software 변화의 원리 [계복진조 친지감피]",
        headers: ["원리", "촉발 요인", "주요 내용"],
        rows: [
          ["계속적 변경(Continuing Change)", "사용 현실 반영\n품질 저하", "요구사항 변경\n유용성 저하"],
          ["복잡도 증가(Increasing Complexity)", "제1 법칙의\n유용성 유지", "구조 복잡도 증가\n변경 반복 요인"],
          ["프로그램 진화(Program Evolution)", "4, 5 법칙의\n일반화", "고유 크기 유지\n에러 수 일정"],
          ["조직적 안정화(Organizational Stability)", "자원 투입\n효과의 상한선", "생산성 일정\n추가 투입 무의미"],
          ["친근성 유지(Conservation of Familiarity)", "사용성 유지", "버전 변화 일정"],
          ["지속적 성장(Continuing Growth)", "사용자 만족도", "기능 지속 추가"],
          ["품질 감소(Declining Quality)", "운영 환경의 변화", "운영환경 미대응\n품질 저하"],
          ["피드백 시스템(Feedback System)", "System의\n환경 반영", "피드백 체계 구성\n큰 폭 제품개선"],
        ],
      },
    ],
  },
  {
    title: "3R",
    course: "SE",
    definition:
      "소프트웨어 생산성을 극대화하기위해 레포지토리를 기반으로 역공학, 재공학, 재사용 기법을 사용하는 공학적 접근법",
    defShort: "레포지토리 기반 역공학·재공학·재사용으로 생산성 극대화 접근법",
    lead: "역공학·재공학·재사용 접근, 3R",
    features: ["레포지토리 기반", "레거시 자산 활용", "역공학 선행"],
    subDefs: [
      {
        name: "역공학(Reverse Engineering)",
        lead: "물리 정보의 논리 정보화",
        def: "물리적 수준의 SW 정보를 논리적인 SW 정보로 추출하는 절차 및 행위",
      },
      {
        name: "재공학(Re-Engineering)",
        lead: "기존 시스템의 재설계·교체",
        def: "현재 구현된 시스템 검토·수정해 재설계·교체를 진행하는 절차 및 행위",
      },
      {
        name: "재사용(Re-Use)",
        lead: "기존 결과물의 신규 적용",
        def: "이미 개발 완료된 결과물을 신규 개발 SW에 적용하는 일련의 행위·절차",
      },
    ],
    keywords: ["레포지토리", "역공학", "재공학", "재사용"],
    tables: [
      {
        caption: "역공학(Reverse Engineering)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "물리적 SW 정보를 논리적으로 추출"],
          ["절차", "Code 추출\nCode 분석·수정\n문서화"],
          ["유형", "논리 역공학\n자료 역공학\n재문서화\n설계 복구"],
        ],
      },
      {
        caption: "재공학(Re-Engineering)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "시스템 검토·수정, 재설계·교체"],
          ["절차", "Reverse Engineering\n재구조화\n구현"],
          ["유형", "CASE Tools\n재구조화\n재모듈화\n의미론 정보 추출"],
        ],
      },
      {
        caption: "재사용(Re-Use)",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "완료 결과물 신규 Software 적용"],
          ["필요 속성", "신뢰성·확장성\n생산성·사용성\n유지보수성\n적응성"],
          ["절차", "Forward Engineering\nRe-Use"],
          ["기법", "Library\nDesign Pattern\nCBD"],
        ],
      },
    ],
    notes: ["개념도: Legacy System 분석 → (Binary만 존재) Reverse Engineering으로 Code 추출 / (Code 존재) Clean Code / (설계 문서 미 존재) 설계 명세서 복원 → Repository에 Code·UML Diagram 등 저장 → Re-Engineering·Re-Use로 개선 System"],
  },
  {
    title: "소프트웨어 리팩토링",
    course: "SE",
    definition:
      "소프트웨어 모듈의 외부적 기능은 수정하지 않고 내부적인 구조, 관계 등을 단순화하여 소프트웨어의 유지보수성을 향상시키는 기법",
    defShort: "외부 기능 수정하지 않고 내부 구조·관계 단순화해 유지보수성 향상 기법",
    lead:
      "기능 불변의 구조 개선, 소프트웨어 리팩토링",
    features: ["외부기능 불변", "코드 스멜 기반", "작은 수정·테스트"],
    keywords: ["외부기능 변경없이 내부 구조 수정", "코드 스멜", "Move", "Extract", "Push Down", "Full Up"],
    tables: [
      {
        caption: "리팩토링 대상 [중긴큰긴산]",
        headers: ["대상", "설명"],
        rows: [
          ["중복된 코드", "한 곳 이상에서\n중복된 코드가\n존재"],
          ["긴 메소드", "메소드 처리\n방법이 의미적\n간격이 큰 구조"],
          ["큰 클래스", "한 클래스에 너무\n많은 속성과\n메소드가 존재"],
          ["긴 파라미터 리스트", "이해하기 어렵고\n일관성이 없어\n사용하기 어려운\n파라미터 구조"],
          ["산탄총 수술", "특정 클래스를\n수정 시 관련된\n모든 클래스에서\n변경이 발생"],
        ],
      },
      {
        caption: "리팩토링 기법",
        headers: ["측면", "기법", "설명"],
        rows: [
          ["결합도 측면", "Move", "다른 클래스에서\n많이 쓰면 이동\nMove Method\nMove Attribute"],
          ["결합도 측면", "Extract", "작은 단위로 분리\nExtract Class\nExtract Method\nExtract Interface"],
          ["응집도 측면", "Push Down", "서브만 쓰는\n메소드·속성\nPush Down Method\nPush Down Attribute"],
          ["응집도 측면", "Pull Up", "동일 사용 요소\n메소드·필드를\n상위로 이전\nPull up Method·Field"],
          ["응집도 측면", "Inline", "불필요 객체 삭제\n사용처에 통합\nInline Class·Method"],
          ["단순화", "Rename Method", "Method Name을\n목적에 맞게 변경"],
          ["은닉", "Encapsulate Field", "Public 필드를\nPrivate으로 만들고\n접근자를 제공"],
        ],
      },
    ],
    notes: ["절차도: 동작하는 프로그램 → 리팩토링 수행여부 판단(Bad Smell) → 개선 대상 코드 영역 → 테스트 Set 작성 → 코드 수정(구조 개선) → 테스트 통과? → 리팩토링 목적 달성까지 (작은 수정/테스트) 반복 → 개선 완료된 코드 영역 → 새로운 기능 추가"],
  },
  {
    title: "유지보수",
    course: "SE",
    definition:
      "소프트웨어의 생명주기 최종 단계인 폐기전 단계로 오류를 수정하고 사용자의 요구사항을 정정하며 기능과 수행력을 증진시키기 위한 활동",
    defShort: "오류를 수정하고 요구사항을 정정하며 기능과 수행력을 증진하는 활동",
    lead:
      "인도 후 오류 수정과 개선, 유지보수",
    features: ["폐기 전 최종 단계", "변경요청 승인 기반", "예방적 활동 포함"],
    keywords: ["계예응지", "데프문시", "수완예적"],
    tables: [
      {
        caption: "상세 절차",
        headers: ["절차", "설명", "담당자"],
        rows: [
          ["1", "변경요청서 작성", "사용자"],
          ["2", "변경요청서 검토\n우선순위 결정", "분석가"],
          ["3", "유지보수 승인\n실행 승인", "유지보수\n관리 위원회"],
          ["4", "유지보수 수행\n변경보고서 작성\n산출물 변경", "유지보수 담당"],
        ],
      },
      {
        caption: "유지보수 유형 [계예응지 / 데프문시 / 수완예적]",
        headers: ["분류기준", "종류", "설명"],
        rows: [
          ["시점에 의한 유지보수", "계획 유지보수", "주기적 수행"],
          ["시점에 의한 유지보수", "예방 유지보수", "사전 예방 차원"],
          ["시점에 의한 유지보수", "응급 유지보수", "긴급 후 승인"],
          ["시점에 의한 유지보수", "지연 유지보수", "변경분 추후 지원"],
          ["대상에 의한 유지보수", "데이터 유지보수", "변환 필요 시 처리"],
          ["대상에 의한 유지보수", "프로그램 유지", "변경·오류 처리"],
          ["대상에 의한 유지보수", "문서 유지보수", "표준 변경 대응"],
          ["대상에 의한 유지보수", "시스템 유지보수", "변경·장애 처리"],
          ["원인에 의한 유지보수", "수정적 유지보수", "오류·결함 수정"],
          ["원인에 의한 유지보수", "완전적 유지보수", "기능 개선 수행"],
          ["원인에 의한 유지보수", "예방적 유지보수", "정기적 수행"],
          ["원인에 의한 유지보수", "적응적 유지보수", "변화·갱신 적용"],
        ],
      },
    ],
    notes: ["절차도: 사용자(요청 단계) → 요청서 → 분석가(분석 단계) → 승인요청 → 유지보수 관리 위원회(승인 단계) → 지시 → 유지보수자(실행 단계) → 유지보수 결과 보고"],
  },
  {
    title: "ISO/IEC/IEEE 14764",
    course: "SE",
    definition:
      "ISO/IEC 12207 유지보수 프로세스를 6단계로 상세화한 S/W 유지보수의 표준프로세스",
    defShort: "12207 유지보수를 6단계로 상세화한 SW 유지보수 표준 프로세스",
    lead:
      "유지보수 프로세스의 표준, ISO/IEC/IEEE 14764",
    features: ["ISO 12207 상세화", "수정 요청 기반", "순향적 대응 포함"],
    keywords: ["수정/적응/완벽/예방 유지보수", "기법(SW 이해, 재공학, 역공학, 재구조화)", "유지보수 프로세스 단계"],
    tables: [
      {
        caption: "유지보수 프로세스",
        headers: ["프로세스", "설명"],
        rows: [
          ["공정구현", "계획·절차 개발 활동·업무 정의\n형상관리 수행 문서화 프로세스"],
          ["문제 및 수정분석", "유형·범위 분석 교정 개선 예방\n중요성 판단 성능·안전 영향"],
          ["수정 구현", "수정 부분 결정 필요 범위 분석\n개발 프로세스 설계 구현 시험"],
          ["유지보수 검토/승인", "무결성 검토 권한 조직 검토\n수정 완료 승인 만족 여부 확인"],
          ["이전", "전환 계획 수립 계획 개발 실행\n통보·병행 운영 구 환경 데이터"],
          ["SW 폐기", "SW 제품 폐기 소유자 요구 반영"],
        ],
      },
      {
        caption: "변경유형에 따른 S/W 유지보수 분류",
        headers: ["구분", "분류", "설명"],
        rows: [
          ["반응적(Reactive)", "수정\n적응", "납품 후 발견 문제 시정 반응적 수정\n변화된 환경에서 SW 제품 계속 사용"],
          ["순향적(Proactive)", "완벽\n예방", "납품 후 SW 성능이나 유지보수 개선\n잠재장애를 미리 검출하고 시정"],
        ],
      },
      {
        caption: "S/W 유지보수 기법",
        headers: ["기법", "설명", "비고"],
        rows: [
          ["프로그램 이해", "코드분석 툴로\n소스 이해성 향상", "Code-Browser\n산출물 철저"],
          ["재공학", "자동화 도구로\n평가·수정 수행", "리팩토링\nData Reengineering"],
          ["역공학", "코드로 설계 분석\n명세서 작성", "소스코드 분석기\n모듈 추출기\n문서화 도구"],
          ["재구조화", "훼손된 구조 복원\n유지보수비 절감", "클래스 변형\n설계 변형"],
        ],
      },
    ],
  },
  {
    title: "오픈소스 SW 보안위협",
    course: "SE",
    definition:
      "오픈소스: 소프트웨어의 핵심 구성요소인 소스 코드가 공개되어 정해진 사용권 범위 안에서 사용자가 자유롭게 사용하거나 변경 및 공유(배포)할 수 있는 공개형 소스코드",
    defShort: "사용권 범위 안에서 자유롭게 사용·변경·공유 가능한 공개형 소스코드",
    lead:
      "공개 코드 사용의 위험, 오픈소스 SW 보안위협",
    features: ["소스코드 공개 노출", "현황 파악 부재", "배포사 패치 의존"],
    keywords: ["자유로운 배포", "소스 코드 공개", "Zero day Attack", "Log4j", "거버넌스"],
    tables: [
      {
        caption: "관리적 측면의 보안 위협과 관리방안",
        headers: ["구분", "보안 위협", "설명"],
        rows: [
          ["사용", "오픈소스 SW 사용 현황 부재", "자유로운 배포, 배포처 파악 불가\n기업내 사용 현황 관리 부실"],
          ["사용", "오픈소스 커뮤니티 소스코드 맹목적 사용", "Github 등 커뮤니티 맹목적 신뢰\n타이포스쿼팅 보안 위협"],
          ["프로세스", "오픈소스 SW 취약점 점검 프로세스 부재", "직접 개발 SW 대비 점검 수준 저하\n패키지 형태 사용, 점검 예외 빈번"],
          ["프로세스", "오픈소스 SW 취약점 패치 검토 및 조치 지연", "Side-Effect 검토 등 조치 지연\n조치주체 부재·모호성, 대응 부재"],
        ],
      },
      {
        caption: "기술적 측면의 보안 위협과 관리방안",
        headers: ["구분", "보안 위협", "설명"],
        rows: [
          ["공격", "공개 SW로 Zero Day 공격 가능성 증가", "소스 공개로 Zero Day 공격 가능\n해커 커뮤니티 통한 공격 코드 확산"],
          ["공격", "오픈소스 SW 내 악성코드 삽입 배포", "원격 제어(RCE) 악성코드 배포\n크립토재킹 코드로 가상화폐 채굴"],
          ["조치", "오픈소스 SW 취약점 자체 조치 불가", "배포사 취약점 패치 의존\nWork Around(임시 조치) 대응"],
          ["조치", "오픈소스 SW 보안 취약점 패치의 호환성 문제", "패치 시 호환성 문제로 조치 불가\n호환성 해결까지 조치 지연"],
        ],
      },
      {
        caption: "보안 관리 방안",
        headers: ["구분", "보안 관리 방안", "설명"],
        rows: [
          ["사용", "오픈소스 SW 사용 현황 파악 Tool 도입", "오픈소스 SW 전용 Scan Tool 활용"],
          ["사용", "오픈소스 커뮤니티 소스코드 Hash값 확인", "공신력 있는 제작자 배포 소스 사용\nHash값으로 악성코드 탐지 확인"],
          ["프로세스", "오픈소스 SW 보안 점검 프로세스 수립", "보안 점검 가이드 전사 배포\n긴급 패치 프로세스 간소화"],
          ["프로세스", "오픈소스 SW 보안 관리 전문가 점검 도입", "전문 업체 통한 유지보수·점검"],
          ["개발", "오픈소스 SW 적용 전 Sandbox 테스트 적용", "Sandbox로 악성코드 동작 확인\nHash값보다 직관적 악성코드 탐지"],
          ["개발", "오픈소스 SW 시큐어코딩 적용", "2차적 저작물 수정 시 시큐어 코딩"],
          ["장비", "오픈소스 SW 보안 업데이트 자동화 도입", "SW별 업데이트 방법 확인·자동화\nScript·Crontab·RPA 활용"],
          ["장비", "지능형 IPS, FW 도입", "CWE·CVE 시그니처 기반 탐지·차단\n알려진 취약점 포함 소스코드 차단"],
        ],
      },
    ],
  },
  {
    title: "오픈소스 거버넌스",
    course: "SE",
    definition:
      "OSS를 안전하게 사용·적용 및 배포하기 위해 필요한 사항을 다양한 관점에서 활용할 수 있도록 소프트웨어 라이프 사이클 단계별로 제시한 절차 및 체계",
    defShort: "OSS 안전 사용·적용·배포용 SW 라이프 사이클 단계별 절차·체계",
    lead: "OSS 생명주기 통제 체계, 오픈소스 거버넌스",
    features: ["생애주기 단계별", "안전한 OSS 활용", "상시 관리 순환"],
    keywords: ["거버넌스", "프레임워크", "정책수립", "획득", "적용", "운영 및 유지", "관리 및 개선"],
    tables: [
      {
        caption: "프레임워크 [정획적운관]",
        headers: ["FW", "활동요소", "설명"],
        rows: [
          ["정책수립", "컨설팅", "적용 전략 자문"],
          ["정책수립", "정책수립", "규정·지침 수립"],
          ["정책수립", "조직구성", "인력 역할 구성"],
          ["획득", "요구분석", "고객 요구 분석"],
          ["획득", "조사", "적합 후보 탐색"],
          ["획득", "분석", "속성 구분 정리"],
          ["획득", "평가", "가중치 부여 채점"],
          ["적용", "계약", "책임·의무 조건"],
          ["적용", "설계", "기능 사양 구성"],
          ["적용", "개발", "변경 및 결합"],
          ["적용", "패키징", "단일 프로그램화"],
          ["적용", "시험", "품질 성능 확인"],
          ["적용", "배포", "매체·웹·장비"],
          ["운영 및 유지", "설치", "운영 장비 탑재"],
          ["운영 및 유지", "운영", "지속 실행 가동"],
          ["운영 및 유지", "유지보수", "최상 상태 유지"],
          ["운영 및 유지", "기술지원", "문제 해결 지원"],
          ["운영 및 유지", "커뮤니티", "소스코드 기여"],
          ["관리 및 개선", "컴플라이언스", "라이선스 준수"],
          ["관리 및 개선", "교육", "지식 전달 강화"],
          ["관리 및 개선", "모니터링", "적용 후 피드백"],
        ],
      },
    ],
    notes: ["프레임워크 흐름: 정책수립 → 획득 → 적용 → 운영 및 유지, 그 위에 관리 및 개선(컴플라이언스·교육·모니터링)이 상시 순환"],
  },
  {
    title: "CMMI 3.0",
    course: "SE",
    definition:
      "조직의 프로세스 개선을 통한 소프트웨어 개발 과정에서의 비용, 품질, 일정 등 모든 것을 충족시키며 특정 성숙도 레벨로 진입하기 위해 수행해야 할 활동들을 제시한 모델",
    defShort: "프로세스 개선으로 특정 성숙도 레벨 진입하기 위한 활동들을 제시한 모델",
    lead:
      "조직 프로세스 성숙도 모델, CMMI 3.0",
    features: ["단계적 성숙도", "다중 도메인 확장", "성과 중심 개선"],
    keywords: ["Category", "Capability", "Practices"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "세부 항목", "설명"],
        nameCol: 1,
        rows: [
          ["Category Area", "Doing, Managing\nEnabling, Improving", "성과 개선 관행 정의 관련 영역 그룹"],
          ["Capability Area", "Category 하위 Practices 그룹 영역(12개)", "의도·가치 달성 유사성 묶음\n관련 Practice Area들의 묶음\nCapability Area 단위 개선 활동"],
          ["Practices", "공통 Practices 영역(17개)", "목적·가치 달성 주요 활동 집합"],
          ["Practices", "도메인별 특정 Practices 영역(14개)", "도메인 목적 달성 주요 활동 집합"],
          ["Domain", "Development(DEV), Services(SVC)\nSuppliers(SPM), Security(SEC)\nSafety(SAF), People(PPL)\nData, Virtual(VRT)", "개선하고자 하는 특정 영역\n도메인별 Practices 영역 포함\n기존에서 총 8개로 확장"],
        ],
      },
      {
        caption: "성숙도 레벨",
        headers: ["레벨", "명칭"],
        rows: [
          ["1", "Initial (초기)"],
          ["2", "Managed (관리)"],
          ["3", "Defined (정의)"],
          ["4", "Quantitively Managed\n(정량적 관리)"],
          ["5", "Optimizing (최적화)"],
        ],
      },
    ],
    notes: ["구조도: Model → Category → Capability Area → Practices Group(Level 1~n) → Practices(1.1~n.x) → Informative Material(Context Specific)"],
  },
  {
    title: "GS 인증",
    course: "SE",
    definition:
      "국산 SW 제품의 품질 향상을 통한 국내 SW 산업 활성화 정책으로 SW 시험 인증 센터가 국제표준을 기반으로 개발한 한국형 SW 품질 인증제도",
    defShort: "국산 SW 품질 향상 위해 국제표준 기반 개발한 한국형 SW 품질 인증제도",
    lead: "국산 SW 품질 국가 시험, GS 인증",
    features: ["국산 SW 대상", "국제표준 기반", "한국형 품질 인증"],
    keywords: ["기능성", "신뢰성", "사용성", "성능효율성", "유지보수성", "이식성", "보안성", "호환성", "일반적 요구사항", "SW산업진흥법"],
    tables: [
      {
        caption: "GS 인증 SW 품질 평가 모델 [23측정 51요구 41평가]",
        headers: ["표준", "설명"],
        rows: [
          ["ISO/IEC 25023", "SW 제품 품질 측정 국제표준"],
          ["ISO/IEC 25051", "SW 품질 요구사항·시험 국제표준"],
          ["ISO/IEC 25041", "SW 제품 품질 평가 국제표준"],
        ],
      },
      {
        caption: "품질 특성(평가 항목)",
        headers: ["주특성", "부특성"],
        rows: [
          ["기능적합성", "기능완전성\n기능정확성\n기능적절성"],
          ["성능효율성", "시간반응성\n자원효율성\n용량성"],
          ["호환성", "공존성\n상호운용성"],
          ["사용성", "적절인지성, 학습성\n운영성, 사용자오류방지성\n사용자인터페이스심미성\n접근성"],
          ["신뢰성", "성숙성\n가용성\n결함허용성\n복구성"],
          ["보안성", "기밀성, 무결성\n부인방지성\n책임성\n인증성"],
          ["유지보수성", "분석성\n변경성\n시험성"],
          ["이식성", "적응성\n설치성\n대체성"],
          ["일반적 요구사항", "제품설명서 요구사항\n사용자취급설명서 요구사항\n품질특성별 정보제공"],
        ],
      },
      {
        caption: "GS시험·인증의 절차",
        headers: ["절차"],
        rows: [
          ["신청 및 접수 → 상담 → 계약 → 품질 시험 및 평가 → 인증 심의 → 적합/부적합"],
        ],
      },
    ],
    notes: ["시험 대상: 소프트웨어 전 분야 — 디지털 콘텐츠, 운영체제, 임베디드, 패키지, 웹관리 도구, 모바일, 컴포넌트, 게임, GIS, 보안용 SW 등"],
  },
  {
    title: "SP 인증",
    course: "SE",
    definition:
      "소프트웨어 기업 및 개발 조직의 프로세스 품질 역량을 심사하여 등급을 부여하는 제도",
    defShort: "SW 기업·개발 조직의 프로세스 품질 역량 심사해 등급을 부여하는 제도",
    lead: "조직 프로세스 역량의 심사, SP 인증",
    features: ["프로세스 품질 심사", "등급제 인증", "SW진흥법 근거"],
    keywords: ["프로세스", "품질", "소프트웨어 진흥법"],
    tables: [
      {
        caption: "소프트웨어 프로세스 품질인증 기준",
        headers: ["영역", "평가 항목", "설명"],
        rows: [
          ["프로젝트 관리", "프로젝트 계획", "목표 일정 자원"],
          ["프로젝트 관리", "프로젝트 통제", "진행 모니터링"],
          ["프로젝트 관리", "협력업체 관리", "의사소통 조율"],
          ["개발 영역", "고객 요구사항\n관리", "수집·분석 체계\n요구사항 관리"],
          ["개발 영역", "분석, 설계\n구현", "요구 기반\n시스템 구현"],
          ["개발 영역", "테스트", "기능 성능 검증"],
          ["지원 영역", "품질보증", "프로세스 보증"],
          ["지원 영역", "형상관리", "변경·버전 관리"],
          ["지원 영역", "측정 및 분석", "정량적 측정"],
          ["조직관리 영역", "조직 프로세스\n관리", "프로세스 정의\n운영·관리 체계"],
          ["조직관리 영역", "구성원 교육", "역량 강화 교육"],
          ["프로세스 개선영역", "조직성과 관리", "성과 관리·평가"],
          ["프로세스 개선영역", "문제 해결", "원인 분석 실행"],
          ["프로세스 개선영역", "프로세스\n개선관리", "지속적 개선\n최적화 수행"],
        ],
      },
      {
        caption: "소프트웨어 프로세스 품질인증 등급",
        headers: ["등급", "설명", "심사 영역"],
        rows: [
          ["1", "품질·비용·납기\n안정 충족 못함\n역량 개선 필요", "없음"],
          ["2", "개별 PJT 차원\n수립·통제\n성공적 수행", "프로젝트 관리\n개발, 지원"],
          ["3", "조직 차원 정의\n문제 해결\n일관 품질 개선", "프로세스 관리\n조직관리\n프로젝트 관리\n개발, 지원"],
        ],
      },
    ],
    notes: ["법적 근거: 소프트웨어 진흥법 제21조, 같은 법 시행령 제18조부터 제22조 및 같은 법 시행규칙 제8조부터 제11조", "체계: 정책기관(과학기술정보통신부 — 제도 정책 수립, 기준/지침 고시) → 인증기관(NIPA — 인증심사, 인증서 발급, 심사원 관리, 심의회 운영, 사후관리) ← 인증신청인"],
  },
  {
    title: "ISO/IEC 25010:2023",
    course: "SE",
    definition:
      "소프트웨어 품질의 특성을 정의하고, 품질 평가의 Metrics를 정의한 국제표준",
    defShort: "SW 품질 특성을 정의하고 품질 평가 Metrics를 정의한 국제표준",
    lead: "SW 품질 특성 국제 표준, ISO/IEC 25010",
    features: ["품질 모델 분리", "안전성 주특성 신설", "사용성→상호작용"],
    keywords: ["기능적합성", "신뢰성", "상호작용 능력", "성능 효율성", "유지 보수성", "유연성", "보안성", "호환성", "안전성"],
    tables: [
      {
        caption: "ISO/IEC 25010:2023의 품질 특성",
        headers: ["주 특성", "부 특성"],
        rows: [
          ["기능 적합성", "기능완전성\n기능정확성\n기능적절성"],
          ["신뢰성", "성숙성, 가용성\n결함허용성, 복구성"],
          ["상호작용 능력", "적절 인지성, 학습성, 운용성\n사용자 오류 방지성\n사용자 참여도, 포괄성\n사용자 지원, 자기 설명성"],
          ["성능 효율성", "시간 반응성, 자원 효율성, 용량성"],
          ["유지 보수성", "모듈성, 재사용성, 분석성\n수정가능성, 시험가능성"],
          ["유연성", "적응성, 확장성, 설치성, 대체성"],
          ["보안성", "기밀성, 무결성, 부인방지\n책임성, 인증성, 내성(저항성)"],
          ["호환성", "공존성, 상호운용성"],
          ["안전성", "운영 제약, 위험 식별, 실패 안전\n위험 경고, 안전한 통합"],
        ],
      },
      {
        caption: "주요 개정 사항",
        headers: ["구분", "설명"],
        rows: [
          ["품질 모델 분리", "제품 품질모델 25010 정의\n사용 품질모델 25019 정의"],
          ["품질 모델 대상 변경", "ICT 제품 포함 대상 범위 확대\n제품 품질모델 모델 명칭 변경"],
          ["주특성 추가", "안전성 신설 주특성 신규 추가\n운영제약·경고 부특성 구성 요소"],
          ["주특성 변경", "상호작용 능력 사용성 명칭 변경\n유연성 이식성 명칭 변경"],
          ["부특성 변경", "접근성 분할 기존 부특성 분리\n포함성·지원성 포용·지원 분리"],
          ["부특성 추가", "보안성 저항성 공격 저항 추가\n유연성 확장성 규모 확장 추가"],
        ],
      },
    ],
  },
  {
    title: "상용소프트웨어 품질성능 평가 시험",
    course: "SE",
    definition:
      "동종의 경쟁 제품간 기능 및 성능 비교 평가를 통해 사용자의 요구사항을 만족하고 품질 및 성능이 우수한 제품을 가려내는 시험",
    defShort: "기능 및 성능 비교 평가로 사용자의 요구사항 만족 제품을 가려내는 시험",
    lead: "동종 경쟁 제품 BMT, 상용SW 품질성능 평가 시험",
    features: ["동종 제품 상대 비교", "법정 의무 시험", "조달 평가 반영"],
    keywords: ["BMT", "소프트웨어 진흥법 제55조", "직접구매"],
    tables: [
      {
        caption: "평가대상",
        headers: ["구분", "요건", "설명"],
        rows: [
          ["평가대상", "직접구매 1억↑\n34종 품목", "경쟁입찰 대상\n별표3 해당 SW"],
          ["평가대상", "지침 제8조 3항\n2억원 이상", "계약 관리감독\n별표3 SW 한정"],
          ["평가대상", "쇼핑몰 등록 SW\nGS CC 인증", "5천 미만 포함\n인증 획득 제품"],
          ["평가대상", "NET NEP\n총액 5천 초과", "신제품 신기술\n합산 금액 기준"],
          ["평가대상", "대상 외 제품\n국가기관 판단", "필요시 시험 수행\n기관 자율 결정"],
          ["제외대상", "비용 대비 효과\n기관장 인정", "시험비 과다 증설\n시험기관과 협의"],
          ["제외대상", "동일 SW 제품\n종전 시험 결과", "기존 실시 이력\n활용 우선 검토"],
          ["제외대상", "정보보호제품\n성능평가 획득", "산업법 제17조\n시험 결과 대체"],
        ],
      },
      {
        caption: "절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. 평가시험 대상 검토", "직접구매 대상 검토 요청\n검토 결과 송부(조달청)\n평가시험 의무화 대상 검토\n평가시험 미실시"],
          ["2. 사전 협의", "사전협의 요청-평가시험 제외\n제외 사유 검토(시험기관)\n사전협의 요청-평가시험 실시\n사전협의 요청-종전 결과 활용"],
          ["3. 평가시험 설계", "요구사항 및 운영 시스템 분석\n평가항목 개발·배점 수립\n평가시험 환경 구성\n실시 계획 수립·환경 구축"],
          ["4. 조달 발주", "제안요청서 평가항목·배점 반영\n사전규격 공개(조달청)\n평가시험 설명회 개최\n입찰공고 게재(조달청)"],
          ["5. 평가시험 의뢰", "참여 의향서 제출(SW공급자)\n평가시험 실시 의뢰(의뢰공문)\n의뢰 접수 및 실시 준비\n평가시험 대상 제품 제출"],
          ["6. 평가시험 실시", "평가시험 실시\n결과서 작성 및 검토\n결과서 교부(국가기관등)\n평가시험 실시 정보 공개"],
          ["7. 평가시험 결과 반영", "결과서 접수 및 점수 환산\n점수 통보(국가기관등→조달청)\n기술성평가 반영\n우선협상대상자 선정"],
        ],
      },
    ],
    notes: ["법적 근거: 소프트웨어 진흥법 제55조, 소프트웨어 품질성능 평가시험 운영에 관한 지침(제7조)"],
  },
  {
    title: "McCabe 회전 복잡도",
    course: "SE",
    definition:
      "제어 흐름 그래프를 통해 회전(사이크로매틱)수를 구하여 SW 복잡도를 계산하는 방법",
    defShort: "제어 흐름 그래프의 사이클로매틱 회전수로 SW 복잡도를 계산하는 방법",
    lead: "제어 흐름 그래프의 회전수, McCabe 회전 복잡도",
    features: ["경로 정량화", "테스트 기준 제공", "규모 미반영"],
    keywords: ["복잡도 = (edge − node + 2) = (폐구간 + 1) = (의사결정 수 + 조건 수 + 1)"],
    tables: [
      {
        caption: "복잡도 계산 공식",
        headers: ["공식", "설명"],
        rows: [
          ["복잡도 = e − n + 2", "e: 간선의 수, n: node의 수"],
          ["복잡도 = 폐구간 + 1", "폐쇄영역(enclosed areas) + 1"],
          ["복잡도 = 의사결정 수 + 조건 수 + 1", "의사결정 수(각각이 하나)\nif-then-else, do while, case\n조건 수: and, or, not 등"],
        ],
      },
      {
        caption: "복잡도 분석",
        headers: ["복잡도", "분석 내용"],
        rows: [
          ["5 이하", "간단한 프로그램"],
          ["5~10", "구조적이며 안정된 프로그램"],
          ["20 이상", "문제 자체가 매우 복잡\n구조가 필요 이상으로 복잡"],
        ],
      },
    ],
    notes: ["예시: V(G) = 3-3+2 = 2, V(G) = 9-8+2 = 3, V(G) = 20-13+2 = 9", "예제 코드: While + if + case 0 + case 1 = 4+1 = 5 (switch·default는 카운팅 X) / 오른쪽의 폐쇄구간 + 1 = 4+1 = 5"],
  },
  {
    title: "FTA (Fault Tree Analysis)",
    course: "SE",
    definition:
      "위험의 원인을 트리 다이어그램을 통해서 찾아 나가는 연역적이고 정성/정량적으로 분석하는 기법",
    defShort: "위험 원인을 트리 다이어그램으로 찾는 연역적, 정성/정량적 분석 기법",
    lead:
      "원인 추적의 연역적 분석, FTA",
    features: ["연역적 하향 분석", "논리 게이트 연결", "정성·정량 병행"],
    keywords: ["Top-down", "연역적 기법", "트리 다이어그램"],
    tables: [
      {
        caption: "프로세스",
        headers: ["단계", "프로세스", "설명"],
        rows: [
          ["Step 1", "Top 이벤트 설정", "위험도 고려, 해석할 Top 이벤트"],
          ["Step 2", "특성 파악", "시스템 공정·작업 파악\n위험 관련 상세 조사"],
          ["Step 3", "FT 작성", "Fault Tree 다이어그램 작성"],
          ["Step 4", "FT구조분석(정성적)", "Top이벤트 영향 기본 사상 파악"],
          ["Step 5", "FT 정량화", "고장율·에러 정리, 발생확률 조사"],
          ["Step 6", "해석 결과의 평가", "위험 수준 파악 및 대책 수립"],
        ],
      },
      {
        caption: "표기법",
        headers: ["FTA 기호", "구분", "설명"],
        rows: [
          ["사상 기호", "사상(Event)", "개개의 사상, Event\n고장, 불량, 원치 않는 이벤트"],
          ["사상 기호", "기본사상(Basic Event)", "최하위 사상, 더 이상 전개 불가"],
          ["사상 기호", "전입(In)", "동일 FT 내 타 부분에서 전입"],
          ["사상 기호", "전출(Out)", "동일 FT 내 타 부분으로 전출"],
          ["사상 기호", "부전개 사상", "논리 게이트 적용 제약/조건"],
          ["게이트 기호", "AND 게이트", "A, B 동시 발생 시 상위사상 발생"],
          ["게이트 기호", "OR 게이트", "A, B 중 하나만 발생해도 상위사상"],
          ["게이트 기호", "Priority AND 게이트", "A가 B보다 먼저 발생 시 상위사상"],
          ["게이트 기호", "Exclusive OR 게이트", "A, B 중 하나만 발생해야 상위사상"],
        ],
      },
    ],
    notes: ["개념도: TOP 사건 설정 → 정상사상과 1차 원인과의 관계를 논리 게이트(Gate)로 연결 → 정상사상에 대한 1차 원인을 분석 → 더 이상 분할할 수 없는 기본사상(Basic Event)까지 반복 분석"],
  },
  {
    title: "FMEA (Failure Mode and Effects Analysis)",
    course: "SE",
    definition:
      "시스템의 고장 요인을 도출하고 영향도에 따른 우선순위 등급을 결정하여 등급에 맞는 사전 대응방법 수행하는 귀납적 분석기법",
    defShort: "고장 요인 도출, 영향도에 따른 우선순위 등급 결정하는 귀납적 분석기법",
    lead:
      "영향도 기반 귀납적 분석, FMEA",
    features: ["귀납적 Bottom-up", "RPN 정량 평가", "사전 대응 중심"],
    keywords: ["Bottom-up", "RPN = 심각도 x 발생도 x 검출도"],
    tables: [
      {
        caption: "고장영향 평가 방법 — RPN 3축",
        headers: ["항목", "설명"],
        rows: [
          ["심각도", "S 척도 1~10 10일수록 심각\n설계적 문제 영향 심각 정도"],
          ["발생도", "O 척도 1~10 10일수록 빈발\n공정기술 문제 발생 빈도 수준"],
          ["검출도", "D 척도 1~10 높을수록 미검출\n관리력 문제 검출 가능성 수준"],
        ],
      },
      {
        caption: "FMEA 유형",
        headers: ["구분/유형", "설계 FMEA", "공정 FMEA", "시스템 FMEA"],
        rows: [
          ["대상", "제품(시스템)", "공정(작업)", "설비(생산라인)"],
          ["목적", "설계·제품 결함\n분석·대책", "제조·공정 결함\n분석·대책", "설비 설계·기능\n결함 분석 대책"],
          ["시기", "구상~최종설계", "공정설계~생산", "설비설계~생산"],
          ["대상 요소", "제품 구성요소", "공정·작업·재료", "설비 구성요소"],
        ],
      },
      {
        caption: "FTA, FMEA, HAZOP 비교",
        headers: ["항목", "FTA", "FMEA", "HAZOP"],
        rows: [
          ["목적", "원인 분석", "영향 분석", "위험 식별"],
          ["분석 특징", "정성/정량적", "정성적", "정성적"],
          ["분석 기법", "연역적\nTop-down", "귀납적\nBottom-up", "귀납적\nBottom-up"],
          ["적용 시점", "설계 단계", "요구분석·검증", "상세 설계\n설계 완료"],
        ],
      },
    ],
    notes: ["평가 방법: 심각도(X좌표 — 중요도)·발생도(Y좌표)·검출도(Z좌표)의 3차원에서 값이 클수록 높은 위험"],
  },
  {
    title: "HAZOP (Hazard and Operability Study)",
    course: "SE",
    definition:
      "대상에 관련된 전문가들이 모여 공정변수와 가이드워드의 조합을 통해 이탈의 원인 및 영향을 분석하는 안전성 분석 기법",
    defShort: "전문가가 공정변수·가이드워드 조합으로 이탈 원인 및 영향 분석 기법",
    lead:
      "설계 의도 이탈의 식별, HAZOP",
    features: ["가이드워드 조합", "전문가 경험 기반", "이탈 원인 분석"],
    keywords: ["경험기반", "이탈 = 공정변수 * 가이드워드", "공정(특정변수, 일반변수)", "가이드워드(7가지) : 없음/증가/감소/반대/부가/부분/기타"],
    tables: [
      {
        caption: "수행 절차",
        headers: ["절차", "설명"],
        rows: [
          ["목적, 범위 설정", "분석 목적,\n검토범위 설정"],
          ["분석 팀 구성", "관련 전문가 팀\n구성(리더,\n팀원)"],
          ["예비 조사", "자료 수집, 분석\n절차 수립"],
          ["토론 및 검토", "Study Node, 공정변수,\n가이드워드 조합\n브레인스토밍"],
          ["분석 결과 기록", "이탈 원인, 결과\n개선 권고사항\n기록"],
        ],
      },
      {
        caption: "평가 방식",
        headers: ["구분", "설명"],
        rows: [
          ["평가 방식", "이탈 = 공정변수 ×\n가이드워드"],
          ["이탈", "설계\n의도(정상운전조건)에서\n벗어난 상태"],
          ["공정변수 — 특정변수", "가이드워드와\n조합되어 이탈\n발생하는 변수"],
          ["공정변수 — 일반변수", "단독으로 이탈\n발생하는 변수"],
          ["가이드워드 — 없음(NO OR NOT)", "설계의도에\n완전히 반하여\n변수의 양이 없는\n상태"],
          ["가이드워드 — 증가", "변수가 양적으로\n증가되는 상태"],
          ["가이드워드 — 감소", "변수가 양적으로\n감소되는 상태"],
          ["가이드워드 — 반대", "설계 의도와\n정반대로\n나타나는 상태"],
          ["가이드워드 — 부가", "설계의도 외에\n다른 변수가\n부가되는 상태\n(오염)"],
          ["가이드워드 — 부분", "설계의도대로\n완전히\n이루어지지 않는\n상태"],
          ["가이드워드 — 기타", "설계의도대로\n설치되지 않거나\n운전 유지되지\n않는 상태"],
        ],
      },
    ],
    notes: ["적용 시기: 요구사항 분석단계에서 HAZOP을 통해 안전성 관련 중요인자 및 안전성 요구사항 도출 → 설계단계에서 FTA를 통해 안전성을 강화 → FMEA의 분석결과를 테스트 단계의 안전성 분석에 활용"],
  },
  {
    title: "ETA (Event Tree Analysis)",
    course: "SE",
    definition:
      "초기 이벤트를 비롯한 모든 이벤트들의 발생 가능성을 확률로 계산하여 최종 시나리오의 발생 확률을 도출하는 정량적 위험 분석기법",
    defShort: "모든 이벤트 발생 가능성을 확률 계산해 최종 시나리오 발생 확률 도출 기법",
    lead:
      "시나리오 확률의 정량 분석, ETA",
    features: ["상향식 분석", "성공/실패 분기", "정량적 확률 산출"],
    keywords: ["[범위초 트결경]", "이벤트 기반", "Event Tree", "Tree 분석"],
    tables: [
      {
        caption: "분석 절차 [범위초 트결경]",
        headers: ["절차", "설명"],
        rows: [
          ["1) 분석 대상 및 범위 정의", "명세서·설계서 대상·범위 정의"],
          ["2) 시스템 위험 또는 사고 정의", "위험·사고 정의 시스템 수준 정의"],
          ["3) 초기 이벤트 정의", "초기 이벤트 정의 트리 시작점 배치"],
          ["4) Event Tree 전개", "중간 이벤트 도출 초기→최종 결과\n성공/실패 분기 트리 전개 완성"],
          ["5) 결과 리스크 파악", "발생 가능성 계산 시나리오별 평가"],
          ["6) 위험 경감 대책 수립", "안전조치 도출 예방·개선 계획"],
        ],
      },
      {
        caption: "위험관계 분석 기법 관계",
        headers: ["기법", "추론 방향", "설명"],
        rows: [
          ["FMEA", "귀납적 추론", "원인→가능 영향"],
          ["FTA", "연역적 추론", "영향→가능 원인"],
          ["HAZOP·STPA", "탐색적 추론", "사건↔원인 영향"],
        ],
      },
    ],
    notes: ["개념도: 초기 이벤트 → 중간 이벤트 1·2·3의 성공/실패 분기 → 결과 1~5 (사고 시나리오)", "ETA는 원인(초기 이벤트)이 어떻게 파급·전이되어 결과(최종 사고 또는 시스템 위험)를 유발하는지 분석하는 방법이기 때문에 보편적으로 상향식 기법으로 분류되지만 최종 사고 또는 시스템 위험을 먼저 정의하기 때문에 하향식 기법으로 분류되기도 함", "ETA 기법을 이용하면 초기이벤트가 어떤 경로에 의해 사고로 이어질 수 있는지 그 사고에 발생 경위를 파악하기 용이"],
  },
  {
    title: "STPA (System-Theoretic Process Analysis)",
    course: "SE",
    definition:
      "STAMP를 기반으로 하는 위험분석 기법으로, 시스템의 각 요소간의 상호작용이 시스템의 안전성에 위협가능한지 분석하는 기법",
    defShort: "시스템의 각 요소간 상호작용이 시스템 안전성에 위협가능한지 분석 기법",
    lead: "상호작용 기반 안전 분석, STPA",
    features: ["STAMP 기반", "상호작용 중심 분석", "제어 구조 관점"],
    keywords: ["STAMP", "요소간 상호작용", "사고 및 위험정의", "Control Structure 도식화", "Unsafe Control Action 도출", "원인 시나리오 도출"],
    tables: [
      {
        caption: "위험 분석 절차 (4단계)",
        headers: ["위험분석 절차", "설명"],
        rows: [
          ["1단계: 사고 및 위험 정의", "사고·시스템 수준 위험 정의\n시스템 수준 안전 제약사항 도출\n사고 도출→위험 정의→제약 변환"],
          ["2단계: Control Structure 도식화", "제어 관계 개체(컴포넌트) 식별\n제어명령·피드백·프로세스 모델"],
          ["3단계: Unsafe Control Actions 도출", "위험 유발 UCA 4가지 유형 도출\nCA 부재·부적절한 CA 제공\nCA 제공 시간·순서·지속시간\nUCA: 위험 유발 불안전 CA 형태"],
          ["4단계: 원인 시나리오(Causal Scenario) 도출", "UCA 발생 원인 도출\nController의 UCA 제공 원인\nCA 부적절 수행·미수행 원인\n원인 토대로 시나리오 작성"],
        ],
      },
      {
        caption: "UCA 4가지 유형",
        headers: ["유형"],
        rows: [
          ["① CA is not provided (Control Action의 부재)"],
          ["② UCA is provided (부적절한 Control Action 제공)"],
          ["③ CA is too early, too late, out of sequence (제공 시간·순서 문제)"],
          ["④ CA is stopped too soon, applied too long (지속시간 문제)"],
        ],
      },
    ],
  },
  {
    title: "SW 규모산정",
    course: "SE",
    definition:
      "소프트웨어 규모파악(양적 크기, 질적 수준)통한 소요 공수와 투입 자원 및 소요기간 파악하여 실행 가능한 계획 수립하기 위한 비용 산정하는 과정",
    defShort: "공수·자원·기간 파악해 실행 가능한 계획 수립하기 위한 비용 산정 과정",
    lead:
      "공수와 기간 산정의 기초, SW 규모산정",
    features: ["양적·질적 규모", "계획 수립 근거", "수치화 산정"],
    keywords: ["하향식 산정", "상향식 산정", "수학적 산정"],
    tables: [
      {
        caption: "규모 산정 방법",
        headers: ["산정방법", "기법", "내용"],
        rows: [
          ["하향식(Top Down)", "전문가 감정\n델파이 방식", "경험적 단언\n개발자 합의"],
          ["상향식(Bottom Up)", "LOC 기법\nMan/Month", "업무분류구조\n요소별 독립 산정"],
          ["수학적", "기능점수(FP)\nCOCOMO", "비용산정 자동화\n수치화로 산정"],
        ],
      },
      {
        caption: "규모 산정 시 고려사항",
        headers: ["구분", "항목", "내용"],
        rows: [
          ["프로젝트 요소", "문제의 복잡도", "난이도·유형·언어"],
          ["프로젝트 요소", "시스템 크기", "트랜잭션·연계"],
          ["프로젝트 요소", "시스템 신뢰도", "정확·견고·완전·일관"],
          ["자원 요소", "인적 자원", "관리자·개발자·지원체계"],
          ["자원 요소", "하드웨어 자원", "개발·운영 장비"],
          ["자원 요소", "소프트웨어 자원", "개발지원 도구\n테스트 툴"],
          ["생산성 요소", "개발자 능력", "경험·전문지식"],
          ["생산성 요소", "고객 능력", "업무 요건 지식"],
          ["생산성 요소", "개발 방법론", "최신기법·관리"],
        ],
      },
      {
        caption: "규모산정 방법 비교",
        headers: ["비교", "하향식(Top Down)", "상향식(Bottom UP)"],
        rows: [
          ["특징", "전체 시스템 차원\n유사 과거 비용", "모듈별 우선 산정\n합산 전체비용"],
          ["장점", "간편·신뢰감", "객관성 부여"],
          ["단점", "비과학적 낙관적", "세부 난이도 배제"],
          ["산정방식", "그룹 산정\n전문가 감정", "LOC 기능점수\nCOCOMO"],
        ],
      },
    ],
  },
  {
    title: "Function Point",
    course: "SE",
    definition:
      "정보처리 규모와 기능의 복잡도 요인에 의거한 SW 규모 산정 방식",
    defShort: "정보처리 규모와 기능의 복잡도 요인에 의거해 SW 규모를 산정하는 방식",
    lead:
      "기능 단위의 규모 측정, Function Point",
    features: ["사용자 관점 측정", "개발 언어 독립", "ISO 14143-1 표준"],
    keywords: ["트랜잭션 유형(EI, EO, EQ)", "데이터 기능 유형(ILF, EIF)", "ISO 14143-1"],
    tables: [
      {
        caption: "산정 절차 — FP 결과값 = 미조정 기능점수 × 조정 인자 계산",
        headers: ["절차"],
        rows: [
          ["1. 측정 유형 결정 → 2. 측정 범위와 어플리케이션 경계 식별 → 3. 데이터 기능 측정 · 4. 트랜잭션 기능 측정 → 5. 미조정 기능점수 결정 → 6. 조정인자 결정 → 7. 조정 기능점수 결정"],
        ],
      },
      {
        caption: "상세 내역",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["측정 유형 결정", "개발 프로젝트", "SI 프로젝트 종료 후 인도되는 SW"],
          ["측정 유형 결정", "개선 프로젝트", "SW 추가·수정·삭제 부분 비용 산정"],
          ["측정 유형 결정", "어플리케이션", "사용 중인 SW 현장 기능 측정\n설치된 기능 점수 측정"],
          ["측정범위와 어플리케이션 경계 식별", "범위결정", "개별 변경할 SW 전체 범위 결정"],
          ["측정범위와 어플리케이션 경계 식별", "경계식별", "각 어플리케이션의 경계 분류"],
          ["데이터 기능 유형 식별", "내부 논리 파일(ILF)", "논리적으로 연관된 데이터 그룹\n경계 내 유지 Data·제어정보\n예: 내부 DB"],
          ["데이터 기능 유형 식별", "외부 연계 파일(EIF)", "측정 어플리케이션 외부에서 참조\n경계 밖 유지 Data·제어정보\n예: 외부 DB"],
          ["트랜잭션 기능 유형 식별", "외부입력(EI)", "경계 안 데이터·제어정보 처리"],
          ["트랜잭션 기능 유형 식별", "외부출력(EO)", "경계 밖으로 조회\n파생 데이터 생성 처리 로직 포함\n계산 처리된 후 외부로 나감"],
          ["트랜잭션 기능 유형 식별", "외부조회(EQ)", "파생 데이터 생성 처리 로직 미포함\n계산 처리 없이 단순 데이터 출력"],
        ],
      },
      {
        caption: "조정인자 14개 (난이도에 따라 0~5점의 가중치 부여)",
        headers: ["조정인자"],
        rows: [
          ["1. 데이터 통신(Data Communications)"],
          ["2. 분산 데이터 처리(Distributed Data Processing)"],
          ["3. 성능(Performance)"],
          ["4. 사용환경(Heavily Used Configuration)"],
          ["5. 처리율(Transaction Rate)"],
          ["6. 온라인 데이터 입력(Online Data Entry)"],
          ["7. 최종사용자 편리성(End-Used Efficiency)"],
          ["8. 온라인 갱신(Online Update)"],
          ["9. 처리복잡성(Complex Processing)"],
          ["10. 재사용성(Reusability)"],
          ["11. 설치용이성(Installation Ease)"],
          ["12. 운영용이성(Operational Ease)"],
          ["13. 복수 사이트(Multiple Sites)"],
          ["14. 변경 용이성(Facilitate Change)"],
        ],
      },
    ],
  },
  {
    title: "SW 사업대가 ('25년 개정판)",
    course: "SE",
    definition:
      "S/W 대가산정 가이드는 예산수립, 사업 발주, 계약 시 적정대가를 산정하기 위한 기준을 제공 (1FP = 605,784원)",
    defShort: "예산수립·사업 발주·계약 시 적정대가 산정 기준 제공 대가산정 가이드",
    lead:
      "적정 대가 산정의 기준, SW 사업대가",
    features: ["적정대가 보장", "기능점수 기반", "사업 단계별 적용"],
    keywords: ["구현단계(사기전후직소)", "기획단계", "ISP/BPR", "EA/ITA", "ISMP"],
    tables: [
      {
        caption: "SW사업 기획 단계 대가 산정 방법",
        headers: ["구분", "산정 방법", "설명"],
        rows: [
          ["ISP/ISP/BPR", "컨설팅 업무량 방식", "업무량 = 업무 가중치×난이도\n대가 = 업무량×단가+직접경비"],
          ["EA/ITA", "컨설팅 업무량 방식", "업무량 = EA/ITA 가중치×난이도\n대가 = 공수×업무량+직접경비"],
          ["ISP, ISP/BPR, EA/ITA, ISMP, 정보보안 컨설팅", "투입 공수 방식", "직접 인건비 = 투입 공수×평균임금\n제경비 = 직접 인건비의 144~154%\n기술료 = 인건비+제경비의 20~40%\n대가 = 세 항목 합+직접경비"],
        ],
      },
      {
        caption: "기능점수 방식에 의한 소프트웨어 개발비 대가산정 절차 [사기전후직소]",
        headers: ["절차", "산출물", "주요내용"],
        rows: [
          ["사전준비", "기능 요구사항\n규모산정 방법", "개발 업무 정의\n정통법·간이법"],
          ["개발대상 SW 기능점수 산정", "SW 기능점수", "기능 식별\n복잡도 고려 산정"],
          ["보정 전 개발원가 산정", "보정 전 개발원가", "기능점수×기능점수당단가"],
          ["보정 후 개발원가 산정", "보정 후 개발원가", "규모·연계복잡성\n성능·호환성·보안\n원가×보정계수"],
          ["직접경비 및 이윤 산정", "직접경비, 이윤", "관련 직접경비\n이윤 25% 이내"],
          ["소프트웨어 개발비 산정", "소프트웨어개발비", "개발원가+직접경비+이윤"],
        ],
      },
    ],
    notes: ["단계 구성: 기획 단계(정보전략계획 ISP, 정보전략계획 및 업무재설계 ISP/BPR, 전사적아키텍처 EA/ITA, 정보시스템 마스터플랜 ISMP, 정보보안컨설팅) → 구현 단계(소프트웨어 개발) → 운영 단계(소프트웨어 유지관리, 소프트웨어 운영, 소프트웨어 재개발)"],
  },
  {
    title: "난독화",
    course: "SE",
    definition:
      "프로그램 코드의 일부 또는 전체를 변경하는 방법 중 하나로, 코드의 가독성을 낮춰 역공학에 대한 대비책을 제공하는 방법",
    defShort: "코드 일부나 전체를 변경해 코드의 가독성을 낮춰 역공학 대비책 제공 방법",
    lead:
      "역공학 대비의 코드 변환, 난독화",
    features: ["가독성 저하", "역공학 대비", "성능 영향 차등"],
    keywords: ["[구데집제예]", "구획 난독화", "데이터 난독화", "집합 난독화", "제어 난독화", "예방 난독화"],
    tables: [
      {
        caption: "난독화 기술 분류 [구데집제예]",
        headers: ["구분", "설명", "세부분류"],
        rows: [
          ["구획 난독화(layout obfuscation)", "세부 요소 변화\n복원해도 훼손", "형식변화·주석제거\n식별자손상"],
          ["데이터 난독화(data obfuscation)", "변수 분할·병합\n읽기 어렵게", "Storage, Aggregation\nOrdering, Encoding"],
          ["집합 난독화(aggregation obfuscation)", "배열 변환\n클래스 분할", "자료순서변환\n클래스분할"],
          ["제어 난독화(Control obfuscation)", "제어 복잡화\n문장 단위 조절", "Aggregation\nOrdering, Computation"],
          ["예방 난독화(Preventive obfuscation)", "역난독화 방법\n봉쇄", "Targeted, Inherent"],
        ],
      },
      {
        caption: "난독화 기술 비교",
        headers: ["구분", "Layout", "Data", "Control", "Preventive"],
        rows: [
          ["특징", "세부 요소 변화\n복원 시 훼손", "처리 변수 변환\n읽기 어렵게", "문장 단위 조절\n불명확성 증대", "역난독화 대응\n구체화 시 사용"],
          ["장점", "성능저하 없음", "자료의 보호", "로직의 보호", "역공학 방해"],
          ["단점", "로직 보호 불가", "성능의 저하", "성능의 저하", "성능의 저하"],
          ["예시", "GetPayroll()\n→ a()", "t=\"Net\";\n→ t[1]='N';", "for(i=0;i<100;i++)\n→ for(i=100;i>0;i--)", "breakpoint 탐지\nCRC·디버거 검출"],
        ],
      },
    ],
  },
  {
    title: "SBOM",
    course: "SE",
    definition:
      "소프트웨어 컴포넌트 및 구성 요소를 식별할 수 있는 메타데이터와 저작권 및 라이선스 등으로 소프트웨어 콘텐츠에 대한 정보를 포함하는 공식 SW 자재 명세서",
    defShort: "메타데이터와 저작권·라이선스 정보를 포함하는 공식 SW 자재 명세서",
    lead:
      "SW 공급망의 구성 명세, SBOM",
    features: ["공식 자재 명세서", "구성요소 식별", "표준 포맷 기반"],
    keywords: ["Author Name", "Timestamp", "Version String", "SPDX", "CycloneDX", "SWID"],
    tables: [
      {
        caption: "기술 요소",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["Baseline Attributes", "Author Name", "SW 작성자 정보"],
          ["Baseline Attributes", "Timestamp", "SBOM 마지막 업데이트 날짜·시간\n(ISO 8601)"],
          ["Baseline Attributes", "Supplier Name", "SW 공급업체 이름 또는 기타 식별자"],
          ["Baseline Attributes", "Component Name", "SW 구성요소 이름 또는 식별자"],
          ["Baseline Attributes", "Version String", "SW Version 정보\n(Semantic Versioning)"],
          ["Baseline Attributes", "Component Hash", "컴포넌트 해시 값 통한 무결성 증빙"],
          ["Baseline Attributes", "Unique Identifier", "고유 Namespace 및 식별자 생성"],
          ["Baseline Attributes", "Relationship", "구성 요소 간 종속성·연관 관계"],
          ["Formats", "SPDX", "Software Package Data Exchange\n리눅스 재단 라이선스 교환 표준"],
          ["Formats", "CycloneDX", "OWASP 재단 공급망 구성요소 보안\n경량 SBOM 표준"],
          ["Formats", "SWID", "Software Identification\nSW 정보 Tag 생성\n오픈소스 SW 인벤토리 지원"],
        ],
      },
    ],
    notes: ["개념도 예: Acme Application V1.1 ← Bingo Buffer V2.2 · Bob Browser V2.1 ← Carol Compression V3.1 (Included in 관계) — Component Name·Supplier·Version·Author·Hash·UID·Relationship(Primary/Included in)을 표로 관리"],
  },
  {
    title: "정보시스템 운영/유지보수 감리",
    course: "SE",
    definition:
      "구축 완료 후 인도된 정보시스템에 대한 변경, 개선, 모니터링 등 정보시스템의 안정적인 운영과 성능을 지속적으로 보장하고, 필요에 따라 효율적으로 개선하는 과정을 점검",
    defShort: "인도된 정보시스템의 안정적인 운영과 성능을 지속적으로 보장 과정 점검",
    lead:
      "운영 단계의 품질 점검, 운영/유지보수 감리",
    features: ["인도 후 단계 점검", "감리대상별 구분", "운영 안정성 중심"],
    keywords: ["개발 소프트웨어", "상용 소프트웨어", "인프라", "배포관리", "장애관리", "보안", "성능", "패치", "백업"],
    tables: [
      {
        caption: "운영 감리의 감리대상별 점검 분야",
        headers: ["감리대상", "점검분야"],
        rows: [
          ["개발 소프트웨어(DS)", "릴리즈 및 배포관리\n테스트 지원\n장애관리"],
          ["인프라(IF)", "신규·변경 서비스 기획, 구현 지원\n서비스 수준관리\n서비스 보고\n서비스 연속성 및 가용성 관리"],
          ["인프라(IF)", "용량관리\n정보보안관리\n비즈니스 관계 관리\n공급자 관리"],
          ["인프라(IF)", "인시던트 및 서비스 요청 관리\n문제 관리\n구성관리"],
          ["인프라(IF)", "변경 및 릴리즈 관리\n운영상태관리"],
        ],
      },
      {
        caption: "유지보수 감리의 감리대상별 점검 분야",
        headers: ["감리대상", "점검분야"],
        rows: [
          ["개발 소프트웨어(DS)", "응용서비스 모니터링\n응용서비스장애처리\n사용자지원\n성능관리"],
          ["개발 소프트웨어(DS)", "정기/비정기점검\n시스템 테스트 지원\n장애관리\n유지보수 계획"],
          ["개발 소프트웨어(DS)", "유지보수 표준 및 절차\n요구사항관리\n유지보수 이행(CSR 처리)"],
          ["개발 소프트웨어(DS)", "구성관리\n릴리즈 및 배포관리(이관)"],
          ["상용 소프트웨어(CS)", "유지보수 계획\n유지보수 표준 및 절차\n업그레이드 및 패치\n이전 및 재설치"],
          ["상용 소프트웨어(CS)", "일상지원\n긴급/장애처리\n예방점검\n운영자 교육"],
          ["상용 소프트웨어(CS)", "사용자 교육\n보안 정책 및 계획 수립\n보안점검 및 예방 활동\n보안 조치 및 기술지원"],
          ["인프라(IF)", "OS 업그레이드 및 패치\nHW 업그레이드\n예방 점검(일상·정기·비정기)\n긴급/장애처리"],
          ["인프라(IF)", "통합자원할당 및 회수\n운영자교육\n기술이전\n부품지원"],
          ["인프라(IF)", "운영상태관리\n이전 및 재설치"],
        ],
      },
    ],
    notes: ["개념도: 정보시스템 구축단계(단계별 감리 — 계획에 맞게 설계·개발·테스트가 제대로 이루어지고 있는지 점검, 요구사항 충족여부·일정 및 범위관리·품질관리 등) ↔ 운영 및 유지보수 단계(운영 및 유지보수 감리 — 시스템이 안정적이고 효율적으로 운영 및 개선 되는지 점검, 운영 안정성·성능 유지·보안·백업 및 복구 등)"],
  },
  {
    title: "지능정보기술 감리 실무 가이드 - 클라우드 감리",
    course: "SE",
    definition:
      "**클라우드 기반 정보화 사업에 대한 감리 수행 시 필요한 개념과 취약점, 클라우드 정보화 사업유형에 따른 감리 점검항목을 제시**하기 위한 실무 지침",
    defShort: "클라우드 감리 개념·취약점·사업유형별 점검항목을 제시한 실무 지침",
    lead: "클라우드 사업 감리 점검 기준, 클라우드 감리",
    features: ["클라우드 특화", "사업유형별 차등", "취약점 중심 점검"],
    keywords: ["클라우드 계획수립", "클라우드 서비스 활용사업", "클라우드 전환사업"],
    tables: [
      {
        caption: "클라우드 특성으로 인한 취약점",
        headers: ["취약점"],
        rows: [
          ["1) 클라우스 서비스 모델 유형"],
          ["2) 기존 IT 운영 관리체계 수준"],
          ["3) 현행 업무 위험 수용 수준"],
          ["4) 클라우드 적재 데이터의 통합적 가치"],
          ["5) 클라우드 적재 데이터의 내부보안등급"],
          ["6) 클라우드 공유 데이터의 준거성 의무"],
          ["7) 클라우드 서비스 제공자 위험"],
        ],
      },
      {
        caption: "점검단계",
        headers: ["점검 단계", "하위영역"],
        rows: [
          ["클라우드 계획수립", "현황 분석 및 전략 수립\n개선 모델 및 실행 계획 수립"],
          ["클라우드 서비스 활용사업", "클라우드 서비스\n클라우드 서비스 요건정의\n클라우드 서비스 전환\n클라우드 서비스 운영"],
          ["클라우드 전환사업", "클라우드 전환 계획수립 및 준비\n클라우드 전환\n서비스 안정화"],
        ],
      },
    ],
    notes: [
      "사업 유형은 세 축으로 나눈다 — 클라우드 모델(G-Cloud·자체 클라우드·민간 클라우드), 개발 단계(기획·구축·운영/전환), 클라우드 유형(IaaS·PaaS·SaaS).",
    ],
  },
  {
    title: "지능정보기술 감리 실무 가이드 - 빅데이터 감리",
    course: "SE",
    definition:
      "**빅데이터를 구축 및 분석하는 정보화 사업 감리 수행 시 필요한 사업 단계별 감리 점검항목을 제시**하기 위한 실무 지침",
    defShort: "빅데이터 구축·분석 정보화 사업 단계별 감리 점검항목 제시한 실무 지침",
    lead: "빅데이터 사업 단계별 감리 기준, 빅데이터 감리",
    features: ["빅데이터 사업 특화", "사업 단계별 점검", "데이터 생애주기"],
    keywords: ["분석 단계", "설계 단계", "구현(구축) 단계", "운영 단계"],
    tables: [
      {
        caption: "점검 단계별 영역과 핵심",
        headers: ["점검 단계", "영역", "핵심"],
        rows: [
          ["분석단계", "응용시스템\n데이터", "요구사항 도출\n데이터 확보 검토\n운영 환경 이해"],
          ["설계단계", "응용시스템\n데이터\n시스템", "수집·정제·저장\n분석모델·시각화\n데이터 표준화\n시스템구성·보안"],
          ["구현(구축)단계", "응용시스템", "생애주기 관리\n수집·변환 작동\n시각화·로그검증"],
          ["운영단계", "관리체계", "거버넌스 확인"],
        ],
      },
      {
        caption: "단계별 하위영역 점검항목",
        headers: ["구분", "영역", "설명"],
        rows: [
          ["분석단계", "응용시스템", "서비스 요구사항 정의 여부"],
          ["분석단계", "데이터", "데이터 셋 수집 가능성·사용성\n데이터 셋 활용 서비스 확보 여부"],
          ["설계단계", "응용시스템", "수집·정제 체계 적정 설계 여부\n저장 체계 적정 설계 여부\n데이터 분석모델 설계\n데이터 시각화 설계"],
          ["설계단계", "데이터", "데이터 표준화 및 융합"],
          ["설계단계", "시스템", "시스템간 연계 설계"],
          ["구현(구축)단계", "응용시스템", "데이터 분석 및 운영"],
          ["운영단계", "관리체계", "운영관리"],
        ],
      },
    ],
    notes: [
      "단계별 핵심은 분석(서비스·기능 요구사항 도출, 데이터 확보 및 타당성 검토, 운영 환경 이해), 설계(수집·정제 및 저장 체계 설계, 분석모델 및 시각화 설계, 데이터 표준화, 시스템 구성 및 보안), 구현(데이터 생애주기 관리, 수집 및 변환 작동 여부, 시각화 및 로그 시스템 검증), 운영(거버넌스 체계 확인)이다.",
    ],
  },
  {
    title: "정보시스템 감리 의무 대상과 관점별 점검 기준",
    course: "SE",
    definition:
      "정보시스템 효율성 향상과 안전성 확보 위해 제3자적 관점에서 구축 사항을 종합적으로 점검, 개선하는 활동",
    defShort: "효율성·안전성 위한 제3자적 관점의 구축 사항 종합적 점검·개선 활동",
    lead:
      "제3자 관점의 점검 활동, 정보시스템 감리",
    features: ["제3자적 관점", "법정 의무 대상", "종합적 점검"],
    keywords: ["3자적 관점", "대국민 서비스", "공동 행정 서비스", "5억 이상", "기관장의 필요성 인정", "절차", "산출물", "성과"],
    tables: [
      {
        caption: "의무 대상",
        headers: ["영역", "구분", "의무대상"],
        rows: [
          ["정보화 사업", "정보시스템 특성", "대국민 행정민원\n여러 기관 공동"],
          ["정보화 사업", "사업비 규모", "5억 원 이상"],
          ["정보화 사업", "기관장 판단", "감리 필요 인정"],
          ["행정/공공 기관", "행정기관", "중앙행정기관\n소속기관 지자체"],
          ["행정/공공 기관", "공공기관", "공운법 4조 기관\n지방공사·공단\n특수법인·학교\n대통령령 기관"],
        ],
      },
      {
        caption: "정보시스템 관점별 점검 기준 [성산절]",
        headers: ["감리 관점", "점검 기준"],
        rows: [
          ["성과", "실현성, 충족성"],
          ["산출물", "기능성, 무결성,\n편의성, 안전성,\n보안성, 효율성,\n준거성"],
          ["절차", "절차 적정성,\n준수성"],
        ],
      },
      {
        caption: "정보시스템 3단계 감리 수행 절차",
        headers: ["구분", "요구정의단계", "설계단계", "종료단계"],
        rows: [
          ["수행 절차", "A00 예비조사", "B00 현장감리", "C00 조치확인"],
          ["산출물", "001.감리계획서", "002.감리수행결과보고서", "003.시정조치확인보고서"],
        ],
      },
    ],
  },
  {
    title: "공통감리 절차",
    course: "SE",
    definition:
      "정보시스템 개발사업, EA, ISP수립, DB구축 등 모든 유형의 정보화 사업에 공통적으로 적용되는 감리절차",
    defShort: "EA·ISP 등 모든 유형 정보화 사업에 공통적으로 적용되는 감리절차",
    lead: "전 정보화 사업 공통 적용, 공통감리 절차",
    features: ["사업 유형 무관 적용", "현장감리 중심", "시정조치 사후 확인"],
    keywords: ["[예현조]", "예비조사", "현장감리", "조치 확인", "준실감", "감착감보종보", "준시작보"],
    tables: [
      {
        caption: "절차 [예현조]",
        headers: ["절차", "세부절차", "산출물"],
        rows: [
          ["A00. 예비조사", "예비조사 준비\n예비조사 실시\n감리계획서 작성", "감리계획서"],
          ["B00. 현장감리", "감리시작\n착수회의\n감리수행", "감리수행결과보고서"],
          ["B00. 현장감리", "보고서(안) 검토\n종료회의\n보고서 확정 통보", "감리수행결과보고서"],
          ["C00. 조치 확인", "확인 준비\n시정조치 확인\n보고서 작성\n확인보고서 확정", "시정조치확인보고서"],
        ],
      },
      {
        caption: "감리법인·발주기관·피감리인 흐름",
        headers: ["순서", "활동", "산출물"],
        rows: [
          ["1", "감리계약 체결\n점검항목 협의", "감리 기본점검표"],
          ["2", "감리계획서 제출\n발주기관 접수", "감리계획서"],
          ["3~5", "착수회의\n현장감리 시행\n종료회의", ""],
          ["6", "감리보고서 통보\n발주기관 검토", "감리보고서"],
          ["7~9", "조치계획 수립\n접수 및 검토\n감리결과 반영", ""],
          ["10~12", "조치내역 확인\n감리법인 확인\n확인보고서 제출", "조치내역확인보고서"],
        ],
      },
    ],
  },
  {
    title: "정보시스템 감리결과보고서 (구성, 보고사항)",
    course: "SE",
    definition:
      "독립된 감리법인이 제3자적 관점에서 수행한 현장감리 내용에 대해 결과를 정리하고 제출하는 최종결과보고서",
    defShort: "제3자적 관점 현장감리 내용 결과를 정리하고 제출하는 최종결과보고서",
    lead:
      "감리 수행의 최종 산출물, 감리결과보고서",
    features: ["제3자적 관점", "개선권고 유형화", "개선시점 명시"],
    keywords: ["1)종합의견 2)감리영역별 점검결과 3)별첨", "감리계획서", "필수", "협의", "권고", "장기", "단기"],
    tables: [
      {
        caption: "구성",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["1. 종합의견", "1.전제조건", "보고서 작성 시점 전제조건 정의"],
          ["1. 종합의견", "2.총평", "점검대상 사업 감리의견 총괄정리"],
          ["1. 종합의견", "3.감리영역별 상세점검결과 요약", "개선권고사항·유형·중요도\n발주기관 협조필요여부 표시"],
          ["2. 감리영역별 점검결과", "1.감리영역 1", "가.점검항목별 점검결과\n나.상세점검결과\n사업관리·품질보증활동 영역"],
          ["2. 감리영역별 점검결과", "2.감리영역 2", "가.점검항목별 점검결과\n나.상세점검결과\n응용시스템 영역 점검결과"],
          ["2. 감리영역별 점검결과", "3.감리영역 3", "가.점검항목별 점검결과\n나.상세점검결과\nDB·시스템아키텍처·보안 영역"],
          ["3. 별첨", "감리계획서", "감리수행 전 제출 감리계획서 첨부"],
        ],
      },
      {
        caption: "개선권고 유형·시점",
        headers: ["구분", "유형"],
        rows: [
          ["개선권고 유형", "필수, 협의, 권고"],
          ["개선시점", "장기, 단기"],
          ["기타 표기", "중요도\n발주기관 협조필요"],
        ],
      },
      {
        caption: "감리결과보고서 제출프로세스",
        headers: ["순서", "활동"],
        rows: [
          ["1", "감리결과보고서(안) 설명"],
          ["2", "이견접수 및 보고서 통보일 제시"],
          ["3", "이견사항 처리결과 공유"],
          ["4", "보고서 확정 및 통보"],
        ],
      },
    ],
    notes: ["각 감리영역별 점검결과는 개선권고유형과 개선시점, 발주기관 협조필요여부가 작성되어 제출됨"],
  },
  {
    title: "정보시스템 운영 성과관리",
    course: "SE",
    definition:
      "정보시스템 운영 성과 측정 및 평가 결과에 따라 정비 대상을 결정하여 업무 및 비용 측면의 성과를 높이기 위한 각종 활동",
    defShort: "정보시스템 운영 성과 평가로 업무 및 비용 측면의 성과를 높이는 각종 활동",
    lead:
      "운영 성과 측정과 정비, 정보시스템 운영 성과관리",
    features: ["정량 측정", "정비 연계", "법정 의무"],
    subDefs: [
      {
        name: "업무성과 계획관리",
        lead: "성과 지표의 목표 수립",
        def: "운영 성과를 측정하도록 성과 지표를 설계하고 매년 목표를 수립하는 절차",
      },
      {
        name: "통폐합 대상관리",
        lead: "하위 등급의 통폐합 검토",
        def: "3~4등급으로 분류된 정보시스템의 통폐합 가능성을 검토하는 절차",
      },
      {
        name: "성과측정 대상관리",
        lead: "측정 대상의 확인·제외",
        def: "성과측정 대상을 확인하고 필요한 경우 성과측정 제외를 신청하는 절차",
      },
      {
        name: "성과측정 및 평가",
        lead: "비용·업무 성과의 측정",
        def: "비용과 업무 측면의 성과를 측정해 그 결과와 증빙자료를 제출하는 절차",
      },
      {
        name: "폐기 예외관리",
        lead: "폐기 대상의 예외 신청",
        def: "총점 40점 미만 정보시스템 중 폐기 예외 사유 해당 시 신청·심의 절차",
      },
      {
        name: "정비계획 수립",
        lead: "개선·폐기 대상의 계획",
        def: "정비유형이 개선·폐기로 분류된 정보시스템의 정비계획을 세우는 절차",
      },
      {
        name: "정비계획 이행관리",
        lead: "정비방식·시점의 이행",
        def: "수립한 정비계획의 정비방식과 시점에 따라 활동을 수행·관리하는 절차",
      },
    ],
    keywords: ["전자정부법 제23조", "운영의 적정성", "유지의 용이성", "비용의 효율성", "기능 활용도", "업무성과 달성도"],
    tables: [
      {
        caption: "추진절차",
        headers: ["추진절차", "절차 정의", "주요활동"],
        rows: [
          ["업무성과 계획관리", "성과지표 설계\n지표별 목표 수립", "연중 실적 관리\n지표별 목표 수립"],
          ["통폐합 대상관리", "3~4등급 대상\n통폐합 추진 검토", "가능성 검토\n불가 시 심의"],
          ["성과측정 대상관리", "측정 대상 확인\n측정 제외 신청", "오픈 후 1년 경과"],
          ["성과측정 및 평가", "성과 측정\n결과·증빙 제출", "비용측면 측정\n업무측면 측정"],
          ["폐기 예외관리", "40점 미만 대상\n폐기 예외 신청", "폐기예외 검토\n위원회 심의"],
          ["정비계획 수립", "정비유형 분류\n정비계획 수립", "폐기→통폐합→\n고도화→재개발"],
          ["정비계획 이행관리", "정비활동 수행\n결과 관리", "정비활동 수행\n변경 시 심의"],
        ],
      },
      {
        caption: "성과측정 지표",
        headers: ["구분", "지표", "설명", "측정 산식"],
        rows: [
          ["비용지표", "운영의 적정성", "개발비·유지보수비\n비율 점검", "누적 유지보수비\n/ 누적 개발비"],
          ["비용지표", "유지의 용이성", "운영유지비 증감\n수준 점검", "전년대비\n유지비 증감률"],
          ["비용지표", "비용의 효율성", "활용 규모 대비\n비용 효율 평가", "활용규모당\n유지비 증감률"],
          ["업무지표", "기능 활용도", "구현 기능의\n실제 활용 수준", "기능별 사용량\n증감률 평균"],
          ["업무지표", "업무성과 달성도\n(공통·고유지표)", "목표 대비 달성", "업무성과 실적치\n/ 목표치 × 100%"],
        ],
      },
      {
        caption: "정비 방식",
        headers: ["정비 방식", "설명"],
        rows: [
          ["폐기", "현재 서비스 더 이상 제공 않고 종료"],
          ["통폐합", "타 시스템 통합, 현행 시스템 폐기"],
          ["기능고도화", "타 기능·서비스 통합, 규모 확장\n기능개선·유지보수 범위 내 정비"],
          ["전면재개발", "현행 기능·서비스 새롭게 구축\n현행 시스템 폐기"],
        ],
      },
    ],
    notes: ["추진근거: 전자정부법 제23조(전자정부 서비스의 효율적 관리), 전자정부법 시행령 제19조, 전자정부 성과관리 지침 제23조~제30조. 대상 기관: 중앙행정기관, 지방자치단체"],
  },
  {
    title: "소프트웨어 안전 확보를 위한 지침",
    course: "SE",
    definition:
      "SW 안전 책임자 및 안전관리 대상 소프트웨어 개발, 운영단계로 수행해야 할 관리기준을 담고 있는 지침",
    defShort: "안전관리 대상 SW 개발·운영단계 수행해야 할 관리기준을 담은 지침",
    lead:
      "SW 오작동 피해 방지, 소프트웨어 안전 확보 지침",
    features: ["SW진흥법 근거", "단계별 관리기준", "위험원 분석 중심"],
    keywords: ["SW진흥법 제30조 제2항", "총괄 담당자 지정", "관리 대상 소프트웨어 지정", "개발단계에서의 안전확보", "운영단계에서의 안전확보"],
    tables: [
      {
        caption: "주요 용어",
        headers: ["용어", "정의"],
        rows: [
          ["위험원", "SW 내 원인 위험 유발 요인\n생명·신체 피해 시스템 손실 초래"],
          ["장애", "오류·고장 상태 SW 사용 곤란"],
          ["소프트웨어 안전", "외부 침입 없는 사이버 공격 배제\n내부 오작동 피해 대비 상태"],
        ],
      },
      {
        caption: "지침 조항 내용",
        headers: ["장", "조"],
        rows: [
          ["제1장 총칙", "제1조 목적\n제2조 정의\n제3조 적용 범위"],
          ["제1장 총칙", "제4조 업무 및 담당자\n(총괄 담당자 지정)\n제5조 안전관리 대상 SW지정"],
          ["제2장 SW개발단계 안전확보", "제6조 안전 요구사항의 정의\n제7조 SW 위험원 분석\n제8조 SW 설계 및 구현\n제9조 SW 검증"],
          ["제3장 SW운영단계 안전확보", "제10조 SW 운영관리 계획\n제11조 운영 위험 분석\n제12조 SW 안전점검\n제13조 SW 변경관리"],
          ["제3장 SW운영단계 안전확보", "제14조 장애관리"],
          ["제4장 그 외 SW 안전확보 사항", "제15조 정보공유\n제16조 기반확보\n제17조 기타사항\n제18조 재검토 기한"],
        ],
      },
    ],
    notes: ["제정 배경: SW진흥법 전부 개정 시행('20.12.17)(소프트웨어안전 확보) → 고시제정 법적근거: 제30조 제2항", "주요 내용: 소프트웨어안전 책임자 · 안전관리 대상 소프트웨어 지정 · 소프트웨어 개발·운영단계별로 수행해야할 관리기준"],
  },
  {
    title: "공공기관 정보화사업 예비타당성",
    course: "SE",
    definition:
      "국가재정법 제38조 및 같은 법 시행령 제13조의 규정에 따라 대규모 신규 사업에 대한 예산 편성 및 기금 운용계획을 수립하기 위하여 기획재정부장관 주관으로 실시하는 사전적인 타당성 검증·평가 제도",
    defShort: "대규모 신규 사업에 대한 예산 편성 위한 사전적인 타당성 검증·평가 제도",
    lead:
      "대규모 사업의 사전 검증, 정보화사업 예비타당성",
    features: ["사전적 타당성 검증", "대규모 신규 대상", "예산낭비 최소화"],
    keywords: ["국가재정법", "사업비 500억 & 국가재정지원규모 300억 신규 사업"],
    tables: [
      {
        caption: "예비타당성 조사 제도 필요성",
        headers: ["구분", "필요성", "설명"],
        rows: [
          ["경제적 측면", "예산낭비 최소화", "비경제 사업 배제"],
          ["기술적 측면", "사업 리스크 완화", "증액·변경 방지"],
          ["기술적 측면", "사업 취소 방지", "중도 취소 예방"],
          ["정책적 측면", "사업 우선순위", "후보사업군 비교"],
        ],
      },
      {
        caption: "예비타당성 조사 제도 기준 [사5지 3신]",
        headers: ["기준", "설명"],
        rows: [
          ["사업비 규모", "총사업비 500억원 이상\n국가 재정지원 규모 300억원 이상\n신규사업(사5지3신)"],
          ["정보화 사업 대상", "국가정보화 기본법 제15조 1항\n효율성 향상·국민 편익 증진\n행정·보건·사회복지·교육·문화\n환경·과학기술·재난안전 등"],
          ["신규사업", "타당성조사비 등 국고 미지원 사업"],
          ["대상사업 요건", "국가직접시행사업\n국가대행사업\n지방자치단체보조사업\n민간투자사업 등 재정지원 포함"],
        ],
      },
    ],
  },
  {
    title: "소프트웨어사업 영향평가",
    course: "SE",
    definition:
      "국가기관 등에서 소프트웨어사업의 예산편성, 발주, 소프트웨어 배포 및 서비스 제공을 추진하는 경우 민간 소프트웨어 시장 침해 등 소프트웨어 산업 생태계에 미치는 영향을 검토하여 사전 조정하는 제도",
    defShort: "민간 SW 시장 침해 등 SW 산업 생태계 영향을 검토해 사전 조정하는 제도",
    lead: "민간 시장 침해 사전 조정, 소프트웨어사업 영향평가",
    features: ["민간 시장 침해 검토", "사전 조정 제도", "재평가 요청권"],
    keywords: ["소프트웨어 진흥법 43조", "민간 시장 위축 방지", "대상사업 명확화", "SW사업자에게 재평가 요청권 부여"],
    tables: [
      {
        caption: "개념도(절차)",
        headers: ["구분", "단계", "설명"],
        rows: [
          ["1", "소프트웨어사업 기본정보 작성", ""],
          ["2", "운영계획 검토", "사업구분 ①~⑦ 판정\n⑦ 그 외 SW 사업 → 3단계"],
          ["3", "민간 소프트웨어 시장 침해 가능성 검토", "민간 동일·유사 SW 유무\n있음 → 4단계, 없음 → 5단계"],
          ["4", "사업의 필요성 및 공공성 검토", ""],
          ["5", "종합의견 작성", ""],
        ],
      },
      {
        caption: "법적 근거·대상·제외",
        headers: ["구분", "내용"],
        rows: [
          ["법적 근거", "진흥법 제43조(영향평가)\n시행령 35조 실시, 36조 제외\n시행령 37조 재평가 제외사유\n지침 제5조 평가, 제6조 제외대상"],
          ["대상 기관", "국가기관, 지방자치단체\n투자·출연 법인·단체(대통령령)\n시행령 제21조 해당 모든 기관"],
          ["대상 사업", "진흥법 제43조\n기관장 발주 기획·구축·유지관리"],
          ["제외 사업(시행령 제36조)", "상용SW 구매·설치 및 유지·관리\n국가안보·치안·외교 민간부적합\n민간투자형 SW사업\n그밖에 과기정통부 장관 고시 사업"],
          ["제외 사업(지침 제6조)", "단일기관 내부사용 목적 SW사업\n데이터베이스 구축 사업\n변경 없는 단순 유지관리·운영"],
        ],
      },
    ],
    notes: ["공공 소프트웨어 사업 발주기관이 사업 수행 이후 낸 영향평가 결과를 과기정통부 장관이 검토하고 개선 조치를 요청할 권한마련 (2023.03 개정)"],
  },
  {
    title: "상용 소프트웨어 직접구매 제도",
    course: "SE",
    definition:
      "발주기관이 공공 정보화사업 추진 시 HW, SW, 시스템통합 구축 사업에서 상용SW만을 별도로 발주, 평가, 선정 계약하는 방식으로 상용SW를 직접 구매하는 제도",
    defShort: "상용SW만을 별도로 발주·평가·선정 계약하여 직접 구매하는 제도",
    lead:
      "상용SW의 분리 발주, 직접구매 제도",
    features: ["상용SW 별도 발주", "일정 규모 이상 적용", "진흥법 54조 근거"],
    keywords: ["별도 발주", "3억", "5천만원", "소프트웨어 진흥법 제54조"],
    tables: [
      {
        caption: "상용 SW 직접 구매 대상 및 제외 기준",
        headers: ["구분", "설명"],
        rows: [
          ["상용SW 직접구매 대상", "총 사업규모 3억원 이상(VAT 포함)\n종합쇼핑몰 등록 SW(가격 무관)"],
          ["상용SW 직접구매 대상", "5천만원 이상 또는 다량구매 초과\n인증 획득: GS, 행정업무용, CC\nNEP, NET, 국가정보원 검증/지정"],
          ["제외기준 사업", "진흥법 제40조 민간투자형 SW 사업"],
          ["제외기준 SW", "시스템 통합 불가능\n비용 상승 초래\n사업기간 지연\n비효율적"],
        ],
      },
      {
        caption: "법적 근거",
        headers: ["근거법령", "조항", "설명"],
        rows: [
          ["소프트웨어 진흥법", "제54조 구매", "상용SW 구매"],
          ["소프트웨어사업 계약 및 관리감독에 관한 지침", "제7조 대상", "직접구매 대상"],
          ["소프트웨어사업 계약 및 관리감독에 관한 지침", "제8조 제외", "직접구매 제외"],
        ],
      },
    ],
    notes: ["개념도: 발주기관 — 상용SW구매사업 제안요청서 → SW별도 개발평가/개발계약(SW1·2·3 공급자) + 조달청 종합쇼핑몰 구매·계약 + 일괄평가/일괄계약(SI 사업자 — 분석설계·응용SW개발·NW 설치·HW·NW 납품)"],
  },
  {
    title: "사용성 평가",
    course: "SE",
    definition:
      "사용자가 실제 제품을 사용하는 것을 관찰하고 분석하여 제품의 효율성, 학습 용이성, 문제점 및 개선 요구사항을 발견하는 공학적인 테스트",
    defShort: "사용 관찰로 효율성·학습 용이성·문제점 및 개선 요구사항 발견 테스트",
    lead:
      "실사용 관찰 기반 검증, 사용성 평가",
    features: ["사용자 관찰 기반", "질적·양적 병행", "개발 시기별 적용"],
    keywords: ["UX리서치 방법론", "SUS설문", "편의성", "정확성", "만족도", "유연성", "탐구형테스트", "평가형 테스트"],
    tables: [
      {
        caption: "사용성 평가 절차",
        headers: ["절차", "평가내용", "산출물"],
        rows: [
          ["1. 계획 수립", "평가 목적 분석\n사용자 정의\n태스크 분석\n주요기능 추출", "사용성평가계획서"],
          ["2. 평가 설계", "테스트 디자인\n질적·양적 정의\n참가자 선정\n질문지 작성", "사용성평가설계서"],
          ["3. 평가 실행", "스크립트 작성\n사전 테스트\n본 테스트 진행\n관찰 사항 체크", "질적/양적RowData"],
          ["4. 분석/보고", "질적·양적 분석\n보고서 작성", "사용성평가결과보고서"],
        ],
      },
      {
        caption: "사용성 테스트의 4가지 유형",
        headers: ["유형", "시기", "목적", "방법", "설명"],
        rows: [
          ["탐색적 테스트", "초반", "디자인 컨셉\n유효성 확인", "페이퍼 mock-up\n화면 디자인", "사용 중 상상\n기능 가치 제공"],
          ["평가 테스트", "초/중반", "컨셉 효율성", "정량적 자료\n과업 수행", "UI를 직관적으로\n사용하는가"],
          ["검증 테스트", "후반", "사용성 보증\n표준 부합 여부", "속도·정확도\n선호도·결함", "시간 안에 완료\n참여자 70% 충족"],
          ["비교 테스트", "전체", "대안평가", "I/F 스타일\n요소의 평가", "경쟁사 대비 비교\n타겟 선호도"],
        ],
      },
      {
        caption: "사용성 평가 항목 및 측정 지표",
        headers: ["평가항목", "측정지표", "설명"],
        rows: [
          ["작업시간", "완료·로딩 시간", "목표 완료 시간"],
          ["작업시간", "이벤트 도달 시간", "특정 모드 체류"],
          ["작업시간", "기능 입력 시간", "입력 소요 시간"],
          ["사용패턴", "사용빈도\n정보접근성", "기능 사용 횟수"],
          ["사용패턴", "최선 해결책 편차", "최적·실제 비율"],
          ["정확성", "오류율\n공간 정확도", "완료까지 에러 양"],
          ["정확성", "정보의 정확성", "정확 정보 비율"],
          ["완성도", "성공/실패 비율", "목표 성공 백분율"],
          ["학습 용이성", "행동 유도성", "즉시 사용법 인지"],
          ["학습 용이성", "기억 용이성", "기능 습득 정도"],
          ["일관성", "시각적·기능적", "간섭 없는 습득"],
          ["일관성", "가독성·친숙성", "인식 요소 제공"],
        ],
      },
    ],
  },
  {
    title: "선형 자료구조와 비선형 자료구조",
    course: "DS",
    definition: "데이터 사이의 대응 구조에 따라 선형, 비선형 자료구조로 분류",
    defShort: "데이터 대응이 1:1이면 선형, 1:N이면 비선형인 자료구조 분류",
    lead:
      "데이터 대응 구조의 분류, 선형과 비선형 자료구조",
    features: ["대응 관계 기준 분류", "선형 구조 단순", "비선형 관계 표현"],
    keywords: ["선형자료구조(Array, Linked List, 스택(LIFO), 큐(FIFO))", "비선형자료구조(트리, 그래프)"],
    tables: [
      {
        caption: "선형 자료구조 (1:1 대응 구조로 저장 — 구조가 간단, access 속도가 빠름)",
        headers: ["구분", "구조", "설명"],
        rows: [
          ["순차 저장", "Array", "같은 데이터형 동일 크기 순차 나열"],
          ["연결 저장", "Linked List", "노드가 데이터와 포인터 가짐\n한 줄로 연결되어 데이터 저장"],
          ["제한 접근", "Stack (LIFO)", "한쪽 끝에서만 삽입·삭제 수행\nLIFO 후입선출 구조"],
          ["제한 접근", "Queue (FIFO)", "한쪽 삽입, 다른 한쪽 삭제\n먼저 들어온 데이터 먼저 나감\nFIFO 선입선출 구조"],
        ],
      },
      {
        caption: "비선형 자료구조 (1:N 또는 M:N 구조로 관계 — 자료 간의 관계를 표현)",
        headers: ["구분", "구조", "설명"],
        rows: [
          ["계층", "Tree", "나무 가지처럼 연결된 계층적 구조\n순환이 없는 연결 그래프"],
          ["망", "Graph", "정점(Vertex) 집합 V\n간선(Edge) 집합 E\nG = (V, E)"],
        ],
      },
    ],
  },
  {
    title: "링크드 리스트(Linked List)",
    course: "DS",
    definition:
      "각 노드(Node)가 데이터(Data)와 포인터(Pointer)를 가지고 한 줄로 연결되어 있는 데이터를 저장하는 자료 구조",
    defShort: "각 노드가 데이터와 포인터를 갖고 한 줄로 연결되어 저장하는 자료 구조",
    lead:
      "포인터 연결의 동적 구조, 링크드 리스트",
    features: ["동적 크기 할당", "포인터 변경 삽입", "순차 접근 한계"],
    subDefs: [
      {
        name: "Head",
        lead: "리스트 참조의 시작점",
        def: "외부에서 해당 리스트를 참조할 때 가장 처음 접근하는 시작점 노드 주소",
      },
      {
        name: "Tail",
        lead: "리스트 처리의 종료점",
        def: "해당 리스트를 참조하거나 처리할 때 끝을 알리는 종료점 역할의 끝 노드",
      },
      {
        name: "Node",
        lead: "데이터와 포인터의 단위",
        def: "실제 데이터 저장 노드, 자료 저장소와 다음 노드에 대한 포인터로 구성",
      },
    ],
    keywords: ["노드 = 데이터 + 포인터", "Singly / Doubly / Single Circular / Double Circular Linked List"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "개념", "설명"],
        rows: [
          ["Head", "시작점", "리스트 참조 시 처음 접근 주소\n시작을 알리는 노드"],
          ["Tail", "종료점", "참조·처리 시 끝을 알리는 노드"],
          ["Node", "실제 데이터", "실제 데이터를 저장하는 노드\n자료 저장소와 다음 노드 포인터"],
        ],
      },
      {
        caption: "삽입/삭제 연산",
        headers: ["연산", "설명"],
        rows: [
          ["삽입", "노드1→노드2 포인터 수정\n노드2→노드3 포인터 수정\n마지막이면 노드2→Null 수정"],
          ["삭제", "노드1→노드3 포인터 변경\n노드2를 free 시킴"],
        ],
      },
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["단방향", "Singly Linked List", "데이터와 다음 노드 포인터 구성\n이전 노드는 알 필요 없음\n마지막 노드 포인터는 Null"],
          ["양방향", "Double Linked List", "이전/다음 노드 포인터, Data 소유\n전/후방 어느 쪽으로도 순환 가능\n처음과 마지막 노드 포인터는 Null"],
          ["단방향", "Singly Circular Linked List", "Single Linked List와 동일\n마지막 Node가 처음 노드 가리킴"],
          ["양방향", "Double Circular Linked List", "Double Linked List와 동일\n처음과 마지막 노드가 서로 가리킴"],
        ],
      },
    ],
  },
  {
    title: "Stack",
    course: "DS",
    definition:
      "나중에 삽입된 자료가 가장 먼저 삭제되는 후입선출(LIFO)방식으로 리스트의 한쪽 끝으로만 자료의 삽입, 삭제 작업이 이루어지는 자료구조",
    defShort: "후입선출(LIFO) 방식, 한쪽 끝으로만 자료 삽입·삭제 자료구조",
    lead:
      "후입선출의 자료구조, Stack",
    features: ["후입선출(LIFO)", "한쪽 끝 삽입·삭제", "Top 포인터 관리"],
    keywords: ["LIFO", "Top", "bottom", "삽입(Push)", "제거(pop)"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명"],
        rows: [
          ["TOP", "삽입, 삭제가 일어나는 리스트 끝\n스택 포인터(stack pointer)"],
          ["Bottom", "TOP의 반대쪽 리스트의 끝\nBottom 삽입, 삭제 일어나지 않음"],
          ["PUSH", "스택에서 값을 삽입(입력)하는 것\noverflow: 스택 포인터 > 스택 크기"],
          ["POP", "스택에서 값을 삭제(출력)하는 것\nUnderflow: Top pointer 주소 = 0"],
        ],
      },
      {
        caption: "연산",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["연산", "push(item)", "최상단에 추가"],
          ["연산", "pop()", "최상단 제거 반환"],
          ["연산", "init()", "포인터 0 설정"],
          ["연산", "isEmpty()", "공백 시 true"],
          ["발생 예외", "Overflow", "기억장소 꽉 참"],
          ["발생 예외", "Underflow", "SP 주소 0"],
        ],
      },
    ],
  },
  {
    title: "Queue",
    course: "DS",
    definition:
      "선형리스트의 한쪽에서는 삽입 작업이 이루어지고 다른 한쪽에서는 삭제 작업이 이루어지도록, 먼저 들어온 데이터가 먼저 나가는 자료구조",
    defShort: "한쪽 삽입, 다른 한쪽 삭제로 먼저 들어온 데이터가 먼저 나가는 자료구조",
    lead:
      "선입선출의 자료구조, Queue",
    features: ["선입선출(FIFO)", "입출구 분리", "선형 자료구조"],
    keywords: ["FIFO", "선형큐", "순환큐(원형큐)", "링크드리스트큐", "덱 [선순링덱]"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "설명"],
        rows: [
          ["Front", "줄의 맨 앞을 전단(Front)"],
          ["Rear", "맨 뒤를 후단(Rear)"],
          ["Enqueue", "후단에 데이터를\n삽입하는 작업"],
          ["Dequeue", "전단의 데이터를\n삭제하는 작업"],
          ["isFull", "큐가 가득 차\n있는지 판단\n(배열만해당)"],
          ["isEmpty", "큐가 공백 큐인지\n확인"],
        ],
      },
      {
        caption: "유형 [선순링덱]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["배열 기반", "선형 큐", "배열 선형 사용 순차 배열 큐 구현"],
          ["배열 기반", "순환 큐(원형 큐)", "논리적 원형 배열 순환 사용\n끝↔시작 연결 전단·후단 관리"],
          ["연결 기반", "LinkedList 큐", "연결 리스트 구현 노드 연결 큐"],
          ["양단 접근", "덱(Double-ended Queue)", "양끝 삽입·삭제 양단 모두 가능"],
        ],
      },
    ],
  },
  {
    title: "이진 탐색 트리(Binary Search Tree)",
    course: "DS",
    definition:
      "이진탐색(binary search)과 연결리스트(linked list)를 결합한 자료구조로, 이진탐색의 효율적인 탐색 능력을 유지하면서 빈번한 입력과 삭제가 가능하도록 고안된 자료 구조",
    defShort: "이진탐색과 연결리스트를 결합해 빈번한 입력과 삭제가 가능한 자료구조",
    lead:
      "탐색과 갱신의 균형, 이진 탐색 트리",
    features: ["좌소·우대 키 배치", "재귀적 구조", "삽입·삭제 용이"],
    keywords: ["이진 탐색", "재귀"],
    tables: [
      {
        caption: "성질",
        headers: ["번호", "설명"],
        rows: [
          ["1)", "좌측 서브 트리 노드보다 작은 값"],
          ["2)", "우측 서브 트리 노드보다 큰 값"],
          ["3)", "중복 노드 없음 유일한 키 값"],
          ["4)", "재귀적 성질 좌우도 이진 탐색"],
        ],
      },
      {
        caption: "데이터 탐색 매커니즘 (키 x를 가진 노드 검색 시)",
        headers: ["순서", "설명"],
        rows: [
          ["1", "노드 존재 해당 노드 리턴\n노드 미존재 NULL 리턴"],
          ["2", "루트 노드 비교 일치 시 루트 리턴"],
          ["3", "검색 값<루트 좌측 재귀 검색"],
          ["4", "검색 값≥루트 우측 재귀 검색"],
        ],
      },
    ],
    notes: ["순회 시 중위순회(in order) 방식 사용 — 모든 값들을 정렬된 순서대로 읽기 가능", "예) 10 탐색 시: 루트(7)과 비교 10>7 → 좌측 서브트리(1,3,5) 탐색 제외 → 우측 루트(8)과 비교 10>8 → 우측 서브트리 루트(10)에서 원하는 값 찾음"],
  },
  {
    title: "AVL 트리",
    course: "DS",
    definition:
      "각 노드의 왼쪽 서브 트리의 높이와 오른쪽 서브 트리의 높이 차이(Balance factor)가 절대값 1 이하인 이진 탐색 트리",
    defShort: "노드 왼쪽·오른쪽 서브 트리 높이 차이가 절대값 1 이하인 이진 탐색 트리",
    lead: "높이차 1 이하 자가 균형, AVL 트리",
    features: ["높이 균형 유지", "회전 재균형", "O(log n) 탐색 보장"],
    keywords: ["Balance factor", "균형 이진 트리", "LL", "RR", "LR", "RL"],
    tables: [
      {
        caption: "트리 회전",
        headers: ["회전 타입", "설명"],
        rows: [
          ["LL", "왼쪽-왼쪽으로\n치우친 경우(insert 3, 2, 1)\n→ 오른쪽으로 한\n번 회전하여 균형"],
          ["RR", "오른쪽-오른쪽으로\n치우친 경우(insert 1, 2, 3)\n→ 왼쪽으로 한 번\n회전하여 균형"],
          ["LR", "왼쪽-오른쪽으로\n치우친 경우(insert 3, 1, 2)\n→ LL 회전 후 RR\n회전"],
          ["RL", "오른쪽-왼쪽으로\n치우친 경우(insert 1, 3, 2)\n→ RR 회전 후 LL\n회전"],
        ],
      },
      {
        caption: "추가 순서 예: 9 → 4 → 3 → 12 → 14 → 10",
        headers: ["단계", "동작"],
        rows: [
          ["(1)~(3)", "9 삽입 → 4 삽입 →\n3 삽입(BF +2 발생)"],
          ["(4)", "LL 회전 → 4가 루트(3, 9 자식)"],
          ["(5)~(6)", "12 삽입 → 14 삽입(9의 BF −2\n발생)"],
          ["(7)", "RR 회전 → 12가\n서브트리\n루트(9, 14 자식)"],
          ["(8)~(9)", "10 삽입(BF −2) → RL 회전 →\n9가 루트(4, 12\n서브트리 균형)"],
        ],
      },
    ],
  },
  {
    title: "힙(Heap)",
    course: "DS",
    definition:
      "여러 개의 노드들 가운데서 가장 큰 키 값을 가지는 노드나 가장 작은 키 값을 가지는 노드를 빠른 시간 내에 찾아 내도록 만들어진 자료 구조",
    defShort: "가장 큰 키 값이나 가장 작은 키 값 노드를 빠른 시간 내에 찾아내는 자료 구조",
    lead:
      "최대·최소의 빠른 접근, 힙(Heap)",
    features: ["완전 이진 트리", "루트 최대·최소 키", "우선순위 큐 적합"],
    subDefs: [
      {
        name: "최대 힙(Max-Heap)",
        lead: "루트가 최대인 완전 이진 트리",
        def: "완전 이진 트리에서 한 노드가 모든 자손 노드들보다 큰 키 값을 가지는 힙",
      },
      {
        name: "최소 힙(Min-Heap)",
        lead: "루트가 최소인 완전 이진 트리",
        def: "완전 이진 트리에서 한 노드가 모든 후손 노드들보다 작은 키 값을 갖는 힙",
      },
    ],
    keywords: ["완전 이진 트리", "최대 힙(Max-Heap)", "최소 힙(Min-Heap)"],
    tables: [
      {
        caption: "최대 힙(Max-Heap)과 최소 힙(Min-Heap)",
        headers: ["구분", "개념", "노드"],
        rows: [
          ["최대 힙(Max-Heap)", "완전 이진 트리\n자손보다 큰 키\n루트 최대 키\n우선순위 큐 적합", "자손보다 큰 값"],
          ["최소 힙(Min-Heap)", "완전 이진 트리\n후손보다 작은 키", "자손보다 작은 값"],
        ],
      },
      {
        caption: "Min-Heap 삽입 연산 (2, 6, 4, 9, 7 순서 삽입 후 1 추가)",
        headers: ["단계", "설명"],
        rows: [
          ["1", "2, 6, 4, 9, 7 순서대로 삽입"],
          ["2", "새로운 노드 1 추가\n완전 이진 트리 유지, 4 왼쪽 삽입"],
          ["3", "1<4 비교 1과 4 치환"],
          ["4", "1<2 비교 1과 2 치환"],
          ["5", "삽입 완료 상태 1이 루트 위치"],
        ],
      },
    ],
  },
  {
    title: "B-Tree(Balanced Tree)",
    course: "DS",
    definition: "하나의 노드가 가질 수 있는 자식 노드의 최대 숫자가 2보다 큰 이진 트리의 확장형 트리 구조",
    defShort: "한 노드의 자식 노드 최대 숫자가 2보다 큰 이진 트리의 확장형 트리 구조",
    lead: "다분기 균형 탐색 트리, B-Tree",
    features: ["최소 m/2 자식노드", "균등 탐색 속도", "노드 내 정렬"],
    keywords: ["m/2", "분할", "균형 유지"],
    tables: [
      {
        caption: "구조와 특징",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["구조", "Root node", "최소 2개 자식\n최소 1개 값"],
          ["구조", "Internal node", "최대 m개 자식\n차수 m 기준"],
          ["구조", "Leaf node", "최하위 노드\n동일 레벨"],
          ["특징", "자식노드 수", "리프·루트 제외 최소 m/2개"],
          ["특징", "균등 탐색 속도", "최악의 경우 없음\n시간 복잡도 O(logN) 일정"],
          ["특징", "효율성", "트리 높이 감소"],
          ["특징", "정렬상태", "노드 내 정렬"],
          ["유형", "B+ Tree", "인덱스 세트·순차세트 구성"],
          ["유형", "B* Tree", "리프·루트 제외 노드 2/3 이상 채움"],
        ],
      },
      {
        caption: "삽입/삭제 연산",
        headers: ["연산", "설명"],
        rows: [
          ["삽입", "리프 삽입 정렬 키 오름차순 채움\n가득 시 분할 중간 키 부모 승격"],
          ["삭제", "리프에서 시작 삽입과 동일 시작\n후행 키 교환 리프 이동 후 삭제"],
        ],
      },
    ],
  },
  {
    title: "방향성 비순환 그래프(DAG, Directed Acyclic Graph)",
    course: "DS",
    definition: "개별 요소들이 특정한 방향을 향하고 있으며, 서로 순환하지 않는 구조로 구성된 그래프",
    defShort: "요소들이 특정한 방향을 향하고 서로 순환하지 않는 구조로 구성된 그래프",
    lead: "방향 있고 순환 없는 구조, DAG",
    features: ["유향 비순환", "선후 관계 표현", "위상 정렬 가능"],
    keywords: ["위상 정렬", "유향 비순환", "진입차수"],
    tables: [
      {
        caption: "위상 정렬(Topological Ordering)",
        headers: ["구분", "설명"],
        rows: [
          ["절차", "진입차수 0 삽입 해당 정점 큐 삽입\n간선 제거 반복 정점 소진 시 완료"],
          ["설명", "유향 그래프 정렬 변 방향 순서 나열\nDFS·큐 활용 대표적 정렬 방법"],
          ["진입 차수(in-degree)", "들어오는 간선 정점 유입 간선 수"],
          ["진출 차수(out-degree)", "나가는 간선 정점 유출 간선 수"],
        ],
      },
      {
        caption: "위상정렬 실시 과정 및 결과",
        headers: ["순서", "설명"],
        rows: [
          ["정점 별 진입차수 표 작성", "진입차수 표 정점별 차수 기입"],
          ["큐 삽입 및 연결 간선 제거 ①", "진입차수 0 정점 큐 삽입 대상 선정\n정점 4 큐 삽입 연결 간선 제거"],
          ["큐 삽입 및 연결 간선 제거 ②", "차수 0 갱신 진입차수 재계산\n1,6 큐 삽입 정점·간선 제거"],
          ["큐 삽입 및 연결 간선 제거 ③", "차수 0 갱신 진입차수 재계산\n2,3 큐 삽입 정점·간선 제거"],
          ["정점 제거 확인", "정점 5 큐 삽입 마지막 정점 처리\n제거 완료 확인 모든 정점 소진"],
          ["결과 값", "4 → 1 → 6 → 2 → 3 → 5"],
        ],
      },
    ],
  },
  {
    title: "알고리즘 성능평가",
    course: "AL",
    definition:
      "알고리즘 수행 시 필요로 하는 시간 및 공간에 대한 지표를 기준으로 알고리즘 성능을 판단하는 프로세스",
    defShort: "시간 및 공간에 대한 지표를 기준으로 알고리즘 성능을 판단하는 프로세스",
    lead: "시간·공간 복잡도의 판단, 알고리즘 성능평가",
    features: ["입력 크기 기준", "점근적 비교", "시간·공간 교환"],
    keywords: ["시간복잡도(수행시간)", "공간복잡도(사용 메모리공간)", "점근적 성능표기법"],
    tables: [
      {
        caption: "성능 평가 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["성능분석", "알고리즘 복잡도 분석", "직접 구현 않고 수행 시간 분석\n연산 횟수 측정 비교, n의 함수\n시간·공간복잡도 분석"],
          ["성능측정", "수행시간 측정", "실제 수행시간 측정\n실제 구현물 필요\n동일한 하드웨어 사용 필요"],
          ["효율성 평가", "시간 복잡도(Time complexity)", "단위 연산 횟수로 수행시간 평가\n컴파일 시간과 실행 시간의 합\n3가지 점근적 표현법(O·Ω·Θ)"],
          ["효율성 평가", "공간 복잡도(Space complexity)", "수행에 필요한 메모리 양 평가\n고정 공간 + 가변 공간의 합\n시간 적으면 공간 크고, 역도 성립"],
        ],
      },
      {
        caption: "점근적 성능 표기법(Asymptotic Notation)",
        headers: ["표기법", "설명"],
        rows: [
          ["O Notation (빅오 표기법)", "점근적 상한선(upper bound)\n입력 최악일 때 기준 효율성 평가"],
          ["Ω Notation (오메가 표기법)", "점근적 하한선(lower bound)\n입력 최상일 때 기준 효율성 평가"],
          ["Θ Notation (세타 표기법)", "상·하한 교집합(tighter bound)\n하한인 동시에 상한 표시"],
        ],
      },
      {
        caption: "시간 복잡도 사례",
        headers: ["구분", "알고리즘 A", "알고리즘 B", "알고리즘 C"],
        rows: [
          ["코드", "sum=n*n;", "for(i=1;i<=n;i++)\nsum=sum+n;", "for(i=1;i<=n;i++)\nfor(j..)sum=sum+1;"],
          ["연산", "대입 1, 곱셈 1", "대입 n, 덧셈 n", "대입 n², 덧셈 n²"],
          ["전체연산수", "2", "2n", "2n²"],
        ],
      },
    ],
    notes: ["점근적 성능 표기법: 알고리즘이 주어진 데이터의 크기를 기준으로 수행시간 혹은 사용공간이 얼마나 되는지를 객관적으로 비교할 수 있는 기준을 제시해 주는 표기법"],
  },
  {
    title: "빅오 표기법(O-Notation)",
    course: "AL",
    definition:
      "데이터 수 N에 대해서 복잡도가 어떤 함수로 나타나는가를 간단히 표현하기 위한 알고리즘의 시간 복잡도를 표현하는 상한 점근 표기법",
    defShort: "데이터 수 N에 대한 알고리즘의 시간 복잡도를 표현하는 상한 점근 표기법",
    lead: "복잡도 함수의 상한 표현, 빅오 표기법",
    features: ["상한 점근 표기", "입력 규모 N 함수", "최고차항만 표기"],
    keywords: ["시간 복잡도", "매개변수 N"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명", "사례"],
        rows: [
          ["O(1)", "상수형\n입력 크기 무관", "해시 함수(Hash Function)"],
          ["O(log N)", "로그형\n나눠 하나만 처리", "이진탐색(Binary Search)"],
          ["O(N)", "선형\n하나씩 모두 처리", "단순탐색(Find Item)"],
          ["O(N log N)", "분할·합병형\n분할 후 합병", "퀵 정렬(Quick Sort)"],
          ["O(N²)", "제곱형\n2중 loop", "버블 정렬(Bubble Sort)"],
          ["O(N³)", "세제곱형\n3중 loop", "Finding the Shortest Path"],
          ["O(2ⁿ)", "지수형\n모든 해법 검사", "Dynamic Programming"],
        ],
      },
      {
        caption: "유형별 연산시간 순서",
        headers: ["순서"],
        rows: [
          ["O(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(N³) < O(2ⁿ) < O(N!)"],
        ],
      },
    ],
    notes: ["개념도: 데이터 수 n이 늘어날 때 수행시간 T(n) 곡선 — O(2^n)·O(n^3)(행렬곱셈)·O(n^2)(버블,삽입)·O(n log n)(퀵,합병 정렬)·O(n)(순차 탐색)·O(log n)(이진 탐색)·O(1)(해시 테이블)"],
  },
  {
    title: "퀵 정렬(Quick Sort)",
    course: "AL",
    definition:
      "분할과 정복(divide and conquer)에 기반한 정렬 알고리즘으로, 기준이 되는 Pivot을 정해서 기준 값을 중심으로 작은 값을 갖는 자료들과 큰 값을 갖는 자료로 분할하여 정렬하는 방법",
    defShort: "Pivot을 정해 작은 값과 큰 값으로 나눠 정렬하는 분할과 정복의 방법",
    lead: "피벗 기준의 분할 정복, 퀵 정렬",
    features: ["분할 정복 기반", "평균 O(n logn)", "최악 시 O(n²)"],
    keywords: ["Pivot", "평균실행시간: O(n logn)", "최악의 경우: O(n²)", "분할 정복(divide and conquer)"],
    tables: [
      {
        caption: "동작 원리",
        headers: ["원리", "설명"],
        rows: [
          ["1) 비교 정렬", "원소 간 비교 비교만으로 정렬"],
          ["2) 분할과 정복", "Pivot 분할 분할 리스트 정렬"],
          ["3) 재귀적 수행", "분할·정렬 반복 부분 리스트 재귀"],
          ["시간복잡도", "n log n 평균 실행 시간"],
        ],
      },
      {
        caption: "수행 과정(오름차순 정렬) — 용어",
        headers: ["용어", "설명"],
        rows: [
          ["Pivot", "중심점,\n피봇이라고 부름"],
          ["Left", "정렬할 요소들의\n가장 왼쪽 지점"],
          ["Right", "정렬할 요소들의\n가장 오른쪽 지점"],
          ["Low", "피봇을 제외한\n가장 왼쪽 지점"],
          ["High", "피봇을 제외한\n가장 오른쪽 지점"],
        ],
      },
      {
        caption: "수행 절차",
        headers: ["순서", "설명"],
        rows: [
          ["1", "Low는 왼쪽부터 Pivot보다 큰 값"],
          ["2", "High는 우측서 Pivot보다 작은 값"],
          ["3", "큰 값과 작은 값의 위치 교환"],
          ["4", "다시 좌측 큰 값, 우측 작은 값 탐색"],
          ["5", "교차 시 Pivot과 high 값 교환"],
          ["6", "Pivot 기준 좌측 작은 값, 우측 큰 값"],
          ["7", "좌·우 Pivot 다시 잡고 재귀실행"],
        ],
      },
    ],
    notes: ["예시: 초기상태 5,3,8,4,9,1,6,2,7 → 피봇=5 → 피봇보다 작은 값(1,3,2,4) | 5 | 피봇보다 큰 값(9,6,8,7) → 리스트의 크기가 0이나 1이 될 때까지 반복 → 1,2,3,4,5,6,7,8,9"],
  },
  {
    title: "삽입 정렬(Insertion Sort)",
    course: "AL",
    definition:
      "자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여 자신의 위치를 찾아 삽입하는 정렬",
    defShort: "요소를 이미 정렬된 배열 부분과 비교해 자신의 위치를 찾아 삽입하는 정렬",
    lead:
      "정렬 부분에 끼워 넣기, 삽입 정렬",
    features: ["정렬 영역 점진 확장", "자리 찾아 삽입", "이동 비용 발생"],
    keywords: ["이미 정렬", "자신 위치 찾아 삽입"],
    tables: [
      {
        caption: "수행 개념도",
        headers: ["단계", "설명"],
        rows: [
          ["Step 1", "정렬 영역·비정렬 영역 구분\n자신이 들어갈 위치 검색"],
          ["Step 2", "해당 위치 이후 값을 Shift"],
          ["Step 3", "해당 위치로 삽입"],
        ],
      },
      {
        caption: "삽입 정렬 과정",
        headers: ["순번", "과정 설명"],
        rows: [
          ["1", "처음 A[0]는 정렬된 데이터로 취급"],
          ["2", "A[1]을 정렬된 데이터와 비교 삽입"],
          ["3", "A[2]를 A[0], A[1]과 비교 삽입"],
          ["4", "같은 방식 나머지 삽입 정렬 완성"],
        ],
      },
      {
        caption: "예시 (31, 25, 12, 22, 11)",
        headers: ["단계", "데이터", "설명"],
        rows: [
          ["초기", "31 25 12 22 11", "처음 상태"],
          ["1", "31 [25] 12 22 11", "두 번째 원소(25) 정렬 부분 삽입"],
          ["2", "<25> 31 [12] 22 11", "<25> 삽입 완료\n세 번째 원소(12) 정렬 부분 삽입"],
          ["3", "<12> 25 31 [22] 11", "<12> 삽입 완료\n네 번째 원소(22) 정렬 부분 삽입"],
          ["4", "12 <22> 25 31 [11]", "<22> 삽입 완료\n마지막 원소(11) 정렬 부분 삽입"],
          ["5", "<11> 12 22 25 31", "<11> 삽입 완료 후 종료"],
        ],
      },
    ],
  },
  {
    title: "버블 정렬(Bubble Sort)",
    course: "AL",
    definition:
      "데이터 집합을 순회하면서 집합 내의 이웃 요소들끼리의 비교 후 교환을 통해 정렬",
    defShort: "데이터 집합을 순회하며 집합 내 이웃 요소들끼리 비교 후 교환을 통해 정렬",
    lead: "이웃 요소 비교·교환 반복, 버블 정렬",
    features: ["인접 원소 비교", "최댓값 순차 확정", "O(n²) 비효율"],
    keywords: ["인접 원소 비교", "거품", "완전 정렬", "O(n²)", "위치 교환 방식"],
    tables: [
      {
        caption: "버블 정렬 과정",
        headers: ["순번", "과정 설명"],
        rows: [
          ["1", "A(1)과 A(2), A(2)와 A(3)\nA(3)과 A(4) 순서로 비교\n앞쪽 값이 뒤쪽보다 크면 교환"],
          ["2", "1회 후 A(4)는 가장 큰 값\n2회는 A(1)~A(3)만 비교 반복"],
          ["3", "2회 후 A(3)·A(4) 정렬 완료\nA(1)과 A(2)만 비교"],
        ],
      },
      {
        caption: "수행 개념도 (7, 5, 8, 3, 9 정렬)",
        headers: ["단계", "결과"],
        rows: [
          ["시작", "7 5 8 3 9"],
          ["1단계", "5 7 3 8 [9]\n가장 큰 값 9 맨 뒤 확정"],
          ["2단계", "5 3 7 [8 9]"],
          ["…", "3 5 [7 8 9]"],
          ["완료", "[3 5 7 8 9]\n정렬 완료 방향: 뒤→앞"],
        ],
      },
      {
        caption: "예시 (7, 5, 3, 2)",
        headers: ["회차", "과정", "결과"],
        rows: [
          ["1회", "7 5 3 2 → 5 7 3 2\n→ 5 3 7 2 → 5 3 2 7", "5 3 2 [7]"],
          ["2회", "5 3 2 7 → 3 5 2 7\n→ 3 2 5 7", "3 2 [5 7]"],
          ["3회", "3 2 5 7 → 2 3 5 7", "[2 3 5 7]"],
        ],
      },
    ],
    notes: ["시간복잡도 O(n²) — 교재 빅오 표기법 슬라이드에서 O(N²) 제곱형(주요 처리 loop 구조가 2중인 경우)의 대표 사례로 제시됨"],
  },
  {
    title: "병합 정렬(Merge Sort)",
    course: "AL",
    definition:
      "하나의 리스트를 같은 크기의 두 개로 분할을 반복한 다음, 정렬된 두 리스트를 병합을 반복하면서 정렬된 전체 리스트를 만드는 분할 정복에 기반하는 정렬 알고리즘",
    defShort: "두 개로 분할 반복 후 병합을 반복하는 분할 정복에 기반하는 정렬 알고리즘",
    lead: "균등 분할과 병합의 반복, 병합 정렬",
    features: ["분할 정복", "최악 O(n log n)", "안정 정렬"],
    keywords: ["분할과 정복", "O(n log n)"],
    tables: [
      {
        caption: "수행 절차",
        headers: ["순서", "설명"],
        rows: [
          ["①", "정렬할 데이터를 반으로 나눔"],
          ["②", "하위 집합 크기 2 이상이면 ① 반복"],
          ["③", "하위 데이터 집합 둘을 하나로 병합\n병합 시 원소 순서 맞춰 정렬"],
          ["④", "집합이 하나 될 때까지 ③ 반복"],
        ],
      },
      {
        caption: "병합 정렬 과정 (5, 1, 6, 4, 8, 3, 7, 9, 2 정렬)",
        headers: ["구분", "설명"],
        rows: [
          ["분할", "(5 1 6 4 8)(3 7 9 2)\n(5 1 6)(4 8)(3 7)(9 2)\n(5 1)(6)(4)(8)(3)(7)(9)(2)\n(5)(1)"],
          ["정복", "(1 5)(6)(4)(8)(3)(7)(9)(2)\n(1 5 6)(4 8)(3 7)(2 9)\n(1 4 5 6 8)(2 3 7 9)\n1 2 3 4 5 6 7 8 9"],
        ],
      },
    ],
    notes: ["퀵 정렬과 달리 최악의 경우에도 O(n log n)이 보장되며, 안정 정렬(stable sort)이라는 점이 차이"],
  },
  {
    title: "해시 테이블",
    course: "AL",
    definition: "키(key)라는 특별한 인덱스로 자료에 접근하는 배열로 구성되는 자료구조",
    defShort: "키(key)라는 특별한 인덱스로 자료에 접근하는 배열로 된 자료구조",
    lead:
      "키 기반 즉시 접근, 해시 테이블",
    features: ["상수 시간 접근", "충돌 존재", "공간·시간 교환"],
    keywords: ["해시 키", "고정길이", "해시함수", "해시테이블", "버킷", "충돌", "오버 플로우"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["함수", "해시 함수", "키→주소 사상 레코드 주소 계산\n단방향 함수 고정길이 변환"],
          ["입력", "해시 키(Hash Key)", "레코드 키 값 해시함수 입력 값"],
          ["저장 공간", "해시 테이블(Hash Table)", "배열 구조 저장소 키 연산 직접 접근"],
          ["저장 공간", "버킷(bucket)", "하나의 주소 구역 파일 한 구역 지칭\n버킷 크기 의미 주소당 레코드 수"],
          ["저장 공간", "슬롯(Slot)", "레코드 1개 공간 n개 슬롯=버킷"],
          ["파일", "직접파일(Direct File)", "해싱 기반 파일 해싱 기초 구성\n키↔레코드 사상 사상 관계 성립"],
          ["주소", "해싱표", "해시테이블 주소 해시함수 계산 값"],
          ["충돌", "동거자(Synonym)", "동일 주소 레코드 같은 주소로 변환"],
          ["충돌", "충돌(Collision)", "동일 주소 반환 다른 레코드 겹침"],
          ["충돌", "오버 플로우", "버킷 가득 참 빈자리 없는 과잉"],
        ],
      },
    ],
    notes: ["개념도: Key 집합(key#1~#4) → 해시함수 → 주소값 → 해시 테이블 h[] (M개의 버킷 × s개의 슬롯)"],
  },
  {
    title: "해싱과 충돌해결방법",
    course: "AL",
    definition:
      "데이터의 신속한 탐색을 위해 주어진 키 값으로부터 해시함수를 적용하여 주소 값을 계산하고, 계산된 주소 값으로 레코드가 저장되어 있는 위치에 직접 접근하는 방법",
    defShort: "계산된 주소 값으로 레코드가 저장되어 있는 위치에 직접 접근하는 방법",
    lead:
      "주소 계산의 직접 탐색, 해싱과 충돌해결방법",
    features: ["해시함수 주소 계산", "상수 시간 직접 접근", "충돌 존재"],
    keywords: ["나폴리는 중세기다", "선이중무 체코"],
    tables: [
      {
        caption: "해싱 기법 [나폴리는 중세기다]",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["산술 연산", "나눗셈법(Division)", "나머지 연산자 % 테이블 주소 계산\n양의 정수로 나눔 나머지=홈 주소"],
          ["산술 연산", "폴딩법(Folding)", "키 동일 길이 분할 여러 부분 분할\n덧셈·XOR 결과=홈 주소"],
          ["산술 연산", "중간 제곱법(Mid Square)", "레코드 키 제곱 제곱 결과 산출\n중간 비트 선택 몇 비트=홈 주소"],
          ["진법 변환", "기수 변환법(Radix-Exchange)", "키 진법 변환 타 진법으로 간주\n10진→7진 변환 값=홈 주소"],
          ["자릿수 분석", "자릿수 분석법(Digit-Analysis)", "자리별 분포 조사 키 구성 수 분석\n고른 자릿수 선택 자릿수→홈 주소"],
          ["난수", "무작위 방법(Pseudo-Random)", "난수 발생 이용 난수를 홈 주소로"],
        ],
      },
      {
        caption: "충돌 해결방법 [선이중무 체코]",
        headers: ["구분", "해결 방법", "설명"],
        rows: [
          ["개방 주소법", "선형 조사법(Linear Probing)", "충돌 시 다음 주소로 이동"],
          ["개방 주소법", "이차 조사법(Quadratic Probing)", "충돌 시 제곱 간격 다음 주소 이동"],
          ["개방 주소법", "이중 해싱법(Double Hashing Probing)", "충돌 시 제2 해시 함수로 주소 결정"],
          ["개방 주소법", "재해싱(Rehashing)", "충돌 시 새로운 해시 함수로 재해싱"],
          ["폐쇄 주소법", "해시 체이닝(Hash Chaining)", "충돌 레코드 연결 리스트로 연결"],
          ["폐쇄 주소법", "병합 체이닝(Coalesced Hashing)", "빈 슬롯 저장 후 포인터로 연결"],
        ],
      },
    ],
  },
  {
    title: "동적 계획법(Dynamic Programming)",
    course: "AL",
    definition:
      "최적성 원리 문제에 대한 점화관계 도출, 분할, Memoization 기법 활용, 부분 반복 문제의 최적화 해결 위한 Bottom-Up Approach 알고리즘",
    defShort: "최적성 원리, 부분 반복 문제 최적화 해결 Bottom-Up 알고리즘",
    lead:
      "부분 해의 저장과 재사용, 동적 계획법",
    features: ["최적성 원리 전제", "중복 계산 제거", "Bottom-Up 접근"],
    keywords: ["점화/재귀식", "Top-down(메모이제이션 - 재귀)", "Bottom-Up(타뷸레이션 - 반복문)"],
    tables: [
      {
        caption: "전제 조건과 동작 원리",
        headers: ["원리", "설명"],
        rows: [
          ["전제 조건", "최적성 원리 관계식 도출 가능\n점화·재귀식 인접 항 함수 관계"],
          ["① 점화/재귀 관계식 도출", "부분 문제 분할 관계식 기반 분해"],
          ["② Memoization", "테이블 저장 최소 문제 해 계산"],
          ["③ Bottom-Up Approach", "저장 해 활용 최종 최적해 도출"],
        ],
      },
      {
        caption: "접근방법",
        headers: ["구분", "접근방법", "설명"],
        rows: [
          ["하향식", "Top Down", "메모이제이션 저장 내역 참조\n재귀 방식 하위 항 재귀 합산"],
          ["상향식", "Bottom Up", "타뷸레이션 테이블 순차 채움\n반복문 방식 cache 누적"],
        ],
      },
    ],
  },
  {
    title: "그리디(탐욕) 알고리즘",
    course: "AL",
    definition: "선택 시 마다 그 순간 최적의 해를 선택하여 최종적인 해를 도출하는 알고리즘",
    defShort: "선택 시마다 그 순간 최적의 해를 선택해 최종적인 해를 도출하는 알고리즘",
    lead:
      "순간 최적의 선택 반복, 그리디 알고리즘",
    features: ["순간 최적 선택", "선택 번복 없음", "최적해 미보장"],
    keywords: ["[해적검] 해 선택", "적합성 검증", "해 검증"],
    tables: [
      {
        caption: "수행 절차 [해적검]",
        headers: ["단계", "설명"],
        rows: [
          ["해 선택", "부분해 집합에 더할 다음 항목 선택\n현 상태 부분 최적화 기준 만족"],
          ["적합성 검증", "새 부분해 집합 제약조건 위반 검사\n현 집합이 해가 될 가능성 검사"],
          ["해 검증", "새 집합이 문제의 해인지 검사\n해 아니면 (1) 단계로 반복"],
        ],
      },
      {
        caption: "플로우 차트 예시 (770원 거스름돈 최소 동전 수)",
        headers: ["단계", "설명"],
        rows: [
          ["문제정의(동전의 액면)", "목표: 770원 거스름돈 최소 동전 수\n선택: 500/100/50/10원"],
          ["해 선택", "현재 가장 큰 금액 동전 선택"],
          ["적합성 확인", "부분해 제약조건 위반 확인\n목표(770원) 초과 시 미적합"],
          ["해 검증", "현재까지 거스름돈 770원 여부"],
          ["해 도출", "최종해 도출 동전 조합 확정"],
        ],
      },
      {
        caption: "최적해 미도출 사례",
        headers: ["항목", "설명"],
        rows: [
          ["사례 설명", "800원, 400원 동전 새로 생긴 경우\n그리디 사용 시 최적해 미도출"],
          ["거스름돈", "800원"],
          ["동전의 종류", "500·400(추가)·100·50·10원"],
          ["최종해", "500원: 1개, 100원: 3개"],
          ["실제 최적의 해", "400원: 2개"],
        ],
      },
    ],
  },
  {
    title: "허프만(Huffman) 코딩",
    course: "AL",
    definition:
      "가변 길이 부호화로서 자주 발생하는 데이터에는 짧은 부호를, 자주 발생하지 않는 데이터에는 긴 부호를 할당하여 전체 데이터 길이 압축하는 기법",
    defShort: "자주 발생하는 데이터에 짧은 부호, 아닌 데이터에 긴 부호 할당 압축 기법",
    lead:
      "빈도 기반 가변 부호화, 허프만 코딩",
    features: ["무손실 압축", "빈도 기반 가변 길이", "통계적 기법"],
    keywords: ["무손실 압축", "빈도", "통계적 기법", "엔트로피"],
    tables: [
      {
        caption: "알고리즘 동작",
        headers: ["순번", "설명"],
        rows: [
          ["1", "빈도수 내림차순 모든 문자 정렬"],
          ["2", "최소 빈도 쌍 연결 적은 두 문자 결합\n이진 결합 반복 전 문자 연결 반복"],
          ["3", "쌍별 0·1 배정 높은 쪽 0 배정"],
          ["4", "문자별 코드 할당 각 문자 코드 확정"],
        ],
      },
      {
        caption: "사례 (데이터: AAAAABABCCCDBBBCDA)",
        headers: ["과정", "설명"],
        rows: [
          ["데이터", "AAAAABABCCCDBBBCDA"],
          ["발생확률 계산", "A: 빈도 7, 7/18\nB: 빈도 5, 5/18\nC: 빈도 4, 4/18\nD: 빈도 2, 2/18"],
          ["트리생성", "0: P(A)=7/18\n1: P(B)·P(C)·P(D)\n1→0: P(B), 1→1: P(C)·P(D)\n1→1→0: P(C), 1→1→1: P(D)"],
          ["각 문자에 코드 할당", "A: 0\nB: 10\nC: 110\nD: 111"],
          ["데이터 압축", "문자열을 코드로 치환\n아스키 1Byte × 18 = 18Byte\n35bit로 압축"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["활용", "설명"],
        rows: [
          ["데이터 압축", "DEFLATE(PKZIP 알고리즘)에 적용"],
          ["멀티미디어 코덱", "JPEG, MP3 등 기본 알고리즘 활용"],
        ],
      },
    ],
  },
  {
    title: "런랭스(Run Length) 코딩",
    course: "AL",
    definition:
      "데이터에서 같은 값이 연속해서 나타나는 것을 그 개수와 반복되는 값만으로 표현하는 데이터 압축 알고리즘 (Run은 반복되는 문자, Length는 반복되는 횟수를 의미)",
    defShort: "같은 값 연속을 개수와 반복되는 값만으로 표현하는 데이터 압축 알고리즘",
    lead:
      "반복 압축의 단순 부호화, 런랭스 코딩",
    features: ["무손실 압축", "횟수+값 표현", "연속 반복 특화"],
    keywords: ["무손실 압축", "RUN", "LENGTH"],
    tables: [
      {
        caption: "예제",
        headers: ["구분", "예제 1", "예제 2"],
        rows: [
          ["평문", "AAAABBBBBCCCCCCCCDEEEE\n(22byte)", "ABCDDDDDDDDEEEEEEEE\n(19byte)"],
          ["압축", "4A5B8C1D5E\n(10byte)", "ABC*8D*9E\n(9Byte)"],
          ["압축률", "22byte/10byte\n= 2.2%", "19byte/9byte\n= 2.11%"],
          ["적용 방식", "LENGTH, RUN 순서\n변화 잦으면\n압축률 저하", "유일 자료 그대로\n반복 자료만 적용"],
        ],
      },
    ],
    notes: ["허프만 코딩과 비교: 허프만은 빈도 기반 가변 길이 부호화, 런랭스는 연속 반복 구간을 (횟수+값)으로 축약 — 팩스·BMP·단순 이미지처럼 같은 값이 길게 이어지는 데이터에 효과적"],
  },
  {
    title: "다익스트라(Dijkstra) 알고리즘",
    course: "AL",
    definition:
      "음수가 아닌 가중치가 있는 그래프에서 하나의 정점에서 시작하여 모든 다른 정점까지 최단 경로를 구하는 알고리즘",
    defShort: "음수가 아닌 가중치 그래프에서 모든 정점까지 최단 경로 구하는 알고리즘",
    lead:
      "단일 출발 최단 경로, 다익스트라 알고리즘",
    features: ["그리디 기반", "단일 출발 최단경로", "음수 가중치 불가"],
    keywords: ["음수가 아닌 가중치", "무한대(∞) 설정 → 시작 정점 최단경로 추가 → 인접 정점 탐색 → 추가탐색"],
    tables: [
      {
        caption: "수행 과정 (S = 방문한 노드 집합, Q = 방문하지 않은 노드 집합)",
        headers: ["#", "단계 내용", "설명"],
        rows: [
          ["1", "d[A]=0\n타 노드 ∞", "출발지 초기화\n미방문 무한대"],
          ["1", "S={}\nQ 전체 노드", "방문 집합 공백\nA~F 미방문"],
          ["2", "A→S 편입", "출발지 방문"],
          ["2", "d[B]=10\nd[C]=30", "이웃 거리 측정\n초기 경로 값"],
          ["2", "d[D]=15", "D 경로 기록"],
          ["3", "최소 B 선택", "가중치 최저"],
          ["3", "d[E]=20", "B 이웃 갱신"],
          ["4", "최소 D 선택", "가중치 최저"],
          ["4", "d[C]=20\nd[F]=35", "30→20 갱신\nF 경로 발견"],
          ["5", "최소 C 선택", "가중치 최저"],
          ["5", "d[F]=25", "35→25 갱신"],
          ["6", "최소 F 선택", "미방문 이웃 무"],
          ["7", "최소 E 선택\nQ=∅", "마지막 방문\n공집합 도달"],
          ["8", "d[E]=30\nd[F]=25", "E 최단 30\nF 최단 25"],
          ["8", "Q 공집합\nA→D→C→F", "탐색 종료\n최단 경로 25"],
        ],
      },
    ],
    notes: ["핵심 원리: 매 단계 '아직 방문하지 않은 노드 중 거리가 가장 짧은 것'을 선택(그리디)하고, 그 노드를 거쳐 가면 더 짧아지는 경로가 있으면 갱신(Relaxation)", "음수 가중치가 있으면 사용 불가 — 그 경우 벨만-포드 알고리즘을 사용"],
  },
  {
    title: "TF-IDF(Term Frequency - Inverse Document Frequency)",
    course: "AL",
    definition:
      "정보 검색과 텍스트 마이닝에서 이용하는 가중치로, 여러 문서로 이루어진 문서군이 있을 때 어떤 단어가 특정 문서 내에서 얼마나 중요한 것인지를 나타내는 통계적 수치",
    defShort: "어떤 단어가 특정 문서 내에서 얼마나 중요한지를 나타내는 통계적 수치",
    lead:
      "단어 중요도의 계량, TF-IDF",
    features: ["통계적 가중치", "흔한 단어 억제", "문서군 상대 중요도"],
    keywords: ["TF", "IDF", "TDM", "NORM", "내적", "코사인 거리"],
    tables: [
      {
        caption: "정의",
        headers: ["구분", "설명"],
        rows: [
          ["TF(Term Frequency)", "단어빈도 TF 문서 내 등장 빈도\n높을수록 중요 해당 문서 중요도"],
          ["IDF(Inverse Document Frequency)", "역문서 빈도 흔한 단어 낮은 값\nDF 역수 IDF 높으면 중요 단어"],
        ],
      },
      {
        caption: "산출 절차",
        headers: ["순서", "절차", "설명"],
        rows: [
          ["1", "DTM 작성", "문서 행렬 표현"],
          ["2", "단어빈도(TF)\n계산", "등장 빈도 수치\n단어 수 정규화"],
          ["3", "불용어 처리", "조사·시제 제거"],
          ["4", "역문서빈도(IDF)\n산출", "타 문서 등장도\n가중치 낮춤"],
          ["5", "TF-IDF\n계산", "TF×IDF\n곱해 산출"],
        ],
      },
      {
        caption: "문서1과 문서2에 대한 TF-IDF 계산 예",
        headers: ["구분", "계산"],
        rows: [
          ["TF 계산(문서 별 단어의 빈도수)", "this: 문서1=1, 문서2=2 / is:\n1, 1 / a: 2, 0 / sample: 1, 0 /\nanother: 0, 1 / example: 0, 1"],
          ["IDF 계산(단어의 등장 빈도의 역수)", "this: log(2/2)=0 / is:\nlog(2/2)=0 / a:\nlog(2/1)=0.3 / sample: 0.3 /\nanother: 0.3 / example: 0.3"],
          ["TF-IDF 계산(TF × IDF)", "this: 3×log(2/2)=0 / is:\n2×0=0 / a: 2×log(2/1)=0.6 /\nsample: 1×0.3=0.3 /\nanother: 0.3 / example: 0.3"],
        ],
      },
    ],
    notes: ["핵심: 모든 문서에 흔한 단어(this, is)는 IDF가 0이 되어 중요도에서 탈락하고, 특정 문서에만 자주 나오는 단어가 높은 TF-IDF를 얻는다"],
  },
  {
    title: "최소 신장 트리(MST, Minimum Spanning Tree)",
    course: "AL",
    definition:
      "각 간선에 가중치가 있는 무방향그래프에서 모든 정점들을 연결하는 가중치의 합이 최소가 되는 신장 트리",
    defShort: "가중치 무방향 그래프에서 모든 정점을 잇는 가중치 합이 최소인 신장 트리",
    lead:
      "최소 비용의 전체 연결, 최소 신장 트리",
    features: ["가중치 합 최소", "사이클 미형성", "그리디 선택"],
    keywords: ["신장트리", "간선 가중치 최소", "비순환", "프림(Prim)", "크루스칼(Kruscal)"],
    tables: [
      {
        caption: "프림(Prim) 알고리즘",
        headers: ["순서", "설명"],
        rows: [
          ["1)", "시작 정점서 신장 트리 단계적 확장"],
          ["2)", "시작 정점만 신장 트리 집합 포함"],
          ["3)", "인접 정점 중 최저 간선 정점 선택"],
          ["4)", "트리가 n-1개 간선 가지면 종료"],
        ],
      },
      {
        caption: "크루스칼(Kruscal) 알고리즘",
        headers: ["순서", "설명"],
        rows: [
          ["1)", "사이클 없는 최소비용 간선 선택"],
          ["2)", "간선들 가중치 오름차순 정렬"],
          ["3)", "사이클 없는 간선 MST 집합에 추가"],
          ["4)", "사이클 형성 시 그 간선 제외"],
        ],
      },
      {
        caption: "크루스칼 예시 (간선 가중치 오름차순)",
        headers: ["간선", "가중치", "선택 순서"],
        rows: [
          ["BG", "2", "①"],
          ["EG", "3", "②"],
          ["CD", "4", "③"],
          ["AF", "5", "④"],
          ["FG", "7", "⑤"],
          ["DE", "8", "⑥"],
          ["AG / DG / BC / EF / CG / AB", "9 / 10 / 11 / 12 / 13 / 14", "사이클 시 제외"],
        ],
      },
    ],
    notes: ["프림은 '정점 중심'으로 트리를 키워 나가고, 크루스칼은 '간선 중심'으로 가중치가 낮은 간선부터 골라 붙인다 — 둘 다 그리디 알고리즘"],
  },
  {
    title: "트리 순회(Tree Traversal)",
    course: "AL",
    definition: "계층적 구조를 갖는 트리(Tree)의 모든 노드(node)를 한 번씩 체계적으로 방문하는 과정",
    defShort: "계층적 구조를 갖는 트리의 모든 노드를 한 번씩 체계적으로 방문하는 과정",
    lead: "노드 방문 순서의 체계, 트리 순회",
    features: ["모든 노드 1회 방문", "재귀적 수행", "루트 방문 시점 구분"],
    keywords: ["전위 순회(Pre-Order Traversal)", "중위 순회(In-Order Traversal)", "후위 순회(Post-Order Traversal)"],
    tables: [
      {
        caption: "유형",
        headers: ["구분", "전위 순회(Pre-Order)", "중위 순회(In-Order)", "후위 순회(Post-Order)"],
        rows: [
          ["노드 방문 순서", "Root → Left → Right", "Left → Root → Right", "Left → Right → Root"],
          ["의사 코드", "Visit(node)\nPre(node.left)\nPre(node.right)", "In(node.left)\nVisit(node)\nIn(node.right)", "Post(node.left)\nPost(node.right)\nVisit(node)"],
          ["수식 표기", "전위 표기", "중위 표기", "후위 표기"],
        ],
      },
    ],
    notes: ["이진 탐색 트리를 중위 순회하면 값이 정렬된 순서대로 나온다 — 중위 순회의 대표 활용", "수식 트리에 적용하면 전위 순회=전위 표기(prefix), 중위=중위 표기(infix), 후위=후위 표기(postfix)가 된다"],
  },
  {
    title: "그래프 순회(Graph Traversal)",
    course: "AL",
    definition: "주어진 그래프 G=(V, E)에서 정점의 집합 V에 속한 모든 정점들을 한번씩 방문하는 것",
    defShort: "그래프 G=(V, E)에서 집합 V의 모든 정점을 한 번씩 방문하는 것",
    lead:
      "그래프 방문의 두 전략, 그래프 순회",
    features: ["모든 정점 1회 방문", "방문 여부 기록", "선형 시간 수행"],
    keywords: ["깊이 우선 방식(DFS)", "너비 우선 방식(BFS)"],
    tables: [
      {
        caption: "너비 우선 탐색(BFS)과 깊이 우선 탐색(DFS) 비교",
        headers: ["구분", "너비 우선 탐색(BFS)", "깊이 우선 탐색(DFS)"],
        rows: [
          ["개념", "횡방향 탐색\n인접 정점 우선", "종방향 탐색\n최대한 깊게 탐색"],
          ["구현", "큐 이용 구현", "스택·백트래킹"],
          ["장점", "넓은 그래프 유리", "깊은 그래프 유리"],
          ["단점", "깊은 그래프 느림", "넓은 그래프 느림"],
        ],
      },
      {
        caption: "BFS 동작 예 (큐 활용)",
        headers: ["단계", "설명"],
        rows: [
          ["1", "노드1을 큐에 삽입\nQueue: [1]"],
          ["2", "노드1의 첫번째 너비는 2와 3\nQueue: [2, 3]"],
          ["3", "노드2의 첫번째 너비는 4와 5\nQueue: [3, 4, 5]"],
          ["4", "이어서 6, 7 방문\nQueue: [4, 5, 6] → [5, 6, 7]"],
        ],
      },
    ],
    notes: ["DFS는 가중치가 작은 정점(Vertex)부터 방문하며 최대한 깊이 내려간 뒤 더 갈 곳이 없으면 되돌아온다(백트래킹)", "활용: BFS는 최단 경로(가중치 없는 그래프)·친구 추천, DFS는 미로 탐색·위상 정렬·사이클 검출"],
  },
  {
    title: "전송부호화(소스 코딩, 채널 코딩, 라인 코딩)",
    course: "NW",
    definition:
      "아날로그 형태 정보(음성, 영상 등)를 디지털 형태로 효율적 변환 위한 수학적 매핑 및 변환 기법",
    defShort: "아날로그 정보를 디지털로 효율적 변환하기 위한 수학적 매핑·변환 기법",
    lead:
      "아날로그의 디지털 변환, 전송부호화",
    features: ["수학적 매핑 기반", "단계별 순차 적용", "수신 측 역순 복호"],
    keywords: ["소스코딩(압축)", "채널코딩(오류제어)", "라인코딩(bipolar, unipolar, polar)"],
    tables: [
      {
        caption: "소스 코딩",
        headers: ["구분", "분류", "설명"],
        rows: [
          ["개념", "개념", "중복정보 제거 전송데이터 축소\n압축 부호화 효율적 정보전송"],
          ["원천정보 형태 분류", "영상 부호화", "영상정보 대상 영상 부호화\nJPEG 기법 MPEG 활용"],
          ["원천정보 형태 분류", "오디오 부호화", "파형 부호화 오디오 정보 대상\nPCM·DM 음성 파형 부호화"],
          ["코드 길이 고정 여부", "고정 길이 부호화", "FLC 방식 동일 코드길이\nASCII 코드 고정길이 사례"],
          ["코드 길이 고정 여부", "가변 길이 부호화", "사용빈도 기반 코드 길이 가변\n모스부호 가변길이 사례"],
          ["데이터 손실 여부", "무손실 압축 부호화", "복원 시 일치 원본 데이터 일치\n허프만·런렝스 무손실 코딩 사례"],
          ["데이터 손실 여부", "손실 압축 부호화", "복원 불일치 원본 데이터 손실\nJPEG 등 손실 압축 사례"],
        ],
      },
      {
        caption: "채널 코딩",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "잉여비트 추가 송수신 합의 부가\n오류 검출·정정 잡음 오류 복원"],
          ["개념도", "잉여 비트 부가 전송 속도 저하\nFEC 복원 수신측 자체 복원"],
        ],
      },
      {
        caption: "라인 코딩",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "디지털 신호 변환 기저대역 신호\n동기·오류 검출 수신 동기 재생"],
          ["개념도", "라인코딩 변환 데이터→신호\n링크 전송 수신측 복원"],
        ],
      },
    ],
    notes: ["전송 부호화 개념도 — 송신: 아날로그신호 → A/D변환 → 소스코딩 → 채널코딩 → 라인코딩(기저대역) 또는 변조(대역통과) → 전송 / 수신: 복조 → 채널디코딩 → 소스디코딩 → D/A변환 → 아날로그신호"],
  },
  {
    title: "PCM(Pulse-Code Modulation)",
    course: "NW",
    definition:
      "아날로그 신호를 표본화 정리로 정해지는 표본화 주파수로 표본화하고, 각 표본(샘플)의 값을 양자화 한 후, 2진 부호화 하는 디지털 변조방식",
    defShort: "아날로그 신호를 표본화, 양자화 후 2진 부호화하는 디지털 변조방식",
    lead:
      "표본화·양자화·부호화, PCM",
    features: ["디지털 변조 방식", "표본화 정리 기반", "2진 부호 전송"],
    keywords: ["표본화(Sampling)", "양자화(Quantization)", "부호화(Encoding)", "디지털화", "아날로그신호를 디지털신호로 변환(A/D변환)", "나이퀴스트"],
    tables: [
      {
        caption: "동작 원리 — 송신",
        headers: ["동작", "설명"],
        rows: [
          ["표본화(Sampling)", "표본간격 PAM 펄스열 추출\n나이퀴스트 이론 fs≥2fm"],
          ["양자화(Quantization)", "PAM 디지털화 진폭 이산값 변환\n레벨 2^n 표본당 비트 n"],
          ["부호화(Encoding)", "펄스 진폭 크기 2진수 코드 표시"],
        ],
      },
      {
        caption: "동작 원리 — 수신",
        headers: ["동작", "설명"],
        rows: [
          ["재생", "수신된 디지털\n신호를 재생하는\n단계"],
          ["복호화(Decoding)", "수신된 디지털\n신호(PCM)을 PAM신호로\n되돌리는 단계"],
          ["재구성(Filtering)", "PAM 신호를\n원래의 아날로그\n신호로 복원하는\n단계"],
        ],
      },
      {
        caption: "나이퀴스트 샘플링 정리",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "fs≥2fm 원신호 복원 가능\n최고주파수 2배 샘플링 조건"],
          ["샘플링 사례", "나이퀴스트 기준 적절한 샘플링\n언더샘플링 앨리어싱 발생"],
        ],
      },
    ],
    notes: ["동작 구조도: 아날로그신호 → [송신기] 표본화 → 양자화 → 부호화 → 전송로 → [수신기] 재생 → 복호화 → 재구성 → 아날로그신호. 중간의 디지털신호가 PCM신호"],
  },
  {
    title: "QAM(Quadrature Amplitude Modulation)",
    course: "NW",
    definition:
      "정보 신호에 따라 반송파의 진폭과 위상을 동시에 변화시켜, PSK의 변조 원리에 진폭 변조까지 포함하는 변조 방식",
    defShort: "정보 신호에 따라 반송파의 진폭과 위상을 동시에 변화시키는 변조 방식",
    lead:
      "진폭·위상 동시 변조, QAM",
    features: ["진폭·위상 변조", "다중 비트 심볼", "계층적 변조 가능"],
    keywords: ["디지털 변조 방식", "진폭 변조", "위상 변조"],
    tables: [
      {
        caption: "16QAM 성상도(Constellation Diagram)",
        headers: ["구분", "설명"],
        rows: [
          ["X 축", "동위상 반송파 I 축 성분 표시"],
          ["Y 축", "구상 반송파 Q 축 성분 표시"],
          ["심볼 코딩", "심볼당 n bit n비트 코딩\n1심볼 4비트 16QAM 경우"],
          ["심볼 표현", "심볼 0000 기준 심볼 표현\n위상 φ 진폭 a 위상 진폭 지정"],
          ["심볼 표현", "0011 심볼 동일 위상 심볼\n0001 심볼 진폭 차이 구분"],
          ["심볼 표현", "0000 심볼 다른 위상 배치\n1000 심볼 같은 진폭 유지"],
          ["16 QAM", "진폭 3가지 진폭 변조 활용\n위상 12가지 위상 변조 활용"],
        ],
      },
      {
        caption: "QAM 활용 계층적 변조 방식 예 (64QAM)",
        headers: ["구분", "설명"],
        rows: [
          ["비트 할당", "심볼당 6비트 64QAM 할당\n상위 2비트 QPSK 이용"],
          ["신호 상태 좋음", "전체 QAM 좌표 6비트 모두 추출"],
          ["신호 상태 나쁨", "QPSK 부분만 상위 2비트 추출"],
          ["우선순위", "높은 우선순위 상위 2비트 코딩\n낮은 우선순위 하위 4비트 코딩"],
          ["적용", "DVB-T 표준 디지털 TV 적용"],
        ],
      },
    ],
  },
  {
    title: "CSMA/CD",
    course: "NW",
    definition:
      "각각의 호스트가 링크를 사용하기 전에 링크의 사용 상태를 감지하여 전송 충돌을 최소화하기 위한 프로토콜",
    defShort: "링크 사용 전 링크의 사용 상태를 감지해 전송 충돌을 최소화하는 프로토콜",
    lead:
      "충돌 감지의 매체 접근, CSMA/CD",
    features: ["전송 전 채널 감지", "충돌 후 재전송", "유선 LAN 한정"],
    keywords: ["1-Persistent", "Non-Persistent", "P-Persistent", "충돌", "Back-off"],
    tables: [
      {
        caption: "동작원리",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["송신 준비", "송신 데이터 준비", "디바이스 송신 위해 데이터 준비"],
          ["채널 감시", "채널 Free", "데이터 송신 후 채널 감시\n미충돌 시 프레임 전송 완료"],
          ["채널 감시", "충돌 발생", "Jamming Signal 전송\nBack-off 방식 대기·재전송 시도"],
          ["채널 감시", "채널 Busy", "데이터 송신 위해 채널 재탐색 수행"],
        ],
      },
      {
        caption: "Persistent 방식 3종",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["즉시 전송", "1-Persistent", "회선 휴지 감지 시 즉시 프레임 전송\nidle 때마다 1의 확률로 전송"],
          ["지연 전송", "Non-Persistent", "전송 프레임 있는 지국 회선 감지\n채널 사용 중 감지 시 임의 시간 지연"],
          ["확률 전송", "P-Persistent", "두 방식 장단점 상호 보완\n확률값(p)로 전송여부 결정"],
        ],
      },
    ],
    notes: ["동작 흐름도: 송신준비 → 채널 감시 → (채널 Free) 데이터 송신 및 채널 감시 → 충돌 없이 종료 / (충돌 발생) Jam 신호 전송 → Back-off 방식에 따라 대기 → 새로운 시도 / (채널 Busy) 채널 감시로 복귀", "유선 LAN(이더넷)에서 사용 — 무선은 충돌 감지가 어려워 CSMA/CA를 사용"],
  },
  {
    title: "빔 탐색(Beam Search)",
    course: "AL",
    definition:
      "여러 경우 중 하나를 결정하지 않고 Beam Size(K개)만큼 가장 가능도가 높은 후보군으로 선택하여 Greedy 알고리즘의 최적해 미보장 단점을 보완한 최적해 알고리즘",
    defShort: "가능도 높은 K개 후보군 선택, 최적해 미보장 단점 보완 최적해 알고리즘",
    lead: "가능도 상위 K개 유지, 빔 탐색",
    features: ["상위 K개 후보 유지", "Greedy 단점 보완", "정확도·연산 상충"],
    keywords: ["최적해 미보장 단점 보완", "최적해", "Beam size"],
    tables: [
      {
        caption: "알고리즘 수행절차",
        headers: ["No", "수행 절차", "수행 항목"],
        rows: [
          ["①", "문제 정의", "조건·제약 확인"],
          ["②", "최초 K개 해 선택", "Beam Size K개\n확률 기반 최초 해\n만족 K개 확인"],
          ["③", "부분 해 확장", "제약조건 여부\n확률 기반 Score"],
          ["④", "K개 해 선택", "최고 확률 K개 해\n나머지 후보 삭제\n③·④ 반복"],
          ["⑤", "최종 해 선택", "확률 점수 최고"],
        ],
      },
      {
        caption: "자연어 처리의 Beam Search 활용 사례 (Beam size = 2)",
        headers: ["단계", "설명"],
        rows: [
          ["1단계", "<S>에서 I(0.4), the(0.3) 유지"],
          ["2단계", "I → am(0.8) / do(0.5)\nthe → cat(0.4) / dog(0.6)\n상위 2개 유지"],
          ["3단계", "am → cat(1.0) / dog(0.8)\ndog → barked(0.9) / sleep(0.7)"],
          ["최종", "\"I am cat\"(1.0) 선택\n\"the dog barked\"(0.9) 미선택"],
        ],
      },
      {
        caption: "활용 사례",
        headers: ["구분", "설명"],
        rows: [
          ["자연어 처리", "단일 예측 보완 확률 K개 선택\nSeq2Seq 디코딩 최적화"],
        ],
      },
    ],
    notes: ["개념도: <START>에서 A(0.5)·C(0.4) 선택 → A는 AB(0.2)·AE(0.25)로, C는 후보 탈락(X) → AB→ABC(0.16), AE→AED(0.2) → Candidate Sequences: A,C → AB,AE → ABC,AED", "Beam size가 1이면 그리디 알고리즘과 같고, 무한대면 완전 탐색(BFS)과 같다 — K가 클수록 정확하지만 계산량 증가"],
  },
  {
    title: "CSMA/CA",
    course: "NW",
    definition:
      "무선 LAN 환경에서 충돌 감지가 어려운 특성을 고려하여, 전송 전에 회선을 감시하고 충돌을 사전에 회피하는 매체 접근 제어 프로토콜",
    defShort: "무선 LAN에서 전송 전 회선 감시로 충돌을 피하는 매체 접근 프로토콜",
    lead:
      "충돌 회피의 무선 접근, CSMA/CA",
    features: ["충돌 사전 회피", "히든 노드 해결", "ACK 기반 확인"],
    keywords: ["충돌 회피", "IFS", "RTS/CTS", "NAV", "Back-off", "ACK"],
    tables: [
      {
        caption: "CSMA/CD와 CSMA/CA 비교",
        headers: ["구분", "CSMA/CD", "CSMA/CA"],
        rows: [
          ["적용 환경", "유선 이더넷", "무선 Wi-Fi"],
          ["핵심 개념", "충돌 검출 방식\n충돌 후 재전송", "충돌 회피 방식\n충돌 사전 예방"],
          ["충돌 감지", "전송 중 신호 감시\n충돌 감지 가능", "히든 노드 문제\nACK 확인 필요"],
          ["주요 기법", "Jam 신호 전송\nBack off", "IFS·NAV\nRTS/CTS"],
        ],
      },
      {
        caption: "주요 기술 요소",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["대기 제어", "IFS(Inter Frame Space)", "유휴 후 일정 대기 우선순위 부여"],
          ["대기 제어", "Back-off", "IFS 후 대기 동시 전송 억제"],
          ["채널 예약", "RTS/CTS", "요청·준비 교환 RTS/CTS\n채널 예약 히든 노드 해결"],
          ["채널 예약", "NAV(Network Allocation Vector)", "가상 반송파 감지 타 단말 전송 자제"],
          ["응답 확인", "ACK", "수신 ACK 확인 미수신 시 재전송"],
        ],
      },
    ],
    notes: ["핵심 한 줄: 유선은 부딪히면 알아채고 다시 보내지만(CD), 무선은 부딪혔는지 알 수 없으니 아예 안 부딪히게 예약하고 확인받는다(CA)"],
  },
  {
    title: "다중화(Multiplexing)",
    course: "NW",
    definition:
      "여러 신호를 동시에 송수신할 수 있도록, 하나의 전송로를 분할시켜, 다수의 채널로 분할하여 전송하는 기술",
    defShort: "하나의 전송로를 다수의 채널로 분할해 여러 신호를 동시에 전송하는 기술",
    lead:
      "하나의 전송로, 여러 채널, 다중화",
    features: ["단일 전송로 분할", "다채널 동시 전송", "단일 송신 지점"],
    keywords: ["FDM", "TDM", "SDM", "CDM", "WDM"],
    tables: [
      {
        caption: "다중화 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["주파수 축", "FDM(주파수)", "주파수 분할 대역폭 분할 사용"],
          ["시간 축", "TDM(시간)", "타임슬롯 분할 회선 시간 분할"],
          ["코드 축", "CDM(코드)", "상호 직교 코드 확산 대역 전송"],
          ["파장 축", "WDM(파장)", "파장별 광신호 광섬유 한 가닥\n저손실 대역 손실 적은 주파수"],
          ["공간 축", "SDM(공간)", "다수 물리 채널 하나의 논리 채널"],
        ],
      },
      {
        caption: "다중화 vs 다원접속",
        headers: ["구분", "다중화(Multiplexing)", "다원접속(Multiple Access)"],
        rows: [
          ["목적", "전송매체 효율\n통신비용 절감", "자원 공동 이용\n사용자 구분"],
          ["송신측", "송신 지점 한 곳\n동일 지점 송출", "송신 지점 여러 곳\n독립 터미널 송출"],
          ["다중화", "단일 송신국 발신", "여러 단말기 발신"],
          ["기술유형", "FDM·TDM\nCDM·WDM·SDM", "FDMA·TDMA\nCDMA·WDMA"],
          ["전파방향", "하향 링크 방향", "상향 링크 방향"],
        ],
      },
    ],
    notes: ["개념도: 데이터1·2·3을 각각 타임슬롯으로 분할(시분할액세스 TDMA) → 기지국에서 다중화하여 하나의 캐리어로 송신(시분할다중 TDM) → 수신 측은 자기에게 전송된 프레임을 수신"],
  },
  {
    title: "서비스 프리미티브(Service Primitive)",
    course: "NW",
    definition:
      "네트워크 계층화 아키텍처에서 한 계층이 서비스를 수행하기 위해 다른 계층을 필요로 할 때 계층간 통신 서비스 기본형식",
    defShort: "계층이 서비스 수행 위해 다른 계층 필요 시 계층간 통신 서비스 기본형식",
    lead:
      "계층 간 통신의 기본형, 서비스 프리미티브",
    features: ["계층 간 추상화", "구현 독립 표현", "상하향 교차 흐름"],
    keywords: ["요구(Request)", "지시(Indication)", "응답(Response)", "확인(Confirm)"],
    tables: [
      {
        caption: "종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["요청 측", "요청(Request)", "상위→하위 요구 전송·연결 요청"],
          ["응답 측", "지시(Indication)", "하위→상위 통보 데이터 도착 알림"],
          ["응답 측", "응답(Response)", "상위→하위 응답 지시 처리 통보"],
          ["요청 측", "확인(Confirm)", "하위→상위 확인 응답 도착 알림"],
        ],
      },
      {
        caption: "표현 사례 — T.CONNECT.request(called address, calling address, …, user data)",
        headers: ["구분", "설명"],
        rows: [
          ["① 서비스 제공 계층", "L: Link Layer\nN: Network Layer\nT: Transport Layer\nS: Session Layer"],
          ["② 수행되는 동작 이름", "CONNECT, DATA 등"],
          ["③ 프리미티브 방향", "Request, Indication\nResponse, Confirmation"],
          ["④ 파라미터", "주소, 사용자 데이터\n원하는 서비스 형태\n데이터 최대크기 등"],
        ],
      },
    ],
    notes: ["동작 흐름: 송신측 상위계층 1.Request(하향) → 수신측 하위계층 2.Indication(상향) → 수신측 3.Response(하향) → 송신측 4.Confirm(상향)", "표현 예 해석: Transport 계층(T)에서 접속(CONNECT)을 요구(Request)하면서, 착·발신 주소를 알려주며 사용자 데이터를 송부"],
  },
  {
    title: "OSI 7 Layer (ISO 7498)",
    course: "NW",
    definition: "국제표준기구(ISO)에서 표준화된 네트워크 구조를 제시한 기본 모델",
    defShort: "국제표준기구(ISO)가 표준화한 네트워크 구조를 제시한 기본 모델",
    lead:
      "네트워크 구조의 참조 모델, OSI 7 Layer",
    features: ["계층별 독립 서비스", "표준 참조 모델", "캡슐화 기반 전달"],
    keywords: ["[아파서티내다]", "Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"],
    tables: [
      {
        caption: "계층별 역할과 프로토콜 [아파서티내다]",
        headers: ["계층", "상세설명", "프로토콜"],
        rows: [
          ["7계층 Application", "사용자 접근 제공\nUI·전자우편\nDB 관리 서비스", "HTTP, SMTP, SNMP\nFTP, Telnet, NFS\nRTSP, NTP"],
          ["6계층 Presentation", "I/O 데이터를\n표현 형태로 변환\n두 장치 일관 이해", "JPEG, MPEG\nXDR, SMB\nAFP"],
          ["5계층 Session", "통신세션 구성\n포트연결 확인\n상호작용 동기화", "TLS, SSH, RPC\nNetBIOS\nAppleTalk"],
          ["4계층 Transport", "제어·에러 관리\n재전송 신뢰 보장", "TCP, UDP, RTP\nSCTP, SPX"],
          ["3계층 Network", "다중 링크에서\n패킷 목적지 전달\n시작~최종까지\n전달되도록 관리", "IP, ICMP, IGMP\nX.25, CLNP, ARP\nRARP, BGP, OSPF\nRIP, IPX, DDP"],
          ["2계층 Data Link", "오류 없이 프레임\n장치 간 전달\nMAC 주소 참조\n해당 포트 전송", "PPP, HDLC\nEthernet\nTokenRing\nISDN, FDDI"],
          ["1계층 Physical", "물리 매체로\n비트 흐름 전송\n물리적 접속 제어", "RS-232C, 광 섬유\n동축케이블\nISDN, DSL"],
        ],
      },
      {
        caption: "계층별 데이터 단위와 장비",
        headers: ["구분", "설명"],
        rows: [
          ["데이터 단위(PDU)", "Network 패킷 단위\nL4 L2 L1 세그먼트~비트"],
          ["중계 장비", "라우터·브리지 3·2계층 장비\n리피터 1계층 장비"],
          ["캡슐화/역캡슐화", "송신 헤더 부착 하향 캡슐화\n수신 헤더 제거 상향 역캡슐화"],
        ],
      },
    ],
    notes: ["OSI 7 Layer는 각 계층마다 특정한 서비스를 제공하고, 이를 위한 각각 프로토콜이 존재함"],
  },
  {
    title: "HTTP/3",
    course: "NW",
    definition:
      "UDP+TLS 웹 페이지 로딩 시간 개선과 동시에 혼잡제어 및 손실 복구 가능한 구글 QUIC 기반의 응용계층 프로토콜",
    defShort: "혼잡제어 및 손실 복구 가능한 구글 QUIC 기반의 응용계층 프로토콜",
    lead: "QUIC 기반 웹 규약, HTTP/3",
    features: ["0-RTT/1-RTT 연결", "HOL 블로킹 해결", "멀티 스트리밍 전송"],
    keywords: ["QUIC(QUICK UDP Internet Connections)", "TLS 1.3", "UDP", "HTTP 1.1 HOL 블로킹 문제 해결", "0-RTT", "1-RTT Handshake"],
    tables: [
      {
        caption: "프로토콜 스택",
        headers: ["구분", "HTTP/2", "HTTP/3"],
        rows: [
          ["스택 구성", "HTTP/2\nTLS·TCP", "QUIC UDP\nTLS 1.3"],
          ["특징", "TCP 기반\n연결형 전송", "UDP 기반\n성능·보안 향상"],
        ],
      },
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["0-RTT/1-RTT 연결", "이전 연결 캐시된 자격 증명 사용"],
          ["HOL 블로킹 해결", "다중 Stream 제공\n개별 Stream 내 흐름 제어"],
          ["멀티 스트리밍 전송", "멀티플렉싱 스트림 손실 최소화"],
          ["Selective ACK(SACK)", "오류 발생시 재전송 통해 에러 복구"],
          ["Seamless Connection", "Connection ID 사용\nIP·Port 변경 시에도 연결 유지"],
          ["보안성 강화", "두 번째 패킷부터 0-RTT\n1개 패킷으로 암호화된 연결 설정"],
        ],
      },
      {
        caption: "동작 과정",
        headers: ["구분", "동작 과정", "설명"],
        rows: [
          ["Initial 1-RTT Handshake", "Inchoate CHLO(Client Hello)", "시작 알리는 Inchoate(시작단계)\n암호화되지 않은 CHLO 패킷 전송"],
          ["Initial 1-RTT Handshake", "Rejection", "서버 설정·암호화 토큰 포함 패킷"],
          ["Initial 1-RTT Handshake", "Complete CHLO", "연결 완료, 이후 암호화 통신 가능"],
          ["Successful 0-RTT Handshake", "Complete CHLO", "이전 캐싱된 자격증명 사용\nEncrypted Request 바로 전송"],
          ["Rejected 0-RTT Handshake", "1-RTT Handshake 재 수행", "캐싱 정보 오래된 경우 수행"],
        ],
      },
      {
        caption: "HOL(Head Of Line) 블로킹",
        headers: ["설명"],
        rows: [
          ["패킷을 대기 행렬에 큐잉하여 FIFO처리함 (대기열의 머리에 있는 패킷은 대기열의 끝에 있는 패킷보다 먼저 전달)"],
          ["순차 처리 제약으로 인해 머리가 처리 되지 않으면 후속 패킷은 대기하게 됨"],
          ["동일한 송신 포트에 대한 처리량 경쟁으로 처리량 지연 및 프레임 손실 발생"],
        ],
      },
    ],
  },
  {
    title: "TCP 연결의 설정 및 해제(Handshaking)",
    course: "NW",
    definition: "TCP 세션 수립 및 종료를 위해 수행하는 절차",
    defShort: "TCP 세션의 수립(3-way)과 종료(4-way) 연결 절차",
    lead:
      "세션 수립과 종료의 절차, TCP 핸드셰이킹",
    features: ["연결지향적", "신뢰성 보장", "Half-Close 종료"],
    keywords: ["3-way handshake와 4-way handshake", "신뢰성", "연결지향적", "SYN", "ACK", "FIN", "데이터그램"],
    tables: [
      {
        caption: "3-way handshake (TCP 세션 수립)",
        headers: ["단계", "설명"],
        rows: [
          ["초기연결시도", "서버 포트·클라이언트 ISN 지정\nSYN 세그먼트 전송"],
          ["서버응답", "서버 ISN 포함 SYN 세그먼트로 응답\n클라이언트 ISN+1 ACK 확인 응답"],
          ["클라이언트 응답", "서버 ISN+1 ACK로 확인응답 전송"],
        ],
      },
      {
        caption: "3-way handshake 상태 전이",
        headers: ["Client state", "동작", "Server state"],
        rows: [
          ["Closed → SYN-SENT", "Connect()\n→ SYN(a)", "LISTEN\n→SYN-RECVED"],
          ["SYN-SENT", "← SYN(b)\n+ACK(a+1)", "SYN-RECVED\n확인 응답 포함"],
          ["→ ESTABLISHED", "ACK(b+1)\n→", "→ESTABLISHED\n수락 반환"],
        ],
      },
      {
        caption: "4-way handshake (TCP 세션 종료)",
        headers: ["단계", "설명"],
        rows: [
          ["연결종료 요청", "Client가 Server에 연결 종료 요청"],
          ["서버 ACK 신호", "바로 종료하지 않고 ACK 전송\nCLOSE_WAIT 상태로 넘어감"],
          ["서버 FIN 신호", "잔여 작업 종료 후 FIN 전송\n연결 종료 시도"],
          ["클라이언트 ACK", "서버 FIN 수신 ACK를 서버에 전송\nACK 받으면 서버 종료"],
        ],
      },
    ],
    notes: ["종료가 4단계인 이유: 서버가 FIN을 받아도 아직 보낼 데이터가 남아 있을 수 있어 ACK와 FIN을 나눠 보낸다(Half-Close)", "TIME_WAIT: 마지막 ACK가 유실될 경우를 대비해 일정 시간 대기 후 완전 종료"],
  },
  {
    title: "TCP 혼잡제어",
    course: "NW",
    definition:
      "네트워크로 유입되는 사용자 트래픽(데이터에 대한 표현)의 양이 네트워크 용량을 초과하지 않도록 유지시키는 메커니즘",
    defShort: "유입 트래픽 양이 네트워크 용량을 초과하지 않도록 유지하는 메커니즘",
    lead:
      "트래픽 폭주의 억제, TCP 혼잡제어",
    features: ["송신 윈도 조절", "지수·선형 증가", "손실 기반 감지"],
    keywords: ["Slow Start", "Congestion Avoidance", "Fast Retransmission", "Fast Recovery"],
    tables: [
      {
        caption: "메커니즘 4단계",
        headers: ["구성", "설명"],
        rows: [
          ["느린 출발(Slow Start)", "초기 CWND 전송마다 2배 증가\nACK 수신 실패 시 감소"],
          ["혼잡회피(Congestion Avoidance)", "ACK 수신마다 CWND 선형 증가"],
          ["빠른 전송(Fast Retransmission)", "다음 수신할 Sequence Number 알림\n이후 Slow Start로 전송"],
          ["빠른 회복(Fast Recovery)", "손실 세그먼트 전송 후\nCongestion Avoidance 수행"],
        ],
      },
      {
        caption: "알고리즘 유형",
        headers: ["구분", "단계", "설명"],
        rows: [
          ["Tahoe 알고리즘", "Slow start", "임계치까지 윈도우 지수적 증가"],
          ["Tahoe 알고리즘", "Congestion Avoidance", "임계치 도달 후 윈도우 1씩 증가"],
          ["Tahoe 알고리즘", "Time out", "임계치를 줄이고 재시작"],
          ["Reno 알고리즘", "Slow Start", "임계치까지 윈도우 지수적 증가"],
          ["Reno 알고리즘", "Congestion Avoidance", "임계치 도달 후 윈도우 1씩 증가"],
          ["Reno 알고리즘", "Fast Recovery", "Congestion Avoidance 수행"],
          ["New Reno 알고리즘", "Partial ACK 도입", "윈도우 내 다수 패킷 손실 시\nRTO까지 대기 문제 해결\n패킷 하나 복구에 한번의 RTT"],
        ],
      },
    ],
    notes: ["메커니즘 그래프: Slow Start(지수 증가) → ssthresh 도달 → 혼잡회피(선형 증가) → 손실 발생 → Fast Retransmit → Fast Recovery(사이즈 절반에서 다시 선형적으로 증가). 초기버전이 Taho(e) TCP, 이후 버전이 Reno TCP", "위 4단계를 통해 처리하는 과정을 TCP 혼잡제어(Congestion Control)라고 함"],
  },
  {
    title: "TCP 와 UDP 비교",
    course: "NW",
    definition: "연결 지향형인 TCP와 비 연결 지향형인 UDP 비교",
    defShort: "연결 지향형 TCP와 비 연결 지향형 UDP의 4계층 통신 프로토콜 비교",
    lead:
      "신뢰와 속도의 대비, TCP와 UDP 비교",
    features: ["연결형·비연결형", "신뢰성·속도 상충", "제어 기능 유무"],
    keywords: ["연결지향", "순서제어", "흐름제어", "혼잡제어", "오류제어", "제어 플래그"],
    tables: [
      {
        caption: "TCP와 UDP 비교",
        headers: ["구분", "TCP", "UDP"],
        rows: [
          ["정의", "4계층 프로토콜\n연결형 전송", "비연결형 제공\n빠른 응답"],
          ["주요 기능", "연결·순서제어\n흐름·혼잡제어", "비연결 비신뢰\n빠른 전송·검출"],
          ["데이터 순서", "순서 유지", "순서 미유지"],
          ["데이터 중복", "중복·손실 없음", "중복·손실 가능"],
          ["연결지향", "연결지향 방식", "비연결 지향"],
          ["전송속도", "상대적 느림", "상대적 빠름"],
          ["에러체크", "오류제어 재전송", "재전송 없음"],
          ["헤더크기", "20 바이트", "8 바이트"],
          ["흐름제어", "슬라이딩 윈도우", "흐름제어 없음"],
          ["사용 프로토콜", "HTTP FTP\nSMTP 등", "DNS SNMP\nRIP 등"],
        ],
      },
      {
        caption: "TCP 제어 플래그 (6종)",
        headers: ["플래그", "설명"],
        rows: [
          ["① URG (Urgent)", "긴급 비트 1 긴급 데이터 표시\n우선 송신 순서 무관 전송"],
          ["② ACK (Acknowledgement)", "확인응답 번호 응답 번호 설정\n필드 설정 수신 확인 통보"],
          ["③ PSH (Push)", "버퍼링 없이 대기 없이 수신\n즉시 전달 응용에 전달"],
          ["④ RST (Reset)", "강제 리셋 요청 연결 회선 초기화"],
          ["⑤ SYN (Synchronize)", "순서번호 동기화 연결 설정 초기화"],
          ["⑥ FIN (Finish)", "송신 종료 통보 데이터 전송 끝"],
        ],
      },
      {
        caption: "헤더 구조",
        headers: ["구분", "구조", "설명"],
        rows: [
          ["TCP 헤더 (20 byte, 무옵션시)", "발신지 포트\n목적지 포트", "송신 포트 주소\n수신 포트 주소"],
          ["TCP 헤더 (20 byte, 무옵션시)", "Seq No\nAck No", "순서 번호 필드\n확인 응답 번호"],
          ["TCP 헤더 (20 byte, 무옵션시)", "HLEN 4비트\n예약 6비트", "헤더 길이 표시\n미사용 예약"],
          ["TCP 헤더 (20 byte, 무옵션시)", "제어플래그 6종\nURG ACK", "플래그 6개 비트\n긴급·확인"],
          ["TCP 헤더 (20 byte, 무옵션시)", "PSH RST\nSYN FIN", "푸시 연결 초기화\n연결 설정 종료"],
          ["TCP 헤더 (20 byte, 무옵션시)", "Window\n검사합 필드", "윈도우 크기\n오류 검출 값"],
          ["TCP 헤더 (20 byte, 무옵션시)", "Urgent\nOptions", "긴급 포인터\n옵션·패딩"],
          ["UDP 헤더 (8 byte)", "송신지 포트\n수신지 포트", "출발지 16비트\n목적지 16비트"],
          ["UDP 헤더 (8 byte)", "전체 길이 필드\n검사합 필드", "16비트 길이\n16비트 검사합"],
        ],
      },
    ],
  },
  {
    title: "IPv4와 IPv6 터널링",
    course: "NW",
    definition:
      "IPv6/IPv4 호스트와 라우터에서 IPv6 데이터 그램을 IPv4 패킷에 캡슐화하여 IPv4 라우팅 토폴로지 영역을 통해 전송하는 방법",
    defShort: "IPv6 데이터 그램을 IPv4 패킷에 캡슐화해 IPv4로 전송 방법",
    lead:
      "IPv6 전환의 가교, IPv4와 IPv6 터널링",
    features: ["IPv6 over IPv4", "기존 IPv4 경유", "듀얼 스택 종단"],
    keywords: ["듀얼 스택", "터널링", "주소 변환"],
    tables: [
      {
        caption: "유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["병행", "듀얼 스택(Dual Stack, 라우팅 관점)", "양쪽 스택 탑재 라우터에 장착\nDNS 지원 필요 스택 수정 비용"],
          ["경유", "터널링(Tunneling, 네트워크)", "IPv4 터널 중간 구간 통과\n패킷 캡슐화 양쪽 망 연결"],
          ["변환", "주소 변환(Address Translation, G/W 방식)", "주소변환기 양 망 상호 연동\nG/W 연동 스택 수정 불필요"],
        ],
      },
      {
        caption: "주소 변환 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["네트워크 계층", "헤더변환(Header Conversion)방식", "헤더 직접 변환 양방향 변환"],
          ["전송 계층", "수송계층 릴레이(Transport Relay)방식", "전송 계층 중계 양쪽 연결 중계"],
          ["응용 계층", "응용계층 게이트웨이(ALG: Application-Level Gateway) 방식", "응용 프락시 응용 계층 중계\nHTTP 중계 프로토콜 변환"],
        ],
      },
    ],
    notes: ["터널링 개념도: Node A(IPv6/IPv4) → IPv4 Infrastructure 구간에 IPv6 Over IPv4 Tunnel 생성 → IPv4/IPv6 Router → IPv4 or IPv6 Infrastructure → Node B(IPv6)"],
  },
  {
    title: "DNS(Domain Name System)",
    course: "NW",
    definition: "Host Name 또는 URL을 IP Address로 변환하기 위한 Protocol",
    defShort: "Host Name 또는 URL을 IP Address로 변환 프로토콜",
    lead:
      "이름과 주소의 변환, DNS",
    features: ["이름→IP 변환", "계층적 분산 구조", "재귀·반복 질의"],
    keywords: ["Recursive", "Iterative"],
    tables: [
      {
        caption: "동작 원리",
        headers: ["단계", "설명"],
        rows: [
          ["1", "Client는 자신에게\n등록된 DNS\n서버에 www.test.com의\nIP질의 — Recursive Query"],
          ["2", "로컬 DNS서버에\n등록되지 않은\n이름은 Root DNS서버에\n질의 — Iterative Query"],
          ["3", "Root DNS서버는 자신이\n관리하는 TLD(.com)의\nDNS서버 IP제공"],
          ["4", "로컬 DNS서버는 TLD(.com)\nDNS서버에 질의"],
          ["5", ".com DNS서버는 test.com\n도메인의 DNS\n정보 제공"],
          ["6", "로컬 DNS서버는 test.com의\nDNS서버인 ns.test.com에\n질의"],
          ["7", "ns.test.com은 자신의\n레코드 중 www\n호스트명의 IP를\n제공"],
          ["8", "로컬 DNS서버는 Client에\n해당 IP를 제공"],
          ["9", "Client는 로컬\nDNS서버로부터\n제공받은 IP Address로\nwww.test.com에 접속"],
        ],
      },
      {
        caption: "주요 기능",
        headers: ["기능", "상세 내용"],
        rows: [
          ["Name Resolution", "URL을 IP Address로 변환"],
          ["Host Aliasing", "단일 IP Address를 보유한\n호스트에 다양한\n별칭 부여"],
          ["Mail Server Aliasing", "해당 도메인의\n메일 서버 정보\n제공"],
          ["Load Distribution", "단일 URL(Host Name)에\n복수개의 IP Address 설정을\n통한 부하 분산"],
        ],
      },
    ],
    notes: ["Recursive Query(재귀 질의): 클라이언트→로컬 DNS 서버 — 답을 대신 찾아달라고 위임 / Iterative Query(반복 질의): 로컬 DNS 서버→Root·TLD·Authoritative — 다음에 물어볼 곳을 알려주면 직접 찾아감"],
  },
  {
    title: "라우팅 알고리즘(Routing Protocol, 거리벡터, 링크상태)",
    course: "NW",
    definition: "라우팅 테이블을 생성, 유지, 업데이트, 전달하는 프로토콜",
    defShort: "라우팅 테이블을 생성·유지·업데이트·전달하는 라우팅 프로토콜",
    lead:
      "경로 결정의 프로토콜, 라우팅 알고리즘",
    features: ["동적 경로 갱신", "Metric 기반 선택", "수렴·부하 교환"],
    keywords: ["거리벡터 라우팅", "링크상태 라우팅", "Metric 정보", "홉수(Hop count)", "심볼길이(Symbolic length)", "벨만-포드", "다익스트라"],
    tables: [
      {
        caption: "거리벡터(Distance Vector Routing)",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["정의", "정의", "이웃 갱신 정보 주기적 경로 결정\n벨만-포드 홉 수 기반 계산"],
          ["동작방식", "동작방식 ①", "C노드 테이블 송신 정보 수신"],
          ["동작방식", "동작방식 ②", "수신 정보 반영 A노드 거리 합산\n비용 고려 테이블 갱신"],
          ["동작방식", "동작방식 ③", "변경 전후 비교 테이블 정보 비교"],
          ["동작방식", "동작방식 ④", "홉 수 비교 큰 값이면 갱신\n최소값 선택 아니면 유지"],
          ["프로토콜", "RIP", "이웃 경로 비교 라우팅 정보 교환\n적은 값 갱신 테이블 갱신"],
          ["프로토콜", "IGRP", "전송능력·지연 복합 지표 경로\n사용률·신뢰성 로드밸런싱"],
        ],
      },
      {
        caption: "링크상태(Link State Routing)",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["정의", "정의", "링크 비용 합 최소 경로 계산\n다익스트라 테이블 기록"],
          ["동작방식", "동작방식 ①", "LSA 수집 이웃 상태 정보"],
          ["동작방식", "동작방식 ②", "토폴로지 DB 링크 정보 저장"],
          ["동작방식", "동작방식 ③", "SPF 계산 목적지 경로 계산"],
          ["동작방식", "동작방식 ④", "SPF 트리 최단 경로 트리"],
          ["동작방식", "동작방식 ⑤", "라우팅 테이블 트리 기반 생성"],
          ["프로토콜", "OSPF", "링크 상태 수집 최적 경로 계산"],
          ["프로토콜", "EIGRP", "IGRP 기반 개방형 프로토콜\n라우터 대역폭/처리 능력 이용\n토폴로지 변경 후 불안정 최소화"],
        ],
      },
    ],
    notes: ["한 줄 비교: 거리벡터는 '이웃이 알려준 거리'만 믿고 홉 수로 판단(벨만-포드, RIP·IGRP), 링크상태는 '전체 지도'를 만들어 최소 비용 경로를 직접 계산(다익스트라, OSPF·IS-IS). EIGRP는 둘의 특성을 섞은 고급 거리벡터(하이브리드)로 분류"],
  },
  {
    title: "FEC(Forward Error Correction) / BEC(Backward Error Correction)",
    course: "NW",
    definition: "잉여비트를 통한 에러 복원 혹은 재전송을 통하여 오류를 제어하는 기법",
    defShort: "잉여비트를 통한 에러 복원 혹은 재전송을 통하여 오류를 제어하는 기법",
    lead:
      "오류 제어의 두 방향, FEC와 BEC",
    features: ["잉여비트 자체 정정", "ARQ 재전송 정정", "오버헤드 지연 상충"],
    keywords: ["Parity Check", "Stop and Wait", "Go-back-N", "Selective-Repeat", "Adaptive ARQ", "Block Sum", "CRC", "Check Sum", "Hamming Code"],
    tables: [
      {
        caption: "FEC (전진 오류 정정)",
        headers: ["분류", "기법", "설명"],
        rows: [
          ["정의", "잉여비트 추가\n수신측 정정", "송신 시 부가\n자체 오류 복원"],
          ["블록 코드(Block Code)", "해밍 코드", "패리티 비트 정해진 위치에 둠\n오류 비트 알아내 정정"],
          ["블록 코드(Block Code)", "RS 코드", "비2진 순환부호 정정능력 우수\n랜덤·연집(Burst) 오류 모두 정정"],
          ["논블록 코드(Non-block Code)", "길쌈 코드", "Convolutional Code\n과거 입력신호 함께 활용\n메모리 갖는 부호화"],
          ["논블록 코드(Non-block Code)", "터보 코드", "길쌈부호 조합 랜덤 병렬 연접"],
        ],
      },
      {
        caption: "BEC (후진 오류 정정)",
        headers: ["분류", "기법", "설명"],
        rows: [
          ["정의", "오류 검출 통보\n재전송 정정", "송신측에 통보\n재전송 방식"],
          ["오류 검출(Error Detect)", "Parity Check", "끝에 한 비트 추가\n1의 개수로 오류 유무 판단"],
          ["오류 검출(Error Detect)", "Block Sum", "이차원 패리티 검사\n가로·세로 두 번 검사"],
          ["오류 검출(Error Detect)", "CRC", "이진 나눗셈 연산 기반 오류 검출"],
          ["오류 검출(Error Detect)", "Check Sum", "모든 데이터 합계를 보수화해 전송\n수신 측 합산 검사"],
          ["재전송(Retransmission)", "Stop and Wait", "1개 프레임 송신\n수신 측 에러 유무 판단\nACK/NAK 전송"],
          ["재전송(Retransmission)", "Go-Back-N", "오류(NACK) 프레임부터 재전송"],
          ["재전송(Retransmission)", "Selective-Repeat", "오류(NACK) 프레임만 재전송"],
          ["재전송(Retransmission)", "Adaptive ARQ", "채널 효율 위해 블록 길이 동적 변경"],
        ],
      },
    ],
    notes: ["한 줄 비교: FEC는 '스스로 고침'(재전송 없음, 잉여비트 오버헤드·실시간 방송에 유리), BEC는 '다시 보내달라'(ARQ, 오버헤드는 적지만 지연 발생)"],
  },
  {
    title: "해밍코드(Hamming code)",
    course: "NW",
    definition:
      "코드의 전송 시 발생하는 오류를 Parity bit 이용해 검출 뿐만 아니라 오류 정정가능한 코드",
    defShort: "전송 오류 Parity bit로 검출 뿐만 아니라 오류 정정가능한 코드",
    lead:
      "검출을 넘어 정정까지, 해밍코드",
    features: ["Parity bit 기반", "오류 위치 정정", "중복 비트 부가"],
    keywords: ["2^p ≥ d+p+1", "1,2,4,8 비트 짝수 패리티", "검사결과 0이면 정상 아니면 2진으로 오류정정"],
    tables: [
      {
        caption: "송수신, 오류검출 및 정정 절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. Parity bit 수 결정", "2^p ≥ d+p+1\n데이터 비트 4 → 패리티 3\n데이터 비트 7 → 패리티 4"],
          ["2. Parity bit 위치 결정", "2^0~(p-1) 위치에 삽입\n패리티 4개면 1,2,4,8번째"],
          ["3. Parity bit 값 결정", "짝수 패리티 해당 비트 검사\nP1~P8 결정 값 각각 결정"],
          ["4. 데이터와 패리티 비트 위치 지정", "전송 데이터 88(1011000)\n비트 위치에 배치"],
          ["5. 해밍 코드 생성", "1 위치 확인 7 9 11 위치\nXOR 연산 결과 0101"],
          ["6. 해밍 코드 생성 결과", "XOR 0101 생성 코드 완성"],
        ],
      },
      {
        caption: "오류 검출 및 정정",
        headers: ["단계", "설명"],
        rows: [
          ["7. 패리티 비트 영역 검사", "P1~P8 검사 수신 패리티 검사\n짝수 패리티 0101 값 확인"],
          ["8. 정상 전송 검증", "검사 결과 0 정상 전송 확인"],
          ["9. 오류 검출", "0 아닌 결과 전송 오류 발생"],
          ["10. 오류 정정", "검사값 나열 오류 위치 산출\n2진→10진 해당 비트 반전"],
        ],
      },
    ],
  },
  {
    title: "CRC(Cyclic Redundancy Check)",
    course: "NW",
    definition:
      "이진 나눗셈 연산을 기반으로 오류를 검출하는 방식으로 성능이 우수하며, 여러 비트에서 발생하는 집단 오류(Burst Error)도 검출 가능한 오류 검출 기법",
    defShort: "이진 나눗셈 연산을 기반으로 집단 오류까지 검출 가능한 오류 검출 기법",
    lead: "다항식 나눗셈 오류 검출, CRC",
    features: ["다항식 나눗셈", "집단 오류 검출", "나머지 0 판정"],
    keywords: ["Divisor", "다항식", "나머지 연산"],
    tables: [
      {
        caption: "CRC 처리 과정",
        headers: ["단계", "설명", "특징 및 관련요소"],
        rows: [
          ["Encoding(CRC 계산)", "데이터+n비트를\n(n+1)비트로 나눔\n코드 워드 생성", "Divisor는\n대수다항식 표현\nx⁸+x²+x+1"],
          ["Transmission(Data+CRC)", "코드 워드를\n수신측에 전송", "비신뢰 전송\n손실·중복 가능"],
          ["Decoding(에러체크)", "Divisor로 나눔\n나머지 0 → 정상", "0 아니면 에러\n재전송 요청"],
        ],
      },
      {
        caption: "CRC 계산 예시",
        headers: ["구분", "상세 설명"],
        rows: [
          ["데이터 워드", "1011010"],
          ["다항식", "CRC-8 = X⁸+X²+X+1\n(100000111)"],
          ["코드 워드 계산", "데이터 워드 + 초기 CRC(0..0)\nXOR 연산 나눗셈\n나머지 10000001"],
          ["전송 데이터", "코드 워드 = 1011010 + 10000001\n전송데이터 = 101101010000001"],
        ],
      },
    ],
  },
  {
    title: "QoS(Quality of Service)",
    course: "NW",
    definition:
      "한정된 네트워크 망의 대역폭을 효율적으로 사용하게 하고, 네트워크 트래픽을 정책 별로 제어하여 인터넷 종단 간 서비스 품질을 향상 시키는 기술",
    defShort: "트래픽을 정책별로 제어해 인터넷 종단 간 서비스 품질을 향상시키는 기술",
    lead:
      "종단 간 품질 보장, QoS",
    features: ["정책별 트래픽 제어", "종단 간 품질 보장", "등급별 차등 처리"],
    keywords: ["대역폭", "지연", "지터", "패킷손실", "자원예약", "RSVP", "우선순위", "DSCP"],
    tables: [
      {
        caption: "주요 지표 [대지터패]",
        headers: ["주요 지표", "설명"],
        rows: [
          ["대역폭", "처리 가능한 최대 데이터 처리 능력"],
          ["지연", "주파수에 따라 겪는 시간 지연"],
          ["지터", "펄스 파형 시간축 상 흐트러짐"],
          ["패킷 손실", "패킷 왕복 중 발생하는 데이터 유실"],
        ],
      },
      {
        caption: "관리 기술",
        headers: ["구분", "기술 요소", "상세 설명"],
        rows: [
          ["데이터 Path 매커니즘", "분류기·표시기\n미터·폐기처리기\n쉐이퍼", "개별 패킷 처리\n라우터가 수행\n다양 서비스 제공"],
          ["트래픽 쉐이핑(Shaping)", "Leaky Bucket\nToken Bucket", "버킷 속도 평준화\n토큰 유무로 제어"],
          ["혼잡제어", "RED\nWRED", "혼잡 전 랜덤 폐기\n가중치 RED 적용"],
          ["수락제어", "전송 정책", "전송 대상 결정"],
          ["큐잉(Queuing)", "FIFO Queuing\nPriority Queuing\nWFQ", "단일 큐 저장\n클래스별 FIFO\n가중 RR 방식"],
        ],
      },
      {
        caption: "보장 기술",
        headers: ["구분", "설명"],
        rows: [
          ["IntServ", "RSVP로 요구 자원 사전 예약\n유입 트래픽 수락제어로 QoS 제공"],
          ["DiffServ", "DS 필드에 DSCP 마킹\n클래스별 PHB 우선순위 기반 QoS"],
        ],
      },
    ],
    notes: ["IntServ는 흐름별로 자원을 미리 예약(세밀하지만 확장성 낮음), DiffServ는 패킷에 등급 표시만 하고 홉마다 그 등급대로 처리(확장성 높음) — 실무는 DiffServ 중심"],
  },
  {
    title: "ARP(Address Resolution Protocol)",
    course: "NW",
    definition:
      "LAN 환경에서 논리 주소인 IP주소를 물리 주소인 MAC주소로 변환해 주는 네트워크 계층의 프로토콜",
    defShort: "논리 주소인 IP주소를 물리 주소인 MAC주소로 변환하는 프로토콜",
    lead: "IP 주소의 MAC 변환, ARP",
    features: ["IP→MAC 변환", "브로드캐스트 요청", "유니캐스트 응답"],
    keywords: ["IP를 MAC으로 변환"],
    tables: [
      {
        caption: "동작 원리 — MAC Address 요청 (Broadcast)",
        headers: ["순서", "설명"],
        rows: [
          ["①", "D의 MAC 필요 IP 인지 상태"],
          ["②", "ARP 요청 요청 패킷 생성\n목적지 FF FF 주소 채움"],
          ["③", "브로드캐스트 네트워크 전파"],
        ],
      },
      {
        caption: "동작 원리 — MAC Address 회신 (Unicast)",
        headers: ["순서", "설명"],
        rows: [
          ["①", "수신 IP 확인 자기 주소 판단"],
          ["②", "ARP 응답 응답 패킷 생성\n주소 교환 출발·목적 반전"],
          ["③", "유니캐스트 호스트 A 전달"],
          ["④", "캐시 테이블 수정 MAC 등록 통신"],
        ],
      },
    ],
    notes: ["요청은 모두에게(Broadcast, FF:FF:FF:FF:FF:FF), 응답은 요청자에게만(Unicast) — 이 비대칭이 시험 포인트", "반대 방향(MAC → IP)은 RARP"],
  },
  {
    title: "RARP(Reverse Address Resolution Protocol)",
    course: "NW",
    definition:
      "IP호스트가 자신의 물리 네트워크 주소(MAC)는 알지만 IP주소를 모르는 경우, 서버로부터 IP주소를 요청하기 위해 사용하는 프로토콜",
    defShort: "물리 주소(MAC)만 알 때 서버로부터 IP주소를 요청하는 프로토콜",
    lead: "MAC로 IP 주소 획득, RARP",
    features: ["MAC→IP 변환", "RARP 서버 의존", "DHCP로 대체"],
    keywords: ["MAC을 IP로 변환"],
    tables: [
      {
        caption: "동작 원리",
        headers: ["구분", "설명"],
        rows: [
          ["RARP Request", "RARP 주소 몰라 Request Broadcast\n모든 컴퓨터 수신, 서버만 응답\nRARP Request is broadcast"],
          ["RARP Response", "서버 2대 이상이면 모두 응답\n첫 Response만 수신, 나머지 무시\nRARP Reply is unicast"],
        ],
      },
      {
        caption: "ARP와 RARP 비교",
        headers: ["구분", "ARP", "RARP"],
        rows: [
          ["변환 방향", "IP → MAC", "MAC → IP"],
          ["상황", "상대 IP 인지\nMAC 미인지", "자신 MAC 인지\nIP 미인지"],
          ["요청", "브로드캐스트", "브로드캐스트"],
          ["응답", "유니캐스트\n해당 호스트", "유니캐스트\nRARP 서버"],
        ],
      },
    ],
    notes: ["예: \"My physical address is A4:6E:A5:57:82:36. I am looking for my IP address.\" → \"Your IP address is 141.14.56.21\"", "오늘날은 대부분 DHCP로 대체되었다"],
  },
  {
    title: "DHCP(Dynamic Host Configuration Protocol)",
    course: "NW",
    definition:
      "호스트에 IP 주소 할당을 위해 DHCP Discover, Offer, Request, Ack의 4단계 할당 과정 이용하는 동적 호스트 IP 자동 할당 프로토콜",
    defShort: "IP 할당 위해 4단계 과정 이용하는 동적 호스트 IP 자동 할당 프로토콜",
    lead:
      "IP 자동 할당의 절차, DHCP",
    features: ["동적 IP 자동 할당", "임대 기반 갱신", "브로드캐스트 탐색"],
    keywords: ["DISCOVER", "OFFER", "REQUEST", "ACK", "DHCP Starvation"],
    tables: [
      {
        caption: "DHCP IP 할당 과정 (UDP 68 → UDP 67)",
        headers: ["단계", "할당 과정", "설명"],
        rows: [
          ["①", "DISCOVER", "Client Broadcast Discover 전송"],
          ["②", "OFFER", "Server가 Unicast로 Offer 전송\n제안 IP주소, 임대시간, DNS 정보"],
          ["③", "REQUEST", "Client가 Broadcast Request 전송\n제안 IP 주소 사용 승인 의사 전달"],
          ["④", "ACK", "Server가 Unicast로 Ack 전송\n제안 IP 사용 최종 승인 및 할당 종료"],
        ],
      },
      {
        caption: "IP 갱신 과정",
        headers: ["단계", "갱신 과정", "설명"],
        rows: [
          ["①", "REQUEST", "Client Unicast로 연장 의사 전달\n임대시간 50% 남은 시점 전달"],
          ["②", "ACK", "Server가 Unicast로 Ack 전송\nIP 사용 연장 최종 승인 및 할당 종료"],
        ],
      },
      {
        caption: "IP 해제 과정",
        headers: ["단계", "해제 과정", "설명"],
        rows: [
          ["①", "RELEASE", "Client Unicast로 종료 의사 전달\nServer 응답 없이 IP 할당 해제 종료"],
        ],
      },
    ],
    notes: ["포트: 클라이언트 UDP 68, 서버 UDP 67", "DHCP Starvation: 공격자가 위조 MAC으로 대량의 DHCP 요청을 보내 IP 풀을 고갈시키는 공격"],
  },
  {
    title: "SCTP(Stream Control Transmission Protocol)",
    course: "NW",
    definition:
      "UDP의 메시지 지향 특성(Message Oriented)과 TCP의 연결 지향(Connection Oriented) 신뢰성을 조합한 전송 계층 프로토콜",
    defShort: "UDP 메시지 지향 특성과 TCP 연결 지향을 조합한 전송 계층 프로토콜",
    lead:
      "TCP와 UDP의 절충, SCTP",
    features: ["메시지 지향 연결형", "멀티호밍 이중화", "HOL 블로킹 완화"],
    keywords: ["Multi-homing", "Multi-streaming", "4 way handshaking", "SACK & Heartbeat", "3 way handshaking"],
    tables: [
      {
        caption: "기술 요소",
        headers: ["기술요소", "설명"],
        rows: [
          ["Multi Homing", "여러 IP 주소 동시 사용\n장애 시 대체 경로로 세션 유지"],
          ["Multi Streaming", "하나의 세션, 다양한 응용데이터"],
          ["4-way Handshake(초기화)", "세션 초기화 4단계절차 구성\nSCTP-A: INIT 전송 초기화\nSCTP-Z: IP 주소 포함 INIT-ACK\nECO, ACK 교환, 초기화 마무리"],
          ["SACK & HEARTBEAT(전송)", "SACK(Selective ACK) 오류 제어\nHEARTBEAT 메시지로 가용 IP 파악"],
          ["3-way Handshake(세션종료)", "3단계 구성\n'Half-open Closing' 해결"],
        ],
      },
      {
        caption: "계층 구조",
        headers: ["계층", "설명"],
        rows: [
          ["SCTP User Application", "응용 프로그램"],
          ["API's", "응용과 SCTP 사이 인터페이스"],
          ["SCTP Transport Service", "SCTP 전송 서비스\n다중 IP 주소 사용"],
          ["IP Network Service", "IP 네트워크 서비스\nSCTP Node A↔B Network Transport"],
        ],
      },
    ],
    notes: ["TCP와의 차이: TCP는 3-way 수립·4-way 종료인데 SCTP는 반대로 4-way 수립(COOKIE로 SYN 플러딩 방어)·3-way 종료(Half-close 미허용)", "활용: 통신망 시그널링(SIGTRAN), WebRTC 데이터 채널"],
  },
  {
    title: "C-RAN(Centralized / Cloud RAN)",
    course: "NW",
    definition:
      "기존 기지국의 디지털 장치(DU: Digital Unit)와 RF 장치를 분리하여 여러 기지국의 DU를 중앙에 모아서 처리하고, RF 장치는 서비스 지역에 분산시키는 무선 접속망",
    defShort: "기지국 DU·RF 장치 분리, DU 중앙·RF 장치 분산 무선 접속망",
    lead:
      "기지국 기능의 중앙 집중, C-RAN",
    features: ["DU 중앙 집중", "RF 지역 분산", "셀 간섭 조정"],
    keywords: ["DU와 RF 분리", "RU", "CPRI", "OBSAI", "ORI"],
    tables: [
      {
        caption: "기술 요소",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["구성 요소", "RU(Radio Unit)", "DU 디지털 신호 RF 신호로 변환\n안테나 송·수신 변환 장치\nRF 증폭기로 구성"],
          ["구성 요소", "Centralized DU(Data Unit)", "클라우드 센터 형태 한 곳에 집중\n셀 간의 간섭 조정 용이\n협력 통신 등 고품질 서비스 가능"],
          ["인터페이스 규격 종류", "CPRI(Common Public Radio Interface)", "REC(DU측)와 RE(RU측) 간 송·수신\nUser Data, 제어/관리, 동기 정보"],
          ["인터페이스 규격 종류", "OBSAI(Open Baseband Remote Radiohead Interface)", "개방형 기지국 구조 목표\n기지국 기능 모듈 단위로 나눔\nRP(Reference Point)로 모듈 연결\nCPRI와 유사한 경쟁 규격"],
          ["인터페이스 규격 종류", "ORI(Open Radio Interface)", "CPRI 호환성 한계 극복\n벤더 간 호환성 개선\nETSI 주도 표준화"],
        ],
      },
    ],
    notes: ["구성도: RRH(무선부문, 리모트 라디오 헤드) ←프론트홀→ 중앙 집중화된 디지털부문(DU) → 접속노드(PoP) → 패킷 코어"],
  },
  {
    title: "O-RAN",
    course: "NW",
    definition:
      "네트워크 장비 운용에 필요한 RAN(Radio Access Network) 구간에 가상화 기술을 적용하여 Hardware와 Software를 분리하기 위한 Apache 2.0 License의 개방형 아키텍처",
    defShort: "RAN 구간에 가상화 기술 적용해 HW와 SW를 분리한 개방형 아키텍처",
    lead:
      "개방형 무선 접속망, O-RAN",
    features: ["RAN 가상화", "HW·SW 분리", "인터페이스 개방"],
    keywords: ["무선접속망(Radio Access Network) 규격 통일", "가상화", "O-RU", "O-DU", "O-CU"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구성 요소", "기반 기술", "설명"],
        rows: [
          ["RIC(RAN Intelligent Controller)", "RIC near-RT\nRIC non-RT", "데이터 수집·분석 기반\nRAN 요소·자원 제어 최적화"],
          ["O-CU(O-RAN Centralized Unit)", "RRC\nSDAP\nPDCP", "RRC·PDCP 실행 중앙 집중 장치\nCU-CP·CU-UP 구성\nMidhaul로 여러 O-DU 제어"],
          ["O-DU(O-RAN Distributed Unit)", "RLC\nMAC\nHigh PHY", "O-RU 근처 위치\nRLC·MAC·PHY 일부 실행 분산 장치"],
          ["O-RU(O-RAN Radio Unit)", "Digital Front End (DFE)\nRF Front End (RF FE)\nLow PHY\nBeamforming", "안테나 근처 위치 혹은 통합\n무선 신호→디지털 신호 변환\nFronthaul로 O-DU 전송"],
        ],
      },
      {
        caption: "아키텍처 인터페이스",
        headers: ["인터페이스", "구간"],
        rows: [
          ["A1", "Orchestration &\nAutomation(ONAP: MANO,\nNMS)의 RIC non-RT ↔ RIC\nnear-RT"],
          ["E2", "RIC near-RT ↔ CU/DU"],
          ["E1", "CU-CP(RRC, PDCP-C) ↔\nCU-UP(SDAP, PDCP-U)"],
          ["F1", "CU ↔\nO-DU(RLC/MAC/PHY-high)"],
          ["Open Front Haul", "O-DU ↔ O-RU(PHY-low/RF)"],
        ],
      },
    ],
    notes: ["구간 명칭: RU ←Fronthaul→ DU ←Midhaul→ CU ←Backhaul→ 5G 코어", "특정 벤더 장비에 종속되지 않도록 인터페이스를 개방 표준화한 것이 핵심 — NFVI Platform(가상화 계층 + COTS 범용 하드웨어) 위에서 동작"],
  },
  {
    title: "RAN(Radio Access Network) Sharing",
    course: "NW",
    definition:
      "이동통신망에서 서로 다른 사업자가 동일한 주파수 사용시 발생되는 간섭 문제 해결을 위해 기지국, 코어망, Gateway를 공유 사용하며 MOCN, MORAN, GWCN 기술 활용하는 무선 인프라 공유 기술",
    defShort: "주파수 간섭 해결 위해 기지국·코어망을 공유하는 무선 인프라 공유 기술",
    lead:
      "무선 인프라의 공동 이용, RAN Sharing",
    features: ["무선 인프라 공유", "주파수 간섭 해결", "공유·차별화 상충"],
    subDefs: [
      {
        name: "MOCN(Multiple Operator Core Network)",
        lead: "주파수까지 공유의 방식",
        def: "주파수·기지국·컨트롤러는 공유하고 코어망은 별도로 구성하는 방식",
      },
      {
        name: "MORAN(Multiple Operator Radio Access Network)",
        lead: "주파수 구분의 공유 방식",
        def: "기지국과 컨트롤러는 공유하되 주파수는 구분해서 사용하는 공유 방식",
      },
      {
        name: "GWCN(GateWay Core Network)",
        lead: "코어망 일부까지 공유",
        def: "코어망의 MME와 S-GW까지 공유하고 P-GW만 따로 두는 방식",
      },
    ],
    keywords: ["MOCN", "MORAN", "GWCN"],
    tables: [
      {
        caption: "공유 방식 비교",
        headers: ["구분", "개념", "장점", "단점"],
        rows: [
          ["MOCN(Multiple Operator Core Network)", "주파수 공유\n기지국 공유\n컨트롤러 공유\n코어망 별도", "구현·비용 유리\n인터페이스 단순\n공유 비용 절감", "차별화 어려움\n공용 RAN 사용\n품질 차별 곤란"],
          ["MORAN(Multiple Operator Radio Access Network)", "기지국 공유\n컨트롤러 공유\n주파수 구분\n코어망 별도", "차별화 가능\n대역폭 조절\n품질 차별화", "구현·비용 불리\n복잡성 증가\n절감 효과 저하"],
          ["GWCN(GateWay Core Network)", "주파수·기지국\n컨트롤러 공유\nMME·S-GW 공유\nP-GW 별도", "비용 유리\n공유 요소 증대\nMOCN 대비 감소", "구현 불리\n공유 요소 증대\n복잡성 증대"],
        ],
      },
    ],
    notes: ["공유 범위 순서: MORAN(주파수 분리) < MOCN(주파수까지 공유) < GWCN(코어망 MME·S-GW까지 공유) — 공유를 많이 할수록 비용은 줄지만 차별화는 어렵고 구현은 복잡해진다"],
  },
  {
    title: "5G 특화망",
    course: "NW",
    definition:
      "기존 이동통신 상용망이 아닌 전용 주파수를 통해 특정공간(건물, 시설, 장소 등)에서 수요기업이 도입하는 최첨단 서비스 구현할 수 있는 맞춤형 네트워크",
    defShort: "전용 주파수를 통해 특정공간에서 수요기업이 도입하는 맞춤형 네트워크",
    lead: "전용 주파수 특정공간 구축, 5G 특화망",
    features: ["전용 주파수 사용", "특정공간 한정", "수요기업 맞춤형"],
    keywords: ["전용 주파수", "4.7GHz", "28GHz", "자가구축", "On-Premise형", "5G Core CP 공유형", "5G Core 전체 공유형", "MEC", "SDN", "NFV", "Open RAN"],
    tables: [
      {
        caption: "구성 요소",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["무선 자원", "5G 주파수", "5G 주파수 or 독자 주파수\n4.7GHz, 28GHz"],
          ["코어", "UPF(User Plane Function)", "패킷 라우팅 및 포워딩\n패킷 검사, QoS 처리\n외부 PDU 세션 등 담당\nDN(Data Networks) 상호 연결"],
          ["엣지", "MEC(Multi-access Edge Computing)", "코어·인터넷망 미사용\n사용자 인접 MEC 서버 처리\n저지연 요구사항 만족\n코어·인터넷망 혼잡 완화"],
          ["접속", "gNB", "5G 무선 네트워크 기지국"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["기술", "설명"],
        rows: [
          ["SDN", "Control plane과 Data Plane\n분리 기반 SW 정의\n네트워크"],
          ["NFV", "네트워크 장비의\n네트워크 기능\n가상화"],
          ["Network Slicing", "SDN, NFV 기반 물리적\n네트워크의\n용도별 논리적\n네트워크 분리"],
          ["Open RAN", "CU/DU/RU 분리, 개방형 표준\n무선 기술"],
          ["RAN Sharing", "사설망과 공중망\n간 gNB 공유 기법"],
        ],
      },
      {
        caption: "5G 특화망 유형",
        headers: ["구분", "유형"],
        rows: [
          ["자가구축", "On-Premise 형"],
          ["이음 5G 사업자", "On-Premise 형\n5G Core CP 공유형\n5G Core 전체 공유형"],
        ],
      },
    ],
    notes: ["구성도: 단말 ↔ 액세스 망 ↔ 코어 망, 전체를 OSS(운영지원시스템)가 관리", "국내에서는 '이음 5G'라는 이름으로 4.7GHz·28GHz 대역을 기업에 할당"],
  },
  {
    title: "네트워크 슬라이싱",
    course: "NW",
    definition:
      "물리적으로 하나의 네트워크를 논리적으로 분리하여, 서로 다른 특성을 갖는 다양한 서비스에 특화된 전용 네트워크를 제공하는 5G 네트워크 핵심기술",
    defShort: "논리적 분리로 다양한 서비스에 특화된 전용 네트워크 제공 5G 핵심기술",
    lead:
      "논리 분할의 전용망, 네트워크 슬라이싱",
    features: ["논리적 분리", "서비스 특화 전용망", "네트워크 가상화"],
    keywords: ["SDN", "NFV", "RAN"],
    tables: [
      {
        caption: "슬라이스 예시",
        headers: ["슬라이스", "대상 서비스"],
        rows: [
          ["통신/인터넷망 Slice", "Mobile — 통신, 인터넷"],
          ["물류/기후망 Slice", "Massive IoT — 물류, 기후"],
          ["스마트카/스마트 팩토리 Slice", "Mission critical\n스마트카, 스마트 팩토리"],
        ],
      },
      {
        caption: "핵심기술 SDN",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "제어 기능 분리해 중앙 집중화\n개방형 API로 S/W 컨트롤러가 제어"],
          ["application", "Network OS 위 사용자 서비스 지원"],
          ["Control plane", "Global View로 전체 망 제어\nOpenflow로 Flow Table 제어"],
          ["Data plane", "단순 패킷 포워딩·스위칭만 구현\nL2·L3 스위치에 OpenFlow 추가"],
        ],
      },
      {
        caption: "핵심기술 NFV",
        headers: ["구분", "설명"],
        rows: [
          ["개념", "N/W 장비 내 여러 기능 분리\nS/W로 제어·관리 가능하게 가상화"],
          ["NFVI", "물리 HW 자원: 컴퓨팅·저장소·N/W\n가상화 지원 기능\nVNF 실행 지원 기능"],
          ["VNFs", "응용 지원 S/W 네트워크 기능 집합"],
          ["MANO", "물리적·소프트웨어적 자원 관리\n전달, VNF 관리 기능"],
        ],
      },
    ],
    notes: ["SDN 구조: Application Plane → Control Plane →(Openflow)→ Data Plane (S/W 영역과 H/W 영역 분리)", "NFV 구조: VNF들이 NFVI(가상화 인프라) 위에서 동작하고 NFV MANO가 관리"],
  },
  {
    title: "NWDAF(Network Data Analytics Function)",
    course: "NW",
    definition:
      "네트워크 운영 중 발생하는 다양한 정보를 수집해 AI 모델을 만들고, 이 모델을 기반으로 네트워크를 실시간으로 제어 기능을 수행하는 3GPP에서 정의한 표준 기술이며 네트워크 장비",
    defShort: "AI 모델로 네트워크 실시간 제어 3GPP 표준 기술이며 네트워크 장비",
    lead:
      "망 데이터의 AI 분석, NWDAF",
    features: ["AI 기반 실시간 제어", "학습·추론 분리", "3GPP 표준 기능"],
    keywords: ["AnLF", "MTLF", "DCCF", "ADRF", "MFAF"],
    tables: [
      {
        caption: "표준 기능 — 분석·학습",
        headers: ["구분", "핵심 기능", "설명"],
        rows: [
          ["AnLF(Analytics Logical Function)", "분석 논리 함수\n머신 러닝(Machine Learning) 기반 추론", "추론 수행 NWDAF 논리적 기능\n분석 정보 도출·분석 서비스 제공\n분석 요청 수집·소비자 응답"],
          ["MTLF(Model Training Logical Function)", "모델 학습 논리 함수\n머신 러닝(Machine Learning) 학습", "ML 모델 학습·새 ML 모델 제공\n추론 마이크로서비스 학습·배포"],
        ],
      },
      {
        caption: "표준 기능 — 데이터 관리",
        headers: ["구분", "핵심 기능", "설명"],
        rows: [
          ["DCCF(Data Collection Coordination and Delivery Function)", "데이터 요청 관리", "동일 요청 시 기존 결과 NWDAF 전송\n아니면 OAM/NF 데이터 전송"],
          ["ADRF(Analytical Data Repository Function)", "분석 데이터 저장소", "필요한 과거 데이터 저장"],
          ["MFAF(Messaging Framework Adaptor Function)", "메시징 프레임워크 어댑터 기능", "수집 데이터 NWDAF(AnLF)에 전달"],
        ],
      },
    ],
    notes: ["구성도: NWDAF(MTLF) ⇄ Model Microservice(Train & Deploy Model) / NWDAF(AnLF)가 Model Endpoint·Prediction 이용 → NF(Analytical Consumer)가 Request Analytics → DCCF → MFAF ⇄ ADRF, OAM/NF(Data Provider)가 Initiate data transfer"],
  },
  {
    title: "네트워크 지능",
    course: "NW",
    definition:
      "네트워크 제어 및 운용·관리 기술을 AI 기술을 기반으로 자율의사결정 방법에 따라 완전 자동화 방식으로 운용되는 네트워크",
    defShort: "AI 기반 자율의사결정에 따라 완전 자동화 방식으로 운용되는 네트워크",
    lead:
      "AI 자율 운용의 망, 네트워크 지능",
    features: ["AI 자율 의사결정", "폐쇄형 반복 제어", "SDN/NFV 기반"],
    keywords: ["SDN/VNF", "인공지능/머신러닝", "클라우드·엣지 컴퓨팅 기술", "OAM", "MANO"],
    tables: [
      {
        caption: "적용 기술",
        headers: ["구분", "핵심요소", "설명"],
        rows: [
          ["기술요소", "인공지능/머신러닝", "상태 정보·이벤트·로그 자동 수집\n수집 데이터 분석, 의사결정 지원\n서비스 품질 따른 분석모델 결정"],
          ["기술요소", "빅데이터 분석기술", "데이터 수집·분석·통계 정보 제공\n대용량·다양한 유형 데이터 처리"],
          ["기술요소", "클라우드·엣지 컴퓨팅 가상화 기술", "가변적 컴퓨팅 자원 할당\nAI 플랫폼 역할·용도별 배치\n집중형·분산형 HW 플랫폼 제공"],
          ["기술요소", "SDN/NFV", "네트워크 지능 기술 기반 환경 제공\n제어·정책 실시간 적용\nSW 기반 유연한 네트워크 구조"],
          ["관리요소", "폐쇄형 반복 제어(Closed-loop control)", "데이터 자동 수집→AI 분석\n분석 결과로 자율의사 결정\n피드백 과정 반복 자동 제어\n네트워크 최적 상태 제어·관리"],
          ["관리요소", "OAM / MANO", "의사결정·정책 실시간 적용\n물리자원·가상자원 관리"],
        ],
      },
      {
        caption: "활용 분야",
        headers: ["구분", "활용 분야"],
        rows: [
          ["네트워크 인프라 관리", "정책기반 센터간 트래픽 조정\n피크 트래픽 처리\n데이터 센터 내 에너지 절감"],
          ["네트워크 운용", "정책기반 IP 주소관리\n무선 커버리지/용량 최적화\n지능기반 SW 롤아웃(Rollout)"],
          ["네트워크 운용", "네트워크 슬라이싱 보안 강화\n지능기반 프론트 홀 관리\n오케스트레이션"],
          ["서비스 오케스트레이션", "상황인지 VoLTE 서비스 최적화\n지능형 네트워크 슬라이싱 관리\n지능형 SD-WAN 관리"],
          ["서비스/요구사항 보장", "네트워크 오류 식별 및 예측\n서비스 요구사항 보장"],
        ],
      },
    ],
    notes: ["개념도: Open AI/ML Services/Engine(Network Big data Analytics, AI/ML #1~#N) ↔ Prediction Self-decision → Closed-Loop Control & Management ⇄ Virtualized resources(VNF, Network slice instance) → Physical resources(Computing/Network Infrastructure), 우측에 MANO/OSS/BSS/NMS 오케스트레이션"],
  },
  {
    title: "6G",
    course: "NW",
    definition:
      "5G의 20Gbps보다 50배 빠른 1Tbps 최대 전송 용량과 10배 우수한 1Gbps 사용자 체감 속도 등을 지원하는 이동 통신 기술",
    defShort: "1Tbps 최대 전송 용량·1Gbps 사용자 체감 속도 이동 통신 기술",
    lead: "1Tbps 차세대 이동통신, 6G",
    features: ["초성능 전송", "초공간 커버리지", "초지능 네트워크"],
    keywords: ["초대역", "초성능", "초공간", "초정밀", "초지능", "초현실"],
    tables: [
      {
        caption: "6G 이동통신 비전",
        headers: ["비전", "6G 이동통신 기술", "기술설명 및 성능 목표"],
        rows: [
          ["초성능", "Tbps급 무선통신\nTbps급 광인프라", "최대 속도 1Tbps\n체감 1Gbps 이상"],
          ["초대역", "6G 지원 RF 기술\n주파수 확보", "100GHz 이상 대역\n대역폭 수십 GHz"],
          ["초현실", "초실감 3D 미디어\n방송·통신 융합", "실시간 홀로그램\n초실감 통신 구현"],
          ["초지능", "지능형 무선\n엑세스 네트워크", "기계 학습 구현\n실시간 요구 적용"],
          ["초정밀", "종단간 초저지연\n고정밀·고가용", "무선 지연 0.1ms\n종단 간 수 ms"],
          ["초공간", "3차원 이동체\n브로드밴드 무선", "지원속도 1000km\n고도 지상 10km"],
        ],
      },
      {
        caption: "5G와 차이점 비교",
        headers: ["비교 항목", "6G 이동통신", "5G 이동통신", "차이점"],
        rows: [
          ["활용대역", "100GHz 이상", "100GHz 이하", "100GHz 이상"],
          ["대역폭", "수십GHz", "수GHz", "5G 대비 10배"],
          ["최대전송속도", "1Tbps", "20Gbps", "5G 대비 50배"],
          ["체감전송속도", "1Gbps", "100Mbps", "5G 대비 10배"],
          ["무선구간지연", "0.1ms 이하", "1ms 이하", "5G 대비 1/10"],
          ["단말기밀도", "100만개/km³", "100만개/km²", "3차원 확장"],
          ["이동가능속도", "1000km/h", "500km/h", "5G 대비 2배"],
          ["측위 정확도", "10cm(옥내)\n1m(옥외)", "1m~3m", "옥내·옥외 구분"],
        ],
      },
      {
        caption: "6G 이동통신 지원 기술",
        headers: ["구분", "기반 기술", "설명"],
        rows: [
          ["주파수", "테라 헤르츠 대역 지원 기술", "THz 대역 경로 손실 극복\n빔포밍 안테나 커버리지 확보"],
          ["컴퓨팅", "통신-컴퓨팅 융합", "고성능 연산 홀로그램 XR\n네트워크 수행 결과 단말 제공"],
          ["지능", "네이티브 AI", "AI 기능 내장 초기부터 적용"],
          ["주파수", "주파수 공유", "CBRS 도입 시스템 간 공유"],
          ["안테나", "안테나 기술", "다수 안테나 THz 전파 대응"],
        ],
      },
    ],
  },
  {
    title: "디지털 트윈 네트워크(Digital Twin Network)",
    course: "NW",
    definition:
      "물리적 네트워크를 실시간 복제하여 6G 무선네트워크의 설계, 진단, 분석, AI/ML 기반 실시간 최적화 및 제어를 하기 위한 네트워크",
    defShort: "물리적 네트워크 실시간 복제로 6G 무선네트워크 설계·진단 네트워크",
    lead: "망의 실시간 가상 복제, 디지털 트윈 네트워크",
    features: ["데이터", "매핑(mapping)", "인터페이스"],
    keywords: ["물리적 네트워크", "가상 네트워크", "Network Application Layer", "Digital Twin Layer", "Physical Network Layer"],
    tables: [
      {
        caption: "디지털 트윈 네트워크 특징",
        headers: ["구분", "특징", "설명"],
        rows: [
          ["입력", "데이터", "기본 구성 요소 망 수집 데이터\n통합 저장소 정확한 모델 제공"],
          ["연결", "매핑(mapping)", "물리·가상 매핑 양방향 대응\n실시간 상호작용 시뮬레이션 차별"],
          ["표현", "모델", "다양한 모델 트윈 내장 구성\n유연한 결합 망 응용 지원"],
          ["연결", "인터페이스", "물리적 네트워크 가상 트윈 연결\n응용 인터페이스 정보 교환 수행"],
        ],
      },
      {
        caption: "참조 아키텍처 구성요소 — 계층",
        headers: ["계층", "설명"],
        rows: [
          ["6G 물리적 네트워크", "실제 6G 망 물리적 네트워크\n실 운영 환경 트윈 계층 교환"],
          ["6G 디지털 트윈 — 데이터 도메인", "수집 저장 관리 데이터 서비스"],
          ["6G 디지털 트윈 — 모델 도메인", "객체 모델 구성 수집 기반 표현"],
          ["6G 디지털 트윈 — 관리 도메인", "모델 보안 관리 관리 기능 수행"],
          ["6G 네트워크 애플리케이션", "인텐트 기반 서비스 모의\n제어 메시지 물리 계층 전송"],
        ],
      },
      {
        caption: "참조 아키텍처 구성요소 — 기능",
        headers: ["구분", "기능", "설명"],
        rows: [
          ["입력", "데이터", "수집 대상 결정 시기 방법 결정\n액세스 방법 저장 위치 제공"],
          ["표현", "모델", "AI 에뮬레이션 정확한 모델링\n시각화 제어 기능적 표현"],
          ["연결", "인터페이스", "상호 운용성 에코시스템 연계\n멀티벤더 지원 다중 벤더 수용"],
        ],
      },
    ],
    notes: ["참조 아키텍처: Network application(Network innovation·visualization·validation·management·optimization) ↕ Capability exposure/Intent input ↕ Network digital twin(Unified data repository + Unified data models(Basic/Functional model) + DT entity Mgmt) ↕ Data collection/Control ↕ Physical network"],
  },
  {
    title: "비지상네트워크(NTN, Non-Terrestrial Networks)",
    course: "NW",
    definition:
      "지상 네트워크가 도달하기 어려운 지역(해상, 산간, 오지 등)이나 광범위한 서비스 제공이 필요한 지역(항공, 재난 지역 등)에 5G 서비스를 제공하기 위해 위성, 고고도 플랫폼(HAPS), 드론 등 비지상 네트워크를 이용하는 기술",
    defShort: "위성·고고도 플랫폼(HAPS)·드론 등 비지상 네트워크 이용 기술",
    lead:
      "지상 밖의 5G 확장, 비지상네트워크(NTN)",
    features: ["비지상 플랫폼 이용", "지상망 음영 보완", "3GPP 5G 연동"],
    keywords: ["5G", "3GPP", "GEO", "LEO", "서비스 링크", "피더 링크", "위성간 링크", "Transparent", "Regenerative"],
    tables: [
      {
        caption: "구성요소 및 기술요소",
        headers: ["구분", "내역", "설명"],
        rows: [
          ["구성요소", "사용자 단말 (UE)", "5G 스마트폰·태블릿·IoT 기기"],
          ["구성요소", "피더 링크(Feeder Link)", "위성과 게이트웨이 사이 링크\n3GPP/비3GPP 라디오 인터페이스"],
          ["구성요소", "서비스 링크(Service Link)", "단말과 위성 사이 링크\n3GPP 정의 NR 기반"],
          ["구성요소", "위성 간 링크", "위성 간 링크"],
          ["구성요소", "Transparent 위성 / Regenerative 위성", "정지궤도·저궤도 등 위성 활용\n넓은 지역 서비스 제공"],
          ["구성요소", "고고도 플랫폼(HAPS)", "성층권 비행선·드론\n특정 지역 집중 서비스"],
          ["구성요소", "드론(UAV)", "저고도 운용, 한시적 서비스\n이동 중 통신 지원"],
          ["기술요소", "전송 기술", "위성·HAPS·드론과 지상 간 통신\n빔포밍, MIMO"],
          ["기술요소", "네트워크 제어", "NTN 네트워크 관리 및 자원 할당"],
          ["기술요소", "보안", "NTN 통신 보안 기술(인증, 암호화)"],
          ["기술요소", "위치 추적", "위성·HAPS·드론 위치 파악·추적"],
        ],
      },
    ],
    notes: ["아키텍처: GEO/MEO/LEO 궤도 위성 + ISL(위성간 링크), HAPS·UAV, Feeder link·Service link·Air-to-ground, NTN backhaul·IoT-NTN·VSAT가 Remote/Rural/Urban area의 지상 네트워크 구성요소와 연동"],
  },
  {
    title: "Wi-Fi 7(IEEE 802.11be)",
    course: "NW",
    definition:
      "Wi-Fi 6보다 전송속도가 3배 빠른 30GBps급 속도, 초실감 미디어 컨텐츠를 전송하는 차세대 무선통신 기술",
    defShort: "30Gbps급 속도, 초실감 미디어 컨텐츠 전송 차세대 무선통신 기술",
    lead:
      "30Gbps급 무선랜, Wi-Fi 7",
    features: ["초고처리량(EHT)", "6GHz 대역 확장", "하위 호환성"],
    keywords: ["IEEE 802.11be", "HARQ", "4096-QAM"],
    tables: [
      {
        caption: "성능 스펙",
        headers: ["구분", "성능 Spec", "설명"],
        rows: [
          ["최대 속도", "30Gbps 이상", "실감형 콘텐츠 지원 전송속도 확보\n3배 증가"],
          ["최대 대역폭", "320MHz 이상", "30Gbps 달성 위한 최대 대역폭 허용"],
          ["지원 주파수", "2.4GHz, 5GHz, 6GHz", "비면허 6GHz 추가 운영 주파수 확대"],
          ["하위 호환성", "기존 IEEE 802.11 장비 지원", "2.4, 5GHz 대역 802.11 장비 지원"],
          ["기술명", "IEEE 802.11be", "EHT(Extremely High Throughput)"],
          ["멀티플렉싱", "In-Band Full-Duplex Multiplexing", "AP-클라이언트 송/수신 동시 가능"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["MAC(Media Access Control)", "무선공유기(AP)간 다중협력통신", "시간·주파수·공간 유연성 개선\nAP 간 데이터 공유·제어 정보 지원"],
          ["MAC(Media Access Control)", "채널당 최대 320MHz 대역폭", "320MHz 대역폭\n비연속 스펙트럼 효율적 이용"],
          ["MAC(Media Access Control)", "16x16 MIMO", "16개 공간 스트림 용량 증대\n늘어난 스트림 오버헤드 개선"],
          ["MAC(Media Access Control)", "하이브리드 ARQ", "추가 패리티 통한 재전송 프로토콜\n복호화 수행 향상"],
          ["PHY(Physical layer)", "혼합 빔포밍", "320MHz 광대역을 협대역으로 나눔\n프리코딩 수행"],
          ["PHY(Physical layer)", "4096 QAM", "12bit 반송파 변조\n기존 1024 QAM 대비 20% 향상"],
        ],
      },
      {
        caption: "Wi-Fi 6와 Wi-Fi 7 비교",
        headers: ["구분", "Wi-Fi 6", "Wi-Fi 7"],
        rows: [
          ["최대 속도", "9.6Gbps", "30Gbps"],
          ["최대 대역폭", "160MHz", "320MHz"],
          ["지원 주파수", "2.4 5GHz\n2개 대역 사용", "2.4 5GHz\n6GHz 추가"],
          ["표준 기술명", "11ax HEW", "11be EHT"],
          ["Antenna", "MU-MIMO(8x8)", "MU-MIMO(16x16)"],
          ["Modulation", "1024 QAM", "4096 QAM"],
        ],
      },
    ],
  },
  {
    title: "Wi-Fi 8(IEEE 802.11bn)",
    course: "NW",
    definition:
      "향상된 효율성을 핵심 목표로 UHR(Ultra High Reliability, 극도로 높은 신뢰성)을 제공하는 차세대 Wi-Fi 표준",
    defShort: "효율 목표로 UHR(극도로 높은 신뢰성) 제공 차세대 Wi-Fi 표준",
    lead: "신뢰성 중심 차세대 무선랜, Wi-Fi 8",
    features: ["UHR 신뢰성 지향", "멀티 AP 협력", "NPCA 혼잡 회피"],
    keywords: ["IEEE 802.11bn", "UHR(Ultra High Reliability)", "대역폭(2.4GHz, 5GHz, 6GHz)", "최대속도(100Gbps)"],
    tables: [
      {
        caption: "성능 스펙",
        headers: ["구분", "성능Spec", "설명"],
        rows: [
          ["최대 채널 대역폭(MHz)", "320", "Mbps: 초당 메가비트\n(Megabits per second)"],
          ["주파수 대역(GHz)", "2.4, 5, 6", "Gbps: 초당 기가비트\n(Gigabits per second)"],
          ["최대 PHY 속도", "100Gbps", ""],
          ["변조", "4096 QAM", "QAM: 직교 진폭 변조"],
          ["공간 스트림 수", "8", ""],
          ["MU-MIMO", "UL & DL", "다중 사용자 다중 입력 다중 출력\nUL: Uplink, DL: Downlink"],
          ["대상 대기 시간", "협조됨", ""],
          ["OFDMA(#RU/STA)", "다중", "OFDMA: 직교 주파수 분할 다중 접속\nRU: 자원 유닛(Resource Unit)\nSTA: 스테이션(Station)"],
          ["멀티 링크 작동", "지원", ""],
          ["멀티 AP 협력", "지원", ""],
          ["DSO/NPCA", "지원", "DSO: 동적 스펙트럼 최적화\nNPCA: 네트워크 성능 및 혼잡 방지"],
          ["dRU", "지원", "dRU: dynamic Resource Unit\n동적 자원 유닛"],
          ["IEEE 표준", "802.11bn", "Wi-Fi 8"],
        ],
      },
      {
        caption: "Wi-Fi 버전별 비교",
        headers: ["구분", "Wi-Fi 4(802.11n)", "Wi-Fi 5(802.11ac)", "Wi-Fi 6(802.11ax)", "Wi-Fi 7(802.11be)", "Wi-Fi 8 예정(802.11bn)"],
        rows: [
          ["출시년도", "2009년", "2013년", "2019년", "2024년", "2028년"],
          ["최대 채널 대역폭(MHz)", "40", "160", "160", "320", "320"],
          ["주파수 대역(GHz)", "2.4, 5", "5", "2.4, 5, 6", "2.4, 5, 6", "2.4, 5, 6"],
          ["최대 PHY 속도", "600Mbps", "4.3Gbps", "9.6Gbps", "46Gbps", "100Gbps"],
          ["변조", "64 QAM", "256 QAM", "1024 QAM", "4096 QAM", "4096 QAM"],
          ["공간 스트림 수", "4", "4", "8", "8", "8"],
          ["MU-MIMO", "–", "DL only", "UL & DL", "UL & DL", "UL & DL"],
          ["대상 대기 시간", "–", "–", "개별, 방송", "제한적", "협조적"],
          ["OFDMA(#RU/STA)", "–", "–", "Yes(단일)", "Yes(다중)", "Yes(다중)"],
          ["멀티 링크 작동", "–", "–", "–", "Yes", "Yes"],
          ["멀티 AP 협력", "–", "–", "–", "–", "Yes"],
          ["DSO/NPCA", "–", "–", "–", "–", "Yes"],
          ["dRU", "–", "–", "–", "–", "Yes"],
        ],
      },
    ],
  },
  {
    title: "Passive WiFi",
    course: "NW",
    definition:
      "전력을 많이 소비하는 RF수신 장치를 별도 분리하고 후방산란 방식으로 데이터를 전달하는 기술",
    defShort: "RF수신 장치를 별도 분리, 후방산란 방식으로 데이터를 전달하는 기술",
    lead:
      "후방산란의 초저전력 통신, Passive WiFi",
    features: ["RF 수신부 분리", "후방산란 전송", "초저전력 통신"],
    keywords: ["사물인터넷", "후방산란(backscatter)", "디지털 장비", "아날로그 RF"],
    tables: [
      {
        caption: "구성도",
        headers: ["구분", "설명"],
        rows: [
          ["기존 와이파이", "아날로그 디지털 한 곳에 집적\n일체형 기기 RF 전력 소모"],
          ["패시브 와이파이", "아날로그 분리 전원부 별도 구성\n초저전력 통신 소모 전력 최소"],
        ],
      },
      {
        caption: "구성요소 — 송신(Plugged-In Device)",
        headers: ["주요 기술", "설명"],
        rows: [
          ["RF(Radio Frequency) Transfer", "RF 입출력 안테나 신호 처리\n업다운 변환 RF IF 모듈"],
          ["RF Calibration", "특성 차이 보상 안테나 소자 보정\n진폭 위상 보정 채널 간 차이 조정"],
          ["MAC", "사용자 DB 유지 주소 채널 설정"],
        ],
      },
      {
        caption: "구성요소 — 수신",
        headers: ["구성요소", "주요 기술", "상세 내용"],
        rows: [
          ["Passive Device", "후방산란\n(Back scattering)", "방사 신호 반사\n초저전력 통신"],
          ["Wifi Receiver", "-", "스마트 기기로\n와이파이 수신"],
        ],
      },
    ],
    notes: ["후방산란: 전파 방향과 반대 방향인 입사단으로 되돌아오는 현상"],
  },
  {
    title: "SDN(Software Defined Network)",
    course: "NW",
    definition:
      "네트워크 제어기능(Control Plane)과 데이터 전송기능(Data Plane)을 분리하고 개방형 프로토콜을 이용하여 SW기반의 다양한 네트워크 구성 및 제어를 수행하는 네트워크 기술",
    defShort: "개방형 프로토콜로 SW기반의 다양한 네트워크 구성 및 제어하는 기술",
    lead:
      "제어와 전송의 분리, SDN",
    features: ["제어·전달 분리", "제어 중앙집중화", "OpenFlow 개방형"],
    keywords: ["Control Plane", "Data Plane", "OSS", "BSS", "오픈API플랫폼"],
    tables: [
      {
        caption: "개념도 — 기존 장비 vs SDN 장비",
        headers: ["구분", "설명"],
        rows: [
          ["기존 네트워크 장비", "SW HW 통합 스위치 내 공존\n라우팅 QoS 포워딩 내장"],
          ["SDN 네트워크 장비", "제어 전달 분리 컨트롤러 분리\nAPI 연결 스위치 포워딩"],
          ["전체 구조", "제어 데이터면 계층 분리 구조\nOpen API 개방형 연결"],
        ],
      },
      {
        caption: "SDN 구성 요소",
        headers: ["구성 요소", "설명", "비고"],
        rows: [
          ["Application", "상위에서 사용자\n서비스 지원", "SDN Application\nLogic"],
          ["Interface", "Data·Control\nPlane 간 연계", "OpenFlow"],
          ["Control Plane", "제어 기능의\n중앙집중화", "SDN Control Logic\nACL, Routing, 인증"],
          ["Data Plane", "단순 패킷 포워딩\n스위칭만 구현", "Forward Engine"],
        ],
      },
      {
        caption: "SDN 구성도(3계층)",
        headers: ["계층", "설명"],
        rows: [
          ["APPLICATION LAYER", "비즈니스 응용 API 연계"],
          ["CONTROL LAYER", "SDN 제어 SW 중앙 제어 담당\n네트워크 서비스 오픈플로우 연결"],
          ["INFRASTRUCTURE LAYER", "네트워크 장비 패킷 전달 수행"],
        ],
      },
    ],
  },
  {
    title: "IoT Matter",
    course: "NW",
    definition:
      "CSA(Connectivity Standards Alliance) 단체가 개발한 IoT 기기간 연결과 연동을 제공하는 IP 기반 응용계층 개방형 IoT 통합 표준 프로토콜",
    defShort: "CSA가 개발한 IP 기반 응용계층 개방형 IoT 통합 표준 프로토콜",
    lead:
      "스마트홈 연동의 통합 표준, IoT Matter",
    features: ["IP 기반 응용계층", "개방형 통합 표준", "기기 간 연동"],
    keywords: ["스마트홈", "IP 기반 IoT 프로토콜", "Wi-Fi", "Thread"],
    tables: [
      {
        caption: "프로토콜 스택",
        headers: ["계층", "구성"],
        rows: [
          ["Application", "Matter"],
          ["Transport", "TCP/IP, UDP (우측으로\nBluetooth LE 별도 스택)"],
          ["Network", "IPv6"],
          ["Link", "Wi-Fi | Thread"],
          ["Radio", "802.11 | 802.15.4"],
          ["IoT Devices", "Matter-enabled Products"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["계층", "기술요소", "설명"],
        rows: [
          ["Application", "Matter Application", "IP 기반 애플리케이션 계층 처리\n스마트홈 디바이스 연동문제 해결"],
          ["Transport", "TCP/IP", "연결지향 신뢰성 있는 전송계층\n매터의 안전성 제공"],
          ["Transport", "UDP", "대량 데이터 전송 가능 비연결지향"],
          ["Network", "IPv6", "IoT 기기별 IP 주소 제공\n확장 헤더 128bit 주소체계"],
          ["Radio", "Wi-Fi(802.11)", "Wi-Fi 6 기반\n밀집 환경 기기간 영향 최소화\n동영상 등 고속 통신 디바이스용"],
          ["Radio", "Thread(802.15.4)", "Mesh 지원 SPOF 방지\n최대 64개 라우터 메쉬 구성\nIPv6·배터리 저전력 디바이스용"],
          ["Radio", "BLE", "디바이스 provisioning 용도"],
        ],
      },
    ],
  },
  {
    title: "오픈플로우(OpenFlow)",
    course: "NW",
    definition:
      "네트워크 장비의 패킷 포워딩 기능과 컨트롤러 기능을 표준 인터페이스로 분리하여 네트워크 개방성을 제공하는 기술로서 SDN(Software Defined Network) 컨트롤러와 네트워크 장치 간의 인터페이스 규격",
    defShort: "개방성 제공하는 SDN 컨트롤러와 네트워크 장치 간 인터페이스 규격",
    lead:
      "SDN의 표준 인터페이스, 오픈플로우",
    features: ["제어 평면 분리", "개방형 표준", "플로우 단위 제어"],
    keywords: ["OpenFlow Controller", "Switch", "Flow Table", "Group Table", "OpenFlow Channel", "Pipelining"],
    tables: [
      {
        caption: "구성 요소 — Controller",
        headers: ["구성요소", "설명"],
        rows: [
          ["OpenFlow Controller", "Switch 프로토콜 연동\n제어 소프트웨어 다수 논리 제어"],
        ],
      },
      {
        caption: "구성 요소 — Protocol",
        headers: ["구성요소", "설명"],
        rows: [
          ["OpenFlow Protocol", "Switch·Controller 통신 규약\nController-to-Switch: 제어\nAsynchronous: 상태 변경 Update\nSymmetric: 요청 없이 전송"],
        ],
      },
      {
        caption: "구성 요소 — Switch",
        headers: ["구성요소", "설명"],
        rows: [
          ["OpenFlow Channel", "Switch 컨트롤러 연결\n관리용 접점 제어 통로 제공"],
          ["Flow Table", "다수 Flow entry, 파이프라인 처리\nmatch fields(패킷 일치)\ncounters(통계)\ninstructions(실행 내용)"],
          ["Group Table", "그룹 엔트리 타입 통계 구성\n액션 버킷 구성 실행 집합 정의"],
        ],
      },
    ],
    notes: ["구성도: Controller들 ⇄ OpenFlow Protocol ⇄ OpenFlow Switch. Switch 내부는 Control Channel(OpenFlow Channel들)과 Datapath(Group Table, Meter Table), 그리고 Port ─ Flow Table → Flow Table → … → Flow Table ─ Port 로 이어지는 Pipeline 구조"],
  },
  {
    title: "SD-WAN(Software Defined-Wide Area Network)",
    course: "NW",
    definition:
      "데이터센터·기업·대학 등의 LAN에서 Data Plane과 Control Plane을 분리하는 SDN을 통신망 사업자와 서비스 제공자 등의 WAN(Wide Area Network)으로 확장 적용한 네트워크 기술",
    defShort: "SDN을 통신망 사업자와 서비스 제공자 등의 WAN으로 확장한 기술",
    lead:
      "SDN의 WAN 확장, SD-WAN",
    features: ["SDN의 WAN 확장", "중앙 정책 배포", "동적 경로 전환"],
    keywords: ["SD-WAN Controller", "SD-WAN Edge", "VPN"],
    tables: [
      {
        caption: "기술 요소 — 장비 측면",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["장비 측면", "SD-WAN Controller", "액세스 노드 네트워크·정책 설정\n네트워크 토폴로지 관리\nQoS·액세스 정책 설정·배포\n사용량·성능 보고"],
          ["장비 측면", "SD-WAN CPE(SD-WAN Edge)", "CPE 장비·범용 서버 VNF로 구현\n오버레이 망 라우팅·터널링 엔진"],
          ["장비 측면", "SD-WAN CPE(SD-WAN Edge)", "방화벽·보안·암호화\nWAN 최적화: 캐싱·압축\n에러 정정·로드밸런싱"],
        ],
      },
      {
        caption: "기술 요소 — 트래픽(Traffic) Control",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["경로 제어", "Dynamic Path Switching", "동적 경로 전환 저하 경로 회피"],
          ["경로 제어", "Packet Duplication", "패킷 중복 전송 유실 대비 확보"],
          ["회선 결합", "Link Aggregation", "다중 회선 결합 대역폭 확장"],
          ["망 분리", "Network Segmentation", "VLAN 분리 논리적 망 분리"],
          ["경로 제어", "트래픽 스티어링(Traffic Steering)", "트래픽 식별 앱별 경로 설정"],
        ],
      },
    ],
    notes: ["구성도: Control Plane에 SD-WAN Controller(모니터링 및 관제, 정책설정 및 라우팅) — Data Plane에서 Site A의 SD-WAN CPE ↔ MPLS망/Internet망 두 경로(Overlay Tunnel) ↔ Site B의 SD-WAN CPE"],
  },
  {
    title: "SDR(Software Defined Radio)",
    course: "NW",
    definition:
      "주파수의 범위, 변조 방식, 무선 출력 등 주요 무선 특성을 소프트웨어로 업데이트 또는 변경 가능한 무선 통신 기술",
    defShort: "주요 무선 특성을 소프트웨어로 업데이트 또는 변경 가능한 무선 통신 기술",
    lead:
      "소프트웨어로 바꾸는 무선, SDR",
    features: ["SW 기반 재구성", "광대역 RF 처리", "기저대역 SW 대체"],
    keywords: ["RF Front-end", "디지털 IF", "모뎀", "기저대역 DSP(Digital Signal Processing)", "SW 다운로드"],
    tables: [
      {
        caption: "기술 요소 — 소자 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["변환", "A/D, D/A 변환기", "고속 샘플링 고해상도 변환"],
          ["무선부", "광대역 RF(Radio Frequency)", "광대역 송수신 무선 주파수 처리\nAMP 안테나 증폭 소자 구성"],
          ["변환", "Digital IF(Intermediate Frequency)", "중간 주파수 RF 기저 전환"],
          ["처리", "FPGA(Field Programmable Gate Array), DSP(Digital Signal Process)", "설계 논리 소자 프로그래밍 가능\n신호 처리기 디지털 신호 처리"],
          ["처리", "SDR 프로세서", "전용 프로세서 SDR 제작 기술"],
        ],
      },
      {
        caption: "기술 요소 — 소프트웨어 기술",
        headers: ["핵심 기술", "설명"],
        rows: [
          ["소프트웨어 구조(SCA)", "SCA 구조 SDR SW 구조"],
          ["미들웨어", "컴포넌트 기반 재구성성 충족"],
          ["RTOS(Real-Time Operating System)", "실시간 OS 신호 처리 지원"],
          ["Description 언어", "XML UML 구성 정보 표시"],
        ],
      },
      {
        caption: "기술 요소 — 통신 기술 / 시스템 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["통신 기술", "네트워크 기술", "네트워크 간 Handover\n네트워크 탐지"],
          ["통신 기술", "다운로드 기술", "OTA 다운로드 프로토콜"],
          ["통신 기술", "보안 및 인증", "프로토콜 불법 사용 방지\n도청 및 간섭 방지"],
          ["시스템 기술", "HW Abstraction", "시스템 구조, 인터페이스"],
          ["시스템 기술", "HW Platform", "SDR 테스트 베드, 스마트 안테나 등"],
          ["시스템 기술", "SW Platform", "전반적인 SW 시스템 기술"],
          ["시스템 기술", "Smart Antenna", "스마트 안테나 API 표준 기술"],
        ],
      },
      {
        caption: "개념도 용어",
        headers: ["용어", "설명"],
        rows: [
          ["BBA", "기저대역 어셈블리"],
          ["ADC", "Analog-to-digital converter\nanalog → digital 신호 변환 칩"],
          ["MSM", "Mobile Station Modem\n이동 스테이션 모뎀"],
          ["코덱(codec)", "스트림·신호 인코딩·디코딩\n하드웨어나 소프트웨어"],
        ],
      },
    ],
    notes: ["개념도: 기존 단말기는 [RF, IF 부시스템] → 반송 캐리어 → 기저대역부(BBA(ADC/DAC) → MSM → CODEC) 로 하드웨어가 단계별로 나뉨. SDR 단말기는 [RF, IF 부시스템(광대역처리)] → 광대역 반송 캐리어 → ADC → SDR(소프트웨어 블록) → ADC 로 기저대역부 전체를 SDR 하나가 대체"],
  },
  {
    title: "CDN(Contents Delivery Network)",
    course: "NW",
    definition:
      "콘텐츠를 중간경로를 최소화, 효율적으로 전달하기 위해 ISP의 여러 노드(웹 캐시)를 가진 네트워크에 데이터를 복제 저장하여 제공하는 시스템",
    defShort: "콘텐츠를 효율적으로 전달 위해 데이터를 복제 저장하여 제공하는 시스템",
    lead:
      "가까운 곳에서 콘텐츠를, CDN",
    features: ["ISP 노드 복제 저장", "중간경로 최소화", "인접 서버 라우팅"],
    keywords: ["Caching", "Global Server Load Balancing", "Load Balancing", "Streaming", "배포", "동기화", "Request Routing"],
    tables: [
      {
        caption: "동작 절차",
        headers: ["순서", "설명"],
        rows: [
          ["①", "End-User가 CP 웹 서버에 접속"],
          ["②", "Embedded URL 포함 HTML문서 전달"],
          ["③", "CDN서버 주소로 오브젝트 요청"],
          ["④", "CDN서버에 복제된 오브젝트 전달"],
        ],
      },
      {
        caption: "구성 요소",
        headers: ["구성", "설명"],
        rows: [
          ["CDN SP", "CDN Service Provider\nCDN 사업 총괄 수행 사업자"],
          ["CP", "Contents Provider\n콘텐츠 제공 사업자"],
          ["ISP", "Internet Service Provider\nCDN 서비스 대상 사용자 보유 업체"],
          ["User", "서비스 사용자"],
          ["POP", "points of presence\n모든 CDN 제공자 PoP 통해 서비스"],
          ["IX", "Internet eXchange\n인터넷회선연동\nISP간 연동 제공 접속포인트"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["기술요소", "설명"],
        rows: [
          ["Cashing 기술", "자주 찾는 페이지 복사·저장\n사용자 요청 시 저장 정보 전송"],
          ["Global Server Load Balancing", "최상 서비스 캐시 서버 선정·연결"],
          ["Load Balancing 기술", "서버별 트래픽 분산 성능 향상\n고장난 서버 제외 후 나머지로 할당"],
          ["Streaming기술", "멀티미디어 다운 없이 즉시 재생"],
          ["콘텐츠 배포", "지역별 분산 CDN서버\n동일 콘텐츠 정확히 배포"],
          ["동기화 기술", "콘텐츠 변경 즉시 분산 서버 반영\n동일 콘텐츠 동시 전송\n파일 유실·오류 방지\nSW 업데이트에 유용"],
          ["Grid Delivery", "일정 트래픽까지 서버 활용\n이상은 P2P 기술 활용\n이용자 컴퓨터를 작은 서버로\n다운로드하며 다른 이용자에 전송"],
          ["Request Routing", "Cache서버 부하 고려\n가장 인접한 Cache Server 선택"],
        ],
      },
    ],
    notes: ["개념도: 사용자 ─ POP 서버(Cache) ─ IX ─ ISP ─ CP. 구간 명칭은 사용자쪽부터 Last-mile / Middle-mile / First-mile"],
  },
  {
    title: "망 중립성(Network Neutrality)",
    course: "NW",
    definition:
      "인터넷 접속서비스 제공사업자(ISP)가 네트워크를 통해 전송되는 트래픽의 내용, 유형, 단말기기 등에 관계없이 차별·차단하지 않고 동등하게 처리해야 한다는 원칙",
    defShort: "ISP가 전송 트래픽을 차별·차단하지 않고 동등하게 처리하는 원칙",
    lead:
      "트래픽 동등 처리의 원칙, 망 중립성",
    features: ["차단금지", "불합리한 차별금지", "트래픽 관리 투명성"],
    keywords: ["투명성", "차단금지", "불합리한 차별금지", "합리적인 트래픽 관리"],
    tables: [
      {
        caption: "3대 원칙",
        headers: ["원칙", "핵심", "분류", "설명"],
        rows: [
          ["비차별성 확립", "트래픽 이용 차별", "트래픽 차별 금지\n이용자 권리 보호\n단대단 선택권", "등급 차등화 금지\n연결·장치 자유\n접근 방식 선택"],
          ["상호접속 허용", "일방적 차단 금지", "서비스 이용 보장\n컨텐츠 차단 금지\n합법 트래픽 관리", "합리적 가격 정책\n합법 콘텐츠 보장\nQoS 품질 유지"],
          ["접근성 제공", "자유로운 이용", "정책 투명성 보장\n디바이스 접근", "목적·범위 공개\n연결권 보장"],
        ],
      },
      {
        caption: "기본 원칙 [망 중립성 가이드라인('21.1.11)]",
        headers: ["기본 원칙", "설명"],
        rows: [
          ["인터넷 트래픽 관리의 투명성 (제4조)", "트래픽 관리 방침 공개\n관리 조치 사실·영향 이용자 고지\n관리정보 투명 공개·이용자 보호"],
          ["차단금지 (제5조)", "합법 콘텐츠 통신사 차단 금지"],
          ["불합리한 차별 금지 (제6조)", "유형·제공주체 불합리 차별 금지"],
          ["합리적인 트래픽 관리 (제7조)", "보안 혼잡 법령 예외 트래픽 관리\n기본원칙·기준 관리 유형 구체화"],
        ],
      },
    ],
  },
  {
    title: "인텐트 기반 네트워킹(Intent-Based Networking)",
    course: "NW",
    definition:
      "네트워크 관리자의 의도(Intent)를 인공지능 기술로 파악하여 인터넷을 구성하는 유선망과 무선망 설정을 자동으로 수행하는 네트워크 기술",
    defShort: "의도를 인공지능 기술로 파악, 유선망과 무선망 설정 자동 수행하는 기술",
    lead:
      "의도만 말하면 되는 망, 인텐트 기반 네트워킹",
    features: ["AI 기반 의도 파악", "자동 설정 수행", "폐쇄 루프 검증"],
    keywords: ["의도(intent)", "인공지능", "자율 네트워크", "변환과 검증", "자동 수행", "상황 인식", "동적인 최적화"],
    tables: [
      {
        caption: "IBN을 위한 요건",
        headers: ["요건", "설명"],
        rows: [
          ["변환과 검증", "의도→정책 인텐트 정책화\n실행 검증 실제 수행 확인"],
          ["자동 수행", "개입 최소화 자동 작업 수행"],
          ["상황 인식", "모니터링 네트워크 감시\n데이터 수집 특정 상태 유지"],
          ["동적인 최적화", "유지 방법 판단 의도대로 유지\n조정·자동 실행 조정 작업 자동화"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["의도 명령(Intent command)", "NMS, User", "네트워크 관리 시스템(NMS)\n네트워크 관리자(Admin, Client)\n서비스 목적 위한 선언적 명령"],
          ["의도 번역(Intent translation)", "Translation\nOptimization", "High-level Policy\n음성, 텍스트 형태 의도 번역"],
          ["의도 번역(Intent translation)", "LLM", "거대 언어 모델\n컴퓨터 스크립트 형태 자동 번역"],
          ["의도 적용(Intent deployment)", "Activation\nConfiguration", "Low-level Policy\n인프라 요청 네트워크 서비스 수행"],
          ["의도 적용(Intent deployment)", "Virtual Machine\nContainer", "가상화 시스템 활성화\n변경 의도 적용 준비 및 수행"],
          ["의도 모니터링(Intent monitoring)", "Monitoring\nAssurance", "네트워크 모니터링 데이터 수집\n데이터 분석 및 정합성 검증"],
          ["의도 검정 및 재설정(Intent validation & reconfiguration)", "Validation", "서비스 의도대로 동작 여부 검정"],
          ["의도 검정 및 재설정(Intent validation & reconfiguration)", "feedback", "정책 보완 및 새로운 정책 생성"],
        ],
      },
    ],
    notes: ["매커니즘(Closed-Loop Intent Control): User/NMS가 Intent 입력 → Translation/Optimization(High-level Policy) → Activation/Configuration(Low-level Policy) → Infrastructure → Monitoring Data → Monitoring/Assurance → Feedback → 다시 Translation/Optimization 으로 순환"],
  },
  {
    title: "무선 충전 기술",
    course: "NW",
    definition:
      "전력선을 사용하지 않고 무선으로 전기 에너지를 자기장 혹은 전자기파 형태로 변형하여 전송하여 디바이스의 2차전지(배터리)를 충전하는 기술",
    defShort: "무선으로 전기 에너지를 자기장·전자기파 형태로 변형해 충전하는 기술",
    lead:
      "선 없는 전력 전송, 무선 충전 기술",
    features: ["전력선 불요", "자기장·전자기파", "거리·효율 반비례"],
    keywords: ["자기유도", "자기공명", "전자기파"],
    tables: [
      {
        caption: "무선 충전 기술 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["근거리", "자기유도", "송신코일 자기장 수신코일 통과\n유도전류 충전 전기차·모바일"],
          ["중거리", "자기공진(자기공명)", "동일 공진주파수 코일 간 공진 발생\n에너지 결합 가전·노트북"],
          ["원거리", "전자기파", "마이크로파 변환 전력 직접 전송\n안테나 방사 위성·우주 발전"],
        ],
      },
      {
        caption: "무선 충전 기술 방식 비교",
        headers: ["구분", "자기유도방식", "자기공명방식", "전자기파 방식"],
        rows: [
          ["주파수", "125Khz\n13.56Mhz", "수십Khz ~ 수Mhz", "2.45GHz\n5.8Ghz"],
          ["전송거리", "근접형(수Cm)", "중거리(수m)", "장거리(수Km)"],
          ["효율", "75% 이상", "40~60%", "5% 이내"],
          ["인체유해성", "무해", "무해", "유해"],
          ["주요사용분야", "교통카드\n모바일", "가전기기", "우주비행체\n위성"],
          ["전송전력", "1W ~ 100kW", "1W ~ 수kW", "고출력"],
          ["기술성숙도", "성숙", "확산중", "기초연구"],
          ["소형화", "가능", "진행 중", "불가능"],
          ["모듈단가", "저가", "-", "고가"],
          ["표준화", "WPC 표준 제정", "A4WP", "ITU-R SG1"],
          ["장점", "고효율", "이동성", "고출력"],
          ["문제점", "단거리\n금속 영향", "효율관리\n전파 규약", "저효율"],
          ["고려사항", "금속 주변\n와류 현상", "인체무해성\n검증 단계", "인체 유해"],
        ],
      },
      {
        caption: "기타 무선 충전 기술 방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["전파", "RF", "비콘 위치 인지 지향 집중 충전"],
          ["빛", "적외선", "적외선 빔 인체 무해 방식"],
          ["음파", "초음파", "초음파 변환 전송 에너지·데이터\n수신측 복호화 전기·인체 무해"],
        ],
      },
    ],
  },
  {
    title: "Sliding Window & 네이글(Nagle's) 알고리즘",
    course: "NW",
    definition:
      "윈도우 크기를 활용한 흐름제어 기법과 Ack 수신에 따라 패킷 수를 조절하여 네트워크 부하를 감소시키는 알고리즘",
    defShort: "윈도우 크기 활용 흐름제어와 Ack 수신에 따라 패킷 수 조절 알고리즘",
    lead:
      "흐름 제어와 부하 감소, Sliding Window와 네이글",
    features: ["ACK 없이 연속 전송", "작은 패킷 축적 전송", "네트워크 부하 감소"],
    keywords: ["윈도우 열림, 닫힘, 축소 동작", "수신 Window Size만큼 전송", "송신 데이터 종료 시 즉시 전송", "데이터 축적 후 전송"],
    tables: [
      {
        caption: "Sliding Window 개요",
        headers: ["구분", "설명"],
        rows: [
          ["정의", "수신 측 설정 윈도우 크기만큼\nACK 없이 전송, 흐름 동적 조절"],
          ["개념도", "Window num = Min(cwnd, rwnd)\n왼쪽 경계 닫힘, 오른쪽 경계 열림"],
        ],
      },
      {
        caption: "Sliding Window 동작 매커니즘",
        headers: ["동작 방식", "설명"],
        rows: [
          ["Window 열림", "수신측 ACK 도착\n오른쪽 경계가 오른쪽으로 이동\n데이터 전송량 증가"],
          ["Window 닫힘", "데이터 전송 후 ACK 수신\n왼쪽 경계가 오른쪽으로 이동\n전송의 정상 완료"],
          ["Window 축소", "적합성 문제 또는 윈도우 크기 변경\n오른쪽 경계가 왼쪽으로 이동"],
        ],
      },
      {
        caption: "네이글 알고리즘",
        headers: ["알고리즘", "설명"],
        rows: [
          ["정의", "작은 패킷 여러 개 모아서 전송\n네트워크 패킷 수 줄여 부하 감소"],
          ["개념도", "Nagle 적용 ACK 대기 전송\n미적용 연달아 전송"],
        ],
      },
      {
        caption: "네이글 알고리즘 동작 매커니즘",
        headers: ["동작 방식", "설명"],
        rows: [
          ["수신 Window Size만큼 전송", "수신 가능 Window Size < MSS 시\nWindow Size만큼 바로 전송"],
          ["송신 데이터 종료 시 즉시 전송", "패킷 없으면 현재 buffer data 전송"],
          ["데이터 축적 후 전송", "Ack 올 때까지 buffer에 축적\nack 수신 시 buffer data 송신"],
        ],
      },
    ],
  },
  {
    title: "BGP(Border Gateway Protocol)",
    course: "NW",
    definition:
      "AS(Autonomous System) 번호가 서로 다른 네트워크 간에 라우팅 정보를 주고 받기 위해 Open, Update 패킷 이용, 라우팅 우선순위는 Weight, Local Preference 매트릭으로 이용하는 Exterior Gateway 라우팅 프로토콜",
    defShort: "서로 다른 AS 간 Exterior Gateway 라우팅 프로토콜",
    lead:
      "AS 간 경로 교환의 규약, BGP",
    features: ["AS 간 라우팅", "Path Vector 방식", "정책 기반 경로 선택"],
    keywords: ["iBGP", "eBGP", "Path Vector", "AS", "Local Preference", "MED"],
    tables: [
      {
        caption: "구성도 (RFC 1771, 4271)",
        headers: ["구분", "구성", "설명"],
        rows: [
          ["내부 iBGP", "동일 AS 내부\niBGP 구현", "같은 번호 사용\n내부망 연결"],
          ["내부 iBGP", "AS 200 내부\nALU-D~F", "동일 AS 그룹\n내부 라우터"],
          ["내부 iBGP", "AS 100 내부\nALU-A~C", "같은 AS 100\n내부 라우터군"],
          ["외부 eBGP", "다른 AS 간\neBGP 구현", "AS 번호 상이\n외부망 연결"],
          ["외부 eBGP", "200↔100", "타 AS 간 연동"],
        ],
      },
      {
        caption: "기술 요소",
        headers: ["구분", "기술 요소", "설명"],
        rows: [
          ["경로 속성", "Next-Hop", "BGP 정보 전송 라우터의 IP 주소\n목적지까지 필수 경유 라우터 주소"],
          ["경로 속성", "Local Preference", "외부로 나가는 경로 우선 순위 값\n기본값 100"],
          ["경로 속성", "AS-Path", "목적지 AS 도착 시 경유 AS 번호\n개수 작을수록 짧은 경로로 선택"],
          ["경로 속성", "MED", "Multi-Exit-Discriminator\n인입 경로 다중일 경우 우선 순위 값"],
          ["프로토콜 메시지", "Open", "TCP 179번 포트 회선 연결 시도\n라우터간 BGP Neighbor 설정"],
          ["프로토콜 메시지", "Update", "BGP 정보 교환·갱신, 비정기 사용\n도달 가능성 정보 전송"],
          ["프로토콜 메시지", "Notification", "문제 발생·이웃관계 단절 알림"],
          ["프로토콜 메시지", "Keepalive", "BGP Neighbor Health Check 메시지"],
          ["프로토콜 메시지", "Route-Refresh", "BGP Neighbor 라우터 정보 재확인"],
        ],
      },
    ],
  },
  {
    title: "IPv6",
    course: "NW",
    definition:
      "IPv4가 가지고 있는 주소 고갈, 보안성, 이동성 지원 등의 문제점을 해결하기 위해 개발된 128bit의 차세대 주소체계",
    defShort: "IPv4의 주소 고갈 문제를 해결한 128bit의 차세대 주소체계",
    lead:
      "128비트의 차세대 주소, IPv6",
    features: ["128bit 주소체계", "고정 길이 기본헤더", "확장 헤더 분리"],
    keywords: ["128비트", "주소고갈", "보안성", "이동성", "16진수 8자리"],
    tables: [
      {
        caption: "구성도 [버터플파네호]",
        headers: ["구분", "설명"],
        rows: [
          ["전체 구조", "기본헤더 40B 고정 길이 헤더\n확장헤더+상위 최대 2^16B"],
          ["기본헤더 필드 배치(비트 0~31)", "1·2행 제어 버전·길이·홉\n3·4행 주소 송·수신지 주소"],
        ],
      },
      {
        caption: "헤더 상세 설명 — 기본 헤더",
        headers: ["필드", "크기", "설명"],
        rows: [
          ["버전 Version", "4bit", "IP 버전 표시"],
          ["트래픽 클래스 Traffic Class", "8bit", "우선순위 요청"],
          ["플로우 레이블 Flow Label", "20bit", "QoS 구분 표시"],
          ["페이로드 길이 Payload Length", "16bit", "데이터 길이 표시"],
          ["다음 헤더 Next header", "8bit", "다음 헤더 유형"],
          ["홉 제한 Hop Limit", "8bit", "포워딩 제한 표시"],
          ["송신지 주소 Source Address", "128bit", "송신지 주소 표시"],
          ["수신지 주소 Destination Address", "128bit", "수신지 주소 표시"],
        ],
      },
      {
        caption: "헤더 상세 설명 — 확장 헤더 / 데이터",
        headers: ["구분", "설명"],
        rows: [
          ["확장 헤더", "추가 전송 기능 기본 헤더 뒤 선택"],
          ["데이터", "상위 프로토콜 TCP 세그먼트"],
        ],
      },
      {
        caption: "표기법",
        headers: ["기법", "설명"],
        rows: [
          ["기본 원칙", "8개 필드 16진수 4자리\n콜론(:) 구분 필드 사이 구분"],
          ["혼합 표기법", "앞 96bit 콜론 16진 표기\n뒤 32bit 10진수 표기법"],
        ],
      },
      {
        caption: "표기법 예시",
        headers: ["구분", "1", "2", "3", "4", "5", "6", "7", "8"],
        rows: [
          ["일반16진수 표기법", "805B", "2D9D", "DC28", "0000", "0000", "FC57", "D4C8", "1FFF"],
          ["0 억제 표기법", "805B", "2D9D", "DC28", "0", "0", "FC57", "D4C8", "1FFF"],
          ["0 압축 표기법", "805B", "2D9D", "DC28", "::", "", "FC57", "D4C8", "1FFF"],
          ["혼합 표기법", "805B", "2D9D", "DC28", "::", "", "FC57", "212.200.31.255", ""],
        ],
      },
    ],
  },
  {
    title: "트랜잭션",
    course: "DB",
    definition:
      "한번에 처리되어야 할 하나 또는 둘 이상의 일련의 작업단위로써 데이터베이스에 행해지는 작업의 논리적 단위",
    defShort: "한번에 처리되어야 할 작업단위로 DB에 행해지는 작업의 논리적 단위",
    lead:
      "DB 작업의 논리적 단위, 트랜잭션",
    features: ["ACID 특성 보장", "논리적 작업 단위", "상태 전이 관리"],
    keywords: ["Atomicity(원자성)", "Consistency(일관성)", "Isolation(고립성)", "Durability(영속성)"],
    tables: [
      {
        caption: "개념도 및 특징 [ACID]",
        headers: ["특징", "상태관리", "설명"],
        rows: [
          ["Atomicity(원자성)", "All or Nothing", "전체 처리 또는 전체 미처리\n회복기법"],
          ["Consistency(일관성)", "모순 없는 상태", "완료 시 모순 없이 일관 상태 보존\n무결성 제약조건, 동시성 제어"],
          ["Isolation(고립성)", "Locking", "중간 결과 타 트랜잭션 접근 불가\n동시성 제어"],
          ["Durability(영속성)", "Storing", "완료 결과 데이터베이스 영구 저장\n회복기법"],
        ],
      },
      {
        caption: "상태전이도 [활부완실천]",
        headers: ["작업 구분", "상태", "설명"],
        rows: [
          ["시작", "활동 상태(Active)", "초기 상태\n실행 중 동작 상태"],
          ["성공", "부분 완료 상태\n(Partial Committed)", "마지막 명령문 실행 후 상태"],
          ["성공", "완료 상태(Committed)", "성공적 완료 후 상태"],
          ["실패", "실패 상태(Failed)", "정상 실행 더 이상 진행 불가"],
          ["실패", "철회 상태(Aborted)", "트랜잭션 취소, 시작 전 상태 환원"],
        ],
      },
    ],
    notes: ["개념도: 업무처리의 단위(LOGICAL UNIT OF WORK) — 트랜잭션 시작 → 읽기·수정·삭제… → 트랜잭션 종료", "상태전이: Active → Partial Committed → Committed / Active·Partial Committed → Failed → Aborted"],
  },
  {
    title: "Isolation Level(격리 레벨)",
    course: "DB",
    definition:
      "트랜잭션 실행 중 중간 연산 결과가 다른 트랜잭션으로 접근 불가하도록 하는 고립성을 유지하기 위해 데이터를 허용하는 수준",
    defShort: "중간 연산 결과 접근 불가인 고립성 유지를 위해 데이터를 허용하는 수준",
    lead: "고립성의 데이터 허용 수준, Isolation Level(격리 레벨)",
    features: ["고립성 유지", "동시성 반비례", "수준별 이상 허용"],
    keywords: ["2PC", "투명성"],
    tables: [
      {
        caption: "Isolation Level [언커리씨]",
        headers: ["Isolation Level", "Dirty Read", "Non-Repeatable Read", "Phantom Read", "고립 수준", "동시성 수준"],
        rows: [
          ["Read Uncommitted (Level 0)", "가능", "가능", "가능", "저", "고"],
          ["Read Committed (Level 1)", "불가능", "가능", "가능", "↑", "↑"],
          ["Repeatable Read (Level 2)", "불가능", "불가능", "가능", "↑", "↑"],
          ["Serializable (Level 3)", "불가능", "불가능", "불가능", "고", "저"],
        ],
      },
      {
        caption: "격리성 수준별 설명",
        headers: ["격리성 수준", "가능한 비일관성 현상", "설명"],
        rows: [
          ["Read Uncommitted", "Dirty Read\nNon-Repeatable Read\nPhantom Read", "Commit 안 된 데이터 읽기 허용"],
          ["Read Committed", "Non-Repeatable Read\nPhantom Read", "Commit 확정 데이터만 읽기 허용"],
          ["Repeatable Read", "Phantom Read", "첫 쿼리 레코드 소실·값 변경 방지"],
          ["Serializable Read", "없음\n교착상태 미발생", "레코드 소실·값 변경 없음\n새 레코드 출현 없음"],
        ],
      },
      {
        caption: "낮은 단계 격리성 수준 발생 내용 [DNP 부비가]",
        headers: ["구분", "수준", "설명"],
        rows: [
          ["갱신 판독", "Dirty Read (부정판독)", "미커밋 수정값 타 트랜잭션 판독"],
          ["갱신 판독", "Non-Repeatable Read (비반복판독)", "동일 쿼리 2회 두 결과 값 상이\n중간 수정·삭제 타 트랜잭션 갱신"],
          ["삽입 판독", "Phantom Read (가상판독)", "동일 쿼리 2회 없던 행 출현\n팬텀 레코드 신규 행 판독"],
        ],
      },
    ],
    notes: ["고립 수준이 올라갈수록(Serializable 방향) 동시성 수준은 내려간다 — Consistency와 Concurrency의 반비례 곡선"],
  },
  {
    title: "ANSI/SPARC 모델(3-단계 데이터베이스 구조) / 데이터 독립성",
    course: "DB",
    definition:
      "데이터베이스의 복잡한 구조를 단순화하여, 관점(View)을 기준으로 3계층으로 분리한 구조",
    defShort: "DB의 복잡한 구조를 단순화해 관점(View) 기준 3계층 분리 구조",
    lead:
      "관점 기준 3계층 분리, ANSI/SPARC 모델과 데이터 독립성",
    features: ["관점 기준 분리", "논리적 독립성", "물리적 독립성"],
    keywords: ["외부 스키마", "개념 스키마", "내부 스키마", "논리적 독립성", "물리적 독립성"],
    tables: [
      {
        caption: "데이터 독립성을 위한 스키마 요소",
        headers: ["Schema", "설명", "뷰"],
        rows: [
          ["외부(서브) 스키마", "응용·사용자가\n보는 DB 측면", "각 사용자 뷰"],
          ["개념 스키마", "DB의 논리적 구조\n조직 전체 기술", "사용자 공통체 뷰\n(통합 관점)"],
          ["내부 스키마", "저장장치 입장의\n저장 방법 명세", "물리적 저장 뷰"],
        ],
      },
      {
        caption: "3단계 스키마를 통한 데이터 독립성 보장 영역",
        headers: ["독립성", "내용", "요구 능력"],
        rows: [
          ["논리적 독립성", "개념 스키마 변경\n외부 영향 제거\n논리구조↔응용", "논리 구조 사상\n지원 능력"],
          ["물리적 독립성", "내부 스키마 변경\n개념 영향 제거", "다중 물리 사상\n지원 능력"],
        ],
      },
    ],
    notes: ["3단계 구조 [논물 외개내]: 프로그램들 → 외부스키마 → 외부/개념 사상[응용인터페이스] → 개념스키마(논리적 구조 사상) → 개념/내부 사상[저장인터페이스] → 내부스키마(물리적 구조 사상) → Device"],
  },
  {
    title: "데이터베이스 모델링",
    course: "DB",
    definition:
      "현실 세계의 비즈니스를 추상화하여, 논리적이고 구조화된 데이터 모델로 표현하는 활동",
    defShort: "비즈니스를 추상화해 논리적이고 구조화된 데이터 모델로 표현하는 활동",
    lead:
      "비즈니스의 데이터 모델화, 데이터베이스 모델링",
    features: ["현실 세계 추상화", "단계적 상세화", "커뮤니케이션 중심"],
    keywords: ["요구사항 분석", "개념모델링", "논리모델링", "물리모델링"],
    tables: [
      {
        caption: "원칙 [커상논]",
        headers: ["원칙", "설명"],
        rows: [
          ["커뮤니케이션 원칙 (Communication Principle)", "모두 이해·파악 가능한 모델 제시\n최종사용자·이해관계자 고려\n대상: 사용자·분석가·DB관리자"],
          ["모델링 상세화 원칙 (Granularity Principle)", "조직 구조 최소 공통 분모 제시\n분할: 복잡한 구조 요소단위 분할\n제거: 불필요 구조·중복 협의 제거"],
          ["논리적 표현 원칙 (Logical Representation Principle)", "조직 비즈니스 그대로 논리적 반영\n분석: 섣부른 판단보다 절차 준수\n구체화: 단기 솔루션 구체화 지양"],
        ],
      },
      {
        caption: "모델링 단계 [개논물 주후핵관 속엔이 물논반]",
        headers: ["구분", "절차", "내용", "고려사항"],
        rows: [
          ["개념 모델링", "주제 영역 정의", "최상위 집합 구분\n전사 관점 분류", "중복 최소화\n확장성·편의성"],
          ["개념 모델링", "후보 Entity 선정", "후보 Entity 수집\n문서·인터뷰·서적\n전문가 경험", "함부로 제외 금지\n현업 참여\n상세화 금지"],
          ["개념 모델링", "핵심 Entity 정의", "핵심 Entity 선별\n본질식별자 정의\n서브타입 정의", "관리 여부\n집합·동질성\n독립성 확인"],
          ["개념 모델링", "관계 정의", "Entity 간 연관성\n1:1, 1:M, M:M\n순환, Arc", "두 Entity 간 존재\n양방향 존재\n두 관점 존재"],
          ["논리 모델링", "속성 정의", "최소 데이터 단위\n속성 후보 도출\n검증 후 확정", "속성 분할 필수\n분할 후 통합\n업무요구 근거"],
          ["논리 모델링", "Entity 상세화", "식별자 확정\n정규화·M:M 해소\n1차~BCNF·4차", "속성은 하나의 값\n속성간 종속 금지\n참조무결성 규칙"],
          ["논리 모델링", "이력 관리 정의", "활용성·추적성\n시점·선분\n발생·변경·진행", "물리 성능 고려\n일자 종료점 선택\n키·인덱스 고려"],
          ["물리 모델링", "물리 환경 조사", "구축 환경 조사\nHW 자원·OS\nDBMS 확정", "사용자 관리기법\n백업 정책\n보안관리 정책"],
          ["물리 모델링", "논리모델 변환", "테이블·속성\n관계·제약조건\n수퍼/서브 전환", "PK 최적화\n통합obj 고려\n의사결정 합의"],
          ["물리 모델링", "반정규화", "성능·편의성\n테이블 분할 중복\n중복·집계 컬럼", "반정규화 최소화\nSQL·인덱스 조정\n우선 고려"],
        ],
      },
      {
        caption: "고려사항",
        headers: ["고려사항", "설명"],
        rows: [
          ["무결성", "제약조건 만족 연산 후에도 유지"],
          ["일관성", "데이터 값 일치 질의 응답 무모순"],
          ["회복", "장애 직전 복구 일관된 상태 복원"],
          ["보안", "불법 변경 보호 손실·노출 방지"],
          ["효율성", "응답 시간 단축 시스템 생산성\n저장 공간 최소 자원 효율 확보"],
          ["DB 확장", "운영 무영향 추가 지속적 확장 가능"],
        ],
      },
    ],
    notes: ["개념도: 현실 세계(개체) —개념적 데이터 모델링→ 개념 세계(개념적 구조) —논리적 데이터 모델링→ 논리적 구조 —물리적 데이터 모델링→ 저장 DB(컴퓨터 세계)"],
  },
  {
    title: "데이터베이스 무결성",
    course: "DB",
    definition:
      "데이터의 정확성, 일관성, 유효성이 유지되는 것을 의미하며, 릴레이션을 조작하는 과정에서 수행하기 전과 후에 대한 상태에 대한 정확성 유지 규칙",
    defShort: "데이터의 정확성·일관성·유효성이 조작 수행 전과 후에 유지되는 규칙",
    lead:
      "데이터 정확성 유지 규칙, 데이터베이스 무결성",
    features: ["연산 전후 정확성", "제약조건 기반", "정적·동적 제약"],
    keywords: ["정확성", "일관성", "유효성 유지", "제약조건"],
    tables: [
      {
        caption: "데이터 무결성 [개참속사키도]",
        headers: ["구분", "설명", "제약 조건"],
        rows: [
          ["개체 무결성 (Entity Integrity)", "기본키는 값 필수\n유일성 최소 집합", "Primary Key\nNot Null"],
          ["참조 무결성 (Referential Integrity)", "외래키 값은 참조\n기본키 또는 NULL", "Foreign Key"],
          ["속성 무결성 (Attribute Integrity)", "지정 데이터 형식\n만족하는 값만", "Character, Date\nLONG, VARCHAR2, NUMBER"],
          ["사용자 정의 무결성", "Business Rule\n준수", "Trigger, Check\nUser Type, DEFAULT"],
          ["키 무결성 (Key Integrity)", "동일 키값 튜플\n허용 불가", "Primary Key +\nUnique Index"],
          ["도메인 무결성 (Domain Integrity)", "정의된 도메인\n범위에 속함", "CHECK, Default"],
        ],
      },
      {
        caption: "릴레이션 무결성 [상과집튜즉지]",
        headers: ["제약구분", "유형", "설명", "특징"],
        rows: [
          ["상태", "상태제약 (State)", "일관성 상태 조건\n정적 제약", "특정시점에 만족"],
          ["상태", "과도제약 (Transition)", "상태 변환 규칙\n동적 제약", "변환 전·후 비교"],
          ["범위", "집합제약 (Set)", "튜플 집합 전체\n적용 규칙", "CHECK 절 전체"],
          ["범위", "튜플제약 (Tuple)", "처리 중 튜플만\n적용 규칙", "CHECK 절 단일"],
          ["시점", "즉시제약 (Immediate)", "연산 즉시 적용", "AFTER 사용"],
          ["시점", "지연제약 (Deferred)", "트랜잭션 완료 후\n적용", "WHEN COMMIT"],
        ],
      },
    ],
    notes: ["기출: 138회 정보관리 1교시, 135회 정보관리 4교시, 134회 컴시응 3교시", "데이터 무결성 개념도: 개체무결성(고객번호 PK) · 참조무결성(주문의 고객번호 FK → 고객) · 속성무결성(성별 등 형식)"],
  },
  {
    title: "릴레이션 키(key)",
    course: "DB",
    definition:
      "하나의 릴레이션 내에서 각각의 튜플 들을 유일하게 식별할 수 있는 속성의 집합",
    defShort: "한 릴레이션 안에서 각 튜플을 유일하게 식별할 수 있게 하는 속성의 집합",
    lead:
      "튜플의 유일한 식별자, 릴레이션 키(key)",
    features: ["유일성", "최소성", "Not null"],
    keywords: ["슈퍼키", "후보키", "기본키", "대체키", "외래키"],
    tables: [
      {
        caption: "키 도출 절차 [유최대]",
        headers: ["순서", "절차", "내용"],
        rows: [
          ["1", "유일성 검증", "함수적 종속성\n확인해 검증"],
          ["2", "최소성 검증", "최소성 확인 후\n후보키 선정"],
          ["3", "엔티티 대표성", "후보키 중 선정\n기본키 확정"],
        ],
      },
      {
        caption: "키 유형 및 제약유형 [슈후기대외]",
        headers: ["유형", "내용", "특성"],
        rows: [
          ["수퍼키 (super key)", "유일성 만족\n최소성 불만족", "유일성"],
          ["후보키 (candidate key)", "유일성·최소성\n모두 만족", "유일성·최소성\nNot null"],
          ["기본키 (primary key)", "후보키 중 하나\n대표로 선정", "유일성·최소성\nNot null"],
          ["대체키 (alternate key)", "기본키 선정 후\n남은 후보키", "유일성·최소성\nNot null"],
          ["외래키 (foreign key)", "다른 릴레이션의\n기본키 참조", ""],
        ],
      },
      {
        caption: "제약유형",
        headers: ["제약유형", "설명", "구현형태"],
        rows: [
          ["본질적 제약", "구조적 특성 제약\n주 키 필수\n셀 단일 값\n1차 정규화", "Primary Key\nUnique Key"],
          ["내재적 제약", "의미 정확 표현\n오류 방지\nDB 스키마 지정\n영역·참조 제약", "Foreign Key, Check\nDefault, Not null"],
          ["명시적 제약", "PGM 명시 또는\n수작업 생성", "Programmatically"],
        ],
      },
    ],
    notes: ["키들간의 관계: 슈퍼키 ⊃ 후보키 ⊃ (기본키 + 대체키)", "예시: 수강과목 릴레이션의 학번(외래키) → 학생 릴레이션의 학번(기본키)"],
  },
  {
    title: "엔티티(Entity)",
    course: "DB",
    definition:
      "사물 및 개념의 특성 또는 성질을 공유하는 실체로 업무에 필요하고 유용한 정보를 저장 및 관리 위한 데이터의 집합",
    defShort: "사물 및 개념의 특성 또는 성질을 공유하는 실체로 업무 정보의 데이터 집합",
    lead:
      "업무 정보의 데이터 집합, 엔티티(Entity)",
    features: ["업무적 필요성", "식별성", "집합성"],
    keywords: ["데이터 집합", "업무의 필요성"],
    tables: [
      {
        caption: "요건 [업식집프속관]",
        headers: ["자격 요건", "설명"],
        rows: [
          ["업무적 필요성", "구축 업무에서 필요로 하는 정보"],
          ["식별성", "인스턴스가 식별자로 한 개만 존재"],
          ["집합성", "영속적으로 존재하는 다수의 값"],
          ["프로세스에 활용", "업무 프로세스에 반드시 활용\nCRUD 메트릭 확인"],
          ["속성을 가짐", "속성 포함, 관계 성립 엔티티"],
          ["관계성", "다른 엔티티와 최소 한 개 이상 관계"],
        ],
      },
      {
        caption: "엔티티 유형 [유개사기중행]",
        headers: ["분류", "유형", "설명"],
        rows: [
          ["유무형", "유형 엔티티", "물리적 실체존재, 지속적 활용\n업무적 구분 용이\n예) 사원, 물품, 강사"],
          ["유무형", "개념 엔티티", "물리적 형태 없는 개념적 정보\n예) 조직, 보험상품"],
          ["유무형", "사건 엔티티", "업무수행 시 발생, 다량 발생\n통계 활용 가능\n예) 주문, 청구"],
          ["발생시점", "기본 엔티티", "기본 업무에 존재하는 정보\n관계 없이 독립적 생성\n타 엔티티의 부모, 고유 주 식별자\n예) 사원, 부서, 고객, 상품, 자재"],
          ["발생시점", "중심 엔티티", "기본 엔티티에서 파생, 업무 중심\n관계 통해 행위 엔티티 생성\n예) 계약, 사고, 청구, 주문, 매출"],
          ["발생시점", "행위 엔티티", "상세설계·상관모델링 중 도출\n잦은 변경, 대량 데이터 발생\n예) 주문목록, 사원변경이력"],
        ],
      },
      {
        caption: "개념도 — 엔티티 도출 절차",
        headers: ["단계", "설명"],
        rows: [
          ["엔티티 후보 도출", "명사 형태로 표기\n속성 여부 확인"],
          ["엔티티 후보 정제", "중복 또는 유사의미 정리\n후보 전체의 명사 검토"],
          ["엔티티 확정", "데이터 관리 필요성 판단"],
        ],
      },
    ],
  },
  {
    title: "함수적 종속성(Functional Dependency)",
    course: "DB",
    definition:
      "데이터들이 어떠한 기준에 의해 결정자로부터 종속이 되는 제약조건(Constraints)",
    defShort: "데이터들이 어떠한 기준에 의해서 결정자로부터 종속이 되는 제약조건",
    lead:
      "결정자-종속자의 제약조건, 함수적 종속성(Functional Dependency)",
    features: ["결정자 기준 종속", "정규화 기준", "암스트롱 공리 추론"],
    keywords: ["종속", "결정자", "종속자", "완전함수 종속", "부분함수 종속", "이행함수 종속", "결정자함수 종속", "정규화"],
    tables: [
      {
        caption: "함수적 종속성 유형 [완부이결다조]",
        headers: ["종속성구분", "주요개념"],
        rows: [
          ["완전 함수 종속", "Full Functional Dependency\n기본 키에만 종속되는 FD 관계\nX'⊂X, X'→Y 만족하는 X' 없음"],
          ["부분 함수 종속 (2NF)", "partial functional dependency\nX'⊂X, X'→Y 만족하는 X' 존재\n부분 키가 종속성 가짐"],
          ["이행함수 종속 (3NF)", "Transitive Dependency\nA→X, X→Y 이면 A→Y\n키 아닌 기본속성에서 종속성 존재"],
          ["결정자함수 종속성 (BCNF)", "Boyce-Codd Normalization\n결정자가 후보키가 아닌 경우\nX→Y에서 X가 후보키 아님\n키에서 종속성 존재"],
          ["다중값 종속성 (4NF)", "MVD: Multi-Valued Dependency\n둘 이상 독립적 다중값 속성 존재\nY값이 X에만 종속, Z와 독립\nX->>Y로 표기"],
          ["조인종속성 (5NF)", "Adjoin Dependency\n둘로 나누면 원래 관계 회복 불가\n셋 이상 분리 시 원래 관계 복원"],
        ],
      },
      {
        caption: "종속성 해결방법",
        headers: ["단계", "제거 대상"],
        rows: [
          ["비정규 릴레이션 → 1NF", "완전함수종속성\n제거"],
          ["1NF → 2NF", "부분함수 종속성\n제거"],
          ["2NF → 3NF", "이행 함수 종속성\n제거"],
          ["3NF → BCNF", "결정자 함수\n종속성 제거"],
          ["BCNF → 4NF", "다중 값 종속성"],
          ["4NF → 5NF", "조인 종속성 제거"],
        ],
      },
    ],
    notes: ["함수적 종속성 추론규칙 → 암스트롱 공리"],
  },
  {
    title: "암스트롱 공리(Armstrong's Axioms)",
    course: "DB",
    definition:
      "주어진 릴레이션 R에 대해 X, Y, Z라는 속성의 집합이 주어졌을 경우 여러가지 함수종속(FD, Functional Dependency)의 성질을 유도해 폐포(F+)를 도출할 수 있는 추론 규칙",
    defShort: "여러가지 함수종속 성질을 유도해 폐포(F+)를 도출하는 추론 규칙",
    lead:
      "함수종속의 추론 규칙, 암스트롱 공리(Armstrong's Axioms)",
    features: ["정규화에 이용", "정당(Sound)", "완전(Complete)"],
    keywords: ["정당성", "완전성", "기본/부가 규칙", "폐포(F+)", "정규화"],
    tables: [
      {
        caption: "특징 [정완]",
        headers: ["특징", "설명"],
        rows: [
          ["정규화에 이용", "함수 종속성 제거 정규화에 활용"],
          ["정당(Sound)", "F+ FD만 생성 오류 종속 미생성"],
          ["완전(Complete)", "모든 F+ 도출 폐포 전체 발견"],
        ],
      },
      {
        caption: "기본규칙 [기재부이]",
        headers: ["규칙", "설명"],
        rows: [
          ["재귀성 규칙", "Y가 X의 부분 집합이면, X → Y이다"],
          ["부가성 규칙", "만약 X → Y이면, XZ → YZ이다"],
          ["이행성 규칙", "만약 X → Y이고 Y → Z이면 X → Z이다"],
        ],
      },
      {
        caption: "부가규칙 [부분합의]",
        headers: ["규칙", "설명"],
        rows: [
          ["분해 규칙", "X → YZ이면 X → Y이고 X → Z이다"],
          ["합집합 규칙", "X → Y이고 X → Z이면 X → YZ이다"],
          ["의사 이행 규칙", "X → Y이고 YZ → W이면 XZ → W이다"],
        ],
      },
      {
        caption: "폐포(F+) 계산 예",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["알고리즘", "X+ 초기화\n반복 확장 수행", "폐포 초기값 설정\n변화 없을 때 종료"],
          ["알고리즘", "Y→Z 검사\nY⊆X+ 이면", "F 내 종속 순회\nX+ ∪ Z 갱신"],
          ["의미", "X 결정 속성\nF+ 폐포 표기", "F 기반 결정\n속성 집합 산출"],
          ["예시", "R = A B C\nG H O 속성", "릴레이션 속성\n여섯 속성 구성"],
          ["예시", "A→B A→C\nCG→H", "F 종속 집합\n결합 결정 관계"],
          ["예시", "CG→I B→H\nAG 후보키", "추가 종속 관계\n키 판정 결과"],
          ["예시", "AG의 폐포\nABCGHI", "폐포 계산 결과\n전체 속성 도출"],
        ],
      },
    ],
  },
  {
    title: "데이터베이스 정규화(Normalization)",
    course: "DB",
    definition:
      "이상현상을 발생시키는 속성 간의 종속성, 중복성을 제거하고 무결성을 보장하기 위해 릴레이션을 분해하는 과정",
    defShort: "종속성, 중복성을 제거하고 무결성 보장 위해 릴레이션을 분해하는 과정",
    lead: "종속·중복 제거의 분해, 데이터베이스 정규화(Normalization)",
    features: ["이상현상 제거", "함수 종속성 제거", "무손실 분해"],
    keywords: ["삽입·삭제·갱신 이상 현상(Anomaly)", "무손실", "중복 분해", "함수적 종속성"],
    tables: [
      {
        caption: "이상현상 [삽삭갱]",
        headers: ["이상현상", "예시"],
        rows: [
          ["삽입 이상", "새 학과 발생 시 가짜 학번 생성 필요"],
          ["삭제 이상", "학생 퇴원 시 소속 학과도 함께 삭제"],
          ["갱신 이상", "학과 수정 시 다른 컬럼도 함께 수정"],
        ],
      },
      {
        caption: "이상현상 원인",
        headers: ["원인", "설명"],
        rows: [
          ["① 부분함수 종속성 존재", "학번(부분집합)이 지도교수 결정\nY가 X의 부분집합에도 함수적 종속"],
          ["② 이행함수 종속성 존재", "학번→지도교수 식별/결정\n일반 속성 지도교수→학과 FD\nA→X, X→Y 이면 A→Y"],
        ],
      },
      {
        caption: "정규화 원칙 [무중분]",
        headers: ["구분", "기본 원칙"],
        rows: [
          ["일관성/정확성", "정보의 무손실\n데이터 중복성 감소\n분리의 원칙"],
          ["사용성", "구조 리팩토링, 가용성 향상"],
        ],
      },
      {
        caption: "정규화 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["원자값", "1정규화", "복수의 속성값을 갖는 속성 분리"],
          ["함수 종속", "2정규화", "주식별자에 비종속 속성 분리\n부분함수종속 제거"],
          ["함수 종속", "3정규화", "속성에 종속적인 속성 분리\n이행함수종속 분리"],
          ["함수 종속", "BCNF", "다수의 주식별자 분리"],
          ["다치 종속", "4정규화", "다가 종속 속성 분리\nMulti-Valued Dependency"],
          ["조인 종속", "5정규화", "결합 종속(Join Dependency) 시\n두 개 이상 N개로 분리"],
        ],
      },
    ],
    notes: ["기출: 136회 정보관리 1교시, 129회 정보관리 4교시", "정규화 절차: 비정규 릴레이션 → (원자 값 아닌 도메인 분해) 1정규화 → (부분 함수 종속성 제거) 2정규화 → (이행 함수 종속성 제거) 3정규화 → (결정자 함수 종속성 제거) BCNF → (다중 값 종속성 제거) 4정규화 → (조인 종속성 제거) 5정규화"],
  },
  {
    title: "데이터베이스 반정규화(De-Normalization)",
    course: "DB",
    definition:
      "정규화로 분해된 데이터 모델을 관련 있는 릴레이션으로 통합하여 DB 성능 향상시키는 기법",
    defShort: "정규화로 분해된 모델을 관련 릴레이션으로 통합해 DB 성능 향상 기법",
    lead:
      "성능 위한 릴레이션 통합, 데이터베이스 반정규화(De-Normalization)",
    features: ["분해 모델 재통합", "조인 경로 단축", "갱신 부담 증가"],
    keywords: ["테이블 병합", "테이블 분할", "테이블 추가", "컬럼", "관계"],
    tables: [
      {
        caption: "반정규화 절차 [대다반]",
        headers: ["순서", "단계", "내용"],
        rows: [
          ["1", "반정규화 대상", "범위 처리 빈도\n대량 범위 처리\n통계성 프로세스\n테이블 조인 수"],
          ["2", "다른 방법 검토", "뷰(View) 테이블\n클러스터링 적용\n인덱스 조정\n어플리케이션"],
          ["3", "반정규화 적용", "테이블 반정규화\n속성 반정규화\n관계 반정규화"],
        ],
      },
      {
        caption: "반정규화 기법 [테칼관 병분추 중계이 중]",
        headers: ["구분", "주요 기법", "설명"],
        rows: [
          ["테이블 레벨", "테이블 병합", "1:1 병합, 1:N 병합(Join수 감소)\nSub-type끼리 테이블 병합\n코드명 속성 추가, Join 제거"],
          ["테이블 레벨", "테이블 분할", "수직 분할: Access 빈도 컬럼 분리\n수평 분할: Partition 성능 향상"],
          ["테이블 레벨", "테이블 추가", "통계 테이블: 조회 빈도 높은 컬럼\n이력 테이블: 이력 조회 별도 생성\n중복·부분 테이블 추가 등"],
          ["컬럼 레벨", "중복 컬럼 추가", "조회 성능 중요 시 양쪽 테이블 저장\n조인 비용 감소, 갱신 비용 증가"],
          ["컬럼 레벨", "계산 컬럼 추가", "조인 후 계산 결과 컬럼 추가\n조인 비용 감소, 갱신 비용 증가"],
          ["컬럼 레벨", "이력 컬럼 추가", "변경·발생 이력용 최신 정보 컬럼"],
          ["관계 레벨", "중복관계 추가", "부모-자식 관계 추가\n데이터 접근경로 단축"],
        ],
      },
    ],
    notes: ["기출: 135회 정보관리 2교시", "예시: 주문·배송이 분리된 모델에서 배송 테이블에 주문ID·제품ID·배송방법·배송일시·고객ID를 중복 보유시켜 조회 경로 단축"],
  },
  {
    title: "연결함정(Connection Trap)",
    course: "DB",
    definition:
      "데이터 간에 관계가 모호해져서 원하는 결과를 얻을 수 없거나 업무 처리시 영향을 주는 ER모델의 문제점",
    defShort: "데이터 간 관계가 모호해져 원하는 결과를 얻을 수 없는 ER모델의 문제점",
    lead: "관계 모호성의 ER 문제, 연결함정(Connection Trap)",
    features: ["관계 모호성", "분해 원칙 미준수", "관계 재배치 해소"],
    keywords: ["데이터 모델링 문제점", "무결성 분해 원칙 미준수", "부채꼴 함정", "균열 함정"],
    tables: [
      {
        caption: "부채꼴 함정(Fan Trap) [부모]",
        headers: ["구분", "설명"],
        rows: [
          ["문제점", "교수가 속한 학과를 알 수 없음\nA:1:B 관계로 A-B간 관계 모호"],
          ["해결 방안", "교수 소속 학과·단과 대학 파악\n1:A:B 관계로 관계 모호성 제거"],
        ],
      },
      {
        caption: "균열 함정(Chasm Trap) [균미]",
        headers: ["구분", "설명"],
        rows: [
          ["문제점", "지도교수 미할당 학생 학과 불명\n교수 통해서만 학과 소속 파악"],
          ["해결 방안", "균열 엔티티 간 새 관계 추가\n교수 없어도 학과 소속 파악"],
        ],
      },
    ],
  },
  {
    title: "관계대수(Relational Algebra)",
    course: "DB",
    definition:
      "관계형 데이터베이스에서 원하는 정보를 검색하기 위해 어떻게 유도하는가(how)를 기술하는 절차적인 언어",
    defShort: "DB에서 정보를 검색하기 위해 어떻게 유도하는지 기술한 절차적인 언어",
    lead: "How 기술의 절차적 언어, 관계대수(Relational Algebra)",
    features: ["절차적 언어", "how 유도 기술", "집합·관계 연산"],
    keywords: ["절차적 언어", "일반집합 연산자", "순수관계 연산자"],
    tables: [
      {
        caption: "일반 집합 연산자 [합교차카]",
        headers: ["연산자", "기호와 표현", "의미"],
        rows: [
          ["합집합", "∪ (R ∪ S)", "합병 가능한 두\n릴레이션의 합"],
          ["교집합", "∩ (R ∩ S)", "R과 S에 속하는\n모든 튜플"],
          ["차집합", "− (R − S)", "R에 있고 S에\n없는 튜플"],
          ["카티션 프로덕트", "× (R × S)", "튜플 연결로\n새 튜플 구성"],
        ],
      },
      {
        caption: "순수 관계 연산자 [셀프조디]",
        headers: ["연산자", "기호와 표현", "의미"],
        rows: [
          ["셀렉트", "σ\n(σ(조건)(R))", "조건 만족\n튜플 반환"],
          ["프로젝션", "π\n(π(속성)(R))", "지정 속성만\n튜플 반환"],
          ["조인", "⋈ (R ⋈ S)", "공통 속성 연결"],
          ["디비전", "÷ (R ÷ S)", "S 모두 관련 튜플"],
        ],
      },
    ],
  },
  {
    title: "관계해석(Relational Calculus)",
    course: "DB",
    definition:
      "관계형 데이터베이스에서 수학적 논리를 사용하여 데이터를 질의하는 선언적(비절차적) 언어",
    defShort: "관계형 DB에서 수학적 논리로 데이터를 질의하는 선언적 비절차 언어",
    lead: "What 기술 선언적 언어, 관계해석(Relational Calculus)",
    features: ["비절차적 언어", "프레디킷 해석 기반", "결과만 명시"],
    keywords: ["비절차적 언어", "수학적 논리", "원하는 데이터만 명시", "프레디킷 해석(Predicate Calculus)"],
    tables: [
      {
        caption: "관계해석 수식 요소",
        headers: ["구분", "요소", "기호", "설명"],
        rows: [
          ["연산자", "OR 연산", "∨", "원자식 또는 연결"],
          ["연산자", "AND 연산", "∧", "그리고로 연결"],
          ["연산자", "NOT 연산", "¬", "원자식 부정 해석"],
          ["정량자", "전칭 정량자", "∀ (For All)", "모든 가능한 튜플"],
          ["정량자", "존재 정량자", "∃ (Exists)", "하나라도 존재"],
        ],
      },
      {
        caption: "관계해석 유형 [튜도]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["행 단위", "튜플 관계해석 (Tuple Relational Calculus)", "TRC 튜플 단위 조건 만족 행 전체\n튜플 변수 t 행 단위 조건 정의"],
          ["열 단위", "도메인 관계해석 (Domain Relational Calculus)", "DRC 속성 단위 특정 속성 값 반환\n도메인 변수 d 열 단위 조건 정의"],
        ],
      },
    ],
    notes: ["예시: 급여 3000 이상 사원의 이름·급여 — {(t.Ename, t.Salary) | t ∈ EMPLOYEE ∧ t.Salary ≥ 3000} ↔ SELECT Ename, Salary FROM EMPLOYEE WHERE Salary >= 3000"],
  },
  {
    title: "DB 회복기법",
    course: "DB",
    definition:
      "Media, Syntax, Fat-Finger와 같은 문제로 장애 발생 시 회복기법을 이용하여 일관성, 무결성, 가용성을 확보 및 보장 수행하는 기법",
    defShort: "장애 발생 시 회복기법으로 일관성·무결성·가용성을 확보하는 기법",
    lead: "장애 시 DB 일관성 확보, DB 회복기법",
    features: ["로그 기반 복구", "트랜잭션 단위 회복", "검사점 회복 단축"],
    keywords: ["REDO", "UNDO", "즉시갱신", "지연갱신", "체크포인트", "그림자페이지"],
    tables: [
      {
        caption: "트랜잭션 유형별 사용률 [하소사 미하 신인 팻파]",
        headers: ["구분", "장애 유형", "상세 설명"],
        rows: [
          ["H/W", "Media 장애\nH/W 성능 저하", "데이터 유실 장애\n저사양 처리 지연"],
          ["S/W", "Syntax 장애\nInstance 장애", "오류·공간 부족\n비정상 요인 중단"],
          ["사용자", "Fat-finger Error\nParameter Error", "테이블 삭제 실수\n주요 설정 오류"],
        ],
      },
      {
        caption: "회복기법 유형 [회로(즉지)체그아]",
        headers: ["기법", "동작 방식", "상세 설명"],
        rows: [
          ["즉시 갱신 기법", "갱신마다 Log와\nDB에 즉시 반영", "장애 시 Log 참조\nUNDO 연산"],
          ["지연 갱신 기법", "Log에만 기록\n종료 후 DB 반영", "미종료 Log 폐기\n종료 시 REDO"],
          ["체크포인트", "검사점 기준\n로그 파일 기록", "미종료 UNDO\n완료 REDO"],
          ["그림자 페이지", "시작 전 페이지\n테이블 복제", "종료 후 저장\n장애 시 복구"],
          ["ARIES", "WAL 로그 선행\nLSN 기록", "검사점 기준 REDO\n미완료 UNDO"],
        ],
      },
    ],
  },
  {
    title: "DB 동시성제어",
    course: "DB",
    definition:
      "다중 사용자 환경을 지원하는 데이터베이스 시스템에서 여러 트랜잭션들이 직렬성 및 무결성을 보장하고 성공적으로 동시에 실행될 수 있도록 지원하는 제어 기법",
    defShort: "여러 트랜잭션이 직렬성 및 무결성을 보장하며 성공적 동시 실행 제어 기법",
    lead: "다중 트랜잭션 직렬성 보장, DB 동시성제어",
    features: ["직렬성 보장", "무결성 유지", "동시 실행 지원"],
    keywords: ["직렬성", "무결성", "Locking", "2PL", "Timestamp", "낙관적 검증", "MVCC"],
    tables: [
      {
        caption: "동시성제어를 하지 않을 경우 문제점 [갱현모연]",
        headers: ["구분", "문제점", "설명"],
        rows: [
          ["갱신", "갱신손실 (Lost Update)", "변경 결과 덮어씀 변경 연산 무효화\n동시 갱신 시 동일 데이터 충돌"],
          ["판독", "현황파악오류 (Dirty Read)", "중간 결과 참조 미완료 값 판독"],
          ["일관성", "모순성 (Inconsistency)", "일관성 없는 상태 모순된 결과 발생\n상호 간섭 일관성 변질 오류"],
          ["복구", "연쇄복귀 (Cascading Rollback)", "완료 전 장애 복귀 타 트랜잭션 복귀\n변경 데이터 전파 연쇄 취소 수행"],
        ],
      },
      {
        caption: "동시성 제어기법 유형 — Locking",
        headers: ["기법", "설명"],
        rows: [
          ["Locking", "항목 상호 배제 동시 접근 차단\n잠금·해제 연산 실행 후 잠금 해제"],
        ],
      },
      {
        caption: "동시성 제어기법 유형 [2PL낙타다]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["잠금 기반", "2PL (Phase Locking)", "Lock/Unlock 확장·수축 단계 구분\n직렬성 보장\n확장 Lock, 수축 Unlock만 수행"],
          ["검증 기반", "낙관적검증 기법 (Validation)", "종료 시 일괄 검증 수행 중 제어 없음\nR·V·E 단계 검증 후 DB 반영"],
          ["시간 기반", "Timestamp ordering", "시간대별 직렬화 충돌 연산 순서화\nDB 부여 식별자 타임스탬프 비교"],
          ["버전 기반", "다중버전 동시성제어 (MVCC)", "다중 버전 비교 접근 시 시각 비교\n직렬 가능 버전 선택 버전 접근"],
        ],
      },
    ],
  },
  {
    title: "낙관적 검증(Validation) 기법",
    course: "DB",
    definition:
      "트랜잭션을 실행하는 동안 모든 갱신은 지역 사본에만 반영되고 트랜잭션 종료 시 확인 단계를 통해 직렬 가능성에 위반되지 않으면 실행하고 위반되면 복귀하는 기법",
    defShort: "트랜잭션 종료 시 확인 단계를 통해 직렬 가능성 위반되면 복귀하는 기법",
    lead: "종료 시 일괄 검증 제어, 낙관적 검증(Validation) 기법",
    features: ["지역 사본 갱신", "종료 시 검증", "직렬 가능성 보장"],
    keywords: ["판독", "기록", "확인", "직렬 가능성", "유효성 검사"],
    tables: [
      {
        caption: "처리단계 [판확기]",
        headers: ["단계", "설명"],
        rows: [
          ["판독 단계 (Read Phase : R)", "사본만 갱신 실제 DB 미수행\n버퍼(메모리) 판독 연산 수행"],
          ["확인 단계 (Validation Phase : V)", "직렬 가능성 검증 위반 여부 확인\n반영 전 확인 실행 결과 검증"],
          ["기록 단계 (Write Phase : W)", "통과 시 DB 반영 디스크에 기록\n실패 시 복귀 실행 결과 취소"],
        ],
      },
      {
        caption: "확인 단계 조건",
        headers: ["조건", "설명", "타임스탬프(Time-stamp)"],
        rows: [
          ["조건1", "Finish(Ti) <\nStart(Tk)", "Start(Ti):\n판독단계 시작"],
          ["조건2", "Start(Tk) <\nFinish(Ti) <\nValidation(Tk)\nW(Ti)∩R(Tk)=∅", "Validation(Ti):\n확인 시작 시간"],
          ["조건3", "W(Ti)∩R(Tk)=∅\nW(Ti)∩W(Tk)=∅", "Finish(Ti):\n기록 완료 시간"],
        ],
      },
    ],
  },
  {
    title: "MVCC(다중 버전 동시성 제어) 2가지 유형",
    course: "DB",
    definition:
      "Lock 을 사용하지 않고 데이터 읽기의 일관성을 보장해주는 방법",
    defShort: "Lock을 사용하지 않고 다중 버전으로 읽기의 일관성을 보장하는 방법",
    lead:
      "Lock 없는 읽기 일관성, MVCC(다중 버전 동시성 제어)",
    features: ["Lock 없는 읽기", "읽기 일관성", "이전 버전 보관"],
    keywords: ["직렬 가능성이 보장", "SCN(System Change Number)", "CR Copy", "Undo", "MGA", "Rollback Segment"],
    tables: [
      {
        caption: "MGA(Multi Generation Architecture) — PostgreSQL 방식",
        headers: ["구분", "설명"],
        rows: [
          ["방식", "레코드 갱신 처리 다세대 구조 방식"],
          ["1", "기존 데이터 유지 새 데이터 추가"],
          ["2", "기존 데이터 표시 삭제 없이 표시만"],
          ["3", "VACUUM 주기적 정리 작업"],
          ["4", "물리적 위치 변경 갱신 데이터 이동"],
          ["5", "인덱스 수정 발생 매 갱신 시 필수"],
        ],
      },
      {
        caption: "Rollback Segment — Oracle 방식",
        headers: ["방식", "설명"],
        rows: [
          ["방식", "기존 블록 변경 새 데이터로 갱신\n이전 데이터 보관 롤백 세그먼트"],
          ["동작", "조회 시점 SCN 변경 블록 식별\nCR 블록 생성 읽기 일관성 유지"],
          ["MGA와 차이점", "물리 위치 불변 갱신 시 위치 유지"],
        ],
      },
    ],
  },
  {
    title: "분산 DB",
    course: "DB",
    definition:
      "논리적으로 하나의 가상 시스템으로 구현되어 있으나, 물리적으로 네트워크를 통하여 분산화 된 형태로 관리되는 데이터베이스",
    defShort: "논리적으로 하나의 가상 시스템, 물리적으로 분산화된 형태로 관리 DB",
    lead: "물리 분산의 논리적 단일화, 분산 DB",
    features: ["논리 통합 물리 분산", "투명성 보장", "지역 자율성"],
    subDefs: [
      {
        name: "위치 투명성",
        lead: "물리적 위치의 은닉",
        def: "응용프로그램이 접근할 데이터의 물리적 위치를 알아야 할 필요 없는 성질",
      },
      {
        name: "복제 투명성",
        lead: "복제 여부의 은닉",
        def: "데이터가 물리적으로 여러 곳에 복제되어 있는지를 알 필요가 없는 성질",
      },
      {
        name: "병행 투명성",
        lead: "동시 수행의 무결성",
        def: "다중 사용자가 동시에 분산 DB에 트랜잭션 수행해도 결과 이상 없는 성질",
      },
      {
        name: "분할 투명성",
        lead: "단편 분할의 은닉",
        def: "논리적 릴레이션이 여러 단편으로 분할되어 저장됨을 알 필요가 없는 성질",
      },
      {
        name: "장애 투명성",
        lead: "지역 장애의 무결성 보존",
        def: "분산된 각 지역의 시스템에 이상이 생기더라도 무결성을 보존하는 성질",
      },
    ],
    keywords: ["2PC", "투명성"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["분산 DBMS", "광역 DBMS 여러 지역 통합"],
          ["지역 DBMS", "5개 모듈 구성 질의·복구 등\nACID 지원 OLTP 성격"],
        ],
      },
      {
        caption: "분산 DB 설계 전략 [탑버하]",
        headers: ["구분", "전략", "설명"],
        rows: [
          ["하향식", "Top Down", "전체 설계 후 분산 중앙집중식 유사\n기존 DB 부재 신규 DB 설계"],
          ["상향식", "Bottom Up", "지역 설계 후 통합 전사 관점 통합\n기존 DB 통합 이기종 연동 GW"],
          ["혼합", "Hybrid", "양 방식 혼합 통합 시 혼용 적용\n복잡도 높은 DB 상향식 적용 곤란"],
        ],
      },
      {
        caption: "분산 데이터베이스 투명성 [위복병분장]",
        headers: ["투명성", "주요개념", "장점", "단점"],
        rows: [
          ["위치 투명성", "물리 위치 불필요\nDDD 필요", "Application 단순화\n자유 Data 접근", "속도 저하\n저장공간 낭비"],
          ["복제 투명성", "복제 여부 불필요", "상향식 점진 확장", "이질형 구현 복잡"],
          ["병행 투명성", "동시 트랜잭션\n결과 이상 없음", "자원 사용 극대화", "복잡한 Locking"],
          ["분할 투명성", "단편 분할 불필요\nFragmentation 설계 필요", "Bottle neck 방지\n시스템 성능 향상", "설계기술 필요"],
          ["장애 투명성", "장애에도 무결성\n2PC 활용", "장애처리 단순", "원인규명 복잡"],
        ],
      },
      {
        caption: "분산방법 [위분복요]",
        headers: ["분산방법", "세부방법"],
        rows: [
          ["테이블 위치분산", "N/A"],
          ["테이블 분할분산", "수평 분할\n수직 분할"],
          ["테이블 복제분산", "부분복제\n광역복제"],
          ["테이블 요약분산", "분석요약\n통합요약"],
        ],
      },
    ],
    notes: ["기출: 138회 정보관리 3교시", "개념도: Client ↔ 분산 DBMS ↔ 분산 네트워크(투명성, 2PC) ↔ 지역 DBMS들(메시지 교환, 지역자율성) — 사용자·통합 제어·DB Node 분산"],
  },
  {
    title: "2PC",
    course: "DB",
    definition:
      "분산 데이터베이스 환경에서 원자성을 보장하기 위해 분산 트랜잭션에 관여하는 모든 노드가 Commit하거나, 모든 노드가 Rollback하는 메커니즘",
    defShort: "분산 트랜잭션 모든 노드의 Commit/Rollback 메커니즘",
    lead:
      "분산 트랜잭션 원자성 보장, 2PC(2-Phase Commit)",
    features: ["분산 원자성 보장", "조정자 중심 결정", "전원 커밋·롤백"],
    keywords: ["Global Coordinator", "지역 노드", "Prepare/Commit"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["조정", "조정자 (Global Coordinator)", "참여자 목록 보유 전역 커밋 시작"],
          ["참여", "지역 노드 (Local Coordinator)", "지역 트랜잭션 조정자 결정 준수"],
          ["참여", "Commit Point Site", "최초 커밋 노드 핵심 데이터 노드"],
          ["요청", "클라이언트(Client)", "타 노드 DB 이용 요청 주체 노드"],
        ],
      },
      {
        caption: "단계",
        headers: ["단계", "설명"],
        rows: [
          ["Phase 1 (Prepare 준비단계)", "지역 노드 요구 커밋 사이트 결정\nPrepare 원격 노드 응답"],
          ["Phase 2 (Commit 단계)", "전원 준비 완료 커밋 명령 하달\n에러 보고 수신 롤백 명령 하달"],
        ],
      },
    ],
    notes: ["개념도: ① Commit 요청 → ② Commit Point Site 결정 → ③ Prepare 메시지 전송 → ④ Prepare 메시지 응답 → ⑤ Commit/Rollback 명령 (Global Coordinator ↔ 지역 노드 1~N)"],
  },
  {
    title: "NoSQL",
    course: "DB",
    definition:
      "관계형 데이터베이스(RDBMS)의 테이블-컬럼과 같은 스키마 없이, 분산 환경에서 단순 검색 및 추가 작업이 용이하고, 지연(latency)과 처리율(throughput)이 높은 Database",
    defShort: "스키마 없이 분산 환경에서 검색·추가가 쉽고 처리율 높은 데이터베이스",
    lead:
      "스키마 없는 분산형 DB, NoSQL",
    features: ["스키마 리스", "분산 환경 단순 검색", "CAP 상충"],
    keywords: ["비정형 데이터", "스키마 리스", "CAP", "PACELC", "Key-Value", "Document", "Column", "Graph"],
    tables: [
      {
        caption: "NoSQL의 절차",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["탐색", "도메인 모델 파악", "저장할 도메인 파악\n개체·관계 분석, ERD 도식화"],
          ["설계", "쿼리결과 디자인", "도메인 모델 기반 쿼리 결과값 정의"],
          ["설계", "패턴을 이용한 데이터 모델링", "RDBMS 기능 배제 Put/Get 모델\nNoSQL 내 테이블 재정의"],
          ["설계", "기능 최적화", "Secondary Index 이용 기능 최적화"],
          ["최적화", "후보 NoSQL을 선정 및 테스트", "구조·특성 분석\n부하·안정성·확장성 테스트\n가장 적절한 솔루션 선택"],
          ["최적화", "선정된 NoSQL의 데이터 모델 최적화 및 하드웨어 디자인", "NoSQL 기반 데이터 모델 최적화\n애플리케이션 인터페이스 설계\n구동 하드웨어 디자인"],
        ],
      },
      {
        caption: "NoSQL의 유형 [키컬도그]",
        headers: ["모델 유형", "설명"],
        rows: [
          ["Key-Value", "키와 값의 쌍으로 관리\n가장 기본적·단순한 NoSQL 모델\nKey 단위연산 속도 빠름\n키 범위(Key Range) 처리 불가"],
          ["Column Family (Ordered Key-Value)", "키 범위 처리 개선 Key-Value 모델\n키 기반 Sorting 저장"],
          ["Document Key/Value Store", "스키마 없이 임의 속성 추가 가능\nDocument Id 기준 키 범위 처리\nJSON, XML 구조적 문서 저장\n쿼리 시 Parsing overhead 큼"],
          ["Graph 기반", "Entities 간 관계 저장 DB\n모든 Node·Edge에 고유 식별자\nTraversing 관계 기저장·빠름"],
        ],
      },
    ],
  },
  {
    title: "NoSQL 데이터모델링 패턴",
    course: "DB",
    definition:
      "Key/Value 저장 구조에 Put/Get 밖에 없는 DBMS에 다양한 형태의 Query 지원을 위한 테이블 디자인 가이드",
    defShort: "DBMS에 다양한 형태의 Query 지원을 위한 테이블 디자인 가이드",
    lead: "쿼리 중심 테이블 설계, NoSQL 데이터모델링 패턴",
    features: ["Put/Get 한계 보완", "데이터 중복 허용", "쿼리 중심 설계"],
    keywords: ["기본 데이터 모델링 패턴", "확장 데이터 모델링 패턴", "계층 데이터 모델링 패턴"],
    tables: [
      {
        caption: "기본적인 데이터모델링 패턴",
        headers: ["패턴", "설명", "특징"],
        rows: [
          ["Denormalization", "같은 데이터 중복\nJoin 없이 1회 I/O", "데이터 중복\n역정규화와 유사\n성능 향상"],
          ["Aggregation", "1:n 관계 최소화\n행마다 컬럼 상이", "유연한 스키마\nSchema-less"],
          ["Application Side Join", "Client 단에서\nJoin 로직 처리", "일부 Server side\nJoin 제공"],
        ],
      },
      {
        caption: "확장된 데이터모델링 패턴",
        headers: ["패턴", "설명", "특징"],
        rows: [
          ["Atomic aggregation", "테이블 통합", "트랜잭션 일관성"],
          ["Index Table", "별도 인덱스 생성", "조회용 인덱스"],
          ["Composite Key Table", "복합 키 모델", "복합 인덱스"],
        ],
      },
      {
        caption: "계층적인 데이터모델링 패턴",
        headers: ["구분", "패턴", "설명"],
        rows: [
          ["통째 저장", "Tree Aggregation", "트리 통째 저장 작고 변경 적음"],
          ["링크", "Adjacent Lists", "부모·자식 링크 연결 리스트 구조"],
          ["경로", "Materialized Path", "전체 경로 key 루트→노드 경로"],
        ],
      },
    ],
  },
  {
    title: "CAP 이론과 BASE 이론",
    course: "DB",
    definition:
      "CAP: 분산시스템이 갖출 수 있는 일관성, 가용성, 부분결함허용 3가지 특성 중 2가지만 선택 가능하다는 이론 / BASE: 가용성, 성능 향상을 중시하며 일관성 유지하는 분산시스템 특성",
    defShort: "3특성 중 2가지만 선택 CAP, 가용성 중시 일관성 유지하는 BASE",
    lead: "분산시스템 3특성의 선택, CAP 이론과 BASE 이론",
    features: ["동시 만족 불가", "가용성 우선", "최종 일관성"],
    keywords: ["일관성", "가용성", "파티션 허용성", "가용성"],
    tables: [
      {
        caption: "CAP 이론 [일가파]",
        headers: ["특성", "설명"],
        rows: [
          ["Consistency (일관성)", "모든 서버 동일 값 같은 시점 일치"],
          ["Availability (가용성)", "일부 서버 다운 시스템 정상 동작"],
          ["Partition Tolerance (부분결함허용)", "네트워크 장애 유실 시 동작 유지"],
        ],
      },
      {
        caption: "CAP 조합과 한계점",
        headers: ["구분", "설명"],
        rows: [
          ["RDBMS (CA)", "Oracle 등 일관성+가용성"],
          ["NoSQL (CP)", "HBase 등 일관성+파티션\n네트워크 분할 시 가용성 저하"],
          ["NoSQL (AP)", "Dynamo 등 가용성+파티션\n분할 시 가용 우선 일관성 저하"],
          ["한계점", "일관·가용 택1 CA 분할 시 취약\nPACELC 한계 극복 이론"],
        ],
      },
      {
        caption: "BASE 이론 [가분데비일]",
        headers: ["속성", "목적", "설명"],
        rows: [
          ["Basically Available", "분산 시스템의\n가용성 확보", "일부 실패 시 가용\n다수 복사본 저장"],
          ["Soft State", "분산 Node\n간 Data", "외부 정보 결정\n도달 시점 갱신"],
          ["Eventually Consistent", "일시적\n비일관성 허용", "도달 전 불일치\n최종 일관성 회복"],
        ],
      },
    ],
    notes: ["BASE 3대요소: Give up ACID, Give up SQL, Effect Scalability"],
  },
  {
    title: "PACELC",
    course: "DB",
    definition:
      "CAP 이론의 단점을 보완하기 위해 네트워크 장애 상황과 정상 상황으로 나누어서 설명하는 이론",
    defShort: "CAP 이론 단점을 보완, 장애 상황과 정상 상황으로 나눠 설명하는 이론",
    lead: "장애·정상 상황 상충 이론, PACELC",
    features: ["장애 시 A-C 상충", "정상 시 L-C 상충", "CAP 보완 이론"],
    keywords: ["Partition", "Availability", "Consistency", "Latency", "Consistency"],
    tables: [
      {
        caption: "개념도 해석",
        headers: ["항목", "설명"],
        rows: [
          ["파티션(네트워크 장애) 상황", "네트워크 단절 노드 접근 불가\nA·C 상충 C 또는 A 택일"],
          ["정상 상황", "전 노드 반영 긴 응답시간 소요\nL·C 상충 둘 중 하나 선택"],
        ],
      },
      {
        caption: "PACELC 이론에 따른 NoSQL 분류",
        headers: ["분류", "설명", "NoSQL"],
        rows: [
          ["PC/EC", "장애 시 C 위해\nA 희생\n정상 시 L 희생", "HBase, VoltDB\nMegastore"],
          ["PA/EL", "장애 시 가능 노드\n복구 후 전체 반영\n정상 시 L 우선", "Cassandra\nDynamo"],
          ["PA/EC", "장애 시 C 포기\n가능한 만큼 반영\n정상 시 강한 C", "MongoDB"],
          ["PC/EL", "장애 시 A 희생\n정상 시 C 희생", "PNUTS"],
        ],
      },
    ],
  },
  {
    title: "NewSQL",
    course: "DB",
    definition:
      "RDBMS의 ACID 특성을 유지하면서 NoSQL의 성능과 확장성을 제공하는 데이터베이스 관리시스템",
    defShort: "ACID 특성 유지, NoSQL의 성능과 확장성 제공 DB 관리시스템",
    lead:
      "ACID와 확장성의 결합, NewSQL",
    features: ["ACID 지원", "수평적 확장성", "비잠금 동시성 제어"],
    keywords: ["SQL기반 상호작용", "ACID 지원", "비 잠금 동시성 제어", "노드 단위 고성능", "병렬/비 공유 아키텍처"],
    tables: [
      {
        caption: "NewSQL 기능 [트아 SA비 노병]",
        headers: ["구분", "기능", "설명"],
        rows: [
          ["트랜잭션", "SQL 기반 상호작용", "App의 DBMS 연계 시 SQL 사용 통신\n입력·조회·갱신·삭제"],
          ["트랜잭션", "ACID 지원", "트랜잭션 커밋 필요 속성 ACID 지원\n원자성·일관성·고립성·지속성"],
          ["트랜잭션", "비잠금 동시성제어", "무결성 처리 위한 동시 제어\nNon-locking 구조 지원"],
          ["아키텍처", "노드단위 고성능", "단일 DBMS 서버 노드 단위 확장\n고성능 보장"],
          ["아키텍처", "병렬/비공유", "병렬 아키텍처 기반 고성능 처리\n데이터 중복 없이 서버별 독립"],
        ],
      },
      {
        caption: "NewSQL 기술요소 [R노 인M샤 스인D]",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["RDBMS 측면", "인덱싱", "DB 검색 속도 향상, 테이블 연관\n독립적인 저장공간"],
          ["RDBMS 측면", "MVCC", "다중 버전 동시성 제어\n트랜잭션 직렬화"],
          ["RDBMS 측면", "샤딩", "동일 스키마 데이터 DB 분산 저장"],
          ["NoSQL 측면", "스키마리스", "스키마 없이 Key-Value 기반\n단순 검색·추가 용이"],
          ["NoSQL 측면", "인메모리", "고성능, 저지연 서비스\n버퍼 관리 불필요"],
          ["NoSQL 측면", "DB 스케일링", "scale-out 방식 유연한 구조"],
        ],
      },
      {
        caption: "NewSQL, RDBMS, NoSQL 비교",
        headers: ["구분", "NewSQL", "RDBMS", "NoSQL"],
        rows: [
          ["ACID 특성", "ACID 특성 제공", "ACID 특성 제공", "ACID 특성 미제공"],
          ["BASE 특성", "BASE 특성 제공", "BASE 특성 미제공", "BASE 특성 제공"],
          ["스키마", "Schema-less", "Schema-full", "Schema-less"],
          ["확장성", "Scale-out", "Scale-up", "Scale-out"],
          ["솔루션", "Volt DB, Spanner", "Oracle, MSSQL", "MongoDB, Redis"],
        ],
      },
    ],
    notes: ["개념도: RDBMS(SQL — ACID 특성·SQL 지원) → NoSQL(수평적 확장성·고가용성 HA) → NewSQL(ACID + 수평적 확장성 + 고가용성 + SQL 지원)"],
  },
  {
    title: "벡터 데이터베이스(Vector Database)",
    course: "DB",
    definition:
      "방대한 양의 고차원 데이터를 벡터 형태로 최적화하여 저장하고 검색하기 위한 데이터베이스",
    defShort: "고차원 데이터를 벡터 형태로 최적화해 저장하고 검색하는 데이터베이스",
    lead: "고차원 벡터 저장·검색, 벡터 데이터베이스(Vector Database)",
    features: ["고차원 벡터 저장", "근사(ANN) 탐색", "유사성 검색"],
    keywords: ["임베딩", "유사도 측정", "유사성 검색"],
    tables: [
      {
        caption: "알고리즘 및 유사도 측정 방법 [랜양LHI]",
        headers: ["구분", "알고리즘/유사도", "설명"],
        rows: [
          ["알고리즘", "랜덤 투영(Random Projection)", "고차원→저차원 투영 차원 축소"],
          ["알고리즘", "제품 양자화(Product Quantization)", "저차원 분할·개별 양자화로 압축"],
          ["알고리즘", "LSH(Locality Sensitive Hashing)", "유사 데이터 동일 해시값 매핑 기법"],
          ["알고리즘", "HNSW(Hierarchical Navigable Small World)", "그래프 기반 ANN 알고리즘\n계층적 그래프 구성 탐색"],
          ["알고리즘", "IVF(Inverted File Index)", "여러 그룹 분할 후 필요 그룹만 검색"],
          ["유사도 측정", "코사인 유사도", "두 벡터 각도로 유사도 측정"],
          ["유사도 측정", "유클리드 거리", "두 점 직선거리로 유사도 측정"],
          ["유사도 측정", "맨하튼 거리", "두 점 거리 격자 기준 유사도 측정"],
          ["유사도 측정", "내적", "두 벡터 같은 방향 정도 측정"],
        ],
      },
      {
        caption: "동작 과정",
        headers: ["구분", "핵심 작동 원리", "설명"],
        rows: [
          ["① 벡터 임베딩", "벡터로 변환", "원본→숫자 벡터"],
          ["② 데이터 저장 및 인덱싱", "해싱 기반", "동일 버킷 할당"],
          ["② 데이터 저장 및 인덱싱", "양자화 기반", "하위 벡터 분할"],
          ["② 데이터 저장 및 인덱싱", "그래프 기반", "노드·엣지 표현"],
          ["② 데이터 저장 및 인덱싱", "트리 기반", "계층 분할 축소"],
          ["③ 쿼리 처리", "벡터로 변환", "동일 모델 사용"],
          ["④ 유사성 측정", "코사인 유사도", "벡터 사이 각도로 코사인 계산"],
          ["④ 유사성 측정", "유클리드 거리", "끝점 잇는 최단 직선 거리"],
          ["④ 유사성 측정", "내적", "각 성분 곱의 합"],
          ["④ 유사성 측정", "맨해튼 거리", "직각 거리 절댓값 합산"],
          ["④ 유사성 측정", "자카드 유사도", "교집합 크기/합집합 크기"],
          ["⑤ 후처리", "후처리 단계", "필터·순위 조정"],
        ],
      },
    ],
    notes: ["기출: 137회 정보관리 4교시, 2025.06 KPC 모의고사 2교시, 2025.01·2024.05 ITPE FR", "개념도: Context/Application → Embedding Model → Vector Embedding [0.12, -0.34, …] → Vector Database → Query Result"],
  },
  {
    title: "ANN(Approximate Nearest Neighbor) 알고리즘",
    course: "DB",
    definition:
      "고차원 벡터 공간에서 주어진 쿼리 벡터에 가장 가까운 이웃(neighbor)을 빠르게 찾기 위한 근사 최근접 이웃 알고리즘",
    defShort: "쿼리 벡터에 가장 가까운 이웃을 빠르게 찾는 근사 최근접 이웃 알고리즘",
    lead: "쿼리 벡터 근사 이웃 탐색, ANN 알고리즘",
    features: ["근사 최근접 탐색", "고차원 벡터 대상", "정확도·속도 교환"],
    keywords: ["고차원 벡터 유사성 탐색", "k-d 트리", "LSH", "HNSW", "NSG", "IVF", "PQ", "벡터DB"],
    tables: [
      {
        caption: "알고리즘 절차",
        headers: ["절차", "설명"],
        rows: [
          ["①", "Vector 공간 임의의 두 점 선택\nhyperplane로 Vector Space 나눔"],
          ["②", "Subspace 점 개수를 node로\nbinary tree 생성 또는 갱신"],
          ["③", "점 K개 초과 Subspace는 ①·② 반복"],
          ["④", "현재 점 binary tree 검색 후\n해당 subspace에서 NN search"],
        ],
      },
      {
        caption: "ANN 알고리즘 구성요소",
        headers: ["요소", "설명", "주요 알고리즘"],
        rows: [
          ["공간 분할 기반", "벡터 공간을 분할\n관련 영역만 탐색\n고차원 성능 저하", "k-d 트리, Annoy\nLSH"],
          ["그래프 기반", "노드·엣지 표현\n근접성 그래프\n구축 시간 김", "HNSW, NSG\n그래프 탐색"],
          ["압축 및 양자화 기반", "저차원 압축\n이산 코드 변환\n정보 손실 위험", "PQ(Product Quantization)\nIVF(Inverted File Index)"],
        ],
      },
    ],
    notes: ["기출: 2025.10 KPC 모의고사 1교시, 2025.10 ITPE 모의고사 3교시"],
  },
  {
    title: "SQL(Structured Query Language)",
    course: "DB",
    definition:
      "관계형 데이터베이스 관리시스템(RDBMS)에서 자료 검색과 관리, 스키마 생성 및 수정, 객체 접근 조정 관리를 위한 프로그래밍 언어",
    defShort: "RDBMS 검색·관리, 스키마 생성·수정, 객체 접근 조정 관리 언어",
    lead: "RDBMS 표준 질의 언어, SQL(Structured Query Language)",
    features: ["비절차적 언어", "RDBMS 대상", "SQL-99 표준화"],
    subDefs: [
      {
        name: "DDL (Data Definition Language)",
        lead: "스키마 객체의 구조 정의",
        def: "스키마 객체를 생성·변경·제거해 데이터베이스 구조를 설정하는 언어",
      },
      {
        name: "DML (Data Manipulation Language)",
        lead: "저장 자료의 조작",
        def: "데이터베이스에 저장된 자료들을 입력·수정·삭제·조회하는 언어",
      },
      {
        name: "DCL (Data Control Language)",
        lead: "사용자 권한의 제어",
        def: "GRANT·REVOKE로 사용자에게 권한을 주거나 삭제하는 언어",
      },
      {
        name: "TCL (Transaction Control Language)",
        lead: "트랜잭션의 제어",
        def: "COMMIT·ROLLBACK만 분리한 트랜잭션을 제어하는 명령",
      },
    ],
    keywords: ["비절차적 언어", "DDL", "DML", "DCL", "TCL", "SQL-99"],
    tables: [
      {
        caption: "SQL 유형",
        headers: ["유형", "개념", "구문"],
        rows: [
          ["DDL (Data Definition Language)", "생성·변경·제거\n데이터 관계 정의\nDB 구조 설정", "CREATE, ALTER\nDROP, TRUNCATE\nRENAME"],
          ["DML (Data Manipulation Language)", "입력·수정·삭제·조회", "INSERT, UPDATE\nDELETE\nSELECT"],
          ["DCL (Data Control Language)", "권한 부여·삭제", "COMMIT, ROLLBACK\nGRANT\nREVOKE"],
          ["TCL (Transaction Control Language)", "트랜잭션 제어\nDCL 중 COMMIT·ROLLBACK 분리", "COMMIT, ROLLBACK\nSAVEPOINT"],
        ],
      },
    ],
    notes: ["SQL Commands 분류: DDL(CREATE·ALTER·DROP·RENAME·TRUNCATE·COMMENT) / DML(SELECT·INSERT·UPDATE·DELETE·MERGE·CALL·EXPLAIN PLAN·LOCK TABLE) / DCL(GRANT·REVOKE) / TCL(COMMIT·ROLLBACK·SAVEPOINT·SET TRANSACTION)"],
  },
  {
    title: "조인(Join)",
    course: "DB",
    definition:
      "두 개의 테이블을 엮어서 원하는 데이터를 추출하는 방법",
    defShort: "SQL JOIN으로 두 테이블을 엮어서 원하는 데이터를 추출하는 방법",
    lead:
      "테이블 결합의 데이터 추출, 조인(Join)",
    features: ["두 테이블 결합", "처리량별 선택", "조인 순서 영향"],
    keywords: ["Equi Join", "Nature Join", "Outer Join", "Semi Join", "Nested Loop Join(선행,인덱스,후행)", "Sort Merge Join(정렬)", "Hash Join(인덱스,선행,해시)"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명"],
        rows: [
          ["관계대수 측면", "Equi join, Natural join\nOuter join, Semi join"],
          ["메커니즘 측면", "Nested Loop Join\nSort Merge Join\nHash Join"],
        ],
      },
      {
        caption: "조인 메커니즘",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["반복", "Nested Loop Join", "선행 테이블 범위 하나씩 액세스\n후행 테이블 조인 추출값으로 연결"],
          ["정렬", "Sort Merge Join", "양쪽 각자 정렬 각자 액세스 정렬\n순차 스캔 병합 연결 조건 병합"],
          ["해시", "Hash Join", "작은 집합 해시 메모리 해시 생성\n큰 집합 탐색 해시 탐색 조인"],
        ],
      },
      {
        caption: "메커니즘 비교",
        headers: ["구분", "Nested Loop Join", "Sort Merge Join", "Hash Join"],
        rows: [
          ["처리범위", "부분범위", "전체범위", "전체범위"],
          ["처리량", "소량 데이터", "대량 데이터", "대량 데이터"],
          ["액세스방식", "Index Scan\nRandom Access", "Table Full Scan\nSequential Access", "Table Full Scan\nSequential Access"],
          ["조인방향", "영향큼", "영향없음", "영향있음"],
          ["사용자원", "Buffer Cache", "PGA", "PGA"],
          ["사용환경", "OLTP", "OLAP", "OLAP"],
          ["사용조건", "일반적 발생", "인덱스 없을 때", "대량 집계 작업"],
          ["Hint", "/*+ USE_NL */", "/*+ USE_MERGE */", "/*+ USE_HASH */"],
          ["고려사항", "테이블 접근순서\n조인절 인덱스", "Sort Area Size", "Hash Area Size\n소량 Driving"],
        ],
      },
    ],
  },
  {
    title: "RDBMS 인덱스(index)",
    course: "DB",
    definition:
      "어떤 파일의 레코드들에 대한 효율적 접근을 위해 <레코드 키 값, 레코드 주소(포인터)> 쌍을 체계적으로 수집하여 관리하는 데이터베이스 오브젝트",
    defShort: "레코드들에 대한 효율적 접근 위해 키 값·주소 쌍 관리하는 DB 오브젝트",
    lead:
      "키-주소 쌍의 접근 가속, RDBMS 인덱스(index)",
    features: ["키값·주소 쌍 관리", "탐색 범위 축소", "갱신 부담 존재"],
    keywords: ["트리 기반", "해쉬 기반", "비트맵", "함수 기반", "조인", "도메인", "정적", "동적", "논리적 인덱스", "물리적 인덱스"],
    tables: [
      {
        caption: "인덱스 유형 [트해비 함조도 정동 논물]",
        headers: ["분류", "인덱스 구조", "설명"],
        rows: [
          ["형태", "트리 기반 인덱스", "인덱스(RDBMS는 대부분 B-tree)"],
          ["형태", "해시 기반 인덱스", "Hash 테이블 이용 데이터 검색\n=, <=, => 연산자만 사용 가능"],
          ["형태", "비트맵 인덱스", "비트로 컬럼 값 저장\nROWID 자동 생성"],
          ["목적", "함수기반 인덱스", "사용자 정의 함수 결과 인덱스 사용\n데이터 타입 상이한 컬럼 간 사용"],
          ["목적", "조인 인덱스", "DW에서 조인 쿼리 처리 가능"],
          ["목적", "도메인 인덱스", "사용자 정의 인덱스 타입 사용\n텍스트, 카테고리 인덱스 등"],
          ["구조", "정적 인덱스", "삽입·삭제 시 인덱스 내용 변경\n인덱스 구조는 불변"],
          ["구조", "동적 인덱스", "인덱스·데이터 파일 블록 구성\n삽입 대비 빈 공간 미리 준비"],
          ["논리", "논리적 인덱스", "생성 시 컬럼 속성·유형 따라 분리"],
          ["논리", "물리적 인덱스", "저장 데이터 구조에 따라 구분"],
        ],
      },
      {
        caption: "스캔방식",
        headers: ["구분", "방식", "설명"],
        rows: [
          ["수직+수평", "Index Range Scan", "수직 탐색 후 루트→리프 블록\n리프 범위 스캔 필요 범위만"],
          ["수평", "Index Full Scan", "리프 수평 탐색 처음부터 끝까지\n차선책 선택 최적 인덱스 부재"],
          ["수직", "Index Unique Scan", "수직 탐색만 단일 데이터 조회\n= 조건 탐색 등호 조건 작동"],
          ["선두 생략", "Index Skip Scan", "선두 컬럼 생략 조건절 없이 활용\n가능 블록만 해당 블록 액세스"],
          ["역방향", "Index Range Scan Descending", "레인지 스캔 동일 뒤에서 앞으로\n역방향 스캔 내림차순 조회"],
        ],
      },
    ],
  },
  {
    title: "쿼리오프로딩(Query offloading)",
    course: "DB",
    definition:
      "DB 트랜잭션에서 Update와 Read를 분리하여 DB 처리량을 증가시켜 DB 성능을 향상시키는 기법",
    defShort: "Update와 Read를 분리하여 DB 처리량을 증가시키는 기법",
    lead:
      "읽기·쓰기 트랜잭션 분리, 쿼리오프로딩(Query offloading)",
    features: ["Update/Read 분리", "Read 수평 확장", "복제 지연 존재"],
    keywords: ["Update/Read 트랜잭션 분리", "Master DB", "Staging DB", "Slave DB"],
    tables: [
      {
        caption: "트랜잭션 유형별 사용률",
        headers: ["유형", "사용률"],
        rows: [
          ["Read 트랜잭션", "70~90% 이용"],
          ["Update 트랜잭션", "10~30% 이용\n(Create/Delete/Update)"],
        ],
      },
      {
        caption: "구성요소 [마스슬C로]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["DB", "Master DB", "Update 트랜잭션(C/D/U)만 수행"],
          ["DB", "Staging DB", "Slave DB 복제 중간 경유지\n직접 복제 시 성능저하 유발 방지"],
          ["DB", "Slave DB", "Read 트랜잭션만 수행, N개 구성\n장애 시 다른 인스턴스 접근(HA)"],
          ["복제 기술", "CDC(Change Data Capture)", "Back Log 읽어 Target DB에 replay\nGolden Gate, Share Flex, Galera"],
          ["조회", "load balancing", "Slave DB 조회 부하 분산"],
        ],
      },
      {
        caption: "쿼리 오프로딩과 샤딩 비교",
        headers: ["구분", "쿼리 오프로딩", "샤딩"],
        rows: [
          ["개념", "갱신·조회 분리\n트랜잭션 유형별", "다중 인스턴스\n데이터 분할 저장"],
          ["목적", "DB 성능 향상", "용량 한계 극복"],
          ["기법", "CDC 복제", "Vertical 파티셔닝"],
          ["구성요소", "마스터 스테이징\nSlave DB", "Shard 단위\n분산된 DB"],
          ["구현방법", "애플리케이션\n계층에서 구현", "DBMS 자체\n프레임워크·앱"],
        ],
      },
    ],
    notes: ["개념도: Application → Connection Pool(Update purpose) → Master DB → Replication(CDC) → Staging DB → Replication(CDC) → Slave DB(N개) ← Connection Pool(Read purpose, Load Balancing/HA required)"],
  },
  {
    title: "데이터베이스 파티셔닝(Partitioning)",
    course: "DB",
    definition:
      "대규모 테이블의 데이터를 파티션 키를 기준으로 여러 물리적 세그먼트에 나누어 저장함으로써 관리와 성능을 최적화하는 데이터베이스 설계 기법",
    defShort: "테이블을 파티션 키 기준으로 물리적 세그먼트에 나눠 저장하는 설계 기법",
    lead: "파티션 키 기준 분할, 데이터베이스 파티셔닝(Partitioning)",
    features: ["파티션 키 기준 분할", "물리 세그먼트 분산", "논리적 단일 테이블"],
    keywords: ["성능향상", "수직분할", "수평분할", "레인지", "리스트", "해시", "결합", "참조", "인터벌 파티셔닝", "로컬 파티션", "비파티션", "글로벌파티션"],
    tables: [
      {
        caption: "테이블 파티셔닝 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["단일 기준", "레인지 파티셔닝(Range Partitioning)", "키 값 범위 분할 레인지 기준 구간\n가장 일반적 형태 일정 범위 지정"],
          ["단일 기준", "리스트 파티셔닝(List Partitioning)", "불연속 값 목록 파티션별 지정\n순서 무관 데이터 리스트 그룹핑"],
          ["단일 기준", "해시 파티셔닝(Hash Partitioning)", "해시 함수 적용 해쉬테이블 매핑\n파티션 고른 분산 병렬 시 성능향상"],
          ["복합", "결합 파티셔닝(Composite Partitioning)", "레인지+해시 등 1차 레인지 분할\n서브 파티션 구성 각 기법 장점 결합"],
          ["참조", "Reference 파티셔닝", "부모 파티션 키 부모 키 이용 참조\n자식 테이블 분할 종속 파티셔닝"],
          ["자동 생성", "Interval 파티셔닝", "레인지 생성 시 인터벌 기준 정의\n간격 기준 정의 정해진 간격 분할"],
        ],
      },
      {
        caption: "인덱스 파티셔닝 유형",
        headers: ["구분", "비파티션", "글로벌", "로컬"],
        rows: [
          ["비파티션 테이블", "가능", "가능", "(없음)"],
          ["파티션 테이블", "가능", "공유", "개별"],
        ],
      },
      {
        caption: "설계 절차",
        headers: ["절차", "설명"],
        rows: [
          ["액세스 패턴 분석", "조회·수정 조건 접근 조건 파악"],
          ["데이터 분포 분석", "조건별 분산 상태 데이터 분산 확인"],
          ["인덱스 설계", "자주 조회 컬럼 인덱스 추가\n파티션 키 일치 일치 여부 검토"],
          ["테이블 파티셔닝 설계", "데이터 분할 설계 관리·성능 개선"],
          ["인덱스 파티셔닝 설계", "글로벌 또는 로컬 파티션 구조 맞춤"],
        ],
      },
    ],
    notes: ["기출: 2025.01 ITPE FR 4일차 2교시, 119회 컴시응 3교시"],
  },
  {
    title: "데이터베이스 샤딩(Sharding)",
    course: "DB",
    definition:
      "물리적으로 다른 데이터베이스에 데이터를 샤드(Shard)라고 부르는 각각의 개별 파티션으로 수평 분할 방식으로 분산 저장하고 조회하는 기법",
    defShort: "물리적으로 다른 DB에 샤드라는 파티션으로 수평 분할, 분산 저장 기법",
    lead:
      "샤드 단위 수평 분할 분산, 데이터베이스 샤딩(Sharding)",
    features: ["수평 분할", "물리적 분산 저장", "샤드 키 의존"],
    keywords: ["샤드", "수평분할"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["저장", "Shard DB", "분할 테이블 보유 분할 데이터 포함\n실제 요청 처리 사용자 질의 수행"],
          ["설정", "shard metadata", "동작 설정 정보 질의 분석 기준\n샤드 DB 선택 세션 생성 정보"],
          ["식별", "shard key", "샤드 선택 식별자 테이블 내 컬럼"],
          ["식별", "shard key data", "질의 내 힌트 샤드 식별 키 값"],
          ["식별", "shard ID", "샤드 DB 식별자 개별 샤드 구분"],
          ["중개", "proxy", "질의 힌트 해석 미들웨어 역할\n메타데이터 이용 샤드 DB에 전달"],
        ],
      },
      {
        caption: "샤딩 분할방법 [해레디]",
        headers: ["분할방법", "분할원리", "설명"],
        rows: [
          ["Hash Sharding", "해시값 라우트", "해시함수로 데이터 균일 분산저장\n샤드 추가 시 데이터 재정렬 필요"],
          ["Range Sharding", "범위 기준 라우트", "특정 범위 기준 분산 저장\n샤드 추가 시 재정렬 비용 발생\n일부 샤드에 데이터 집중 가능"],
          ["Directory Sharding", "조회 테이블 사용", "샤드 목록 테이블 관리 분산처리\n목록 테이블이 단일 장애 포인트"],
        ],
      },
      {
        caption: "샤딩과 파티셔닝 비교",
        headers: ["구분", "샤딩", "파티셔닝"],
        rows: [
          ["개념", "다중 인스턴스\n데이터 분할", "단일 인스턴스\n테이블 분할"],
          ["분할 방식", "수평 분할만", "수평·수직 분할"],
          ["관리", "마스터 노드 관리", "별도 마스터 없음"],
          ["분할 데이터 저장위치", "별도 서버 저장", "동일 서버 저장"],
          ["키", "샤드 키 저장", "별도 키 없음"],
        ],
      },
    ],
    notes: ["기출: 127회 정보관리 4교시, 2023.08 ITPE FR 3일차 1교시"],
  },
  {
    title: "데이터 표준화",
    course: "DB",
    definition:
      "시스템별로 산재해 있는 데이터 정보 요소에 대한 명칭, 정의, 형식, 규칙에 대한 원칙을 수립하여 전사적으로 적용하는 활동",
    defShort: "데이터 명칭·정의·형식·규칙 원칙을 수립해 전사에 적용하는 활동",
    lead: "명칭·정의·형식·규칙 통일, 데이터 표준화",
    features: ["전사적 적용", "표준 원칙 수립", "데이터 불일치 해소"],
    keywords: ["표준 원칙 수립", "데이터 표준", "관리조직", "표준화 프로세스"],
    tables: [
      {
        caption: "표준화 필요성",
        headers: ["필요성", "설명"],
        rows: [
          ["데이터 불일치", "동일 의미 데이터 다른 명칭 관리\n데이터 불일치 발생"],
          ["데이터 통합 어려움", "전사 DW 구축 시 통합 정보 요건 기반\n의미파악·중복여부 파악 어려움"],
          ["정보시스템 변경 및 유지보수 곤란", "유지보수 시 의미 파악 어려움\n신규 요건 반영 시 데이터 활용 곤란"],
        ],
      },
      {
        caption: "표준화 대상 및 체계",
        headers: ["구분", "요소", "상세설명"],
        rows: [
          ["대상", "데이터 명칭", "유일 구별 이름"],
          ["대상", "데이터 정의", "의미 범위 규정"],
          ["대상", "데이터 형식", "표현 형태 정의"],
          ["대상", "데이터 규칙", "가능 값 사전 정의"],
          ["체계", "데이터 표준", "전 객체 대상 관리"],
          ["체계", "데이터 표준\n관리조직", "정의 체계화 감독\n계획 수립 통제"],
          ["체계", "데이터 표준화\n프로세스", "요구 수집·정의\n확정·관리 절차"],
        ],
      },
    ],
    notes: ["개념도: 데이터 명칭·정의·형식·규칙 → 전사적 표준 적용 → 한글명, 영문명, 영문 약어명, 데이터 타입, 데이터 길이, 소수점 이하 길이"],
  },
  {
    title: "데이터 거버넌스(Data Governance)",
    course: "DB",
    definition:
      "전사 차원의 모든 데이터에 대한 정책, 지침, 표준화, 전략을 수립하고 데이터를 관리하는 조직과 프로세스를 구축함으로써 고품질의 데이터를 활용하여 기업의 가치 창출을 지원하는 체계",
    defShort: "데이터 정책·지침·표준화·전략 수립 관리 조직·프로세스 구축 체계",
    lead:
      "전사 데이터 관리 체계, 데이터 거버넌스(Data Governance)",
    features: ["전사 차원 관리", "표준 기반 통제", "데이터 가치 창출"],
    keywords: ["품메주보", "데이터 관리 원칙", "데이터 관리 조직", "데이터 관리 프로세스", "성숙도 단계"],
    tables: [
      {
        caption: "프레임워크 주요기능 [품메주보]",
        headers: ["기능", "설명"],
        rows: [
          ["데이터 품질 관리(DQM)", "프로파일링 품질 진단 작업\n데이터 정제 사용방법별 실행"],
          ["메타 데이터 관리", "데이터 검색 지원 데이터 찾기 실행\n분석 도구 해석 정확한 해석 사용"],
          ["데이터 주기 관리", "생성→폐기 흐름 전 수명주기 관리\n관리 정책 수립 시스템 흐름 통제"],
          ["데이터 보안 및 프라이버시", "요구사항·정책 보호 수준 정의\n사용자 역할 기반 역할별 차등 보호"],
        ],
      },
      {
        caption: "성숙도 단계",
        headers: ["단계", "구분", "수준", "품질부문", "통제부문", "조직부문"],
        rows: [
          ["1단계", "도입", "데이터 품질 관리", "전사 연계 없음", "통제되지 않음", "독립 부서 없음"],
          ["2단계", "프로세스화", "프로세스화", "거버넌스 절차", "의사결정 체계", "담당자 배치"],
          ["3단계", "통합경영", "경영진 주도", "품질관리 진행", "전사 전략 반영", "독립 조직 존재"],
          ["4단계", "위험대응", "정량화", "정량 품질 관리", "위험 평가·개선", "조직·위험 관리"],
          ["5단계", "가치창출", "성과, 문화", "데이터 성과 창출", "사업·전략 반영", "경영진 포함 관리"],
        ],
      },
    ],
    notes: ["프레임워크 개념도: 데이터 관리 원칙(지붕) → 데이터 관리 조직 → 6기둥(데이터 표준·구조·흐름·품질·베이스·보안) → 데이터 관리 프로세스 → 인프라"],
  },
  {
    title: "데이터 프로파일링(Data Profiling)",
    course: "DB",
    definition:
      "정형, 비정형 데이터 값을 중심으로 비지니스 규칙 및 분석 알고리즘 등 통계적 기법을 사용하여 데이터의 품질을 확보하기 위한 데이터의 특징을 분석하는 과정",
    defShort: "통계적 기법을 사용해 데이터 품질 확보 위한 데이터 특징을 분석하는 과정",
    lead: "품질 확보 위한 특징 분석, 데이터 프로파일링(Data Profiling)",
    features: ["통계적 기법 활용", "데이터 값 중심", "정형·비정형 적용"],
    keywords: ["데이터 품질 확보", "통계적 기법", "구조", "컨텐츠", "관계의 발견", "관계분석", "테이블구조분석", "컬럼 분석"],
    tables: [
      {
        caption: "프로파일링 절차 [수대수리종]",
        headers: ["단계", "설명"],
        rows: [
          ["메타데이터 수집 및 분석", "사전 수집 테이블, 컬럼 분석"],
          ["프로파일링 대상 및 유형선정", "대상업무 테이블 선정\n분석유형 결정"],
          ["프로파일링 수행", "누락값, 비유효값 분석\n무결성 위반사항 분석"],
          ["프로파일링 결과 리뷰", "프로파일링 결과 취합 및 결과 리뷰"],
          ["프로파일링 결과 종합", "결과물 취합\n결과보고서 작성"],
        ],
      },
      {
        caption: "정형 데이터 프로파일링의 분석기술 [기컬패유구]",
        headers: ["분석기술", "설명"],
        rows: [
          ["기초데이터 분석", "컬럼속성 분석"],
          ["컬럼값 분석", "누락값 분석\n값의 허용범위 분석"],
          ["컬럼패턴 분석", "문자열 패턴 분석\n날짜유형분석\n특수도메인 분석"],
          ["컬럼 유형 분석", "유일값 분석"],
          ["테이블 구조 분석", "구조분석"],
        ],
      },
      {
        caption: "비정형 데이터 프로파일링의 분석기술 [탐도이매]",
        headers: ["분석기술", "설명"],
        rows: [
          ["데이터 탐색기능(데이터분포확인)", "통계"],
          ["데이터 도메인 자동판별", "분류 알고리즘"],
          ["이상값 탐지(단변량, 다변량)", "시각화"],
          ["데이터 매칭 및 중복관리", "데이터 유사도"],
        ],
      },
    ],
    notes: ["개념도: 통계적 기법 활용 → 데이터 프로파일링 프로세스 → 구조, 컨텐츠, 관계 발견"],
  },
  {
    title: "데이터 분석 거버넌스(Data Analytics Governance)",
    course: "DB",
    definition:
      "전사 차원의 모든 데이터에 대하여 정책 및 지침, 표준화, 운영조직 및 책임 등의 표준화 된 관리 체계를 수립하고 운영을 위한 프레임워크 및 저장소를 구축하는 활동",
    defShort: "정책·지침·표준화·운영조직·책임의 표준화된 관리 체계 수립 활동",
    lead:
      "표준화된 분석 관리 체계, 데이터 분석 거버넌스",
    features: ["전사 표준 관리체계", "분석 컨트롤 타워", "분석 수준 진단"],
    keywords: ["COA", "분석조직", "분석전문인력", "프로세스", "교육", "준비도", "성숙도"],
    tables: [
      {
        caption: "구성요소 [조프시데인]",
        headers: ["구성요소", "설명"],
        rows: [
          ["조직", "분석기획 및 관리\n수행 조직"],
          ["프로세스", "과제 기획 및 운영"],
          ["시스템", "분석관리시스템"],
          ["데이터", "분석 대상 데이터"],
          ["인력자원", "분석교육/마인드\n육성체계"],
        ],
      },
      {
        caption: "데이터 분석 거버넌스 체계 [조프인수교]",
        headers: ["체계", "세부업무", "설명"],
        rows: [
          ["분석조직", "분석 컨트롤 타워", "분석 가치 발견 및 과제 정의\n인사이트 실행"],
          ["프로세스", "EDA·CDA\n탐색·확증 분석", "요건정의, 모델링\n검증 및 테스트, 적용"],
          ["분석전문인력", "데이터사이언티스트", "기초 통계학·분석 방법 지식\n분석 경험"],
          ["분석수준진단", "분석 준비도\n분석 성숙도", "도입 여부 점검\n활용 수준 점검"],
          ["분석교육", "가설 검증 능력", "데이터 훈련 프로그램 진행\n전 비즈니스 분야 분석 업무 활용"],
        ],
      },
    ],
  },
  {
    title: "데이터 분석 준비도와 데이터 분석 성숙도",
    course: "DB",
    definition:
      "준비도: 기업의 데이터 분석 도입의 수준을 파악하기 위한 진단방법 / 성숙도: 기업의 분석 능력 및 분석 결과 활용에 대한 조직의 성숙도 수준을 평가하는 모델",
    defShort: "분석 도입 수준 진단방법인 준비도와 분석 능력·활용 성숙도 평가 모델",
    lead:
      "분석 수준진단 두 축, 데이터 분석 준비도와 성숙도",
    features: ["두 축 수준 진단", "CMMI 기반 단계", "유형별 개선 방향"],
    keywords: ["수준", "성숙도"],
    tables: [
      {
        caption: "데이터 분석 준비도(Readiness) [업조기데문인]",
        headers: ["영역", "진단 항목"],
        rows: [
          ["(1) 분석 업무파악", "발생한 사실 분석업무\n예측/시뮬레이션 분석업무\n최적화 분석업무\n분석 업무 정기적 개선"],
          ["(2) 인력 및 조직", "분석 전문가 직무 존재·교육훈련\n관리자 기본 분석능력\n전사분석 총괄조직\n경영진 분석 업무 이해력"],
          ["(3) 분석 기법", "업무별 적합한 분석기법 사용\n분석업무 도입 방법론\n분석기법 라이브러리\n효과성 평가·정기적 개선"],
          ["(4) 분석 데이터", "데이터 충분성·신뢰성·적시성\n비구조적 데이터 관리\n외부 데이터 활용 체계\n기준데이터관리(MDM)"],
          ["(5) 분석 문화", "사실에 근거한 의사결정\n관리자의 데이터 중시\n회의 등에서의 데이터 활용"],
          ["(5) 분석 문화", "경영진의 직관보다 데이터\n데이터 공유 및 협업문화"],
          ["(6) IT 인프라", "운영시스템 데이터통합\nEAI/ETL 등 데이터 유통체계\n분석 전용 서버 및 스토리지\n빅데이터·통계·비주얼 분석 환경"],
        ],
      },
      {
        caption: "데이터 분석 성숙도(Maturity) [도활확최] — CMMI 기반",
        headers: ["단계", "설명"],
        rows: [
          ["도입", "시스템 구축 분석 시작 단계"],
          ["활용", "업무 적용 단계 분석 결과 활용"],
          ["확산", "전사 공유 단계 조직 전체 활용"],
          ["최적화", "혁신·성과 기여 최적화 단계"],
          ["대상 부문", "비즈니스·조직 활용·조직 역량\nIT 인프라 부문 분석 인프라"],
        ],
      },
      {
        caption: "데이터 분석 수준진단 결과 활용 방안",
        headers: ["유형", "위치", "설명"],
        rows: [
          ["도입형", "준비도 높음\n성숙도 낮음", "인프라 준비 완료\n업무·기법 부족"],
          ["확산형", "준비도 높음\n성숙도 높음", "6가지 요소 구비\n지속 확산 필요"],
          ["준비형", "준비도 낮음\n성숙도 낮음", "인력·조직 미비\n사전 준비 필요"],
          ["정착형", "준비도 낮음\n성숙도 높음", "제한적 사용 중\n1차 정착 필요"],
        ],
      },
    ],
  },
  {
    title: "데이터 마이닝 방법론",
    course: "DB",
    definition:
      "데이터베이스에서 인사이트를 발굴하기 위한 KDD, SEMMA, CRISP-DM 등 체계적 프로세스로 정의된 데이터 마이닝 방법론",
    defShort: "인사이트 발굴을 위한 KDD·SEMMA·CRISP-DM 방법론",
    lead:
      "3대 마이닝 프로세스, 데이터 마이닝 방법론",
    features: ["단계적 반복 수행", "데이터 준비 비중", "비즈니스 목적 연계"],
    keywords: ["KDD", "CRISP-DM", "SEMMA"],
    tables: [
      {
        caption: "KDD 절차 — 1996년 Fayyad, 인사이트 발굴을 위한 5개 프로세스",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["데이터 처리", "데이터셋 선택 (Selection)\n데이터 전처리 (Preprocessing)\n데이터 변환 (Transformation)", "데이터 선택, 데이터셋 생성\n잡음·이상값·결측값 식별·제거\n변수 선택·차원 축소 후 변환"],
          ["데이터 마이닝", "데이터 마이닝 (Data Mining)\n마이닝 결과 평가 (Interpretation/Evaluation)", "기법·알고리즘으로 마이닝 수행\n분석 결과 해석·평가 및 활용"],
        ],
      },
      {
        caption: "SEMMA 절차 — SAS 개발, 단계별 프로세스 순차 실행",
        headers: ["단계", "주요 활동", "기법"],
        rows: [
          ["Sampling", "분석 데이터 생성\n평가 데이터 준비", "통계적 추출\n조건 추출"],
          ["Explore", "데이터 탐색\n오류·이상 검색", "그래프, 통계\n클러스터링"],
          ["Modify", "수정·변환\n정보 표현 극대화", "수량화, 표준화\n변환, 그룹화"],
          ["Modeling", "모델 구축\n패턴 발견", "Neural Network\nDecision Tree"],
          ["Assessment", "모델 평가·검증\n모델 간 비교", "Report\nReview"],
        ],
      },
      {
        caption: "CRISP-DM 절차 — 계층적 프로세스 모델, 4개 레벨·6단계",
        headers: ["단계", "주요 활동", "산출물"],
        rows: [
          ["비즈니스 이해", "고객 이해 평가\n목표·계획 수립", "Success Criteria\nGoals and Criteria"],
          ["데이터 이해", "초기 수집 확보\n품질 검사 검증", "Initial Data Report\nQuality Report"],
          ["데이터 준비", "선택 정제 확보\n통합·형식 보완", "Cleaning Report\nMerged Data"],
          ["모델링", "기법 선택 검증\n모델 생성·순위", "Model Assessment\nTest Design"],
          ["평가", "결과 평가 리뷰\n다음 단계 결정", "Review Report\nPlan Report"],
          ["전개", "전개·유지 전략\n최종보고 검토", "Detail Plan\nFinal Report"],
        ],
      },
    ],
    notes: ["CRISP-DM 4개 레벨: Phase(최상위 레벨) → Generic Tasks(단일 태스크 완전 수준) → Specialized Tasks(구체적 실행 수준) → Process Instances(프로세스 실행 수준)"],
  },
  {
    title: "탐색적 데이터 분석과 확증적 데이터 분석",
    course: "DB",
    definition:
      "탐색적 데이터분석(EDA): 시각화 기법을 통해 데이터의 구조를 이해하고 인사이트를 도출하기 위한 데이터 분석 기법 / 확증적 데이터분석(CDA): 가설을 설정한 후 수집한 데이터로 가설을 평가하고 추정하는 전통적인 분석기법",
    defShort: "인사이트를 도출하는 EDA와 가설을 평가하고 추정하는 CDA 기법",
    lead: "인사이트 도출과 가설 검정, 탐색적·확증적 데이터 분석",
    features: ["시각화 탐색", "가설 설정 후 검증", "탐정형·판사형"],
    keywords: ["인사이트 도출", "가설 검증"],
    tables: [
      {
        caption: "EDA와 CDA 비교",
        headers: ["구분", "EDA", "CDA"],
        rows: [
          ["목적", "Statistics as Detective\n데이터 탐색\nX Y 관계 가설 도출", "Statistics as Judge\n가설 검정\nP-value 수용/기각"],
          ["프로세스", "수집→시각화\n패턴→인사이트", "가설 설정→수집\n분석→가설 검증"],
          ["핵심요소", "저항성\n잔차 해석\n자료의 재표현\n자료의 현시성", "중심극한의 정리\nP-value(유의확률)"],
          ["기법", "히스토그램\n줄기잎그림\n상자수염그림\n산점도", "t-test, F-test, ANOVA\n상관·회귀분석\n카이제곱검정\n모비율·비모수검정"],
          ["활용분야", "모형정립\n데이터 마이닝\n가설도출", "가설검증\n유의성 검증"],
          ["관계", "데이터→모형", "모형→데이터"],
        ],
      },
    ],
  },
  {
    title: "데이터 시각화",
    course: "DB",
    definition:
      "정보의 목적에 부합하는 효과적인 전달을 위해 수집된 정보를 재조직하고, 시각화하여, 정보전달 효과를 극대화 하는 프로세스",
    defShort: "수집된 정보를 재조직·시각화해 정보전달 효과를 극대화하는 프로세스",
    lead:
      "정보전달 효과 극대화, 데이터 시각화",
    features: ["정보 재조직", "추상 정보 직관화", "전달 효과 극대화"],
    keywords: ["정보전달", "시각화", "정보 구조화", "정보 시각화", "정보 시각 표현"],
    tables: [
      {
        caption: "시각화 프로세스 [구시표]",
        headers: ["프로세스", "", "설명"],
        nameCol: 1,
        rows: [
          ["① 정보 구조화", "개요", "탐색·분류·배열로 구조적 그룹핑"],
          ["① 정보 구조화", "데이터 수집 및 탐색", "데이터 자료·논거 수집\n빅데이터 고유 특성 훼손 없이 탐색"],
          ["① 정보 구조화", "데이터 분류", "유사한 것끼리 그룹핑\nJSON, XML, CSV, TSV, 구분텍스트"],
          ["① 정보 구조화", "데이터 배열", "값의 의미에 따라 배치\n래치 방법: 위치·알파벳·시간\n카테고리·위계"],
          ["① 정보 구조화", "관계 탐색(재배열)", "인식 쉽게 패턴 만드는 과정\n이상값·차원·측정값 유형별 관계"],
          ["② 정보 시각화", "개요", "방대한 정보 한번에 보고 이해\n표현방법·인터렉션 기술 이용\n추상적 정보 직관적 표현"],
          ["② 정보 시각화", "시간, 분포, 관계 시각화", "시간·데이터 분포·관계 표현 기법\n막대·누적그래프·파이차트\n스캐터·버블·히스토그램"],
          ["② 정보 시각화", "비교, 변수, 공간", "구분·순서·비율·색채 사용·인지\n기본 원리로 시각화"],
          ["③ 정보 시각 표현", "개요", "시각화 결과물 그래픽 디자인 완성"],
          ["③ 정보 시각 표현", "디자인 기본 원리 사용", "타이포그래피(서체·크기 등)\n색상(구분·순서·비율 등)\n그리드(읽는 방식·역피라미드)"],
          ["③ 정보 시각 표현", "인터렉션 디자인", "시각 자료 적용·테스트 확인\n강조·디테일 표시\n사용자 컨텐츠 선택방식\n지정시각 매핑변화"],
        ],
      },
      {
        caption: "인사이트 프로세스 [탐분활]",
        headers: ["절차", "", "설명"],
        nameCol: 1,
        rows: [
          ["① 탐색", "개요", "자료 확인·관계"],
          ["① 탐색", "데이터 확인", "명세화·구성원리"],
          ["① 탐색", "연결포인트 확인", "공통요소 탐색"],
          ["① 탐색", "관계 탐색", "이상값·유형별"],
          ["② 분석", "개요", "관계 명확 규명"],
          ["② 분석", "분석대상 정의", "2차 탐색·목표"],
          ["② 분석", "분석과 시각화 도구", "추세선 그래프\n회귀선 그래프"],
          ["② 분석", "지표설정 분석", "기본구조·인과"],
          ["③ 활용", "개요", "내·외부 활용"],
          ["③ 활용", "내부적용", "서비스 제품 적용"],
          ["③ 활용", "외부적용", "설득용 시각화"],
          ["③ 활용", "인사이트 발전과 확장", "종합 오류 검토\n실시간 지표"],
        ],
      },
    ],
  },
  {
    title: "데이터 레이크하우스(Data Lakehouse)",
    course: "DB",
    definition:
      "정형, 비정형 데이터를 통합 관리하는 데이터 레이크 기능과 주제지향, 시계열 단위 데이터를 관리 및 분석하는 기능을 제공하는 데이터 웨어하우스를 결합한 하이브리드 데이터 관리 플랫폼",
    defShort: "데이터 레이크 기능과 데이터 웨어하우스를 결합한 하이브리드 플랫폼",
    lead:
      "레이크+웨어하우스 결합, 데이터 레이크하우스(Data Lakehouse)",
    features: ["레이크·DW 결합", "정형·비정형 통합", "ACID 정확성 보장"],
    keywords: ["데이터 레이크", "데이터 웨어하우스", "배치", "스트리밍", "스키마 관리", "정형", "비정형", "서빙", "BI 도구", "API"],
    tables: [
      {
        caption: "구성도 및 기술요소",
        headers: ["구분", "기술요소", "설명"],
        rows: [
          ["데이터 수집, 변환, 처리", "Batch Processing", "일괄 배치 정형·비정형 데이터\n통합 수집 및 적재"],
          ["데이터 수집, 변환, 처리", "Streaming Processing", "CDC, CEP 기반 실시간성 제공\n데이터 수집, 변환, 전달 구성"],
          ["데이터 저장 관리", "ACID 트랜잭션", "원자성·일관성·고립성·영속성\n기반 데이터 정확성 관리"],
          ["데이터 저장 관리", "데이터 파이프라인", "데이터 옵스 기반 데이터 플랫폼\n아키텍처 구성 제반 인프라"],
          ["데이터 저장 관리", "스키마 레지스트리", "생산 데이터 구조·포맷 관리\n변경 히스토리 관리 및 통제"],
          ["데이터 서빙", "Open API", "REST, gRPC 및 JDBC, ODBC\nDriver 기반 연동 인터페이스"],
          ["데이터 서빙", "BI 도구, 대시보드", "데이터 시각화\n비즈니스 의사 결정 지원 도구"],
        ],
      },
    ],
    notes: ["개념도: BI와 SQL 분석·실시간 데이터 응용·데이터 사이언스·머신러닝 → Open API → 원본 데이터(오픈 파일 포맷)/거버넌스에 따라 선별된 데이터 → 데이터 웨어하우스 계층 → 데이터 레이크 계층", "구성도: 정형(CSV, TSV)·반정형(JSON, AVRO)·비정형(SNS 리뷰) 데이터 생산측 → 레이크하우스 플랫폼(데이터 스키마 레지스트리, 데이터 거버넌스 메타데이터, 일괄 배치 처리, 실시간 스트리밍 처리, 분산 데이터 파일 시스템) → 데이터 소비측(AI/ML-데이터 과학자, BI 도구-경영진, REST/gRPC-분석가)"],
  },
  {
    title: "아파치 카프카(Apache Kafka)",
    course: "DB",
    definition:
      "실시간 데이터 피드 관리를 위해 데이터 피드의 분산 스트리밍, 파이프 라이닝 및 재생을 위한 목적으로 설계된 Publish / Subscribe 구조의 메시징 플랫폼",
    defShort: "분산 스트리밍용 Publish/Subscribe 메시징 플랫폼",
    lead:
      "발행-구독 분산 메시징, 아파치 카프카(Apache Kafka)",
    features: ["Pub/Sub 구조", "분산 스트리밍", "메시지 재생 가능"],
    keywords: ["Partition", "Availability", "Consistency", "Latency"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명", "역할"],
        rows: [
          ["topic", "발행된 메시지의\n카테고리", "메시지 구분용\n이름"],
          ["producer", "메시지 생성\n프로세스", "특정 Topic 생성\nBroker에 전달"],
          ["consumer", "메시지 사용\n프로세스", "구독 Topic 메시지\n가져와 처리"],
          ["broker", "메시지 관리\n클러스터 서버", "전달 메시지를\ntopic별 분류"],
        ],
      },
      {
        caption: "동작방식",
        headers: ["번호", "동작 방식"],
        rows: [
          ["1", "프로듀서가 새 메시지 전송"],
          ["2", "컨슈머 큐(토픽)에 도착해 저장"],
          ["3", "컨슈머가 접속해 새 메시지 가져감"],
          ["4", "프로듀서는 컨슈머 무관 전송\n컨슈머는 프로듀서 무관 가져옴"],
          ["5", "토픽 식별자로 토픽 단위 저장"],
        ],
      },
    ],
    notes: ["개념도: producer들 → kafka cluster → consumer들. Kafka는 발행-구독(publish-subscribe) 모델을 기반으로 동작하며 크게 producer, consumer, broker로 구성"],
  },
  {
    title: "공공데이터 예방적 품질관리 진단 가이드",
    course: "DB",
    definition:
      "데이터의 품질을 일정 수준 이상으로 보장하기 위하여 데이터의 표준, 구조, 값, 관리체계 등 4개 영역을 관리하는 활동",
    defShort: "품질 보장 위해 표준·구조·값·관리체계 4개 영역을 관리하는 활동",
    lead: "4개 영역 사전 품질 확보, 공공데이터 예방적 품질관리 진단 가이드",
    features: ["사전 예방 중심", "구축 단계별 적용", "공공데이터법 근거"],
    keywords: ["데이터 표준", "데이터 구조", "데이터 값", "데이터 관리체계"],
    tables: [
      {
        caption: "예방적 품질관리 진단항목 [표구값관]",
        headers: ["진단영역", "진단항목"],
        rows: [
          ["데이터 표준", "데이터 표준화\n공통 데이터 표준화\n데이터 표준 관리 도구"],
          ["데이터 구조", "데이터 구조 설계\n데이터 구조 검증\n데이터 구조 관리 도구"],
          ["데이터 값", "데이터 값 검증\n이관 데이터 검증"],
          ["데이터 관리체계", "표준·구조·연계·값 관리체계\n데이터 개방 관리체계"],
        ],
      },
      {
        caption: "구축 단계별 데이터 품질관리 절차 [계발설개완]",
        headers: ["단계", "설명", "산출물"],
        rows: [
          ["계획 단계", "정보시스템 정의\n품질 개선 과제", "구축 전략·계획\n사업계획서(RFP)"],
          ["발주 단계", "표준·구조·값 등\n개선과제 요구화\n과업 확정", "정보화 사업 RFP\n기술 협상서"],
          ["설계 단계(현황 분석)", "유지관리 용이\n유연 시스템 설계", "사업 수행 계획서\n데이터 표준\n데이터 모델\n현황 분석서"],
          ["개발 단계(목표 시스템 정의)", "요구사항 개발\n시나리오 테스트\n오류 확인·수정", "데이터 매핑서\n진단 규격\n목표모델 정의서"],
          ["완료 단계(이행 계획/수립)", "데이터 완결성\n관리체계 점검", "이행 및 검증서\n데이터 관리체계\n이행계획서"],
        ],
      },
    ],
    notes: ["법령: 공공데이터의 제공 및 이용활성화에 관한 법률 제22조(공공데이터의 품질관리)", "진단 구성체계: 진단영역(4) → 진단항목(10) → 진단기준(20)"],
  },
  {
    title: "공공데이터 품질인증 매뉴얼(2025.07.)",
    course: "DB",
    definition:
      "공공데이터법에 따라 기관 전체의 공공데이터 품질관리 체계 및 보유 DB 전반의 품질이 인증기준에 적합한지 심사해 우수 기관에 인증을 부여하는 제도",
    defShort: "품질관리 체계 및 보유 DB 전반의 품질이 인증기준에 적합한지 심사 제도",
    lead: "품질관리 체계·DB 심사, 공공데이터 품질인증 매뉴얼",
    features: ["공공데이터법 근거", "기관 전체 심사", "등급별 인증 부여"],
    keywords: ["공공데이터법 제22조 2항", "품질인증"],
    tables: [
      {
        caption: "인증 심사 영역(개념도)",
        headers: ["구분", "항목", "세부항목"],
        rows: [
          ["공공데이터 관리체계(40)", "품질관리계획수립(4)", "계획 수립·이행\n진단 요소 포함"],
          ["공공데이터 관리체계(40)", "데이터보안체계구축(2)", "기밀성·무결성\n가용성 확보"],
          ["공공데이터 관리체계(40)", "DB관리및역량강화(10)", "대상 DB 관리\n품질 역량 수준"],
          ["공공데이터 관리체계(40)", "예방적품질관리진단(4)", "사전 품질 확보\n유효성·완전성"],
          ["공공데이터 관리체계(40)", "데이터표준관리체계(3)", "표준 관리 측면\n체계 수립·관리"],
          ["공공데이터 관리체계(40)", "데이터표준확산(9)", "DB 표준 정의\n용어·도메인"],
          ["공공데이터 관리체계(40)", "데이터구조안정화(4)", "데이터 모델 검증\n개념·논리 수준"],
          ["공공데이터 관리체계(40)", "데이터연계관리(4)", "외부 상호작용\n유사·중복 처리"],
          ["공공데이터 값 관리(40)", "데이터품질진단(15)", "진단 기준 정의\n진단 수행"],
          ["공공데이터 값 관리(40)", "데이터오류율(10)", "업무 규칙 기준\n오류율 진단"],
          ["공공데이터 값 관리(40)", "품질진단결과조치(15)", "개선계획 수립\n이행률 점검"],
          ["공공데이터 개방 및 활용(20)", "공공데이터개방활성화(12)", "개방·활용 측면\n외부·내부 연계"],
          ["공공데이터 개방 및 활용(20)", "공공데이터활용및개선(8)", "오류 신고 분석\n국민 친화 개선"],
        ],
      },
      {
        caption: "특징 — 인증 등급",
        headers: ["등급", "심사기준", "설명"],
        rows: [
          ["최우수", "DB 개별 점수\n40점 만점", "값 관리 측면 모든 인증 대상 DB 심사"],
          ["최우수", "만점의 95%\n충족 필요", "관리체계·개방\n활용 측면 심사"],
          ["우수", "DB 개별 점수\n만점 90% 이상", "값 관리 측면\n개별 점수 충족"],
          ["우수", "만점의 90%\n이상 달성", "관리체계·개방\n활용 측면 달성"],
        ],
      },
    ],
    notes: ["기출: 2025.11 ITPE 모의고사 3교시"],
  },
  {
    title: "공공기관 데이터베이스 표준화지침(2023년 4월 개정 고시)",
    course: "DB",
    definition:
      "전자정부법 50조, 공공데이터법 23조에 따라 공공기관이 생성 또는 취득하여 관리하는 데이터베이스의 표준화에 필요한 세부 사항을 정의",
    defShort: "생성 또는 취득하여 관리하는 DB의 표준화에 필요한 세부 사항을 정의",
    lead: "공공 DB 표준 세부 사항, 공공기관 데이터베이스 표준화지침",
    features: ["전자정부법 근거", "표준사전 기반 관리", "관리항목 유연성"],
    keywords: ["데이터베이스 정의서", "논리데이터모델 다이어그램", "엔티티정의서", "애트리뷰트 정의서", "물리데이터모델 다이어그램", "컬럼정의서"],
    tables: [
      {
        caption: "개정 내용",
        headers: ["개정 내용"],
        rows: [
          ["관리항목의 유연성 강화 (별표 제1호 및 제2호 신설)"],
          ["비표준데이터 관리체계 마련 (제8조 제5항)"],
          ["메타정보 관리항목 정비 (별표 제4호)"],
          ["용어 정의 추가 (제2조)"],
          ["관리시스템 현행화 (제4조, 제5조, 제6조, 제8조, 제13조)"],
        ],
      },
      {
        caption: "데이터 표준사전 관리항목",
        headers: ["구분", "항목명"],
        rows: [
          ["표준 용어", "표준용어명, 영문명, 영문약어명\n용어설명, 표준도메인명\n허용값, 관리부서명\n표준코드명, 업무분야"],
          ["표준 단어", "표준단어명, 단어 영문명\n단어 영문약어명, 단어 설명\n형식단어 여부, 도메인 분류명\n이음동의어 목록, 금칙어 목록"],
          ["표준 도메인", "도메인 그룹명, 도메인 분류명\n도메인명, 도메인 설명\n데이터타입, 데이터길이"],
          ["표준 도메인", "소수점 길이, 저장형식\n표현형식, 단위, 허용값"],
          ["표준 코드", "관리부서명, 한글코드명\n영문코드명, 코드설명\n데이터타입, 데이터길이\n코드값, 코드값 의미"],
        ],
      },
      {
        caption: "공공데이터베이스 산출물 표준 관리항목",
        headers: ["구분", "항목명"],
        rows: [
          ["데이터베이스 정의서", "기관명, 부서명, 관련법령\n한글 DB명, 영문 DB명, 구축일자\nDB 설명, 업무분류체계\nDBMS 정보, 운영체제정보, DB 형태"],
          ["논리데이터모델 다이어그램", "한글 DB명, 설명"],
          ["엔티티정의서", "한글 DB명, 엔티티명\n엔티티 설명, 주식별자\n수퍼타입 엔티티명"],
          ["애트리뷰트 정의서", "엔티티명, 속성명, 속성유형\n필수입력여부, 식별자 여부\n참조 엔티티명, 참조 속성명\n속성설명"],
          ["물리데이터모델 다이어그램", "영문 DB명, 설명"],
          ["테이블정의서", "영문 DB명, 테이블 소유자\n한글 테이블명, 영문 테이블명\n테이블 유형, 관련 엔티티명\n테이블 설명, 발생주기"],
          ["컬럼정의서", "영문 테이블명, 한글 컬럼명\n영문 컬럼명, 컬럼 설명\n연관 엔티티명, 연관 속성명\n데이터 타입, 데이터 길이"],
          ["컬럼정의서", "Not Null 여부\nPK·AK·FK 정보, 제약조건\n개인정보 여부, 암호화 여부\n공개/비공개 여부"],
        ],
      },
    ],
    notes: ["근거 법령: 전자정부법 50조, 공공데이터법 23조"],
  },
  {
    title: "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)",
    course: "DB",
    definition:
      "「데이터 산업진흥 및 이용촉진에 관한 기본법」 제20조 5항(데이터 품질인증 대상 및 품질기준)에 의거 데이터 내용, 데이터 관리체계를 진단하고 수준을 평가해 품질을 인증하는 제도",
    defShort: "제20조 5항 의거 데이터 내용, 데이터 관리체계 진단해 품질 인증 제도",
    lead:
      "내용·관리체계 품질 진단, 데이터 품질인증(DQ인증)",
    features: ["법정 인증 제도", "이원 인증 체계", "사후관리 연계"],
    keywords: ["데이터 산업진흥 및 이용촉진에 관한 기본법 제20조 5항", "데이터 내용", "데이터 관리체계", "사후관리"],
    tables: [
      {
        caption: "데이터 내용 인증",
        headers: ["인증 항목", "세부 항목"],
        rows: [
          ["데이터 내용 개념", "레코드·필드에 입력된 문자·숫자\n텍스트·이미지·동영상·음성\n원천 데이터와 속성값"],
          ["인증 유형", "Complex-Type\nNormal-Type\nSimple-Type"],
          ["심사 지표", "A Class, B Class, C Class"],
          ["인증 대상", "데이터 구조: 정형, 비정형 데이터\n데이터 내용(데이터 값)"],
          ["정형 데이터 심사", "필수: 완전성, 유효성, 일관성\n선택: 유효성, 일관성, 정확성,\n접근성, 유일성"],
          ["비정형 데이터 심사", "필수: 완전성, 유효성, 정확성,\n유일성\n선택: 유효성, 일관성, 정확성,\n접근성, 유일성"],
        ],
      },
      {
        caption: "데이터 관리체계 인증",
        headers: ["인증 항목", "세부 항목"],
        rows: [
          ["데이터 관리 개념", "데이터 관리 원칙 정의\n표준·품질·구조·연계 업무 기능\n조직·프로세스·제도 체계적 정립"],
          ["인증 등급", "인증하지 않음, Level 2 ~ Level 5"],
          ["인증 대상", "데이터 기반 사업, 데이터 시스템\n데이터 관리 조직"],
          ["심사 대상", "불완전(0, 적용 불가), 수행(1)\n관리(2), 체계화(3), 예측화(4)\n혁신화(5)"],
          ["심사 방법", "성숙도 수준: 도입(1), 관리(2)\n체계화(3), 예측화(4)\n혁신화(5)"],
        ],
      },
      {
        caption: "인증 절차 [사계인품작심품보보]",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["인증 신청", "① 사전협의 및 상담", "신청인→인증기관"],
          ["인증 신청", "② 서류 제출 및 계약", "신청인→인증기관"],
          ["인증 심사", "③ 인증계획 수립 및 준비", "인증기관"],
          ["인증 심사", "④ 품질인증실시(서류, 현장심사)", "인증기관"],
          ["인증 심사", "⑤ 심사결과보고서 작성", "인증기관"],
          ["인증 심사", "⑧ 제출서류 보완 안내(미비 시)", "신청인→인증기관"],
          ["인증 심사", "⑨ 제출서류 보완(미비 시)", "신청기관"],
          ["인증 심의", "⑥ 심사결과보고서 심의", "인증심의위원회"],
          ["인증 심의", "⑦ 결과통보 및 품질인증서 발급", "인증기관"],
          ["인증 심의", "3년 유효", "사후심사, 사후심사, 갱신심사"],
        ],
      },
    ],
    notes: ["기출: 2025.06 ITPE 모의고사 3교시", "법적 근거: 「데이터 산업진흥 및 이용촉진에 관한 기본법」 제20조, 제20조의 3부터 제20조의 5까지, 시행규칙 제4조의 2, 제4조의 3"],
  },
  {
    title: "데이터 가치 평가",
    course: "DB",
    definition:
      "시장에서 유통, 거래되는 데이터의 경제적 가치를 가액, 등급 및 점수로 평가하는 제도",
    defShort: "시장 거래 데이터의 경제적 가치를 가액·등급 및 점수로 평가하는 제도",
    lead:
      "데이터 경제적 가치 산정, 데이터 가치 평가 제도",
    features: ["경제적 가치 정량화", "데이터 기본법 근거", "지정 평가기관 수행"],
    keywords: ["데이터 기본법", "가치평가자문단", "평가기관", "평가기법(시장접근법, 수익접근법, 원가접근법)"],
    tables: [
      {
        caption: "데이터 가치 평가 제도 주요 내용",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["평가 기법 및 평가 체계", "평가체계", "윤리 기준, 평가 원칙, 대상·절차"],
          ["평가 기법 및 평가 체계", "평가기법", "유형·특성·목적별 하나 이상 사용"],
          ["평가 기법 및 평가 체계", "평가요인", "데이터 특성\n법적 특성\n시장성\n사업성"],
          ["평가 기법 및 평가 체계", "시장 접근법", "유사 거래 사례 참고하여 조정\n유사 사례 없을 경우 사용 불가"],
          ["평가 기법 및 평가 체계", "수익 접근법", "수명·가치 추정해 수익 관점 평가\n주관적 평가 개입 요소 존재"],
          ["평가 기법 및 평가 체계", "원가 접근법", "역사적·재생산·대체 원가\n경제적 효익 반영 불가"],
          ["가치평가 자문단", "인력구성", "위원장 포함 위원 9명, 간사 1명"],
          ["가치평가 자문단", "자문사항", "평가기관 지정·관리·운영 사항"],
          ["평가기관 지정요건", "인력구성", "전문인력 6인 이상 상시 고용\n평가 수행 조직 체계 구축"],
          ["평가기관 지정요건", "평가모델", "평가 기법, 필요 시설·장비 보유"],
          ["평가기관 지정절차", "", "신청공고(과기정통부)\n신청·서류 제출(신청 기관)\n지정심의(자문단)\n지정 공고·지정서 발급"],
        ],
      },
      {
        caption: "데이터 가치 평가 제도 절차(9단계)",
        headers: ["단계", "내용"],
        rows: [
          ["1단계", "평가의뢰 및 사전\n검토/협의"],
          ["2단계", "서류제출 및 접수"],
          ["3단계", "평가계획 수립"],
          ["4단계", "평가 준비"],
          ["5단계", "킥오프 및\n현장실사"],
          ["6단계", "평가 요인 분석"],
          ["7단계", "데이터 가치산정"],
          ["8단계", "평가 결과 통보"],
          ["9단계", "사후관리"],
        ],
      },
    ],
    notes: ["법적 근거: 데이터 산업진흥 및 이용촉진에 관한 기본법(데이터 기본법) 14조, 동법 시행령 14조~16조, 동법 시행규칙 2, 3조", "금액 및 등급 산출의 핵심변수 [경할기]: 데이터 경제적 수명, 할인율, 데이터 기여도"],
  },
  {
    title: "연관성 분석(association analysis) - 데이터마이닝",
    course: "DB",
    definition:
      "데이터 안에 존재하는 항목들 간의 조건-결과 식으로 표현되는 유용한 패턴(pattern)을 나타내는 연관 규칙(Association Rule)을 찾는 분석 기법",
    defShort: "조건-결과 식으로 표현되는 유용한 패턴의 연관 규칙을 찾는 분석 기법",
    lead:
      "장바구니 속 패턴 발견, 연관성 분석(association analysis)",
    features: ["조건-결과 규칙", "빈발 패턴 탐색", "향상도로 유의 판단"],
    keywords: ["빈발 항목집합", "지지도", "신뢰도", "향상도"],
    tables: [
      {
        caption: "빈발규칙과 비빈발규칙",
        headers: ["구분", "빈발규칙(Frequent Rule)", "비빈발규칙(Infrequent Rule)"],
        rows: [
          ["조건", "최소 지지도 이상", "최소 지지도 미만"],
          ["해석", "자주 발생\n신뢰성 높음", "드물게 발생\n일반 분석 제외"],
          ["활용", "추천·마케팅\n대규모 분석", "이상·희귀 탐지\n프리미엄 고객"],
          ["예시", "맥주→땅콩\n다수 동시 구매", "캐비아→샴페인\n소수 고부가가치"],
        ],
      },
      {
        caption: "지표",
        headers: ["구분", "설명", "수식"],
        rows: [
          ["지지도(Support)", "전체 거래 중\nA·B 동시 등장", "S(A⇒B) =\n|A∩B| / N"],
          ["신뢰도(Confidence)", "A 발생 시\nB 발생 확률", "C(A⇒B) =\nS(A∪B)/S(A)"],
          ["향상도(Lift)", "B 일반 빈도 대비\nA 조건 B 확률", "L(A⇒B) =\nC(A⇒B)/S(B)"],
          ["레버리지(Leverage)", "동시 발생 확률과\n독립 확률의 차", "S(A∪B) −\nS(A)×S(B)"],
          ["컨빅션(Conviction)", "A 발생, B 미발생\n예측 정확도", "(1−S(B)) /\n(1−C(A⇒B))"],
        ],
      },
    ],
    notes: ["개념도: IF 선행 항목(Antecedent: Bread, Egg) → THEN 후행 항목(Consequent: Milk)", "지표 직관: 지지도=얼마나 자주 같이 일어나는가? / 신뢰도=A가 일어나면 B도 같이 일어날 확률은? / 향상도=단순 우연이 아니라 정말 의미 있는 관계인가? / 레버리지·컨빅션=보조적 지표로 관계의 강도를 더 정교하게 해석"],
  },
  {
    title: "Apriori 알고리즘",
    course: "DB",
    definition:
      "데이터셋을 기반으로 후보 항목 집합(candidate itemset)을 생성하고 이 중 발생 빈도(frequent)가 낮은 집합을 제외하여 빠르게 데이터 간의 연관 관계를 밝히는 분석 방법",
    defShort: "후보 항목 집합 중 발생 빈도 낮은 집합을 제외해 연관 관계 밝히는 분석 방법",
    lead:
      "후보 생성과 가지치기, Apriori 알고리즘",
    features: ["단계적 후보 생성", "반모노톤성 기반", "저빈도 집합 제외"],
    keywords: ["빈발 항목집합", "최소 지지도 비교", "가지치기"],
    tables: [
      {
        caption: "Apriori 알고리즘 절차",
        headers: ["절차", "세부 기술", "설명"],
        rows: [
          ["① 항목 별 등장 횟수(빈도) 수집", "DB 스캐닝", "항목별 포함 트랜잭션 수 계산"],
          ["② 지지도(Support) 계산", "지지도(Support)", "항목별 지지도(포함 비율) 산출"],
          ["③ 빈발 항목 필터링(Pruning)", "가지치기(Pruning)", "최소 지지도 이하 항목 제거"],
          ["④ 1-빈발 항목 집합(Frequent 1-itemset) 생성", "최소 지지도", "최소 지지도 충족 항목만 선택\n1-빈발 항목 집합 도출"],
          ["⑤ K-빈발 항목 집합(Frequent Itemset) K+1 생성", "K+1 생성", "항목 조합 후보 k-itemset 생성\n지지도 계산·가지치기로 제거"],
          ["⑥ 최대 빈발 항목 집합(Frequent Itemsets)", "최소 지지도", "최소 지지도 이상 항목만 추출\n최대 빈발 항목 집합 생성"],
        ],
      },
    ],
    notes: ["기출: 2025.04 ITPE 모의고사 3교시", "개념도: null → A·B·C·D → AB·AC·… → ABC·ABD·… → ABCD 격자에서 ① 빈발 항목 산출 → ② 최소 지지도 비교 → ③ 가지치기(pruning)", "원리: 빈발 항목 집합(Frequent Itemset)의 하위 집합도 빈발하다는 반(反)모노톤성(Anti-monotone property)을 기반으로 후보 항목 집합을 단계적으로 생성하고 검증하는 방식으로 작동"],
  },
  {
    title: "DHP(Direct Hashing & Pruning) 알고리즘",
    course: "DB",
    definition:
      "많은 후보 항목이 생성되어 계산 비용이 증가하는 것을 막기 위해 해싱(hashing)과 가지치기(pruning) 기법을 이용하여 빠르게 빈발 항목 집합(Frequent Itemset)을 탐색하는 연관 분석 기법",
    defShort: "해싱과 가지치기 기법으로 빠르게 빈발 항목 집합 탐색하는 연관 분석 기법",
    lead: "해시 기반 후보 가지치기, DHP 알고리즘",
    features: ["해싱 기반 계수", "사전 가지치기", "후보 집합 축소"],
    keywords: ["가지치기(Pruning)", "해시 테이블(Hash Table)"],
    tables: [
      {
        caption: "DHP 알고리즘 절차",
        headers: ["절차", "세부 기술", "설명"],
        rows: [
          ["① 1-빈발 항목 집합(Frequent 1-itemset) 생성", "최소 지지도\n(Minimum Support)", "DB 첫 스캔, 항목별 지지도 계산\n최소 지지도 이상 항목 선택\n빈발 1-itemset 도출"],
          ["② 후보 (k+1)-항목 집합 생성", "해시 테이블(Hash Table)", "빈발 k-itemset 기반 후보 생성"],
          ["③ 해시 테이블의 버킷에 매핑", "해시 테이블 버킷", "(k+1)-항목 집합 조합\n해시 함수로 버킷에 매핑\n버킷별 출현 횟수(count) 누적"],
          ["④ 빈발 항목 집합 필터링(Pruning)", "가지치기(Pruning)", "count 낮은 버킷 불필요 후보 포함\n해당 버킷 항목 집합 가지치기\n불필요 계산 제외"],
          ["⑤ 빈발 항목 집합(Frequent Itemset) K+1 결정", "K + 1", "필터링 후보 기반 데이터셋 재스캔\n실제 빈발 (k+1)-항목 집합 결정"],
          ["⑥ 최대 빈발 항목 집합(Frequent Itemsets)", "최소 지지도\n(Minimum Support)", "남은 항목 집합 중 최소 지지도 만족\n최종 빈발 항목 집합 생성"],
        ],
      },
    ],
    notes: ["기출: 2025.04 ITPE 모의고사 3교시", "개념도: dataset → 빈발 항목 집합(k=1) 생성 → (k+1)-itemset 후보 생성 → 해시테이블 버킷에 매핑(count 누적) → 빈발 항목 집합 필터링(가지치기) → (k+1)-itemset 결정 순환", "핵심: 해시(hash)를 카운트(count)하여 빈번하지 않은 항목 집합을 미리 제거 — 후보 집합(Candidate Itemset)의 크기를 감소시켜 Apriori보다 빠르게 계산 가능"],
  },
  {
    title: "FP(Frequent Pattern)-Growth 알고리즘",
    course: "DB",
    definition:
      "후보 항목 집합을 생성하지 않고, 트랜잭션 데이터를 압축하여 FP-Tree를 만든 후, 그 트리에서 빈발 항목 집합(Frequent Itemset)을 빠르게 찾는 알고리즘",
    defShort: "트랜잭션 데이터 압축한 FP-Tree로 빈발 항목 집합 찾는 알고리즘",
    lead:
      "후보 생성 없는 트리 탐색, FP-Growth 알고리즘",
    features: ["FP-Tree 압축", "후보 생성 제거", "조건부 트리 탐색"],
    keywords: ["FP-Tree", "조건부 패턴 베이스(Conditional Pattern Base)", "조건부 FP-Tree"],
    tables: [
      {
        caption: "FP-Growth 절차",
        headers: ["절차", "세부 기술", "설명"],
        rows: [
          ["① 지지도(Support) 계산 및 빈발 항목 추출", "최소 지지도\n(Minimum Support)", "첫 스캔으로 각 항목 지지도 계산\n최소 지지도 이상만 빈발 항목 선정"],
          ["② 빈발 항목 정렬", "지지도 내림차순", "트랜잭션에서 빈발 항목만 남김\n지지도 순 내림차순 정렬"],
          ["③ FP-Tree 생성", "FP-Tree 구조", "정렬 트랜잭션으로 FP-Tree 구성\n공통 항목 같은 경로 공유\n노드에 항목명·빈도수 저장\n헤더 테이블로 항목 노드 연결"],
          ["④ 조건부 패턴 베이스(Conditional Pattern Base) 생성", "조건부 패턴 추출", "특정 항목 포함 모든 경로 수집\n경로 모음이 조건부 패턴 베이스"],
          ["⑤ 조건부 FP-Tree 생성", "조건부 트리", "항목 전용 조건부 FP-Tree 생성\n빈도수 계산\n불필요 항목 가지치기"],
          ["⑥ 빈발 항목 집합 생성", "빈발 패턴 확장", "조건부 FP-Tree 재귀적 패턴 추출\n패턴 조합해 빈발 항목 집합 완성"],
        ],
      },
    ],
    notes: ["기출: 2025.04 ITPE 모의고사 3교시", "Apriori 알고리즘과 DHP 알고리즘 모두 후보 항목 집합을 여러 번 생성하는 과정이 존재하지만 FP-Growth 알고리즘은 후보 항목 집합 생성 과정을 제거"],
  },
  {
    title: "DaaP(Data as a product)",
    course: "DB",
    definition:
      "데이터를 단순한 저장 자산이 아닌, 최종 사용자 중심의 독립적인 제품으로 관리하는 데이터 거버넌스 및 아키텍처 패러다임",
    defShort: "데이터를 독립적 제품으로 관리, 데이터 거버넌스 및 아키텍처 패러다임",
    lead:
      "데이터를 제품처럼 관리, DaaP(Data as a product)",
    features: ["도메인 간 공유", "상호 운용성", "재사용성"],
    keywords: ["데이터 메시", "데이터 패브릭", "데이터 리니지", "데이터 카탈로그", "API 기반", "ETL", "클라우드 네이티브"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구분", "구성요소"],
        rows: [
          ["조직 관점", "Data Product Owner\n데이터 거버넌스 체계\n도메인 기반 운영 구조"],
          ["사용자 관점", "Data Consumer\n데이터 카탈로그 및 검색 기능\n사용자 피드백 및 만족도 관리"],
          ["기술/운영 관점", "자동화된 데이터 파이프라인\nAPI 기반 데이터 서비스\n모니터링 및 로깅 시스템"],
          ["품질/보안 관점", "데이터 품질 관리 체계\n메타데이터 및 data Lineage\n보안 및 접근 제어 정책"],
        ],
      },
      {
        caption: "특징",
        headers: ["특징", "설명"],
        rows: [
          ["분석을 위한 깔끔한 고품질 데이터 세트", "신뢰성·신뢰도 데이터 제품 보장"],
          ["메타데이터와 의미 체계", "컨텍스트 제공 발견·이해 지원"],
          ["데이터 세트 간의 상호 운용성", "세트 간 협업 비편향 인사이트"],
          ["도메인 간 공유 가능성", "도메인·앱 공유 간편 공유 제공"],
          ["접근성", "소비자 접근 손쉬운 인사이트"],
          ["재사용성", "모듈식 요소 타 제품 구축 활용"],
        ],
      },
      {
        caption: "핵심원칙",
        headers: ["원칙", "설명"],
        rows: [
          ["도메인 소유권(Domain Ownership)", "도메인 팀 관리 데이터 직접 관리\n데이터 메시 원칙 분산 소유 원칙"],
          ["데이터 제품", "사용자 가진 제품 데이터셋 탈피"],
          ["표준화 & 상호운용성", "공통 규칙 보유 도메인 간 호환"],
          ["관측 가능성", "변동 모니터링 품질 지연 스키마"],
        ],
      },
    ],
    notes: ["기출: 2025.11 ITPE 모의고사 3교시", "개념도(계층): Consumer Layer(데이터소비자: BI, AI모델, 앱, API 사용자 등) ↔ Data Product Layer(데이터제품: 데이터셋+메타데이터+품질지표, API 제공, SLA보장, Owner 지정) ↔ Data Platform Layer(데이터플랫폼&거버넌스: 표준화된 저장소, 거버넌스, CI/CD, 메타데이터관리, 접근제어, 모니터) ↔ Source Layer(원천 데이터: 트랜잭션DB, Log, IoT센서 등)"],
  },
  {
    title: "기술 부채(Technical Debt)",
    course: "MG",
    definition:
      "소프트웨어 설계·개발·테스트·배포 전 과정에서 장기적 관점의 솔루션 대신 짧은 기간 내 임시 방편의 해법을 선택해 차후 발생 가능한 추가적 위험 비용",
    defShort: "짧은 기간 내 임시 방편의 해법을 선택해 차후 발생 가능한 추가적 위험 비용",
    lead: "임시방편이 낳는 이자, 기술 부채(Technical Debt)",
    features: ["임시방편 해법 선택", "비가시적 부채", "추가적 위험 비용"],
    keywords: ["추가적 위험 비용", "임시방편", "품질"],
    tables: [
      {
        caption: "기술 부채의 원인",
        headers: ["원인", "설명"],
        rows: [
          ["Business Pressure", "Time-To-Market 무리한 일정\n적은 예산 진행"],
          ["Low Technology Maturity", "잘못된 아키텍처 구조\n개발자의 경험·협업 부족"],
          ["Frequent Requirement Changes", "코드 복잡성 상승\n낮은 테스트 커버리지 발생"],
          ["Lack of Experts", "부족한 테스팅 및 문서화\n스파게티 코드로 품질 저하"],
        ],
      },
      {
        caption: "기술 부채의 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["설계 부채", "설계 악취\n설계 규칙 위반", "모듈성 부족, 결합도↑ 응집도↓\n일정 초점 맞춘 잦은 규칙 위반"],
          ["코드 부채", "정적 분석 도구 위반\ncode convention 위반", "code review 무시·생략\n가이드라인 미준수, Lint 미활용"],
          ["테스트 부채", "테스트 방법론 부재\n불충분한 테스트 커버리지", "DevOps·Agile 테스트 방법론 부재\n전문 QA 계획서 부재/일정 부족"],
          ["문서 부채", "주요 관심사 문서 누락\n신기술 문서 부재", "산출물(화면·DB설계서) 누락\n신기술 도입 최신 문서화 누락"],
        ],
      },
      {
        caption: "기술 부채의 관리방안",
        headers: ["관리방법", "설명", "기법·도구"],
        rows: [
          ["부채 추정", "부채 식별\n유형 검토\n코드 정적 분석", "Coverity, SonarQube\nCheckStyle"],
          ["우선순위화", "이슈·리스크\n고순위 우선 해결", "정량적 평가\n정성적 평가"],
          ["템플릿 통합", "코드 템플릿 적용\n전문 도구 통합", "Prettier, Lint"],
          ["기술 업데이트", "노후 기술 인식\n최신 버전 적용", "컨테이너, 도커\nk8s"],
          ["리팩토링과 테스팅", "모듈성 결여 코드\n리팩토링 검토\n리뷰·검사 수행", "응집도 높임\n테스트 방법론"],
        ],
      },
    ],
    notes: ["기술 부채 영역 사분면(구현된 소프트웨어 내에서): Visible·Positive=Feature, Invisible·Positive=Architecture, Visible·Negative=Bug, Invisible·Negative=Technical Debt"],
  },
  {
    title: "리빙랩(Living Lab), S.O.S랩",
    course: "MG",
    definition:
      "리빙랩: 공공, 기업, 시민 등 다양한 사회 주체가 혁신 주체로 참여하여 문제를 해결하는 사용자 주도형 연구소 / S.O.S랩(Solution in Our Society Lab): 지역사회 문제해결을 위해 사회 구성원들이 모여 소프트웨어로 해결방법을 마련하는 사회문제 연구소",
    defShort: "다양한 사회 주체 문제 해결 리빙랩, SW로 해결방법 마련 S.O.S랩",
    lead:
      "사용자 주도 혁신 연구소, 리빙랩과 S.O.S랩",
    features: ["사용자 주도형", "공동창조 설계", "사중나선 구조"],
    keywords: ["리빙랩: 기획, 탐색, 실험, 평가", "SOS랩: 조직화, 개념화, 구체화, 실체화, 공유화, 사업화"],
    tables: [
      {
        caption: "리빙랩 프로세스 [기탐실평공]",
        headers: ["프로세스", "설명"],
        rows: [
          ["운영 기획(planning)", "문제 구체화\n비즈니스 모델 탐색\n사용자 그룹 선정, 참여\n운영 환경 형성"],
          ["대안 탐색(exploration)", "아이디어 발굴\n개념화\n사용자 행태 분석 및 개념 설계"],
          ["대안 실험(experimentation)", "프로토타입 개발 및 구현\n프로토타입 테스트\n프로토타입 피드백"],
          ["대안 평가(evaluation)", "제품·서비스 개발\n제품·서비스 실증, 확산\n제품 피드백"],
          ["공통", "피드백 및 개선\n공동 창조(co-creation)"],
        ],
      },
      {
        caption: "S.O.S랩 프로세스 [조개구실공사] — Problem에서 Value로, 바탕은 공감",
        headers: ["단계", "활동"],
        rows: [
          ["조직화", "혁신조직\n자원확보\n가치와 목표"],
          ["개념화", "문제발굴\n공감\n문제정의"],
          ["구체화", "아이디에이션\n프로토타입"],
          ["실체화", "공동창조\n컨셉 디자인"],
          ["공유화", "실증 및 확산\n데이터 관리"],
          ["사업화", "비즈니스 모델\n자원 프로그램"],
        ],
      },
      {
        caption: "리빙랩과 S.O.S랩 비교",
        headers: ["구분", "리빙랩", "SOS랩"],
        rows: [
          ["목적", "시민 참여\n사회문제 해결\n기술 서비스화", "혁신역량 내재화\nSW혁신 생태계\n상용 플랫폼"],
          ["방향", "Bottom-up\n순환적 나선 모델", "Top-down & Bottom-up 병행\nUp & Down Stream"],
          ["구조", "최종 사용자 추가\n사중나선 구조", "순환적 나선모델\n사중나선 구조"],
          ["특징", "공공·기업·시민\n다양한 주체 참여", "전주기 SW 지원\n상시·상용 운용\n플랫폼"],
        ],
      },
    ],
    notes: ["리빙랩(구조 설계 및 구성, 방법론 및 기술) → SOS랩(6단계 프로세스): FormIT 방법론 원칙, KHIRA LL프로젝트 — 리빙랩 구축 점증 과정과 개념"],
  },
  {
    title: "ITIL(IT Infrastructure Library) 4.0",
    course: "MG",
    definition:
      "IT 서비스를 비즈니스 요구 사항과 연계하는 데 중점을 둔 서비스 가치 사슬 이용한 ITSM 및 ITAM(IT Asset Management)과 같은 IT 활동에 대한 Best Practice",
    defShort: "서비스 가치 사슬 이용 ITSM 등 IT 활동 Best Practice",
    lead: "IT 서비스 관리 모범사례, ITIL 4.0",
    features: ["비즈니스 연계 중심", "가치사슬 기반", "Agile 수용"],
    keywords: ["서비스 가치 시스템", "4차원 모델", "Practice", "Agile"],
    tables: [
      {
        caption: "구성요소 [지거서지실 조정파가]",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["서비스 가치 시스템", "지도 원칙(Guiding Principles)", "모든 상황 조직 지도 7가지 원칙"],
          ["서비스 가치 시스템", "거버넌스(Governance)", "조직이 감독되고 통제되는 수단"],
          ["서비스 가치 시스템", "서비스 가치 사슬(Service Value Chain)", "가치 있는 제품·서비스 제공\n가치 실현 촉진 6가지 활동"],
          ["서비스 가치 시스템", "지속적인 개선(Continual Improvement)", "이해관계자 기대 충족 확인\n모든 수준에서 수행되는 반복 활동"],
          ["서비스 가치 시스템", "실행(Practices)", "목표 달성 위한 34가지 Practices"],
          ["4차원 모델", "조직과 사람(Organizations & People)", "역할과 책임 명확하게 정의\n보고 회선·통신 채널 개방성 확인"],
          ["4차원 모델", "정보 및 기술(Information & Technology)", "데이터 가치 극대화\n소유 위협·의무 관리\n클라우드 신속 배포·확장·해체"],
          ["4차원 모델", "파트너 및 공급업체(Partners & Suppliers)", "파트너와 공동 창작 통한 가치 상승\nSIAM 프레임워크"],
          ["4차원 모델", "가치 흐름과 프로세스(Value streams & Processes)", "제품·서비스 생성·제공 단계\n작업 순서·종속성 정의"],
        ],
      },
      {
        caption: "서비스 가치사슬(Service Value Chain) [계참설획제개]",
        headers: ["구분", "핵심 사항", "설명"],
        rows: [
          ["계획(Plan)", "포트폴리오\n개선 방향", "전략적, 전술적, 운영 계획\n설계·전환 위한 아키텍처·정책"],
          ["참여(Engage)", "이해관계자\n지속적 참여", "제품·서비스 상세 고객 요구 사항\n고객 위한 서비스 성능 보고서"],
          ["설계 및 전환(Design & Transition)", "제품 요구 사항\n제공 및 지원", "품질·비용·출시 고객 기대치 충족\n새롭고 변경된 제품·서비스"],
          ["획득/구축(Obtain/Build)", "서비스 구성\n합의사항 충족", "제공·지원 위한 서비스 구성 요소\n새롭고 변경된 서비스 구성 요소"],
          ["제공 및 지원(Deliver & Support)", "서비스 제공\n유지보수 지원", "고객·사용자에 제공되는 서비스\n사용자 지원 작업 완료 정보"],
          ["개선(Improve)", "지속적 개선 보장", "모든 가치 사슬 활동 위한 개선 계획\n개선 상태 보고서, 성능 정보"],
        ],
      },
    ],
    notes: ["서비스 가치사슬 정의: 조직이 가치 있는 제품 또는 서비스를 소비자에게 제공하고 가치 실현을 촉진하기 위해 수행하는 일련의 상호 연결된 활동", "개념도: Demand → Engage → (Plan · Design & Transition · Obtain/Build · Deliver & Support · Improve) → Product & Service → Value"],
  },
  {
    title: "ITSM(Information Technology Service Management)",
    course: "MG",
    definition:
      "고객과 합의된 SLA(Service Level Agreement) 수준에 맞게 품질 유지하도록 프로세스, 조직, 자원, 기술의 종합적 관리 위한 선진 IT 서비스 관리 기법",
    defShort: "SLA 수준에 맞게 프로세스·조직·자원·기술의 종합적 관리 기법",
    lead: "SLA 기반 서비스 관리, ITSM",
    features: ["SLA 수준 유지", "서비스 관점 관리", "ITIL 기반"],
    keywords: ["SLA", "SLM", "ITIL", "eSCM(ISO 20000)", "CMMI", "SPICE", "SoW"],
    tables: [
      {
        caption: "ITSM 프레임워크",
        headers: ["구분", "항목", "개요 및 구성"],
        rows: [
          ["ITIL", "정의", "IT 서비스 관리\n산업 표준·지침"],
          ["ITIL", "구성", "전략·설계\n전환·운영·개선\nService Lifecycle"],
          ["eSCM", "정의", "아웃소싱 지침\n제공자 능력 평가"],
          ["eSCM", "구성", "조직관리·인원\n사업·기술\n지식경영 PA"],
          ["SLM", "정의", "서비스 레벨 관리\n가용성 측정"],
          ["SLM", "구성", "서비스 레벨 관리\nSoW, SLA"],
          ["CMMI", "정의", "System/SW 공학\n기능적 통합\n성숙도 평가 모델"],
          ["CMMI", "구성", "프로세스·PM 등\n25개 PA 기준\n레벨 측정"],
        ],
      },
      {
        caption: "SLA(Service Level Agreement) — 서비스 수준을 명시적으로 정의하고 문서화한 약정서",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["업무 목표", "서비스 정의\n목적·범위", "제공 내용 명시\n적용 범위 확정"],
          ["업무 목표", "기본 계약서", "상호 계약 문서"],
          ["업무 목표", "서비스 카탈로그", "내역·특성 기술"],
          ["성과 지표", "SOW(Statement of Work)", "상세 업무 기술"],
          ["성과 지표", "SLO(Service Level Object)", "지표별 목표치"],
          ["성과 지표", "SLM(Service Level Measurement)", "정량 측정 방법"],
          ["성과 지표", "SLR(Service Level Report)", "보고 형식 방법"],
          ["조정 절차", "약정 변경절차", "SLA 수준 변경"],
          ["조정 절차", "서비스 유효기간", "계약 기간 갱신"],
        ],
      },
      {
        caption: "SLA 주요지표",
        headers: ["구분", "주요지표", "설명"],
        rows: [
          ["HW", "서비스 가동률", "서비스 시간 중 가용성 목표 비율\n(1-장애시간/서비스시간)×100"],
          ["HW", "동일 장애 발생률", "기존 HW 장애 재발생 비율\n동일장애건수/총장애건수×100"],
          ["SW", "오류 건수", "SW 버그·오작동 등 오류 발생 건수"],
          ["SW", "SR 적기 처리율", "SR 완료일 이내 서비스 제공 비율\n적기 처리 SR/전체 SR×100"],
          ["NW", "네트워크 가동률", "서비스 시간 중 NW 가용성 목표 비율\n(1-장애시간/NW가동시간)×100"],
          ["NW", "네트워크 장애건수", "스위치·라우터 등 문제 장애건수"],
          ["고객 만족도", "고객 만족도 점수", "고객 만족도 점수, 100점 만점"],
        ],
      },
    ],
    notes: ["프레임워크 개념도: ITIL(IT 베스트 프랙티스 제공) + eSCM/ISO20000(아웃소싱 제공업자 능력 평가 및 인증) + CMMI·SPICE·PMO(프로젝트 관리 및 SW 품질 인증) + SLM·SLA·SoW·MTTF·MTBF·MTTR(IT 아웃소싱 서비스 수준 및 서비스 가용 측정) → ITSM(기업의 IT 서비스 관리 체계)"],
  },
  {
    title: "서비스 수준 관리 (SLM, Service Level Management)",
    course: "MG",
    definition:
      "IT 서비스 조직에서 사용자의 관점으로 서비스 요구사항을 파악하고, 서비스 수준 개선을 위한 우선순위를 판단하기 위한 도구 및 체계",
    defShort: "사용자 관점 서비스 요구사항 파악, 서비스 수준 개선 우선순위 판단 체계",
    lead: "사용자 관점 수준 개선, 서비스 수준 관리(SLM)",
    features: ["사용자 관점", "SLA·OLA 이중 협약", "정량 지표 측정"],
    keywords: ["Service Catalog", "SLA", "OLA", "Quality Plan", "Service Report", "SLM 엔진"],
    tables: [
      {
        caption: "측정지표",
        headers: ["구분", "측정지표"],
        rows: [
          ["하드웨어", "서비스 가동률(%)\n동일장애발생률(%)"],
          ["소프트웨어", "장애 및 오류건수\nSR 적기 처리율(%)"],
          ["네트워크", "네트워크 가동률(%)\n네트워크 장애건수"],
        ],
      },
      {
        caption: "구성요소 [카스(에)오 플로(리)엔]",
        headers: ["구성요소", "핵심요소", "설명"],
        rows: [
          ["Service Catalog", "서비스 목록화", "고객 제공 서비스 전체 목록"],
          ["SLA", "수준 지표 정의", "Service Level Agreement\n서비스 제공·사용 업체 간 계약서"],
          ["OLA", "세부 운영 협약", "Operation Level Agreement\n내부 부서간 의사소통 관리 협약서"],
          ["Service Quality Plan", "품질 관리 계획", "서비스 수준 보장 위한 내부 계획"],
          ["Service Report", "수준 위반 검토", "주기적 서비스 수준 위반 여부 검토"],
          ["SLM 엔진", "Reporting, Monitoring", "관리 지표별 측정치 산출\n보고서 작성 자동화\n실시간 정보 서비스 모니터링"],
        ],
      },
    ],
    notes: ["개념도: 사용자·고객 ↔(SLA 요구/대응·SLA Communication) 관리조직(SLA 협상, 서비스 수준 예측, 서비스 수준 보고) ↔(OLA 요구/대응·OLA Communication) 운영조직(서비스 운영, 서비스 수준 관리, 서비스 수준 측정) — ITSM(ITIL, e-SCM) 아래 SLM 구간"],
  },
  {
    title: "BCP (Business Continuity Planning)",
    course: "MG",
    definition:
      "기업 비즈니스에 갑작스런 재해가 발생하더라도 비즈니스를 중단 없이 지속적으로 수행할 수 있도록 IT infra, 인적 자원, 물적 자원에 대한 재해 예방 및 복구 계획을 수립하는 체계",
    defShort: "비즈니스를 중단 없이 지속 수행하도록 재해 예방 및 복구 계획 수립 체계",
    lead:
      "무중단 비즈니스 연속성, BCP(Business Continuity Planning)",
    features: ["업무 무중단 지속", "BIA 기반 수립", "예방·복구 포괄"],
    keywords: ["무중단", "BIA", "DRS"],
    tables: [
      {
        caption: "개념도 단계별 대상과 산출물",
        headers: ["구분", "대상", "산출물"],
        rows: [
          ["재해복구(Disaster Recovery)", "핵심업무 지원\n어플리케이션", "재해복구\n계획"],
          ["업무복구(Business Recovery)", "핵심 프로세스", "업무복구 계획"],
          ["업무재개(Business Recovery Resumption)", "업무 프로세스\n전반", "대체프로세스\n계획"],
          ["비상계획(Contingency Plan)", "내/외부 사건\n문제해결", "업무비상\n계획"],
        ],
      },
      {
        caption: "구성요소 — 복구 목표 지표",
        headers: ["구성요소"],
        rows: [
          ["RPO (Recovery Point Objective)"],
          ["RTO (Recovery Time Objective)"],
          ["RSO (Recovery Scope Objectives)"],
          ["RCO (Recovery Comm. Objectives)"],
        ],
      },
      {
        caption: "구성요소 — DR 사이트 유형",
        headers: ["구분", "유형"],
        rows: [
          ["구축 유형", "Mirror Site\nHot Site\nWorm Site\nCold Site"],
          ["운영형태 유형", "상호계약형\n공동이용형\n외부위탁형\n독자구축형"],
        ],
      },
    ],
    notes: ["개념도 절차: 위기 분석(프로젝트 착수 → 취약성 분석·리스크 평가 → 업무 분석·BIA·CBA·대안개발·리스크 관리 → IT 분석 → 안전/보안 분석 → Resource 분석) → 전략 수립(업무별 복구 전략, Risk Mitigation전략: BA구현·HUMAN·IT·Data Center, 안전/보안 전략 → BCP 전략) → 계획 수립(상시 운영 계획, 대응/복구 계획, 복구 진행 관리, 위기 상황 전달) → 실행(훈련 관리, 학습 관리, Plan Backup, 프로젝트 종료)"],
  },
  {
    title: "BIA (Business Impact Analysis)",
    course: "MG",
    definition:
      "기업의 각 비즈니스 업무에 대하여 긴급 재난사태, 비상상황 발생 시의 영향도를 평가하고 복구우선순위 및 복구목표를 정의하는 분석활동",
    defShort: "비상 시 영향도 평가하고 복구우선순위 및 복구목표를 정의하는 분석활동",
    lead: "재해 영향과 복구 우선순위, BIA(Business Impact Analysis)",
    features: ["비즈니스 업무 중심", "손실 영향 평가", "복구 우선순위 결정"],
    keywords: ["핵심프로세스", "발생가능성", "손실평가", "우선순위 산정", "RSO", "RTO", "RPO", "RCO 도출"],
    tables: [
      {
        caption: "절차",
        headers: ["구분", "절차"],
        rows: [
          ["비즈니스 분석", "비즈니스 기능 정의\n비즈니스 기능 분할\n의존성 분석"],
          ["비즈니스 평가", "설문조사\n결과분석(피해 및 대응 정도)\n비즈니스 영향도 측정\n평가의 사업적 중요성"],
          ["우선순위 도출", "비즈니스 우선순서\n협력관계와 의존성 반영\n업무 중요도 결론 도출"],
          ["복구자원 분석", "민감 사업의 RTO, RPO\n민감 사업 최소 요구 자원 이해"],
        ],
      },
      {
        caption: "지표",
        headers: ["구분", "지표", "설명"],
        rows: [
          ["복구 목표", "RPO(Recovery Point Objective)", "중단~데이터 복구 후 정상 가동\n데이터가 복구되어야 하는 시점"],
          ["복구 목표", "RTO(Recovery Time Objective)", "중단~업무 복구 후 다시 가동 시간\n재해 시 복구 목표 시간 설정"],
          ["복구 목표", "RSO(Recovery Scope Objective)", "복구 목표범위 범위 선정 기준\n대상 시스템 계정계·정보계"],
          ["복구 목표", "RCO(Recovery Communication Objective)", "통신매체 복구 회선 복구 목표\nNW 가동 재개 본점 지점 연결"],
          ["센터", "BCO(backup Center Objective)", "백업센터 구축 구축 형태 정의\n센터 활용방안 복구센터 운영"],
          ["연속성", "MBCO(Minimum Business Continuity Objective)", "최소 연속성 업무 지속 목표\n수용 가능 수준 서비스 최저선"],
          ["연속성", "MTPD(Maximum Tolerable Period of Disruption)", "최대 중단기간 수용 가능 기간\n허용 한계시간 초과 시 위험"],
        ],
      },
      {
        caption: "BIA 최종등급",
        headers: ["BIA 최종등급", "복구목표", "DR 센터", "대상 시스템 사례"],
        rows: [
          ["1. 부분/국지적", "RTO=8H\nRPO=10D", "Cold Site", "테스트·검증계"],
          ["2. 일반/제한", "RTO=6H\nRPO=7D", "Warm Site", "파일서버"],
          ["3. 중요/대형", "RTO=4H\nRPO=12H", "Hot Site", "경영정보시스템"],
          ["4. 광범위/전파", "RTO=2H\nRPO=2H", "Mirror Site", "온라인 쇼핑몰"],
        ],
      },
    ],
  },
  {
    title: "BCP 지표 중 MBCO, MTPD, MAO",
    course: "MG",
    definition:
      "정보시스템에 대한 비상 대비체계 유지와 각 업무 조직 별 비상사태에 대비한 복구계획 수립을 통한 업무 연속성을 유지할 수 있는 체제",
    defShort: "비상사태 대비 복구계획 수립을 통한 업무 연속성을 유지할 수 있는 체제",
    lead:
      "연속성 성능 목표 3형제, MBCO·MTPD·MAO",
    features: ["성능×시간 관점", "BIA 기반 산정", "복구 목표 기준"],
    keywords: ["BCP", "BIA", "RA", "RTO", "RPO", "MBCO", "MTPD", "MAO"],
    tables: [
      {
        caption: "지표 정의",
        headers: ["구분", "지표", "설명"],
        rows: [
          ["연속성", "MTPD(Maximum Tolerable Period of Disruption)", "최대 중단허용 허용 기간 산정\n재무요소 적용 영향 추정 기준"],
          ["연속성", "MAO(Maximum Acceptable Outage)", "최대 정지시간 서비스 중단 감내\n수용 가능 한계 견딜 수 있는 시간"],
          ["연속성", "MBCO(Minimum Business Continuity Objective)", "최소 연속성 목표 달성 기준\n수용 최소수준 서비스 최저선"],
          ["복구 목표", "RTO(Recovery Time Objective)", "복구 목표시간 가동 재개 목표\n업무별 복구 사고 대응 기준"],
          ["복구 목표", "RPO(Recovery Point Objective)", "복구 목표지점 데이터 기준 시점"],
        ],
      },
      {
        caption: "비즈니스 연속성 성능목표치(성능 × 시간) 그래프",
        headers: ["구분", "내용", "설명"],
        rows: [
          ["그래프 지표", "MBCO", "최소 연속 수준"],
          ["그래프 지표", "MAO MTPD\nRTO", "최대 중단 기간\n복구 목표 시간"],
          ["시간 구간", "예방·대비\n사고·대응", "사전 예방 활동\n사고 시 대응"],
          ["시간 구간", "복구·복원\n시간 단축", "업무 정상 회복\n리스크 예방"],
          ["관련 표준", "22301\n22313", "ISO 요구사항\n실행 지침 제공"],
          ["관련 표준", "31000\n22320", "ISO 위험 예방\n사고 대응 규정"],
          ["관련 표준", "BS25999\n1·2부", "복구 단계 표준\n2개 부 구성"],
          ["결론", "레질리언스\n경영진 의지", "조직 복원 역량\n전략·절차 마련"],
          ["결론", "조직 내재화", "수준 향상 추진"],
        ],
      },
    ],
    notes: ["레질리언스(resilience): 환경 시스템에 가해진 충격을 흡수하고 그 시스템이 복구 불가능한 상태로 전환되는 것을 막아 변화나 교란에 대응하는 생태계의 재건 능력"],
  },
  {
    title: "DRS (Disaster Recovery System)",
    course: "MG",
    definition:
      "정보시스템에 대한 비상 대비체계 유지와 각 업무 조직 별 비상사태에 대비한 복구계획 수립을 통한 업무 연속성을 유지할 수 있는 체제",
    defShort: "비상 대비체계와 복구계획 수립을 통한 업무 연속성을 유지할 수 있는 체제",
    lead: "비상 대비의 업무 연속성, DRS(Disaster Recovery System)",
    features: ["업무 연속성 유지", "원격지 이중화", "비용·RTO 상충"],
    keywords: ["Mirror", "Hot", "Warm", "Cold site", "RSO", "RTO", "RPO", "RCO", "BCO", "독자구축", "공동이용", "외부위탁", "상호계약"],
    tables: [
      {
        caption: "DR센터 유형 — 구축유형별 [미핫웜콜]",
        headers: ["구분", "내용", "목표시간"],
        rows: [
          ["Mirror Site", "양 센터 동시 처리\n즉시 대체 가동", "RTO = 0"],
          ["Hot Site", "주센터급 자원\n실시간 이중화", "RTO ≤ 2H"],
          ["Warm Site", "일부 장비 구비\n주요 업무 복구", "RTO ≤ 1W"],
          ["Cold Site", "기본시설만 확보\n재해 시 구축", "수개월"],
        ],
      },
      {
        caption: "DR센터 유형 — 운영형태별 [상공외독]",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["협력", "상호계약형", "유사기관 백업 기관 간 상호 계약\n비상시 지원 평시 원조 관계"],
          ["협력", "공동이용형", "기관 공동출자 비용 분담 구축\n센터 공동이용 백업센터 운영"],
          ["위탁", "외부위탁형", "전문기관 위탁 외부 운영 대행"],
          ["자체", "독자구축형", "자체 센터 구축 독자 구축 운영"],
        ],
      },
      {
        caption: "기술요소",
        headers: ["기술 요소", "설명"],
        rows: [
          ["HA(High Availability)", "최단 복구 위한 H/W Clustering\nStand-By 형태"],
          ["FT(Fault Tolerant)", "실시간 복구 가능한 Dual 시스템"],
          ["IP-SAN", "SAN Traffic을 IP Packet으로 전송"],
          ["DWDM(Dense Wavelength Division Multiplexing)", "고속 Data 전송 통신\n고밀도 파장분할 다중화"],
        ],
      },
    ],
    notes: ["복구절차 [분재시운]: ① 업무영향분석 → ② 재해복구 전략 수립 → ③ 시스템구축 및 복구계획수립 → ④ 운영 및 모의훈련", "개념도: 메인센터(HW/SW, 스토리지, 네트워크, 기업정보) —DWDM 데이터 복제→ DR센터(동일 구성). 주업체·제휴업체는 전용선으로 양 센터 연결"],
  },
  {
    title: "ISO 22301",
    course: "MG",
    definition:
      "기업의 비즈니스 연속성을 위해 BCP 수립에서 도입, 운영, 검토까지 지속적인 개선에 대한 요구사항을 규정한 BCMS의 국제표준",
    defShort: "BCP 도입·운영·검토 지속적 개선 요구사항 규정 BCMS 국제표준",
    lead: "업무 연속성 관리 국제표준, ISO 22301",
    features: ["PDCA 순환 개선", "인증 가능 표준", "이해관계자 중심"],
    keywords: ["PDCA", "조직", "리더십", "계획수립", "지원", "운영", "성과평가", "개선"],
    tables: [
      {
        caption: "구성도 및 구성요소 [PDCA]",
        headers: ["단계", "설명"],
        rows: [
          ["Plan(계획 수립)", "BCM 정책 및 전략 수립\n프로세스 절차 수립"],
          ["Do(실행 및 운영)", "정책·프로세스·절차 이행 및 운영"],
          ["Check(모니터링 및 검토)", "BCM 운영결과 검토\n내부감사 및 경영진 보고\n개선활동의 결정"],
          ["Act(유지 및 개선)", "경영진 검토\nBCM 정책 근거 교정활동\nBCM 유지관리 및 개선"],
        ],
      },
      {
        caption: "주요내용 [조리계지운성개]",
        headers: ["구분", "설명"],
        rows: [
          ["조직상황", "BCM 관리자 위한 조직의 역할\n이해관계자·요구사항 설정\nBCM 범위 설정"],
          ["리더십(지도층)", "경영진의 책무\n업무 연속성 방침\n최고경영진 책임 및 권한"],
          ["계획수립(기획)", "업무 연속성 목적 제시\nBCM 관련 계획 수립\n위험요소 식별·평가·영향분석\n전략 계획·경감계획·대응 계획"],
          ["지원", "자원관리\n수행능력 구축\n내/외부와의 커뮤니케이션"],
          ["운영(운용)", "운영계획수립 및 통제관리\n업무영향분석 및 위험평가\n복구 및 모의훈련 통한 검증\n복구목표시간(RTO) 기준"],
          ["성과관리(성과평가)", "감시·측정\n분석 및 평가\n내부감사\n관리자 검토"],
          ["개선", "부적합 및 시정조치\n지속적 개선"],
        ],
      },
    ],
    notes: ["구성도: 이해관계자·비즈니스 연속성 요구사항 → BCMS의 지속적 개선(Plan→Do→Check→Act 순환) → 이해관계자·관리된 비즈니스 연속성"],
  },
  {
    title: "DRaaS(Disaster Recovery as a Service)",
    course: "MG",
    definition:
      "클라우드 서비스를 이용하여 데이터, 어플리케이션 등을 백업한 후 재해와 정전, 사이버공격, 기타 비즈니스 장애가 발생하는 경우 데이터 복제, 호스팅, 복구 등을 제공하는 서비스",
    defShort: "클라우드 백업 후 장애 발생 시 데이터 복제·호스팅·복구 등 제공 서비스",
    lead:
      "클라우드 재해복구 서비스, DRaaS",
    features: ["클라우드 기반 복구", "짧은 RPO", "OPEX 비용 구조"],
    keywords: ["재해복구", "Failover", "Failback", "Replication", "DRaaS 모델(관리형, 지원형, DIY형)"],
    tables: [
      {
        caption: "모델 [관지D]",
        headers: ["모델", "동작방식", "설명"],
        rows: [
          ["관리형 DRaaS", "전체 아웃소싱\n업체 전담 운영", "재해복구 위탁\nSLA 보장 제공"],
          ["지원형 DRaaS", "기업 주도 통제\n업체 부분 지원", "통합 테스팅 수행\n필요 시 개입"],
          ["DIY형 DRaaS", "자체 전 과정\n직접 전환 관리", "기업 책임 수행\n클라우드 복제"],
        ],
      },
      {
        caption: "도입 효과",
        headers: ["지표", "비교"],
        rows: [
          ["COST", "HA(CAPEX) 대비\nDRaaS(OPEX)로 절감"],
          ["RTO", "Tape VTL 12시간 → DRaaS\n15분으로 경감"],
          ["RPO", "Tape VTL 대비 1분단위\n1,000개로 증대"],
        ],
      },
    ],
    notes: ["개념도: ① 고객사에서 1차 보호(CDP 서버) → ② Cloud DR Center로 Replication → ③ Cloud DR Center에서 2차 보호(클라우드 CDP 서버) → ④ Cloud DR Center 이용한 긴급 복구(재해복구용 가상 서버타운)", "DRaaS는 짧은 RPO를 제공하도록 설계(재해가 발생해도 데이터가 이전 상태로 최대한 근접하게 복구 될 수 있게 함). 일반적인 중지 시간 없는 온프레미스 백업과 달리 클라우드 기반 DRaaS의 RPO는 일반적으로 몇시간 정도"],
  },
  {
    title: "디지털 안전 3법",
    course: "MG",
    definition:
      "방송통신발전법, 정보통신망법, 전기통신사업법 등 디지털 재난 예방과 대응을 위해 개정된 3개 법률",
    defShort: "디지털 재난 대비 방송통신발전법·정보통신망법·전기통신사업법",
    lead: "디지털 재난 대응 법제, 디지털 안전 3법",
    features: ["디지털 재난 대비", "부가통신 규제 확대", "데이터센터 보호"],
    keywords: ["방송통신발전법", "정보통신망법", "전기통신사업법"],
    tables: [
      {
        caption: "디지털 안전 3법 주요 개정 내용 [방정전]",
        headers: ["법", "개정 법령", "개정 시행령"],
        rows: [
          ["방송통신발전 기본법(방송통신발전법)", "부가통신사업자\n재난관리 업무\n→주요방송통신사업자\n제35조제1항", "이용자 1000만↑\n또는 트래픽 2%↑"],
          ["방송통신발전 기본법(방송통신발전법)", "데이터센터사업자\n재난관리 업무\n→주요방송통신사업자\n제35조제1항", "바닥 22500㎡↑\n또는 수전 40MW↑\n매출 100억↑"],
          ["방송통신발전법 — 중요통신시설", "", "면적·용량 고려\n등급 분류 근거"],
          ["정보통신망 이용촉진 및 정보 보호 등에 관한 법률(정보통신망법)", "데이터센터 시설\n보호조치 의무", "보호조치 대상\n바닥 500㎡↑\n데이터센터"],
          ["정보통신망법 — 보고 조치", "제공자 보고 조치\n제46조 6·7항", "재난·재해 보고\n임차사업자 조치"],
          ["전기통신사업법", "부가통신서비스\n안정성 확보의무", "자료 제출 요청\n중복 규정 삭제"],
        ],
      },
    ],
  },
  {
    title: "IT 거버넌스(IT-Governance)",
    course: "MG",
    definition:
      "기업의 전략과 목표에 부합되도록 IT와 관련된 Resource와 Process를 통제/관리 하는 체계",
    defShort: "기업의 전략과 목표에 부합되도록 IT 자원과 프로세스 통제/관리 체계",
    lead: "전략·IT 정렬 통제 체계, IT 거버넌스",
    features: ["전략적 연계", "IT 자원 통제", "가치 전달 지향"],
    keywords: ["전가위자성", "통제", "관리"],
    tables: [
      {
        caption: "도메인 프레임워크 개념도 [전가위자성]",
        headers: ["영역", "관련 요소"],
        rows: [
          ["전략적 연계(Strategy Alignment)", "EA, ISP"],
          ["가치 전달(Value Delivery)", "ERP, SCM, CRM, BPM"],
          ["위험관리(Risk Management)", "DRS, BCP, ERM"],
          ["자원관리(Resource Management)", "ITSM, ITAM"],
          ["성과측정(Performance Measurement)", "BSC, IT ROI"],
        ],
      },
      {
        caption: "참조모델",
        headers: ["참조모델", "내용"],
        rows: [
          ["COBIT", "Governance 구현 위한 참조 모델"],
          ["EA/ITA", "기업 아키텍처 구축 위한 접근 방법"],
          ["CMMI/SPICE", "IT 프로세스 평가·개선 국제 표준"],
          ["ITIL", "서비스 수준 계약서(성과 목표치)\nSLM: 서비스 수준 관리 IT 프로세스"],
          ["IT BSC", "정보화 성과 측정 및 평가 방법론"],
        ],
      },
      {
        caption: "IT거버넌스 프레임워크 유형",
        headers: ["유형", "설명", "구성요소"],
        rows: [
          ["IT거버넌스 모델", "가트너 제시\n조직 최적화 모델", "원칙, 메커니즘\n프로세스"],
          ["도메인 프레임워크", "ITGI 제시\n가치·위험·자원\n성과 측정 모델", "전략적 연계\n가치 제공\n위험·자원 관리\n성과 측정"],
          ["COBIT", "IT 통제 개선\n현 수준 진단\n국제 표준 수용", "비즈니스 요구\nIT Process\nIT Resource"],
          ["의사결정영역 프레임워크", "MIT Sloan 제시\n의사결정 구조", "의사결정 대상\n의사결정 주체\n결정 메커니즘"],
          ["Val IT", "IT 투자 가치\n측정·감시·최적화", "가치 거버넌스\n포트폴리오관리\n투자관리"],
          ["Risk IT", "IT 위험을 전사\n위험관리와 통합", "Risk Governance\nRisk Evaluation\nRisk Response"],
        ],
      },
    ],
    notes: ["도메인 프레임워크 개념도: Business Area → (전략적 연계 → 자원관리 → 가치 전달, 위·아래로 위험관리·성과측정) → Customer Area"],
  },
  {
    title: "ISO 38500:2024",
    course: "MG",
    definition:
      "조직의 IT가 효율적이고, 효과적이고, 책임성 있게 활용될 수 있도록 IT의 활용을 평가하고(Evaluate), 지휘하고(Direct), 감독(Monitoring) 하기 위해 IT Governance 구현 원칙 프레임워크를 제시하는 국제표준",
    defShort: "평가·지휘·감독의 IT Governance 프레임워크 국제표준",
    lead: "평가·지휘·감독의 원칙, ISO 38500:2024",
    features: ["원칙 중심 표준", "이해관계자 참여", "ISO 37000 정합"],
    keywords: ["평가(Evaluate)", "지휘(Direct)", "감독(Monitor)", "이해관계자 참여", "ISO37000"],
    tables: [
      {
        caption: "개념도 구성요소 [평지모이]",
        headers: ["구성요소", "설명"],
        rows: [
          ["평가(Evaluate)", "비즈니스 내외부적 환경 고려 평가"],
          ["지휘(Direct)", "비즈니스 목표 계획·정책 구현"],
          ["감독(Monitoring)", "정책 준수·계획 성과 모니터링"],
          ["이해관계자 참여(Engage Stakeholders)", "상호작용으로 IT거버넌스 효과↑"],
        ],
      },
      {
        caption: "원칙 [목가전감책 이리의위사지]",
        headers: ["구분", "핵심원칙", "설명"],
        rows: [
          ["주요 원칙", "목적", "조직의 존재 이유 정의\n모든 활동과 의사결정 방향 설정"],
          ["기초 원칙", "가치 모델", "조직의 핵심 가치 설정\n윤리적 행동과 의사결정 촉진"],
          ["기초 원칙", "전략", "목적·가치 달성 전략 수립·실행"],
          ["기초 원칙", "감독", "성과·활동 모니터링\n목표 달성 보장"],
          ["기초 원칙", "책임", "역할과 책임 명확히 이해·이행"],
          ["지원 원칙", "이해관계자 참여", "이해관계자 적극 소통, 신뢰 구축"],
          ["지원 원칙", "리더십", "윤리적 리더십으로 조직 문화 형성"],
          ["지원 원칙", "데이터와 의사결정", "신뢰 데이터 기반 투명한 의사결정"],
          ["지원 원칙", "위험 거버넌스", "위험 식별·관리, 지속 가능한 성장"],
          ["지원 원칙", "사회적 책임", "사회·환경 영향 고려 책임 행동"],
          ["지원 원칙", "지속가능성과 성과", "장기 관점 지속 가능성·성과 보장"],
        ],
      },
    ],
    notes: ["개념도: Engage Stakeholders·Evaluate·Direct·Monitor 삼각형 ↔ Management of IT 순환", "ISO 37000(조직 거버넌스)과 ISO 38500이 연계 — ISO 37000의 원칙과 정합성을 강화하여 11개의 원칙으로 확장"],
  },
  {
    title: "IT-Compliance",
    course: "MG",
    definition:
      "기업의 투명성 강화, 리스크 관리를 위하여 정부나 관련 기관이 제시한 각종 규제, 법안 등에 만족될 수 있도록 IT 관점에서 시스템을 재 정비하는 활동",
    defShort: "각종 규제·법안에 만족되도록 IT 관점에서 시스템을 재 정비하는 활동",
    lead: "규제 준수 위한 IT 정비, IT-Compliance",
    features: ["외부 규제 대응", "내부 통제 체계", "IT 관점 시스템 정비"],
    keywords: ["Sarbanes-Oxley", "Basel-II", "개인정보보호", "정보관리", "정보보안", "COBIT", "패널티", "자금세탁방지"],
    tables: [
      {
        caption: "프레임워크 — 원인·대응체계·효과",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["원인", "외부 규제", "ISMS 인증 국내 보안 규제\nBasel II 금융 건전성 규제"],
          ["원인", "내부 통제", "내부 거버넌스 통제 체계 운영\n리스크 관리 위험 대응 관리"],
          ["대응체계", "대응체계", "조직·규칙 정립 프로세스 정비\n감사·모니터링 관리 도구 활용"],
          ["효과", "효과", "투명성 확보 신뢰 기반 경영\n경쟁력 제고 리스크 감소"],
        ],
      },
      {
        caption: "주요요구사항",
        headers: ["항목", "요구사항", "상세 설명"],
        rows: [
          ["주요 요구사항", "데이터 공개", "E-Discovery\n투명성 제고\n데이터 공개 요구"],
          ["주요 요구사항", "데이터 보존", "이력 추적 목적\n보존 기한 준수"],
          ["주요 요구사항", "데이터 보호", "위치·민감 정보\n식별 정보 암호화\n접근 제어 요구"],
          ["주요 요구사항", "내부통제", "유출·오남용\n접근 권한·제어\n감시·감사 요구"],
          ["주요 요구사항", "책임성", "라이프사이클\n수집·저장·활용·파기\n변조·유출·침해사고\n고지 및 책임 요구"],
          ["규제 종류", "개인정보보호", "취급 방식 규정\nGDPR(국외)\n개인정보보호법(국내)"],
          ["규제 종류", "정보관리", "재무회계 기록\n경영 문서 투명성\n정확성·적시성·완전성\nSOX, Basel II"],
          ["규제 종류", "정보보안", "주요 인프라 보호\n데이터 보호 목적\n식별·접근 통제\n모니터링·감사규정"],
        ],
      },
    ],
  },
  {
    title: "환경분석",
    course: "MG",
    definition:
      "기업경영에 영향을 주는 기업환경들로 부터 나타나는 그 어떤 징후나 신호 같은 것들을 가능한 한 포착하여 이들 자료나 정보를 이용하여 장래 기업 경영에 영향을 미칠 수 있는 요인들을 분석하는 것",
    defShort: "징후 자료나 정보를 이용해 장래 기업 경영에 영향을 미칠 수 있는 요인 분석",
    lead: "경영 영향 요인 징후 포착, 환경분석",
    features: ["징후·신호 포착", "장래 영향 분석", "내부·외부 양면"],
    keywords: ["내부환경분석", "외부환경분석", "강점/약점", "기회/위협"],
    tables: [
      {
        caption: "외부환경분석 [기회/위협]",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["개념", "개념", "외부환경분석 외부 요인 분석\n성공 가능성 사업 판단 기준"],
          ["절차", "절차", "거시·산업구조 환경 범위 분석\n경쟁·진화 분석 시사점 도출"],
          ["기법", "PEST 분석", "정치·경제 거시 환경 분석\n사회·기술 조직 전략 영향"],
          ["기법", "5 Force 모델 분석", "경쟁자 상호작용 산업 구조 분석\n기회·위협 위협 요인 도출"],
          ["기법", "3C 분석", "고객·경쟁사 니즈 비교 분석\n자사 차별화 우위 전략 수립"],
        ],
      },
      {
        caption: "내부환경분석 [강점/약점]",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["개념", "개념", "보유한 역량 분석, 미래 역량 도출"],
          ["절차", "절차", "사업성과 및 재무성과 분석\n경영 현황 진단\n내부 역량 분석\n시사점 도출"],
          ["기법", "Value Chain 분석", "부가가치 창출 직·간접 프로세스\n활동 강·약점, 비용 우위 확보\n제품/서비스 차별화 속성 창출\n역량 강화 전략적 시사점 분석"],
          ["기법", "균형 지표 성과 분석(BSC)", "재무적 관점, 고객\n내부 프로세스, 학습 및 성장\n측정 가능 성과지표로 전환\n성과관리 방안 분석"],
          ["기법", "7S 모형 분석", "조직 현황 진단, 대응방안 수립\nHard·Soft Element 모두 고려\n총체적 조직 역량 진단"],
          ["기법", "가능역량 자원분석", "시장 우위 요인 중심 분석\n자원·핵심역량·경쟁우위 분석"],
        ],
      },
    ],
  },
  {
    title: "Ansoff Matrix",
    course: "MG",
    definition:
      "기업의 성장을 위해 제품과 시장 영역에서 진행해야 할 방향을 결정하기 위한 평가하는 의사결정 전략 기법",
    defShort: "성장을 위해 제품·시장 영역의 진행 방향을 정하는 의사결정 전략 기법",
    lead:
      "제품×시장 성장 전략, Ansoff Matrix",
    features: ["시장·제품 관점", "성장 방향 결정", "확장 시 위험 증가"],
    keywords: ["의사결정", "제품", "시장", "성장 전략 설정"],
    tables: [
      {
        caption: "개념도 [시제 침개개다]",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["평가 기준", "시장 (Market)", "진출하려는 산업의 시장 방향 기준"],
          ["평가 기준", "제품 (Product)", "보유·개발할 제품의 방향 기준"],
          ["선택 전략", "시장 침투(Market Penetration)", "기존 시장에 기존 제품 추가 판매"],
          ["선택 전략", "시장 개발(Net Market)", "기존 제품으로 새로운 시장 진출"],
          ["선택 전략", "제품 개발(Product Development)", "기존 시장에 새로운 제품 활동"],
          ["선택 전략", "다각화(Diversification)", "새 제품으로 새로운 시장 진입"],
        ],
      },
    ],
    notes: ["기출: 2025.10 ITPE 모의고사 2교시", "4분면 배치: 기존 제품×기존 시장=시장 침투, 기존 제품×신시장=시장 개발, 신제품×기존 시장=제품 개발, 신제품×신시장=다각화. 축을 따라 멀어질수록 위험도 증가"],
  },
  {
    title: "BCG Matrix",
    course: "MG",
    definition:
      "보스턴컨설팅 그룹(BCG: Boston Consulting Group)에 의하여 1968년에 제안된 사업 포트폴리오 분석 기법",
    defShort: "보스턴컨설팅 그룹이 1968년에 제안한 사업 포트폴리오 분석 기법",
    lead:
      "사업 포트폴리오 분석, BCG Matrix",
    features: ["현금흐름 관점", "제품생명주기 연계", "평가 변수 단순"],
    keywords: ["포트폴리오 분석", "Star", "Question mark", "Cash cow", "Dog"],
    tables: [
      {
        caption: "개념도 [별들에게 물어봐 소인지 개인지]",
        headers: ["분면", "위치", "설명"],
        rows: [
          ["Star(육성 사업)", "높은 점유율 ×\n높은 성장률", "수익 흐름 양호\n집중 육성 필요"],
          ["Cash Cow(합리화 사업)", "높은 점유율 ×\n낮은 성장률", "낮은 투자 고수익\n자금 재배치"],
          ["Question Mark(신규 사업)", "낮은 점유율 ×\n높은 성장률", "수익 낮은 단계\n선별적 투자"],
          ["Dog(철수 대상)", "낮은 점유율 ×\n낮은 성장률", "한계 사업 판단\n퇴출 검토 대상"],
        ],
      },
      {
        caption: "분석방향과 제품생명주기 관계",
        headers: ["구분", "내용"],
        rows: [
          ["자금의 바람직한 이동경로", "Cash Cow(₩)에서 나온 자금\nQuestion Mark·Star로 투자"],
          ["사업부의 바람직한 성장경로", "Question Mark → Star → Cash Cow\n방향으로 성장"],
          ["제품생명주기와 관계", "Question Mark(도입)\nStar(성장)\nCash Cow(성숙)\nDog(쇠퇴)"],
        ],
      },
    ],
    notes: ["시장점유율과 성장률만으로 사업성을 판단하기에는 한계 — 산업 매력도 × 시장 경쟁력의 GE 매트릭스(투자성장/선별적 투자/수확 철수)가 이를 보완"],
  },
  {
    title: "정보시스템 하드웨어 규모산정 지침",
    course: "MG",
    definition:
      "정보시스템 도입 시 기본적인 용량과 성능 요구사항이 제시되었을 때 그것을 시스템 도입을 위한 요구사항으로 변환하기 위한 산정하는 방법 (TTAK.KO-10.0292/R3, 2023.12.06. 개정)",
    defShort: "용량·성능 요구사항을 시스템 도입을 위한 요구사항으로 변환 산정 방법",
    lead:
      "HW 용량·성능 산정 표준, 정보시스템 하드웨어 규모산정 지침",
    features: ["요구사항 변환 기반", "참조 성능치 활용", "가중치 보정"],
    subDefs: [
      {
        name: "수식계산법",
        lead: "요소 계산의 보정 적용",
        def: "규모산정 요소를 토대로 용량 수치를 계산하고 보정치를 적용하는 방법",
      },
      {
        name: "참조법",
        lead: "유사 시스템의 비교",
        def: "업무량에 따라 기본 데이터로 비슷한 규모와 비교하여 산정하는 산정법",
      },
      {
        name: "시뮬레이션법",
        lead: "작업부하의 모의 실행",
        def: "대상 업무의 작업부하를 모델링하고 시뮬레이션해 규모를 산정하는 방법",
      },
    ],
    keywords: ["수식계산법", "참조법", "시뮬레이션법"],
    tables: [
      {
        caption: "규모산정 대상",
        headers: ["대상", "설명"],
        rows: [
          ["CPU", "업무 처리 CPU 전체규모 계산\n적정 성능 서버 기종 선정"],
          ["메모리", "서버 구성방안 의거 사용량 산정\n시스템 S/W\n응용프로그램"],
          ["디스크", "서버 구성방안 의거 사용량 산정\n서버별 OS, 시스템 S/W\nDB 데이터·아카이브(Archive)\n백업영역"],
          ["스토리지", "서버 규모 따라 스토리지 규모 산정"],
        ],
      },
      {
        caption: "규모산정 절차",
        headers: ["절차", "활동"],
        rows: [
          ["[1단계] 구축방향 및 기초자료 조사", "구축 방향 파악\n기초자료 조사"],
          ["[2단계] 기초자료 및 업무분석", "기준 부하 산정\n업무 내용 검증"],
          ["[3단계] 참조모델 결정 및 서버 규모산정", "참조 모델 선택\n요소별 규모산정"],
          ["[4단계] 참조모델 별 가중치 적용", "참조모델1 가중치 적용 방식\n참조모델2 가중치 적용 방식\n참조모델3 가중치 적용 방식"],
        ],
      },
      {
        caption: "규모산정 방법 [수참시]",
        headers: ["방법", "개념"],
        rows: [
          ["수식계산법", "사용자 수 등 요소 토대로 용량 계산\n보정치 적용"],
          ["참조법", "업무량(사용자 수, DB 크기) 기준\n대략적 시스템 규모 비교 산정"],
          ["시뮬레이션법", "대상 업무 작업부하 모델링\n시뮬레이션하여 규모 산정"],
        ],
      },
      {
        caption: "규모산정 지표",
        headers: ["구분", "OLTP 또는 OLTP&배치 애플리케이션 서버", "WEB 서버·WAS 서버", "스토리지"],
        rows: [
          ["성능 측정치", "tpmC", "max-jOPS", "IOPS"],
          ["참조 성능 기준", "TPC-C", "SPECjbb2015", "SPC-1"],
        ],
      },
    ],
  },
  {
    title: "가치사슬(Value Chain)",
    course: "MG",
    definition:
      "기업이 제품이나 서비스를 생산하여 부가가치 창출에 직·간접적으로 관련된 일련의 활동·기능·프로세스의 연계",
    defShort: "제품 부가가치 창출에 직·간접 관련된 활동·기능·프로세스의 연계",
    lead:
      "부가가치 창출 활동의 연계, 가치사슬(Value Chain)",
    features: ["부가가치 활동 연계", "이원적 활동 구조", "이윤(Margin) 창출"],
    keywords: ["주활동(매입 물류, 생산, 매출 물류, 마케팅 & 영업, 서비스)", "지원활동(기업구조, 인사관리, 기술개발, 자원조달)"],
    tables: [
      {
        caption: "구성요소 [내생외마서 기인기조]",
        headers: ["구성", "세부구성", "핵심"],
        rows: [
          ["주 활동(Primary Activities)", "내부 로지스틱스", "원재료 부품 품질\n구매 물류활동"],
          ["주 활동(Primary Activities)", "생산활동", "무결점 제품\n품질·원가·납기\n다양성"],
          ["주 활동(Primary Activities)", "외부 로지스틱스", "신속한 배송\n효율적 주문처리\n출하 물류활동"],
          ["주 활동(Primary Activities)", "마케팅 및 판매", "매출 확대\n시장점유율 확대\n브랜드 인지도\n부대비용 절감"],
          ["주 활동(Primary Activities)", "서비스", "고객 기술지원\n고객 신뢰도 향상"],
          ["지원 활동(Supportive Activities)", "기업 하부구조", "경영정보시스템(MIS)"],
          ["지원 활동(Supportive Activities)", "인적자원 관리", "인력 수급관리\n서비스 교육훈련"],
          ["지원 활동(Supportive Activities)", "기술개발", "차별화된 제품\n신속한 신제품\n신기술 신규원료"],
          ["지원 활동(Supportive Activities)", "조달", "가치사슬 투입물\n구매 기능 관련"],
        ],
      },
    ],
    notes: ["구성도: Support Activities(Firm Infrastructure·기업 하부구조, Human Resource Management·인적 자원 관리, Technology Development·기술 개발, Procurement·조달 활동) + Primary Activities(Inbound Logistics·내부 물류, Operations·제조/생산, Outbound Logistics·외부 물류, Marketing&Sales·마케팅/영업, Services·서비스) → Margin(이윤)", "기업의 각 부문의 활동은 모두 일련의 가치(Value) 창조를 위한 연쇄(Chain) 활동이며 그 궁극적인 목적을 이윤 창출(Margin)로 파악"],
  },
  {
    title: "PDCA(Plan-Do-Check-Act, Deming Cycle)",
    course: "MG",
    definition:
      "Plan(계획), Do(실행), Check(평가), Action(개선)을 반복하여 생산 관리 및 품질 관리 등의 업무를 지속적으로 개선해 나가는 방법",
    defShort: "계획·실행·평가·개선 반복으로 품질 관리 지속적으로 개선하는 방법",
    lead:
      "지속 개선의 순환 고리, PDCA(Deming Cycle)",
    features: ["지속적 반복 개선", "목표 수치화", "표준화 정착"],
    keywords: ["PLAN(계획)", "DO(실행)", "CHECK(평가)", "ACT(개선)"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Plan(계획)", "자료 수집·분석 문제 파악 목적\n개선계획 개발 평가 기준 설정"],
          ["Do(실행)", "수립계획 이행 실행 중 변화 파악\n체계적 자료수집 문서화 평가 대비"],
          ["Check(평가)", "과정 모니터링 수행 과정 감시\nPlan 계획 전략 연계 평가"],
          ["Act(개선)", "Check 평가 평가 결과 활용\n표준화·피드백 개선 도출 단계"],
        ],
      },
    ],
    notes: ["개념도: 경사면을 오르는 PDCA 바퀴 — Continuous Improvement로 굴러 올라가고, Standard(표준화 쐐기, Consolidation through Standardization)가 뒤로 밀리지 않게 고정하며 Quality Improvement가 축적", "목표는 반드시 수치화, 지속적 반복"],
  },
  {
    title: "MECE와 LISS",
    course: "MG",
    definition:
      "MECE(Mutually Exclusive Collectively Exhaustive): 서로 중복되는 것이 없으며 누락되는 것도 없이 문제의 전체를 파악하는 사고방식 또는 방법론 / LISS(Linearly Independent Spanning Set): 문제를 종합했을 때 중복 없이 하위 분석 대상들의 핵심만을 산출해내는 전략적 분석 기법",
    defShort: "중복·누락 없이 문제의 전체 파악 MECE와 핵심만 산출하는 LISS",
    lead: "문제 구조화의 두 기법, MECE와 LISS",
    features: ["상호 배제", "전체 포괄", "핵심 산출"],
    keywords: ["MECE: 상호 배제, 전체 포괄", "LISS: 핵심 산출, 중복 제거"],
    tables: [
      {
        caption: "MECE 분석 절차",
        headers: ["분석 절차", "세부 내용"],
        rows: [
          ["초기 가설 설정(1단계)", "MECE 구조·팩트 조합 초기 가설\n문제점 구조적 분할에서 시작"],
          ["핵심 요인 파악(2단계)", "MECE 형태 분석, 핵심 요인 파악\n핵심 요인 실행 가능 행동 지침화"],
          ["해결책 산출 및 제시(3단계)", "현 상태에서 실행 가능 해결책 제시\n할 수 있는 것 지속적 탐문"],
        ],
      },
      {
        caption: "LISS 단계",
        headers: ["단계", "내용"],
        rows: [
          ["문제파악", "문제의 핵심을\n파악하고 분석\n방안 도출"],
          ["문제분해", "로직트리를\n이용해 문제를\n하위요소로 분해"],
          ["문제제거", "중요하지 않은\n이슈들을\n배제하여\n핵심요소도출"],
          ["가설", "이슈에 대한\n기승전결 가설을\n작성"],
          ["계획수립", "기간, 목표,\n범위, 산출물\n등의 계획작성"],
          ["분석과 종합", "가설을 검증하여\n필요한 결과를\n도출"],
          ["결과도출", "결정권자의\n입장에서 결과\n보고서 작성"],
        ],
      },
    ],
    notes: ["MECE 잘못된 사례: ① 중복은 없으나 빠짐(자금조달에서 회사채 조달이 빠짐) ② 빠짐은 없으나 중복(의약품 시장에서 공립병원이 중복) ③ 분류가 다르고 중복되어 있어 빠짐도 중복도 생김. 잘된 사례: 사람=남자/여자, 숫자=실수/허수", "LISS 분석: 문제집합 A(a1,a2)·B(b1,b2)를 상하관계로 분석하여 중복없는 핵심요소 도출"],
  },
  {
    title: "ISP 및 ISMP 수립 공통가이드 9판(2025.05)",
    course: "MG",
    definition:
      "2025.5월 발표된 ISP·ISMP 수립 공통 가이드 제9판에서는 사업기간 단축과 자원투입 절감을 위해 소규모 정보시스템 구축 시 ISP·ISMP 수립 의무를 면제하도록 개정",
    defShort: "소규모 정보시스템 구축 시 ISP·ISMP 수립 의무를 면제한 가이드",
    lead: "소규모 ISP 면제 개정판, ISP·ISMP 수립 공통가이드 9판",
    features: ["소규모 수립 면제", "사업계획 대체 검토", "사업기간 단축"],
    keywords: ["소규모 정보시스템 구축 사업계획수립 안내", "클라우드 우선 적용", "ISP", "ISMP"],
    tables: [
      {
        caption: "개정사항",
        headers: ["구분", "설명"],
        rows: [
          ["개정사항", "제도개선 사항 반영(신규제도)\n소규모 정보시스템 구축\n사업계획수립 안내"],
          ["배경 및 필요성", "수립 실익 낮은 소규모 구축 사업\nISP·ISMP 수립 의무 면제\n구체적 사업계획 수립·검토\n사업기간 단축·자원투입 절감"],
          ["대상 및 비용", "중앙관서 총구축비 20억원 미만\n정보시스템 구축·재구축 사업\n개발비·장비비·기타 포함\n(수립비) 연구용역비·자체 예산"],
        ],
      },
      {
        caption: "주요절차 — 검토기간 최대 15일(사전검토, 검토의견서 작성 포함)",
        headers: ["단계", "설명"],
        rows: [
          ["① 부처", "사업계획서 수립 보완 및 검토 요청"],
          ["② NIA(5일)", "계획서 사전검토 사업계획서 검토\n충실성 판정 부적합 시 회송"],
          ["③ NIA(10일)", "검토의견서 작성 기획재정부 제출"],
          ["④ 기획재정부", "예산편성 참작 검토의견서 반영"],
        ],
      },
      {
        caption: "검토대상 사업",
        headers: ["번호", "설명"],
        rows: [
          ["①", "ISP·ISMP 수립예산 요구\n국회 확정 예산으로 수행\n기획재정부 협의 전용 예산"],
          ["②", "사업기간 종료된 ISP·ISMP\n①② 모두 충족"],
        ],
      },
      {
        caption: "검토 주요 내용 [필시중 사기 클 규]",
        headers: ["분야", "구성항목"],
        rows: [
          ["사업 타당성", "필요성, 시급성, 중복성"],
          ["실현 가능성", "사업추진 여건\n기술 적정성"],
          ["클라우드 우선 적용", "클라우드 우선 적용"],
          ["규모 적정성", "규모 적정성"],
        ],
      },
    ],
    notes: ["기출: 2025.06 ITPE 모의고사 4교시", "ISP·ISMP 수립 제외 사업 판정 플로우(수립의 실익이 낮을 경우): SW개발 사업 여부 → 단순기능 개발·단순 시스템 개발·DB구축 사업·총 구축비 20억원 미만(구체적 사업계획 수립)이면 ISP수립 예외. 시스템 운영/유지·HW/SW 운영/유지·HW/SW 도입·IT 환경 구축·민간투자형 SW사업도 ISP수립 예외, 이외 사업은 담당자 협의"],
  },
  {
    title: "ISP (Information Strategy Planning)",
    course: "MG",
    definition:
      "조직의 중장기 마스터 플랜을 지원하기 위한 정보시스템을 계획하고 전략을 수립하는 활동",
    defShort: "중장기 마스터 플랜 지원 위해 정보시스템 계획하고 전략을 수립하는 활동",
    lead:
      "중장기 정보화 전략 수립, ISP",
    features: ["중장기 계획 지원", "As-Is→To-Be", "경영전략 연계"],
    keywords: ["환경분석", "현황분석", "정보화 비전 및 전략 수립", "목표모델설계", "통합 이행계획"],
    tables: [
      {
        caption: "절차 상세 [환현정목통]",
        headers: ["구분", "활동", "산출물"],
        rows: [
          ["환경 분석", "경영환경분석", "경영환경 분석서"],
          ["환경 분석", "법령·제도 분석", "법·제도 분석서"],
          ["환경 분석", "IT 환경분석", "IT 동향분석서"],
          ["현황분석(As-Is 분석)", "업무현황분석", "업무현황 분석서"],
          ["현황분석(As-Is 분석)", "IT 현황 분석", "IT 현황 분석서"],
          ["현황분석(As-Is 분석)", "벤치마킹 수행", "선진사례 파악서"],
          ["현황분석(As-Is 분석)", "Gap 분석", "차이 분석서"],
          ["현황분석(As-Is 분석)", "이슈 통합 정리\n개선과제 도출", "요구사항 분석서\n개선과제 분석서"],
          ["정보화 비전 및 전략수립", "비전·전략 수립", "전략 정의서"],
          ["목표모델 설계(To-Be Model)", "개선과제 상세화", "과제 상세 정의서"],
          ["목표모델 설계(To-Be Model)", "업무 프로세스", "프로세스 설계서"],
          ["목표모델 설계(To-Be Model)", "정보시스템 구조", "과제 상세 정의서"],
          ["목표모델 설계(To-Be Model)", "데이터 구조 설계", "데이터 설계서"],
          ["목표모델 설계(To-Be Model)", "기술·보안 구조", "기술보안 설계서"],
          ["통합 이행계획", "통합 이행계획\n총구축비 산출\n효과분석", "이행계획 수립서"],
        ],
      },
    ],
  },
  {
    title: "ISMP (Information System Master Plan)",
    course: "MG",
    definition:
      "특정 SW 개발 사업에 대한 상세 분석과 제안요청서(RFP)를 마련하기 위해 기능점수 도출 가능수준까지 요건을 기술하여 구축전략 및 이행 전략 수립하는 활동",
    defShort: "상세 분석과 RFP 마련 위해 기능점수 도출 가능수준까지 요건 기술 활동",
    lead:
      "RFP 수준의 상세 계획, ISMP",
    features: ["기능점수 수준 요건", "RFP 작성 목적", "단위 프로젝트 범위"],
    keywords: ["프로젝트 착수 및 참여자 결정", "정보시스템 방향성 수립", "업무 및 정보기술 요건 분석", "정보시스템 구조 및 요건 정의", "정보시스템 구축 사업 이행방안 수립"],
    tables: [
      {
        caption: "절차 [착방업구이]",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["프로젝트 착수 및 참여자 결정", "경영진 지원조직\n수행 조직 편성", "지원 체계 형성\n참여자 결정"],
          ["프로젝트 착수 및 참여자 결정", "프로젝트 계획", "착수 계획 수립"],
          ["정보시스템 방향성 수립", "정보화 전략\n벤치마킹 분석", "전략 검토 수행\n선택적 수행"],
          ["정보시스템 방향성 수립", "추진 범위·방향\n범위·방향 검토", "방향 정의 수행\n정의 결과 검토"],
          ["업무 및 정보기술 요건 분석", "업무 현황 분석\n정보기술 현황", "현행 업무 파악\nIT 환경 분석"],
          ["업무 및 정보기술 요건 분석", "업무 요건 분석\n정보기술 요건", "기능 요건 도출\nIT 요건 도출"],
          ["업무 및 정보기술 요건 분석", "도출 요건 검토", "타당성 확인"],
          ["정보시스템 구조 및 요건 정의", "아키텍처 정의\n이행 연관성", "시스템 구조 정의\n요건 간 분석"],
          ["정보시스템 구조 및 요건 정의", "요건 기술서\n작성·검토", "상세 요건 문서\n문서 검토 수행"],
          ["정보시스템 구축사업 이행 방안 수립", "구축사업 계획\n분리발주 평가", "이행 계획 수립\n발주 가능성 검토"],
          ["정보시스템 구축사업 이행 방안 수립", "예산 수립\nRFP 작성", "사업 예산 산정\n제안요청서 작성"],
          ["정보시스템 구축사업 이행 방안 수립", "업체 선정 평가", "선정 지원 활동"],
        ],
      },
      {
        caption: "ISP, EA/ITA, ISMP 상세 비교",
        headers: ["구분", "ISP", "EA/ITA", "ISMP"],
        rows: [
          ["개념", "경영전략 지원\n정보화 전략\nIT 과제·로드맵", "아키텍처 총괄\n업무·IT 관계\n표현한 청사진", "특정 사업 분석\nRFP 마련 목적\n현황·요구 상세"],
          ["목적", "경영전략 연계\n신정보기술 반영", "비즈니스와 IT\n유연한 융합", "기능적·기술적\n요구사항 상세화"],
          ["범위", "전사·서비스\n부서 정보화전략", "비즈니스·데이터\n어플리케이션·기술", "단위 프로젝트\n또는 그 묶음"],
          ["주요 활동", "경영환경 분석\n정보기술 동향\n업무·구조 분석\nTo-Be 로드맵", "내외부 환경분석\nEA 목적·방향\n참조모델·원칙\n현행·목표 구축", "구축 범위·방향\n기능·기술 요건\n요건 상세기술\n이행계획·예산"],
          ["주요 산출물", "동향 분석 보고서\n업무 분석 보고서\nIT비전·로드맵", "EA 비전·원칙\n참조모델 BRM 등\nAS-IS/TO-BE", "RFP 작성\n정보시스템 예산\n산정 결과"],
        ],
      },
    ],
    notes: ["비교 개념도: EA ⊃ ISP(전략 방향 설정 → 현황분석(AS-IS) → TO-BE모델 → 이행계획수립) → 과제 도출 → 과제별 ISMP(사업방향 → AS-IS → TO-BE → 이행계획) → 구축 사업"],
  },
  {
    title: "TRL(Technology Readiness Level)",
    course: "MG",
    definition:
      "특정기술(재료, 부품, 소자, 시스템)의 성숙도 평가, 이종 기술 간의 성숙도 비교를 위한 체계적인 미터법, 해당 기술이 실제로 응용되어 쓰일 수 있기까지 어느 정도 준비가 되었는지를 확인하기 위한 정량화된 측정 지표",
    defShort: "특정기술 성숙도 평가, 이종 기술 간 성숙도 비교 위한 정량화된 측정 지표",
    lead:
      "기술 성숙도 9단계 잣대, TRL(Technology Readiness Level)",
    features: ["정량화된 지표", "이종 기술 비교", "단계적 성숙 판단"],
    keywords: ["기초연구 단계", "실험 단계", "시작품 단계", "실용화 단계", "양산 단계", "1~9"],
    tables: [
      {
        caption: "TRL 이행 단계",
        headers: ["TRL 이행 단계", "TRL 단계", "정의"],
        rows: [
          ["기초연구 단계", "TRL 1", "기초 이론·실험"],
          ["기초연구 단계", "TRL 2", "실용 개념 정립"],
          ["실험 단계", "TRL 3", "실험실 기본성능"],
          ["실험 단계", "TRL 4", "실험실 핵심성능"],
          ["시작품 단계", "TRL 5", "시작품 성능평가"],
          ["시작품 단계", "TRL 6", "파일럿 시작품"],
          ["실용화 단계", "TRL 7", "신뢰성 평가\n수요기업 평가"],
          ["실용화 단계", "TRL 8", "인증·표준화"],
          ["양산 단계", "TRL 9", "사업화 단계"],
        ],
      },
      {
        caption: "기술준비도 분석의 4W1H",
        headers: ["구분", "설명"],
        rows: [
          ["시간적 판단 기준(when)", "예산 최초 투입시점\n단계별 평가시점\n종료시점"],
          ["판단주체(who)", "해당분야 전문가"],
          ["평가환경(where)", "문헌조사(기초·응용·개발 단계)\n실험실평가(개발단계)\n현장평가(개발단계)"],
          ["평가대상(what)", "계획서 목표 대비 기술 수준/역량"],
          ["평가방법(how)", "계획 대비 실제 수행시간 차이\n가부(可否) 판단"],
        ],
      },
    ],
    notes: ["개념도: TRL 1~9 축 위 Resources 곡선 — basic research → applied research → technology development → prototype and system development. 참여 주체: academia·government labs(초기) → small businesses, SME·large businesses·private sector(후기), FUNDING과 ACTORS로 구분"],
  },
  {
    title: "기술수용 주기(Technology Adoption Life Cycle)",
    course: "MG",
    definition:
      "제품수명주기에 소비자 집단의 유형을 결합하여 신제품이 시장에 받아들여지는 과정을 소비자 관점에서 기술의 수용도를 표현한 생명주기",
    defShort: "신제품이 시장에 받아들여지는 과정의 소비자 관점 기술 수용도 생명주기",
    lead:
      "캐즘을 건너는 수용 곡선, 기술수용 주기",
    features: ["소비자 관점", "집단별 수용 시차", "캐즘 존재"],
    keywords: ["혁신 수용자", "선각 수용자", "전기다수 수용자", "후기다수 수용자", "지각 수용자", "캐즘"],
    tables: [
      {
        caption: "개념도 [혁선전후지]",
        headers: ["시점", "특징", "설명"],
        rows: [
          ["혁신수용자(innovators)", "기술애호가\n(Technology Enthusiast)", "기술 자체에 관심, 비싼 가격 지불"],
          ["선각수용자(early adopters)", "선각자\n(Visionary)", "기술 가치 알지만 가격에 둔감"],
          ["전기다수수용자(Early majority)", "실용주의자\n(Pragmatist)", "가격에 민감, 시장의 1/3 차지"],
          ["후기다수수용자(late majority)", "보수주의자\n(Conservatives)", "첨단기술 두려움\n유명상표기업 중시"],
          ["지각수용자(laggards)", "회의론자\n(Skeptics)", "기술 회의주의자\n신기술 적용 거부 및 방해"],
        ],
      },
      {
        caption: "캐즘(Chasm) 극복방안 — 선도계층 보급 이후 다수 대중 보급 이전 수요가 정체·단절되는 현상",
        headers: ["구분", "극복방안", "설명"],
        rows: [
          ["목표 고객 세분화", "특정 산업·직무·문제 해결이 중요한 고객 그룹 선정", "초기 주류시장 고수용 고객 공략"],
          ["명확한 가치제안", "고객이 쉽게 이해할 수 있는 핵심 가치 제공", "문제 해결·비즈니스 가치 강조"],
          ["신뢰확보", "고객 후기, 성공 사례 공유, 업계 리더의 추천 활용", "레퍼런스·사례 연구·인증·보증"],
          ["제품완성도 향상", "UI/UX 개선, 버그 수정, 고객 피드백 반영", "주류 진입, 안정성·사용성 개선"],
          ["가격전략 조정", "무료 체험, 구독 모델, 비용 절감 효과 강조", "비용 대비 가치, 적절한 가격 정책"],
          ["강력한 유통망 구축", "파트너십 체결, 대리점 활용, B2B 협업", "신뢰 채널 협력 시장 침투 가속"],
          ["고객 지원 및 서비스 강화", "고객 교육, 가이드 제공, 24/7 고객 지원", "쉬운 적응·문제 해결 지원 체계"],
          ["브랜드 인지도 확립", "컨퍼런스 참가, 미디어 활용, 온라인 광고", "마케팅·홍보·행사로 인지도 확대"],
        ],
      },
    ],
    notes: ["개념도 구간: 초기시장(Innovators 2.5%, Early Adopters 13.5%) — 캐즘(Chasm) — 주류시장(Early Majority 34%, Late Majority 34%) — 후기시장(Laggards)"],
  },
  {
    title: "IT 투자성과 평가",
    course: "MG",
    definition:
      "IT 투자에 대한 효과를 정량화, 계량화하여 화폐가치로 표현하는 방법",
    defShort: "IT 투자에 대한 효과를 정량화, 계량화하여 화폐가치로 표현하는 방법",
    lead:
      "IT 효과의 화폐가치 환산, IT 투자성과 평가",
    features: ["화폐가치 표현", "단계별 평가", "ROI 피드백 순환"],
    keywords: ["품질지표", "이용지표", "효과지표", "NPV", "ROI", "PP", "IRR", "평가", "시행추진", "성과측정", "분석"],
    tables: [
      {
        caption: "투자성과평가 지표 [투품이효]",
        headers: ["지표", "평가 주체/내용"],
        rows: [
          ["투자지표", "투자비용"],
          ["품질지표", "개발부서평가"],
          ["이용지표", "사용부서평가"],
          ["효과지표", "투자성과"],
        ],
      },
      {
        caption: "투자성과평가 상세",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["평가 단계", "사전평가", "준비, 정의(전략·위험요인)\n추정(기대효과)\n분석(전략과의 연계도)\n결론도출(투자 우선순위)"],
          ["평가 단계", "중간평가", "검증(정보화 사업 추진비용)\n분석(비용·위험요인 수치화)\n결론 도출(수정안 도출)"],
          ["평가 단계", "사후평가", "전략분석, 지표도출(CSF, KPI)\n측정(KPI성과 측정)\n분석(KPI수치 분석)\n결론도출(사업 개선안 설계)"],
          ["시행 추진 단계", "정보화 사업준비", "내부조직 구성, 추진체계 수립"],
          ["시행 추진 단계", "정보화 사업수행", "프로젝트 착수, 발주 및 계약\n실행 및 통제"],
          ["시행 추진 단계", "정보화 사업완료", "프로젝트 종료, 사업관리 평가"],
          ["성과 추진 단계", "BSC(Balanced Score Card)", "재무지표와 핵심성공요인(CSF)\n핵심성과지표(KPI) 관련 제반\n운영상 지표 결합 조직 효과성 측정"],
          ["분석 기법", "순현재가치(NPV)", "예정 순이익 현재 화폐가치 변환"],
          ["분석 기법", "투자수익률(ROI)", "자본 투자 대비 수익 비율"],
          ["분석 기법", "회수기간(Payback Period)", "누적 흐름 플러스 전환 시점까지"],
          ["분석 기법", "BCR(Benefit Cost Ratio)", "매출액 / 비용\n총편익·총비용 현재가치 환산\n1보다 크면 경제성 있음"],
        ],
      },
    ],
    notes: ["지표 흐름 개념도: 기획 → 투자 → 구축 → 업무/운영 → 효과 → 경영성과, 사전 ROI에서 사후 ROI로 Feedback 순환", "프레임워크: 평가단계(사전/중간/사후평가) × 시행추진단계(정보화 사업준비/수행/완료) × 성과측정 모델(BSC) × 분석기법(NPV, ROI, Payback Period, IRR)"],
  },
  {
    title: "기술 가치 평가",
    course: "MG",
    definition:
      "사업화 하려는 기술이나 사업화 된 기술이 그 사업을 통해 창출하는 경제적 가치를 기술시장에서 일반적으로 인정된 가치평가 원칙과 방법론에 입각하여 진행하는 평가",
    defShort: "기술이 사업으로 창출할 경제 가치를 공인 원칙·방법론으로 매기는 평가",
    lead: "기술의 경제적 가치 산정, 기술 가치 평가",
    features: ["경제적 가치 산정", "공인 방법론 기반", "사업화 전제 평가"],
    keywords: ["수익접근법", "원가접근법", "시장접근법"],
    tables: [
      {
        caption: "평가 절차",
        headers: ["단계", "구간", "활동"],
        rows: [
          ["사전검토", "평가 준비", "사업화 가능성\n평가인력·일정\n현장 실사·자료"],
          ["평가방법 선정", "평가 준비", "평가 목적·대상\n기간 따라 결정"],
          ["사업타당성 분석", "본 평가", "기술성·권리성\n시장성·사업성"],
          ["가치 산정", "본 평가", "경제적수명 추정\n매출 규모 추정\n현금흐름·NPV\n할인율 적용"],
          ["품질검수", "평가 완료", "품질관리 위원회\n품질평가 실적"],
        ],
      },
      {
        caption: "평가요인 분석 [기권시사]",
        headers: ["평가요인 분석", "설명"],
        rows: [
          ["기술성 분석", "경쟁기술 대비 차별성 비교우위"],
          ["권리성 분석", "권리 안정 유지 등록 가능성 검토"],
          ["시장성 분석", "대상기술 구현 제품과 목표시장\n시장진입·시장점유 가능성"],
          ["사업성 분석", "사업주체의 사업화 역량\n사업계획·사업추진 타당성\n대상기술 제품 경쟁력"],
        ],
      },
      {
        caption: "평가방법 [수원시]",
        headers: ["접근법", "방법"],
        rows: [
          ["수익 접근법", "기술요소법\n현금흐름법"],
          ["원가 접근법", "역사적 원가법\n재생산원가법"],
          ["시장 접근법", "거래사례 비교법\n로열티 공제법"],
        ],
      },
    ],
  },
  {
    title: "지식재산권",
    course: "MG",
    definition:
      "인간의 창조적 활동, 지식 활동, 또는 경험 등을 통한 무형의 지적 창작물 중에서 법으로 보호할 만한 가치가 있는 것들에 대해 부여된 권리",
    defShort: "무형의 지적 창작물 중 법으로 보호할 만한 가치가 있는 것에 부여된 권리",
    lead:
      "무형 창작물의 법적 보호, 지식재산권",
    features: ["무형 창작물 대상", "배타적 독점권", "보호기간 한정"],
    keywords: ["산업재산권", "저작권", "신지식재산권", "특허", "라이센스", "DRM", "암호화"],
    tables: [
      {
        caption: "분류 [산저신 특실디상 재인인 영데식반]",
        headers: ["분류", "세부 분류", "설명"],
        rows: [
          ["산업재산권", "특허권", "고도한 기술사상"],
          ["산업재산권", "실용신안권", "물품 형상·구조"],
          ["산업재산권", "디자인권", "시각적 미감"],
          ["산업재산권", "상표권", "상품 식별 표장"],
          ["저작권", "저작재산권", "복제·공연·배포"],
          ["저작권", "저작인격권", "공표·이름·동일성"],
          ["저작권", "저작인접권", "실연·음반·방송"],
          ["신지식재산권", "영업비밀", "경쟁우위 비밀"],
          ["신지식재산권", "데이터베이스권", "DB 구축 투자"],
          ["신지식재산권", "식물신품종권", "종자산업법 적용"],
          ["신지식재산권", "반도체배치설계권", "집적회로 배치법\n특허법 29조"],
        ],
      },
    ],
  },
  {
    title: "OKR",
    course: "MG",
    definition:
      "조직 차원에서 목표를 설정하고 그 결과를 추적할 수 있도록 도와주는 성과 중심 목표 설정, 실행 프레임워크",
    defShort: "목표를 설정하고 결과를 추적하는 성과 중심 목표 설정·실행 프레임워크",
    lead:
      "목표와 핵심결과의 정렬, OKR(Objectives, Key Results)",
    features: ["도전적 목표 설정", "Bottom-up 수립", "평가 비연동"],
    keywords: ["Objectives", "Key Results"],
    tables: [
      {
        caption: "OKR의 주요 항목",
        headers: ["구분", "세부", "설명"],
        rows: [
          ["원칙", "집중", "주요 과제 집중"],
          ["원칙", "정렬", "개인·기업 목표"],
          ["원칙", "추적", "상황 추적 관리"],
          ["원칙", "도전", "한계 시험 반복"],
          ["항목", "Objectives", "자신이 설정 목표"],
          ["항목", "Key Results", "달성 판단\n핵심 지표"],
          ["프로세스", "Define", "목표·KR 설정"],
          ["프로세스", "Measure", "진행 상태 측정"],
          ["프로세스", "Wrap-up", "1:1 개선 반영"],
        ],
      },
      {
        caption: "주요 미팅 및 원칙",
        headers: ["항목", "OKR", "설명"],
        rows: [
          ["주요 미팅", "Company Meeting", "당기 KR's 결과 공유\n다음 분기 KR's 발표"],
          ["주요 미팅", "STAFF Meeting", "당기 진행상황 모니터링·평가\n다음 분기 KR's 임시버전 개발"],
          ["주요 미팅", "One-on-One Meeting", "Bottom-up OKR 수립·진행 점검\n장애요소 식별"],
          ["원칙", "최대 5개 목표\n4개 성과지표", "최대 5개 목표(Objectives)\n목표별 최대 4개 Key results"],
          ["원칙", "Bottom-up 60%", "60% 목표는 Bottom-up으로 설정"],
          ["원칙", "상호합의", "Top-down 일방 아닌 상호 합의 목표"],
          ["원칙", "60%~70% 달성목표", "60%~70% 달성 목표\n40% 미만 BAD"],
          ["원칙", "평가 연동 금지", "평가와 연동하지 않도록 함"],
        ],
      },
      {
        caption: "OKR과 MBO 비교",
        headers: ["항목", "OKR", "MBO"],
        rows: [
          ["시작 시기", "1970년대\n인텔", "1950년대\n피터드러커"],
          ["주요 지표", "KR(Key Results)", "KPIs\nS.M.A.R.T."],
          ["목표 특성", "정성적\n(Moon-Shot)", "정량적\n(Roof-Shot)"],
          ["적용 방식", "Bottom-up", "Top-down"],
          ["성과 관리", "간접적", "직접적"],
        ],
      },
    ],
  },
  {
    title: "BSC (Balanced Scorecard), IT-BSC (IT-Balanced Scorecard)",
    course: "MG",
    definition:
      "BSC: 재무적 관점과 비 재무적 관점으로 성과를 평가하는 기법 / IT-BSC: IT의 가치 및 성과를 측정하기 위해 균형성과표를 IT 성과 평가에 적용하도록 변화한 IT 투자에 대한 성과 평가 기법",
    defShort: "재무적·비재무적 관점 성과 평가 BSC를 IT 성과 평가에 적용한 기법",
    lead:
      "균형 잡힌 성과의 잣대, BSC와 IT-BSC",
    features: ["재무·비재무 균형", "관점별 지표 관리", "IT 가치 측정"],
    keywords: ["BSC: 재고내학", "IT-BSC: 기사운미"],
    tables: [
      {
        caption: "BSC & IT-BSC [재고내학 기사운미]",
        headers: ["IT-BSC", "BSC", "주요평가지표", "세부내역", "내용"],
        rows: [
          ["기업 공헌도", "재무 관점", "IT 비용관리\n신규 사업 가치\nIT 기능 사업가치", "인력당 IT 비용\n위험 고려 평가\n개발 역량 비율", "IT 투자 성과\n사업가치 창출\n재무 관점 측정"],
          ["사용자 관점", "고객 관점", "IT 서비스 공급자\n사용자 파트너쉽\n사용자 만족도", "관리되는 SW 비율\n운영위 소집 빈도\n만족도 지표", "사용자의 IT\n평가 측정\n고객 관점 확인"],
          ["운영 프로세스", "내부 프로세스", "효율적 IT 운영\n문제 해결 능력\nIT 인력 관리", "요구 대응시간\n문제해결 평균\n인력 만족도", "개발·구축\n프로세스\n효율성 측정"],
          ["미래지향", "학습과 성장", "IT 인력 전문지식\n신기술 연구", "인력별 실무연수\n연구 예산 비율", "미래 IT 서비스\n인적·기술 지원"],
        ],
      },
      {
        caption: "BSC와 IT-BSC 비교",
        headers: ["구분", "BSC", "IT-BSC"],
        rows: [
          ["활동", "경영 거버넌스", "IT 거버넌스"],
          ["목표", "경영목표 달성", "IT 가치전달"],
          ["관점", "재무·고객\n프로세스·학습", "공헌도·사용자\n운영·미래지향"],
          ["용도", "기업 성과 측정", "정보화 투자 평가"],
        ],
      },
    ],
  },
  {
    title: "ESG 경영",
    course: "MG",
    definition:
      "환경(E), 사회(S), 지배구조(G) 요소를 기업 경영에 반영하여 단기적 성과 뿐만 아니라 장기적 기업 가치를 높여 지속 가능을 높이는 경영 방식",
    defShort: "환경·사회·지배구조를 경영에 반영해 지속 가능성을 높이는 경영 방식",
    lead:
      "지속가능 경영의 3요소, ESG 경영",
    features: ["비재무적 성과", "장기적 기업 가치", "ESG 정보 공개"],
    keywords: ["지속 가능", "환경(Environmental)", "사회(Social)", "지배구조(Governance)"],
    tables: [
      {
        caption: "ESG 구성요소 [환사지]",
        headers: ["구분", "요소"],
        rows: [
          ["환경(Environment)", "기후변화와 탄소 배출\n대기 및 수질 오염\n생물 다양성·산림 파괴\n에너지 효율·폐기물 관리"],
          ["환경(Environment)", "물 부족\n원자재 사용(고갈·천연 자원)\n책임 있는 구매 및 조달"],
          ["사회(Social)", "고객 만족\n데이터 및 개인정보 보호\n성 평등 및 다양성\n인재 육성"],
          ["사회(Social)", "지역 사회 관계·인권 보호\n근로 기준·근로자 안전\n공급망 관리"],
          ["지배구조(Governance)", "이사회 구성·감사위원회 구성\n경영자 보상·로비 활동\n정치 헌금·내부고발제도 운영"],
          ["지배구조(Governance)", "회계 기준 준수·공정 경쟁\n반부패 및 컴플라이언스"],
        ],
      },
      {
        caption: "ESG 4법 주요 내용과 재계의 우려 사항",
        headers: ["법", "주요 내용", "우려"],
        rows: [
          ["국민연금법", "지속가능성 확보", "수익 추구 이탈"],
          ["국가재정법", "ESG 지침 준수\n기금 운용 평가", "공시 기준 부재\n평가 기준 부재"],
          ["조달사업법", "ESG 반영 의무", "객관적 기준 훼손"],
          ["공공기관운영법", "경영평가 ESG", "수익성 포기 우려"],
        ],
      },
      {
        caption: "정보 공개 원칙과 목표",
        headers: ["구분", "내용"],
        rows: [
          ["ESG 정보 공개 원칙", "정확성·명확성\n비교가능성·균형\n검증가능성·적시성"],
          ["ESG의 목표", "기업가치제고\n자본조달목적\n지속가능경영"],
        ],
      },
    ],
    notes: ["개념도: E 환경(기후변화·에너지, 폐기물·대기오염, 해양 환경·토양) + S 사회(인권·노동, 산업안전보건, 사회공헌) + G 지배구조(컴플라이언스, 윤리경영, 감사기구) → 비재무적 성과 → 기업생존전략 → 지속가능경영"],
  },
  {
    title: "디자인 씽킹(Design Thinking)",
    course: "MG",
    definition:
      "공감적 관찰(Empathic Observation)을 기반으로 문제를 해석하고 사고(Thinking)를 디자인(Design)하여 문제를 창의적으로 해결하는 사용자 중심 문제 해결 방법",
    defShort: "공감적 관찰로 문제 해석, 사고를 디자인하는 사용자 중심 문제 해결 방법",
    lead:
      "공감에서 시작하는 혁신, 디자인 씽킹(Design Thinking)",
    features: ["공감적 관찰 기반", "확산·수렴 사고", "프로토타입 검증"],
    keywords: ["공감", "창의적 문제 해결 사고", "사용자 중심 문제 해결 방법"],
    tables: [
      {
        caption: "절차 [공정아프테]",
        headers: ["구분", "프로세스", "설명", "기법"],
        rows: [
          ["Inspiration(영감)", "공감(Empathize)", "문제 발견·공감\nNeeds 파악", "설문·인터뷰\n관찰, Shadowing"],
          ["Inspiration(영감)", "문제 정의(Define)", "문제점 파악\n우선순위화\n페르소나 기반", "요구사항 정의\n고객여정지도\n페르소나"],
          ["Ideation(아이디어 도출)", "아이디어 도출(Ideate)", "아이디어 발산\n우선순위화\n확산·집중 사고", "브레인스토밍\n아이디어 스케치\n시각화"],
          ["Implementation(실행)", "프로토타이핑(Prototype)", "아이디어 시각화\n핵심 기능 구현", "스토리보드, MVP"],
          ["Implementation(실행)", "테스트(Test)", "프로토타입 검증\n피드백·회고", "사용성 테스트\nRole play"],
        ],
      },
      {
        caption: "3I모델 — 혁신전략 계획 시 사용하는 전략적 모델",
        headers: ["3I 모델", "디자인씽킹과 연관성", "주요 산출물"],
        rows: [
          ["Innovation(혁신)", "Ideate 단계\n(아이디어 도출)", "새 접근 방식 탐색\n사용자 중심 진행\n틀 벗어난 해결책"],
          ["Integration(통합)", "프로토타입 단계\n테스트 단계", "조직 문화 적용\n혁신 일치 변환"],
          ["Impact(영향)", "사용자 피드백\n순환 체계 구성", "실질 변화 측정\n지속가능성 평가"],
        ],
      },
    ],
    notes: ["절차 3단계 묶음: 1단계 Understanding(현상태 문제 정의하기: Empathize·Define) → 2단계 Create(창의적인 통합 사고로 더 좋은 상태로 변화시키기: Ideate·Prototype·Test) → 3단계 Feedback(다시 실행하기)", "더블 다이아몬드 모델: 서비스 디자인에서 문제를 해결하기 위해 디자이너들이 일하는 방식을 두 개의 다이아몬드 형태로 체계화한 방법론 — 일반적 질문 → [확산]문제 정의·[수렴]문제 공감 탐색 → 특정 문제·기회 → [확산]해결책 개발·[수렴]해결책 실행 → 솔루션 (무엇·왜 / 어떻게)"],
  },
  {
    title: "서비타이제이션(Servitization)",
    course: "MG",
    definition:
      "기존 제품 판매에서 제품 서비스를 판매하는 시스템의 변화를 통해 부가가치를 창출하는 기업의 경쟁력 개선에 대한 혁신 및 기업 전략",
    defShort: "제품 서비스를 판매하는 시스템의 변화로 부가가치를 창출하는 기업 전략",
    lead: "제품에서 서비스로의 전환, 서비타이제이션(Servitization)",
    features: ["제품·서비스 융합", "부가가치 중심", "제조업 서비스 전환"],
    keywords: ["Product Servitization", "Service Productization", "Product Service System"],
    tables: [
      {
        caption: "유형 [서제시]",
        headers: ["구분", "설명", "적용기술"],
        rows: [
          ["Product Servitization(제품의 서비스화)", "제품 서비스 결합\n서비스 형태 제공", "Platform, AI, Bigdata\nIoT, IIoT, Mobile"],
          ["Service Productization(서비스의 제품화)", "서비스 표준화\n자동화 대량생산", "Platform, AI, Bigdata\nIoT, IIoT, Mobile"],
          ["PSS(Product Service System)", "제품 서비스 통합\n요구 공동 해결", "Platform, AI, Bigdata\nIoT, IIoT, Mobile"],
        ],
      },
    ],
    notes: ["등장배경: 기존 Value Chain(R&D → Design → Procurement → Manufacturing → Distribution → Marketing·A/S)의 스마일 커브에서 제조 구간 가치가 낮아짐 — 제조업을 기반으로 새로운 서비스업으로 전환을 시도, Products as a Service로 제조업의 패러다임 시프트", "추진전략: 제품(Product) —서비스화→ 제품&서비스 융합(Servitization) ←제품화— 서비스(Service)"],
  },
  {
    title: "프로토콜 경제(Protocol Economy)",
    course: "MG",
    definition:
      "블록체인 기술을 기반으로 개인 간 프로토콜(약속)을 정해 거래하는 생태계로서 탈중앙화와 탈독점화를 통해 사용자 간의 주도적 거래가 가능한 공정한 플랫폼 경제",
    defShort: "블록체인 기반 프로토콜 거래, 탈중앙화·탈독점화 공정한 플랫폼 경제",
    lead:
      "탈중앙 공정 거래 생태계, 프로토콜 경제(Protocol Economy)",
    features: ["개별성", "투명성", "공정성"],
    keywords: ["블록체인", "탈중앙", "탈독점", "공정한 분배"],
    tables: [
      {
        caption: "프로토콜 경제 유형 [서제시]",
        headers: ["구분", "프로토콜경제 (Protocol Economy)"],
        rows: [
          ["핵심요소", "탈중앙화·탈독점화\n공정한 분배(분권화)\n사용자 간 주도적 거래 도모\n공정 플랫폼 경제"],
          ["주요특징", "개별성: 개인 간 중개자 없는 거래\n투명성: 정보 공개 거래 신뢰 형성\n공정성: 공정한 기회·인센티브"],
          ["주요서비스 분류", "플랫폼 노동자와의 상생모델\n전통 산업과의 상생모델\n공유경제 활성화 모델\n블록체인 기반 기술 관련 모델"],
          ["적용사례", "디지털 자산거래\n마이데이터 사업\nBaaS 서비스형 블록체인\nDe-Fi사업"],
        ],
      },
    ],
    notes: ["개념도: 플랫폼 경제(플랫폼 사업자가 수수료를 독식, 참여자는 막대한 노동) vs 프로토콜 경제(블록체인 기술 기반 상생, 공정한 댓가) — 생산자 ↔ [블록체인] ↔ 소비자가 공정한 대가를 주고받는 상생기반 생태계 구조"],
  },
  {
    title: "의도 경제(Intention Economy)",
    course: "MG",
    definition:
      "소비자가 자신의 필요나 구매 의도(intention)를 명확히 표현하고 기업들이 그 의도에 맞춰 반응하는 방식의 경제 활동 시스템",
    defShort: "소비자가 구매 의도를 표현하고 기업이 맞춰 반응하는 경제 활동 시스템",
    lead: "구매 의도 기반 경제 활동, 의도 경제(Intention Economy)",
    features: ["능동적 의도 표현", "LLM 의도 인식", "실질 행동 유도"],
    keywords: ["의도", "주목경제", "LLM", "의도 인식/분류 모델", "인텐토노미"],
    tables: [
      {
        caption: "주목 경제와 의도 경제 비교",
        headers: ["비교항목", "주목 경제(Attention Economy)", "의도 경제(Intention Economy)"],
        rows: [
          ["개념", "노출로 시선 유인", "의도 파악 후 대응"],
          ["목표", "장시간 노출 유도", "실질 행동 유도"],
          ["기업의 소비자 인식", "콘텐츠 수동 시청\n수동적 소비자", "욕구 직접 표현\n능동적 소비자"],
          ["기업 전략", "자극적 콘텐츠\n깔때기 분석", "개인 맞춤·추천\n의도 기반 마케팅"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["대화", "프롬프트(Prompt)", "사용자·시스템 제공 입력\nLLM에 특정 작업 수행 요청\n질문, 명령, 또는 요청"],
          ["대화", "대규모 언어모델(LLM, Large Language Model)", "인간 언어 텍스트·음성 이해·생성"],
          ["의도 분석", "의도 인식/분류 모델(Intention Detection Model)", "발화·행동에서 의도 파악 모델"],
          ["의도 분석", "인텐토노미(Intentonomy)", "2021년 메타(Meta) 발표\n인간 의도 이해 위한 데이터 세트"],
          ["추천 시스템", "컨텐츠 기반 추천 시스템", "과거 선호 제품 기반 유사 상품 추천"],
          ["추천 시스템", "협업 필터링(Collaborative Filtering)", "유사 성향 사용자 선택 아이템 추천"],
        ],
      },
    ],
    notes: ["개념도: 사용자 → prompts → Mobile/Web Apps(End User Apps) → LLM API → LLM → Intention Detection Model ↔ Product Shopping data·Intentonomy — \"러닝이 편안하려면?\" 물으면 \"A 운동화 어떠세요?\"로 응답"],
  },
  {
    title: "그로스 해킹(Growth hacking)",
    course: "MG",
    definition:
      "사업 전반에 데이터 기반하에 검증, 추적, 확장 가능한 방법으로 사업 성장을 이루는 마케팅 전략",
    defShort: "데이터 기반 검증·추적·확장 가능한 방법으로 성장하는 마케팅 전략",
    lead: "데이터 기반 성장 마케팅, 그로스 해킹(Growth hacking)",
    features: ["데이터 기반 검증", "실험 반복 순환", "마케팅·기술 결합"],
    keywords: ["성장", "해킹", "기술적 요소 결합", "데이터 기반", "AARRR 기법", "Cohort 분석", "A/B 테스트"],
    tables: [
      {
        caption: "기법 [A코퍼]",
        headers: ["구분", "기법", "설명"],
        rows: [
          ["실험", "A/B Test", "A·B 방식 시험 우수 결과 선택"],
          ["분석", "Cohort analysis", "동일 특성 그룹 시간별 성과 비교"],
          ["분석", "Funnel Analysis", "잔존 사용자 비율 주요 단계별 측정"],
        ],
      },
      {
        caption: "그로스 해킹 단계 방법론 (AARRR)",
        headers: ["단계", "설명"],
        rows: [
          ["Acquisition(획득)", "신규 고객이 생기는 것"],
          ["Activation(활성화)", "고객이 처음 '주요 기능' 사용"],
          ["Revenue(매출)", "고객이 서비스에 금액을 지불함"],
          ["Retention(리텐션)", "지속적 서비스 이용·제품 재구매"],
          ["Referral(추천)", "이용 고객이 만족하여 주변에 추천"],
        ],
      },
    ],
    notes: ["절차: 그로스 해킹 프로세스 4단계 순환 — 데이터 분석 → 아이디어 도출 → 우선순위 결정 → 실험"],
  },
  {
    title: "시빅 해킹(Civic Hacking)",
    course: "MG",
    definition:
      "시민이 협업을 바탕으로 공공데이터와 정보통신기술(ICT)을 활용해 사회적 이슈나 정부 시스템 등을 개선하는 사회운동",
    defShort: "시민이 협업해 공공데이터·ICT 활용, 사회 이슈 개선하는 사회운동",
    lead:
      "시민이 만드는 공공 혁신, 시빅 해킹(Civic Hacking)",
    features: ["시민 자발 참여", "공공데이터 기반", "사회운동 성격"],
    keywords: ["시민 협업", "Web 2.0", "공공 데이터", "공공 API", "시민 참여"],
    tables: [
      {
        caption: "참여주체",
        headers: ["주체", "설명"],
        rows: [
          ["개발자", "공공데이터 활용 OpenAPI\n오픈소스 도구 시민 참여 도구"],
          ["기획자", "사회 문제 파악 아이디어 구상\n의사소통 수행 개발 디자인 소통"],
          ["디자이너", "UI/UX 구성 시민 이해 용이"],
          ["일반시민", "참여·피드백 집단지성 확산"],
        ],
      },
      {
        caption: "시빅 해킹 기술요소",
        headers: ["구분", "기술요소", "설명", "사례"],
        rows: [
          ["프로그래머", "Open Source", "자유 SW 가이드\n기반 SW·HW", "오픈소스 SW\n오픈소스 HW"],
          ["프로그래머", "Web 2.0", "개방·참여·공유\n쌍방향 소통 웹", "CSS, HTML5\nAJAX, SNS, Blog"],
          ["디자이너", "UI / UX Design", "웹 표준 준수\nUI·UX 디자인", "NUI(Natural)\nOUI(Organic)"],
          ["디자이너", "설계 원칙", "동등 접근·이용\n보장 원칙", "웹 접근성 원칙\n앱 접근성 원칙"],
          ["시민", "공공 데이터", "법령 목적으로\n공개하는 정보", "관측 정보\n기록 정보"],
          ["시민", "공공 API", "누구나 쓸 수 있게\n공개된 API", "시민 정보 API\n국토 교통 API"],
        ],
      },
    ],
    notes: ["개념도: 사회적 이슈/문제(원인/동기) + 시민의 자발적 참여 → 시빅 해킹(Civic Hacking) → 삶의 질 향상(기대효과). 요소기술: 공공데이터, OpenAPI, 오픈소스"],
  },
  // ── 6주차 보안(SC) ──
  {
    title: "암호화(Encryption)",
    course: "SC",
    definition:
      "알고리즘과 암호화 키(key)를 이용해 평문(Plain text) 형태의 메시지를 암호문(Cipher text)으로 변환하는 과정(기술)",
    defShort: "알고리즘과 암호화 키를 이용해 평문 메시지를 암호문으로 변환하는 기술",
    lead: "평문의 암호문 변환 과정, 암호화",
    features: ["알고리즘·키 기반", "기밀성 확보", "키 비밀성 의존"],
    keywords: ["평문", "암호문", "암호키", "복호화키", "알고리즘", "목적(인증·기밀성·무결성·부인방지)", "스트림/블록 암호화", "대칭키/비대칭키"],
    tables: [
      {
        caption: "암호화(Encryption) 방식과 목적",
        headers: ["암호방식", "기밀성(Confidentiality)", "인증(Authentication)", "무결성(Integrity)", "키 관리", "주요 알고리즘"],
        rows: [
          ["대칭키 암호화", "○", "× (별도 인증)", "× (MAC 필요)", "키 공유 필요", "AES, DES, Blowfish"],
          ["비대칭키 암호화", "○", "○ (전자서명)", "○ (전자서명)", "공유 불필요", "RSA, ECC"],
          ["단방향 암호화 (해시)", "×", "○ (서명 결합)", "○", "키 없음", "SHA-256, bcrypt"],
        ],
      },
      {
        caption: "암호화(Encryption)의 종류",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["정보단위", "스트림 암호", "1비트 혹은 1바이트씩 암호화\n속도 빠르고 에러 파급 적음"],
          ["정보단위", "블록 암호", "단위 블록으로 나눠 암호화\n혼돈성, 추가·변경 어려움"],
          ["키 형태", "비밀키 암호화(대칭키)", "송·수신자 동일한 비밀키 공유\n구현 용이, 빠른 암호화"],
          ["키 형태", "공개키 암호화(비대칭키)", "공개키-비밀키 한 쌍 보유\n상대 공개키 암호화, 비밀키 복원\n전자서명"],
          ["암호화 기반기술", "SPN", "대체순열구조, 전치·치환 이용\n128비트 4X4 행렬 암호화\n적용: AES, ARIA"],
          ["암호화 기반기술", "Feistel(피스텔)", "N/2씩 둘로 나눠 R번 라운드 반복\n이전 블록 암호문·평문 XOR\n적용: DES, SEED"],
          ["암호화 기반기술", "인수분해", "큰 소수 곱 n에서 p, q 추출 어려움\n적용: RSA"],
          ["암호화 기반기술", "이산대수", "이산대수 계산 어렵고 역함수 빠름\n적용: Diffie-Hellman, DSA"],
          ["암호화 기반기술", "해시함수", "임의 길이 메시지를 고정 길이 출력\n단방향, 역상 저항성\n적용: MD-5, SHA-1, SHA-2"],
        ],
      },
    ],
    notes: [
      "암호화의 목적 - 인증, 기밀성, 무결성, 부인방지",
      "개념도: 평문 →(알고리즘+암호키) 암호문 →(알고리즘+복호화키) 평문",
    ],
  },
  {
    title: "Shannon의 암호 설계 원칙",
    course: "SC",
    definition: "혼돈과 확산의 과정을 혼합하면 안전한 암호 시스템을 구성할 수 있다는 설계 원칙",
    defShort: "혼돈과 확산을 혼합하면 안전한 암호 시스템을 구성할 수 있다는 설계 원칙",
    lead: "혼돈과 확산의 결합, Shannon의 암호 설계 원칙",
    features: ["혼돈·확산 결합", "통계적 분석 차단", "키 추적 곤란"],
    keywords: ["혼돈(대치)", "확산(전치)", "[대전압불확] 대치", "전치(치환)", "압축", "블록", "확장"],
    tables: [
      {
        caption: "혼돈(Confusion)과 확산(Diffusion)의 비교",
        headers: ["비교", "혼돈(Confusion)", "확산(Diffusion)"],
        rows: [
          ["정의", "통계성 난해화\n상관관계 은닉", "평문 통계 분산\n전체 비트 영향"],
          ["목적", "키 영향 확대\n키 추적 곤란", "1비트 파급\n평문 관계 은닉"],
          ["구현 기법", "대치 S-Box", "치환·전치"],
          ["사용 예", "AES S박스", "DES 전치"],
        ],
      },
      {
        caption: "암호화 기법 [대전압불확]",
        headers: ["기법", "예시", "설명"],
        rows: [
          ["전치(치환)(Transposition)", "레일 펜스 암호", "위치만 재배열"],
          ["대치(Substitution)", "카이사르 암호", "문자 값 치환"],
          ["압축(Compaction)", "Hash 함수", "크기 감소 보존"],
          ["확장(Expansion)", "DES의\n확장 순열", "길이 증가\n변환 수행"],
          ["블록(Blocking)", "AES/DES", "일정 크기 처리"],
        ],
      },
    ],
    notes: ["Substitution과 Transposition을 통해 Shannon의 암호 설계 원칙 구현"],
  },
  {
    title: "해시 함수의 안전성",
    course: "SC",
    definition:
      "(해시함수) 가변길이의 Data를 입력으로 받아 고정길이의 Message Digest를 출력으로 하는 단방향 암호 알고리즘 — 이 해시함수가 가져야 하는 속성(성질, 특징)이 해시 함수의 안전성",
    defShort: "가변길이 입력 고정길이 Message Digest 단방향 해시 속성",
    lead: "해시의 3대 저항성, 해시 함수의 안전성",
    features: ["역상 저항성", "제2역상 저항성", "충돌 저항성"],
    keywords: ["역상 저항성", "제2역상 저항성", "충돌 저항성", "제1역상 저항 공격", "제2역상 저항 공격"],
    tables: [
      {
        caption: "암호학적 해시함수가 가져야 하는 속성(성질, 특징)",
        headers: ["성질(속성)", "특징", "설명"],
        rows: [
          ["역상 저항성", "일방향 함수", "임의 출력의 입력 계산상 불가능\nH(X)=Y 만족 X 값 찾기 힘듦\n제1역상저항공격 대상"],
          ["제2역상 저항성", "약한 충돌 저항성", "주어진 입력과 같은 해시 입력 곤란\nH(X)=H(X')인 X' 찾기 힘듦\n제2역상저항공격 대상"],
          ["충돌 저항성", "강한 충돌 저항성", "같은 해시값 내는 두 입력 불가능\nH(X)=H(X')인 X, X' 찾기 힘듦"],
        ],
      },
      {
        caption: "역상 공격",
        headers: ["성질(속성)", "특징"],
        rows: [
          ["제 1역상 공격", "해시 값을 출력하는 입력값 탐색\n예) 5를 출력하는 입력값 찾기"],
          ["제 2역상 공격", "같은 해시값 출력 다른 입력값 탐색\n예) 12 아닌 다른 입력으로 5 출력"],
        ],
      },
    ],
    notes: [
      "해시함수 정의: 가변길이의 Data를 입력으로 받아 고정길이의 Message Digest를 출력으로 하는 단방향 암호 알고리즘",
      "해시함수 개념도: '안녕하세요'와 '안녕하세여' — 한 글자만 달라도 전혀 다른 다이제스트 출력",
    ],
  },
  {
    title: "해시 솔트(Salt)와 키 스트레칭(Key Stretching)",
    course: "SC",
    definition:
      "솔트: 해시함수 입력 값에 임의의 문자열을 추가하여 다이제스트를 생성하는 기법 / 키 스트레칭: 해시 함수 결과 값을 다시 입력 값으로 실행하여, 해시 함수를 반복 실행하여 다이제스트를 생성하는 기법",
    defShort: "임의의 문자열 추가와 해시 함수 반복 실행으로 다이제스트 생성하는 기법",
    defPair: [
      {
        name: "해시 솔트(Salt)",
        lead: "레인보우 테이블 대응 기법",
        def: "해시함수 입력 값에 임의의 문자열을 추가해 다이제스트를 생성하는 기법",
        features: ["임의 문자열 추가", "사용자별 고유 값", "Rainbow table 대응"],
      },
      {
        name: "키 스트레칭(Key Stretching)",
        lead: "무차별 대입 지연 기법",
        def: "해시 결과 값을 다시 입력으로 해시 함수 반복 실행해 다이제스트 생성 기법",
        features: ["결과 재입력 반복", "연산 시간 증가", "Brute force 대응"],
      },
    ],
    lead: "패스워드 해시 강화 기법, 솔트와 키 스트레칭",
    features: ["임의 문자열 추가", "해시 반복 실행", "단방향 해시 강화"],
    keywords: ["임의의 문자열", "해시 함수 반복 실행", "해시", "Salt", "Iteration Count", "단방향 암호화", "Brute force attack", "Rainbow table attack"],
    tables: [
      {
        caption: "해시 솔트(Salt)의 메커니즘",
        headers: ["절차", "설명"],
        rows: [
          ["① 사용자 Data 입력", "Password와 같은 보안성\n강화가 필요한\nData에 적용"],
          ["② 임의의 Salt 값 생성", "랜덤한 값의 Salt\n값을 Data에\n추가하여 Message Digest\n생성"],
          ["③ 변경된 Digest 값 생성", "Message Digest 값과 Salt\n값을 맵핑하여 DB\n저장"],
        ],
      },
      {
        caption: "해시 키 스트레칭(Key Stretching)의 메커니즘",
        headers: ["절차", "설명"],
        rows: [
          ["① 사용자 Data 입력", "Password와 같은 보안성\n강화가 필요한\nData에 적용"],
          ["② 임의의 Salt 값 생성", "랜덤한 값의 Salt\n값을 Data에\n추가하여 Message Digest\n생성"],
          ["③ Hash N번 반복", "Message Digest 값과 Salt를\n다시 Hash\n입력으로 N번\n반복"],
        ],
      },
      {
        caption: "해시 솔트(Salt)와 페퍼(Pepper)의 비교",
        headers: ["비교", "솔트(Salt)", "페퍼(Pepper)"],
        rows: [
          ["정의", "임의 값 추가\n해시 함수 수행", "동일 값 추가\n해시 함수 수행"],
          ["목적", "동일 입력 구분", "보안 강도 강화"],
          ["추가 문자", "사용자별 난수\n고유 값 적용", "전체 동일 값\n모든 사용자 동일"],
          ["저장", "평문 저장 가능", "별도 암호화 저장"],
        ],
      },
    ],
    notes: [
      "해시함수 문제점(레인보우 테이블 해시값 비교, Brute force Attack 무작위입력) → 해결방안(임의값추가 = 해시솔트, 해싱반복 = 키 스트레칭)",
      "입력한 패스워드를 동일한 횟수(N번)만큼 해시(Hash) 수행 후 입력한 패스워드의 일치 여부를 확인",
    ],
  },
  {
    title: "디피-헬만 알고리즘(Diffie-Hellman Algorithm)",
    course: "SC",
    definition:
      "송신자와 수신자가 암호화되지 않은 공개망을 통해 안전하게 대칭키를 공유할 수 있는 암호화 키 교환 알고리즘",
    defShort: "공개망을 통해 안전하게 대칭키를 공유할 수 있는 암호화 키 교환 알고리즘",
    lead: "공개망 대칭키 교환, 디피-헬만 알고리즘",
    features: ["공개망 대칭키 공유", "이산대수 난제 기반", "키 직접 미전송"],
    keywords: ["공개망", "이산대수의 어려움", "g^xy mod p", "대칭키"],
    tables: [
      {
        caption: "디피-헬먼 키 교환(Diffie-Hellman key exchange) 절차",
        headers: ["절차", "생성키", "설명"],
        rows: [
          ["① 사전 공개 값 공유", "큰 소수 p\n원시근 g", "경우의 수 증대\n1~p-1 생성"],
          ["② 각자의 비공개 정수(키) 선정", "x·y 임의 정수\nR1 = g^x mod p\nR2 = g^y mod p", "각자 임의 선택\nR1·R2 산출"],
          ["③ 공개키 공유", "R1·R2 교환", "공개 값 상호 전송"],
          ["④ 비공개 정수를 이용하여 재연산", "K1 = (R2)^x mod p\nK2 = (R1)^y mod p", "상대 R 사용\n비밀키 계산"],
          ["⑤ 공통의 비밀키 공유", "K1=K2\ng^xy 도출", "동일 비밀키\n대칭키로 활용"],
        ],
      },
    ],
    notes: [
      "개념도 절차: ① 공개값 p와 g를 공유 → ② 각자의 비밀 정수 x, y를 이용하여 연산 → ③ 연산결과 공개키 R1과 R2를 상호 공유 → ④ 각자의 비밀값 x, y와 R1, R2를 이용하여 연산 → ⑤ 비밀키 공유 K = g^xy mod p",
    ],
  },
  {
    title: "블록 암호화(Block Cipher)",
    course: "SC",
    definition:
      "평문을 일정한 블록 단위로 분할하여 각 블록마다 암호화 과정을 수행하여 고정된 크기의 블록 단위의 암호문을 생성하는 암호화",
    defShort: "평문을 일정한 블록 단위로 분할해 각 블록마다 암호화 수행하는 암호화",
    lead: "블록 단위 분할의 암호문, 블록 암호화",
    features: ["SW 구현 용이", "블록 단위 암호화", "혼돈·확산 적용"],
    keywords: ["ECB", "CBC", "PCBC", "CFB", "OFB", "CTR", "IV(초기화 벡터)"],
    tables: [
      {
        caption: "블록 암호화 구조와 알고리즘",
        headers: ["구조", "적용 알고리즘"],
        rows: [
          ["Feistel 구조", "DES, 3DES"],
          ["SPN 구조", "AES"],
          ["기타 구조", "IDEA, Blowfish, RC6"],
        ],
      },
      {
        caption: "블록 암호화 운영 모드",
        headers: ["구분", "운영모드", "설명"],
        rows: [
          ["블록 독립", "ECB (Electronic Code Book)", "1:1 대응 블록 단위 암호\n고속·병렬 처리 기밀성 가장 낮음"],
          ["블록 연쇄", "CBC (Cipher Block Chaining)", "초기 벡터 IV 첫 블록 XOR\n블록 체인화 이전 결과 연결"],
          ["블록 연쇄", "PCBC (Propagating CBC)", "이중 XOR 평문 XOR 추가\n연쇄 암호화 복호 복잡도 증가"],
          ["스트림형", "CFB (Cipher Feedback)", "IV 암호화 IV만 암호 처리\n자기 동기화 스트림 암호 변환"],
          ["스트림형", "OFB (Output Feedback)", "키 스트림 생성 IV 암호화 활용\nXOR 후처리 암·복호 동일"],
          ["스트림형", "CTR (Counter)", "카운터 사용 패딩 불필요\n키 스트림 생성 사전 준비 가능"],
        ],
      },
    ],
    notes: [
      "블록 암호 특징: 가. 소프트웨어 구현 용이 나. Block 단위 암호화 다. Confusion + Diffusion 라. S-BOX, P-BOX",
      "운영 모드 진화(개념도): ECB → CBC → CFB → CTR, 분기로 PCBC·OFB — ECB는 결정적 암호, CFB는 확률적 암호",
      "초기화 벡터(Initialization Vector, IV): 임의의 2진 데이터로 IV를 사용하면 동일한 평문(plaintext)이라도 항상 다른 암호문(ciphertext)으로 암호화",
      "개념도: 45bits original message → 16bits 단위 분할(마지막 13bits는 3bit 패딩 추가) → Block Cipher Encryption(Key·IV) → Cipher text",
    ],
  },
  {
    title: "암호학적 보안 강도(Security Strength)",
    course: "SC",
    definition:
      "특정 암호 알고리즘 또는 해시 함수에 대하여, 공격자가 키 탐색, 충돌 탐색, 역상 탐색 등의 공격을 성공시키는 데 필요한 계산량을 2^n 수준의 연산량으로 나타낸 척도",
    defShort: "공격 성공시키는 데 필요한 계산량을 2^n 수준 연산량으로 나타낸 척도",
    lead: "공격 난이도의 측정자, 암호학적 보안 강도",
    features: ["2^n 연산량 척도", "방식별 기준 상이", "안전성 기간 한정"],
    keywords: ["2^n", "연산량(계산량)", "암호 키 길이", "해시 출력 길이", "운용 모드", "초기화 벡터(IV)·논스(Nonce) 사용 방식", "112bit", "128bit", "192bit", "256bit"],
    tables: [
      {
        caption: "암호학적 보안 강도(Security Strength)의 결정 요소",
        headers: ["보안 강도 결정 요소", "주요 판단 기준", "설명"],
        rows: [
          ["암호 키 길이", "키 공간의 크기", "무차별 대입 계산"],
          ["해시 출력 길이", "출력 비트 수와\n공격 저항성", "길이 비례 강도\n충돌·역상 저항"],
          ["운용 모드", "블록암호\n운용 방식", "평문 노출 여부\n무결성 보장"],
          ["초기화 벡터(IV)·논스(Nonce) 사용 방식", "무작위성·\n유일성 보장", "예측 불가 필요\n재사용 시 취약"],
        ],
      },
      {
        caption: "암호학적 보안 강도(Security Strength)의 보안 강도 기준",
        headers: ["암호 방식", "보안 강도 기준", "예시", "설명"],
        rows: [
          ["대칭키 암호", "키 길이", "AES-128은 약\n128비트 강도", "키 길이 기준 평가\n길수록 높은 강도"],
          ["공개키 암호", "대칭키 대응\n보안 수준", "RSA 3072 대응\nECC 256 대응", "대응 수준 기준\n더 긴 키 필요"],
          ["해시 함수", "출력 길이\n공격 유형", "충돌 저항 n/2\n역상 저항 n비트", "출력 길이 평가\n저항성별 상이"],
        ],
      },
      {
        caption: "보안 강도별 암호 알고리즘 비교",
        headers: ["보안 강도(비트)", "대칭키 암호", "해시함수", "인수분해(비트)", "이산대수 공개키(비트)", "이산대수 개인키(비트)", "타원곡선(비트)", "안전성 유지기간"],
        rows: [
          ["112", "112", "112", "2048", "2048", "224", "224", "2011~2030년"],
          ["128", "128", "128", "3072", "3072", "256", "256", "2030년 이후"],
          ["192", "192", "192", "7680", "7680", "384", "384", "2030년 이후"],
          ["256", "256", "256", "15360", "15360", "512", "512", "2030년 이후"],
        ],
      },
    ],
    notes: [
      "해시 n비트 출력의 보안 강도: 충돌 저항성 약 n/2비트, 역상 저항성 약 n비트 — 같은 해시라도 공격 유형에 따라 강도가 다르다",
      "128비트 보안 강도 대응: AES-128 = RSA 3072 = ECC 256 — 공개키는 같은 강도에 훨씬 긴 키가 필요",
    ],
  },
  {
    title: "동형 암호(Homomorphic Encryption)",
    course: "SC",
    definition:
      "평문과 암호문의 동형(Homomorphic) 성질로 인해 암호문 상태에서도 연산이 가능한 차세대 암호",
    defShort: "평문·암호문 동형 성질로 암호문 상태에서도 연산이 가능한 차세대 암호",
    lead: "암호문 그대로 연산, 동형 암호",
    features: ["암호문 상태 연산", "평문 동일 결과", "노이즈 누적 한계"],
    keywords: ["부분 동형", "준 동형", "완전 동형", "부트스트래핑", "스쿼싱", "RAD78", "BGN05", "Gen09", "CRT-based"],
    tables: [
      {
        caption: "동형 암호의 유형, 설계원리와 알고리즘",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["유형", "부분적 동형암호\nPartial homomorphic encryption(PHE)", "오직 한 유형의 연산만 지원"],
          ["유형", "준 동형암호\nSomewhat homomorphic encryption(SHE)", "덧셈·곱셈 모두 지원\n몇 번의 연산에도 값 보존"],
          ["유형", "완전 동형함수\nFully homomorphic encryption(FHE)", "준동형암호 + bootstrapping\n덧셈·곱셈·XOR 무한번 수행"],
          ["설계원리", "부트스트래핑", "암호화된 비밀키로 노이즈 감소\n새 암호문 생성 후 연산 수행"],
          ["설계원리", "스쿼싱", "노이즈 증가 감소, 평문 변형 방지\n복호화 알고리즘·공개키 변형"],
          ["알고리즘", "RAD78", "최초 동형암호\n속도 느림, 암호문 수십배 커짐"],
          ["알고리즘", "BGN05", "덧셈과 한 번의 곱셈 연산 보존"],
          ["알고리즘", "Gen09", "격자(lattice) 기반\n난수화된 에러 사용\n일정 수 연산 시 에러 증폭\n복호화 불가능"],
          ["알고리즘", "CRT-Based", "중국인의 나머지 정리 기반\n큰 숫자 단위 연산, 많은 정보 저장"],
        ],
      },
    ],
    notes: [
      "개념도: A·B를 비밀키로 암호화 → E(A)·E(B) 상태에서 모든 사칙연산 동일 결과 → E(A)+E(B)를 복호화하면 C=A+B",
      "예시: 8+10=18 — ÷4·÷7 나머지로 암호화한 (0,1)+(2,3)=(2,4)가 '4로 나눈 나머지 2, 7로 나눈 나머지 4인 수' 18과 일치(암호화된 상태에서 연산)",
    ],
  },
  {
    title: "암호 분석 공격(Cryptanalysis Attacks) 기법",
    course: "SC",
    definition:
      "암호 시스템을 분석하여 암호문을 해독(평문 추출)하거나 암호 키를 추출하려는 공격 기법",
    defShort: "암호 시스템을 분석해 암호문 해독이나 암호 키 추출을 노리는 공격 기법",
    lead: "해독과 키 탈취의 수법, 암호 분석 공격",
    features: ["보유 정보별 분류", "알고리즘 공개 전제", "평문·키 추출 목적"],
    keywords: ["COA", "KPA", "CPA", "CCA"],
    tables: [
      {
        caption: "암호 분석 공격 4유형 (COA·KPA·CPA·CCA)",
        headers: ["공격", "설명", "방어"],
        rows: [
          ["암호문 단독 공격 (COA, Ciphertext-Only Attack)", "암호문만 보유\n가장 어려운 공격", "충분한 키 길이\n강력한 알고리즘"],
          ["기지(알려진) 평문 공격 (KPA, Known-Plaintext Attack)", "평문 일부(크립)\n대응 암호문 보유", "강력한 키 스케줄\n솔트(Salt) 적용"],
          ["선택 평문 공격 (CPA, Chosen-Plaintext Attack)", "평문→암호문\n다량 생성 가능", "안전한 암호 구조\n설계"],
          ["선택 암호문 공격 (CCA, Chosen-Ciphertext Attack)", "암호문에 대한\n평문 보유", "MAC 사용\n안전한 패딩"],
        ],
      },
      {
        caption: "커크호프의 원칙(Kerckhoffs's principle)",
        headers: ["원칙"],
        rows: [
          ["1) 암호 알고리즘은 공개되어도 안전해야 한다"],
          ["2) 시스템의 보안은 암호 키의 비밀성에 의존해야 한다"],
          ["3) 키가 유출되었을 경우 쉽게 변경할 수 있어야 한다"],
          ["4) 시스템은 실용적이어야 하며, 유지보수가 가능해야 한다"],
        ],
      },
    ],
    notes: [
      "암호 공격 기법 종류: ① 암호 분석 공격 ② 무차별 대입 공격 ③ 사전 공격(레인보우 테이블) ④ 크레덴셜 스터핑 공격 ⑤ 중간자 공격 ⑥ 재전송 공격 ⑦ 부채널 공격 등",
      "커크호프 원칙의 귀결: 암호 체계 안전성은 '키의 비밀성에만' 의존해야 한다",
    ],
  },
  {
    title: "양자 암호(Quantum Cryptography)",
    course: "SC",
    definition:
      "양자 중첩, 얽힘, 불확실성 등의 양자 역학 원리를 이용하여 데이터를 안전하게 암호화하고 전송하는 암호화 기법",
    defShort: "중첩·얽힘·불확실성 양자 역학 원리로 암호화·전송하는 암호화 기법",
    lead: "양자역학이 지키는 통신, 양자 암호",
    features: ["양자 역학 원리", "복제 불가능", "도청 탐지 가능"],
    keywords: ["양자 중첩", "양자 얽힘", "불확실성", "양자 암호통신", "양자 키 분배(QKD)", "Quantum Channel", "BB84"],
    tables: [
      {
        caption: "양자 암호의 원리(양자 특성)",
        headers: ["원리", "설명"],
        rows: [
          ["양자 중첩", "확률적 공존 여러 상태 동시\n측정 전 불확정 상태 확인 불가"],
          ["양자 얽힘", "비고전 상관 둘 이상 상관성\n원거리 유지 거리 무관 존재"],
          ["불확정성", "동시 측정 불가 물리량 측정 한계\n복제 불가능 양자 암호 통신"],
        ],
      },
      {
        caption: "양자 암호 구현 기술",
        headers: ["구현기술", "주요역할", "설명"],
        rows: [
          ["양자광원", "보안성 확보", "도청공격 대비 단일광자광원 사용\n원하는 시간에 광자 하나만 방사"],
          ["단일광자 검출기", "광자 검출", "광학·전기 특성 단일광자 검출"],
          ["양자 난수 생성기(QRNG)", "도청방지", "예측 불가 무작위수(난수) 생성"],
          ["양자 암호 프로토콜", "양자키분배·전송", "양자암호키 분배·전송용\nBB84, Decoy based QKD\nPlug & Play\nPhase Differential Shift QKD"],
          ["양자암호통신 채널", "양자키 전송", "멀리 떨어진 Alice·Bob 사이\n양자역학적 완벽 보안 비밀 키 분배"],
        ],
      },
      {
        caption: "BB84 프로토콜",
        headers: ["절차", "설명"],
        rows: [
          ["①", "임의 비트 생성 송신 비트 준비"],
          ["②", "편광 필터 선택 비트 변환 준비"],
          ["③", "편광 신호 송신 양자 채널 전송"],
          ["④", "수신 필터 선택 밥의 임의 선택"],
          ["⑤", "측정값 보관 편광 값 측정"],
          ["⑥", "필터 일치 검증 공개 채널 확인"],
          ["⑦", "불일치 비트 제거 동일 필터만 보관"],
        ],
      },
    ],
    notes: [
      "구성도: 암호 장비 ↔ 일반 통신망 ↔ 암호 장비, 하단 키분배장치(QKD: 양자 광학계 QRNG·modulator, 전자제어시스템)가 양자 채널(BB84)로 연결 — Basis 0/1 (+: ↑→, ×: ↗↘)",
      "BB84 예시의 최종키 = 0101 (같은 필터를 쓴 비트만 남긴 결과)",
      "포스트 양자 암호와 구분: 양자 암호는 양자 '물리 현상'으로 키를 지키는 기술(QKD 하드웨어), 포스트 양자 암호는 양자 컴퓨터 공격을 견디는 '수학' 알고리즘",
    ],
  },
  {
    title: "포스트 양자 암호(Post-Quantum Cryptography)",
    course: "SC",
    definition:
      "양자 컴퓨터의 계산 능력에 대항하여 양자 컴퓨팅 환경에서 안전한 암호 기술을 이용할 수 있도록 하는 새로운 암호 체계",
    defShort: "양자 컴퓨터 계산 능력에 대항해 양자 컴퓨팅 환경에서 안전한 암호 체계",
    lead: "양자 컴퓨터 시대의 방패, 포스트 양자 암호",
    features: ["수학 난제 기반", "양자 공격 내성", "기존 인프라 적용"],
    keywords: ["다변수기반", "코드", "격자", "아이소제니", "해시기반 전자서명"],
    tables: [
      {
        caption: "양자 컴퓨터의 공격 기법",
        headers: ["공격 방식", "설명"],
        rows: [
          ["그로버 알고리즘(Grover's Algorithm)", "비정렬 데이터 중 조건 만족 값 탐색\nAES, SHA-2, SHA-3 위협\n대칭키 암호 위협"],
          ["쇼어 알고리즘(Shor's Algorithm)", "다항 시간 안에 소인수 분해\nRSA, ECDSA, ECDH, DSA 위협\n공개키 암호 위협"],
        ],
      },
      {
        caption: "포스트 양자 암호(양자 내성 암호) 유형",
        headers: ["유형", "설명", "알고리즘"],
        rows: [
          ["다변수기반(Multivariate-based) 암호", "유한체 위의\n다변수함수 난제", "HFE, ZHFE\nUOV, Rainbow"],
          ["코드기반(Code-based) 암호", "선형 코드 디코딩\n난해성 기반", "McEliece\nNiederreiter\nMcBits"],
          ["격자기반(Lattice-based) 암호", "격자 위 계산\n문제의 어려움", "NTRU, BLISS\nNew Hope\nLWE-Frodo"],
          ["아이소제니기반(Isogeny-based) 암호", "타원 곡선 간\n아이소제니 난제", "DH like protocol\nSIDH"],
          ["해시기반(Hash-based) 전자서명", "출력 길이 확장\n안정성 보장", "W-OTS, W-OTS+\nHORS, SPHINCS"],
        ],
      },
      {
        caption: "양자 내성 암호 비교",
        headers: ["구분", "장점", "단점"],
        rows: [
          ["다변수 기반", "작은 서명·고속", "큰 키 사이즈"],
          ["코드 기반", "빠른 암·복호화", "큰 키 사이즈"],
          ["격자 기반", "응용 다양·고속", "변수 설정 난해"],
          ["아이소제니 기반", "구현 편리·소형", "연산 속도 느림"],
          ["해시 기반", "안전성 증명", "큰 서명 크기"],
        ],
      },
    ],
    notes: [
      "공격-대상 대응: 그로버 → 대칭키(AES·SHA 계열, 강도 절반), 쇼어 → 공개키(RSA·ECC 계열, 사실상 붕괴) — 공개키 암호가 먼저 무너지므로 PQC가 시급",
      "양자 암호와 구분: 양자 암호(QKD)는 물리 장비 기반 키 분배, 포스트 양자 암호는 기존 인프라에서 소프트웨어로 교체 가능한 수학 기반 알고리즘",
    ],
  },
  {
    title: "딥보이스(Deep Voice) 피싱",
    course: "SC",
    definition:
      "딥페이크와 보이스 피싱의 합성어로서, 딥러닝 기반의 음성 합성 기술을 활용해 실제 인물의 음성을 모방하여 전화를 걸고, 금전이나 정보를 탈취하는 지능형 보이스 피싱",
    defShort: "딥페이크와 보이스 피싱 합성어, 음성 합성으로 인물 모방한 보이스 피싱",
    lead: "음성 합성으로 모방한 사기, 딥보이스 피싱",
    features: ["음성 지문 복제", "실시간 음성 합성", "지인 사칭 전화"],
    keywords: ["딥페이크", "보이스 피싱", "음성 수집", "음성 합성", "전화 사기", "음성 클로닝", "Neural TTS", "음성 변환", "음성 지문"],
    tables: [
      {
        caption: "딥보이스(Deep Voice) 피싱 공격 절차",
        headers: ["구분", "단계", "설명"],
        rows: [
          ["사전준비", "① 음성수집", "SNS·영상·통화에서 음성 수집\n통화 녹음, 유튜브, SNS 활용"],
          ["음성합성", "② 음성합성", "수집 음성 기반 딥러닝 음성 복제\n딥페이크, Voice Cloning AI"],
          ["음성합성", "③ 공격 시나리오", "긴급 상황 위장 신뢰 유도 대화 준비\n사회공학, 사칭 대본"],
          ["공격수행", "④ 전화사기 실행", "합성 음성으로 피해자에 직접 전화\n실시간 음성 합성, 발신번호 조작"],
          ["공격수행", "⑤ 금전/정보 탈취", "송금, 인증번호, 개인정보 요구\n계좌 정보, OTP, 인증 문자"],
        ],
      },
      {
        caption: "딥보이스(Deep Voice) 피싱의 음성 추출 및 합성 기법",
        headers: ["단계", "기법", "주요 기술", "설명"],
        rows: [
          ["샘플 추출 단계", "음성 클로닝\n(Speaker Embedding)", "x-vector\nd-vector", "짧은 음성 샘플\n음성 지문 생성"],
          ["재현 단계", "텍스트 음성 합성\n(Neural TTS)", "WaveNet\nHiFi-GAN, VALL-E", "대본 텍스트 입력\n음성 지문 적용"],
          ["재현 단계", "음성 변환\n(Voice Conversion)", "Autoencoder\nGAN 계열", "자기 음성 녹음\n대상 음색 변경"],
        ],
      },
    ],
    notes: [
      "Attack Flow(개념도): ① 음성수집 → ② 음성합성(딥페이크) → ③ 공격 시나리오 → ④ 전화사기(친인척·지인 사칭) → ⑤ 금전/정보탈취",
    ],
  },
  {
    title: "OWASP Top 10 for LLM Application 2025",
    course: "SC",
    definition:
      "대규모 언어 모델(LLM) 기반 어플리케이션에서 발생할 수 있는 상위 10개의 보안 취약점 기술한 보안 가이드라인",
    defShort: "대규모 언어 모델 기반 어플리케이션 상위 10개 보안 취약점 가이드라인",
    lead: "LLM 앱의 10대 위협, OWASP LLM 2025",
    features: ["LLM 앱 특화", "생성형AI 고유 위협", "취약점별 대응 제시"],
    keywords: ["프민공데부 과시벡잘무"],
    tables: [
      {
        caption: "보안취약점 [프민공데부 과시벡잘무]",
        headers: ["NO", "보안 취약점", "설명"],
        rows: [
          ["LLM01", "프롬프트 인젝션", "의도 외 출력"],
          ["LLM02", "민감한 정보 공개", "개인·기밀 노출"],
          ["LLM03", "공급망 취약점", "서드파티 요소"],
          ["LLM04", "데이터 및\n모델 중독", "학습 데이터 변조\n파라미터 변조"],
          ["LLM05", "부적절한\n출력 처리", "검증·정제\n미흡 발생"],
          ["LLM06", "과도한 대행", "인간 통제 부재"],
          ["LLM07", "시스템 프롬프트\n노출", "내부 지시 유출\n운영 정보 노출"],
          ["LLM08", "벡터와 임베딩\n취약점", "RAG 표현 결함\n검색 오류 유발"],
          ["LLM09", "잘못된 정보", "환각·학습 편향"],
          ["LLM10", "무제한 소비", "자원 고갈 유발"],
        ],
      },
      {
        caption: "보안취약점 대응 방안",
        headers: ["NO", "취약점", "대응방안"],
        rows: [
          ["LLM01", "프롬프트 인젝션", "입력 데이터 정제\n엄격한 입력 검증\n출력 모니터링\n문맥 격리"],
          ["LLM02", "민감한 정보 공개", "데이터 정제 기법\n엄격한 입력 검증\n접근 제어 강화\n차등 프라이버시"],
          ["LLM03", "공급망 취약점", "공급업체 검증\nSBOM 관리\n지속적 모니터링"],
          ["LLM03", "공급망 취약점", "레드 팀 평가\n모델 검증\n코드 서명\n무결성 체크"],
          ["LLM04", "데이터 및\n모델 중독", "무결성 검사\n이상 징후 탐지\n안전 파이프라인"],
          ["LLM04", "데이터 및\n모델 중독", "모델 재평가\n레드 팀\n침투 테스트"],
          ["LLM05", "부적절한\n출력 처리", "출력 샌드박싱\n정교한 출력 검증\n안전 실행 환경"],
          ["LLM05", "부적절한\n출력 처리", "오류 처리\n경고 시스템\n사용자 피드백\n수동검토"],
          ["LLM06", "과도한 대행", "인간-개입\nHuman-in-the-loop\n명시적 권한 제한"],
          ["LLM06", "과도한 대행", "행동 로깅\n모니터링\n능력 제한\n정기 감사"],
          ["LLM07", "시스템\n프롬프트 노출", "프롬프트 은닉\n구성 접근 제한\n안전한 로그 관리"],
          ["LLM07", "시스템\n프롬프트 노출", "정기 감사\n모니터링\n프롬프트 분리"],
          ["LLM08", "벡터와 임베딩\n취약점", "벡터 데이터 정제\n안전 임베딩 기법\n적대적 테스트"],
          ["LLM08", "벡터와 임베딩\n취약점", "이상 징후 탐지\n암호화 적용"],
          ["LLM09", "잘못된 정보", "RAG\n모델 파인튜닝\n인간 검증 및 감독"],
          ["LLM09", "잘못된 정보", "자동 검증\n사용자 교육"],
          ["LLM10", "무제한 소비", "입력 검증\n속도 제한\n자원 할당 관리\n타임아웃"],
          ["LLM10", "무제한 소비", "스로틀링\n샌드박스 기술\n포괄적 로깅\n이상 탐지"],
        ],
      },
    ],
    notes: [
      "두음 [프민공데부 과시벡잘무]: 프롬프트인젝션·민감정보·공급망·데이터중독·부적절출력 / 과도한대행·시스템프롬프트·벡터임베딩·잘못된정보·무제한소비",
      "2021 OWASP Top 10(웹)과 구분: 이건 LLM 애플리케이션 전용 — 프롬프트 인젝션·환각·벡터임베딩처럼 생성형 AI 고유 위협 포함",
    ],
  },
  {
    title: "사이버전(Cyber Warfare)",
    course: "SC",
    definition:
      "가상 공간에서 다양한 사이버 공격 수단을 사용하여 적의 정보 체계를 교란, 거부, 통제, 파괴하는 등의 공격과 이를 방어하는 활동",
    defShort: "가상 공간에서 사이버 공격 수단으로 적의 정보 체계 교란 공격과 방어 활동",
    lead: "국가 간 가상 공간의 전쟁, 사이버전",
    features: ["비대칭 전력", "추적의 난해성", "전선의 부재"],
    keywords: ["정보 보안 핵심 원천 기술", "사이버전 방어·분석·공격 기술", "고비도 암호 기술", "밀리터리 포렌식 기술", "사이버 공격 근원지 역추적 기술", "사이버 공격 무기 기술"],
    tables: [
      {
        caption: "사이버전의 특징",
        headers: ["번호", "특징"],
        rows: [
          ["①", "비대칭 전력"],
          ["②", "공격자와 공격 장소 추적의 난해성"],
          ["③", "전쟁 행위 경계의 모호성"],
          ["④", "신규 무기/전쟁 시스템"],
          ["⑤", "조기 경보 체계의 부재"],
          ["⑥", "전선의 부재"],
        ],
      },
      {
        caption: "사이버전의 보안기술",
        headers: ["보안 기술 영역", "보안 기술"],
        rows: [
          ["정보 보안 핵심 원천 기술", "초경량 고비도 암호화 기술\n양자 암호화 기술"],
          ["사이버전 방어 기술", "분산 서비스 거부 공격 대응 기술\n민관 정보 협업 시스템\n능동형 사이버 자가 방어 기술\nCTI, 사이버 킬 체인"],
          ["사이버전 분석 기술", "해킹 역추적 기술\n밀리터리 포렌식"],
          ["사이버전 공격 기술", "봇(Bot) 공격 기술\nEMP 폭탄 기술"],
        ],
      },
    ],
    notes: [
      "개념도: 국가 Cyber System(컴퓨터 시스템·네트워크 통신망·Data) ↔ Cyber Space(방어/군사적 행동/공격) — Cyber 해킹(정부 보유 정보 획득)·Cyber 전쟁(적 정보 체계 파괴·자국 보호)·Cyber 테러(인터넷 기반 공격 행위)",
      "방어·분석·공격 3계층을 정보보안 핵심 원천기술이 뒷받침",
    ],
  },
  {
    title: "APT(Advanced Persistent Threat) 공격",
    course: "SC",
    definition:
      "특정 대상을 장기적인 계획과 고도화된 수법을 사용하여 오랜 기간 동안 지속적으로 공격하는 정교한 사이버 공격 기법",
    defShort: "특정 대상을 오랜 기간 동안 지속적으로 공격하는 정교한 사이버 공격 기법",
    lead: "표적을 노린 지속 공격, APT",
    features: ["특정 대상 표적", "장기 지속 공격", "고도화된 은밀성"],
    keywords: ["침투", "검색", "수집", "유출", "지능화/지속적"],
    tables: [
      {
        caption: "APT 공격 절차와 기법",
        headers: ["단계", "공격기법", "설명"],
        rows: [
          ["침투(Incursion)", "관찰(Reconnaissance)\n사회공학\n제로데이 취약점\n수동공격", "인증정보·SQL 인젝션·악성코드\n오랜 시간 대상 시스템 거점 구축"],
          ["탐색(Discovery)", "다중벡터(Multiple Vector)\n은밀한 활동\n연구 및 분석", "침입 후 목표 기관 시스템 정보 수집\n기밀데이터 자동 검색"],
          ["수집(Capture)", "은닉(Convert)\n권한상승", "보호되지 않은 시스템 데이터 노출"],
          ["제어(Control)", "유출(Exfiltration)\n중단(Disruption)", "표적시스템 제어권 장악\n기밀 데이터 유출, SW·HW 손상"],
        ],
      },
      {
        caption: "APT 공격 대응 방안",
        headers: ["분류", "관리적·기술적 대응 방안"],
        rows: [
          ["조직", "보안 전담 조직 구성\nCISO 기반 APT 대응 TFT"],
          ["규정", "정책, 표준, 지침의 현행화\nCompliance 보안 프로세스 구축"],
          ["보안의식", "APT 위험성 교육, 홍보\n감시, 내부 감시"],
          ["시스템", "계층적 방어, 망 분리"],
          ["네트워크", "Inbound Malicious Content 탐지\nOutbound Callback Traffic 기술\nPort Scanning"],
          ["데이터", "암호화, DLP, Log 분석\nLog 시계열 분석, SIEM"],
        ],
      },
    ],
    notes: [
      "공격 절차: 침투(Incursion) → 검색(Discovery) → 수집(Capture) → 유출(Control) — 정상 계정·제로데이를 이용해 은밀하고 지속적으로 진행",
    ],
  },
  {
    title: "스니핑(Sniffing) & 스푸핑(Spoofing)",
    course: "SC",
    definition:
      "스니핑은 네트워크상에서 자신이 아닌 다른 상대방들의 패킷 교환을 엿보는(가로채기) 공격 기법이고, 스푸핑은 공격자가 네트워크, 웹 사이트 등의 데이터 위변조를 통해 정상 시스템인 것처럼 위장하여 일반 사용자를 속이는 해킹 기법",
    defShort: "패킷 교환을 엿보는 스니핑과 데이터 위변조로 위장해 속이는 스푸핑 기법",
    defPair: [
      {
        name: "스니핑(Sniffing)",
        lead: "패킷 감청의 수동적 공격",
        def: "다른 상대방들의 패킷 교환을 엿보는(가로채기) 네트워크 공격 기법",
        features: ["수동적 감청", "기밀성 침해", "인증정보 탈취"],
      },
      {
        name: "스푸핑(Spoofing)",
        lead: "위장 기만의 능동적 공격",
        def: "데이터 위변조로 정상 시스템처럼 위장해 일반 사용자를 속이는 해킹 기법",
        features: ["능동적 위장", "무결성 침해", "트래픽 유도"],
      },
    ],
    lead: "엿보기와 속이기의 공격, 스니핑과 스푸핑",
    features: ["수동적 감청", "능동적 위장", "세션 하이재킹 연계"],
    keywords: ["MITM", "ARP 캐시변조", "Mac Address Table 오버플로우", "Fail Safe", "IP Forward", "Ack Storm", "RST(Reset)"],
    tables: [
      {
        caption: "스니핑과 스푸핑의 비교",
        headers: ["비교", "스니핑(Sniffing)", "스푸핑(Spoofing)"],
        rows: [
          ["정의", "패킷 몰래 감청\n데이터 탈취", "가짜 정보 기만\n공격 대상 기만"],
          ["공격 방식", "패킷 가로채기", "신뢰 주체 위장"],
          ["목적", "인증·금융 정보", "트래픽 유도"],
          ["공격 유형", "패시브 스니핑\n액티브 스니핑", "ARP 스푸핑\nIP 스푸핑\nDNS 스푸핑\n이메일 스푸핑"],
          ["방어 기법", "VPN, HTTPS\nTLS, 방화벽", "ARP/DNS 보호\n이메일 인증\n방화벽"],
        ],
      },
      {
        caption: "스니핑·스푸핑 공격 유형",
        headers: ["구분", "공격 방식", "설명"],
        rows: [
          ["스니핑", "패시브 스니핑", "허브 기반 감청"],
          ["스니핑", "액티브 스니핑", "스위치망 탈취"],
          ["스푸핑", "ARP 스푸핑", "가짜 MAC 위장"],
          ["스푸핑", "IP 스푸핑", "가짜 IP 위장"],
          ["스푸핑", "DNS 스푸핑", "가짜 사이트 유도"],
          ["스푸핑", "이메일 스푸핑", "발신자 위조"],
        ],
      },
    ],
    notes: [
      "상관관계: 스위치 환경에서 스니핑하려면 ARP 스푸핑이 선행됨(액티브 스니핑) → Sniffing·Spoofing을 이용해 Session Hijacking(Sequence Number 획득, TCP 3-Way Handshake 악용)으로 이어짐",
      "'스니핑=수동·기밀성 침해=엿보기, 스푸핑=능동·무결성 침해=속이기' 대구가 시험 포인트",
    ],
  },
  {
    title: "BPF(Berkeley Packet Filter) Door",
    course: "SC",
    definition:
      "리눅스 커널의 BPF 기술을 악용하여 네트워크 패킷을 감시하며 외부 명령을 수신하고 실행하는 리눅스 기반 백도어 유형의 공격 기법",
    defShort: "리눅스 커널 BPF 악용해 외부 명령을 수신·실행하는 백도어 공격 기법",
    lead: "패킷 필터 악용 백도어, BPF Door",
    features: ["포트 미개방", "매직 패킷 트리거", "방화벽 우회"],
    keywords: ["리눅스 커널", "BPF", "BPF Filter", "매직 패킷", "백도어"],
    tables: [
      {
        caption: "BPF Door Attack Flow",
        headers: ["공격 단계", "주요 기술", "설명"],
        rows: [
          ["1. 잠입 및 설치", "프로세스 위장\n(Masquerading)", "시스템 침투 악성코드 설치\n정상 리눅스 데몬 이름으로 위장"],
          ["2. BPF 필터 로드", "BPF\n(Berkeley Packet Filter)", "패킷 감청기 역할 BPF 필터 등록"],
          ["3. 매직 패킷 감시", "패킷 감청\n(Packet Sniffing)", "포트 열지 않고 수신 패킷 감청\n공격자 설정 매직 패킷 존재 검사"],
          ["4. 방화벽 우회", "커널 레벨 작동", "iptables보다 먼저 패킷 읽음"],
          ["5. 백도어 활성화", "iptables 규칙 조작", "iptables 방화벽 규칙 임시 수정\n리버스 셸 또는 바인드 셸 실행"],
          ["6. 원격 제어", "루트 권한\n(Root Privileges)", "최고 관리자(root) 권한 획득\n시스템 완전 제어"],
        ],
      },
      {
        caption: "BPF Door 대응 방안",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["관리적 측면", "접근통제 및 최소권한 원칙 적용", "시스템 root 접근 제한\n불필요 서비스·포트 차단"],
          ["관리적 측면", "정기적 보안 점검 및 침투 테스트", "탐지 안 될 경우 대비\n정기 레드팀/블루팀 테스트\n보안체계 검증"],
          ["기술적 측면", "침해지표 기반 탐지 및 차단", "BPFDoor 관련 IOC 수집\nEDR·NIDS·SIEM 적용 징후 탐지"],
          ["기술적 측면", "비정상 네트워크 트래픽 탐지 강화", "포트 없이 패킷 필터링 명령 수신\n네트워크 이상 징후 분석"],
        ],
      },
    ],
    notes: [
      "핵심 위협: 포트를 열지 않아 포트 스캔에 안 잡히고, iptables보다 먼저 커널에서 패킷을 읽어 방화벽을 우회 — '매직 패킷'을 트리거로만 깨어난다",
    ],
  },
  {
    title: "부채널 공격(Side Channel Attack)",
    course: "SC",
    definition:
      "디바이스 내의 물리적 장치가 구동하면서 발생하는 전력소모, 발열 등 다양한 누수 정보를 획득, 분석하여 암호 키를 획득하는 공격 기법",
    defShort: "물리적 장치 구동 시 전력소모·발열 등 누수 정보로 암호 키 획득 공격 기법",
    lead: "물리적 누수의 역이용, 부채널 공격",
    features: ["물리적 누수 정보", "알고리즘 강도 무관", "비침입 수행 가능"],
    keywords: ["부채널 정보(시간·전력소모량·발열·전자파·소리·파장)", "수동적", "능동적", "단순 부채널 공격", "차분 부채널 공격"],
    tables: [
      {
        caption: "부채널 공격 기법",
        headers: ["구분", "공격 유형", "세부 공격기법"],
        rows: [
          ["SW연산 과정", "수동적 공격\n능동적 공격", "시차·전력·EM\n오류주입·콜드부트"],
          ["모듈접근 방법", "침입 공격\n준 침입 공격\n비 침입 공격", "패키지·프로빙\n레이저·전자기\nTEMPEST·오류메시지"],
          ["표본자료 분석방법", "단순 부채널 공격\n차분 부채널 공격", "단일정보 추적\n복수정보 추적"],
        ],
      },
      {
        caption: "부채널 공격의 대응 기법",
        headers: ["대응 기법", "설명"],
        rows: [
          ["단계별 대응", "불법수집 차단,\n분석차단,\n관리강화(NATO Tempest 3\nLevel, CC인증)"],
          ["무작위성 기법", "포인트 랜덤화,\n스칼라 랜덤화"],
          ["블라인드 기법", "스칼라\n블라인딩,\n메시지 블라인딩"],
          ["마스킹 기법", "고차 부울린\n마스킹"],
          ["하이딩 기법", "랜덤 더미 연산\n삽입(Random Insertion of\nDummy Operations), 셔플링\n기법(Shuffling Scheme)"],
        ],
      },
    ],
    notes: [
      "개념도: 평문 →(Crypto Algorithm: ECC·AES·RSA·LEA·HIGHT + Secret Key)→ 암호문, 이때 연산모듈·스마트폰·IoT·USB·OTP가 흘리는 부채널 정보(시간·전력·발열·전자파·소리·파장)를 공격자가 수집·분석해 Secret Key 획득",
      "핵심: 암호 알고리즘의 수학적 강도와 무관하게 '구현·물리 계층'을 노린다 — 그래서 알고리즘이 안전해도 뚫린다",
    ],
  },
  {
    title: "드라이브 바이 다운로드(Drive By Download)",
    course: "SC",
    definition:
      "직접 파일 다운로드하거나 실행하지 않아도 웹사이트 접속하는 것만으로 악성 코드가 자동으로 다운로드 및 실행되는 공격 기법",
    defShort: "웹사이트 접속만으로 악성 코드가 자동 다운로드·실행되는 공격 기법",
    lead: "웹 접속만으로 감염 유도, 드라이브 바이 다운로드",
    features: ["접속만으로 감염", "사용자 인지 불가", "다단계 리다이렉션"],
    keywords: ["Landing Site", "Exploit Server", "Malware Server", "Dropper", "API 오용", "브라우저 취약점"],
    tables: [
      {
        caption: "드라이브 바이 다운로드 공격 절차",
        headers: ["단계", "공격과정", "기법"],
        rows: [
          ["1", "배너·게시판에\nURL 코드 삽입", "iFrame Injection\nXSS"],
          ["2", "공격 코드 삽입\n웹 페이지 방문", "피싱, 파밍"],
          ["3", "사전 개설된\n웹 페이지 이동", "URL Redirection"],
          ["4", "악성코드 유포\n사이트로 이동", "URL Redirection"],
          ["5", "악성코드 유포\n악성 행위 수행", "드로퍼, 키로깅"],
        ],
      },
      {
        caption: "드라이브 바이 다운로드 대응 방안",
        headers: ["구분", "세부"],
        rows: [
          ["정적분석", "네트워크 분석(IDS, IPS)\n파일분석(Anti-Virus)"],
          ["동적분석", "평판분석\n행위분석"],
          ["서버측면 보안", "Secure Coding 적용\n보안 모니터링 정책 적용\nAPI 취약점 제거\n샌드박스 활용한 악성코드 탐지"],
          ["클라이언트 보안", "SW 최신 유지\n웹-필터링 SW 설치\nNo Script 설치\n관리자 권한 접속 금지"],
        ],
      },
    ],
    notes: [
      "공격 흐름(개념도): Attacker → Banner(iFrame) → Victim이 Landing Site 접속(Request URL) → URL redirection → Exploit Server → Malware Server → Malware download",
    ],
  },
  {
    title: "공급망 공격(Supply Chain Attack)",
    course: "SC",
    definition:
      "정상 소프트웨어를 개발하여 배포하는 과정에서 취약한 업데이트 서버, 개발자 PC 등에 침투해 소프트웨어를 변조하여 악성코드를 유포하는 해킹 기법",
    defShort: "SW 개발·배포 과정에 침투해 변조하고 악성코드를 유포하는 해킹 기법",
    lead: "배포 과정 침투 SW 변조, 공급망 공격",
    features: ["신뢰 관계 악용", "변조 업데이트 유포", "타겟 범위 확대"],
    keywords: ["공급망", "악성코드", "제조공정", "데이터저장소", "서버 침투", "SBOM"],
    tables: [
      {
        caption: "공급망 공격 절차",
        headers: ["공격절차", "공격대상"],
        rows: [
          ["1. 개발환경 침투", "공급사 개발환경"],
          ["2. 변조 업데이트 파일 유포", "업데이트 파일"],
          ["3. 개인사용자 및 기업 내부 확대", "개인 사용자 PC 및\n서버"],
          ["4. 타겟설정 범위확대", "내부 타 서버"],
          ["5. 추가 악성코드 감염", "외부 영향\nPC/서버"],
        ],
      },
      {
        caption: "공급망 공격 대응 방안",
        headers: ["분류", "대응 방안", "설명"],
        rows: [
          ["기술적 방안", "인증서 관리 대응", "별도 인증서 관리 시스템 구축\n사용 로그 기록"],
          ["기술적 방안", "개발 시스템 관리", "개발 환경 망분리 적용\n접근통제 등 구성"],
          ["관리적 방안", "업데이트체계관리", "업데이트 시 무결성 검증\n사용자 인증 등 구성"],
          ["관리적 방안", "침해사고 대응", "인증서 폐기 절차\n로그 관리 체계 구성"],
        ],
      },
    ],
    notes: [
      "개념도: 해커 → 개발환경 침투(SW개발서버·업데이트서버·관리서버·개발자PC) → 변조 업데이트 유포 → A사용자·B기업·C기업 감염 → 타겟 범위확대 → 기타 내부·외부 추가 감염",
      "핵심: '정상 공급사를 신뢰한다'는 관계를 역이용 — SolarWinds 사례처럼 SBOM(소프트웨어 자재명세서)·코드 서명·무결성 검증이 핵심 대응",
    ],
  },
  {
    title: "DoS(Denial of Service)",
    course: "SC",
    definition:
      "시스템이나 네트워크 리소스를 의도적으로 고갈시켜 정상적인 사용자들이 원래 의도된 용도로 사용하지 못하게 하는 사이버 공격 기법",
    defShort: "리소스를 고갈시켜 정상 사용자가 사용하지 못하게 하는 사이버 공격 기법",
    lead: "리소스 고갈의 서비스 거부, DoS",
    features: ["가용성 공격", "리소스 의도적 고갈", "단일 공격원"],
    keywords: ["가용성 공격", "서비스 거부"],
    tables: [
      {
        caption: "DoS 공격 유형",
        headers: ["단계", "절차", "목적"],
        rows: [
          ["Flooding 공격", "SYN Flooding", "TCP 3Way 악용"],
          ["Flooding 공격", "ICMP Flooding", "Ping 응답 집중"],
          ["Flooding 공격", "UDP Flooding", "비연결성 악용"],
          ["Flooding 공격", "IP Flooding", "IP 계층 악용"],
          ["Flooding 공격", "TCP Traffic Flooding", "대량 유입 마비"],
          ["Flooding 공격", "HTTP Header/Option\nSpoofing Flooding", "웹서버 가용량\n모두 소비"],
          ["Connection 공격", "HTTP Connection", "데몬 급증 유발"],
          ["Connection 공격", "TCP Connection", "입력 큐 마비"],
          ["Application 공격", "SIP 공격", "대량 SIP 전송"],
          ["Application 공격", "CC 공격", "캐시 제어 공격"],
          ["Application 공격", "HashDoS", "해시 구조 공격"],
        ],
      },
      {
        caption: "DoS 대응 절차",
        headers: ["단계", "절차", "목적"],
        rows: [
          ["1단계", "공격 인지", "DDoS 여부 판단"],
          ["2단계", "공격 유형 파악", "유형 파악\n차단방법 결정"],
          ["3단계", "유형별 차단 대응", "차단정책 설정\n가용성 확보"],
          ["4단계", "사후 조치", "정책 업데이트\n좀비 PC IP 확보"],
        ],
      },
      {
        caption: "DoS 대응 방법",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["라우터 설정", "Sink Hole", "ACL 이용 블랙홀 라우팅 차단"],
          ["라우터 설정", "Router Filtering", "네트워크 IN/OUT 트래픽 필터링\n(Ingress/Egress)"],
          ["라우터 설정", "CAR 기능", "단위시간당 일정량 패킷만 허용"],
          ["보안 장비", "방화벽", "방화벽 포트 필터링 기능 이용"],
          ["보안 장비", "IDS / IPS", "DDoS 공격 탐지 및 차단"],
          ["보안 장비", "L7 스위치", "포트·프로토콜별 설정\nTCP/UDP Flooding·Payload 패턴"],
          ["네트워크", "Load Balancing", "이중화·삼중화 부하분산\n네트워크 성능 강화"],
          ["네트워크", "대역폭 제한", "서비스별 대역폭 제한 피해 최소화"],
          ["네트워크", "안정적 네트워크 설계", "취약시스템·SPOF 없는 설계"],
        ],
      },
    ],
    notes: [
      "DoS는 단일 공격원, DDoS는 다수 좀비 PC 분산 공격 — DoS 대응 절차는 인지→유형 파악→차단→사후 조치 4단계",
    ],
  },
  {
    title: "DRDoS(Distributed Reflection DoS)",
    course: "SC",
    definition:
      "별도의 에이전트 설치 없이 네트워크 통신 프로토콜 구조의 취약성을 이용해 정상적인 서비스를 운영하고 있는 시스템을 DDoS 공격의 에이전트로 활용하는 기법",
    defShort: "프로토콜 취약성으로 정상 시스템을 DDoS 공격 에이전트로 활용 기법",
    lead: "반사와 증폭의 DDoS, DRDoS",
    features: ["에이전트 미설치", "출발지 IP 위조", "반사·증폭"],
    keywords: ["프로토콜 취약점", "Source IP Spoofing", "Boot 감염 불필요", "경유지 서버 활용", "반사(Reflection)", "증폭(Amplification)", "NTP", "DNS", "SNMP", "CHARGEN", "PPS", "BPS"],
    tables: [
      {
        caption: "DRDoS 공격 절차",
        headers: ["공격 절차", "Actor/대상", "설명"],
        rows: [
          ["IP Spoofing", "Hacker →\n경유지 서버", "출발지 위조\nSYN 전송"],
          ["Reflection & Amplification", "경유지 서버 →\nVictim", "SYN/ACK\n반사·증폭"],
          ["Service Down", "Victim", "대량 수신 마비"],
        ],
      },
      {
        caption: "Protocol별 DRDoS 공격 방식과 증폭 대상",
        headers: ["Service", "증폭 대상", "설명"],
        nameCol: 1,
        rows: [
          ["DNS", "RR(Resource Record)", "ANY, TXT 등 대량 레코드 정보 요구\n공격대상자에게 대량 트래픽 유발"],
          ["NTP", "MONLIST", "접속 서버 목록 요청(monlist)\n공격대상자에게 대량 트래픽 유발"],
          ["SNMP", "MIB(Management Information Base)", "GetBulkRequest로 MIB 대량 요청\n공격대상자에게 대량 트래픽 유발"],
          ["CHARGEN", "대량의 문자열", "접속 시 대량 문자열 전송 유도\n공격대상자에게 대량 트래픽 유발"],
        ],
      },
      {
        caption: "DRDoS 대응 방안",
        headers: ["구분", "방안", "설명"],
        rows: [
          ["피해자 측", "Victim서버의 IP·Port 필터링", "IP 포트 필터링 공격 대상 회피\n대체 서버 이용 정상 차단 우려"],
          ["반사서버 측", "반사서버의 무차별 이용방지", "출처 IP 조사 SYN 출처 확인\n블랙리스트 공격 머신 차단"],
          ["ISP 측", "ISP의 필터링", "배출 필터링 위조 패킷 차단\nIP 위조 차단 유입 자체 제한"],
          ["플랫폼 측", "공격 플랫폼 제한", "RAW 소켓 제한 소켓 사용 금지\nAPI 통제 공격 이용 방지"],
        ],
      },
    ],
    notes: [
      "DDoS와 차이: DRDoS는 좀비(에이전트)를 심을 필요 없이 정상 서버(DNS·NTP·SNMP·CHARGEN)를 반사판으로 악용 — 30byte 요청이 3000byte 응답으로 증폭",
      "핵심 방어: 출발지 IP 위조가 전제이므로 ISP의 egress filtering(위조 패킷 유입 차단)이 근본 대책",
    ],
  },
  {
    title: "RaaS(Ransomware as a Service)",
    course: "SC",
    definition:
      "다크웹과 같은 익명 네트워크를 이용하여 비용만 지급하면 랜섬웨어 공격을 할 수 있도록 서비스 형태로 제공되는 랜섬웨어",
    defShort: "비용만 지급하면 랜섬웨어 공격하도록 서비스 형태로 제공되는 랜섬웨어",
    lead: "구독형 랜섬웨어 서비스, RaaS",
    features: ["낮은 진입 장벽", "수익 배분 분업", "익명 네트워크 이용"],
    keywords: ["익명 네트워크", "랜섬웨어", "서비스"],
    tables: [
      {
        caption: "RaaS 공격 절차",
        headers: ["관계", "단계", "상세 내용"],
        rows: [
          ["공격자 ↔ 제작자", "랜섬웨어 구매\n코드 제공", "구매 의뢰\nTool 제공"],
          ["공격자 ↔ 피해자", "공격 및\n비트코인 제공", "자료 암호화\n복호화 키 대가"],
          ["공격자 ↔ 제작자", "수익 배분\n업데이트", "일정 비율 분배\n애프터서비스"],
        ],
      },
      {
        caption: "RaaS 대응 방안",
        headers: ["대응 방안", "설명"],
        rows: [
          ["백업 수행", "관리자 보안의식 강조\n서버 및 Secure OS\nAnti-Virus 설치"],
          ["사용자 교육", "Mail Filtering\nWeb 방화벽\n백업 서버 망 분리"],
          ["최신 패치", "연관 기관과 지속적인 정보 공유\n사후 처리\n재발 방지"],
          ["화이트리스트 기반관리", "접속/프로세스 실행 원천적 차단"],
        ],
      },
    ],
    notes: [
      "핵심: 랜섬웨어가 '서비스 상품'이 되어 제작자-공격자가 수익을 배분하는 분업 구조 — 기술 없는 사람도 구독만으로 공격 가능해 위협 확산",
    ],
  },
  {
    title: "루트킷(Rootkit)",
    course: "SC",
    definition:
      "최고 관리자 권한(Root)을 탈취해 시스템을 장악한 뒤, 탐지를 피해 숨어 지내며 해커에게 지속적인 불법 접근을 허용하는 악성 소프트웨어 모음(Kit)",
    defShort: "최고 관리자 권한 탈취 후 탐지를 피해 불법 접근을 허용하는 악성 SW 모음",
    lead: "권한 탈취 후 은닉, 루트킷",
    features: ["Root 권한 장악", "탐지 회피 은닉", "지속적 불법 접근"],
    keywords: ["익명 네트워크", "권한상승", "은닉·후킹", "백도어", "User-Mode", "Kernel-Mode", "부트킷", "하이퍼바이저 루트킷"],
    tables: [
      {
        caption: "루트킷의 침투 매커니즘(동작원리)",
        headers: ["단계", "동작원리", "설명"],
        rows: [
          ["초기침투", "공격자,악성코드", "OS·SW 취약점, 사회공학으로 침투\n사용자 모드에서 악성코드 실행"],
          ["초기침투", "권한상승\n(User→Kernel Mode)", "사용자 권한 넘어 커널 권한 획득\n핵심 부분 접근 권한 상승"],
          ["지속성 확보", "은닉 및 후킹\n(감시/변조)", "SSDT·IDT 등 변조\n루트킷 존재·악성 행위 은폐\n탐지 회피"],
          ["지속성 확보", "백도어 설치", "커널 모드 백도어 설치\n원격 접속 경로 확보\n부팅 시 자동 실행"],
          ["악성 공격 수행", "명령 및 제어\n(C2, Command and Control)", "원격 명령으로 시스템 조작\n데이터 탈취, 네트워크 조정"],
          ["악성 공격 수행", "은폐 유지 및 탈취", "커널 수준 은폐, 감시 회피\n장기적 악성 행위 은닉\n시스템 자원 탈취"],
        ],
      },
      {
        caption: "루트킷의 유형",
        headers: ["분류", "유형", "설명"],
        nameCol: 1,
        rows: [
          ["실행 레벨", "사용자 모드 루트킷(User-Mode Rootkit)", "API 후킹으로 프로세스·파일 은폐\n비교적 탐지 쉬움"],
          ["부팅 과정", "부트킷(Bootkit) / MBR 루트킷", "OS 로드 전 MBR·VBR 감염\nOS 재설치해도 지워지지 않음\n강력한 지속성 확보"],
          ["하드웨어", "펌웨어 루트킷(Firmware Rootkit)", "메인보드 BIOS/UEFI\n네트워크 카드, 하드디스크\n펌웨어 자체에 기생\n하드웨어 수준 악성 행위 은폐"],
          ["가상화", "하이퍼바이저 루트킷(Hypervisor Rootkit)", "가상화 기술로 OS를 VM 위로 밀어냄\n아래 계층에서 하위 시스템 통제"],
        ],
      },
    ],
    notes: [
      "은닉 계층이 깊을수록 강력·탐지 곤란: 사용자 모드 < 부트킷(MBR) < 펌웨어 < 하이퍼바이저 순으로 OS보다 낮은 계층을 장악",
      "탐지·대응: XDR·NTA·SIEM·CTI·위협 헌팅·MITRE ATT&CK, AI 기반(UEBA·SOAR)으로 커널·부팅 무결성 검증",
    ],
  },
  {
    title: "OWASP Top 10:2021",
    course: "SC",
    definition:
      "웹 애플리케이션 취약점 중에서 빈도가 많이 발생하고, 보안상 영향을 크게 줄 수 있는 것을 10가지 선정하여 발표하는 보안 기술 가이드",
    defShort: "웹 애플리케이션 취약점 중 빈도·영향 큰 10가지 선정 보안 기술 가이드",
    lead: "웹 취약점 10대 지표, OWASP Top 10:2021",
    features: ["빈도·영향 기반", "웹 취약점 대상", "버전별 순위 변동"],
    keywords: ["취약한 접근 통제", "암호학적 오류", "인젝션", "안전하지 않은 설계", "보안 설정 오류", "취약하고 오래된 컴포넌트", "식별 및 인증 오류", "SW·데이터 무결성 오류", "보안 로깅·모니터링 실패", "서버 측 요청 위조"],
    tables: [
      {
        caption: "OWASP Top 10:2021 취약점과 대응",
        headers: ["NO", "보안 취약점", "설명", "대응 방안"],
        rows: [
          ["A01", "취약한 접근 통제\n(Broken Access Control)", "MSA 증가로\n접근 통제 실패", "서비스별 권한\n설정·적용"],
          ["A02", "암호학적 실패\n(Cryptographic Failures)", "저장·전송 시\n암호화 미적용", "민감도별 분류\nPCI DSS\n암호화 저장"],
          ["A03", "인젝션(Injection)", "비신뢰 데이터가\n쿼리 일부로 전송", "데이터를 명령어\n쿼리에서 분리"],
          ["A04", "안전하지 않은\n설계(Insecure Design)", "제어 설계 누락\n비효율 설계", "보안 개발\n방법론 적용"],
          ["A05", "보안 설정 오류\n(Security\nMisconfiguration)", "취약한 기본 설정\n기본값 미변경", "불필요 기능\n제거·최소화\n기본 보안 설정\n변경"],
          ["A06", "취약하고 오래된\n컴포넌트(Vulnerable\nand Outdated Components)", "알려진 취약점\n컴포넌트 사용", "패치 프로세스\nSW 수명주기 관리"],
          ["A07", "식별 및 인증 실패\n(Identification and\nAuthentication Failures)", "인증·세션 오류\n토큰 노출", "멀티 인증\nAdmin 배포 금지\n세션 사용 금지"],
          ["A08", "SW·데이터\n무결성 실패\n(Software and Data\nIntegrity Failures)", "무결성 확인 없이\n업데이트·CI/CD", "SW·데이터\nHASH 검증"],
          ["A09", "보안 로깅·\n모니터링 실패\n(Security Logging and\nMonitoring Failures)", "로깅·모니터링\n미적용", "통합 모니터링\n로그 분석 시스템"],
          ["A10", "서버 사이드 요청\n위조(SSRF)", "내부 서버로\n조작 요청 전송", "요청 URL 검사\n내부 서버 강화"],
        ],
      },
    ],
    notes: [
      "2021 신규·상승: A01 접근 통제가 5위→1위, A04 안전하지 않은 설계·A08 무결성 실패·A10 SSRF 신설",
      "SQL Injection 흐름: teacherId=117 or 1=1 → SELECT * FROM teachers WHERE 참 → 전체 데이터 반환(A03 인젝션 대표 사례)",
    ],
  },
  {
    title: "OWASP Top 10:2025",
    course: "SC",
    definition:
      "웹 애플리케이션 취약점 중에서 빈도가 많이 발생하고, 보안상 영향을 크게 줄 수 있는 것을 10가지 선정하여 발표하는 보안 기술 가이드(2025 개정)",
    defShort: "웹 애플리케이션 취약점 중 빈도·영향 큰 10가지 선정 보안 기술 가이드",
    lead: "웹 취약점 10대 개정판, OWASP Top 10:2025",
    features: ["빈도·영향 기준", "주기적 개정 발표", "접근 제어 최상위"],
    keywords: ["취약한 접근 제어", "보안 설정 오류", "소프트웨어 공급망 실패", "암호화 실패", "인젝션", "안전하지 않은 설계", "인증 실패", "SW·데이터 무결성 실패", "로깅·경고 실패", "예외적 조건의 오처리"],
    tables: [
      {
        caption: "OWASP Top 10:2025 취약점",
        headers: ["순위·제목", "주요 키워드·기술", "설명"],
        rows: [
          ["A01 Broken Access Control(취약한 접근 제어)", "권한 우회·상승\nSSRF 통합", "타인 데이터 접근\n항목 통합 편입"],
          ["A02 Security Misconfiguration(보안 설정 오류)", "클라우드 설정\n기본 계정·포트", "불완전 구성 실수\n불안전 기본값"],
          ["A03 Software Supply Chain Failures(소프트웨어 공급망 실패)", "CI/CD 침해\n타사 종속성", "빌드 인프라 탈취\n악성 코드 주입"],
          ["A04 Cryptographic Failures(암호화 실패)", "민감 데이터 노출\n취약 알고리즘", "암호화 미적용\n개인정보 유출"],
          ["A05 Injection(인젝션)", "SQL·XSS\nOS 명령 삽입", "쿼리 일부로 해석\n런타임 명령 실행"],
          ["A06 Insecure Design(안전하지 않은 설계)", "위협 모델링 누락\n아키텍처 부재", "설계 단계 미고려\n구조적 설계 결함"],
          ["A07 Authentication Failures(인증 실패)", "세션 탈취\n크리덴셜 스터핑\n취약한 자격 증명", "타인 계정 권한·세션 토큰 탈취\n시스템 접근 위협"],
          ["A08 Software or Data Integrity Failures(SW·데이터 무결성 실패)", "무결성 검증 누락\n악성 업데이트", "SW 갱신 미검증\n조작 코드 실행"],
          ["A09 Logging & Alerting Failures(로깅·경고 실패)", "모니터링 부재\n사고 대응 지연", "로그 기록 부족\n자동 알림 미비"],
          ["A10 Mishandling of Exceptional Conditions(예외적 조건의 오처리)", "예외 처리 미흡\n시스템충돌(DoS)\n상세 오류 노출", "예외 상황 시 서버 마비\n상세 내부 오류 정보 화면 노출\n공격 단초 제공"],
        ],
      },
    ],
    notes: [
      "2021 대비 변화: A03에 '소프트웨어 공급망 실패'가 새로 부상(기존 취약 컴포넌트 확장), SSRF는 A01 접근 제어로 통합, A10에 '예외적 조건의 오처리' 신설",
      "2021과 비교 출제 대비: 접근 제어가 두 판 모두 1위 — 공급망·예외 처리의 신설이 2025의 핵심 차이",
    ],
  },
  {
    title: "시큐어 코딩(Secure Coding)",
    course: "SC",
    definition:
      "해킹 등 사이버 공격의 원인인 보안취약점을 제거해 안전한 소프트웨어를 개발하는 SW 개발 기법",
    defShort: "사이버 공격의 원인인 보안취약점을 제거해 안전한 SW를 개발하는 기법",
    lead: "취약점 원천 차단 개발, 시큐어 코딩",
    features: ["보안약점 사전 제거", "구현 단계 적용", "가이드 기준 준수"],
    keywords: ["입보시에코캡A", "입력값 검증", "보안 기능", "시간 및 상태", "에러 처리", "코드 오류", "캡슐화", "API 오용"],
    tables: [
      {
        caption: "시큐어 코딩 보안약점 제거 7대 항목 [입보시에코캡A]",
        headers: ["항목", "대표 약점"],
        rows: [
          ["입력데이터 검증 및 표현(17)", "SQL·XML 삽입\nLDAP 삽입\nCSRF·SSRF\n파일 업로드"],
          ["보안 기능(16)", "인증 없는 기능\n취약한 암호화\n하드코드 정보"],
          ["시간 및 상태(2)", "경쟁조건(TOCTOU)\n종료되지 않은 반복문·재귀함수"],
          ["에러 처리(3)", "오류메시지 노출\n대응 부재\n부적절 예외 처리"],
          ["코드 오류(5)", "Null 역참조\n부적절 자원해제\n해제 자원 사용"],
          ["캡슐화(4)", "세션 정보 노출\nPrivate 배열 반환\npublic 데이터 할당"],
          ["API 오용(2)", "DNS Lookup 의존\n취약한 API 사용"],
        ],
      },
      {
        caption: "안전한 암호 알고리즘 및 키 길이(보호함수)",
        headers: ["분류", "보호함수 목록"],
        rows: [
          ["최소 안전성 수준", "112비트"],
          ["블록암호", "ARIA(키 길이 128/192/256),\nSEED(키 길이 128)"],
          ["블록암호 운영모드 - 기밀성", "ECB, CBC, CFB, OFB, CTR"],
          ["블록암호 운영모드 - 기밀성/인증", "CCM, GCM"],
          ["해쉬함수", "SHA-224/256/384/512"],
          ["메시지 인증코드 - 해쉬기반", "HMAC"],
          ["메시지 인증코드 - 블록기반", "CMAC, GMAC"],
        ],
      },
    ],
    notes: [
      "7대 항목 두음 [입보시에코캡A]: 입력데이터검증·보안기능·시간및상태·에러처리·코드오류·캡슐화·API오용",
      "취약한 암호 알고리즘 대응: 레인보우 테이블·해시 솔트(Salt)·키 스트레칭과 연계 — '안전한 암호 알고리즘 및 키 길이'로 112비트 이상 권고",
    ],
  },
  {
    title: "SSRF(Server-Side Request Forgery)",
    course: "SC",
    definition:
      "서버 측에 위조된 HTTP 요청을 발생시켜 직접적인 접근이 제한된 서버 내부 자원에 접근하여 외부로 데이터 유출 및 오동작을 유발하는 공격",
    defShort: "위조된 HTTP 요청으로 제한된 서버 내부 자원 유출·오동작 유발 공격",
    lead: "서버를 대리인으로 악용, SSRF",
    features: ["서버측 요청 조작", "내부 자원 접근", "방화벽 내부 우회"],
    keywords: ["서버측 요청 조작", "내부 네트워크 스캔", "원격 코드 실행", "Non-blind SSRF", "Blind SSRF"],
    tables: [
      {
        caption: "SSRF 공격 절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. URL 변조 요청", "스캔으로 SSRF 취약 웹서버 발견\nURL 변조 요청"],
          ["2. 백엔드로 요청 전달", "Private Network 서버로 요청 전달"],
          ["3. 내부 주요 정보 요청", "Private Network 서버가 작업 수행"],
          ["4. 백엔드 결과 응답", "공격자에게 필요한 정보 전송"],
        ],
      },
      {
        caption: "SSRF 공격 유형과 대응",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["공격 유형", "Non-blind SSRF", "악의적 요청의 반환 데이터 노출"],
          ["공격 유형", "Blind SSRF", "유출 아닌 유해 작업 수행 초점"],
          ["대응", "One Time Token 사용", "예측 불가 토큰 값 매 요청 인증 사용"],
          ["대응", "입력값 검증", "입력값·파라미터 유효성 검증"],
          ["대응", "쿠키 관리", "쿠키 내 중요정보 미포함\n쿠키 외 추가 인증 처리"],
          ["대응", "인증 강화", "민감 데이터 재인증 요청 등"],
          ["대응", "From Network Layer", "Segment remote resource access\ndeny by default firewall"],
          ["대응", "From Application Layer", "URL schema, port allow list\nDisable HTTP redirections"],
        ],
      },
      {
        caption: "SSRF와 CSRF(Cross-Site Request Forgery) 비교",
        headers: ["비교 항목", "SSRF", "CSRF"],
        rows: [
          ["공격 위치", "서버 측 공격", "클라이언트 측"],
          ["공격 대상", "직접 접속 불가\n내부 서버 대상", "클라이언트 연결\n가능한 서버 대상"],
          ["공격 요청", "신뢰된 서버 요청", "인가 사용자 요청"],
          ["필수 요소", "외부 접근 가능\n취약 서버 필요", "인가된 사용자\n정상 요청 필요"],
        ],
      },
    ],
    notes: [
      "SSRF는 OWASP Top 10:2021 A10 신규 항목 — 2025판에서는 A01 접근 제어로 통합됨",
      "SSRF vs CSRF: SSRF는 서버가 위조 요청의 주체(내부 자원 노림), CSRF는 사용자 브라우저가 주체(사용자 권한 도용)",
    ],
  },
  {
    title: "SW난독화",
    course: "SC",
    definition:
      "소스 코드나 바이너리를 의도적으로 변형하여 사람이 쉽게 이해하지 못하여 SW를 보호하는 기술",
    defShort: "소스 코드나 바이너리를 의도적으로 변형해 이해 못하게 SW 보호 기술",
    lead: "이해를 막는 코드 변형, SW난독화",
    features: ["실행 결과 동일", "이해 가능성 저하", "역공학 방지"],
    keywords: ["구획", "데이터", "집합", "제어", "예방"],
    tables: [
      {
        caption: "SW 난독화 분류",
        headers: ["기법", "주요 기술", "설명"],
        rows: [
          ["구획 난독화", "형식 변환\n주석 제거\n식별자 손상", "큰 영향 없는 세부 요소 변화·제거"],
          ["데이터 난독화", "변수 자르기\n정적 자료 절차화", "데이터 변수 분할\n읽기 어렵게 변환"],
          ["집합 난독화", "자료 순서 변환\n병합과 평탄화\n클래스의 분할", "순서 이용 코드 난독화"],
          ["제어 난독화", "Aggregation\nOrdering\nComputation", "문장이 묶이지 않는 단위 조절"],
          ["예방 난독화", "Targeted\nInherent", "알려진 역난독화 방법 봉쇄"],
        ],
      },
      {
        caption: "SW 난독화 주요 기술(모드)",
        headers: ["구분", "모드", "설명"],
        rows: [
          ["식별자", "심볼 정보 제거", "배치 난독화 심볼 제거 기법\n메소드·변수명 의미 파악 최소화"],
          ["코드", "코드 암호화", "암호키·해독키 코드 암호화 수행\n해독키 보호 하드웨어에 숨김"],
          ["제어", "제어 흐름 변환", "계산·집합 변환 변환 기법 활용\n순서 변환 활용 제어 흐름 왜곡"],
          ["데이터", "자료 난독화", "변수 인코딩 변환 변수 표현 변경\n배열 재구성 배열 구조 재편"],
        ],
      },
    ],
    notes: [
      "SW난독화의 목적: 리버스 엔지니어링 방지, 소프트웨어 무단 복제·크랙 방지, 보안 강화 및 취약점 보호, 저작권·라이선스 보호",
      "핵심: 난독화 전 결과 = 난독화 후 결과(실행 결과는 동일, 이해 가능성만 낮춤)",
    ],
  },
  {
    title: "DevSecOps",
    course: "SC",
    definition:
      "개발(Development)과 운영(Operation)의 융합과 협업의 개발 주기에 보안(Security) 측면을 포함한 개발 방법론",
    defShort: "개발과 운영의 융합과 협업의 개발 주기에 보안 측면을 포함한 개발 방법론",
    lead: "개발·보안·운영의 통합, DevSecOps",
    features: ["보안 좌측 이동", "CI/CD 보안 평가", "Security as Code"],
    keywords: ["개발과 운영에 보안 통합", "CI/CD", "구현 도구"],
    tables: [
      {
        caption: "DevSecOps 작동 방식",
        headers: ["방식", "설명"],
        rows: [
          ["DevOps", "개발·운영 통합 팀 통합 개발 진행"],
          ["CI/CD", "자동화 구축 빌드 자동 수행\n자동화 테스트 신규 앱 제공"],
          ["DevSecOps", "CI/CD 보안 전 과정 보안 평가\n개발·운영 협업 보안팀 협업 감시"],
        ],
      },
      {
        caption: "DevSecOps 구현 요소(핵심 성공 요소)",
        headers: ["요소", "핵심 성공 요소"],
        rows: [
          ["문화", "보안 조직의 조기\n참여"],
          ["프로세스", "프로세스 초기에\n보안 분석 및\n테스트"],
          ["자동화", "코드 보안 관리(Security as\nCode)"],
          ["도구", "보안 점검 도구"],
          ["성과 평가", "보안코드 품질\n점수"],
        ],
      },
      {
        caption: "DevSecOps 구현 도구와 보안 기능(SDLC)",
        headers: ["구분", "SDLC/영역", "기술"],
        rows: [
          ["도구", "Code\nBuild\nTest\nRelease", "형상관리·추적성\n자동 빌드 도구\n커버리지 자동화\n변경관리·릴리즈"],
          ["보안 기능", "Security Engineering\nSecurity Operations\nSecurity Science", "공학 접근·도구\n지속 모니터링\n모델 수립·전파"],
        ],
      },
    ],
    notes: [
      "개념도: Dev(Create·Plan·Verify·Preprod) ↔ Sec ↔ Ops(Prevent·Detect·Respond·Predict)의 무한 루프 — Continuous Delivery",
      "핵심: 보안을 개발 마지막이 아니라 전 주기에 앞당겨 통합(Shift-Left, Security as Code)",
    ],
  },
  {
    title: "개인정보보호 중심 설계(Privacy by Design)",
    course: "SC",
    definition:
      "프라이버시 위협을 예측·예상하거나 가능성을 대비하여 서비스 기획/설계 단계 등 사전에 예방하는 설계",
    defShort: "프라이버시 위협을 예측·예상해 기획/설계 단계 등 사전 예방하는 설계",
    lead: "설계 단계의 사전 예방, PbD",
    features: ["사전예방", "초기설정 보호", "설계 내재화"],
    keywords: ["Design", "Coverage", "Usability", "7대 원칙", "사전대비", "기본값 설정", "기획단계 고려", "포괄적 기능성 보장", "수명주기보호", "가시성·투명성", "사용자 중심"],
    tables: [
      {
        caption: "PbD의 7대 기본 원칙",
        headers: ["구분", "원칙", "설명"],
        rows: [
          ["Design", "1) 사후조치가 아닌 사전예방", "침해 사고 발생 후 조치 아닌\n침해사건 예상, 사전 예방"],
          ["Design", "2) 초기설정부터 프라이버시 보호 조치", "IT시스템·사업 기본값 설정\n자동으로 프라이버시 최대 보장"],
          ["Design", "3) 프라이버시 보호를 내재한 설계", "설계에 프라이버시 보호 내재화\nIT시스템·개인정보 처리와 통합"],
          ["Coverage", "4) 프라이버시보호와 사업 기능의 균형(제로섬이 아닌 포지티브섬)", "어느 하나도 포기하지 않음\n안전한 보호·기능성 모두 확보"],
          ["Coverage", "5) 개인정보 생애주기 전체에 대한 보호", "수집·이용·저장·제공·파기\n전 단계 안전조치 적용"],
          ["Usability", "6) 개인정보 처리과정에 대한 가시성 및 투명성 유지", "처리과정 정보주체가 명확히 이해\n신뢰성 제고"],
          ["Usability", "7) 이용자 프라이버시 존중", "명시적 보호 체계 없어도\n사용자 프라이버시 보장 활동"],
        ],
      },
      {
        caption: "PbD의 적용 절차",
        headers: ["모드", "설명"],
        rows: [
          ["파악", "수집·이용 전체 데이터 현황 파악"],
          ["분석", "개인정보 항목·유형 분석\n식별자·속성정보 등"],
          ["결정", "항목별 수집근거(동의 등) 결정\n활용방식(가명처리 등) 결정"],
          ["예방", "처리 흐름도 작성 사전수행\n위험성·침해요인 분석\n대안 마련"],
        ],
      },
    ],
    notes: [
      "3영역 분류: Design(사전대비·기본값 설정·기획단계 고려) / Coverage(포괄적 기능성 보장·수명주기 보호) / Usability(가시성·투명성·사용자 중심)",
      "핵심: 개인정보 보호를 '사후'가 아닌 '설계 단계에서 기본값으로' — PbD 표준은 ISO 31700",
    ],
  },
  {
    title: "PbD(Privacy by Design) 인증제도",
    course: "SC",
    definition:
      "일상생활에서 밀접하게 활용되는 기기를 중심으로 개인정보가 안전하게 보호되는지 개인정보 보호 중심 설계(PbD)를 검증하는 제도",
    defShort: "기기 개인정보가 보호되는지 개인정보 보호 중심 설계를 검증하는 제도",
    lead: "기기 중심 PbD 검증, PbD 인증제도",
    features: ["보호 중심 설계 검증", "일상 기기 대상", "ISO 31700 기반"],
    keywords: ["기본적인 요구사항", "개인정보 처리의 적법성", "정보보안 및 프라이버시 강화", "조직적 보호조치", "ISO 31700"],
    tables: [
      {
        caption: "Privacy By Design 인증제도 인증기준(71영역)",
        headers: ["인증영역(71영역)", "인증항목"],
        rows: [
          ["Ⅰ. 기본적인 요구사항(14항목)", "개인정보 식별 및 목적\n개인정보 처리 흐름\n처리 단계별 보호조치"],
          ["Ⅰ. 기본적인 요구사항(14항목)", "처리 주체 식별\n불필요한 개인정보 전달 방지"],
          ["Ⅱ. 개인정보 처리의 적법성(26항목)", "아동 등 개인정보 처리 동의\n마케팅 목적 처리 동의\n개인위치정보 처리 동의\n민감·고유식별정보 처리 적합성"],
          ["Ⅱ. 개인정보 처리의 적법성(26항목)", "정보주체 이외 수집 제한\n개인정보 이용 및 제공 제한\n개인정보 파기·처리 투명성\n열람·정정·삭제·처리정지 요구"],
          ["Ⅲ. 정보보안 및 프라이버시 강화(22항목)", "안전한 인증정보 사용\n사용자 인증 및 권한 관리\n반복된 인증 시도 제한\n안전한 암호 알고리즘 사용"],
          ["Ⅲ. 정보보안 및 프라이버시 강화(22항목)", "안전한 업데이트 수행\n정보 노출 방지\n중요정보 완전 삭제\n원격 접속 통제"],
          ["Ⅲ. 정보보안 및 프라이버시 강화(22항목)", "프라이버시 강화 기술 적용"],
          ["Ⅳ. 조직적 보호조치(7항목)", "개인정보 처리방침 수립\n개인정보 안전성 확보\n개인정보보호 책임자 임명\n개인정보 사고 대응"],
        ],
      },
      {
        caption: "PBD의 8대 전략",
        headers: ["구분", "원칙", "설계 패턴"],
        rows: [
          ["데이터 지향 전략", "최소화\n숨기기\n분리\n총계화", "수집최소화/익명·가명\n암호화\n(알려지지 않음)\nK-익명성·차등프라이버시"],
          ["프로세스 중심 설계", "정보제공\n통제\n집행\n입증", "데이터 유출 알림\nID 관리·암호화\n접근통제·보호\n감사 기록"],
        ],
      },
    ],
    notes: [
      "8대 전략 = 데이터 지향(최소화·숨기기·분리·총계화) + 프로세스 중심(정보제공·통제·집행·입증)",
      "PbD 설계 원칙(7대)을 실제 기기·서비스에서 검증하는 인증제도 — 표준 근거는 ISO 31700",
    ],
  },
  {
    title: "가명처리(Pseudonymization) 기법",
    course: "SC",
    definition:
      "개인정보의 일부를 삭제하거나 일부 또는 전부를 대체하는 등의 방법으로 추가 정보가 없이는 특정 개인을 알아볼 수 없도록 처리하는 기술(개인정보보호법 제2조1의2)",
    defShort: "개인정보 삭제·대체로 추가 정보 없이 특정 개인 알아볼 수 없게 처리 기술",
    lead: "추가 정보 없는 식별 불가, 가명처리",
    features: ["일부 삭제·대체", "추가정보 결합 제한", "ISO/IEC 20889 기반"],
    keywords: ["직접식별자(고유식별자)", "간접식별자(준식별자)", "속성정보", "특이정보(민감정보)", "삭제(삭제, 마스킹)", "통계(총계)", "일반화(랜덤/제어/일반 라운딩, 범주화)", "암호화(동형, 순서보존, 형태보존, 다형성)", "무작위화(잡음, 치환, 토큰화)", "기타(차분 프라이버시, 샘플링)", "ISO/IEC 20889"],
    tables: [
      {
        caption: "가명 처리 기법",
        headers: ["구분", "항목"],
        rows: [
          ["삭제기술", "삭제, 마스킹"],
          ["통계도구", "총계처리, 부분 총계"],
          ["일반화", "일반 라운딩\n랜덤 라운딩(Random rounding)\n제어 라운딩\n(Controlled rounding)"],
          ["일반화", "상하한코딩\n(Top and bottom coding)\n로컬 일반화\n범위 방법(Data range)"],
          ["일반화", "문자 데이터 범주화"],
          ["암호화", "양방향 암호화\n암호학적 해쉬함수\n순서보존 암호화\n형태보존 암호화"],
          ["암호화", "동형암호화\n다형성 암호화"],
          ["무작위화 기술", "잡음 추가, 치환, 토큰화\n(의사)난수생성기((P)RNG)\nPseudo Random Number Generator"],
          ["기타 기술", "표본추출(Sampling)\n해부화(Anatomization)\n재현데이터(Synthetic data)"],
          ["기타 기술", "동형비밀분산\n(Homomorphic secret sharing)\n차분 프라이버시\n(Differential privacy)"],
        ],
      },
      {
        caption: "가명 처리 대상",
        headers: ["구분", "대상", "설명"],
        rows: [
          ["식별자", "직접식별자(고유식별자)", "주체 고유 부여 자체 식별성 강함"],
          ["식별자", "간접식별자(준식별자)", "보편적 이용 정보 고유 부여 아님\n타 정보 결합 개인 식별 용이"],
          ["속성", "속성정보", "처리자만 보유 결합 시 식별 곤란"],
          ["속성", "특이정보(민감정보)", "해당 주체만 해당 누구든 식별 가능"],
        ],
      },
    ],
    notes: [
      "개인식별정보(PII) = 직접 식별자 + 간접 식별자",
      "가명정보: 가명처리함으로써 원래의 상태로 복원하기 위한 추가 정보의 사용·결합 없이는 특정 개인을 알아볼 수 없는 정보 — 표준 근거 ISO/IEC 20889",
    ],
  },
  {
    title: "가명정보 처리 가이드라인",
    course: "SC",
    definition:
      "기업과 개인이 안전하게 가명처리할 수 있도록 개인정보보호위원회에서 발표한 공식 지침",
    defShort: "기업·개인이 안전하게 가명처리하도록 개인정보보호위원회가 낸 지침",
    lead: "가명처리의 공식 지침, 가명정보 처리 가이드라인",
    features: ["정보주체 동의 예외", "추가정보 분리 보관", "적정성 검토 필수"],
    keywords: ["직접식별자(고유식별자)", "간접식별자(준식별자)", "속성정보", "특이정보(민감정보)", "삭제(삭제, 마스킹)", "통계(총계)", "일반화(랜덤/제어/일반 라운딩, 범주화)", "암호화(동형, 순서보존, 형태보존, 다형성)", "무작위화(잡음, 치환, 토큰화)", "기타(차분 프라이버시, 샘플링)", "ISO/IEC 20889"],
    tables: [
      {
        caption: "가명 정보",
        headers: ["구분", "설명"],
        rows: [
          ["가명정보", "가명처리 거쳐 생성된 정보\n특정 개인을 알아볼 수 없도록 처리"],
          ["가명처리", "일부 삭제, 일부 또는 전부 대체\n추가정보 없이 개인 알아볼 수 없게"],
          ["적용대상", "개인정보보호법 제3장 제3절 근거\n통계작성, 과학적 연구\n공익적 기록보존 등 가명정보 처리"],
          ["관련근거", "가명정보의 처리 등\n개인정보보호법 제28조의 2\n가명정보의 결합 제한\n개인정보보호법 제28조의 3"],
        ],
      },
      {
        caption: "가명 정보 처리 절차",
        headers: ["단계", "내용"],
        rows: [
          ["1단계", "목적 설정 등 사전준비\n재점검"],
          ["2단계", "위험성 검토\n재검토"],
          ["3단계", "가명처리\n추가 가명처리"],
          ["4단계", "적정성 검토"],
          ["5단계", "안전한 관리"],
        ],
      },
      {
        caption: "가명 정보의 안전한 관리를 위한 보호조치",
        headers: ["구분", "보호조치", "관련법령"],
        rows: [
          ["관리적 보호조치", "내부 관리계획\n수탁자 감독\n처리방침 공개", "시행령\n제29조의5\n제26조·제30조"],
          ["기술적 보호조치", "추가정보 분리\n접근권한 분리\n처리 기록 보관", "개인정보 보호법\n시행령\n제29조의5"],
          ["물리적 보호조치", "출입 통제 절차\n보조저장매체\n반출입 통제", "N/A"],
          ["정보주체 권리보장", "가명처리 정지\n요구 시 보장", "보호법 제37조\n제28조의5"],
        ],
      },
      {
        caption: "가명 정보 결합 및 반출 절차",
        headers: ["단계", "내용"],
        rows: [
          ["1단계", "결합신청"],
          ["2단계", "결합 및 추가처리"],
          ["3단계", "반출 및 활용"],
          ["4단계", "안전한 관리"],
        ],
      },
    ],
    notes: [
      "관련 근거: 가명정보의 처리(개인정보보호법 제28조의2), 가명정보의 결합 제한(제28조의3)",
      "보호조치 3종: 관리적(내부 관리계획)·기술적(추가정보 분리 보관·접근권한 분리)·물리적(출입 통제)",
    ],
  },
  {
    title: "Secure Software Development Framework(SSDF)",
    course: "SC",
    definition:
      "소프트웨어 개발 생명 주기(SDLC)의 모든 단계에 걸친 보안 관행 통합 및 조직이 보안 소프트웨어 개발에 대한 체계적인 접근 방식",
    defShort: "SDLC 전 단계 보안 관행 통합 및 조직의 보안 SW 개발 체계적 접근 방식",
    lead: "SDLC 보안 통합 체계, SSDF",
    features: ["SDLC 전 단계 보안", "결과 중심 관행", "NIST 800-218 기반"],
    keywords: ["조직 준비(PO)", "SW 보호(PS)", "보안이 잘된 SW 제작(PW)", "취약점 대응(RV)"],
    tables: [
      {
        caption: "SSDF의 구성과 단계",
        headers: ["구성", "주요 수행 활동", "설명"],
        rows: [
          ["조직 준비(PO, Prepare the Organization)", "보안 요구 정의\n역할·책임 구분\n툴체인 구현\n안전 개발환경", "모든 단계 보안 포함 준비 확인\n조직을 구성하는 단계"],
          ["SW 보호(PS, Protect the Software)", "무단 액세스 보호\n변조 방지\n무결성 검증 구성\n릴리스 보관", "보호 방법·작업·사례·자료 식별"],
          ["보안이 잘된 SW 제작(PW, Produce Well Secured Software)", "요구충족·위험완화\nSW 재사용\n보안 코딩 준수\n코드 검토·분석", "안전한 코드 작성 Practices 포함"],
          ["취약점 대응(RV, Respond to Vulnerabilities)", "취약점 지속 검색\n평가·우선순위화\n근본 원인 분석", "지속적 취약점 검색·대응 단계"],
        ],
      },
    ],
    notes: [
      "구성 4단계 두음: 조직 준비(PO) → SW 보호(PS) → 보안이 잘된 SW 제작(PW) → 취약점 대응(RV)",
      "NIST SP 800-218 기반 — DevSecOps·시큐어 코딩의 상위 프레임워크로, SDLC 전 단계에 보안 관행을 매핑",
    ],
  },
  {
    title: "DNS 싱크홀(Sinkhole)",
    course: "SC",
    definition:
      "악성봇에 감염된 PC가 해커의 명령을 받기 위해 C&C로 연결 시도 할 때, C&C 대신 싱크홀 서버로 우회시켜 조종 명령을 받지 않도록 해주는 시스템",
    defShort: "C&C로 연결 시도 시 싱크홀 서버로 우회시켜 조종 명령 받지 않는 시스템",
    lead: "C&C 연결 차단 우회, DNS 싱크홀",
    features: ["DNS 응답 조작", "C&C 통신 차단", "감염 현황 파악"],
    keywords: ["블랙홀 라우팅", "C&C서버", "좀비 PC", "타겟시스템", "악성봇"],
    tables: [
      {
        caption: "DNS 싱크홀 적용 전후 비교",
        headers: ["구분", "설명"],
        rows: [
          ["적용 전", "악성봇 질의 C&C IP 응답\nC&C 접속 악의 명령 전달"],
          ["적용 후", "악성봇 질의 싱크홀 IP 응답\n싱크홀 접속 명령 전달 차단"],
        ],
      },
    ],
    notes: [
      "동작 원리: DNS 질의 단계에서 C&C 도메인을 싱크홀 서버 IP로 응답 → 감염 PC가 해커 대신 싱크홀에 접속 → 명령 차단·감염 현황 파악",
      "국내는 KISA가 싱크홀 서버 운영 — 블랙홀 라우팅과 유사하나 DNS 응답을 조작해 우회시킨다는 점이 특징",
    ],
  },
  {
    title: "DNSSEC(Domain Name System Security Extension)",
    course: "SC",
    definition:
      "공개키 암호화방식의 전자서명을 적용해 DNS 데이터 대상의 데이터 위조·변조 공격을 방지하기 위한 인터넷 표준",
    defShort: "공개키 암호화방식 전자서명, DNS 데이터 위조-변조 공격 방지 표준",
    lead: "DNS 무결성 보장, DNSSEC",
    features: ["공개키 전자서명", "데이터 무결성 검증", "캐시 포이즈닝 방지"],
    keywords: ["DNSKEY", "파밍(pharming)", "DNS 캐시 포이즈닝(cache poisoning) 공격", "공개키", "전자서명"],
    tables: [
      {
        caption: "DNSSEC 작동 방식",
        headers: ["방식", "설명"],
        rows: [
          ["ⓐ 서명용 키 생성", "개인키·공개키 공개키 공개 배포"],
          ["ⓑ 원본 데이터 서명", "A 서명 수행 서명 데이터 생성"],
          ["ⓒ 서명 데이터 전송", "원본+서명 전송 인터넷 B 전송"],
          ["ⓓ 데이터 수신", "B 데이터 수신 원본·서명 수신"],
          ["ⓔ 공개키 조회", "A 공개키 조회 B 공개키 파악"],
          ["ⓕ 서명 검증", "공개키 검증 원본·서명 검증"],
        ],
      },
      {
        caption: "DNSSEC 각 리소스 레코드의 역할",
        headers: ["Resource Record", "역할", "설명"],
        rows: [
          ["상위 DNS Server의 공개키", "DNSKEY", "존 공개키 포함"],
          ["원본 데이터", "일반 DNS 레코드\nNSEC/NSEC3, DS", "전달할 레코드 데이터"],
          ["서명 데이터", "RRSIG", "서명·검증 정보"],
        ],
      },
    ],
    notes: [
      "방어 대상: DNS 캐시 포이즈닝·파밍(pharming) — 가짜 DNS 응답으로 사용자를 악성 사이트로 유도하는 공격을 전자서명 검증으로 차단",
      "핵심: DNS 응답에 전자서명을 붙여 '위조되지 않았음'을 검증 — ZSK(Zone Signing Key)로 레코드 해시를 검증",
    ],
  },
  {
    title: "IPSec",
    course: "SC",
    definition:
      "IP계층의 취약점 보완 목적, IP 계층 기반으로 한 보안 프로토콜들을 제공하는 개방 구조의 프로토콜 모음",
    defShort: "IP 계층 기반 보안 프로토콜들을 제공하는 개방 구조의 프로토콜 모음",
    lead: "IP 계층의 보안 통신, IPSec",
    features: ["IP 계층 보안", "개방 구조", "SA 기반 보안 정책"],
    keywords: ["IP 계층 보안", "AH", "ESP", "SAD", "SPD", "IKE", "SA", "전송 모드", "터널 모드"],
    tables: [
      {
        caption: "IPSec 구조와 구성 요소",
        headers: ["분류", "구성 요소", "설명"],
        nameCol: 1,
        rows: [
          ["프로토콜", "인증 프로토콜(AH)", "Authentication Header\n무결성, 인증, Replay 공격 방지"],
          ["프로토콜", "암호화 프로토콜(ESP, Encapsulation Security Protocol)", "보안 페이로드 캡슐화\n패킷 암호화 프로토콜, IETF 표준\n기밀성, 무결성, 인증 별도 제공"],
          ["데이터베이스", "보안 연계데이터베이스(SAD)", "연결별 정의된 SA 데이터베이스\nSA를 엔트리로 저장\nIP·프로토콜·SPI로 구분"],
          ["데이터베이스", "보안 정책데이터베이스(SPD)", "관리자 정의 보안정책 DB\n트래픽 폐기·IPSec 통과 결정"],
          ["키 교환", "IKE(Internet Key Exchange Protocol)", "키 관리 서비스, 생성·분배 담당\nAH·ESP 한방향 당 2개 키 필요"],
          ["보안 연계", "SA(Security Association)", "교환 전 통일할 요소\n암호 알고리즘, 키 교환 방법·주기"],
        ],
      },
      {
        caption: "IPSec 전송 모드",
        headers: ["분류", "지원(보호) 구간", "대상(주요 사용)", "설명"],
        rows: [
          ["전송 모드(Transport Mode)", "IP 페이로드만\n보호(헤더 제외)", "종단 호스트 간\nPC ↔ 서버", "원본 헤더 유지\n종단 장치 처리"],
          ["터널 모드(Tunnel Mode)", "원본 패킷 전체\n헤더+페이로드", "게이트웨이 간\n본사 ↔ 지사", "새 IP 헤더 추가\nVPN 구성 사용"],
        ],
      },
    ],
    notes: [
      "AH는 무결성·인증만, ESP는 암호화(기밀성)까지 — VPN은 주로 ESP 터널 모드로 구성",
      "전송 모드=종단 간(페이로드만 보호), 터널 모드=게이트웨이 간(패킷 전체 보호, 새 IP 헤더) 대비가 시험 포인트",
    ],
  },
  {
    title: "TLS/SSL(Secure Socket Layer)",
    course: "SC",
    definition:
      "보호되지 않는 네트워크 환경에서 안전한 통신을 목적으로 응용 계층과 TCP 계층 사이에서 동작하는 데이터 암호화 프로토콜",
    defShort: "응용 계층과 TCP 계층 사이 안전한 통신 위한 데이터 암호화 프로토콜",
    lead: "응용-전송 계층의 암호화, TLS/SSL",
    features: ["응용·TCP 사이", "하이브리드 암호", "세션키 협상"],
    keywords: ["대칭키", "비대칭키", "Handshake", "Change cipher spec", "Alert", "Record"],
    tables: [
      {
        caption: "TLS/SSL 구성 요소",
        headers: ["구분", "구성요소", "내용"],
        rows: [
          ["동작 관리", "SSL Handshake Protocol\nSSL Change Cipher Spec\nSSL Alert Protocol", "상호 인증·키\n협상 암호 적용\n종료·오류 알림"],
          ["보안 서비스", "SSL Record Protocol", "기밀성·무결성\n단편화·암호화\nMAC·압축\n대칭·Hash"],
        ],
      },
      {
        caption: "TLS/SSL Handshake 단계",
        headers: ["단계", "프로토콜", "동작내역"],
        rows: [
          ["협상", "Client Hello\nServer Hello\nServer Certificate\nCertificate Request", "커넥션 요청\n준비 완료 알림\n서버 인증서 전송\n클라 인증서 요청"],
          ["보안키 공유", "Client Key Exchange\nChange Cipher Spec", "공개키로 암호화\n알고리즘 정보"],
          ["전송", "Application Data", "암호화하여 전송"],
        ],
      },
    ],
    notes: [
      "핵심: 비대칭키로 대칭키(세션키)를 안전하게 교환하고, 이후 실제 데이터는 빠른 대칭키로 암호화 — 하이브리드 방식",
      "위치: 응용 계층과 TCP 계층 사이(SSL 상위: Handshake·Change Cipher Spec·Alert / SSL 하위: Record Protocol)",
    ],
  },
  {
    title: "VPN(Virtual Private Network)",
    course: "SC",
    definition:
      "암호화된 터널을 통해 인터넷에 연결함으로써 공중망(인터넷망)을 사설망(전용회선)처럼 이용할 수 있는 네트워크 서비스",
    defShort: "암호화된 터널로 공중망을 사설망처럼 이용할 수 있는 네트워크 서비스",
    lead: "공중망 위의 사설 터널, VPN",
    features: ["터널링", "암호화 기밀성", "가상 전용회선"],
    keywords: ["터널링", "암호화", "기밀성", "무결성", "SSL VPN", "IPSec VPN", "MPLS VPN"],
    tables: [
      {
        caption: "VPN 기술 요소",
        headers: ["구분", "요소", "설명"],
        rows: [
          ["경로", "터널링", "가상경로 설정 공중망 터널 경로"],
          ["기밀성", "암호화", "터널 패킷 암호화 기밀성 제공\n공개키 방식 암호화 방식 사용"],
          ["무결성", "인증", "MAC·해시 메시지 무결성"],
          ["통제", "접근 제어", "패킷 필터링 회선 접근 제어"],
        ],
      },
      {
        caption: "VPN 종류",
        headers: ["구분", "종류", "설명"],
        rows: [
          ["응용 계층", "SSL VPN", "TLS 프로토콜 SSL 기반 보안\n웹 브라우저 별도 장비 불필요"],
          ["네트워크 계층", "IPSec VPN", "IPSec 사용 IP 계층 보안\n보안성 우수 초기 도입비 높음"],
          ["전달망", "MPLS VPN", "MPLS 기술 패킷 스위칭 이용\n확장성·통합성 동일 ISP망 내"],
        ],
      },
      {
        caption: "IPSec VPN과 SSL VPN 비교",
        headers: ["비교", "IPSec VPN", "SSL VPN"],
        rows: [
          ["정의", "네트워크 계층\n암호화·터널링", "애플리케이션계층\nSSL/TLS 데이터 보호"],
          ["Network Layer", "L3 계층", "L4~L7 계층"],
          ["동작 방식", "IP 패킷 암호화\n종단간 보호", "SSL 터널링\n패킷 암호화"],
          ["인증 방식", "비밀키 공유", "인증서 기반"],
          ["장단점", "설치·운영 부담\n관리 부담 큼", "설치·관리 편리\n비용 절감 효과"],
          ["장단점", "빠른 처리 속도\n다수 접속 지원", "처리 속도 느림\n접속자 수 적음"],
        ],
      },
    ],
    notes: [
      "IPSec VPN=Layer 3 종단간(빠름·설치 부담), SSL VPN=Layer 4~7 웹 기반(설치 편리·속도 느림) 대비가 시험 포인트",
    ],
  },
  {
    title: "CWPP(Cloud Workload Protection Platform) & CSPM(Cloud Security Posture Management)",
    course: "SC",
    definition:
      "[CWPP] 물리적 컴퓨터, 가상 머신, 컨테이너, 서버리스 워크로드 등에 대한 일관된 제어 및 가시성을 확보하고 클라우드 서버 워크로드를 보호하기 위한 솔루션 / [CSPM] 클라우드 기반 시스템 및 인프라에서 위험과 잘못된 구성을 지속적으로 모니터링하는 프로세스",
    defShort: "클라우드 서버 워크로드 보호 솔루션과 잘못된 구성 모니터링 프로세스",
    defPair: [
      {
        name: "CWPP(Cloud Workload Protection Platform)",
        lead: "워크로드 보호의 플랫폼",
        def: "일관된 제어·가시성 확보, 클라우드 서버 워크로드 보호 위한 솔루션",
        features: ["실행 위협 보호", "위·변조 감시", "IaaS 중심"],
      },
      {
        name: "CSPM(Cloud Security Posture Management)",
        lead: "구성 오류 감시의 프로세스",
        def: "클라우드 인프라 위험과 잘못된 구성을 지속적으로 모니터링 프로세스",
        features: ["잘못된 구성 감시", "컴플라이언스 확인", "PaaS 중심"],
      },
    ],
    lead: "클라우드 보안의 두 축, CWPP와 CSPM",
    features: ["내부·외부 위협", "IaaS·PaaS 분담", "상호 보완 관계"],
    keywords: ["외부", "인프라", "구성", "규정 준수 위반", "내부", "내부 실행 위협", "워크로드"],
    tables: [
      {
        caption: "CSPM과 CWPP 비교",
        headers: ["구분", "CSPM", "CWPP"],
        rows: [
          ["정의", "인프라 위험 관리\n예방·탐지", "워크로드 보안\n안정적 구성 보장"],
          ["특징", "보안설정 관리", "워크로드 보호"],
          ["목적", "서비스 구성 위험\n평가·관리", "서버 워크로드\n실행 위협 보호"],
          ["적용환경", "PaaS 중심\n일부 IaaS", "IaaS 중심\n일부 PaaS"],
          ["핵심기능", "컴플라이언스\n지속적 확인", "무결성 점검\n위·변조 감시"],
          ["핵심기능", "멀티 클라우드\n통합 자산 가시성", "어플리케이션상태감시\n계정·로그 감시"],
          ["핵심기능", "", "방화벽 차단 로그\n호스트 방화벽"],
          ["구성요소", "Compliance Assessment\nRisk Identification\nOperational Monitoring", "Exploit Protection\nApplication Whitelisting\nSystem Integrity"],
          ["구성요소", "DevSecOps Integration\nThreat Protection\nPolicy Enforcement", "Network Segmentation\nSystem Monitoring\nWorkload Configuration"],
        ],
      },
    ],
    notes: [
      "한 줄 구분: CWPP는 워크로드 보호(애플리케이션·컨테이너·VM 보안), CSPM은 설정·규정 준수 관리(클라우드 설정 오류·정책 위반 탐지)",
      "Gartner 클라우드 보안 커버리지: CASB·CSPM·CWPP·SASE가 SaaS/IaaS/PaaS를 계층별로 담당",
    ],
  },
  {
    title: "SASE(Secure Access Service Edge)",
    course: "SC",
    definition:
      "광역 네트워킹(WAN)과 네트워크 보안 서비스(예: CASB, FWaaS, 제로 트러스트)를 통합하여 제공하는 클라우드 기반 서비스 모델",
    defShort: "광역 네트워킹과 네트워크 보안을 통합 제공하는 클라우드 서비스 모델",
    lead: "네트워크와 보안의 통합, SASE",
    features: ["WAN·보안 통합", "클라우드 기반 제공", "제로 트러스트 접근"],
    keywords: ["SD-WAN", "보안", "Network as a Service", "Network Security as a Service"],
    tables: [
      {
        caption: "SASE 구성 요소",
        headers: ["구성요소", "핵심기술", "설명"],
        rows: [
          ["네트워크 서비스", "SD-WAN", "SD-WAN Controller·CPE로 구성\n사업자·제공자 WAN으로 확장 적용"],
          ["네트워크 서비스", "SD-브랜치", "프로그래밍 가능 오케스트레이션\n지사 환경에 IT 인프라 제공\nLAN·Wi-Fi·SD-WAN·라우팅·보안"],
          ["보안 서비스", "CASB", "이용자·서비스 사이 독립 보안 SW"],
          ["보안 서비스", "SECaaS", "CSP SECaaS·SSP SECaaS 제공\n클라우드 보안 서비스"],
          ["보안 서비스", "ZTNA", "경계선(perimeter) 보안 개념\n데이터별 microperimeter 적용"],
        ],
      },
    ],
    notes: [
      "SASE = SSE(The Secure Service Edge: FWaaS·ZTNA·CASB·SWG) + A(The Network Access: SD-WAN·Unified Connectivity)",
      "핵심: 네트워크(SD-WAN)와 보안(ZTNA·CASB)을 하나의 클라우드 서비스로 통합 — 원격근무·클라우드 확산에 대응",
    ],
  },
  {
    title: "SECaaS(Security as a Service)",
    course: "SC",
    definition:
      "직접 보안 인프라를 구축할 필요 없이, 클라우드 서비스 형태로 보안 기능을 제공받는 모델",
    defShort: "보안 인프라 구축 없이 클라우드 서비스 형태로 보안 기능을 제공받는 모델",
    lead: "구독형 보안 서비스, SECaaS",
    features: ["직접 구축 불필요", "클라우드 구독형", "탄력적 확장"],
    keywords: ["CSP", "SSP", "Cloud 보안 서비스"],
    tables: [
      {
        caption: "SECaaS 유형",
        headers: ["유형", "설명"],
        rows: [
          ["CSP SECaaS", "기존 클라우드서비스 제공자\n자신의 안전한 서비스 위한 보안"],
          ["SSP SECaaS", "모든 시스템 대상 전문 보안서비스"],
        ],
      },
      {
        caption: "SECaaS 제공 서비스",
        headers: ["제공 서비스", "설명"],
        rows: [
          ["IAM(Identity & Access Management)", "사용자 인증 및\n접근 제어(예: Okta,\nMicrosoft Entra ID)"],
          ["DLP(Data Loss Prevention)", "데이터 유출 방지\n및 보호(예: McAfee,\nSymantec)"],
          ["SIEM(Security Information & Event Management)", "보안 로그 분석 및\n위협 탐지(예: Splunk, IBM\nQRadar)"],
          ["EDR(Endpoint Detection & Response)", "엔드포인트 보안\n및 위협 탐지(예:\nSentinelOne, CrowdStrike)"],
          ["FWaaS(Firewall as a Service)", "클라우드 기반\n방화벽 제공(예: Zscaler,\nPalo Alto Networks)"],
          ["MDR(Managed Detection & Response)", "보안 모니터링 및\n위협 대응(예: Trend Micro,\nRapid7)"],
        ],
      },
    ],
    notes: [
      "SaaS·PaaS·IaaS처럼 보안도 '서비스형'으로 — 직접 구축 대신 IAM·DLP·SIEM·EDR·FWaaS·MDR을 구독",
      "SASE의 보안 서비스 구성요소로도 포함됨(CSP SECaaS·SSP SECaaS)",
    ],
  },
  {
    title: "이중 서명(Dual Signature)",
    course: "SC",
    definition:
      "구매 정보와 지불 정보를 각각 다른 키로 암호화되어, 판매자는 구매정보만, 금융기관은 지불정보만 알 수 있도록 하는 전자 서명",
    defShort: "다른 키 암호화로 판매자는 구매정보만 금융기관은 지불정보만 아는 서명",
    lead: "정보 분리의 전자서명, 이중 서명",
    features: ["정보 분리", "선택적 기밀성", "연접 서명"],
    keywords: ["구매 정보", "지불 정보", "연접", "해시", "공개키", "개인키", "비밀키", "전자서명", "전자봉투", "기밀성", "무결성"],
    tables: [
      {
        caption: "이중 서명 암호화 단계",
        headers: ["단계", "설명"],
        rows: [
          ["1) 전자서명 생성", "구매·결제정보 해시 M1·M2\nM1M2 연접 후 해시 → M\nM을 구매자 개인키로 암호화\n결과 값이 전자서명"],
          ["2) 결제정보 암호화", "비밀키(대칭키) 생성\n비밀키로 결제정보 암호화"],
          ["3) 전자봉투 생성", "비밀키를 PG 공개키로 암호화\n결과가 전자봉투"],
          ["4) 판매자 전송", "구매정보·M1M2·전자서명\n암호화 결제정보·전자봉투 전달"],
        ],
      },
      {
        caption: "이중 서명 복호화 과정",
        headers: ["주체", "설명"],
        rows: [
          ["판매자", "구매정보 해시로 M1' 생성\nM1'로 대체한 M1M2 해시 → M\n공개키로 서명 복호화한 M과 비교\nM1M2·서명·전자봉투 등 PG 전달"],
          ["카드사(PG)", "PG 개인키로 봉투 복호화→비밀키\n비밀키로 결제정보 복호화\n결제정보 해시로 M2' 생성\nM2' 대체 해시 M과 서명 M 비교"],
        ],
      },
    ],
    notes: [
      "핵심: 판매자는 구매정보만·금융기관은 지불정보만 보게 하여 프라이버시 보호 — SET(전자결제) 프로토콜의 핵심 기술",
      "다중 서명과 구분: 이중 서명은 '한 사람이 두 정보를 분리 서명'(SET 결제), 다중 서명은 'M명 중 N명 서명 합의'(블록체인)",
    ],
  },
  {
    title: "다중 서명(Multi Signature)",
    course: "SC",
    definition:
      "하나의 거래(트랜잭션)를 승인하기 위해 미리 지정된 여러 개의 키(서명) 중 정해진 수(M of N) 이상의 서명이 필요한 디지털 보안 서명",
    defShort: "여러 개의 키 중 정해진 수(M of N) 이상 서명 필요한 디지털 보안 서명",
    lead: "N개 중 M개 키의 승인, 다중 서명",
    features: ["M of N 승인", "여러 주체 합의", "키 유실 위험 분산"],
    keywords: ["N of M 서명", "P2SH", "스마트 컨트랙트", "조건설정", "키생성", "주소생성", "거래생성", "서명요청", "서명검증", "제출"],
    tables: [
      {
        caption: "블록체인에서의 다중서명 절차",
        headers: ["절차", "핵심 기술", "설명"],
        rows: [
          ["① 조건설정", "스마트계약", "모두 서명 아닌 조건 미리 설정\nM of N 서명(3명 중 2명)\n3of5 등 조건 설정"],
          ["② 키생성", "개인키, 공개키", "각 서명자 개인키·공개키 생성\n모든 서명자가 생성"],
          ["③ 주소생성", "공개키", "공개키로 스크립트 해시 주소 생성\nP2SH: 서명자 공개키·조건설정"],
          ["④ 거래생성", "디지털 서명", "멀티시그 주소로 거래 생성\n서명 요구\n트랜잭션 해시 요약\n각 서명자 승인"],
          ["⑤ 서명요청", "분산원장 기술", "각 서명자 서명 기회, 개인키 서명\n서명 데이터 다른 서명자에 전달"],
          ["⑥ 서명검증", "서명검증알고리즘", "제출 전 공개키로 유효성 검증\n조건 이상 서명 유효 시 제출 단계"],
          ["⑦ 제출", "합의 알고리즘", "서명조건충족\n조건설정 이상 개인키로 서명"],
          ["⑧ 완료", "거래 변조 방지", "모든 서명 완료, 블록체인 기록"],
        ],
      },
      {
        caption: "블록체인에서 다중 서명 구현을 위한 기법 비교",
        headers: ["비교 항목", "P2SH(Pay-to-Script-Hash)", "스마트 컨트랙트(Smart Contract)"],
        rows: [
          ["주요 사용 플랫폼", "비트코인 기반", "이더리움 EVM"],
          ["기본 개념", "MofN 규칙\n스크립트 주소", "MofN 로직\n계약 주소 전송"],
          ["자산 보관 위치", "스크립트 잠금\nUTXO", "스마트 컨트랙트\n계약 계정 잔액"],
          ["구현 수준", "프로토콜 레벨\n코어 내장 기능", "애플리케이션\nEVM 위 별도 코드"],
          ["주요 목적", "공동 소유 보관\n커스터디 등", "거버넌스 DAO\n복잡 금융 계약"],
        ],
      },
    ],
    notes: [
      "M of N: N개 키 중 M개 이상 서명해야 거래 승인 — 단일 키 유실·탈취 위험 분산(공동 지갑·에스크로)",
      "이중 서명과 구분: 다중 서명은 '여러 주체의 합의', 이중 서명은 'SET 결제의 정보 분리'",
    ],
  },
  {
    title: "간편인증 인터페이스 가이드라인",
    course: "SC",
    definition:
      "긴 패스워드를 입력하는 대신 PIN 번호, 바이오 정보, 패턴입력 등 간편한 방법으로 전자서명 서비스를 이용하는 방식",
    defShort: "긴 패스워드 입력 대신 간편한 방법으로 전자서명 서비스를 이용하는 방식",
    lead: "간편한 전자서명 이용, 간편인증",
    features: ["패스워드 대체", "CS·MS 이중 키", "랜덤 솔트 키 유도"],
    keywords: ["클라이언트 시크릿", "마스터 시크릿", "인터페이스 인증", "메시지 인증", "중요정보 암호화"],
    tables: [
      {
        caption: "간편인증 서비스의 키 종류",
        headers: ["키 종류", "유형", "생성/배포 대상", "용도", "유효기간"],
        rows: [
          ["클라이언트 시크릿(ClientSecret, CS)", "유도키", "인증사업자→이용기관\n인증사업자→중계사업자\n중계사업자→이용기관", "접근토큰 발급\n클라이언트 인증\n무결성 검증", "최대 2년 권고"],
          ["마스터 시크릿(MasterSecret, MS)", "유도키", "인증사업자→이용기관\n인증사업자→중계사업자", "중요 정보 암호화", "최대 2년 권고"],
        ],
      },
      {
        caption: "키의 사용처",
        headers: ["키 사용처", "설명"],
        rows: [
          ["인터페이스 인증", "승인 위해 클라이언트시크릿 해시"],
          ["메시지 인증", "메시지 인증(HMAC) 생성\n클라이언트시크릿·솔트로 유도\n새 비밀키(MacK) 사용"],
          ["중요정보 암호화", "거래당사자 간 중요정보 암호화\n마스터시크릿·랜덤 솔트 조합\n새 암호키(EncK) 생성"],
        ],
      },
    ],
    notes: [
      "절차: 사용자가 전자서명수단 선택·정보 입력 → 이용기관이 사용자 인증 요청 → 전자서명인증사업자가 인증앱 호출(앱스킴·딥링크·QR·PUSH) → 사용자 전자서명 → 결과를 이용기관에 제공",
      "핵심: 클라이언트 시크릿(인증·무결성)과 마스터 시크릿(중요정보 암호화)의 이중 키 구조, 랜덤 솔트로 매번 새 키 유도",
    ],
  },
  {
    title: "전자봉투(Digital Envelope)",
    course: "SC",
    definition:
      "대칭키, 비대칭키의 장점 이용, 컨텐츠는 비밀키, 비밀키는 공개키로 암호화하여 전송하는 System",
    defShort: "컨텐츠는 비밀키, 비밀키는 공개키로 암호화해 전송하는 System",
    lead: "대칭·비대칭 결합 전송, 전자봉투",
    features: ["대칭·비대칭 결합", "키 공유 위험 해소", "전자서명 결합"],
    keywords: ["기밀성", "공개키", "개인키", "비밀키", "해시 함수", "메시지 다이제스트", "Message→비밀키 암호화", "비밀키→공개키 암호"],
    tables: [
      {
        caption: "전자봉투 송신 절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. Message Digest 생성", "메시지 해시함수로 축약해 MD 생성"],
          ["2. 전자서명 생성", "송신자 개인키로 MD 암호화\n전자서명 생성"],
          ["3. 비밀키로 암호문 생성", "비밀키(대칭키)로 암호문 생성\n대상: 전자서명·메시지·인증서"],
          ["4. 전자봉투 생성", "수신자 공개키로 비밀키 암호화\n암호화된 비밀키 = 전자봉투"],
          ["5. 암호문과 전자봉투 전송", "암호문·전자봉투 수신자 전송"],
        ],
      },
      {
        caption: "전자봉투 수신 절차",
        headers: ["절차", "설명"],
        rows: [
          ["1. 전자봉투 복호화", "수신자 개인키로 전자봉투 복호화\n비밀키(대칭키) 획득"],
          ["2. 암호문 복호화", "비밀키로 암호문 복호화\n전자서명·메시지·인증서 획득"],
          ["3. 전자서명 복호화", "송신자 공개키로 전자서명 복호화\nMessage Digest 획득"],
          ["4. 무결성 검증", "해시값·MD 비교해 무결성 검증"],
        ],
      },
    ],
    notes: [
      "핵심: 대칭키는 빠르지만 키 공유가 위험, 비대칭키는 안전하지만 느림 → 데이터는 대칭키로, 그 대칭키는 수신자 공개키로 암호화(전자봉투)해 둘의 장점만 결합",
      "TLS/SSL·PGP의 기반 원리와 동일 — 기밀성·무결성·인증(전자서명)·부인방지를 함께 제공",
    ],
  },
  {
    title: "DRM(Digital Right Management)",
    course: "SC",
    definition:
      "디지털 컨텐츠의 불법사용 및 복제 방지, 과금 서비스를 통한 정상 사용자의 검증 가능한 저작권 기술",
    defShort: "디지털 컨텐츠 불법사용·복제 방지와 정상 사용자 검증 가능 저작권 기술",
    lead: "콘텐츠 저작권 보호, DRM",
    features: ["암호화 패키징", "라이선스 기반 통제", "불법복제 방지"],
    keywords: ["CP(컨텐츠 제공자)", "CD(분배자)", "CC(소비자)", "CH(클리어링하우스)"],
    tables: [
      {
        caption: "DRM 구성 요소",
        headers: ["구분", "구성요소", "내용"],
        rows: [
          ["DRM 서버", "DRM 컨텐츠\nPackager", "암호화 패키징\n보안 포맷 변환"],
          ["클리어링 하우스", "컨텐츠 Policy\n컨텐츠 라이센스\n컨텐츠 관리정보\n컨텐츠 usage", "발급 정책 부합\n사용자 권리 인증\n사용자 정보\n권한별 정책 정보"],
          ["DRM 클라이언트", "단말기·셋톱박스\nSecure Container", "사용정보 전달\n전자적 보안 장치"],
        ],
      },
      {
        caption: "DRM 기술 요소",
        headers: ["분류", "요소기술", "내용"],
        rows: [
          ["컨텐츠 식별체계", "DOI", "Digital Object Identifier\nURN체계 기반"],
          ["컨텐츠 식별체계", "URI", "위치 무관 식별\nMPEG-21 채택"],
          ["메타데이터", "INDECS", "상호 운용성 제공\n사건 중심 기술"],
          ["메타데이터", "MPEG-7", "AV 메타 표준\n탐색·필터링"],
          ["저작권 표현", "XrML", "권한 명세 언어"],
          ["저작권 표현", "ODRL", "제약 없는 표현"],
          ["저작권 표현", "XMCL", "RealNetworks 제안\nXML 미디어 버전"],
          ["불법유통 적발", "Watermark", "저작권 정보 삽입\n투명한 비트 패턴"],
          ["불법유통 적발", "Fingerprint", "구매자 정보 삽입\n불법 배포 추적"],
        ],
      },
    ],
    notes: [
      "유통 흐름(개념도): CP(콘텐츠 제공자)→패키저→유통(Store Front)→CC(소비자, DRM 컨트롤러·보안 컨테이너), 라이선스는 클리어링 하우스(CH)가 발급",
      "핵심 4주체 [CP·CD·CC·CH]: 콘텐츠 제공자·분배자·소비자·클리어링하우스",
    ],
  },
  {
    title: "디지털 워터마킹(Digital Watermarking)",
    course: "SC",
    definition:
      "오디오, 비디오, 이미지 등의 콘텐츠에 특정 마크를 삽입하여, 불법 복제 시 소유권 정보를 추적할 수 있는 정보은닉 기술",
    defShort: "콘텐츠에 특정 마크를 삽입해 불법 복제 시 소유권 정보 추적 정보은닉 기술",
    lead: "소유권 정보의 은닉 삽입, 디지털 워터마킹",
    features: ["소유권 정보 추적", "비가시성", "견고성"],
    keywords: ["삽입기술(공간영역, 주파수영역)", "검출기술(공개형, 비공개형)", "비가시성", "견조성", "복잡성", "효율성"],
    tables: [
      {
        caption: "Watermarking 삽입 기술",
        headers: ["구분", "공간영역 삽입(spatial domain)", "주파수 영역(Frequency Domain)"],
        rows: [
          ["특성", "공간상 분포\n비민감 영역", "주파수 변환\nDCT·DWT"],
          ["장점", "적은 계산량\n구현 간편성", "전 영역 분포\n삭제 어려움"],
          ["단점", "필터링 취약\n손실압축 취약", "연산 부하 큼\n구현 복잡성"],
        ],
      },
      {
        caption: "Watermarking 검출 기술",
        headers: ["구분", "공개형(Blind)", "비공개형(non-Blind)"],
        rows: [
          ["특성", "공개 알고리즘", "비공개 알고리즘"],
          ["장점", "원본 불필요\n검증 개방성", "설계 용이성\n보안성 우수"],
          ["단점", "비밀키 의존\n강인성 저하", "원본 데이터 필요\n활용범위 제한"],
        ],
      },
      {
        caption: "Watermarking 공격 기법",
        headers: ["공격기법", "주요내용"],
        rows: [
          ["Filtering Attack", "노이즈 없애듯 워터마크 제거"],
          ["Copy Attack", "삽입된 워터마크 추출\n임의 신호 삽입해 워터마크 제거"],
          ["Mosaic Attack", "검출 안 될 정도로 작게 조각\n삭제 후 다시 조작 맞춤"],
          ["Template Attack", "일종의 Synchronization Attack\n패턴 파괴, 워터마크 검출 불가"],
        ],
      },
    ],
    notes: [
      "핑거프린팅과 구분: 워터마킹은 '저작권 정보'를 삽입(불법복제 방지), 핑거프린팅은 '저작권 정보 + 구매자 정보'를 삽입(불법유통 추적)",
      "품질 요건: 비가시성(안 보임)·견고성(공격에 견딤)이 상충 — 둘의 균형이 핵심",
    ],
  },
  {
    title: "핑거프린팅(Fingerprinting)",
    course: "SC",
    definition:
      "디지털 콘텐츠에 저작권 정보와 구매한 사용자의 정보를 삽입하여 컨텐츠 불법 배포자 추적을 위한 기술",
    defShort: "저작권 정보와 구매한 사용자 정보를 삽입해 컨텐츠 불법 배포자 추적 기술",
    lead: "구매자 정보의 추적 삽입, 핑거프린팅",
    features: ["구매자 정보 삽입", "불법 배포자 추적", "공모 공격 취약"],
    keywords: ["불법 유통 구매자 확인", "공모공격", "대칭형/비대칭형", "구매자 정보 삽입"],
    tables: [
      {
        caption: "Watermarking과 FingerPrinting의 비교",
        headers: ["구분", "Watermarking", "FingerPrinting"],
        rows: [
          ["목적", "불법복제 방지", "불법유통 방지"],
          ["삽입정보", "저작권 정보", "저작권+구매자"],
          ["콘텐츠 변화 시점", "최초 저작 시점", "구매 시점 마다"],
          ["기술적 유형", "공개·비공개형\n공간·주파수형", "대칭형\n비대칭형·익명"],
          ["취약점", "불법 유통 취약", "공모 공격 취약"],
          ["기술적 해결책", "핑거프린팅 활용", "통합 DRM 활용"],
        ],
      },
      {
        caption: "핑거프린팅 공모 공격 유형",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["통계 조작", "평균화 공격(Averaging Attack)", "다수 컨텐츠 평균해 새 컨텐츠 생성"],
          ["통계 조작", "최대최소 공격(Max-Min Attack)", "공모 컨텐츠 최소·최대값 산출\n그 평균값으로 새 컨텐츠 생성"],
          ["상관 조작", "상관계수 음수화 공격(Negative-Correlation Attack)", "상관계수 값을 음수로 만들어\n공모자 추출을 어렵게 함"],
          ["상관 조작", "상관계수 제로화 공격(Zero-Correlation Attack)", "상관계수 0에 가깝게 유도\n핑거프린팅 정보 검출 불가"],
          ["기하 조작", "모자이크 공격(Mosaic Attack)", "기하학적 모양으로 작게 나눠 생성\n잘림(cropping) 공격과 유사\n조각 이미지는 추출 어려움"],
        ],
      },
    ],
    notes: [
      "워터마킹과 핵심 차이: 삽입정보에 '구매자 정보'가 추가되어 '누가 유출했는지' 추적 가능 — 삽입 시점도 구매 시점마다",
      "고유 취약점: 공모 공격(여러 구매자가 자기 사본을 합쳐 핑거프린트 제거) — 평균화·최대최소·상관계수·모자이크 공격",
    ],
  },
  {
    title: "생체 인증(텔레바이오 인증)",
    course: "SC",
    definition:
      "신체의 고유한 생체적 특성이나, 행동적인 특성을 이용하여 개인을 식별하는 기술",
    defShort: "고유한 생체적 특성이나 행동적인 특성을 이용하여 개인을 식별하는 기술",
    lead: "원거리 사용자 바이오 식별, 텔레바이오 인증",
    features: ["유일성", "영구성", "FAR·FRR 상충"],
    subDefs: [
      {
        name: "FRR(False Rejection Rate)",
        lead: "정상 사용자의 오거부율",
        def: "올바른 사용자를 잘못된 사용자로 오인식하여 거부하는 비율의 측정 지표",
      },
      {
        name: "FAR(False Acceptance Rate)",
        lead: "타인의 오인식 허용률",
        def: "잘못된 사용자를 올바른 사용자로 인식하여 허용하는 비율의 측정 지표",
      },
      {
        name: "EER(Equal Error Rate)",
        lead: "두 오류율의 교차점",
        def: "FAR과 FRR이 같아지는 지점의 오류율로 값이 낮을수록 우수한 지표",
      },
    ],
    keywords: ["보편성", "유일성", "영구성", "획득성", "정확성", "접근성", "기만성", "[지열홍정 음걸행서]", "FRR", "FAR"],
    tables: [
      {
        caption: "생체 유형 [지열홍정 음걸행서]",
        headers: ["구분", "유형", "세부 유형"],
        rows: [
          ["신체적 특징", "지문인식", "광학·정전용량"],
          ["신체적 특징", "얼굴인식", "서열·딥러닝"],
          ["신체적 특징", "홍채인식", "동적·멀티모달"],
          ["신체적 특징", "정맥인식", "손등·손목 정맥"],
          ["행동적 특징", "음성인식", "패턴 매칭 인증"],
          ["행동적 특징", "걸음걸이 인식", "가속도·비전"],
          ["행동적 특징", "행동인식", "타이핑·이동"],
          ["행동적 특징", "서명인식", "정적·동적 서명"],
        ],
      },
      {
        caption: "생체 인증 측정 지표",
        headers: ["구분", "수식"],
        rows: [
          ["FRR(False Rejection Rate)", "잘못된 거부 수 /\n정상 인증 시도 수"],
          ["FAR(False Acceptance Rate)", "잘못된 인증 수 /\n인증 시도 수"],
          ["EER(Equal Error Rate)", "FAR = FRR 지점"],
        ],
      },
    ],
    notes: [
      "생체 인증 고유 특성 7가지: 보편성·유일성·영구성·획득성·정확성·접근성·기만성",
      "FAR·FRR·EER 관계: FAR(타인 수용)와 FRR(본인 거부)은 상충 — 둘이 같아지는 EER이 낮을수록 우수한 시스템",
    ],
  },
  {
    title: "생체정보 보호 안내서(24.12)",
    course: "SC",
    definition:
      "개인의 신체적, 생리적, 행동적 특징에 관한 정보로서 특정 개인을 인증·식별하거나 개인에 관한 특징(연령·성별·감정 등)을 알아보기 위해 일정한 기술적 수단을 통해 처리되는 정보",
    defShort: "특정 개인 인증·식별 위해 처리되는 신체적·생리적·행동적 특징 정보",
    lead: "생체정보 보호 지침, 생체정보 보호 안내서",
    features: ["원본→특징 추출", "민감정보 해당", "원본 분리보관"],
    keywords: ["특정 개인", "신체적", "생리적", "행동적 특징", "원본정보", "특징정보", "적법성", "비례성", "목적제한", "투명성", "통제권보장", "안전성", "5단계(기획·설계 → 수집 → 이용·제공 → 보관·파기단계 → 기획·설계단계 → 상시점검)"],
    tables: [
      {
        caption: "개인정보·생체정보·생체인식정보의 관계",
        headers: ["구분", "설명"],
        rows: [
          ["개인정보", "개인 식별 정보 결합 식별 포함"],
          ["생체정보", "신체·행동 특징 기술 수단 처리"],
          ["생체인식정보", "인증·식별 목적 원본→특징 변환"],
          ["원본정보", "수집 원본정보 입력장치 수집"],
          ["특징정보(민감정보)", "특징점 추출 기술 수단 생성"],
        ],
      },
      {
        caption: "생체인식정보 보호 6대 원칙",
        headers: ["6대 원칙", "설명"],
        rows: [
          ["비례성", "편익 대비 침해 위험성 크기 고려"],
          ["적법성", "수집·이용·제공 근거 적법·명확"],
          ["목적제한", "동의받은 목적 외 무단 활용 금지"],
          ["투명성", "정보주체에게 알기 쉽게 공개"],
          ["안전성", "분실·도난·유출 방지\n위조·변조·훼손 방지"],
          ["통제권보장", "정보주체 스스로 통제 수단 제공"],
        ],
      },
      {
        caption: "생체인식정보 보호조치 5단계",
        headers: ["단계", "보호 조치"],
        rows: [
          ["1. 기획·설계 단계", "생체인식정보 필요성 검토\n개인정보보호 중심 설계(PbD)\n대체 수단 마련\n개인정보 영향평가 수행"],
          ["2. 수집 단계", "적법하게 생체인식정보 수집\n위·변조 생체인식정보 대책 마련\n수집·입력 시 전송구간 보호"],
          ["3. 이용·제공 단계", "동의받은 목적의 범위 내 이용\n생체인식정보 통제 수단 제공\n수집·입력 단말에서 처리"],
          ["4. 보관·파기 단계", "저장 시 암호화\n생체인식정보의 파기\n원본정보 보관 시 분리보관"],
          ["5. 상시 점검", "개인정보 처리방침 공개\n개인정보취급자 관리·감독"],
        ],
      },
    ],
    notes: [
      "핵심 구분: 생체정보 ⊃ 생체인식정보(인증·식별 목적) — 원본정보(수집)에서 특징정보(민감정보)를 추출",
      "6대 원칙 [비적목투안통]: 비례성·적법성·목적제한·투명성·안전성·통제권보장, 저장 시 암호화·원본 분리보관이 핵심 조치",
    ],
  },
  {
    title: "OAuth(Open Authorize) 2.0",
    course: "SC",
    definition:
      "Third-Party 프로그램에게 리소스 소유자를 대신하여 리소스 서버에서 제공하는 자원에 대한 접근 권한을 위임하는 개방형 표준 프로토콜",
    defShort: "리소스 소유자 대신 자원에 대한 접근 권한 위임하는 개방형 표준 프로토콜",
    lead: "접근 권한 위임의 표준, OAuth 2.0",
    features: ["접근 권한 위임", "토큰 기반 접근", "인증 아닌 인가"],
    keywords: ["Authorization Code", "Implicit", "Password Credentials", "Client Credentials", "SAML", "Simple Web Token", "JSON Web Token"],
    tables: [
      {
        caption: "OAuth 2.0 구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["주체", "자원 소유자(Resource Owner)", "자원 소유자 접근 권한 부여"],
          ["주체", "클라이언트(Client)", "보호 자원 접근 요청 애플리케이션\n자원 사용 원하는 제3자 서비스"],
          ["서버", "권한 서버(Authorization Server)", "토큰 발급 서버 액세스 토큰 발급"],
          ["서버", "자원 서버(Resource Server)", "자원 제공 서버 토큰 권한 검증"],
          ["토큰", "액세스 토큰", "접근 권한 증명 보호 자원 접근"],
          ["토큰", "리프레시 토큰", "만료 시 재발급 신규 토큰 발급"],
          ["식별 정보", "클라이언트 아이디", "클라이언트 식별 값 권한 서버 발급"],
          ["식별 정보", "클라이언트 비밀번호", "ID 매핑 비밀번호, 권한 서버 발급"],
        ],
      },
      {
        caption: "OAuth 인증 유형(권한 부여 방식)",
        headers: ["구분", "유형", "설명"],
        rows: [
          ["인가 코드", "Authorization Code Grant", "인가 코드 전달 자체 코드 생성"],
          ["인가 코드", "Implicit Grant", "인가코드 생략 즉시 토큰 발급"],
          ["자격 증명", "Password Credentials Grant", "ID·PW 인증 신뢰 관계 전제"],
          ["자격 증명", "Client Credentials Grant", "클라이언트 인증 동일 주체 사용"],
        ],
      },
    ],
    notes: [
      "인증 절차: 클라이언트가 Authorization 요청 → 권한 서버가 Access Token 발급 → 자원 서버에서 토큰으로 권한 검증 후 보호 자원 제공",
      "Token Type: SAML·Simple Web Token·JSON Web Token(JWT) — 인증(Authentication)이 아니라 인가(Authorization) 프로토콜이라는 점이 시험 포인트",
    ],
  },
  {
    title: "패스키(Passkey)",
    course: "SC",
    definition:
      "비밀번호 방식 등 기존 인증 방식의 보안 취약점 해소를 위해 WebAuthn 기술 표준의 공개키 방식을 적용한 FIDO 기반 디지털 사용자 인증 정보",
    defShort: "WebAuthn 공개키 방식의 FIDO 기반 디지털 사용자 인증 정보",
    lead: "비밀번호 없는 인증, 패스키",
    features: ["Passwordless", "기기 내 개인키 보관", "피싱 저항성"],
    keywords: ["Passwordless", "Authenticator", "Client Application", "Relying party", "Metadata repository"],
    tables: [
      {
        caption: "패스키 구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["인증 장치", "Authenticator", "인증 장치·SW 신원 증명 토큰\nFace ID 생체 인증 수단"],
          ["클라이언트", "Client Application", "프론트엔드 앱 사용자 상호작용"],
          ["서버", "Relying Party", "백엔드 앱 인증·등록 지원\n접근 권한 결정 리소스 허용 판단"],
          ["저장소", "Metadata repository", "인증자 메타 제조사·모델"],
        ],
      },
    ],
    notes: [
      "원리: 개인키는 사용자 기기(Authenticator)에 안전 보관, 공개키만 서버(Relying Party)에 등록 — 비밀번호를 서버에 저장하지 않아 유출·피싱에 강함",
      "표준: FIDO2 = WebAuthn(브라우저 API) + CTAP(인증기 프로토콜)",
    ],
  },
  {
    title: "공격 표면 관리(Attack Surface Management)",
    course: "SC",
    definition:
      "조직의 공격 표면을 구성하는 사이버 보안 취약점 및 잠재적 공격 벡터를 지속적으로 발견, 분석, 우선순위 지정, 수정 및 모니터링하는 보안 프로세스",
    defShort: "사이버 보안 취약점·잠재적 공격 벡터를 지속적 모니터링 보안 프로세스",
    lead: "공격 벡터의 지속 관리, ASM",
    features: ["Outside-In 관점", "미인지 자산 발견", "지속 모니터링"],
    keywords: ["ASM(Attack Surface Management)", "EASM(External Attack Surface Management)", "Outside-In 방식", "네트워크 경계"],
    tables: [
      {
        caption: "공격 표면 관리 프로세스",
        headers: ["단계", "설명", "구분"],
        rows: [
          ["1. 디지털 자산 발견", "네트워크 연계\n모든 자산 식별", "클라우드·저장소\n웹 앱·API·인증서\n프로비저닝 IP\nOSINT·다크웹"],
          ["2. 자산 식별 및 분류", "자산 유형·특성\n중요도 따라 분류", "자산 관리자\n비즈니스 영향도\n속성 분류"],
          ["3. 지속적인 보안 모니터링", "CVSS·CWE 활용\n위험도 산정", "SSL/TLS·MITM\n악성코드 공격\n불필요 포트"],
          ["4. 악성자산 및 사고 모니터링", "보안사고 대응\n추가 공격 시도\n피해범위 파악", ""],
        ],
      },
      {
        caption: "공격 표면 최소화 대응방안",
        headers: ["구분", "설명"],
        rows: [
          ["인프라 측면", "제로 트러스트(Zero Trust) 관점\n보안 아키텍처 설계 및 구현\nMicro-Segmentation·SDP·IAP\n저전력 디바이스 보안강화 방안"],
          ["데이터 측면", "데이터 스프롤(Data Sprawl) 대응\n업무별 권한 인증·인가 강화\n데이터 암·복호화 적용\n프라이버시 보존기술(PETs)"],
          ["소프트웨어 측면", "DevSecOps 보안 자동화\n보안라이프사이클 수립\n시큐어코딩\n소프트웨어 테스팅 고도화"],
          ["사용자 측면", "보안인식 제고 혜택·제재 도입\n모의해킹·취약점 점검, 이슈 해소"],
        ],
      },
    ],
    notes: [
      "핵심: '공격자 관점(Outside-In)'에서 조직이 인지 못한 자산(Shadow IT·노출 API)까지 찾아 관리 — EASM은 외부 노출 표면 특화",
    ],
  },
  {
    title: "차세대 SIEM(Security Information and Event Management)",
    course: "SC",
    definition:
      "대규모 로그를 AI·UEBA로 분석해 지능형 위협을 탐지하고 SOAR로 자동 대응하는 클라우드 보안 플랫폼",
    defShort: "AI·UEBA로 위협 탐지하고 SOAR로 자동 대응하는 보안 플랫폼",
    lead: "지능형 로그 분석 대응, 차세대 SIEM",
    features: ["행위 기반 분석", "SOAR 자동 대응", "미지 위협 탐지"],
    keywords: ["수집", "가설 수립", "헌팅", "탐지자 개발", "위협 탐지", "조사 및 대응", "Cyber Kill Chain"],
    tables: [
      {
        caption: "SIEM 수집 Log 유형",
        headers: ["구분", "수집로그"],
        rows: [
          ["네트워크 장치", "방화벽 로그\n침입 탐지/방지 시스템 로그\n웹 프록시 로그"],
          ["엔드포인트", "바이러스 백신 로그\nAmCache 로그\n레지스트리 로그"],
          ["DB", "사용자 인증 로그\n쿼리, 응답, 트레이스백 로그\n시스템 구성 로그"],
          ["모바일 디바이스", "APP 데이터 로그\n네트워크 구성 로그\n이벤트/감사/크래시 로그"],
        ],
      },
      {
        caption: "위협 헌팅 요소(차세대 SIEM 연계)",
        headers: ["기술 요소", "주요 역할", "SIEM 내 연계 방식", "기대 효과"],
        rows: [
          ["AI/ML (인공지능·머신러닝)", "행위 분류\n이상 탐지\n위협 등급화", "UEBA·규칙 엔진\n탐지 정확도 향상", "오탐·과탐 감소\nUnknown 위협 탐지"],
          ["UEBA (User & Entity Behavior Analytics)", "행위 프로파일링\n이상행동 식별", "학습모델에 제공", "내부자 위협\n계정 탈취 탐지"],
          ["SOAR (Security Orchestration, Automation & Response)", "대응 자동화\n플레이북 실행", "경보·탐지 기반\n자동 대응 수행", "대응시간 단축\n반복 업무 제거\n인적 오류 최소화"],
          ["XDR (eXtended Detection & Response)", "다계층 위협\n탐지·대응", "SIEM과 통합\n교차분석·정밀탐지", "복합 위협 탐지\n통합 보안 가시성"],
          ["TIP (Threat Intelligence Platform)", "위협정보 제공\nIoC·평판 분석", "SIEM 이벤트\n실시간 교차 매칭", "위협 인식 향상\n공격 조기 차단"],
        ],
      },
    ],
    notes: [
      "위협 헌팅 프로세스: 수집 → 가설 수립 → 헌팅 → 탐지자 개발 → 위협 탐지 → 조사 및 대응(Cyber Kill Chain 기반)",
      "기존 SIEM과 차이: 룰 기반 상관분석에 AI/ML·UEBA·SOAR·XDR·TIP을 결합해 알려지지 않은 위협까지 능동 탐지",
    ],
  },
  {
    title: "위협 헌팅(Threat Hunting)",
    course: "SC",
    definition:
      "네트워크와 엔드 포인트(End Point)를 검색하여 보안 통제를 우회하는 위협이 공격을 실행하거나 목표를 달성하기 전 위협을 사전에 식별하는 프로세스",
    defShort: "네트워크·엔드 포인트에서 통제 우회 위협을 사전에 식별하는 프로세스",
    lead: "선제적 잠재 위협 탐색, 위협 헌팅",
    features: ["능동적 탐색", "가설 기반 분석", "공격 전 사전 식별"],
    keywords: ["수집", "가설 수립", "헌팅", "탐지자 개발", "위협 탐지", "조사 및 대응", "Cyber Kill Chain"],
    tables: [
      {
        caption: "위협 헌팅 요소",
        headers: ["요소", "세부", "설명"],
        rows: [
          ["절차", "수집", "End Point 포함 모든 데이터 수집"],
          ["절차", "가설 수립", "ATT&CK·사이버 킬 체인 모델 활용\n발생 가능 가설 수립"],
          ["절차", "헌팅", "수립 가설 기반 현재 환경 반복 분석"],
          ["절차", "탐지자 개발", "위협 식별 행동 프로그램화 자동화"],
          ["절차", "위협 탐지", "의심·위협 될 것 같은 행동 발견"],
          ["절차", "조사 및 대응", "탐지 위협 분석·분석 내용 대응"],
          ["조직적 요소", "보안 전담 조직", "지속적 탐지·대응 위한 전담 조직\n전담 조직 운영 통한 위협 최소화"],
          ["조직적 요소", "보안 정책", "가설 수립·탐지용 기본 보안 정책\n가이드라인 기반 탐지자 개발"],
          ["조직적 요소", "교육/훈련", "조직 내부 위협 요소 대응 작업\n발생 가능 위협 요소 사전 관리"],
          ["기술적 요소", "EDR", "엔드포인트 행위 기반 탐지·대응\n상태 가시화 통한 대응력 확보"],
          ["기술적 요소", "SIEM", "모든 데이터 분석 통한 보안 확보\n빅데이터 분석·가시화 위협 탐지"],
          ["기술적 요소", "Cyber Kill Chain", "프로세스 분석·공격 방법 유추\n공격·방어 체인 모델 기준 대응"],
        ],
      },
    ],
    notes: [
      "핵심: 탐지 경보를 '기다리지' 않고 '가설을 세워 능동적으로 찾아 나선다'(Active Threat Hunting) — SIEM/EDR/Cyber Kill Chain 활용",
    ],
  },
  {
    title: "위협 모델링(Threat Modeling)",
    course: "SC",
    definition:
      "시스템, 애플리케이션, 네트워크 등 보호해야 할 자산에 대해 잠재적인 보안 위협을 식별, 분석, 평가와 대응 방안을 수립하는 프로세스",
    defShort: "자산의 잠재적인 보안 위협 식별·분석·평가해 대응 방안 수립 프로세스",
    lead: "잠재 위협의 사전 분석, 위협 모델링",
    features: ["잠재 위협 사전 식별", "신뢰 경계 중심", "검증·반복 수행"],
    keywords: ["잠재적 보안 위협", "STRIDE", "DREAD", "PASTA", "DFD", "신뢰 경계(Trust Boundary)"],
    tables: [
      {
        caption: "위협 모델링(Threat Modeling) 기법의 종류",
        headers: ["기법", "단계", "평가 항목"],
        nameCol: [1, 2],
        rows: [
          ["STRIDE", "시스템 모델링\n위협 식별\n완화 조치", "Spoofing(스푸핑)\nTampering(변조)\nRepudiation(부인)"],
          ["STRIDE", "시스템 모델링\n위협 식별\n완화 조치", "Information Disclosure\nDenial of Service\nElevation of Privilege"],
          ["DREAD", "(선행) 위협 식별\n항목별 점수 산정\n위험도 계산\n우선순위 결정", "Damage(공격 피해)\nReproducibility(재현 가능성)\nExploitability(공격 가능성)"],
          ["DREAD", "(선행) 위협 식별\n항목별 점수 산정\n위험도 계산\n우선순위 결정", "Affected Users\nDiscoverability(발견 용이성)"],
          ["PASTA", "비즈니스 및 보안 목표 정의 → 기술 범위 정의\n애플리케이션 분해 → 위협 분석\n취약점 분석 → 공격 분석\n위험 및 영향 분석", "7단계 전반 분석·평가 대상\n비즈니스 목표·영향도\n아키텍처·기술 스택\n데이터 흐름·신뢰 경계"],
          ["PASTA", "비즈니스 및 보안 목표 정의 → 기술 범위 정의\n애플리케이션 분해 → 위협 분석\n취약점 분석 → 공격 분석\n위험 및 영향 분석", "위협 인텔리전스·위협 패턴\n취약점·공격 벡터·공격 트리\n잔여 위험·대응책 효과성"],
        ],
      },
      {
        caption: "위협 모델링의 DFD 구성 요소",
        headers: ["요소", "기호", "설명"],
        rows: [
          ["외부 개체", "사각형", "상호작용하나 통제 밖에 있는 것\n사용자, 외부 API"],
          ["프로세스", "원형\n둥근 사각형", "데이터 변환·처리 실행 주체\n웹 서버, API 엔드포인트"],
          ["데이터 저장소", "두 줄 평행선", "데이터가 저장되는 곳\n데이터베이스, 파일 시스템, 쿠키"],
          ["데이터 흐름", "화살표", "구성 요소 간 데이터 이동 경로\nHTTP 요청/응답, DB 쿼리"],
          ["신뢰 경계(Trust Boundary)", "점선\n실선", "신뢰 수준이 다른 영역 구분 선"],
        ],
      },
    ],
    notes: [
      "절차: 보안 요구사항 정의 → 위협 식별 → 위협 분석·평가 → 완화 계획 수립 → 검증·반복(5 Key Steps)",
      "STRIDE=위협 분류, DREAD=위험도 점수화, PASTA=7단계 프로세스 — DFD의 신뢰 경계에서 취약점 집중",
    ],
  },
  {
    title: "WAAP(Web Application and API Protection)",
    course: "SC",
    definition:
      "웹방화벽(WAF) 기능에 추가로 API 보안 등 웹 환경에서 발생 가능한 각종 공격에 대한 보안책을 종합 적용한 웹 애플리케이션 및 API 보호 솔루션",
    defShort: "WAF에 API 보안 종합 적용한 웹 애플리케이션 및 API 보호 솔루션",
    lead: "웹과 API의 종합 방어, WAAP",
    features: ["WAF 기능 확장", "통합 보호 플랫폼", "Layer 7 행위 기반"],
    keywords: ["WAF", "웹 애플리케이션 보호", "API 보호", "DDoS", "Bot 보호"],
    tables: [
      {
        caption: "WAAP 주요 기능",
        headers: ["주요기능", "방어 공격"],
        rows: [
          ["웹 애플리케이션 방화벽(WAF)", "웹 공격, 정보 유출\n부정 접근\n웹 위변조"],
          ["DDoS(분산 서비스 거부) 보호", "DDoS(분산 서비스 거부)"],
          ["API 보호", "API 탈취"],
          ["Bot 보호", "무차별 대입공격\n핑거프린팅\n크리덴셜 스터핑\n런타임 자기방어(RASP)"],
        ],
      },
      {
        caption: "웹 방화벽(WAP)의 기능",
        headers: ["분류", "기능"],
        rows: [
          ["사용자 요청 검사", "어플리케이션 접근 제어\nWeb Dos 제어\n업로드 파일/요청 형식 검사\n버퍼오버플로우/스크립트 차단"],
          ["컨텐츠 보호", "정보 유출 차단\n웹 변조 방지"],
          ["보안", "URL 및 서버 위장\nSSL/TLS 지원"],
        ],
      },
      {
        caption: "WAAP과 기존 보안 시스템 비교",
        headers: ["비교항목", "WAAP", "WAF", "Firewall"],
        rows: [
          ["주요 목적", "API·Bot 보호", "웹공격 방어\n정보유출 방어", "접근제어·인증"],
          ["OSI Layer", "Layer 7", "Layer 7", "Layer 3"],
          ["제어대상", "Http(s)·API G/W", "Http(s)", "IP·Port"],
          ["제어기법", "Cloud·행위 기반", "Application 로직", "Rule Set·Logging"],
        ],
      },
    ],
    notes: [
      "핵심: WAF(웹 공격 방어) + API 보호 + DDoS + Bot 보호를 통합 — API 경제·클라우드 확산으로 API가 새 공격면이 되며 부상",
    ],
  },
  {
    title: "EDR(Endpoint Detection and Response)",
    course: "SC",
    definition:
      "엔드포인트 시스템 레벨의 동작을 지속적으로 모니터링하고 그 대응을 제공하는 보안 솔루션",
    defShort: "엔드포인트 시스템 레벨 동작을 지속 모니터링하고 대응 제공 보안 솔루션",
    lead: "엔드포인트 탐지 대응, EDR",
    features: ["엔드포인트 중심", "행위 기반 탐지", "탐지 후 대응"],
    keywords: ["Predict", "Prevent", "Detect", "Response", "침해지표(IOC, Indicator of Compromise)"],
    tables: [
      {
        caption: "EDR Process",
        headers: ["Processing", "기능"],
        rows: [
          ["① Predict", "기본 보안 태세,\n위협 예측, 위험\n평가"],
          ["② Prevent", "시스템 강화,\n시스템 격리,\n공격 방지"],
          ["③ Detect", "사고 탐지, 사건\n포함, 위험 확인\n및 우선순위 지정"],
          ["④ Response", "치료, Design Policy 변경,\n사건 조사"],
        ],
      },
    ],
    notes: [
      "핵심: 알려진 침해지표(IOC)와 행위 분석 기술로 침해를 조기 식별하기 위한 지속적 검색 수행 — 백신(시그니처)의 한계를 보완",
      "XDR과 구분: EDR은 엔드포인트만, XDR은 EDR을 확장해 네트워크·클라우드·이메일 등 다계층 통합 분석",
    ],
  },
  {
    title: "XDR(eXtended Detection Response)",
    course: "SC",
    definition:
      "EDR(Endpoint Detection and Response) 솔루션을 확장하여, 단일 플랫폼에 네트워크, 애플리케이션 등 다양한 보안 데이터를 통합 분석하여 고수준 위협 탐지, 보안 사고를 분석 및 대응하는 보안 솔루션",
    defShort: "EDR 솔루션을 확장해 보안 데이터를 통합 분석·대응하는 보안 솔루션",
    lead: "다계층 통합 탐지 대응, XDR",
    features: ["EDR 확장", "단일 플랫폼 통합", "교차 분석 탐지"],
    keywords: ["EDR", "SIEM", "SOAR", "End Point", "위협 탐지", "위협 대응", "보안 데이터 통합 분석"],
    tables: [
      {
        caption: "SIEM, SOAR, XDR의 비교",
        headers: ["비교 항목", "SIEM", "SOAR", "XDR"],
        rows: [
          ["보안 데이터 수집", "NW·엔드포인트\n앱 등", "NW·엔드포인트\n앱 등", "NW·엔드포인트\n앱 등"],
          ["보안 데이터 분석", "위협 탐지", "위협 탐지 및 대응", "위협 탐지 및 대응"],
          ["위협 탐지", "위협 이벤트 기반", "위협 이벤트 기반", "위협 이벤트 기반\n시계열 분석\nAI/ML"],
          ["위협 대응", "전문가 주도", "자동화", "통합 자동화"],
          ["장점", "다양한 데이터\n수집·분석", "운영 효율 향상\n업무 부담 감소", "포괄적·정밀\n탐지·대응"],
          ["단점", "탐지에만 집중", "수집·분석 의존", "도입 비용 고가"],
        ],
      },
      {
        caption: "XDR 동작 절차",
        headers: ["Working Flow", "주요 기술", "측정 지표", "설명"],
        rows: [
          ["데이터 수집", "EDR 에이전트\nAPI 통합\n클라우드 커넥터", "데이터 커버리지\n(Data Coverage)\n수집 지연 시간\n(Data Latency)", "에이전트·API로 데이터 수집\n엔드포인트·클라우드·네트워크"],
          ["중앙 집중식 저장소", "SIEM 통합\n데이터 정규화\n상관분석 엔진", "로그 상관 정확도\n(Correlation Accuracy)\n데이터 처리량\n(Throughput)", "로그·이벤트 상관 분석·저장\n통합 데이터베이스"],
          ["위협 인텔리전스", "Threat Feed 통합\nIOC 매칭 엔진\n(Indicators of Compromise)", "위협탐지커버리지\nThreat Detection Coverage\n인텔리전스신뢰도\n(Feed Reliability)", "외부 피드·내부 분석, 데이터 보강"],
          ["머신러닝 및 인공지능", "이상 탐지\n(Anomaly Detection)\n행위 기반 분석\n(UEBA)", "탐지 정확도\n(Detection Accuracy)\n오탐률\n(False Positive Rate)", "사고 학습, 이상 징후·패턴 탐지"],
          ["대응 도구", "SOAR\nEndpoint Isolation\nNetwork Segmentation", "MTTD(Mean Time To Detect)\nMTTR(Mean Time To Respond)", "격리·방화벽 차단 등 자동 조치\n수동 대응 옵션 제공"],
        ],
      },
    ],
    notes: [
      "EDR → XDR 확장: 엔드포인트만 보던 EDR에 네트워크·이메일·클라우드 워크로드를 Data Lake로 통합해 교차분석(Root-cause Analysis)",
      "측정 지표: MTTD(Mean Time To Detect)·MTTR(Mean Time To Respond) 단축 — SIEM/SOAR와 통합 운영",
    ],
  },
  {
    title: "DMARC(Domain-based Message Authentication, Reporting and Conformance)",
    course: "SC",
    definition:
      "메일서버 등록 방식인 SPF(Sender Policy Framework)와 도메인 키 인증 메일인 DKIM(DomainKeys Identified Mail)를 이용한 메일 인증 프로토콜",
    defShort: "메일서버 등록 SPF와 도메인 키 인증 DKIM 이용 메일 인증 프로토콜",
    lead: "이메일 발신자 위조 방어, DMARC",
    features: ["SPF·DKIM 결합", "도메인 스푸핑 차단", "실패 보고 체계"],
    keywords: ["SPF", "DKIM", "e-mail 인증", "RFC 7489", "DMARC 정책 설정", "인증실패시 보고서 발송"],
    tables: [
      {
        caption: "DMARC 구성 요소",
        headers: ["구분", "주요 구성"],
        rows: [
          ["표준", "RFC 7489"],
          ["인증", "SPF, DKIM의 메일 검증\nDNS"],
          ["보고", "보고서\nDNS기반 정책 배포"],
        ],
      },
      {
        caption: "SPF와 DKIM",
        headers: ["구성", "설명"],
        rows: [
          ["SPF(Sender Policy Framework)", "메일서버 정보 DNS에 공개 등록\n발송자 정보와 메일서버 일치 확인"],
          ["DKIM(DomainKeys Identified Mail)", "메일 헤더에 디지털 서명 추가\n컨텐츠 수정/변형/손상 없음 신뢰"],
        ],
      },
    ],
    notes: [
      "DMARC Process: 발신측이 DMARC 정책을 DNS에 등록 → 수신측이 SPF·DKIM 검증 → 실패 시 차단·격리 후 보고서를 등록된 주소로 발송",
      "핵심: SPF(발신 서버 IP 검증) + DKIM(메일 무결성 서명)을 묶어 '이 도메인이 진짜 보낸 메일인가'를 판정 — 스푸핑·피싱 메일 차단",
    ],
  },
  {
    title: "사이버 디셉션(Cyber Deception)",
    course: "SC",
    definition:
      "사이버상의 공격자가 서버 또는 시스템을 공격할 때 미끼(Decoy)를 이용하여 유인하는 함정(Traps)",
    defShort: "공격자가 서버 또는 시스템을 공격할 때 미끼를 이용하여 유인하는 함정",
    lead: "미끼로 유인하는 탐지, 사이버 디셉션",
    features: ["미끼 기반 유인", "공격자 격리", "내·외부 포괄 탐지"],
    keywords: ["미끼(Decoy)", "함정(Traps)", "허니팟(HoneyPot)"],
    tables: [
      {
        caption: "사이버 디셉션 구성 요소",
        headers: ["분류", "구성요소"],
        rows: [
          ["Decoy(미끼)", "쿠키\n서버접근정보\n로그인정보\n자동생성기술"],
          ["Trap(함정)", "EndPoint\nNetwork\nOS"],
          ["Deception System", "NW 탐지\n포렌식\nUser Interface"],
        ],
      },
      {
        caption: "사이버 디셉션과 허니팟(HoneyPot) 비교",
        headers: ["구분", "사이버디셉션", "허니팟"],
        rows: [
          ["대응범위", "내·외부 접근", "외부 접근"],
          ["라이선스", "라이선스 최소", "가상화 다수 필요"],
          ["오탐율", "오탐율 최소화", "오탐지 높음"],
          ["탐지방식", "포괄적 탐지\n자동화 구현", "로그분석 기반"],
          ["확장", "포괄적 배치", "제한적 배치"],
        ],
      },
    ],
    notes: [
      "동작: 악의적 사용자를 Decoy가 유인 → Trap으로 전개(EndPoint·NW·OS) → 행위 기록 → 정상 사용자는 Real System으로, 공격자는 Deception System으로 격리",
      "허니팟과 구분: 사이버 디셉션은 내·외부 포괄 대응·오탐 최소화·자동화 확장, 허니팟은 외부 접근·로그분석 중심의 제한적 함정",
    ],
  },
  {
    title: "디지털 면역 시스템(DIS, Digital Immune System)",
    course: "SC",
    definition:
      "컴퓨터 시스템, 네트워크 및 장치를 사이버 위협 및 공격에서 보호하도록 설계된 프로토콜, 시스템 및 기술",
    defShort: "사이버 위협 및 공격에서 보호하도록 설계된 프로토콜, 시스템 및 기술",
    lead: "사이버 위협의 자가 방어, 디지털 면역 시스템",
    features: ["스스로 위협 감지", "자동 복원/교정", "카오스 실험 검증"],
    keywords: ["관찰성", "인공지능 증강 테스팅", "카오스 엔지니어링", "자동 복원/교정", "사이트 신뢰성 엔지니어링", "소프트웨어 공급망 보안"],
    tables: [
      {
        caption: "디지털 면역 시스템 구축을 위한 6가지 조건",
        headers: ["조건", "설명"],
        rows: [
          ["관찰성", "시스템 상태 모니터링\n잠재적 문제·위협 식별"],
          ["인공지능 증강 테스팅", "사람으로부터 독립적인 테스팅\n기존 테스트 자동화 보완·확장\n완전 자동화된 테스트\n계획·생성·유지 관리·분석"],
          ["카오스 엔지니어링", "실험적 테스트 사용\n취약점·약점 발견, 복원력 테스트"],
          ["자동 복원/교정", "상황에 맞는 모니터링 기능\n자동화된 복원/교정 기능\n애플리케이션에 직접 구축"],
          ["사이트 신뢰성 엔지니어링", "사람의 개입 최소화\n안정성·가동 시간 최대화\n시스템 설계·운영 목표"],
          ["소프트웨어 공급망 보안(Application supply chain security)", "조직 SW·시스템 보안 보장 조치\n타사 SW와 구성\n아웃소싱\n사내 응용 프로그램 개발·유지"],
        ],
      },
    ],
    notes: [
      "구성: 모니터링(악의적 활동 감시) + 보안 조치(침입탐지·암호화·접근절차) → 디지털 면역 시스템",
      "핵심: 사람이 아니라 시스템이 스스로 위협을 감지·복원(면역)하도록 6대 조건을 갖춤 — Gartner 전략 기술",
    ],
  },
  {
    title: "사이버 레질리언스(Cyber Resilience)",
    course: "SC",
    definition:
      "사이버 공간상에서 예상 밖의 위협들의 부정적인 영향에도 조직의 목표 성과(outcome)를 전달할 수 있는 기업 능력",
    defShort: "예상 밖 위협의 부정적 영향에도 조직의 목표 성과를 전달하는 기업 능력",
    lead: "위협 속 성과 전달, 사이버 레질리언스",
    features: ["목표 성과 전달", "Safe-to-fail", "내부 구축 중심"],
    keywords: ["성과 전달(outcome)", "기업 능력(Ability)", "비즈니스 영향 분석", "보안 정책 통제", "종합적 테스트 정책", "매니지드 보안 도구 설치", "사이버 복구 계획"],
    tables: [
      {
        caption: "사이버 레질리언스 구성 요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["비즈니스 영향 분석", "위협 요인 분석\n기반 우선순위\n도출"],
          ["보안 정책 통제", "비즈니스 목적\n설명·문서화를\n통한 보안 기틀\n마련"],
          ["종합적 테스트 정책", "지속적 테스트와\n측정을 통한 보안\n검증"],
          ["매니지드 보안 도구 설치", "비즈니스 이슈\n관련\n도구·서비스에\n대한 투자"],
          ["사이버 복구 계획", "보안 이슈 발생\n대응절차 및\n신속한 복구 계획"],
        ],
      },
      {
        caption: "사이버 보안과 사이버 레질리언스의 비교",
        headers: ["비교 항목", "사이버 보안", "사이버 레질리언스"],
        rows: [
          ["수행 대상", "알려진 위협", "성과 전달 보장"],
          ["목적", "안전 장치 확보", "실패에도 안전"],
          ["접근 방식", "외부 방어 중심", "내부 구축 중심"],
          ["범위", "단일 조직 대상", "조직 네트워크"],
        ],
      },
    ],
    notes: [
      "확보 단계: ① 위협 평가 역량 확보 → ② 사이버 보안 방법 도입 → ③ 위협 기반 계획 → ④ 외부 위협으로부터 보호 → ⑤ 내부 위험 최소화 → ⑥ 보안 문화 유지",
      "사이버 보안과 구분: 보안은 'fail-safe(막는다)', 레질리언스는 'Safe-to-fail(뚫려도 성과는 낸다)' — 회복탄력성이 핵심",
    ],
  },
  {
    title: "PEC(Privacy-Enhancing Computation)",
    course: "SC",
    definition:
      "보안 및 개인 정보 보호를 보장하면서 데이터 공유와 처리를 보장하기 위한 기술의 총칭",
    defShort: "보안 및 개인 정보 보호 보장하며 데이터 공유와 처리를 보장하는 기술 총칭",
    lead: "보호하며 활용하는 연산, PEC",
    features: ["비열람 데이터 활용", "보호·활용 양립", "SW·HW 복합 접근"],
    keywords: ["데이터 변환", "소프트웨어 Computation", "하드웨어 환경", "재현 데이터", "동형 암호", "차분 프라이버시", "다자간 컴퓨팅 알고리즘", "영지식 증명", "연합학습", "기밀 컴퓨팅"],
    tables: [
      {
        caption: "PEC 유형 별 주요 기술",
        headers: ["영역", "기능", "주요 기술", "설명"],
        rows: [
          ["데이터 변환", "암호화", "재현 데이터\n동형 암호\n차분 프라이버시", "분석 전 데이터·알고리즘 변환"],
          ["소프트웨어 Computation", "분산화 처리", "다자간 컴퓨팅\n영지식 증명\n연합학습", "분산 방식 데이터·알고리즘 처리"],
          ["하드웨어 환경", "신뢰 환경", "기밀 컴퓨팅", "HW 단계 안전·신뢰 보장 환경 제공"],
        ],
      },
    ],
    notes: [
      "핵심: '데이터를 열어보지 않고도 활용한다' — 동형암호·연합학습·기밀컴퓨팅·차분 프라이버시를 아우르는 상위 개념",
      "3영역: 데이터 변환(SW로 데이터 자체 변형) / SW Computation(분산 처리) / HW 환경(신뢰 실행 환경 TEE)",
    ],
  },
  {
    title: "영지식증명(Zero Knowledge Proof)",
    course: "SC",
    definition:
      "어떤 정보를 직접 공개하지 않고도, 특정 명제가 참임을 증명할 수 있는 암호학적 기법",
    defShort: "정보를 직접 공개하지 않고 특정 명제가 참임을 증명하는 암호학적 기법",
    lead: "정보 비공개의 명제 검증, 영지식증명",
    features: ["완전성", "건전성", "영지식성"],
    keywords: ["증명자(Prover)", "검증자(Verifier)", "완전성", "건전성", "영지식성"],
    tables: [
      {
        caption: "영지식증명 메커니즘",
        headers: ["과정"],
        rows: [
          ["① Bob은 A 위치에서 대기"],
          ["② Alice는 B에서 C 혹은 D까지 이동"],
          ["③ Bob은 B 위치로 이동"],
          ["④ Bob은 Alice에게 C나 D 중 하나로 나오라고 요청"],
          ["⑤ Alice가 키가 있을 경우 요청하는 방향이 어디든지 나가는 것이 가능"],
          ["⑥ Alice가 키가 없을 경우 요청한 방향으로 나갈 수 있는 확률은 50%"],
        ],
      },
      {
        caption: "영지식증명 특징",
        headers: ["특징", "설명"],
        rows: [
          ["완전성(Completeness)", "참 문장 납득 정직 증명자 설득"],
          ["건전성(Soundness)", "거짓 문장 배제 부정 증명 불가"],
          ["영지식성(Zero-Knowledgeness)", "참·거짓만 노출 추가 정보 차단"],
        ],
      },
      {
        caption: "영지식증명 참여자",
        headers: ["참여자", "설명"],
        rows: [
          ["증명자(Prover)", "어떤 문장이\n참이라는 것을\n증명하려는\n참여자"],
          ["검증자(Verifier)", "증명 과정에\n참여하여\n증명자와 정보를\n주고받는 참여자"],
        ],
      },
    ],
    notes: [
      "메커니즘 예(동굴): 갈림길 동굴에서 Alice가 비밀 문의 키 보유 사실을, 키 자체를 보여주지 않고 요청한 방향으로 나옴으로써 증명 — 키 없으면 성공 확률 50%",
      "3대 성질 [완건영]: 완전성·건전성·영지식성 — zk-SNARK 방식으로 블록체인·프라이버시에 활용",
    ],
  },
  {
    title: "기밀컴퓨팅(Confidential Computing)",
    course: "SC",
    definition:
      "사용중인 데이터 보호와 개인 정보 보안에 중점을 둔 컴퓨팅 환경을 제공하는 기술적 접근 방식의 컴퓨팅",
    defShort: "사용중인 데이터 보호와 개인 정보 보안에 중점 둔 환경을 제공하는 컴퓨팅",
    lead: "사용 중 데이터 보호, 기밀컴퓨팅",
    features: ["사용중 데이터 보호", "TEE 격리 실행", "원격 실행증명"],
    keywords: ["신뢰 실행 환경(TEE(Trusted Execution Environment))", "실행증명(Attestation)", "주변장치(peripheral)", "시스템 소프트웨어", "응용"],
    tables: [
      {
        caption: "기밀컴퓨팅 구성 요소",
        headers: ["구성요소", "핵심기술"],
        rows: [
          ["신뢰 실행 환경(TEE)", "격리(isolation) 실행\nIntel SGX\nIntel TDX와 AMD SEV\nARM TrustZone"],
          ["실행증명(Attestation)", "원격(remote) 실행증명\n내장형 시스템같이 단순한 시스템\nTrustZone"],
          ["주변장치(peripheral)", "GPU·FPGA 같은 가속기\nSmart NIC\n암호화\n머클 트리 같은 구조체 유지"],
          ["시스템 소프트웨어", "ECALL\nOCALL"],
          ["응용", "Trusted Platform Module(TPM)"],
        ],
      },
    ],
    notes: [
      "데이터 3상태 보호 완성: 저장 중(암호화)·전송 중(TLS)에 더해 '사용 중(연산 중)' 데이터를 TEE로 보호 — 마지막 사각지대 해결",
      "TEE(신뢰 실행 환경): Intel SGX·AMD SEV·ARM TrustZone이 CPU 내 격리 영역에서 코드·데이터를 보호, 원격 실행증명(Attestation)으로 무결성 검증",
    ],
  },
  {
    title: "ISO 27017",
    course: "SC",
    definition:
      "ISO/IEC 27002을 기반으로 클라우드 서비스 공급자와 사용자에게 지침을 제공하는 클라우드 서비스 정보보호 통제 국제 표준",
    defShort: "ISO 27002를 기반한 클라우드 서비스 정보보호 통제 국제 표준",
    lead: "클라우드 정보보호 지침, ISO 27017",
    features: ["27002 기반 확장", "테넌트 분리", "공급자 역할 분담"],
    keywords: ["ISO 27001", "ISO 27002", "ISO 29100", "클라우드 서비스 정보보호 통제", "정조인자 접암물운 통개공사 연법"],
    tables: [
      {
        caption: "ISO 27017 통제 항목",
        headers: ["도메인", "통제 항목"],
        rows: [
          ["5. 정보보호 정책", "클라우드 정보보호 목적\n프레임워크 제공"],
          ["6. 정보보호 조직", "제공자·사용자 역할\n정보보호 내부 조직"],
          ["7. 인적보안", "클라우드 관리자 교육\n인적 자원 고용 전/후 보안지침"],
          ["8. 자산관리", "클라우드 자산 식별\n서비스 종료 시 고객 데이터 삭제"],
          ["9. 접근통제", "사용자별 접근 통제·인증 절차\n멀티 테넌트 사용자 리소스 분리\n제공자 내부·사용자 리소스 분리"],
          ["10. 암호화", "이용자 암호키 독립적 저장·관리"],
          ["11. 물리적보안", "안전 폐기·재사용 정책 확인\n가상·물리 네트워크 정책 일관성"],
          ["12. 운영보안", "제공 용량 요구 사항 충족 확인\n성능 보장 위한 모니터링\n서비스 변경 사항 정보 제공"],
          ["13. 통신보안", "공급자 내부 관리·고객 환경 분리\n가상 네트워크 보안 정책 수립"],
          ["14. 시스템개발보안", "서비스 보안 요구사항 명시\n입력·내부처리·출력 데이터 검증\n공급자 암호 통제 기능 확인"],
          ["15. 공급망관리", "보안통제 서비스명세 제공\n공급망 전반 서비스 보안 수준 유지"],
          ["16. 정보보호 사고관리", "고객 감지 보안 이벤트 공급자 보고\n공급자 탐지 이벤트 보고서 수신\n보고된 이벤트 상태 추적"],
          ["17. 연속성관리", "업무 연속성 요구사항 정의\n업무 연속성 계획 개발·구현"],
          ["18. 법적준거성", "국내외 법규·계약 요구사항 파악\n개인정보 보호 법적 요구 식별\n감사 정책 수립·이행"],
        ],
      },
    ],
    notes: [
      "표준 계보: ISO 27001(관리체계) + ISO 27002(정보보호 보안지침) + ISO 29100(개인정보보호) → ISO 27017(클라우드 정보보호)",
      "핵심: 클라우드 특유의 통제(멀티테넌트 분리·암호키 독립 관리·공급자 사용자 역할 분담)를 27002에 추가한 클라우드 전용 지침",
    ],
  },
  {
    title: "개인정보 프라이버시 8원칙",
    course: "SC",
    definition:
      "개인정보의 수집 및 관리에 대한 국제사회의 합의를 반영한 국제 기준",
    defShort: "개인정보 수집 및 관리에 대한 국제사회 합의를 반영한 OECD 국제 기준",
    lead: "OECD 개인정보 8원칙, 프라이버시 원칙",
    features: ["국제 합의 기준", "목적 범위 내 이용", "개인 참가 보장"],
    keywords: ["수정목이안공참책", "수집 제한", "정보 정확성", "목적 명확화", "이용 제한", "안전성 확보", "공개", "개인 참가", "책임"],
    tables: [
      {
        caption: "개인정보 프라이버시 8원칙",
        headers: ["원칙", "설명"],
        rows: [
          ["1. 수집 제한의 원칙(Collection Limitation Principle)", "적법·공정한 수단으로 수집\n정보주체 인지·동의 후 수집"],
          ["2. 정보 정확성의 원칙(Data Quality Principle)", "이용 목적에 부합하는 것만 수집\n목적 범위 내 정확·완전·최신 유지"],
          ["3. 목적의 명확화 원칙(Purpose Specification Principle)", "수집 이전·당시 목적 명시\n명시된 목적으로만 이용"],
          ["4. 이용제한의 원칙(Use Limitation Principle)", "수집된 목적으로만 이용\n예외: 정보주체 동의·법률 허가"],
          ["5. 안전성 확보의 원칙(Security Safeguards Principle)", "분실·불법 접근·훼손\n사용·변조·공개 위험 대비\n합리적 보호조치 마련"],
          ["6. 공개의 원칙(Openness Principle)", "관리자 주소·이용목적·관련 정책\n포함된 공개방침 필요"],
          ["7. 개인 참가의 원칙(Individual Participation Principle)", "본인 개인정보 확인, 열람요구\n이의제기\n정정·삭제·보완 청구권"],
          ["8. 책임의 원칙(Accountability Principle)", "관리자는 원칙 준수 제반조치 취함"],
        ],
      },
      {
        caption: "프라이버시 8원칙과 개인정보보호법의 비교",
        headers: ["OECD 프라이버시 8원칙", "개인정보보호법 제3조(개인정보보호 원칙)"],
        rows: [
          ["① 수집제한의 원칙(Collection Limitation Principle)", "필요 최소정보의 수집(제1항)\n사생활 침해 최소화 처리(제6항)\n익명처리의 원칙(제7항)"],
          ["② 정보 정확성의 원칙(Data Quality Principle)", "정확성·완전성·최신성(제3항)"],
          ["③ 목적 명확화 원칙(Purpose Specification Principle)", "처리목적의 명확화(제1항)"],
          ["④ 이용 제한의 원칙(Use Limitation Principle)", "목적 범위 내 적법 처리\n목적 외 활용 금지(제2항)"],
          ["⑤ 정보의 안전한 보호의 원칙(Security Safeguards Principle)", "권리침해 고려 안전 관리(제4항)"],
          ["⑥ 공개의 원칙(Openness Principle)", "처리방침 등 공개(제5항)"],
          ["⑦ 개인 참가의 원칙(Individual Participation Principle)", "열람청구권 등 권리보장(제5항)"],
          ["⑧ 책임의 원칙(Accountability Principle)", "책임준수·신뢰확보 노력(제8항)"],
        ],
      },
    ],
    notes: [
      "8원칙 두음: 수집제한·정보정확성·목적명확화·이용제한·안전성확보·공개·개인참가·책임",
      "GDPR·개인정보보호법의 뿌리 — 국내 개인정보보호법의 처리 원칙(제3조)이 이 8원칙에 기반",
    ],
  },
  {
    title: "개인정보 보호기술",
    course: "SC",
    definition:
      "개인 정보의 처리(수집, 기록, 파기 등) 중에 발생할 수 있는 부정한 사용 또는 유출 등의 위험으로부터 개인의 정보를 안전하게 보호할 수 있도록 하는 기술과 정책의 총칭",
    defShort: "유출 등 위험에서 개인의 정보를 안전하게 보호하는 기술과 정책의 총칭",
    lead: "개인정보 보호의 기술 총칭, 개인정보 보호기술",
    features: ["기술·정책 결합", "처리 전 과정 보호", "단계별 통제"],
    keywords: ["정책협상", "프라이버시 정책", "쿠키관리", "암호화", "익명화"],
    tables: [
      {
        caption: "개인정보 보호기술 종류",
        headers: ["보호기술", "설명"],
        rows: [
          ["정책협상 기술", "W3C 개인정보보호 표준 플랫폼\n웹 사이트 데이터 처리 표준 제시\n이용자 정보 잘못된 사용 방지"],
          ["프라이버시 정책 생성", "개인정보 보호방침 입력\n보호방침 HTML 자동 작성·출력"],
          ["Cookie 관리(통제 및 필터링)", "쿠키 수용 여부 결정·관리\n저장 정보 판단 방법\n컴퓨터 저장 쿠키 통제권 제공"],
          ["암호화 S/W", "전자메일·메시지·파일 암호화\n당사자만 디지털 키로 열람\n디지털 키는 브라우저 등과 결합"],
          ["익명화(anonymizers) 기술", "IP 식별·쿠키 저장 차단\n익명화된 메일 발송 가능\n개인화 서비스 등 사용 불가"],
        ],
      },
      {
        caption: "개인정보보호 기술적 통제방안",
        headers: ["분류", "통제그룹", "통제요소", "설명"],
        rows: [
          ["필터링 기술", "네트워크 필터링", "방화벽\nIDS/IPS\nTMS", "외부/내부 네트워크 접근제어\n침해행위 탐지/방어\n위협 사전 감지·조기 경보"],
          ["필터링 기술", "개인정보노출차단", "ILP\n개인정보스캐너", "e-mail·SMS 통한 유출 탐지/차단\n웹 사이트 개인정보 노출 검색"],
          ["필터링 기술", "개인정보침해차단", "애드 브로커\n스파이웨어 필터\n스팸 방지", "무분별 광고·팝업 차단\n스파이웨어 다운로드·실행 차단\n베이시안·전자우표·Black list"],
          ["개인정보 통신", "개인정보 은닉", "리메일러\n경로 제거기\n익명화", "메시지 익명으로 최종 수신자 전송\n서비스 이용정보 노출 방지\nIP주소 은닉, 쿠키저장 차단\nProxy/라우팅/Mix-net/P2P"],
          ["개인정보 통신", "개인정보 암호화", "VPN\n보안서버", "암호화 터널링 통한 가상 사설망\nHTTPS 기반 웹 서버 암호화 통신"],
          ["개인정보 통신", "개인정보 인증", "i-PIN\nPKI\nOpenID", "주민등록번호 대신 신원확인 번호\n공개키/비밀키 기반 인증 인프라\nURL 입력 개방·분산형 인증"],
          ["개인정보 저장", "DB암호화", "DB암호화 솔루션", "DB에 저장된 데이터 암호화 저장"],
          ["개인정보 저장", "OS 보안", "Secure OS", "OS 취약성 보강 인증·접근제어"],
          ["개인정보 정책", "XML기반", "P3P", "W3C 제정 개인정보 정책 기술 표준\n이용자가 자신의 개인정보 제어"],
        ],
      },
    ],
    notes: [
      "핵심: 필터링(노출·침해 차단) + 통신 보호(은닉·암호화·인증) + 저장 보호(DB암호화·Secure OS) + 정책(P3P)",
      "P3P: W3C 표준으로 웹사이트가 개인정보 처리 정책을 기계가 읽을 수 있게 기술 — 정책협상 기술의 핵심",
    ],
  },
  {
    title: "위험분석 방법론 (ISO/IEC 1335-1, 위험분석 전략/평가)",
    course: "SC",
    definition:
      "자산의 위험을 식별·분석·평가하여 적절한 보안 대책을 수립하기 위한 위험분석 접근법과 평가 방법의 체계",
    defShort: "자산의 위험을 식별·분석·평가해 적절한 보안 대책을 세우는 분석 체계",
    lead: "위험 식별과 평가의 체계, 위험분석 방법론",
    features: ["자산 중심 분석", "정성·정량 평가", "선별적 적용"],
    keywords: ["베이스라인 접근법", "비정형 접근법", "상세 위험 분석", "복합 접근법", "정성적 평가", "정량적 평가"],
    tables: [
      {
        caption: "위험분석 접근법 (ISO/IEC 1335-1)",
        headers: ["접근법", "설명", "특징"],
        rows: [
          ["베이스라인 접근법", "표준 보안대책을\n체크리스트 점검", "보안 표준화\n비용·시간 절약"],
          ["비정형 접근법", "전문가 경험\n통찰력 기반 분석", "시간·비용 절약\n비용 불확실성"],
          ["상세 위험 분석", "자산·위협·취약성\n단계별 정량 평가", "연간 예상 손실\n효율적 대책"],
          ["복합 접근법", "고위험은 상세\n그 외 베이스라인", "선별적 적용\n빠른 전략 구축"],
        ],
      },
      {
        caption: "위험 평가 방법",
        headers: ["구분", "개념", "특징", "종류"],
        rows: [
          ["정성적 평가 방법", "위험 크기·손실\n상대적 비교", "적은 계산·시간\n주관적", "델파이법\n시나리오법\n순위결정법"],
          ["정량적 평가 방법", "위험 크기·손실\n금액·숫자 표현", "계산 복잡\n성능 평가 용이", "민감도 분석\n금전적 기대값\n몬테카를로\n의사결정 나무"],
        ],
      },
    ],
    notes: [
      "접근법 4종: 베이스라인(체크리스트)·비정형(전문가)·상세(정량 모델)·복합(고위험만 상세)",
      "정성적(상대적 비교: 델파이·시나리오)과 정량적(금액·숫자: 몬테카를로·의사결정나무) 평가 구분",
    ],
  },
  {
    title: "IEC 62443",
    course: "SC",
    definition:
      "산업제어시스템(IACS) 보안관리 요구사항과 보안기술, 제품의 개발 요구사항 및 구성요소에 대한 기술적 보안 요구사항 등이 정의되어 있는 산업제어시스템 보안 국제 표준",
    defShort: "보안관리·개발·보안 요구사항 정의한 산업제어시스템 보안 국제 표준",
    lead: "산업제어시스템 보안 표준, IEC 62443",
    features: ["제어시스템 특화", "Zone 기반 분할", "보안수준(SL) 정의"],
    keywords: ["General", "Policy & Procedure", "System", "Component"],
    tables: [
      {
        caption: "IEC 62443 세부 구성",
        headers: ["구분", "세부", "설명"],
        rows: [
          ["General(일반) Part 1", "용어 정의, 컨셉, 모델", "7개 FR: 식별 및 인증, 사용제어\n시스템 무결성, 데이터 기밀성\n데이터 제한성, 응답성\n자원가용성"],
          ["General(일반) Part 1", "용어, 약어 사전", "용어·약어 마스터 용어집 정의"],
          ["General(일반) Part 1", "시스템 보안 적합 Metric", "IACS 사이버 보안 적합성 측정 기준"],
          ["General(일반) Part 1", "라이프사이클 및 유즈케이스", "보안 라이프사이클·실증 사례"],
          ["Policy & Procedure(정책 및 절차) Part 2", "IACS 보안 프로그램 수립", "사이버 보안관리 시스템 구축 요소"],
          ["Policy & Procedure(정책 및 절차) Part 2", "IACS 보안 관리 가이드 작성", "구현 후 보안관리시스템 운영 방안"],
          ["Policy & Procedure(정책 및 절차) Part 2", "IACS 환경 패치 관리", "IT와 다른 IACS 환경 패치 관리"],
          ["Policy & Procedure(정책 및 절차) Part 2", "IACS 공급 업체 준수 요구사항", "공급 업체 설치·유지관리 요구"],
          ["System(시스템) Part 3", "IACS 보안 기술", "보안 도구, 완화 대응책, 기술"],
          ["System(시스템) Part 3", "영역, 전송에 대한 보안 수준", "시스템·네트워크 경로 보안 수준"],
          ["System(시스템) Part 3", "시스템 보안 요구 사항 및 수준", "위험 평가 단계 필요 기능 식별"],
          ["Component(컴포넌트) Part 4", "제품 개발 요구 사항", "보안개발생명주기 요구사항"],
          ["Component(컴포넌트) Part 4", "IACS 컴포넌트 요구 사항", "7개 FR 상세 컴포넌트 요구사항"],
        ],
      },
      {
        caption: "IEC 62443 7대 기본 요구사항(7 FR)",
        headers: ["FR", "내용"],
        rows: [
          ["FR1", "식별 및\n인증(Identification and\nAuthentication Control)"],
          ["FR2", "사용제어(Use Control)"],
          ["FR3", "시스템 무결성(System\nIntegrity)"],
          ["FR4", "데이터\n기밀성(Data\nConfidentiality)"],
          ["FR5", "데이터 제한성(Restricted\nData Flow)"],
          ["FR6", "적시성·이벤트 응답(Timely\nResponse to Events)"],
          ["FR7", "자원 가용성(Resource\nAvailability)"],
        ],
      },
    ],
    notes: [
      "4파트 두음: General(일반)·Policy & Procedure(정책·절차)·System(시스템)·Component(컴포넌트)",
      "산업제어시스템(IACS·SCADA·PLC) 전용 보안 표준 — 스마트팩토리·발전소 등 OT 보안의 근거",
    ],
  },
  {
    title: "ISO 27018",
    course: "SC",
    definition:
      "Public Cloud환경에서 개인식별정보(PII : Personally Identifiable Information)를 보호하기 위한 통제 국제표준",
    defShort: "Public Cloud환경의 개인식별정보 보호 위한 통제 국제표준",
    lead: "클라우드 PII 보호, ISO 27018",
    features: ["클라우드 PII 보호", "27001·27002 기반", "고객 지시 처리"],
    keywords: ["클라우드 내 개인식별정보(PII)", "개인정보 보호", "ISO 27001", "개요", "동의와 선택", "사용목적의 정당성 및 규격", "수집제한", "데이터 최소화", "사용, 보유 및 공개 제한", "정확성과 품질", "개방성·투명성", "개인 참여와 접근", "책임", "정보보호", "개인정보 보호규정"],
    tables: [
      {
        caption: "ISO 27018 확장 통제 구성 요소",
        headers: ["확장 통제항목", "설명"],
        rows: [
          ["A.1 General(개요)", "퍼블릭 클라우드 PII 보호 개요"],
          ["A.2 Consent and choice(동의와 선택)", "고객의 지시에 따라 개인정보 처리"],
          ["A.3 Purpose legitimacy and specification(사용목적의 정당성 및 규격)", "목적 외 고객 데이터 사용금지\n고객의 명시적 동의 필요"],
          ["A.4 Collection limitation(수집제한)", "개인정보 수집 목적 명확화\n목적 외 수집 제한"],
          ["A.5 Data minimization(데이터 최소화)", "지정된 기간 내 파기\n가공 시 발생 임시 파일 삭제 처리"],
          ["A.6 Use, retention and disclosure limitation(사용·보유·공개 제한)", "법적 의무 시 사전 고객 고지 의무\n내용, 대상, 시간"],
          ["A.7 Accuracy and quality(정확성과 품질)", "정확성·사용 품질 확보 도구 마련"],
          ["A.8 Openness, transparency and notice(개방성·투명성)", "계약 체결 전 PII 처리 위치 공개"],
          ["A.9 Individual participation and access(개인 참여와 접근)", "이용자 액세스 권한 주장 시 제공\n규정 준수"],
          ["A.10 Accountability(책임)", "PII 무단 접근·손실 시 즉시 고지"],
          ["A.11 Information security(정보보호)", "기밀 유지 의무\n하드 카피 작성 제한\n암호화 포함 접근 제한 조치"],
          ["A.12 Privacy compliance(개인정보 보호규정)", "PII 반품, 양도, 삭제 정책 보유\n고객 관련 정책 정보 제공"],
        ],
      },
    ],
    notes: [
      "표준 계보: ISO 27001·27002·29100 기반 → ISO 27018(퍼블릭 클라우드 PII 보호)",
      "ISO 27017(클라우드 정보보호 일반)과 짝 — 27018은 특히 개인식별정보(PII) 보호에 특화",
    ],
  },
  {
    title: "차량 사이버 보안 국제 표준(ISO 21434)",
    course: "SC",
    definition:
      "차량 기획 단계부터 생산 및 Post Production 과정까지 사이버보안 활동에 관한 프로세스를 정의하는 것을 목적으로 만들어진 국제 표준",
    defShort: "차량 기획 단계부터 사이버보안 활동에 관한 프로세스 정의하는 국제 표준",
    lead: "차량 생애주기 보안, ISO 21434",
    features: ["전 생애주기 보안", "위험 평가 기반", "공급망 분산 활동"],
    keywords: ["사이버 보안 활동 프로세스", "개요", "참고 문헌", "용어 및 약어 정의", "고려사항", "조직 사이버 보안 관리", "프로젝트 사이버 보안 관리", "분산 사이버 보안 활동", "지속적인 사이버보안 활동", "제품 개념 설계", "제품 개발", "사이버 보안 검증", "제품 생산", "운영 및 유지", "기술 지원 및 보증 종료", "위험 분석 및 위험 평가 방법"],
    tables: [
      {
        caption: "ISO/SAE 21434 구성",
        headers: ["구분", "내용"],
        rows: [
          ["1~4. 기본", "개요, 참고 문헌\n용어 및 약어 정의\n일반적인 고려사항"],
          ["5. 조직 사이버보안 관리", "사이버보안 정책·문화\n정보 공유, 시스템·도구 관리\n정보 보안 관리\n조직 사이버보안 감사"],
          ["6. 프로젝트 사이버보안 관리", "책임자 선정, 보안 계획 수립\n수정·재사용 작업\n불필요 요소, 기성 요소\n사이버보안 사례·평가, 내역 공개"],
          ["7. 분산 사이버보안 활동", "공급망 내 이해관계자 능력 평가\n보안 활동 업무 할당\n책임 소재 확립"],
          ["8. 지속적인 사이버보안 활동", "사이버보안 모니터링\n사이버보안 이벤트 평가\n취약점 분석, 취약점 관리"],
          ["9. 제품 개념 설계", "아이템 선정\n사이버보안 목표 설정\n사이버보안 개념 설계"],
          ["10. 제품 개발", "제품 디자인\n사이버보안 목표 설정"],
          ["11. 사이버보안 검증", ""],
          ["12. 제품 생산", ""],
          ["13. 운영 및 유지", "사이버보안 사고 대응\n업데이트"],
          ["14. 기술 지원 및 보증 종료", ""],
          ["15. 위험 분석 및 위험 평가 방법", "자산 식별, 위협 시나리오 식별\n영향도 측정, 공격 경로 분석\n실현 가능성 측정, 위험도 측정\n위험 처리 방법 결정"],
        ],
      },
    ],
    notes: [
      "구성: General → Policy & Procedure → System → Component처럼 조직·프로젝트·분산·지속 관리로 구성",
      "CSMS(사이버보안 관리체계) 인증 프레임워크의 근거 — 커넥티드카·자율주행 보안의 핵심 표준",
    ],
  },
  {
    title: "ISO 27701",
    course: "SC",
    definition:
      "개인정보 보호를 위한 ISO/IEC 27001 및 ISO/IEC 27002의 확장판으로, 조직이 개인정보보호를 위해 갖추어야 하는 요구사항과 가이드라인을 동시에 제공하는 표준",
    defShort: "조직의 개인정보보호를 위한 요구사항과 가이드라인을 제공하는 표준",
    lead: "개인정보보호 관리체계, ISO 27701",
    features: ["ISMS 기반 확장", "PII 역할별 지침", "GDPR 대응 매핑"],
    keywords: ["1.범위", "2.규범 참조들", "3.용어, 정의, 약어", "4.일반", "5.PIMS 관련 요구 사항", "6.PIMS 관련 지침", "7.PII 통제자에 대한 추가 ISO/IEC 27002 지침", "8.PII 처리자에 대한 추가 ISO/IEC 27002 지침"],
    tables: [
      {
        caption: "ISO/IEC 27701의 구성",
        headers: ["구분", "항목", "설명"],
        rows: [
          ["1", "SCOPE", "범위"],
          ["2", "Normative References", "규범 참조들"],
          ["3", "Terms, definitions, abbreviations", "용어, 정의, 약어"],
          ["4", "General", "일반"],
          ["5", "PIMS-specific requirements related to ISO/IEC 27001", "ISO/IEC 27001 관련 PIMS 요구 사항"],
          ["6", "PIMS-specific guidance related to ISO/IEC 27001", "ISO/IEC 27001 관련 PIMS 지침"],
          ["7", "Additional ISO/IEC 27002 guidance for PII controllers", "PII 통제자에 대한 추가 27002 지침"],
          ["8", "Additional ISO/IEC 27002 guidance for PII Processors", "PII 처리자에 대한 추가 27002 지침"],
          ["Annex A", "(normative) PIMS-specific reference control objectives and controls (PII Controllers)", ""],
          ["Annex B", "(normative) PIMS-specific reference control objectives and controls (PII Processors)", ""],
          ["Annex C", "(informative) Mapping to ISO/IEC 29100", ""],
          ["Annex D", "(informative) Mapping to the General Data Protection Regulation", ""],
          ["Annex E", "(informative) Mapping to ISO/IEC 27018 and ISO/IEC 29151", ""],
          ["Annex F", "(informative) How to apply ISO/IEC 27701 to ISO/IEC 27001 and ISO/IEC 27002", ""],
        ],
      },
      {
        caption: "ISO/IEC 27701의 점검 항목",
        headers: ["항목", "설명"],
        rows: [
          ["Scope", "비즈니스 지원 인력\n프로세스 및 기술 식별"],
          ["Gap Analysis", "현재 문서화 상태\n조직 통제 환경 상태\n보안 상태, 위험 완화 환경 식별\n성능·가용성 정기 확인, 변경 공유"],
          ["Control Implementation", "격차 해결 컨트롤 설계\n격차 해소 통제 수단 구현"],
          ["Statement of Applicability(SOA)", "모든 조항 제어 문서화\nAnnex A 제어 문서화"],
          ["Internal Audit", "내부 감사자 식별, 접근 권한 부여"],
          ["Audit Ready", "감사자 식별·기대치 설정 킥오프"],
          ["Maintenance", "규정 준수 위한 프로그램 유지\n매년 감사 수행"],
        ],
      },
    ],
    notes: [
      "구조: ISMS(ISO 27001)에 PIMS(개인정보보호 관리체계)를 얹은 것 — PII 통제자와 처리자를 구분해 지침 제공",
      "GDPR 대응의 국제 인증 표준 — ISO 29100·29151·27018과 매핑",
    ],
  },
  {
    title: "ISO/IEC 20889",
    course: "SC",
    definition:
      "프라이버시 침해 없이 개인정보를 처리하기 위한 비식별화 기법 및 관련 기술을 제시하는 개인정보 비식별조치 국제표준",
    defShort: "프라이버시 침해 없는 비식별화 기법 제시 개인정보 비식별조치 국제표준",
    lead: "개인정보 비식별조치, ISO 20889",
    features: ["비식별 기법 표준", "프라이버시 보존", "재식별 방어 모델"],
    keywords: ["개인정보 비식별조치", "통계도구", "일반화", "해부화", "가명화", "삭제", "암호화", "무작위화", "재현데이터"],
    tables: [
      {
        caption: "개인정보 비식별조치 표준 기법",
        headers: ["구분", "기술", "설명"],
        rows: [
          ["대체", "통계도구", "표본 추출, 총계 처리"],
          ["대체", "일반화", "범주화, 일반화\n랜덤·제어 라운딩\n상하단 코딩"],
          ["대체", "해부화", "테이블 해부화, 컬럼 해부화"],
          ["대체", "가명화", "암호화, 토큰화, 랜덤할당\n스와핑, 휴리스틱"],
          ["제거", "삭제", "마스킹, 식별자 삭제\n컬럼 삭제, 레코드 삭제"],
          ["변경", "암호화", "결정성 암호화\n순서보존·형태보존 암호화\n동형 암호화\n동형 비밀 분산"],
          ["변경", "무작위화", "순열, 잡음 추가, 부분 총계"],
          ["생성", "재현데이터", "완전 재현, 부분 재현\n하이브리드 재현"],
        ],
      },
      {
        caption: "프라이버시 보호 모델",
        headers: ["구분", "모델", "설명"],
        rows: [
          ["식별 방어", "K-익명성", "연결공격 방어\n동일 값 레코드 K개 이상"],
          ["속성 방어", "L-다양성", "동질성·배경지식 공격 방어\n민감 속성 L개 이상 다양성"],
          ["분포 방어", "T-근접성", "쏠림·유사성 공격 방어\n전체 분포와 차이 T 이하"],
        ],
      },
    ],
    notes: [
      "프라이버시 보호 모델: K-익명성 → L-다양성(동질성 보완) → T-근접성(쏠림 보완) 순으로 강화",
      "가명처리 기법 토픽과 짝 — ISO 20889는 비식별 기법의 국제 표준 근거",
    ],
  },
  {
    title: "전자증거개시제도(e-Discovery)",
    course: "SC",
    definition:
      "소송 또는 규제 요구에 대응하기 위해 디지털 형태로 존재하는 전자적 자료(ESI, Electronically Stored Information)를 수집, 준비, 검토, 구성, 생산하여 개시하는 절차",
    defShort: "소송·규제 대응에 전자적 자료(ESI) 수집·검토해 개시하는 절차",
    lead: "전자자료의 소송 개시, e-Discovery",
    features: ["ESI 대상 개시", "사전 방어적 대응", "민사 소송 적용"],
    keywords: ["EDRM", "ESI", "정보관리", "식별", "보존·수집", "처리·검토·분석", "산출"],
    tables: [
      {
        caption: "EDRM(Electronic Discovery Reference Model) 절차",
        headers: ["절차", "설명"],
        rows: [
          ["정보 관리", "기록 유지·보존 필수기간 보존\n소송 유지 절차 소송 절차 수립"],
          ["식별", "보존 의무 발효 의무 발효 시점\nEDRM 담당자 필수 ESI 식별"],
          ["보존·수집", "관련 문서 발견 증거 문서 탐색\n손상 방지 취합 다음 단계 전달"],
          ["처리·검토·분석", "양 최소화·변환 포맷 변환 처리\n민감성·면책성 검토 후 법률분석"],
          ["산출", "ESI 검토 완료 면책·민감 제거\n기밀 문서 제거 당사자 정보 제공"],
        ],
      },
      {
        caption: "e-Discovery와 디지털 포렌식 비교",
        headers: ["구분", "e-Discovery", "디지털 포렌식"],
        rows: [
          ["목적", "요구에 의한\n방어적 증거개시", "공격적 수사기법\n증거 제출"],
          ["특징", "사전 원칙·분류\n절차 중심", "사후 추적·분석\n절차 중심"],
          ["관점", "쌍방에 의한\n민간 소송 적용", "강제적\n형사 소송 적용"],
          ["원칙", "법적근거·\n내부 규정 원칙", "연계 보관성\nCoC 원칙"],
        ],
      },
    ],
    notes: [
      "EDRM 절차: 정보관리 → 식별 → 보존·수집 → 처리·검토·분석 → 산출",
      "디지털 포렌식과 구분: e-Discovery는 민사·사전 방어(ESI 개시), 포렌식은 형사·사후 수사(증거 추적)",
    ],
  },
  {
    title: "제로트러스트 가이드라인 2.0",
    course: "SC",
    definition:
      "암시적 신뢰를 제거하고 엄격한 인증 및 승인을 하는 무신뢰 기반 과립형 경계(Granular Perimeter) 보안 모델",
    defShort: "암시적 신뢰 제거, 엄격한 인증·승인 무신뢰 기반 과립형 경계 보안 모델",
    lead: "신뢰 제거 검증 기반, 제로트러스트 2.0",
    features: ["암시적 신뢰 제거", "PDP·PEP 분리", "과립형 경계"],
    keywords: ["제로 트러스트", "성숙도 모델", "지속적 검증", "최소 권한", "다중 요소 인증", "접근 제어", "정책 기반 접근", "PDP", "PEP", "통합 보안 관리"],
    tables: [
      {
        caption: "제로 트러스트 보안 모델 Framework 구성 요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["핵심 구성요소", "정책 엔진(PE)", "신뢰도 데이터 분석\n접근 요청 허용 또는 거부 결정"],
          ["핵심 구성요소", "정책 관리자(PA)", "PE 결정 바탕 세션 생성·종료\n접근 실행 및 통제"],
          ["핵심 구성요소", "정책결정지점(PDP)", "접근 요청 평가, 허용 여부 결정\n핵심 요소(PE, PA) 포함"],
          ["핵심 구성요소", "정책시행지점(PEP)", "주체·리소스 접근 요청 모니터링\nPA 명령 따라 허용·거부·차단"],
          ["정책 정보지점(PIP)", "규제 내부 규정\n데이터 접근 정책\n보안 정보 및 이벤트", "법적 규제·기업 규정 준수 확인\n리소스 접근 속성·규칙·정책\n차후 분석용 보안 정보 수집"],
          ["정책 정보지점(PIP)", "위협 인텔리전스\nID 관리 시스템\n네트워크, 시스템, 행위,로그", "내·외부 발생 보안 위협 정보\n사용자 계정·식별 기록 관리\n로그·분석 결과(공격 가능성)"],
        ],
      },
      {
        caption: "제로 트러스트 모델과 기존 Inner Trust 모델 비교",
        headers: ["비교 항목", "제로 트러스트 모델", "Inner Trust 모델"],
        rows: [
          ["시스템 운영방식", "클라우드 기반\n서비스 호스팅", "온프레미스(On-Premise)"],
          ["보안 정책", "과립형 경계 시행\n(Granular Perimeter)", "경계 보안\n(Perimeter Security Model)"],
          ["시스템 설계", "내부(자산 식별)\n→ 외부 설계", "외부 → 내부 설계"],
          ["검증/모니터링 대상", "엔드포인트\n자산/데이터\n모든 트래픽", "외부 접속\n트래픽"],
        ],
      },
      {
        caption: "제로트러스트 성숙도 모델 2.0의 성숙도 4단계",
        headers: ["구분", "단계", "설명"],
        rows: [
          ["기본 단계", "1단계: 기존 단계", "주요 구성 요소 수동 설정\n경계 기반 보안 위주 아키텍처\n정책 시행 제한적"],
          ["기본 단계", "2단계: 초기 단계", "일부 프로세스 자동화\n핵심 요소별 연계\n내부 시스템 기본 모니터링"],
          ["고급 단계", "3단계: 향상 단계", "자동화 범위 확장\n중앙 집중형 제어 강화\n핵심 요소 간 상호작용 기반 정책"],
          ["고급 단계", "4단계: 최적화 단계", "자산·리소스 완전 자동화\n동적인 정책 적용\n트리거 기반 정책 생성\n최소 권한 접근 허용"],
        ],
      },
    ],
    notes: [
      "핵심 원칙: '절대 신뢰하지 말고 항상 검증하라(Never Trust, Always Verify)' — 암시적 신뢰 제거",
      "PDP(정책결정지점: PE+PA)와 PEP(정책시행지점)의 분리, 기존 Inner Trust(경계 보안)와의 대비가 시험 포인트",
    ],
  },
  {
    title: "SDP(Software Defined Perimeter)",
    course: "SC",
    definition:
      "어플리케이션 연결 허용 이전에 사용자의 상태 및 ID를 기반으로 선 인증, 후 연결 방식의 신뢰적 보안연결을 제공하는 클라우드 환경의 네트워크 접근제어 프레임워크",
    defShort: "선 인증, 후 연결로 보안연결을 제공하는 네트워크 접근제어 프레임워크",
    lead: "선 인증 후 연결 경계, SDP",
    features: ["선 인증·후 연결", "동적 화이트리스트", "제로트러스트 구현"],
    keywords: ["Zero Trust", "선 인증·후 연결", "SDP Controller", "SDP Agent", "SDP Gateway", "신원중심", "PDP", "PEP", "ZTNA"],
    tables: [
      {
        caption: "SDP 구성 요소",
        headers: ["구성요소", "기술요소", "설명"],
        rows: [
          ["SDP Agent", "PKI, SAML, OAuth", "Controller 통신 후 접속허가\nGateway로 보안접속 처리"],
          ["SDP Controller", "제로트러스트\nRBAC", "구성요소 통신\n연결 여부 결정"],
          ["SDP Gateway", "IPSec\nSPA(단일패킷인증)", "신원 확인 사용자\n연결 기능 제공"],
        ],
      },
      {
        caption: "SDP 접근 제어 메커니즘",
        headers: ["구분", "절차", "설명"],
        rows: [
          ["인증", "① 접속요청", "인증 기술로 접속 요청(OAuth 등)"],
          ["인증", "② 정보전달", "SPA 활용 사용자 인증"],
          ["인증", "③ 접속허가", "Zero Trust 기반 접근 정책·통제"],
          ["연결", "④ 보안접속", "IPSec 전송·터널모드 보안 접속"],
          ["연결", "⑤ 허용 서비스 접속", "인증 사용자 보호 서버자원 접속\n서비스 제공"],
        ],
      },
      {
        caption: "VPN과 SDP 비교",
        headers: ["항목", "VPN", "SDP"],
        rows: [
          ["개념", "서로 다른 양단\n사설망 연결 기술", "선인증·후연결\nN/W 경계 기술"],
          ["기술요소", "전송모드·터널모드\nIKE\nSPD·SAD\nAH·ESP", "Agent\nController\nGateway\nIPSec"],
          ["방화벽 운영방식", "블랙리스트\nIP 정적 설정", "화이트리스트\nID 동적 설정"],
        ],
      },
      {
        caption: "SDP 정책(PDP)과 환경(PEP)",
        headers: ["구분", "설명"],
        rows: [
          ["PDP (Policy Decision Point)", "주체의 리소스 액세스 권한 결정\n클라이언트 사용 자격 증명 생성"],
          ["PEP (Policy Enforcement Point)", "사용자-리소스 연결 직접 활성화\n연결 모니터링 및 종료"],
        ],
      },
    ],
    notes: [
      "SDP 정책: PDP(정책결정지점: 액세스 권한 결정·자격증명 생성)와 PEP(정책시행지점: 사용자-리소스 연결 활성화·모니터링·종료)",
      "핵심: 제로트러스트(ZTNA)의 대표 구현 — '연결하기 전에 먼저 인증(선 인증)', 화이트리스트·ID 기반 동적 설정이 VPN과의 차이",
    ],
  },
  {
    title: "접근 제어/접근 통제(Access Control)",
    course: "SC",
    definition:
      "사용자(주체)의 신원을 식별·인증하여 대상 정보(객체)의 접근, 사용수준을 인가(Authorization)하는 기법",
    defShort: "주체 신원을 식별·인증해 객체 접근과 사용수준을 인가하는 보안 기법",
    lead: "주체·객체의 인가 통제, 접근 제어",
    features: ["주체 신원 기반", "최소 권한", "직무 분리"],
    keywords: ["주체", "권한", "객체", "정책", "모델", "메커니즘", "최소 권한 부여", "직무 분리", "MAC", "DAC", "RBAC", "ABAC", "Bell-LaPadula", "BIBA", "Clark-Wilson", "만리장성"],
    tables: [
      {
        caption: "접근 제어의 개념",
        headers: ["요소", "설명"],
        rows: [
          ["주체(Subject)", "인가 받으려는 사용자/그룹"],
          ["객체(Object)", "접근 대상 자원·정보"],
          ["권한(Permission)", "객체에 허용된 주체 수행 행위 목록"],
          ["접근 제어(Access Control)", "주체의 객체 접근 권한 보유 판단"],
        ],
      },
      {
        caption: "접근 제어 3요소",
        headers: ["요소", "설명"],
        rows: [
          ["정책(Policy)", "사용자·그룹 접근 허용 결정\n리소스 접근 제한 범위 결정"],
          ["모델(Model)", "수학·논리 구조 정책 적용법 정의"],
          ["메커니즘(Mechanism)", "정책·모델 실현 기술적 방법 정의"],
        ],
      },
      {
        caption: "접근 통제 정책의 비교 (MAC·DAC·RBAC·ABAC)",
        headers: ["구분", "MAC(강제적 접근 통제)", "DAC(임의적 접근 통제)", "RBAC(역할 기반 접근 통제)", "ABAC(속성 기반 접근 통제)"],
        rows: [
          ["개념", "보안 등급 기반\n관리자 권한 설정", "객체 소유자\n접근 권한 부여\n유연성 높음", "역할(Role) 기반\n접근 제어", "속성(Attribute) 기반\n동적 접근 통제"],
          ["주체의 권한", "자신의 권한\n변경 불가", "소유자가 파일\n리소스 권한 부여", "역할 변경 시\n권한 변동", "조건 충족 시\n접근 가능"],
          ["관리 주체", "보안 정책 관리자\n중앙 집중식", "소유자(Owner)\n분산형", "보안 관리자", "정책 관리자\n시스템"],
          ["보안 강도", "높음\n엄격한 보안 정책", "낮음\n권한 조정 가능", "중간 ~ 높음\n역할 기반 관리", "높음\n상황별 동적 제어"],
          ["적용 방식", "보안 등급 기준\n레벨 사용자만\n접근 허가", "소유자 설정 기준\n소유자 판단", "역할(Role) 기준", "사용자·리소스\n환경 속성 기준"],
          ["유연성", "낮음\n고정된 정책", "높음\n소유자 권한 조정", "중간\n역할 변경 조정", "높음\n상황별 조건 설정\n자동화 지원"],
          ["대표 구현 사례", "Bell-LaPadula(BLP)\nBIBA 모델\nClark-Wilson 모델\n만리장성 모델", "Access Control Matrix\nAccess Control List\nCapability Tickets\nPermission Table", "", ""],
          ["적용 사례", "군사·정부기관\n보안 중요 시스템\n게시판 등급제", "기업 파일 공유\n개인 시스템\n대부분 상용 DBMS", "기업·금융\n대규모 조직", "클라우드·IoT\n의료·동적 보안"],
        ],
      },
      {
        caption: "접근 제어 원칙",
        headers: ["원칙", "설명"],
        rows: [
          ["최소 권한 부여", "업무 필수 권한 최소 범위 부여"],
          ["직무 분리 원칙", "보안/감사, 개발/생산\n암호키 관리/변경\n직무에 따라 권한 분리"],
        ],
      },
    ],
    notes: [
      "MAC(강제·보안등급·군사)·DAC(임의·소유자·상용DBMS)·RBAC(역할·기업)·ABAC(속성·동적·클라우드) 4정책 비교가 핵심",
      "접근 통제 모델 토픽(BLP·BIBA·Clark-Wilson·만리장성)과 연계 — 최소 권한·직무 분리가 2대 원칙",
    ],
  },
  {
    title: "접근 통제 모델",
    course: "SC",
    definition:
      "누가(주체, Subject)가 무엇(객체, Object)에 대해 어떤 권한(Access Right)을 가지는지를 결정하는 규칙과 정책을 제공하는 모델",
    defShort: "주체가 객체에 어떤 권한을 갖는지 결정하는 규칙과 정책을 제공하는 모델",
    lead: "주체·객체 권한의 규칙, 접근 통제 모델",
    features: ["주체·객체·권한", "보안 목적별 규칙", "정보 흐름 방향 통제"],
    keywords: ["Bell-LaPadula(No Read Up, No Write Down)", "BIBA(No Read Down, No Write Up)", "Clark-Wilson", "만리장성(Brewer-Nash)"],
    tables: [
      {
        caption: "접근 통제 모델 비교",
        headers: ["모델", "목적", "보안 규칙", "특징"],
        rows: [
          ["Bell-LaPadula(BLP)", "기밀성", "No Read Up\nNo Write Down", "기밀성 강함\n무결성 문제"],
          ["BIBA", "무결성\n변조 방지", "No Read Down\nNo Write Up", "BLP 단점 보완\n무결성 보장"],
          ["Clark-Wilson", "상업적 무결성", "Well-Formed Tx\n임무 분리 원칙", "프로그램만 접근\n감사에 용이"],
          ["만리장성(Brewer-Nash)", "이해충돌 방지", "직무 분리\n이익 충돌 방지", "이전 동작별 변화\n정보 흐름 차단"],
        ],
      },
    ],
    notes: [
      "BLP(기밀성): No Read Up·No Write Down / BIBA(무결성): No Read Down·No Write Up — 방향이 정반대",
      "BLP는 '위를 못 읽고 아래에 못 쓴다(기밀 누설 방지)', BIBA는 '아래를 못 읽고 위에 못 쓴다(오염 방지)'가 시험 핵심",
    ],
  },
  {
    title: "정보보호제품 평가·인증(CC 평가·인증) 제도",
    course: "SC",
    definition:
      "정보보호제품에 구현된 보안기능의 안전성 및 신뢰도를 평가·시험하여 그 결과를 인증하는 제도",
    defShort: "정보보호제품 보안기능 안전성·신뢰도를 평가·시험해 인증하는 제도",
    lead: "보안기능 신뢰도의 시험, CC 평가·인증",
    features: ["CCRA 상호인정", "보호 프로파일 기반", "보증등급 차등"],
    keywords: ["지능정보화기본법 58조", "공동평가기준(CC)", "ISO 15408", "패키지", "보호 프로파일", "보안 목표 명세서", "CCRA", "평가보증등급(EAL1 ~ 7)"],
    tables: [
      {
        caption: "CC의 Part 구성",
        headers: ["항목", "설명"],
        rows: [
          ["PART 1 소개 및 일반모델", "보안성 평가 원칙·일반개념 정의\nIT 보안목적 표현, 요구사항 선택\n상위수준 명세 작성 구조 소개"],
          ["PART 2 보안 기능 요구사항", "제품 구현 시 필요한 요구사항 평가\n갖춰야 할 기능적 요구사항 명세"],
          ["PART 3 보안 보증 요구사항", "등급에 부합함을 증명\n보증 위한 요구사항 명세\nPP·ST 평가기준 정의"],
        ],
      },
      {
        caption: "PP·ST·TOE 관계와 보증등급",
        headers: ["구분", "설명"],
        rows: [
          ["PP(보호 프로파일)", "공통적인 보안 요구사항 모음"],
          ["ST(보안목표 명세서)", "보안 기능·보증 수단 정의\n벤더는 PP 참조 후 ST 작성"],
          ["EAL 등급", "EAL0~7 부적절~정형화\n평가노력 증가 범위·상세 엄격"],
        ],
      },
      {
        caption: "국내와 국제 평가·인증의 비교",
        headers: ["비교 항목", "국내용 평가·인증", "국제용 평가·인증"],
        rows: [
          ["상호인정", "CCRA 미인정", "회원국 상호인정"],
          ["보증등급", "EAL2~4", "EAL1~7"],
          ["보증범위", "제품전체", "TOE 범위\n신청인 정의"],
          ["인증대상", "국가용 보안요구\n정의 제품 유형", "IT 보안 제품\nPP 프로파일"],
          ["평가특징", "기능/취약성중심\n핵심평가", "CCRA 요구 준수"],
          ["유효기간", "5년", "5년"],
        ],
      },
      {
        caption: "정보보호제품 평가·인증 제도 법적 근거",
        headers: ["근거", "내용"],
        rows: [
          ["지능정보화 기본법 제58조", "정보보호시스템 기준 고시 등"],
          ["정보보호시스템 공통평가기준", "미래창조과학부고시 2013-51호"],
          ["정보보호시스템 평가인증지침", "과기정통부고시 제2017-7호"],
        ],
      },
      {
        caption: "Common Criteria의 보안 요구사항, PP, ST 관계도",
        headers: ["구분", "PP(보호프로파일)", "ST(보안목표명세서)"],
        rows: [
          ["개념", "보안기능요구사항", "보안기능요구사항\n보증요구사항"],
          ["독립성", "구현에 독립적", "구현에 종속적"],
          ["적용성", "제품군 여러 제품\n동일 PP 수용", "특정 제품 하나\n하나의 ST 수용"],
          ["PP와 ST의 관계", "ST 수용 불가", "PP 수용 가능"],
          ["완전성", "불완전오퍼레이션", "오퍼레이션 완전"],
        ],
      },
    ],
    notes: [
      "법적 근거: 지능정보화 기본법 제58조 — Common Criteria(ISO 15408)가 국제 표준",
      "PP(공통 요구사항)→ST(제품별 구현 명세)→TOE(평가 대상), EAL1(기능시험)~EAL7(정형 검증), CCRA로 국제 상호인정",
    ],
  },
  {
    title: "개인정보 영향평가(Privacy Impact Assessment)",
    course: "SC",
    definition:
      "개인 정보 활용 시스템의 신규 구축, 기존 개인 정보 시스템의 중대 변경 발생 시 개인 정보 영향에 대한 조사, 예측 개선 방안을 도출하는 절차",
    defShort: "개인 정보 활용 시스템 신규 구축·중대 변경 시 개인 정보 영향 조사 절차",
    lead: "개인정보 영향의 사전 평가, PIA",
    features: ["사전 예방 평가", "정보주체 수 기준", "침해요인 분석"],
    keywords: ["5만·50만·100만", "개인정보 보호법 제33조", "개인정보 보호법 시행령 제35조", "사전준비단계", "영향평가 수행단계", "이행 단계"],
    tables: [
      {
        caption: "개인정보 영향평가 대상",
        headers: ["분류", "평가 대상", "설명"],
        rows: [
          ["구축·운용 시", "5만명 이상의\n민감 정보", "고유식별정보\n처리 사업"],
          ["구축·운용 시", "50만명 이상\n정보 연계", "공공기관 내외부\n연계 시"],
          ["구축·운용 시", "100만명 이상\n정보 변경", "정보주체\n개인정보파일"],
          ["변경 시", "PIA 평가 후\n운용체계 변경", "변경 부분 한정\n재평가 수행"],
        ],
      },
      {
        caption: "PIA 수행 절차",
        headers: ["영향평가", "수행절차", "설명"],
        nameCol: 1,
        rows: [
          ["사전준비단계", "사업계획작성(예산확보)\n사업자 선정", "필요성 검토 및 사업계획서 작성\n제안요청서 발주, 평가기관 선정"],
          ["영향평가 수행단계", "평가계획 수립\n평가자료 수집\n개인정보 흐름 분석", "계획 수립 및 평가 팀 구성\n내·외부·대상 시스템 자료 분석\n흐름표·흐름도·구조도 작성"],
          ["영향평가 수행단계", "개인정보 침해 요인 분석\n개선 계획 수립\n영향 평가서 작성", "침해요인 도출 및 위험도 산정\n개선사항 도출 및 개선 계획 수립\n평가서 작성 및 제출"],
          ["이행 단계", "개선계획 반영 점검\n개선사항 이행 확인", "개발·테스트 단계 반영 점검\n1년 이내 이행확인서 제출"],
        ],
      },
    ],
    notes: [
      "대상 기준: 5만(민감·고유식별)·50만(연계)·100만(정보주체) — 개인정보 보호법 제33조·시행령 제35조",
      "3단계: 사전준비(사업계획·사업자 선정) → 영향평가 수행(흐름 분석·침해요인·위험도) → 이행(개선 반영·이행 확인)",
    ],
  },
  {
    title: "정보보호 및 개인정보보호 관리체계 인증(ISMS-P)",
    course: "SC",
    definition:
      "정보보호 및 개인정보보호를 위한 조치와 활동이 인증기준에 적합함을 인터넷진흥원 또는 인증기관이 증명하는 제도",
    defShort: "정보보호·개인정보보호 조치가 인증기준에 적합함을 증명하는 제도",
    lead: "정보·개인정보 관리 인증, ISMS-P",
    features: ["ISMS+PIMS 통합", "인증기준 적합 증명", "PDCA 순환"],
    keywords: ["관리체계 수립 및 운영", "보호대책 요구 사항", "개인정보 처리단계별 요구사항"],
    tables: [
      {
        caption: "ISMS-P 법적 근거",
        headers: ["구분", "법 내용"],
        rows: [
          ["정보보호 관리체계 인증 등에 관한 고시(ISMS)", "정보통신망법 제47조\n시행령 제47조~제54조\n시행규칙 제3조"],
          ["개인정보보호 관리체계 인증 등에 관한 고시(PIMS)", "개인정보보호법 제32조의2\n제34조의2~제34조의8"],
          ["고시", "정보보호 및 개인정보보호\n관리체계 인증 등에 관한 고시"],
        ],
      },
      {
        caption: "ISMS-P 인증 기준 세부 항목",
        headers: ["영역", "분야", "설명"],
        rows: [
          ["관리체계 수립 및 운영(16개)", "관리체계 기반\n위험 관리\n관리체계 운영\n점검 및 개선", "PDCA 모델 4개 분야 16개 인증 기준\n정책·목적 수립, 개선 절차 수립"],
          ["보호대책 요구사항(64개)", "정책·조직·자산\n인적·외부자·물리\n인증·권한·접근통제\n사고예방·재해복구", "12개 분야 64개 인증 기준\n관리체계 운영 중 보호 대책 수립\n위험 평가 반영 수립·이행 점검"],
          ["개인정보 처리단계별 요구사항(21개)", "개인정보 수집\n보유 및 이용\n제공/파기\n권리보호", "5개 분야 22개 기준, 법규 준수\nLife Cycle 단계별 요구사항 심사"],
        ],
      },
    ],
    notes: [
      "법적 근거: ISMS(정보통신망법 제47조)·PIMS(개인정보보호법 제32조의2) → ISMS-P로 통합",
      "3분야: 관리체계 수립·운영(16, PDCA) + 보호대책 요구사항(64) + 개인정보 처리단계별(21) — ISMS만 받으면 앞 2분야, +P는 3분야 전체",
    ],
  },
  {
    title: "정보보호 공시제도",
    course: "SC",
    definition:
      "정보보호 투자/인력/인증/활동 등 기업의 정보보호 현황을 일반에 공개하는 자율·의무공시제도",
    defShort: "투자·인력·인증·활동 등 기업 정보보호 현황을 일반에 공개하는 제도",
    lead: "정보보호 현황 공개, 정보보호 공시제도",
    features: ["자율·의무 병행", "현황 일반 공개", "법률 근거 제도"],
    keywords: ["정보보호산업의 진흥에 관한 법률 제13조", "기간통신사업자", "정보통신시설사업자", "종합병원", "클라우드 제공자", "3,000억원", "100만명", "투자 현황", "인력 현황", "인증/평가 현황", "정보보호 활동 현황"],
    tables: [
      {
        caption: "정보보호 공시제도 의무 적용 대상",
        headers: ["적용 분류", "적용 기준"],
        rows: [
          ["사업 분야", "회선설비 보유 기간통신사업자\n집적정보통신시설 사업자\n상급종합병원\n클라우드컴퓨팅 서비스제공자"],
          ["매출액", "CISO 지정·신고 의무 상장법인\n매출액 3,000억원 이상"],
          ["이용자 수", "100만명 이상 일일평균 이용자"],
        ],
      },
      {
        caption: "정보보호 공시제도 공시 항목",
        headers: ["공시 항목", "공시 세부 항목"],
        rows: [
          ["1. 정보보호 투자 현황", "정보기술부문 투자액\n정보보호부문 투자액\n투자액 비율\n특이사항"],
          ["2. 정보보호 인력 현황", "총 임직원\n정보기술부문 인력\n정보보호부문 전담인력"],
          ["2. 정보보호 인력 현황", "인력 비율\nCISO/CPO 지정 현황\n특이사항"],
          ["3. 정보보호 관련 인증·평가·점검 등에 관한 사항", ""],
          ["4. 정보통신서비스를 이용하는 자의 정보보호를 위한 활동 현황", ""],
        ],
      },
    ],
    notes: [
      "법적 근거: 정보보호산업의 진흥에 관한 법률 제13조·시행령 제8조",
      "의무 대상 3기준: 사업 분야(기간통신·클라우드·상급종합병원)·매출액 3,000억 이상·이용자 100만명 이상",
    ],
  },
  {
    title: "안티 포렌식(Anti-forensic)",
    course: "SC",
    definition:
      "자신에게 불리하게 작용할 가능성이 있는 디지털 증거를 훼손하거나 숨겨서 포렌식을 방해하는 일련의 행위",
    defShort: "불리한 디지털 증거를 훼손하거나 숨겨서 포렌식을 방해하는 일련의 행위",
    lead: "디지털 증거 훼손과 은닉, 안티 포렌식",
    features: ["포렌식 방해 목적", "증거 훼손 은닉", "창과 방패 관계"],
    keywords: ["Anti-Forensic", "디가우징(Degaussing)", "와이핑(Wiping)", "스테가노그래피(Steganography)", "슬랙공간 은닉", "데이터 암호화", "데이터 변조"],
    tables: [
      {
        caption: "안티포렌식 기술 - 데이터 삭제 기술",
        headers: ["기술", "설명", "도구 및 기법"],
        rows: [
          ["디가우징(Degaussing)", "강한 자기장 노출\n영구 삭제", "Degausser"],
          ["와이핑(Wiping)", "난수 또는 0으로\n덮어쓰기", "Low Level Format"],
          ["증거데이터 자동삭제", "OS 생성 개인정보\n증거 데이터 삭제", "웹페이지·레지스트리\n쿠키 등 삭제"],
        ],
      },
      {
        caption: "안티포렌식 기술 - 데이터 은닉 및 변조 기술",
        headers: ["기술", "설명", "도구 및 기법"],
        rows: [
          ["Steganography", "존재 사실 자체를\n숨기는 은닉", "OpenStego\nSteghide"],
          ["디스크내 데이터 은닉", "슬랙공간 등\n낭비 영역에 은닉", "Slacker·FragFS\nRuneFS·KY FS"],
          ["데이터 암호화", "파일·디렉토리\n암호화 접근 차단", "EFS·BitLocker\nTrueCrypt"],
          ["데이터 변조", "원본 내용과 형식\n다르게 인식", "파일 헤더 조작\n날짜 수정"],
        ],
      },
      {
        caption: "안티포렌식 대응기술",
        headers: ["분류", "대응 기술", "상세 설명"],
        rows: [
          ["스테가노그래피 탐지", "Staganalysis", "이미지 변화 감지\n픽셀 색상 비교"],
          ["데이터 검색 및 탐지", "인덱스 기반 탐색\nBitWise\nHash 검증", "키워드 탐색\n슬랙공간 텍스트\nMD5·SHA-1 비교"],
          ["데이터 복구", "슬랙·미할당영역\n메모리·스왑", "파일헤더 재구성\n캐쉬·프로세스"],
        ],
      },
    ],
    notes: [
      "디지털 포렌식과 반대: 안티 포렌식은 '증거를 없애거나 숨긴다'(디가우징·와이핑·스테가노그래피·암호화·변조)",
      "대응은 삭제된 데이터 복구·은닉 데이터 탐지(Staganalysis)·해시 검증으로 포렌식의 창과 방패 관계",
    ],
  },
  {
    title: "블록체인 암호기술 가이드라인",
    course: "SC",
    definition:
      "블록체인의 보안성과 무결성을 보장하기 위해 사용되는 다양한 암호화 기법",
    defShort: "블록체인 보안성과 무결성을 보장하기 위해 사용되는 다양한 암호화 기법",
    lead: "블록체인 암호 적용 기준, 블록체인 암호기술 가이드라인",
    features: ["검증 암호모듈 사용", "구성 영역별 기준", "프라이버시 보장"],
    keywords: ["암호 사용 기준", "계정 관리", "데이터 전송 보안", "합의 프로토콜", "원장", "스마트 컨트랙트(Smart Contract)", "데이터베이스"],
    tables: [
      {
        caption: "블록체인에 사용되는 주요 암호 기술",
        headers: ["암호기술", "특성", "사례"],
        rows: [
          ["다중 서명", "여러 서명 집계\n검증 효율 높음", "Openchain\nMultichain"],
          ["임계 서명", "다중 서명 유사\n최소 인원 필요", "Libra"],
          ["은닉 서명", "문서를 가린 후\n서명(전자화폐)", "Hyperledger Fabric"],
          ["환 서명", "그룹 중 하나의\n서명만 드러남", "CryptoNote"],
          ["영지식 증명", "참·거짓만 증명\n익명성 보장", "Zcash·Monero"],
          ["안전한 다자간 계산", "정보 공개 없이\n공동 계산", "Enigma·Hawk\nWanchain"],
          ["비밀 분산 기법", "비밀값 분산 저장\n일정 수 이상 복구", "SHARVOT\nWanchain"],
          ["위탁 방식", "값 숨긴 채 위탁\n필요 시 값 공개", "Zcash\nMonero"],
          ["불확정 전송", "수신자 일부 수신\n송신자는 모름", "Searchain"],
          ["검증 가능한 랜덤 함수", "비밀키·공개입력\n검증 가능 난수", "Algorand\nOuroboros praos"],
          ["Accumulator", "짧은 위탁으로\n소속 증명", "Zerocoin"],
        ],
      },
      {
        caption: "블록체인 암호기술 가이드라인(7가지)",
        headers: ["No", "구분", "가이드라인"],
        rows: [
          ["①", "암호 사용 기준", "암호모듈 검증\n검증된 것만 사용"],
          ["②", "계정 관리", "계정 관리 제공\n상호 인증 수행\n키 쌍 생성·등록\n교체·폐기 가능"],
          ["③", "데이터 전송 보안", "개체 상호 인증\n전송 데이터 보호"],
          ["④", "합의 프로토콜", "안전성·효율성\n참여 노드 수 결정"],
          ["⑤", "원장", "식별자·전자서명\n재전송 공격 방지\n직전 블록 해시값\n생성 시각 포함"],
          ["⑥", "스마트 컨트랙트", "실행 결과 검증\n취약점 미존재"],
          ["⑦", "데이터베이스", "기록 데이터 신뢰"],
        ],
      },
    ],
    notes: [
      "핵심 암호기술: 은닉 서명(전자화폐)·환 서명(익명 그룹)·영지식 증명(Zcash)·비밀 분산·다자간 계산 등이 프라이버시 보장",
      "7대 가이드라인: 암호 사용 기준·계정 관리·데이터 전송 보안·합의 프로토콜·원장·스마트 컨트랙트·데이터베이스",
    ],
  },
  {
    title: "자율주행 자동차 보안취약점 및 대응방안",
    course: "SC",
    definition:
      "자율주행 자동차의 차량·통신채널·백엔드 인프라 구간에서 발생하는 보안 위협을 식별하고 구간별 보안 기술로 대응하는 방안",
    defShort: "자율주행차 차량·통신·백엔드 구간별 위협을 식별·대응하는 방안",
    lead: "차량·통신·백엔드의 위협, 자율주행 보안취약점",
    features: ["구간별 위협 상이", "펌웨어 무결성", "CAN 메시지 인증"],
    keywords: ["도청", "위변조", "DoS", "원격해킹", "권한상승", "펌웨어 변조", "정보유출", "접근통제", "방화벽", "EDR", "Secure Boot", "Secure OS", "Software Update", "계획", "현황분석", "취약점점검", "위험도검토", "대책수립"],
    tables: [
      {
        caption: "구간별 보안 위협",
        headers: ["영역", "구간", "보안위협"],
        rows: [
          ["차량", "N/A", "펌웨어 변조\n원격제어 해킹\nCAN 위변조"],
          ["차량", "N/A", "차량 불법 조작\n서비스 거부(DoS)"],
          ["통신채널", "차량-차량\n차량-백엔드인프라\n차량-노변인프라\n백엔드-노변·백엔드인프라", "통신도청\n메시지 위변조\n정보 무단 획득\n거짓정보·부인"],
          ["백엔드 인프라", "N/A", "정보 유출\n권한 상승\n서비스 거부(DoS)"],
        ],
      },
      {
        caption: "보안 위협 별 대응 보안 기술",
        headers: ["영역", "보안위협", "보안기술"],
        rows: [
          ["차량", "펌웨어 변조", "HPSE(HSM), Secure Boot\nSecure Debug, Secure Flash\nSecure Diagnosis\nSoftware Update"],
          ["차량", "원격제어 해킹", "Secure Access\nSecure Diagnosis\nIDS, SecOC"],
          ["차량", "CAN 위변조", "IDS, SecOC\nSecure Software Update"],
          ["차량", "차량 불법조작", "Secure Access\nSecure Diagnosis"],
          ["차량", "서비스 거부(DoS)", "IDS"],
          ["통신채널", "통신도청\n메시지 위변조\n정보 무단 획득\n거짓정보·부인", "IPSec, TLS/DTLS\nWAVE 통신 보안"],
          ["백엔드 인프라", "정보 유출", "Firewall(WAF, UTM, NGFW)\nDatabase Encryption\nAccess Control\nEDR"],
          ["백엔드 인프라", "권한 상승", "Access Control"],
          ["백엔드 인프라", "서비스 거부(DoS)", "Firewall(WAF, UTM, NGFW)"],
        ],
      },
      {
        caption: "점검 절차",
        headers: ["점검 절차", "업무"],
        rows: [
          ["계획", "Client 미팅, 점검 팀 내부 미팅\n점검 도구/방식 협의"],
          ["현황분석", "진단 대상 식별\n사용자 접근 권한 및 범위 식별"],
          ["취약점점검", "대상 별 점검 항목·자산 식별·분석\n위험 분석 및 취약점 점검 수행"],
          ["위험도검토", "위험도 산정\n진단 결과 검토 및 결과 협의"],
          ["대책수립", "대책 수립\n조치 일정 확인"],
        ],
      },
    ],
    notes: [
      "ISO 21434(차량 사이버보안 표준)와 연계 — 차량·통신·백엔드 3구간별로 위협과 대응 기술이 다름",
      "차량 구간 핵심 대응: Secure Boot·HSM(펌웨어 무결성), IDS·SecOC(CAN 위변조), Secure Diagnosis(원격 해킹)",
    ],
  },
  {
    title: "사이버 보안 성숙도 모델 인증(CMMC, Cybersecurity Maturity Model Certification)",
    course: "SC",
    definition:
      "국방 계약자가 민감한 국방 정보를 보호하기 위한 현재 보안 요구사항을 준수하는지 확인하기 위해 고안된 평가 표준으로, 미국 국방 계약자를 위한 사이버보안 프레임워크",
    defShort: "국방 정보 보호 위한 현재 보안 요구사항 준수 평가 사이버보안 프레임워크",
    lead: "국방 공급망 보안 인증, CMMC",
    features: ["국방 계약자 대상", "NIST 800-171 기반", "등급별 평가 주체"],
    keywords: ["FOUNDATIONAL", "ADVANCED", "EXPERT", "NIST SP 800-171", "NIST SP 800-172"],
    tables: [
      {
        caption: "CMMC 2.0 단계",
        headers: ["수준", "평가기준", "평가주체"],
        rows: [
          ["Level 1 (Foundational)", "FCI 보호 중점\nFAR 52.204\nNIST 800-171", "자체평가"],
          ["Level 2 (Advanced)", "CUI 협력 회사\nNIST 800-171", "자체 및\n제3자 평가"],
          ["Level 3 (Expert)", "APT 위협 감소\n800-171·800-172", "제3자 평가\n(정부 주도)"],
        ],
      },
    ],
    notes: [
      "CMMC 1.0(5등급)→2.0(3등급) 간소화(2021년 11월) — Level 1(자체)·2(제3자)·3(정부 주도) 평가 주체 상이",
      "핵심: 미국 국방 공급망(방산업체)이 FCI·CUI를 다룰 자격을 NIST SP 800-171/172 기준으로 인증받는 제도",
    ],
  },
  {
    title: "사이버 게놈(Cyber genome)",
    course: "SC",
    definition:
      "악성코드 샘플로부터 유사점 파악, 변하지 않는 고유 특성 추출, DB화하여 해커 과거 행동 분석, 향후 공격 추론을 통해 사전 차단하는 기법",
    defShort: "악성코드 샘플 고유 특성 DB화 행동 분석·향후 공격 추론 사전 차단 기법",
    lead: "악성코드 유전자 분석, 사이버 게놈",
    features: ["불변 고유 특성 추출", "변종 공격 사전 차단", "다관점 센트릭 분석"],
    keywords: ["아티팩트-센트릭 분석", "케이스-센트릭 분석", "휴먼-센트릭 분석", "API Sequence 추출", "API 기반 악성 코드 특성 인자 추출", "서열 정렬", "유사도 분석"],
    tables: [
      {
        caption: "사이버 게놈 프로젝트의 분석 기법",
        headers: ["분석 기법", "분석 대상", "주요 기술", "설명"],
        rows: [
          ["아티팩트 센트릭", "악성코드 샘플\nIP·URL·도메인\n컴파일러 정보", "정적·동적 분석\n샌드박스 분석\n시그니처·IoC", "디지털 증거의\n특성과 연관성\n분석"],
          ["케이스 센트릭", "공격 이벤트\n공격자 TTPs\n동기 및 목적", "5W1H 분석\n범죄 프로파일링\nATT&CK 매핑", "개별 사건 재구성\n캠페인 전체\n프로파일링"],
          ["휴먼 센트릭", "해커 신상 정보\n온라인 활동\n언어·성향", "OSINT 수집\n온톨로지 분석\nSNA·NLP", "배후 사람의 특성\n상호 연관 관계\n추적·분석"],
        ],
      },
    ],
    notes: [
      "3대 센트릭: 아티팩트(증거 자체)·케이스(공격 사건)·휴먼(해커 사람) 관점 분석",
      "핵심: 생물의 게놈처럼 악성코드의 '변하지 않는 고유 특성(유전자)'을 추출·DB화해 변종·재사용 공격을 사전 차단",
    ],
  },
  {
    title: "디지털 포렌식(Digital Forensic)",
    course: "SC",
    definition:
      "컴퓨터를 이용하거나 활용해 이뤄지는 범죄 행위에 대한 법적 증거 자료 확보를 위해 컴퓨터 시스템, 네트워크 등 디지털 자료가 법적 증거물로 법원에 제출될 수 있도록 확보하는 일련의 절차와 방법",
    defShort: "범죄 행위 디지털 자료가 법적 증거물로 법원에 제출되게 하는 절차와 방법",
    lead: "디지털 증거의 법적 확보, 디지털 포렌식",
    features: ["법적 증거 확보", "연계 보관성", "무결성 유지"],
    keywords: ["정당성의 원칙", "재현의 원칙", "신속성의 원칙", "연계보관의 원칙", "무결성의 원칙", "수사준비", "증거물 획득", "보관 및 이송", "분석 및 조사", "보고서 작성"],
    tables: [
      {
        caption: "포렌식의 5대 원칙 [정재신연무]",
        headers: ["원칙", "설명"],
        rows: [
          ["정당성의 원칙", "모든 증거 적법한 절차로 획득\n위법 절차 증거는 증거 능력 상실"],
          ["재현의 원칙", "동일 조건·환경 항상 동일 결과"],
          ["신속성의 원칙", "휘발성 데이터 훼손 전 신속 진행"],
          ["연계 보관성의 원칙", "일련 과정 명확·추적 가능"],
          ["무결성의 원칙", "수집 증거 위조·변조 금지"],
        ],
      },
      {
        caption: "포렌식 절차 [수증보분보]",
        headers: ["구분", "절차"],
        rows: [
          ["수사준비", "사전조사·권한획득\n도구테스트\n장비확보\n협조체계확립"],
          ["증거물 획득", "현장분석\n휘발데이터확보\nSnap Shot·Disk imaging\n증거물인증"],
          ["보관 및 이송", "Image 복사\n증거물 포장 및 운반"],
          ["분석 및 조사", "자료복구/검색\nTimeLine분석·Signature분석\n은닉자료검색\nHASH/log분석"],
          ["보고서 작성", "증거분석결과\n증거 담당자 목록\n전문가 소견"],
        ],
      },
      {
        caption: "포렌식 주요 기술",
        headers: ["구분", "증거 복구", "수집 및 보관", "증거 분석"],
        rows: [
          ["저장 매체", "하드디스크 복구\n메모리 복구", "하드디스크 복제\n메모리 기반 복제\n저장매체복제장비", "사용 흔적 분석\n메모리 정보 분석"],
          ["시스템", "삭제 파일 복구\n파일시스템 복구\n로그온 우회 기법", "휘발성데이터수집\n시스템 초기 대응\n포렌식 라이브 CD/USB", "레지스트리 분석\n시스템 로그 분석\n프리 패치 분석"],
          ["데이터 처리", "언어통계기반복구\n암호해독/DB구축\n스테가노그래피\n파일 조각 분석", "저장 데이터 추출\n디지털 증거 보존\n증거 공증/인증", "포맷별 분석\n영상 정보 분석\nDB 정보 분석\n데이터 마이닝"],
          ["응용/네트워크", "파일 포맷 복구\n암호통신 해독", "N/W 정보 수집\n네트워크 역추적", "N/W 로그 분석\n해시 DB"],
          ["기타 기술", "개인정보보호기술\n범죄유형프로파일링연구\n통합타임라인분석", "", ""],
        ],
      },
    ],
    notes: [
      "5대 원칙 두음 [정재신연무]: 정당성·재현·신속성·연계보관성·무결성 / 절차 [수증보분보]: 수사준비·증거획득·보관이송·분석조사·보고서",
      "안티 포렌식(증거 훼손)의 반대 — e-Discovery(민사·사전)와 달리 형사·사후 수사, 연계보관성(CoC)이 핵심 원칙",
    ],
  },
  {
    title: "클라우드 포렌식(Cloud Forensic)",
    course: "SC",
    definition:
      "클라우드에 존재하는 전자적 증거물 등을 사법기관에 제출하기 위해 클라우드 시그니처(Signature) 데이터 수집, 분석 및 보고서를 작성하는 과학 수사 기법",
    defShort: "클라우드 전자적 증거물 등을 사법기관에 제출하기 위한 과학 수사 기법",
    lead: "클라우드 증거 수사, 클라우드 포렌식",
    features: ["사법관할권 이슈", "국제 공조 의존", "시그니처 기반 분석"],
    keywords: ["가상화", "정보 제공 의무", "클라우드 시그니처(Signature)", "사법관할권", "국제 공조"],
    tables: [
      {
        caption: "클라우드 포렌식 조사 활동",
        headers: ["구분", "조사 활동", "상세 내용"],
        rows: [
          ["대상 확인", "대상 클라우드\n서비스 확인", "SaaS: 드라이브\nPaaS: Heroku\nIaaS: AWS·Azure\nGCP·NCP"],
          ["증거 확보", "로그인 정보 확인", "브라우저 포렌식\n레지스트리 분석\n서비스 로그 분석"],
          ["협조 요구", "사법관할권 확인\n국제 공조 요청\n임의 제출 요청", "CSP 물리 위치\n공조법 압수수색\nID·PW(동의 필요)"],
          ["증거 수집", "압수권한 획득\n계정 접근 차단\n데이터 수집", "관련 법규 준수\n로그인 Lock·IP\n카빙·스테가노"],
          ["증거 분석", "시그니처 분석", "Client의 클라우드\n사용 기록"],
        ],
      },
    ],
    notes: [
      "디지털 포렌식과 차이: 클라우드는 데이터가 여러 국가 서버에 분산·가상화되어 '사법관할권'과 '국제 공조'가 핵심 이슈",
      "국제 공조 거절 시 클라우드 상세분석 불가 — Client 단말의 클라우드 시그니처 분석으로 사용 기록 확보",
    ],
  },
  {
    title: "스마트시티 보안취약점 및 대응방안",
    course: "SC",
    definition:
      "스마트시티를 구성하는 서비스·플랫폼·인프라 계층의 보안 위협을 식별하고 계층별 보안 대책을 적용하는 방안",
    defShort: "스마트시티 서비스·플랫폼·인프라 계층별 위협에 대응하는 보안 방안",
    lead: "서비스·플랫폼·인프라 위협, 스마트시티 보안취약점",
    features: ["계층별 위협 식별", "도시 전체 파급", "제로트러스트 결합"],
    keywords: ["도시 문제 해결", "센서 신호 방해", "혼선", "수집 데이터 위·변조 및 삭제", "경량 암호화", "DTLS/TLS"],
    tables: [
      {
        caption: "스마트 시티 보안 이슈",
        headers: ["계층", "보안 이슈", "설명"],
        nameCol: 1,
        rows: [
          ["감지 계층", "센서 신호 방해, 혼선", "수집 방해 위한 주파수 혼선 위협"],
          ["감지 계층", "수집 데이터 위·변조 및 삭제", "불안전한 수집 데이터 변조\n변조·재암호화로 식별 불가"],
          ["감지 계층", "디바이스 물리적 침해", "CCTV·센서 물리적 파괴, 전원 차단\n동작 불능 위협"],
          ["데이터 전송 계층", "네트워크 침해", "정상 네트워크 활동 방해\n능력 약화 또는 제거"],
          ["데이터 전송 계층", "전송 정보 위·변조", "MITM 공격으로 전송 정보 탈취\n인증·헤더 정보 변경, 우회 인증"],
          ["데이터 전송 계층", "서비스 거부 공격", "네트워크 대역폭 소모\n서버·디바이스 자원 사용 불가"],
          ["데이터 처리 계층", "불법 접근", "서버·플랫폼 비인가자 불법 접근\n정보 탈취"],
          ["데이터 처리 계층", "프라이버시 침해", "보호되지 않은 빅데이터\n처리 중 데이터\n사생활 정보 노출"],
          ["데이터 처리 계층", "불안전한 암호화", "필수 암호화 미수행\n저 수준 암호화 강도 수행"],
          ["애플리케이션 계층", "개인정보 노출", "차량·모바일 등 불안전 저장\n개인정보 탈취"],
          ["애플리케이션 계층", "인증 정보 탈취", "보호되지 않은 서비스 디바이스\n접근 위한 계정·비밀번호 탈취"],
          ["애플리케이션 계층", "서비스 데이터 위·변조", "수신 데이터 방해·삭제·위변조\n정상 서비스·기능 수행 방해"],
        ],
      },
      {
        caption: "스마트 시티 보안 위협 대응 기술",
        headers: ["계층", "대응 기술", "설명"],
        nameCol: 1,
        rows: [
          ["감지 계층", "경량 암호화", "HIGHT, LEA 등 경량 암호화 적용\n소유 데이터 보호"],
          ["감지 계층", "물리적 접근 제어", "접근 불가 지역 설치\n접근 불가 위한 함체 내 설치"],
          ["감지 계층", "펌웨어 난독화/암호화", "디바이스 펌웨어 난독화\n보안 취약점 보호\n불법 펌웨어 업데이트 방지"],
          ["데이터 전송 계층", "NAC(Network Access Control)", "보안 정책 준수 여부 검사\n네트워크 접속 통제"],
          ["데이터 전송 계층", "DTLS/TLS", "전송 패킷(Packet) 암호화\n비신뢰 통신 구간 안전 송·수신"],
          ["데이터 전송 계층", "IPS/Anti-DDoS", "침입 예방, 침입 탐지\n즉각 차단, DoS 공격 방어"],
          ["데이터 처리 계층", "인증 / 권한 관리", "PKI, 익명 인증, 디바이스 인증\n적절한 권한 여부 확인"],
          ["데이터 처리 계층", "웹 방화벽", "SQL Injection, XSS 등 웹 공격 차단\n정보 유출·부정 로그인 방지\n웹 사이트 위·변조 방지"],
          ["데이터 처리 계층", "개인 정보 비 식별화", "정보 일부·전부 삭제·대체\n특정 개인 식별 불가 조치"],
          ["애플리케이션 계층", "전송/저장 정보 암호화", "응용 프로그램/DBMS 자체 암호화\n운영 체제 암호화 적용"],
          ["애플리케이션 계층", "무결성 검증 및 악성 코드 탐지", "수신 서비스 데이터 무결성 검증\n정적/동적 분석 바이러스 탐지"],
          ["애플리케이션 계층", "컨텐츠 서비스 보안", "데이터 훼손·탈취 방지 보호 조치\nDRM 적용"],
        ],
      },
    ],
    notes: [
      "핵심: 도시 전체가 연결된 융합 인프라라 한 계층(IoT·CCTV) 침해가 도시 전체로 파급 — 계층별 다중 방어 필요",
      "제로트러스트·통합 보안관제(SIEM)·IoT 보안 인증을 결합한 대응 — 스마트팩토리·디지털트윈과 유사 구조",
    ],
  },
  {
    title: "스마트팩토리 보안취약점 및 대응방안",
    course: "SC",
    definition:
      "스마트팩토리의 IT·OT 융합 환경에서 발생하는 보안 위협을 식별하고 계층별·영역별 보안 대책을 적용하는 방안",
    defShort: "스마트팩토리 IT·OT 융합 위협을 계층별로 식별·대응하는 방안",
    lead: "IT·OT 융합 환경 위협, 스마트팩토리 보안취약점",
    features: ["IT·OT 융합", "가용성·안전 우선", "계층별 대책"],
    keywords: ["센서", "생산장비", "PLC", "HMI", "MES", "ERP/서버", "업무PC", "Wi-Fi"],
    tables: [
      {
        caption: "대응 절차",
        headers: ["단계", "설명"],
        rows: [
          ["Step 1 보안 대상 선별", "운용 설비 선별"],
          ["Step 2 보안 위협 도출", "선별 자산 별 위협 도출"],
          ["Step 3 보안요구사항 매핑", "위협과 보안요구사항 매핑"],
          ["Step 4 보안아키텍처 적용", "보안 기술·솔루션 아키텍처 적용"],
        ],
      },
      {
        caption: "보안 취약점 및 대응 방안",
        headers: ["구성요소", "보안취약점", "대응방안"],
        rows: [
          ["센서", "물리접근·포트·지원설비", "출입 통제\n장비 접근 제한"],
          ["센서", "공정제어네트워크", "벤더 권고 준수\n최신 보안 패치"],
          ["생산장비", "물리접근·포트·지원설비", "장치 접근 통제\n악성코드탐지·차단\n포트락\n인터페이스 통제"],
          ["생산장비", "공정제어네트워크", "네트워크 암호화"],
          ["생산장비", "인력·노후설비", "중요 명령 보호\n상태 모니터링\n알람"],
          ["PLC", "물리접근·포트·지원설비", "접근·출입 통제\n배터리·전원이중화\n메모리 쓰기 제한\n인터페이스 보호"],
          ["PLC", "공정제어네트워크", "비인가 단말 통제\n유해 트래픽 탐지\n취약점 패치"],
          ["PLC", "공급망 위협", "사전 등록 접근만\n원격 접속 통제"],
        ],
      },
      {
        caption: "스마트 시티 보안 위협 대응 기술",
        headers: ["구성요소", "보안취약점", "대응방안"],
        rows: [
          ["HMI", "물리접근·포트·지원설비", "사용자 식별 인증\n사용자 권한 관리\n출입 통제"],
          ["HMI", "공장업무영역", "망분리\n접근 단말 제한\n중요 정보 백업"],
          ["HMI", "공급망 위협", "이동식 매체 제한\n악성코드 탐지"],
          ["HMI", "외부 인터넷", "인터넷 접점 제거\n비인가 SW 제한"],
          ["MES", "산업제어시스템", "망분리\n일방향 통신망"],
          ["MES", "공급망 위협", "인터넷 접점 제거\n비인가 SW 제한\n최신 보안 패치"],
          ["MES", "공급망 위협", "중요 정보 백업\n원격 접속 통제\n단말 접근 제한"],
          ["ERP/서버", "외부 인터넷", "최신 보안 패치\n접근 단말 제한\n서버 보안 설정"],
          ["ERP/서버", "외부 인터넷", "시큐어코딩\n웹 보안"],
          ["업무PC", "공장업무영역", "이동식 매체 제한\n악성코드 탐지\n무선 단말 제한"],
          ["업무PC", "공장업무영역", "최신 보안 패치\n중요 정보 암호화"],
          ["업무PC", "외부 인터넷", "메일 보안\n중요 정보 암호화\n악성코드 탐지"],
          ["Wi-Fi", "공정제어네트워크", "무선 접근 보안\n무선 통신 암호화"],
        ],
      },
    ],
    notes: [
      "IT 보안(기밀성 우선)과 달리 OT 보안은 '가용성·안전(Safety)'이 최우선 — 멈추면 생산·인명 피해",
      "IEC 62443(산업제어시스템 보안 표준)이 근거 — IT-OT 망 분리가 핵심 대응",
    ],
  },
  {
    title: "클라우드 컴퓨팅 취약점, 대응기술",
    course: "SC",
    definition:
      "클라우드 컴퓨팅 환경의 기술 측면과 기술 외 측면에서 발생하는 보안 위협 요소를 식별하고 대응하는 기술과 방안",
    defShort: "클라우드 컴퓨팅의 기술·기술외 측면 보안 위협에 대응하는 기술과 방안",
    lead: "클라우드 위협과 대응, 클라우드 컴퓨팅 취약점",
    features: ["기존 위협 상속", "가상화 고유 위협", "사업자 종속 위험"],
    keywords: ["하이퍼바이저 감염", "가상머신 간 상호연결", "vMotion", "VMI", "멀티테넌시", "사업자 종속", "SLA"],
    tables: [
      {
        caption: "기술측면의 보안위협 요소",
        headers: ["구분", "보안위협요소", "설명"],
        rows: [
          ["기존 보안 위협 상속", "서비스 거부 공격", "DoS·DDoS, 가상 머신 급격한 생성"],
          ["기존 보안 위협 상속", "NW트래픽 위변조", "트래픽 도청, 악의적 중간자 존재"],
          ["기존 보안 위협 상속", "인증, 접근권한 탈취", "접근 권한 위변조, 식별자 익명화"],
          ["가상화를 통한 위협", "하이퍼바이저 감염", "하이퍼바이저 취약 시 동시 피해"],
          ["가상화를 통한 위협", "가상머신 간 상호연결", "패킷 스니핑, 악성코드 전파"],
          ["가상화를 통한 위협", "가상머신의 이동성 문제", "감염 VM 타 플랫폼 전파(vMotion)"],
        ],
      },
      {
        caption: "기술측면의 대응방안",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["기존 보안 위협 상속", "TLS, SSH 이용 전송데이터 보호", "HTTP 통신 시 TLS로 보안성 유지"],
          ["기존 보안 위협 상속", "AES-256 이용 데이터 암호화", "저장 데이터 AES-256 이상 암호화"],
          ["기존 보안 위협 상속", "SIEM기반 로그 분석대응", "SIEM 전송, 접근·인증 모니터링"],
          ["가상화를 통한 위협", "VMI(VM Introspection) 기반의 침입탐지", "하이퍼바이저로 VM 내부 상태 분석\n가상머신 악성행위 탐지"],
          ["가상화를 통한 위협", "Agentless 가상보안 탐지", "에이전트 방식 아님\n보안 전용 가상머신 상 동작"],
          ["가상화를 통한 위협", "VM간 독립성 확보", "VM 간 독립성(Isolation) 제공\n다른 VM 데이터·트래픽 도청 방지"],
        ],
      },
      {
        caption: "기술 외 측면의 보안위협 요소",
        headers: ["구분", "보안위협요소", "설명"],
        rows: [
          ["관리측면 문제", "피해 규모의 확산", "파일 공유로 악성감염 시 피해 확산"],
          ["관리측면 문제", "내부자 위협", "내부자 실수로 데이터 손실·유출\n악의적 의도로 데이터 파괴·탈취"],
          ["관리측면 문제", "자연재해 위협", "화재·지진으로 데이터 유실 위험"],
          ["법제도 문제", "국가별 상이한 법체계", "국가별 정책·자원통제 상이"],
          ["법제도 문제", "보안책임의 귀속 문제", "사업자·이용자·제3자 주체 다양\n서로 다른 계약·정책으로 운영"],
        ],
      },
      {
        caption: "기술 외 측면의 보안위협 대응방안",
        headers: ["구분", "대응방안", "설명"],
        rows: [
          ["관리측면 문제", "ISO27001 27002 보안인증", "정보보호·접근통제 등 항목 평가\n매년 감사 및 표준준수 여부 시행"],
          ["관리측면 문제", "클라우드SLA 서비스 정량화", "서비스 수준 정량화·명확 공시\n미달 시 손해 배상 약정"],
          ["관리측면 문제", "보상제도 및 보험 통한 대응", "예상 못한 서비스 중단 피해 보험"],
          ["법제도 문제", "법적인 쟁점 사전점검", "법적 쟁점 사전 점검 후 도입 계획"],
          ["법제도 문제", "국제표준 준수", "국제표준 준수로 이슈 사전 차단"],
        ],
      },
    ],
    notes: [
      "가상화 고유 위협: 하이퍼바이저 감염·VM 간 상호연결·vMotion(이동성) — VMI·Isolation으로 대응",
      "기술 외 위협: 멀티테넌시(피해 확산)·사업자 종속·국가별 법체계 상이 — SLA 정량화·ISO 27001/27017 준수",
    ],
  },
  {
    title: "디지털 트윈(Digital Twin)의 보안 취약점 및 대응방안",
    course: "SC",
    definition:
      "디지털 트윈의 생성·전달·종합과 분석·이해·행동 프로세스 각 단계에서 발생하는 보안 위협을 식별하고 대응하는 방안",
    defShort: "디지털 트윈 생성·전달·분석·이해·행동 단계별 위협의 대응 방안",
    lead: "생성부터 행동까지의 위협, 디지털 트윈 보안취약점",
    features: ["단계별 위협 상이", "현실 위협 전이", "제로 트러스트 적용"],
    keywords: ["생성", "전달", "종합과 분석", "이해", "행동"],
    tables: [
      {
        caption: "디지털 트윈 프로세스 별 보안 위협 요소",
        headers: ["프로세스", "보안 취약점"],
        rows: [
          ["생성(Create)", "데이터 유출 및 위·변조\n데이터 수집 디바이스 취약성 공격"],
          ["전달(Communicate)", "시스템 보안 취약\n인프라 및 네트워크 공격"],
          ["종합과 분석(Aggregate & Analyze)", "위·변조된 데이터 학습\nAI 시스템 권한 탈취"],
          ["이해(Insight)", "가상환경(AR·VR S/W) 보안 위협\n분석 데이터 위·변조"],
          ["행동(Act)", "현실 위협: 기기 오작동, 센서 조작\n기업·개인·시설 정보 대량 유출"],
        ],
      },
      {
        caption: "디지털 트윈의 보안취약점 대응방안",
        headers: ["프로세스", "대응방안"],
        rows: [
          ["생성(Create)", "데이터 암·복호화 적용\n인증(Authentication) 강화\n인가(Authorization) 강화"],
          ["전달(Communicate)", "제로 트러스트 아키텍처 설계\n시스템/인프라 접근통제"],
          ["종합과 분석(Aggregate & Analyze)", "AI 기반 보안 운영 자동화(AIOps)\n보안취약점 자동진단"],
          ["이해(Insight)", "지능형 사이버 보안 관제\n사용자/데이터 보호 기술"],
          ["행동(Act)", "자기통제 기반 사용자 보호 기술\n프라이버시 보존기술(PETs)"],
          ["공통사항", "보안교육 및 정책 (Compliance)"],
        ],
      },
    ],
    notes: [
      "프로세스 5단계: 생성 → 전달 → 종합과 분석 → 이해 → 행동, 공통사항으로 보안교육·정책(Compliance)",
      "핵심: 현실을 그대로 복제하므로 디지털 트윈 조작이 실제 기기 오작동·센서 조작으로 이어짐 — 행동(Act) 단계가 가장 위험",
    ],
  },
  {
    title: "국가 망 보안체계(N2SF)",
    course: "SC",
    definition:
      "각급기관의 업무를 식별하고 중요도별로 등급을 구분한 후, 해당 등급에 맞추어 보안 대책을 차등 적용하는 보안 프레임워크",
    defShort: "업무 중요도별 등급에 맞추어 보안 대책을 차등 적용하는 보안 프레임워크",
    lead: "업무 등급별 차등 보안, N2SF",
    features: ["업무 중요도 기반", "등급별 차등 통제", "일률 망분리 탈피"],
    keywords: ["준비", "C/S/O 등급분류", "위협식별", "보안대책 수립", "적절성 평가·조정"],
    tables: [
      {
        caption: "업무정보 C/S/O 분류 기준",
        headers: ["기준", "설명"],
        rows: [
          ["기밀 정보(C)", "안보·국방·외교·수사 기밀정보\n국민 생활·생명·안전 직결 정보"],
          ["민감 정보(S)", "비공개 정보, 개인·국가 이익 침해"],
          ["공개 정보(O)", "기밀·민감 정보 이외의 모든 정보\n별도 조치 적용한 비공개 정보"],
        ],
      },
      {
        caption: "국가 망 보안체계 적용 절차",
        headers: ["절차", "설명"],
        rows: [
          ["① 준비(Prepare)", "정보서비스 현황 파악 분석"],
          ["② C/S/O 등급분류(Categorize)", "중요도 따라 C/S/O 등급 분류"],
          ["③ 위협식별(Identify)", "구성환경 모델링, 위협 식별"],
          ["④ 보안대책 수립(Select)", "위협식별 결과로 보안통제 선택"],
          ["⑤ 적절성 평가·조정(Assess)", "등급분류·위협식별·보안통제\n적절성 평가 및 재조정"],
        ],
      },
      {
        caption: "기존 망 분리 정책과 국가 망 보안체계 비교",
        headers: ["구분", "현행 망 분리 정책", "국가 망 보안체계"],
        rows: [
          ["방식", "업무망·인터넷\n일률 물리 분리", "업무 중요도별\n등급 차등 통제"],
          ["기밀(C)", "완전 물리 분리", "비밀·안전 유지"],
          ["민감(S)", "별도 구분 없음", "논리·영역 분리"],
          ["공개(O)", "별도 구분 없음", "인터넷 등 개방"],
        ],
      },
    ],
    notes: [
      "적용 절차: 준비 → C/S/O 등급분류 → 위협식별 → 보안대책 수립 → 적절성 평가·조정(국가정보원 보안성 검토)",
      "핵심: 기존 '일률적 망분리'의 경직성을 개선해 업무 중요도(기밀·민감·공개)별로 보안을 차등 적용 — AI·클라우드 도입 유연화",
    ],
  },
  {
    title: "ISO/IEC 25059:2023(AI 품질모델)",
    course: "AI",
    definition:
      "소프트웨어 제품 품질 표준을 기반으로 AI 시스템 고유 속성인 비결정성, 데이터 의존성 등이 반영된 AI 시스템 전용 품질모델 확장 표준",
    defShort: "비결정성·데이터 의존성이 반영된 AI 시스템 전용 품질모델 확장 표준",
    lead: "AI 시스템 품질모델 확장, ISO/IEC 25059:2023",
    features: ["25010 기반 확장", "비결정성 반영", "AI 특화 속성 추가"],
    keywords: ["기능 적합성", "신뢰성", "사용성", "성능 효율성", "유지보수성", "이식성", "호환성", "보안성", "견고성", "설명가능성", "강건성"],
    tables: [
      {
        caption: "AI 품질모델 8대 특성과 하위 속성 (개념도) — 두음: 기신사효유이호보",
        headers: ["특성", "하위 속성"],
        rows: [
          ["기능 적합성", "기능 완전성, 기능 정확성*\n기능 적절성, 기능 적응성*"],
          ["성능 효율성", "시간 반응성, 자원 활용성\n용량성"],
          ["호환성", "공존성, 상호운용성"],
          ["사용성", "적절성 인식성, 학습 용이성\n운영 용이성, 사용자 오류 방지성\n사용자 인터페이스 미학성\n접근성, 사용자 제어성*, 투명성*"],
          ["신뢰성", "성숙성, 가용성, 결함 허용성\n회복성, 강건성*"],
          ["보안성", "기밀성, 무결성, 부인 방지성\n책임성, 인증성, 개입 가능성*"],
          ["유지보수성", "모듈성, 재사용성, 분석성\n수정성, 테스트 용이성"],
          ["이식성", "설치성, 대체성, 적응성"],
        ],
      },
      {
        caption: "표준 구성 (모델·항목별 평가 내용)",
        headers: ["모델", "항목", "설명"],
        rows: [
          ["기능 적합성", "기능 정확성", "정확 수행 평가"],
          ["기능 적합성", "기능 적응성", "다양 상황 적응"],
          ["신뢰성", "강건성", "다양 조건 안정성"],
          ["신뢰성", "회복성", "오류 후 정상 복구"],
          ["사용성", "사용자 제어성", "동작 제어 정도"],
          ["사용성", "투명성", "작동 원리 이해"],
          ["성능 효율성", "자원 활용성", "자원 효율 평가"],
          ["성능 효율성", "용량성", "작업·데이터량"],
          ["유지보수성", "재사용성", "타 시스템 재사용"],
          ["유지보수성", "모듈성", "독립 모듈 구성"],
          ["이식성", "대체성", "구성요소 교체"],
          ["이식성", "적응성", "타 환경 적응"],
          ["호환성", "공존성", "타 시스템 공존"],
          ["호환성", "상호운용성", "타 시스템 연동"],
          ["보안성", "개입 가능성", "사용자 개입 조치"],
          ["보안성", "책임성", "행동 추적·책임"],
        ],
      },
    ],
    notes: [
      "* 표시 속성은 AI 시스템의 고유 특성(비결정성·데이터 의존성)을 반영해 새로 추가·확장된 항목이다.",
      "SQuaRE(ISO/IEC 25010) 제품 품질모델을 AI로 확장한 표준 — 25010과 묶어 '무엇이 늘었나'로 출제된다.",
      "AI 관련 표준 계보: 22989(용어·개념) · 23053(ML 프레임워크) · 23894(위험관리) · 42001(AI 경영시스템) · 25059(품질모델).",
    ],
  },
  {
    title: "AP2(Agent Payment Protocol)",
    course: "DX",
    definition:
      "AI 에이전트가 사용자 지시에 따라 안전하고 검증가능한 결제를 수행할 수 있게 하는 오픈 표준 결제 프로토콜",
    defShort: "AI 에이전트가 사용자 지시로 검증가능한 결제 수행 표준 결제 프로토콜",
    lead: "에이전트 커머스 결제 표준, AP2",
    features: ["위임장 기반 결제", "검증가능 자격증명", "오픈 표준"],
    keywords: ["AI Agent", "역할기반 결제", "위임장(Mandate)", "A2A", "x402", "MCP", "A2A x402 Extension", "스마트계약"],
    tables: [
      {
        caption: "역할기반 아키텍처 — 구성요소",
        headers: ["구분", "구성요소", "설명"],
        rows: [
          ["사용자", "사용자", "상거래 개시 주체"],
          ["사용자", "사용자 에이전트", "Cart 구축"],
          ["자격 증명", "자격증명 제공자", "관리·실행 주체"],
          ["판매자", "판매자 엔드포인트", "상품 서비스 제공\nMCP 또는 AI"],
          ["판매자", "판매자 결제프로세스", "승인 메시지 구성\n결제망 전송"],
          ["증명 제공", "네트워크 및 발급사", "결제 네트워크\n자격 증명 발급"],
        ],
      },
      {
        caption: "AP2의 주요 기술요소 구성도",
        headers: ["측면", "기술요소"],
        rows: [
          ["보안 측면", "Cart Mandate\nIntent Mandate\nPayment Mandate\nVerifiable Credential"],
          ["연동 측면", "Agent to Agent Protocol\nModel Context Protocol\nA2A x402 Extension\nPython Language"],
          ["거래 측면", "X402 Protocol, Smart Contract\nEVM Network\nSolana Network\nDistributed Ledger"],
          ["결제 측면", "Stablecoin\nCredit Card\n계좌이체"],
        ],
      },
    ],
    notes: [
      "검증 가능한 디지털 자격증명(VDC) 기반 위임장 흐름: 구매지시 → Intent mandate 확인 → cart mandate 준비 → Get User approval → Intent 집행 → Cart 집행 → Payment 집행 → Order With Payment(Merchant).",
      "위임장(Mandate) 3종이 핵심 — Intent(무엇을 사라), Cart(무엇을 담았다), Payment(어떻게 결제한다). 각 단계에 사용자 서명이 붙어 '누가 시켰는지'를 사후 증명한다.",
      "AP2(Google) · ACP(OpenAI) · UCP(Google)는 에이전틱 커머스 3대 프로토콜로 묶어 비교 출제된다.",
    ],
  },
  {
    title: "UCP(Universal Commerce Protocol)",
    course: "DX",
    definition:
      "AI 에이전트가 다양한 쇼핑몰과 상거래 시스템에서 데이터를 표준화된 방식으로 교환하고, 상품 탐색부터 결제, 주문까지 전 과정을 자동화하도록 돕는 개방형 프로토콜",
    defShort: "상품 탐색부터 결제, 주문까지 전 과정을 자동화하는 개방형 프로토콜",
    lead: "구글 주도 상거래 규약, UCP",
    features: ["에이전트 중심", "탐색~주문 자동화", "결제 AP2 위임"],
    keywords: ["Google주도 에이전틱 상거래 프로토콜"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Checkout", "세금 계산 포함해\n사람 개입 유무\n관계없이 결제\n처리"],
          ["Identity Linking", "OAuth 2.0 기반으로\n에이전트가\n사용자를 대신해\n행동"],
          ["Order", "주문 관리 위해\n웹훅 기반 배송,\n반품, 환불 상태\n알림"],
          ["Payment Token Exchange", "PSP와 Credential Provider\n간 안전한 토큰\n교환 프로토콜"],
        ],
      },
      {
        caption: "개념도 — 계층 구조",
        headers: ["구분", "구조", "설명"],
        rows: [
          ["Consumer Surfaces(소비자 접점)", "Google\nAI Mode", "구글 주도\nAI 검색 접점"],
          ["Consumer Surfaces(소비자 접점)", "Gemini\n기타 AI", "AI 모델 접점\n외부 플랫폼"],
          ["Consumer Surfaces(소비자 접점)", "음성 채팅\n비주얼", "대화형 구매\n시각 커머스"],
          ["UCP 프로토콜 코어", "Shopping Service", "checkout, line items, totals"],
          ["UCP 프로토콜 코어", "Capabilities", "Checkout · Orders · Catalog"],
          ["UCP 프로토콜 코어", "Extensions", "Fulfillment · Discount · 커스텀"],
          ["전송 방식(Transport)", "REST API\nMCP", "HTTP 호출\n모델 컨텍스트"],
          ["전송 방식(Transport)", "A2A\nJSON RPC", "에이전트 연동\n원격 호출 규약"],
          ["보안 & 결제 계층", "AP2(Agent Payments Protocol)", "암호화 결제 증명·토큰화"],
          ["보안 & 결제 계층", "OAuth 2.0 · PCI-DSS", "신원 연결·서명 키\n검증 가능 자격증명"],
          ["판매자 백엔드(Merchant Backend)", "기존 인프라", "변경 없이 연동"],
        ],
      },
    ],
    notes: [
      "Discovery & Negotiation(탐색·협상) → UCP 코어 → Transport → 보안·결제 계층 순으로 내려가는 계층 구조가 답안 뼈대다.",
      "결제 실행은 AP2에 위임하고 UCP는 '상거래 데이터 교환 규격'을 맡는다 — 둘의 역할 분담이 시험 포인트.",
    ],
  },
  {
    title: "ACP(Agentic Commerce Protocol)",
    course: "DX",
    definition:
      "구매자가 AI에이전트와 소통을 통해 원하는 제품을 찾고 안전하게 상거래를 할 수 있도록 하는데 중점을 둔 개방형 프로토콜",
    defShort: "AI에이전트로 원하는 제품 찾고 안전하게 상거래하는 개방형 프로토콜",
    lead: "OpenAI의 상거래 규약, ACP",
    features: ["에이전트 상거래", "범위 제한 토큰", "개방형 프로토콜"],
    keywords: ["OpenAI 주도 에이전틱 상거래 프로토콜"],
    tables: [
      {
        caption: "구성요소",
        headers: ["구성요소", "설명"],
        rows: [
          ["Shared Payment Token(SPT)", "특정 금액과\n판매자로 범위\n제한한 결제 토큰\n활용해 결제"],
          ["Delegated Payment", "결제 자격증명\n토큰화하고\n사용제약 설정 후\n판매자에 위임"],
          ["4개 REST 엔드포인트 구조", "셀러는 주문 Create, Update,\nComplete, Cancel을\nREST처리"],
          ["보안 요구사항", "모든 요청은\nAPI버전헤더를\n포함해야하며\nHTTPS 사용 필요"],
        ],
      },
    ],
    notes: [
      "개념도: 구매자 → AI Agent(LLM: OpenAI · Claude · Perplexity) → 결제(Stripe · Adyen · PayPal · VISA · Mastercard) → 판매자(Google · SHEIN · YouTube · Instagram) 흐름.",
      "AP2가 '위임장 3종'으로 권한을 증명한다면, ACP는 '범위 제한 토큰(SPT)'으로 위험을 한정한다 — 안전장치 설계 방식의 차이가 비교 포인트.",
    ],
  },
  {
    title: "스테이블 코인(Stable coin)",
    course: "DX",
    definition:
      "암호화폐의 급격한 가격변동성을 방지하기 위해 법정 화폐 또는 실물 자산과 연동하여 가격 안전성을 보장하도록 설계된 암호 화폐",
    defShort: "가격변동성을 막으려 법정화폐·실물자산과 연동한 가격 안정 암호화폐",
    lead: "가격 안정성 보장 암호화폐, 스테이블 코인",
    features: ["법정화폐 연동", "가격 변동성 방지", "발행·소각 대칭"],
    keywords: ["법정화폐 담보형", "암호화폐 담보형", "무담보 알고리즘형", "발행(Mint)", "소각(Burn)"],
    tables: [
      {
        caption: "유형",
        headers: ["유형", "설명", "사례"],
        rows: [
          ["법정화폐 담보형", "법정화폐 예치 후\n동액 토큰 발행\n보유로 가치 유지", "Tether, True USD"],
          ["암호화폐 담보형", "암호화폐를\n제3기관에 예치", "BitShare, MakerDao"],
          ["무담보 알고리즘형", "스마트 계약으로\n공급량 조절\n추가 발행 필요", "BaseCoin, Terra"],
        ],
      },
      {
        caption: "구성요소",
        headers: ["계층", "구성요소"],
        rows: [
          ["외부 연동 계층", "Banking Service"],
          ["서비스 통합 계층", "Stablecoin Backend\n(중앙 서비스 코어)\nOperation Events Webhook"],
          ["서비스 통합 계층", "Proof of Reserves Service\nCache Service"],
          ["데이터 및 메시징 계층", "Database(PostgreSQL)\nMessage Queue (RabbitMQ)"],
          ["블록체인 상호작용 계층", "Smart Contract Interface"],
          ["API 및 운영 계층", "Backend API Service\nDocker 기반 배포"],
        ],
      },
      {
        caption: "발행절차(Mint)",
        headers: ["단계", "절차", "설명"],
        rows: [
          ["M.0", "은행 입금 확인", "입력 정보 검증(정확성·무결성)"],
          ["M.1", "주문 생성", "입금 예상 항목 DB에 생성"],
          ["M.2", "입금 확인", "은행 입금 알림 수신 정보 확인"],
          ["M.3", "상태 업데이트", "입금 상태 결제 완료(paid) 갱신\n결제 세부 정보 저장"],
          ["M.4", "민팅 개시", "토큰 발행(Mint) 작업 시작\n대기열에 추가"],
          ["M.5", "작업 실행", "대기열 작업 수신, 실제 발행 수행"],
          ["M.6", "블록체인 전송", "민팅 트랜잭션 생성·서명\n블록체인에 브로드캐스트"],
          ["M.7", "결과 대기", "스마트 계약 트랜잭션 처리 확인"],
          ["M.8", "기록 저장", "참조·감사 위해 민팅 결과 DB 저장"],
        ],
      },
      {
        caption: "소각절차(Burn)",
        headers: ["단계", "절차", "설명"],
        rows: [
          ["B.1", "소각 요청", "API로 토큰 판매(소각) 요청"],
          ["B.2", "허가 서명", "오프체인 서명(Permit) 생성\n시스템이 토큰 소각할 수 있게 승인"],
          ["B.3", "트랜잭션 실행", "Smart Contract Interface가\nburnFromWithPermit 함수 호출\n토큰 소각"],
          ["B.4", "결과 확인", "소각 트랜잭션 성공 여부 확인"],
          ["B.6", "법정화폐 송금", "BaaS로 사용자 계좌 현금 이체"],
          ["B.7", "최종 기록", "소각·송금 이벤트 기록\n무결성 확보"],
        ],
      },
    ],
    notes: [
      "발행(Mint)은 '돈을 받고 토큰을 찍는' 흐름, 소각(Burn)은 '토큰을 없애고 돈을 돌려주는' 흐름 — 두 절차가 대칭이라는 점이 답안 구조가 된다.",
      "Terra 사태로 무담보 알고리즘형의 디페깅(가격 이탈) 위험이 드러났고, 준비금 증명(Proof of Reserves)이 규제 쟁점이다.",
    ],
  },
  {
    title: "데이터 스페이스(Data Space)",
    course: "DX",
    definition:
      "데이터 공유·활용 생태계로 기업, 기관, 개인이 만든 데이터를 공유 및 교환하면서 보안·주권을 유지할 수 있도록 만든 체계",
    defShort: "기업·기관·개인 데이터를 공유 및 교환하며 보안·주권 유지하는 체계",
    lead: "데이터 주권의 공유 생태계, 데이터 스페이스",
    features: ["데이터 주권", "연합형 구조", "상호운용성"],
    keywords: ["데이터 주권", "연합형 네트워크", "상호운용성", "신뢰성/투명성 확보"],
    tables: [
      {
        caption: "데이터 스페이스 거버넌스 참조모델",
        headers: ["원칙"],
        rows: [
          ["데이터 주권 보장"],
          ["연합형 및 분산형 구조"],
          ["신뢰 및 보안 확보"],
          ["상호운용성 확보"],
          ["투명성 확보"],
          ["거버넌스 유연성 및 자율성"],
        ],
      },
      {
        caption: "개발 및 활용 단계별 개인정보 침해 방지를 위한 방안",
        headers: ["구분", "구성 요소", "설명"],
        rows: [
          ["데이터 스페이스 거버넌스", "연합형 및 분산형 구조", "데이터 주권 보장\n합의된 공통 규칙 기반 구성"],
          ["데이터 스페이스 거버넌스", "신뢰성, 보안 및 투명성", "신뢰 기반 교환·서비스 모델 운영"],
          ["데이터 스페이스 거버넌스", "거버넌스 유연성 및 자율성", "유연성·참여자 자율성 확보 체계"],
          ["비즈니스 계층", "도메인별 Use Case 개발", "가치 창출 실 사용 사례 발굴·확산"],
          ["비즈니스 계층", "참여자 등록 및 계약 관리", "거래 참여자 등록·역할·계약 관리"],
          ["비즈니스 계층", "접근 권한 및 정책 설정", "참여자별 접근 권한·이용 정책"],
          ["비즈니스 계층", "데이터 제품·서비스 제공", "데이터 제품·거래 서비스 제공"],
          ["기술 계층", "표준 API, 데이터 커넥터", "표준 기반 API·데이터 교환 도구"],
          ["기술 계층", "ID 및 신뢰 관리", "DID·VC·eIDAS 인증·자격 검증"],
          ["기술 계층", "정책·계약 관리 모듈", "Policy-as-Code 접근·사용 제어"],
          ["기술 계층", "연합 카탈로그", "메타데이터 기반 데이터 상품 등록"],
          ["기술 계층", "메타데이터 브로커", "거래 대상 데이터 상품 탐색"],
          ["기술 계층", "클리어링하우스", "거래 이력 추적·정산 모니터링"],
          ["기술 계층", "전자결제 및 디지털 토큰", "NFT·스테이블 코인 기반\n결제 자동화·정산"],
        ],
      },
      {
        caption: "K Data Space 추진 전략",
        headers: ["구분", "내용"],
        rows: [
          ["K-Data Space 추진 배경", "유통·거래 제도 체감 효과 부족\n중앙 집중형 Platform 구조적 제약\n협업·비즈니스 모델 창출 한계"],
          ["K-Data Space 추진 전략", "기술·제도 및 운영모델 실증\n불투명한 수익·정산 구조 개선\n비즈니스·협력 모델 실증"],
        ],
      },
    ],
    notes: [
      "비즈니스 계층(무엇을 거래하나) → 기술 계층(어떻게 거래하나)의 2단 구조 위에 거버넌스가 얹히는 그림이 답안 뼈대다.",
      "유럽 GAIA-X · IDSA 참조 아키텍처의 국내판이 K-Data Space — '데이터 주권'이 중앙집중 플랫폼과 구분되는 핵심어다.",
    ],
  },
  {
    title: "도메인 특화 언어 모델(Domain-Specific Language Model)",
    course: "DX",
    definition:
      "금융, 의료, 법률 등 특정 산업군이나 비즈니스 기능에 최적화된 데이터셋으로 학습 또는 미세 조정하여 높은 정확도 및 실용성을 제공하는 AI 모델",
    defShort: "특정 산업군이나 비즈니스 기능에 최적화된 데이터로 학습한 AI 모델",
    lead: "산업 도메인 특화 모델, DSLM",
    features: ["도메인 데이터 학습", "범용 대비 고정확", "RAG 지식 연동"],
    keywords: ["Vertical AI", "도메인 지식", "sLLM", "RAG", "프롬프트 엔지니어링"],
    tables: [
      {
        caption: "핵심 기술",
        headers: ["구분", "핵심 기술", "설명"],
        rows: [
          ["데이터", "데이터 큐레이션(Data Curation)", "고품질 말뭉치(Corpus) 수집 정제"],
          ["데이터", "Vector Database", "텍스트 벡터 변환·저장\n유사도 기반 검색 DB"],
          ["학습", "도메인 특화 사전학습(DAPT, Domain-Adaptive Pre-training)", "언어모델 도메인 특화 학습\n성능 개선 기법"],
          ["학습", "RLHF", "인간 피드백 통한 AI 학습"],
          ["성능", "검색 증강 생성(Retrieval-Augmented Generation)", "도메인 지식 베이스 연동\n도메인 최적화 답변 생성"],
          ["성능", "Prompt Chain", "프롬프트 다단계 연결\n논리적 사고로 성능 향상"],
          ["성능", "PEFT (Parameter-Efficient Fine-Tuning)", "LoRA, QLoRA 등 LLM 튜닝"],
        ],
      },
    ],
    notes: [
      "개념도: Fundation Model + 범용 데이터 →파인튜닝→ 도메인특화 사전학습(DAPT) ←말뭉치 수집— 도메인 데이터 → 도메인 특화 언어 모델(+ RAG / RLHF).",
      "Vertical AI(수직 AI)와 같은 계보 — 범용 LLM을 도메인 데이터로 좁혀 정확도를 올리는 전략이다.",
    ],
  },
  {
    title: "AI 프라이버시 리스크 관리",
    course: "SC",
    definition:
      "AI가 프라이버시 친화적으로 활용될 수 있도록 AI 프라이버시 리스크 요인을 체계화하고, 리스크 관리의 방향과 원칙을 제시하기 위해 체계",
    defShort: "AI 프라이버시 리스크 요인을 체계화하고 관리 방향과 원칙 제시 체계",
    lead: "AI 프라이버시 침해 대응, AI 프라이버시 리스크 관리",
    features: ["유형·용례 기반", "생애주기별 식별", "정량·정성 측정"],
    keywords: ["AI의 유형 및 용례 파악", "리스크의 식별", "리스크의 측정", "리스크의 경감"],
    tables: [
      {
        caption: "리스크 관리 절차",
        headers: ["절차", "핵심 활동", "설명"],
        nameCol: 1,
        rows: [
          ["① AI의 유형·용례 파악", "AI의 목적, 범위 및 처리되는 데이터파악", "처리 목적·범위 리스크 식별 위해\n개발·제공 AI 유형·용례 파악 선행"],
          ["② 리스크 식별", "리스크 식별", "유형·용례 대응 리스크 식별\nAI 생애주기별 리스크 식별"],
          ["③ 리스크 측정", "리스크 정량적·정성적 평가", "적절한 지표·측정 도구 활용\n발생확률·결과 정량·정성 평가\n수용가능여부·우선순위 판단"],
          ["④ 리스크 경감", "기술적 방안 검토", "위험 주기적 측정·모니터링\n결과의 문서화\n담당 조직 구성·운영\n조직 내·외부 피드백 수렴·반영"],
          ["④ 리스크 경감", "관리적 방안 검토", "프라이버시 향상 기술(PET) 도입"],
        ],
      },
      {
        caption: "리스크 식별 — 단계별 리스크",
        headers: ["단계", "리스크"],
        rows: [
          ["기획·개발 단계", "적법하지 않은 데이터 수집·이용\n학습데이터 부적절한 보관·관리\n가치망 다양화로 흐름·책임 복잡"],
          ["서비스 제공 단계", "학습데이터 암기·개인정보 노출\n악의적 AI 합성콘텐츠로 권리침해\n자동화된 결정으로 권리 약화\n대중 감시 및 민감정보 추론 위험"],
        ],
      },
      {
        caption: "리스크 경감 — 조치 유형별 방안",
        headers: ["구분", "경감방안"],
        rows: [
          ["관리적 조치", "학습데이터 출처·이력 관리\n안전한 보관·파기 방안 마련·실행\nAI 가치망 참여자간 역할 명확화\n허용되는 이용 방침 작성, 공개"],
          ["관리적 조치", "AI 프라이버시 레드팀 구성·운영\n정보주체 신고·조치 방안 마련\n자동화된 결정 조치 기준 준수\n개인정보 영향평가 수행 고려"],
          ["기술적 조치", "학습데이터 전처리\n합성데이터 사용 고려\n모델 미세조정 통한 안전장치\n입력 및 출력 필터링 적용"],
          ["기술적 조치", "차분 프라이버시 기법 적용\n출처데이터 추적\n합성콘텐츠 탐지방안 마련\n생체정보 활용 시 가명·익명처리"],
        ],
      },
    ],
    notes: [
      "개념도(4단계): AI의 유형·용례 파악 → 리스크 식별 → 리스크 측정 → 리스크 경감방안의 검토와 도입(관리적 방안 검토 / 기술적 방안 검토).",
      "개인정보보호위원회 'AI 프라이버시 리스크 관리 모델' — PIA(영향평가)·ISMS-P와 묶어 'AI 시대의 개인정보 보호 체계'로 출제된다.",
    ],
  },
  {
    title: "데이터 상호 운용성 & 데이터 이동권",
    course: "DX",
    definition:
      "데이터 상호 운용성은 시스템 간 제약 없는 데이터 호환을 위해 데이터 교환 능력과 데이터 의미 일관성 등을 보장하는 능력이며, 데이터 이동권은 개인이 자신의 데이터(의료, 금융, 행정, 여행, 에너지, 통신)를 자신이 지정한 위치로 이동시킬 수 있는 권리",
    defShort: "제약 없는 데이터 호환 위한 데이터 교환 능력과 자신의 데이터 이동 권리",
    lead: "호환 보장과 데이터 통제권, 데이터 상호 운용성과 데이터 이동권",
    features: ["데이터 파편화 해소", "정보주체 통제 강화", "표준 기반 연계"],
    defPair: [
      {
        name: "데이터 상호 운용성",
        lead: "시스템 간 호환 보장 능력",
        def: "제약 없는 데이터 호환 위해 데이터 교환 능력, 의미 일관성 보장하는 능력",
        features: ["구문적 표준화", "의미적 일관성", "기술적 안정성"],
      },
      {
        name: "데이터 이동권",
        lead: "개인 데이터 통제의 권리",
        def: "개인이 의료·금융 등 자신의 데이터를 지정한 위치로 이동시키는 권리",
        features: ["정보주체 권리", "구조화된 전송", "제3자 전송 허용"],
      },
    ],
    keywords: ["상호운용성", "데이터 이동권", "데이터 파편화"],
    tables: [
      {
        caption: "데이터 상호 운용성 — 핵심요소",
        headers: ["핵심요소", "요소"],
        rows: [
          ["기술적 안정성", "MCP, API AI Agent"],
          ["구문적 표준화", "XML, JSON"],
          ["의미적 일관성", "표준용어, 온톨로지"],
          ["표준", "ISO/IEC 11179(메타데이터)\n19941(클라우드 상호운용성)\n23053(AI 시스템 프레임워크)"],
        ],
      },
      {
        caption: "데이터 이동권의 3가지 핵심요소",
        headers: ["구분", "핵심 요소", "설명"],
        rows: [
          ["데이터 유형(Type of Data)", "무엇을 전송할 것인가", "자발적(Volunteered) 데이터\n관찰(Observed) 데이터\n파생(Derived) 데이터\n획득된(Acquired) 데이터"],
          ["수혜자(Beneficiaries)", "누구의 데이터를 옮길 것인가", "개인(자연인): 정보주체 이동권\n기업(법인): 기업 간 이동권"],
          ["운영 방식(Operational Modality)", "어떻게 데이터를 전송할 것인가", "일시적 전송: 1회 요청 다운로드\n상호운용성 기반 실시간 전송"],
        ],
      },
    ],
    notes: [
      "상호운용성 개념도: 데이터 이용자(데이터 수요자·AI 모델·데이터 중계자) ↔ 데이터 상호운용성(안전한 연결·의미 일관성·구문 표준화 / MCP·XML·JSON·온톨로지) ↔ 데이터 공급자(공공 데이터 플랫폼·민간 데이터 플랫폼·Physical AI).",
      "이동권 개념도: 데이터 보관 기업 →구조화된 데이터→ 데이터 주체, 그리고 사업자(3rd 파티)를 거친 구조화된 데이터 이동(데이터 Query / 데이터분석 App).",
      "상호운용성은 '기술이 되게 하는 것', 이동권은 '개인이 요구할 수 있는 것' — 수단과 권리의 관계로 정리하면 논지가 선다.",
    ],
  },
  {
    title: "AI Agent 보안위협",
    course: "SC",
    definition:
      "AI 에이전트가 자율적 의사결정, 메모리 활용, 외부 도구 및 시스템 호출, 인증 및 권한 관리, 인간 개입, 다중 에이전트의 6단계에서 발생하는 보안 위협과 그에 대응하는 방안(금융보안원)",
    defShort: "AI 에이전트 의사결정·메모리·도구 호출 6단계 위협과 대응 방안",
    lead: "6단계 자율 에이전트 위험, AI Agent 보안위협",
    features: ["자율 권한 확대", "실행 단계별 위협", "메모리 오염"],
    keywords: ["자율적 의사결정", "메모리 활용", "외부 도구 및 시스템 호출", "인증 및 권한 관리", "인간 개입", "다중 에이전트"],
    tables: [
      {
        caption: "보안위협 — 위협 식별 6단계",
        headers: ["위협 식별 단계", "보안 위협", "설명"],
        rows: [
          ["1단계(자율적 의사결정)", "목표 조작 및\n의도 변경", "비인가 목표 설정\n목표 설정 조작"],
          ["1단계(자율적 의사결정)", "오작동 및\n기만적행동", "허위 응답 생성\n비허용 방식"],
          ["1단계(자율적 의사결정)", "부인 및\n추적 불가", "작업 기록 누락\n책임 추적 불가"],
          ["2단계(메모리 활용)", "메모리 오염", "허위 정보 삽입"],
          ["2단계(메모리 활용)", "연쇄 환각 공격", "잘못된 의사결정"],
          ["3단계(외부 도구 및 시스템 호출)", "도구오용", "도구에 악성코드"],
          ["3단계(외부 도구 및 시스템 호출)", "권한탈취", "비인가 작업 수행"],
          ["3단계(외부 도구 및 시스템 호출)", "자원 과부하", "시스템 자원 고갈"],
          ["3단계(외부 도구 및 시스템 호출)", "원격코드 실행", "악성 명령 유도"],
          ["4단계(인증 및 권한 관리)", "신원 사칭/위장", "인증 체계 우회"],
          ["5단계(인간 개입)", "인간 개입 무력화", "과다 작업 처리"],
          ["5단계(인간 개입)", "사용자 기만", "보안 정책 무력화"],
          ["6단계(다중 에이전트)", "통신 오염", "잘못된 정보 확산"],
          ["6단계(다중 에이전트)", "사용자 기만", "신뢰 체계 악용"],
          ["6단계(다중 에이전트)", "악성 에이전트", "보안 체계 무력화"],
        ],
      },
      {
        caption: "대응방안 — 단계별 통제",
        headers: ["위협 식별 단계", "대응방안", "설명"],
        nameCol: 1,
        rows: [
          ["자율적 의사결정", "목표 일관성 검증", "사용자 의도와 AI 실행 계획 비교"],
          ["자율적 의사결정", "출력 검증 시스템 적용", "목표·출력 유사도 비교, 조작 검증"],
          ["자율적 의사결정", "암호화된 로깅 및 이상 행위 탐지", "결정 과정 기록\n목표 변경·조작 시도 실시간 탐지"],
          ["메모리 활용", "신뢰할 수 있는 데이터 저장", "신뢰 출처 데이터만 학습\n불필요 정보 저장 차단"],
          ["메모리 활용", "세션 기반 메모리 격리", "이전 세션 학습 데이터 반입 제한"],
          ["메모리 활용", "확률적 사실 검증", "기존 정보 대조로 허위 학습 방지\n참조 데이터 신뢰성 검토"],
          ["외부 도구 및 시스템 호출", "사전 승인된 도구 목록 사용", "실행 가능 도구 사전 승인 제한"],
          ["외부 도구 및 시스템 호출", "역할 기반 도구 사용 제한", "역할별 필요 도구만 실행\n도구 사용 최소 권한 적용"],
          ["인증 및 권한 관리", "다중 인증 및 최소 권한 부여", "에이전트·사용자 인증 강화\n목표 수행 필요 최소 권한만 부여"],
          ["인간 개입", "자동 승인 제한", "중요 작업은 인간 검토 적용"],
          ["인간 개입", "과도한 승인 제한", "과다 승인 요청 시 무력화 시도 차단"],
          ["다중 에이전트", "신뢰할 수 있는 네트워크 제공", "암호화·서명 검증 신뢰 환경 수행"],
          ["다중 에이전트", "비정상적 접근 탐지", "접근 로그 분석, 비인가 시도 탐지"],
        ],
      },
    ],
    notes: [
      "금융보안원 자료 — 교재에 별도 정의문 없이 위협·대응 표로만 제시된다. 답안 서론은 위협 배경(자율 에이전트의 권한 확대)에서 출발하는 편이 자연스럽다.",
      "6단계는 에이전트의 '실행 파이프라인' 순서다: 결정(1) → 기억(2) → 도구 호출(3) → 인증·권한(4) → 인간 개입(5) → 에이전트 간 협업(6).",
      "OWASP LLM Top 10 · 프롬프트 인젝션 · MCP 보안과 묶어 'AI 에이전트 시대의 신종 위협'으로 출제된다.",
    ],
  },
  {
    title: "AI OS(Artificial Intelligence Operating System)",
    course: "DX",
    definition:
      "AI 중심의 컴퓨팅 자원, 모델, 데이터를 통합 관리 및 제어하는 차세대 운영체제",
    defShort: "AI 중심 컴퓨팅 자원과 모델·데이터를 통합 관리·제어하는 운영체제",
    lead: "LLM 커널의 운영체제, AI OS",
    features: ["LLM 중심 자원관리", "에이전트 실행환경", "전통 OS 개념 치환"],
    keywords: ["LLMCore", "LLMScheduler", "Context Manager", "Memory Manager", "Storage Manager", "Tool Manager", "Access Manager"],
    tables: [
      {
        caption: "구성요소",
        headers: ["절차", "핵심 활동", "설명"],
        rows: [
          ["LLM", "LLMCore", "LLM 인스턴스 추상화 통합"],
          ["LLM", "LLMScheduler", "이기종 GPU 스케줄링 알고리즘"],
          ["Data Manager", "Context Manager", "추론 중단점 저장\n복원 컨텍스트 스위칭"],
          ["Data Manager", "Memory Manager", "LLM 요청자 단기·장기 메모리 관리"],
          ["Data Manager", "Storage Manager", "영구 데이터 저장, Vector DB 검색"],
          ["Tool Manager", "Tool Manager", "API 도구 표준화 로딩 및 활용"],
          ["Tool Manager", "Access Manager", "접근제어, 사용자 인터페이스"],
        ],
      },
      {
        caption: "전통적인 OS와 비교",
        headers: ["구분", "전통적 OS", "AI OS"],
        rows: [
          ["개념도", "CPU RAM\n커널→프로세스", "LLM 컨텍스트\n커널→에이전트"],
          ["아키텍처 레이어", "프로세스 메모리\n파일·디바이스", "LLM 스케줄러\n컨텍스트·도구"],
          ["자원 예약", "프로세스 스레드", "LLM 요청 단위"],
          ["컨텍스트 스위칭", "체크포인트 등\n가상메모리 범용", "스냅샷\n복원 경로 제공"],
          ["애플리케이션", "앱 직접 구현", "LLM 중심 앱"],
          ["개발자 인터페이스", "POSIX 콜\n표준 SDK", "LLM API\nAI OS SDK"],
          ["하드웨어 자원 인식", "CPU 중심\nGPU 위임 처리", "LLM 워크로드\n특성 최적화"],
          ["목표/효과", "범용 컴퓨팅 성능\n안정성", "요청 단위 최적화\n컨텍스트 전환"],
        ],
      },
    ],
    notes: [
      "구성도: Users → User Prompt → Agent Applications(AAPs) → [Tools ←API→ LLM(Context Window) ←Retrieval→ External Storage] = AIOS.",
      "전통 OS의 3요소(프로세스·메모리·파일)가 AI OS에서 에이전트·컨텍스트·벡터 저장소로 치환된다는 대응 관계가 답안의 축이다.",
      "운영체제 과목의 프로세스 관리·컨텍스트 스위칭·가상메모리와 대비시키면 2교시 도입부가 자연스럽게 잡힌다.",
    ],
  },
  {
    title: "OWASP Agentic AI 위협 및 대응방안(Agentic AI Threats and Mitigations)",
    course: "SC",
    definition:
      "OWASP GenAI Security Project가 자율적으로 계획을 세우고 도구를 호출하며 다른 에이전트와 협업하는 AI 에이전트에서 새로 발생하는 보안 위협 15가지(T1~T15)와 위협별 완화 방안을 정리한 위협 참조 모델",
    defShort: "자율 AI 에이전트에서 새로 생기는 위협과 완화 방안을 정리한 참조 모델",
    lead: "자율 에이전트 위협 체계화, OWASP Agentic AI",
    features: ["자율 에이전트 특화", "위협별 완화 매핑", "실행 단계별 위협"],
    keywords: ["OWASP Top 10 for Agentic AI", "Agentic Security Initiative", "Memory Poisoning", "Tool Misuse", "Privilege Compromise", "Cascading Hallucination", "Intent Breaking", "Rogue Agents", "Human-in-the-Loop", "Agent Communication Poisoning"],
    tables: [
      {
        caption: "Agentic AI 위협 15종(T1~T15)",
        headers: ["코드", "위협", "설명"],
        rows: [
          ["T1", "메모리 오염\n허위 정보 주입", "단기·장기 기억\n의사결정 왜곡"],
          ["T2", "승인 도구 오용\n기만적 프롬프트", "악의적 작업 수행\n도구 유도 조작"],
          ["T3", "권한 설정 침해\n동적 역할 위임", "허점 악용 공격\n비인가 작업 수행"],
          ["T4", "자원 과부하\nAPI 자원 고갈", "가용성 침해\n성능 저하 유발"],
          ["T5", "연쇄 환각 공격\n허위 정보 전파", "그럴듯한 허위\n후속 판단 연쇄"],
          ["T6", "의도 훼손·조작\n목표 설정 조작", "계획 수립 조작\n사용자 의도 이탈"],
          ["T7", "오정렬·기만\n허위 응답 생성", "비허용 방식 사용\n목표 달성 기만"],
          ["T8", "부인·추적 불가\n로그 부재·조작", "책임 추적 불가\n사후 분석 불가"],
          ["T9", "신원 사칭·위장\n인증 체계 우회", "사용자 사칭\n위장 작업 수행"],
          ["T10", "인간 개입 무력화\n승인 요청 폭주", "검토 불가 유도\n감독 형해화"],
          ["T11", "원격코드 실행\n코드 생성 악용", "RCE 코드 공격\n악성 코드 실행"],
          ["T12", "통신 채널 오염\n에이전트 간 조작", "허위 정보 확산\n메시지 위조"],
          ["T13", "악성 에이전트\n감시 범위 밖 동작", "변조 에이전트\n다중 시스템 침해"],
          ["T14", "다중 에이전트\n신뢰·위임 악용", "인간의 공격 대상\n권한 횡적 확대"],
          ["T15", "인간 조종 공격\n신뢰 에이전트", "사용자 유도\n잘못된 행동 유발"],
        ],
      },
      {
        caption: "위협 범주별 완화 방안",
        headers: ["범주", "해당 위협", "완화 방안"],
        rows: [
          ["메모리·지식", "T1·T5\n세션 메모리 격리", "메모리 오염 위협\n세션 단위 분리"],
          ["메모리·지식", "쓰기 검증·추적\n스냅샷·롤백", "출처 무결성 확인\n이전 상태 복원"],
          ["메모리·지식", "외부 지식 대조", "사실관계 검증"],
          ["도구·실행", "T2·4·11\n도구 허용목록", "도구 오용 위협\n사전 승인 실행"],
          ["도구·실행", "파라미터 검증\n샌드박스 격리", "호출 인자 확인\n실행 환경 분리"],
          ["도구·실행", "호출 빈도 상한\n자원 사용량 상한", "과다 호출 차단\n자원 고갈 방지"],
          ["권한·신원", "T3·T9\nAgent ID", "권한 침해 위협\n고유 신원 발급"],
          ["권한·신원", "최소 권한 원칙\n역할 기반 접근", "권한 범위 축소\n직무별 통제"],
          ["권한·신원", "다중 인증 적용\n위임 토큰 제한", "신원 이중 확인\n범위·수명 제한"],
          ["추론·목표", "T6·T7\n의도 일관성 검증", "의도 훼손 위협\n계획 정합 확인"],
          ["추론·목표", "목표·출력 검사\n자기 검증 단계", "정합성 검증\n출력 재검토"],
          ["감사·추적", "T8\n변조 불가 로그", "부인·추적 위협\n감사 기록 보존"],
          ["감사·추적", "암호화 서명\n이상 행위 탐지", "결정 과정 기록\n실시간 감시"],
          ["인간 감독", "T10·T15\n중요 작업 승인", "감독 무력화 위협\n필수 승인 절차"],
          ["인간 감독", "승인 요청 상한\n이상 패턴 탐지", "과다 승인 방지\n승인 조종 탐지"],
          ["인간 감독", "사용자 고지", "출력 사실 안내"],
          ["다중 에이전트", "T12~14\n통신 암호화", "통신 오염 위협\n전송 구간 보호"],
          ["다중 에이전트", "통신 서명 검증\n신뢰 레지스트리", "발신 주체 확인\n에이전트 등록"],
          ["다중 에이전트", "행위 이상 탐지\n격리·차단", "악성 행위 식별\n악성 노드 차단"],
        ],
      },
      {
        caption: "OWASP LLM Top 10(2025)과 Agentic AI 위협 비교",
        headers: ["구분", "OWASP Top 10 for LLM Applications", "OWASP Agentic AI Threats"],
        rows: [
          ["보호 대상", "LLM 응용\n모델·프롬프트", "자율 에이전트\n계획·도구 협업"],
          ["항목 수", "10개 항목", "15개 항목"],
          ["대표 위협", "프롬프트 인젝션", "메모리 오염"],
          ["대표 위협", "민감정보 공개", "도구 오용 위협"],
          ["대표 위협", "공급망 위협", "목표 조작 위협"],
          ["대표 위협", "학습데이터 중독\n모델 중독 위협", "인간 개입 무력화\n악성 에이전트"],
          ["대표 위협", "과도한 대행", "에이전트 자율성"],
          ["위협 원천", "입출력 경계\n외부 입력 조작", "자율성·권한\n에이전트 신뢰"],
          ["대응 축", "입출력 검증\n데이터 거버넌스", "권한 최소화\n감사·인간 감독"],
        ],
      },
    ],
    notes: [
      "★출처 주의★ OWASP GenAI Security Project의 공식 문서명은 'Agentic AI — Threats and Mitigations'이며 위협은 10개가 아니라 15개(T1~T15)다. 현장에서 'OWASP Top 10 for Agentic AI'라고 부르는 경우가 많지만, 답안에는 'OWASP Agentic AI 위협(15종)'으로 쓰는 것이 안전하다. 별도의 'OWASP Top 10'은 LLM 애플리케이션용(LLM01~LLM10)이다.",
      "15개 위협은 에이전트 실행 파이프라인 순서로 묶으면 외워진다 — 기억(T1·T5) → 목표·추론(T6·T7) → 도구·실행(T2·T4·T11) → 권한·신원(T3·T9) → 감사(T8) → 인간 감독(T10·T15) → 다중 에이전트(T12·T13·T14).",
      "금융보안원 'AI Agent 보안위협' 6단계(자율적 의사결정·메모리 활용·외부 도구 호출·인증 및 권한 관리·인간 개입·다중 에이전트)가 이 15종을 국내 금융권 관점으로 재분류한 것이다. 두 자료를 한 답안에서 교차 인용하면 차별화된다.",
      "MCP·A2A 같은 에이전트 연동 프로토콜, AP2·ACP 같은 에이전트 결제 프로토콜이 확산되면서 T12(통신 오염)·T13(악성 에이전트)의 실효 위험이 커지고 있다.",
      "이 서브노트는 교재 슬라이드가 없어 OWASP 원문을 근거로 정리한 항목이다.",
    ],
  },
];

/** topicId 로 교재 서브노트를 찾는다. */
export function subnoteByTopicId(topicId?: string): TextbookSubnote | undefined {
  if (!topicId) return undefined;
  return SUBNOTES.find((s) => s.topicId === topicId);
}

const norm = (s: string) =>
  s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
/** 괄호 안 영문 풀네임까지 지운 형태 — "I2C와 SPI" ↔ "I2C(Inter…)와 SPI(Serial…)" 매칭용 */
const bare = (s: string) => norm(s.replace(/[(（][^)）]*[)）]/g, ""));

/** 공백은 남기고 구분기호만 지운 형태 — 낱말 경계를 봐야 하는 검사용 */
const spaced = (s: string) =>
  s.trim().toLowerCase().replace(/[()·,\-_/]/g, "").replace(/\s+/g, " ");
/** 낱말 경계 판정용 문자 종류 — 한글/영숫자/그 외 */
const script = (c: string) =>
  !c ? "" : /[가-힣]/.test(c) ? "ko" : /[a-z0-9]/.test(c) ? "en" : "";
/** 경계인가 — 문자열 끝이거나, 기호이거나, 한글↔영문으로 문자 종류가 바뀌는 지점 */
const atBoundary = (outside: string, inside: string) => {
  const o = script(outside);
  return !o || o !== script(inside);
};

/**
 * 포함 매칭(needle ⊂ haystack)을 받아들여도 되는지 판정한다.
 *
 * 공백을 지우고 비교하면 "EAMS" 가 "빔 탐색(Beam Search)" 의 'b|eams|earch' 에
 * 걸리는 식의 영문 조각 오탐이 난다. 그래서 공백을 살린 형태에서 needle 이
 * 낱말 경계(문자열 끝 · 기호 · 한글↔영문 전환)에 맞아떨어지는지 먼저 본다.
 * 이 경계 검사가 "스택(Stack)" ↔ "Stack" 은 살리고 "빔 탐색(Beam Search)" ↔ "EAMS" 는
 * 막아준다. 경계에서 안 걸리면 한글이 섞였거나 6글자 이상일 때만 통과시킨다
 * (= "활동 기간 산정 기법들" ↔ "활동기간 산정기법" 처럼 띄어쓰기만 다른 한글 제목 구제).
 */
function okLoose(needleTitle: string, haystackTitle: string): boolean {
  const n = spaced(needleTitle);
  const h = spaced(haystackTitle);
  const i = h.indexOf(n);
  if (i >= 0 && n) {
    const okStart = atBoundary(i === 0 ? "" : h[i - 1], n[0]);
    const okEnd = atBoundary(h[i + n.length] || "", n[n.length - 1]);
    if (okStart && okEnd) return true;
  }
  const bareNeedle = norm(needleTitle);
  // 경계에서 못 걸렸다면 띄어쓰기 변형 구제용 폴백인데, 괄호를 뗀 알맹이가
  // 상대 제목의 절반도 안 되는 길이면 다른 토픽의 한 조각일 가능성이 크다 —
  // "데이터 품질관리(ISO 8000)" 가 "인공지능 학습용 데이터 품질관리 가이드라인"
  // 을 잘못 무는 사고를 막는다.
  if (bare(needleTitle).length * 2 < bare(haystackTitle).length) return false;
  return /[가-힣]/.test(bareNeedle) || bareNeedle.length >= 6;
}


/* ── 교재 ↔ 예전 토픽 같은 토픽 판별 ──────────────────────────────────────
 * 두 목록의 제목 표기가 달라 같은 토픽이 두 번 뜨는 문제를 막는다.
 *   "Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)"
 *   "Value Chain"    ↔ "가치사슬(Value Chain)"
 * 규칙: ① topicId 가 같거나 ② 괄호를 뗀 제목이 같거나
 *       ③ 제목이 괄호로 끝날 때 그 괄호 안 이름(또는 패턴·기법 등 일반 접미어를
 *          뗀 핵심어, 5자 이상)이 서로 겹칠 때.
 * 괄호 뒤에 범위어가 더 붙은 제목("… 의 보안 취약점 및 대응방안")은 다른 토픽이라
 * 별칭을 만들지 않는다.
 */
const GEN_SUFFIX = /(패턴|pattern|기법|방식|모델|model|알고리즘|algorithm)$/i;
/** 별칭이 겹쳐도 서로 다른 토픽 — 합치면 안 되는 일반어 */
const ALIAS_BLOCK = new Set(["artificialintelligence", "optimizer"]);

function aliasKeys(title: string): { key: string; strong: Set<string> } {
  const t = (title || "").trim();
  const key = bare(t);
  const strong = new Set<string>();
  if (/[)）]$/.test(t)) {
    const m = t.match(/[(（]([^)）]+)[)）]\s*$/);
    if (m) strong.add(norm(m[1]));
  }
  for (const k of [key, ...strong]) {
    const c = k.replace(GEN_SUFFIX, "");
    if (c.length >= 5) strong.add(c);
  }
  for (const k of [...strong]) {
    if (k.length < 5 || ALIAS_BLOCK.has(k)) strong.delete(k);
  }
  return { key, strong };
}

const TB_IDS = new Set<string>();
const TB_BY_KEY = new Map<string, TextbookSubnote>();
const TB_BY_ALIAS = new Map<string, TextbookSubnote>();
for (const s of SUBNOTES) {
  if (s.topicId) TB_IDS.add(s.topicId);
  const { key, strong } = aliasKeys(s.title);
  if (key && !TB_BY_KEY.has(key)) TB_BY_KEY.set(key, s);
  for (const a of strong) if (!TB_BY_ALIAS.has(a)) TB_BY_ALIAS.set(a, s);
}

/**
 * 예전 토픽(topics.json)이 교재에 이미 있는 토픽인지 — 있으면 그 서브노트를 준다.
 * 목록·카드·회독에서 예전 항목을 감추고 교재 쪽만 남기는 데 쓴다.
 */
export function subnoteByAlias(
  topicId?: string,
  title?: string,
): TextbookSubnote | undefined {
  if (topicId && TB_IDS.has(topicId)) {
    const hit = SUBNOTES.find((s) => s.topicId === topicId);
    if (hit) return hit;
  }
  if (!title) return undefined;
  const { key, strong } = aliasKeys(title);
  const byKey = key ? TB_BY_KEY.get(key) : undefined;
  if (byKey) return byKey;
  for (const a of strong) {
    const hit = TB_BY_ALIAS.get(a);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * 제목으로 교재 서브노트를 찾는다.
 * ★정확 일치를 먼저★ — '단편화'와 '메모리 단편화'처럼 포함 관계인 제목이 서로를
 * 잘못 물어가지 않게 한다(느슨한 일치는 정확 일치가 없을 때만).
 */
export function subnoteByTitle(title?: string): TextbookSubnote | undefined {
  const raw = title || "";
  const t = norm(raw);
  if (!t) return undefined;
  const tb = bare(raw);
  return (
    SUBNOTES.find((s) => norm(s.title) === t) ||
    (tb ? SUBNOTES.find((s) => bare(s.title) === tb) : undefined) ||
    // 느슨한 포함 매칭은 짧은 문자열에서 오탐이 크다("x" 가 "context"에 걸리는 식).
    // 4글자 이상 + 아래 okLoose() 관문을 통과할 때만 허용한다.
    (t.length >= 4
      ? SUBNOTES.find((s) => {
          const n = norm(s.title);
          if (n.includes(t)) return okLoose(raw, s.title);
          if (t.includes(n)) return okLoose(s.title, raw);
          // 괄호 영문을 지운 형태끼리 — "데이터 거버넌스(Data Governance)" ↔
          // "데이터 거버넌스, 데이터 품질" 같은 결합 토픽명을 구제한다.
          const nb = bare(s.title);
          if (nb.length >= 4 && tb.includes(nb)) return okLoose(s.title, raw);
          if (tb.length >= 4 && nb.includes(tb)) return okLoose(raw, s.title);
          return false;
        })
      : undefined)
  );
}

/** 교재 서브노트를 프롬프트용 근거 텍스트로 변환. */
export function subnoteAsText(s: TextbookSubnote): string {
  const parts = [`[교재 원본 — ${s.title}]`, `정의: ${s.definition}`];
  if (s.keywords.length) parts.push(`키워드: ${s.keywords.join(", ")}`);
  for (const tb of s.tables) {
    parts.push(`\n[${tb.caption}]`);
    parts.push(tb.headers.join(" | "));
    for (const r of tb.rows) parts.push(r.join(" | "));
  }
  if (s.notes?.length) parts.push(`\n비고: ${s.notes.join(" / ")}`);
  return parts.join("\n");
}
